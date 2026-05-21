# Source policy

## Allowed

- `company_careers`, `interview_questions`, `public_guides`, `manual_uploads`, `internal_sme_notes`

## Restricted

- `youtube_transcripts`, `reddit_experiences` — require approval; often `rag_only_no_display`

## Banned

- `glassdoor_full_review`, `linkedin_scrape`

## Rules

- Every import must include `licenseStatus`, `robotsStatus`, `allowedUsage`, `piiStatus`
- Scraped chunks default `approvalStatus: pending`
- WRDS-derived notes: `wrds_internal_notes`, `internal_only` only
