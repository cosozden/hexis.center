"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, accent, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "border border-border bg-card text-card-foreground",
        accent && "border-primary/30",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export { Card };
