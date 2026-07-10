"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StreakBadgeProps {
  count: number;
  className?: string;
}

export function StreakBadge({ count, className }: StreakBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold",
        "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400",
        "border border-amber-200/50 dark:border-amber-500/20",
        className
      )}
    >
      <Flame className="w-3 h-3" />
      {count}
    </span>
  );
}
