document.addEventListener('DOMContentLoaded', function() {
    // Check if localStorage has 'arpage' set to 'ar'
    const arpage = localStorage.getItem('arpage');
    if (arpage === 'ar') {
        translatePageToArabic();
    }
});

function translatePageToArabic() {
    // Translate table headers
    document.querySelector('th:nth-child(1)').textContent = ' ايميل الاستاذ';
    document.querySelector('th:nth-child(2)').textContent = 'تاريخ التحميل';
    document.querySelector('th:nth-child(3)').textContent = 'عرض المحتوى';
    document.querySelector('th:nth-child(4)').textContent = 'ملاحظات';

    // Translate buttons
    document.getElementById('deleteVideo').textContent = 'حذف المحتوى';
    document.getElementById('deleteVideo').style.fontWeight = 'bold';
    document.getElementById('deleteVideo').style.fontSize = '1.1em';
    document.getElementById('fileupload').textContent = 'تحميل المحتوى';
    document.getElementById('fileupload').style.fontWeight = 'bold';
    document.getElementById('fileupload').style.fontSize = '1.1em';
    document.getElementById('updatenotes').textContent = 'تعديل الملاحظات';
    document.getElementById('updatenotes').style.fontWeight = 'bold';
    document.getElementById('updatenotes').style.fontSize = '1.1em';

    // Translate combo box labels
    document.querySelector('label[for="lecturer-email"] h3').textContent = 'ايميل الاستاذ';
    document.querySelector('label[for="lecture-time"] h3').textContent = 'تاريخ المحاضرة';
}

