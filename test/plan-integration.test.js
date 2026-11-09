"use strict";
// The Attack Plan panel, rendered the way the browser renders it: app.js booted in
// the DOM harness with the real corpus (port-map.js) and engine (scenario.js) loaded
// on top, exactly as index.html stacks them. This proves the wiring end to end — a
// pasted-nmap machine produces copyable, IP-resolved steps on the machine page — not
// just that the engine is correct in isolation (test/scenario.test.js does that).

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const { loadApp, PUBLIC_DIR } = require("./helpers/load-app.js");

function boot() {
  const env = loadApp({});
  // Stack the two page scripts the browser loads after app.js. They assign their
  // globals onto window, which the harness exposes on this realm.
  vm.runInThisContext(fs.readFileSync(path.join(PUBLIC_DIR, "port-map.js"), "utf8"), { filename: "port-map.js" });
  vm.runInThisContext(fs.readFileSync(path.join(PUBLIC_DIR, "vuln-map.js"), "utf8"), { filename: "vuln-map.js" });
  vm.runInThisContext(fs.readFileSync(path.join(PUBLIC_DIR, "scenario.js"), "utf8"), { filename: "scenario.js" });
  return env;
}

const machine = (over) => Object.assign({
  id: "m1", ip: "10.10.11.5", os: "Linux",
  services: [
    { port: "80", proto: "tcp", state: "open", name: "http", version: "" },
    { port: "22", proto: "tcp", state: "open", name: "ssh", version: "" },
    { port: "4444", proto: "tcp", state: "open", name: "unknown", version: "" },
  ],
  credentials: [], userFlag: null, rootFlag: null,
}, over || {});

test("the machine Attack Plan panel renders real, IP-resolved steps from the scan", () => {
  const env = boot();
  const sec = env.app.buildAttackPlanSection(machine());
  const cmds = [...sec.querySelectorAll(".plan-cmd")];
  assert.ok(cmds.length >= 3, "the panel renders copyable step commands, got " + cmds.length);
  assert.ok(sec.querySelector(".plan-phase"), "steps carry a phase badge");
  assert.ok(cmds.some((b) => b.textContent.includes("10.10.11.5")),
    "<TARGET_IP> is resolved to the machine IP in the rendered commands");
  // 4444 has no corpus row, and the panel says so rather than hiding it.
  const uncovered = sec.querySelector(".plan-uncovered");
  assert.ok(uncovered && uncovered.textContent.includes("4444"), "an unmatched port is surfaced as uncovered");
});

test("a vulnerable version string surfaces a known-exploit callout at the top of the plan", () => {
  const env = boot();
  const sec = env.app.buildAttackPlanSection(machine({
    services: [{ port: "21", proto: "tcp", state: "open", name: "ftp", version: "vsftpd 2.3.4" }],
  }));
  const vuln = sec.querySelector(".plan-vuln");
  assert.ok(vuln, "the panel renders a known-exploit card for vsftpd 2.3.4");
  assert.ok(vuln.classList.contains("sev-critical"), "it is flagged critical");
  assert.ok(sec.textContent.includes("CVE-2011-2523"), "the CVE id is shown");
  const exploit = vuln.querySelector(".plan-cmd");
  assert.ok(exploit, "the exploit command is copyable");
  assert.ok(exploit.textContent.includes("10.10.11.5"), "the exploit's target is resolved to the machine IP");
});

test("the panel degrades to an empty-state when there are no services", () => {
  const env = boot();
  const sec = env.app.buildAttackPlanSection(machine({ services: [] }));
  assert.ok(sec.querySelector(".plan-empty"), "an empty machine shows the import hint, not a crash");
  assert.strictEqual(sec.querySelectorAll(".plan-cmd").length, 0);
});

test("access and findings are derived from the machine's vault and flags", () => {
  const env = boot();
  const ctx = env.app;
  assert.strictEqual(ctx.machineAttackCtx(machine()).access, "none", "nothing banked yet");
  assert.strictEqual(ctx.machineAttackCtx(machine({ credentials: [{ username: "bob", secret: "pw", valid: true }] })).access, "creds",
    "a filled vault means you hold credentials");
  assert.strictEqual(ctx.machineAttackCtx(machine({ userFlag: { value: "x", capturedAt: "t" } })).access, "foothold",
    "a captured user flag means a shell");
  assert.strictEqual(ctx.machineAttackCtx(machine({ rootFlag: { value: "x", capturedAt: "t" } })).access, "admin",
    "a captured root flag means admin");
  assert.strictEqual(ctx.machineAttackCtx(machine({ os: "Windows Server 2019" })).os, "windows");
});
