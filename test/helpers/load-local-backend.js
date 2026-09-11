"use strict";
// Load public/local-backend.js — the complete backend of the only publicly
// deployed build — into Node against the IndexedDB stub.
//
// It is an IIFE that publishes window.CS_BACKEND, so unlike app.js it needs no
// source surgery: install the globals it reads, evaluate it, take the export.
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { installBrowserGlobals } = require("./dom.js");
const { createIndexedDB } = require("./indexeddb.js");

const LOCAL_BACKEND_JS = path.join(__dirname, "..", "..", "public", "local-backend.js");

// Each call gets a fresh in-memory database, so the module's own cache and the
// stub store start empty together and tests cannot leak into each other.
function loadLocalBackend(seed) {
  installBrowserGlobals();
  const idb = createIndexedDB();
  Object.defineProperty(globalThis, "indexedDB", { value: idb, writable: true, configurable: true });
  globalThis.window.CS_SEED = seed || [];
  globalThis.window.CS_SEED_VERSION = "test-seed-v1";
  globalThis.window.CS_STATIC = true;
  vm.runInThisContext(fs.readFileSync(LOCAL_BACKEND_JS, "utf8"), { filename: "local-backend.js" });
  const backend = globalThis.window.CS_BACKEND;
  if (!backend || typeof backend.request !== "function") throw new Error("load-local-backend: window.CS_BACKEND.request was not published");
  return { backend, indexedDB: idb };
}

module.exports = { loadLocalBackend };
