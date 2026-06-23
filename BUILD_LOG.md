# BUILD_LOG — Convo AI production build

**Started:** 2026-06-16  
**Working copy:** `C:\Users\z4admin\Desktop\acquire\convo-ai`  
**Branch:** `auto/20260609T121358Z`  
**Baseline:** `npm run verify` green (42 vitest, build, kb:smoke, demo:checklist)

## Phase 1 defaults (no user checklist — adapters + NEEDS.md)

| Area | Default |
|------|---------|
| LLM | Google Gemini primary; OpenAI adapter |
| STT/TTS | Deepgram + ElevenLabs adapters (mock when unkeyed) |
| Auth | Supabase Auth adapter |
| DB | Supabase Postgres (existing Prisma) |
| Payments | Stripe freemium adapter |
| Deploy | Vercel (web) + Docker backend |
| Analytics | PostHog adapter |
| Errors | Sentry adapter |
| Product | Web-first, interview practice MVP, Conversate branding |

## Log

| When | Module | Done |
|------|--------|------|
| 2026-06-16 | Phase 0 | Repo audit; acquire copy selected; verify green |
| 2026-06-16 | Tracking | BUILD_LOG.md, NEEDS.md, BENCHMARK.md |
| 2026-06-16 | Backend | FastAPI scaffold + engine ports + pytest |
| 2026-06-16 | Infra | docker-compose, GitHub Actions CI |
| 2026-06-16 | Gamification | XP/streak on progress page; `/api/gamification/xp` proxy |
| 2026-06-16 | E2E | Playwright golden-path (7 tests) + CI job |
| 2026-06-16 | UI | EmotionRadar, SkillTreeMap, pricing page, settings |
| 2026-06-16 | Billing | Stripe checkout/webhook seams |
| 2026-06-16 | Security | Next.js middleware security headers |
| 2026-06-16 | Engines | Memory API, domains catalog, feedback emotion radar |
| 2026-06-16 | Supabase vtbkmccoarhfzgosahqa | URL updated, Prisma init migration, user profile sync on auth |
| 2026-06-17 | Database | Migrated + seeded on `aws-1-us-east-2` pooler; `ready: true` |
| 2026-06-17 | Auth fix | Email-confirm unblock; resend confirmation on login |
| 2026-06-17 | Deploy | Vercel prod https://web-delta-three-73.vercel.app — login verified |
| 2026-06-23 | Render | Backend https://convo-ai-backend-lwwq.onrender.com — connected to Vercel |
| 2026-06-23 | D-ID | ck_ client key + v2_agt_4pjSCal7 on Vercel; embed ready |
| 2026-06-23 | Emotion | Gemini analyzer via FastAPI prompt → `/api/emotion/analyze` + score flow |
| 2026-06-23 | Graph pipeline | skill-tree + memory proxies to Render backend |
| 2026-06-23 | Voice | Deepgram STT multipart on backend + `/api/voice/*` proxies |
| 2026-06-23 | Gamification | XP awarded on session score via backend `/gamification/xp` |
| 2026-06-23 | Domains | `/domains` browse page for legacy coaching modules |
| 2026-06-23 | Domains API | Backend `/domains` + business_communication prompt port |
