"use strict";
// Differential test: public/local-backend.js against server.js.
//
// local-backend.js is the COMPLETE backend of the only publicly deployed build
// (GitHub Pages), and it re-implements the server's REST contract by hand. Two
// hand-written copies of one contract drift, silently, and the drift only shows
// up for the users who cannot report it. So every route is replayed against both
// and the status and body are required to match.
//
// The table below is the contract. Covering a new route is one more entry.
const test = require("node:test");
const assert = require("node:assert");
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { scrubProcessEnv } = require("./helpers/env.js");
const { loadLocalBackend } = require("./helpers/load-local-backend.js");

// Loading the browser stub replaces globalThis.fetch with the one app.js expects,
// so hold on to the real one before that happens — this file is the only place
// that talks to a live HTTP server AND to the in-browser backend.
const realFetch = globalThis.fetch.bind(globalThis);

scrubProcessEnv();
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "cheatsheet-diff-"));
process.env.DATA_DIR = TMP;
const app = require("../server.js");

// Both backends start from this, so any difference in the replay is theirs.
const FIXTURE = [
  {
    id: "recon", name: "Reconnaissance", icon: "🔍", description: "Enumeration",
    subcategories: [{
      id: "s-ports", name: "Port Scanning",
      commands: [{ id: "c-nmap", title: "Nmap full scan", desc: "", cmd: "nmap -p- <RHOST>", tags: ["essential"] }],
    }],
  },
  { id: "web", name: "Web Application", icon: "🌐", description: "", subcategories: [] },
];

// 1x1 transparent PNG.
const PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const SVG_B64 = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>').toString("base64");
const OVERSIZE_B64 = Buffer.concat([Buffer.from("BM"), Buffer.alloc(6 * 1024 * 1024, 0x41)]).toString("base64");

