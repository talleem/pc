function listFiles() {
    const accessToken = localStorage.getItem('accessToken');
    const folderId = '1n7F6Dl6tGbw6lunDRDGYBNV-QThgJDer'; // Replace with actual folder ID
    const firestore = firebase.firestore(); // Ensure Firestore is initialized
    const youtubeChannelId = 'UCJOvVz-e14vUFpSo37O8VPw';

    // Fetch files from Google Drive
    fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(name, owners(displayName, emailAddress), createdTime)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('fileTable');
        table.innerHTML = '<tr><th>File Name</th><th>Owner Email</th><th>Date</th><th>Exists in Firestore</th><th>Exists in YouTube Channel</th></tr>'; // Added new header
        
        let lastSelectedRow = null; // Keep track of the last selected row

        data.files.forEach(file => {
            const createdTime = new Date(file.createdTime);
            const createdTimeString = createdTime.toLocaleString(); // String for display
            const row = document.createElement('tr');

            // Apply selection styling to the row when clicked
            row.addEventListener('click', (event) => {
                if (!event.target.closest('a, button')) {
                    // Deselect the last selected row
                    if (lastSelectedRow && lastSelectedRow !== row) {
                        // Reset background color based on existence in Firestore
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
                <td id="youtube-status-${file.name}">Checking...</td> <!-- New cell for YouTube status -->
            `;
            table.appendChild(row);

            // Firestore check using the email address
            if (emailAddress !== 'N/A') {
                const statusCell = document.getElementById(`status-${file.name}`);
                const youtubeStatusCell = document.getElementById(`youtube-status-${file.name}`);
                
                // Delay Firestore check until the row is added to the table
                setTimeout(() => {
                    const createdTimeFromTable = new Date(createdTimeString); // Get date from displayed string
                    const createdTimestamp = firebase.firestore.Timestamp.fromDate(createdTimeFromTable); // Convert to Firestore Timestamp

                    console.log(`Checking Firestore for: Email - ${emailAddress}, Time - ${createdTimeFromTable}`);
                    firestore.collection('meetings_his_tbl')
                        .where('creatorEmail', '==', emailAddress)
                        .where('stopRecordingTime', '==', createdTimestamp) // Use converted Firestore Timestamp
                        .get()
                        .then(querySnapshot => {
                            console.log(`Query snapshot empty: ${querySnapshot.empty}`);

                            if (!querySnapshot.empty) {
                                statusCell.textContent = 'Yes';
                                row.style.backgroundColor = 'aqua'; // Exists in Firestore
                                row.dataset.existsInFirestore = 'true';
                            } else {
                                statusCell.textContent = 'No';
                                row.dataset.existsInFirestore = 'false';
                            }

                            // YouTube check logic
                            checkYouTubeVideo(youtubeChannelId, emailAddress, createdTimeString, youtubeStatusCell, row);
                        })
                        .catch(error => console.error('Error checking Firestore:', error));
                }, 0); // Ensures Firestore check happens after table is populated
            } else {
                console.warn(`No email address found for file owner of ${file.name}`);
            }
        });
    })
    .catch(error => console.error('Error fetching files:', error));
}

// Function to check video existence in YouTube
function checkYouTubeVideo(channelId, creatorEmail, createdTimeString, youtubeStatusCell, row) {
    const youtubeAccessToken = localStorage.getItem('youtubeAccessToken');
    const publishedDate = new Date(createdTimeString).toISOString();

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&q=${creatorEmail}&type=video&maxResults=10`, {
        headers: { Authorization: `Bearer ${youtubeAccessToken}` }
    })
    .then(response => response.json())
    .then(data => {
        const foundVideo = data.items.some(item => {
            const videoTitleContainsEmail = item.snippet.title.includes(creatorEmail);
            const videoPublishedAt = item.snippet.publishedAt;
            return videoTitleContainsEmail && videoPublishedAt === publishedDate;
        });

        if (foundVideo) {
            youtubeStatusCell.textContent = 'Yes';
            row.style.backgroundColor = row.dataset.existsInFirestore === 'true' ? 'aqua' : 'yellow';
        } else {
            youtubeStatusCell.textContent = 'No';
            if (row.dataset.existsInFirestore === 'false') {
                row.style.backgroundColor = 'yellow';
            }
        }
    })
    .catch(error => {
        console.error('Error checking YouTube:', error);
        youtubeStatusCell.textContent = 'Error';
    });
}

document.addEventListener('DOMContentLoaded', listFiles);
