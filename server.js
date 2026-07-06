const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");

const app = express();
const PORT = process.env.PORT || 3000;
// Secure default: bind to localhost only. Set HOST=0.0.0.0 to expose on the
// network (the Docker image does this intentionally — the port mapping is the
// boundary there). If you expose to a network, set AUTH_USER / AUTH_PASS too.
const HOST = process.env.HOST || "127.0.0.1";
// All persistent JSON lives here. Override with DATA_DIR (used by tests, and
// handy if you want your data outside the project tree).
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "commands.json");

// ── Security headers (lightweight, no extra deps) ──
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

// ── Response compression (gzip) via Node's built-in zlib — no dependency ──
// Buffers the response and gzips compressible bodies >1KB. The big win is the
// ~2MB /api/categories JSON; static JS/CSS/HTML also shrink ~3-10x. Uploads and
// range/304 responses are passed through untouched.
app.use((req, res, next) => {
  if (!/\bgzip\b/.test(req.headers["accept-encoding"] || "")) return next();
  const chunks = [];
  const _write = res.write.bind(res);
  const _end = res.end.bind(res);
  let buffering = true;
  res.write = function (chunk, enc) {
    if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, typeof enc === "string" ? enc : "utf8"));
    return true;
  };
  res.end = function (chunk, enc, cb) {
    if (!buffering) return _end(chunk, enc, cb);
    buffering = false;
    if (typeof chunk === "function") { cb = chunk; chunk = null; }
    else if (typeof enc === "function") { cb = enc; enc = null; }
    if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, typeof enc === "string" ? enc : "utf8"));
    const body = Buffer.concat(chunks);
    res.write = _write; res.end = _end;
    const type = String(res.getHeader("Content-Type") || "");
    const compressible = /json|javascript|text\/|css|html|xml|svg/i.test(type);
    if (res.getHeader("Content-Encoding") || res.statusCode === 206 || res.statusCode === 304 || body.length < 1024 || !compressible) {
      if (body.length) _write(body);
      return _end(cb);
    }
    zlib.gzip(body, (err, gz) => {
      try {
        if (err) { if (body.length) _write(body); return _end(cb); }
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Vary", "Accept-Encoding");
        res.setHeader("Content-Length", gz.length);
        _write(gz);
        _end(cb);
      } catch { /* client disconnected */ }
    });
  };
  next();
});

// ── Optional HTTP Basic Auth ──
// Enabled only when AUTH_PASS is set. The browser caches credentials and
// auto-attaches them to every same-origin request (static, /api, /uploads),
// so the SPA keeps working without any frontend changes.
const AUTH_PASS = process.env.AUTH_PASS || "";
const AUTH_USER = process.env.AUTH_USER || "admin";
function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}
if (AUTH_PASS) {
  app.use((req, res, next) => {
    const hdr = req.headers.authorization || "";
    const [scheme, encoded] = hdr.split(" ");
    if (scheme === "Basic" && encoded) {
      // Split on the FIRST colon only (RFC 7617) — passwords may contain ":".
      const decoded = Buffer.from(encoded, "base64").toString();
      const i = decoded.indexOf(":");
      const user = i === -1 ? decoded : decoded.slice(0, i);
      const pass = i === -1 ? "" : decoded.slice(i + 1);
      if (safeEqual(user, AUTH_USER) && safeEqual(pass, AUTH_PASS)) return next();
    }
    res.setHeader("WWW-Authenticate", 'Basic realm="cheat-sheet"');
    return res.status(401).json({ error: "authentication required" });
  });
}

app.use(express.json({ limit: process.env.JSON_LIMIT || "12mb" }));

