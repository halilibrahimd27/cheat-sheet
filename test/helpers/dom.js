"use strict";
// A hand-rolled browser stub. The product ships exactly one runtime dependency,
// so its tests ship zero — jsdom is deliberately absent.
//
// This is NOT a spec-correct DOM. It is the minimum surface that lets
// public/app.js execute top-to-bottom in Node so its pure functions (the markdown
// renderer, the CVSS maths, the nmap parser, the palette ranking) can be reached
// and asserted on. Anything that only affects pixels is a no-op on purpose.

class ClassList {
  constructor() { this._set = new Set(); }
  add(...names) { names.forEach((n) => { if (n) this._set.add(String(n)); }); }
  remove(...names) { names.forEach((n) => this._set.delete(String(n))); }
  contains(n) { return this._set.has(String(n)); }
  toggle(n, force) {
    const on = force === undefined ? !this.contains(n) : !!force;
    if (on) this.add(n); else this.remove(n);
    return on;
  }
  replace(a, b) { if (this.contains(a)) { this.remove(a); this.add(b); return true; } return false; }
  item(i) { return Array.from(this._set)[i] || null; }
  get length() { return this._set.size; }
  get value() { return Array.from(this._set).join(" "); }
  set value(v) { this._set = new Set(String(v || "").split(/\s+/).filter(Boolean)); }
  toString() { return this.value; }
}

// The constructor upper-cases tagName, so a text node answers to "#TEXT".
const TEXT_TAG = "#TEXT";
function isText(n) { return !!n && n.tagName === TEXT_TAG; }

// ══════════════════════════════════════════════════════════════════
// A real selector engine
//
// WHY this exists: querySelector used to INVENT an element for whatever selector
// it was handed and cache it, while querySelectorAll returned [] unconditionally.
// So `assert.ok(container.querySelector(".does-not-exist"))` passed, and every
// "the view renders X" assertion written that way was asserting only that the
// stub is willing to make things up. A selector test that cannot fail is worse
// than no selector test: it reads as coverage.
//
// Supported: tag, #id, .class, [attr], [attr=value] with = ~= ^= $= *= |=,
// :not(), the structural pseudos this codebase actually uses, selector lists
// ("a, b"), and the descendant / > / + / ~ combinators. Anything else THROWS
// instead of silently matching nothing — an unreadable selector is exactly the
// failure mode being removed, so it must be loud.
//
// ══════════════════════════════════════════════════════════════════

const SIMPLE_RE = new RegExp([
  "\\*",
  "#([\\w-]+)",
  "\\.([\\w-]+)",
  "\\[\\s*([\\w:.-]+)\\s*(?:([~^$*|]?=)\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\]\\s]*))\\s*)?\\]",
  ":([\\w-]+)(?:\\(([^()]*)\\))?",
  "([A-Za-z][\\w-]*)",
].join("|"), "g");

const STRUCTURAL = new Set(["first-child", "last-child", "only-child", "empty", "checked", "disabled", "enabled", "not"]);

function parseCompound(src, whole) {
  const c = { tag: "", id: "", classes: [], attrs: [], pseudos: [] };
  SIMPLE_RE.lastIndex = 0;
  let at = 0;
  let m;
  while ((m = SIMPLE_RE.exec(src)) !== null) {
    if (m.index !== at) break;
    at = SIMPLE_RE.lastIndex;
    if (m[0] === "*") continue;
    if (m[1] !== undefined) { c.id = m[1]; continue; }
    if (m[2] !== undefined) { c.classes.push(m[2]); continue; }
    if (m[3] !== undefined) {
      const value = m[5] !== undefined ? m[5] : (m[6] !== undefined ? m[6] : m[7]);
      c.attrs.push({ name: m[3], op: m[4] || "", value: value === undefined ? null : value });
      continue;
    }
    if (m[8] !== undefined) {
      const name = m[8].toLowerCase();
      if (!STRUCTURAL.has(name)) throw new Error("dom.js selector engine: unsupported pseudo-class \":" + name + "\" in " + JSON.stringify(whole));
      c.pseudos.push({ name, arg: name === "not" ? parseSelector(m[9] || "*") : null });
      continue;
    }
    // m[10], not m[9]: the pseudo-class branch above owns groups 8 and 9, so the
    // bare-tag group is the tenth. Getting this wrong parses "button" into an
    // EMPTY compound, which matches every element in the tree — the same
    // everything-matches lie this engine replaced, one layer down.
    if (m[10] !== undefined) { c.tag = m[10].toUpperCase(); continue; }
  }
  if (at !== src.length) throw new Error("dom.js selector engine: cannot parse " + JSON.stringify(whole) + " at " + JSON.stringify(src.slice(at)));
  return c;
}

