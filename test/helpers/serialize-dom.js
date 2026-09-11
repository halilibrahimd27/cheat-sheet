"use strict";
// Serialize the dom.js stub tree back into one HTML string, then prove that
// string is inert.
//
// WHY a serializer at all: the stub never parses innerHTML, so a node built with
// createElement/appendChild and a node built by assigning an HTML string are two
// completely different shapes in memory. A security test that only looked at
// container.innerHTML would miss every createElement path, and one that only
// walked children would miss every string-building path — which is exactly where
// this repo's four stored-XSS sinks lived. Serializing reunites both.
//
// WHY attribute values are escaped on the way out: that is what a real browser
// does. setAttribute("title", '" onmouseover="x') stores one attribute and
// serializes it with the quote entity-encoded — it cannot break out, and a test
// that flagged it would be crying wolf. Only a raw innerHTML string can smuggle
// a second attribute in, so only innerHTML is spliced verbatim. The difference
// between the two is precisely the bug class being hunted.

const assert = require("node:assert");

function escapeText(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s) {
  return escapeText(s).replace(/"/g, "&quot;");
}

// Everything a real element would serialize: the attribute bag, plus the
// properties the stub keeps outside it (id, class, dataset, value, disabled).
function attrsOf(node) {
  const out = [];
  if (node.id) out.push(' id="' + escapeAttr(node.id) + '"');
  const cls = node.classList && node.classList.value;
  if (cls) out.push(' class="' + escapeAttr(cls) + '"');
  const bag = node.attributes || {};
  for (const name of Object.keys(bag)) {
    if (name === "id" && node.id) continue;
    if (name === "class" && cls) continue;
    out.push(" " + name + '="' + escapeAttr(bag[name]) + '"');
  }
  const data = node.dataset || {};
  for (const key of Object.keys(data)) {
    const attr = "data-" + key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
    if (Object.prototype.hasOwnProperty.call(bag, attr)) continue;
    out.push(" " + attr + '="' + escapeAttr(data[key]) + '"');
  }
  // A value typed into a field is user-controlled and is what an export reads
  // back, so it belongs in the scanned surface.
  if (node.value) out.push(' value="' + escapeAttr(node.value) + '"');
  if (node.disabled === true) out.push(" disabled");
  if (node.checked === true) out.push(" checked");
  return out.join("");
}

const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

function serialize(node) {
  if (!node) return "";
  const tag = String(node.tagName || "div").toLowerCase();
  if (tag === "#text") return escapeText(node.textContent);
  // innerHTML first (raw, on purpose), then every child node IN DOCUMENT ORDER —
  // childNodes, not children, because an element's own text is a text node among
  // its element children and reading only the elements drops it. The trailing
  // `_text` fallback is for a node that was handed text with no children at all.
  let inner = node._html ? String(node._html) : "";
  let kids = node.childNodes || node.children || [];
  // dom.js parses an assigned innerHTML string into real child nodes so that
  // querySelector can find them. Those children are an index, not content: the
  // raw string above is what a real browser would have received and is what the
  // scan below must judge. Emitting both would print the markup twice AND would
  // launder a payload through a re-serialization step, which is the one thing
  // this file exists to prevent.
  if (node._html) kids = kids.filter((k) => !k._fromHTML);
  if (kids.length) inner += kids.map(serialize).join("");
  else if (!node._html && node._text) inner += escapeText(node._text);
  if (tag === "#fragment" || tag === "#document-fragment") return inner;
  if (VOID_TAGS.has(tag) && !inner) return "<" + tag + attrsOf(node) + ">";
  return "<" + tag + attrsOf(node) + ">" + inner + "</" + tag + ">";
}

// Visible text with every tag removed — for assertions about what a human reads
// rather than about markup.
function textOf(node) {
  return serialize(node).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// Element identifiers only (id / class / data-* / aria-label / role / title).
// Used by the "Quick Lab has no timer" style tests, which must not be fooled by
// a preset's own prose happening to contain the word "score".
function identifiersOf(html) {
  const out = [];
  const re = /\s(id|class|role|title|aria-label|data-[-a-z0-9]+)\s*=\s*"([^"]*)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) out.push(m[1].toLowerCase() + "=" + m[2].toLowerCase());
  return out;
}

const TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:[^<>"']|"[^"]*"|'[^']*')*)\/?>/g;
const ATTR_RE = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>`]+))/g;
// Elements that execute, re-scope the document, or exfiltrate. <svg> is absent
// because inline icon markup is legitimate here; a handler on one is caught by
// the per-tag attribute walk below like any other element.
const FORBIDDEN_TAGS = /<\s*(script|iframe|object|embed|base|meta|link|frame|frameset)\b/i;

// Walk every tag the module produced and prove each one is inert. Structural,
// not string-equality: the markup is free to change, the guarantees are not.
function assertInert(html, label) {
  const where = (msg) => label + ": " + msg + "\n  " + html.slice(0, 4000);
  // Only a LITERAL "<" can open an element. Escaped prose may legitimately read
  // "&lt;script&gt;" or "onerror=", so every check below is scoped to the inside
  // of a real tag rather than to the document as a whole.
  assert.doesNotMatch(html, FORBIDDEN_TAGS, where("an executable or document-scope element reached the output"));

  TAG_RE.lastIndex = 0;
  let m;
  while ((m = TAG_RE.exec(html)) !== null) {
    const tag = m[1].toLowerCase();
    const attrChunk = m[2];
    assert.doesNotMatch(attrChunk, /</, where("a raw < survived inside the attributes of <" + tag + ">"));
    // Blank the quoted values before hunting for handlers: title="&quot; onmouseover=&quot;x"
    // is one attribute holding entities, not two attributes — an entity cannot
    // terminate a quote. What matters is whether a LITERAL quote escaped.
    const skeleton = attrChunk.replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''");
    assert.doesNotMatch(skeleton, /\bon[a-z]+\s*=/i, where("<" + tag + "> was given an event handler attribute"));
    assert.doesNotMatch(skeleton, /javascript\s*:/i, where("<" + tag + "> carries a javascript: scheme"));

    ATTR_RE.lastIndex = 0;
    let a;
    while ((a = ATTR_RE.exec(attrChunk)) !== null) {
      const name = a[1];
      const value = a[2] !== undefined ? a[2] : (a[3] !== undefined ? a[3] : a[4]);
      assert.doesNotMatch(name, /^on/i, where("<" + tag + "> carries the handler attribute " + name));
      assert.doesNotMatch(value, /</, where("<" + tag + " " + name + "> value contains a raw <"));
      if (name.toLowerCase() === "href" || name.toLowerCase() === "src") {
        assert.match(value, /^(#|https?:\/\/|\/(?!\/)|data:image\/|blob:)/i, where("<" + tag + "> " + name + "=" + JSON.stringify(value) + " is not a safe URL"));
      }
    }
    // Whatever is left must be bare boolean attributes (disabled / checked). A
    // stray quote, or a value that escaped its quoting, shows up right here.
    let rest = attrChunk.replace(ATTR_RE, " ").replace(/\b[a-zA-Z_:][-a-zA-Z0-9_:.]*\b/g, " ").replace(/\//g, " ");
    assert.strictEqual(rest.trim(), "", where("unparsed junk " + JSON.stringify(rest.trim()) + " in the attributes of <" + tag + ">"));
  }
}

module.exports = { serialize, textOf, identifiersOf, assertInert, escapeText, escapeAttr };
