document.addEventListener('DOMContentLoaded', async () => {
    const inputField = document.getElementById('attendeeEmail');
    const saveButton = document.getElementById('sendinvit');
    const savedValue = document.getElementById('savedValue');

    // Import Firebase modules
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
    import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

    // Your Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBU0ns9VzWBxbHOIgTR-Yb6g1aFbOQEWFA",
        authDomain: "engineerr1983meet.firebaseapp.com",
        projectId: "engineerr1983meet",
        storageBucket: "engineerr1983meet.appspot.com",
        messagingSenderId: "308801516934",
        appId: "1:308801516934:web:1a3833be5e03dfbcd66807",
        measurementId: "G-X22VZ2TVWT"
    };

    // Initialize Firebase and Firestore
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Save value to Firestore
    saveButton.addEventListener('click', async () => {
        const email = inputField.value;

        if (email.trim() === '') {
            alert('Please enter an email.');
            return;
        }

        try {
            await setDoc(doc(db, 'attendees', email), { value: inputField.value });
            console.log('Value successfully saved!');
            savedValue.textContent = `Stored Value: ${inputField.value}`;
        } catch (error) {
            console.error('Error saving document: ', error);
        }
    });

    // Load value from Firestore
    const email = inputField.value;
    if (email.trim() !== '') {
        try {
            const docRef = doc(db, 'attendees', email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const storedValue = docSnap.data().value;
                savedValue.textContent = `Stored Value: ${storedValue}`;
                inputField.value = storedValue;
            } else {
                savedValue.textContent = 'No data found!';
            }
        } catch (error) {
            console.error('Error getting document: ', error);
        }
    }
});
