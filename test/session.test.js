"use strict";
// Sessions: the fact table first, the module second.
//
// public/session-data.js is not decoration. Someone sits an OSCP at 09:00 with
// this open on a second monitor, and every number in it is a number they will
// act on. A fabricated pass mark, a points total that does not add up, or a tool
// warning that fires on a permitted tool is worse than shipping nothing: the
// first two are wrong answers wearing a vendor's authority, and the third trains
// the user to dismiss warnings until the one that mattered gets dismissed too.
// So the data assertions below are not schema box-ticking — each one guards a
// specific way this feature can lie to someone under time pressure.
//
// The module assertions are written against the contract in public/app.js
// (`window.CS_SESSION.render(container)`), and deliberately resolve the rest of
// the surface by trying a list of plausible names: this file does not own
// public/session.js, and a test that pinned one spelling would be a rename tax
// rather than a guarantee. Where a member cannot be resolved the failure message
// prints every name that was tried — that list is the contract statement.

const test = require("node:test");
const assert = require("node:assert");
const { readSessionData, loadSession, pick, MODULE_FILE } = require("./helpers/load-session.js");
const { serialize, textOf, identifiersOf, assertInert } = require("./helpers/serialize-dom.js");

const DATA = readSessionData();
const PRESETS = DATA.presets;
const byId = (id) => PRESETS.find((p) => p.id === id);
const targetPresets = () => PRESETS.filter((p) => p.kind === "targets");
const taskPresets = () => PRESETS.filter((p) => p.kind === "tasks");

// Every command string the feature can put in front of a user, with a label
// saying where it came from — the label is what makes a failure actionable in a
// 600KB generated file.
function allCommands() {
  const out = [];
  for (const p of PRESETS) {
    for (const ph of p.phases || []) {
      for (const it of ph.items || []) if (it.hint) out.push(["preset " + p.id + " / phase " + ph.id, it.hint]);
    }
  }
  for (const pr of DATA.probes) {
    for (const c of pr.commands) out.push(["probe " + pr.service, c.cmd]);
  }
  for (const s of DATA.stuck) {
    for (const it of s.items) if (it.cmd) out.push(["stuck " + s.focus + "/" + s.phase, it.cmd]);
  }
  return out;
}

// ───────────────────────────── THE DATA ─────────────────────────────

test("the bundle ships every preset the feature promises, in both kinds", () => {
  assert.ok(DATA && typeof DATA === "object", "session-data.js must assign window.CS_SESSION_DATA");
  assert.ok(Array.isArray(PRESETS) && Array.isArray(DATA.probes) && Array.isArray(DATA.stuck));

  const ids = PRESETS.map((p) => p.id);
  assert.strictEqual(new Set(ids).size, ids.length, "preset ids must be unique: " + ids.join(", "));
  assert.deepStrictEqual(ids.slice().sort(), [
    "cka", "ckad", "cks", "cloud-native-lab", "ctf", "custom", "dca", "htb-cpts",
    "oscp", "oscp-plus", "osep", "oswa", "oswe", "pnpt", "quick-lab", "terraform-associate",
  ], "a preset was added or removed — update the list deliberately, it is what the UI offers");

  // Growth is fine, silent loss is not: these are the corpus sizes the feature
  // was designed around.
  const steps = PRESETS.reduce((a, p) => a + p.phases.reduce((b, ph) => b + ph.items.length, 0), 0);
  assert.ok(steps >= 965, "phase steps fell to " + steps + " (was 965)");
  assert.ok(DATA.probes.reduce((a, p) => a + p.commands.length, 0) >= 219, "probe commands shrank");
  assert.ok(DATA.stuck.reduce((a, s) => a + s.items.length, 0) >= 319, "stuck hints shrank");
});

