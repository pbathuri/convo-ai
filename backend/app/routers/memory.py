from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.memory import get_memory_context, update_memory

router = APIRouter(prefix="/memory", tags=["memory"])


class MemoryTurn(BaseModel):
    user: str
    ai: str
    tone: str = ""
    score: float = 0
    feedback: str = ""


class MemoryUpdateRequest(BaseModel):
    memory: list[MemoryTurn] = Field(default_factory=list)
    user_input: str
    ai_response: str
    tone: str = ""
    score: float = 0
    feedback: str = ""


class MemoryContextRequest(BaseModel):
    memory: list[MemoryTurn]


@router.post("/update")
async def memory_update(body: MemoryUpdateRequest) -> dict:
    updated = update_memory(
        [t.model_dump() for t in body.memory],
        body.user_input,
        body.ai_response,
        body.tone,
        body.score,
        body.feedback,
    )
    return {"memory": updated}


@router.post("/context")
async def memory_context(body: MemoryContextRequest) -> dict:
    ctx = get_memory_context([t.model_dump() for t in body.memory])
    return {"context": ctx}
