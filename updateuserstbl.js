// Function to update user details in Firestore
function updateuserstbl() {
    const email = localStorage.getItem('detailsemail'); // Get email from localStorage

    if (email) {
        const tableBody = document.getElementById('tableBody');
        const rows = tableBody.getElementsByTagName('tr');

        Array.from(rows).forEach((row) => {
            const inputs = row.getElementsByTagName('input');
             const select = row.getElementsByTagName('select')[0]; // Get the City dropdown (select element)
            const updatedData = {
                email: inputs[0].value, // Email
                password: inputs[1].value, // Password
                FullName: inputs[2].value, // Full Name
                IdNumber: inputs[3].value, // ID Number
                IdRecordNumber: inputs[4].value, // ID Record Number
                BirthDate: inputs[5].value, // Birth Date
                Phone: inputs[6].value, // Phone
                EmergencyPhone: inputs[7].value, // Emergency Phone
                Address: inputs[8].value, // Address
                City: select.value, // City from the dropdown (select)
                Lectures: inputs[9].value // Lectures
            };

            // Update the document in Firestore
            db.collection('users_tbl').where('email', '==', email).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // Update the document with new data
                        db.collection('users_tbl').doc(doc.id).update(updatedData)
                            .then(() => {
                                console.log('User details updated successfully');
                                alert('User details updated successfully'); // Show success message
                            })
                            .catch((error) => {
                                console.error('Error updating document:', error);
                                alert('Error updating user details. Please try again.');
                            });
                    });
                })
                .catch((error) => {
                    console.error('Error getting documents:', error);
                    alert('Error retrieving user details. Please try again.');
                });
        });
    } else {
        alert('No user is logged in.');
    }
}

