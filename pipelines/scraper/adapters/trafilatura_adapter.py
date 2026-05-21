"""Static HTML text extraction via Trafilatura (optional dependency)."""

from __future__ import annotations

import json
import sys

from pipelines.scraper.adapters.base_adapter import BaseAdapter, RawDocument


class TrafilaturaAdapter(BaseAdapter):
    capture_method = "trafilatura"

    def fetch(self, url: str, **opts) -> RawDocument:
        try:
            import trafilatura
        except ImportError:
            return RawDocument(
                source_url=url,
                source_type=opts.get("source_type", "public_guides"),
                capture_method=self.capture_method,
                content_text="",
                errors=["trafilatura not installed"],
            )
        downloaded = trafilatura.fetch_url(url)
        text = trafilatura.extract(downloaded) or ""
        return RawDocument(
            source_url=url,
            source_type=opts.get("source_type", "public_guides"),
            capture_method=self.capture_method,
            content_text=text,
            license_status="tos_allowed",
        )


if __name__ == "__main__":
    url = sys.argv[-1] if len(sys.argv) > 1 else "https://example.com"
    doc = TrafilaturaAdapter().fetch(url)
    print(json.dumps(doc.__dict__, indent=2))
