# D-ID greeting latency — kick-off iteration

**Date:** 2026-05-20  
**Branch:** `commercial-v1`  
**Objective:** p50 greeting-to-video-play < 4s across all 5 personas.

## Audit

Instrumentation added to `DidAgentStage.tsx` emits phased analytics events:

- `did_sdk_import_*`, `did_manager_create_*`, `did_connect_*`
- `did_src_ready`, `did_video_play_*`, `did_connected`, `did_error`, `did_disconnected`

Each event includes `personaId`, `agentId`, `elapsedMs` (since mount), and `phaseMs` where applicable.

## Reason

Latency budget is dominated by:

1. **Dynamic import** of `@d-id/client-sdk` (cold cache on first load)
2. **`createAgentManager`** + `streamWarmup: true` (intentional quality trade-off)
3. **WebRTC connect** round-trip to D-ID edge
4. **`onSrcObjectReady` → `video.play()`** (first frame / greeting audio)

Personas do not differ in client code path; differences come from per-agent Studio config and agent id cold-start on D-ID side.

## Plan (smallest change)

- Keep `streamWarmup: true` for stable A/V (do not disable without re-measuring artifact rate).
- Surface `greetingLatencyMs` in UI for operator debugging during alpha.
- Log phased events to Upstash via `/api/analytics/event` when Redis is configured.

## Build

- `src/lib/analytics/client.ts` — `trackDidEvent()`
- `src/lib/analytics/types.ts` — extended event names
- `DidAgentStage.tsx` — phased timing + `personaId` prop

## Verify

Re-run `/chat?persona=<id>` for all five personas in Chrome; compare `greeting ready ~Nms` in the status line and analytics events. Target: **p50 < 4000ms** for `did_video_play_complete.elapsedMs`.

## Compound

Next iteration: aggregate `did_video_play_complete` by `personaId` in `/admin` cost/telemetry dashboard (Task 18).

## Risks

- Missing `NEXT_PUBLIC_DID_CLIENT_KEY` or `DID_PERSONA_*` skips stream entirely.
- Port 3000 conflicts — dev server may bind to 3001; update D-ID allowlist accordingly.
