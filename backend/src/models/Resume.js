const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    originalFileName: String,
    skills: [String],
    experience_years: String,
    projects: [String],
    education: String,
    text: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", ResumeSchema);
