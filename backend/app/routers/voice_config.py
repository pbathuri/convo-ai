import json
from pathlib import Path

from fastapi import APIRouter

from app.config import settings

router = APIRouter(prefix="/voice", tags=["voice-config"])

_AGENT_CONFIG = Path(__file__).resolve().parents[2] / "config" / "deepgram_agent.json"


@router.get("/agent-config")
async def get_agent_config() -> dict:
    configured = bool(settings.deepgram_api_key)
    if _AGENT_CONFIG.exists():
        data = json.loads(_AGENT_CONFIG.read_text(encoding="utf-8"))
        return {"configured": configured, "agent": data}
    return {"configured": configured, "agent": {}}
