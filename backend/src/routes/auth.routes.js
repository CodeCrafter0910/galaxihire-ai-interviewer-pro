const express = require('express');
const router = express.Router();

// Linux requires exact file paths + .js extension
const authController = require('../controllers/auth.controller.js');
const auth = require('../middleware/auth.js');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);

module.exports = router;
