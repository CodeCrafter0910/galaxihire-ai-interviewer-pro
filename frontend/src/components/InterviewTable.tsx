// frontend/src/components/InterviewTable.tsx
"use client";
import React, { useEffect, useState } from "react";
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
    <div className="w-40 h-3 bg-white/6 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: `linear-gradient(90deg,#34d399,#6366f1)`,
          boxShadow: "0 6px 20px rgba(99,102,241,0.18)",
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
        // Expecting array back
        const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
        if (!mounted) return;
        // normalize rows (candidate/date/score)
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
    return <div className="mt-6 text-gray-300">Loading interviews…</div>;
  }
  if (error) {
    return <div className="mt-6 text-red-400">Error: {error}</div>;
  }

  if (rows.length === 0) {
    return <div className="mt-6 text-gray-300">No interviews found. Start a new interview to see results here.</div>;
  }

  return (
    <div className="mt-6 bg-transparent">
      <div className="text-lg font-semibold text-gray-100 mb-4">Recent Interviews</div>

      <div className="rounded-xl overflow-hidden border border-white/6 bg-gradient-to-b from-[#071126]/20 to-transparent">
        <div className="grid grid-cols-3 gap-4 p-6 text-sm text-gray-300 bg-transparent">
          <div className="font-medium text-gray-200">Candidate</div>
          <div className="font-medium text-gray-200">Date</div>
          <div className="font-medium text-gray-200">Score</div>
        </div>

        <div className="divide-y divide-white/4">
          {rows.map((r) => (
            <div key={r.id ?? r.candidate} className="grid grid-cols-3 gap-4 p-6 items-center">
              <div className="text-gray-200 font-medium">{r.candidate}</div>
              <div className="text-gray-300">{r.date}</div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-200 w-10">{r.score}%</div>
                <Progress value={r.score} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
