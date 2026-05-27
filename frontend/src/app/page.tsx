import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI-Powered Scoring",
    description: "Receive instant, intelligent feedback on your communication, technical depth, and confidence after every answer.",
    color: "from-indigo-500/20 to-purple-500/10",
    border: "border-indigo-500/20",
    glow: "group-hover:shadow-indigo-500/50",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "Multi-Stage Rounds",
    description: "Progress through Aptitude, Coding (DSA), Technical, and HR rounds — just like a real interview loop.",
    color: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/20",
    glow: "group-hover:shadow-cyan-500/50",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Detailed PDF Reports",
    description: "Download a full performance report with strengths, improvement areas, and a personalized learning roadmap.",
    color: "from-emerald-500/20 to-green-500/10",
    border: "border-emerald-500/20",
    glow: "group-hover:shadow-emerald-500/50",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Resume-Tailored Questions",
    description: "Upload your resume and let the AI craft technical questions based on your exact skills and experience.",
    color: "from-rose-500/20 to-pink-500/10",
    border: "border-rose-500/20",
    glow: "group-hover:shadow-rose-500/50",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    title: "Voice & Video Answers",
    description: "Answer questions via text, audio, or video — just like real interviews. Auto-transcription included.",
    color: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-500/20",
    glow: "group-hover:shadow-amber-500/50",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Private & Secure",
    description: "Your data stays yours. JWT-based auth, local processing options, and no third-party data selling.",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    glow: "group-hover:shadow-violet-500/50",
  },
];

const stats = [
  { value: "4", label: "Interview Stages" },
  { value: "AI", label: "Powered Scoring" },
  { value: "PDF", label: "Reports Export" },
  { value: "100%", label: "Private & Secure" },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative">
      {/* Optimized Static Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#0a0f1e] via-[#0d1425] to-[#060b18]"></div>
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      </div>

      {/* ── Nav bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#060b18]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <span className="text-white font-black text-lg">G</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 blur-md opacity-50 -z-10"></div>
            </div>
            <span className="font-bold text-white text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">GalaxiHire</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-5 py-2.5 text-gray-300 hover:text-white transition-colors font-medium">Sign In</Link>
            <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-8 uppercase tracking-widest backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AI-Powered Interview Platform
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
            <span className="block mb-2">Ace Every</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Interview
            </span>
            <span className="block mt-2 text-5xl md:text-6xl">with AI Coaching</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed">
            Practice multi-stage interviews with <span className="text-white font-semibold">real AI scoring</span>, personalized feedback, and downloadable <span className="text-white font-semibold">PDF performance reports</span>.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link href="/register" className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center gap-2">
              Start Practicing Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/login" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl font-bold text-lg transition-all duration-200 backdrop-blur-sm">
              Sign In
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full">
            {stats.map((s) => (
              <div key={s.label} className="glass p-5 rounded-2xl text-center border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
                <div className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">{s.value}</div>
                <div className="text-xs text-gray-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 pb-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold mb-4">
            ✨ Features
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Everything You Need to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Land the Job</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A complete AI interview coach that simulates real-world hiring pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`glass p-8 rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} hover:border-opacity-50 transition-all duration-300 cursor-pointer`}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-5 text-indigo-300">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="glass p-12 md:p-16 rounded-3xl text-center border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Ready to level up?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">Create your free account and take your first AI interview in under 2 minutes.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50">
            Create Free Account
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-8 py-8 backdrop-blur-xl bg-[#060b18]/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-black text-sm">G</span>
              </div>
              <span className="text-gray-400 font-medium">GalaxiHire</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>© 2026 GalaxiHire. All rights reserved.</span>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
