// frontend/src/components/TopNav.tsx
"use client";
import React from "react";

export default function TopNav() {
  return (
    <header className="flex items-center justify-between py-4 px-6">
      <div>
        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-indigo-300 to-cyan-300">
          GalaxiHire — AI Interviewer
        </h2>
        <p className="text-sm text-gray-300 mt-1">Enhance your interview process with deep insights</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="btn-primary px-4 py-2">New Interviews</button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg text-black">👤</div>
      </div>
    </header>
  );
}
