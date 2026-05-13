from __future__ import annotations

import json
import random
import time
from pathlib import Path
from typing import Any, Literal

import structlog
import yaml
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound, TranscriptsDisabled, VideoUnavailable

from scraper import manifest
from scraper.context import ScraperContext
from scraper.corpus import seeds_dir
from scraper.http_client import CaptionRetryingHttpClient
from scraper.rate_limit import PerHostRateLimiter
from scraper.settings import per_host_delay_seconds
from scraper.sources.base import sha256_json, write_json

LOG = structlog.get_logger(__name__)
SOURCE = "youtube"
YT_HOST = "https://www.youtube.com"


def _load_channels() -> list[dict[str, Any]]:
    path = seeds_dir() / "youtube_channels.yaml"
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    return list(data.get("channels") or [])


def _filter_title(title: str, filters: list[str] | None) -> bool:
    if not filters:
        return True
    t = title.lower()
    return any(kw.lower() in t for kw in filters)


def _enumerate_videos(channel_url: str, title_filters: list[str] | None) -> list[dict[str, Any]]:
    opts: dict[str, Any] = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": "in_playlist",
        "skip_download": True,
        "ignoreerrors": True,
    }
    out: list[dict[str, Any]] = []
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(channel_url, download=False, process=False)
        if not info:
            return out
        entries = info.get("entries") or []
        for e in entries:
            if not e or not isinstance(e, dict):
                continue
            vid = e.get("id")
            title = e.get("title") or ""
            if not vid:
                continue
            if not _filter_title(title, title_filters):
                continue
            url = f"https://www.youtube.com/watch?v={vid}"
            out.append({"id": vid, "title": title, "url": url})
    return out


def _parse_youtube_json3_events(raw: bytes) -> list[dict[str, Any]]:
    d = json.loads(raw.decode("utf-8"))
    segments: list[dict[str, Any]] = []
    for ev in d.get("events") or []:
        segs = ev.get("segs")
        if not segs:
            continue
        t0 = (ev.get("tStartMs") or 0) / 1000.0
        text = "".join((seg.get("utf8") or "") for seg in segs).strip()
        if not text:
            continue
        dur_ms = ev.get("dDurationMs") or ev.get("dMs") or 0
        dur = max(float(dur_ms) / 1000.0, 0.05)
        segments.append({"text": text, "start": t0, "duration": dur})
    return segments


def _parse_webvtt(text: str) -> list[dict[str, Any]]:
    segments: list[dict[str, Any]] = []
    buf: list[str] = []
    t0 = 0.0
    for line in text.splitlines():
        line = line.strip()
        if "-->" in line:
            parts = line.split("-->")[0].strip()
            try:
                h, m, s = parts.replace(".", ":").split(":")
                if len(h.split(":")) == 1:
                    t0 = int(parts.split(":")[0]) * 60 + float(parts.split(":")[1])
                else:
                    # 00:00:01.000
                    h, m, rest = parts.split(":")
                    t0 = int(h) * 3600 + int(m) * 60 + float(rest)
            except Exception:
                t0 = 0.0
            buf = []
        elif line and not line.startswith("WEBVTT") and not line.startswith("NOTE"):
            buf.append(line)
        elif not line and buf:
            text_join = " ".join(buf).strip()
            if text_join:
                segments.append({"text": text_join, "start": t0, "duration": 1.0})
            buf = []
    if buf:
        text_join = " ".join(buf).strip()
        if text_join:
            segments.append({"text": text_join, "start": t0, "duration": 1.0})
    return segments


def _video_detail(url: str) -> dict[str, Any] | None:
    opts: dict[str, Any] = {"quiet": True, "no_warnings": True, "skip_download": True}
    with yt_dlp.YoutubeDL(opts) as ydl:
        try:
            return ydl.extract_info(url, download=False)
        except Exception as e:
            LOG.warning("yt_dlp_detail_failed", url=url, error=str(e))
            return None


def _pick_caption_track(detail: dict[str, Any]) -> tuple[str | None, str | None]:
    caps = detail.get("automatic_captions") or detail.get("subtitles") or {}
    if not caps:
        return None, None
    langs = [k for k in caps if str(k).startswith("en")] or list(caps.keys())
    track_url: str | None = None
    ext: str | None = None
    for lang in langs:
        for tr in caps.get(lang) or []:
            if not isinstance(tr, dict):
                continue
            e = tr.get("ext")
            u = tr.get("url")
            if not u:
                continue
            if e == "json3":
                track_url, ext = u, e
                break
            if e in ("srv1", "srv3", "vtt") and track_url is None:
                track_url, ext = u, e
        if track_url and ext == "json3":
            break
    return track_url, ext


def _transcript_from_ytdlp_captions(watch_url: str, detail: dict[str, Any], log: Any) -> list[dict[str, Any]] | None:
    """Pull captions via timedtext URLs from yt-dlp metadata; refresh metadata when URLs expire (429)."""
    ua = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }
    client = CaptionRetryingHttpClient(headers=ua, timeout=90.0)
    try:
        current = detail
        for round_i in range(6):
            track_url, ext = _pick_caption_track(current)
            if not track_url or not ext:
                return None
            try:
                resp = client.get(track_url)
                resp.raise_for_status()
                raw = resp.content
                if ext == "json3" or raw.strip().startswith(b"{"):
                    segs = _parse_youtube_json3_events(raw)
                    return segs or None
                if ext == "vtt" or b"WEBVTT" in raw[:20].upper():
                    return _parse_webvtt(raw.decode("utf-8", errors="replace")) or None
                log.warning("caption_unknown_format", ext=ext)
                return None
            except Exception as e:
                log.warning(
                    "caption_fetch_failed_round",
                    round=round_i,
                    error=str(e),
                )
                time.sleep(2.0 + round_i * 2.0)
                refreshed = _video_detail(watch_url)
                if refreshed:
                    current = refreshed
        return None
    finally:
        client.close()


