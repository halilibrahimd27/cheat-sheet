"use strict";
// Minimal IndexedDB stub — only the request/transaction shape public/local-backend.js
// actually uses. Callbacks fire on a later turn (as the real API does) because
// local-backend attaches onsuccess/onerror AFTER the call returns.
//
// Values are structured-cloned in and out, like the real store: without that the
// tests would share object identity with the "database" and quietly pass on code
// that forgot to persist.

function later(fn) { setTimeout(fn, 0); }
// The real store structured-clones on the way in and out. A JSON round-trip is
// close enough for the JSON-only data this app keeps, and avoids depending on a
// global the project's lint config does not declare.
function clone(v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); }

function createIndexedDB() {
  const databases = new Map();

  function getDatabase(name) {
    if (!databases.has(name)) databases.set(name, { stores: new Map(), created: false });
    return databases.get(name);
  }

  function makeStore(data) {
    return {
      get(key) {
        const req = { result: undefined, error: null, onsuccess: null, onerror: null };
        later(() => { req.result = clone(data.get(key)); if (req.onsuccess) req.onsuccess({ target: req }); });
        return req;
      },
      put(value, key) {
        const req = { result: key, error: null, onsuccess: null, onerror: null };
        data.set(key, clone(value));
        later(() => { if (req.onsuccess) req.onsuccess({ target: req }); });
        return req;
      },
      delete(key) {
        const req = { result: undefined, error: null, onsuccess: null, onerror: null };
        data.delete(key);
        later(() => { if (req.onsuccess) req.onsuccess({ target: req }); });
        return req;
      },
    };
  }

  return {
    // Exposed for tests that want to inspect or preload the "disk".
    _databases: databases,
    open(name) {
      const meta = getDatabase(name);
      const req = { result: null, error: null, onupgradeneeded: null, onsuccess: null, onerror: null };
      const db = {
        objectStoreNames: { contains: (s) => meta.stores.has(s) },
        createObjectStore: (s) => { meta.stores.set(s, new Map()); return makeStore(meta.stores.get(s)); },
        transaction(storeName) {
          const tx = { oncomplete: null, onerror: null, onabort: null, objectStore: () => makeStore(meta.stores.get(storeName) || new Map()) };
          later(() => { if (tx.oncomplete) tx.oncomplete(); });
          return tx;
        },
        close() {},
      };
      req.result = db;
      later(() => {
        if (!meta.created) { meta.created = true; if (req.onupgradeneeded) req.onupgradeneeded({ target: req }); }
        if (req.onsuccess) req.onsuccess({ target: req });
      });
      return req;
    },
    deleteDatabase(name) {
      databases.delete(name);
      const req = { onsuccess: null, onerror: null };
      later(() => { if (req.onsuccess) req.onsuccess({ target: req }); });
      return req;
    },
  };
}

module.exports = { createIndexedDB };
