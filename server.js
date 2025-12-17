const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
app.use(express.json());
app.use(express.static("public"));

function diffMinutes(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

app.get("/", (req, res) => {
  res.send("Cafe Attendance Server OK");
});

app.post("/checkin", (req, res) => {
  const { employee_id, shift_id } = req.body;
  const now = new Date();

  const today = now.toISOString().slice(0, 10);
  const currentTime = now.toTimeString().slice(0, 5);

  const shift = db
    .prepare("SELECT * FROM shifts WHERE id = ?")
    .get(shift_id);

  if (!shift) return res.status(400).send("Shift not found");

  const late =
    currentTime > shift.start_time
      ? diffMinutes(shift.start_time, currentTime)
      : 0;

  db.prepare(`
    INSERT INTO time_logs
    (employee_id, shift_id, check_in_at, late_minutes, date)
    VALUES (?, ?, ?, ?, ?)
  `).run(employee_id, shift_id, now.toISOString(), late, today);

  res.send("Checked in");
});

app.post("/checkout", (req, res) => {
  const { employee_id } = req.body;
  const now = new Date();

  const log = db.prepare(`
    SELECT * FROM time_logs
    WHERE employee_id = ? AND check_out_at IS NULL
  `).get(employee_id);

  if (!log) return res.send("Not checked in");

  const hours =
    (now - new Date(log.check_in_at)) / (1000 * 60 * 60);

  db.prepare(`
    UPDATE time_logs
    SET check_out_at = ?, total_hours = ?
    WHERE id = ?
  `).run(now.toISOString(), hours.toFixed(2), log.id);

  res.send("Checked out");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("Server running on port", PORT)
);
