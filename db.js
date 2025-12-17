const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS shifts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      start_time TEXT,
      end_time TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      hourly_rate INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS time_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      shift_id INTEGER,
      check_in_at TEXT,
      check_out_at TEXT,
      late_minutes INTEGER,
      total_hours REAL,
      date TEXT
    )
  `);
});

module.exports = db;
