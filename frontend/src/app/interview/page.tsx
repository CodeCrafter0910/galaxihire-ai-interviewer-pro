"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import api from "@/lib/api";

interface ChatMessage {
  from: string;
  text: string;
}

export default function InterviewPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("hr");
  const [skills] = useState(["python", "react"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
  }, [router]);

  async function send() {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const res = await api.post("/interview/ask", {
      answer: input,
      stage,
      skills,
    });

    setLoading(false);
    setStage(res.data.nextStage);

    const aiMsg = { from: "ai", text: res.data.question };
    setMessages((prev) => [...prev, aiMsg]);
    setInput("");
  }

  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#071026] via-[#06071b] to-[#02040a]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <TopNav />

          <h1 className="text-3xl font-bold mt-6 text-white">AI Interview</h1>
          <p className="text-gray-300 mb-6">Answer the questions to continue the interview</p>

          {/* Chat Box */}
          <div className="glass p-6 rounded-xl h-[62vh] overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-4 p-3 rounded-xl max-w-[75%] ${
                  m.from === "user"
                    ? "ml-auto bg-indigo-600/40 text-white"
                    : "bg-white/10 text-gray-200"
                }`}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="p-3 bg-white/10 rounded-xl w-fit text-gray-200">
                AI thinking…
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="mt-4 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-gray-100"
              placeholder="Type your answer…"
            />
            <button
              onClick={send}
              className="btn-primary px-6 py-3"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
