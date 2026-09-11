"use strict";
// cheapestRoute — "what is the least work that still gets me over the line".
//
// This is the one screen written for a person sitting an exam with a clock
// running, and it is the one place in the product where a wrong answer costs the
// user the exam rather than a few minutes. At hour 14 of an OSCP the candidate
// reads the route, picks the machine, and spends the rest of the day on it. If
// the route is not achievable they find that out at hour 22.
//
// It shipped with ZERO tests and a reconstruction bug: a 1-D rolling knapsack
// whose parent pointers were read after later items had overwritten the cells
// they pointed at, so walking back handed the same flag over twice —
// cheapestRoute([10,10,20], 40) answered "20 + 20", a route made of one flag
// counted twice. The bug is invisible to any test that only checks the TOTAL,
// which is exactly why the sweep below asserts on the PICKS: their identity,
// their membership in the pool, and that their own points add up to the number
// printed beside them.
//
// Nothing here uses Math.random(). A property test that fails one run in fifty
// on someone else's machine is not a test, it is a rumour — the pools are drawn
// from a seeded 32-bit PRNG so a failure message reproduces exactly.

const test = require("node:test");
const assert = require("node:assert");
const { readSessionData, loadSession, MODULE_FILE } = require("./helpers/load-session.js");

const DATA = readSessionData();

// One load for the whole file: loadSession() evaluates app.js + session.js, and
// the derivations under test are pure, so there is nothing to isolate between
// cases. The contract assertions live in mod() rather than at module scope so a
// missing session.js reports as a failing test instead of an import crash.
const SESSION = loadSession({});
function mod() {
  assert.ok(!SESSION.missing, "public/session.js has not landed yet (expected at " + MODULE_FILE + ")");
  assert.ok(!SESSION.loadError, "session.js threw while loading: " + (SESSION.loadError && SESSION.loadError.stack));
  assert.ok(SESSION.mod, "session.js must register window.CS_SESSION");
  for (const name of ["cheapestRoute", "routeForSession", "scoreMode", "sessionScore"]) {
    assert.strictEqual(typeof SESSION.mod[name], "function", "window.CS_SESSION." + name + " is part of the exported surface");
  }
  return SESSION.mod;
}

// A pool shaped exactly like the one routeForSession builds: one object per
// uncaptured flag. Distinct objects with identical points are the whole point —
// that is the case the old reconstruction collapsed into one.
function pool(points) {
  return points.map((p, i) => ({ points: p, label: "flag-" + i + " (" + p + ")", target: "target-" + i }));
}

// mulberry32. Seeded, 32-bit, and deterministic across Node versions and
// platforms, so "seeded case #1873" in a failure message is a real address.
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The invariants every answer must satisfy, whatever route it chose. Written
// once because they are the contract, not one test's expectations: a route is
// only useful if the candidate can actually walk it.
function assertRouteSound(r, poolIn, need, where) {
  assert.ok(r && typeof r === "object", where + ": cheapestRoute returned " + JSON.stringify(r));

  // Non-positive flags are not a route to anywhere; the solver drops them and so
  // does the arithmetic here.
  const scoring = poolIn.filter((f) => f.points > 0);
  const total = scoring.reduce((a, f) => a + f.points, 0);

  if (need <= 0) {
    assert.strictEqual(r.reached, true, where + ": nothing left to earn must report reached");
    assert.deepStrictEqual(r.fewest, [], where + ": reached means an empty route, not a route");
    assert.deepStrictEqual(r.least, [], where + ": reached means an empty route, not a route");
    return;
  }
  if (total < need) {
    // The honest answer to "you cannot get there" is the shortfall, never a
    // route — a route that does not reach the pass mark is worse than silence.
    assert.strictEqual(r.reached, false, where + ": an unreachable need must not report reached");
    assert.strictEqual(r.short, need - total, where + ": shortfall must be need - everything still on the board");
    assert.strictEqual(r.fewest, null, where + ": no route exists, so none may be offered");
    assert.strictEqual(r.least, null, where + ": no route exists, so none may be offered");
    return;
  }

  assertRouteArithmetic(r, need, where);
  for (const key of ["fewest", "least"]) {
    for (const f of r[key]) {
      assert.ok(poolIn.indexOf(f) !== -1, where + ": " + key + " invented a flag that is not on the board: " + JSON.stringify(f));
      assert.ok(f.points > 0, where + ": " + key + " routed through a 0-point flag: " + JSON.stringify(f));
    }
  }
}

