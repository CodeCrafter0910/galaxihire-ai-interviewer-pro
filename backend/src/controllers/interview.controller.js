const Candidate = require('../models/Candidate');
const Interview = require('../models/Interview');
const { getNextQuestion } = require('../services/aiService');

exports.startInterview = async (req, res) => {
  const { candidateId } = req.body;
  const interview = await Interview.create({
    candidateId,
    stage: 'hr',
    questions: [],
    answers: []
  });
  res.json({ interviewId: interview._id, stage: 'hr' });
};

exports.nextQuestion = async (req, res) => {
  const { interviewId } = req.body;
  const interview = await Interview.findById(interviewId).populate('candidateId');
  const skills = interview.candidateId.skills || [];
  const out = await getNextQuestion(interview.stage, skills);
  interview.questions.push({ qid: `q${interview.questions.length+1}`, text: out.question, type: interview.stage });
  interview.stage = out.nextStage;
  await interview.save();
  res.json(out);
};

exports.submitAnswer = async (req, res) => {
  const { interviewId, qid, answer } = req.body;
  const interview = await Interview.findById(interviewId);
  interview.answers.push({ qid, text: answer });
  await interview.save();
  res.json({ ok: true });
};

exports.endInterview = async (req, res) => {
  const { interviewId } = req.body;
  const interview = await Interview.findById(interviewId);
  interview.stage = "completed";
  await interview.save();
  res.json({ status: "completed" });
};
