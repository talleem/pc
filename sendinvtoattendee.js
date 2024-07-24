document.addEventListener('DOMContentLoaded', (event) => {
    const inputField = document.getElementById('attendeeEmail');
    const saveButton = document.getElementById('sendinvit');
    const savedValue = document.getElementById('savedValue');

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBU0ns9VzWBxbHOIgTR-Yb6g1aFbOQEWFA",
        authDomain: "engineerr1983meet.firebaseapp.com",
        projectId: "engineerr1983meet",
        storageBucket: "engineerr1983meet.appspot.com",
        messagingSenderId: "308801516934",
        appId: "1:308801516934:web:1a3833be5e03dfbcd66807",
        measurementId: "G-X22VZ2TVWT"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized:', firebase.apps.length);

    // Initialize Firestore
    const db = firebase.firestore();

  // Load the saved value from Firestore and display it
    saveButton.addEventListener('click', () => {
        const email = inputField.value;

        // Save the value to Firestore
        db.collection('attendees').doc(email).set({ value: inputField.value })
            .then(() => {
                console.log('Value successfully saved!');
                savedValue.textContent = `Stored Value: ${inputField.value}`;
            })
            .catch((error) => {
                console.error('Error saving document: ', error);
            });
    });

    // Retrieve and display the saved value from Firestore
    const email = inputField.value;
    db.collection('attendees').doc(email).get()
        .then((doc) => {
            if (doc.exists) {
                const storedValue = doc.data().value;
                savedValue.textContent = `Stored Value: ${storedValue}`;
                inputField.value = storedValue;
            } else {
                savedValue.textContent = 'No data found!';
            }
        })
        .catch((error) => {
            console.error('Error getting document: ', error);
        });
});
