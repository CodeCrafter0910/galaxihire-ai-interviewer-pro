"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ReportViewer({ reportId }) {
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!reportId) return;
    api.get(`/report/${reportId}`).then(r => setReport(r.data));
  }, [reportId]);

  if (!report) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Interview Report</h1>
      <p>Summary: {report.summary}</p>
      <div className="mt-4">
        <h3>Strengths</h3>
        <ul>{(report.strengths||[]).map((s,i)=><li key={i}>{s}</li>)}</ul>
      </div>
      <div className="mt-4">
        <h3>Improvements</h3>
        <ul>{(report.improvements||[]).map((i,idx)=><li key={idx}>{i}</li>)}</ul>
      </div>

      <div className="mt-6">
        <a href={`/api/report/download/${report._id}`} target="_blank" rel="noreferrer">
          <button className="px-4 py-2 bg-black text-white rounded">Download PDF</button>
        </a>
      </div>
    </div>
  );
}
