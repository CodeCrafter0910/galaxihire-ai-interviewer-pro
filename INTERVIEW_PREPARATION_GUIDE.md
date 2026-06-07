# GalaxiHire - Complete Interview Preparation Guide
**Created for: Complete Beginners | Simple English | Easy to Understand**

---

## Table of Contents
1. [What is GalaxiHire?](#what-is-galaxihire)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Tech Stack Explained](#tech-stack-explained)
5. [How the System Works](#how-the-system-works)
6. [Database Structure](#database-structure)
7. [API Endpoints](#api-endpoints)
8. [Frontend Structure](#frontend-structure)
9. [Backend Structure](#backend-structure)
10. [Interview Questions & Answers](#interview-questions--answers)

---

## What is GalaxiHire?

**GalaxiHire** is an AI-powered interview practice platform that helps job candidates prepare for real interviews. Think of it as a smart interview simulator that:

- **Asks you interview questions** (like a real interviewer would)
- **Evaluates your answers** using AI
- **Gives you feedback** on how well you did
- **Generates performance reports** with scores
- **Supports multiple interview types**: Aptitude, Coding, Technical, HR

### Real-World Analogy
Imagine you have a very smart friend who:
- Knows thousands of interview questions
- Can interview you anytime
- Gives you honest feedback
- Tracks your progress over time

That's what GalaxiHire does, but it's powered by AI instead of a human friend.

---

## Project Overview

### Project Name: GalaxiHire - AI Interviewer Pro

**Purpose:** Help candidates practice interviews using AI

**Key Features:**
1. **User Authentication** - Sign up, login, manage profile
2. **Resume Upload** - Upload your resume, AI extracts your skills
3. **Multi-Stage Interviews** - Aptitude → Coding → Technical → HR
4. **Real-time AI Questions** - AI generates questions based on your skills
5. **Answer Evaluation** - AI evaluates your answers and gives scores
6. **Performance Reports** - PDF reports with detailed feedback
7. **Code Execution** - Run code in the browser during coding interviews
8. **Video Recording** - Record your interview sessions (optional)

### Project Structure
```
GalaxiHire/
├── frontend/          # Next.js React application (user interface)
├── backend/           # Node.js Express server (API & business logic)
├── python-service/    # Python service for resume parsing & audio
├── code-exec-sandbox/ # Code execution service
└── database/          # MongoDB database
```

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER (Browser)                          │
│                  (React/Next.js Frontend)                   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND SERVER (Node.js/Express)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes (Controllers)                            │  │
│  │  - Auth (Login/Register)                             │  │
│  │  - Interview (Start/Continue/Complete)               │  │
│  │  - Resume (Upload/Parse)                             │  │
│  │  - Code (Execute)                                    │  │
│  │  - Report (Generate/Download)                        │  │
│  │  - Video (Upload/Download)                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────┴────────────────────────────┐  │
│  │  Services (Business Logic)                           │  │
│  │  - LLM Service (Groq API for AI)                     │  │
│  │  - Code Execution Service                            │  │
│  │  - Resume Parser Service                             │  │
│  │  - Video Upload Service                              │  │
│  │  - Whisper Service (Audio transcription)             │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌──────────────┐  ┌──────────┐  ┌──────────────┐
│   MongoDB    │  │  Groq    │  │  External    │
│  (Database)  │  │   API    │  │  Services    │
│              │  │ (AI/LLM) │  │              │
└──────────────┘  └──────────┘  └──────────────┘
```

### Data Flow Diagram

```
User Action → Frontend → Backend API → Service Layer → External APIs/Database → Response → Frontend → User
```

### Interview Flow Diagram

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  User   │───▶│  Start  │───▶│   AI    │───▶│ Question│
│         │    │Interview│    │Generates│    │  #1    │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                                            │
                                            ▼
                                    ┌──────────────┐
                                    │  User Answers│
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  AI Evaluates│
                                    │   Answer     │
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  Next Question│
                                    │  (Repeat 22x)│
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  Interview    │
                                    │  Complete    │
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  Generate    │
                                    │  Report      │
                                    └──────────────┘
```

---

## Tech Stack Explained

### Frontend (What Users See)

**Technology: Next.js 16 + React 19**

**What is Next.js?**
- Next.js is a framework built on top of React
- React is a JavaScript library for building user interfaces
- Think of React as the engine, Next.js as the car built around it

**Why Next.js?**
- Fast performance (important for user experience)
- Easy to deploy
- Built-in routing (no need to set up complex routing)
- Server-side rendering (better for SEO)

**Key Frontend Technologies:**
- **TypeScript** - JavaScript with types (catches errors early)
- **Tailwind CSS** - Utility-first CSS framework (easy styling)
- **Monaco Editor** - Code editor component (like VS Code in browser)
- **Axios** - For making API calls to backend
- **React Hot Toast** - For showing notifications
- **Lucide React** - Icon library

### Backend (Server-Side Logic)

**Technology: Node.js + Express**

**What is Node.js?**
- Node.js allows running JavaScript on the server (not just in browser)
- It's like a runtime environment for JavaScript

**What is Express?**
- Express is a web framework for Node.js
- It helps build web servers and APIs easily
- Think of it as a toolkit for building web applications

**Key Backend Technologies:**
- **Express.js** - Web framework for building API
- **MongoDB + Mongoose** - Database and database driver
- **JWT (JSON Web Tokens)** - For user authentication
- **bcryptjs** - For password hashing (security)
- **Groq API** - AI service for generating questions and evaluating answers
- **Puppeteer** - For generating PDF reports
- **Axios** - For making HTTP requests to external services
- **Multer** - For handling file uploads (resume, video)
- **Winston** - For logging (tracking errors and events)
- **Sentry** - For error monitoring

### Database

**Technology: MongoDB**

**What is MongoDB?**
- MongoDB is a NoSQL database
- It stores data in JSON-like documents
- Flexible schema (easy to change data structure)

**Why MongoDB?**
- Easy to work with JavaScript/Node.js
- Scalable (can handle lots of data)
- Flexible (no strict table structure)

### External Services

**1. Groq API (AI/LLM)**
- Used for generating interview questions
- Used for evaluating user answers
- Uses Llama 3 model (free and fast)

**2. Python Service**
- Resume parsing (extracts skills, experience from PDF)
- Audio transcription (converts speech to text)

**3. Code Execution Sandbox**
- Runs user code safely
- Supports multiple programming languages
- Returns output and errors

---

## How the System Works

### User Registration & Login Flow

```
1. User fills registration form (name, email, password)
   ↓
2. Frontend sends POST request to /api/auth/register
   ↓
3. Backend receives request
   ↓
4. Backend hashes password using bcryptjs (security)
   ↓
5. Backend saves user to MongoDB database
   ↓
6. Backend generates JWT token (like a digital ID card)
   ↓
7. Backend sends token back to frontend
   ↓
8. Frontend stores token in localStorage
   ↓
9. User is now logged in!
```

**Login Flow:**
```
1. User enters email and password
   ↓
2. Frontend sends POST request to /api/auth/login
   ↓
3. Backend finds user in database by email
   ↓
4. Backend compares password with hashed password
   ↓
5. If match: Generate JWT token
   ↓
6. Send token to frontend
   ↓
7. User is logged in!
```

### Resume Upload & Parsing Flow

```
1. User uploads resume (PDF file)
   ↓
2. Frontend sends file to /api/resume/upload
   ↓
3. Backend receives file
   ↓
4. Backend sends file to Python service
   ↓
5. Python service extracts:
   - Name, email, phone
   - Skills (JavaScript, Python, etc.)
   - Experience (years)
   - Education
   - Projects
   - Certifications
   ↓
6. Python service sends extracted data back to backend
   ↓
7. Backend saves data to MongoDB
   ↓
8. Frontend displays parsed resume to user
```

### Interview Flow (The Main Feature)

```
1. User clicks "Start Interview"
   ↓
2. Frontend sends POST to /api/interview/start
   ↓
3. Backend creates new interview session in database
   ↓
4. Backend calls Groq API to generate first question
   ↓
5. Groq API returns question based on user's skills
   ↓
6. Backend saves question to conversation history
   ↓
7. Backend sends question to frontend
   ↓
8. User sees question and types answer
   ↓
9. User submits answer
   ↓
10. Frontend sends POST to /api/interview/continue
    ↓
11. Backend evaluates answer using Groq API
    ↓
12. Groq API returns:
    - Scores (1-10 for communication, technical, confidence)
    - Feedback
    - Strengths
    - Areas for improvement
    ↓
13. Backend updates scores in database
    ↓
14. Backend generates next question
    ↓
15. Repeat steps 8-14 for 22 questions total
    ↓
16. After 22 questions, interview is complete
    ↓
17. Backend marks interview as "completed"
    ↓
18. User can generate performance report
```

### Interview Stages (22 Questions Total)

```
Stage 1: Aptitude (Questions 1-10)
- Logical reasoning
- Quantitative aptitude
- Verbal ability
- Pattern recognition

Stage 2: Coding/DSA (Questions 11-12)
- Data structures
- Algorithms
- Problem-solving

Stage 3: Technical (Questions 13-17)
- Based on user's resume skills
- Project-related questions
- Technical concepts

Stage 4: HR (Questions 18-22)
- Behavioral questions
- Situational questions
- Culture fit
```

### Report Generation Flow

```
1. User clicks "Generate Report"
   ↓
2. Frontend sends POST to /api/report/generate
   ↓
3. Backend fetches interview session from database
   ↓
4. Backend calculates final scores
   ↓
5. Backend generates HTML report with:
   - Performance scores
   - Strengths
   - Areas for improvement
   - Recommendations
   - Learning roadmap
   ↓
6. Backend uses Puppeteer to convert HTML to PDF
   ↓
7. Backend saves PDF to file system
   ↓
8. Backend saves report metadata to database
   ↓
9. Backend sends PDF URL to frontend
   ↓
10. User can download PDF report
```

### Code Execution Flow

```
1. User is in coding interview
   ↓
2. User writes code in Monaco Editor
   ↓
3. User clicks "Run Code"
   ↓
4. Frontend sends code to /api/code/run
   ↓
5. Backend sends code to Code Execution Sandbox
   ↓
6. Sandbox executes code in isolated environment
   ↓
7. Sandbox returns:
   - Output
   - Errors (if any)
   - Execution time
   ↓
8. Backend sends results to frontend
   ↓
9. User sees output in console
```

---

## Database Structure

### Collections (Tables in MongoDB)

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,  // Hashed password (not plain text)
  role: String,          // "candidate" or "admin"
  createdAt: Date
}
```

#### 2. InterviewSessions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,      // Reference to user
  skills: [String],      // ["JavaScript", "Python", "React"]
  resumeId: ObjectId,     // Reference to resume (optional)
  status: String,        // "in-progress" or "completed"
  stage: String,         // "aptitude", "coding", "technical", "hr"
  conversation: [       // Array of Q&A pairs
    {
      role: String,      // "ai" or "user"
      content: String,   // Question or answer text
      stage: String,     // Which stage this belongs to
      timestamp: Date
    }
  ],
  scores: {
    communication: Number,  // 0-10
    technical: Number,      // 0-10
    confidence: Number,     // 0-10
    coding: Number,        // 0-10
    overall: Number        // 0-10 (average)
  },
  startedAt: Date,
  completedAt: Date,
  duration: Number         // in seconds
}
```

#### 3. Resumes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  originalFileName: String,
  skills: [String],
  name: String,
  email: String,
  phone: String,
  experienceYears: Number,
  education: [Object],
  projects: [Object],
  certifications: [String],
  extractedText: String,   // Full text from resume
  fileSize: Number,
  mimeType: String,
  createdAt: Date
}
```

#### 4. Reports Collection
```javascript
{
  _id: ObjectId,
  interviewId: ObjectId,   // Reference to interview session
  candidateId: ObjectId,  // Reference to user
  summary: String,
  strengths: [String],
  improvements: [String],
  detailedScores: {
    communication: Number,
    technical: Number,
    confidence: Number,
    coding: Number,
    overall: Number
  },
  recommendations: [String],
  learningRoadmap: [
    { week: Number, focus: String }
  ],
  pdfUrl: String,         // Path to PDF file
  createdAt: Date
}
```

#### 5. Videos Collection
```javascript
{
  _id: ObjectId,
  interviewId: ObjectId,
  userId: ObjectId,
  filename: String,
  filePath: String,
  fileSize: Number,
  mimeType: String,
  questionAsked: String,
  createdAt: Date
}
```

### Database Relationships

```
Users (1) ────── (Many) InterviewSessions
Users (1) ────── (Many) Resumes
Users (1) ────── (Many) Reports
Users (1) ────── (Many) Videos
InterviewSessions (1) ────── (1) Reports
InterviewSessions (1) ────── (Many) Videos
Resumes (1) ────── (Many) InterviewSessions (optional)
```

---

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
**Purpose:** Create new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  },
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login
**Purpose:** Login existing user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  },
  "token": "jwt_token_here"
}
```

#### GET /api/auth/me
**Purpose:** Get current user profile

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  }
}
```

### Resume Endpoints

#### POST /api/resume/upload
**Purpose:** Upload and parse resume

**Headers:** `Authorization: Bearer <token>`

**Request:** Multipart form data with file

**Response:**
```json
{
  "message": "Resume parsed successfully",
  "resume": {
    "id": "resume_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "skills": ["JavaScript", "React", "Node.js"],
    "experienceYears": 3,
    "education": [...],
    "projects": [...],
    "certifications": [...]
  }
}
```

#### GET /api/resume/list
**Purpose:** Get all resumes for current user

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "resumes": [
    {
      "id": "resume_id_here",
      "originalFileName": "resume.pdf",
      "skills": ["JavaScript", "React"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### DELETE /api/resume/:id
**Purpose:** Delete a resume

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Resume deleted successfully"
}
```

### Interview Endpoints

#### POST /api/interview/start
**Purpose:** Start a new interview session

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "skills": ["JavaScript", "React"],
  "resumeId": "resume_id_here" // optional
}
```

**Response:**
```json
{
  "sessionId": "session_id_here",
  "question": "What is the difference between let and const in JavaScript?",
  "stage": "aptitude",
  "message": "Interview session started successfully"
}
```

#### POST /api/interview/continue
**Purpose:** Submit answer and get next question

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "sessionId": "session_id_here",
  "answer": "let allows reassignment, const does not."
}
```

**Response:**
```json
{
  "question": "Explain closures in JavaScript.",
  "stage": "aptitude",
  "sessionId": "session_id_here",
  "evaluation": {
    "feedback": "Good answer! You correctly explained the difference.",
    "strengths": ["Clear explanation", "Accurate"],
    "improvements": ["Could provide examples"]
  },
  "completed": false
}
```

#### POST /api/interview/complete
**Purpose:** Manually complete interview

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "sessionId": "session_id_here"
}
```

**Response:**
```json
{
  "message": "Interview completed successfully",
  "sessionId": "session_id_here",
  "scores": {
    "communication": 7.5,
    "technical": 8.0,
    "confidence": 7.0,
    "overall": 7.5
  },
  "duration": 1800
}
```

#### GET /api/interview/history
**Purpose:** Get interview history for current user

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:** `?limit=10&page=1`

**Response:**
```json
{
  "sessions": [
    {
      "id": "session_id_here",
      "skills": ["JavaScript", "React"],
      "status": "completed",
      "stage": "completed",
      "scores": {
        "overall": 7.5
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

#### GET /api/interview/:sessionId
**Purpose:** Get specific interview session details

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "session": {
    "id": "session_id_here",
    "skills": ["JavaScript", "React"],
    "conversation": [...],
    "scores": {...},
    "status": "completed"
  }
}
```

#### DELETE /api/interview/:sessionId
**Purpose:** Delete an interview session

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Interview session deleted successfully"
}
```

### Code Execution Endpoints

#### POST /api/code/run
**Purpose:** Execute code and get output

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "code": "console.log('Hello World');",
  "language": "javascript"
}
```

**Response:**
```json
{
  "output": "Hello World",
  "error": null,
  "executionTime": 0.5
}
```

### Report Endpoints

#### POST /api/report/generate
**Purpose:** Generate performance report

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "sessionId": "session_id_here"
}
```

**Response:**
```json
{
  "reportId": "report_id_here",
  "pdfUrl": "/reports/report-report_id_here.pdf",
  "report": {
    "summary": "Overall Score: 7.5/10",
    "strengths": [...],
    "improvements": [...],
    "detailedScores": {...},
    "recommendations": [...],
    "learningRoadmap": [...]
  }
}
```

#### GET /api/report/list
**Purpose:** Get all reports for current user

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:** `?limit=20&page=1`

**Response:**
```json
{
  "reports": [
    {
      "id": "report_id_here",
      "summary": "Overall Score: 7.5/10",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

#### GET /api/report/:id
**Purpose:** Get specific report details

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "report": {
    "id": "report_id_here",
    "summary": "Overall Score: 7.5/10",
    "strengths": [...],
    "improvements": [...],
    "detailedScores": {...}
  }
}
```

#### GET /api/report/download/:id
**Purpose:** Download PDF report

**Headers:** `Authorization: Bearer <token>`

**Response:** PDF file download

### Video Endpoints

#### POST /api/video/upload
**Purpose:** Upload video recording

**Headers:** `Authorization: Bearer <token>`

**Request:** Multipart form data with file and sessionId

**Response:**
```json
{
  "message": "Video uploaded successfully",
  "videoId": "video_id_here",
  "filePath": "/videos/video-session_id-timestamp.webm"
}
```

#### GET /api/video/session/:sessionId
**Purpose:** Get all videos for a session

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "videos": [
    {
      "id": "video_id_here",
      "filePath": "/videos/video-session_id-timestamp.webm",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### DELETE /api/video/:id
**Purpose:** Delete a video

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Video deleted successfully"
}
```

---

## Frontend Structure

### Directory Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page (home)
│   │   ├── layout.tsx         # Root layout
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── interview/         # Interview pages
│   │   │   ├── new/           # Start new interview
│   │   │   └── live/          # Live interview chat
│   │   └── reports/           # Reports page
│   ├── components/            # Reusable components
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── TopNav.tsx         # Top navigation bar
│   │   └── CodeEditor.tsx     # Code editor component
│   └── styles/
│       └── globals.css        # Global styles
├── package.json               # Frontend dependencies
└── next.config.js             # Next.js configuration
```

### Key Frontend Pages

#### 1. Landing Page (page.tsx)
- Hero section with call-to-action
- Features showcase
- Testimonials
- Links to login/register

#### 2. Dashboard (dashboard/page.tsx)
- User statistics
- Quick actions
- Recent interview history
- Pro tips

#### 3. Live Interview (interview/live/page.tsx)
- Chat interface with AI
- Question display
- Answer input
- Real-time feedback

#### 4. Code Editor (components/CodeEditor.tsx)
- Monaco Editor integration
- Code execution
- Output console
- Language selection

### Frontend State Management
- Uses React hooks (useState, useEffect)
- LocalStorage for token persistence
- Context API for global state (if needed)

---

## Backend Structure

### Directory Structure
```
backend/
├── src/
│   ├── config/               # Configuration files
│   │   └── db.js             # Database connection
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.js
│   │   ├── interview.controller.js
│   │   ├── resume.controller.js
│   │   ├── coding.controller.js
│   │   ├── report.controller.js
│   │   └── video.controller.js
│   ├── routes/               # API route definitions
│   │   ├── auth.routes.js
│   │   ├── interview.routes.js
│   │   ├── resume.routes.js
│   │   ├── coding.routes.js
│   │   ├── report.routes.js
│   │   └── video.routes.js
│   ├── services/             # Business logic
│   │   ├── llmService.js     # AI question generation
│   │   ├── codeExecService.js
│   │   ├── resumeParser.service.js
│   │   ├── videoUpload.service.js
│   │   └── whisperService.js
│   ├── models/               # Database schemas
│   │   ├── User.js
│   │   ├── InterviewSession.js
│   │   ├── Resume.js
│   │   ├── Report.js
│   │   └── Video.js
│   ├── middleware/           # Custom middleware
│   │   └── rateLimit.js
│   ├── logger.js            # Logging configuration
│   └── sentry.js            # Error monitoring
├── server.js                # Main entry point
└── package.json             # Backend dependencies
```

### Backend Architecture Pattern

**MVC (Model-View-Controller) Pattern:**

1. **Models (Database Schemas)**
   - Define data structure
   - Handle database operations
   - Located in `src/models/`

2. **Controllers (Request Handlers)**
   - Handle HTTP requests
   - Call services for business logic
   - Send responses
   - Located in `src/controllers/`

3. **Services (Business Logic)**
   - Contain core business logic
   - Interact with external APIs
   - Reusable across controllers
   - Located in `src/services/`

4. **Routes (API Endpoints)**
   - Define API endpoints
   - Map URLs to controllers
   - Located in `src/routes/`

### Middleware

**Rate Limiting:**
- Prevents API abuse
- Limits requests per IP
- Protects against DDoS attacks

**Authentication:**
- Verifies JWT tokens
- Protects private routes
- Ensures user is logged in

---

## Interview Questions & Answers

### General Questions

**Q: What is GalaxiHire?**
A: GalaxiHire is an AI-powered interview practice platform that helps job candidates prepare for real interviews. It uses AI to generate interview questions, evaluate answers, and provide detailed feedback with performance reports.

**Q: What problem does GalaxiHire solve?**
A: It solves the problem of interview preparation by providing:
- Unlimited practice interviews available 24/7
- Instant AI-powered feedback
- Multi-stage interviews (Aptitude, Coding, Technical, HR)
- Performance tracking over time
- Personalized questions based on resume

**Q: Who is the target audience?**
A: Job seekers, students, and anyone preparing for technical interviews who want to practice and improve their interview skills.

### Technical Questions - Frontend

**Q: What frontend framework did you use and why?**
A: I used Next.js 16 with React 19. Next.js was chosen because:
- It provides excellent performance with server-side rendering
- Built-in routing eliminates complex routing setup
- Easy deployment to Vercel and other platforms
- Great developer experience with hot reload
- SEO-friendly for better search engine visibility

**Q: What is the difference between React and Next.js?**
A: React is a JavaScript library for building user interfaces, while Next.js is a framework built on top of React. Think of React as the engine and Next.js as the complete car. Next.js provides additional features like routing, server-side rendering, and optimization out of the box.

**Q: How do you manage state in the frontend?**
A: I use React hooks like useState and useEffect for local component state. For authentication, I store the JWT token in localStorage. For global state, I could use Context API, but currently the application uses local state which is sufficient for the current scope.

**Q: What is TypeScript and why did you use it?**
A: TypeScript is a superset of JavaScript that adds static typing. I used it because:
- It catches errors at compile time, not runtime
- Provides better IDE support with autocomplete
- Makes code more maintainable and self-documenting
- Helps prevent common bugs like null/undefined errors

**Q: How does the frontend communicate with the backend?**
A: The frontend uses Axios to make HTTP requests to the backend API. All requests include a JWT token in the Authorization header for authentication. The backend validates the token and returns the requested data.

### Technical Questions - Backend

**Q: What backend framework did you use and why?**
A: I used Express.js with Node.js. Express was chosen because:
- Minimal and flexible web framework
- Large ecosystem of middleware
- Easy to learn and use
- Great for building REST APIs
- Works seamlessly with MongoDB

**Q: How does authentication work in your application?**
A: Authentication uses JWT (JSON Web Tokens):
1. User registers/login with email and password
2. Server hashes password using bcryptjs
3. Server generates JWT token containing user ID and role
4. Client stores token in localStorage
5. Client sends token in Authorization header for protected routes
6. Server verifies token before allowing access

**Q: What is JWT and how does it work?**
A: JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of three parts:
1. Header (algorithm and token type)
2. Payload (user data like ID, role)
3. Signature (to verify token wasn't tampered with)

The token is stateless, meaning the server doesn't need to store session data.

**Q: How do you secure passwords?**
A: I use bcryptjs to hash passwords before storing them in the database. Hashing is a one-way function, so even if the database is compromised, attackers cannot retrieve the original passwords. When a user logs in, I hash their input and compare it with the stored hash.

**Q: What database did you use and why?**
A: I used MongoDB, a NoSQL database. Reasons:
- Flexible schema (easy to change data structure)
- Works well with JavaScript/Node.js
- Scalable for large amounts of data
- Stores data in JSON-like documents
- Great for rapid development

**Q: How does the AI question generation work?**
A: The backend uses Groq API with the Llama 3 model:
1. Backend sends prompt to Groq API with context (stage, skills, conversation history)
2. Groq API generates relevant interview question
3. Backend saves question to conversation history
4. Backend sends question to frontend
5. If Groq API fails, backend uses fallback questions from a predefined list

**Q: How does answer evaluation work?**
A: Similar to question generation:
1. Backend sends question and answer to Groq API
2. Groq API evaluates answer and returns scores (1-10) for communication, technical, confidence
3. Groq API also provides feedback, strengths, and improvements
4. Backend updates running average of scores
5. Backend sends evaluation to frontend

### Technical Questions - Architecture

**Q: Explain the overall architecture of your application.**
A: The application follows a client-server architecture:
- **Frontend (Client):** Next.js React application running in browser
- **Backend (Server):** Node.js/Express API server
- **Database:** MongoDB for data persistence
- **External Services:** Groq API for AI, Python service for resume parsing

The frontend communicates with the backend via REST API endpoints. The backend handles business logic, database operations, and external API calls.

**Q: What is the MVC pattern and did you use it?**
A: MVC (Model-View-Controller) is a design pattern that separates application logic:
- **Model:** Data structure and database operations (Mongoose models)
- **View:** User interface (React components)
- **Controller:** Handles requests and coordinates between model and view (Express controllers)

Yes, I used a modified MVC pattern in the backend with controllers handling requests, models for database, and services for business logic.

**Q: How do you handle errors in your application?**
A: I use multiple layers of error handling:
1. Try-catch blocks in controllers and services
2. Winston for logging errors to files
3. Sentry for error monitoring and alerting
4. Meaningful error messages sent to frontend
5. Fallback mechanisms (e.g., fallback questions if AI fails)

**Q: How do you ensure security in your application?**
A: Security measures include:
- Password hashing with bcryptjs
- JWT token authentication
- CORS configuration to prevent unauthorized requests
- Rate limiting to prevent API abuse
- Input validation on all endpoints
- Environment variables for sensitive data
- Helmet middleware for HTTP headers security

### Technical Questions - Database

**Q: What are the main collections in your database?**
A: The main collections are:
1. **Users:** Stores user accounts and authentication data
2. **InterviewSessions:** Stores interview conversations and scores
3. **Resumes:** Stores parsed resume data
4. **Reports:** Stores generated performance reports
5. **Videos:** Stores video recording metadata

**Q: How do you structure interview data?**
A: Interview sessions store:
- User reference (who took the interview)
- Skills being tested
- Conversation history (array of Q&A pairs)
- Scores for different categories
- Current stage (aptitude, coding, technical, hr)
- Status (in-progress or completed)
- Timestamps

**Q: How do you handle relationships between collections?**
A: MongoDB uses references (ObjectIds) to establish relationships. For example, an InterviewSession has a userId field that references the Users collection. I use Mongoose's populate() to join collections when needed.

### Technical Questions - Performance

**Q: How did you optimize the performance of your application?**
A: Performance optimizations include:
- Removed heavy animations and particles from UI
- Reduced backdrop-filter blur effects
- Simplified CSS animations
- Used Next.js for server-side rendering
- Implemented rate limiting to prevent abuse
- Used efficient database queries with indexes
- Lazy loading of components where needed
- Optimized images and assets

**Q: How do you handle large amounts of interview data?**
A: I use pagination for interview history and reports:
- Limit results per page (default 10-20)
- Skip documents for pagination
- Count total documents for pagination metadata
- Exclude large fields (conversation) in list views

### Technical Questions - Deployment

**Q: How would you deploy this application?**
A: Deployment strategy:
1. **Frontend:** Deploy to Vercel (Next.js optimized)
2. **Backend:** Deploy to Render or Railway (Node.js)
3. **Database:** MongoDB Atlas (cloud MongoDB)
4. **Python Service:** Deploy to Render
5. **Code Execution:** Deploy to separate service
6. **Environment Variables:** Configure in each platform

**Q: What environment variables do you need?**
A: Key environment variables:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for signing JWT tokens
- `GROQ_API_KEY`: API key for Groq AI service
- `PYTHON_SERVICE_URL`: URL for Python resume parser
- `CODE_EXEC_SERVICE_URL`: URL for code execution service
- `FRONTEND_URL`: Frontend URL for CORS

### Behavioral Questions

**Q: What was the most challenging part of this project?**
A: The most challenging part was integrating the AI question generation and evaluation. I had to:
- Design effective prompts for the AI
- Handle API failures gracefully with fallbacks
- Ensure consistent scoring across different questions
- Balance question difficulty across stages

**Q: How did you handle the AI integration?**
A: I used Groq API with Llama 3 model because:
- It's free and fast
- Good quality responses
- Easy to integrate
- Has fallback mechanism if API fails

I also implemented a fallback question system in case the AI service is unavailable.

**Q: What would you improve if you had more time?**
A: Potential improvements:
- Add more interview stages (system design, behavioral)
- Implement video analysis for body language
- Add voice recognition for spoken answers
- Create a mobile app version
- Add collaborative features (mock interviews with friends)
- Implement more advanced analytics and insights
- Add integration with LinkedIn for job matching

**Q: How do you ensure the quality of AI-generated questions?**
A: Quality measures:
- Carefully designed system prompts for each stage
- Context from user's resume for technical questions
- Conversation history for context awareness
- Fallback questions curated by domain experts
- User feedback mechanism for question quality

### Scenario-Based Questions

**Q: What if the AI service goes down during an interview?**
A: I have a fallback mechanism:
1. Detect API failure
2. Switch to predefined question bank
3. Continue interview without AI
4. Log the error for monitoring
5. Notify user about fallback mode

**Q: How do you handle concurrent interviews?**
A: Each interview is independent:
- Unique session ID for each interview
- Database stores conversation per session
- No shared state between interviews
- Can handle multiple users simultaneously

**Q: What if a user's internet disconnects during an interview?**
A: The frontend could implement:
- Auto-save answers to localStorage
- Resume interview from last question
- Sync with backend when connection restored
- Show clear error message to user

### Project-Specific Questions

**Q: How does the 22-question interview structure work?**
A: The interview has 4 stages:
1. **Aptitude (10 questions):** Logical reasoning, quantitative, verbal
2. **Coding (2 questions):** Data structures and algorithms
3. **Technical (5 questions):** Based on resume skills
4. **HR (5 questions):** Behavioral and situational

The backend tracks question count and automatically transitions between stages.

**Q: How are scores calculated?**
A: Scores are calculated as running averages:
- Each answer gets scores (1-10) for communication, technical, confidence
- Backend maintains running average: `(previous_avg * (n-1) + new_score) / n`
- Overall score is average of all categories
- Final scores are saved when interview completes

**Q: How does resume parsing work?**
A: Resume parsing flow:
1. User uploads PDF resume
2. Backend sends file to Python service
3. Python service uses libraries to extract:
   - Text from PDF
   - Name, email, phone using regex
   - Skills using keyword matching
   - Experience using date parsing
   - Education and projects
4. Backend saves structured data to MongoDB

**Q: How does code execution work?**
A: Code execution flow:
1. User writes code in Monaco Editor
2. Frontend sends code to backend
3. Backend sends code to sandbox service
4. Sandbox executes in isolated Docker container
5. Sandbox returns output/errors
6. Backend sends results to frontend

The sandbox ensures security by preventing malicious code execution.

---

## Quick Reference Summary

### Key Technologies
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **AI:** Groq API (Llama 3 model)
- **Authentication:** JWT tokens
- **Code Editor:** Monaco Editor
- **PDF Generation:** Puppeteer

### Key Features
1. User authentication (register/login)
2. Resume upload and parsing
3. Multi-stage AI interviews (22 questions)
4. Real-time answer evaluation
5. Performance reports with PDF download
6. Code execution in browser
7. Video recording support
8. Interview history tracking

### API Base URL
- Development: `http://localhost:4005`
- Production: Configured via environment variable

### Database Collections
- Users
- InterviewSessions
- Resumes
- Reports
- Videos

### Interview Stages
1. Aptitude (10 questions)
2. Coding (2 questions)
3. Technical (5 questions)
4. HR (5 questions)

### Score Categories
- Communication (0-10)
- Technical (0-10)
- Confidence (0-10)
- Coding (0-10)
- Overall (average)

---

## Final Tips for Interview

1. **Know Your Stack:** Be prepared to explain why you chose each technology
2. **Understand the Flow:** Be able to walk through how a feature works end-to-end
3. **Be Honest:** If you don't know something, say so and explain how you'd find out
4. **Focus on Problem-Solving:** Interviewers care more about how you think than perfect answers
5. **Show Enthusiasm:** Demonstrate passion for your project
6. **Prepare Examples:** Have specific stories about challenges you faced and how you solved them
7. **Practice:** Do mock interviews with friends or use your own platform!

---

## Additional Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **Express.js Documentation:** https://expressjs.com/
- **MongoDB Documentation:** https://docs.mongodb.com/
- **React Documentation:** https://react.dev/
- **TypeScript Documentation:** https://www.typescriptlang.org/docs/

---

**Good luck with your interview! You've built an impressive project. Be confident and proud of your work!** 🚀
