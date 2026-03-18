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
  let activeTag = "all";
  let categoryNotes = {};
  let writeups = [];
  let lang = localStorage.getItem("cs-lang") || "en";
  let dragSrcCatIdx = null;

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
      heroDesc: "A comprehensive collection of penetration testing commands organized by attack phase. Built for certification preparation and ethical security assessments.",
      educational: "Educational purposes only.", useResp: "Use responsibly and ethically."
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
      heroDesc: "Sizma testi komutlarinin saldiri asamalarina gore duzenlenmis kapsamli bir koleksiyonu. Sertifika hazirlik ve etik guvenlik degerlendirmeleri icin.",
      educational: "Sadece egitim amaclidir.", useResp: "Sorumlu ve etik kullanin."
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

  // ── API ──
  async function api(method, url, body) {
    const o = { method, headers: { "Content-Type": "application/json" } };
    if (body) o.body = JSON.stringify(body);
    return (await fetch(url, o)).json();
  }
  async function loadData() {
    CATEGORIES = await api("GET", "/api/categories");
    await loadNotes();
    await loadWriteups();
    render();
  }

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
    if (favorites.includes(k)) favorites = favorites.filter(f => f !== k);
    else favorites.push(k);
    localStorage.setItem("cs-favorites", JSON.stringify(favorites));
    render();
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
    if (vars.length === 0) { navigator.clipboard.writeText(code); return; }
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
    navigator.clipboard.writeText(result).then(() => {
      $("varBarApply").textContent = "✓ " + t("copied");
      setTimeout(() => { $("varBarApply").textContent = t("applyCopy"); varBar.classList.remove("active"); }, 1200);
    });
  });

  // ── Modal ──
  let modalCallback = null;
  function openModal(title, fields, data, cb) {
    modalTitle.textContent = title; modalCallback = cb; modalBody.innerHTML = "";
    fields.forEach(f => {
      const g = document.createElement("div"); g.className = "form-group";
      const l = document.createElement("label"); l.textContent = f.label; l.setAttribute("for", "field-" + f.key); g.appendChild(l);
      if (f.type === "textarea") {
        const ta = document.createElement("textarea"); ta.id = "field-" + f.key; ta.rows = f.rows || 4; ta.placeholder = f.placeholder || ""; ta.value = data[f.key] || ""; g.appendChild(ta);
      } else {
        const inp = document.createElement("input"); inp.type = "text"; inp.id = "field-" + f.key; inp.placeholder = f.placeholder || ""; inp.value = data[f.key] || ""; g.appendChild(inp);
      }
      if (f.hint) { const h = document.createElement("span"); h.className = "form-hint"; h.textContent = f.hint; g.appendChild(h); }
      modalBody.appendChild(g);
    });
    modalOverlay.classList.add("active");
  }
  function closeModal() { modalOverlay.classList.remove("active"); modalCallback = null; }
  function getModalData() { const d = {}; modalBody.querySelectorAll("input,textarea").forEach(el => { d[el.id.replace("field-", "")] = el.value; }); return d; }
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
    openModal("New Subcategory", [{ key: "name", label: t("subName") }], {}, async d => { await api("POST", "/api/categories/" + catId + "/subcategories", d); });
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

  // ── Notes (server-backed) ──
  async function loadNotes() { categoryNotes = await api("GET", "/api/notes"); }
  let noteTimer = null;
  function saveNote(catId, text) {
    categoryNotes[catId] = text;
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => api("PUT", "/api/notes/" + catId, { text }), 500);
  }
  async function deleteNote(catId) {
    delete categoryNotes[catId];
    await api("DELETE", "/api/notes/" + catId);
    render();
  }

  // ── Write-ups (server-backed) ──
  async function loadWriteups() { writeups = await api("GET", "/api/writeups"); }
  async function createWriteup() {
    openModal("New Write-up", [
      { key: "title", label: "Title", placeholder: "e.g., HackTheBox — Lame" },
      { key: "tags", label: "Tags", placeholder: "HTB, OSCP, Linux, Easy (comma-separated)" }
    ], {}, async fd => {
      const tags = fd.tags.split(",").map(s => s.trim()).filter(Boolean);
      await api("POST", "/api/writeups", { title: fd.title, tags, content: "" });
      await loadWriteups(); render();
    });
  }
  async function deleteWriteup(id) {
    if (!confirm("Delete this write-up?")) return;
    await api("DELETE", "/api/writeups/" + id);
    await loadWriteups(); render();
  }
  let wuTimer = null;
  function saveWriteupContent(id, content) {
    clearTimeout(wuTimer);
    wuTimer = setTimeout(() => api("PUT", "/api/writeups/" + id, { content }), 500);
  }
  function saveWriteupTitle(id, title) { api("PUT", "/api/writeups/" + id, { title }); }

  function renderWriteupsPage() {
    currentSection.textContent = "Write-ups"; hero.style.display = "none";
    contentArea.innerHTML = "";
    // Header
    const hdr = document.createElement("div"); hdr.className = "writeups-header";
    hdr.innerHTML = '<h2>📝 Write-ups</h2><p>' + (lang === "tr" ? "Pentest notlarinizi ve write-up\'larinizi buraya yazin." : "Document your pentest findings and write-ups here.") + '</p><button class="btn btn-primary" id="newWriteupBtn">+ New Write-up</button>';
    contentArea.appendChild(hdr);
    hdr.querySelector("#newWriteupBtn").addEventListener("click", createWriteup);

    if (writeups.length === 0) {
      contentArea.innerHTML += '<div class="no-results"><h3>No write-ups yet</h3><p>' + (lang === "tr" ? "Ilk write-up\'inizi olusturun." : "Create your first write-up to get started.") + '</p></div>';
      return;
    }
    writeups.forEach(wu => {
      const card = document.createElement("div"); card.className = "writeup-card";
      const tagsH = (wu.tags || []).map(t => '<span class="wu-tag">' + escapeHtml(t) + '</span>').join("");
      const date = new Date(wu.updatedAt).toLocaleDateString();
      card.innerHTML =
        '<div class="wu-card-header">' +
          '<div class="wu-card-title-row">' +
            '<input class="wu-title-input" value="' + escapeHtml(wu.title) + '" />' +
            '<div class="wu-card-meta"><span class="wu-date">' + date + '</span>' + tagsH + '</div>' +
          '</div>' +
          '<button class="cmd-action-btn delete-btn wu-delete" title="Delete">✕</button>' +
        '</div>' +
        '<textarea class="wu-editor" placeholder="' + (lang === "tr" ? "Write-up iceriginizi buraya yazin..." : "Write your findings, steps, and notes here...") + '">' + escapeHtml(wu.content || "") + '</textarea>';
      card.querySelector(".wu-title-input").addEventListener("change", e => saveWriteupTitle(wu.id, e.target.value));
      card.querySelector(".wu-editor").addEventListener("input", e => saveWriteupContent(wu.id, e.target.value));
      card.querySelector(".wu-delete").addEventListener("click", () => deleteWriteup(wu.id));
      contentArea.appendChild(card);
    });
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
      await api("POST", "/api/import", data);
      await loadData();
      alert("Imported " + data.length + " categories!");
    } catch { alert("Invalid JSON file"); }
    e.target.value = "";
  });

  // ── Language ──
  $("langToggle").addEventListener("click", () => {
    lang = lang === "en" ? "tr" : "en";
    document.documentElement.setAttribute("data-lang", lang);
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
    // Categories
    CATEGORIES.forEach((cat, idx) => {
      let cnt = 0; cat.subcategories.forEach(s => (cnt += s.commands.length));
      const item = mkNavItem(cat.icon, cat.name, cnt, activeCategory === cat.id, () => { activeCategory = cat.id; searchQuery = ""; searchInput.value = ""; render(); closeMobile(); window.scrollTo({ top: 0, behavior: "smooth" }); });
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
    item.innerHTML = '<span class="nav-item-icon">' + icon + '</span><span class="nav-item-text">' + text + '</span><span class="nav-item-count">' + count + '</span>';
    item.addEventListener("click", onClick);
    sidebarNav.appendChild(item);
    return item;
  }

  // ── Render ──
  function renderCard(cmd, catId, subIdx, cmdIdx) {
    const card = document.createElement("div"); card.className = "cmd-card";
    const fav = isFav(catId, subIdx, cmdIdx);
    const tagsH = (cmd.tags || []).map(t => '<span class="cmd-tag ' + t + '">' + t + '</span>').join("");
    const hdr = document.createElement("div"); hdr.className = "cmd-card-header";
    hdr.innerHTML = '<div class="cmd-title">' + hl(cmd.title) + '</div>' +
      '<div class="cmd-header-actions">' + tagsH +
      '<button class="cmd-action-btn fav-btn' + (fav ? " fav-active" : "") + '" title="Favorite">★</button>' +
      '<button class="cmd-action-btn edit-btn" title="Edit">✎</button>' +
      '<button class="cmd-action-btn delete-btn" title="Delete">✕</button></div>';
    hdr.querySelector(".fav-btn").addEventListener("click", e => { e.stopPropagation(); toggleFav(catId, subIdx, cmdIdx); });
    hdr.querySelector(".edit-btn").addEventListener("click", e => { e.stopPropagation(); editCommand(catId, subIdx, cmdIdx, cmd); });
    hdr.querySelector(".delete-btn").addEventListener("click", e => { e.stopPropagation(); deleteCommand(catId, subIdx, cmdIdx); });
    card.appendChild(hdr);
    if (cmd.desc) { const d = document.createElement("div"); d.className = "cmd-desc"; d.innerHTML = hl(cmd.desc); card.appendChild(d); }
    const cmds = cmd.cmds || (cmd.cmd ? [cmd.cmd] : []);
    if (cmds.length === 1) card.appendChild(mkCode(cmds[0]));
    else if (cmds.length > 1) { const m = document.createElement("div"); m.className = "cmd-multi"; cmds.forEach(c => m.appendChild(mkCode(c))); card.appendChild(m); }
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
      const hasVars = /<[A-Z_]+>/.test(code);
      if (hasVars) { openVarBar(code); return; }
      navigator.clipboard.writeText(code).then(() => { b.textContent = t("copied"); b.classList.add("copied"); setTimeout(() => { b.textContent = t("copy"); b.classList.remove("copied"); }, 1500); });
    });
    w.appendChild(c); w.appendChild(b); return w;
  }

  function hlCode(code) {
    let h = escapeHtml(code);
    h = h.replace(/&lt;([A-Z_]+)&gt;/g, '<span class="placeholder-var">&lt;$1&gt;</span>');
    h = h.replace(/^(#.*)$/gm, '<span style="color:var(--text-tertiary);font-style:italic">$1</span>');
    return h;
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
    hdr.draggable = true;
    hdr.addEventListener("dragstart", e => handleDragStart(e, catIdx));
    hdr.addEventListener("dragover", handleDragOver);
    hdr.addEventListener("drop", e => handleDrop(e, catIdx));
    hdr.addEventListener("dragend", handleDragEnd);
    hdr.innerHTML = '<span class="category-icon">' + cat.icon + '</span><span class="category-title">' + cat.name + '</span><span class="category-count">' + cnt + ' ' + t("commands") + '</span>' +
      '<div class="category-actions"><button class="cat-action-btn" data-act="sub">' + t("addSub") + '</button><button class="cat-action-btn" data-act="edit">✎</button><button class="cat-action-btn delete-btn" data-act="del">✕</button></div><span class="category-toggle">▼</span>';
    hdr.querySelector('[data-act="sub"]').addEventListener("click", e => { e.stopPropagation(); addSubcategory(cat.id); });
    hdr.querySelector('[data-act="edit"]').addEventListener("click", e => { e.stopPropagation(); editCategory(cat); });
    hdr.querySelector('[data-act="del"]').addEventListener("click", e => { e.stopPropagation(); deleteCategory(cat); });
    hdr.addEventListener("click", e => { if (e.target.closest(".category-actions")) return; if (collapsedSections.has(cat.id)) collapsedSections.delete(cat.id); else collapsedSections.add(cat.id); render(); });
    sec.appendChild(hdr);

    if (!collapsed) {
      if (cat.description) { const d = document.createElement("p"); d.className = "category-desc"; d.textContent = cat.description; sec.appendChild(d); }
      // Notes area with CRUD
      const noteArea = document.createElement("div"); noteArea.className = "category-notes";
      const noteHeader = document.createElement("div"); noteHeader.className = "note-header";
      const noteToggle = document.createElement("button"); noteToggle.className = "note-toggle";
      noteToggle.textContent = categoryNotes[cat.id] ? "📝 Notes ▾" : "📝 Add Notes";
      noteHeader.appendChild(noteToggle);
      if (categoryNotes[cat.id]) {
        const noteDelBtn = document.createElement("button"); noteDelBtn.className = "note-delete-btn"; noteDelBtn.textContent = "✕"; noteDelBtn.title = "Delete note";
        noteDelBtn.addEventListener("click", e => { e.stopPropagation(); deleteNote(cat.id); });
        noteHeader.appendChild(noteDelBtn);
      }
      const noteEditor = document.createElement("textarea"); noteEditor.className = "note-editor" + (categoryNotes[cat.id] ? "" : " hidden");
      noteEditor.placeholder = t("notePlaceholder"); noteEditor.value = categoryNotes[cat.id] || "";
      noteEditor.addEventListener("input", () => { saveNote(cat.id, noteEditor.value); });
      noteToggle.addEventListener("click", () => { noteEditor.classList.toggle("hidden"); if (!noteEditor.classList.contains("hidden")) noteEditor.focus(); });
      noteArea.appendChild(noteHeader); noteArea.appendChild(noteEditor); sec.appendChild(noteArea);

      const body = document.createElement("div"); body.className = "category-body";
      cat.subcategories.forEach((sub, subIdx) => {
        const filtered = filterCmds(sub.commands);
        if (searchQuery && filtered.length === 0) return;
        const subDiv = document.createElement("div"); subDiv.className = "subcategory";
        const subH = document.createElement("div"); subH.className = "subcategory-title";
        subH.innerHTML = '<span>' + sub.name + '</span><div class="sub-actions"><button class="sub-action-btn" data-act="cmd">' + t("addCmd") + '</button><button class="sub-action-btn" data-act="edit">✎</button><button class="sub-action-btn delete-btn" data-act="del">✕</button></div>';
        subH.querySelector('[data-act="cmd"]').addEventListener("click", () => addCommand(cat.id, subIdx));
        subH.querySelector('[data-act="edit"]').addEventListener("click", () => editSubcategory(cat.id, subIdx, sub));
        subH.querySelector('[data-act="del"]').addEventListener("click", () => deleteSubcategory(cat.id, subIdx));
        subDiv.appendChild(subH);
        (searchQuery ? filtered : sub.commands).forEach(cmd => { subDiv.appendChild(renderCard(cmd, cat.id, subIdx, sub.commands.indexOf(cmd))); });
        body.appendChild(subDiv);
      });
      sec.appendChild(body);
    }
    return sec;
  }

  function filterCmds(commands) {
    let r = commands;
    if (activeTag !== "all") r = r.filter(c => (c.tags || []).includes(activeTag));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(c => [c.title, c.desc, c.cmd, ...(c.cmds || []), ...(c.tags || []), c.note || ""].join(" ").toLowerCase().includes(q));
    }
    return r;
  }
  function catHasResults(cat) { return cat.subcategories.some(s => filterCmds(s.commands).length > 0); }

  function render() {
    buildSidebar(); contentArea.innerHTML = "";

    // Write-ups view
    if (activeCategory === "writeups") { renderWriteupsPage(); return; }

    // Favorites view
    if (activeCategory === "favs") {
      currentSection.textContent = t("favorites"); hero.style.display = "none";
      const favs = getFavCommands();
      if (favs.length === 0) {
        contentArea.innerHTML = '<div class="no-results"><h3>⭐ ' + t("favorites") + '</h3><p>' + (lang === "tr" ? "Henuz favori komut eklemediniz. Komutlardaki ★ ikonuna tiklayin." : "No favorites yet. Click ★ on commands to add them.") + '</p></div>';
        return;
      }
      favs.forEach(f => contentArea.appendChild(renderCard(f.cmd, f.catId, f.subIdx, f.cmdIdx)));
      return;
    }

    let cats = CATEGORIES;
    if (activeCategory) { cats = CATEGORIES.filter(c => c.id === activeCategory); currentSection.textContent = cats.length ? cats[0].name : t("allCommands"); hero.style.display = "none"; }
    else { currentSection.textContent = searchQuery ? t("searchResults") + ': "' + searchQuery + '"' : t("allCommands"); hero.style.display = searchQuery ? "none" : ""; }

    if (searchQuery) {
      let total = 0; cats.forEach(c => c.subcategories.forEach(s => (total += filterCmds(s.commands).length)));
      const sh = document.createElement("div"); sh.className = "search-results-header";
      sh.innerHTML = "<h2>" + t("searchResults") + "</h2><p>" + total + " " + t("commands") + " " + t("matching") + ' "' + escapeHtml(searchQuery) + '"</p>';
      contentArea.appendChild(sh);
      if (total === 0) { contentArea.innerHTML += '<div class="no-results"><h3>' + t("noResults") + '</h3><p>' + t("tryDiff") + '</p></div>'; return; }
    }
    cats.forEach((c, i) => { if (searchQuery && !catHasResults(c)) return; contentArea.appendChild(renderCat(c, CATEGORIES.indexOf(c))); });
  }

  // ── Search ──
  let st; searchInput.addEventListener("input", () => { clearTimeout(st); st = setTimeout(() => { searchQuery = searchInput.value.trim(); if (searchQuery) activeCategory = null; render(); }, 200); });
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); searchInput.focus(); searchInput.select(); }
    if (e.key === "Escape") { if (varBar.classList.contains("active")) varBar.classList.remove("active"); else if (modalOverlay.classList.contains("active")) closeModal(); else if (searchQuery) { searchQuery = ""; searchInput.value = ""; render(); } closeMobile(); }
  });

  function closeMobile() { sidebar.classList.remove("open"); overlay.classList.remove("active"); }
  $("sidebarOpen").addEventListener("click", () => { sidebar.classList.add("open"); overlay.classList.add("active"); });
  $("sidebarClose").addEventListener("click", closeMobile);
  overlay.addEventListener("click", closeMobile);
  $("expandAll").addEventListener("click", () => { collapsedSections.clear(); render(); });
  $("collapseAll").addEventListener("click", () => { CATEGORIES.forEach(c => collapsedSections.add(c.id)); render(); });

  const saved = localStorage.getItem("cheatsheet-theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  $("themeToggle").addEventListener("click", () => { const n = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light"; document.documentElement.setAttribute("data-theme", n); localStorage.setItem("cheatsheet-theme", n); });

  const btt = document.createElement("button"); btt.className = "back-to-top"; btt.innerHTML = "↑"; document.body.appendChild(btt);
  btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => btt.classList.toggle("visible", window.scrollY > 400));

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  // ── Init ──
  document.documentElement.setAttribute("data-lang", lang);
  searchInput.placeholder = t("search");
  loadData();
})();
