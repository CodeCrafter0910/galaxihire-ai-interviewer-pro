const axios = require('axios');

const AI_URL = "http://localhost:8000";

async function getNextQuestion(stage, skills) {
  const r = await axios.post(`${AI_URL}/interview/next`, { stage, skills });
  return r.data;
}

module.exports = { getNextQuestion };
