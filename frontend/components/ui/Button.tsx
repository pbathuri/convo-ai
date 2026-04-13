"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", fullWidth, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-btn font-bold uppercase tracking-wider transition-all duration-btn disabled:opacity-45 disabled:pointer-events-none";
    const variants: Record<Variant, string> = {
      primary:
        "bg-brand-green text-white border-b-4 border-brand-green-hover shadow-[0_2px_0_#46a302] hover:brightness-105 hover:scale-[1.02] active:scale-[0.98] py-4 px-8 text-lg rounded-xl",
      secondary:
        "bg-white text-text-secondary border-2 border-border-light hover:border-gray-400 py-4 px-8 text-base rounded-xl",
      ghost: "bg-transparent text-text-dark-secondary hover:text-text-dark-primary",
    };
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(base, variants[variant], fullWidth && "w-full", className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
