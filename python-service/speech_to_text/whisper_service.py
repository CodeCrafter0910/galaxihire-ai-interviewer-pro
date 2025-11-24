import os
import aiohttp
from fastapi import UploadFile    # <-- FIXED ERROR

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


async def transcribe_audio(file: UploadFile):
    """
    Speech-to-Text using OpenAI Whisper API.
    Supports mp3, wav, m4a, webm.
    """
    if not OPENAI_API_KEY:
        return "Missing OPENAI_API_KEY"

    # Read uploaded audio
    audio_bytes = await file.read()

    # Prepare form-data request
    form = aiohttp.FormData()
    form.add_field(
        "file",
        audio_bytes,
        filename=file.filename,
        content_type=file.content_type   # IMPORTANT for MP3
    )
    form.add_field("model", "whisper-1")

    # Whisper API endpoint
    url = "https://api.openai.com/v1/audio/transcriptions"

    async with aiohttp.ClientSession() as session:
        async with session.post(
            url,
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            data=form
        ) as resp:

            data = await resp.json()
            return data.get("text", "")
