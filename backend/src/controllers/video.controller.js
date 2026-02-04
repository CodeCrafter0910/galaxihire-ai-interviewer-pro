const fs = require("fs");
const path = require("path");
const Video = require("../models/Video");
const logger = require("../logger");

/**
 * Upload video recording from interview
 * POST /api/video/upload
 */
exports.uploadVideo = async (req, res) => {
    try {
        const userId = req.user._id;
        const { sessionId, questionAsked } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "No video file uploaded" });
        }

        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is required" });
        }

        // Create videos directory
        const videosDir = path.join(__dirname, "..", "..", "videos");
        if (!fs.existsSync(videosDir)) {
            fs.mkdirSync(videosDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `video-${sessionId}-${timestamp}.webm`;
        const filePath = path.join(videosDir, filename);

        // Save file
        fs.writeFileSync(filePath, file.buffer);

        // Save to database
        const video = await Video.create({
            interviewId: sessionId,
            userId,
            filename,
            filePath: `/videos/${filename}`,
            fileSize: file.size,
            mimeType: file.mimetype,
            questionAsked
        });

        logger.info(`Video uploaded: ${video._id} for session: ${sessionId}`);

        res.json({
            message: "Video uploaded successfully",
            videoId: video._id,
            filePath: video.filePath
        });

    } catch (error) {
        logger.error("Video Upload Error:", error);
        res.status(500).json({ error: "Failed to upload video" });
    }
};

/**
 * Get all videos for an interview session
 * GET /api/video/session/:sessionId
 */
exports.getSessionVideos = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user._id;

        const videos = await Video.find({
            interviewId: sessionId,
            userId
        }).sort({ createdAt: 1 });

        res.json({ videos });

    } catch (error) {
        logger.error("Get Session Videos Error:", error);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
};

/**
 * Get specific video
 * GET /api/video/:id
 */
exports.getVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const video = await Video.findOne({ _id: id, userId });

        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        res.json({ video });

    } catch (error) {
        logger.error("Get Video Error:", error);
        res.status(500).json({ error: "Failed to fetch video" });
    }
};

/**
 * Delete video
 * DELETE /api/video/:id
 */
exports.deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const video = await Video.findOne({ _id: id, userId });

        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        // Delete file from disk
        const fullPath = path.join(__dirname, "..", "..", video.filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        // Delete from database
        await Video.deleteOne({ _id: id });

        logger.info(`Video deleted: ${id}`);

        res.json({ message: "Video deleted successfully" });

    } catch (error) {
        logger.error("Delete Video Error:", error);
        res.status(500).json({ error: "Failed to delete video" });
    }
};
