// videocompress.js

function videocompress(blob) {
    return new Promise((resolve, reject) => {
        const ffmpeg = createFFmpeg({ log: true });
        
        ffmpeg.load()
            .then(() => {
                // Read the input video (blob) and write it to FFmpeg's virtual file system
                const inputFileName = 'input.webm';
                const outputFileName = 'output.mp4';

                const reader = new FileReader();
                reader.onload = function() {
                    const uint8Array = new Uint8Array(reader.result);
                    ffmpeg.FS('writeFile', inputFileName, uint8Array);

                    // Run FFmpeg command to convert and compress the video
                    ffmpeg.run('-i', inputFileName, '-vcodec', 'libx264', '-crf', '23', '-preset', 'medium', outputFileName)
                        .then(() => {
                            // Read the compressed output file from FFmpeg's virtual file system
                            const output = ffmpeg.FS('readFile', outputFileName);

                            // Convert the compressed file back to a Blob
                            const compressedBlob = new Blob([output.buffer], { type: 'video/mp4' });

                            // Resolve the Promise with the compressed video blob
                            resolve(compressedBlob);
                        })
                        .catch(error => reject(error));
                };

                reader.onerror = (error) => reject(error);
                reader.readAsArrayBuffer(blob);  // Convert the input blob to an ArrayBuffer
            })
            .catch(error => reject(error));
    });
}