// One comma-group becomes [{ combinator, compound }, …] left to right. The first
// entry's combinator is null; every later one says how it relates to the entry
// before it.
// Scanned character by character rather than split with a regex, because `~` and
// `+` are combinators AND attribute operators: a regex split turned
// [rel~="noopener"] into the two nonsense compounds `[rel` and `="noopener"]`.
// Bracket depth and quote state are what tell the two uses apart.
function parseGroup(src, whole) {
  const parts = [];
  let buf = "";
  let comb = null; // the combinator that will precede the NEXT compound
  let depth = 0;
  let quote = "";
  const push = () => {
    if (!buf) return;
    parts.push({ combinator: comb, compound: parseCompound(buf, whole) });
    buf = "";
    comb = null;
  };
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quote) { buf += ch; if (ch === quote) quote = ""; continue; }
    if (ch === "\"" || ch === "'") { quote = ch; buf += ch; continue; }
    if (ch === "[" || ch === "(") { depth++; buf += ch; continue; }
    if (ch === "]" || ch === ")") { depth--; buf += ch; continue; }
    if (depth > 0) { buf += ch; continue; }
    if (/\s/.test(ch)) {
      push();
      // Whitespace is only a descendant combinator until a real one turns up:
      // "a > b" must not become "a b > b".
      if (comb === null && parts.length) comb = " ";
      continue;
    }
    if (ch === ">" || ch === "+" || ch === "~") { push(); comb = ch; continue; }
    buf += ch;
  }
  push();
  if (!parts.length) throw new Error("dom.js selector engine: empty selector " + JSON.stringify(whole));
  return parts;
}

const SELECTOR_CACHE = new Map();
function parseSelector(sel) {
  const src = String(sel == null ? "" : sel).trim();
  if (SELECTOR_CACHE.has(src)) return SELECTOR_CACHE.get(src);
  if (!src) throw new Error("dom.js selector engine: empty selector");
  // Split on commas that are not inside brackets, quotes or :not(…).
  const groups = [];
  let depth = 0;
  let quote = "";
  let start = 0;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quote) { if (ch === quote) quote = ""; continue; }
    if (ch === "\"" || ch === "'") { quote = ch; continue; }
    if (ch === "[" || ch === "(") depth++;
    else if (ch === "]" || ch === ")") depth--;
    else if (ch === "," && depth === 0) { groups.push(src.slice(start, i)); start = i + 1; }
  }
  groups.push(src.slice(start));
  const parsed = groups.map((g) => parseGroup(g.trim(), src)).filter((g) => g.length);
  SELECTOR_CACHE.set(src, parsed);
  return parsed;
}

// Read an attribute the way a browser would: the attribute bag first, then the
// properties the stub reflects beside it (id, class, dataset, value, and the
// boolean ones). Without the dataset leg, `el.dataset.act = "x"` and
// `el.setAttribute("data-act", "x")` would answer differently to `[data-act]`,
// and this codebase writes both.
function attrValue(node, name) {
  const bag = node.attributes || {};
  if (Object.prototype.hasOwnProperty.call(bag, name)) return String(bag[name]);
  if (name === "class") { const v = node.classList && node.classList.value; return v ? v : null; }
  if (name === "id") return node.id ? String(node.id) : null;
  if (name === "value") return node.value ? String(node.value) : null;
  if (name === "disabled") return node.disabled === true ? "" : null;
  if (name === "checked") return node.checked === true ? "" : null;
  if (name === "hidden") return node.hidden === true ? "" : null;
  if (name.slice(0, 5) === "data-") {
    const key = name.slice(5).replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
    const d = node.dataset || {};
    if (Object.prototype.hasOwnProperty.call(d, key) && d[key] !== undefined) return String(d[key]);
  }
  return null;
}

