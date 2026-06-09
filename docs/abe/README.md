# ABE sessions — convo-ai (commercial-v1)

Autonomous Build Engine sessions run on **`auto/<timestamp>`** branches only. **`main` is never written unattended.**

## Run

From PCE root:

```powershell
.\scripts\abe_hour_session.ps1 -Minutes 60 -TargetRepo C:\Users\z4admin\Desktop\acquire\convo-ai
```

Requires portable Node at `C:\Users\z4admin\Desktop\Tools\node-portable` (or npm on PATH).

## Verify gate

```bash
cd conversate/web && npm run verify
```

## Review

1. Inspect `auto/*` branch commits on convo-ai.
2. Run Chrome demo checklist: `docs/implementation/demo-readiness-checklist.md`.
3. Human merge to `main` when ready — never auto-merge.
