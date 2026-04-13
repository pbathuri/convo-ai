export const LOADING_FUN_FACTS = [
  "Convo AI has helped 50K+ users improve their communication skills.",
  "Short daily practice beats long occasional sessions for skill retention.",
  "Active listening is ranked among the top skills by hiring managers worldwide.",
  "Users who set a daily goal are 3× more likely to stick with practice.",
] as const;

export const DEFAULT_FIRST_PROMPT =
  "Tell me about yourself in a business setting.";

export const CELEBRATION_MESSAGES: Record<string, string> = {
  complete_beginner:
    "Since you're new here, we'll start with the fundamentals — you've got this!",
  some_exposure:
    "Since you know a few basic concepts, let's start building from there!",
  intermediate: "Great foundation — let's level up your conversation skills!",
  advanced: "Impressive — we'll focus on nuance and real-world scenarios!",
  default: "You're all set — let's jump into your first practice!",
};
