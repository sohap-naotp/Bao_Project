// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Phục vụ file giao diện

// CẤU HÌNH GIỜ VÀO CA (Ví dụ: 8 giờ sáng)
const SHIFT_START_HOUR = 8; 
const SHIFT_START_MINUTE = 0;

// API 1: Check-in (Vào ca)
app.post('/api/checkin', (req, res) => {
    const { name } = req.body;
    const now = new Date();
    
    // 1. Tạo mốc thời gian quy định cho ngày hôm nay
    const shiftStart = new Date();
    shiftStart.setHours(SHIFT_START_HOUR, SHIFT_START_MINUTE, 0, 0);

    // 2. Tính toán đi trễ
    let lateMinutes = 0;
    if (now > shiftStart) {
        const diffMs = now - shiftStart;
        lateMinutes = Math.floor(diffMs / 60000); // Đổi mili-giây sang phút
    }

    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // 3. Lưu vào DB
    const sql = `INSERT INTO time_logs (employee_name, shift_start, check_in_time, late_minutes, date) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, `${SHIFT_START_HOUR}:${SHIFT_START_MINUTE}`, now.toISOString(), lateMinutes, dateStr];

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            message: `Chào ${name}! Bạn đi trễ ${lateMinutes} phút.`, 
            id: this.lastID,
            late: lateMinutes
        });
    });
});

// API 2: Check-out (Tan ca)
app.post('/api/checkout', (req, res) => {
    const { name } = req.body;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    // Tìm lần check-in gần nhất chưa check-out trong ngày
    const findSql = `SELECT * FROM time_logs WHERE employee_name = ? AND date = ? AND check_out_time IS NULL ORDER BY id DESC LIMIT 1`;
    
    db.get(findSql, [name, dateStr], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(400).json({ error: "Không tìm thấy lượt Check-in nào!" });

        // Tính tổng giờ làm
        const checkInTime = new Date(row.check_in_time);
        const diffMs = now - checkInTime;
        const workedHours = (diffMs / (1000 * 60 * 60)).toFixed(2); // Đổi ra giờ, lấy 2 số thập phân

        // Cập nhật DB
        const updateSql = `UPDATE time_logs SET check_out_time = ?, worked_hours = ? WHERE id = ?`;
        db.run(updateSql, [now.toISOString(), workedHours, row.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: `Tạm biệt ${name}! Hôm nay làm được ${workedHours} tiếng.` });
        });
    });
});

// API 3: Lấy danh sách chấm công
app.get('/api/logs', (req, res) => {
    db.all("SELECT * FROM time_logs ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});