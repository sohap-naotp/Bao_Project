const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// đọc file
function read(file) {
  return JSON.parse(fs.readFileSync(file));
}

// ghi file
function write(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// LOGIN
app.post('/login', (req, res) => {
  const users = read('users.json');
  const u = users.find(
    x => x.email === req.body.email && x.password === req.body.password
  );
  if (!u) return res.status(401).send('Sai tài khoản');
  res.json(u);
});

// CHECK IN
app.post('/checkin', (req, res) => {
  const data = read('attendance.json');
  const now = new Date();

  data.push({
    user_id: req.body.user_id,
    date: now.toISOString().slice(0,10),
    check_in: now.toTimeString().slice(0,5),
    check_out: null,
    total_hours: 0,
    late_minutes: Math.max(0, now.getHours()*60 + now.getMinutes() - 480)
  });

  write('attendance.json', data);
  res.send('Checked in');
});

// CHECK OUT
app.post('/checkout', (req, res) => {
  const data = read('attendance.json');
  const now = new Date();

  const a = data.find(
    x => x.user_id == req.body.user_id && x.check_out === null
  );

  if (!a) return res.send('Chưa check in');

  a.check_out = now.toTimeString().slice(0,5);

  const start = parseInt(a.check_in.slice(0,2))*60 + parseInt(a.check_in.slice(3));
  const end = now.getHours()*60 + now.getMinutes();
  a.total_hours = ((end - start)/60).toFixed(2);

  write('attendance.json', data);
  res.send('Checked out');
});

app.listen(3000, () => {
  console.log('Server chạy tại http://localhost:3000');
});
