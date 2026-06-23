from fastapi import APIRouter

from app.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict:
    return {
        "ok": True,
        "service": settings.app_name,
        "gemini": bool(settings.google_ai_studio_key),
        "openai": bool(settings.openai_api_key),
        "deepgram": bool(settings.deepgram_api_key),
        "elevenlabs": bool(settings.elevenlabs_api_key),
        "supabase": bool(settings.supabase_url),
    }
