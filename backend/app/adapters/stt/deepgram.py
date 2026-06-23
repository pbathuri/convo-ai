import httpx

from app.config import settings


async def transcribe_audio(audio_bytes: bytes) -> dict:
    if not settings.deepgram_api_key:
        return {
            "text": "",
            "provider": "mock",
            "degraded": True,
        }
    if not audio_bytes:
        return {
            "text": "",
            "provider": "deepgram",
            "degraded": True,
            "message": "No audio bytes provided",
        }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true",
            headers={
                "Authorization": f"Token {settings.deepgram_api_key}",
                "Content-Type": "audio/wav",
            },
            content=audio_bytes,
        )
        if response.status_code >= 400:
            return {
                "text": "",
                "provider": "deepgram",
                "degraded": True,
                "message": f"Deepgram error {response.status_code}",
            }
        payload = response.json()
        text = (
            payload.get("results", {})
            .get("channels", [{}])[0]
            .get("alternatives", [{}])[0]
            .get("transcript", "")
        )
        return {
            "text": text,
            "provider": "deepgram",
            "degraded": False,
        }
