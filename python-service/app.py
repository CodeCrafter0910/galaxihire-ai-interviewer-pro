from fastapi import FastAPI, UploadFile, File, Request
from resume_parser.parser import parse_resume
from llm_engine.interview_flow import next_question, determine_next_stage
from llm_engine.report_generator import generate_report
from speech_to_text.whisper_service import transcribe_audio

app = FastAPI()

@app.post("/resume/parse")
async def parse_resume_api(file: UploadFile = File(...)):
    contents = await file.read()
    result = parse_resume(contents, file.filename)
    return {"parsed": result}

@app.post("/interview/next")
async def interview_next(payload: dict):
    stage = payload.get("stage")
    skills = payload.get("skills", [])
    return {
        "question": next_question(stage, skills),
        "nextStage": determine_next_stage(stage)
    }

@app.post("/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    print("DEBUG: /stt called, filename:", audio.filename, "content_type:", audio.content_type)
    text = await transcribe_audio(audio)
    print("DEBUG: transcription result repr:", repr(text))
    return {"text": text}


@app.post("/generate-report")
async def generate_report_endpoint(payload: Request):
    data = await payload.json()
    interview = data.get("interview", data)
    return generate_report(interview)

@app.get("/")
async def root():
    return {"message": "Python service running successfully!"}
