"use strict";
// Reference links in the corpus.
//
// A `ref` is a citation the reader clicks from a command card. That makes it a
// promise, and the ways it can quietly break the promise are all silent: an
// unparseable URL renders as a chip labelled "References" pointing at nothing,
// a plain-http link is what a corporate proxy eats, and a link to a blog or a
// SEO aggregator looks exactly like a link to the tool's manual until you land
// on it.
//
// This file holds the corpus to what the references are supposed to be: an
// absolute https URL, on a host that publishes the thing it documents, rendered
// with a label a reader can act on. It cannot check that a URL still resolves —
// tests run offline, and a link-rot check that needs the network is a test that
// fails on a train — so reachability is an authoring-time job. What is checked
// here is every property that can be checked without leaving the machine.

const test = require("node:test");
const assert = require("node:assert");
const { loadApp } = require("./helpers/load-app.js");

const seed = require("../seed.js");
const RATCHET = require("../scripts/content-progress.json").quality_ratchet;

// Every (command, url) pair in the corpus, in both shapes app.js accepts.
function allRefs() {
  const out = [];
  for (const cat of seed) {
    for (const sub of cat.subcategories || []) {
      for (const c of sub.commands || []) {
        const push = (r) => {
          if (r === undefined || r === null) return;
          out.push({ cat: cat.id, title: c.title, url: typeof r === "object" ? r.url : r, raw: r });
        };
        push(c.ref);
        (Array.isArray(c.refs) ? c.refs : (c.refs ? [c.refs] : [])).forEach(push);
      }
    }
  }
  return out;
}
const REFS = allRefs();
const commandCount = seed.reduce((a, cat) =>
  a + (cat.subcategories || []).reduce((b, s) => b + (s.commands || []).length, 0), 0);
let referencedCount = 0;
for (const cat of seed) {
  for (const sub of cat.subcategories || []) {
    for (const c of sub.commands || []) if (c.ref || c.refs) referencedCount++;
  }
}

