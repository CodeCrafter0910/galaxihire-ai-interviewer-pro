"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const r = useRouter();
  const [email, setE] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState("");

  async function submit() {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      r.push("/dashboard");
    } catch {
      setErr("Invalid credentials");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="w-80 bg-gray-100 p-6 rounded-xl">
        <h1 className="text-xl mb-4">Login</h1>
        <input onChange={(e)=>setE(e.target.value)} placeholder="Email" className="w-full p-2 mb-3 border rounded" />
        <input type="password" onChange={(e)=>setP(e.target.value)} placeholder="Password" className="w-full p-2 mb-3 border rounded" />
        <button onClick={submit} className="w-full bg-black text-white py-2 rounded">Login</button>
        {err && <p className="text-red-500 text-sm mt-2">{err}</p>}
      </div>
    </div>
  );
}
