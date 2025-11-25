import os
import aiohttp
from fastapi import UploadFile

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(file: UploadFile):
    if not OPENAI_API_KEY:
        return "Missing OPENAI_API_KEY"

    audio_bytes = await file.read()

    # ---- MIME TYPE FIX ----
    ext = file.filename.split(".")[-1].lower()
    if ext == "mp3":
        mime = "audio/mpeg"
    elif ext == "wav":
        mime = "audio/wav"
    elif ext == "m4a":
        mime = "audio/m4a"
    elif ext == "webm":
        mime = "audio/webm"
    else:
        mime = "audio/mpeg"
    # ------------------------

    form = aiohttp.FormData()
    form.add_field(
        "file",
        audio_bytes,
        filename=file.filename,
        content_type=mime
    )
    form.add_field("model", "whisper-1")

    url = "https://api.openai.com/v1/audio/transcriptions"

    async with aiohttp.ClientSession() as session:
        async with session.post(
            url,
            data=form,
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"}
        ) as response:
            data = await response.json()
            return data.get("text", "")
