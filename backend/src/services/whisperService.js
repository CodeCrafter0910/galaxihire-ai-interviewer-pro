const axios = require("axios");

async function sendAudioToWhisper(buffer) {
    const result = await axios.post(
        "http://localhost:8000/stt",
        buffer,
        {
            headers: { "Content-Type": "audio/wav" }
        }
    );

    return result.data.text;
}

module.exports = { sendAudioToWhisper };
