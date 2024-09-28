function signout() {
    return new Promise((resolve, reject) => {
        // Get logged-in email from localStorage
        const email = localStorage.getItem('loggedInEmail');

        if (!email) {
            console.error('No logged-in email found.');
            reject('No logged-in email found.');
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
                    reject('User not found.');
                    return;
                }

                const updatePromises = [];
                querySnapshot.forEach(doc => {
                    const updatePromise = firestore.collection('users_tbl').doc(doc.id).update({
                        loggedin: 0
                    });
                    updatePromises.push(updatePromise);
                });

                // Wait for all updates to complete
                return Promise.all(updatePromises);
            })
            .then(() => {
                console.log('Logged out successfully.');
                // Optionally remove the email from localStorage
                localStorage.removeItem('loggedInEmail');
                resolve(); // Resolve the promise
            })
            .catch(error => {
                console.error('Error updating loggedin status:', error);
                reject(error); // Reject the promise in case of error
            });
    });
}
