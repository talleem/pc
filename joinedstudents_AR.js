document.addEventListener("DOMContentLoaded", function () {
    // Check if 'arpage' in localStorage is set to 'ar'
    if (localStorage.getItem('arpage') === 'ar') {
        // Delay the translation slightly to ensure table is fully loaded
        setTimeout(translateTableToArabic, 100); // Wait for 100 milliseconds
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

        // Translate the Category cell (trim to avoid issues with extra spaces)
        const categoryText = categoryCell.textContent.trim();
        if (categoryText === 'lecturer') {
            categoryCell.textContent = 'محاضر';
            console.log("succeded");
        } else if (categoryText === 'student') {
            categoryCell.textContent = 'طالب';
        }

        // Translate the Logged in? cell (trim to avoid issues with extra spaces)
        const statusText = statusCell.textContent.trim();
        if (statusText === 'Online') {
            statusCell.textContent = 'متصل';
        } else if (statusText === 'Offline') {
            statusCell.textContent = 'غير متصل';
        }
    });
}