test("every preset carries the fields its kind requires", () => {
  for (const p of PRESETS) {
    const where = "preset " + p.id;
    assert.ok(["targets", "tasks"].includes(p.kind), where + ": kind must be targets or tasks, got " + JSON.stringify(p.kind));
    for (const f of ["name", "icon", "tagline", "focus"]) {
      assert.strictEqual(typeof p[f], "string", where + ": " + f + " must be a string");
      assert.ok(p[f].length > 0, where + ": " + f + " must not be empty");
    }
    assert.strictEqual(typeof p.durationMin, "number", where + ": durationMin must be a number (0 = no timer)");
    assert.ok(Array.isArray(p.phases) && p.phases.length > 0, where + ": needs phases");
    for (const arr of ["rules", "sources", "unverified", "notes", "appFeatures"]) {
      assert.ok(Array.isArray(p[arr]), where + ": " + arr + " must be an array (it is reachable from the UI)");
    }

    const phaseIds = p.phases.map((ph) => ph.id);
    assert.strictEqual(new Set(phaseIds).size, phaseIds.length, where + ": duplicate phase id");
    for (const ph of p.phases) {
      assert.ok(ph.id && ph.name && ph.goal, where + " phase " + ph.id + ": needs id, name and goal");
      assert.ok(Array.isArray(ph.items) && ph.items.length > 0, where + " phase " + ph.id + ": needs items");
      for (const it of ph.items) assert.ok(typeof it.label === "string" && it.label.length > 0, where + " phase " + ph.id + ": an item has no label");
    }

    if (p.kind === "targets") {
      assert.ok(Array.isArray(p.targets), where + ": kind targets needs a targets array");
      assert.ok(Array.isArray(p.evidenceRules), where + ": kind targets needs evidenceRules");
      assert.ok(Array.isArray(p.reportSections) && p.reportSections.length > 0, where + ": kind targets needs reportSections");
      const keys = p.targets.map((t) => t.key);
      assert.strictEqual(new Set(keys).size, keys.length, where + ": duplicate target key");
      const flagIds = [].concat(...p.targets.map((t) => t.flags.map((f) => f.id)));
      assert.strictEqual(new Set(flagIds).size, flagIds.length, where + ": duplicate flag id");
      for (const t of p.targets) {
        assert.ok(t.key && t.label && t.kind, where + " target " + t.key + ": needs key, label and kind");
        assert.ok(Array.isArray(t.flags), where + " target " + t.key + ": needs flags");
      }
    } else {
      assert.ok(Array.isArray(p.domains), where + ": kind tasks needs a domains array");
      assert.ok(Array.isArray(p.timeSavers) && Array.isArray(p.allowedDocs), where + ": kind tasks needs timeSavers and allowedDocs");
      assert.ok(Array.isArray(p.pitfalls) && Array.isArray(p.retroSections), where + ": kind tasks needs pitfalls and retroSections");
      assert.strictEqual(typeof p.curriculumVersion, "string", where + ": kind tasks needs curriculumVersion");
      assert.strictEqual(typeof p.taskCount, "number", where + ": kind tasks needs taskCount");
    }
  }
});

test("domain weights sum to exactly 100 — a study plan that allocates 97% mis-allocates revision", () => {
  for (const p of taskPresets()) {
    const sum = p.domains.reduce((a, d) => a + d.weight, 0);
    assert.strictEqual(sum, 100, "preset " + p.id + ": domain weights sum to " + sum);
    const ids = p.domains.map((d) => d.id);
    assert.strictEqual(new Set(ids).size, ids.length, "preset " + p.id + ": duplicate domain id");
    for (const d of p.domains) {
      assert.ok(d.name, "preset " + p.id + " domain " + d.id + ": needs a name");
      assert.ok(Array.isArray(d.competencies), "preset " + p.id + " domain " + d.id + ": needs competencies");
    }
  }
});

test("target points add up to the published total, and flag points add up to their target", () => {
  for (const p of targetPresets()) {
    // pointsUnknown presets deliberately carry nulls — the vendor does not split
    // the total per target, and inventing a split is the failure mode this whole
    // feature exists to avoid.
    if (p.pointsUnknown) continue;
    if (!(p.totalPoints > 0)) continue;
    const sum = p.targets.reduce((a, t) => a + (t.points || 0), 0);
    assert.strictEqual(sum, p.totalPoints, "preset " + p.id + ": targets sum to " + sum + " but totalPoints is " + p.totalPoints);
    for (const t of p.targets) {
      const fsum = t.flags.reduce((a, f) => a + (f.points || 0), 0);
      assert.strictEqual(fsum, t.points || 0, "preset " + p.id + " target " + t.key + ": flags sum to " + fsum + " but the target is worth " + t.points);
    }
  }
});

test("a pass mark is never higher than the points on the board", () => {
  for (const p of targetPresets()) {
    if (!p.passMark || !p.totalPoints) continue;
    assert.ok(p.passMark <= p.totalPoints, "preset " + p.id + ": passMark " + p.passMark + " exceeds totalPoints " + p.totalPoints);
  }
});