// The half of the contract that holds for any route, however the caller obtained
// it. routeForSession hands back flattened copies rather than the caller's own
// objects, so it can be held to these but not to pool membership by identity.
function assertRouteArithmetic(r, need, where) {
  for (const key of ["fewest", "least"]) {
    const picks = r[key];
    assert.ok(Array.isArray(picks) && picks.length > 0, where + ": " + key + " must be a non-empty route, got " + JSON.stringify(picks));

    // THE historical bug. Object identity, not points equality: two different
    // 10-point flags are a legitimate route, the same 10-point flag twice is not.
    assert.strictEqual(new Set(picks).size, picks.length,
      where + ": " + key + " listed the same flag twice — " + picks.map((f) => f.label).join(" + "));

    // The number printed beside the route has to be the route's own sum, or the
    // candidate is budgeting against a figure the picks do not support.
    const sum = picks.reduce((a, f) => a + f.points, 0);
    assert.strictEqual(sum, r[key + "Points"], where + ": " + key + "Points says " + r[key + "Points"] + " but the picks add to " + sum);
    assert.ok(sum >= need, where + ": " + key + " reaches only " + sum + " against a need of " + need);
  }

  assert.ok(r.fewest.length <= r.least.length, where + ": `fewest` is not the fewer route (" + r.fewest.length + " vs " + r.least.length + ")");
  assert.ok(r.leastPoints <= r.fewestPoints, where + ": `least` overshoots further than `fewest` (" + r.leastPoints + " vs " + r.fewestPoints + ")");
  assert.strictEqual(r.same, r.fewestPoints === r.leastPoints, where + ": `same` must say whether the two routes land on the same total");
  assert.strictEqual(typeof r.approx, "boolean", where + ": every route must declare whether it is exact");
}

// ───────────────────────── the historical repro ─────────────────────────

test("cheapestRoute([10,10,20], 40) returns all three flags and never the same one twice", () => {
  const { cheapestRoute } = mod();
  const p = pool([10, 10, 20]);
  const r = cheapestRoute(p, 40);

  assertRouteSound(r, p, 40, "the 10/10/20 repro");
  for (const key of ["fewest", "least"]) {
    const picks = r[key];
    // 40 out of a 40-point board has exactly one solution: everything.
    assert.strictEqual(picks.length, 3, key + " must take all three flags, got " + picks.map((f) => f.label).join(" + "));
    assert.deepStrictEqual(new Set(picks), new Set(p), key + " did not return the three flags it was given");
    assert.strictEqual(r[key + "Points"], 40, key + "Points must be 40");
  }
  assert.strictEqual(r.approx, false, "three flags is nowhere near the exact-solve cap");
  assert.strictEqual(r.same, true, "there is only one route, so the two answers are the same route");
});

test("the same shape at every scale — duplicate point values never collapse into one flag", () => {
  const { cheapestRoute } = mod();
  const cases = [
    { points: [10, 10], need: 20 },
    { points: [10, 10, 10], need: 30 },
    { points: [10, 10, 20], need: 40 },
    { points: [5, 5, 5, 5], need: 20 },
    { points: [20, 20, 10, 10, 10, 10], need: 80 },
    { points: [1, 1, 1, 1, 1, 1, 1], need: 7 },
  ];
  for (const c of cases) {
    const p = pool(c.points);
    const r = cheapestRoute(p, c.need);
    const where = "pool [" + c.points.join(",") + "] need " + c.need;
    assertRouteSound(r, p, c.need, where);
    // Each of these needs the WHOLE board, so a duplicated pick would show up as
    // a short route with the right total — the exact shape of the old bug.
    assert.strictEqual(r.fewest.length, c.points.length, where + ": route is " + r.fewest.length + " flags, the board has " + c.points.length);
  }
});

