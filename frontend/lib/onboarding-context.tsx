"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { OnboardingAction, OnboardingState } from "@/lib/types";

const STORAGE_KEY = "convo-ai-onboarding";

const initialState: OnboardingState = {
  domain: null,
  subdomain: null,
  experienceLevel: null,
  discoverySource: null,
  learningGoal: null,
  skillLevel: null,
  dailyGoal: null,
  learningPath: null,
  currentStep: 1,
};

function reducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case "SET_DOMAIN":
      return { ...state, domain: action.payload };
    case "SET_SUBDOMAIN":
      return { ...state, subdomain: action.payload };
    case "SET_EXPERIENCE":
      return { ...state, experienceLevel: action.payload };
    case "SET_DISCOVERY":
      return { ...state, discoverySource: action.payload };
    case "SET_GOAL":
      return { ...state, learningGoal: action.payload };
    case "SET_SKILL_LEVEL":
      return { ...state, skillLevel: action.payload };
    case "SET_DAILY":
      return { ...state, dailyGoal: action.payload };
    case "SET_PATH":
      return { ...state, learningPath: action.payload };
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "HYDRATE":
      return { ...state, ...action.payload };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

type Ctx = {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
};

const OnboardingContext = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<OnboardingState>;
        dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return ctx;
}
