import { createFFmpeg, fetchFile } from './node_modules/@ffmpeg/ffmpeg/dist/ffmpeg.min.js';
import { FFmpeg } from './node_modules/@ffmpeg/core/dist/ffmpeg-core.min.js';


// Initialize FFmpeg
const ffmpeg = createFFmpeg({ log: true });

const loadFFmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
        console.log("FFmpeg.wasm is ready to use.");
    }
};

const videocompress = async (inputBlob) => {
    await loadFFmpeg(); // Ensure FFmpeg is loaded

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
        const outputBlob = new Blob([outputData.buffer], { type: 'video/mp4' });
        return outputBlob; // Return the compressed video Blob
    } catch (error) {
        console.error("Error compressing video:", error);
        throw error; // Rethrow the error for the calling function to handle
    }
};

// Example usage
const inputFile = 'input.webm'; // Replace this with your actual input Blob
const inputBlob = await fetchFile(inputFile); // Assuming fetchFile returns a Blob

videocompress(inputBlob).then((compressedBlob) => {
    const videoUrl = URL.createObjectURL(compressedBlob);
    console.log("Compressed video URL:", videoUrl);

    // You can now use videoUrl in a <video> element
}).catch((error) => {
    console.error("Compression failed:", error);
});
