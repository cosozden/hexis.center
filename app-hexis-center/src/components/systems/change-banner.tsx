/**
 * Change Banner — Layer 3 UI Notification
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Displays a warning banner when the current ORIENT step
 * has been invalidated by an upstream change.
 *
 * Usage:
 *   <ChangeBanner
 *     systemId="uuid"
 *     currentStep="identify"
 *     invalidatedSteps={['identify', 'evaluate', 'navigate', 'track']}
 *     sourceStep="risk"
 *   />
 *
 * Shows: "Risk classification changed — this step may be outdated."
 * Actions: "Review now" (re-do step) or "Dismiss" (acknowledge)
 */

'use client';

import { useState } from 'react';
import { AlertTriangle, RefreshCw, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { OrientStep } from '@/lib/config/invalidation-config';

// ━━━ PROPS ━━━

interface ChangeBannerProps {
  systemId: string;
  currentStep: OrientStep;
  invalidatedSteps: string[];
  sourceStep?: OrientStep;
  onReview?: () => void;
  onDismiss?: () => void;
}

// ━━━ STEP LABELS ━━━

const STEP_LABELS: Record<OrientStep, string> = {
  observe: 'System description',
  risk: 'Risk classification',
  identify: 'Obligations',
  evaluate: 'Gap assessment',
  navigate: 'Action plan',
  track: 'Compliance tracking',
};

// ━━━ COMPONENT ━━━

export function ChangeBanner({
  systemId,
  currentStep,
  invalidatedSteps,
  sourceStep,
  onReview,
  onDismiss,
}: ChangeBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [assessment, setAssessment] = useState<{
    significance: string;
    reasoning: string;
    recommendation: string;
  } | null>(null);

  // Don't show if current step is not invalidated
  if (!invalidatedSteps.includes(currentStep) || dismissed) {
    return null;
  }

  const sourceLabel = sourceStep ? STEP_LABELS[sourceStep] : 'An upstream step';
  const currentLabel = STEP_LABELS[currentStep];

  const handleAssessImpact = async () => {
    setAssessing(true);
    try {
      const response = await fetch('/api/ai/impact-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemId,
          sourceStep: sourceStep ?? 'observe',
          changeDescription: `${sourceLabel} was updated, checking impact on ${currentLabel}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAssessment(data.assessment);

        // Auto-dismiss if cosmetic
        if (data.autoCleared) {
          setTimeout(() => setDismissed(true), 3000);
        }
      }
    } catch {
      console.warn('[change-banner] Impact assessment failed');
    } finally {
      setAssessing(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const handleReview = () => {
    onReview?.();
  };

  // Assessment result colors
  const significanceColors: Record<string, string> = {
    significant: 'bg-red-900/30 border-red-700/50 text-red-200',
    minor: 'bg-yellow-900/30 border-yellow-700/50 text-yellow-200',
    cosmetic: 'bg-green-900/30 border-green-700/50 text-green-200',
  };

  return (
    <div className="mb-4 rounded-none border border-yellow-700/50 bg-yellow-900/20 p-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-yellow-200">
              {sourceLabel} changed — {currentLabel.toLowerCase()} may be outdated
            </p>
            <p className="mt-1 text-xs text-yellow-400/70">
              Upstream data has changed since this step was last completed. Review
              recommended to ensure compliance accuracy.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-yellow-500/60 hover:text-yellow-300 transition-colors"
          title="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex items-center gap-2 pl-8">
        <button
          onClick={handleReview}
          className="flex items-center gap-1.5 rounded-none border border-yellow-600/50 bg-yellow-800/30 px-3 py-1.5 text-xs font-medium text-yellow-200 hover:bg-yellow-800/50 transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          Review now
        </button>

        <button
          onClick={handleAssessImpact}
          disabled={assessing || assessment !== null}
          className="flex items-center gap-1.5 rounded-none border border-yellow-600/30 px-3 py-1.5 text-xs text-yellow-400/70 hover:text-yellow-300 hover:border-yellow-600/50 transition-colors disabled:opacity-50"
        >
          {assessing ? 'Assessing...' : 'Check impact'}
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-auto flex items-center gap-1 text-xs text-yellow-500/50 hover:text-yellow-400 transition-colors"
        >
          {expanded ? (
            <>
              Less <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Details <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 border-t border-yellow-700/30 pt-3 pl-8">
          <p className="text-xs text-yellow-400/60">
            <span className="font-medium">Affected steps:</span>{' '}
            {invalidatedSteps.map((s) => STEP_LABELS[s as OrientStep] ?? s).join(' → ')}
          </p>
        </div>
      )}

      {/* Assessment result */}
      {assessment && (
        <div
          className={`mt-3 ml-8 rounded-none border p-3 ${
            significanceColors[assessment.significance] ?? 'bg-gray-900/30 border-gray-700/50'
          }`}
        >
          <p className="text-xs font-medium capitalize">
            Impact: {assessment.significance}
          </p>
          <p className="mt-1 text-xs opacity-80">{assessment.reasoning}</p>
          {assessment.recommendation && (
            <p className="mt-2 text-xs font-medium opacity-90">
              → {assessment.recommendation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
