# OSCP (legacy, pre-1 Nov 2024)

> 3 standalone + 2 ad-client + 1 ad-dc · 23h45 · 70 to pass  
> Sessions: 14.03.2026 11:48:00 · Elapsed 21h 30m

## Score

80 / 100 · 70 to pass

> RETIRED FORMAT. 3 independent 2-step targets at 20 points each (10 low-privilege, 10 privilege escalation) = 60, plus an Active Directory set of 2 clients and 1 domain controller worth 40 — awarded ONLY for the full exploit chain of the domain, with no partial points. 70/100 to pass, 100 the exam maximum. A separate 10 bonus points (taking the practical ceiling to 110) were earned before the exam by completing at least 80% of the module lab questions in every PEN-200 module and submitting 30 correct proof.txt hashes from the challenge labs; those bonus points were valid only for exams taken on or before 31 October 2024.

---

## OffSec Certified Professional Exam Report — Introduction


## Objective


## Requirements


## High-Level Summary


## Recommendations


## Methodologies — Information Gathering


## Methodologies — Service Enumeration


## Methodologies — Penetration


## Methodologies — Maintaining Access


## Methodologies — House Cleaning


## Independent Challenges — Target #N: Initial Access


## Independent Challenges — Target #N: Service Enumeration


## Independent Challenges — Target #N: Privilege Escalation


## Independent Challenges — Target #N: Post Exploitation (local.txt / proof.txt)


## Active Directory Set — Host #N: Initial Access


## Active Directory Set — Host #N: Privilege Escalation


## Active Directory Set — Host #N: Post-Exploitation (flag)


## Additional Items Not Mentioned in the Report


---

# Targets

## Independent target #1

- **Phase:** evidence
- **on target:** 4h 6m
- **Machine:** Sentinel (`10.10.11.42`) · Linux (Ubuntu 20.04)

### Flags

- [x] **local.txt — low-privilege access** (10) — 15.03.2026 00:24:00 · ssh as svc_web, password reused from a .bak file
  - `6f1c4a9e2d7b83f05ac16e94d2b7c308`
  - [ ] _(official)_ Each local.txt and proof.txt must be shown in a screenshot that includes the contents of the file AS WELL AS the IP address of the target, obtained with ipconfig, ifconfig or ip addr — both in the same frame. (Wording identical to the current guide.)
  - [ ] _(official)_ Proof file contents must be obtained in an interactive shell on the target with cat or type, from the file's original location. Any other method — including any type of web-based shell — scores zero for that target.
  - [ ] _(official)_ Flag contents must also be submitted in the exam control panel before the exam ends; missing either the panel submission or the screenshot scores zero for that target.
  - [ ] _(official)_ Modified exploits must be documented with the modified code, the URL of the original, the shellcode generation command, highlighted changes and an explanation; unmodified exploits with the URL alone.
- [x] **proof.txt — root / SYSTEM / Administrator** (10) — 15.03.2026 01:54:00 · sudo tar --checkpoint-action=exec
  - `b28d7f4c90e1a536cd82f7409be15a6d`
  - [ ] _(official)_ Each local.txt and proof.txt must be shown in a screenshot that includes the contents of the file AS WELL AS the IP address of the target, obtained with ipconfig, ifconfig or ip addr — both in the same frame. (Wording identical to the current guide.)
  - [ ] _(official)_ Proof file contents must be obtained in an interactive shell on the target with cat or type, from the file's original location. Any other method — including any type of web-based shell — scores zero for that target.
  - [ ] _(official)_ Flag contents must also be submitted in the exam control panel before the exam ends; missing either the panel submission or the screenshot scores zero for that target.
  - [ ] _(official)_ Modified exploits must be documented with the modified code, the URL of the original, the shellcode generation command, highlighted changes and an explanation; unmodified exploits with the URL alone.

### Services

| Port | Proto | State | Service | Version |
|---|---|---|---|---|
| 22 | tcp | open | ssh | OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0) |
| 80 | tcp | open | http | Apache httpd 2.4.41 ((Ubuntu)) |
| 3306 | tcp | filtered | mysql |  |

### Credentials

