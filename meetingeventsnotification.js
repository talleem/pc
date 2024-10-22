function meetingeventnotification() {
    console.log('Meeting event notification started');
    const accessToken = localStorage.getItem('accessToken');
    const loggedInEmail = localStorage.getItem('loggedInEmail');

    if (accessToken && loggedInEmail) {
        console.log('Access token and logged in email found, loading meetings...');
        loadMeetings();
    } else {
        console.log('Access token or logged in email not found');
        alert('Please log in to load invitations.');
    }
}

function loadMeetings() {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Loading meetings with access token:', accessToken);

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    .then(response => {
        console.log('Response received from API:', response);
        return response.json();
    })
    .then(data => {
        console.log('Data received from API:', data);
        const loggedInEmail = localStorage.getItem('loggedInEmail');
        const filteredEvents = data.items.filter(event =>
            event.attendees && event.attendees.some(attendee => attendee.email === loggedInEmail)
        );
        console.log('Filtered events for logged in user:', filteredEvents);

        // Schedule notifications for each event
        filteredEvents.forEach(event => {
            const eventStart = new Date(event.start.dateTime);
            console.log('Event start time:', eventStart);

            const checkNotificationTiming = setInterval(() => {
                const now = new Date();
                const timeBeforeStart = (eventStart - now) / 1000 / 60; // Convert to minutes
                console.log('Time before event start (minutes):', timeBeforeStart);

                // Check notification timing conditions
                if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 15) {
                    showNotification(event);
                } else if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 13) {
                    showNotification(event);
                } else if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 11) {
                    showNotification(event);
                } else if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 9) {
                    showNotification(event);
                } else if (timeBeforeStart < 0 && Math.ceil(timeBeforeStart) === 7) {
                    showNotification(event);
                } else if (timeBeforeStart < 0 && Math.ceil(timeBeforeStart) === 5) {
                    showNotification(event);
                } else if (timeBeforeStart < 0 && Math.ceil(timeBeforeStart) === 3) {
                    showNotification(event);
                } else if (timeBeforeStart < 0 && Math.ceil(timeBeforeStart) === 1) {
                    showNotification(event);
                } else if (timeBeforeStart < 0 && Math.ceil(timeBeforeStart) === -1) {
                    showNotification(event);
                } else if (timeBeforeStart < 0 && Math.ceil(timeBeforeStart) === -3) {
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

    // Position notifications properly
    document.querySelectorAll('.notification').forEach((n, i) => {
        n.style.bottom = `${(i + 1) * 110}px`;
    });

    const startTime = new Date(event.start.dateTime).toLocaleString();
    const endTime = new Date(event.end.dateTime).toLocaleString();
    const creatorEmail = event.creator.email;
    const description = event.description || 'No description';
    const hangoutLink = event.hangoutLink || 'No link available';

    const isArabic = localStorage.getItem('arpage') === 'ar';
    console.log('Language preference is Arabic:', isArabic);

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
        console.log('Notification closed and removed');
    });

    const meetingLink = notificationContainer.querySelector('.meeting-link');
    meetingLink.addEventListener('click', function (e) {
        e.preventDefault();
        const hangoutLink = this.getAttribute('data-hangout-link');
        console.log('Meeting link clicked:', hangoutLink);
        openRecordingWindow(hangoutLink); // Open recording controls
        window.open(hangoutLink, '_blank'); // Open the meeting link in a new tab
    });
}

function repositionNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((n, i) => {
        n.style.bottom = `${i * 110}px`;
        console.log('Notification repositioned');
    });
}

function openRecordingWindow(hangoutLink) {
    console.log('Opening recording window for link:', hangoutLink);

    const width = 420;
    const height = 140;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    const newWindow = window.open('', '_blank', 
        `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,toolbar=no,menubar=no,status=no,alwaysRaised=yes`
    );

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
    console.log('Recording window created');

    const startButton = newWindow.document.getElementById('startRecording');
    const stopButton = newWindow.document.getElementById('stopRecording');
    let mediaRecorder;
    let stream;

    startButton.addEventListener('click', () => {
        console.log('Start recording clicked');
        const creatorEmail = localStorage.getItem('creatorEmail');
        const loggedInEmail = localStorage.getItem('loggedInEmail');

        if (creatorEmail === loggedInEmail) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((mediaStream) => {
                    console.log('User media obtained');
                    stream = mediaStream;
                    mediaRecorder = new MediaRecorder(stream);
                    const chunks = [];

                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            chunks.push(event.data);
                        }
                    };

                    mediaRecorder.onstop = async () => {
                        console.log('Media recording stopped');
                        const blob = new Blob(chunks, { type: 'video/webm' });
                        const storageRef = firebase.storage().ref();
                        const videoRef = storageRef.child(`meetings_videos/${new Date().getTime()}_meeting_recording.webm`);
                        const db = firebase.firestore();

                        try {
                            const snapshot = await videoRef.put(blob);
                            const downloadURL = await snapshot.ref.getDownloadURL();
                            console.log('Recording saved to Firebase at URL:', downloadURL);
                            await db.collection('meetings').add({
                                downloadURL,
                                creator: loggedInEmail,
                                created: new Date().toISOString()
                            });
                            alert('Recording uploaded successfully');
                        } catch (error) {
                            console.error('Error saving recording:', error);
                        }
                    };

                    mediaRecorder.start();
                    console.log('Recording started');
                    startButton.disabled = true;
                    stopButton.disabled = false;
                })
                .catch((err) => console.error('Error accessing media devices:', err));
        } else {
            alert('Only the meeting organizer can start the recording');
        }
    });

    stopButton.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            console.log('Stop recording clicked and recording stopped');
            stream.getTracks().forEach(track => track.stop());
            stopButton.disabled = true;
        }
    });
}
