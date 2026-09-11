#!/usr/bin/env node
// Merge a single category (JSON file) into seed.js. Idempotent: if a category
// with the same id already exists it is replaced, otherwise appended. Preserves
// the seed.js format via a clean round-trip. Used by the DevSecOps content loop.
// Usage: node scripts/merge-category.js <category.json> [--dry-run] [--backup-dir=<path>]
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SEED = path.join(ROOT, "seed.js");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const file = args.find((a) => !a.startsWith("-"));
if (!file) {
  console.error("usage: node scripts/merge-category.js <category.json> [--dry-run] [--backup-dir=<path>]");
  process.exit(1);
}

// Where the pre-merge copy of seed.js goes. NOT <repo>/data — that is server.js's
// runtime DATA_DIR and the path docker-compose mounts as a volume, so a 2.2 MB
// backup per merge used to pile up unpruned inside the app's live state, and a
// restore of the data volume dragged every one of them along. Default to a
// repo-root .backups/ instead; --backup-dir=<path> or SEED_BACKUP_DIR overrides.
const backupArg = args.find((a) => a.startsWith("--backup-dir="));
const BACKUP_DIR = backupArg
  ? path.resolve(backupArg.slice("--backup-dir=".length))
  : path.resolve(process.env.SEED_BACKUP_DIR || path.join(ROOT, ".backups"));
// Unbounded backups are how a disk fills. Keep the newest N, delete the rest.
const KEEP_BACKUPS = Math.max(1, Number(process.env.SEED_BACKUP_KEEP) || 10);

const cat = JSON.parse(fs.readFileSync(file, "utf8"));
if (!cat || typeof cat.id !== "string" || typeof cat.name !== "string" || !Array.isArray(cat.subcategories)) {
  console.error("invalid category object: needs id, name, subcategories[]");
  process.exit(1);
}

// Normalise in place on a COPY of the command, never by rebuilding it from an
// allow-list of fields: an allow-list silently drops everything it does not know
// about. It did — a round-trip of the recon category through the old version
// destroyed 92 `attack` arrays (1164 ATT&CK tags repo-wide fell to 1072) plus
// every `ref` / `refs` / per-command `id`, and all three CI gates stayed green.
function normalizeCmd(c) {
  const out = { ...c };
  out.title = String(c.title || "").trim();
  out.desc = c.desc || "";
  out.desc_tr = c.desc_tr || c.desc || "";
  // Exactly one of cmd / cmds survives, so the renderer never sees both.
  if (Array.isArray(c.cmds) && c.cmds.length > 1) { out.cmds = c.cmds; delete out.cmd; }
  else { out.cmd = c.cmd || (Array.isArray(c.cmds) ? c.cmds[0] : "") || ""; delete out.cmds; }
  out.tags = Array.isArray(c.tags) && c.tags.length ? c.tags : ["tool"];
  if (!c.note) delete out.note;
  return out;
}

function normalizeSub(s) {
  const out = { ...s };
  out.name = s.name;
  if (s.name_tr) out.name_tr = s.name_tr;
  out.commands = s.commands.map(normalizeCmd).filter((c) => c.title && (c.cmd || c.cmds));
  return out;
}

const clean = {
  ...cat,
  id: cat.id,
  name: cat.name,
  name_tr: cat.name_tr || cat.name,
  icon: cat.icon || "📂",
  description: cat.description || "",
  description_tr: cat.description_tr || cat.description || "",
  subcategories: cat.subcategories
    .filter((s) => s && s.name && Array.isArray(s.commands) && s.commands.length)
    .map(normalizeSub),
};

if (!clean.subcategories.length) {
  console.error("refusing to merge: category has no non-empty subcategories");
  process.exit(1);
}

const data = require(SEED);
const idx = data.findIndex((c) => c.id === clean.id);
const before = idx >= 0 ? data[idx] : null;
let action;
if (idx >= 0) { data[idx] = clean; action = "replaced"; }
else { data.push(clean); action = "added"; }

