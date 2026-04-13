"use client";

import { OnboardingProvider } from "@/lib/onboarding-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}
