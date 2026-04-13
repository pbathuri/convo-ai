export interface OnboardingState {
  domain: string | null;
  subdomain: string | null;
  experienceLevel: string | null;
  discoverySource: string | null;
  learningGoal: string | null;
  skillLevel: string | null;
  dailyGoal: number | null;
  learningPath: string | null;
  currentStep: number;
}

export type OnboardingAction =
  | { type: "SET_DOMAIN"; payload: string }
  | { type: "SET_SUBDOMAIN"; payload: string }
  | { type: "SET_EXPERIENCE"; payload: string }
  | { type: "SET_DISCOVERY"; payload: string }
  | { type: "SET_GOAL"; payload: string }
  | { type: "SET_SKILL_LEVEL"; payload: string }
  | { type: "SET_DAILY"; payload: number }
  | { type: "SET_PATH"; payload: string }
  | { type: "SET_STEP"; payload: number }
  | { type: "HYDRATE"; payload: Partial<OnboardingState> }
  | { type: "RESET" };

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  complete?: boolean;
}

export interface SkillBubbleData {
  id: string;
  name: string;
  status: "completed" | "active" | "locked";
  xp: number;
  milestone?: boolean;
}

export interface ChatApiResponse {
  response: string;
  score: number;
  emotions: Record<string, number>;
  feedback: string[];
  xp_earned: number;
}

export type MascotMood =
  | "default"
  | "excited"
  | "thinking"
  | "celebrating"
  | "listening"
  | "speaking";
