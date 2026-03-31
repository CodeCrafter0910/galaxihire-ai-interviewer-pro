const axios = require("axios");
const FormData = require("form-data");
const Resume = require("../models/Resume");
const logger = require("../logger");

const PY_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:8000";

/**
 * Upload and parse resume
 * POST /api/resume/upload
 */
exports.uploadResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Send to Python parser
    logger.info(`Resume parser endpoint: ${PY_URL}/resume/parse for user=${userId}, file=${file.originalname}`);
    const formData = new FormData();
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });

    const response = await axios.post(`${PY_URL}/resume/parse`, formData, {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });

    const parsed = response.data.parsed || {};

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error || "Failed to parse resume"
      });
    }

    // Save to database
    const resume = await Resume.create({
      userId,
      originalFileName: file.originalname,
      skills: parsed.skills || [],
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      experienceYears: parsed.experience_years || 0,
      education: parsed.education,
      projects: parsed.projects || [],
      certifications: parsed.certifications || [],
      extractedText: parsed.text || parsed.extractedText || "No text extracted",
      fileSize: file.size,
      mimeType: file.mimetype
    });

    logger.info(`Resume parsed and saved: ${resume._id} for user: ${userId}`);

    res.json({
      message: "Resume parsed successfully",
      resume: {
        id: resume._id,
        name: parsed.name,
        email: parsed.email,
        skills: parsed.skills,
        experienceYears: parsed.experience_years,
        education: parsed.education,
        projects: parsed.projects,
        certifications: parsed.certifications
      }
    });

  } catch (error) {
    logger.error("Resume Upload Error:", error);

    // Axios/Python connector issue
    if (error.isAxiosError) {
      const upstreamError = error.response?.data?.error || error.message;
      const statusCode = error.response?.status || 502;
      return res.status(statusCode).json({
        error: "Failed to process resume",
        details: upstreamError
      });
    }

    res.status(500).json({
      error: "Failed to process resume",
      details: error.response?.data || error.message
    });
  }
};

/**
 * Get user's resumes
 * GET /api/resume/list
 */
exports.getUserResumes = async (req, res) => {
  try {
    const userId = req.user._id;

    const resumes = await Resume.find({ userId })
      .sort({ createdAt: -1 })
      .select('-extractedText'); // Don't send full text

    res.json({ resumes });

  } catch (error) {
    logger.error("Get Resumes Error:", error);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
};

/**
 * Get specific resume
 * GET /api/resume/:id
 */
exports.getResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const resume = await Resume.findOne({ _id: id, userId });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json({ resume });

  } catch (error) {
    logger.error("Get Resume Error:", error);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};

/**
 * Delete resume
 * DELETE /api/resume/:id
 */
exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const resume = await Resume.findOneAndDelete({ _id: id, userId });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    logger.info(`Resume deleted: ${id}`);

    res.json({ message: "Resume deleted successfully" });

  } catch (error) {
    logger.error("Delete Resume Error:", error);
    res.status(500).json({ error: "Failed to delete resume" });
  }
};
