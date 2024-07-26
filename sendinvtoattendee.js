document.addEventListener('DOMContentLoaded', (event) => {
    const inputField = document.getElementById('attendeeEmail');
    const saveButton = document.getElementById('sendinvit');
    const savedValue = document.getElementById('savedValuesList');

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

    // Load saved values from Firestore and display them in the list
    db.collection('attendees').orderBy('timestamp').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const storedValue = doc.data().value;
                const listItem = document.createElement('li');
                listItem.textContent = storedValue;
                savedValuesList.appendChild(listItem);
                checkList();
            });
        })
        .catch((error) => {
            console.error('Error getting documents: ', error);
        });

    // Check if the value is unique
    const isUnique = (value) => {
        const listItems = savedValuesList.getElementsByTagName('li');
        for (let item of listItems) {
            if (item.textContent === value) {
                return false;
            }
        }
        return true;
    };

    // Save the value to Firestore when the button is clicked
    saveButton.addEventListener('click', () => {
        const value = inputField.value.trim(); // Trim any extra whitespace

        if (value === '') {
            alert('Please enter a value.');
            return; // Do not proceed if the value is empty
        }

        if (isUnique(value)) {
            db.collection('attendees').add({
                value: value,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then((docRef) => {
                console.log('Value successfully saved!');
                const listItem = document.createElement('li');
                listItem.textContent = value;
                savedValuesList.appendChild(listItem);
                inputField.value = ''; // Clear the input field
                checkList();
            })
            .catch((error) => {
                console.error('Error saving document: ', error);
            });
        } else {
            alert('This email has already been added.');
        }
    });
});
