// Function to open Instagram reel in a new window
function openInstaVideoInNewWindow(event) {
    // Prevent default behavior
    event.preventDefault();

    // Find the <a> element inside the blockquote
    const linkElement = this.querySelector('a[href]');
    
    if (linkElement) {
        // Get the href attribute (Instagram URL)
        const videoUrl = linkElement.href;
        
        if (videoUrl) {
            // Open the video URL in a new window, slightly larger than the video container
            const newWindowWidth = 800; // You can adjust the width here
            const newWindowHeight = 600; // You can adjust the height here
            
            window.open(videoUrl, '_blank', `width=${newWindowWidth},height=${newWindowHeight}`);
        } else {
            console.error('No valid URL found in the container.');
        }
    }
}

// Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Attach the event listener to all Instagram containers
    document.querySelectorAll('.instagram-container').forEach(container => {
        container.addEventListener('dblclick', openInstaVideoInNewWindow);
    });
});
