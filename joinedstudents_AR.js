document.addEventListener("DOMContentLoaded", function () {
    // Check if 'arpage' in localStorage is set to 'ar'
    if (localStorage.getItem('arpage') === 'ar') {
        translateTableToArabic();
    }
});

// Function to translate table headers and specific cell content to Arabic
function translateTableToArabic() {
    // Translate the table headers
    const headers = document.querySelectorAll('th');
    headers[0].textContent = 'ايميل المستخدم'; // 'User email'
    headers[1].textContent = 'نوع المستخدم'; // 'Category'
    headers[2].textContent = 'هل المستخدم متصل؟'; // 'Logged in?'

    // Translate the table content
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(row => {
        const categoryCell = row.children[1]; // 'Category' column
        const statusCell = row.children[2]; // 'Logged in?' column

        // Translate the Category cell
        if (categoryCell.textContent === 'lecturer') {
            categoryCell.textContent = 'محاضر';
        } else if (categoryCell.textContent === 'student') {
            categoryCell.textContent = 'طالب';
        }

        // Translate the Logged in? cell
        if (statusCell.textContent === 'Online') {
            statusCell.textContent = 'متصل';
        } else if (statusCell.textContent === 'Offline') {
            statusCell.textContent = 'غير متصل';
        }
    });
}
