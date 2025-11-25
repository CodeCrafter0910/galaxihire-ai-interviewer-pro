import os
import aiohttp
from fastapi import UploadFile

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(file: UploadFile):
    """
    Real Speech-to-Text using OpenAI Whisper API.
    Supports mp3, wav, m4a, webm.
    """
    if not OPENAI_API_KEY:
        return "Missing OPENAI_API_KEY"

    # Read the uploaded file bytes
    audio_bytes = await file.read()

    # Prepare OpenAI Whisper API request
    form = aiohttp.FormData()
    form.add_field(
        "file",
        audio_bytes,
        filename=file.filename,
        content_type=file.content_type or "audio/wav"
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
