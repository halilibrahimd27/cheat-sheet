// ============================================================================
// local-backend.js — in-browser API adapter for the STATIC / offline build.
//
// Mirrors the server.js REST contract against IndexedDB so the exact same SPA
// runs with no Node backend (e.g. published to GitHub Pages). Activated only
// when window.CS_STATIC is set; the server path in app.js is untouched otherwise.
//
// Zero dependencies. Data lives in IndexedDB (db "cheatsheet", store "kv" keyed
// by "categories"/"notes"/"writeups"/"machines"/"exam"). Seeded from
// window.CS_SEED, then MERGED (never replaced) when a new bundle ships.
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
  // There is no server here, so a write that fails (quota exceeded, private mode,
  // evicted database) must not look like a network error — and must not leave the
  // in-memory copy holding an edit that never landed. Drop the whole cache so the
  // next request re-reads what IndexedDB actually holds, and say so explicitly.
  async function save(key) {
    try { await idbSet(key, cache[key]); return null; }
    catch (e) {
      console.error("[local-backend] persist failed", key, e);
      cache = null;
      return J(507, { error: "storage full or unavailable" });
    }
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
  // Nested shape matters as much as the top level: a subcategory without a
  // commands array permanently breaks the /commands routes below.
  function isValidCategory(c) {
    return c && typeof c === "object" && typeof c.id === "string" && typeof c.name === "string" && Array.isArray(c.subcategories) &&
      c.subcategories.every(s => s && typeof s === "object" && typeof s.name === "string" && Array.isArray(s.commands) &&
        s.commands.every(cmd => cmd && typeof cmd === "object"));
  }
  function isValidCategoryArray(a) { return Array.isArray(a) && a.every(isValidCategory); }
  // machines holds the credential vault — it gets a real validator, not Array.isArray.
  function isValidMachineArray(a) {
    return Array.isArray(a) && a.every(m => m && typeof m === "object" && !Array.isArray(m) &&
      typeof m.id === "string" && typeof m.name === "string" &&
      (m.status === undefined || typeof m.status === "string") &&
      (m.difficulty === undefined || typeof m.difficulty === "string"));
  }
  function isPlainObject(v) { return !!v && typeof v === "object" && !Array.isArray(v); }
  // Ids end up as element keys and data- attributes, so an imported id must never
  // be able to carry markup. Regenerate rather than reject: an old export may
  // predate stable ids entirely.
  const ID_SAFE_RE = /^[A-Za-z0-9_-]{1,64}$/;
  function sanitizeImportedIds(categories, machines) {
    let regenerated = 0;
    for (const cat of categories || []) {
      if (!ID_SAFE_RE.test(cat.id)) { cat.id = genId("cat-"); regenerated++; }
      for (const sub of cat.subcategories || []) {
        if (sub.id !== undefined && !(typeof sub.id === "string" && ID_SAFE_RE.test(sub.id))) { sub.id = genId("s"); regenerated++; }
        for (const cmd of sub.commands || []) {
          if (cmd.id !== undefined && !(typeof cmd.id === "string" && ID_SAFE_RE.test(cmd.id))) { cmd.id = genId("c"); regenerated++; }
        }
      }
    }
    for (const m of machines || []) { if (!ID_SAFE_RE.test(m.id)) { m.id = genId("m"); regenerated++; } }
    return regenerated;
  }
  function isValidWriteupArray(a) { return Array.isArray(a) && a.every(w => w && typeof w === "object" && (w.tags === undefined || (Array.isArray(w.tags) && w.tags.every(t => typeof t === "string")))); }
  function isValidNotesMap(m) {
    if (!m || typeof m !== "object" || Array.isArray(m)) return false;
    return Object.keys(m).every(k => CAT_ID_RE.test(k) && Array.isArray(m[k]) && m[k].every(n => n && typeof n === "object" && typeof n.id === "string" && typeof n.text === "string"));
  }

  function seedCopy() { return JSON.parse(JSON.stringify(window.CS_SEED || [])); }

  // ── Seed merge (identity-based three-way merge, never destructive) ──
  // The bundled seed ships without ids, so records are paired on a normalised
  // signature: a subcategory by name, a command by title+command text, then by
  // the command text alone, then by title. The text-only step is what recognises
  // a RENAMED command: renaming is the most ordinary customisation there is, and
  // title+text plus title-alone both miss it, so every update used to hand the
  // user a second copy of it. FNV-1a stands in for the server's md5 — the
  // baseline never leaves this browser, so only self-consistency matters.
  const CAT_FIELDS = ["name", "icon", "description", "name_tr", "description_tr"];
  const SUB_FIELDS = ["name", "name_tr"];
  const CMD_FIELDS = ["title", "desc", "cmd", "cmds", "tags", "note", "out", "attack", "refs", "ref", "desc_tr"];
  // Marks a baseline entry as "this text is the USER's, not the seed's". Hashes
  // are hex, so the prefix can never collide with one — see applyRecord.
  const USER_BASE = "u:";
  function norm(v) { return String(v == null ? "" : v).replace(/\s+/g, " ").trim().toLowerCase(); }
  function cmdBody(c) {
    return norm(Array.isArray(c.cmds) ? c.cmds.map(x => (typeof x === "string" ? x : (x && (x.cmd || x.command)) || "")).join("\n") : (c.cmd || ""));
  }
  function cmdSig(c) { return norm(c.title) + " || " + cmdBody(c); }
  function hashStr(s) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0; }
    return h.toString(16);
  }
  function recordHash(obj, fields) {
    const pick = {};
    for (const f of fields) if (obj[f] !== undefined) pick[f] = obj[f];
    return hashStr(JSON.stringify(pick));
  }
  function buildBaseline(data) {
    const base = {};
    for (const cat of data) {
      base[cat.id] = recordHash(cat, CAT_FIELDS);
      for (const sub of cat.subcategories || []) {
        base[sub.id] = recordHash(sub, SUB_FIELDS);
        for (const cmd of sub.commands || []) base[cmd.id] = recordHash(cmd, CMD_FIELDS);
      }
    }
    return base;
  }
  function cloneFrom(seedRec, fields) {
    const out = {};
    for (const f of fields) if (seedRec[f] !== undefined) out[f] = JSON.parse(JSON.stringify(seedRec[f]));
    return out;
  }
  function applyRecord(userRec, seedRec, fields, baseline, stats) {
    const seedHash = recordHash(seedRec, fields);
    const userHash = recordHash(userRec, fields);
    if (userHash === seedHash) { stats.unchanged++; return seedHash; }
    const base = baseline[userRec.id];
    // A real three-way merge: only a record still equal to what the seed last
    // wrote may advance. A visitor whose database predates the baseline has no
    // merge base at all, and the old identity-field fallback declared those
    // records "unmodified seed content" and overwrote them, silently deleting the
    // user's edits. No merge base now means: assume the text is the user's and
    // leave it. The merge base we then record is that user text, tagged USER_BASE
    // so a later run can never mistake it for seed content and advance over it.
    const untouched = base !== undefined && base === userHash;
    if (!untouched) { stats.skipped++; return base !== undefined ? base : USER_BASE + userHash; }
    Object.assign(userRec, cloneFrom(seedRec, fields));
    for (const f of fields) if (seedRec[f] === undefined) delete userRec[f];
    stats.updated++;
    return seedHash;
  }
  function mergeSeedInto(data, seed, baseline) {
    const stats = { added: 0, updated: 0, skipped: 0, unchanged: 0 };
    const next = {};
    const keep = (id, hash) => { if (hash !== undefined) next[id] = hash; };
    const catById = new Map(data.map(c => [c.id, c]));
    for (const sCat of seed) {
      let cat = catById.get(sCat.id);
      if (!cat) {
        cat = Object.assign({ id: sCat.id }, cloneFrom(sCat, CAT_FIELDS), { subcategories: [] });
        if (typeof cat.description !== "string") cat.description = "";
        data.push(cat); catById.set(cat.id, cat); stats.added++;
        keep(cat.id, recordHash(sCat, CAT_FIELDS));
      } else {
        if (!Array.isArray(cat.subcategories)) cat.subcategories = [];
        keep(cat.id, applyRecord(cat, sCat, CAT_FIELDS, baseline, stats));
      }
      const subByName = new Map(), subById = new Map();
      for (const s of cat.subcategories) { if (!subByName.has(norm(s.name))) subByName.set(norm(s.name), s); if (s.id) subById.set(s.id, s); }
      const usedSubs = new Set();
      for (const sSub of sCat.subcategories || []) {
        let sub = (sSub.id && subById.get(sSub.id)) || subByName.get(norm(sSub.name));
        if (sub && usedSubs.has(sub)) sub = null;
        if (!sub) {
          sub = Object.assign({ id: genId("s") }, cloneFrom(sSub, SUB_FIELDS), { commands: [] });
          cat.subcategories.push(sub); subByName.set(norm(sub.name), sub); stats.added++;
          keep(sub.id, recordHash(sSub, SUB_FIELDS));
        } else {
          if (!Array.isArray(sub.commands)) sub.commands = [];
          keep(sub.id, applyRecord(sub, sSub, SUB_FIELDS, baseline, stats));
        }
        usedSubs.add(sub);
        const bySig = new Map(), byBody = new Map(), byTitle = new Map(), byId = new Map(), byProvenance = new Map();
        const index = (c) => {
          if (c.id) byId.set(c.id, c);
          if (!bySig.has(cmdSig(c))) bySig.set(cmdSig(c), c);
          const body = cmdBody(c);
          if (body && !byBody.has(body)) byBody.set(body, c);
          if (!byTitle.has(norm(c.title))) byTitle.set(norm(c.title), c);
          // What the seed wrote when it provisioned this record. A user who
          // renamed a command AND rewrote its body is unreachable by text, but the
          // record still carries the provenance of the seed entry it came from.
          const base = baseline[c.id];
          if (base !== undefined && !base.startsWith(USER_BASE) && !byProvenance.has(base)) byProvenance.set(base, c);
        };
        for (const c of sub.commands) index(c);
        const usedCmds = new Set();
        for (const sCmd of sSub.commands || []) {
          const seedHash = recordHash(sCmd, CMD_FIELDS);
          let cmd = (sCmd.id && byId.get(sCmd.id)) || bySig.get(cmdSig(sCmd)) ||
            byBody.get(cmdBody(sCmd)) || byTitle.get(norm(sCmd.title)) || byProvenance.get(seedHash);
          if (cmd && usedCmds.has(cmd)) cmd = null;
          if (!cmd) {
            cmd = Object.assign({ id: genId("c") }, cloneFrom(sCmd, CMD_FIELDS));
            sub.commands.push(cmd); index(cmd); stats.added++;
            keep(cmd.id, seedHash);
          } else {
            keep(cmd.id, applyRecord(cmd, sCmd, CMD_FIELDS, baseline, stats));
          }
          usedCmds.add(cmd);
        }
      }
    }
    return { stats, baseline: next };
  }
  // Favourites are keyed by command id, so a reset that re-mints ids orphans all
  // of them. Carry the existing ids onto every record the seed still contains.
  function preserveIds(seed, current) {
    const catById = new Map(current.map(c => [c.id, c]));
    for (const sCat of seed) {
      const cat = catById.get(sCat.id);
      if (!cat) continue;
      const subByName = new Map();
      for (const s of cat.subcategories || []) if (s.id && !subByName.has(norm(s.name))) subByName.set(norm(s.name), s);
      const usedSubs = new Set();
      for (const sSub of sCat.subcategories || []) {
        const sub = subByName.get(norm(sSub.name));
        if (!sub || usedSubs.has(sub.id)) continue;
        usedSubs.add(sub.id); sSub.id = sub.id;
        const bySig = new Map(), byBody = new Map(), byTitle = new Map();
        for (const c of sub.commands || []) {
          if (!c.id) continue;
          if (!bySig.has(cmdSig(c))) bySig.set(cmdSig(c), c);
          const body = cmdBody(c);
          if (body && !byBody.has(body)) byBody.set(body, c);
          if (!byTitle.has(norm(c.title))) byTitle.set(norm(c.title), c);
        }
        const usedCmds = new Set();
        for (const sCmd of sSub.commands || []) {
          // Same ladder as the merge: a renamed command must keep its id, or the
          // favourites keyed to it are orphaned by the reset.
          const match = bySig.get(cmdSig(sCmd)) || byBody.get(cmdBody(sCmd)) || byTitle.get(norm(sCmd.title));
          if (!match || usedCmds.has(match.id)) continue;
          usedCmds.add(match.id); sCmd.id = match.id;
        }
      }
    }
  }

  async function ensureLoaded() {
    if (cache) return cache;
    // build-static.js emits window.CS_SEED_VERSION (a content hash). When it
    // differs from what is stored, MERGE the new bundle into what the visitor
    // has: this used to overwrite categories wholesale, which silently deleted
    // every command, subcategory and category the user had created or edited.
    const wantVer = window.CS_SEED_VERSION || "";
    const haveVer = await idbGet("seedVersion");
    let categories = await idbGet("categories");
    let baseline = (await idbGet("seedBaseline")) || {};
    // Provisioning writes are best effort: read-only storage should still yield a
    // working (in-memory) app rather than a dead page.
    const tryWrite = async (key, val) => { try { await idbSet(key, val); } catch (e) { console.error("[local-backend] cannot persist", key, e); } };
    if (!Array.isArray(categories)) {
      categories = seedCopy(); backfillIds(categories);
      baseline = buildBaseline(categories);
      await tryWrite("categories", categories);
      await tryWrite("seedVersion", wantVer);
      await tryWrite("seedBaseline", baseline);
    } else if (wantVer && haveVer !== wantVer) {
      const merged = mergeSeedInto(categories, seedCopy(), baseline);
      backfillIds(categories);
      await tryWrite("categories", categories);
      await tryWrite("seedVersion", wantVer);
      await tryWrite("seedBaseline", merged.baseline);
    } else if (backfillIds(categories)) { await tryWrite("categories", categories); }
    const notes = (await idbGet("notes")) || {};
    const writeups = (await idbGet("writeups")) || [];
    const machines = (await idbGet("machines")) || [];
    const exam = (await idbGet("exam")) || {};
    cache = { categories, notes, writeups, machines, exam };
    return cache;
  }
  const persist = {
    categories: () => save("categories"),
    notes: () => save("notes"),
    writeups: () => save("writeups"),
    machines: () => save("machines"),
    exam: () => save("exam"),
  };

  const J = (status, json) => ({ status, json });
  // Hand back the persistence error when there was one, otherwise the payload.
  const orErr = (err, result) => err || result;

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

  // Field types the machine PUT accepts, mirroring server.js: the PUT used to
  // copy whatever arrived, which is how a machine ended up with a non-string
  // status that broke every later read of it.
  const MACHINE_FIELD_TYPES = {
    name: "nonEmptyString", ip: "string", os: "string", notes: "string", template: "string",
    platform: "string", difficulty: "string", status: "string", attackPath: "string",
    startedAt: "stringOrNull", ownedAt: "stringOrNull",
    services: "array", credentials: "array", checklist: "array", hosts: "array",
    timeline: "array", evidence: "array", tags: "stringArray",
    userFlag: "object", rootFlag: "object",
  };
  function checkFieldType(value, kind) {
    switch (kind) {
      case "nonEmptyString": return isNonEmptyString(value);
      case "string": return typeof value === "string";
      case "stringOrNull": return value === null || typeof value === "string";
      case "array": return Array.isArray(value);
      case "stringArray": return Array.isArray(value) && value.every(t => typeof t === "string");
      case "object": return isPlainObject(value);
      default: return true;
    }
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
    if (String(seg[0] || "").toLowerCase() !== "api") return J(404, { error: "not found" });
    const r = seg.slice(1).map(decodeURIComponent);
    // Express routes its literal path segments case-INsensitively, so the server
    // answers /API/Categories exactly as /api/categories. Match the fixed route
    // words through `k` so the static build does not quietly 404 where the server
    // succeeds; ids stay in `r`, because a param's case is the user's data
    // (/api/notes/Recon is an invalid category id, not a spelling of "recon").
    const k = r.map(s => s.toLowerCase());

    // /api/health
    if (k[0] === "health") return J(200, { status: "ok", uptime: 0, mode: "static" });

    // /api/categories ...
    if (k[0] === "categories") {
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
          data.push(cat); return orErr(await persist.categories(), J(201, cat));
        }
      }
      if (k[1] === "reorder" && method === "POST") {
        const order = body && body.order;
        if (!Array.isArray(order)) return J(400, { error: "order must be an array of category ids" });
        const byId = new Map(data.map(c => [c.id, c])); const out = [];
        for (const id of order) if (byId.has(id)) { out.push(byId.get(id)); byId.delete(id); }
        for (const c of byId.values()) out.push(c);
        cache.categories = out; return orErr(await persist.categories(), J(200, { ok: true, categories: out.length }));
      }
      const cat = data.find(c => c.id === r[1]);
      // /api/categories/:id
      if (r.length === 2) {
        if (!cat) return J(404, { error: "Category not found" });
        if (method === "PUT") {
          if (body.name !== undefined) { if (!isNonEmptyString(body.name)) return J(400, { error: "name must be a non-empty string" }); cat.name = body.name; }
          if (typeof body.icon === "string" && body.icon) cat.icon = body.icon;
          if (body.description !== undefined) { if (typeof body.description !== "string") return J(400, { error: "description must be a string" }); cat.description = body.description; }
          return orErr(await persist.categories(), J(200, cat));
        }
        if (method === "DELETE") { const i = data.findIndex(c => c.id === r[1]); data.splice(i, 1); return orErr(await persist.categories(), J(200, { ok: true })); }
      }
      // /api/categories/:id/subcategories ...
      if (k[2] === "subcategories") {
        if (!cat) return J(404, { error: "Category not found" });
        if (r.length === 3 && method === "POST") {
          if (!isNonEmptyString(body.name)) return J(400, { error: "name is required" });
          const sub = { id: genId("s"), name: body.name, commands: [] };
          cat.subcategories.push(sub); return orErr(await persist.categories(), J(201, sub));
        }
        const sub = cat.subcategories[parseIndex(r[3])];
        if (r.length === 4) {
          if (!sub) return J(404, { error: "Subcategory not found" });
          if (method === "PUT") { if (body.name !== undefined) { if (!isNonEmptyString(body.name)) return J(400, { error: "name must be a non-empty string" }); sub.name = body.name; } return orErr(await persist.categories(), J(200, sub)); }
          if (method === "DELETE") { cat.subcategories.splice(parseIndex(r[3]), 1); return orErr(await persist.categories(), J(200, { ok: true })); }
        }
        if (k[4] === "commands") {
          if (!sub) return J(404, { error: "Subcategory not found" });
          if (r.length === 5 && method === "POST") {
            const { title, desc, cmd, cmds, tags, note } = body || {};
            if (!isNonEmptyString(title)) return J(400, { error: "title is required" });
            const command = { id: genId("c"), title, desc: desc || "" };
            if (cmds && cmds.length) command.cmds = cmds; else if (cmd) command.cmd = cmd;
            command.tags = tags || []; if (note) command.note = note;
            if (body.out) command.out = body.out;
            if (Array.isArray(body.attack) ? body.attack.length : body.attack) command.attack = body.attack;
            if (Array.isArray(body.refs) && body.refs.length) command.refs = body.refs;
            if (body.ref) command.ref = body.ref;
            sub.commands.push(command); return orErr(await persist.categories(), J(201, command));
          }
          const command = sub.commands[parseIndex(r[5])];
          if (r.length === 6) {
            if (!command) return J(404, { error: "Command not found" });
            if (method === "PUT") {
              if (body.title !== undefined && !isNonEmptyString(body.title)) return J(400, { error: "title must be a non-empty string" });
              for (const k of ["desc", "cmd", "note", "out"]) if (body[k] !== undefined && typeof body[k] !== "string") return J(400, { error: k + " must be a string" });
              if (body.cmds !== undefined && !Array.isArray(body.cmds)) return J(400, { error: "cmds must be an array" });
              if (body.tags !== undefined && !Array.isArray(body.tags)) return J(400, { error: "tags must be an array" });
              if (body.title) command.title = body.title;
              if (body.desc !== undefined) command.desc = body.desc;
              if (body.cmd !== undefined) { command.cmd = body.cmd; delete command.cmds; }
              if (body.cmds) { command.cmds = body.cmds; delete command.cmd; }
              if (body.tags) command.tags = body.tags;
              if (body.note !== undefined) command.note = body.note;
              // Expected output: empty clears it, so the field can be emptied on edit.
              if (body.out !== undefined) { if (body.out) command.out = body.out; else delete command.out; }
              if (body.attack !== undefined) { if (Array.isArray(body.attack) ? body.attack.length : body.attack) command.attack = body.attack; else delete command.attack; }
              if (body.refs !== undefined) { if (Array.isArray(body.refs) && body.refs.length) command.refs = body.refs; else delete command.refs; }
              if (body.ref !== undefined) { if (body.ref) command.ref = body.ref; else delete command.ref; }
              return orErr(await persist.categories(), J(200, command));
            }
            if (method === "DELETE") { sub.commands.splice(parseIndex(r[5]), 1); return orErr(await persist.categories(), J(200, { ok: true })); }
          }
        }
      }
      return J(404, { error: "not found" });
    }

    // /api/notes ...
    if (k[0] === "notes") {
      if (r.length === 1 && method === "GET") return J(200, cache.notes);
      const catId = r[1];
      if (r.length === 2) {
        if (method === "GET") { if (!CAT_ID_RE.test(catId)) return J(200, []); return J(200, Object.prototype.hasOwnProperty.call(cache.notes, catId) ? cache.notes[catId] : []); }
        if (method === "POST") {
          if (!CAT_ID_RE.test(catId)) return J(400, { error: "invalid category id" });
          if (body.text !== undefined && typeof body.text !== "string") return J(400, { error: "text must be a string" });
          if (!Object.prototype.hasOwnProperty.call(cache.notes, catId)) cache.notes[catId] = [];
          const note = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), text: body.text || "", createdAt: now() };
          cache.notes[catId].push(note); return orErr(await persist.notes(), J(201, note));
        }
      }
      if (r.length === 3) {
        const noteId = r[2];
        if (method === "PUT") {
          if (!CAT_ID_RE.test(catId)) return J(404, { error: "not found" });
          if (body.text !== undefined && typeof body.text !== "string") return J(400, { error: "text must be a string" });
          const arr = cache.notes[catId] || []; const note = arr.find(n => n.id === noteId);
          if (!note) return J(404, { error: "not found" });
          if (body.text !== undefined) note.text = body.text;
          return orErr(await persist.notes(), J(200, note));
        }
        if (method === "DELETE") {
          if (CAT_ID_RE.test(catId) && cache.notes[catId]) {
            cache.notes[catId] = cache.notes[catId].filter(n => n.id !== noteId);
            if (!cache.notes[catId].length) delete cache.notes[catId];
            // The only mutating route that dropped its persistence result: on a
            // quota failure it reported {ok:true} while the note was still there.
            return orErr(await persist.notes(), J(200, { ok: true }));
          }
          return J(200, { ok: true });
        }
      }
      return J(404, { error: "not found" });
    }

    // /api/writeups ...
    if (k[0] === "writeups") {
      const wups = cache.writeups;
      if (r.length === 1) {
        if (method === "GET") return J(200, wups);
        if (method === "POST") {
          const { title, tags, content } = body || {};
          if (!isNonEmptyString(title)) return J(400, { error: "title required" });
          if (tags !== undefined && !(Array.isArray(tags) && tags.every(t => typeof t === "string"))) return J(400, { error: "tags must be an array of strings" });
          if (content !== undefined && typeof content !== "string") return J(400, { error: "content must be a string" });
          const wu = { id: shortId(), title, tags: tags || [], content: content || "", createdAt: now(), updatedAt: now() };
          wups.unshift(wu); return orErr(await persist.writeups(), J(201, wu));
        }
      }
      if (r.length === 2) {
        const wu = wups.find(w => w.id === r[1]);
        if (method === "PUT") {
          if (!wu) return J(404, { error: "not found" });
          if (body.title !== undefined && !isNonEmptyString(body.title)) return J(400, { error: "title required" });
          if (body.tags !== undefined && !(Array.isArray(body.tags) && body.tags.every(t => typeof t === "string"))) return J(400, { error: "tags must be an array of strings" });
          if (body.content !== undefined && typeof body.content !== "string") return J(400, { error: "content must be a string" });
          if (body.relatedMachine !== undefined && body.relatedMachine !== null && typeof body.relatedMachine !== "string") return J(400, { error: "relatedMachine must be a string" });
          if (body.title !== undefined) wu.title = body.title;
          if (body.tags !== undefined) wu.tags = body.tags;
          if (body.content !== undefined) wu.content = body.content;
          if (body.relatedMachine !== undefined) wu.relatedMachine = body.relatedMachine;
          wu.updatedAt = now(); return orErr(await persist.writeups(), J(200, wu));
        }
        if (method === "DELETE") { cache.writeups = wups.filter(w => w.id !== r[1]); return orErr(await persist.writeups(), J(200, { ok: true })); }
      }
      return J(404, { error: "not found" });
    }

    // /api/machines ...
    if (k[0] === "machines") {
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
          machines.push(machine); return orErr(await persist.machines(), J(201, machine));
        }
      }
      if (r.length === 2) {
        const m = machines.find(x => x.id === r[1]);
        if (method === "PUT") {
          if (!m) return J(404, { error: "not found" });
          for (const [key, kind] of Object.entries(MACHINE_FIELD_TYPES)) {
            if (body[key] !== undefined && !checkFieldType(body[key], kind)) return J(400, { error: "invalid " + key });
          }
          for (const key of Object.keys(MACHINE_FIELD_TYPES)) { if (body[key] !== undefined) m[key] = body[key]; }
          m.updatedAt = now(); return orErr(await persist.machines(), J(200, m));
        }
        if (method === "DELETE") { cache.machines = machines.filter(x => x.id !== r[1]); return orErr(await persist.machines(), J(200, { ok: true })); }
      }
      return J(404, { error: "not found" });
    }

    // /api/exam — a single JSON document for Exam Mode.
    if (k[0] === "exam" && r.length === 1) {
      if (method === "GET") return J(200, cache.exam);
      if (method === "PUT") {
        if (!isPlainObject(body)) return J(400, { error: "exam must be an object" });
        cache.exam = body;
        // Build the success payload BEFORE persisting: arguments evaluate left to
        // right, so `orErr(await persist.exam(), J(200, cache.exam))` read
        // cache.exam only after a failed save had already nulled the cache — the
        // 507 this route exists to return turned into a TypeError instead.
        const ok = J(200, cache.exam);
        return orErr(await persist.exam(), ok);
      }
      return J(404, { error: "not found" });
    }

    // /api/upload
    if (k[0] === "upload" && method === "POST") return handleUpload(body);

    // /api/export
    if (k[0] === "export" && method === "GET") return J(200, exportBundle());

    // /api/import
    if (k[0] === "import" && method === "POST") {
      if (Array.isArray(body)) {
        if (!isValidCategoryArray(body)) return J(400, { error: "invalid categories format" });
        const regen = sanitizeImportedIds(body, null);
        backfillIds(body); cache.categories = body;
        return orErr(await persist.categories(), J(200, { ok: true, categories: body.length, idsRegenerated: regen }));
      }
      if (!body || typeof body !== "object") return J(400, { error: "invalid import body" });
      if (body.categories !== undefined && !isValidCategoryArray(body.categories)) return J(400, { error: "invalid categories format" });
      if (body.notes !== undefined && !isValidNotesMap(body.notes)) return J(400, { error: "invalid notes format" });
      if (body.writeups !== undefined && !isValidWriteupArray(body.writeups)) return J(400, { error: "invalid writeups format" });
      if (body.machines !== undefined && !isValidMachineArray(body.machines)) return J(400, { error: "invalid machines format" });
      if (body.exam !== undefined && !isPlainObject(body.exam)) return J(400, { error: "invalid exam format" });
      // A server bundle carries the evidence files too; here images are already
      // inlined as data: URIs, so the key is accepted and ignored.
      if (body.uploads !== undefined && !isPlainObject(body.uploads)) return J(400, { error: "invalid uploads format" });
      if (body.categories === undefined && body.notes === undefined && body.writeups === undefined &&
        body.machines === undefined && body.exam === undefined) return J(400, { error: "nothing to import" });
      const regenerated = sanitizeImportedIds(body.categories, body.machines);
      // Everything is validated before anything is written, and the previous
      // values are kept so a failed write can put the cache back as it was.
      const previous = { categories: cache.categories, notes: cache.notes, writeups: cache.writeups, machines: cache.machines, exam: cache.exam };
      const written = [];
      for (const key of ["categories", "notes", "writeups", "machines", "exam"]) {
        if (body[key] === undefined) continue;
        if (key === "categories") backfillIds(body.categories);
        cache[key] = body[key];
        const err = await persist[key]();
        if (err) {
          // Put back whatever did land, so a half-applied bundle cannot leave
          // notes keyed to categories that no longer exist. save() already
          // dropped the cache, so the next request re-reads the real state.
          for (const k of written) { try { await idbSet(k, previous[k]); } catch { /* nothing more we can do */ } }
          return err;
        }
        written.push(key);
      }
      return J(200, { ok: true, categories: body.categories ? body.categories.length : 0, idsRegenerated: regenerated });
    }

    // /api/seed-status — lets the UI show an "update available" badge.
    if (k[0] === "seed-status" && method === "GET") {
      const current = (await idbGet("seedVersion")) || null;
      const latest = window.CS_SEED_VERSION || null;
      return J(200, { current, latest, updateAvailable: current !== latest });
    }

    // /api/update — merge new bundled content in without destroying anything.
    if (k[0] === "update" && method === "POST") {
      const dryRun = /[?&]dryRun=(1|true)/.test(path) || !!(body && body.dryRun);
      const wantVer = window.CS_SEED_VERSION || "";
      const baseline = (await idbGet("seedBaseline")) || {};
      const target = dryRun ? JSON.parse(JSON.stringify(cache.categories)) : cache.categories;
      const merged = mergeSeedInto(target, seedCopy(), baseline);
      if (!dryRun) {
        backfillIds(cache.categories);
        const err = await persist.categories();
        if (err) return err;
        try { await idbSet("seedVersion", wantVer); await idbSet("seedBaseline", merged.baseline); }
        catch (e) { console.error("[local-backend] merged but could not record the seed version", e); }
      }
      return J(200, Object.assign({}, merged.stats, { seedVersion: wantVer, dryRun }));
    }

    // /api/reset
    if (k[0] === "reset" && method === "POST") {
      const seed = seedCopy();
      preserveIds(seed, cache.categories); // keep favourites (keyed by command id) alive
      cache.categories = seed; backfillIds(cache.categories);
      const err = await persist.categories();
      if (err) return err;
      try { await idbSet("seedVersion", window.CS_SEED_VERSION || ""); await idbSet("seedBaseline", buildBaseline(cache.categories)); }
      catch (e) { console.error("[local-backend] reset but could not record the seed version", e); }
      return J(200, { ok: true });
    }

    return J(404, { error: "not found" });
  }

  function exportBundle() { return { categories: cache.categories, notes: cache.notes, writeups: cache.writeups, machines: cache.machines, exam: cache.exam }; }

  // Everything the user owns lives in IndexedDB, which the browser may evict
  // under storage pressure. Ask once for durable storage; nothing depends on the
  // answer, and not every browser implements it.
  try {
    if (navigator.storage && typeof navigator.storage.persist === "function") {
      Promise.resolve(navigator.storage.persist()).catch(() => { /* denied is fine */ });
    }
  } catch { /* no navigator.storage at all */ }

  // Public API consumed by app.js's api() helper when window.CS_STATIC is set.
  window.CS_BACKEND = {
    async request(method, url, body) { return route(String(method || "GET").toUpperCase(), String(url || ""), body); },
    async exportBundle() { await ensureLoaded(); return exportBundle(); },
  };
})();
