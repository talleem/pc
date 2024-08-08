import fetch from 'node-fetch';
import PushNotifications from '@pusher/push-notifications-server';

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
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).json({ error: 'Access token is required' });
        }

        // Store the access token in an environment variable (this would typically be done in your deployment settings)
        process.env.ACCESS_TOKEN = accessToken;

        // Check if the token is expired (this is a simplified check; adjust according to your token format)
        let isTokenExpired = false;
        try {
            const response = await fetch('https://your-auth-server.com/check-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                isTokenExpired = true;
            }
        } catch (error) {
            console.error('Error checking token expiry:', error);
            return res.status(500).json({ error: 'Error checking token expiry' });
        }

        // Refresh the token if necessary
        let newAccessToken = accessToken;
        if (isTokenExpired) {
            try {
                const refreshResponse = await fetch('https://your-auth-server.com/refresh-token', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await refreshResponse.json();
                newAccessToken = data.accessToken;
                process.env.ACCESS_TOKEN = newAccessToken;
            } catch (error) {
                console.error('Error refreshing token:', error);
                return res.status(500).json({ error: 'Error refreshing token' });
            }
        }

        // Initialize Pusher Beams
        const beamsClient = new PushNotifications({
            instanceId: 'YOUR_PUSHER_INSTANCE_ID',
            secretKey: 'YOUR_PUSHER_SECRET_KEY'
        });

        try {
            await beamsClient.publishToInterests(['your-interest'], {
                web: {
                    notification: {
                        title: 'Access Token Update',
                        body: `Access token: ${process.env.ACCESS_TOKEN}`,
                        deep_link: 'https://engineerr1983.github.io/hello-world-page/pagewithtabs.html',
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
