"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

export default function SettingsPage() {
    const router = useRouter();

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        location: ""
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        interviewReminders: true,
        reportAlerts: false
    });

    const [saving, setSaving] = useState(false);

    function handleProfileChange(field: string, value: string) {
        setProfile(prev => ({ ...prev, [field]: value }));
    }

    function handlePreferenceToggle(field: string) {
        setPreferences(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
    }

    async function saveSettings() {
        setSaving(true);
        // Simulate save
        setTimeout(() => {
            setSaving(false);
            alert("Settings saved successfully!");
        }, 1000);
    }

    return (
        <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <TopNav />

                    <div className="mt-6">
                        <h1 className="text-3xl font-bold text-white">Settings</h1>
                        <p className="text-gray-300 mt-1">
                            Manage your account preferences and settings
                        </p>
                    </div>

                    {/* Profile Settings */}
                    <div className="glass p-6 rounded-xl mt-6">
                        <h2 className="text-xl font-bold text-white mb-4">Profile Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => handleProfileChange('name', e.target.value)}
                                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-100 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => handleProfileChange('email', e.target.value)}
                                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-100 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-100 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={profile.location}
                                    onChange={(e) => handleProfileChange('location', e.target.value)}
                                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-100 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="San Francisco, CA"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="glass p-6 rounded-xl mt-6">
                        <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <p className="text-white font-medium">Email Notifications</p>
                                    <p className="text-sm text-gray-400">Receive updates via email</p>
                                </div>
                                <button
                                    onClick={() => handlePreferenceToggle('emailNotifications')}
                                    className={`relative w-14 h-7 rounded-full transition-colors ${preferences.emailNotifications ? 'bg-indigo-500' : 'bg-gray-600'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${preferences.emailNotifications ? 'left-8' : 'left-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <p className="text-white font-medium">Interview Reminders</p>
                                    <p className="text-sm text-gray-400">Get reminded before interviews</p>
                                </div>
                                <button
                                    onClick={() => handlePreferenceToggle('interviewReminders')}
                                    className={`relative w-14 h-7 rounded-full transition-colors ${preferences.interviewReminders ? 'bg-indigo-500' : 'bg-gray-600'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${preferences.interviewReminders ? 'left-8' : 'left-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <p className="text-white font-medium">Report Alerts</p>
                                    <p className="text-sm text-gray-400">Get notified when reports are ready</p>
                                </div>
                                <button
                                    onClick={() => handlePreferenceToggle('reportAlerts')}
                                    className={`relative w-14 h-7 rounded-full transition-colors ${preferences.reportAlerts ? 'bg-indigo-500' : 'bg-gray-600'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${preferences.reportAlerts ? 'left-8' : 'left-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="glass p-6 rounded-xl mt-6">
                        <h2 className="text-xl font-bold text-white mb-4">Account</h2>

                        <div className="space-y-3">
                            <button className="w-full p-4 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-lg transition text-left">
                                <p className="font-medium">Change Password</p>
                                <p className="text-sm text-yellow-400/70">Update your account password</p>
                            </button>

                            <button className="w-full p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg transition text-left">
                                <p className="font-medium">Download My Data</p>
                                <p className="text-sm text-blue-400/70">Export all your interview data</p>
                            </button>

                            <button className="w-full p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg transition text-left">
                                <p className="font-medium">Delete Account</p>
                                <p className="text-sm text-red-400/70">Permanently delete your account</p>
                            </button>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveSettings}
                            disabled={saving}
                            className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
