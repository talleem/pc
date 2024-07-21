// populatewithcontacts.js

// Function to fetch contacts from Google People API
async function fetchContacts() {
    const url = 'https://people.googleapis.com/v1/people/me/connections?personFields=emailAddresses';

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ya29.a0AXooCgvynoFX-BTnF4mCZsI6cIdmHSESnmzLW-aUhFwHtNQGPr3T5BG5KW3c72mst4nZVBTNtWiKgd-ZAnkmwui2FOIAvC4Z86bnLWc5ltMH3aEqiZu-th5IVzAS4fXsLUl36SzDczoKskzzbfu7YVQQlINPv2lraLYaCgYKAWkSARESFQHGX2Mim5aaBR4LR2U4Kwn4z8oP5g0170',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }

        const data = await response.json();
        return data.connections || []; // Return empty array if no connections
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return [];
    }
}

// Function to validate an email address
function isValidEmail(email) {
    // Regular expression for basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Function to populate the email list in the HTML
async function populateEmailList() {
    const validEmailList = document.getElementById('validEmailList');
    const contacts = await fetchContacts();

    const textarea = document.getElementById('receiverEmail');
    const emailList = document.getElementById('validEmailList');

    // Initialize an array to store unique valid emails
    let validEmails = [];

    // Function to update the email list display
    function updateEmailList() {
        emailList.innerHTML = ''; // Clear the current list

        // Add each valid email to the list
        validEmails.forEach(email => {
            const li = document.createElement('li');
            li.textContent = email;
            emailList.appendChild(li);
        });
    }

    // Event listener for when textarea is focused
    textarea.addEventListener('focus', function() {
        // Update the email list display
        updateEmailList();
    });

    // Event listener for when a key is pressed in the textarea
    textarea.addEventListener('keyup', function(event) {
        if (event.key === 'Enter' || event.key === ',') {
            // Split the textarea value by newline or comma to get potential email addresses
            const emails = textarea.value.split(/[\n,]+/);

            // Validate each email and add it to the validEmails array if unique and valid
            emails.forEach(email => {
                email = email.trim(); // Trim whitespace

                if (email && isValidEmail(email) && !validEmails.includes(email)) {
                    validEmails.push(email);
                }
            });

            // Clear the textarea and update the email list display
            textarea.value = '';
            updateEmailList();
        }
    });

    // Add contacts' email addresses to validEmails array (unique)
    contacts.forEach(contact => {
        const emailAddresses = contact.emailAddresses;
        if (emailAddresses) {
            emailAddresses.forEach(email => {
                const emailValue = email.value.trim();
                if (emailValue && isValidEmail(emailValue) && !validEmails.includes(emailValue)) {
                    validEmails.push(emailValue);
                }
            });
        }
    });

    // Populate the email list with valid emails
    updateEmailList();
}

// Call populateEmailList during page load
window.onload = populateEmailList;
