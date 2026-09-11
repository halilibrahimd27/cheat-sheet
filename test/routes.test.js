"use strict";
// The routes and error paths api.test.js never touches: the two CRUD endpoints
// with zero coverage (PUT /api/categories/:id and DELETE .../subcategories/:idx),
// the collection GETs, the SPA fallback, and the shape of every refusal —
// 400/403/404/413/415 must all arrive as {error} JSON, never as Express's HTML
// error page, because the frontend api() helper JSON.parses every response.
const test = require("node:test");
const assert = require("node:assert");
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { scrubProcessEnv } = require("./helpers/env.js");
const { startServer, rawRequest } = require("./helpers/server.js");

scrubProcessEnv();
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "cheatsheet-routes-"));
process.env.DATA_DIR = TMP;
const app = require("../server.js");

let server, base, port;
test.before(async () => {
  await new Promise((resolve) => { server = http.createServer(app).listen(0, "127.0.0.1", resolve); });
  port = server.address().port;
  base = "http://127.0.0.1:" + port;
});
test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(TMP, { recursive: true, force: true });
});
test.beforeEach(async () => {
  await api("POST", "/api/reset");
  for (const f of ["notes.json", "writeups.json", "machines.json", "exam.json"]) {
    fs.rmSync(path.join(TMP, f), { force: true });
    fs.rmSync(path.join(TMP, f + ".bak"), { force: true });
  }
});

async function api(method, url, body, headers) {
  const res = await fetch(base + url, {
    method,
    headers: Object.assign({ "Content-Type": "application/json" }, headers || {}),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* non-JSON */ }
  return { status: res.status, json, text, headers: res.headers };
}

// ── PUT /api/categories/:id — a whole CRUD endpoint with no coverage ──

test("PUT /api/categories/:id updates name, icon and description", async () => {
  const c = await api("POST", "/api/categories", { name: "Editable" });
  const id = c.json.id;
  const r = await api("PUT", "/api/categories/" + id, { name: "Renamed", icon: "🛠", description: "now described" });
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.json.name, "Renamed");
  assert.strictEqual(r.json.icon, "🛠");
  assert.strictEqual(r.json.description, "now described");
  // The id is derived from the original name and must NOT drift on rename —
  // notes and favourites are keyed by it.
  assert.strictEqual(r.json.id, id);
  const persisted = (await api("GET", "/api/categories")).json.find((x) => x.id === id);
  assert.strictEqual(persisted.name, "Renamed");
});

test("PUT /api/categories/:id leaves omitted fields alone", async () => {
  const c = await api("POST", "/api/categories", { name: "Partial", icon: "🧪", description: "keep me" });
  const r = await api("PUT", "/api/categories/" + c.json.id, { name: "Partial 2" });
  assert.strictEqual(r.json.icon, "🧪");
  assert.strictEqual(r.json.description, "keep me");
});

test("PUT /api/categories/:id rejects bad input and unknown ids", async () => {
  const c = await api("POST", "/api/categories", { name: "Validate Me" });
  const id = c.json.id;
  assert.strictEqual((await api("PUT", "/api/categories/" + id, { name: "" })).status, 400);
  assert.strictEqual((await api("PUT", "/api/categories/" + id, { name: "   " })).status, 400);
  assert.strictEqual((await api("PUT", "/api/categories/" + id, { name: 42 })).status, 400);
  assert.strictEqual((await api("PUT", "/api/categories/" + id, { description: 42 })).status, 400);
  const missing = await api("PUT", "/api/categories/no-such-category", { name: "x" });
  assert.strictEqual(missing.status, 404);
  assert.ok(missing.json.error);
});

// ── DELETE /api/categories/:id/subcategories/:subIdx — likewise uncovered ──

