function showDateTime() {
    const now = new Date();
    const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const dayOfWeek = daysOfWeek[now.getDay()]; // Lấy thứ hiện tại
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng tính từ 0
    const year = now.getFullYear();

    const formattedDateTime = `${dayOfWeek}, ngày ${day} tháng ${month} năm ${year}`;
    document.getElementById("datetime").innerText = formattedDateTime;
}

// Gọi hàm hiển thị thời gian ban đầu và cập nhật mỗi giây
showDateTime();
setInterval(showDateTime, 1000);


// script.js

// script.js
