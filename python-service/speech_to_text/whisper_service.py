import os
import aiohttp
import base64
from fastapi import UploadFile

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(file: UploadFile):
    if not OPENAI_API_KEY:
        return "MISSING_OPENAI_API_KEY"

    audio_bytes = await file.read()
    ext = file.filename.split(".")[-1]

    # Base64 encode audio (required by /responses API)
    b64_audio = base64.b64encode(audio_bytes).decode("utf-8")

    url = "https://api.openai.com/v1/responses"

    payload = {
        "model": "gpt-4o-mini-tts",
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_audio",
                        "input_audio": {
                            "data": b64_audio,
                            "format": ext
                        }
                    }
                ]
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
            # Debug print
            print("DEBUG RESPONSE:", data)

            # Extract text
            try:
                return data["output_text"]
            except:
                return ""
