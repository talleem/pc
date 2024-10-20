function loadArabicContent(newWindow, events) {
    newWindow.document.write('<html><head><title>غرفة الاجتماعات</title></head><body>');
    newWindow.document.write('<h2>غرفة الاجتماعات</h2>');
    newWindow.document.write('<ul>');

    events.forEach(event => {
        const startTime = new Date(event.start.dateTime).toLocaleString();
        const endTime = new Date(event.end.dateTime).toLocaleString();
        const creatorEmail = event.creator.email;
        const description = event.description || 'لا يوجد ملاحظات';
        const hangoutLink = event.hangoutLink || 'لا يوجد رابط';

        let recurrenceInfo = 'Single Meeting'; // Keep it in English
        if (event.recurrence) {
            recurrenceInfo = 'Recurring Meeting'; // Keep it in English

            const recurrenceRule = event.recurrence[0];
            const countMatch = recurrenceRule.match(/COUNT=(\d+)/);
            if (countMatch) {
                recurrenceInfo += `, occurs ${countMatch[1]} times`; // Keep it in English
            }

            const freqMatch = recurrenceRule.match(/FREQ=(\w+)/);
            if (freqMatch) {
                recurrenceInfo += `, frequency: ${freqMatch[1].toLowerCase()}`; // Keep it in English
            }
        }

        newWindow.document.write(`
            <li>
                <strong>وقت البدء:</strong> ${startTime}<br>
                <strong>وقت الانتهاء:</strong> ${endTime}<br>
                <strong>ايميل مدير الاجتماع:</strong> ${creatorEmail}<br>
                <strong>ملاحظات:</strong> ${description}<br>
                <strong>رابط الاجتماع:</strong> <a href="${hangoutLink}" class="meeting-link" data-creator-email="${creatorEmail}" target="_blank">${hangoutLink}</a><br>
                <strong>نوع الاجتماع:</strong> ${recurrenceInfo} <!-- Remain in English -->
            </li>
        `);
    });

    newWindow.document.write('</ul>');

    // Append the existing buttons by ID and translate their text
    const recordButton = newWindow.document.getElementById('recordmeet');
    const stopButton = newWindow.document.getElementById('stoprecord');

    if (recordButton) {
        recordButton.textContent = 'بدء التسجيل'; // Translate to Arabic
    }
    
    if (stopButton) {
        stopButton.textContent = 'انهاء التسجيل'; // Translate to Arabic
    }

    newWindow.document.write('</body></html>'); // Close the HTML document
}
