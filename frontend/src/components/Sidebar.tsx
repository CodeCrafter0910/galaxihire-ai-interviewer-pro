"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const mainNav = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "start-interview",
    label: "New Interview",
    href: "/interview/new",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    id: "my-interviews",
    label: "My Interviews",
    href: "/interview",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

const secondaryNav = [
  {
    id: "reports",
    label: "Reports",
    href: "/report",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const path = usePathname() || "/dashboard";
  const [initials, setInitials] = useState("U");
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const name: string = payload.name || payload.email || "User";
          setDisplayName(name);
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
          /* ignore */
        }
      }
    }
  }, []);

  const isActive = (href: string) =>
    path === href ||
    (href !== "/interview" && path.startsWith(href)) ||
    (href === "/interview" && path === "/interview");

  const renderNavItem = (it: (typeof mainNav)[0], index: number) => {
    const active = isActive(it.href);
    return (
      <Link
        key={it.id}
        href={it.href}
        className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-out overflow-hidden"
        style={{
          animationDelay: `${index * 60}ms`,
        }}
      >
        {/* Active background pill */}
        <div
          className={`absolute inset-0 rounded-xl transition-all duration-300 ease-out ${
            active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{
            background: active
              ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))"
              : "rgba(255,255,255,0.03)",
          }}
        />

        {/* Active indicator bar */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-300 ease-out ${
            active ? "h-5 opacity-100" : "h-0 opacity-0"
          }`}
          style={{
            background: "linear-gradient(180deg, #818cf8, #a78bfa)",
            boxShadow: "0 0 10px rgba(129,140,248,0.6)",
          }}
        />

        {/* Icon */}
        <span
          className={`relative z-10 flex-shrink-0 transition-all duration-300 ${
            active
              ? "text-indigo-400"
              : "text-slate-400 group-hover:text-indigo-300"
          }`}
        >
          {it.icon}
        </span>

        {/* Label */}
        <span
          className={`relative z-10 text-sm font-medium transition-all duration-300 ${
            active
              ? "text-white"
              : "text-slate-400 group-hover:text-slate-200"
          }`}
        >
          {it.label}
        </span>
      </Link>
    );
  };

  return (
    <aside
      className="w-64 h-screen flex flex-col fixed top-0 left-0 z-40 bg-[#060b18]/80 backdrop-blur-2xl"
    >
      {/* Subtle gradient border on right edge */}
      <div
        className="absolute top-0 right-0 w-[1px] h-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.3) 50%, rgba(99,102,241,0.1) 100%)",
        }}
      />

      {/* Brand Section */}
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          {/* Animated Logo */}
          <div className="relative flex-shrink-0 group cursor-pointer">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center relative z-10 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed, #9333ea)",
                boxShadow: "0 4px 20px rgba(79,70,229,0.4)",
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <span className="text-white font-black text-lg tracking-tighter relative z-10">G</span>
            </div>
            {/* Glow pulse */}
            <div
              className="absolute inset-0 rounded-xl opacity-60"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                filter: "blur(12px)",
                animation: "pulseGlow 3s ease-in-out infinite",
              }}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-base tracking-tight">
                GalaxiHire
              </span>
              {/* PRO Badge */}
              <span
                className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded text-indigo-300"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                }}
              >
                PRO
              </span>
            </div>
            <span className="text-slate-400 text-[11px] font-medium tracking-wide mt-0.5">
              AI Interviewer
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2">
        {/* Section Label */}
        <div className="px-6 mb-3 mt-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Main Menu
          </span>
        </div>

        {/* Main Nav */}
        <nav className="px-3 space-y-1">
          {mainNav.map((it, i) => renderNavItem(it, i))}
        </nav>

        {/* Section Divider */}
        <div className="px-5 my-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        </div>

        {/* Section Label */}
        <div className="px-6 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Analytics
          </span>
        </div>

        {/* Secondary Nav */}
        <nav className="px-3 space-y-1">
          {secondaryNav.map((it, i) => renderNavItem(it, i + mainNav.length))}
        </nav>
      </div>

      {/* User info + logout */}
      <div className="px-3 pb-6 pt-4 bg-gradient-to-t from-[#060b18] to-transparent">
        {/* User card */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2 bg-slate-800/30 border border-slate-700/50 backdrop-blur-md">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-white shadow-inner"
            style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-200 text-sm font-semibold truncate">
              {displayName}
            </div>
            <div className="text-slate-400 text-[11px]">Pro Account</div>
          </div>
        </div>

        {/* Logout */}
        <Link
          href="/logout"
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent"
        >
          <span className="text-slate-400 group-hover:text-red-400 transition-colors duration-300">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span>
          <span className="text-sm font-medium text-slate-400 group-hover:text-red-400 transition-colors duration-300">
            Logout
          </span>
        </Link>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
}
