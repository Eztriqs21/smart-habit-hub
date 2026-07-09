"use client";

import { cn } from "@/lib/utils/cn";
import { DIMENSIONS } from "@/lib/constants/dimensions";
import { type Dimension } from "@/types";
import { Dumbbell, Brain, Leaf } from "lucide-react";

interface DimensionBarProps {
  dimension: Dimension;
  score: number;
  compact?: boolean;
}

const iconMap = {
  body: Dumbbell,
  mind: Brain,
  lifestyle: Leaf,
};

export function DimensionBar({ dimension, score, compact }: DimensionBarProps) {
  const config = DIMENSIONS[dimension];
  const Icon = iconMap[dimension];

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium",
          "border border-border bg-surface"
        )}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
        <span className="text-text-secondary">{config.label}</span>
        <span
          className="w-16 h-1.5 rounded-full bg-border overflow-hidden"
        >
          <span
            className="h-full rounded-full transition-all duration-400"
            style={{
              width: `${score}%`,
              backgroundColor: config.color,
            }}
          />
        </span>
        <span className="text-text-muted">{score}%</span>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-[10px] p-4">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: config.lightColor }}
        >
          <Icon className="w-4 h-4" style={{ color: config.color }} />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{config.label}</p>
          <p className="text-xs text-text-muted">{score}% completed</p>
        </div>
      </div>
      <div className="w-full h-2 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${score}%`,
            backgroundColor: config.color,
          }}
        />
      </div>
    </div>
  );
}
