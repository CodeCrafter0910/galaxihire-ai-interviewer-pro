const axios = require("axios");

async function generateReport(interview) {
  const res = await axios.post("http://localhost:8000/generate-report", { interview });
  return res.data;
}

module.exports = { generateReport };
