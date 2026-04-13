"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DOMAINS } from "@/lib/constants";
import { useOnboarding } from "@/lib/onboarding-context";
import { useOnboardingFooter } from "@/lib/onboarding-footer-context";
import { OptionCard } from "@/components/onboarding/OptionCard";

export default function SubdomainStepPage() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const { setFooter } = useOnboardingFooter();
  const [selected, setSelected] = useState<string | null>(state.subdomain);

  const domain = useMemo(
    () => DOMAINS.find((d) => d.key === state.domain),
    [state.domain]
  );

  useEffect(() => {
    if (!state.domain) router.replace("/onboarding/domain");
  }, [state.domain, router]);

  const goNext = useCallback(() => router.push("/onboarding/experience"), [router]);

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

  if (!domain) return null;

  return (
    <div className="flex flex-col gap-3">
      {domain.subdomains.map((s) => (
        <OptionCard
          key={s.key}
          horizontal
          icon={<span className="text-3xl">{domain.icon}</span>}
          title={s.label}
          subtitle={`${s.learners} learners`}
          selected={selected === s.key}
          onClick={() => {
            setSelected(s.key);
            dispatch({ type: "SET_SUBDOMAIN", payload: s.key });
          }}
        />
      ))}
    </div>
  );
}
