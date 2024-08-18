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
    console.log('enabledisable', storedEmail);
    console.log('length',savedValuesList.children.length);

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
            } else {
                 console.log('No Match found:', childValue, storedEmail);
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
        console.log('test:',shouldEnableButton, storedEmail);
    };
    // Initialize the function to check the list on page load
    checkList();
});
