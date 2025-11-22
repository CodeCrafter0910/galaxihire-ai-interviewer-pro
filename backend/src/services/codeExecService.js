const axios = require("axios");

// Use CODE_EXEC_SERVICE_URL, NOT PYTHON
const CODE_EXEC_URL =
  process.env.CODE_EXEC_SERVICE_URL ||
  "https://your-code-sandbox-url.onrender.com";

async function executeCode(code, language) {
  try {
    const res = await axios.post(
      `${CODE_EXEC_URL}/execute`,
      { code, language }
    );

    return res.data;
  } catch (err) {
    console.error("Code Exec Error →", err.message);
    return { error: "Failed to execute code" };
  }
}

module.exports = { executeCode };
