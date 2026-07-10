import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = "text", width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton",
        {
          "rounded-lg": variant === "text",
          "rounded-[14px]": variant === "rectangular",
          "rounded-full": variant === "circular",
        },
        className
      )}
      style={{ width, height }}
    />
  );
}
