# Persona contract

Each persona in `PERSONAS` (`src/lib/personas.ts`) must define:

| Field | Purpose |
|-------|---------|
| `interviewModes` | behavioral, technical, case, mixed |
| `primaryRubricId` | Links to scoring rubric |
| `defaultDurationMinutes` | Session timer hint |
| `defaultDifficulty` | easy / medium / hard |
| `openingQuestion` | First question (mirrored in D-ID Studio) |
| `candidateInstructions` | Shown in session objective card |
| `forbiddenBehavior` | Safety / realism guardrail |
| `fallbackBehavior` | When candidate is vague |

Mirror changes to `conversate/web/docs/personas/<id>.md` and D-ID Studio agent prompt/greeting/KB.
