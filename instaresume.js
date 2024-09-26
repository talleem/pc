// Function to handle mouse enter and scale the divs
function handleMouseEnter() {
    const containers = document.querySelectorAll('.instagram-container');
    
    containers.forEach(container => {
        if (container !== this) {
            // Scale down the other containers to 1/6 of their original size
            container.style.transform = 'scale(0.1667)'; // 1/6
            container.style.transition = 'transform 0.3s'; // Smooth transition
        } else {
            // Restore the size of the hovered container
            container.style.transform = 'scale(2)'; // Original size
            container.style.transition = 'transform 0.3s'; // Smooth transition
        }
    });
}

// Function to reset all containers on mouse leave
function handleMouseLeave() {
    const containers = document.querySelectorAll('.instagram-container');
    
    containers.forEach(container => {
        // Reset all containers to their original size
        container.style.transform = 'scale(0.70)'; // Reset to scaled size
        container.style.transition = 'transform 0.3s'; // Smooth transition
    });
}

// Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed.');

    // Attach the event listener to all Instagram containers
    document.querySelectorAll('.instagram-container').forEach(container => {
        console.log('Attaching event listener to container:', container);
        container.addEventListener('mouseenter', handleMouseEnter); // Mouse enter event
        container.addEventListener('mouseleave', handleMouseLeave); // Mouse leave event
    });
});
