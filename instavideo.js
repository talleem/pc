document.addEventListener('DOMContentLoaded', function() {
    console.log(document.querySelectorAll('.instagram-container')); // Log to check
    // Function to handle mouse enter event
    function openInstaVideoInNewWindow(event) {
         console.log("Mouse entered!"); // Check if this message logs
        // Get the link of the Instagram video from the hovered container
        const linkElement = event.currentTarget.querySelector('a');
        const videoUrl = linkElement ? linkElement.href : null;

        if (videoUrl) {
            // Open a new window with the Instagram video
            const windowWidth = 560; // Slightly bigger than the usual Instagram width (540px)
            const windowHeight = 700; // Adjust height accordingly
            
            // Open new window
             console.log("Opening window with URL:", videoUrl); // Check if videoUrl is valid
            window.open(videoUrl, '_blank', `width=${windowWidth},height=${windowHeight},scrollbars=no`);
        }
        else {
             console.log("No valid URL found in the container.");
        }
    }

    // Attach the event listener to all Instagram containers
    document.querySelectorAll('.instagram-container').forEach(container => {
        container.addEventListener('mouseenter', openInstaVideoInNewWindow);
    });
});
