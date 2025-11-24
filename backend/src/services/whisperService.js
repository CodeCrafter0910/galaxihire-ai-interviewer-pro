const axios = require("axios");
const FormData = require("form-data");

const PYTHON_URL = process.env.PYTHON_SERVICE_URL;

async function sendAudioToWhisper(buffer, filename = "audio.wav") {
  try {
    const form = new FormData();
    form.append("audio", buffer, {
      filename,
      contentType: "audio/wav",
    });

    const res = await axios.post(`${PYTHON_URL}/stt`, form, {
      headers: form.getHeaders(),
      timeout: 30000,
    });

    return res.data.text;
  } catch (err) {
    console.error("Whisper Service Error →", err.response?.data || err.message);
    return "";
  }
}

module.exports = { sendAudioToWhisper };
