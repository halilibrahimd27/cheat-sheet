"use strict";
// scripts/turklish-detect.js under test.
//
// WHY this file has to exist: validate-content.js imports looksTurklish() and
// fails CI on a ratchet pinned at zero garbled strings. That makes the detector's
// FALSE POSITIVE rate a build-breaking property of the repo — a regex that starts
// flagging correct Turkish does not produce a slightly worse report, it fails the
// build for everyone, and it fails it precisely when somebody has just translated
// a string properly. Six of these regexes were rewritten in one round with no
// test underneath them at all.
//
// So the fixtures below are a hand-written table, not a sample of the corpus:
// corpus-derived cases can only tell you the detector still agrees with itself.
// Each CORRECT entry is Turkish a human would sign off on, and most of them name
// a CamelCase tool — WordPress, PowerShell, BloodHound, SharpHound, JuicyPotato,
// SweetPotato, RustScan, XMLHttpRequest, kube-bench, ArgoCD, MongoDB — because
// "a lowercase run welded to a capital" WAS the old damage signature and it
// describes every one of those names. Roughly half carry a "Verb:" prefix, since
// that is the only shape that reaches the expensive rules at all; an entry with
// no colon proves much less.
//
// Each GARBLED entry carries the specific damage the detector claims to find,
// named in its `why`, so a rule that stops working fails with the reason attached.

const test = require("node:test");
const assert = require("node:assert");
const {
  looksTurklish, looksSuspect, RESIDUAL_AUDIT,
  MERGED_CAMEL, STRANDED_EN, STRANDED_WORDS, MERGED_WORD, STACKED_POSTPOSITION,
} = require("../scripts/turklish-detect.js");

// ── Correct Turkish. None of these may EVER be flagged by the gate. ──
const CORRECT = [
  { tr: "WordPress eklenti sürümlerini listele ve bilinen açıkları ara.",
    en: "Enumerate WordPress plugin versions and search for known vulnerabilities." },
  { tr: "PowerShell betiğini diske yazmadan bellekten çalıştır.",
    en: "Run the PowerShell script from memory without touching disk." },
  { tr: "BloodHound verisini SharpHound toplayıcısı ile topla.",
    en: "Collect BloodHound data with the SharpHound collector." },
  { tr: "Yükselt: JuicyPotato ile yetki yükselt",
    en: "Escalate privileges with JuicyPotato" },
  { tr: "Devre dışı bırak: SweetPotato hizmetini durdur",
    en: "Stop the SweetPotato service" },
  { tr: "kube-bench taramasını çalıştır ve CIS bulgularını incele.",
    en: "Run a kube-bench scan and review the CIS findings." },
  { tr: "Kontrol et: OpenSSL ile sertifika zincirini kontrol et",
    en: "Check the certificate chain with OpenSSL" },
  { tr: "RustScan ile tüm portları hızlıca tara.",
    en: "Scan every port quickly with RustScan." },
  { tr: "Mimikatz bellek dökümünden parolaları çıkarır.",
    en: "Mimikatz extracts passwords from a memory dump." },
  { tr: "Kır: Hashcat ile NTLM özetlerini kır",
    en: "Crack NTLM hashes with Hashcat" },
  { tr: "Listele: MongoDB'deki koleksiyonları listele",
    en: "List the collections in MongoDB" },
  { tr: "XMLHttpRequest çağrılarını yakala ve yeniden oynat.",
    en: "Intercept and replay XMLHttpRequest calls." },
  { tr: "Uyarı: LinPEAS çıktısı çok uzundur, bir dosyaya yönlendir",
    en: "Warning: LinPEAS output is very long, redirect it to a file" },
  { tr: "Not: Nessus taraması ağı belirgin biçimde yavaşlatabilir",
    en: "Note: a Nessus scan can noticeably slow the network" },
  { tr: "Yükselt: Helm ile ArgoCD'yi güncelle",
    en: "Upgrade ArgoCD with Helm" },
  { tr: "Kaba kuvvet: Hydra ile SSH parolalarını dene",
    en: "Brute force SSH passwords with Hydra" },
  { tr: "Terraform durum dosyasındaki hassas değerleri denetle.",
    en: "Audit sensitive values in the Terraform state file." },
  { tr: "İsim çözümlemesini Responder aracıyla zehirle.",
    en: "Poison name resolution with Responder." },
  { tr: "Yakala: Wireshark ile kablosuz trafiği kaydet",
    en: "Capture wireless traffic with Wireshark" },
  { tr: "CrackMapExec oturum açma denemelerini kaydeder.",
    en: "CrackMapExec records the logon attempts." },
  { tr: "Tara: GitLab işlem hattındaki gizli anahtarları tara",
    en: "Scan the GitLab pipeline for secrets" },
  { tr: "Dışa aktar: KeePassXC kasasını yedekle",
    en: "Back up the KeePassXC vault" },
];

