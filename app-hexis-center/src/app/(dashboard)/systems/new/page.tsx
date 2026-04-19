import Link from 'next/link';
import { ObserveForm } from '@/components/systems/observe-form';

/**
 * New System Page — ORIENT Step 1: Observe
 * Register a new AI system via the ObserveForm component.
 * Two paths: structured form or Claude-assisted free text extraction.
 */

export default function NewSystemPage() {
  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-dark-sub mb-6">
        <Link href="/dashboard/systems" className="hover:text-dark-type transition-colors">
          AI Systems
        </Link>
        <span>/</span>
        <span className="text-dark-type">Register System</span>
      </div>

      <div className="mb-6">
        <h1 className="font-heading text-2xl text-dark-type">Register AI System</h1>
        <p className="text-dark-sub mt-2">
          Describe your AI system to begin the ORIENT compliance flow.
          You can fill the form manually or let Claude extract details from a free-text description.
        </p>
      </div>

      <ObserveForm />
    </div>
  );
}
