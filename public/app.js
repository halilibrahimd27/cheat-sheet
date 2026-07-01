// ============================================
// cheat-sheet — Full App with CRUD, Favorites,
// Tag Filters, Variable Fill, Drag & Drop,
// Notes, Import/Export, i18n
// ============================================
(function () {
  "use strict";

  let CATEGORIES = [];
  let activeCategory = null;
  let searchQuery = "";
  let collapsedSections = new Set();
  let favorites = JSON.parse(localStorage.getItem("cs-favorites") || "[]");
  let cmdHistory = JSON.parse(localStorage.getItem("cs-history") || "[]");
  let activeTag = "all";
  let categoryNotes = {};
  let writeups = [];
  let machines = [];
  let lang = localStorage.getItem("cs-lang") || "en";
  let dragSrcCatIdx = null;
  let focusedCmdIdx = -1;
  let pendingGo = false; // for g+key combos

  // i18n
  const T = {
    en: {
      allCommands: "All Commands", favorites: "Favorites", search: "Search commands...",
      newCategory: "+ New Category", exportBtn: "Export", importBtn: "Import",
      commands: "commands", categories: "categories", subcategories: "subcategories",
      noResults: "No commands found", tryDiff: "Try different keywords.",
      searchResults: "Search Results", matching: "matching",
      catName: "Category Name", catIcon: "Icon (emoji)", catDesc: "Description",
      subName: "Subcategory Name", cmdTitle: "Command Title", cmdDesc: "Description",
      cmdCommands: "Command(s)", cmdTags: "Tags", cmdNote: "Note (optional)",
      perLine: "One command per line. Use <PLACEHOLDER> for variables.",
      tagComma: "essential, tool, advanced (comma-separated)",
      cancel: "Cancel", save: "Save", addSub: "+ Sub", addCmd: "+ Cmd",
      edit: "Edit", del: "Delete", copy: "Copy", copied: "Copied!",
      confirmDelCat: "Delete this category and all commands?",
      confirmDelSub: "Delete this subcategory?", confirmDelCmd: "Delete this command?",
      fillVars: "Fill Placeholders", applyCopy: "Apply & Copy",
      notePlaceholder: "Write your notes here (Markdown supported)...",
      heroSubtitle: "Pentest Command Handbook",
      heroDesc: "A comprehensive collection of penetration testing commands organized by attack phase. Built for certification preparation and ethical security assessments.",
      educational: "Educational purposes only.", useResp: "Use responsibly and ethically.",
      machines: "Machines", addMachine: "+ New Machine", noMachines: "No machines yet",
      addMachineDesc: "Track target machines, services, credentials, and progress.",
      machineName: "Machine Name", machineIP: "IP Address", machineOS: "Operating System",
      services: "Services", credentials: "Credentials", notes: "Notes",
      exportMd: "Export MD", exportPdf: "Export PDF", termCopy: "Terminal Copy",
      newSub: "New Subcategory", netErr: "Network error - is the server running?",
      copyFail: "Copy failed", termCopied: "Copied in terminal format!",
      playbook: "Playbook", applyPlaybook: "Apply", progress: "Progress",
      currentPhase: "Current phase", nextSteps: "Next steps", allDone: "All done!",
      hosts: "Hosts", addHost: "+ Host", owned: "Owned", attackPath: "Attack Path",
      noHosts: "No extra hosts yet. Add domain / network machines here.",
      replacePlaybook: "Replace the current checklist with this playbook? Current progress will be lost.",
      copyCmd: "Copy command", defaultChecklist: "Default checklist",
      wuTemplate: "Template", wuMachine: "Link machine",
      history: "History", noHistory: "No copied commands yet.",
      clearHistory: "Clear", copyAll: "Copy all", paletteHint: "Search commands & actions…", goto: "Go to"
    },
    tr: {
      allCommands: "Tum Komutlar", favorites: "Favoriler", search: "Komut ara...",
      newCategory: "+ Yeni Kategori", exportBtn: "Disa Aktar", importBtn: "Ice Aktar",
      commands: "komut", categories: "kategori", subcategories: "alt kategori",
      noResults: "Komut bulunamadi", tryDiff: "Farkli anahtar kelimeler deneyin.",
      searchResults: "Arama Sonuclari", matching: "eslesen",
      catName: "Kategori Adi", catIcon: "Ikon (emoji)", catDesc: "Aciklama",
      subName: "Alt Kategori Adi", cmdTitle: "Komut Basligi", cmdDesc: "Aciklama",
      cmdCommands: "Komut(lar)", cmdTags: "Etiketler", cmdNote: "Not (istege bagli)",
      perLine: "Satir basina bir komut. Degiskenler icin <PLACEHOLDER> kullanin.",
      tagComma: "essential, tool, advanced (virgul ile ayirin)",
      cancel: "Iptal", save: "Kaydet", addSub: "+ Alt", addCmd: "+ Cmd",
      edit: "Duzenle", del: "Sil", copy: "Kopyala", copied: "Kopyalandi!",
      confirmDelCat: "Bu kategoriyi ve tum komutlari silinsin mi?",
      confirmDelSub: "Bu alt kategori silinsin mi?", confirmDelCmd: "Bu komut silinsin mi?",
      fillVars: "Degiskenleri Doldur", applyCopy: "Uygula ve Kopyala",
      notePlaceholder: "Notlarinizi buraya yazin...",
      heroSubtitle: "Sizma Testi Komut El Kitabi",
      heroDesc: "Sizma testi komutlarinin saldiri asamalarina gore duzenlenmis kapsamli bir koleksiyonu. Sertifika hazirlik ve etik guvenlik degerlendirmeleri icin.",
      educational: "Sadece egitim amaclidir.", useResp: "Sorumlu ve etik kullanin.",
      machines: "Makineler", addMachine: "+ Yeni Makine", noMachines: "Henuz makine yok",
      addMachineDesc: "Hedef makineleri, servisleri, kimlik bilgilerini ve ilerlemeyi takip edin.",
      machineName: "Makine Adi", machineIP: "IP Adresi", machineOS: "Isletim Sistemi",
      services: "Servisler", credentials: "Kimlik Bilgileri", notes: "Notlar",
      exportMd: "MD Aktar", exportPdf: "PDF Aktar", termCopy: "Terminal Kopyala",
      newSub: "Yeni Alt Kategori", netErr: "Ag hatasi - sunucu calisiyor mu?",
      copyFail: "Kopyalama basarisiz", termCopied: "Terminal formatinda kopyalandi!",
      playbook: "Oyun Kitabi", applyPlaybook: "Uygula", progress: "Ilerleme",
      currentPhase: "Mevcut asama", nextSteps: "Sonraki adimlar", allDone: "Tamamlandi!",
      hosts: "Makineler", addHost: "+ Makine", owned: "Ele gecirildi", attackPath: "Saldiri Yolu",
      noHosts: "Henuz ek makine yok. Domain / ag makinelerini buraya ekleyin.",
      replacePlaybook: "Mevcut kontrol listesi bu oyun kitabiyla degistirilsin mi? Mevcut ilerleme kaybolur.",
      copyCmd: "Komutu kopyala", defaultChecklist: "Varsayilan liste",
      wuTemplate: "Sablon", wuMachine: "Makine bagla",
      history: "Gecmis", noHistory: "Henuz kopyalanan komut yok.",
      clearHistory: "Temizle", copyAll: "Tumunu kopyala", paletteHint: "Komut ve eylem ara…", goto: "Git"
    }
  };
  function t(key) { return (T[lang] && T[lang][key]) || T.en[key] || key; }

  // DOM
  const $ = (s) => document.getElementById(s);
  const sidebar = $("sidebar"), sidebarNav = $("sidebarNav"), searchInput = $("searchInput");
  const contentArea = $("contentArea"), hero = $("hero"), heroStats = $("heroStats");
  const statsEl = $("stats"), currentSection = $("currentSection");
  const modalOverlay = $("modalOverlay"), modalTitle = $("modalTitle");
  const modalBody = $("modalBody"), modalSave = $("modalSave");
  const varBar = $("varBar"), varBarFields = $("varBarFields");
  const tagFilters = $("tagFilters");

  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  document.body.appendChild(overlay);

  // ── Screen-reader live region (announces copy / search results) ──
  const srStatus = document.createElement("div");
  srStatus.className = "sr-only";
  srStatus.setAttribute("aria-live", "polite");
  srStatus.setAttribute("aria-atomic", "true");
  document.body.appendChild(srStatus);
  function announce(msg) { if (!msg) return; srStatus.textContent = ""; setTimeout(() => { srStatus.textContent = msg; }, 30); }

  // ── Toast notifications ──
  let toastHost = null;
  function toast(msg, type) {
    if (!msg) return;
    if (!toastHost) {
      toastHost = document.createElement("div");
      toastHost.className = "toast-host";
      toastHost.setAttribute("aria-live", "polite");
      document.body.appendChild(toastHost);
    }
    const el = document.createElement("div");
    el.className = "toast" + (type ? " toast-" + type : "");
    el.textContent = msg;
    toastHost.appendChild(el);
    setTimeout(() => { el.classList.add("toast-out"); setTimeout(() => el.remove(), 300); }, 2600);
  }

  // ── Clipboard (works on http/LAN without a secure context; never fails silently) ──
  function fallbackCopy(text) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.focus(); ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch { return false; }
  }
  function copyText(text, onOk) {
    const ok = () => { if (onOk) onOk(); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(ok).catch(() => {
        if (fallbackCopy(text)) ok(); else toast(t("copyFail"), "error");
      });
    } else if (fallbackCopy(text)) {
      ok();
    } else {
      toast(t("copyFail"), "error");
    }
  }

  // ── API ──
  async function api(method, url, body) {
    const o = { method, headers: { "Content-Type": "application/json" } };
    if (body) o.body = JSON.stringify(body);
    let res;
    try {
      res = await fetch(url, o);
    } catch {
      toast(t("netErr"), "error");
      return null;
    }
    let data = null;
    try {
      const text = await res.text();
      if (text) data = JSON.parse(text);
    } catch { data = null; }
    if (!res.ok) {
      toast((data && data.error) ? data.error : ("HTTP " + res.status), "error");
    }
    return data;
  }
  async function loadData() {
    // Fetch all four collections in parallel instead of chaining four round-trips.
    await Promise.all([loadCategories(), loadNotes(), loadWriteups(), loadMachines()]);
    buildSearchIndex();
    render();
  }
  async function loadCategories() { CATEGORIES = await api("GET", "/api/categories") || []; }

  function getStats() {
    let tc = 0, ts = 0;
    CATEGORIES.forEach(c => c.subcategories.forEach(s => { ts++; tc += s.commands.length; }));
    return { tc, cats: CATEGORIES.length, ts };
  }

  // ── Favorites ──
  function favKey(catId, subIdx, cmdIdx) { return catId + ":" + subIdx + ":" + cmdIdx; }
  function isFav(catId, subIdx, cmdIdx) { return favorites.includes(favKey(catId, subIdx, cmdIdx)); }
  function toggleFav(catId, subIdx, cmdIdx) {
    const k = favKey(catId, subIdx, cmdIdx);
    const nowFav = !favorites.includes(k);
    if (nowFav) favorites.push(k); else favorites = favorites.filter(f => f !== k);
    localStorage.setItem("cs-favorites", JSON.stringify(favorites));
    if (activeCategory === "favs") { render(); return; }
    // Scoped update: flip the matching star(s) + refresh the cheap sidebar,
    // instead of rebuilding every command card in the view.
    document.querySelectorAll('.fav-btn[data-fav="' + k + '"]').forEach(b => b.classList.toggle("fav-active", nowFav));
    buildSidebar();
  }
  function getFavCommands() {
    const r = [];
    favorites.forEach(k => {
      const [cid, si, ci] = k.split(":");
      const cat = CATEGORIES.find(c => c.id === cid);
      if (!cat) return;
      const sub = cat.subcategories[parseInt(si)];
      if (!sub) return;
      const cmd = sub.commands[parseInt(ci)];
      if (cmd) r.push({ cmd, catId: cid, subIdx: parseInt(si), cmdIdx: parseInt(ci), subName: sub.name });
    });
    return r;
  }

  // ── Variable Fill ──
  let varBarCode = "";
  function openVarBar(code) {
    varBarCode = code;
    const vars = [...new Set(code.match(/<[A-Z_]+>/g) || [])];
    if (vars.length === 0) { copyText(code, () => toast(t("copied"), "ok")); return; }
    varBarFields.innerHTML = "";
    vars.forEach(v => {
      const saved = localStorage.getItem("cs-var-" + v) || "";
      const g = document.createElement("div");
      g.className = "var-field";
      g.innerHTML = '<label>' + v + '</label><input type="text" data-var="' + v + '" placeholder="' + v.replace(/[<>]/g, '') + '" value="' + escapeHtml(saved) + '">';
      varBarFields.appendChild(g);
    });
    varBar.classList.add("active");
    varBarFields.querySelector("input").focus();
  }
  $("varBarClose").addEventListener("click", () => varBar.classList.remove("active"));
  $("varBarApply").addEventListener("click", () => {
    let result = varBarCode;
    varBarFields.querySelectorAll("input").forEach(inp => {
      const v = inp.dataset.var, val = inp.value;
      if (val) { localStorage.setItem("cs-var-" + v, val); result = result.split(v).join(val); }
    });
    copyText(result, () => {
      recordHistory(result);
      $("varBarApply").textContent = "✓ " + t("copied");
      setTimeout(() => { $("varBarApply").textContent = t("applyCopy"); varBar.classList.remove("active"); }, 1200);
    });
  });

  // ── Quick IP Changer ──
  const ipBar = $("ipChangerBar");
  const ipFields = { LHOST: $("ipLhost"), RHOST: $("ipRhost"), LPORT: $("ipLport"), DOMAIN: $("ipDomain"), USER: $("ipUser") };
  const ipMap = { LHOST: ["<LHOST>", "<ATTACKER_IP>"], RHOST: ["<RHOST>", "<TARGET_IP>", "<RHOST_IP>"], LPORT: ["<LPORT>"], DOMAIN: ["<DOMAIN>", "<TARGET_DOMAIN>"], USER: ["<USER>", "<USERNAME>"] };
  function loadIpValues() { Object.keys(ipFields).forEach(k => { ipFields[k].value = localStorage.getItem("cs-ip-" + k) || ""; }); }
  function saveIpValues() {
    Object.keys(ipFields).forEach(k => {
      const v = ipFields[k].value.trim();
      localStorage.setItem("cs-ip-" + k, v);
      // Also sync with var-bar values
      (ipMap[k] || []).forEach(ph => { if (v) localStorage.setItem("cs-var-" + ph, v); });
    });
  }
  function applyIpToCode(code) {
    let result = code;
    Object.keys(ipFields).forEach(k => {
      const v = localStorage.getItem("cs-ip-" + k);
      if (v) (ipMap[k] || []).forEach(ph => { result = result.split(ph).join(v); });
    });
    return result;
  }
  loadIpValues();
  $("ipChangerToggle").addEventListener("click", () => ipBar.classList.toggle("active"));
  $("ipSaveBtn").addEventListener("click", () => {
    saveIpValues();
    $("ipSaveBtn").textContent = "Saved!"; setTimeout(() => $("ipSaveBtn").textContent = "Save", 1200);
  });
  $("ipClearBtn").addEventListener("click", () => {
    Object.keys(ipFields).forEach(k => { ipFields[k].value = ""; localStorage.removeItem("cs-ip-" + k); });
  });
  // Auto-save on Enter in ip fields
  Object.values(ipFields).forEach(inp => inp.addEventListener("keydown", e => { if (e.key === "Enter") { saveIpValues(); $("ipSaveBtn").textContent = "Saved!"; setTimeout(() => $("ipSaveBtn").textContent = "Save", 1200); } }));

  // ── Modal ──
  let modalCallback = null;
  let lastModalFocus = null;
  const modalEl = $("modal");
  function focusableIn(container) {
    return Array.prototype.slice.call(container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.offsetParent !== null);
  }
  function trapFocus(container, e) {
    if (e.key !== "Tab") return;
    const list = focusableIn(container);
    if (!list.length) return;
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  modalEl.addEventListener("keydown", e => trapFocus(modalEl, e));
  function openModal(title, fields, data, cb) {
    modalTitle.textContent = title; modalCallback = cb; modalBody.innerHTML = "";
    fields.forEach(f => {
      const g = document.createElement("div"); g.className = "form-group";
      const l = document.createElement("label"); l.textContent = f.label; l.setAttribute("for", "field-" + f.key); g.appendChild(l);
      if (f.type === "textarea") {
        const ta = document.createElement("textarea"); ta.id = "field-" + f.key; ta.rows = f.rows || 4; ta.placeholder = f.placeholder || ""; ta.value = data[f.key] || ""; g.appendChild(ta);
      } else if (f.type === "select") {
        const sel = document.createElement("select"); sel.id = "field-" + f.key; sel.className = "form-select";
        const cur = data[f.key] !== undefined ? data[f.key] : f.value;
        (f.options || []).forEach(o => { const opt = document.createElement("option"); opt.value = o.value; opt.textContent = o.label; if (o.value === cur) opt.selected = true; sel.appendChild(opt); });
        g.appendChild(sel);
      } else {
        const inp = document.createElement("input"); inp.type = "text"; inp.id = "field-" + f.key; inp.placeholder = f.placeholder || ""; inp.value = data[f.key] || ""; g.appendChild(inp);
      }
      if (f.hint) { const h = document.createElement("span"); h.className = "form-hint"; h.textContent = f.hint; g.appendChild(h); }
      modalBody.appendChild(g);
    });
    modalOverlay.classList.add("active");
    lastModalFocus = document.activeElement;
    const firstField = modalBody.querySelector("input, textarea");
    setTimeout(() => { (firstField || modalSave).focus(); }, 0);
  }
  function closeModal() {
    modalOverlay.classList.remove("active"); modalCallback = null;
    if (lastModalFocus && lastModalFocus.focus) lastModalFocus.focus();
    lastModalFocus = null;
  }
  function getModalData() { const d = {}; modalBody.querySelectorAll("input, textarea, select").forEach(el => { d[el.id.replace("field-", "")] = el.value; }); return d; }
  $("modalClose").addEventListener("click", closeModal);
  $("modalCancel").addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });
  modalSave.addEventListener("click", async () => { if (modalCallback) { await modalCallback(getModalData()); closeModal(); await loadData(); } });

  // ── CRUD ──
  $("addCategoryBtn").addEventListener("click", () => {
    openModal(t("newCategory"), [
      { key: "name", label: t("catName"), placeholder: "e.g., Buffer Overflow" },
      { key: "icon", label: t("catIcon"), placeholder: "💥" },
      { key: "description", label: t("catDesc"), type: "textarea" }
    ], {}, async d => { await api("POST", "/api/categories", d); });
  });
  function editCategory(cat) {
    openModal(t("edit") + " Category", [
      { key: "name", label: t("catName") }, { key: "icon", label: t("catIcon") },
      { key: "description", label: t("catDesc"), type: "textarea" }
    ], cat, async d => { await api("PUT", "/api/categories/" + cat.id, d); });
  }
  async function deleteCategory(cat) {
    if (!confirm(t("confirmDelCat"))) return;
    await api("DELETE", "/api/categories/" + cat.id);
    if (activeCategory === cat.id) activeCategory = null;
    await loadData();
  }
  function addSubcategory(catId) {
    openModal(t("newSub"), [{ key: "name", label: t("subName") }], {}, async d => { await api("POST", "/api/categories/" + catId + "/subcategories", d); });
  }
  function editSubcategory(catId, subIdx, sub) {
    openModal(t("edit"), [{ key: "name", label: t("subName") }], sub, async d => { await api("PUT", "/api/categories/" + catId + "/subcategories/" + subIdx, d); });
  }
  async function deleteSubcategory(catId, subIdx) {
    if (!confirm(t("confirmDelSub"))) return;
    await api("DELETE", "/api/categories/" + catId + "/subcategories/" + subIdx); await loadData();
  }
  function openCmdModal(title, data, cb) {
    openModal(title, [
      { key: "title", label: t("cmdTitle") }, { key: "desc", label: t("cmdDesc") },
      { key: "commands", label: t("cmdCommands"), type: "textarea", rows: 5, hint: t("perLine") },
      { key: "tags", label: t("cmdTags"), placeholder: t("tagComma") },
      { key: "note", label: t("cmdNote"), type: "textarea", rows: 2 }
    ], {
      title: data.title || "", desc: data.desc || "",
      commands: (data.cmds || (data.cmd ? [data.cmd] : [])).join("\n"),
      tags: (data.tags || []).join(", "), note: data.note || ""
    }, async fd => {
      const lines = fd.commands.split("\n").map(l => l.trim()).filter(Boolean);
      const tags = fd.tags.split(",").map(s => s.trim()).filter(Boolean);
      const p = { title: fd.title, desc: fd.desc, tags };
      if (fd.note) p.note = fd.note;
      if (lines.length > 1) p.cmds = lines; else if (lines.length === 1) p.cmd = lines[0];
      await cb(p);
    });
  }
  function addCommand(catId, subIdx) { openCmdModal(t("addCmd"), {}, async p => { await api("POST", "/api/categories/" + catId + "/subcategories/" + subIdx + "/commands", p); }); }
  function editCommand(catId, subIdx, cmdIdx, cmd) { openCmdModal(t("edit"), cmd, async p => { await api("PUT", "/api/categories/" + catId + "/subcategories/" + subIdx + "/commands/" + cmdIdx, p); }); }
  async function deleteCommand(catId, subIdx, cmdIdx) {
    if (!confirm(t("confirmDelCmd"))) return;
    await api("DELETE", "/api/categories/" + catId + "/subcategories/" + subIdx + "/commands/" + cmdIdx); await loadData();
  }

  // ── Notes (multiple per category, server-backed) ──
  async function loadNotes() { categoryNotes = await api("GET", "/api/notes") || {}; }
  function getNotes(catId) { return categoryNotes[catId] || []; }
  function getNotesCount(catId) { return (categoryNotes[catId] || []).length; }
  async function addNote(catId) {
    await api("POST", "/api/notes/" + catId, { text: "" });
    await loadNotes(); render();
  }
  let noteTimers = {};
  function saveNoteText(catId, noteId, text) {
    clearTimeout(noteTimers[noteId]);
    noteTimers[noteId] = setTimeout(() => api("PUT", "/api/notes/" + catId + "/" + noteId, { text }), 400);
  }
  async function deleteNote(catId, noteId) {
    if (!confirm(lang === "tr" ? "Bu notu silinsin mi?" : "Delete this note?")) return;
    await api("DELETE", "/api/notes/" + catId + "/" + noteId);
    await loadNotes(); render();
  }

  // ── Write-ups (server-backed, file-style) ──
  let openWriteupId = null;
  async function loadWriteups() { writeups = await api("GET", "/api/writeups") || []; }

  // Static, offline report boilerplate — inserted client-side, never fetched.
  const WRITEUP_TEMPLATES = {
    htb: `# {TITLE}

**Platform:** HackTheBox   **Difficulty:**
**IP:** \`<TARGET_IP>\`   **OS:**

## Recon

\`\`\`
nmap -p- --min-rate 5000 -oA nmap/all <TARGET_IP>
nmap -sC -sV -p<PORT> -oA nmap/svc <TARGET_IP>
\`\`\`

## Enumeration

## Foothold

## Privilege Escalation

## Loot

- user.txt:
- root.txt:

## Lessons Learned
`,
    oscp: `# {TITLE}

## Vulnerability

## Proof of Concept

\`\`\`
\`\`\`

## Exploitation Steps

1.
2.

## Proof (local.txt / proof.txt)

\`\`\`
\`\`\`

## Remediation
`,
    ad: `# {TITLE}

**Domain:** \`<DOMAIN>\`   **DC:** \`<DC_IP>\`

## Recon

## Initial Foothold

## Credential Access

## Lateral Movement

## Domain Privilege Escalation

## Domain Admin

## Attack Path

\`\`\`
user -> ... -> Domain Admin
\`\`\`
`
  };

  // Allow only safe URL schemes in rendered markdown (blocks javascript: etc.).
  function mdSafeUrl(u) {
    u = String(u == null ? "" : u).trim();
    return /^(https?:\/\/|\/uploads\/|\/|data:image\/)/i.test(u) ? u : "#";
  }
  // Minimal, XSS-safe Markdown → HTML. Escapes first, then applies formatting;
  // fenced code is pulled out to placeholders so its content is never re-parsed.
  function renderMarkdown(src) {
    const blocks = [];
    let h = escapeHtml(src == null ? "" : src);
    h = h.replace(/```([\s\S]*?)```/g, (m, code) => { blocks.push(code.replace(/^\n/, "")); return "ZZCODEBLOCKZZ" + (blocks.length - 1) + "ZZ"; });
    h = h.replace(/^(#{1,6})\s+(.*)$/gm, (m, hh, txt) => { const lvl = Math.min(hh.length + 1, 6); return "<h" + lvl + " class=\"wu-heading\">" + txt + "</h" + lvl + ">"; });
    h = h.replace(/^\s*(?:---|\*\*\*)\s*$/gm, "<hr class=\"wu-hr\">");
    h = h.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) => "<div class=\"wu-img-container\"><img src=\"" + mdSafeUrl(url) + "\" alt=\"" + alt + "\" class=\"wu-read-img\"><span class=\"wu-img-caption\">" + alt + "</span></div>");
    h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, url) => "<a href=\"" + mdSafeUrl(url) + "\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"wu-link\">" + txt + "</a>");
    h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    h = h.replace(/`([^`]+)`/g, "<code class=\"wu-inline-code\">$1</code>");
    h = h.replace(/(?:^|\n)((?:[-*] .*(?:\n|$))+)/g, (m, block) => "\n<ul class=\"wu-list\">" + block.trim().split(/\n/).map(l => "<li>" + l.replace(/^[-*]\s+/, "") + "</li>").join("") + "</ul>");
    h = h.replace(/\n/g, "<br>");
    h = h.replace(/<br>\s*(<(?:h[1-6]|pre|ul|hr|div)[^>]*>)/g, "$1").replace(/(<\/(?:h[1-6]|pre|ul|div)>)\s*<br>/g, "$1").replace(/(<hr[^>]*>)\s*<br>/g, "$1");
    h = h.replace(/ZZCODEBLOCKZZ(\d+)ZZ/g, (m, i) => "<pre class=\"wu-code-block\">" + blocks[+i] + "</pre>");
    return h;
  }
  function insertAtCursor(ta, text) {
    const s = ta.selectionStart != null ? ta.selectionStart : ta.value.length;
    const e = ta.selectionEnd != null ? ta.selectionEnd : ta.value.length;
    ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
    ta.selectionStart = ta.selectionEnd = s + text.length;
    ta.focus();
  }
  async function createWriteup() {
    openModal("New Write-up", [
      { key: "title", label: "Title", placeholder: "e.g., HackTheBox — Lame" },
      { key: "tags", label: "Tags", placeholder: "HTB, OSCP, Linux, Easy (comma-separated)" }
    ], {}, async fd => {
      const tags = fd.tags.split(",").map(s => s.trim()).filter(Boolean);
      const wu = await api("POST", "/api/writeups", { title: fd.title, tags, content: "" });
      if (!wu || !wu.id) return;
      await loadWriteups();
      openWriteupId = wu.id; wuEditMode = true;
      render();
    });
  }
  async function deleteWriteup(id, e) {
    if (e) e.stopPropagation();
    if (!confirm("Delete this write-up?")) return;
    await api("DELETE", "/api/writeups/" + id);
    if (openWriteupId === id) openWriteupId = null;
    await loadWriteups(); render();
  }
  let wuTimer = null;
  function saveWu(id, data) {
    clearTimeout(wuTimer);
    wuTimer = setTimeout(() => api("PUT", "/api/writeups/" + id, data), 400);
  }

  function renderWriteupsPage() {
    currentSection.textContent = "Write-ups"; hero.style.display = "none";
    contentArea.innerHTML = "";

    // If a write-up is open, show editor view
    if (openWriteupId) {
      const wu = writeups.find(w => w.id === openWriteupId);
      if (!wu) { openWriteupId = null; renderWriteupsPage(); return; }
      renderWriteupEditor(wu);
      return;
    }

    // File list view
    const hdr = document.createElement("div"); hdr.className = "writeups-header";
    hdr.innerHTML = '<div class="wu-header-top"><h2>📝 Write-ups</h2><button class="btn btn-primary" id="newWuBtn">+ New Write-up</button></div>' +
      '<p>' + (lang === "tr" ? "Pentest notlarinizi ve write-up\'larinizi buraya yazin. Tiklayin ve duzenlemeye baslayin." : "Document your pentest findings and write-ups. Click to open and edit.") + '</p>';
    contentArea.appendChild(hdr);
    hdr.querySelector("#newWuBtn").addEventListener("click", createWriteup);

    if (writeups.length === 0) {
      const empty = document.createElement("div"); empty.className = "no-results";
      empty.innerHTML = '<h3>' + (lang === "tr" ? "Henuz write-up yok" : "No write-ups yet") + '</h3><p>' + (lang === "tr" ? "Ilk write-up\'inizi olusturun." : "Create your first write-up.") + '</p>';
      contentArea.appendChild(empty);
      return;
    }

    const grid = document.createElement("div"); grid.className = "wu-file-grid";
    writeups.forEach(wu => {
      const file = document.createElement("div"); file.className = "wu-file-card";
      file.setAttribute("role", "button"); file.setAttribute("tabindex", "0");
      file.setAttribute("aria-label", wu.title);
      const tagsH = (wu.tags || []).map(t => '<span class="wu-tag">' + escapeHtml(t) + '</span>').join("");
      const date = new Date(wu.updatedAt).toLocaleDateString();
      const preview = (wu.content || "").substring(0, 120).replace(/\n/g, " ");
      file.innerHTML =
        '<div class="wu-file-icon">📄</div>' +
        '<div class="wu-file-info">' +
          '<div class="wu-file-name">' + escapeHtml(wu.title) + '</div>' +
          '<div class="wu-file-preview">' + escapeHtml(preview) + (preview.length >= 120 ? "..." : "") + '</div>' +
          '<div class="wu-file-meta"><span class="wu-date">' + date + '</span>' + tagsH + '</div>' +
        '</div>' +
        '<button class="wu-file-delete" title="Delete">🗑</button>';
      file.addEventListener("click", () => { openWriteupId = wu.id; render(); });
      file.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target === file) { e.preventDefault(); openWriteupId = wu.id; render(); } });
      file.querySelector(".wu-file-delete").addEventListener("click", e => deleteWriteup(wu.id, e));
      grid.appendChild(file);
    });
    contentArea.appendChild(grid);
  }

  let wuEditMode = false;

  function renderWriteupEditor(wu) {
    const page = document.createElement("div"); page.className = "wu-editor-page";

    // Top bar
    const topbar = document.createElement("div"); topbar.className = "wu-editor-topbar";
    topbar.innerHTML =
      '<button class="wu-back-btn">\u2190 ' + (lang === "tr" ? "Geri" : "Back") + '</button>' +
      '<div class="wu-editor-status" id="wuStatus"></div>' +
      '<div class="wu-topbar-actions">' +
        '<button class="btn btn-secondary btn-sm wu-export-md-btn">' + t("exportMd") + '</button>' +
        '<button class="btn btn-secondary btn-sm wu-export-pdf-btn">' + t("exportPdf") + '</button>' +
        (wuEditMode
          ? '<button class="btn btn-primary btn-sm wu-save-btn">\uD83D\uDCBE ' + (lang === "tr" ? "Kaydet" : "Save") + '</button>'
          : '<button class="btn btn-secondary btn-sm wu-edit-btn">\u270E ' + (lang === "tr" ? "Duzenle" : "Edit") + '</button>'
        ) +
        '<button class="wu-delete-btn">\uD83D\uDDD1</button>' +
      '</div>';
    topbar.querySelector(".wu-back-btn").addEventListener("click", () => { openWriteupId = null; wuEditMode = false; render(); });
    topbar.querySelector(".wu-delete-btn").addEventListener("click", () => deleteWriteup(wu.id));
    topbar.querySelector(".wu-export-md-btn").addEventListener("click", () => exportWriteupMd(wu));
    topbar.querySelector(".wu-export-pdf-btn").addEventListener("click", () => exportWriteupPdf(wu));
    if (wuEditMode) {
      topbar.querySelector(".wu-save-btn").addEventListener("click", async () => {
        wuEditMode = false;
        await loadWriteups(); render();
      });
    } else {
      topbar.querySelector(".wu-edit-btn").addEventListener("click", () => { wuEditMode = true; render(); });
    }
    page.appendChild(topbar);

    if (wuEditMode) {
      // ── EDIT MODE (split editor + live preview) ──
      const titleInput = document.createElement("input"); titleInput.className = "wu-page-title";
      titleInput.value = wu.title; titleInput.placeholder = "Write-up title..."; titleInput.setAttribute("aria-label", "Title");
      titleInput.addEventListener("input", () => { saveWu(wu.id, { title: titleInput.value }); showStatus(); });
      page.appendChild(titleInput);

      const tagsRow = document.createElement("div"); tagsRow.className = "wu-page-tags";
      const tagsH = (wu.tags || []).map(t => '<span class="wu-tag">' + escapeHtml(t) + '</span>').join("");
      tagsRow.innerHTML = tagsH + '<button class="wu-edit-tags-btn">✎ tags</button>';
      tagsRow.querySelector(".wu-edit-tags-btn").addEventListener("click", () => {
        openModal("Edit Tags", [{ key: "tags", label: "Tags", placeholder: "HTB, OSCP, Linux" }],
          { tags: (wu.tags || []).join(", ") },
          async fd => { const tags = fd.tags.split(",").map(s => s.trim()).filter(Boolean); await api("PUT", "/api/writeups/" + wu.id, { tags }); await loadWriteups(); render(); });
      });
      page.appendChild(tagsRow);

      // Toolbar: template + machine link + image
      const toolbar = document.createElement("div"); toolbar.className = "wu-toolbar";
      const tplSel = document.createElement("select"); tplSel.className = "form-select wu-tool-select"; tplSel.setAttribute("aria-label", t("wuTemplate"));
      tplSel.innerHTML = '<option value="">📄 ' + t("wuTemplate") + '…</option><option value="htb">HTB</option><option value="oscp">OSCP</option><option value="ad">Active Directory</option>';
      const mcSel = document.createElement("select"); mcSel.className = "form-select wu-tool-select"; mcSel.setAttribute("aria-label", t("wuMachine"));
      mcSel.innerHTML = '<option value="">🔗 ' + t("wuMachine") + '…</option>' + machines.map(mm => '<option value="' + mm.id + '">' + escapeHtml(mm.name) + (mm.ip ? " (" + escapeHtml(mm.ip) + ")" : "") + '</option>').join("");
      const imgBtn = document.createElement("button"); imgBtn.className = "btn btn-secondary btn-sm"; imgBtn.textContent = "📷 " + (lang === "tr" ? "Gorsel" : "Image");
      const imgInput = document.createElement("input"); imgInput.type = "file"; imgInput.accept = "image/*"; imgInput.style.display = "none";
      toolbar.appendChild(tplSel); toolbar.appendChild(mcSel); toolbar.appendChild(imgBtn); toolbar.appendChild(imgInput);
      page.appendChild(toolbar);

      // Split: editor | live preview
      const split = document.createElement("div"); split.className = "wu-split";
      const editor = document.createElement("textarea"); editor.className = "wu-page-editor"; editor.setAttribute("aria-label", "Markdown content");
      editor.value = wu.content || "";
      editor.placeholder = lang === "tr" ? "Markdown yazin — sagda canli onizleme..." : "Write Markdown — live preview on the right...";
      const preview = document.createElement("div"); preview.className = "wu-preview wu-read-body";
      function syncPreview() { preview.innerHTML = renderMarkdown(editor.value); }
      function commit() { saveWu(wu.id, { content: editor.value }); showStatus(); syncPreview(); }
      editor.addEventListener("input", commit);
      split.appendChild(editor); split.appendChild(preview);
      page.appendChild(split);
      syncPreview();

      // Image upload (button, paste, drag-drop)
      async function uploadImage(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          const res = await api("POST", "/api/upload", { data: reader.result, filename: file.name || "image.png" });
          if (res && res.url) { insertAtCursor(editor, "\n![" + (file.name || "image") + "](" + res.url + ")\n"); commit(); }
        };
        reader.readAsDataURL(file);
      }
      imgBtn.addEventListener("click", () => imgInput.click());
      imgInput.addEventListener("change", e => { uploadImage(e.target.files[0]); e.target.value = ""; });
      editor.addEventListener("paste", e => {
        const items = (e.clipboardData && e.clipboardData.items) || [];
        for (const it of items) { if (it.type && it.type.indexOf("image") === 0) { e.preventDefault(); uploadImage(it.getAsFile()); break; } }
      });
      editor.addEventListener("dragover", e => { e.preventDefault(); editor.classList.add("dragging"); });
      editor.addEventListener("dragleave", () => editor.classList.remove("dragging"));
      editor.addEventListener("drop", e => {
        e.preventDefault(); editor.classList.remove("dragging");
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f && f.type && f.type.indexOf("image") === 0) uploadImage(f);
      });

      // Template inserter
      tplSel.addEventListener("change", () => {
        const key = tplSel.value; tplSel.value = "";
        if (!key || !WRITEUP_TEMPLATES[key]) return;
        const tpl = WRITEUP_TEMPLATES[key].replace(/\{TITLE\}/g, wu.title || "Write-up");
        if (editor.value.trim() && !confirm(lang === "tr" ? "Sablon mevcut icerige eklensin mi?" : "Append this template to the current content?")) return;
        editor.value = editor.value.trim() ? (editor.value.replace(/\s+$/, "") + "\n\n" + tpl) : tpl;
        commit(); editor.focus();
      });
      // Machine cross-link
      mcSel.addEventListener("change", () => {
        const mm = machines.find(x => x.id === mcSel.value); mcSel.value = "";
        if (!mm) return;
        insertAtCursor(editor, "\n**Target:** " + (mm.name || "") + (mm.ip ? " (`" + mm.ip + "`)" : "") + (mm.os ? " — " + mm.os : "") + "\n");
        commit();
      });

      setTimeout(() => editor.focus(), 100);
    } else {
      // ── READ MODE ──
      const title = document.createElement("h1"); title.className = "wu-read-title"; title.textContent = wu.title;
      page.appendChild(title);

      const tagsRow = document.createElement("div"); tagsRow.className = "wu-page-tags";
      tagsRow.innerHTML = (wu.tags || []).map(t => '<span class="wu-tag">' + escapeHtml(t) + '</span>').join("");
      page.appendChild(tagsRow);

      const dateLine = document.createElement("div"); dateLine.className = "wu-page-date";
      dateLine.textContent = (lang === "tr" ? "Son guncelleme: " : "Last updated: ") + new Date(wu.updatedAt).toLocaleString();
      page.appendChild(dateLine);

      const body = document.createElement("div"); body.className = "wu-read-body";
      const content = wu.content || (lang === "tr" ? "Henuz icerik yok. Duzenle butonuna tiklayin." : "No content yet. Click Edit to start writing.");
      body.innerHTML = renderMarkdown(content);
      page.appendChild(body);
    }

    contentArea.appendChild(page);

    function showStatus() {
      const st = document.getElementById("wuStatus");
      if (st) { st.textContent = "saving..."; clearTimeout(st._t); st._t = setTimeout(() => st.textContent = "✓ saved", 600); }
    }
  }

  // ── Machines (target tracking) ──
  let openMachineId = null;
  async function loadMachines() { machines = await api("GET", "/api/machines") || []; }

  // Static checklist playbooks (from checklist-templates.js — baked, offline).
  function machineTemplates() { return window.CHECKLIST_TEMPLATES || []; }
  function templateById(id) { return machineTemplates().find(x => x.id === id) || null; }
  function templateToChecklist(tpl) {
    const out = [];
    tpl.phases.forEach((ph, pi) => ph.items.forEach((it, ii) => {
      out.push({ id: tpl.id + "-" + pi + "-" + ii, label: it.label, hint: it.hint || "", phase: ph.name, done: false });
    }));
    return out;
  }
  function groupByPhase(checklist) {
    const groups = [], seen = {};
    (checklist || []).forEach((item, i) => {
      const phase = item.phase || "Checklist";
      if (seen[phase] === undefined) { seen[phase] = groups.length; groups.push({ phase, items: [] }); }
      groups[seen[phase]].items.push({ item, i });
    });
    return groups;
  }
  function currentPhaseName(m) {
    for (const g of groupByPhase(m.checklist)) { if (g.items.some(x => !x.item.done)) return g.phase; }
    return null;
  }
  function osIconFor(os) {
    const s = (os || "").toLowerCase();
    if (s.includes("windows")) return "🪟";
    if (s.includes("linux")) return "🐧";
    if (s.includes("ad") || s.includes("domain") || s.includes("active dir")) return "🏢";
    return "🖥";
  }
  async function createMachine() {
    const tplOpts = [{ value: "", label: t("defaultChecklist") }]
      .concat(machineTemplates().map(tpl => ({ value: tpl.id, label: tpl.icon + " " + tpl.name })));
    openModal(t("addMachine"), [
      { key: "name", label: t("machineName"), placeholder: "e.g., Lame" },
      { key: "ip", label: t("machineIP"), placeholder: "10.10.10.3" },
      { key: "os", label: t("machineOS"), placeholder: "Linux / Windows" },
      { key: "template", label: t("playbook"), type: "select", options: tplOpts }
    ], {}, async fd => {
      const m = await api("POST", "/api/machines", { name: fd.name, ip: fd.ip, os: fd.os });
      if (!m || !m.id) return;
      const tpl = fd.template ? templateById(fd.template) : null;
      if (tpl) await api("PUT", "/api/machines/" + m.id, { template: tpl.id, checklist: templateToChecklist(tpl) });
      await loadMachines(); openMachineId = m.id; render();
    });
  }
  async function deleteMachine(id, e) {
    if (e) e.stopPropagation();
    if (!confirm(lang === "tr" ? "Bu makineyi silinsin mi?" : "Delete this machine?")) return;
    await api("DELETE", "/api/machines/" + id);
    if (openMachineId === id) openMachineId = null;
    await loadMachines(); render();
  }
  let machineTimer = null;
  function saveMachine(id, data) {
    clearTimeout(machineTimer);
    machineTimer = setTimeout(() => api("PUT", "/api/machines/" + id, data), 400);
  }

  function renderMachinesPage() {
    currentSection.textContent = t("machines"); hero.style.display = "none"; contentArea.innerHTML = "";

    if (openMachineId) {
      const m = machines.find(x => x.id === openMachineId);
      if (!m) { openMachineId = null; renderMachinesPage(); return; }
      renderMachineDetail(m);
      return;
    }

    const hdr = document.createElement("div"); hdr.className = "writeups-header";
    hdr.innerHTML = '<div class="wu-header-top"><h2>🖥 ' + t("machines") + '</h2><button class="btn btn-primary" id="newMachineBtn">' + t("addMachine") + '</button></div>' +
      '<p>' + t("addMachineDesc") + '</p>';
    contentArea.appendChild(hdr);
    hdr.querySelector("#newMachineBtn").addEventListener("click", createMachine);

    if (machines.length === 0) {
      const empty = document.createElement("div"); empty.className = "no-results";
      empty.innerHTML = '<h3>' + t("noMachines") + '</h3><p>' + t("addMachineDesc") + '</p>';
      contentArea.appendChild(empty);
      return;
    }

    const grid = document.createElement("div"); grid.className = "machine-grid";
    machines.forEach(m => {
      const done = (m.checklist || []).filter(c => c.done).length;
      const total = (m.checklist || []).length;
      const pct = total > 0 ? Math.round(done / total * 100) : 0;
      const osIcon = osIconFor(m.os);
      const tpl = m.template ? templateById(m.template) : null;
      const phase = currentPhaseName(m);
      const card = document.createElement("div"); card.className = "machine-card";
      card.setAttribute("role", "button"); card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", m.name + (m.ip ? ", " + m.ip : ""));
      card.innerHTML =
        '<div class="machine-card-top">' +
          '<span class="machine-os-icon">' + osIcon + '</span>' +
          '<div class="machine-info"><div class="machine-name">' + escapeHtml(m.name) + '</div><div class="machine-ip">' + escapeHtml(m.ip || "No IP") + '</div></div>' +
          '<button class="machine-del-btn" title="Delete" aria-label="Delete machine">🗑</button>' +
        '</div>' +
        (tpl ? '<div class="machine-card-badge">' + tpl.icon + ' ' + escapeHtml(tpl.name) + '</div>' : '') +
        '<div class="machine-progress"><div class="machine-progress-bar"><div class="machine-progress-fill" style="width:' + pct + '%"></div></div><span class="machine-progress-text">' + done + '/' + total + ' (' + pct + '%)</span></div>' +
        (total > 0 ? '<div class="machine-card-phase' + (phase ? '' : ' done') + '">' + (phase ? '▸ ' + escapeHtml(phase) : '✅ ' + t("allDone")) + '</div>' : '');
      card.addEventListener("click", () => { openMachineId = m.id; render(); });
      card.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target === card) { e.preventDefault(); openMachineId = m.id; render(); } });
      card.querySelector(".machine-del-btn").addEventListener("click", e => deleteMachine(m.id, e));
      grid.appendChild(card);
    });
    contentArea.appendChild(grid);
  }

  function renderMachineDetail(m) {
    const page = document.createElement("div"); page.className = "machine-detail";

    // Top bar
    const topbar = document.createElement("div"); topbar.className = "wu-editor-topbar";
    topbar.innerHTML = '<button class="wu-back-btn">\u2190 ' + (lang === "tr" ? "Geri" : "Back") + '</button>' +
      '<div class="wu-editor-status" id="machineStatus"></div>' +
      '<button class="wu-delete-btn">🗑</button>';
    topbar.querySelector(".wu-back-btn").addEventListener("click", () => { openMachineId = null; render(); });
    topbar.querySelector(".wu-delete-btn").addEventListener("click", () => deleteMachine(m.id));
    page.appendChild(topbar);

    // Header with editable IP / OS
    const info = document.createElement("div"); info.className = "machine-info-section";
    info.innerHTML =
      '<div class="machine-detail-header">' +
        '<span class="machine-detail-icon">' + osIconFor(m.os) + '</span>' +
        '<div class="machine-detail-meta">' +
          '<h1 class="machine-detail-name">' + escapeHtml(m.name) + '</h1>' +
          '<div class="machine-meta-fields">' +
            '<input class="machine-meta-input" data-k="ip" placeholder="IP" value="' + escapeHtml(m.ip || "") + '" aria-label="IP">' +
            '<input class="machine-meta-input" data-k="os" placeholder="OS" value="' + escapeHtml(m.os || "") + '" aria-label="OS">' +
          '</div>' +
        '</div>' +
      '</div>';
    info.querySelectorAll(".machine-meta-input").forEach(inp => inp.addEventListener("input", () => {
      m[inp.dataset.k] = inp.value; const patch = {}; patch[inp.dataset.k] = inp.value;
      saveMachine(m.id, patch); showMachineStatus();
    }));
    page.appendChild(info);

    // Playbook selector — swaps in a situation-aware checklist template
    const pbRow = document.createElement("div"); pbRow.className = "machine-playbook-row";
    const pbLabel = document.createElement("span"); pbLabel.className = "machine-playbook-label"; pbLabel.textContent = "📖 " + t("playbook");
    const pbSel = document.createElement("select"); pbSel.className = "form-select machine-playbook-select"; pbSel.setAttribute("aria-label", t("playbook"));
    const optDef = document.createElement("option"); optDef.value = ""; optDef.textContent = t("defaultChecklist");
    if (!m.template) optDef.selected = true; pbSel.appendChild(optDef);
    machineTemplates().forEach(tpl => { const o = document.createElement("option"); o.value = tpl.id; o.textContent = tpl.icon + " " + tpl.name; if (m.template === tpl.id) o.selected = true; pbSel.appendChild(o); });
    pbSel.addEventListener("change", async () => {
      const id = pbSel.value;
      if ((m.checklist || []).some(c => c.done) && !confirm(t("replacePlaybook"))) { pbSel.value = m.template || ""; return; }
      const tpl = id ? templateById(id) : null;
      m.template = id; m.checklist = tpl ? templateToChecklist(tpl) : [];
      await api("PUT", "/api/machines/" + m.id, { template: id, checklist: m.checklist });
      render();
    });
    pbRow.appendChild(pbLabel); pbRow.appendChild(pbSel);
    page.appendChild(pbRow);

    // Progress overview + next steps
    const total = (m.checklist || []).length;
    const done = (m.checklist || []).filter(c => c.done).length;
    const pct = total > 0 ? Math.round(done / total * 100) : 0;
    const curPhase = currentPhaseName(m);
    const nextItems = (m.checklist || []).filter(c => !c.done).slice(0, 3);
    if (total > 0) {
      const overview = document.createElement("div"); overview.className = "machine-overview";
      overview.innerHTML =
        '<div class="machine-overview-top">' +
          '<div class="machine-overview-pct">' + pct + '%</div>' +
          '<div class="machine-overview-info">' +
            '<div class="machine-overview-phase">' + (curPhase ? t("currentPhase") + ': <strong>' + escapeHtml(curPhase) + '</strong>' : t("allDone")) + '</div>' +
            '<div class="machine-overview-bar"><div class="machine-overview-fill" style="width:' + pct + '%"></div></div>' +
            '<div class="machine-overview-count">' + done + '/' + total + '</div>' +
          '</div>' +
        '</div>' +
        (nextItems.length ? '<div class="machine-nextsteps"><span class="machine-nextsteps-label">' + t("nextSteps") + '</span><ul>' + nextItems.map(it => '<li>' + escapeHtml(it.label) + '</li>').join("") + '</ul></div>' : '');
      page.appendChild(overview);
    }

    function updateProgressUI() {
      const tt = (m.checklist || []).length;
      const dd = (m.checklist || []).filter(c => c.done).length;
      const pp = tt > 0 ? Math.round(dd / tt * 100) : 0;
      const fill = page.querySelector(".machine-overview-fill"); if (fill) fill.style.width = pp + "%";
      const pctEl = page.querySelector(".machine-overview-pct"); if (pctEl) pctEl.textContent = pp + "%";
      const cntEl = page.querySelector(".machine-overview-count"); if (cntEl) cntEl.textContent = dd + "/" + tt;
      page.querySelectorAll(".checklist-phase").forEach(pw => {
        const badge = pw.querySelector(".checklist-phase-count");
        if (badge) badge.textContent = pw.querySelectorAll(".checklist-item.done").length + "/" + pw.querySelectorAll(".checklist-item").length;
      });
    }

    // Phase-grouped checklist with command hints
    if (total > 0) {
      const checkSection = document.createElement("div"); checkSection.className = "machine-section";
      groupByPhase(m.checklist).forEach(g => {
        const gDone = g.items.filter(x => x.item.done).length;
        const phaseWrap = document.createElement("div"); phaseWrap.className = "checklist-phase" + (g.phase === curPhase ? " current" : "");
        const ph = document.createElement("div"); ph.className = "checklist-phase-header";
        ph.innerHTML = '<span class="checklist-phase-name">' + escapeHtml(g.phase) + '</span><span class="checklist-phase-count">' + gDone + '/' + g.items.length + '</span>';
        phaseWrap.appendChild(ph);
        g.items.forEach(({ item, i }) => {
          const row = document.createElement("div"); row.className = "checklist-item" + (item.done ? " done" : "");
          const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!item.done; cb.id = "ck-" + m.id + "-" + i;
          cb.addEventListener("change", () => {
            m.checklist[i].done = cb.checked;
            saveMachine(m.id, { checklist: m.checklist });
            row.classList.toggle("done", cb.checked);
            updateProgressUI(); showMachineStatus();
          });
          const body = document.createElement("div"); body.className = "checklist-body";
          const lab = document.createElement("label"); lab.className = "checklist-label"; lab.setAttribute("for", cb.id); lab.textContent = item.label;
          body.appendChild(lab);
          if (item.hint) {
            const hintRow = document.createElement("div"); hintRow.className = "checklist-hint";
            const code = document.createElement("code"); code.textContent = item.hint;
            const copyBtn = document.createElement("button"); copyBtn.className = "checklist-hint-copy"; copyBtn.textContent = "⧉"; copyBtn.title = t("copyCmd"); copyBtn.setAttribute("aria-label", t("copyCmd"));
            copyBtn.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); copyText(applyIpToCode(item.hint), () => { announce(t("copied")); toast(t("copied"), "ok"); }); });
            hintRow.appendChild(code); hintRow.appendChild(copyBtn);
            body.appendChild(hintRow);
          }
          row.appendChild(cb); row.appendChild(body);
          phaseWrap.appendChild(row);
        });
        checkSection.appendChild(phaseWrap);
      });
      page.appendChild(checkSection);
    }

    // Hosts (AD / network engagement) + attack path
    const hostSection = document.createElement("div"); hostSection.className = "machine-section";
    hostSection.innerHTML = '<div class="machine-section-head"><h3>🖧 ' + t("hosts") + '</h3><button class="btn btn-secondary btn-sm machine-addhost">' + t("addHost") + '</button></div>';
    const hostList = document.createElement("div"); hostList.className = "machine-hosts";
    m.hosts = m.hosts || [];
    if (!m.hosts.length) { const eh = document.createElement("p"); eh.className = "machine-hosts-empty"; eh.textContent = t("noHosts"); hostList.appendChild(eh); }
    m.hosts.forEach((h, hi) => {
      const row = document.createElement("div"); row.className = "machine-host-row" + (h.owned ? " owned" : "");
      row.innerHTML =
        '<input type="checkbox" class="host-owned" title="' + t("owned") + '" aria-label="' + t("owned") + '"' + (h.owned ? " checked" : "") + '>' +
        '<input class="host-f host-name" placeholder="hostname" value="' + escapeHtml(h.name || "") + '" aria-label="hostname">' +
        '<input class="host-f host-ip" placeholder="ip" value="' + escapeHtml(h.ip || "") + '" aria-label="ip">' +
        '<input class="host-f host-os" placeholder="os / role" value="' + escapeHtml(h.os || "") + '" aria-label="os or role">' +
        '<button class="host-del" title="Delete" aria-label="Delete host">🗑</button>';
      const persist = () => { saveMachine(m.id, { hosts: m.hosts }); showMachineStatus(); };
      row.querySelector(".host-owned").addEventListener("change", ev => { h.owned = ev.target.checked; row.classList.toggle("owned", h.owned); persist(); });
      row.querySelector(".host-name").addEventListener("input", ev => { h.name = ev.target.value; persist(); });
      row.querySelector(".host-ip").addEventListener("input", ev => { h.ip = ev.target.value; persist(); });
      row.querySelector(".host-os").addEventListener("input", ev => { h.os = ev.target.value; persist(); });
      row.querySelector(".host-del").addEventListener("click", () => { m.hosts.splice(hi, 1); saveMachine(m.id, { hosts: m.hosts }); render(); });
      hostList.appendChild(row);
    });
    hostSection.appendChild(hostList);
    hostSection.querySelector(".machine-addhost").addEventListener("click", () => {
      m.hosts.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name: "", ip: "", os: "", owned: false });
      saveMachine(m.id, { hosts: m.hosts }); render();
    });
    const apLabel = document.createElement("div"); apLabel.className = "machine-subhead"; apLabel.textContent = "🧭 " + t("attackPath");
    const apArea = document.createElement("textarea"); apArea.className = "machine-textarea";
    apArea.placeholder = "user@host1 -> kerberoast svc -> WriteDACL -> DCSync -> DA";
    apArea.value = m.attackPath || "";
    apArea.addEventListener("input", () => { saveMachine(m.id, { attackPath: apArea.value }); showMachineStatus(); });
    hostSection.appendChild(apLabel); hostSection.appendChild(apArea);
    page.appendChild(hostSection);

    // Services
    const svcSection = document.createElement("div"); svcSection.className = "machine-section";
    svcSection.innerHTML = '<h3>🔌 ' + t("services") + '</h3>';
    const svcArea = document.createElement("textarea"); svcArea.className = "machine-textarea";
    svcArea.placeholder = "22/tcp  SSH  OpenSSH 7.9\n80/tcp  HTTP Apache 2.4\n445/tcp SMB  Samba 4.9";
    svcArea.value = (m.services || []).join("\n");
    svcArea.addEventListener("input", () => { saveMachine(m.id, { services: svcArea.value.split("\n").filter(Boolean) }); showMachineStatus(); });
    svcSection.appendChild(svcArea); page.appendChild(svcSection);

    // Credentials / loot
    const credSection = document.createElement("div"); credSection.className = "machine-section";
    credSection.innerHTML = '<h3>🔑 ' + t("credentials") + '</h3>';
    const credArea = document.createElement("textarea"); credArea.className = "machine-textarea";
    credArea.placeholder = "admin:password123\nsvc_sql:S3cr3t! (kerberoast)\nuser:aad3b435...:hash";
    credArea.value = (m.credentials || []).join("\n");
    credArea.addEventListener("input", () => { saveMachine(m.id, { credentials: credArea.value.split("\n").filter(Boolean) }); showMachineStatus(); });
    credSection.appendChild(credArea); page.appendChild(credSection);

    // Notes
    const noteSection = document.createElement("div"); noteSection.className = "machine-section";
    noteSection.innerHTML = '<h3>📝 ' + t("notes") + '</h3>';
    const noteArea = document.createElement("textarea"); noteArea.className = "machine-textarea machine-notes-area";
    noteArea.placeholder = lang === "tr" ? "Makine notlari..." : "Machine notes...";
    noteArea.value = m.notes || "";
    noteArea.addEventListener("input", () => { saveMachine(m.id, { notes: noteArea.value }); showMachineStatus(); });
    noteSection.appendChild(noteArea); page.appendChild(noteSection);

    contentArea.appendChild(page);

    function showMachineStatus() {
      const st = document.getElementById("machineStatus");
      if (st) { st.textContent = "saving..."; clearTimeout(st._t); st._t = setTimeout(() => st.textContent = "\u2713 saved", 600); }
    }
  }

  // ── Import/Export ──
  $("exportBtn").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = "/api/export"; a.download = "cheat-sheet-backup.json"; a.click();
  });
  $("importBtn").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", async e => {
    const file = e.target.files[0]; if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      const res = await api("POST", "/api/import", data);
      if (res && res.error) { alert("Import failed: " + res.error); e.target.value = ""; return; }
      await loadData();
      const n = res && typeof res.categories === "number"
        ? res.categories
        : (Array.isArray(data) ? data.length : (data.categories ? data.categories.length : 0));
      alert("Imported " + n + " categories!");
    } catch { alert("Invalid JSON file"); }
    e.target.value = "";
  });

  // ── Language ──
  $("langToggle").addEventListener("click", () => {
    lang = lang === "en" ? "tr" : "en";
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.lang = lang;
    localStorage.setItem("cs-lang", lang);
    searchInput.placeholder = t("search");
    render();
  });

  // ── Tag Filter ──
  tagFilters.querySelectorAll(".tag-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      tagFilters.querySelectorAll(".tag-filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeTag = btn.dataset.tag;
      render();
    });
  });

  // ── Drag & Drop (categories) ──
  function handleDragStart(e, idx) { dragSrcCatIdx = idx; e.dataTransfer.effectAllowed = "move"; e.target.classList.add("dragging"); }
  function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }
  async function handleDrop(e, targetIdx) {
    e.preventDefault();
    if (dragSrcCatIdx === null || dragSrcCatIdx === targetIdx) return;
    const data = [...CATEGORIES];
    const [moved] = data.splice(dragSrcCatIdx, 1);
    data.splice(targetIdx, 0, moved);
    await api("POST", "/api/import", data);
    await loadData();
    dragSrcCatIdx = null;
  }
  function handleDragEnd(e) { e.target.classList.remove("dragging"); dragSrcCatIdx = null; }

  // ── Sidebar ──
  function buildSidebar() {
    const s = getStats();
    statsEl.textContent = s.tc + " " + t("commands") + " · " + s.cats + " " + t("categories");
    $("heroSubtitle").textContent = t("heroSubtitle");
    $("heroDesc").textContent = t("heroDesc");
    $("disclaimer").innerHTML = t("educational") + "<br>" + t("useResp");
    heroStats.innerHTML =
      '<div class="hero-stat"><div class="hero-stat-num">' + s.tc + '</div><div class="hero-stat-label">' + t("commands") + '</div></div>' +
      '<div class="hero-stat"><div class="hero-stat-num">' + s.cats + '</div><div class="hero-stat-label">' + t("categories") + '</div></div>' +
      '<div class="hero-stat"><div class="hero-stat-num">' + s.ts + '</div><div class="hero-stat-label">' + t("subcategories") + '</div></div>';

    sidebarNav.innerHTML = "";
    // All
    mkNavItem("📋", t("allCommands"), s.tc, activeCategory === null && activeCategory !== "favs", () => { activeCategory = null; searchQuery = ""; searchInput.value = ""; render(); closeMobile(); });
    // Favorites
    const favCount = getFavCommands().length;
    mkNavItem("⭐", t("favorites"), favCount, activeCategory === "favs", () => { activeCategory = "favs"; searchQuery = ""; searchInput.value = ""; render(); closeMobile(); });
    // Write-ups
    mkNavItem("📝", "Write-ups", writeups.length, activeCategory === "writeups", () => { activeCategory = "writeups"; searchQuery = ""; searchInput.value = ""; render(); closeMobile(); });
    // Machines
    mkNavItem("🖥", t("machines"), machines.length, activeCategory === "machines", () => { activeCategory = "machines"; searchQuery = ""; searchInput.value = ""; render(); closeMobile(); });
    mkNavItem("🕘", t("history"), cmdHistory.length, activeCategory === "history", () => { activeCategory = "history"; searchQuery = ""; searchInput.value = ""; render(); closeMobile(); });
    // Categories
    CATEGORIES.forEach((cat, idx) => {
      let cnt = 0; cat.subcategories.forEach(s => (cnt += s.commands.length));
      const nc = getNotesCount(cat.id);
      const label = cnt + (nc > 0 ? " + " + nc + "📝" : "");
      const catName = (lang === "tr" && cat.name_tr) ? cat.name_tr : cat.name;
      const item = mkNavItem(cat.icon, catName, label, activeCategory === cat.id, () => { activeCategory = cat.id; searchQuery = ""; searchInput.value = ""; render(); closeMobile(); window.scrollTo({ top: 0, behavior: motionBehavior() }); });
      item.draggable = true;
      item.addEventListener("dragstart", e => handleDragStart(e, idx));
      item.addEventListener("dragover", handleDragOver);
      item.addEventListener("drop", e => handleDrop(e, idx));
      item.addEventListener("dragend", handleDragEnd);
    });
  }
  function mkNavItem(icon, text, count, active, onClick) {
    const item = document.createElement("div");
    item.className = "nav-item" + (active ? " active" : "");
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-label", text);
    if (active) item.setAttribute("aria-current", "true");
    item.innerHTML = '<span class="nav-item-icon" aria-hidden="true">' + escapeHtml(icon) + '</span><span class="nav-item-text">' + escapeHtml(text) + '</span><span class="nav-item-count">' + count + '</span>';
    item.addEventListener("click", onClick);
    item.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); } });
    sidebarNav.appendChild(item);
    return item;
  }

  // ── Render ──
  function renderCard(cmd, catId, subIdx, cmdIdx) {
    const card = document.createElement("div"); card.className = "cmd-card";
    const fav = isFav(catId, subIdx, cmdIdx);
    const tagsH = (cmd.tags || []).map(t => '<span class="cmd-tag ' + String(t).replace(/[^a-z0-9_-]/gi, "") + '">' + escapeHtml(t) + '</span>').join("");
    const hdr = document.createElement("div"); hdr.className = "cmd-card-header";
    hdr.innerHTML = '<div class="cmd-title">' + hl(cmd.title) + '</div>' +
      '<div class="cmd-header-actions">' + tagsH +
      '<button class="cmd-action-btn fav-btn' + (fav ? " fav-active" : "") + '" data-fav="' + favKey(catId, subIdx, cmdIdx) + '" title="Favorite">★</button>' +
      '<button class="cmd-action-btn edit-btn" title="Edit">✎</button>' +
      '<button class="cmd-action-btn delete-btn" title="Delete">✕</button></div>';
    hdr.querySelector(".fav-btn").addEventListener("click", e => { e.stopPropagation(); toggleFav(catId, subIdx, cmdIdx); });
    hdr.querySelector(".edit-btn").addEventListener("click", e => { e.stopPropagation(); editCommand(catId, subIdx, cmdIdx, cmd); });
    hdr.querySelector(".delete-btn").addEventListener("click", e => { e.stopPropagation(); deleteCommand(catId, subIdx, cmdIdx); });
    card.appendChild(hdr);
    const descText = (lang === "tr" && cmd.desc_tr) ? cmd.desc_tr : cmd.desc;
    if (descText) { const d = document.createElement("div"); d.className = "cmd-desc"; d.innerHTML = hl(descText); card.appendChild(d); }
    const cmds = cmd.cmds || (cmd.cmd ? [cmd.cmd] : []);
    if (cmds.length === 1) card.appendChild(mkCode(cmds[0]));
    else if (cmds.length > 1) {
      const m = document.createElement("div"); m.className = "cmd-multi";
      cmds.forEach(c => m.appendChild(mkCode(c)));
      const allBtn = document.createElement("button"); allBtn.className = "btn btn-secondary btn-sm cmd-copyall-btn"; allBtn.textContent = "⧉ " + t("copyAll");
      allBtn.addEventListener("click", () => {
        const joined = applyIpToCode(cmds.join("\n"));
        copyText(joined, () => { recordHistory(joined); announce(t("copied")); allBtn.textContent = "✓ " + t("copied"); setTimeout(() => { allBtn.textContent = "⧉ " + t("copyAll"); }, 1500); });
      });
      m.appendChild(allBtn);
      card.appendChild(m);
    }
    if (cmd.note) { const n = document.createElement("div"); n.className = "cmd-note"; n.innerHTML = "💡 " + escapeHtml(cmd.note).replace(/`([^`]+)`/g, "<code>$1</code>"); card.appendChild(n); }
    return card;
  }

  function mkCode(code) {
    const w = document.createElement("div"); w.className = "cmd-code-wrapper";
    const c = document.createElement("pre"); c.className = "cmd-code"; c.innerHTML = hlCode(code);
    // Click placeholders to fill
    c.addEventListener("click", e => {
      if (e.target.classList.contains("placeholder-var")) { openVarBar(code); return; }
    });
    const b = document.createElement("button"); b.className = "cmd-copy-btn"; b.textContent = t("copy");
    b.addEventListener("click", e => {
      e.stopPropagation();
      const applied = applyIpToCode(code);
      const hasVars = /<[A-Z_]+>/.test(applied);
      if (hasVars) { openVarBar(applied); return; }
      copyText(applied, () => { recordHistory(applied); b.textContent = t("copied"); b.classList.add("copied"); announce(t("copied")); setTimeout(() => { b.textContent = t("copy"); b.classList.remove("copied"); }, 1500); });
    });
    w.appendChild(c); w.appendChild(b); return w;
  }

  function hlCode(code) {
    // Tokenize the RAW command and escape each piece once, so highlighting can
    // never corrupt escaped entities. Alternation order encodes precedence:
    // comment, string, <PLACEHOLDER>, operator, sudo/doas, flag.
    const TOKEN = /((?:^|[ \t])#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(<[A-Z_]+>)|(\|\||&&|>>|2>|>|<|\|)|((?:^|\s)(?:sudo|doas)\b)|(\s--?[A-Za-z0-9][\w-]*)/gm;
    let out = "", last = 0, m;
    while ((m = TOKEN.exec(code)) !== null) {
      out += escapeHtml(code.slice(last, m.index));
      if (m[1]) out += '<span class="tok-comment">' + escapeHtml(m[1]) + '</span>';
      else if (m[2]) out += '<span class="tok-str">' + escapeHtml(m[2]) + '</span>';
      else if (m[3]) out += '<span class="placeholder-var">' + escapeHtml(m[3]) + '</span>';
      else if (m[4]) out += '<span class="tok-op">' + escapeHtml(m[4]) + '</span>';
      else if (m[5]) { const lead = m[5].replace(/\S+$/, ""); out += escapeHtml(lead) + '<span class="tok-cmd">' + escapeHtml(m[5].trim()) + '</span>'; }
      else if (m[6]) { const lead = m[6].replace(/\S+$/, ""); out += escapeHtml(lead) + '<span class="tok-flag">' + escapeHtml(m[6].trim()) + '</span>'; }
      last = m.index + m[0].length;
    }
    out += escapeHtml(code.slice(last));
    return out;
  }
  function hl(text) {
    if (!searchQuery) return escapeHtml(text);
    const e = escapeHtml(text);
    return e.replace(new RegExp("(" + escapeRegex(escapeHtml(searchQuery)) + ")", "gi"), '<span class="search-highlight">$1</span>');
  }

  function renderCat(cat, catIdx) {
    const sec = document.createElement("div"); sec.className = "category-section"; sec.id = "cat-" + cat.id;
    let cnt = 0; cat.subcategories.forEach(s => (cnt += s.commands.length));
    const collapsed = collapsedSections.has(cat.id);
    // Header - draggable
    const hdr = document.createElement("div"); hdr.className = "category-header" + (collapsed ? " collapsed" : "");
    hdr.setAttribute("role", "button");
    hdr.setAttribute("tabindex", "0");
    hdr.setAttribute("aria-expanded", String(!collapsed));
    hdr.setAttribute("aria-label", cat.name);
    hdr.draggable = true;
    hdr.addEventListener("dragstart", e => handleDragStart(e, catIdx));
    hdr.addEventListener("dragover", handleDragOver);
    hdr.addEventListener("drop", e => handleDrop(e, catIdx));
    hdr.addEventListener("dragend", handleDragEnd);
    hdr.innerHTML = '<span class="category-icon">' + escapeHtml(cat.icon) + '</span><span class="category-title">' + escapeHtml(cat.name) + '</span><span class="category-count">' + cnt + ' ' + t("commands") + '</span>' +
      '<div class="category-actions"><button class="cat-action-btn" data-act="term" title="' + t("termCopy") + '">📋</button><button class="cat-action-btn" data-act="sub">' + t("addSub") + '</button><button class="cat-action-btn" data-act="edit">✎</button><button class="cat-action-btn delete-btn" data-act="del">✕</button></div><span class="category-toggle">▼</span>';
    hdr.querySelector('[data-act="term"]').addEventListener("click", e => { e.stopPropagation(); copyTerminalFormat(cat.id); });
    hdr.querySelector('[data-act="sub"]').addEventListener("click", e => { e.stopPropagation(); addSubcategory(cat.id); });
    hdr.querySelector('[data-act="edit"]').addEventListener("click", e => { e.stopPropagation(); editCategory(cat); });
    hdr.querySelector('[data-act="del"]').addEventListener("click", e => { e.stopPropagation(); deleteCategory(cat); });
    hdr.addEventListener("click", e => {
      if (e.target.closest(".category-actions")) return;
      const nowCollapsed = !collapsedSections.has(cat.id);
      if (nowCollapsed) {
        collapsedSections.add(cat.id);
        hdr.classList.add("collapsed");
        sec.querySelectorAll(".category-desc, .category-notes, .category-body").forEach(el => el.remove());
      } else {
        collapsedSections.delete(cat.id);
        hdr.classList.remove("collapsed");
        fillCatContent();
      }
      hdr.setAttribute("aria-expanded", String(!nowCollapsed));
    });
    hdr.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target === hdr) { e.preventDefault(); hdr.click(); } });
    sec.appendChild(hdr);

    function fillCatContent() {
      const catDesc = (lang === "tr" && cat.description_tr) ? cat.description_tr : cat.description;
      if (catDesc) { const d = document.createElement("p"); d.className = "category-desc"; d.textContent = catDesc; sec.appendChild(d); }
      // Notes area — multiple notes per category
      const noteArea = document.createElement("div"); noteArea.className = "category-notes";
      const notes = getNotes(cat.id);
      const noteHeader = document.createElement("div"); noteHeader.className = "note-header";
      noteHeader.innerHTML = '<button class="note-add-btn">+ ' + (lang === "tr" ? "Not Ekle" : "Add Note") + '</button>' +
        (notes.length > 0 ? '<span class="note-count">' + notes.length + ' ' + (lang === "tr" ? "not" : "note" + (notes.length > 1 ? "s" : "")) + '</span>' : '');
      noteHeader.querySelector(".note-add-btn").addEventListener("click", () => addNote(cat.id));
      noteArea.appendChild(noteHeader);

      notes.forEach(note => {
        const noteCard = document.createElement("div"); noteCard.className = "note-card";
        const noteTop = document.createElement("div"); noteTop.className = "note-card-top";
        const noteSaved = document.createElement("span"); noteSaved.className = "note-saved";
        const noteDelBtn = document.createElement("button"); noteDelBtn.className = "note-delete-btn"; noteDelBtn.textContent = "🗑"; noteDelBtn.title = "Delete";
        noteDelBtn.addEventListener("click", () => deleteNote(cat.id, note.id));
        noteTop.appendChild(noteSaved); noteTop.appendChild(noteDelBtn);
        noteCard.appendChild(noteTop);

        const noteEditor = document.createElement("textarea"); noteEditor.className = "note-editor";
        noteEditor.placeholder = t("notePlaceholder"); noteEditor.value = note.text || "";
        noteEditor.addEventListener("input", () => {
          saveNoteText(cat.id, note.id, noteEditor.value);
          noteSaved.textContent = "saving...";
          clearTimeout(noteEditor._st);
          noteEditor._st = setTimeout(() => { noteSaved.textContent = "✓ saved"; setTimeout(() => noteSaved.textContent = "", 2000); }, 600);
        });
        noteCard.appendChild(noteEditor);
        noteArea.appendChild(noteCard);
      });
      sec.appendChild(noteArea);

      const body = document.createElement("div"); body.className = "category-body";
      // Empty state for categories with no subcategories
      if (cat.subcategories.length === 0) {
        const empty = document.createElement("div"); empty.className = "cat-empty-state";
        empty.innerHTML = '<div class="cat-empty-icon">📂</div><p>' + (lang === "tr" ? "Bu kategoride henuz alt kategori ve komut yok." : "No subcategories or commands yet.") + '</p>' +
          '<button class="btn btn-primary btn-sm cat-empty-btn">+ ' + (lang === "tr" ? "Alt Kategori Ekle" : "Add Subcategory") + '</button>';
        empty.querySelector(".cat-empty-btn").addEventListener("click", () => addSubcategory(cat.id));
        body.appendChild(empty);
      }
      cat.subcategories.forEach((sub, subIdx) => {
        const filtered = filterCmds(sub.commands);
        if (isFiltering() && filtered.length === 0) return;
        const subDiv = document.createElement("div"); subDiv.className = "subcategory";
        const subH = document.createElement("div"); subH.className = "subcategory-title";
        const subName = (lang === "tr" && sub.name_tr) ? sub.name_tr : sub.name;
        subH.innerHTML = '<span>' + escapeHtml(subName) + '</span><div class="sub-actions"><button class="sub-action-btn" data-act="cmd">' + t("addCmd") + '</button><button class="sub-action-btn" data-act="edit">✎</button><button class="sub-action-btn delete-btn" data-act="del">✕</button></div>';
        subH.querySelector('[data-act="cmd"]').addEventListener("click", () => addCommand(cat.id, subIdx));
        subH.querySelector('[data-act="edit"]').addEventListener("click", () => editSubcategory(cat.id, subIdx, sub));
        subH.querySelector('[data-act="del"]').addEventListener("click", () => deleteSubcategory(cat.id, subIdx));
        subDiv.appendChild(subH);
        (isFiltering() ? filtered : sub.commands).forEach(cmd => { subDiv.appendChild(renderCard(cmd, cat.id, subIdx, sub.commands.indexOf(cmd))); });
        body.appendChild(subDiv);
      });
      sec.appendChild(body);
    }
    if (!collapsed) fillCatContent();
    return sec;
  }

  // Precomputed lowercased search haystack per command (kept off the objects in a
  // WeakMap so it never leaks into exports/imports). Rebuilt whenever data loads.
  const HAY = new WeakMap();
  function hay(c) {
    let h = HAY.get(c);
    if (h === undefined) {
      h = [c.title, c.desc, c.cmd, ...(c.cmds || []), ...(c.tags || []), c.note || ""].join(" ").toLowerCase();
      HAY.set(c, h);
    }
    return h;
  }
  function buildSearchIndex() {
    CATEGORIES.forEach(cat => (cat.subcategories || []).forEach(sub => (sub.commands || []).forEach(c => {
      HAY.set(c, [c.title, c.desc, c.cmd, ...(c.cmds || []), ...(c.tags || []), c.note || ""].join(" ").toLowerCase());
    })));
  }

  function filterCmds(commands) {
    let r = commands;
    if (activeTag !== "all") r = r.filter(c => (c.tags || []).includes(activeTag));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(c => hay(c).includes(q));
    }
    return r;
  }
  function catHasResults(cat) { return cat.subcategories.some(s => filterCmds(s.commands).length > 0); }
  // True when any filter (tag chip OR search) is narrowing the list. The content
  // render must then use filterCmds() results, not the raw command arrays — this
  // is the fix for the tag chips doing nothing unless a search was also active.
  function isFiltering() { return activeTag !== "all" || !!searchQuery; }

  function render() {
    buildSidebar(); contentArea.innerHTML = ""; focusedCmdIdx = -1;
    syncHash();

    // Write-ups view
    if (activeCategory === "writeups") { renderWriteupsPage(); return; }
    // Machines view
    if (activeCategory === "machines") { renderMachinesPage(); return; }
    // History view
    if (activeCategory === "history") { renderHistoryPage(); return; }

    // Favorites view
    if (activeCategory === "favs") {
      currentSection.textContent = t("favorites"); hero.style.display = "none";
      let favs = getFavCommands();
      if (activeTag !== "all") favs = favs.filter(f => (f.cmd.tags || []).includes(activeTag));
      if (searchQuery) { const q = searchQuery.toLowerCase(); favs = favs.filter(f => hay(f.cmd).includes(q)); }
      if (favs.length === 0) {
        contentArea.innerHTML = '<div class="no-results"><h3>⭐ ' + t("favorites") + '</h3><p>' + (lang === "tr" ? "Henuz favori komut eklemediniz. Komutlardaki ★ ikonuna tiklayin." : "No favorites yet. Click ★ on commands to add them.") + '</p></div>';
        return;
      }
      favs.forEach(f => contentArea.appendChild(renderCard(f.cmd, f.catId, f.subIdx, f.cmdIdx)));
      return;
    }

    let cats = CATEGORIES;
    if (activeCategory) { cats = CATEGORIES.filter(c => c.id === activeCategory); currentSection.textContent = cats.length ? ((lang === "tr" && cats[0].name_tr) ? cats[0].name_tr : cats[0].name) : t("allCommands"); hero.style.display = "none"; }
    else {
      currentSection.textContent = searchQuery
        ? t("searchResults") + ': "' + searchQuery + '"'
        : (activeTag !== "all" ? t("allCommands") + " · " + activeTag : t("allCommands"));
      hero.style.display = isFiltering() ? "none" : "";
    }

    if (searchQuery) {
      let total = 0; cats.forEach(c => c.subcategories.forEach(s => (total += filterCmds(s.commands).length)));
      announce(total + " " + t("commands") + " " + t("matching"));
      const sh = document.createElement("div"); sh.className = "search-results-header";
      sh.innerHTML = "<h2>" + t("searchResults") + "</h2><p>" + total + " " + t("commands") + " " + t("matching") + ' "' + escapeHtml(searchQuery) + '"</p>';
      contentArea.appendChild(sh);
      if (total === 0) { const nr = document.createElement("div"); nr.className = "no-results"; nr.innerHTML = "<h3>" + t("noResults") + "</h3><p>" + t("tryDiff") + "</p>"; contentArea.appendChild(nr); return; }
    }
    cats.forEach((c) => { if (isFiltering() && !catHasResults(c)) return; contentArea.appendChild(renderCat(c, CATEGORIES.indexOf(c))); });
  }

  // ── PDF/Markdown Export for Write-ups ──
  function exportWriteupMd(wu) {
    let md = "# " + wu.title + "\n\n";
    md += "**Tags:** " + (wu.tags || []).join(", ") + "\n";
    md += "**Date:** " + new Date(wu.updatedAt).toLocaleString() + "\n\n---\n\n";
    md += wu.content || "";
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (wu.title || "writeup").replace(/[^a-z0-9]/gi, "_") + ".md";
    a.click(); URL.revokeObjectURL(a.href);
  }
  function exportWriteupPdf(wu) {
    const win = window.open("", "_blank");
    let html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>" + escapeHtml(wu.title) + "</title>";
    html += "<style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;line-height:1.6}h1{border-bottom:2px solid #333;padding-bottom:8px}pre{background:#f4f4f4;padding:12px;border-radius:4px;overflow-x:auto;font-size:13px}code{background:#f4f4f4;padding:2px 4px;border-radius:3px;font-size:13px}.meta{color:#666;font-size:13px;margin-bottom:20px}img{max-width:100%}</style></head><body>";
    html += "<h1>" + escapeHtml(wu.title) + "</h1>";
    html += '<div class="meta">Tags: ' + (wu.tags || []).map(escapeHtml).join(", ") + " | " + escapeHtml(new Date(wu.updatedAt).toLocaleString()) + "</div><hr>";
    // Simple markdown rendering for print
    let content = escapeHtml(wu.content || "");
    content = content.replace(/^(#{1,3})\s+(.*)$/gm, (m, h, t) => "<h" + (h.length + 1) + ">" + t + "</h" + (h.length + 1) + ">");
    content = content.replace(/`([^`]+)`/g, "<code>$1</code>");
    content = content.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    content = content.replace(/\n/g, "<br>");
    html += content + "</body></html>";
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  }

  // ── Terminal Integration (copy all commands as terminal-friendly format) ──
  function copyTerminalFormat(catId) {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) return;
    let output = "# " + cat.name + "\n";
    cat.subcategories.forEach(sub => {
      output += "\n## " + sub.name + "\n";
      sub.commands.forEach(cmd => {
        output += "\n# " + cmd.title + (cmd.desc ? " - " + cmd.desc : "") + "\n";
        const cmds = cmd.cmds || (cmd.cmd ? [cmd.cmd] : []);
        cmds.forEach(c => { output += applyIpToCode(c) + "\n"; });
      });
    });
    copyText(output, () => toast(t("termCopied"), "ok"));
  }

  // ── Search ──
  let st; searchInput.addEventListener("input", () => { clearTimeout(st); st = setTimeout(() => { searchQuery = searchInput.value.trim(); if (searchQuery) activeCategory = null; render(); }, 200); });

  // ── Keyboard Navigation ──
  const kbdHelp = $("kbdHelp");
  $("kbdHelpClose").addEventListener("click", () => kbdHelp.classList.remove("active"));
  kbdHelp.addEventListener("click", e => { if (e.target === kbdHelp) kbdHelp.classList.remove("active"); });

  function getFocusableCards() { return Array.from(contentArea.querySelectorAll(".cmd-card")); }
  function moveFocus(dir) {
    const cards = getFocusableCards(); if (cards.length === 0) return;
    cards.forEach(c => c.classList.remove("kbd-focused"));
    focusedCmdIdx += dir;
    if (focusedCmdIdx < 0) focusedCmdIdx = 0;
    if (focusedCmdIdx >= cards.length) focusedCmdIdx = cards.length - 1;
    cards[focusedCmdIdx].classList.add("kbd-focused");
    cards[focusedCmdIdx].scrollIntoView({ behavior: motionBehavior(), block: "center" });
  }
  function copyFocused() {
    const cards = getFocusableCards();
    if (focusedCmdIdx < 0 || focusedCmdIdx >= cards.length) return;
    const codeEl = cards[focusedCmdIdx].querySelector(".cmd-code");
    if (codeEl) {
      const code = codeEl.textContent;
      const applied = applyIpToCode(code);
      if (/<[A-Z_]+>/.test(applied)) openVarBar(code);
      else copyText(applied, () => {
        recordHistory(applied);
        const btn = cards[focusedCmdIdx].querySelector(".cmd-copy-btn");
        if (btn) { btn.textContent = t("copied"); btn.classList.add("copied"); announce(t("copied")); setTimeout(() => { btn.textContent = t("copy"); btn.classList.remove("copied"); }, 1500); }
      });
    }
  }

  // ── Command history (local) ──
  function recordHistory(text) {
    if (!text) return; text = String(text);
    cmdHistory = cmdHistory.filter(h => h.cmd !== text);
    cmdHistory.unshift({ cmd: text, ts: Date.now() });
    if (cmdHistory.length > 100) cmdHistory = cmdHistory.slice(0, 100);
    localStorage.setItem("cs-history", JSON.stringify(cmdHistory));
  }
  function renderHistoryPage() {
    currentSection.textContent = t("history"); hero.style.display = "none"; contentArea.innerHTML = "";
    const hdr = document.createElement("div"); hdr.className = "writeups-header";
    hdr.innerHTML = '<div class="wu-header-top"><h2>🕘 ' + t("history") + '</h2><button class="btn btn-secondary" id="clearHistBtn">' + t("clearHistory") + '</button></div>';
    contentArea.appendChild(hdr);
    hdr.querySelector("#clearHistBtn").addEventListener("click", () => {
      if (!cmdHistory.length || !confirm(t("clearHistory") + "?")) return;
      cmdHistory = []; localStorage.setItem("cs-history", "[]"); render();
    });
    if (!cmdHistory.length) { const e = document.createElement("div"); e.className = "no-results"; e.innerHTML = "<h3>" + t("noHistory") + "</h3>"; contentArea.appendChild(e); return; }
    const list = document.createElement("div"); list.className = "history-list";
    cmdHistory.forEach(h => {
      const row = document.createElement("div"); row.className = "history-row";
      const code = document.createElement("pre"); code.className = "cmd-code"; code.innerHTML = hlCode(h.cmd);
      const meta = document.createElement("div"); meta.className = "history-meta"; meta.textContent = new Date(h.ts).toLocaleString();
      const copyBtn = document.createElement("button"); copyBtn.className = "cmd-copy-btn"; copyBtn.textContent = t("copy"); copyBtn.setAttribute("aria-label", t("copy"));
      copyBtn.addEventListener("click", () => copyText(applyIpToCode(h.cmd), () => { copyBtn.textContent = t("copied"); copyBtn.classList.add("copied"); announce(t("copied")); setTimeout(() => { copyBtn.textContent = t("copy"); copyBtn.classList.remove("copied"); }, 1500); }));
      const body = document.createElement("div"); body.className = "history-body"; body.appendChild(code); body.appendChild(meta);
      row.appendChild(body); row.appendChild(copyBtn);
      list.appendChild(row);
    });
    contentArea.appendChild(list);
  }

  // ── Fuzzy command palette (Ctrl+K) ──
  const palette = document.createElement("div"); palette.className = "palette-overlay"; palette.id = "palette";
  palette.innerHTML =
    '<div class="palette" role="dialog" aria-modal="true" aria-label="Command palette">' +
      '<input class="palette-input" type="text" autocomplete="off" spellcheck="false" aria-label="Command palette">' +
      '<div class="palette-list" role="listbox"></div>' +
    '</div>';
  document.body.appendChild(palette);
  const paletteInput = palette.querySelector(".palette-input");
  const paletteList = palette.querySelector(".palette-list");
  let paletteItems = [], paletteSel = 0, paletteBase = [];

  function fuzzyScore(hayStr, q) {
    if (!q) return 0;
    let score = 0, qi = 0, prev = -2;
    for (let i = 0; i < hayStr.length && qi < q.length; i++) {
      if (hayStr[i] === q[qi]) {
        score += 1;
        if (prev === i - 1) score += 2;
        if (i === 0 || /[\s\-_/:.]/.test(hayStr[i - 1])) score += 3;
        prev = i; qi++;
      }
    }
    return qi === q.length ? score - hayStr.length * 0.002 : -1;
  }
  function navTo(target) { closePalette(); activeCategory = target; searchQuery = ""; searchInput.value = ""; openWriteupId = null; openMachineId = null; render(); }
  function buildPaletteBase() {
    const items = [];
    const act = (icon, label, run) => items.push({ type: "action", icon, label, hay: label.toLowerCase(), run });
    act("📋", t("goto") + ": " + t("allCommands"), () => navTo(null));
    act("⭐", t("goto") + ": " + t("favorites"), () => navTo("favs"));
    act("📝", t("goto") + ": Write-ups", () => navTo("writeups"));
    act("🖥", t("goto") + ": " + t("machines"), () => navTo("machines"));
    act("🕘", t("goto") + ": " + t("history"), () => navTo("history"));
    CATEGORIES.forEach(cat => { const nm = (lang === "tr" && cat.name_tr) ? cat.name_tr : cat.name; act(cat.icon, t("goto") + ": " + nm, () => navTo(cat.id)); });
    CATEGORIES.forEach(cat => cat.subcategories.forEach((sub, si) => sub.commands.forEach((cmd, ci) => {
      const nm = (lang === "tr" && cat.name_tr) ? cat.name_tr : cat.name;
      items.push({ type: "cmd", icon: "»", label: cmd.title, sub: nm + " › " + sub.name, hay: hay(cmd), cmd: cmd });
    })));
    return items;
  }
  function paletteExec(item) {
    if (!item) return;
    if (item.type === "action") { item.run(); return; }
    const applied = applyIpToCode(item.cmd.cmds ? item.cmd.cmds.join("\n") : (item.cmd.cmd || ""));
    closePalette();
    if (/<[A-Z_]+>/.test(applied)) { openVarBar(applied); return; }
    copyText(applied, () => { recordHistory(applied); announce(t("copied")); toast(t("copied"), "ok"); });
  }
  function renderPalette() {
    const q = paletteInput.value.trim().toLowerCase();
    let out;
    if (!q) { out = paletteBase.filter(x => x.type === "action").slice(0, 40); }
    else {
      const scored = [];
      for (const it of paletteBase) { const s = fuzzyScore(it.hay, q); if (s >= 0) scored.push({ it: it, s: s }); }
      scored.sort((a, b) => b.s - a.s);
      out = scored.slice(0, 50).map(x => x.it);
    }
    paletteItems = out; paletteSel = 0;
    paletteList.innerHTML = "";
    out.forEach((it, idx) => {
      const row = document.createElement("div"); row.className = "palette-item" + (idx === 0 ? " sel" : "");
      row.setAttribute("role", "option"); row.setAttribute("aria-selected", idx === 0 ? "true" : "false");
      row.innerHTML = '<span class="palette-icon" aria-hidden="true">' + escapeHtml(it.icon || "") + '</span><span class="palette-label">' + escapeHtml(it.label) + '</span>' + (it.sub ? '<span class="palette-sub">' + escapeHtml(it.sub) + '</span>' : '') + '<span class="palette-kind">' + (it.type === "cmd" ? "copy" : "go") + '</span>';
      row.addEventListener("click", () => paletteExec(it));
      row.addEventListener("mousemove", () => setPaletteSel(idx));
      paletteList.appendChild(row);
    });
  }
  function setPaletteSel(idx) {
    const rows = paletteList.children; if (!rows.length) return;
    paletteSel = Math.max(0, Math.min(idx, rows.length - 1));
    for (let i = 0; i < rows.length; i++) { const on = i === paletteSel; rows[i].classList.toggle("sel", on); rows[i].setAttribute("aria-selected", on ? "true" : "false"); }
    rows[paletteSel].scrollIntoView({ block: "nearest" });
  }
  function openPalette() {
    paletteBase = buildPaletteBase();
    paletteInput.value = "";
    palette.classList.add("active");
    renderPalette();
    setTimeout(() => paletteInput.focus(), 0);
  }
  function closePalette() { palette.classList.remove("active"); }
  paletteInput.addEventListener("input", renderPalette);
  paletteInput.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); setPaletteSel(paletteSel + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setPaletteSel(paletteSel - 1); }
    else if (e.key === "Enter") { e.preventDefault(); paletteExec(paletteItems[paletteSel]); }
    else if (e.key === "Escape") { e.preventDefault(); closePalette(); }
  });
  palette.addEventListener("click", e => { if (e.target === palette) closePalette(); });

  // ── Deep-linking (hash routing) ──
  let suppressHash = false;
  function stateToHash() {
    if (activeCategory === "favs") return "favorites";
    if (activeCategory === "writeups") return "writeups";
    if (activeCategory === "machines") return "machines";
    if (activeCategory === "history") return "history";
    if (activeCategory) return "cat/" + activeCategory;
    return "";
  }
  function syncHash() {
    const h = stateToHash();
    if ((window.location.hash || "").replace(/^#/, "") === h) return;
    suppressHash = true;
    window.history.replaceState(null, "", window.location.pathname + (h ? "#" + h : ""));
    setTimeout(() => { suppressHash = false; }, 0);
  }
  function applyHash() {
    const raw = (window.location.hash || "").replace(/^#/, "");
    let target = null;
    if (raw === "favorites" || raw === "favs") target = "favs";
    else if (raw === "writeups") target = "writeups";
    else if (raw === "machines") target = "machines";
    else if (raw === "history") target = "history";
    else if (raw.indexOf("cat/") === 0) { const id = raw.slice(4); target = CATEGORIES.some(c => c.id === id) ? id : null; }
    activeCategory = target; searchQuery = ""; searchInput.value = "";
    openWriteupId = null; openMachineId = null;
    render();
  }
  window.addEventListener("hashchange", () => { if (!suppressHash) applyHash(); });

  document.addEventListener("keydown", e => {
    const active = document.activeElement;
    const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);

    // Ctrl+K — command palette
    if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); openPalette(); return; }
    // Ctrl+I — IP changer
    if ((e.ctrlKey || e.metaKey) && e.key === "i") { e.preventDefault(); ipBar.classList.toggle("active"); if (ipBar.classList.contains("active")) ipFields.LHOST.focus(); return; }
    // Escape
    if (e.key === "Escape") {
      if (palette.classList.contains("active")) { closePalette(); return; }
      if (kbdHelp.classList.contains("active")) { kbdHelp.classList.remove("active"); return; }
      if (ipBar.classList.contains("active")) { ipBar.classList.remove("active"); return; }
      if (varBar.classList.contains("active")) { varBar.classList.remove("active"); return; }
      if (modalOverlay.classList.contains("active")) { closeModal(); return; }
      if (searchQuery) { searchQuery = ""; searchInput.value = ""; render(); }
      closeMobile(); return;
    }

    // Non-input keys
    if (isInput) return;

    // ? — show keyboard shortcuts
    if (e.key === "?") { e.preventDefault(); kbdHelp.classList.toggle("active"); return; }
    // j/k — navigate
    if (e.key === "j") { e.preventDefault(); moveFocus(1); return; }
    if (e.key === "k") { e.preventDefault(); moveFocus(-1); return; }
    // Enter — copy focused
    if (e.key === "Enter" && focusedCmdIdx >= 0) { e.preventDefault(); copyFocused(); return; }
    // / — focus search
    if (e.key === "/") { e.preventDefault(); searchInput.focus(); searchInput.select(); return; }
    // g combos
    if (e.key === "g" && !pendingGo) { pendingGo = true; setTimeout(() => { pendingGo = false; }, 800); return; }
    if (pendingGo) {
      pendingGo = false;
      if (e.key === "h") { activeCategory = null; searchQuery = ""; searchInput.value = ""; render(); return; }
      if (e.key === "f") { activeCategory = "favs"; render(); return; }
      if (e.key === "w") { activeCategory = "writeups"; render(); return; }
      if (e.key === "m") { activeCategory = "machines"; render(); return; }
    }
  });

  function closeMobile() { sidebar.classList.remove("open"); overlay.classList.remove("active"); }
  $("sidebarOpen").addEventListener("click", () => { sidebar.classList.add("open"); overlay.classList.add("active"); });
  $("sidebarClose").addEventListener("click", closeMobile);
  overlay.addEventListener("click", closeMobile);
  $("expandAll").addEventListener("click", () => { collapsedSections.clear(); render(); });
  $("collapseAll").addEventListener("click", () => { CATEGORIES.forEach(c => collapsedSections.add(c.id)); render(); });

  const saved = localStorage.getItem("cheatsheet-theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) document.documentElement.setAttribute("data-theme", "light");
  // Keep the document language in sync with the UI language for screen readers.
  document.documentElement.lang = lang;
  document.documentElement.setAttribute("data-lang", lang);
  $("themeToggle").addEventListener("click", () => { const n = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light"; document.documentElement.setAttribute("data-theme", n); localStorage.setItem("cheatsheet-theme", n); });

  const btt = document.createElement("button"); btt.className = "back-to-top"; btt.innerHTML = "↑"; btt.setAttribute("aria-label", "Back to top"); document.body.appendChild(btt);
  btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: motionBehavior() }));
  window.addEventListener("scroll", () => btt.classList.toggle("visible", window.scrollY > 400));

  // Offline/online feedback (the SW already serves cached data offline).
  window.addEventListener("offline", () => toast(lang === "tr" ? "Cevrimdisi - degisiklikler kaydedilemeyebilir" : "Offline - changes may not be saved", "error"));
  window.addEventListener("online", () => toast(lang === "tr" ? "Yeniden cevrimici" : "Back online", "ok"));

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  // "auto" when the user asked for reduced motion, else "smooth".
  function motionBehavior() { return (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) ? "auto" : "smooth"; }

  // ── Init ──
  document.documentElement.setAttribute("data-lang", lang);
  searchInput.placeholder = t("search");
  // Honor a launch hash (PWA shortcuts + deep links, e.g. /#machines, /#cat/recon).
  const launchHash = (window.location.hash || "").replace(/^#/, "");
  const hashView = { favorites: "favs", favs: "favs", writeups: "writeups", machines: "machines", history: "history" }[launchHash];
  if (hashView) activeCategory = hashView;
  else if (launchHash.indexOf("cat/") === 0) activeCategory = launchHash.slice(4);
  loadData();
})();
