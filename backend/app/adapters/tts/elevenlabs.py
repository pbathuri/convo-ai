import base64

import httpx

from app.config import settings

DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"


async def synthesize_speech(text: str, voice_id: str) -> dict:
    if not settings.elevenlabs_api_key:
        return {
            "audio_base64": None,
            "provider": "mock",
            "degraded": True,
            "message": "ELEVENLABS_API_KEY not configured",
        }
    vid = voice_id if voice_id != "default" else DEFAULT_VOICE_ID
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{vid}",
            headers={
                "xi-api-key": settings.elevenlabs_api_key,
                "Content-Type": "application/json",
                "Accept": "audio/mpeg",
            },
            json={
                "text": text,
                "model_id": "eleven_multilingual_v2",
            },
        )
        if response.status_code >= 400:
            return {
                "audio_base64": None,
                "provider": "elevenlabs",
                "degraded": True,
                "message": f"ElevenLabs error {response.status_code}",
            }
        return {
            "audio_base64": base64.b64encode(response.content).decode("ascii"),
            "provider": "elevenlabs",
            "degraded": False,
            "message": None,
        }
