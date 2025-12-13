"use client";
import React, { useState } from "react";
import api from "@/lib/api";

export default function LiveInterview() {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  async function ask() {
    const res = await api.post("/interview/ask", { question: "hi" });
    setQ(res.data.answer || "No response");
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Live Interview</h1>

      <button onClick={ask} className="btn-primary px-4 py-2 mb-4">
        Ask Question
      </button>

      <div className="bg-black/20 p-4 rounded-lg">
        <div className="text-gray-300">Question:</div>
        <div className="text-lg">{q}</div>
      </div>
    </div>
  );
}
