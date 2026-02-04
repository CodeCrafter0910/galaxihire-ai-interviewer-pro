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
      setError(err.response?.data?.error || "Failed to upload resume");
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
          <div className="glass p-8 rounded-xl mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Upload New Resume</h2>

            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center mb-4">
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
                className="cursor-pointer inline-block "
              >
                <div className="text-6xl mb-4">📄</div>
                <p className="text-gray-300 mb-2">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-gray-500 text-sm">
                  PDF or DOCX (max 5MB)
                </p>
              </label>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {file && !parsed && (
              <button
                onClick={uploadResume}
                disabled={uploading}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {uploading ? "Analyzing Resume..." : "Upload & Parse Resume"}
              </button>
            )}
          </div>

          {/* Parsed Results */}
          {parsed && (
            <div className="glass p-8 rounded-xl mb-6 border-2 border-green-500/30">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">✅ Resume Parsed Successfully!</h2>
                  <p className="text-gray-400">Review the extracted information below</p>
                </div>
                <button
                  onClick={() => setParsed(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                {parsed.name && (
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Name</div>
                    <div className="text-white font-medium">{parsed.name}</div>
                  </div>
                )}
                {parsed.email && (
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Email</div>
                    <div className="text-white font-medium">{parsed.email}</div>
                  </div>
                )}
                <div>
                  <div className="text-gray-400 text-sm mb-1">Experience</div>
                  <div className="text-white font-medium">
                    {parsed.experienceYears} {parsed.experienceYears === 1 ? 'year' : 'years'}
                  </div>
                </div>
                {parsed.education && (
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Education</div>
                    <div className="text-white font-medium">{parsed.education}</div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="text-gray-400 text-sm mb-2">Extracted Skills</div>
                <div className="flex flex-wrap gap-2">
                  {parsed.skills.length > 0 ? (
                    parsed.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm"
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
                <div className="mb-6">
                  <div className="text-gray-400 text-sm mb-2">Projects</div>
                  <ul className="space-y-1">
                    {parsed.projects.map((proj, i) => (
                      <li key={i} className="text-gray-300 text-sm">• {proj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {parsed.certifications && parsed.certifications.length > 0 && (
                <div className="mb-6">
                  <div className="text-gray-400 text-sm mb-2">Certifications</div>
                  <ul className="space-y-1">
                    {parsed.certifications.map((cert, i) => (
                      <li key={i} className="text-gray-300 text-sm">• {cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => useResumeForInterview(parsed.id, parsed.skills)}
                className="w-full btn-primary py-3 font-bold"
              >
                🎯 Start Interview with These Skills
              </button>
            </div>
          )}

          {/* Previous Resumes */}
          {resumes.length > 0 && (
            <div className="glass p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Previously Uploaded Resumes</h2>
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-white font-medium mb-1">
                          {resume.name || resume.originalFileName}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {resume.skills?.length || 0} skills • {resume.experienceYears || 0} years exp
                        </div>
                      </div>
                      <button
                        onClick={() => useResumeForInterview(resume._id, resume.skills || [])}
                        className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg text-sm"
                      >
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
