function mergeToFirestore() {
    const firestore = firebase.firestore(); // Ensure Firestore is initialized
    const table = document.getElementById('fileTable');
    const rows = table.getElementsByTagName('tr'); // Get all rows

    Array.from(rows).forEach((row, index) => {
        // Skip the header row (index 0)
        if (index === 0) return;

        // Check if the row is selected
        if (row.classList.contains('selected')) {
            const cells = row.getElementsByTagName('td');
            const fileName = cells[0].innerText;
            const creatorEmail = cells[1].innerText;
            const createdTime = new Date(cells[2].innerText);

            // Firestore collection reference
            const collectionRef = firestore.collection('meetings_his_tbl');

            // Check if the record already exists
            collectionRef.where('creatorEmail', '==', creatorEmail)
                .where('stopRecordingTime', '==', firebase.firestore.Timestamp.fromDate(createdTime))
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        // If the record doesn't exist, add it to Firestore
                        collectionRef.add({
                            creatorEmail: creatorEmail,
                            stopRecordingTime: firebase.firestore.Timestamp.fromDate(createdTime),
                            fileName: fileName,
                            // Add any additional fields as necessary
                        })
                        .then(() => {
                            console.log(`Record added: ${fileName}`);
                            alert(`Record for ${fileName} added to Firestore.`);
                        })
                        .catch(error => {
                            console.error('Error adding record to Firestore:', error);
                            alert('Error adding record to Firestore. See console for details.');
                        });
                    } else {
                        console.log(`Record already exists: ${fileName}`);
                    }
                })
                .catch(error => {
                    console.error('Error checking Firestore:', error);
                });
        }
    });
}
