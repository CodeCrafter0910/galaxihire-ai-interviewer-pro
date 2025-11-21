const { sendAudioToWhisper } = require("../services/whisperService");
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
exports.processAudioAnswer = async (req, res) => {
    try {
        const audioBuffer = req.file.buffer;

        const text = await sendAudioToWhisper(audioBuffer);

        return res.json({ text });
    } catch (err) {
        console.error("Audio processing error:", err);
        res.status(500).json({ error: "Failed to process audio" });
    }
};
const { sendVideoForAnalysis } = require("../services/videoUpload.service");

exports.uploadVideo = async (req, res) => {
  try {
    const buffer = req.file.buffer;

    const analysis = await sendVideoForAnalysis(buffer);

    res.json({
      message: "Video processed",
      analysis
    });

  } catch (err) {
    console.error("Video upload error:", err);
    res.status(500).json({ error: "Video processing failed" });
  }
};
