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
      exportMd: "Export MD", exportPdf: "Export PDF", termCopy: "Terminal Copy"
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
      exportMd: "MD Aktar", exportPdf: "PDF Aktar", termCopy: "Terminal Kopyala"
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
    await loadMachines();
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

  // ── Notes (multiple per category, server-backed) ──
  async function loadNotes() { categoryNotes = await api("GET", "/api/notes"); }
  function getNotes(catId) { return categoryNotes[catId] || []; }
  function getNotesCount(catId) { return (categoryNotes[catId] || []).length; }
  function getTotalNotesCount() { let c = 0; Object.values(categoryNotes).forEach(arr => { if (Array.isArray(arr)) c += arr.length; }); return c; }
  async function addNote(catId) {
    const note = await api("POST", "/api/notes/" + catId, { text: "" });
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
  async function loadWriteups() { writeups = await api("GET", "/api/writeups"); }
  async function createWriteup() {
    openModal("New Write-up", [
      { key: "title", label: "Title", placeholder: "e.g., HackTheBox — Lame" },
      { key: "tags", label: "Tags", placeholder: "HTB, OSCP, Linux, Easy (comma-separated)" }
    ], {}, async fd => {
      const tags = fd.tags.split(",").map(s => s.trim()).filter(Boolean);
      const wu = await api("POST", "/api/writeups", { title: fd.title, tags, content: "" });
      await loadWriteups();
      openWriteupId = wu.id;
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
      // ── EDIT MODE ──
      const titleInput = document.createElement("input"); titleInput.className = "wu-page-title";
      titleInput.value = wu.title; titleInput.placeholder = "Write-up title...";
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

      // Image upload button
      const imgBar = document.createElement("div"); imgBar.className = "wu-img-bar";
      imgBar.innerHTML = '<button class="btn btn-secondary btn-sm wu-img-btn">📷 ' + (lang === "tr" ? "Gorsel Ekle" : "Add Image") + '</button>' +
        '<input type="file" class="wu-img-input" accept="image/*" style="display:none">' +
        '<span class="wu-img-hint">' + (lang === "tr" ? "Gorsel yukleyin, link otomatik eklenir" : "Upload image, link auto-inserted") + '</span>';
      const imgInput = imgBar.querySelector(".wu-img-input");
      imgBar.querySelector(".wu-img-btn").addEventListener("click", () => imgInput.click());
      page.appendChild(imgBar);

      const editor = document.createElement("textarea"); editor.className = "wu-page-editor";
      editor.value = wu.content || "";
      editor.placeholder = lang === "tr" ? "Write-up iceriginizi buraya yazin..." : "Write your content here...";
      editor.addEventListener("input", () => { saveWu(wu.id, { content: editor.value }); showStatus(); });

      imgInput.addEventListener("change", async e => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          const res = await api("POST", "/api/upload", { data: reader.result, filename: file.name });
          if (res.url) {
            const pos = editor.selectionStart;
            const text = editor.value;
            const imgTag = "\n![" + file.name + "](" + res.url + ")\n";
            editor.value = text.slice(0, pos) + imgTag + text.slice(pos);
            saveWu(wu.id, { content: editor.value });
            showStatus();
          }
        };
        reader.readAsDataURL(file);
        e.target.value = "";
      });

      page.appendChild(editor);
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
      // Simple rendering: preserve line breaks, highlight code-like lines
      const content = wu.content || (lang === "tr" ? "Henuz icerik yok. Duzenle butonuna tiklayin." : "No content yet. Click Edit to start writing.");
      body.innerHTML = escapeHtml(content)
        .replace(/^(#{1,3})\s+(.*)$/gm, (m, h, t) => '<h' + (h.length + 1) + ' class="wu-heading">' + t + '</h' + (h.length + 1) + '>')
        .replace(/^(```[\s\S]*?```)$/gm, '<pre class="wu-code-block">$1</pre>')
        .replace(/`([^`]+)`/g, '<code class="wu-inline-code">$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="wu-img-container"><img src="$2" alt="$1" class="wu-read-img"><span class="wu-img-caption">$1</span></div>')
        .replace(/\n/g, '<br>');
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
  async function loadMachines() { machines = await api("GET", "/api/machines"); }
  async function createMachine() {
    openModal(t("addMachine"), [
      { key: "name", label: t("machineName"), placeholder: "e.g., Lame" },
      { key: "ip", label: t("machineIP"), placeholder: "10.10.10.3" },
      { key: "os", label: t("machineOS"), placeholder: "Linux / Windows" }
    ], {}, async fd => {
      const m = await api("POST", "/api/machines", { name: fd.name, ip: fd.ip, os: fd.os });
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
      const osIcon = (m.os || "").toLowerCase().includes("windows") ? "🪟" : (m.os || "").toLowerCase().includes("linux") ? "🐧" : "🖥";
      const card = document.createElement("div"); card.className = "machine-card";
      card.innerHTML =
        '<div class="machine-card-top">' +
          '<span class="machine-os-icon">' + osIcon + '</span>' +
          '<div class="machine-info"><div class="machine-name">' + escapeHtml(m.name) + '</div><div class="machine-ip">' + escapeHtml(m.ip || "No IP") + '</div></div>' +
          '<button class="machine-del-btn" title="Delete">🗑</button>' +
        '</div>' +
        '<div class="machine-progress"><div class="machine-progress-bar"><div class="machine-progress-fill" style="width:' + pct + '%"></div></div><span class="machine-progress-text">' + done + '/' + total + ' (' + pct + '%)</span></div>';
      card.addEventListener("click", () => { openMachineId = m.id; render(); });
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

    // Machine header info
    const info = document.createElement("div"); info.className = "machine-info-section";
    const osIcon = (m.os || "").toLowerCase().includes("windows") ? "🪟" : (m.os || "").toLowerCase().includes("linux") ? "🐧" : "🖥";
    info.innerHTML =
      '<div class="machine-detail-header">' +
        '<span class="machine-detail-icon">' + osIcon + '</span>' +
        '<div><h1 class="machine-detail-name">' + escapeHtml(m.name) + '</h1><span class="machine-detail-ip">' + escapeHtml(m.ip || "") + '</span> <span class="machine-detail-os">' + escapeHtml(m.os || "") + '</span></div>' +
      '</div>';
    page.appendChild(info);

    // Checklist
    const checkSection = document.createElement("div"); checkSection.className = "machine-section";
    checkSection.innerHTML = '<h3>Checklist</h3>';
    const checkList = document.createElement("div"); checkList.className = "machine-checklist";
    (m.checklist || []).forEach((item, idx) => {
      const row = document.createElement("label"); row.className = "checklist-item" + (item.done ? " done" : "");
      row.innerHTML = '<input type="checkbox"' + (item.done ? " checked" : "") + '><span>' + escapeHtml(item.label) + '</span>';
      row.querySelector("input").addEventListener("change", e => {
        m.checklist[idx].done = e.target.checked;
        saveMachine(m.id, { checklist: m.checklist });
        row.classList.toggle("done", e.target.checked);
        showMachineStatus();
      });
      checkList.appendChild(row);
    });
    checkSection.appendChild(checkList);
    page.appendChild(checkSection);

    // Services
    const svcSection = document.createElement("div"); svcSection.className = "machine-section";
    svcSection.innerHTML = '<h3>' + t("services") + '</h3>';
    const svcArea = document.createElement("textarea"); svcArea.className = "machine-textarea";
    svcArea.placeholder = "22/tcp  SSH  OpenSSH 7.9\n80/tcp  HTTP Apache 2.4\n445/tcp SMB  Samba 4.9";
    svcArea.value = (m.services || []).join("\n");
    svcArea.addEventListener("input", () => { saveMachine(m.id, { services: svcArea.value.split("\n").filter(Boolean) }); showMachineStatus(); });
    svcSection.appendChild(svcArea); page.appendChild(svcSection);

    // Credentials
    const credSection = document.createElement("div"); credSection.className = "machine-section";
    credSection.innerHTML = '<h3>' + t("credentials") + '</h3>';
    const credArea = document.createElement("textarea"); credArea.className = "machine-textarea";
    credArea.placeholder = "admin:password123\nroot:toor\nuser:hash:abc123...";
    credArea.value = (m.credentials || []).join("\n");
    credArea.addEventListener("input", () => { saveMachine(m.id, { credentials: credArea.value.split("\n").filter(Boolean) }); showMachineStatus(); });
    credSection.appendChild(credArea); page.appendChild(credSection);

    // Notes
    const noteSection = document.createElement("div"); noteSection.className = "machine-section";
    noteSection.innerHTML = '<h3>' + t("notes") + '</h3>';
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
    // Categories
    CATEGORIES.forEach((cat, idx) => {
      let cnt = 0; cat.subcategories.forEach(s => (cnt += s.commands.length));
      const nc = getNotesCount(cat.id);
      const label = cnt + (nc > 0 ? " + " + nc + "📝" : "");
      const catName = (lang === "tr" && cat.name_tr) ? cat.name_tr : cat.name;
      const item = mkNavItem(cat.icon, catName, label, activeCategory === cat.id, () => { activeCategory = cat.id; searchQuery = ""; searchInput.value = ""; render(); closeMobile(); window.scrollTo({ top: 0, behavior: "smooth" }); });
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
    const descText = (lang === "tr" && cmd.desc_tr) ? cmd.desc_tr : cmd.desc;
    if (descText) { const d = document.createElement("div"); d.className = "cmd-desc"; d.innerHTML = hl(descText); card.appendChild(d); }
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
      const applied = applyIpToCode(code);
      const hasVars = /<[A-Z_]+>/.test(applied);
      if (hasVars) { openVarBar(applied); return; }
      navigator.clipboard.writeText(applied).then(() => { b.textContent = t("copied"); b.classList.add("copied"); setTimeout(() => { b.textContent = t("copy"); b.classList.remove("copied"); }, 1500); });
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
      '<div class="category-actions"><button class="cat-action-btn" data-act="term" title="' + t("termCopy") + '">📋</button><button class="cat-action-btn" data-act="sub">' + t("addSub") + '</button><button class="cat-action-btn" data-act="edit">✎</button><button class="cat-action-btn delete-btn" data-act="del">✕</button></div><span class="category-toggle">▼</span>';
    hdr.querySelector('[data-act="term"]').addEventListener("click", e => { e.stopPropagation(); copyTerminalFormat(cat.id); });
    hdr.querySelector('[data-act="sub"]').addEventListener("click", e => { e.stopPropagation(); addSubcategory(cat.id); });
    hdr.querySelector('[data-act="edit"]').addEventListener("click", e => { e.stopPropagation(); editCategory(cat); });
    hdr.querySelector('[data-act="del"]').addEventListener("click", e => { e.stopPropagation(); deleteCategory(cat); });
    hdr.addEventListener("click", e => { if (e.target.closest(".category-actions")) return; if (collapsedSections.has(cat.id)) collapsedSections.delete(cat.id); else collapsedSections.add(cat.id); render(); });
    sec.appendChild(hdr);

    if (!collapsed) {
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
        if (searchQuery && filtered.length === 0) return;
        const subDiv = document.createElement("div"); subDiv.className = "subcategory";
        const subH = document.createElement("div"); subH.className = "subcategory-title";
        const subName = (lang === "tr" && sub.name_tr) ? sub.name_tr : sub.name;
        subH.innerHTML = '<span>' + subName + '</span><div class="sub-actions"><button class="sub-action-btn" data-act="cmd">' + t("addCmd") + '</button><button class="sub-action-btn" data-act="edit">✎</button><button class="sub-action-btn delete-btn" data-act="del">✕</button></div>';
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
    buildSidebar(); contentArea.innerHTML = ""; focusedCmdIdx = -1;

    // Write-ups view
    if (activeCategory === "writeups") { renderWriteupsPage(); return; }
    // Machines view
    if (activeCategory === "machines") { renderMachinesPage(); return; }

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
    if (activeCategory) { cats = CATEGORIES.filter(c => c.id === activeCategory); currentSection.textContent = cats.length ? ((lang === "tr" && cats[0].name_tr) ? cats[0].name_tr : cats[0].name) : t("allCommands"); hero.style.display = "none"; }
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
    html += '<div class="meta">Tags: ' + (wu.tags || []).join(", ") + " | " + new Date(wu.updatedAt).toLocaleString() + "</div><hr>";
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
    navigator.clipboard.writeText(output).then(() => alert(lang === "tr" ? "Terminal formatinda kopyalandi!" : "Copied in terminal format!"));
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
    cards[focusedCmdIdx].scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function copyFocused() {
    const cards = getFocusableCards();
    if (focusedCmdIdx < 0 || focusedCmdIdx >= cards.length) return;
    const codeEl = cards[focusedCmdIdx].querySelector(".cmd-code");
    if (codeEl) {
      const code = codeEl.textContent;
      const applied = applyIpToCode(code);
      if (/<[A-Z_]+>/.test(applied)) openVarBar(code);
      else navigator.clipboard.writeText(applied).then(() => {
        const btn = cards[focusedCmdIdx].querySelector(".cmd-copy-btn");
        if (btn) { btn.textContent = t("copied"); btn.classList.add("copied"); setTimeout(() => { btn.textContent = t("copy"); btn.classList.remove("copied"); }, 1500); }
      });
    }
  }

  document.addEventListener("keydown", e => {
    const active = document.activeElement;
    const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);

    // Ctrl+K — search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); searchInput.focus(); searchInput.select(); return; }
    // Ctrl+I — IP changer
    if ((e.ctrlKey || e.metaKey) && e.key === "i") { e.preventDefault(); ipBar.classList.toggle("active"); if (ipBar.classList.contains("active")) ipFields.LHOST.focus(); return; }
    // Escape
    if (e.key === "Escape") {
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
