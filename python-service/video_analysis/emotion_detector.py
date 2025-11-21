import cv2
from deepface import DeepFace

def analyze_emotions(frame):
    try:
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        return result[0]["dominant_emotion"]
    except:
        return "unknown"
