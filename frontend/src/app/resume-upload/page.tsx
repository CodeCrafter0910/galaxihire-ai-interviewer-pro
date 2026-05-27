"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import api from "@/lib/api";
import { FileText, UploadCloud, CheckCircle, AlertCircle, X, ChevronRight, Briefcase, Award, Code2 } from "lucide-react";

interface ParsedResume {
  id: string;
  name?: string;
  email?: string;
  skills: string[];
  experienceYears: number;
  education?: string;
  projects: string[];
  certifications: string[];
}

export default function ResumeUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [error, setError] = useState("");
  const [resumes, setResumes] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchResumes();
  }, [router]);

  async function fetchResumes() {
    try {
      const res = await api.get("/resume/list");
      setResumes(res.data.resumes || []);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Only PDF and DOCX files are supported");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setError("");
      setParsed(null);
    }
  }

  async function uploadResume() {
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setParsed(res.data.resume);
      setUploading(false);
      setFile(null);

      fetchResumes();
    } catch (err: any) {
      const backendMessage = err.response?.data?.error || err.response?.data?.details;
      setError(backendMessage || err.message || "Failed to upload resume");
      setUploading(false);
    }
  }

  async function useResumeForInterview(resumeId: string, skills: string[]) {
    localStorage.setItem("interviewSkills", JSON.stringify(skills));
    router.push("/interview");
  }

  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/[0.05] rounded-full blur-[120px]" />
      </div>

      <Sidebar />
      <main className="flex-1 p-8 relative z-10 ml-0 md:ml-64">
        <div className="max-w-4xl mx-auto">
          <TopNav />

          <div className="mt-12 mb-10" style={{ animation: "fadeInUp 0.5s ease-out" }}>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200 mb-3">
              Resume Analysis
            </h1>
            <p className="text-gray-400 text-lg">
              Upload your resume for AI skill extraction to personalize your interview questions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6" style={{ animation: "fadeInUp 0.6s ease-out both" }}>
              {/* Upload Card */}
              <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                    <UploadCloud size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Upload New Resume</h2>
                    <p className="text-sm text-gray-400">PDF or DOCX format, up to 5MB</p>
                  </div>
                </div>

                {!file ? (
                  <div 
                    className="relative group cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const droppedFile = e.dataTransfer.files[0];
                      if (droppedFile) {
                        const event = { target: { files: [droppedFile] } } as any;
                        handleFileChange(event);
                      }
                    }}
                  >
                    {/* Animated Dashed Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-white/20 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all duration-500" />
                    
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={uploading}
                    />
                    
                    <div className="relative z-0 p-12 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
                        <FileText size={32} className="text-gray-400 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <p className="text-lg font-bold text-white mb-2">Drag & Drop your resume here</p>
                      <p className="text-sm text-gray-500">or click to browse files</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 relative">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <FileText size={28} className="text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold truncate">{file.name}</p>
                        <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button 
                        onClick={() => setFile(null)}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        disabled={uploading}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {uploading && (
                      <div className="mt-6">
                        <div className="flex justify-between text-xs font-semibold mb-2">
                          <span className="text-indigo-300">Analyzing with AI...</span>
                          <span className="text-indigo-300 animate-pulse">Processing</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-full animate-[shimmer_2s_infinite] origin-left" 
                               style={{ animation: 'progress 2s ease-in-out infinite' }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div className="mt-4 flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl animate-fade-in">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {file && !uploading && !parsed && (
                  <button
                    onClick={uploadResume}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_30px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.7)] hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <UploadCloud size={20} />
                    Upload & Extract Skills
                  </button>
                )}
              </div>

              {/* Parsed Results */}
              {parsed && (
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl animate-fade-in">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Successfully Analyzed</h2>
                        <p className="text-sm text-gray-400">Review your extracted profile</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                        <Briefcase size={14} /> Experience
                      </div>
                      <div className="text-lg font-bold text-white">
                        {parsed.experienceYears} {parsed.experienceYears === 1 ? 'Year' : 'Years'}
                      </div>
                    </div>
                    {parsed.education && (
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                          <Award size={14} /> Education
                        </div>
                        <div className="text-sm font-bold text-white truncate" title={parsed.education}>
                          {parsed.education}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold mb-3 uppercase tracking-wider">
                      <Code2 size={14} /> Top Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {parsed.skills.length > 0 ? (
                        parsed.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-lg text-sm font-semibold border border-emerald-500/20 shadow-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No specific skills detected</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => useResumeForInterview(parsed.id, parsed.skills)}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl font-bold transition-all duration-300 shadow-[0_0_30px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.7)] hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    Use Profile for Interview
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6" style={{ animation: "fadeInUp 0.7s ease-out both" }}>
              {/* Tips Section */}
              <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-blue-400">💡</span> Pro Tips
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <p>Use a standard, single-column format for best parsing accuracy.</p>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <p>Clearly separate sections (Experience, Skills, Education).</p>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <p>Highlight technical tools and languages you are confident discussing.</p>
                  </li>
                </ul>
              </div>

              {/* Previous Resumes */}
              {resumes.length > 0 && (
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Saved Resumes</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {resumes.map((r) => (
                      <div key={r._id} className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all duration-300">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                            <FileText size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{r.name || r.originalFileName}</p>
                            <p className="text-xs text-gray-400 mt-1">{r.skills?.length || 0} Skills • {r.experienceYears || 0} YOE</p>
                          </div>
                        </div>
                        <button
                          onClick={() => useResumeForInterview(r._id, r.skills || [])}
                          className="w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold transition-colors border border-indigo-500/20 group-hover:border-indigo-500/40"
                        >
                          Use this Resume
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
