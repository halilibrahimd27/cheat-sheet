"use strict";
// The three build/content scripts, run as processes.
//
// scripts/validate-content.js is the CI gate for the corpus, scripts/
// build-static.js is what GitHub Pages actually serves, and
// scripts/fix-turklish.js rewrites seed.js in place. All three had nothing
// asserting them, which is an odd place for this repository to have a hole: a
// gate that stops failing is indistinguishable from a corpus that stopped
// having problems, and a build script that quietly drops a file ships a 404 to
// everyone.
//
// They are exercised the way CI runs them — as child processes, against a
// throwaway tree — rather than by requiring them, because every one of them
// resolves its inputs from __dirname and half of what they do is exit codes and
// files on disk.

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const REPO = path.join(__dirname, "..");
const SCRIPTS = path.join(REPO, "scripts");
const PUBLIC = path.join(REPO, "public");

const temps = [];
function tmpdir() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "cs-scripts-"));
  temps.push(d);
  return d;
}
test.after(() => {
  for (const d of temps) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* a leftover temp dir is not a test failure */ }
  }
});

function run(script, cwdRoot, args) {
  const r = spawnSync(process.execPath, [path.join(cwdRoot, "scripts", script)].concat(args || []), {
    cwd: cwdRoot, encoding: "utf8", timeout: 120000
  });
  return { status: r.status, out: (r.stdout || "") + (r.stderr || ""), stdout: r.stdout || "", stderr: r.stderr || "" };
}

// Windows occasionally refuses a file for a few milliseconds right after a
// 1.4MB tree copy — an indexer or a scanner still holds the handle, and node
// surfaces it as UNKNOWN rather than EBUSY. It is not a fact about any script
// under test, so it is retried rather than left to fail the run at random.
function stubborn(fn) {
  let last;
  for (let i = 0; i < 8; i++) {
    try { return fn(); } catch (e) {
      last = e;
      const until = Date.now() + 25;
      while (Date.now() < until) { /* the shortest backoff that needs no callback */ }
    }
  }
  throw last;
}
const readFile = (f) => stubborn(() => fs.readFileSync(f, "utf8"));
const writeFile = (f, text) => stubborn(() => fs.writeFileSync(f, text));

const writeSeed = (root, data) =>
  fs.writeFileSync(path.join(root, "seed.js"), "// cheat-sheet Command Database\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n");

// A corpus small enough to reason about and shaped exactly like the real one.
//
// Deterministic on purpose. The first cut generated a random id per command,
// which made every fixture tree a different corpus — and quietly turned the
// build-reproducibility assertions below into assertions that random numbers
// differ. A fixture that is not identical twice cannot test a build that is
// supposed to be.
function fixtureSeed(overrides) {
  const cmd = (o) => Object.assign({
    id: "c-fixture-1",
    title: "Scan", desc: "Scan the host", desc_tr: "Ana bilgisayari tara",
    cmd: "nmap -sCV <TARGET_IP>", tags: ["essential"]
  }, o || {});
  return [{
    id: "recon", name: "Recon", icon: "\u{1F50D}", description: "d",
    subcategories: [{ name: "Sub", commands: [cmd(overrides)] }]
  }];
}

// ════════════════════════ validate-content.js ════════════════════════

// scripts/ carries its own requires (turklish-detect) and its ratchet file, so
// the whole directory travels.
function validatorTree(seedData, ratchet) {
  const root = tmpdir();
  fs.mkdirSync(path.join(root, "scripts"));
  for (const f of ["validate-content.js", "turklish-detect.js"]) {
    fs.copyFileSync(path.join(SCRIPTS, f), path.join(root, "scripts", f));
  }
  fs.writeFileSync(path.join(root, "scripts", "content-progress.json"),
    JSON.stringify(ratchet === null ? {} : { quality_ratchet: Object.assign({
      untranslated: 0, garbled: 0, garbled_suspected: 0, duplicate_commands: 0, unreferenced_commands: 99
    }, ratchet || {}) }, null, 2) + "\n");
  writeSeed(root, seedData);
  return root;
}

test("validate-content passes a clean corpus and says what it counted", () => {
  const root = validatorTree(fixtureSeed({ ref: "https://nmap.org/book/man.html" }));
  const r = run("validate-content.js", root);
  assert.strictEqual(r.status, 0, r.out);
  assert.match(r.out, /Scanned 1 categories, 1 subcategories, 1 commands/);
  assert.match(r.out, /References: 1 of 1 commands carry one/);
  assert.match(r.out, /Structure valid/);
});

