# GalaxiHire - Simple Project Explanation

## What is GalaxiHire?
GalaxiHire is an **AI-powered interview platform** that conducts automatic job interviews with candidates. It asks questions, records answers (voice/video/text), evaluates performance, and generates a detailed report.

Think of it like: **A robot interviewer that tests candidates and gives them scores!**

---

## 🎯 Main Features (What it Does)

1. **Upload Resume** - Candidate uploads their resume (PDF)
2. **AI Asks Questions** - System generates questions based on resume
3. **Answer in 3 Ways**:
   - 🎤 **Voice** (speak your answer)
   - 🎥 **Video** (record yourself answering)
   - 💻 **Code** (write code for coding questions)
4. **AI Evaluates** - Checks your answers and gives scores
5. **Generate Report** - Creates a PDF report with scores and feedback

---

## 🏗️ System Architecture (How Everything Connects)


```
┌─────────────────────────────────────────────────────────────────┐
│                      GALAXIHIRE SYSTEM                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   FRONTEND   │         │   BACKEND    │         │  EXTERNAL    │
│   (Next.js)  │◀───────▶│  (Node.js)   │◀───────▶│  SERVICES    │
│              │         │              │         │              │
│  Port 3000   │         │  Port 4005   │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
      │                         │                         │
      │                         │                         │
   User sees              Processes data            AI Services
   website                Stores in DB              (Groq, Whisper)
```

---

## 📱 FRONTEND (What User Sees)

### Technology Used:
- **Next.js** (React framework)
- **TypeScript** (for type safety)
- **TailwindCSS** (for styling/design)
- **Axios** (to call backend APIs)

### Main Pages:

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND STRUCTURE                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📄 /login              → User logs in                      │
│  📄 /register           → New user signs up                 │
│  📄 /dashboard          → Main dashboard after login        │
│  📄 /resume-upload      → Upload resume (PDF)               │
│  📄 /interview/new      → Start new interview               │
│  📄 /interview/live     → Live interview (Q&A)              │
│  📄 /report             → View interview report             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Components:

1. **AudioRecorder** (`/components/AudioRecorder/`)
   - Records voice using microphone
   - Converts to audio file (WAV format)
   - Sends to backend for transcription

2. **VideoRecorder** (`/components/VideoRecorder.tsx`)
   - Opens webcam
   - Records video with audio
   - Shows preview before submitting
   - Sends video to backend

3. **CodeEditor** (`/components/CodeEditor.tsx`)
   - Monaco Editor (like VS Code)
   - Write code in Python/JavaScript/Java
   - Submit code for execution

4. **Sidebar** & **TopNav**
   - Navigation menu
   - User profile
   - Logout button

---

## 🔧 BACKEND (Brain of the System)

### Technology Used:
- **Node.js** with **Express** (server)
- **MongoDB** (database to store data)
- **JWT** (for user authentication)
- **Multer** (for file uploads)
- **Puppeteer** (for PDF generation)
- **Axios** (to call external APIs)

### Folder Structure:

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              → MongoDB connection
│   │   └── env.js             → Environment variables
│   │
│   ├── models/                → Database schemas
│   │   ├── User.js            → User data (name, email, password)
│   │   ├── Resume.js          → Resume data
│   │   ├── InterviewSession.js → Interview data
│   │   └── Report.js          → Report data
│   │
│   ├── controllers/           → Handle requests
│   │   ├── auth.controller.js      → Login/Register
│   │   ├── resume.controller.js    → Resume upload
│   │   ├── interview.controller.js → Interview logic
│   │   ├── coding.controller.js    → Code execution
│   │   └── report.controller.js    → Report generation
│   │
│   ├── services/              → Business logic
│   │   ├── llmService.js           → AI question generation
│   │   ├── whisperService.js       → Audio transcription
│   │   ├── resumeParser.service.js → Parse resume
│   │   ├── codeExecService.js      → Execute code
│   │   └── reportGenerator.service.js → Generate PDF
│   │
│   ├── routes/                → API endpoints
│   │   ├── auth.routes.js
│   │   ├── resume.routes.js
│   │   ├── interview.routes.js
│   │   ├── coding.routes.js
│   │   └── report.routes.js
│   │
│   └── middleware/
│       ├── auth.js            → Check if user is logged in
│       └── rateLimit.js       → Prevent spam requests
│
└── server.js                  → Main entry point
```

---

## 🔄 DATA FLOW (Step by Step)

### 1️⃣ USER REGISTRATION & LOGIN

```
User fills form
      ↓