test("DELETE subcategory removes the right one and leaves its siblings", async () => {
  const c = await api("POST", "/api/categories", { name: "SubDelete" });
  const id = c.json.id;
  for (const name of ["first", "second", "third"]) {
    await api("POST", `/api/categories/${id}/subcategories`, { name });
  }
  assert.strictEqual((await api("DELETE", `/api/categories/${id}/subcategories/1`)).status, 200);
  const cat = (await api("GET", "/api/categories")).json.find((x) => x.id === id);
  assert.deepStrictEqual(cat.subcategories.map((s) => s.name), ["first", "third"]);
});

test("DELETE subcategory 404s on an unknown category or index", async () => {
  const c = await api("POST", "/api/categories", { name: "SubDelete404" });
  const id = c.json.id;
  await api("POST", `/api/categories/${id}/subcategories`, { name: "only" });
  assert.strictEqual((await api("DELETE", "/api/categories/nope/subcategories/0")).status, 404);
  assert.strictEqual((await api("DELETE", `/api/categories/${id}/subcategories/9`)).status, 404);
  assert.strictEqual((await api("DELETE", `/api/categories/${id}/subcategories/-1`)).status, 404);
  assert.strictEqual((await api("DELETE", `/api/categories/${id}/subcategories/0abc`)).status, 404);
});

test("PUT subcategory renames it and validates the name", async () => {
  const c = await api("POST", "/api/categories", { name: "SubRename" });
  const id = c.json.id;
  await api("POST", `/api/categories/${id}/subcategories`, { name: "before" });
  const r = await api("PUT", `/api/categories/${id}/subcategories/0`, { name: "after" });
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.json.name, "after");
  assert.strictEqual((await api("PUT", `/api/categories/${id}/subcategories/0`, { name: "  " })).status, 400);
});

// ── Collection GETs ──

test("GET /api/notes returns the whole per-category map", async () => {
  await api("POST", "/api/notes/recon", { text: "one" });
  await api("POST", "/api/notes/web-app", { text: "two" });
  const r = await api("GET", "/api/notes");
  assert.strictEqual(r.status, 200);
  assert.deepStrictEqual(Object.keys(r.json).sort(), ["recon", "web-app"]);
  assert.strictEqual(r.json.recon[0].text, "one");
});

test("GET /api/machines returns an array and reflects writes", async () => {
  assert.deepStrictEqual((await api("GET", "/api/machines")).json, []);
  await api("POST", "/api/machines", { name: "box01" });
  const r = await api("GET", "/api/machines");
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.json.length, 1);
  assert.strictEqual(r.json[0].name, "box01");
});

test("notes endpoints treat an unsafe catId as absent, not as an error", async () => {
  // GET and DELETE deliberately answer "nothing here" rather than 400 so the SPA
  // never has to special-case a stale link.
  assert.deepStrictEqual((await api("GET", "/api/notes/__proto__")).json, []);
  assert.strictEqual((await api("DELETE", "/api/notes/__proto__/whatever")).status, 200);
  assert.strictEqual((await api("PUT", "/api/notes/__proto__/whatever", { text: "x" })).status, 404);
});

// ── SPA fallback + unknown API routes ──

test("an unknown page route returns the SPA shell", async () => {
  const r = await api("GET", "/machines/deep/link");
  assert.strictEqual(r.status, 200);
  assert.match(r.headers.get("content-type") || "", /text\/html/);
  assert.match(r.text, /<div class="content-area" id="contentArea">/);
});

test("an unknown /api route returns JSON 404 for every method", async () => {
  for (const method of ["GET", "POST", "PUT", "DELETE"]) {
    const r = await api(method, "/api/no-such-thing", method === "GET" ? undefined : {});
    assert.strictEqual(r.status, 404, method);
    assert.match(r.headers.get("content-type") || "", /application\/json/, method);
    assert.ok(r.json && r.json.error, method);
  }
});

// ── Error shapes ──

test("malformed JSON returns a JSON 400", async () => {
  const res = await fetch(base + "/api/categories", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{ nope",
  });
  assert.strictEqual(res.status, 400);
  assert.match(res.headers.get("content-type") || "", /application\/json/);
  assert.strictEqual((await res.json()).error, "invalid JSON body");
});

