"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "prohibited" | "high" | "limited" | "gpai" | "minimal";
}

const VARIANT_STYLES: Record<string, string> = {
  default: "bg-muted text-muted-foreground border-border",
  prohibited: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  limited: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  gpai: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  minimal: "bg-green-500/10 text-green-400 border-green-500/20",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border",
        VARIANT_STYLES[variant] || VARIANT_STYLES.default,
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

export { Badge };
