const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// đường dẫn tuyệt đối (QUAN TRỌNG)
const USERS_FILE = path.join(__dirname, 'users.json');
const ATT_FILE = path.join(__dirname, 'attendance.json');

// đảm bảo file tồn tại
function ensureFile(file, defaultData) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
  }
}

ensureFile(USERS_FILE, []);
ensureFile(ATT_FILE, []);

// đọc file an toàn
function read(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// ghi file
function write(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// route test (RẤT QUAN TRỌNG)
app.get('/', (req, res) => {
  res.send('Cafe Attendance Server OK');
});

// LOGIN
app.post('/login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const users = read(USERS_FILE);
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    res.json(user);
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// CHECK IN
app.post('/checkin', (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).send('Missing user_id');

    const data = read(ATT_FILE);
    const now = new Date();

    data.push({
      user_id,
      date: now.toISOString().slice(0, 10),
      check_in: now.toTimeString().slice(0, 5),
      check_out: null,
      total_hours: 0,
      late_minutes: Math.max(0, now.getHours() * 60 + now.getMinutes() - 480)
    });

    write(ATT_FILE, data);
    res.send('Checked in');
  } catch (err) {
    console.error('CHECKIN ERROR:', err);
    res.status(500).send('Server error');
  }
});

// CHECK OUT
app.post('/checkout', (req, res) => {
  try {
    const { user_id } = req.body;
    const data = read(ATT_FILE);
    const now = new Date();

    const a = data.find(
      x => x.user_id == user_id && x.check_out === null
    );

    if (!a) return res.send('Not checked in');

    a.check_out = now.toTimeString().slice(0, 5);

    const s = parseInt(a.check_in.slice(0, 2)) * 60 + parseInt(a.check_in.slice(3));
    const e = now.getHours() * 60 + now.getMinutes();
    a.total_hours = ((e - s) / 60).toFixed(2);

    write(ATT_FILE, data);
    res.send('Checked out');
  } catch (err) {
    console.error('CHECKOUT ERROR:', err);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
