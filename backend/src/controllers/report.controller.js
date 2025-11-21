const fs = require("fs");
const path = require("path");
const { generateReport } = require("../services/reportService");
const Report = require("../models/Report");

const puppeteer = require("puppeteer");

async function createPdfFromHtml(html, outPath) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outPath, format: "A4", printBackground: true });
  await browser.close();
}

exports.generateAndSave = async (req, res) => {
  try {
    const interview = req.body.interview;
    const pythonReport = await generateReport(interview);

    const html = pythonReport.html || "<html><body>No content</body></html>";

    const reportsDir = path.join(__dirname, "..", "..", "..", "reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const reportDoc = await Report.create({
      interviewId: interview._id || null,
      candidateId: interview.candidateId || null,
      summary: `Overall ${pythonReport.overall}`,
      strengths: pythonReport.strengths,
      improvements: pythonReport.improvements,
      detailedScores: pythonReport,
      recommendations: pythonReport.recommendations
    });

    const outPath = path.join(reportsDir, `report-${reportDoc._id}.pdf`);
    await createPdfFromHtml(html, outPath);

    reportDoc.pdfUrl = `/reports/report-${reportDoc._id}.pdf`;
    await reportDoc.save();

    res.json({ reportId: reportDoc._id, pdfUrl: reportDoc.pdfUrl, report: pythonReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "report generation failed" });
  }
};

exports.getReport = async (req, res) => {
  try {
    const id = req.params.id;
    const r = await Report.findById(id);
    res.json(r);
  } catch (err) {
    res.status(500).json({ error: "cannot fetch report" });
  }
};

exports.download = async (req, res) => {
  try {
    const id = req.params.id;
    const r = await Report.findById(id);
    if (!r || !r.pdfUrl) return res.status(404).send("Not found");
    const filePath = path.join(__dirname, "..", "..", "..", r.pdfUrl);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: "download failed" });
  }
};
