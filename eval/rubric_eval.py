"""Rubric eval harness — JSON validity + optional SME agreement."""

import json
from pathlib import Path


def main() -> None:
    seed = Path("data/eval/session_eval_seed.jsonl")
    if not seed.exists():
        print("No seed file — create data/eval/session_eval_seed.jsonl")
        return
    valid = 0
    total = 0
    for line in seed.read_text().splitlines():
        if not line.strip():
            continue
        total += 1
        row = json.loads(line)
        if "SME_score" in row and "persona_id" in row:
            valid += 1
    print(f"Seed rows: {total}, valid schema: {valid}")


if __name__ == "__main__":
    main()
