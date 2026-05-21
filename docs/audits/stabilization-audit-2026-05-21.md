# MVP stabilization audit — 2026-05-21

**Branch:** `commercial-v1`  
**Commit:** `8a722f6` (pre-pass baseline)  
**Active app:** `conversate/web`

## Command results

| Command | Result |
|---------|--------|
| `npm run build` | PASS |
| `npm run test` | PASS (20 tests, 9 files) |
| `npm run lint` | PASS |
| `npm run kb:smoke` | PASS |
| `npm run verify` | PASS |

## Component status

| Area | Status | Notes |
|------|--------|-------|
| D-ID live stream | Degraded | CORS in Cursor embedded browser; Chrome + allowlist required |
| Transcript-only fallback | Working | CTA + full interview loop without avatar |
| Session lifecycle | Working | 8s create timeout, 15s D-ID timeout, explicit phases |
| SpeechRecognition | Working | Candidate-side, finals-only POST, retry queue |
| Transcript dedupe | Working | 5s text window + id dedupe |
| Scoring (Gemini) | Degraded | 429/missing key → heuristic, HTTP 200 |
| Feedback report | Working | Degraded banner, coaching sections |
| Admin auth | Working (dev) | Production blocks `x-admin-email` |
| KB policy | Working | kb:smoke pass |
| Vitest | Working | persona, schema, scorer, policy, authz, persist |
| Biome lint | Fixed in pass | Single-file format drift |

## Smallest fix sequence

1. Align D-ID error copy to audit strings; fix Biome format on `DidAgentStage.tsx`.
2. Strict Mode session dedupe (reuse in-flight create per persona).
3. Transcript dedupe window 5s (was 3s).
4. Persist heuristic score on catch-path when DB available.
5. Refresh verification docs and health graph labels.

## Manual Chrome checklist

- [ ] `http://localhost:3000/` — Sakura landing
- [ ] `/personas` — five personas, Open chat links
- [ ] `/chat?persona=amazon-l5-bar-raiser` — session within 8s, no stuck preflight
- [ ] D-ID connects OR error panel with recovery bullets + transcript-only CTA
- [ ] Speech: consent, headphones warning, finals only (no interim POST)
- [ ] Manual transcript paste saves
- [ ] End session → `/sessions` → detail
- [ ] Generate score — useful report; degraded banner if no Gemini
- [ ] `/progress` — real data or demo banner
- [ ] `/admin` — no secret values in UI

## Demo-ready definition

Golden path completes in transcript-only mode without D-ID. `npm run verify` passes. Chrome checklist above is ticked.
