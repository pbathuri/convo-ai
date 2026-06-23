import httpx

from app.config import settings


async def is_ollama_available() -> bool:
    base = (settings.ollama_base_url or "").rstrip("/")
    if not base:
        return False
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            res = await client.get(f"{base}/api/tags")
            return res.status_code == 200
    except httpx.HTTPError:
        return False


async def ollama_generate_json(prompt: str) -> dict:
    base = settings.ollama_base_url.rstrip("/")
    model = settings.ollama_model
    async with httpx.AsyncClient(timeout=120.0) as client:
        res = await client.post(
            f"{base}/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False,
                "format": "json",
            },
        )
        res.raise_for_status()
        body = res.json()
        text = (body.get("response") or "").strip()
        if not text:
            raise ValueError("empty ollama response")
        import json

        return json.loads(text)
