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

test("the exported machine report embeds the attack plan, IP-resolved", () => {
  const env = boot();
  const md = env.app.machineToMarkdown(machine());
  const i = md.indexOf("## " + env.app.t("planTitle"));
  assert.ok(i >= 0, "the report carries an Attack Plan section");
  const planPart = md.slice(i);
  assert.ok(/`[^`\n]*10\.10\.11\.5[^`\n]*`/.test(planPart),
    "a plan command under the heading is rendered with <TARGET_IP> resolved to the machine IP");
});

test("a vulnerable build is flagged in the exported report with its CVE", () => {
  const env = boot();
  const md = env.app.machineToMarkdown(machine({
    services: [{ port: "21", proto: "tcp", state: "open", name: "ftp", version: "vsftpd 2.3.4" }],
  }));
  assert.ok(md.includes(env.app.t("planVulns")), "the known-exploits subsection is present in the report");
  assert.ok(md.includes("CVE-2011-2523"), "the CVE id rides along in the report");
  assert.ok(md.includes("[CRITICAL]"), "the severity is labelled in the report");
});

test("capturing a foothold reveals an OS-aware privilege-escalation menu", () => {
  const env = boot();
  env.app.setCategories(require(path.join(PUBLIC_DIR, "..", "seed.js")));
  const sec = env.app.buildAttackPlanSection(machine({
    os: "Linux", userFlag: { value: "u", capturedAt: "t" },
    services: [{ port: "22", proto: "tcp", state: "open", name: "ssh", version: "" }],
  }));
  const pe = sec.querySelector(".plan-privesc");
  assert.ok(pe, "a held shell reveals the privesc block");
  assert.ok(sec.querySelectorAll(".plan-pe-row").length >= 3, "several escalation vectors are listed");
  assert.ok(/Linux/.test(pe.textContent), "the block names the target OS");
});

test("the privesc menu stays hidden until a shell is actually held", () => {
  const env = boot();
  env.app.setCategories(require(path.join(PUBLIC_DIR, "..", "seed.js")));
  const sec = env.app.buildAttackPlanSection(machine({
    os: "Linux",
    services: [{ port: "22", proto: "tcp", state: "open", name: "ssh", version: "" }],
  }));
  assert.strictEqual(sec.querySelector(".plan-privesc"), null, "no foothold, no privesc block");
});

test("the privesc menu lights up from an inferred OS when the field was never set", () => {
  const env = boot();
  env.app.setCategories(require(path.join(PUBLIC_DIR, "..", "seed.js")));
  const sec = env.app.buildAttackPlanSection(machine({
    os: "",   // never set by hand, as on a freshly pasted scan
    userFlag: { value: "u", capturedAt: "t" },
    services: [{ port: "22", proto: "tcp", state: "open", name: "ssh", version: "OpenSSH 8.2p1 Ubuntu 4ubuntu0.5" }],
  }));
  const pe = sec.querySelector(".plan-privesc");
  assert.ok(pe, "an Ubuntu banner infers Linux and reveals the privesc menu with the OS field blank");
  assert.ok(/Linux/.test(pe.textContent), "the inferred OS is named in the block");
});

test("a foothold machine's exported report carries the privesc menu", () => {
  const env = boot();
  env.app.setCategories(require(path.join(PUBLIC_DIR, "..", "seed.js")));
  const md = env.app.machineToMarkdown(machine({ os: "Linux", userFlag: { value: "u", capturedAt: "t" } }));
  assert.ok(md.includes(env.app.t("planPrivesc")), "the privilege-escalation section rides along in the report once a shell is held");
});

test("a held shell also reveals a pivoting / lateral-movement menu", () => {
  const env = boot();
  env.app.setCategories(require(path.join(PUBLIC_DIR, "..", "seed.js")));
  const sec = env.app.buildAttackPlanSection(machine({
    os: "Linux", userFlag: { value: "u", capturedAt: "t" },
    services: [{ port: "22", proto: "tcp", state: "open", name: "ssh", version: "" }],
  }));
  const pv = sec.querySelector(".plan-pivot");
  assert.ok(pv, "a foothold reveals the pivot block");
  assert.ok(sec.querySelectorAll(".plan-pv-row").length >= 3, "several routing vectors are listed");
});

