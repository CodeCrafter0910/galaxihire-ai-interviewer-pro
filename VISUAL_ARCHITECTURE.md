# GalaxiHire - Visual Architecture Diagrams

## 🏗️ Complete System Architecture

\\\
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GALAXIHIRE PLATFORM                                │
│                     AI-Powered Interview System                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │         │                  │
│    FRONTEND      │◀───────▶│     BACKEND      │◀───────▶│  EXTERNAL APIs   │
│    (Next.js)     │  HTTPS  │   (Node.js)      │  HTTPS  │                  │
│                  │         │                  │         │                  │
│  Port: 3000      │         │  Port: 4005      │         │  • Groq AI       │
│                  │         │                  │         │  • Whisper       │
└──────────────────┘         └──────────────────┘         │  • Python API    │
        │                            │                     │                  │
        │                            │                     └──────────────────┘
        │                            │
        │                            ▼
        │                    ┌──────────────────┐
        │                    │                  │
        │                    │    MONGODB       │
        │                    │   (Database)     │
        │                    │                  │
        │                    │  • users         │
        │                    │  • resumes       │
        │                    │  • interviews    │
        │                    │  • reports       │
        │                    │                  │
        │                    └──────────────────┘
        │
        ▼
┌──────────────────┐
│                  │
│   USER BROWSER   │
│                  │
│  • Chrome        │
│  • Firefox       │
│  • Safari        │
│                  │
└──────────────────┘
\\\

---

## 📱 Frontend Architecture (Next.js)

\\\
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND STRUCTURE                          │
└─────────────────────────────────────────────────────────────────┘

frontend/
│
├── src/
│   │
│   ├── app/                          ← Pages (Next.js 13+ App Router)
│   │   ├── page.tsx                  → Home page
│   │   ├── login/page.tsx            → Login page
│   │   ├── register/page.tsx         → Sign up page
│   │   ├── dashboard/page.tsx        → Main dashboard
│   │   ├── resume-upload/page.tsx    → Upload resume
│   │   ├── interview/
│   │   │   ├── page.tsx              → Interview list
│   │   │   ├── new/page.tsx          → Start new interview
│   │   │   └── live/page.tsx         → Live interview Q&A
│   │   └── report/page.tsx           → View report
│   │
│   ├── components/                   ← Reusable UI components
│   │   ├── AudioRecorder/
│   │   │   └── index.jsx             → 🎤 Record voice
│   │   ├── VideoRecorder.tsx         → 🎥 Record video
│   │   ├── CodeEditor.tsx            → 💻 Write code
│   │   ├── Sidebar.tsx               → Navigation menu
│   │   ├── TopNav.tsx                → Top navigation bar
│   │   └── AuthGuard.jsx             → Protect routes
│   │
│   ├── lib/                          ← Utility functions
│   │   ├── api.ts                    → API client (axios)
│   │   ├── auth.ts                   → Auth helpers
│   │   └── constants.ts              → Constants
│   │
│   └── styles/
│       └── globals.css               → Global styles
│
└── package.json                      → Dependencies
\\\

---

## 🔧 Backend Architecture (Node.js + Express)

\\\
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND STRUCTURE                           │
└─────────────────────────────────────────────────────────────────┘

