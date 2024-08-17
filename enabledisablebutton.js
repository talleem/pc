document.addEventListener('DOMContentLoaded', function() {
    const savedValuesList = document.getElementById('savedValuesList');
    const storedEmail = localStorage.getItem('loggedInEmail');
    const createinvit = document.getElementById('createinvit');
    const endtime = document.getElementById('endtime');
    const starttime = document.getElementById('starttime');
    const meetingdesc = document.getElementById('meetingdesc');
    const repeatevery = document.getElementById('repeatevery');
    const repeatfrequency = document.getElementById('repeatFrequency');
    const numofoccur = document.getElementById('numofoccur');
    console.log('Stored Email:', storedEmail);

    // Function to check the list and enable/disable the button
    window.checkList = function() {
        let shouldEnableButton = false;

        // Iterate through each child and compare with storedEmail
        for (let i = 0; i < savedValuesList.children.length; i++) {
            const listItem = savedValuesList.children[i];
            const childValue = listItem.textContent.trim();

            if (childValue === storedEmail) {
                console.log('Match found:', childValue, storedEmail);
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
        createinvit.disabled = !shouldEnableButton;
        starttime.disabled = !shouldEnableButton;
        endtime.disabled = !shouldEnableButton;
        meetingdesc.disabled = !shouldEnableButton;
        repeatevery.disabled = !shouldEnableButton;
        repeatfrequency.disabled = !shouldEnableButton;
        numofoccur.disabled = !shouldEnableButton;
    };

    // Call checkList to initialize button state and apply styles
    checkList();
});