| User | Secret | Type | Source |
|---|---|---|---|
| svc_web | `Str0ngDBPass!2024` | password | /backup/site-config.php.bak |
| admin | `admin` | password | portal login form — guessed |
| root | `(no password — sudo tar)` | other | sudo -l misconfiguration |

### Timeline

- `nmap -sCV -p- --min-rate 2000 -oA sentinel 10.10.11.42` _(14.03.2026 12:15:00)_
- **14.03.2026 12:33:00** — 22/80 open, 3306 filtered. Apache 2.4.41, no obvious CVE — this is a content problem, not a version problem.
- `feroxbuster -u http://10.10.11.42 -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x php,bak,txt` _(14.03.2026 12:42:00)_
- **14.03.2026 13:06:00** — /backup/ returns a directory listing. site-config.php.bak is served as text/plain.
- `curl -s http://10.10.11.42/backup/site-config.php.bak` _(14.03.2026 13:18:00)_
- **14.03.2026 13:30:00** — DB creds in the clear: svc_web / Str0ngDBPass!2024
- `ssh svc_web@10.10.11.42` _(14.03.2026 13:54:00)_
- **14.03.2026 14:24:00** — Password reuse — shell as svc_web. local.txt captured.
- `sudo -l` _(14.03.2026 14:36:00)_
- **14.03.2026 14:48:00** — (ALL) NOPASSWD: /usr/bin/tar — GTFOBins has this one.
- `sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh` _(14.03.2026 15:30:00)_
- **14.03.2026 15:54:00** — Root shell. proof.txt captured. Screenshots taken with the whoami/hostname/ip banner in frame.

### Attempts

| # | Attempts | failed | Why it failed / what it told you (optional) |
|---|---|---|---|
| 1 | hydra against the portal login form | failed | rate-limited after 5 attempts; `admin` is the only account and it is not the way in |
| 2 | searchsploit apache 2.4.41 | failed | nothing that applies to a stock Ubuntu build — this box is a content problem, not a version problem |

### Notes on this preset

Backup file left indexable; DB password reused for SSH; sudo tar to root. Written up in full.

## Independent target #2

- **Phase:** evidence
- **on target:** 3h 24m

### Flags

- [x] **local.txt — low-privilege access** (10) — 15.03.2026 04:36:00 · unauthenticated upload — the filter checked Content-Type only
  - `4d9f71c0e3a852bd6417f9c30e5b8a27`
  - [ ] _(official)_ Each local.txt and proof.txt must be shown in a screenshot that includes the contents of the file AS WELL AS the IP address of the target, obtained with ipconfig, ifconfig or ip addr — both in the same frame. (Wording identical to the current guide.)
  - [ ] _(official)_ Proof file contents must be obtained in an interactive shell on the target with cat or type, from the file's original location. Any other method — including any type of web-based shell — scores zero for that target.
  - [ ] _(official)_ Flag contents must also be submitted in the exam control panel before the exam ends; missing either the panel submission or the screenshot scores zero for that target.
  - [ ] _(official)_ Modified exploits must be documented with the modified code, the URL of the original, the shellcode generation command, highlighted changes and an explanation; unmodified exploits with the URL alone.
- [x] **proof.txt — root / SYSTEM / Administrator** (10) — 15.03.2026 05:48:00 · unquoted service path in a third-party service
  - `ae35b0d8c471f62930d5b1e87a4cf026`
  - [ ] _(official)_ Each local.txt and proof.txt must be shown in a screenshot that includes the contents of the file AS WELL AS the IP address of the target, obtained with ipconfig, ifconfig or ip addr — both in the same frame. (Wording identical to the current guide.)
  - [ ] _(official)_ Proof file contents must be obtained in an interactive shell on the target with cat or type, from the file's original location. Any other method — including any type of web-based shell — scores zero for that target.
  - [ ] _(official)_ Flag contents must also be submitted in the exam control panel before the exam ends; missing either the panel submission or the screenshot scores zero for that target.
  - [ ] _(official)_ Modified exploits must be documented with the modified code, the URL of the original, the shellcode generation command, highlighted changes and an explanation; unmodified exploits with the URL alone.

### Notes on this preset

Windows Server 2019. Upload filter trusted the request's own Content-Type header.

