const InterviewSession = require('../models/InterviewSession.js');
const { generateQuestion, evaluateAnswer } = require('../services/llmService');
const logger = require('../logger');
const axios = require('axios');

// Python service URL
const PY_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

// Audio + Video services
const { sendAudioToWhisper } = require('../services/whisperService');
const { sendVideoForAnalysis } = require('../services/videoUpload.service');

/**
 * Start a new interview session
 * POST /api/interview/start
 */
exports.startInterview = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { skills = [], resumeId } = req.body;

    // Create new interview session
    const session = await InterviewSession.create({
      userId,
      skills: skills.length > 0 ? skills : ['general'],
      resumeId: resumeId || null,
      status: 'in-progress',
      stage: 'aptitude'
    });

    // Generate first question
    const { question, metadata } = await generateQuestion({
      stage: 'aptitude',
      skills: session.skills,
      conversationHistory: [],
      context: { isFirstQuestion: true }
    });

    // Add AI's first message to conversation
    session.conversation.push({
      role: 'ai',
      content: question,
      metadata
    });

    await session.save();

    logger.info(`Interview started: ${session._id} for user: ${userId}`);

    res.json({
      sessionId: session._id,
      question,
      stage: session.stage,
      message: 'Interview session started successfully'
    });

  } catch (error) {
    logger.error('Start Interview Error:', error);
    res.status(500).json({ error: 'Failed to start interview session' });
  }
};

/**
 * Continue interview - submit answer and get next question
 * POST /api/interview/continue
 */
exports.continueInterview = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;
    const userId = req.user.id;

    if (!sessionId || !answer) {
      return res.status(400).json({ error: 'Session ID and answer are required' });
    }

    // Find session
    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    if (session.status !== 'in-progress') {
      return res.status(400).json({ error: 'Interview session is not active' });
    }

    // Add user's answer to conversation with stage tracking
    session.conversation.push({
      role: 'user',
      content: answer,
      stage: session.stage, // Track which stage this answer belongs to
      timestamp: new Date()
    });

    // Get last AI question from conversation
    const lastAIMessage = session.conversation
      .slice()
      .reverse()
      .find(msg => msg.role === 'ai');

    const lastQuestion = lastAIMessage ? lastAIMessage.content : '';

    // Evaluate the answer
    const evaluation = await evaluateAnswer({
      question: lastQuestion,
      answer,
      stage: session.stage,
      skills: session.skills
    });

    // Update scores (accumulate and average)
    if (evaluation.scores) {
      const questionCount = session.conversation.filter(m => m.role === 'user').length;
      session.scores.communication =
        ((session.scores.communication * (questionCount - 1)) + (evaluation.scores.clarity || 0)) / questionCount;
      session.scores.technical =
        ((session.scores.technical * (questionCount - 1)) + (evaluation.scores.technical || 0)) / questionCount;
      session.scores.confidence =
        ((session.scores.confidence * (questionCount - 1)) + (evaluation.scores.confidence || 0)) / questionCount;

      session.scores.overall =
        (session.scores.communication + session.scores.technical + session.scores.confidence) / 3;
    }


    // Professional Interview Structure:
    // Aptitude: 10 questions (Q1-Q10)
    // Coding/DSA: 2 questions (Q11-Q12)
    // Technical: 5 questions (Q13-Q17)
    // HR: 5 questions (Q18-Q22)
    // Total: 22 questions
    const totalAnswered = session.conversation.filter(m => m.role === 'user').length;

    let nextStage = session.stage;

    if (totalAnswered >= 22) {
      // Interview complete after 22 questions
      nextStage = 'completed';
    } else if (totalAnswered >= 17 && session.stage === 'technical') {
      // After 17 questions (10 apt + 2 coding + 5 tech), move to HR
      nextStage = 'hr';
    } else if (totalAnswered >= 12 && session.stage === 'coding') {
      // After 12 questions (10 apt + 2 coding), move to technical
      nextStage = 'technical';
    } else if (totalAnswered >= 10 && session.stage === 'aptitude') {
      // After 10 aptitude questions, move to coding
      nextStage = 'coding';
    }

    session.stage = nextStage;


    // Check if interview is complete
    if (nextStage === 'completed') {
      session.status = 'completed';
      session.completedAt = new Date();
      await session.save();

      return res.json({
        completed: true,
        message: 'Interview completed successfully!',
        sessionId: session._id,
        scores: session.scores
      });
    }

    // Generate next question
    const { question, metadata } = await generateQuestion({
      stage: nextStage,
      skills: session.skills,
      conversationHistory: session.conversation,
      context: {
        previousEvaluation: evaluation,
        currentScores: session.scores
      }
    });

    // Add new AI question to conversation
    session.conversation.push({
      role: 'ai',
      content: question,
      metadata
    });

    await session.save();

    res.json({
      question,
      stage: nextStage,
      sessionId: session._id,
      evaluation: {
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements
      },
      completed: false
    });

  } catch (error) {
    logger.error('Continue Interview Error:', error);
    res.status(500).json({ error: 'Failed to process interview answer' });
  }
};

