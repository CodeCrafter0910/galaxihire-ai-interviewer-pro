"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const router = useRouter();

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

  // Load user info from JWT on mount
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
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <TopNav />

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-1 text-sm">Manage your account and preferences</p>
          </div>

          {/* Profile */}
          <div className="glass p-6 rounded-2xl mt-6">
            <h2 className="text-lg font-bold text-white mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { field: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
                { field: "email", label: "Email", type: "email", placeholder: "john@example.com" },
                { field: "phone", label: "Phone", type: "tel", placeholder: "+1 234 567 8900" },
                { field: "location", label: "Location", type: "text", placeholder: "San Francisco, CA" },
              ].map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm text-gray-300 font-medium mb-2">{label}</label>
                  <input
                    type={type}
                    value={profile[field as keyof typeof profile]}
                    onChange={(e) => handleProfileChange(field, e.target.value)}
                    className="input"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="glass p-6 rounded-2xl mt-4">
            <h2 className="text-lg font-bold text-white mb-4">Notifications</h2>
            <div className="space-y-3">
              {[
                { field: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
                { field: "interviewReminders", label: "Interview Reminders", desc: "Get reminded before interviews" },
                { field: "reportAlerts", label: "Report Alerts", desc: "Get notified when reports are ready" },
              ].map(({ field, label, desc }) => (
                <div key={field} className="flex items-center justify-between p-4 bg-white/4 rounded-xl border border-white/5">
                  <div>
                    <p className="text-white font-medium text-sm">{label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceToggle(field)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      preferences[field as keyof typeof preferences] ? "bg-indigo-500" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        preferences[field as keyof typeof preferences] ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Account Actions */}
          <div className="glass p-6 rounded-2xl mt-4">
            <h2 className="text-lg font-bold text-white mb-4">Account</h2>
            <div className="space-y-2">
              <button
                onClick={() => toast("Change password feature coming soon.", { icon: "🔒" })}
                className="w-full p-4 bg-yellow-500/8 hover:bg-yellow-500/15 border border-yellow-500/20 text-yellow-300 rounded-xl transition text-left"
              >
                <p className="font-medium text-sm">Change Password</p>
                <p className="text-xs text-yellow-400/60 mt-0.5">Update your account password</p>
              </button>
              <button
                onClick={() => toast("Data export coming soon.", { icon: "📦" })}
                className="w-full p-4 bg-blue-500/8 hover:bg-blue-500/15 border border-blue-500/20 text-blue-300 rounded-xl transition text-left"
              >
                <p className="font-medium text-sm">Download My Data</p>
                <p className="text-xs text-blue-400/60 mt-0.5">Export all your interview data</p>
              </button>
              <button
                onClick={() => toast.error("Account deletion is permanently disabled in demo mode.")}
                className="w-full p-4 bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 text-red-300 rounded-xl transition text-left"
              >
                <p className="font-medium text-sm">Delete Account</p>
                <p className="text-xs text-red-400/60 mt-0.5">Permanently delete your account</p>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex justify-end gap-3">
            <button onClick={() => router.back()} className="btn-ghost px-6 py-2.5 text-sm">
              Cancel
            </button>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="btn-primary px-6 py-2.5 text-sm"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
