#!/usr/bin/env node
// ============================================================================
// build-static.js — emit a self-contained /docs folder that runs the SPA with
// NO backend, ready to publish on GitHub Pages (Settings > Pages > /docs).
//
// The static build swaps the REST server for public/local-backend.js (an
// IndexedDB adapter), bundles the seed as docs/seed-data.js, and rewrites paths
// to be RELATIVE so it works from a project-pages subpath (user.github.io/repo/).
// Pure Node, zero dependencies.
// ============================================================================
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PUB = path.join(ROOT, "public");
const OUT = path.join(ROOT, "docs");

function log(msg) { process.stdout.write(msg + "\n"); }

// docs/ is build output, never hand-edited — say so inside every generated text
// file so a stray fix lands in public/ (the source) instead of being silently
// wiped by the next build.
const DO_NOT_EDIT = "GENERATED FILE — DO NOT EDIT. Built from public/ + seed.js by scripts/build-static.js.";
function banner(file) {
  if (/\.(js|css)$/.test(file)) return "/* " + DO_NOT_EDIT + " */\n";
  if (/\.html$/.test(file)) return "<!-- " + DO_NOT_EDIT + " -->\n";
  return "";
}
// HTML must keep <!DOCTYPE html> as its first token, so the banner goes on the
// line after it rather than at the top of the file.
function withBanner(file, text) {
  const b = banner(file);
  if (!b) return text;
  if (/\.html$/.test(file)) return text.replace(/^(\s*<!DOCTYPE[^>]*>\r?\n?)/i, (m) => m + b);
  return b + text;
}
function writeOut(file, text) {
  fs.writeFileSync(path.join(OUT, file), withBanner(file, text));
}

// Fresh docs/ each build (keeps stale files from lingering).
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// 1) Copy the SPA assets verbatim. A file listed here but absent from public/ is
//    a warning, not a crash — the list runs slightly ahead of the source tree so
//    a new page can be added without touching the build. Step 8 is what actually
//    fails the build, when something index.html really needs did not land.
//    The exam.* and session.* entries are the same feature either side of a
//    rename ("session" because it also serves casual lab users and cloud-native
//    cert candidates, not just exam takers). Both spellings stay listed while the
//    rename lands, which costs nothing: whichever half is absent is skipped.
const COPY = [
  "style.css", "app.js", "checklist-templates.js", "local-backend.js", "sw-register.js",
  // Sessions. session-data.js is ~600KB and is fetched on demand by session.js,
  // never on first paint — it still has to be copied so the offline build has it.
  "session.js", "session-data.js",
];
const copied = [];
const missing = [];
for (const f of COPY) {
  const src = path.join(PUB, f);
  if (!fs.existsSync(src)) { missing.push(f); continue; }
  writeOut(f, fs.readFileSync(src, "utf8"));
  copied.push(f);
}
if (missing.length) log("  ! listed in COPY but not present in public/, skipped: " + missing.join(", "));

// 2) Bundle the seed data as a browser global, plus a content-hash version so the
//    static build auto-refreshes returning visitors' IndexedDB when the seed changes.
const seed = require(path.join(ROOT, "seed.js"));
const seedJson = JSON.stringify(seed);
const seedVersion = require("crypto").createHash("md5").update(seedJson).digest("hex").slice(0, 12);
writeOut("seed-data.js", "window.CS_SEED = " + seedJson + ";\nwindow.CS_SEED_VERSION = " + JSON.stringify(seedVersion) + ";\n");

// 3) The static-mode flag ships as its own file rather than an inline <script>:
//    index.html carries a CSP with script-src 'self' and no 'unsafe-inline', so
//    an inline bootstrap would be blocked by the browser on GitHub Pages.
writeOut("static-bootstrap.js", "window.CS_STATIC = true;\n");

// 4) index.html — inject the static bootstrap before app.js. The service worker
//    registers itself from sw-register.js with a relative path, so there is
//    nothing left to rewrite for the project-pages subpath case.
let html = fs.readFileSync(path.join(PUB, "index.html"), "utf8");
const bootstrap =
  '    <script src="static-bootstrap.js"></script>\n' +
  '    <script src="seed-data.js"></script>\n' +
  '    <script src="local-backend.js"></script>\n' +
  '    <script src="app.js"></script>';
