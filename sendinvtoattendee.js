document.addEventListener('DOMContentLoaded', (event) => {
    const inputField = document.getElementById('attendeeEmail');
    const saveButton = document.getElementById('sendinvit');
    const savedValuesList = document.getElementById('savedValuesList');
    const storedEmail = localStorage.getItem('loggedInEmail');

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

    const db = firebase.firestore();
    const auth = firebase.auth();

    const eightMonthsAgo = new Date();
    eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

    // Load saved values from Firestore and display them in the list
    db.collection('attendees').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate();

            if (timestamp && timestamp <= eightMonthsAgo) {
                // Delete the document if it's older than 8 months
                doc.ref.delete().catch(console.error);
            } else {
                const listItem = document.createElement('li');
                listItem.textContent = data.value;

                if (data.value === storedEmail) {
                    listItem.style.color = 'blue';
                    listItem.style.fontWeight = 'bold';
                    listItem.style.fontSize = '1.5em';
                }

                savedValuesList.appendChild(listItem);
            }
        });
    }).catch(console.error);

    // Check if the value is unique
    const isUnique = (value) => {
        return ![...savedValuesList.getElementsByTagName('li')].some(item => item.textContent === value);
    };

    // Save the value to Firestore when the button is clicked
    saveButton.addEventListener('click', () => {
        const value = inputField.value.trim();

        if (value === '') {
            alert('Please enter a value.');
            return;
        }

        if (isUnique(value)) {
            db.collection('attendees').add({
                value: value,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                const listItem = document.createElement('li');
                listItem.textContent = value;
                savedValuesList.appendChild(listItem);
                inputField.value = '';
            }).catch(console.error);
        } else {
            alert('This email has already been added.');
        }
    });
});
