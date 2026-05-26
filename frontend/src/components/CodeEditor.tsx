"use client";

import { useState, useEffect } from "react";
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
    const [editorTheme, setEditorTheme] = useState("vs-dark");

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
const result = solution();
console.log(result);`,
        java: `public class Solution {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello World");
    }
}`
    };

    const languageIcons: Record<string, string> = {
        python: "🐍",
        javascript: "⚡",
        java: "☕"
    };

    useEffect(() => {
        setCode(languageTemplates[language] || "");
    }, []);

    function handleLanguageChange(lang: string) {
        setLanguage(lang);
        setCode(languageTemplates[lang] || "");
        setOutput("");
    }

    async function runCode() {
        if (!code.trim() || running) return;

        try {
            setRunning(true);
            setOutput("⚙️ Executing code...");

            const token = localStorage.getItem("token");
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005";

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
                setOutput(`❌ Error:\n${data.error}`);
            } else {
                setOutput(`✅ Success:\n${data.output || data.stdout || "Execution completed successfully"}`);
            }

            setRunning(false);
        } catch (error) {
            console.error("Error running code:", error);
            setOutput("❌ Failed to execute code. Please try again.");
            setRunning(false);
        }
    }

    function submitCode() {
        onSubmit(code, language);
    }

    function clearCode() {
        setCode(languageTemplates[language] || "");
        setOutput("");
    }

    return (
        <div className="space-y-4">
            {/* Problem Description */}
            {problem && (
                <div className="glass p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">Coding Challenge</h3>
                            <p className="text-gray-400 text-sm">Solve the problem below and submit your solution</p>
                        </div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                        <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{problem}</p>
                    </div>
                </div>
            )}

            {/* Editor Container */}
            <div className="glass p-6 rounded-2xl border border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-lg">{languageIcons[language]}</span>
                            <select
                                value={language}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="bg-transparent text-white font-medium text-sm outline-none cursor-pointer"
                                disabled={disabled}
                            >
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="java">Java</option>
                            </select>
                        </div>
                        <div className="text-gray-500 text-xs">
                            {code.split('\n').length} lines
                        </div>
                    </div>

                    <button
                        onClick={clearCode}
                        disabled={disabled}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear
                    </button>
                </div>

                {/* Monaco Editor */}
                <div className="border border-white/20 rounded-xl overflow-hidden shadow-2xl">
                    <Editor
                        height="450px"
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
                            tabSize: language === "python" ? 4 : 2,
                            fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                            fontLigatures: true,
                            cursorBlinking: "smooth",
                            smoothScrolling: true,
                            padding: { top: 16, bottom: 16 }
                        }}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={runCode}
                        disabled={running || disabled || !code.trim()}
                        className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 text-emerald-300 rounded-xl font-bold disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 border border-emerald-500/30 hover:border-emerald-500/50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {running ? (
                            <>
                                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                                Running...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Run Code
                            </>
                        )}
                    </button>
                    <button
                        onClick={submitCode}
                        disabled={disabled || !code.trim()}
                        className="flex-1 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Submit Solution
                    </button>
                </div>
            </div>

            {/* Output Console */}
            {output && (
                <div className="glass p-6 rounded-2xl border border-white/10 animate-fade-in">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-white font-semibold">Console Output</span>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/10">
                        <pre className="text-gray-200 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                            {output}
                        </pre>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-gray-400 text-xs flex items-start gap-2">
                    <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>
                        <strong className="text-white">Pro Tip:</strong> Test your code with the "Run Code" button before submitting. Make sure to handle edge cases and optimize for time complexity.
                    </span>
                </p>
            </div>
        </div>
    );
}
