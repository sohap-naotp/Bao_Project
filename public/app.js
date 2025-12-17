const API = '';
let user = null;


async function login() {
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;


const res = await fetch(API + '/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, password })
});


if (!res.ok) return alert('Sai tài khoản');
user = await res.json();


document.getElementById('actions').classList.remove('hidden');
document.getElementById('hello').innerText = 'Xin chào ' + user.name;
}


async function checkin() {
const res = await fetch(API + '/checkin', { method: 'POST' });
const j = await res.json();
document.getElementById('msg').innerText = j.message;
}


async function checkout() {
const res = await fetch(API + '/checkout', { method: 'POST' });
const j = await res.json();
document.getElementById('msg').innerText = j.message;
}