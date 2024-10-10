function translateGoogleMeetPage() {
    // Translate the first <h4> tag
    const firstH4 = document.querySelector('h4:nth-of-type(1)');
    if (firstH4) {
        firstH4.textContent = 'أدخل قائمة بريد الكتروني لمستخدمي غرفة اجتماعات غوغل';
    }

    // Translate the second <h4> tag
    const secondH4 = document.querySelector('h4:nth-of-type(2)');
    if (secondH4) {
        secondH4.textContent = 'مع بريد المستخدم الحالي أو مدير الغرفة الظاهر باللون الأزرق - ضروري -';
    }
}

