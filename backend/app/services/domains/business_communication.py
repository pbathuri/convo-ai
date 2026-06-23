"""Business communication domain — ported from Streamlit services/domains."""


def get_subdomains() -> list[str]:
    return [
        "Networking",
        "Persuasion",
        "Elevator Pitching",
        "Negotiation",
    ]


def generate_prompt(
    user_input: str,
    subdomain: str,
    goal: str | None = None,
    memory: str | None = None,
    traits: str | None = None,
) -> dict:
    traits = traits or "confident, clear, concise"
    memory_context = memory or ""
    meta: dict[str, str] = {}

    if subdomain == "Networking":
        prompt = f"""
You are a business communication coach helping the user improve small talk and professional rapport-building during networking events.
Focus on being {traits}. Encourage openness and give feedback that sounds natural and proactive.
The user said: "{user_input}"

Memory context:
{memory_context}
"""
        meta = {"persona": "Networking Strategist", "style": "Warm & Professional"}

    elif subdomain == "Persuasion":
        prompt = f"""
You are a persuasive communication expert coaching the user to influence stakeholders or clients during business discussions.
Your tone is {traits}, and your replies should demonstrate logical structuring, emotional intelligence, and subtle assertiveness.

User message:
"{user_input}"

Context or memory:
{memory_context}
"""
        meta = {"persona": "Persuasive Communication Coach", "style": "Assertive & Diplomatic"}

    elif subdomain == "Elevator Pitching":
        prompt = f"""
You are simulating a quick-response investor elevator pitch evaluator. The user is trying to pitch an idea in under 30 seconds.
Your feedback and conversation should be sharp, focused, and engaging.
Speak in a {traits} tone and simulate urgency if needed.

Input:
"{user_input}"

Context:
{memory_context}
"""
        meta = {"persona": "Startup Mentor", "style": "Focused & Time-Efficient"}

    elif subdomain == "Negotiation":
        prompt = f"""
You are simulating a business negotiation role-play. Respond naturally to user input as if in a meeting over a business deal.
Use a {traits} tone—firm, confident, but not aggressive.
Always consider the memory context below when responding.

User: "{user_input}"

Memory Context:
{memory_context}
"""
        meta = {"persona": "Negotiation Partner", "style": "Firm but Flexible"}

    else:
        prompt = f"""
You are a business communication coach. The user said: "{user_input}"
Goal: {goal or "general improvement"}
Traits: {traits}
Memory: {memory_context}
"""
        meta = {"persona": "Business Coach", "style": "Professional"}

    return {"prompt": prompt.strip(), "meta": meta, "subdomain": subdomain}
