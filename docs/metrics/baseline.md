# Metrics baseline

| Metric | Target | Instrumentation |
|--------|--------|-----------------|
| Greeting latency p50 | < 4s | `did_video_play_complete.elapsedMs` |
| Time to first response | < 90s | session `created` → `live` |
| Scoring JSON validity | > 99% | eval harness |
| KB chunks with source | 100% | `KbChunk.sourceId` FK |
