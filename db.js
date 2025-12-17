// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Tạo file database.sqlite
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Lỗi kết nối database:', err.message);
    } else {
        console.log('Đã kết nối tới SQLite database.');
    }
});

// Tạo bảng TimeLogs
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS time_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_name TEXT,
        shift_start TEXT,      -- Giờ quy định bắt đầu (VD: 08:00)
        check_in_time TEXT,    -- Thời gian check-in thực tế
        check_out_time TEXT,   -- Thời gian check-out thực tế
        late_minutes INTEGER,  -- Số phút đi trễ
        worked_hours REAL,     -- Tổng giờ làm (số thực)
        date TEXT              -- Ngày làm việc (YYYY-MM-DD)
    )`);
});

module.exports = db;