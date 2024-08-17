document.addEventListener('DOMContentLoaded', (event) => {
    // Get the stored email from localStorage
    const storedEmail = localStorage.getItem('loggedInEmail');
    console.log(storedEmail);

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
    
    // Reference to the savedValuesList element
    const savedValuesList = document.getElementById('savedValuesList');

    // Load saved values from Firestore and display them in the list
    db.collection('attendees').orderBy('timestamp').get()
        .then((querySnapshot) => {
            const currentDate = new Date();

            querySnapshot.forEach((doc) => {
                const storedValue = doc.data().value;
                const timestamp = doc.data().timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
                
                // Check if the timestamp is within the last 8 months
                const eightMonthsAgo = new Date();
                eightMonthsAgo.setMonth(currentDate.getMonth() - 8);

                if (timestamp >= eightMonthsAgo) {
                    const listItem = document.createElement('li');
                    listItem.textContent = storedValue;

                    // Style the list item if it matches the stored email
                    if (storedValue === storedEmail) {
                        listItem.style.color = 'blue';
                        listItem.style.fontWeight = 'bold';
                        listItem.style.fontSize = '1.5em'; // Equivalent to h4 font size
                    }

                    savedValuesList.appendChild(listItem);
                }
            });
        })
        .catch((error) => {
            console.error('Error getting documents: ', error);
        });
});

