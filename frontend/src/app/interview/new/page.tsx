"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import VideoRecorder from "@/components/VideoRecorder";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface ChatMessage {
  from: string;
  text: string;
}

export default function InterviewPage() {
  const router = useRouter();

  // Interview state
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("aptitude");
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [scores, setScores] = useState<any>(null);

  // Resume upload state
  const [showResumeUpload, setShowResumeUpload] = useState(true);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [resumeId, setResumeId] = useState<string>("");
  const [uploadingResume, setUploadingResume] = useState(false);

  // Answer mode: 'text', 'audio', or 'video'
  const [answerMode, setAnswerMode] = useState<'text' | 'audio' | 'video'>('text');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // MCQ state for aptitude round
  const [mcqOptions, setMcqOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
  }, [router]);

  // Handle resume upload
  async function handleResumeUpload() {
    if (!resumeFile) {
      toast.error("Please select a resume file");
      return;
    }

    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Extract skills from parsed resume
      const parsedData = res.data.parsed || {};
      const extractedSkills = parsedData.skills || ["JavaScript", "React", "Node.js"];

      setSkills(extractedSkills);
      setResumeId(res.data.resumeId || "");
      setShowResumeUpload(false);

      // Start interview with extracted skills
      await startNewInterview(extractedSkills, res.data.resumeId);
    } catch (error: any) {
      console.error("Resume upload error:", error);
      toast.error(error.response?.data?.error || "Failed to upload resume. Please try again.");
      setUploadingResume(false);
    }
  }

  // Skip resume upload
  function skipResumeUpload() {
    setShowResumeUpload(false);
    const defaultSkills = ["JavaScript", "React", "Node.js"];
    setSkills(defaultSkills);
    startNewInterview(defaultSkills, "");
  }

  async function startNewInterview(userSkills: string[], userResumeId: string = "") {
    try {
      setLoading(true);
      const res = await api.post("/interview/start", {
        skills: userSkills,
        resumeId: userResumeId || null
      });

      setSessionId(res.data.sessionId);
      setStage(res.data.stage);

      const questionText = res.data.question;
      setMessages([{
        from: "ai",
        text: questionText
      }]);

      // Extract MCQ options if it's an aptitude question
      if (res.data.stage === 'aptitude') {
        extractMCQOptions(questionText);
      }

      setLoading(false);
      setUploadingResume(false);
    } catch (error) {
      console.error("Failed to start interview:", error);
      setLoading(false);
      setUploadingResume(false);
    }
  }

  async function sendTextAnswer() {
    if (!input.trim() || !sessionId) return;
    await submitAnswer(input, 'text');
    setInput("");
  }

  async function submitAnswer(answerText: string, mode: string) {
    const userMsg = { from: "user", text: answerText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post("/interview/continue", {
        sessionId,
        answer: answerText
      });

      setLoading(false);

      if (res.data.completed) {
        setIsComplete(true);
        setScores(res.data.scores);
        setMessages((prev) => [
          ...prev,
          {
            from: "ai",
            text: "🎉 Interview completed! Generating your performance report..."
          }
        ]);

        setTimeout(() => {
          router.push(`/report?sessionId=${sessionId}`);
        }, 2000);
        return;
      }

      if (res.data.stage) {
        setStage(res.data.stage);
      }

      const aiMsg = { from: "ai", text: res.data.question };
      setMessages((prev) => [...prev, aiMsg]);

      // Extract MCQ options if it's an aptitude question
      if (res.data.stage === 'aptitude') {
        extractMCQOptions(res.data.question);
      } else {
        // Clear options for non-aptitude stages
        setMcqOptions([]);
        setSelectedOption("");
      }


      if (res.data.evaluation?.feedback) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              from: "system",
              text: `💡 ${res.data.evaluation.feedback}`
            }
          ]);
        }, 500);
      }
    } catch (error: any) {
      console.error("Failed to continue interview:", error);
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "system",
          text: "⚠️ Error processing your answer. Please try again."
        }
      ]);
    }
  }

  // Audio Recording Functions
  async function startAudioRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await processAudioAnswer(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecordingAudio(true);
    } catch (error) {
      console.error("Failed to start audio recording:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  }

  function stopAudioRecording() {
    if (mediaRecorder && isRecordingAudio) {
      mediaRecorder.stop();
      setIsRecordingAudio(false);
    }
  }

  async function processAudioAnswer(audioBlob: Blob) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'answer.webm');

      const res = await api.post('/interview/audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const transcribedText = res.data.text || "Unable to transcribe audio";
      await submitAnswer(transcribedText, 'audio');
    } catch (error) {
      console.error("Audio processing error:", error);
      setLoading(false);
      toast.error("Failed to process audio. Please try again.");
    }
  }

  async function handleVideoRecorded(videoBlob: Blob) {
    setLoading(true);
    try {
      const tempText = "Video answer recorded (video analysis coming soon)";
      await submitAnswer(tempText, 'video');
    } catch (error) {
      console.error("Video processing error:", error);
      setLoading(false);
    }
  }

  async function endInterview() {
    if (!sessionId) return;

    try {
      const res = await api.post("/interview/complete", { sessionId });
      setIsComplete(true);
      setScores(res.data.scores);

      setTimeout(() => {
        router.push(`/report?sessionId=${sessionId}`);
      }, 1500);
    } catch (error) {
      console.error("Failed to complete interview:", error);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && answerMode === 'text') {
      e.preventDefault();
      sendTextAnswer();
    }
  }

  // Strip MCQ options from question text (remove (A)... (B)... etc.)
  function stripMCQOptions(questionText: string): string {
    // Find where options start: first occurrence of (A)
    const firstOptionMatch = questionText.match(/\([A-D]\)/);
    if (firstOptionMatch && firstOptionMatch.index !== undefined) {
      // Return only the text before the first option
      return questionText.substring(0, firstOptionMatch.index).trim();
    }
    return questionText;
  }

  // Extract MCQ options from question text
  function extractMCQOptions(questionText: string) {
    // Pattern: (A) ... (B) ... (C) ... (D) ...
    const optionPattern = /\([A-D]\)\s*(.+?)(?=\s*\([A-D]\)|$)/g;
    const matches = Array.from(questionText.matchAll(optionPattern));

    if (matches.length >= 2) {
      const options = matches.map((match, idx) => ({
        letter: String.fromCharCode(65 + idx), // A, B, C, D
        text: match[1].trim()
      }));
      setMcqOptions(options.map(opt => `${opt.letter}) ${opt.text}`));
    } else {
      setMcqOptions([]);
    }
    setSelectedOption("");
  }

  // Handle MCQ option selection
  function handleOptionSelect(option: string) {
    if (loading) return;
    setSelectedOption(option);
  }

  // Submit MCQ answer
  async function submitMCQAnswer() {
    if (!selectedOption) return;

    // Auto-submit the selected option
    const optionLetter = selectedOption.charAt(0); // Get "A" from "A) ..."
    await submitAnswer(optionLetter, 'text');
    setSelectedOption("");
  }

  const getStageBadge = () => {
    const badges: Record<string, { text: string, color: string }> = {
      aptitude: { text: "Aptitude Test", color: "bg-yellow-500/20 text-yellow-300" },
      coding: { text: "DSA Coding", color: "bg-green-500/20 text-green-300" },
      technical: { text: "Technical Round", color: "bg-purple-500/20 text-purple-300" },
      hr: { text: "HR Round", color: "bg-blue-500/20 text-blue-300" },
      completed: { text: "Completed", color: "bg-gray-500/20 text-gray-300" }
    };

    const badge = badges[stage] || badges.aptitude;
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  // Resume Upload Screen
  if (showResumeUpload) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-[#0a0f1e] via-[#0d1425] to-[#060b18]">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <TopNav />

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6 uppercase tracking-widest backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Step 1 of 2
              </div>
              <h1 className="text-5xl font-black text-white mb-4">
                Upload Your Resume
              </h1>
              <p className="text-gray-300 text-lg max-w-xl mx-auto">
                Help the AI personalize your technical interview based on your skills and experience
              </p>
            </div>

            <div className="glass p-8 rounded-2xl mt-8 border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
              <div className="mb-6">
                <div className="border-2 border-dashed border-white/20 rounded-xl p-10 text-center hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 cursor-pointer"
                  onClick={() => document.getElementById('resume-file')?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                      setResumeFile(file);
                    }
                  }}
                >
                  <div className="text-7xl mb-4">📄</div>
                    {resumeFile ? (
                      <>
                        <p className="text-green-400 font-bold mb-2 text-lg flex items-center justify-center gap-2">
                          <span className="text-2xl">✓</span> {resumeFile.name}
                        </p>
                        <p className="text-gray-400 text-sm">Click to change file or drag & drop a new one</p>
                      </>
                    ) : (
                      <>
                        <p className="text-white font-bold mb-2 text-lg">Click to upload or drag & drop</p>
                        <p className="text-gray-400 text-sm mb-3">PDF or DOCX (Max 5MB)</p>
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Secure Upload
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            AI Parsing
                          </span>
                        </div>
                      </>
                    )}
                    <input
                      id="resume-file"
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setResumeFile(file);
                      }}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-5 mb-6">
                  <p className="text-blue-300 text-sm">
                    <span className="font-bold text-base">📌 How it works:</span>
                    <br />
                    <span className="text-blue-200/80">Your resume will be analyzed by AI to extract skills for <span className="font-bold text-blue-200">Technical Round</span> questions. Aptitude, Coding, and HR rounds use standardized questions.</span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleResumeUpload}
                    disabled={!resumeFile || uploadingResume}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploadingResume ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Parsing Resume...
                      </>
                    ) : (
                      <>
                        Start Interview with Resume
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                  <button
                    onClick={skipResumeUpload}
                    disabled={uploadingResume}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl font-bold text-lg transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
                  >
                    Skip
                  </button>
                </div>

                <p className="text-gray-500 text-xs text-center mt-4 flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                  Skipping will use default skills (JavaScript, React, Node.js)
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main Interview Screen
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0a0f1e] via-[#0d1425] to-[#060b18]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <TopNav />

          <div className="mt-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                AI Interview Session
              </h1>
              <p className="text-gray-300 mt-1 text-lg">
                Answer the questions to progress through the interview stages
              </p>
              {skills.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap items-center">
                  <span className="text-xs text-gray-400 font-semibold">Your Skills:</span>
                  {skills.slice(0, 5).map((skill, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 rounded-full border border-indigo-500/30 font-medium">
                      {skill}
                    </span>
                  ))}
                  {skills.length > 5 && (
                    <span className="text-xs px-3 py-1.5 bg-white/5 text-gray-400 rounded-full border border-white/10">
                      +{skills.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {getStageBadge()}
              {!isComplete && sessionId && (
                <button
                  onClick={endInterview}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 rounded-xl transition-all duration-200 border border-red-500/30 hover:border-red-500/50 font-semibold"
                >
                  End Interview
                </button>
              )}
            </div>
          </div>

          {/* Chat Box */}
          <div className="glass p-6 rounded-2xl h-[40vh] overflow-y-auto mt-6 border border-white/10 hover:border-indigo-500/20 transition-all duration-300">
            {messages.length === 0 && loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin h-10 w-10 border-3 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <div className="text-gray-400 font-medium">Initializing AI interview...</div>
                  </div>
                </div>
              )}

              {(() => {
                // Show only the current question (last AI message) and latest user answer
                const lastAiIndex = messages.findLastIndex(m => m.from === 'ai');
                const lastUserIndex = messages.findLastIndex(m => m.from === 'user');

                const messagesToShow: Array<ChatMessage & { originalIndex: number }> = [];

                // Add last AI question (stripped of options if MCQ)
                if (lastAiIndex !== -1) {
                  const aiMsg = messages[lastAiIndex];
                  const displayText = mcqOptions.length > 0 ? stripMCQOptions(aiMsg.text) : aiMsg.text;
                  messagesToShow.push({
                    ...aiMsg,
                    text: displayText,
                    originalIndex: lastAiIndex
                  });
                }

                // Add last user answer if it came after the AI question
                if (lastUserIndex !== -1 && lastUserIndex > lastAiIndex) {
                  messagesToShow.push({
                    ...messages[lastUserIndex],
                    originalIndex: lastUserIndex
                  });
                }

                return messagesToShow.map((m, i) => (
                  <div
                    key={m.originalIndex}
                    className={`mb-4 p-5 rounded-xl max-w-[85%] transition-all duration-300 ${m.from === "user"
                      ? "ml-auto bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/20"
                      : m.from === "system"
                        ? "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 text-yellow-200 border border-yellow-500/30 shadow-lg shadow-yellow-500/10"
                        : "bg-gradient-to-br from-white/10 to-white/5 text-gray-200 border border-white/10 shadow-lg"
                      }`}
                  >
                    {m.from === "ai" && (
                      <div className="text-xs text-indigo-300 mb-2 font-semibold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">🤖</span>
                        AI Interviewer
                      </div>
                    )}
                    {m.from === "user" && (
                      <div className="text-xs text-purple-300 mb-2 font-semibold flex items-center gap-2 justify-end">
                        You
                        <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">👤</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                  </div>
                ));
              })()}

              {loading && (
                <div className="p-5 bg-gradient-to-r from-white/10 to-white/5 rounded-xl w-fit text-gray-200 flex items-center gap-3 border border-white/10 shadow-lg">
                  <div className="animate-spin h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full"></div>
                  <span className="font-medium">AI is analyzing your response...</span>
                </div>
              )}

              {isComplete && scores && (
                <div className="mt-4 p-8 bg-gradient-to-br from-green-500/20 via-blue-500/15 to-purple-500/20 rounded-2xl border border-green-500/30 shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-5 flex items-center gap-3">
                    <span className="text-4xl">🎉</span>
                    Interview Complete!
                  </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 p-4 rounded-xl border border-white/10 hover:border-green-500/30 transition-all">
                        <div className="text-gray-400 text-sm mb-1 font-medium">Communication</div>
                        <div className="text-white text-2xl font-black">
                          {scores.communication?.toFixed(1) || '0'}<span className="text-gray-500 text-lg">/10</span>
                        </div>
                      </div>
                      <div className="bg-black/30 p-4 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all">
                        <div className="text-gray-400 text-sm mb-1 font-medium">Technical</div>
                        <div className="text-white text-2xl font-black">
                          {scores.technical?.toFixed(1) || '0'}<span className="text-gray-500 text-lg">/10</span>
                        </div>
                      </div>
                      <div className="bg-black/30 p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all">
                        <div className="text-gray-400 text-sm mb-1 font-medium">Confidence</div>
                        <div className="text-white text-2xl font-black">
                          {scores.confidence?.toFixed(1) || '0'}<span className="text-gray-500 text-lg">/10</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-500/30 to-purple-500/30 p-4 rounded-xl border border-indigo-500/50">
                        <div className="text-indigo-300 text-sm mb-1 font-bold">Overall Score</div>
                        <div className="text-white text-2xl font-black">
                          {scores.overall?.toFixed(1) || '0'}<span className="text-gray-300 text-lg">/10</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-5 text-sm flex items-center gap-2 justify-center">
                      <div className="animate-spin h-4 w-4 border-2 border-green-400 border-t-transparent rounded-full"></div>
                      Generating your detailed performance report...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Answer Mode Selector */}
          {!isComplete && (
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setAnswerMode('text')}
                className={`flex-1 px-6 py-3.5 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${answerMode === 'text' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30'}`}
              >
                <span className="text-xl">💬</span>
                Text Answer
              </button>
              <button
                onClick={() => setAnswerMode('audio')}
                className={`flex-1 px-6 py-3.5 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${answerMode === 'audio' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30'}`}
              >
                <span className="text-xl">🎤</span>
                Audio Answer
              </button>
              <button
                onClick={() => setAnswerMode('video')}
                className={`flex-1 px-6 py-3.5 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${answerMode === 'video' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30'}`}
              >
                <span className="text-xl">📹</span>
                Video Answer
              </button>
            </div>
          )}

          {/* Input Area Based on Mode */}
          {!isComplete && (
            <div className="mt-5">
              {/* MCQ Options for Aptitude Round */}
              {stage === 'aptitude' && mcqOptions.length > 0 ? (
                <div className="glass p-8 rounded-2xl border border-white/10 hover:border-indigo-500/20 transition-all duration-300 relative group">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <h4 className="text-gray-300 text-sm mb-5 font-bold flex items-center gap-2 uppercase tracking-wider">
                      <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300">✓</span>
                      Select your answer:
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {mcqOptions.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(option)}
                          disabled={loading}
                          className={`group/option p-5 rounded-xl text-left transition-all duration-200 font-medium relative overflow-hidden ${selectedOption === option
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white ring-2 ring-indigo-400 shadow-xl shadow-indigo-500/30 scale-105'
                            : 'bg-white/5 hover:bg-indigo-500/10 text-gray-200 hover:ring-2 hover:ring-indigo-500/30 border border-white/10 hover:border-indigo-500/30'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-102'}`}
                        >
                          {/* Corner decoration */}
                          {selectedOption === option && (
                            <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-bl-full"></div>
                          )}
                          <span className="relative z-10">{option}</span>
                        </button>
                      ))}
                    </div>

                    {/* Next Button for MCQ */}
                    {selectedOption && !loading && (
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={submitMCQAnswer}
                          className="group/btn px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 flex items-center gap-3"
                        >
                          Next Question
                          <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {loading && (
                      <div className="mt-6 text-center text-gray-400 text-sm flex items-center justify-center gap-3 bg-indigo-500/10 py-4 rounded-xl border border-indigo-500/20">
                        <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                        <span className="font-medium">Processing your answer...</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Regular input for non-MCQ questions
                <>
                  {answerMode === 'text' && (
                    <div className="space-y-4">
                      <div className="glass p-6 rounded-2xl border border-white/10 hover:border-indigo-500/20 transition-all duration-300 group relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                        
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="w-full p-0 bg-transparent border-none text-gray-100 resize-none focus:outline-none text-lg leading-relaxed placeholder-gray-500 relative z-10"
                          placeholder="Type your answer here... (Press Enter to send)"
                          rows={5}
                          disabled={loading}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-500 text-xs flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                          Press Enter to send or click the button
                        </p>
                        <button
                          onClick={sendTextAnswer}
                          disabled={loading || !input.trim()}
                          className="group/btn px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Answer
                              <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {answerMode === 'audio' && (
                    <div className="glass p-8 rounded-2xl border border-white/10 hover:border-green-500/20 transition-all duration-300 group relative overflow-hidden">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                      
                      <div className="relative z-10">
                        {!isRecordingAudio ? (
                          <button
                            onClick={startAudioRecording}
                            disabled={loading}
                            className="w-full py-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-300 rounded-xl font-bold text-lg transition-all duration-200 border border-green-500/30 hover:border-green-500/50 disabled:opacity-50 hover:scale-105 flex items-center justify-center gap-3 group/btn"
                          >
                            <span className="text-3xl group-hover/btn:scale-110 transition-transform">🎤</span>
                            Start Audio Recording
                          </button>
                        ) : (
                          <button
                            onClick={stopAudioRecording}
                            className="w-full py-6 bg-gradient-to-r from-red-600/30 to-red-700/30 hover:from-red-600/40 hover:to-red-700/40 text-white rounded-xl font-bold text-lg animate-pulse border border-red-500/50 flex items-center justify-center gap-3"
                          >
                            <span className="text-3xl">⏹</span>
                            Stop Recording
                          </button>
                        )}
                        <p className="text-gray-400 text-sm text-center mt-4 flex items-center justify-center gap-2">
                          {isRecordingAudio ? (
                            <>
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                              </span>
                              Speak clearly into your microphone
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              Click to record your answer
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {answerMode === 'video' && (
                    <div className="glass p-8 rounded-2xl border border-white/10 hover:border-purple-500/20 transition-all duration-300">
                      <VideoRecorder
                        onVideoRecorded={handleVideoRecorded}
                        disabled={loading}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
