"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
      setLoading(false);
    }
  }

  return (
    <>
      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes auth-gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes auth-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes auth-float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.03); }
        }
        @keyframes auth-pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes auth-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes auth-slide-right {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes auth-card-float-1 {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(0deg); }
        }
        @keyframes auth-card-float-2 {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-16px) rotate(0deg); }
        }
        @keyframes auth-card-float-3 {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes auth-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .auth-stagger-1 { animation: auth-fade-up 0.7s ease-out 0.1s both; }
        .auth-stagger-2 { animation: auth-fade-up 0.7s ease-out 0.2s both; }
        .auth-stagger-3 { animation: auth-fade-up 0.7s ease-out 0.3s both; }
        .auth-stagger-4 { animation: auth-fade-up 0.7s ease-out 0.4s both; }
        .auth-stagger-5 { animation: auth-fade-up 0.7s ease-out 0.5s both; }
        .auth-stagger-6 { animation: auth-fade-up 0.7s ease-out 0.6s both; }
      `}</style>

      <div className="min-h-screen flex bg-[#0a0e1a]">
        {/* ===== LEFT DECORATIVE PANEL ===== */}
        <div
          className="hidden lg:flex lg:w-[52%] relative overflow-hidden items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #0f1629 0%, #1a1040 30%, #0d1935 60%, #121830 100%)",
          }}
        >
          {/* Animated gradient mesh */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.25) 0%, transparent 55%), radial-gradient(ellipse at 60% 80%, rgba(79,70,229,0.2) 0%, transparent 50%)",
              animation: "auth-gradient 8s ease-in-out infinite",
              backgroundSize: "200% 200%",
            }}
          />

          {/* Dot grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Floating orbs */}
          <div
            className="absolute top-[15%] left-[12%] w-72 h-72 rounded-full blur-[100px]"
            style={{
              background: "rgba(99,102,241,0.25)",
              animation: "auth-float 7s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-[20%] right-[8%] w-60 h-60 rounded-full blur-[90px]"
            style={{
              background: "rgba(139,92,246,0.2)",
              animation: "auth-float-delayed 9s ease-in-out infinite 1s",
            }}
          />
          <div
            className="absolute top-[55%] left-[55%] w-40 h-40 rounded-full blur-[70px]"
            style={{
              background: "rgba(167,139,250,0.15)",
              animation: "auth-pulse-glow 6s ease-in-out infinite 2s",
            }}
          />

          {/* Main content */}
          <div className="relative z-10 px-12 xl:px-16 w-full max-w-xl">
            {/* Logo + Brand */}
            <div style={{ animation: "auth-slide-right 0.8s ease-out both" }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <span className="text-white font-black text-lg">G</span>
                </div>
                <span className="text-white font-bold text-2xl tracking-tight">GalaxiHire</span>
              </div>

              <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
                Start Your
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
                  Interview Journey
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-sm">
                Join thousands of candidates who ace their interviews with AI-powered practice and personalized feedback.
              </p>
            </div>

            {/* Floating glass feature cards */}
            <div className="space-y-4">
              <div
                className="flex items-center gap-4 backdrop-blur-xl bg-white/[0.06] border border-white/[0.08] rounded-2xl px-5 py-4 shadow-xl"
                style={{ animation: "auth-card-float-1 6s ease-in-out infinite, auth-fade-up 0.7s ease-out 0.3s both" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Free to Get Started</p>
                  <p className="text-gray-400 text-xs mt-0.5">No credit card required</p>
                </div>
              </div>

              <div
                className="flex items-center gap-4 backdrop-blur-xl bg-white/[0.06] border border-white/[0.08] rounded-2xl px-5 py-4 shadow-xl ml-6"
                style={{ animation: "auth-card-float-2 7s ease-in-out infinite 0.5s, auth-fade-up 0.7s ease-out 0.5s both" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">AI-Powered Scoring</p>
                  <p className="text-gray-400 text-xs mt-0.5">Instant, intelligent feedback on every answer</p>
                </div>
              </div>

              <div
                className="flex items-center gap-4 backdrop-blur-xl bg-white/[0.06] border border-white/[0.08] rounded-2xl px-5 py-4 shadow-xl ml-3"
                style={{ animation: "auth-card-float-3 8s ease-in-out infinite 1s, auth-fade-up 0.7s ease-out 0.7s both" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Track Your Progress</p>
                  <p className="text-gray-400 text-xs mt-0.5">Detailed analytics and improvement trends</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        </div>

        {/* ===== RIGHT FORM PANEL ===== */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10 relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            className="absolute top-1/4 right-0 w-80 h-80 rounded-full blur-[120px] opacity-20"
            style={{ background: "rgba(99,102,241,0.3)" }}
          />

          <div className="w-full max-w-md relative z-10">
            {/* Mobile-only brand header */}
            <div className="lg:hidden text-center mb-8 auth-stagger-1">
              <div className="inline-flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <span className="text-white font-black text-sm">G</span>
                </div>
                <span className="text-white font-bold text-xl tracking-tight">GalaxiHire</span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8 auth-stagger-1">
              <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
              <p className="text-gray-400 text-sm">Join GalaxiHire — it&apos;s free to get started</p>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6 auth-stagger-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-300 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-300 group"
              >
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6 auth-stagger-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.08]" />
              <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">or continue with email</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.08]" />
            </div>

            {/* Form card */}
            <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6 sm:p-8 shadow-2xl auth-stagger-4">
              {/* Error message */}
              {error && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 text-red-300 p-3.5 rounded-xl mb-5 text-sm" style={{ animation: "auth-fade-up 0.3s ease-out both" }}>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name field */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Full name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <svg className="w-4.5 h-4.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-300 hover:border-white/[0.15]"
                      placeholder="John Doe"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <svg className="w-4.5 h-4.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-300 hover:border-white/[0.15]"
                      placeholder="john@example.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <svg className="w-4.5 h-4.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl py-3 pl-11 pr-11 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-300 hover:border-white/[0.15]"
                      placeholder="At least 6 characters"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password field */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Confirm password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <svg className="w-4.5 h-4.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl py-3 pl-11 pr-11 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-300 hover:border-white/[0.15]"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-3.5 rounded-xl font-semibold text-white text-sm overflow-hidden transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group mt-1"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)",
                  }}
                >
                  {/* Shimmer effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                      animation: "auth-shimmer 2s infinite",
                    }}
                  />
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(99,102,241,0.4)]" />

                  <span className="relative z-10">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2.5">
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Create Account
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    )}
                  </span>
                </button>
              </form>
            </div>

            {/* Footer link */}
            <p className="text-gray-500 text-sm text-center mt-6 auth-stagger-5">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
