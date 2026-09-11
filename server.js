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

// Express advertises itself by default; nothing good comes of that.
app.disable("x-powered-by");

// ── Origin / Host guard (CSRF + DNS rebinding) ──
// A localhost-bound server is still reachable from any page the user has open:
// a cross-site form POST to /api/reset wiped the whole database, and without a
// Host check a rebound DNS name gave a remote page full read/write — including
// /api/export, which carries the machine credential vault. Non-browser clients
// (curl, the test suite) send neither Origin nor Sec-Fetch-Site, so they pass.
// Behind a reverse proxy the Host arrives as your own domain: list it (comma
// separated) in ALLOWED_HOSTS, e.g. ALLOWED_HOSTS=cheatsheet.example.com.
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || "")
  .split(",").map((h) => h.trim().toLowerCase()).filter(Boolean);
const LOOPBACK_HOSTS = ["localhost", "127.0.0.1", "[::1]", "::1"];
// Strip the port without tripping over IPv6 literals ("[::1]:3000").
function hostnameOf(hostHeader) {
  const s = String(hostHeader || "").trim().toLowerCase();
  if (!s) return "";
  if (s.startsWith("[")) return s.slice(0, s.indexOf("]") + 1) || s;
  const i = s.indexOf(":");
  return i === -1 ? s : s.slice(0, i);
}
// A bare IP literal in the Host header cannot be rebound: DNS rebinding works by
// flipping what a NAME resolves to, so an attacker page must address us by a
// hostname it controls. Accepting literals therefore costs nothing and keeps the
// documented LAN path (http://192.168.1.10:8899) working without configuration.
function isIpLiteral(name) {
  if (name.startsWith("[") && name.endsWith("]")) return /^[0-9a-f:.]+$/.test(name.slice(1, -1));
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(name);
}
function isAllowedHostname(name) {
  if (!name) return false;
  if (LOOPBACK_HOSTS.includes(name)) return true;
  if (ALLOWED_HOSTS.includes(name)) return true;
  if (isIpLiteral(name)) return true;
  return HOST !== "0.0.0.0" && name === String(HOST).toLowerCase();
}
// Same-origin means: exactly the host this request was addressed to, or one of
// the loopback spellings on our own port (the SPA is served from all of them).
function isSelfOrigin(origin, hostHeader) {
  let host;
  try { host = new URL(origin).host.toLowerCase(); } catch { return false; }
  if (!host) return false;
  if (host === String(hostHeader || "").trim().toLowerCase()) return true;
  if (LOOPBACK_HOSTS.some((h) => host === h + ":" + PORT)) return true;
  return ALLOWED_HOSTS.includes(hostnameOf(host));
}
// A body-less request carries no attacker-supplied content, and browsers omit
// Content-Type on those — so only demand JSON when a body is actually present.
function hasBody(req) {
  if (req.headers["transfer-encoding"] !== undefined) return true;
  // Content-Length: 0 is no body. Treating it as one made `curl -X POST
  // .../api/reset` — the recipe the README prints — fail with 415, since curl
  // sends the header but no Content-Type.
  const len = Number(req.headers["content-length"]);
  return !isNaN(len) && len > 0;
}
// Sensitive reads get the same cross-site treatment as writes. /api/export
// carries the machine credential vault, and a GET is exactly what a rebound or
// cross-origin page would reach for.
const GUARDED_READS = ["/api/export", "/api/machines", "/api/exam"];
app.use((req, res, next) => {
  // The Host check runs in EVERY configuration, HOST=0.0.0.0 included — that is
  // the one the Docker image ships, so exempting it left DNS-rebinding
  // protection off by default in containers, which is precisely backwards.
  // Loopback names, IP literals and ALLOWED_HOSTS entries all pass; an
  // attacker-controlled hostname pointed at this port does not.
  if (!isAllowedHostname(hostnameOf(req.headers.host))) {
    return res.status(403).json({ error: "forbidden host" });
  }
  const mutating = req.method === "POST" || req.method === "PUT" ||
    req.method === "PATCH" || req.method === "DELETE";
  const guardedRead = !mutating && GUARDED_READS.includes(req.path.toLowerCase());
  if (guardedRead) {
    const site = req.headers["sec-fetch-site"];
    if (site && site !== "same-origin" && site !== "none")
      return res.status(403).json({ error: "cross-site request blocked" });
    if (req.headers.origin && !isSelfOrigin(req.headers.origin, req.headers.host))
      return res.status(403).json({ error: "cross-site request blocked" });
  }
  // Express's router is case-INsensitive by default, so POST /API/reset still
  // reaches app.post("/api/reset"). Testing req.path case-sensitively therefore
  // handed any website a one-capital-letter bypass of this entire guard — the
  // comparison has to be normalised, not the routing (normalising here cannot
  // break a single existing link).
  if (mutating && req.path.toLowerCase().startsWith("/api/")) {
    const site = req.headers["sec-fetch-site"];
    if (site && site !== "same-origin" && site !== "none")
      return res.status(403).json({ error: "cross-site request blocked" });
    if (req.headers.origin && !isSelfOrigin(req.headers.origin, req.headers.host))
      return res.status(403).json({ error: "cross-site request blocked" });
    if (hasBody(req) && !req.is("application/json"))
      return res.status(415).json({ error: "expected application/json" });
  }
  next();
});