test("every reference is an absolute https url and nothing else", () => {
  const bad = REFS.filter((r) => typeof r.url !== "string" || !/^https:\/\/[^\s"'<>]+$/.test(r.url));
  assert.deepStrictEqual(bad.map((r) => r.cat + " / " + r.title + " -> " + JSON.stringify(r.url)), [],
    "a reference must be an absolute https url. http:// is refused too: the app is served over https on Pages, " +
    "and a plain-http citation is the one that gets eaten silently.");
});

test("no reference can execute, and none is parsed as a relative path", () => {
  const app = loadApp({}).app;
  for (const r of REFS) {
    // mdSafeUrl is the gate the renderer puts every reference through before it
    // becomes an href; "#" is its refusal.
    assert.notStrictEqual(app.mdSafeUrl(r.url), "#",
      r.cat + " / " + r.title + ": mdSafeUrl() refuses " + JSON.stringify(r.url) + ", so the chip would not render");
    assert.doesNotMatch(r.url, /^(javascript|data|vbscript|file):/i, r.cat + " / " + r.title);
    assert.doesNotMatch(r.url, /^\/\//, r.cat + " / " + r.title + ": protocol-relative url");
  }
});

test("every reference renders a label a reader can act on", () => {
  const app = loadApp({}).app;
  const generic = app.t("cardRefs");
  const bad = [];
  for (const r of REFS) {
    const label = (r.raw && r.raw.label) || app.refHostLabel(r.url);
    // The fallback label means "we could not tell you where this goes" — on a
    // real url it is always a sign the url is malformed, never a design choice.
    if (!label || label === generic || label.length < 3) bad.push(r.cat + " / " + r.title + " -> " + r.url + " (label " + JSON.stringify(label) + ")");
  }
  assert.deepStrictEqual(bad, []);
});

test("a forge link names its project, not its forge", () => {
  // Most tool references are a project repository, and several hundred chips all
  // reading "github.com" would tell the reader nothing about which project.
  const app = loadApp({}).app;
  const forge = REFS.filter((r) => /^https:\/\/(www\.)?(github|gitlab)\.com\/[^/]+\/[^/]+/.test(r.url));
  assert.ok(forge.length > 100, "fixture check: the corpus leans on project repositories — found " + forge.length);
  for (const r of forge.slice(0, 400)) {
    const label = app.refHostLabel(r.url);
    assert.doesNotMatch(label, /^(github|gitlab)\.com$/,
      r.title + ": " + r.url + " labels itself with the forge rather than the project");
  }
});

test("references point at documentation, not at content farms", () => {
  // Not a whitelist of hosts — that would be a maintenance tax on every new
  // tool. A blacklist of the shapes that are never a citation: link shorteners,
  // search results, and the aggregators that rank above real docs.
  //
  // Every pattern is anchored to the WHOLE host on purpose. The loose version of
  // the search-engine rule (/google\./) also condemns cloud.google.com and
  // google.github.io, which are the gcloud and OSV-Scanner manuals — a vendor is
  // not a content farm because of who owns it.
  const BANNED = [
    /(^|\.)(bit\.ly|tinyurl\.com|goo\.gl|t\.co|lnkd\.in)$/i,       // shorteners hide the destination
    /(^|\.)(medium\.com|dev\.to|blogspot\.com|wordpress\.com)$/i,   // a post is not a manual
    /(^|\.)(geeksforgeeks\.org|tutorialspoint\.com|w3schools\.com)$/i,
    /^(www\.)?(google\.com|bing\.com|duckduckgo\.com)$/i,            // a search is not a source
    /(^|\.)(stackoverflow\.com|quora\.com|reddit\.com)$/i,
    /(^|\.)(youtube\.com|youtu\.be)$/i
  ];
  const bad = [];
  for (const r of REFS) {
    let host = "";
    try { host = new URL(r.url).hostname; } catch { continue; }
    if (BANNED.some((re) => re.test(host))) bad.push(r.cat + " / " + r.title + " -> " + r.url);
  }
  assert.deepStrictEqual(bad, [],
    "a reference should be the vendor's or the project's own page. If one of these really is the best source " +
    "for something, say so in the command's note rather than dressing it up as documentation.");
});

test("the same tool is cited from the same place everywhere", () => {
  // The failure this catches: a second reference for an already-referenced tool
  // is added with a different url, and the corpus starts disagreeing with itself
  // about where nmap is documented.
  //
  // Grouped by the tool the command RUNS, not by the documentation host. Host
  // was the obvious first cut and it is wrong: man7.org publishes the manual for
  // a dozen unrelated binaries, and learn.microsoft.com for every Windows
  // command there is. Those are not one project cited two ways.
  const NOT_THE_TOOL = new Set([
    "python", "python3", "python2", "perl", "ruby", "java", "node", "php", "bash", "sh", "zsh",
    "echo", "for", "while", "if", "cat", "env", "exec", "eval", "printf", "time", "nohup", "xargs"
  ]);
  const byTool = new Map();
  for (const cat of seed) {
    for (const sub of cat.subcategories || []) {
      for (const c of sub.commands || []) {
        if (!c.ref || typeof c.ref !== "string") continue;
        const first = String(c.cmd || (Array.isArray(c.cmds) ? c.cmds[0] : "") || "")
          .split("\n")[0].split(/\|\||&&|\||;/)[0].trim().split(/\s+/);
        const basename = (t) => String(t || "").replace(/^.*[/\\]/, "").toLowerCase();
        let tool = basename(first[0]);
        if (tool === "sudo") tool = basename(first[1]);
        if (!/^[a-z][a-z0-9._-]*$/.test(tool)) continue;   // not a command word
        // An interpreter or a shell wrapper is not the tool — whatever it is
        // running is, and working that out is the writer's job, not this test's.
        // Skipping them keeps the check to the commands where the first word IS
        // the tool, which is where a contradiction would actually be a mistake.
        if (NOT_THE_TOOL.has(tool)) continue;
        if (!byTool.has(tool)) byTool.set(tool, new Set());
        byTool.get(tool).add(c.ref);
      }
    }
  }
  const split = [...byTool.entries()].filter(([, urls]) => urls.size > 1);
  assert.deepStrictEqual(split.map(([t, urls]) => t + " -> " + [...urls].join(" , ")), [],
    "one tool is being cited from two different pages. Pick the canonical one.");
});

test("reference coverage does not regress past the recorded ratchet", () => {
  // Against the recorded bound rather than a literal, for the same reason the
  // Turkish gate is: pinning a number here means editing this test every time
  // the content genuinely improves, which is the friction that stops people
  // improving it.
  const unreferenced = commandCount - referencedCount;
  const bound = RATCHET.unreferenced_commands;
  assert.strictEqual(typeof bound, "number", "scripts/content-progress.json has no unreferenced_commands bound");
  assert.ok(unreferenced <= bound,
    unreferenced + " of " + commandCount + " commands have no reference, above the recorded bound of " + bound +
    ". Add references, or lower the bound with `node scripts/validate-content.js --update-baseline`.");
  assert.ok(referencedCount > commandCount * 0.7,
    "only " + referencedCount + " of " + commandCount + " commands are referenced — the corpus walk found the wrong shape");
});
