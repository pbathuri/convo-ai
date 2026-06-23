def build_emotion_analysis_prompt(user_input: str, goal: str) -> str:
    """Ported from emotion_engine.py — returns LLM prompt for trait scoring."""
    return f'''You are an expert communication coach.

The user's goal is: "{goal}"
Here is their latest message:
"{user_input}"

Evaluate this message based on:
1. Confidence
2. Empathy
3. Clarity
4. Assertiveness
5. Positivity

Return a JSON object with scores from 0 to 10 for each trait and a one-sentence coaching insight.
Only output JSON in this format:
{{
  "confidence": 0-10,
  "empathy": 0-10,
  "clarity": 0-10,
  "assertiveness": 0-10,
  "positivity": 0-10,
  "insight": "..."
}}'''
