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

```bash
cd conversate/web
npm run test      # Vitest: persona schema, KB policy, admin authz, speech persist, scoring
npm run verify    # build + test + kb:smoke
npm run lint
```

PR: lint + `npm run verify`. Playwright golden path: manual Chrome checklist until E2E is added.

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

KB safety gate: `cd conversate/web && npm run kb:smoke`

## Sakura MVP browser checklist

| Route | Check |
|-------|-------|
| `/` | Hero, explainer steps, persona preview cards |
| `/personas` | Five cards, company accent, Open chat |
| `/chat?persona=amazon-l5-bar-raiser` | Interview room panel, D-ID, speech capture |
| `/sessions` | List with message count + score badge |
| `/sessions/[id]` | Transcript, Generate score, feedback report |
| `/progress` | Sessions completed, avg score, next drill |
| `/admin` | Metric cards (no secrets) |
| `/api/health` | 200 |
| `/api/personas` | Five personas JSON |
