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

        // Process the access token here
        // ...

        // Send response
        return res.status(200).json({ message: 'Access token received' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