## Independent target #3

- **Phase:** svc-enum
- **on target:** 2h 12m

### Flags

- [ ] **local.txt — low-privilege access** (10)
  - [ ] _(official)_ Each local.txt and proof.txt must be shown in a screenshot that includes the contents of the file AS WELL AS the IP address of the target, obtained with ipconfig, ifconfig or ip addr — both in the same frame. (Wording identical to the current guide.)
  - [ ] _(official)_ Proof file contents must be obtained in an interactive shell on the target with cat or type, from the file's original location. Any other method — including any type of web-based shell — scores zero for that target.
  - [ ] _(official)_ Flag contents must also be submitted in the exam control panel before the exam ends; missing either the panel submission or the screenshot scores zero for that target.
  - [ ] _(official)_ Modified exploits must be documented with the modified code, the URL of the original, the shellcode generation command, highlighted changes and an explanation; unmodified exploits with the URL alone.
- [ ] **proof.txt — root / SYSTEM / Administrator** (10)
  - [ ] _(official)_ Each local.txt and proof.txt must be shown in a screenshot that includes the contents of the file AS WELL AS the IP address of the target, obtained with ipconfig, ifconfig or ip addr — both in the same frame. (Wording identical to the current guide.)
  - [ ] _(official)_ Proof file contents must be obtained in an interactive shell on the target with cat or type, from the file's original location. Any other method — including any type of web-based shell — scores zero for that target.
  - [ ] _(official)_ Flag contents must also be submitted in the exam control panel before the exam ends; missing either the panel submission or the screenshot scores zero for that target.
  - [ ] _(official)_ Modified exploits must be documented with the modified code, the URL of the original, the shellcode generation command, highlighted changes and an explanation; unmodified exploits with the URL alone.

### Attempts

| # | Attempts | failed | Why it failed / what it told you (optional) |
|---|---|---|---|
| 1 | linpeas, then pspy for 25 minutes | failed | no writable cron, no SUID outside the baseline, kernel patched |
| 2 | re-ran the full port scan in case the first one missed something | failed | identical result — rescanning is what running out of ideas looks like, and it cost 20 minutes |

### Notes on this preset

Never got a foothold. 80 was already banked, so the last two hours went on evidence for the four targets that were done rather than on a fifth attempt here.

## AD set — client #1 (no points on its own)

- **Phase:** legacy-ad-creds
- **on target:** 2h 36m

### Flags

- [x] **Client #1 flag — required for the chain, worth 0 by itself** — 14.03.2026 15:06:00 · SMB null session → password spray
  - `1a4c9e07b3d5f8261c7e0a49bd3f5e82`
  - [ ] _(official)_ Each local.txt and proof.txt must be shown in a screenshot that includes the contents of the file AS WELL AS the IP address of the target, obtained with ipconfig, ifconfig or ip addr — both in the same frame. (Wording identical to the current guide.)
  - [ ] _(official)_ Proof file contents must be obtained in an interactive shell on the target with cat or type, from the file's original location. Any other method — including any type of web-based shell — scores zero for that target.
  - [ ] _(official)_ Flag contents must also be submitted in the exam control panel before the exam ends; missing either the panel submission or the screenshot scores zero for that target.
  - [ ] _(official)_ Modified exploits must be documented with the modified code, the URL of the original, the shellcode generation command, highlighted changes and an explanation; unmodified exploits with the URL alone.

### Notes on this preset

Entry host. A spray of the one password found on the share opened it.

## AD set — client #2 (no points on its own)

- **Phase:** legacy-ad-lateral
- **on target:** 1h 54m

### Flags

- [x] **Client #2 flag — required for the chain, worth 0 by itself** — 14.03.2026 17:24:00 · local admin hash reused — pass-the-hash
  - `5b70e2d1c8a394f6072be51d9ca8f403`
  - [ ] _(official)_ Each local.txt and proof.txt must be shown in a screenshot that includes the contents of the file AS WELL AS the IP address of the target, obtained with ipconfig, ifconfig or ip addr — both in the same frame. (Wording identical to the current guide.)
  - [ ] _(official)_ Proof file contents must be obtained in an interactive shell on the target with cat or type, from the file's original location. Any other method — including any type of web-based shell — scores zero for that target.
  - [ ] _(official)_ Flag contents must also be submitted in the exam control panel before the exam ends; missing either the panel submission or the screenshot scores zero for that target.
  - [ ] _(official)_ Modified exploits must be documented with the modified code, the URL of the original, the shellcode generation command, highlighted changes and an explanation; unmodified exploits with the URL alone.

