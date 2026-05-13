"use client";

import { create } from "zustand";
import { defaultPersonaId, type PersonaId } from "@/lib/personas";

type SessionState = {
  persona: PersonaId;
  setPersona: (p: PersonaId) => void;
  reset: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  persona: defaultPersonaId(),
  setPersona: (persona) => set({ persona }),
  reset: () => set({ persona: defaultPersonaId() }),
}));