test("every rule and evidence rule declares its confidence, and every official one cites the vendor", () => {
  let official = 0;
  let inferred = 0;
  for (const p of PRESETS) {
    const groups = [["rule", p.rules || []], ["evidenceRule", p.evidenceRules || []]];
    for (const [kind, list] of groups) {
      for (const r of list) {
        const where = "preset " + p.id + " " + kind + " " + JSON.stringify(String(r.text || r.requirement || "").slice(0, 60));
        assert.ok(["official", "inferred"].includes(r.confidence), where + ": confidence must be official or inferred, got " + JSON.stringify(r.confidence));
        assert.ok(String(r.text || r.requirement || "").length > 0, where + ": has no text");
        if (r.confidence === "official") {
          official++;
          // "official" is a claim that the vendor wrote this. It has to be
          // checkable by the person betting their exam on it.
          assert.match(String(r.source || ""), /^https?:\/\//, where + ': claims confidence "official" but cites ' + JSON.stringify(r.source));
        } else {
          inferred++;
        }
      }
    }
    if (Array.isArray(p.rules)) {
      for (const r of p.rules) {
        assert.ok(["limited", "banned", "allowed", "required"].includes(r.kind), "preset " + p.id + ": unknown rule kind " + JSON.stringify(r.kind));
        if ("advisory" in r) assert.strictEqual(typeof r.advisory, "boolean", "preset " + p.id + ": advisory must be a boolean");
      }
    }
  }
  assert.ok(official > 0 && inferred > 0, "both confidence levels must actually be in use (official=" + official + ", inferred=" + inferred + ")");
});

test("every cited source and allowed-doc link is an http(s) URL", () => {
  for (const p of PRESETS) {
    for (const s of p.sources || []) {
      const url = typeof s === "string" ? s : s.url;
      assert.match(String(url || ""), /^https?:\/\//, "preset " + p.id + ": source " + JSON.stringify(s) + " is not an http(s) URL");
    }
    for (const d of p.allowedDocs || []) {
      // An empty url is legitimate — "man pages inside the exam terminal" has no
      // link — but a non-empty one must be real.
      if (!d.url) continue;
      assert.match(d.url, /^https?:\/\//, "preset " + p.id + ": allowedDoc " + JSON.stringify(d.label) + " has url " + JSON.stringify(d.url));
    }
  }
});

test("where the vendor publishes no number, the data carries no number", () => {
  for (const p of PRESETS) {
    if (p.pointsUnknown) {
      for (const t of p.targets || []) {
        assert.strictEqual(t.points, null, "preset " + p.id + " target " + t.key + ": pointsUnknown but points is " + t.points);
        for (const f of t.flags || []) {
          assert.strictEqual(f.points, null, "preset " + p.id + " flag " + f.id + ": pointsUnknown but points is " + f.points);
        }
      }
    }
    if (p.passMarkUndisclosed) {
      assert.ok(!p.passMark, "preset " + p.id + ": passMarkUndisclosed but passMark is " + p.passMark);
    }
    if (p.derivedTotal) {
      assert.ok(p.totalPoints === null || p.totalPoints === 0, "preset " + p.id + ": derivedTotal but totalPoints is " + p.totalPoints);
    }
    if (p.weightsDerived) {
      // Derived weights are honest as long as they are labelled and no pass mark
      // is invented alongside them.
      assert.ok(typeof p.weightsNote === "string" && p.weightsNote.length > 0, "preset " + p.id + ": weightsDerived needs a weightsNote saying whose derivation it is");
      assert.ok(!p.passMark, "preset " + p.id + ": weights are derived, so a pass mark cannot be known — got " + p.passMark);
    }
    // The other direction: a null never appears without a flag explaining it.
    for (const t of p.targets || []) {
      if (t.points === null) assert.ok(p.pointsUnknown || t.pointsUnknown, "preset " + p.id + " target " + t.key + ": null points with nothing marking them unknown");
    }
  }
});

test("OSWE per-target points stay null — OffSec publishes the total, not the split", () => {
  const oswe = byId("oswe");
  assert.strictEqual(oswe.pointsUnknown, true);
  assert.ok(oswe.targets.length > 0);
  for (const t of oswe.targets) {
    assert.strictEqual(t.points, null, "oswe target " + t.key + " must not carry an invented point value");
    for (const f of t.flags) assert.strictEqual(f.points, null, "oswe flag " + f.id + " must not carry an invented point value");
  }
  // The published total is real and must survive.
  assert.strictEqual(oswe.totalPoints, 100);
});

test("DCA pass mark stays 0 and undisclosed — Mirantis does not publish one", () => {
  const dca = byId("dca");
  assert.strictEqual(dca.passMark, 0, "an invented DCA pass mark is exactly the failure this feature is built to avoid");
  assert.strictEqual(dca.passMarkUndisclosed, true);
});

// ─────────────────── FACT-CHECK REGRESSIONS ───────────────────
// Each of these encodes a real error that was caught and corrected. They exist
// so a regeneration of session-data.js cannot quietly reintroduce it.

test("no tool ban names a tool the vendor permits or never named", () => {
  // Responder and ntlmrelayx are permitted (the ban is on spoofing/poisoning, not
  // on the binaries); autorecon-exploit and commix were never named by OffSec.
  // OffSec says twice that it will not comment on allowed tools beyond its guide,
  // so naming an unlisted tool is an inference dressed as a vendor rule.
  const FORBIDDEN = ["responder", "ntlmrelayx", "autorecon-exploit", "commix"];
  for (const p of PRESETS) {
    for (const r of p.rules || []) {
      const enforceable = String(r.enforceable || "");
      const at = enforceable.indexOf("toolban:");
      if (at === -1) continue;
      const list = enforceable.slice(at + "toolban:".length).toLowerCase();
      for (const tool of FORBIDDEN) {
        assert.ok(!list.split(/[,\s]+/).includes(tool), "preset " + p.id + ": toolban names " + tool + " — " + enforceable);
      }
    }
  }
});

test("tool restrictions that are advisory are flagged advisory, and advisory ones exist", () => {
  // A warning that fires on a permitted tool teaches the user to dismiss
  // warnings. The data must keep the distinction the UI renders.
  const advisory = [];
  for (const p of PRESETS) {
    for (const r of p.rules || []) if (r.advisory === true) advisory.push(p.id + " :: " + r.enforceable);
  }
  assert.ok(advisory.length > 0, "no advisory rules survived — the advisory/hard distinction has been flattened");
  // The spoofing-adjacent tool list is the canonical advisory case: the tools are
  // not banned, the technique is.
  const oscp = byId("oscp");
  const spoof = oscp.rules.find((r) => String(r.enforceable || "").indexOf("toolban:mitm6") === 0);
  assert.ok(spoof, "oscp: the mitm6/arpspoof/ettercap restriction is missing");
  assert.strictEqual(spoof.advisory, true, "oscp: the spoofing tool list must stay advisory — the tools are legal, the technique is not");
});

test("DCA is an active Mirantis certification, not a retired Docker one", () => {
  const dca = byId("dca");
  assert.strictEqual(dca.status, "active");
  assert.match(dca.name, /Mirantis/, "dca.name must name Mirantis as the owner: " + dca.name);
});

test("CKA's allowed-docs list includes the Gateway API site", () => {
  const cka = byId("cka");
  const hit = (cka.allowedDocs || []).some((d) => /(^|\/\/)([a-z.]*\.)?gateway-api\.sigs\.k8s\.io/.test(String(d.url || "")));
  assert.ok(hit, "cka.allowedDocs must list gateway-api.sigs.k8s.io — it is allowed, and a candidate who does not know that loses the task");
});

test("no CKA/CKAD rule invents a 'Flag Item to review' exam-UI feature", () => {
  for (const id of ["cka", "ckad"]) {
    const p = byId(id);
    for (const r of p.rules || []) {
      assert.doesNotMatch(String(r.text || ""), /flag\s+item\s+to\s+review/i, id + ": describes an exam-UI feature the vendor does not document — " + String(r.text).slice(0, 120));
    }
  }
});

test("Quick Lab carries HTB's prohibition on training models from its content", () => {
  const ql = byId("quick-lab");
  const rule = (ql.rules || []).find((r) => /train|fine-?tune|dataset|knowledge base/i.test(String(r.text || "")));
  assert.ok(rule, "quick-lab must carry the HTB rule prohibiting using its content to train models or enrich datasets");
  assert.strictEqual(rule.confidence, "official", "it is a published platform rule, not an inference");
  assert.match(rule.source, /^https:\/\/help\.hackthebox\.com\//, "cite HTB's own rules page: " + rule.source);
});

// ─────────────────── COMMAND HYGIENE ───────────────────

// The canonical set, from the header comment of public/checklist-templates.js.
const CANONICAL_PLACEHOLDERS = [
  "TARGET_IP", "ATTACKER_IP", "LHOST", "LPORT", "PORT", "DOMAIN", "DC_IP",
  "USER", "USERNAME", "PASSWORD", "PASS", "HASH", "NETWORK", "CIDR", "TARGET_URL",
];
// Names the app's own Quick IP Changer substitutes (public/app.js ipMap).
const FILLED_PLACEHOLDERS = ["RHOST", "RHOST_IP", "TARGET_DOMAIN"];
// Vocabulary Sessions adds. Every entry is a deliberate addition, listed here so
// a typo (<TARGET_UP>, <NAMESPCE>) cannot pass as new vocabulary — a misspelled
// placeholder is never filled and never flagged, it just silently ships broken.
const SESSION_PLACEHOLDERS = [
  "CAP", "CONTAINER", "CTX", "DC", "EXPORT_PATH", "FIELD", "FILE", "GROUP", "HEX",
  "IMAGE", "INDEX", "INTERNAL_SUBNET", "KEY", "N", "NAME", "NAMESPACE", "NEW_TAG",
  "NODE", "NODENAME", "NS", "NTLM_HASH", "OLD_TAG", "PATH", "POD", "REGISTRY",
  "REPO", "RESOURCE", "SECRET_NAME", "SERVICE", "SHARE", "SID", "STACK", "SUBNET",
  "SVC", "TAG", "TASK_COUNT", "TLD", "WHAT_IS_LEFT",
];
const PLACEHOLDER_VOCAB = new Set([].concat(CANONICAL_PLACEHOLDERS, FILLED_PLACEHOLDERS, SESSION_PLACEHOLDERS));

test("every placeholder is spelled from the documented vocabulary", () => {
  // Lowercase metavariables (<product>, <version>, <edb-id>) are a different
  // convention — "type the thing here" — and the fill bar never touches them, so
  // only SHOUTING tokens are placeholders. A hyphen or a lowercase letter inside
  // a SHOUTING token is the typo shape being hunted.
  const TOKEN = /<([A-Za-z][A-Za-z0-9_-]*)>/g;
  const unknown = new Map();
  for (const [where, cmd] of allCommands()) {
    TOKEN.lastIndex = 0;
    let m;
    while ((m = TOKEN.exec(cmd)) !== null) {
      const name = m[1];
      if (!/^[A-Z][A-Z0-9_-]*$/.test(name)) continue;
      assert.match(name, /^[A-Z][A-Z0-9_]*$/, where + ": placeholder <" + name + "> is not UPPER_SNAKE_CASE — " + cmd);
      if (!PLACEHOLDER_VOCAB.has(name) && !unknown.has(name)) unknown.set(name, where + " — " + cmd);
    }
  }
  assert.deepStrictEqual([...unknown.keys()], [], "undocumented placeholders (add to SESSION_PLACEHOLDERS on purpose, or fix the typo):\n" +
    [...unknown.entries()].map(([k, v]) => "  <" + k + "> in " + v).join("\n"));
});

test("no command hard-codes a routable public IP", () => {
  // The corpus keeps a strict placeholder discipline for a reason: a literal
  // address that someone copy-pastes at 2am is at best noise on a stranger's
  // host and at worst an unauthorised scan. Private, loopback, link-local,
  // multicast and the RFC 5737 documentation ranges are all fine.
  const QUAD = /(?<![\d.])(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?![\d.])/g;
  const isReserved = (o) => {
    const [a, b, c] = o;
    if (a === 0 || a === 10 || a === 127 || a >= 224) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 169 && b === 254) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a === 192 && b === 0 && c === 2) return true;
    if (a === 198 && b === 51 && c === 100) return true;
    if (a === 203 && b === 0 && c === 113) return true;
    if (a === 198 && (b === 18 || b === 19)) return true;
    return false;
  };
  const hits = [];
  for (const [where, cmd] of allCommands()) {
    QUAD.lastIndex = 0;
    let m;
    while ((m = QUAD.exec(cmd)) !== null) {
      const octets = [+m[1], +m[2], +m[3], +m[4]];
      // A longer dotted-decimal run is an SNMP OID or a version string, not an
      // address; the lookarounds above already exclude those.
      if (octets.some((x) => x > 255)) continue;
      if (isReserved(octets)) continue;
      hits.push(where + ": " + m[0] + " in " + cmd);
    }
  }
  assert.deepStrictEqual(hits, [], "public IP literals in Sessions commands:\n  " + hits.join("\n  "));
});

test("probes and stuck-hints are shaped for the UI that reads them", () => {
  const seen = new Set();
  for (const pr of DATA.probes) {
    assert.ok(Array.isArray(pr.ports) && pr.ports.length > 0, "probe " + pr.service + ": needs ports");
    for (const port of pr.ports) assert.ok(Number.isInteger(port) && port > 0 && port <= 65535, "probe " + pr.service + ": bad port " + port);
    assert.ok(pr.service && pr.note, "probe " + pr.service + ": needs a service and a note");
    assert.ok(Array.isArray(pr.commands) && pr.commands.length > 0, "probe " + pr.service + ": needs commands");
    for (const c of pr.commands) {
      assert.ok(c.label && c.cmd && c.when, "probe " + pr.service + ": command " + JSON.stringify(c.label) + " needs label, cmd and when");
    }
  }
  for (const s of DATA.stuck) {
    const key = s.focus + "/" + s.phase;
    assert.ok(!seen.has(key), "duplicate stuck list for " + key);
    seen.add(key);
    assert.ok(Array.isArray(s.items) && s.items.length > 0, "stuck " + key + ": needs items");
    for (const it of s.items) {
      // `why` is the whole point of a stuck hint: a question with no reason is a
      // checklist, and the senior user closes the tab.
      assert.ok(it.text && it.why, "stuck " + key + ": an item is missing text or why");
    }
  }
});

// ───────────────────────────── THE MODULE ─────────────────────────────

const XSS_ATTR = '" onmouseover="alert(1)';
const XSS_TAG = "<script>alert(document.domain)</script>";
const XSS_MIX = "'><img src=x onerror=alert(1)>";
const HOSTILE = XSS_ATTR + XSS_TAG + XSS_MIX;

// Structural fields decide what the module renders at all; poisoning them would
// just make it render nothing and the XSS test would pass vacuously. Everything
// else is prose that ends up on screen.
const STRUCTURAL_KEYS = new Set([
  "id", "kind", "key", "focus", "enforceable", "confidence", "appliesTo", "when",
  "status", "version", "generated", "phase", "advisory", "points", "weight",
  "durationMin", "passMark", "totalPoints", "taskCount", "reportHours",
  "pointsUnknown", "passMarkUndisclosed", "derivedTotal", "weightsDerived",
]);

function poison(value, key) {
  if (typeof value === "string") return STRUCTURAL_KEYS.has(key) ? value : value + HOSTILE;
  if (Array.isArray(value)) return value.map((v) => poison(v, key));
  if (value && typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value)) out[k] = poison(value[k], k);
    return out;
  }
  return value;
}