test("validate-content fails a structural error rather than warning about it", () => {
  // A duplicate id sends the router to the wrong record, so it is an error and
  // not a warning — this is the distinction the script exists to make.
  const seed = fixtureSeed();
  seed[0].subcategories[0].commands.push(Object.assign({}, seed[0].subcategories[0].commands[0], { title: "Other" }));
  seed[0].subcategories[0].commands[1].id = seed[0].subcategories[0].commands[0].id;
  const r = run("validate-content.js", validatorTree(seed));
  assert.strictEqual(r.status, 1, "a duplicate id must fail the build:\n" + r.out);
  assert.match(r.out, /duplicate id/);
});

test("validate-content fails a command with nothing to run", () => {
  const seed = fixtureSeed();
  delete seed[0].subcategories[0].commands[0].cmd;
  const r = run("validate-content.js", validatorTree(seed));
  assert.strictEqual(r.status, 1, r.out);
  assert.match(r.out, /needs a non-empty string cmd/);
});

test("validate-content refuses a reference that is not an absolute https url", () => {
  for (const ref of ["http://nmap.org/", "javascript:alert(1)", "/relative/docs", "nmap.org"]) {
    const r = run("validate-content.js", validatorTree(fixtureSeed({ ref })));
    assert.strictEqual(r.status, 1, JSON.stringify(ref) + " should be refused:\n" + r.out);
    assert.match(r.out, /reference must be an absolute https url/);
  }
  // …and accepts the shape app.js also supports.
  const ok = run("validate-content.js", validatorTree(fixtureSeed({
    refs: [{ label: "Manual", url: "https://nmap.org/book/man.html" }, "https://nmap.org/ncat/guide/index.html"]
  })));
  assert.strictEqual(ok.status, 0, ok.out);
  assert.match(ok.out, /2 links/);
});

test("validate-content fails a ratchet regression and names the metric", () => {
  // The bound says every command is referenced; the corpus has one that is not.
  const root = validatorTree(fixtureSeed(), { unreferenced_commands: 0 });
  const r = run("validate-content.js", root);
  assert.strictEqual(r.status, 1, r.out);
  assert.match(r.out, /content quality regressed/);
  assert.match(r.out, /unreferenced_commands: 0 -> 1/);
});

test("--update-baseline records the new bound instead of failing", () => {
  const root = validatorTree(fixtureSeed(), { unreferenced_commands: 0 });
  const r = run("validate-content.js", root, ["--update-baseline"]);
  assert.strictEqual(r.status, 0, r.out);
  const saved = JSON.parse(fs.readFileSync(path.join(root, "scripts", "content-progress.json"), "utf8"));
  assert.strictEqual(saved.quality_ratchet.unreferenced_commands, 1, "the new value must be written down");
  assert.match(saved.quality_ratchet._comment, /may only go DOWN/, "the file must keep saying what it is");
});