### Notes on this preset

Same local administrator hash as client #1.

## AD set — domain controller (carries the whole 40)

- **Phase:** evidence
- **on target:** 2h 48m

### Flags

- [x] **Full domain exploit chain complete (all three AD hosts) — all-or-nothing 40 points** (40) — 14.03.2026 20:12:00 · Kerberoast → service account → DCSync
  - `9e3f81a05c7d24b6e08fa3172d9c4b5e`
  - [ ] _(official)_ Each local.txt and proof.txt must be shown in a screenshot that includes the contents of the file AS WELL AS the IP address of the target, obtained with ipconfig, ifconfig or ip addr — both in the same frame. (Wording identical to the current guide.)
  - [ ] _(official)_ Proof file contents must be obtained in an interactive shell on the target with cat or type, from the file's original location. Any other method — including any type of web-based shell — scores zero for that target.
  - [ ] _(official)_ Flag contents must also be submitted in the exam control panel before the exam ends; missing either the panel submission or the screenshot scores zero for that target.
  - [ ] _(official)_ The AD set is all-or-nothing: evidence must show the complete chain across all three hosts. Screenshots for the two clients are required even though they carry no points of their own, because the 40 points are only awarded for the full domain chain.
  - [ ] _(official)_ Modified exploits must be documented with the modified code, the URL of the original, the shellcode generation command, highlighted changes and an explanation; unmodified exploits with the URL alone.

### Attempts

| # | Attempts | failed | Why it failed / what it told you (optional) |
|---|---|---|---|
| 1 | AS-REP roast the whole user list | failed | no account had pre-authentication disabled; Kerberoasting is what worked |

### Notes on this preset

The 40 lands only with all three hosts documented, so the chain is written up as one section, in order.

---

## Ground rules

