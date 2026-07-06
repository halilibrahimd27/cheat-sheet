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
  // Multi-select tag filter: empty Set = "All". A command matches if it carries
  // ANY selected tag (union). Kept as a Set so chips toggle independently.
  let activeTags = new Set();
  function tagFilterActive() { return activeTags.size > 0; }
  function cmdMatchesTags(c) { return activeTags.size === 0 || (c.tags || []).some(tg => activeTags.has(tg)); }
  // Script basket: an ordered scratch buffer of raw commands (with placeholders).
  let basket = JSON.parse(localStorage.getItem("cs-basket") || "[]");
  let categoryNotes = {};
  let writeups = [];
  let machines = [];
  // Write-up list view state (pins persist; query/tag are transient per session).
  let wuPins = JSON.parse(localStorage.getItem("cs-wu-pins") || "[]");
  let wuSort = localStorage.getItem("cs-wu-sort") || "recent";
  let wuQuery = "", wuTagFilter = "all";
  // Machine list dashboard filter/sort state (survives render() re-runs).
  let machineFilter = { q: "", platform: "", status: "", tag: "", sort: "recent" };
  let machineView = localStorage.getItem("cs-machine-view") || "grid"; // "grid" | "board"
  // Machine metadata enumerations (shared by create modal, detail chips, cards).
  const MACHINE_PLATFORMS = ["HTB", "THM", "PG", "OSCP", "Custom"];
  const MACHINE_DIFFS = ["Easy", "Medium", "Hard", "Insane"];
  const MACHINE_STATUSES = ["not-started", "in-progress", "owned", "reported"];
  const ST_KEY = { "not-started": "stNotStarted", "in-progress": "stInProgress", "owned": "stOwned", "reported": "stReported" };
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
      wuTemplate: "Template", wuMachine: "Link machine", wuSection: "Section",
      history: "History", noHistory: "No copied commands yet.",
      clearHistory: "Clear", copyAll: "Copy all", paletteHint: "Search commands & actions…", goto: "Go to",
      engagement: "Engagement", connections: "Connections", fromMachine: "Add from machine…",
      newHost: "+ New host", objective: "Objective", loot: "Loot / creds",
      connect: "Connect", connectHint: "Click a node, then another, to link them. Click Connect again to finish.", hostRole: "Role",
      // — Machines round 3 (metadata, flags, dashboard, timing) —
      mPlatform: "Platform", mDifficulty: "Difficulty", mStatus: "Status",
      mTagsHint: "HTB, Linux, web (comma-separated)",
      diff_easy: "Easy", diff_medium: "Medium", diff_hard: "Hard", diff_insane: "Insane",
      stNotStarted: "Not started", stInProgress: "In progress", stOwned: "Owned", stReported: "Reported",
      statTotal: "Total", statOwned: "Owned", statInProgress: "In progress", statAvg: "Avg progress",
      mSearch: "Search machines…", filterAll: "All", filterPlatform: "Platform", filterStatus: "Status", filterTag: "Tag",
      sortRecent: "Recent", sortName: "Name", sortProgress: "Progress", noMatches: "No machines match your filters.",
      userFlag: "User flag", rootFlag: "Root flag", capture: "Capture", capturedAt: "Captured", notCaptured: "Not captured",
      flags: "Flags", genWriteup: "Generate write-up", wuGenerated: "Write-up generated",
      filledFrom: "Placeholders filled from", machineNoIp: "That machine has no IP yet — set one to fill the target.",
      dragHint: "Tip: drag a node to reposition it.",
      detailTab: "Details", reportTab: "Report", saveAsWriteup: "Save as write-up",
      reportLive: "This report is generated live from the machine's current data. Export it, or save an editable copy as a write-up.",
      loading: "Loading…", loadErrTitle: "Couldn't reach the server", loadErrBody: "The app couldn't load your data. Make sure the server is running, then retry.", retry: "Retry",
      svcScanHint: "Copy a service scan for this port", delItem: "Remove item", jumpMachine: "Machine", jumpWriteup: "Write-up",
      copyPhaseCmds: "Copy phase commands", noPhaseCmds: "No commands in this phase",
      started: "Started", ownedAtLbl: "Owned at", elapsed: "Elapsed", timeToOwn: "Time to own",
      exportMachineMd: "Export MD", addChecklistItem: "+ Add item", customItemPh: "Custom checklist item…",
      // — Write-ups round 3 (list controls, create, export, cross-link) —
      writeups: "Write-ups", writeupsDesc: "Document your pentest findings and write-ups. Click to open and edit.",
      newWriteup: "+ New Write-up", wuSearch: "Search write-ups…", wuSort: "Sort",
      wuSortRecent: "Recent", wuSortTitle: "Title", wuSortWords: "Word count",
      wuAllTags: "All tags", wuNoMatch: "No write-ups match your filters.",
      wuCount: "write-ups", wuTotalWords: "total words", wuWords: "words", wuMin: "min read",
      wuPin: "Pin", wuUnpin: "Unpin", wuEmptyTitle: "No write-ups yet", wuEmptyBody: "Create your first write-up.",
      wuNewTitle: "New Write-up", wuTitleLabel: "Title", wuTitlePh: "Write-up title...", wuStartBlank: "Blank document",
      wuExportHtml: "Export HTML", wuCopyRendered: "Copy rendered",
      wuRelatedMachine: "Related machine", wuOpenMachine: "Open machine",
      wuEditTags: "Edit Tags", confirmDelWriteup: "Delete this write-up?", back: "Back", imageBtn: "Image", wuTags: "Tags",
      // — Round 5: structured machine workspace —
      svcPort: "Port", svcProto: "Proto", svcName: "Service", svcVersion: "Version", svcState: "State", svcInfo: "Notes",
      svcAdd: "+ Service", svcNone: "No services yet. Add a row or import nmap output.",
      importNmap: "⇪ Import nmap", importNmapTitle: "Import nmap output", importNmapPh: "Paste `nmap -sCV`/`-sV` output. Ports, services and versions are parsed automatically.",
      importDo: "Parse & add", importedN: "Imported {n} services", importedNone: "No services found in that output",
      rawToggle: "Raw", tableToggle: "Table", scanPort: "Scan this port", scanAll: "Scan all ports",
      credUser: "User", credSecret: "Secret", credTypeCol: "Type", credSource: "Source", credWorks: "Works on", credState: "State",
      credAdd: "+ Credential", credNone: "No credentials captured yet.",
      credCopyUser: "Copy user", credCopySecret: "Copy secret", credCopyPair: "Copy user:pass",
      timeline: "Activity Timeline", timelineNone: "No activity yet. Commands you copy while this box is the active target are logged here automatically.",
      timelineAdd: "+ Log entry", timelineNotePh: "Manual entry — finding, decision, milestone…", clearTimeline: "Clear",
      tlCmd: "command", tlNote: "note", tlEvent: "event", confirmClearTl: "Clear this machine's activity timeline?",
      activeTarget: "Active target", setActive: "Set as active target", unsetActive: "Unset active target",
      activeBadge: "ACTIVE", activeHint: "Copied commands log to this box.", activeNowSet: "Active target set — copies now log here",
      evidence: "Evidence", evidenceNone: "No screenshots yet. Paste (Ctrl+V) or drop an image to attach proof.",
      evidenceCaption: "Caption / description…", evidenceDrop: "Paste or drop a screenshot here", evidenceDel: "Remove screenshot",
      boardView: "▤ Board", gridView: "▦ Grid", colDrop: "Drop here",
      // — Round 5: write-up pro (CVSS) —
      cvssCalc: "🧮 CVSS 3.1", cvssTitle: "CVSS 3.1 Base Score", cvssInsert: "Insert into write-up", cvssVector: "Vector", cvssScore: "Score", cvssSeverity: "Severity",
      // — Round 5: variable profiles + basket —
      profiles: "Profiles", profileSave: "Save as profile", profileNew: "Profile name (e.g., Active Box)", profileNone: "No saved profiles", profileApply: "Apply", profileDel: "Delete profile", profileSaved: "Profile saved",
      basket: "Script basket", basketAdd: "Add to basket", basketNone: "Basket is empty. Add commands to build a script.", basketCopy: "Copy script", basketClear: "Clear", basketExport: "Export .sh", basketTitle: "🧺 Script Basket", basketAdded: "Added to basket", basketCount: "in basket"
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
      wuTemplate: "Sablon", wuMachine: "Makine bagla", wuSection: "Bolum",
      history: "Gecmis", noHistory: "Henuz kopyalanan komut yok.",
      clearHistory: "Temizle", copyAll: "Tumunu kopyala", paletteHint: "Komut ve eylem ara…", goto: "Git",
      engagement: "Operasyon", connections: "Baglantilar", fromMachine: "Makineden ekle…",
      newHost: "+ Yeni host", objective: "Hedef", loot: "Loot / kimlik",
      connect: "Bağla", connectHint: "Bir düğüme, sonra diğerine tıklayarak bağla. Bitirmek için tekrar Bağla'ya tıkla.", hostRole: "Rol",
      // — Machines round 3 (ASCII-safe TR) —
      mPlatform: "Platform", mDifficulty: "Zorluk", mStatus: "Durum",
      mTagsHint: "HTB, Linux, web (virgul ile ayirin)",
      diff_easy: "Kolay", diff_medium: "Orta", diff_hard: "Zor", diff_insane: "Cok Zor",
      stNotStarted: "Baslanmadi", stInProgress: "Devam ediyor", stOwned: "Ele gecirildi", stReported: "Raporlandi",
      statTotal: "Toplam", statOwned: "Ele gecirilen", statInProgress: "Devam eden", statAvg: "Ort. ilerleme",
      mSearch: "Makine ara…", filterAll: "Tumu", filterPlatform: "Platform", filterStatus: "Durum", filterTag: "Etiket",
      sortRecent: "Guncel", sortName: "Isim", sortProgress: "Ilerleme", noMatches: "Filtrelerle eslesen makine yok.",
      userFlag: "User flag", rootFlag: "Root flag", capture: "Yakala", capturedAt: "Yakalandi", notCaptured: "Yakalanmadi",
      flags: "Bayraklar", genWriteup: "Write-up olustur", wuGenerated: "Write-up olusturuldu",
      filledFrom: "Degiskenler dolduruldu:", machineNoIp: "Bu makinenin IP'si yok — once IP girin.",
      dragHint: "Ipucu: bir dugumu surukleyerek yeniden konumlandirabilirsiniz.",
      detailTab: "Detay", reportTab: "Rapor", saveAsWriteup: "Write-up olarak kaydet",
      reportLive: "Bu rapor makinenin guncel verisinden canli uretilir. Disa aktarabilir ya da duzenlenebilir bir write-up olarak kaydedebilirsiniz.",
      loading: "Yukleniyor…", loadErrTitle: "Sunucuya ulasilamadi", loadErrBody: "Uygulama verilerinizi yukleyemedi. Sunucunun calistigindan emin olun ve tekrar deneyin.", retry: "Tekrar dene",
      svcScanHint: "Bu port icin servis taramasi kopyala", delItem: "Maddeyi kaldir", jumpMachine: "Makine", jumpWriteup: "Write-up",
      copyPhaseCmds: "Asama komutlarini kopyala", noPhaseCmds: "Bu asamada komut yok",
      started: "Baslatildi", ownedAtLbl: "Ele gecirilme", elapsed: "Gecen sure", timeToOwn: "Ele gecirme suresi",
      exportMachineMd: "MD Aktar", addChecklistItem: "+ Madde ekle", customItemPh: "Ozel kontrol maddesi…",
      // — Write-ups round 3 (ASCII-safe TR) —
      writeups: "Write-up'lar", writeupsDesc: "Pentest bulgularinizi ve write-up'larinizi belgeleyin. Acmak icin tiklayin.",
      newWriteup: "+ Yeni Write-up", wuSearch: "Write-up ara…", wuSort: "Sirala",
      wuSortRecent: "En yeni", wuSortTitle: "Baslik", wuSortWords: "Kelime sayisi",
      wuAllTags: "Tum etiketler", wuNoMatch: "Filtrelerle eslesen write-up yok.",
      wuCount: "write-up", wuTotalWords: "toplam kelime", wuWords: "kelime", wuMin: "dk okuma",
      wuPin: "Sabitle", wuUnpin: "Sabitlemeyi kaldir", wuEmptyTitle: "Henuz write-up yok", wuEmptyBody: "Ilk write-up'inizi olusturun.",
      wuNewTitle: "Yeni Write-up", wuTitleLabel: "Baslik", wuTitlePh: "Write-up basligi...", wuStartBlank: "Bos belge",
      wuExportHtml: "HTML Aktar", wuCopyRendered: "Bicimlendirilmis kopyala",
      wuRelatedMachine: "Ilgili makine", wuOpenMachine: "Makineyi ac",
      wuEditTags: "Etiketleri Duzenle", confirmDelWriteup: "Bu write-up silinsin mi?", back: "Geri", imageBtn: "Gorsel", wuTags: "Etiketler",
      // — Round 5: yapilandirilmis makine calisma alani —
      svcPort: "Port", svcProto: "Proto", svcName: "Servis", svcVersion: "Surum", svcState: "Durum", svcInfo: "Not",
      svcAdd: "+ Servis", svcNone: "Henuz servis yok. Satir ekleyin ya da nmap ciktisi aktarin.",
      importNmap: "⇪ nmap aktar", importNmapTitle: "nmap ciktisi aktar", importNmapPh: "`nmap -sCV`/`-sV` ciktisini yapistirin. Port, servis ve surumler otomatik ayristirilir.",
      importDo: "Ayristir ve ekle", importedN: "{n} servis aktarildi", importedNone: "Bu ciktida servis bulunamadi",
      rawToggle: "Ham", tableToggle: "Tablo", scanPort: "Bu portu tara", scanAll: "Tum portlari tara",
      credUser: "Kullanici", credSecret: "Parola/Sir", credTypeCol: "Tur", credSource: "Kaynak", credWorks: "Gecerli oldugu", credState: "Durum",
      credAdd: "+ Kimlik", credNone: "Henuz kimlik bilgisi yok.",
      credCopyUser: "Kullaniciyi kopyala", credCopySecret: "Sirri kopyala", credCopyPair: "user:pass kopyala",
      timeline: "Islem Zaman Cizelgesi", timelineNone: "Henuz islem yok. Bu makine aktif hedefken kopyaladiginiz komutlar buraya otomatik islenir.",
      timelineAdd: "+ Kayit ekle", timelineNotePh: "Manuel kayit — bulgu, karar, kilometre tasi…", clearTimeline: "Temizle",
      tlCmd: "komut", tlNote: "not", tlEvent: "olay", confirmClearTl: "Bu makinenin zaman cizelgesi temizlensin mi?",
      activeTarget: "Aktif hedef", setActive: "Aktif hedef yap", unsetActive: "Aktif hedefi kaldir",
      activeBadge: "AKTIF", activeHint: "Kopyalanan komutlar bu makineye islenir.", activeNowSet: "Aktif hedef ayarlandi — kopyalar artik buraya islenir",
      evidence: "Kanit", evidenceNone: "Henuz ekran goruntusu yok. Kanit eklemek icin bir gorseli yapistirin (Ctrl+V) ya da surukleyin.",
      evidenceCaption: "Aciklama…", evidenceDrop: "Ekran goruntusunu buraya yapistirin ya da surukleyin", evidenceDel: "Goruntuyu kaldir",
      boardView: "▤ Pano", gridView: "▦ Izgara", colDrop: "Buraya birak",
      cvssCalc: "🧮 CVSS 3.1", cvssTitle: "CVSS 3.1 Temel Skor", cvssInsert: "Write-up'a ekle", cvssVector: "Vektor", cvssScore: "Skor", cvssSeverity: "Onem",
      profiles: "Profiller", profileSave: "Profil olarak kaydet", profileNew: "Profil adi (or. Aktif Makine)", profileNone: "Kayitli profil yok", profileApply: "Uygula", profileDel: "Profili sil", profileSaved: "Profil kaydedildi",
      basket: "Script sepeti", basketAdd: "Sepete ekle", basketNone: "Sepet bos. Script olusturmak icin komut ekleyin.", basketCopy: "Scripti kopyala", basketClear: "Temizle", basketExport: ".sh aktar", basketTitle: "🧺 Script Sepeti", basketAdded: "Sepete eklendi", basketCount: "sepette"
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
    // Static / offline build: no server — route through the in-browser backend.
    if (window.CS_STATIC && window.CS_BACKEND) {
      let r;
      try { r = await window.CS_BACKEND.request(method, url, body); }
      catch (e) { console.error("[local-backend]", e); toast(t("netErr"), "error"); return null; }
      if (r.status >= 400) {
        const msg = (r.json && r.json.error) ? r.json.error : ("HTTP " + r.status);
        toast(msg + " · " + method + " " + url.replace(/^.*(\/api\/[a-z-]+).*$/i, "$1"), "error");
      }
      return r.json;
    }
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
      const msg = (data && data.error) ? data.error : ("HTTP " + res.status);
      // Surface which request failed so a 500 is diagnosable (path without ids).
      const where = method + " " + url.replace(/^.*(\/api\/[a-z-]+).*$/i, "$1");
      toast(msg + " · " + where, "error");
      console.error("[api] " + res.status + " " + method + " " + url, data);
    }
    return data;
  }
  function showLoading() {
    hero.style.display = "none";
    contentArea.innerHTML = '<div class="app-loading" role="status" aria-live="polite"><div class="app-spinner" aria-hidden="true"></div><p>' + t("loading") + '</p></div>';
  }
  function showLoadError() {
    hero.style.display = "none";
    contentArea.innerHTML = '<div class="app-error"><div class="app-error-icon" aria-hidden="true">⚠️</div><h3>' + t("loadErrTitle") + '</h3><p>' + t("loadErrBody") + '</p><button class="btn btn-primary" id="retryBtn">' + t("retry") + '</button></div>';
    const b = document.getElementById("retryBtn"); if (b) b.addEventListener("click", loadData);
  }
  async function loadData() {
    showLoading();
    // Categories are the critical collection — if the server is unreachable, show
    // a retryable error instead of a permanently blank screen.
    const cats = await api("GET", "/api/categories");
    if (cats == null) { showLoadError(); return; }
    CATEGORIES = cats;
    await Promise.all([loadNotes(), loadWriteups(), loadMachines()]);
    buildSearchIndex();
    migrateFavorites();
    render();
  }

  function getStats() {
    let tc = 0, ts = 0;
    CATEGORIES.forEach(c => c.subcategories.forEach(s => { ts++; tc += s.commands.length; }));
    return { tc, cats: CATEGORIES.length, ts };
  }

  // ── Favorites ──
  // Favorites are keyed by each command's stable id (backfilled server-side), so
  // they survive reordering / deletion of sibling commands.
  function isFav(cmd) { return !!(cmd && cmd.id && favorites.includes(cmd.id)); }
  function toggleFav(cmd) {
    if (!cmd || !cmd.id) return;
    const k = cmd.id;
    const nowFav = !favorites.includes(k);
    if (nowFav) favorites.push(k); else favorites = favorites.filter(f => f !== k);
    localStorage.setItem("cs-favorites", JSON.stringify(favorites));
    if (activeCategory === "favs") { render(); return; }
    // Scoped update: flip the matching star(s) + refresh the cheap sidebar.
    document.querySelectorAll('.fav-btn[data-fav="' + k + '"]').forEach(b => b.classList.toggle("fav-active", nowFav));
    buildSidebar();
  }
  function getFavCommands() {
    const r = [], seen = {};
    favorites.forEach(id => {
      if (seen[id]) return;
      for (const cat of CATEGORIES) {
        for (let si = 0; si < cat.subcategories.length; si++) {
          const ci = cat.subcategories[si].commands.findIndex(c => c.id === id);
          if (ci >= 0) { r.push({ cmd: cat.subcategories[si].commands[ci], catId: cat.id, subIdx: si, cmdIdx: ci, subName: cat.subcategories[si].name }); seen[id] = 1; return; }
        }
      }
    });
    return r;
  }
  // One-time migration of legacy positional favorites (catId:subIdx:cmdIdx) → ids.
  function migrateFavorites() {
    let changed = false;
    favorites = favorites.map(k => {
      if (/^[a-z0-9-]+:\d+:\d+$/.test(k)) {
        const [cid, si, ci] = k.split(":");
        const cat = CATEGORIES.find(c => c.id === cid);
        const sub = cat && cat.subcategories[+si];
        const cmd = sub && sub.commands[+ci];
        if (cmd && cmd.id) { changed = true; return cmd.id; }
        return null;
      }
      return k;
    }).filter(Boolean);
    const uniq = [], s = {}; favorites.forEach(k => { if (!s[k]) { s[k] = 1; uniq.push(k); } });
    favorites = uniq;
    if (changed) localStorage.setItem("cs-favorites", JSON.stringify(favorites));
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

  // ── Variable profiles: save/apply named sets of the Quick IP Changer values ──
  // Lets you keep one profile per target box and switch between them instantly.
  function getProfiles() { try { const p = JSON.parse(localStorage.getItem("cs-var-profiles") || "{}"); return (p && typeof p === "object" && !Array.isArray(p)) ? p : {}; } catch { return {}; } }
  function setProfiles(p) { localStorage.setItem("cs-var-profiles", JSON.stringify(p)); }
  function applyProfile(name) {
    const data = getProfiles()[name]; if (!data) return;
    Object.keys(ipFields).forEach(k => { ipFields[k].value = data[k] || ""; });
    saveIpValues();
  }
  const ipProfilesRow = document.createElement("div"); ipProfilesRow.className = "ip-profiles";
  const profSave = document.createElement("button"); profSave.className = "btn btn-secondary btn-sm"; profSave.textContent = "💾 " + t("profileSave");
  const profSel = document.createElement("select"); profSel.className = "form-select ip-profile-select"; profSel.setAttribute("aria-label", t("profiles"));
  const profApply = document.createElement("button"); profApply.className = "btn btn-secondary btn-sm"; profApply.textContent = t("profileApply");
  const profDel = document.createElement("button"); profDel.className = "btn btn-secondary btn-sm"; profDel.textContent = "🗑"; profDel.title = t("profileDel"); profDel.setAttribute("aria-label", t("profileDel"));
  function refreshProfiles() {
    const names = Object.keys(getProfiles());
    profSel.innerHTML = names.length ? names.map(n => '<option value="' + escapeHtml(n) + '">' + escapeHtml(n) + '</option>').join("") : '<option value="">' + t("profileNone") + '</option>';
    profApply.disabled = profDel.disabled = names.length === 0;
  }
  profSave.addEventListener("click", () => {
    const n = (prompt(t("profileNew")) || "").trim(); if (!n) return;
    saveIpValues();
    const p = getProfiles(); const data = {}; Object.keys(ipFields).forEach(k => { data[k] = ipFields[k].value.trim(); });
    p[n] = data; setProfiles(p); refreshProfiles(); profSel.value = n; toast(t("profileSaved"), "ok");
  });
  profApply.addEventListener("click", () => { const n = profSel.value; if (!n) return; applyProfile(n); toast(n, "ok"); });
  profDel.addEventListener("click", () => { const n = profSel.value; if (!n) return; if (!confirm(t("profileDel") + " — " + n + "?")) return; const p = getProfiles(); delete p[n]; setProfiles(p); refreshProfiles(); });
  ipProfilesRow.appendChild(profSave); ipProfilesRow.appendChild(profSel); ipProfilesRow.appendChild(profApply); ipProfilesRow.appendChild(profDel);
  ipBar.appendChild(ipProfilesRow);
  refreshProfiles();

  // ── Command basket: collect commands, copy/export them as one shell script ──
  const basketFab = document.createElement("button"); basketFab.className = "basket-fab"; basketFab.id = "basketFab"; basketFab.setAttribute("aria-label", t("basketTitle"));
  const basketPanel = document.createElement("div"); basketPanel.className = "basket-panel"; basketPanel.id = "basketPanel"; basketPanel.setAttribute("role", "dialog"); basketPanel.setAttribute("aria-label", t("basketTitle"));
  document.body.appendChild(basketFab); document.body.appendChild(basketPanel);
  function updateBasketFab() { basketFab.innerHTML = '🧺 <span class="basket-fab-count">' + basket.length + '</span>'; basketFab.classList.toggle("has", basket.length > 0); }
  function saveBasket() { localStorage.setItem("cs-basket", JSON.stringify(basket)); updateBasketFab(); }
  function basketAdd(code) { basket.push(code); saveBasket(); toast(t("basketAdded"), "ok"); if (basketPanel.classList.contains("active")) renderBasketPanel(); }
  function basketScript() { return "#!/usr/bin/env bash\n# Generated by cheat-sheet — " + basket.length + " " + t("commands") + "\nset -e\n\n" + basket.map(applyIpToCode).join("\n") + "\n"; }
  function renderBasketPanel() {
    basketPanel.innerHTML = '<div class="basket-head"><strong>' + t("basketTitle") + '</strong><button class="basket-close" aria-label="Close">✕</button></div>';
    const body = document.createElement("div"); body.className = "basket-body";
    if (!basket.length) { body.innerHTML = '<p class="machine-hosts-empty">' + t("basketNone") + '</p>'; }
    else basket.forEach((code, i) => {
      const row = document.createElement("div"); row.className = "basket-row";
      const pre = document.createElement("code"); pre.className = "basket-cmd"; pre.textContent = code;
      const mk = (txt, title, disabled, fn) => { const b = document.createElement("button"); b.className = "basket-mini"; b.textContent = txt; b.title = title; b.disabled = !!disabled; b.addEventListener("click", fn); return b; };
      const up = mk("↑", "Up", i === 0, () => { const x = basket[i - 1]; basket[i - 1] = basket[i]; basket[i] = x; saveBasket(); renderBasketPanel(); });
      const dn = mk("↓", "Down", i === basket.length - 1, () => { const x = basket[i + 1]; basket[i + 1] = basket[i]; basket[i] = x; saveBasket(); renderBasketPanel(); });
      const rm = mk("✕", t("del"), false, () => { basket.splice(i, 1); saveBasket(); renderBasketPanel(); }); rm.classList.add("basket-rm");
      row.appendChild(pre); row.appendChild(up); row.appendChild(dn); row.appendChild(rm); body.appendChild(row);
    });
    basketPanel.appendChild(body);
    const foot = document.createElement("div"); foot.className = "basket-foot";
    const copyBtn = document.createElement("button"); copyBtn.className = "btn btn-primary btn-sm"; copyBtn.textContent = t("basketCopy");
    copyBtn.addEventListener("click", () => { if (!basket.length) return; const s = basketScript(); copyText(s, () => { recordHistory(s); toast(t("copied"), "ok"); }); });
    const expBtn = document.createElement("button"); expBtn.className = "btn btn-secondary btn-sm"; expBtn.textContent = t("basketExport");
    expBtn.addEventListener("click", () => { if (!basket.length) return; const blob = new Blob([basketScript()], { type: "text/x-shellscript" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "cheat-sheet-script.sh"; a.click(); URL.revokeObjectURL(a.href); });
    const clrBtn = document.createElement("button"); clrBtn.className = "btn btn-secondary btn-sm"; clrBtn.textContent = t("basketClear");
    clrBtn.addEventListener("click", () => { if (!basket.length) return; basket = []; saveBasket(); renderBasketPanel(); });
    foot.appendChild(copyBtn); foot.appendChild(expBtn); foot.appendChild(clrBtn); basketPanel.appendChild(foot);
    basketPanel.querySelector(".basket-close").addEventListener("click", () => basketPanel.classList.remove("active"));
  }
  basketFab.addEventListener("click", () => { const show = !basketPanel.classList.contains("active"); basketPanel.classList.toggle("active", show); if (show) renderBasketPanel(); });
  updateBasketFab();

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
    oscp: `# {TITLE}

## Administrative Information

- **Author / Candidate:**
- **OSID:**
- **Date:**
- **Assessment:** OSCP Exam / Lab
- **In-scope targets:** \`<TARGET_IP>\`

## High-Level Summary

One-paragraph narrative of which hosts were compromised and the overall path to
each foothold and privilege escalation. State the total points claimed.

### Compromised Hosts

| Host | IP | Highest Access | local.txt | proof.txt | Points |
| --- | --- | --- | --- | --- | --- |
| target01 | \`<TARGET_IP>\` | root / SYSTEM | ✓ | ✓ | 20 |

## Methodology

Recon → enumeration → exploitation → post-exploitation, repeated per target. All
exploitation was performed manually except where a single well-known public
exploit was permitted per exam rules.

---

## Target: \`<TARGET_IP>\`

### Service Enumeration

\`\`\`
nmap -p- --min-rate 5000 -oA nmap/all <TARGET_IP>
nmap -sC -sV -p<PORT> -oA nmap/svc <TARGET_IP>
\`\`\`

| Port | Service | Version |
| --- | --- | --- |
|  |  |  |

### Vulnerability

- **Name:**
- **CVE / Reference:**
- **Description:**

### Exploitation — Steps to Reproduce

1.
2.
3.

\`\`\`
# exploit / payload
\`\`\`

### Proof (local.txt)

\`\`\`
whoami && hostname && ip a   # or: ipconfig /all
type C:\\Users\\<USER>\\Desktop\\local.txt   # or: cat /home/<USER>/local.txt
\`\`\`

### Privilege Escalation

- **Vector:**

1.
2.

\`\`\`
# priv-esc steps
\`\`\`

### Proof (proof.txt)

\`\`\`
whoami   # NT AUTHORITY\\SYSTEM or root
type C:\\Users\\Administrator\\Desktop\\proof.txt   # or: cat /root/proof.txt
\`\`\`

## Maintaining Access

Persistence used (only if explicitly in scope).

## House Cleaning

- [ ] Removed uploaded tools / payloads
- [ ] Reverted configuration changes
- [ ] Removed any created accounts / scheduled tasks

## Appendices

### Appendix A — Commands Used

\`\`\`
\`\`\`
`,
    htb: `# {TITLE}

> **Box:**   ·   **OS:**   ·   **Difficulty:**   ·   **IP:** \`<TARGET_IP>\`

## Reconnaissance

\`\`\`
nmap -p- --min-rate 5000 -oA nmap/all <TARGET_IP>
nmap -sC -sV -p<PORT> -oA nmap/svc <TARGET_IP>
\`\`\`

| Port | Service | Notes |
| --- | --- | --- |
|  |  |  |

## Enumeration

Describe each service explored and what was discovered.

## Foothold

- **Vulnerability:**
- **CVE / Reference:**

1.
2.

\`\`\`
\`\`\`

## User Flag

\`\`\`
cat /home/*/user.txt
\`\`\`

## Privilege Escalation

- **Vector:**

1.
2.

\`\`\`
\`\`\`

## Root Flag

\`\`\`
cat /root/root.txt
\`\`\`

## Beyond Root / Lessons Learned

-
`,
    pentest: `# {TITLE}

> **Classification:** CONFIDENTIAL   ·   **Version:** 1.0   ·   **Date:**

## Document Control

| Version | Date | Author | Notes |
| --- | --- | --- | --- |
| 0.1 | | | Draft |
| 1.0 | | | Final |

## Executive Summary

Non-technical overview of the engagement for management: overall risk posture,
the most serious issues, and the key recommendations. Reference the counts below.

| Critical | High | Medium | Low | Informational |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |

## Scope & Rules of Engagement

- **Client:**
- **Assessment type:** External / Internal / Web / Wireless / Cloud
- **In-scope:** \`<NETWORK>/<CIDR>\`, \`<TARGET_URL>\`
- **Out-of-scope:**
- **Testing window:**
- **Methodology:** OWASP WSTG / PTES / NIST SP 800-115
- **Authorization:** Signed authorization on file.

## Findings Summary

| # | Finding | Severity | CVSS | Status |
| --- | --- | --- | --- | --- |
| 1 |  | Critical |  | Open |
| 2 |  | High |  | Open |
| 3 |  | Medium |  | Open |

## Findings

### [Critical] Finding Title

- **Description:**
- **Affected assets:**
- **Impact:**
- **CVSS v3.1:** 9.8 (vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Evidence:**

\`\`\`
\`\`\`

- **Steps to Reproduce:**
  1.
  2.
- **Remediation:**
- **References:**

## Remediation Roadmap

| Priority | Finding | Recommended Fix | Owner | Target Date |
| --- | --- | --- | --- | --- |
| P1 |  |  |  |  |

## Conclusion

Summary of the security posture and the strategic recommendations.

## Appendix A — Methodology & Tooling

## Appendix B — CVSS Vectors
`,
    bugbounty: `# {TITLE}

- **Target:** \`<TARGET_URL>\`
- **Weakness / Type:** (e.g. CWE-89 SQL Injection)
- **Severity:**    **CVSS v3.1:**  (vector: )

## Summary

One-paragraph description of the vulnerability and where it occurs.

## Steps to Reproduce

1.
2.
3.

## Proof of Concept

\`\`\`http
POST /endpoint HTTP/1.1
Host: <TARGET_HOST>
Content-Type: application/json

{"param":"payload"}
\`\`\`

## Impact

What an attacker can achieve by exploiting this, and the business impact.

## Remediation

## References

- OWASP:
- CWE:
`,
    oswe: `# {TITLE}

> **Assessment:** White-Box Source-Code Review & Web Application Security Test
> **Classification:** CONFIDENTIAL   ·   **Version:** 1.0   ·   **Date:**

## Administrative Information

- **Author:**
- **Application:**    **Version / Commit:** \`<GIT_COMMIT>\`
- **Repository:** \`<REPO_URL>\`
- **Languages / Stack:**
- **Environment tested:** \`<TARGET_URL>\`

## Executive Summary

Narrative describing the objective — an authenticated review of the application
source resulting in a proof-of-concept exploit chain from unauthenticated
attacker to remote code execution / full compromise.

### Vulnerability Overview

| # | Vulnerability | Component | Severity | CVSS |
| --- | --- | --- | --- | --- |
| 1 |  |  | Critical |  |

## Methodology

Manual static analysis of the code base guided by data-flow tracing (source →
sink), supported by dynamic verification against a local instance. Focus areas:
authentication, authorization, input validation, deserialization, SQL/ORM usage,
template rendering, file handling, and secrets management.

---

## Vulnerability 1 — Title

- **Type:** (e.g. CWE-89 SQL Injection)
- **Location:** \`path/to/file.ext:LINE\`
- **CVSS v3.1:** 9.8 (vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)

### Vulnerable Code

\`\`\`php
// path/to/file.ext:LINE
$query = "SELECT * FROM users WHERE id = " . $_GET['id'];
\`\`\`

### Data Flow (Source → Sink)

1. **Source:** user-controlled input at \`...\`
2. **Propagation:** value passed through \`...\` without sanitisation
3. **Sink:** reaches \`...\` where it is executed

### Proof of Concept

\`\`\`
# request / payload demonstrating exploitation
\`\`\`

### Impact

### Remediation

- Use parameterised queries / prepared statements.
- Apply strict server-side input validation and output encoding.

## Exploit Chain

Step-by-step description of how the individual issues are combined into a single
unauthenticated → RCE chain, with the automated exploit summarised below.

\`\`\`python
#!/usr/bin/env python3
# Single-command PoC: python3 exploit.py <TARGET_URL>
\`\`\`

## Remediation Summary

| # | Finding | Fix | Priority | Owner |
| --- | --- | --- | --- | --- |
| 1 |  |  | P1 |  |

## Appendix A — Files Reviewed

## Appendix B — References

- OWASP ASVS:
- CWE:
`,
    redteam: `# {TITLE}

> **Engagement type:** Objective-Based Red Team Operation
> **Classification:** CONFIDENTIAL — STRICTLY LIMITED DISTRIBUTION
> **Version:** 1.0   ·   **Date:**

## Administrative Information

- **Client:**
- **Operation window:**
- **Assumed posture:** External / Assumed-Breach / Insider
- **Authorization:** Signed Rules of Engagement & Get-Out-of-Jail letter on file.

## Executive Summary

Narrative for leadership describing whether the agreed objectives were achieved,
the realistic threat scenario emulated, and the strategic security gaps exposed.

### Objectives & Outcomes

| # | Objective | Result | Detected? |
| --- | --- | --- | --- |
| 1 | Obtain Domain Admin | Achieved | No |
| 2 | Access \`<CROWN_JEWEL>\` | Achieved | Partial |
| 3 | Exfiltrate sample data set | Achieved | No |

### Threat Emulation

Emulated adversary / TTP profile (e.g. FIN7, APT29) and rationale.

## Attack Narrative (Kill Chain)

### 1. Reconnaissance

### 2. Initial Access

- **Technique:** T1566 Phishing
- **Result:**

\`\`\`
\`\`\`

### 3. Execution & Persistence

### 4. Privilege Escalation

### 5. Defense Evasion

### 6. Credential Access

### 7. Discovery & Lateral Movement

### 8. Collection & Exfiltration

### 9. Actions on Objective

## MITRE ATT&CK Mapping

| Tactic | Technique ID | Technique | Procedure Used |
| --- | --- | --- | --- |
| Initial Access | T1566.001 | Spearphishing Attachment |  |
| Execution | T1059.001 | PowerShell |  |
| Persistence | T1053.005 | Scheduled Task |  |
| Priv. Escalation | T1068 | Exploitation for Priv. Esc. |  |
| Defense Evasion | T1027 | Obfuscated Files or Information |  |
| Credential Access | T1003.001 | LSASS Memory |  |
| Lateral Movement | T1021.001 | Remote Desktop Protocol |  |
| Exfiltration | T1041 | Exfiltration Over C2 Channel |  |

## Detection & Response Assessment

| # | Attacker Action | Logged? | Alerted? | Blue Team Response | Gap |
| --- | --- | --- | --- | --- | --- |
| 1 |  | Yes/No | Yes/No |  |  |

## Strategic Recommendations

1. **People:**
2. **Process:**
3. **Technology:**

## Appendix A — Indicators of Compromise (IoCs)

| Type | Value | Notes |
| --- | --- | --- |
| Domain |  | C2 |
| Hash |  | Payload |

## Appendix B — ATT&CK Navigator Layer

## Appendix C — Compromised Accounts & Hosts
`,
    vulndisclosure: `# {TITLE}

> **Security Advisory** — Responsible Disclosure
> **Advisory ID:** ADV-<YEAR>-<NNNN>   ·   **Status:** Draft / Disclosed
> **TLP:** AMBER

## Summary

| Field | Value |
| --- | --- |
| Vendor / Product |  |
| Affected versions | \`<= X.Y.Z\` |
| Fixed version |  |
| Vulnerability type | (CWE-XXX) |
| CVE | CVE-<YEAR>-<NNNNN> (requested / assigned) |
| Severity | High |
| CVSS v3.1 | 7.4 (CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N) |
| Reported by |  |

## Description

Clear technical description of the vulnerability, the affected component, and the
conditions required to trigger it.

## Affected Components

- **Component:**
- **Location:** \`path/or/endpoint\`

## Proof of Concept

\`\`\`
\`\`\`

## Impact

What an attacker can achieve, the required privileges, and the realistic risk.

## Remediation

- Upgrade to version \`<FIXED_VERSION>\` or later.
- Interim mitigation:

## Disclosure Timeline

| Date | Event |
| --- | --- |
| <YYYY-MM-DD> | Vulnerability discovered |
| <YYYY-MM-DD> | Vendor notified |
| <YYYY-MM-DD> | Vendor acknowledged |
| <YYYY-MM-DD> | Fix released |
| <YYYY-MM-DD> | Public disclosure |

## Credit

Discovered and reported responsibly by <RESEARCHER>.

## References

- Vendor advisory:
- CVE:
- CWE:
`,
    retest: `# {TITLE}

> **Assessment:** Remediation Verification (Retest)
> **Original report:**    ·   **Original date:**
> **Retest date:**    ·   **Version:** 1.0

## Administrative Information

- **Client:**
- **Original engagement ID:**
- **Retest scope:** Previously reported findings only
- **Authorization:** Signed authorization on file.

## Executive Summary

Overview of the retest outcome: how many previously reported issues are now
resolved, how many remain, and the resulting change in overall risk posture.

### Remediation Status Overview

| Status | Count |
| --- | --- |
| ✅ Resolved |  |
| 🟡 Partially Remediated |  |
| ❌ Not Remediated |  |
| ⚪ Risk Accepted |  |

## Retest Results

| # | Original Finding | Severity | Original Status | Retest Status |
| --- | --- | --- | --- | --- |
| 1 |  | High | Open | ✅ Resolved |
| 2 |  | Medium | Open | ❌ Not Remediated |

## Detailed Verification

### Finding 1 — Title

- **Original severity:**
- **Retest status:** ✅ Resolved / 🟡 Partial / ❌ Not Remediated
- **Remediation implemented:**
- **Verification method:**

\`\`\`
# verification test / evidence
\`\`\`

- **Residual risk:**

## Outstanding Risk

Summary of the findings that remain open and the recommended next steps.

## Conclusion

## Appendix A — Verification Evidence
`
  };

  // Individual sections that can be appended at the cursor (static, offline).
const WRITEUP_SECTIONS = {
    finding: `
### [Severity] Finding Title

- **Description:**
- **Affected assets:**
- **Impact:**
- **CVSS v3.1:**  (vector: )
- **Evidence:**

\`\`\`
\`\`\`

- **Steps to Reproduce:**
  1.
  2.
- **Remediation:**
- **References:**
`,
    findingsTable: `
| # | Finding | Severity | CVSS | Status |
| --- | --- | --- | --- | --- |
| 1 |  | High |  | Open |
`,
    target: `
## Target: \`<TARGET_IP>\`

### Service Enumeration

\`\`\`
nmap -sC -sV -p<PORT> <TARGET_IP>
\`\`\`

| Port | Service | Version |
| --- | --- | --- |
|  |  |  |
`,
    execSummary: `
## Executive Summary

Non-technical overview of the engagement, overall risk, and key takeaways.
`,
    cvss: `
### CVSS v3.1 Qualitative Severity Scale

| Rating | CVSS Score |
| --- | --- |
| None | 0.0 |
| Low | 0.1 – 3.9 |
| Medium | 4.0 – 6.9 |
| High | 7.0 – 8.9 |
| Critical | 9.0 – 10.0 |
`,
    attackChain: `
## Attack Narrative (Kill Chain)

### 1. Initial Access

- **Technique:**
- **Result:**

\`\`\`
\`\`\`

### 2. Execution & Persistence

### 3. Privilege Escalation

### 4. Credential Access

### 5. Lateral Movement

### 6. Actions on Objective
`,
    mitreAttack: `
## MITRE ATT&CK Mapping

| Tactic | Technique ID | Technique | Procedure Used |
| --- | --- | --- | --- |
| Initial Access | T1566.001 | Spearphishing Attachment |  |
| Execution | T1059.001 | PowerShell |  |
| Persistence | T1053.005 | Scheduled Task |  |
| Privilege Escalation | T1068 | Exploitation for Privilege Escalation |  |
| Defense Evasion | T1027 | Obfuscated Files or Information |  |
| Credential Access | T1003.001 | LSASS Memory |  |
| Lateral Movement | T1021.001 | Remote Desktop Protocol |  |
| Exfiltration | T1041 | Exfiltration Over C2 Channel |  |
`,
    remediationMatrix: `
## Remediation Matrix

| # | Finding | Recommended Fix | Priority | Owner | Target Date |
| --- | --- | --- | --- | --- | --- |
| 1 |  |  | P1 |  |  |
| 2 |  |  | P2 |  |  |
`,
    toolsUsed: `
## Tools Used

| Tool | Version | Purpose |
| --- | --- | --- |
| Nmap |  | Port & service discovery |
| Burp Suite |  | Web application testing |
| BloodHound |  | AD attack-path analysis |
| Metasploit |  | Exploitation framework |
| CrackMapExec |  | Network / credential validation |
`,
    timeline: `
## Engagement Timeline

| Date | Time (UTC) | Activity | Notes |
| --- | --- | --- | --- |
| <YYYY-MM-DD> |  | Kick-off / scoping confirmed |  |
| <YYYY-MM-DD> |  | Testing commenced |  |
| <YYYY-MM-DD> |  | Critical finding reported |  |
| <YYYY-MM-DD> |  | Testing concluded |  |
| <YYYY-MM-DD> |  | Report delivered |  |
`,
    scope: `
## Scope & Rules of Engagement

| Item | Detail |
| --- | --- |
| Client |  |
| Assessment type | External / Internal / Web / Cloud |
| In-scope targets | \`<NETWORK>/<CIDR>\`, \`<TARGET_URL>\` |
| Out-of-scope |  |
| Testing window |  |
| Permitted techniques |  |
| Prohibited techniques | Denial of Service, social engineering |
| Emergency contact |  |
| Authorization | Signed authorization on file |
`,
    evidence: `
### Evidence

**Command:**

\`\`\`
\`\`\`

**Output:**

\`\`\`
\`\`\`

![Screenshot caption](/uploads/)
`,
    references: `
## References

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **OWASP WSTG:** https://owasp.org/www-project-web-security-testing-guide/
- **MITRE ATT&CK:** https://attack.mitre.org/
- **CWE:** https://cwe.mitre.org/
- **NVD / CVE:** https://nvd.nist.gov/
- **CVSS Calculator:** https://www.first.org/cvss/calculator/3.1
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
    h = h.replace(/```([^\n`]*)\n?([\s\S]*?)```/g, (m, info, code) => { blocks.push({ lang: info.trim(), code: code.replace(/^\n/, "") }); return "ZZCODEBLOCKZZ" + (blocks.length - 1) + "ZZ"; });
    h = h.replace(/^(#{1,6})\s+(.*)$/gm, (m, hh, txt) => { const lvl = Math.min(hh.length + 1, 6); return "<h" + lvl + " class=\"wu-heading\">" + txt + "</h" + lvl + ">"; });
    h = h.replace(/^\s*(?:---|\*\*\*)\s*$/gm, "<hr class=\"wu-hr\">");
    h = h.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) => "<div class=\"wu-img-container\"><img src=\"" + mdSafeUrl(url) + "\" alt=\"" + alt + "\" class=\"wu-read-img\"><span class=\"wu-img-caption\">" + alt + "</span></div>");
    h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, url) => "<a href=\"" + mdSafeUrl(url) + "\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"wu-link\">" + txt + "</a>");
    h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    h = h.replace(/~~([^~\n]+)~~/g, "<del>$1</del>");
    h = h.replace(/`([^`]+)`/g, "<code class=\"wu-inline-code\">$1</code>");
    // Autolink bare http(s) URLs. Runs after the markdown-link/image and inline-code
    // passes: the leading boundary class never matches right after href=" (that spot is
    // preceded by a quote), so existing anchors aren't re-linked; the URL char class
    // stops before "/</>/quotes so it can't break out of an attribute. mdSafeUrl
    // re-validates the scheme and the URL text is already escaped.
    h = h.replace(/(^|[\s(>])(https?:\/\/[^\s<>"')]+)/g, (m, pre, url) => pre + "<a href=\"" + mdSafeUrl(url) + "\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"wu-link\">" + url + "</a>");
    // Blockquotes ("> " is escaped to "&gt; ").
    h = h.replace(/(?:^|\n)((?:&gt; ?.*(?:\n|$))+)/g, (m, block) => "\n<blockquote class=\"wu-quote\">" + block.trim().split(/\n/).map(l => l.replace(/^&gt; ?/, "")).join("<br>") + "</blockquote>");
    // Nested ordered / unordered / task lists (2 spaces or 1 tab per indent level).
    // All item text is already HTML-escaped, so emitting nesting tags around it is safe.
    h = h.replace(/(?:^|\n)((?:[ \t]*(?:[-*]|\d+\.)[ \t].*(?:\n|$))+)/g, (m, block) => {
      const lines = block.replace(/\n+$/, "").split("\n");
      const out = [];
      const stack = []; // one entry per open list level: { type: 'ul' | 'ol' }
      const close = to => { while (stack.length > to) out.push("</li></" + stack.pop().type + ">"); };
      lines.forEach(line => {
        const mm = line.match(/^([ \t]*)([-*]|\d+\.)[ \t]+(.*)$/); if (!mm) return;
        const indent = (mm[1].replace(/\t/g, "  ").length / 2) | 0;
        const type = /\d+\./.test(mm[2]) ? "ol" : "ul";
        const text = mm[3];
        const task = text.match(/^\[([ xX])\][ \t]?(.*)$/);
        const li = task
          ? "<li class=\"wu-task\"><input type=\"checkbox\" disabled" + (/[xX]/.test(task[1]) ? " checked" : "") + "> " + task[2]
          : "<li>" + text;
        if (indent + 1 > stack.length) { stack.push({ type }); out.push("<" + type + " class=\"wu-list\">" + li); }
        else { close(indent + 1); out.push("</li>" + li); }
      });
      close(0);
      return "\n" + out.join("");
    });
    // Markdown tables: header row, a | --- | separator, then body rows.
    h = h.replace(/^(\|.+\|)[ \t]*\n\|[ :|\-]+\|[ \t]*\n((?:\|.*\|[ \t]*(?:\n|$))*)/gm, (m, header, body) => {
      const cells = r => r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());
      const th = cells(header).map(c => "<th>" + c + "</th>").join("");
      const rows = body.replace(/\n+$/, "").split("\n").filter(l => l.trim()).map(r => "<tr>" + cells(r).map(c => "<td>" + c + "</td>").join("") + "</tr>").join("");
      return "<table class=\"wu-table\"><thead><tr>" + th + "</tr></thead><tbody>" + rows + "</tbody></table>\n";
    });
    h = h.replace(/\n/g, "<br>");
    h = h.replace(/<br>\s*(<(?:h[1-6]|pre|ul|ol|hr|div|table|blockquote)[^>]*>)/g, "$1").replace(/(<\/(?:h[1-6]|pre|ul|ol|div|table|blockquote)>)\s*<br>/g, "$1").replace(/(<hr[^>]*>)\s*<br>/g, "$1");
    h = h.replace(/ZZCODEBLOCKZZ(\d+)ZZ/g, (m, i) => {
      const b = blocks[+i];
      // b.code is already escaped (from the top-of-function escapeHtml); b.lang is
      // user-controlled, so it MUST pass through escapeHtml to stay XSS-safe.
      const lang = b.lang ? "<span class=\"wu-code-lang\">" + escapeHtml(b.lang) + "</span>" : "";
      return "<div class=\"wu-code-wrap\"><div class=\"wu-code-head\">" + lang +
        "<button type=\"button\" class=\"wu-code-copy\" title=\"" + t("copy") + "\">⧉ " + t("copy") + "</button></div>" +
        "<pre class=\"wu-code-block\">" + b.code + "</pre></div>";
    });
    return h;
  }
  // Wire the copy buttons rendered into markdown code blocks (read mode / preview).
  function wireCodeCopies(container) {
    container.querySelectorAll(".wu-code-copy").forEach(btn => {
      btn.addEventListener("click", () => {
        const wrap = btn.closest(".wu-code-wrap"); const pre = wrap && wrap.querySelector("pre");
        if (!pre) return;
        copyText(pre.textContent, () => {
          btn.textContent = "✓ " + t("copied");
          announce(t("copied"));
          setTimeout(() => { btn.textContent = "⧉ " + t("copy"); }, 1500);
        });
      });
    });
  }
  function insertAtCursor(ta, text) {
    const s = ta.selectionStart != null ? ta.selectionStart : ta.value.length;
    const e = ta.selectionEnd != null ? ta.selectionEnd : ta.value.length;
    ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
    ta.selectionStart = ta.selectionEnd = s + text.length;
    ta.focus();
  }
  // Wrap the selection (or a placeholder) with markdown markers.
  function wuWrap(ta, pre, post, placeholder) {
    const s = ta.selectionStart, e = ta.selectionEnd, val = ta.value;
    const sel = val.slice(s, e) || (placeholder || "text");
    ta.value = val.slice(0, s) + pre + sel + post + val.slice(e);
    ta.selectionStart = s + pre.length; ta.selectionEnd = s + pre.length + sel.length; ta.focus();
  }
  // Prepend a prefix to the start of the current line (headings, lists, quotes).
  function wuLinePrefix(ta, prefix) {
    const s = ta.selectionStart, val = ta.value;
    const ls = val.lastIndexOf("\n", s - 1) + 1;
    ta.value = val.slice(0, ls) + prefix + val.slice(ls);
    ta.selectionStart = ta.selectionEnd = s + prefix.length; ta.focus();
  }
  function wuWordCount(s) { return (String(s || "").trim().match(/\S+/g) || []).length; }
  function wuReadMins(s) { return Math.max(1, Math.round(wuWordCount(s) / 200)); }
  // Substitute a linked machine's real values into a report's target placeholders
  // (<TARGET_IP>/<RHOST>/<TARGET_URL>) and fill the still-blank Box/OS/Difficulty
  // header labels used by the HTB/CTF template. Non-destructive to other placeholders.
  function fillMachinePlaceholders(content, m) {
    let c = content;
    if (m.ip) {
      c = c.split("<TARGET_IP>").join(m.ip).split("<RHOST>").join(m.ip).split("<TARGET_URL>").join("http://" + m.ip);
    }
    const fill = (label, val) => { if (val) c = c.replace(new RegExp("(\\*\\*" + label + ":\\*\\*)(?=\\s+(?:\\u00b7|\\n|$))", "g"), "$1 " + val); };
    fill("Box", m.name); fill("OS", m.os); fill("Difficulty", diffLabel(m.difficulty));
    return c;
  }
  function wuIsPinned(id) { return wuPins.includes(id); }
  function toggleWuPin(id, e) {
    if (e) e.stopPropagation();
    wuPins = wuIsPinned(id) ? wuPins.filter(x => x !== id) : wuPins.concat(id);
    localStorage.setItem("cs-wu-pins", JSON.stringify(wuPins));
    render();
  }
  function allWuTags() {
    const s = new Set(); writeups.forEach(w => (w.tags || []).forEach(tg => s.add(tg)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }
  // Search + tag filter, then sort, with pinned write-ups always floated to the top.
  function visibleWriteups() {
    const q = wuQuery.trim().toLowerCase();
    let list = writeups.filter(w => {
      if (wuTagFilter !== "all" && !(w.tags || []).includes(wuTagFilter)) return false;
      if (!q) return true;
      return (w.title || "").toLowerCase().includes(q)
        || (w.content || "").toLowerCase().includes(q)
        || (w.tags || []).some(tg => tg.toLowerCase().includes(q));
    });
    const cmp = {
      title: (a, b) => (a.title || "").localeCompare(b.title || ""),
      words: (a, b) => wuWordCount(b.content) - wuWordCount(a.content),
      recent: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    }[wuSort] || null;
    if (cmp) list.sort(cmp);
    list.sort((a, b) => (wuIsPinned(b.id) ? 1 : 0) - (wuIsPinned(a.id) ? 1 : 0)); // stable pin float
    return list;
  }
  async function createWriteup() {
    openModal(t("wuNewTitle"), [
      { key: "title", label: t("wuTitleLabel"), placeholder: "e.g., HackTheBox — Lame" },
      { key: "tags", label: t("wuTags"), placeholder: t("tagComma") },
      { key: "template", label: t("wuTemplate"), type: "select", value: "", options: [
        { value: "", label: t("wuStartBlank") },
        { value: "oscp", label: "OSCP exam report" },
        { value: "htb", label: "HTB / CTF write-up" },
        { value: "pentest", label: "Pentest report" },
        { value: "bugbounty", label: "Bug bounty report" },
        { value: "oswe", label: "OSWE / whitebox report" },
        { value: "redteam", label: "Red team operation" },
        { value: "vulndisclosure", label: "Vulnerability disclosure" },
        { value: "retest", label: "Remediation retest" }
      ] }
    ], {}, async fd => {
      const tags = fd.tags.split(",").map(s => s.trim()).filter(Boolean);
      const content = fd.template && WRITEUP_TEMPLATES[fd.template]
        ? WRITEUP_TEMPLATES[fd.template].replace(/\{TITLE\}/g, fd.title || "Write-up") : "";
      const wu = await api("POST", "/api/writeups", { title: fd.title, tags, content });
      if (!wu || !wu.id) return;
      await loadWriteups();
      openWriteupId = wu.id; wuEditMode = true;
      render();
    });
  }
  async function deleteWriteup(id, e) {
    if (e) e.stopPropagation();
    if (!confirm(t("confirmDelWriteup"))) return;
    await api("DELETE", "/api/writeups/" + id);
    if (openWriteupId === id) openWriteupId = null;
    await loadWriteups(); render();
  }
  // Debounced write-up save. Patches for the same write-up are MERGED (not
  // replaced) so a rapid title→content or relatedMachine→content sequence never
  // drops the earlier field. Switching to a different write-up flushes first.
  let wuTimer = null, wuPending = {}, wuPendingId = null;
  function flushWu() {
    if (!wuPendingId) return;
    const id = wuPendingId, data = wuPending;
    wuPendingId = null; wuPending = {}; clearTimeout(wuTimer); wuTimer = null;
    api("PUT", "/api/writeups/" + id, data);
  }
  function saveWu(id, data) {
    if (wuPendingId && wuPendingId !== id) flushWu();
    wuPendingId = id; Object.assign(wuPending, data);
    clearTimeout(wuTimer);
    wuTimer = setTimeout(flushWu, 400);
  }

  function renderWriteupsPage() {
    currentSection.textContent = t("writeups"); hero.style.display = "none";
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
    hdr.innerHTML = '<div class="wu-header-top"><h2>📝 ' + t("writeups") + '</h2><button class="btn btn-primary" id="newWuBtn">' + t("newWriteup") + '</button></div>' +
      '<p>' + t("writeupsDesc") + '</p>';
    contentArea.appendChild(hdr);
    hdr.querySelector("#newWuBtn").addEventListener("click", createWriteup);

    if (writeups.length === 0) {
      const empty = document.createElement("div"); empty.className = "no-results";
      empty.innerHTML = '<h3>' + t("wuEmptyTitle") + '</h3><p>' + t("wuEmptyBody") + '</p>';
      contentArea.appendChild(empty);
      return;
    }

    // ── Controls: search + sort + tag chips + stats ──
    const controls = document.createElement("div"); controls.className = "wu-list-controls";
    const search = document.createElement("input");
    search.type = "search"; search.className = "wu-list-search"; search.value = wuQuery;
    search.placeholder = t("wuSearch"); search.setAttribute("aria-label", t("wuSearch"));
    const sortSel = document.createElement("select"); sortSel.className = "form-select wu-tool-select"; sortSel.setAttribute("aria-label", t("wuSort"));
    sortSel.innerHTML =
      '<option value="recent">' + t("wuSortRecent") + '</option>' +
      '<option value="title">' + t("wuSortTitle") + '</option>' +
      '<option value="words">' + t("wuSortWords") + '</option>';
    sortSel.value = wuSort;
    let wuST; search.addEventListener("input", () => {
      clearTimeout(wuST);
      wuST = setTimeout(() => {
        wuQuery = search.value; renderWriteupsPage();
        const s = contentArea.querySelector(".wu-list-search"); if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
      }, 180);
    });
    sortSel.addEventListener("change", () => { wuSort = sortSel.value; localStorage.setItem("cs-wu-sort", wuSort); renderWriteupsPage(); });
    controls.appendChild(search); controls.appendChild(sortSel);
    contentArea.appendChild(controls);

    const chips = document.createElement("div"); chips.className = "wu-tag-chips";
    const mkChip = (val, label) => {
      const c = document.createElement("button"); c.type = "button";
      c.className = "wu-chip" + (wuTagFilter === val ? " active" : "");
      c.textContent = label; c.setAttribute("aria-pressed", String(wuTagFilter === val));
      c.addEventListener("click", () => { wuTagFilter = val; renderWriteupsPage(); });
      return c;
    };
    chips.appendChild(mkChip("all", t("wuAllTags")));
    allWuTags().forEach(tg => chips.appendChild(mkChip(tg, tg)));
    contentArea.appendChild(chips);

    const list = visibleWriteups();
    const totalWords = writeups.reduce((n, w) => n + wuWordCount(w.content), 0);
    const stats = document.createElement("div"); stats.className = "wu-stats-line";
    stats.textContent = writeups.length + " " + t("wuCount") + " · " + totalWords.toLocaleString() + " " + t("wuTotalWords") +
      (list.length !== writeups.length ? " · " + list.length + " " + t("matching") : "");
    contentArea.appendChild(stats);

    if (list.length === 0) {
      const nr = document.createElement("div"); nr.className = "no-results";
      nr.innerHTML = "<h3>" + t("noResults") + "</h3><p>" + t("wuNoMatch") + "</p>";
      contentArea.appendChild(nr);
      return;
    }

    const grid = document.createElement("div"); grid.className = "wu-file-grid";
    list.forEach(wu => {
      const pinned = wuIsPinned(wu.id);
      const file = document.createElement("div"); file.className = "wu-file-card" + (pinned ? " pinned" : "");
      file.setAttribute("role", "button"); file.setAttribute("tabindex", "0");
      file.setAttribute("aria-label", wu.title);
      const tagsH = (wu.tags || []).map(tg => '<span class="wu-tag">' + escapeHtml(tg) + '</span>').join("");
      const date = new Date(wu.updatedAt).toLocaleDateString();
      const preview = (wu.content || "").substring(0, 120).replace(/\n/g, " ");
      file.innerHTML =
        '<div class="wu-file-icon">📄</div>' +
        '<div class="wu-file-info">' +
          '<div class="wu-file-name">' + escapeHtml(wu.title) + '</div>' +
          '<div class="wu-file-preview">' + escapeHtml(preview) + (preview.length >= 120 ? "..." : "") + '</div>' +
          '<div class="wu-file-meta"><span class="wu-date">' + date + '</span><span class="wu-readtime">' + wuReadMins(wu.content) + ' ' + t("wuMin") + '</span>' + tagsH + '</div>' +
        '</div>' +
        '<div class="wu-file-actions">' +
          '<button class="wu-file-pin' + (pinned ? " active" : "") + '" title="' + (pinned ? t("wuUnpin") : t("wuPin")) + '" aria-label="' + (pinned ? t("wuUnpin") : t("wuPin")) + '">' + (pinned ? "📌" : "📍") + '</button>' +
          '<button class="wu-file-delete" title="' + t("del") + '" aria-label="' + t("del") + '">🗑</button>' +
        '</div>';
      file.addEventListener("click", e => { if (e.target.closest(".wu-file-actions")) return; openWriteupId = wu.id; render(); });
      file.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target === file) { e.preventDefault(); openWriteupId = wu.id; render(); } });
      file.querySelector(".wu-file-pin").addEventListener("click", e => toggleWuPin(wu.id, e));
      file.querySelector(".wu-file-delete").addEventListener("click", e => deleteWriteup(wu.id, e));
      grid.appendChild(file);
    });
    contentArea.appendChild(grid);
  }

  let wuEditMode = false;

  // ── CVSS 3.1 base-score calculator (offline, no deps) ──
  const CVSS_METRICS = [
    { k: "AV", label: "Attack Vector", opts: [["N", "Network"], ["A", "Adjacent"], ["L", "Local"], ["P", "Physical"]] },
    { k: "AC", label: "Attack Complexity", opts: [["L", "Low"], ["H", "High"]] },
    { k: "PR", label: "Privileges Required", opts: [["N", "None"], ["L", "Low"], ["H", "High"]] },
    { k: "UI", label: "User Interaction", opts: [["N", "None"], ["R", "Required"]] },
    { k: "S", label: "Scope", opts: [["U", "Unchanged"], ["C", "Changed"]] },
    { k: "C", label: "Confidentiality", opts: [["H", "High"], ["L", "Low"], ["N", "None"]] },
    { k: "I", label: "Integrity", opts: [["H", "High"], ["L", "Low"], ["N", "None"]] },
    { k: "A", label: "Availability", opts: [["H", "High"], ["L", "Low"], ["N", "None"]] }
  ];
  function cvssRoundup(x) { const i = Math.round(x * 100000); return (i % 10000 === 0) ? i / 100000 : (Math.floor(i / 10000) + 1) / 10; }
  function cvssSeverity(s) { return s === 0 ? "None" : s < 4 ? "Low" : s < 7 ? "Medium" : s < 9 ? "High" : "Critical"; }
  function cvssCompute(v) {
    const AV = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 }[v.AV], AC = { L: 0.77, H: 0.44 }[v.AC], UI = { N: 0.85, R: 0.62 }[v.UI];
    const PR = (v.S === "C" ? { N: 0.85, L: 0.68, H: 0.5 } : { N: 0.85, L: 0.62, H: 0.27 })[v.PR];
    const cia = { H: 0.56, L: 0.22, N: 0 };
    const iss = 1 - (1 - cia[v.C]) * (1 - cia[v.I]) * (1 - cia[v.A]);
    const impact = v.S === "C" ? 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15) : 6.42 * iss;
    const expl = 8.22 * AV * AC * PR * UI;
    if (impact <= 0) return 0;
    return v.S === "C" ? cvssRoundup(Math.min(1.08 * (impact + expl), 10)) : cvssRoundup(Math.min(impact + expl, 10));
  }
  function cvssVector(v) { return "CVSS:3.1/AV:" + v.AV + "/AC:" + v.AC + "/PR:" + v.PR + "/UI:" + v.UI + "/S:" + v.S + "/C:" + v.C + "/I:" + v.I + "/A:" + v.A; }
  function openCvssCalc(onInsert) {
    const v = { AV: "N", AC: "L", PR: "N", UI: "N", S: "U", C: "H", I: "H", A: "H" };
    const ov = document.createElement("div"); ov.className = "cvss-overlay";
    const panel = document.createElement("div"); panel.className = "cvss-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-label", t("cvssTitle"));
    panel.innerHTML = '<div class="cvss-head"><h3>' + t("cvssTitle") + '</h3><button class="cvss-close" aria-label="Close">✕</button></div>';
    const grid = document.createElement("div"); grid.className = "cvss-grid";
    CVSS_METRICS.forEach(mt => {
      const g = document.createElement("div"); g.className = "cvss-metric";
      const lab = document.createElement("label"); lab.textContent = mt.label + " (" + mt.k + ")";
      const seg = document.createElement("div"); seg.className = "cvss-seg";
      mt.opts.forEach(([code, name]) => {
        const b = document.createElement("button"); b.type = "button"; b.className = "cvss-opt" + (v[mt.k] === code ? " on" : ""); b.textContent = name;
        b.addEventListener("click", () => { v[mt.k] = code; seg.querySelectorAll(".cvss-opt").forEach(x => x.classList.remove("on")); b.classList.add("on"); update(); });
        seg.appendChild(b);
      });
      g.appendChild(lab); g.appendChild(seg); grid.appendChild(g);
    });
    panel.appendChild(grid);
    const result = document.createElement("div"); result.className = "cvss-result"; panel.appendChild(result);
    const foot = document.createElement("div"); foot.className = "cvss-foot";
    const insertBtn = document.createElement("button"); insertBtn.className = "btn btn-primary"; insertBtn.textContent = t("cvssInsert");
    foot.appendChild(insertBtn); panel.appendChild(foot);
    function update() {
      const s = cvssCompute(v), sev = cvssSeverity(s);
      result.innerHTML = '<div class="cvss-score sev-' + sev.toLowerCase() + '"><span class="cvss-num">' + s.toFixed(1) + '</span><span class="cvss-sev">' + sev + '</span></div><code class="cvss-vector">' + cvssVector(v) + '</code>';
    }
    const close = () => { ov.remove(); document.removeEventListener("keydown", onKey); };
    const onKey = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    panel.querySelector(".cvss-close").addEventListener("click", close);
    ov.addEventListener("click", e => { if (e.target === ov) close(); });
    insertBtn.addEventListener("click", () => { const s = cvssCompute(v); onInsert(cvssVector(v), s.toFixed(1), cvssSeverity(s)); close(); });
    update();
    ov.appendChild(panel); document.body.appendChild(ov);
  }

  function renderWriteupEditor(wu) {
    const page = document.createElement("div"); page.className = "wu-editor-page";

    // Top bar
    const topbar = document.createElement("div"); topbar.className = "wu-editor-topbar";
    const pinned0 = wuIsPinned(wu.id);
    topbar.innerHTML =
      '<button class="wu-back-btn">\u2190 ' + t("back") + '</button>' +
      '<div class="wu-editor-status" id="wuStatus"></div>' +
      '<div class="wu-topbar-actions">' +
        '<button class="wu-pin-btn' + (pinned0 ? " active" : "") + '" title="' + (pinned0 ? t("wuUnpin") : t("wuPin")) + '" aria-label="' + (pinned0 ? t("wuUnpin") : t("wuPin")) + '">\uD83D\uDCCC</button>' +
        '<button class="btn btn-secondary btn-sm wu-export-md-btn">' + t("exportMd") + '</button>' +
        '<button class="btn btn-secondary btn-sm wu-export-html-btn">' + t("wuExportHtml") + '</button>' +
        '<button class="btn btn-secondary btn-sm wu-export-pdf-btn">' + t("exportPdf") + '</button>' +
        '<button class="btn btn-secondary btn-sm wu-copy-rendered-btn">' + t("wuCopyRendered") + '</button>' +
        (wuEditMode
          ? '<button class="btn btn-primary btn-sm wu-save-btn">\uD83D\uDCBE ' + t("save") + '</button>'
          : '<button class="btn btn-secondary btn-sm wu-edit-btn">\u270E ' + t("edit") + '</button>'
        ) +
        '<button class="wu-delete-btn" title="' + t("del") + '" aria-label="' + t("del") + '">\uD83D\uDDD1</button>' +
      '</div>';
    topbar.querySelector(".wu-back-btn").addEventListener("click", () => { openWriteupId = null; wuEditMode = false; render(); });
    topbar.querySelector(".wu-delete-btn").addEventListener("click", () => deleteWriteup(wu.id));
    topbar.querySelector(".wu-pin-btn").addEventListener("click", () => toggleWuPin(wu.id));
    topbar.querySelector(".wu-export-md-btn").addEventListener("click", () => exportWriteupMd(wu));
    topbar.querySelector(".wu-export-html-btn").addEventListener("click", () => exportWriteupHtml(wu));
    topbar.querySelector(".wu-export-pdf-btn").addEventListener("click", () => exportWriteupPdf(wu));
    topbar.querySelector(".wu-copy-rendered-btn").addEventListener("click", () => {
      const tmp = document.createElement("div"); tmp.innerHTML = renderMarkdown(wu.content || "");
      copyText(tmp.textContent || "", () => { announce(t("copied")); toast(t("copied"), "ok"); });
    });
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
      titleInput.value = wu.title; titleInput.placeholder = t("wuTitlePh"); titleInput.setAttribute("aria-label", t("wuTitleLabel"));
      titleInput.addEventListener("input", () => { saveWu(wu.id, { title: titleInput.value }); showStatus(); });
      page.appendChild(titleInput);

      const tagsRow = document.createElement("div"); tagsRow.className = "wu-page-tags";
      const tagsH = (wu.tags || []).map(tg => '<span class="wu-tag">' + escapeHtml(tg) + '</span>').join("");
      tagsRow.innerHTML = tagsH + '<button class="wu-edit-tags-btn">✎ ' + t("wuTags").toLowerCase() + '</button>';
      tagsRow.querySelector(".wu-edit-tags-btn").addEventListener("click", () => {
        openModal(t("wuEditTags"), [{ key: "tags", label: t("wuTags"), placeholder: "HTB, OSCP, Linux" }],
          { tags: (wu.tags || []).join(", ") },
          async fd => { const tags = fd.tags.split(",").map(s => s.trim()).filter(Boolean); await api("PUT", "/api/writeups/" + wu.id, { tags }); await loadWriteups(); render(); });
      });
      page.appendChild(tagsRow);

      // Toolbar: template + machine link + image
      const toolbar = document.createElement("div"); toolbar.className = "wu-toolbar";
      const tplSel = document.createElement("select"); tplSel.className = "form-select wu-tool-select"; tplSel.setAttribute("aria-label", t("wuTemplate"));
      tplSel.innerHTML = '<option value="">📄 ' + t("wuTemplate") + '…</option>' +
        '<option value="oscp">OSCP exam report</option>' +
        '<option value="htb">HTB / CTF write-up</option>' +
        '<option value="pentest">Pentest report</option>' +
        '<option value="bugbounty">Bug bounty report</option>' +
        '<option value="oswe">OSWE / whitebox report</option>' +
        '<option value="redteam">Red team operation</option>' +
        '<option value="vulndisclosure">Vulnerability disclosure</option>' +
        '<option value="retest">Remediation retest</option>';
      const secSel = document.createElement("select"); secSel.className = "form-select wu-tool-select"; secSel.setAttribute("aria-label", t("wuSection"));
      secSel.innerHTML = '<option value="">➕ ' + t("wuSection") + '…</option>' +
        '<option value="finding">Finding</option>' +
        '<option value="findingsTable">Findings table</option>' +
        '<option value="target">Target</option>' +
        '<option value="execSummary">Executive summary</option>' +
        '<option value="cvss">CVSS scale</option>' +
        '<option value="attackChain">Attack narrative</option>' +
        '<option value="mitreAttack">MITRE ATT&amp;CK map</option>' +
        '<option value="remediationMatrix">Remediation matrix</option>' +
        '<option value="toolsUsed">Tools used</option>' +
        '<option value="timeline">Timeline</option>' +
        '<option value="scope">Scope / RoE</option>' +
        '<option value="evidence">Evidence block</option>' +
        '<option value="references">References</option>';
      // Single machine control: links the write-up to a target AND fills its
      // <TARGET_IP>/<TARGET_URL> placeholders + Box/OS/Difficulty header from the machine.
      const mcSel = document.createElement("select"); mcSel.className = "form-select wu-tool-select"; mcSel.setAttribute("aria-label", t("wuMachine"));
      mcSel.innerHTML = '<option value="">🔗 ' + t("wuMachine") + '…</option>' + machines.map(mm => '<option value="' + mm.id + '"' + (wu.relatedMachine === mm.id ? " selected" : "") + '>' + escapeHtml(mm.name) + (mm.ip ? " (" + escapeHtml(mm.ip) + ")" : "") + '</option>').join("");
      const imgBtn = document.createElement("button"); imgBtn.className = "btn btn-secondary btn-sm"; imgBtn.textContent = "📷 " + t("imageBtn");
      const imgInput = document.createElement("input"); imgInput.type = "file"; imgInput.accept = "image/*"; imgInput.style.display = "none";
      toolbar.appendChild(tplSel); toolbar.appendChild(secSel); toolbar.appendChild(mcSel); toolbar.appendChild(imgBtn); toolbar.appendChild(imgInput);
      page.appendChild(toolbar);

      // Split: editor | live preview
      const split = document.createElement("div"); split.className = "wu-split";
      const editor = document.createElement("textarea"); editor.className = "wu-page-editor"; editor.setAttribute("aria-label", "Markdown content");
      editor.value = wu.content || "";
      editor.placeholder = lang === "tr" ? "Markdown yazin — sagda canli onizleme..." : "Write Markdown — live preview on the right...";
      const preview = document.createElement("div"); preview.className = "wu-preview wu-read-body";
      function syncPreview() { preview.innerHTML = renderMarkdown(editor.value); wireCodeCopies(preview); }
      function updateWc() { const el = page.querySelector(".wu-wordcount"); if (el) el.textContent = wuWordCount(editor.value) + " " + t("wuWords") + " · " + wuReadMins(editor.value) + " " + t("wuMin"); }
      function commit() { saveWu(wu.id, { content: editor.value }); showStatus(); syncPreview(); updateWc(); }

      // Formatting toolbar — inserts markdown at the cursor / around the selection.
      const fmt = document.createElement("div"); fmt.className = "wu-format-toolbar";
      [
        ["B", "Bold", () => wuWrap(editor, "**", "**", "bold")],
        ["I", "Italic", () => wuWrap(editor, "*", "*", "italic")],
        ["</>", "Code", () => wuWrap(editor, "`", "`", "code")],
        ["H", "Heading", () => wuLinePrefix(editor, "## ")],
        ["🔗", "Link", () => wuWrap(editor, "[", "](https://)", "text")],
        ["•", "Bullet list", () => wuLinePrefix(editor, "- ")],
        ["1.", "Numbered list", () => wuLinePrefix(editor, "1. ")],
        ["☑", "Task", () => wuLinePrefix(editor, "- [ ] ")],
        ["❝", "Quote", () => wuLinePrefix(editor, "> ")],
        ["▦", "Table", () => insertAtCursor(editor, "\n| Col | Col |\n| --- | --- |\n|  |  |\n")]
      ].forEach(([label, title, fn]) => {
        const b = document.createElement("button"); b.className = "wu-fmt-btn"; b.type = "button"; b.textContent = label; b.title = title; b.setAttribute("aria-label", title);
        b.addEventListener("click", () => { fn(); commit(); });
        fmt.appendChild(b);
      });
      const cvssBtn = document.createElement("button"); cvssBtn.className = "wu-fmt-btn wu-cvss-btn"; cvssBtn.type = "button"; cvssBtn.textContent = t("cvssCalc"); cvssBtn.title = t("cvssTitle");
      cvssBtn.addEventListener("click", () => openCvssCalc((vec, score, sev) => { insertAtCursor(editor, "\n**CVSS 3.1:** " + score + " (" + sev + ")  \n`" + vec + "`\n"); commit(); }));
      fmt.appendChild(cvssBtn);
      const wcEl = document.createElement("span"); wcEl.className = "wu-wordcount"; fmt.appendChild(wcEl);
      page.appendChild(fmt);

      editor.addEventListener("input", commit);
      // In-editor shortcuts (stopPropagation so the global Ctrl+K/Ctrl+I don't also fire).
      editor.addEventListener("keydown", ev => {
        if (!(ev.ctrlKey || ev.metaKey)) return;
        const k = ev.key.toLowerCase();
        if (k === "b") { ev.preventDefault(); ev.stopPropagation(); wuWrap(editor, "**", "**", "bold"); commit(); }
        else if (k === "i") { ev.preventDefault(); ev.stopPropagation(); wuWrap(editor, "*", "*", "italic"); commit(); }
        else if (k === "k") { ev.preventDefault(); ev.stopPropagation(); wuWrap(editor, "[", "](https://)", "text"); commit(); }
      });
      split.appendChild(editor); split.appendChild(preview);
      page.appendChild(split);
      syncPreview(); updateWc();

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
      // Insert an individual section at the cursor
      secSel.addEventListener("change", () => {
        const key = secSel.value; secSel.value = "";
        if (!key || !WRITEUP_SECTIONS[key]) return;
        insertAtCursor(editor, WRITEUP_SECTIONS[key]); commit();
      });
      // Machine link: persist the cross-link AND fill the report's placeholders +
      // Box/OS/Difficulty header from the machine's real values.
      mcSel.addEventListener("change", () => {
        const id = mcSel.value;
        const mm = machines.find(x => x.id === id);
        wu.relatedMachine = id;
        saveWu(wu.id, { relatedMachine: id });
        if (!mm) { showStatus(); return; }
        const filled = fillMachinePlaceholders(editor.value, mm);
        if (filled !== editor.value) { editor.value = filled; commit(); }
        else showStatus();
        const miss = !mm.ip;
        toast(miss ? t("machineNoIp") : (t("filledFrom") + " " + (mm.name || "")), miss ? "error" : "ok");
        editor.focus();
      });

      setTimeout(() => editor.focus(), 100);
    } else {
      // ── READ MODE ──
      const title = document.createElement("h1"); title.className = "wu-read-title"; title.textContent = wu.title;
      page.appendChild(title);

      const tagsRow = document.createElement("div"); tagsRow.className = "wu-page-tags";
      tagsRow.innerHTML = (wu.tags || []).map(tg => '<span class="wu-tag">' + escapeHtml(tg) + '</span>').join("");
      page.appendChild(tagsRow);

      const dateLine = document.createElement("div"); dateLine.className = "wu-page-date";
      dateLine.textContent = (lang === "tr" ? "Son guncelleme: " : "Last updated: ") + new Date(wu.updatedAt).toLocaleString() +
        " · " + wuWordCount(wu.content) + " " + t("wuWords") + " · " + wuReadMins(wu.content) + " " + t("wuMin");
      page.appendChild(dateLine);

      // Related-machine deep-link chip (if one is linked and still exists).
      const rel = machines.find(x => x.id === wu.relatedMachine);
      if (rel) {
        const link = document.createElement("button"); link.className = "wu-related-machine"; link.type = "button";
        link.innerHTML = osIconFor(rel.os) + " " + escapeHtml(rel.name) + (rel.ip ? " (" + escapeHtml(rel.ip) + ")" : "");
        link.title = t("wuOpenMachine");
        link.addEventListener("click", () => { openWriteupId = null; wuEditMode = false; openMachineId = rel.id; activeCategory = "machines"; render(); window.scrollTo({ top: 0, behavior: motionBehavior() }); });
        page.appendChild(link);
      }

      const body = document.createElement("div"); body.className = "wu-read-body";
      const content = wu.content || (lang === "tr" ? "Henuz icerik yok. Duzenle butonuna tiklayin." : "No content yet. Click Edit to start writing.");
      body.innerHTML = renderMarkdown(content);
      wireCodeCopies(body);

      // Auto table-of-contents from headings (in-page scroll, no hash routing).
      const heads = body.querySelectorAll(".wu-heading");
      if (heads.length >= 3) {
        const toc = document.createElement("nav"); toc.className = "wu-toc"; toc.setAttribute("aria-label", "Contents");
        toc.innerHTML = '<div class="wu-toc-title">' + (lang === "tr" ? "İçindekiler" : "Contents") + '</div>';
        heads.forEach((hd, i) => {
          hd.id = "wuh-" + i;
          const a = document.createElement("button"); a.className = "wu-toc-item lvl-" + hd.tagName.toLowerCase(); a.type = "button"; a.textContent = hd.textContent;
          a.addEventListener("click", () => hd.scrollIntoView({ behavior: motionBehavior(), block: "start" }));
          toc.appendChild(a);
        });
        page.appendChild(toc);
      }
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
  let openHostId = null; // expanded host inside an AD engagement
  let machineTab = "detail", machineTabFor = null; // "detail" | "report", per open machine
  let adConnectMode = false, adConnectSel = null; // graph connection drawing
  // The "active target": when set, every copied command is appended to this
  // machine's activity timeline (see logToActiveTarget). Survives reloads.
  let activeTargetId = localStorage.getItem("cs-active-target") || null;
  async function loadMachines() { machines = await api("GET", "/api/machines") || []; }

  // ── Structured machine data — normalizers (back-compat with old string[] data) ──
  const CRED_TYPES = ["password", "ntlm", "hash", "ssh-key", "kerberos", "token", "other"];
  const SVC_STATES = ["open", "filtered", "closed"];
  function normalizeService(s) {
    if (s && typeof s === "object") {
      return { port: String(s.port || ""), proto: s.proto || "tcp", name: s.name || s.service || "", version: s.version || "", state: s.state || "open", info: s.info || "" };
    }
    const str = String(s == null ? "" : s).trim();
    const mm = str.match(/^(\d{1,5})\/(tcp|udp)\s+(?:(open|closed|filtered)\s+)?(\S+)?\s*(.*)$/i);
    if (mm) return { port: mm[1], proto: mm[2].toLowerCase(), state: (mm[3] || "open").toLowerCase(), name: mm[4] || "", version: (mm[5] || "").trim(), info: "" };
    return { port: "", proto: "tcp", name: str, version: "", state: "open", info: "" };
  }
  function normalizeServices(arr) { return (Array.isArray(arr) ? arr : []).map(normalizeService); }

  function normalizeCred(c) {
    if (c && typeof c === "object") {
      return { username: c.username || "", secret: c.secret || "", type: c.type || "password", source: c.source || "", works: c.works || "", valid: c.valid !== false };
    }
    const str = String(c == null ? "" : c).trim();
    let source = "", core = str;
    const noteM = str.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
    if (noteM) { core = noteM[1].trim(); source = noteM[2].trim(); }
    let username = "", secret = core;
    const i = core.indexOf(":");
    if (i >= 0) { username = core.slice(0, i).trim(); secret = core.slice(i + 1).trim(); }
    let type = "password";
    if (/aad3b435|:[0-9a-f]{32}:[0-9a-f]{32}/i.test(str)) type = "ntlm";
    else if (/\$krb5|\.kirbi|ticket/i.test(str)) type = "kerberos";
    else if (/\b[0-9a-f]{32,}\b/i.test(secret)) type = "hash";
    return { username, secret, type, source, works: "", valid: true };
  }
  function normalizeCreds(arr) { return (Array.isArray(arr) ? arr : []).map(normalizeCred); }
  // Render a credential (object or string) back to a single readable line.
  function credToStr(c) { if (c && typeof c === "object") return (c.username ? c.username + ":" : "") + (c.secret || "") + (c.source ? " (" + c.source + ")" : ""); return String(c == null ? "" : c); }
  function credsToText(arr) { return (Array.isArray(arr) ? arr : []).map(credToStr).filter(Boolean).join("\n"); }

  // Parse nmap normal output ("PORT STATE SERVICE VERSION") into service rows.
  function parseNmapOutput(text) {
    const seen = {}, out = [];
    String(text || "").split(/\r?\n/).forEach(line => {
      const mm = line.match(/^\s*(\d{1,5})\/(tcp|udp)\s+(open\|filtered|open|filtered|closed)\s+(\S+)?\s*(.*)$/i);
      if (!mm) return;
      const port = mm[1]; if (+port < 1 || +port > 65535) return;
      const k = port + "/" + mm[2].toLowerCase(); if (seen[k]) return; seen[k] = 1;
      out.push({ port, proto: mm[2].toLowerCase(), state: mm[3].toLowerCase(), name: (mm[4] || "").trim(), version: (mm[5] || "").trim(), info: "" });
    });
    return out;
  }

  // Append a copied command to the active target's timeline (single central hook).
  function logToActiveTarget(text) {
    if (!activeTargetId) return;
    const m = machines.find(x => x.id === activeTargetId);
    if (!m) return;
    m.timeline = m.timeline || [];
    const last = m.timeline[m.timeline.length - 1];
    if (last && last.type === "cmd" && last.text === text) return; // skip repeats
    m.timeline.push({ ts: Date.now(), type: "cmd", text });
    if (m.timeline.length > 500) m.timeline = m.timeline.slice(-500);
    saveMachine(m.id, { timeline: m.timeline });
    if (openMachineId === m.id && machineTab === "detail") {
      const tl = document.getElementById("tlBody");
      if (tl) renderTimelineInto(tl, m);
    }
  }

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

  // ── Machine metadata helpers (platform / difficulty / status / flags / timing) ──
  function machineStatus(m) { return (m && m.status) || "not-started"; }
  function stLabel(v) { return t(ST_KEY[v] || "stNotStarted"); }
  function diffLabel(v) { return v ? t("diff_" + String(v).toLowerCase()) : ""; }
  function isCaptured(f) { return !!(f && f.capturedAt); }
  // Elapsed time between two ISO timestamps (to = now when null), as "Xh Ym".
  function fmtElapsed(fromISO, toISO) {
    if (!fromISO) return "—";
    const ms = (toISO ? new Date(toISO) : new Date()) - new Date(fromISO);
    if (!(ms > 0)) return "—";
    const h = Math.floor(ms / 3.6e6), mn = Math.floor((ms % 3.6e6) / 6e4);
    return (h ? h + "h " : "") + mn + "m";
  }
  // Auto-advance status + stamp startedAt/ownedAt from activity. Returns a patch
  // of the fields that changed (empty object if none) so callers can persist once.
  function machineAutoProgress(m) {
    const patch = {};
    if (!m.startedAt && ((m.checklist || []).some(c => c.done) || machineStatus(m) === "in-progress")) {
      m.startedAt = new Date().toISOString(); patch.startedAt = m.startedAt;
    }
    const owned = isCaptured(m.rootFlag) || machineStatus(m) === "owned" || machineStatus(m) === "reported";
    if (owned && !m.ownedAt) { m.ownedAt = new Date().toISOString(); patch.ownedAt = m.ownedAt; }
    if (machineStatus(m) === "not-started" && ((m.checklist || []).some(c => c.done) || isCaptured(m.userFlag))) {
      m.status = "in-progress"; patch.status = m.status;
    }
    if (isCaptured(m.rootFlag) && machineStatus(m) === "in-progress") { m.status = "owned"; patch.status = m.status; }
    return patch;
  }

  // ── AD engagement (multi-host) helpers ──
  function checklistStats(list) {
    const total = (list || []).length, done = (list || []).filter(c => c.done).length;
    return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
  }
  function isDcRole(h) {
    const s = ((h.role || "") + " " + (h.os || "") + " " + (h.name || "")).toLowerCase();
    return s.indexOf("dc") >= 0 || s.indexOf("domain contro") >= 0;
  }
  // Resolve a host entry to a display node. New hosts reference a real machine by
  // machineId (so they appear in the main Machines list and share progress);
  // legacy embedded hosts (pre-refactor) still render from their own fields.
  function hostNode(h) {
    if (h.machineId) {
      const mm = machines.find(x => x.id === h.machineId) || null;
      return {
        id: h.machineId, ref: true, dangling: !mm, machine: mm, entry: h,
        name: mm ? mm.name : "(deleted machine)", ip: mm ? (mm.ip || "") : "", os: mm ? (mm.os || "") : "",
        role: h.role || (mm && mm.role) || "", checklist: (mm && mm.checklist) || [], links: h.links || [],
      };
    }
    return { id: h.id, ref: false, machine: null, entry: h, name: h.name, ip: h.ip, os: h.os, role: h.role, checklist: h.checklist || [], links: h.links || [] };
  }
  // SVG arc geometry for the per-node progress ring.
  function polarXY(cx, cy, r, deg) { const a = (deg - 90) * Math.PI / 180; return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }; }
  function ringArc(cx, cy, r, pct) {
    const p = Math.max(0, Math.min(99.999, pct));
    const s = polarXY(cx, cy, r, 0), e = polarXY(cx, cy, r, p / 100 * 360);
    return "M " + s.x + " " + s.y + " A " + r + " " + r + " 0 " + (p > 50 ? 1 : 0) + " 1 " + e.x + " " + e.y;
  }
  function progClass(pct) { return pct >= 100 ? "p-done" : pct >= 50 ? "p-mid" : pct > 0 ? "p-low" : "p-none"; }
  // Phase-grouped checklist DOM for a host (reuses the machine checklist look).
  function buildChecklistBlock(list, onChange) {
    const wrap = document.createElement("div"); wrap.className = "host-checklist";
    let cur = null; for (const g of groupByPhase(list)) { if (g.items.some(x => !x.item.done)) { cur = g.phase; break; } }
    groupByPhase(list).forEach(g => {
      const gDone = g.items.filter(x => x.item.done).length;
      const pw = document.createElement("div"); pw.className = "checklist-phase" + (g.phase === cur ? " current" : "");
      const ph = document.createElement("div"); ph.className = "checklist-phase-header";
      ph.innerHTML = '<span class="checklist-phase-name">' + escapeHtml(g.phase) + '</span><span class="checklist-phase-count">' + gDone + '/' + g.items.length + '</span>';
      pw.appendChild(ph);
      g.items.forEach(({ item, i }) => {
        const row = document.createElement("div"); row.className = "checklist-item" + (item.done ? " done" : "");
        const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!item.done;
        const toggle = () => { list[i].done = cb.checked; row.classList.toggle("done", cb.checked); onChange(); };
        cb.addEventListener("change", toggle);
        const body = document.createElement("div"); body.className = "checklist-body";
        const lab = document.createElement("span"); lab.className = "checklist-label"; lab.textContent = item.label;
        lab.addEventListener("click", () => { cb.checked = !cb.checked; toggle(); });
        body.appendChild(lab);
        if (item.hint) {
          const hr = document.createElement("div"); hr.className = "checklist-hint";
          const code = document.createElement("code"); code.textContent = item.hint;
          const cbn = document.createElement("button"); cbn.className = "checklist-hint-copy"; cbn.textContent = "⧉"; cbn.title = t("copyCmd"); cbn.setAttribute("aria-label", t("copyCmd"));
          cbn.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); copyText(applyIpToCode(item.hint), () => { announce(t("copied")); toast(t("copied"), "ok"); }); });
          hr.appendChild(code); hr.appendChild(cbn); body.appendChild(hr);
        }
        row.appendChild(cb); row.appendChild(body);
        pw.appendChild(row);
      });
      wrap.appendChild(pw);
    });
    return wrap;
  }
  // Deterministic radial node-link diagram of the engagement (vanilla SVG).
  // Each node shows a progress ring from its checklist; onNodeClick drives
  // expand vs. connect-mode linking.
  // Clamp a node centre so its ring + label/pct text stay inside the viewBox.
  function clampNode(x, y) { return { x: Math.max(24, Math.min(396, x)), y: Math.max(22, Math.min(230, y)) }; }
  function buildAdSchematic(m, onNodeClick) {
    const NS = "http://www.w3.org/2000/svg";
    const VBW = 420, VBH = 285;
    const nodes = (m.hosts || []).map(hostNode);
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + VBW + " " + VBH); svg.setAttribute("class", "ad-schematic");
    svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "AD engagement host map");
    // Position: a saved per-host position (h.pos, set by dragging) wins; otherwise
    // fall back to the deterministic radial layout.
    const cx = 210, cy = 130, R = nodes.length > 1 ? 100 : 0, pos = {};
    nodes.forEach((n, i) => {
      const saved = n.entry && n.entry.pos;
      if (saved && typeof saved.x === "number" && typeof saved.y === "number") pos[n.id] = clampNode(saved.x, saved.y);
      else { const a = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2; pos[n.id] = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; }
    });
    // Edges — keep refs so we can move endpoints live while dragging.
    const edges = [], drawn = {};
    nodes.forEach(n => (n.links || []).forEach(lid => {
      if (!pos[lid]) return; const key = [n.id, lid].sort().join("|"); if (drawn[key]) return; drawn[key] = 1;
      const ln = document.createElementNS(NS, "line");
      ln.setAttribute("x1", pos[n.id].x); ln.setAttribute("y1", pos[n.id].y);
      ln.setAttribute("x2", pos[lid].x); ln.setAttribute("y2", pos[lid].y); ln.setAttribute("class", "ad-edge");
      edges.push({ ln, a: n.id, b: lid }); svg.appendChild(ln);
    }));
    function updateEdges(id) {
      edges.forEach(e => {
        if (e.a === id) { e.ln.setAttribute("x1", pos[id].x); e.ln.setAttribute("y1", pos[id].y); }
        if (e.b === id) { e.ln.setAttribute("x2", pos[id].x); e.ln.setAttribute("y2", pos[id].y); }
      });
    }
    // Convert a pointer event to viewBox coords (SVG is width:100%/height:auto → no letterbox).
    function toVB(ev) {
      const r = svg.getBoundingClientRect();
      return { x: (ev.clientX - r.left) / r.width * VBW, y: (ev.clientY - r.top) / r.height * VBH };
    }
    nodes.forEach(n => {
      const p = pos[n.id]; const pct = checklistStats(n.checklist).pct;
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", "ad-node " + progClass(pct) + (isDcRole(n) ? " dc" : "") + (n.id === openHostId ? " open" : "") + (n.id === adConnectSel ? " picking" : ""));
      g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", (n.name || "host") + " " + pct + "%");
      const bg = document.createElementNS(NS, "circle"); bg.setAttribute("r", 20); bg.setAttribute("class", "ad-ring-bg"); g.appendChild(bg);
      let ring = null;
      if (pct >= 100) { ring = document.createElementNS(NS, "circle"); ring.setAttribute("r", 20); ring.setAttribute("class", "ad-ring"); g.appendChild(ring); }
      else if (pct > 0) { ring = document.createElementNS(NS, "path"); ring.setAttribute("class", "ad-ring"); ring.dataset.arc = "1"; g.appendChild(ring); }
      const face = document.createElementNS(NS, "circle"); face.setAttribute("r", 15); face.setAttribute("class", "ad-node-face"); g.appendChild(face);
      const ic = document.createElementNS(NS, "text"); ic.setAttribute("class", "ad-node-icon"); ic.setAttribute("text-anchor", "middle"); ic.setAttribute("dominant-baseline", "central"); ic.textContent = isDcRole(n) ? "★" : osIconFor(n.os); g.appendChild(ic);
      const lb = document.createElementNS(NS, "text"); lb.setAttribute("class", "ad-node-label"); lb.setAttribute("text-anchor", "middle"); lb.textContent = (n.name || "host").slice(0, 16); g.appendChild(lb);
      const pt = document.createElementNS(NS, "text"); pt.setAttribute("class", "ad-node-pct"); pt.setAttribute("text-anchor", "middle"); pt.textContent = pct + "%"; g.appendChild(pt);
      // Position all of this node's elements at (x, y).
      function place(x, y) {
        pos[n.id] = { x, y };
        [bg, face].forEach(c => { c.setAttribute("cx", x); c.setAttribute("cy", y); });
        if (ring) { if (ring.dataset.arc) ring.setAttribute("d", ringArc(x, y, 20, pct)); else { ring.setAttribute("cx", x); ring.setAttribute("cy", y); } }
        ic.setAttribute("x", x); ic.setAttribute("y", y + 1);
        lb.setAttribute("x", x); lb.setAttribute("y", y + 36);
        pt.setAttribute("x", x); pt.setAttribute("y", y + 49);
        updateEdges(n.id);
      }
      place(p.x, p.y);

      // Drag to reposition; a press with no meaningful movement is treated as a click.
      let downX = 0, downY = 0, moved = false, dragging = false;
      g.addEventListener("pointerdown", ev => {
        if (ev.button != null && ev.button !== 0) return;
        ev.preventDefault();
        downX = ev.clientX; downY = ev.clientY; moved = false; dragging = true;
        try { g.setPointerCapture(ev.pointerId); } catch { /* ignore */ }
        g.classList.add("dragging");
      });
      g.addEventListener("pointermove", ev => {
        if (!dragging) return;
        if (Math.abs(ev.clientX - downX) + Math.abs(ev.clientY - downY) > 3) moved = true;
        if (!moved) return;
        const v = toVB(ev); const c = clampNode(v.x, v.y); place(c.x, c.y);
      });
      function endDrag(ev) {
        if (!dragging) return;
        dragging = false; g.classList.remove("dragging");
        try { g.releasePointerCapture(ev.pointerId); } catch { /* ignore */ }
        if (moved) {
          // Persist the new position on the host entry (travels with m.hosts).
          if (n.entry) { n.entry.pos = { x: Math.round(pos[n.id].x), y: Math.round(pos[n.id].y) }; saveMachine(m.id, { hosts: m.hosts }); }
        } else {
          onNodeClick(n); // it was a plain click
        }
      }
      g.addEventListener("pointerup", endDrag);
      g.addEventListener("pointercancel", endDrag);
      g.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); onNodeClick(n); } });
      svg.appendChild(g);
    });
    return svg;
  }
  async function createMachine() {
    const tplOpts = [{ value: "", label: t("defaultChecklist") }]
      .concat(machineTemplates().map(tpl => ({ value: tpl.id, label: tpl.icon + " " + tpl.name })));
    openModal(t("addMachine"), [
      { key: "name", label: t("machineName"), placeholder: "e.g., Lame" },
      { key: "ip", label: t("machineIP"), placeholder: "10.10.10.3" },
      { key: "os", label: t("machineOS"), placeholder: "Linux / Windows" },
      { key: "platform", label: t("mPlatform"), type: "select", value: "HTB", options: MACHINE_PLATFORMS.map(p => ({ value: p, label: p })) },
      { key: "difficulty", label: t("mDifficulty"), type: "select", value: "", options: [{ value: "", label: "—" }].concat(MACHINE_DIFFS.map(d => ({ value: d, label: diffLabel(d) }))) },
      { key: "tags", label: t("wuTags"), placeholder: t("mTagsHint") },
      { key: "template", label: t("playbook"), type: "select", options: tplOpts }
    ], {}, async fd => {
      const tags = (fd.tags || "").split(",").map(s => s.trim()).filter(Boolean);
      const m = await api("POST", "/api/machines", { name: fd.name, ip: fd.ip, os: fd.os, platform: fd.platform, difficulty: fd.difficulty, tags });
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
  // Per-id debounce so saving one machine never cancels another's pending write.
  const machineTimers = {};
  function saveMachine(id, data) {
    clearTimeout(machineTimers[id]);
    machineTimers[id] = setTimeout(() => api("PUT", "/api/machines/" + id, data), 400);
  }

  // Build a Markdown report body from a tracked machine's structured data.
  function machineToMarkdown(m) {
    const flagLine = f => (isCaptured(f) ? "✅ " + t("capturedAt") + " " + new Date(f.capturedAt).toLocaleDateString() : "⬜ " + t("notCaptured"));
    let md = "# " + (m.name || "Machine") + " — " + (m.platform || "Custom") + "\n\n";
    md += "> **" + t("machineName") + ":** " + (m.name || "") + " · **" + t("machineOS") + ":** " + (m.os || "—") +
      " · **" + t("mDifficulty") + ":** " + (diffLabel(m.difficulty) || "—") +
      " · **" + t("mPlatform") + ":** " + (m.platform || "Custom") + " · **IP:** `" + (m.ip || "—") + "`\n";
    md += "> **" + t("mStatus") + ":** " + stLabel(machineStatus(m)) +
      " · **" + t("userFlag") + ":** " + flagLine(m.userFlag) +
      " · **" + t("rootFlag") + ":** " + flagLine(m.rootFlag) + "\n\n";
    const cell = v => String(v == null ? "" : v).replace(/\|/g, "\\|").replace(/\n/g, " ");
    const svcs = normalizeServices(m.services);
    md += "## " + t("services") + "\n\n";
    if (svcs.length) {
      md += "| " + t("svcPort") + " | " + t("svcProto") + " | " + t("svcState") + " | " + t("svcName") + " | " + t("svcVersion") + " |\n";
      md += "|---|---|---|---|---|\n";
      svcs.forEach(s => { md += "| " + cell(s.port) + " | " + cell(s.proto) + " | " + cell(s.state) + " | " + cell(s.name) + " | " + cell(s.version) + " |\n"; });
      md += "\n";
    } else md += "_—_\n\n";
    const creds = normalizeCreds(m.credentials);
    md += "## " + t("credentials") + "\n\n";
    if (creds.length) {
      md += "| " + t("credUser") + " | " + t("credSecret") + " | " + t("credTypeCol") + " | " + t("credSource") + " | " + t("credWorks") + " | " + t("credState") + " |\n";
      md += "|---|---|---|---|---|---|\n";
      creds.forEach(c => { md += "| " + cell(c.username) + " | `" + cell(c.secret) + "` | " + cell(c.type) + " | " + cell(c.source) + " | " + cell(c.works) + " | " + (c.valid ? "✅" : "❌") + " |\n"; });
      md += "\n";
    } else md += "_—_\n\n";
    md += "## " + t("attackPath") + "\n\n";
    md += m.attackPath ? "```\n" + m.attackPath + "\n```\n\n" : "_—_\n\n";
    const groups = groupByPhase(m.checklist);
    if (groups.length) {
      md += "## " + t("progress") + "\n\n";
      groups.forEach(g => {
        const gd = g.items.filter(x => x.item.done).length;
        md += "### " + g.phase + " (" + gd + "/" + g.items.length + ")\n\n";
        g.items.forEach(({ item }) => { md += "- [" + (item.done ? "x" : " ") + "] " + item.label + "\n"; });
        md += "\n";
      });
    }
    if (m.notes) md += "## " + t("notes") + "\n\n" + m.notes + "\n\n";
    if ((m.timeline || []).length) {
      md += "## " + t("timeline") + "\n\n";
      m.timeline.forEach(it => {
        const ts = new Date(it.ts).toLocaleString();
        if (it.type === "cmd") md += "- `" + String(it.text).replace(/`/g, "'") + "`  \n  _" + ts + "_\n";
        else md += "- **" + ts + "** — " + String(it.text).replace(/\n/g, " ") + "\n";
      });
      md += "\n";
    }
    if ((m.evidence || []).length) {
      md += "## " + t("evidence") + "\n\n";
      m.evidence.forEach(ev => { md += "![" + (ev.caption || "evidence").replace(/[[\]]/g, "") + "](" + ev.url + ")\n\n"; });
    }
    md += "---\n\n";
    // Append the report skeleton (OSCP/PG → oscp; otherwise htb), with the box IP filled in.
    const tplKey = (m.platform === "OSCP" || m.platform === "PG") ? "oscp" : "htb";
    const skeleton = WRITEUP_TEMPLATES[tplKey].replace(/\{TITLE\}/g, (m.name || "Machine") + " — Report");
    md += fillMachinePlaceholders(skeleton, m);
    return md;
  }
  async function generateWriteupFromMachine(m) {
    const content = machineToMarkdown(m);
    const title = (m.name || "Machine") + " — " + (m.platform || "Custom");
    const tags = ["writeup", m.platform, m.difficulty].filter(Boolean);
    const wu = await api("POST", "/api/writeups", { title, tags, content });
    if (!wu || !wu.id) { toast(t("netErr"), "error"); return; }
    await api("PUT", "/api/writeups/" + wu.id, { relatedMachine: m.id });
    await loadWriteups();
    openMachineId = null; openWriteupId = wu.id; wuEditMode = true; activeCategory = "writeups";
    render();
    toast(t("wuGenerated"), "ok");
  }
  function machineFileName(m) { return (m.name || "machine").replace(/[^a-z0-9]/gi, "_"); }
  function machineReportHtml(m) {
    return "<!DOCTYPE html><html lang='" + lang + "'><head><meta charset='utf-8'>" +
      "<meta name='viewport' content='width=device-width,initial-scale=1'>" +
      "<title>" + escapeHtml(m.name || "machine") + "</title><style>" + WU_PRINT_CSS + "</style></head><body>" +
      renderMarkdown(machineToMarkdown(m)) + "</body></html>";
  }
  function exportMachineMd(m) {
    const blob = new Blob([machineToMarkdown(m)], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = machineFileName(m) + ".md";
    a.click(); URL.revokeObjectURL(a.href);
  }
  function exportMachineHtml(m) {
    const blob = new Blob([machineReportHtml(m)], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = machineFileName(m) + ".html";
    a.click(); URL.revokeObjectURL(a.href);
  }
  function exportMachinePdf(m) {
    const win = window.open("", "_blank");
    if (!win) { toast(t("copyFail"), "error"); return; }
    win.document.write(machineReportHtml(m));
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
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

    // ── Aggregate stats dashboard ──
    const total = machines.length;
    const owned = machines.filter(m => machineStatus(m) === "owned" || machineStatus(m) === "reported").length;
    const inProg = machines.filter(m => machineStatus(m) === "in-progress").length;
    const avg = total ? Math.round(machines.reduce((s, m) => { const c = m.checklist || []; return s + (c.length ? c.filter(x => x.done).length / c.length * 100 : 0); }, 0) / total) : 0;
    const statsBar = document.createElement("div"); statsBar.className = "machine-stats-bar";
    statsBar.innerHTML =
      '<div class="machine-stat"><strong>' + total + '</strong>' + t("statTotal") + '</div>' +
      '<div class="machine-stat"><strong class="s-owned">' + owned + '</strong>' + t("statOwned") + '</div>' +
      '<div class="machine-stat"><strong class="s-prog">' + inProg + '</strong>' + t("statInProgress") + '</div>' +
      '<div class="machine-stat"><strong>' + avg + '%</strong>' + t("statAvg") + '</div>';
    contentArea.appendChild(statsBar);

    // ── Controls: search + platform/status/tag filters + sort ──
    const controls = document.createElement("div"); controls.className = "machine-controls";
    const mSearch = document.createElement("input"); mSearch.type = "search"; mSearch.className = "wu-list-search"; mSearch.value = machineFilter.q;
    mSearch.placeholder = t("mSearch"); mSearch.setAttribute("aria-label", t("mSearch"));
    const platformsPresent = Array.from(new Set(machines.map(m => m.platform || "Custom")));
    const tagsPresent = Array.from(new Set(machines.flatMap(m => m.tags || []))).sort((a, b) => a.localeCompare(b));
    const mkSel = (cls, label, cur, opts) => {
      const s = document.createElement("select"); s.className = "form-select machine-filter-sel"; s.dataset.f = cls; s.setAttribute("aria-label", label);
      s.innerHTML = opts.map(o => '<option value="' + escapeHtml(o.value) + '"' + (o.value === cur ? " selected" : "") + '>' + escapeHtml(o.label) + '</option>').join("");
      return s;
    };
    const platSel = mkSel("platform", t("filterPlatform"), machineFilter.platform, [{ value: "", label: t("filterPlatform") + ": " + t("filterAll") }].concat(platformsPresent.map(p => ({ value: p, label: p }))));
    const statSel = mkSel("status", t("filterStatus"), machineFilter.status, [{ value: "", label: t("filterStatus") + ": " + t("filterAll") }].concat(MACHINE_STATUSES.map(v => ({ value: v, label: stLabel(v) }))));
    const tagSel = mkSel("tag", t("filterTag"), machineFilter.tag, [{ value: "", label: t("filterTag") + ": " + t("filterAll") }].concat(tagsPresent.map(tg => ({ value: tg, label: tg }))));
    const sortSel = mkSel("sort", t("wuSort"), machineFilter.sort, [{ value: "recent", label: t("wuSort") + ": " + t("sortRecent") }, { value: "name", label: t("sortName") }, { value: "progress", label: t("sortProgress") }]);
    controls.appendChild(mSearch); controls.appendChild(platSel); controls.appendChild(statSel); controls.appendChild(tagSel); controls.appendChild(sortSel);
    // Grid / Board view toggle
    const viewToggle = document.createElement("div"); viewToggle.className = "machine-view-toggle";
    const gBtn = document.createElement("button"); gBtn.className = "view-btn" + (machineView === "grid" ? " active" : ""); gBtn.textContent = t("gridView"); gBtn.title = t("gridView");
    const bBtn = document.createElement("button"); bBtn.className = "view-btn" + (machineView === "board" ? " active" : ""); bBtn.textContent = t("boardView"); bBtn.title = t("boardView");
    gBtn.addEventListener("click", () => { if (machineView === "grid") return; machineView = "grid"; localStorage.setItem("cs-machine-view", "grid"); gBtn.classList.add("active"); bBtn.classList.remove("active"); statSel.disabled = false; renderView(); });
    bBtn.addEventListener("click", () => { if (machineView === "board") return; machineView = "board"; localStorage.setItem("cs-machine-view", "board"); bBtn.classList.add("active"); gBtn.classList.remove("active"); statSel.disabled = true; renderView(); });
    viewToggle.appendChild(gBtn); viewToggle.appendChild(bBtn); controls.appendChild(viewToggle);
    if (machineView === "board") statSel.disabled = true;
    contentArea.appendChild(controls);

    const gridWrap = document.createElement("div"); contentArea.appendChild(gridWrap);
    function renderView() { if (machineView === "board") renderBoard(); else renderGrid(); }
    function applyMachineView() {
      const q = machineFilter.q.trim().toLowerCase();
      let list = machines.filter(m => {
        if (machineFilter.platform && (m.platform || "Custom") !== machineFilter.platform) return false;
        if (machineFilter.status && machineStatus(m) !== machineFilter.status) return false;
        if (machineFilter.tag && !(m.tags || []).includes(machineFilter.tag)) return false;
        if (!q) return true;
        return [m.name, m.ip, m.os].some(v => (v || "").toLowerCase().includes(q)) || (m.tags || []).some(tg => tg.toLowerCase().includes(q));
      });
      const pctOf = m => { const c = m.checklist || []; return c.length ? c.filter(x => x.done).length / c.length : 0; };
      const cmp = {
        name: (a, b) => (a.name || "").localeCompare(b.name || ""),
        progress: (a, b) => pctOf(b) - pctOf(a),
        recent: (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
      }[machineFilter.sort] || null;
      if (cmp) list.sort(cmp);
      return list;
    }
    function renderGrid() {
      gridWrap.innerHTML = "";
      const list = applyMachineView();
      if (list.length === 0) {
        const nr = document.createElement("div"); nr.className = "no-results";
        nr.innerHTML = "<h3>" + t("noResults") + "</h3><p>" + t("noMatches") + "</p>";
        gridWrap.appendChild(nr); return;
      }
      const grid = document.createElement("div"); grid.className = "machine-grid";
      list.forEach(m => {
        const done = (m.checklist || []).filter(c => c.done).length;
        const tot = (m.checklist || []).length;
        const pct = tot > 0 ? Math.round(done / tot * 100) : 0;
        const st = machineStatus(m);
        const diff = m.difficulty || "";
        const phase = currentPhaseName(m);
        const chips = (m.tags || []).slice(0, 3).map(tg => '<span class="machine-tag">' + escapeHtml(tg) + '</span>').join("");
        const card = document.createElement("div"); card.className = "machine-card";
        card.setAttribute("role", "button"); card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", m.name + (m.ip ? ", " + m.ip : "") + ", " + stLabel(st));
        card.innerHTML =
          '<div class="machine-card-top">' +
            '<span class="machine-os-icon">' + osIconFor(m.os) + '</span>' +
            '<div class="machine-info"><div class="machine-name">' + escapeHtml(m.name) + '</div><div class="machine-ip">' + escapeHtml(m.ip || "No IP") + '</div></div>' +
            (isCaptured(m.userFlag) ? '<span class="flag-chip user" title="' + t("userFlag") + '">🚩</span>' : '') +
            (isCaptured(m.rootFlag) ? '<span class="flag-chip root" title="' + t("rootFlag") + '">👑</span>' : '') +
            '<button class="machine-del-btn" title="' + t("del") + '" aria-label="' + t("del") + '">🗑</button>' +
          '</div>' +
          '<div class="machine-card-meta">' +
            '<span class="machine-status st-' + st + '">' + stLabel(st) + '</span>' +
            '<span class="machine-plat">' + escapeHtml(m.platform || "Custom") + '</span>' +
            (diff ? '<span class="diff-badge diff-' + String(diff).toLowerCase() + '">' + escapeHtml(diffLabel(diff)) + '</span>' : '') +
            chips +
          '</div>' +
          '<div class="machine-progress"><div class="machine-progress-bar"><div class="machine-progress-fill" style="width:' + pct + '%"></div></div><span class="machine-progress-text">' + done + '/' + tot + ' (' + pct + '%)</span></div>' +
          (tot > 0 ? '<div class="machine-card-phase' + (phase ? '' : ' done') + '">' + (phase ? '▸ ' + escapeHtml(phase) : '✅ ' + t("allDone")) + '</div>' : '');
        card.addEventListener("click", e => { if (e.target.closest(".machine-del-btn")) return; openMachineId = m.id; render(); });
        card.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target === card) { e.preventDefault(); openMachineId = m.id; render(); } });
        card.querySelector(".machine-del-btn").addEventListener("click", e => deleteMachine(m.id, e));
        grid.appendChild(card);
      });
      gridWrap.appendChild(grid);
    }
    function buildBoardCard(m) {
      const done = (m.checklist || []).filter(c => c.done).length, tot = (m.checklist || []).length;
      const pct = tot > 0 ? Math.round(done / tot * 100) : 0;
      const card = document.createElement("div"); card.className = "board-card"; card.draggable = true;
      card.setAttribute("role", "button"); card.setAttribute("tabindex", "0");
      card.innerHTML =
        '<div class="board-card-top"><span class="machine-os-icon">' + osIconFor(m.os) + '</span>' +
          '<span class="board-card-name">' + escapeHtml(m.name) + '</span>' +
          (isCaptured(m.userFlag) ? '<span class="flag-chip user" title="' + t("userFlag") + '">🚩</span>' : '') +
          (isCaptured(m.rootFlag) ? '<span class="flag-chip root" title="' + t("rootFlag") + '">👑</span>' : '') + '</div>' +
        (m.ip ? '<div class="board-card-ip">' + escapeHtml(m.ip) + '</div>' : '') +
        (tot > 0 ? '<div class="machine-progress"><div class="machine-progress-bar"><div class="machine-progress-fill" style="width:' + pct + '%"></div></div><span class="machine-progress-text">' + pct + '%</span></div>' : '');
      card.addEventListener("click", () => { openMachineId = m.id; render(); });
      card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openMachineId = m.id; render(); } });
      card.addEventListener("dragstart", e => { e.dataTransfer.setData("text/plain", m.id); e.dataTransfer.effectAllowed = "move"; card.classList.add("dragging"); });
      card.addEventListener("dragend", () => card.classList.remove("dragging"));
      return card;
    }
    function renderBoard() {
      gridWrap.innerHTML = "";
      const q = machineFilter.q.trim().toLowerCase();
      const base = machines.filter(m => {
        if (machineFilter.platform && (m.platform || "Custom") !== machineFilter.platform) return false;
        if (machineFilter.tag && !(m.tags || []).includes(machineFilter.tag)) return false;
        if (!q) return true;
        return [m.name, m.ip, m.os].some(v => (v || "").toLowerCase().includes(q)) || (m.tags || []).some(tg => tg.toLowerCase().includes(q));
      });
      const board = document.createElement("div"); board.className = "machine-board";
      MACHINE_STATUSES.forEach(status => {
        const col = document.createElement("div"); col.className = "board-col"; col.dataset.status = status;
        const inCol = base.filter(m => machineStatus(m) === status);
        const head = document.createElement("div"); head.className = "board-col-head st-" + status;
        head.innerHTML = '<span>' + escapeHtml(stLabel(status)) + '</span><span class="board-count">' + inCol.length + '</span>';
        const body = document.createElement("div"); body.className = "board-col-body";
        inCol.forEach(m => body.appendChild(buildBoardCard(m)));
        col.appendChild(head); col.appendChild(body);
        col.addEventListener("dragover", e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; col.classList.add("drag-over"); });
        col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
        col.addEventListener("drop", e => {
          e.preventDefault(); col.classList.remove("drag-over");
          const id = e.dataTransfer.getData("text/plain");
          const m = machines.find(x => x.id === id);
          if (!m || machineStatus(m) === status) return;
          m.status = status;
          const patch = { status }; Object.assign(patch, machineAutoProgress(m));
          saveMachine(m.id, patch); renderBoard();
        });
        board.appendChild(col);
      });
      gridWrap.appendChild(board);
    }
    // Live filter without a full render() so the search box keeps focus.
    let mST; mSearch.addEventListener("input", () => { clearTimeout(mST); mST = setTimeout(() => { machineFilter.q = mSearch.value; renderView(); }, 150); });
    [platSel, statSel, tagSel, sortSel].forEach(sel => sel.addEventListener("change", () => { machineFilter[sel.dataset.f] = sel.value; renderView(); }));
    renderView();
  }

  // Live, read-only report rendered from the machine's CURRENT data — no stored
  // copy, always in sync. Export it, or snapshot an editable copy into Write-ups.
  function renderMachineReport(m, page) {
    const wrap = document.createElement("div"); wrap.className = "machine-report";
    const bar = document.createElement("div"); bar.className = "machine-report-bar";
    const mk = (label, fn, primary) => {
      const b = document.createElement("button"); b.className = "btn btn-sm " + (primary ? "btn-primary" : "btn-secondary");
      b.textContent = label; b.addEventListener("click", fn); return b;
    };
    bar.appendChild(mk("⬇ " + t("exportMachineMd"), () => exportMachineMd(m)));
    bar.appendChild(mk("⬇ " + t("wuExportHtml"), () => exportMachineHtml(m)));
    bar.appendChild(mk("⬇ " + t("exportPdf"), () => exportMachinePdf(m)));
    bar.appendChild(mk("💾 " + t("saveAsWriteup"), () => generateWriteupFromMachine(m), true));
    wrap.appendChild(bar);
    const hint = document.createElement("p"); hint.className = "machine-report-hint"; hint.textContent = t("reportLive");
    wrap.appendChild(hint);
    const body = document.createElement("div"); body.className = "wu-read-body machine-report-body";
    body.innerHTML = renderMarkdown(machineToMarkdown(m));
    wireCodeCopies(body);
    wrap.appendChild(body);
    page.appendChild(wrap);
  }

  // ── Active-target banner: toggle whether copied commands log to this box ──
  function buildActiveTargetBar(m) {
    const isActive = activeTargetId === m.id;
    const bar = document.createElement("div"); bar.className = "active-target-bar" + (isActive ? " on" : "");
    const label = document.createElement("span"); label.className = "active-target-label";
    label.innerHTML = isActive
      ? '<span class="active-dot">●</span> <strong>' + t("activeBadge") + '</strong> — ' + t("activeHint")
      : '🎯 ' + t("activeTarget");
    const btn = document.createElement("button"); btn.className = "btn btn-sm " + (isActive ? "btn-secondary" : "btn-primary");
    btn.textContent = isActive ? t("unsetActive") : t("setActive");
    btn.addEventListener("click", () => {
      if (isActive) { activeTargetId = null; localStorage.removeItem("cs-active-target"); }
      else { activeTargetId = m.id; localStorage.setItem("cs-active-target", m.id); toast(t("activeNowSet"), "ok"); }
      render();
    });
    bar.appendChild(label); bar.appendChild(btn);
    return bar;
  }

  // ── Structured services table + inline nmap import + quick-scan chips ──
  function buildServicesSection(m) {
    m.services = normalizeServices(m.services);
    const sec = document.createElement("div"); sec.className = "machine-section";
    const head = document.createElement("div"); head.className = "machine-section-head";
    head.innerHTML = '<h3>🔌 ' + t("services") + '</h3>';
    const actions = document.createElement("div"); actions.className = "svc-actions";
    const importBtn = document.createElement("button"); importBtn.className = "btn btn-secondary btn-sm"; importBtn.textContent = t("importNmap");
    const addBtn = document.createElement("button"); addBtn.className = "btn btn-secondary btn-sm"; addBtn.textContent = t("svcAdd");
    actions.appendChild(importBtn); actions.appendChild(addBtn); head.appendChild(actions);
    sec.appendChild(head);

    const importPanel = document.createElement("div"); importPanel.className = "svc-import"; importPanel.style.display = "none";
    const importTa = document.createElement("textarea"); importTa.className = "machine-textarea"; importTa.placeholder = t("importNmapPh"); importTa.rows = 6;
    const importGo = document.createElement("button"); importGo.className = "btn btn-primary btn-sm"; importGo.textContent = t("importDo");
    importPanel.appendChild(importTa); importPanel.appendChild(importGo); sec.appendChild(importPanel);

    const tableWrap = document.createElement("div"); tableWrap.className = "data-table-wrap";
    const quick = document.createElement("div"); quick.className = "svc-quick";
    sec.appendChild(tableWrap); sec.appendChild(quick);

    const persist = () => { saveMachine(m.id, { services: m.services }); };
    const ip = () => m.ip || "<TARGET_IP>";
    const scanCopy = cmd => { const applied = applyIpToCode(cmd); copyText(applied, () => { recordHistory(applied); announce(t("copied")); toast(t("copied"), "ok"); }); };

    function renderQuick() {
      quick.innerHTML = "";
      const ports = m.services.map(s => s.port).filter(p => p && +p > 0);
      if (!ports.length) return;
      const b = document.createElement("button"); b.className = "svc-chip"; b.textContent = "🔎 nmap -sCV (" + ports.length + ")"; b.title = t("scanAll");
      b.addEventListener("click", () => scanCopy("nmap -sCV -p" + ports.join(",") + " " + ip()));
      quick.appendChild(b);
    }
    function renderTable() {
      tableWrap.innerHTML = "";
      if (!m.services.length) { const e = document.createElement("p"); e.className = "machine-hosts-empty"; e.textContent = t("svcNone"); tableWrap.appendChild(e); renderQuick(); return; }
      const tbl = document.createElement("table"); tbl.className = "data-table";
      tbl.innerHTML = "<thead><tr><th class='c-port'>" + t("svcPort") + "</th><th class='c-proto'>" + t("svcProto") + "</th><th class='c-state'>" + t("svcState") + "</th><th>" + t("svcName") + "</th><th>" + t("svcVersion") + "</th><th class='c-act'></th></tr></thead>";
      const tb = document.createElement("tbody");
      m.services.forEach((s, i) => {
        const tr = document.createElement("tr");
        const textCell = (key, cls) => { const td = document.createElement("td"); const inp = document.createElement("input"); inp.className = "cell-input"; if (cls) inp.classList.add(cls); inp.value = s[key] || ""; inp.setAttribute("aria-label", key); inp.addEventListener("input", () => { s[key] = inp.value; persist(); if (key === "port") renderQuick(); }); td.appendChild(inp); return td; };
        const selCell = (key, opts) => { const td = document.createElement("td"); const sel = document.createElement("select"); sel.className = "cell-input"; opts.forEach(o => { const op = document.createElement("option"); op.value = o; op.textContent = o; if (s[key] === o) op.selected = true; sel.appendChild(op); }); sel.addEventListener("change", () => { s[key] = sel.value; persist(); }); td.appendChild(sel); return td; };
        tr.appendChild(textCell("port", "cell-narrow"));
        tr.appendChild(selCell("proto", ["tcp", "udp"]));
        tr.appendChild(selCell("state", SVC_STATES));
        tr.appendChild(textCell("name"));
        tr.appendChild(textCell("version"));
        const tdA = document.createElement("td"); tdA.className = "cell-actions";
        const scan = document.createElement("button"); scan.className = "cell-btn"; scan.textContent = "🔎"; scan.title = t("scanPort");
        scan.addEventListener("click", () => scanCopy("nmap -sCV -p" + (s.port || "") + " " + ip()));
        const del = document.createElement("button"); del.className = "cell-btn cell-del"; del.textContent = "✕"; del.title = t("del");
        del.addEventListener("click", () => { m.services.splice(i, 1); persist(); renderTable(); });
        tdA.appendChild(scan); tdA.appendChild(del); tr.appendChild(tdA);
        tb.appendChild(tr);
      });
      tbl.appendChild(tb); tableWrap.appendChild(tbl); renderQuick();
    }
    addBtn.addEventListener("click", () => { m.services.push({ port: "", proto: "tcp", state: "open", name: "", version: "", info: "" }); persist(); renderTable(); const inputs = tableWrap.querySelectorAll("tbody tr:last-child .cell-input"); if (inputs[0]) inputs[0].focus(); });
    importBtn.addEventListener("click", () => { const show = importPanel.style.display === "none"; importPanel.style.display = show ? "block" : "none"; if (show) importTa.focus(); });
    importGo.addEventListener("click", () => {
      const parsed = parseNmapOutput(importTa.value);
      if (!parsed.length) { toast(t("importedNone"), "error"); return; }
      parsed.forEach(p => { const idx = m.services.findIndex(s => s.port === p.port && s.proto === p.proto); if (idx >= 0) m.services[idx] = p; else m.services.push(p); });
      persist(); importTa.value = ""; importPanel.style.display = "none"; renderTable();
      toast(t("importedN").replace("{n}", parsed.length), "ok");
    });
    renderTable();
    return sec;
  }

  // ── Credential vault: structured, per-secret copy, validity toggle ──
  function buildCredsSection(m) {
    m.credentials = normalizeCreds(m.credentials);
    const sec = document.createElement("div"); sec.className = "machine-section";
    const head = document.createElement("div"); head.className = "machine-section-head";
    head.innerHTML = '<h3>🔑 ' + t("credentials") + '</h3>';
    const addBtn = document.createElement("button"); addBtn.className = "btn btn-secondary btn-sm"; addBtn.textContent = t("credAdd");
    head.appendChild(addBtn); sec.appendChild(head);
    const tableWrap = document.createElement("div"); tableWrap.className = "data-table-wrap"; sec.appendChild(tableWrap);
    const persist = () => { saveMachine(m.id, { credentials: m.credentials }); };
    const cp = (txt, msg) => { if (!txt) return; copyText(txt, () => { toast(msg || t("copied"), "ok"); announce(t("copied")); }); };
    function renderTable() {
      tableWrap.innerHTML = "";
      if (!m.credentials.length) { const e = document.createElement("p"); e.className = "machine-hosts-empty"; e.textContent = t("credNone"); tableWrap.appendChild(e); return; }
      const tbl = document.createElement("table"); tbl.className = "data-table";
      tbl.innerHTML = "<thead><tr><th>" + t("credUser") + "</th><th>" + t("credSecret") + "</th><th class='c-type'>" + t("credTypeCol") + "</th><th>" + t("credSource") + "</th><th class='c-works'>" + t("credWorks") + "</th><th class='c-act'></th></tr></thead>";
      const tb = document.createElement("tbody");
      m.credentials.forEach((c, i) => {
        const tr = document.createElement("tr"); if (!c.valid) tr.classList.add("cred-invalid");
        const textCell = (key) => { const td = document.createElement("td"); const inp = document.createElement("input"); inp.className = "cell-input"; inp.value = c[key] || ""; inp.setAttribute("aria-label", key); inp.addEventListener("input", () => { c[key] = inp.value; persist(); }); td.appendChild(inp); return td; };
        tr.appendChild(textCell("username"));
        // secret + copy
        const tdSec = document.createElement("td"); tdSec.className = "cell-secret";
        const sInp = document.createElement("input"); sInp.className = "cell-input"; sInp.value = c.secret || ""; sInp.setAttribute("aria-label", "secret"); sInp.addEventListener("input", () => { c.secret = sInp.value; persist(); });
        const sCopy = document.createElement("button"); sCopy.className = "cell-btn"; sCopy.textContent = "⧉"; sCopy.title = t("credCopySecret"); sCopy.addEventListener("click", () => cp(c.secret, t("credCopySecret")));
        tdSec.appendChild(sInp); tdSec.appendChild(sCopy); tr.appendChild(tdSec);
        // type select
        const tdT = document.createElement("td"); const tsel = document.createElement("select"); tsel.className = "cell-input"; CRED_TYPES.forEach(ct => { const o = document.createElement("option"); o.value = ct; o.textContent = ct; if (c.type === ct) o.selected = true; tsel.appendChild(o); }); tsel.addEventListener("change", () => { c.type = tsel.value; persist(); }); tdT.appendChild(tsel); tr.appendChild(tdT);
        tr.appendChild(textCell("source"));
        tr.appendChild(textCell("works"));
        // actions: copy pair, valid toggle, delete
        const tdA = document.createElement("td"); tdA.className = "cell-actions";
        const pair = document.createElement("button"); pair.className = "cell-btn"; pair.textContent = "👤"; pair.title = t("credCopyPair"); pair.addEventListener("click", () => cp((c.username ? c.username + ":" : "") + (c.secret || ""), t("credCopyPair")));
        const vld = document.createElement("button"); vld.className = "cell-btn cell-valid" + (c.valid ? " on" : ""); vld.textContent = c.valid ? "✓" : "✗"; vld.title = t("credState"); vld.addEventListener("click", () => { c.valid = !c.valid; persist(); renderTable(); });
        const del = document.createElement("button"); del.className = "cell-btn cell-del"; del.textContent = "✕"; del.title = t("del"); del.addEventListener("click", () => { m.credentials.splice(i, 1); persist(); renderTable(); });
        tdA.appendChild(pair); tdA.appendChild(vld); tdA.appendChild(del); tr.appendChild(tdA);
        tb.appendChild(tr);
      });
      tbl.appendChild(tb); tableWrap.appendChild(tbl);
    }
    addBtn.addEventListener("click", () => { m.credentials.push({ username: "", secret: "", type: "password", source: "", works: "", valid: true }); persist(); renderTable(); const inputs = tableWrap.querySelectorAll("tbody tr:last-child .cell-input"); if (inputs[0]) inputs[0].focus(); });
    renderTable();
    return sec;
  }

  // ── Activity timeline (auto-logged copies + manual notes) ──
  function tlIcon(type) { return type === "cmd" ? "⌨" : type === "note" ? "📝" : "◆"; }
  function renderTimelineInto(container, m) {
    container.innerHTML = "";
    const items = (m.timeline || []).slice().reverse(); // newest first
    if (!items.length) { const e = document.createElement("p"); e.className = "machine-hosts-empty"; e.textContent = t("timelineNone"); container.appendChild(e); return; }
    items.forEach((it, ri) => {
      const realIdx = m.timeline.length - 1 - ri;
      const row = document.createElement("div"); row.className = "tl-row tl-" + (it.type || "event");
      const time = document.createElement("span"); time.className = "tl-time"; time.textContent = new Date(it.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const icon = document.createElement("span"); icon.className = "tl-icon"; icon.textContent = tlIcon(it.type);
      const body = document.createElement("div"); body.className = "tl-body";
      if (it.type === "cmd") { const code = document.createElement("code"); code.className = "tl-cmd"; code.textContent = it.text; body.appendChild(code); }
      else { body.textContent = it.text; }
      const del = document.createElement("button"); del.className = "tl-del"; del.textContent = "✕"; del.title = t("del");
      del.addEventListener("click", () => { m.timeline.splice(realIdx, 1); saveMachine(m.id, { timeline: m.timeline }); renderTimelineInto(container, m); });
      if (it.type === "cmd") { const cpy = document.createElement("button"); cpy.className = "tl-del"; cpy.textContent = "⧉"; cpy.title = t("copy"); cpy.addEventListener("click", () => copyText(applyIpToCode(it.text), () => toast(t("copied"), "ok"))); row.appendChild(time); row.appendChild(icon); row.appendChild(body); row.appendChild(cpy); row.appendChild(del); }
      else { row.appendChild(time); row.appendChild(icon); row.appendChild(body); row.appendChild(del); }
      container.appendChild(row);
    });
  }
  function buildTimelineSection(m) {
    m.timeline = m.timeline || [];
    const sec = document.createElement("div"); sec.className = "machine-section";
    const head = document.createElement("div"); head.className = "machine-section-head";
    head.innerHTML = '<h3>🕓 ' + t("timeline") + '</h3>';
    const clearBtn = document.createElement("button"); clearBtn.className = "btn btn-secondary btn-sm"; clearBtn.textContent = t("clearTimeline");
    clearBtn.addEventListener("click", () => { if (!m.timeline.length || !confirm(t("confirmClearTl"))) return; m.timeline = []; saveMachine(m.id, { timeline: m.timeline }); renderTimelineInto(body, m); });
    head.appendChild(clearBtn); sec.appendChild(head);
    const addRow = document.createElement("div"); addRow.className = "tl-add";
    const inp = document.createElement("input"); inp.className = "checklist-add-input"; inp.placeholder = t("timelineNotePh"); inp.setAttribute("aria-label", t("timelineAdd"));
    const addBtn = document.createElement("button"); addBtn.className = "btn btn-secondary btn-sm"; addBtn.textContent = t("timelineAdd");
    const addNote = () => { const v = inp.value.trim(); if (!v) return; m.timeline.push({ ts: Date.now(), type: "note", text: v }); saveMachine(m.id, { timeline: m.timeline }); inp.value = ""; renderTimelineInto(body, m); };
    addBtn.addEventListener("click", addNote); inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addNote(); } });
    addRow.appendChild(inp); addRow.appendChild(addBtn); sec.appendChild(addRow);
    const body = document.createElement("div"); body.className = "tl-list"; body.id = "tlBody"; sec.appendChild(body);
    renderTimelineInto(body, m);
    return sec;
  }

  // ── Evidence: paste/drop screenshots, captioned, stored via /api/upload ──
  function buildEvidenceSection(m) {
    m.evidence = m.evidence || [];
    const sec = document.createElement("div"); sec.className = "machine-section";
    sec.innerHTML = '<div class="machine-section-head"><h3>📸 ' + t("evidence") + '</h3></div>';
    const drop = document.createElement("div"); drop.className = "evidence-drop"; drop.tabIndex = 0; drop.textContent = t("evidenceDrop"); drop.setAttribute("aria-label", t("evidenceDrop"));
    const grid = document.createElement("div"); grid.className = "evidence-grid";
    sec.appendChild(drop); sec.appendChild(grid);
    const persist = () => saveMachine(m.id, { evidence: m.evidence });
    async function addImage(dataUrl) {
      try {
        const res = await api("POST", "/api/upload", { data: dataUrl });
        if (res && res.url) { m.evidence.push({ url: res.url, caption: "", ts: Date.now() }); persist(); renderGrid(); }
        else toast((res && res.error) || t("copyFail"), "error");
      } catch { toast(t("netErr"), "error"); }
    }
    function handleFiles(files) { Array.from(files || []).forEach(f => { if (!/^image\//.test(f.type)) return; const r = new FileReader(); r.onload = () => addImage(r.result); r.readAsDataURL(f); }); }
    function renderGrid() {
      grid.innerHTML = "";
      if (!m.evidence.length) { const e = document.createElement("p"); e.className = "machine-hosts-empty"; e.textContent = t("evidenceNone"); grid.appendChild(e); return; }
      m.evidence.forEach((ev, i) => {
        const fig = document.createElement("figure"); fig.className = "evidence-item";
        const img = document.createElement("img"); img.src = ev.url; img.loading = "lazy"; img.alt = ev.caption || "evidence";
        const cap = document.createElement("input"); cap.className = "evidence-caption"; cap.placeholder = t("evidenceCaption"); cap.value = ev.caption || ""; cap.addEventListener("input", () => { ev.caption = cap.value; persist(); });
        const del = document.createElement("button"); del.className = "evidence-del"; del.textContent = "✕"; del.title = t("evidenceDel"); del.addEventListener("click", () => { m.evidence.splice(i, 1); persist(); renderGrid(); });
        fig.appendChild(img); fig.appendChild(cap); fig.appendChild(del); grid.appendChild(fig);
      });
    }
    drop.addEventListener("dragover", e => { e.preventDefault(); drop.classList.add("drag"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("drag"));
    drop.addEventListener("drop", e => { e.preventDefault(); drop.classList.remove("drag"); handleFiles(e.dataTransfer.files); });
    drop.addEventListener("paste", e => { const items = (e.clipboardData || {}).items || []; Array.from(items).forEach(it => { if (it.type && it.type.indexOf("image") === 0) { const f = it.getAsFile(); if (f) { const r = new FileReader(); r.onload = () => addImage(r.result); r.readAsDataURL(f); } } }); });
    renderGrid();
    return sec;
  }

  function renderMachineDetail(m) {
    const page = document.createElement("div"); page.className = "machine-detail";
    // Reset to the Detail tab whenever a different machine is opened.
    if (machineTabFor !== m.id) { machineTab = "detail"; machineTabFor = m.id; }

    // Top bar
    const topbar = document.createElement("div"); topbar.className = "wu-editor-topbar";
    topbar.innerHTML = '<button class="wu-back-btn">← ' + t("back") + '</button>' +
      '<div class="wu-editor-status" id="machineStatus"></div>' +
      '<div class="wu-topbar-actions">' +
        '<button class="wu-delete-btn" title="' + t("del") + '" aria-label="' + t("del") + '">🗑</button>' +
      '</div>';
    topbar.querySelector(".wu-back-btn").addEventListener("click", () => { openMachineId = null; render(); });
    topbar.querySelector(".wu-delete-btn").addEventListener("click", () => deleteMachine(m.id));
    page.appendChild(topbar);

    // Tab switcher: live Detail workspace vs. the auto-generated Report.
    const tabs = document.createElement("div"); tabs.className = "machine-tabs"; tabs.setAttribute("role", "tablist");
    [["detail", "🧩 " + t("detailTab")], ["report", "📄 " + t("reportTab")]].forEach(([key, label]) => {
      const b = document.createElement("button"); b.className = "machine-tab" + (machineTab === key ? " active" : "");
      b.type = "button"; b.textContent = label; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", String(machineTab === key));
      b.addEventListener("click", () => { if (machineTab !== key) { machineTab = key; machineTabFor = m.id; render(); } });
      tabs.appendChild(b);
    });
    page.appendChild(tabs);

    if (machineTab === "report") { renderMachineReport(m, page); contentArea.appendChild(page); return; }

    // Active-target banner — copied commands log to this box's timeline
    page.appendChild(buildActiveTargetBar(m));

    // Header with editable name / IP / OS + metadata chips (platform/difficulty/status/tags)
    const info = document.createElement("div"); info.className = "machine-info-section";
    const platOpts = MACHINE_PLATFORMS.map(p => '<option value="' + p + '"' + ((m.platform || "Custom") === p ? " selected" : "") + '>' + p + '</option>').join("");
    const diffOpts = '<option value="">—</option>' + MACHINE_DIFFS.map(d => '<option value="' + d + '"' + (m.difficulty === d ? " selected" : "") + '>' + escapeHtml(diffLabel(d)) + '</option>').join("");
    const statOpts = MACHINE_STATUSES.map(v => '<option value="' + v + '"' + (machineStatus(m) === v ? " selected" : "") + '>' + escapeHtml(stLabel(v)) + '</option>').join("");
    info.innerHTML =
      '<div class="machine-detail-header">' +
        '<span class="machine-detail-icon">' + osIconFor(m.os) + '</span>' +
        '<div class="machine-detail-meta">' +
          '<input class="machine-detail-name-input" data-k="name" value="' + escapeHtml(m.name) + '" aria-label="' + t("machineName") + '">' +
          '<div class="machine-meta-fields">' +
            '<input class="machine-meta-input" data-k="ip" placeholder="IP" value="' + escapeHtml(m.ip || "") + '" aria-label="IP">' +
            '<input class="machine-meta-input" data-k="os" placeholder="OS" value="' + escapeHtml(m.os || "") + '" aria-label="OS">' +
          '</div>' +
          '<div class="machine-meta-chips">' +
            '<label class="machine-chip-field"><span>' + t("mPlatform") + '</span><select class="form-select machine-chip-sel" data-sk="platform">' + platOpts + '</select></label>' +
            '<label class="machine-chip-field"><span>' + t("mDifficulty") + '</span><select class="form-select machine-chip-sel" data-sk="difficulty">' + diffOpts + '</select></label>' +
            '<label class="machine-chip-field"><span>' + t("mStatus") + '</span><select class="form-select machine-chip-sel" data-sk="status">' + statOpts + '</select></label>' +
          '</div>' +
          '<div class="machine-tags-row">' + (m.tags || []).map(tg => '<span class="machine-tag">' + escapeHtml(tg) + '</span>').join("") + '<button class="wu-edit-tags-btn machine-edit-tags">✎ ' + t("wuTags").toLowerCase() + '</button></div>' +
        '</div>' +
      '</div>';
    info.querySelectorAll(".machine-meta-input, .machine-detail-name-input").forEach(inp => inp.addEventListener("input", () => {
      m[inp.dataset.k] = inp.value; const patch = {}; patch[inp.dataset.k] = inp.value;
      saveMachine(m.id, patch); showMachineStatus();
    }));
    info.querySelectorAll(".machine-chip-sel").forEach(sel => sel.addEventListener("change", () => {
      const k = sel.dataset.sk; m[k] = sel.value;
      const patch = {}; patch[k] = sel.value;
      Object.assign(patch, machineAutoProgress(m)); // stamp startedAt/ownedAt & auto-advance
      saveMachine(m.id, patch); render();
    }));
    info.querySelector(".machine-edit-tags").addEventListener("click", () => {
      openModal(t("wuEditTags"), [{ key: "tags", label: t("wuTags"), placeholder: t("mTagsHint") }],
        { tags: (m.tags || []).join(", ") },
        async fd => { m.tags = fd.tags.split(",").map(s => s.trim()).filter(Boolean); await api("PUT", "/api/machines/" + m.id, { tags: m.tags }); await loadMachines(); render(); });
    });
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
    const startedTs = m.startedAt || m.createdAt;
    const timingHtml =
      '<div class="machine-timing">' +
        '<span>⏱ ' + t("started") + ': <strong>' + (startedTs ? new Date(startedTs).toLocaleString() : "—") + '</strong></span>' +
        (m.ownedAt
          ? '<span>👑 ' + t("timeToOwn") + ': <strong>' + fmtElapsed(startedTs, m.ownedAt) + '</strong></span>'
          : '<span>⏳ ' + t("elapsed") + ': <strong>' + fmtElapsed(startedTs, null) + '</strong></span>') +
      '</div>';
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
        timingHtml +
        (nextItems.length ? '<div class="machine-nextsteps"><span class="machine-nextsteps-label">' + t("nextSteps") + '</span><ul>' + nextItems.map(it => '<li>' + escapeHtml(it.label) + '</li>').join("") + '</ul></div>' : '');
      page.appendChild(overview);
    } else {
      const timing = document.createElement("div"); timing.className = "machine-overview"; timing.innerHTML = timingHtml;
      page.appendChild(timing);
    }

    // ── Flag capture (user / root) ──
    const flagSection = document.createElement("div"); flagSection.className = "machine-section machine-flags";
    flagSection.innerHTML = '<h3>🚩 ' + t("flags") + '</h3>';
    [["userFlag", "🚩", t("userFlag")], ["rootFlag", "👑", t("rootFlag")]].forEach(([fk, icon, label]) => {
      const f = m[fk] || { value: "", capturedAt: null };
      const row = document.createElement("div"); row.className = "flag-row" + (f.capturedAt ? " captured" : "");
      row.innerHTML =
        '<span class="flag-icon" aria-hidden="true">' + icon + '</span>' +
        '<span class="flag-label">' + label + '</span>' +
        '<input class="machine-meta-input flag-input" placeholder="' + label + '" value="' + escapeHtml(f.value || "") + '" aria-label="' + label + '">' +
        '<span class="flag-time">' + (f.capturedAt ? t("capturedAt") + " " + new Date(f.capturedAt).toLocaleString() : t("notCaptured")) + '</span>';
      const inp = row.querySelector(".flag-input");
      inp.addEventListener("input", () => {
        const val = inp.value.trim();
        m[fk] = { value: inp.value, capturedAt: val ? ((m[fk] && m[fk].capturedAt) || new Date().toISOString()) : null };
        const patch = {}; patch[fk] = m[fk];
        // Keep the matching checklist item in sync so progress reflects the flag.
        const re = fk === "userFlag" ? /user-?flag|local\.txt|user\.txt/i : /root-?flag|proof\.txt|root\.txt/i;
        const it = (m.checklist || []).find(c => re.test((c.id || "") + " " + (c.label || "")));
        if (it) { it.done = !!val; patch.checklist = m.checklist; }
        Object.assign(patch, machineAutoProgress(m));
        saveMachine(m.id, patch);
        row.classList.toggle("captured", !!val);
        row.querySelector(".flag-time").textContent = m[fk].capturedAt ? t("capturedAt") + " " + new Date(m[fk].capturedAt).toLocaleString() : t("notCaptured");
        updateProgressUI(); showMachineStatus();
      });
      flagSection.appendChild(row);
    });
    page.appendChild(flagSection);

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
        ph.innerHTML = '<span class="checklist-phase-name">' + escapeHtml(g.phase) + '</span>' +
          '<span class="checklist-phase-right"><span class="checklist-phase-count">' + gDone + '/' + g.items.length + '</span>' +
          '<button class="checklist-phase-copy" title="' + t("copyPhaseCmds") + '" aria-label="' + t("copyPhaseCmds") + '">⧉</button></span>';
        ph.querySelector(".checklist-phase-copy").addEventListener("click", ev => {
          ev.stopPropagation();
          const cmds = g.items.map(({ item }) => item.hint).filter(Boolean).map(applyIpToCode);
          if (!cmds.length) { toast(t("noPhaseCmds"), "error"); return; }
          copyText("# " + g.phase + "\n" + cmds.join("\n"), () => { announce(t("copied")); toast(t("copied"), "ok"); });
        });
        phaseWrap.appendChild(ph);
        g.items.forEach(({ item, i }) => {
          const row = document.createElement("div"); row.className = "checklist-item" + (item.done ? " done" : "");
          const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!item.done; cb.id = "ck-" + m.id + "-" + i;
          cb.addEventListener("change", () => {
            m.checklist[i].done = cb.checked;
            const patch = { checklist: m.checklist };
            Object.assign(patch, machineAutoProgress(m)); // first tick stamps startedAt / advances status
            saveMachine(m.id, patch);
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
          const del = document.createElement("button"); del.className = "checklist-item-del"; del.textContent = "✕"; del.title = t("delItem"); del.setAttribute("aria-label", t("delItem"));
          del.addEventListener("click", ev => {
            ev.stopPropagation();
            m.checklist.splice(i, 1);
            saveMachine(m.id, { checklist: m.checklist });
            render();
          });
          row.appendChild(cb); row.appendChild(body); row.appendChild(del);
          phaseWrap.appendChild(row);
        });
        // Add a custom item to this phase.
        const addRow = document.createElement("div"); addRow.className = "checklist-add";
        const addInp = document.createElement("input"); addInp.className = "checklist-add-input"; addInp.placeholder = t("customItemPh"); addInp.setAttribute("aria-label", t("customItemPh"));
        const addBtn = document.createElement("button"); addBtn.className = "btn btn-secondary btn-sm"; addBtn.textContent = t("addChecklistItem");
        const addItem = () => {
          const label = addInp.value.trim(); if (!label) return;
          m.checklist.push({ id: "custom-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), label, hint: "", phase: g.phase, done: false });
          saveMachine(m.id, { checklist: m.checklist });
          render();
        };
        addBtn.addEventListener("click", addItem);
        addInp.addEventListener("keydown", ev => { if (ev.key === "Enter") { ev.preventDefault(); addItem(); } });
        addRow.appendChild(addInp); addRow.appendChild(addBtn);
        phaseWrap.appendChild(addRow);
        checkSection.appendChild(phaseWrap);
      });
      page.appendChild(checkSection);
    }

    // ── AD / network engagement — hosts are real machines linked by machineId ──
    m.hosts = m.hosts || [];
    let redrawSchem = null;
    const hostPersist = () => { saveMachine(m.id, { hosts: m.hosts }); showMachineStatus(); };
    function removeHost(nodeId) {
      if (!confirm(lang === "tr" ? "Bu host operasyondan çıkarılsın mı? (Makinenin kendisi silinmez)" : "Remove this host from the engagement? (The machine itself is kept.)")) return;
      m.hosts = m.hosts.filter(h => (h.machineId || h.id) !== nodeId);
      if (openHostId === nodeId) openHostId = null;
      saveMachine(m.id, { hosts: m.hosts }); render();
    }

    function buildHostCard(h) {
      const n = hostNode(h);
      const st = checklistStats(n.checklist);
      const card = document.createElement("div"); card.className = "host-card" + (st.pct >= 100 ? " owned" : "") + (n.id === openHostId ? " open" : ""); card.id = "host-" + n.id;
      const head = document.createElement("div"); head.className = "host-card-head";
      head.innerHTML =
        '<span class="host-icon" aria-hidden="true">' + (isDcRole(n) ? "★" : osIconFor(n.os)) + '</span>' +
        '<span class="host-title">' + escapeHtml(n.name || "(host)") + '</span>' +
        '<span class="host-ip">' + escapeHtml(n.ip || "") + '</span>' +
        (n.role ? '<span class="host-role">' + escapeHtml(n.role) + '</span>' : '') +
        (n.ref ? '<span class="host-badge">machine</span>' : '') +
        '<span class="host-prog">' + (n.checklist.length ? st.done + "/" + st.total + " · " + st.pct + "%" : "—") + '</span>' +
        '<button class="host-expand" aria-label="Toggle">' + (n.id === openHostId ? "▲" : "▼") + '</button>' +
        '<button class="host-del" title="Remove from engagement" aria-label="Remove host">🗑</button>';
      head.querySelector(".host-del").addEventListener("click", e => { e.stopPropagation(); removeHost(n.id); });
      head.addEventListener("click", e => { if (e.target.closest(".host-del")) return; openHostId = (openHostId === n.id) ? null : n.id; render(); });
      card.appendChild(head);
      if (n.id !== openHostId) return card;

      const body = document.createElement("div"); body.className = "host-card-body";
      if (n.ref && n.dangling) {
        const w = document.createElement("p"); w.className = "machine-hosts-empty"; w.textContent = lang === "tr" ? "Bağlı makine silinmiş — host'u çıkarın." : "Linked machine was deleted — remove this host.";
        body.appendChild(w); card.appendChild(body); return card;
      }

      // Meta: machine fields (ref) live on the machine; role lives on the host entry.
      const meta = document.createElement("div"); meta.className = "host-meta";
      if (n.ref) {
        meta.innerHTML =
          '<input class="host-f" data-mk="name" placeholder="hostname" value="' + escapeHtml(n.machine.name || "") + '" aria-label="hostname">' +
          '<input class="host-f" data-mk="ip" placeholder="ip" value="' + escapeHtml(n.machine.ip || "") + '" aria-label="ip">' +
          '<input class="host-f" data-mk="os" placeholder="os" value="' + escapeHtml(n.machine.os || "") + '" aria-label="os">' +
          '<input class="host-f" data-hk="role" placeholder="role (DC, SQL…)" value="' + escapeHtml(n.role || "") + '" aria-label="role">';
        meta.querySelectorAll("[data-mk]").forEach(inp => inp.addEventListener("input", () => { n.machine[inp.dataset.mk] = inp.value; saveMachine(n.machineId || n.id, { [inp.dataset.mk]: inp.value }); if (redrawSchem) redrawSchem(); }));
        meta.querySelector("[data-hk]").addEventListener("input", e => { h.role = e.target.value; hostPersist(); });
        const open = document.createElement("button"); open.className = "btn btn-secondary btn-sm host-open-btn"; open.textContent = "↗ " + (lang === "tr" ? "Makineyi aç" : "Open machine");
        open.addEventListener("click", () => { openHostId = null; openMachineId = n.id; render(); window.scrollTo({ top: 0, behavior: motionBehavior() }); });
        body.appendChild(meta); body.appendChild(open);
      } else {
        meta.innerHTML =
          '<input class="host-f" data-k="name" placeholder="hostname" value="' + escapeHtml(h.name || "") + '" aria-label="hostname">' +
          '<input class="host-f" data-k="ip" placeholder="ip" value="' + escapeHtml(h.ip || "") + '" aria-label="ip">' +
          '<input class="host-f" data-k="os" placeholder="os" value="' + escapeHtml(h.os || "") + '" aria-label="os">' +
          '<input class="host-f" data-k="role" placeholder="role (DC, SQL…)" value="' + escapeHtml(h.role || "") + '" aria-label="role">';
        meta.querySelectorAll(".host-f").forEach(inp => inp.addEventListener("input", () => { h[inp.dataset.k] = inp.value; hostPersist(); if (redrawSchem) redrawSchem(); }));
        body.appendChild(meta);
      }

      // Playbook — for refs it applies to the machine; for legacy hosts to the entry.
      const pbRow = document.createElement("div"); pbRow.className = "machine-playbook-row";
      const sel = document.createElement("select"); sel.className = "form-select"; sel.setAttribute("aria-label", t("playbook"));
      const curTpl = n.ref ? (n.machine.template || "") : (h.template || "");
      sel.innerHTML = '<option value="">' + t("defaultChecklist") + '</option>' + machineTemplates().map(tp => '<option value="' + tp.id + '"' + (curTpl === tp.id ? " selected" : "") + '>' + tp.icon + " " + escapeHtml(tp.name) + '</option>').join("");
      sel.addEventListener("change", () => {
        const id = sel.value;
        if (n.checklist.some(c => c.done) && !confirm(t("replacePlaybook"))) { sel.value = curTpl; return; }
        const cl = id ? templateToChecklist(templateById(id)) : [];
        if (n.ref) { n.machine.template = id; n.machine.checklist = cl; saveMachine(n.machineId || n.id, { template: id, checklist: cl }); }
        else { h.template = id; h.checklist = cl; hostPersist(); }
        render();
      });
      pbRow.innerHTML = '<span class="machine-playbook-label">📖 ' + t("playbook") + '</span>';
      pbRow.appendChild(sel); body.appendChild(pbRow);

      // Checklist — editing a ref's checklist updates the machine, so progress
      // shows on the node ring, the engagement overview AND the main Machines list.
      if (n.checklist.length) {
        body.appendChild(buildChecklistBlock(n.checklist, () => {
          if (n.ref) saveMachine(n.machineId || n.id, { checklist: n.machine.checklist }); else hostPersist();
          const s2 = checklistStats(n.checklist);
          const hp = head.querySelector(".host-prog"); if (hp) hp.textContent = s2.done + "/" + s2.total + " · " + s2.pct + "%";
          card.classList.toggle("owned", s2.pct >= 100);
          if (redrawSchem) redrawSchem();
        }));
      }

      // Connections (also editable directly on the graph via Connect mode)
      const others = (m.hosts || []).map(hostNode).filter(o => o.id !== n.id);
      if (others.length) {
        const conn = document.createElement("div"); conn.className = "host-conn";
        conn.innerHTML = '<div class="machine-subhead">🔗 ' + t("connections") + '</div>';
        const chips = document.createElement("div"); chips.className = "host-chips";
        others.forEach(o => {
          const chip = document.createElement("button"); chip.className = "host-chip" + ((h.links || []).indexOf(o.id) >= 0 ? " on" : ""); chip.textContent = o.name || o.ip || "host";
          chip.addEventListener("click", () => {
            h.links = h.links || []; const i = h.links.indexOf(o.id); if (i >= 0) h.links.splice(i, 1); else h.links.push(o.id);
            chip.classList.toggle("on"); saveMachine(m.id, { hosts: m.hosts }); if (redrawSchem) redrawSchem();
          });
          chips.appendChild(chip);
        });
        conn.appendChild(chips); body.appendChild(conn);
      }

      // Loot + notes (stored on the machine for refs)
      const lootLabel = document.createElement("div"); lootLabel.className = "machine-subhead"; lootLabel.textContent = "🔑 " + t("loot");
      const loot = document.createElement("textarea"); loot.className = "machine-textarea"; loot.placeholder = "admin:Pass | svc_sql: hash | ticket.kirbi";
      loot.value = n.ref ? credsToText(n.machine.credentials) : (h.loot || "");
      loot.addEventListener("input", () => { if (n.ref) { n.machine.credentials = loot.value.split("\n").filter(Boolean); saveMachine(n.machineId || n.id, { credentials: n.machine.credentials }); } else { h.loot = loot.value; hostPersist(); } });
      body.appendChild(lootLabel); body.appendChild(loot);

      const notesLabel = document.createElement("div"); notesLabel.className = "machine-subhead"; notesLabel.textContent = "📝 " + t("notes");
      const notes = document.createElement("textarea"); notes.className = "machine-textarea";
      notes.value = n.ref ? (n.machine.notes || "") : (h.notes || "");
      notes.addEventListener("input", () => { if (n.ref) { n.machine.notes = notes.value; saveMachine(n.machineId || n.id, { notes: notes.value }); } else { h.notes = notes.value; hostPersist(); } });
      body.appendChild(notesLabel); body.appendChild(notes);

      card.appendChild(body);
      return card;
    }

    const adSection = document.createElement("div"); adSection.className = "machine-section ad-section";
    const adHead = document.createElement("div"); adHead.className = "machine-section-head";
    adHead.innerHTML = '<h3>🖧 ' + t("hosts") + ' <span class="ad-sub">· ' + t("engagement") + '</span></h3>';
    const addWrap = document.createElement("div"); addWrap.className = "ad-add";
    const fromSel = document.createElement("select"); fromSel.className = "form-select"; fromSel.setAttribute("aria-label", t("fromMachine"));
    const linkedIds = new Set((m.hosts || []).map(h => h.machineId).filter(Boolean));
    fromSel.innerHTML = '<option value="">' + t("fromMachine") + '</option>' + machines.filter(x => x.id !== m.id && !linkedIds.has(x.id)).map(x => '<option value="' + x.id + '">' + escapeHtml(x.name) + (x.ip ? " (" + escapeHtml(x.ip) + ")" : "") + '</option>').join("");
    const newBtn = document.createElement("button"); newBtn.className = "btn btn-secondary btn-sm"; newBtn.textContent = t("newHost");
    addWrap.appendChild(fromSel); addWrap.appendChild(newBtn); adHead.appendChild(addWrap);
    adSection.appendChild(adHead);

    fromSel.addEventListener("change", () => {
      const id = fromSel.value; fromSel.value = "";
      if (!id) return;
      m.hosts.push({ machineId: id, role: "", links: [] });
      openHostId = id; saveMachine(m.id, { hosts: m.hosts }); render();
    });
    newBtn.addEventListener("click", () => {
      const tplOpts = [{ value: "", label: t("defaultChecklist") }].concat(machineTemplates().map(tpl => ({ value: tpl.id, label: tpl.icon + " " + tpl.name })));
      openModal(t("newHost"), [
        { key: "name", label: t("machineName"), placeholder: "e.g., DC01" },
        { key: "ip", label: t("machineIP"), placeholder: "10.10.10.2" },
        { key: "os", label: t("machineOS"), placeholder: "Windows / Linux" },
        { key: "role", label: t("hostRole"), placeholder: "DC, SQL, Web…" },
        { key: "template", label: t("playbook"), type: "select", options: tplOpts }
      ], {}, async fd => {
        const created = await api("POST", "/api/machines", { name: fd.name, ip: fd.ip, os: fd.os });
        if (!created || !created.id) return;
        const tpl = fd.template ? templateById(fd.template) : null;
        if (tpl) await api("PUT", "/api/machines/" + created.id, { template: tpl.id, checklist: templateToChecklist(tpl) });
        m.hosts.push({ machineId: created.id, role: fd.role || "", links: [] });
        await api("PUT", "/api/machines/" + m.id, { hosts: m.hosts });
        await loadMachines(); openHostId = created.id; render();
      });
    });

    if (!m.hosts.length) {
      const e = document.createElement("p"); e.className = "machine-hosts-empty"; e.textContent = t("noHosts"); adSection.appendChild(e);
    } else {
      const nodes = m.hosts.map(hostNode);
      let aggT = 0, aggD = 0, owned = 0;
      nodes.forEach(n => { const s = checklistStats(n.checklist); aggT += s.total; aggD += s.done; if (s.pct >= 100) owned++; });
      const aggPct = aggT ? Math.round(aggD / aggT * 100) : 0;
      const ov = document.createElement("div"); ov.className = "ad-overview";
      ov.innerHTML =
        '<span class="ad-stat"><strong>' + nodes.length + '</strong> ' + t("hosts").toLowerCase() + '</span>' +
        '<span class="ad-stat"><strong>' + owned + '</strong> ' + t("owned").toLowerCase() + '</span>' +
        '<span class="ad-stat"><strong>' + aggPct + '%</strong> ' + t("progress").toLowerCase() + '</span>';
      const connBtn = document.createElement("button"); connBtn.className = "btn btn-sm ad-connect-btn " + (adConnectMode ? "btn-primary" : "btn-secondary"); connBtn.textContent = "🔗 " + t("connect");
      connBtn.addEventListener("click", () => { adConnectMode = !adConnectMode; adConnectSel = null; render(); });
      ov.appendChild(connBtn);
      adSection.appendChild(ov);

      if (adConnectMode) { const hint = document.createElement("div"); hint.className = "ad-connect-hint"; hint.textContent = t("connectHint"); adSection.appendChild(hint); }

      const schemWrap = document.createElement("div"); schemWrap.className = "ad-schematic-wrap";
      const onNode = (node) => {
        if (adConnectMode) {
          if (!adConnectSel) adConnectSel = node.id;
          else if (adConnectSel === node.id) adConnectSel = null;
          else {
            const src = m.hosts.find(h => (h.machineId || h.id) === adConnectSel);
            if (src) { src.links = src.links || []; const i = src.links.indexOf(node.id); if (i >= 0) src.links.splice(i, 1); else src.links.push(node.id); saveMachine(m.id, { hosts: m.hosts }); }
            adConnectSel = null;
          }
          redrawSchem();
        } else { openHostId = (openHostId === node.id) ? null : node.id; render(); }
      };
      redrawSchem = () => { schemWrap.innerHTML = ""; schemWrap.appendChild(buildAdSchematic(m, onNode)); };
      redrawSchem();
      adSection.appendChild(schemWrap);
      if (!adConnectMode) { const dh = document.createElement("div"); dh.className = "ad-drag-hint"; dh.textContent = t("dragHint"); adSection.appendChild(dh); }

      const cards = document.createElement("div"); cards.className = "host-cards";
      m.hosts.forEach(h => cards.appendChild(buildHostCard(h)));
      adSection.appendChild(cards);
    }

    const objLabel = document.createElement("div"); objLabel.className = "machine-subhead"; objLabel.textContent = "🧭 " + t("objective");
    const objArea = document.createElement("textarea"); objArea.className = "machine-textarea";
    objArea.placeholder = "user@host1 -> kerberoast svc -> WriteDACL -> DCSync -> DA";
    objArea.value = m.attackPath || "";
    objArea.addEventListener("input", () => { m.attackPath = objArea.value; saveMachine(m.id, { attackPath: m.attackPath }); showMachineStatus(); });
    adSection.appendChild(objLabel); adSection.appendChild(objArea);
    page.appendChild(adSection);

    // Services — structured table + nmap import + quick-scan chips
    page.appendChild(buildServicesSection(m));

    // Credentials — structured vault
    page.appendChild(buildCredsSection(m));

    // Activity timeline (auto-logged copies + manual notes)
    page.appendChild(buildTimelineSection(m));

    // Evidence — screenshots
    page.appendChild(buildEvidenceSection(m));

    // Notes
    const noteSection = document.createElement("div"); noteSection.className = "machine-section";
    noteSection.innerHTML = '<h3>📝 ' + t("notes") + '</h3>';
    const noteArea = document.createElement("textarea"); noteArea.className = "machine-textarea machine-notes-area";
    noteArea.placeholder = lang === "tr" ? "Makine notlari..." : "Machine notes...";
    noteArea.value = m.notes || "";
    noteArea.addEventListener("input", () => { m.notes = noteArea.value; saveMachine(m.id, { notes: m.notes }); showMachineStatus(); });
    noteSection.appendChild(noteArea); page.appendChild(noteSection);

    contentArea.appendChild(page);

    function showMachineStatus() {
      const st = document.getElementById("machineStatus");
      if (st) { st.textContent = "saving..."; clearTimeout(st._t); st._t = setTimeout(() => st.textContent = "\u2713 saved", 600); }
    }
  }

  // ── Import/Export ──
  $("exportBtn").addEventListener("click", async () => {
    const a = document.createElement("a");
    a.download = "cheat-sheet-backup.json";
    if (window.CS_STATIC && window.CS_BACKEND) {
      // No server endpoint to link to — build the bundle from the local backend.
      const bundle = await window.CS_BACKEND.exportBundle();
      a.href = URL.createObjectURL(new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" }));
      a.click(); URL.revokeObjectURL(a.href);
    } else {
      a.href = "/api/export"; a.click();
    }
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

  // ── Tag Filter (multi-select: chips toggle independently; "All" clears) ──
  function syncTagChips() {
    tagFilters.querySelectorAll(".tag-filter").forEach(b => {
      const tag = b.dataset.tag;
      if (tag === "all") b.classList.toggle("active", activeTags.size === 0);
      else b.classList.toggle("active", activeTags.has(tag));
    });
  }
  tagFilters.querySelectorAll(".tag-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag;
      if (tag === "all") activeTags.clear();
      else { if (activeTags.has(tag)) activeTags.delete(tag); else activeTags.add(tag); }
      syncTagChips();
      render();
    });
  });

  // ── Drag & Drop (categories) ──
  function handleDragStart(e, idx) { dragSrcCatIdx = idx; e.dataTransfer.effectAllowed = "move"; e.target.classList.add("dragging"); }
  function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }
  async function handleDrop(e, targetIdx) {
    e.preventDefault();
    if (dragSrcCatIdx === null || dragSrcCatIdx === targetIdx) return;
    const order = CATEGORIES.map(c => c.id);
    const [moved] = order.splice(dragSrcCatIdx, 1);
    order.splice(targetIdx, 0, moved);
    // Dedicated reorder endpoint (was overloading /api/import with the whole DB).
    await api("POST", "/api/categories/reorder", { order });
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
    const fav = isFav(cmd);
    const tagsH = (cmd.tags || []).map(t => '<span class="cmd-tag ' + String(t).replace(/[^a-z0-9_-]/gi, "") + '">' + escapeHtml(t) + '</span>').join("");
    const hdr = document.createElement("div"); hdr.className = "cmd-card-header";
    hdr.innerHTML = '<div class="cmd-title">' + hl(cmd.title) + '</div>' +
      '<div class="cmd-header-actions">' + tagsH +
      '<button class="cmd-action-btn fav-btn' + (fav ? " fav-active" : "") + '" data-fav="' + (cmd.id || "") + '" title="Favorite">★</button>' +
      '<button class="cmd-action-btn edit-btn" title="Edit">✎</button>' +
      '<button class="cmd-action-btn delete-btn" title="Delete">✕</button></div>';
    hdr.querySelector(".fav-btn").addEventListener("click", e => { e.stopPropagation(); toggleFav(cmd); });
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
    const bk = document.createElement("button"); bk.className = "cmd-basket-btn"; bk.textContent = "🧺"; bk.title = t("basketAdd"); bk.setAttribute("aria-label", t("basketAdd"));
    bk.addEventListener("click", e => { e.stopPropagation(); basketAdd(code); });
    w.appendChild(c); w.appendChild(b); w.appendChild(bk); return w;
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
    if (tagFilterActive()) r = r.filter(cmdMatchesTags);
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
  function isFiltering() { return tagFilterActive() || !!searchQuery; }

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
      if (tagFilterActive()) favs = favs.filter(f => cmdMatchesTags(f.cmd));
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
        : (tagFilterActive() ? t("allCommands") + " · " + [...activeTags].join(", ") : t("allCommands"));
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
  async function exportWriteupMd(wu) {
    let md = "# " + wu.title + "\n\n";
    md += "**Tags:** " + (wu.tags || []).join(", ") + "\n";
    md += "**Date:** " + new Date(wu.updatedAt).toLocaleString() + "\n\n---\n\n";
    md += wu.content || "";
    // Self-contained MD: inline /uploads images as base64 data URIs (like HTML export).
    md = await inlineUploadsText(md);
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (wu.title || "writeup").replace(/[^a-z0-9]/gi, "_") + ".md";
    a.click(); URL.revokeObjectURL(a.href);
  }
  // Shared print/standalone stylesheet — selectors match the renderMarkdown output.
  // Reused by both PDF (print window) and HTML (standalone file) export paths.
  const WU_PRINT_CSS =
    "body{font-family:'Segoe UI',Arial,sans-serif;max-width:820px;margin:36px auto;padding:0 24px;line-height:1.6;color:#1a1a1a}" +
    "h1{border-bottom:3px solid #6366f1;padding-bottom:8px;font-size:26px}" +
    "h2{border-bottom:1px solid #ccc;padding-bottom:4px;margin-top:28px;font-size:20px}" +
    "h3{margin-top:20px;font-size:16px}h4,h5,h6{margin-top:14px}" +
    ".wu-code-wrap{margin:12px 0}.wu-code-head{display:flex;justify-content:space-between;align-items:center;background:#ececf2;border:1px solid #e5e5ea;border-bottom:none;border-radius:6px 6px 0 0;padding:3px 10px;font-size:11px;color:#555}.wu-code-wrap pre{margin:0;border-radius:0 0 6px 6px}" +
    "pre{background:#f5f5f7;padding:12px;border-radius:6px;overflow-x:auto;font-size:12.5px;border:1px solid #e5e5ea;white-space:pre-wrap;word-break:break-word}" +
    "code{background:#f5f5f7;padding:2px 5px;border-radius:4px;font-size:12.5px;font-family:Consolas,monospace}pre code{background:none;padding:0}" +
    "table{border-collapse:collapse;width:100%;margin:12px 0;font-size:13px}" +
    "th,td{border:1px solid #d0d0d5;padding:7px 10px;text-align:left;vertical-align:top}th{background:#f0f0f4}" +
    "del{color:#999}blockquote{border-left:3px solid #ccc;margin:10px 0;padding:4px 14px;color:#555}" +
    "a{color:#4338ca}img{max-width:100%;border:1px solid #e5e5ea;border-radius:4px;margin:8px 0}" +
    ".meta{color:#666;font-size:13px;margin-bottom:20px}hr{border:none;border-top:1px solid #ddd;margin:18px 0}" +
    "ul,ol{margin:8px 0 8px 22px}" +
    "@media print{a{color:#000;text-decoration:none}.wu-code-head,.wu-code-copy{display:none}pre,table,blockquote,.wu-code-wrap{break-inside:avoid}h1,h2,h3{break-after:avoid}}";
  function wuMetaHtml(wu) {
    return '<div class="meta">' + t("wuTags") + ": " + (wu.tags || []).map(escapeHtml).join(", ") +
      " &nbsp;|&nbsp; " + escapeHtml(new Date(wu.updatedAt).toLocaleString()) +
      " &nbsp;|&nbsp; " + wuReadMins(wu.content) + " " + t("wuMin") + "</div><hr>";
  }
  function exportWriteupPdf(wu) {
    const win = window.open("", "_blank");
    if (!win) { toast(t("copyFail"), "error"); return; }
    let html = "<!DOCTYPE html><html lang='" + lang + "'><head><meta charset='utf-8'><title>" + escapeHtml(wu.title) + "</title><style>" + WU_PRINT_CSS + "</style></head><body>";
    html += "<h1>" + escapeHtml(wu.title) + "</h1>" + wuMetaHtml(wu);
    html += renderMarkdown(wu.content || "");
    html += "</body></html>";
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  }
  // Inline every /uploads/... image as a base64 data URI so an exported HTML file
  // is fully self-contained (works when opened away from the server). Best-effort:
  // a fetch that fails leaves the original URL untouched.
  // Replace every /uploads/... reference (in HTML attributes OR markdown links)
  // with a base64 data URI so the exported file is fully self-contained.
  async function inlineUploadsText(text) {
    const urls = Array.from(new Set(text.match(/\/uploads\/[A-Za-z0-9._-]+/g) || []));
    for (const u of urls) {
      try {
        const res = await fetch(u); if (!res.ok) continue;
        const blob = await res.blob();
        const dataUri = await new Promise((resolve, reject) => { const fr = new FileReader(); fr.onload = () => resolve(fr.result); fr.onerror = reject; fr.readAsDataURL(blob); });
        text = text.split(u).join(dataUri);
      } catch { /* leave the URL as-is */ }
    }
    return text;
  }
  function inlineUploads(html) { return inlineUploadsText(html); }
  async function exportWriteupHtml(wu) {
    let html = "<!DOCTYPE html><html lang='" + lang + "'><head><meta charset='utf-8'>" +
      "<meta name='viewport' content='width=device-width,initial-scale=1'>" +
      "<title>" + escapeHtml(wu.title) + "</title><style>" + WU_PRINT_CSS + "</style></head><body>" +
      "<h1>" + escapeHtml(wu.title) + "</h1>" + wuMetaHtml(wu) + renderMarkdown(wu.content || "") + "</body></html>";
    html = await inlineUploads(html);
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (wu.title || "writeup").replace(/[^a-z0-9]/gi, "_") + ".html";
    a.click(); URL.revokeObjectURL(a.href);
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
    logToActiveTarget(text);
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
  // Jump straight to a specific machine / write-up (opens its detail/editor view).
  function navToMachine(id) { closePalette(); activeCategory = "machines"; openMachineId = id; openWriteupId = null; searchQuery = ""; searchInput.value = ""; render(); window.scrollTo({ top: 0, behavior: motionBehavior() }); }
  function navToWriteup(id) { closePalette(); activeCategory = "writeups"; openWriteupId = id; openMachineId = null; wuEditMode = false; searchQuery = ""; searchInput.value = ""; render(); window.scrollTo({ top: 0, behavior: motionBehavior() }); }
  function buildPaletteBase() {
    const items = [];
    const act = (icon, label, run, sub, extraHay) => items.push({ type: "action", icon, label, sub, hay: (label + " " + (extraHay || "")).toLowerCase(), run });
    act("📋", t("goto") + ": " + t("allCommands"), () => navTo(null));
    act("⭐", t("goto") + ": " + t("favorites"), () => navTo("favs"));
    act("📝", t("goto") + ": " + t("writeups"), () => navTo("writeups"));
    act("🖥", t("goto") + ": " + t("machines"), () => navTo("machines"));
    act("🕘", t("goto") + ": " + t("history"), () => navTo("history"));
    CATEGORIES.forEach(cat => { const nm = (lang === "tr" && cat.name_tr) ? cat.name_tr : cat.name; act(cat.icon, t("goto") + ": " + nm, () => navTo(cat.id)); });
    // Machines + write-ups are first-class jump targets, searchable by name/ip/os/tags/title.
    machines.forEach(mm => act(osIconFor(mm.os), mm.name, () => navToMachine(mm.id),
      t("jumpMachine") + " · " + (mm.ip || "—") + (mm.platform ? " · " + mm.platform : ""),
      [mm.ip, mm.os, mm.platform].concat(mm.tags || []).filter(Boolean).join(" ")));
    writeups.forEach(wu => act("📄", wu.title, () => navToWriteup(wu.id),
      t("jumpWriteup") + ((wu.tags || []).length ? " · " + wu.tags.join(", ") : ""),
      (wu.tags || []).join(" ")));
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
    if (activeCategory === "machines") return openMachineId ? "machines/" + openMachineId : "machines";
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
    let target = null, mid = null;
    if (raw === "favorites" || raw === "favs") target = "favs";
    else if (raw === "writeups") target = "writeups";
    else if (raw === "machines") target = "machines";
    else if (raw.indexOf("machines/") === 0) { target = "machines"; mid = raw.slice(9); }
    else if (raw === "history") target = "history";
    else if (raw.indexOf("cat/") === 0) { const id = raw.slice(4); target = CATEGORIES.some(c => c.id === id) ? id : null; }
    activeCategory = target; searchQuery = ""; searchInput.value = "";
    openWriteupId = null;
    openMachineId = mid && machines.some(x => x.id === mid) ? mid : null;
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
  else if (launchHash.indexOf("machines/") === 0) { activeCategory = "machines"; openMachineId = launchHash.slice(9); }
  else if (launchHash.indexOf("cat/") === 0) activeCategory = launchHash.slice(4);
  loadData();
})();