// ───────────────────────── the property sweep ─────────────────────────

test("4000 seeded pools: no duplicate pick, every pick from the board, points add up, total clears the need", () => {
  const { cheapestRoute } = mod();
  const rand = rng(0x5eed1234);
  const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

  let reached = 0, unreachable = 0, routed = 0, withZeros = 0;
  for (let i = 0; i < 4000; i++) {
    const n = int(1, 18);
    const points = [];
    for (let k = 0; k < n; k++) {
      // ~1 in 7 flags is worth nothing: OSEP-style boards carry flags the
      // candidate has not been told the value of yet, and they must never be
      // routed through.
      points.push(rand() < 0.14 ? 0 : int(1, 40));
    }
    if (points.some((v) => v === 0)) withZeros += 1;
    const total = points.reduce((a, b) => a + b, 0);
    const p = pool(points);
    // Draw the need around the total so most cases land in the interesting band
    // and the sweep still walks off both ends of it.
    const need = int(-5, total + 10);

    const r = cheapestRoute(p, need);
    assertRouteSound(r, p, need, "seeded case #" + i + " pool=[" + points.join(",") + "] need=" + need);

    if (need <= 0) reached += 1;
    else if (r.fewest === null) unreachable += 1;
    else routed += 1;
  }

  // A sweep that only ever hit one branch would pass while proving nothing.
  assert.ok(routed > 2000, "the sweep produced only " + routed + " real routes — it is not exercising the solver");
  assert.ok(unreachable > 50, "the sweep never asked for something impossible (" + unreachable + " cases)");
  assert.ok(reached > 20, "the sweep never asked for a need that was already met (" + reached + " cases)");
  assert.ok(withZeros > 1000, "the sweep barely used 0-point flags (" + withZeros + " pools)");
});

// ───────────────────────── against brute force ─────────────────────────

// Every subset of a small pool, reduced to the two answers the UI prints.
function bruteForce(points, need) {
  const n = points.length;
  let minCount = Infinity, minSum = Infinity, countAtMinSum = Infinity, sumAtMinCount = Infinity;
  for (let mask = 0; mask < (1 << n); mask++) {
    let sum = 0, count = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) { sum += points[i]; count += 1; }
    }
    if (sum < need) continue;
    if (count < minCount || (count === minCount && sum < sumAtMinCount)) { minCount = count; sumAtMinCount = sum; }
    if (sum < minSum || (sum === minSum && count < countAtMinSum)) { minSum = sum; countAtMinSum = count; }
  }
  return minCount === Infinity ? null : { minCount, minSum, countAtMinSum, sumAtMinCount };
}

test("`fewest` really has the fewest flags and `least` really has the smallest overshoot — checked against every subset", () => {
  const { cheapestRoute } = mod();
  const rand = rng(0xb0a7cafe);
  const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

  let checked = 0;
  for (let i = 0; i < 700; i++) {
    const n = int(1, 11);
    const points = [];
    for (let k = 0; k < n; k++) points.push(int(1, 25));
    const total = points.reduce((a, b) => a + b, 0);
    const need = int(1, total + 4);
    const where = "brute case #" + i + " pool=[" + points.join(",") + "] need=" + need;

    const r = cheapestRoute(pool(points), need);
    const best = bruteForce(points, need);
    if (!best) {
      assert.strictEqual(r.fewest, null, where + ": no subset reaches the need, so no route may be offered");
      continue;
    }
    checked += 1;
    assert.strictEqual(r.fewest.length, best.minCount,
      where + ": `fewest` used " + r.fewest.length + " flags, a " + best.minCount + "-flag route exists");
    assert.strictEqual(r.leastPoints, best.minSum,
      where + ": `least` landed on " + r.leastPoints + ", the smallest reachable total at or above the need is " + best.minSum);
    // The fewest-flag route must also be a real total, not the minimum count
    // pinned onto some other sum.
    assert.ok(r.fewestPoints >= need, where + ": `fewest` does not reach the need");
  }
  assert.ok(checked > 400, "only " + checked + " of the brute-force cases were reachable — widen the draw");
});