/**
 * Complete interview manually
 * POST /api/interview/complete
 */
exports.completeInterview = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    session.status = 'completed';
    session.stage = 'completed';
    session.completedAt = new Date();

    await session.save();

    logger.info(`Interview completed: ${session._id}`);

    res.json({
      message: 'Interview completed successfully',
      sessionId: session._id,
      scores: session.scores,
      duration: session.duration
    });

  } catch (error) {
    logger.error('Complete Interview Error:', error);
    res.status(500).json({ error: 'Failed to complete interview' });
  }
};

/**
 * Get interview history for current user
 * GET /api/interview/history
 */
exports.getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, page = 1 } = req.query;

    const sessions = await InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-conversation'); // Exclude full conversation for list view

    const total = await InterviewSession.countDocuments({ userId });

    res.json({
      sessions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    logger.error('Get Interview History Error:', error);
    res.status(500).json({ error: 'Failed to retrieve interview history' });
  }
};

/**
 * Get specific interview session details
 * GET /api/interview/:sessionId
 */
exports.getInterviewSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    res.json({ session });

  } catch (error) {
    logger.error('Get Interview Session Error:', error);
    res.status(500).json({ error: 'Failed to retrieve interview session' });
  }
};

/**
 * Process audio answer (for voice interviews)
 * POST /api/interview/audio
 */
exports.processAudioAnswer = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const filename = req.file.originalname || 'audio.wav';
    const audioBuffer = req.file.buffer;

    // Call Python service for transcription AND voice analysis
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('audio', audioBuffer, { filename });

    const response = await axios.post(`${PY_URL}/audio/transcribe-and-analyze`, formData, {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });

    const { text, analysis, success } = response.data;

    logger.info('Audio transcribed and analyzed successfully');

    return res.json({
      text,
      analysis: analysis || {},
      success: success !== false,
      message: 'Audio transcribed and analyzed successfully'
    });

  } catch (error) {
    logger.error('Audio Processing Error:', error);

    // Fallback: try transcription only if analysis fails
    try {
      const text = await sendAudioToWhisper(req.file.buffer, req.file.originalname);
      return res.json({
        text,
        analysis: null,
        success: true,
        message: 'Audio transcribed (analysis unavailable)'
      });
    } catch (fallbackError) {
      res.status(500).json({ error: 'Failed to process audio' });
    }
  }
};

/**
 * Upload video (for video interviews)
 * POST /api/interview/video
 */
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const buffer = req.file.buffer;

    // Send video to analysis service (optional)
    const analysis = await sendVideoForAnalysis(buffer);

    res.json({
      message: 'Video uploaded successfully',
      analysis
    });

  } catch (error) {
    logger.error('Video Upload Error:', error);
    res.status(500).json({ error: 'Video processing failed' });
  }
};

/**
 * Delete an interview session
 * DELETE /api/interview/:sessionId
 */
exports.deleteInterview = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Find and delete the session, ensuring it belongs to the user
    const session = await InterviewSession.findOneAndDelete({
      _id: sessionId,
      userId: userId
    });

    if (!session) {
      return res.status(404).json({
        error: 'Interview session not found or you do not have permission to delete it'
      });
    }

    logger.info(`Interview session ${sessionId} deleted by user ${userId}`);
    res.json({
      success: true,
      message: 'Interview session deleted successfully'
    });

  } catch (error) {
    logger.error('Delete Interview Error:', error);
    res.status(500).json({ error: 'Failed to delete interview session' });
  }
};

// Legacy endpoint for backward compatibility (deprecated)
exports.askQuestion = async (req, res) => {
  res.status(410).json({
    error: 'This endpoint is deprecated. Use /start and /continue instead.',
    message: 'Please update your client to use the new session-based interview flow'
  });
};
