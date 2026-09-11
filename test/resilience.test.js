"use strict";
// Crash-safety and recovery. The product promises atomic writes with .bak
// recovery and a non-destructive content update; those promises are only worth
// anything if something proves them, and the failure mode when they break is a
// pentester losing a day of engagement notes.
const test = require("node:test");
const assert = require("node:assert");
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { scrubProcessEnv } = require("./helpers/env.js");

scrubProcessEnv();
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "cheatsheet-resilience-"));
process.env.DATA_DIR = TMP;
const app = require("../server.js");

let server, base;
test.before(async () => {
  await new Promise((resolve) => { server = http.createServer(app).listen(0, "127.0.0.1", resolve); });
  base = "http://127.0.0.1:" + server.address().port;
});
test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(TMP, { recursive: true, force: true });
});
test.beforeEach(async () => {
  await api("POST", "/api/reset");
  for (const name of fs.readdirSync(TMP)) {
    if (name === "commands.json" || name === "commands.json.bak" || name === "uploads" ||
      name === "meta.json" || name === "baseline.json") continue;
    fs.rmSync(path.join(TMP, name), { recursive: true, force: true });
  }
});

async function api(method, url, body) {
  const res = await fetch(base + url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* non-JSON */ }
  return { status: res.status, json, text, headers: res.headers };
}

const dataFile = (name) => path.join(TMP, name);

// ── Corruption recovery ──

test("a corrupt data file is recovered from its .bak copy", async () => {
  await api("POST", "/api/notes/recon", { text: "first" });
  await api("POST", "/api/notes/recon", { text: "second" }); // the second write makes the .bak
  assert.ok(fs.existsSync(dataFile("notes.json.bak")), "no .bak was written");

  fs.writeFileSync(dataFile("notes.json"), "{ this is not json", "utf8");
  const r = await api("GET", "/api/notes");
  assert.strictEqual(r.status, 200);
  // The .bak holds the state before the last write, so "first" survives — the
  // point is that a truncated write costs one note, not the whole file.
  assert.ok(r.json.recon && r.json.recon.length >= 1, "nothing was recovered: " + r.text);
  assert.strictEqual(r.json.recon[0].text, "first");
});

test("an unreadable file with no backup is quarantined, not silently overwritten", async () => {
  fs.writeFileSync(dataFile("writeups.json"), "<<<not json at all>>>", "utf8");
  fs.rmSync(dataFile("writeups.json.bak"), { force: true });

  const r = await api("GET", "/api/writeups");
  assert.strictEqual(r.status, 200);
  assert.deepStrictEqual(r.json, [], "an unreadable collection must read as empty, not 500");

  const quarantined = fs.readdirSync(TMP).filter((f) => /^writeups\.json\.corrupt-/.test(f));
  assert.strictEqual(quarantined.length, 1, "the unreadable bytes were not kept: " + fs.readdirSync(TMP).join(", "));
  assert.strictEqual(fs.readFileSync(path.join(TMP, quarantined[0]), "utf8"), "<<<not json at all>>>");
});

test("a missing file is simply empty — no warning, no quarantine", async () => {
  fs.rmSync(dataFile("machines.json"), { force: true });
  assert.deepStrictEqual((await api("GET", "/api/machines")).json, []);
  assert.strictEqual(fs.readdirSync(TMP).some((f) => /machines\.json\.corrupt-/.test(f)), false);
});

test("a completed write leaves no .tmp file behind", async () => {
  await api("POST", "/api/machines", { name: "atomic" });
  const leftovers = fs.readdirSync(TMP).filter((f) => f.endsWith(".tmp"));
  assert.deepStrictEqual(leftovers, [], "a temp file survived a successful write");
});

test("a write-then-read round-trip keeps the file valid JSON on disk", async () => {
  await api("POST", "/api/machines", { name: "on-disk", ip: "10.10.10.5" });
  const raw = fs.readFileSync(dataFile("machines.json"), "utf8");
  const parsed = JSON.parse(raw); // throws if the write was not atomic
  assert.strictEqual(parsed[0].name, "on-disk");
});

// ── Non-destructive content update ──

// Pick a seeded subcategory with enough commands to mutate, plus a reader that
// re-fetches it after each request.
async function pickSubcategory() {
  const cats = (await api("GET", "/api/categories")).json;
  const cat = cats.find((c) => (c.subcategories || []).some((s) => (s.commands || []).length > 2));
  assert.ok(cat, "expected a seeded category with several commands");
  const sub = cat.subcategories.find((s) => s.commands.length > 2);
  const read = async () => (await api("GET", "/api/categories")).json
    .find((c) => c.id === cat.id).subcategories.find((s) => s.id === sub.id);
  return { cats, cat, sub, read };
}

test("POST /api/update restores seed commands an older install never received", async () => {
  const { cats, cat, sub, read } = await pickSubcategory();
  const originalCount = sub.commands.length;
  const dropped = sub.commands.slice(-2).map((c) => c.title);

  const modified = JSON.parse(JSON.stringify(cats));
  modified.find((c) => c.id === cat.id).subcategories.find((s) => s.id === sub.id).commands.splice(-2, 2);
  assert.strictEqual((await api("POST", "/api/import", { categories: modified })).status, 200);
  assert.strictEqual((await read()).commands.length, originalCount - 2);

  const upd = await api("POST", "/api/update", {});
  assert.strictEqual(upd.status, 200);
  assert.strictEqual(upd.json.dryRun, false);
  assert.strictEqual(upd.json.added, 2, "expected exactly the two missing commands: " + JSON.stringify(upd.json));

  const after = await read();
  assert.strictEqual(after.commands.length, originalCount, "the seed commands did not all come back");
  for (const title of dropped) {
    assert.ok(after.commands.some((c) => c.title === title), "never restored: " + title);
  }
});