// ───────────────────────── the real board ─────────────────────────

// The shipped OSCP+ board, as a session with nothing captured yet. routeForSession
// reads session.targets, so this is the real fact table driving the real solver.
function freshBoard(preset) {
  return {
    id: "s-test",
    presetId: preset.id,
    kind: preset.kind,
    targets: (preset.targets || []).map((t) => ({
      key: t.key,
      label: t.label,
      kind: t.kind,
      flags: (t.flags || []).map((f) => ({ id: f.id, label: f.label, points: f.points })),
      captures: {},
    })),
  };
}

// Mark the first uncaptured flag whose target-and-label match the routed pick.
// routeForSession flattens flags to { points, label, target } with no id, so
// that pair is the only handle a caller has — and walking the route back onto
// the board is the only way to prove the route is walkable at all.
function captureRouted(board, pick) {
  for (const t of board.targets) {
    if (t.label !== pick.target) continue;
    for (const f of t.flags) {
      if (f.label === pick.label || f.points !== pick.points) continue;
      if (!t.captures[f.id]) { t.captures[f.id] = { at: 1 }; return true; }
    }
    for (const f of t.flags) {
      if (f.label !== pick.label) continue;
      if (!t.captures[f.id]) { t.captures[f.id] = { at: 1 }; return true; }
    }
  }
  return false;
}

test("the real OSCP+ board with nothing captured returns a route a candidate can actually walk", () => {
  const { routeForSession, sessionScore, scoreMode } = mod();
  const preset = DATA.presets.find((p) => p.id === "oscp-plus");
  assert.ok(preset, "the oscp-plus preset must ship — it is the certification persona's board");
  assert.strictEqual(scoreMode(preset), "denominator", "OSCP+ publishes both a total and a pass mark");

  const board = freshBoard(preset);
  const start = sessionScore(board);
  assert.strictEqual(start.earned, 0, "nothing is captured yet");
  assert.strictEqual(start.possible, 100, "the OSCP+ board is worth 100 points");

  const r = routeForSession(board, preset);
  assert.ok(r, "a denominator preset must produce a route");
  assert.strictEqual(r.need, 70, "70 of 100 is the published pass mark");
  assert.strictEqual(r.approx, false, "a nine-flag board is solved exactly or not at all");
  assertRouteArithmetic(r, 70, "OSCP+ from zero");

  // 20 (the DC) + five 10s is the shortest way to 70 on this board.
  assert.strictEqual(r.fewestPoints, 70, "the board can land exactly on 70, so there is no reason to overshoot");
  assert.strictEqual(r.leastPoints, 70, "and the smallest total at or above 70 is 70");
  assert.strictEqual(r.fewest.length, 6, "70 from 8×10 + 1×20 takes six flags: " + r.fewest.map((f) => f.points).join(" + "));
  assert.ok(r.fewest.some((f) => f.points === 20), "the 20-point domain controller is what makes six flags possible");

  // Walk it. This is the assertion that makes the route real rather than
  // arithmetically plausible: capture exactly what it named and the score has to
  // clear the pass mark, with nothing left to do.
  for (const pick of r.fewest) {
    assert.ok(captureRouted(board, pick), "the route named a flag that is not on the board: " + JSON.stringify(pick));
  }
  const after = sessionScore(board);
  assert.strictEqual(after.earned, 70, "walking the route earned " + after.earned + ", not the 70 it promised");
  assert.strictEqual(after.capturedFlags, 6, "walking the route captured " + after.capturedFlags + " flags, not the 6 it listed");
  assert.ok(after.earned >= preset.passMark, "the route did not reach the pass mark");

  const done = routeForSession(board, preset);
  assert.strictEqual(done.reached, true, "with the pass mark met there is nothing left to route");
  assert.deepStrictEqual(done.fewest, [], "a met pass mark means an empty route");
});