// ── The contract table ──
// url/body may be functions of a per-backend context so a case can act on an id
// the previous case created (ids are generated independently on each side).
const CASES = [
  { name: "GET /api/health", method: "GET", url: "/api/health" },
  { name: "GET /api/categories", method: "GET", url: "/api/categories" },

  { name: "POST /api/categories creates", method: "POST", url: "/api/categories", body: { name: "New Cat", icon: "🧪" } },
  { name: "POST /api/categories duplicate → 409", method: "POST", url: "/api/categories", body: { name: "New Cat" } },
  { name: "POST /api/categories without a name → 400", method: "POST", url: "/api/categories", body: {} },
  { name: "POST /api/categories with a non-string name → 400", method: "POST", url: "/api/categories", body: { name: 123 } },
  { name: "POST /api/categories with an unsluggable name → 400", method: "POST", url: "/api/categories", body: { name: "###" } },

  { name: "PUT /api/categories/:id updates", method: "PUT", url: "/api/categories/new-cat", body: { name: "Renamed", description: "d" } },
  { name: "PUT /api/categories/:id blank name → 400", method: "PUT", url: "/api/categories/new-cat", body: { name: "  " } },
  { name: "PUT /api/categories/:id non-string description → 400", method: "PUT", url: "/api/categories/new-cat", body: { description: 5 } },
  { name: "PUT /api/categories/:id unknown → 404", method: "PUT", url: "/api/categories/no-such-cat", body: { name: "x" } },
  { name: "DELETE /api/categories/:id unknown → 404", method: "DELETE", url: "/api/categories/no-such-cat", body: {} },

  { name: "POST subcategory creates", method: "POST", url: "/api/categories/new-cat/subcategories", body: { name: "Sub" } },
  { name: "POST subcategory without a name → 400", method: "POST", url: "/api/categories/new-cat/subcategories", body: {} },
  { name: "POST subcategory under an unknown category → 404", method: "POST", url: "/api/categories/nope/subcategories", body: { name: "S" } },
  { name: "PUT subcategory renames", method: "PUT", url: "/api/categories/new-cat/subcategories/0", body: { name: "Sub renamed" } },
  { name: "PUT subcategory blank name → 400", method: "PUT", url: "/api/categories/new-cat/subcategories/0", body: { name: " " } },
  { name: "PUT subcategory out of range → 404", method: "PUT", url: "/api/categories/new-cat/subcategories/9", body: { name: "x" } },
  { name: "PUT subcategory with a non-integer index → 404", method: "PUT", url: "/api/categories/new-cat/subcategories/0abc", body: { name: "x" } },

  { name: "POST command creates", method: "POST", url: "/api/categories/new-cat/subcategories/0/commands", body: { title: "Ping", desc: "d", cmd: "ping <RHOST>", tags: ["essential"], attack: ["T1018"], ref: "https://example.test" } },
  { name: "POST command without a title → 400", method: "POST", url: "/api/categories/new-cat/subcategories/0/commands", body: { cmd: "x" } },
  { name: "POST command under an unknown subcategory → 404", method: "POST", url: "/api/categories/new-cat/subcategories/9/commands", body: { title: "T" } },
  { name: "PUT command updates", method: "PUT", url: "/api/categories/new-cat/subcategories/0/commands/0", body: { title: "Ping2", cmds: ["a", "b"] } },
  { name: "PUT command clears attack", method: "PUT", url: "/api/categories/new-cat/subcategories/0/commands/0", body: { attack: [], refs: [], ref: "" } },
  { name: "PUT command out of range → 404", method: "PUT", url: "/api/categories/new-cat/subcategories/0/commands/9", body: { title: "x" } },
  { name: "DELETE command", method: "DELETE", url: "/api/categories/new-cat/subcategories/0/commands/0", body: {} },
  { name: "DELETE subcategory", method: "DELETE", url: "/api/categories/new-cat/subcategories/0", body: {} },
  { name: "DELETE category", method: "DELETE", url: "/api/categories/new-cat", body: {} },
  { name: "DELETE category again → 404", method: "DELETE", url: "/api/categories/new-cat", body: {} },

  { name: "POST /api/categories/reorder", method: "POST", url: "/api/categories/reorder", body: { order: ["web", "recon"] } },
  { name: "POST /api/categories/reorder with a non-array → 400", method: "POST", url: "/api/categories/reorder", body: { order: "nope" } },
  { name: "GET /api/categories reflects the reorder", method: "GET", url: "/api/categories" },

  { name: "GET /api/notes empty", method: "GET", url: "/api/notes" },
  { name: "POST note", method: "POST", url: "/api/notes/recon", body: { text: "first note" }, capture: (j, ctx) => { ctx.noteId = j && j.id; } },
  { name: "POST note with an unsafe catId → 400", method: "POST", url: "/api/notes/__proto__", body: { text: "x" } },
  { name: "POST note with an uppercase catId → 400", method: "POST", url: "/api/notes/Recon", body: { text: "x" } },
  { name: "POST note with a non-string text → 400", method: "POST", url: "/api/notes/recon", body: { text: 123 } },
  { name: "GET notes for a category", method: "GET", url: "/api/notes/recon" },
  { name: "GET notes for an unsafe catId → []", method: "GET", url: "/api/notes/__proto__" },
  { name: "PUT note", method: "PUT", url: (ctx) => "/api/notes/recon/" + ctx.noteId, body: { text: "edited" } },
  // The drift this whole file exists for: the server rejects a non-string note
  // text, and the static build used to persist it and then render [object Object].
  { name: "PUT note with a non-string text → 400", method: "PUT", url: (ctx) => "/api/notes/recon/" + ctx.noteId, body: { text: { evil: true } } },
  { name: "PUT note unknown id → 404", method: "PUT", url: "/api/notes/recon/no-such-note", body: { text: "x" } },
  { name: "PUT note unsafe catId → 404", method: "PUT", url: "/api/notes/__proto__/x", body: { text: "x" } },
  { name: "DELETE note", method: "DELETE", url: (ctx) => "/api/notes/recon/" + ctx.noteId, body: {} },
  { name: "GET notes after the last one is deleted", method: "GET", url: "/api/notes/recon" },
  { name: "DELETE note with an unsafe catId → ok", method: "DELETE", url: "/api/notes/__proto__/x", body: {} },

  { name: "GET /api/writeups empty", method: "GET", url: "/api/writeups" },
  { name: "POST write-up without a title → 400", method: "POST", url: "/api/writeups", body: {} },
  { name: "POST write-up with non-string tags → 400", method: "POST", url: "/api/writeups", body: { title: "W", tags: [1] } },
  { name: "POST write-up with non-string content → 400", method: "POST", url: "/api/writeups", body: { title: "W", content: 5 } },
  { name: "POST write-up", method: "POST", url: "/api/writeups", body: { title: "HTB Box", tags: ["htb"], content: "# notes" }, capture: (j, ctx) => { ctx.wuId = j && j.id; } },
  { name: "PUT write-up", method: "PUT", url: (ctx) => "/api/writeups/" + ctx.wuId, body: { title: "HTB Box (rooted)", relatedMachine: "m-1" } },
  { name: "PUT write-up unknown → 404", method: "PUT", url: "/api/writeups/no-such-writeup", body: { title: "x" } },
  { name: "DELETE write-up", method: "DELETE", url: (ctx) => "/api/writeups/" + ctx.wuId, body: {} },
  { name: "GET /api/writeups after delete", method: "GET", url: "/api/writeups" },

  { name: "GET /api/machines empty", method: "GET", url: "/api/machines" },
  { name: "POST machine without a name → 400", method: "POST", url: "/api/machines", body: {} },
  { name: "POST machine", method: "POST", url: "/api/machines", body: { name: "target01", ip: "10.10.10.5", os: "linux", platform: "HTB", difficulty: "Easy", tags: ["smb", 5, null] }, capture: (j, ctx) => { ctx.mId = j && j.id; } },
  { name: "PUT machine", method: "PUT", url: (ctx) => "/api/machines/" + ctx.mId, body: { ip: "10.10.10.9", template: "linux-privesc", attackPath: "a -> b", status: "owned" } },
  { name: "PUT machine unknown → 404", method: "PUT", url: "/api/machines/no-such-machine", body: { ip: "1" } },
  { name: "DELETE machine", method: "DELETE", url: (ctx) => "/api/machines/" + ctx.mId, body: {} },
  { name: "GET /api/machines after delete", method: "GET", url: "/api/machines" },

  { name: "POST /api/upload without data → 400", method: "POST", url: "/api/upload", body: {} },
  { name: "POST /api/upload with a non-string data → 400", method: "POST", url: "/api/upload", body: { data: 5 } },
  { name: "POST /api/upload with an SVG → 400", method: "POST", url: "/api/upload", body: { data: SVG_B64 } },
  { name: "POST /api/upload with non-image bytes → 400", method: "POST", url: "/api/upload", body: { data: Buffer.from("hello world, not an image").toString("base64") } },
  { name: "POST /api/upload over 5MB → 413", method: "POST", url: "/api/upload", body: { data: OVERSIZE_B64 } },
  // The stored URL is deliberately different: the server writes a file and returns
  // /uploads/<id>.png, the static build returns a self-contained data: URI.
  { name: "POST /api/upload with a real PNG", method: "POST", url: "/api/upload", body: { data: PNG_B64 }, compare: "status" },

  { name: "POST /api/import with a non-array categories → 400", method: "POST", url: "/api/import", body: { categories: "nope" } },
  { name: "POST /api/import with a malformed bare array → 400", method: "POST", url: "/api/import", body: [{ id: 1 }] },
  { name: "POST /api/import with nothing to import → 400", method: "POST", url: "/api/import", body: { junk: true } },
  { name: "POST /api/import with a null machine → 400", method: "POST", url: "/api/import", body: { machines: [null] } },
  { name: "POST /api/import with a machine missing its id → 400", method: "POST", url: "/api/import", body: { machines: [{ name: "no id" }] } },
  { name: "POST /api/import with an unsafe notes key → 400", method: "POST", url: "/api/import", body: { notes: { BAD: [] } } },
  { name: "POST /api/import with a malformed note → 400", method: "POST", url: "/api/import", body: { notes: { recon: [{ id: "n", text: 5 }] } } },
  { name: "POST /api/import with non-string writeup tags → 400", method: "POST", url: "/api/import", body: { writeups: [{ id: "w", title: "t", tags: [1] }] } },
  { name: "POST /api/import restores the fixture", method: "POST", url: "/api/import", body: { categories: FIXTURE, notes: {}, writeups: [], machines: [] } },
  { name: "GET /api/categories after import", method: "GET", url: "/api/categories" },

  { name: "GET /api/nope → 404", method: "GET", url: "/api/nope" },
  { name: "POST /api/nope → 404", method: "POST", url: "/api/nope", body: {} },
  { name: "GET /api/exam", method: "GET", url: "/api/exam" },
  { name: "PUT /api/exam", method: "PUT", url: "/api/exam", body: { started: "2026-07-02T08:00:00Z" } },
  { name: "GET /api/seed-status", method: "GET", url: "/api/seed-status", compare: "status" },

  // Last on purpose: the server resets to the 5000-command seed.js and the static
  // build to whatever CS_SEED the page bundled, so only the status can match.
  { name: "POST /api/reset", method: "POST", url: "/api/reset", body: {}, compare: "status" },
];

