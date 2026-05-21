# Test strategy

## Layers

| Layer | Tool | Targets |
|-------|------|---------|
| Unit | Vitest | persona schema, scoring schema, KB policy, sanitize |
| Service | Vitest + Prisma | session lifecycle, transcript append |
| API | Vitest | sessions CRUD, score route, admin 403 |
| E2E | Playwright | /chat smoke, greeting events |
| Eval | `eval/` | rubric validity, retrieval recall@k |
| Pipeline | pytest | adapter RawDocument contract |

## Fixtures

- `data/fixtures/` — persona, session, transcript, score, KB chunk
- `data/eval/fixtures/malicious_kb_chunks.jsonl` — prompt injection tests

## CI gates

PR: lint + unit + API smoke. Nightly: Playwright + retrieval benchmark.
