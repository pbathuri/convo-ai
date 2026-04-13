# services/voice_profiles.py

VOICE_PROFILES = {
    "calm_confident": {
        "name": "Ethan",
        "voice_id": "voice_001",
        "description": "Warm, confident and composed — great for professional replies."
    },
    "enthusiastic": {
        "name": "Luna",
        "voice_id": "voice_002",
        "description": "Friendly and excited — good for positivity and encouragement."
    },
    "empathetic": {
        "name": "Sofia",
        "voice_id": "voice_003",
        "description": "Soft, supportive and kind — best when user is low in empathy."
    },
    "default": {
        "name": "Kai",
        "voice_id": "default",
        "description": "Neutral and professional tone for general use."
    }
}

def choose_voice_profile(emotion_data):
    if emotion_data["confidence"] >= 8:
        return VOICE_PROFILES["calm_confident"]
    elif emotion_data["positivity"] >= 8:
        return VOICE_PROFILES["enthusiastic"]
    elif emotion_data["empathy"] <= 4:
        return VOICE_PROFILES["empathetic"]
    else:
        return VOICE_PROFILES["default"]
