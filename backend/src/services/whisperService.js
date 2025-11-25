const axios = require("axios");
const FormData = require("form-data");

const PYTHON_URL = process.env.PYTHON_SERVICE_URL;

async function sendAudioToWhisper(buffer, filename = "audio.wav") {
  try {
    const form = new FormData();

    const isMp3 = filename.toLowerCase().endsWith(".mp3");
    const contentType = isMp3 ? "audio/mpeg" : "audio/wav";

    form.append("audio", buffer, {
      filename,
      contentType,
    });

    const res = await axios.post(`${PYTHON_URL}/stt`, form, {
      headers: form.getHeaders(),
      timeout: 45000,
      maxBodyLength: Infinity,
    });

    return res.data.text || "";
  } catch (err) {
    console.error("Whisper Service Error →", err.response?.data || err.message);
    return "";
  }
}

module.exports = { sendAudioToWhisper };