test("the pivot menu stays hidden until a shell is held", () => {
  const env = boot();
  env.app.setCategories(require(path.join(PUBLIC_DIR, "..", "seed.js")));
  const sec = env.app.buildAttackPlanSection(machine({
    os: "Linux",
    services: [{ port: "22", proto: "tcp", state: "open", name: "ssh", version: "" }],
  }));
  assert.strictEqual(sec.querySelector(".plan-pivot"), null, "no shell, no pivot block");
});

test("a foothold machine's exported report carries the pivot menu", () => {
  const env = boot();
  env.app.setCategories(require(path.join(PUBLIC_DIR, "..", "seed.js")));
  const md = env.app.machineToMarkdown(machine({ os: "Linux", userFlag: { value: "u", capturedAt: "t" } }));
  assert.ok(md.includes(env.app.t("planPivot")), "the pivoting section rides along in the report once a shell is held");
});

test("owning the box reveals a post-exploitation loot menu, hidden at a mere foothold", () => {
  const env = boot();
  env.app.setCategories(require(path.join(PUBLIC_DIR, "..", "seed.js")));
  const owned = env.app.buildAttackPlanSection(machine({
    os: "Linux", rootFlag: { value: "r", capturedAt: "t" },
    services: [{ port: "22", proto: "tcp", state: "open", name: "ssh", version: "" }],
  }));
  const lt = owned.querySelector(".plan-loot");
  assert.ok(lt, "a captured root flag reveals the loot block");
  assert.ok(owned.querySelectorAll(".plan-lt-row").length >= 3, "several loot vectors are listed");
  const foot = env.app.buildAttackPlanSection(machine({
    os: "Linux", userFlag: { value: "u", capturedAt: "t" },
    services: [{ port: "22", proto: "tcp", state: "open", name: "ssh", version: "" }],
  }));
  assert.strictEqual(foot.querySelector(".plan-loot"), null, "a foothold alone shows no loot block");
});

test("an owned machine's exported report carries the loot menu", () => {
  const env = boot();
  env.app.setCategories(require(path.join(PUBLIC_DIR, "..", "seed.js")));
  const md = env.app.machineToMarkdown(machine({ os: "Linux", rootFlag: { value: "r", capturedAt: "t" } }));
  assert.ok(md.includes(env.app.t("planLoot")), "the loot section rides along in the report once the box is owned");
});

test("importing an nmap paste fills a blank OS field from the scan", () => {
  const env = boot();
  env.app.setCategories(require(path.join(PUBLIC_DIR, "..", "seed.js")));
  const m = machine({ os: "", services: [] });
  env.app.setMachines([m]);
  const sec = env.app.buildServicesSection(m);
  const ta = sec.querySelector("textarea.machine-textarea");
  assert.ok(ta, "the import textarea is present");
  ta.value = "PORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 8.2p1\n80/tcp   open  http    Apache httpd 2.4.41\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\n";
  const importGo = [...sec.querySelectorAll("button")].find((b) => b.textContent === env.app.t("importDo"));
  assert.ok(importGo, "the Import button is present");
  importGo.dispatchEvent({ type: "click", preventDefault() {}, stopPropagation() {} });
  assert.strictEqual(m.os, "Linux", "the scan's Service Info OS line filled the blank OS field");
  assert.ok(m.services.some((s) => s.port === "22") && m.services.some((s) => s.port === "80"), "the services were imported alongside it");
});

test("the exported report captures a multi-host engagement with each host's known exploit", () => {
  const env = boot();
  env.app.setCategories(require(path.join(PUBLIC_DIR, "..", "seed.js")));
  const dc = {
    id: "dc1", name: "DC01", ip: "10.10.10.20", os: "Windows",
    services: [{ port: "445", proto: "tcp", state: "open", name: "smb", version: "Samba smbd 3.0.20" }],
    credentials: [], userFlag: null, rootFlag: null, checklist: [],
  };
  const eng = machine({ id: "eng1", hosts: [{ machineId: "dc1", role: "DC", links: [] }] });
  env.app.setMachines([dc, eng]);
  const md = env.app.machineToMarkdown(eng);
  assert.ok(md.includes("## " + env.app.t("hosts")), "the report has an engagement hosts section");
  assert.ok(md.includes("DC01") && md.includes("(DC)"), "each linked host is listed with its role");
  assert.ok(md.includes("CVE-2007-2447"), "a host's known exploit rides along in the report");
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
