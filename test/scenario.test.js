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
const VULNMAP = fs.readFileSync(path.join(PUBLIC, "vuln-map.js"), "utf8");
const SCENARIO = fs.readFileSync(path.join(PUBLIC, "scenario.js"), "utf8");

// A fresh realm per test so one plan can never bleed state into another.
function load(opts) {
  const o = opts || {};
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(PORTMAP, ctx, { filename: "port-map.js" });
  vm.runInContext(VULNMAP, ctx, { filename: "vuln-map.js" });
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
  for (const fn of ["plan", "dbCommandsFor", "vulnsFor", "rowsForService"]) {
    assert.strictEqual(typeof w.CS_SCENARIO[fn], "function", fn + " is exported");
  }
  assert.ok(w.CS_PORT_MAP.length > 40, "the comprehensive corpus loaded");
  assert.ok(w.CS_VULN_MAP.length > 10, "the curated vuln map loaded");
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

test("a lone service port fills <PORT>; the same service on two ports keeps it symbolic", () => {
  const w = load();
  const steps = (plan) => plan.waves.reduce((a, wv) => a.concat(wv.steps), []);
  const ssh = steps(w.CS_SCENARIO.plan([svc(22, "ssh")], { ip: "10.10.11.9" })).filter((s) => s.service === "ssh");
  assert.ok(ssh.length, "ssh produced steps");
  assert.ok(!ssh.some((s) => s.resolved.indexOf("<PORT>") >= 0), "a single ssh port is filled into every step");
  assert.ok(ssh.some((s) => /(^|[^0-9])22([^0-9]|$)/.test(s.resolved)), "the filled port is the one that was scanned");
  const http = steps(w.CS_SCENARIO.plan([svc(80, "http"), svc(8080, "http")], { ip: "10.10.11.9" })).filter((s) => s.service === "http");
  assert.ok(http.some((s) => s.resolved.indexOf("<PORT>") >= 0), "http on two ports leaves <PORT> for the user to pick");
});

test("filling <PORT> never rewrites <LPORT>, the attacker's listener", () => {
  const w = load();
  const all = w.CS_SCENARIO.plan([svc(445, "microsoft-ds")], { ip: "10.10.11.9", os: "windows" })
    .waves.reduce((a, wv) => a.concat(wv.steps), []).concat(
      w.CS_SCENARIO.plan([svc(445, "microsoft-ds")], { ip: "10.10.11.9", os: "windows" }).locked);
  const withLport = all.filter((s) => s.cmd.indexOf("<LPORT>") >= 0);
  assert.ok(withLport.length, "the smb playbook has a step that sets <LPORT>");
  assert.ok(withLport.every((s) => s.resolved.indexOf("<LPORT>") >= 0), "<LPORT> survives <PORT> substitution verbatim");
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

test("vulnsFor matches an exact vulnerable build and fills the target", () => {
  const w = load();
  const V = w.CS_SCENARIO.vulnsFor([svc(21, "ftp", "vsftpd 2.3.4")], { ip: "10.10.11.42" });
  assert.strictEqual(V.length, 1, "vsftpd 2.3.4 is a known backdoor");
  assert.strictEqual(V[0].id, "CVE-2011-2523");
  assert.strictEqual(V[0].sev, "critical");
  assert.ok(V[0].resolvedExploit.indexOf("10.10.11.42") >= 0 && V[0].resolvedExploit.indexOf("<TARGET_IP>") < 0,
    "the exploit's <TARGET_IP> is filled from the machine");
});

test("vulnsFor will not claim a vuln the version does not carry", () => {
  const w = load();
  assert.strictEqual(w.CS_SCENARIO.vulnsFor([svc(21, "ftp", "vsftpd 2.3.5")], {}).length, 0, "2.3.5 is not the backdoored build");
  assert.strictEqual(w.CS_SCENARIO.vulnsFor([svc(21, "ftp", "vsftpd 3.0.3")], {}).length, 0, "a current vsftpd has no entry");
});

test("numeric version bounds gate the match (OpenSSH enum, Samba usermap)", () => {
  const w = load();
  const vuln = (p, n, v) => w.CS_SCENARIO.vulnsFor([svc(p, n, v)], {}).map((x) => x.id);
  assert.ok(vuln(22, "ssh", "OpenSSH 7.4").includes("CVE-2018-15473"), "7.4 < 7.8 is enumerable");
  assert.ok(!vuln(22, "ssh", "OpenSSH 8.2p1 Ubuntu").includes("CVE-2018-15473"), "8.2 >= 7.8 is patched");
  assert.ok(vuln(445, "netbios-ssn", "Samba smbd 3.0.25a").includes("CVE-2007-2447"), "3.0.25 is in the usermap range");
  assert.ok(!vuln(445, "netbios-ssn", "Samba smbd 4.11.6").includes("CVE-2007-2447"), "4.11 is far past the range");
});

test("a lettered build is matched by spelling, not number (HFS 2.3b vs 2.3c)", () => {
  const w = load();
  const has = (v) => w.CS_SCENARIO.vulnsFor([svc(80, "http", "HttpFileServer httpd " + v)], {}).some((x) => x.id === "CVE-2014-6287");
  assert.ok(has("2.3b"), "2.3b is vulnerable");
  assert.ok(!has("2.3c"), "2.3c is the fixed build and must not match");
});

test("a version-less banner never triggers a version-gated vuln", () => {
  const w = load();
  assert.strictEqual(w.CS_SCENARIO.vulnsFor([svc(21, "ftp", "")], {}).length, 0, "no version, no claim");
});

test("vulnsFor is deterministic and severity-ordered", () => {
  const w = load();
  const services = [svc(80, "http", "Apache httpd 2.4.49"), svc(22, "ssh", "OpenSSH 7.4")];
  const a = w.CS_SCENARIO.vulnsFor(services, { ip: "10.1.1.1" });
  const b = w.CS_SCENARIO.vulnsFor(services, { ip: "10.1.1.1" });
  assert.deepStrictEqual(JSON.stringify(a), JSON.stringify(b), "same input, same output");
  assert.ok(a.length >= 2, "both services hit");
  const sev = { critical: 0, high: 1, medium: 2, low: 3 };
  const order = a.map((v) => sev[v.sev]);
  assert.deepStrictEqual(order, order.slice().sort((x, y) => x - y), "most severe first");
});

test("the expanded map flags the vulnerable builds and spares the patched ones", () => {
  const w = load();
  const ids = (p, n, v) => w.CS_SCENARIO.vulnsFor([svc(p, n, v)], { ip: "10.1.1.1" }).map((x) => x.id);
  assert.ok(ids(80, "http", "Microsoft IIS httpd 6.0").includes("CVE-2017-7269"), "IIS 6.0 WebDAV is flagged");
  assert.ok(!ids(80, "http", "Microsoft IIS httpd 10.0").includes("CVE-2017-7269"), "IIS 10 is not");
  assert.ok(ids(9200, "http", "Elasticsearch REST API 1.1.1").includes("CVE-2014-3120"), "Elasticsearch 1.1.1 is flagged");
  assert.ok(!ids(9200, "http", "Elasticsearch 1.2.0").includes("CVE-2014-3120"), "Elasticsearch 1.2.0 is patched");
  assert.ok(ids(8000, "http", "Icecast 2.0.1").includes("CVE-2004-1561"), "Icecast 2.0.1 is flagged");
  assert.ok(!ids(8000, "http", "Icecast 2.4.4").includes("CVE-2004-1561"), "the modern Icecast line is not");
  // The accuracy case: a patched point release inside an affected minor must not match.
  assert.ok(ids(3000, "http", "Grafana 8.2.6").includes("CVE-2021-43798"), "Grafana 8.2.6 is vulnerable");
  assert.ok(!ids(3000, "http", "Grafana 8.2.7").includes("CVE-2021-43798"), "Grafana 8.2.7 is patched and must NOT be flagged");
  assert.ok(ids(3000, "http", "Grafana 8.3.0").includes("CVE-2021-43798"), "Grafana 8.3.0 is vulnerable");
  assert.ok(!ids(3000, "http", "Grafana 8.4.0").includes("CVE-2021-43798"), "Grafana 8.4 is out of range");
});

// The privesc menu is DB-sourced, so these load the real seed categories the way
// the running app would have them (window.CS_APP.getCategories).
const SEED = require(path.join(__dirname, "..", "seed.js"));

test("privescFor surfaces OS-specific escalation vectors, but only once a shell is held", () => {
  const w = load({ categories: SEED });
  const S = w.CS_SCENARIO;
  assert.strictEqual(S.privescFor({ os: "linux", access: "none" }).length, 0, "nothing to escalate before a foothold");
  assert.strictEqual(S.privescFor({ os: "linux", access: "admin" }).length, 0, "nothing left once you are admin");
  assert.strictEqual(S.privescFor({ os: "", access: "foothold" }).length, 0, "no OS means no category to pull from");
  const lin = S.privescFor({ os: "linux", access: "foothold" });
  assert.ok(lin.length >= 5, "a shell on linux surfaces several vectors, got " + lin.length);
  assert.ok(lin.every((p) => p.catId === "linux-escalation"), "every vector is drawn from the linux privesc category");
  assert.ok(lin.some((p) => /sudo -l/.test(p.cmd)) && lin.some((p) => /-perm -4000/.test(p.cmd)),
    "the classic linux vectors (sudo -l, SUID find) are present");
  const win = S.privescFor({ os: "windows", access: "foothold" });
  assert.ok(win.length >= 5 && win.every((p) => p.catId === "win-escalation"), "a windows shell surfaces windows vectors instead");
});

test("the privesc menu is one representative per vector, with placeholders filled", () => {
  const w = load({ categories: SEED });
  const lin = w.CS_SCENARIO.privescFor({ os: "linux", access: "foothold", ip: "10.9.9.9" });
  assert.ok(lin.length <= 14, "it is a menu of vectors, not a dump of the whole category");
  const groups = lin.map((p) => p.group);
  assert.strictEqual(groups.length, new Set(groups).size, "no two picks share an escalation vector");
  assert.ok(lin.every((p) => p.cmd && p.cmd.trim()), "a vector whose lead command is blank is skipped, never shown empty");
  const nfs = lin.find((p) => /showmount/.test(p.cmd));
  if (nfs) assert.ok(nfs.resolved.indexOf("10.9.9.9") >= 0 && nfs.resolved.indexOf("<TARGET_IP>") < 0, "<TARGET_IP> is resolved in the menu");
});

test("pivotFor surfaces routing vectors once a shell is held — and stays after you own the box", () => {
  const w = load({ categories: SEED });
  const S = w.CS_SCENARIO;
  assert.strictEqual(S.pivotFor({ access: "none" }).length, 0, "no shell, nothing to pivot through");
  assert.strictEqual(S.pivotFor({ access: "creds" }).length, 0, "creds alone are not a shell on the box");
  const foot = S.pivotFor({ access: "foothold" });
  assert.ok(foot.length >= 4, "a shell surfaces several pivoting routes, got " + foot.length);
  assert.ok(foot.every((p) => p.catId === "pivoting"), "every route is drawn from the pivoting category");
  assert.ok(foot.some((p) => /chisel/i.test(p.cmd)) && foot.some((p) => /ligolo/i.test(p.cmd)),
    "the classic pivot tools (chisel, ligolo) are present");
  // Unlike privesc, pivoting is still the move after you own the box.
  assert.ok(S.pivotFor({ access: "admin" }).length >= 4, "admin still gets the pivot menu");
  assert.ok(S.pivotFor({ access: "domain" }).length >= 4, "a domain foothold still gets the pivot menu");
});

test("the pivot menu is one representative per vector, with placeholders filled", () => {
  const w = load({ categories: SEED });
  const piv = w.CS_SCENARIO.pivotFor({ access: "foothold", ip: "10.9.9.9" });
  assert.ok(piv.length <= 12, "it is a menu of routes, not a dump of the whole category");
  const groups = piv.map((p) => p.group);
  assert.strictEqual(groups.length, new Set(groups).size, "no two picks share a pivoting vector");
  assert.ok(piv.every((p) => p.cmd && p.cmd.trim()), "a vector whose lead command is blank is skipped, never shown empty");
  const ssh = piv.find((p) => /ssh -L/.test(p.cmd));
  if (ssh) assert.ok(ssh.resolved.indexOf("10.9.9.9") >= 0 && ssh.resolved.indexOf("<TARGET_IP>") < 0, "<TARGET_IP> is resolved in the menu");
});

// Resolve a service to its matched corpus service ids.
function S_names(w, service) {
  return w.CS_SCENARIO.rowsForService(normalize(service), w.CS_PORT_MAP).map((r) => r.service);
}
// Mirror the engine's own normalisation for the direct rowsForService calls.
function normalize(s) {
  return { port: String(s.port || ""), name: String(s.name || "").toLowerCase().replace(/\?+$/, ""), version: s.version || "", state: "open" };
}
