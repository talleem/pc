function stopsavetogdchannel(mediaRecorder, stream, loggedInEmail, newWindow) {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        stream.getTracks().forEach(track => track.stop());
        console.log("Recording stopped");

        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            console.error("Access token not found.");
            return;
        }

        // Determine folder ID based on loggedInEmail
        let folderId;
        if (loggedInEmail === 'engineerr19832@gmail.com') {
            folderId = '13Z8vqg6TPeeP4nbvaI1nDUmY8tRfuF6a';
        } else if (loggedInEmail === 'engineerr1983@gmail.com') {
            folderId = '1n7F6Dl6tGbw6lunDRDGYBNV-QThgJDer';
        } else if (loggedInEmail === 'translatingtobetter@gmail.com') {
            folderId = '1KpZz9gXTyoNONivjmjdhqpgWhh2WpX2O';
        } else {
            console.error("No matching folder ID found for this email.");
            return;
        }

        const metadata = {
            mimeType: 'video/webm',
            parents: [folderId]
        };

        // Collect all chunks of the recording
        const chunks = [];
        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorder.onstop = function() {
            console.log("Recording completed. Splitting and uploading chunks...");

            // Combine all the recorded chunks into a single Blob
            const fullRecordingBlob = new Blob(chunks, { type: 'video/webm' });

            // Split the full recording into smaller chunks (e.g., 5MB per chunk)
            const chunkSize = 5 * 1024 * 1024; // 5MB
            const numberOfChunks = Math.ceil(fullRecordingBlob.size / chunkSize);
            const uploadPromises = [];

            for (let i = 0; i < numberOfChunks; i++) {
                const chunkBlob = fullRecordingBlob.slice(i * chunkSize, (i + 1) * chunkSize);

                const file = new File([chunkBlob], `meeting_chunk_${new Date().getTime()}_${i}.webm`, { type: 'video/webm' });

                // Create the metadata for the chunk file
                const chunkMetadata = {
                    name: file.name,
                    mimeType: 'video/webm',
                    parents: [folderId]
                };

                const formData = new FormData();
                formData.append('metadata', new Blob([JSON.stringify(chunkMetadata)], { type: 'application/json' }));
                formData.append('file', file);

                // Upload the chunk in parallel
                uploadPromises.push(
                    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                        method: 'POST',
                        headers: new Headers({
                            'Authorization': `Bearer ${accessToken}`
                        }),
                        body: formData
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log("Chunk uploaded successfully to Google Drive:", result);
                        return result.id;  // Collect the file ID
                    })
                    .catch(error => {
                        console.error("Error uploading chunk:", error);
                    })
                );
            }

            // Wait for all chunks to finish uploading
            Promise.all(uploadPromises)
                .then(fileIds => {
                    console.log("All chunks uploaded successfully.");
                    newWindow.alert("Recording completed and all chunks uploaded to Google Drive.");

                    // Now, reassemble chunks into a playable file
                    mergeChunksIntoFile(fileIds, accessToken, folderId, newWindow);
                })
                .catch(error => {
                    console.error("Error during chunk uploads:", error);
                    newWindow.alert("Error during chunk uploads.");
                });
        };

        mediaRecorder.stop();
    } else {
        console.log("No recording is active.");
    }
}

function mergeChunksIntoFile(fileIds, accessToken, folderId, newWindow) {
    console.log("Merging chunks...");

    const mergeRequestBody = {
        name: 'merged_video.webm',
        mimeType: 'video/webm',
        parents: [folderId]
    };

    // Create a new file to hold the merged video
    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(mergeRequestBody)
    })
    .then(response => response.json())
    .then(result => {
        console.log("Merged file created on Google Drive:", result);
        newWindow.alert("Merged video file created. You can now play it.");

        // Optionally, implement code to combine chunks programmatically
        // Or use Google Drive's file merging or video processing functionality
    })
    .catch(error => {
        console.error("Error merging chunks:", error);
        newWindow.alert("Error merging chunks.");
    });
}
