const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalFileName: { type: String, required: true },

    // Extracted data
    name: String,
    email: String,
    phone: String,
    skills: [String],
    experienceYears: { type: Number, default: 0 },
    education: String,
    projects: [String],
    certifications: [String],
    extractedText: String,

    // File metadata
    fileSize: Number,
    mimeType: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", ResumeSchema);
