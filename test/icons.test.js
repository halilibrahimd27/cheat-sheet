"use strict";
// The icon sprite.
//
// Every icon in the chrome is `<svg class="icon"><use href="#i-NAME"></use></svg>`
// pointing at a <symbol> in public/index.html. A browser handed a href that
// matches no symbol renders NOTHING — no error, no console warning, no fallback.
// So "grid" typed where "i-grid" was defined, or a symbol deleted while a call
// site survives, is a control that silently loses its label and keeps working
// well enough that nobody files a bug.
//
// This file is the thing that notices. It reads every icon name the three view
// files ask for and proves the sprite defines it, proves the sprite carries
// nothing it does not, and holds the chrome to the rule the migration
// established: no emoji and no icon glyph in code that renders to the DOM. The
// exceptions are enumerated below, each for a reason about the medium the string
// ends up in rather than about which picture looks nicer.

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const PUBLIC = path.join(__dirname, "..", "public");
const read = (f) => fs.readFileSync(path.join(PUBLIC, f), "utf8");
const INDEX = read("index.html");
const SOURCES = ["app.js", "session.js", "nextmove.js"];

// ───────────────── the sprite ─────────────────

function spriteIds() {
  const ids = [];
  const re = /<symbol id="i-([a-z-]+)"/g;
  let m;
  while ((m = re.exec(INDEX)) !== null) ids.push(m[1]);
  return ids;
}

test("the sprite defines each symbol once, under the i- prefix the builders assume", () => {
  const ids = spriteIds();
  assert.ok(ids.length >= 50, "expected a full set, found " + ids.length + " symbols");
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepStrictEqual(dupes, [], "duplicate symbol ids: a later <symbol> silently wins");
  // iconHtml() strips everything but [a-z-] out of the name before building the
  // href, so a symbol id outside that alphabet could never be reached at all.
  for (const id of ids) {
    assert.match(id, /^[a-z]+(?:-[a-z]+)*$/,
      "symbol id " + JSON.stringify(id) + " is unreachable through iconHtml()'s [a-z-] filter");
  }
});

test("every symbol is drawn on the same 24px grid, in currentColor", () => {
  const re = /<symbol id="i-([a-z-]+)" viewBox="([^"]*)"([^>]*)>([\s\S]*?)<\/symbol>/g;
  let m;
  let count = 0;
  while ((m = re.exec(INDEX)) !== null) {
    const [, id, viewBox, attrs, body] = m;
    count += 1;
    assert.strictEqual(viewBox, "0 0 24 24",
      "i-" + id + " is not on the 24px grid — it cannot match the set's optical weight");
    assert.doesNotMatch(attrs + body, /\b(?:fill|stroke)="(?!none|currentColor)[^"]+"/,
      "i-" + id + " hard-codes a colour; the set is drawn in currentColor so an icon always matches the text beside it");
    assert.ok(body.trim().length > 0, "i-" + id + " is empty");
  }
  assert.strictEqual(count, spriteIds().length, "a <symbol> is malformed enough that the shape regex missed it");
});

// ───────────────── the call sites ─────────────────

// Blank out //-comments only — never the contents of strings. A comment may
// legitimately discuss a glyph or name an icon in prose, and iconHtml()'s own
// source carries the literal `href="#i-` the index.html scan looks for.
function stripComments(line) {
  let out = "";
  let quote = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === "\\") { out += ch + (line[i + 1] || ""); i += 1; continue; }
      if (ch === quote) quote = null;
      out += ch;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; out += ch; continue; }
    if (ch === "/" && line[i + 1] === "/") break;
    out += ch;
  }
  return out;
}
const codeOf = (src) => src.split(/\r?\n/).map(stripComments).join("\n");

// Where each builder takes the icon name in its argument list.
const NAME_ARG = {
  icon: 0, iconHtml: 0, ico: 0,          // icon(name, cls)
  iconBtn: 1, setIconLabel: 1,           // iconBtn(cls, name, text, …) / setIconLabel(el, name, label)
  iconEl: 2                              // iconEl(tag, cls, name, text)
};
// Two small helpers hand a name BACK to those builders instead of passing one.
// They are named here rather than pattern-matched, because "a function that
// returns a lowercase string" describes half this codebase.
const NAME_RETURNERS = ["osIconFor", "tlIcon"];

