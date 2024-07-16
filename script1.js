// Function to construct email message
function makeEmail(email) {
    const message = [
        'Content-Type: text/plain; charset="UTF-8"\n',
        `To: ${email.to}\n`,
        'MIME-Version: 1.0\n',
        'Subject: =?utf-8?B?' + btoa(email.subject) + '?=\n',
        'Content-Transfer-Encoding: 7bit\n\n',
        email.message
    ].join('');

    return {
        raw: btoa(message).replace(/\+/g, '-').replace(/\//g, '_')
    };
}

// Create a function to display a message on the screen
function showMessage(message) {
    // Create a new <div> element
    var div = document.createElement('div');
    
    // Set the text content of the <div> to the message
    div.textContent = message;
    
    // Optionally, you can style the <div> to make it more noticeable
    div.style.backgroundColor = '#cce5ff';
    div.style.color = '#004085';
    div.style.border = '1px solid #b8daff';
    div.style.padding = '10px';
    div.style.margin = '10px';
    
    // Append the <div> to the document body or another element where you want to display the message
    document.body.appendChild(div);

     // Set a timeout to remove the message after 4 seconds (4000 milliseconds)
    setTimeout(function() {
        div.remove(); // Remove the div from the DOM
    }, 4500); // 4000 milliseconds = 4 seconds
}

function showMessage2(message2) {
    // Create a new <div> element
    var div2 = document.createElement('div2');
    
    // Set the text content of the <div> to the message
    div2.textContent = message2;
    
    // Optionally, you can style the <div> to make it more noticeable
    div2.style.backgroundColor = '#FFFFC5';
    div2.style.color = '#004085';
    div2.style.border = '1px solid #b8daff';
    div2.style.padding = '10px';
    div2.style.margin = '10px';
    
    // Append the <div> to the document body or another element where you want to display the message
    document.body.appendChild(div2);

     // Set a timeout to remove the message after 4 seconds (4000 milliseconds)
    setTimeout(function() {
        div2.remove(); // Remove the div from the DOM
    }, 4500); // 4000 milliseconds = 4 seconds
}

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

// Modified sendMessageWithRetry function to handle token refresh
function sendMessageWithRetry(accessToken, email, retries = 1) {
    const apiUrl = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
    const headers = new Headers({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    });

    const raw = makeEmail(email); // Call to makeEmail function

    return fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(raw)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401 && retries > 0) {
                // Attempt to refresh token and retry
                return refreshToken()
                    .then(newAccessToken => sendMessageWithRetry(newAccessToken, email, retries - 1));
            } else {
                throw new Error(`Failed to send email: ${response.status}`);
            }
        }
        console.log('Email sent successfully!');
        showMessage('Email sent successfully!');
        showMessage2('You have new message/s in you Gmail inbox');// This will display on the screen

    })
    .catch(error => {
        console.error('Error sending email:', error);
    });
}

// Usage in sendEmailButton click event
document.getElementById('sendEmailButton').addEventListener('click', function() {
    const receiverEmail = document.getElementById('receiverEmail').value;
    const messageBody = document.getElementById('messageBody').value;
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        console.error('Access token not found.');
        // Handle the case where access token is not found
        return;
    }

    const email = {
        to: receiverEmail,
        subject: 'Test Email',
        message: messageBody
    };

    sendMessageWithRetry(accessToken, email);
});


