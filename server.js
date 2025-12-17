const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;

/* =======================
   MIDDLEWARE
======================= */
app.use(express.json());

// LOG REQUEST (để thấy Render có nhận request)
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// SERVE FRONTEND
app.use(express.static(path.join(__dirname, "public")));

/* =======================
   API
======================= */
app.get("/api/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  res.json(users);
});

app.post("/api/attendance", (req, res) => {
  const data = req.body;
  fs.writeFileSync("attendance.json", JSON.stringify(data, null, 2));
  res.json({ status: "ok" });
});

/* =======================
   FRONTEND FALLBACK
======================= */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