// ── Security headers (lightweight, no extra deps) ──
// The app loads no external scripts, styles or fonts, so the policy can be
// strict. 'unsafe-inline' stays for styles only — the SPA sets element.style
// from JS all over the place; scripts are 'self' with no eval.
const APP_CSP = "default-src 'self'; connect-src 'self'; img-src 'self' data: blob:; " +
  "style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; " +
  "base-uri 'none'; frame-ancestors 'none'; form-action 'self'";
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Security-Policy", APP_CSP);
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

// The Docker HEALTHCHECK hits this, so it must sit ABOVE the auth gate —
// otherwise the container is permanently unhealthy whenever AUTH_PASS is set.
// It exposes nothing but liveness.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Brute-forcing Basic auth used to cost nothing: 100 guesses in ~50ms, silently.
// A per-IP failure counter adds a delay once an IP looks like it is guessing.
// Bounded on purpose (capped size + expiring window) so it cannot be turned into
// a memory-exhaustion vector by spraying spoofed X-Forwarded-For style traffic.
const AUTH_FAIL_WINDOW_MS = 5 * 60 * 1000;
const AUTH_FAIL_THRESHOLD = 5;
const AUTH_FAIL_DELAY_MS = 1000;
const AUTH_FAIL_MAX_ENTRIES = 1000;
const authFails = new Map();
function noteAuthFailure(ip) {
  const now = Date.now();
  for (const [key, e] of authFails) {
    if (now - e.first > AUTH_FAIL_WINDOW_MS) authFails.delete(key);
  }
  let entry = authFails.get(ip);
  if (!entry || now - entry.first > AUTH_FAIL_WINDOW_MS) {
    entry = { first: now, count: 0, warned: false };
    // Map iteration order is insertion order, so the first key is the oldest.
    if (authFails.size >= AUTH_FAIL_MAX_ENTRIES) authFails.delete(authFails.keys().next().value);
    authFails.set(ip, entry);
  }
  entry.count++;
  if (entry.count >= AUTH_FAIL_THRESHOLD && !entry.warned) {
    entry.warned = true;
    console.warn(`⚠  ${entry.count} failed auth attempts from ${ip} — throttling that address`);
  }
  return entry.count >= AUTH_FAIL_THRESHOLD ? AUTH_FAIL_DELAY_MS : 0;
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
      if (safeEqual(user, AUTH_USER) && safeEqual(pass, AUTH_PASS)) {
        authFails.delete(req.ip || req.socket.remoteAddress || "?");
        return next();
      }
    }
    const delay = noteAuthFailure(req.ip || req.socket.remoteAddress || "?");
    setTimeout(() => {
      res.setHeader("WWW-Authenticate", 'Basic realm="cheat-sheet"');
      res.status(401).json({ error: "authentication required" });
    }, delay);
  });
}

app.use(express.json({ limit: process.env.JSON_LIMIT || "12mb" }));