// Count the fields whose loss used to be invisible, so --dry-run can show it and
// a real merge can report it.
function census(c) {
  const out = { commands: 0, attack: 0, refs: 0, ids: 0, subs: 0, sub_name_tr: 0, sub_ids: 0 };
  if (!c) return out;
  for (const s of c.subcategories || []) {
    out.subs++;
    if (s.name_tr) out.sub_name_tr++;
    if (s.id) out.sub_ids++;
    for (const cmd of s.commands || []) {
      out.commands++;
      if (Array.isArray(cmd.attack) ? cmd.attack.length : cmd.attack) out.attack++;
      if (cmd.ref || (Array.isArray(cmd.refs) && cmd.refs.length)) out.refs++;
      if (cmd.id) out.ids++;
    }
  }
  return out;
}
const pre = census(before);
const post = census(clean);
const deltas = Object.keys(post)
  .filter((k) => post[k] !== pre[k])
  .map((k) => `${k} ${pre[k]} -> ${post[k]}`);

if (dryRun) {
  console.log(`[dry-run] would ${idx >= 0 ? "replace" : "add"} category '${clean.id}' (nothing written).`);
  console.log(`[dry-run] ${post.subs} subcategories, ${post.commands} commands, ${post.attack} with ATT&CK, ${post.refs} with refs, ${post.ids} with ids.`);
  console.log(deltas.length ? "[dry-run] changes: " + deltas.join(", ") : "[dry-run] changes: none");
  const losses = Object.keys(post).filter((k) => post[k] < pre[k]);
  if (losses.length) console.log("[dry-run] WARNING — this merge LOSES: " + losses.map((k) => `${pre[k] - post[k]} ${k}`).join(", "));
  console.log(`[dry-run] total categories would be ${data.length}.`);
  process.exit(0);
}

// Preserve the file's existing line endings so the diff stays minimal.
const original = fs.readFileSync(SEED, "utf8");
const eol = /\r\n/.test(original) ? "\r\n" : "\n";
let out = "// cheat-sheet Command Database\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n";
if (eol === "\r\n") out = out.replace(/\n/g, "\r\n");

// seed.js is the entire product; write a timestamped copy before overwriting it
// so a bad merge is one `cp` away from being undone rather than gone.
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.mkdirSync(BACKUP_DIR, { recursive: true });
// A self-ignoring directory. The repo's root .gitignore is not this script's to
// edit, and a 2.2 MB backup showing up in `git status` is a backup somebody
// commits by accident — so the directory carries its own .gitignore.
const ignoreFile = path.join(BACKUP_DIR, ".gitignore");
if (!fs.existsSync(ignoreFile)) {
  fs.writeFileSync(ignoreFile, "# seed.js backups from scripts/merge-category.js. Local only, never committed.\n*\n", "utf8");
}
const backup = path.join(BACKUP_DIR, `seed.${stamp}.js`);
fs.writeFileSync(backup, original, "utf8");
fs.writeFileSync(SEED, out, "utf8");

// Prune oldest-first. The ISO timestamp sorts lexicographically, so plain name
// order is chronological order.
const existing = fs.readdirSync(BACKUP_DIR).filter((f) => /^seed\..+\.js$/.test(f)).sort();
const stale = existing.slice(0, Math.max(0, existing.length - KEEP_BACKUPS));
for (const f of stale) fs.unlinkSync(path.join(BACKUP_DIR, f));

const shown = path.relative(ROOT, backup);
console.log(`${action} category '${clean.id}': ${clean.subcategories.length} subcategories, ${post.commands} commands, ${post.attack} with ATT&CK. Total categories: ${data.length}.`);
if (deltas.length) console.log("  field census: " + deltas.join(", "));
console.log("  backup: " + (shown.startsWith("..") ? backup : shown) +
  `  (keeping the newest ${KEEP_BACKUPS}${stale.length ? `, pruned ${stale.length}` : ""})`);
