document.addEventListener('DOMContentLoaded', function() {
    const joinMeetingButton = document.getElementById('joinmeeting');
    const savedValuesList = document.getElementById('savedValuesList');
    const storedEmail = localStorage.getItem('loggedInEmail');
    const storedEmail = localStorage.getItem('createinvit');
    const storedEmail = localStorage.getItem('updateinvit');
    const storedEmail = localStorage.getItem('loadinvit');
    const storedEmail = localStorage.getItem('endtime');
    const storedEmail = localStorage.getItem('starttime');
    const storedEmail = localStorage.getItem('meetingid');
    

    // Function to check the list and enable/disable the button
    window.checkList = function() {
        let shouldEnableButton = false;

        // Iterate through each child and compare with storedEmail
        for (let i = 0; i < savedValuesList.children.length; i++) {
            const listItem = savedValuesList.children[i];
            const childValue = listItem.textContent.trim();

            if (childValue === storedEmail) {
                shouldEnableButton = true;

                // Apply styles to the matching list item
                listItem.style.color = 'blue';
                listItem.style.fontWeight = 'bold';
                listItem.style.fontSize = '1.5em'; // Equivalent to h4 font size
            } else {
                // Optional: Reset styles for non-matching items
                listItem.style.color = '';
                listItem.style.fontWeight = '';
                listItem.style.fontSize = '';
            }
        }

        // Enable or disable the button based on the comparison
        joinMeetingButton.disabled = !shouldEnableButton;
    };

    // Call checkList to initialize button state and apply styles
    checkList();
});
