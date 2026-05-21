from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


@dataclass
class RawDocument:
    source_url: str
    source_type: str
    capture_method: str
    content_text: str
    title: str | None = None
    content_markdown: str | None = None
    content_html: str | None = None
    fetched_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    language: str = "en"
    robots_status: str = "not_checked"
    license_status: str = "unknown"
    pii_status: str = "not_checked"
    http_status: int | None = None
    errors: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


class BaseAdapter(ABC):
    @abstractmethod
    def fetch(self, url: str, **opts: Any) -> RawDocument:
        raise NotImplementedError
