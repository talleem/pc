function updatenotes() {
    const selectedRow = document.querySelector('.selected-row');
    if (!selectedRow) {
        alert('Please select a meeting to update the notes.');
        return;
    }

    const selectedLecturerEmail = selectedRow.cells[0].textContent;  // Getting the lecturer email from the selected row
    const loggedInEmail = localStorage.getItem('loggedInEmail');  // Retrieving logged in user email

    if (loggedInEmail !== selectedLecturerEmail) {
        alert('Only the meeting creator is authorized to update the notes field for this meeting video.');
        return;  // Prevents update if emails don't match
    } else {
        const notesTextarea = selectedRow.querySelector('textarea');
        const newNotes = notesTextarea.value;

        if (!newNotes) {
            alert('Please enter a value for the Notes field.');
            return;
        }

        const documentId = selectedRow.getAttribute('data-document-id');  // Fetch the document ID
        const docRef = db.collection('meetings_his_tbl').doc(documentId);

        // Retrieve the original notes from Firestore and compare with new notes
        docRef.get().then((doc) => {
            if (doc.exists) {
                const originalNotes = doc.data().Notes || 'No notes';

                if (newNotes === originalNotes) {
                    alert('The new value already exists in the table.');
                } else {
                    // Update Firestore with the new notes
                    docRef.update({
                        Notes: newNotes
                    }).then(() => {
                        alert('Notes updated successfully.');
                    }).catch(error => console.error('Error updating notes:', error));
                }
            }
        }).catch(error => console.error('Error fetching document:', error));
    }
}
