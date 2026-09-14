#!/usr/bin/env node
// Shared "is this desc_tr machine-translation word salad?" detector.
//
// It lives in its own module because validate-content.js (the gate) and
// fix-turklish.js (the repair) MUST agree: when they each carried their own copy
// the copies were identical and identically wrong — a single-word-verb-prefix
// regex, /^Word:\s/ — so CI certified "0 garbled" while ~400 strings like
// "Kaba kuvvet: kuvvet saldırısı file extensifilter ile üzerinde" shipped, and
// the repair script was structurally incapable of even seeing them.
//
// The second failure mode is the mirror image of the first, and it is the one
// this file is shaped around now. A colon prefix on its own is NOT evidence of
// anything: "Uyarı: …", "Not: …", "Kontrol et: sistem günlüklerini incele" are
// perfectly good Turkish. Flagging those turns the ratchet in validate-content.js
// into a trap that fails CI for *correctly* translating a string — the detector
// punishing the exact work it exists to encourage. So a prefix only locates the
// suspect half of the sentence; something else has to prove the tail is still
// untranslated before anything is flagged.
//
// The third failure mode is the same trap wearing a different mask, and it cost
// this file two more rules. A *name* is not evidence. Correct Turkish keeps tool
// names, CVE ids and protocol names exactly as English writes them, so:
//   - /[a-zçğıöşü]{3,}[A-ZÇĞİÖŞÜ]/ ("a lowercase run welded to a capital") does
//     not describe damage, it describes CamelCase. It matches *inside* WordPress,
//     PowerShell, BloodHound, SharpHound, RustScan, XMLHttpRequest — so every
//     correct translation that named a tool was certified garbled. With garbled
//     ratcheted at 0, translating a string correctly failed CI. It is replaced
//     below by the actual damage signature: a Turkish particle welded onto the
//     END of a CamelCase token ("JuicyPotaile" = JuicyPotato + ile).
//   - "this Turkish repeats two words of the English desc" counted names too, so
//     "Yükselt: Helm ile ArgoCD'yi güncelle" — a complete, correct translation —
//     was proof of nothing being translated. Only the source's ordinary lowercase
//     vocabulary counts now; see translatableVocab().
//
// The fourth mask is verb-final word order and it is handled in
// duplicatesPrefixVerb() below; the fifth is englishDominant() counting names as
// English. Both are documented where they live.
//
// One rule about the numbers in this file, learned the hard way: an accuracy
// claim is a property of the set it was measured on, never of the detector. The
// old header quoted "22 hand-written strings, 16 flagged" and a later report
// quoted "0 false positives" from the same kind of set, and neither survived a
// second look because neither set was in the repo. So the sets are now in this
// file (EVAL_GOOD, EVAL_BAD, AUDIT_GARBLED), every figure is recomputed from
// them by report(), and `node scripts/turklish-detect.js` prints the result,
// misses and false positives named. Today it is ~53% recall at 100% precision on
// the hand set and ~63% recall on a random audit sample: honestly partial, and
// said out loud, which is the whole point.
"use strict";

// 1) The translator's shape: a short Turkish verb phrase, a colon, then the tail
//    it was supposed to translate. One to three words ("Kontrol et:",
//    "Kaba kuvvet:", "Devre dışı bırak:"). Capturing, because both halves are
//    needed below: the prefix to spot a verb it duplicated into the tail, the
//    tail to look for leftover English.
const VERB_PREFIX = /^([A-Za-zÇĞİÖŞÜ][A-Za-zÇĞİÖŞÜçğıöşü]*(?:\s+[a-zçğıöşü]+){0,2}):\s+(\S[\s\S]*)$/u;

// 2) English function words stranded mid-string. These have no Turkish homograph,
//    so a standalone one is proof the sentence was never really translated — it
//    stands on its own, with or without a prefix.
//    Deliberately NOT listed, because they ARE Turkish words and would produce
//    false positives: at, it, on, an, en, not, has, as, o, her, no, am.
const STRANDED_WORDS = [
  "and", "or", "for", "with", "without", "the", "to", "of", "from", "by", "into", "onto",
  "than", "then", "that", "this", "these", "those", "which", "where", "when", "while",
  "until", "before", "after", "during", "between", "through", "against", "over", "under",
  "above", "below", "all", "any", "each", "every", "both", "if", "is", "are", "was", "were",
  "been", "being", "have", "does", "did", "will", "would", "could", "should", "must",
  "may", "might", "their", "your", "our", "they", "using", "via",
];
// A hyphen counts as part of a word here so established loan terms the Turkish
// text legitimately keeps — "Out-of-band", "man-in-the-middle" — are not flagged.
// So does a leading "$": "$where" is a MongoDB operator and "$in" a query
// selector, and reading the tail of one as a stranded English preposition
// flagged a correct translation of "Inject JavaScript in $where operator".
// And so does a "/" on either side: a word glued to a slash is a path component
// or a logical pair, not stranded prose — "group_vars/all" (an Ansible path) and
// "must/filter" (an Elasticsearch clause pair) are the whole token, and reading
// the "all" or the "must" out of them flagged two correct translations.
const STRANDED_EN = new RegExp(
  "(?<![\\p{L}\\p{N}_$/-])(?:" + STRANDED_WORDS.join("|") + ")(?![\\p{L}\\p{N}_/-])",
  "iu"
);
const STRANDED_EN_ALL = new RegExp(STRANDED_EN.source, "giu");

