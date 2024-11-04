function stopsavetogdchannel(mediaRecorder, stream, loggedInEmail, newWindow) {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        console.log("Recording stopped");

        const chunks = [];
        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorder.onstop = function() {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const file = new File([blob], `meeting_recording_${new Date().getTime()}.webm`, { type: 'video/webm' });
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                console.error("Access token not found.");
                return;
            }

            const folderId = '1n7F6Dl6tGbw6lunDRDGYBNV-QThgJDer'; // Your folder ID

            const metadata = {
                name: file.name,
                mimeType: 'video/webm',
                parents: [folderId]
            };

            const formData = new FormData();
            formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            formData.append('file', file);

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
                console.log("File uploaded successfully to Google Drive:", result);
                newWindow.alert("Recording saved to Google Drive in the 'meeting_videos' folder.");
            })
            .catch(error => {
                console.error("Error during file upload:", error);
                newWindow.alert("Error during file upload.");
            });
        };
    } else {
        console.log("No recording is active.");
    }
}
