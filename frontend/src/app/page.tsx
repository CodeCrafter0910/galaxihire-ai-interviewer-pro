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
    <main className="min-h-screen flex flex-col">
      {/* ── Nav bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/5" style={{ background: "rgba(6,11,24,0.85)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-black text-base">G</span>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">GalaxiHire</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm px-5 py-2">Sign In</Link>
          <Link href="/register" className="btn-primary text-sm px-5 py-2">Get Started Free</Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          AI Interview Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
          Ace Every{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Interview
          </span>
          <br />with AI Coaching
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Practice multi-stage interviews — Aptitude, Coding, Technical, and HR — with real AI scoring, personalized feedback, and downloadable PDF performance reports.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/register" className="btn-primary px-8 py-3.5 text-base font-bold">
            Start Practicing Free →
          </Link>
          <Link href="/login" className="btn-ghost px-8 py-3.5 text-base">
            Sign In
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl w-full">
          {stats.map((s) => (
            <div key={s.label} className="glass p-4 rounded-xl text-center">
              <div className="text-2xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Everything You Need to Land the Job
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A complete AI interview coach that simulates real-world hiring pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`glass p-6 rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center mb-4 text-indigo-300">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 pb-24 max-w-4xl mx-auto w-full">
        <div className="glass p-10 rounded-2xl text-center border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to level up?</h2>
          <p className="text-gray-400 mb-6">Create your free account and take your first AI interview in under 2 minutes.</p>
          <Link href="/register" className="btn-primary px-10 py-3.5 text-base font-bold">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-8 py-6 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-black text-xs">G</span>
          </div>
          <span>GalaxiHire</span>
        </div>
        <span>© 2026 GalaxiHire. All rights reserved.</span>
      </footer>
    </main>
  );
}
