function stopsavetogdchannel(mediaRecorder, stream, loggedInEmail, newWindow) {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        stream.getTracks().forEach(track => track.stop());
        console.log("Recording stopped");

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error("Access token not found.");
            return;
        }

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

        const chunks = [];
        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorder.onstop = function() {
            console.log("Recording completed. Uploading the full recording...");

            // Combine all chunks into one Blob and upload the whole file at once
            const fullRecordingBlob = new Blob(chunks, { type: 'video/webm' });
            uploadFullRecording(fullRecordingBlob, accessToken, folderId, newWindow);
        };

        mediaRecorder.stop();
    } else {
        console.log("No recording is active.");
    }
}

function uploadFullRecording(fullRecordingBlob, accessToken, folderId, newWindow) {
    const fileMetadata = {
        name: `recording_${Date.now()}.webm`,
        mimeType: 'video/webm',
        parents: [folderId]
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
    formData.append('file', fullRecordingBlob);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        console.log("Full recording uploaded successfully:", result);
        newWindow.alert("Recording uploaded to Google Drive.");
    })
    .catch(error => {
        console.error("Error uploading full recording:", error);
        newWindow.alert("Error uploading recording.");
    });
}
