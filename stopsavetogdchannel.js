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

        let pendingUploads = 0;  // Track number of uploads
        let completedUploads = 0;  // Track number of completed uploads

        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                const blob = new Blob([event.data], { type: 'video/webm' });
                const file = new File([blob], `meeting_chunk_${new Date().getTime()}.webm`, { type: 'video/webm' });

                const metadata = {
                    name: file.name,
                    mimeType: 'video/webm',
                    parents: [folderId]
                };

                const formData = new FormData();
                formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                formData.append('file', file);

                // Increment pending uploads counter
                pendingUploads++;

                // Upload the chunk to Google Drive
                fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': `Bearer ${accessToken}`
                    }),
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Error uploading file to Google Drive: " + response.statusText);
                    }
                })
                .then(result => {
                    console.log("Chunk uploaded successfully to Google Drive:", result);
                    
                    // Increment completed uploads counter
                    completedUploads++;

                    // Check if all uploads are completed
                    if (completedUploads === pendingUploads) {
                        newWindow.alert("All chunks have been successfully uploaded to Google Drive.");
                    }
                })
                .catch(error => {
                    console.error("Error during chunk upload:", error);
                });
            }
        };

        mediaRecorder.onstop = function() {
            console.log("Recording completed. Awaiting chunk uploads...");
        };

        mediaRecorder.start(500);  // Record in 500ms intervals (or adjust as needed)
    } else {
        console.log("No recording is active.");
    }
}
