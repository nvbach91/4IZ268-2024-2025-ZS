const express = require("express");
const axios = require("axios"); // Použití Axios
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = 3000;

app.get("/api/mlb", async (req, res) => {
  const date = req.query.date || "2024/10/30"; // Výchozí datum, pokud není poskytnuto
  try {
    console.log(`Requesting MLB data for date: ${date}`);
    const response = await axios.get(
      `https://api.sportradar.com/mlb/trial/v7/en/games/${date}/boxscore.json`,
      {
        headers: { accept: "application/json" },
        params: { api_key: "tG40ttntc5R9FhKlPONiYvTBINTDUCMSNzCDLrnf" },
      }
    );
    console.log("Response received from API:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from API:", error.message);
    res.status(500).send(error.message);
  }
});

app.get("/api/soccer", async (req, res) => {
  const date = req.query.date || "2025-01-29"; // Výchozí datum
  console.log(`Requesting Soccer data for date: ${date}`);
  try {
    const response = await axios.get(
      `https://api.sportradar.com/soccer/trial/v4/en/schedules/${date}/schedules.json`,
      {
        headers: { accept: "application/json" },
        params: { api_key: "tG40ttntc5R9FhKlPONiYvTBINTDUCMSNzCDLrnf" },
      }
    );
    console.log("Response received from Soccer API:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching Soccer data:", error.message);
    res.status(500).send(error.message);
  }
});



app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
