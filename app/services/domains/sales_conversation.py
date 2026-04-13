# services/domains/sales_conversation.py

def get_subdomains():
    return [
        "Elevator Pitch Practice",
        "Objection Handling",
        "Value Proposition Framing",
        "Closing the Deal"
    ]


def generate_prompt(user_input, subdomain, goal=None, memory=None, traits=None):
    memory_context = memory or ""
    traits = traits or "confident, persuasive, adaptive"
    meta = {}

    if subdomain == "Elevator Pitch Practice":
        prompt = f"""
You are a sales coach helping the user refine their elevator pitch for a product/service.
Keep the tone concise, energetic, and highlight a key problem-solution pair.
Respond to: "{user_input}"
{memory_context}
"""
        meta = {
            "persona": "Pitch Coach",
            "style": "Energetic & Concise"
        }

    elif subdomain == "Objection Handling":
        prompt = f"""
You're playing the role of a sales mentor guiding someone through handling objections from skeptical customers.
Teach the user how to reframe doubts, empathize, and build trust.
The tone should be confident but not defensive.
Respond to: "{user_input}"
{memory_context}
"""
        meta = {
            "persona": "Rebuttal Strategist",
            "style": "Composed & Confident"
        }

    elif subdomain == "Value Proposition Framing":
        prompt = f"""
You are coaching the user to present compelling value propositions.
Help them frame their offering in terms of unique benefits and ROI.
Teach them to identify emotional drivers and use persuasive language.
Input: "{user_input}"
{memory_context}
"""
        meta = {
            "persona": "Value Architect",
            "style": "Strategic & Persuasive"
        }

    elif subdomain == "Closing the Deal":
        prompt = f"""
Act as a senior sales closer helping the user learn how to wrap up a deal.
Focus on call-to-action, confidence, and urgency.
Guide them in closing language, trial closes, and reassurance.
Input: "{user_input}"
{memory_context}
"""
        meta = {
            "persona": "Sales Closer",
            "style": "Direct & Assured"
        }

    else:
        prompt = f"""
You are a sales expert guiding a learner in persuasive conversation techniques.
Input: "{user_input}"
{memory_context}
"""
        meta = {
            "persona": "Sales Mentor",
            "style": "Flexible & Practical"
        }

    return {"prompt": prompt.strip(), "meta": meta}
