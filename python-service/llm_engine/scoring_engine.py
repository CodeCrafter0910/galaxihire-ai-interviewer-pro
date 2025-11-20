def score_answer(answer: str):
    if len(answer) < 20:
        return 2
    if "experience" in answer.lower():
        return 8
    return 5