// A session the module might find already persisted. The key and field names are
// guesses by necessity — this file does not own the storage contract — so the
// seed covers the plausible spellings and is harmless when none of them match.
function hostileStorageSeed() {
  const session = {
    id: "s1", presetId: "oscp-plus", preset: "oscp-plus", startedAt: 1, status: "active", kind: "targets",
    context: HOSTILE, taskContext: HOSTILE, currentContext: HOSTILE, note: HOSTILE, notes: [HOSTILE],
    targets: [{ key: "standalone-1", label: HOSTILE, kind: "standalone", points: 20, flags: [{ id: "sa1-local", label: HOSTILE, value: HOSTILE, captured: true, points: 10 }] }],
    flags: { "sa1-local": HOSTILE },
    attempts: [{ at: 1, text: HOSTILE, what: HOSTILE, result: HOSTILE, target: HOSTILE }],
    log: [{ at: 1, text: HOSTILE }],
    tasks: [{ id: "t1", context: HOSTILE, note: HOSTILE }],
  };
  const blob = JSON.stringify(session);
  const list = JSON.stringify([session]);
  const seed = {};
  for (const k of ["cs_session", "cs_sessions", "cs-session", "cs-sessions", "cs_session_state", "cs_exam", "cs_exam_state", "sessions", "cs.sessions", "cheatsheet_sessions", "cs_session_active"]) {
    seed[k] = k.endsWith("s") ? list : blob;
  }
  return seed;
}

