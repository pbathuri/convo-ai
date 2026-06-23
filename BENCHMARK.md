# BENCHMARK — competitor parity matrix

**Status:** IN PROGRESS  
**Last updated:** 2026-06-16

Legend: ✅ implemented & verified · 🟡 partial/degraded · ❌ not yet · — N/A for v1 scope

| Feature | Speak | ELSA | Praktika | Duolingo | Replika | Conversate |
|---------|-------|------|----------|----------|---------|------------|
| Real-time voice conversation | ✅ | ✅ | ✅ | — | ✅ | 🟡 D-ID embed + browser STT |
| Pronunciation / speech scoring | ✅ | ✅ | 🟡 | — | — | 🟡 heuristic + Gemini |
| AI avatar / persona | — | — | ✅ | — | ✅ | 🟡 D-ID personas |
| Role-play scenarios | ✅ | 🟡 | ✅ | — | ✅ | ✅ interview personas |
| Structured feedback report | ✅ | ✅ | ✅ | — | 🟡 | ✅ coaching + emotion radar |
| Skill progression / curriculum | ✅ | ✅ | ✅ | ✅ | 🟡 | 🟡 skill tree on progress |
| Gamification (XP/streaks) | ✅ | ✅ | ✅ | ✅ | 🟡 | 🟡 progress page wired |
| Emotional intelligence radar | — | — | — | — | ✅ | 🟡 SVG radar + heuristic |
| Multi-domain practice | 🟡 | — | 🟡 | ✅ | 🟡 | 🟡 8 legacy domains catalogued |
| User accounts + auth | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 Supabase adapter seam |
| Subscriptions / payments | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 pricing + Stripe seams |
| Mobile app | ✅ | ✅ | ✅ | ✅ | ✅ | — web-first v1 |
| Offline mode | — | 🟡 | — | 🟡 | — | — |
| CI/CD + tests | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 vitest + playwright + pytest |
| Observability | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 health + Sentry/PostHog seams |
| GDPR / data retention | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 consent model in schema |
| Production deploy | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 Docker + Vercel/Railway config |

## Quality gates

| Gate | Status |
|------|--------|
| `npm run verify` | ✅ 52 tests |
| Playwright e2e | ✅ 7 tests |
| Backend pytest | ✅ 9 tests |
| GitHub Actions CI | ✅ web + e2e + backend |
| Biome lint | ✅ (skipped in build) |
| Typecheck | ✅ |
| Docker build | 🟡 Dockerfile ready |
| Live URL | ❌ needs deploy + keys |

## Completion criteria

Stop when: (a) no new graph extension nodes, AND (b) all competitor rows ✅ or justified — N/A.
