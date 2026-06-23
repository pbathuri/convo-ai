import json
from pathlib import Path

from fastapi import APIRouter

router = APIRouter(prefix="/skill-tree", tags=["skill-tree"])

_DATA = (
    Path(__file__).resolve().parents[3]
    / "conversate"
    / "web"
    / "src"
    / "data"
    / "learning_progression.json"
)


@router.get("")
async def get_skill_tree() -> dict:
    if _DATA.exists():
        return {"tree": json.loads(_DATA.read_text(encoding="utf-8"))}
    return {"tree": {}}
