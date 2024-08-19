// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBU0ns9VzWBxbHOIgTR-Yb6g1aFbOQEWFA",
    authDomain: "engineerr1983meet.firebaseapp.com",
    projectId: "engineerr1983meet",
    storageBucket: "engineerr1983meet.appspot.com",
    messagingSenderId: "308801516934",
    appId: "1:308801516934:web:1a3833be5e03dfbcd66807",
    measurementId: "G-X22VZ2TVWT"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

// Function to check if the email is unique in the list
const isUnique = (value) => {
    const listItems = savedValuesList.getElementsByTagName('li');
    for (let item of listItems) {
        if (item.textContent === value) {
            return false;
        }
    }
    return true;
};

// Function to save the value to Firestore and the list
function saveToFirestoreAndList(value) {
    const storedEmail = localStorage.getItem('loggedInEmail');
    if (isUnique(value)) {
        db.collection('attendees').add({
            value: value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log('Value successfully saved!');
            const listItem = document.createElement('li');
            listItem.textContent = value;
            
            // Style the new list item if it matches the stored email
            if (value === storedEmail) {
                listItem.style.color = 'blue';
                listItem.style.fontWeight = 'bold';
                listItem.style.fontSize = '1.5em';
            }

            savedValuesList.appendChild(listItem);
            inputField.value = ''; // Clear the input field
        })
        .catch((error) => {
            console.error('Error saving document: ', error);
        });
    } else {
        alert('This email has already been added.');
    }
}

// Function to handle button click and perform actions
function handleButtonClick() {
    const inputField = document.getElementById('attendeeEmail');
    const value = inputField.value.trim(); // Trim any extra whitespace

    if (value === '') {
        alert('Please enter a value.');
        return; // Do not proceed if the value is empty
    }

    // Check if the email contains the suffix @gmail.com
    if (!value.endsWith('@gmail.com')) {
        alert('Please enter a valid Gmail address.');
        return; // Do not proceed if the email does not contain @gmail.com
    }

    // Check if the email exists in the users_tbl collection
    db.collection('users_tbl').where('email', '==', value)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                alert('This email is not registered.');
            } else {
                // If the email exists, proceed with saving
                saveToFirestoreAndList(value);
            }
        })
        .catch(error => {
            console.error('Error checking email in users_tbl:', error.message);
            alert('Error checking email: ' + error.message);
        });
}

// Add event listener to the button to handle click
document.getElementById('sendinvit').addEventListener('click', handleButtonClick);
