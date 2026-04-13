"use client";

import { motion } from "framer-motion";
import { Lock, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/cn";

export type BubbleStatus = "completed" | "active" | "locked";

export function SkillBubble({
  name,
  status,
  milestone,
  offsetRight,
  onClick,
}: {
  name: string;
  status: BubbleStatus;
  milestone?: boolean;
  offsetRight?: boolean;
  onClick?: () => void;
}) {
  const size = milestone ? "h-20 w-20" : "h-16 w-16";
  const bg =
    status === "completed"
      ? "bg-brand-green text-white"
      : status === "active"
        ? "bg-brand-blue text-white shadow-[0_0_20px_rgba(28,176,246,0.45)]"
        : "bg-gray-500 text-white grayscale";

  return (
    <motion.button
      type="button"
      whileHover={status !== "locked" ? { scale: 1.06 } : undefined}
      animate={
        status === "active"
          ? { y: [0, -4, 0] }
          : status === "locked"
            ? { opacity: [0.65, 0.9, 0.65] }
            : milestone
              ? { boxShadow: ["0 0 0 0 rgba(255,200,0,0.4)", "0 0 24px 4px rgba(255,200,0,0.35)", "0 0 0 0 rgba(255,200,0,0.4)"] }
              : undefined
      }
      transition={
        status === "active"
          ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
          : status === "locked"
            ? { duration: 2.5, repeat: Infinity }
            : milestone
              ? { duration: 2, repeat: Infinity }
              : undefined
      }
      disabled={status === "locked"}
      onClick={onClick}
      className={cn(
        "relative flex flex-shrink-0 items-center justify-center rounded-full border-2 border-white/20 font-bold shadow-card-dark",
        size,
        bg,
        offsetRight ? "ml-8" : "mr-8"
      )}
      title={name}
    >
      {milestone ? <Trophy className="h-8 w-8" /> : null}
      {!milestone && status === "completed" ? <Star className="h-6 w-6 fill-white" /> : null}
      {!milestone && status === "locked" ? <Lock className="h-6 w-6" /> : null}
      {!milestone && status === "active" ? (
        <span className="text-xs font-extrabold">GO</span>
      ) : null}
    </motion.button>
  );
}