function attrOk(node, a) {
  const have = attrValue(node, a.name);
  if (have === null) return false;
  if (!a.op) return true;
  const want = String(a.value == null ? "" : a.value);
  switch (a.op) {
    case "=": return have === want;
    case "~=": return want !== "" && have.split(/\s+/).indexOf(want) !== -1;
    case "^=": return want !== "" && have.slice(0, want.length) === want;
    case "$=": return want !== "" && have.slice(have.length - want.length) === want;
    case "*=": return want !== "" && have.indexOf(want) !== -1;
    case "|=": return have === want || have.slice(0, want.length + 1) === want + "-";
    default: return false;
  }
}

function elementChildren(node) {
  return node && node._nodes ? node._nodes.filter((n) => n && !isText(n)) : [];
}
function siblingsOf(node) {
  return node && node.parentNode ? elementChildren(node.parentNode) : [];
}

function matchCompound(node, c) {
  if (!node || !node.tagName || isText(node)) return false;
  if (c.tag && node.tagName !== c.tag) return false;
  if (c.id && attrValue(node, "id") !== c.id) return false;
  for (const cls of c.classes) if (!node.classList || !node.classList.contains(cls)) return false;
  for (const a of c.attrs) if (!attrOk(node, a)) return false;
  for (const p of c.pseudos) {
    if (p.name === "not") { if (p.arg.some((g) => matchGroup(node, g, g.length - 1))) return false; continue; }
    if (p.name === "empty") { if ((node._nodes || []).length !== 0) return false; continue; }
    if (p.name === "checked") { if (node.checked !== true) return false; continue; }
    if (p.name === "disabled") { if (node.disabled !== true) return false; continue; }
    if (p.name === "enabled") { if (node.disabled === true) return false; continue; }
    const sib = siblingsOf(node);
    if (p.name === "first-child" && sib[0] !== node) return false;
    if (p.name === "last-child" && sib[sib.length - 1] !== node) return false;
    if (p.name === "only-child" && !(sib.length === 1 && sib[0] === node)) return false;
  }
  return true;
}

function matchGroup(node, parts, i) {
  if (!matchCompound(node, parts[i].compound)) return false;
  if (i === 0) return true;
  const comb = parts[i].combinator;
  if (comb === ">") return !!node.parentNode && matchGroup(node.parentNode, parts, i - 1);
  if (comb === "+" || comb === "~") {
    const sib = siblingsOf(node);
    const at = sib.indexOf(node);
    if (at <= 0) return false;
    if (comb === "+") return matchGroup(sib[at - 1], parts, i - 1);
    for (let k = at - 1; k >= 0; k--) if (matchGroup(sib[k], parts, i - 1)) return true;
    return false;
  }
  // Descendant. The ancestor walk is NOT clipped at the element querySelector
  // was called on — that is what the spec says, and it is why ".panel .row"
  // still resolves when you query a subtree of .panel.
  let p = node.parentNode;
  while (p) {
    if (matchGroup(p, parts, i - 1)) return true;
    p = p.parentNode;
  }
  return false;
}

function selectorMatches(node, sel) {
  return parseSelector(sel).some((g) => matchGroup(node, g, g.length - 1));
}

// Depth-first, document order — which is what querySelector's "first match" means.
function walk(root, visit) {
  const kids = root && root._nodes ? root._nodes : [];
  for (const k of kids) {
    if (!k || isText(k)) continue;
    if (visit(k) === false) return false;
    if (walk(k, visit) === false) return false;
  }
  return true;
}

function selectAll(root, sel) {
  const groups = parseSelector(sel);
  const out = [];
  walk(root, (n) => { if (groups.some((g) => matchGroup(n, g, g.length - 1))) out.push(n); });
  return out;
}

function selectOne(root, sel) {
  const groups = parseSelector(sel);
  let found = null;
  walk(root, (n) => {
    if (groups.some((g) => matchGroup(n, g, g.length - 1))) { found = n; return false; }
    return true;
  });
  return found;
}

