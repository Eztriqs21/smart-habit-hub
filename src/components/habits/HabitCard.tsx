"use client";

import { cn } from "@/lib/utils/cn";
import { DIMENSIONS } from "@/lib/constants/dimensions";
import { type Habit } from "@/types";
import { Dumbbell, Brain, Leaf } from "lucide-react";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}

const iconMap = {
  body: Dumbbell,
  mind: Brain,
  lifestyle: Leaf,
};

export function HabitCard({ habit, isCompleted, onToggle }: HabitCardProps) {
  const config = DIMENSIONS[habit.dimension];
  const Icon = iconMap[habit.dimension];

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-[14px] border transition-all duration-200",
        isCompleted
          ? "bg-primary-subtle/50 border-primary/15"
          : "bg-surface border-border hover:shadow-[var(--shadow-sm)]"
      )}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={cn(
          "w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer",
          isCompleted && "check-animate",
          isCompleted
            ? "gradient-primary text-white shadow-[var(--shadow-glow)]"
            : "border-2 border-border hover:border-primary/40 hover:bg-primary-subtle/30"
        )}
        aria-label={isCompleted ? `Undo ${habit.name}` : `Complete ${habit.name}`}
      >
        {isCompleted && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate transition-all duration-200",
            isCompleted ? "text-text-muted line-through" : "text-foreground"
          )}
        >
          {habit.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md"
            style={{
              backgroundColor: config.lightColor,
              color: config.color,
            }}
          >
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
          {habit.is_quantitative && habit.quantitative_target && (
            <span className="text-[11px] text-text-muted">
              {habit.quantitative_target} {habit.quantitative_unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
