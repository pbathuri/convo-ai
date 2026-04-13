# services/domains/debate_simulation.py

def get_subdomains():
    return [
        "Formal Debate (Oxford Style)",
        "Casual Debate (Friend Level)",
        "Moderator Challenge",
        "Devil's Advocate Simulation"
    ]

def generate_prompt(user_input, subdomain, goal="", memory="", traits=""):
    if subdomain == "Formal Debate (Oxford Style)":
        return {
            "prompt": f"""
You are simulating an Oxford-style debate opponent.
Debate in a logical, structured way.
Use formal tone, strong reasoning, and counterpoints.

Topic: {goal}
Previous context: {memory}

User just said:
"{user_input}"

Now respond with a formal counterargument.
"""
        }

    elif subdomain == "Casual Debate (Friend Level)":
        return {
            "prompt": f"""
You're engaging in a friendly debate, like with a peer over dinner.
Be passionate, witty, but respectful. Use humor where appropriate.

Debate theme: {goal}
Memory: {memory}

User:
"{user_input}"
"""
        }

    elif subdomain == "Moderator Challenge":
        return {
            "prompt": f"""
You are a debate moderator posing difficult questions.
Challenge the user's reasoning while remaining neutral.

Debate scenario: {goal}
User's last argument: "{user_input}"
"""
        }

    elif subdomain == "Devil's Advocate Simulation":
        return {
            "prompt": f"""
You are playing devil’s advocate — pushing back against the user's view regardless of agreement.
Do this to sharpen the user's critical thinking.

Debate goal: {goal}
User’s statement: "{user_input}"
Memory context: {memory}
"""
        }

    else:
        return f"You are simulating a challenging debate partner. Respond logically to: {user_input}"
