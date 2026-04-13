"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MascotAvatar } from "@/components/ui/MascotAvatar";
import type { MascotMood } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ChatMessage({
  role,
  content,
  typewriter,
  isLatestAssistant,
}: {
  role: "user" | "assistant";
  content: string;
  typewriter?: boolean;
  isLatestAssistant?: boolean;
}) {
  const [shown, setShown] = useState(typewriter && role === "assistant" ? "" : content);
  const [streamDone, setStreamDone] = useState(!typewriter || role !== "assistant");

  useEffect(() => {
    if (!typewriter || role !== "assistant") {
      setShown(content);
      setStreamDone(true);
      return;
    }
    setStreamDone(false);
    let i = 0;
    setShown("");
    const id = setInterval(() => {
      i += 1;
      setShown(content.slice(0, i));
      if (i >= content.length) {
        clearInterval(id);
        setStreamDone(true);
      }
    }, 20);
    return () => clearInterval(id);
  }, [content, typewriter, role]);

  const isUser = role === "user";

  let assistantMood: MascotMood = "speaking";
  if (role === "assistant") {
    if (isLatestAssistant) {
      assistantMood = streamDone ? "listening" : "speaking";
    } else {
      assistantMood = "speaking";
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("mb-3 flex gap-2", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="mt-1 flex-shrink-0">
          <MascotAvatar mood={assistantMood} size="sm" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-card",
          isUser
            ? "rounded-br-md bg-brand-green-light text-text-primary"
            : "rounded-bl-md border border-border-light bg-gray-100 text-text-primary dark:border-border-dark dark:bg-bg-dark-card dark:text-text-dark-primary"
        )}
      >
        {shown}
      </div>
    </motion.div>
  );
}
