#!/usr/bin/env node
// ============================================================================
// tag-attack.js — deterministically map commands to MITRE ATT&CK technique ids.
//
// Uses a CURATED, high-precision signature table (well-known tool / technique
// names → verified ATT&CK ids). Conservative on purpose: it only tags a command
// when a distinctive signature matches, so a wrong tag is far less likely than a
// missing one. Authoritative & idempotent: cmd.attack is fully recomputed from
// the rules on every run (no match -> the tag is removed), so it converges from
// any state. cmd.ref / cmd.refs (manual reference links) are never touched.
//
// Offensive commands get tagged; DevSecOps/tooling commands (docker build,
// kubectl get, terraform plan…) correctly stay untagged — ATT&CK is an adversary
// taxonomy. Re-run after adding content:  node scripts/tag-attack.js
// Pure Node, zero deps. Preserves seed.js formatting + line endings.
// ============================================================================
"use strict";
const fs = require("fs");
const path = require("path");
const SEED = path.join(__dirname, "..", "seed.js");

// Each rule: { re, ids:[...], why }. `why` documents intent (used by the
// verification workflow). Order does not matter — a command gets the UNION of
// every matching rule's ids (deduped, capped). Keep patterns DISTINCTIVE.
const RULES = [
  // ── Credential Access ──
  { re: /sekurlsa::logonpasswords|lsass.*(dump|minidump)|comsvcs\.dll.*minidump|procdump.*lsass|out-minidump|mimikatz/i, ids: ["T1003.001"], why: "LSASS memory credential dumping" },
  { re: /secretsdump/i, ids: ["T1003"], why: "OS credential dumping (SAM/LSA/NTDS)" },
  { re: /ntds\.dit|ntdsutil|create shadow.*ntds|\bdcsync\b|lsadump::dcsync/i, ids: ["T1003.003", "T1003.006"], why: "NTDS.dit / DCSync domain credential theft" },
  { re: /reg (save|export).*(sam|system|security)|\bhashdump\b|samdump2|\bpwdump\b/i, ids: ["T1003.002"], why: "SAM database credential dumping" },
  { re: /\/etc\/shadow|\bunshadow\b/i, ids: ["T1003.008"], why: "/etc/passwd and /etc/shadow" },
  { re: /GetUserSPNs|kerberoast/i, ids: ["T1558.003"], why: "Kerberoasting" },
  { re: /GetNPUsers|asrep(roast)?|dont_req_preauth/i, ids: ["T1558.004"], why: "AS-REP Roasting" },
  { re: /kerberos::golden|golden ticket|goldenpac/i, ids: ["T1558.001"], why: "Golden Ticket" },
  { re: /kerberos::silver|silver ticket/i, ids: ["T1558.002"], why: "Silver Ticket" },
  { re: /\bhashcat\b|\bjohn\b|zip2john|ssh2john|\bhashcat\b -m/i, ids: ["T1110.002"], why: "Offline password cracking (hashcat/john). NOTE: rockyou/--wordlist AND bare --format= removed — used by online brute-forcers and docker/kubectl --format." },
  { re: /\bhydra\b|\bmedusa\b|\bpatator\b|\bncrack\b|wpscan.*(password|brute|-P )|\bbrute ?force\b.*(login|ssh|ftp|http|rdp|smb)/i, ids: ["T1110.001"], why: "Online password brute force / guessing" },
  { re: /kerbrute|password spray|\bspray(ing|hound)?\b|continue-on-success/i, ids: ["T1110.003"], why: "Password spraying" },
  { re: /\bresponder\b|llmnr|nbt-ns|\bmitm6\b|ntlmrelayx|smbrelay/i, ids: ["T1557.001"], why: "LLMNR/NBT-NS poisoning & SMB relay" },
  { re: /\blazagne\b|dpapi|masterkey/i, ids: ["T1555"], why: "Credentials from password stores" },
  { re: /(firefox|chrome|browser).*(password|credential|login data)/i, ids: ["T1555.003"], why: "Credentials from web browsers" },
  { re: /cpassword|Get-GPPPassword|group ?polic.*(pref|password)|gpp.*password/i, ids: ["T1552.006"], why: "Group Policy Preferences credentials" },
  { re: /unattend\.xml|sysprep\.inf|grep -ri? password|findstr.*password|find.*-name.*pass|web\.config.*password/i, ids: ["T1552.001"], why: "Credentials in files" },
  { re: /id_rsa\b|id_dsa\b|id_ecdsa\b|id_ed25519\b|\.ssh\/id_/i, ids: ["T1552.001"], why: "SSH private keys in files. NOTE: bare 'private key' removed — hit DevSecOps key management." },
  { re: /\bcat\b.*\.bash_history|read.*bash_history|\.mysql_history|\.bash_history\b/i, ids: ["T1552.003"], why: "Bash History credentials" },

  // ── Discovery ──
  { re: /\bnmap\b|\bmasscan\b|\brustscan\b|-sV\b|-sC\b|--top-ports|\bautorecon\b/i, ids: ["T1046"], why: "Network service scanning/discovery" },
  { re: /netdiscover|arp-scan|\bfping\b|ping sweep|nmap -sn\b/i, ids: ["T1018"], why: "Remote system discovery" },
  { re: /\bwhoami\b/i, ids: ["T1033"], why: "System owner/user discovery" },
  { re: /systeminfo|uname -a|\bhostnamectl\b/i, ids: ["T1082"], why: "System information discovery" },
  { re: /ipconfig|ifconfig|\bip a\b|ip addr|route print|\barp -a\b|Get-NetIPConfiguration/i, ids: ["T1016"], why: "System network configuration discovery" },
  { re: /\bnetstat\b|\bss -[a-z]|Get-NetTCPConnection/i, ids: ["T1049"], why: "System network connections discovery" },
  { re: /\btasklist\b|\bps aux\b|\bps -ef\b|Get-Process\b/i, ids: ["T1057"], why: "Process discovery" },
  { re: /net user\b|net localgroup|Get-LocalUser|enumdomusers|rpcclient.*enumdom|Get-ADUser|Get-DomainUser/i, ids: ["T1087"], why: "Account discovery" },
  { re: /domain admins|Get-ADGroup|Get-DomainGroup|net group .*\/dom/i, ids: ["T1069.002"], why: "Domain permission groups discovery" },
  { re: /bloodhound-python|bloodhound\.py|invoke-bloodhound|sharphound|-collectionmethod|-c all\b/i, ids: ["T1087.002", "T1482"], why: "AD account & trust discovery (BloodHound collectors; excludes neo4j-start infra)" },
  { re: /Get-DomainTrust|nltest.*domain_trusts|enum.*trust/i, ids: ["T1482"], why: "Domain trust discovery" },
  { re: /smbclient.*-L|smbmap|--shares\b|enum4linux|net view|Get-SmbShare/i, ids: ["T1135"], why: "Network share discovery" },

  // ── Execution ──
  { re: /powershell|Invoke-Expression|\bIEX\b|-enc |-EncodedCommand|Invoke-Mimikatz/i, ids: ["T1059.001"], why: "PowerShell" },
  { re: /cmd\.exe|cmd \/c\b/i, ids: ["T1059.003"], why: "Windows Command Shell" },
  { re: /bash -i|\/dev\/tcp\/|\bsh -i\b|\/bin\/bash|\bnc -e\b|mkfifo.*nc/i, ids: ["T1059.004"], why: "Unix shell / reverse shell" },
  { re: /python[23]? -c|pty\.spawn/i, ids: ["T1059.006"], why: "Python" },
  { re: /\bwmic\b|wmiexec|Invoke-WmiMethod|Get-WmiObject/i, ids: ["T1047"], why: "Windows Management Instrumentation" },

  // ── Lateral Movement ──
  { re: /psexec|smbexec|paexec/i, ids: ["T1021.002"], why: "SMB / admin shares lateral movement" },
  { re: /evil-winrm|\bwinrs\b|Enter-PSSession|Invoke-Command -ComputerName/i, ids: ["T1021.006"], why: "Windows Remote Management" },
  { re: /xfreerdp|rdesktop|\bmstsc\b/i, ids: ["T1021.001"], why: "Remote Desktop Protocol" },
  { re: /ssh(pass)?\s+\S*@|ssh -i \S+ \S+@/i, ids: ["T1021.004"], why: "SSH remote services" },
  { re: /pass-the-hash|pass the hash|sekurlsa::pth|\bpth-|--pw-nt-hash| -hashes /i, ids: ["T1550.002"], why: "Pass the Hash" },
  { re: /pass-the-ticket|\bptt\b|\.kirbi|Rubeus.*ptt/i, ids: ["T1550.003"], why: "Pass the Ticket" },

  // ── Persistence ──
  { re: /schtasks|Register-ScheduledTask|scheduled task/i, ids: ["T1053.005"], why: "Scheduled Task" },
  { re: /\bcrontab\b|\/etc\/cron|cron\.d/i, ids: ["T1053.003"], why: "Cron" },
  { re: /reg add.*(\\run|runonce)|CurrentVersion\\+Run|registry run key/i, ids: ["T1547.001"], why: "Registry Run Keys / Startup Folder" },
  { re: /sc create|New-Service|create.*binpath=/i, ids: ["T1543.003"], why: "Windows Service" },
  { re: /authorized_keys/i, ids: ["T1098.004"], why: "SSH Authorized Keys" },
  { re: /net user \S+ \S+ ?\/add|\buseradd\b|\badduser\b|New-LocalUser/i, ids: ["T1136"], why: "Create Account" },
  { re: /skeleton key|misc::skeleton/i, ids: ["T1556"], why: "Modify Authentication Process (skeleton key)" },

  // ── Privilege Escalation ──
  { re: /sudo -l|\bNOPASSWD\b|gtfobins/i, ids: ["T1548.003"], why: "Sudo and Sudo Caching" },
  { re: /-perm -4000|-perm -u=s|\bsuid\b|setuid/i, ids: ["T1548.001"], why: "Setuid and Setgid" },
  { re: /uac bypass|bypassuac|\bfodhelper\b|\beventvwr\b/i, ids: ["T1548.002"], why: "Bypass User Account Control" },
  { re: /getsystem|SeImpersonate|\bpotato\b|juicypotato|rottenpotato|roguepotato|sweetpotato|godpotato|printspoofer|incognito|token::elevate/i, ids: ["T1134.001"], why: "Access Token Manipulation (impersonation). NOTE: bare 'impersonat' removed — matched SQL EXECUTE AS." },
  { re: /dirtycow|dirtypipe|pwnkit|CVE-2021-4034|kernel exploit|linux-exploit-suggester|linpeas|winpeas/i, ids: ["T1068"], why: "Exploitation for Privilege Escalation" },
  { re: /eternalblue|ms17-010|bluekeep|zerologon|printnightmare|petitpotam|CVE-\d{4}-\d+.*RCE/i, ids: ["T1210"], why: "Exploitation of Remote Services" },

  // ── Defense Evasion ──
  { re: /\bamsi\b|AmsiScanBuffer|amsiutils/i, ids: ["T1562.001"], why: "Impair Defenses: Disable/Modify Tools (AMSI)" },
  { re: /Set-MpPreference|DisableRealtimeMonitoring|disable.*defender|defender.*disable/i, ids: ["T1562.001"], why: "Disable Windows Defender" },
  { re: /wevtutil cl|Clear-EventLog|clear.*event log/i, ids: ["T1070.001"], why: "Clear Windows Event Logs" },
  { re: /\btimestomp\b|LastWriteTime *=/i, ids: ["T1070.006"], why: "Timestomp" },
  { re: /history -c|unset HISTFILE|rm .*bash_history/i, ids: ["T1070.003"], why: "Clear Command History" },
  { re: /rundll32/i, ids: ["T1218.011"], why: "Rundll32 proxy execution" },
  { re: /regsvr32/i, ids: ["T1218.010"], why: "Regsvr32 proxy execution" },
  { re: /\bmshta\b/i, ids: ["T1218.005"], why: "Mshta proxy execution" },

  // ── Command & Control / Transfer / Tunneling ──
  { re: /chisel|ligolo|proxychains|ssh -[LRDNfCq]*[LRD]\b|plink.*-R|\bportfwd\b/i, ids: ["T1090", "T1572"], why: "Proxy / protocol tunneling. NOTE: bare 'socat' removed — mostly reverse/bind shells." },
  { re: /\bngrok\b/i, ids: ["T1090"], why: "External proxy (ngrok)" },
  { re: /certutil.*(urlcache|-f -split|download)|wget http|curl -O|Invoke-WebRequest.*-o|smbserver\.py|impacket-smbserver/i, ids: ["T1105"], why: "Ingress tool transfer. NOTE: 'upload*shell' removed — web-shell uploads are T1505.003." },

  // ── Collection / Exfiltration ──
  { re: /\btar cf\b|zip -r|7z a\b|Compress-Archive/i, ids: ["T1560"], why: "Archive collected data" },
  { re: /\bexfil|dnscat|\biodine\b|exfiltration over/i, ids: ["T1048"], why: "Exfiltration over alternative protocol" },

  // ── Reconnaissance ──
  { re: /\bwhois\b|dnsrecon|dnsenum|\bdig \b|nslookup|\bfierce\b|\bamass\b|subfinder|sublist3r|zone transfer|axfr/i, ids: ["T1590.002"], why: "Gather victim network info: DNS" },
  { re: /theharvester|email.*harvest|hunter\.io/i, ids: ["T1589.002"], why: "Gather victim identity info: email" },
  { re: /\bshodan\b|\bcensys\b/i, ids: ["T1596"], why: "Search open technical databases" },
  { re: /gobuster|feroxbuster|\bdirb\b|dirbuster|\bffuf\b|\bwfuzz\b|content discovery/i, ids: ["T1595.003"], why: "Wordlist scanning (web content discovery)" },

  // ── Initial Access / Web ──
  { re: /sqlmap|union select|\bor 1=1\b|sql injection|--dbs\b|--dump\b/i, ids: ["T1190"], why: "Exploit public-facing application (SQLi)" },
  { re: /web ?shell|weevely|china chopper|shell\.(php|aspx|jsp)|cmd\.php/i, ids: ["T1505.003"], why: "Web Shell" },
  { re: /local file inclusion|\bLFI\b|\bRFI\b|directory traversal|path traversal|\.\.\/\.\.\//i, ids: ["T1190"], why: "Exploit public-facing application (LFI/traversal)" },
  { re: /command injection|\bshellshock\b/i, ids: ["T1190"], why: "Exploit public-facing application (cmd injection)" },

  // ── Containers / Cloud-native attack ──
  { re: /container escape|docker\.sock|\/var\/run\/docker|escape to host|privileged container.*(mount|nsenter)|kubelet.*exploit/i, ids: ["T1611"], why: "Escape to Host (container breakout)" },
];

function haystack(cmd) {
  const parts = [cmd.title || "", cmd.desc || ""];
  if (Array.isArray(cmd.cmds)) parts.push(cmd.cmds.join(" "));
  else if (cmd.cmd) parts.push(cmd.cmd);
  return parts.join("  ");
}
// Precision cleanup: when a sub-technique is present, drop its generic parent so
// we don't emit e.g. [T1003, T1003.001]. Also prefer any specific T1552.xxx over
// the catch-all T1552.001 (Credentials In Files) when both were matched.
function refineIds(ids) {
  const parentsWithChild = new Set();
  ids.forEach(id => { const m = id.match(/^(T\d{4})\./); if (m) parentsWithChild.add(m[1]); });
  let out = ids.filter(id => !(/^T\d{4}$/.test(id) && parentsWithChild.has(id)));
  const specific1552 = out.some(id => /^T1552\.(003|004|006)$/.test(id));
  if (specific1552) out = out.filter(id => id !== "T1552.001");
  return out;
}

const MAX_IDS = 4;
// ATT&CK is an ADVERSARY taxonomy. These are the DevSecOps / ops / defense /
// detection categories where tagging a command with the technique it *hardens
// against or detects* (e.g. "drop SUID", "no-new-privileges", Falco/tracee/
// osquery detections) would be misleading. Offensive container/cloud/k8s attacks
// live in the offensive categories (e.g. `container-cloud`), which stay tagged.
const SKIP_CATEGORIES = new Set([
  "docker-engine", "docker-security", "k8s-ops", "k8s-security", "terraform",
  "iac-security", "ansible", "cicd-security", "supply-chain", "secrets-mgmt",
  "cloud-native-runtime", "cspm", "helm", "service-mesh", "observability-sec",
]);

const data = require(SEED);
let tagged = 0, added = 0, cmdCount = 0, skipped = 0;
const perTech = {};

for (const cat of data) {
  if (SKIP_CATEGORIES.has(cat.id)) {
    // Strip any stale tags a prior/looser run may have left in these categories.
    for (const sub of cat.subcategories || []) for (const cmd of sub.commands || []) { if (cmd.attack) { delete cmd.attack; skipped++; } }
    continue;
  }
  for (const sub of cat.subcategories || []) {
    for (const cmd of sub.commands || []) {
      cmdCount++;
      const hs = haystack(cmd);
      const found = [];
      for (const rule of RULES) if (rule.re.test(hs)) for (const id of rule.ids) if (!found.includes(id)) found.push(id);
      const final = refineIds(found).slice(0, MAX_IDS);
      if (final.length) {
        cmd.attack = final; // authoritative: fully recomputed each run
        tagged++;
        added += final.length;
        final.forEach(id => { perTech[id] = (perTech[id] || 0) + 1; });
      } else if (cmd.attack !== undefined) {
        delete cmd.attack; // no rule matched -> remove any stale tag
      }
    }
  }
}

// Write back, preserving the file's line endings (mirrors merge-category.js).
const raw = fs.readFileSync(SEED, "utf8");
const eol = /\r\n/.test(raw) ? "\r\n" : "\n";
let out = "// cheat-sheet Command Database\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n";
if (eol === "\r\n") out = out.replace(/\n/g, "\r\n");
fs.writeFileSync(SEED, out, "utf8");

const techs = Object.keys(perTech).sort();
console.log(`Tagged ${tagged}/${cmdCount} commands (+${added} technique assignments) across ${techs.length} distinct techniques.` + (skipped ? ` Stripped ${skipped} stale tags from skipped DevSecOps categories.` : ""));
if (process.argv.includes("--report")) {
  console.log("\nDistinct techniques used:");
  techs.forEach(id => console.log(`  ${id}  x${perTech[id]}`));
}
