const axios = require("axios");

const PYTHON_URL = process.env.PYTHON_SERVICE_URL;

exports.getNextQuestion = async (stage, skills) => {
  try {
    const res = await axios.post(`${PYTHON_URL}/interview/next`, {
      stage,
      skills
    });

    return res.data;
  } catch (err) {
    console.error("Interview Service Error →", err.message);
    throw new Error("Failed to get next interview question");
  }
};
