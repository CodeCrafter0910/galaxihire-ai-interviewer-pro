const fs = require("fs");
const path = require("path");
const InterviewSession = require("../models/InterviewSession");
const Report = require("../models/Report");
const puppeteer = require("puppeteer");
const axios = require("axios");
const logger = require("../logger");

const PY_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:8000";

/**
 * Generate PDF from HTML
 */
async function createPdfFromHtml(html, outPath) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outPath, format: "A4", printBackground: true });
  await browser.close();
}

/**
 * Generate report from Python service
 */
async function callPythonReportGenerator(interviewData) {
  try {
    const response = await axios.post(`${PY_URL}/generate-report`, {
      interview: interviewData
    });
    return response.data;
  } catch (error) {
    logger.error("Python report generation failed:", error.message);
    // Fallback to basic report
    return generateFallbackReport(interviewData);
  }
}

/**
 * Fallback report if Python service fails
 */
function generateFallbackReport(interview) {
  const scores = interview.scores || {};
  return {
    communication: scores.communication || 0,
    technical: scores.technical || 0,
    confidence: scores.confidence || 0,
    coding: scores.coding || 0,
    overall: scores.overall || 0,
    strengths: ["Completed the interview"],
    improvements: ["Continue practicing"],
    learning_roadmap: [
      { week: 1, focus: "Data Structures" },
      { week: 2, focus: "System Design" },
      { week: 3, focus: "Coding Practice" },
      { week: 4, focus: "Mock Interviews" }
    ],
    recommendations: ["Practice regularly", "Review fundamentals"],
    html: `<html><body><h1>Interview Report</h1><p>Overall Score: ${scores.overall || 0}</p></body></html>`
  };
}

/**
 * Generate and save report from interview session
 * POST /api/report/generate
 */
exports.generateAndSave = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // Find interview session
    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({ error: "Interview session not found" });
    }

    // Build transcript from conversation
    const transcript = session.conversation
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    // Prepare interview data
    const interviewData = {
      _id: session._id,
      candidateName: req.user.name || "Candidate",
      sessionName: `Interview ${new Date(session.startedAt).toLocaleDateString()}`,
      scores: session.scores,
      skills: session.skills,
      stage: session.stage,
      duration: session.duration
    };

    // Generate report directly without Python service (faster and more reliable)
    const html = generateReportHTML(session, req.user.name || "Candidate");

    // Create reports directory
    const reportsDir = path.join(__dirname, "..", "..", "reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Create report document in database
    const reportDoc = await Report.create({
      interviewId: session._id,
      candidateId: userId,
      summary: `Overall Score: ${(session.scores.overall || 0).toFixed(1)}/10`,
      strengths: generateStrengths(session.scores),
      improvements: generateImprovements(session.scores),
      detailedScores: {
        communication: session.scores.communication || 0,
        technical: session.scores.technical || 0,
        confidence: session.scores.confidence || 0,
        coding: session.scores.coding || 0,
        overall: session.scores.overall || 0
      },
      recommendations: generateRecommendations(session.scores),
      learningRoadmap: [
        { week: 1, focus: "Data Structures & Algorithms" },
        { week: 2, focus: "System Design Fundamentals" },
        { week: 3, focus: "Technical Communication" },
        { week: 4, focus: "Mock Interview Practice" }
      ]
    });

    // Generate PDF filename and set URL immediately
    const pdfFilename = `report-${reportDoc._id}.pdf`;
    const outPath = path.join(reportsDir, pdfFilename);
    reportDoc.pdfUrl = `/reports/${pdfFilename}`; // Set URL immediately

    await reportDoc.save(); // Save with pdfUrl

    // Generate PDF in background (fire and forget)
    createPdfFromHtml(html, outPath)
      .then(() => logger.info(`PDF generated for report ${reportDoc._id}`))
      .catch(err => logger.error('PDF generation failed:', err));

    logger.info(`Report generated: ${reportDoc._id} for session: ${session._id}`);

    // Return immediately with report including pdfUrl
    res.json({
      reportId: reportDoc._id,
      pdfUrl: reportDoc.pdfUrl,
      report: reportDoc.toObject()
    });

  } catch (err) {
    logger.error("Report Generation Error:", err);
    return res.status(500).json({ error: "Report generation failed" });
  }
};

