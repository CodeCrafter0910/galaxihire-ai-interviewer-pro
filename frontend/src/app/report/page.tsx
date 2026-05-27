"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Report {
  _id: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  detailedScores: {
    communication: number;
    technical: number;
    confidence: number;
    coding: number;
    overall: number;
  };
  recommendations: string[];
  learningRoadmap?: Array<{ week: number; focus: string }>;
  pdfUrl: string;
  createdAt: string;
  interviewId?: {
    startedAt: string;
    completedAt: string;
    stage: string;
    skills: string[];
  };
}

function ReportPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const reportId = searchParams.get("reportId");

  const [report, setReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [view, setView] = useState<"list" | "detail">("list");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    if (sessionId) {
      // Generate report from session
      generateReportFromSession(sessionId);
    } else if (reportId) {
      // Load specific report
      loadReport(reportId);
    } else {
      // Load all reports
      loadReportsList();
    }
  }, [sessionId, reportId]);

  async function generateReportFromSession(sid: string) {
    try {
      setGenerating(true);
      setLoading(false); // Stop initial loading spinner
      console.log("Generating report for session:", sid);
      const res = await api.post("/report/generate", { sessionId: sid });
      console.log("Report generated successfully:", res.data);
      setReport(res.data.report);
      setView("detail");
      setGenerating(false);
    } catch (error) {
      console.error("Failed to generate report:", error);
      setGenerating(false);
      setLoading(false);
      toast.error("Failed to generate report. Please try again.");
    }
  }

  async function loadReport(rid: string) {
    try {
      const res = await api.get(`/report/${rid}`);
      setReport(res.data.report);
      setView("detail");
      setLoading(false);
    } catch (error) {
      console.error("Failed to load report:", error);
      setLoading(false);
    }
  }

  async function loadReportsList() {
    try {
      const res = await api.get("/report/list");
      setReports(res.data.reports || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load reports:", error);
      setLoading(false);
    }
  }

  function downloadPDF(pdfUrl: string) {
    if (!pdfUrl || pdfUrl === 'undefined') {
      toast("PDF is still being generated. Please wait a few seconds and try again.", { icon: "⏳" });
      return;
    }
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    window.open(`${backendUrl}${pdfUrl}`, "_blank");
  }

  if (loading || generating) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-[#0a0f1e] via-[#0d1425] to-[#060b18]">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <TopNav />
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-300 text-xl font-semibold mb-2">
                  {generating ? "Generating Your Performance Report" : "Loading Report"}
                </p>
                <p className="text-gray-500 text-sm">
                  {generating ? "AI is analyzing your interview performance..." : "Please wait..."}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
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
                Performance Reports
              </h1>
              <p className="text-gray-300 text-lg">Track your interview progress and improvements</p>
            </div>
            <button
              onClick={() => router.push("/interview")}
              className="group px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center gap-2"
            >
              Start New Interview
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {view === "list" && (
            <div className="mt-6">
              {reports.length === 0 ? (
                <div className="glass p-16 rounded-2xl text-center border border-white/10">
                  <div className="text-7xl mb-6">📊</div>
                  <p className="text-gray-400 text-xl mb-6 font-medium">No reports yet</p>
                  <p className="text-gray-500 mb-8">Take your first AI interview to get personalized feedback</p>
                  <button
                    onClick={() => router.push("/interview")}
                    className="group/btn px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 inline-flex items-center gap-2"
                  >
                    Take Your First Interview
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {reports.map((r, idx) => (
                    <div
                      key={r._id}
                      className="glass p-8 rounded-2xl cursor-pointer hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-indigo-500/30"
                      onClick={() => {
                        setReport(r);
                        setView("detail");
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-2xl border border-indigo-500/30">
                              📊
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                {r.summary}
                              </h3>
                              {r.interviewId && (
                                <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                  Completed on {new Date(r.interviewId.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-5 gap-4 mt-5">
                            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-xl border border-indigo-500/30">
                              <div className="text-indigo-300 text-xs font-bold mb-1">Overall</div>
                              <div className="text-white text-2xl font-black">
                                {r.detailedScores.overall.toFixed(1)}<span className="text-gray-400 text-sm">/10</span>
                              </div>
                            </div>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                              <div className="text-gray-400 text-xs font-medium mb-1">Communication</div>
                              <div className="text-white text-2xl font-black">
                                {r.detailedScores.communication.toFixed(1)}<span className="text-gray-500 text-sm">/10</span>
                              </div>
                            </div>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                              <div className="text-gray-400 text-xs font-medium mb-1">Technical</div>
                              <div className="text-white text-2xl font-black">
                                {r.detailedScores.technical.toFixed(1)}<span className="text-gray-500 text-sm">/10</span>
                              </div>
                            </div>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                              <div className="text-gray-400 text-xs font-medium mb-1">Confidence</div>
                              <div className="text-white text-2xl font-black">
                                {r.detailedScores.confidence.toFixed(1)}<span className="text-gray-500 text-sm">/10</span>
                              </div>
                            </div>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                              <div className="text-gray-400 text-xs font-medium mb-1">Coding</div>
                              <div className="text-white text-2xl font-black">
                                {r.detailedScores.coding.toFixed(1)}<span className="text-gray-500 text-sm">/10</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPDF(r.pdfUrl);
                          }}
                          className="ml-6 group/btn px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-300 rounded-xl font-semibold transition-all duration-200 border border-green-500/30 hover:border-green-500/50 flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === "detail" && report && (
            <div className="mt-6">
              <button
                onClick={() => setView("list")}
                className="mb-6 group flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-semibold"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Reports
              </button>

              <div className="glass p-10 rounded-2xl border border-white/10 hover:border-indigo-500/20 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-4xl border border-indigo-500/30">
                      📊
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-black text-white mb-2">
                        {report.summary}
                      </h2>
                      {report.interviewId && (
                        <p className="text-gray-400 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Completed on {new Date(report.interviewId.completedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Scores Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
                    {([
                      { label: "Overall", key: "overall", accent: true, icon: "🎯" },
                      { label: "Communication", key: "communication", accent: false, icon: "💬" },
                      { label: "Technical", key: "technical", accent: false, icon: "⚙️" },
                      { label: "Confidence", key: "confidence", accent: false, icon: "💪" },
                      { label: "Coding", key: "coding", accent: false, icon: "💻" },
                    ] as { label: string; key: keyof typeof report.detailedScores; accent: boolean; icon: string }[]).map(({ label, key, accent, icon }) => {
                      const val = report.detailedScores[key];
                      return (
                        <div key={key} className={`p-6 rounded-2xl border transition-all duration-300 ${
                          accent
                            ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/15 border-indigo-500/40 shadow-lg shadow-indigo-500/20"
                            : "bg-black/30 border-white/10 hover:border-indigo-500/30"
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className={`text-xs font-bold uppercase tracking-wider ${accent ? 'text-indigo-300' : 'text-gray-400'}`}>
                              {label}
                            </div>
                            <span className="text-2xl">{icon}</span>
                          </div>
                          <div className={`text-3xl font-black mb-3 ${accent ? 'text-white' : 'text-white'}`}>
                            {val.toFixed(1)}<span className="text-gray-500 text-lg">/10</span>
                          </div>
                          <div className="score-bar-track">
                            <div 
                              className="score-bar-fill" 
                              style={{ 
                                width: `${(val / 10) * 100}%`,
                                background: accent ? 'linear-gradient(90deg, #6366f1, #a855f7)' : 'linear-gradient(90deg, #4b5563, #6b7280)'
                              }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Strengths */}
                  <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30">
                    <h3 className="text-2xl font-black text-white mb-5 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-xl">✨</span>
                      Strengths
                    </h3>
                    <ul className="space-y-3">
                      {report.strengths.map((s, i) => (
                        <li key={i} className="text-gray-200 flex items-start gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-colors">
                          <span className="text-green-400 mt-1 text-xl flex-shrink-0">✓</span>
                          <span className="leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/30">
                    <h3 className="text-2xl font-black text-white mb-5 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-xl">🎯</span>
                      Areas to Improve
                    </h3>
                    <ul className="space-y-3">
                      {report.improvements.map((imp, i) => (
                        <li key={i} className="text-gray-200 flex items-start gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-colors">
                          <span className="text-yellow-400 mt-1 text-xl flex-shrink-0">→</span>
                          <span className="leading-relaxed">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/30">
                    <h3 className="text-2xl font-black text-white mb-5 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">💡</span>
                      Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {report.recommendations.map((rec, i) => (
                        <li key={i} className="text-gray-200 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-colors leading-relaxed">
                          <span className="text-blue-400 font-bold mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Learning Roadmap */}
                  {report.learningRoadmap && report.learningRoadmap.length > 0 && (
                    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/30">
                      <h3 className="text-2xl font-black text-white mb-5 flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl">🗺️</span>
                        Learning Roadmap
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {report.learningRoadmap.map((item, i) => (
                          <div key={i} className="bg-black/30 p-5 rounded-xl border border-white/10 hover:border-purple-500/30 hover:scale-105 transition-all group/roadmap relative overflow-hidden">
                            {/* Corner decoration */}
                            <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/10 rounded-bl-full opacity-0 group-hover/roadmap:opacity-100 transition-opacity"></div>
                            
                            <div className="relative z-10">
                              <div className="text-purple-400 font-black mb-2 text-lg flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-sm">
                                  {item.week}
                                </span>
                                Week {item.week}
                              </div>
                              <div className="text-gray-300 text-sm leading-relaxed">{item.focus}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Download Button */}
                  <button
                    onClick={() => downloadPDF(report.pdfUrl)}
                    className="group/btn w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Full PDF Report
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <TopNav />
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          </div>
        </main>
      </div>
    }>
      <ReportPageContent />
    </Suspense>
  );
}
