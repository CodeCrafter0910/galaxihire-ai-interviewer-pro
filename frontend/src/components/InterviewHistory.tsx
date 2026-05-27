"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Calendar, Clock, ChevronRight, Activity, Search, AlertCircle, FileText } from "lucide-react";

interface InterviewSession {
    _id: string;
    status: string;
    stage: string;
    skills: string[];
    startedAt: string;
    completedAt?: string;
    scores: {
        communication: number;
        technical: number;
        confidence: number;
        overall: number;
    };
    duration?: number;
}

export default function InterviewHistory() {
    const router = useRouter();
    const [sessions, setSessions] = useState<InterviewSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {
        try {
            const res = await api.get("/interview/history?limit=20");
            setSessions(res.data.sessions || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch interview history:", error);
            setLoading(false);
        }
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function formatDuration(seconds?: number) {
        if (!seconds) return "N/A";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }

    function getStatusBadge(status: string) {
        const styles: Record<string, { color: string; dot: string; text: string }> = {
            completed: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400", text: "Completed" },
            "in-progress": { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", dot: "bg-yellow-400", text: "In Progress" },
            abandoned: { color: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-400", text: "Abandoned" }
        };
        const badge = styles[status] || styles.abandoned;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} ${status === 'in-progress' ? 'animate-pulse' : ''}`} />
                {badge.text}
            </span>
        );
    }

    function ScoreBar({ value }: { value: number }) {
        const percentage = (value / 10) * 100;
        return (
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white/[0.02] border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-6">Interview History</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                            <div className="space-y-3 flex-1">
                                <div className="flex gap-3 items-center">
                                    <div className="w-24 h-6 bg-white/10 rounded-full" />
                                    <div className="w-32 h-4 bg-white/5 rounded" />
                                </div>
                                <div className="w-48 h-4 bg-white/5 rounded" />
                            </div>
                            <div className="w-16 h-8 bg-white/5 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="bg-white/[0.02] border border-white/10 p-12 rounded-3xl backdrop-blur-xl text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <FileText size={40} className="text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Interviews Yet</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Your interview history and performance analytics will appear here once you complete an interview.
                </p>
                <button
                    onClick={() => router.push("/interview")}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-105"
                >
                    Start Your First Interview
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-indigo-400" size={24} />
                        Interview History
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">Review your past sessions and scores</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-white/10">
                            <th className="p-4 pl-6">Status & Date</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Skills Focus</th>
                            <th className="p-4 text-center">Overall Score</th>
                            <th className="p-4 pr-6"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sessions.map((session, index) => (
                            <tr
                                key={session._id}
                                onClick={() => router.push(`/report?sessionId=${session._id}`)}
                                className={`group cursor-pointer transition-colors duration-300 ${
                                    index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'
                                } hover:bg-white/10`}
                            >
                                <td className="p-4 pl-6 relative">
                                    {/* Hover glow bar */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="flex flex-col gap-2 items-start">
                                        {getStatusBadge(session.status)}
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                            <Calendar size={12} />
                                            {formatDate(session.startedAt)}
                                        </div>
                                    </div>
                                </td>
                                
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-300">
                                        <Clock size={14} className="text-gray-500" />
                                        {formatDuration(session.duration)}
                                    </div>
                                </td>
                                
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                        {session.skills.slice(0, 2).map(skill => (
                                            <span key={skill} className="px-2 py-0.5 bg-white/5 text-gray-300 text-xs rounded border border-white/10">
                                                {skill}
                                            </span>
                                        ))}
                                        {session.skills.length > 2 && (
                                            <span className="px-2 py-0.5 bg-white/5 text-gray-500 text-xs rounded border border-white/10">
                                                +{session.skills.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                
                                <td className="p-4">
                                    {session.status === "completed" ? (
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="text-sm font-black text-white">
                                                {session.scores.overall.toFixed(1)} <span className="text-gray-500 text-xs font-semibold">/10</span>
                                            </div>
                                            <ScoreBar value={session.scores.overall} />
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 text-sm italic">—</div>
                                    )}
                                </td>
                                
                                <td className="p-4 pr-6 text-right">
                                    <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all ml-auto">
                                        <ChevronRight size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
