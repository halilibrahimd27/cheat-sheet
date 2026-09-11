"use strict";
// Drive the Sessions view the way a person does: mount it, then send real
// keydown events at the document.
//
// WHY events rather than calling internals: every one of the keyboard fixes this
// harness exists to cover is a fix to a SELECTOR — which node the handler lands
// on. Calling the handler directly, or asserting "a handler ran", cannot tell a
// correct destination from the wrong one; that is exactly how a shortcut
// advertised as "Capture" spent a release focusing the machine-name box.

const { loadSession } = require("./load-session.js");

const flush = () => new Promise((r) => setTimeout(r, 0));
async function settle(ticks) {
  for (let i = 0; i < (ticks || 3); i++) await flush();
}

// Every mount made in this process, so the clocks can be stopped afterwards.
// session.js keeps its ticking alive with a self-rescheduling setTimeout, which
// holds the event loop open forever: a test that starts a task clock and never
// unmounts makes `node --test` hang rather than fail, and a hang reports nothing
// at all.
const MOUNTED = [];

// Mount a live session for one preset.
//
// The second render() is not belt-and-braces. public/app.js finishes its own
// boot during the first few ticks and renders the HOME view, and session.js
// hooks APP.onViewRender to un-mount itself whenever the rendered view is not
// "exam" — a deliberate battery fix. app.js calls render() on every paint of the
// Sessions view, so calling it again after the boot settles is what a mounted
// view actually looks like; without it the module is correctly inert and every
// key press below would prove nothing while still passing a "did not throw" test.
async function mount(presetId, opts) {
  const s = loadSession(opts || {});
  if (!s.mod) return s;
  // Captured now, not read later: each loadSession() installs a FRESH
  // window.CS_APP, and the unmount hook belongs to the one this instance wired
  // itself into.
  s.appSurface = s.window.CS_APP;
  MOUNTED.push(s);
  if (presetId) s.mod.startSession(presetId);
  s.mod.render(s.container);
  await settle();
  s.mod.render(s.container);
  await settle();
  return s;
}

// What app.js does when the user navigates away from the Sessions view.
function unmount(s) {
  const app = (s && s.appSurface) || null;
  if (app && typeof app.onViewRender === "function") app.onViewRender("home");
}
function unmountAll() {
  while (MOUNTED.length) unmount(MOUNTED.pop());
}

// Send one keydown at the document, from a neutral focus.
//
// Resetting activeElement to <body> first is part of modelling the user, not a
// convenience: the handler deliberately ignores every key while an INPUT,
// TEXTAREA or SELECT has focus, and the previous press in a sequence may well
// have been `c` or `a`, both of which move focus into a field. Returns whether
// the handler called preventDefault(), which is how it signals "this key was
// mine".
function press(s, key, init) {
  const d = s.document;
  d.activeElement = d.body;
  let prevented = false;
  const ev = Object.assign({ type: "keydown", key: key }, init || {});
  ev.preventDefault = () => { prevented = true; };
  ev.stopPropagation = () => {};
  d.dispatchEvent(ev);
  return prevented;
}

// The keys panel, located by its content rather than by class: ".exam-rules" is
// also the preset's own rule boxes (8 of them on OSCP+), so a class lookup alone
// would find a rules card and read a rule as a key binding.
function keysPanel(s) {
  return s.container.querySelectorAll(".exam-rules")
    .filter((box) => box.querySelectorAll("li code").some((c) => /^1/.test(c.textContent)))[0] || null;
}

// [[code, label], …] exactly as the panel advertises them.
function advertisedBindings(s) {
  const box = keysPanel(s);
  if (!box) return [];
  return box.querySelectorAll("li").map((li) => {
    const code = li.querySelector("code");
    const whole = li.textContent;
    const key = code ? code.textContent : "";
    return [key, whole.slice(key.length).trim()];
  });
}

// The header subtitle — the one place that names what the view is currently
// showing (the preset shape on the cockpit, the target label on a target panel).
function subtitle(s) {
  const el = s.container.querySelector(".exam-sub");
  return el ? el.textContent : "";
}

// Which task row has its detail open, by index. taskDetail() is appended to the
// row itself, so "the open task" is the row with a .checklist-body child.
function openTaskIndex(s) {
  const rows = s.container.querySelectorAll(".session-task");
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].children.some((c) => c.classList.contains("checklist-body"))) return i;
  }
  return -1;
}

// Find a button by its visible text. Buttons here are built by btn(), which puts
// the label in the element's own text, so this is what the user reads.
function buttonWith(root, re) {
  return root.querySelectorAll("button").filter((b) => re.test(b.textContent))[0] || null;
}

module.exports = { mount, unmount, unmountAll, press, settle, flush, keysPanel, advertisedBindings, subtitle, openTaskIndex, buttonWith };
