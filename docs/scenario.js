/* GENERATED FILE — DO NOT EDIT. Built from public/ + seed.js by scripts/build-static.js. */
"use strict";
// ── Attack-plan engine ───────────────────────────────────────────────────────
// Pure, deterministic, offline. NO AI, no network, no randomness: the same open
// ports + the same findings always produce the same plan. "Intelligence" here is
// a sequencing/chaining algorithm over a port->technique corpus, exactly the
// "millions of if/else" the product is meant to feel like.
//
// It turns a machine's parsed nmap services into an ORDERED, CHAINED scenario:
//   open ports  ->  matched service corpus rows (public/port-map.js)
//               ->  curated steps, bucketed by their `when` condition
//               ->  gated by what you already hold (creds / foothold / findings)
//               ->  emitted in waves: "do these now" -> "once you get X, these open"
// and, per service, a live pointer list into the 5,040-command DB (the engine
// guides, it does not copy — the commands already live in the reference).
//
// Consumed by app.js (buildAttackPlanSection) and the Next Move view. Reads three
// optional globals, each guarded: CS_PORT_MAP (the corpus), CS_SESSION_DATA
// (fallback corpus), CS_APP (getCategories + applyVars). Degrades, never throws.
(function () {
  var W = window;

  // ── corpus access ───────────────────────────────────────────────────────
  // Prefer the comprehensive port-map; fall back to the legacy 38-probe table so
  // the engine still works if port-map.js has not loaded yet.
  function corpus() {
    if (W.CS_PORT_MAP && W.CS_PORT_MAP.length) return W.CS_PORT_MAP;
    return adaptProbes();
  }
  function adaptProbes() {
    var data = W.CS_SESSION_DATA;
    var probes = (data && data.probes) || [];
    return probes.map(function (p) {
      return {
        ports: (p.ports || []).slice(), service: String(p.service || "").toLowerCase(),
        aliases: [String(p.service || "").toLowerCase()], proto: "tcp", risk: "medium",
        note: p.note || "", categories: [], attack: [], keywords: [], yields: [], needs: [],
        steps: (p.commands || []).map(function (c) {
          var b = bucketOf(c.when);
          return { phase: b === "creds" ? "foothold" : "enum", label: c.label || "", cmd: c.cmd || "", when: c.when || "always", yields: [] };
        })
      };
    });
  }
  function categories() {
    var app = W.CS_APP;
    if (app && typeof app.getCategories === "function") { try { return app.getCategories() || []; } catch { return []; } }
    return [];
  }

  // ── service normalisation ───────────────────────────────────────────────
  function normServices(arr) {
    return (Array.isArray(arr) ? arr : []).map(function (s) {
      if (s && typeof s === "object") {
        return { port: String(s.port || ""), proto: s.proto || "tcp", name: String(s.name || s.service || "").toLowerCase().replace(/\?+$/, ""), version: String(s.version || ""), state: s.state || "open" };
      }
      return { port: "", proto: "tcp", name: String(s == null ? "" : s).toLowerCase(), version: "", state: "open" };
    });
  }

  // ── `when` classification (shared vocabulary with nextmove.js) ───────────
  var RE_ALWAYS = /^always$/i;
  var RE_NEEDS_CREDS = /creds? known|credentials|password auth accepted|username[s]? known|a candidate password|hashes dumped|key material|module requires auth|if superuser|authenticated|logged in|valid (?:user|account|login)/i;
  var RE_NEEDS_NOCREDS = /no creds|unauthenticated|anonymous|null session|if no /i;
  function bucketOf(when) {
    var w = String(when || "").trim();
    if (!w || RE_ALWAYS.test(w)) return "enum";
    if (RE_NEEDS_CREDS.test(w)) return "creds";
    if (RE_NEEDS_NOCREDS.test(w)) return "nocreds";
    return "cond";
  }

  // ── service -> corpus row matching ──────────────────────────────────────
  // Port number is primary (nmap's service NAME is often generic, uncertain, or
  // flat wrong). A small canonical port->base-service table decides the PRIMARY
  // row when several corpus rows legitimately ride the same port (445 carries
  // smb, spooler and efsrpc; 80 carries http and adcs web-enrollment): the base
  // protocol wins a generic banner, and a specialised row is chosen only when the
  // scan's service name actually names it. NOISE names ("unknown", "tcpwrapped")
  // and nmap's trailing "?" never identify anything, so they match on port alone.
  var CANONICAL = {
    21: "ftp", 22: "ssh", 23: "telnet", 25: "smtp", 53: "dns", 80: "http", 88: "kerberos",
    110: "pop3", 111: "rpcbind", 135: "msrpc", 139: "smb", 143: "imap", 161: "snmp",
    389: "ldap", 443: "https", 445: "smb", 465: "smtp", 587: "smtp", 636: "ldap",
    993: "imap", 995: "pop3", 1433: "mssql", 1521: "oracle", 2049: "nfs", 3268: "ldap",
    3306: "mysql", 3389: "rdp", 5432: "postgresql", 5985: "winrm", 5986: "winrm",
    6379: "redis", 8080: "http", 8443: "https", 27017: "mongodb"
  };
  var NOISE = { "": 1, unknown: 1, tcpwrapped: 1 };
  function rowsForService(svc, rows) {
    var port = parseInt(svc.port, 10);
    var name = svc.name || ""; if (NOISE[name]) name = "";
    var hay = (name + " " + svc.version).toLowerCase();
    var portHits = rows.filter(function (r) { return port > 0 && (r.ports || []).indexOf(port) >= 0; });
    if (portHits.length) {
      var canon = CANONICAL[port];
      if (canon) {
        var base = portHits.filter(function (r) { return r.service === canon; })[0];
        if (base) {
          // A generic banner (the port's own protocol name, or none) resolves to
          // the base service. Only a name that is NOT one of the base's own
          // aliases can promote a specialised same-port row.
          var generic = !name || name === canon || (base.aliases || []).indexOf(name) >= 0;
          if (!generic) {
            var special = portHits.filter(function (r) { return r.service !== canon && (r.service === name || (r.aliases || []).indexOf(name) >= 0); });
            if (special.length) return [special[0]];
          }
          // A product named in the VERSION string can still promote a specialised
          // row (8080 "Apache Tomcat" -> tomcat) without a generic protocol alias
          // hijacking the base service, since a version rarely repeats the bare
          // protocol name the way the nmap service name does.
          var ver = String(svc.version || "").toLowerCase();
          if (ver) {
            var byVer = portHits.filter(function (r) { return r.service !== canon && (r.aliases || []).some(function (a) { return a && a.length >= 4 && !NOISE[a] && a !== canon && ver.indexOf(a) >= 0; }); });
            if (byVer.length) return [byVer[0]];
          }
          return [base];
        }
      }
      if (name) {
        var byName = portHits.filter(function (r) { return r.service === name || (r.aliases || []).indexOf(name) >= 0; });
        if (byName.length) return [byName[0]];
        var byBanner = portHits.filter(function (r) { return (r.aliases || []).some(function (a) { return a && a.length >= 3 && !NOISE[a] && hay.indexOf(a) >= 0; }); });
        if (byBanner.length) return [byBanner[0]];
      }
      return [portHits[0]];
    }
    // No known port: match on a specific service name only (noise already blanked).
    if (!name) return [];
    var nm = rows.filter(function (r) { return r.service === name || (r.aliases || []).indexOf(name) >= 0; });
    return nm.slice(0, 1);
  }

  // ── what you already hold ───────────────────────────────────────────────
  // Access level implies a baseline of findings; the caller adds explicit tokens
  // (a filled credential vault -> "creds", noted usernames -> "users", etc.).
  var ACCESS_FOUND = {
    none: [], creds: ["creds"], foothold: ["creds", "foothold", "shell"],
    admin: ["creds", "foothold", "shell", "admin"], domain: ["creds", "foothold", "shell", "domain-user"]
  };
  function foundSet(ctx) {
    var f = {};
    (ACCESS_FOUND[ctx.access] || []).forEach(function (t) { f[t] = 1; });
    (ctx.found || []).forEach(function (t) { f[String(t).toLowerCase()] = 1; });
    return f;
  }

  // ── placeholder resolution ──────────────────────────────────────────────
  var TARGET_PH = ["<TARGET_IP>", "<RHOST_IP>", "<RHOST>", "<IP>", "<TARGET>", "<TARGET_URL>"];
  // `port` is the single scanned port a step's service sits on, passed only when
  // it is unambiguous — then <PORT> is filled so the command is runnable as-is.
  // <LPORT> (the attacker's listener) is a different token and is left untouched.
  function resolve(cmd, ctx, port) {
    var out = String(cmd == null ? "" : cmd);
    var ip = ctx && ctx.ip ? String(ctx.ip).trim() : "";
    if (ip) { TARGET_PH.forEach(function (ph) { out = out.split(ph).join(ip); }); out = out.replace(/\$IP\b/g, ip); }
    if (port) out = out.split("<PORT>").join(String(port));
    var app = W.CS_APP;
    if (app && typeof app.applyVars === "function") { try { out = app.applyVars(out); } catch { /* a broken var bar must not break the plan */ } }
    return out;
  }

  // ── ordering ────────────────────────────────────────────────────────────
  var PHASE_ORDER = { recon: 0, enum: 1, foothold: 2, privesc: 3, lateral: 4, loot: 5 };
  var RISK_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
  function stepSort(a, b) {
    return (PHASE_ORDER[a.phase] - PHASE_ORDER[b.phase]) ||
      (RISK_ORDER[a.risk] - RISK_ORDER[b.risk]) ||
      a.service.localeCompare(b.service) || (a.order - b.order);
  }
  function stepKey(s) { return s.service + "|" + s.label + "|" + s.cmd; }

  // ── availability gate ───────────────────────────────────────────────────
  // The per-step `when` is the authoritative gate; the corpus's coarse row-level
  // `needs` is NOT applied here, because it wrongly blanket-gated a service's own
  // unauthenticated enumeration (e.g. smb carried needs=["creds"], which would
  // hide null-session enum — the first thing you ever run on 445). Chaining still
  // works: a wave's `yields` accumulate into `found`, so a creds-gated step opens
  // once an earlier step (or the user's own finding) produces creds.
  function unmetNeeds(step, found) {
    var miss = [];
    if (step.bucket === "creds" && !found.creds) miss.push("creds");
    if (step.bucket === "nocreds" && found.creds) miss.push("(you already hold creds)");
    return miss;
  }
  function available(step, found) { return unmetNeeds(step, found).length === 0; }

  // ── strategic frame (focus + phase), port-driven ────────────────────────
  var WEB_PORTS = [80, 443, 8080, 8443, 8000, 8888, 3000, 5000, 8081, 8181, 9200];
  var AD_PORTS = [88, 389, 636, 3268, 3269, 445, 5985];
  var HOST_PORTS = [21, 22, 23, 25, 53, 111, 135, 139, 445, 1433, 2049, 3306, 3389, 5432, 5985, 5986, 6379, 27017];
  function has(services, p) { return services.some(function (s) { return +s.port === p; }); }
  function anyOf(services, list) { return list.some(function (p) { return has(services, p); }); }
  function frame(services, ctx) {
    var focus = "network";
    var adHits = AD_PORTS.filter(function (p) { return has(services, p); }).length;
    if (has(services, 88) || (adHits >= 2 && (has(services, 389) || has(services, 636))) || ctx.access === "domain") focus = "ad";
    else if (!services.length) focus = "network";
    else if (anyOf(services, WEB_PORTS) && !anyOf(services, HOST_PORTS)) focus = "webapp";
    var phase;
    if (ctx.access === "foothold") phase = ctx.os === "windows" ? "privesc-windows" : "privesc-linux";
    else if (ctx.access === "admin" || ctx.access === "domain") phase = "lateral";
    else if (ctx.access === "creds") phase = "foothold";
    else phase = services.length ? "enumeration" : "recon";
    return { focus: focus, phase: phase };
  }

  // ── the plan ────────────────────────────────────────────────────────────
  // Returns:
  //   resolved : [{service, ports:[], risk, note, row}]  one per matched service
  //   waves    : [{index, unlockedBy:[tokens], steps:[step]}]  ordered, chained
  //   locked   : [step + {unlockedBy:[tokens]}]  steps nothing yet satisfies
  //   uncovered: [service]  open ports with no corpus row
  //   focus, phase, found
  // Each step: {service, ports, risk, phase, label, cmd, resolved, when, bucket, yields}
  function plan(services, ctx) {
    ctx = ctx || {};
    var rows = corpus();
    var norm = normServices(services).filter(function (s) { return !s.state || s.state === "open" || s.state === "open|filtered"; });

    var resolved = [], uncovered = [], seen = {};
    norm.forEach(function (s) {
      var rs = rowsForService(s, rows);
      if (!rs.length) { if (s.port) uncovered.push(s); return; }
      rs.forEach(function (r) {
        if (seen[r.service]) { if (s.port && seen[r.service].ports.indexOf(s.port) < 0) seen[r.service].ports.push(s.port); return; }
        var rec = { service: r.service, row: r, ports: s.port ? [s.port] : [], risk: r.risk || "medium", note: r.note || "" };
        seen[r.service] = rec; resolved.push(rec);
      });
    });

    var allSteps = [];
    resolved.forEach(function (rec) {
      // When the service was found on exactly one port, <PORT> is unambiguous and
      // gets filled; on several ports it stays symbolic (which port is meant?).
      var onePort = rec.ports.length === 1 ? rec.ports[0] : "";
      (rec.row.steps || []).forEach(function (st, i) {
        allSteps.push({
          service: rec.service, ports: rec.ports.join(", "), risk: rec.risk,
          phase: st.phase || "enum", label: st.label || "", cmd: st.cmd || "",
          resolved: resolve(st.cmd, ctx, onePort), when: st.when || "always", bucket: bucketOf(st.when),
          yields: (st.yields || []).slice(), needs: (rec.row.needs || []).slice(), order: i
        });
      });
    });

    var found = foundSet(ctx);
    var waves = [], emitted = {}, unlockedBy = [], cap = 6;
    for (var w = 0; w < cap; w++) {
      var batch = allSteps.filter(function (s) { return !emitted[stepKey(s)] && available(s, found); });
      if (!batch.length) break;
      batch.sort(stepSort);
      batch.forEach(function (s) { emitted[stepKey(s)] = 1; });
      waves.push({ index: w, unlockedBy: unlockedBy.slice(), steps: batch });
      var gained = [];
      batch.forEach(function (s) { (s.yields || []).forEach(function (y) { if (!found[y]) { found[y] = 1; gained.push(y); } }); });
      unlockedBy = gained;
      if (!gained.length) break; // nothing new can open; remaining are genuinely locked
    }
    var locked = allSteps.filter(function (s) { return !emitted[stepKey(s)]; })
      .map(function (s) { var o = {}; for (var k in s) o[k] = s[k]; o.unlockedBy = unmetNeeds(s, found); return o; });

    var fr = frame(norm, ctx);
    return { resolved: resolved, waves: waves, locked: locked, uncovered: uncovered, found: Object.keys(found), focus: fr.focus, phase: fr.phase };
  }

  // ── live DB pointers for a service (the "guide to the 5,040 commands") ───
  // Scores each command by how many independent signals agree that it belongs to
  // this service: ATT&CK id overlap (strongest), category membership, then a
  // tool/keyword hit in the title or command text (catches the long tail and new
  // commands before they are even ATT&CK-tagged). Essential-tagged first.
  function dbCommandsFor(row, opts) {
    var cats = categories();
    if (!cats.length || !row) return [];
    var limit = (opts && opts.limit) || 14;
    var wantAtt = {}; (row.attack || []).forEach(function (a) { wantAtt[a] = 1; });
    var wantCat = {}; (row.categories || []).forEach(function (c) { wantCat[c] = 1; });
    var kw = (row.keywords || []).filter(Boolean);
    var out = [], seen = {};
    cats.forEach(function (cat) {
      var catHit = wantCat[cat.id] ? 1 : 0;
      (cat.subcategories || []).forEach(function (sub) {
        (sub.commands || []).forEach(function (c) {
          var body = String(c.cmd || (c.cmds && c.cmds[0]) || "");
          var text = (String(c.title || "") + " " + body).toLowerCase();
          var attHit = (c.attack || []).some(function (a) { return wantAtt[a]; }) ? 1 : 0;
          var kwHit = kw.some(function (k) { return text.indexOf(k) >= 0; }) ? 1 : 0;
          // Specificity bar: an ATT&CK or keyword hit is a real signal; category
          // membership alone is only a booster (score 1 < threshold), so a whole
          // category is not dumped under a service — "ping" never lands under smb.
          var score = attHit * 3 + kwHit * 2 + catHit;
          if (score < 2) return;
          var key = (c.title || "") + "|" + body;
          if (seen[key]) return; seen[key] = 1;
          var essential = (c.tags || []).indexOf("essential") >= 0 ? 1 : 0;
          out.push({ title: c.title || "", cmd: body, catId: cat.id, score: score, essential: essential });
        });
      });
    });
    out.sort(function (a, b) { return (b.score - a.score) || (b.essential - a.essential) || a.title.localeCompare(b.title); });
    return out.slice(0, limit);
  }

  // ── OS inference from the scan (feeds the OS-aware menus) ────────────────
  // The privesc/loot menus are OS-specific, so they stay dark when a pasted scan
  // never had its OS field set by hand. This reads the banners for HIGH-CONFIDENCE
  // signals and names the OS only on a clear majority — never from a shared port.
  // Deliberately conservative: 445/139 (Samba runs on Linux too) and a bare
  // "microsoft-ds" banner do NOT vote; only Windows-only ports (135 msrpc, 3389
  // rdp, 5985/6 winrm, 464 kpasswd) and explicit OS strings do. A tie or no
  // signal returns "" — better unset than wrong.
  var RE_WIN_BANNER = /windows|microsoft windows|microsoft iis|\biis\b|ms-wbt|winrm|active directory|\.net framework/;
  var RE_LIN_BANNER = /ubuntu|debian|\blinux\b|\bunix\b|centos|fedora|red ?hat|raspbian|\bel\d/;
  var WIN_PORTS = { 135: 1, 3389: 1, 5985: 1, 5986: 1, 464: 1 };
  function inferOs(services) {
    var norm = normServices(services);
    var win = 0, lin = 0;
    norm.forEach(function (s) {
      var hay = (s.name + " " + s.version).toLowerCase();
      if (RE_WIN_BANNER.test(hay)) win++;
      if (WIN_PORTS[parseInt(s.port, 10)]) win++;
      if (RE_LIN_BANNER.test(hay)) lin++;
    });
    if (win > lin) return "windows";
    if (lin > win) return "linux";
    return "";
  }

  // ── post-foothold privilege escalation (OS-aware, DB-sourced) ────────────
  // Once a shell is held the remote waves are spent — the next move is local.
  // This surfaces one essential command per escalation VECTOR (SUID, sudo, cron,
  // SeImpersonate, services, kernel, a PEAS scanner…) by taking the first
  // essential-with-a-body command of each subcategory in the matching OS privesc
  // category, so the block reads as a menu of techniques, not a dump of 90
  // commands. Gated on access === "foothold": nothing to escalate before a shell,
  // nothing left to do once you are admin.
  var PRIVESC_CAT = { windows: "win-escalation", linux: "linux-escalation" };
  function privescFor(ctx) {
    ctx = ctx || {};
    if (ctx.access !== "foothold") return [];
    var os = ctx.os === "windows" ? "windows" : (ctx.os === "linux" ? "linux" : "");
    if (!os) return [];
    var cat = categories().filter(function (c) { return c.id === PRIVESC_CAT[os]; })[0];
    if (!cat) return [];
    var out = [];
    (cat.subcategories || []).forEach(function (sub) {
      var pick = null;
      (sub.commands || []).some(function (c) {
        if ((c.tags || []).indexOf("essential") < 0) return false;
        var body = String(c.cmd || (c.cmds && c.cmds[0]) || "").trim();
        if (!body) return false;
        pick = { title: c.title || "", group: sub.name || "", cmd: body, resolved: resolve(body, ctx), catId: cat.id, os: os };
        return true;
      });
      if (pick) out.push(pick);
    });
    return out.slice(0, 14);
  }

  // ── post-foothold pivoting / lateral movement (DB-sourced) ───────────────
  // A held shell turns the box into a gateway: route attacker traffic through it
  // to reach hosts the scan could never see. This surfaces one essential command
  // per pivoting VECTOR (SSH forward, Chisel, Ligolo-ng, SOCKS proxy, Windows
  // port-forward, double pivot) from the live DB's pivoting category — a menu of
  // routes, not a dump of 45 commands. Gated on a shell being held
  // (foothold/admin/domain): you cannot tunnel through a box you are not on, and
  // unlike privesc, pivoting stays relevant after you own the box, so it shows at
  // every shell level (foothold through domain), not just foothold.
  var PIVOT_CAT = "pivoting";
  var SHELL_ACCESS = { foothold: 1, admin: 1, domain: 1 };
  function pivotFor(ctx) {
    ctx = ctx || {};
    if (!SHELL_ACCESS[ctx.access]) return [];
    var cat = categories().filter(function (c) { return c.id === PIVOT_CAT; })[0];
    if (!cat) return [];
    var out = [];
    (cat.subcategories || []).forEach(function (sub) {
      var pick = null;
      (sub.commands || []).some(function (c) {
        if ((c.tags || []).indexOf("essential") < 0) return false;
        var body = String(c.cmd || (c.cmds && c.cmds[0]) || "").trim();
        if (!body) return false;
        pick = { title: c.title || "", group: sub.name || "", cmd: body, resolved: resolve(body, ctx), catId: cat.id };
        return true;
      });
      if (pick) out.push(pick);
    });
    return out.slice(0, 12);
  }

  // ── post-admin loot / post-exploitation (OS-aware, DB-sourced) ───────────
  // Once you own the box (root/SYSTEM), the move is to harvest and hold: dump
  // credentials to move laterally, then take situational awareness, hunt stored
  // secrets and (where a write-up wants it) persist. Headlined by the OS
  // credential-dumping lead (mimikatz / the shadow file — the whole point of
  // owning the box), then one essential per post-exploitation vector. Gated on
  // access === "admin"/"domain": there is nothing to loot until you own it, and
  // this is the capstone the privesc menu was climbing toward.
  var LOOT_CAT = { windows: "post-exploitation-win", linux: "post-exploitation-linux" };
  var LOOT_DUMP = { windows: "Credential Dumping (Windows)", linux: "Credential Dumping (Linux)" };
  function firstEssential(sub, ctx, catId) {
    var pick = null;
    (sub.commands || []).some(function (c) {
      if ((c.tags || []).indexOf("essential") < 0) return false;
      var body = String(c.cmd || (c.cmds && c.cmds[0]) || "").trim();
      if (!body) return false;
      pick = { title: c.title || "", group: sub.name || "", cmd: body, resolved: resolve(body, ctx), catId: catId };
      return true;
    });
    return pick;
  }
  function lootFor(ctx) {
    ctx = ctx || {};
    if (ctx.access !== "admin" && ctx.access !== "domain") return [];
    var os = ctx.os === "windows" ? "windows" : (ctx.os === "linux" ? "linux" : "");
    if (!os) return [];
    var out = [];
    // Headline: the OS credential-dumping lead (the reason you rooted the box).
    var pw = categories().filter(function (c) { return c.id === "password-ops"; })[0];
    if (pw) (pw.subcategories || []).forEach(function (sub) {
      if (sub.name !== LOOT_DUMP[os]) return;
      var p = firstEssential(sub, ctx, "password-ops"); if (p) out.push(p);
    });
    // Then the OS post-exploitation menu: awareness, cred hunting, persistence.
    var cat = categories().filter(function (c) { return c.id === LOOT_CAT[os]; })[0];
    if (cat) (cat.subcategories || []).forEach(function (sub) {
      var p = firstEssential(sub, ctx, cat.id); if (p) out.push(p);
    });
    return out.slice(0, 12);
  }

  // ── version → known-exploit matching (public/vuln-map.js) ────────────────
  // nmap's version string is the highest-signal input: an exact vulnerable build
  // is a direct foothold, not a lead to chase. parseVer reads the first dotted-
  // numeric run of a banner ("OpenSSH 8.2p1" -> [8,2], "Apache httpd 2.4.49" ->
  // [2,4,49]); lettered builds that parse identically to their patched sibling
  // (HFS 2.3b vs 2.3c) are matched by ver.re instead of by number. Pure data plus
  // comparison — deterministic, offline, and it never claims a vuln it cannot pin
  // to the version in front of it (a missing hit beats a wrong one in an exam).
  function parseVer(s) {
    var m = String(s == null ? "" : s).match(/\d+(?:\.\d+)+|\d+/);
    return m ? m[0].split(".").map(function (x) { return parseInt(x, 10) || 0; }) : null;
  }
  function cmpVer(a, b) {
    var n = Math.max(a.length, b.length);
    for (var i = 0; i < n; i++) { var x = a[i] || 0, y = b[i] || 0; if (x !== y) return x < y ? -1 : 1; }
    return 0;
  }
  function verSatisfies(verStr, spec) {
    if (!spec || spec.any) return true;
    if (spec.re) return spec.re.test(verStr);
    var v = parseVer(verStr); if (!v) return false;
    if (spec.eq != null) return cmpVer(v, parseVer(spec.eq)) === 0;
    var ok = true;
    if (spec.lt != null) ok = ok && cmpVer(v, parseVer(spec.lt)) < 0;
    if (spec.le != null) ok = ok && cmpVer(v, parseVer(spec.le)) <= 0;
    if (spec.gt != null) ok = ok && cmpVer(v, parseVer(spec.gt)) > 0;
    if (spec.ge != null) ok = ok && cmpVer(v, parseVer(spec.ge)) >= 0;
    return ok;
  }
  var SEV_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
  // Matched vulns for a scan: product regex over the banner, ver spec over the
  // parsed number, <TARGET_IP>/<PORT> filled from the machine + the matched port.
  function vulnsFor(services, ctx) {
    var map = W.CS_VULN_MAP;
    if (!Array.isArray(map) || !map.length) return [];
    ctx = ctx || {};
    var norm = normServices(services).filter(function (s) { return !s.state || s.state === "open" || s.state === "open|filtered"; });
    var out = [], seen = {};
    norm.forEach(function (s) {
      var verStr = String(s.version || "");
      if (!verStr && !s.name) return;
      var hay = (s.name || "") + " " + verStr;
      map.forEach(function (e) {
        if (!e.product || !e.product.test(hay)) return;
        if (!verSatisfies(verStr, e.ver)) return;
        var key = (e.id || e.title) + "@" + s.port;
        if (seen[key]) return; seen[key] = 1;
        var port = String(s.port || "");
        var ex = resolve(e.exploit || "", ctx);
        if (port) ex = ex.split("<PORT>").join(port);
        out.push({
          service: e.svc || s.name || "", port: port, version: verStr,
          title: e.title || "", id: e.id || "", sev: e.sev || "high",
          exploit: e.exploit || "", resolvedExploit: ex, note: e.note || ""
        });
      });
    });
    out.sort(function (a, b) { return (SEV_ORDER[a.sev] - SEV_ORDER[b.sev]) || String(a.port).localeCompare(String(b.port)) || a.title.localeCompare(b.title); });
    return out;
  }

  W.CS_SCENARIO = {
    plan: plan,
    dbCommandsFor: dbCommandsFor,
    vulnsFor: vulnsFor,
    privescFor: privescFor,
    pivotFor: pivotFor,
    lootFor: lootFor,
    inferOs: inferOs,
    rowsForService: rowsForService,
    bucketOf: bucketOf,
    _corpus: corpus
  };
})();
