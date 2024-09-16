document.addEventListener('DOMContentLoaded', function () {
    meetingeventnotification();
});

function meetingeventnotification() {
    const loadInvitButton = document.getElementById('loadinvit');
    
    loadInvitButton.addEventListener('click', function () {
        const accessToken = localStorage.getItem('accessToken');
        const loggedInEmail = localStorage.getItem('loggedInEmail');

        if (accessToken && loggedInEmail) {
            // Function to fetch and filter meetings
            function loadMeetings() {
                fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        const filteredEvents = data.items.filter(event =>
                            event.attendees && event.attendees.some(attendee => attendee.email === loggedInEmail)
                        );
                        
                        // Trigger notifications for filtered events
                        filteredEvents.forEach(event => {
                            scheduleNotification(event);
                        });
                    })
                    .catch(error => console.error("Error loading meetings:", error));
            }
            
            loadMeetings();
        } else {
            alert('Please log in to load invitations.');
        }
    });
}

function scheduleNotification(event) {
    const now = new Date();
    const eventStart = new Date(event.start.dateTime);
    const eventEnd = new Date(event.end.dateTime);

    const timeBeforeStart = eventStart - now;
    const timeAfterStart = eventEnd - now;

    if (timeBeforeStart > 0 && timeBeforeStart <= (15 * 60 * 1000)) {
        // Meeting is within 15 minutes, schedule 3 times before start, 2 after
        for (let i = 0; i < 3; i++) {
            setTimeout(() => showNotification(event), (i * 4 * 60 * 1000));  // Before meeting
        }

        for (let i = 1; i <= 2; i++) {
            setTimeout(() => showNotification(event), (15 * 60 * 1000) + (i * 4 * 60 * 1000));  // After meeting started
        }
    }
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

    // Auto remove notification after 5 seconds
    setTimeout(() => {
        notificationContainer.remove();
        repositionNotifications();
    }, 5000);
}

function repositionNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((n, i) => {
        n.style.bottom = `${i * 110}px`;  // Recalculate stacking position
    });
}

