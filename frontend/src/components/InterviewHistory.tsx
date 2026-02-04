"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

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
        const styles: Record<string, string> = {
            completed: "bg-green-500/20 text-green-300 border-green-500/30",
            "in-progress": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
            abandoned: "bg-red-500/20 text-red-300 border-red-500/30"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm border ${styles[status] || styles.abandoned}`}>
                {status.replace("-", " ").toUpperCase()}
            </span>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="glass p-8 rounded-xl text-center">
                <p className="text-gray-400 mb-4">No interviews yet</p>
                <button
                    onClick={() => router.push("/interview")}
                    className="btn-primary px-6 py-3"
                >
                    Start Your First Interview
                </button>
            </div>
        );
    }

    return (
        <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Interview History</h3>
            <div className="space-y-3">
                {sessions.map((session) => (
                    <div
                        key={session._id}
                        className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition cursor-pointer"
                        onClick={() => router.push(`/report?sessionId=${session._id}`)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                {getStatusBadge(session.status)}
                                <span className="text-gray-400 text-sm">
                                    {formatDate(session.startedAt)}
                                </span>
                            </div>
                            <div className="text-gray-400 text-sm">
                                Duration: {formatDuration(session.duration)}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3">
                            <div className="text-sm text-gray-300">
                                <span className="text-gray-500">Skills:</span>{" "}
                                {session.skills.join(", ")}
                            </div>
                        </div>

                        {session.status === "completed" && (
                            <div className="grid grid-cols-4 gap-2 mt-3">
                                <div className="bg-black/30 p-2 rounded text-center">
                                    <div className="text-xs text-gray-400">Overall</div>
                                    <div className="text-white font-bold">
                                        {session.scores.overall.toFixed(1)}
                                    </div>
                                </div>
                                <div className="bg-black/30 p-2 rounded text-center">
                                    <div className="text-xs text-gray-400">Communication</div>
                                    <div className="text-white font-bold">
                                        {session.scores.communication.toFixed(1)}
                                    </div>
                                </div>
                                <div className="bg-black/30 p-2 rounded text-center">
                                    <div className="text-xs text-gray-400">Technical</div>
                                    <div className="text-white font-bold">
                                        {session.scores.technical.toFixed(1)}
                                    </div>
                                </div>
                                <div className="bg-black/30 p-2 rounded text-center">
                                    <div className="text-xs text-gray-400">Confidence</div>
                                    <div className="text-white font-bold">
                                        {session.scores.confidence.toFixed(1)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
