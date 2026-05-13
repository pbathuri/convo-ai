from __future__ import annotations

import logging
import sys
from pathlib import Path
from typing import Any

import httpx
import structlog
from tenacity import retry, retry_if_exception, stop_after_attempt, wait_exponential_jitter

RETRYABLE = (
    httpx.TimeoutException,
    httpx.ConnectError,
    httpx.RemoteProtocolError,
)


def _retryable(exc: BaseException) -> bool:
    if isinstance(exc, RETRYABLE):
        return True
    if isinstance(exc, httpx.HTTPStatusError):
        return exc.response.status_code in (429, 500, 502, 503, 504)
    return False


class RetryingHttpClient:
    """httpx client wrapper with tenacity (5 attempts, exponential backoff + jitter)."""

    def __init__(self, headers: dict[str, str] | None = None, timeout: float = 60.0) -> None:
        self._client = httpx.Client(
            headers=headers or {},
            timeout=timeout,
            follow_redirects=True,
        )

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> RetryingHttpClient:
        return self

    def __exit__(self, *args: Any) -> None:
        self.close()

    @retry(
        stop=stop_after_attempt(5),
        wait=wait_exponential_jitter(initial=1, max=60),
        retry=retry_if_exception(_retryable),
        reraise=True,
    )
    def request(self, method: str, url: str, **kwargs: Any) -> httpx.Response:
        resp = self._client.request(method, url, **kwargs)
        if resp.status_code in (429, 500, 502, 503, 504):
            resp.raise_for_status()
        return resp

    def get(self, url: str, **kwargs: Any) -> httpx.Response:
        return self.request("GET", url, **kwargs)

    def head(self, url: str, **kwargs: Any) -> httpx.Response:
        return self.request("HEAD", url, **kwargs)


class CaptionRetryingHttpClient(RetryingHttpClient):
    """Timedtext fetches: short retries per URL (signatures expire quickly)."""

    @retry(
        stop=stop_after_attempt(4),
        wait=wait_exponential_jitter(initial=1, max=8),
        retry=retry_if_exception(_retryable),
        reraise=True,
    )
    def request(self, method: str, url: str, **kwargs: Any) -> httpx.Response:
        resp = self._client.request(method, url, **kwargs)
        if resp.status_code in (429, 500, 502, 503, 504):
            resp.raise_for_status()
        return resp
