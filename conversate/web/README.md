# Conversate (web)

Next.js commercial MVP for interview practice. **Not production-ready** — optimized for one reliable golden path.

**Repository:** https://github.com/pbathuri/convo-ai  
**Branch:** `commercial-v1`

## Golden path

1. Landing → pick persona  
2. `/chat?persona=<id>` → session created (DB or local fallback in 8s)  
3. D-ID avatar **or** transcript-only mode if avatar fails / keys missing  
4. Browser speech (finals only) + manual transcript paste  
5. End session → `/sessions/[id]` → generate score  
6. Coaching report (Gemini or local heuristic fallback)  
7. Progress + admin overview  

## Modes

| Mode | When |
|------|------|
| **Live** | D-ID connects within 15s |
| **Transcript-only** | D-ID error, timeout, missing keys, or user clicks “Continue transcript-only interview” |
| **Degraded scoring** | Gemini quota/key unavailable — heuristic score, `degraded: true` |
| **Local session** | Session POST timeout — `local-*` id; persistence may be limited |

## Run locally

```bash
cd conversate/web && cp .env.example .env.local
# Fill keys (never commit .env.local), then:
npm install && npm run dev
```

Open **Chrome** at `http://localhost:3000` (not Cursor embedded preview for D-ID).

## Verification

```bash
npm run verify   # build + test + kb:smoke
npm run build
npm run test
npm run lint
```

## Env vars (names only)

- `DATABASE_URL` — Prisma / sessions  
- `NEXT_PUBLIC_DID_CLIENT_KEY`, `DID_PERSONA_*` — D-ID Studio embed  
- `GOOGLE_AI_STUDIO_KEY` — post-session scoring only  
- `ADMIN_EMAILS` — dev admin header (`x-admin-email`); production requires future Supabase auth  
- `UPSTASH_REDIS_*` — optional rate limits  

## Architecture

- **V1 live brain:** D-ID Studio Agents (no Gemini in `/api/chat`)  
- **Candidate transcript:** browser SpeechRecognition, finals-only POST  
- **Post-session score:** Gemini or [`local-heuristics.ts`](src/lib/scoring/local-heuristics.ts)  
- **Legacy Streamlit:** repo root `app/` — reference only  

See `docs/implementation/did-local-debugging.md`, `docs/implementation/demo-readiness-checklist.md`, `docs/implementation/current-mvp-status.md`.
