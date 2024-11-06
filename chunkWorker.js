// chunkWorker.js

self.onmessage = function(event) {
    const { fullRecordingBlob, chunkSize } = event.data;
    const numberOfChunks = Math.ceil(fullRecordingBlob.size / chunkSize);
    const chunks = [];

    for (let i = 0; i < numberOfChunks; i++) {
        const chunkBlob = fullRecordingBlob.slice(i * chunkSize, (i + 1) * chunkSize);
        chunks.push(chunkBlob);
    }

    self.postMessage(chunks);
};
