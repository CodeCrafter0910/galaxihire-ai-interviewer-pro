"use client";
import { useState } from "react";
import ReportViewer from "@/components/ReportViewer";

export default function Page() {
  const [reportId, setReportId] = useState("");

  async function generate() {
    const interview = {
      _id: null,
      candidateName: "Demo Candidate",
      sessionName: "Demo Session",
      transcript: "Candidate answered sample questions...",
      scores: { communication: 6, technical: 5, confidence: 6, coding: 5 }
    };
    const res = await fetch("http://localhost:4000/api/report/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interview })
    });
    const data = await res.json();
    setReportId(data.reportId);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Reports</h1>
      <button onClick={generate} className="px-4 py-2 bg-black text-white rounded mb-4">Generate Demo Report</button>
      {reportId && <ReportViewer reportId={reportId} />}
    </div>
  );
}
