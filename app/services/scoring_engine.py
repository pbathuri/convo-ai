# services/scoring_engine.py

def build_score_prompt(goal, user_input, scoring_mode="basic"):
    """
    Builds a prompt for scoring the user's performance.

    Args:
        goal (str): The stated goal for the conversation.
        user_input (str): The user's most recent response.
        scoring_mode (str): "basic", "formal", or "assertive" — can be extended.

    Returns:
        str: A prompt string to send to the LLM.
    """

    tone_instruction = {
        "basic": "Score this based on clarity, relevance, confidence, and tone.",
        "formal": "Score based on professional tone, structure, and conciseness.",
        "assertive": "Score based on strength of persuasion and confidence of delivery."
    }.get(scoring_mode, "Score this on clarity, tone, and relevance.")

    prompt = f"""
You are an expert communication evaluator.

Evaluate the following response for how effectively it helps the user achieve the goal: "{goal}"

User's response:
"{user_input}"

{tone_instruction}

Return only a number between 0 and 100. No words.
"""

    return prompt