// ── Atomic JSON helpers (crash-safe, with .bak recovery) ──
function atomicWrite(file, str) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, str, "utf8");
  if (fs.existsSync(file)) {
    try { fs.copyFileSync(file, file + ".bak"); } catch { /* best effort */ }
  }
  try {
    fs.renameSync(tmp, file);
  } catch (e) {
    // Windows (esp. OneDrive/Defender-synced folders like Desktop) can briefly
    // lock the target and make rename fail with EPERM/EBUSY. Fall back to a
    // direct overwrite so a save never 500s the request.
    try {
      fs.writeFileSync(file, str, "utf8");
      try { fs.rmSync(tmp, { force: true }); } catch { /* leftover tmp is harmless */ }
    } catch {
      throw e;
    }
  }
}
function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    const bak = file + ".bak";
    if (fs.existsSync(bak)) {
      try { return JSON.parse(fs.readFileSync(bak, "utf8")); } catch { /* fall through */ }
    }
    return fallback;
  }
}

// ── Image Upload for Write-ups ──
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Serve uploads with nosniff so the browser never executes a mistyped file.
app.use("/uploads", express.static(UPLOADS_DIR, {
  setHeaders: (res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self'");
  },
}));

app.use(express.static(path.join(__dirname, "public")));

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

// Detect a real raster image type from its magic bytes. Returns the extension
// or null. SVG is intentionally NOT supported — it can carry executable script.
function sniffImageExt(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return "gif";
  if (buf[0] === 0x42 && buf[1] === 0x4d) return "bmp";
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return "webp";
  return null;
}

app.post("/api/upload", (req, res) => {
  const { data } = req.body; // data = base64 string (optionally a data: URI)
  if (typeof data !== "string" || !data) return res.status(400).json({ error: "no data" });
  let buf;
  try {
    buf = Buffer.from(data.replace(/^data:image\/[\w+]+;base64,/, ""), "base64");
  } catch {
    return res.status(400).json({ error: "invalid data" });
  }
  if (buf.length === 0) return res.status(400).json({ error: "empty file" });
  if (buf.length > MAX_UPLOAD_BYTES) return res.status(413).json({ error: "file too large (max 5MB)" });
  // Validate by content, not by the user-supplied filename.
  const ext = sniffImageExt(buf);
  if (!ext) return res.status(400).json({ error: "unsupported or unsafe image type" });
  const id = Date.now().toString(36) + crypto.randomBytes(3).toString("hex");
  const fname = id + "." + ext;
  fs.writeFileSync(path.join(UPLOADS_DIR, fname), buf);
  res.json({ url: "/uploads/" + fname });
});

// Ensure data directory and seed file exist
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const seed = require("./seed.js");
    atomicWrite(DATA_FILE, JSON.stringify(seed, null, 2));
  }
}

// In-memory cache of the parsed commands DB. The file is the source of truth but
// it almost never changes out-of-band, so re-reading + re-parsing ~2MB on every
// request is pure waste. Reads serve the cache; writes update disk AND the cache.
let commandsCache = null;
function genId(prefix) { return prefix + crypto.randomBytes(4).toString("hex"); }
// Backfill stable ids onto subcategories/commands so the frontend can key
// favorites by identity (not position). One-time, idempotent, additive.
function backfillIds(data) {
  let changed = false;
  for (const cat of data) {
    for (const sub of cat.subcategories || []) {
      if (!sub.id) { sub.id = genId("s"); changed = true; }
      for (const cmd of sub.commands || []) {
        if (!cmd.id) { cmd.id = genId("c"); changed = true; }
      }
    }
  }
  return changed;
}
function readData() {
  if (commandsCache) return commandsCache;
  ensureDataFile();
  const data = readJSON(DATA_FILE, []);
  if (backfillIds(data)) atomicWrite(DATA_FILE, JSON.stringify(data, null, 2));
  commandsCache = data;
  return commandsCache;
}

function writeData(data) {
  ensureDataFile();
  backfillIds(data); // guarantee stable ids after reset / import / reorder / create
  atomicWrite(DATA_FILE, JSON.stringify(data, null, 2));
  commandsCache = data;
}