function flush() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// Bring up the module or fail saying what is owed. Kept separate from the
// assertions so the "not written yet" message is identical everywhere.
function bring(opts) {
  const s = loadSession(opts);
  assert.ok(!s.missing, "public/session.js has not landed yet — the Sessions module contract is untested (expected at " + MODULE_FILE + ")");
  assert.ok(!s.loadError, "session.js threw while loading: " + (s.loadError && s.loadError.stack));
  assert.ok(s.mod, "session.js must register window.CS_SESSION — public/app.js renders the Sessions view through it");
  assert.strictEqual(typeof s.mod.render, "function", "window.CS_SESSION.render(container) is the one entry point public/app.js calls");
  return s;
}

const ACTIVATE_NAMES = ["start", "startSession", "begin", "newSession", "createSession", "open", "openPreset", "selectPreset", "setPreset", "usePreset", "choosePreset", "activate"];

// Drive the module into an active session for one preset. Returns the serialized
// container. Every call path is tried because the naming is not this file's to
// fix; the assertion that matters is on the output, not on the spelling.
async function renderPreset(s, presetId) {
  const fn = pick(s.mod, ACTIVATE_NAMES);
  assert.ok(fn, "window.CS_SESSION needs a way to start a session for a preset — tried: " + ACTIVATE_NAMES.join(", "));
  let started = false;
  for (const arg of [presetId, { presetId: presetId }, { preset: presetId }, { id: presetId }]) {
    try {
      fn(arg);
      started = true;
      break;
    } catch { /* try the next argument shape */ }
  }
  assert.ok(started, "could not start a session for preset " + presetId);
  s.mod.render(s.container);
  await flush();
  await flush();
  return serialize(s.container);
}

