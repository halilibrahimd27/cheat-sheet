# Contributing to cheat-sheet

Thanks for your interest in contributing! This project is community-driven and welcomes additions from anyone in the cybersecurity community.

Despite the name, this repo is not only a command list — it is a local-first pentest
**workbench** (Machines workspace, Write-ups editor, static/offline build). Contributions
to the app are just as welcome as contributions to the corpus, and usually more impactful.

## What you can work on

| Area | Examples | Where |
|---|---|---|
| **Commands & content** | New commands, fixing a deprecated flag, Turkish descriptions, MITRE ATT&CK tags, `ref` links | `seed.js`, `scripts/tag-attack.js` |
| **The workspace** | Machines (services table, nmap parsing, credential vault, timeline, reports, AD mode), Exam Mode | `public/app.js`, `public/checklist-templates.js` |
| **Write-ups editor** | Markdown rendering, report templates, CVSS calculator, export formats | `public/app.js` |
| **Accessibility & UX** | Keyboard paths, focus management, contrast, `prefers-reduced-motion`, mobile layout | `public/style.css`, `public/app.js` |
| **Server & API** | Endpoints, validation, atomic writes, security headers | `server.js`, `test/api.test.js` |
| **Static / offline build** | The IndexedDB adapter, the PWA, the Pages build | `public/local-backend.js`, `public/service-worker.js`, `scripts/build-static.js` |
| **Docs & i18n** | README, this file, the TR translation of the UI | `README.md`, `public/app.js` |

Not sure where something belongs? Open an issue first — it is cheaper than a rejected PR.

## Ground rules

1. **Exactly one runtime dependency (`express`).** Do not add npm packages, and do not add
   a build step or a transpiler. Everything is hand-rolled on purpose.
2. **Vanilla JS only.** Browser code must run as-is in the browser; server code targets
   Node >= 18.
3. **Never edit `docs/`.** It is generated from `public/` by `npm run build:static`.
4. **Never commit real IPs, hostnames, credentials or client names** — in commands, in
   screenshots, or in an exported backup.