// ── Genuinely garbled. Every one of these must be flagged by the gate. ──
const GARBLED = [
  { tr: "Kaba kuvvet: kuvvet saldırısı file extensifilter ile üzerinde",
    en: "Brute force attack on file extensions",
    why: "the historic case: prefix verb restated at the HEAD of the tail, plus a stacked postposition" },
  { tr: "Giriş: logkimlik bilgileri ile doğrula",
    en: "Validate the login credentials",
    why: "merged word — login + kimlik welded together" },
  { tr: "Listele: crongörevleri üzerinden kalıcılık",
    en: "Persistence through cron jobs",
    why: "merged word — cron + görevleri" },
  { tr: "Yetki yükselt: JuicyPotaile yetki al",
    en: "Get privileges with JuicyPotato",
    why: "merged CamelCase — JuicyPotato + ile, the damage signature the CamelCase rule now looks for" },
  { tr: "Tara: SweetPotave ile servis hesabını kullan",
    en: "Use the service account with SweetPotato",
    why: "merged CamelCase — SweetPotato + ve" },
  { tr: "Tara: substitutiüzerinden port taraması",
    en: "Port scan by substitution",
    why: "merged word — substitution + üzerinden" },
  { tr: "Ara: search for the flag in dosya",
    en: "Search for the flag in the file",
    why: "stranded English function words, no prefix rule needed" },
  { tr: "Bu komut is used to enumerate shares",
    en: "This command is used to enumerate shares",
    why: "stranded English function words in a string with no colon at all" },
  { tr: "Denetle: audit the kubernetes cluster",
    en: "Audit the Kubernetes cluster",
    why: "stranded 'the'" },
  { tr: "Listele: MSSQL databases listesi",
    en: "List the MSSQL databases",
    why: "an untranslated English run carried over verbatim from the source" },
  { tr: "Bilgi: information gathering için kullanılır",
    en: "Information gathering tool",
    why: "two consecutive source words never translated" },
  { tr: "Yükselt: yükseltme saldırısı üzerinde",
    en: "Escalation attack",
    why: "a postposition dangling at the end of the clause" },
  { tr: "Doğrula: parola kelime listesi ile üzerinde dene",
    en: "Try the password wordlist",
    why: "stacked postpositions — ile üzerinde" },
];

test("no correct Turkish string is flagged by the CI gate — a false positive here fails the build", () => {
  const flagged = CORRECT.filter((c) => looksTurklish(c.tr, c.en));
  assert.deepStrictEqual(flagged.map((c) => c.tr), [],
    flagged.length + " of " + CORRECT.length + " hand-written correct strings were called garbled. " +
    "validate-content.js ratchets garbled at 0, so each one of these fails CI for a correctly translated string.");
});

test("every genuinely garbled string is flagged by the CI gate", () => {
  const missed = GARBLED.filter((g) => !looksTurklish(g.tr, g.en));
  assert.deepStrictEqual(missed.map((g) => g.tr + "  ← " + g.why), [],
    missed.length + " of " + GARBLED.length + " garbled strings slipped past the detector");
});

