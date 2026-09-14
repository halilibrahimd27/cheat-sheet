#!/usr/bin/env node
// Content validator for seed.js. Pure Node, zero dependencies.
// HARD-FAILS (exit 1) on structural problems that would break the app or the
// data contract. Content-quality issues (translation gaps, tag drift,
// duplicates) are reported as WARNINGS, but they are RATCHETED against
// scripts/content-progress.json — they may shrink, never grow.
// Run: node scripts/validate-content.js [--update-baseline]
"use strict";
const fs = require("fs");
const path = require("path");
const { looksTurklish, looksSuspect, RESIDUAL_AUDIT } = require("./turklish-detect.js");
const data = require(path.join(__dirname, "..", "seed.js"));

const PROGRESS = path.join(__dirname, "content-progress.json");
const updateBaseline = process.argv.includes("--update-baseline");

const VALID_TAGS = new Set(["essential", "tool", "advanced"]);
// server.js builds its lookup maps straight off these ids and the app puts them
// in the URL hash, so anything outside this alphabet breaks routing.
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const errors = [];
const warnings = [];
const untranslated = [];
const turklish = [];
// Strings the GATE clears but the weaker, unanchored heuristics still call salad.
// Reported, never enforced: see the residual note printed below.
const suspect = [];
let translated = 0;
const cmdSeen = new Map(); // cmd string -> [locations]
const idSeen = new Map(); // id -> [locations]
const ids = new Set();
let totalCmds = 0, totalSubs = 0, attackTags = 0, refCount = 0, referencedCmds = 0;
const refHosts = new Set();

function noteId(id, where) {
  if (!idSeen.has(id)) idSeen.set(id, []);
  idSeen.get(id).push(where);
}

// Every reference url on one command, whichever of the two shapes app.js
// accepts it was written in (cmd.ref: url | cmd.refs: [url | {label, url}]).
function refUrlsOf(c) {
  const out = [];
  const push = (r) => {
    if (r === undefined || r === null) return;
    out.push(typeof r === "object" ? r.url : r);
  };
  push(c.ref);
  (Array.isArray(c.refs) ? c.refs : (c.refs ? [c.refs] : [])).forEach(push);
  return out;
}

if (!Array.isArray(data)) { console.error("seed.js must export an array"); process.exit(1); }

