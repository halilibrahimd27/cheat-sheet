"use strict";
// HTTP Basic auth is the only access control in the product. It lives behind
// `if (AUTH_PASS)` and is installed from a module-level constant read at require
// time, so it can only be exercised from a fresh process with AUTH_PASS in its
// environment — which is why every case here spawns server.js as a child.
const test = require("node:test");
const assert = require("node:assert");
const { startServer, rawRequest } = require("./helpers/server.js");

const PASS = "correct horse battery staple";
const basic = (u, p) => "Basic " + Buffer.from(u + ":" + p, "utf8").toString("base64");
const AUTH = { Authorization: basic("admin", PASS) };

let srv;
test.before(async () => { srv = await startServer({ AUTH_PASS: PASS }); });
test.after(async () => { await srv.stop(); });

const req = (method, path, headers) => rawRequest(srv.port, method, path, { headers: headers || {} });

test("no credentials → 401 with a Basic challenge, not the SPA", async () => {
  const r = await req("GET", "/api/categories");
  assert.strictEqual(r.status, 401);
  assert.match(r.headers["www-authenticate"] || "", /^Basic realm=/);
  assert.strictEqual(r.json && r.json.error, "authentication required");
});

test("wrong username → 401", async () => {
  const r = await req("GET", "/api/categories", { Authorization: basic("root", PASS) });
  assert.strictEqual(r.status, 401);
});

test("wrong password → 401", async () => {
  const r = await req("GET", "/api/categories", { Authorization: basic("admin", PASS + "!") });
  assert.strictEqual(r.status, 401);
});

test("correct credentials → 200", async () => {
  const r = await req("GET", "/api/categories", AUTH);
  assert.strictEqual(r.status, 200);
  assert.ok(Array.isArray(r.json) && r.json.length > 0);
});

test("the gate covers the SPA shell, static assets and /uploads", async () => {
  // Anything the browser can reach must be behind the same door; a gate that only
  // guards /api still hands an attacker app.js and every uploaded screenshot.
  for (const path of ["/", "/index.html", "/app.js", "/style.css", "/uploads/", "/uploads/anything.png"]) {
    const r = await req("GET", path);
    assert.strictEqual(r.status, 401, path + " must be gated");
  }
  assert.strictEqual((await req("GET", "/", AUTH)).status, 200);
  assert.strictEqual((await req("GET", "/app.js", AUTH)).status, 200);
});

test("OPTIONS requests are gated too", async () => {
  assert.strictEqual((await req("OPTIONS", "/api/categories")).status, 401);
  assert.strictEqual((await req("OPTIONS", "/")).status, 401);
});

test("/api/health is reachable without credentials (Docker HEALTHCHECK)", async () => {
  // The container's HEALTHCHECK carries no credentials; if the gate swallows the
  // probe the image reports unhealthy forever. Health must sit above the gate.
  const r = await req("GET", "/api/health");
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.json && r.json.status, "ok");
});

test("a garbage Authorization header 401s instead of 500ing", async () => {
  const junk = [
    "Basic",
    "Basic ",
    "x",
    "Basic !!!!",
    "Basic " + Buffer.from("nocolon", "utf8").toString("base64"),
    "Bearer " + Buffer.from("admin:" + PASS, "utf8").toString("base64"),
    "Basic " + "A".repeat(4096),
  ];
  for (const value of junk) {
    const r = await req("GET", "/api/categories", { Authorization: value });
    assert.strictEqual(r.status, 401, JSON.stringify(value) + " should 401");
  }
});

test("a password containing a colon works (RFC 7617 first-colon split)", async () => {
  const colonPass = "p:a:s:s";
  const s = await startServer({ AUTH_PASS: colonPass, AUTH_USER: "op" });
  try {
    assert.strictEqual((await rawRequest(s.port, "GET", "/api/categories", { headers: { Authorization: basic("op", colonPass) } })).status, 200);
  } finally {
    await s.stop();
  }
  // The mirror image: credentials that only line up under a LAST-colon split.
  // "op:x:y" is user "op" + password "x:y" per RFC 7617, so it must NOT open a
  // server configured as user "op:x" / password "y".
  const s2 = await startServer({ AUTH_PASS: "y", AUTH_USER: "op:x" });
  try {
    assert.strictEqual((await rawRequest(s2.port, "GET", "/api/categories", { headers: { Authorization: "Basic " + Buffer.from("op:x:y", "utf8").toString("base64") } })).status, 401);
  } finally {
    await s2.stop();
  }
});

test("a custom AUTH_USER is enforced", async () => {
  const s = await startServer({ AUTH_PASS: PASS, AUTH_USER: "operator" });
  try {
    assert.strictEqual((await rawRequest(s.port, "GET", "/api/categories", { headers: { Authorization: basic("operator", PASS) } })).status, 200);
    assert.strictEqual((await rawRequest(s.port, "GET", "/api/categories", { headers: { Authorization: basic("admin", PASS) } })).status, 401);
  } finally {
    await s.stop();
  }
});

test("repeated failed attempts are rate-limited or delayed", async () => {
  // Unthrottled Basic auth over a LAN is an offline-speed password oracle. Its own
  // server instance, because a working limiter would lock out every case above.
  const s = await startServer({ AUTH_PASS: PASS });
  try {
    let throttled = false;
    for (let i = 0; i < 12 && !throttled; i++) {
      const t0 = Date.now();
      const r = await rawRequest(s.port, "GET", "/api/categories", { headers: { Authorization: basic("admin", "guess" + i) } });
      const elapsed = Date.now() - t0;
      assert.ok(r.status === 401 || r.status === 429, "attempt " + i + " returned " + r.status);
      if (r.status === 429 || elapsed >= 200) throttled = true;
    }
    assert.ok(throttled, "12 consecutive failures produced neither a 429 nor a measurable delay");
  } finally {
    await s.stop();
  }
});

test("with AUTH_PASS unset the app is open (default single-user mode)", async () => {
  const s = await startServer();
  try {
    assert.strictEqual((await rawRequest(s.port, "GET", "/api/categories")).status, 200);
    assert.strictEqual((await rawRequest(s.port, "GET", "/api/health")).status, 200);
  } finally {
    await s.stop();
  }
});
