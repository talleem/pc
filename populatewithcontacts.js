// Function to check if access token is valid
function isAccessTokenValid() {
    const accessToken = localStorage.getItem('accessToken');
    const expiration = localStorage.getItem('tokenExpiration');

    // Check if access token exists and if it's still valid
    return accessToken && expiration && Date.now() < parseInt(expiration);
}

// Function to refresh access token using refresh token
function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const clientId = '919212619443-d2ck4cv25sfhvvg5n1rj82ob81h56362.apps.googleusercontent.com';
    const clientSecret = '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';
    const requestBody = {
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token'
    };

    return fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        const newAccessToken = data.access_token;
        const expiresIn = data.expires_in; // Typically in seconds

        // Calculate new expiration timestamp
        const expiration = Date.now() + expiresIn * 1000;

        // Update localStorage with new token and expiration
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('tokenExpiration', expiration);

        return newAccessToken;
    });
}

// Function to fetch contacts from Google People API using the provided access token
function fetchContacts(accessToken) {
    const url = 'https://people.googleapis.com/v1/people/me/connections?personFields=emailAddresses';

    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`, // Use the provided access token
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        return response.json();
    })
    .then(data => {
        return data.connections || []; // Return empty array if no connections
    })
    .catch(error => {
        console.error('Error fetching contacts:', error);
        return [];
    });
}

// Function to validate an email address
function isValidEmail(email) {
    // Regular expression for basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Function to populate the email list in the HTML
function populateEmailList(accessToken) {
    const validEmailList = document.getElementById('validEmailList');
    let validEmails = [];

    const textarea = document.getElementById('receiverEmail');
    const emailList = document.getElementById('validEmailList');

    function updateEmailList() {
        emailList.innerHTML = ''; // Clear the current list

        validEmails.forEach(email => {
            const li = document.createElement('li');
            li.textContent = email;
            emailList.appendChild(li);
        });
    }

    textarea.addEventListener('focus', function() {
        updateEmailList();
    });

    textarea.addEventListener('keyup', function(event) {
        if (event.key === 'Enter' || event.key === ',') {
            const emails = textarea.value.split(/[\n,]+/);

            emails.forEach(email => {
                email = email.trim();

                if (email && isValidEmail(email) && !validEmails.includes(email)) {
                    validEmails.push(email);
                }
            });

            textarea.value = '';
            updateEmailList();
        }
    });

    fetchContacts(accessToken)
    .then(contacts => {
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

        updateEmailList();
    })
    .catch(error => {
        console.error('Error fetching contacts:', error);
    });
}

window.onload = function() {
    const accessToken = localStorage.getItem('accessToken');
    populateEmailList(accessToken);
};
