const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "commands.json");

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Ensure data directory and seed file exist
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    // Seed from default commands
    const seed = require("./seed.js");
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2), "utf8");
  }
}

function readData() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

// ── GET all categories ──
app.get("/api/categories", (req, res) => {
  res.json(readData());
});

// ── POST new category ──
app.post("/api/categories", (req, res) => {
  const data = readData();
  const { name, icon, description } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
  if (data.find((c) => c.id === id))
    return res.status(409).json({ error: "Category already exists" });
  const cat = { id, name, icon: icon || "📂", description: description || "", subcategories: [] };
  data.push(cat);
  writeData(data);
  res.status(201).json(cat);
});

// ── PUT update category ──
app.put("/api/categories/:id", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  if (req.body.name) cat.name = req.body.name;
  if (req.body.icon) cat.icon = req.body.icon;
  if (req.body.description !== undefined) cat.description = req.body.description;
  writeData(data);
  res.json(cat);
});

// ── DELETE category ──
app.delete("/api/categories/:id", (req, res) => {
  let data = readData();
  const idx = data.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Category not found" });
  data.splice(idx, 1);
  writeData(data);
  res.json({ ok: true });
});

// ── POST new subcategory ──
app.post("/api/categories/:id/subcategories", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const sub = { name, commands: [] };
  cat.subcategories.push(sub);
  writeData(data);
  res.status(201).json(sub);
});

// ── PUT update subcategory ──
app.put("/api/categories/:id/subcategories/:subIdx", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const sub = cat.subcategories[parseInt(req.params.subIdx)];
  if (!sub) return res.status(404).json({ error: "Subcategory not found" });
  if (req.body.name) sub.name = req.body.name;
  writeData(data);
  res.json(sub);
});

// ── DELETE subcategory ──
app.delete("/api/categories/:id/subcategories/:subIdx", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const idx = parseInt(req.params.subIdx);
  if (!cat.subcategories[idx]) return res.status(404).json({ error: "Subcategory not found" });
  cat.subcategories.splice(idx, 1);
  writeData(data);
  res.json({ ok: true });
});

// ── POST new command ──
app.post("/api/categories/:id/subcategories/:subIdx/commands", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const sub = cat.subcategories[parseInt(req.params.subIdx)];
  if (!sub) return res.status(404).json({ error: "Subcategory not found" });
  const { title, desc, cmd, cmds, tags, note } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });
  const command = { title, desc: desc || "" };
  if (cmds && cmds.length) command.cmds = cmds;
  else if (cmd) command.cmd = cmd;
  command.tags = tags || [];
  if (note) command.note = note;
  sub.commands.push(command);
  writeData(data);
  res.status(201).json(command);
});

// ── PUT update command ──
app.put("/api/categories/:id/subcategories/:subIdx/commands/:cmdIdx", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const sub = cat.subcategories[parseInt(req.params.subIdx)];
  if (!sub) return res.status(404).json({ error: "Subcategory not found" });
  const command = sub.commands[parseInt(req.params.cmdIdx)];
  if (!command) return res.status(404).json({ error: "Command not found" });
  if (req.body.title) command.title = req.body.title;
  if (req.body.desc !== undefined) command.desc = req.body.desc;
  if (req.body.cmd !== undefined) { command.cmd = req.body.cmd; delete command.cmds; }
  if (req.body.cmds) { command.cmds = req.body.cmds; delete command.cmd; }
  if (req.body.tags) command.tags = req.body.tags;
  if (req.body.note !== undefined) command.note = req.body.note;
  writeData(data);
  res.json(command);
});

// ── DELETE command ──
app.delete("/api/categories/:id/subcategories/:subIdx/commands/:cmdIdx", (req, res) => {
  const data = readData();
  const cat = data.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  const sub = cat.subcategories[parseInt(req.params.subIdx)];
  if (!sub) return res.status(404).json({ error: "Subcategory not found" });
  const idx = parseInt(req.params.cmdIdx);
  if (!sub.commands[idx]) return res.status(404).json({ error: "Command not found" });
  sub.commands.splice(idx, 1);
  writeData(data);
  res.json({ ok: true });
});

// ── Export / Import ──
app.get("/api/export", (req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=cyberlens-backup.json");
  res.json(readData());
});

app.post("/api/import", (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: "Expected array" });
  writeData(req.body);
  res.json({ ok: true, categories: req.body.length });
});

// ── Reset to defaults ──
app.post("/api/reset", (req, res) => {
  const seed = require("./seed.js");
  // Clear require cache so seed is always fresh
  delete require.cache[require.resolve("./seed.js")];
  writeData(seed);
  res.json({ ok: true });
});

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`cheat-sheet running on http://localhost:${PORT}`);
});
