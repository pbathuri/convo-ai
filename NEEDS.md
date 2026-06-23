# NEEDS — project vtbkmccoarhfzgosahqa

## Live

- **Production:** https://web-delta-three-73.vercel.app
- **Vercel project:** `pbathuris-projects/web`
- Login verified (password + DB persistence)

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
| **Backend API** | Deploy FastAPI (`backend/`) to Railway/Fly; set `BACKEND_API_URL` on Vercel |
| **D-ID allowlist** | Add `web-delta-three-73.vercel.app` in D-ID Studio |
| **Email confirm (new users)** | Confirm email or disable in Supabase → Providers → Email |
| **Stripe** | Skipped |

## Dev helpers

```bash
cd conversate/web
npm run db:confirm-user -- your@email.com   # skip email confirm (dev)
```
