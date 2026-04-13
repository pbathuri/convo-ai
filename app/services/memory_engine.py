# services/memory_engine.py

def update_memory(memory, user_input, ai_response, tone, score, feedback):
    """
    Append a new conversation turn to memory.
    
    Parameters:
      memory (list): List of previous conversation turns (each a dict).
      user_input (str): The user's input message.
      ai_response (str): The AI's response message.
      tone (str): A short string describing the user's tone (from evaluate_user_tone).
      score (int): The favorability score for this turn.
      feedback (str): The feedback text for this turn.
    
    Returns:
      list: The updated memory list (optionally limited to the last N turns).
    """
    new_turn = {
        "user": user_input,
        "ai": ai_response,
        "tone": tone,
        "score": score,
        "feedback": feedback
    }
    memory.append(new_turn)
    # Limit memory to the last 10 turns to keep the prompt size manageable.
    return memory[-10:]


def get_memory_context(memory):
    """
    Build a formatted memory context string from the memory list.
    
    Parameters:
      memory (list): A list of conversation turns.
    
    Returns:
      str: A string summarizing the past turns.
    """
    context = ""
    for turn in memory:
        context += f"User: {turn['user']}\nAI: {turn['ai']}\n"
    return context
