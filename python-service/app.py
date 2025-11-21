from fastapi import FastAPI, UploadFile, File
from resume_parser.parser import parse_resume
from llm_engine.interview_flow import next_question, determine_next_stage

app = FastAPI()

@app.post("/resume/parse")
async def parse_resume_api(file: UploadFile = File(...)):
    contents = await file.read()
    result = parse_resume(contents, file.filename)
    return {"parsed": result}

@app.post("/interview/next")
async def get_next_question(payload: dict):
    stage = payload.get("stage")
    skills = payload.get("skills", [])
    q = next_question(stage, skills)
    next_s = determine_next_stage(stage)
    return {"question": q, "nextStage": next_s}
from fastapi import UploadFile, File
from speech_to_text.whisper_service import transcribe_audio

@app.post("/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    text = await transcribe_audio(audio)
    return {"text": text}
from fastapi import UploadFile, File
import tempfile
from video_analysis.analyze_video import analyze_video

@app.post("/analyze-video")
async def analyze_video_endpoint(video: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp:
        temp.write(await video.read())
        temp_path = temp.name

    result = analyze_video(temp_path)
    return result
