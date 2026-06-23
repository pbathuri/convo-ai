# Agent handoff — continue on Mac (or any machine)

**Updated:** 2026-06-23  
**Branch:** `auto/20260609T121358Z`  
**Repo:** https://github.com/pbathuri/convo-ai

Read this file first when resuming work in a new Cursor agent session.

---

## 1. Sync the repo

```bash
git clone https://github.com/pbathuri/convo-ai.git
cd convo-ai
git checkout auto/20260609T121358Z
git pull origin auto/20260609T121358Z
```

If already cloned:

```bash
git fetch origin
git checkout auto/20260609T121358Z
git pull origin auto/20260609T121358Z
```

---

## 2. Production URLs (ground truth)

| Service | URL |
|---------|-----|
| **Frontend** | https://web-delta-three-73.vercel.app |
| **Backend API** | https://convo-ai-backend-lwwq.onrender.com |
| **Supabase project** | `vtbkmccoarhfzgosahqa` |

### Remote Windows desktop (Tailscale)

Use when you need **this PC’s** Cursor/Ollama/env, not just the git repo:

| Field | Value |
|-------|-----|
| **Tailscale IP** | `100.90.245.113` |
| **MagicDNS** | `incinatopetraissect.tail190d6d.ts.net` |
| **RDP** | Port `3389` — enabled; connect via Microsoft Remote Desktop on Mac |
| **Windows user** | `z4admin` |

Full guide: [`docs/deploy/tailscale-remote-access.md`](deploy/tailscale-remote-access.md)

**One-time (admin):** run `scripts/setup-tailscale-remote.ps1` on Windows to restrict RDP to Tailscale CGNAT.  
**One-time (browser):** enable [Tailscale Serve](https://login.tailscale.com/f/serve?node=nCZFZ6yYk921CNTRL) to hit `:3000` / `:8000` from Mac without full RDP.

Health checks:

```bash
curl -s https://web-delta-three-73.vercel.app/api/health | jq .
curl -s https://convo-ai-backend-lwwq.onrender.com/health | jq .
curl -s http://localhost:3000/api/llm/status | jq .   # after local dev up
```

**Do not use** legacy Render URLs (`convo-ai-424a`, `claude-hackathon-u86l`) — those are old Streamlit/other apps.

---

## 3. Local setup (Mac)

```bash
# Web
cd conversate/web
cp .env.example .env.local
# Copy secrets from team password manager / prior machine .env.local (never commit)
npm ci
npm run dev

# Backend (separate terminal)
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Ollama (local LLM — optional but recommended on Mac)

```bash
brew install ollama   # or https://ollama.com
ollama pull gemma2:9b
ollama serve            # if not running as service
```

Add to `conversate/web/.env.local`:

```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=gemma2:9b
BACKEND_API_URL=http://localhost:8000
```

Scoring/emotion chain: **Gemini → Ollama → heuristic**. See `docs/deploy/local-llm.md`.

### Database (Prisma)

- Pooler host: `aws-1-us-east-2.pooler.supabase.com` (not `aws-0-us-east-1`)
- `DATABASE_URL` / `DIRECT_URL` in `conversate/web/.env` (Prisma CLI) and `.env.local` (Next.js)
- Dev helper: `npm run db:confirm-user -- your@email.com`

---

## 4. Verify before coding

```bash
cd conversate/web
npm run verify          # build + 60 vitest + kb:smoke + demo checklist

cd ../../backend
pytest -q               # 14 tests
```

E2E (optional):

```bash
cd conversate/web
npm run build
npm run test:e2e
```

Visual demo audit (screenshots for CV/golden-path review):

```bash
npm run start:standalone   # terminal 1
npm run demo:visual-audit  # terminal 2 → docs/demos/screenshots/
```

---

## 5. What was just shipped (this handoff)

| Area | Summary |
|------|---------|
| **Local LLM** | `src/lib/llm/ollama.ts`, `router.ts` — Gemini → Ollama → heuristic |
| **RL drills** | `src/lib/personalization/bandit.ts` — ε-greedy next drill on `/progress` |
| **Domains** | 3 live backend modules + `/domains` sandbox + `/api/domains/prompt` |
| **Voice** | Deepgram STT proxies, agent WebSocket scaffold, `demo:visual-audit` |
| **Observability** | Langfuse trace seam in `src/lib/observability/trace.ts` |
| **Docs** | `NEEDS.md`, `BUILD_LOG.md`, `BENCHMARK.md`, `docs/deploy/local-llm.md` |

Tracking files:

- `NEEDS.md` — open items
- `BUILD_LOG.md` — chronological log
- `BENCHMARK.md` — competitor parity matrix

---

## 6. Cognitive-graph workflow (every session)

PCE MCP (`project-context-engine`) was **unavailable** on Windows — retry on Mac:

1. `get_project_context` with goal + project path
2. `get_archetype_recommendations`
3. `get_relevant_prior_decisions`
4. Implement → `npm run verify` → update `BUILD_LOG.md` → commit → deploy

Branches in use: **local_inference** (Ollama), **langfuse** (traces), **RL** (bandit), **vision** (screenshot audit), **web_acquisition** (domains port).

---

## 7. Next priority queue

1. **Deploy** — push triggers Render auto-deploy; run `npx vercel deploy --prod` from `conversate/web` for frontend
2. **Deepgram agent** — browser token proxy for `DeepgramAgentSession` (`src/lib/voice/deepgram-agent.ts`); wire into chat when D-ID skipped
3. **Port domains** — remaining 5 Streamlit modules (`eq`, `debate`, `political`, `satire`, `ai_society`)
4. **RL persist** — store bandit state per user in Prisma
5. **Langfuse** — set `LANGFUSE_*` on Vercel; confirm traces on score/emotion
6. **Upstash Redis** — still `false` in `/api/health`
7. **Stripe** — intentionally skipped

---

## 8. Deploy commands

```bash
# Frontend (from conversate/web, Vercel linked)
npx vercel deploy --prod

# Backend — Render deploys from branch push; manual:
# Render Dashboard → convo-ai-backend → Manual Deploy
# Or Render CLI (Windows path in docs/deploy/render-backend.md)
```

After deploy, confirm:

```bash
curl -s https://web-delta-three-73.vercel.app/api/health | jq '.backend, .ollama'
```

---

## 9. Constraints

- **Stripe:** skipped per product owner
- **Secrets:** never commit `.env.local`, `.env`, or credentials in docs
- **D-ID live persona:** Amazon L5 (`v2_agt_4pjSCal7`, client key on Vercel)
- **Git:** branch `auto/20260609T121358Z`; merge to `main` / `commercial-v1` when ready

---

## 10. Agent prompt to paste on Mac

```
Continue Convo AI from docs/AGENT_HANDOFF.md on branch auto/20260609T121358Z.
Run verify first. Follow cognitive-graph workflow (PCE recall → implement → verify → BUILD_LOG).
Priority: Deepgram agent token proxy, port remaining domains, deploy Render+Vercel if health lags.
```
