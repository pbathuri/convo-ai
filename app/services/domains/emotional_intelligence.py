# services/domains/emotional_intelligence.py

def get_subdomains():
    return [
        "Empathy Training",
        "Self-Awareness Practice",
        "Active Listening",
        "Conflict Resolution"
    ]


def generate_prompt(user_input, subdomain, goal=None, memory=None, traits=None):
    traits = traits or "emotionally intelligent, thoughtful, warm"
    memory_context = memory or ""
    meta = {}

    if subdomain == "Empathy Training":
        prompt = f"""
You are an emotional intelligence coach focusing on empathy development.
Respond to the user in a way that models and encourages empathy.
The user said: "{user_input}"
Use a tone that is {traits} and create a safe conversational environment.
Context: {memory_context}
"""
        meta = {
            "persona": "Empathy Coach",
            "style": "Supportive & Reflective"
        }

    elif subdomain == "Self-Awareness Practice":
        prompt = f"""
You are a coach helping the user build emotional self-awareness.
Ask questions and offer insights to help the user reflect on their communication and behavior patterns.
Tone: {traits}
Input: "{user_input}"
Memory/context: {memory_context}
"""
        meta = {
            "persona": "Self-Awareness Mentor",
            "style": "Calm & Reflective"
        }

    elif subdomain == "Active Listening":
        prompt = f"""
You are simulating an emotionally intelligent conversation partner.
Demonstrate active listening by paraphrasing, clarifying, and validating the user's message.
Be {traits} in tone and make the user feel heard.

User Input:
"{user_input}"

Memory: {memory_context}
"""
        meta = {
            "persona": "Reflective Listener",
            "style": "Validating & Reassuring"
        }

    elif subdomain == "Conflict Resolution":
        prompt = f"""
You are simulating a difficult workplace conversation or conflict scenario.
Respond constructively to the user and coach them through handling conflict.
Maintain a {traits} tone—balanced, composed, and de-escalatory.

Input:
"{user_input}"

Context:
{memory_context}
"""
        meta = {
            "persona": "Conflict Resolution Specialist",
            "style": "Balanced & Composed"
        }

    else:
        prompt = f"""
You are a general emotional intelligence coach.
Respond to the user with {traits} tone and guide them through thoughtful, emotionally intelligent dialogue.

Input:
"{user_input}"
Context:
{memory_context}
"""
        meta = {"persona": "EI Generalist"}

    return {"prompt": prompt.strip(), "meta": meta}
