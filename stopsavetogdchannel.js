function stopsavetogdchannel(mediaRecorder, stream, loggedInEmail, newWindow) {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        stream.getTracks().forEach(track => track.stop());
        console.log("Recording stopped");

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error("Access token not found.");
            return;
        }

        const chunks = [];
        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorder.onstop = function() {
            console.log("Recording completed.");

            // Combine all chunks into one Blob
            const fullRecordingBlob = new Blob(chunks, { type: 'video/webm' });

            // Trigger a download of the recording (not saving it permanently, just offering a download)
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(fullRecordingBlob);
            downloadLink.download = `${loggedInEmail}_recording_${Date.now()}.webm`;  // Name file based on timestamp
            downloadLink.click();  // Trigger the download

            // Upload to Google Drive instead of YouTube
            uploadFullRecordingToGoogleDrive(fullRecordingBlob, accessToken, loggedInEmail, newWindow);
        };

        mediaRecorder.stop();
    } else {
        console.log("No recording is active.");
    }
}

function uploadFullRecordingToGoogleDrive(fullRecordingBlob, accessToken, loggedInEmail, newWindow) {
    // Create the metadata for the file upload
    const fileMetadata = {
        name: `${loggedInEmail}_recording_${Date.now()}.webm`, // Set file name dynamically
        mimeType: 'video/webm'
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
    formData.append('file', fullRecordingBlob);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.id) {
            console.log("File successfully uploaded to Google Drive:", result);
            newWindow.alert("Recording uploaded to Google Drive.");
        } else {
            console.error("Error uploading to Google Drive:", result);
            newWindow.alert("Error uploading to Google Drive.");
        }
    })
    .catch(error => {
        console.error("Error uploading to Google Drive:", error);
        newWindow.alert("Error uploading to Google Drive.");
    });
}
