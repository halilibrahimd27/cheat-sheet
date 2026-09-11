"use strict";
// The selector engine in test/helpers/dom.js.
//
// WHY a test for a test helper — the same argument as dom-harness.test.js, one
// layer deeper. The stub used to answer querySelector() by INVENTING an element
// for whatever selector it was handed and caching it, and querySelectorAll() by
// returning [] unconditionally. Under that stub:
//
//     assert.ok(container.querySelector(".totally-made-up"))   // passed
//     assert.strictEqual(container.querySelectorAll(".row").length, 0)  // passed
//
// so every "the view renders X" assertion written the obvious way asserted only
// that the harness is willing to make things up. No test in this suite had
// written one yet, which is luck rather than design — the moment the Sessions
// keyboard work needed "does `c` focus [data-session-capture=open]", the naive
// version of that test would have passed against a handler that focused nothing.
//
// The engine is therefore load-bearing for test/session-keys.test.js, and these
// cases pin both halves of its contract: it finds what is there, and — the half
// that actually matters — it finds NOTHING when nothing is there.

const test = require("node:test");
const assert = require("node:assert");
const { installBrowserGlobals } = require("./helpers/dom.js");
const { serialize, assertInert } = require("./helpers/serialize-dom.js");

const env = installBrowserGlobals({});
const doc = env.document;

function el(tag, attrs, kids) {
  const n = doc.createElement(tag);
  for (const k of Object.keys(attrs || {})) {
    if (k === "class") n.className = attrs[k];
    else if (k === "text") n.textContent = attrs[k];
    else n.setAttribute(k, attrs[k]);
  }
  (kids || []).forEach((c) => n.appendChild(c));
  return n;
}

// One fixture shaped like the trees this app actually builds.
function fixture() {
  return el("div", { class: "panel", id: "root" }, [
    el("div", { class: "machine-section", "data-session-queue": "1" }, [
      el("h3", { text: "Enumeration queue" }),
      el("div", { class: "checklist-hint" }, [el("code", { text: "nmap -sCV 10.10.10.5" })]),
    ]),
    el("div", { class: "checklist-phase current" }, [
      el("div", { class: "checklist-hint" }, [el("code", { text: "sudo openvpn exam.ovpn" })]),
      el("div", { class: "checklist-hint" }, [el("code", { text: "ip addr show tun0" })]),
      el("input", { class: "checklist-add-input", placeholder: "Machine name" }),
      el("input", { class: "checklist-add-input", "data-session-capture": "open" }),
      el("input", { class: "checklist-add-input", "data-session-capture": "done" }),
    ]),
  ]);
}

test("a selector that matches nothing returns null and an empty list — the whole point", () => {
  const root = fixture();
  // Each of these passed under the old stub. Every one of them.
  assert.strictEqual(root.querySelector(".totally-made-up"), null);
  assert.strictEqual(root.querySelector("#nope"), null);
  assert.strictEqual(root.querySelector("[data-not-a-thing]"), null);
  assert.strictEqual(root.querySelector("[data-session-capture='nonsense']"), null);
  assert.strictEqual(root.querySelector("marquee"), null);
  assert.deepStrictEqual(root.querySelectorAll(".totally-made-up"), []);
  // …and a selector that DOES match must not return an invention either.
  const queue = root.querySelector("[data-session-queue]");
  assert.ok(queue, "the queue node is really there");
  assert.ok(root.contains(queue), "the node returned must be a node from the tree, not a fresh one");
});

test("a bare tag selector matches that tag and nothing else", () => {
  // The regression this case exists for: a parser bug that read the tag out of
  // the wrong capture group produced an EMPTY compound, which matches every
  // element in the document. querySelectorAll("button") then returned the entire
  // tree, and a count assertion "passed" at 339.
  const root = fixture();
  assert.strictEqual(root.querySelectorAll("code").length, 3);
  assert.strictEqual(root.querySelectorAll("input").length, 3);
  assert.strictEqual(root.querySelectorAll("h3").length, 1);
  assert.strictEqual(root.querySelectorAll("button").length, 0);
  assert.ok(root.querySelectorAll("*").length > root.querySelectorAll("code").length,
    "the universal selector is the one that matches everything");
  for (const n of root.querySelectorAll("code")) assert.strictEqual(n.tagName, "CODE");
});

