# Acceptance Criteria — convo-ai ABE extended

**Session:** `abe_ext_20260609T121358Z`

## Functional

- [x] Prior L0 slices carried (KB tests, D-ID proxy, analytics seam, scaffold manifest)
- [ ] D-ID: proxy path documented; preflight uses local proxy when enabled; transcript-only CTA on failure
- [ ] Scoring: Gemini when keyed; heuristic fallback with reason-specific banner
- [ ] Admin scoring/kb/cost: show live env + metrics (no secrets)
- [ ] `npm run verify` green including expanded demo smoke
- [ ] `/api/health` returns non-secret service flags

## Cross-cutting DoD (scoped)

- [x] **UX:** loading/error on D-ID embed; degraded scoring banner
- [x] **Security:** keys in `.env` only; proxy route uses server auth header
- [x] **Testing:** vitest for scorer, demo routes, D-ID URL resolution
- [x] **Observability:** health route + admin env panel
- [x] **Reliability:** graceful degradation seams documented in `.env.example`
- [ ] **Demo:** manual Chrome items — **HUMAN REQUIRED**

## Demo (human-only)

See `Graph-research/Last Phase/final-completion/convo-ai-DEMO_CHECKLIST.md`
