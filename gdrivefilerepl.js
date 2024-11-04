// Function to populate table and check existence in Firestore
function listFiles() {
    const accessToken = localStorage.getItem('accessToken');
    const folderIds = [
        '13Z8vqg6TPeeP4nbvaI1nDUmY8tRfuF6a', // engineerr19832@gmail.com
        '1n7F6Dl6tGbw6lunDRDGYBNV-QThgJDer', // engineerr1983@gmail.com
        '1KpZz9gXTyoNONivjmjdhqpgWhh2WpX2O'  // translatingtobetter@gmail.com
    ];
    const firestore = firebase.firestore(); // Ensure Firestore is initialized
    const table = document.getElementById('fileTable');
    table.innerHTML = '<tr><th>File Name</th><th>Owner Email</th><th>Date</th><th>Exists in Firestore</th></tr>';

    let lastSelectedRow = null; // Keep track of the last selected row

    // Loop through each folder ID and fetch its contents
    folderIds.forEach(folderId => {
        fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(name, owners(displayName, emailAddress), createdTime)`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(response => response.json())
        .then(data => {
            data.files.forEach(file => {
                const createdTime = new Date(file.createdTime);
                const createdTimeString = createdTime.toLocaleString(); // String for display
                const row = document.createElement('tr');

                // Apply selection styling to the row when clicked
                row.addEventListener('click', (event) => {
                    if (!event.target.closest('a, button')) {
                        // Deselect the last selected row
                        if (lastSelectedRow && lastSelectedRow !== row) {
                            if (lastSelectedRow.dataset.existsInFirestore === 'true') {
                                lastSelectedRow.style.backgroundColor = 'aqua'; // Exists in Firestore
                            } else {
                                lastSelectedRow.style.backgroundColor = 'yellow'; // Does not exist in Firestore
                            }
                            lastSelectedRow.classList.remove('selected');
                        }

                        // Set the background color of the current row to light gray
                        row.style.backgroundColor = 'lightgray';
                        row.classList.add('selected');
                        
                        // Update the last selected row reference
                        lastSelectedRow = row;
                    }
                });

                const emailAddress = file.owners[0].emailAddress || 'N/A';
                row.innerHTML = `
                    <td>${file.name}</td>
                    <td>${emailAddress}</td>
                    <td>${createdTimeString}</td>
                    <td id="status-${file.name}">Checking...</td>
                `;
                table.appendChild(row);

                // Firestore check using the email address
                if (emailAddress !== 'N/A') {
                    const statusCell = document.getElementById(`status-${file.name}`);
                    
                    setTimeout(() => {
                        const createdTimeFromTable = new Date(createdTimeString);
                        const createdTimestamp = firebase.firestore.Timestamp.fromDate(createdTimeFromTable);

                        firestore.collection('meetings_his_tbl')
                            .where('creatorEmail', '==', emailAddress)
                            .where('stopRecordingTime', '==', createdTimestamp)
                            .get()
                            .then(querySnapshot => {
                                if (!querySnapshot.empty) {
                                    statusCell.textContent = 'Yes';
                                    row.style.backgroundColor = 'aqua';
                                    row.dataset.existsInFirestore = 'true';
                                } else {
                                    statusCell.textContent = 'No';
                                    row.dataset.existsInFirestore = 'false';
                                    row.style.backgroundColor = 'yellow';
                                }

                                // Check and remove rows with 'Yes' status after checking Firestore
                                if (statusCell.textContent === 'Yes') {
                                    row.remove();
                                }
                            })
                            .catch(error => console.error('Error checking Firestore:', error));
                    }, 0);
                } else {
                    console.warn(`No email address found for file owner of ${file.name}`);
                }
            });
        })
        .catch(error => console.error('Error fetching files:', error));
    });
}

document.addEventListener('DOMContentLoaded', listFiles);
