import os
import aiohttp
import json
from fastapi import UploadFile

HF_API_KEY = os.getenv("HF_API_KEY")

async def transcribe_audio(file: UploadFile):
    print("🔥 DEBUG: transcribe_audio STARTED")

    if not HF_API_KEY:
        print("🔥 DEBUG: HF_API_KEY missing")
        return ""

    url = "https://api-inference.huggingface.co/models/guillaumekln/whisper-large-v3"

    audio_bytes = await file.read()
    print("🔥 DEBUG: audio bytes len =", len(audio_bytes))

    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(
            url,
            headers=headers,
            data={"inputs": audio_bytes}   # FIXED HERE
        ) as resp:

            status = resp.status
            body = await resp.text()

            print("🔥 DEBUG: HF STATUS =", status)
            print("🔥 DEBUG: HF RAW RESPONSE =", body[:2000])

            try:
                data = json.loads(body)
                print("🔥 DEBUG: HF JSON =", data)
            except:
                print("🔥 DEBUG: HF JSON PARSE FAILED")
                return ""

            return data.get("text", "")