// ── Import validation ──
function isValidCategory(c) {
  return c && typeof c === "object" &&
    typeof c.id === "string" &&
    typeof c.name === "string" &&
    Array.isArray(c.subcategories);
}
function isValidCategoryArray(arr) {
  return Array.isArray(arr) && arr.every(isValidCategory);
}
function isValidWriteupArray(arr) {
  return Array.isArray(arr) && arr.every((w) =>
    w && typeof w === "object" &&
    (w.tags === undefined || (Array.isArray(w.tags) && w.tags.every((t) => typeof t === "string"))));
}
function isValidNotesMap(m) {
  if (!m || typeof m !== "object" || Array.isArray(m)) return false;
  return Object.keys(m).every((k) =>
    CAT_ID_RE.test(k) &&
    Array.isArray(m[k]) &&
    m[k].every((n) => n && typeof n === "object" &&
      typeof n.id === "string" && typeof n.text === "string"));
}

// ── Param & field validation helpers ──
// Category ids are slugs (lowercase alphanum + dashes). Notes are keyed by
// catId, so this also blocks __proto__/constructor object-key footguns.
const CAT_ID_RE = /^[a-z0-9-]+$/;
// Strict array-index parse: only bare non-negative integers. parseInt() used to
// accept "1abc" / "0.9", silently mutating the wrong (or a fractional) record.
function parseIndex(v) {
  return typeof v === "string" && /^\d+$/.test(v) ? Number(v) : -1;
}
function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

// ── Health check (used by the Docker HEALTHCHECK) ──
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ── GET all categories ──
app.get("/api/categories", (req, res) => {
  res.json(readData());
});

// ── POST new category ──
app.post("/api/categories", (req, res) => {
  const data = readData();
  const { name, icon, description } = req.body;
  if (!isNonEmptyString(name)) return res.status(400).json({ error: "name is required" });
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!id) return res.status(400).json({ error: "name must contain letters or numbers" });
  if (data.find((c) => c.id === id))
    return res.status(409).json({ error: "Category already exists" });
  const cat = {
    id,
    name,
    icon: typeof icon === "string" && icon ? icon : "📂",
    description: typeof description === "string" ? description : "",
    subcategories: [],
  };
  data.push(cat);
  writeData(data);
  res.status(201).json(cat);
});

// ── PUT update category ──
app.put("/api/categories/:id", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  if (req.body.name !== undefined) {
    if (!isNonEmptyString(req.body.name)) return res.status(400).json({ error: "name must be a non-empty string" });
    cat.name = req.body.name;
  }
  if (typeof req.body.icon === "string" && req.body.icon) cat.icon = req.body.icon;
  if (req.body.description !== undefined) {
    if (typeof req.body.description !== "string") return res.status(400).json({ error: "description must be a string" });
    cat.description = req.body.description;
  }
  writeData(data);
  res.json(cat);
});

// ── DELETE category ──
app.delete("/api/categories/:id", (req, res) => {
  let data = readData();
  const idx = data.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Category not found" });
  data.splice(idx, 1);
  writeData(data);
  res.json({ ok: true });
});

// ── Reorder categories (dedicated endpoint; was overloading /api/import) ──
app.post("/api/categories/reorder", (req, res) => {
  const order = req.body && req.body.order;
  if (!Array.isArray(order)) return res.status(400).json({ error: "order must be an array of category ids" });
  const data = readData();
  const byId = new Map(data.map((c) => [c.id, c]));
  const out = [];
  for (const id of order) { if (byId.has(id)) { out.push(byId.get(id)); byId.delete(id); } }
  for (const c of byId.values()) out.push(c); // keep any not listed
  writeData(out);
  res.json({ ok: true, categories: out.length });
});

// ── POST new subcategory ──
app.post("/api/categories/:id/subcategories", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const { name } = req.body;
  if (!isNonEmptyString(name)) return res.status(400).json({ error: "name is required" });
  const sub = { id: genId("s"), name, commands: [] };
  cat.subcategories.push(sub);
  writeData(data);
  res.status(201).json(sub);
});

// ── PUT update subcategory ──
app.put("/api/categories/:id/subcategories/:subIdx", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const sub = cat.subcategories[parseIndex(req.params.subIdx)];
  if (!sub) return res.status(404).json({ error: "Subcategory not found" });
  if (req.body.name !== undefined) {
    if (!isNonEmptyString(req.body.name)) return res.status(400).json({ error: "name must be a non-empty string" });
    sub.name = req.body.name;
  }
  writeData(data);
  res.json(sub);
});

