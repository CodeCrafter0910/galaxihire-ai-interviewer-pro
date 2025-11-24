const axios = require("axios");
const FormData = require("form-data");

const PYTHON_URL =
  process.env.PYTHON_SERVICE_URL ||
  "https://galaxihire-ai-interviewer-pro.onrender.com";

async function sendAudioToWhisper(buffer, filename = "audio.mp3") {
  try {
    const form = new FormData();

    // Detect the mimetype from file extension
    const isMp3 = filename.toLowerCase().endsWith(".mp3");

    form.append("file", buffer, {
      filename,
      contentType: isMp3 ? "audio/mpeg" : "audio/wav"
    });

    const res = await axios.post(`${PYTHON_URL}/stt`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      timeout: 45000,
    });

    return res.data.text || res.data;
  } catch (err) {
    console.error("Whisper Service Error →", err.response?.data || err.message);
    throw new Error("Whisper API failed");
  }
}

module.exports = { sendAudioToWhisper };
