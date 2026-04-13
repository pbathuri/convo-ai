"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { MascotAvatar } from "@/components/ui/MascotAvatar";
import type { ChatMessage as Msg } from "@/lib/types";

export function ChatContainer({
  messages,
  typing,
}: {
  messages: Msg[];
  typing?: boolean;
}) {
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const lastId = messages.length ? messages[messages.length - 1].id : "";

  return (
    <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {messages.map((m) => (
        <ChatMessage
          key={m.id}
          role={m.role}
          content={m.content}
          typewriter={m.role === "assistant" && m.id === lastId}
          isLatestAssistant={m.role === "assistant" && m.id === lastId}
        />
      ))}
      {typing && (
        <div className="mb-3 flex items-center gap-2 text-text-secondary">
          <MascotAvatar mood="speaking" size="sm" />
          <LoadingDots />
        </div>
      )}
      <div ref={bottom} />
    </div>
  );
}
