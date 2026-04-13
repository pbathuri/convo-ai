# services/reflection_engine.py

def generate_reflection(tone, lowest_trait, skill_averages, streak, progress):
    """
    Create a motivational reflection message based on user's tone, weakest skill trait,
    their skill progression averages, and current streak.

    Args:
        tone (str): Recent tone of the user (e.g. confident, hesitant, optimistic).
        lowest_trait (str): Trait needing the most improvement.
        skill_averages (dict): Average scores for each core communication trait.
        streak (int): Current active streak in days.
        progress (int): How many sessions completed today.

    Returns:
        str: Prompt for AI to generate personalized reflection.
    """

    # Compose a reflective system prompt string
    base_prompt = f"""
The user just completed a conversation challenge simulation.
Their overall tone today was '{tone}', and their lowest scoring skill was '{lowest_trait}'.

Here are their skill averages:
{skill_averages}

They have completed {progress} conversations today and have a {streak}-day streak.

Your task is to write a short, inspiring reflection message — 3 to 4 lines max — that motivates the user to continue improving while celebrating their effort today.

Use warm, encouraging, and empowering language. Tie in their progress and suggest what to work on next.
"""

    return base_prompt
