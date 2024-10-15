// videocompress.js

const { createFFmpeg, fetchFile } = FFmpeg;  // Ensure FFmpeg is available

async function videocompress(blob) {
    try {
        const ffmpeg = createFFmpeg({ log: true });
        await ffmpeg.load(); // Load the FFmpeg library

        // Set input and output file names
        const inputFileName = 'input.webm';
        const outputFileName = 'output.mp4';

        // Fetch the input Blob and write it to FFmpeg's virtual file system
        const inputData = await fetchFile(blob);
        ffmpeg.FS('writeFile', inputFileName, inputData);

        // Run FFmpeg command to convert the video format from WebM to MP4 with compression
        await ffmpeg.run('-i', inputFileName, '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', outputFileName);

        // Read the compressed video from FFmpeg's virtual file system
        const outputData = ffmpeg.FS('readFile', outputFileName);

        // Convert the output video file to a Blob for further use
        const compressedBlob = new Blob([outputData.buffer], { type: 'video/mp4' });

        return compressedBlob;  // Return the compressed Blob
    } catch (error) {
        console.error("Error compressing video:", error);
        throw error;  // Rethrow the error so that it can be caught by the calling function
    }
}