def _fetch_transcript(
    watch_url: str,
    vid: str,
    detail: dict[str, Any],
    log: Any,
) -> tuple[list[dict[str, Any]] | None, str | None]:
    api_err: str | None = None
    try:
        return YouTubeTranscriptApi.get_transcript(vid), "youtube_transcript_api"
    except (TranscriptsDisabled, NoTranscriptFound, VideoUnavailable):
        pass
    except Exception as e:
        api_err = str(e)
        log.info("youtube_transcript_api_fallback", video_id=vid, error=api_err)
    if api_err and "429" in api_err:
        time.sleep(random.uniform(8.0, 18.0))
    cap = _transcript_from_ytdlp_captions(watch_url, detail, log)
    if cap:
        return cap, "yt_dlp_captions"
    return None, None


def _process_url(
    ctx: ScraperContext,
    url: str,
    limiter: PerHostRateLimiter,
    delay: float,
    raw_root: Path,
    log: Any,
) -> Literal["ok", "skipped", "failed", "skip_ok"]:
    if manifest.is_ok(ctx.manifest_conn, SOURCE, url):
        log.info("skip_ok", url=url)
        return "skip_ok"
    limiter.wait(YT_HOST, delay)
    manifest.ensure_row(ctx.manifest_conn, SOURCE, url)

    vid = url.split("watch?v=")[-1][:11] if "watch?v=" in url else url[-11:]
    detail = _video_detail(url)
    if not detail:
        manifest.set_status(
            ctx.manifest_conn,
            SOURCE,
            url,
            "failed",
            error="yt_dlp_extract_failed",
            bump_attempts=True,
        )
        return "failed"

    channel_id = detail.get("channel_id") or detail.get("uploader_id") or "unknown_channel"
    channel_id = str(channel_id).replace("/", "_")

    tr, tr_src = _fetch_transcript(url, vid, detail, log)
    if not tr:
        manifest.set_status(
            ctx.manifest_conn,
            SOURCE,
            url,
            "skipped",
            error="no_transcript:api_and_captions",
            bump_attempts=True,
        )
        return "skipped"

    out_dir = raw_root / channel_id / vid
    metadata = {
        "title": detail.get("title"),
        "description": detail.get("description"),
        "channel": detail.get("channel") or detail.get("uploader"),
        "channel_id": detail.get("channel_id"),
        "view_count": detail.get("view_count"),
        "upload_date": detail.get("upload_date"),
        "webpage_url": detail.get("webpage_url") or url,
    }
    transcript_obj = {
        "video_id": vid,
        "language": "auto",
        "segments": tr,
        "transcript_source": tr_src,
    }
    write_json(out_dir / "metadata.json", metadata)
    write_json(out_dir / "transcript.json", transcript_obj)
    write_json(out_dir / "info.json", detail)

    rel = str(out_dir.relative_to(ctx.corpus_root))
    h = sha256_json(transcript_obj)
    manifest.set_status(
        ctx.manifest_conn,
        SOURCE,
        url,
        "ok",
        output_path=rel,
        content_sha256=h,
        bump_attempts=True,
    )
    log.info("youtube_saved", video_id=vid, path=rel, title=detail.get("title"))
    return "ok"


def run(ctx: ScraperContext, resume_urls: list[str] | None = None) -> None:
    cfg = ctx.yaml_config
    delay = per_host_delay_seconds(SOURCE, cfg)
    limiter = PerHostRateLimiter(delay)
    raw_root: Path = ctx.corpus_root / "raw" / "youtube"
    log = ctx.log.bind(source=SOURCE)
    lim = ctx.limit

    saved_ok = 0
    probe_budget = (lim * 80) if lim is not None else 10**9
    probes = 0

    if resume_urls:
        for url in resume_urls:
            if lim is not None and saved_ok >= lim:
                break
            r = _process_url(ctx, url, limiter, delay, raw_root, log)
            if r == "ok":
                saved_ok += 1
        return

    for ch in _load_channels():
        if lim is not None and saved_ok >= lim:
            break
        url = ch.get("url")
        if not url:
            log.warning("channel_missing_url", channel=ch.get("name"))
            continue
        tf = ch.get("title_keyword_filters")
        if isinstance(tf, str):
            tf = [tf]
        if not isinstance(tf, list):
            tf = None
        limiter.wait(YT_HOST, delay)
        vids = _enumerate_videos(url, tf)
        log.info("channel_enumerated", channel=ch.get("name"), n=len(vids))
        for v in vids:
            if lim is not None and saved_ok >= lim:
                break
            if probes >= probe_budget:
                log.warning("youtube_probe_budget_exhausted", probes=probes)
                break
            vurl = v["url"]
            if manifest.is_ok(ctx.manifest_conn, SOURCE, vurl):
                log.info("skip_ok", url=vurl)
                continue
            probes += 1
            r = _process_url(ctx, vurl, limiter, delay, raw_root, log)
            if r == "ok":
                saved_ok += 1
            elif lim is not None and r in ("skipped", "failed"):
                limiter.wait(YT_HOST, max(delay, 12.0))
