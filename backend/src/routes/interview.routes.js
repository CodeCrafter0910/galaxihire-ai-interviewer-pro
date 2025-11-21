const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/interview.controller");

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
// AUDIO ROUTE (Phase 7)
// -----------------------------
router.post("/audio", upload.single("audio"), ctrl.processAudioAnswer);

// -----------------------------
// VIDEO ROUTE (Phase 8)
// -----------------------------
router.post("/upload-video", upload.single("video"), ctrl.uploadVideo);

module.exports = router;
