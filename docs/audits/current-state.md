# Current state audit — Conversate investor pilot

**Branch:** `commercial-v1`  
**Active app:** `conversate/web` (Next.js 14)

## What works today

- 5 company personas in `src/lib/personas.ts` with D-ID agent env keys
- `/chat` session room with D-ID `DidAgentStage` (SDK owns reasoning/speech)
- Phased D-ID latency analytics (`did_*` events → `/api/analytics/event`)
- Persona docs mirror under `conversate/web/docs/personas/`

## Gaps (pre-pilot)

| Area | Status |
|------|--------|
| Postgres sessions/transcripts/scores | Schema + APIs scaffolded; needs `DATABASE_URL` |
| Gemini scoring | Active with stub fallback when key missing |
| KB pipeline | Python modules + import API with governance |
| Admin console | Shell routes; mutations gated by `requireAdmin()` |
| HPC / WRDS | Offline scaffolding only |
| Alpha / billing | Docs only |

## Legacy (do not extend)

- Streamlit app under `app/`, `components/`, `streamlit/` — concept archive only

## D-ID architecture (V1)

- **Live path:** D-ID Agents SDK in browser
- **Dormant:** `src/lib/llm.ts`, `/api/chat`, `/api/opening` — reserved for post-session scoring (now active via `/api/sessions/[id]/score`)
