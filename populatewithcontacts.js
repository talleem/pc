// script.js

// Function to fetch contacts from Google People API
async function fetchContacts() {
    const url = 'https://people.googleapis.com/v1/people/me/connections?personFields=emailAddresses';

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ya29.a0AXooCgsJcxefCDWqXLDmXZNcrrKZz_z-KOgjRqYxm8qLaBPpO-vW26iT-RGmqWGAQkaSGnvjTssLUh5MlEeWmOyc3R1aXLr5Q4rNFaL_QndmqQzU7cNr9AVwmHc1vumgOyg9g60pllGxr1Y1dsQA6xqhwWBlZbhEp2gaCgYKAWISARESFQHGX2MijsGW_bBR27gHQQcyz4NM5Q0170',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }

        const data = await response.json();
        return data.connections; // Assuming 'connections' contains an array of contacts
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return []; // Return empty array or handle error as needed
    }
}

// Function to populate the email list in the HTML
async function populateEmailList() {
    const validEmailList = document.getElementById('validEmailList');
    const contacts = await fetchContacts();

    contacts.forEach(contact => {
        const emailAddresses = contact.emailAddresses;
        if (emailAddresses) {
            emailAddresses.forEach(email => {
                const li = document.createElement('li');
                li.textContent = email.value;
                validEmailList.appendChild(li);
            });
        }
    });
}

// Call populateEmailList during page load
window.onload = populateEmailList;
