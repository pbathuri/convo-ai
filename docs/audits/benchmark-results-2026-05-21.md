# Benchmark results — 2026-05-21

**Git:** `3edbb0c` on `commercial-v1`  
**Server:** `npm run start` → `http://localhost:3000` (production build)  
**Auditor:** automated + Cursor embedded browser (not real Chrome)

## Automated (B01–B10)

| ID | Command / probe | Result | Evidence |
|----|-----------------|--------|----------|
| B01 | `npm run build` | **PASS** | exit 0; 25 routes compiled |
| B02 | `npm run lint` | **FAIL** | exit 1; 68 format errors, 5 warnings, 1 unused `personaId` in score route |
| B03 | `npm run kb:smoke` | **PASS** | exit 0; governance + injection wrap OK |
| B04 | `GET /api/health` | **PASS** | HTTP 200 `{"ok":true,"service":"conversate-web"}` |
| B05 | `GET /api/personas` | **PASS** | HTTP 200; 5 personas with agent IDs |
| B06 | `POST /api/sessions` | **PASS** | HTTP 201; real DB id `cmpfjbrig00015xxmlgwq0gv9` |
| B07 | `POST .../messages` | **PASS** | HTTP 200 `{"appended":1}` |
| B08 | `POST .../score` | **PASS (degraded)** | HTTP 200; `degraded: true`; stub rationale (Gemini quota) |
| B09 | `POST /api/kb/chunks/import` (no admin) | **PASS** | HTTP 403 Forbidden |
| B10 | `prisma.session.count()` | **PASS** | DATABASE_URL set; count = 15 |
| B11 | `import pipelines.kb.policy` | **PASS** | Python import OK |
| B12 | `import pipelines.kb.sanitize` | **PASS** | Python import OK |

### Lint detail (B02)

- Primary issue: Biome format drift across admin pages, API routes, layout (not logic bugs).
- One correctness warning: unused `personaId` in `score/route.ts` (incomplete refactor).

### Scoring detail (B08)

Response included `degraded: true` and dimension rationale: *"Live scoring unavailable (quota or API error) — showing coaching stub."*

## Manual browser (M01–M09)

Environment: Cursor embedded browser @ `http://localhost:3000`.

| ID | Flow | Result | Notes |
|----|------|--------|-------|
| M01 | `/` Sakura hero | **PASS** | "Your company interview room", nav links |
| M02 | `/personas` five cards | **PASS** | 5 personas, Open chat links, env keys shown |
| M03 | `/chat?persona=amazon-l5-bar-raiser` | **PASS** | `POST /api/sessions` 201; speech panel visible after load |
| M04 | D-ID stream | **FAIL (env)** | `Stream: error` / Failed to fetch; console CORS on `api.d-id.com/agents/...` |
| M05 | Speech capture panel | **PASS** | "Candidate-side capture only", consent checkbox, Start capture |
| M06 | Finals-only POST | **NOT VERIFIED** | Mic/Web Speech unavailable in embedded browser; contract enforced in code |
| M07 | Session detail | **PASS** | `/sessions/cmpfjbrig00015xxmlgwq0gv9` shows transcript |
| M08 | Score + feedback | **PASS** | Coaching report rendered (from B08 API run) |
| M09 | `/progress`, `/admin` | **PASS** | Progress metrics (2 sessions); admin cards (5 personas, 16 sessions, 317ms latency) |

### D-ID network evidence (M04)

```
OPTIONS https://api.d-id.com/agents/v2_agt_4pjSCal7 → 200
GET     https://api.d-id.com/agents/v2_agt_4pjSCal7 → blocked (no CORS ACAO)
Console: Access to fetch ... blocked by CORS policy
```

**Interpretation:** Keys appear configured (agent fetch attempted). Failure is browser-origin CORS in embedded preview, not missing env. Real Chrome with D-ID Studio allowlist may pass — not run in this audit.

## Gaps vs test-strategy.md

| Planned layer | Status |
|---------------|--------|
| Vitest unit/service/API | **Not implemented** (no test script in package.json) |
| Playwright E2E | **Not implemented** |
| pytest scraper | **Not run** (imports OK only) |

## Terminal observations (dev history)

Prior `npm run dev` logs showed intermittent `prisma:error ... connection Closed` — not reproduced during B10 (count succeeded).
