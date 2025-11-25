const axios = require("axios");
const Interview = require("../models/Interview");

// Audio + Video services
const { sendAudioToWhisper } = require("../services/whisperService");
const { sendVideoForAnalysis } = require("../services/videoUpload.service");

// Use deployed Python-service URL
const PY_URL =
  process.env.PYTHON_SERVICE_URL ||
  "https://galaxihire-ai-interviewer-pro.onrender.com";

// Interview-flow service
const { getNextQuestion } = require("../services/interview.service");


// --------------------------------------------------
// 1) TEXT QUESTION FLOW
// --------------------------------------------------
exports.askQuestion = async (req, res) => {
  try {
    const { answer, stage, skills } = req.body;

    // Call Python service for next question
    const py = await getNextQuestion(stage, skills);

    const question = py.question;
    const nextStage = py.nextStage;

    // Save current Q/A
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


// --------------------------------------------------
// 2) AUDIO ANSWER → Whisper STT
// --------------------------------------------------
exports.processAudioAnswer = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No audio uploaded" });
    }

    const filename = req.file.originalname || "audio.wav";
    const audioBuffer = req.file.buffer;

    // Send audio to Python STT → Whisper API
    const text = await sendAudioToWhisper(audioBuffer, filename);

    return res.json({ text });
  } catch (err) {
    console.error("Audio processing error:", err);
    res.status(500).json({ error: "Failed to process audio" });
  }
};


// --------------------------------------------------
// 3) VIDEO ANALYSIS (Optional)
// --------------------------------------------------
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No video uploaded" });
    }

    const buffer = req.file.buffer;

    // Send video to analysis service
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
