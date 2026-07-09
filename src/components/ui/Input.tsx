"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[14px] font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 px-3 rounded-[10px] border bg-surface text-foreground text-sm placeholder:text-text-muted transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            error ? "border-error" : "border-border hover:border-text-muted",
            className
          )}
          {...props}
        />
        {error && <p className="text-[13px] text-error">{error}</p>}
        {helperText && !error && (
          <p className="text-[13px] text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input, type InputProps };
