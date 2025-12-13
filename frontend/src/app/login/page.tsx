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
    } catch (e) {
      setErr("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md glass p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome back</h1>
        <p className="text-sm text-gray-300 mb-6">Sign in to continue to GalaxiHire</p>

        <label className="block mb-3">
          <input
            value={email}
            onChange={(e) => setE(e.target.value)}
            placeholder="Email"
            className="input"
          />
        </label>

        <label className="block mb-4">
          <input
            value={password}
            type="password"
            onChange={(e) => setP(e.target.value)}
            placeholder="Password"
            className="input"
          />
        </label>

        <button onClick={submit} className="btn-primary mb-3">Login</button>

        {err && <p className="text-red-400 text-sm">{err}</p>}

        <div className="mt-4 text-sm text-gray-300">
          Don&apos;t have an account? <a href="/register" className="app-link">Register</a>
        </div>
      </div>
    </div>
  );
}
