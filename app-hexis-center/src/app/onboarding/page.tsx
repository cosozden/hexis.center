/**
 * Onboarding Page — First-time user setup
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 3-step guided flow:
 * 1. Organisation details (name + industry)
 * 2. Role selection (what brings you here)
 * 3. First AI system quick-add (optional, can skip)
 *
 * After completion: creates org, updates profile, redirects to dashboard.
 * Design: Dark theme (auth flow), Hexis Web Palette.
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ━━━ TYPES ━━━

type Step = 1 | 2 | 3;

interface OnboardingData {
  orgName: string;
  industry: string;
  role: string;
  firstSystemName: string;
  firstSystemPurpose: string;
}

// ━━━ OPTIONS ━━━

const INDUSTRIES = [
  "Financial Services",
  "Healthcare",
  "Technology",
  "Manufacturing",
  "Retail & E-Commerce",
  "Education",
  "Public Sector",
  "Legal & Professional Services",
  "Telecommunications",
  "Energy & Utilities",
  "Other",
];

const ROLES = [
  { value: "dpo", label: "Data Protection Officer", description: "Privacy and data governance" },
  { value: "compliance", label: "Compliance Officer", description: "Regulatory compliance" },
  { value: "cto", label: "CTO / IT Manager", description: "Technical oversight" },
  { value: "legal", label: "Legal Counsel", description: "Legal risk management" },
  { value: "ceo", label: "CEO / Founder", description: "Overall governance" },
  { value: "consultant", label: "Consultant / Advisor", description: "Client advisory" },
  { value: "other", label: "Other", description: "General interest" },
];

// ━━━ COMPONENT ━━━

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<OnboardingData>({
    orgName: "",
    industry: "",
    role: "",
    firstSystemName: "",
    firstSystemPurpose: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback(
    (field: keyof OnboardingData, value: string) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // ━━━ COMPLETE ONBOARDING ━━━

  const completeOnboarding = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Call server-side API route (handles org creation, profile link, system creation)
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName: data.orgName,
          industry: data.industry,
          role: data.role,
          firstSystemName: data.firstSystemName.trim(),
          firstSystemPurpose: data.firstSystemPurpose.trim(),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Onboarding failed");
      }

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }, [data, router]);

  // ━━━ STEP NAVIGATION ━━━

  const canProceed = () => {
    if (step === 1) return data.orgName.trim().length >= 2;
    if (step === 2) return data.role.length > 0;
    return true; // Step 3 is optional
  };

  const nextStep = () => {
    if (step < 3) setStep((step + 1) as Step);
    else completeOnboarding();
  };

  // ━━━ RENDER ━━━

  return (
    <div className="min-h-screen bg-[#16181C] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Brand header */}
        <div className="text-center mb-10">
          <h1
            className="text-2xl tracking-[0.15em] text-[#E8E6E2] mb-1"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            HEXIS
          </h1>
          <p className="text-[9px] uppercase tracking-[0.12em] text-[#8A8884]">
            AI Governance Platform
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center text-xs border transition-colors ${
                  s === step
                    ? "border-[#B2986C] text-[#B2986C]"
                    : s < step
                      ? "border-[#E8E6E2] text-[#E8E6E2] bg-[#E8E6E2]/5"
                      : "border-[#8A8884]/30 text-[#8A8884]/50"
                }`}
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {s < step ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-px ${
                    s < step ? "bg-[#E8E6E2]/30" : "bg-[#8A8884]/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content card */}
        <div className="border border-[rgba(232,230,226,0.10)] bg-[rgba(232,230,226,0.04)] p-8">
          {/* ━━━ STEP 1: Organisation ━━━ */}
          {step === 1 && (
            <>
              <p className="text-[9px] uppercase tracking-[0.12em] text-[#B2986C] mb-4">
                Step 1 — Your Organisation
              </p>
              <h2
                className="text-lg text-[#E8E6E2] mb-6"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Set up your workspace
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.1em] text-[#8A8884] mb-2">
                    Organisation Name
                  </label>
                  <input
                    type="text"
                    value={data.orgName}
                    onChange={(e) => updateField("orgName", e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full bg-transparent border border-[rgba(232,230,226,0.18)] text-[#E8E6E2] px-3 py-2.5 text-sm placeholder:text-[#8A8884]/50 focus:border-[#B2986C] focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.1em] text-[#8A8884] mb-2">
                    Industry
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind}
                        onClick={() => updateField("industry", ind)}
                        className={`text-xs px-3 py-1.5 border transition-colors ${
                          data.industry === ind
                            ? "border-[#B2986C] text-[#B2986C] bg-[#B2986C]/5"
                            : "border-[rgba(232,230,226,0.10)] text-[#8A8884] hover:text-[#E8E6E2] hover:border-[rgba(232,230,226,0.18)]"
                        }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ━━━ STEP 2: Role ━━━ */}
          {step === 2 && (
            <>
              <p className="text-[9px] uppercase tracking-[0.12em] text-[#B2986C] mb-4">
                Step 2 — Your Role
              </p>
              <h2
                className="text-lg text-[#E8E6E2] mb-2"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                What brings you to Hexis?
              </h2>
              <p className="text-xs text-[#8A8884] mb-6">
                This helps us tailor your experience.
              </p>

              <div className="space-y-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => updateField("role", r.value)}
                    className={`w-full text-left px-4 py-3 border transition-colors ${
                      data.role === r.value
                        ? "border-[#B2986C] bg-[#B2986C]/5"
                        : "border-[rgba(232,230,226,0.10)] hover:border-[rgba(232,230,226,0.18)]"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        data.role === r.value
                          ? "text-[#E8E6E2]"
                          : "text-[#8A8884]"
                      }`}
                    >
                      {r.label}
                    </span>
                    <span className="block text-[10px] text-[#8A8884]/60 mt-0.5">
                      {r.description}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ━━━ STEP 3: First AI System ━━━ */}
          {step === 3 && (
            <>
              <p className="text-[9px] uppercase tracking-[0.12em] text-[#B2986C] mb-4">
                Step 3 — Your First AI System
              </p>
              <h2
                className="text-lg text-[#E8E6E2] mb-2"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Register an AI system
              </h2>
              <p className="text-xs text-[#8A8884] mb-6">
                Quick-add your first AI system. You can add details later or skip
                this step entirely.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.1em] text-[#8A8884] mb-2">
                    System Name
                  </label>
                  <input
                    type="text"
                    value={data.firstSystemName}
                    onChange={(e) =>
                      updateField("firstSystemName", e.target.value)
                    }
                    placeholder="e.g. Customer Support Chatbot"
                    className="w-full bg-transparent border border-[rgba(232,230,226,0.18)] text-[#E8E6E2] px-3 py-2.5 text-sm placeholder:text-[#8A8884]/50 focus:border-[#B2986C] focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.1em] text-[#8A8884] mb-2">
                    What does it do?
                  </label>
                  <textarea
                    value={data.firstSystemPurpose}
                    onChange={(e) =>
                      updateField("firstSystemPurpose", e.target.value)
                    }
                    placeholder="Describe the system's purpose in a few sentences..."
                    rows={3}
                    className="w-full bg-transparent border border-[rgba(232,230,226,0.18)] text-[#E8E6E2] px-3 py-2.5 text-sm placeholder:text-[#8A8884]/50 focus:border-[#B2986C] focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 border border-red-500/30 bg-red-500/5">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep((step - 1) as Step)}
                className="text-xs text-[#8A8884] hover:text-[#E8E6E2] transition-colors"
              >
                &larr; Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              {step === 3 && (
                <button
                  onClick={completeOnboarding}
                  disabled={loading}
                  className="text-xs text-[#8A8884] hover:text-[#E8E6E2] transition-colors px-4 py-2"
                >
                  Skip for now
                </button>
              )}
              <button
                onClick={nextStep}
                disabled={!canProceed() || loading}
                className={`text-xs px-6 py-2 border transition-colors ${
                  canProceed() && !loading
                    ? "border-[#E8E6E2] text-[#E8E6E2] hover:bg-[#E8E6E2]/5"
                    : "border-[#8A8884]/30 text-[#8A8884]/50 cursor-not-allowed"
                }`}
              >
                {loading
                  ? "Setting up..."
                  : step === 3
                    ? data.firstSystemName.trim()
                      ? "Complete Setup"
                      : "Go to Dashboard"
                    : "Continue"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-[#8A8884]/50 mt-6">
          You can update these settings anytime from your dashboard.
        </p>
      </div>
    </div>
  );
}
