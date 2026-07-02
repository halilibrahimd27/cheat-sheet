"use strict";
// API smoke tests. Runs the real Express app against an isolated temp data dir
// so it never touches your real database. No external test deps — node:test only.
const test = require("node:test");
const assert = require("node:assert");
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

// Isolate persistence BEFORE requiring the app.
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "cheatsheet-test-"));
process.env.DATA_DIR = TMP;

const app = require("../server.js");

let server, base;
test.before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app).listen(0, "127.0.0.1", resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(TMP, { recursive: true, force: true });
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
  return { status: res.status, json, text };
}

// 1x1 transparent PNG.
const PNG_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

test("GET /api/categories returns the seeded data", async () => {
  const r = await api("GET", "/api/categories");
  assert.strictEqual(r.status, 200);
  assert.ok(Array.isArray(r.json));
  assert.ok(r.json.length > 0, "expected seeded categories");
});

test("category → subcategory → command CRUD lifecycle", async () => {
  // Create category (note the XSS-y name to ensure it round-trips as data).
  const c = await api("POST", "/api/categories", { name: 'Test <b>Cat</b>', icon: "🧪" });
  assert.strictEqual(c.status, 201);
  const id = c.json.id;
  assert.strictEqual(id, "test-b-cat-b");

  // Duplicate id rejected.
  const dup = await api("POST", "/api/categories", { name: 'Test <b>Cat</b>' });
  assert.strictEqual(dup.status, 409);

  // Subcategory.
  const s = await api("POST", `/api/categories/${id}/subcategories`, { name: "Sub" });
  assert.strictEqual(s.status, 201);

  // Command.
  const cmd = await api("POST", `/api/categories/${id}/subcategories/0/commands`, {
    title: "Ping", desc: "desc", cmd: "ping <TARGET_IP>", tags: ["essential"],
  });
  assert.strictEqual(cmd.status, 201);

  // Update command.
  const upd = await api("PUT", `/api/categories/${id}/subcategories/0/commands/0`, { title: "Ping2" });
  assert.strictEqual(upd.status, 200);
  assert.strictEqual(upd.json.title, "Ping2");

  // Delete command, subcategory missing → 404 path check, then category.
  assert.strictEqual((await api("DELETE", `/api/categories/${id}/subcategories/0/commands/0`)).status, 200);
  assert.strictEqual((await api("DELETE", `/api/categories/${id}`)).status, 200);
  assert.strictEqual((await api("DELETE", `/api/categories/${id}`)).status, 404);
});

test("POST /api/categories requires a name", async () => {
  const r = await api("POST", "/api/categories", { icon: "x" });
  assert.strictEqual(r.status, 400);
});

test("/api/import rejects malformed payloads", async () => {
  assert.strictEqual((await api("POST", "/api/import", { categories: "nope" })).status, 400);
  assert.strictEqual((await api("POST", "/api/import", [{ id: 1 }])).status, 400);
  assert.strictEqual((await api("POST", "/api/import", { junk: true })).status, 400);
});

test("/api/import accepts a valid category array", async () => {
  const valid = [{ id: "x", name: "X", icon: "x", description: "", subcategories: [] }];
  const r = await api("POST", "/api/import", valid);
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.json.categories, 1);
});

test("/api/upload validates by content, not filename", async () => {
  // Real PNG accepted.
  const ok = await api("POST", "/api/upload", { data: PNG_B64, filename: "a.png" });
  assert.strictEqual(ok.status, 200);
  assert.match(ok.json.url, /^\/uploads\/.+\.png$/);

  // Non-image bytes rejected even with an image filename.
  const txt = Buffer.from("hello world").toString("base64");
  assert.strictEqual((await api("POST", "/api/upload", { data: txt, filename: "evil.png" })).status, 400);

  // SVG rejected (script-carrying vector).
  const svg = Buffer.from("<svg onload=alert(1)></svg>").toString("base64");
  assert.strictEqual((await api("POST", "/api/upload", { data: svg, filename: "x.svg" })).status, 400);
});

test("GET /api/export returns the full bundle", async () => {
  const r = await api("GET", "/api/export");
  assert.strictEqual(r.status, 200);
  for (const k of ["categories", "notes", "writeups", "machines"]) {
    assert.ok(k in r.json, `export missing ${k}`);
  }
});

test("security headers are present", async () => {
  const res = await fetch(base + "/api/categories");
  assert.strictEqual(res.headers.get("x-content-type-options"), "nosniff");
});

// ── Batch 1: correctness & hardening ──

test("GET /api/health returns ok", async () => {
  const r = await api("GET", "/api/health");
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.json.status, "ok");
});

test("POST /api/categories rejects a non-string name (no 500 crash)", async () => {
  const r = await api("POST", "/api/categories", { name: 123 });
  assert.strictEqual(r.status, 400);
  assert.ok(r.json && r.json.error, "expected a JSON error body");
});

