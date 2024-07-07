
         //Function to load the inbox messages
        var API_KEY = 'AIzaSyB9w-tA4BIQGizvsG2shukDsflojuGvx28';
        var CLIENT_ID = '919212619443-d2ck4cv25sfhvvg5n1rj82ob81h56362.apps.googleusercontent.com';
        var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
        var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

        function handleClientLoad() {
            gapi.load('client:auth2', initClient);
        }

        function initClient() {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            }).then(function () {
                // GoogleAuth is ready
                // You can now make API calls
                gapi.auth2.getAuthInstance().signIn().then(function() {
                    fetchGmailInbox();
                });
            });
        }

        function fetchGmailInbox() {
            gapi.client.gmail.users.messages.list({
                'userId': 'me',
                'labelIds': 'INBOX'
            }).then(function(response) {
                var messages = response.result.messages;
                // Process messages array and display them on your HTML page
                console.log(messages);
            });
        }

        // Automatically start the process when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            handleClientLoad();
        });
