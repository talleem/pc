function translateToArabic() {
    // Translate the table headers
    document.querySelector('th:nth-child(0)').innerText = 'الأيميل';
    document.querySelector('th:nth-child(1)').innerText = 'كلمة السر';
    document.querySelector('th:nth-child(2)').innerText = 'الأسم';
    document.querySelector('th:nth-child(3)').innerText = 'رقم البطاقة';
    document.querySelector('th:nth-child(4)').innerText = 'رقم السجل';
    document.querySelector('th:nth-child(5)').innerText = 'تاريخ الميلاد';
    document.querySelector('th:nth-child(6)').innerText = 'الهاتف';
    document.querySelector('th:nth-child(7)').innerText = 'هاتف الطواريء';
    document.querySelector('th:nth-child(8)').innerText = 'العنوان';
    document.querySelector('th:nth-child(9)').innerText = 'المدينة';
    document.querySelector('th:nth-child(10)').innerText = 'المحاضرات';
    // Translate buttons
    document.getElementById('updateuserstbl').textContent = "تحديث";
    document.getElementById('returnback').textContent = "صفحة المدير";
}

