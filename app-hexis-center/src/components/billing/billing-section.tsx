"use client";

import { useState } from "react";
import { Card, Button } from "@/components/ui";

/**
 * BillingSection — settings page billing card.
 * Shows current plan status + manage/upgrade button.
 */

interface Props {
  subscriptionStatus: string | null;
  hasStripeCustomer: boolean;
}

const STATUS_DISPLAY: Record<string, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "text-green-400",
  },
  trialing: {
    label: "Trial",
    className: "text-blue-400",
  },
  past_due: {
    label: "Past Due",
    className: "text-orange-400",
  },
  canceled: {
    label: "Canceled",
    className: "text-muted-foreground",
  },
  unpaid: {
    label: "Not Subscribed",
    className: "text-muted-foreground",
  },
};

export function BillingSection({ subscriptionStatus, hasStripeCustomer }: Props) {
  const [loading, setLoading] = useState(false);

  const status = STATUS_DISPLAY[subscriptionStatus ?? "unpaid"] ?? STATUS_DISPLAY.unpaid;
  const isActive = subscriptionStatus === "active" || subscriptionStatus === "trialing";

  const handleAction = async () => {
    setLoading(true);
    try {
      const endpoint = hasStripeCustomer
        ? "/api/billing/portal"
        : "/api/billing/checkout";
      const resp = await fetch(endpoint, { method: "POST" });
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5 mb-4">
      <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
        Billing
      </p>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <p className="text-sm text-foreground font-heading">Pro Plan</p>
            <span className={`text-xs ${status.className}`}>{status.label}</span>
          </div>
          {isActive ? (
            <p className="text-xs text-muted-foreground">
              &euro;29/month — full platform access
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              &euro;9 first month, then &euro;29/month
            </p>
          )}
        </div>

        <Button
          size="sm"
          variant={isActive ? "outline" : "default"}
          onClick={handleAction}
          disabled={loading}
        >
          {loading
            ? "Redirecting..."
            : hasStripeCustomer
              ? "Manage Subscription"
              : "Subscribe"}
        </Button>
      </div>
    </Card>
  );
}
