"use strict";
// The Sessions keyboard layer, the two failure panes, and the retrospective's
// formatting — the five fixes that landed in public/session.js with nothing
// asserting them.
//
// Every case here drives a real keydown at the document and then asserts WHERE
// the handler landed, because all five bugs were bugs of destination, not of
// wiring:
//
//   * `c` (Capture) resolved "[placeholder]" and focused whichever input
//     rendered first — the machine-name box.
//   * `e` (Enumeration queue) resolved ".checklist-hint code", which matches 111
//     nodes on an OSCP+ target panel; the first is `sudo openvpn …` from the
//     pre-flight checklist, a different section entirely.
//   * errorPane pointed at session-data.js when it was GET /api/exam that failed
//     — sending the reader to the one file that was working.
//   * the retrospective printed a warning SENTENCE as a markdown heading.
//   * an over-budget row printed "6m / 6m" for a task that was five seconds over.
//
// A test that asserted "a handler ran" or "something scrolled" would have passed
// on every one of them. So would `assert.ok(container.querySelector(".x"))`
// before test/helpers/dom.js grew a real selector engine — see
// test/dom-selectors.test.js, which is the reason these assertions can fail.

const test = require("node:test");
const assert = require("node:assert");
const { readSessionData, loadSession } = require("./helpers/load-session.js");
const { mount, unmount, unmountAll, press, settle, keysPanel, advertisedBindings, subtitle, openTaskIndex, buttonWith } = require("./helpers/session-ui.js");

// One read of the 600KB fact table, handed out as a fresh deep copy per mount.
// Sharing the object would let one case's session mutate the corpus another case
// asserts against.
const CORPUS = readSessionData();
const freshData = () => JSON.parse(JSON.stringify(CORPUS));
const live = (presetId, opts) => mount(presetId, Object.assign({ data: freshData() }, opts || {}));

// Stop every clock this file started. session.js reschedules its tick with a
// setTimeout that never stops while a handler is registered, so a left-running
// mount does not fail the run — it hangs it, and a hang reports nothing.
test.after(unmountAll);

// The two presets the table is driven against: one of each kind, each the
// heaviest of its kind, because the destination bugs only appear once there is
// more than one candidate node on screen.
const TARGET_PRESET = "oscp-plus";
const TASK_PRESET = "cks";

// ───────────────── 1. `c` — the capture field ─────────────────

test("`c` puts the caret in the capture field for a flag that is still open", async () => {
  const s = await live(TARGET_PRESET);
  press(s, "1");

  const all = s.container.querySelectorAll("[data-session-capture]");
  assert.ok(all.length >= 2, "OSCP+ targets carry local.txt and proof.txt — got " + all.length + " capture fields");
  const open = s.container.querySelectorAll("[data-session-capture='open']");
  assert.ok(open.length >= 1, "an uncaptured flag must be marked open so `c` can prefer it");

  press(s, "c");

  const focused = s.document.activeElement;
  assert.ok(focused, "`c` moved focus nowhere");
  assert.strictEqual(focused.tagName, "INPUT", "Capture must land on a text field, not on a container");
  assert.strictEqual(focused.getAttribute("data-session-capture"), "open",
    "`c` focused " + JSON.stringify(focused.className) + " instead of the open capture field — " +
    "this is the exact shape of the original bug, where a bare [placeholder] lookup won the machine-name box");
  assert.strictEqual(focused, open[0], "`c` must prefer the FIRST still-open flag");

  // And the scroll is not a substitute for the focus: asserting only that
  // something scrolled is what let the old selector ship.
  const nameBox = s.container.querySelectorAll("input.checklist-add-input")
    .filter((i) => !i.hasAttribute("data-session-capture"))[0];
  assert.ok(nameBox, "the machine-name box is on screen — it is the node the old selector picked");
  assert.notStrictEqual(focused, nameBox, "`c` focused the machine-name box again");
});

