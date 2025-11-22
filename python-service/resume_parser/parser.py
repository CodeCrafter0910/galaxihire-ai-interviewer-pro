import re
import PyPDF2
import docx2txt
import tempfile

SKILL_KEYWORDS = [
    "python", "java", "javascript", "react", "node", "express",
    "mongodb", "sql", "c++", "ai", "machine learning", "deep learning",
    "docker", "kubernetes", "fastapi"
]

def extract_text_from_pdf(content):
    # Save PDF bytes to a temp file (Required for PyPDF2 on Render)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(content)
        tmp.flush()
        temp_path = tmp.name

    text = ""
    reader = PyPDF2.PdfReader(temp_path)

    for page in reader.pages:
        page_text = ""
        try:
            page_text = page.extract_text() or ""
        except:
            pass
        text += page_text + "\n"

    return text


def extract_text_from_docx(content):
    # Save DOCX bytes to temp file (docx2txt needs file path)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
        tmp.write(content)
        tmp.flush()
        temp_path = tmp.name

    return docx2txt.process(temp_path)


def extract_text(content, filename):
    fname = filename.lower()

    if fname.endswith(".pdf"):
        return extract_text_from_pdf(content)

    if fname.endswith(".docx"):
        return extract_text_from_docx(content)

    # Fallback for TXT or unknown formats
    return content.decode("utf-8", errors="ignore")


def extract_skills(text):
    lower = text.lower()
    return list({skill for skill in SKILL_KEYWORDS if skill in lower})


def extract_experience(text):
    match = re.search(r"(\d+)\+?\s+years", text.lower())
    return match.group(1) if match else None


def extract_projects(text):
    lines = text.split("\n")
    return [line.strip() for line in lines if "project" in line.lower()][:5]


def extract_education(text):
    for word in ["btech", "mtech", "bachelor", "master", "degree"]:
        if word in text.lower():
            return word
    return None


def parse_resume(content, filename):
    text = extract_text(content, filename)

    return {
        "text": text,
        "skills": extract_skills(text),
        "experience_years": extract_experience(text),
        "projects": extract_projects(text),
        "education": extract_education(text),
    }
