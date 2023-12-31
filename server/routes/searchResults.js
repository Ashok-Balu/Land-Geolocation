const express = require("express");
const router = express.Router();
const axios = require("axios");
const url = require("url");
const API_KEY="pk.eyJ1IjoiYXNob2tiYWx1IiwiYSI6ImNscWk1cnpoMjFpYXcya3RrY3V6c2RjbXoifQ.UGMu75__eHl0bd5Lrj33KQ"

router.get("/:query", async (req, res) => {
  try {
    // adding api key & query strings
    const params = new URLSearchParams({
      access_token: API_KEY,
      ...url.parse(req.url, true).query,
    });
    // getting query param from req
    const query = req.params.query;
    const results = await axios(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?${params}`
    );

    const data = results.data;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