test("class, id and attribute selectors each narrow, and they compose", () => {
  const root = fixture();
  assert.strictEqual(root.querySelectorAll(".checklist-hint").length, 3);
  assert.strictEqual(root.querySelectorAll(".checklist-phase").length, 1);
  assert.strictEqual(root.querySelectorAll(".checklist-phase.current").length, 1, "a compound is an AND");
  assert.strictEqual(root.querySelectorAll(".checklist-phase.missing").length, 0);
  assert.strictEqual(root.querySelectorAll("[data-session-capture]").length, 2);
  assert.strictEqual(root.querySelectorAll("[data-session-capture='open']").length, 1);
  assert.strictEqual(root.querySelectorAll('[data-session-capture="done"]').length, 1, "both quote styles");
  assert.strictEqual(root.querySelectorAll("input[data-session-capture='open']").length, 1, "tag + attribute");
  assert.strictEqual(root.querySelectorAll("code[data-session-capture='open']").length, 0);
  assert.strictEqual(doc.body.querySelectorAll("#root").length, 0, "the fixture is detached");
  doc.body.appendChild(root);
  assert.strictEqual(doc.querySelectorAll("#root").length, 1);
  assert.strictEqual(doc.querySelector("#root"), root);
  root.remove();
});

test("descendant, child and sibling combinators address different things", () => {
  const root = fixture();
  // The bug that started all of this: ".checklist-hint code" matched 111 nodes
  // in the real view, and the first of them was in the wrong section entirely.
  const hints = root.querySelectorAll(".checklist-hint code");
  assert.strictEqual(hints.length, 3);
  assert.match(hints[0].textContent, /nmap/, "matches come back in document order");

  assert.strictEqual(root.querySelectorAll("[data-session-queue] code").length, 1,
    "scoping the same selector to the queue section is what fixed it");
  assert.strictEqual(root.querySelectorAll(".panel > code").length, 0, "> is one level, not any level");
  assert.strictEqual(root.querySelectorAll(".checklist-hint > code").length, 3);
  assert.strictEqual(root.querySelectorAll(".panel .checklist-hint code").length, 3, "three deep still resolves");
  assert.strictEqual(root.querySelectorAll("h3 + .checklist-hint").length, 1, "+ is the immediately preceding sibling");
  assert.strictEqual(root.querySelectorAll("h3 ~ .checklist-hint").length, 1, "~ is any preceding sibling");
  assert.strictEqual(root.querySelectorAll(".checklist-hint + h3").length, 0, "order matters");
});

test("selector lists, :not and the structural pseudos", () => {
  const root = fixture();
  assert.strictEqual(root.querySelectorAll("code, h3").length, 4, "a list is a union");
  assert.strictEqual(root.querySelectorAll("code, code").length, 3, "…with no duplicates from overlapping groups");
  assert.strictEqual(root.querySelectorAll("input:not([data-session-capture])").length, 1,
    "this is exactly the machine-name box the `c` shortcut used to focus");
  assert.strictEqual(root.querySelectorAll(".checklist-hint:first-child").length, 1);
  assert.strictEqual(root.querySelectorAll(".checklist-phase input:last-child").length, 1);
  assert.strictEqual(root.querySelectorAll("[data-session-capture]:not([data-session-capture='done'])").length, 1);
});

test("an unsupported selector throws instead of silently matching nothing", () => {
  const root = fixture();
  // Returning [] for a selector the engine cannot read would reproduce the
  // original failure with the opposite sign: a test that can never fail.
  assert.throws(() => root.querySelectorAll("div:nth-child(2)"), /unsupported pseudo-class/);
  assert.throws(() => root.querySelectorAll("div::before"), /unsupported pseudo-class|cannot parse/);
  assert.throws(() => root.querySelectorAll("!!!"), /cannot parse|empty selector/);
  assert.throws(() => root.querySelectorAll(""), /empty selector/);
});

test("matches() and closest() walk the real tree, and closest() can come back empty", () => {
  const root = fixture();
  const code = root.querySelector("[data-session-queue] code");
  assert.ok(code.matches("code"));
  assert.ok(code.matches(".checklist-hint code"));
  assert.ok(!code.matches(".checklist-phase code"));
  assert.ok(!code.matches("input"));

  assert.strictEqual(code.closest(".checklist-hint"), code.parentNode);
  assert.strictEqual(code.closest("[data-session-queue]"), root.querySelector("[data-session-queue]"));
  assert.strictEqual(code.closest("code"), code, "closest() starts at the element itself");
  // The old closest() returned a freshly invented element for ANY selector, so
  // `if (e.target.closest(".x")) return;` always took the early return — the app
  // branched differently inside the test suite than it does in a browser.
  assert.strictEqual(code.closest(".not-in-this-tree"), null);
});

