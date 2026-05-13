from __future__ import annotations

import csv
import json
import re
from pathlib import Path
from typing import Any

import structlog
import yaml
from bs4 import BeautifulSoup

from scraper import manifest
from scraper.context import ScraperContext
from scraper.corpus import seeds_dir
from scraper.http_client import RetryingHttpClient
from scraper.rate_limit import PerHostRateLimiter
from scraper.robots import RobotsCache
from scraper.settings import per_host_delay_seconds
from scraper.sources.base import sha256_json

LOG = structlog.get_logger(__name__)
SOURCE = "q_banks"
_UA = "Mozilla/5.0 (compatible; ConvoAiScraper/0.1; +https://github.com/pbathuri/convo-ai-demo)"


def _load_sources() -> list[dict[str, Any]]:
    path = seeds_dir() / "q_banks.yaml"
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    return list(data.get("sources") or [])


def _parse_interviewbit_questions(html: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    out: list[str] = []
    for tag in soup.find_all(["h2", "h3", "li", "p"]):
        t = tag.get_text(" ", strip=True)
        if len(t) < 20 or len(t) > 600:
            continue
        if "?" in t or re.search(
            r"\b(tell me|describe|how would|what is your|give an example)\b", t, re.I
        ):
            out.append(t)
    return list(dict.fromkeys(out))[:1000]


def _process_http_source(
    ctx: ScraperContext,
    entry: dict[str, Any],
    http: RetryingHttpClient,
    robots: RobotsCache,
    limiter: PerHostRateLimiter,
    delay: float,
) -> None:
    url = entry["url"]
    subdir = entry.get("output_subdir", "generic")
    log = ctx.log.bind(source=SOURCE, q_source=entry.get("id"))
    if manifest.is_ok(ctx.manifest_conn, SOURCE, url):
        log.info("skip_ok", url=url)
        return
    allowed, reason = robots.can_fetch(url, user_agent=_UA)
    if not allowed:
        manifest.ensure_row(ctx.manifest_conn, SOURCE, url)
        manifest.set_status(
            ctx.manifest_conn,
            SOURCE,
            url,
            "blocked",
            error=reason,
            bump_attempts=True,
        )
        return
    limiter.wait(url, delay)
    manifest.ensure_row(ctx.manifest_conn, SOURCE, url)
    try:
        r = http.get(url, headers={"User-Agent": _UA})
        r.raise_for_status()
        html = r.text
    except Exception as e:
        log.warning("fetch_failed", error=str(e))
        manifest.set_status(
            ctx.manifest_conn,
            SOURCE,
            url,
            "failed",
            error=str(e),
            bump_attempts=True,
        )
        return

    questions = _parse_interviewbit_questions(html)
    out_dir = ctx.corpus_root / "raw" / "q_banks" / subdir
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "questions.jsonl"
    with out_path.open("w", encoding="utf-8") as f:
        for q in questions:
            f.write(json.dumps({"question": q, "source_url": url}, ensure_ascii=False) + "\n")
    rel = str(out_path.relative_to(ctx.corpus_root))
    manifest.set_status(
        ctx.manifest_conn,
        SOURCE,
        url,
        "ok",
        output_path=rel,
        content_sha256=sha256_json({"n": len(questions)}),
        bump_attempts=True,
    )
    log.info("q_bank_saved", n=len(questions), path=rel)


def _process_csv_source(ctx: ScraperContext, entry: dict[str, Any]) -> None:
    rel_name = entry.get("path", "star_questions.csv")
    csv_path = seeds_dir() / rel_name
    url = f"file://{csv_path.resolve()}"
    subdir = entry.get("output_subdir", "star_csv")
    log = ctx.log.bind(source=SOURCE, q_source=entry.get("id"))
    if manifest.is_ok(ctx.manifest_conn, SOURCE, url):
        log.info("skip_ok", url=url)
        return
    manifest.ensure_row(ctx.manifest_conn, SOURCE, url)
    rows: list[dict[str, str]] = []
    with csv_path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(dict(row))
    out_dir = ctx.corpus_root / "raw" / "q_banks" / subdir
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "questions.jsonl"
    with out_path.open("w", encoding="utf-8") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    rel = str(out_path.relative_to(ctx.corpus_root))
    manifest.set_status(
        ctx.manifest_conn,
        SOURCE,
        url,
        "ok",
        output_path=rel,
        content_sha256=sha256_json({"n": len(rows)}),
        bump_attempts=True,
    )
    log.info("q_bank_csv_saved", n=len(rows), path=rel)


def run(ctx: ScraperContext, resume_urls: list[str] | None = None) -> None:
    cfg = ctx.yaml_config
    delay = per_host_delay_seconds(SOURCE, cfg)
    limiter = PerHostRateLimiter(delay)
    http = RetryingHttpClient(headers={"User-Agent": _UA})
    robots = RobotsCache(http=http)
    lim = ctx.limit
    try:
        if resume_urls:
            for url in resume_urls:
                if url.startswith("file://"):
                    _process_csv_source(
                        ctx,
                        {"id": "star_csv", "type": "csv", "output_subdir": "star_csv"},
                    )
                else:
                    _process_http_source(
                        ctx,
                        {"id": "resume", "url": url, "output_subdir": "interviewbit"},
                        http,
                        robots,
                        limiter,
                        delay,
                    )
            return

        n = 0
        for entry in _load_sources():
            if lim is not None and n >= lim:
                break
            typ = entry.get("type", "http")
            if typ == "csv":
                _process_csv_source(ctx, entry)
            else:
                _process_http_source(ctx, entry, http, robots, limiter, delay)
            n += 1
    finally:
        robots.close()
        http.close()