// Generated ids and timestamps differ by construction; the dedicated tests below
// assert their SHAPE instead. Everything else must be identical.
const VOLATILE = new Set(["id", "createdAt", "updatedAt", "uptime", "mode", "idsRegenerated", "uploads"]);
function normalize(v) {
  if (Array.isArray(v)) return v.map(normalize);
  if (v && typeof v === "object") {
    const out = {};
    for (const k of Object.keys(v).sort()) {
      if (VOLATILE.has(k)) continue;
      out[k] = normalize(v[k]);
    }
    return out;
  }
  return v;
}

let server, base, backend;
const replayed = (async () => {
  await new Promise((resolve) => { server = http.createServer(app).listen(0, "127.0.0.1", resolve); });
  base = "http://127.0.0.1:" + server.address().port;
  // Align the starting state: the server boots from seed.js, so import the fixture.
  await sendExpress("POST", "/api/import", { categories: FIXTURE, notes: {}, writeups: [], machines: [] });
  backend = loadLocalBackend(FIXTURE).backend;

  const express = await replay(sendExpress);
  const local = await replay(sendLocal);
  return { express, local };
})();

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(TMP, { recursive: true, force: true });
});

async function sendExpress(method, url, body) {
  const res = await realFetch(base + url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* non-JSON */ }
  return { status: res.status, json };
}

