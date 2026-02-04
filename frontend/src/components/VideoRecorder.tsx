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
            <div className="relative bg-black rounded-xl overflow-hidden">
                {!isPreviewing ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-auto"
                            style={{ transform: "scaleX(-1)" }} // Mirror effect
                        />

                        {countdown !== null && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <div className="text-white text-8xl font-bold animate-pulse">
                                    {countdown}
                                </div>
                            </div>
                        )}

                        {isRecording && (
                            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/80 px-3 py-2 rounded-full">
                                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                <span className="text-white font-bold text-sm">Recording...</span>
                            </div>
                        )}
                    </>
                ) : (
                    <video
                        ref={previewRef}
                        controls
                        className="w-full h-auto"
                    />
                )}

                {!hasPermission && !isPreviewing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                        <div className="text-center">
                            <div className="text-6xl mb-4">📹</div>
                            <p className="text-gray-300">Click button below to start camera</p>
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
                            className="flex-1 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl font-bold transition disabled:opacity-50"
                        >
                            {hasPermission ? "🎥 Start Video Recording" : "📹 Enable Camera"}
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="flex-1 py-4 bg-red-600/30 hover:bg-red-600/40 text-white rounded-xl font-bold animate-pulse"
                        >
                            ⏹ Stop Recording
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-gray-300 mb-3 text-sm">
                        Recording captured! Review and submit:
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={submitVideo}
                            className="flex-1 btn-primary py-3"
                        >
                            ✓ Submit Video
                        </button>
                        <button
                            onClick={retryRecording}
                            className="px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg"
                        >
                            🔄 Re-record
                        </button>
                        <button
                            onClick={resetRecorder}
                            className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <p className="text-gray-500 text-xs text-center">
                {isRecording
                    ? "Speak clearly and look at the camera"
                    : isPreviewing
                        ? "Review your recording before submitting"
                        : "Your video will be recorded with audio"}
            </p>
        </div>
    );
}