Frontend sends: { name, email, password }
      ↓
Backend → auth.controller.js
      ↓
Hash password (bcrypt)
      ↓
Save to MongoDB (User collection)
      ↓
Generate JWT token
      ↓
Send token back to frontend
      ↓
Frontend stores token in localStorage
```

### 2️⃣ RESUME UPLOAD

```
User selects PDF file
      ↓
Frontend sends file via FormData
      ↓
Backend → resume.controller.js
      ↓
Multer saves file temporarily
      ↓
Python service parses resume
      ↓
Extract: name, skills, experience, education
      ↓
Save to MongoDB (Resume collection)
      ↓
Return resume ID to frontend
```

### 3️⃣ START INTERVIEW

```
User clicks "Start Interview"
      ↓
Frontend calls: POST /api/interview/start
      ↓
Backend → interview.controller.js
      ↓
Create new InterviewSession in MongoDB
      ↓
Call llmService.generateQuestion()
      ↓
Groq AI generates first question
      ↓
Return question to frontend
      ↓
Frontend displays question
```

### 4️⃣ ANSWER QUESTION (Voice)

```
User clicks "🎤 Start Speaking"
      ↓
AudioRecorder component starts recording
      ↓
User speaks answer
      ↓
User clicks "⏹ Stop"
      ↓
Convert to audio blob (WAV)
      ↓
Send to: POST /api/interview/audio
      ↓
Backend → interview.controller.js
      ↓
Send audio to Python service
      ↓
Whisper AI transcribes speech to text
      ↓
Python analyzes: tone, confidence, clarity
      ↓
Return text + analysis to backend
      ↓
Backend sends to frontend
      ↓
Frontend displays transcribed text
```

### 5️⃣ ANSWER QUESTION (Video)

```
User clicks "🎥 Start Video Recording"
      ↓
VideoRecorder requests camera permission
      ↓
Shows 3-2-1 countdown
      ↓
Starts recording (video + audio)
      ↓
User answers question
      ↓
User clicks "⏹ Stop Recording"
      ↓
Shows preview of recorded video
      ↓
User clicks "✓ Submit Video"
      ↓
Convert to video blob (WebM)
      ↓
Send to: POST /api/interview/video
      ↓
Backend saves video
      ↓
(Optional) Analyze facial expressions
      ↓
Return success to frontend
```

### 6️⃣ EVALUATE ANSWER & GET NEXT QUESTION

```
User submits answer (text/voice/video)
      ↓
Frontend calls: POST /api/interview/continue
      ↓
Backend → interview.controller.js
      ↓
Call llmService.evaluateAnswer()
      ↓
Groq AI evaluates answer
      ↓
Generate scores:
  - Clarity: 7/10
  - Technical: 8/10
  - Confidence: 6/10
      ↓
Update scores in InterviewSession
      ↓
Check interview stage:
  - Aptitude (10 questions)
  - Coding (2 questions)
  - Technical (5 questions)
  - HR (5 questions)
      ↓
Generate next question
      ↓
Return to frontend
      ↓
Frontend displays next question
```

### 7️⃣ COMPLETE INTERVIEW & GENERATE REPORT

```
After 22 questions completed
      ↓
Backend marks status = "completed"
      ↓
Frontend redirects to /report page
      ↓
Frontend calls: GET /api/report/:sessionId
      ↓
Backend → report.controller.js
      ↓
Fetch InterviewSession from MongoDB
      ↓
Calculate final scores
      ↓