// ══════════════════════════════════════════════════════════════════
// A small HTML parser, for innerHTML only
//
// WHY: public/app.js builds its fixed chrome by assigning one HTML string and
// then reaching back into it — `palette.innerHTML = "…<input class='palette-input'>…"`
// followed by `palette.querySelector(".palette-input").addEventListener(…)`.
// A real browser answers that query; the stub has to as well, or app.js throws
// during load and every test that needs window.CS_APP dies with it. (That is
// precisely what auto-vivification was quietly covering up.)
//
// The parsed nodes are QUERYABLE BUT NOT SERIALIZED. serialize-dom.js keeps
// splicing the raw `_html` string in verbatim, because the difference between a
// string assigned to innerHTML and a tree built with createElement IS the XSS
// bug class it hunts — re-serializing a parsed tree would launder exactly the
// payload it exists to catch. So the raw string stays the source of truth for
// the scan, and the parse is a read-only index on top of it.
//
// It is not a spec parser: no implied <tbody>, no error recovery beyond closing
// unclosed elements, entities limited to the five that matter. It is enough to
// find a node by selector, which is all it is asked to do.
// ══════════════════════════════════════════════════════════════════

const VOID_ELEMENTS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const RAW_TEXT_ELEMENTS = new Set(["script", "style", "textarea", "title"]);
const HTML_TOKEN_RE = /<!--[\s\S]*?-->|<![^>]*>|<\/([a-zA-Z][\w:-]*)[^>]*>|<([a-zA-Z][\w:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>`]*))?)*)\s*(\/?)>/g;
const HTML_ATTR_RE = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>`]*)))?/g;
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", "#39": "'", nbsp: " " };

function decodeEntities(s) {
  return String(s).replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (whole, name) => {
    const key = name.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(ENTITIES, key)) return ENTITIES[key];
    if (key[0] === "#") return String.fromCharCode(key[1] === "x" ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10));
    return whole;
  });
}

function parseHTML(html, doc) {
  const roots = [];
  const stack = [];
  const top = () => (stack.length ? stack[stack.length - 1] : null);
  const put = (node) => {
    const parent = top();
    if (parent) parent.appendChild(node);
    else roots.push(node);
  };
  const addText = (raw) => {
    if (!raw) return;
    const n = new StubElement("#text", doc);
    n._text = decodeEntities(raw);
    put(n);
  };

  HTML_TOKEN_RE.lastIndex = 0;
  let at = 0;
  let m;
  while ((m = HTML_TOKEN_RE.exec(html)) !== null) {
    addText(html.slice(at, m.index));
    at = HTML_TOKEN_RE.lastIndex;
    if (m[1] !== undefined) {
      // Closing tag: unwind to the matching open element, so a stray </div>
      // cannot pop the whole document.
      const want = m[1].toUpperCase();
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tagName === want) { stack.length = i; break; }
      }
      continue;
    }
    if (m[2] === undefined) continue; // comment or doctype
    const tag = m[2];
    const node = new StubElement(tag, doc);
    HTML_ATTR_RE.lastIndex = 0;
    let a;
    while ((a = HTML_ATTR_RE.exec(m[3] || "")) !== null) {
      if (!a[1]) continue;
      const value = a[2] !== undefined ? a[2] : (a[3] !== undefined ? a[3] : (a[4] !== undefined ? a[4] : ""));
      node.setAttribute(a[1], decodeEntities(value));
    }
    put(node);
    const lower = tag.toLowerCase();
    if (m[4] === "/" || VOID_ELEMENTS.has(lower)) continue;
    if (RAW_TEXT_ELEMENTS.has(lower)) {
      // <script>/<style> bodies are text, not markup — parsing them as markup is
      // how a scanner ends up believing a payload is inert.
      const end = html.toLowerCase().indexOf("</" + lower, at);
      const stop = end === -1 ? html.length : end;
      if (stop > at) { stack.push(node); addText(html.slice(at, stop)); stack.pop(); }
      HTML_TOKEN_RE.lastIndex = stop;
      at = stop;
      continue;
    }
    stack.push(node);
  }
  addText(html.slice(at));
  return roots;
}