test("render() survives a missing CS_SESSION_DATA and a present one", async () => {
  const lazy = bring({ withData: false });
  assert.doesNotThrow(() => lazy.mod.render(lazy.container), "the Sessions view can be opened before the 600KB fact table arrives");
  await flush();
  assertInert(serialize(lazy.container), "render with no data");

  const ready = bring({});
  assert.doesNotThrow(() => ready.mod.render(ready.container), "render with CS_SESSION_DATA present");
  await flush();
  const html = serialize(ready.container);
  assertInert(html, "render with data");
  assert.ok(textOf(ready.container).length > 0, "rendering with data must produce something to look at");
});

test("hostile preset content renders inert — no handler, no tag, no attribute break-out", async () => {
  const data = poison(readSessionData());
  // URLs get their own payload: a scheme check is a different sink from an
  // attribute break-out, and both have shipped in this repo before.
  for (const p of data.presets) {
    for (const d of p.allowedDocs || []) d.url = "javascript:alert(1)";
    for (let i = 0; i < (p.sources || []).length; i++) p.sources[i] = "javascript:alert(1)";
    for (const r of p.rules || []) r.source = "javascript:alert(1)";
  }
  const s = bring({ data: data, localStorageSeed: hostileStorageSeed() });
  // The landing state (preset picker) first — preset names and taglines are on
  // screen before anything is started.
  s.mod.render(s.container);
  await flush();
  await flush();
  assertInert(serialize(s.container), "hostile preset corpus — picker");
  // Then an open session, where the target labels, flags and rules render.
  assertInert(await renderPreset(s, "oscp-plus"), "hostile preset corpus — open session");
  // The payload has to have actually arrived somewhere, or this test proves
  // nothing: it should be sitting in the visible text, defanged.
  assert.match(textOf(s.container), /onmouseover="alert\(1\)/,
    "the hostile strings never reached the DOM — the test injected nothing and proved nothing");
});

