"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import api from "@/lib/api";

interface Interview {
  _id: string;
  status: string;
  stage: string;
  startedAt: string;
  completedAt?: string;
  scores?: {
    overall: number;
    communication: number;
    technical: number;
    confidence: number;
  };
}

export default function MyInterviewsPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    loadInterviews();
  }, [router]);

  async function loadInterviews() {
    try {
      setLoading(true);
      const res = await api.get("/interview/history");
      setInterviews(res.data.sessions || []);
    } catch (error) {
      console.error("Failed to load interviews:", error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const badges: Record<string, { text: string; color: string }> = {
      "in-progress": { text: "In Progress", color: "bg-yellow-500/20 text-yellow-300" },
      completed: { text: "Completed", color: "bg-green-500/20 text-green-300" },
      abandoned: { text: "Abandoned", color: "bg-red-500/20 text-red-300" },
    };
    const badge = badges[status] || badges["in-progress"];
    return (
      <span className={`px-3 py-1 rounded-full text-xs ${badge.color}`}>
        {badge.text}
      </span>
    );
  }

  function getStageBadge(stage: string) {
    const badges: Record<string, { text: string; color: string }> = {
      hr: { text: "HR", color: "bg-blue-500/20 text-blue-300" },
      technical: { text: "Technical", color: "bg-purple-500/20 text-purple-300" },
      coding: { text: "Coding", color: "bg-green-500/20 text-green-300" },
      completed: { text: "✓ Done", color: "bg-gray-500/20 text-gray-300" },
    };
    const badge = badges[stage] || badges.hr;
    return (
      <span className={`px-2 py-1 rounded text-xs ${badge.color}`}>
        {badge.text}
      </span>
    );
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <TopNav />

          <div className="mt-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">My Interviews</h1>
              <p className="text-gray-300 mt-1">
                View your interview history and results
              </p>
            </div>
            <div className="flex gap-3">
              {interviews.length > 0 && (
                <button
                  onClick={async () => {
                    if (confirm("Delete all interviews? This cannot be undone!")) {
                      try {
                        for (const interview of interviews) {
                          await api.delete(`/interview/${interview._id}`);
                        }
                        setInterviews([]);
                        alert("All interviews deleted!");
                        loadInterviews();
                      } catch (error) {
                        console.error("Failed to delete:", error);
                        alert("Some interviews could not be deleted");
                      }
                    }
                  }}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition text-sm"
                >
                  🗑️ Clear All
                </button>
              )}
              <button
                onClick={() => router.push("/interview/new")}
                className="btn-primary px-6 py-3"
              >
                ▶️ Start New Interview
              </button>
            </div>
          </div>

          {loading ? (
            <div className="glass p-12 rounded-xl mt-6 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading interviews...</p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="glass p-12 rounded-xl mt-6 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Interviews Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start your first AI interview to see it here
              </p>
              <button
                onClick={() => router.push("/interview/new")}
                className="btn-primary px-6 py-3"
              >
                Start Your First Interview
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  className="glass p-6 rounded-xl hover:ring-2 hover:ring-indigo-500/30 transition cursor-pointer"
                  onClick={() => {
                    if (interview.status === "completed") {
                      router.push(`/report?sessionId=${interview._id}`);
                    } else {
                      router.push(`/interview/live?sessionId=${interview._id}`);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">
                          Interview Session
                        </h3>
                        {getStatusBadge(interview.status)}
                        {getStageBadge(interview.stage)}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>📅 {formatDate(interview.startedAt)}</span>
                        {interview.completedAt && (
                          <span>
                            ✓ Completed {formatDate(interview.completedAt)}
                          </span>
                        )}
                      </div>

                      {interview.scores && (
                        <div className="mt-4 flex gap-3">
                          <div className="bg-white/5 px-3 py-2 rounded-lg">
                            <span className="text-xs text-gray-400">Overall:</span>
                            <span className="ml-2 text-white font-bold">
                              {interview.scores.overall.toFixed(1)}/10
                            </span>
                          </div>
                          <div className="bg-white/5 px-3 py-2 rounded-lg">
                            <span className="text-xs text-gray-400">Technical:</span>
                            <span className="ml-2 text-white font-bold">
                              {interview.scores.technical.toFixed(1)}/10
                            </span>
                          </div>
                          <div className="bg-white/5 px-3 py-2 rounded-lg">
                            <span className="text-xs text-gray-400">Communication:</span>
                            <span className="ml-2 text-white font-bold">
                              {interview.scores.communication.toFixed(1)}/10
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition text-sm">
                      {interview.status === "completed"
                        ? "View Report →"
                        : "Continue →"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
