# services/voice_personality_engine.py

VOICE_PROFILES = [
    {
        "tone": "upbeat",
        "name": "Samantha",
        "description": "Bright and cheerful",
        "voice_id": "Samantha"
    },
    {
        "tone": "calm",
        "name": "Daniel",
        "description": "Neutral and composed",
        "voice_id": "Daniel"
    },
    {
        "tone": "confident",
        "name": "Alex",
        "description": "Assertive and clear",
        "voice_id": "Alex"
    },
    {
        "tone": "empathetic",
        "name": "Karen",
        "description": "Warm and friendly",
        "voice_id": "Karen"
    },
    {
        "tone": "motivational",
        "name": "Victoria",
        "description": "Inspiring and encouraging",
        "voice_id": "Victoria"
    }
]

def choose_voice_profile(emotion_data):
    """
    Choose a voice based on emotional analysis.
    Fallbacks to 'Daniel' if no suitable match is found.
    """
    if not isinstance(emotion_data, dict):
        return next((v for v in VOICE_PROFILES if v["voice_id"] == "Daniel"), VOICE_PROFILES[0])

    confidence = emotion_data.get("confidence", 0)
    positivity = emotion_data.get("positivity", 0)
    empathy = emotion_data.get("empathy", 0)

    if positivity > 7:
        return next((v for v in VOICE_PROFILES if v["tone"] == "upbeat"), VOICE_PROFILES[0])
    elif confidence > 6:
        return next((v for v in VOICE_PROFILES if v["tone"] == "confident"), VOICE_PROFILES[0])
    elif empathy > 6:
        return next((v for v in VOICE_PROFILES if v["tone"] == "empathetic"), VOICE_PROFILES[0])
    elif confidence > 4 and positivity > 4:
        return next((v for v in VOICE_PROFILES if v["tone"] == "motivational"), VOICE_PROFILES[0])
    else:
        return next((v for v in VOICE_PROFILES if v["tone"] == "calm"), VOICE_PROFILES[0])
