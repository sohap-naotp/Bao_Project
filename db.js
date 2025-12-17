const Database = require("better-sqlite3");
const db = new Database("database.sqlite");

// SHIFTS
db.prepare(`
  CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    start_time TEXT,
    end_time TEXT
  )
`).run();

// EMPLOYEES
db.prepare(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    hourly_rate INTEGER
  )
`).run();

// TIME LOGS
db.prepare(`
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
`).run();

module.exports = db;
