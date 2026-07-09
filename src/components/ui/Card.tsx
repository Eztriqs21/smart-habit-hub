import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  active?: boolean;
}

export function Card({ className, hover, active, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-[10px] p-5 transition-all duration-150",
        hover && "hover:shadow-sm hover:-translate-y-0.5 cursor-pointer",
        active && "bg-surface-active border-primary",
        className
      )}
      {...props}
    />
  );
}
