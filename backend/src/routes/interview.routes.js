const express = require("express");
const router = express.Router();

// Linux requires exact filename + .js
const ctrl = require("../controllers/interview.controller.js");

// ✅ Correct Auth Middleware Import
const auth = require("../middleware/auth");  // <---- FIXED

// -----------------------------
// Multer (Used for both audio and video)
// -----------------------------
const multer = require("multer");
const upload = multer();

// -----------------------------
// TEXT & EXISTING ROUTES
// -----------------------------
router.post("/ask", ctrl.askQuestion);

// -----------------------------
// NEW — INTERVIEW LIST ROUTE
// -----------------------------
router.get("/list", auth, async (req, res) => {
  try {
    const Interview = require("../models/InterviewModel");

    const items = await Interview.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error("Interview list error:", err);
    res.status(500).json({ message: "Failed to load interviews" });
  }
});

// -----------------------------
// AUDIO ROUTE (Phase 7)
// -----------------------------
router.post("/audio", upload.single("audio"), ctrl.processAudioAnswer);

// -----------------------------
// VIDEO ROUTE (Phase 8)
// -----------------------------
router.post("/upload-video", upload.single("video"), ctrl.uploadVideo);

module.exports = router;