test("a non-JSON content type on a mutating /api request returns 415", async () => {
  const r = await api("POST", "/api/categories", undefined, { "Content-Type": "text/plain" });
  // fetch sends no body here, so send one explicitly — the guard only fires when
  // there is actually attacker-supplied content to mistrust.
  const withBody = await fetch(base + "/api/categories", {
    method: "POST", headers: { "Content-Type": "text/plain" }, body: "name=pwned",
  });
  assert.strictEqual(withBody.status, 415);
  assert.strictEqual((await withBody.json()).error, "expected application/json");
  // A body-less mutating request is not a 415 — browsers omit Content-Type there.
  assert.notStrictEqual(r.status, 500);
});

test("a cross-site Origin on a mutating /api request returns 403", async () => {
  const evil = await api("POST", "/api/categories", { name: "CSRF" }, { Origin: "https://evil.example" });
  assert.strictEqual(evil.status, 403);
  assert.match(evil.json.error, /cross-site/);
  // Sec-Fetch-Site is the browser's own verdict and must be honoured too.
  const sfs = await api("POST", "/api/reset", {}, { "Sec-Fetch-Site": "cross-site" });
  assert.strictEqual(sfs.status, 403);
  // The SPA's own origin still works, as does a non-browser client with no Origin.
  assert.strictEqual((await api("POST", "/api/categories", { name: "SameOrigin" }, { Origin: base })).status, 201);
  assert.strictEqual((await api("POST", "/api/categories", { name: "NoOrigin" })).status, 201);
});

test("a request for an unknown Host is refused (DNS rebinding)", async () => {
  const r = await rawRequest(port, "GET", "/api/categories", { headers: { Host: "attacker.example" } });
  assert.strictEqual(r.status, 403);
  assert.strictEqual(r.json && r.json.error, "forbidden host");
  // Loopback spellings the SPA is actually served from stay allowed.
  assert.strictEqual((await rawRequest(port, "GET", "/api/health", { headers: { Host: "localhost:" + port } })).status, 200);
});

test("a body over JSON_LIMIT returns a JSON 413, not a dropped connection", async () => {
  // Its own process: the limit is read once, at require time.
  const s = await startServer({ JSON_LIMIT: "32kb" });
  try {
    const big = JSON.stringify({ name: "x".repeat(64 * 1024) });
    const r = await rawRequest(s.port, "POST", "/api/categories", {
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(big) },
      body: big,
    });
    assert.strictEqual(r.status, 413);
    assert.strictEqual(r.json && r.json.error, "request body too large");
    // Under the limit the same shape of request still works.
    const ok = JSON.stringify({ name: "small enough" });
    const r2 = await rawRequest(s.port, "POST", "/api/categories", {
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(ok) },
      body: ok,
    });
    assert.strictEqual(r2.status, 201);
  } finally {
    await s.stop();
  }
});

// ── Routes added alongside the machines workspace ──

test("GET/PUT /api/exam round-trips one JSON document and rejects non-objects", async () => {
  assert.deepStrictEqual((await api("GET", "/api/exam")).json, {});
  const r = await api("PUT", "/api/exam", { started: "2026-07-02T08:00:00Z", targets: 5 });
  assert.strictEqual(r.status, 200);
  assert.strictEqual((await api("GET", "/api/exam")).json.targets, 5);
  assert.strictEqual((await api("PUT", "/api/exam", [1, 2, 3])).status, 400);
});

test("GET /api/seed-status reports the bundled content version", async () => {
  const r = await api("GET", "/api/seed-status");
  assert.strictEqual(r.status, 200);
  assert.ok("latest" in r.json && "updateAvailable" in r.json);
  assert.strictEqual(typeof r.json.updateAvailable, "boolean");
});

test("POST /api/update?dryRun=1 reports changes without writing any", async () => {
  const before = JSON.stringify((await api("GET", "/api/categories")).json);
  const r = await api("POST", "/api/update?dryRun=1", {});
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.json.dryRun, true);
  assert.strictEqual(JSON.stringify((await api("GET", "/api/categories")).json), before, "a dry run must not mutate the database");
});
