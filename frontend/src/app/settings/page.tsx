"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import toast from "react-hot-toast";
import { User, Shield, Sliders, Mail, Phone, MapPin, Lock, Download, AlertTriangle, Check, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences">("profile");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    interviewReminders: true,
    reportAlerts: false,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setProfile((prev) => ({
        ...prev,
        name: payload.name || "",
        email: payload.email || "",
      }));
    } catch { /* ignore */ }
  }, [router]);

  function handleProfileChange(field: string, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function handlePreferenceToggle(field: string) {
    setPreferences((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  }

  async function saveSettings() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Settings saved successfully!");
  }

  return (
    <div className="min-h-screen flex bg-[#02040a] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 relative z-10 ml-0 md:ml-64 h-screen overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          <TopNav />

          <div className="mt-10 mb-8" style={{ animation: "fadeInUp 0.5s ease-out" }}>
            <h1 className="text-4xl font-black text-white mb-2">Account Settings</h1>
            <p className="text-gray-400 text-lg">Manage your personal information, security, and app preferences.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8" style={{ animation: "fadeInUp 0.6s ease-out both" }}>
            
            {/* Sidebar Tabs */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="flex flex-row lg:flex-col gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-2xl overflow-x-auto">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === "profile" 
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <User size={18} /> Profile
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === "security" 
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Shield size={18} /> Security
                </button>
                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === "preferences" 
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Sliders size={18} /> Preferences
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl min-h-[500px]">
                
                {/* PROFILE TAB */}
                {activeTab === "profile" && (
                  <div className="animate-fade-in space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Profile Information</h2>
                      <p className="text-sm text-gray-400">Update your personal details here.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group relative">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block group-focus-within:text-indigo-400 transition-colors">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => handleProfileChange("name", e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="group relative">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block group-focus-within:text-indigo-400 transition-colors">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => handleProfileChange("email", e.target.value)}
                            placeholder="john@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="group relative">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block group-focus-within:text-indigo-400 transition-colors">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => handleProfileChange("phone", e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="group relative">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block group-focus-within:text-indigo-400 transition-colors">
                          Location
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                          <input
                            type="text"
                            value={profile.location}
                            onChange={(e) => handleProfileChange("location", e.target.value)}
                            placeholder="San Francisco, CA"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === "security" && (
                  <div className="animate-fade-in space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Security & Data</h2>
                      <p className="text-sm text-gray-400">Manage your password and data exports.</p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => toast("Change password feature coming soon.", { icon: "🔒" })}
                        className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                            <Lock size={20} />
                          </div>
                          <div className="text-left">
                            <h3 className="text-white font-bold">Change Password</h3>
                            <p className="text-sm text-gray-400">Update your account password</p>
                          </div>
                        </div>
                        <div className="text-gray-500 group-hover:translate-x-1 transition-transform">→</div>
                      </button>

                      <button
                        onClick={() => toast("Data export coming soon.", { icon: "📦" })}
                        className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                            <Download size={20} />
                          </div>
                          <div className="text-left">
                            <h3 className="text-white font-bold">Download My Data</h3>
                            <p className="text-sm text-gray-400">Export all your interview history and reports</p>
                          </div>
                        </div>
                        <div className="text-gray-500 group-hover:translate-x-1 transition-transform">→</div>
                      </button>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/10">
                      <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} /> Danger Zone
                      </h3>
                      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-red-500/5 border border-red-500/20 rounded-2xl gap-4">
                        <div>
                          <h4 className="text-white font-bold mb-1">Delete Account</h4>
                          <p className="text-sm text-gray-400">Permanently delete your account and all data. This cannot be undone.</p>
                        </div>
                        <button
                          onClick={() => toast.error("Account deletion is permanently disabled in demo mode.")}
                          className="flex-shrink-0 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl border border-red-500/30 transition-all hover:scale-105"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PREFERENCES TAB */}
                {activeTab === "preferences" && (
                  <div className="animate-fade-in space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Preferences</h2>
                      <p className="text-sm text-gray-400">Customize your notification settings.</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { field: "emailNotifications", label: "Email Notifications", desc: "Receive general updates and news via email" },
                        { field: "interviewReminders", label: "Interview Reminders", desc: "Get notified 1 hour before scheduled interviews" },
                        { field: "reportAlerts", label: "Report Alerts", desc: "Get instantly notified when your AI report is ready" },
                      ].map(({ field, label, desc }) => {
                        const isOn = preferences[field as keyof typeof preferences];
                        return (
                          <div key={field} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl">
                            <div>
                              <h3 className="text-white font-bold mb-1">{label}</h3>
                              <p className="text-sm text-gray-400">{desc}</p>
                            </div>
                            <button
                              onClick={() => handlePreferenceToggle(field)}
                              className={`relative flex-shrink-0 w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${
                                isOn ? "bg-indigo-500" : "bg-gray-700"
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
                                  isOn ? "translate-x-7" : "translate-x-1"
                                }`}
                              >
                                {isOn && <Check size={14} className="text-indigo-500" />}
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="mt-10 pt-6 border-t border-white/10 flex justify-end gap-4">
                  <button onClick={() => router.back()} className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                    Cancel
                  </button>
                  <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
