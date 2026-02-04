const mongoose = require('mongoose');

const ConversationMessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['ai', 'user', 'system'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    // Voice analysis (if audio was used)
    voiceAnalysis: {
        confidence_score: Number,
        tone_classification: String,
        speech_rate: Number,
        pitch_variation: Number,
        energy_level: Number,
        clarity_score: Number,
        emotional_state: String
    }
}, { _id: false });

const InterviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'abandoned'],
        default: 'in-progress'
    },
    stage: {
        type: String,
        enum: ['aptitude', 'coding', 'technical', 'hr', 'completed'],
        default: 'aptitude'
    },
    skills: [{
        type: String
    }],
    conversation: [ConversationMessageSchema],

    // Tracking
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },

    // Optional resume reference
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume'
    },

    // Scores accumulated during interview
    scores: {
        communication: { type: Number, default: 0 },
        technical: { type: Number, default: 0 },
        confidence: { type: Number, default: 0 },
        coding: { type: Number, default: 0 },
        overall: { type: Number, default: 0 }
    },

    // Metadata for additional tracking
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // Voice analysis data
    voiceAnalytics: {
        averageConfidence: { type: Number, default: 0 },
        dominantTone: { type: String },
        averageSpeechRate: { type: Number, default: 0 },
        emotionalState: { type: String },
        clarityScore: { type: Number, default: 0 },
        analysisCount: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
InterviewSessionSchema.index({ userId: 1, createdAt: -1 });
InterviewSessionSchema.index({ status: 1 });

// Calculate duration
InterviewSessionSchema.virtual('duration').get(function () {
    if (this.completedAt && this.startedAt) {
        return Math.floor((this.completedAt - this.startedAt) / 1000); // in seconds
    }
    return null;
});

// Ensure virtuals are included in JSON
InterviewSessionSchema.set('toJSON', { virtuals: true });
InterviewSessionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
