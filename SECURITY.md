# Security Policy

This repository contains pentest commands and **defensive security
education material**. Although the content is reference material (not
malicious code), please follow these rules.

## ✅ This project is for

- Authorized penetration testing
- CTF practice
- Security certification preparation (OSCP+, OSWE, OSEP, OSDA, OSWA, PNPT, CPTS, etc.)
- Educational purposes
- Security research in your own lab

## ❌ This project is **not** for

- Unauthorized access to systems you don't own or have permission to test
- Malicious activities
- Illegal use against any party

You are solely responsible for your usage. Authors and contributors
disclaim liability for misuse.

This statement is the authoritative scope note for the project; the README links
here from its **Authorised use only** banner.

## ⚠️ Known limitations (by design)

These are not vulnerabilities — they are documented properties of a single-user,
local-first tool. Please do not report them as findings.

- **The credential vault is plaintext.** Secrets you store against a machine live
  unencrypted in `DATA_DIR/machines.json` (server build) or in the browser's
  IndexedDB (static build), and are included verbatim in every export and in a
  machine's generated report. It is a scratchpad for lab and exam boxes, not a
  password manager. See the README's *Security* section.
- **No authentication by default.** The server binds to `127.0.0.1` and has no
  user model. `AUTH_PASS` adds HTTP Basic Auth and is required before you expose
  it anywhere else.
- **Anyone with access to the origin has access to the data.** On a published
  GitHub Pages deployment the data stays in each visitor's own browser, but it is
  a public origin — do not put real client or production credentials into it.

What *is* in scope: anything that lets one user's content run script in another
context, escape the data directory, read files outside `DATA_DIR`, or bypass
`AUTH_PASS` — plus stored XSS in the command, machine or write-up renderers.

## 🚨 Reporting security issues

### App-level vulnerabilities

If you find a security issue in the **application** (server.js, Docker
config, dependencies):

1. Open a [GitHub Security Advisory](https://github.com/halilibrahimd27/cheat-sheet/security/advisories/new) (preferred — private)
2. Or email maintainer (see GitHub profile)

**Do not** open a public issue for unpatched vulnerabilities — secret
disclosure window opens to attackers.

### Content concerns

If you spot:
- Real IP/credential/hostname accidentally committed
- A command that could cause **unintended damage** (e.g., destructive without warning)
- Outdated content that **promotes insecure practice**

→ Open a regular issue with the `[Fix]` template.

## ⏱️ Response time (best-effort)

- **24-72 hours**: initial response
- **7 days**: triage + plan
- **14 days**: fix or accepted mitigation

## 🙏 Thanks

Reporters (if they want to be identified) are credited in the
acknowledgments section of the README.