// …except when the word is an OPERATOR the English itself spells in capitals.
//
// "Boolean test — AND always true" is translated correctly as "Boolean testi —
// AND her zaman doğru": that AND is the SQL operator being named, not a
// conjunction left behind. Same for OR, and for SMTP's RCPT TO. The gate flagged
// all three, and reverting them would have replaced good Turkish with English —
// the one outcome fix-turklish.js exists to avoid.
//
// The exemption is deliberately narrow: the token must be ALL-CAPS in the
// Turkish AND appear ALL-CAPS in the English source. A lowercase "and" in the
// same position is still the damage signature, and so is an "AND" the English
// never used — the translator that produced the salad did not invent capitals.
function strandedEnglish(tr, en) {
  STRANDED_EN_ALL.lastIndex = 0;
  let m;
  while ((m = STRANDED_EN_ALL.exec(tr)) !== null) {
    const tok = m[0];
    if (/^[A-Z]{2,}$/.test(tok) && typeof en === "string" &&
        new RegExp("(?<![\\p{L}\\p{N}_-])" + tok + "(?![\\p{L}\\p{N}_-])", "u").test(en)) continue;
    // …or when the lowercase word is sandwiched between two Title-Case words: a
    // connector inside a proper noun, not a preposition left behind. "Microsoft
    // Defender for Cloud" is a product name, and its "for" is as much a part of
    // the name as the words either side of it. Requiring BOTH neighbours to be
    // capitalised keeps "Check the domain" (the → domain, lowercase) flagged.
    if (/^[a-z]+$/.test(tok)) {
      const before = tr.slice(0, m.index).match(/([\p{L}\p{N}]+)\s+$/u);
      const after = tr.slice(m.index + tok.length).match(/^\s+([\p{L}\p{N}]+)/u);
      if (before && after && /^\p{Lu}/u.test(before[1]) && /^\p{Lu}/u.test(after[1])) continue;
    }
    return true;
  }
  return false;
}

// 3) Merged words. The translator substituted Turkish for English *inside* words,
//    welding the replacement onto whatever ASCII was left: "substitutiüzerinden"
//    (substitution + on->üzerinden), "logkimlik" (login + kimlik), "crgörevleri"
//    (cron + görevleri). The glue list is only the multi-letter replacements it
//    actually emitted; "ile" and "ve" are excluded because they occur inside
//    ordinary Turkish words ("etkile", "bilgile") and would match everything.
const GLUE = "üzerinden|üzerinde|içinden|içinde|kimlik|kelime|saldırısı|görevleri|zafiyet|bilgileri|listesi|doğrulama";
const MERGED_WORD = new RegExp("[A-Za-z]{3,}(?:" + GLUE + ")", "iu");
// The same substitution run also left postpositions stacked on each other
// ("üzerinden üzerinde", "ile üzerinde") or dangling at the very end of a clause.
// Turkish never stacks them; the auto-translator did it constantly.
const STACKED_POSTPOSITION = /(?:(?<![\p{L}\p{N}])(?:ile|üzerinde|üzerinden|içinde|içinden)\s+(?:üzerinde|üzerinden|içinde|içinden)(?![\p{L}\p{N}]))|(?:\s(?:üzerinde|içinde)\s*$)/iu;
// The same weld, but the ASCII half is a CamelCase product name: "JuicyPotaile"
// (JuicyPotato + ile), "SweetPotaile'e". The evidence is the Turkish particle
// fused onto the end of the token with no space — NOT the CamelCase itself, which
// is just how the tool is spelled. "ile" and "ve" are safe to look for here,
// unlike in MERGED_WORD above, because the token must also contain an internal
// capital: an ordinary Turkish word ending in -ile never does.
const MERGED_CAMEL = new RegExp(
  "(?<![\\p{L}\\p{N}_-])[A-Za-z]*[a-z][A-ZÇĞİÖŞÜ][A-Za-z]*(?:ile|ve|" + GLUE + ")(?![\\p{L}\\p{N}_-])",
  "u"
);

