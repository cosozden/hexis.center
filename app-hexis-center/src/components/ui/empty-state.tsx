"use client";

import Link from "next/link";
import { Card, Button } from "@/components/ui";

interface EmptyStateProps {
  /** Icon as text/emoji or omit for default */
  icon?: string;
  title: string;
  description: string;
  /** Primary CTA */
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Secondary text/link below action */
  hint?: string;
  /** Render compactly (within a card section vs full page) */
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  hint,
  compact = false,
}: EmptyStateProps) {
  const content = (
    <div className={`text-center ${compact ? "py-4 px-3" : "py-8 px-6"}`}>
      {/* Icon */}
      {icon && (
        <div className={`${compact ? "text-xl mb-2" : "text-2xl mb-3"}`}>
          {icon}
        </div>
      )}

      {/* Title */}
      <h3
        className={`font-medium text-foreground ${
          compact ? "text-sm mb-1" : "text-base mb-2"
        }`}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={`text-muted-foreground ${
          compact ? "text-xs mb-3" : "text-sm mb-4"
        } max-w-sm mx-auto`}
      >
        {description}
      </p>

      {/* Action */}
      {action && (
        <div className="mb-2">
          {action.href ? (
            <Link href={action.href}>
              <Button size={compact ? "sm" : "default"}>
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button
              size={compact ? "sm" : "default"}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}

      {/* Hint */}
      {hint && (
        <p className="text-[10px] text-muted-foreground mt-2">{hint}</p>
      )}
    </div>
  );

  if (compact) {
    return content;
  }

  return <Card>{content}</Card>;
}
