"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);

  async function upload() {
    const f = new FormData();
    if (!file) {
  alert("Please select a file first");
  return;
}

f.append("file", file);

    const res = await api.post("/resume/parse", f, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    setData(res.data.parsed);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Upload Resume</h1>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
 className="mb-4" />
      <button onClick={upload} className="px-4 py-2 bg-black text-white rounded">Upload</button>

      {data && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-lg mb-2">Parsed Resume</h2>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