test("a partly-captured OSCP+ board routes only through what is still open", () => {
  const { routeForSession, sessionScore } = mod();
  const preset = DATA.presets.find((p) => p.id === "oscp-plus");
  const board = freshBoard(preset);

  // Both flags on stand-alone #1, plus the AD entry point: 30 points banked.
  board.targets[0].captures = { "sa1-local": { at: 1 }, "sa1-proof": { at: 1 } };
  const ad1 = board.targets.find((t) => t.key === "ad-machine-1");
  ad1.captures = { "ad1-proof": { at: 1 } };

  assert.strictEqual(sessionScore(board).earned, 30);
  const r = routeForSession(board, preset);
  assert.strictEqual(r.need, 40, "70 minus the 30 already banked");
  assert.strictEqual(r.fewestPoints, 40, "the remaining 70 points can land exactly on 40");
  assert.strictEqual(r.fewest.length, 3, "20 + 10 + 10 is the shortest way to 40 from what is left");

  assertRouteArithmetic(r, 40, "OSCP+ with 30 banked");

  // Stand-alone #1 and AD machine #1 have nothing left on them. A route that
  // names either is sending the candidate back to a box they have already rooted.
  const done = new Set([board.targets[0].label, ad1.label]);
  for (const pick of r.fewest.concat(r.least)) {
    assert.ok(!done.has(pick.target),
      "the route sent the candidate back to a fully-captured target: " + pick.target + " / " + pick.label);
  }

  // And it is walkable on the board as it now stands.
  for (const pick of r.fewest) {
    assert.ok(captureRouted(board, pick), "the route named a flag that is not open on the board: " + JSON.stringify(pick));
  }
  assert.strictEqual(sessionScore(board).earned, 70, "walking the route from 30 must land on 70");
});

test("routeForSession stays silent for presets that do not publish a points denominator", () => {
  const { routeForSession, scoreMode } = mod();
  assert.strictEqual(routeForSession(null, DATA.presets[0]), null, "no session, no route");
  assert.strictEqual(routeForSession({ targets: [] }, null), null, "no preset, no route");

  let silent = 0;
  for (const preset of DATA.presets) {
    if (scoreMode(preset) === "denominator" && preset.passMark > 0) continue;
    silent += 1;
    assert.strictEqual(routeForSession(freshBoard(preset), preset), null,
      "preset " + preset.id + " has no published points split, so a route to a pass mark would be invented");
  }
  assert.ok(silent > 0, "every preset was a denominator preset — this test is checking nothing");
});

// ───────────────────────── the edges ─────────────────────────

