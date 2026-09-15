#!/usr/bin/env node
// ============================================================================
// screenshots.js — regenerate assets/*.webp from the real, running app.
//
// The README's screenshots were hand-captured once and then quietly became
// fiction: they showed 2168 commands when the corpus held 5040, the previous
// visual identity, and a sidebar with no Machines, Sessions or Next Move in it.
// A screenshot nobody can reproduce is a screenshot nobody updates, so this
// drives the app the same way a person would — headless Chrome over the
// DevTools protocol, no Puppeteer, no dependency at all.
//
//   node scripts/screenshots.js                  # shoot the live Pages build
//   node scripts/screenshots.js --base http://localhost:3000/
//   node scripts/screenshots.js --only browser,palette
//   node scripts/screenshots.js --keep-open      # leave Chrome up to debug
//
// Requires Chrome or Edge on PATH or at a standard location (CHROME_PATH wins),
// and Node 18+ for fetch / Node 22+ for the global WebSocket used to speak CDP.
// ============================================================================
"use strict";
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "assets");
const { buildFixture } = require(path.join(__dirname, "demo-fixture.js"));

// ── args ──
const argv = process.argv.slice(2);
function flag(name, fallback) {
  const i = argv.indexOf("--" + name);
  if (i === -1) return fallback;
  const next = argv[i + 1];
  return next && !next.startsWith("--") ? next : true;
}
const BASE = String(flag("base", "https://halilibrahimd27.github.io/cheat-sheet/"));
const ONLY = flag("only", null);
const KEEP_OPEN = !!flag("keep-open", false);
const ONLY_SET = ONLY && ONLY !== true ? new Set(String(ONLY).split(",").map(s => s.trim())) : null;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const log = (m) => process.stdout.write(m + "\n");

// ── Find a browser ──
function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
  ].filter(Boolean);
  for (const c of candidates) { if (fs.existsSync(c)) return c; }
  throw new Error("No Chrome/Edge found. Set CHROME_PATH to the executable.");
}

async function launch() {
  const exe = findBrowser();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cs-shots-"));
  const proc = spawn(exe, [
    "--headless=new", "--remote-debugging-port=0", "--user-data-dir=" + dir,
    "--no-first-run", "--no-default-browser-check", "--disable-extensions",
    "--disable-background-networking", "--disable-sync", "--mute-audio",
    // Scrollbars are chrome, not product: they pin a 14px grey strip down the
    // right edge of every shot and change width between platforms.
    "--hide-scrollbars",
    "--force-color-profile=srgb", "--font-render-hinting=none",
    "about:blank",
  ], { stdio: ["ignore", "ignore", "ignore"] });
  const portFile = path.join(dir, "DevToolsActivePort");
  for (let i = 0; i < 150; i++) {
    if (fs.existsSync(portFile)) {
      const first = fs.readFileSync(portFile, "utf8").split("\n")[0];
      if (first && first.trim()) return { proc, dir, port: Number(first.trim()) };
    }
    await sleep(100);
  }
  proc.kill();
  throw new Error("Chrome never published a DevTools port");
}

// ── A very small CDP client (request/response + events over one socket) ──
class CDP {
  constructor(ws) {
    this.ws = ws; this.seq = 0; this.pending = new Map(); this.handlers = new Map();
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const h of this.handlers.get(msg.method) || []) h(msg.params, msg.sessionId);
      }
    });
  }
  static connect(url) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.addEventListener("open", () => resolve(new CDP(ws)));
      ws.addEventListener("error", () => reject(new Error("CDP socket failed: " + url)));
    });
  }
  send(method, params, sessionId) {
    const id = ++this.seq;
    const msg = { id, method, params: params || {} };
    if (sessionId) msg.sessionId = sessionId;
    this.ws.send(JSON.stringify(msg));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  on(method, fn) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(fn);
  }
}

