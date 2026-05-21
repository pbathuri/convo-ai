"""Strip instruction-like spans from KB chunks (prompt-injection defense)."""

import re

INSTRUCTION_PATTERNS = [
    re.compile(r"ignore\s+previous\s+instructions", re.I),
    re.compile(r"you\s+are\s+now", re.I),
    re.compile(r"system\s*:", re.I),
    re.compile(r"assistant\s*:", re.I),
]


def sanitize_chunk(text: str) -> tuple[str, bool]:
    suspicious = False
    out = text
    for pat in INSTRUCTION_PATTERNS:
        if pat.search(out):
            suspicious = True
            out = pat.sub("[REDACTED_INSTRUCTION]", out)
    return out, suspicious
