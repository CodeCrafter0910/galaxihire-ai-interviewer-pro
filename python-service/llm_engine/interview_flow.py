from llm_engine.question_generator import generate_hr_question, generate_technical_question, generate_trick_question

def next_question(stage, skills):
    if stage == "hr":
        return generate_hr_question()
    if stage == "technical":
        return generate_technical_question(skills)
    if stage == "trick":
        return generate_trick_question()
    return "Interview Completed"

def determine_next_stage(current):
    if current == "hr":
        return "technical"
    if current == "technical":
        return "trick"
    return "completed"
