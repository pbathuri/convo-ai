# Current MVP status

**Branch:** `commercial-v1`  
**Last updated:** 2026-05-22 (golden path reliability pass)  
**Active app:** `conversate/web`  
**Audit:** [industry-standard-rebuild-audit.md](../audits/industry-standard-rebuild-audit.md)

## Readiness

**Demo-ready when** [`demo-readiness-checklist.md`](./demo-readiness-checklist.md) passes in Chrome. **Not production-ready.**

## Golden path status

| Step | Status |
|------|--------|
| Landing / personas | Working |
| Session create (8s timeout, local fallback) | Working |
| D-ID live avatar | External (Chrome + allowlist) |
| Transcript-only fallback | Working |
| Speech finals + manual transcript | Working |
| End session | Working |
| Score (Gemini or heuristic) | Working (degraded without Gemini) |
| Feedback coaching report | Working |
| Sessions / progress | Working (demo labels when empty DB) |
| Admin mutations | Dev header only; production 401 |

## Classification

| Area | Status |
|------|--------|
| Sakura UI | Working |
| Session API + DB | Working |
| D-ID | Optional — transcript-only on failure |
| Speech capture | Working + status summary |
| Scoring | Degraded without Gemini quota |
| Vitest + verify | Working (`npm run verify`) |
| Admin sub-pages | Scaffold (labeled) |
| KB smoke | Working |

## Commands

```bash
cd conversate/web
npm run verify
npm run dev
```

## External dependencies

- D-ID Studio allowlist + embed client key  
- `GOOGLE_AI_STUDIO_KEY` for live Gemini scoring (optional)  
- `DATABASE_URL` for persisted sessions  
- Supabase (future) for production admin  

## PR to main

Do not open until demo-readiness checklist is complete. Expect large diff vs Streamlit-rooted `main`.
