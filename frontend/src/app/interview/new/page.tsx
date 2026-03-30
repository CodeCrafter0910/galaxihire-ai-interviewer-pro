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
      <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <TopNav />

            <div className="mt-12 text-center">
              <h1 className="text-4xl font-bold text-white mb-3">Upload Your Resume</h1>
              <p className="text-gray-300 text-lg">
                Help the AI personalize your technical interview based on your skills
              </p>
            </div>

            <div className="glass p-8 rounded-2xl mt-8">
              <div className="mb-6">
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-indigo-500/50 transition cursor-pointer"
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
                  <div className="text-6xl mb-4">📄</div>
                  {resumeFile ? (
                    <>
                      <p className="text-green-400 font-semibold mb-2">✓ {resumeFile.name}</p>
                      <p className="text-gray-400 text-sm">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <p className="text-white font-semibold mb-2">Click to upload or drag & drop</p>
                      <p className="text-gray-400 text-sm">PDF or DOCX (Max 5MB)</p>
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

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-blue-300 text-sm">
                  <span className="font-bold">📌 Note:</span> Your resume will be used to extract skills for <span className="font-bold">Technical Round</span> questions. HR and Coding rounds will have general questions.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleResumeUpload}
                  disabled={!resumeFile || uploadingResume}
                  className="flex-1 btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingResume ? "Parsing Resume..." : "Start Interview with Resume"}
                </button>
                <button
                  onClick={skipResumeUpload}
                  disabled={uploadingResume}
                  className="px-6 py-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition disabled:opacity-50"
                >
                  Skip
                </button>
              </div>

              <p className="text-gray-500 text-xs text-center mt-4">
                Skipping will use default skills (JavaScript, React, Node.js)
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main Interview Screen
  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <TopNav />

          <div className="mt-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">AI Interview</h1>
              <p className="text-gray-300 mt-1">
                Answer the questions to progress through the interview
              </p>
              {skills.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="text-xs text-gray-400">Your skills:</span>
                  {skills.slice(0, 5).map((skill, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {getStageBadge()}
              {!isComplete && sessionId && (
                <button
                  onClick={endInterview}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
                >
                  End Interview
                </button>
              )}
            </div>
          </div>

          {/* Chat Box */}
          <div className="glass p-6 rounded-xl h-[40vh] overflow-y-auto mt-6">
            {messages.length === 0 && loading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400">Initializing interview...</div>
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
                  className={`mb-4 p-4 rounded-xl max-w-[80%] ${m.from === "user"
                    ? "ml-auto bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-white"
                    : m.from === "system"
                      ? "bg-yellow-500/10 text-yellow-200 border border-yellow-500/20"
                      : "bg-white/10 text-gray-200"
                    }`}
                >
                  {m.from === "ai" && (
                    <div className="text-xs text-gray-400 mb-1">🤖 AI Interviewer</div>
                  )}
                  {m.from === "user" && (
                    <div className="text-xs text-gray-300 mb-1">You</div>
                  )}
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
              ));
            })()}

            {loading && (
              <div className="p-4 bg-white/10 rounded-xl w-fit text-gray-200 flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                AI is thinking...
              </div>
            )}

            {isComplete && scores && (
              <div className="mt-4 p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30">
                <h3 className="text-xl font-bold text-white mb-3">Interview Complete! 🎉</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="text-gray-400 text-sm">Communication</div>
                    <div className="text-white text-xl font-bold">
                      {scores.communication?.toFixed(1) || '0'}/10
                    </div>
                  </div>
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="text-gray-400 text-sm">Technical</div>
                    <div className="text-white text-xl font-bold">
                      {scores.technical?.toFixed(1) || '0'}/10
                    </div>
                  </div>
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="text-gray-400 text-sm">Confidence</div>
                    <div className="text-white text-xl font-bold">
                      {scores.confidence?.toFixed(1) || '0'}/10
                    </div>
                  </div>
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="text-gray-400 text-sm">Overall</div>
                    <div className="text-white text-xl font-bold">
                      {scores.overall?.toFixed(1) || '0'}/10
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mt-3 text-sm">Redirecting to your detailed report...</p>
              </div>
            )}
          </div>

          {/* Answer Mode Selector */}
          {!isComplete && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setAnswerMode('text')}
                className={`px-4 py-2 rounded-lg transition ${answerMode === 'text' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                💬 Text
              </button>
              <button
                onClick={() => setAnswerMode('audio')}
                className={`px-4 py-2 rounded-lg transition ${answerMode === 'audio' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                🎤 Audio
              </button>
              <button
                onClick={() => setAnswerMode('video')}
                className={`px-4 py-2 rounded-lg transition ${answerMode === 'video' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                📹 Video
              </button>
            </div>
          )}

          {/* Input Area Based on Mode */}
          {!isComplete && (
            <div className="mt-4">
              {/* MCQ Options for Aptitude Round */}
              {stage === 'aptitude' && mcqOptions.length > 0 ? (
                <div className="glass p-6 rounded-xl">
                  <h4 className="text-gray-300 text-sm mb-4 font-semibold">Select your answer:</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {mcqOptions.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(option)}
                        disabled={loading}
                        className={`p-4 rounded-lg text-left transition-all font-medium ${selectedOption === option
                          ? 'bg-indigo-500 text-white ring-2 ring-indigo-400 shadow-lg'
                          : 'bg-white/5 hover:bg-indigo-500/20 text-gray-200 hover:ring-2 hover:ring-indigo-500/50'
                          } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {/* Next Button for MCQ */}
                  {selectedOption && !loading && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={submitMCQAnswer}
                        className="btn-primary px-8 py-3 flex items-center gap-2 group"
                      >
                        Next Question
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  )}

                  {loading && (
                    <div className="mt-4 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                      Processing your answer...
                    </div>
                  )}
                </div>
              ) : (
                // Regular input for non-MCQ questions
                <>
                  {answerMode === 'text' && (
                    <div className="space-y-3">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-gray-100 resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Type your answer here... (Press Enter to send)"
                        rows={4}
                        disabled={loading}
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={sendTextAnswer}
                          disabled={loading || !input.trim()}
                          className="btn-primary px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Sending..." : "Send Answer"}
                        </button>
                      </div>
                    </div>
                  )}

                  {answerMode === 'audio' && (
                    <div className="glass p-6 rounded-xl">
                      {!isRecordingAudio ? (
                        <button
                          onClick={startAudioRecording}
                          disabled={loading}
                          className="w-full py-4 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl font-bold transition disabled:opacity-50"
                        >
                          🎤 Start Audio Recording
                        </button>
                      ) : (
                        <button
                          onClick={stopAudioRecording}
                          className="w-full py-4 bg-red-600/30 hover:bg-red-600/40 text-white rounded-xl font-bold animate-pulse"
                        >
                          ⏹ Stop Recording
                        </button>
                      )}
                      <p className="text-gray-400 text-sm text-center mt-2">
                        {isRecordingAudio ? "Speak clearly into your microphone" : "Click to record your answer"}
                      </p>
                    </div>
                  )}

                  {answerMode === 'video' && (
                    <div className="glass p-6 rounded-xl">
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
