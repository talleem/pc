function translateToArabic() {
    // Translate the table headers
    document.querySelector('th:nth-child(1)').innerText = 'الأيميل';
    document.querySelector('th:nth-child(2)').innerText = 'كلمة السر';
    document.querySelector('th:nth-child(3)').innerText = 'الأسم';
    document.querySelector('th:nth-child(4)').innerText = 'رقم البطاقة';
    document.querySelector('th:nth-child(5)').innerText = 'رقم السجل';
    document.querySelector('th:nth-child(6)').innerText = 'تاريخ الميلاد';
    document.querySelector('th:nth-child(7)').innerText = 'الهاتف';
    document.querySelector('th:nth-child(8)').innerText = 'هاتف الطواريء';
    document.querySelector('th:nth-child(9)').innerText = 'العنوان';
    document.querySelector('th:nth-child(10)').innerText = 'المدينة';
    document.querySelector('th:nth-child(11)').innerText = 'المحاضرات';
    // Translate buttons
    document.getElementById('updateuserstbl').textContent = "تحديث";
    document.getElementById('returnback').textContent = "صفحة المدير";
}

