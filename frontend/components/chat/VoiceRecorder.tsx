"use client";

import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

// SCAFFOLD: Connect to Web Speech API or backend STT service

export function VoiceRecorder({
  recording,
  onToggle,
  className,
}: {
  recording: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand-green text-brand-green",
        recording && "border-brand-red text-brand-red",
        className
      )}
      animate={recording ? { scale: [1, 1.08, 1] } : undefined}
      transition={recording ? { duration: 0.8, repeat: Infinity } : undefined}
    >
      <Mic className="h-6 w-6" />
    </motion.button>
  );
}
