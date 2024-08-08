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

        if (!accessToken) {
            return res.status(400).json({ error: 'Access token is required' });
        }

        let tokenToUse = accessToken;

        try {
            // Check if the token is expired
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
            if (response.status === 400 && refreshToken) {
                // Token is expired, try to refresh it
                const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        'grant_type': 'refresh_token',
                        'refresh_token': refreshToken,
                        'client_id': '919212619443-d2ck4cv25sfhvvg5n1rj82ob81h56362.apps.googleusercontent.com',
                        'client_secret': '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'
                    })
                });

                const data = await refreshResponse.json();
                tokenToUse = data.access_token;
            }
        } catch (error) {
            console.error('Error during token check or refresh:', error);
            return res.status(500).json({ error: 'Error during token check or refresh' });
        }

        // Process the access token (e.g., send notification)
        // ...

        return res.status(200).json({ message: 'Access token processed', token: tokenToUse });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
