require("dotenv").config();

console.log("DEBUG → Loaded MONGO_URI:", process.env.MONGO_URI);
console.log("DEBUG → Loaded PORT:", process.env.PORT);
console.log("DEBUG → Current working dir:", process.cwd());

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./src/config/db");

// ROUTES
const authRoutes = require("./src/routes/auth.routes");
const resumeRoutes = require("./src/routes/resume.routes");
const interviewRoutes = require("./src/routes/interview.routes");
const codingRoutes = require("./src/routes/coding.routes");
const reportRoutes = require("./src/routes/report.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static reports folder
app.use("/reports", express.static(path.join(__dirname, "reports")));

// Connect to DB
connectDB();

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "AI Interviewer Backend Running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/interview", interviewRoutes);
app.use("/api/code", codingRoutes);
app.use("/api/report", reportRoutes);

// PORT
const PORT = process.env.PORT || 4000;

// Start Server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
