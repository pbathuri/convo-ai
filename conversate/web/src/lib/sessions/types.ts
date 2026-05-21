import type { Difficulty, InterviewMode, PersonaId } from "@/lib/personas";

export type SessionStatus =
  | "created"
  | "preflight"
  | "connecting"
  | "live"
  | "ending"
  | "completed"
  | "failed"
  | "abandoned";

export type CreateSessionInput = {
  personaId: PersonaId;
  userId?: string;
  interviewMode?: InterviewMode;
  difficulty?: Difficulty;
};

export type SessionSummary = {
  id: string;
  personaId: string;
  status: SessionStatus;
  interviewMode: string;
  difficulty: string;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
};
