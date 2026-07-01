#!/usr/bin/env node
// Content validator for seed.js. Pure Node, zero dependencies.
// HARD-FAILS (exit 1) on structural problems that would break the app or the
// data contract. Reports content-quality issues (translation gaps, tag drift,
// duplicates) as WARNINGS so they can be tracked and chipped away without
// blocking CI. Run: node scripts/validate-content.js
"use strict";
const path = require("path");
const data = require(path.join(__dirname, "..", "seed.js"));

const VALID_TAGS = new Set(["essential", "tool", "advanced"]);
const errors = [];
const warnings = [];
const untranslated = [];
const turklish = [];
const cmdSeen = new Map(); // cmd string -> [locations]
const ids = new Set();
let totalCmds = 0, totalSubs = 0;

// The botched auto-translate left desc_tr as "Verb: <english fragment>".
function looksTurklish(tr) {
  return typeof tr === "string" && /^[A-Za-zÇĞİÖŞÜçğıöşü]+:\s/.test(tr);
}

if (!Array.isArray(data)) { console.error("seed.js must export an array"); process.exit(1); }

data.forEach((cat, ci) => {
  const cw = `cat[${ci}] "${cat.id || "?"}"`;
  if (!cat.id || typeof cat.id !== "string") errors.push(`${cw}: missing/invalid id`);
  else if (ids.has(cat.id)) errors.push(`${cw}: duplicate category id`);
  else ids.add(cat.id);
  if (!cat.name) errors.push(`${cw}: missing name`);
  if (!Array.isArray(cat.subcategories) || cat.subcategories.length === 0) {
    errors.push(`${cw}: no subcategories`);
    return;
  }
  cat.subcategories.forEach((sub, si) => {
    totalSubs++;
    const sw = `${cw} > sub[${si}] "${sub.name || "?"}"`;
    if (!sub.name) errors.push(`${sw}: missing name`);
    if (!Array.isArray(sub.commands) || sub.commands.length === 0) {
      errors.push(`${sw}: empty subcategory (no commands)`);
      return;
    }
    sub.commands.forEach((c, mi) => {
      totalCmds++;
      const w = `${sw} > cmd[${mi}] "${String(c.title || "?").slice(0, 42)}"`;
      if (!c.title || !String(c.title).trim()) errors.push(`${w}: missing title`);
      const cmdStr = (c.cmd && String(c.cmd).trim()) || (Array.isArray(c.cmds) && c.cmds.join("\n"));
      if (!cmdStr) errors.push(`${w}: missing cmd/cmds`);
      else {
        const key = String(cmdStr);
        if (!cmdSeen.has(key)) cmdSeen.set(key, []);
        cmdSeen.get(key).push(w);
      }
      if (!c.desc || !String(c.desc).trim()) warnings.push(`${w}: missing desc`);
      const tags = c.tags;
      if (!Array.isArray(tags) || tags.length === 0) warnings.push(`${w}: no tags`);
      else {
        const bad = tags.filter((tg) => !VALID_TAGS.has(tg));
        if (bad.length) warnings.push(`${w}: unknown tag(s): ${bad.join(", ")}`);
      }
      // Translation quality (warnings, not hard failures).
      if (!c.desc_tr || !String(c.desc_tr).trim()) untranslated.push(w);
      else if (c.desc_tr === c.desc) untranslated.push(w);
      else if (looksTurklish(c.desc_tr)) turklish.push(w);
    });
  });
});

const dupes = [...cmdSeen.entries()].filter(([, locs]) => locs.length > 1);

function section(title, items, sample) {
  if (!items.length) return;
  console.log(`\n${title}: ${items.length}`);
  items.slice(0, sample).forEach((i) => console.log("  - " + (typeof i === "string" ? i : i[0])));
  if (items.length > sample) console.log(`  … and ${items.length - sample} more`);
}

console.log(`Scanned ${data.length} categories, ${totalSubs} subcategories, ${totalCmds} commands.`);
section("ERRORS (structural — will fail)", errors, 50);
section("WARN missing desc / tag issues", warnings, 15);
console.log(`\nTranslation: ${untranslated.length} untranslated (desc_tr missing or == desc), ${turklish.length} garbled ("Verb: english") remaining.`);
if (turklish.length) turklish.slice(0, 8).forEach((i) => console.log("  - " + i));
console.log(`Duplicate command strings: ${dupes.length} (informational).`);
dupes.slice(0, 8).forEach(([cmd, locs]) => console.log(`  - x${locs.length}: ${cmd.slice(0, 60)}`));

if (errors.length) {
  console.error(`\n✗ FAILED: ${errors.length} structural error(s).`);
  process.exit(1);
}
console.log(`\n✓ Structure valid (${warnings.length} warnings, ${untranslated.length} untranslated, ${turklish.length} garbled).`);
