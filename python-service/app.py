from fastapi import FastAPI, UploadFile, File, Request
from resume_parser.parser import parse_resume
from llm_engine.interview_flow import next_question, determine_next_stage
from llm_engine.report_generator import generate_report
from speech_to_text.whisper_service import transcribe_audio
from audio_analysis.voice_analyzer import analyze_audio

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
    print("🔥 DEBUG: /stt route HIT — Python received request")
    text = await transcribe_audio(audio)
    print("🔥 DEBUG: /stt finished, text=", text)
    return {"text": text}

@app.post("/audio/analyze")
async def analyze_voice(audio: UploadFile = File(...)):
    """
    Analyze audio for tone, confidence, and emotional characteristics
    """
    print("🎤 DEBUG: /audio/analyze route HIT")
    contents = await audio.read()
    result = analyze_audio(contents, audio.filename)
    print(f"🎤 DEBUG: Analysis complete - Confidence: {result.get('analysis', {}).get('confidence_score', 0)}")
    return result

@app.post("/audio/transcribe-and-analyze")
async def transcribe_and_analyze(audio: UploadFile = File(...)):
    """
    Combined endpoint: transcribe audio AND analyze voice characteristics
    """
    print("🎤 DEBUG: /audio/transcribe-and-analyze route HIT")
    
    # Read audio once
    contents = await audio.read()
    
    # Transcribe text
    # Note: We need to create a temporary UploadFile-like object for transcribe_audio
    from io import BytesIO
    
    class TempUploadFile:
        def __init__(self, content, filename):
            self.file = BytesIO(content)
            self.filename = filename
        
        async def read(self):
            return self.file.read()
    
    temp_file = TempUploadFile(contents, audio.filename)
    text = await transcribe_audio(temp_file)
    
    # Analyze voice
    analysis_result = analyze_audio(contents, audio.filename)
    
    # Combine results
    return {
        "text": text,
        "analysis": analysis_result.get("analysis", {}),
        "success": analysis_result.get("success", True)
    }

@app.post("/generate-report")
async def generate_report_endpoint(payload: Request):
    data = await payload.json()
    interview = data.get("interview", data)
    return generate_report(interview)

@app.get("/")
async def root():
    return {"message": "Python service running successfully!"}
