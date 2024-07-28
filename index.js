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

    // Replace with actual Gemini API request
    const geminiResponse = await axios.get(`https://gemini-api-endpoint.com/parks?location=${userLocation}`, {
      headers: {
        'Authorization': `Bearer YOUR_GEMINI_API_KEY`
      }
    });

    const parks = geminiResponse.data;

    // Replace with actual ChatGPT API request
    const chatGptResponse = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: `Recommend activities for the following parks: ${JSON.stringify(parks)}`,
      max_tokens: 100,
    }, {
      headers: {
        'Authorization': `Bearer YOUR_CHATGPT_API_KEY`
      }
    });

    const recommendations = chatGptResponse.data.choices[0].text;

    res.json({ parks, recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
