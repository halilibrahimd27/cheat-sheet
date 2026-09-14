/* GENERATED FILE — DO NOT EDIT. Built from public/ + seed.js by scripts/build-static.js. */
// Sessions — the work-in-progress view: a preset drives a session from first
// scan to finished report or retrospective.
//
// Three people have to be served by one screen, and the shape of the preset is
// what decides which of them is looking at it. Someone solving a box on a
// weeknight must never see a clock, a score or a nag; a certification candidate
// needs the score, the deadline and the evidence rules in front of them; a
// senior tester needs keys, density and a report that assembles itself. So
// nearly everything here is gated on a preset field rather than a user setting:
// durationMin decides whether a clock exists at all, totalPoints/passMark decide
// whether scoring exists, evidenceRules decide what capturing a flag costs.
//
// The other governing rule is honesty. session-data.js marks every rule as
// "official" (the vendor wrote it) or "inferred" (someone concluded it), marks
// tool restrictions advisory, and marks the numbers the vendor does not publish.
// A study tool that invents a pass mark is worse than one that has none, so an
// unknown number is rendered as unknown, every time, and an inference is never
// dressed up as a vendor rule.
(function () {
  "use strict";

  var APP = window.CS_APP || {};

  // ── i18n ──
  // Mirrors app.js's t(): look up the active language, fall back to English,
  // fall back to the key. The corpus itself (rules, hints, commands) stays in
  // the language the vendor published it in — translating a vendor rule would
  // be exactly the kind of quiet fabrication the rest of this file avoids.
  var STR = {
    en: {
      sessions: "Sessions", loading: "Loading session data…",
      loadFail: "Session data could not be loaded.",
      loadFailHint: "session-data.js is precached for offline use — if this is the first visit on this device you need to be online once.",
      retry: "Retry", pickPreset: "Pick a preset", pickHint: "A preset decides what this screen shows you. Presets with no clock and no score show neither.",
      resume: "In progress", resumeOne: "Resume", del: "Delete", start: "Start",
      targetsKind: "Targets", tasksKind: "Tasks",
      noTimer: "no timer, no score", noScore: "no score", noTimerOnly: "no timer",
      toPass: "to pass", passUndisclosed: "pass mark not disclosed by the vendor",
      pointsFromPanel: "points come from your Exam Control Panel",
      derivedTotal: "total derived from the challenges you add",
      hours: "h", mins: "m", tasksN: "tasks",
      cockpit: "Cockpit", report: "Report", retro: "Retrospective", rules: "Ground rules", keys: "Keys",
      endSession: "End session", back: "Back", elapsed: "Elapsed", remaining: "Remaining",
      reportDue: "Report due", overdue: "OVERDUE", clockNotStarted: "Not started",
      startClock: "Start the clock", startClockHint: "Nothing here runs until you say so.",
      score: "Score", captured: "captured", objectives: "objectives",
      routeTitle: "Cheapest route to the pass mark",
      routeReached: "Pass mark reached with what is already captured.",
      routeShort: "Even every remaining flag falls short by",
      routeOr: "or, for the fewest flags:",
      routeNeed: "Still needed",
      budgets: "Budgets you are tracking", budgetUsed: "used", budgetAdvisory: "Counts what you record. Nothing here blocks you.",
      budgetReset: "reset", budgetPlus: "Record one", budgetMinus: "Undo one",
      targets: "Targets", tasks: "Tasks", addTarget: "+ Add target", addTask: "+ Add task",
      noMachine: "No machine linked", linkMachine: "Link a machine", createMachine: "Create & link",
      openMachine: "Open in Machines", machineName: "Machine name",
      onTarget: "on target", phase: "Phase", flags: "Flags",
      enumQueue: "Enumeration queue", enumEmpty: "No services recorded yet.",
      enumImport: "Import your nmap output on the machine page — the queue builds itself from it.",
      enumNoProbe: "No enumeration probe ships for these ports",
      enumConditional: "conditional", enumShowCond: "Show conditional commands",
      enumHideCond: "Hide conditional commands", copyAll: "Copy the always-run set",
      copy: "Copy", copied: "Copied", note: "Note",
      checklist: "Guide", stuck: "Stuck?", stuckClose: "Close",
      gStepOf: "step", gPhaseOf: "of", gGoal: "Goal", gPrev: "Previous", gNext: "Next phase",
      gDone: "Completed", gLater: "Ahead", gAllDone: "Every phase complete",
      gAdvanced: "Phase complete — moved to", gReopen: "reopen",
      stuckIntro: "Read them in order. The first one that makes you uncomfortable is the one.",
      stuckMeta: "Whatever the target",
      stuckNone: "No stuck list ships for this focus and phase.",
      stuckList: "List", osLinux: "Linux", osWindows: "Windows",
      captureFlag: "Capture", capturedAt: "Captured", uncapture: "Un-capture",
      flagValue: "Flag value", howCaptured: "How did you obtain this?",
      viaWeb: "Through the web UI", viaShell: "Through a shell",
      evidenceReq: "Evidence required before this counts",
      evidenceNone: "This preset sets no evidence requirement for this flag.",
      official: "official", inferred: "inferred",
      officialTip: "The vendor published this.", inferredTip: "Someone concluded this from a more general rule. It is not vendor text.",
      unmetWarn: "requirement(s) not ticked. Missing evidence can score zero.",
      captureAnyway: "Capture anyway", overrodeAt: "Recorded as captured with unmet requirements",
      attempts: "Attempts", attemptsHint: "One line per thing you tried. Hour-18 you is reading this.",
      attemptAdd: "What did you try? (Enter to add)", attemptWhy: "Why it failed / what it told you (optional)",
      outFail: "failed", outPartial: "partial", outOk: "worked",
      attemptsEmpty: "Nothing logged yet.", attemptsAll: "All", attemptFilter: "Filter attempts",
      context: "Context", contextConfirm: "Confirm context", contextConfirmed: "Context confirmed",
      contextBanner: "CURRENT CONTEXT", contextNone: "no context set",
      contextWarn: "Set and confirm the context before you touch this task.",
      contextGaps: "Context never confirmed",
      contextDiff: "This task declares a different context from the last one you confirmed.",
      taskBudget: "Budget", taskSpent: "spent", taskStart: "Start", taskStop: "Pause",
      taskVerify: "Verification", taskVerifyHint: "What command proves this is actually done? Run it, then tick.",
      taskVerified: "Verified", taskApplied: "Applied", taskTodo: "Not started", taskSkipped: "Skipped", taskFailed: "Failed",
      flagReview: "Flag for review", appFeatureNote: "App feature, not an exam-UI feature",
      domainEst: "Weighted domain estimate", domainEstHint: "Your own task-to-domain mapping, weighted by the published curriculum. An estimate, not a score.",
      domains: "domains", domainUntouched: "untouched", legendVerified: "verified", legendApplied: "applied, unverified", legendLost: "skipped", legendOpen: "open",
      timeSavers: "Time savers", allowedDocs: "Documentation allow-list", pitfalls: "Pitfalls",
      notAllowed: "NOT ALLOWED", preflight: "Pre-flight & sweep",
      notes: "Notes on this preset", unverified: "What was not verified", sources: "Sources",
      honestyIntro: "Everything below is shown exactly as sourced. Anything the vendor does not publish is marked as such rather than guessed.",
      advisoryTitle: "Tool restrictions (advisory)",
      advisoryBody: "This is what the vendor published. It is not exhaustive, and a tool's absence from it is not permission. This app will not tell you a tool is safe.",
      reportOrder: "Documented in grading order, as the exam guide requires.",
      reportBuild: "Build report", reportSave: "Save to Write-ups", reportUpdate: "Update the saved write-up",
      reportSaved: "Saved to Write-ups", reportOpen: "Open Write-ups", reportCopy: "Copy markdown",
      saving: "saving…", saved: "saved", saveFail: "not saved — retry",
      saveFull: "not saved — browser storage is full",
      saveRetry: "Retry save", loadDocFail: "Your saved sessions could not be read. Nothing has been changed.",
      docFail: "Saved sessions could not be read.",
      docFailHint: "This is the GET /api/exam request, not the command corpus — the presets loaded fine. Check that the backend is reachable and retry; nothing has been written.",
      keysTitle: "Session keys", keysHint: "The app's own keys (Ctrl+K, /, g h, ?) all still work.",
      confirmEnd: "End this session? It stays in the list and can be reopened.",
      confirmDel: "Delete this session and everything recorded in it?",
      yes: "Yes", no: "Cancel", done: "Done", reopen: "Reopen",
      of: "of", perTask: "per task", derivedBy: "Derived by this app from the preset — not a published figure.",
      sweepReserve: "sweep reserve", noBudget: "This preset publishes no task count, so there is no per-task budget to derive."
    },
    tr: {
      sessions: "Oturumlar", loading: "Oturum verisi yukleniyor…",
      loadFail: "Oturum verisi yuklenemedi.",
      loadFailHint: "session-data.js cevrimdisi kullanim icin onbellege alinir — bu cihazdaki ilk ziyaretse bir kez cevrimici olmalisiniz.",
      retry: "Yeniden dene", pickPreset: "Bir on ayar secin", pickHint: "On ayar bu ekranda ne gorecegini belirler. Suresi ve puani olmayan on ayarlarda ikisi de gorunmez.",
      resume: "Devam eden", resumeOne: "Devam et", del: "Sil", start: "Basla",
      targetsKind: "Hedefler", tasksKind: "Gorevler",
      noTimer: "sure yok, puan yok", noScore: "puan yok", noTimerOnly: "sure yok",
      toPass: "gecme puani", passUndisclosed: "gecme puani saglayici tarafindan aciklanmadi",
      pointsFromPanel: "puanlar Sinav Kontrol Panelinizden gelir",
      derivedTotal: "toplam ekledigin gorevlerden turetilir",
      hours: "sa", mins: "dk", tasksN: "gorev",
      cockpit: "Kokpit", report: "Rapor", retro: "Degerlendirme", rules: "Temel kurallar", keys: "Tuslar",
      endSession: "Oturumu bitir", back: "Geri", elapsed: "Gecen", remaining: "Kalan",
      reportDue: "Rapor teslimi", overdue: "SURESI GECTI", clockNotStarted: "Baslamadi",
      startClock: "Sayaci baslat", startClockHint: "Sen soylemeden hicbir sey islemez.",
      score: "Puan", captured: "alindi", objectives: "hedef",
      routeTitle: "Gecme puanina en ucuz yol",
      routeReached: "Gecme puani mevcut yakalamalarla saglandi.",
      routeShort: "Kalan tum bayraklar bile su kadar eksik kaliyor:",
      routeOr: "veya en az bayrakla:",
      routeNeed: "Hala gereken",
      budgets: "Takip ettigin kotalar", budgetUsed: "kullanildi", budgetAdvisory: "Yalnizca kaydettiklerini sayar. Burada hicbir sey seni engellemez.",
      budgetReset: "sifirlama", budgetPlus: "Bir tane kaydet", budgetMinus: "Birini geri al",
      targets: "Hedefler", tasks: "Gorevler", addTarget: "+ Hedef ekle", addTask: "+ Gorev ekle",
      noMachine: "Bagli makine yok", linkMachine: "Makine bagla", createMachine: "Olustur ve bagla",
      openMachine: "Makineler'de ac", machineName: "Makine adi",
      onTarget: "hedefte", phase: "Asama", flags: "Bayraklar",
      enumQueue: "Kesif kuyrugu", enumEmpty: "Henuz kayitli servis yok.",
      enumImport: "nmap ciktini makine sayfasinda ice aktar — kuyruk kendini ondan kurar.",
      enumNoProbe: "Bu portlar icin kesif seti yok",
      enumConditional: "kosullu", enumShowCond: "Kosullu komutlari goster",
      enumHideCond: "Kosullu komutlari gizle", copyAll: "Her zaman calistirilan seti kopyala",
      copy: "Kopyala", copied: "Kopyalandi", note: "Not",
      enumQueueShort: "Kuyruk", checklist: "Rehber", stuck: "Tikandin mi?", stuckClose: "Kapat",
      gStepOf: "adim", gPhaseOf: "/", gGoal: "Hedef", gPrev: "Onceki", gNext: "Sonraki asama",
      gDone: "Tamamlanan", gLater: "Sirada", gAllDone: "Tum asamalar tamam",
      gAdvanced: "Asama bitti — gecildi:", gReopen: "yeniden ac",
      stuckIntro: "Sirayla oku. Seni ilk rahatsiz eden madde dogru olandir.",
      stuckMeta: "Hedef ne olursa olsun",
      stuckNone: "Bu odak ve asama icin hazir liste yok.",
      stuckList: "Liste", osLinux: "Linux", osWindows: "Windows",
      captureFlag: "Yakala", capturedAt: "Yakalandi", uncapture: "Geri al",
      flagValue: "Bayrak degeri", howCaptured: "Bunu nasil elde ettin?",
      viaWeb: "Web arayuzu uzerinden", viaShell: "Kabuk uzerinden",
      evidenceReq: "Bu sayilmadan once gereken kanit",
      evidenceNone: "Bu on ayar bu bayrak icin kanit sarti koymuyor.",
      official: "resmi", inferred: "cikarim",
      officialTip: "Saglayici bunu yayinladi.", inferredTip: "Daha genel bir kuraldan cikarilmistir. Saglayici metni degildir.",
      unmetWarn: "sart isaretlenmedi. Eksik kanit sifir puan getirebilir.",
      captureAnyway: "Yine de yakala", overrodeAt: "Eksik sartlarla yakalandi olarak kaydedildi",
      attempts: "Denemeler", attemptsHint: "Denedigin her sey icin bir satir. 18. saatteki sen bunu okuyacak.",
      attemptAdd: "Ne denedin? (Eklemek icin Enter)", attemptWhy: "Neden basarisiz oldu / ne ogretti (istege bagli)",
      outFail: "basarisiz", outPartial: "kismi", outOk: "calisti",
      attemptsEmpty: "Henuz kayit yok.", attemptsAll: "Tumu", attemptFilter: "Denemeleri filtrele",
      context: "Baglam", contextConfirm: "Baglami onayla", contextConfirmed: "Baglam onaylandi",
      contextBanner: "GECERLI BAGLAM", contextNone: "baglam ayarlanmadi",
      contextWarn: "Bu goreve dokunmadan once baglami ayarla ve onayla.",
      contextGaps: "Baglam hic onaylanmadi",
      contextDiff: "Bu gorev, en son onayladigindan farkli bir baglam bildiriyor.",
      taskBudget: "Butce", taskSpent: "harcanan", taskStart: "Basla", taskStop: "Duraklat",
      taskVerify: "Dogrulama", taskVerifyHint: "Bunun gercekten bittigini hangi komut kanitliyor? Calistir, sonra isaretle.",
      taskVerified: "Dogrulandi", taskApplied: "Uygulandi", taskTodo: "Baslamadi", taskSkipped: "Atlandi", taskFailed: "Basarisiz",
      flagReview: "Gozden gecirmek icin isaretle", appFeatureNote: "Uygulama ozelligi, sinav arayuzu ozelligi degil",
      domainEst: "Agirlikli alan tahmini", domainEstHint: "Kendi gorev-alan eslemen, yayinlanan mufredat agirliklariyla. Tahmindir, puan degildir.",
      domains: "alan", domainUntouched: "dokunulmadi", legendVerified: "dogrulandi", legendApplied: "uygulandi, dogrulanmadi", legendLost: "atlandi", legendOpen: "acik",
      timeSavers: "Zaman kazandiranlar", allowedDocs: "Izin verilen dokumantasyon", pitfalls: "Tuzaklar",
      notAllowed: "IZIN YOK", preflight: "On hazirlik ve son tarama",
      notes: "Bu on ayar hakkinda notlar", unverified: "Dogrulanmayanlar", sources: "Kaynaklar",
      honestyIntro: "Asagidaki her sey kaynagindaki haliyle gosterilir. Saglayicinin yayinlamadigi hicbir sey tahmin edilmez.",
      advisoryTitle: "Arac kisitlamalari (yol gosterici)",
      advisoryBody: "Bu, saglayicinin yayinladigidir. Kapsayici degildir ve bir aracin listede olmamasi izin anlamina gelmez. Bu uygulama sana bir aracin guvenli oldugunu soylemez.",
      reportOrder: "Sinav kilavuzunun istedigi gibi degerlendirme sirasina gore belgelenir.",
      reportBuild: "Rapor olustur", reportSave: "Write-ups'a kaydet", reportUpdate: "Kayitli yaziyi guncelle",
      reportSaved: "Write-ups'a kaydedildi", reportOpen: "Write-ups'i ac", reportCopy: "Markdown kopyala",
      saving: "kaydediliyor…", saved: "kaydedildi", saveFail: "kaydedilmedi — yeniden dene",
      saveFull: "kaydedilmedi — tarayici depolamasi dolu",
      saveRetry: "Yeniden kaydet", loadDocFail: "Kayitli oturumlarin okunamadi. Hicbir sey degistirilmedi.",
      docFail: "Kayitli oturumlar okunamadi.",
      docFailHint: "Sorun GET /api/exam isteginde, komut derlemesinde degil — on ayarlar sorunsuz yuklendi. Sunucunun erisilebilir oldugunu dogrulayip yeniden deneyin; hicbir sey yazilmadi.",
      keysTitle: "Oturum tuslari", keysHint: "Uygulamanin kendi tuslari (Ctrl+K, /, g h, ?) calismaya devam eder.",
      confirmEnd: "Bu oturum bitirilsin mi? Listede kalir ve tekrar acilabilir.",
      confirmDel: "Bu oturum ve icindeki her sey silinsin mi?",
      yes: "Evet", no: "Vazgec", done: "Bitti", reopen: "Tekrar ac",
      of: "/", perTask: "gorev basina", derivedBy: "Bu uygulama tarafindan on ayardan turetildi — yayinlanmis bir deger degil.",
      sweepReserve: "son tarama payi", noBudget: "Bu on ayar gorev sayisi yayinlamiyor, bu yuzden turetilecek bir gorev butcesi yok."
    }
  };
  function lang() { return (typeof APP.getLang === "function" && APP.getLang() === "tr") ? "tr" : "en"; }
  function S(key) { var L = lang(); return (STR[L] && STR[L][key]) || STR.en[key] || key; }

  // ── DOM helpers ──
  // Everything in this file is built with createElement + textContent. This repo
  // has already shipped four stored-XSS sinks, all the same shape — escaped text
  // sitting next to an unescaped attribute — and the only reliable cure is to
  // never assemble an HTML string in the first place. The single exception is
  // the report preview, which renders APP.renderMarkdown output; that function
  // escapes its whole input before it formats anything.
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = String(text);
    return n;
  }
  function btn(cls, text, onClick, label) {
    var b = el("button", cls, text);
    b.type = "button";
    if (label) { b.title = label; b.setAttribute("aria-label", label); }
    if (onClick) b.addEventListener("click", onClick);
    return b;
  }
  function input(cls, placeholder, value) {
    var i = document.createElement("input");
    i.type = "text";
    if (cls) i.className = cls;
    i.placeholder = placeholder || "";
    i.value = value == null ? "" : String(value);
    return i;
  }
  function checkbox(checked, onChange, label) {
    var c = document.createElement("input");
    c.type = "checkbox";
    c.checked = !!checked;
    if (label) c.setAttribute("aria-label", label);
    if (onChange) c.addEventListener("change", function () { onChange(c.checked); });
    return c;
  }
  function link(url, text, cls) {
    var a = el("a", cls || "", text || url);
    // Only http(s) reaches an href here — the corpus is vendor documentation, and
    // a javascript: or data: URL in an anchor is the classic attribute sink.
    a.href = /^https?:\/\//i.test(String(url || "")) ? String(url) : "#";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }
  // ── Icons ──
  // The sprite lives in index.html and app.js owns the two builders for it.
  // Going through APP rather than re-implementing them here is what keeps this
  // view drawing from the same set as the rest of the app; the fallback is an
  // empty slot rather than a glyph, because an older app.js that cannot supply
  // an icon should leave a gap, not reintroduce the character being retired.
  function ico(name, cls) {
    if (typeof APP.icon === "function") return APP.icon(name, cls);
    return el("span", "icon");
  }
  // A button labelled with an icon and, optionally, text. An icon-only button
  // has no accessible name of its own, so `label` is not decoration there.
  function iconBtn(cls, name, text, onClick, label) {
    var b = btn(cls, "", onClick, label);
    b.appendChild(ico(name, "icon-sm"));
    if (text) b.appendChild(document.createTextNode(" " + text));
    return b;
  }
  // The one button whose icon belongs AFTER the label: "Next" points at where it
  // is taking you, and an arrow on the left of that word points back.
  function nextBtn(cls, text, onClick) {
    var b = btn(cls, text, onClick);
    b.appendChild(document.createTextNode(" "));
    b.appendChild(ico("arrow-right", "icon-sm"));
    return b;
  }
  // A preset's icon is data out of session-data.js and stays a character, the
  // same way a category emoji does. What was ours is the FALLBACK for a preset
  // that ships none, and that is chrome.
  function presetIcon(preset) {
    var span = el("span", "session-preset-icon");
    if (preset && preset.icon) span.textContent = preset.icon;
    else span.appendChild(ico("diamond", "icon-sm"));
    return span;
  }
  // Same for a heading or a line of status text.
  function iconEl(tag, cls, name, text) {
    var node = el(tag, cls);
    node.appendChild(ico(name, "icon-sm"));
    if (text) node.appendChild(document.createTextNode(" " + text));
    return node;
  }
  function frag() { return document.createDocumentFragment(); }
  function clone(v) { try { return JSON.parse(JSON.stringify(v)); } catch { return null; } }
  function uid(prefix) { return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function toast(msg, kind) { if (typeof APP.toast === "function") APP.toast(msg, kind); }

  // ── Time formatting ──
  function fmtClock(ms) {
    var neg = ms < 0;
    var s = Math.floor(Math.abs(ms) / 1000);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return (neg ? "-" : "") + h + ":" + pad(m) + ":" + pad(sec);
  }
  function fmtShort(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    if (h > 0) return h + S("hours") + " " + m + S("mins");
    if (m > 0) return m + S("mins");
    return s + "s";
  }
  function fmtDuration(minutes) {
    if (!minutes) return "";
    var h = Math.floor(minutes / 60), m = minutes % 60;
    if (h && m) return h + S("hours") + (m < 10 ? "0" : "") + m;
    if (h) return h + S("hours");
    return m + S("mins");
  }
  function fmtTime(ts) {
    try { return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
    catch { return ""; }
  }
  function fmtDateTime(ts) {
    try { return new Date(ts).toLocaleString(); } catch { return ""; }
  }

  // ── Lazy data load ──
  // session-data.js is ~600KB. The payload audit already flagged this app's
  // first-paint weight, so the corpus is fetched only when someone actually
  // opens Sessions — and never from an absolute path, because the static build
  // is served from /<repo>/ on GitHub Pages where "/session-data.js" resolves
  // outside the deployment entirely.
  var dataPromise = null;
  function loadSessionData() {
    if (window.CS_SESSION_DATA) return Promise.resolve(window.CS_SESSION_DATA);
    if (dataPromise) return dataPromise;
    dataPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "session-data.js";
      s.async = true;
      s.onload = function () {
        if (window.CS_SESSION_DATA) resolve(window.CS_SESSION_DATA);
        else reject(new Error("session-data.js loaded but CS_SESSION_DATA was never set"));
      };
      s.onerror = function () { reject(new Error("session-data.js could not be fetched")); };
      document.head.appendChild(s);
    });
    // A failure must not be cached as a permanent rejection, or the retry button
    // would replay the same rejection forever without re-attempting the fetch.
    dataPromise.catch(function () { dataPromise = null; });
    return dataPromise;
  }

  // ── Persistence ──
  // One JSON document at /api/exam on both backends. Unknown top-level keys are
  // preserved because the whole document is read, mutated in place and written
  // back — a future writer's data is never dropped by this one.
  var DOC = null;              // the live document; null until a successful GET
  var docError = null;
  var docPromise = null;
  var SAVE_DEBOUNCE_MS = 700;
  var SAVE_RETRY_MS = 4000;
  var saveTimer = null, saveInFlight = false, saveDirty = false, saveRetried = false;
  var saveState = "";          // "" | "saving" | "ok" | "error"
  var saveMessage = "";
  var saveListeners = [];

  function loadDoc() {
    if (DOC) return Promise.resolve(DOC);
    if (docPromise) return docPromise;
    docPromise = Promise.resolve(APP.api("GET", "/api/exam")).then(function (res) {
      // api() returns null on a network failure and {error} on an HTTP error.
      // Neither may be treated as "an empty document": starting from {} and then
      // saving would overwrite whatever the backend really holds.
      if (res === null || (res && res.error)) {
        docError = (res && res.error) ? String(res.error) : S("loadDocFail");
        docPromise = null;
        return null;
      }
      var d = (res && typeof res === "object" && !Array.isArray(res)) ? res : {};
      if (!Array.isArray(d.sessions)) d.sessions = [];
      if (typeof d.activeSessionId !== "string") d.activeSessionId = "";
      DOC = d;
      docError = null;
      return DOC;
    }).catch(function (e) {
      docError = String((e && e.message) || e);
      docPromise = null;
      return null;
    });
    return docPromise;
  }

  function onSaveState(fn) { saveListeners.push(fn); }
  function setSaveState(state, message) {
    saveState = state;
    saveMessage = message || "";
    saveListeners.forEach(function (fn) { try { fn(state, saveMessage); } catch { /* a listener must not stop a save */ } });
  }

  function queueSave() {
    saveDirty = true;
    saveRetried = false;
    setSaveState("saving");
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSave, SAVE_DEBOUNCE_MS);
  }

  function flushSave() {
    saveTimer = null;
    // An in-flight PUT re-enters this on completion. Returning here rather than
    // clearing saveDirty is the whole point: the earlier version of this queue
    // replaced the pending patch at the start of a write, so every edit made
    // while that write was in the air was silently dropped. Never clear pending
    // work that has not yet been acknowledged.
    if (saveInFlight || !saveDirty || !DOC) return;
    saveInFlight = true;
    saveDirty = false;
    var snapshot = clone(DOC);
    if (!snapshot) { saveInFlight = false; saveDirty = true; setSaveState("error"); return; }
    Promise.resolve(APP.api("PUT", "/api/exam", snapshot)).then(function (res) {
      saveInFlight = false;
      if (!res || res.error) {
        // Put the edits back on the queue. A write that did not land must never
        // be reported as saved, and a PUT can now legitimately return 507 when
        // the browser's IndexedDB quota is exhausted.
        saveDirty = true;
        var msg = res && res.error ? String(res.error) : "";
        setSaveState("error", /storage/i.test(msg) ? S("saveFull") : "");
        if (!saveRetried) { saveRetried = true; saveTimer = setTimeout(flushSave, SAVE_RETRY_MS); }
        return;
      }
      if (saveDirty) { saveTimer = setTimeout(flushSave, SAVE_DEBOUNCE_MS); return; }
      setSaveState("ok");
    }).catch(function () {
      saveInFlight = false;
      saveDirty = true;
      setSaveState("error");
      if (!saveRetried) { saveRetried = true; saveTimer = setTimeout(flushSave, SAVE_RETRY_MS); }
    });
  }

  function retrySave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveRetried = false;
    saveDirty = true;
    setSaveState("saving");
    saveTimer = setTimeout(flushSave, 0);
  }

  // Exported for the rest of the file: mutate, then call this.
  function touch() { queueSave(); }


  // ══════════════════════════════════════════════════════════════════
  // Derivations — pure functions. These decide which persona is looking
  // at the screen, so they are kept free of DOM and testable on their own.
  // ══════════════════════════════════════════════════════════════════

  function DATA() { return window.CS_SESSION_DATA || { presets: [], probes: [], stuck: [] }; }
  function presetById(id) {
    var list = DATA().presets || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  // What kind of scoring this preset actually has. Every number on screen is
  // gated on this, because the alternative — a denominator invented so the bar
  // has something to fill against — is the exact failure this feature exists to
  // avoid. "unknown" means the vendor publishes a pass mark but not the split.
  function scoreMode(preset) {
    if (!preset) return "none";
    if (preset.pointsUnknown) return "unknown";
    if (preset.totalPoints === null || preset.derivedTotal) return "derived";
    if (preset.totalPoints > 0 && preset.passMark > 0) return "denominator";
    if (preset.totalPoints === 0 && preset.passMark > 0) return "count-up";
    return "none";
  }
  function hasClock(preset) { return !!preset && preset.durationMin > 0; }
  function hasReportDeadline(preset) { return !!preset && preset.reportHours > 0; }

  // The one-line shape shown on a preset card and in the session header. It is
  // assembled from what the preset really publishes, so "no timer, no score" is
  // as much a real answer as "3 standalone + AD set · 23h45 · 70 to pass".
  function presetShape(preset) {
    var bits = [];
    if (preset.kind === "tasks") {
      if (preset.taskCount > 0) bits.push(preset.taskCount + " " + S("tasksN"));
      else if ((preset.domains || []).length) bits.push(preset.domains.length + " " + S("domains"));
      if (preset.durationMin > 0) bits.push(fmtDuration(preset.durationMin));
      if (preset.passMark > 0) bits.push(preset.passMark + "%");
      else if (preset.passMarkUndisclosed) bits.push(S("passUndisclosed"));
      // Saying "no timer, no score" out loud is the point for an untimed preset:
      // it is the promise the card is making, not the absence of one.
      if (!(preset.durationMin > 0)) bits.push(S("noTimer"));
      return bits.join(" · ");
    }
    var counts = {};
    (preset.targets || []).forEach(function (t) { counts[t.kind] = (counts[t.kind] || 0) + 1; });
    var shape = Object.keys(counts).map(function (k) { return counts[k] + " " + k; }).join(" + ");
    if (shape) bits.push(shape);
    if (preset.durationMin > 0) bits.push(fmtDuration(preset.durationMin));
    var mode = scoreMode(preset);
    if (mode === "denominator") bits.push(preset.passMark + " " + S("toPass"));
    else if (mode === "count-up") bits.push(preset.passMark + " " + S("toPass"));
    else if (mode === "unknown") bits.push(S("pointsFromPanel"));
    else if (mode === "derived") bits.push(S("derivedTotal"));
    if (!preset.durationMin && mode === "none") bits.push(S("noTimer"));
    else if (!preset.durationMin) bits.push(S("noTimerOnly"));
    else if (mode === "none") bits.push(S("noScore"));
    return bits.join(" · ");
  }

  // ── Score ──
  // Points live on the SESSION's copy of the targets, not on the preset: a CTF
  // board's values are edited to match the scoreboard, and OSEP has no targets
  // at all until the candidate adds what the control panel gave them.
  function flagCaptured(target, flagId) {
    var c = target.captures && target.captures[flagId];
    return !!(c && c.at);
  }
  function targetFlags(target) { return Array.isArray(target.flags) ? target.flags : []; }
  function targetCapturedCount(target) {
    return targetFlags(target).filter(function (f) { return flagCaptured(target, f.id); }).length;
  }
  function targetPoints(target) {
    return targetFlags(target).reduce(function (sum, f) {
      return sum + (flagCaptured(target, f.id) ? (Number(f.points) || 0) : 0);
    }, 0);
  }
  function sessionScore(session) {
    var earned = 0, possible = 0, capturedFlags = 0, totalFlags = 0;
    ((session && session.targets) || []).forEach(function (t) {
      targetFlags(t).forEach(function (f) {
        var p = Number(f.points) || 0;
        possible += p;
        totalFlags += 1;
        if (flagCaptured(t, f.id)) { earned += p; capturedFlags += 1; }
      });
    });
    return { earned: earned, possible: possible, capturedFlags: capturedFlags, totalFlags: totalFlags };
  }

  // The hour-14 decision on a 24-hour exam is not "how am I doing" but "what is
  // the least work that still gets me over the line". Exact rather than greedy:
  // a candidate cannot act on an approximation, and the numbers are small enough
  // (100 points for OffSec, a few thousand for a CTF board) that a 0/1 knapsack
  // over integer sums costs nothing.
  function cheapestRoute(remaining, need) {
    var pool = (remaining || []).filter(function (f) { return (Number(f.points) || 0) > 0; });
    if (need <= 0) return { reached: true, fewest: [], least: [] };
    var total = pool.reduce(function (a, f) { return a + (Number(f.points) || 0); }, 0);
    if (total < need) return { reached: false, short: need - total, fewest: null, least: null };

    var n = pool.length;
    // A 1-D rolling knapsack is the obvious shape here and it is WRONG for
    // reconstruction: its parent pointers get read after later items have
    // overwritten the very cells they point at, so walking back can hand the
    // same flag over twice — cheapestRoute([10,10,20], 40) claimed "20 + 20".
    // A candidate cannot act on a route that does not exist, so the DP keeps one
    // row per item and records, per cell, whether that item was taken.
    var EXACT = n <= 64 && total <= 5000;
    if (EXACT) {
      var rows = [], taken = [];
      var row0 = new Array(total + 1).fill(-1);
      row0[0] = 0;
      rows.push(row0);
      for (var i = 0; i < n; i++) {
        var p = Number(pool[i].points) || 0;
        var prev = rows[i], cur = prev.slice(), tk = new Array(total + 1).fill(false);
        for (var s = 0; s + p <= total; s++) {
          if (prev[s] < 0) continue;
          var ns = s + p, c = prev[s] + 1;
          if (cur[ns] < 0 || c < cur[ns]) { cur[ns] = c; tk[ns] = true; }
        }
        rows.push(cur); taken.push(tk);
      }
      var finalRow = rows[n];
      var walk = function (sum) {
        var picks = [], s = sum;
        for (var i2 = n - 1; i2 >= 0 && s > 0; i2--) {
          if (!taken[i2][s]) continue;             // carried over — item i2 unused here
          picks.push(pool[i2]);
          s -= Number(pool[i2].points) || 0;
        }
        return picks.reverse();
      };
      var fewestSum = -1, leastSum = -1;
      for (var s2 = need; s2 <= total; s2++) {
        if (finalRow[s2] < 0) continue;
        if (leastSum < 0) leastSum = s2;                                        // smallest overshoot
        if (fewestSum < 0 || finalRow[s2] < finalRow[fewestSum]) fewestSum = s2; // fewest flags
      }
      if (fewestSum < 0) return { reached: false, short: need - total, fewest: null, least: null };
      return {
        reached: false,
        fewest: walk(fewestSum), fewestPoints: fewestSum,
        least: walk(leastSum), leastPoints: leastSum,
        same: fewestSum === leastSum, approx: false
      };
    }
    // Pathological board (a big custom or CTF set). Rather than a wrong exact
    // answer, give a real, achievable route and say it may not be minimal.
    var byValue = pool.slice().sort(function (a, b) { return (b.points || 0) - (a.points || 0); });
    var picked = [], sum = 0;
    for (var k = 0; k < byValue.length && sum < need; k++) { picked.push(byValue[k]); sum += Number(byValue[k].points) || 0; }
    return {
      reached: false,
      fewest: picked, fewestPoints: sum,
      least: picked, leastPoints: sum,
      same: true, approx: true
    };
  }

  function routeForSession(session, preset) {
    if (!session || !preset) return null;
    if (scoreMode(preset) !== "denominator" || !(preset.passMark > 0)) return null;
    var sc = sessionScore(session);
    var need = preset.passMark - sc.earned;
    var remaining = [];
    ((session && session.targets) || []).forEach(function (t) {
      targetFlags(t).forEach(function (f) {
        if (!flagCaptured(t, f.id)) remaining.push({ points: Number(f.points) || 0, label: f.label, target: t.label });
      });
    });
    var r = cheapestRoute(remaining, need);
    r.need = need;
    return r;
  }

  // ── Budgets ──
  // Only the structured enforceable strings are parsed. Most `enforceable`
  // values in the corpus are prose notes to whoever builds this screen; reading
  // those as machine instructions would put sentences in a chip.
  var BUDGET_RE = /^budget:([a-z0-9_-]+):(\d+)(?:;reset:(\d+))?$/i;
  function budgetsFor(preset) {
    var seen = {}, out = [];
    (preset.rules || []).forEach(function (r) {
      var m = BUDGET_RE.exec(String(r.enforceable || ""));
      if (!m) return;
      var key = m[1].toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      out.push({
        key: key,
        limit: Number(m[2]) || 0,
        resets: m[3] ? Number(m[3]) : 0,
        text: r.text || "",
        confidence: r.confidence || "inferred",
        source: r.source || ""
      });
    });
    return out;
  }

  // Tool restrictions. Collected for DISPLAY ONLY — never matched against
  // anything the user types. OffSec states twice that it will not comment on
  // tools beyond its own guide, so a warning that fires on a permitted tool
  // teaches people to dismiss warnings, and then the one that mattered gets
  // dismissed too. Absence from this list is not permission and never says so.
  var TOOL_RE = /^(?:toolban|warn-tools|banned-tools):(.+)$/i;
  function toolRulesFor(preset) {
    return (preset.rules || []).filter(function (r) { return TOOL_RE.test(String(r.enforceable || "")); })
      .map(function (r) {
        var m = TOOL_RE.exec(String(r.enforceable));
        return {
          tools: m[1].split(",").map(function (s) { return s.trim(); }).filter(Boolean),
          text: r.text || "", kind: r.kind || "", confidence: r.confidence || "inferred",
          advisory: r.advisory === true, source: r.source || ""
        };
      });
  }
  function hasEnforceable(preset, value) {
    return (preset.rules || []).some(function (r) { return String(r.enforceable || "").indexOf(value) >= 0; });
  }

  // ── Evidence ──
  // A rule applies to a flag when it is global ("*") or names that flag id. The
  // capturedVia rules (OSWA) are the interesting case: the requirement depends
  // on HOW the value was obtained, so nothing is shown until the user says.
  function evidenceRulesFor(preset, flagId, via) {
    return (preset.evidenceRules || []).filter(function (r) {
      if (r.appliesTo !== "*" && r.appliesTo !== flagId) return false;
      if (r.capturedVia) return r.capturedVia === via;
      return true;
    });
  }
  function presetAsksHow(preset) {
    return (preset.evidenceRules || []).some(function (r) { return !!r.capturedVia; });
  }
  function evidenceKey(rule, idx) {
    // Keyed on the requirement text rather than the array index so a corpus
    // update that reorders the rules cannot silently re-point a ticked box at a
    // different requirement.
    var t = String(rule.requirement || "").slice(0, 60).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    return (rule.capturedVia ? rule.capturedVia + "-" : "") + t + "-" + idx;
  }
  function unmetEvidence(preset, target, flag) {
    var cap = (target.captures && target.captures[flag.id]) || {};
    var rules = evidenceRulesFor(preset, flag.id, cap.via);
    var met = cap.met || {};
    return rules.filter(function (r, i) { return !met[evidenceKey(r, i)]; });
  }

  // ── Services → probes ──
  // Mirrors app.js's normaliser rather than importing it: CS_APP exports the
  // integration surface, not the machine internals, and back-compat string rows
  // still exist in older saved data.
  function normService(s) {
    if (s && typeof s === "object") {
      return {
        port: String(s.port || ""), proto: s.proto || "tcp",
        name: s.name || s.service || "", version: s.version || "",
        state: s.state || "open"
      };
    }
    var str = String(s == null ? "" : s).trim();
    var m = str.match(/^(\d{1,5})\/(tcp|udp)\s+(?:(open|closed|filtered)\s+)?(\S+)?\s*(.*)$/i);
    if (m) return { port: m[1], proto: m[2].toLowerCase(), state: (m[3] || "open").toLowerCase(), name: m[4] || "", version: (m[5] || "").trim() };
    return { port: "", proto: "tcp", name: str, version: "", state: "open" };
  }
  function normServices(arr) { return (Array.isArray(arr) ? arr : []).map(normService); }

  function probeFor(svc) {
    var probes = DATA().probes || [];
    var port = parseInt(svc.port, 10);
    var i;
    if (port > 0) {
      for (i = 0; i < probes.length; i++) {
        if ((probes[i].ports || []).indexOf(port) >= 0) return probes[i];
      }
    }
    var name = String(svc.name || "").toLowerCase();
    if (!name) return null;
    for (i = 0; i < probes.length; i++) {
      var key = String(probes[i].service || "").toLowerCase();
      // "http(s)" in the corpus, "http"/"https"/"http-proxy" from nmap.
      var base = key.replace(/\(s\)$/, "");
      if (name === key || name === base || name.indexOf(base) === 0) return probes[i];
    }
    return null;
  }

  // The enumeration queue: one group per open service that has a probe, plus an
  // explicit list of the ports that have none. Saying "nothing ships for 4444"
  // out loud is the difference between a queue and a queue that quietly hides
  // a third of the attack surface.
  function buildQueue(services) {
    var groups = [], uncovered = [], seen = {};
    normServices(services).forEach(function (s) {
      if (s.state && s.state !== "open" && s.state !== "open|filtered") return;
      var probe = probeFor(s);
      if (!probe) { if (s.port) uncovered.push(s); return; }
      var key = probe.service;
      if (seen[key] !== undefined) { groups[seen[key]].services.push(s); return; }
      seen[key] = groups.length;
      groups.push({ probe: probe, services: [s] });
    });
    return { groups: groups, uncovered: uncovered };
  }

  // Placeholder resolution. The linked machine's own IP wins over the global
  // Quick-IP value: a session can have six targets open and RHOST only ever
  // holds one of them.
  var TARGET_PH = ["<TARGET_IP>", "<RHOST_IP>", "<RHOST>", "<IP>", "<TARGET>"];
  function resolveCmd(cmd, machine) {
    var out = String(cmd == null ? "" : cmd);
    var ip = machine && machine.ip ? String(machine.ip).trim() : "";
    if (ip) {
      TARGET_PH.forEach(function (ph) { out = out.split(ph).join(ip); });
      out = out.replace(/\$IP\b/g, ip);
    }
    if (typeof APP.applyVars === "function") {
      try { out = APP.applyVars(out); } catch { /* a broken var bar must not break the queue */ }
    }
    return out;
  }

  // ── "Stuck?" resolution ──
  // The corpus keys its lists by focus (network / webapp / ad / evasion / mixed)
  // and by a canonical phase. A preset's own phase ids are far more specific
  // than that, so they are mapped here. The "mixed" lists are the process ones —
  // re-read the objective, prove the thing you think you tried — and they are
  // appended to every result rather than replacing the technical list.
  var PHASE_MAP = {
    setup: "recon", "bonus-prep": "recon", recon: "recon", osint: "recon", surface: "recon",
    scoping: "recon", "pre-engagement": "recon", "board-triage": "recon", external: "recon",
    "information-gathering": "recon", "oswa-recon": "recon", "oswe-env": "recon", "oswe-orient": "recon",
    "lab-up": "recon", standup: "recon", preflight: "recon", "workdir-up": "recon",
    "svc-enum": "enumeration", "web-discovery": "enumeration", enumeration: "enumeration",
    "vulnerability-assessment": "enumeration", sitawareness: "enumeration", adrecon: "enumeration",
    internal: "enumeration", "oswa-auth": "enumeration", "oswe-static": "enumeration", web: "enumeration",
    enumerate: "enumeration", audit: "enumeration", triage: "enumeration",
    foothold: "foothold", shell: "foothold", "local-flag": "foothold", access: "foothold",
    exploitation: "foothold", "oswa-injection": "foothold", "oswa-clientside": "foothold",
    "oswa-files": "foothold", "oswa-foothold": "foothold", "oswe-authbypass": "foothold",
    clientside: "foothold", "challenge-loop": "foothold", "quick-hits": "foothold", escape: "foothold",
    privesc: "privesc-linux", reenumerate: "privesc-linux", escalate: "privesc-linux",
    "post-exploitation": "privesc-linux", postex: "privesc-linux", "proof-flag": "privesc-linux",
    lateral: "lateral", "ad-lateral": "lateral", "legacy-ad-lateral": "lateral",
    "lateral-movement": "lateral", "ad-harvest": "lateral", "legacy-ad-creds": "lateral",
    kerberos: "lateral", ad: "lateral", "ad-initial": "lateral", "ad-domain": "lateral",
    "legacy-ad-entry": "lateral", "legacy-ad-dc": "lateral", domain: "lateral",
    "oswe-rce": "exploit-dev", "oswe-chain": "exploit-dev", allowlist: "exploit-dev",
    tradecraft: "exploit-dev", "proof-of-concept": "exploit-dev",
    // Reporting and close-out phases have no technical list of their own. They
    // resolve to the previous mapped phase of the preset (see stuckPhaseFor), so
    // what comes back is the process nudge for wherever the work actually was.
    evidence: "", report: "", "oswa-report": "", "oswe-report": "", findings: "",
    closeout: "", "post-engagement": "", debrief: "", "bank-it": "", sweep: "", retro: "",
    verify: "", fix: "", mock: "", drill: "", "task-loop": ""
  };
  function stuckPhaseFor(preset, phaseId) {
    var mapped = PHASE_MAP[phaseId];
    if (mapped) return mapped;
    var phases = (preset && preset.phases) || [];
    var idx = -1, i;
    for (i = 0; i < phases.length; i++) if (phases[i].id === phaseId) { idx = i; break; }
    for (i = idx - 1; i >= 0; i--) {
      var back = PHASE_MAP[phases[i].id];
      if (back) return back;
    }
    return "recon";
  }
  // The technical focus is per TARGET, not per preset: an AD machine inside an
  // otherwise "mixed" exam wants the ad list, and a web target wants the webapp
  // one. The preset focus is only the fallback.
  var WEB_PHASE_RE = /^(web|oswa-|oswe-)|web-discovery/;
  function stuckFocusFor(preset, target, stuckPhase, phaseId) {
    var kind = target && target.kind;
    if (kind === "ad-client" || kind === "ad-dc") return "ad";
    if (kind === "webapp") return "webapp";
    if (phaseId && WEB_PHASE_RE.test(String(phaseId))) return "webapp";
    if (stuckPhase === "lateral" && (preset.focus === "mixed" || !preset.focus)) return "ad";
    var f = preset && preset.focus;
    if (f === "webapp" || f === "evasion") return f;
    return "network";
  }
  function stuckList(focus, phase) {
    var lists = DATA().stuck || [];
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].focus === focus && lists[i].phase === phase) return lists[i];
    }
    return null;
  }
  // OS-specific privesc: the machine record already knows, so ask it before
  // making the user choose.
  function privescPhase(machine, override) {
    if (override) return override;
    var os = String((machine && machine.os) || "").toLowerCase();
    if (/win/.test(os)) return "privesc-windows";
    return "privesc-linux";
  }

  // ── Task mode ──
  // The per-task budget is DERIVED, and labelled as derived everywhere it shows.
  // The reserve comes from the preset's own phases: a preset with a "sweep"
  // phase says in its rules that the sweep opens at 15 minutes, so that time is
  // not available to the task loop.
  var SWEEP_RESERVE_MIN = 15;
  function taskBudget(preset, taskCount) {
    var n = taskCount || preset.taskCount || 0;
    if (!(preset.durationMin > 0) || !(n > 0)) return null;
    var hasSweep = (preset.phases || []).some(function (p) { return p.id === "sweep"; });
    var reserve = hasSweep ? SWEEP_RESERVE_MIN : 0;
    var perTaskMs = Math.max(0, (preset.durationMin - reserve)) * 60000 / n;
    return { perTaskMs: perTaskMs, reserveMin: reserve, count: n, totalMin: preset.durationMin };
  }

  // A weighted estimate, deliberately reported as three separate figures rather
  // than one. Collapsing "applied but never verified" into a single percentage
  // would invent a confidence the candidate has not earned — and the whole point
  // of the CKS retro is that the verification gap is where the points went.
  function domainEstimate(session, preset) {
    var byDomain = {};
    (preset.domains || []).forEach(function (d) {
      byDomain[d.id] = { domain: d, tasks: [], verified: 0, applied: 0, lost: 0, open: 0 };
    });
    var unassigned = 0;
    (session.tasks || []).forEach(function (task) {
      var row = byDomain[task.domainId];
      if (!row) { unassigned += 1; return; }
      row.tasks.push(task);
    });
    var totalWeight = 0, verified = 0, applied = 0, lost = 0;
    Object.keys(byDomain).forEach(function (id) {
      var row = byDomain[id];
      var w = Number(row.domain.weight) || 0;
      totalWeight += w;
      if (!row.tasks.length) { row.open = w; return; }
      var share = w / row.tasks.length;
      row.tasks.forEach(function (t) {
        if (t.status === "verified") row.verified += share;
        else if (t.status === "applied") row.applied += share;
        else if (t.status === "skipped") row.lost += share;
        else row.open += share;
      });
      verified += row.verified; applied += row.applied; lost += row.lost;
    });
    return {
      rows: Object.keys(byDomain).map(function (id) { return byDomain[id]; }),
      totalWeight: totalWeight, verified: verified, applied: applied, lost: lost,
      open: Math.max(0, totalWeight - verified - applied - lost),
      unassigned: unassigned
    };
  }

  // ══════════════════════════════════════════════════════════════════
  // Session lifecycle
  // ══════════════════════════════════════════════════════════════════

  function sessions() { return (DOC && DOC.sessions) || []; }
  function activeSession() {
    if (!DOC || !DOC.activeSessionId) return null;
    return sessions().filter(function (s) { return s.id === DOC.activeSessionId; })[0] || null;
  }

  function makeTargets(preset) {
    return (preset.targets || []).map(function (t) {
      return {
        key: t.key,
        label: t.label,
        kind: t.kind,
        // Points are copied onto the session, not read through to the preset: a
        // CTF board's values are edited to match the scoreboard, and an OSEP
        // candidate types in whatever their control panel actually said.
        points: t.points === null ? null : (Number(t.points) || 0),
        pointsUnknown: !!t.pointsUnknown,
        flags: (t.flags || []).map(function (f) {
          return {
            id: f.id, label: f.label,
            points: f.points === null ? null : (Number(f.points) || 0),
            pointsUnknown: !!f.pointsUnknown
          };
        }),
        machineId: "", status: "pending", elapsedMs: 0, enteredAt: 0,
        phase: firstPhaseId(preset, t),
        done: {}, captures: {}, notes: ""
      };
    });
  }

  function makeTasks(preset) {
    var n = Number(preset.taskCount) || 0;
    var out = [];
    for (var i = 1; i <= n; i++) {
      out.push({
        id: "t" + i, n: i, title: "", domainId: "", context: "", contextConfirmedAt: 0,
        startedAt: 0, spentMs: 0, status: "todo", flagged: false,
        verifyCmd: "", verifiedAt: 0, notes: ""
      });
    }
    return out;
  }

  function createSession(preset) {
    var s = {
      id: uid("s-"),
      presetId: preset.id,
      kind: preset.kind,
      createdAt: Date.now(),
      startedAt: 0,
      finishedAt: 0,
      activeTargetKey: "",
      targets: makeTargets(preset),
      tasks: makeTasks(preset),
      attempts: [],
      budgets: {},
      preflight: {},
      lastContext: "",
      report: { writeupId: "", savedAt: 0 },
      ui: {}
    };
    DOC.sessions.push(s);
    DOC.activeSessionId = s.id;
    touch();
    return s;
  }

  function endSession(s) {
    stopTargetClock(s);
    stopTaskClocks(s);
    s.finishedAt = Date.now();
    touch();
  }
  function reopenSession(s) {
    s.finishedAt = 0;
    DOC.activeSessionId = s.id;
    touch();
  }
  function deleteSession(s) {
    DOC.sessions = sessions().filter(function (x) { return x.id !== s.id; });
    if (DOC.activeSessionId === s.id) DOC.activeSessionId = "";
    touch();
  }

  // ── Time on target ──
  // Exactly one target accrues time at a time. That is what "time on target"
  // means to someone deciding whether to abandon a box, and a wall-clock
  // per-target total would just report the length of the exam six times over.
  function targetElapsed(target) {
    return (target.elapsedMs || 0) + (target.enteredAt ? Date.now() - target.enteredAt : 0);
  }
  function stopTargetClock(s) {
    (s.targets || []).forEach(function (t) {
      if (t.enteredAt) { t.elapsedMs = (t.elapsedMs || 0) + (Date.now() - t.enteredAt); t.enteredAt = 0; }
      if (t.status === "active") t.status = targetStatus(t, true);
    });
  }
  function enterTarget(s, target) {
    if (s.activeTargetKey === target.key && target.enteredAt) return;
    stopTargetClock(s);
    target.enteredAt = Date.now();
    s.activeTargetKey = target.key;
    if (target.status === "pending") target.status = "active";
    // Machines already auto-logs copied commands to the active target; pointing
    // it at this target is the whole integration, not a reimplementation of it.
    if (target.machineId && typeof APP.setActiveTarget === "function") APP.setActiveTarget(target.machineId);
    touch();
  }
  function targetStatus(target, ignoreActive) {
    if (target.status === "failed" || target.status === "skipped") return target.status;
    var flags = targetFlags(target), got = targetCapturedCount(target);
    if (flags.length && got === flags.length) return "root";
    if (got > 0) return "user";
    if (!ignoreActive && target.status === "active") return "active";
    // ignoreActive is how stopTargetClock demotes the target being left. The
    // earlier branches already claimed every flag-bearing state, so what is left
    // here is genuinely untouched.
    return "pending";
  }
  function statusLabel(st) {
    return { pending: S("taskTodo"), active: "…", user: S("captured"), root: S("done"), failed: S("taskFailed"), skipped: S("taskSkipped") }[st] || st;
  }

  // ── Machines integration ──
  function machines() { return (typeof APP.getMachines === "function" && APP.getMachines()) || []; }
  function machineFor(target) {
    if (!target || !target.machineId) return null;
    return machines().filter(function (m) { return m.id === target.machineId; })[0] || null;
  }
  function createMachineFor(session, preset, target, name) {
    return Promise.resolve(APP.api("POST", "/api/machines", {
      name: name || target.label || preset.name,
      ip: "",
      os: "unknown",
      platform: preset.name,
      tags: ["session", preset.id]
    })).then(function (m) {
      if (!m || !m.id) { toast(S("loadFail"), "error"); return null; }
      target.machineId = m.id;
      touch();
      if (typeof APP.reloadMachines === "function") return Promise.resolve(APP.reloadMachines()).then(function () { return m; });
      return m;
    });
  }

  // Copying a command from the queue has to land in the machine's own timeline,
  // the same way copying one from the corpus does. app.js routes its copies
  // through recordHistory(); CS_APP.copyToClipboard does not, so the append is
  // made here against the machine record itself — the same field, the same
  // de-duplication, the same 500-entry cap. Orchestrating the existing timeline,
  // not forking it.
  function logCommand(target, text) {
    var m = machineFor(target);
    if (!m || !text) return;
    m.timeline = Array.isArray(m.timeline) ? m.timeline : [];
    var last = m.timeline[m.timeline.length - 1];
    if (last && last.type === "cmd" && last.text === text) return;
    m.timeline.push({ ts: Date.now(), type: "cmd", text: text });
    if (m.timeline.length > 500) m.timeline = m.timeline.slice(-500);
    APP.api("PUT", "/api/machines/" + m.id, { timeline: m.timeline });
  }
  function copyCmd(text, target, onOk) {
    if (typeof APP.copyToClipboard !== "function") return;
    APP.copyToClipboard(text, function () {
      if (target) logCommand(target, text);
      if (onOk) onOk();
      toast(S("copied"), "ok");
    });
  }
  // A copy button that reports the real outcome in place, matching the corpus
  // cards' behaviour so the two views feel like one app.
  function wireCopy(button, getText, target) {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      var text = getText();
      copyCmd(text, target, function () {
        // Keep the NODES, not the text. The label is an icon plus a text node
        // now, and restoring a string would leave the button permanently bare.
        var was = Array.prototype.slice.call(button.childNodes);
        button.replaceChildren(ico("check", "icon-sm"));
        button.classList.add("copied");
        setTimeout(function () {
          button.replaceChildren.apply(button, was);
          button.classList.remove("copied");
        }, 1200);
      });
    });
  }

  // ── Task clocks ──
  function taskElapsed(task) {
    return (task.spentMs || 0) + (task.startedAt ? Date.now() - task.startedAt : 0);
  }
  function stopTaskClocks(s) {
    (s.tasks || []).forEach(function (t) {
      if (t.startedAt) { t.spentMs = (t.spentMs || 0) + (Date.now() - t.startedAt); t.startedAt = 0; }
    });
  }
  function startTask(s, task) {
    stopTaskClocks(s);
    task.startedAt = Date.now();
    if (task.status === "todo") task.status = "doing";
    touch();
  }

  // ── Attempts ──
  function addAttempt(s, scope, text, outcome, why) {
    if (!String(text || "").trim()) return null;
    var a = {
      id: uid("a-"), ts: Date.now(), scope: scope || "",
      text: String(text).trim(), outcome: outcome || "fail", why: String(why || "").trim()
    };
    s.attempts = Array.isArray(s.attempts) ? s.attempts : [];
    s.attempts.push(a);
    touch();
    return a;
  }

  // ══════════════════════════════════════════════════════════════════
  // View shell
  // ══════════════════════════════════════════════════════════════════

  var host = null;                 // the container app.js hands us
  var view = { name: "picker", targetKey: "", taskId: "", stuck: false, keys: false };
  var tickTimer = null;
  var tickHandlers = [];

  // A self-rescheduling timeout rather than setInterval: it corrects drift, and
  // a single handle is trivially cancelled when the view unmounts — a stray
  // interval repainting a detached tree is how a "fast" app becomes a hot phone.
  function startTicking() {
    if (tickTimer) return;
    var step = function () {
      tickTimer = null;
      if (!tickHandlers.length) return;
      tickHandlers.forEach(function (fn) { try { fn(); } catch { /* one bad clock must not stop the others */ } });
      tickTimer = setTimeout(step, 1000);
    };
    tickTimer = setTimeout(step, 1000);
  }
  function stopTicking() {
    if (tickTimer) { clearTimeout(tickTimer); tickTimer = null; }
    tickHandlers = [];
  }
  function onTick(fn) { tickHandlers.push(fn); startTicking(); }

  // Repaint our own subtree. Never APP.render() — that re-enters this module
  // through the view dispatcher and would recurse.
  function paint() {
    if (!host) return;
    stopTicking();
    host.innerHTML = "";
    host.appendChild(buildView());
  }

  function buildView() {
    // docError only ever comes from GET /api/exam, so the retry re-issues that
    // one request — the corpus is already in hand by the time this can render.
    if (docError) return errorPane(docError, function () { docError = null; docPromise = null; loadDoc().then(paint); }, "doc");
    if (!DOC) return loadingPane();
    var s = activeSession();
    if (!s || view.name === "picker") return buildPicker();
    var preset = presetById(s.presetId);
    if (!preset) return errorPane(S("loadFail"), function () { DOC.activeSessionId = ""; touch(); view.name = "picker"; paint(); });
    if (view.name === "report") return buildReport(s, preset);
    if (s.kind === "tasks") return buildTaskMode(s, preset);
    if (view.name === "target") {
      var target = (s.targets || []).filter(function (t) { return t.key === view.targetKey; })[0];
      if (target) return buildTargetPanel(s, preset, target);
    }
    return buildCockpit(s, preset);
  }

  function loadingPane() {
    var w = el("div", "no-results");
    w.appendChild(iconEl("h3", "", "clock", S("sessions")));
    w.appendChild(el("p", "", S("loading")));
    return w;
  }
  // Two unrelated failures used to share one headline and one hint. The 600KB
  // fact table failing to fetch and GET /api/exam failing to answer break for
  // different reasons, and pointing someone at session-data.js when the backend
  // returned an error sends them to the one file that is working. `kind` is
  // "doc" for the saved document, anything else for the corpus.
  function errorPane(msg, onRetry, kind) {
    var isDoc = kind === "doc";
    var w = el("div", "no-results");
    w.appendChild(iconEl("h3", "", "alert", S(isDoc ? "docFail" : "loadFail")));
    w.appendChild(el("p", "", msg));
    w.appendChild(el("p", "", S(isDoc ? "docFailHint" : "loadFailHint")));
    var b = btn("btn btn-primary", S("retry"), onRetry);
    w.appendChild(b);
    return w;
  }

  // ── Save status ──
  // Reports the real outcome of the write. A failure stays on screen until it is
  // resolved, because it is the only lasting warning anyone gets that the last
  // twenty minutes of a session are not on disk.
  function saveStatusEl() {
    var wrap = el("div", "note-saved");
    wrap.style.marginLeft = "0";
    var text = el("span", "", "");
    var retry = btn("btn btn-secondary btn-sm", S("saveRetry"), retrySave);
    retry.hidden = true;
    retry.style.marginLeft = "8px";
    wrap.appendChild(text);
    wrap.appendChild(retry);
    var apply = function (state, message) {
      retry.hidden = state !== "error";
      if (state === "saving") { text.textContent = S("saving"); wrap.style.color = "var(--text-tertiary)"; return; }
      if (state === "ok") { text.replaceChildren(ico("check", "icon-sm"), document.createTextNode(" " + S("saved"))); wrap.style.color = "var(--accent-green)"; return; }
      if (state === "error") { text.replaceChildren(ico("alert", "icon-sm"), document.createTextNode(" " + (message || S("saveFail")))); wrap.style.color = "var(--accent-red)"; return; }
      text.textContent = "";
    };
    apply(saveState, saveMessage);
    onSaveState(function (state, message) { if (wrap.parentNode) apply(state, message); });
    return wrap;
  }

  // ── Confidence badge ──
  // "official" and "inferred" must never look alike. The colour-bearing classes
  // are the existing pill modifiers; the st-official / st-inferred names ride
  // along so the stylesheet can give them their own treatment later without a
  // change here.
  function confidenceBadge(confidence) {
    var official = confidence === "official";
    var b = el("span", "exam-pill " + (official ? "st-root st-official" : "st-skipped st-inferred"),
      official ? S("official") : S("inferred"));
    b.title = official ? S("officialTip") : S("inferredTip");
    b.dataset.confidence = official ? "official" : "inferred";
    return b;
  }

  function sourceLink(url) {
    if (!/^https?:\/\//i.test(String(url || ""))) return null;
    var a = link(url, "", "session-doc-url");
    a.appendChild(ico("external", "icon-sm"));
    a.title = url;
    a.style.marginLeft = "6px";
    return a;
  }

  // ══════════════════════════════════════════════════════════════════
  // Preset picker
  // ══════════════════════════════════════════════════════════════════

  function buildPicker() {
    var wrap = frag();

    var head = el("div", "exam-header");
    var info = el("div", "exam-header-info");
    info.appendChild(iconEl("div", "exam-title", "target", S("sessions")));
    info.appendChild(el("div", "exam-sub", S("pickHint")));
    head.appendChild(info);
    head.appendChild(saveStatusEl());
    wrap.appendChild(head);

    // Anything already in progress comes first: reopening yesterday's box should
    // not mean scrolling past sixteen exams you are not sitting.
    var open = sessions().filter(function (s) { return !s.finishedAt; });
    var closed = sessions().filter(function (s) { return !!s.finishedAt; });
    if (open.length) {
      wrap.appendChild(el("h3", "machine-subhead", S("resume")));
      wrap.appendChild(sessionList(open, false));
    }

    var data = DATA();
    var byKind = { targets: [], tasks: [] };
    (data.presets || []).forEach(function (p) { (byKind[p.kind] || byKind.targets).push(p); });

    ["targets", "tasks"].forEach(function (kind) {
      if (!byKind[kind].length) return;
      wrap.appendChild(el("h3", "machine-subhead", kind === "targets" ? S("targetsKind") : S("tasksKind")));
      var grid = el("div", "session-presets");
      byKind[kind].forEach(function (p) { grid.appendChild(presetCard(p)); });
      wrap.appendChild(grid);
    });

    if (closed.length) {
      wrap.appendChild(el("h3", "machine-subhead", S("done")));
      wrap.appendChild(sessionList(closed, true));
    }
    return wrap;
  }

  function presetCard(preset) {
    var card = btn("session-preset", null, function () { startPreset(preset); });
    var top = el("div", "session-preset-top");
    top.appendChild(presetIcon(preset));
    top.appendChild(el("span", "session-preset-name", preset.name));
    if (preset.status === "retired" || hasEnforceable(preset, "banner:retired")) {
      top.appendChild(el("span", "session-preset-tag", "retired"));
    }
    card.appendChild(top);
    card.appendChild(el("div", "session-preset-desc", preset.tagline || ""));

    var meta = el("div", "session-preset-meta");
    var shape = presetShape(preset);
    if (shape) meta.appendChild(el("span", "", shape));
    card.appendChild(meta);
    return card;
  }

  function sessionList(list, isClosed) {
    var box = el("div", "session-tasks");
    list.forEach(function (s) {
      var preset = presetById(s.presetId);
      var row = el("div", "session-task");
      var top = el("div", "session-task-top");
      top.appendChild(presetIcon(preset));
      top.appendChild(el("span", "session-task-name", (preset && preset.name) || s.presetId));

      var sc = sessionScore(s);
      var summary = [];
      if (preset && scoreMode(preset) === "denominator") summary.push(sc.earned + " " + S("of") + " " + preset.totalPoints);
      else if (sc.totalFlags) summary.push(sc.capturedFlags + " " + S("of") + " " + sc.totalFlags + " " + S("objectives"));
      if (s.kind === "tasks") {
        var doneN = (s.tasks || []).filter(function (t) { return t.status === "verified"; }).length;
        summary.push(doneN + " " + S("of") + " " + (s.tasks || []).length + " " + S("taskVerified").toLowerCase());
      }
      summary.push(fmtDateTime(s.createdAt));
      top.appendChild(el("span", "session-task-pts", summary.join(" · ")));

      top.appendChild(btn("btn btn-secondary btn-sm", isClosed ? S("reopen") : S("resumeOne"), function () {
        if (isClosed) reopenSession(s);
        DOC.activeSessionId = s.id;
        view = { name: "cockpit", targetKey: "", taskId: "", stuck: false, keys: false };
        touch();
        paint();
      }));
      top.appendChild(iconBtn("btn btn-secondary btn-sm", "trash", "", function () { confirmInline(row, S("confirmDel"), function () { deleteSession(s); paint(); }); }, S("del")));
      row.appendChild(top);
      box.appendChild(row);
    });
    return box;
  }

  // Inline confirmation rather than window.confirm: a native dialog steals focus
  // from the page and, on the mobile layout, lands somewhere the user cannot see
  // what it is about to delete.
  function confirmInline(anchor, question, onYes) {
    var existing = anchor.querySelector(".session-confirm");
    if (existing) { existing.remove(); return; }
    var bar = el("div", "session-confirm machine-report-bar");
    bar.appendChild(el("span", "machine-report-hint", question));
    // style.css styles ".session-confirm .session-confirm-actions" — margin-left
    // auto on desktop, full width below the breakpoint. Without the wrapper the
    // buttons sit flush against the question and the mobile rule never applies.
    var actions = el("div", "session-confirm-actions");
    actions.appendChild(btn("btn btn-primary btn-sm", S("yes"), function () { bar.remove(); onYes(); }));
    actions.appendChild(btn("btn btn-secondary btn-sm", S("no"), function () { bar.remove(); }));
    bar.appendChild(actions);
    anchor.appendChild(bar);
  }

  function startPreset(preset) {
    var s = createSession(preset);
    view = { name: "cockpit", targetKey: "", taskId: "", stuck: false, keys: false };
    // Quick Lab is one target, and a preset with one target has nothing to
    // choose between — so the machine is created, linked and opened in a single
    // click. Anything more ceremonial and a weeknight lab user closes the tab.
    if (preset.kind === "targets" && (s.targets || []).length === 1) {
      var only = s.targets[0];
      enterTarget(s, only);
      view.name = "target";
      view.targetKey = only.key;
      createMachineFor(s, preset, only, preset.id === "quick-lab" ? "" : only.label).then(function () { paint(); });
    }
    paint();
  }

  // ══════════════════════════════════════════════════════════════════
  // Cockpit — adapts to the preset. Everything below is behind a gate;
  // a Quick Lab session reaches almost none of it.
  // ══════════════════════════════════════════════════════════════════

  function sessionHeader(s, preset, subtitle) {
    var head = el("div", "exam-header");
    var info = el("div", "exam-header-info");
    var title = el("div", "exam-title");
    title.appendChild(presetIcon(preset));
    title.appendChild(document.createTextNode(" " + preset.name));
    info.appendChild(title);
    info.appendChild(el("div", "exam-sub", subtitle || presetShape(preset)));
    head.appendChild(info);

    if (hasClock(preset)) head.appendChild(clockBlock(s, preset));

    var actions = el("div", "exam-header-actions");
    if (view.name !== "cockpit") {
      actions.appendChild(iconBtn("btn btn-secondary btn-sm", "arrow-left", S("back"), function () {
        view.name = "cockpit"; view.targetKey = ""; view.taskId = ""; paint();
      }));
    }
    actions.appendChild(iconBtn("btn btn-secondary btn-sm", "file", (s.kind === "tasks" ? S("retro") : S("report")), function () {
      view.name = "report"; paint();
    }));
    actions.appendChild(iconBtn("btn btn-secondary btn-sm", "keyboard", S("keys") + " (h)", function () {
      view.keys = !view.keys; paint();
    }));
    actions.appendChild(btn("btn btn-secondary btn-sm", S("endSession"), function () {
      confirmInline(head, S("confirmEnd"), function () { endSession(s); DOC.activeSessionId = ""; view.name = "picker"; touch(); paint(); });
    }));
    actions.appendChild(iconBtn("btn btn-secondary btn-sm", "menu", "", function () {
      DOC.activeSessionId = ""; view.name = "picker"; touch(); paint();
    }, S("pickPreset")));
    head.appendChild(actions);
    head.appendChild(saveStatusEl());
    return head;
  }

  // The clock exists only when the preset publishes a duration. A disabled or
  // zeroed timer would still put a clock on a weeknight lab user's screen, which
  // is the thing they came here to not have.
  function clockBlock(s, preset) {
    var box = el("div", "");
    box.style.textAlign = "right";
    if (!s.startedAt) {
      var start = iconBtn("btn btn-primary", "play", S("startClock"), function () { s.startedAt = Date.now(); touch(); paint(); });
      box.appendChild(start);
      box.appendChild(el("div", "exam-clock-label", S("startClockHint")));
      return box;
    }
    var clock = el("div", "exam-clock", "");
    var label = el("div", "exam-clock-label", S("remaining"));
    box.appendChild(clock);
    box.appendChild(label);

    var deadlineLine = null;
    if (hasReportDeadline(preset)) {
      deadlineLine = el("div", "exam-clock-label", "");
      box.appendChild(deadlineLine);
    }
    var totalMs = preset.durationMin * 60000;
    var refresh = function () {
      var left = s.startedAt + totalMs - Date.now();
      clock.textContent = fmtClock(left);
      clock.classList.toggle("warn", left <= totalMs * 0.25 && left > totalMs * 0.1);
      clock.classList.toggle("critical", left <= totalMs * 0.1);
      label.textContent = left < 0 ? S("overdue") : S("remaining");
      if (deadlineLine) {
        var due = s.startedAt + totalMs + preset.reportHours * 3600000;
        deadlineLine.textContent = S("reportDue") + " " + fmtDateTime(due) +
          (Date.now() > due ? " · " + S("overdue") : " · " + fmtShort(due - Date.now()));
      }
    };
    refresh();
    onTick(refresh);
    return box;
  }

  function buildCockpit(s, preset) {
    var wrap = frag();
    wrap.appendChild(sessionHeader(s, preset));
    if (view.keys) wrap.appendChild(keysPanel(s.kind));

    var score = scoreBlock(s, preset);
    if (score) wrap.appendChild(score);

    var budgets = budgetBlock(s, preset);
    if (budgets) wrap.appendChild(budgets);

    wrap.appendChild(targetGrid(s, preset));
    wrap.appendChild(attemptsPanel(s, ""));
    wrap.appendChild(honestyPanel(preset));
    return wrap;
  }

  // ── Score ──
  function scoreBlock(s, preset) {
    var mode = scoreMode(preset);
    var sc = sessionScore(s);
    var box = el("div", "exam-score");
    var top = el("div", "exam-score-top");

    if (mode === "unknown") {
      // OffSec publishes the pass mark and nothing else. Showing the structure
      // without the numbers is the honest rendering; inventing a per-flag value
      // so the bar has something to fill is not.
      var pts = el("div", "exam-score-points", sc.capturedFlags + " " + S("of") + " " + sc.totalFlags);
      pts.appendChild(el("small", "", S("captured")));
      top.appendChild(pts);
      top.appendChild(el("div", "exam-score-pass", preset.passMark + " " + S("toPass") + " · " + S("pointsFromPanel")));
    } else if (mode === "denominator") {
      var p1 = el("div", "exam-score-points", String(sc.earned));
      p1.appendChild(el("small", "", "/ " + preset.totalPoints));
      top.appendChild(p1);
      var pass = el("div", "exam-score-pass" + (sc.earned >= preset.passMark ? " reached" : ""),
        preset.passMark + " " + S("toPass"));
      top.appendChild(pass);
    } else if (mode === "count-up") {
      // No published maximum, so the bar counts up to the pass mark rather than
      // against a denominator this app would have to make up.
      var p2 = el("div", "exam-score-points", String(sc.earned));
      p2.appendChild(iconEl("small", "", "arrow-right", String(preset.passMark)));
      top.appendChild(p2);
      top.appendChild(el("div", "exam-score-pass" + (sc.earned >= preset.passMark ? " reached" : ""),
        preset.passMark + " " + S("toPass")));
    } else if (mode === "derived") {
      var p3 = el("div", "exam-score-points", String(sc.earned));
      p3.appendChild(el("small", "", "/ " + sc.possible));
      top.appendChild(p3);
      top.appendChild(el("div", "exam-score-pass", S("derivedTotal")));
    } else {
      return null;
    }
    box.appendChild(top);

    var bar = el("div", "exam-score-bar");
    (s.targets || []).forEach(function (t) {
      var flags = targetFlags(t), got = targetCapturedCount(t);
      var cls = "exam-score-seg";
      if (t.status === "failed") cls += " failed";
      else if (flags.length && got === flags.length) cls += " full";
      else if (got > 0) cls += " partial";
      var seg = el("div", cls, "");
      seg.title = t.label + " — " + got + "/" + flags.length;
      bar.appendChild(seg);
    });
    if (bar.children.length) box.appendChild(bar);

    var legend = el("div", "exam-score-legend");
    [["full", S("done")], ["partial", S("captured")], ["failed", S("taskFailed")], ["pending", S("taskTodo")]].forEach(function (pair) {
      var sp = el("span", "", "");
      sp.appendChild(el("i", pair[0], ""));
      sp.appendChild(document.createTextNode(pair[1]));
      legend.appendChild(sp);
    });
    box.appendChild(legend);

    if (preset.scoringNote) {
      var note = el("div", "machine-report-hint", preset.scoringNote);
      note.style.marginTop = "8px";
      box.appendChild(note);
    }

    var route = routeBlock(s, preset);
    if (route) box.appendChild(route);
    return box;
  }

  // The route to the pass mark. This is the only screen element written for a
  // single moment: hour fourteen, when the question stops being "how am I doing"
  // and becomes "what is the least I still have to land".
  function routeBlock(s, preset) {
    var r = routeForSession(s, preset);
    if (!r) return null;
    var box = el("div", "machine-nextsteps");
    box.appendChild(el("div", "machine-nextsteps-label", S("routeTitle")));
    var list = el("ul", "", "");
    if (r.reached) {
      list.appendChild(iconEl("li", "", "check", S("routeReached")));
    } else if (!r.fewest) {
      list.appendChild(el("li", "", S("routeShort") + " " + r.short));
    } else {
      var describe = function (picks, sum) {
        return picks.map(function (f) { return f.target + " · " + f.label + " (" + f.points + ")"; }).join("  +  ") + "  =  " + sum;
      };
      list.appendChild(el("li", "", S("routeNeed") + ": " + r.need));
      list.appendChild(el("li", "", describe(r.least, r.leastPoints)));
      if (!r.same) list.appendChild(el("li", "", S("routeOr") + " " + describe(r.fewest, r.fewestPoints)));
    }
    box.appendChild(list);
    return box;
  }

  // ── Budgets ──
  // Advisory counters over what the user records. Nothing here blocks anything:
  // the app cannot see a revert or an msfconsole, and a counter that pretended
  // to would be worse than no counter at all.
  function budgetBlock(s, preset) {
    var budgets = budgetsFor(preset);
    if (!budgets.length) return null;
    var box = el("div", "session-domains");
    var head = el("div", "machine-section-head");
    head.appendChild(el("h3", "", S("budgets")));
    head.appendChild(el("span", "machine-report-hint", S("budgetAdvisory")));
    box.appendChild(head);

    budgets.forEach(function (b) {
      s.budgets = s.budgets || {};
      var state = s.budgets[b.key] || (s.budgets[b.key] = { used: 0, resetsUsed: 0 });
      var row = el("div", "session-budget");
      var name = el("span", "session-domain-name", b.key);
      name.title = b.text;
      row.appendChild(name);

      var barWrap = el("div", "session-budget-bar");
      var fill = el("div", "session-budget-fill", "");
      var effLimit = b.limit + (state.resetsUsed > 0 ? b.limit * state.resetsUsed : 0);
      var pct = effLimit > 0 ? Math.min(100, (state.used / effLimit) * 100) : 0;
      fill.style.width = pct + "%";
      if (pct >= 100) fill.classList.add("over");
      else if (pct >= 75) fill.classList.add("warn");
      barWrap.appendChild(fill);
      row.appendChild(barWrap);

      var text = el("span", "session-budget-text" + (state.used > effLimit ? " over" : ""),
        state.used + " / " + effLimit + " " + S("budgetUsed"));
      row.appendChild(text);

      row.appendChild(btn("btn btn-secondary btn-sm", "+", function () {
        state.used += 1; touch(); paint();
      }, S("budgetPlus")));
      row.appendChild(iconBtn("btn btn-secondary btn-sm", "minus", "", function () {
        state.used = Math.max(0, state.used - 1); touch(); paint();
      }, S("budgetMinus")));
      if (b.resets > 0 && state.resetsUsed < b.resets) {
        row.appendChild(iconBtn("btn btn-secondary btn-sm", "reset", S("budgetReset"), function () {
          state.resetsUsed += 1; touch(); paint();
        }));
      }
      box.appendChild(row);

      var why = el("div", "session-attempt-why", "");
      why.appendChild(confidenceBadge(b.confidence));
      why.appendChild(document.createTextNode(" " + b.text));
      var sl = sourceLink(b.source);
      if (sl) why.appendChild(sl);
      box.appendChild(why);
    });
    return box;
  }

  // ── Target grid ──
  function targetGrid(s, preset) {
    var box = el("div", "");
    var head = el("div", "machine-section-head");
    head.appendChild(el("h3", "", S("targets")));
    var actions = el("div", "exam-header-actions");
    // OSEP ships no targets at all — the number of machines is a deliberate exam
    // secret — and a CTF board grows as challenges open, so adding one is a
    // first-class action rather than a hidden edit.
    actions.appendChild(btn("btn btn-secondary btn-sm", S("addTarget"), function () { addTargetRow(s, preset); }));
    head.appendChild(actions);
    box.appendChild(head);

    if (hasEnforceable(preset, "report:order=grading-order")) {
      box.appendChild(el("p", "machine-report-hint", S("reportOrder")));
    }

    var grid = el("div", "exam-targets");
    (s.targets || []).forEach(function (t, i) {
      grid.appendChild(targetCard(s, preset, t, i));
    });
    if (!(s.targets || []).length) {
      var empty = el("p", "machine-hosts-empty", preset.scoringNote ? "" : S("enumEmpty"));
      grid.appendChild(empty);
    }
    box.appendChild(grid);
    return box;
  }

  function targetCard(s, preset, t, index) {
    var st = targetStatus(t);
    var card = el("div", "exam-card" + (st === "root" ? " owned" : "") + (s.activeTargetKey === t.key ? " active" : ""));
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    var open = function () { openTarget(s, t); };
    card.addEventListener("click", open);
    card.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && e.target === card) { e.preventDefault(); open(); }
    });

    var top = el("div", "exam-card-top");
    var cardIcon = el("span", "exam-card-icon");
      if (index < 9) cardIcon.textContent = String(index + 1);
      else cardIcon.appendChild(ico("diamond", "icon-sm"));
      top.appendChild(cardIcon);
    top.appendChild(el("span", "exam-card-name", t.label));
    var flags = targetFlags(t), got = targetCapturedCount(t);
    if (t.pointsUnknown) top.appendChild(el("span", "exam-card-pts", "?"));
    else if (scoreMode(preset) !== "none") top.appendChild(el("span", "exam-card-pts", targetPoints(t) + "/" + flags.reduce(function (a, f) { return a + (Number(f.points) || 0); }, 0)));
    card.appendChild(top);

    var m = machineFor(t);
    card.appendChild(el("div", "exam-card-ip", m ? (m.ip || m.name) : S("noMachine")));

    var meta = el("div", "exam-card-meta");
    meta.appendChild(el("span", "exam-pill st-" + st, statusLabel(st)));
    meta.appendChild(el("span", "machine-tag", got + "/" + flags.length + " " + S("flags")));
    if (hasClock(preset) || scoreMode(preset) !== "none") {
      var elapsed = el("span", "exam-card-elapsed", "");
      var refresh = function () { elapsed.textContent = targetElapsed(t) ? fmtShort(targetElapsed(t)) + " " + S("onTarget") : ""; };
      refresh();
      if (t.enteredAt) onTick(refresh);
      meta.appendChild(elapsed);
    }
    card.appendChild(meta);
    return card;
  }

  function openTarget(s, t) {
    enterTarget(s, t);
    view.name = "target";
    view.targetKey = t.key;
    paint();
  }

  function addTargetRow(s, preset) {
    var key = uid("tg-");
    s.targets = s.targets || [];
    s.targets.push({
      key: key, label: "Target " + (s.targets.length + 1), kind: "standalone",
      points: 0, pointsUnknown: !!preset.pointsUnknown,
      flags: [{ id: key + "-local", label: "local.txt", points: 0, pointsUnknown: !!preset.pointsUnknown },
        { id: key + "-proof", label: "proof.txt", points: 0, pointsUnknown: !!preset.pointsUnknown }],
      machineId: "", status: "pending", elapsedMs: 0, enteredAt: 0,
      // A hand-added target is a stand-alone host, so it starts on the
      // stand-alone chain — not on whatever phase the preset happens to list
      // first, which for OSCP+ is the exam-wide setup block.
      phase: firstPhaseId(preset, { kind: "standalone" }),
      done: {}, captures: {}, notes: ""
    });
    touch();
    paint();
  }

  // ══════════════════════════════════════════════════════════════════
  // Per-target panel
  // ══════════════════════════════════════════════════════════════════

  function buildTargetPanel(s, preset, t) {
    var wrap = frag();
    wrap.appendChild(sessionHeader(s, preset, t.label));
    if (view.keys) wrap.appendChild(keysPanel(s.kind));

    wrap.appendChild(machineBar(s, preset, t));
    if (view.stuck) wrap.appendChild(stuckPanel(s, preset, t));

    wrap.appendChild(flagsSection(s, preset, t));
    wrap.appendChild(queueSection(s, preset, t));
    wrap.appendChild(phaseSection(s, preset, t));
    wrap.appendChild(attemptsPanel(s, t.key));
    return wrap;
  }

  // Machines already owns services, credentials, evidence and the timeline. This
  // bar is the seam between the two views, not a second copy of them.
  function machineBar(s, preset, t) {
    var m = machineFor(t);
    var bar = el("div", "active-target-bar" + (m ? " on" : ""));
    if (m) {
      var lbl = el("span", "active-target-label", "");
      lbl.appendChild(document.createTextNode(m.name + (m.ip ? " · " : "")));
      if (m.ip) lbl.appendChild(el("code", "machine-detail-ip", m.ip));
      bar.appendChild(lbl);
      bar.appendChild(iconBtn("btn btn-secondary btn-sm", "external", S("openMachine"), function () {
        if (typeof APP.setActiveTarget === "function") APP.setActiveTarget(m.id);
        if (typeof APP.navigate === "function") APP.navigate("#machines/" + m.id);
      }));
    } else {
      bar.appendChild(el("span", "active-target-label", S("noMachine")));
      var name = input("checklist-add-input", S("machineName"), t.label);
      bar.appendChild(name);
      bar.appendChild(btn("btn btn-primary btn-sm", S("createMachine"), function () {
        createMachineFor(s, preset, t, name.value.trim()).then(paint);
      }));
      var list = machines();
      if (list.length) {
        var sel = document.createElement("select");
        sel.className = "form-select";
        sel.setAttribute("aria-label", S("linkMachine"));
        var blank = document.createElement("option");
        blank.value = ""; blank.textContent = S("linkMachine");
        sel.appendChild(blank);
        list.forEach(function (mm) {
          var o = document.createElement("option");
          o.value = mm.id;
          o.textContent = mm.name + (mm.ip ? " (" + mm.ip + ")" : "");
          sel.appendChild(o);
        });
        sel.addEventListener("change", function () {
          if (!sel.value) return;
          t.machineId = sel.value;
          if (typeof APP.setActiveTarget === "function") APP.setActiveTarget(sel.value);
          touch(); paint();
        });
        bar.appendChild(sel);
      }
    }
    bar.appendChild(iconBtn("btn btn-secondary btn-sm", "lifebuoy", S("stuck") + " (s)", function () { view.stuck = !view.stuck; paint(); }));
    return bar;
  }

  // ── Flags + evidence compliance ──
  function flagsSection(s, preset, t) {
    var sec = el("div", "machine-section");
    sec.appendChild(el("h3", "", S("flags")));
    var asksHow = presetAsksHow(preset);

    targetFlags(t).forEach(function (f) {
      t.captures = t.captures || {};
      var cap = t.captures[f.id] || (t.captures[f.id] = { value: "", at: 0, via: "", met: {}, override: null });
      var box = el("div", "checklist-phase" + (cap.at ? " current" : ""));

      var head = el("div", "checklist-phase-header");
      head.appendChild(el("span", "checklist-phase-name", f.label));
      if (f.pointsUnknown) head.appendChild(el("span", "checklist-phase-count", "? " + S("pointsFromPanel")));
      else if (Number(f.points) > 0) head.appendChild(el("span", "checklist-phase-count", f.points));
      if (cap.at) head.appendChild(iconEl("span", "session-evidence ok", "check", S("capturedAt") + " " + fmtTime(cap.at)));
      box.appendChild(head);

      var body = el("div", "checklist-body");
      body.style.padding = "10px 12px";

      var val = input("checklist-add-input", S("flagValue"), cap.value);
      // The `c` shortcut needs a hook it can trust. A bare "[placeholder]" used
      // to resolve to whichever input happened to render first (the machine-name
      // box), so the key advertised as Capture landed somewhere else entirely.
      // The value says which flag is still open so `c` can prefer that one.
      val.setAttribute("data-session-capture", cap.at ? "done" : "open");
      val.addEventListener("change", function () { cap.value = val.value.trim(); touch(); });
      body.appendChild(val);

      // OSWA's requirement depends on HOW the value was obtained, so nothing is
      // shown until that is answered — a web capture and a shell capture have
      // genuinely different proof obligations and showing both trains people to
      // skim past the one that applies.
      if (asksHow) {
        var row = el("div", "machine-report-bar");
        row.appendChild(el("span", "machine-report-hint", S("howCaptured")));
        [["web", S("viaWeb")], ["shell", S("viaShell")]].forEach(function (pair) {
          var b = btn("host-chip" + (cap.via === pair[0] ? " on" : ""), pair[1], function () {
            cap.via = pair[0]; touch(); paint();
          });
          row.appendChild(b);
        });
        body.appendChild(row);
      }

      var rules = evidenceRulesFor(preset, f.id, cap.via);
      var evWrap = el("div", "machine-nextsteps");
      evWrap.appendChild(el("div", "machine-nextsteps-label", S("evidenceReq")));
      if (!rules.length) {
        evWrap.appendChild(el("p", "machine-report-hint",
          asksHow && !cap.via ? S("howCaptured") : S("evidenceNone")));
      } else {
        // One checkbox per applicable rule, never merged. On OSCP+ the control
        // panel submission and the screenshot are two separate requirements and
        // missing either scores zero for the whole target — collapsing them into
        // one tick would hide exactly the failure that costs the most points.
        rules.forEach(function (r, i) {
          var key = evidenceKey(r, i);
          var item = el("label", "checklist-item" + (cap.met[key] ? " done" : ""));
          item.appendChild(checkbox(!!cap.met[key], function (on) {
            if (on) cap.met[key] = true; else delete cap.met[key];
            touch(); paint();
          }));
          var ib = el("div", "checklist-body");
          var line = el("span", "checklist-label", "");
          line.appendChild(confidenceBadge(r.confidence));
          line.appendChild(document.createTextNode(" " + r.requirement));
          var sl = sourceLink(r.source);
          if (sl) line.appendChild(sl);
          ib.appendChild(line);
          item.appendChild(ib);
          evWrap.appendChild(item);
        });
      }
      body.appendChild(evWrap);

      var unmet = unmetEvidence(preset, t, f);
      var actions = el("div", "machine-report-bar");
      if (cap.at) {
        actions.appendChild(btn("btn btn-secondary btn-sm", S("uncapture"), function () {
          cap.at = 0; cap.override = null; touch(); paint();
        }));
        if (cap.override) {
          actions.appendChild(iconEl("span", "session-flag-note", "alert",
            S("overrodeAt") + " (" + cap.override.unmet + ") · " + fmtDateTime(cap.override.at)));
        }
      } else {
        actions.appendChild(iconBtn("btn btn-primary btn-sm", "check", S("captureFlag"), function () {
          cap.value = val.value.trim();
          if (unmet.length) {
            // Warn clearly, then let them through. A hard block on a Saturday
            // night would be nonsense, and on exam day the candidate is the one
            // who knows whether the screenshot exists. The override is recorded
            // so the report can say so rather than quietly claiming compliance.
            confirmInline(actions, unmet.length + " " + S("unmetWarn"), function () {
              cap.at = Date.now();
              cap.override = { at: Date.now(), unmet: unmet.length };
              markTargetProgress(t);
              touch(); paint();
            });
            return;
          }
          cap.at = Date.now();
          cap.override = null;
          markTargetProgress(t);
          touch(); paint();
        }));
        if (unmet.length) actions.appendChild(el("span", "session-evidence missing", unmet.length + " " + S("enumConditional")));
      }
      body.appendChild(actions);
      box.appendChild(body);
      sec.appendChild(box);
    });
    return sec;
  }

  function markTargetProgress(t) {
    var flags = targetFlags(t);
    if (flags.length && targetCapturedCount(t) === flags.length) t.status = "root";
    else if (targetCapturedCount(t) > 0 && t.status === "pending") t.status = "user";
  }

  // ══════════════════════════════════════════════════════════════════
  // Enumeration queue — the drudgery win
  // ══════════════════════════════════════════════════════════════════

  function queueSection(s, preset, t) {
    var sec = el("div", "machine-section");
    // `e` targets this section by name. The old selector (".checklist-hint code")
    // matched 111 nodes on an OSCP+ panel and the first of them was a pre-flight
    // command in the phase checklist — a different section entirely.
    sec.setAttribute("data-session-queue", "1");
    var head = el("div", "machine-section-head");
    head.appendChild(el("h3", "", S("enumQueue")));
    sec.appendChild(head);

    var m = machineFor(t);
    var svcs = (m && m.services) || [];
    if (!svcs.length) {
      var empty = el("div", "session-docs-empty", "");
      empty.appendChild(el("div", "", S("enumEmpty")));
      empty.appendChild(el("div", "", S("enumImport")));
      if (m) {
        empty.appendChild(iconBtn("btn btn-secondary btn-sm", "external", S("openMachine"), function () {
          if (typeof APP.navigate === "function") APP.navigate("#machines/" + m.id);
        }));
      }
      sec.appendChild(empty);
      return sec;
    }

    var q = buildQueue(svcs);
    head.appendChild(el("span", "machine-report-hint", q.groups.length + " " + S("enumQueue").toLowerCase()));

    q.groups.forEach(function (g) { sec.appendChild(probeGroup(g, t)); });

    if (q.uncovered.length) {
      // Said out loud on purpose. A queue that silently drops the ports it has
      // no probe for is a queue that hides part of the attack surface.
      var un = el("div", "exam-rules");
      un.appendChild(el("div", "exam-rules-title", S("enumNoProbe")));
      var ul = el("ul", "", "");
      q.uncovered.forEach(function (svcRow) {
        ul.appendChild(el("li", "", svcRow.port + "/" + svcRow.proto + (svcRow.name ? " " + svcRow.name : "") + (svcRow.version ? " — " + svcRow.version : "")));
      });
      un.appendChild(ul);
      sec.appendChild(un);
    }
    return sec;
  }

  function probeGroup(g, t) {
    var m = machineFor(t);
    var probe = g.probe;
    var box = el("div", "checklist-phase");

    var ports = g.services.map(function (x) { return x.port + "/" + x.proto; }).join(", ");
    var versions = g.services.map(function (x) { return x.version; }).filter(Boolean).join(" · ");

    var head = el("div", "checklist-phase-header");
    head.appendChild(el("span", "checklist-phase-name", probe.service + "  " + ports));
    if (versions) head.appendChild(el("span", "checklist-phase-count", versions));
    box.appendChild(head);

    var body = el("div", "checklist-body");
    body.style.padding = "10px 12px";

    if (probe.note) {
      var note = el("div", "session-attempt-why", probe.note);
      note.style.marginBottom = "8px";
      body.appendChild(note);
    }

    // Split by `when`. The commands you run right now come first and unfolded;
    // the six conditional ones stay behind one control. That split IS the win —
    // an undifferentiated list of six is the thing people stop reading.
    var always = (probe.commands || []).filter(function (c) { return c.when === "always"; });
    var conditional = (probe.commands || []).filter(function (c) { return c.when !== "always"; });

    always.forEach(function (c) { body.appendChild(cmdRow(c, m, t)); });

    if (always.length > 1) {
      var all = iconBtn("btn btn-secondary btn-sm", "copy", S("copyAll"), null);
      wireCopy(all, function () {
        return always.map(function (c) { return resolveCmd(c.cmd, m); }).join("\n");
      }, t);
      body.appendChild(all);
    }

    if (conditional.length) {
      var condBox = el("div", "");
      condBox.hidden = true;
      conditional.forEach(function (c) { condBox.appendChild(cmdRow(c, m, t)); });
      var toggle = btn("btn btn-secondary btn-sm", "+" + conditional.length + " " + S("enumConditional"), function () {
        condBox.hidden = !condBox.hidden;
        toggle.textContent = condBox.hidden
          ? "+" + conditional.length + " " + S("enumConditional")
          : S("enumHideCond");
      });
      body.appendChild(toggle);
      body.appendChild(condBox);
    }

    box.appendChild(body);

    // Collapsing is on the header, matching the machine checklist's behaviour.
    head.style.cursor = "pointer";
    head.addEventListener("click", function () { body.hidden = !body.hidden; });
    return box;
  }

  function cmdRow(c, m, t) {
    var row = el("div", "checklist-item");
    var body = el("div", "checklist-body");
    var label = el("span", "checklist-label", c.label);
    body.appendChild(label);
    if (c.when && c.when !== "always") {
      body.appendChild(el("span", "session-attempt-why", c.when));
    }
    var hint = el("div", "checklist-hint");
    var resolved = resolveCmd(c.cmd, m);
    // textContent, never innerHTML: this string is half corpus and half the
    // user's own IP / username / domain, and there is no highlighting worth an
    // attribute sink.
    var code = el("code", "", resolved);
    hint.appendChild(code);
    var copy = iconBtn("checklist-hint-copy", "copy", "", null, S("copy"));
    wireCopy(copy, function () { return resolved; }, t);
    hint.appendChild(copy);
    body.appendChild(hint);
    row.appendChild(body);
    return row;
  }

  // ── Which phases belong to THIS target ─────────────────────────────────
  // A guide that lists every phase the exam could possibly contain is not a
  // guide. Before this, all six OSCP+ targets showed the same 15 phases: a
  // stand-alone box offered "AD — Domain Compromise", and the domain controller
  // offered "Web Content Discovery". The chain a target belongs to is the whole
  // point of the chain.
  //
  // Driven by phase id rather than a per-preset table, so a preset that ships
  // no AD phases is unaffected and a new preset needs no code change.
  var SHARED_PHASE_RE = /^(setup|preflight|triage|evidence|report|proof|sweep|retro|close|task)/i;
  var AD_PHASE_RE = /^ad[-_]/i;
  // An AD client still has to be escalated locally — SYSTEM is what gets you
  // the machine account and the cached hashes — so the local chain stays.
  var LOCAL_ESC_RE = /^(shell|sitawareness|situational|privesc|local-flag)/i;

  function phasesForTarget(preset, t) {
    var phases = (preset && preset.phases) || [];
    var kind = t && t.kind ? String(t.kind) : "";
    var hasAd = false;
    for (var i = 0; i < phases.length; i++) if (AD_PHASE_RE.test(phases[i].id)) { hasAd = true; break; }
    if (!hasAd || !kind) return phases;

    var isAd = kind.indexOf("ad") === 0;
    var kept = phases.filter(function (ph) {
      if (SHARED_PHASE_RE.test(ph.id)) return true;
      var ad = AD_PHASE_RE.test(ph.id);
      if (!isAd) return !ad;                       // stand-alone: the AD chain is noise
      if (!ad) return LOCAL_ESC_RE.test(ph.id);    // AD host: keep local escalation only
      // Inside the AD chain, position matters. The entry and lateral phases
      // belong to the client machines; domain compromise belongs to the DC.
      if (kind === "ad-dc") return !/initial|lateral/i.test(ph.id);
      return !/domain/i.test(ph.id);
    });
    if (!isAd) return kept;

    // Filtering preserves the preset's order, which lists the AD chain last —
    // so an AD host opened on "setup" then "shell". On an assumed-breach set the
    // work starts at ad-initial, so the chain is re-ordered to how it is
    // actually walked: enter, harvest, escalate locally, then move.
    function rank(ph) {
      if (SHARED_PHASE_RE.test(ph.id) && /^(setup|preflight|triage)/i.test(ph.id)) return 0;
      if (/initial/i.test(ph.id)) return 1;
      if (/harvest/i.test(ph.id)) return 2;
      if (LOCAL_ESC_RE.test(ph.id)) return 3;
      if (/lateral|domain/i.test(ph.id)) return 4;
      return 5; // proof, evidence, report — the close-out
    }
    return kept.slice().sort(function (a, b) { return rank(a) - rank(b); });
  }
  // The per-target starting phase is the first TECHNICAL one. "setup" is
  // exam-wide — opening every target on it tells the user nothing about where
  // this particular target begins.
  function firstPhaseId(preset, t) {
    var list = phasesForTarget(preset, t);
    for (var i = 0; i < list.length; i++) {
      if (!/^(setup|preflight|triage)/i.test(list[i].id)) return list[i].id;
    }
    return (list[0] && list[0].id) || (preset.phases && preset.phases[0] && preset.phases[0].id) || "";
  }

  // ── Phase checklist ──
  // ── The guide ───────────────────────────────────────────────────────────
  // This was a flat list of every phase, all collapsible, all equal. A list of
  // everything is a reference, not a guide: it never says where you are or what
  // to do next. One phase is live at a time, with its goal and its steps; the
  // rest collapse to a rail you can still jump around. Finishing the last step
  // of a phase advances you, which is the single thing that makes it feel like
  // being walked through rather than handed a document.
  function phaseSection(s, preset, t) {
    var sec = el("div", "machine-section session-guide");
    var phases = phasesForTarget(preset, t);
    if (!phases.length) return sec;

    function stats(ph) {
      var items = ph.items || [];
      var done = items.filter(function (_, i) { return t.done[ph.id + ":" + i]; }).length;
      return { done: done, total: items.length, complete: items.length > 0 && done === items.length };
    }
    var idx = 0;
    for (var i = 0; i < phases.length; i++) if (phases[i].id === t.phase) { idx = i; break; }
    var cur = phases[idx];
    var st = stats(cur);

    var head = el("div", "machine-section-head");
    head.appendChild(el("h3", "", S("checklist")));
    head.appendChild(el("span", "guide-counter", (idx + 1) + " " + S("gPhaseOf") + " " + phases.length));
    sec.appendChild(head);

    // Rail: every phase as one dot, so the shape of the whole chain stays
    // visible even though only one of them is open.
    var rail = el("div", "guide-rail");
    phases.forEach(function (ph, i2) {
      var c = stats(ph);
      var dot = btn("guide-dot" + (i2 === idx ? " current" : "") + (c.complete ? " done" : ""), "", function () {
        t.phase = ph.id; touch(); paint();
      }, ph.name + " — " + c.done + "/" + c.total);
      var mark = el("span", "guide-dot-mark");
      if (c.complete) mark.appendChild(ico("check", "icon-sm"));
      else mark.textContent = String(i2 + 1);
      dot.appendChild(mark);
      rail.appendChild(dot);
    });
    sec.appendChild(rail);

    // The live phase
    var box = el("div", "guide-current");
    var ch = el("div", "guide-current-head");
    ch.appendChild(el("h4", "guide-phase-name", cur.name));
    ch.appendChild(el("span", "guide-phase-count", st.done + "/" + st.total));
    box.appendChild(ch);
    if (cur.goal) {
      var goal = el("p", "guide-goal");
      goal.appendChild(el("span", "guide-goal-label", S("gGoal")));
      goal.appendChild(document.createTextNode(" " + cur.goal));
      box.appendChild(goal);
    }

    var m = machineFor(t);
    var steps = el("div", "guide-steps");
    (cur.items || []).forEach(function (item, i2) {
      var key = cur.id + ":" + i2;
      var row = el("label", "checklist-item" + (t.done[key] ? " done" : ""));
      row.appendChild(checkbox(!!t.done[key], function (on) {
        if (on) t.done[key] = true; else delete t.done[key];
        // Advance when the last box is ticked. Never skip backwards, and never
        // past the end — finishing the final phase just says so.
        var after = stats(cur);
        if (on && after.complete && idx < phases.length - 1) {
          t.phase = phases[idx + 1].id;
          if (APP.toast) APP.toast(S("gAdvanced") + " " + phases[idx + 1].name, "ok");
        }
        touch(); paint();
      }));
      var ib = el("div", "checklist-body");
      ib.appendChild(el("span", "checklist-label", item.label));
      if (item.hint) {
        var hint = el("div", "checklist-hint");
        var resolved = resolveCmd(item.hint, m);
        hint.appendChild(el("code", "", resolved));
        var copy = iconBtn("checklist-hint-copy", "copy", "", null, S("copy"));
        wireCopy(copy, function () { return resolved; }, t);
        hint.appendChild(copy);
        ib.appendChild(hint);
      }
      row.appendChild(ib);
      steps.appendChild(row);
    });
    box.appendChild(steps);

    var nav = el("div", "guide-nav");
    if (idx > 0) nav.appendChild(iconBtn("nm-btn", "arrow-left", S("gPrev"), function () { t.phase = phases[idx - 1].id; touch(); paint(); }));
    if (idx < phases.length - 1) {
      var next = nextBtn("nm-btn" + (st.complete ? " nm-btn-primary" : ""), S("gNext"), function () {
        t.phase = phases[idx + 1].id; touch(); paint();
      });
      next.classList.add("guide-next");
      nav.appendChild(next);
    } else if (st.complete) {
      nav.appendChild(el("span", "guide-alldone", S("gAllDone")));
    }
    box.appendChild(nav);
    sec.appendChild(box);

    // Everything else, one line each, so nothing is hidden — just quiet.
    function strip(cls, label, list) {
      if (!list.length) return;
      var wrap = el("div", "guide-strip " + cls);
      wrap.appendChild(el("span", "guide-strip-label", label));
      list.forEach(function (ph) {
        wrap.appendChild(btn("guide-strip-item", ph.name, function () { t.phase = ph.id; touch(); paint(); }));
      });
      sec.appendChild(wrap);
    }
    strip("is-done", S("gDone"), phases.slice(0, idx));
    strip("is-later", S("gLater"), phases.slice(idx + 1));
    return sec;
  }

  // ══════════════════════════════════════════════════════════════════
  // "Stuck?" — one key, and it reads like a colleague leaning over.
  // Ordered as authored, every item with its why, and the process list
  // appended rather than substituted: the reason you are stuck is as
  // often "you never proved that failed" as it is a missing flag.
  // ══════════════════════════════════════════════════════════════════

  function stuckPanel(s, preset, t) {
    var box = el("div", "machine-section");
    var head = el("div", "machine-section-head");
    head.appendChild(iconEl("h3", "", "lifebuoy", S("stuck")));
    var right = el("div", "exam-header-actions");

    var basePhase = stuckPhaseFor(preset, t.phase);
    var m = machineFor(t);
    s.ui = s.ui || {};
    var phase = basePhase;
    if (basePhase === "privesc-linux" || basePhase === "privesc-windows") {
      phase = privescPhase(m, s.ui.privescOs);
      // The machine record usually knows the OS already. The switch is there for
      // the cases it does not, and for a dual-boot-shaped surprise mid-box.
      [["privesc-linux", S("osLinux")], ["privesc-windows", S("osWindows")]].forEach(function (pair) {
        right.appendChild(btn("host-chip" + (phase === pair[0] ? " on" : ""), pair[1], function () {
          s.ui.privescOs = pair[0]; touch(); paint();
        }));
      });
    }
    var focus = stuckFocusFor(preset, t, phase, t.phase);

    var sel = document.createElement("select");
    sel.className = "form-select";
    sel.setAttribute("aria-label", S("stuckList"));
    (DATA().stuck || []).forEach(function (l) {
      var o = document.createElement("option");
      o.value = l.focus + "|" + l.phase;
      o.textContent = l.focus + " · " + l.phase + " (" + l.items.length + ")";
      if (l.focus === focus && l.phase === phase) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener("change", function () {
      var parts = sel.value.split("|");
      s.ui.stuckOverride = { focus: parts[0], phase: parts[1] };
      touch(); paint();
    });
    right.appendChild(sel);
    right.appendChild(btn("btn btn-secondary btn-sm", S("stuckClose"), function () { view.stuck = false; paint(); }));
    head.appendChild(right);
    box.appendChild(head);
    box.appendChild(el("p", "machine-report-hint", S("stuckIntro")));

    var override = s.ui.stuckOverride;
    if (override) { focus = override.focus; phase = override.phase; }

    var technical = stuckList(focus, phase);
    var meta = focus === "mixed" ? null : stuckList("mixed", phase);

    if (!technical && !meta) {
      box.appendChild(el("p", "session-docs-empty", S("stuckNone")));
      return box;
    }
    if (technical) box.appendChild(stuckGroup(focus + " · " + phase, technical.items, t, m));
    if (meta) box.appendChild(stuckGroup(S("stuckMeta"), meta.items, t, m));
    return box;
  }

  function stuckGroup(title, items, t, m) {
    var group = el("div", "checklist-phase");
    var head = el("div", "checklist-phase-header");
    head.appendChild(el("span", "checklist-phase-name", title));
    head.appendChild(el("span", "checklist-phase-count", items.length));
    group.appendChild(head);

    items.forEach(function (item) {
      var row = el("div", "checklist-item");
      var body = el("div", "checklist-body");
      body.appendChild(el("span", "checklist-label", item.text));
      // The why is the whole value of the list. Without it this is a FAQ; with
      // it, it is someone telling you what they have watched go wrong.
      if (item.why) body.appendChild(el("div", "session-attempt-why", item.why));
      if (item.cmd) {
        var hint = el("div", "checklist-hint");
        var resolved = resolveCmd(item.cmd, m);
        hint.appendChild(el("code", "", resolved));
        var copy = iconBtn("checklist-hint-copy", "copy", "", null, S("copy"));
        wireCopy(copy, function () { return resolved; }, t);
        hint.appendChild(copy);
        body.appendChild(hint);
      }
      row.appendChild(body);
      // Turning a hint into a logged attempt in one click: the point of the log
      // is that it is cheaper to write than to re-derive.
      row.appendChild(btn("btn btn-secondary btn-sm", "+", function () {
        var s2 = activeSession();
        if (s2) { addAttempt(s2, t ? t.key : "", item.text, "fail", item.why || ""); paint(); }
      }, S("attempts")));
      group.appendChild(row);
    });
    return group;
  }

  // ══════════════════════════════════════════════════════════════════
  // Attempts log — one line per thing tried. This is what hour-18 you
  // needs so you do not repeat hour-3 you.
  // ══════════════════════════════════════════════════════════════════

  function attemptsPanel(s, scopeKey) {
    var box = el("div", "session-attempts");
    var head = el("div", "session-attempts-head");
    head.appendChild(document.createTextNode(S("attempts") + " (a)"));
    var all = (s.attempts || []);
    var shown = scopeKey ? all.filter(function (a) { return a.scope === scopeKey; }) : all;
    head.appendChild(el("span", "session-attempts-count", shown.length + (scopeKey ? " / " + all.length : "")));
    box.appendChild(head);

    var addRow = el("div", "checklist-add");
    var what = input("checklist-add-input", S("attemptAdd"), "");
    what.setAttribute("data-session-attempt", "1");
    var why = input("checklist-add-input", S("attemptWhy"), "");
    var outcome = document.createElement("select");
    outcome.className = "form-select";
    outcome.setAttribute("aria-label", S("attempts"));
    [["fail", S("outFail")], ["partial", S("outPartial")], ["ok", S("outOk")]].forEach(function (pair) {
      var o = document.createElement("option");
      o.value = pair[0]; o.textContent = pair[1];
      outcome.appendChild(o);
    });
    var submit = function () {
      if (!what.value.trim()) return;
      addAttempt(s, scopeKey, what.value, outcome.value, why.value);
      what.value = ""; why.value = "";
      paint();
      // Straight back into the input: logging an attempt has to cost one line of
      // typing and nothing else, or it stops happening around hour six.
      var next = host && host.querySelector("[data-session-attempt]");
      if (next) next.focus();
    };
    what.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } });
    why.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } });
    addRow.appendChild(what);
    addRow.appendChild(why);
    addRow.appendChild(outcome);
    addRow.appendChild(btn("btn btn-primary btn-sm", "+", submit));
    box.appendChild(addRow);

    var hint = el("div", "machine-report-hint", S("attemptsHint"));
    hint.style.padding = "0 12px 6px";
    box.appendChild(hint);

    var list = el("div", "session-attempts-list");
    if (!shown.length) {
      list.appendChild(el("div", "session-attempts-empty", S("attemptsEmpty")));
    } else {
      // Newest first: the thing you just tried is the thing you are about to
      // repeat.
      shown.slice().reverse().forEach(function (a, i) {
        var row = el("div", "session-attempt");
        row.appendChild(el("span", "session-attempt-n", String(shown.length - i)));
        var body = el("div", "session-attempt-body");
        body.appendChild(el("div", "session-attempt-cmd", a.text));
        var sub = [];
        if (a.why) sub.push(a.why);
        sub.push(fmtTime(a.ts));
        if (!scopeKey && a.scope) {
          var owner = (s.targets || []).filter(function (t) { return t.key === a.scope; })[0] ||
            (s.tasks || []).filter(function (t) { return t.id === a.scope; })[0];
          if (owner) sub.push(owner.label || ("#" + owner.n));
        }
        body.appendChild(el("div", "session-attempt-why", sub.join(" · ")));
        row.appendChild(body);
        var out = normOutcome(a.outcome);
        row.appendChild(el("span", "session-attempt-out " + out, S("out" + out.charAt(0).toUpperCase() + out.slice(1))));
        row.appendChild(iconBtn("btn btn-secondary btn-sm", "trash", "", function () {
          s.attempts = all.filter(function (x) { return x.id !== a.id; });
          touch(); paint();
        }, S("del")));
        list.appendChild(row);
      });
    }
    box.appendChild(list);
    return box;
  }

  // ══════════════════════════════════════════════════════════════════
  // Honesty panel — rules, evidence rules, notes, unverified, sources.
  // Reachable, not buried: this is the point of the feature, so it sits
  // in the cockpit rather than behind a settings screen.
  // ══════════════════════════════════════════════════════════════════

  function honestyPanel(preset) {
    var wrap = el("div", "machine-section");
    var head = el("div", "machine-section-head");
    head.appendChild(el("h3", "", S("rules")));
    var body = el("div", "");
    // Open by default for anything with a clock — a candidate needs the rules in
    // front of them. Collapsed for a weeknight box, where an exam rulebook on
    // screen is exactly the ceremony that closes the tab. One click either way.
    var openByDefault = hasClock(preset) || (preset.rules || []).some(function (r) { return r.kind === "banned" || r.kind === "limited"; });
    body.hidden = !openByDefault;
    var toggle = iconBtn("btn btn-secondary btn-sm", openByDefault ? "chevron-down" : "chevron-right", "", function () {
      body.hidden = !body.hidden;
      toggle.replaceChildren(ico(body.hidden ? "chevron-right" : "chevron-down", "icon-sm"));
    });
    head.appendChild(toggle);
    wrap.appendChild(head);
    wrap.appendChild(body);

    body.appendChild(el("p", "machine-report-hint", S("honestyIntro")));

    var tools = toolRulesFor(preset);
    if (tools.length) {
      var tb = el("div", "exam-rules");
      tb.dataset.sessionRules = "advisory";
      tb.appendChild(el("div", "exam-rules-title", S("advisoryTitle")));
      // The single most important sentence on this screen. A warning that fires
      // on a permitted tool teaches people to dismiss warnings, and then the one
      // that mattered gets dismissed too — so nothing here fires at all, and the
      // list never implies that an unlisted tool is allowed.
      tb.appendChild(el("p", "machine-report-hint", S("advisoryBody")));
      var tul = el("ul", "", "");
      tools.forEach(function (r) {
        var li = el("li", "", "");
        li.appendChild(confidenceBadge(r.confidence));
        li.appendChild(document.createTextNode(" "));
        r.tools.forEach(function (name) {
          li.appendChild(el("code", "", name));
          li.appendChild(document.createTextNode(" "));
        });
        li.appendChild(el("div", "session-attempt-why", r.text));
        var sl = sourceLink(r.source);
        if (sl) li.appendChild(sl);
        tul.appendChild(li);
      });
      tb.appendChild(tul);
      body.appendChild(tb);
    }

    var byKind = { required: [], limited: [], banned: [], allowed: [] };
    (preset.rules || []).forEach(function (r) { (byKind[r.kind] || byKind.allowed).push(r); });
    ["required", "limited", "banned", "allowed"].forEach(function (kind) {
      if (!byKind[kind].length) return;
      var rb = el("div", "exam-rules");
      rb.dataset.sessionRules = kind;
      rb.appendChild(el("div", "exam-rules-title", kind));
      var ul = el("ul", "", "");
      byKind[kind].forEach(function (r) {
        var li = el("li", "", "");
        li.appendChild(confidenceBadge(r.confidence));
        if (r.advisory === true) {
          var adv = el("span", "exam-pill st-skipped st-advisory", "advisory");
          adv.title = S("advisoryTitle") + " — " + S("advisoryBody");
          li.appendChild(document.createTextNode(" "));
          li.appendChild(adv);
        }
        li.appendChild(document.createTextNode(" " + r.text));
        var sl = sourceLink(r.source);
        if (sl) li.appendChild(sl);
        ul.appendChild(li);
      });
      rb.appendChild(ul);
      body.appendChild(rb);
    });

    if ((preset.evidenceRules || []).length) {
      var eb = el("div", "exam-rules");
      eb.dataset.sessionRules = "evidence";
      eb.appendChild(el("div", "exam-rules-title", S("evidenceReq")));
      var eul = el("ul", "", "");
      preset.evidenceRules.forEach(function (r) {
        var li = el("li", "", "");
        li.appendChild(confidenceBadge(r.confidence));
        if (r.capturedVia) li.appendChild(el("span", "machine-tag", r.capturedVia));
        if (r.appliesTo && r.appliesTo !== "*") li.appendChild(el("span", "machine-tag", r.appliesTo));
        li.appendChild(document.createTextNode(" " + r.requirement));
        var sl = sourceLink(r.source);
        if (sl) li.appendChild(sl);
        eul.appendChild(li);
      });
      eb.appendChild(eul);
      body.appendChild(eb);
    }

    [["notes", preset.notes], ["unverified", preset.unverified]].forEach(function (pair) {
      var items = pair[1] || [];
      if (!items.length) return;
      var nb = el("div", "exam-rules");
      nb.dataset.sessionNotes = pair[0];
      nb.appendChild(el("div", "exam-rules-title", S(pair[0])));
      var nul = el("ul", "", "");
      items.forEach(function (n) { nul.appendChild(el("li", "", n)); });
      nb.appendChild(nul);
      body.appendChild(nb);
    });

    if ((preset.sources || []).length) {
      var sb = el("div", "machine-nextsteps");
      sb.appendChild(el("div", "machine-nextsteps-label", S("sources")));
      var sul = el("ul", "session-docs", "");
      preset.sources.forEach(function (u) {
        var li = el("li", "session-doc", "");
        var b2 = el("div", "session-doc-body");
        var title = el("div", "session-doc-title", "");
        title.appendChild(link(u, hostOf(u)));
        b2.appendChild(title);
        b2.appendChild(el("div", "session-doc-url", u));
        li.appendChild(b2);
        sul.appendChild(li);
      });
      sb.appendChild(sul);
      body.appendChild(sb);
    }
    return wrap;
  }

  function hostOf(u) {
    try { return new URL(u, "http://x").hostname.replace(/^www\./, "") || u; }
    catch { return String(u); }
  }

  // ══════════════════════════════════════════════════════════════════
  // Task mode — a different loop entirely. No targets, no flags, no
  // enumeration queue: a list of timed tasks, each one anchored to a
  // cluster context, each one verified before it counts.
  // ══════════════════════════════════════════════════════════════════

  function buildTaskMode(s, preset) {
    var wrap = frag();
    wrap.appendChild(sessionHeader(s, preset));
    if (view.keys) wrap.appendChild(keysPanel(s.kind));

    wrap.appendChild(contextBanner(s, preset));

    var domains = domainBlock(s, preset);
    if (domains) wrap.appendChild(domains);

    wrap.appendChild(taskList(s, preset));
    wrap.appendChild(timeSaverBlock(preset, s));
    wrap.appendChild(docsBlock(preset));
    wrap.appendChild(pitfallBlock(preset));
    wrap.appendChild(preflightBlock(s, preset));
    wrap.appendChild(attemptsPanel(s, view.taskId || ""));
    wrap.appendChild(honestyPanel(preset));
    return wrap;
  }

  // Working in the wrong cluster context is the most common avoidable failure in
  // these exams, and it is invisible: the work is technically perfect and scores
  // zero. So the last confirmed context is pinned on screen for the whole
  // session, and it changes colour when the open task declares a different one.
  function contextBanner(s, preset) {
    var task = currentTask(s);
    var declared = task ? String(task.context || "").trim() : "";
    var confirmed = String(s.lastContext || "").trim();
    var mismatch = !!(declared && confirmed && declared !== confirmed);
    var bar = el("div", "active-target-bar" + (confirmed && !mismatch ? " on" : ""));

    var lbl = el("span", "active-target-label", "");
    lbl.appendChild(el("strong", "", S("contextBanner") + ": "));
    lbl.appendChild(el("code", "machine-detail-ip", confirmed || S("contextNone")));
    bar.appendChild(lbl);

    if (mismatch) {
      var warn = iconEl("span", "session-flag-note", "alert", S("contextDiff") + " (" + declared + ")");
      bar.appendChild(warn);
    }
    var saver = (preset.timeSavers || []).filter(function (ts) { return /use-context/.test(String(ts.cmd || "")); })[0];
    if (saver) {
      var copy = iconBtn("btn btn-secondary btn-sm", "copy", S("contextConfirm"), null);
      wireCopy(copy, function () { return String(saver.cmd).replace(/<CTX>/g, declared || confirmed || "<CTX>"); }, null);
      bar.appendChild(copy);
    }
    return bar;
  }
  function currentTask(s) {
    if (!view.taskId) return null;
    return (s.tasks || []).filter(function (t) { return t.id === view.taskId; })[0] || null;
  }

  // ── Weighted domain estimate ──
  function domainBlock(s, preset) {
    if (!(preset.domains || []).length) return null;
    if (!hasClock(preset) && !(preset.passMark > 0) && !preset.passMarkUndisclosed) return null;
    var est = domainEstimate(s, preset);
    var box = el("div", "session-domains");

    var head = el("div", "machine-section-head");
    head.appendChild(el("h3", "", S("domainEst")));
    var pass = el("span", "machine-report-hint", "");
    if (preset.passMark > 0) pass.textContent = preset.passMark + "% " + S("toPass");
    else if (preset.passMarkUndisclosed) pass.textContent = S("passUndisclosed");
    head.appendChild(pass);
    box.appendChild(head);

    // Three separate figures, never one. Folding "applied but never verified"
    // into a single percentage would invent a confidence nobody has earned, and
    // the verification gap is exactly what the retrospective is for.
    var summary = el("div", "session-domain-score", "");
    summary.appendChild(el("b", "", Math.round(est.verified) + "%"));
    summary.appendChild(document.createTextNode(" " + S("legendVerified") + " · "));
    summary.appendChild(el("b", "", Math.round(est.applied) + "%"));
    summary.appendChild(document.createTextNode(" " + S("legendApplied") + " · "));
    summary.appendChild(el("b", "", Math.round(est.open + est.lost) + "%"));
    summary.appendChild(document.createTextNode(" " + S("legendOpen")));
    box.appendChild(summary);
    box.appendChild(el("p", "machine-report-hint", S("domainEstHint")));
    if (preset.weightsDerived) {
      box.appendChild(iconEl("p", "machine-report-hint", "alert", S("derivedBy")));
    }

    est.rows.forEach(function (row) {
      var line = el("div", "session-domain");
      var name = el("span", "session-domain-name", row.domain.name);
      name.title = row.domain.name + " — " + row.domain.weight + "%";
      line.appendChild(name);

      var bar = el("div", "session-domain-bar");
      [["earned", row.verified], ["partial", row.applied], ["lost", row.lost], ["open", row.open]].forEach(function (pair) {
        if (pair[1] <= 0) return;
        var seg = el("div", "session-domain-seg " + pair[0], "");
        seg.style.flexGrow = String(pair[1]);
        bar.appendChild(seg);
      });
      line.appendChild(bar);

      var score = el("span", "session-domain-score", "");
      score.appendChild(el("b", "", Math.round(row.verified) + "%"));
      score.appendChild(document.createTextNode(" / " + row.domain.weight + "%"));
      line.appendChild(score);
      box.appendChild(line);

      if (!row.tasks.length) {
        // A heavily weighted domain sitting untouched is the single most useful
        // thing this block can say.
        box.appendChild(el("div", "session-attempt-why", row.domain.weight + "% " + S("domainUntouched")));
      }
    });

    var legend = el("div", "session-domain-legend");
    [["earned", S("legendVerified")], ["partial", S("legendApplied")], ["lost", S("legendLost")], ["open", S("legendOpen")]].forEach(function (pair) {
      var sp = el("span", "", "");
      sp.appendChild(el("i", pair[0], ""));
      sp.appendChild(document.createTextNode(pair[1]));
      legend.appendChild(sp);
    });
    box.appendChild(legend);
    return box;
  }

  // ── Task list ──
  function taskList(s, preset) {
    var sec = el("div", "machine-section");
    var head = el("div", "machine-section-head");
    head.appendChild(el("h3", "", S("tasks")));
    var budget = taskBudget(preset, (s.tasks || []).length);
    if (budget) {
      head.appendChild(el("span", "machine-report-hint",
        fmtShort(budget.perTaskMs) + " " + S("perTask") + " — (" + budget.totalMin + S("mins") +
        (budget.reserveMin ? " − " + budget.reserveMin + S("mins") + " " + S("sweepReserve") : "") +
        ") ÷ " + budget.count + ". " + S("derivedBy")));
    } else if (preset.durationMin > 0) {
      head.appendChild(el("span", "machine-report-hint", S("noBudget")));
    }
    head.appendChild(btn("btn btn-secondary btn-sm", S("addTask"), function () { addTaskRow(s); }));
    sec.appendChild(head);

    var list = el("div", "session-tasks");
    (s.tasks || []).forEach(function (task, i) { list.appendChild(taskRow(s, preset, task, i, budget)); });
    sec.appendChild(list);
    return sec;
  }

  function taskRow(s, preset, task, index, budget) {
    var open = view.taskId === task.id;
    var row = el("div", "session-task" + (task.startedAt ? " active" : "") + (task.flagged ? " flagged" : ""));

    var top = el("div", "session-task-top");
    top.appendChild(el("span", "session-task-pts", "#" + (task.n || index + 1)));

    var title = input("session-task-name", "Task " + (task.n || index + 1), task.title);
    title.addEventListener("change", function () { task.title = title.value.trim(); touch(); });
    top.appendChild(title);

    if ((preset.domains || []).length) {
      var sel = document.createElement("select");
      sel.className = "form-select";
      sel.setAttribute("aria-label", S("domainEst"));
      var blank = document.createElement("option");
      blank.value = ""; blank.textContent = "—";
      sel.appendChild(blank);
      preset.domains.forEach(function (d) {
        var o = document.createElement("option");
        o.value = d.id;
        o.textContent = d.name + " (" + d.weight + "%)";
        if (task.domainId === d.id) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener("change", function () { task.domainId = sel.value; touch(); paint(); });
      top.appendChild(sel);
    }

    top.appendChild(el("span", "exam-pill st-" + taskPill(task), taskStatusLabel(task)));

    // Flagging is this app's idea, not something the exam UI documents. Saying so
    // where the control is prevents someone building a habit around a feature
    // that will not be there on the day.
    var flagBtn = iconBtn("session-flag" + (task.flagged ? " on" : ""), "flag", "", function () {
      task.flagged = !task.flagged; touch(); paint();
    }, S("flagReview"));
    top.appendChild(flagBtn);

    top.appendChild(iconBtn("btn btn-secondary btn-sm", open ? "chevron-down" : "chevron-right", "", function () {
      view.taskId = open ? "" : task.id; paint();
    }));
    row.appendChild(top);

    if ((preset.appFeatures || []).length && task.flagged) {
      preset.appFeatures.forEach(function (note) { row.appendChild(iconEl("div", "session-flag-note", "info", note)); });
    }

    if (budget) {
      var bar = el("div", "session-budget");
      var wrapBar = el("div", "session-budget-bar");
      var fill = el("div", "session-budget-fill", "");
      var mark = el("div", "session-budget-mark", "");
      mark.style.left = "100%";
      wrapBar.appendChild(fill);
      wrapBar.appendChild(mark);
      var text = el("span", "session-budget-text", "");
      var refresh = function () {
        var spent = taskElapsed(task);
        var pct = Math.min(100, (spent / budget.perTaskMs) * 100);
        fill.style.width = pct + "%";
        fill.classList.toggle("warn", pct >= 75 && pct < 100);
        fill.classList.toggle("over", spent > budget.perTaskMs);
        text.classList.toggle("over", spent > budget.perTaskMs);
        text.textContent = fmtShort(spent) + " / " + fmtShort(budget.perTaskMs);
      };
      refresh();
      if (task.startedAt) onTick(refresh);
      bar.appendChild(wrapBar);
      bar.appendChild(text);
      row.appendChild(bar);
    }

    if (open) row.appendChild(taskDetail(s, preset, task));
    return row;
  }

  function taskPill(task) {
    return { todo: "pending", doing: "active", applied: "user", verified: "root", skipped: "skipped" }[task.status] || "pending";
  }
  function taskStatusLabel(task) {
    return { todo: S("taskTodo"), doing: "…", applied: S("taskApplied"), verified: S("taskVerified"), skipped: S("taskSkipped") }[task.status] || task.status;
  }

  function taskDetail(s, preset, task) {
    var body = el("div", "checklist-body");
    body.style.paddingTop = "10px";

    // The context gate. The timer does not start until the context is confirmed,
    // because a task begun in the wrong cluster is a task already lost.
    var ctxGroup = el("div", "form-group");
    var lbl = document.createElement("label");
    lbl.textContent = S("context");
    ctxGroup.appendChild(lbl);
    var ctx = input("", "kubectl config use-context …", task.context);
    ctx.addEventListener("change", function () {
      task.context = ctx.value.trim();
      task.contextConfirmedAt = 0;
      touch(); paint();
    });
    ctxGroup.appendChild(ctx);
    body.appendChild(ctxGroup);

    var ctxRow = el("div", "machine-report-bar");
    if (task.contextConfirmedAt) {
      ctxRow.appendChild(iconEl("span", "session-evidence ok", "check", S("contextConfirmed") + " " + fmtTime(task.contextConfirmedAt)));
    } else {
      ctxRow.appendChild(el("span", "session-evidence missing", S("contextWarn")));
    }
    ctxRow.appendChild(btn("btn btn-primary btn-sm", S("contextConfirm"), function () {
      if (!task.context.trim()) { toast(S("contextWarn"), "error"); return; }
      task.contextConfirmedAt = Date.now();
      s.lastContext = task.context.trim();
      touch(); paint();
    }));
    body.appendChild(ctxRow);

    var run = el("div", "machine-report-bar");
    var canStart = !!task.contextConfirmedAt;
    var startBtn = iconBtn("btn " + (canStart ? "btn-primary" : "btn-secondary") + " btn-sm",
      task.startedAt ? "pause" : "play", task.startedAt ? S("taskStop") : S("taskStart"), function () {
        if (task.startedAt) { stopTaskClocks(s); touch(); paint(); return; }
        if (!canStart) { toast(S("contextWarn"), "error"); return; }
        startTask(s, task);
        paint();
      });
    run.appendChild(startBtn);
    ["applied", "verified", "skipped"].forEach(function (st) {
      run.appendChild(btn("btn btn-secondary btn-sm", { applied: S("taskApplied"), verified: S("taskVerified"), skipped: S("taskSkipped") }[st], function () {
        task.status = st;
        if (st === "verified") task.verifiedAt = Date.now();
        if (st !== "doing") stopTaskClocks(s);
        touch(); paint();
      }));
    });
    body.appendChild(run);

    // "Applied" is not "done". The verification step is a field for the command
    // that proves the live end state, because "I edited the yaml" and "the API
    // server came back" are different claims.
    var vGroup = el("div", "form-group");
    var vLbl = document.createElement("label");
    vLbl.textContent = S("taskVerify");
    vGroup.appendChild(vLbl);
    var vCmd = input("", "kubectl get … / curl -sk https://…/readyz", task.verifyCmd);
    vCmd.addEventListener("change", function () { task.verifyCmd = vCmd.value.trim(); touch(); });
    vGroup.appendChild(vCmd);
    var hint = el("span", "form-hint", S("taskVerifyHint"));
    vGroup.appendChild(hint);
    body.appendChild(vGroup);

    if (task.verifyCmd) {
      var hintRow = el("div", "checklist-hint");
      hintRow.appendChild(el("code", "", task.verifyCmd));
      var copy = iconBtn("checklist-hint-copy", "copy", "", null, S("copy"));
      wireCopy(copy, function () { return task.verifyCmd; }, null);
      hintRow.appendChild(copy);
      body.appendChild(hintRow);
    }

    var notes = document.createElement("textarea");
    notes.className = "machine-textarea";
    notes.placeholder = S("notes");
    notes.value = task.notes || "";
    notes.addEventListener("change", function () { task.notes = notes.value; touch(); });
    body.appendChild(notes);
    return body;
  }

  function addTaskRow(s) {
    s.tasks = s.tasks || [];
    var n = s.tasks.length + 1;
    s.tasks.push({
      id: uid("t-"), n: n, title: "", domainId: "", context: "", contextConfirmedAt: 0,
      startedAt: 0, spentMs: 0, status: "todo", flagged: false, verifyCmd: "", verifiedAt: 0, notes: ""
    });
    touch();
    paint();
  }

  // ── Time savers / docs / pitfalls / pre-flight ──
  function timeSaverBlock(preset, s) {
    var sec = el("div", "machine-section");
    if (!(preset.timeSavers || []).length) return sec;
    var head = el("div", "machine-section-head");
    head.appendChild(el("h3", "", S("timeSavers")));
    sec.appendChild(head);
    var group = el("div", "checklist-phase");
    (preset.timeSavers || []).forEach(function (ts) {
      var row = el("div", "checklist-item");
      var body = el("div", "checklist-body");
      body.appendChild(el("span", "checklist-label", ts.label));
      if (ts.why) body.appendChild(el("div", "session-attempt-why", ts.why));
      if (ts.cmd) {
        var hint = el("div", "checklist-hint");
        hint.appendChild(el("code", "", ts.cmd));
        var copy = iconBtn("checklist-hint-copy", "copy", "", null, S("copy"));
        wireCopy(copy, function () { return ts.cmd; }, null);
        hint.appendChild(copy);
        body.appendChild(hint);
      }
      row.appendChild(body);
      group.appendChild(row);
    });
    sec.appendChild(group);
    return sec;
  }

  function docsBlock(preset) {
    var sec = el("div", "machine-section");
    if (!(preset.allowedDocs || []).length) return sec;
    sec.appendChild(el("h3", "", S("allowedDocs")));
    var list = el("ul", "session-docs", "");
    (preset.allowedDocs || []).forEach(function (d) {
      var li = el("li", "session-doc", "");
      var allowed = /^https?:\/\//i.test(String(d.url || ""));
      li.appendChild(iconEl("span", "session-doc-icon", allowed ? "bookmark" : "ban", ""));
      var body = el("div", "session-doc-body");
      var title = el("div", "session-doc-title", "");
      if (allowed) title.appendChild(link(d.url, d.label));
      else title.appendChild(document.createTextNode(d.label));
      body.appendChild(title);
      if (d.url) body.appendChild(el("div", "session-doc-url", d.url));
      if (d.note) body.appendChild(el("div", "session-attempt-why", d.note));
      li.appendChild(body);
      if (!allowed) li.appendChild(el("span", "session-doc-tag", S("notAllowed")));
      list.appendChild(li);
    });
    sec.appendChild(list);
    return sec;
  }

  function pitfallBlock(preset) {
    var sec = el("div", "machine-section");
    if (!(preset.pitfalls || []).length) return sec;
    var box = el("div", "exam-rules");
    box.appendChild(el("div", "exam-rules-title", S("pitfalls")));
    var ul = el("ul", "", "");
    (preset.pitfalls || []).forEach(function (p) {
      var li = el("li", "", p.text);
      if (p.cost) li.appendChild(el("div", "session-attempt-why", p.cost));
      if (p.guard) li.appendChild(iconEl("div", "session-attempt-why", "arrow-right", p.guard));
      ul.appendChild(li);
    });
    box.appendChild(ul);
    sec.appendChild(box);
    return sec;
  }

  // The task preset's own phases are the meta-loop — pre-flight, the task loop,
  // the sweep, the retro — not the tasks. Rendering them as a checklist is what
  // makes "did the aliases get set in the first 90 seconds" answerable later.
  function preflightBlock(s, preset) {
    var sec = el("div", "machine-section");
    if (!(preset.phases || []).length) return sec;
    sec.appendChild(el("h3", "", S("preflight")));
    s.preflight = s.preflight || {};
    (preset.phases || []).forEach(function (ph) {
      var box = el("div", "checklist-phase");
      var doneN = (ph.items || []).filter(function (item, i) { return s.preflight[ph.id + ":" + i]; }).length;
      var head = el("div", "checklist-phase-header");
      head.style.cursor = "pointer";
      head.appendChild(el("span", "checklist-phase-name", ph.name));
      head.appendChild(el("span", "checklist-phase-count", doneN + "/" + (ph.items || []).length));
      box.appendChild(head);
      var body = el("div", "");
      body.hidden = doneN === (ph.items || []).length && doneN > 0;
      head.addEventListener("click", function () { body.hidden = !body.hidden; });
      if (ph.goal) {
        var goal = el("div", "session-attempt-why", ph.goal);
        goal.style.padding = "8px 12px 0";
        body.appendChild(goal);
      }
      (ph.items || []).forEach(function (item, i) {
        var key = ph.id + ":" + i;
        var row = el("label", "checklist-item" + (s.preflight[key] ? " done" : ""));
        row.appendChild(checkbox(!!s.preflight[key], function (on) {
          if (on) s.preflight[key] = true; else delete s.preflight[key];
          touch(); paint();
        }));
        var ib = el("div", "checklist-body");
        ib.appendChild(el("span", "checklist-label", item.label));
        if (item.hint) {
          var hint = el("div", "checklist-hint");
          hint.appendChild(el("code", "", item.hint));
          var copy = iconBtn("checklist-hint-copy", "copy", "", null, S("copy"));
          wireCopy(copy, function () { return item.hint; }, null);
          hint.appendChild(copy);
          ib.appendChild(hint);
        }
        row.appendChild(ib);
        body.appendChild(row);
      });
      box.appendChild(body);
      sec.appendChild(box);
    });
    return sec;
  }

  // ══════════════════════════════════════════════════════════════════
  // Report / retrospective — assembled from what was actually captured.
  // The vendor's own section list is emitted verbatim as the skeleton;
  // everything this app knows is appended underneath it, so the writing
  // that is left is the writing only a human can do.
  // ══════════════════════════════════════════════════════════════════

  function mdCell(v) { return String(v == null ? "" : v).replace(/\|/g, "\\|").replace(/\r?\n/g, " "); }
  function mdFence(v) { return String(v == null ? "" : v).replace(/```/g, "'''"); }

  function buildReportMarkdown(s, preset) {
    var md = "# " + preset.name + "\n\n";
    md += "> " + presetShape(preset) + "  \n";
    md += "> " + S("sessions") + ": " + fmtDateTime(s.createdAt);
    // Against finishedAt, not now: a closed session's report is a record of what
    // happened, and the old form made "elapsed" grow every time the candidate
    // re-opened the report to copy it.
    if (s.startedAt) md += " · " + S("elapsed") + " " + fmtShort((s.finishedAt || Date.now()) - s.startedAt);
    md += "\n\n";

    if (s.kind === "tasks") return md + retroBody(s, preset);
    return md + reportBody(s, preset);
  }

  function reportBody(s, preset) {
    var md = "";
    var mode = scoreMode(preset);
    var sc = sessionScore(s);

    md += "## " + S("score") + "\n\n";
    if (mode === "denominator") md += sc.earned + " / " + preset.totalPoints + " · " + preset.passMark + " " + S("toPass") + "\n\n";
    else if (mode === "count-up") md += sc.earned + " → " + preset.passMark + " " + S("toPass") + "\n\n";
    else if (mode === "derived") md += sc.earned + " / " + sc.possible + " (" + S("derivedTotal") + ")\n\n";
    else if (mode === "unknown") md += sc.capturedFlags + " / " + sc.totalFlags + " " + S("captured") + " — " + S("pointsFromPanel") + "\n\n";
    else md += sc.capturedFlags + " / " + sc.totalFlags + " " + S("objectives") + "\n\n";
    if (preset.scoringNote) md += "> " + mdCell(preset.scoringNote) + "\n\n";

    // OffSec grades machines in the order they are documented, so when the
    // preset says so the order is the preset's own and the report says why.
    if (hasEnforceable(preset, "report:order=grading-order")) {
      md += "> " + S("reportOrder") + "\n\n";
    }

    md += "---\n\n";
    (preset.reportSections || []).forEach(function (title) { md += "## " + title + "\n\n\n"; });

    md += "---\n\n# " + S("targets") + "\n\n";
    (s.targets || []).forEach(function (t) {
      var m = machineFor(t);
      md += "## " + t.label + "\n\n";
      md += "- **" + S("phase") + ":** " + (t.phase || "—") + "\n";
      md += "- **" + S("onTarget") + ":** " + (targetElapsed(t) ? fmtShort(targetElapsed(t)) : "—") + "\n";
      if (m) md += "- **Machine:** " + mdCell(m.name) + (m.ip ? " (`" + mdCell(m.ip) + "`)" : "") + " · " + mdCell(m.os || "") + "\n";
      md += "\n";

      md += "### " + S("flags") + "\n\n";
      targetFlags(t).forEach(function (f) {
        var cap = (t.captures && t.captures[f.id]) || {};
        md += "- [" + (cap.at ? "x" : " ") + "] **" + mdCell(f.label) + "**";
        if (f.userAdded) md += " _(added in this session)_";
        if (f.pointsUnknown) md += " (" + S("pointsFromPanel") + ")";
        else if (Number(f.points) > 0) md += " (" + f.points + ")";
        if (cap.at) md += " — " + fmtDateTime(cap.at);
        if (cap.via) md += " · " + cap.via;
        md += "\n";
        if (cap.value) md += "  - `" + mdCell(cap.value) + "`\n";
        var rules = evidenceRulesFor(preset, f.id, cap.via);
        rules.forEach(function (r, i) {
          var key = evidenceKey(r, i);
          md += "  - [" + ((cap.met && cap.met[key]) ? "x" : " ") + "] _(" + r.confidence + ")_ " + mdCell(r.requirement) + "\n";
        });
        // An override is stated, never hidden. A report that silently claims
        // compliance it does not have is worse than one that says what happened.
        if (cap.override) md += "  - ⚠ " + S("overrodeAt") + " (" + cap.override.unmet + ") — " + fmtDateTime(cap.override.at) + "\n";
      });
      md += "\n";

      if (m) {
        var svcs = normServices(m.services);
        if (svcs.length) {
          md += "### Services\n\n| Port | Proto | State | Service | Version |\n|---|---|---|---|---|\n";
          svcs.forEach(function (x) {
            md += "| " + mdCell(x.port) + " | " + mdCell(x.proto) + " | " + mdCell(x.state) + " | " + mdCell(x.name) + " | " + mdCell(x.version) + " |\n";
          });
          md += "\n";
        }
        var creds = Array.isArray(m.credentials) ? m.credentials : [];
        if (creds.length) {
          md += "### Credentials\n\n| User | Secret | Type | Source |\n|---|---|---|---|\n";
          creds.forEach(function (c) {
            if (c && typeof c === "object") md += "| " + mdCell(c.username) + " | `" + mdCell(c.secret) + "` | " + mdCell(c.type) + " | " + mdCell(c.source) + " |\n";
            else md += "| | `" + mdCell(c) + "` | | |\n";
          });
          md += "\n";
        }
        var tl = Array.isArray(m.timeline) ? m.timeline : [];
        if (tl.length) {
          md += "### Timeline\n\n";
          tl.forEach(function (it) {
            if (it.type === "cmd") md += "- `" + mdCell(it.text) + "` _(" + fmtDateTime(it.ts) + ")_\n";
            else md += "- **" + fmtDateTime(it.ts) + "** — " + mdCell(it.text) + "\n";
          });
          md += "\n";
        }
      }

      var mine = (s.attempts || []).filter(function (a) { return a.scope === t.key; });
      if (mine.length) {
        md += "### " + S("attempts") + "\n\n| # | " + S("attempts") + " | " + S("outFail") + " | " + S("attemptWhy") + " |\n|---|---|---|---|\n";
        mine.forEach(function (a, i) {
          md += "| " + (i + 1) + " | " + mdCell(a.text) + " | " + mdCell(a.outcome) + " | " + mdCell(a.why) + " |\n";
        });
        md += "\n";
      }

      var doneItems = [];
      (preset.phases || []).forEach(function (ph) {
        (ph.items || []).forEach(function (item, i) {
          if (t.done[ph.id + ":" + i]) doneItems.push(ph.name + " — " + item.label);
        });
      });
      if (doneItems.length) {
        md += "### " + S("checklist") + "\n\n";
        doneItems.forEach(function (x) { md += "- [x] " + mdCell(x) + "\n"; });
        md += "\n";
      }
      if (t.notes) md += "### " + S("notes") + "\n\n" + mdFence(t.notes) + "\n\n";
    });

    var unscoped = (s.attempts || []).filter(function (a) { return !a.scope; });
    if (unscoped.length) {
      md += "## " + S("attempts") + "\n\n";
      unscoped.forEach(function (a) { md += "- " + mdCell(a.text) + " — _" + a.outcome + "_" + (a.why ? " · " + mdCell(a.why) : "") + "\n"; });
      md += "\n";
    }

    md += honestyMarkdown(preset);
    return md;
  }

  function retroBody(s, preset) {
    var md = "";
    var budget = taskBudget(preset, (s.tasks || []).length);
    var est = domainEstimate(s, preset);

    md += "## " + S("domainEst") + "\n\n";
    md += "- " + Math.round(est.verified) + "% " + S("legendVerified") + "\n";
    md += "- " + Math.round(est.applied) + "% " + S("legendApplied") + "\n";
    md += "- " + Math.round(est.open + est.lost) + "% " + S("legendOpen") + "\n\n";
    md += "> " + S("domainEstHint") + "\n\n";
    if (preset.passMark > 0) md += "> " + preset.passMark + "% " + S("toPass") + "\n\n";
    else if (preset.passMarkUndisclosed) md += "> " + S("passUndisclosed") + "\n\n";
    if (preset.weightsDerived) md += "> ⚠ " + S("derivedBy") + "\n\n";

    md += "| " + S("domainEst") + " | Weight | " + S("legendVerified") + " |\n|---|---|---|\n";
    est.rows.forEach(function (row) {
      md += "| " + mdCell(row.domain.name) + " | " + row.domain.weight + "% | " + Math.round(row.verified) + "% |\n";
    });
    md += "\n---\n\n";

    (preset.retroSections || []).forEach(function (title) { md += "## " + title + "\n\n\n"; });

    md += "---\n\n## " + S("tasks") + "\n\n";
    md += "| # | " + S("tasks") + " | " + S("context") + " | " + S("taskSpent") + " | " + S("taskBudget") + " | Status |\n|---|---|---|---|---|---|\n";
    (s.tasks || []).forEach(function (t) {
      md += "| " + (t.n || "") + " | " + mdCell(t.title) + " | " + mdCell(t.context) +
        (t.contextConfirmedAt ? " ✓" : " ⚠") + " | " + fmtShort(taskElapsed(t)) + " | " +
        (budget ? fmtShort(budget.perTaskMs) : "—") + " | " + t.status + (t.flagged ? " ⚑" : "") + " |\n";
    });
    md += "\n";

    var overs = (s.tasks || []).filter(function (t) { return budget && taskElapsed(t) > budget.perTaskMs; });
    if (overs.length) {
      md += "### Over budget\n\n";
      // fmtShort truncates to whole minutes, so a task 40s over a 6m budget used
      // to print "6m / 6m" under a heading claiming it went over — which reads as
      // a bug in the tool rather than a fact about the run. The filter is strict,
      // so every row here genuinely exceeds its budget; fmtClock is the shortest
      // format that lets the reader see it.
      overs.forEach(function (t) { md += "- #" + t.n + " " + mdCell(t.title) + " — " + fmtClock(taskElapsed(t)) + " / " + fmtClock(budget.perTaskMs) + "\n"; });
      md += "\n";
    }
    var unconfirmed = (s.tasks || []).filter(function (t) { return t.context && !t.contextConfirmedAt; });
    if (unconfirmed.length) {
      // A warning sentence is not a section title. The heading names the gap, the
      // warning belongs in the body underneath it.
      md += "### " + S("contextGaps") + "\n\n";
      md += S("contextWarn") + "\n\n";
      unconfirmed.forEach(function (t) { md += "- #" + t.n + " " + mdCell(t.title) + " — `" + mdCell(t.context) + "`\n"; });
      md += "\n";
    }
    var gap = (s.tasks || []).filter(function (t) { return t.status === "applied"; });
    if (gap.length) {
      md += "### " + S("taskVerify") + "\n\n";
      gap.forEach(function (t) { md += "- #" + t.n + " " + mdCell(t.title) + (t.verifyCmd ? " — `" + mdCell(t.verifyCmd) + "`" : "") + "\n"; });
      md += "\n";
    }
    if ((s.attempts || []).length) {
      md += "### " + S("attempts") + "\n\n";
      s.attempts.forEach(function (a) { md += "- " + mdCell(a.text) + " — _" + a.outcome + "_" + (a.why ? " · " + mdCell(a.why) : "") + "\n"; });
      md += "\n";
    }
    md += honestyMarkdown(preset);
    return md;
  }

  // The honesty fields travel with the report. Someone reading this in six weeks
  // needs to know which line was vendor text and which was an inference just as
  // much as the person who was on screen when it was captured.
  function honestyMarkdown(preset) {
    var md = "---\n\n## " + S("rules") + "\n\n";
    (preset.rules || []).forEach(function (r) {
      md += "- _(" + r.confidence + (r.advisory === true ? ", advisory" : "") + ")_ **" + r.kind + "** — " + mdCell(r.text);
      if (r.source) md += " [↗](" + r.source + ")";
      md += "\n";
    });
    md += "\n";
    if ((preset.evidenceRules || []).length) {
      md += "## " + S("evidenceReq") + "\n\n";
      preset.evidenceRules.forEach(function (r) {
        md += "- _(" + r.confidence + ")_ " + (r.appliesTo !== "*" ? "`" + r.appliesTo + "` " : "") +
          (r.capturedVia ? "`via " + r.capturedVia + "` " : "") + mdCell(r.requirement);
        if (r.source) md += " [↗](" + r.source + ")";
        md += "\n";
      });
      md += "\n";
    }
    [["notes", preset.notes], ["unverified", preset.unverified]].forEach(function (pair) {
      if (!(pair[1] || []).length) return;
      md += "## " + S(pair[0]) + "\n\n";
      pair[1].forEach(function (n) { md += "- " + mdCell(n) + "\n"; });
      md += "\n";
    });
    if ((preset.sources || []).length) {
      md += "## " + S("sources") + "\n\n";
      preset.sources.forEach(function (u) { md += "- " + u + "\n"; });
      md += "\n";
    }
    return md;
  }

  function buildReport(s, preset) {
    var wrap = frag();
    wrap.appendChild(sessionHeader(s, preset, s.kind === "tasks" ? S("retro") : S("report")));
    if (view.keys) wrap.appendChild(keysPanel(s.kind));

    var md = buildReportMarkdown(s, preset);

    var bar = el("div", "machine-report-bar");
    bar.appendChild(iconBtn("btn btn-secondary btn-sm", "copy", S("reportCopy"), null));
    wireCopy(bar.firstChild, function () { return md; }, null);

    var saveLabel = s.report && s.report.writeupId ? S("reportUpdate") : S("reportSave");
    bar.appendChild(iconBtn("btn btn-primary btn-sm", "save", saveLabel, function () { saveToWriteups(s, preset, md); }));
    if (s.report && s.report.writeupId) {
      bar.appendChild(el("span", "machine-report-hint", S("reportSaved") + " · " + fmtDateTime(s.report.savedAt)));
      bar.appendChild(iconBtn("btn btn-secondary btn-sm", "external", S("reportOpen"), function () {
        if (typeof APP.navigate === "function") APP.navigate("#writeups");
      }));
    }
    wrap.appendChild(bar);

    var body = el("div", "machine-report-body");
    // The only innerHTML in this file. renderMarkdown escapes its entire input
    // before it formats anything and stashes every attribute value until the
    // last pass, which is exactly why the report is routed through it rather
    // than through any markup this module could assemble itself.
    if (typeof APP.renderMarkdown === "function") body.innerHTML = APP.renderMarkdown(md);
    else body.textContent = md;
    wrap.appendChild(body);
    return wrap;
  }

  function saveToWriteups(s, preset, md) {
    var title = preset.name + " — " + fmtDateTime(s.createdAt);
    var tags = ["session", preset.id, preset.kind];
    var existing = s.report && s.report.writeupId;
    var call = existing
      ? APP.api("PUT", "/api/writeups/" + existing, { title: title, tags: tags, content: md })
      : APP.api("POST", "/api/writeups", { title: title, tags: tags, content: md });
    Promise.resolve(call).then(function (wu) {
      if (!wu || wu.error) { toast(S("saveFail"), "error"); return; }
      s.report = { writeupId: wu.id || existing, savedAt: Date.now() };
      touch();
      toast(S("reportSaved"), "ok");
      paint();
    });
  }

  // ══════════════════════════════════════════════════════════════════
  // Keyboard — the senior-pentester persona lives here.
  // ══════════════════════════════════════════════════════════════════

  var KEYS_TARGETS = [
    ["1…9", "targets"], ["n / p", "next / prev"], ["o", "openMachine"], ["e", "enumQueue"],
    ["s", "stuck"], ["a", "attempts"], ["c", "captureFlag"], ["r", "report"], ["b", "back"], ["h", "keys"]
  ];
  var KEYS_TASKS = [
    ["1…9", "tasks"], ["n / p", "next / prev"], ["f", "flagReview"], ["v", "taskVerified"],
    ["a", "attempts"], ["r", "retro"], ["b", "back"], ["h", "keys"]
  ];
  function keysPanel(kind) {
    var box = el("div", "exam-rules");
    box.appendChild(el("div", "exam-rules-title", S("keysTitle")));
    var ul = el("ul", "", "");
    (kind === "tasks" ? KEYS_TASKS : KEYS_TARGETS).forEach(function (pair) {
      var li = el("li", "", "");
      li.appendChild(el("code", "", pair[0]));
      li.appendChild(document.createTextNode(" " + S(pair[1])));
      ul.appendChild(li);
    });
    box.appendChild(ul);
    box.appendChild(el("p", "machine-report-hint", S("keysHint")));
    return box;
  }

  var mounted = false;
  // app.js owns a `g`-prefixed chord (g h / g m / g e). Its listener is bound
  // first and runs first, so the second key of a chord would otherwise reach
  // this handler too and fire an unrelated session action on the way out of the
  // view. Mirroring the pending flag is cheaper than fighting over the event.
  var pendingGo = false;
  function onKey(e) {
    if (!mounted || !DOC) return;
    var a = document.activeElement;
    if (a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.tagName === "SELECT" || a.isContentEditable)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === "g") { pendingGo = true; setTimeout(function () { pendingGo = false; }, 800); return; }
    if (pendingGo) { pendingGo = false; return; }

    if (e.key === "Escape") {
      if (view.keys) { view.keys = false; paint(); return; }
      if (view.stuck) { view.stuck = false; paint(); return; }
      return;
    }

    var s = activeSession();
    if (!s) return;
    var preset = presetById(s.presetId);
    if (!preset) return;
    var isTasks = s.kind === "tasks";
    var items = isTasks ? (s.tasks || []) : (s.targets || []);
    var currentIdx = -1;
    items.forEach(function (it, i) {
      if (isTasks ? (it.id === view.taskId) : (it.key === view.targetKey)) currentIdx = i;
    });

    var openAt = function (i) {
      if (i < 0 || i >= items.length) return;
      if (isTasks) { view.taskId = items[i].id; view.name = "cockpit"; }
      else { openTarget(s, items[i]); return; }
      paint();
    };

    if (/^[1-9]$/.test(e.key)) { e.preventDefault(); openAt(parseInt(e.key, 10) - 1); return; }
    if (e.key === "n") { e.preventDefault(); openAt(currentIdx < 0 ? 0 : currentIdx + 1); return; }
    if (e.key === "p") { e.preventDefault(); openAt(currentIdx <= 0 ? 0 : currentIdx - 1); return; }
    if (e.key === "b") { e.preventDefault(); view.name = "cockpit"; view.targetKey = ""; view.taskId = ""; paint(); return; }
    if (e.key === "h") { e.preventDefault(); view.keys = !view.keys; paint(); return; }
    if (e.key === "r") { e.preventDefault(); view.name = view.name === "report" ? "cockpit" : "report"; paint(); return; }
    if (e.key === "a") {
      e.preventDefault();
      var inp = host && host.querySelector("[data-session-attempt]");
      if (inp) { inp.focus(); inp.scrollIntoView({ block: "center" }); }
      return;
    }
    if (!isTasks) {
      if (e.key === "s") { e.preventDefault(); view.stuck = !view.stuck; if (view.name !== "target" && currentIdx >= 0) view.name = "target"; paint(); return; }
      if (e.key === "o") {
        e.preventDefault();
        var t = items[currentIdx];
        var m = t && machineFor(t);
        if (m && typeof APP.navigate === "function") APP.navigate("#machines/" + m.id);
        return;
      }
      if (e.key === "e" || e.key === "c") {
        e.preventDefault();
        // Both surfaces live in the target panel. From the cockpit, fall back to
        // the target the session is already on — restoring the view costs
        // nothing, where opening a fresh one would start its clock behind the
        // user's back.
        if (view.name !== "target") {
          var back = currentIdx >= 0 ? items[currentIdx] : items.filter(function (it) { return it.key === s.activeTargetKey; })[0];
          if (!back) return;
          view.name = "target";
          view.targetKey = back.key;
          paint();
        }
        if (e.key === "c") {
          // Prefer a flag that has not been captured yet: on a two-flag target
          // the second field is the one the user is reaching for.
          var cap = host && (host.querySelector("[data-session-capture='open']") || host.querySelector("[data-session-capture]"));
          if (cap) { cap.focus(); if (cap.scrollIntoView) cap.scrollIntoView({ block: "center" }); }
          return;
        }
        var queue = host && host.querySelector("[data-session-queue]");
        if (queue && queue.scrollIntoView) queue.scrollIntoView({ block: "center" });
        return;
      }
    } else {
      var task = items[currentIdx];
      if (e.key === "f" && task) { e.preventDefault(); task.flagged = !task.flagged; touch(); paint(); return; }
      if (e.key === "v" && task) { e.preventDefault(); task.status = "verified"; task.verifiedAt = Date.now(); stopTaskClocks(s); touch(); paint(); return; }
    }
  }
  document.addEventListener("keydown", onKey);


  // ══════════════════════════════════════════════════════════════════
  // Programmatic surface
  // The view drives itself from clicks, but starting a session, capturing a
  // flag, logging an attempt and assembling the report all have to be reachable
  // without one — that is what makes the scoring, evidence and report paths
  // assertable, and what a deep link into a running session would use.
  // ══════════════════════════════════════════════════════════════════

  var pendingStart = "";
  function startSession(arg) {
    var id = typeof arg === "string" ? arg : ((arg && (arg.presetId || arg.preset || arg.id)) || "");
    if (!id) return null;
    // Called before the corpus or the saved document has arrived: remember the
    // intent rather than starting a session against a document we have not read,
    // which is exactly how saved work gets overwritten.
    if (!DOC || !window.CS_SESSION_DATA) { pendingStart = id; return null; }
    var preset = presetById(id);
    if (!preset) return null;
    startPreset(preset);
    return activeSession();
  }
  function applyPendingStart() {
    if (!pendingStart || !DOC || !window.CS_SESSION_DATA) return;
    var id = pendingStart;
    pendingStart = "";
    var preset = presetById(id);
    if (preset) startPreset(preset);
  }

  function findFlag(s, flagId) {
    var hit = null;
    (s.targets || []).forEach(function (t) {
      targetFlags(t).forEach(function (f) { if (f.id === flagId) hit = { target: t, flag: f }; });
    });
    return hit;
  }
  // A flag id the preset never shipped is not necessarily a mistake. OSEP ships
  // no targets at all — the number of machines is a deliberate exam secret — and
  // a CTF board grows as challenges open, so the authority on what a flag is
  // called is the vendor's control panel, not this corpus. Adopting it onto the
  // target being worked is more honest than dropping a capture the caller says
  // they made; it carries no points, and the report marks where it came from.
  function adoptFlag(s, flagId) {
    var target = (s.targets || []).filter(function (t) { return t.key === s.activeTargetKey; })[0] ||
      (s.targets || [])[0];
    if (!target) return null;
    var preset = presetById(s.presetId) || {};
    var flag = { id: flagId, label: flagId, points: 0, pointsUnknown: !!preset.pointsUnknown, userAdded: true };
    target.flags = targetFlags(target).concat([flag]);
    return { target: target, flag: flag };
  }
  function captureFlag(arg, maybeValue) {
    var flagId = typeof arg === "string" ? arg : ((arg && (arg.flagId || arg.id)) || "");
    var value = typeof arg === "string" ? maybeValue : (arg && arg.value);
    var s = activeSession();
    if (!s || !flagId) return null;
    var hit = findFlag(s, flagId) || adoptFlag(s, flagId);
    if (!hit) return null;
    hit.target.captures = hit.target.captures || {};
    var cap = hit.target.captures[flagId] ||
      (hit.target.captures[flagId] = { value: "", at: 0, via: "", met: {}, override: null });
    if (value !== undefined && value !== null) cap.value = String(value);
    cap.at = cap.at || Date.now();
    // Recorded the same way the button records it: captured, with any unmet
    // requirement noted rather than quietly dropped, so the report can say so.
    var unmet = unmetEvidence(presetById(s.presetId) || {}, hit.target, hit.flag);
    if (unmet.length) cap.override = { at: Date.now(), unmet: unmet.length };
    markTargetProgress(hit.target);
    touch();
    return cap;
  }

  var OUTCOMES = { ok: 1, partial: 1, fail: 1 };
  function normOutcome(v) { return OUTCOMES[String(v || "")] ? String(v) : "fail"; }
  function logAttempt(arg, maybeText) {
    var s = activeSession();
    if (!s) return null;
    var scope = "", text = "", outcome = "fail", why = "";
    if (arg && typeof arg === "object") {
      text = arg.text || arg.what || "";
      scope = arg.scope || arg.targetKey || arg.target || "";
      outcome = arg.outcome || arg.result || "fail";
      why = arg.why || "";
    } else if (typeof maybeText === "string" && maybeText) {
      scope = String(arg || ""); text = maybeText;
    } else {
      text = String(arg == null ? "" : arg);
    }
    return addAttempt(s, String(scope), text, normOutcome(outcome), why);
  }

  function reportMarkdown() {
    var s = activeSession();
    if (!s) return "";
    var preset = presetById(s.presetId);
    return preset ? buildReportMarkdown(s, preset) : "";
  }

  function setContext(arg) {
    var value = String((typeof arg === "string" ? arg : ((arg && (arg.context || arg.value)) || "")));
    var s = activeSession();
    if (!s) return "";
    s.lastContext = value;
    var task = currentTask(s) || (s.tasks || [])[0];
    // Changing the context invalidates the confirmation: the whole point of the
    // gate is that the confirmation refers to the value that was confirmed.
    if (task) { task.context = value; task.contextConfirmedAt = 0; }
    touch();
    return value;
  }

  // ══════════════════════════════════════════════════════════════════
  // Sidebar badge
  // ══════════════════════════════════════════════════════════════════

  // What the sidebar shows next to "Sessions". app.js calls this on every paint
  // of the nav, before this module has necessarily loaded its document, so it
  // must be cheap, must never throw, and must never kick off a fetch — a badge
  // that triggered the 600KB load would undo the lazy import it is describing.
  //
  // The rule for what it prints is the same one the rest of the feature follows:
  // only report a ratio against a denominator the session actually has. A fresh
  // OSEP session has no targets until the candidate types in what the control
  // panel gave them, and "0/0" there is not a progress report, it is a lie with
  // a slash in it.
  function navBadge() {
    var s = activeSession();
    if (!s) return "";
    if (s.kind === "tasks") {
      var tasks = Array.isArray(s.tasks) ? s.tasks : [];
      if (!tasks.length) return "";
      // Verified only — the same count the session list prints as "N of M
      // verified". Two readouts of the same session that disagree is worse than
      // one that is strict: "applied, unverified" is the gap the CKS retro
      // exists to expose, so it must not quietly read as done up here.
      var done = tasks.filter(function (t) { return t.status === "verified"; }).length;
      return done + "/" + tasks.length;
    }
    var score = sessionScore(s);
    if (score.totalFlags > 0) return score.capturedFlags + "/" + score.totalFlags;
    // Targets with no flags on them yet — say how many targets are in play
    // rather than inventing a flag count for them.
    var targets = Array.isArray(s.targets) ? s.targets : [];
    return targets.length ? String(targets.length) : "";
  }

  // ══════════════════════════════════════════════════════════════════
  // Entry point
  // ══════════════════════════════════════════════════════════════════

  // app.js calls render() on every paint of the exam view, so this has to be
  // idempotent and cheap when the data is already in hand.
  function render(container) {
    host = container;
    mounted = true;
    if (window.CS_SESSION_DATA && DOC) { paint(); return; }
    host.innerHTML = "";
    host.appendChild(loadingPane());
    Promise.all([loadSessionData(), loadDoc()]).then(function () {
      if (!mounted) return;
      applyPendingStart();
      paint();
    }).catch(function (err) {
      if (!mounted) return;
      host.innerHTML = "";
      host.appendChild(errorPane(String((err && err.message) || err), function () {
        dataPromise = null; docPromise = null; docError = null;
        render(host);
      }));
    });
  }

  // Unmount when the app navigates elsewhere: a ticking clock repainting a
  // detached tree is a battery bug nobody ever reports, they just close the app.
  var priorHook = APP.onViewRender;
  if (APP && typeof APP === "object") {
    APP.onViewRender = function (viewId) {
      if (viewId !== "exam") { mounted = false; stopTicking(); }
      if (typeof priorHook === "function") { try { priorHook(viewId); } catch { /* not ours to fail */ } }
    };
  }

  // CS_SESSION is the registration app.js looks for. The derivations are exposed
  // alongside it because they are the part worth asserting on: scoring, the
  // route to a pass mark, budget parsing and probe matching are all pure.
  window.CS_SESSION = {
    render: render,
    navBadge: navBadge,
    startSession: startSession,
    captureFlag: captureFlag,
    logAttempt: logAttempt,
    reportMarkdown: reportMarkdown,
    setContext: setContext,
    scoreMode: scoreMode,
    presetShape: presetShape,
    sessionScore: sessionScore,
    cheapestRoute: cheapestRoute,
    routeForSession: routeForSession,
    budgetsFor: budgetsFor,
    toolRulesFor: toolRulesFor,
    evidenceRulesFor: evidenceRulesFor,
    evidenceKey: evidenceKey,
    unmetEvidence: unmetEvidence,
    presetAsksHow: presetAsksHow,
    normServices: normServices,
    probeFor: probeFor,
    buildQueue: buildQueue,
    resolveCmd: resolveCmd,
    stuckPhaseFor: stuckPhaseFor,
    stuckFocusFor: stuckFocusFor,
    stuckList: stuckList,
    privescPhase: privescPhase,
    taskBudget: taskBudget,
    domainEstimate: domainEstimate,
    buildReportMarkdown: buildReportMarkdown,
    hasClock: hasClock,
    hasReportDeadline: hasReportDeadline,
    hasEnforceable: hasEnforceable
  };
})();
