const router = require("express").Router();
const rateLimit = require('express-rate-limit');
const multer = require("multer");
const auth = require("../middleware/auth");
const ctrl = require("../controllers/resume.controller.js");

// Per-route resume upload rate limiter (more generous than global API limiter)
const uploadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // allow 30 resume uploads per minute (rare from one user/session)
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many resume upload requests. Please wait a moment and try again.",
    },
});

// Multer config for file upload (memory storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF and DOCX files are allowed"));
        }
    }
});

// Upload and parse resume
router.post("/upload", auth, uploadLimiter, upload.single("resume"), ctrl.uploadResume);

// Get all user resumes
router.get("/list", auth, ctrl.getUserResumes);

// Get specific resume
router.get("/:id", auth, ctrl.getResume);

// Delete resume
router.delete("/:id", auth, ctrl.deleteResume);

module.exports = router;
