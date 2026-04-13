"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0 }),
};

export function TransitionWrapper({
  children,
  routeKey,
  direction,
  className,
}: {
  children: React.ReactNode;
  routeKey: string;
  direction: number;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={routeKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