test("looksSuspect is a superset of the gate — the residual can only be wider, never narrower", () => {
  // looksSuspect() is what validate-content.js prints next to the zero. If it
  // ever reported FEWER strings than the gate, the printed residual would claim
  // the corpus is cleaner than the gate already proved it is not.
  for (const g of GARBLED) {
    assert.ok(looksSuspect(g.tr, g.en), "gate flagged but looksSuspect did not: " + g.tr);
  }
  // looksSuspect() drops the prefix anchor, so it is ALLOWED to over-report in
  // principle. Measured on this table it over-reports nothing, and that measured
  // zero is what is pinned here: the residual count printed in CI is only worth
  // reading while it is not padded with correct translations.
  const extra = CORRECT.filter((c) => looksSuspect(c.tr, c.en));
  assert.deepStrictEqual(extra.map((c) => c.tr), [],
    "looksSuspect now over-reports " + extra.length + "/" + CORRECT.length + " correct strings, " +
    "which inflates the residual estimate CI prints next to the gate's zero");
});

test("a CamelCase tool name on its own is never the damage signature", () => {
  // This is the regression that made 16 of 22 correct strings fail: the old rule
  // was /[a-zçğıöşü]{3,}[A-ZÇĞİÖŞÜ]/, which is a description of CamelCase, not of
  // damage. The replacement needs a Turkish particle FUSED to the token's end.
  const names = ["WordPress", "PowerShell", "BloodHound", "SharpHound", "JuicyPotato",
    "SweetPotato", "RustScan", "XMLHttpRequest", "CrackMapExec", "KeePassXC",
    "GitLab", "ArgoCD", "MongoDB", "LinPEAS", "OpenSSL", "kube-bench"];
  for (const n of names) {
    assert.ok(!MERGED_CAMEL.test(n), n + " is a tool name, not damage");
    assert.ok(!MERGED_CAMEL.test("Kontrol et: " + n + " ile doğrula"),
      n + " followed by a SPACE and 'ile' is ordinary Turkish");
  }
  // …and the weld itself still is.
  assert.ok(MERGED_CAMEL.test("JuicyPotaile"), "the fused form is what the rule exists for");
  assert.ok(MERGED_CAMEL.test("SweetPotave"));
});

test("the English function-word list excludes every word that is also Turkish", () => {
  // Each of these is a real Turkish word. Listing one would flag correct Turkish
  // everywhere it appears, with no prefix required — the widest possible blast
  // radius in this file.
  const alsoTurkish = ["at", "it", "on", "an", "en", "not", "has", "as", "o", "her", "no", "am"];
  const listed = alsoTurkish.filter((w) => STRANDED_WORDS.includes(w));
  assert.deepStrictEqual(listed, [], "these are Turkish words and must never be stranded-English evidence");
  assert.ok(!STRANDED_EN.test("Sunucu günlüklerini her gün kontrol et, at ve on portlarını not al."),
    "a Turkish sentence built entirely out of the excluded words must stay clean");
  // A hyphen binds, so established loan terms survive.
  assert.ok(!STRANDED_EN.test("Out-of-band veri sızdırma denemesi"), "Out-of-band is a kept loan term");
  assert.ok(STRANDED_EN.test("veri sızdırma with DNS"), "a truly stranded function word is still caught");
});

test("a desc_tr identical to desc is untranslated, not garbled — the validator counts them apart", () => {
  const same = "Enumerate SMB shares with smbclient";
  assert.strictEqual(looksTurklish(same, same), false);
  assert.strictEqual(looksSuspect(same, same), false);
  assert.strictEqual(looksTurklish("", "anything"), false);
  assert.strictEqual(looksTurklish("   ", "anything"), false);
  assert.strictEqual(looksTurklish(null, "anything"), false);
  assert.strictEqual(looksTurklish(undefined, undefined), false);
});

test("the merged-word and stacked-postposition rules need real evidence, not a keyword", () => {
  // "kimlik", "listesi", "doğrulama" and "üzerinde" are ordinary Turkish words.
  // The rule must fire on the WELD, not on the vocabulary.
  assert.ok(!MERGED_WORD.test("kimlik doğrulama listesi hazırla"), "ordinary Turkish nouns, spaced");
  assert.ok(MERGED_WORD.test("logkimlik"), "the same noun welded to English is the evidence");
  assert.ok(!STACKED_POSTPOSITION.test("Dosya üzerinde çalış ve kaydet"), "one postposition mid-sentence is grammar");
  assert.ok(STACKED_POSTPOSITION.test("ile üzerinde"), "two stacked is not");
  assert.ok(STACKED_POSTPOSITION.test("parolayı dene üzerinde"), "one dangling at the very end is not");
});

