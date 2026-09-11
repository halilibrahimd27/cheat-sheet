"use strict";
// Load the Sessions feature the way the browser does.
//
// public/session-data.js is a plain page script that assigns one global, so the
// data tests evaluate it in a throwaway vm context and never touch the realm —
// they are pure assertions about a shipped fact table and must not depend on
// whether public/session.js exists yet.
//
// The module tests need the real environment instead: app.js owns the integration
// surface session.js is written against (window.CS_APP — escapeHtml, t, toast,
// applyVars), so faking it would test the fake. loadApp() already builds that
// environment, so this stacks session-data.js and session.js on top of it.

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { loadApp, PUBLIC_DIR } = require("./load-app.js");

const DATA_FILE = path.join(PUBLIC_DIR, "session-data.js");
const MODULE_FILE = path.join(PUBLIC_DIR, "session.js");

// The shipped fact table, read without side effects on this realm.
//
// The JSON round-trip is not paranoia: objects born in a vm context carry that
// context's prototypes, and assert.deepStrictEqual compares prototypes — without
// it, every array in the fact table is "not equal" to an identical array written
// in the test file, for a reason that has nothing to do with the data.
function readSessionData() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(DATA_FILE, "utf8"), sandbox, { filename: "session-data.js" });
  return JSON.parse(JSON.stringify(sandbox.window.CS_SESSION_DATA));
}

function hasModule() {
  return fs.existsSync(MODULE_FILE);
}

// Returns { mod, document, container, loadError, missing }.
//
// `missing` is true when public/session.js has not landed yet — the caller then
// fails with a contract message instead of an ENOENT stack, so a red test says
// what is owed rather than what broke.
//
// `loadError` is non-null when session.js threw while evaluating. It is returned
// rather than thrown for the same reason loadApp does it: a module that wires
// itself up eagerly can still have registered window.CS_SESSION first, and the
// test should be able to say which of the two happened.
function loadSession(opts) {
  const o = opts || {};
  const env = loadApp({ hash: o.hash || "" });
  const win = env.window;

  win.CS_SESSION = undefined;
  win.CS_EXAM = undefined;
  // withData:false models the lazy-load window — the view can be opened before
  // the 600KB fact table has arrived, and rendering must survive that.
  if (o.withData === false) {
    win.CS_SESSION_DATA = undefined;
  } else {
    const data = o.data || readSessionData();
    win.CS_SESSION_DATA = data;
  }
  if (o.localStorageSeed) {
    for (const k of Object.keys(o.localStorageSeed)) win.localStorage.setItem(k, o.localStorageSeed[k]);
  }

  if (!hasModule()) {
    return { mod: null, app: env.app, document: env.document, container: env.document.createElement("div"), loadError: null, missing: true, window: win };
  }

  let loadError = null;
  try {
    vm.runInThisContext(fs.readFileSync(MODULE_FILE, "utf8"), { filename: "session.js" });
  } catch (e) {
    loadError = e;
  }
  const container = env.document.createElement("div");
  container.id = "content-area";
  return { mod: win.CS_SESSION || win.CS_EXAM || null, app: env.app, document: env.document, container, loadError, missing: false, window: win };
}

// Resolve one member of the module by any of the names a reasonable
// implementation might have chosen. Returns null when none of them exist, so the
// caller can fail with the full list it looked for — that list IS the contract
// statement, and it is cheaper to widen than to force a rename in a file this
// agent does not own.
function pick(mod, names) {
  if (!mod) return null;
  for (const n of names) if (typeof mod[n] === "function") return mod[n].bind(mod);
  return null;
}

module.exports = { readSessionData, loadSession, hasModule, pick, DATA_FILE, MODULE_FILE };
