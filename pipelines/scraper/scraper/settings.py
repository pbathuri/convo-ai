from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    corpus_root: str = Field(
        default="/Volumes/My Passport/Convo-Ai",
        validation_alias="CORPUS_ROOT",
    )
    log_level: str = Field(default="INFO", validation_alias="LOG_LEVEL")
    reddit_client_id: str | None = Field(default=None, validation_alias="REDDIT_CLIENT_ID")
    reddit_client_secret: str | None = Field(default=None, validation_alias="REDDIT_CLIENT_SECRET")
    reddit_user_agent: str = Field(
        default="convo-ai-scraper/0.1",
        validation_alias="REDDIT_USER_AGENT",
    )


def load_config_yaml(path: Path | None = None) -> dict[str, Any]:
    base = path or Path(__file__).resolve().parent.parent / "config.yaml"
    if not base.exists():
        return {"per_host_seconds": 5, "sources": {}}
    with base.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def per_host_delay_seconds(source: str, config: dict[str, Any]) -> float:
    sources = config.get("sources") or {}
    src = sources.get(source) or {}
    return float(src.get("per_host_seconds", config.get("per_host_seconds", 5)))
