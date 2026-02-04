const router = require("express").Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const ctrl = require("../controllers/video.controller.js");

// Multer config for video upload (memory storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["video/webm", "video/mp4"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only WebM and MP4 videos are allowed"));
        }
    }
});

// Upload video
router.post("/upload", auth, upload.single("video"), ctrl.uploadVideo);

// Get session videos
router.get("/session/:sessionId", auth, ctrl.getSessionVideos);

// Get specific video
router.get("/:id", auth, ctrl.getVideo);

// Delete video
router.delete("/:id", auth, ctrl.deleteVideo);

module.exports = router;
