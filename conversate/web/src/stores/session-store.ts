"use client";

import { create } from "zustand";
import type { PersonaSlug } from "@/lib/personas";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type SessionState = {
  persona: PersonaSlug;
  openingLine: string;
  messages: ChatMessage[];
  setPersona: (p: PersonaSlug) => void;
  setOpeningLine: (s: string) => void;
  addMessage: (m: Omit<ChatMessage, "id">) => void;
  reset: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  persona: "coach",
  openingLine: "",
  messages: [],
  setPersona: (persona) => set({ persona }),
  setOpeningLine: (openingLine) => set({ openingLine }),
  addMessage: (m) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { ...m, id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()) },
      ],
    })),
  reset: () => set({ messages: [], openingLine: "" }),
}));
