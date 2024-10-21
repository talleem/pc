// In updatemeetingwindow_AR.js
function translateToArabic_up(updateWindow) {
    const fieldTranslations = {
        'Description': 'ملاحظات',
        'Start Time': 'وقت البدء',
        'End Time': 'وقت الانتهاء',
        'Repeat Every': 'كرر الاجتماع كل',
        'Repeat Frequency': 'يوم / شهر / سنة',
        'Number of Occurrences': 'عدد مرات التكرار'
    };

    // Loop through all <strong> elements and check if their text content matches
    Object.keys(fieldTranslations).forEach(function(text) {
        const elements = updateWindow.document.querySelectorAll('strong');  // Get all <strong> elements
        elements.forEach(function(element) {
            if (element.textContent.trim() === text) {
                element.textContent = fieldTranslations[text];  // Replace with translated text
            }
        });
    });

    // Translate button text
    const buttonTranslations = {
        'Add Attendee': 'أضف مشارك',
        'Delete Attendee': 'احذف مشارك',
        'Previous': 'سابق',
        'Next': 'تالي',
        'Update Meeting': 'عدل المعلومات',
        'Delete Meeting': 'احذف الاجتماع'
    };

    Object.keys(buttonTranslations).forEach(function(text) {
        const buttons = updateWindow.document.querySelectorAll('button');
        buttons.forEach(function(button) {
            if (button.textContent.trim() === text) {
                button.textContent = buttonTranslations[text];
            }
        });
    });

    // Update the window title
    const title = updateWindow.document.querySelector('h2');
    if (title && title.textContent.trim() === 'Update Meetings') {
        title.textContent = 'تحديث الاجتماعات';
    }
}
