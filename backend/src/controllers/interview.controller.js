const axios = require("axios");
const Interview = require("../models/Interview");

exports.askQuestion = async (req, res) => {
  const { answer, stage, skills } = req.body;

  const py = await axios.post("http://localhost:8000/interview/next", {
    stage,
    skills
  });

  const q = py.data.question;
  const next = py.data.nextStage;

  await Interview.create({
    question: q,
    answer,
    stage
  });

  res.json({ question: q, nextStage: next });
};
