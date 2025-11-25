# python-service/speech_to_text/whisper_service.py
import os
import aiohttp
import base64
import json
from fastapi import UploadFile

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(file: UploadFile):
    """
    Transcribe audio using OpenAI Responses API (audio input).
    Works with project keys (sk-proj-...), admin keys, or classic keys.
    Returns the transcribed text (string) or an empty string on failure.
    """

    if not OPENAI_API_KEY:
        # helpful debug string for logs
        print("MISSING OPENAI API KEY")
        return ""

    try:
        audio_bytes = await file.read()
        ext = (file.filename or "audio").split(".")[-1].lower()

        # base64 encode the audio bytes
        b64_audio = base64.b64encode(audio_bytes).decode("utf-8")

        # Build payload for /v1/responses with input_audio
        # NOTE: Models, param names and structure may vary; this implementation
        # attempts to follow the Responses API pattern for audio inputs.
        url = "https://api.openai.com/v1/responses"

        payload = {
            "model": "gpt-4o-audio-preview",
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
            async with session.post(url, json=payload, headers=headers, timeout=120) as resp:
                text = await resp.text()
                # Try to parse JSON safely
                try:
                    data = json.loads(text)
                except Exception as e:
                    print("OpenAI response parse error:", e, "raw:", text)
                    return ""

                # Debug print the response for Render logs (remove in prod)
                print("OPENAI /responses raw:", json.dumps(data)[:2000])

                # Several OpenAI response shapes are possible. Try multiple extraction points:
                # 1) new style may include 'output_text' for easy text
                if isinstance(data, dict):
                    if "output_text" in data and isinstance(data["output_text"], str):
                        return data["output_text"]

                    # 2) 'output' array with nested content
                    output = data.get("output") or data.get("outputs")
                    if isinstance(output, list) and len(output) > 0:
                        # Attempt to extract text from content items
                        for out in output:
                            # some responses embed 'content' as list
                            content = out.get("content") or out.get("message") or out.get("output")
                            if isinstance(content, list):
                                for c in content:
                                    if isinstance(c, dict) and c.get("type") in ("message", "output_text", "output"):
                                        # try common keys
                                        txt = c.get("text") or c.get("output_text") or c.get("content")
                                        if isinstance(txt, str) and txt.strip():
                                            return txt.strip()
                                    # some items may have 'text' directly
                                    if isinstance(c, dict) and "text" in c and isinstance(c["text"], str) and c["text"].strip():
                                        return c["text"].strip()
                            # some out objects have 'text' directly
                            if isinstance(out, dict):
                                if "text" in out and isinstance(out["text"], str) and out["text"].strip():
                                    return out["text"].strip()

                    # 3) classic v1 responses (rare here)
                    if "choices" in data and isinstance(data["choices"], list) and len(data["choices"]) > 0:
                        # join all text fields
                        texts = []
                        for ch in data["choices"]:
                            t = ch.get("text") or (ch.get("message") or {}).get("content") or ""
                            if isinstance(t, str) and t.strip():
                                texts.append(t.strip())
                        if texts:
                            return " ".join(texts)

                # If nothing matched, return empty string (but log for debugging)
                print("No transcription found in OpenAI response.")
                return ""
    except Exception as e:
        print("Transcription error:", str(e))
        return ""
