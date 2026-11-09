"use strict";
// Next Move — the situation model and the ranking.
//
// The value of this view is entirely in whether the ranking is RIGHT, so these
// tests assert behaviour ("credentials change what is offered") rather than
// shape ("something rendered"). They also pin the two bugs found while building
// it, both of which were invisible from the outside:
//   * `var` hoisting made load() throw into its own catch, so the saved
//     situation silently reset on every page load;
//   * a naive "a web port is open" test sent an ssh+http box — the single most
//     common lab shape there is — to the web-application playbook.

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const { loadSession } = require("./helpers/load-session.js");
const { serialize, assertInert } = require("./helpers/serialize-dom.js");

const MODULE = path.join(__dirname, "..", "public", "nextmove.js");
const SRC = fs.readFileSync(MODULE, "utf8");

// Boot app.js + session-data.js + session.js the way the browser does, seed the
// saved situation, then evaluate nextmove.js on top — the module reads its
// state at load time, which is exactly the path the hoisting bug broke.
function boot(situation) {
  const env = loadSession({});
  const state = Object.assign(
    { target: "10.10.11.5", os: "", access: "none", services: [], tried: {}, scanOpen: false },
    situation || {}
  );
  env.window.localStorage.setItem("cs-nextmove", JSON.stringify(state));
  delete env.window.CS_NEXT;
  vm.runInThisContext(SRC, { filename: "nextmove.js" });
  return { env, mod: env.window.CS_NEXT, container: env.document.createElement("div") };
}
const svc = (port, name) => ({ port: String(port), name: name || "", proto: "tcp", state: "open" });

test("the module registers and reads its saved situation back", () => {
  const { mod } = boot({ services: [svc(445, "smb")], access: "creds", os: "windows" });
  assert.ok(mod, "window.CS_NEXT is the entry point app.js calls");
  assert.strictEqual(typeof mod.render, "function");
  // If load() throws into its own catch the situation resets to the default and
  // this reads "recon" — which is precisely how the hoisting bug presented.
  assert.strictEqual(mod.phaseOf(), "foothold", "a saved access level must survive a reload");
});

test("focus: a host port beats an open web port", () => {
  const cases = [
    [[svc(22, "ssh"), svc(80, "http")], "network", "the most common lab shape is not a web-app engagement"],
    [[svc(80, "http"), svc(443, "https")], "webapp", "nothing but web ports is the only pure web surface"],
    [[svc(8080, "http-proxy")], "webapp", ""],
    [[svc(445, "smb"), svc(3389, "rdp")], "network", ""],
    [[svc(88, "kerberos"), svc(389, "ldap"), svc(445, "smb")], "ad", "Kerberos makes it a domain problem"],
    [[], "network", "no services is recon, not a web app"],
  ];
  for (const [services, want, why] of cases) {
    const { mod } = boot({ services });
    assert.strictEqual(mod.focusOf(), want, why || ("focus for " + services.map((s) => s.port).join(",")));
  }
});

test("focus: domain admin is an AD problem whatever the port list says", () => {
  const { mod } = boot({ access: "domain", services: [svc(80, "http")] });
  assert.strictEqual(mod.focusOf(), "ad");
});

test("phase follows access, and privesc follows the OS", () => {
  const base = { services: [svc(22, "ssh")] };
  assert.strictEqual(boot(Object.assign({}, base, { access: "none" })).mod.phaseOf(), "enumeration");
  assert.strictEqual(boot({ access: "none", services: [] }).mod.phaseOf(), "recon");
  assert.strictEqual(boot(Object.assign({}, base, { access: "creds" })).mod.phaseOf(), "foothold");
  assert.strictEqual(boot(Object.assign({}, base, { access: "foothold", os: "linux" })).mod.phaseOf(), "privesc-linux");
  assert.strictEqual(boot(Object.assign({}, base, { access: "foothold", os: "windows" })).mod.phaseOf(), "privesc-windows");
  assert.strictEqual(boot(Object.assign({}, base, { access: "admin" })).mod.phaseOf(), "lateral");
});

test("credentials change what is offered, in both directions", () => {
  const services = [svc(88, "kerberos"), svc(389, "ldap"), svc(445, "smb")];
  const without = boot({ services, access: "none", os: "windows" }).mod.buildMoves();
  const with_ = boot({ services, access: "creds", os: "windows" }).mod.buildMoves();

  assert.ok(without.enum.length > 0, "an unauthenticated AD target has plenty to enumerate");
  assert.strictEqual(without.creds.length, 0, "credential-gated commands must not be offered before you hold any");
  assert.ok(with_.creds.length > 0, "holding credentials must unlock the credentialed commands");

  // The reverse gate matters just as much: null-session probes are noise once
  // you are authenticated, and offering them teaches the user to skim.
  const noCredsOffered = with_.enum.concat(with_.cond).some((m) => /no creds|unauthenticated/i.test(m.when || ""));
  assert.strictEqual(noCredsOffered, false, "no-creds commands must drop away once credentials are held");
});

