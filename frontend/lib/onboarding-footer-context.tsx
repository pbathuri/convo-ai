"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type FooterState = {
  disabled: boolean;
  onNext: () => void;
  label?: string;
};

const Ctx = createContext<{
  setFooter: (s: FooterState | null) => void;
  footer: FooterState | null;
} | null>(null);

export function OnboardingFooterProvider({ children }: { children: React.ReactNode }) {
  const [footer, setFooterState] = useState<FooterState | null>(null);
  const setFooter = useCallback((s: FooterState | null) => {
    setFooterState(s);
  }, []);
  const value = useMemo(() => ({ setFooter, footer }), [setFooter, footer]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOnboardingFooter() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOnboardingFooter requires provider");
  return c;
}
