"use client";

import { useState } from "react";

export default function Editor({ onRun }) {
  const [code, setCode] = useState("");

  return (
    <div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
        rows={12}
        style={{ width: "100%" }}
      />

      <button onClick={() => onRun(code)}>Run Code</button>
    </div>
  );
}
