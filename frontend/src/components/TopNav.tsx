// frontend/src/components/TopNav.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TopNav() {
  const router = useRouter();
  const [initials, setInitials] = useState("U");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const name: string = payload.name || payload.email || "User";
          setUserName(name);
          setInitials(
            name.includes("@")
              ? name[0].toUpperCase()
              : name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
          );
        } catch {
          // silently ignore invalid token
        }
      }
    }
  }, []);

  return (
    <header className="flex items-center justify-between py-4 px-2">
      {/* Left: page context title */}
      <div>
        <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 leading-tight">
          GalaxiHire
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">AI-Powered Interview Platform</p>
      </div>

      {/* Right: actions + avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/interview/new")}
          className="btn-primary px-4 py-2 text-sm"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Interview
        </button>

        {/* Avatar */}
        <div
          title={userName}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white text-xs font-bold cursor-pointer flex-shrink-0"
          onClick={() => router.push("/settings")}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