test("`c` skips a flag that is already captured and reaches the next open one", async () => {
  const s = await live(TARGET_PRESET);
  press(s, "1");
  const fields = s.container.querySelectorAll("[data-session-capture]");
  const flagId = "sa1-local";
  s.mod.captureFlag(flagId, "THM{captured}");
  s.mod.render(s.container);
  await settle(1);

  const after = s.container.querySelectorAll("[data-session-capture]");
  assert.strictEqual(after.length, fields.length, "capturing must not add or remove a field");
  const done = after.filter((f) => f.getAttribute("data-session-capture") === "done");
  const open = after.filter((f) => f.getAttribute("data-session-capture") === "open");
  assert.strictEqual(done.length, 1, "the captured flag must be marked done");
  assert.ok(open.length >= 1, "the other flag is still open");

  press(s, "c");
  assert.strictEqual(s.document.activeElement, open[0],
    "on a two-flag target the second field is the one the user is reaching for");
});

// ───────────────── 2. `e` — the enumeration queue ─────────────────

test("`e` reaches the enumeration queue — one node, and not the phase checklist", async () => {
  const s = await live(TARGET_PRESET);
  press(s, "1");

  const queues = s.container.querySelectorAll("[data-session-queue]");
  assert.strictEqual(queues.length, 1,
    "the queue must be addressable by exactly one node, got " + queues.length +
    " — an ambiguous hook is how `e` ended up somewhere else in the first place");

  // The node the OLD selector would have won, measured rather than assumed.
  const oldMatches = s.container.querySelectorAll(".checklist-hint code");
  assert.ok(oldMatches.length > 50,
    "the original selector '.checklist-hint code' should still match a crowd here (" + oldMatches.length +
    ") — if it matches almost nothing, this test has stopped reproducing the bug");
  assert.ok(!queues[0].contains(oldMatches[0]),
    "the first '.checklist-hint code' is inside the queue now, so this test no longer distinguishes the two sections");
  assert.match(oldMatches[0].textContent, /^sudo openvpn/,
    "the first match of the old selector is a pre-flight checklist command (" +
    JSON.stringify(oldMatches[0].textContent) + ") — that is the section `e` used to jump to");

  const scrolled = [];
  s.container.querySelectorAll("*").forEach((n) => { n.scrollIntoView = function () { scrolled.push(this); }; });
  const handled = press(s, "e");

  assert.ok(handled, "`e` must claim the key — it is advertised in the panel");
  assert.deepStrictEqual(scrolled, [queues[0]],
    "`e` scrolled " + scrolled.length + " node(s), and the destination must be the queue section itself");
});

test("`e` from the cockpit opens the target it was already on rather than starting a new clock", async () => {
  const s = await live(TARGET_PRESET);
  press(s, "1");
  const targetSub = subtitle(s);
  press(s, "b");
  assert.notStrictEqual(subtitle(s), targetSub, "`b` must have returned to the cockpit");

  press(s, "e");
  assert.strictEqual(subtitle(s), targetSub, "`e` must restore the target the session was on, not pick a fresh one");
  assert.strictEqual(s.container.querySelectorAll("[data-session-queue]").length, 1);
});

// ───────────────── 3. every advertised binding ─────────────────

