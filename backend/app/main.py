import sentry_sdk

from app.config import settings

if settings.sentry_dsn:
    sentry_sdk.init(dsn=settings.sentry_dsn, traces_sample_rate=0.1)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import domains, emotion, gamification, health, llm, memory, skill_tree, voice, voice_config

app = FastAPI(title=settings.app_name, version="0.1.0")

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(llm.router)
app.include_router(gamification.router)
app.include_router(emotion.router)
app.include_router(memory.router)
app.include_router(skill_tree.router)
app.include_router(domains.router)
app.include_router(voice.router)
app.include_router(voice_config.router)


@app.get("/")
async def root() -> dict:
    return {"service": settings.app_name, "docs": "/docs"}
