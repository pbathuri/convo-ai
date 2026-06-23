# BENCHMARK — competitor parity matrix

**Status:** LIVE — production URLs verified 2026-06-23  
**Frontend:** https://web-delta-three-73.vercel.app  
**Backend:** https://convo-ai-backend-lwwq.onrender.com

Legend: ✅ implemented & verified · 🟡 partial/degraded · ❌ not yet · — N/A for v1 scope

| Feature | Speak | ELSA | Praktika | Duolingo | Replika | Conversate |
|---------|-------|------|----------|----------|---------|------------|
| Real-time voice conversation | ✅ | ✅ | ✅ | — | ✅ | 🟡 D-ID embed + browser STT |
| Pronunciation / speech scoring | ✅ | ✅ | 🟡 | — | — | 🟡 Gemini + heuristic fallback |
| AI avatar / persona | — | — | ✅ | — | ✅ | ✅ D-ID live (Sarah Chen) |
| Role-play scenarios | ✅ | 🟡 | ✅ | — | ✅ | ✅ interview personas |
| Structured feedback report | ✅ | ✅ | ✅ | — | 🟡 | ✅ coaching + emotion radar |
| Skill progression / curriculum | ✅ | ✅ | ✅ | ✅ | 🟡 | 🟡 skill tree + backend sync |
| Gamification (XP/streaks) | ✅ | ✅ | ✅ | ✅ | 🟡 | 🟡 progress + backend XP API |
| Emotional intelligence radar | — | — | — | — | ✅ | ✅ Gemini via backend prompt |
| Multi-domain practice | 🟡 | — | 🟡 | ✅ | 🟡 | 🟡 8 legacy domains catalogued |
| User accounts + auth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Supabase SSR |
| Subscriptions / payments | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 pricing (Stripe skipped) |
| Mobile app | ✅ | ✅ | ✅ | ✅ | ✅ | — web-first v1 |
| Offline mode | — | 🟡 | — | 🟡 | — | — |
| CI/CD + tests | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ vitest + playwright + pytest |
| Observability | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Sentry + PostHog + health |
| GDPR / data retention | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 consent model in schema |
| Production deploy | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Vercel + Render |

## Quality gates

| Gate | Status |
|------|--------|
| `npm run verify` | ✅ |
| Playwright e2e | ✅ 7 tests |
| Backend pytest | ✅ 9 tests |
| GitHub Actions CI | ✅ web + e2e + backend |
| Live URL | ✅ https://web-delta-three-73.vercel.app |
| Backend API | ✅ https://convo-ai-backend-lwwq.onrender.com/health |

## Completion criteria

Stop when: (a) no new graph extension nodes, AND (b) all competitor rows ✅ or justified — N/A.
