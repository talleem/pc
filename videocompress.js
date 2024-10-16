import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@latest/dist/ffmpeg.min.js';

// Initialize FFmpeg
const ffmpeg = createFFmpeg({ log: true });

async function videocompress(inputBlob) {
    // Load the FFmpeg library if it is not already loaded
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    const inputFileName = 'input.webm';
    const outputFileName = 'output.mp4';

    try {
        // Write the input Blob to FFmpeg's virtual file system
        ffmpeg.FS('writeFile', inputFileName, await fetchFile(inputBlob));

        // Run the FFmpeg command for compression
        await ffmpeg.run('-i', inputFileName, '-vcodec', 'libx264', '-b:v', '1500k', '-crf', '28', outputFileName);

        // Read the output file
        const outputData = ffmpeg.FS('readFile', outputFileName);

        // Convert the output to a Blob
        return new Blob([outputData.buffer], { type: 'video/mp4' });
    } catch (error) {
        console.error("Error compressing video:", error);
        throw error;  // Rethrow the error for the calling function to handle
    }
}
