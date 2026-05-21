# Scraper adapters

Each adapter implements `BaseAdapter.fetch(url) -> RawDocument`.

- `trafilatura_adapter.py` — static pages
- `crawl4ai_adapter.py` — LLM-ready markdown (optional)
- `crawlee_adapter.py` — dynamic/browser (optional)
- `existing_source_adapter.py` — wraps `pipelines/scraper/scraper/sources/`

Output is JSONL only — never writes live KB.
