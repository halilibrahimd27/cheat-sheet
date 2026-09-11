"use strict";
// Security regressions. This repo is a security tool used against real targets
// and its database holds a credential vault, so these are the tests that matter
// most: every one of them encodes a way the product has been, or could be, used
// against its own user.
const test = require("node:test");
const assert = require("node:assert");
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { scrubProcessEnv } = require("./helpers/env.js");
const { rawRequest, startServer } = require("./helpers/server.js");

scrubProcessEnv();
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "cheatsheet-sec-"));
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
// Order independence: reset the categories cache AND drop the side collections,
// so any single case here runs alone under --test-name-pattern.
test.beforeEach(async () => {
  await api("POST", "/api/reset");
  for (const f of ["notes.json", "writeups.json", "machines.json", "exam.json"]) {
    fs.rmSync(path.join(TMP, f), { force: true });
    fs.rmSync(path.join(TMP, f + ".bak"), { force: true });
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

// Post a body exactly as typed — JSON.stringify would quietly rewrite the
// prototype-pollution payloads out of existence.
async function postRaw(url, rawBody) {
  const res = await fetch(base + url, { method: "POST", headers: { "Content-Type": "application/json" }, body: rawBody });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* non-JSON */ }
  return { status: res.status, json, text };
}

// A file that is a valid image by magic bytes AND a working HTML/script payload
// to a browser that sniffs. "BM" is the whole BMP signature, so everything after
// it is free-form — the classic polyglot.
const SCRIPT = '<script>alert(document.domain)</script>';
const BMP_POLYGLOT = Buffer.concat([Buffer.from("BM"), Buffer.from(SCRIPT + " ".repeat(32))]);
const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_POLYGLOT = Buffer.concat([PNG_HEADER, Buffer.from(SCRIPT + " ".repeat(32))]);

// ── Uploads ──

test("a BMP/script polyglot is stored and served as an inert image", async () => {
  const r = await api("POST", "/api/upload", { data: BMP_POLYGLOT.toString("base64"), filename: "payload.html" });
  assert.strictEqual(r.status, 200, "the bytes ARE a valid BMP, so the upload is accepted");
  assert.match(r.json.url, /^\/uploads\/[a-z0-9]+\.bmp$/, "the extension comes from the bytes, not the filename");

  const served = await fetch(base + r.json.url);
  assert.strictEqual(served.status, 200);
  assert.strictEqual(served.headers.get("x-content-type-options"), "nosniff", "without nosniff the browser sniffs the <script> and runs it");
  assert.match(served.headers.get("content-type") || "", /^image\//, "must never be served as text/html");
  const csp = served.headers.get("content-security-policy") || "";
  assert.match(csp, /default-src 'none'/, "an uploads CSP must start from nothing");
  assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);
  assert.ok((await served.text()).includes(SCRIPT), "the bytes are stored verbatim — inertness comes from the headers, not from rewriting");
});

test("a PNG/script polyglot gets the same treatment", async () => {
  const r = await api("POST", "/api/upload", { data: PNG_POLYGLOT.toString("base64") });
  assert.strictEqual(r.status, 200);
  assert.match(r.json.url, /\.png$/);
  const served = await fetch(base + r.json.url);
  assert.strictEqual(served.headers.get("x-content-type-options"), "nosniff");
  assert.match(served.headers.get("content-type") || "", /^image\/png/);
});

test("SVG is rejected however it is dressed up", async () => {
  // SVG is the one image format that is also a script host, so it is refused by
  // content — a .png filename and a data: URI prefix change nothing.
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(2)</script></svg>';
  const b64 = Buffer.from(svg).toString("base64");
  assert.strictEqual((await api("POST", "/api/upload", { data: b64, filename: "x.svg" })).status, 400);
  assert.strictEqual((await api("POST", "/api/upload", { data: b64, filename: "x.png" })).status, 400);
  assert.strictEqual((await api("POST", "/api/upload", { data: "data:image/svg+xml;base64," + b64 })).status, 400);
  // ...and so is an HTML file with an image name.
  assert.strictEqual((await api("POST", "/api/upload", { data: Buffer.from("<html>" + SCRIPT).toString("base64"), filename: "a.png" })).status, 400);
});

test("a 6 MB upload is refused with 413", async () => {
  const big = Buffer.concat([Buffer.from("BM"), Buffer.alloc(6 * 1024 * 1024, 0x41)]);
  const r = await api("POST", "/api/upload", { data: big.toString("base64") });
  assert.strictEqual(r.status, 413);
  assert.match(r.json.error, /too large/i);
});

test("upload rejects empty and non-string payloads without crashing", async () => {
  assert.strictEqual((await api("POST", "/api/upload", {})).status, 400);
  assert.strictEqual((await api("POST", "/api/upload", { data: "" })).status, 400);
  assert.strictEqual((await api("POST", "/api/upload", { data: 12345 })).status, 400);
  assert.strictEqual((await api("POST", "/api/upload", { data: { evil: true } })).status, 400);
  assert.strictEqual((await api("POST", "/api/upload", { data: Buffer.from("BM").toString("base64") })).status, 400, "too short to sniff");
});

// ── Path traversal ──

test("path traversal never serves a repo file", async () => {
  // fetch() normalises ".." out of a URL before it reaches the wire, so these go
  // out as raw request targets. The server source, the seed and the database all
  // sit one directory above public/.
  const attempts = [
    "/../server.js",
    "/..%2f..%2fserver.js",
    "/uploads/../../commands.json",
    "/%2e%2e/%2e%2e/seed.js",
    "/uploads/%2e%2e/%2e%2e/server.js",
    "/....//server.js",
    "/..%5c..%5cserver.js",
    "/public/../server.js",
  ];
  for (const target of attempts) {
    const r = await rawRequest(port, "GET", target);
    assert.ok(r.status < 500, target + " returned " + r.status);
    assert.doesNotMatch(r.text, /require\("express"\)/, target + " leaked server.js");
    assert.doesNotMatch(r.text, /module\.exports = app/, target + " leaked server.js");
    assert.doesNotMatch(r.text, /AUTH_PASS/, target + " leaked server.js");
    if (r.status === 200) {
      assert.match(r.text, /id="contentArea"/, target + " should fall through to the SPA shell");
    }
  }
});

test("the uploads directory does not expose the data directory around it", async () => {
  await api("POST", "/api/notes/recon", { text: "a secret note" });
  for (const target of ["/uploads/../notes.json", "/uploads/..%2fnotes.json", "/uploads/%2e%2e/notes.json"]) {
    const r = await rawRequest(port, "GET", target);
    assert.doesNotMatch(r.text, /a secret note/, target + " leaked notes.json");
  }
});

// ── Prototype pollution ──

test("import cannot pollute Object.prototype through a notes key", async () => {
  // These go out as raw JSON text on purpose: written as a JS object literal,
  // `__proto__:` sets the prototype instead of creating the own key, and the
  // payload never reaches the wire in the shape an attacker would send.
  const rejected = [
    '{"notes":{"__proto__":[{"id":"n1","text":"x"}]}}',
    '{"notes":{"constructor":{"prototype":{"polluted":"yes"}}}}',
    '{"__proto__":{"polluted":"yes"}}',
    '{"notes":{"__proto__":{"polluted":"yes"}},"categories":[]}',
  ];
  for (const body of rejected) {
    const r = await postRaw("/api/import", body);
    assert.strictEqual(r.status, 400, body + " must be rejected");
  }
  // A bundle that is otherwise valid may be accepted — but the stray key must
  // land as data, never on the prototype.
  const ok = await postRaw("/api/import", '{"categories":[{"id":"safe","name":"Safe","subcategories":[],"__proto__":{"polluted":"yes"}}]}');
  assert.strictEqual(ok.status, 200);

  assert.strictEqual({}.polluted, undefined, "Object.prototype was polluted");
  assert.strictEqual([].polluted, undefined);
  assert.strictEqual(typeof {}.toString, "function");
  const notes = (await api("GET", "/api/notes")).json;
  assert.strictEqual(Object.prototype.hasOwnProperty.call(notes, "__proto__"), false);
});

test("POST /api/notes/__proto__ is a 400, not a write into the prototype", async () => {
  for (const key of ["__proto__", "Recon", "a b", "../x", "a.b", "x/y"]) {
    const r = await api("POST", "/api/notes/" + encodeURIComponent(key), { text: "x" });
    assert.strictEqual(r.status, 400, key + " should be refused as a category id");
  }
  assert.strictEqual({}.text, undefined);
  // "constructor" IS a legal category slug, so it must work as an ordinary key
  // — the endpoint is guarded by hasOwnProperty, not by banning the word.
  const made = await api("POST", "/api/notes/constructor", { text: "legitimate" });
  assert.strictEqual(made.status, 201);
  assert.strictEqual((await api("GET", "/api/notes/constructor")).json[0].text, "legitimate");
  assert.strictEqual(typeof {}.constructor, "function");
});

// ── Import validation ──

test("import rejects a machines array containing null", async () => {
  // A null in the array used to be persisted, after which every subsequent
  // PUT/DELETE /api/machines/:id threw on `x.id` and 500'd — permanently, because
  // the poison was on disk.
  const r = await api("POST", "/api/import", { machines: [null] });
  assert.strictEqual(r.status, 400);
  assert.match(r.json.error, /machines/);

  // The endpoints it used to poison still work afterwards.
  const m = await api("POST", "/api/machines", { name: "still-alive" });
  assert.strictEqual(m.status, 201);
  assert.strictEqual((await api("PUT", "/api/machines/" + m.json.id, { ip: "10.0.0.1" })).status, 200);
  assert.strictEqual((await api("DELETE", "/api/machines/" + m.json.id)).status, 200);
});

test("import rejects other machine shapes that break the machines routes", async () => {
  for (const machines of [[undefined], ["a string"], [[]], [{ name: "no id" }], [{ id: 7, name: "numeric id" }]]) {
    const r = await api("POST", "/api/import", { machines });
    assert.strictEqual(r.status, 400, JSON.stringify(machines) + " must be rejected");
  }
});

test("an imported command id carrying markup is rejected or regenerated", async () => {
  const evilId = 'a" onmouseover="x';
  const bundle = [{
    id: "imported", name: "Imported", icon: "📦", description: "", subcategories: [
      { id: "s1", name: "Sub", commands: [{ id: evilId, title: "T", cmd: "id" }] },
    ],
  }];
  const r = await api("POST", "/api/import", bundle);
  if (r.status === 400) return; // rejecting the bundle outright is also correct
  assert.strictEqual(r.status, 200);
  const cats = (await api("GET", "/api/categories")).json;
  const cmd = cats.find((c) => c.id === "imported").subcategories[0].commands[0];
  assert.notStrictEqual(cmd.id, evilId, "an id that can break out of an attribute must not survive an import");
  assert.match(cmd.id, /^[A-Za-z0-9_-]+$/, "regenerated ids must be attribute-safe");
});

test("an imported category or machine id carrying markup is regenerated too", async () => {
  const r = await api("POST", "/api/import", {
    categories: [{ id: '<img src=x onerror=alert(1)>', name: "Evil", subcategories: [] }],
    machines: [{ id: '"><script>alert(1)</script>', name: "Evil Box" }],
  });
  assert.strictEqual(r.status, 200);
  for (const c of (await api("GET", "/api/categories")).json) {
    assert.match(c.id, /^[A-Za-z0-9_-]+$/, "category id " + JSON.stringify(c.id));
  }
  for (const m of (await api("GET", "/api/machines")).json) {
    assert.match(m.id, /^[A-Za-z0-9_-]+$/, "machine id " + JSON.stringify(m.id));
  }
});

test("import is all-or-nothing and reports what it regenerated", async () => {
  await api("POST", "/api/notes/recon", { text: "survivor" });
  const r = await api("POST", "/api/import", { writeups: [{ id: "w1", title: "kept", tags: ["x"] }] });
  assert.strictEqual(r.status, 200);
  assert.strictEqual(typeof r.json.idsRegenerated, "number");
  // Collections the bundle did not mention are left alone.
  assert.strictEqual((await api("GET", "/api/notes")).json.recon[0].text, "survivor");
});

// ── Response headers ──

test("the app ships a restrictive CSP and the usual hardening headers", async () => {
  const res = await fetch(base + "/");
  const csp = res.headers.get("content-security-policy") || "";
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/, "inline script must stay forbidden");
  assert.doesNotMatch(csp, /script-src[^;]*'unsafe-eval'/);
  assert.strictEqual(res.headers.get("x-content-type-options"), "nosniff");
  assert.strictEqual(res.headers.get("x-frame-options"), "DENY");
  assert.strictEqual(res.headers.get("referrer-policy"), "no-referrer");
  assert.strictEqual(res.headers.get("x-powered-by"), null, "Express must not advertise itself");
});

test("/api/export is not reachable cross-site (it carries the credential vault)", async () => {
  // The name used to promise this and the body did not test it: it issued one
  // same-origin fetch with no Origin and no Sec-Fetch-Site and asserted 200,
  // which is the case a browser NEVER produces for a cross-site read. A test
  // whose title claims a guard it never exercises is worse than a missing test —
  // it answers "is export protected?" with a green tick.
  //
  // Export is a GET, so a <form> cannot reach it, but fetch() from another page
  // can, and it arrives with Sec-Fetch-Site: cross-site and that page's Origin.
  // Express routes case-insensitively, so /API/export reaches the same handler:
  // if the guard compared req.path case-sensitively, one capital letter would
  // hand any website the machine credential vault.
  const foreign = { Origin: "https://evil.example", "Sec-Fetch-Site": "cross-site" };
  for (const p of ["/api/export", "/API/export", "/Api/Export"]) {
    const r = await rawRequest(port, "GET", p, { headers: foreign });
    assert.strictEqual(r.status, 403, "a cross-site read of " + p + " must be refused, got " + r.status + ": " + r.text.slice(0, 200));
    assert.doesNotMatch(r.text, /"machines"/, "the refusal must not carry the bundle anyway: " + r.text.slice(0, 200));
  }
  // Either signal alone is enough — a browser that sends only one of them must
  // not be a way through.
  for (const headers of [{ Origin: "https://evil.example" }, { "Sec-Fetch-Site": "cross-site" }]) {
    const r = await rawRequest(port, "GET", "/api/export", { headers });
    assert.strictEqual(r.status, 403, "refused on " + Object.keys(headers)[0] + " alone, got " + r.status);
  }

  // And the legitimate read still works, from the page's own origin and from a
  // CLI that sends neither header — breaking either of those would be the guard
  // over-correcting.
  for (const headers of [{}, { Origin: base, "Sec-Fetch-Site": "same-origin" }]) {
    const r = await rawRequest(port, "GET", "/api/export", { headers });
    assert.strictEqual(r.status, 200, "same-origin export must still work: " + r.text.slice(0, 200));
    for (const k of ["categories", "notes", "writeups", "machines"]) assert.ok(r.json && k in r.json, "export missing " + k);
    assert.strictEqual(r.headers["access-control-allow-origin"], undefined, "no CORS header may ever be sent");
  }
});

// ── The request guard ──
// Three regressions that all lived in the same middleware. Each one shipped, so
// each one gets a case: a guard that is too strict breaks the documented CLI
// recipe, and a guard that is too loose hands a website the credential vault.

test("POST with Content-Length: 0 and no Content-Type is not a 415 — it is the README's own curl recipe", async () => {
  // `curl -X POST http://localhost:3000/api/reset` sends Content-Length: 0 and
  // no Content-Type. Counting that header as "has a body" made the printed
  // recipe fail with 415, which is a documentation bug the server caused.
  const r = await rawRequest(port, "POST", "/api/reset", { headers: { "Content-Length": "0" } });
  assert.strictEqual(r.status, 200, "a body-less POST carries no attacker content and must be allowed: " + r.text);
  assert.strictEqual(r.json && r.json.ok, true);

  // The same for the other body-less mutators the CLI reaches for.
  const del = await rawRequest(port, "DELETE", "/api/notes/nope", { headers: { "Content-Length": "0" } });
  assert.notStrictEqual(del.status, 415, "a body-less DELETE must not be refused for its Content-Type");

  // And the guard is still a guard: a real body without a JSON content type is
  // exactly what a cross-site <form> sends, and that stays refused.
  const formPost = await rawRequest(port, "POST", "/api/categories", {
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": "9" },
    body: "id=pwned&",
  });
  assert.strictEqual(formPost.status, 415, "a form-encoded body must still be rejected: " + formPost.text);

  // Chunked bodies declare no length at all; they are a body, and they must be
  // judged like one.
  const chunked = await rawRequest(port, "POST", "/api/categories", { body: "{}" });
  assert.strictEqual(chunked.status, 415, "a chunked body without application/json must still be rejected: " + chunked.text);
});

test("the Host guard runs with HOST=0.0.0.0 — the configuration the Docker image ships", async () => {
  // Exempting 0.0.0.0 left DNS-rebinding protection off by default in exactly
  // the deployment most likely to be reachable from another machine. fetch()
  // forbids setting Host, so this speaks HTTP on a raw socket.
  const srv = await startServer({ HOST: "0.0.0.0" });
  try {
    const evil = await rawRequest(srv.port, "GET", "/api/categories", { headers: { Host: "evil.example.com" } });
    assert.strictEqual(evil.status, 403, "a rebound hostname must be refused even when bound to 0.0.0.0: " + evil.text);
    assert.strictEqual(evil.json && evil.json.error, "forbidden host");

    // An attacker-controlled name is refused whatever it is pointed at, and a
    // 403 on the export is the one that matters most.
    const evilExport = await rawRequest(srv.port, "GET", "/api/export", { headers: { Host: "attacker.test:" + srv.port } });
    assert.strictEqual(evilExport.status, 403, "the credential vault must not be readable through a rebound name");

    // The paths a real user takes all still work: the two loopback names, and a
    // bare LAN IP literal, which is the address the README documents for phones
    // and second machines. A literal cannot be rebound — rebinding flips what a
    // NAME resolves to — so accepting it costs nothing.
    for (const host of ["localhost:" + srv.port, "127.0.0.1:" + srv.port, "[::1]:" + srv.port, "192.168.1.10:" + srv.port, "10.0.0.7:" + srv.port]) {
      const ok = await rawRequest(srv.port, "GET", "/api/categories", { headers: { Host: host } });
      assert.strictEqual(ok.status, 200, "Host: " + host + " must be served, got " + ok.status + " " + ok.text);
    }
  } finally {
    await srv.stop();
  }
});

test("a guarded read is refused cross-origin at every path casing", async () => {
  // Express routes case-insensitively, so /API/export reaches the same handler
  // as /api/export. Comparing req.path case-sensitively therefore handed any
  // website a one-capital-letter bypass of the whole guard.
  const FOREIGN = "https://evil.example.com";
  for (const p of ["/api/export", "/API/export", "/Api/Export", "/api/EXPORT", "/API/MACHINES", "/Api/Exam"]) {
    const r = await rawRequest(port, "GET", p, { headers: { Origin: FOREIGN } });
    assert.strictEqual(r.status, 403, "GET " + p + " from a foreign Origin must be 403, got " + r.status + " " + r.text.slice(0, 120));
    assert.strictEqual(r.json && r.json.error, "cross-site request blocked");
  }

  // Sec-Fetch-Site is the other half of the same check, and browsers send it
  // without an Origin on a top-level cross-site navigation.
  for (const p of ["/api/export", "/API/export"]) {
    const r = await rawRequest(port, "GET", p, { headers: { "Sec-Fetch-Site": "cross-site" } });
    assert.strictEqual(r.status, 403, "GET " + p + " with Sec-Fetch-Site: cross-site must be 403, got " + r.status);
  }

  // And the app itself still reads its own data — a guard that blocks the SPA is
  // not a guard, it is an outage.
  const self = "http://127.0.0.1:" + port;
  for (const p of ["/api/export", "/Api/Export"]) {
    const same = await rawRequest(port, "GET", p, { headers: { Origin: self, "Sec-Fetch-Site": "same-origin" } });
    assert.strictEqual(same.status, 200, "GET " + p + " same-origin must be served, got " + same.status + " " + same.text.slice(0, 120));
    assert.ok(same.json && "categories" in same.json, "the export must still be the export");
  }
  // A non-browser client (curl, this suite) sends neither header and is served.
  const bare = await rawRequest(port, "GET", "/api/export", {});
  assert.strictEqual(bare.status, 200, "curl sends no Origin and must not be locked out");
});