test("POST /api/categories rejects a name that reduces to an empty id", async () => {
  const r = await api("POST", "/api/categories", { name: "###" });
  assert.strictEqual(r.status, 400);
});

test("unknown /api/* route returns JSON 404, not the SPA HTML", async () => {
  const res = await fetch(base + "/api/definitely-not-a-route");
  assert.strictEqual(res.status, 404);
  assert.match(res.headers.get("content-type") || "", /application\/json/);
  const body = await res.json();
  assert.ok(body.error);
});

test("index params reject non-integer junk (strict parseIndex)", async () => {
  const c = await api("POST", "/api/categories", { name: "IdxTest" });
  assert.strictEqual(c.status, 201);
  const id = c.json.id;
  await api("POST", `/api/categories/${id}/subcategories`, { name: "Sub" });
  // "1abc" used to parseInt to 1; "0.9" to 0. Both must now 404.
  assert.strictEqual((await api("PUT", `/api/categories/${id}/subcategories/1abc`, { name: "x" })).status, 404);
  assert.strictEqual((await api("POST", `/api/categories/${id}/subcategories/0.9/commands`, { title: "x", cmd: "x" })).status, 404);
  await api("DELETE", `/api/categories/${id}`);
});

test("malformed JSON body returns a JSON 400, not an HTML error page", async () => {
  const res = await fetch(base + "/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{ not valid json",
  });
  assert.strictEqual(res.status, 400);
  assert.match(res.headers.get("content-type") || "", /application\/json/);
});

test("notes CRUD lifecycle with empty-array cleanup", async () => {
  const catId = "notes-test-cat";
  const post = await api("POST", `/api/notes/${catId}`, { text: "first note" });
  assert.strictEqual(post.status, 201);
  const noteId = post.json.id;
  assert.strictEqual((await api("GET", `/api/notes/${catId}`)).json.length, 1);

  const upd = await api("PUT", `/api/notes/${catId}/${noteId}`, { text: "edited" });
  assert.strictEqual(upd.status, 200);
  assert.strictEqual(upd.json.text, "edited");

  assert.strictEqual((await api("DELETE", `/api/notes/${catId}/${noteId}`)).status, 200);
  // Empty array is cleaned up → GET returns [].
  assert.strictEqual((await api("GET", `/api/notes/${catId}`)).json.length, 0);
});

test("notes reject unsafe object-key catId (proto pollution)", async () => {
  assert.strictEqual((await api("POST", "/api/notes/__proto__", { text: "x" })).status, 400);
});

test("writeups CRUD lifecycle", async () => {
  assert.strictEqual((await api("POST", "/api/writeups", {})).status, 400);
  const post = await api("POST", "/api/writeups", { title: "HTB Box", tags: ["htb"], content: "# notes" });
  assert.strictEqual(post.status, 201);
  const id = post.json.id;
  assert.ok((await api("GET", "/api/writeups")).json.some((w) => w.id === id));
  const upd = await api("PUT", `/api/writeups/${id}`, { title: "HTB Box (rooted)" });
  assert.strictEqual(upd.json.title, "HTB Box (rooted)");
  assert.strictEqual((await api("DELETE", `/api/writeups/${id}`)).status, 200);
});

test("machines CRUD lifecycle seeds the 11-step checklist", async () => {
  assert.strictEqual((await api("POST", "/api/machines", {})).status, 400);
  const post = await api("POST", "/api/machines", { name: "target01", ip: "10.10.10.5", os: "linux" });
  assert.strictEqual(post.status, 201);
  assert.strictEqual(post.json.checklist.length, 11);
  const id = post.json.id;
  const upd = await api("PUT", `/api/machines/${id}`, { ip: "10.10.10.9" });
  assert.strictEqual(upd.json.ip, "10.10.10.9");
  // New engagement fields (template / AD hosts / attack path) persist.
  const upd2 = await api("PUT", `/api/machines/${id}`, {
    template: "linux-privesc",
    hosts: [{
      id: "h1", name: "DC01", ip: "10.10.10.2", os: "Windows", role: "DC", owned: true,
      template: "ad", links: ["h2"], loot: "administrator:hash", notes: "pwned",
      checklist: [{ id: "ad-0-0", label: "Recon DC", phase: "Recon", done: true }],
    }],
    attackPath: "foothold -> kerberoast -> DCSync -> DA",
  });
  assert.strictEqual(upd2.json.template, "linux-privesc");
  assert.strictEqual(upd2.json.hosts.length, 1);
  // Full AD-host sub-schema (checklist / links / role) round-trips.
  assert.strictEqual(upd2.json.hosts[0].checklist.length, 1);
  assert.strictEqual(upd2.json.hosts[0].links[0], "h2");
  assert.strictEqual(upd2.json.hosts[0].role, "DC");
  assert.strictEqual(upd2.json.attackPath, "foothold -> kerberoast -> DCSync -> DA");
  assert.strictEqual((await api("DELETE", `/api/machines/${id}`)).status, 200);
});

