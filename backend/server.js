require('dotenv').config();

console.log("DEBUG → Loaded MONGO_URI:", process.env.MONGO_URI);
console.log("DEBUG → Loaded PORT:", process.env.PORT);
console.log("DEBUG → Current working dir:", process.cwd());

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/auth.routes');
const resumeRoutes = require('./src/routes/resume.routes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'AI Interviewer Backend Running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.use('/interview', require('./src/routes/interview.routes'));
