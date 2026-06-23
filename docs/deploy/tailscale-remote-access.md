# Tailscale remote access — Windows desktop ↔ Mac

**Status (audited 2026-06-23):** Tailscale is installed, logged in, and running on this Windows PC.

| Field | Value |
|-------|-------|
| **Tailscale IPv4** | `100.90.245.113` |
| **MagicDNS** | `incinatopetraissect.tail190d6d.ts.net` |
| **Windows hostname** | `IncinatoPetraisSect` |
| **Tailnet account** | `taaffeite.aart@` |
| **Mac peer** | `pradyots-macbook-pro` (`100.118.202.120`) — bring online on same tailnet |

---

## What works without extra setup

- **Tailscale mesh** — Mac and PC are on the same tailnet; no public port forwarding required.
- **RDP registry** — `fDenyTSConnections = 0` (Remote Desktop allowed).
- **RDP firewall** — “Remote Desktop” rules enabled (Domain, Private, Public).

## What does NOT work on Windows

- **Tailscale SSH** (`tailscale set --ssh`) — not supported on Windows. Use RDP or Tailscale Serve instead.

---

## Connect from Mac (RDP — full desktop)

1. Install [Tailscale for macOS](https://tailscale.com/download/mac) and sign in with the **same** account.
2. Install [Microsoft Remote Desktop](https://apps.apple.com/app/microsoft-remote-desktop/id1295203466) from the Mac App Store.
3. Add PC:
   - **PC name:** `incinatopetraissect.tail190d6d.ts.net` or `100.90.245.113`
   - **User:** Windows username on the PC (e.g. `z4admin`)
4. Connect (same network as Tailscale — works from any internet).

### Harden RDP (run once on Windows as Administrator)

```powershell
cd C:\Users\z4admin\Desktop\acquire\convo-ai
powershell -ExecutionPolicy Bypass -File .\scripts\setup-tailscale-remote.ps1
```

This script:

- Confirms Tailscale status
- Ensures RDP is on
- Adds a firewall rule allowing **3389 only from** `100.64.0.0/10` (Tailscale CGNAT)
- Disables public-profile RDP rules

---

## Dev servers on tailnet (Tailscale Serve)

Expose local Convo AI without RDP:

| Local | Purpose |
|-------|---------|
| `:3000` | Next.js (`npm run dev`) |
| `:8000` | FastAPI backend |

### One-time tailnet enable (browser — cannot be fully unattended)

Serve is **not** enabled on this tailnet yet. An admin must visit once:

https://login.tailscale.com/f/serve?node=nCZFZ6yYk921CNTRL

Then on Windows:

```powershell
& "C:\Program Files\Tailscale\tailscale.exe" serve --bg 3000
& "C:\Program Files\Tailscale\tailscale.exe" serve --bg 8000
& "C:\Program Files\Tailscale\tailscale.exe" serve status
```

From Mac (Tailscale connected):

```bash
curl http://incinatopetraissect.tail190d6d.ts.net:3000/api/health
```

(Exact Serve URL shape may include HTTPS on tailnet — check `serve status` output.)

---

## Cursor / agent on Windows from Mac

| Goal | Approach |
|------|----------|
| **Code only** | Clone repo on Mac; use `docs/AGENT_HANDOFF.md` — no desktop needed |
| **Full Windows env** | RDP into `100.90.245.113`, open Cursor on desktop |
| **APIs only** | Tailscale Serve → `:3000` / `:8000` after one-time Serve enable |

---

## Local LLM on Windows (for agents / offline reasoning)

Ollama is running locally:

```powershell
ollama list
# gemma2:9b, qwen2.5:14b-instruct, llama2
```

Convo AI uses Ollama when Gemini is unavailable (`docs/deploy/local-llm.md`).

From Mac **over Tailscale** (after Serve or manual tunnel):

```bash
# If you SSH/RDP and run locally, or port-forward:
curl http://100.90.245.113:11434/api/tags   # only if Ollama bound to 0.0.0.0 (default: local only)
```

By default Ollama listens on `127.0.0.1` only — safe. To use from Mac via tailnet, either RDP and run commands locally, or set `OLLAMA_HOST=0.0.0.0` **only on Tailscale interface** (advanced; not configured by default).

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Mac can’t see PC | Both devices: `tailscale status`; same `taaffeite.aart@` account |
| RDP timeout | Windows awake? Tailscale running? Try IP `100.90.245.113` |
| Serve fails | Visit Serve enable URL above (one-time) |
| `offline, last seen` on Mac | Wake Mac, open Tailscale app |

---

## Security notes

- Do not expose RDP to the public internet; use Tailscale IPs / MagicDNS only.
- Prefer the admin script to scope firewall to `100.64.0.0/10`.
- Rotate Windows password if shared in chat.
- **Stripe / secrets** stay in `.env.local` — never commit.

---

## Autonomous checklist (agent)

1. `tailscale status` — must show `LoggedOut: false`
2. `tailscale ip -4` — note IP for docs
3. Run `setup-tailscale-remote.ps1` if admin available
4. Open Serve enable URL if dev HTTP access from Mac is required
5. Update `docs/AGENT_HANDOFF.md` if IPs/hostnames change
