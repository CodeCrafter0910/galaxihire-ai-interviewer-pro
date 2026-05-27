"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight, Calendar, User } from "lucide-react";
import api from "@/lib/api";

type Row = {
  _id?: string;
  id?: string;
  candidate: string;
  date: string;
  score: number; // 0-100
};

function Progress({ value }: { value: number }) {
  return (
    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: `linear-gradient(90deg, #34d399, #6366f1)`,
          boxShadow: "0 0 10px rgba(99,102,241,0.5)",
        }}
      />
    </div>
  );
}

export default function InterviewTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/interview/list");
        const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
        if (!mounted) return;
        const mapped = data.map((r: any) => ({
          id: r._id ?? r.id,
          candidate: r.candidate ?? r.name ?? r.email ?? "Unknown",
          date: r.date ? new Date(r.date).toLocaleDateString() : r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Unknown",
          score: typeof r.score === "number" ? r.score : r.result?.score ?? 0,
        }));
        setRows(mapped);
      } catch (e: any) {
        setError(e?.response?.data?.message || e.message || "Failed to load interviews");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mt-6 bg-white/[0.02] border border-white/10 p-6 rounded-3xl backdrop-blur-xl animate-pulse">
        <h3 className="text-xl font-bold text-white mb-6">Recent Interviews</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
              <div className="w-32 h-4 bg-white/10 rounded" />
              <div className="w-24 h-4 bg-white/5 rounded" />
              <div className="w-40 h-4 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 bg-red-500/10 border border-red-500/20 p-6 rounded-3xl text-red-400">
        <h3 className="font-bold mb-2">Error Loading Data</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="mt-6 bg-white/[0.02] border border-white/10 p-8 rounded-3xl text-center">
        <p className="text-gray-400">No interviews found. Start a new interview to see results here.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-xl font-bold text-white">Recent Interviews</h3>
        <p className="text-sm text-gray-400 mt-1">Overview of recent candidate evaluations</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-white/10">
              <th className="p-4 pl-6">Candidate</th>
              <th className="p-4">Date</th>
              <th className="p-4">Score</th>
              <th className="p-4 pr-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r, index) => (
              <tr 
                key={r.id ?? r.candidate}
                className={`group transition-colors duration-300 ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'
                } hover:bg-white/10`}
              >
                <td className="p-4 pl-6 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300">
                      <User size={14} />
                    </div>
                    <span className="text-gray-200 font-bold">{r.candidate}</span>
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
                    <Calendar size={14} />
                    {r.date}
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-white w-10 text-right">{r.score}%</span>
                    <Progress value={r.score} />
                  </div>
                </td>
                
                <td className="p-4 pr-6 text-right">
                  <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all ml-auto">
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
