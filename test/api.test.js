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