// The keys panel is a promise made to the user. Each entry below is the
// observable consequence of one advertised key; a binding that appears in the
// panel with no entry here fails the coverage case, which is what makes the
// table cheap to extend and impossible to forget.
const CHECKS = {
  targets: {
    "1…9": async (s) => {
      press(s, "1");
      const first = subtitle(s);
      assert.ok(s.container.querySelector("[data-session-capture]"), "a number key opens a target panel");
      press(s, "b");
      press(s, "2");
      assert.notStrictEqual(subtitle(s), first, "`2` must open a DIFFERENT target from `1`");
    },
    "n / p": async (s) => {
      press(s, "1");
      const first = subtitle(s);
      press(s, "n");
      const next = subtitle(s);
      assert.notStrictEqual(next, first, "`n` must advance to the next target");
      press(s, "p");
      assert.strictEqual(subtitle(s), first, "`p` must come back to the one before it");
    },
    o: async (s) => {
      s.app.setMachines([{ id: "m-1", name: "Box One", ip: "10.10.10.5", services: [], timeline: [] }]);
      press(s, "1");
      const link = s.container.querySelectorAll("select")
        .filter((sel) => sel.querySelectorAll("option").some((o) => o.value === "m-1"))[0];
      assert.ok(link, "the target panel must offer a way to link an existing machine");
      link.value = "m-1";
      link.dispatchEvent({ type: "change" });
      assert.ok(buttonWith(s.container, /Open in Machines/), "a linked target shows the Machines link");

      s.window.location.hash = "";
      press(s, "o");
      assert.strictEqual(s.window.location.hash, "#machines/m-1",
        "`o` must navigate to the linked machine, not merely do nothing quietly");
    },
    e: async (s) => {
      press(s, "1");
      const queue = s.container.querySelector("[data-session-queue]");
      assert.ok(queue, "the queue section must exist to be reachable");
      let hit = null;
      queue.scrollIntoView = function () { hit = this; };
      press(s, "e");
      assert.strictEqual(hit, queue, "`e` must reach the enumeration queue");
    },
    s: async (s) => {
      press(s, "1");
      const before = s.container.querySelectorAll("select").length;
      press(s, "s");
      const stuck = s.container.querySelectorAll("select")
        .filter((sel) => sel.querySelectorAll("option").some((o) => /\|/.test(o.value)))[0];
      assert.ok(stuck, "`s` must open the stuck panel, whose list is keyed focus|phase");
      assert.ok(stuck.querySelectorAll("option").length > 5, "the stuck list ships many focus/phase pairs");
      press(s, "s");
      assert.strictEqual(s.container.querySelectorAll("select").length, before, "`s` must toggle back off");
    },
    a: async (s) => {
      press(s, "1");
      const box = s.container.querySelector("[data-session-attempt]");
      assert.ok(box, "the attempts field must be addressable");
      press(s, "a");
      assert.strictEqual(s.document.activeElement, box, "`a` must put the caret in the attempts field");
    },
    c: async (s) => {
      press(s, "1");
      press(s, "c");
      const focused = s.document.activeElement;
      assert.ok(focused && focused.hasAttribute("data-session-capture"), "`c` must focus a capture field");
      assert.strictEqual(focused.getAttribute("data-session-capture"), "open", "…and prefer one still open");
    },
    r: async (s) => {
      const cockpit = subtitle(s);
      press(s, "r");
      assert.ok(buttonWith(s.container, /Copy markdown/), "`r` must open the report, which offers its markdown");
      press(s, "r");
      assert.strictEqual(subtitle(s), cockpit, "`r` must toggle back to where it came from");
    },
    b: async (s) => {
      const cockpit = subtitle(s);
      press(s, "1");
      assert.notStrictEqual(subtitle(s), cockpit);
      press(s, "b");
      assert.strictEqual(subtitle(s), cockpit, "`b` must return to the cockpit");
      assert.strictEqual(s.container.querySelector("[data-session-capture]"), null, "…and leave the target panel");
    },
    h: async (s) => {
      assert.strictEqual(keysPanel(s), null, "the keys panel starts closed");
      press(s, "h");
      assert.ok(keysPanel(s), "`h` must open the keys panel");
      press(s, "h");
      assert.strictEqual(keysPanel(s), null, "`h` must close it again");
    },
  },
  tasks: {
    "1…9": async (s) => {
      press(s, "1");
      assert.strictEqual(openTaskIndex(s), 0, "`1` must open the first task");
      press(s, "3");
      assert.strictEqual(openTaskIndex(s), 2, "`3` must jump straight to the third");
    },
    "n / p": async (s) => {
      press(s, "1");
      press(s, "n");
      assert.strictEqual(openTaskIndex(s), 1, "`n` must advance one task");
      press(s, "p");
      assert.strictEqual(openTaskIndex(s), 0, "`p` must go back one task");
    },
    f: async (s) => {
      press(s, "1");
      assert.strictEqual(s.container.querySelectorAll(".session-task.flagged").length, 0, "nothing starts flagged");
      press(s, "f");
      const flagged = s.container.querySelectorAll(".session-task.flagged");
      assert.strictEqual(flagged.length, 1, "`f` must flag exactly the open task");
      assert.strictEqual(flagged[0], s.container.querySelectorAll(".session-task")[0]);
      assert.strictEqual(s.container.querySelectorAll(".session-flag.on").length, 1, "the flag control must show it too");
      press(s, "f");
      assert.strictEqual(s.container.querySelectorAll(".session-task.flagged").length, 0, "`f` must unflag");
    },
    v: async (s) => {
      press(s, "1");
      // Scoped to the task row's own status pill: ".exam-pill.st-root" on its own
      // also matches the eight evidence-rule pills in the preset's rule cards,
      // and counting those would report "verified" before anything happened.
      const pills = () => s.container.querySelectorAll(".session-task-top .exam-pill.st-root");
      assert.strictEqual(pills().length, 0, "nothing starts verified");
      press(s, "v");
      assert.strictEqual(pills().length, 1, "`v` must mark exactly the open task verified");
      assert.strictEqual(pills()[0].parentNode.parentNode, s.container.querySelectorAll(".session-task")[0],
        "…and it must be the OPEN task that was marked, not the first one it could find");
      assert.match(s.mod.reportMarkdown(), /\|\s*1\s*\|[^\n]*verified/, "…and the retrospective must say so");
    },
    a: async (s) => {
      press(s, "1");
      const box = s.container.querySelector("[data-session-attempt]");
      assert.ok(box, "the attempts field must be addressable in task mode too");
      press(s, "a");
      assert.strictEqual(s.document.activeElement, box, "`a` must put the caret in the attempts field");
    },
    r: async (s) => {
      const cockpit = subtitle(s);
      press(s, "r");
      assert.ok(buttonWith(s.container, /Copy markdown/), "`r` must open the retrospective");
      press(s, "r");
      assert.strictEqual(subtitle(s), cockpit, "`r` must toggle back");
    },
    b: async (s) => {
      press(s, "r");
      const report = subtitle(s);
      press(s, "b");
      assert.notStrictEqual(subtitle(s), report, "`b` must leave the retrospective");
      assert.ok(s.container.querySelectorAll(".session-task").length > 1, "…and land back on the task list");
    },
    h: async (s) => {
      assert.strictEqual(keysPanel(s), null, "the keys panel starts closed");
      press(s, "h");
      assert.ok(keysPanel(s), "`h` must open the keys panel");
      press(s, "h");
      assert.strictEqual(keysPanel(s), null, "`h` must close it again");
    },
  },
};

