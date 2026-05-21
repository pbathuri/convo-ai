# Latency budgets (MVP)

| Stage | Budget | Fallback |
|-------|--------|----------|
| Session POST | 8s | `local-*` session ID |
| D-ID connect | 15s | Transcript-only mode |
| First video frame | 15s (with connect) | Transcript-only |
| Speech capture ready | 3s (consent + mic) | Manual transcript |
| Score API | 30s | Heuristic if Gemini fails |

Telemetry: `session_lifecycle` and `did_*` events via `/api/analytics/event`.
