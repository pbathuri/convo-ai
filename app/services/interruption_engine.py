# services/interruption_engine.py

import random

INTERRUPTION_STYLES = [
    "Occasionally cut the user off if they ramble.",
    "Interrupt politely if the user's message is too long.",
    "Jump in emotionally if the user makes a bold claim.",
    "If the user repeats themselves, respond with mild irritation.",
    "Cut in playfully if the conversation gets dry.",
    "Don’t wait for the user to finish if you have something urgent to say."
]

def get_interruption_behavior(length_threshold=20):
    """
    Returns a style of interruption if user's message is long or randomly decided.
    """
    use_interrupt = random.random() < 0.4  # 40% chance to interrupt
    if use_interrupt:
        return random.choice(INTERRUPTION_STYLES)
    return None
