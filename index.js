const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3008;
const cors = require('cors');
app.use(cors());


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

    const geocodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: userLocation,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (!geocodeResponse.data.results.length) {
      throw new Error('Could not find location');
    }

    const coordinates = geocodeResponse.data.results[0].geometry.location;
    console.log(`Coordinates for ${userLocation}: ${coordinates.lat},${coordinates.lng}`);

    const placesResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${coordinates.lat},${coordinates.lng}`,
        radius: 1500,
        type: 'park',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    console.log('Places API response data:', placesResponse.data);

    const parks = placesResponse.data.results.map((park) => {
      const photoReference = park.photos ? park.photos[0].photo_reference : null;
      const photoUrl = photoReference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        : null;

      return {
        name: park.name,
        vicinity: park.vicinity,
        rating: park.rating,
        photoUrl: photoUrl,
        opening_hours: park.opening_hours?.open_now ? "Open" : "Closed",
        user_ratings_total: park.user_ratings_total,
        placeId: park.place_id,
      };
    });

    console.log('Processed parks data:', parks);

    res.json({ parks });
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
