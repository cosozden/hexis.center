/**
 * Action Plan / Roadmap — ORIENT Step 5: Navigate
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Placeholder — full implementation in next sprint.
 */

import Link from "next/link";
import { Card, Button } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: systemId } = await params;

  return (
    <div className="max-w-3xl">
      <Link
        href={`/dashboard/systems/${systemId}`}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back to System
      </Link>

      <div className="mt-3 mb-8">
        <h1 className="font-heading text-2xl text-foreground">
          Action Plan
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          ORIENT Step 5: Navigate
        </p>
      </div>

      <Card accent className="p-6">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
          Coming Soon
        </p>
        <p className="text-sm text-foreground mb-2">
          The Navigate step will generate a prioritized compliance action plan
          based on your risk classification, obligations, and governance assessment.
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Claude will analyze all previous ORIENT steps and create a roadmap
          with deadlines, resource estimates, and critical path analysis.
        </p>
        <Link href={`/dashboard/systems/${systemId}`}>
          <Button variant="outline" size="sm">Back to System</Button>
        </Link>
      </Card>
    </div>
  );
}
