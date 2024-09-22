document.addEventListener('DOMContentLoaded', function() {
    // Function to handle mouse enter event
    function openInstaVideoInNewWindow(event) {
        console.log("Mouse entered!");

        // Get the iframe element within the hovered container
        const iframeElement = event.currentTarget.querySelector('iframe');
        
        if (iframeElement) {
            console.log("Iframe found:", iframeElement);
            console.log("Iframe src:", iframeElement.src); // Might not work due to cross-origin restrictions
        } else {
            console.log("No iframe found in the container.");
        }

        // Check if we can access the iframe's src attribute
        const videoUrl = iframeElement ? iframeElement.src : null;

        if (videoUrl) {
            const windowWidth = 560; // Slightly bigger than usual Instagram width
            const windowHeight = 700; // Adjust height accordingly
            console.log("Opening window with URL:", videoUrl);
            window.open(videoUrl, '_blank', `width=${windowWidth},height=${windowHeight},scrollbars=no`);
        } else {
            console.log("No valid URL found in the iframe.");
        }
    }

    // Attach the event listener to all Instagram containers
    document.querySelectorAll('.instagram-container').forEach(container => {
        container.addEventListener('mouseenter', openInstaVideoInNewWindow);
    });
});