test("attributes and their reflected properties are one value, whichever way they were written", () => {
  const n = doc.createElement("div");
  n.setAttribute("id", "alpha");
  n.setAttribute("class", "one two");
  n.setAttribute("data-act", "copy");
  assert.strictEqual(n.id, "alpha", "setAttribute('id') must reflect onto .id");
  assert.ok(n.classList.contains("two"), "setAttribute('class') must reflect onto classList");
  assert.strictEqual(n.dataset.act, "copy", "setAttribute('data-act') must reflect onto dataset");
  assert.ok(n.matches("#alpha.one.two[data-act='copy']"));

  // And the other direction: app.js writes dataset and className directly.
  const m = doc.createElement("span");
  m.className = "chip";
  m.dataset.fav = "yes";
  m.id = "beta";
  assert.ok(m.matches("span#beta.chip[data-fav='yes']"));
  assert.strictEqual(m.getAttribute("data-fav"), "yes");
  assert.strictEqual(m.getAttribute("nothing"), null);
  assert.ok(m.hasAttribute("data-fav") && !m.hasAttribute("data-other"));
  m.removeAttribute("data-fav");
  assert.ok(!m.matches("[data-fav]"), "removeAttribute must clear the dataset leg too");

  // Attribute operators.
  const a = el("a", { href: "https://example.test/x", rel: "noopener noreferrer" });
  assert.ok(a.matches('[href^="https://"]'));
  assert.ok(a.matches('[href$="/x"]'));
  assert.ok(a.matches('[href*="example"]'));
  assert.ok(a.matches('[rel~="noopener"]'), "~= is a word in a space-separated list");
  assert.ok(!a.matches('[rel="noopener"]'), "…and = is not");
});

test("a query is scoped to descendants, never to the element itself or its siblings", () => {
  const root = fixture();
  assert.strictEqual(root.querySelectorAll(".panel").length, 0, "an element does not match itself");
  const phase = root.querySelector(".checklist-phase");
  assert.strictEqual(phase.querySelectorAll("code").length, 2, "only this section's code nodes");
  assert.strictEqual(phase.querySelectorAll("[data-session-queue]").length, 0, "the sibling section is out of scope");
  // …but an ancestor OUTSIDE the scope still satisfies a descendant combinator,
  // which is what the spec says and what makes ".panel code" work from here.
  assert.strictEqual(phase.querySelectorAll(".panel code").length, 2);
});

test("nodes written as an innerHTML string are findable, and are still serialized raw", () => {
  // public/app.js builds its fixed chrome this way and then reaches back into it:
  //   palette.innerHTML = "<div class='palette'><input class='palette-input'>…"
  //   palette.querySelector(".palette-input").addEventListener(…)
  // Before the parse existed, that threw during app.js's load and took
  // window.CS_APP down with it — which is what auto-vivification had been hiding.
  const host = doc.createElement("div");
  host.innerHTML =
    '<div class="palette" role="dialog">' +
      '<input class="palette-input" type="text" aria-label="Command palette">' +
      '<div class="palette-list" role="listbox"></div>' +
    "</div>";
  const input = host.querySelector(".palette-input");
  assert.ok(input, "a node written as HTML must be reachable by selector");
  assert.strictEqual(input.tagName, "INPUT");
  assert.strictEqual(input.getAttribute("aria-label"), "Command palette");
  assert.strictEqual(host.querySelectorAll(".palette-list").length, 1);
  assert.strictEqual(host.querySelector(".palette-input").closest(".palette"), host.querySelector(".palette"));
  input.value = "nmap";
  assert.strictEqual(host.querySelector(".palette-input").value, "nmap", "and it is the same node next time");

  // The serializer still emits the ORIGINAL string, exactly once. This is not a
  // detail: serialize-dom.js is the XSS scanner's input, and the difference
  // between a string assigned to innerHTML and a tree built with createElement
  // is the entire bug class it hunts. Re-serializing a parse would launder the
  // payload it exists to catch.
  const html = serialize(host);
  assert.strictEqual(html, "<div>" + host.innerHTML + "</div>", "raw, verbatim, and not doubled");
  assert.strictEqual((html.match(/palette-input/g) || []).length, 1);

  const nasty = doc.createElement("div");
  nasty.innerHTML = '<img src=x onerror="alert(1)">';
  assert.ok(nasty.querySelector("img"), "the parse must see it…");
  assert.throws(() => assertInert(serialize(nasty), "innerHTML payload"), /event handler attribute/,
    "…and the scan must still catch it");
});

test("appending to a node that was given innerHTML keeps both, in order and once each", () => {
  const host = doc.createElement("div");
  host.innerHTML = "<span class='a'>one</span>";
  host.appendChild(el("b", { class: "b", text: "two" }));
  assert.strictEqual(host.querySelectorAll(".a").length, 1);
  assert.strictEqual(host.querySelectorAll(".b").length, 1);
  assert.strictEqual(serialize(host), '<div><span class=\'a\'>one</span><b class="b">two</b></div>');
  host.innerHTML = "";
  assert.strictEqual(host.querySelectorAll(".a").length, 0, "assigning innerHTML drops every child");
  assert.strictEqual(serialize(host), "<div></div>");
});
