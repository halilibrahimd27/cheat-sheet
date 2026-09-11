"use strict";
// Tests for the test harness.
//
// Normally that is a smell. Here it is the opposite: every "the rendered output
// contains X" assertion in this suite is only as trustworthy as the stub DOM
// underneath it, and that stub had a hole you could drive a feature through.
//
// The hole: an element kept its own text in a single `_text` string BESIDE its
// child array, and both the textContent getter and the serializer preferred the
// children whenever there were any. So the universal builder pattern in
// public/session.js —
//
//     var li = el("li", "", p.text);                  // text first
//     if (p.cost) li.appendChild(el("div", "...", p.cost));   // children after
//
// — serialised as `<li><div>…cost…</div></li>` with p.text GONE. Seventeen CKS
// pitfall warnings, ~4.4KB of the corpus, never reached any assertion; neither
// did the numerator of OSWE's score block, which read `<small>captured</small>`
// with the number missing.
//
// That is worse than a cosmetic bug in a test helper. `assert.ok(html.includes(x))`
// cannot fail on text the harness threw away, and neither can assertInert() —
// the XSS scan was scanning a document with holes in it. These cases pin the
// node model so the hole cannot reopen quietly.

const test = require("node:test");
const assert = require("node:assert");
const { installBrowserGlobals } = require("./helpers/dom.js");
const { serialize, textOf, escapeText, assertInert } = require("./helpers/serialize-dom.js");
const { readSessionData, loadSession } = require("./helpers/load-session.js");

const env = installBrowserGlobals({});
const doc = env.document;

// The one-liner every UI file in this repo is built out of.
function el(tag, cls, text) {
  const n = doc.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}

test("text written before a child is appended survives — the exact shape session.js builds", () => {
  // public/session.js pitfallBlock(): el("li", "", p.text) then appendChild.
  const li = el("li", "", "Performing a task in the WRONG CLUSTER CONTEXT.");
  li.appendChild(el("div", "session-attempt-why", "The entire task's marks."));

  assert.strictEqual(serialize(li),
    '<li>Performing a task in the WRONG CLUSTER CONTEXT.<div class="session-attempt-why">The entire task\'s marks.</div></li>',
    "the element's own text must serialize before the child that was appended after it");
  assert.match(textOf(li), /WRONG CLUSTER CONTEXT/, "the warning has to be readable in the visible text");
  assert.strictEqual(li.textContent, "Performing a task in the WRONG CLUSTER CONTEXT.The entire task's marks.");
});

test("a score block keeps its number when a child is appended after it", () => {
  // The OSWE shape: "<n> " then a <small> label. This used to serialize as
  // <small>captured</small> — the digit, the only part anyone reads, dropped.
  const score = el("div", "exam-score-value", "40 ");
  score.appendChild(el("small", "", "captured"));
  assert.strictEqual(serialize(score), '<div class="exam-score-value">40 <small>captured</small></div>');
  assert.match(textOf(score), /\b40\b/, "the number is the whole point of a score block");
});

test("text and element children keep document order however they are interleaved", () => {
  const p = el("p", "", "one ");
  p.appendChild(el("b", "", "two"));
  p.appendChild(doc.createTextNode(" three "));
  p.appendChild(el("i", "", "four"));
  assert.strictEqual(serialize(p), "<p>one <b>two</b> three <i>four</i></p>");
  assert.strictEqual(p.textContent, "one two three four");

  // insertBefore and prepend address the SAME list, so a text node is a real
  // position in it rather than something that floats to the front.
  const q = el("p", "", "middle");
  q.prepend(doc.createTextNode("start "));
  q.appendChild(doc.createTextNode(" end"));
  q.insertBefore(el("b", "", "!"), q.childNodes[2]);
  assert.strictEqual(serialize(q), "<p>start middle<b>!</b> end</p>");
});

test("children is elements-only and childNodes is everything — app.js depends on the difference", () => {
  // public/app.js: `if (meta.children.length) card.appendChild(meta)` decides
  // whether a row is worth showing. A whitespace text node must not make an
  // otherwise-empty row look populated.
  const row = el("div", "cmd-meta-row", "");
  row.appendChild(doc.createTextNode(" "));
  assert.strictEqual(row.children.length, 0, "a lone text node is not an element child");
  assert.strictEqual(row.childNodes.length, 1, "but it is still a node in the tree");

  row.appendChild(el("a", "cmd-attack-chip", "T1046"));
  assert.strictEqual(row.children.length, 1);
  assert.strictEqual(row.childNodes.length, 2);
  assert.strictEqual(row.children[0].tagName, "A");

  // firstChild is the first NODE (what wireCopy() in session.js reaches for),
  // and it is not the same thing as the first element.
  const bar = el("div", "machine-report-bar", "");
  bar.appendChild(el("button", "btn", "Copy"));
  assert.strictEqual(bar.firstChild.tagName, "BUTTON", "a bar built with no leading text starts with its button");
});

