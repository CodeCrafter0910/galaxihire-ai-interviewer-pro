const Resume = require("../models/Resume");
const resumeParserService = require("../services/resumeParser.service");

exports.uploadResume = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const parsed = await resumeParserService.sendToPythonParser(file);

    const saved = await Resume.create({
      userId: req.userId,
      originalFileName: file.originalname,
      ...parsed
    });

    res.json({
      message: "Resume parsed successfully",
      parsed: saved
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
