const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
    {
        interviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewSession",
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Video details
        filename: { type: String, required: true },
        filePath: { type: String, required: true },
        fileSize: Number,
        duration: Number, // in seconds
        mimeType: String,

        // Video metadata
        questionAsked: String,
        recordedAt: { type: Date, default: Date.now },

        // Analysis results (optional - for future facial/emotion analysis)
        analysis: {
            confidence: Number,
            emotionalState: String,
            eyeContact: Number,
            facialExpressions: [String]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Video", VideoSchema);
