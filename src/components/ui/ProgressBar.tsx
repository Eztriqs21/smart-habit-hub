import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md";
  color?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  color,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(value / max, 0), 1) * 100;

  return (
    <div
      className={cn(
        "w-full bg-border rounded-full overflow-hidden",
        { "h-1.5": size === "sm", "h-2": size === "md" },
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-all duration-400 ease-out"
        style={{
          width: `${percentage}%`,
          backgroundColor: color || "var(--primary)",
        }}
      />
    </div>
  );
}