test("setting textContent replaces everything that was there, and setting it to \"\" empties the node", () => {
  const n = el("div", "", "before");
  n.appendChild(el("span", "", "child"));
  n.textContent = "after";
  assert.strictEqual(serialize(n), "<div>after</div>", "textContent is a replacement, not an append");
  assert.strictEqual(n.children.length, 0);
  assert.strictEqual(n.childNodes.length, 1);

  n.textContent = "";
  assert.strictEqual(serialize(n), "<div></div>", "empty text means an empty node, not an empty text child");
  assert.strictEqual(n.childNodes.length, 0);
  assert.strictEqual(n.textContent, "");
});

test("removeChild, replaceChildren and innerHTML all clear text nodes too", () => {
  const n = el("div", "", "keep ");
  const child = el("b", "", "drop");
  n.appendChild(child);
  n.removeChild(child);
  assert.strictEqual(serialize(n), "<div>keep </div>", "removing the element must leave the text behind");

  n.replaceChildren(el("i", "", "fresh"));
  assert.strictEqual(serialize(n), "<div><i>fresh</i></div>", "replaceChildren replaces the text node as well");

  const m = el("div", "", "text");
  m.appendChild(el("b", "", "child"));
  m.innerHTML = "<span>raw</span>";
  assert.strictEqual(serialize(m), "<div><span>raw</span></div>", "assigning innerHTML drops every node, text included");
});

test("a text node's content is escaped on the way out, so the scan cannot be fooled by it", () => {
  const n = el("div", "", "");
  n.appendChild(doc.createTextNode('<script>alert(1)</script>'));
  n.appendChild(el("b", "", '" onmouseover="alert(1)'));
  const html = serialize(n);
  assert.doesNotMatch(html, /<script/i, "a text node must never open an element");
  assert.match(html, /&lt;script&gt;/, "it must show up escaped rather than vanish");
  // A quote inside TEXT is just a quote — a real browser does not entity-encode
  // it there, and neither does the serializer. What matters is that it stays in
  // text position, which is what assertInert() is judging.
  assert.match(html, /<b>" onmouseover="alert\(1\)<\/b>/, "the payload has to actually be in the output, or this test proves nothing");
  assert.doesNotThrow(() => assertInert(html, "text-node payloads"), "text-position quotes must not be read as an attribute break-out");
});

test("every CKS pitfall warning reaches the rendered output — the 4.4KB the old harness swallowed", async () => {
  // Data-driven on purpose: the assertion is "the harness shows what the module
  // rendered", not "this sentence is still in the corpus". Every one of these
  // pitfalls carries a `cost` line, which is what appended a child after the
  // text and made the text disappear.
  const s = loadSession({});
  assert.ok(!s.missing && !s.loadError && s.mod, "public/session.js must load for this to mean anything");
  s.mod.startSession("cks");
  s.mod.render(s.container);
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));

  const rendered = textOf(s.container);
  const cks = readSessionData().presets.find((p) => p.id === "cks");
  assert.ok(cks.pitfalls.length >= 17, "CKS ships " + cks.pitfalls.length + " pitfalls — this test is sized for them");

  const missing = [];
  for (const pf of cks.pitfalls) {
    // textOf() strips tags and collapses whitespace, and serialization escapes
    // `<` — compare against the same transformation of the source string.
    const want = escapeText(pf.text).replace(/\s+/g, " ").trim();
    if (!rendered.includes(want)) missing.push(pf.text.slice(0, 80));
  }
  assert.deepStrictEqual(missing, [], missing.length + " pitfall warning(s) never reached the DOM");

  // And the follow-on lines that used to be the ONLY thing that survived are
  // still there, so this is a widening rather than a swap.
  const withCost = cks.pitfalls.filter((p) => p.cost);
  assert.ok(withCost.length > 0, "the pitfalls that carry a cost line are the ones that triggered the bug");
  for (const pf of withCost) {
    const want = escapeText(pf.cost).replace(/\s+/g, " ").trim();
    assert.ok(rendered.includes(want), "the cost line went missing instead: " + pf.cost.slice(0, 80));
  }
});
