# Current MVP status

**Branch:** `commercial-v1`  
**Last updated:** 2026-05-21  
**Active app:** `conversate/web`

## Classification

| Area | Status | Notes |
|------|--------|-------|
| Speech capture (final-only POST) | **A — Working** | `SpeechTranscriptCapture`, `browser-speech.ts` |
| Session API (create, messages, PATCH) | **A — Working** | Prisma when `DATABASE_URL` set; `local-*` fallback |
| Prisma schema | **A — Working** | Sessions, messages, scores, KB governance fields |
| Scoring stub (no Gemini key) | **A — Working** | `scorer.ts` returns stub |
| Admin RBAC primitive | **A — Working** | `requireAdmin` + `x-admin-email` |
| Chat layout / interview room | **B — Partial** | Functional; Sakura polish in progress |
| Sessions detail / feedback | **B — Partial** | Score 500 on Gemini 429; strengths not shown |
| D-ID live stream | **B — Partial** | Works in Chrome; CORS in embedded browsers |
| Home / personas / progress | **C — Scaffold** | Minimal pages before Sakura pass |
| Sakura design system | **E — Missing** | Phase 1 |
| Progress metrics | **E — Missing** | Phase 5 |
| Duplicate session POST (Strict Mode) | **D — Risky** | Phase 3 fix |
| Readiness hydration warning | **D — Risky** | Phase 3 fix |
| KB governance end-to-end | **D — Risky** | Phase 7 hardening |

## MVP loop (20 criteria)

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Beautiful Sakura landing | In progress (Phase 2) |
| 2 | Five company personas | Working (data); UI polish Phase 2 |
| 3 | `/chat?persona=<id>` | Working |
| 4 | Session created | Working (duplicate POST fix Phase 3) |
| 5 | D-ID connects | Needs Chrome + D-ID keys |
| 6 | Speech UI (labels, headphones) | Working |
| 7 | Candidate speaks | Manual verify (mic + Web Speech) |
| 8 | Interim local only | Working (code) |
| 9 | Finals POST to messages | Working |
| 10 | Manual transcript fallback | Working |
| 11 | End session | Working |
| 12 | Session history | Working |
| 13 | Session detail | Working |
| 14 | Generate score | Partial (429 → stub fallback Phase 4) |
| 15 | Feedback report (5 questions) | Partial (Phase 4) |
| 16 | Progress signals | Phase 5 |
| 17 | Admin shell | Scaffold; hardening Phase 6 |
| 18 | Build passes | Yes |
| 19 | No secrets committed | Yes |
| 20 | D-ID brain unchanged | Yes |

## Known blockers

1. **D-ID CORS** — Direct `api.d-id.com` fetch from browser may fail in some environments; verify in Chrome with `NEXT_PUBLIC_DID_CLIENT_KEY` and `DID_PERSONA_*`.
2. **Supabase P1000** — Invalid pooler credentials block migrate; app degrades to `local-*` sessions.
3. **Gemini 429** — Free-tier quota exhausted; scoring should use stub fallback after Phase 4.

## Manual browser checklist

Use **Chrome** (not embedded IDE browser):

- [ ] `/` — Sakura hero, persona previews, CTA
- [ ] `/personas` — five cards, Open chat links
- [ ] `/chat?persona=amazon-l5-bar-raiser` — D-ID stream connects
- [ ] Speech: consent → Start → interim → final → one POST per final
- [ ] End session → `/sessions/[id]` — transcript visible
- [ ] Generate score — report or degraded stub
- [ ] `/progress` — metrics or demo label
- [ ] `/admin` — overview loads
- [ ] `/api/health`, `/api/personas`, `/api/redis/ping`

## Next 5 commits (planned)

1. `chore: document current MVP status`
2. `feat: add Sakura interview-room design foundation`
3. `feat: polish Sakura landing and persona selection`
4. `feat: polish interview room and transcript capture flow`
5. `feat: strengthen session history and feedback report`

## Architecture (locked)

- **Live interview brain:** D-ID Studio Agents (no Gemini in `/api/chat` or `/api/opening`).
- **Candidate transcript:** Browser SpeechRecognition → finals only → `POST /api/sessions/:id/messages`.
- **Post-session scoring:** Gemini `gemini-2.0-flash` or stub when key/quota unavailable.
