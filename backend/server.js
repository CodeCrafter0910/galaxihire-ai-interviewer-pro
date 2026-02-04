require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require("path");

const { initSentry } = require('./src/sentry');
const logger = require('./src/logger');
const apiLimiter = require('./src/middleware/rateLimit');

const connectDB = require('./src/config/db');

// Routes
const authRoutes = require('./src/routes/auth.routes');
const resumeRoutes = require('./src/routes/resume.routes');
const interviewRoutes = require('./src/routes/interview.routes');
const codeRoutes = require('./src/routes/coding.routes');
const reportRoutes = require('./src/routes/report.routes');
const videoRoutes = require('./src/routes/video.routes');


initSentry();

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/reports", express.static(path.join(__dirname, "reports")));

connectDB();

// Apply rate limit middleware
app.use('/api', apiLimiter);

// Health check (KEEP BEFORE listen)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'AI Interviewer Backend Running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/video', videoRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
