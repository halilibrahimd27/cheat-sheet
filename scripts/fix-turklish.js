#!/usr/bin/env node
// Repair for the botched auto-translated desc_tr strings (machine-translation word
// salad such as "Kaba kuvvet: kuvvet saldırısı file extensifilter ile üzerinde").
//
// What this script does, stated plainly: it REVERTS unsalvageable machine
// translation to the clean English desc. It translates nothing. An honest
// untranslated string is a far smaller problem than word salad, and the validator
// counts "untranslated" and "garbled" separately, so reverting moves the damage
// into a bucket that stays visible instead of hiding it.
//
// It used to carry a 49-entry hand-written English -> Turkish MAP, applied before
// the revert, which made the script read as if a batch had been hand-translated.
// The MAP had never fired once: across the whole seed, 67 commands matched a MAP
// key and not one of them was garbled or untranslated, because every MAP value
// was byte-identical to the desc_tr already sitting in seed.js — the MAP had been
// transcribed OUT of the seed. All 464 repairs took the revert path while the
// report advertised a translation step that could not exist. It is gone. Real
// hand translation belongs in seed.js, where it is reviewable in the diff.
//
// Usage: node scripts/fix-turklish.js [--dry-run]
//
// Detection is shared with the CI gate (scripts/turklish-detect.js) so the repair
// can never again be blind to strings the validator is supposed to be counting.
//
// Every accuracy figure printed below is produced by turklish-detect.js's own
// report(), which recomputes precision and recall from its embedded evaluation
// sets at print time. Nothing here is a transcribed number: the last three of
// those went stale or turned out to be properties of one hand-picked set.
"use strict";
const fs = require("fs");
const path = require("path");
const detect = require("./turklish-detect.js");
const { looksTurklish, looksSuspect, RESIDUAL_AUDIT } = detect;
const SEED = path.join(__dirname, "..", "seed.js");
const data = require(SEED);

const dryRun = process.argv.includes("--dry-run");

let scanned = 0, flagged = 0, reverted = 0, dropped = 0;
for (const cat of data) {
  for (const sub of cat.subcategories || []) {
    for (const cmd of sub.commands || []) {
      if (typeof cmd.desc_tr !== "string") continue;
      scanned++;
      // desc_tr === desc is already-honest English, not salad — leave it alone.
      // That is also what makes this script idempotent: every repair below lands
      // in a state the detector no longer flags, so a second run is a no-op.
      if (!looksTurklish(cmd.desc_tr, cmd.desc)) continue;
      flagged++;
      if (cmd.desc) { cmd.desc_tr = cmd.desc; reverted++; }
      else { delete cmd.desc_tr; dropped++; }
    }
  }
}

let remaining = 0, suspect = 0, translated = 0;
for (const cat of data) {
  for (const sub of cat.subcategories || []) {
    for (const cmd of sub.commands || []) {
      if (looksTurklish(cmd.desc_tr, cmd.desc)) { remaining++; continue; }
      if (typeof cmd.desc_tr !== "string" || !cmd.desc_tr.trim() || cmd.desc_tr === cmd.desc) continue;
      translated++;
      if (looksSuspect(cmd.desc_tr, cmd.desc)) suspect++;
    }
  }
}

function report() {
  console.log(`Scanned ${scanned} desc_tr strings; ${flagged} flagged as unsalvageable machine translation.`);
  console.log(`  ${reverted} reverted to the clean English desc — these are now UNTRANSLATED, not Turkish`);
  console.log(`  ${dropped} desc_tr removed (no English desc to fall back to)`);
  console.log(`  ${remaining} still flagged after repair`);
  // "0 still flagged" is not "0 still garbled", and reporting the first as if it
  // were the second is what let a corpus full of salad pass as clean. The
  // detector's gate is deliberately conservative because this script REVERTS what
  // it flags, so say out loud what the gate cannot prove.
  // Quote the sampling interval, not a single number. The point estimate alone is
  // how "the real figure is N" kept being read as a fact about the corpus when it
  // was a fact about one 150-string draw.
  const [lo, hi] = RESIDUAL_AUDIT.ci95;
  console.log(`  ${suspect} of the ${translated} remaining Turkish strings look garbled to the weaker heuristics ` +
    `this script does not act on. A ${RESIDUAL_AUDIT.sample}-string hand-labelled sample ` +
    `(${RESIDUAL_AUDIT.date}) puts the true count at ${Math.round(RESIDUAL_AUDIT.rate * translated)} ` +
    `(95% CI ${Math.round(lo * translated)}-${Math.round(hi * translated)}), so this script's flag count is a ` +
    "lower bound on a lower bound.");
  // Everything this repair claims about its own detector is recomputed from the
  // evaluation sets in turklish-detect.js on every run, so the claims cannot drift
  // away from the code the way the old transcribed numbers did.
  detect.report(data).split(String.fromCharCode(10)).forEach((l) => console.log("  | " + l));
  if (reverted) {
    console.log(`  This script does not translate. ${reverted} description(s) still need real Turkish`);
    console.log("  written into seed.js; `npm run validate-content` counts them as untranslated.");
  }
}

if (!flagged) {
  report();
  console.log("Nothing to repair — seed.js left untouched.");
  process.exit(0);
}
if (dryRun) {
  report();
  console.log("[dry-run] seed.js not written.");
  process.exit(0);
}

// Preserve the file's existing CRLF line endings so the diff shows only the
// desc_tr lines that actually changed (not a whole-file EOL churn).
const eol = /\r\n/.test(fs.readFileSync(SEED, "utf8")) ? "\r\n" : "\n";
let out = "// cheat-sheet Command Database\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n";
if (eol === "\r\n") out = out.replace(/\n/g, "\r\n");
fs.writeFileSync(SEED, out, "utf8");
report();
