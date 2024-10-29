function mergeToFirestore() {
    const firestore = firebase.firestore(); // Ensure Firestore is initialized
    const table = document.getElementById('fileTable');
    const rows = table.getElementsByTagName('tr');

    let selectedRowsExist = false;

    Array.from(rows).forEach((row, index) => {
        if (index === 0) return; // Skip header row

        if (row.classList.contains('selected')) {
            selectedRowsExist = true;
            const cells = row.getElementsByTagName('td');
            const creatorEmail = cells[1].innerText.trim();
            const createdTime = new Date(cells[2].innerText);

            const collectionRef = firestore.collection('meetings_his_tbl');

            collectionRef.where('creatorEmail', '==', creatorEmail)
                .where('stopRecordingTime', '==', firebase.firestore.Timestamp.fromDate(createdTime))
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        collectionRef.add({
                            creatorEmail: creatorEmail,
                            stopRecordingTime: firebase.firestore.Timestamp.fromDate(createdTime),
                            Notes: null,
                            videoURL: ""
                        })
                        .then(() => {
                            console.log(`Record added for creatorEmail: ${creatorEmail}`);
                            alert(`Record for ${creatorEmail} added to Firestore.`);
                        })
                        .catch(error => {
                            console.error('Error adding record to Firestore:', error);
                            alert('Error adding record to Firestore. See console for details.');
                        });
                    } else {
                        console.log(`Record already exists for creatorEmail: ${creatorEmail}`);
                        alert(`Record for ${creatorEmail} with time ${createdTime.toLocaleString()} already exists in Firestore.`);
                    }
                })
                .catch(error => {
                    console.error('Error checking Firestore:', error);
                });
        }
    });

    if (!selectedRowsExist) {
        alert("No records selected. Please select a record to merge to Firestore.");
    }
}