// ── DELETE subcategory ──
app.delete("/api/categories/:id/subcategories/:subIdx", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const idx = parseIndex(req.params.subIdx);
  if (!cat.subcategories[idx]) return res.status(404).json({ error: "Subcategory not found" });
  cat.subcategories.splice(idx, 1);
  writeData(data);
  res.json({ ok: true });
});

// ── POST new command ──
app.post("/api/categories/:id/subcategories/:subIdx/commands", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const sub = cat.subcategories[parseIndex(req.params.subIdx)];
  if (!sub) return res.status(404).json({ error: "Subcategory not found" });
  const { title, desc, cmd, cmds, tags, note } = req.body;
  if (!isNonEmptyString(title)) return res.status(400).json({ error: "title is required" });
  const command = { id: genId("c"), title, desc: desc || "" };
  if (cmds && cmds.length) command.cmds = cmds;
  else if (cmd) command.cmd = cmd;
  command.tags = tags || [];
  if (note) command.note = note;
  sub.commands.push(command);
  writeData(data);
  res.status(201).json(command);
});

// ── PUT update command ──
app.put("/api/categories/:id/subcategories/:subIdx/commands/:cmdIdx", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const sub = cat.subcategories[parseIndex(req.params.subIdx)];
  if (!sub) return res.status(404).json({ error: "Subcategory not found" });
  const command = sub.commands[parseIndex(req.params.cmdIdx)];
  if (!command) return res.status(404).json({ error: "Command not found" });
  if (req.body.title) command.title = req.body.title;
  if (req.body.desc !== undefined) command.desc = req.body.desc;
  if (req.body.cmd !== undefined) { command.cmd = req.body.cmd; delete command.cmds; }
  if (req.body.cmds) { command.cmds = req.body.cmds; delete command.cmd; }
  if (req.body.tags) command.tags = req.body.tags;
  if (req.body.note !== undefined) command.note = req.body.note;
  writeData(data);
  res.json(command);
});

// ── DELETE command ──
app.delete("/api/categories/:id/subcategories/:subIdx/commands/:cmdIdx", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const sub = cat.subcategories[parseIndex(req.params.subIdx)];
  if (!sub) return res.status(404).json({ error: "Subcategory not found" });
  const idx = parseIndex(req.params.cmdIdx);
  if (!sub.commands[idx]) return res.status(404).json({ error: "Command not found" });
  sub.commands.splice(idx, 1);
  writeData(data);
  res.json({ ok: true });
});

// ── Notes (multiple per category) ──
const NOTES_FILE = path.join(DATA_DIR, "notes.json");
function readNotes() { return readJSON(NOTES_FILE, {}); }
function writeNotes(d) { atomicWrite(NOTES_FILE, JSON.stringify(d, null, 2)); }

app.get("/api/notes", (req, res) => res.json(readNotes()));

// Get notes for a specific category
app.get("/api/notes/:catId", (req, res) => {
  if (!CAT_ID_RE.test(req.params.catId)) return res.json([]);
  const notes = readNotes();
  res.json(Object.prototype.hasOwnProperty.call(notes, req.params.catId) ? notes[req.params.catId] : []);
});

// Add a note to a category
app.post("/api/notes/:catId", (req, res) => {
  const catId = req.params.catId;
  if (!CAT_ID_RE.test(catId)) return res.status(400).json({ error: "invalid category id" });
  if (req.body.text !== undefined && typeof req.body.text !== "string")
    return res.status(400).json({ error: "text must be a string" });
  const notes = readNotes();
  if (!Object.prototype.hasOwnProperty.call(notes, catId)) notes[catId] = [];
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const note = { id, text: req.body.text || "", createdAt: new Date().toISOString() };
  notes[catId].push(note);
  writeNotes(notes);
  res.status(201).json(note);
});