if (!html.includes('<script src="app.js"></script>')) {
  throw new Error("index.html: could not find app.js script tag to inject before");
}
html = html.replace('    <script src="app.js"></script>', bootstrap);
writeOut("index.html", html);

// 5) manifest.json — rewrite absolute "/" URLs to relative "./" for subpaths.
//    JSON has no comment syntax, so the do-not-edit notice rides along as a key.
const manifest = JSON.parse(fs.readFileSync(path.join(PUB, "manifest.json"), "utf8"));
manifest.id = "./"; manifest.start_url = "./"; manifest.scope = "./";
if (Array.isArray(manifest.shortcuts)) manifest.shortcuts.forEach(s => { if (typeof s.url === "string") s.url = "." + s.url; });
manifest._generated = DO_NOT_EDIT;
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

// 6) service-worker.js — relative paths, per-build cache name (so a deploy busts
//    the cache and returning visitors get fresh assets), network-first navigation
//    (fresh index/assets when online, cached fallback offline). No /api branch —
//    the static build serves data from IndexedDB, never the network.
//
//    The precache list and the hash input are the same list, deliberately: a file
//    in CORE but outside the hash (manifest.json was exactly that) can change
//    without changing the cache name, pinning returning visitors to a stale copy.
//    Line endings are normalised before hashing because the copied bytes differ
//    between a CRLF and an LF checkout — an EOL-sensitive cache name made docs/
//    irreproducible, so a "docs/ is in sync" CI gate could never stay green.
const PRECACHE = copied.concat(["seed-data.js", "static-bootstrap.js", "index.html", "manifest.json"]).sort();
const hash = require("crypto").createHash("md5");
for (const f of PRECACHE) {
  hash.update(f + "\0" + fs.readFileSync(path.join(OUT, f), "utf8").replace(/\r\n/g, "\n") + "\0");
}
const buildHash = hash.digest("hex").slice(0, 12);
const core = ["./"].concat(PRECACHE.map((f) => "./" + f)).map((u) => "'" + u + "'").join(", ");
const sw =
  "const CACHE_NAME = 'cheatsheet-static-" + buildHash + "';\n" +
  "const CORE = [" + core + "];\n" +
  "self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE))); self.skipWaiting(); });\n" +
  "self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });\n" +
  "self.addEventListener('fetch', e => {\n" +
  "  const { request } = e; if (request.method !== 'GET') return;\n" +
  "  if (request.mode === 'navigate') { e.respondWith(fetch(request).then(r => { const c = r.clone(); caches.open(CACHE_NAME).then(cc => cc.put('./index.html', c)).catch(() => {}); return r; }).catch(() => caches.match('./index.html'))); return; }\n" +
  "  e.respondWith(caches.match(request).then(cached => { const net = fetch(request).then(resp => { if (resp && resp.status === 200 && resp.type === 'basic') { const cl = resp.clone(); caches.open(CACHE_NAME).then(c => c.put(request, cl)).catch(() => {}); } return resp; }).catch(() => cached); return cached || net; }));\n" +
  "});\n";
writeOut("service-worker.js", sw);

// 7) A .nojekyll so GitHub Pages serves files/dirs starting with _ untouched.
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

// 8) Every local asset index.html asks for has to exist in docs/. COPY is
//    hand-maintained, so without this check adding a <script> to public/index.html
//    ships a 404 to Pages and nothing fails until a visitor hits the broken page.
const refs = new Set();
const outHtml = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
for (const m of outHtml.matchAll(/(?:src|href)\s*=\s*"([^"]+)"/g)) {
  const url = m[1];
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) continue; // external, protocol-relative, in-page anchor
  refs.add(url.replace(/^\.\//, "").split(/[?#]/)[0]);
}
const dangling = [...refs].filter((r) => r && !fs.existsSync(path.join(OUT, r)));
if (dangling.length) {
  throw new Error("index.html references files missing from docs/: " + dangling.join(", ") +
    "\n  -> add them to the COPY list in scripts/build-static.js");
}

const files = fs.readdirSync(OUT).sort();
log("✓ Static build written to docs/");
log("  " + files.join(", "));
log("  seed: " + seed.length + " categories bundled into seed-data.js");
log("  verified " + refs.size + " index.html asset reference(s) resolve inside docs/");
log("\nPublish: commit docs/, then GitHub repo Settings > Pages > Source: Deploy from branch, /docs.");
