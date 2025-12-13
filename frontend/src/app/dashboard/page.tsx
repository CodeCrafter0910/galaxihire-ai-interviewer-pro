// frontend/src/app/dashboard/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import dynamic from "next/dynamic";

const InterviewTable = dynamic(() => import("@/components/InterviewTable"), { ssr: false });

export default function DashboardPageClient() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /login if token missing
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <TopNav />

          <section className="mt-6">
            <div className="glass p-6 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Welcome</h3>
                <p className="text-gray-300 mt-1">Get Started by analyzing your recent interviews</p>
              </div>
              <div>
                <button className="btn-primary px-6 py-3">New Interviews</button>
              </div>
            </div>
          </section>

          <section>
            <InterviewTable />
          </section>
        </div>
      </main>
    </div>
  );
}
