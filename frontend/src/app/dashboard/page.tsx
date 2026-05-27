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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(79,70,229,0.15), rgba(79,70,229,0.05))",
    borderColor: "rgba(79,70,229,0.3)",
    iconColor: "text-indigo-400",
    glowColor: "rgba(79,70,229,0.25)",
    format: (v: number) => v.toString(),
  },
  {
    key: "completedInterviews" as const,
    label: "Completed",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
    borderColor: "rgba(16,185,129,0.3)",
    iconColor: "text-emerald-400",
    glowColor: "rgba(16,185,129,0.25)",
    format: (v: number) => v.toString(),
  },
  {
    key: "averageScore" as const,
    label: "Average Score",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
    borderColor: "rgba(245,158,11,0.3)",
    iconColor: "text-amber-400",
    glowColor: "rgba(245,158,11,0.25)",
    format: (v: number) => `${v.toFixed(1)}/10`,
  },
  {
    key: null,
    label: "Completion Rate",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))",
    borderColor: "rgba(168,85,247,0.3)",
    iconColor: "text-purple-400",
    glowColor: "rgba(168,85,247,0.25)",
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
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Start Interview",
    desc: "Begin a new AI-powered interview session",
    accentFrom: "#4f46e5",
    accentTo: "#7c3aed",
  },
  {
    href: "/report",
    emoji: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "View Reports",
    desc: "Check your performance reports and progress",
    accentFrom: "#10b981",
    accentTo: "#0ea5e9",
  },
  {
    href: "/resume-upload",
    emoji: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    title: "Upload Resume",
    desc: "Get personalized questions based on your skills",
    accentFrom: "#f59e0b",
    accentTo: "#f97316",
  },
];

const tips = [
  {
    icon: "💡",
    text: "Prepare for behavioral questions using the STAR method for best results.",
  },
  {
    icon: "🎯",
    text: "Practice at least 3 interviews to see a meaningful score trend.",
  },
  {
    icon: "📄",
    text: "Upload your resume to get role-specific interview questions.",
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

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex bg-[#060b18] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 lg:p-8 xl:p-10 overflow-auto min-h-screen relative">
        {/* Background ambient orbs - simplified */}
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[250px] h-[250px] bg-purple-500/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <TopNav />

          {/* Welcome Section */}
          <section
            className="mt-2 relative overflow-hidden rounded-3xl p-8 lg:p-10 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(30,27,75,0.6) 0%, rgba(17,24,39,0.8) 100%)",
              border: "1px solid rgba(79,70,229,0.2)",
            }}
          >
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-sm text-indigo-300 font-bold uppercase tracking-widest mb-3">{today}</p>
                <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-2">
                  Welcome back,{" "}
                  <span
                    className="inline-block text-indigo-300"
                  >
                    {userName}
                  </span>{" "}
                  <span className="inline-block">👋</span>
                </h2>
                <p className="text-slate-400 text-base md:text-lg max-w-xl">
                  Ready to ace your next interview? Let&apos;s build your confidence and make today count.
                </p>
              </div>
              <button
                onClick={() => router.push("/interview/new")}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Start Interview</span>
              </button>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statConfig.map((cfg, index) => {
              const rawVal = cfg.key ? stats[cfg.key] : 0;
              const display = loading ? "—" : cfg.format(rawVal as number, stats);
              return (
                <div
                  key={cfg.label}
                  className="group relative rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-default overflow-hidden"
                  style={{
                    background: cfg.gradient,
                    border: `1px solid ${cfg.borderColor}`,
                  }}
                >
                  <div className={`${cfg.iconColor} mb-4 p-3 rounded-2xl inline-block bg-white/5 border border-white/5`}>
                    {cfg.icon}
                  </div>
                  <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">{cfg.label}</div>
                  <div className="text-white text-3xl font-black tracking-tight">{display}</div>
                </div>
              );
            })}
          </section>

          {/* Quick Actions & Tips Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            {/* Quick Actions */}
            <section className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Quick Actions</h2>
                <div className="h-px flex-1 ml-6 bg-gradient-to-r from-slate-700/50 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {quickActions.map((qa, index) => (
                  <button
                    key={qa.href}
                    onClick={() => router.push(qa.href)}
                    className="group relative rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    style={{
                      background: "rgba(30,41,59,0.4)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="relative z-10">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${qa.accentFrom}20, ${qa.accentTo}10)`,
                          border: `1px solid ${qa.accentFrom}30`,
                          color: qa.accentFrom,
                        }}
                      >
                        {qa.emoji}
                      </div>
                      <h3 className="text-lg font-bold text-slate-200 mb-2 group-hover:text-white transition-colors">
                        {qa.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4 min-h-[40px]">
                        {qa.desc}
                      </p>

                      {/* Arrow */}
                      <div className="flex items-center gap-2 mt-auto text-indigo-400 group-hover:text-indigo-300 transition-all duration-300">
                        <span className="text-sm font-bold uppercase tracking-wider">Get started</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Tips Section */}
            <section className="lg:col-span-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Pro Tips</h2>
                <div className="h-px flex-1 ml-6 bg-gradient-to-r from-slate-700/50 to-transparent" />
              </div>
              <div
                className="rounded-3xl p-6 space-y-4"
                style={{
                  background: "rgba(30,41,59,0.4)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {tips.map((tip, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-800/80 border border-transparent hover:border-slate-700/50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">
                      {tip.icon}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed pt-1">
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Interview History */}
          <section className="mt-12 pb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Recent Activity</h2>
              <div className="h-px flex-1 ml-6 bg-gradient-to-r from-slate-700/50 to-transparent" />
            </div>
            <div className="rounded-3xl bg-slate-900/50 border border-slate-800/80 overflow-hidden shadow-2xl">
              <InterviewHistory />
            </div>
          </section>
        </div>
      </main>

    </div>
  );
}