backend/
│
├── src/
│   │
│   ├── config/                       ← Configuration
│   │   ├── db.js                     → MongoDB connection
│   │   └── env.js                    → Environment variables
│   │
│   ├── models/                       ← Database Schemas
│   │   ├── User.js                   → User model
│   │   ├── Resume.js                 → Resume model
│   │   ├── InterviewSession.js       → Interview model
│   │   ├── Report.js                 → Report model
│   │   └── Video.js                  → Video model
│   │
│   ├── controllers/                  ← Request Handlers
│   │   ├── auth.controller.js        → Login/Register
│   │   ├── resume.controller.js      → Resume upload/parse
│   │   ├── interview.controller.js   → Interview logic
│   │   ├── coding.controller.js      → Code execution
│   │   ├── report.controller.js      → Report generation
│   │   └── video.controller.js       → Video handling
│   │
│   ├── services/                     ← Business Logic
│   │   ├── llmService.js             → AI question generation
│   │   ├── whisperService.js         → Speech-to-text
│   │   ├── resumeParser.service.js   → Parse resume PDF
│   │   ├── codeExecService.js        → Execute code
│   │   ├── reportGenerator.service.js → Generate PDF
│   │   └── videoUpload.service.js    → Video processing
│   │
│   ├── routes/                       ← API Routes
│   │   ├── auth.routes.js            → /api/auth/*
│   │   ├── resume.routes.js          → /api/resume/*
│   │   ├── interview.routes.js       → /api/interview/*
│   │   ├── coding.routes.js          → /api/code/*
│   │   ├── report.routes.js          → /api/report/*
│   │   └── video.routes.js           → /api/video/*
│   │
│   ├── middleware/                   ← Middleware
│   │   ├── auth.js                   → JWT verification
│   │   └── rateLimit.js              → Rate limiting
│   │
│   ├── logger.js                     → Winston logger
│   └── sentry.js                     → Error tracking
│
├── reports/                          ← Generated PDF reports
├── server.js                         → Main entry point
└── package.json                      → Dependencies
\\\

---

## 🔄 Complete Data Flow Diagram

\\\
┌─────────────────────────────────────────────────────────────────┐
│                    INTERVIEW FLOW DIAGRAM                        │
└─────────────────────────────────────────────────────────────────┘

1. USER REGISTRATION
   ┌──────────┐
   │  User    │
   │  Browser │
   └────┬─────┘
        │ POST /api/auth/register
        │ { name, email, password }
        ▼
   ┌──────────────┐
   │   Backend    │
   │ auth.controller
   └────┬─────────┘
        │ Hash password (bcrypt)
        │ Save to MongoDB
        ▼
   ┌──────────────┐
   │   MongoDB    │
   │ users collection
   └────┬─────────┘
        │ Return JWT token
        ▼
   ┌──────────────┐
   │   Frontend   │
   │ Store token  │
   └──────────────┘

2. RESUME UPLOAD
   ┌──────────┐
   │  User    │
   │ Selects  │
   │ PDF file │
   └────┬─────┘
        │ POST /api/resume/upload
        │ FormData(file)
        ▼
   ┌──────────────┐
   │   Backend    │
   │ resume.controller
   └────┬─────────┘
        │ Multer saves file
        ▼
   ┌──────────────┐
   │ Python API   │
   │ Parse resume │
   └────┬─────────┘
        │ Extract: skills, experience
        ▼
   ┌──────────────┐
   │   MongoDB    │
   │ resumes collection
   └────┬─────────┘
        │ Return resume ID
        ▼
   ┌──────────────┐
   │   Frontend   │
   │ Show success │
   └──────────────┘

3. START INTERVIEW
   ┌──────────┐
   │  User    │
   │ Clicks   │
   │ "Start"  │
   └────┬─────┘
        │ POST /api/interview/start
        │ { skills, resumeId }
        ▼
   ┌──────────────┐
   │   Backend    │
   │ interview.controller
   └────┬─────────┘
        │ Create InterviewSession
        ▼
   ┌──────────────┐
   │   MongoDB    │
   │ Save session │
   └────┬─────────┘
        │
        ▼
   ┌──────────────┐
   │ llmService   │
   │ Generate Q1  │
   └────┬─────────┘
        │
        ▼
   ┌──────────────┐
   │  Groq AI     │
   │ LLaMA 3 model│
   └────┬─────────┘
        │ Return question
        ▼
   ┌──────────────┐
   │   Frontend   │
   │ Display Q1   │
   └──────────────┘

4. ANSWER WITH VOICE
   ┌──────────┐
   │  User    │
   │ Speaks   │
   │ answer   │
   └────┬─────┘
        │ AudioRecorder
        │ Records audio
        ▼
   ┌──────────────┐
   │   Browser    │
   │ MediaRecorder│
   └────┬─────────┘
        │ Convert to WAV blob
        │ POST /api/interview/audio
        ▼
   ┌──────────────┐
   │   Backend    │
   │ interview.controller
   └────┬─────────┘
        │ Send audio file
        ▼
   ┌──────────────┐
   │ Python API   │
   │ Whisper AI   │
   └────┬─────────┘
        │ Transcribe to text
        │ Analyze: tone, confidence
        ▼
   ┌──────────────┐
   │   Backend    │
   │ Return text  │
   └────┬─────────┘
        │
        ▼
   ┌──────────────┐
   │   Frontend   │
   │ Show text    │
   └──────────────┘

5. EVALUATE & NEXT QUESTION
   ┌──────────┐
   │  User    │
   │ Submits  │
   │ answer   │
   └────┬─────┘
        │ POST /api/interview/continue
        │ { sessionId, answer }
        ▼
   ┌──────────────┐
   │   Backend    │
   │ interview.controller
   └────┬─────────┘
        │ Save answer to conversation
        ▼
   ┌──────────────┐
   │ llmService   │
   │ Evaluate     │
   └────┬─────────┘
        │
        ▼
   ┌──────────────┐
   │  Groq AI     │
   │ Score answer │
   └────┬─────────┘
        │ Return scores:
        │ - Clarity: 7/10
        │ - Technical: 8/10
        │ - Confidence: 6/10
        ▼
   ┌──────────────┐
   │   Backend    │
   │ Update scores│
   └────┬─────────┘
        │ Check stage
        │ (aptitude → coding → technical → hr)
        ▼
   ┌──────────────┐
   │ llmService   │
   │ Generate next Q
   └────┬─────────┘
        │
        ▼
   ┌──────────────┐
   │   Frontend   │
   │ Display next Q
   └──────────────┘

6. COMPLETE & GENERATE REPORT
   ┌──────────┐
   │  After   │
   │ 22 Qs    │
   └────┬─────┘
        │ Interview completed
        ▼
   ┌──────────────┐
   │   Backend    │
   │ Mark completed
   └────┬─────────┘
        │
        ▼
   ┌──────────────┐
   │   Frontend   │
   │ Redirect to  │
   │ /report      │
   └────┬─────────┘
        │ GET /api/report/:sessionId
        ▼
   ┌──────────────┐
   │   Backend    │
   │ report.controller
   └────┬─────────┘
        │ Fetch session data
        ▼
   ┌──────────────┐
   │   MongoDB    │
   │ Get interview│
   └────┬─────────┘
        │ Calculate final scores
        ▼
   ┌──────────────┐
   │ Puppeteer    │
   │ Generate PDF │
   └────┬─────────┘
        │ Save to /reports/
        ▼
   ┌──────────────┐
   │   Backend    │
   │ Return PDF URL
   └────┬─────────┘
        │
        ▼
   ┌──────────────┐
   │   Frontend   │
   │ Display report
   │ + Download btn
   └──────────────┘
\\\

---

## 🎯 Interview Stages Flow

\\\
┌─────────────────────────────────────────────────────────────────┐
│                    INTERVIEW STAGES                              │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ▼
┌─────────────────────┐
│  STAGE 1: APTITUDE  │  ← 10 Questions
│                     │
│ • Logical reasoning │
│ • Quantitative      │
│ • Verbal ability    │
│ • Pattern matching  │
└──────────┬──────────┘
           │ After Q10
           ▼
┌─────────────────────┐
│  STAGE 2: CODING    │  ← 2 Questions
│                     │
│ • DSA problems      │
│ • Algorithms        │
│ • Code writing      │
└──────────┬──────────┘
           │ After Q12
           ▼
┌─────────────────────┐
│ STAGE 3: TECHNICAL  │  ← 5 Questions
│                     │
│ • Resume-based      │
│ • Project details   │
│ • Tech deep-dive    │
└──────────┬──────────┘
           │ After Q17
           ▼
┌─────────────────────┐
│   STAGE 4: HR       │  ← 5 Questions
│                     │
│ • Behavioral        │
│ • Situational       │
│ • Career goals      │
└──────────┬──────────┘
           │ After Q22
           ▼
┌─────────────────────┐
│     COMPLETED       │
│                     │
│ Generate Report     │
└─────────────────────┘
\\\

---

## 🔐 Authentication Flow

\\\
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

LOGIN:
┌──────────┐
│  User    │
│ Enters   │
│ email +  │
│ password │
└────┬─────┘
     │ POST /api/auth/login
     ▼
┌──────────────┐
│   Backend    │
│ Find user    │
└────┬─────────┘
     │ User exists?
     ▼
┌──────────────┐
│   bcrypt     │
│ Compare      │
│ passwords    │
└────┬─────────┘
     │ Match?
     ▼
┌──────────────┐
│   JWT        │
│ Generate     │
│ token        │
└────┬─────────┘
     │ Token = { userId, role, exp: 30d }
     ▼
┌──────────────┐
│   Frontend   │
│ localStorage │
│ .setItem     │
│ ("token")    │
└──────────────┘

PROTECTED API CALL:
┌──────────────┐
│   Frontend   │
│ API request  │
└────┬─────────┘
     │ Header: Authorization: Bearer <token>
     ▼
┌──────────────┐
│   Backend    │
│ auth.js      │
│ middleware   │
└────┬─────────┘
     │ Verify token
     ▼
┌──────────────┐
│   JWT        │
│ jwt.verify() │
└────┬─────────┘
     │ Valid?
     ├─ YES → Continue to controller
     └─ NO  → Return 401 Unauthorized
\\\

---

## 📊 Database Schema Relationships

\\\
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE RELATIONSHIPS                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    users     │
│              │
│ _id          │◀─────────┐
│ name         │          │
│ email        │          │ userId (FK)
│ passwordHash │          │
└──────────────┘          │
       │                  │
       │ userId (FK)      │
       │                  │
       ▼                  │
┌──────────────┐          │
│   resumes    │          │
│              │          │
│ _id          │◀─────┐   │
│ userId       │      │   │
│ filename     │      │   │
│ parsedData   │      │   │
└──────────────┘      │   │
       │              │   │
       │ resumeId (FK)│   │
       │              │   │
       ▼              │   │
┌──────────────┐      │   │
│ interviews   │      │   │
│              │      │   │
│ _id          │◀─────┼───┼───┐
│ userId       │──────┘   │   │
│ resumeId     │──────────┘   │
│ conversation │              │
│ scores       │              │ sessionId (FK)
│ status       │              │
└──────────────┘              │
                              │
                              │
                              ▼
                       ┌──────────────┐
                       │   reports    │
                       │              │
                       │ _id          │
                       │ sessionId    │
                       │ userId       │
                       │ pdfPath      │
                       │ scores       │
                       └──────────────┘
\\\

---

## 🚀 Deployment Architecture

\\\
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   USER BROWSER   │
└────────┬─────────┘
         │ HTTPS
         ▼
┌──────────────────┐
│     VERCEL       │  ← Frontend Hosting
│                  │
│ • Next.js build  │
│ • Static export  │
│ • CDN delivery   │
│ • Auto SSL       │
└────────┬─────────┘
         │ API calls
         │ HTTPS
         ▼
┌──────────────────┐
│     RENDER       │  ← Backend Hosting
│                  │
│ • Node.js server │
│ • Express API    │
│ • Auto deploy    │
│ • Health checks  │
└────────┬─────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌──────────────────┐  ┌──────────────────┐
│  MONGODB ATLAS   │  │  PYTHON SERVICE  │
│                  │  │   (Render)       │
│ • Cloud database │  │                  │
│ • Auto backup    │  │ • FastAPI        │
│ • Replication    │  │ • Whisper AI     │
│ • Monitoring     │  │ • Resume parser  │
└──────────────────┘  └────────┬─────────┘
                               │
                               ▼
                      ┌──────────────────┐
                      │   EXTERNAL APIs  │
                      │                  │
                      │ • Groq AI        │
                      │ • Whisper        │
                      └──────────────────┘
\\\

---

## 🎨 Component Interaction Diagram

\\\
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND COMPONENT INTERACTIONS                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    InterviewPage                              │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  State Management                                       │ │
│  │  • currentQuestion                                      │ │
│  │  • sessionId                                            │ │
│  │  • stage                                                │ │
│  │  • scores                                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │ AudioRecorder   │  │ VideoRecorder   │  │ CodeEditor   ││
│  │                 │  │                 │  │              ││
│  │ • Start/Stop    │  │ • Camera access │  │ • Monaco     ││
│  │ • Send audio    │  │ • Record video  │  │ • Syntax     ││
│  │ • Get text      │  │ • Preview       │  │ • Execute    ││
│  └────────┬────────┘  └────────┬────────┘  └──────┬───────┘│
│           │                    │                   │        │
│           └────────────────────┼───────────────────┘        │
│                                │                            │
│                                ▼                            │
│                    ┌───────────────────────┐               │
│                    │   API Service         │               │
│                    │   (axios)             │               │
│                    └───────────┬───────────┘               │
│                                │                            │
└────────────────────────────────┼────────────────────────────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │   Backend API │
                         └───────────────┘
\\\

---

## 📝 API Endpoints Map

\\\
┌─────────────────────────────────────────────────────────────────┐
│                        API ENDPOINTS                             │
└─────────────────────────────────────────────────────────────────┘

/api/auth
├── POST   /register          → Create new user
├── POST   /login             → Login user
└── GET    /me                → Get current user

/api/resume
├── POST   /upload            → Upload resume PDF
├── GET    /:id               → Get resume details
└── DELETE /:id               → Delete resume

/api/interview
├── POST   /start             → Start new interview
├── POST   /continue          → Submit answer + get next Q
├── POST   /complete          → Complete interview
├── POST   /audio             → Process audio answer
├── POST   /video             → Upload video answer
├── GET    /history           → Get interview list
├── GET    /:sessionId        → Get interview details
└── DELETE /:sessionId        → Delete interview

/api/code
├── POST   /execute           → Execute code
└── POST   /submit            → Submit code answer

/api/report
├── GET    /:sessionId        → Get report
├── GET    /:sessionId/pdf    → Download PDF
└── POST   /generate          → Generate new report

/api/video
├── POST   /upload            → Upload video
└── GET    /:id               → Get video details
\\\

---

**This visual guide should help you understand and explain your project clearly! 🚀**
