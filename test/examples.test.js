"use strict";
// The worked example in examples/.
//
// examples/oscp-lab.json is an importable backup: one solved box and the OSCP
// session that graded it. The two .md files beside it are not hand-written —
// they are what public/app.js and public/session.js actually produce from that
// bundle, which is the only reason a reader can trust them as "what this tool
// gives you". A worked example that drifts from the generator is worse than no
// example, because it is a promise the product no longer keeps.
//
// So this file regenerates both reports from the bundle and compares. Run it
// with UPDATE_EXAMPLES=1 to rewrite the .md files after an intentional change
// to a generator — that is the supported way to move them, and the diff is then
// reviewable rather than hand-typed.
//
// It also proves the bundle is importable: every validator server.js gates
// /api/import on is applied here, because an example that the product would
// reject is an example nobody can run.

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const { loadApp, PUBLIC_DIR } = require("./helpers/load-app.js");
const { readSessionData } = require("./helpers/load-session.js");

const EXAMPLES = path.join(__dirname, "..", "examples");
const BUNDLE = JSON.parse(fs.readFileSync(path.join(EXAMPLES, "oscp-lab.json"), "utf8"));
const UPDATE = process.env.UPDATE_EXAMPLES === "1";

// Dates are rendered with toLocaleString(), so the bytes depend on the reader's
// timezone and locale. Comparing them would make this test a report on where CI
// is hosted. Everything that is NOT a date — the tables, the commands, the
// flags, the section order, the attempts and their reasons — is compared
// exactly, and that is the whole substance of a report.
//
// The leading boundary is `(?<![0-9A-Za-z])`, NOT `\b`, and that is the whole
// reason this test worked locally and failed on every CI runner for six commits.
// The timeline renders each timestamp in markdown italics — `_14.03.2026
// 12:15:00_` — and `_` is a word character, so `\b` never matched after it.
// Neither side got scrubbed, and the committed file (Turkish locale, UTC+3)
// could only ever equal a run on a machine with the same locale AND the same
// timezone: on ubuntu-latest the generator produces `_3/14/2026, 9:15:00 AM_`.
const DATE = /(?<![0-9A-Za-z])\d{1,4}[./-]\d{1,2}[./-]\d{1,4}(?:,? \d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)?/g;
const undated = (s) => s.replace(DATE, "<date>");

function boot() {
  const env = loadApp({});
  env.app.setMachines(JSON.parse(JSON.stringify(BUNDLE.machines)));
  env.window.CS_SESSION_DATA = readSessionData();
  env.window.CS_SESSION = undefined;
  vm.runInThisContext(fs.readFileSync(path.join(PUBLIC_DIR, "session.js"), "utf8"), { filename: "session.js" });
  return { app: env.app, session: env.window.CS_SESSION, window: env.window };
}

function compare(name, produced) {
  const file = path.join(EXAMPLES, name);
  if (UPDATE) {
    fs.writeFileSync(file, produced);
    return;
  }
  assert.ok(fs.existsSync(file), "examples/" + name + " is missing — run UPDATE_EXAMPLES=1 node --test test/examples.test.js");
  const onDisk = fs.readFileSync(file, "utf8");
  assert.strictEqual(undated(produced), undated(onDisk),
    "examples/" + name + " no longer matches what the generator produces from examples/oscp-lab.json.\n" +
    "If the generator changed on purpose, refresh it with:  UPDATE_EXAMPLES=1 node --test test/examples.test.js");
}

// ───────────────── the bundle is importable ─────────────────

test("the example bundle is exactly what POST /api/import accepts", () => {
  // These are server.js's own gates, restated. If one of them moves, this test
  // says so before a reader discovers it by having their import rejected.
  assert.ok(BUNDLE && typeof BUNDLE === "object" && !Array.isArray(BUNDLE), "the bundle must be an object, not a bare category array");
  assert.ok(Array.isArray(BUNDLE.machines), "machines must be an array");
  for (const m of BUNDLE.machines) {
    assert.ok(m && typeof m === "object" && !Array.isArray(m));
    assert.strictEqual(typeof m.id, "string");
    assert.strictEqual(typeof m.name, "string");
    assert.strictEqual(typeof m.status, "string");
    assert.strictEqual(typeof m.difficulty, "string");
    // sanitizeImportedIds() regenerates an id that could carry markup; the
    // example should not be the thing that exercises that path.
    assert.match(m.id, /^[A-Za-z0-9_-]+$/, "machine id " + JSON.stringify(m.id) + " would be regenerated on import");
  }
  assert.ok(BUNDLE.exam && typeof BUNDLE.exam === "object" && !Array.isArray(BUNDLE.exam), "exam must be a plain object");

  // And it must not carry `categories`: importing the example is meant to add a
  // box and a session, not replace the reader's 5,040 commands.
  assert.strictEqual(BUNDLE.categories, undefined,
    "the example must not ship a categories array — importing it would overwrite the reader's whole corpus");
  assert.strictEqual(BUNDLE.notes, undefined, "same for notes");
});

