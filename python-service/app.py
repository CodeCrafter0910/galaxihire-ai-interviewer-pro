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
