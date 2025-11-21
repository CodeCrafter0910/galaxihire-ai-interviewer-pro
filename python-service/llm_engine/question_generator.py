import random

def generate_hr_question():
    questions = [
        "Tell me about yourself.",
        "What are your strengths?",
        "Why do you want this job?",
        "Describe a challenge you faced.",
        "Where do you see yourself in 5 years?"
    ]
    return random.choice(questions)

def generate_technical_question(skills):
    skills = [s.lower() for s in skills]

    if "python" in skills:
        return "Explain the difference between a list and a tuple in Python."

    if "java" in skills:
        return "What is encapsulation in Java?"

    if "react" in skills or "javascript" in skills:
        return "What are React hooks and why are they used?"

    if "sql" in skills:
        return "What is the difference between INNER JOIN and LEFT JOIN?"

    return "Explain a technical project you have worked on."

def generate_trick_question():
    questions = [
        "How many tennis balls can fit inside a car?",
        "If you had to remove one state from India, which one and why?",
        "Why are manholes round?",
        "How would you explain AI to a 5-year-old?",
    ]
    return random.choice(questions)
