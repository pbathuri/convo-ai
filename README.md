# Convo AI

Duolingo-style conversation practice: a **Next.js 14** web app (`frontend/`) for onboarding, learn paths, and AI chat, plus a **Streamlit** prototype (`app/`, `components/`, etc.) for simulation and backend-oriented experiments.

Product spec and UI contract for the Next app live in [CURSOR_PROMPT.md](CURSOR_PROMPT.md).

## Repository layout

| Path | Stack | Purpose |
|------|--------|--------|
| `frontend/` | Next.js 14 (App Router), Tailwind, Framer Motion, Zustand | Production-leaning UI: landing, onboarding, learn dashboard, chat (mock APIs) |
| `app/`, `components/`, `services/` (if present) | Python / Streamlit | Legacy or parallel Streamlit experience |
| [CURSOR_PROMPT.md](CURSOR_PROMPT.md) | — | Frozen reference for `frontend/` behavior and structure |

## Next.js app (recommended for UI work)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production build:

```bash
npm run build
npm start
```

API routes are scaffolds under `frontend/app/api/` (`/api/chat`, `/api/user`, `/api/skills`). Replace `// SCAFFOLD:` call sites when wiring a real backend.

## Streamlit app (if present in your branch)

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt # if available
streamlit run app/app.py
```

Exact entrypoint may vary; check `app/` for `app.py`.

## Deploying the Next.js app

### Vercel (recommended)

1. Import this GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Next.js** (default). Build: `npm run build`, output handled automatically.
4. Deploy. Pushes to the connected branch trigger new deployments.

### Render

1. New **Web Service**, connect the repo.
2. **Root Directory:** `frontend`.
3. **Build command:** `npm install && npm run build`.
4. **Start command:** `npm start`.
5. Use Node18+.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) if present.

## License

MIT License (see [License](License) if present in the repository).
