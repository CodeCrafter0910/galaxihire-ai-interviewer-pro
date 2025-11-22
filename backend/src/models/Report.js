const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    summary: String,
    strengths: [String],
    improvements: [String],
    detailedScores: mongoose.Schema.Types.Mixed,
    recommendations: [String],
    pdfUrl: String,
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

ReportSchema.index({ interviewId: 1 });
module.exports = mongoose.model('Report', ReportSchema);
