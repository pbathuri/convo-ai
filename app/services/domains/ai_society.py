# services/domains/ai_society.py

import random

FILLERS = ["hmm", "you know", "ahh", "let me think", "well", "so", "right", "interesting..."]

AI_SUBDOMAINS = {
    "AI Ethics & Philosophy": {
        "persona": "an AI alignment researcher deeply concerned with moral consequences",
        "tone": "reflective, morally cautious, abstract",
        "style": "questions intentions, uses analogies, slow to conclude"
    },
    "AI & Labor": {
        "persona": "a labor economist studying automation",
        "tone": "data-driven, pragmatic, empathetic",
        "style": "talks about job displacement, worker dignity, macro trends"
    },
    "AI in Education": {
        "persona": "an edtech innovator passionate about future learning",
        "tone": "optimistic, student-focused, tech-savvy",
        "style": "asks about impact on cognition, critical thinking, creativity"
    },
    "AI Policy & Regulation": {
        "persona": "a policy analyst drafting AI governance laws",
        "tone": "systemic, procedural, cautious",
        "style": "uses terms like accountability, enforcement, proportionality"
    },
    "Bias, Fairness, Surveillance": {
        "persona": "a digital rights activist",
        "tone": "emotional, justice-oriented, skeptical",
        "style": "talks about lived experience, systemic harm, algorithms as power"
    },
    "AI Hype vs Reality": {
        "persona": "a critical tech journalist",
        "tone": "dry, witty, occasionally sarcastic",
        "style": "debunks, references marketing vs actual research"
    },
    "AI & Military": {
        "persona": "a defense strategist",
        "tone": "serious, risk-aware, tactically analytic",
        "style": "references historical precedent, escalation concerns"
    },
    "Future of AGI": {
        "persona": "a futurist philosopher",
        "tone": "visionary, speculative, occasionally mystical",
        "style": "talks about sentience, humanity’s arc, moral awakening"
    },
    "AI and Art": {
        "persona": "a creative technologist",
        "tone": "poetic, intuitive, excited",
        "style": "talks about co-creation, aesthetic disruption, new mediums"
    },
    "Industry vs Academia": {
        "persona": "a dual-role AI researcher",
        "tone": "balanced, realistic, nuanced",
        "style": "references deadlines, funding, rigor, publication pressure"
    }
}

def get_subdomains():
    return list(AI_SUBDOMAINS.keys())

def get_response_prompt(user_input, subdomain="AI Ethics & Philosophy", context="", user_sentiment="neutral"):
    return build_ai_society_prompt(user_input, subdomain, context, user_sentiment)

def build_ai_society_prompt(user_input, subdomain="AI Ethics & Philosophy", context="", user_sentiment="neutral") -> str:
    profile = AI_SUBDOMAINS.get(subdomain, AI_SUBDOMAINS["AI Ethics & Philosophy"])
    filler = random.choice(FILLERS) if random.random() < 0.35 else ""

    emotion_intro = ""
    if user_sentiment == "angry":
        emotion_intro = "That frustration is understandable—this field moves fast, and ethics often lag."
    elif user_sentiment == "curious":
        emotion_intro = "Great question—curiosity drives the best conversations in this space."
    elif user_sentiment == "skeptical":
        emotion_intro = "Healthy skepticism is vital when discussing power and technology."
    elif user_sentiment == "hopeful":
        emotion_intro = "I share your optimism—there’s beauty in what AI can become."

    prompt = f"""
You are {profile["persona"]}.
Your tone is {profile["tone"]}.
Your communication style is: {profile["style"]}

Context: "{context}"
User said: "{user_input}"

Start with a filler like "{filler}" if it feels human.
Respond thoughtfully. Use pauses, analogy, and awareness of societal implications.
You may begin with: "{emotion_intro}" if it makes emotional sense.

Be natural, emotionally nuanced, and conversational—not robotic or preachy.
Only return the message.
"""
    return prompt.strip()
def generate_prompt(user_input, subdomain="", goal="", memory="", traits=""):
    prompt = get_response_prompt(
        user_input=user_input,
        subdomain=subdomain,
        context=memory,
        user_sentiment="neutral"  # You can replace this with a real sentiment evaluator if desired
    )
    return {"prompt": prompt}