const PRESET_FOR = { targets: TARGET_PRESET, tasks: TASK_PRESET };

for (const kind of Object.keys(CHECKS)) {
  test("the keys panel advertises exactly the bindings covered here (" + kind + ")", async () => {
    const s = await live(PRESET_FOR[kind]);
    press(s, "h");
    const advertised = advertisedBindings(s);
    assert.ok(advertised.length > 0, "the keys panel did not render for " + PRESET_FOR[kind]);
    // Both directions. A key that is advertised but unchecked is a promise
    // nothing verifies; a key that is checked but no longer advertised means
    // this table has drifted away from the product.
    const codes = advertised.map((p) => p[0]);
    assert.deepStrictEqual(codes.filter((c) => !CHECKS[kind][c]), [],
      "these bindings are advertised to the user with nothing asserting them — add an entry to CHECKS." + kind);
    assert.deepStrictEqual(Object.keys(CHECKS[kind]).filter((c) => !codes.includes(c)), [],
      "these entries no longer match anything the panel advertises");
    // The label is the promise; assert it says something, so an empty <li>
    // cannot satisfy the coverage check above.
    for (const [code, label] of advertised) {
      assert.ok(label.trim().length > 2, "binding " + JSON.stringify(code) + " is advertised with no description");
    }
  });

  for (const code of Object.keys(CHECKS[kind])) {
    test("`" + code + "` does what the keys panel says it does (" + kind + ")", async () => {
      // A fresh mount per binding: `v` and `f` mutate the session, and a
      // shortcut that only works as the third key you press is not the shortcut
      // that was advertised.
      const s = await live(PRESET_FOR[kind]);
      await CHECKS[kind][code](s);
    });
  }
}

test("a modifier-held key is never claimed by the session view", async () => {
  // Ctrl+K is the app's palette and Ctrl+R reloads the browser. Claiming either
  // would be the most disruptive possible form of "a shortcut that lies".
  const s = await live(TARGET_PRESET);
  for (const mod of ["ctrlKey", "metaKey", "altKey"]) {
    for (const key of ["r", "b", "h", "1", "c", "e"]) {
      const init = {};
      init[mod] = true;
      assert.strictEqual(press(s, key, init), false, mod + "+" + key + " must fall through to the browser");
    }
  }
  assert.strictEqual(keysPanel(s), null, "…and none of them may have opened the keys panel");
});

