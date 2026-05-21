# Threat model

| Risk | Mitigation | Owner task |
|------|------------|------------|
| KB prompt injection | sanitize.py + safety-preamble + malicious fixture tests | rag-prompt-injection-defense |
| Restricted source leakage | `AllowedUsage` enum; hide trace when not `ui_visible` | source-aware-feedback |
| WRDS license violation | Internal pipeline only; no raw data in UI/KB | wrds-policy |
| Unconsented transcripts | Consent gate before scoring | meta-consent |
| Admin mutation exposure | `requireAdmin()` + AuditLog; `x-admin-email` only in `NODE_ENV=development`; production returns 401 until session auth wired | admin-auth-hardening |
| API key exposure | Server-only secrets; no NEXT_PUBLIC for Gemini | deployment-plan |
| Retention | `retentionPolicy` on KbSource; session deletion TBD | security follow-up |
