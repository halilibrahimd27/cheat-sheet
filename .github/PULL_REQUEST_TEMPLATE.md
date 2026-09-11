<!--
Before submitting: read CONTRIBUTING.md
-->

## What does this PR do?

<!-- Brief: what + why -->

## Type

- [ ] New command(s) / category
- [ ] Fix existing command (bug, deprecation)
- [ ] App feature (search, CRUD, UI)
- [ ] Workspace / Exam Mode (Machines, reports)
- [ ] Server / API
- [ ] Accessibility
- [ ] Static / offline build
- [ ] Documentation
- [ ] Other:

## Safe-content checklist

- [ ] All commands use **placeholders** (`<TARGET_IP>`, `<DOMAIN>`, etc.)
- [ ] **No real IPs**, hostnames, credentials, or org names
- [ ] Commands are for **authorized security testing / education**
- [ ] If I changed `seed.js`, every new command has both `desc` (English) and `desc_tr` (Türkçe)
- [ ] Content is **original** — nothing pasted from HackTricks, PayloadsAllTheThings or any other CC BY-NC-SA source (link it as a `ref` instead)

## Quality checklist

- [ ] `npm test` passes
- [ ] `npm run lint` is clean
- [ ] `npm run validate-content` passes
- [ ] I ran `node scripts/update-readme.js` (if I changed `seed.js`)
- [ ] I re-ran `npm run build:static` and committed `docs/` (if I changed `public/` or `seed.js`) — and hand-edited nothing under `docs/`
- [ ] I bumped `CACHE_NAME` in `public/service-worker.js` (if I changed a precached asset)

## Related issue

Closes #