// ── Page driver ──
class Page {
  constructor(cdp, sessionId) { this.cdp = cdp; this.sid = sessionId; }
  cmd(method, params) { return this.cdp.send(method, params, this.sid); }
  async eval(expression) {
    const r = await this.cmd("Runtime.evaluate", {
      expression: "(async () => { " + expression + " })()",
      awaitPromise: true, returnByValue: true,
    });
    if (r.exceptionDetails) {
      const e = r.exceptionDetails;
      throw new Error("page error: " + (e.exception && e.exception.description || e.text));
    }
    return r.result.value;
  }
  async viewport(width, height, scale) {
    await this.cmd("Emulation.setDeviceMetricsOverride", {
      width, height, deviceScaleFactor: scale || 2, mobile: false,
    });
  }
  async goto(url) {
    const done = new Promise(r => this.cdp.on("Page.loadEventFired", (_p, sid) => { if (sid === this.sid) r(); }));
    await this.cmd("Page.navigate", { url });
    await Promise.race([done, sleep(45000)]);
  }
  // Poll an expression until it is truthy. Cheaper and far more stable than
  // guessing at fixed delays for a SPA that renders on its own schedule.
  async waitFor(expr, timeoutMs) {
    const limit = Date.now() + (timeoutMs || 20000);
    for (;;) {
      if (await this.eval("return !!(" + expr + ");")) return true;
      if (Date.now() > limit) throw new Error("timed out waiting for: " + expr);
      await sleep(150);
    }
  }
  async shot(file) {
    // Let fonts settle and any transition finish before the shutter.
    await this.eval("if (document.fonts && document.fonts.ready) await document.fonts.ready; return 1;");
    await sleep(250);
    // WebP at 92, not PNG. These are 3200px-wide screenshots of a flat UI; at
    // this quality they are pixel-for-pixel indistinguishable from the PNG and
    // between a half and a fifth of the bytes, which on a README with a dozen of
    // them is the difference between a 5.6MB front page and a 2.4MB one.
    const { data } = await this.cmd("Page.captureScreenshot", { format: "webp", quality: 92, captureBeyondViewport: false });
    const out = path.join(OUT_DIR, file);
    fs.writeFileSync(out, Buffer.from(data, "base64"));
    const kb = Math.round(fs.statSync(out).size / 1024);
    log("  ✓ " + file + "  (" + kb + " KB)");
  }
}

// ── The state every shot starts from ──
// Seeded once per Chrome session: import the fixture through the app's own
// /api/import (so the static build's IndexedDB adapter validates it exactly as
// a user's own backup would), then set the browser-local preferences that would
// otherwise put a first-run panel in front of every screenshot.
const SEED_JS = `
  const fixture = __FIXTURE__;

  // One call for both builds: the static bundle has no server to talk to and
  // routes through the IndexedDB adapter, exactly as app.js's own api() does.
  async function apiCall(method, url, body) {
    if (window.CS_STATIC && window.CS_BACKEND) {
      const r = await window.CS_BACKEND.request(method, url, body);
      if (r.status >= 400) throw new Error(method + " " + url + " -> " + r.status + " " + JSON.stringify(r.json));
      return r.json;
    }
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) throw new Error(method + " " + url + " -> " + res.status + " " + (await res.text()).slice(0, 120));
    return res.json();
  }

  await apiCall("POST", "/api/import", fixture);

  // Favourites are keyed by the command ids the seed backfills per browser, so
  // they cannot be hard-coded — look them up by the command text instead.
  const cats = await apiCall("GET", "/api/categories");
  const want = new Set([
    "ssh -L <LOCAL_PORT>:<TARGET_IP>:<REMOTE_PORT> <USER>@<PIVOT_IP>",
    "sudo -l",
    "impacket-GetUserSPNs <DOMAIN>/<USER>:<PASSWORD> -dc-ip <TARGET_IP> -request",
  ]);
  const favs = [];
  const hist = [];
  for (const c of cats) for (const s of (c.subcategories || [])) for (const cmd of (s.commands || [])) {
    if (cmd.id && want.has(cmd.cmd)) favs.push(cmd.id);
  }
  localStorage.setItem("cs-favorites", JSON.stringify(favs));

  // A History view with nothing in it teaches the reader nothing about what the
  // view is for, so replay a plausible hour of copying.
  const now = Date.now();
  const replay = [
    "nmap -sCV -p- --min-rate 2000 -oA relay 10.10.11.57",
    "nxc smb 10.10.11.57 -u 'guest' -p '' --shares",
    "impacket-GetUserSPNs relay.htb0/svc_backup:'Backup#2024!' -dc-ip 10.10.11.57 -request",
    "hashcat -m 13100 spn.hash /usr/share/wordlists/rockyou.txt -r best64.rule",
    "nxc winrm 10.10.11.57 -u svc_backup -p 'Backup#2024!'",
    "feroxbuster -u http://10.10.11.88 -w raft-medium-directories.txt -x php,bak",
    "sudo -l",
  ];
  replay.forEach((cmd, i) => hist.push({ cmd, ts: now - (i + 1) * 420000 }));
  localStorage.setItem("cs-history", JSON.stringify(hist));

  // Placeholder values, so copied commands in the shots are filled in rather
  // than showing the reader a row of <ANGLE_BRACKETS>.
  localStorage.setItem("cs-ip-LHOST", "10.10.14.7");
  localStorage.setItem("cs-ip-RHOST", "10.10.11.57");
  localStorage.setItem("cs-ip-LPORT", "4444");
  localStorage.setItem("cs-ip-DOMAIN", "relay.htb0");
  localStorage.setItem("cs-ip-USER", "svc_backup");

  localStorage.setItem("cs-seen-intro", "1");     // the "what are you here for?" panel
  localStorage.setItem("cs-active-target", "m-relay");
  localStorage.removeItem("cs-collapsed");
  return favs.length;
`;

