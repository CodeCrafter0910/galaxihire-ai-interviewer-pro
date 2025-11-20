const router = require('express').Router();
const c = require('../controllers/interview.controller');

router.post('/start', c.startInterview);
router.post('/next', c.nextQuestion);
router.post('/answer', c.submitAnswer);
router.post('/end', c.endInterview);

module.exports = router;
