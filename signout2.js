// signout2.js

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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to handle sign-out
function signOutUser() {
    const userEmail = localStorage.getItem('loggedEmail'); // Assuming you stored the user's email in localStorage

    if (userEmail) {
        db.collection('users_tbl')
            .where('email', '==', userEmail)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // Update the loggedin field to 0
                    db.collection('users_tbl').doc(doc.id).update({
                        loggedin: 0
                    }).then(() => {
                        console.log('User successfully signed out.');
                        // Optionally, redirect to login screen or perform other actions
                        window.location.href = "https://engineerr1983.github.io/hello-world-page/loginscreen.html";
                    }).catch((error) => {
                        console.error('Error updating document: ', error);
                    });
                });
            })
            .catch((error) => {
                console.error('Error getting documents: ', error);
            });
    } else {
        console.error('No user email found in localStorage.');
    }
}
// Add event listener to the signout button once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('signout').addEventListener('click', signOutUser);
});
