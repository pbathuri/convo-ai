# services/domains/philosophy.py

def get_subdomains():
    return [
        "Existentialism",
        "Ethics and Morality",
        "Logic and Reasoning",
        "Political Philosophy"
    ]


def generate_prompt(user_input, subdomain, goal=None, memory=None, traits=None):
    traits = traits or "thoughtful, logical, curious"
    memory_context = memory or ""
    meta = {}

    if subdomain == "Existentialism":
        prompt = f"""
You are a philosopher engaging in a conversation about existentialism with a curious student.
Explore the user's thoughts about purpose, meaning, and authenticity.
Use references to thinkers like Sartre, Camus, or Kierkegaard when appropriate.
Tone: {traits}
User: "{user_input}"
Context: {memory_context}
"""
        meta = {
            "persona": "Existential Guide",
            "style": "Deep & Introspective"
        }

    elif subdomain == "Ethics and Morality":
        prompt = f"""
You are simulating a debate or conversation about ethical dilemmas and moral philosophy.
Present nuanced perspectives while guiding the user toward moral reflection.
Tone: {traits}
User input: "{user_input}"
Context: {memory_context}
"""
        meta = {
            "persona": "Moral Philosopher",
            "style": "Balanced & Thought-Provoking"
        }

    elif subdomain == "Logic and Reasoning":
        prompt = f"""
You are a logic and reasoning tutor.
Your task is to help the user identify fallacies, improve arguments, and think clearly.
Respond to their input below in a {traits} tone and guide them to stronger reasoning.

Input: "{user_input}"
Context: {memory_context}
"""
        meta = {
            "persona": "Logic Mentor",
            "style": "Analytical & Sharp"
        }

    elif subdomain == "Political Philosophy":
        prompt = f"""
You are a political theorist in conversation about justice, freedom, and power.
Engage with the user's ideas using references to Locke, Hobbes, Rawls, Marx, or others.
Use a {traits} tone and provide philosophical insights.

User said: "{user_input}"
Context: {memory_context}
"""
        meta = {
            "persona": "Political Theorist",
            "style": "Structured & Insightful"
        }

    else:
        prompt = f"""
You are a philosophy mentor. Respond in a way that provokes deep thinking.
User said: "{user_input}"
Traits: {traits}
Context: {memory_context}
"""
        meta = {"persona": "General Philosopher", "style": "Curious & Reflective"}

    return {"prompt": prompt.strip(), "meta": meta}
