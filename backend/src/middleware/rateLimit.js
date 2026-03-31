const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // allow 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
