function listFiles() {
    const accessToken = localStorage.getItem('accessToken');
    const folderId = '1n7F6Dl6tGbw6lunDRDGYBNV-QThgJDer'; // Replace with actual folder ID
    const firestore = firebase.firestore(); // Ensure Firestore is initialized

    fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(name, owners(displayName, emailAddress), createdTime)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('fileTable');
        table.innerHTML = '<tr><th>File Name</th><th>Owner Email</th><th>Date</th><th>Exists in Firestore</th></tr>';

        data.files.forEach(file => {
            const createdTime = new Date(file.createdTime).toLocaleString();
            const row = document.createElement('tr');

            // Apply selection styling to the row when clicked
            row.addEventListener('click', (event) => {
                // Prevent selection only if clicking on the row, not on a specific link or button
                if (!event.target.closest('a, button')) {
                    row.classList.toggle('selected');
                    row.style.backgroundColor = row.classList.contains('selected') ? 'yellow' : ''; // Toggle yellow color on selection
                }
            });

            const emailAddress = file.owners[0].emailAddress || 'N/A';
            row.innerHTML = `
                <td>${file.name}</td>
                <td>${emailAddress}</td>
                <td>${createdTime}</td>
                <td id="status-${file.name}">Checking...</td>
            `;
            table.appendChild(row);

            // Firestore check using the email address
            if (emailAddress !== 'N/A') {
                firestore.collection('meeting_his_tbl')
                    .where('creatorEmail', '==', emailAddress)
                    .where('stopRecordingTime', '==', file.createdTime)
                    .get()
                    .then(querySnapshot => {
                        const statusCell = document.getElementById(`status-${file.name}`);
                        if (!querySnapshot.empty) {
                            statusCell.textContent = 'Yes';
                        } else {
                            statusCell.textContent = 'No';
                            // Initial yellow background for non-existing records (overwritten on selection)
                            row.style.backgroundColor = 'yellow';
                        }
                    })
                    .catch(error => console.error('Error checking Firestore:', error));
            } else {
                console.warn(`No email address found for file owner of ${file.name}`);
            }
        });
    })
    .catch(error => console.error('Error fetching files:', error));
}

document.addEventListener('DOMContentLoaded', listFiles);
