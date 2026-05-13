from __future__ import annotations

import threading
import time
from urllib.parse import urlparse


class PerHostRateLimiter:
    """Enforce minimum interval between requests to the same host."""

    def __init__(self, default_interval_sec: float) -> None:
        self.default_interval = default_interval_sec
        self._last: dict[str, float] = {}
        self._lock = threading.Lock()

    def host_from_url(self, url: str) -> str:
        p = urlparse(url)
        return p.netloc.lower() or "unknown"

    def wait(self, url: str, interval_sec: float | None = None) -> None:
        host = self.host_from_url(url)
        interval = interval_sec if interval_sec is not None else self.default_interval
        with self._lock:
            now = time.monotonic()
            last = self._last.get(host, 0.0)
            elapsed = now - last
            if elapsed < interval:
                time.sleep(interval - elapsed)
            self._last[host] = time.monotonic()
