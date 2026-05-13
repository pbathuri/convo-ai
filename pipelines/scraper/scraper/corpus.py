from __future__ import annotations

import os
from pathlib import Path

from scraper.settings import AppSettings


class CorpusError(RuntimeError):
    pass


def resolve_corpus_root(settings: AppSettings | None = None) -> Path:
    s = settings or AppSettings()
    return Path(s.corpus_root).expanduser().resolve()


def ensure_corpus_writable(root: Path) -> None:
    """Fail fast if corpus root is missing or not writable (drive not mounted)."""
    if not root.exists():
        raise CorpusError(
            f"CORPUS_ROOT does not exist: {root}\n"
            "Mount the external volume (e.g. /Volumes/My Passport) and ensure "
            "Convo-Ai exists, or set CORPUS_ROOT in pipelines/scraper/.env."
        )
    if not root.is_dir():
        raise CorpusError(f"CORPUS_ROOT is not a directory: {root}")
    if not os.access(root, os.W_OK):
        raise CorpusError(f"CORPUS_ROOT is not writable: {root}")


def corpus_subdirs(root: Path) -> dict[str, Path]:
    return {
        "raw_youtube": root / "raw" / "youtube",
        "raw_glassdoor": root / "raw" / "glassdoor",
        "raw_company_careers": root / "raw" / "company_careers",
        "raw_q_banks": root / "raw" / "q_banks",
        "raw_reddit": root / "raw" / "reddit",
        "logs_scraper": root / "logs" / "scraper",
    }


def mkdirs_all(root: Path) -> None:
    for p in corpus_subdirs(root).values():
        p.mkdir(parents=True, exist_ok=True)


def manifest_path(root: Path) -> Path:
    return root / "manifest.sqlite"


def seeds_dir() -> Path:
    return Path(__file__).resolve().parent.parent / "seeds"
