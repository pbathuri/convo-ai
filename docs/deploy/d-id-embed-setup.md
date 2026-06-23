# D-ID agent embed — setup from Studio

Based on your D-ID **Embed your agent** screen for Sarah Chen / Amazon L5.

## Domains (already verified ✓)

Your screenshot shows these allowlisted:

- `https://web-delta-three-73.vercel.app`
- `https://web-mxglcqmx1-pbathuris-projects.vercel.app`

**Tip:** When adding a domain, use the full URL with `https://`.  
Entering `web-delta-three-73.vercel.app` without the scheme triggers: *"Enter a valid domain (e.g., https://example.com)"*.

## Keys from embed code

From **Copy embed code**:

| Field | Value |
|-------|--------|
| Client key | `ck_okhHp-Gn40fwmyRIN_drl` |
| Agent ID | `v2_agt_4pjSCal7` |

## Vercel env vars

```env
NEXT_PUBLIC_DID_CLIENT_KEY=ck_okhHp-Gn40fwmyRIN_drl
DID_PERSONA_AMAZON_L5=v2_agt_4pjSCal7
DID_API_BASIC_KEY=<your server Basic key — already set>
```

`NEXT_PUBLIC_DID_CLIENT_KEY` is the **scoped ck_ key** bound to your allowlisted domains — required for the browser embed.

## Widget vs in-app embed

| Studio option | Our app |
|---------------|---------|
| **Widget** (float, `data-mode="fabio"`) | Not used — we embed in the interview room |
| **Frame / full** | `DidOfficialEmbed` + `DidAgentStage` on `/chat` |

To test: sign in → **Practice** → **Sarah Chen** → **Enter live room**.

## Verify

```bash
curl https://web-delta-three-73.vercel.app/api/did/embed-config
```

Expect `"ok": true` and `"clientKey": "ck_..."`.

Preflight: `GET /api/did/preflight`
