const rateLimit = require('express-rate-limit');

// Disable rate limiting for now - will enable per-route as needed
const apiLimiter = (req, res, next) => {
  next(); // Pass through without limiting
};

module.exports = apiLimiter;
