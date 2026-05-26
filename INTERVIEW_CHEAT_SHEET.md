# GalaxiHire - Quick Interview Cheat Sheet

## 🎯 30-Second Elevator Pitch

"GalaxiHire is an AI-powered interview platform that automates the entire interview process. Candidates upload their resume, and our AI conducts a complete interview with aptitude, coding, technical, and HR questions. Candidates can answer via voice, video, or text. The system evaluates answers in real-time and generates a comprehensive performance report with scores and feedback."

---

## 💡 Key Features (Memorize These!)

1. **Resume Upload & Parsing** - AI extracts skills and experience
2. **Multi-Modal Answers** - Voice, Video, or Text responses
3. **4-Stage Interview** - Aptitude (10Q) → Coding (2Q) → Technical (5Q) → HR (5Q)
4. **Real-Time Evaluation** - AI scores each answer instantly
5. **Detailed Reports** - PDF with scores, strengths, and improvements

---

## 🛠️ Tech Stack (One-Liner Each)

**Frontend:**
- Next.js - React framework for the UI
- TypeScript - Type-safe JavaScript
- TailwindCSS - Utility-first CSS styling
- Axios - HTTP client for API calls

**Backend:**
- Node.js + Express - Server and REST API
- MongoDB - NoSQL database for data storage
- JWT - Token-based authentication
- Multer - File upload handling

**AI Services:**
- Groq AI (LLaMA 3) - Question generation and evaluation
- Whisper - Speech-to-text transcription
- Python FastAPI - Audio/video analysis service

**Tools:**
- Puppeteer - PDF report generation
- Monaco Editor - Code editor component
- WebRTC - Real-time audio/video capture

---

## 🔄 How It Works (Simple Flow)

1. User registers → Gets JWT token
2. User uploads resume → AI extracts skills
3. User starts interview → AI generates Q1
4. User answers (voice/video/text) → AI transcribes if needed
5. AI evaluates answer → Gives scores
6. AI generates next question → Repeat 22 times
7. Interview completes → Generate PDF report

---

## 📊 Interview Structure

| Stage | Questions | Topics |
|-------|-----------|--------|
| Aptitude | 10 | Logic, Math, Verbal |
| Coding | 2 | DSA, Algorithms |
| Technical | 5 | Resume-based skills |
| HR | 5 | Behavioral, Goals |
| **Total** | **22** | **Complete Interview** |

---

## 🎤 Audio Recording (How It Works)

1. User clicks "🎤 Start Speaking"
2. Browser requests microphone permission
3. MediaRecorder API starts recording
4. User speaks answer
5. User clicks "⏹ Stop"
6. Audio converted to WAV blob
7. Sent to backend via FormData
8. Python service uses Whisper AI
9. Returns transcribed text + voice analysis
10. Frontend displays text

**Code Location:** rontend/src/components/AudioRecorder/index.jsx

---

## 🎥 Video Recording (How It Works)

1. User clicks "🎥 Start Video Recording"
2. Browser requests camera + mic permission
3. Shows 3-2-1 countdown
4. MediaRecorder starts recording
5. User answers on camera
6. User clicks "⏹ Stop Recording"
7. Shows preview of recorded video
8. User clicks "✓ Submit Video"
9. Video converted to WebM blob
10. Sent to backend for storage
11. (Optional) Facial expression analysis

**Code Location:** rontend/src/components/VideoRecorder.tsx

---

## 💻 Code Editor (How It Works)

1. User sees coding question
2. Monaco Editor loads (like VS Code)
3. User writes code in Python/JS/Java
4. User clicks "Run Code"
5. Code sent to sandbox service
6. Executes in isolated Docker container
7. Returns output or errors
8. AI evaluates code quality

**Code Location:** rontend/src/components/CodeEditor.tsx

---

## 🔐 Authentication (How It Works)

**Registration:**
`
User → { name, email, password }
Backend → Hash password with bcrypt
Backend → Save to MongoDB
Backend → Generate JWT token
Frontend → Store token in localStorage
`

**Login:**
`
User → { email, password }
Backend → Find user in MongoDB
Backend → Compare password with bcrypt
Backend → Generate JWT token
Frontend → Store token in localStorage
`

**Protected Routes:**
`
Frontend → Add header: Authorization: Bearer <token>
Backend → Middleware verifies token
Backend → If valid → Allow request
Backend → If invalid → Return 401
`

---

## 🤖 AI Integration (How It Works)

**Question Generation:**
`
Backend → llmService.generateQuestion()
Backend → Call Groq API
Groq → LLaMA 3 model generates question
Backend → Save to conversation
Frontend → Display question
`

**Answer Evaluation:**
`
User → Submits answer
Backend → llmService.evaluateAnswer()
Backend → Call Groq API
Groq → Analyzes answer quality
Groq → Returns scores (clarity, technical, confidence)
Backend → Update session scores
Backend → Generate next question
`

