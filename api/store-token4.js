export default async function handler(req, res) {
    // Allow CORS for specific origin
    res.setHeader('Access-Control-Allow-Origin', 'https://engineerr1983.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Handle preflight requests
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        const { accessToken, refreshToken } = req.body;

        if (!accessToken || !refreshToken) {
            return res.status(400).json({ error: 'Access token and refresh token are required' });
        }

        // Check if the token is expired
        let isTokenExpired = false;
        try {
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
            if (response.status === 400) {
                isTokenExpired = true;  // Google returns 400 for invalid or expired tokens
            }
        } catch (error) {
            console.error('Error checking token expiry:', error);
            return res.status(500).json({ error: 'Error checking token expiry' });
        }

        // Refresh the token if necessary
        let newAccessToken = accessToken;
        if (isTokenExpired) {
            try {
                const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        'grant_type': 'refresh_token',
                        'refresh_token': refreshToken,
                        'client_id': process.env.GOOGLE_CLIENT_ID,
                        'client_secret': process.env.GOOGLE_CLIENT_SECRET
                    })
                });
                const data = await refreshResponse.json();
                newAccessToken = data.access_token;
            } catch (error) {
                console.error('Error refreshing token:', error);
                return res.status(500).json({ error: 'Error refreshing token' });
            }
        }

        // Initialize Pusher Beams
        const beamsClient = new PushNotifications({
            instanceId: process.env.PUSHER_INSTANCE_ID,
            secretKey: process.env.PUSHER_SECRET_KEY
        });

        try {
            await beamsClient.publishToInterests(['your-interest'], {
                web: {
                    notification: {
                        title: 'Access Token Update',
                        body: `Access token: ${newAccessToken}`,
                        deep_link: 'https://engineerr1983.github.io',
                    }
                }
            });
            return res.status(200).json({ message: 'Notification sent' });
        } catch (error) {
            console.error('Error sending notification:', error);
            return res.status(500).json({ error: 'Error sending notification' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
