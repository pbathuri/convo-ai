from __future__ import annotations

import sqlite3
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import structlog

from scraper.settings import AppSettings


@dataclass
class ScraperContext:
    corpus_root: Path
    manifest_path: Path
    manifest_conn: sqlite3.Connection
    settings: AppSettings
    yaml_config: dict[str, Any]
    limit: int | None
    log: structlog.stdlib.BoundLogger
