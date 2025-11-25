import os
import requests
from fastapi import UploadFile

HF_API_KEY = os.getenv("HF_API_KEY")

async def transcribe_audio(file: UploadFile):
    url = "https://api-inference.huggingface.co/models/openai/whisper-small"

    audio_bytes = await file.read()

    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
    }

    response = requests.post(url, headers=headers, data=audio_bytes)

    try:
        data = response.json()
    except:
        return ""

    print("HF DEBUG:", data)

    # HuggingFace returns {"text": "..."}
    return data.get("text", "")
