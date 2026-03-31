const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 180,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Slow down and try again in a moment.",
  },
  handler: (req, res, next, options) => {
    res.setHeader('Retry-After', Math.ceil(options.windowMs / 1000));
    res.status(options.statusCode).json({
      error: options.message.error,
      details: "You are hitting the API limit. This may happen during frequent resume uploads."
    });
  }
});

module.exports = apiLimiter;