async function sendLocal(method, url, body) {
  const r = await backend.request(method, url, body);
  // Cross the realm boundary the same way HTTP does, so deepStrictEqual compares
  // values rather than prototypes.
  return { status: r.status, json: r.json === undefined ? null : JSON.parse(JSON.stringify(r.json)) };
}

async function replay(send) {
  const ctx = {};
  const out = [];
  for (const c of CASES) {
    const url = typeof c.url === "function" ? c.url(ctx) : c.url;
    const body = typeof c.body === "function" ? c.body(ctx) : c.body;
    let r;
    try { r = await send(c.method, url, body); }
    catch (e) { r = { status: -1, json: { threw: String(e && e.message) } }; }
    if (c.capture) c.capture(r.json, ctx);
    out.push(r);
  }
  return out;
}

CASES.forEach((c, i) => {
  test("static build matches the server: " + c.name, async () => {
    const { express, local } = await replayed;
    const e = express[i], l = local[i];
    assert.strictEqual(l.status, e.status,
      `${c.method} ${typeof c.url === "function" ? "(dynamic)" : c.url}\n  server: ${e.status} ${JSON.stringify(e.json)}\n  static: ${l.status} ${JSON.stringify(l.json)}`);
    if (c.compare === "status") return;
    assert.deepStrictEqual(normalize(l.json), normalize(e.json),
      `${c.method} ${typeof c.url === "function" ? "(dynamic)" : c.url} body differs`);
  });
});

// ── Contract details the table deliberately normalises away ──

