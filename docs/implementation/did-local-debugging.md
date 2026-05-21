# D-ID local debugging

## Key type

Use a **D-ID Studio embed client key** in `NEXT_PUBLIC_DID_CLIENT_KEY`. This is safe to expose in the browser.

Do **not** put a D-ID **server API key** in `NEXT_PUBLIC_*` or client code.

## Persona agent IDs

Each persona maps to an env var (e.g. `DID_PERSONA_AMAZON_L5`) holding the Studio agent ID (`v2_agt_...`). See `conversate/web/src/lib/personas.ts`.

## Localhost allowlist

In D-ID Studio, for your embed client key:

1. Open the client key / allowed origins settings.
2. Add both:
   - `http://localhost:3000`
   - `http://localhost:3001`
3. Save and retry in **Google Chrome** (not Cursor embedded preview).

## Chrome verification

1. `cd conversate/web && npm run dev`
2. Open `http://localhost:3000/chat?persona=amazon-l5-bar-raiser`
3. Allow microphone when prompted.
4. DevTools → Network: confirm `api.d-id.com` requests succeed (no CORS block).
5. Video should show **Stream: connected**.

## In-app failure panel

When the stream fails, the chat room shows:

- **D-ID stream could not connect.**
- Check that localhost is allowlisted in D-ID Studio for this embed key.
- Use a D-ID Studio embed client key, not a server API key
- Test in real Chrome; Cursor embedded browser may block WebRTC/CORS
- **Continue transcript-only interview** — keeps speech capture, manual transcript, end session, and scoring

## Common errors

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Failed to fetch / CORS | Origin not allowlisted or embedded browser | Allowlist localhost; use Chrome |
| Missing agent | Wrong `DID_PERSONA_*` | Match Studio agent ID |
| No video | Mic blocked or SDK error | Check console + D-ID dashboard |

## Transcript-only fallback

If D-ID fails or times out (15s), click **Continue transcript-only interview** in the chat room.

- Persona, objective, timer, browser speech, and manual transcript stay active.
- End session and generate score as usual.
- Coaching uses your saved transcript (Gemini or local heuristic).

## What not to do

- Do not proxy server API keys through the browser.
- Do not route live interview reasoning through Gemini in this app (V1 uses D-ID Studio).
- Do not disable CORS in production; fix allowlist instead.

## Optional future improvement

A Next.js **server route** could proxy agent metadata (not stream secrets) if browser CORS remains blocked in some environments. Not required when Chrome + allowlist work.