// ── Put the UI back to neutral between shots ──
// Shots share one page, so anything one of them opens is still open for the
// next: the palette shot left its overlay across every screenshot that followed
// it in the same run, which is exactly the kind of thing that is invisible until
// you look at the files. Escape closes whatever is up, and the rest undoes the
// view state a previous shot may have set.
const RESET_JS = `
  for (let i = 0; i < 3; i++) {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await new Promise(r => setTimeout(r, 60));
  }
  document.querySelectorAll(".cmd-out[open]").forEach(d => { d.open = false; });
  window.scrollTo(0, 0);
  return document.querySelectorAll(".palette.active, .modal-overlay.active").length;
`;

// ── Shots ──
// Each entry sets up its own view and is captured independently, so --only can
// re-shoot one without disturbing the others.
const SHOTS = [
  {
    name: "browser",
    file: "browser.webp",
    width: 1600, height: 1080,
    caption: "The command browser",
    setup: `
      localStorage.setItem("cs-lang", "en");
      location.hash = "cat/recon";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      await new Promise(r => setTimeout(r, 700));
      // Open the expected-output panel on the first command that has one: the
      // point of the shot is that every command says what success looks like.
      const det = document.querySelector(".cmd-out");
      if (det) det.open = true;
      window.scrollTo(0, 0);
      return document.querySelectorAll(".cmd-card, .command-item").length;
    `,
    waitFor: "document.querySelector('.cmd-out')",
  },
  {
    name: "palette",
    file: "palette.webp",
    width: 1600, height: 1080,
    caption: "Ctrl+K fuzzy palette",
    setup: `
      location.hash = "";
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
      await new Promise(r => setTimeout(r, 300));
      const input = document.querySelector(".palette-input");
      input.value = "kerberoast";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise(r => setTimeout(r, 400));
      return document.querySelectorAll(".palette-list [role=option], .palette-list > *").length;
    `,
    waitFor: "document.querySelector('.palette-list') && document.querySelector('.palette-list').children.length",
  },
  {
    name: "machine",
    file: "machine.webp",
    // Wider than the rest: the workspace is a two-column layout, and at 1600 the
    // services and credentials tables truncate their own columns.
    width: 1840, height: 1180,
    caption: "The machine workspace",
    setup: `
      location.hash = "machines/" + ${JSON.stringify("SENTINEL_ID")};
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      await new Promise(r => setTimeout(r, 800));
      window.scrollTo(0, 0);
      return document.querySelectorAll(".svc-row, .machine-service").length;
    `,
    waitFor: "document.querySelector('.machine-tab')",
  },
  {
    name: "board",
    file: "board.webp",
    width: 1600, height: 780,
    caption: "Machines — Kanban board",
    setup: `
      location.hash = "machines";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      await new Promise(r => setTimeout(r, 800));
      // The view mode is read from storage once at boot, so setting the key here
      // would do nothing until a reload — press the toggle the way a user does.
      const btns = document.querySelectorAll(".machine-view-toggle .view-btn");
      if (btns[1]) btns[1].click();
      await new Promise(r => setTimeout(r, 600));
      window.scrollTo(0, 0);
      return document.querySelectorAll(".board-card").length;
    `,
    waitFor: "document.querySelectorAll('.board-card').length >= 3",
  },
  {
    name: "session-presets",
    file: "session-presets.webp",
    width: 1600, height: 1080,
    caption: "Sessions — the 16 presets",
    setup: `
      location.hash = "session";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      await new Promise(r => setTimeout(r, 2500));
      window.scrollTo(0, 0);
      return document.querySelectorAll(".session-preset").length;
    `,
    waitFor: "document.querySelectorAll('.session-preset').length > 10",
  },
  {
    name: "session",
    file: "session.webp",
    width: 1600, height: 1180,
    caption: "Sessions cockpit — a graded sitting",
    setup: `
      location.hash = "session";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      await new Promise(r => setTimeout(r, 2500));
      // The fixture carries one finished OSCP sitting; reopening it is what puts
      // a scored cockpit on screen instead of the empty preset picker.
      const reopen = Array.from(document.querySelectorAll("#contentArea button"))
        .find(b => /reopen|resume/i.test(b.textContent));
      if (reopen) reopen.click();
      await new Promise(r => setTimeout(r, 1800));
      window.scrollTo(0, 0);
      return document.querySelector("#contentArea").innerText.slice(0, 160);
    `,
    waitFor: "document.querySelector('#contentArea').innerText.length > 400",
  },
  {
    name: "nextmove",
    file: "nextmove.webp",
    width: 1600, height: 1080,
    caption: "Next Move",
    setup: `
      location.hash = "next";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      await new Promise(r => setTimeout(r, 1600));
      const byText = (sel, re) => Array.from(document.querySelectorAll(sel)).find(b => re.test(b.textContent.trim()));
      // An empty situation only ever produces the generic "if you are stuck"
      // list. Describe a real one — the active target, its OS, and the fact that
      // we already hold credentials — because the ranked output IS the feature.
      const useTarget = byText("#contentArea button", /use active target/i);
      if (useTarget) useTarget.click();
      await new Promise(r => setTimeout(r, 900));
      const win = byText(".nm-seg-btn", /^windows$/i);
      if (win) win.click();
      await new Promise(r => setTimeout(r, 400));
      const creds = byText(".nm-seg-btn", /have credentials/i);
      if (creds) creds.click();
      await new Promise(r => setTimeout(r, 1200));
      window.scrollTo(0, 0);
      return document.querySelector("#contentArea").innerText.slice(0, 200);
    `,
    waitFor: "document.querySelector('#contentArea').innerText.length > 150",
  },
  {
    name: "writeup",
    file: "writeup.webp",
    width: 1600, height: 1080,
    caption: "Write-up editor",
    setup: `
      location.hash = "writeups";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      await new Promise(r => setTimeout(r, 800));
      // Open the first write-up, then switch to edit: the split editor with its
      // live preview is the thing worth photographing, not the list of titles.
      const row = document.querySelector("#contentArea tbody tr, .wu-row, .wu-card");
      if (row) row.click();
      await new Promise(r => setTimeout(r, 800));
      const edit = document.querySelector(".wu-edit-btn");
      if (edit) edit.click();
      await new Promise(r => setTimeout(r, 900));
      window.scrollTo(0, 0);
      return !!document.querySelector("textarea");
    `,
    waitFor: "document.querySelector('textarea')",
  },
  {
    name: "report",
    file: "report.webp",
    width: 1600, height: 1180,
    caption: "Generated report",
    setup: `
      location.hash = "machines/" + ${JSON.stringify("SENTINEL_ID")};
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      await new Promise(r => setTimeout(r, 900));
      const tabs = Array.from(document.querySelectorAll(".machine-tab"));
      if (tabs[1]) tabs[1].click();
      await new Promise(r => setTimeout(r, 700));
      window.scrollTo(0, 0);
      return tabs.length;
    `,
    waitFor: "document.querySelector('.machine-tab')",
  },
  {
    name: "light",
    file: "light.webp",
    width: 1600, height: 1000,
    caption: "Light theme",
    setup: `
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("cheatsheet-theme", "light");
      location.hash = "cat/web-exploitation";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      await new Promise(r => setTimeout(r, 800));
      window.scrollTo(0, 0);
      return document.documentElement.getAttribute("data-theme");
    `,
    waitFor: "document.querySelector('#contentArea').innerText.length > 100",
    after: `
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("cheatsheet-theme", "dark");
    `,
  },
  {
    name: "turkish",
    file: "turkish.webp",
    width: 1600, height: 1000,
    caption: "Türkçe arayüz",
    setup: `
      localStorage.setItem("cs-lang", "tr");
      location.reload();
      return 1;
    `,
    reloads: true,
    waitFor: "document.querySelector('#contentArea')",
    afterReload: `
      location.hash = "cat/linux-escalation";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      await new Promise(r => setTimeout(r, 800));
      const det = document.querySelector(".cmd-out");
      if (det) det.open = true;
      window.scrollTo(0, 0);
      return document.documentElement.getAttribute("data-lang");
    `,
    after: `localStorage.setItem("cs-lang", "en");`,
  },
  {
    name: "mobile",
    file: "mobile.webp",
    width: 430, height: 900,
    caption: "Phone width",
    setup: `
      localStorage.setItem("cs-lang", "en");
      location.hash = "cat/recon";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      await new Promise(r => setTimeout(r, 700));
      window.scrollTo(0, 0);
      return innerWidth;
    `,
    waitFor: "document.querySelector('#contentArea').innerText.length > 100",
  },
];

