"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
    onSubmit: (code: string, language: string) => void;
    disabled?: boolean;
    problem?: string;
}

export default function CodeEditor({ onSubmit, disabled = false, problem }: CodeEditorProps) {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("python");
    const [output, setOutput] = useState<string>("");
    const [running, setRunning] = useState(false);

    const languageTemplates: Record<string, string> = {
        python: `def solution():
    # Write your code here
    pass

# Test your solution
result = solution()
print(result)`,
        javascript: `function solution() {
    // Write your code here
}

// Test your solution
const result = solution();`,
        java: `public class Solution {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello World");
    }
}`
    };

    function handleLanguageChange(lang: string) {
        setLanguage(lang);
        setCode(languageTemplates[lang] || "");
        setOutput("");
    }

    async function runCode() {
        if (!code.trim() || running) return;

        try {
            setRunning(true);
            setOutput("Executing code...");

            const token = localStorage.getItem("token");
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

            const response = await fetch(`${backendUrl}/api/code/run`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ code, language })
            });

            const data = await response.json();

            if (data.error) {
                setOutput(`Error: ${data.error}`);
            } else {
                setOutput(data.output || data.stdout || "Execution completed successfully");
            }

            setRunning(false);
        } catch (error) {
            console.error("Error running code:", error);
            setOutput("Failed to execute code. Please try again.");
            setRunning(false);
        }
    }

    function submitCode() {
        onSubmit(code, language);
    }

    return (
        <div className="glass p-6 rounded-xl">
            {/* Problem Description */}
            {problem && (
                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-2">Coding Challenge</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{problem}</p>
                </div>
            )}

            {/* Language Selector */}
            <div className="flex items-center gap-3 mb-4">
                <label className="text-gray-300">Language:</label>
                <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    disabled={disabled}
                >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                </select>
            </div>

            {/* Code Editor */}
            <div className="border border-white/20 rounded-lg overflow-hidden mb-4">
                <Editor
                    height="400px"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: language === "python" ? 4 : 2
                    }}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
                <button
                    onClick={runCode}
                    disabled={running || disabled}
                    className="flex-1 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg font-bold disabled:opacity-50"
                >
                    {running ? "Running..." : "▶ Run Code"}
                </button>
                <button
                    onClick={submitCode}
                    disabled={disabled || !code.trim()}
                    className="flex-1 btn-primary py-3 disabled:opacity-50"
                >
                    ✓ Submit Solution
                </button>
            </div>

            {/* Output Console */}
            {output && (
                <div className="bg-black/50 p-4 rounded-lg border border-white/10">
                    <div className="text-gray-400 text-sm mb-2">Output:</div>
                    <pre className="text-gray-200 font-mono text-sm whitespace-pre-wrap">
                        {output}
                    </pre>
                </div>
            )}
        </div>
    );
}
