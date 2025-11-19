# AI Interviewer & Performance Analyzer (Voice + Video + Coding)

An advanced AI-powered interview simulation system that conducts **voice**, **video**, and **coding-based** job interviews automatically.
It analyzes resumes, generates dynamic HR and technical questions, evaluates spoken answers, assesses coding skills, and produces a detailed performance report.

---

## Key Features

### 🎤 Voice-Based Interview
- AI interviewer speaks questions
- Candidate answers via microphone
- Whisper/ASR converts speech to text
- Tone, clarity, hesitation, and confidence analysis

### 🎥 Video Interview
- Real-time webcam capture using WebRTC
- Optional emotion + facial expression analysis
- Attention & engagement tracking

### 💻 Coding Challenge System
- Integrated online code editor
- Multi-language support (Python/JS/Java)
- Code executed in a safe Docker sandbox
- AI evaluates logic, style, and correctness

### 🧠 AI Interview Logic
- Resume parsing & skill extraction
- HR + behavioral questions
- Technical questions based on resume
- Presence-of-mind / trick questions
- Adaptive follow-up questions

### 📊 Final Performance Report
Includes:
- Technical score
- Communication score
- Confidence score
- Coding score
- Soft skills analysis
- Strengths & weaknesses
- Personalized learning roadmap
- Downloadable PDF

---

## Tech Stack (planned)

**Frontend**
- React, TailwindCSS
- WebRTC, Socket.io
- Monaco/CodeMirror editor

**Backend**
- Node.js, Express
- MongoDB
- WebRTC signaling

**AI Engine**
- FastAPI (Python)
- Whisper ASR
- OpenAI/Gemini (or other LLM)
- spaCy, HuggingFace Transformers

**Code Sandbox**
- Docker isolated runners

---

## Monorepo Structure

