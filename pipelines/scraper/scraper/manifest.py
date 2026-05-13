from __future__ import annotations

import hashlib
import sqlite3
import time
from pathlib import Path
from typing import Any, Literal

FetchStatus = Literal["queued", "ok", "failed", "skipped", "blocked"]


def url_hash(url: str) -> str:
    return hashlib.sha256(url.strip().encode("utf-8")).hexdigest()


def iso_now() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def connect(db_path: Path) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    return conn


def init_schema(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS fetches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            url TEXT NOT NULL,
            url_hash TEXT NOT NULL,
            status TEXT NOT NULL,
            last_attempt_at TEXT,
            attempts INTEGER NOT NULL DEFAULT 0,
            http_status INTEGER,
            output_path TEXT,
            error TEXT,
            content_sha256 TEXT,
            UNIQUE(source, url_hash)
        )
        """
    )
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_fetches_status ON fetches (source, status)"
    )
    conn.commit()


def is_ok(conn: sqlite3.Connection, source: str, url: str) -> bool:
    uh = url_hash(url)
    row = conn.execute(
        "SELECT status FROM fetches WHERE source = ? AND url_hash = ?",
        (source, uh),
    ).fetchone()
    return row is not None and row["status"] == "ok"


def ensure_row(conn: sqlite3.Connection, source: str, url: str) -> None:
    uh = url_hash(url)
    conn.execute(
        """
        INSERT OR IGNORE INTO fetches (
            source, url, url_hash, status, last_attempt_at, attempts
        ) VALUES (?, ?, ?, 'queued', ?, 0)
        """,
        (source, url, uh, iso_now()),
    )
    conn.commit()


def set_status(
    conn: sqlite3.Connection,
    source: str,
    url: str,
    status: FetchStatus,
    *,
    http_status: int | None = None,
    output_path: str | None = None,
    error: str | None = None,
    content_sha256: str | None = None,
    bump_attempts: bool = True,
) -> None:
    uh = url_hash(url)
    now = iso_now()
    row = conn.execute(
        "SELECT attempts FROM fetches WHERE source = ? AND url_hash = ?",
        (source, uh),
    ).fetchone()
    prev_attempts = int(row["attempts"]) if row else 0
    if row is None:
        attempts = 1 if bump_attempts else 0
    else:
        attempts = prev_attempts + 1 if bump_attempts else prev_attempts

    conn.execute(
        """
        INSERT INTO fetches (
            source, url, url_hash, status, last_attempt_at, attempts,
            http_status, output_path, error, content_sha256
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(source, url_hash) DO UPDATE SET
            status = excluded.status,
            last_attempt_at = excluded.last_attempt_at,
            attempts = excluded.attempts,
            http_status = COALESCE(excluded.http_status, fetches.http_status),
            output_path = COALESCE(excluded.output_path, fetches.output_path),
            error = excluded.error,
            content_sha256 = COALESCE(excluded.content_sha256, fetches.content_sha256)
        """,
        (
            source,
            url,
            uh,
            status,
            now,
            attempts,
            http_status,
            output_path,
            error,
            content_sha256,
        ),
    )
    conn.commit()


def status_counts(conn: sqlite3.Connection) -> list[dict[str, Any]]:
    cur = conn.execute(
        "SELECT source, status, COUNT(*) AS n FROM fetches GROUP BY source, status ORDER BY source, status"
    )
    return [dict(r) for r in cur.fetchall()]


def rows_to_resume(conn: sqlite3.Connection, limit: int | None) -> list[sqlite3.Row]:
    q = """
        SELECT * FROM fetches
        WHERE status IN ('failed', 'queued')
        ORDER BY COALESCE(last_attempt_at, '') ASC, id ASC
    """
    if limit is not None:
        q += " LIMIT ?"
        return list(conn.execute(q, (int(limit),)).fetchall())
    return list(conn.execute(q).fetchall())
