"use strict";
// Touch targets.
//
// WCAG 2.2 SC 2.5.8 asks for 24x24 CSS px. An .icon is 16px wide (14 at
// icon-sm), so an icon-only button is exactly as big as the padding around it,
// and several of these carried 2px — a 20px target, or 16px where the padding
// was horizontal only. That is fine with a mouse and wrong with a thumb, which
// is the hand this app is used with least often and the one with no second
// chance when the control it misses is "delete".
//
// There is no layout engine here, so the size is ESTIMATED from the stylesheet:
// an explicit minimum, or an explicit size, or the padding plus an icon. The
// estimate is deliberately pessimistic — it assumes the smaller 14px icon — so a
// control that passes here passes in a browser too. What it cannot model is
// anything sized by its container; those are called out rather than assumed.

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const { loadApp, PUBLIC_DIR } = require("./helpers/load-app.js");
const { readSessionData } = require("./helpers/load-session.js");
const { mount, unmountAll, press, settle } = require("./helpers/session-ui.js");

const CSS = fs.readFileSync(path.join(PUBLIC_DIR, "style.css"), "utf8");
const MIN = 24;
const ICON_PX = 14;   // .icon-sm, the smallest an icon in one of these gets

test.after(unmountAll);

// ───────────────── a small, honest CSS reader ─────────────────

// Every { selector-list { declarations } } pair, comments stripped. Enough of a
// parser for a hand-written stylesheet with no nesting outside @media; the
// @media prelude falls out as a selector of its own and matches no class.
function rules(css) {
  const out = [];
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const decls = {};
    for (const d of m[2].split(";")) {
      const i = d.indexOf(":");
      if (i < 0) continue;
      decls[d.slice(0, i).trim().toLowerCase()] = d.slice(i + 1).trim();
    }
    out.push({ selectors: m[1].split(",").map((x) => x.trim()).filter(Boolean), decls });
  }
  return out;
}
const RULES = rules(CSS);

const px = (v) => {
  const n = parseFloat(v);
  return /px\s*$/.test(String(v || "").trim()) && Number.isFinite(n) ? n : NaN;
};
// padding: 6px 14px -> { block: 12, inline: 28 }
function paddingOf(decls) {
  let block = 0, inline = 0;
  const short = decls.padding;
  if (short) {
    const parts = short.trim().split(/\s+/).map(px);
    if (parts.every((n) => Number.isFinite(n))) {
      const [a, b = a, c = a, d = b] = parts;
      block = a + c;
      inline = b + d;
    }
  }
  for (const [k, axis] of [["padding-top", "b"], ["padding-bottom", "b"], ["padding-left", "i"], ["padding-right", "i"]]) {
    const n = px(decls[k]);
    if (!Number.isFinite(n)) continue;
    if (axis === "b") block += n; else inline += n;
  }
  const blockShort = px(decls["padding-block"]);
  if (Number.isFinite(blockShort)) block = blockShort * 2;
  const inlineShort = px(decls["padding-inline"]);
  if (Number.isFinite(inlineShort)) inline = inlineShort * 2;
  return { block, inline };
}

// The best case the stylesheet guarantees for one class, across every rule that
// names it. Best case is the right reading: a later rule only ever adds.
function boxFor(cls) {
  let w = 0, h = 0, centred = false, fromMin = false;
  for (const r of RULES) {
    if (!r.selectors.some((sel) => (sel.match(/\.[A-Za-z][\w-]*/g) || []).includes("." + cls))) continue;
    const d = r.decls;
    const pad = paddingOf(d);
    const cands = {
      w: [px(d["min-width"]), px(d.width), pad.inline ? pad.inline + ICON_PX : NaN],
      h: [px(d["min-height"]), px(d.height), pad.block ? pad.block + ICON_PX : NaN]
    };
    for (const n of cands.w) if (Number.isFinite(n) && n > w) w = n;
    for (const n of cands.h) if (Number.isFinite(n) && n > h) h = n;
    if (Number.isFinite(px(d["min-width"])) || Number.isFinite(px(d["min-height"]))) fromMin = true;
    if (/flex/.test(d.display || "") && (d["align-items"] || "").includes("center") && (d["justify-content"] || "").includes("center")) centred = true;
  }
  return { w, h, centred, fromMin };
}

// ───────────────── what the app renders ─────────────────

// A button whose entire visible content is one sprite icon has no text to widen
// it, so its size is whatever CSS says and nothing else.
function iconOnlyButtons(root) {
  return root.querySelectorAll("button").filter((b) => {
    if (String(b.textContent || "").trim()) return false;
    return b.querySelectorAll("svg").length > 0 || String(b.innerHTML || "").includes('<use href="#i-');
  });
}
function check(classSets, where) {
  const small = [];
  for (const classes of classSets) {
    // A button carries several classes (btn btn-secondary btn-sm); it is big
    // enough if ANY of them makes it so, which is how the cascade works.
    const boxes = classes.map(boxFor);
    const w = Math.max(0, ...boxes.map((b) => b.w));
    const h = Math.max(0, ...boxes.map((b) => b.h));
    if (w >= MIN && h >= MIN) continue;
    small.push(where + ": ." + classes.join(".") + " estimates " + w + "x" + h + ", under " + MIN + "x" + MIN);
  }
  return [...new Set(small)];
}

