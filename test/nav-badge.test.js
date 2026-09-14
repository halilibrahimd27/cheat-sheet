"use strict";
// The sidebar badge contract.
//
// public/app.js builds the Sessions and Next Move nav rows by calling
// `navBadge()` on window.CS_SESSION and window.CS_NEXT, inside a try/catch that
// swallows everything:
//
//     try { if (sess && typeof sess.navBadge === "function") sessLabel = sess.navBadge() || ""; }
//     catch { /* never let the badge break the sidebar */ }
//
// That catch is correct — a badge must never take the sidebar down — but it also
// means the failure mode is silent. session.js shipped without navBadge at all,
// so the Sessions row simply had no count for the entire life of the feature;
// nothing threw, nothing logged, and no test noticed, because every existing
// assertion was about what session.js exports for its OWN view.
//
// So this file pins the one name app.js actually types, on both modules, and
// reads app.js back to prove the name it types has not moved.

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { readSessionData, loadSession } = require("./helpers/load-session.js");
const { mount, unmountAll, settle, press, buttonWith } = require("./helpers/session-ui.js");

const APP_FILE = path.join(__dirname, "..", "public", "app.js");
const NEXT_FILE = path.join(__dirname, "..", "public", "nextmove.js");
const CORPUS = readSessionData();
const freshData = () => JSON.parse(JSON.stringify(CORPUS));
const presetById = (id) => CORPUS.presets.find((p) => p.id === id);
const click = (el) => { el.dispatchEvent({ type: "click", preventDefault() {}, stopPropagation() {} }); };

test.after(unmountAll);

// ───────────────── the call site ─────────────────

test("app.js asks both modules for a badge by the same name this file pins", () => {
  const app = fs.readFileSync(APP_FILE, "utf8");
  const calls = app.match(/\w+\.navBadge\(\)/g) || [];
  assert.ok(calls.length >= 2,
    "public/app.js should read a badge off both CS_NEXT and CS_SESSION — found " + calls.length +
    ". If the member was renamed, rename it here too; a silently blank badge is what this file exists to stop.");
  assert.match(app, /window\.CS_SESSION \|\| window\.CS_EXAM/,
    "the Sessions badge is read off window.CS_SESSION, with the legacy CS_EXAM fallback");
});

test("both modules register navBadge, so neither nav row is silently blank", async () => {
  const s = await mount(null, { data: freshData() });
  assert.strictEqual(typeof s.mod.navBadge, "function",
    "window.CS_SESSION.navBadge is the name public/app.js calls — without it the Sessions row shows no count, forever, with nothing thrown");

  // nextmove.js is a separate page script; evaluate it on this realm the way the
  // browser does, so the assertion is about the shipped file and not a stub.
  delete s.window.CS_NEXT;
  vm.runInThisContext(fs.readFileSync(NEXT_FILE, "utf8"), { filename: "nextmove.js" });
  assert.strictEqual(typeof s.window.CS_NEXT.navBadge, "function",
    "window.CS_NEXT.navBadge is the same contract for the Next Move row");
});

// ───────────────── nothing to report ─────────────────

test("the badge is blank until there is a session to count", async () => {
  // Loaded, but no fact table and no session started: the badge must not reach
  // for either, because the sidebar paints long before the 600KB corpus and the
  // exam document arrive.
  const cold = loadSession({ withData: false });
  assert.strictEqual(cold.mod.navBadge(), "",
    "a badge that needed the lazily-loaded document would undo the lazy load it describes");

  const s = await mount(null, { data: freshData() });
  assert.strictEqual(s.mod.navBadge(), "", "no session started yet — the row has nothing to say");
});

test("a preset with nothing countable in it yet reports nothing, not a zero", async () => {
  // OSEP hands out no targets: the candidate types in whatever the control panel
  // gave them. "0/0" there is not a progress report, it is a lie with a slash in
  // it — the same rule scoreMode() follows about invented denominators.
  const osep = await mount("osep", { data: freshData() });
  assert.strictEqual(osep.mod.navBadge(), "");

  // Same for a task-shaped preset that ships no task count.
  const tf = await mount("terraform-associate", { data: freshData() });
  assert.strictEqual(tf.mod.navBadge(), "");
});

// ───────────────── target-based sessions ─────────────────

test("a target session counts captured flags against the flags it really has", async () => {
  const s = await mount("oscp-plus", { data: freshData() });
  const total = (presetById("oscp-plus").targets || [])
    .reduce((a, t) => a + (t.flags || []).length, 0);
  assert.ok(total > 0, "fixture check: OSCP+ ships flags");
  assert.strictEqual(s.mod.navBadge(), "0/" + total);

  s.mod.captureFlag("sa1-local", "0123456789abcdef0123456789abcdef");
  assert.strictEqual(s.mod.navBadge(), "1/" + total, "capturing a flag has to move the badge");

  // Idempotent: re-capturing the same flag is not a second flag.
  s.mod.captureFlag("sa1-local", "0123456789abcdef0123456789abcdef");
  assert.strictEqual(s.mod.navBadge(), "1/" + total);
});

test("targets carrying no flags fall back to the target count rather than 0/0", async () => {
  // Reachable through a restored document or a future recon-only target, so the
  // guard is exercised the way the real code path would build it: from a preset.
  const data = freshData();
  const preset = data.presets.find((p) => p.id === "quick-lab");
  preset.targets.forEach((t) => { t.flags = []; });
  const s = await mount("quick-lab", { data: data });
  assert.strictEqual(s.mod.navBadge(), String(preset.targets.length),
    "with no flags there is no ratio to print — say how many targets are in play instead");
});

// ───────────────── task-based sessions ─────────────────

test("a task session counts verified tasks, matching the number the session list prints", async () => {
  const s = await mount("cks", { data: freshData() });
  const total = presetById("cks").taskCount;
  assert.strictEqual(s.mod.navBadge(), "0/" + total);

  press(s, "1");        // open task 1
  press(s, "v");        // mark it verified
  await settle(1);
  assert.strictEqual(s.mod.navBadge(), "1/" + total);
});

test("applied-but-unverified does not read as done in the badge", async () => {
  // The gap between "I applied the yaml" and "the API server came back" is the
  // whole point of the CKS retrospective. A badge that counted `applied` would
  // tell the candidate the paper is further along than it is, and would also
  // disagree with the cockpit's own "N of M verified" line.
  const s = await mount("cks", { data: freshData() });
  const total = presetById("cks").taskCount;
  press(s, "1");
  await settle(1);
  const applied = buttonWith(s.container, /^Applied$/);
  assert.ok(applied, "the task detail offers Applied / Verified / Skipped");
  click(applied);
  await settle(1);
  assert.strictEqual(s.mod.navBadge(), "0/" + total, "applied is not verified");
});

test("a skipped task is not progress", async () => {
  const s = await mount("cks", { data: freshData() });
  const total = presetById("cks").taskCount;
  press(s, "1");
  await settle(1);
  const skipped = buttonWith(s.container, /^Skipped$/);
  assert.ok(skipped, "the task detail offers Skipped");
  click(skipped);
  await settle(1);
  assert.strictEqual(s.mod.navBadge(), "0/" + total,
    "skipping is a deliberate strategic loss, not a task banked");
});
