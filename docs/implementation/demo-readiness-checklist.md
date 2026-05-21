# Demo-readiness checklist (Chrome)

Run `cd conversate/web && npm run verify` first.

Base URL: `http://localhost:3000`

- [ ] `/` — landing loads, persona cards visible
- [ ] `/personas` — five personas, links to chat
- [ ] `/chat?persona=amazon-l5-bar-raiser` — session creates within 8s (no infinite “Creating session…”)
- [ ] D-ID connects OR error panel + **Continue transcript-only interview** works
- [ ] Transcript-only: speech capture + manual paste + end session
- [ ] `/sessions` — completed session listed
- [ ] `/sessions/[id]` — transcript visible, generate score
- [ ] Score without Gemini — degraded banner, useful coaching report
- [ ] `/progress` — real data or labeled demo banner
- [ ] `/admin` — metrics, no secret values displayed

## PR gate

All checks above + `npm run verify` pass before opening `commercial-v1` → `main`.