test("every icon-only button the Sessions view renders is at least 24x24", async () => {
  const data = readSessionData();
  const sets = [];
  for (const preset of ["oscp-plus", "cks"]) {
    const s = await mount(preset, { data: JSON.parse(JSON.stringify(data)) });
    for (const b of iconOnlyButtons(s.container)) sets.push(String(b.className || "").split(/\s+/).filter(Boolean));
    press(s, "1");
    await settle(1);
    for (const b of iconOnlyButtons(s.container)) sets.push(String(b.className || "").split(/\s+/).filter(Boolean));
  }
  assert.ok(sets.length > 5, "fixture check: the Sessions view draws icon-only controls — found " + sets.length);
  assert.deepStrictEqual(check(sets, "sessions"), [],
    "an icon-only button is as big as its padding. Add its class to the touch-target rule in public/style.css.");
});

test("every icon-only button on a command card is at least 24x24", () => {
  // The card is where the smallest targets were: favourite, edit, delete and
  // basket are four icon-only buttons in a row, and three of them were 20px.
  const env = loadApp({});
  const card = env.app.renderCard(
    { id: "c1", title: "Scan", desc: "d", cmd: "nmap -sCV <TARGET_IP>", tags: ["essential"], ref: "https://nmap.org/book/man.html" },
    "demo", 0, 0);
  const sets = iconOnlyButtons(card).map((b) => String(b.className || "").split(/\s+/).filter(Boolean));
  assert.ok(sets.length >= 4, "fixture check: a card draws favourite / edit / delete / basket — found " + sets.length);
  assert.deepStrictEqual(check(sets, "command card"), []);
});

test("every icon-only button in the static chrome is at least 24x24", () => {
  // index.html's own controls — the sidebar toggles, the theme toggle, the two
  // close buttons. These never pass through app.js, so a render test cannot see
  // them at all.
  const html = fs.readFileSync(path.join(PUBLIC_DIR, "index.html"), "utf8");
  const body = html.slice(html.indexOf("</svg>"));
  const sets = [];
  const re = /<button([^>]*)>\s*<svg[^>]*>\s*<use href="#i-[a-z-]+"><\/use>\s*<\/svg>\s*<\/button>/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    sets.push(((m[1].match(/class="([^"]*)"/) || [, ""])[1]).split(/\s+/).filter(Boolean));
  }
  assert.ok(sets.length >= 3, "fixture check: index.html ships icon-only buttons — found " + sets.length);
  assert.deepStrictEqual(check(sets, "index.html"), []);
});

// ───────────────── the shape of the fix ─────────────────

test("a control sized by a minimum also centres its icon", () => {
  // min-height on its own makes the button taller and leaves the icon at the
  // top: a 24px box with the glyph in the top 14px of it looks like a mistake,
  // and the part that still reads as the target is the glyph.
  //
  // Asked per CLASS, not per rule: the coarse-pointer block raises the same
  // classes to 32px and has no business restating the display mode.
  const needsCentring = new Set();
  for (const r of RULES) {
    if (!(px(r.decls["min-width"]) >= MIN && px(r.decls["min-height"]) >= MIN)) continue;
    for (const sel of r.selectors) for (const c of sel.match(/\.[A-Za-z][\w-]*/g) || []) needsCentring.add(c.slice(1));
  }
  assert.ok(needsCentring.size >= 20,
    "only " + needsCentring.size + " classes carry a >= " + MIN + "px minimum — the touch-target rule is missing or was narrowed");
  const off = [...needsCentring].filter((c) => !boxFor(c).centred);
  assert.deepStrictEqual(off, [],
    "these get a minimum size but nothing centres the icon inside it: " + off.join(", "));
});

test("a coarse pointer gets more room, and can see the controls that fade in on hover", () => {
  // Half these controls live at opacity:0 until the row is hovered. A phone
  // never hovers, so without an override they are 32px targets nobody can see.
  const at = CSS.indexOf("@media (hover: none) and (pointer: coarse)");
  assert.ok(at > 0, "the coarse-pointer block is missing from public/style.css");
  const block = CSS.slice(at, CSS.indexOf("\n}\n\n", at) + 3);
  assert.match(block, /min-width:\s*32px/, "a coarse pointer should get more than the 24px minimum on destructive controls");
  assert.match(block, /opacity:\s*1/, "the hover-revealed controls must be made visible for a pointer that cannot hover");
  for (const cls of ["cmd-action-btn", "tl-del", "wu-file-delete", "machine-del-btn"]) {
    assert.ok(block.includes("." + cls), "." + cls + " fades in on hover and needs the coarse-pointer override");
  }
});
