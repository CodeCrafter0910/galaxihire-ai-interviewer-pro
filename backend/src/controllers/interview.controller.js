const axios = require("axios");
const Interview = require("../models/Interview");

// Audio + Video services
const { sendAudioToWhisper } = require("../services/whisperService");
const { sendVideoForAnalysis } = require("../services/videoUpload.service");

// Use deployed Python-service URL
const PY_URL =
  process.env.PYTHON_SERVICE_URL ||
  "https://galaxihire-ai-interviewer-pro.onrender.com";  // your live python URL

// ---------------------------
// TEXT QUESTION FLOW
// ---------------------------
exports.askQuestion = async (req, res) => {
  try {
    const { answer, stage, skills } = req.body;

    // Send to Python-service
    const py = await axios.post(`${PY_URL}/interview/next`, {
      stage,
      skills,
    });

    const question = py.data.question;
    const nextStage = py.data.nextStage;

    // Save to DB (optional)
    await Interview.create({
      question,
      answer,
      stage,
    });

    res.json({ question, nextStage });
  } catch (err) {
    console.error("Interview Next Error →", err.message);
    res.status(500).json({ error: "Failed to get next interview question" });
  }
};

// ---------------------------
// AUDIO ANSWER TO WHISPER
// ---------------------------
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

// ---------------------------
// VIDEO ANALYSIS
// ---------------------------
exports.uploadVideo = async (req, res) => {
  try {
    const buffer = req.file.buffer;

    const analysis = await sendVideoForAnalysis(buffer);

    res.json({
      message: "Video processed",
      analysis,
    });
  } catch (err) {
    console.error("Video upload error:", err);
    res.status(500).json({ error: "Video processing failed" });
  }
};