// Helper functions for report generation
function generateStrengths(scores) {
  const strengths = [];
  if (scores.communication >= 7) strengths.push("Strong communication skills demonstrated throughout the interview");
  if (scores.technical >= 7) strengths.push("Solid technical knowledge and problem-solving ability");
  if (scores.confidence >= 7) strengths.push("Confident and composed responses");
  if (scores.coding >= 7) strengths.push("Good understanding of coding principles and algorithms");
  if (scores.overall >= 7) strengths.push("Overall strong performance across all interview stages");
  if (strengths.length === 0) strengths.push("Completed all interview stages successfully");
  return strengths;
}

function generateImprovements(scores) {
  const improvements = [];
  if (scores.communication < 6) improvements.push("Work on articulating thoughts more clearly");
  if (scores.technical < 6) improvements.push("Strengthen technical fundamentals and concepts");
  if (scores.confidence < 6) improvements.push("Build confidence through more practice interviews");
  if (scores.coding < 6) improvements.push("Practice more coding problems and algorithms");
  if (improvements.length === 0) improvements.push("Continue practicing to maintain high performance");
  return improvements;
}

function generateRecommendations(scores) {
  return [
    "Practice technical interviews regularly using platforms like LeetCode or HackerRank",
    "Review fundamental computer science concepts",
    "Work on communication skills by explaining technical concepts to others",
    "Take mock interviews to build confidence",
    "Study system design patterns and best practices"
  ];
}

function generateReportHTML(session, candidateName) {
  const scores = session.scores || {};
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    h1 { color: #4F46E5; border-bottom: 3px solid #4F46E5; padding-bottom: 10px; }
    h2 { color: #6366F1; margin-top: 30px; }
    .score-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; margin: 20px 0; }
    .score-card { background: #F3F4F6; padding: 15px; border-radius: 8px; text-align: center; }
    .score-value { font-size: 32px; font-weight: bold; color: #4F46E5; }
    .score-label { font-size: 12px; color: #6B7280; margin-top: 5px; }
    ul { line-height: 1.8; }
    .section { margin: 30px 0;  background: #FAFAFA; padding: 20px; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>Interview Performance Report</h1>
  <p><strong>Candidate:</strong> ${candidateName}</p>
  <p><strong>Date:</strong> ${new Date(session.completedAt || session.startedAt).toLocaleDateString()}</p>
  
  <div class="section">
    <h2>Performance Scores</h2>
    <div class="score-grid">
      <div class="score-card">
        <div class="score-value">${(scores.overall || 0).toFixed(1)}</div>
        <div class="score-label">Overall</div>
      </div>
      <div class="score-card">
        <div class="score-value">${(scores.communication || 0).toFixed(1)}</div>
        <div class="score-label">Communication</div>
      </div>
      <div class="score-card">
        <div class="score-value">${(scores.technical || 0).toFixed(1)}</div>
        <div class="score-label">Technical</div>
      </div>
      <div class="score-card">
        <div class="score-value">${(scores.confidence || 0).toFixed(1)}</div>
        <div class="score-label">Confidence</div>
      </div>
      <div class="score-card">
        <div class="score-value">${(scores.coding || 0).toFixed(1)}</div>
        <div class="score-label">Coding</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>✨ Strengths</h2>
    <ul>
      ${generateStrengths(scores).map(s => `<li>${s}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <h2>🎯 Areas for Improvement</h2>
    <ul>
      ${generateImprovements(scores).map(i => `<li>${i}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <h2>💡 Recommendations</h2>
    <ul>
      ${generateRecommendations(scores).map(r => `<li>${r}</li>`).join('')}
    </ul>
  </div>
</body>
</html>
  `;
}


/**
 * Get all reports for current user
 * GET /api/report/list
 */
exports.getUserReports = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 20, page = 1 } = req.query;

    const reports = await Report.find({ candidateId: userId })
      .populate('interviewId', 'startedAt completedAt stage skills')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Report.countDocuments({ candidateId: userId });

    res.json({
      reports,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (err) {
    logger.error("Get User Reports Error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

/**
 * Get specific report by ID
 * GET /api/report/:id
 */
exports.getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const report = await Report.findOne({
      _id: id,
      candidateId: userId
    }).populate('interviewId');

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ report });

  } catch (err) {
    logger.error("Get Report Error:", err);
    res.status(500).json({ error: "Cannot fetch report" });
  }
};

/**
 * Download PDF report
 * GET /api/report/download/:id
 */
exports.download = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const report = await Report.findOne({
      _id: id,
      candidateId: userId
    });

    if (!report || !report.pdfUrl) {
      return res.status(404).send("Report not found");
    }

    const filePath = path.join(__dirname, "..", "..", report.pdfUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("PDF file not found");
    }

    res.download(filePath);

  } catch (err) {
    logger.error("Download Report Error:", err);
    res.status(500).json({ error: "Download failed" });
  }
};
