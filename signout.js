console.log("started");
function signout() {
    // Get logged-in email from localStorage
    const email = localStorage.getItem('loggedInEmail');
    
    if (!email) {
        console.error('No logged-in email found.');
        return;
    }

    // Reference to Firestore
    const firestore = firebase.firestore();

    // Update the loggedin field in users_tbl to 0 for the current user
    firestore.collection('users_tbl').where('email', '==', email)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                console.error('User not found.');
                return;
            }

            querySnapshot.forEach(doc => {
                firestore.collection('users_tbl').doc(doc.id).update({
                    loggedin: 0
                })
                .then(() => {
                    console.log('Logged out successfully.');
                    // Optionally remove the email from localStorage
                    localStorage.removeItem('loggedInEmail');
                })
                .catch(error => {
                    console.error('Error updating loggedin status:', error);
                });
            });
        })
        .catch(error => {
            console.error('Error retrieving user data:', error);
        });
}
