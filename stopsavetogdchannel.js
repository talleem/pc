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
            name: `meeting_recording_${new Date().getTime()}.webm`,
            mimeType: 'video/webm',
            parents: [folderId]
        };

        // Create FormData to upload chunks
        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

        // This will be used for appending chunks in real-time
        let isUploading = false;

        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0 && !isUploading) {
                const chunkBlob = new Blob([event.data], { type: 'video/webm' });
                const file = new File([chunkBlob], `meeting_chunk_${new Date().getTime()}.webm`, { type: 'video/webm' });

                // Append the current chunk to the formData
                formData.append('file', file);
                console.log(`Appending chunk to FormData: ${file.name}`);

                isUploading = true;  // Block other uploads until the current one finishes

                // Upload the current chunk to Google Drive
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
                    isUploading = false; // Allow the next chunk to be uploaded
                })
                .catch(error => {
                    console.error("Error uploading chunk:", error);
                    isUploading = false; // Allow the next chunk to be uploaded even on failure
                });
            }
        };

        mediaRecorder.onstop = function() {
            console.log("Recording completed. All chunks should be uploaded during the recording.");
            // Optionally, alert that the recording process is complete, but uploads are ongoing.
            newWindow.alert("Recording completed. Chunks are being uploaded to Google Drive.");
        };

        mediaRecorder.start(500);  // Record in 500ms intervals (or adjust as needed)
    } else {
        console.log("No recording is active.");
    }
}
