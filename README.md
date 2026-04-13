# Convo AI

Interactive conversation practice with Duolingo-style progression: domain modules (political science, business communication, debate, philosophy, and more), persona-driven coaching, voice-oriented flows, emotional feedback, XP and skill maps, and session-style practice.

This repository contains:

- **`frontend/`** — Next.js 14 app (App Router): landing, onboarding, learn dashboard, chat UI, and mock API routes. Authoritative UI spec: [CURSOR_PROMPT.md](CURSOR_PROMPT.md).
- **`app/`**, **`components/`**, **`data/`**, etc. — Streamlit-oriented Python prototype and services (when present on your branch).

## Repository layout

| Path | Stack | Purpose |
|------|--------|--------|
| `frontend/` | Next.js, Tailwind, Framer Motion, Zustand | Primary web UI and scaffolds for backend integration |
| `app/`, `components/`, … | Python / Streamlit | Simulation engines, domains, legacy UI |
| [CURSOR_PROMPT.md](CURSOR_PROMPT.md) | — | Frozen reference for `frontend/` |

## Next.js app

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production:

```bash
npm run build
npm start
```

API scaffolds: `frontend/app/api/` (`/api/chat`, `/api/user`, `/api/skills`). Look for `// SCAFFOLD:` when wiring a real backend.

## Streamlit app

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
streamlit run app/app.py
```

If your tree uses a different entry file, adjust the path (some layouts use `app/app.py` at repo root).

## Deploying the Next.js app

### Vercel (recommended)

1. Import [pbathuri/convo-ai](https://github.com/pbathuri/convo-ai) (or your fork).
2. Set **Root Directory** to `frontend`.
3. Framework: **Next.js** (default). Install/build/start are auto-detected.
4. Deploy. Git pushes to the production branch trigger redeploys.

### Render

1. New **Web Service**, connect the repo.
2. **Root Directory:** `frontend`.
3. **Build command:** `npm install && npm run build`.
4. **Start command:** `npm start`.
5. Runtime: **Node 18+**.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) if present.

## License

MIT License (see [License](License) if present in the repository).
