"""Shared helpers for corpus sources."""

from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Any

import orjson


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_json(obj: Any) -> str:
    return sha256_bytes(orjson.dumps(obj, option=orjson.OPT_SORT_KEYS))


def write_json(path: Path, obj: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(orjson.dumps(obj, option=orjson.OPT_INDENT_2))
