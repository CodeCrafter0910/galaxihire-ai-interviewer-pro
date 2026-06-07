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
    iconGradient: "from-indigo-500 to-purple-600",
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
    iconGradient: "from-cyan-500 to-blue-600",
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
    iconGradient: "from-emerald-500 to-green-600",
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
    iconGradient: "from-rose-500 to-pink-600",
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
    iconGradient: "from-amber-500 to-yellow-600",
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
    iconGradient: "from-violet-500 to-purple-600",
  },
];

const stats = [
  { value: "4", label: "Interview Stages" },
  { value: "AI", label: "Powered Scoring" },
  { value: "PDF", label: "Reports Export" },
  { value: "100%", label: "Private & Secure" },
];

const steps = [
  {
    num: "01",
    title: "Create Your Profile",
    description: "Sign up in seconds, upload your resume, and select your target role and experience level.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Choose Interview Type",
    description: "Pick from Aptitude, Coding (DSA), Technical, or HR rounds — or run the full loop.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Practice with AI",
    description: "Answer questions via text, voice, or video while our AI evaluates your responses in real time.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Get Your Report",
    description: "Download a detailed PDF with scores, strengths, areas to improve, and a personalized roadmap.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer at Google",
    quote: "GalaxiHire's AI mock interviews were eerily close to my actual Google L4 loop. The PDF report pinpointed exactly where I needed to improve. Landed the offer!",
    avatar: "PS",
  },
  {
    name: "Marcus Chen",
    role: "Full-Stack Developer",
    quote: "I used to freeze during system design rounds. After 10 sessions with GalaxiHire, I walked into my Amazon interview with unshakeable confidence. Game-changer.",
    avatar: "MC",
  },
  {
    name: "Aisha Patel",
    role: "Data Scientist at Meta",
    quote: "The resume-tailored questions blew my mind — it asked about MY projects, MY tech stack. No generic questions. This is the future of interview prep.",
    avatar: "AP",
  },
];

// Removed particles for performance

