"use client";

import { useState } from "react";
import { Card, Button } from "@/components/ui";

/**
 * SubscriptionGuard — wraps dashboard content to enforce subscription status.
 * Shows a paywall banner for non-active subscriptions.
 *
 * Status behavior:
 * - active / trialing → full access (renders children)
 * - past_due → warning banner + full access (grace period)
 * - canceled / unpaid / null → paywall, only read-only access
 */

interface Props {
  subscriptionStatus: string | null;
  children: React.ReactNode;
}

const STATUS_CONFIG: Record<
  string,
  { level: "ok" | "warn" | "block"; label: string; message: string }
> = {
  active: {
    level: "ok",
    label: "Active",
    message: "",
  },
  trialing: {
    level: "ok",
    label: "Trial",
    message: "",
  },
  past_due: {
    level: "warn",
    label: "Past Due",
    message:
      "Your payment is overdue. Please update your payment method to continue using all features.",
  },
  canceled: {
    level: "block",
    label: "Canceled",
    message:
      "Your subscription has been canceled. Upgrade to regain full access to the platform.",
  },
  unpaid: {
    level: "block",
    label: "Unpaid",
    message:
      "Your account is unpaid. Please subscribe to access governance tools.",
  },
};

export function SubscriptionGuard({ subscriptionStatus, children }: Props) {
  const [loading, setLoading] = useState(false);

  const config = STATUS_CONFIG[subscriptionStatus ?? "unpaid"] ?? STATUS_CONFIG.unpaid;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/billing/portal", { method: "POST" });
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  // Active or trialing — no banner needed
  if (config.level === "ok") {
    return <>{children}</>;
  }

  // Past due — warning banner but still accessible
  if (config.level === "warn") {
    return (
      <>
        <div className="mb-4 border border-primary/40 bg-primary/5 p-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-1">
                Payment Overdue
              </p>
              <p className="text-sm text-foreground">{config.message}</p>
            </div>
            <Button size="sm" onClick={handlePortal} disabled={loading}>
              {loading ? "Redirecting..." : "Update Payment"}
            </Button>
          </div>
        </div>
        {children}
      </>
    );
  }

  // Blocked — paywall
  return (
    <div className="max-w-2xl mx-auto mt-12">
      <Card accent className="p-8 text-center">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-4">
          Subscription Required
        </p>
        <h2 className="font-heading text-xl text-foreground mb-3">
          Activate Your Hexis Account
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Get full access to the AI governance platform — risk classification,
          obligation tracking, governance matrix, Claude-powered guidance, and
          compliance reporting.
        </p>

        <div className="border border-rule p-4 mb-6 inline-block">
          <p className="text-xs text-muted-foreground mb-1">Pro Plan</p>
          <p className="text-2xl font-heading text-foreground">
            &euro;29<span className="text-sm text-muted-foreground">/month</span>
          </p>
          <p className="text-xs text-primary mt-1">First month &euro;9</p>
        </div>

        <div>
          <Button onClick={handleCheckout} disabled={loading}>
            {loading ? "Redirecting to checkout..." : "Subscribe Now"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Cancel anytime. Your data is always exportable.
        </p>
      </Card>
    </div>
  );
}
