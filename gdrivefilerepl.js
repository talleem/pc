function listFiles() {
    const accessToken = localStorage.getItem('accessToken');
    const folderId = '1n7F6Dl6tGbw6lunDRDGYBNV-QThgJDer'; // Replace with actual folder ID
    const firestore = firebase.firestore(); // Assuming Firebase is already initialized

    fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(name, owners(displayName), createdTime)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('fileTable');
        table.innerHTML = '<tr><th>File Name</th><th>Owner</th><th>Date</th><th>Exists in Firestore</th></tr>';

        data.files.forEach(file => {
            const createdTime = new Date(file.createdTime).toLocaleString();
            const row = document.createElement('tr');

            // Add a click event to select the row
            row.addEventListener('click', () => {
                row.classList.toggle('selected'); // Toggle the selected class on click
            });

            row.innerHTML = `
                <td>${file.name}</td>
                <td>${file.owners[0].displayName}</td>
                <td>${createdTime}</td>
                <td id="status-${file.name}">Checking...</td>
            `;
            table.appendChild(row);

            // Check if the record exists in Firestore
            firestore.collection('meeting_his_tbl')
                .where('creatorEmail', '==', file.owners[0].displayName)
                .where('stopRecordingTime', '==', file.createdTime)
                .get()
                .then(querySnapshot => {
                    const statusCell = document.getElementById(`status-${file.name}`);
                    if (!querySnapshot.empty) {
                        statusCell.textContent = 'Yes';
                    } else {
                        statusCell.textContent = 'No';
                        // Change the background color of the entire row to yellow
                        row.style.backgroundColor = 'yellow';
                    }
                })
                .catch(error => console.error('Error checking Firestore:', error));
        });
    })
    .catch(error => console.error('Error fetching files:', error));
}

document.addEventListener('DOMContentLoaded', listFiles);
