<div align="center">

# Convo AI

**Duolingo-style conversation practice for domain expertise - political science, business comms, debate, philosophy, and more.**

<br/>

<img src="https://img.shields.io/badge/Web-Next.js%2014-0D1117?style=for-the-badge&logo=nextdotjs&logoColor=58A6FF&labelColor=161B22" />
<img src="https://img.shields.io/badge/Alt-Streamlit-0D1117?style=for-the-badge&labelColor=161B22&color=FFA657" />
<img src="https://img.shields.io/badge/State-Zustand%20%C2%B7%20Tailwind-0D1117?style=for-the-badge&labelColor=161B22&color=58A6FF" />
<img src="https://img.shields.io/badge/Demo-companion%20repo-0D1117?style=for-the-badge&labelColor=161B22&color=8B949E" />

</div>

---

## TL;DR

Interactive conversation practice with Duolingo-style progression - domain modules, persona-driven coaching, voice flows, emotional feedback, XP, skill maps, and session-style practice.

Lightweight demo twin → [**convo-ai-demo**](https://github.com/pbathuri/convo-ai-demo).

---

## Layout

| Path | Stack | Purpose |
|------|-------|---------|
| `frontend/` | Next.js 14 · Tailwind · Framer Motion · Zustand | Primary web UI + scaffolds for backend integration |
| `app/`, `components/`, `data/` | Python · Streamlit | Simulation engines, domains, legacy UI |
| [`CURSOR_PROMPT.md`](CURSOR_PROMPT.md) | - | Frozen reference for `frontend/` |

---

## Quick start

### Next.js app

```bash
cd frontend
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

API scaffolds live in `frontend/app/api/` (`/api/chat`, `/api/user`, `/api/skills`). Look for `// SCAFFOLD:` when wiring a real backend.

### Streamlit app

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
streamlit run app/app.py
```

If your tree uses a different entry file, adjust the path.

---

## Deploy

### Vercel (recommended for Next.js)

1. Import [pbathuri/convo-ai](https://github.com/pbathuri/convo-ai) (or your fork).
2. Set **Root Directory** → `frontend`.
3. Framework: **Next.js** (auto-detected).
4. Deploy. Git pushes to prod branch trigger redeploys.

### Render

1. New **Web Service**, connect the repo.
2. **Root Directory** → `frontend`.
3. **Build** → `npm install && npm run build`.
4. **Start** → `npm start`.
5. Runtime: **Node 18+**.

---

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) if present. License: MIT - see `License`.

---

<div align="center">
<sub>Demo twin → <a href="https://github.com/pbathuri/convo-ai-demo">convo-ai-demo</a> · Part of <a href="https://github.com/pbathuri">@pbathuri</a>'s <a href="https://github.com/pbathuri/Map_Projects_MAC">project portfolio</a></sub>
</div>
