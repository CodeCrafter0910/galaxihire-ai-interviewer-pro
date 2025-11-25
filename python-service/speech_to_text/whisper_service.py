import os
import aiohttp
from fastapi import UploadFile

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(file: UploadFile):
    audio_bytes = await file.read()

    url = "https://api.openai.com/v1/responses"

    payload = {
        "model": "gpt-4o-audio-preview",
        "input_audio": [
            {
                "data": audio_bytes,
                "format": file.filename.split(".")[-1]
            }
        ]
    }

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload, headers=headers) as response:
            data = await response.json()
            return data["output"][0]["content"][0]["text"]
