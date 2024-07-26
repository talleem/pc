console.log("Begin executing")
document.addEventListener('DOMContentLoaded', function() {
    const joinMeetingButton = document.getElementById('join meeting');
    const savedValuesList = document.getElementById('savedValuesList');

    // Function to check the list and enable/disable the button
    window.checkList = function() {
        if (savedValuesList.children.length > 0) {
            joinMeetingButton.disabled = true;
        } else {
            joinMeetingButton.disabled = false;
        }
    };
});