test("nothing in the example gets silently clamped on the way in", () => {
  // app.js clamps an unknown status or difficulty back to a default rather than
  // rejecting it, because an imported machine must never be able to put an
  // arbitrary string into a class name. That is right for hostile input and
  // wrong for a worked example: "rooted" read as "Not started" in the first cut
  // of this file, and the report said so without a word of complaint.
  const STATUSES = ["not-started", "in-progress", "owned", "reported"];
  const DIFFS = ["", "easy", "medium", "hard", "insane"];
  const { app } = boot();
  for (const m of BUNDLE.machines) {
    assert.ok(STATUSES.includes(m.status),
      "machine " + m.name + ": status " + JSON.stringify(m.status) + " is not one of app.js's MACHINE_STATUSES and would be clamped to not-started");
    assert.ok(DIFFS.includes(String(m.difficulty).toLowerCase()),
      "machine " + m.name + ": difficulty " + JSON.stringify(m.difficulty) + " is not one of MACHINE_DIFFS and would render as an em dash");
    // And the report agrees, which is the only place the reader sees it.
    const shown = app.machineToMarkdown(m).match(/\*\*Status:\*\* ([^·]+)/)[1].trim();
    assert.notStrictEqual(shown, app.t("stNotStarted"),
      "machine " + m.name + " is a solved box whose report says " + JSON.stringify(shown));
  }
});

test("the bundle carries no real secret and no routable target", () => {
  const text = JSON.stringify(BUNDLE);
  const ips = text.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g) || [];
  for (const ip of ips) {
    const [a, b] = ip.split(".").map(Number);
    const priv = a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a === 127;
    assert.ok(priv, "example contains the routable address " + ip + " — a worked example must never point at a host someone does not own");
  }
  assert.ok(ips.length > 0, "fixture check: the example does name a lab address");
});

// ───────────────── the reports are what the product produces ─────────────────

test("examples/sentinel-machine.md is what machineToMarkdown() produces", () => {
  const { app } = boot();
  const md = app.machineToMarkdown(BUNDLE.machines[0]);
  assert.ok(md.includes("Sentinel"), "fixture check: the generator ran over the example box");
  compare("sentinel-machine.md", md);
});

test("examples/oscp-session-report.md is what buildReportMarkdown() produces", () => {
  const { session } = boot();
  assert.ok(session && typeof session.buildReportMarkdown === "function",
    "session.js must export buildReportMarkdown — the example is generated through it, not beside it");
  const doc = BUNDLE.exam;
  const s = doc.sessions[0];
  const preset = readSessionData().presets.find((p) => p.id === s.presetId);
  assert.ok(preset, "the example session names preset " + JSON.stringify(s.presetId) + ", which session-data.js does not ship");
  compare("oscp-session-report.md", session.buildReportMarkdown(s, preset));
});

// ───────────────── the example tells the truth about itself ─────────────────

test("the session's score is the one the report claims, and it clears the pass mark", () => {
  const { session } = boot();
  const s = BUNDLE.exam.sessions[0];
  const preset = readSessionData().presets.find((p) => p.id === s.presetId);
  const score = session.sessionScore(s);
  // 80, and the route is the lesson: the three standalones are worth 60 between
  // them and the AD set is 40 as one all-or-nothing block, so 70 cannot be
  // reached from the standalones alone. The example takes the AD chain first.
  assert.strictEqual(score.earned, 80, "the worked example is written as an 80 — the AD chain plus two of the three standalones");
  assert.ok(score.earned >= preset.passMark,
    "an example that fails its own exam teaches the wrong lesson: " + score.earned + " against a pass mark of " + preset.passMark);
  assert.strictEqual(score.possible, preset.totalPoints,
    "the session's flag points must add up to the preset's published total (" + preset.totalPoints + ")");
});

test("the box the session points at is the box in the bundle", () => {
  const s = BUNDLE.exam.sessions[0];
  const ids = new Set(BUNDLE.machines.map((m) => m.id));
  const linked = s.targets.filter((t) => t.machineId);
  assert.ok(linked.length > 0,
    "the point of the example is the LOOP — a target with no machine behind it shows the session and the workbench as two separate features");
  for (const t of linked) {
    assert.ok(ids.has(t.machineId), "target " + t.key + " points at machine " + t.machineId + ", which the bundle does not contain");
  }
});

test("the nmap paste reproduces the services the bundle already holds", () => {
  // The file is there so a reader can paste it into Import nmap and watch the
  // table fill in. If the parser and the bundle disagree, the walkthrough in
  // examples/README.md is telling them something that will not happen.
  const { app } = boot();
  const raw = fs.readFileSync(path.join(EXAMPLES, "sentinel-nmap.txt"), "utf8");
  const parsed = app.parseNmapOutput(raw);
  const stored = app.normalizeServices(BUNDLE.machines[0].services);
  const key = (s) => [s.port, s.proto, s.state, s.name, s.version].join("|");
  assert.deepStrictEqual(parsed.map(key).sort(), stored.map(key).sort(),
    "pasting examples/sentinel-nmap.txt would not produce the services table in examples/oscp-lab.json");
});
