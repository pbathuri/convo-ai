from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.emotion import build_emotion_analysis_prompt

router = APIRouter(prefix="/emotion", tags=["emotion"])


class EmotionPromptRequest(BaseModel):
    user_input: str = Field(min_length=1, max_length=8000)
    goal: str = Field(min_length=1, max_length=500)


@router.post("/prompt")
async def emotion_prompt(body: EmotionPromptRequest) -> dict:
    return {"prompt": build_emotion_analysis_prompt(body.user_input, body.goal)}
