# Voice pipeline (Deepgram STT)

## Architecture

```
Browser (MediaRecorder or Web Speech API)
  → POST /api/voice/transcribe (Vercel)
  → POST /voice/transcribe (Render FastAPI)
  → Deepgram nova-2
```

When browser speech recognition is unsupported, the interview room shows **Deepgram fallback (server STT)** — record up to 30s and transcribe via the backend.

## Env vars

| Where | Key |
|-------|-----|
| Render | `DEEPGRAM_API_KEY` |
| Vercel | `BACKEND_API_URL` |

## Verify

```powershell
# Production health (backend + deepgram)
Invoke-RestMethod https://web-delta-three-73.vercel.app/api/health

# Agent config for future real-time voice UI
Invoke-RestMethod https://web-delta-three-73.vercel.app/api/voice/agent-config
```

## Real-time agent (next)

`backend/config/deepgram_agent.json` defines a Deepgram Agent v2 settings blob exposed at `GET /voice/agent-config`. Wiring a WebSocket client in the chat room is the next step for full duplex voice without D-ID.
