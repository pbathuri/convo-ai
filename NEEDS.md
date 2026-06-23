# NEEDS — project vtbkmccoarhfzgosahqa

## Live

- **Frontend:** https://web-delta-three-73.vercel.app
- **Backend API:** https://convo-ai-backend-lwwq.onrender.com
- **Render service:** `convo-ai-backend` (branch `auto/20260609T121358Z`)

## Configured

- `NEXT_PUBLIC_SUPABASE_URL` + publishable key
- `SUPABASE_SECRET_KEY` (server-only)
- `DATABASE_URL` / `DIRECT_URL` (pooler: `aws-1-us-east-2`)
- Deepgram, ElevenLabs, PostHog, Sentry, Resend, Gemini, D-ID

## Supabase auth redirects (if magic link fails on prod)

Dashboard → **Authentication → URL Configuration** → add:

- `https://web-delta-three-73.vercel.app/auth/callback`
- Wildcard (optional): `https://*.vercel.app/**`

Site URL can stay `http://localhost:3000` or set to production.

## Still open

| Item | Action |
|------|--------|
| **Backend API** | Deployed on Render — `BACKEND_API_URL` set on Vercel |
| **D-ID allowlist** | Domains verified in Studio; set `NEXT_PUBLIC_DID_CLIENT_KEY=ck_okhHp-...` on Vercel ✓ |
| **Email confirm (new users)** | Confirm email or disable in Supabase → Providers → Email |
| **Voice STT** | Deepgram via `/api/voice/transcribe` + browser fallback in chat room |
| **Local LLM** | Ollama `gemma2:9b` fallback — see `docs/deploy/local-llm.md` |
| **Stripe** | Skipped |

## Dev helpers

```bash
cd conversate/web
npm run db:confirm-user -- your@email.com   # skip email confirm (dev)
```
