"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function LiveInterview() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);

  async function askQuestion() {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/interview/ask", { question: question.trim() });
      const aiAnswer = res.data.answer || "No response received";
      
      setChatHistory(prev => [
        ...prev,
        { role: "user", content: question },
        { role: "ai", content: aiAnswer }
      ]);
      
      setAnswer(aiAnswer);
      setQuestion("");
      setLoading(false);
    } catch (error: any) {
      console.error("Failed to ask question:", error);
      toast.error(error.response?.data?.error || "Failed to get response");
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  }

  function clearChat() {
    setChatHistory([]);
    setAnswer("");
    setQuestion("");
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0a0f1e] via-[#0d1425] to-[#060b18]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <TopNav />

          <div className="mt-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                Live AI Interview
              </h1>
              <p className="text-gray-300 text-lg">
                Practice with real-time AI responses and instant feedback
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-green-300 font-semibold text-sm">Live Session</span>
              </div>
              {chatHistory.length > 0 && (
                <button
                  onClick={clearChat}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 rounded-xl transition-all duration-200 border border-red-500/30 hover:border-red-500/50 font-semibold"
                >
                  Clear Chat
                </button>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="mt-6 glass p-6 rounded-2xl h-[50vh] overflow-y-auto border border-white/10 hover:border-indigo-500/20 transition-all duration-300">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-7xl mb-6">🤖</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Ready to Practice?</h3>
                  <p className="text-gray-400 max-w-md mb-6">
                    Ask any interview question and get instant AI-powered responses. Perfect for practicing your interview skills!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                    <button
                      onClick={() => setQuestion("Tell me about yourself")}
                      className="p-4 bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/30 rounded-xl text-left transition-all"
                    >
                      <div className="text-indigo-300 font-semibold mb-1">Tell me about yourself</div>
                      <div className="text-gray-500 text-xs">Common opening question</div>
                    </button>
                    <button
                      onClick={() => setQuestion("What are your strengths and weaknesses?")}
                      className="p-4 bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/30 rounded-xl text-left transition-all"
                    >
                      <div className="text-purple-300 font-semibold mb-1">Strengths & weaknesses?</div>
                      <div className="text-gray-500 text-xs">Self-assessment question</div>
                    </button>
                    <button
                      onClick={() => setQuestion("Explain a challenging project you worked on")}
                      className="p-4 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 rounded-xl text-left transition-all"
                    >
                      <div className="text-blue-300 font-semibold mb-1">Challenging project?</div>
                      <div className="text-gray-500 text-xs">Technical experience</div>
                    </button>
                    <button
                      onClick={() => setQuestion("Why do you want to work here?")}
                      className="p-4 bg-white/5 hover:bg-green-500/10 border border-white/10 hover:border-green-500/30 rounded-xl text-left transition-all"
                    >
                      <div className="text-green-300 font-semibold mb-1">Why this company?</div>
                      <div className="text-gray-500 text-xs">Motivation question</div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-xl max-w-[85%] transition-all duration-300 ${
                        msg.role === "user"
                          ? "ml-auto bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/20"
                          : "bg-gradient-to-br from-white/10 to-white/5 text-gray-200 border border-white/10 shadow-lg"
                      }`}
                    >
                      {msg.role === "ai" && (
                        <div className="text-xs text-indigo-300 mb-2 font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">🤖</span>
                          AI Interviewer
                        </div>
                      )}
                      {msg.role === "user" && (
                        <div className="text-xs text-purple-300 mb-2 font-semibold flex items-center gap-2 justify-end">
                          You
                          <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">👤</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    </div>
                  ))}
                  {loading && (
                    <div className="p-5 bg-gradient-to-r from-white/10 to-white/5 rounded-xl w-fit text-gray-200 flex items-center gap-3 border border-white/10 shadow-lg">
                      <div className="animate-spin h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full"></div>
                      <span className="font-medium">AI is thinking...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="mt-5 space-y-4">
            <div className="glass p-6 rounded-2xl border border-white/10 hover:border-indigo-500/20 transition-all duration-300">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-0 bg-transparent border-none text-gray-100 resize-none focus:outline-none text-lg leading-relaxed placeholder-gray-500"
                placeholder="Ask any interview question... (Press Enter to send)"
                rows={3}
                disabled={loading}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                Press Enter to send or click the button
              </p>
              <button
                onClick={askQuestion}
                disabled={loading || !question.trim()}
                className="group/btn px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="text-xl">🚀</span>
                    Ask Question
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass p-5 rounded-xl border border-white/10 hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl">💬</div>
                <h4 className="font-bold text-white">Real-time Responses</h4>
              </div>
              <p className="text-gray-400 text-sm">Get instant AI-powered answers to practice your interview skills</p>
            </div>
            <div className="glass p-5 rounded-xl border border-white/10 hover:border-purple-500/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl">🎯</div>
                <h4 className="font-bold text-white">Any Question</h4>
              </div>
              <p className="text-gray-400 text-sm">Ask behavioral, technical, or HR questions - no limits!</p>
            </div>
            <div className="glass p-5 rounded-xl border border-white/10 hover:border-green-500/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-xl">⚡</div>
                <h4 className="font-bold text-white">Instant Practice</h4>
              </div>
              <p className="text-gray-400 text-sm">No setup required - start practicing immediately</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