Generate PDF using Puppeteer:
  - Overall score
  - Communication score
  - Technical score
  - Confidence score
  - Strengths & weaknesses
  - Question-by-question breakdown
      ↓
Save PDF to /reports folder
      ↓
Return PDF URL to frontend
      ↓
Frontend displays report + download button
```

---

## 🤖 AI SERVICES (External APIs)

### 1. **Groq AI** (Question Generation & Evaluation)
- **What it does**: Generates interview questions and evaluates answers
- **Model used**: `llama3-8b-8192`
- **API**: `https://api.groq.com/openai/v1/chat/completions`
- **Used in**: `llmService.js`

**Example Request:**
```javascript
{
  "model": "llama3-8b-8192",
  "messages": [
    { "role": "system", "content": "You are an expert interviewer" },
    { "role": "user", "content": "Generate a technical question about React" }
  ]
}
```

**Example Response:**
```javascript
{
  "question": "Explain the difference between useEffect and useLayoutEffect in React",
  "stage": "technical"
}
```

### 2. **Whisper AI** (Speech to Text)
- **What it does**: Converts audio to text
- **Used in**: Python service (`/audio/transcribe-and-analyze`)
- **Input**: Audio file (WAV/MP3)
- **Output**: Transcribed text + voice analysis

### 3. **Python Service** (Audio/Video Analysis)
- **Port**: 8000
- **Endpoints**:
  - `/audio/transcribe-and-analyze` - Transcribe + analyze voice
  - `/resume/parse` - Extract data from resume PDF
  - `/video/analyze` - Analyze facial expressions (optional)

---

## 💾 DATABASE (MongoDB)

### Collections (Tables):

1. **users**
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  passwordHash: "hashed_password",
  role: "candidate",
  createdAt: Date
}
```

2. **resumes**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  filename: "resume.pdf",
  parsedData: {
    name: "John Doe",
    skills: ["React", "Node.js", "MongoDB"],
    experience: "2 years",
    education: "B.Tech CS"
  },
  uploadedAt: Date
}
```

3. **interviewsessions**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  resumeId: ObjectId,
  status: "completed",
  stage: "completed",
  skills: ["React", "Node.js"],
  conversation: [
    { role: "ai", content: "Tell me about yourself" },
    { role: "user", content: "I am a software developer..." }
  ],
  scores: {
    overall: 7.5,
    communication: 8.0,
    technical: 7.0,
    confidence: 7.5
  },
  createdAt: Date,
  completedAt: Date
}
```

4. **reports**
```javascript
{
  _id: ObjectId,
  sessionId: ObjectId,
  userId: ObjectId,
  pdfPath: "/reports/report-123.pdf",
  scores: { ... },
  generatedAt: Date
}
```

---

## 🔐 SECURITY & AUTHENTICATION

### How Login Works:

```
1. User enters email + password
      ↓
2. Backend checks if user exists
      ↓
3. Compare password with hashed password (bcrypt)
      ↓
4. If match → Generate JWT token
      ↓
5. Token contains: { userId, role, expiresIn: "30d" }
      ↓
6. Frontend stores token in localStorage
      ↓
7. For every API call, frontend sends:
   Header: Authorization: Bearer <token>
      ↓
8. Backend middleware verifies token
      ↓
9. If valid → Allow request
   If invalid → Return 401 Unauthorized
```

### Rate Limiting:
- **100 requests per 15 minutes** per IP
- Prevents spam and abuse
- Implemented in `rateLimit.js`

---

## 🎨 INTERVIEW STAGES

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERVIEW FLOW                            │
└─────────────────────────────────────────────────────────────┘

Stage 1: APTITUDE (10 questions)
├─ Logical reasoning
├─ Quantitative aptitude
├─ Verbal ability
└─ Pattern recognition

Stage 2: CODING (2 questions)
├─ Data structures
├─ Algorithms
└─ Problem solving

Stage 3: TECHNICAL (5 questions)
├─ Based on resume skills
├─ Project experience
└─ Technology deep-dive

Stage 4: HR (5 questions)
├─ Behavioral questions
├─ Situational questions
└─ Career goals

TOTAL: 22 questions
```

