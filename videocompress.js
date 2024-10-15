// Load FFmpeg dynamically if not already loaded
if (typeof createFFmpeg === 'undefined') {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2";
    document.head.appendChild(script);

    script.onload = () => {
        console.log("FFmpeg.js loaded!");
    };
}

// Video compression function with error handling
async function videocompress(inputBlob) {
    try {
        const ffmpeg = createFFmpeg({ log: true });
        await ffmpeg.load();

        const inputFileName = 'input.webm';
        const outputFileName = 'output.mp4';

        const inputData = await fetchFile(inputBlob);
        ffmpeg.FS('writeFile', inputFileName, inputData);

        await ffmpeg.run('-i', inputFileName, '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', outputFileName);

        const outputData = ffmpeg.FS('readFile', outputFileName);
        const compressedBlob = new Blob([outputData.buffer], { type: 'video/mp4' });

        return compressedBlob;  // Return the compressed Blob
    } catch (error) {
        console.error("Error compressing video:", error);
        throw error;  // Rethrow the error for calling function to handle
    }
}

