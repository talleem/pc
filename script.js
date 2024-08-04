document.getElementById('oauthButton').addEventListener('click', function() {
    // Replace with your actual OAuth flow logic

    // Example OAuth flow steps (simplified for demonstration):

    // Step 1: Redirect users to Google OAuth consent page
    const clientId = '919212619443-d2ck4cv25sfhvvg5n1rj82ob81h56362.apps.googleusercontent.com'; // Replace with your Google OAuth client ID
    const redirectUri = 'https://engineerr1983.github.io/hello-world-page/callback'; // Replace with your redirect URI
      // Specify the scopes you need, comma-separated
    const scopes = 'https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send https://mail.google.com https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/profile.emails.read https://www.googleapis.com/auth/meetings.space.created https://www.googleapis.com/auth/meetings.space.readonly https://www.googleapis.com/auth/meetings.media.readonly https://www.googleapis.com/auth/meetings https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';
    const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes)}`;

    window.location.href = authUrl;

    // After user grants consent and returns to your redirect URI,
    // handle the OAuth code exchange and any further actions here.
});
