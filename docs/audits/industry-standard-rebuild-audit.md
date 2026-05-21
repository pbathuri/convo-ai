# Industry-standard rebuild audit

**Branch:** `commercial-v1`  
**Commit:** `16fc678` (pre-rebuild baseline) → golden-path pass on `commercial-v1`  
**Active app:** `conversate/web`  
**Date:** 2026-05-22

## Preflight (measured)

| Command | Result |
|---------|--------|
| `npm run build` | Pass |
| `npm run test` | Pass (13 tests, 6 files) |
| `npm run kb:smoke` | Pass |
| `npm run lint` | Pass |
| `npm run verify` | Pass (build + test + kb:smoke) |

## Route inventory

See [no-scaffold-execution-map.md](./no-scaffold-execution-map.md). Summary:

| Class | Routes |
|-------|--------|
| **Real** | `/`, `/personas`, `/chat`, `/sessions`, `/sessions/[id]`, `/progress`, `/admin` (overview + personas + sessions), `/settings`, `/analytics` |
| **Scaffold** | `/admin/kb`, `/admin/scoring`, `/admin/cost`, `/admin/scraper-runs`, `/admin/audit-log` |
| **Dormant API** | `/api/chat`, `/api/opening` |
| **Missing** | `/api/admin/*` |

## API inventory (golden path)

| Endpoint | Role |
|----------|------|
| `POST /api/sessions` | Create session |
| `PATCH /api/sessions/[id]` | End session |
| `POST /api/sessions/[id]/messages` | Persist finals + manual |
| `POST /api/sessions/[id]/score` | Gemini or heuristic |
| `GET /api/sessions`, `GET /api/sessions/[id]` | History |
| `POST /api/kb/chunks/import` | Admin-gated mutation |
| `POST /api/analytics/event` | Client telemetry |

## Component health

| Component | Status | Issue |
|-----------|--------|-------|
| Landing / personas | Working | — |
| Session API | Working | Local fallback IDs may not persist to DB |
| DidAgentStage | Degraded | CORS in embedded browser; **blocks perceived MVP** without transcript-only |
| SpeechTranscriptCapture | Degraded | Retry queue exists; no aggregate status summary |
| Scoring | Degraded | Heuristic fallback exists; Gemini 429 external |
| FeedbackReport | Degraded | Coaching sections incomplete |
| Sessions / progress | Working | Demo labels when empty |
| Admin authz | Working (dev) | Production needs Supabase |
| Vitest | Working | No Playwright |
| KB policy | Working | kb:smoke pass |

## Latency hypotheses

| Stage | Budget (target) | Measurement |
|-------|-----------------|-------------|
| Session POST | 8s | Client timeout → local fallback |
| D-ID SDK import + connect | 15s | `trackDidEvent` + connect timeout |
| First video frame | 15s | `did_video_play_complete` |
| Speech capture ready | 3s | UI consent + `getUserMedia` |
| Score API | 30s | Server `score/route` duration |

## Golden path failure map

| Step | Failure mode | Recovery (rebuild) |
|------|--------------|-------------------|
| D-ID connect | CORS / wrong key / embedded browser | Transcript-only CTA |
| Session create | DB slow / offline | 8s → `local-*` session |
| Speech POST | Network error | Retry queue + unsaved label |
| Score | Gemini 429 / missing key | Heuristic + `degraded: true` |
| Score | Empty transcript | 400 helpful message |
| Strict Mode | Double POST risk | In-flight abort per persona |

## Top 10 fixes (strict order)

1. Transcript-only mode when D-ID fails (P0 product)
2. Unified interview phase machine + 8s/15s timeouts
3. Session lifecycle telemetry
4. Transcript status summary (saved / unsaved / manual)
5. Feedback coaching report (exemplar rewrite, sparse warning)
6. Honest README + MVP status docs
7. `npm run verify` script
8. Enrich persona-specific heuristic scoring
9. Scaffold banners on admin sub-pages
10. Demo-readiness checklist + health graph refresh

## Demo-ready definition

The MVP is **demo-ready** when:

1. Golden path completes without D-ID (transcript-only).
2. Golden path completes with D-ID when allowlist + keys OK (Chrome).
3. `npm run verify` passes.
4. Scoring never returns 500 for expected Gemini failures.
5. User-visible success, failure, and fallback for session, avatar, transcript, and score.
6. README states Conversate vs legacy Streamlit; no false production-ready claims.
7. Chrome checklist in `docs/implementation/demo-readiness-checklist.md` is complete.

## PR gate

Do not open `commercial-v1` → `main` until demo-ready definition is satisfied and migration notes are in README.
