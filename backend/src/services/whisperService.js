const axios = require("axios");
const FormData = require("form-data");

const PYTHON_URL =
  process.env.PYTHON_SERVICE_URL ||
  "https://galaxihire-ai-interviewer-pro.onrender.com";

async function sendAudioToWhisper(buffer, filename = "audio.mp3") {
  try {
    const form = new FormData();

    // ✔ Correct field name ("audio")
    // ✔ Use correct contentType (audio/*) works for mp3 + wav + m4a + webm
    form.append("audio", buffer, {
      filename,
      contentType: "audio/*"
    });

    const res = await axios.post(`${PYTHON_URL}/stt`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      timeout: 30000,
    });

    return res.data.text || "";
  } catch (err) {
    console.error("Whisper Service Error →", err.response?.data || err.message);
    throw new Error("Whisper API failed");
  }
}

module.exports = { sendAudioToWhisper };
