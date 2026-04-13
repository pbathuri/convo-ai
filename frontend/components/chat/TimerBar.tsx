"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function TimerBar({
  elapsedSec,
  totalSec,
}: {
  elapsedSec: number;
  totalSec: number;
}) {
  const ratio = totalSec > 0 ? Math.min(1, elapsedSec / totalSec) : 0;
  const color =
    ratio < 0.5 ? "bg-brand-green" : ratio < 0.85 ? "bg-brand-orange" : "bg-brand-red";
  const left = Math.max(0, totalSec - elapsedSec);
  const pulse = left <= 30 && left > 0;

  return (
    <div className="mb-2 w-full">
      <div className="mb-1 flex justify-between text-xs font-semibold text-text-secondary">
        <span>
          {Math.floor(elapsedSec / 60)}:{String(elapsedSec % 60).padStart(2, "0")} /{" "}
          {Math.floor(totalSec / 60)}:{String(totalSec % 60).padStart(2, "0")}
        </span>
      </div>
      <motion.div
        className="h-2 w-full overflow-hidden rounded-full bg-black/10"
        animate={pulse ? { opacity: [1, 0.85, 1] } : undefined}
        transition={pulse ? { duration: 1, repeat: Infinity } : undefined}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-300", color)}
          style={{ width: `${ratio * 100}%` }}
        />
      </motion.div>
    </div>
  );
}
