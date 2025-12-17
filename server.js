console.log('SERVER FILE LOADED');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// 👉 PHỤC VỤ FRONTEND
app.use(express.static(path.join(__dirname, 'public')));

// FILE DATA
const USERS_FILE = path.join(__dirname, 'users.json');
const ATT_FILE = path.join(__dirname, 'attendance.json');

function ensureFile(file, data) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }
}

ensureFile(USERS_FILE, []);
ensureFile(ATT_FILE, []);

function read(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function write(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = read(USERS_FILE);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid login' });
  res.json(user);
});

// CHECK IN
app.post('/checkin', (req, res) => {
  const { user_id } = req.body;
  const now = new Date();
  const data = read(ATT_FILE);

  data.push({
    user_id,
    date: now.toISOString().slice(0,10),
    check_in: now.toTimeString().slice(0,5),
    check_out: null,
    total_hours: 0
  });

  write(ATT_FILE, data);
  res.send('Checked in');
});

// CHECK OUT
app.post('/checkout', (req, res) => {
  const { user_id } = req.body;
  const data = read(ATT_FILE);
  const now = new Date();

  const a = data.find(x => x.user_id == user_id && x.check_out === null);
  if (!a) return res.send('Not checked in');

  a.check_out = now.toTimeString().slice(0,5);
  write(ATT_FILE, data);
  res.send('Checked out');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