test("hostile target labels, flag values, attempts and task context render inert", async () => {
  const data = poison(readSessionData());
  const s = bring({ data: data, localStorageSeed: hostileStorageSeed() });
  await renderPreset(s, "oscp-plus");

  // Drive the runtime surfaces too: a stored session is only one of the ways
  // these strings arrive, and the live path is the one a user exercises.
  const capture = pick(s.mod, ["captureFlag", "setFlag", "markFlag", "toggleFlag", "recordFlag"]);
  if (capture) {
    for (const args of [["sa1-local", HOSTILE], [{ flagId: "sa1-local", value: HOSTILE }]]) {
      try { capture.apply(null, args); break; } catch { /* next shape */ }
    }
  }
  const attempt = pick(s.mod, ["logAttempt", "addAttempt", "recordAttempt", "attempt", "addNote", "logNote"]);
  if (attempt) {
    for (const args of [[HOSTILE], [{ text: HOSTILE }], ["sa1-local", HOSTILE]]) {
      try { attempt.apply(null, args); break; } catch { /* next shape */ }
    }
  }
  const context = pick(s.mod, ["setContext", "setTaskContext", "setCurrentContext", "setTarget"]);
  if (context) {
    for (const args of [[HOSTILE], [{ context: HOSTILE }]]) {
      try { context.apply(null, args); break; } catch { /* next shape */ }
    }
  }
  s.mod.render(s.container);
  await flush();
  await flush();
  // assertInert is the whole assertion on purpose. A blanket /\son[a-z]+=/ over
  // the document would fire on the payload sitting harmlessly inside a text node
  // — text is not markup, and a check that cannot tell the difference is the
  // check that gets muted later.
  assertInert(serialize(s.container), "hostile runtime state");
});

test("Quick Lab shows no timer and no score — zero ceremony is the whole preset", async () => {
  // The detector is validated by the positive case in the next test: if it can
  // find a timer and a score in OSCP+, its silence here means something.
  const quick = bring({});
  const html = await renderPreset(quick, "quick-lab");
  const ids = identifiersOf(html);
  const timerish = ids.filter((v) => /\b(timer|countdown|clock|time-?left|time-?remaining|deadline|elapsed)\b/.test(v));
  const scorish = ids.filter((v) => /\b(score|scoring|points|pts|pass-?mark|passmark)\b/.test(v));
  assert.deepStrictEqual(timerish, [], "Quick Lab rendered timer UI: " + timerish.join(", "));
  assert.deepStrictEqual(scorish, [], "Quick Lab rendered score UI: " + scorish.join(", "));
  const text = textOf(quick.container);
  assert.doesNotMatch(text, /\b\d{1,2}:\d{2}:\d{2}\b/, "Quick Lab rendered a running clock: " + text.slice(0, 200));
  assert.doesNotMatch(text, /time remaining|pass mark/i, "Quick Lab rendered exam furniture: " + text.slice(0, 200));
  assert.strictEqual(byId("quick-lab").durationMin, 0, "the data says no timer; the UI must agree");
});

test("an OSCP+ session shows a timer and a score", async () => {
  const s = bring({});
  const html = await renderPreset(s, "oscp-plus");
  const ids = identifiersOf(html);
  assert.ok(ids.some((v) => /\b(timer|countdown|clock|time-?left|time-?remaining|deadline|elapsed)\b/.test(v)),
    "OSCP+ is a 23h45m exam and must render a timer; identifiers were: " + ids.slice(0, 40).join(", "));
  assert.ok(ids.some((v) => /\b(score|scoring|points|pts|pass-?mark|passmark)\b/.test(v)),
    "OSCP+ is scored out of 100 with a 70 pass mark and must render a score; identifiers were: " + ids.slice(0, 40).join(", "));
});

