# Project Brief — convo-ai (ABE extended session)

**Session:** `abe_ext_20260609T121358Z`  
**Gate branch:** `commercial-v1` @ `dd7fe1c`  
**Agent branch:** `auto/20260609T121358Z`  
**Demo-ready definition:** Chrome pass on demo checklist + `npm run verify` green + no placeholder UI presented as production.

## Goal

Ship **professional, demo-ready** commercial MVP slices on convo-ai — real polish (loading/error/empty states, graceful API degradation, operator visibility), not scaffold copy.

## Succeeds if

A human can run the demo path in Chrome with either live D-ID **or** clean transcript-only fallback, generate useful coaching scores (Gemini or heuristic + banner), and review admin health without seeing secrets.

## User

Interview candidates practicing company-specific personas (Amazon L5 live embed first).

## Stack

Next.js 14 · Prisma/Postgres · D-ID embed · Gemini scoring · Upstash optional

## External APIs

| API | Key env | Seam if blocked |
|-----|---------|-----------------|
| D-ID | `NEXT_PUBLIC_DID_CLIENT_KEY`, `DID_PERSONA_*` | Transcript-only + local proxy |
| Gemini | `GOOGLE_AI_STUDIO_KEY` | Local heuristic + degraded banner |
| Postgres | `DATABASE_URL` | Demo mode without persistence |

## Non-goals (this session)

- Merge to `commercial-v1` (human gate)
- Admin mutation APIs / full RBAC
- D-ID LLM webhook override (V2)
- L1 PCE actuation

## Priority gaps (highest leverage)

1. D-ID proxy + preflight + transcript-only fallback UX
2. Scoring degraded banner clarity (quota/key/parse)
3. Admin sub-pages → operational status (not lorem scaffold)
4. Demo checklist CI + vitest coverage for demo path
5. Health endpoint + env panel for observability