// Tokenising happens BEFORE lowercasing, and that ordering is load-bearing rather
// than cosmetic. Capitalisation is the only case-independent signal that separates
// a product name from a common noun, and it is the signal englishDominant() below
// needs. The old wordsOf() lowercased first and then filtered with /^[a-z0-9]...$/,
// a test that LOOKS like it excludes names but cannot: by the time it ran,
// "PowerShell" was already "powershell" and passed. Hence tokensOf() (case kept)
// with wordsOf() layered on top, instead of a hand-maintained list of tool names —
// a list would have to be extended for every new tool the corpus gains, and the
// rot would silently reopen this exact false positive.
const WORD_RE = /[A-Za-zÇĞİÖŞÜçğıöşü0-9][A-Za-zÇĞİÖŞÜçğıöşü0-9'-]*/gu;
// Turkish attaches case endings to foreign names with an apostrophe — "MongoDB'e",
// "connections'e" — so the apostrophe tail has to come off before a token can be
// compared with the English source, or every suffixed name silently stops matching.
const CASE_SUFFIX = /'[A-Za-zÇĞİÖŞÜçğıöşü]{1,3}$/u;
function tokensOf(s) {
  return (String(s).match(WORD_RE) || []).map((w) => w.replace(CASE_SUFFIX, ""));
}
// "İ".toLowerCase() is "i" + U+0307 (combining dot above), and U+0307 is not in
// WORD_RE, so lowercasing first used to split "İsim" into "i" + "sim" — 50 strings
// in the corpus tokenised into a phantom one-letter word. Dropping the combining
// dot after the fold keeps "İsim" as one token, "isim".
function wordsOf(s) {
  return tokensOf(s).map((w) => w.toLowerCase().replace(/\u0307/g, ""));
}

// 4) Untranslated English carried straight over from desc. The English original
//    is the ground truth here: if the "Turkish" still repeats a phrase of it
//    verbatim, that phrase was never translated. Two consecutive shared words is
//    proof; two separate shared words of four letters or more is the weaker form
//    (a single shared token is not — every good Turkish desc keeps tool names,
//    CVE ids and protocol names exactly as they are).
//
// Which is precisely why only part of the source counts. A word the English
// capitalises anywhere but the first position, or writes in ALL CAPS, is a name
// (WordPress, BloodHound, SMB, CVE) and names are supposed to survive
// translation untouched. Excluding them is what stops a correct translation that
// mentions two tools from being read as two untranslated words.
function translatableVocab(en) {
  const toks = String(en).match(/[A-Za-z][A-Za-z0-9'-]*/g) || [];
  const names = new Set(), plain = new Set();
  toks.forEach((t, i) => {
    const isName = (i > 0 && /^[A-Z]/.test(t)) || /^[A-Z0-9-]{2,}$/.test(t);
    (isName ? names : plain).add(t.toLowerCase());
  });
  for (const n of names) plain.delete(n);
  return plain;
}
function carriesEnglishRun(tail, en) {
  if (typeof en !== "string" || !en) return false;
  const vocab = translatableVocab(en);
  const a = wordsOf(tail), b = wordsOf(en);
  for (let i = 0; i + 1 < a.length; i++) {
    // ONE of the pair has to be ordinary vocabulary. Requiring both would lose
    // "Listele: MSSQL databases" (a name plus the untranslated noun after it,
    // which is the single most common half-translation in the corpus); requiring
    // neither re-flags "Burp Suite", a name that is two words long.
    if (!vocab.has(a[i]) && !vocab.has(a[i + 1])) continue;
    for (let j = 0; j + 1 < b.length; j++) {
      if (b[j] === a[i] && b[j + 1] === a[i + 1]) return true;
    }
  }
  return false;
}
function carriesEnglishWords(tail, en) {
  if (typeof en !== "string" || !en) return false;
  const vocab = translatableVocab(en);
  const shared = wordsOf(tail).filter((w) => w.length >= 4 && /^[a-z][a-z-]*$/.test(w) && vocab.has(w));
  return new Set(shared).size >= 2;
}
// "Kaba kuvvet: kuvvet saldırısı …" — the verb from the prefix reappears in the
// tail because the substitution pass translated the same English word twice.
//
// The fourth failure mode lived here, and it was the worst of the four: Turkish is
// verb-final, so restating the label verb at the END of the clause is not damage,
// it is the grammar. "Kontrol et: OpenSSL ile sertifika zincirini kontrol et" and
// "Yükselt: JuicyPotato ile yetki yükselt" are both correct, and both were flagged
// — 9 of 30 hand-written correct strings, measured. With garbled ratcheted at 0
// that is CI failing because someone translated a string properly. So the trailing
// restatement of the prefix is peeled off first and only a repeat BEFORE it counts;
// in "Kaba kuvvet: kuvvet saldırısı …" the repeat sits at the head of the tail, so
// that one still flags. Measured cost of the exemption: zero true positives, on the
// 1665-string historic garbled corpus and on both evaluation sets below.
function sameStem(a, b) {
  if (a === b) return true;
  // "Listele:" vs a tail ending "listeler" — the same verb wearing a suffix.
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  return short.length >= 4 && long.startsWith(short);
}
function duplicatesPrefixVerb(prefix, tail) {
  const p = wordsOf(prefix), t = wordsOf(tail);
  let restated = t.length;
  for (let i = p.length - 1, j = t.length - 1; i >= 0 && j >= 0; i--, j--) {
    if (!sameStem(p[i], t[j])) break;
    restated = j;
  }
  const seen = new Set(p.filter((w) => w.length > 3));
  return t.slice(0, restated).some((w) => seen.has(w));
}

// A desc_tr identical to desc is "untranslated", not garbled — honest English is
// a separate (and far less bad) problem, counted separately by the validator.
function looksTurklish(tr, en) {
  if (typeof tr !== "string" || !tr.trim()) return false;
  if (typeof en === "string" && tr === en) return false;
  // Stranded English function words need no prefix; they are damning anywhere.
  if (strandedEnglish(tr, en)) return true;
  const m = VERB_PREFIX.exec(tr);
  if (!m) return false;
  const [, prefix, tail] = m;
  return MERGED_WORD.test(tail) || MERGED_CAMEL.test(tail) || STACKED_POSTPOSITION.test(tail) ||
    duplicatesPrefixVerb(prefix, tail) || carriesEnglishRun(tail, en) || carriesEnglishWords(tail, en);
}

// ---------------------------------------------------------------------------
// The residual, and what is actually known about it.
//
// looksTurklish() above is the CI gate, so it is deliberately prefix-anchored and
// conservative: everything it flags gets reverted to English by fix-turklish.js,
// and reverting a good translation is worse than keeping a bad one. The cost of
// that conservatism is recall, and reporting "0 garbled" without reporting the
// recall is how this file lied the first time.
//
// looksSuspect() used to be described here as "the honest counterweight: the same
// evidence, unanchored". That was an overclaim and the measurement says so. On the
// 1665-string historic garbled corpus (see HISTORIC below) the gate catches 1501
// and looksSuspect catches 1501 too — not one string more. It is no second opinion on
// the strings the repair already handled. What it is worth is visible only on the
// strings that survived: of the 3374 Turkish descs in seed.js today the gate proves
// 0 and looksSuspect flags 128, essentially all of them from englishDominant() plus
// the dangling-postposition arm of STACKED_POSTPOSITION — one heuristic aimed at
// one shape, not the same evidence unanchored. It is NOT a gate and nothing
// rewrites content from it; validate-content.js prints its count so the residual
// is on screen next to the zero.
const RESIDUAL_AUDIT = {
  // Method, so the number can be attacked: take every command in seed.js whose
  // desc_tr is a real Turkish string (present, non-empty, !== desc) in file order,
  // shuffle with the seeded PRNG in sampleAudit() below, take the first 150, and
  // hand-label each one garbled / not. Garbled = machine-translation word salad or
  // an English clause with a Turkish postposition bolted on ("Escape Docker group
  // üzerinden"); a translation that correctly keeps a tool, protocol or product
  // name in English is NOT garbled. Labels are in AUDIT_GARBLED and the sample is
  // regenerated at report time, so `node scripts/turklish-detect.js` recomputes
  // precision and recall against them instead of trusting these numbers.
  date: "2026-09-11",
  sample: 150,
  garbledInSample: 16,
  // Of seed.js strings that have a real Turkish desc_tr (desc_tr !== desc).
  poolSize: 3374,
  prngSeed: 20260911,
  get rate() { return this.garbledInSample / this.sample; },
  // 16/150 = 10.7%. A normal-approximation 95% interval on that is 5.7%–15.6%,
  // i.e. 193–527 of the 3374 — so quote the interval, not the point estimate, and
  // never the gate's 0. The previous note in this file claimed 8.3% from a
  // 120-string sample; that is inside this interval, so it was not "understated
  // 15x", it was one sample and so is this one. What was genuinely wrong was
  // calling the point estimate "the real figure".
  get ci95() {
    const p = this.rate, se = Math.sqrt(p * (1 - p) / this.sample);
    return [Math.max(0, p - 1.96 * se), Math.min(1, p + 1.96 * se)];
  },
};

// The historic repair, re-derived rather than quoted. Reproduce with:
//   git show 829018e^:seed.js > before.js
// then pair each command in before.js with the command in today's seed.js that has
// the same cmd string, matching the i-th occurrence of a duplicated cmd with the
// i-th occurrence (NOT via a Map keyed on cmd — 243 command strings repeat in
// seed.js and a Map collapses them, which is what made this number irreproducible
// before: the same walk keyed with a last-wins Map reports 1558, and pairing only
// inside the single commit 829018e reports 1201).
const HISTORIC = {
  reconstructedFrom: "829018e^",
  // desc_tr was real Turkish before and is byte-identical to desc today.
  reverted: 1665,
  // Same walk, Map-keyed on cmd instead of occurrence-paired — recorded because the
  // gap between the two IS the duplicate-command artefact, not a disagreement.
  revertedMapKeyed: 1558,
  // Today's detector replayed over those 1665 original desc_tr values.
  gateRecall: 1501,
  suspectRecall: 1501,
};

// Enough of the string is verbatim source English that it is an English clause
// wearing a Turkish hat ("Lightweight HTTP server busybox üzerinden").
//
// Two things changed here, and both are the same lesson the gate learned twice.
//   - The source side counts only translatableVocab(en): a word the English
//     capitalises anywhere but the first position, or writes in ALL CAPS, is a name
//     and names are SUPPOSED to survive translation. With the whole source counting,
//     "Falco, Tetragon, Tracee, Sysdig ve osquery kur" — correct Turkish, five tool
//     names and a Turkish verb — scored 5/6 English and was called salad. Four of
//     the seven name-list strings in EVAL_GOOD were flagged that way.
//   - The token side tests the RAW token, before wordsOf() folds case. The old code
//     filtered with the same /^[a-z0-9][a-z0-9-]*$/ but ran it on already-lowercased
//     words, so "PowerShell" and "BloodHound" passed it and counted as English
//     evidence. Run before the fold, that one regex excludes every CamelCase and
//     capitalised name on its own — no tool-name list to maintain and rot.
// Four-word minimum, not five: the old five came from names dominating the ratio in
// short strings, and names no longer enter the ratio. Measured, dropping to four
// costs 0 false positives on EVAL_GOOD and recovers 1 true positive on EVAL_BAD and
// 1 on the audit sample.
//
// This is a real trade and not a free win. Excluding names costs recall, because in
// half-translated salad the surviving English is often itself a name: it loses 3 of
// 15 on EVAL_BAD and 2 of 16 on the audit sample ("Interactive PowerShell shell
// WinRM password üzerinden ile" is now missed). Precision was chosen over recall
// because looksSuspect feeds a ratcheted CI metric, and a false positive there
// makes correct translation fail the build.
function englishDominant(tr, en) {
  if (typeof en !== "string" || !en) return false;
  const toks = tokensOf(tr);
  if (toks.length < 4) return false;
  const vocab = translatableVocab(en);
  const shared = toks.filter((t) => /^[a-z0-9][a-z0-9-]*$/.test(t) && vocab.has(t.toLowerCase()));
  return shared.length / toks.length >= 0.7;
}
// A CamelCase "weld" that is really a kept proper noun. MERGED_CAMEL hunts a
// Turkish glue welded onto an English word with no space ("cronile"), but it
// also fires on any CamelCase name that merely ENDS in a glue syllable —
// "SeccompProfile" reads as "SeccompProf" + "ile". The tell is that a real weld
// never appears verbatim in the English source, whereas a kept name (the K8s
// Kind "SeccompProfile") does. So a MERGED_CAMEL match that is a substring of en
// is a name, not damage.
function mergedCamelWeld(tr, en) {
  const m = MERGED_CAMEL.exec(tr);
  MERGED_CAMEL.lastIndex = 0;
  if (!m) return false;
  if (typeof en === "string" && en.toLowerCase().includes(m[0].toLowerCase())) return false;
  return true;
}
function looksSuspect(tr, en) {
  if (typeof tr !== "string" || !tr.trim()) return false;
  if (typeof en === "string" && tr === en) return false;
  return looksTurklish(tr, en) || MERGED_WORD.test(tr) || mergedCamelWeld(tr, en) ||
    STACKED_POSTPOSITION.test(tr) || englishDominant(tr, en);
}

// ---------------------------------------------------------------------------
// Evaluation set. Hand-written, kept here rather than in test/ because the numbers
// this file reports about itself have to be recomputed from it, not transcribed —
// transcribed numbers are exactly what went stale twice.
//
// EVAL_GOOD is correct Turkish in this corpus's register; more than half of it
// names a CamelCase, hyphenated or lower-case tool (WordPress, PowerShell,
// BloodHound, SharpHound, JuicyPotato, kube-bench, netexec, Burp Suite, ArgoCD,
// Ligolo-ng, …) because that is the shape every previous version of this detector
// got wrong. Nine of these were flagged by the gate before the verb-final fix
// above; four of the tool-list entries were flagged by englishDominant before the
// name exclusion. Any flag here is a build-breaking false positive, so the target
// is zero and the report prints the exceptions by name.
const EVAL_GOOD = [
  ["Escalate privileges with JuicyPotato", "Yükselt: JuicyPotato ile yetki yükselt"],
  ["Collect Active Directory data with SharpHound", "Topla: SharpHound ile Active Directory verisi topla"],
  ["Scan a WordPress site for vulnerable plugins", "Tara: WordPress sitesini zafiyetli eklentiler için tara"],
  ["Run the CIS Kubernetes benchmark with kube-bench", "Çalıştır: kube-bench ile CIS Kubernetes kıyaslamasını çalıştır"],
  ["Dump credentials from LSASS with Mimikatz", "Mimikatz ile LSASS belleğinden kimlik bilgilerini dök"],
  ["Analyse attack paths in BloodHound", "BloodHound içinde saldırı yollarını analiz et"],
  ["Spray passwords over SMB with netexec", "netexec ile SMB üzerinde parola püskürtmesi yap"],
  ["Intercept HTTPS traffic in Burp Suite", "Burp Suite ile HTTPS trafiğini araya girerek yakala"],
  ["Bypass AMSI in a PowerShell session", "PowerShell oturumunda AMSI korumasını atlat"],
  ["Enumerate shares with SMBClient", "Listele: SMBClient ile paylaşımları listele"],
  ["Check the certificate chain with OpenSSL", "Kontrol et: OpenSSL ile sertifika zincirini kontrol et"],
  ["Generate a reverse shell payload with msfvenom", "Oluştur: msfvenom ile ters bağlantı yükü oluştur"],
  ["Warning: this command deletes every container", "Uyarı: bu komut tüm konteynerleri siler"],
  ["Note: requires cluster-admin rights", "Not: cluster-admin yetkisi gerektirir"],
  ["Inspect system logs for failed logins", "İncele: sistem günlüklerini başarısız oturum açmalar için incele"],
  ["Sign a container image with cosign", "İmzala: cosign ile konteyner imajını imzala"],
  ["Scan Terraform code with tfsec", "tfsec ile Terraform kodunu tara"],
  ["Find secrets in git history with trufflehog", "trufflehog ile git geçmişindeki sırları bul"],
  ["Fuzz directories with ffuf", "ffuf ile dizinleri tara"],
  ["Relay NTLM authentication with ntlmrelayx", "ntlmrelayx ile NTLM kimlik doğrulamasını aktar"],
  ["Enumerate cloud posture with ScoutSuite", "ScoutSuite ile bulut güvenlik duruşunu listele"],
  ["Capture packets on the wire with tcpdump", "tcpdump ile hat üzerindeki paketleri yakala"],
  ["Query the GraphQL endpoint for the schema", "Sorgula: GraphQL uç noktasından şemayı sorgula"],
  ["Deploy the chart with Helm and update ArgoCD", "Yükselt: Helm ile ArgoCD'yi güncelle"],
  ["Disable the legacy SSLv3 protocol", "Devre dışı bırak: eski SSLv3 protokolünü kapat"],
  ["Crack the hash with Hashcat in straight mode", "Hashcat ile hash'i düz modda kır"],
  ["List running pods in every namespace", "Tüm ad alanlarındaki çalışan pod'ları listele"],
  ["Export findings as SARIF for the CI security tab", "Bulguları CI güvenlik sekmesi için SARIF olarak dışa aktar"],
  ["Escalate to SYSTEM with PrintSpoofer", "PrintSpoofer ile SYSTEM haklarına yüksel"],
  ["Audit the cluster with kube-hunter and Polaris", "Denetle: kube-hunter ve Polaris ile kümeyi denetle"],
  // Tool-list descriptions: the shape englishDominant() used to certify as salad
  // because every content word was a name that also appears in the English.
  ["Prometheus, Loki, Tempo, Mimir and Grafana stack", "Prometheus, Loki, Tempo, Mimir ve Grafana yığını"],
  ["Run kube-bench, kube-hunter, kubeaudit, Polaris and Kubescape", "kube-bench, kube-hunter, kubeaudit, Polaris ve Kubescape çalıştır"],
  ["Install Falco, Tetragon, Tracee, Sysdig and osquery", "Falco, Tetragon, Tracee, Sysdig ve osquery kur"],
  ["Chain BloodHound, SharpHound, AzureHound and ADExplorer", "BloodHound, SharpHound, AzureHound ve ADExplorer zincirle"],
  ["Compare Trivy, Grype, Syft, Dockle and Docker Scout", "Trivy, Grype, Syft, Dockle ve Docker Scout karşılaştır"],
  ["Pivot with Ligolo-ng, Chisel, sshuttle and socat", "Ligolo-ng, Chisel, sshuttle ve socat ile pivot yap"],
  ["Fuzz with ffuf, feroxbuster, gobuster and dirsearch", "ffuf, feroxbuster, gobuster ve dirsearch ile tara"],
];
// EVAL_BAD is not hand-invented: every entry is a real desc_tr lifted verbatim from
// the pre-repair corpus or from seed.js as it stands today. Inventing garbage would
// measure how well the regexes match garbage this author can imagine, which is the
// one number nobody needs.
const EVAL_BAD = [
  ["Brute force file extension filter", "Kaba kuvvet: kuvvet saldırısı file extensifilter ile üzerinde"],
  ["Fuzz with authenticated session", "Fuzz authenticated sessiile üzerinde"],
  ["Users with potential passwords in description", "Users potential passwords descriptiile üzerinde içinde"],
  ["Interactive PowerShell shell via WinRM with password", "Interactive PowerShell shell WinRM password üzerinden ile"],
  ["Send requests through Burp proxy using curl", "Send requests Burp vekil sunucu (proxy) curl kullanarak üzerinden"],
  ["Null byte to bypass extension appending (PHP <5.3)", "Null byte bypass extensiappending (PHP <5.3) üzerinde'e"],
  ["Computers with unconstrained delegation", "Computers sınırsız delegasyile üzerinde"],
  ["Escape via Docker group", "Escape Docker group üzerinden"],
  ["Time-based extraction on SQLite via heavy query", "Time-based extraction SQLite heavy query üzerinden üzerinde"],
  ["Count tables in current database", "Count tables mevcut database içinde"],
  ["Access web service through proxy", "Access web service vekil sunucu (proxy) üzerinden"],
  ["Match processes to network connections", "Match processes network connections'e"],
  ["Deploy a WAR payload through Tomcat Manager", "Deploy a WAR payload Tomcat Manager üzerinden"],
  ["Step 1: Obtain enrollment agent certificate", "Step 1: Obtaenrollment agent certificate içinde"],
  ["Enumerate users via SMTP VRFY/EXPN/RCPT", "Listele: users SMTP VRFY/EXPN/RCPT üzerinden"],
];
// The 16 strings hand-labelled garbled in the 150-string audit sample described by
// RESIDUAL_AUDIT. Stored verbatim so the report can recompute recall on them even
// if the sample itself can no longer be regenerated (see sampleAudit()).
const AUDIT_GARBLED = [
  "Fuzz authenticated sessiile üzerinde",
  "Users potential passwords descriptiile üzerinde içinde",
  "Interactive PowerShell shell WinRM password üzerinden ile",
  "Send requests Burp vekil sunucu (proxy) curl kullanarak üzerinden",
  "Null byte bypass extensiappending (PHP <5.3) üzerinde'e",
  "Computers sınırsız delegasyile üzerinde",
  "Scrape Linkedfor names içinde",
  "Automatic authorizatitesting (IDOR detection) üzerinde",
  "Time-based extraction SQLite heavy query üzerinden üzerinde",
  "Escape Docker group üzerinden",
  "Count tables mevcut database içinde",
  "Access web service vekil sunucu (proxy) üzerinden",
  "Step 1: Obtaenrollment agent certificate içinde",
  "Deploy a WAR payload Tomcat Manager üzerinden",
  "Match processes network connections'e",
  "Step 3: Service versiand default script tarama on açık portlar üzerinde",
];

function scoreSet(pairs, expectGarbled) {
  const gate = pairs.filter(([en, tr]) => looksTurklish(tr, en));
  const suspect = pairs.filter(([en, tr]) => looksSuspect(tr, en));
  return {
    n: pairs.length,
    gate: gate.length,
    suspect: suspect.length,
    // The interesting list is the wrong one: misses for a garbled set, hits for a
    // good set.
    wrong: (expectGarbled ? pairs.filter(([en, tr]) => !looksSuspect(tr, en)) : suspect).map((x) => x[1]),
  };
}

// Regenerate the audit sample from seed.js. Returns null when it cannot be trusted
// — seed.js unavailable, or the translated-string pool no longer the size the labels
// were drawn against, in which case the shuffle lands somewhere else entirely and
// silently mislabels. A null here means "re-audit", not "fine".
function sampleAudit(seed) {
  if (!Array.isArray(seed)) return null;
  const pool = [];
  seed.forEach((c) => (c.subcategories || []).forEach((s) => (s.commands || []).forEach((m) => {
    if (typeof m.desc_tr === "string" && m.desc_tr.trim() && m.desc_tr !== m.desc) pool.push(m);
  })));
  if (pool.length !== RESIDUAL_AUDIT.poolSize) return null;
  let a = RESIDUAL_AUDIT.prngSeed | 0;
  const rand = () => {
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const idx = pool.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = idx[i]; idx[i] = idx[j]; idx[j] = tmp;
  }
  const labels = new Set(AUDIT_GARBLED);
  const rows = idx.slice(0, RESIDUAL_AUDIT.sample).map((i) => pool[i]);
  const garbled = rows.filter((m) => labels.has(m.desc_tr));
  // If the labelled strings did not come back in the sample the seed drifted under
  // the recorded pool size; refuse to report rather than report nonsense.
  if (garbled.length !== RESIDUAL_AUDIT.garbledInSample) return null;
  return {
    n: rows.length,
    garbled: garbled.length,
    truePos: garbled.filter((m) => looksSuspect(m.desc_tr, m.desc)).length,
    falsePos: rows.filter((m) => !labels.has(m.desc_tr) && looksSuspect(m.desc_tr, m.desc)).map((m) => m.desc_tr),
    gateFalsePos: rows.filter((m) => !labels.has(m.desc_tr) && looksTurklish(m.desc_tr, m.desc)).length,
  };
}

function pct(a, b) { return b ? (a / b * 100).toFixed(1) + "%" : "n/a"; }

// Printed by `node scripts/turklish-detect.js` and reused by fix-turklish.js, so
// every figure this project quotes about the detector is computed from the sets
// above at the moment it is printed.
function report(seed) {
  const good = scoreSet(EVAL_GOOD, false), bad = scoreSet(EVAL_BAD, true);
  const out = [];
  out.push("Turklish detector — measured, not asserted.");
  out.push(`Hand-written evaluation set (${good.n} correct Turkish, ${bad.n} real garbled strings):`);
  out.push(`  gate looksTurklish():   ${good.gate} false positive(s) on the correct set, ` +
    `${bad.gate}/${bad.n} of the garbled set caught`);
  out.push(`  looksSuspect():         ${good.suspect} false positive(s) on the correct set, ` +
    `${bad.suspect}/${bad.n} caught — precision ${pct(bad.suspect, bad.suspect + good.suspect)}, recall ${pct(bad.suspect, bad.n)}`);
  bad.wrong.forEach((t) => out.push("    missed: " + t));
  good.wrong.forEach((t) => out.push("    FALSE POSITIVE: " + t));
  const a = sampleAudit(seed);
  if (a) {
    out.push(`Seeded random audit sample (${a.n} real desc_tr values, hand-labelled ${RESIDUAL_AUDIT.date}):`);
    out.push(`  ${a.garbled} garbled = ${pct(a.garbled, a.n)} of translated strings ` +
      `(95% CI ${(RESIDUAL_AUDIT.ci95[0] * 100).toFixed(1)}%–${(RESIDUAL_AUDIT.ci95[1] * 100).toFixed(1)}%)`);
    out.push(`  looksSuspect(): ${a.truePos}/${a.garbled} caught (recall ${pct(a.truePos, a.garbled)}), ` +
      `${a.falsePos.length} false positive(s) on the ${a.n - a.garbled} good ones; gate: ${a.gateFalsePos} false positive(s)`);
    a.falsePos.forEach((t) => out.push("    FALSE POSITIVE: " + t));
  } else if (seed) {
    out.push("Seeded random audit sample: NOT reproducible against this seed.js — re-audit before quoting a rate.");
  }
  out.push(`Historic repair (${HISTORIC.reconstructedFrom} -> today, occurrence-paired on cmd): ` +
    `${HISTORIC.reverted} desc_tr reverted to English (${HISTORIC.revertedMapKeyed} if duplicate cmd strings are collapsed into a Map).`);
  out.push(`  Replaying today's detector over those ${HISTORIC.reverted}: gate ${HISTORIC.gateRecall} ` +
    `(${pct(HISTORIC.gateRecall, HISTORIC.reverted)}), looksSuspect ${HISTORIC.suspectRecall} — ` +
    `${HISTORIC.suspectRecall - HISTORIC.gateRecall} more. looksSuspect is no second opinion on known ` +
    "salad; it earns its keep only on the shape the gate cannot see at all.");
  return out.join("\n");
}

module.exports = {
  looksTurklish, looksSuspect, RESIDUAL_AUDIT, HISTORIC,
  VERB_PREFIX, STRANDED_EN, STRANDED_WORDS,
  MERGED_WORD, MERGED_CAMEL, STACKED_POSTPOSITION,
  englishDominant, tokensOf, wordsOf, translatableVocab,
  EVAL_GOOD, EVAL_BAD, AUDIT_GARBLED, scoreSet, sampleAudit, report,
};

if (require.main === module) {
  let seed = null;
  // The report is strictly better with seed.js, but the detector must stay usable
  // (and testable) without it, so a missing/broken seed degrades the report rather
  // than crashing the run.
  try { seed = require(require("path").join(__dirname, "..", "seed.js")); } catch { seed = null; }
  console.log(report(seed));
}
