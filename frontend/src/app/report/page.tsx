"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import api from "@/lib/api";

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
      // Show error message
      alert("Failed to generate report. Please try again.");
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
      alert("PDF is still being generated. Please wait a few seconds and try again.");
      return;
    }
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    window.open(`${backendUrl}${pdfUrl}`, "_blank");
  }

  if (loading || generating) {
    return (
      <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <TopNav />
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-300">
                  {generating ? "Generating your performance report..." : "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <TopNav />

          <div className="mt-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Performance Reports</h1>
            <button
              onClick={() => router.push("/interview")}
              className="btn-primary px-6 py-3"
            >
              Start New Interview
            </button>
          </div>

          {view === "list" && (
            <div className="mt-6">
              {reports.length === 0 ? (
                <div className="glass p-12 rounded-xl text-center">
                  <p className="text-gray-400 mb-4">No reports yet</p>
                  <button
                    onClick={() => router.push("/interview")}
                    className="btn-primary px-6 py-3"
                  >
                    Take Your First Interview
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {reports.map((r) => (
                    <div
                      key={r._id}
                      className="glass p-6 rounded-xl cursor-pointer hover:bg-white/10 transition"
                      onClick={() => {
                        setReport(r);
                        setView("detail");
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {r.summary}
                          </h3>
                          {r.interviewId && (
                            <p className="text-gray-400 text-sm mb-3">
                              Completed on{" "}
                              {new Date(r.interviewId.completedAt).toLocaleDateString()}
                            </p>
                          )}
                          <div className="grid grid-cols-5 gap-3">
                            <div className="bg-black/30 p-3 rounded-lg">
                              <div className="text-gray-400 text-xs">Overall</div>
                              <div className="text-white text-xl font-bold">
                                {r.detailedScores.overall.toFixed(1)}
                              </div>
                            </div>
                            <div className="bg-black/30 p-3 rounded-lg">
                              <div className="text-gray-400 text-xs">Communication</div>
                              <div className="text-white text-xl font-bold">
                                {r.detailedScores.communication.toFixed(1)}
                              </div>
                            </div>
                            <div className="bg-black/30 p-3 rounded-lg">
                              <div className="text-gray-400 text-xs">Technical</div>
                              <div className="text-white text-xl font-bold">
                                {r.detailedScores.technical.toFixed(1)}
                              </div>
                            </div>
                            <div className="bg-black/30 p-3 rounded-lg">
                              <div className="text-gray-400 text-xs">Confidence</div>
                              <div className="text-white text-xl font-bold">
                                {r.detailedScores.confidence.toFixed(1)}
                              </div>
                            </div>
                            <div className="bg-black/30 p-3 rounded-lg">
                              <div className="text-gray-400 text-xs">Coding</div>
                              <div className="text-white text-xl font-bold">
                                {r.detailedScores.coding.toFixed(1)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPDF(r.pdfUrl);
                          }}
                          className="ml-4 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg"
                        >
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
                className="mb-4 text-indigo-400 hover:text-indigo-300"
              >
                ← Back to Reports
              </button>

              <div className="glass p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-6">{report.summary}</h2>

                {/* Scores Grid */}
                <div className="grid grid-cols-5 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-xl border border-indigo-500/30">
                    <div className="text-gray-300 text-sm mb-1">Overall</div>
                    <div className="text-white text-3xl font-bold">
                      {report.detailedScores.overall.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl">
                    <div className="text-gray-300 text-sm mb-1">Communication</div>
                    <div className="text-white text-3xl font-bold">
                      {report.detailedScores.communication.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl">
                    <div className="text-gray-300 text-sm mb-1">Technical</div>
                    <div className="text-white text-3xl font-bold">
                      {report.detailedScores.technical.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl">
                    <div className="text-gray-300 text-sm mb-1">Confidence</div>
                    <div className="text-white text-3xl font-bold">
                      {report.detailedScores.confidence.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl">
                    <div className="text-gray-300 text-sm mb-1">Coding</div>
                    <div className="text-white text-3xl font-bold">
                      {report.detailedScores.coding.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Strengths */}


                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-3">✨ Strengths</h3>
                  <ul className="space-y-2">
                    {report.strengths.map((s, i) => (
                      <li key={i} className="text-gray-300 flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-3">🎯 Areas to Improve</h3>
                  <ul className="space-y-2">
                    {report.improvements.map((imp, i) => (
                      <li key={i} className="text-gray-300 flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">→</span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-3">💡 Recommendations</h3>
                  <ul className="space-y-2">
                    {report.recommendations.map((rec, i) => (
                      <li key={i} className="text-gray-300">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Learning Roadmap */}
                {report.learningRoadmap && report.learningRoadmap.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-3">🗺️ Learning Roadmap</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {report.learningRoadmap.map((item, i) => (
                        <div key={i} className="bg-black/30 p-4 rounded-lg">
                          <div className="text-indigo-400 font-bold mb-1">
                            Week {item.week}
                          </div>
                          <div className="text-gray-300 text-sm">{item.focus}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Download Button */}
                <button
                  onClick={() => downloadPDF(report.pdfUrl)}
                  className="btn-primary px-8 py-3 w-full"
                >
                  Download Full PDF Report
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
