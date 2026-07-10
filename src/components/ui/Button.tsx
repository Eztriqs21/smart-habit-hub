"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glow";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-[10px] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none",
          {
            "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md active:scale-[0.98]":
              variant === "primary",
            "bg-transparent text-primary border border-primary/30 hover:bg-primary-subtle hover:border-primary/50 active:scale-[0.98]":
              variant === "secondary",
            "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-surface-active":
              variant === "ghost",
            "bg-error text-white hover:bg-error/90 shadow-sm active:scale-[0.98]":
              variant === "danger",
            "bg-primary text-white shadow-[var(--shadow-glow)] hover:shadow-[0_0_32px_rgba(45,106,79,0.25)] hover:bg-primary-hover active:scale-[0.98]":
              variant === "glow",
          },
          {
            "h-8 px-3 text-[13px] gap-1.5 rounded-lg": size === "sm",
            "h-10 px-4 text-sm gap-2": size === "md",
            "h-12 px-6 text-base gap-2.5": size === "lg",
            "h-10 w-10 p-0 rounded-full": size === "icon",
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button, type ButtonProps };