- _(official)_ **required** — RETIRED FORMAT. This exam was replaced on 1 November 2024 at 10:00 GMT. Do not sit an exam against these rules — use the OSCP+ preset. This preset exists for practising against pre-2025 write-ups and lab sets. [↗](https://help.offsec.com/hc/en-us/articles/29865898402836-OSCP-Exam-Changes)
- _(official)_ **required** — Active Directory set: points are awarded only for the full exploit chain of the domain. No partial points are awarded — clearing two of the three AD hosts scores zero for the set. [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official)_ **allowed** — Ten bonus points are available, earned before the exam by completing at least 80% of the module lab questions in every PEN-200 module AND submitting 30 correct proof.txt hashes from the PEN-200 challenge lab machines. Valid only for exams taken on or before 31 October 2024. [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official)_ **limited** — Metasploit modules (Auxiliary, Exploit, Post) and the Meterpreter payload may be used against ONE single target machine of your choice; the choice locks on first use, including `check`, and cannot be moved if the attack fails. [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official)_ **banned** — Metasploit cannot be used for pivoting — pivoting would use it against more than one target. [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official)_ **allowed** — exploit/multi/handler and msfvenom may be used against all target machines; only the meterpreter payload is limited to the one chosen target. [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official, advisory)_ **limited** — Spoofing of any kind — IP, ARP, DNS, NBNS, etc. — is prohibited, which rules out LLMNR/NBT-NS poisoning and the relay attacks that depend on it. Note the distinction: Responder itself is on OffSec's allowed-tools list; it is the poisoning and spoofing modes that are banned, not the binary. [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official, advisory)_ **banned** — Automatic exploitation tools: OffSec names db_autopwn, browser_autopwn, SQLmap and SQLninja, plus "anything that performs a similar function". Only those four are published names — treat any other tool as your own judgement call, not a rule. [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official)_ **banned** — Commercial tools or services (Metasploit Pro, Burp Pro) and AI chatbots (KAI, ChatGPT, etc.). [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official)_ **allowed** — Nmap and its scripting engine, Nikto, Burp Free and DirBuster may be used against any target system. [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official)_ **required** — Flag contents must be submitted in the exam control panel before the clock ends, and the report uploaded to https://upload.offsec.com within 24 hours as a PDF inside a password-free .7z under 200 MB, with the exact case-sensitive filename. [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official, advisory)_ **limited** — Interfaces built on Metasploit — Armitage, Cobalt Strike, Metasploit Community Edition — inherit the same one-machine limit rather than being separately banned. (Cobalt Strike is separately out under the commercial-tools rule.) [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)

## Evidence required before this counts

- _(official)_ Each local.txt and proof.txt must be shown in a screenshot that includes the contents of the file AS WELL AS the IP address of the target, obtained with ipconfig, ifconfig or ip addr — both in the same frame. (Wording identical to the current guide.) [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official)_ Proof file contents must be obtained in an interactive shell on the target with cat or type, from the file's original location. Any other method — including any type of web-based shell — scores zero for that target. [↗](https://web.archive.org/web/20240719171726/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official)_ Flag contents must also be submitted in the exam control panel before the exam ends; missing either the panel submission or the screenshot scores zero for that target. [↗](https://web.archive.org/web/20240719171726/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official)_ `legacy-ad-dc` The AD set is all-or-nothing: evidence must show the complete chain across all three hosts. Screenshots for the two clients are required even though they carry no points of their own, because the 40 points are only awarded for the full domain chain. [↗](http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- _(official)_ Modified exploits must be documented with the modified code, the URL of the original, the shellcode generation command, highlighted changes and an explanation; unmodified exploits with the URL alone. [↗](https://web.archive.org/web/20240719171726/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)

## Notes on this preset

- Buffer overflow targets are out of scope: OffSec removed BOF from the course material and the exam body of knowledge. What remains in scope is FIXING a public memory-corruption exploit — cross-compiling it, correcting offsets and shellcode — which is a different skill.
- Taught in PEN-200, banned on the exam: the current Body of Knowledge still includes "Vulnerability Scanning with Nessus", while the exam guide bans Nessus outright.

## What was not verified

- IMPLEMENTATION NOTE — the phases `setup`, `recon`, `svc-enum`, `web-discovery`, `foothold`, `shell`, `local-flag`, `sitawareness`, `privesc`, `proof-flag` and `evidence` are byte-for-byte the same methodology as the OSCP+ preset apart from a few wording changes. Compile them once as a shared phase set and have both presets reference it; only the AD phases, the bonus phase and the scoring differ.
- PLAYBOOK OVERLAP — same as the OSCP+ preset: recon/svc-enum ↔ `initial-recon`; web-discovery ↔ `web`; foothold/shell ↔ `general`; privesc ↔ `linux-privesc` + `windows-privesc`; legacy-ad-* ↔ `ad` and `ad-detailed` (the legacy AD set genuinely starts unauthenticated, so `ad-detailed` phase 0 maps well here EXCEPT its Responder/ntlmrelayx items, which are banned); legacy-ad-lateral pivot items ↔ `pivoting`.
- Whether a stack buffer-overflow target appeared in this format's independent targets is not stated in the archived guide, so the existing `buffer-overflow` playbook is not wired in. Many pre-2022 write-ups assume one; that assumption is not verified here.
- Report section headings are taken from the current official OSCP Exam Report template v2.0 (Copyright 2024), which was already in use before the format change; an older template version may differ in minor heading names.
- Which of local.txt / proof.txt sat on each individual AD host in the retired format is not stated; the 2-clients-plus-1-DC shape and the all-or-nothing 40 points are both confirmed.

## Sources

- https://web.archive.org/web/20240719171726/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide
- https://help.offsec.com/hc/en-us/articles/29865898402836-OSCP-Exam-Changes
- http://web.archive.org/web/2024080100/https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide
- https://help.offsec.com/hc/en-us/articles/29865898402836-OSCP-Exam-Changes
- https://help.offsec.com/hc/en-us/articles/29840452210580-Changes-to-the-OSCP
- https://www.offsec.com/pwk-online/OSCP-Exam-Report.docx