test("machine metadata (platform/difficulty/status/tags/flags/timing) round-trips", async () => {
  // Defaults on create.
  const post = await api("POST", "/api/machines", { name: "meta01", platform: "HTB", difficulty: "Easy", tags: ["smb", "cve"] });
  assert.strictEqual(post.status, 201);
  assert.strictEqual(post.json.platform, "HTB");
  assert.strictEqual(post.json.difficulty, "Easy");
  assert.strictEqual(post.json.status, "not-started");
  assert.deepStrictEqual(post.json.tags, ["smb", "cve"]);
  assert.deepStrictEqual(post.json.userFlag, { value: "", capturedAt: null });
  assert.deepStrictEqual(post.json.rootFlag, { value: "", capturedAt: null });
  assert.strictEqual(post.json.startedAt, null);
  assert.strictEqual(post.json.ownedAt, null);
  const id = post.json.id;
  // Non-string tags are filtered out; unknown platform falls back to "Custom".
  const p2 = await api("POST", "/api/machines", { name: "meta02", tags: ["ok", 5, null] });
  assert.deepStrictEqual(p2.json.tags, ["ok"]);
  assert.strictEqual(p2.json.platform, "Custom");
  // Flags + status + timing are writable via PUT.
  const upd = await api("PUT", `/api/machines/${id}`, {
    status: "owned",
    userFlag: { value: "u", capturedAt: "2026-07-02T09:00:00Z" },
    rootFlag: { value: "r", capturedAt: "2026-07-02T10:00:00Z" },
    startedAt: "2026-07-02T08:00:00Z",
    ownedAt: "2026-07-02T10:00:00Z",
  });
  assert.strictEqual(upd.json.status, "owned");
  assert.strictEqual(upd.json.userFlag.value, "u");
  assert.strictEqual(upd.json.rootFlag.capturedAt, "2026-07-02T10:00:00Z");
  assert.strictEqual(upd.json.ownedAt, "2026-07-02T10:00:00Z");
});

test("write-up relatedMachine field round-trips", async () => {
  const post = await api("POST", "/api/writeups", { title: "linked", tags: ["HTB"], content: "# x" });
  assert.strictEqual(post.status, 201);
  const id = post.json.id;
  const upd = await api("PUT", `/api/writeups/${id}`, { relatedMachine: "m-abc123" });
  assert.strictEqual(upd.status, 200);
  assert.strictEqual(upd.json.relatedMachine, "m-abc123");
  // It survives a round-trip through the collection.
  const list = await api("GET", "/api/writeups");
  assert.strictEqual(list.json.find((w) => w.id === id).relatedMachine, "m-abc123");
});

test("POST /api/reset restores seed categories", async () => {
  const r = await api("POST", "/api/reset");
  assert.strictEqual(r.status, 200);
  assert.ok((await api("GET", "/api/categories")).json.length > 0);
});

// ── Stable ids + reorder ──

test("new subcategories and commands get stable ids", async () => {
  const c = await api("POST", "/api/categories", { name: "IdStable" });
  const id = c.json.id;
  const s = await api("POST", `/api/categories/${id}/subcategories`, { name: "Sub" });
  assert.ok(typeof s.json.id === "string" && s.json.id.length > 0, "subcategory id");
  const cmd = await api("POST", `/api/categories/${id}/subcategories/0/commands`, { title: "T", cmd: "x" });
  assert.ok(typeof cmd.json.id === "string" && cmd.json.id.length > 0, "command id");
  await api("DELETE", `/api/categories/${id}`);
});

test("seed data is backfilled with stable ids on read", async () => {
  const cats = (await api("GET", "/api/categories")).json;
  const cat = cats.find((c) => (c.subcategories || []).some((s) => (s.commands || []).length));
  assert.ok(cat, "expected a seeded category with commands");
  const sub = cat.subcategories.find((s) => s.commands.length);
  assert.ok(typeof sub.id === "string" && sub.id.length > 0, "subcategory backfilled id");
  assert.ok(typeof sub.commands[0].id === "string" && sub.commands[0].id.length > 0, "command backfilled id");
});

test("POST /api/categories/reorder moves categories and validates input", async () => {
  const a = await api("POST", "/api/categories", { name: "ReorderA" });
  const b = await api("POST", "/api/categories", { name: "ReorderB" });
  const ids = (await api("GET", "/api/categories")).json.map((c) => c.id);
  const rest = ids.filter((x) => x !== a.json.id && x !== b.json.id);
  const order = [b.json.id, a.json.id].concat(rest); // force b before a
  assert.strictEqual((await api("POST", "/api/categories/reorder", { order })).status, 200);
  const after = (await api("GET", "/api/categories")).json.map((c) => c.id);
  assert.ok(after.indexOf(b.json.id) < after.indexOf(a.json.id), "b now precedes a");
  assert.strictEqual((await api("POST", "/api/categories/reorder", { order: "nope" })).status, 400);
  await api("DELETE", `/api/categories/${a.json.id}`);
  await api("DELETE", `/api/categories/${b.json.id}`);
});
