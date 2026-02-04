import re
import PyPDF2
import docx2txt
import tempfile

# Expanded skill keywords database
SKILL_KEYWORDS = {
    # Programming Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "php", 
    "swift", "kotlin", "go", "rust", "scala", "r", "matlab",
    
    # Web Technologies
    "react", "angular", "vue", "nextjs", "svelte", "html", "css", "sass",
    "tailwind", "bootstrap", "webpack", "vite",
    
    # Backend
    "node", "nodejs", "express", "django", "flask", "fastapi", "spring", 
    "asp.net", "rails", "laravel",
    
    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "cassandra", "oracle",
    "sqlite", "dynamodb", "firebase",
    
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "gitlab", 
    "terraform", "ansible", "ci/cd",
    
    # AI/ML
    "machine learning", "deep learning", "ai", "tensorflow", "pytorch", 
    "scikit-learn", "nlp", "computer vision", "data science",
    
    # Mobile
    "android", "ios", "react native", "flutter",
    
    # Tools & Others
    "git", "github", "jira", "agile", "scrum", "rest api", "graphql",
    "microservices", "system design", "data structures", "algorithms"
}

def extract_text_from_pdf(content):
    """Extract text from PDF file bytes"""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(content)
        tmp.flush()
        temp_path = tmp.name

    text = ""
    try:
        reader = PyPDF2.PdfReader(temp_path)
        for page in reader.pages:
            try:
                page_text = page.extract_text() or ""
                text += page_text + "\n"
            except:
                continue
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""
    
    return text


def extract_text_from_docx(content):
    """Extract text from DOCX file bytes"""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
        tmp.write(content)
        tmp.flush()
        temp_path = tmp.name
    
    try:
        return docx2txt.process(temp_path)
    except Exception as e:
        print(f"DOCX extraction error: {e}")
        return ""


def extract_text(content, filename):
    """Extract text based on file type"""
    fname = filename.lower()

    if fname.endswith(".pdf"):
        return extract_text_from_pdf(content)
    elif fname.endswith(".docx"):
        return extract_text_from_docx(content)
    else:
        # Fallback for TXT or unknown
        return content.decode("utf-8", errors="ignore")


def extract_skills(text):
    """Extract skills from resume text using keyword matching"""
    lower_text = text.lower()
    found_skills = []
    
    for skill in SKILL_KEYWORDS:
        # Use word boundaries for better matching
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, lower_text):
            found_skills.append(skill.title())  # Capitalize for display
    
    # Remove duplicates and return
    return list(set(found_skills))


def extract_email(text):
    """Extract email address from text"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None


def extract_phone(text):
    """Extract phone number from text"""
    phone_pattern = r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]'
    match = re.search(phone_pattern, text)
    return match.group(0) if match else None


def extract_name(text):
    """Extract candidate name (first few words before common sections)"""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        # Usually name is in first few lines
        first_line = lines[0]
        # Avoid lines with common headers
        if not any(kw in first_line.lower() for kw in ['resume', 'cv', 'curriculum']):
            return first_line[:50]  # Limit length
    return None


def extract_experience(text):
    """Extract years of experience"""
    # Pattern: "5 years", "5+ years", "5-7 years"
    patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
        r'experience[:\s]*(\d+)\+?\s*years?',
        r'(\d+)\+?\s*years?\s+(?:in|as)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return int(match.group(1))
    
    return 0


def extract_education(text):
    """Extract education level"""
    education_keywords = {
        "phd": "PhD",
        "doctorate": "PhD",
        "master": "Master's",
        "mtech": "M.Tech",
        "mba": "MBA",
        "bachelor": "Bachelor's",
        "btech": "B.Tech",
        "bsc": "B.Sc",
        "diploma": "Diploma"
    }
    
    lower_text = text.lower()
    for keyword, degree in education_keywords.items():
        if keyword in lower_text:
            return degree
    
    return "Not specified"


def extract_projects(text):
    """Extract project mentions"""
    lines = text.split("\n")
    projects = []
    
    for i, line in enumerate(lines):
        if "project" in line.lower():
            # Get this line and maybe next 2 lines for context
            project_text = line.strip()
            if i + 1 < len(lines):
                project_text += " " + lines[i + 1].strip()
            
            projects.append(project_text[:200])  # Limit length
            
            if len(projects) >= 3:  # Max 3 projects
                break
    
    return projects


def extract_certifications(text):
    """Extract certifications"""
    cert_keywords = ['certified', 'certification', 'certificate']
    lines = text.split('\n')
    certs = []
    
    for line in lines:
        if any(kw in line.lower() for kw in cert_keywords):
            certs.append(line.strip()[:100])
            if len(certs) >= 3:
                break
    
    return certs


def parse_resume(content, filename):
    """
    Main function to parse resume and extract all information
    Returns a structured dictionary
    """
    text = extract_text(content, filename)
    
    if not text or len(text) < 50:
        return {
            "success": False,
            "error": "Could not extract text from resume",
            "text": "",
            "skills": [],
            "name": None,
            "email": None,
            "phone": None,
            "experience_years": 0,
            "education": "Not specified",
            "projects": [],
            "certifications": []
        }
    
    return {
        "success": True,
        "text": text[:2000],  # First 2000 chars for preview
        "skills": extract_skills(text),
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "experience_years": extract_experience(text),
        "education": extract_education(text),
        "projects": extract_projects(text),
        "certifications": extract_certifications(text)
    }