(async () => {
  if (typeof WebSocket === "undefined") {
    throw new Error("This script needs Node 22+ (global WebSocket) to speak CDP.");
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const fixture = buildFixture();
  const sentinelId = (fixture.machines[0] || {}).id || "";

  log("base: " + BASE);
  const { proc, port } = await launch();
  const ver = await (await fetch("http://127.0.0.1:" + port + "/json/version")).json();
  log("browser: " + ver.Browser);
  const cdp = await CDP.connect(ver.webSocketDebuggerUrl);
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  const page = new Page(cdp, sessionId);
  await page.cmd("Page.enable");
  await page.cmd("Runtime.enable");
  await page.viewport(1600, 1000, 2);

  log("loading app…");
  await page.goto(BASE);
  await page.waitFor("document.querySelector('#sidebarNav') && document.querySelector('#sidebarNav').children.length > 5", 60000);

  log("seeding the demo database…");
  const favCount = await page.eval(SEED_JS.replace("__FIXTURE__", JSON.stringify(fixture)));
  log("  imported " + fixture.machines.length + " machines, " +
    fixture.writeups.length + " write-ups, " + favCount + " favourites");

  // Reload so the app picks the imported database up through its normal boot
  // path rather than a half-patched in-memory state.
  await page.goto(BASE);
  await page.waitFor("document.querySelector('#sidebarNav') && document.querySelector('#sidebarNav').children.length > 5", 60000);

  // --eval runs one expression against the seeded app and prints what it
  // returns, without taking any picture. Every selector in SHOTS below was
  // found this way; keeping the hook means the next person does not have to
  // rebuild a CDP harness just to ask the page what a button is called.
  const probe = flag("eval", null);
  if (probe && probe !== true) {
    log(JSON.stringify(await page.eval(String(probe)), null, 2));
    if (!KEEP_OPEN) proc.kill();
    return;
  }

  let taken = 0;
  for (const shot of SHOTS) {
    if (ONLY_SET && !ONLY_SET.has(shot.name)) continue;
    log(shot.name + " — " + shot.caption);
    const stuck = await page.eval(RESET_JS);
    if (stuck) log("  (cleared " + stuck + " leftover overlay(s))");
    await page.viewport(shot.width, shot.height, shot.width < 600 ? 3 : 2);
    const setup = shot.setup.replace(/"SENTINEL_ID"/g, JSON.stringify(sentinelId));
    await page.eval(setup);
    if (shot.reloads) {
      await page.waitFor("document.querySelector('#sidebarNav') && document.querySelector('#sidebarNav').children.length > 5", 60000);
      await page.eval(shot.afterReload.replace(/"SENTINEL_ID"/g, JSON.stringify(sentinelId)));
    }
    if (shot.waitFor) await page.waitFor(shot.waitFor, 30000);
    await sleep(400);
    await page.shot(shot.file);
    if (shot.after) await page.eval(shot.after);
    taken++;
  }

  log("\n" + taken + " screenshot(s) written to assets/");
  if (!KEEP_OPEN) proc.kill();
  else log("Chrome left open on port " + port);
})().catch((e) => { process.stderr.write("FAILED: " + e.message + "\n"); process.exit(1); });
