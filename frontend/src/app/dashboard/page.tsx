"use client";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4">
        <Link href="/resume-upload" className="p-4 bg-white rounded shadow">
          Upload Resume
        </Link>
        <Link href="/interview" className="p-4 bg-white rounded shadow">
          Start Interview
        </Link>
        <Link href="/report" className="p-4 bg-white rounded shadow">
          Reports
        </Link>
      </div>
    </div>
  );
}
