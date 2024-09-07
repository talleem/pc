function updatenotes() {
    const selectedRow = document.querySelector('.selected-row');
    if (!selectedRow) {
        alert('Please select a row to update the notes.');
        return;
    }

    const notesTextarea = selectedRow.querySelector('textarea');
    const originalNotes = notesTextarea.textContent;
    const newNotes = notesTextarea.value.trim();
    
    if (!newNotes || newNotes === originalNotes) {
        alert('Please enter a new note value to update.');
        return;
    }

    const selectedLecturerEmail = selectedRow ? selectedRow.cells[0].textContent : null;
    const loggedInEmail = localStorage.getItem('loggedInEmail');

    // Check if the logged-in user is the creator
    if (loggedInEmail !== selectedLecturerEmail) {
        alert('Only the meeting creator is authorized to update the notes field for this meeting video.');
    } else {
        // Proceed with updating Firestore
        const db = firebase.firestore();
        const docId = selectedRow.getAttribute('data-doc-id'); // assuming you have doc-id stored in row

        db.collection('meetings_his_tbl').doc(docId).update({
            Notes: newNotes
        }).then(() => {
            alert('Notes updated successfully.');
            console.log('Notes updated successfully.');
        }).catch(error => {
            console.error('Error updating notes:', error);
        });
    }
}
