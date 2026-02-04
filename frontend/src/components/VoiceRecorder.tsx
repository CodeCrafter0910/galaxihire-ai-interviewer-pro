"use client";

import { useState, useRef, useEffect } from "react";

interface VoiceAnalysis {
    confidence_score: number;
    tone_classification: string;
    speech_rate: number;
    pitch_variation: number;
    energy_level: number;
    clarity_score: number;
    emotional_state: string;
}

interface VoiceRecorderProps {
    onTranscript: (text: string, analysis?: VoiceAnalysis) => void;
    disabled?: boolean;
}

export default function VoiceRecorder({ onTranscript, disabled = false }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        return () => {
            if (audioURL) {
                URL.revokeObjectURL(audioURL);
            }
        };
    }, [audioURL]);

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setPermissionDenied(false);
            setAnalysis(null);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            setPermissionDenied(true);
        }
    }

    function stopRecording() {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }

    async function sendAudio() {
        if (!audioURL || uploading) return;

        try {
            setUploading(true);

            const response = await fetch(audioURL);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append("audio", blob, "recording.webm");

            const token = localStorage.getItem("token");
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

            // Use the new transcribe-and-analyze endpoint
            const uploadResponse = await fetch(`${backendUrl}/api/interview/audio`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to process audio");
            }

            const data = await uploadResponse.json();
            const transcript = data.text;
            const voiceAnalysis = data.analysis;

            // Store analysis for display
            if (voiceAnalysis) {
                setAnalysis(voiceAnalysis);
            }

            // Pass both transcript and analysis to parent
            onTranscript(transcript, voiceAnalysis);

            // Reset
            setAudioURL("");
            setUploading(false);
            chunksRef.current = [];

        } catch (error) {
            console.error("Error sending audio:", error);
            setUploading(false);
            alert("Failed to process audio. Please try again.");
        }
    }

    function cancelRecording() {
        setAudioURL("");
        setAnalysis(null);
        chunksRef.current = [];
    }

    if (permissionDenied) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-300 text-sm">
                <p className="font-bold mb-1">🎤 Microphone Access Denied</p>
                <p>Please allow microphone access in your browser settings to use voice recording.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {!audioURL ? (
                <div className="flex items-center gap-3">
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={disabled}
                        className={`flex-1 py-4 rounded-xl font-bold transition ${isRecording
                                ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 animate-pulse"
                                : "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isRecording ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
                                Recording... (Click to Stop)
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                🎤 Start Voice Recording
                            </span>
                        )}
                    </button>
                </div>
            ) : (
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-gray-300 mb-3 text-sm">Recording captured! Review and send:</p>

                    <audio
                        src={audioURL}
                        controls
                        className="w-full mb-3"
                        style={{ filter: "invert(0.9)" }}
                    />

                    {/* Show Previous Analysis if Available */}
                    {analysis && (
                        <div className="mb-3 p-3 bg-black/30 rounded-lg">
                            <div className="text-sm font-bold text-white mb-2">🎯 Voice Analysis</div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="text-xs">
                                    <span className="text-gray-400">Confidence:</span>{" "}
                                    <span className="text-green-300 font-bold">{analysis.confidence_score}/100</span>
                                </div>
                                <div className="text-xs">
                                    <span className="text-gray-400">Tone:</span>{" "}
                                    <span className="text-blue-300">{analysis.tone_classification}</span>
                                </div>
                                <div className="text-xs">
                                    <span className="text-gray-400">Speech Rate:</span>{" "}
                                    <span className="text-purple-300">{analysis.speech_rate} WPM</span>
                                </div>
                                <div className="text-xs">
                                    <span className="text-gray-400">Emotion:</span>{" "}
                                    <span className="text-yellow-300">{analysis.emotional_state}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={sendAudio}
                            disabled={uploading}
                            className="flex-1 btn-primary py-3 disabled:opacity-50"
                        >
                            {uploading ? "Processing..." : "✓ Send & Transcribe"}
                        </button>
                        <button
                            onClick={cancelRecording}
                            disabled={uploading}
                            className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg disabled:opacity-50"
                        >
                            ✕ Cancel
                        </button>
                    </div>

                    {uploading && (
                        <p className="text-gray-400 text-sm mt-2 text-center">
                            Analyzing voice and converting speech to text...
                        </p>
                    )}
                </div>
            )}

            <p className="text-gray-500 text-xs text-center">
                {isRecording
                    ? "Speak clearly into your microphone"
                    : "Click to start recording your answer"}
            </p>
        </div>
    );
}