class StubElement {
  constructor(tagName, doc) {
    this.tagName = String(tagName || "div").toUpperCase();
    this.ownerDocument = doc || null;
    // Every child in document order, text nodes included. `children` is derived
    // from this and stays elements-only, the way a real DOM splits childNodes
    // from children. WHY it has to be one ordered list: the old model kept a
    // single `_text` string beside an element array, so `el(tag, cls, text)`
    // followed by appendChild() silently dropped the text — and every
    // "the output contains X" assertion then passed over the hole.
    this._nodes = [];
    this.parentNode = null;
    this.id = "";
    this.hidden = false;
    this.attributes = Object.create(null);
    this.style = {};
    this.dataset = {};
    this.classList = new ClassList();
    this._listeners = Object.create(null);
    this._html = "";
    this._text = "";
    this.value = "";
    this.checked = false;
    this.disabled = false;
    this.files = [];
    this.isContentEditable = false;
    this.scrollTop = 0;
    this.scrollHeight = 0;
    this.offsetHeight = 0;
    this.selectionStart = 0;
    this.selectionEnd = 0;
  }

  get className() { return this.classList.value; }
  set className(v) { this.classList.value = v; }
  get innerHTML() { return this._html; }
  // The raw string is kept for serialization (the XSS scan needs it verbatim);
  // the parse alongside it is what makes the node reachable by selector, the way
  // a browser would. `_fromHTML` marks those children so the serializer emits
  // the string once instead of the string plus its parse.
  set innerHTML(v) {
    this._html = String(v == null ? "" : v);
    this._nodes.length = 0;
    if (!this._html) return;
    parseHTML(this._html, this.ownerDocument).forEach((n) => {
      n._fromHTML = true;
      this.appendChild(n);
    });
  }
  get outerHTML() { const t = this.tagName.toLowerCase(); return "<" + t + ">" + this._html + "</" + t + ">"; }
  // childNodes is the full ordered list; children is the elements-only view.
  // app.js reads `.children.length` to decide whether a row is worth appending,
  // so a stray whitespace text node must not count towards it.
  get childNodes() { return this._nodes; }
  get children() { return this._nodes.filter((n) => !isText(n)); }
  get firstChild() { return this._nodes[0] || null; }
  get lastChild() { return this._nodes[this._nodes.length - 1] || null; }
  get textContent() {
    if (isText(this)) return this._text;
    if (this._nodes.length) return this._nodes.map((c) => c.textContent).join("");
    return this._text;
  }
  set textContent(v) {
    const s = String(v == null ? "" : v);
    if (isText(this)) { this._text = s; return; }
    // An element holds its text as a real child node, so later appendChild calls
    // land AFTER it instead of hiding it.
    this._text = "";
    this._nodes.length = 0;
    if (s !== "") this._nodes.push(this._makeText(s));
  }

  _makeText(s) {
    const n = new StubElement("#text", this.ownerDocument);
    n._text = s;
    n.parentNode = this;
    return n;
  }

  appendChild(child) { if (child) { child.parentNode = this; this._nodes.push(child); } return child; }
  append(...nodes) { nodes.forEach((n) => this.appendChild(typeof n === "string" ? this._makeText(n) : n)); }
  prepend(...nodes) { nodes.forEach((n) => { if (n) { n.parentNode = this; this._nodes.unshift(n); } }); }
  insertBefore(node, ref) {
    const i = this._nodes.indexOf(ref);
    if (node) node.parentNode = this;
    if (i === -1) this._nodes.push(node); else this._nodes.splice(i, 0, node);
    return node;
  }
  removeChild(child) { const i = this._nodes.indexOf(child); if (i !== -1) this._nodes.splice(i, 1); return child; }
  replaceChildren(...nodes) { this._nodes.length = 0; nodes.forEach((n) => this.appendChild(n)); }
  remove() { if (this.parentNode) this.parentNode.removeChild(this); this.parentNode = null; }
  cloneNode() { const el = new StubElement(this.tagName, this.ownerDocument); el.innerHTML = this._html; el.className = this.className; return el; }

