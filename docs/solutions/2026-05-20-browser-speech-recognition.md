# Browser SpeechRecognition transcript prototype

**Date:** 2026-05-20  
**Branch:** `commercial-v1`

## Why this exists

- **D-ID V1** owns the live interview (ASR, LLM, TTS, lip-sync) inside the agent session.
- The **D-ID client SDK** does not expose reliable live transcript callbacks in our integration.
- **Post-session scoring** needs transcript text in the `Message` table.

See [transcript-capture-feasibility.md](../audits/transcript-capture-feasibility.md).

## What was built

| Piece | Path |
|-------|------|
| Browser abstraction | `conversate/web/src/lib/speech/browser-speech.ts` |
| React hook | `conversate/web/src/hooks/useBrowserSpeechRecognition.ts` |
| UI | `conversate/web/src/components/session/SpeechTranscriptCapture.tsx` |
| Wiring | `chat-experience.tsx`, `TranscriptPanel.tsx` |
| API | `POST /api/sessions/[id]/messages` accepts optional `provider`/`metadata` (stripped before DB write) |

### Hard rules

1. **Never POST `interimText`** — only finalized `SpeechSegment` with `isFinal === true`.
2. **User consent** checkbox required before persistence.
3. **Candidate-side only** — UI labels and copy make clear this is not a full conversation transcript.
4. **Headphones warning** in UI to reduce D-ID avatar audio bleed into the mic.

## Browser support

| Browser | Expected |
|---------|----------|
| Chrome / Edge | Supported (`webkitSpeechRecognition`) |
| Safari | Limited or unsupported |
| Firefox | Often unsupported |

Unsupported browsers show a graceful message; D-ID and manual paste still work.

## Privacy

- Capture starts only after explicit user action (consent + Start).
- Prototype flag in request metadata (client); DB stores `role` + `content` only today.
- No Gemini or server-side STT in the live loop.

## Known limitations

- Captures **candidate-side** speech from the browser mic, not guaranteed agent lines.
- Without headphones, **D-ID interviewer audio** may be picked up.
- Accuracy depends on browser engine and environment noise.
- Not production-grade STT.

## Next options

- External STT (e.g. Whisper) on recorded audio
- D-ID transcript webhook if/when available
- Post-session upload or operator paste (existing manual fallback)

## Persistence note

If `DATABASE_URL` is misconfigured (e.g. Supabase auth errors), segments remain visible in the UI but may not persist. Fix DB credentials and re-run `npm run db:migrate && npm run db:seed`.
