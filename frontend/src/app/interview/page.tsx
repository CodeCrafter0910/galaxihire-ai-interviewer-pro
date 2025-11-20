"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function InterviewPage() {
  const [messages, setM] = useState([]);
  const [input, setI] = useState("");
  const [stage, setS] = useState("hr");
  const [skills, setSkills] = useState(["python", "react"]);
  const [loading, setL] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setM((p) => [...p, userMsg]);
    setL(true);

    const res = await api.post("/interview/ask", {
      answer: input,
      stage,
      skills
    });

    setL(false);
    setS(res.data.nextStage);

    const aiMsg = { from: "ai", text: res.data.question };
    setM((p) => [...p, aiMsg]);
    setI("");
  }

  return (
    <div className="flex flex-col h-screen p-6">
      <h1 className="text-xl mb-4 font-semibold">AI Interview</h1>

      <div className="flex-1 overflow-y-auto bg-white rounded p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 p-2 rounded ${
              m.from === "user"
                ? "bg-blue-200 text-right"
                : "bg-gray-200 text-left"
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="p-2 bg-gray-300 rounded w-fit">AI typing...</div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setI(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type your answer..."
        />
        <button
          onClick={send}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
