const axios = require("axios");

async function sendVideoForAnalysis(buffer) {
  const res = await axios.post(
    "http://localhost:8000/analyze-video",
    buffer,
    { headers: { "Content-Type": "video/webm" } }
  );

  return res.data;
}

module.exports = { sendVideoForAnalysis };
