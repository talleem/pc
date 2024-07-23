document.addEventListener('DOMContentLoaded', (event) => {
    const inputField = document.getElementById('attendeeEmail');
    const saveButton = document.getElementById('sendinvit');
    const savedValue = document.getElementById('savedValue');

    // Load the saved value from localStorage and display it
    const storedValue = localStorage.getItem('persistentValue');
    if (storedValue !== null) {
        savedValue.textContent = `Stored Value: ${storedValue}`;
        attendeeEmail.value = storedValue;
    }

    // Save the value to localStorage when the button is clicked
    saveButton.addEventListener('click', () => {
        const value = attendeeEmail.value;
        localStorage.setItem('persistentValue', value);
        savedValue.textContent = `Stored Value: ${value}`;
    });
});