data.forEach((cat, ci) => {
  const cw = `cat[${ci}] "${cat.id || "?"}"`;
  if (!cat.id || typeof cat.id !== "string") errors.push(`${cw}: missing/invalid id`);
  else if (ids.has(cat.id)) errors.push(`${cw}: duplicate category id`);
  else { ids.add(cat.id); noteId(cat.id, cw); }
  if (cat.id && typeof cat.id === "string" && !ID_RE.test(cat.id)) errors.push(`${cw}: id must match ${ID_RE}`);
  if (!cat.name) errors.push(`${cw}: missing name`);
  if (!Array.isArray(cat.subcategories) || cat.subcategories.length === 0) {
    errors.push(`${cw}: no subcategories`);
    return;
  }
  cat.subcategories.forEach((sub, si) => {
    totalSubs++;
    const sw = `${cw} > sub[${si}] "${(sub && sub.name) || "?"}"`;
    if (!sub || typeof sub !== "object") { errors.push(`${sw}: not an object`); return; }
    if (!sub.name) errors.push(`${sw}: missing name`);
    if (sub.id !== undefined && (typeof sub.id !== "string" || !ID_RE.test(sub.id))) errors.push(`${sw}: id must match ${ID_RE}`);
    else if (typeof sub.id === "string") noteId(sub.id, sw);
    // server.js iterates sub.commands unguarded on every read, import and search.
    if (!Array.isArray(sub.commands)) { errors.push(`${sw}: commands is not an array`); return; }
    if (sub.commands.length === 0) { errors.push(`${sw}: empty subcategory (no commands)`); return; }
    sub.commands.forEach((c, mi) => {
      totalCmds++;
      const w = `${sw} > cmd[${mi}] "${String((c && c.title) || "?").slice(0, 42)}"`;
      if (!c || typeof c !== "object" || Array.isArray(c)) { errors.push(`${w}: command must be a non-null object`); return; }
      if (typeof c.title !== "string" || !c.title.trim()) errors.push(`${w}: title must be a non-empty string`);
      if (c.id !== undefined && (typeof c.id !== "string" || !ID_RE.test(c.id))) errors.push(`${w}: id must match ${ID_RE}`);
      else if (typeof c.id === "string") noteId(c.id, w);
      const hasCmd = typeof c.cmd === "string" && c.cmd.trim();
      const hasCmds = Array.isArray(c.cmds) && c.cmds.length > 0 && c.cmds.every((x) => typeof x === "string");
      if (!hasCmd && !hasCmds) errors.push(`${w}: needs a non-empty string cmd, or a cmds array of strings`);
      else {
        const key = hasCmd ? String(c.cmd).trim() : c.cmds.join("\n");
        if (!cmdSeen.has(key)) cmdSeen.set(key, []);
        cmdSeen.get(key).push(w);
      }
      if (Array.isArray(c.attack)) attackTags += c.attack.length;
      else if (c.attack) attackTags++;
      // Reference links. A ref is a citation the reader will click, so the bar
      // is: an absolute https URL, and nothing that could execute. http:// is
      // refused too — the app is served over https on Pages, and a plain-http
      // citation is the one a corporate proxy silently eats.
      const refs = refUrlsOf(c);
      if (refs.length) referencedCmds++;
      refs.forEach((r) => {
        refCount++;
        if (typeof r !== "string" || !r.trim()) { errors.push(`${w}: empty reference url`); return; }
        if (!/^https:\/\/[^\s"'<>]+$/.test(r)) {
          errors.push(`${w}: reference must be an absolute https url, got ${JSON.stringify(r.slice(0, 60))}`);
          return;
        }
        try { refHosts.add(new URL(r).hostname.replace(/^www\./, "")); }
        catch { errors.push(`${w}: unparseable reference url ${JSON.stringify(r.slice(0, 60))}`); }
      });
      if (!c.desc || !String(c.desc).trim()) warnings.push(`${w}: missing desc`);
      const tags = c.tags;
      if (!Array.isArray(tags) || tags.length === 0) warnings.push(`${w}: no tags`);
      else {
        const bad = tags.filter((tg) => !VALID_TAGS.has(tg));
        if (bad.length) warnings.push(`${w}: unknown tag(s): ${bad.join(", ")}`);
      }
      // Translation quality (ratcheted warnings, not hard failures).
      if (!c.desc_tr || !String(c.desc_tr).trim()) untranslated.push(w);
      else if (c.desc_tr === c.desc) untranslated.push(w);
      else if (looksTurklish(c.desc_tr, c.desc)) turklish.push(w);
      else { translated++; if (looksSuspect(c.desc_tr, c.desc)) suspect.push(w); }
    });
  });
});

// Ids are a global namespace — a category id colliding with a command id sends
// the router to the wrong record, so duplicates are checked across all levels.
for (const [id, locs] of idSeen) {
  if (locs.length > 1) errors.push(`duplicate id "${id}" used ${locs.length}x: ${locs.slice(0, 3).join(" | ")}`);
}

const dupes = [...cmdSeen.entries()].filter(([, locs]) => locs.length > 1);

function section(title, items, sample) {
  if (!items.length) return;
  console.log(`\n${title}: ${items.length}`);
  items.slice(0, sample).forEach((i) => console.log("  - " + (typeof i === "string" ? i : i[0])));
  if (items.length > sample) console.log(`  … and ${items.length - sample} more`);
}

console.log(`Scanned ${data.length} categories, ${totalSubs} subcategories, ${totalCmds} commands, ${attackTags} ATT&CK tags.`);
section("ERRORS (structural — will fail)", errors, 50);
section("WARN missing desc / tag issues", warnings, 15);
console.log(`\nTranslation: ${untranslated.length} untranslated (desc_tr missing or == desc), ${turklish.length} garbled (machine-translation salad) remaining.`);
if (turklish.length) turklish.slice(0, 8).forEach((i) => console.log("  - " + i));
// The garbled count above is what the gate can PROVE, and quoting it alone is how
// this report read as "the Turkish is clean" while it never was. The gate is
// deliberately conservative (fix-turklish.js reverts whatever it flags, and
// reverting a good translation is worse than keeping a bad one), so print what it
// misses right next to it: the weaker heuristics, and the hand-audited rate, which
// is larger still because no heuristic catches everything.
const estimate = Math.round(RESIDUAL_AUDIT.rate * translated);
console.log(`Residual: ${suspect.length} more of the ${translated} translated strings look garbled to the weaker, ` +
  "unanchored heuristics (reported, NOT enforced) — typically an English clause with a Turkish postposition bolted on.");
console.log(`  A ${RESIDUAL_AUDIT.sample}-string random sample hand-labelled on ${RESIDUAL_AUDIT.date} found ` +
  `${RESIDUAL_AUDIT.garbledInSample} garbled (${(RESIDUAL_AUDIT.rate * 100).toFixed(1)}%), so the real residual is nearer ${estimate}.`);
suspect.slice(0, 5).forEach((i) => console.log("  ? " + i));
console.log(`
References: ${referencedCmds} of ${totalCmds} commands carry one ` +
  `(${((100 * referencedCmds) / totalCmds).toFixed(1)}%), ${refCount} links across ${refHosts.size} hosts.`);
console.log(`Duplicate command strings: ${dupes.length} (informational).`);
dupes.slice(0, 8).forEach(([cmd, locs]) => console.log(`  - x${locs.length}: ${cmd.slice(0, 60)}`));

if (errors.length) {
  console.error(`\n✗ FAILED: ${errors.length} structural error(s).`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Ratchet. The soft metrics were "tracked" for months while quietly growing,
// because nothing compared them to anything. Now a regression fails the build;
// an improvement is recorded so it cannot be given back.
// ---------------------------------------------------------------------------
const METRICS = {
  untranslated: untranslated.length,
  garbled: turklish.length,
  // Ratcheted as well, because with only `garbled` bounded the gate's blind spot
  // was free space: salad it cannot prove could be added back forever at no cost.
  garbled_suspected: suspect.length,
  duplicate_commands: dupes.length,
  // Same direction as the rest: a command with nowhere to read more is a gap,
  // and the ratchet is what stops a new batch of commands quietly re-opening it.
  unreferenced_commands: totalCmds - referencedCmds,
};
const progress = JSON.parse(fs.readFileSync(PROGRESS, "utf8"));
const baseline = progress.quality_ratchet || null;

function saveRatchet(values) {
  progress.quality_ratchet = {
    _comment: "Upper bounds enforced by scripts/validate-content.js. These may only go DOWN. Lower them with `node scripts/validate-content.js --update-baseline` after a real improvement.",
    ...values,
  };
  fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2) + "\n", "utf8");
}

if (!baseline || updateBaseline) {
  saveRatchet(METRICS);
  console.log(`\n✓ Structure valid. Quality ratchet ${baseline ? "updated" : "initialised"}: ` +
    Object.entries(METRICS).map(([k, v]) => `${k}=${v}`).join(", "));
  process.exit(0);
}

// A metric added after the baseline file was written has no bound, and the
// regression check below would let it grow forever (`?? Infinity`). Record
// today's value as its ceiling on the first run that sees it, leaving every
// existing bound alone so an unrelated regression still fails.
const unbounded = Object.keys(METRICS).filter((k) => typeof baseline[k] !== "number");
if (unbounded.length) {
  // Written in METRICS order (not baseline-then-new) so the file stays stable
  // whatever order the bounds were added in.
  saveRatchet(Object.fromEntries(Object.keys(METRICS).map(
    (k) => [k, typeof baseline[k] === "number" ? baseline[k] : METRICS[k]])));
  console.log("\n  ratchet: new metric(s) bound at today's value — " +
    unbounded.map((k) => `${k}=${METRICS[k]}`).join(", "));
}

const regressions = Object.keys(METRICS).filter((k) => METRICS[k] > (baseline[k] ?? Infinity));
if (regressions.length) {
  console.error("\n✗ FAILED: content quality regressed against scripts/content-progress.json:");
  regressions.forEach((k) => console.error(`  - ${k}: ${baseline[k]} -> ${METRICS[k]} (+${METRICS[k] - baseline[k]})`));
  console.error("  Fix the content, or run `node scripts/validate-content.js --update-baseline` if the rise is genuinely intended.");
  process.exit(1);
}

const improved = Object.keys(METRICS).filter((k) => METRICS[k] < baseline[k]);
if (improved.length) {
  saveRatchet(METRICS);
  console.log("\n  ratchet tightened: " + improved.map((k) => `${k} ${baseline[k]} -> ${METRICS[k]}`).join(", "));
}

// The residual rides along in the closing line too: it is the line people paste
// into a PR, and "0 garbled" on its own is the claim this report got wrong before.
console.log(`\n✓ Structure valid (${warnings.length} warnings, ${untranslated.length} untranslated, ` +
  `${turklish.length} garbled proven + ~${estimate} residual estimated, ${attackTags} ATT&CK tags).`);
