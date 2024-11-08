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
            console.log("Recording completed. Uploading the full recording to YouTube...");

            // Combine all chunks into one Blob and upload the whole file at once
            const fullRecordingBlob = new Blob(chunks, { type: 'video/webm' });
            uploadFullRecordingToYouTube(fullRecordingBlob, accessToken, loggedInEmail, newWindow);
        };

        mediaRecorder.stop();
    } else {
        console.log("No recording is active.");
    }
}

function uploadFullRecordingToYouTube(fullRecordingBlob, accessToken, loggedInEmail, newWindow) {
    // Format the title with the creator's email and the current date-time
    const now = new Date();
    const createTime = now.toLocaleString('en-US', { hour12: false }); // Get date-time without AM/PM
    const title = `${loggedInEmail} - ${createTime}`;

    const fileMetadata = {
        snippet: {
            title: title,
            description: 'Recording uploaded from application',
            tags: ['recording', 'webm', 'upload'],
            categoryId: '22' // "People & Blogs" category as an example
        },
        status: {
            privacyStatus: 'public' // Set video to public
        }
    };

    const formData = new FormData();
    formData.append('part', 'snippet,status');
    formData.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
    formData.append('file', fullRecordingBlob);

    fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.id) {
            console.log("Full recording uploaded successfully to YouTube:", result);
            newWindow.alert("Recording uploaded to YouTube.");
        } else {
            console.error("Error uploading to YouTube:", result);
            newWindow.alert("Error uploading to YouTube.");
        }
    })
    .catch(error => {
        console.error("Error uploading to YouTube:", error);
        newWindow.alert("Error uploading to YouTube.");
    });
}
