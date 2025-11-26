require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require("path");

const { initSentry } = require('./src/sentry');
const logger = require('./src/logger');
const apiLimiter = require('./src/middleware/rateLimit');

const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/auth.routes');
const resumeRoutes = require('./src/routes/resume.routes');

initSentry();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/reports", express.static(path.join(__dirname, "reports")));

connectDB();

app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.json({ message: 'AI Interviewer Backend Running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', require('./src/routes/interview.routes'));
app.use("/api/code", require("./src/routes/coding.routes"));
app.use("/api/report", require("./src/routes/report.routes"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
