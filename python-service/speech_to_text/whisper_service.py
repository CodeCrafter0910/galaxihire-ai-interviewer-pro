import os
import aiohttp

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


async def transcribe_audio(file):
    """
    Real Speech-to-Text using OpenAI Whisper API.
    Works on Render (no heavy model installation needed).
    """
    if not OPENAI_API_KEY:
        return "Error: OPENAI_API_KEY is missing."

    audio_bytes = await file.read()

    url = "https://api.openai.com/v1/audio/transcriptions"

    form = aiohttp.FormData()
    form.add_field("file", audio_bytes, filename="audio.wav", content_type="audio/wav")
    form.add_field("model", "gpt-4o-mini-transcribe")


    async with aiohttp.ClientSession() as session:
        async with session.post(
            url,
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            data=form,
        ) as resp:
            data = await resp.json()
            return data.get("text", "")
