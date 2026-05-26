"use client";

import { useState, useRef, useEffect } from "react";

interface VideoRecorderProps {
    onVideoRecorded: (videoBlob: Blob) => void;
    disabled?: boolean;
}

export default function VideoRecorder({ onVideoRecorded, disabled = false }: VideoRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const previewRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        return () => {
            // Cleanup
            stopCamera();
            if (recordedBlob) {
                URL.revokeObjectURL(previewRef.current?.src || "");
            }
        };
    }, []);

    async function requestCameraAccess() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user"
                },
                audio: true
            });

            streamRef.current = stream;
            setHasPermission(true);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            return stream;
        } catch (error) {
            console.error("Camera access error:", error);
            setHasPermission(false);
            return null;
        }
    }

    function stopCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }

    async function startRecording() {
        let stream = streamRef.current;

        if (!stream) {
            stream = await requestCameraAccess();
            if (!stream) return;
        }

        // Countdown before recording
        setCountdown(3);
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    beginRecording(stream!);
                    return null;
                }
                return (prev || 0) - 1;
            });
        }, 1000);
    }

    function beginRecording(stream: MediaStream) {
        chunksRef.current = [];

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp8,opus'
        });

        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            setRecordedBlob(blob);
            setIsPreviewing(true);

            // Show preview
            if (previewRef.current) {
                previewRef.current.src = URL.createObjectURL(blob);
            }

            stopCamera();
        };

        mediaRecorder.start();
        setIsRecording(true);
    }

    function stopRecording() {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }

    function submitVideo() {
        if (recordedBlob) {
            onVideoRecorded(recordedBlob);
            resetRecorder();
        }
    }

    function resetRecorder() {
        setRecordedBlob(null);
        setIsPreviewing(false);
        chunksRef.current = [];
        if (previewRef.current) {
            URL.revokeObjectURL(previewRef.current.src);
            previewRef.current.src = "";
        }
    }

    async function retryRecording() {
        resetRecorder();
        await requestCameraAccess();
    }

    if (hasPermission === false) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl text-red-300">
                <p className="font-bold mb-2">📹 Camera Access Denied</p>
                <p className="text-sm mb-4">
                    Please allow camera and microphone access in your browser settings to record video.
                </p>
                <button
                    onClick={requestCameraAccess}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm"
                >
                    Retry Permission
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Camera Preview / Recorded Video */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                {!isPreviewing ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-auto min-h-[400px]"
                            style={{ transform: "scaleX(-1)" }} // Mirror effect
                        />

                        {countdown !== null && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                                <div className="text-center">
                                    <div className="text-9xl font-black text-white mb-4 animate-bounce" style={{
                                        textShadow: "0 0 40px rgba(99,102,241,0.8), 0 0 80px rgba(168,85,247,0.6)"
                                    }}>
                                        {countdown}
                                    </div>
                                    <p className="text-gray-300 text-lg">Get ready...</p>
                                </div>
                            </div>
                        )}

                        {isRecording && (
                            <div className="absolute top-6 left-6 flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2.5 rounded-full shadow-lg shadow-red-500/50 animate-pulse">
                                <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                                <span className="text-white font-bold text-sm">REC</span>
                            </div>
                        )}

                        {/* Recording Timer */}
                        {isRecording && (
                            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <span className="text-white font-mono text-sm">⏱ Recording</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="relative">
                        <video
                            ref={previewRef}
                            controls
                            className="w-full h-auto"
                        />
                        <div className="absolute top-4 left-4 bg-indigo-500/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <span className="text-white font-semibold text-xs">Preview</span>
                        </div>
                    </div>
                )}

                {!hasPermission && !isPreviewing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm">
                        <div className="text-center p-8">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
                                <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Camera Access Required</h3>
                            <p className="text-gray-400 text-sm max-w-sm">Click the button below to enable your camera and microphone</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            {!isPreviewing ? (
                <div className="flex gap-3">
                    {!isRecording ? (
                        <button
                            onClick={startRecording}
                            disabled={disabled || countdown !== null}
                            className="flex-1 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-50 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            {hasPermission ? "Start Video Recording" : "Enable Camera"}
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="flex-1 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <rect x="6" y="6" width="12" height="12" rx="2" />
                            </svg>
                            Stop Recording
                        </button>
                    )}
                </div>
            ) : (
                <div className="glass p-5 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5">
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-white font-semibold">Recording captured successfully!</p>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Review your recording and submit when ready, or re-record if needed.
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={submitVideo}
                            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Submit Video
                        </button>
                        <button
                            onClick={retryRecording}
                            className="px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-xl font-semibold transition-all duration-200 border border-yellow-500/30 hover:border-yellow-500/50 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Re-record
                        </button>
                        <button
                            onClick={resetRecorder}
                            className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all duration-200 border border-red-500/30 hover:border-red-500/50"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-gray-400 text-xs flex items-start gap-2">
                    <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        {isRecording
                            ? <><strong className="text-white">Recording:</strong> Speak clearly and maintain eye contact with the camera. Good lighting helps!</>
                            : isPreviewing
                                ? <><strong className="text-white">Review:</strong> Watch your recording before submitting. You can re-record if needed.</>
                                : <><strong className="text-white">Tip:</strong> Position yourself in a well-lit area and ensure your face is clearly visible. Test your camera before starting.</>
                        }
                    </span>
                </p>
            </div>
        </div>
    );
}
