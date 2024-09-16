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

        // Check each event and schedule notifications
        filteredEvents.forEach(event => {
            const eventStart = new Date(event.start.dateTime);

            const checkNotificationTiming = setInterval(() => {
                const now = new Date();
                const timeBeforeStart = (eventStart - now) / 1000 / 60; // Convert to minutes

                // Check various conditions for notification timing
                if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 15) {
                    showNotification(event);
                } else if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 11) {
                    showNotification(event);
                } else if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 7) {
                    showNotification(event);
                } else if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 3) {
                    showNotification(event);
                } else if (timeBeforeStart < 0 && Math.ceil(timeBeforeStart) === -1) {
                    showNotification(event);
                } else if (timeBeforeStart < 0 && Math.ceil(timeBeforeStart) === -5) {
                    showNotification(event);
                    clearInterval(checkNotificationTiming); // Stop the loop after the last notification
                }
            }, 60000); // Check every minute
        });
    })
    .catch(error => console.error("Error loading meetings:", error));
}

function showNotification(event) {
    console.log('showNotification called');
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

    notificationContainer.innerHTML = `
        <div style="position: relative; padding-right: 20px;">
            <strong>Start Time:</strong> ${startTime}<br>
            <strong>End Time:</strong> ${endTime}<br>
            <strong>Creator's Email:</strong> ${creatorEmail}<br>
            <strong>Description:</strong> ${description}<br>
            <strong>Meeting Link:</strong> <a href="${hangoutLink}" target="_blank">${hangoutLink}</a><br>
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
}

function repositionNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((n, i) => {
        n.style.bottom = `${i * 110}px`;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    meetingeventnotification();
});