---

## 📈 Scoring System

**4 Main Scores (0-10 scale):**

1. **Communication** - Clarity, grammar, articulation
2. **Technical** - Correctness, depth of knowledge
3. **Confidence** - Voice tone, hesitation, pace
4. **Overall** - Average of all scores

**Calculated After Each Answer:**
`javascript
newScore = (oldScore * questionCount + currentScore) / (questionCount + 1)
`

---

## 🗄️ Database Collections

**users:**
`javascript
{ _id, name, email, passwordHash, role, createdAt }
`

**resumes:**
`javascript
{ _id, userId, filename, parsedData: { skills, experience }, uploadedAt }
`

**interviewsessions:**
`javascript
{
  _id, userId, resumeId, status, stage,
  conversation: [{ role, content, timestamp }],
  scores: { overall, communication, technical, confidence },
  createdAt, completedAt
}
`

**reports:**
`javascript
{ _id, sessionId, userId, pdfPath, scores, generatedAt }
`

---

## 🚀 Deployment

**Development:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4005
- MongoDB: mongodb://localhost:27017

**Production:**
- Frontend: Vercel (Static export)
- Backend: Render (Node.js service)
- Database: MongoDB Atlas (Cloud)
- Python: Render (FastAPI service)

---

## 🎯 Common Interview Questions & Answers

**Q: What problem does your project solve?**
A: "It automates the interview process, saving time for recruiters and providing consistent, unbiased evaluation for candidates. It also helps candidates practice interviews and get instant feedback."

**Q: What was the most challenging part?**
A: "Integrating real-time audio/video recording with browser APIs, handling different audio formats, and ensuring the AI generates relevant questions based on the candidate's resume."

**Q: How do you ensure security?**
A: "We use JWT for authentication, bcrypt for password hashing, rate limiting to prevent abuse, and CORS to restrict API access. All sensitive data is stored securely in MongoDB."

**Q: How scalable is your system?**
A: "The architecture is microservices-based with separate frontend, backend, and AI services. We use MongoDB for horizontal scaling, and services can be deployed independently. Rate limiting prevents overload."

**Q: What would you improve?**
A: "Add real-time video analysis for facial expressions, implement WebSocket for live feedback, add more programming languages for coding questions, and create a recruiter dashboard to review candidates."

---

## 📝 Key Files to Know

| File | Purpose |
|------|---------|
| ackend/server.js | Main entry point, routes setup |
| ackend/src/services/llmService.js | AI question generation |
| rontend/src/components/AudioRecorder/ | Voice recording |
| rontend/src/components/VideoRecorder.tsx | Video recording |
| rontend/src/app/interview/live/page.tsx | Live interview UI |
| ackend/src/controllers/interview.controller.js | Interview logic |
| ackend/src/models/InterviewSession.js | Interview data schema |

---

## 🔧 Environment Variables (Important!)

**Backend (.env):**
`
PORT=4005
MONGO_URI=mongodb://localhost:27017/galaxihire
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
PYTHON_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
`

**Frontend (.env.local):**
`
NEXT_PUBLIC_API_URL=http://localhost:4005
`

---

## 💪 Your Contributions (Customize This!)

**What I Built:**
- [ ] Frontend interview interface
- [ ] Audio/video recording components
- [ ] Backend API endpoints
- [ ] AI integration (Groq, Whisper)
- [ ] Database schema design
- [ ] Authentication system
- [ ] Report generation
- [ ] Full-stack integration

**Technologies I Used:**
- [ ] Next.js / React
- [ ] Node.js / Express
- [ ] MongoDB
- [ ] AI APIs (Groq, Whisper)
- [ ] WebRTC / MediaRecorder
- [ ] JWT Authentication
- [ ] REST API design

---

## 🎓 Learning Outcomes

**What I Learned:**
1. Building full-stack applications with Next.js and Node.js
2. Integrating AI services (LLMs, speech-to-text)
3. Real-time audio/video capture with browser APIs
4. JWT-based authentication and security
5. MongoDB database design and queries
6. RESTful API design and best practices
7. Deployment on cloud platforms (Vercel, Render)

---

## 🚀 Future Enhancements

1. **Real-time Feedback** - WebSocket for live scoring
2. **Video Analysis** - Facial expression and emotion detection
3. **Recruiter Dashboard** - View and compare candidates
4. **More Languages** - Support for C++, Go, Rust in code editor
5. **Mock Interviews** - Practice mode with instant feedback
6. **Interview Scheduling** - Calendar integration
7. **Team Interviews** - Multi-interviewer support
8. **Analytics Dashboard** - Performance trends over time

---

**Print this out and keep it handy for your interview! Good luck! 🎯**
