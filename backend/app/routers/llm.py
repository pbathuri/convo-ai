from fastapi import APIRouter

from app.adapters.llm.ollama import is_ollama_available
from app.config import settings

router = APIRouter(prefix="/llm", tags=["llm"])


@router.get("/status")
async def llm_status() -> dict:
    ollama = await is_ollama_available()
    chain = [
        "gemini" if settings.google_ai_studio_key else None,
        f"ollama:{settings.ollama_model}" if ollama else None,
        "heuristic",
    ]
    return {
        "chain": [c for c in chain if c],
        "gemini": bool(settings.google_ai_studio_key),
        "ollama": ollama,
        "ollamaModel": settings.ollama_model if ollama else None,
    }
