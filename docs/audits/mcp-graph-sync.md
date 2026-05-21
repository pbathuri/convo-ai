# MCP graph sync — code-review-graph

**Status (2026-05-21):** `user-code-review-graph` MCP server **errored** — no tools exposed in Cursor. Audit completed with committed JSON as source of truth.

## Source artifact

- [repo-health-graph.json](./repo-health-graph.json) — nodes, edges, `brokenComponents`, `degradedComponents`, benchmark refs

## When MCP is restored

1. Open **Cursor Settings → MCP** and restart **code-review-graph**.
2. Confirm tools appear: `get_architecture_overview`, `semantic_search_nodes`, `query_graph`, `get_impact_radius`, `get_affected_flows`.
3. Re-index the repo (follow graph server README if index is manual).
4. For each node in `repo-health-graph.json` → `nodes[]`, verify graph contains matching path and attach metadata:
   - `tag`, `health`, `benchmarkRef`, `summary`
5. For each edge in `edges[]`, confirm relationship exists or add via graph ingest API.
6. Validate broken nodes:
   - `query_graph` pattern `callers_of` / `get_impact_radius` on `component:DidAgentStage`
   - `get_affected_flows` on `api:/api/sessions/[id]/score`

## Validation queries (examples)

After sync, agents should be able to answer:

- "What depends on DidAgentStage?"
- "What breaks if scorer.ts changes?"
- "Which routes are dormant?"

## Fallback

Until MCP works, agents MUST read:

1. `docs/audits/repo-health-graph.json`
2. `docs/audits/benchmark-results-2026-05-21.md`

Do not assume graph MCP is populated.
