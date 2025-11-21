"use client";

import { useState } from "react";
import { useMicrophone } from "@/hooks/useMicrophone";
import axios from "axios";

export default function AudioRecorder({ onTranscribed }) {
  const { startRecording, stopRecording } = useMicrophone();
  const [recording, setRecording] = useState(false);

  async function handleStart() {
    setRecording(true);
    await startRecording();
  }

  async function handleStop() {
    setRecording(false);
    const blob = await stopRecording();

    const form = new FormData();
    form.append("audio", blob, "input.wav");

    const res = await axios.post("http://localhost:4000/api/interview/audio", form);
    onTranscribed(res.data.text);
  }

  return (
    <div>
      {!recording ? (
        <button onClick={handleStart}>🎤 Start Speaking</button>
      ) : (
        <button onClick={handleStop}>⏹ Stop</button>
      )}
    </div>
  );
}
