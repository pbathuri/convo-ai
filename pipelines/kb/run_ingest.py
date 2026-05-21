"""KB ingest entrypoint — dry-run writes JSONL."""

import argparse
import json
from pathlib import Path

from pipelines.kb.policy import is_allowed_source
from pipelines.kb.sanitize import sanitize_chunk


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--input", type=Path, required=True)
    args = parser.parse_args()
    lines = args.input.read_text().splitlines()
    out = []
    for line in lines:
        row = json.loads(line)
        ok, reason = is_allowed_source(
            row.get("source_type", ""),
            row.get("license_status"),
        )
        if not ok:
            continue
        content, _ = sanitize_chunk(row.get("content", ""))
        out.append({**row, "content": content})
    if args.dry_run:
        Path("data/kb_dry_run.jsonl").write_text(
            "\n".join(json.dumps(r) for r in out)
        )
        print(f"Wrote {len(out)} chunks to data/kb_dry_run.jsonl")


if __name__ == "__main__":
    main()
