const axios = require("axios");
const FormData = require("form-data");

exports.sendToPythonParser = async (file) => {
  const form = new FormData();
  form.append("file", file.buffer, file.originalname);

  const res = await axios.post(
    "http://localhost:8000/parse-resume",
    form,
    { headers: form.getHeaders() }
  );

  return res.data.parsed_resume;
};
