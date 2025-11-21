import math

def _safe(v, default=0):
    try:
        return float(v)
    except:
        return default

def generate_report(interview):
    scores = interview.get("scores", {})
    communication = _safe(scores.get("communication", 0))
    technical = _safe(scores.get("technical", 0))
    confidence = _safe(scores.get("confidence", 0))
    coding = _safe(scores.get("coding", 0))
    overall = _safe(scores.get("overall", (communication + technical + confidence + coding) / (4 or 1)))

    strengths = []
    improvements = []
    if communication >= 7:
        strengths.append("Clear communication")
    else:
        improvements.append("Practice concise answers and structure")

    if technical >= 7:
        strengths.append("Strong technical understanding")
    else:
        improvements.append("Brush up core algorithms and system design")

    if coding >= 7:
        strengths.append("Good coding ability")
    else:
        improvements.append("Practice coding problems and test cases")

    if confidence >= 7:
        strengths.append("Confident delivery")
    else:
        improvements.append("Work on presentation and mock interviews")

    recommendations = [
        "Follow a 4-week study plan focusing on weak areas.",
        "Use LeetCode / HackerRank for problem practice (3x per week).",
        "Record mock interviews and review for clarity."
    ]

    learning_roadmap = [
        {"week": 1, "focus": "Data Structures & Problem Solving"},
        {"week": 2, "focus": "System Design basics"},
        {"week": 3, "focus": "Coding practice & optimizations"},
        {"week": 4, "focus": "Mock interviews & communication"}
    ]

    html = f"""
    <html>
      <head>
        <style>
          body {{ font-family: Arial, sans-serif; padding: 24px; }}
          .header {{ text-align:center; margin-bottom:18px; }}
          .scores {{ display:flex; gap:12px; }}
          .card {{ border:1px solid #ddd; padding:12px; border-radius:6px; flex:1; }}
          .section {{ margin-top:14px; }}
          pre {{ white-space:pre-wrap; }}
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Interview Report</h1>
          <p>Candidate: {interview.get("candidateName","-")}</p>
          <p>Session: {interview.get("sessionName","-")}</p>
        </div>

        <div class="scores">
          <div class="card"><h3>Overall</h3><p>{round(overall,2)}</p></div>
          <div class="card"><h3>Communication</h3><p>{communication}</p></div>
          <div class="card"><h3>Technical</h3><p>{technical}</p></div>
          <div class="card"><h3>Coding</h3><p>{coding}</p></div>
          <div class="card"><h3>Confidence</h3><p>{confidence}</p></div>
        </div>

        <div class="section">
          <h3>Strengths</h3>
          <ul>{"".join(f"<li>{s}</li>" for s in strengths)}</ul>
        </div>

        <div class="section">
          <h3>Improvements</h3>
          <ul>{"".join(f"<li>{i}</li>" for i in improvements)}</ul>
        </div>

        <div class="section">
          <h3>Learning Roadmap</h3>
          <ul>{"".join(f"<li>Week {r['week']}: {r['focus']}</li>" for r in learning_roadmap)}</ul>
        </div>

        <div class="section">
          <h3>Recommendations</h3>
          <ul>{"".join(f"<li>{r}</li>" for r in recommendations)}</ul>
        </div>

        <div class="section">
          <h3>Transcript</h3>
          <pre>{interview.get("transcript","")}</pre>
        </div>
      </body>
    </html>
    """

    return {
        "communication": communication,
        "technical": technical,
        "confidence": confidence,
        "coding": coding,
        "overall": overall,
        "strengths": strengths,
        "improvements": improvements,
        "learning_roadmap": learning_roadmap,
        "recommendations": recommendations,
        "html": html
    }
