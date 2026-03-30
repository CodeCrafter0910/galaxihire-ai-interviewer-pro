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

const statConfig = [
  {
    key: "totalInterviews" as const,
    label: "Total Interviews",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    color: "text-indigo-400",
    accent: "border-indigo-500/40",
    format: (v: number) => v.toString(),
  },
  {
    key: "completedInterviews" as const,
    label: "Completed",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-emerald-400",
    accent: "border-emerald-500/40",
    format: (v: number) => v.toString(),
  },
  {
    key: "averageScore" as const,
    label: "Average Score",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    color: "text-yellow-400",
    accent: "border-yellow-500/40",
    format: (v: number) => `${v.toFixed(1)}/10`,
  },
  {
    key: null,
    label: "Completion Rate",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: "text-purple-400",
    accent: "border-purple-500/40",
    format: (_: number, stats: Stats) =>
      stats.totalInterviews > 0
        ? `${Math.round((stats.completedInterviews / stats.totalInterviews) * 100)}%`
        : "0%",
  },
];

const quickActions = [
  {
    href: "/interview/new",
    emoji: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Start Interview",
    desc: "Begin a new AI-powered interview session",
    gradient: "from-indigo-500/15 to-purple-500/10",
    border: "border-indigo-500/20",
  },
  {
    href: "/report",
    emoji: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "View Reports",
    desc: "Check your performance reports and progress",
    gradient: "from-emerald-500/15 to-cyan-500/10",
    border: "border-emerald-500/20",
  },
  {
    href: "/resume-upload",
    emoji: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    title: "Upload Resume",
    desc: "Get personalized questions based on your skills",
    gradient: "from-amber-500/15 to-orange-500/10",
    border: "border-amber-500/20",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
  });
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserName(payload.name || payload.email?.split("@")[0] || "User");
    } catch {/* ignore */}
    fetchStats();
  }, [router]);

  async function fetchStats() {
    try {
      const res = await api.get("/interview/history?limit=100");
      const sessions = res.data.sessions || [];
      const completed = sessions.filter((s: any) => s.status === "completed");
      const avgScore =
        completed.length > 0
          ? completed.reduce((sum: number, s: any) => sum + (s.scores?.overall || 0), 0) / completed.length
          : 0;
      setStats({
        totalInterviews: sessions.length,
        completedInterviews: completed.length,
        averageScore: avgScore,
        lastInterviewDate: sessions[0]?.startedAt,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <TopNav />

          {/* Welcome */}
          <section className="mt-6 glass p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in border border-indigo-500/10">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome back, <span className="text-indigo-300">{userName}</span> 👋
              </h2>
              <p className="text-gray-400 mt-1 text-sm">Ready to ace your next interview?</p>
            </div>
            <button
              onClick={() => router.push("/interview/new")}
              className="btn-primary px-6 py-2.5 font-bold flex-shrink-0"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Interview
            </button>
          </section>

          {/* Stats */}
          <section className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statConfig.map((cfg) => {
              const rawVal = cfg.key ? stats[cfg.key] : 0;
              const display = loading ? "—" : cfg.format(rawVal as number, stats);
              return (
                <div key={cfg.label} className={`stat-card border ${cfg.accent}`}>
                  <div className={`${cfg.color} mb-1`}>{cfg.icon}</div>
                  <div className="text-gray-400 text-xs">{cfg.label}</div>
                  <div className="text-white text-2xl font-bold mt-1">{display}</div>
                </div>
              );
            })}
          </section>

          {/* Quick Actions */}
          <section className="mt-6">
            <h2 className="text-lg font-bold text-white mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((qa) => (
                <button
                  key={qa.href}
                  onClick={() => router.push(qa.href)}
                  className={`glass p-5 rounded-2xl hover:bg-white/5 transition-all duration-200 text-left border ${qa.border} bg-gradient-to-br ${qa.gradient} hover:scale-[1.02]`}
                >
                  <div className="text-indigo-300 mb-3">{qa.emoji}</div>
                  <h3 className="text-base font-bold text-white mb-1">{qa.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{qa.desc}</p>
                </button>
              ))}
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
