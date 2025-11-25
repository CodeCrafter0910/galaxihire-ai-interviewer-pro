const axios = require("axios");
const FormData = require("form-data");

async function sendAudioToWhisper(buffer, filename) {
  try {
    const form = new FormData();
    form.append("audio", buffer, { filename });

    const response = await axios.post(
      `${process.env.PYTHON_SERVICE_URL}/stt`,
      form, 
      { headers: form.getHeaders(), timeout: 120000 }
    );

    return response.data.text || "";
  } catch (err) {
    console.error("Whisper error:", err.response?.data || err.message);
    return "";
  }
}

module.exports = { sendAudioToWhisper };