---

## 📊 SCORING SYSTEM

### Scores Calculated:

1. **Communication Score** (0-10)
   - Clarity of speech
   - Grammar and vocabulary
   - Confidence in delivery

2. **Technical Score** (0-10)
   - Correctness of answer
   - Depth of knowledge
   - Problem-solving ability

3. **Confidence Score** (0-10)
   - Voice tone analysis
   - Hesitation detection
   - Speaking pace

4. **Overall Score** (0-10)
   - Average of all scores
   - Weighted by question difficulty

---

## 🚀 DEPLOYMENT

### Development:
```
Frontend: http://localhost:3000
Backend:  http://localhost:4005
Python:   http://localhost:8000
MongoDB:  mongodb://localhost:27017
```

### Production:
```
Frontend: Vercel (https://galaxihire.vercel.app)
Backend:  Render (https://galaxihire-api.onrender.com)
Python:   Render (https://galaxihire-python.onrender.com)
MongoDB:  MongoDB Atlas (cloud)
```

---

## 🔧 ENVIRONMENT VARIABLES

### Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:4005
```

### Backend (.env):
```
PORT=4005
MONGO_URI=mongodb://localhost:27017/galaxihire
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
PYTHON_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

---

## 📝 KEY INTERVIEW POINTS TO REMEMBER

### When interviewer asks: "How does your project work?"

**Answer:**
"GalaxiHire is an AI-powered interview platform. It has three main parts:

1. **Frontend** - Built with Next.js and React. Users can register, upload resume, and take interviews. We have components for audio recording, video recording, and code editor.

2. **Backend** - Built with Node.js and Express. It handles user authentication, stores data in MongoDB, generates AI questions using Groq API, and evaluates answers.

3. **AI Services** - We use Groq AI for question generation and answer evaluation, and Whisper AI for speech-to-text conversion.

The flow is: User uploads resume → AI generates questions based on skills → User answers via voice/video/text → AI evaluates and gives scores → System generates a detailed PDF report."

### When interviewer asks: "What technologies did you use?"

**Answer:**
- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, MongoDB, JWT
- **AI**: Groq AI (LLaMA 3), Whisper (speech-to-text)
- **Tools**: Puppeteer (PDF generation), Multer (file upload), Axios (API calls)

### When interviewer asks: "What was your role?"

**Answer:**
"I worked on [choose based on what you actually did]:
- Frontend: Built the interview interface, audio/video recording components
- Backend: Implemented interview logic, API endpoints, database schemas
- Integration: Connected frontend with backend APIs, integrated AI services
- Full-stack: Worked on both frontend and backend features"

### When interviewer asks: "What challenges did you face?"

**Answer:**
"Some challenges were:
1. **Real-time audio/video recording** - Had to handle browser permissions and different formats
2. **AI integration** - Ensuring AI generates relevant questions based on resume
3. **Scoring algorithm** - Creating fair evaluation criteria
4. **Performance** - Optimizing API calls and database queries"

---

## 🎯 QUICK SUMMARY

**In Simple Words:**

1. User signs up and logs in
2. User uploads their resume (PDF)
3. System reads resume and extracts skills
4. User starts interview
5. AI asks 22 questions (aptitude, coding, technical, HR)
6. User answers using voice, video, or text
7. AI evaluates each answer and gives scores
8. After all questions, system generates a PDF report
9. User can download report and see their performance

**Technology Stack:**
- Frontend: Next.js (React)
- Backend: Node.js + Express
- Database: MongoDB
- AI: Groq AI + Whisper
- Deployment: Vercel + Render

---

## 📚 USEFUL COMMANDS

### Start Development:
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev

# Python Service
cd python-service
python app.py
```

### Build for Production:
```bash
# Frontend
npm run build

# Backend
npm start
```

---

**Good luck with your interview! 🚀**
