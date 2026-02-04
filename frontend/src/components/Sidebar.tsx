// frontend/src/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const items = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { id: "start-interview", label: "Start Interview", href: "/interview/new", icon: "▶️" },
  { id: "my-interviews", label: "My Interviews", href: "/interview", icon: "📋" },
  { id: "reports", label: "Reports", href: "/report", icon: "📊" },
  { id: "settings", label: "Settings", href: "/settings", icon: "⚙️" },
  { id: "logout", label: "Logout", href: "/logout", icon: "⇦" },
];


export default function Sidebar() {
  const path = usePathname() || "/dashboard";

  return (
    <aside className="w-72 min-h-screen p-6 bg-gradient-to-b from-transparent to-transparent border-r border-white/6">
      <div className="mb-8">
        <div className="rounded-full w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">N</div>
        <div className="mt-4 text-sm text-gray-300">GalaxiHire</div>
      </div>

      <nav className="space-y-3">
        {items.map((it) => {
          const active = path.startsWith(it.href);
          return (
            <Fragment key={it.id}>
              <Link
                href={it.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150
                  ${active ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/20 ring-1 ring-indigo-600/40 shadow-[0_8px_30px_rgba(99,102,241,0.06)]" : "hover:bg-white/3"}
                  text-gray-200`}
              >
                <div className={`w-9 h-9 flex items-center justify-center rounded-md ${active ? "bg-indigo-600/30" : "bg-white/2"}`}>{it.icon}</div>
                <span className="text-sm">{it.label}</span>
              </Link>
            </Fragment>
          );
        })}
      </nav>

      <div className="mt-8 text-xs text-gray-400">Version 1.0</div>
    </aside>
  );
}
