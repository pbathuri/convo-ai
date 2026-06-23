# Local LLM (Ollama) — cognitive-graph `local_inference` branch

Conversate scores sessions and emotion traits through a **fallback chain**:

```
Gemini (cloud) → Ollama (local) → heuristic rules
```

## Setup

1. Install [Ollama](https://ollama.com) and pull a JSON-capable model:

```powershell
ollama pull gemma2:9b
```

2. Add to `conversate/web/.env.local`:

```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=gemma2:9b
```

3. Verify:

```powershell
Invoke-RestMethod http://localhost:3000/api/llm/status
Invoke-RestMethod http://localhost:3000/api/health
```

## RL drill selection

Progress page uses an **ε-greedy contextual bandit** (`src/lib/personalization/bandit.ts`) to pick the next drill from weakness history. Reward signal = session `overallScore`.

## Visual demo audit (computer vision workflow)

Capture golden-path screenshots for review:

```powershell
cd conversate/web
npm run build
npm run start:standalone
# separate terminal:
npm run demo:visual-audit
```

Output: `docs/demos/screenshots/` + `manifest.json`

## Langfuse tracing (optional)

Set `LANGFUSE_HOST`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY` to emit LLM trace events from `src/lib/observability/trace.ts`.
