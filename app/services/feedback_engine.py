# services/feedback_engine.py

def build_feedback_prompt(goal, conversation_history, style="coach"):
    """
    Constructs a feedback prompt to be sent to the LLM for generating feedback.

    Args:
        goal (str): The user's selected goal for the conversation (e.g., impress a senior exec).
        conversation_history (list[str]): List of user turns from the conversation.
        style (str): Tone/style of feedback (e.g., "coach", "neutral", "cheerleader").

    Returns:
        str: A formatted prompt to request feedback from the AI.
    """

    latest_user_msg = conversation_history[-1] if conversation_history else ""
    recent_history = "\n".join([f"User: {msg}" for msg in conversation_history[-3:]])

    tone_instruction = {
        "coach": "Be supportive but constructive. Offer a single clear improvement tip.",
        "cheerleader": "Be super encouraging and positive. Emphasize what was done well.",
        "neutral": "Provide an objective summary of strengths and improvements."
    }.get(style, "Be constructive.")

    prompt = f"""
You are a communication coach.

The user is practicing a professional conversation simulation with the goal: "{goal}".

Here is their most recent interaction:
{recent_history}

Your task is to provide 1–2 lines of feedback that help them improve.

{tone_instruction}
"""

    return prompt
