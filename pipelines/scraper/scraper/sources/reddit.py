from __future__ import annotations

import json
from collections import defaultdict
from typing import Any
from typing import Any

import structlog
import yaml

from scraper import manifest
from scraper.context import ScraperContext
from scraper.corpus import seeds_dir
from scraper.rate_limit import PerHostRateLimiter
from scraper.settings import AppSettings, per_host_delay_seconds
from scraper.sources.base import sha256_json

LOG = structlog.get_logger(__name__)
SOURCE = "reddit"
KEYWORDS = ("interview", "behavioral", "question", "star")


def _title_matches(title: str) -> bool:
    t = title.lower()
    return any(k in t for k in KEYWORDS)


def _load_config() -> dict[str, Any]:
    path = seeds_dir() / "reddit.yaml"
    with path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def _write_posts(
    ctx: ScraperContext,
    subreddit: str,
    posts: list[dict[str, Any]],
    limiter: PerHostRateLimiter,
    delay: float,
) -> None:
    log = ctx.log.bind(source=SOURCE, subreddit=subreddit)
    out_dir = ctx.corpus_root / "raw" / "reddit" / subreddit
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "posts.jsonl"
    lines = [json.dumps(p, ensure_ascii=False) for p in posts]
    out_path.write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")
    payload = {"posts": posts}
    rel = str(out_path.relative_to(ctx.corpus_root))
    batch_url = f"https://reddit.local/r/{subreddit}/batch/latest"
    if manifest.is_ok(ctx.manifest_conn, SOURCE, batch_url):
        log.info("skip_ok", url=batch_url)
        return
    limiter.wait(batch_url, delay)
    manifest.ensure_row(ctx.manifest_conn, SOURCE, batch_url)
    manifest.set_status(
        ctx.manifest_conn,
        SOURCE,
        batch_url,
        "ok",
        output_path=rel,
        content_sha256=sha256_json(payload),
        bump_attempts=True,
    )
    log.info("reddit_saved", n=len(posts), path=rel)


def _from_praw(ctx: ScraperContext, settings: AppSettings, subs: list[str], limit: int | None) -> None:
    import praw

    cfg = ctx.yaml_config
    delay = per_host_delay_seconds(SOURCE, cfg)
    limiter = PerHostRateLimiter(delay)
    reddit = praw.Reddit(
        client_id=settings.reddit_client_id,
        client_secret=settings.reddit_client_secret,
        user_agent=settings.reddit_user_agent,
    )
    cap = limit if limit is not None else 25
    collected: list[tuple[str, dict[str, Any]]] = []
    for sub in subs:
        if len(collected) >= cap:
            break
        subreddit = reddit.subreddit(sub)
        for submission in subreddit.new(limit=100):
            if len(collected) >= cap:
                break
            if not _title_matches(submission.title):
                continue
            collected.append(
                (
                    sub,
                    {
                        "id": submission.id,
                        "title": submission.title,
                        "subreddit": sub,
                        "selftext": (submission.selftext or "")[:8000],
                        "url": submission.url,
                        "created_utc": submission.created_utc,
                    },
                )
            )
    by_sub: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for sub, post in collected:
        by_sub[sub].append(post)
    for sub, posts in by_sub.items():
        if posts:
            _write_posts(ctx, sub, posts, limiter, delay)


def _from_fixture(ctx: ScraperContext, subs: list[str], limit: int | None) -> None:
    cfg = ctx.yaml_config
    delay = per_host_delay_seconds(SOURCE, cfg)
    limiter = PerHostRateLimiter(delay)
    path = seeds_dir() / "reddit_fixture.jsonl"
    cap = limit if limit is not None else 25
    picked: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            if len(picked) >= cap:
                break
            line = line.strip()
            if not line:
                continue
            obj = json.loads(line)
            sub = obj.get("subreddit", "")
            if sub not in subs:
                continue
            if not _title_matches(obj.get("title", "")):
                continue
            picked.append(obj)
    by_sub: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for obj in picked:
        by_sub[str(obj["subreddit"])].append(obj)
    for sub, posts in by_sub.items():
        if posts:
            _write_posts(ctx, sub, posts, limiter, delay)


def run(ctx: ScraperContext, resume_urls: list[str] | None = None) -> None:
    cfg_yaml = _load_config()
    subs = list(
        cfg_yaml.get("subreddits")
        or ["cscareerquestions", "consulting", "financialcareers"]
    )
    settings = ctx.settings
    if resume_urls:
        if settings.reddit_client_id and settings.reddit_client_secret:
            _from_praw(ctx, settings, subs, ctx.limit)
        else:
            _from_fixture(ctx, subs, ctx.limit)
        return

    if settings.reddit_client_id and settings.reddit_client_secret:
        _from_praw(ctx, settings, subs, ctx.limit)
    else:
        LOG.info("reddit_using_fixture", reason="missing Reddit API credentials")
        _from_fixture(ctx, subs, ctx.limit)
