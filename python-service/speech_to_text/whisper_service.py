import os
import tempfile
import soundfile as sf
from faster_whisper import WhisperModel
from fastapi import UploadFile

# Load the model once at startup (fast, cached)
# You can choose: tiny, small, medium — tiny is fastest
model = WhisperModel("small", device="cpu", compute_type="float32")

async def transcribe_audio(file: UploadFile):
    try:
        # Save uploaded file to a temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            audio_bytes = await file.read()
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        # Load audio file
        audio, sr = sf.read(tmp_path)

        # Transcribe
        segments, info = model.transcribe(tmp_path)

        text = " ".join([segment.text for segment in segments])
        print("DEBUG transcription:", text)

        return text

    except Exception as e:
        print("ERROR in local STT:", str(e))
        return ""
