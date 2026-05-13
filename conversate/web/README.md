# Conversate (web)

## How it works (Mode 1 — D-ID brain)

- Pick a persona; each maps to a D-ID Agent id in env.
- The browser loads `@d-id/client-sdk`, connects with `NEXT_PUBLIC_DID_CLIENT_KEY`, and streams video.
- GPT-4.1, prompts, greeting, and knowledge live in D-ID Studio for that agent—not this Next app.
- `src/lib/llm.ts` and `src/app/api/llm/*` stay dormant for a future V2 hybrid / webhook override.
- Upstash Redis backs session + rate limits when `UPSTASH_*` is set.

## Run locally

```bash
cd conversate/web && cp .env.example .env.local
# fill keys, then:
npm install && npm run dev
```

See `docs/personas/*.md` for version-controlled notes mirroring each Studio agent.