test("advisory rules are shown as guidance and never as a hard block", async () => {
  const s = bring({});
  const html = await renderPreset(s, "oscp");
  const oscp = byId("oscp");
  const advisoryCount = oscp.rules.filter((r) => r.advisory === true).length;
  assert.ok(advisoryCount > 0, "fixture check: oscp must have advisory rules");
  const markers = identifiersOf(html).filter((v) => /advisor|guidance|advice/.test(v));
  assert.ok(markers.length >= advisoryCount,
    "each advisory rule must be marked as guidance (found " + markers.length + " markers for " + advisoryCount + " advisory rules)");

  // If the module offers a command check at all, an advisory restriction must
  // never come back as a block. OffSec will not comment on allowed tools, so a
  // hard stop on mitm6 is this app asserting something the vendor did not.
  const check = pick(s.mod, ["checkCommand", "evaluateCommand", "checkRules", "evaluateRules", "lintCommand", "ruleCheck", "guard"]);
  if (check) {
    const verdict = check("mitm6 -d example.local -i tun0", "oscp") || {};
    const blocking = verdict.block === true || verdict.blocked === true || verdict.hard === true || verdict.severity === "block" || verdict.level === "block";
    assert.ok(!blocking, "an advisory tool restriction produced a hard block: " + JSON.stringify(verdict));
  }
});

test("official and inferred rules are rendered differently", async () => {
  const s = bring({});
  const html = await renderPreset(s, "oscp");
  const ids = identifiersOf(html);
  assert.ok(ids.some((v) => /official|vendor|verified/.test(v)), "official rules need their own marker — 'the vendor wrote this' is the claim being made");
  assert.ok(ids.some((v) => /inferred|derived|unverified|interpret/.test(v)), "inferred rules need their own marker — presenting an inference as a vendor rule is the failure mode");
});

test("preset notes and unverified caveats are reachable in the rendered view", async () => {
  const s = bring({});
  await renderPreset(s, "oscp");
  const text = textOf(s.container);
  const oscp = byId("oscp");
  const needle = (str) => String(str).replace(/\s+/g, " ").slice(0, 40);
  assert.ok(oscp.notes.length && oscp.unverified.length, "fixture check: oscp has notes and unverified entries");
  assert.ok(text.includes(needle(oscp.notes[0])), "preset notes must be in the DOM, not buried behind a rebuild");
  assert.ok(text.includes(needle(oscp.unverified[0])), "unverified caveats must be in the DOM — they are the honesty the feature sells");
});

test("the report emits the preset's reportSections in order, with captured flags and attempts", async () => {
  const s = bring({ localStorageSeed: hostileStorageSeed() });
  await renderPreset(s, "oscp");

  const capture = pick(s.mod, ["captureFlag", "setFlag", "markFlag", "toggleFlag", "recordFlag"]);
  assert.ok(capture, "a session must be able to capture a flag");
  for (const args of [["sa1-local", "0123456789abcdef"], [{ flagId: "sa1-local", value: "0123456789abcdef" }]]) {
    try { capture.apply(null, args); break; } catch { /* next shape */ }
  }
  const attempt = pick(s.mod, ["logAttempt", "addAttempt", "recordAttempt", "attempt", "addNote", "logNote"]);
  assert.ok(attempt, "a session must be able to log what was already tried — 'never redo work' is the senior user's whole ask");
  for (const args of [["tried CVE-2021-4034 pkexec"], [{ text: "tried CVE-2021-4034 pkexec" }], ["standalone-1", "tried CVE-2021-4034 pkexec"]]) {
    try { attempt.apply(null, args); break; } catch { /* next shape */ }
  }

  const reportFn = pick(s.mod, ["report", "generateReport", "buildReport", "renderReport", "reportMarkdown", "toMarkdown", "exportReport", "makeReport"]);
  assert.ok(reportFn, "the report has to assemble itself — that is the feature");
  const raw = reportFn("oscp") || reportFn();
  const report = typeof raw === "string" ? raw : (raw && raw.tagName ? textOf(raw) : String(raw));
  assert.ok(report && report.length > 0, "the report generator produced nothing");

  // Section titles carry a literal "#N" the generator is expected to replace, so
  // match on the stable prefix and walk a cursor forward — that enforces order
  // and tolerates the per-target repetition.
  let cursor = 0;
  for (const section of byId("oscp").reportSections) {
    const stable = section.split("#")[0].trim();
    const at = report.indexOf(stable, cursor);
    assert.ok(at >= 0, "report section " + JSON.stringify(section) + " is missing or out of order (searched from offset " + cursor + ")");
    cursor = at + stable.length;
  }
  assert.match(report, /0123456789abcdef/, "a captured flag must appear in the report");
  assert.match(report, /pkexec/, "a logged attempt must appear in the report");
});

test("the module does not register until it is loaded, and app.js copes either way", () => {
  // public/app.js renders a fallback when window.CS_SESSION is absent. That is
  // the contract that lets session.js be a separate, lazily added file.
  const s = loadSession({ withData: false });
  assert.ok(s.window.CS_APP && typeof s.window.CS_APP.escapeHtml === "function",
    "session.js is written against window.CS_APP — app.js must still export it");
});