test("a metric with no recorded bound is pinned at today's value, not left unbounded", () => {
  // The bug this guards: `baseline[k] ?? Infinity` in the regression check means
  // a metric added after the baseline file was written can grow forever.
  const root = validatorTree(fixtureSeed(), {});
  fs.writeFileSync(path.join(root, "scripts", "content-progress.json"),
    JSON.stringify({ quality_ratchet: { untranslated: 0, garbled: 0 } }, null, 2) + "\n");
  const r = run("validate-content.js", root);
  assert.strictEqual(r.status, 0, r.out);
  assert.match(r.out, /new metric\(s\) bound at today's value/);
  const saved = JSON.parse(fs.readFileSync(path.join(root, "scripts", "content-progress.json"), "utf8")).quality_ratchet;
  assert.strictEqual(typeof saved.unreferenced_commands, "number", "the new metric must have been given a ceiling");
  assert.strictEqual(saved.untranslated, 0, "an existing bound must be left exactly where it was");
});

test("validate-content never writes seed.js", () => {
  const root = validatorTree(fixtureSeed({ ref: "https://nmap.org/book/man.html" }));
  const before = fs.readFileSync(path.join(root, "seed.js"));
  run("validate-content.js", root);
  assert.ok(before.equals(fs.readFileSync(path.join(root, "seed.js"))), "the validator is read-only");
});

// ════════════════════════ fix-turklish.js ════════════════════════

function repairTree(seedData) {
  const root = tmpdir();
  fs.mkdirSync(path.join(root, "scripts"));
  for (const f of ["fix-turklish.js", "turklish-detect.js"]) {
    fs.copyFileSync(path.join(SCRIPTS, f), path.join(root, "scripts", f));
  }
  writeSeed(root, seedData);
  return root;
}

// A garbled string, checked against the shared detector at load time rather than
// trusted. Writing salad that LOOKS garbled and assuming the gate agrees is how
// a repair test ends up asserting against a heuristic that never fires on it —
// so if the detector stops flagging this one, this file fails immediately and
// says to pick another, instead of quietly testing nothing.
const GARBLED = (() => {
  const detect = require("../scripts/turklish-detect.js");
  const sample = { tr: "Kaba kuvvet: kuvvet saldirisi file extensifilter ile uzerinde", en: "Brute force file extensions with a filter" };
  if (!detect.looksTurklish(sample.tr, sample.en)) throw new Error("the fixture string is no longer flagged as garbled — pick another, or this file tests nothing");
  return sample;
})();

test("fix-turklish --dry-run reports the damage and writes nothing", () => {
  const root = repairTree(fixtureSeed({ desc: GARBLED.en, desc_tr: GARBLED.tr }));
  const before = fs.readFileSync(path.join(root, "seed.js"));
  const r = run("fix-turklish.js", root, ["--dry-run"]);
  assert.strictEqual(r.status, 0, r.out);
  assert.match(r.out, /dry-run/);
  assert.ok(before.equals(fs.readFileSync(path.join(root, "seed.js"))), "--dry-run must leave seed.js byte-identical");
});

test("fix-turklish reverts salad to the English, and translates nothing", () => {
  const root = repairTree(fixtureSeed({ desc: GARBLED.en, desc_tr: GARBLED.tr }));
  const r = run("fix-turklish.js", root);
  assert.strictEqual(r.status, 0, r.out);
  const after = require(path.join(root, "seed.js"));
  const c = after[0].subcategories[0].commands[0];
  assert.strictEqual(c.desc_tr, GARBLED.en,
    "the repair is a REVERT: an honest untranslated string is a smaller problem than word salad, and the " +
    "validator counts the two apart so the debt stays visible");
  assert.strictEqual(c.desc, GARBLED.en, "the English must not be touched");
});

test("fix-turklish leaves a good translation alone and says so", () => {
  const root = repairTree(fixtureSeed());
  const before = fs.readFileSync(path.join(root, "seed.js"));
  const r = run("fix-turklish.js", root);
  assert.strictEqual(r.status, 0, r.out);
  assert.match(r.out, /Nothing to repair/);
  assert.ok(before.equals(fs.readFileSync(path.join(root, "seed.js"))), "a clean corpus must not be rewritten");
});

// ════════════════════════ build-static.js ════════════════════════

function buildTree(mutate) {
  const root = tmpdir();
  fs.mkdirSync(path.join(root, "scripts"));
  fs.copyFileSync(path.join(SCRIPTS, "build-static.js"), path.join(root, "scripts", "build-static.js"));
  stubborn(() => fs.cpSync(PUBLIC, path.join(root, "public"), { recursive: true, force: true }));
  writeSeed(root, fixtureSeed({ ref: "https://nmap.org/book/man.html" }));
  if (mutate) mutate(root);
  return root;
}
const built = (root, f) => readFile(path.join(root, "docs", f));

test("build-static emits a complete, self-contained docs/", () => {
  const root = buildTree();
  const r = run("build-static.js", root);
  assert.strictEqual(r.status, 0, r.out);
  for (const f of ["index.html", "app.js", "style.css", "seed-data.js", "static-bootstrap.js",
    "local-backend.js", "service-worker.js", "manifest.json", ".nojekyll"]) {
    assert.ok(fs.existsSync(path.join(root, "docs", f)), "docs/" + f + " is missing from the build");
  }
  assert.match(built(root, "seed-data.js"), /window\.CS_SEED = \[/, "the seed must land as a browser global");
  assert.match(built(root, "seed-data.js"), /window\.CS_SEED_VERSION = "[0-9a-f]{12}"/,
    "the seed needs a content hash, or a returning visitor's IndexedDB never refreshes");
  // The flag ships as its own file rather than an inline <script>: index.html
  // carries script-src 'self' with no 'unsafe-inline', so an inline bootstrap is
  // blocked by the browser on Pages.
  assert.match(built(root, "static-bootstrap.js"), /window\.CS_STATIC = true;/);
});

test("every generated text file says it is generated", () => {
  // docs/ is build output. Without the notice a fix lands there and is wiped by
  // the next build, with nobody the wiser.
  const root = buildTree();
  run("build-static.js", root);
  for (const f of ["app.js", "style.css", "seed-data.js", "service-worker.js"]) {
    assert.match(built(root, f), /GENERATED FILE — DO NOT EDIT/, "docs/" + f + " carries no do-not-edit banner");
  }
  const html = built(root, "index.html");
  assert.match(html, /^\s*<!DOCTYPE html>/i, "the doctype must stay the first token, or the browser drops to quirks mode");
  assert.match(html, /<!DOCTYPE html>\s*\r?\n<!-- GENERATED FILE/i, "the banner goes on the line after the doctype");
  const manifest = JSON.parse(built(root, "manifest.json"));
  assert.match(manifest._generated, /DO NOT EDIT/, "JSON has no comments, so the notice rides along as a key");
});

test("the static build has no server left in it, and no absolute paths", () => {
  const root = buildTree();
  run("build-static.js", root);
  const html = built(root, "index.html");
  // The three bootstrap scripts must come BEFORE app.js: app.js reads
  // window.CS_STATIC and window.CS_SEED at load time.
  const order = ["static-bootstrap.js", "seed-data.js", "local-backend.js", "app.js"].map((f) => html.indexOf('src="' + f + '"'));
  assert.ok(order.every((i) => i >= 0), "all four scripts must be in index.html: " + JSON.stringify(order));
  for (let i = 1; i < order.length; i++) {
    assert.ok(order[i] > order[i - 1], "the static bootstrap must load before app.js, got " + JSON.stringify(order));
  }
  // A project page lives at user.github.io/repo/, so a leading "/" is a 404.
  for (const m of html.matchAll(/(?:src|href)\s*=\s*"([^"]+)"/g)) {
    assert.doesNotMatch(m[1], /^\//, "absolute asset path " + JSON.stringify(m[1]) + " breaks a project-pages subpath");
  }
  const manifest = JSON.parse(built(root, "manifest.json"));
  for (const k of ["id", "start_url", "scope"]) {
    assert.strictEqual(manifest[k], "./", "manifest." + k + " must be relative");
  }
  (manifest.shortcuts || []).forEach((s) => assert.match(s.url, /^\.\//, "shortcut " + s.url + " must be relative"));
});

test("build-static fails loudly when index.html asks for a file the build did not copy", () => {
  // COPY is hand-maintained. Without this check, adding a <script> to
  // public/index.html ships a 404 to Pages and nothing fails until a visitor
  // hits the broken page.
  const root = buildTree((r) => {
    const p = path.join(r, "public", "index.html");
    writeFile(p, readFile(p).replace('<script src="app.js"></script>',
      '<script src="not-in-the-copy-list.js"></script>\n    <script src="app.js"></script>'));
  });
  const r = run("build-static.js", root);
  assert.strictEqual(r.status, 1, "a dangling asset reference must fail the build:\n" + r.out);
  assert.match(r.out, /references files missing from docs\/: not-in-the-copy-list\.js/);
  assert.match(r.out, /add them to the COPY list/, "the error should say what to do about it");
});

test("the service-worker cache name tracks the build, and only the build", () => {
  // Two real bugs in one assertion. A file inside CORE but outside the hash
  // (manifest.json was exactly that) can change without changing the cache name,
  // pinning returning visitors to a stale copy. And hashing raw bytes made the
  // name differ between a CRLF and an LF checkout, so "docs/ is in sync" could
  // never stay green in CI.
  const nameOf = (root) => (built(root, "service-worker.js").match(/CACHE_NAME = '([^']+)'/) || [])[1];

  const a = buildTree();
  run("build-static.js", a);
  const first = nameOf(a);
  assert.match(first, /^cheatsheet-static-[0-9a-f]{12}$/);

  // Same inputs, second run: the build has to be reproducible.
  run("build-static.js", a);
  assert.strictEqual(nameOf(a), first, "two builds of the same tree must produce the same cache name");

  // A changed source file must change it.
  const b = buildTree((r) => {
    const p = path.join(r, "public", "style.css");
    writeFile(p, readFile(p) + "\n/* a change */\n");
  });
  run("build-static.js", b);
  assert.notStrictEqual(nameOf(b), first, "a changed asset must bust the cache");

  // A line-ending flip must NOT.
  const c = buildTree((r) => {
    const p = path.join(r, "public", "style.css");
    writeFile(p, readFile(p).replace(/\r?\n/g, "\r\n"));
  });
  run("build-static.js", c);
  assert.strictEqual(nameOf(c), first, "a CRLF checkout must produce the same cache name as an LF one");
});

test("the service worker serves code network-first and the seed blob cache-first", () => {
  // Cache-first served yesterday's app.js for one whole load after every deploy,
  // so a user told "it is fixed" opened the page and saw the old build. The seed
  // stays cache-first on purpose: it is megabytes and changes rarely.
  const root = buildTree();
  run("build-static.js", root);
  const sw = built(root, "service-worker.js");
  assert.match(sw, /\.\(js\|css\|html\)\$\/\.test\(p\) && !\/seed-data\\\.js\$\/\.test\(p\)/,
    "the network-first branch must cover js/css/html and exempt seed-data.js");
  assert.match(sw, /request\.mode === 'navigate'/, "navigation needs its own network-first branch with an offline fallback");
  assert.doesNotMatch(sw, /\/api\//, "the static build serves data from IndexedDB — a /api branch would be dead code pointing at nothing");
});
