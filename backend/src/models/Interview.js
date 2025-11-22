const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    qid: String,
    text: String,
    type: { type: String, enum: ['hr','technical','coding','trick','followup'], default: 'technical' },
    meta: mongoose.Schema.Types.Mixed
  },
  { _id: false }
);

const AnswerSchema = new mongoose.Schema(
  {
    qid: String,
    text: String,
    textTranscript: String,
    audioUrl: String,
    videoUrl: String,
    startAt: Date,
    endAt: Date,
    score: Number,
    evaluator: mongoose.Schema.Types.Mixed
  },
  { timestamps: true, _id: false }
);

const InterviewSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sessionName: String,
    stage: { type: String, enum: ['scheduled','ongoing','completed','cancelled'], default: 'scheduled' },
    questions: [QuestionSchema],
    answers: [AnswerSchema],
    transcript: String,
    durationSeconds: Number,
    scores: {
      communication: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
      confidence: { type: Number, default: 0 },
      coding: { type: Number, default: 0 },
      overall: { type: Number, default: 0 }
    },
    meta: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

InterviewSchema.index({ candidateId: 1, createdAt: -1 });

module.exports = mongoose.model('Interview', InterviewSchema);
