#!/usr/bin/env node
// Merge a single category (JSON file) into seed.js. Idempotent: if a category
// with the same id already exists it is replaced, otherwise appended. Preserves
// the seed.js format via a clean round-trip. Used by the DevSecOps content loop.
// Usage: node scripts/merge-category.js <category.json>
"use strict";
const fs = require("fs");
const path = require("path");

const SEED = path.join(__dirname, "..", "seed.js");
const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/merge-category.js <category.json>");
  process.exit(1);
}

const cat = JSON.parse(fs.readFileSync(file, "utf8"));
if (!cat || typeof cat.id !== "string" || typeof cat.name !== "string" || !Array.isArray(cat.subcategories)) {
  console.error("invalid category object: needs id, name, subcategories[]");
  process.exit(1);
}

function normalizeCmd(c) {
  const out = { title: String(c.title || "").trim(), desc: c.desc || "", desc_tr: c.desc_tr || c.desc || "" };
  if (Array.isArray(c.cmds) && c.cmds.length > 1) out.cmds = c.cmds;
  else out.cmd = c.cmd || (Array.isArray(c.cmds) ? c.cmds[0] : "") || "";
  out.tags = Array.isArray(c.tags) && c.tags.length ? c.tags : ["tool"];
  if (c.note) out.note = c.note;
  return out;
}

const clean = {
  id: cat.id,
  name: cat.name,
  name_tr: cat.name_tr || cat.name,
  icon: cat.icon || "📂",
  description: cat.description || "",
  description_tr: cat.description_tr || cat.description || "",
  subcategories: cat.subcategories
    .filter((s) => s && s.name && Array.isArray(s.commands) && s.commands.length)
    .map((s) => ({ name: s.name, commands: s.commands.map(normalizeCmd).filter((c) => c.title && (c.cmd || c.cmds)) })),
};

if (!clean.subcategories.length) {
  console.error("refusing to merge: category has no non-empty subcategories");
  process.exit(1);
}

const data = require(SEED);
const idx = data.findIndex((c) => c.id === clean.id);
let action;
if (idx >= 0) { data[idx] = clean; action = "replaced"; }
else { data.push(clean); action = "added"; }

const out = "// cheat-sheet Command Database\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n";
fs.writeFileSync(SEED, out, "utf8");

let n = 0;
clean.subcategories.forEach((s) => (n += s.commands.length));
console.log(`${action} category '${clean.id}': ${clean.subcategories.length} subcategories, ${n} commands. Total categories: ${data.length}.`);
