# Contributing to cheat-sheet

Thanks for your interest in contributing! This project is community-driven and welcomes additions from anyone in the cybersecurity community.

## How to Contribute

### Adding New Commands

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
  "note": "Optional usage note"
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

4. Submit a Pull Request

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

### Bug Reports & Feature Requests

Open an issue on GitHub with:
- Clear description of the bug or feature
- Steps to reproduce (for bugs)
- Screenshots if applicable

## Code of Conduct

- This tool is for **educational and authorized testing only**
- Do not add commands designed for illegal use
- Be respectful in discussions and reviews
