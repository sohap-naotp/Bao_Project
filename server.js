const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// ===== FILE DATA =====
const USERS = path.join(__dirname, "users.json");
const ATT = path.join(__dirname, "attendance.json");

if (!fs.existsSync(USERS)) fs.writeFileSync(USERS, "[]");
if (!fs.existsSync(ATT)) fs.writeFileSync(ATT, "[]");

// ===== TEST =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// ===== LOGIN =====
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS));

  const u = users.find(x => x.email === email && x.password === password);
  if (!u) return res.status(401).json({ error: "Login failed" });

  res.json(u);
});

// ===== CHECKIN =====
app.post("/checkin", (req, res) => {
  const { user_id } = req.body;
  const data = JSON.parse(fs.readFileSync(ATT));
  const now = new Date();

  data.push({
    user_id,
    date: now.toISOString().slice(0,10),
    checkin: now.toTimeString().slice(0,5),
    checkout: null
  });

  fs.writeFileSync(ATT, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

// ===== CHECKOUT =====
app.post("/checkout", (req, res) => {
  const { user_id } = req.body;
  const data = JSON.parse(fs.readFileSync(ATT));
  const now = new Date();

  const r = data.find(x => x.user_id == user_id && !x.checkout);
  if (!r) return res.json({ error: "Not checked in" });

  r.checkout = now.toTimeString().slice(0,5);
  fs.writeFileSync(ATT, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

// ===== STATIC =====
app.use(express.static("public"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on", PORT));
