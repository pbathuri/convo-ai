"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useOnboarding } from "@/lib/onboarding-context";
import { useOnboardingFooter } from "@/lib/onboarding-footer-context";
import { OptionCard } from "@/components/onboarding/OptionCard";

const PATHS = [
  {
    key: "start_fresh",
    title: "Start from the beginning",
    sub: "Take the first lesson and build your skills step by step",
    icon: "\u{1F4D7}",
  },
  {
    key: "assess_level",
    title: "Assess my level",
    sub: "Take a quick assessment so we know where to start",
    icon: "\u{1F3AF}",
  },
] as const;

export default function PathStepPage() {
  const router = useRouter();
  const { dispatch } = useOnboarding();
  const { setFooter } = useOnboardingFooter();
  const [selected, setSelected] = useState<string | null>(null);

  const goNext = useCallback(() => router.push("/onboarding/ready"), [router]);

  useEffect(() => {
    setFooter({
      disabled: !selected,
      onNext: goNext,
    });
    return () => setFooter(null);
  }, [selected, setFooter, goNext]);

  useEffect(() => {
    if (!selected) return;
    const t = setTimeout(goNext, 400);
    return () => clearTimeout(t);
  }, [selected, goNext]);

  return (
    <div className="flex flex-col gap-4">
      {PATHS.map((p) => (
        <OptionCard
          key={p.key}
          horizontal
          className="!p-6"
          icon={<span className="text-3xl">{p.icon}</span>}
          title={p.title}
          subtitle={p.sub}
          selected={selected === p.key}
          onClick={() => {
            setSelected(p.key);
            dispatch({ type: "SET_PATH", payload: p.key });
          }}
        />
      ))}
    </div>
  );
}
