const CLIENT_ID = '919212619443-d2ck4cv25sfhvvg5n1rj82ob81h56362.apps.googleusercontent.com'; // Replace with your actual client ID


function handleAuthorization(response) {
    console.log('Handling authorization...');
    console.log('Authorization response:', response);
    
    if (response && response.error) {
        console.error('Authentication error:', response.error);
        return;
    }
    if (response && response.credential) {
        console.log('Credential:', response.credential);
        // Initialize Gmail API client
        gapi.load('client', function() {
            initGmailClient();
            // After initializing client, list labels
            listLabels();
        });
    }
}

function initGmailClient() {
    console.log('Initializing Gmail client...');

    gapi.client.init({
        apiKey: 'AIzaSyB9w-tA4BIQGizvsG2shukDsflojuGvx28',  // Replace with your actual API key
        clientId: '919212619443-d2ck4cv25sfhvvg5n1rj82ob81h56362.apps.googleusercontent.com',  // Replace with your actual client ID
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
        scope: 'https://www.googleapis.com/auth/gmail.readonly'
    }).then(function () {
        console.log('Gmail API initialized.');
    }).catch(function (error) {
        console.error('Error initializing Gmail API:', error);
    });
}

function listLabels() {
    console.log('Fetching inbox emails...');

    gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'labelIds': 'INBOX',
        'maxResults': 10  // Adjust maxResults as per your requirement
    }).then(function(response) {
        console.log('Email list response:', response);
        let messages = response.result.messages;
        if (messages && messages.length > 0) {
            messages.forEach(function(message) {
                // Display message details on your page as needed
                console.log('Message:', message);
                // Example: Append subject line to a list
                let subject = message.payload.headers.find(header => header.name === 'Subject').value;
                let listItem = document.createElement('li');
                listItem.textContent = subject;
                document.getElementById('inbox-list').appendChild(listItem);
            });
        } else {
            console.log('No messages found.');
        }
    }).catch(function(error) {
        console.error('Error fetching emails:', error);
    });
}
