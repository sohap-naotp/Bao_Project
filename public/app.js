let user = null;
const API = "";

function login() {
  fetch("/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: email.value,
      password: pass.value
    })
  })
  .then(r => r.json())
  .then(d => {
    user = d;
    alert("Login OK");
  });
}

function checkin() {
  fetch("/checkin", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ user_id: user.id })
  }).then(()=>alert("Checked in"));
}

function checkout() {
  fetch("/checkout", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ user_id: user.id })
  }).then(()=>alert("Checked out"));
}
