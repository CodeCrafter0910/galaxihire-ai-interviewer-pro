const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");

const resumeController = require("../controllers/resume.controller");

const upload = multer();

router.post("/upload", auth, upload.single("resume"), resumeController.uploadResume);

module.exports = router;
