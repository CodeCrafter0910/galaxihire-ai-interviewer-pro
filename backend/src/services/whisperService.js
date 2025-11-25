const axios = require("axios");

async function sendAudioToWhisper(buffer, filename) {
  const ext = filename.split('.').pop();

  const payload = {
    model: "gpt-4o-audio-preview",
    input_audio: [
      {
        data: buffer.toString("base64"),
        format: ext,
      },
    ],
  };

  try {
    const res = await axios.post(
      `${process.env.PYTHON_SERVICE_URL}/stt`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.text;
  } catch (e) {
    console.error("Whisper service error:", e.message);
    return "";
  }
}

module.exports = { sendAudioToWhisper };
