# WRDS usage policy

WRDS (Wharton Research Data Services) is for **narrow internal research** only:

- Goldman VP persona drill scaffolding
- Synthetic market-awareness notes (aggregated, non-licensed display)

## Prohibited

- Raw WRDS tables in user-facing UI
- Public KB chunks containing licensed WRDS fields without legal review
- Automated scraping from WRDS into production KB

## Pipeline

`pipelines/research/wrds_goldman_persona_notes.py` — run locally with institutional credentials; output to internal notes only.
