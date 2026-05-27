"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
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

  // Derive breadcrumb from pathname
  const getBreadcrumb = () => {
    const segments = (pathname || "/dashboard").split("/").filter(Boolean);
    const labels: Record<string, string> = {
      dashboard: "Dashboard",
      interview: "Interviews",
      new: "New Interview",
      report: "Reports",
      settings: "Settings",
    };
    return segments.map((seg) => labels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1));
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between py-5 px-2 mb-6 bg-[#060b18]/80 backdrop-blur-xl border-b border-indigo-500/10">
      {/* Left: Breadcrumb + page context */}
      <div className="flex flex-col">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-1.5">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              <span
                className={`text-[12px] font-semibold tracking-wide ${
                  i === breadcrumbs.length - 1
                    ? "text-indigo-300"
                    : "text-slate-500"
                }`}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
        <h2
          className="text-2xl font-black tracking-tight"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {breadcrumbs[breadcrumbs.length - 1] || "Dashboard"}
        </h2>
      </div>

      {/* Right: search + actions + avatar */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/50 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-slate-800/60 shadow-inner">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search interviews..."
            className="bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none w-48 lg:w-64 font-medium"
          />
          <kbd className="hidden lg:inline-flex items-center justify-center text-[10px] text-slate-400 font-bold px-2 py-1 rounded bg-slate-700/50 border border-slate-600">
            ⌘K
          </kbd>
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-2.5 rounded-full transition-all duration-300 hover:bg-slate-800/60 border border-transparent hover:border-slate-700 group"
          title="Notifications"
        >
          <svg
            className="w-5 h-5 text-slate-400 group-hover:text-indigo-300 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Animated dot indicator */}
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
        </button>

        {/* User Avatar Dropdown */}
        <button
          title={userName}
          className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full transition-all duration-300 hover:bg-slate-800/50 border border-transparent hover:border-slate-700 group"
          onClick={() => router.push("/settings")}
        >
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors duration-300">
              {userName}
            </span>
            <span className="text-[11px] font-medium text-slate-500">Pro Plan</span>
          </div>
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-md"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                boxShadow: "0 0 15px rgba(79,70,229,0.3)",
              }}
            >
              {initials}
            </div>
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#060b18] shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </div>
          {/* Dropdown chevron */}
          <svg className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors duration-300 ml-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
