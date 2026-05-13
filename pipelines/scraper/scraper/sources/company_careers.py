from __future__ import annotations

import re
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse

import structlog
import yaml
from bs4 import BeautifulSoup
from selectolax.parser import HTMLParser

from scraper import manifest
from scraper.context import ScraperContext
from scraper.corpus import seeds_dir
from scraper.http_client import RetryingHttpClient
from scraper.rate_limit import PerHostRateLimiter
from scraper.robots import RobotsCache
from scraper.settings import per_host_delay_seconds
from scraper.sources.base import sha256_json, write_json

LOG = structlog.get_logger(__name__)
SOURCE = "company_careers"
_DEFAULT_UA = (
    "Mozilla/5.0 (compatible; ConvoAiScraper/0.1; +https://github.com/pbathuri/convo-ai-demo)"
)


def _slug_from_url(url: str) -> str:
    path = urlparse(url).path.strip("/").replace("/", "_") or "index"
    return re.sub(r"[^a-zA-Z0-9_.-]+", "_", path)[:120]


def _extract_main_text(html: str) -> str:
    tree = HTMLParser(html)
    node = tree.css_first("main") or tree.css_first("article") or tree.body
    if node is None:
        soup = BeautifulSoup(html, "html.parser")
        m = soup.find("main") or soup.find("article") or soup.find("body")
        return m.get_text("\n", strip=True) if m else ""
    return node.text(separator="\n", strip=True)


def _same_host(base: str, candidate: str) -> bool:
    return urlparse(base).netloc.lower() == urlparse(candidate).netloc.lower()


def _load_yaml() -> list[dict[str, Any]]:
    path = seeds_dir() / "company_careers.yaml"
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    return list(data.get("companies") or [])


def _fetch_and_store(
    ctx: ScraperContext,
    company_id: str,
    url: str,
    http: RetryingHttpClient,
    robots: RobotsCache,
    limiter: PerHostRateLimiter,
    delay: float,
    log: Any,
) -> list[str]:
    """Fetch one page; return same-host links found (1-hop candidates)."""
    if manifest.is_ok(ctx.manifest_conn, SOURCE, url):
        log.info("skip_ok", url=url)
        return []
    allowed, reason = robots.can_fetch(url, user_agent=_DEFAULT_UA)
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
        return []

    limiter.wait(url, delay)
    manifest.ensure_row(ctx.manifest_conn, SOURCE, url)
    try:
        resp = http.get(url, headers={"User-Agent": _DEFAULT_UA})
        resp.raise_for_status()
        html = resp.text
    except Exception as e:
        log.warning("fetch_failed", url=url, error=str(e))
        manifest.set_status(
            ctx.manifest_conn,
            SOURCE,
            url,
            "failed",
            http_status=getattr(getattr(e, "response", None), "status_code", None),
            error=str(e),
            bump_attempts=True,
        )
        return []

    page_slug = _slug_from_url(url)
    out_dir = ctx.corpus_root / "raw" / "company_careers" / company_id
    out_dir.mkdir(parents=True, exist_ok=True)
    html_path = out_dir / f"{page_slug}.html"
    html_path.write_text(html, encoding="utf-8")
    text = _extract_main_text(html)
    soup = BeautifulSoup(html, "html.parser")
    title_el = soup.title
    title = title_el.get_text(strip=True) if title_el else None
    extracted = {
        "url": url,
        "company_id": company_id,
        "title": title,
        "text": text[:200_000],
    }
    write_json(out_dir / f"{page_slug}.extracted.json", extracted)
    rel = str(out_dir.relative_to(ctx.corpus_root))
    manifest.set_status(
        ctx.manifest_conn,
        SOURCE,
        url,
        "ok",
        output_path=rel,
        content_sha256=sha256_json({"text": text[:50_000]}),
        bump_attempts=True,
    )
    log.info("careers_saved", url=url, path=rel)

    links: list[str] = []
    for a in soup.find_all("a", href=True):
        href = str(a["href"]).strip()
        if href.startswith("#") or href.startswith("javascript:"):
            continue
        abs_url = urljoin(url, href)
        if abs_url.startswith("http") and _same_host(url, abs_url):
            links.append(abs_url.split("#")[0])
    return list(dict.fromkeys(links))


def run(ctx: ScraperContext, resume_urls: list[str] | None = None) -> None:
    cfg = ctx.yaml_config
    delay = per_host_delay_seconds(SOURCE, cfg)
    limiter = PerHostRateLimiter(delay)
    http = RetryingHttpClient(headers={"User-Agent": _DEFAULT_UA})
    robots = RobotsCache(http=http)
    log = ctx.log.bind(source=SOURCE)
    lim = ctx.limit

    try:
        if resume_urls:
            for url in resume_urls:
                company_id = "resume"
                for co in _load_yaml():
                    for su in co.get("seeds") or []:
                        if su == url:
                            company_id = co.get("id", "unknown")
                            break
                _fetch_and_store(ctx, company_id, url, http, robots, limiter, delay, log)
            return

        pages_done = 0
        for co in _load_yaml():
            if lim is not None and pages_done >= lim:
                break
            cid = str(co.get("id", "unknown"))
            seeds = list(co.get("seeds") or [])
            discovered: list[str] = []
            for seed in seeds:
                if lim is not None and pages_done >= lim:
                    break
                if manifest.is_ok(ctx.manifest_conn, SOURCE, seed):
                    log.info("skip_ok", url=seed)
                    continue
                links = _fetch_and_store(ctx, cid, seed, http, robots, limiter, delay, log)
                pages_done += 1
                discovered.extend(links)

            # 1-hop: follow first unique same-host links not yet ok, until limit
            for link in discovered[:40]:
                if lim is not None and pages_done >= lim:
                    break
                if link in seeds:
                    continue
                if manifest.is_ok(ctx.manifest_conn, SOURCE, link):
                    continue
                _fetch_and_store(ctx, cid, link, http, robots, limiter, delay, log)
                pages_done += 1
    finally:
        robots.close()
        http.close()
