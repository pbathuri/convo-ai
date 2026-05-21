# Persona demos

## MVP demo script (local)

1. `cd conversate/web && npm run dev`
2. Open `http://localhost:3000` — Sakura landing
3. **Personas** → Amazon → **Open chat**
4. Allow microphone; confirm D-ID stream (Chrome)
5. Enable consent → **Start capture** → speak one STAR answer
6. **End session** → **View session** → **Generate score**
7. Open **Progress** and **Sessions** list

Record 60s captures per persona → `docs/demos/<persona-id>.webm` (optional).

## Verification commands

```bash
cd conversate/web
npm run build
npm run kb:smoke
```

## Routes to show investors

| Route | What to highlight |
|-------|-------------------|
| `/` | Sakura hero + Practice → Transcript → Score → Improve |
| `/personas` | Five company rooms |
| `/chat?persona=amazon-l5-bar-raiser` | D-ID + candidate-side speech |
| `/sessions` | History with scores |
| `/sessions/[id]` | Coaching report |
| `/progress` | Trends + next drill |

Embed best clip in root README + 90s Loom for investors.
