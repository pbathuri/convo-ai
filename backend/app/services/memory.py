from typing import Any

MAX_TURNS = 10


def update_memory(
    memory: list[dict[str, Any]],
    user_input: str,
    ai_response: str,
    tone: str,
    score: float,
    feedback: str,
) -> list[dict[str, Any]]:
    """Ported from memory_engine.py."""
    memory = list(memory)
    memory.append(
        {
            "user": user_input,
            "ai": ai_response,
            "tone": tone,
            "score": score,
            "feedback": feedback,
        }
    )
    return memory[-MAX_TURNS:]


def get_memory_context(memory: list[dict[str, Any]]) -> str:
    lines: list[str] = []
    for turn in memory:
        lines.append(f"User: {turn.get('user', '')}")
        lines.append(f"AI: {turn.get('ai', '')}")
    return "\n".join(lines)