// ── Atomic JSON helpers (crash-safe, with .bak recovery) ──
function atomicWrite(file, str) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = file + ".tmp";
  // Write + fsync the temp file before renaming: without the fsync a crash can
  // leave a renamed-but-empty file, which is exactly what "atomic" must prevent.
  const fd = fs.openSync(tmp, "w");
  try {
    fs.writeFileSync(fd, str, "utf8");
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
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
  } catch (err) {
    if (err && err.code === "ENOENT") return fallback; // first run: nothing saved yet
    // Silently falling back to "empty" turned a corrupt file into an HTTP 200 with
    // no data, and the user's next edit then wrote that emptiness back over it.
    console.error(`⚠  cannot parse ${file} (${err.message}) — trying ${file}.bak`);
    const bak = file + ".bak";
    if (fs.existsSync(bak)) {
      try {
        const recovered = JSON.parse(fs.readFileSync(bak, "utf8"));
        console.error(`   recovered ${file} from its .bak copy`);
        return recovered;
      } catch { /* the backup is unreadable too */ }
    }
    // Keep the unreadable bytes for manual recovery instead of letting the next
    // save overwrite them.
    const aside = `${file}.corrupt-${Date.now()}`;
    try {
      fs.renameSync(file, aside);
      console.error(`   moved the unreadable file to ${aside} — starting from defaults`);
    } catch { /* best effort; a locked file still must not crash the server */ }
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

// ── Seed provisioning & versioning ──
// meta.json remembers WHICH seed build the user's data came from, so an existing
// install can be told that newer bundled content exists (see /api/seed-status)
// and can merge it in without a destructive reset (see /api/update).
const META_FILE = path.join(DATA_DIR, "meta.json");
// The per-record merge base lives in its own file: one entry per seeded record,
// far too big to keep in a file the user might reasonably open and read.
const BASELINE_FILE = path.join(DATA_DIR, "seed-baseline.json");
function readMeta() { return readJSON(META_FILE, {}); }
function writeMeta(m) { atomicWrite(META_FILE, JSON.stringify(m, null, 2)); }
function readBaseline() { const b = readJSON(BASELINE_FILE, {}); return b && typeof b === "object" && !Array.isArray(b) ? b : {}; }
function writeBaseline(b) { atomicWrite(BASELINE_FILE, JSON.stringify(b)); }
// Always hash the pristine seed: the same md5-of-JSON scheme build-static.js
// uses, so the server and the static build agree on a version string. The copy
// is what callers mutate (backfilled ids must never leak into the hash).
function loadSeed() {
  delete require.cache[require.resolve("./seed.js")];
  const json = JSON.stringify(require("./seed.js"));
  return {
    seed: JSON.parse(json),
    version: crypto.createHash("md5").update(json).digest("hex").slice(0, 12),
  };
}

// Ensure data directory and seed file exist
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const { seed, version } = loadSeed();
    backfillIds(seed); // ids first — the merge baseline is keyed by them
    atomicWrite(DATA_FILE, JSON.stringify(seed, null, 2));
    try {
      writeMeta(Object.assign(readMeta(), { seedVersion: version }));
      writeBaseline(buildBaseline(seed));
    } catch { /* the data file is what matters; versioning can catch up later */ }
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
  try {
    atomicWrite(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    // Handlers mutate the cached objects by reference and only then call us, so a
    // failed write leaves memory ahead of disk — and the next unrelated save would
    // cement it. Drop the cache instead; the next read comes from the file again.
    commandsCache = null;
    throw e;
  }
  commandsCache = data; // publish only after the bytes are safely on disk
}

// ── Seed merge (identity-based three-way merge, never destructive) ──
// Match by id where we have one; the bundled seed ships without ids, so records
// are otherwise paired on a normalised signature — a subcategory by name, a
// command by title+command text, then by the command text alone, then by title.
// The command-text-only step is what recognises a RENAMED command: renaming is
// the most ordinary customisation there is, and title+text plus title-alone both
// miss it, so every update used to hand the user a second copy of it.
const CAT_FIELDS = ["name", "icon", "description", "name_tr", "description_tr"];
const SUB_FIELDS = ["name", "name_tr"];
const CMD_FIELDS = ["title", "desc", "cmd", "cmds", "tags", "note", "attack", "refs", "ref", "desc_tr"];
// Marks a baseline entry as "this text is the USER's, not the seed's". Hashes are
// hex, so the prefix can never collide with one — see applyRecord.
const USER_BASE = "u:";
function norm(v) { return String(v == null ? "" : v).replace(/\s+/g, " ").trim().toLowerCase(); }
function cmdBody(c) {
  return norm(Array.isArray(c.cmds) ? c.cmds.map((x) => (typeof x === "string" ? x : (x && (x.cmd || x.command)) || "")).join("\n") : (c.cmd || ""));
}
function cmdSig(c) { return norm(c.title) + " || " + cmdBody(c); }
function recordHash(obj, fields) {
  const pick = {};
  for (const f of fields) if (obj[f] !== undefined) pick[f] = obj[f];
  return crypto.createHash("md5").update(JSON.stringify(pick)).digest("hex").slice(0, 8);
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
// Returns the baseline hash to record for this id, or undefined to record none.
function applyRecord(userRec, seedRec, fields, baseline, stats) {
  const seedHash = recordHash(seedRec, fields);
  const userHash = recordHash(userRec, fields);
  if (userHash === seedHash) { stats.unchanged++; return seedHash; }
  const base = baseline[userRec.id];
  // A real three-way merge: only a record still byte-equal to what the seed last
  // wrote is safe to advance. Every install that predates seed-baseline.json has
  // no merge base at all — which is exactly the population this endpoint was
  // written for — and the old identity-field fallback declared those records
  // "unmodified seed content" and overwrote them, silently deleting the user's
  // edits. No merge base now means: assume the text is the user's and leave it.
  // The merge base we then record is that user text, tagged USER_BASE so a later
  // run can never mistake it for something the seed wrote and advance over it.
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
  const catById = new Map(data.map((c) => [c.id, c]));
  for (const sCat of seed) {
    let cat = catById.get(sCat.id);
    if (!cat) {
      cat = Object.assign({ id: sCat.id }, cloneFrom(sCat, CAT_FIELDS), { subcategories: [] });
      if (typeof cat.description !== "string") cat.description = "";
      data.push(cat);
      catById.set(cat.id, cat);
      stats.added++;
      keep(cat.id, recordHash(sCat, CAT_FIELDS));
    } else {
      if (!Array.isArray(cat.subcategories)) cat.subcategories = [];
      keep(cat.id, applyRecord(cat, sCat, CAT_FIELDS, baseline, stats));
    }
    const subByName = new Map();
    for (const s of cat.subcategories) if (!subByName.has(norm(s.name))) subByName.set(norm(s.name), s);
    const subById = new Map(cat.subcategories.filter((s) => s.id).map((s) => [s.id, s]));
    const usedSubs = new Set();
    for (const sSub of sCat.subcategories || []) {
      let sub = (sSub.id && subById.get(sSub.id)) || subByName.get(norm(sSub.name));
      if (sub && usedSubs.has(sub)) sub = null;
      if (!sub) {
        sub = Object.assign({ id: genId("s") }, cloneFrom(sSub, SUB_FIELDS), { commands: [] });
        cat.subcategories.push(sub);
        subByName.set(norm(sub.name), sub);
        stats.added++;
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
        // What the seed wrote when it provisioned this record. A user who renamed
        // a command AND rewrote its body is unreachable by text, but the record
        // still carries the provenance of the seed entry it came from.
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
          sub.commands.push(cmd);
          index(cmd);
          stats.added++;
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
// Reset used to re-mint every id, orphaning 100% of the user's favourites (they
// are keyed by command id). Carry the existing ids over wherever the record is
// still recognisably the same one.
function preserveIds(seed, current) {
  const catById = new Map(current.map((c) => [c.id, c]));
  for (const sCat of seed) {
    const cat = catById.get(sCat.id);
    if (!cat) continue;
    const subByName = new Map();
    for (const s of cat.subcategories || []) if (s.id && !subByName.has(norm(s.name))) subByName.set(norm(s.name), s);
    const usedSubs = new Set();
    for (const sSub of sCat.subcategories || []) {
      const sub = subByName.get(norm(sSub.name));
      if (!sub || usedSubs.has(sub.id)) continue;
      usedSubs.add(sub.id);
      sSub.id = sub.id;
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
        usedCmds.add(match.id);
        sCmd.id = match.id;
      }
    }
  }
}

// ── Import validation ──
// Nested shape matters as much as the top level: a subcategory without a
// commands array permanently 500s the three /commands routes, and a nested null
// used to blow up the import itself.
function isValidCategory(c) {
  return c && typeof c === "object" &&
    typeof c.id === "string" &&
    typeof c.name === "string" &&
    Array.isArray(c.subcategories) &&
    c.subcategories.every((s) =>
      s && typeof s === "object" &&
      typeof s.name === "string" &&
      Array.isArray(s.commands) &&
      s.commands.every((cmd) => cmd && typeof cmd === "object"));
}
function isValidCategoryArray(arr) {
  return Array.isArray(arr) && arr.every(isValidCategory);
}
// machines is the collection that holds the credential vault, so it gets the
// same treatment as everything else rather than a bare Array.isArray.
function isValidMachineArray(arr) {
  return Array.isArray(arr) && arr.every((m) =>
    m && typeof m === "object" && !Array.isArray(m) &&
    typeof m.id === "string" &&
    typeof m.name === "string" &&
    (m.status === undefined || typeof m.status === "string") &&
    (m.difficulty === undefined || typeof m.difficulty === "string"));
}
function isPlainObject(v) { return !!v && typeof v === "object" && !Array.isArray(v); }
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

// Ids travel into the DOM as element keys and data- attributes, so an imported
// id must never be able to carry markup. A legitimate old export may predate
// stable ids, so a bad one is regenerated rather than rejecting the whole
// bundle — defence in depth behind the frontend's escaping.
const ID_SAFE_RE = /^[A-Za-z0-9_-]{1,64}$/;
function sanitizeImportedIds(categories, machines) {
  let regenerated = 0;
  for (const cat of categories || []) {
    // Category ids double as notes keys, so they keep the slug shape.
    if (!ID_SAFE_RE.test(cat.id)) { cat.id = genId("cat-"); regenerated++; }
    for (const sub of cat.subcategories || []) {
      if (sub.id !== undefined && !(typeof sub.id === "string" && ID_SAFE_RE.test(sub.id))) { sub.id = genId("s"); regenerated++; }
      for (const cmd of sub.commands || []) {
        if (cmd.id !== undefined && !(typeof cmd.id === "string" && ID_SAFE_RE.test(cmd.id))) { cmd.id = genId("c"); regenerated++; }
      }
    }
  }
  for (const m of machines || []) {
    if (!ID_SAFE_RE.test(m.id)) { m.id = genId("m"); regenerated++; }
  }
  return regenerated;
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
  // Optional metadata: MITRE ATT&CK technique tag(s) + reference link(s).
  if (Array.isArray(req.body.attack) ? req.body.attack.length : req.body.attack) command.attack = req.body.attack;
  if (Array.isArray(req.body.refs) && req.body.refs.length) command.refs = req.body.refs;
  if (req.body.ref) command.ref = req.body.ref;
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
  // Same field checks the POST enforces — a PUT used to accept anything and the
  // server then exported a bundle its own importer rejects.
  if (req.body.title !== undefined && !isNonEmptyString(req.body.title))
    return res.status(400).json({ error: "title must be a non-empty string" });
  for (const key of ["desc", "cmd", "note"]) {
    if (req.body[key] !== undefined && typeof req.body[key] !== "string")
      return res.status(400).json({ error: key + " must be a string" });
  }
  if (req.body.cmds !== undefined && !Array.isArray(req.body.cmds))
    return res.status(400).json({ error: "cmds must be an array" });
  if (req.body.tags !== undefined && !Array.isArray(req.body.tags))
    return res.status(400).json({ error: "tags must be an array" });
  if (req.body.title) command.title = req.body.title;
  if (req.body.desc !== undefined) command.desc = req.body.desc;
  if (req.body.cmd !== undefined) { command.cmd = req.body.cmd; delete command.cmds; }
  if (req.body.cmds) { command.cmds = req.body.cmds; delete command.cmd; }
  if (req.body.tags) command.tags = req.body.tags;
  if (req.body.note !== undefined) command.note = req.body.note;
  if (req.body.attack !== undefined) { if (Array.isArray(req.body.attack) ? req.body.attack.length : req.body.attack) command.attack = req.body.attack; else delete command.attack; }
  if (req.body.refs !== undefined) { if (Array.isArray(req.body.refs) && req.body.refs.length) command.refs = req.body.refs; else delete command.refs; }
  if (req.body.ref !== undefined) { if (req.body.ref) command.ref = req.body.ref; else delete command.ref; }
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
  // The POST validates these; without the same checks here the server happily
  // stored a write-up that /api/import would later refuse with a 400.
  if (req.body.title !== undefined && !isNonEmptyString(req.body.title))
    return res.status(400).json({ error: "title required" });
  if (req.body.tags !== undefined && !(Array.isArray(req.body.tags) && req.body.tags.every(t => typeof t === "string")))
    return res.status(400).json({ error: "tags must be an array of strings" });
  if (req.body.content !== undefined && typeof req.body.content !== "string")
    return res.status(400).json({ error: "content must be a string" });
  if (req.body.relatedMachine !== undefined && req.body.relatedMachine !== null &&
      typeof req.body.relatedMachine !== "string")
    return res.status(400).json({ error: "relatedMachine must be a string" });
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
// Field types the PUT accepts. The POST already enforces the string/array shape
// of the fields it takes; the PUT used to copy whatever arrived, which is how a
// machine ended up with a non-string status and broke every later read of it.
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
    case "stringArray": return Array.isArray(value) && value.every((t) => typeof t === "string");
    case "object": return isPlainObject(value);
    default: return true;
  }
}
app.put("/api/machines/:id", (req, res) => {
  const machines = readMachines();
  const m = machines.find(x => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: "not found" });
  for (const [key, kind] of Object.entries(MACHINE_FIELD_TYPES)) {
    if (req.body[key] !== undefined && !checkFieldType(req.body[key], kind))
      return res.status(400).json({ error: `invalid ${key}` });
  }
  for (const key of Object.keys(MACHINE_FIELD_TYPES)) {
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

// ── Exam Mode (a single JSON document) ──
const EXAM_FILE = path.join(DATA_DIR, "exam.json");
function readExam() { const e = readJSON(EXAM_FILE, {}); return isPlainObject(e) ? e : {}; }
function writeExam(d) { atomicWrite(EXAM_FILE, JSON.stringify(d, null, 2)); }

app.get("/api/exam", (req, res) => res.json(readExam()));
app.put("/api/exam", (req, res) => {
  if (!isPlainObject(req.body)) return res.status(400).json({ error: "exam must be an object" });
  writeExam(req.body);
  res.json(req.body);
});

// ── Export / Import ──
// Evidence screenshots live as files under DATA_DIR/uploads and are referenced
// from markdown only as "/uploads/<id>.<ext>" — without shipping the bytes, a
// restored write-up comes back full of broken images. Only files the exported
// content actually references are included, so the bundle stays as small as
// the user's own data.
const UPLOAD_NAME_RE = /^[A-Za-z0-9]+\.(png|jpg|gif|bmp|webp)$/;
function collectUploadNames(...sources) {
  const names = new Set();
  const hay = JSON.stringify(sources) || "";
  const re = /\/uploads\/([A-Za-z0-9]+\.(?:png|jpg|gif|bmp|webp))/g;
  let m;
  while ((m = re.exec(hay)) !== null) names.add(m[1]);
  return names;
}
function exportUploads(writeups, machines) {
  const out = {};
  for (const name of collectUploadNames(writeups, machines)) {
    const file = path.join(UPLOADS_DIR, name); // the regex rules out traversal
    try {
      if (fs.existsSync(file)) out[name] = fs.readFileSync(file).toString("base64");
    } catch { /* one unreadable screenshot must not fail the whole backup */ }
  }
  return out;
}
function importUploads(map) {
  let written = 0;
  for (const [name, b64] of Object.entries(map)) {
    if (!UPLOAD_NAME_RE.test(name) || typeof b64 !== "string") continue;
    let buf;
    try { buf = Buffer.from(b64, "base64"); } catch { continue; }
    if (!buf.length || buf.length > MAX_UPLOAD_BYTES) continue;
    // Trust the bytes, never the name — same rule as /api/upload.
    const ext = sniffImageExt(buf);
    if (!ext || !name.toLowerCase().endsWith("." + ext)) continue;
    try { fs.writeFileSync(path.join(UPLOADS_DIR, name), buf); written++; } catch { /* skip */ }
  }
  return written;
}

app.get("/api/export", (req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=cheat-sheet-backup.json");
  const writeups = readWriteups();
  const machines = readMachines();
  res.json({
    categories: readData(), notes: readNotes(), writeups, machines,
    exam: readExam(), uploads: exportUploads(writeups, machines),
  });
});

app.post("/api/import", (req, res) => {
  const body = req.body;
  // Old format: a bare array of categories.
  if (Array.isArray(body)) {
    if (!isValidCategoryArray(body)) return res.status(400).json({ error: "invalid categories format" });
    const regenerated = sanitizeImportedIds(body, null);
    writeData(body);
    return res.json({ ok: true, categories: body.length, idsRegenerated: regenerated });
  }
  // New format: an object with any of categories/notes/writeups/machines/exam.
  if (!body || typeof body !== "object") return res.status(400).json({ error: "invalid import body" });
  if (body.categories !== undefined && !isValidCategoryArray(body.categories))
    return res.status(400).json({ error: "invalid categories format" });
  if (body.notes !== undefined && !isValidNotesMap(body.notes))
    return res.status(400).json({ error: "invalid notes format" });
  if (body.writeups !== undefined && !isValidWriteupArray(body.writeups))
    return res.status(400).json({ error: "invalid writeups format" });
  if (body.machines !== undefined && !isValidMachineArray(body.machines))
    return res.status(400).json({ error: "invalid machines format" });
  if (body.exam !== undefined && !isPlainObject(body.exam))
    return res.status(400).json({ error: "invalid exam format" });
  if (body.uploads !== undefined && !isPlainObject(body.uploads))
    return res.status(400).json({ error: "invalid uploads format" });
  if (body.categories === undefined && body.notes === undefined &&
      body.writeups === undefined && body.machines === undefined &&
      body.exam === undefined)
    return res.status(400).json({ error: "nothing to import" });

  const regenerated = sanitizeImportedIds(body.categories, body.machines);
  // Everything is validated by now, so write as one unit: a failure halfway
  // through used to leave notes keyed to categories that no longer existed.
  const previous = {
    categories: readData(), notes: readNotes(), writeups: readWriteups(),
    machines: readMachines(), exam: readExam(),
  };
  const writers = { categories: writeData, notes: writeNotes, writeups: writeWriteups, machines: writeMachines, exam: writeExam };
  const done = [];
  try {
    for (const key of ["categories", "notes", "writeups", "machines", "exam"]) {
      if (body[key] === undefined) continue;
      writers[key](body[key]);
      done.push(key);
    }
  } catch (e) {
    for (const key of done) {
      try { writers[key](previous[key]); } catch { /* nothing left to do but report */ }
    }
    console.error("⚠  import failed and was rolled back:", e.message);
    return res.status(500).json({ error: "import failed — previous data restored" });
  }
  // Uploads are additive files, not state, so they go last and never roll back.
  const uploads = body.uploads ? importUploads(body.uploads) : 0;
  res.json({
    ok: true,
    categories: body.categories ? body.categories.length : 0,
    idsRegenerated: regenerated,
    uploads,
  });
});

// ── Seed status / non-destructive content update ──
// An install used to receive the seed exactly once, at creation: new bundled
// commands never reached anyone, and the only "update" on offer was /api/reset,
// which deleted user-created categories and re-minted every id.
app.get("/api/seed-status", (req, res) => {
  const current = readMeta().seedVersion || null;
  const { version } = loadSeed();
  res.json({ current, latest: version, updateAvailable: current !== version });
});

app.post("/api/update", (req, res) => {
  const dryRun = req.query.dryRun === "1" || req.query.dryRun === "true" ||
    !!(req.body && req.body.dryRun);
  const { seed, version } = loadSeed();
  const baseline = readBaseline();
  // A dry run must not leave a single mutation behind, so it merges into a copy.
  const target = dryRun ? JSON.parse(JSON.stringify(readData())) : readData();
  const merged = mergeSeedInto(target, seed, baseline);
  if (!dryRun) {
    writeData(target);
    try {
      writeMeta(Object.assign(readMeta(), { seedVersion: version }));
      writeBaseline(merged.baseline);
    } catch (e) {
      console.error("⚠  merged the new seed but could not record its version:", e.message);
    }
  }
  res.json(Object.assign({}, merged.stats, { seedVersion: version, dryRun }));
});

// ── Reset to defaults ──
app.post("/api/reset", (req, res) => {
  const { seed, version } = loadSeed();
  // Favourites are keyed by command id, so a reset that re-mints ids orphans all
  // of them. Carry the existing ids onto every record the seed still contains.
  preserveIds(seed, readData());
  writeData(seed);
  try {
    writeMeta(Object.assign(readMeta(), { seedVersion: version }));
    writeBaseline(buildBaseline(seed));
  } catch (e) {
    console.error("⚠  reset succeeded but could not record the seed version:", e.message);
  }
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
