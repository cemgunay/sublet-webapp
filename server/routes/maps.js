const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/map-image', async (req, res) => {
    // Extract parameters from the request
    const { lat, lng } = req.query;

    // Construct the Google Maps API URL
    const googleMapsURL = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

    try {
        // Fetch the image from Google Maps
        const response = await axios.get(googleMapsURL, { responseType: 'arraybuffer' });
        
        // Set the appropriate headers and send the image data as response
        res.setHeader('Content-Type', 'image/png'); // Or 'image/jpeg' if that's what the API returns

        // Explicitly remove or set certain headers
        res.removeHeader('X-Frame-Options');
        res.removeHeader('Content-Security-Policy');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // This allows the resource to be used in "all" contexts
        

        res.send(response.data);
    } catch (error) {
        console.error('Error fetching the map image:', error);
        res.status(500).json({ message: 'Failed to fetch the map image.' });
    }
});

module.exports = router;

