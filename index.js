const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Define a route for park recommendations
app.post('/recommend-parks', async (req, res) => {
  try {
    const userLocation = req.body.location;
    console.log(`Received location: ${userLocation}`);

    // Ensure the location is properly formatted (latitude,longitude)
    if (!userLocation || !userLocation.includes(',')) {
      throw new Error('Invalid location format. Expected format: "latitude,longitude"');
    }

    // Google Places API request
    const geminiResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: userLocation,
        radius: 1500,
        type: 'park',
        key: 'AIzaSyBQata7o2DNHjCy-KXO9u2Pn0xc2xyjLJo' // Replace with your actual API key
      }
    });
    console.log('Google Places API response received', geminiResponse.data);

    if (geminiResponse.data.status !== 'OK') {
      throw new Error(geminiResponse.data.error_message);
    }

    const parks = geminiResponse.data.results;

    // Return the park recommendations
    res.json({ parks });
  } catch (error) {
    console.error('Error occurred:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
