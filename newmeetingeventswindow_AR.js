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

        let recurrenceInfo = 'اجتماع فردي';
        if (event.recurrence) {
            recurrenceInfo = 'اجتماع متكرر';

            const recurrenceRule = event.recurrence[0];
            const countMatch = recurrenceRule.match(/COUNT=(\d+)/);
            if (countMatch) {
                recurrenceInfo += `، يحدث ${countMatch[1]} مرة`;
            }

            const freqMatch = recurrenceRule.match(/FREQ=(\w+)/);
            if (freqMatch) {
                recurrenceInfo += `، تكرار: ${freqMatch[1].toLowerCase()}`;
            }
        }

        newWindow.document.write(`
            <li>
                <strong>وقت البدء:</strong> ${startTime}<br>
                <strong>وقت الانتهاء:</strong> ${endTime}<br>
                <strong>ايميل مدير الاجتماع:</strong> ${creatorEmail}<br>
                <strong>ملاحظات:</strong> ${description}<br>
                <strong>رابط الاجتماع:</strong> <a href="${hangoutLink}" class="meeting-link" data-creator-email="${creatorEmail}" target="_blank">${hangoutLink}</a><br>
                <strong>نوع الاجتماع:</strong> ${recurrenceInfo}
            </li>
        `);
    });

    newWindow.document.write('</ul>');

    // Add Arabic "Start Recording" button
    const recordButton = newWindow.document.createElement('button');
    recordButton.id = 'recordmeet';
    recordButton.textContent = 'بدء التسجيل';
    recordButton.style.backgroundColor = 'green';
    recordButton.style.color = 'white';
    recordButton.style.position = 'fixed';
    recordButton.style.top = '10px';
    recordButton.style.right = '10px';
    recordButton.style.padding = '10px 20px';
    recordButton.style.fontWeight = 'bold';
    recordButton.style.border = 'none';
    recordButton.style.borderRadius = '5px';
    recordButton.style.cursor = 'pointer';
    recordButton.style.boxShadow = '0 4px #999';

    // Add Arabic "Stop Recording" button
    const stopButton = newWindow.document.createElement('button');
    stopButton.id = 'stoprecord';
    stopButton.textContent = 'اخزن التسجيل';
    stopButton.style.backgroundColor = 'red';
    stopButton.style.color = 'white';
    stopButton.style.position = 'fixed';
    stopButton.style.top = '50px';
    stopButton.style.right = '10px';
    stopButton.style.padding = '10px 20px';
    stopButton.style.fontWeight = 'bold';
    stopButton.style.border = 'none';
    stopButton.style.borderRadius = '5px';
    stopButton.style.cursor = 'pointer';
    stopButton.style.boxShadow = '0 4px #999';
    stopButton.disabled = true; // Initially disabled

    newWindow.document.body.appendChild(recordButton);
    newWindow.document.body.appendChild(stopButton);
}

