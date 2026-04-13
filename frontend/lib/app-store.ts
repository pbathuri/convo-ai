import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserApiPayload = Partial<
  Pick<
    AppState,
    "name" | "xp" | "streak" | "daily_goal" | "daily_progress" | "level" | "domain" | "subdomain"
  >
>;

export interface AppState {
  name: string;
  xp: number;
  streak: number;
  daily_goal: number;
  daily_progress: number;
  level: number;
  domain: string;
  subdomain: string;
  hearts: number;
  /** Set when GET /api/user merge runs (persisted). Learn layout fetch is gated per browser tab via sessionStorage. */
  userApiHydrated: boolean;
  setProfile: (p: Partial<Pick<AppState, "name" | "domain" | "subdomain">>) => void;
  addXp: (n: number) => void;
  setDailyProgress: (n: number) => void;
  syncFromOnboarding: (domain: string, subdomain: string) => void;
  hydrateFromUserApi: (data: UserApiPayload) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      name: "User",
      xp: 420,
      streak: 7,
      daily_goal: 10,
      daily_progress: 6,
      level: 5,
      domain: "business_communication",
      subdomain: "negotiation",
      hearts: 5,
      userApiHydrated: false,
      setProfile: (p) => set((s) => ({ ...s, ...p })),
      addXp: (n) => set((s) => ({ xp: s.xp + n })),
      setDailyProgress: (n) => set({ daily_progress: n }),
      syncFromOnboarding: (domain, subdomain) =>
        set({ domain, subdomain }),
      hydrateFromUserApi: (data) =>
        set((s) => ({
          ...s,
          userApiHydrated: true,
          ...data,
        })),
    }),
    { name: "convo-ai-app" }
  )
);