test("keys are ignored while the user is typing", async () => {
  const s = await live(TARGET_PRESET);
  press(s, "1");
  const field = s.container.querySelector("[data-session-capture]");
  const before = subtitle(s);
  // No activeElement reset here: that IS the case under test.
  s.document.activeElement = field;
  s.document.dispatchEvent({ type: "keydown", key: "b" });
  assert.strictEqual(subtitle(s), before, "typing `b` into a flag value must not navigate away from the target");
});

// ───────────────── 4. the two failure panes ─────────────────

// Fail GET /api/exam while leaving the corpus intact, and record every request
// the module makes so the retry can be counted.
function withFailingDoc(opts) {
  const s = loadSession(Object.assign({ data: freshData() }, opts || {}));
  const calls = [];
  s.window.CS_APP.api = function (method, path) {
    calls.push(method + " " + path);
    if (String(path).indexOf("/api/exam") === 0) return Promise.resolve({ error: "connection refused" });
    return Promise.resolve(null);
  };
  return { s: s, calls: calls };
}

test("a saved-document failure names the saved sessions and the request — not session-data.js", async () => {
  const { s, calls } = withFailingDoc();
  s.mod.render(s.container);
  await settle(4);

  const pane = s.container.querySelector(".no-results");
  assert.ok(pane, "a failed GET /api/exam must render an error pane");
  const headline = pane.querySelector("h3").textContent;
  const paragraphs = pane.querySelectorAll("p").map((p) => p.textContent);
  const hint = paragraphs.join(" ");

  assert.match(headline, /saved sessions/i,
    "the headline must name what actually failed. Got " + JSON.stringify(headline));
  assert.doesNotMatch(headline, /session data could not be loaded/i,
    "that is the CORPUS headline — the corpus loaded fine here");
  assert.match(hint, /GET \/api\/exam/,
    "the hint must name the request that failed. Got " + JSON.stringify(hint));
  assert.doesNotMatch(hint, /session-data\.js/,
    "pointing at session-data.js sends the reader to the one file that is working");
  assert.ok(paragraphs.some((p) => /connection refused/.test(p)), "the backend's own message must survive to the screen");

  // Exactly one request, and it is the one the pane blames.
  assert.deepStrictEqual(calls, ["GET /api/exam"], "the failing load must not fan out into other endpoints");

  const retry = buttonWith(pane, /Retry/);
  assert.ok(retry, "the pane must offer a retry");
  calls.length = 0;
  retry.click();
  await settle(4);
  assert.deepStrictEqual(calls, ["GET /api/exam"],
    "Retry must re-issue exactly that one request — not reload the corpus, not write anything");
});

test("a corpus failure keeps its own headline and its own hint", async () => {
  // The contrast is the whole point of the fix: two unrelated failures used to
  // share one headline, so neither of them told the reader anything.
  const s = loadSession({ withData: false });
  // The corpus loader must fail rather than hang, and the document must succeed,
  // so the pane on screen can only be the corpus one.
  s.window.CS_APP.api = () => Promise.resolve({ sessions: [], activeSessionId: "" });
  s.window.fetch = () => Promise.reject(new Error("session-data.js unreachable"));
  s.mod.render(s.container);
  await settle(6);

  const text = s.container.querySelectorAll(".no-results p").map((p) => p.textContent).join(" ") +
    " " + s.container.querySelectorAll(".no-results h3").map((h) => h.textContent).join(" ");
  assert.doesNotMatch(text, /GET \/api\/exam/,
    "the corpus failure must not blame the backend request, which answered fine");
});

// ───────────────── 5. the retrospective ─────────────────

