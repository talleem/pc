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
            console.log("Recording completed. Splitting and uploading chunks...");
            const fullRecordingBlob = new Blob(chunks, { type: 'video/webm' });
            const chunkSize = 5 * 1024 * 1024;
            const numberOfChunks = Math.ceil(fullRecordingBlob.size / chunkSize);
            const uploadPromises = [];

            for (let i = 0; i < numberOfChunks; i++) {
                const chunkBlob = fullRecordingBlob.slice(i * chunkSize, (i + 1) * chunkSize);
               const file = new File([chunkBlob], `meeting_chunk_${Date.now()}_${i}.webm`, { type: 'video/webm' });
                const chunkMetadata = { name: file.name, mimeType: 'video/webm', parents: [folderId] };

                const formData = new FormData();
                formData.append('metadata', new Blob([JSON.stringify(chunkMetadata)], { type: 'application/json' }));
                formData.append('file', file);

                uploadPromises.push(
                    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${accessToken}` },
                        body: formData
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log("Chunk uploaded successfully:", result);
                        return result.id;
                    })
                    .catch(error => console.error("Error uploading chunk:", error))
                );
            }

            Promise.all(uploadPromises)
                .then(fileIds => {
                    console.log("All chunks uploaded successfully.");
                    newWindow.alert("All chunks uploaded to Google Drive. Starting reassembly...");
                    reassembleChunks(fileIds, accessToken, folderId, newWindow);
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

function reassembleChunks(fileIds, accessToken, folderId, newWindow) {
    const chunkPromises = fileIds.map(fileId =>
        fetch(https://www.googleapis.com/drive/v3/files/${fileId}?alt=media, {
            headers: { 'Authorization': Bearer ${accessToken} }
        })
        .then(response => response.blob())
        .catch(error => console.error("Error downloading chunk:", error))
    );

    Promise.all(chunkPromises)
        .then(chunks => {
            console.log("All chunks downloaded. Merging...");
            const mergedBlob = new Blob(chunks, { type: 'video/webm' });
            uploadMergedFile(mergedBlob, accessToken, folderId, newWindow);
        })
        .catch(error => {
            console.error("Error merging chunks:", error);
            newWindow.alert("Error merging chunks.");
        });
}

function uploadMergedFile(mergedBlob, accessToken, folderId, newWindow) {
    const mergedFileMetadata = {
        name: 'merged_video.webm',
        mimeType: 'video/webm',
        parents: [folderId]
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(mergedFileMetadata)], { type: 'application/json' }));
    formData.append('file', mergedBlob);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { 'Authorization': Bearer ${accessToken} },
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        console.log("Merged file uploaded successfully:", result);
        newWindow.alert("Merged video file uploaded to Google Drive.");
    })
    .catch(error => {
        console.error("Error uploading merged file:", error);
        newWindow.alert("Error uploading merged file.");
    });
}
