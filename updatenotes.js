function updatenotes() {
    const selectedRow = document.querySelector('.selected-row');
    
    if (!selectedRow) {
        alert('Please select a lecture to update notes.');
        return;
    }

    const notesTextarea = selectedRow.querySelector('textarea');
    const originalNotes = notesTextarea.getAttribute('data-original-notes') || 'No notes';
    const newNotes = notesTextarea.value.trim();
    const selectedLecturerEmail = selectedRow ? selectedRow.cells[0].textContent : null;
    const loggedInEmail = localStorage.getItem('loggedInEmail');

    // Check if the notes are empty or equal to the original notes
    if (!newNotes || newNotes === originalNotes) {
        alert('Please enter a new note value to update.');
        return;
    }

    // Check if the logged-in user is the creator of the meeting
    if (loggedInEmail !== selectedLecturerEmail) {
        alert('Only the meeting creator is authorized to update the notes field for this meeting video.');
        return;
    }

    const db = firebase.firestore();
    const selectedDocumentId = selectedRow.getAttribute('data-document-id');

    db.collection('meetings_his_tbl').doc(selectedDocumentId).update({
        Notes: newNotes
    })
    .then(() => {
        alert('Notes updated successfully.');
        notesTextarea.setAttribute('data-original-notes', newNotes); // Update original notes after successful update
    })
    .catch(error => {
        console.error('Error updating notes:', error);
        alert('Failed to update notes. Please try again.');
    });
}

