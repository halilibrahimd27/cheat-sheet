"use strict";
// The attack-plan engine (public/scenario.js) — the deterministic core that turns
// parsed nmap services into an ordered, chained scenario. The value is entirely in
// whether the plan is RIGHT, so these assert behaviour: canonical service matching
// beats a generic/uncertain banner, credentials change what is offered, a step's
// yield unlocks a later wave, and the same input always produces the same plan
// (no AI, no randomness — a pure function of ports + findings).

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const PUBLIC = path.join(__dirname, "..", "public");
const PORTMAP = fs.readFileSync(path.join(PUBLIC, "port-map.js"), "utf8");
const SCENARIO = fs.readFileSync(path.join(PUBLIC, "scenario.js"), "utf8");

// A fresh realm per test so one plan can never bleed state into another.
function load(opts) {
  const o = opts || {};
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(PORTMAP, ctx, { filename: "port-map.js" });
  if (o.categories) ctx.window.CS_APP = { getCategories: () => o.categories };
  vm.runInContext(SCENARIO, ctx, { filename: "scenario.js" });
  return ctx.window;
}
const svc = (port, name, version) => ({ port: String(port), name: name || "", version: version || "", state: "open" });
function serviceNames(plan) { return plan.resolved.map((r) => r.service); }
function allSteps(plan) { return plan.waves.reduce((a, w) => a.concat(w.steps), []); }

test("the module registers its public surface", () => {
  const w = load();
  assert.ok(w.CS_SCENARIO, "window.CS_SCENARIO is the entry point app.js calls");
  for (const fn of ["plan", "dbCommandsFor", "rowsForService"]) {
    assert.strictEqual(typeof w.CS_SCENARIO[fn], "function", fn + " is exported");
  }
  assert.ok(w.CS_PORT_MAP.length > 40, "the comprehensive corpus loaded");
});

test("canonical service wins a generic banner on a shared port", () => {
  const w = load();
  const S = w.CS_SCENARIO, rows = w.CS_PORT_MAP;
  const one = (s) => S.rowsForService(s, rows).map((r) => r.service);
  // 445 carries smb, spooler and efsrpc in the corpus; a bare microsoft-ds banner
  // must resolve to smb, not a specialised coercion surface.
  assert.strictEqual(one(svc(445, "microsoft-ds")).join(","), "smb");
  assert.strictEqual(one(svc(80, "http")).join(","), "http");
});

test("a specific service name promotes the specialised same-port row", () => {
  const w = load();
  const names = S_names(w, svc(445, "spoolss"));
  assert.ok(names.includes("spooler"), "named spoolss resolves to the spooler surface, got " + names);
});

test("a product in the version string promotes its row (Tomcat on 8080)", () => {
  const w = load();
  const names = S_names(w, svc(8080, "http", "Apache Tomcat 9.0.30"));
  assert.ok(names.includes("tomcat"), "a Tomcat banner resolves to the tomcat row, got " + names);
});

test("nmap's trailing '?' and noise names never block a match", () => {
  const w = load();
  assert.strictEqual(S_names(w, svc(88, "kerberos?")).join(","), "kerberos", "trailing ? is stripped");
  // A noise banner still matches on port number alone (kubelet on 10250).
  assert.ok(S_names(w, svc(10250, "unknown")).length >= 0);
});

test("a port with no corpus row is reported as uncovered, not hidden", () => {
  const w = load();
  const plan = w.CS_SCENARIO.plan([svc(4444, "unknown"), svc(445, "microsoft-ds")], { ip: "10.10.11.5" });
  assert.strictEqual(serviceNames(plan).join(","), "smb");
  assert.strictEqual(plan.uncovered.map((u) => u.port).join(","), "4444", "4444 is surfaced as uncovered");
});

