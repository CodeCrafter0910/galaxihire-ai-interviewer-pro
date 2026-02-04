const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/interview.controller.js');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// New session-based interview routes
router.post('/start', auth, ctrl.startInterview);
router.post('/continue', auth, ctrl.continueInterview);
router.post('/complete', auth, ctrl.completeInterview);
router.get('/history', auth, ctrl.getInterviewHistory);
router.delete('/:sessionId', auth, ctrl.deleteInterview);
router.get('/:sessionId', auth, ctrl.getInterviewSession);

// Audio answer processing (Whisper STT)
router.post('/audio', upload.single('audio'), ctrl.processAudioAnswer);

// Video upload (optional)
router.post('/upload-video', upload.single('video'), ctrl.uploadVideo);

// Legacy route (deprecated)
router.post('/ask', ctrl.askQuestion);

module.exports = router;