  // Reflect the three attributes a browser mirrors onto properties. Without
  // this, setAttribute("id", x) and el.id = x — both of which this codebase
  // uses — would answer differently to the same "#x" selector.
  setAttribute(name, value) {
    const n = String(name);
    this.attributes[n] = String(value);
    if (n === "id") this.id = String(value);
    else if (n === "class") this.classList.value = String(value);
    else if (n.slice(0, 5) === "data-") this.dataset[n.slice(5).replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())] = String(value);
  }
  getAttribute(name) {
    const v = attrValue(this, String(name));
    return v === null ? null : v;
  }
  hasAttribute(name) { return attrValue(this, String(name)) !== null; }
  removeAttribute(name) {
    const n = String(name);
    delete this.attributes[n];
    if (n === "id") this.id = undefined;
    else if (n === "class") this.classList.value = "";
    else if (n.slice(0, 5) === "data-") delete this.dataset[n.slice(5).replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())];
  }

  querySelector(sel) { return selectOne(this, sel); }
  querySelectorAll(sel) { return selectAll(this, sel); }
  getElementsByClassName(name) { return selectAll(this, "." + String(name).trim().split(/\s+/).join(".")); }
  closest(sel) {
    let n = this;
    while (n) {
      if (n.tagName && n.tagName !== "#TEXT" && selectorMatches(n, sel)) return n;
      n = n.parentNode;
    }
    return null;
  }
  matches(sel) { return selectorMatches(this, sel); }
  contains(node) { return node === this || this._nodes.some((c) => c.contains && c.contains(node)); }

  addEventListener(type, fn) { (this._listeners[type] || (this._listeners[type] = [])).push(fn); }
  removeEventListener(type, fn) {
    const list = this._listeners[type];
    if (!list) return;
    const i = list.indexOf(fn);
    if (i !== -1) list.splice(i, 1);
  }
  dispatchEvent(ev) {
    const type = (ev && ev.type) || "";
    (this._listeners[type] || []).forEach((fn) => fn.call(this, Object.assign({ target: this, preventDefault() {}, stopPropagation() {} }, ev)));
    return true;
  }
  click() { return this.dispatchEvent({ type: "click" }); }
  focus() { if (this.ownerDocument) this.ownerDocument.activeElement = this; }
  blur() {}
  select() {}
  scrollIntoView() {}
  setSelectionRange(s, e) { this.selectionStart = s; this.selectionEnd = e; }
  getBoundingClientRect() { return { x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }; }
}

class StubDocument {
  constructor() {
    this._byId = new Map();
    this._listeners = Object.create(null);
    this.documentElement = new StubElement("html", this);
    this.head = new StubElement("head", this);
    this.body = new StubElement("body", this);
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
    this.activeElement = this.body;
  }
  getElementById(id) {
    const key = String(id);
    if (!this._byId.has(key)) {
      const el = new StubElement("div", this);
      el.id = key;
      this._byId.set(key, el);
    }
    return this._byId.get(key);
  }
  createElement(tag) { return new StubElement(tag, this); }
  createElementNS(ns, tag) { const el = new StubElement(tag, this); el.namespaceURI = ns; return el; }
  createTextNode(text) { const el = new StubElement("#text", this); el.textContent = text; return el; }
  createDocumentFragment() { return new StubElement("#fragment", this); }
  // A document query spans <html>, not just <body> — app.js reaches for nodes it
  // parked in <head> the same way it reaches for the ones in the page.
  querySelector(sel) { return selectOne(this.documentElement, sel); }
  querySelectorAll(sel) { return selectAll(this.documentElement, sel); }
  getElementsByClassName(name) { return this.documentElement.getElementsByClassName(name); }
  addEventListener(type, fn) { (this._listeners[type] || (this._listeners[type] = [])).push(fn); }
  removeEventListener(type, fn) {
    const list = this._listeners[type];
    if (!list) return;
    const i = list.indexOf(fn);
    if (i !== -1) list.splice(i, 1);
  }
  dispatchEvent(ev) {
    const type = (ev && ev.type) || "";
    (this._listeners[type] || []).forEach((fn) => fn(Object.assign({ preventDefault() {}, stopPropagation() {} }, ev)));
    return true;
  }
  execCommand() { return true; }
}

function createLocalStorage(seed) {
  const map = new Map(Object.entries(seed || {}));
  return {
    getItem(k) { const key = String(k); return map.has(key) ? map.get(key) : null; },
    setItem(k, v) { map.set(String(k), String(v)); },
    removeItem(k) { map.delete(String(k)); },
    clear() { map.clear(); },
    key(i) { return Array.from(map.keys())[i] ?? null; },
    get length() { return map.size; },
  };
}

