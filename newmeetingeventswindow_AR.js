function loadArabicContent(newWindow, events) {
    // Update the title and heading to Arabic
    newWindow.document.title = 'غرفة الاجتماعات';
    const heading = newWindow.document.createElement('h2');
    heading.textContent = 'غرفة الاجتماعات';
    newWindow.document.body.appendChild(heading);

    // Create a list for events if it doesn't already exist
    let eventList = newWindow.document.getElementById('eventList');
    if (!eventList) {
        eventList = newWindow.document.createElement('ul');
        eventList.id = 'eventList';
        newWindow.document.body.appendChild(eventList);
    }

    // Clear the previous event list items
    eventList.innerHTML = '';

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

        const listItem = newWindow.document.createElement('li');
        listItem.innerHTML = `
            <strong>وقت البدء:</strong> ${startTime}<br>
            <strong>وقت الانتهاء:</strong> ${endTime}<br>
            <strong>ايميل مدير الاجتماع:</strong> ${creatorEmail}<br>
            <strong>ملاحظات:</strong> ${description}<br>
            <strong>رابط الاجتماع:</strong> <a href="${hangoutLink}" class="meeting-link" data-creator-email="${creatorEmail}" target="_blank">${hangoutLink}</a><br>
            <strong>نوع الاجتماع:</strong> ${recurrenceInfo} <!-- Remain in English -->
        `;
        eventList.appendChild(listItem);
    });

    // Translate existing button text to Arabic
    const recordButton = newWindow.document.getElementById('recordmeet');
    const stopButton = newWindow.document.getElementById('stoprecord');

    if (recordButton) {
        recordButton.textContent = 'بدء التسجيل'; // Translate to Arabic
    }
    
    if (stopButton) {
        stopButton.textContent = 'انهاء التسجيل'; // Translate to Arabic
    }
}
