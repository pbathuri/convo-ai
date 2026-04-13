"use client";

import { motion } from "framer-motion";
import type { MascotMood } from "@/lib/types";
import { cn } from "@/lib/cn";

const MOOD_SRC: Record<MascotMood, string> = {
  default: "/mascot/convo-default.svg",
  excited: "/mascot/convo-excited.svg",
  thinking: "/mascot/convo-thinking.svg",
  celebrating: "/mascot/convo-celebrating.svg",
  listening: "/mascot/convo-listening.svg",
  speaking: "/mascot/convo-speaking.svg",
};

const SIZE_PX = { sm: 32, md: 48, lg: 80, xl: 120 } as const;

export interface MascotAvatarProps {
  mood: MascotMood;
  size?: keyof typeof SIZE_PX;
  animate?: boolean;
  className?: string;
}

export function MascotAvatar({
  mood,
  size = "md",
  animate = false,
  className,
}: MascotAvatarProps) {
  const px = SIZE_PX[size];
  const src = MOOD_SRC[mood];

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={px}
      height={px}
      className={cn("select-none", className)}
      decoding="async"
      fetchPriority={size === "xl" ? "high" : "auto"}
    />
  );

  if (animate) {
    return (
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: px, height: px }}
        className="flex-shrink-0"
      >
        {img}
      </motion.div>
    );
  }

  return (
    <div style={{ width: px, height: px }} className="flex-shrink-0">
      {img}
    </div>
  );
}
