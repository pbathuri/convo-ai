"""
Configure the chat/completions client for OpenAI or local Ollama (OpenAI-compatible API).

Ollama: start the daemon (`ollama serve`), pull a model (`ollama pull llama3.2`), then set
USE_OLLAMA=true. Default base URL is http://127.0.0.1:11434/v1 (see Ollama OpenAI docs).
"""

from __future__ import annotations

import os

from openai import OpenAI


def _normalize_ollama_base(url: str) -> str:
    u = url.rstrip("/")
    if u.endswith("/v1"):
        return u
    return f"{u}/v1"


def create_llm_client_and_model() -> tuple[OpenAI | None, str, str]:
    """
    Returns (client, model_id, provider) where provider is \"ollama\" or \"openai\".
    If OpenAI is selected but OPENAI_API_KEY is missing, returns (None, "", "openai").
    """
    use_ollama = os.getenv("USE_OLLAMA", "").strip(
    ).lower() in ("1", "true", "yes", "on")
    if use_ollama:
        base = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").strip()
        base = _normalize_ollama_base(base)
        model = os.getenv("OLLAMA_MODEL", "llama3.2").strip()
        api_key = os.getenv("OLLAMA_API_KEY", "ollama").strip() or "ollama"
        client = OpenAI(base_url=base, api_key=api_key)
        return client, model, "ollama"

    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return None, "", "openai"
    model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo").strip()
    return OpenAI(api_key=api_key), model, "openai"