// Split one call's argument list at top-level commas. Nesting matters: the name
// is often a ternary, and the arguments after it are whole function bodies.
function argsAt(src, open) {
  const args = [];
  let depth = 0, quote = null, start = open + 1;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === "\\") { i += 1; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    if (ch === "(" || ch === "[" || ch === "{") { depth += 1; continue; }
    if (ch === ")" || ch === "]" || ch === "}") {
      depth -= 1;
      if (depth === 0) { args.push(src.slice(start, i)); return args; }
      continue;
    }
    if (ch === "," && depth === 1) { args.push(src.slice(start, i)); start = i + 1; }
  }
  return args;   // unbalanced — the caller gets whatever there was
}

// Every icon name a file asks for, read out of the argument that actually holds
// it. A ternary there contributes both branches; everything else in the call — a
// class list, a label, a callback — is never looked at, which is what stops this
// reporting every lowercase string in a 290KB file.
function requestedIcons(src, file) {
  const out = [];
  const code = codeOf(src);
  const lineAt = (i) => code.slice(0, i).split("\n").length;

  const call = new RegExp("\\b(" + Object.keys(NAME_ARG).join("|") + ")\\s*\\(", "g");
  let m;
  while ((m = call.exec(code)) !== null) {
    const args = argsAt(code, m.index + m[0].length - 1);
    const arg = args[NAME_ARG[m[1]]];
    if (arg === undefined) continue;
    const lit = /"([a-z][a-z-]*)"/g;
    let hit;
    while ((hit = lit.exec(arg)) !== null) out.push({ name: hit[1], file, at: lineAt(m.index) });
  }

  for (const fn of NAME_RETURNERS) {
    const at = code.indexOf("function " + fn + "(");
    if (at < 0) continue;
    const body = code.slice(at, code.indexOf("\n  }", at));
    const ret = /return\s+"([a-z][a-z-]*)"/g;
    let hit;
    while ((hit = ret.exec(body)) !== null) out.push({ name: hit[1], file, at: lineAt(at) });
  }

  if (file === "index.html") {
    src.split(/\r?\n/).forEach((line, i) => {
      const re = /href="#i-([a-z][a-z-]*)"/g;
      let hit;
      while ((hit = re.exec(line)) !== null) out.push({ name: hit[1], file, at: i + 1 });
    });
  }
  return out;
}

const FILES = SOURCES.concat(["index.html"]);

test("every icon the chrome asks for is a symbol the sprite defines", () => {
  const defined = new Set(spriteIds());
  const missing = [];
  for (const file of FILES) {
    for (const req of requestedIcons(read(file), file)) {
      if (!defined.has(req.name)) missing.push(req.file + ":" + req.at + " asks for i-" + req.name);
    }
  }
  assert.deepStrictEqual(missing, [],
    missing.length + " icon reference(s) resolve to no symbol. A browser renders an unresolved <use> as nothing at all — " +
    "the control keeps working and quietly loses its label, which is why this is a test and not a code review.");
});

// The two questions want opposite lenses, so they get them.
//
// "Does this reference resolve?" must be PRECISE: a false positive there is a
// red build over a name that was never an icon, so it only reads the argument
// that genuinely holds one.
//
// "Is this symbol dead?" must be GENEROUS: several names live in a data table —
// the write-up toolbar's [ic, label, title, fn] rows, the machine tabs' [key,
// ic, label] rows — and are handed to a builder through a variable. Demanding
// they be inlined would be a test dictating code shape. So this one asks the
// weaker, unfalsifiable-by-refactor question: is the name typed anywhere at all?
// A symbol nobody has ever typed is dead by any reading.
test("no symbol in the sprite is dead weight", () => {
  const corpus = FILES.map((f) => codeOf(read(f))).join("\n");
  // Two spellings count as naming it: the name as a literal, and the href a
  // hand-written <use> in index.html points at.
  const unused = spriteIds().filter((id) => !corpus.includes('"' + id + '"') && !corpus.includes("#i-" + id + '"'));
  assert.deepStrictEqual(unused, [],
    "defined and never named anywhere: " + unused.join(", ") + ". The sprite is inlined into every page load, so an " +
    "unused symbol is bytes on the critical path — use it or delete it.");
});

