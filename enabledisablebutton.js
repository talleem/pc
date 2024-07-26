document.addEventListener('DOMContentLoaded', function() {
    const joinMeetingButton = document.getElementById('joinmeeting');
    const savedValuesList = document.getElementById('savedValuesList');

    // Function to check the list and enable/disable the button
    function checkList() {
        if (savedValuesList.children.length > 0) {
            joinMeetingButton.disabled = true;
        } else {
            joinMeetingButton.disabled = false;
        }
    }

    // Initial check when the page loads
    checkList();

    // If you add or remove elements from the list dynamically,
    // you can call checkList() to update the button's state
});