test("nothing left to earn and nothing that can be earned are different answers", () => {
  const { cheapestRoute } = mod();
  const p = pool([10, 10, 20]);

  for (const need of [0, -1, -40]) {
    const r = cheapestRoute(p, need);
    assert.strictEqual(r.reached, true, "need " + need + " is already met");
    assert.deepStrictEqual(r.fewest, [], "need " + need + " must route nowhere");
    assert.deepStrictEqual(r.least, [], "need " + need + " must route nowhere");
  }

  const impossible = cheapestRoute(p, 100);
  assert.strictEqual(impossible.reached, false);
  assert.strictEqual(impossible.short, 60, "the board holds 40 against a need of 100");
  assert.strictEqual(impossible.fewest, null, "an impossible need must report the shortfall, not a route");
  assert.strictEqual(impossible.least, null, "an impossible need must report the shortfall, not a route");

  const empty = cheapestRoute([], 25);
  assert.strictEqual(empty.short, 25, "an empty board is 25 short of 25");
  assert.strictEqual(empty.fewest, null);

  // A board of flags nobody has scored yet is an empty board as far as the route
  // is concerned — it must not claim those are worth walking.
  const zeros = cheapestRoute(pool([0, 0, 0]), 25);
  assert.strictEqual(zeros.short, 25, "0-point flags add nothing to reach with");
  assert.strictEqual(zeros.fewest, null);

  // Exactly on the line, and one point over it.
  const exact = cheapestRoute(p, 40);
  assert.strictEqual(exact.fewestPoints, 40, "a need equal to the whole board is reachable");
  assert.strictEqual(cheapestRoute(p, 41).short, 1, "one point past the board is one point short");
});

test("undefined and null pools are answered, not thrown at", () => {
  const { cheapestRoute } = mod();
  // routeForSession always passes an array, but the export is public and the
  // view calls it from a render path — a throw here blanks the whole screen.
  assert.doesNotThrow(() => cheapestRoute(undefined, 10));
  assert.doesNotThrow(() => cheapestRoute(null, 10));
  assert.strictEqual(cheapestRoute(undefined, 10).short, 10);
  assert.strictEqual(cheapestRoute(null, 0).reached, true);
});

// ───────────────────────── the approximate path ─────────────────────────

test("a board past the exact-solve cap says approx: true and still returns an achievable route", () => {
  const { cheapestRoute } = mod();

  // Over the flag-count cap: 80 flags on a big CTF board.
  const many = pool(new Array(80).fill(7));
  const rMany = cheapestRoute(many, 100);
  assert.strictEqual(rMany.approx, true, "the greedy fallback must never be presented as an exact answer");
  assertRouteSound(rMany, many, 100, "80-flag board");
  assert.ok(rMany.fewestPoints >= 100, "the fallback route still has to reach the need");

  // Over the points cap: a scoreboard with four-figure challenges.
  const heavy = pool(new Array(40).fill(200));
  const rHeavy = cheapestRoute(heavy, 1000);
  assert.strictEqual(rHeavy.approx, true, "an 8000-point board is past the exact cap");
  assertRouteSound(rHeavy, heavy, 1000, "8000-point board");
  assert.strictEqual(rHeavy.fewestPoints, 1000, "five 200s is exactly 1000");

  // Right below both caps the answer is exact, so `approx` is a real signal and
  // not a flag that is always on for large-ish boards.
  const justUnder = pool(new Array(64).fill(7));
  const rUnder = cheapestRoute(justUnder, 100);
  assert.strictEqual(rUnder.approx, false, "64 flags totalling 448 is inside the exact cap");
  assertRouteSound(rUnder, justUnder, 100, "64-flag board");
  assert.strictEqual(rUnder.fewestPoints, 105, "15 × 7 is the least a 7-point board can overshoot 100 by");

  // Whatever `approx` says, the route is walkable: seeded boards on both sides
  // of the cap, all held to the same invariants.
  const rand = rng(0xfa11bac);
  const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
  let sawApprox = 0, sawExact = 0;
  for (let i = 0; i < 300; i++) {
    const n = int(50, 90);
    const points = [];
    for (let k = 0; k < n; k++) points.push(int(1, 150));
    const p = pool(points);
    const total = points.reduce((a, b) => a + b, 0);
    const need = int(1, total);
    const r = cheapestRoute(p, need);
    assertRouteSound(r, p, need, "cap case #" + i + " n=" + n + " total=" + total + " need=" + need);
    if (r.approx) sawApprox += 1; else sawExact += 1;
  }
  assert.ok(sawApprox > 0 && sawExact > 0, "the cap sweep landed on one side only (approx " + sawApprox + ", exact " + sawExact + ")");
});