// Update a specific note
app.put("/api/notes/:catId/:noteId", (req, res) => {
  if (!CAT_ID_RE.test(req.params.catId)) return res.status(404).json({ error: "not found" });
  if (req.body.text !== undefined && typeof req.body.text !== "string")
    return res.status(400).json({ error: "text must be a string" });
  const notes = readNotes();
  const arr = Object.prototype.hasOwnProperty.call(notes, req.params.catId) ? notes[req.params.catId] : [];
  const note = arr.find(n => n.id === req.params.noteId);
  if (!note) return res.status(404).json({ error: "not found" });
  if (req.body.text !== undefined) note.text = req.body.text;
  writeNotes(notes);
  res.json(note);
});

// Delete a specific note
app.delete("/api/notes/:catId/:noteId", (req, res) => {
  if (!CAT_ID_RE.test(req.params.catId)) return res.json({ ok: true });
  const notes = readNotes();
  if (!Object.prototype.hasOwnProperty.call(notes, req.params.catId)) return res.json({ ok: true });
  notes[req.params.catId] = notes[req.params.catId].filter(n => n.id !== req.params.noteId);
  if (notes[req.params.catId].length === 0) delete notes[req.params.catId];
  writeNotes(notes);
  res.json({ ok: true });
});

// ── Write-ups ──
const WRITEUPS_FILE = path.join(DATA_DIR, "writeups.json");
function readWriteups() { return readJSON(WRITEUPS_FILE, []); }
function writeWriteups(d) { atomicWrite(WRITEUPS_FILE, JSON.stringify(d, null, 2)); }

