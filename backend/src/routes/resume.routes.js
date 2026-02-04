const router = require("express").Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const ctrl = require("../controllers/resume.controller.js");

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
router.post("/upload", auth, upload.single("resume"), ctrl.uploadResume);

// Get all user resumes
router.get("/list", auth, ctrl.getUserResumes);

// Get specific resume
router.get("/:id", auth, ctrl.getResume);

// Delete resume
router.delete("/:id", auth, ctrl.deleteResume);

module.exports = router;
