import os
import aiohttp
import json
from fastapi import UploadFile

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

async def transcribe_audio(file: UploadFile):
    print("🔥 STT STARTED")

    if not GROQ_API_KEY:
        print("🔥 ERROR: Missing GROQ_API_KEY")
        return ""

    # Read bytes of the uploaded audio
    audio_bytes = await file.read()
    print("🔥 Audio bytes:", len(audio_bytes))

    url = "https://api.groq.com/openai/v1/audio/transcriptions"

    form = aiohttp.FormData()
    form.add_field("file", audio_bytes, filename="audio.wav", content_type="audio/wav")
    form.add_field("model", "whisper-large-v3")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, data=form) as resp:
            text = await resp.text()
            print("🔥 RAW RESPONSE:", text)

            try:
                data = json.loads(text)
                return data.get("text", "")
            except:
                return ""
