#!/usr/bin/env node
// Regenerate the auto-managed sections of README.md (badges, stats line, and the
// category table) from seed.js so the docs never drift from the data.
// Run: node scripts/update-readme.js
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const data = require(path.join(ROOT, "seed.js"));
const README = path.join(ROOT, "README.md");

let totalCmds = 0, totalSubs = 0;
for (const cat of data) {
  for (const sub of cat.subcategories || []) {
    totalSubs++;
    totalCmds += (sub.commands || []).length;
  }
}
const totalCats = data.length;

function shortDesc(s) {
  if (!s) return "";
  const first = String(s).split(/(?<=\.)\s/)[0].replace(/\|/g, "\\|").trim();
  return first.length > 90 ? first.slice(0, 87).trim() + "…" : first;
}

const rows = data.map((cat, i) => {
  let n = 0;
  for (const sub of cat.subcategories || []) n += (sub.commands || []).length;
  const name = `${cat.icon || ""} ${cat.name}`.trim();
  return `| ${i + 1} | ${name} | ${n} | ${shortDesc(cat.description)} |`;
});
const table = [
  "| # | Category | Commands | Description |",
  "|---|----------|----------|-------------|",
  ...rows,
].join("\n");

function replaceBlock(src, startTag, endTag, body) {
  const re = new RegExp(`${startTag}[\\s\\S]*?${endTag}`);
  if (!re.test(src)) throw new Error(`Marker not found: ${startTag} … ${endTag}`);
  return src.replace(re, `${startTag}\n${body}\n${endTag}`);
}

let md = fs.readFileSync(README, "utf8");

md = replaceBlock(
  md, "<!-- STATS:BADGES -->", "<!-- /STATS:BADGES -->",
  `[![Commands](https://img.shields.io/badge/commands-${totalCmds}-success?style=flat-square)](#categories)\n` +
  `[![Categories](https://img.shields.io/badge/categories-${totalCats}-orange?style=flat-square)](#categories)`
);

md = replaceBlock(
  md, "<!-- STATS:START -->", "<!-- STATS:END -->",
  `**${totalCmds} commands** across **${totalCats} categories** and **${totalSubs} subcategories** — every command bilingual (English + Türkçe).`
);

md = replaceBlock(
  md, "<!-- CATEGORIES:START -->", "<!-- CATEGORIES:END -->",
  "<!-- This table is generated from seed.js by scripts/update-readme.js — do not edit by hand. -->\n" + table
);

fs.writeFileSync(README, md, "utf8");
console.log(`README updated: ${totalCmds} commands, ${totalCats} categories, ${totalSubs} subcategories.`);
