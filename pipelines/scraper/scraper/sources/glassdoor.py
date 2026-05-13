from __future__ import annotations

import json
import random
import re
from typing import Any

import structlog
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from tenacity import retry, stop_after_attempt, wait_exponential_jitter

from scraper import manifest
from scraper.context import ScraperContext
from scraper.corpus import seeds_dir
from scraper.http_client import RetryingHttpClient
from scraper.rate_limit import PerHostRateLimiter
from scraper.robots import RobotsCache
from scraper.settings import per_host_delay_seconds
from scraper.sources.base import sha256_json, write_json

LOG = structlog.get_logger(__name__)
SOURCE = "glassdoor"
GD = "https://www.glassdoor.com"

# Glassdoor company interview page IDs (public HTML pages; may change over time).
SLUG_TO_COMPANY: dict[str, tuple[str, str]] = {
    "amazon": ("Amazon", "6036"),
    "google": ("Google", "9079"),
    "mckinsey": ("McKinsey-and-Company", "2970"),
    "goldmansachs": ("Goldman-Sachs", "280684"),
    "microsoft": ("Microsoft", "1651"),
}


def _slug_from_interview_url(url: str) -> str:
    for slug, (_name, gid) in SLUG_TO_COMPANY.items():
        if gid in url:
            return slug
    return "unknown"

USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0; rv:121.0) Gecko/20100101 Firefox/121.0",
]


def _load_slugs() -> list[str]:
    import yaml

    path = seeds_dir() / "companies.yaml"
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    return list(data.get("companies") or [])


def _interview_url(slug: str) -> str | None:
    pair = SLUG_TO_COMPANY.get(slug)
    if not pair:
        return None
    name, gid = pair
    return f"{GD}/Interview/{name}-Interview-Questions-E{gid}.htm"


@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential_jitter(initial=1, max=45),
    reraise=True,
)
def _goto(page: Any, url: str) -> None:
    page.goto(url, wait_until="domcontentloaded", timeout=120_000)


def _parse_questions(html: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    seen: set[str] = set()
    out: list[str] = []
    for tag in soup.find_all(["h2", "h3", "li", "p", "span"]):
        t = tag.get_text(" ", strip=True)
        if not t or len(t) < 15 or len(t) > 800:
            continue
        if "?" not in t and not re.search(r"\b(describe|tell me|how did|what was)\b", t, re.I):
            continue
        if t in seen:
            continue
        seen.add(t)
        out.append(t)
    return out[:500]


def _process_slug(
    ctx: ScraperContext,
    output_slug: str,
    limiter: PerHostRateLimiter,
    delay: float,
    robots: RobotsCache,
    *,
    url_override: str | None = None,
) -> None:
    log = ctx.log.bind(source=SOURCE, slug=output_slug)
    url = url_override or _interview_url(output_slug)
    if not url:
        log.warning("unknown_slug")
        return
    if manifest.is_ok(ctx.manifest_conn, SOURCE, url):
        log.info("skip_ok", url=url)
        return

    allowed, reason = robots.can_fetch(url, user_agent=random.choice(USER_AGENTS))
    if not allowed:
        log.warning("robots_blocked", url=url, reason=reason)
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

    limiter.wait(GD, delay)
    manifest.ensure_row(ctx.manifest_conn, SOURCE, url)
    ua = random.choice(USER_AGENTS)
    out_dir = ctx.corpus_root / "raw" / "glassdoor" / output_slug
    out_dir.mkdir(parents=True, exist_ok=True)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(user_agent=ua, locale="en-US")
            page = context.new_page()
            _goto(page, url)
            html = page.content()
            browser.close()
    except Exception as e:
        log.warning("glassdoor_fetch_failed", error=str(e))
        manifest.set_status(
            ctx.manifest_conn,
            SOURCE,
            url,
            "failed",
            error=str(e),
            bump_attempts=True,
        )
        return

    raw_path = out_dir / "raw.html"
    raw_path.write_text(html, encoding="utf-8")
    questions = _parse_questions(html)
    jl = out_dir / "questions.jsonl"
    with jl.open("w", encoding="utf-8") as f:
        for q in questions:
            f.write(json.dumps({"question": q}, ensure_ascii=False) + "\n")

    payload = {"questions": questions}
    rel = str(out_dir.relative_to(ctx.corpus_root))
    manifest.set_status(
        ctx.manifest_conn,
        SOURCE,
        url,
        "ok",
        output_path=rel,
        content_sha256=sha256_json(payload),
        bump_attempts=True,
    )
    log.info("glassdoor_saved", n_questions=len(questions), path=rel)


def run(ctx: ScraperContext, resume_urls: list[str] | None = None) -> None:
    cfg = ctx.yaml_config
    delay = per_host_delay_seconds(SOURCE, cfg)
    limiter = PerHostRateLimiter(delay)
    http = RetryingHttpClient()
    robots = RobotsCache(http=http)
    try:
        if resume_urls:
            for url in resume_urls:
                inferred = _slug_from_interview_url(url)
                out_slug = inferred if inferred != "unknown" else "resume"
                _process_slug(ctx, out_slug, limiter, delay, robots, url_override=url)
            return

        slugs = _load_slugs()
        lim = ctx.limit
        for i, slug in enumerate(slugs):
            if lim is not None and i >= lim:
                break
            _process_slug(ctx, slug, limiter, delay, robots)
    finally:
        robots.close()
        http.close()