export default function Home() {
  return (
    <main className="min-h-screen bg-[#03050f] text-slate-200 font-sans relative overflow-x-hidden selection:bg-indigo-500/30">
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-green {
          0%, 100% { 
            background-color: rgba(16, 24, 39, 0.8);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
          50% { 
            background-color: rgb(16, 185, 129);
            box-shadow: 0 0 8px 2px rgba(16, 185, 129, 0.4);
          }
        }
        @keyframes border-beam {
          100% {
            offset-distance: 100%;
          }
        }

        
        .animate-gradient-text { 
          background-size: 200% auto;
          animation: gradient-x 6s linear infinite; 
        }
        
        .fade-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        
        .glass-nav {
          background: rgba(3, 5, 15, 0.8);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .pulse-indicator {
          animation: pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .border-beam-container {
          position: absolute;
          inset: -1.2px;
          border-radius: 9999px;
          padding: 1.2px;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .border-beam-element {
          position: absolute;
          aspect-ratio: 1;
          width: 140px;
          background: linear-gradient(
            to left,
            #ff0055,
            #ff7f00,
            #ffff00,
            #00ff66,
            #00ffff,
            #0055ff,
            #cc00ff,
            transparent
          );
          offset-anchor: 100% 50%;
          offset-path: rect(0 auto auto 0 round 9999px);
          animation: border-beam 4s linear infinite;
        }

        @media (max-width: 768px) {
          .fade-up {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .border-beam-element {
            animation: none !important;
          }
          .pulse-indicator {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Global Background Elements ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-600/5 blur-[60px]"></div>
        <div className="absolute top-[30%] right-[-10%] w-[280px] h-[280px] rounded-full bg-purple-600/5 blur-[60px]"></div>
      </div>

      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="absolute inset-0 bg-indigo-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <img 
              src="/logo/galaxihire-logo.png" 
              alt="GalaxiHire Logo" 
              className="h-[55px] w-auto object-contain relative group-hover:scale-105 transition-all duration-300"
              loading="eager"
              fetchPriority="high"
              style={{ maxWidth: '280px' }}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {["Features", "How it Works", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="relative px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold text-sm transition-all duration-300"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative z-10 pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 flex flex-col items-center justify-center text-center min-h-[90vh]">
        <div className="max-w-5xl mx-auto">
          {/* Badge with rainbow glow animation */}
          <div className="fade-up inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full relative mb-8 border border-emerald-500/30 bg-gradient-to-r from-slate-900/90 to-emerald-950/50 backdrop-blur-md">
            {/* Rainbow Border Beam */}
            <span className="border-beam-container">
              <span className="border-beam-element"></span>
            </span>
            <div className="relative z-10 flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full pulse-indicator"></span>
              </span>
              <span className="text-emerald-300 text-xs font-semibold uppercase tracking-widest">
                Premium AI Interview Platform
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="fade-up delay-100 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-white">
            Ace Every <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-text px-2">
              Interview
            </span>
            <br className="hidden sm:block" />
            <span className="text-4xl sm:text-5xl md:text-6xl text-gray-300">with AI Coaching</span>
          </h1>

          {/* Subheading */}
          <p className="fade-up delay-200 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Practice multi-stage interviews with <span className="text-gray-200 font-medium">real-time AI scoring</span>, personalized feedback, and beautifully crafted <span className="text-gray-200 font-medium">performance reports</span>.
          </p>

          {/* CTA Buttons */}
          <div className="fade-up delay-300 flex flex-wrap items-center justify-center gap-5 mb-20">
            <Link
              href="/register"
              className="relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
            >
              <span>Start Practicing Free</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-2xl font-bold transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Stats Row */}
          <div className="fade-up delay-400 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-indigo-500/30 backdrop-blur-md transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-2 group-hover:scale-105 transition-transform duration-500">
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-widest">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="relative z-10 px-6 py-24 lg:py-32 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20 fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-6 uppercase tracking-widest">
            <span>✨</span> Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter">
            Everything You Need to <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-text">
              Land the Job
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            A complete AI interview coach that simulates real-world hiring pipelines with unmatched precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative bg-[#050814] rounded-[1.25rem] p-8 border border-white/5 hover:border-indigo-500/20 transition-all duration-300 fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${f.iconGradient} flex items-center justify-center mb-6 text-white shadow-lg shadow-indigo-500/10 transition-transform duration-300 group-hover:scale-105`}>
                {f.icon}
              </div>
              <h3 className="relative text-xl font-bold text-white mb-3 tracking-tight group-hover:text-indigo-300 transition-colors duration-300">{f.title}</h3>
              <p className="relative text-gray-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section id="how-it-works" className="relative z-10 px-6 py-24 lg:py-32 w-full overflow-hidden">
        {/* Section ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold mb-6 uppercase tracking-widest">
              <span>🚀</span> Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Works</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Go from sign-up to interview-ready in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="group relative p-8 rounded-[1.25rem] bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-500 text-center fade-up hover:-translate-y-2"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-[1.25rem]"></div>
                <div className="relative z-10">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-500/30 to-indigo-500/10 mb-6 select-none group-hover:scale-110 transition-transform duration-500">
                    {step.num}
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-6 text-purple-300 group-hover:bg-purple-500/20 transition-colors duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 lg:-right-5 w-8 lg:w-10 h-[1px] bg-gradient-to-r from-purple-500/30 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section id="testimonials" className="relative z-10 px-6 py-24 lg:py-32 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20 fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold mb-6 uppercase tracking-widest">
            <span>💬</span> Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Thousands</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            See what candidates are saying after using GalaxiHire to prepare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="group relative bg-[#050814] rounded-3xl p-8 border border-white/5 hover:border-pink-500/20 transition-all duration-300 fade-up flex flex-col justify-between"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="absolute top-6 right-6 text-7xl font-serif text-white/5 select-none leading-none">&ldquo;</div>
              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-8 italic">"{t.quote}"</p>
              </div>
              <div className="relative z-10 flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 px-6 py-24 lg:py-32 max-w-5xl mx-auto w-full fade-up delay-200">
        <div className="relative p-12 md:p-20 rounded-[2.5rem] text-center overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter">
              Ready to level up?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Create your free account and take your first AI interview in under 2 minutes. No credit card required.
            </p>
            <Link
              href="/register"
              className="inline-flex px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
            >
              Create Free Account
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 bg-[#02040a]/80 backdrop-blur-2xl pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-16 mb-16">
            {/* Brand Column */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/logo/galaxihire-logo.png" 
                  alt="GalaxiHire Logo" 
                  className="h-[55px] w-auto object-contain"
                  loading="lazy"
                  style={{ maxWidth: '280px' }}
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
                The ultimate AI-powered interview platform. Practice, improve, and confidently land your dream job.
              </p>
              <div className="flex items-center gap-4">
                {[
                  <svg key="tw" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                  <svg key="gh" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
                  <svg key="li" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                ].map((icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Product</h4>
              <ul className="space-y-4">
                {["Features", "AI Scoring", "Interview Rounds", "PDF Reports", "Pricing"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-300 font-medium">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Company</h4>
              <ul className="space-y-4">
                {["About Us", "Blog", "Careers", "Contact", "Press Kit"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-300 font-medium">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-4">
                {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Security"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-300 font-medium">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-gray-500 text-sm font-medium">© 2026 GalaxiHire. All rights reserved.</span>
            <div className="flex items-center gap-8 text-sm text-gray-500 font-medium">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
