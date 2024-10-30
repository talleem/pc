function mergeToFirestore() {
    const firestore = firebase.firestore(); // Ensure Firestore is initialized
    const table = document.getElementById('fileTable');
    const rows = table.getElementsByTagName('tr');
    const accessToken = localStorage.getItem('accessToken'); // Ensure correct access token is used for Google Drive

    let selectedRowsExist = false;

    Array.from(rows).forEach((row, index) => {
        if (index === 0) return; // Skip header row

        if (row.classList.contains('selected')) {
            selectedRowsExist = true;
            const cells = row.getElementsByTagName('td');
            const creatorEmail = cells[1].innerText.trim();
            const createdTime = new Date(cells[2].innerText);
            const fileName = cells[0].innerText.trim();

            const collectionRef = firestore.collection('meetings_his_tbl');

            collectionRef.where('creatorEmail', '==', creatorEmail)
                .where('stopRecordingTime', '==', firebase.firestore.Timestamp.fromDate(createdTime))
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        // Add record to Firestore
                        collectionRef.add({
                            creatorEmail: creatorEmail,
                            stopRecordingTime: firebase.firestore.Timestamp.fromDate(createdTime),
                            Notes: null,
                            videoURL: ""
                        })
                        .then(() => {
                            console.log(`Record added for creatorEmail: ${creatorEmail}`);
                            alert(`Record for ${creatorEmail} added to Firestore.`);

                            // Now, upload to YouTube
                            uploadVideoToYouTube(accessToken, creatorEmail, createdTime, fileName)
                                .then(youtubeVideoId => {
                                    if (youtubeVideoId) {
                                        const videoURL = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
                                        collectionRef.doc(querySnapshot.docs[0].id).update({ videoURL })
                                            .then(() => {
                                                alert(`Video uploaded to YouTube successfully for ${creatorEmail} and record updated in Firestore.`);
                                                listFiles();
                                            })
                                            .catch(error => console.error('Error updating Firestore record:', error));
                                    }
                                })
                                .catch(error => {
                                    console.error('Error uploading to YouTube:', error);
                                    alert('Error uploading video to YouTube. See console for details.');
                                });
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

// Function to upload video from Google Drive to YouTube without async syntax
function uploadVideoToYouTube(accessToken, creatorEmail, createdTime, fileName) {
    return fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}'&fields=files(id)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(driveFile => {
        if (!driveFile.files || driveFile.files.length === 0) {
            alert(`Video file not found in Google Drive: ${fileName}`);
            return null;
        }

        const driveFileId = driveFile.files[0].id;
        console.log("Drive File ID:", driveFileId); // Debugging log
        const uploadUrl = `https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status`;
        const metadata = {
            snippet: {
                title: creatorEmail,
                description: `Video uploaded on behalf of ${creatorEmail}`,
                publishedAt: createdTime.toISOString()
            },
            status: {
                privacyStatus: "private"
            }
        };

        return fetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(response => response.blob())
        .then(fileBlob => {
            const formData = new FormData();
            formData.append('data', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            formData.append('file', fileBlob);

            return fetch(uploadUrl, {
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` },
                body: formData
            });
        })
        .then(youtubeResponse => youtubeResponse.json())
        .then(youtubeResponse => {
            if (youtubeResponse.id) {
                console.log("YouTube Video ID:", youtubeResponse.id); // Debugging log
                return youtubeResponse.id; // Return YouTube video ID
            } else {
                console.error('YouTube upload failed:', youtubeResponse); // Log entire response
                alert('Failed to upload to YouTube. See console for details.');
                return null; // Return null to indicate failure
            }
        });
    })
    .catch(error => {
        console.error('Error during YouTube upload:', error);
        alert('YouTube upload encountered an error. Check console for details.');
        return null; // Return null to prevent further errors
    });
}
