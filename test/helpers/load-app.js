"use strict";
// Reach inside public/app.js without changing it.
//
// app.js is one big IIFE that exports nothing — by design, it is a page script,
// not a module. Rather than duplicating its logic in the tests (which would test
// the copy, not the product), we inject a bridge as the first statement of the
// IIFE body. Function declarations are hoisted, so every named function is
// already bound there; the bridge entries are arrows, so each one resolves its
// target lazily at call time and a renamed function breaks only its own test.
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { installBrowserGlobals } = require("./dom.js");

const PUBLIC_DIR = path.join(__dirname, "..", "..", "public");
const IIFE_HEAD = /\(function\s*\(\s*\)\s*\{\s*\r?\n\s*"use strict";\s*\r?\n/;

// Every name the tests pull out of the closure. Read-only accessors are plain
// call-throughs; the set* entries exist because the app's state lives in `let`
// bindings that nothing outside the IIFE can otherwise reach.
const BRIDGE_SOURCE = `
  globalThis.__CS_APP__ = {
    escapeHtml: (...a) => escapeHtml(...a),
    escapeRegex: (...a) => escapeRegex(...a),
    mdSafeUrl: (...a) => mdSafeUrl(...a),
    renderMarkdown: (...a) => renderMarkdown(...a),
    cvssCompute: (...a) => cvssCompute(...a),
    cvssRoundup: (...a) => cvssRoundup(...a),
    cvssSeverity: (...a) => cvssSeverity(...a),
    cvssVector: (...a) => cvssVector(...a),
    parseNmapOutput: (...a) => parseNmapOutput(...a),
    normalizeService: (...a) => normalizeService(...a),
    normalizeServices: (...a) => normalizeServices(...a),
    normalizeCred: (...a) => normalizeCred(...a),
    credToStr: (...a) => credToStr(...a),
    hay: (...a) => hay(...a),
    buildPaletteBase: () => buildPaletteBase(),
    // Drive the real palette instead of re-implementing its ranking: typing into
    // the input and calling renderPalette is exactly what Ctrl+K does, so the test
    // keeps testing the product after the ranking is rewritten.
    paletteSearch: (q) => { paletteBase = buildPaletteBase(); paletteInput.value = String(q); renderPalette(); return paletteItems; },
    applyIpToCode: (...a) => applyIpToCode(...a),
    refHostLabel: (...a) => refHostLabel(...a),
    hlCode: (...a) => hlCode(...a),
    machineToMarkdown: (...a) => machineToMarkdown(...a),
    // The command card, built by the real builder. Reaching it through render()
    // would mean standing up the whole view — loadData, the API, the hash — to
    // assert something about one card.
    renderCard: (...a) => renderCard(...a),
    wuWordCount: (...a) => wuWordCount(...a),
    cmdAttackList: (...a) => cmdAttackList(...a),
    attackSigOf: (...a) => attackSigOf(...a),
    machineAttackLayer: (...a) => machineAttackLayer(...a),
    t: (...a) => t(...a),
    setCategories: (v) => { CATEGORIES = v; buildSearchIndex(); },
    setMachines: (v) => { machines = v; },
    setWriteups: (v) => { writeups = v; },
    getCategories: () => CATEGORIES,
  };
`;

// Returns { app, window, document, loadError }. loadError is non-null when the
// IIFE threw partway through its own DOM wiring — the bridge is captured before
// that happens, so pure functions stay reachable either way.
function loadApp(opts) {
  const env = installBrowserGlobals(opts);
  const src = fs.readFileSync(path.join(PUBLIC_DIR, "app.js"), "utf8");
  const m = IIFE_HEAD.exec(src);
  if (!m) throw new Error("load-app: could not find the app.js IIFE header to inject the test bridge");
  const patched = src.slice(0, m.index + m[0].length) + BRIDGE_SOURCE + src.slice(m.index + m[0].length);

  // checklist-templates.js is a sibling page script app.js reads off window.
  vm.runInThisContext(fs.readFileSync(path.join(PUBLIC_DIR, "checklist-templates.js"), "utf8"), { filename: "checklist-templates.js" });

  let loadError = null;
  try {
    vm.runInThisContext(patched, { filename: "app.js" });
  } catch (e) {
    loadError = e;
  }
  const app = globalThis.__CS_APP__;
  if (!app) throw new Error("load-app: bridge was never installed; app.js threw before its first statement: " + loadError);
  return { app, window: env.window, document: env.document, loadError };
}

module.exports = { loadApp, PUBLIC_DIR };