// Install the browser globals onto this realm's globalThis. The app files are
// evaluated with vm.runInThisContext (not a fresh vm context) so that objects
// crossing the boundary keep their prototypes and assert.deepStrictEqual stays
// meaningful; node --test already gives each test file its own process, so the
// pollution is contained.
function installBrowserGlobals(opts) {
  const o = opts || {};
  const document = new StubDocument();
  const localStorage = createLocalStorage(o.localStorage);
  const objectUrls = new Map();

  const win = globalThis;
  // Several of these (navigator, self, crypto) are getter-only accessors on Node's
  // globalThis, so a plain assignment throws — define them instead.
  const def = (name, value) => Object.defineProperty(win, name, { value, writable: true, configurable: true, enumerable: true });

  def("window", win);
  def("self", win);
  def("document", document);
  def("localStorage", localStorage);
  def("sessionStorage", createLocalStorage());
  def("isSecureContext", false);
  def("navigator", { userAgent: "node-test", clipboard: undefined, serviceWorker: undefined, language: "en-US" });
  def("location", { href: "http://localhost/", pathname: "/", search: "", hash: o.hash || "", origin: "http://localhost", reload() {} });
  def("history", { replaceState() {}, pushState() {}, back() {} });
  def("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
  def("scrollTo", () => {});
  def("scrollY", 0);
  def("innerWidth", 1280);
  def("innerHeight", 800);
  def("alert", () => {});
  def("confirm", () => (o.confirm === undefined ? true : o.confirm));
  def("prompt", () => (o.prompt === undefined ? "" : o.prompt));
  def("open", () => ({ document: new StubDocument(), focus() {}, print() {}, close() {} }));
  def("requestAnimationFrame", (fn) => setTimeout(fn, 0));
  def("cancelAnimationFrame", (id) => clearTimeout(id));
  def("getComputedStyle", () => ({ getPropertyValue: () => "" }));
  def("fetch", o.fetch || (async () => ({ ok: true, status: 200, headers: { get: () => null }, async text() { return "[]"; }, async json() { return []; } })));
  def("Blob", class Blob {
    constructor(parts, opts2) { this.parts = parts || []; this.type = (opts2 && opts2.type) || ""; }
    get size() { return this.parts.join("").length; }
    async text() { return this.parts.join(""); }
  });
  def("FileReader", class FileReader {
    readAsDataURL(file) { this.result = "data:" + ((file && file.type) || "application/octet-stream") + ";base64,"; setTimeout(() => this.onload && this.onload({ target: this }), 0); }
    readAsText(file) { this.result = String((file && file.name) || ""); setTimeout(() => this.onload && this.onload({ target: this }), 0); }
  });
  // globalThis.crypto is only on by default from Node 19; local-backend.js calls
  // crypto.getRandomValues to mint ids, and CI still runs Node 18.
  if (!win.crypto || typeof win.crypto.getRandomValues !== "function") def("crypto", require("crypto").webcrypto);
  if (!win.URL.createObjectURL) {
    win.URL.createObjectURL = (blob) => { const u = "blob:stub/" + objectUrls.size; objectUrls.set(u, blob); return u; };
    win.URL.revokeObjectURL = (u) => { objectUrls.delete(u); };
  }
  // The event-listener surface the app wires onto window itself.
  const winListeners = Object.create(null);
  def("addEventListener", (type, fn) => { (winListeners[type] || (winListeners[type] = [])).push(fn); });
  def("removeEventListener", (type, fn) => {
    const list = winListeners[type];
    if (!list) return;
    const i = list.indexOf(fn);
    if (i !== -1) list.splice(i, 1);
  });
  def("dispatchEvent", (ev) => {
    (winListeners[(ev && ev.type) || ""] || []).forEach((fn) => fn(ev));
    return true;
  });

  return { window: win, document, localStorage, StubElement, StubDocument };
}

module.exports = { installBrowserGlobals, createLocalStorage, StubElement, StubDocument, ClassList, parseSelector, selectorMatches };
