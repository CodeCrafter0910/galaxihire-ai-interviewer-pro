const axios = require("axios");

async function executeCode(code, language) {
  const res = await axios.post("http://localhost:7000/execute", {
    code,
    language
  });

  return res.data;
}

module.exports = { executeCode };
