function meetingeventnotification() {
    const accessToken = localStorage.getItem('accessToken');
    const loggedInEmail = localStorage.getItem('loggedInEmail');

    if (accessToken && loggedInEmail) {
        loadMeetings();
    } else {
        alert('Please log in to load invitations..');
    }
}

function loadMeetings() {
    const accessToken = localStorage.getItem('accessToken');

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        const loggedInEmail = localStorage.getItem('loggedInEmail');
        const filteredEvents = data.items.filter(event =>
            event.attendees && event.attendees.some(attendee => attendee.email === loggedInEmail)
        );

        const now = new Date();

        // Check each event and schedule notifications
        filteredEvents.forEach(event => {
            const eventStart = new Date(event.start.dateTime);
            const timeBeforeStart = eventStart - now;

            // Only trigger notifications if the event hasn't started yet
            if (timeBeforeStart > 0) {
                console.log("timeBeforeStart:", timeBeforeStart);

                // Notification times: 3 times before start, 2 times after start
                const notificationTimes = [
                    eventStart - 15 * 60 * 1000, // 15 minutes before
                    eventStart - 11 * 60 * 1000, // 11 minutes before
                    eventStart - 7 * 60 * 1000, // 7 minutes before
                    eventStart + 1 * 60 * 1000, // 1 minute after
                    eventStart + 5 * 60 * 1000 // 5 minutes after
                ];

                notificationTimes.forEach(notificationTime => {
                    if (now <= notificationTime && now > (notificationTime - 1 * 60 * 1000)) {
                        // Check if this notification time has already been shown
                        if (!localStorage.getItem(`notification_shown_${notificationTime}`)) {
                            const delay = notificationTime - now;
                            setTimeout(() => {
                                showNotification(event);
                                localStorage.setItem(`notification_shown_${notificationTime}`, 'true');
                            }, delay);
                        }
                    }
                });
            }
        });
    })
    .catch(error => console.error("Error loading meetings:", error));
}

function showNotification(event) {
    console.log('showNotification called');  // Check if function is called
    // Create notification container
    const notificationContainer = document.createElement('div');
    notificationContainer.classList.add('notification');
    notificationContainer.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        margin-bottom: 10px;
        padding: 10px;
        width: 300px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        color: black;  /* Ensure text color is visible */
        display: block; /* Ensure it's visible */
    `;

    // Position notifications one above the other
    document.querySelectorAll('.notification').forEach((n, i) => {
        n.style.bottom = `${(i + 1) * 110}px`;  // Stack by 110px
    });

    // Notification content
    const startTime = new Date(event.start.dateTime).toLocaleString();
    const endTime = new Date(event.end.dateTime).toLocaleString();
    const creatorEmail = event.creator.email;
    const description = event.description || 'No description';
    const hangoutLink = event.hangoutLink || 'No link available';

    notificationContainer.innerHTML = `
        <div style="position: relative; padding-right: 20px;">
            <strong>Start Time:</strong> ${startTime}<br>
            <strong>End Time:</strong> ${endTime}<br>
            <strong>Creator's Email:</strong> ${creatorEmail}<br>
            <strong>Description:</strong> ${description}<br>
            <strong>Meeting Link:</strong> <a href="${hangoutLink}" target="_blank">${hangoutLink}</a><br>
        </div>
        <button style="
            position: absolute;
            top: 5px;
            right: 5px;
            border: none;
            background: transparent;
            cursor: pointer;
        ">&times;</button>
    `;

    // Append notification to the body
    document.body.appendChild(notificationContainer);
    console.log('Notification added to the DOM');

    // Log for debugging
    console.log('Notification added:', notificationContainer);

    // Close button functionality
    const closeButton = notificationContainer.querySelector('button');
    closeButton.addEventListener('click', () => {
        notificationContainer.remove();
        repositionNotifications();
    });
}

function repositionNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((n, i) => {
        n.style.bottom = `${i * 110}px`;  // Recalculate stacking position
    });
}

document.addEventListener('DOMContentLoaded', function () {
    meetingeventnotification();
});
console.log("success");
