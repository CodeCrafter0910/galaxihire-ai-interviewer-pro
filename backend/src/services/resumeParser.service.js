const axios = require("axios");
const FormData = require("form-data");

// ✔ Use your deployed Python-service URL
const PYTHON_URL =
  process.env.PYTHON_SERVICE_URL ||
  "https://galaxihire-ai-interviewer-pro.onrender.com";

exports.sendToPythonParser = async (file) => {
  try {
    const form = new FormData();
    form.append("file", file.buffer, file.originalname);

    const res = await axios.post(
      `${PYTHON_URL}/resume/parse`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
        timeout: 20000, // optional safeguard
      }
    );

    // ✔ Python returns: { parsed: {...} }
    return res.data.parsed;

  } catch (err) {
    console.error("Resume Parser Error →", err.message);
    throw new Error("Python resume parser failed");
  }
};