// ───────────────── the rule the migration established ─────────────────

// Ranges that read as an icon when they land in rendered text: arrows used as
// marks, dingbats, geometric shapes, emoji. Deliberately NOT included: Latin and
// its accents, typographic dashes and quotes, the ellipsis, the non-breaking
// space, and box drawing — which is what every section rule in these files is
// made of.
const ICON_GLYPH = /[←-⇿⌀-➿⬀-⯿️]|[\u{1F000}-\u{1FAFF}]/u;

// Where a character is still the right answer, by line range. Each entry is
// about the MEDIUM the string ends up in.
const EXCEPTIONS = [
  // 1. Generated Markdown. A report is text that leaves this app — pasted into a
  //    ticket, mailed to a client — and a status glyph survives that trip where
  //    an <svg> would not.
  { file: "app.js", from: 840, to: 880, why: "OSCP report skeleton" },
  { file: "app.js", from: 1130, to: 1185, why: "OSWE report skeleton" },
  { file: "app.js", from: 1340, to: 1400, why: "retest-status table in the report template" },
  { file: "app.js", from: 2830, to: 2880, why: "machine report generator" },
  { file: "session.js", from: 3000, to: 3240, why: "session report / retrospective generator" },
  // 2. <option> labels. A <select> option can hold text and nothing else, so the
  //    choice there is a glyph or no marker at all.
  { file: "app.js", from: 2095, to: 2130, why: "<option> labels in the write-up editor" },
  // 3. The category-icon field's placeholder, which exists to show the user what
  //    KIND of thing to type. Category icons are their data, not our chrome.
  { file: "app.js", from: 735, to: 748, why: "placeholder for the user's own category emoji" }
];
const exempt = (file, line) => EXCEPTIONS.some((e) => e.file === file && line >= e.from && line <= e.to);

test("no emoji or icon glyph survives in code that renders to the DOM", () => {
  const offenders = [];
  for (const file of SOURCES) {
    const src = read(file);
    const lines = src.split(/\r?\n/);
    const code = codeOf(src).split("\n");
    // A comment is prose about the code, not output: "the old tick indicator" is
    // a sentence, and rewriting history to avoid a character would be silly.
    let inBlock = false;
    code.forEach((line, i) => {
      const trimmed = lines[i].trim();
      if (inBlock) { if (trimmed.includes("*/")) inBlock = false; return; }
      if (trimmed.startsWith("/*")) { if (!trimmed.includes("*/")) inBlock = true; return; }
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
      if (!ICON_GLYPH.test(line)) return;
      if (exempt(file, i + 1)) return;
      offenders.push(file + ":" + (i + 1) + "  " + trimmed.slice(0, 120));
    });
  }
  assert.deepStrictEqual(offenders, [],
    offenders.length + " line(s) draw the chrome with a character instead of a sprite icon.\n" +
    "If the string ends up in generated Markdown, in an <option>, or in the user's own data, add its range to " +
    "EXCEPTIONS in this file with the reason. Otherwise use icon() / iconHtml() / ico().\n" + offenders.join("\n"));
});

test("index.html draws its own chrome from the sprite too", () => {
  // Everything after the sprite block: the <symbol> bodies are paths, and the
  // comment above them documents the rule by quoting the glyphs it retired.
  const body = INDEX.slice(INDEX.indexOf("</svg>"));
  const offenders = [];
  body.split(/\r?\n/).forEach((line, i) => {
    if (ICON_GLYPH.test(line)) offenders.push("index.html, " + (i + 1) + " lines past the sprite:  " + line.trim().slice(0, 120));
  });
  assert.deepStrictEqual(offenders, [], offenders.join("\n"));
});
