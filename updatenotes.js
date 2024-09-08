function updatenotes() {
    const selectedRow = document.querySelector('.selected-row');
    
    if (!selectedRow) {
        alert('Please select a row to update the notes.');
    } else {
        // Get the Notes field (textarea) and lecturer email
        const notesTextarea = selectedRow.querySelector('textarea');
        const newNotes = notesTextarea.value.trim();
        const selectedLecturerEmail = selectedRow.cells[0].textContent;  // First cell is lecturer email
        const loggedInEmail = localStorage.getItem('loggedInEmail');

        // Authorization check: if logged-in user is not the creator
        if (loggedInEmail !== selectedLecturerEmail) {
            alert('Only the meeting creator is authorized to update the notes field for this meeting video.');
        } else {
            // Check if the new notes field is empty
            if (!newNotes) {
                alert('Please enter a value for the Notes field.');
            } else {
                // Fetch the original Notes field from Firestore
                const db = firebase.firestore();
                const docId = selectedRow.getAttribute('data-document-id');  // Ensure this is not empty or null
                console.log("Selected row's document ID:", docId);

                if (!docId) {
                    console.error('No document ID found for the selected row.');
                    return;
                }

                const docRef = db.collection('meetings_his_tbl').doc(docId);

                docRef.get().then(doc => {
                    if (doc.exists) {
                        const originalNotes = doc.data().Notes || '';

                        // Check if the new notes are the same as the original notes
                        if (originalNotes === newNotes) {
                            alert('The new value already exists in the table.');
                        } else {
                            // Update the Notes field in Firestore
                            docRef.update({ Notes: newNotes })
                                .then(() => {
                                    alert('Notes updated successfully.');
                                    console.log('Notes updated successfully.');
                                })
                                .catch(error => {
                                    console.error('Error updating notes:', error);
                                });
                        }
                    } else {
                        console.error('Document does not exist.');
                    }
                }).catch(error => {
                    console.error('Error fetching document:', error);
                });
            }
        }
    }
}
