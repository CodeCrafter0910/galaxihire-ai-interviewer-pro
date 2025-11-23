const axios = require("axios");
const FormData = require("form-data");

const PYTHON_URL =
  process.env.PYTHON_SERVICE_URL ||
  "https://galaxihire-ai-interviewer-pro.onrender.com";

async function sendAudioToWhisper(buffer, filename = "audio.wav") {
  try {
    const form = new FormData();

    // IMPORTANT: Python expects field name = "audio"
    form.append("audio", buffer, {
      filename,
      contentType: "audio/wav"
    });

    const res = await axios.post(`${PYTHON_URL}/stt`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      timeout: 30000,
    });

    return res.data.text || res.data;
  } catch (err) {
    console.error("Whisper Service Error →", err.response?.data || err.message);
    throw new Error("Whisper API failed");
  }
}

module.exports = { sendAudioToWhisper };
