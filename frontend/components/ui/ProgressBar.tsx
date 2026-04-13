"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  className,
  thin,
}: {
  value: number;
  className?: string;
  thin?: boolean;
}) {
  const h = thin ? "h-1" : "h-2";
  return (
    <div className={cn("w-full overflow-hidden rounded-full bg-black/20", h, className)}>
      <motion.div
        className={cn("h-full rounded-full bg-brand-green", thin && "shadow-[0_0_8px_rgba(88,204,2,0.5)]")}
        initial={false}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}
