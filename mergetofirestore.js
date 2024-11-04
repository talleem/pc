function showCustomAlert() {
    document.getElementById('customAlert').style.display = 'block';
}

function hideCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
}
function mergeToFirestore() {
    const firestore = firebase.firestore(); // Ensure Firestore is initialized
    const table = document.getElementById('fileTable');
    const rows = table.getElementsByTagName('tr');
    const accessToken = localStorage.getItem('accessToken'); // Ensure correct access token is used for Google Drive

      const folderIds = [
        '13Z8vqg6TPeeP4nbvaI1nDUmY8tRfuF6a', // engineerr19832@gmail.com
        '1n7F6Dl6tGbw6lunDRDGYBNV-QThgJDer', // engineerr1983@gmail.com
        '1KpZz9gXTyoNONivjmjdhqpgWhh2WpX2O'  // translatingtobetter@gmail.com
    ];

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
                        // Add record to Firestore and retrieve its ID immediately
                        collectionRef.add({
                            creatorEmail: creatorEmail,
                            stopRecordingTime: firebase.firestore.Timestamp.fromDate(createdTime),
                            Notes: null,
                            videoURL: ""
                        })
                        .then(docRef => {
                            console.log(`Record added for creatorEmail: ${creatorEmail}`);
                            alert(`Record for ${creatorEmail} added to Firestore.`);
                             showCustomAlert(); // Show the custom alert before starting the upload

                            // Now, upload to YouTube
                            uploadVideoToYouTube(accessToken, creatorEmail, fileName, folderIds)
                                .then(youtubeVideoId => {
                                     hideCustomAlert(); // Hide the custom alert when upload finishes (success or failure)
                                    if (youtubeVideoId) {
                                        const videoURL = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
                                        
                                        // Use the newly created document's ID to update the videoURL field
                                        docRef.update({ videoURL })
                                            .then(() => {
                                                alert(`Video uploaded to YouTube successfully for ${creatorEmail} and record updated in Firestore.`);
                                               setTimeout(() => {
                                               listFiles();
                                                }, 2000); // 2000 milliseconds = 2 seconds
                                            })
                                            .catch(error => {
                                                hideCustomAlert(); // Hide on error
                                                console.error('Error updating Firestore record:', error);
                                                alert('Error updating Firestore. See console for details.');
                                            });
                                    }
                                })
                                .catch(error => {
                                     hideCustomAlert(); // Hide on error
                                    console.error('Error uploading to YouTube:', error);
                                    alert('Error uploading video to YouTube. See console for details.');
                                });
                        })
                        .catch(error => {
                             hideCustomAlert(); // Hide on error
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
function uploadVideoToYouTube(accessToken, creatorEmail, fileName, folderIds) {
    // Function to search within each folder ID
    const searchPromises = folderIds.map(folderId => 
        fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${folderId}' in parents&fields=files(id, name, owners, modifiedTime)`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(response => response.json())
    );

    // Run all search requests and process results
    return Promise.all(searchPromises)
        .then(results => {
            // Flatten results and filter non-empty file arrays
            const allFiles = results.flatMap(result => result.files || []);
            
            if (allFiles.length === 0) {
                alert(`Video file not found in any of the specified folders: ${fileName}`);
                return null;
            }

            // Find a file that matches the creator's email
            const fileFound = allFiles.find(file => 
                file.owners && file.owners.some(owner => owner.emailAddress === creatorEmail)
            );

            if (!fileFound) {
                alert(`No matching file found for creatorEmail: ${creatorEmail}`);
                return null;
            }

            const driveFileId = fileFound.id;
            const modifiedTime = new Date(fileFound.modifiedTime);
            console.log("Drive File ID:", driveFileId); // Debugging log

            const uploadUrl = `https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status`;

            // Formatting modified time for the title
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'Asia/Baghdad' // Using Baghdad timezone
            };

            const formattedModifiedTime = modifiedTime.toLocaleString('en-US', options).replace(',', ''); // Format as desired

            const metadata = {
                snippet: {
                    title: `${creatorEmail} - ${formattedModifiedTime}`, // Title includes email and modified time
                    description: `Video uploaded on behalf of ${creatorEmail}`,
                    publishedAt: modifiedTime.toISOString() // Keep publishedAt as UTC
                },
                status: {
                    privacyStatus: "public"
                }
            };

            // Fetch the video file as a blob
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
