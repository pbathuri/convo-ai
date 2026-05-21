# Current MVP status

**Branch:** `commercial-v1`  
**Last updated:** 2026-05-21 (hard repo audit — measured)  
**Active app:** `conversate/web`  
**Audit artifacts:** [repo-health-graph.md](../audits/repo-health-graph.md), [benchmark-results-2026-05-21.md](../audits/benchmark-results-2026-05-21.md)

## Classification (measured 2026-05-21)

| Area | Status | Evidence |
|------|--------|----------|
| Sakura design system | **A — Working** | M01 build B01 |
| Landing + personas | **A — Working** | M01, M02, B05 |
| Session API + DB | **A — Working** | B06, B10 (15 sessions) |
| Speech capture UI | **A — Working** | M05; finals POST B07 |
| Scoring + feedback | **B — Degraded** | B08 `degraded: true` (Gemini 429 stub) |
| Progress page | **A — Working** | M09 |
| Admin overview + personas table | **A — Working** | M09 |
| Admin sub-pages (kb, scoring, cost) | **C — Shell** | Placeholder copy only |
| KB governance + smoke | **A — Working** | B03, B09 |
| D-ID live stream | **D — Broken (embedded)** | M04 CORS; keys configured |
| Automated tests (Vitest/Playwright) | **D — Missing** | No test script in package.json |
| Biome lint | **B — Degraded** | B02 fail (format drift) |

## MVP loop checklist (audit run)

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Sakura landing | Pass (M01) |
| 2 | Five personas + portraits | Pass (M02, B05) |
| 3 | `/chat?persona=<id>` | Pass (M03) |
| 4 | Session created | Pass (POST 201, B06) |
| 5 | D-ID connects | **Fail in embedded browser** (M04 CORS); verify real Chrome + allowlist |
| 6 | Speech UI labels | Pass (M05) |
| 7–10 | Speak / interim / finals / manual | **Not verified** in embedded browser (M06) |
| 11 | End session | Pass (API PATCH; UI present) |
| 12–13 | Sessions list + detail | Pass (M07) |
| 14 | Generate score | Pass degraded (B08 stub) |
| 15 | Feedback report | Pass (M08) |
| 16 | Progress | Pass (M09) |
| 17 | Admin metrics | Pass (M09) |
| 18 | Build | Pass (B01) |
| 19 | No secrets committed | Pass (audit scope) |

## Broken / degraded — exact fixes

| Component | Health | Fix |
|-----------|--------|-----|
| **DidAgentStage** | Broken (embedded) | D-ID Studio allowlist `http://localhost:3000`; test Chrome; optional API proxy |
| **scorer.ts / Gemini** | Degraded | Google AI Studio quota; stub already works |
| **Test harness** | Broken | Add Vitest + Playwright per test-strategy.md |
| **Biome lint** | Degraded | `npm run format`; remove unused `personaId` in score route |

## External keys (observed)

| Variable | Audit observation |
|----------|-------------------|
| `NEXT_PUBLIC_DID_CLIENT_KEY` + `DID_PERSONA_*` | Set; agent fetch attempted |
| `DATABASE_URL` | Working (Prisma count OK) |
| `GOOGLE_AI_STUDIO_KEY` | Present; quota → stub scoring |
| `ADMIN_EMAILS` + `x-admin-email` | 403 without header (OK) |
| `UPSTASH_REDIS_*` | PONG on ping |

## Graph memory

- **JSON:** `docs/audits/repo-health-graph.json`
- **MCP:** unavailable — see `docs/audits/mcp-graph-sync.md`

## Next engineering tasks (from audit)

1. Fix D-ID CORS for local dev (allowlist or server proxy).
2. Restore Gemini quota or document stub-only demos.
3. Add Vitest (policy, scorer stub, session) + Playwright `/chat` smoke.
4. Run `npm run format` to clear B02.
5. Flesh out admin KB/scoring/cost pages or mark explicitly out-of-scope.

## Manual browser checklist

Use **Chrome** at `http://localhost:3000` (confirm port; production audit used `npm run start`):

- [ ] `/` — Sakura hero, five persona cards
- [ ] `/personas` — company accents, Open chat
- [ ] `/chat?persona=amazon-l5-bar-raiser` — D-ID connects (not just embedded preview)
- [ ] Speech finals POST visible in Network tab
- [ ] `/sessions` — message counts, score badges
- [ ] `/sessions/[id]` — transcript + Generate score
- [ ] `/progress` — metrics
- [ ] `/admin` — metric cards
- [ ] `/api/health`, `/api/personas`

Automated gates: `npm run build`, `npm run kb:smoke`
