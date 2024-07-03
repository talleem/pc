document.getElementById('oauthButton').addEventListener('click', function() {
    // Replace with your actual OAuth flow logic

    // Example OAuth flow steps (simplified for demonstration):

    // Step 1: Redirect users to Google OAuth consent page
    const clientId = '919212619443-d2ck4cv25sfhvvg5n1rj82ob81h56362.apps.googleusercontent.com'; // Replace with your Google OAuth client ID
    const redirectUri = 'https://engineerr1983.github.io/hello-world-page/callback'; // Replace with your redirect URI

    const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=https://www.googleapis.com/auth/gmail.compose`;

    window.location.href = authUrl;

    // After user grants consent and returns to your redirect URI,
    // handle the OAuth code exchange and any further actions here.
});
           // Check for OAuth callback and handle it
           if (window.location.pathname === '/hello-world-page/callback') {
               const urlParams = new URLSearchParams(window.location.search);
               const code = urlParams.get('code');
               
               // Handle the OAuth code here (exchange for token, etc.)
               // Example:
               fetchToken(code); // Function to exchange code for access token
           }

           function fetchToken(code) {
               const tokenUrl = 'https://oauth2.googleapis.com/token';
               const clientId = '919212619443-d2ck4cv25sfhvvg5n1rj82ob81h56362.apps.googleusercontent.com'; // Replace with your Google OAuth client ID
               const clientSecret = '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'; // Replace with your Google OAuth client secret
               const redirectUri = 'https://engineerr1983.github.io/hello-world-page/callback'; // Replace with your redirect URI

               const requestBody = {
                   code: code,
                   client_id: clientId,
                   client_secret: clientSecret,
                   redirect_uri: redirectUri,
                   grant_type: 'authorization_code'
               };

               // Make a POST request to exchange code for access token
               fetch(tokenUrl, {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(requestBody)
               })
               .then(response => response.json())
               .then(data => {
                   // Handle response (data.access_token) - this access token can be used to make Gmail API calls
                   console.log('Access token:', data.access_token);
                   // Redirect or perform further actions as needed
               })
               .catch(error => {
                   console.error('Error exchanging code for token:', error);
               });
           }
