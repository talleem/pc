document.addEventListener('DOMContentLoaded', function() {
    const joinMeetingButton = document.getElementById('joinmeeting');
    const savedValuesList = document.getElementById('savedValuesList');
    const storedEmail = localStorage.getItem('loggedInEmail');

    // Function to check the list and enable/disable the button
    window.checkList = function() {
        let shouldEnableButton = false;

        // Check if the list has any children
        if (savedValuesList.children.length > 0) {
            // Iterate through each child and compare with storedEmail
            for (let i = 0; i < savedValuesList.children.length; i++) {
                const childValue = savedValuesList.children[i].textContent.trim();
                if (childValue === storedEmail) {
                    shouldEnableButton = true;
                    break;
                }
            }
        }

        // Enable or disable the button based on the comparison
        joinMeetingButton.disabled = !shouldEnableButton;
    };

    // Call checkList to initialize button state
    checkList();
});
