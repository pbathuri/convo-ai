from __future__ import annotations

import threading
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

from scraper.http_client import RetryingHttpClient

_DEFAULT_UA = (
    "Mozilla/5.0 (compatible; ConvoAiScraper/0.1; +https://github.com/pbathuri/convo-ai-demo; "
    "polite research bot)"
)


class RobotsCache:
    def __init__(self, http: RetryingHttpClient | None = None) -> None:
        self._http = http or RetryingHttpClient(headers={"User-Agent": _DEFAULT_UA})
        self._own_client = http is None
        self._parsers: dict[str, RobotFileParser] = {}
        self._lock = threading.Lock()

    def close(self) -> None:
        if self._own_client:
            self._http.close()

    def can_fetch(self, url: str, user_agent: str | None = None) -> tuple[bool, str]:
        """Return (allowed, reason)."""
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False, "non-http(s) URL"
        host = parsed.netloc
        if not host:
            return False, "missing host"
        ua = user_agent or _DEFAULT_UA
        base = f"{parsed.scheme}://{host}"
        robots_url = f"{base}/robots.txt"
        key = host.lower()
        with self._lock:
            if key not in self._parsers:
                rp = RobotFileParser()
                try:
                    resp = self._http.get(robots_url)
                    if resp.status_code == 404:
                        rp.parse(["User-agent: *", "Allow: /"])
                    else:
                        resp.raise_for_status()
                        rp.parse(resp.text.splitlines())
                except Exception as e:
                    return False, f"robots_fetch_failed: {e}"
                self._parsers[key] = rp
            rp = self._parsers[key]
        try:
            ok = rp.can_fetch(ua, url)
        except Exception as e:
            return False, f"robots_can_fetch_error: {e}"
        if not ok:
            return False, "disallowed_by_robots_txt"
        return True, "ok"
