document.addEventListener('DOMContentLoaded', (event) => {
    const inputField = document.getElementById('attendeeEmail');
    const saveButton = document.getElementById('sendinvit');
    const savedValue = document.getElementById('savedValue');

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initialize Firestore
    const db = firebase.firestore();

    // Load the saved value from Firestore and display it
    db.collection('attendees').doc('attendeeEmail').get()
        .then((doc) => {
            if (doc.exists) {
                const storedValue = doc.data().value;
                savedValue.textContent = `Stored Value: ${storedValue}`;
                inputField.value = storedValue;
            } else {
                console.log('No such document!');
            }
        })
        .catch((error) => {
            console.error('Error getting document: ', error);
        });

    // Save the value to Firestore when the button is clicked
    saveButton.addEventListener('click', () => {
        const value = inputField.value;
        db.collection('attendees').doc('attendeeEmail').set({ value: value })
            .then(() => {
                console.log('Value successfully saved!');
                savedValue.textContent = `Stored Value: ${value}`;
            })
            .catch((error) => {
                console.error('Error saving document: ', error);
            });
    });
});
