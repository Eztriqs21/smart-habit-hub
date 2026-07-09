"use client";

import { cn } from "@/lib/utils/cn";
import { DIMENSIONS } from "@/lib/constants/dimensions";
import { type Habit } from "@/types";
import { Dumbbell, Brain, Leaf, Flame } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-[10px] border transition-all duration-200",
        isCompleted
          ? "bg-primary-subtle border-primary/20"
          : "bg-surface border-border hover:shadow-sm"
      )}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer",
          animate && "scale-110",
          isCompleted
            ? "bg-primary text-white"
            : "border-2 border-border hover:border-primary/50"
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
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "text-sm font-medium truncate transition-all duration-200",
              isCompleted ? "text-text-muted line-through" : "text-foreground"
            )}
          >
            {habit.name}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Icon className="w-3 h-3" style={{ color: config.color }} />
          <span className="text-[12px] text-text-muted">{config.label}</span>
          {habit.is_quantitative && habit.quantitative_target && (
            <span className="text-[12px] text-text-muted">
              · {habit.quantitative_target} {habit.quantitative_unit}
            </span>
          )}
        </div>
      </div>

      {/* Streak badge placeholder - will be added in Phase 4 */}
    </div>
  );
}
