#!/usr/bin/env node
// One-off maintenance: fill in Turkish descriptions (desc_tr) for commands that
// were left untranslated (desc_tr missing or identical to the English desc).
// Safe to re-run — only touches entries whose desc_tr is missing or == desc.
"use strict";
const fs = require("fs");
const path = require("path");

const SEED = path.join(__dirname, "..", "seed.js");
const data = require(SEED);

const MAP = {
  "Reverse DNS": "Ters DNS sorgusu",
  "Fetch historical URLs": "Geçmiş URL'leri getir",
  "Web spider for links": "Bağlantılar için web tarayıcı (spider)",
  "TCP SYN traceroute": "TCP SYN ile traceroute",
  "Standard ICMP traceroute": "Standart ICMP traceroute",
  "Spoof MAC address": "MAC adresini taklit et (spoof)",
  "Fragment packets for evasion": "Atlatma için paketleri parçala (fragment)",
  "OS detection, version, scripts, and traceroute": "İşletim sistemi tespiti, versiyon, scriptler ve traceroute",
  "Expand mailing lists": "Posta listelerini genişlet",
  "Aggressive web technology fingerprinting": "Agresif web teknolojisi parmak izi çıkarma",
  "Follow redirects and show final page": "Yönlendirmeleri takip et ve son sayfayı göster",
  "Fuzz parameter values": "Parametre değerlerini fuzz'la",
  "Try alternative PHP extensions": "Alternatif PHP uzantılarını dene",
  "Access AWS EC2 metadata endpoint": "AWS EC2 metadata uç noktasına eriş",
  "Access Google Cloud metadata endpoint": "Google Cloud metadata uç noktasına eriş",
  "XML bomb for denial of service testing": "Hizmet aksatma (DoS) testi için XML bombası",
  "XXE alternative when you cannot control DOCTYPE": "DOCTYPE'ı kontrol edemediğinde XXE alternatifi",
  "Confirm Jinja2 template engine": "Jinja2 şablon motorunu doğrula",
  "Basic SSTI detection": "Temel SSTI tespiti",
  "Access Flask config": "Flask yapılandırmasına eriş",
  "CL.TE smuggling test payload": "CL.TE request smuggling test yükü",
  "TE.CL smuggling test payload": "TE.CL request smuggling test yükü",
  "Boolean test — always true condition": "Boolean testi — her zaman doğru koşul",
  "Boolean test — always false condition": "Boolean testi — her zaman yanlış koşul",
  "Boolean test — AND always true": "Boolean testi — AND her zaman doğru",
  "Boolean test — AND always false": "Boolean testi — AND her zaman yanlış",
  "Determine database name length": "Veritabanı adı uzunluğunu belirle",
  "Time-based database name extraction": "Zaman tabanlı veritabanı adı çıkarımı",
  "Randomize User-Agent": "User-Agent'ı rastgeleleştir",
  "Second-order SQLi test": "İkincil (second-order) SQLi testi",
  "Alternative NTLM hash theft": "Alternatif NTLM hash çalma",
  "Regex auth bypass": "Regex ile kimlik doğrulama atlatma",
  "Universal XSS payload": "Evrensel XSS yükü",
  "Out-of-band detection": "Bant dışı (out-of-band) tespit",
  "Unicode escape for JavaScript execution": "JavaScript çalıştırmak için Unicode kaçışı",
  "Change base URI": "Base URI'yi değiştir",
  "Reuse a previously captured CSRF token": "Önceden yakalanmış CSRF token'ını yeniden kullan",
  "Auto-submit HTML form": "HTML formunu otomatik gönder",
  "Encrypted HTTPS meterpreter": "Şifreli HTTPS meterpreter",
  "Unix bash reverse": "Unix bash ters kabuk",
  "WAR for Tomcat": "Tomcat için WAR dosyası",
  "EDR bypass loader": "EDR atlatma yükleyicisi (loader)",
  "Busybox netcat shell": "Busybox netcat kabuğu",
  "Shell for Jenkins console": "Jenkins konsolu için kabuk",
  "PowerShell netcat alternative": "PowerShell netcat alternatifi",
  "Fully interactive Windows shell": "Tam etkileşimli Windows kabuğu",
  "View excluded paths": "Hariç tutulan yolları görüntüle",
  "Take ownership of any file and read it": "Herhangi bir dosyanın sahipliğini al ve oku",
  "Recursively search for password strings": "Parola dizgelerini özyinelemeli ara",
  "Security-focused host survey tool": "Güvenlik odaklı host keşif aracı",
  "C# port of PowerUp privesc checks": "PowerUp yetki yükseltme kontrollerinin C# sürümü",
  "Just Another Windows (Enum) Script": "Bir diğer Windows (Enum) scripti — JAWS",
  "If bash has SUID, spawn root shell": "bash SUID ise root kabuğu başlat",
  "Sudo heap overflow affecting versions < 1.9.5p2": "1.9.5p2 öncesi sürümleri etkileyen Sudo heap taşması (Baron Samedit)",
  "Netfilter nf_tables use-after-free": "Netfilter nf_tables use-after-free açığı",
  "Determine if running inside a container": "Bir konteyner içinde çalışılıp çalışılmadığını belirle",
  "Linux privilege checker script": "Linux yetki kontrol scripti",
  "Medusa parallel brute forcer for SSH": "SSH için Medusa paralel kaba kuvvet aracı",
  "Ncrack brute forcer for RDP": "RDP için Ncrack kaba kuvvet aracı",
  "Ncrack brute forcer for SSH": "SSH için Ncrack kaba kuvvet aracı",
  "Ncrack brute forcer for FTP": "FTP için Ncrack kaba kuvvet aracı",
  "Combine two wordlists": "İki kelime listesini birleştir",
  "Display previously cracked hashes": "Önceden kırılmış hash'leri göster",
  "Use optimized kernel": "Optimize edilmiş çekirdeği kullan",
  "Display cracked passwords": "Kırılmış parolaları göster",
  "Perform Pass-the-Hash attack": "Pass-the-Hash saldırısı gerçekleştir",
  "Parse LSASS dump file": "LSASS dump dosyasını ayrıştır",
  "Parse LSASS offline": "LSASS'i çevrimdışı ayrıştır",
  "Combine passwd and shadow for cracking": "Kırma için passwd ve shadow'u birleştir (unshadow)",
  "Use PowerShell v2 which has no AMSI": "AMSI içermeyen PowerShell v2'yi kullan",
  "Auto-reconnecting tunnel": "Otomatik yeniden bağlanan tünel",
  "Background socat forwarder": "Arka planda socat yönlendirici",
  "Port forwarding tool for Windows": "Windows için port yönlendirme aracı",
  "Initialize the PostgreSQL database for Metasploit": "Metasploit için PostgreSQL veritabanını başlat",
  "Drupal RCE": "Drupal uzaktan kod çalıştırma (RCE)",
  "Jenkins Groovy RCE": "Jenkins Groovy uzaktan kod çalıştırma (RCE)",
  "WP shell upload": "WordPress kabuk yükleme",
  "Linux pkexec privesc": "Linux pkexec yetki yükseltme (PwnKit)",
  "Cover tracks": "İzleri temizle",
  "Upgrade shell": "Kabuğu yükselt (stabilize et)",
  "AD security assessment": "Active Directory güvenlik değerlendirmesi",
  "DCSync only the krbtgt account hash": "Yalnızca krbtgt hesabının hash'ini DCSync ile al",
  "sAMAccountName spoofing": "sAMAccountName sahteciliği (spoofing)",
  "Interactive PowerShell remoting session": "Etkileşimli PowerShell uzak oturumu",
  "RDP ignoring certificate warnings": "Sertifika uyarılarını yok sayarak RDP",
  "HTTP upload server": "HTTP yükleme sunucusu",
  "Host WebDAV": "WebDAV sunucusu barındır",
  "Recursively download directory contents": "Dizin içeriğini özyinelemeli indir",
  "Use esentutl.exe for file copy (LOLBin)": "Dosya kopyalamak için esentutl.exe kullan (LOLBin)",
  "Launch the Social Engineering Toolkit interactive menu": "Social Engineering Toolkit etkileşimli menüsünü başlat",
  "Look up DKIM selector DNS record": "DKIM selector DNS kaydını sorgula",
  "Look up mail exchange servers for the domain": "Alan adı için mail sunucularını (MX) sorgula",
  "Shorten and cloak phishing URLs for click-through": "Tıklanma için phishing URL'lerini kısalt ve gizle",
  "Send test email": "Test e-postası gönder",
  "Step 1: Identify web technologies, CMS, and frameworks": "Adım 1: Web teknolojilerini, CMS ve framework'leri tespit et",
  "Step 4: Discover virtual hosts and subdomains": "Adım 4: Sanal hostları ve alt alan adlarını keşfet",
  "NFS: share listing and mount options": "NFS: paylaşım listeleme ve mount seçenekleri",
  "Redis: info gathering, unauthenticated access, config dump": "Redis: bilgi toplama, kimliksiz erişim, yapılandırma dökümü",
  "Web app servers: technology ID, directory enum, default creds": "Web uygulama sunucuları: teknoloji tespiti, dizin keşfi, varsayılan kimlik bilgileri",
  "MongoDB: info gathering and unauthenticated database listing": "MongoDB: bilgi toplama ve kimliksiz veritabanı listeleme",
  "FTP attack checklist": "FTP saldırı kontrol listesi",
  "SSH attack checklist": "SSH saldırı kontrol listesi",
  "SMTP attack checklist": "SMTP saldırı kontrol listesi",
  "SMB attack checklist": "SMB saldırı kontrol listesi",
  "MSSQL attack checklist": "MSSQL saldırı kontrol listesi",
  "MySQL attack checklist": "MySQL saldırı kontrol listesi",
  "WinRM attack checklist": "WinRM saldırı kontrol listesi",
  "Redis attack checklist": "Redis saldırı kontrol listesi",
  "MongoDB attack checklist": "MongoDB saldırı kontrol listesi",
  "View ConfigMap contents including sensitive data": "Hassas veriler dâhil ConfigMap içeriğini görüntüle",
  "Runtime security monitoring for containers": "Konteynerler için çalışma zamanı güvenlik izleme",
  "BloodHound for Azure": "Azure için BloodHound",
  "Rust-based BloodHound collector": "Rust tabanlı BloodHound toplayıcısı (RustHound)",
  "Launch BloodHound GUI": "BloodHound arayüzünü (GUI) başlat",
  "Computers and users marked high value": "Yüksek değerli olarak işaretlenmiş bilgisayar ve kullanıcılar",
  "Accounts that can add KeyCredentialLink": "KeyCredentialLink ekleyebilen hesaplar",
  "Who can read LAPS passwords": "LAPS parolalarını kim okuyabilir",
  "Who can read GMSA passwords": "GMSA parolalarını kim okuyabilir",
  "Use certificate for Kerberos auth (Windows)": "Kerberos kimlik doğrulaması için sertifika kullan (Windows)",
  "Transfer binary file (avoid corruption)": "İkili (binary) dosya aktar (bozulmayı önle)",
  "Follow HTTP redirects verbosely": "HTTP yönlendirmelerini ayrıntılı takip et",
  "Submit POST data": "POST verisi gönder",
  "Ignore certificate warnings": "Sertifika uyarılarını yok say",
  "IPv6 DNS takeover for NTLM capture": "NTLM yakalama için IPv6 DNS ele geçirme",
  "Shutdown the system immediately": "Sistemi hemen kapat",
  "Restart the system immediately": "Sistemi hemen yeniden başlat",
  "Abort a pending shutdown or restart": "Bekleyen kapatma veya yeniden başlatmayı iptal et",
  "Offline WPS attack (pixie dust)": "Çevrimdışı WPS saldırısı (pixie dust)",
  "Enable/disable request interception": "İstek yakalamayı (interception) aç/kapat",
  "Drop/block intercepted request": "Yakalanan isteği düşür/engelle",
  "MSI installer payload (AlwaysInstallElevated)": "MSI yükleyici yükü (AlwaysInstallElevated)",
  "64-bit Linux Meterpreter": "64-bit Linux Meterpreter",
  "WAR file for Tomcat deployment": "Tomcat dağıtımı için WAR dosyası",
  "ASPX shell for IIS servers": "IIS sunucuları için ASPX kabuğu",
};

