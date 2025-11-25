import os
from fastapi import UploadFile
import aiohttp

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(file: UploadFile):
    if not OPENAI_API_KEY:
        return "MISSING_OPENAI_API_KEY"

    url = "https://api.openai.com/v1/audio/transcriptions"

    form = aiohttp.FormData()
    form.add_field(
        "file",
        await file.read(),
        filename=file.filename,
        content_type=file.content_type
    )

    form.add_field("model", "gpt-4o-transcribe")

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, data=form, headers=headers) as resp:
            data = await resp.json()
            print("DEBUG OpenAI:", data)
            return data.get("text", "")
