import { Card } from '@/components/ui';

/**
 * Reports — placeholder page
 * Full implementation in a later sprint (Track step).
 */
export default function ReportsPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-foreground border-b border-primary pb-2 inline-block">
          Reports
        </h1>
        <p className="text-muted-foreground mt-3">
          Generate compliance reports for your organisation.
        </p>
      </div>

      <Card accent className="text-center py-12 px-6">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
          Coming Soon
        </p>
        <h3 className="font-heading text-xl text-foreground mb-2">
          Report generation is under development
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          You will be able to generate board summaries, DPO detail reports,
          and auditor evidence packages once your systems complete the
          Evaluate and Navigate steps.
        </p>
      </Card>
    </div>
  );
}
