import datetime

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.gamification import (
    calculate_gold_coins,
    calculate_xp,
    check_streak,
    milestone_unlocked,
)

router = APIRouter(prefix="/gamification", tags=["gamification"])


class XpRequest(BaseModel):
    score: float = Field(ge=0, le=100)


class StreakRequest(BaseModel):
    last_date: datetime.date | None = None


class CoinsRequest(BaseModel):
    score: float = Field(ge=0, le=100)
    streak: int = Field(ge=0)


class MilestoneRequest(BaseModel):
    domain_progress: list[dict]


@router.post("/xp")
async def xp(body: XpRequest) -> dict:
    return {"xp": calculate_xp(body.score)}


@router.post("/streak")
async def streak(body: StreakRequest) -> dict:
    delta, continues = check_streak(body.last_date)
    return {"delta_days": delta, "streak_continues": continues}


@router.post("/coins")
async def coins(body: CoinsRequest) -> dict:
    return {"coins": calculate_gold_coins(body.score, body.streak)}


@router.post("/milestone")
async def milestone(body: MilestoneRequest) -> dict:
    return {"unlocked": milestone_unlocked(body.domain_progress)}
