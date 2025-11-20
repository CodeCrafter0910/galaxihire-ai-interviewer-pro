const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../../.env' });

const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Interview = require('../models/Interview');
const Report = require('../models/Report');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.create({
    name: 'Test User',
    email: 'testuser@example.com',
    passwordHash: 'x'
  });

  const candidate = await Candidate.create({
    userId: user._id,
    currentCompany: 'Acme',
    currentTitle: 'SWE',
    experienceYears: 2,
    skills: ['javascript', 'node']
  });

  const interview = await Interview.create({
    candidateId: candidate._id,
    interviewerId: user._id,
    sessionName: 'Sample Session',
    questions: [{ qid: 'q1', text: 'Tell me about yourself', type: 'hr' }],
    answers: [{ qid: 'q1', text: 'I am...', score: 7 }]
  });

  const report = await Report.create({
    interviewId: interview._id,
    candidateId: candidate._id,
    summary: 'OK',
    strengths: ['communication'],
    improvements: ['algorithms'],
    detailedScores: interview.scores,
    recommendations: ['Study DSA']
  });

  console.log('created', {
    user: user._id.toString(),
    candidate: candidate._id.toString(),
    interview: interview._id.toString(),
    report: report._id.toString()
  });

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