let fixed = 0;
const unmatched = new Set();
for (const cat of data) {
  for (const sub of cat.subcategories || []) {
    for (const cmd of sub.commands || []) {
      if (!cmd.desc) continue;
      const needs = !cmd.desc_tr || cmd.desc_tr.trim() === cmd.desc.trim();
      if (!needs) continue;
      const tr = MAP[cmd.desc.trim()];
      if (tr) { cmd.desc_tr = tr; fixed++; }
      else unmatched.add(cmd.desc.trim());
    }
  }
}

// Also translate the two category name_tr values left equal to name.
const CAT_NAME_TR = {
  "Burp Suite": "Burp Suite",
  "MSFVenom Payload Reference": "MSFVenom Payload Referansı",
};
for (const cat of data) {
  if (cat.name_tr && cat.name_tr.trim() === cat.name.trim() && CAT_NAME_TR[cat.name.trim()]) {
    cat.name_tr = CAT_NAME_TR[cat.name.trim()];
  }
}

const out = "// cheat-sheet Command Database\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n";
fs.writeFileSync(SEED, out, "utf8");
console.log(`Fixed ${fixed} desc_tr translations.`);
if (unmatched.size) {
  console.log(`Still unmatched (${unmatched.size}):`);
  for (const u of unmatched) console.log("  - " + u);
}