test("every offered move carries a command and a source service", () => {
  const mv = boot({ services: [svc(445, "smb"), svc(80, "http")], access: "creds" }).mod.buildMoves();
  const all = mv.enum.concat(mv.creds, mv.cond);
  assert.ok(all.length > 0);
  for (const m of all) {
    assert.ok(m.raw && m.raw.trim(), "a move with no command is not a move");
    assert.ok(m.service, "a move must say which service it came from");
  }
});

test("a pasted vulnerable version surfaces a known-exploit callout above the moves", () => {
  const vulnSvc = { port: "21", name: "ftp", version: "vsftpd 2.3.4", proto: "tcp", state: "open" };
  const { mod, container } = boot({ services: [vulnSvc], target: "10.10.11.9" });
  // Stack the version→exploit map + engine the browser also loads on the page,
  // so the callout is proven to reuse the SAME map as the machine Attack Plan.
  vm.runInThisContext(fs.readFileSync(path.join(__dirname, "..", "public", "vuln-map.js"), "utf8"), { filename: "vuln-map.js" });
  vm.runInThisContext(fs.readFileSync(path.join(__dirname, "..", "public", "scenario.js"), "utf8"), { filename: "scenario.js" });
  mod.render(container);
  const vg = container.querySelector(".nm-group-vulns");
  assert.ok(vg, "the known-exploit group renders for vsftpd 2.3.4");
  assert.ok(vg.textContent.includes("CVE-2011-2523"), "the CVE id rides along");
  assert.ok(container.querySelector(".nm-vuln.sev-critical"), "it carries the critical severity class");
  assert.ok(vg.textContent.includes("10.10.11.9"), "the exploit command is resolved to the target IP");
});

test("Use active target carries version + access, so the callout and menus light up", () => {
  const { env, mod, container } = boot({});
  env.app.setCategories(require(path.join(__dirname, "..", "seed.js")));
  env.app.setMachines([{
    id: "mt1", ip: "10.10.11.9", os: "",   // OS blank — must be inferred from the banners
    services: [
      { port: "21", proto: "tcp", state: "open", name: "ftp", version: "vsftpd 2.3.4" },
      { port: "22", proto: "tcp", state: "open", name: "ssh", version: "OpenSSH 8.2p1 Ubuntu" },
    ],
    credentials: [], userFlag: { value: "u", capturedAt: "t" }, rootFlag: null,
  }]);
  env.window.CS_APP.setActiveTarget("mt1");
  // Setting the active target also fills the quick-fill RHOST, so commands copied
  // from the category browser (not just the plan) land on the same IP.
  assert.strictEqual(env.window.localStorage.getItem("cs-ip-RHOST"), "10.10.11.9", "the active target's IP flows into the var bar");
  vm.runInThisContext(fs.readFileSync(path.join(__dirname, "..", "public", "vuln-map.js"), "utf8"), { filename: "vuln-map.js" });
  vm.runInThisContext(fs.readFileSync(path.join(__dirname, "..", "public", "scenario.js"), "utf8"), { filename: "scenario.js" });
  mod.render(container);
  const useBtn = [...container.querySelectorAll(".nm-btn-ghost")].find((b) => !b.classList.contains("nm-clear"));
  assert.ok(useBtn, "the Use active target button is present when a target is active");
  useBtn.dispatchEvent({ type: "click", preventDefault() {}, stopPropagation() {} });
  // Version carried → the known-exploit callout fires on vsftpd 2.3.4.
  const vg = container.querySelector(".nm-group-vulns");
  assert.ok(vg && vg.textContent.includes("CVE-2011-2523"), "the pulled version surfaces its known exploit");
  // Access (foothold) + inferred OS (linux) → the post-foothold menus appear.
  assert.ok(container.querySelector(".nm-group-menu"), "a foothold target lights up the post-foothold menus");
  assert.ok(container.textContent.includes("sudo -l"), "the linux privesc vector rode in with the mapped access + inferred OS");
});

test("a held shell answers with the post-foothold menus, not silence", () => {
  const { env, mod, container } = boot({ services: [svc(22, "ssh")], access: "foothold", os: "linux" });
  env.app.setCategories(require(path.join(__dirname, "..", "seed.js")));
  // The menus are DB-sourced, so stack the engine on the page like the browser does.
  vm.runInThisContext(fs.readFileSync(path.join(__dirname, "..", "public", "vuln-map.js"), "utf8"), { filename: "vuln-map.js" });
  vm.runInThisContext(fs.readFileSync(path.join(__dirname, "..", "public", "scenario.js"), "utf8"), { filename: "scenario.js" });
  mod.render(container);
  assert.ok(container.querySelector(".nm-group-menu"), "a foothold on linux surfaces at least one post-foothold menu group");
  assert.ok(container.querySelectorAll(".nm-menu-row").length >= 3, "several escalation/pivot vectors are listed");
  assert.ok(container.textContent.includes("sudo -l"), "the classic linux privesc vector is among them");
  assert.ok(container.querySelector(".nm-group-copy"), "a multi-command group offers a copy-all button");
});

