"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { Rocket, Building2, Briefcase, Code, Database, Layout, Shield, Brain } from "lucide-react";

const roles = [
  { id: "frontend", name: "Frontend Engineer", icon: Layout, desc: "React, Next.js, UI/UX" },
  { id: "backend", name: "Backend Engineer", icon: Database, desc: "Node.js, APIs, System Design" },
  { id: "fullstack", name: "Full Stack Developer", icon: Code, desc: "End-to-end development" },
  { id: "security", name: "Security Engineer", icon: Shield, desc: "AppSec, Pen testing" },
  { id: "data", name: "Data Scientist", icon: Brain, desc: "ML, Analytics, Python" },
  { id: "product", name: "Product Manager", icon: Briefcase, desc: "Strategy, Agile, Roadmaps" }
];

const difficulties = ["Beginner", "Intermediate", "Advanced"];

export default function InterviewSetupPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role || !company) return;
    setLoading(true);
    
    // Simulating API call before redirect
    setTimeout(() => {
      // Store preferences
      localStorage.setItem("interviewPref", JSON.stringify({ role, company, difficulty }));
      router.push("/interview/new");
    }, 1000);
  }

  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/[0.07] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-purple-500/[0.06] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <Sidebar />
      <main className="flex-1 p-8 relative z-10 ml-0 md:ml-64">
        <div className="max-w-4xl mx-auto">
          <TopNav />

          <div className="mt-12 animate-fade-in" style={{ animation: "fadeInUp 0.6s ease-out" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6 uppercase tracking-widest backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Step 1 of 1
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200 mb-4">
              Configure Interview
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Customize your AI interview experience by selecting your target role, dream company, and preferred difficulty level.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-10" style={{ animation: "fadeInUp 0.8s ease-out both" }}>
            
            {/* Target Role Section */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm border border-indigo-500/30">1</span>
                Select Target Role
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`relative group p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${
                        isSelected 
                          ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]"
                          : "bg-white/[0.02] border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.04]"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse" />
                      )}
                      <div className="relative z-10 flex items-start gap-4">
                        <div className={`p-3 rounded-xl transition-colors duration-300 ${isSelected ? "bg-indigo-500 text-white" : "bg-white/5 text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10"}`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className={`font-bold transition-colors ${isSelected ? "text-white" : "text-gray-200 group-hover:text-white"}`}>
                            {r.name}
                          </h3>
                          <p className={`text-xs mt-1 transition-colors ${isSelected ? "text-indigo-200" : "text-gray-500"}`}>
                            {r.desc}
                          </p>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-indigo-400 animate-bounce">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Company & Difficulty Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Company Input */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm border border-indigo-500/30">2</span>
                  Target Company
                </h2>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-400 transition-colors">
                    <Building2 size={20} />
                  </div>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Stripe, Netflix"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                    required
                  />
                  {/* Autocomplete visual flair (purely visual for design reqs) */}
                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                </div>
              </div>

              {/* Difficulty Selector */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm border border-indigo-500/30">3</span>
                  Difficulty Level
                </h2>
                <div className="relative p-2 bg-white/[0.03] rounded-2xl border border-white/10 flex items-center">
                  {/* Animated Slider Background */}
                  <div 
                    className="absolute inset-y-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg transition-all duration-500 ease-out"
                    style={{ 
                      width: `calc(33.333% - 8px)`,
                      left: `${difficulties.indexOf(difficulty) * 33.333}%`,
                      marginLeft: difficulties.indexOf(difficulty) === 0 ? '8px' : '4px'
                    }}
                  />
                  
                  {difficulties.map((diff) => {
                    const isSelected = difficulty === diff;
                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setDifficulty(diff)}
                        className={`flex-1 relative z-10 py-3 text-sm font-bold transition-colors duration-300 ${
                          isSelected ? "text-white" : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        {diff}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={!role || !company || loading}
                className="group relative px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none overflow-hidden flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Initializing...
                  </>
                ) : (
                  <>
                    Start Interview Process
                    <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
