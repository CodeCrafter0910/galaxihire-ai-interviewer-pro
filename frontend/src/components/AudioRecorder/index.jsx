"use client";

import { useState } from "react";
import { useMicrophone } from "@/hooks/useMicrophone";
import axios from "axios";

export default function AudioRecorder({ onTranscribed, disabled = false }) {
  const { startRecording, stopRecording } = useMicrophone();
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    try {
      setError("");
      setRecording(true);
      await startRecording();
    } catch (err) {
      setError("Failed to access microphone. Please check permissions.");
      setRecording(false);
    }
  }

  async function handleStop() {
    try {
      setRecording(false);
      setProcessing(true);
      const blob = await stopRecording();

      const form = new FormData();
      form.append("audio", blob, "input.wav");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005";
      const res = await axios.post(`${apiUrl}/api/interview/audio`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      onTranscribed(res.data.text);
      setError("");
    } catch (err) {
      setError("Failed to process audio. Please try again.");
      console.error("Audio processing error:", err);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Audio Visualizer */}
      <div className="relative bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-8 overflow-hidden">
        {/* Background Animation */}
        {recording && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-indigo-500/20 animate-ping"></div>
            <div className="absolute w-24 h-24 rounded-full bg-purple-500/20 animate-pulse"></div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Microphone Icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
            recording 
              ? "bg-red-500/20 shadow-lg shadow-red-500/50 scale-110" 
              : "bg-indigo-500/20 shadow-lg shadow-indigo-500/30"
          }`}>
            <svg 
              className={`w-10 h-10 transition-colors ${recording ? "text-red-400" : "text-indigo-400"}`} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={2} 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>

          {/* Status Text */}
          <div className="text-center">
            {processing ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
                <p className="text-white font-semibold">Processing audio...</p>
                <p className="text-gray-400 text-sm mt-1">Transcribing your answer</p>
              </>
            ) : recording ? (
              <>
                <p className="text-white font-semibold flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Recording...
                </p>
                <p className="text-gray-400 text-sm mt-1">Speak clearly into your microphone</p>
              </>
            ) : (
              <>
                <p className="text-white font-semibold">Ready to record</p>
                <p className="text-gray-400 text-sm mt-1">Click the button below to start</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-red-300 font-medium text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-3">
        {!recording && !processing ? (
          <button
            onClick={handleStart}
            disabled={disabled}
            className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Start Recording
          </button>
        ) : recording ? (
          <button
            onClick={handleStop}
            className="flex-1 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 animate-pulse"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            Stop Recording
          </button>
        ) : (
          <button
            disabled
            className="flex-1 py-4 bg-gray-500/20 text-gray-400 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2"
          >
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-gray-400 text-xs flex items-start gap-2">
          <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong className="text-white">Tip:</strong> Speak clearly and at a moderate pace. Find a quiet environment for best results.
          </span>
        </p>
      </div>
    </div>
  );
}