test("parsing a scan fills the OS toggle when it was still unknown", () => {
  const { mod, container } = boot({ services: [], os: "", scanOpen: true });
  mod.render(container);
  const ta = container.querySelector("textarea.nm-textarea");
  assert.ok(ta, "the scan textarea shows when the paste panel is open");
  ta.value = "21/tcp open ftp vsftpd 2.3.4\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\n";
  const parseBtn = container.querySelector(".nm-scan-bar .nm-btn-primary") || container.querySelector(".nm-btn-primary");
  assert.ok(parseBtn, "the Parse button is present");
  parseBtn.dispatchEvent({ type: "click", preventDefault() {}, stopPropagation() {} });
  const linuxBtn = [...container.querySelectorAll(".nm-seg-btn")].find((b) => b.textContent === "linux");
  assert.ok(linuxBtn && linuxBtn.classList.contains("on"), "the OS toggle is set to linux from the scan's Service Info line");
});

test("conditional commands are surfaced WITH their condition, never silently dropped", () => {
  const mv = boot({ services: [svc(161, "snmp"), svc(445, "smb"), svc(88, "kerberos")], access: "none" }).mod.buildMoves();
  assert.ok(mv.cond.length > 0, "the probe corpus carries free-text conditions; they belong in their own group");
  for (const m of mv.cond) {
    assert.ok(m.when && m.when.trim(), "a conditional move must keep the condition that makes it conditional");
  }
});

test("bucketOf decides only what is mechanically decidable", () => {
  const { mod } = boot({});
  assert.strictEqual(mod.bucketOf("always"), "enum");
  assert.strictEqual(mod.bucketOf(""), "enum");
  assert.strictEqual(mod.bucketOf("if creds known"), "creds");
  assert.strictEqual(mod.bucketOf("if no creds"), "nocreds");
  assert.strictEqual(mod.bucketOf("if anonymous allowed"), "nocreds");
  // Anything the corpus author wrote for a human stays conditional rather than
  // being guessed at.
  assert.strictEqual(mod.bucketOf("if cipher zero reported"), "cond");
  assert.strictEqual(mod.bucketOf("if jep290 missing or gadget available"), "cond");
});

test("the situation drives a stuck list that matches focus and phase", () => {
  const { mod } = boot({ services: [svc(22, "ssh")], access: "foothold", os: "linux" });
  const mv = mod.buildMoves();
  assert.ok(mv.stuck, "a stuck list must exist for every reachable focus/phase pair");
  assert.strictEqual(mv.stuck.focus, "network");
  assert.strictEqual(mv.stuck.phase, "privesc-linux");
  assert.ok(mv.stuck.items.length > 0);
  for (const it of mv.stuck.items) {
    assert.ok(it.text && it.text.trim(), "a hint needs something to say");
    assert.ok(it.why && it.why.trim(), "the `why` is what makes a hint credible rather than patronising");
  }
});

test("ports with no probe are reported, not swallowed", () => {
  const mv = boot({ services: [svc(64999, "weird-thing")] }).mod.buildMoves();
  assert.strictEqual(mv.enum.length, 0);
  assert.strictEqual(mv.uncovered.length, 1, "a port the corpus cannot help with must be said out loud");
  assert.strictEqual(mv.uncovered[0].port, "64999");
});

test("render() produces inert markup from a hostile situation", () => {
  const hostile = '" onmouseover="alert(1)" x="';
  const { mod, container } = boot({
    target: hostile,
    services: [
      { port: "445", name: '<script>alert(1)</script>', proto: "tcp", state: "open" },
      { port: "80", name: '"><img src=x onerror=alert(1)>', proto: "tcp", state: "open" },
    ],
    access: "creds",
  });
  mod.render(container);
  assertInert(serialize(container));

  // Walk the real tree rather than grepping the serialized string. A payload
  // sitting in TEXT position — `nxc smb " onmouseover="…` inside a <code> — is
  // inert by construction but matches a naive /\son\w+=/ regex, so the string
  // test reports a sink that does not exist. Attribute names are the only
  // place an event handler can actually be.
  const seen = [];
  (function walk(node) {
    if (!node) return;
    const attrs = node.attributes;
    if (attrs) {
      for (const name of Object.keys(attrs)) {
        if (/^on/i.test(name)) seen.push(node.tagName + "[" + name + "]");
      }
    }
    (node.childNodes || node.children || []).forEach(walk);
  })(container);
  assert.deepStrictEqual(seen, [], "no event-handler attribute may ever be produced");
});

test("render() survives an absent corpus and does not throw", () => {
  const { env, mod, container } = boot({ services: [svc(445, "smb")] });
  env.window.CS_SESSION_DATA = undefined;
  assert.doesNotThrow(() => mod.render(container), "the view can be opened before the 600KB corpus arrives");
});

test("navBadge reports the situation size and nothing when empty", () => {
  assert.strictEqual(boot({ services: [] }).mod.navBadge(), "");
  assert.strictEqual(boot({ services: [svc(22), svc(80), svc(445)] }).mod.navBadge(), "3");
});