test("POST /api/update keeps a renamed command instead of duplicating it", async () => {
  // Renaming a command is the most ordinary customisation there is. The update
  // must keep the rename AND still recognise the record as the seed's, or the
  // user gets a second copy of everything they ever retitled, on every update.
  const { cats, cat, sub, read } = await pickSubcategory();
  const originalCount = sub.commands.length;
  const originalIds = sub.commands.map((c) => c.id);

  const modified = JSON.parse(JSON.stringify(cats));
  modified.find((c) => c.id === cat.id).subcategories.find((s) => s.id === sub.id)
    .commands[0].title = "USER EDITED TITLE";
  assert.strictEqual((await api("POST", "/api/import", { categories: modified })).status, 200);

  assert.strictEqual((await api("POST", "/api/update", {})).status, 200);

  const after = await read();
  const kept = after.commands.find((c) => c.id === originalIds[0]);
  assert.ok(kept, "the renamed command lost its id — every favourite keyed to it would break");
  assert.strictEqual(kept.title, "USER EDITED TITLE", "an update must never overwrite the user's own edit");
  const added = after.commands.filter((c) => !originalIds.includes(c.id)).map((c) => c.title);
  assert.deepStrictEqual(added, [], "the renamed command was re-added under a new id");
  assert.strictEqual(after.commands.length, originalCount);
});

test("POST /api/update never deletes a category the user created", async () => {
  const mine = await api("POST", "/api/categories", { name: "My Own Notes" });
  assert.strictEqual(mine.status, 201);
  await api("POST", "/api/update", {});
  assert.ok((await api("GET", "/api/categories")).json.some((c) => c.id === mine.json.id),
    "a user-created category was removed by a content update");
});

test("seed-status reports no update available once the update has run", async () => {
  await api("POST", "/api/update", {});
  const s = await api("GET", "/api/seed-status");
  assert.strictEqual(s.json.updateAvailable, false);
  assert.strictEqual(s.json.current, s.json.latest);
});

// ── Export / import of evidence screenshots ──

const PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

test("an exported bundle carries the screenshots its write-ups reference", async () => {
  const up = await api("POST", "/api/upload", { data: PNG_B64 });
  assert.strictEqual(up.status, 200);
  const name = up.json.url.replace("/uploads/", "");
  await api("POST", "/api/writeups", { title: "With evidence", content: "![shot](" + up.json.url + ")" });

  const bundle = (await api("GET", "/api/export")).json;
  assert.ok(bundle.uploads && bundle.uploads[name], "the referenced screenshot is missing from the backup");
  assert.strictEqual(bundle.uploads[name], PNG_B64);

  // An unreferenced upload is NOT dragged along — the bundle stays the size of
  // the user's actual content.
  const orphan = await api("POST", "/api/upload", { data: PNG_B64 });
  const orphanName = orphan.json.url.replace("/uploads/", "");
  const bundle2 = (await api("GET", "/api/export")).json;
  assert.strictEqual(bundle2.uploads[orphanName], undefined);
});

test("importing screenshots trusts the bytes, never the name", async () => {
  const evil = {
    "../evil.png": PNG_B64,                                    // traversal
    "..%2fevil.png": PNG_B64,                                  // encoded traversal
    "a/b.png": PNG_B64,                                        // nested path
    "shell.php.png": Buffer.from("<?php system($_GET[0]); ?>").toString("base64"), // not an image
    "mismatch.jpg": PNG_B64,                                   // name disagrees with the bytes
    "empty.png": "",
  };
  const r = await api("POST", "/api/import", { writeups: [], uploads: evil });
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.json.uploads, 0, "an unsafe screenshot name was written to disk");
  // Nothing escaped the uploads directory, and nothing landed inside it either.
  assert.strictEqual(fs.existsSync(path.join(TMP, "evil.png")), false);
  assert.strictEqual(fs.existsSync(path.join(path.dirname(TMP), "evil.png")), false);
  for (const bad of ["shell.php.png", "mismatch.jpg", "empty.png"]) {
    assert.strictEqual(fs.existsSync(path.join(TMP, "uploads", bad)), false, bad + " was written");
  }

  // A well-formed entry does restore, and is then servable as an image.
  const good = await api("POST", "/api/import", { writeups: [], uploads: { "restored1.png": PNG_B64 } });
  assert.strictEqual(good.json.uploads, 1);
  const served = await fetch(base + "/uploads/restored1.png");
  assert.strictEqual(served.status, 200);
  assert.strictEqual(served.headers.get("x-content-type-options"), "nosniff");
});

// ── The terminal error handler ──

test("every failure reaches the client as JSON, never as an HTML error page", async () => {
  // An unsupported charset makes body-parser throw a type the handler does not
  // special-case — exactly the path that used to return Express's HTML page.
  const res = await fetch(base + "/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-32" },
    body: '{"name":"x"}',
  });
  assert.ok(res.status >= 400, "expected a failure, got " + res.status);
  assert.match(res.headers.get("content-type") || "", /application\/json/);
  const body = await res.json();
  assert.ok(body.error, "the error body must carry an {error} field: " + JSON.stringify(body));
  assert.doesNotMatch(JSON.stringify(body), /at Object|node_modules|\\\\/, "an internal stack trace leaked to the client");
});
