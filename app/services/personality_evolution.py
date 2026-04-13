# services/personality_evolution.py

def evaluate_user_tone(user_input):
    """
    Analyzes the user's tone based on emotional or contextual cues in the input.
    Used to simulate AI adapting its conversational personality.
    """
    input_lower = user_input.lower()

    if any(word in input_lower for word in ["uh", "um", "not sure", "maybe"]):
        return "hesitant"
    elif any(word in input_lower for word in ["i think", "perhaps", "kind of"]):
        return "cautious"
    elif any(word in input_lower for word in ["you never", "you always", "seriously"]):
        return "frustrated"
    elif any(word in input_lower for word in ["i love", "excited", "so cool"]):
        return "enthusiastic"
    elif any(word in input_lower for word in ["let’s go", "we got this", "i can do this"]):
        return "confident"
    elif any(word in input_lower for word in ["help", "struggling", "i need advice"]):
        return "vulnerable"
    else:
        return "neutral"
