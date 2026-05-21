# Transcript capture feasibility — D-ID client SDK

**Task:** 6b (proof before Task 7 persistence)

## SDK inspection

Inspect `@d-id/client-sdk` types in `node_modules/@d-id/client-sdk` when installed.

### Expected callbacks (AgentManager)

From integration in `DidAgentStage.tsx`:

- `onSrcObjectReady(srcObject)` — **video/audio stream only**, no transcript text
- `onError(err)` — error surface

`createAgentManager` + `connect()` do not expose typed `onMessage` / transcript events in the current integration path.

## Answers

| Question | V1 answer |
|----------|-----------|
| Agent spoken text in SDK? | **Not exposed** in current callback wiring |
| User spoken text in SDK? | **Not exposed** — handled inside D-ID agent session |
| Timestamps / utterance IDs? | **Not available** client-side |
| Fallback for scoring? | **Post-session paste** via `TranscriptPanel` → `POST /api/sessions/[id]/messages` |

## Chosen V1 path

1. **Primary:** Manual transcript import (user/operator paste `user:` / `agent:` lines)
2. **Future:** D-ID webhook or external STT on recorded audio; browser `SpeechRecognition` prototype optional

## Task 7 implication

Composer must **not** invent fake SDK message callbacks. `TranscriptPanel` + messages API is the supported path until SDK/webhook evidence exists.

## Privacy

Transcript storage requires consent (`Consent` model) before scoring in production.
