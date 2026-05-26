"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import api from "@/lib/api";

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
  }, []);

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
      // Validate file type
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Only PDF and DOCX files are supported");
        return;
      }

      // Validate file size (max 5MB)
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

      // Refresh list
      fetchResumes();

    } catch (err: any) {
      const backendMessage = err.response?.data?.error || err.response?.data?.details;
      setError(backendMessage || err.message || "Failed to upload resume");
      setUploading(false);
    }
  }

  async function useResumeForInterview(resumeId: string, skills: string[]) {
    // Store resume skills for interview
    localStorage.setItem("interviewSkills", JSON.stringify(skills));
    router.push("/interview");
  }

  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <TopNav />

          <h1 className="text-3xl font-bold text-white mt-6 mb-2">Resume Upload</h1>
          <p className="text-gray-400 mb-8">
            Upload your resume to get personalized interview questions based on your skills
          </p>

          {/* Upload Section */}
          <div className="glass p-8 rounded-2xl mb-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Upload New Resume</h2>
                <p className="text-gray-400 text-sm">Get AI-powered skill extraction</p>
              </div>
            </div>

            <div 
              className="border-2 border-dashed border-white/20 hover:border-indigo-500/50 rounded-2xl p-12 text-center mb-6 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white/5 to-transparent"
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
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
                disabled={uploading}
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer inline-block w-full"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                {file ? (
                  <>
                    <p className="text-green-400 font-semibold mb-2 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {file.name}
                    </p>
                    <p className="text-gray-400 text-sm">Click to change file</p>
                  </>
                ) : (
                  <>
                    <p className="text-white font-semibold mb-2 text-lg">Click to upload or drag & drop</p>
                    <p className="text-gray-400 text-sm">PDF or DOCX • Maximum 5MB</p>
                  </>
                )}
              </label>
            </div>

            {error && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6 animate-fade-in">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {file && !parsed && (
              <button
                onClick={uploadResume}
                disabled={uploading}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-50 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload & Parse Resume
                  </>
                )}
              </button>
            )}

            {/* Tips */}
            <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs flex items-start gap-2">
                <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <strong className="text-white">Tip:</strong> For best results, upload a well-formatted resume with clear sections for skills, experience, and education.
                </span>
              </p>
            </div>
          </div>

          {/* Parsed Results */}
          {parsed && (
            <div className="glass p-8 rounded-2xl mb-6 border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5 animate-fade-in">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Resume Parsed Successfully!</h2>
                    <p className="text-gray-400">Review the extracted information below</p>
                  </div>
                </div>
                <button
                  onClick={() => setParsed(null)}
                  className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {parsed.name && (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Name
                    </div>
                    <div className="text-white font-semibold">{parsed.name}</div>
                  </div>
                )}
                {parsed.email && (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </div>
                    <div className="text-white font-semibold">{parsed.email}</div>
                  </div>
                )}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Experience
                  </div>
                  <div className="text-white font-semibold">
                    {parsed.experienceYears} {parsed.experienceYears === 1 ? 'year' : 'years'}
                  </div>
                </div>
                {parsed.education && (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      Education
                    </div>
                    <div className="text-white font-semibold">{parsed.education}</div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="text-gray-400 text-sm mb-3 font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Extracted Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {parsed.skills.length > 0 ? (
                    parsed.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/30 hover:scale-105 transition-transform"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No skills found</span>
                  )}
                </div>
              </div>

              {parsed.projects && parsed.projects.length > 0 && (
                <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-gray-400 text-sm mb-3 font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Projects
                  </div>
                  <ul className="space-y-2">
                    {parsed.projects.map((proj, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-indigo-400 mt-1">•</span>
                        <span>{proj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {parsed.certifications && parsed.certifications.length > 0 && (
                <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-gray-400 text-sm mb-3 font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Certifications
                  </div>
                  <ul className="space-y-2">
                    {parsed.certifications.map((cert, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => useResumeForInterview(parsed.id, parsed.skills)}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Interview with These Skills
              </button>
            </div>
          )}

          {/* Previous Resumes */}
          {resumes.length > 0 && (
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-5">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl font-bold text-white">Previously Uploaded Resumes</h2>
              </div>
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="bg-gradient-to-r from-white/5 to-white/[0.02] p-5 rounded-xl border border-white/10 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold mb-1">
                            {resume.name || resume.originalFileName}
                          </div>
                          <div className="flex items-center gap-3 text-gray-400 text-sm">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              {resume.skills?.length || 0} skills
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {resume.experienceYears || 0} years exp
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => useResumeForInterview(resume._id, resume.skills || [])}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-300 rounded-lg text-sm font-semibold transition-all duration-200 border border-indigo-500/30 hover:border-indigo-500/50 hover:scale-105 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Use for Interview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
