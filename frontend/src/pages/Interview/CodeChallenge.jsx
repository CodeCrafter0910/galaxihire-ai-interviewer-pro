"use client";

import Editor from "@/components/CodeEditor/Editor";
import axios from "axios";
import { useState } from "react";

export default function CodeChallenge() {
  const [output, setOutput] = useState("");

  async function run(code) {
    const res = await axios.post("http://localhost:4000/api/code/run", {
      code,
      language: "javascript"
    });

    setOutput(res.data.stdout || res.data.stderr);
  }

  return (
    <div>
      <h2>AI Coding Challenge</h2>
      <Editor onRun={run} />

      <pre>{output}</pre>
    </div>
  );
}
