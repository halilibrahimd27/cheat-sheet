// ============================================================================
// Next Move — "here is what I have, what do I run now?"
//
// Every other command reference makes you already know the answer in order to
// find it: you search for "kerberoast" because you have decided to kerberoast.
// This view inverts that. You describe the situation — open services, whether
// you hold credentials, where you stand — and it ranks what to try, drawn from
// the same 219 service probes, 319 stuck-hints and 5040-command corpus the rest
// of the app uses.
//
// Design rules, learned the hard way elsewhere in this product:
//   * Never invent certainty. 85 distinct `when` conditions ship in the probe
//     data as free text; exactly two of them are mechanically decidable
//     ("always", and the creds/no-creds split). The rest are surfaced WITH
//     their condition visible rather than silently filtered — a suggestion
//     that hides why it might not apply is worse than no suggestion.
//   * Reuse, do not fork. The probe lookup, queue builder and stuck lists all
//     live in session.js; the nmap parser lives in app.js. This file owns the
//     situation model and the ranking, nothing else.
//   * Everything is built with createElement + textContent. This repo shipped
//     four stored-XSS sinks that were all "escaped text next to an unescaped
//     attribute", so there are no HTML strings here to get wrong.
// ============================================================================
(function () {
  "use strict";

  var APP = window.CS_APP || {};
  var LS_KEY = "cs-nextmove";
  var host = null, mounted = false, dataPromise = null;

  // ── i18n ────────────────────────────────────────────────────────────────
  var STR = {
    en: {
      title: "Next Move", situation: "Situation", target: "Target", os: "OS",
      access: "Access", services: "Open services", addSvc: "add port/service",
      pasteScan: "paste scan output", parse: "Parse", clear: "Clear all",
      osUnknown: "unknown", osLinux: "linux", osWindows: "windows",
      acNone: "no access", acCreds: "have credentials", acFoothold: "shell as user",
      acAdmin: "local admin/root", acDomain: "domain admin",
      moves: "Next moves", nMoves: "suggested", none: "Nothing suggested yet",
      noneHint: "Add the services you found — paste nmap output or type a port — and the ranked moves appear here.",
      gEnum: "Enumerate what you found", gCreds: "With the credentials you hold",
      gCond: "Conditional — read the condition first", gStuck: "If you are stuck",
      gUncovered: "No probe for these ports",
      tried: "tried", untry: "un-mark", markTried: "mark as tried",
      triedN: "already tried", copy: "copy", copied: "copied",
      why: "why", phase: "phase", focus: "focus",
      loadFail: "Could not load the move data.",
      retry: "Retry", loading: "Loading move data…",
      fromTarget: "from active target", useTarget: "Use active target",
      condNote: "This command ships with a condition attached. Check it holds before you run it.",
      uncoveredHint: "The corpus has no probe for these yet — search the command list instead.",
      scanPh: "Paste `nmap -sCV` output here, or anything with `22/tcp open ssh` lines."
    },
    tr: {
      title: "Siradaki Hamle", situation: "Durum", target: "Hedef", os: "Isletim sistemi",
      access: "Erisim", services: "Acik servisler", addSvc: "port/servis ekle",
      pasteScan: "tarama ciktisi yapistir", parse: "Ayristir", clear: "Hepsini temizle",
      osUnknown: "bilinmiyor", osLinux: "linux", osWindows: "windows",
      acNone: "erisim yok", acCreds: "kimlik bilgim var", acFoothold: "kullanici kabugu",
      acAdmin: "yerel yonetici/root", acDomain: "domain admin",
      moves: "Siradaki hamleler", nMoves: "oneri", none: "Henuz oneri yok",
      noneHint: "Buldugun servisleri ekle — nmap ciktisini yapistir ya da port yaz — siralanmis hamleler burada cikar.",
      gEnum: "Buldugunu listele", gCreds: "Elindeki kimlik bilgileriyle",
      gCond: "Kosullu — once kosulu oku", gStuck: "Sikistiysan",
      gUncovered: "Bu portlar icin probe yok",
      tried: "denendi", untry: "isareti kaldir", markTried: "denendi isaretle",
      triedN: "denenmisler", copy: "kopyala", copied: "kopyalandi",
      why: "neden", phase: "faz", focus: "odak",
      loadFail: "Hamle verisi yuklenemedi.",
      retry: "Tekrar dene", loading: "Hamle verisi yukleniyor…",
      fromTarget: "aktif hedeften", useTarget: "Aktif hedefi kullan",
      condNote: "Bu komut bir kosulla birlikte geliyor. Calistirmadan once kosulun gecerli oldugunu dogrula.",
      uncoveredHint: "Korpusta bunlar icin henuz probe yok — komut listesinde ara.",
      scanPh: "`nmap -sCV` ciktisini buraya yapistir; `22/tcp open ssh` satiri iceren her sey olur."
    }
  };
  function S(k) {
    var lang = (typeof APP.getLang === "function" && APP.getLang()) === "tr" ? "tr" : "en";
    return (STR[lang] && STR[lang][k]) || STR.en[k] || k;
  }

  // ── state ───────────────────────────────────────────────────────────────
  // ACCESS is declared before load() runs on purpose: `var` hoists the binding
  // but not the value, so referencing it from load() below its own declaration
  // threw inside load()'s try/catch and silently reset the saved situation on
  // every page load — a bug that looks exactly like "persistence doesn't work".
  var ACCESS = ["none", "creds", "foothold", "admin", "domain"];
  var ACCESS_LABEL = { none: "acNone", creds: "acCreds", foothold: "acFoothold", admin: "acAdmin", domain: "acDomain" };

  var DEFAULT = { target: "", os: "", access: "none", services: [], tried: {}, scanOpen: false };
  var state = load();

  function load() {
    try {
      var raw = window.localStorage.getItem(LS_KEY);
      if (!raw) return clone(DEFAULT);
      var v = JSON.parse(raw);
      if (!v || typeof v !== "object") return clone(DEFAULT);
      return {
        target: typeof v.target === "string" ? v.target : "",
        os: v.os === "linux" || v.os === "windows" ? v.os : "",
        access: ACCESS.indexOf(v.access) >= 0 ? v.access : "none",
        services: Array.isArray(v.services) ? v.services.slice(0, 200) : [],
        tried: v.tried && typeof v.tried === "object" ? v.tried : {},
        scanOpen: !!v.scanOpen
      };
    } catch { return clone(DEFAULT); }
  }
  function save() {
    try { window.localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* private window */ }
  }
  function clone(v) { try { return JSON.parse(JSON.stringify(v)); } catch { return {}; } }

  // ── data access ─────────────────────────────────────────────────────────
  function DATA() { return window.CS_SESSION_DATA || null; }
  function SESSION() { return window.CS_SESSION || window.CS_EXAM || null; }

  // session-data.js is ~600KB and deliberately absent from the initial page
  // load. Injecting it is idempotent: if Sessions already pulled it in, the
  // global is there and this resolves immediately.
  function loadData() {
    if (DATA()) return Promise.resolve(DATA());
    if (dataPromise) return dataPromise;
    dataPromise = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-cs-session-data]');
      if (existing) {
        existing.addEventListener("load", function () { resolve(DATA()); });
        existing.addEventListener("error", function () { reject(new Error("session-data.js")); });
        return;
      }
      var s = document.createElement("script");
      s.src = "session-data.js";
      s.setAttribute("data-cs-session-data", "1");
      s.onload = function () { DATA() ? resolve(DATA()) : reject(new Error("session-data.js loaded but defined nothing")); };
      s.onerror = function () { reject(new Error("session-data.js could not be fetched")); };
      document.head.appendChild(s);
    });
    return dataPromise;
  }

  // ── situation -> phase / focus ──────────────────────────────────────────
  var WEB_PORTS = [80, 443, 8080, 8443, 8000, 8888, 3000, 5000, 9200, 5601, 10000];
  var AD_PORTS = [88, 389, 636, 3268, 3269, 445, 5985];

  function hasPort(p) {
    for (var i = 0; i < state.services.length; i++) if (+state.services[i].port === p) return true;
    return false;
  }
  function anyPort(list) { for (var i = 0; i < list.length; i++) if (hasPort(list[i])) return true; return false; }

  // Ports that mean "this is a host you will get a shell on", as opposed to an
  // application you will attack through the browser. One of these open makes it
  // a network problem even when a web server is also listening — which is the
  // usual shape of a lab box, and the reason a naive "web port is open" test
  // sent an ssh+http target to the webapp playbook.
  var HOST_PORTS = [21, 22, 23, 25, 53, 111, 135, 139, 445, 1433, 2049, 3306, 3389, 5432, 5985, 5986, 6379, 27017];

  // Focus decides WHICH stuck list applies. AD wins outright when the Kerberos /
  // LDAP giveaways are present, because at that point the box is a domain
  // problem no matter what else it serves.
  function focusOf() {
    var adHits = 0, i;
    for (i = 0; i < AD_PORTS.length; i++) if (hasPort(AD_PORTS[i])) adHits++;
    if (hasPort(88) || (adHits >= 2 && (hasPort(389) || hasPort(636)))) return "ad";
    if (state.access === "domain") return "ad";
    if (!state.services.length) return "network";
    // Pure web surface — every open port is a web port and nothing else is
    // listening — is the only case that earns the webapp playbook.
    if (anyPort(WEB_PORTS) && !anyPort(HOST_PORTS)) return "webapp";
    return "network";
  }

  function phaseOf() {
    if (state.access === "foothold") return state.os === "windows" ? "privesc-windows" : "privesc-linux";
    if (state.access === "admin" || state.access === "domain") return "lateral";
    if (state.access === "creds") return "foothold";
    return state.services.length ? "enumeration" : "recon";
  }

  // ── condition classification ────────────────────────────────────────────
  // The probe data's `when` is free text written for a human. Two buckets are
  // mechanically decidable and the rest are shown with the condition attached.
  var RE_ALWAYS = /^always$/i;
  var RE_NEEDS_CREDS = /creds? known|credentials|password auth accepted|username[s]? known|a candidate password|hashes dumped|key material|module requires auth|if superuser/i;
  var RE_NEEDS_NOCREDS = /no creds|unauthenticated|anonymous|null session|if no /i;

  function bucketOf(when) {
    var w = String(when || "").trim();
    if (!w || RE_ALWAYS.test(w)) return "enum";
    if (RE_NEEDS_CREDS.test(w)) return "creds";
    if (RE_NEEDS_NOCREDS.test(w)) return "nocreds";
    return "cond";
  }
  var HAS_CREDS = { creds: 1, foothold: 1, admin: 1, domain: 1 };

  // ── move building ───────────────────────────────────────────────────────
  function resolve(cmd) {
    var sess = SESSION();
    if (sess && typeof sess.resolveCmd === "function") {
      return sess.resolveCmd(cmd, { ip: state.target });
    }
    var out = String(cmd == null ? "" : cmd);
    if (state.target) {
      ["<TARGET_IP>", "<RHOST>", "<IP>", "<TARGET>", "<TARGET_URL>"].forEach(function (ph) {
        out = out.split(ph).join(state.target);
      });
      out = out.replace(/\$IP\b/g, state.target);
    }
    if (typeof APP.applyVars === "function") {
      try { out = APP.applyVars(out); } catch { /* a broken var bar must not break the list */ }
    }
    return out;
  }

  function triedKey(cmd) { return String(cmd).slice(0, 220); }
  function isTried(cmd) { return !!state.tried[triedKey(cmd)]; }

  function buildMoves() {
    var out = { enum: [], creds: [], cond: [], uncovered: [], stuck: null };
    var data = DATA();
    if (!data) return out;
    var sess = SESSION();

    var queue = null;
    if (sess && typeof sess.buildQueue === "function") {
      queue = sess.buildQueue(state.services);
    } else {
      queue = localQueue(data);
    }

    (queue.groups || []).forEach(function (g) {
      var ports = (g.services || []).map(function (s) { return s.port; }).filter(Boolean).join(", ");
      (g.probe.commands || []).forEach(function (c) {
        var b = bucketOf(c.when);
        // A no-creds command is pointless once you hold credentials, and a
        // creds command is noise before you do.
        if (b === "nocreds" && HAS_CREDS[state.access]) return;
        if (b === "creds" && !HAS_CREDS[state.access]) return;
        var move = {
          service: g.probe.service, ports: ports, note: g.probe.note || "",
          label: c.label || "", when: c.when || "", raw: c.cmd || ""
        };
        if (b === "cond") out.cond.push(move);
        else if (b === "creds") out.creds.push(move);
        else out.enum.push(move);
      });
    });

    out.uncovered = queue.uncovered || [];

    var focus = focusOf(), phase = phaseOf();
    if (sess && typeof sess.stuckList === "function") out.stuck = sess.stuckList(focus, phase);
    if (!out.stuck) {
      var lists = data.stuck || [];
      for (var i = 0; i < lists.length; i++) {
        if (lists[i].focus === focus && lists[i].phase === phase) { out.stuck = lists[i]; break; }
      }
    }
    out.focus = focus; out.phase = phase;
    return out;
  }

  // Fallback used only when session.js is absent (it is an optional script).
  function localQueue(data) {
    var probes = data.probes || [], groups = [], uncovered = [], seen = {};
    state.services.forEach(function (s) {
      var port = parseInt(s.port, 10), name = String(s.name || "").toLowerCase(), probe = null, i;
      for (i = 0; i < probes.length && !probe; i++) if ((probes[i].ports || []).indexOf(port) >= 0) probe = probes[i];
      for (i = 0; i < probes.length && !probe; i++) if (name && String(probes[i].service || "").toLowerCase() === name) probe = probes[i];
      if (!probe) { if (s.port) uncovered.push(s); return; }
      if (seen[probe.service] !== undefined) { groups[seen[probe.service]].services.push(s); return; }
      seen[probe.service] = groups.length;
      groups.push({ probe: probe, services: [s] });
    });
    return { groups: groups, uncovered: uncovered };
  }

  // ── tiny DOM helpers ────────────────────────────────────────────────────
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = String(text);
    return n;
  }
  function btn(cls, text, onClick, title) {
    var b = el("button", cls, text);
    b.type = "button";
    if (title) b.title = title;
    b.addEventListener("click", onClick);
    return b;
  }

  // ── situation panel ─────────────────────────────────────────────────────
  function situationPanel() {
    var wrap = el("section", "nm-situation");
    var head = el("div", "nm-sit-head");
    head.appendChild(el("h2", "nm-sit-title", S("situation")));
    var activeId = typeof APP.getActiveTargetId === "function" ? APP.getActiveTargetId() : null;
    if (activeId && typeof APP.getMachines === "function") {
      var machines = APP.getMachines() || [], m = null;
      for (var i = 0; i < machines.length; i++) if (machines[i].id === activeId) m = machines[i];
      if (m) {
        head.appendChild(btn("nm-btn nm-btn-ghost", "◎ " + S("useTarget"), function () {
          state.target = m.ip || state.target;
          if (m.os) state.os = /win/i.test(m.os) ? "windows" : (/linux|nix|unix/i.test(m.os) ? "linux" : state.os);
          var svc = (m.services || []).map(function (s) {
            return { port: String(s.port || ""), name: String(s.name || ""), state: "open" };
          }).filter(function (s) { return s.port; });
          if (svc.length) state.services = dedupe(state.services.concat(svc));
          save(); paint();
          if (APP.toast) APP.toast(S("fromTarget") + ": " + (m.name || m.ip || ""), "ok");
        }, m.name || m.ip || ""));
      }
    }
    head.appendChild(btn("nm-btn nm-btn-ghost nm-clear", S("clear"), function () {
      state = clone(DEFAULT); save(); paint();
    }));
    wrap.appendChild(head);

    var grid = el("div", "nm-sit-grid");

    // target
    var fTarget = el("label", "nm-field");
    fTarget.appendChild(el("span", "nm-field-label", S("target")));
    var inTarget = el("input", "nm-input");
    inTarget.type = "text"; inTarget.value = state.target; inTarget.placeholder = "10.10.11.5";
    inTarget.autocomplete = "off"; inTarget.spellcheck = false;
    inTarget.addEventListener("input", function () { state.target = inTarget.value.trim(); save(); repaintMoves(); });
    fTarget.appendChild(inTarget);
    grid.appendChild(fTarget);

    // os
    grid.appendChild(segmented(S("os"), [
      { v: "", label: S("osUnknown") }, { v: "linux", label: S("osLinux") }, { v: "windows", label: S("osWindows") }
    ], state.os, function (v) { state.os = v; save(); paint(); }));

    // access
    grid.appendChild(segmented(S("access"), ACCESS.map(function (a) {
      return { v: a, label: S(ACCESS_LABEL[a]) };
    }), state.access, function (v) { state.access = v; save(); paint(); }));

    wrap.appendChild(grid);
    wrap.appendChild(servicesRow());
    return wrap;
  }

  function segmented(label, opts, value, onPick) {
    var f = el("div", "nm-field");
    f.appendChild(el("span", "nm-field-label", label));
    var row = el("div", "nm-seg");
    opts.forEach(function (o) {
      var b = btn("nm-seg-btn" + (o.v === value ? " on" : ""), o.label, function () { onPick(o.v); });
      b.setAttribute("aria-pressed", o.v === value ? "true" : "false");
      row.appendChild(b);
    });
    f.appendChild(row);
    return f;
  }

  function dedupe(list) {
    var seen = {}, out = [];
    list.forEach(function (s) {
      var k = String(s.port) + "/" + String(s.proto || "tcp");
      if (seen[k]) return;
      seen[k] = 1; out.push(s);
    });
    return out.sort(function (a, b) { return (+a.port || 0) - (+b.port || 0); });
  }

  function servicesRow() {
    var f = el("div", "nm-field nm-field-wide");
    var lab = el("span", "nm-field-label", S("services"));
    f.appendChild(lab);

    var chips = el("div", "nm-chips");
    state.services.forEach(function (s, idx) {
      var chip = el("span", "nm-chip");
      chip.appendChild(el("b", "nm-chip-port", String(s.port)));
      if (s.name) chip.appendChild(el("span", "nm-chip-name", s.name));
      chip.appendChild(btn("nm-chip-x", "×", function () {
        state.services.splice(idx, 1); save(); paint();
      }, S("clear")));
      chips.appendChild(chip);
    });

    var add = el("input", "nm-input nm-add");
    add.type = "text"; add.placeholder = S("addSvc"); add.autocomplete = "off"; add.spellcheck = false;
    add.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      e.preventDefault();
      var v = add.value.trim();
      if (!v) return;
      // "445", "445 smb", "445/tcp smb" all work.
      var m = v.match(/^(\d{1,5})(?:\/(tcp|udp))?\s*(.*)$/i);
      if (!m) { if (APP.toast) APP.toast("port?", "error"); return; }
      var port = +m[1];
      if (port < 1 || port > 65535) return;
      state.services = dedupe(state.services.concat([{ port: String(port), proto: (m[2] || "tcp").toLowerCase(), name: (m[3] || "").trim(), state: "open" }]));
      add.value = ""; save(); paint();
      var again = host && host.querySelector(".nm-add");
      if (again) again.focus();
    });
    chips.appendChild(add);
    f.appendChild(chips);

    var tools = el("div", "nm-sit-tools");
    tools.appendChild(btn("nm-btn nm-btn-ghost", (state.scanOpen ? "▾ " : "▸ ") + S("pasteScan"), function () {
      state.scanOpen = !state.scanOpen; save(); paint();
    }));
    f.appendChild(tools);

    if (state.scanOpen) {
      var box = el("div", "nm-scan");
      var ta = el("textarea", "nm-textarea");
      ta.placeholder = S("scanPh"); ta.rows = 5; ta.spellcheck = false;
      box.appendChild(ta);
      var bar = el("div", "nm-scan-bar");
      bar.appendChild(btn("nm-btn nm-btn-primary", S("parse"), function () {
        var parsed = typeof APP.parseNmap === "function" ? APP.parseNmap(ta.value) : [];
        if (!parsed.length) { if (APP.toast) APP.toast("0", "error"); return; }
        var open = parsed.filter(function (s) { return !s.state || s.state.indexOf("open") === 0; });
        state.services = dedupe(state.services.concat(open));
        state.scanOpen = false; save(); paint();
        if (APP.toast) APP.toast("+" + open.length, "ok");
      }));
      box.appendChild(bar);
      f.appendChild(box);
    }
    return f;
  }

  // ── move rows ───────────────────────────────────────────────────────────
  function moveRow(mv) {
    var resolved = resolve(mv.raw);
    var row = el("article", "nm-move" + (isTried(resolved) ? " is-tried" : ""));

    var head = el("div", "nm-move-head");
    var src = el("span", "nm-move-src");
    src.appendChild(el("b", "nm-move-svc", mv.service));
    if (mv.ports) src.appendChild(el("span", "nm-move-ports", mv.ports));
    head.appendChild(src);
    head.appendChild(el("span", "nm-move-label", mv.label));

    var acts = el("div", "nm-move-acts");
    var copyBtn = btn("nm-btn nm-btn-copy", S("copy"), function () {
      if (typeof APP.copyToClipboard === "function") {
        APP.copyToClipboard(resolved, function () {
          copyBtn.textContent = S("copied");
          if (typeof APP.recordHistory === "function") { try { APP.recordHistory(resolved); } catch { /* history is a convenience */ } }
          setTimeout(function () { copyBtn.textContent = S("copy"); }, 1200);
        });
      }
      markTried(resolved, true);
    });
    acts.appendChild(copyBtn);
    acts.appendChild(btn("nm-btn nm-btn-try", isTried(resolved) ? "✓ " + S("tried") : S("markTried"), function () {
      markTried(resolved, !isTried(resolved));
    }, isTried(resolved) ? S("untry") : S("markTried")));
    head.appendChild(acts);
    row.appendChild(head);

    var pre = el("pre", "nm-move-cmd");
    pre.appendChild(el("code", null, resolved));
    row.appendChild(pre);

    if (mv.when && bucketOf(mv.when) === "cond") {
      var cond = el("p", "nm-move-cond");
      cond.appendChild(el("span", "nm-cond-tag", "if"));
      cond.appendChild(el("span", null, " " + mv.when.replace(/^if\s+/i, "")));
      row.appendChild(cond);
    }
    return row;
  }

  function markTried(cmd, on) {
    var k = triedKey(cmd);
    if (on) state.tried[k] = 1; else delete state.tried[k];
    save(); repaintMoves();
  }

  function group(title, items, renderItem, hint) {
    if (!items.length) return null;
    var sec = el("section", "nm-group");
    var h = el("h3", "nm-group-title", title);
    h.appendChild(el("span", "nm-group-count", String(items.length)));
    sec.appendChild(h);
    if (hint) sec.appendChild(el("p", "nm-group-hint", hint));
    var body = el("div", "nm-group-body");
    items.forEach(function (it) { body.appendChild(renderItem(it)); });
    sec.appendChild(body);
    return sec;
  }

  function stuckRow(it) {
    var row = el("article", "nm-stuck");
    row.appendChild(el("p", "nm-stuck-text", it.text));
    if (it.why) row.appendChild(el("p", "nm-stuck-why", it.why));
    if (it.cmd) {
      var resolved = resolve(it.cmd);
      var pre = el("pre", "nm-move-cmd nm-stuck-cmd");
      pre.appendChild(el("code", null, resolved));
      pre.addEventListener("click", function () {
        if (typeof APP.copyToClipboard === "function") APP.copyToClipboard(resolved, function () { if (APP.toast) APP.toast(S("copied"), "ok"); });
      });
      pre.title = S("copy");
      row.appendChild(pre);
    }
    return row;
  }

  function movesPanel() {
    var mv = buildMoves();
    var wrap = el("section", "nm-moves");

    var head = el("div", "nm-moves-head");
    head.appendChild(el("h2", "nm-sit-title", S("moves")));
    var meta = el("div", "nm-moves-meta");
    var total = mv.enum.length + mv.creds.length + mv.cond.length;
    meta.appendChild(el("span", "nm-meta-chip", S("focus") + " " + (mv.focus || "-")));
    meta.appendChild(el("span", "nm-meta-chip", S("phase") + " " + (mv.phase || "-")));
    meta.appendChild(el("span", "nm-meta-count", total + " " + S("nMoves")));
    head.appendChild(meta);
    wrap.appendChild(head);

    if (!total && !mv.uncovered.length && !mv.stuck) {
      var empty = el("div", "nm-empty");
      empty.appendChild(el("h3", null, S("none")));
      empty.appendChild(el("p", null, S("noneHint")));
      wrap.appendChild(empty);
      return wrap;
    }

    var untried = function (list) { return list.filter(function (m) { return !isTried(resolve(m.raw)); }); };
    var triedAll = [].concat(mv.enum, mv.creds, mv.cond).filter(function (m) { return isTried(resolve(m.raw)); });

    [
      [S("gEnum"), untried(mv.enum), null],
      [S("gCreds"), untried(mv.creds), null],
      [S("gCond"), untried(mv.cond), S("condNote")]
    ].forEach(function (g) {
      var sec = group(g[0], g[1], moveRow, g[2]);
      if (sec) wrap.appendChild(sec);
    });

    if (mv.stuck && (mv.stuck.items || []).length) {
      var sec = group(S("gStuck"), mv.stuck.items, stuckRow, null);
      if (sec) { sec.classList.add("nm-group-stuck"); wrap.appendChild(sec); }
    }

    if (mv.uncovered.length) {
      var u = group(S("gUncovered"), mv.uncovered, function (s) {
        var row = el("div", "nm-uncovered-row");
        row.appendChild(el("b", null, String(s.port)));
        if (s.name) row.appendChild(el("span", null, s.name));
        return row;
      }, S("uncoveredHint"));
      if (u) wrap.appendChild(u);
    }

    if (triedAll.length) {
      var det = el("details", "nm-tried");
      var sum = el("summary", null, S("triedN") + " (" + triedAll.length + ")");
      det.appendChild(sum);
      var body = el("div", "nm-group-body");
      triedAll.forEach(function (m) { body.appendChild(moveRow(m)); });
      det.appendChild(body);
      wrap.appendChild(det);
    }
    return wrap;
  }

  // ── paint ───────────────────────────────────────────────────────────────
  function paint() {
    if (!host) return;
    host.innerHTML = "";
    var page = el("div", "nm-page");
    page.appendChild(situationPanel());
    page.appendChild(movesPanel());
    host.appendChild(page);
  }
  // Typing in the target box must not tear down the input it is typing into.
  function repaintMoves() {
    if (!host) return;
    var old = host.querySelector(".nm-moves");
    if (!old) return paint();
    old.replaceWith(movesPanel());
  }

  function loadingPane() {
    var d = el("div", "nm-empty");
    d.appendChild(el("h3", null, S("loading")));
    return d;
  }
  function errorPane(msg, retry) {
    var d = el("div", "nm-empty");
    d.appendChild(el("h3", null, "⚠ " + S("loadFail")));
    d.appendChild(el("p", null, msg));
    d.appendChild(btn("nm-btn nm-btn-primary", S("retry"), retry));
    return d;
  }

  function render(container) {
    host = container;
    mounted = true;
    // Re-read on every mount rather than trusting the snapshot taken when the
    // script first ran. Every change writes through immediately, so this can
    // only ever pick up newer truth — a second tab, or a situation seeded
    // before this view was first opened.
    state = load();
    if (DATA()) { paint(); return; }
    host.innerHTML = "";
    host.appendChild(loadingPane());
    loadData().then(function () {
      if (!mounted) return;
      paint();
    }).catch(function (err) {
      if (!mounted) return;
      host.innerHTML = "";
      host.appendChild(errorPane(String((err && err.message) || err), function () {
        dataPromise = null; render(host);
      }));
    });
  }

  // Count of services in play — enough for the sidebar to say "there is
  // something in here", nothing more.
  function navBadge() {
    return state.services.length ? String(state.services.length) : "";
  }

  var priorHook = APP.onViewRender;
  if (APP && typeof APP === "object") {
    APP.onViewRender = function (viewId) {
      if (viewId !== "next") mounted = false;
      if (typeof priorHook === "function") { try { priorHook(viewId); } catch { /* not ours to fail */ } }
    };
  }

  window.CS_NEXT = { render: render, navBadge: navBadge, buildMoves: buildMoves, focusOf: focusOf, phaseOf: phaseOf, bucketOf: bucketOf };
})();