app.get("/api/writeups", (req, res) => res.json(readWriteups()));
app.post("/api/writeups", (req, res) => {
  const wups = readWriteups();
  const { title, tags, content } = req.body;
  if (!isNonEmptyString(title)) return res.status(400).json({ error: "title required" });
  if (tags !== undefined && !(Array.isArray(tags) && tags.every(t => typeof t === "string")))
    return res.status(400).json({ error: "tags must be an array of strings" });
  if (content !== undefined && typeof content !== "string")
    return res.status(400).json({ error: "content must be a string" });
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const wu = { id, title, tags: tags || [], content: content || "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  wups.unshift(wu);
  writeWriteups(wups);
  res.status(201).json(wu);
});
app.put("/api/writeups/:id", (req, res) => {
  const wups = readWriteups();
  const wu = wups.find(w => w.id === req.params.id);
  if (!wu) return res.status(404).json({ error: "not found" });
  if (req.body.title !== undefined) wu.title = req.body.title;
  if (req.body.tags !== undefined) wu.tags = req.body.tags;
  if (req.body.content !== undefined) wu.content = req.body.content;
  if (req.body.relatedMachine !== undefined) wu.relatedMachine = req.body.relatedMachine;
  wu.updatedAt = new Date().toISOString();
  writeWriteups(wups);
  res.json(wu);
});
app.delete("/api/writeups/:id", (req, res) => {
  let wups = readWriteups();
  wups = wups.filter(w => w.id !== req.params.id);
  writeWriteups(wups);
  res.json({ ok: true });
});

// ── Machines (target tracking for OSCP) ──
const MACHINES_FILE = path.join(DATA_DIR, "machines.json");
function readMachines() { return readJSON(MACHINES_FILE, []); }
function writeMachines(d) { atomicWrite(MACHINES_FILE, JSON.stringify(d, null, 2)); }

app.get("/api/machines", (req, res) => res.json(readMachines()));
app.post("/api/machines", (req, res) => {
  const machines = readMachines();
  const { name, ip, os, platform, difficulty, status, tags } = req.body;
  if (!isNonEmptyString(name)) return res.status(400).json({ error: "name required" });
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const machine = {
    id, name, ip: ip || "", os: os || "unknown",
    platform: typeof platform === "string" && platform ? platform : "Custom",
    difficulty: typeof difficulty === "string" ? difficulty : "",
    status: typeof status === "string" && status ? status : "not-started",
    tags: Array.isArray(tags) ? tags.filter(t => typeof t === "string") : [],
    userFlag: { value: "", capturedAt: null },
    rootFlag: { value: "", capturedAt: null },
    startedAt: null, ownedAt: null,
    services: [], credentials: [], notes: "", timeline: [], evidence: [],
    checklist: [
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
      { id: "report", label: "Documentation Complete", done: false }
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
  machines.push(machine);
  writeMachines(machines);
  res.status(201).json(machine);
});
app.put("/api/machines/:id", (req, res) => {
  const machines = readMachines();
  const m = machines.find(x => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: "not found" });
  for (const key of ["name", "ip", "os", "services", "credentials", "notes", "checklist", "template", "hosts", "attackPath",
    "platform", "difficulty", "status", "tags", "userFlag", "rootFlag", "startedAt", "ownedAt", "timeline", "evidence"]) {
    if (req.body[key] !== undefined) m[key] = req.body[key];
  }
  m.updatedAt = new Date().toISOString();
  writeMachines(machines);
  res.json(m);
});
app.delete("/api/machines/:id", (req, res) => {
  let machines = readMachines();
  machines = machines.filter(x => x.id !== req.params.id);
  writeMachines(machines);
  res.json({ ok: true });
});

// ── Export / Import ──
app.get("/api/export", (req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=cheat-sheet-backup.json");
  res.json({ categories: readData(), notes: readNotes(), writeups: readWriteups(), machines: readMachines() });
});

app.post("/api/import", (req, res) => {
  const body = req.body;
  // Old format: a bare array of categories.
  if (Array.isArray(body)) {
    if (!isValidCategoryArray(body)) return res.status(400).json({ error: "invalid categories format" });
    writeData(body);
    return res.json({ ok: true, categories: body.length });
  }
  // New format: an object with any of categories/notes/writeups/machines.
  if (!body || typeof body !== "object") return res.status(400).json({ error: "invalid import body" });
  if (body.categories !== undefined && !isValidCategoryArray(body.categories))
    return res.status(400).json({ error: "invalid categories format" });
  if (body.notes !== undefined && !isValidNotesMap(body.notes))
    return res.status(400).json({ error: "invalid notes format" });
  if (body.writeups !== undefined && !isValidWriteupArray(body.writeups))
    return res.status(400).json({ error: "invalid writeups format" });
  if (body.machines !== undefined && !Array.isArray(body.machines))
    return res.status(400).json({ error: "invalid machines format" });
  if (body.categories === undefined && body.notes === undefined &&
      body.writeups === undefined && body.machines === undefined)
    return res.status(400).json({ error: "nothing to import" });

  if (body.categories) writeData(body.categories);
  if (body.notes) writeNotes(body.notes);
  if (body.writeups) writeWriteups(body.writeups);
  if (body.machines) writeMachines(body.machines);
  res.json({ ok: true, categories: body.categories ? body.categories.length : 0 });
});

// ── Reset to defaults ──
app.post("/api/reset", (req, res) => {
  // Clear require cache so seed is always fresh
  delete require.cache[require.resolve("./seed.js")];
  const seed = require("./seed.js");
  writeData(seed);
  res.json({ ok: true });
});

// Unknown API routes must return JSON 404 — not the SPA HTML shell (which the
// frontend api() helper would then try to JSON.parse and fail opaquely).
app.use("/api", (req, res) => res.status(404).json({ error: "not found" }));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Terminal error handler — guarantees every failure is machine-readable JSON in
// the {error} shape the frontend/tests expect, instead of Express's HTML page.
// The 4-arg signature is what makes Express treat this as an error handler.
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed")
    return res.status(400).json({ error: "invalid JSON body" });
  if (err && (err.type === "entity.too.large" || err.status === 413))
    return res.status(413).json({ error: "request body too large" });
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`cheat-sheet running on http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`);
    if (HOST === "0.0.0.0" && !AUTH_PASS) {
      console.warn("⚠  Bound to 0.0.0.0 without AUTH_PASS — anyone on your network can read and modify your data.");
    }
  });
}

module.exports = app;
