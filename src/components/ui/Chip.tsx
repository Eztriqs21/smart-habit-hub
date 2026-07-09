"use client";

import { cn } from "@/lib/utils/cn";

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  color?: string;
  size?: "sm" | "md";
  className?: string;
}

export function Chip({ label, selected, onClick, color, size = "md", className }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center font-medium rounded-full transition-all duration-150 cursor-pointer",
        {
          "h-7 px-3 text-[12px]": size === "sm",
          "h-8 px-3.5 text-[13px]": size === "md",
        },
        selected
          ? "text-white shadow-sm"
          : "bg-surface border border-border text-text-secondary hover:bg-surface-hover",
        onClick && "hover:shadow-sm",
        className
      )}
      style={
        selected && color
          ? { backgroundColor: color }
          : selected
          ? { backgroundColor: "var(--primary)" }
          : undefined
      }
    >
      {label}
    </button>
  );
}
