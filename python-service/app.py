from fastapi import FastAPI, UploadFile, File, Request
from resume_parser.parser import parse_resume
from llm_engine.interview_flow import next_question, determine_next_stage
from llm_engine.report_generator import generate_report
from speech_to_text.whisper_service import transcribe_audio   # calls OpenAI API

app = FastAPI()


# ============================
# 1) RESUME PARSER
# ============================
@app.post("/resume/parse")
async def parse_resume_api(file: UploadFile = File(...)):
    contents = await file.read()
    result = parse_resume(contents, file.filename)
    return {"parsed": result}


# ============================
# 2) INTERVIEW ENGINE
# ============================
@app.post("/interview/next")
async def get_next_question(payload: dict):
    stage = payload.get("stage")
    skills = payload.get("skills", [])
    q = next_question(stage, skills)
    next_s = determine_next_stage(stage)
    return {"question": q, "nextStage": next_s}


# ============================
# 3) SPEECH TO TEXT (OpenAI Whisper API)
# ============================
@app.post("/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    text = await transcribe_audio(audio)
    return {"text": text}


# ============================
# 4) REPORT GENERATOR
# ============================
@app.post("/generate-report")
async def generate_report_endpoint(payload: Request):
    data = await payload.json()
    interview = data.get("interview", data)
    report = generate_report(interview)
    return report


# ============================
# ROOT CHECK
# ============================
@app.get("/")
async def root():
    return {"message": "Python service running successfully!"}
