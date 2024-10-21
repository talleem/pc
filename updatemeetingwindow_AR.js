function translateToArabic_up(updateWindow) {
    // Translate field labels
    const fieldTranslations = {
        'Description': 'ملاحظات',
        'Start Time': 'وقت البدء',
        'End Time': 'وقت الانتهاء',
        'Repeat Every': 'كرر الاجتماع كل',
        'Repeat Frequency': 'يوم / شهر / سنة',
        'Number of Occurrences': 'عدد مرات التكرار',
        'Update Meetings': 'تحديث الاجتماعات'
    };

    // Translate buttons
    const buttonTranslations = {
        'addAttendee': 'أضف مشارك',
        'deleteAttendee': 'احذف مشارك',
        'previous': 'سابق',
        'next': 'تالي',
        'updateMeeting': 'عدل المعلومات',
        'deleteMeeting': 'احذف الاجتماع'
    };

    // Translate button texts by ID
    Object.keys(buttonTranslations).forEach(function(id) {
        const button = updateWindow.document.getElementById(id);
        if (button) {
            button.textContent = buttonTranslations[id];
        }
    });

    // Translate fields and headings
    Object.keys(fieldTranslations).forEach(function(text) {
        const elements = updateWindow.document.querySelectorAll(`strong:contains('${text}')`);
        elements.forEach(function(element) {
            element.textContent = fieldTranslations[text];
        });
    });

    // Translate heading
    const heading = updateWindow.document.querySelector('h2');
    if (heading) {
        heading.textContent = fieldTranslations['Update Meetings'];
    }
}
