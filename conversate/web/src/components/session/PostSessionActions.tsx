"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  sessionId: string;
  onEnd: () => void;
  onRate?: (rating: number) => void;
};

export function PostSessionActions({ sessionId, onEnd, onRate }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" onClick={onEnd}>
        End session
      </Button>
      <Link href={`/sessions/${sessionId}`}>
        <Button type="button" variant="secondary">
          View session
        </Button>
      </Link>
      {onRate ? (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Button
              key={n}
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onRate(n)}
            >
              {n}★
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
