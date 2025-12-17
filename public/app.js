// public/app.js
const statusMsg = document.getElementById('statusMsg');
const staffInput = document.getElementById('staffName');

// Đồng hồ thời gian thực
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString('vi-VN');
}, 1000);

// Hàm gọi API
async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

// Xử lý Check-in
document.getElementById('btnIn').addEventListener('click', async () => {
    const name = staffInput.value;
    if (!name) return alert('Vui lòng nhập tên nhân viên!');

    const res = await postData('/api/checkin', { name });
    statusMsg.innerText = res.message;
    statusMsg.style.color = res.late > 0 ? 'red' : 'green';
    loadLogs();
});

// Xử lý Check-out
document.getElementById('btnOut').addEventListener('click', async () => {
    const name = staffInput.value;
    if (!name) return alert('Vui lòng nhập tên nhân viên!');

    const res = await postData('/api/checkout', { name });
    if (res.error) {
        statusMsg.innerText = res.error;
        statusMsg.style.color = 'red';
    } else {
        statusMsg.innerText = res.message;
        statusMsg.style.color = 'blue';
        loadLogs();
    }
});

// Tải lịch sử
async function loadLogs() {
    const res = await fetch('/api/logs');
    const logs = await res.json();
    const tbody = document.getElementById('logTable');
    tbody.innerHTML = '';

    logs.forEach(log => {
        const checkIn = new Date(log.check_in_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
        const checkOut = log.check_out_time ? new Date(log.check_out_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : '--:--';
        
        // Format hiển thị trễ
        const lateClass = log.late_minutes > 0 ? 'late-warning' : '';
        const lateText = log.late_minutes > 0 ? `${log.late_minutes}p` : '0';

        const row = `
            <tr>
                <td>${log.employee_name}</td>
                <td>${checkIn}</td>
                <td>${checkOut}</td>
                <td class="${lateClass}">${lateText}</td>
                <td>${log.worked_hours ? log.worked_hours + 'h' : '...'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Tải dữ liệu khi mở web
loadLogs();