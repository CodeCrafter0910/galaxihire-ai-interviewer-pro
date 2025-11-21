import cv2
import mediapipe as mp

mp_face = mp.solutions.face_mesh

def analyze_gaze(frame):
    with mp_face.FaceMesh(static_image_mode=True) as face_mesh:
        results = face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        if not results.multi_face_landmarks:
            return "unknown"
        return "center"
