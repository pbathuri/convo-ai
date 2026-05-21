from dataclasses import dataclass, field
from typing import Any


@dataclass
class KbChunkRecord:
    content: str
    persona_id: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)
    approval_status: str = "pending"