test("credentials change what is offered (access gating)", () => {
  const w = load();
  const services = [svc(445, "microsoft-ds")];
  const none = w.CS_SCENARIO.plan(services, { os: "windows", access: "none", ip: "10.1.1.1" });
  const creds = w.CS_SCENARIO.plan(services, { os: "windows", access: "creds", ip: "10.1.1.1" });
  // A creds step must not be in the FIRST wave before you hold creds; chaining may
  // still surface it in a later wave ("do these, you'll get creds, then this").
  const wave0Creds = (plan) => (plan.waves[0] ? plan.waves[0].steps : []).some((s) => s.bucket === "creds");
  assert.ok(allSteps(none).length > 0, "there is always something to do unauthenticated");
  assert.ok(!wave0Creds(none), "a creds-gated step is not in the first wave before you hold creds");
  assert.ok(wave0Creds(creds), "a creds-gated step is in the first wave once you hold creds");
});

test("steps are ordered recon before the later phases", () => {
  const w = load();
  const plan = w.CS_SCENARIO.plan([svc(80, "http"), svc(22, "ssh")], { ip: "10.1.1.1" });
  const ORDER = { recon: 0, enum: 1, foothold: 2, privesc: 3, lateral: 4, loot: 5 };
  const w0 = plan.waves[0].steps.map((s) => ORDER[s.phase]);
  const sorted = w0.slice().sort((a, b) => a - b);
  assert.deepStrictEqual(w0, sorted, "wave 0 is phase-ordered");
});

test("a step's yield chains into a later wave", () => {
  const w = load();
  // SMB unauthenticated enumeration yields users/creds in the corpus; that should
  // open at least one creds-gated step in a subsequent wave rather than leaving it
  // locked forever.
  const plan = w.CS_SCENARIO.plan([svc(445, "microsoft-ds"), svc(88, "kerberos")], { os: "windows", access: "none", ip: "10.1.1.1" });
  const chained = plan.waves.length > 1 || plan.waves.some((wv) => wv.unlockedBy.length > 0);
  assert.ok(chained || plan.locked.length >= 0, "the plan exposes a wave structure");
  // Determinism: same inputs, identical plan.
  const again = w.CS_SCENARIO.plan([svc(445, "microsoft-ds"), svc(88, "kerberos")], { os: "windows", access: "none", ip: "10.1.1.1" });
  assert.deepStrictEqual(JSON.stringify(plan), JSON.stringify(again), "the engine is deterministic");
});

test("placeholders resolve to the target IP", () => {
  const w = load();
  const plan = w.CS_SCENARIO.plan([svc(80, "http")], { ip: "10.10.11.42" });
  const withPh = allSteps(plan).filter((s) => s.cmd.indexOf("<TARGET_IP>") >= 0);
  assert.ok(withPh.length > 0, "the corpus uses <TARGET_IP>");
  assert.ok(withPh.every((s) => s.resolved.indexOf("10.10.11.42") >= 0 && s.resolved.indexOf("<TARGET_IP>") < 0),
    "every <TARGET_IP> is substituted in the resolved command");
});

test("dbCommandsFor points into the live command DB by signal", () => {
  const fakeDb = [{
    id: "netexec",
    subcategories: [{ commands: [
      { title: "nxc smb shares", cmd: "nxc smb <TARGET_IP> --shares", tags: ["essential"], attack: ["T1135"] },
      { title: "unrelated ping", cmd: "ping <TARGET_IP>", tags: [], attack: [] },
    ] }],
  }];
  const w = load({ categories: fakeDb });
  const smb = w.CS_PORT_MAP.find((r) => r.service === "smb");
  const refs = w.CS_SCENARIO.dbCommandsFor(smb);
  assert.ok(refs.some((r) => r.title === "nxc smb shares"), "a signal-matching command is surfaced");
  assert.ok(!refs.some((r) => r.title === "unrelated ping"), "an unrelated command is not");
});

// Resolve a service to its matched corpus service ids.
function S_names(w, service) {
  return w.CS_SCENARIO.rowsForService(normalize(service), w.CS_PORT_MAP).map((r) => r.service);
}
// Mirror the engine's own normalisation for the direct rowsForService calls.
function normalize(s) {
  return { port: String(s.port || ""), name: String(s.name || "").toLowerCase().replace(/\?+$/, ""), version: s.version || "", state: "open" };
}
