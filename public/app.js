function checkIn() {
  fetch("/checkin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      employee_id: 1,
      shift_id: 1
    })
  }).then(res => res.text()).then(alert);
}

function checkOut() {
  fetch("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      employee_id: 1
    })
  }).then(res => res.text()).then(alert);
}
