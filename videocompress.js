// Load FFmpeg dynamically if not already loaded
if (typeof createFFmpeg === 'undefined') {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2";
    document.head.appendChild(script);

    script.onload = () => {
        console.log("FFmpeg.js loaded!");
        // Now call your function or any other initialization that depends on FFmpeg being loaded
    };
}

// Your video compression function here
async function videocompress(inputBlob) {
    if (typeof createFFmpeg === 'undefined') {
        throw new Error("FFmpeg is not loaded.");
    }

    const { createFFmpeg, fetchFile } = window.FFmpeg;  // Ensure you access FFmpeg correctly
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();  // Load the FFmpeg library

    const inputFileName = 'input.webm';
    const outputFileName = 'output.mp4';

    try {
        const inputData = await fetchFile(inputBlob);
        ffmpeg.FS('writeFile', inputFileName, inputData);

        await ffmpeg.run('-i', inputFileName, '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', outputFileName);

        const outputData = ffmpeg.FS('readFile', outputFileName);
        const compressedBlob = new Blob([outputData.buffer], { type: 'video/mp4' });

        return compressedBlob;  // Return the compressed Blob
    } catch (error) {
        console.error("Error compressing video:", error);
        throw error;  // Rethrow the error for the calling function to handle
    }
}
