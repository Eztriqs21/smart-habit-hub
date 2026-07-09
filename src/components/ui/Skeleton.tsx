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
          "rounded-md": variant === "text",
          "rounded-[10px]": variant === "rectangular",
          "rounded-full": variant === "circular",
        },
        className
      )}
      style={{ width, height }}
    />
  );
}
