const express = require("express");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config();
const app = express();
const PORT = 5000; // Change this if needed


const API_KEY = process.env.REACT_APP_API_KEY;


app.use(cors()); // Enable CORS for all origins

// Proxy route to fetch clan details
app.get("/clan/:tag", async (req, res) => {

  try {
    const clanTag = req.params.tag; // Clan tag from the URL
    const response = await axios.get(
      `https://api.clashofclans.com/v1/clans/%23${clanTag}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`, // Add the API key to the request headers
        },
      }
    );
    res.json(response.data); // Send the API response back to the client
  } catch (error) {
    console.error("Error fetching clan details:", error.message);
    res.status(error.response?.status || 500).json(error.response?.data || {
      error: "Something went wrong while fetching clan details.",
    });
  }
});

app.get("/warlog/:tag", async (req, res) => {
    const clanTag = req.params.tag;
    try {
      const response = await axios.get(
        `https://api.clashofclans.com/v1/clans/%23${clanTag}/warlog`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching warlog data:", error.message);
      res.status(error.response?.status || 500).json(error.response?.data || {
        error: "Failed to fetch warlog data.",
      });
    }
  });

  app.get('/api/clans/:clanTag/currentwar', async (req, res) => {
    const clanTag = req.params.clanTag;

    try {
      // Add your API key in the headers or authorization token
      const response = await axios.get(
        `https://api.clashofclans.com/v1/clans/%23${clanTag}/currentwar`, 
        {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      res.json(response.data); 
    } catch (err) {
      console.error('Error fetching current war:', err);
      res.status(500).json({ error: 'Error fetching data from Clash of Clans API' });
    }
  });


// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
