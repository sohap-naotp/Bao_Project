const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// ✅ PHỤC VỤ FRONTEND
app.use(express.static(path.join(__dirname, "public")));

// ================= API =================

// Test API
app.get("/api/test", (req, res) => {
  res.json({ message: "API OK" });
});

// Lấy danh sách nhân viên
app.get("/api/users", (req, res) => {
  const data = fs.readFileSync("users.json", "utf8");
  res.json(JSON.parse(data));
});

// ================= ROOT =================

// Khi mở domain → trả về index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
