#!/usr/bin/env node
// One-off repair for the botched auto-translated desc_tr strings ("Verb: <english>").
// Strategy (owner-approved, bounded): apply a hand-authored, high-quality Turkish
// MAP for a curated batch of common descriptions; for every remaining garbled
// desc_tr, revert to the clean English desc (an honest "untranslated" state — far
// better than word-salad). Re-run safe. Usage: node scripts/fix-turklish.js
"use strict";
const fs = require("fs");
const path = require("path");
const SEED = path.join(__dirname, "..", "seed.js");
const data = require(SEED);

const GARBLED = /^[A-Za-zÇĞİÖŞÜçğıöşü]+:\s/;

// Hand-authored, natural Turkish for common descriptions (english desc -> tr).
const MAP = {
  "List all databases": "Tüm veritabanlarını listele",
  "Connect to a specific share": "Belirli bir paylaşıma bağlan",
  "Enumerate shares and permissions": "Paylaşımları ve izinleri listele",
  "Detect Web Application Firewalls": "Web uygulama güvenlik duvarlarını (WAF) tespit et",
  "Enable xp_cmdshell for OS command execution": "OS komutu çalıştırmak için xp_cmdshell'i etkinleştir",
  "Execute OS command via xp_cmdshell": "xp_cmdshell ile OS komutu çalıştır",
  "List all scheduled tasks": "Tüm zamanlanmış görevleri listele",
  "Read PowerShell command history": "PowerShell komut geçmişini oku",
  "Show current user and group memberships": "Mevcut kullanıcı ve grup üyeliklerini göster",
  "List installed packages": "Kurulu paketleri listele",
  "Find world-writable directories": "Herkesçe yazılabilir dizinleri bul",
  "Enumerate AD users": "Active Directory kullanıcılarını listele",
  "Crack bcrypt hashes": "bcrypt hash'lerini kır",
  "Crack AS-REP roasted hashes": "AS-REP roasting hash'lerini kır",
  "Download and execute script in memory": "Scripti indir ve bellekte çalıştır",
  "Forward local port to remote service": "Yerel portu uzak servise yönlendir",
  "List all active port forwards": "Aktif port yönlendirmelerini listele",
  "List all domain groups": "Tüm domain gruplarını listele",
  "List domain groups": "Domain gruplarını listele",
  "List domain controllers": "Domain controller'ları listele",
  "List all domain computers": "Tüm domain bilgisayarlarını listele",
  "Dump cached domain credentials": "Önbellekteki domain kimlik bilgilerini dök",
  "Show routing table": "Yönlendirme tablosunu göster",
  "Show all listening ports": "Dinlenen tüm portları göster",
  "Attempt zone transfer via dnsrecon": "dnsrecon ile zone transfer dene",
  "Enumerate subdomains using search engines and public sources": "Arama motorları ve açık kaynaklarla alt alan adlarını keşfet",
  "Gather emails, subdomains, hosts from public sources": "Açık kaynaklardan e-posta, alt alan adı ve host topla",
  "Query Shodan for target IP information": "Hedef IP bilgisi için Shodan'ı sorgula",
  "Search Shodan for hosts related to a domain": "Bir alan adıyla ilişkili hostlar için Shodan'da ara",
  "Find exposed files on a domain": "Bir alan adında açıkta kalan dosyaları bul",
  "Discover login portals": "Giriş (login) sayfalarını keşfet",
  "Find open directory listings": "Açık dizin listelemelerini bul",
  "Find exposed database dumps": "Açıkta kalan veritabanı dökümlerini bul",
  "Discover backup or sensitive paths": "Yedek veya hassas yolları keşfet",
  "Gather WHOIS, netcraft, subdomain, email, and port info": "WHOIS, netcraft, alt alan adı, e-posta ve port bilgisi topla",
  "Get only the answer section from dig": "dig'den yalnızca cevap (answer) bölümünü al",
  "Query IPv6 AAAA records": "IPv6 AAAA kayıtlarını sorgula",
  "Query SRV records for service discovery": "Servis keşfi için SRV kayıtlarını sorgula",
  "Query a specific DNS server": "Belirli bir DNS sunucusunu sorgula",
  "Scan subnet for NetBIOS names and MACs": "NetBIOS adları ve MAC'ler için alt ağı tara",
  "Enumerate common users via finger service": "finger servisi üzerinden yaygın kullanıcıları listele",
  "Show current user privileges": "Mevcut kullanıcı ayrıcalıklarını göster",
  "Find SUID binaries": "SUID binary'lerini bul",
  "List sudo permissions": "sudo izinlerini listele",
  "Dump LSASS memory": "LSASS belleğini dök",
  "Perform Kerberoasting attack": "Kerberoasting saldırısı gerçekleştir",
  "Perform AS-REP roasting": "AS-REP roasting gerçekleştir",
  "Start a reverse shell listener": "Ters shell dinleyicisi başlat",
  "Upgrade to a fully interactive TTY": "Tam interaktif TTY'ye yükselt",
};

let fixed = 0, reverted = 0;
for (const cat of data) {
  for (const sub of cat.subcategories || []) {
    for (const cmd of sub.commands || []) {
      if (typeof cmd.desc_tr === "string" && GARBLED.test(cmd.desc_tr)) {
        if (cmd.desc && MAP[cmd.desc]) { cmd.desc_tr = MAP[cmd.desc]; fixed++; }
        else if (cmd.desc) { cmd.desc_tr = cmd.desc; reverted++; }
        else { delete cmd.desc_tr; reverted++; }
      }
    }
  }
}

// Preserve the file's existing CRLF line endings so the diff shows only the
// desc_tr lines that actually changed (not a whole-file EOL churn).
const eol = /\r\n/.test(fs.readFileSync(SEED, "utf8")) ? "\r\n" : "\n";
let out = "// cheat-sheet Command Database\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n";
if (eol === "\r\n") out = out.replace(/\n/g, "\r\n");
fs.writeFileSync(SEED, out, "utf8");
console.log(`Repaired garbled desc_tr: ${fixed} translated to proper Turkish, ${reverted} reverted to clean English.`);
