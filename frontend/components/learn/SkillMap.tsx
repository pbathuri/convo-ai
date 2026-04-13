"use client";

import { useRouter } from "next/navigation";
import { SkillBubble, type BubbleStatus } from "./SkillBubble";

export interface SkillNode {
  id: string;
  name: string;
  status: BubbleStatus;
  milestone?: boolean;
}

export function SkillMap({ skills }: { skills: SkillNode[] }) {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center gap-2 py-8">
      {skills.map((s, i) => (
        <div key={s.id} className="relative flex flex-col items-center">
          {i > 0 && (
            <div
              className={`mb-2 h-10 w-0.5 ${skills[i - 1].status === "locked" && s.status === "locked"
                  ? "border-l-2 border-dashed border-gray-400"
                  : "bg-brand-green/60"
                }`}
            />
          )}
          <SkillBubble
            name={s.name}
            status={s.status}
            milestone={s.milestone}
            offsetRight={i % 2 === 1}
            onClick={() => {
              if (s.status !== "locked") router.push(`/learn/chat?skill=${s.id}`);
            }}
          />
          <span className="mt-2 max-w-[120px] text-center text-xs font-semibold text-text-secondary">
            {s.name}
          </span>
        </div>
      ))}
    </div>
  );
}
