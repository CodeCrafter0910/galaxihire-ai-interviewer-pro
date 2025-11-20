from transformers import pipeline

generator = pipeline("text-generation", model="gpt2")

def generate_hr_question():
    prompt = "Generate one HR interview question:"
    out = generator(prompt, max_length=30, num_return_sequences=1)
    return out[0]['generated_text']

def generate_technical_question(skills):
    s = ", ".join(skills)
    prompt = f"Generate one technical interview question for skills: {s}:"
    out = generator(prompt, max_length=35, num_return_sequences=1)
    return out[0]['generated_text']

def generate_trick_question():
    prompt = "Generate one trick interview question to test presence of mind:"
    out = generator(prompt, max_length=30, num_return_sequences=1)
    return out[0]['generated_text']
