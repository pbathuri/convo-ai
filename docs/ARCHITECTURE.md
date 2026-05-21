# Architecture — investor pilot

See `docs/audits/current-state.md` for gap matrix.

**Candidate path:** Personas → Consent → Session API → D-ID stream → Transcript (SDK or paste) → Score API (Gemini + RAG) → Feedback report → Progress.

**Data path:** Scraper adapters → KB pipeline → approval queue → pgvector chunks → hybrid retrieval → scoring.

**Operator path:** Admin console → persona/KB/scraper/scoring/cost modules with `requireAdmin()` on mutations.

**Offline:** Big Red 200 for embedding batches, eval sweeps, retrieval benchmarks — never live serving.
