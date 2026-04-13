"use client";

import { motion } from "framer-motion";
import { MascotAvatar } from "@/components/ui/MascotAvatar";

export function HeroIllustration() {
  return (
    <div className="relative flex h-[min(320px,70vw)] w-[min(320px,70vw)] items-center justify-center md:h-[340px] md:w-[340px]">
      <motion.div
        className="absolute left-[8%] top-[10%] h-14 w-14 rounded-full bg-brand-blue/25"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[6%] top-[14%] h-10 w-10 rounded-full bg-brand-orange/30"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.div
        className="absolute bottom-[16%] left-[4%] h-12 w-12 rounded-2xl border-2 border-brand-green/40 bg-brand-green-light/30"
        animate={{ rotate: [0, 4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg
        className="absolute bottom-[12%] right-[10%] h-16 w-20 text-brand-green/35"
        viewBox="0 0 80 60"
        aria-hidden
      >
        <path
          d="M10 8h50c6 0 10 4 10 10v22c0 6-4 10-10 10H34L22 52l4-12H10c-6 0-10-4-10-10V18c0-6 4-10 10-10z"
          fill="currentColor"
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center rounded-[2rem] border-4 border-white bg-gradient-to-br from-brand-green-light/40 to-white p-6 shadow-card-hover">
        <MascotAvatar mood="default" size="xl" animate />
      </div>
    </div>
  );
}
