# Convo AI

Convo AI is a **Streamlit** application for practicing domain-specific conversations with an LLM. It combines Duolingo-style progression visuals, skill tracking, emotional “radar” feedback, optional voice input/output, streaks and XP, and pluggable **domain modules** (political science, business, debate, philosophy, and more).

**Repository:** <https://github.com/pbathuri/convo-ai>

---

## Production architecture (2026-06)

| Layer | Path | Role |
|-------|------|------|
| **Active web app** | `conversate/web/` | Next.js 14 — interview MVP, Sakura UI |
| **Engine API** | `backend/` | FastAPI — gamification, emotion, memory, voice, skill-tree |
| **Legacy prototype** | `app/`, `components/` | Streamlit archive — domain IP reference |
| **Pipelines** | `pipelines/` | KB ingest + scraper (offline) |

```bash
# Verify everything
cd conversate/web && npm run verify    # 60 unit tests, build, smoke
cd backend && pytest -q                # FastAPI tests
cd conversate/web && npm run test:e2e  # Playwright golden path
```

Deploy: see [`docs/runbook/production-deploy.md`](docs/runbook/production-deploy.md).  
**Multi-device / Mac agent:** [`docs/AGENT_HANDOFF.md`](docs/AGENT_HANDOFF.md).  
Outstanding keys: [`NEEDS.md`](NEEDS.md). Competitor matrix: [`BENCHMARK.md`](BENCHMARK.md).

---

## Conversate commercial MVP (active product)

The **interview-practice app** lives under [`conversate/web/`](conversate/web/) on branch **`commercial-v1`**.

- Run: `cd conversate/web && npm install && npm run dev`
- Verify: `npm run verify` (build + unit tests + KB smoke)
- Status: [`docs/implementation/current-mvp-status.md`](docs/implementation/current-mvp-status.md)

This is **not production-ready**. D-ID is optional (transcript-only fallback). The Streamlit app below is **legacy reference only**.

---

## Who this repo is for

- **New contributors** — Start with [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- **Reviewers / instructors** — [docs/MODULE_REFERENCE.md](docs/MODULE_REFERENCE.md) lists every engine and domain file and what it does.
- **Product context** — See [one_pager.md](one_pager.md), [Overview.md](Overview.md), and [Progress Log.md](Progress%20Log.md).

---

## Features

- Domain modules with subdomains and tailored system prompts (`app/services/domains/`)
- OpenAI chat completions for replies, coaching, emotion JSON, scoring, and reflection
- Gamification: XP, streaks, daily goals (`app/services/gamification_engine.py`)
- Skill map and charts (`components/`, `data/learning_progression.json`)
- Optional speech-to-text on uploaded audio and TTS for AI replies
- Session transcript export

---

## Quick start

```bash
git clone https://github.com/pbathuri/convo-ai-demo.git
cd convo-ai-demo
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add OPENAI_API_KEY
streamlit run app/app.py
```

Run the last command from the **repository root** so `data/` paths work.

---

## Repository layout

| Path | Purpose |
|------|---------|
| `app/app.py` | Main Streamlit application |
| `app/services/` | Engines: emotion, memory, scoring, voice, gamification, etc. |
| `app/services/domains/` | One module per practice domain (`generate_prompt`, `get_subdomains`) |
| `components/` | Skill map, dashboards, emotion radar, history UI |
| `data/` | `learning_progression.json`, `scenarios.json` |
| `streamlit/` | Optional UI theme |
| `docs/` | Architecture, module index, setup guide |
| `materials/` | Blog drafts, cover art, marketing PDFs/screenshots (not used at runtime) |

Legacy copies of this project existed under multiple Desktop paths; **this repository is the canonical copy** for development and documentation. See [docs/LEGACY_LOCAL_COPIES.md](docs/LEGACY_LOCAL_COPIES.md) for a recorded list and cleanup guidance.

---

## Documentation index

| Document | Contents |
|----------|----------|
| [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) | Install, run, troubleshooting |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | End-to-end flow, diagrams, data/config |
| [docs/MODULE_REFERENCE.md](docs/MODULE_REFERENCE.md) | File-by-file responsibilities |
| [docs/LEGACY_LOCAL_COPIES.md](docs/LEGACY_LOCAL_COPIES.md) | Old Desktop duplicate paths; this repo is canonical |
| [materials/README.md](materials/README.md) | Non-code assets explained |

---

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md). License terms are in [License](License).
