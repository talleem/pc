// instavideo.js

// Function to handle double-click event
function openInstaVideoInNewWindow(event) {
    // Get the link of the Instagram video from the clicked container
    const linkElement = event.currentTarget.querySelector('a');
    const videoUrl = linkElement ? linkElement.href : null;

    if (videoUrl) {
        // Open a new window with the Instagram video
        const windowWidth = 560; // Slightly bigger than the usual Instagram width (540px)
        const windowHeight = 700; // Adjust height accordingly
        
        // Open new window
        window.open(videoUrl, '_blank', `width=${windowWidth},height=${windowHeight},scrollbars=no`);
    }
}

// Attach the event listener to all Instagram containers
document.querySelectorAll('.instagram-container').forEach(container => {
    container.addEventListener('dblclick', openInstaVideoInNewWindow);
});
