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

## Browser SpeechRecognition transcript prototype test cases

Manual (`/chat?persona=amazon-l5-bar-raiser`):

1. D-ID connects; speech panel shows “Candidate-side capture only” and headphones warning.
2. Consent unchecked → Start capture disabled.
3. Consent + Start → interim text updates; final phrase appears after pause (never POST interim).
4. Final segment visible under “browser speech” in transcript panel.
5. With working DB: `user` message row created via messages API.
6. Unsupported browser: warning state, no crash, manual paste still works.
7. End session and score flow unchanged.

Build gate: `cd conversate/web && npm run build`
