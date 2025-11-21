import cv2
from .emotion_detector import analyze_emotions
from .gaze_tracking import analyze_gaze

def analyze_video(video_path):
    cap = cv2.VideoCapture(video_path)

    emotions = []
    gazes = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        emotion = analyze_emotions(frame)
        gaze = analyze_gaze(frame)

        emotions.append(emotion)
        gazes.append(gaze)

    cap.release()

    return {
        "emotions": emotions,
        "gaze": gazes,
        "engagement_score": round((emotions.count("happy") / len(emotions)) * 100, 2)
    }
