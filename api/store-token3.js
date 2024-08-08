//import fetch from 'node-fetch';
// Import a library or module for persistent storage here
// For demonstration, we'll use a mock storage method

// Mock function to simulate storing the token
//const storeTokenInPersistentStorage = async (token) => {
    // Replace this with real implementation, e.g., a database or secure key management
//    console.log(`Token stored: ${token}`);
//};

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

        // Store the access token in persistent storage
        try {
            await storeTokenInPersistentStorage(accessToken);
            return res.status(200).json({ message: 'Access token received and stored' });
        } catch (error) {
            console.error('Error storing access token:', error);
            return res.status(500).json({ error: 'Error storing access token' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
