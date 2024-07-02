document.getElementById('oauthButton').addEventListener('click', function() {
    // Replace with your actual OAuth flow logic
    // Example OAuth flow steps (simplified for demonstration):
    // Step 1: Redirect users to Google OAuth consent page
    const clientId = '919212619443-d2ck4cv25sfhvvg5n1rj82ob81h56362.apps.googleusercontent.com'; // Replace with your Google OAuth client ID
    const redirectUri = 'https://engineerr1983.github.io/hello-world-page/'; // Replace with your redirect URI

    const authUrl = 'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=clientId&redirect_uri=redirectUri&scope=https://www.googleapis.com/auth/gmail.compose';

    window.location.href = authUrl;

    // After user grants consent and returns to your redirect URI,
    // handle the OAuth code exchange and any further actions here.
});