5. **Write original content.** See [Content provenance](#content-provenance) below.
6. Match the surrounding style: double quotes, 2-space indent, semicolons, and comments
   that explain *why*, not *what*.

## Development setup

```bash
git clone https://github.com/halilibrahimd27/cheat-sheet.git
cd cheat-sheet
npm install
npm run dev        # node --watch server.js  →  http://localhost:3000
```

There is no bundler and no watch step for the frontend — edit `public/*.js` / `public/style.css`
and reload the page.

## Running the checks

CI runs all of these on Node 18, 20 and 22. Run them before you open a PR:

```bash
npm run lint              # ESLint (flat config, no warnings allowed)
npm test                  # node:test — API tests in test/, no test framework
npm run validate-content  # seed.js structure + quality validator
```

If you changed `seed.js`, also regenerate the README's stats and category table —
**CI fails if this is out of sync**:

```bash
node scripts/update-readme.js
```

The tests spin the Express app up against a throwaway `DATA_DIR`, so they never touch your
own `data/` directory.

## Running the static build

The same app also ships as a server-less bundle backed by IndexedDB — this is what the
GitHub Pages demo runs:

```bash
npm run build:static      # regenerates ./docs from ./public + seed.js
```

Then serve `docs/` over HTTP (a service worker and IndexedDB will not behave over
`file://`):

```bash
npx --yes http-server docs -p 8080    # or: python3 -m http.server -d docs 8080
```

Rebuild after **any** change to `public/` or `seed.js`, and commit the regenerated `docs/`
in the same PR as the change it comes from — CI fails if the committed `docs/` has drifted
from `public/` + `seed.js`. The Pages workflow rebuilds it too, so what gets published is
derived from the deployed commit rather than from whoever last remembered to regenerate.
Never hand-edit a file under `docs/`.

## Adding New Commands

1. Fork the repository
2. Edit `seed.js` — find the right category and subcategory
3. Add your command following this structure:

```json
{
  "title": "Command Title",
  "desc": "What this command does (English)",
  "desc_tr": "Komutun ne yaptığı (Türkçe)",
  "cmd": "the-command --with <PLACEHOLDER>",
  "tags": ["essential"],
  "note": "Optional usage note",
  "attack": "T1059.001",
  "ref": "https://example.org/docs/the-technique"
}
```

For multiple commands in one entry:
```json
{
  "title": "Multi-step Process",
  "desc": "Description of the workflow",
  "cmds": [
    "step-one --flag",
    "step-two --flag"
  ],
  "tags": ["tool"]
}
```

4. Run `npm run validate-content` and `node scripts/update-readme.js`
5. Submit a Pull Request

### Optional fields

- **`attack`** — one MITRE ATT&CK technique id, or an array of them (`"T1110"`,
  `"T1558.003"`). Only offensive commands are tagged; DevSecOps, ops and detection
  commands stay untagged on purpose. `npm run tag:attack` regenerates the curated mapping
  idempotently — prefer it over hand-editing many entries at once.
- **`ref`** / **`refs`** — a reference link (or an array of `{ label, url }`) rendered as a
  chip on the command. 82% of commands carry one, pointing at that tool's own
  documentation. Four rules, all enforced by `test/references.test.js`:
  1. **Absolute `https://`.** Plain http is refused — the app is served over https on
     Pages and a plain-http citation is the one a corporate proxy eats silently.
  2. **The vendor's or the project's own page.** Not a blog, not a shortener, not an SEO
     aggregator. If a third-party write-up really is the best source, say so in `note`
     rather than dressing it up as documentation.
  3. **One tool, one page.** If the tool is already cited elsewhere in the corpus, reuse
     that url rather than picking a second one.
  4. **Open it before you commit it.** Nothing in CI can fetch a url — tests run offline
     — so a dead link only fails in a reader's browser. `scripts/validate-content.js`
     ratchets the number of *unreferenced* commands, so the gap may shrink but never grow.

  The ~900 commands still without one are shell builtins and payload snippets, where no
  single honest source exists. If you can name one for a specific command, that is a
  welcome contribution.

### Placeholder Convention

Use uppercase placeholders wrapped in angle brackets:

| Placeholder | Usage |
|-------------|-------|
| `<TARGET_IP>` | Target machine IP |
| `<ATTACKER_IP>` | Your attack machine IP |
| `<LHOST>` | Local host (attacker) |
| `<LPORT>` | Local port (listener) |
| `<DOMAIN>` | Target domain |
| `<USER>` | Username |
| `<PASS>` | Password |
| `<DC_IP>` | Domain Controller IP |
| `<NTLM_HASH>` | NTLM hash value |
| `<PORT>` | Port number |

### Tag Guidelines

- `essential` — Must-know commands for beginners
- `tool` — Requires a specific tool to be installed
- `advanced` — Complex techniques for experienced users

### Adding a New Category

If your commands don't fit any existing category, you can create a new one:

```json
{
  "id": "your-category-id",
  "name": "Category Name",
  "name_tr": "Kategori Adı (Türkçe)",
  "icon": "🔧",
  "description": "What this category covers",
  "description_tr": "Bu kategorinin kapsamı",
  "subcategories": [...]
}
```

A new category also needs an entry in the `.github/ISSUE_TEMPLATE/command-suggestion.yml`
dropdown so people can file against it.

## Working on the app

- **Frontend** lives in `public/app.js` — one IIFE, no modules, no framework. Find the
  section banner comment for the feature you are changing and stay inside it.
- **Render user text with `textContent`**, or escape it, every time. Stored XSS is the
  main risk class in this app: commands, machine fields and write-ups are all
  user-controlled and all get rendered.
- **No inline `<script>` and no inline event-handler attributes** in `public/index.html` —
  the page ships a CSP with `script-src 'self'`, so they will simply not run. Wire events
  up with `addEventListener` from `app.js`.
- **New static assets** must be added in three places or they will be missing offline and
  on GitHub Pages: the `<script>`/`<link>` in `public/index.html`, `STATIC_ASSETS` in
  `public/service-worker.js`, and the copy list in `scripts/build-static.js`.
- **Bump `CACHE_NAME`** in `public/service-worker.js` whenever you change a precached
  asset, or returning users keep the stale copy.
- **Server changes need a test.** `test/api.test.js` uses `node:test` and the exported
  Express app; add a case next to the closest existing one.

## Content provenance

Everything in `seed.js` must be **original work** — written from the tool's own
documentation, from `--help` output, or from your own lab notes.

Do **not** paste command text, descriptions or explanations from HackTricks,
PayloadsAllTheThings, or any other CC BY-NC-SA / share-alike source. This repository is
MIT-licensed and cannot absorb share-alike or non-commercial content. If such a resource
is the best explanation of a technique, add it as a `ref` link instead of reproducing it.

By opening a PR you confirm that the content you added is yours to license under
[MIT](LICENSE).

## Bug Reports & Feature Requests

Use the [issue templates](https://github.com/halilibrahimd27/cheat-sheet/issues/new/choose):

- **🐛 App bug report** — something in the app is broken
- **🔧 Correction / bug** — a wrong command, dead link or typo in the content
- **💡 Command suggestion** — a new command, technique or category
- **✨ Feature request** — a new capability anywhere in the app
- **🧪 Workspace / Exam Mode** — Machines, reports, or the exam cockpit specifically

Security issues go to [SECURITY.md](SECURITY.md), **not** to a public issue.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). In addition:

- This tool is for **educational and authorized testing only**
- Do not add commands designed for illegal use
- Be respectful in discussions and reviews
