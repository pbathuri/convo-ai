from fastapi import APIRouter

from app.adapters.llm.ollama import is_ollama_available
from app.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict:
    ollama = await is_ollama_available()
    return {
        "ok": True,
        "service": settings.app_name,
        "gemini": bool(settings.google_ai_studio_key),
        "openai": bool(settings.openai_api_key),
        "ollama": ollama,
        "ollamaModel": settings.ollama_model if ollama else None,
        "deepgram": bool(settings.deepgram_api_key),
        "elevenlabs": bool(settings.elevenlabs_api_key),
        "supabase": bool(settings.supabase_url),
    }
