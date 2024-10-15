// Load FFmpeg dynamically if not already loaded
if (typeof window.FFmpeg === 'undefined') {
    const script1 = document.createElement('script');
    script1.src = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.8.5";
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.9.8";
    document.head.appendChild(script2);

    script2.onload = () => {
        console.log("FFmpeg.js loaded!");
    };
}

async function videocompress(inputBlob) {
    if (typeof window.FFmpeg === 'undefined') {
        throw new Error("FFmpeg is not loaded.");
    }

    const { createFFmpeg, fetchFile } = window.FFmpeg; // Access from the FFmpeg global variable
    const ffmpeg = createFFmpeg({ log: true });
    
    try {
        await ffmpeg.load();  // Load the FFmpeg library

        const inputFileName = 'input.webm';
        const outputFileName = 'output.mp4';

        const inputData = await fetchFile(inputBlob);
        ffmpeg.FS('writeFile', inputFileName, inputData);

        // Modify the FFmpeg command to include a lower bitrate
        await ffmpeg.run('-i', inputFileName, '-vcodec', 'libx264', '-b:v', '1500k', '-crf', '28', outputFileName);

        const outputData = ffmpeg.FS('readFile', outputFileName);
        return new Blob([outputData.buffer], { type: 'video/mp4' });
    } catch (error) {
        console.error("Error compressing video:", error);
        throw error;  // Rethrow the error for the calling function to handle
    }
}
