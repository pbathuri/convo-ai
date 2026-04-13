"use client";

import { Send } from "lucide-react";
import { VoiceRecorder } from "./VoiceRecorder";
import { MascotAvatar } from "@/components/ui/MascotAvatar";
import { cn } from "@/lib/cn";
import styles from "./ChatInput.module.css";

export function ChatInput({
  value,
  onChange,
  onSend,
  recording,
  onToggleRecord,
  disabled,
  showListeningMascot,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  recording: boolean;
  onToggleRecord: () => void;
  disabled?: boolean;
  /** CURSOR_PROMPT: listening while waiting for the user — show beside composer when AI is idle after a user message. */
  showListeningMascot?: boolean;
}) {
  return (
    <div className="flex items-end gap-2 border-t border-border-light bg-white p-3 dark:border-border-dark dark:bg-bg-dark-card">
      {showListeningMascot && !recording ? (
        <div
          className="mb-1 flex flex-shrink-0 items-end"
          aria-label="Coach is listening"
        >
          <MascotAvatar mood="listening" size="sm" />
        </div>
      ) : null}
      <VoiceRecorder recording={recording} onToggle={onToggleRecord} />
      {recording ? (
        <div
          className={styles.waveform}
          role="status"
          aria-label="Recording — SCAFFOLD: connect Web Speech API or backend STT"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={styles.bar} />
          ))}
        </div>
      ) : (
        <textarea
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message..."
          className="max-h-24 min-h-[44px] flex-1 resize-none rounded-input border border-border-light bg-white px-3 py-2 text-sm dark:border-border-dark dark:bg-bg-dark dark:text-text-dark-primary"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
      )}
      <button
        type="button"
        disabled={disabled || recording || !value.trim()}
        onClick={onSend}
        className={cn(
          "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-green text-white disabled:opacity-40"
        )}
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
}
