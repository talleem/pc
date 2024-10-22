function meetingeventnotification() {
    const accessToken = localStorage.getItem('accessToken');
    const loggedInEmail = localStorage.getItem('loggedInEmail');

    if (accessToken && loggedInEmail) {
        console.log('Access token and logged in email found. Loading meetings...');
        loadMeetings();
    } else {
        console.log('Access token or logged in email missing.');
        alert('Please log in to load invitations.');
    }
}

function loadMeetings() {
    const accessToken = localStorage.getItem('accessToken');

    console.log('Fetching meetings from Google Calendar...');
    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    .then(response => {
        console.log('Received response from Calendar API');
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data);

        const loggedInEmail = localStorage.getItem('loggedInEmail');
        const filteredEvents = data.items.filter(event =>
            event.attendees && event.attendees.some(attendee => attendee.email === loggedInEmail)
        );

        console.log('Filtered events for the logged in user:', filteredEvents);

        // Check each event and schedule notifications
        filteredEvents.forEach(event => {
            const eventStart = new Date(event.start.dateTime);
            console.log(`Event start time: ${eventStart}`);

            const checkNotificationTiming = setInterval(() => {
                const now = new Date();
                const timeBeforeStart = (eventStart - now) / 1000 / 60; // Convert to minutes
                console.log(`Time before event starts (in minutes): ${Math.floor(timeBeforeStart)}`);

                // Check various conditions for notification timing
                if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 15) {
                    console.log('Showing notification for event 15 minutes before start.');
                    showNotification(event);
                } else if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 5) {
                    console.log('Showing notification for event 5 minutes before start.');
                    showNotification(event);
                } else if (timeBeforeStart < 0 && Math.ceil(timeBeforeStart) === -5) {
                    console.log('Showing notification for event 5 minutes after start.');
                    showNotification(event);
                    clearInterval(checkNotificationTiming); // Stop the loop after the last notification
                }
            }, 60000); // Check every minute
        });
    })
    .catch(error => {
        console.error('Error loading meetings:', error);
    });
}

function showNotification(event) {
    console.log('showNotification called for event:', event);

    const notificationContainer = document.createElement('div');
    notificationContainer.classList.add('notification');
    notificationContainer.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        margin-bottom: 10px;
        padding: 10px;
        width: 350px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        color: black;
        display: block;
    `;

    document.querySelectorAll('.notification').forEach((n, i) => {
        n.style.bottom = `${(i + 1) * 110}px`;
    });

    const startTime = new Date(event.start.dateTime).toLocaleString();
    const endTime = new Date(event.end.dateTime).toLocaleString();
    const creatorEmail = event.creator.email;
    const description = event.description || 'No description';
    const hangoutLink = event.hangoutLink || 'No link available';

    // Check for Arabic language preference
    const isArabic = localStorage.getItem('arpage') === 'ar';
    console.log('Arabic page:', isArabic);

    const startTimeLabel = isArabic ? 'وقت البدء' : 'Start Time';
    const endTimeLabel = isArabic ? 'وقت الانتهاء' : 'End Time';
    const creatorEmailLabel = isArabic ? 'ايميل مدير الاجتماع' : "Creator's Email";
    const descriptionLabel = isArabic ? 'الملاحظات' : 'Description';
    const meetingLinkLabel = isArabic ? 'رابط الاجتماع' : 'Meeting Link';

    notificationContainer.innerHTML = `
        <div style="position: relative; padding-right: 20px;">
            <strong>${startTimeLabel}:</strong> ${startTime}<br>
            <strong>${endTimeLabel}:</strong> ${endTime}<br>
            <strong>${creatorEmailLabel}:</strong> ${creatorEmail}<br>
            <strong>${descriptionLabel}:</strong> ${description}<br>
            <strong>${meetingLinkLabel}:</strong> <a href="#" class="meeting-link" data-hangout-link="${hangoutLink}" data-creator-email="${creatorEmail}">${hangoutLink}</a><br>
        </div>
        <button style="position: absolute; top: 5px; right: 5px; border: none; background: transparent; cursor: pointer;">&times;</button>
    `;

    document.body.appendChild(notificationContainer);
    console.log('Notification added to the DOM');

    const closeButton = notificationContainer.querySelector('button');
    closeButton.addEventListener('click', () => {
        notificationContainer.remove();
        repositionNotifications();
    });

    // Add click event to meeting link
    const meetingLink = notificationContainer.querySelector('.meeting-link');
    meetingLink.addEventListener('click', function (e) {
        e.preventDefault();
        const hangoutLink = this.getAttribute('data-hangout-link');
        openRecordingWindow(hangoutLink); // Open the recording controls window
        window.open(hangoutLink, '_blank'); // Open the meeting link in a new tab
    });
}

function repositionNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((n, i) => {
        n.style.bottom = `${i * 110}px`;
    });
}

function openRecordingWindow(hangoutLink) {
    console.log('Opening recording window for link:', hangoutLink);

    // Calculate window position (center of the screen)
    const width = 420;
    const height = 140;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    // Open a new popup window in the center with custom properties
    const newWindow = window.open('', '_blank', 
        `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,toolbar=no,menubar=no,status=no,alwaysRaised=yes`
    );

    // Write the content of the new window (only start and stop recording buttons)
    newWindow.document.write(`
        <html>
        <head><title>Recording Controls</title></head>
        <body>
            <h2>Recording Controls</h2>
            <button id="startRecording">Start Recording</button>
            <button id="stopRecording" disabled>Stop Recording</button>
        </body>
        </html>
    `);

    // Rest of the recording logic here...
}
