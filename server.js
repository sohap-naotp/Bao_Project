const express = require('express');
const app = express();

app.use(express.json());

// ===== TEST SERVER =====
app.get('/', (req, res) => {
  res.send('SERVER OK – Cafe Attendance');
});

// ===== LOGIN =====
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'test@gmail.com' && password === '123456') {
    return res.json({
      id: 1,
      name: 'Nhan vien test',
      role: 'staff'
    });
  }

  res.status(401).json({ error: 'Sai tai khoan' });
});

// ===== CHECK IN =====
app.post('/checkin', (req, res) => {
  res.json({ message: 'Check-in thanh cong' });
});

// ===== CHECK OUT =====
app.post('/checkout', (req, res) => {
  res.json({ message: 'Check-out thanh cong' });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
