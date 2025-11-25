# paste this entire function over your existing transcribe_audio implementation

import os
import aiohttp
import base64
import json
from fastapi import UploadFile

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(file: UploadFile):
    if not OPENAI_API_KEY:
        print("DEBUG: Missing OPENAI_API_KEY env var")
        return "ERROR_MISSING_OPENAI_API_KEY"

    try:
        # read incoming file
        audio_bytes = await file.read()
        print(f"DEBUG: received file name={file.filename} content_type={file.content_type} bytes={len(audio_bytes)}")

        ext = (file.filename or "audio").split(".")[-1].lower()
        b64_audio = base64.b64encode(audio_bytes).decode("utf-8")

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
                status = resp.status
                body_text = await resp.text()
                print("DEBUG: OpenAI status:", status)
                print("DEBUG: OpenAI raw body (truncated 2000 chars):", body_text[:2000])

                # try to parse JSON
                try:
                    data = json.loads(body_text)
                except Exception as e:
                    print("DEBUG: Failed to parse OpenAI JSON:", str(e))
                    return f"ERROR_OPENAI_PARSE:{body_text[:1000]}"

                # 1) if they returned output_text
                if isinstance(data, dict) and data.get("output_text"):
                    return data.get("output_text", "")

                # 2) try new-style output arrays
                output = data.get("output") or data.get("outputs") or data.get("result")
                if isinstance(output, list):
                    # try to find any text in nested content
                    for item in output:
                        # item might have 'content' list
                        content = item.get("content") if isinstance(item, dict) else None
                        if isinstance(content, list):
                            for c in content:
                                if isinstance(c, dict):
                                    # common keys
                                    for k in ("text", "output_text", "content"):
                                        if k in c and isinstance(c[k], str) and c[k].strip():
                                            return c[k].strip()
                        # some items may have text directly
                        if isinstance(item, dict) and "text" in item and isinstance(item["text"], str) and item["text"].strip():
                            return item["text"].strip()

                # 3) classic choices
                if "choices" in data and isinstance(data["choices"], list):
                    texts = []
                    for ch in data["choices"]:
                        t = ch.get("text") or (ch.get("message") or {}).get("content") or ""
                        if isinstance(t, str) and t.strip():
                            texts.append(t.strip())
                    if texts:
                        return " ".join(texts)

                # nothing found — return the OpenAI body for debug
                print("DEBUG: No transcription text extracted. Returning full debug info.")
                return f"ERROR_NO_TEXT_IN_OPENAI_RESPONSE: {json.dumps(data)[:1500]}"

    except Exception as e:
        print("DEBUG: transcribe_audio exception:", str(e))
        return f"ERROR_TRANSCRIBE_EXCEPTION:{str(e)}"
