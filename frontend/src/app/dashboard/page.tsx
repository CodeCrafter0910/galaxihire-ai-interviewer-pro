"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import InterviewHistory from "@/components/InterviewHistory";
import api from "@/lib/api";

interface Stats {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  lastInterviewDate?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0
  });
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // Extract user name from token (basic JWT decode)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserName(payload.name || payload.email || "User");
    } catch (e) {
      // Ignore
    }

    fetchStats();
  }, [router]);

  async function fetchStats() {
    try {
      const res = await api.get("/interview/history?limit=100");
      const sessions = res.data.sessions || [];

      const completed = sessions.filter((s: any) => s.status === "completed");
      const avgScore = completed.length > 0
        ? completed.reduce((sum: number, s: any) => sum + (s.scores?.overall || 0), 0) / completed.length
        : 0;

      setStats({
        totalInterviews: sessions.length,
        completedInterviews: completed.length,
        averageScore: avgScore,
        lastInterviewDate: sessions[0]?.startedAt
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <TopNav />

          {/* Welcome Section */}
          <section className="mt-6">
            <div className="glass p-6 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Welcome back, {userName}! 👋
                </h3>
                <p className="text-gray-300 mt-1">
                  Ready to ace your next interview?
                </p>
              </div>
              <div>
                <button
                  onClick={() => router.push("/interview")}
                  className="btn-primary px-8 py-3 font-bold"
                >
                  🎤 Start New Interview
                </button>
              </div>
            </div>
          </section>

          {/* Statistics Cards */}
          <section className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass p-5 rounded-xl">
              <div className="text-gray-400 text-sm mb-1">Total Interviews</div>
              <div className="text-white text-3xl font-bold">
                {loading ? "..." : stats.totalInterviews}
              </div>
            </div>
            <div className="glass p-5 rounded-xl">
              <div className="text-gray-400 text-sm mb-1">Completed</div>
              <div className="text-white text-3xl font-bold">
                {loading ? "..." : stats.completedInterviews}
              </div>
            </div>
            <div className="glass p-5 rounded-xl">
              <div className="text-gray-400 text-sm mb-1">Average Score</div>
              <div className="text-white text-3xl font-bold">
                {loading ? "..." : stats.averageScore.toFixed(1)}
                <span className="text-lg text-gray-400">/10</span>
              </div>
            </div>
            <div className="glass p-5 rounded-xl">
              <div className="text-gray-400 text-sm mb-1">Completion Rate</div>
              <div className="text-white text-3xl font-bold">
                {loading
                  ? "..."
                  : stats.totalInterviews > 0
                    ? Math.round((stats.completedInterviews / stats.totalInterviews) * 100)
                    : 0}
                <span className="text-lg text-gray-400">%</span>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mt-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push("/interview")}
                className="glass p-6 rounded-xl hover:bg-white/10 transition text-left"
              >
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-lg font-bold text-white mb-1">Start Interview</h3>
                <p className="text-gray-400 text-sm">
                  Begin a new AI-powered interview session
                </p>
              </button>

              <button
                onClick={() => router.push("/report")}
                className="glass p-6 rounded-xl hover:bg-white/10 transition text-left"
              >
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-lg font-bold text-white mb-1">View Reports</h3>
                <p className="text-gray-400 text-sm">
                  Check your performance reports and progress
                </p>
              </button>

              <button
                onClick={() => router.push("/resume-upload")}
                className="glass p-6 rounded-xl hover:bg-white/10 transition text-left"
              >
                <div className="text-4xl mb-3">📄</div>
                <h3 className="text-lg font-bold text-white mb-1">Upload Resume</h3>
                <p className="text-gray-400 text-sm">
                  Get personalized questions based on your skills
                </p>
              </button>
            </div>
          </section>

          {/* Interview History */}
          <section className="mt-6">
            <InterviewHistory />
          </section>
        </div>
      </main>
    </div>
  );
}
