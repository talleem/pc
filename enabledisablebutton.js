console.log("Begin executing")
document.addEventListener('DOMContentLoaded', function() {
    const joinMeetingButton = document.getElementById('joinmeeting');
    const savedValuesList = document.getElementById('savedValuesList');

    // Function to check the list and enable/disable the button
    function checkList() {
        if (savedValuesList.children.length > 0) {
            joinMeetingButton.disabled = true;
            console.log("Not Empty", savedValuesList.children.length);
        } else {
            joinMeetingButton.disabled = false;
             console.log("Empty", savedValuesList.children.length);
        }
    }
});
