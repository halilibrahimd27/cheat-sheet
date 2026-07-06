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

// Fresh docs/ each build (keeps stale files from lingering).
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// 1) Copy the SPA assets verbatim.
const COPY = ["style.css", "app.js", "checklist-templates.js", "local-backend.js"];
for (const f of COPY) fs.copyFileSync(path.join(PUB, f), path.join(OUT, f));

// 2) Bundle the seed data as a browser global.
const seed = require(path.join(ROOT, "seed.js"));
fs.writeFileSync(path.join(OUT, "seed-data.js"), "window.CS_SEED = " + JSON.stringify(seed) + ";\n");

// 3) index.html — inject the static bootstrap before app.js, relative SW register.
let html = fs.readFileSync(path.join(PUB, "index.html"), "utf8");
const bootstrap =
  '    <script>window.CS_STATIC = true;</script>\n' +
  '    <script src="seed-data.js"></script>\n' +
  '    <script src="local-backend.js"></script>\n' +
  '    <script src="app.js"></script>';
if (!html.includes('<script src="app.js"></script>')) {
  throw new Error("index.html: could not find app.js script tag to inject before");
}
html = html.replace('    <script src="app.js"></script>', bootstrap);
// Relative service-worker registration so it resolves under a subpath.
html = html.replace("navigator.serviceWorker.register('/service-worker.js')", "navigator.serviceWorker.register('./service-worker.js')");
fs.writeFileSync(path.join(OUT, "index.html"), html);

// 4) manifest.json — rewrite absolute "/" URLs to relative "./" for subpaths.
const manifest = JSON.parse(fs.readFileSync(path.join(PUB, "manifest.json"), "utf8"));
manifest.id = "./"; manifest.start_url = "./"; manifest.scope = "./";
if (Array.isArray(manifest.shortcuts)) manifest.shortcuts.forEach(s => { if (typeof s.url === "string") s.url = "." + s.url; });
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

// 5) service-worker.js — relative-path, cache-first core (no /api branch: the
//    static build never hits the network for data — IndexedDB serves it).
const sw =
  "const CACHE_NAME = 'cheatsheet-static-v1';\n" +
  "const CORE = ['./', './index.html', './style.css', './app.js', './checklist-templates.js', './local-backend.js', './seed-data.js', './manifest.json'];\n" +
  "self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE))); self.skipWaiting(); });\n" +
  "self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });\n" +
  "self.addEventListener('fetch', e => {\n" +
  "  const { request } = e; if (request.method !== 'GET') return;\n" +
  "  if (request.mode === 'navigate') { e.respondWith(caches.match('./index.html').then(c => c || fetch(request))); return; }\n" +
  "  e.respondWith(caches.match(request).then(cached => {\n" +
  "    const net = fetch(request).then(resp => { if (resp && resp.status === 200 && resp.type === 'basic') { const cl = resp.clone(); caches.open(CACHE_NAME).then(c => c.put(request, cl)).catch(() => {}); } return resp; }).catch(() => cached);\n" +
  "    return cached || net;\n" +
  "  }));\n" +
  "});\n";
fs.writeFileSync(path.join(OUT, "service-worker.js"), sw);

// 6) A .nojekyll so GitHub Pages serves files/dirs starting with _ untouched.
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

const files = fs.readdirSync(OUT).sort();
log("✓ Static build written to docs/");
log("  " + files.join(", "));
log("  seed: " + seed.length + " categories bundled into seed-data.js");
log("\nPublish: commit docs/, then GitHub repo Settings > Pages > Source: Deploy from branch, /docs.");
