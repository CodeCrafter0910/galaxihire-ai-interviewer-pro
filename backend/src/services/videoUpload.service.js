const axios = require("axios");
const FormData = require("form-data");

const PYTHON_URL = process.env.PYTHON_SERVICE_URL || "https://galaxihire-ai-interviewer-pro.onrender.com";

async function sendVideoForAnalysis(buffer, filename = "upload.webm") {
  try {
    const form = new FormData();
    form.append("video", buffer, { filename, contentType: "video/webm" });

    const res = await axios.post(`${PYTHON_URL}/analyze-video`, form, {
      headers: { ...form.getHeaders() },
      timeout: 60000
    });

    return res.data;
  } catch (err) {
    console.error("Video Upload Error →", err.message);
    throw err;
  }
}

module.exports = { sendVideoForAnalysis };
