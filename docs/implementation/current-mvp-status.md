# Current MVP status

**Branch:** `commercial-v1`  
**Last updated:** 2026-05-21 (post Sakura MVP pass)  
**Active app:** `conversate/web`

## Classification (post-implementation)

| Area | Status |
|------|--------|
| Sakura design system | **A — Working** |
| Landing + personas | **A — Working** |
| Speech capture (final-only POST) | **A — Working** |
| Session API + history | **A — Working** |
| Scoring + stub fallback | **A — Working** (429 → degraded stub) |
| Progress page | **A — Working** (demo when no DB/scores) |
| Admin overview + RBAC | **A — Working** |
| KB governance + smoke | **A — Working** (`npm run kb:smoke`) |
| D-ID live stream | **B — Partial** (Chrome + keys; CORS in embedded browsers) |

## MVP loop checklist

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Sakura landing | Pass |
| 2 | Five personas + portraits | Pass |
| 3 | `/chat?persona=<id>` | Pass |
| 4 | Session created (single POST) | Pass (Strict Mode guard) |
| 5 | D-ID connects | Verify in Chrome |
| 6 | Speech UI labels | Pass |
| 7–10 | Speak / interim / finals / manual | Verify in Chrome |
| 11 | End session | Pass |
| 12–13 | Sessions list + detail | Pass |
| 14 | Generate score | Pass (stub if no key/quota) |
| 15 | Feedback (5 coaching questions) | Pass |
| 16 | Progress | Pass |
| 17 | Admin | Pass |
| 18 | Build | Pass |
| 19 | No secrets committed | Pass |

## Commits (this pass)

| Phase | Commit message |
|-------|----------------|
| 0 | `chore: document current MVP status` |
| 1 | `feat: add Sakura interview-room design foundation` |
| 2 | `feat: polish Sakura landing and persona selection` |
| 3 | `feat: polish interview room and transcript capture flow` |
| 4 | `feat: strengthen session history and feedback report` |
| 5 | `feat: add progress and next-drill MVP` |
| 6 | `fix: harden admin access and governance surfaces` |
| 7 | `fix: verify KB governance and RAG safety` |
| 8 | `chore: document MVP verification status` |

## External keys

- `NEXT_PUBLIC_DID_CLIENT_KEY` + `DID_PERSONA_*` — live interview
- `DATABASE_URL` / `DIRECT_URL` — sessions, messages, scores
- `GOOGLE_AI_STUDIO_KEY` — live Gemini scoring (optional; stub on failure)
- `ADMIN_EMAILS` + `x-admin-email` — KB import mutations

## Next 5 engineering tasks

1. Proxy D-ID agent metadata through a Next API route if CORS blocks browser fetch.
2. Add Vitest unit tests for `validateKbImport`, `scoreTranscript` stub path, session create guard.
3. Persist `metadata.source` on messages when Prisma JSON column is approved.
4. Wire `CandidateSkillSnapshot` updates after each scored session.
5. Playwright smoke for `/chat` speech panel + `/sessions/[id]` score button.

## Manual browser checklist

Use **Chrome** at `http://localhost:3000`:

- [ ] `/` — Sakura hero, five persona cards
- [ ] `/personas` — company accents, Open chat
- [ ] `/chat?persona=amazon-l5-bar-raiser` — D-ID + speech capture
- [ ] `/sessions` — message counts, score badges
- [ ] `/sessions/[id]` — transcript + Generate score
- [ ] `/progress` — metrics or demo banner
- [ ] `/admin` — metric cards
- [ ] `/api/health`, `/api/personas`
