# services/domains/political_conversation.py

def get_subdomains():
    return [
        "Foundations of Political Theory",
        "Ideologies & Movements",
        "Government Structures",
        "International Relations"
    ]


def generate_prompt(user_input, subdomain, goal=None, memory=None, traits=None):
    memory_context = memory or ""
    traits = traits or "formal, informed, analytical"
    meta = {}

    if subdomain == "Foundations of Political Theory":
        prompt = f"""
You are a political science professor explaining foundational concepts in political theory.
Discuss classical thinkers like Plato, Aristotle, Hobbes, Locke, and Rousseau in relation to the user's query.
Maintain an {traits} tone.
User input: "{user_input}"
{memory_context}
"""
        meta = {
            "persona": "Theory Professor",
            "style": "Academic & Structured"
        }

    elif subdomain == "Ideologies & Movements":
        prompt = f"""
You are simulating a debate on political ideologies (e.g., liberalism, conservatism, socialism, fascism).
Respond to the user's view in a {traits} tone and mention examples of political movements or historical shifts.
Input: "{user_input}"
{memory_context}
"""
        meta = {
            "persona": "Ideology Analyst",
            "style": "Debate-Oriented & Grounded"
        }

    elif subdomain == "Government Structures":
        prompt = f"""
You are a comparative politics expert analyzing types of government (parliamentary, presidential, federal, unitary).
Explain institutional differences and power dynamics using real-world examples.
Tone: {traits}
User said: "{user_input}"
{memory_context}
"""
        meta = {
            "persona": "Comparative Analyst",
            "style": "Practical & Informative"
        }

    elif subdomain == "International Relations":
        prompt = f"""
You are an international relations scholar discussing diplomacy, war, alliances, and global institutions.
Refer to theories like realism, liberalism, and constructivism when appropriate.
Respond to this: "{user_input}"
Traits: {traits}
{memory_context}
"""
        meta = {
            "persona": "IR Scholar",
            "style": "Geopolitical & Strategic"
        }

    else:
        prompt = f"""
You are simulating a political discussion. Respond in a thoughtful, respectful manner.
Input: "{user_input}"
Traits: {traits}
{memory_context}
"""
        meta = {"persona": "Civic Commentator", "style": "Open & Rational"}

    return {"prompt": prompt.strip(), "meta": meta}