test("a warning sentence is never emitted as a markdown heading", async () => {
  const s = await live(TASK_PRESET);
  press(s, "1");
  s.mod.setContext("kubectl config use-context lab-cluster");
  s.mod.render(s.container);
  await settle(1);

  const md = s.mod.reportMarkdown();
  assert.ok(md.length > 0, "the retrospective must produce markdown");

  // The warning, verbatim from the module's own string table.
  const warning = "Set and confirm the context before you touch this task.";
  assert.ok(md.includes(warning), "the unconfirmed-context warning must still be in the document");
  assert.doesNotMatch(md, /^#+\s*Set and confirm/m,
    "a sentence ending in a full stop is not a section title:\n" + md.slice(md.indexOf("Set and confirm") - 120, md.indexOf("Set and confirm") + 120));

  // …and there IS a real heading over it, so the section did not simply vanish.
  const headings = md.split("\n").filter((l) => /^###\s+\S/.test(l)).map((l) => l.replace(/^###\s+/, ""));
  assert.ok(headings.includes("Context never confirmed"),
    "the gap needs a heading of its own. Headings present: " + JSON.stringify(headings));
  for (const h of headings) {
    assert.ok(!/\.$/.test(h), "heading " + JSON.stringify(h) + " reads as a sentence, not a title");
    assert.ok(h.split(/\s+/).length <= 6, "heading " + JSON.stringify(h) + " is a sentence wearing a heading");
  }
  // The warning has to sit under that heading, not replace it.
  const at = md.indexOf("### Context never confirmed");
  assert.ok(md.indexOf(warning) > at, "the warning belongs in the body underneath its heading");
});

test("an over-budget task row visibly exceeds its budget", async () => {
  const s = await live(TASK_PRESET);
  press(s, "1");

  // Drive the real gate: the clock does not start until the context is confirmed.
  s.mod.setContext("kubectl config use-context lab-cluster");
  s.mod.render(s.container);
  await settle(1);
  const confirm = buttonWith(s.container, /^Confirm context$/);
  assert.ok(confirm, "the context gate must offer a confirm button");
  confirm.click();
  const start = buttonWith(s.container, /^▶ Start$/);
  assert.ok(start, "a confirmed task must offer its own start button");
  start.click();

  const taskCount = s.container.querySelectorAll(".session-task").length;
  const budget = s.mod.taskBudget(CORPUS.presets.find((p) => p.id === TASK_PRESET), taskCount);
  assert.ok(budget && budget.perTaskMs > 0, "CKS derives a per-task budget");

  const OVER_BY_MS = 5000;
  const spentMs = budget.perTaskMs + OVER_BY_MS;
  // This is what made the old output indefensible, and it is asserted rather
  // than assumed: rounded to whole minutes the two figures are the SAME string,
  // so a row that prints minutes says "6m / 6m" under a heading reading
  // "Over budget". If the corpus ever changes so the two differ in minutes, this
  // case has stopped reproducing the bug and should be re-sized, not deleted.
  assert.strictEqual(Math.floor(spentMs / 60000), Math.floor(budget.perTaskMs / 60000),
    "spent and budget must still collide when rounded to minutes, or this case proves nothing");

  const realNow = Date.now;
  try {
    const frozen = realNow() + spentMs;
    Date.now = () => frozen;

    const md = s.mod.reportMarkdown();
    assert.ok(md.includes("### Over budget"), "a task past its budget must be listed:\n" + md.slice(0, 1500));
    const section = md.slice(md.indexOf("### Over budget"));

    const row = section.split("\n").filter((l) => l.startsWith("- #"))[0];
    assert.ok(row, "the Over budget section is empty:\n" + section.slice(0, 400));
    const times = row.match(/\d+:\d{2}:\d{2}/g) || [];
    assert.strictEqual(times.length, 2, "the row must print spent and budget: " + JSON.stringify(row));
    assert.notStrictEqual(times[0], times[1],
      "the row reads " + JSON.stringify(row) + " — a heading that says 'over budget' above two identical " +
      "numbers reads as a bug in the tool rather than a fact about the run");
    const secs = (clock) => clock.split(":").reduce((a, n) => a * 60 + Number(n), 0);
    assert.strictEqual(secs(times[1]), Math.floor(budget.perTaskMs / 1000), "the second figure is the budget");
    assert.strictEqual(secs(times[0]), Math.floor(spentMs / 1000), "the first figure is what was actually spent");
    assert.strictEqual(secs(times[0]) - secs(times[1]), OVER_BY_MS / 1000, "and the gap between them is the overrun");

    // The on-screen row has to agree with the document. The screen still shows
    // whole minutes, so the class is what carries the fact there.
    s.mod.render(s.container);
    await settle(1);
    assert.strictEqual(s.container.querySelectorAll(".session-budget-text.over").length, 1,
      "exactly the over-budget task's figure is marked over");
    assert.strictEqual(s.container.querySelectorAll(".session-budget-fill.over").length, 1,
      "…and so is its bar");
  } finally {
    Date.now = realNow;
    unmount(s);
  }
});
