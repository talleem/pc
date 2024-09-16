function meetingeventnotification() {
    const accessToken = localStorage.getItem('accessToken');
    const loggedInEmail = localStorage.getItem('loggedInEmail');

    if (accessToken && loggedInEmail) {
        loadMeetings();
    } else {
        alert('Please log in to load invitations.');
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
                if (timeBeforeStart > 0 && timeBeforeStart <= (15 * 60 * 1000)) {
                    // If less than 15 minutes before the event start, notify immediately
                    let delay = timeBeforeStart > 0 ? timeBeforeStart : 0;

                    // Schedule notifications 3 times before start
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => showNotification(event), delay + (i * 4 * 60 * 1000));
                    }
                    // Schedule notifications 2 times after start
                    for (let i = 1; i <= 2; i++) {
                        setTimeout(() => showNotification(event), delay + (15 * 60 * 1000) + (i * 4 * 60 * 1000));
                    }
                }
            });
        })
        .catch(error => console.error("Error loading meetings:", error));
}

function showNotification(event) {
    // Create notification container
    const notificationContainer = document.createElement('div');
    notificationContainer.classList.add('notification');
    notificationContainer.style.cssText = `
        position: fixed;
        bottom: 0;
        right: 0;
        margin-bottom: 10px;
        padding: 10px;
        width: 300px;
        background-color: #f0f0f0;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        z-index: 9999;
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

    // Close button functionality
    const closeButton = notificationContainer.querySelector('button');
    closeButton.addEventListener('click', () => {
        notificationContainer.remove();
        repositionNotifications();
    });

    // Remove automatic disappearance logic (setTimeout removed)
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
