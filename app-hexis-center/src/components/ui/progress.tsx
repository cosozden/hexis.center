"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Progress bar component — Hexis Design System
 * Minimal, no rounded corners, following HEXIS Web Palette rules.
 */
const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number; max?: number }
>(({ className, value = 0, max = 100, ...props }, ref) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("w-full bg-muted overflow-hidden", className)}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
