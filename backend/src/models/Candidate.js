const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    currentCompany: String,
    currentTitle: String,
    experienceYears: Number,
    skills: [String],
    education: [
      {
        degree: String,
        institution: String,
        year: String
      }
    ],
    tags: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', CandidateSchema);
