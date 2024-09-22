// Function to open Instagram reel in a new window
function openInstaVideoInNewWindow(event) {
    console.log('Mouse entered the Instagram container.');

    // Prevent default behavior
    event.preventDefault();

    // Find the blockquote element inside the current container
    const blockquoteElement = this.querySelector('blockquote[data-instgrm-permalink]');
    
    if (blockquoteElement) {
        // Get the permalink attribute (Instagram URL)
        const videoUrl = blockquoteElement.getAttribute('data-instgrm-permalink');

        console.log('Found video URL:', videoUrl);

        if (videoUrl) {
            // Open the video URL in a new window
            const newWindowWidth = 800; // Adjust width here
            const newWindowHeight = 600; // Adjust height here
            
            window.open(videoUrl, '_blank', `width=${newWindowWidth},height=${newWindowHeight}`);
            console.log('Opened video in new window.');
        } else {
            console.error('No valid URL found in the container.');
        }
    } else {
        console.error('No blockquote with data-instgrm-permalink found in the container.');
    }
}

// Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed.');

    // Attach the event listener to all Instagram containers
    document.querySelectorAll('.instagram-container').forEach(container => {
        console.log('Attaching event listener to container:', container);
        container.addEventListener('mouseenter', openInstaVideoInNewWindow); // Changed to mouseenter
    });
});
