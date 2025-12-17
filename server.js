const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
app.use(express.json());
app.use(express.static("public"));

/* =====================
   UTILS
===================== */
function diffMinutes(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

/* =====================
   TEST SERVER
===================== */
app.get("/", (req, res) => {
  res.send("SERVER OK – Cafe Attendance");
});

/* =====================
   CHECK IN
===================== */
app.post("/checkin", (req, res) => {
  const { employee_id, shift_id } = req.body;
  const now = new Date();

  const today = now.toISOString().slice(0, 10);
  const currentTime = now.toTimeString().slice(0, 5);

  db.get(
    "SELECT * FROM shifts WHERE id = ?",
    [shift_id],
    (err, shift) => {
      if (!shift) return res.status(400).send("Shift not found");

      const late =
        currentTime > shift.start_time
          ? diffMinutes(shift.start_time, currentTime)
          : 0;

      db.run(
        `INSERT INTO time_logs 
         (employee_id, shift_id, check_in_at, late_minutes, date)
         VALUES (?, ?, ?, ?, ?)`,
        [employee_id, shift_id, now.toISOString(), late, today],
        () => res.send("Checked in")
      );
    }
  );
});

/* =====================
   CHECK OUT
===================== */
app.post("/checkout", (req, res) => {
  const { employee_id } = req.body;
  const now = new Date();

  db.get(
    `SELECT * FROM time_logs 
     WHERE employee_id = ? AND check_out_at IS NULL`,
    [employee_id],
    (err, log) => {
      if (!log) return res.send("Not checked in");

      const hours =
        (now - new Date(log.check_in_at)) / (1000 * 60 * 60);

      db.run(
        `UPDATE time_logs
         SET check_out_at = ?, total_hours = ?
         WHERE id = ?`,
        [now.toISOString(), hours.toFixed(2), log.id],
        () => res.send("Checked out")
      );
    }
  );
});

/* =====================
   SERVER START
===================== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("Server running on port", PORT)
);
