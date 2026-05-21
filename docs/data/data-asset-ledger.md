# Data asset ledger

Every `KbChunk` traces to:

- `KbSource` (governance enums: license, robots, allowedUsage, pii, approval)
- `KbDocument` (title, raw text reference)
- Optional `KbVersion` (pinned per session)

Operator reviews in `/admin/kb` before `approvalStatus: approved`.
