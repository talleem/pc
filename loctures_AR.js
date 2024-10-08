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
    document.getElementById('fileupload').textContent = 'تحميل المحتوى';
    document.getElementById('updatenotes').textContent = 'تعديل الملاحظات';

    // Translate combo box labels
    document.querySelector('label[for="lecturer-email"] h3').textContent = 'ايميل الاستاذ';
    document.querySelector('label[for="lecture-time"] h3').textContent = 'تاريخ المحاضرة';
}

