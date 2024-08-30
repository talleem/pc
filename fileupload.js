// fileupload.js
function initiateFileUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*'; // Accept any file type
    input.onchange = handleFileSelect;
    input.click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const loggedInEmail = localstorage.getitem(loggedInEmail);

    if (!loggedInEmail) {
        alert('Please log in first.');
        return;
    }

    const db = firebase.firestore();
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`lectures/${file.name}`);

    // Upload the file to Firebase Storage
    fileRef.put(file).then(snapshot => {
        console.log('Uploaded a file!', snapshot);

        // Get the file URL
        fileRef.getDownloadURL().then(url => {
            // Create a new document in Firestore
            db.collection('meetings_his_tbl').add({
                creatorEmail: loggedInEmail,
                stopRecordingTime: firebase.firestore.Timestamp.fromDate(new Date()),
                videoURL: url
            }).then(() => {
                console.log('Document successfully written!');
                alert('File uploaded and data saved successfully.');
                // Refresh the page to see the new file
                window.location.reload();
            }).catch(error => {
                console.error('Error adding document: ', error);
                alert('Error uploading file. Please try again.');
            });
        }).catch(error => {
            console.error('Error getting file URL: ', error);
            alert('Error getting file URL. Please try again.');
        });
    }).catch(error => {
        console.error('Error uploading file: ', error);
        alert('Error uploading file. Please try again.');
    });
}

// Expose the function globally so it can be accessed from other scripts
window.initiateFileUpload = initiateFileUpload;
