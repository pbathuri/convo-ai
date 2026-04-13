"use client";

import { Coins } from "lucide-react";

export function XPBar({ xp, level }: { xp: number; level: number }) {
  const inLevel = xp % 100;
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-brand-gold">
      <Coins className="h-5 w-5" />
      <span>{xp} XP</span>
      <span className="text-text-dark-secondary">L{level}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/30">
        <div
          className="h-full rounded-full bg-brand-gold transition-all"
          style={{ width: `${inLevel}%` }}
        />
      </div>
    </div>
  );
}