test("Turkish verb-final grammar is not a duplicate — the exemption that cost 9 false positives", () => {
  // "Kontrol et: … kontrol et" restates the label verb at the END because Turkish
  // puts the verb there. Only a repeat BEFORE that trailing restatement counts.
  assert.strictEqual(looksTurklish("Kontrol et: sistem günlüklerini kontrol et", "Check the system logs"), false);
  assert.strictEqual(looksTurklish("Listele: açık portları listele", "List the open ports"), false);
  assert.strictEqual(looksTurklish("Yükselt: JuicyPotato ile yetki yükselt", "Escalate with JuicyPotato"), false);
  // The head-of-tail repeat is still damage.
  assert.strictEqual(looksTurklish("Kaba kuvvet: kuvvet saldırısı ile giriş dene", "Brute force the login"), true);
});

test("the residual audit is a real measurement and stays quotable", () => {
  // validate-content.js prints RESIDUAL_AUDIT.rate × translated as the honest
  // number next to the gate's zero. A placeholder here would put a fabricated
  // figure on the build log.
  assert.match(RESIDUAL_AUDIT.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(RESIDUAL_AUDIT.sample >= 100, "a sample under 100 cannot carry a percentage to one decimal");
  assert.ok(RESIDUAL_AUDIT.garbledInSample > 0 && RESIDUAL_AUDIT.garbledInSample < RESIDUAL_AUDIT.sample);
  assert.strictEqual(RESIDUAL_AUDIT.rate, RESIDUAL_AUDIT.garbledInSample / RESIDUAL_AUDIT.sample);
});

test("the shipped corpus does not regress past the ratchet validate-content.js enforces", () => {
  // The gate is only meaningful against the content it gates. This is the same
  // walk validate-content.js does, minus the reporting.
  //
  // Asserted against the RECORDED ratchet, never a hardcoded number: the point
  // of a ratchet is that it may only go down, and pinning a literal here means
  // the test has to be edited every time the content genuinely improves —
  // which is exactly the kind of friction that stops people improving it.
  const seed = require("../seed.js");
  const cats = Array.isArray(seed) ? seed : (seed.categories || seed.default || []);
  const bad = [];
  let checked = 0;
  for (const cat of cats) {
    for (const sub of cat.subcategories || []) {
      for (const c of sub.commands || []) {
        if (typeof c.desc_tr !== "string" || !c.desc_tr || c.desc_tr === c.desc) continue;
        checked++;
        if (looksTurklish(c.desc_tr, c.desc)) bad.push(c.desc_tr);
      }
    }
  }
  assert.ok(checked > 1000, "only " + checked + " translated strings were reached — the walk found the wrong shape");
  const ratchet = require("../scripts/content-progress.json").quality_ratchet.garbled;
  assert.ok(
    bad.length <= ratchet,
    bad.length + " garbled strings in seed.js, above the recorded ratchet of " + ratchet +
    ". Either fix the content or lower the ratchet with `node scripts/validate-content.js --update-baseline`. First few: " +
    JSON.stringify(bad.slice(0, 5), null, 2)
  );
});

test("an ALL-CAPS operator the English also capitalises is not a stranded preposition", () => {
  // "Boolean test — AND always true" translates correctly as "Boolean testi —
  // AND her zaman doğru": that AND is the SQL operator being named. The gate
  // flagged it, and fix-turklish.js reverts whatever the gate flags — so this
  // blind spot would have replaced three pieces of good Turkish with English,
  // which is the exact outcome the repair script exists to avoid.
  const keeps = [
    ["Boolean testi — AND her zaman doğru", "Boolean test — AND always true"],
    ["Boolean testi — AND her zaman yanlış", "Boolean test — AND always false"],
    ["Mantıksal OR ile enjekte et", "Inject using logical OR"],
    ["SMTP RCPT TO ile kullanıcıları listele", "Enumerate users via SMTP RCPT TO"]
  ];
  for (const [tr, en] of keeps) {
    assert.strictEqual(looksTurklish(tr, en), false,
      JSON.stringify(tr) + " is a correct translation that names an operator — flagging it costs good Turkish");
  }

  // The exemption is narrow on purpose, and each half of it carries weight.
  const stillCaught = [
    // lowercase in the same position is the damage signature
    ["Boolean testi — and her zaman doğru", "Boolean test — AND always true"],
    // …and an ALL-CAPS word the English never used is not an operator being named
    ["AND her zaman doğru", "Boolean test always true"],
    ["Kaba kuvvet: kuvvet saldırısı TO wordlist", "Brute force a wordlist"]
  ];
  for (const [tr, en] of stillCaught) {
    assert.strictEqual(looksTurklish(tr, en), true,
      JSON.stringify(tr) + " should still be caught — the exemption must not become a hole");
  }
});

test("a $-prefixed operator is one word, not a preposition with a sigil in front", () => {
  // "$where" is a MongoDB operator and "$in" a query selector. The word-boundary
  // rule already treats a hyphen as part of the word so "Out-of-band" survives;
  // a leading "$" is the same situation, and without it the correct translation
  // of "Inject JavaScript in $where operator" was flagged as salad.
  assert.strictEqual(looksTurklish("$where operatörüne JavaScript enjekte et", "Inject JavaScript in $where operator"), false);
  assert.strictEqual(looksTurklish("Birden fazla değeri test etmek için $in kullan", "Use $in to test multiple values"), false);
  // The bare word is still the damage signature.
  assert.strictEqual(looksTurklish("Kontrol et: where the file is", "Check where the file is"), true);
});

test("a word glued to a slash is a path or clause pair, not stranded prose", () => {
  // "group_vars/all" is an Ansible path and "must/filter" an Elasticsearch
  // clause pair. The "all" and the "must" are the whole token; reading them out
  // flagged two correct translations, which fix-turklish.js would then revert.
  assert.strictEqual(looksTurklish("group_vars/all icindeki degiskenler her hosta uygulanir",
    "Variables in group_vars/all apply to every host"), false);
  assert.strictEqual(looksTurklish("must/filter cumlelerini birlestir", "Combine must/filter clauses"), false);
  // A slash does not launder a genuine stranded run with spaces around it.
  assert.strictEqual(looksTurklish("Kaba kuvvet: kuvvet saldirisi all files", "Brute force all files"), true);
});

test("a lowercase connector between two Title-Case words is part of a proper noun", () => {
  // "Microsoft Defender for Cloud" is a product name; its "for" belongs to the
  // name as much as the words either side.
  assert.strictEqual(looksTurklish("Defender for Cloud plan kapsamini kontrol et",
    "Check Defender for Cloud plan coverage"), false);
  // Both neighbours must be capitalised — a lowercase target still flags.
  assert.strictEqual(looksTurklish("Kontrol et: the domain bilgisi", "Check the domain info"), true);
});

test("a CamelCase name ending in a glue syllable is not a merged-word weld", () => {
  // MERGED_CAMEL hunts a Turkish glue welded onto an English word ("cronile"),
  // but "SeccompProfile" (a Kubernetes Kind) reads as "SeccompProf" + "ile". The
  // tell is that a real weld never appears verbatim in the English source while a
  // kept name does — so a match that is a substring of en is a name, not damage.
  assert.strictEqual(looksSuspect(
    "SPO ile bir iş yükünün sistem çağrılarını bir SeccompProfile CR'ine kaydeder",
    "Record syscalls from a workload into a SeccompProfile CR via SPO"), false);
  // A genuine CamelCase weld — glue fused onto a name, not present in en — still flags.
  assert.strictEqual(looksSuspect("LoadBalancerüzerinden trafiği yönlendir", "Route traffic to the service"), true);
});
