const express = require("express");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config();
const app = express();



const API_KEY = process.env.REACT_APP_API_KEY;
const PORT = process.env.PORT || 5000;

if (!API_KEY) {
  console.error("API key is missing! Make sure REACT_APP_API_KEY is set in .env file.");
  process.exit(1);
}

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse incoming JSON requests

// Helper function to handle API requests (on siisti)
const fetchClashData = async (url, res) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(error.response?.status || 500).json(
      error.response?.data || {
        error: "An error occurred while fetching data from the Clash of Clans API.",
      }
    );
  }
};

// Route to fetch clan details
app.get("/clan/:tag", (req, res) => {
  const clanTag = req.params.tag;
  const url = `https://api.clashofclans.com/v1/clans/%23${clanTag}`;
  fetchClashData(url, res);
});

// Route to fetch war log data
app.get("/warlog/:tag", (req, res) => {
  const clanTag = req.params.tag;
  const url = `https://api.clashofclans.com/v1/clans/%23${clanTag}/warlog`;
  fetchClashData(url, res);
});

// Route to fetch current war data
app.get("/api/clans/:clanTag/currentwar", (req, res) => {
  const clanTag = req.params.clanTag;
  const url = `https://api.clashofclans.com/v1/clans/%23${clanTag}/currentwar`;
  fetchClashData(url, res);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