test("both backends derive the same slug id from a category name", async () => {
  await replayed;
  const name = "Test <b>Cat</b> 42";
  const e = await sendExpress("POST", "/api/categories", { name });
  const l = await sendLocal("POST", "/api/categories", { name });
  assert.strictEqual(l.json.id, e.json.id);
  assert.strictEqual(e.json.id, "test-b-cat-b-42");
  await sendExpress("DELETE", "/api/categories/" + e.json.id, {});
  await sendLocal("DELETE", "/api/categories/" + l.json.id, {});
});

test("both backends mint ids that are safe to put in an HTML attribute", async () => {
  await replayed;
  for (const send of [sendExpress, sendLocal]) {
    const cat = await send("POST", "/api/categories", { name: "Id Shape" });
    const sub = await send("POST", "/api/categories/id-shape/subcategories", { name: "S" });
    const cmd = await send("POST", "/api/categories/id-shape/subcategories/0/commands", { title: "T", cmd: "id" });
    const note = await send("POST", "/api/notes/id-shape", { text: "n" });
    const wu = await send("POST", "/api/writeups", { title: "W" });
    const mach = await send("POST", "/api/machines", { name: "M" });
    for (const [what, r] of [["category", cat], ["subcategory", sub], ["command", cmd], ["note", note], ["writeup", wu], ["machine", mach]]) {
      assert.match(r.json.id, /^[A-Za-z0-9_-]{1,64}$/, what + " id " + JSON.stringify(r.json.id));
    }
    await send("DELETE", "/api/categories/id-shape", {});
    await send("DELETE", "/api/writeups/" + wu.json.id, {});
    await send("DELETE", "/api/machines/" + mach.json.id, {});
    await send("DELETE", "/api/notes/id-shape/" + note.json.id, {});
  }
});

test("both backends refuse an imported id that could break out of an attribute", async () => {
  await replayed;
  const bundle = {
    categories: [{
      id: "importsafe", name: "Import Safe", icon: "📦", description: "", subcategories: [
        { id: "s1", name: "Sub", commands: [{ id: 'a" onmouseover="x', title: "T", cmd: "id" }] },
      ],
    }],
  };
  for (const [label, send] of [["server", sendExpress], ["static build", sendLocal]]) {
    const r = await send("POST", "/api/import", JSON.parse(JSON.stringify(bundle)));
    if (r.status === 400) continue; // rejecting the bundle outright is also correct
    const cats = (await send("GET", "/api/categories")).json;
    const cmd = cats.find((c) => c.id === "importsafe").subcategories[0].commands[0];
    assert.match(cmd.id, /^[A-Za-z0-9_-]+$/, label + " stored an unsafe imported id: " + JSON.stringify(cmd.id));
  }
});

test("both backends export the same four core collections", async () => {
  await replayed;
  const e = (await sendExpress("GET", "/api/export")).json;
  const l = (await sendLocal("GET", "/api/export")).json;
  for (const k of ["categories", "notes", "writeups", "machines"]) {
    assert.ok(k in e, "server export missing " + k);
    assert.ok(k in l, "static export missing " + k);
  }
});

test("the static backend actually persists to IndexedDB, not just to its cache", async () => {
  await replayed;
  const created = await sendLocal("POST", "/api/machines", { name: "persisted" });
  // A fresh module evaluation shares the stub database but starts with an empty
  // in-memory cache — if the write never reached the store, this comes back empty.
  const { backend: reopened } = loadLocalBackendReusingStore();
  const machines = (await reopened.request("GET", "/api/machines")).json;
  assert.ok(machines.some((m) => m.id === created.json.id), "the machine did not survive a reload");
});

// loadLocalBackend() installs a brand-new stub database each time, which is what
// every other test wants; this reuses the one already open so a reload can be
// observed.
function loadLocalBackendReusingStore() {
  const existing = globalThis.indexedDB;
  const vm = require("vm");
  globalThis.window.CS_BACKEND = undefined;
  vm.runInThisContext(fs.readFileSync(path.join(__dirname, "..", "public", "local-backend.js"), "utf8"), { filename: "local-backend.js" });
  assert.strictEqual(globalThis.indexedDB, existing);
  const backend2 = globalThis.window.CS_BACKEND;
  backend = backend2; // later cases keep talking to the live instance
  return { backend: backend2 };
}
