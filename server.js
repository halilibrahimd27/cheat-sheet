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

// ── Notes (multiple per category) ──
const NOTES_FILE = path.join(__dirname, "data", "notes.json");
function readNotes() {
  if (!fs.existsSync(NOTES_FILE)) fs.writeFileSync(NOTES_FILE, "{}", "utf8");
  return JSON.parse(fs.readFileSync(NOTES_FILE, "utf8"));
}
function writeNotes(d) { fs.writeFileSync(NOTES_FILE, JSON.stringify(d, null, 2), "utf8"); }

app.get("/api/notes", (req, res) => res.json(readNotes()));

// Get notes for a specific category
app.get("/api/notes/:catId", (req, res) => {
  const notes = readNotes();
  res.json(notes[req.params.catId] || []);
});

// Add a note to a category
app.post("/api/notes/:catId", (req, res) => {
  const notes = readNotes();
  if (!notes[req.params.catId]) notes[req.params.catId] = [];
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const note = { id, text: req.body.text || "", createdAt: new Date().toISOString() };
  notes[req.params.catId].push(note);
  writeNotes(notes);
  res.status(201).json(note);
});

// Update a specific note
app.put("/api/notes/:catId/:noteId", (req, res) => {
  const notes = readNotes();
  const arr = notes[req.params.catId] || [];
  const note = arr.find(n => n.id === req.params.noteId);
  if (!note) return res.status(404).json({ error: "not found" });
  if (req.body.text !== undefined) note.text = req.body.text;
  writeNotes(notes);
  res.json(note);
});

// Delete a specific note
app.delete("/api/notes/:catId/:noteId", (req, res) => {
  const notes = readNotes();
  if (!notes[req.params.catId]) return res.json({ ok: true });
  notes[req.params.catId] = notes[req.params.catId].filter(n => n.id !== req.params.noteId);
  if (notes[req.params.catId].length === 0) delete notes[req.params.catId];
  writeNotes(notes);
  res.json({ ok: true });
});

// ── Write-ups ──
const WRITEUPS_FILE = path.join(__dirname, "data", "writeups.json");
function readWriteups() {
  if (!fs.existsSync(WRITEUPS_FILE)) fs.writeFileSync(WRITEUPS_FILE, "[]", "utf8");
  return JSON.parse(fs.readFileSync(WRITEUPS_FILE, "utf8"));
}
function writeWriteups(d) { fs.writeFileSync(WRITEUPS_FILE, JSON.stringify(d, null, 2), "utf8"); }

app.get("/api/writeups", (req, res) => res.json(readWriteups()));
app.post("/api/writeups", (req, res) => {
  const wups = readWriteups();
  const { title, tags, content } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const wu = { id, title, tags: tags || [], content: content || "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  wups.unshift(wu);
  writeWriteups(wups);
  res.status(201).json(wu);
});
app.put("/api/writeups/:id", (req, res) => {
  const wups = readWriteups();
  const wu = wups.find(w => w.id === req.params.id);
  if (!wu) return res.status(404).json({ error: "not found" });
  if (req.body.title !== undefined) wu.title = req.body.title;
  if (req.body.tags !== undefined) wu.tags = req.body.tags;
  if (req.body.content !== undefined) wu.content = req.body.content;
  wu.updatedAt = new Date().toISOString();
  writeWriteups(wups);
  res.json(wu);
});
app.delete("/api/writeups/:id", (req, res) => {
  let wups = readWriteups();
  wups = wups.filter(w => w.id !== req.params.id);
  writeWriteups(wups);
  res.json({ ok: true });
});

// ── Export / Import ──
app.get("/api/export", (req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=cheatsheet-backup.json");
  res.json({ categories: readData(), notes: readNotes(), writeups: readWriteups() });
});

app.post("/api/import", (req, res) => {
  // Support both old format (array) and new format (object with categories/notes/writeups)
  if (Array.isArray(req.body)) {
    writeData(req.body);
    return res.json({ ok: true, categories: req.body.length });
  }
  if (req.body.categories) writeData(req.body.categories);
  if (req.body.notes) writeNotes(req.body.notes);
  if (req.body.writeups) writeWriteups(req.body.writeups);
  res.json({ ok: true });
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
