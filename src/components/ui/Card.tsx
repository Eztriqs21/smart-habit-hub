import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  active?: boolean;
  glass?: boolean;
  gradientBorder?: boolean;
}

export function Card({ className, hover, active, glass, gradientBorder, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[14px] p-5 transition-all duration-200",
        !glass && !gradientBorder && "bg-surface border border-border",
        glass && "glass bg-surface/60 border border-white/10 dark:border-white/5",
        gradientBorder && "bg-surface border-gradient",
        hover && "hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 cursor-pointer",
        active && "bg-surface-active border-primary ring-1 ring-primary/20",
        className
      )}
      {...props}
    />
  );
}
