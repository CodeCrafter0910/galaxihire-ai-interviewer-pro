import os
from fastapi import UploadFile
import whisper
import tempfile

model = whisper.load_model("base")

async def transcribe_audio(file: UploadFile):
    # Save temp audio file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp:
        temp.write(await file.read())
        temp_path = temp.name

    # Run Whisper
    result = model.transcribe(temp_path)

    # Cleanup
    os.remove(temp_path)

    return result["text"]
