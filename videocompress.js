// Load FFmpeg dynamically if not already loaded
if (typeof createFFmpeg === 'undefined') {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2";
    document.head.appendChild(script);

    script.onload = () => {
        console.log("FFmpeg.js loaded!");
    };
}

async function videocompress(inputBlob) {
    if (typeof createFFmpeg === 'undefined') {
        throw new Error("FFmpeg is not loaded.");
    }

    const { createFFmpeg, fetchFile } = window.FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });
    
    try {
        await ffmpeg.load();  // Load the FFmpeg library

        const inputFileName = 'input.webm';
        const outputFileName = 'output.mp4';

        const inputData = await fetchFile(inputBlob);
        ffmpeg.FS('writeFile', inputFileName, inputData);

        await ffmpeg.run('-i', inputFileName, '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', outputFileName);

        const outputData = ffmpeg.FS('readFile', outputFileName);
        return new Blob([outputData.buffer], { type: 'video/mp4' });
    } catch (error) {
        console.error("Error compressing video:", error);
        throw error;  // Rethrow the error for the calling function to handle
    }
}
