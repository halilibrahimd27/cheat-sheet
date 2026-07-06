// ============================================================================
// local-backend.js — in-browser API adapter for the STATIC / offline build.
//
// Mirrors the server.js REST contract against IndexedDB so the exact same SPA
// runs with no Node backend (e.g. published to GitHub Pages). Activated only
// when window.CS_STATIC is set; the server path in app.js is untouched otherwise.
//
// Zero dependencies. Data lives in IndexedDB (db "cheatsheet", store "kv" keyed
// by "categories"/"notes"/"writeups"/"machines"). Seeded once from window.CS_SEED.
// Uploaded images are returned as self-contained data: URIs (no /uploads server).
// ============================================================================
(function () {
  "use strict";

  const DB_NAME = "cheatsheet", STORE = "kv", VERSION = 1;
  let _db = null, cache = null;

  function openDB() {
    return new Promise((resolve, reject) => {
      if (_db) return resolve(_db);
      const req = indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = () => { const db = req.result; if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE); };
      req.onsuccess = () => { _db = req.result; resolve(_db); };
      req.onerror = () => reject(req.error);
    });
  }
  function idbGet(key) {
    return openDB().then(db => new Promise((resolve, reject) => {
      const r = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
      r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
    }));
  }
  function idbSet(key, val) {
    return openDB().then(db => new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite"); tx.objectStore(STORE).put(val, key);
      tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
    }));
  }

  // ── helpers mirroring server.js ──
  const CAT_ID_RE = /^[a-z0-9-]+$/;
  function genId(prefix) {
    const a = new Uint8Array(4); crypto.getRandomValues(a);
    return prefix + Array.from(a).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  function shortId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function parseIndex(v) { return typeof v === "string" && /^\d+$/.test(v) ? Number(v) : -1; }
  function isNonEmptyString(v) { return typeof v === "string" && v.trim().length > 0; }
  function backfillIds(data) {
    let changed = false;
    for (const cat of data) {
      for (const sub of cat.subcategories || []) {
        if (!sub.id) { sub.id = genId("s"); changed = true; }
        for (const cmd of sub.commands || []) { if (!cmd.id) { cmd.id = genId("c"); changed = true; } }
      }
    }
    return changed;
  }
  function isValidCategory(c) {
    return c && typeof c === "object" && typeof c.id === "string" && typeof c.name === "string" && Array.isArray(c.subcategories);
  }
  function isValidCategoryArray(a) { return Array.isArray(a) && a.every(isValidCategory); }
  function isValidWriteupArray(a) { return Array.isArray(a) && a.every(w => w && typeof w === "object" && (w.tags === undefined || (Array.isArray(w.tags) && w.tags.every(t => typeof t === "string")))); }
  function isValidNotesMap(m) {
    if (!m || typeof m !== "object" || Array.isArray(m)) return false;
    return Object.keys(m).every(k => CAT_ID_RE.test(k) && Array.isArray(m[k]) && m[k].every(n => n && typeof n === "object" && typeof n.id === "string" && typeof n.text === "string"));
  }

  function seedCopy() { return JSON.parse(JSON.stringify(window.CS_SEED || [])); }

  async function ensureLoaded() {
    if (cache) return cache;
    // Auto-refresh the bundled command set when it changes. build-static.js emits
    // window.CS_SEED_VERSION (a content hash); when it differs from what's stored,
    // re-seed categories from the new bundle so returning visitors get the latest
    // commands/ATT&CK tags WITHOUT clearing site data. Notes/write-ups/machines are
    // preserved. (Custom command edits are replaced — the seed is the source of truth.)
    const wantVer = window.CS_SEED_VERSION || "";
    const haveVer = await idbGet("seedVersion");
    let categories = await idbGet("categories");
    if (!Array.isArray(categories) || (wantVer && haveVer !== wantVer)) {
      categories = seedCopy(); backfillIds(categories);
      await idbSet("categories", categories);
      await idbSet("seedVersion", wantVer);
    } else if (backfillIds(categories)) { await idbSet("categories", categories); }
    const notes = (await idbGet("notes")) || {};
    const writeups = (await idbGet("writeups")) || [];
    const machines = (await idbGet("machines")) || [];
    cache = { categories, notes, writeups, machines };
    return cache;
  }
  const persist = {
    categories: () => idbSet("categories", cache.categories),
    notes: () => idbSet("notes", cache.notes),
    writeups: () => idbSet("writeups", cache.writeups),
    machines: () => idbSet("machines", cache.machines),
  };

  const J = (status, json) => ({ status, json });

  // ── image sniff (reject SVG; same magic bytes as server) ──
  function sniffMime(bytes) {
    if (bytes.length < 12) return null;
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return "image/gif";
    if (bytes[0] === 0x42 && bytes[1] === 0x4d) return "image/bmp";
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
    return null;
  }
  function handleUpload(body) {
    const data = body && body.data;
    if (typeof data !== "string" || !data) return J(400, { error: "no data" });
    let b64 = data.replace(/^data:image\/[\w+]+;base64,/, "");
    let bytes;
    try { const bin = atob(b64); bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); }
    catch { return J(400, { error: "invalid data" }); }
    if (bytes.length === 0) return J(400, { error: "empty file" });
    if (bytes.length > 5 * 1024 * 1024) return J(413, { error: "file too large (max 5MB)" });
    const mime = sniffMime(bytes);
    if (!mime) return J(400, { error: "unsupported or unsafe image type" });
    // Self-contained: hand back a data: URI (mdSafeUrl / <img> both accept it).
    return J(200, { url: "data:" + mime + ";base64," + b64 });
  }

  function defaultChecklist() {
    return [
      { id: "nmap", label: "Initial Nmap Scan", done: false },
      { id: "services", label: "Service Enumeration", done: false },
      { id: "web", label: "Web Application Testing", done: false },
      { id: "vuln", label: "Vulnerability Identified", done: false },
      { id: "exploit", label: "Exploit Found", done: false },
      { id: "foothold", label: "Initial Foothold", done: false },
      { id: "user-flag", label: "User Flag / local.txt", done: false },
      { id: "privesc", label: "Privilege Escalation", done: false },
      { id: "root-flag", label: "Root Flag / proof.txt", done: false },
      { id: "screenshots", label: "Screenshots Taken", done: false },
      { id: "report", label: "Documentation Complete", done: false },
    ];
  }

  // ── Router: (method, path segments, body) → {status, json} ──
  async function route(method, path, body) {
    await ensureLoaded();
    const now = () => new Date().toISOString();
    // strip origin + query, split
    const clean = path.replace(/^[a-z]+:\/\/[^/]+/i, "").split("?")[0].replace(/\/+$/, "");
    const seg = clean.split("/").filter(Boolean); // e.g. ["api","categories",...]
    if (seg[0] !== "api") return J(404, { error: "not found" });
    const r = seg.slice(1).map(decodeURIComponent);

    // /api/health
    if (r[0] === "health") return J(200, { status: "ok", uptime: 0, mode: "static" });

    // /api/categories ...
    if (r[0] === "categories") {
      const data = cache.categories;
      if (r.length === 1) {
        if (method === "GET") return J(200, data);
        if (method === "POST") {
          const { name, icon, description } = body || {};
          if (!isNonEmptyString(name)) return J(400, { error: "name is required" });
          const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
          if (!id) return J(400, { error: "name must contain letters or numbers" });
          if (data.find(c => c.id === id)) return J(409, { error: "Category already exists" });
          const cat = { id, name, icon: (typeof icon === "string" && icon) ? icon : "📂", description: typeof description === "string" ? description : "", subcategories: [] };
          data.push(cat); await persist.categories(); return J(201, cat);
        }
      }
      if (r[1] === "reorder" && method === "POST") {
        const order = body && body.order;
        if (!Array.isArray(order)) return J(400, { error: "order must be an array of category ids" });
        const byId = new Map(data.map(c => [c.id, c])); const out = [];
        for (const id of order) if (byId.has(id)) { out.push(byId.get(id)); byId.delete(id); }
        for (const c of byId.values()) out.push(c);
        cache.categories = out; await persist.categories(); return J(200, { ok: true, categories: out.length });
      }
      const cat = data.find(c => c.id === r[1]);
      // /api/categories/:id
      if (r.length === 2) {
        if (!cat) return J(404, { error: "Category not found" });
        if (method === "PUT") {
          if (body.name !== undefined) { if (!isNonEmptyString(body.name)) return J(400, { error: "name must be a non-empty string" }); cat.name = body.name; }
          if (typeof body.icon === "string" && body.icon) cat.icon = body.icon;
          if (body.description !== undefined) { if (typeof body.description !== "string") return J(400, { error: "description must be a string" }); cat.description = body.description; }
          await persist.categories(); return J(200, cat);
        }
        if (method === "DELETE") { const i = data.findIndex(c => c.id === r[1]); data.splice(i, 1); await persist.categories(); return J(200, { ok: true }); }
      }
      // /api/categories/:id/subcategories ...
      if (r[2] === "subcategories") {
        if (!cat) return J(404, { error: "Category not found" });
        if (r.length === 3 && method === "POST") {
          if (!isNonEmptyString(body.name)) return J(400, { error: "name is required" });
          const sub = { id: genId("s"), name: body.name, commands: [] };
          cat.subcategories.push(sub); await persist.categories(); return J(201, sub);
        }
        const sub = cat.subcategories[parseIndex(r[3])];
        if (r.length === 4) {
          if (!sub) return J(404, { error: "Subcategory not found" });
          if (method === "PUT") { if (body.name !== undefined) { if (!isNonEmptyString(body.name)) return J(400, { error: "name must be a non-empty string" }); sub.name = body.name; } await persist.categories(); return J(200, sub); }
          if (method === "DELETE") { cat.subcategories.splice(parseIndex(r[3]), 1); await persist.categories(); return J(200, { ok: true }); }
        }
        if (r[4] === "commands") {
          if (!sub) return J(404, { error: "Subcategory not found" });
          if (r.length === 5 && method === "POST") {
            const { title, desc, cmd, cmds, tags, note } = body || {};
            if (!isNonEmptyString(title)) return J(400, { error: "title is required" });
            const command = { id: genId("c"), title, desc: desc || "" };
            if (cmds && cmds.length) command.cmds = cmds; else if (cmd) command.cmd = cmd;
            command.tags = tags || []; if (note) command.note = note;
            if (Array.isArray(body.attack) ? body.attack.length : body.attack) command.attack = body.attack;
            if (Array.isArray(body.refs) && body.refs.length) command.refs = body.refs;
            if (body.ref) command.ref = body.ref;
            sub.commands.push(command); await persist.categories(); return J(201, command);
          }
          const command = sub.commands[parseIndex(r[5])];
          if (r.length === 6) {
            if (!command) return J(404, { error: "Command not found" });
            if (method === "PUT") {
              if (body.title) command.title = body.title;
              if (body.desc !== undefined) command.desc = body.desc;
              if (body.cmd !== undefined) { command.cmd = body.cmd; delete command.cmds; }
              if (body.cmds) { command.cmds = body.cmds; delete command.cmd; }
              if (body.tags) command.tags = body.tags;
              if (body.note !== undefined) command.note = body.note;
              if (body.attack !== undefined) { if (Array.isArray(body.attack) ? body.attack.length : body.attack) command.attack = body.attack; else delete command.attack; }
              if (body.refs !== undefined) { if (Array.isArray(body.refs) && body.refs.length) command.refs = body.refs; else delete command.refs; }
              if (body.ref !== undefined) { if (body.ref) command.ref = body.ref; else delete command.ref; }
              await persist.categories(); return J(200, command);
            }
            if (method === "DELETE") { sub.commands.splice(parseIndex(r[5]), 1); await persist.categories(); return J(200, { ok: true }); }
          }
        }
      }
      return J(404, { error: "not found" });
    }

    // /api/notes ...
    if (r[0] === "notes") {
      if (r.length === 1 && method === "GET") return J(200, cache.notes);
      const catId = r[1];
      if (r.length === 2) {
        if (method === "GET") { if (!CAT_ID_RE.test(catId)) return J(200, []); return J(200, Object.prototype.hasOwnProperty.call(cache.notes, catId) ? cache.notes[catId] : []); }
        if (method === "POST") {
          if (!CAT_ID_RE.test(catId)) return J(400, { error: "invalid category id" });
          if (body.text !== undefined && typeof body.text !== "string") return J(400, { error: "text must be a string" });
          if (!Object.prototype.hasOwnProperty.call(cache.notes, catId)) cache.notes[catId] = [];
          const note = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), text: body.text || "", createdAt: now() };
          cache.notes[catId].push(note); await persist.notes(); return J(201, note);
        }
      }
      if (r.length === 3) {
        const noteId = r[2];
        if (method === "PUT") {
          if (!CAT_ID_RE.test(catId)) return J(404, { error: "not found" });
          const arr = cache.notes[catId] || []; const note = arr.find(n => n.id === noteId);
          if (!note) return J(404, { error: "not found" });
          if (body.text !== undefined) note.text = body.text;
          await persist.notes(); return J(200, note);
        }
        if (method === "DELETE") {
          if (CAT_ID_RE.test(catId) && cache.notes[catId]) {
            cache.notes[catId] = cache.notes[catId].filter(n => n.id !== noteId);
            if (!cache.notes[catId].length) delete cache.notes[catId];
            await persist.notes();
          }
          return J(200, { ok: true });
        }
      }
      return J(404, { error: "not found" });
    }

    // /api/writeups ...
    if (r[0] === "writeups") {
      const wups = cache.writeups;
      if (r.length === 1) {
        if (method === "GET") return J(200, wups);
        if (method === "POST") {
          const { title, tags, content } = body || {};
          if (!isNonEmptyString(title)) return J(400, { error: "title required" });
          if (tags !== undefined && !(Array.isArray(tags) && tags.every(t => typeof t === "string"))) return J(400, { error: "tags must be an array of strings" });
          if (content !== undefined && typeof content !== "string") return J(400, { error: "content must be a string" });
          const wu = { id: shortId(), title, tags: tags || [], content: content || "", createdAt: now(), updatedAt: now() };
          wups.unshift(wu); await persist.writeups(); return J(201, wu);
        }
      }
      if (r.length === 2) {
        const wu = wups.find(w => w.id === r[1]);
        if (method === "PUT") {
          if (!wu) return J(404, { error: "not found" });
          if (body.title !== undefined) wu.title = body.title;
          if (body.tags !== undefined) wu.tags = body.tags;
          if (body.content !== undefined) wu.content = body.content;
          if (body.relatedMachine !== undefined) wu.relatedMachine = body.relatedMachine;
          wu.updatedAt = now(); await persist.writeups(); return J(200, wu);
        }
        if (method === "DELETE") { cache.writeups = wups.filter(w => w.id !== r[1]); await persist.writeups(); return J(200, { ok: true }); }
      }
      return J(404, { error: "not found" });
    }

    // /api/machines ...
    if (r[0] === "machines") {
      const machines = cache.machines;
      if (r.length === 1) {
        if (method === "GET") return J(200, machines);
        if (method === "POST") {
          const { name, ip, os, platform, difficulty, status, tags } = body || {};
          if (!isNonEmptyString(name)) return J(400, { error: "name required" });
          const machine = {
            id: shortId(), name, ip: ip || "", os: os || "unknown",
            platform: (typeof platform === "string" && platform) ? platform : "Custom",
            difficulty: typeof difficulty === "string" ? difficulty : "",
            status: (typeof status === "string" && status) ? status : "not-started",
            tags: Array.isArray(tags) ? tags.filter(t => typeof t === "string") : [],
            userFlag: { value: "", capturedAt: null }, rootFlag: { value: "", capturedAt: null },
            startedAt: null, ownedAt: null, services: [], credentials: [], notes: "", timeline: [], evidence: [],
            checklist: defaultChecklist(), createdAt: now(), updatedAt: now(),
          };
          machines.push(machine); await persist.machines(); return J(201, machine);
        }
      }
      if (r.length === 2) {
        const m = machines.find(x => x.id === r[1]);
        if (method === "PUT") {
          if (!m) return J(404, { error: "not found" });
          for (const key of ["name", "ip", "os", "services", "credentials", "notes", "checklist", "template", "hosts", "attackPath",
            "platform", "difficulty", "status", "tags", "userFlag", "rootFlag", "startedAt", "ownedAt", "timeline", "evidence"]) {
            if (body[key] !== undefined) m[key] = body[key];
          }
          m.updatedAt = now(); await persist.machines(); return J(200, m);
        }
        if (method === "DELETE") { cache.machines = machines.filter(x => x.id !== r[1]); await persist.machines(); return J(200, { ok: true }); }
      }
      return J(404, { error: "not found" });
    }

    // /api/upload
    if (r[0] === "upload" && method === "POST") return handleUpload(body);

    // /api/export
    if (r[0] === "export" && method === "GET") return J(200, exportBundle());

    // /api/import
    if (r[0] === "import" && method === "POST") {
      if (Array.isArray(body)) {
        if (!isValidCategoryArray(body)) return J(400, { error: "invalid categories format" });
        backfillIds(body); cache.categories = body; await persist.categories(); return J(200, { ok: true, categories: body.length });
      }
      if (!body || typeof body !== "object") return J(400, { error: "invalid import body" });
      if (body.categories !== undefined && !isValidCategoryArray(body.categories)) return J(400, { error: "invalid categories format" });
      if (body.notes !== undefined && !isValidNotesMap(body.notes)) return J(400, { error: "invalid notes format" });
      if (body.writeups !== undefined && !isValidWriteupArray(body.writeups)) return J(400, { error: "invalid writeups format" });
      if (body.machines !== undefined && !Array.isArray(body.machines)) return J(400, { error: "invalid machines format" });
      if (body.categories === undefined && body.notes === undefined && body.writeups === undefined && body.machines === undefined) return J(400, { error: "nothing to import" });
      if (body.categories) { backfillIds(body.categories); cache.categories = body.categories; await persist.categories(); }
      if (body.notes) { cache.notes = body.notes; await persist.notes(); }
      if (body.writeups) { cache.writeups = body.writeups; await persist.writeups(); }
      if (body.machines) { cache.machines = body.machines; await persist.machines(); }
      return J(200, { ok: true, categories: body.categories ? body.categories.length : 0 });
    }

    // /api/reset
    if (r[0] === "reset" && method === "POST") {
      cache.categories = seedCopy(); backfillIds(cache.categories); await persist.categories();
      return J(200, { ok: true });
    }

    return J(404, { error: "not found" });
  }

  function exportBundle() { return { categories: cache.categories, notes: cache.notes, writeups: cache.writeups, machines: cache.machines }; }

  // Public API consumed by app.js's api() helper when window.CS_STATIC is set.
  window.CS_BACKEND = {
    async request(method, url, body) { return route(String(method || "GET").toUpperCase(), String(url || ""), body); },
    async exportBundle() { await ensureLoaded(); return exportBundle(); },
  };
})();
