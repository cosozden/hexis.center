"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Button,
  Card,
  Badge,
  Separator,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  classifyRisk,
  inputFromSkipLevel,
  PROHIBITED_PRACTICES,
  ANNEX_III_LABELS,
  type ClassificationInput,
  type ClassificationResult,
  type ProhibitedPractice,
  type AnnexIIIArea,
  type Art6Exception,
  type TransparencyCategory,
  type GPAIRole,
  type SkipLevel,
} from "@/lib/engines/classifier-engine";

// ━━━ TYPES ━━━

type WizardStep = 1 | 2 | 3 | "3b" | 4 | 5 | 6 | "result" | "skip";

interface WizardState {
  prohibitedPractice: ProhibitedPractice;
  isAnnexI: boolean;
  annexIIIArea: AnnexIIIArea | null;
  art6Exception: Art6Exception;
  transparencyCategory: TransparencyCategory;
  gpaiRole: GPAIRole;
  hasFRIA: boolean;
}

const INITIAL_STATE: WizardState = {
  prohibitedPractice: "none",
  isAnnexI: false,
  annexIIIArea: null,
  art6Exception: "none",
  transparencyCategory: "none",
  gpaiRole: "none",
  hasFRIA: false,
};

interface Props {
  systemId: string;
  systemName: string;
}

// ━━━ RISK BADGE MAP ━━━

const RISK_VARIANT: Record<string, "prohibited" | "high" | "limited" | "gpai" | "minimal"> = {
  prohibited: "prohibited",
  high: "high",
  high_art6_3_override: "high",
  not_high_risk: "limited",
  gpai: "gpai",
  gpai_systemic: "gpai",
  limited: "limited",
  minimal: "minimal",
};

// ━━━ STEP LABELS ━━━

const STEP_LABELS: Record<string, string> = {
  "1": "Prohibited Practices",
  "2": "Product Safety",
  "3": "High-Risk Domains",
  "3b": "Art. 6(3) Exception",
  "4": "Transparency",
  "5": "General-Purpose AI",
  "6": "Fundamental Rights",
};

// ━━━ COMPONENT ━━━

export function RiskClassifierWizard({ systemId, systemName }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>(1);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Update field ──
  const update = useCallback(<K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Navigate to next step ──
  const nextStep = useCallback(() => {
    setStep((current) => {
      switch (current) {
        case 1:
          // Prohibited → early termination
          if (state.prohibitedPractice !== "none") {
            runClassifier();
            return "result";
          }
          return 2;
        case 2:
          return 3;
        case 3:
          // If Annex III selected, show Art. 6(3) exception
          if (state.annexIIIArea !== null) return "3b";
          return 4;
        case "3b":
          return 4;
        case 4:
          return 5;
        case 5:
          return 6;
        case 6:
          runClassifier();
          return "result";
        default:
          return current;
      }
    });
  }, [state]);

  // ── Navigate to previous step ──
  const prevStep = useCallback(() => {
    setStep((current) => {
      switch (current) {
        case 2: return 1;
        case 3: return 2;
        case "3b": return 3;
        case 4: return state.annexIIIArea !== null ? "3b" : 3;
        case 5: return 4;
        case 6: return 5;
        case "result": return 6;
        default: return current;
      }
    });
  }, [state.annexIIIArea]);

  // ── Run classifier engine ──
  const runClassifier = useCallback(() => {
    const input: ClassificationInput = {
      prohibitedPractice: state.prohibitedPractice,
      isAnnexI: state.isAnnexI,
      annexIIIArea: state.annexIIIArea,
      art6Exception: state.art6Exception,
      transparencyCategory: state.transparencyCategory,
      gpaiRole: state.gpaiRole,
      hasFRIA: state.hasFRIA,
    };
    const r = classifyRisk(input);
    setResult(r);
  }, [state]);

  // ── Skip wizard ──
  const handleSkip = useCallback((skipLevel: SkipLevel) => {
    const input = inputFromSkipLevel(skipLevel);
    const r = classifyRisk(input);
    setResult(r);
    setStep("result");
  }, []);

  // ── Save to database ──
  const handleSave = useCallback(async () => {
    if (!result) return;
    setIsSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Map RiskLevel to DB risk_level
      const dbRiskLevel = mapToDbRiskLevel(result.riskLevel);

      const { error: dbError } = await supabase
        .from("risk_classifications")
        .insert({
          system_id: systemId,
          risk_level: dbRiskLevel,
          classification_path: result.classificationPath as unknown as Record<string, unknown>,
          article_references: result.articleReferences,
          exception_applied: result.classificationPath.art6Exception !== "none",
          exception_details: result.classificationPath.art6Exception !== "none"
            ? `Art. 6(3) exception: ${result.classificationPath.art6Exception}`
            : null,
          classified_by: user.id,
        });

      if (dbError) throw dbError;

      // Navigate to system detail
      router.push(`/dashboard/systems/${systemId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save classification");
    } finally {
      setIsSaving(false);
    }
  }, [result, systemId, router]);

  // ━━━ RENDER ━━━

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <p className="label-upper text-brass mb-2">ORIENT &mdash; Step 2</p>
        <h1 className="font-heading text-2xl text-foreground">
          Risk Classification
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Classify <span className="text-foreground">{systemName}</span> under the EU AI Act.
          The wizard follows Articles 5, 6, 50, and 51&ndash;56.
        </p>
      </div>

      {/* Step indicator */}
      {step !== "result" && step !== "skip" && (
        <StepIndicator currentStep={step} state={state} />
      )}

      <Separator className="mb-6" />

      {/* Skip option (only on step 1) */}
      {step === 1 && (
        <div className="mb-6">
          <button
            onClick={() => setStep("skip")}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            I already know my risk level &rarr;
          </button>
        </div>
      )}

      {/* ── STEP CONTENT ── */}
      {step === "skip" && (
        <SkipPanel onSelect={handleSkip} onBack={() => setStep(1)} />
      )}

      {step === 1 && (
        <Step1Prohibited
          value={state.prohibitedPractice}
          onChange={(v) => update("prohibitedPractice", v)}
        />
      )}

      {step === 2 && (
        <Step2AnnexI
          value={state.isAnnexI}
          onChange={(v) => update("isAnnexI", v)}
        />
      )}

      {step === 3 && (
        <Step3AnnexIII
          value={state.annexIIIArea}
          onChange={(v) => update("annexIIIArea", v)}
        />
      )}

      {step === "3b" && (
        <Step3bException
          value={state.art6Exception}
          onChange={(v) => update("art6Exception", v)}
        />
      )}

      {step === 4 && (
        <Step4Transparency
          value={state.transparencyCategory}
          onChange={(v) => update("transparencyCategory", v)}
        />
      )}

      {step === 5 && (
        <Step5GPAI
          value={state.gpaiRole}
          onChange={(v) => update("gpaiRole", v)}
        />
      )}

      {step === 6 && (
        <Step6FRIA
          value={state.hasFRIA}
          onChange={(v) => update("hasFRIA", v)}
        />
      )}

      {step === "result" && result && (
        <ResultPanel
          result={result}
          isSaving={isSaving}
          error={error}
          onSave={handleSave}
          onReclassify={() => {
            setStep(1);
            setState(INITIAL_STATE);
            setResult(null);
          }}
          systemId={systemId}
        />
      )}

      {/* ── NAVIGATION ── */}
      {step !== "result" && step !== "skip" && (
        <div className="mt-8 flex items-center gap-3">
          {step !== 1 && (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          )}
          <Button onClick={nextStep}>
            {step === 6 ? "Classify" : "Continue"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ━━━ STEP INDICATOR ━━━

function StepIndicator({ currentStep, state }: { currentStep: WizardStep; state: WizardState }) {
  const steps: { key: WizardStep; label: string }[] = [
    { key: 1, label: "1" },
    { key: 2, label: "2" },
    { key: 3, label: "3" },
    ...(state.annexIIIArea !== null ? [{ key: "3b" as WizardStep, label: "3b" }] : []),
    { key: 4, label: "4" },
    { key: 5, label: "5" },
    { key: 6, label: "6" },
  ];

  const currentIdx = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-1 mb-2">
        {steps.map((s, i) => (
          <div
            key={String(s.key)}
            className={cn(
              "w-8 h-8 flex items-center justify-center text-xs font-medium border",
              i < currentIdx
                ? "border-primary bg-primary/10 text-primary"
                : i === currentIdx
                  ? "border-primary text-foreground"
                  : "border-border text-muted-foreground/40"
            )}
          >
            {s.label}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Step {String(currentStep)}: {STEP_LABELS[String(currentStep)]}
      </p>
    </div>
  );
}

// ━━━ STEP 1: PROHIBITED PRACTICES ━━━

function Step1Prohibited({
  value,
  onChange,
}: {
  value: ProhibitedPractice;
  onChange: (v: ProhibitedPractice) => void;
}) {
  const practices = Object.entries(PROHIBITED_PRACTICES) as [
    Exclude<ProhibitedPractice, "none">,
    { label: string; article: string },
  ][];

  return (
    <div>
      <h2 className="font-heading text-lg text-foreground mb-1">
        Prohibited AI Practices
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Does your AI system fall into any of the following prohibited categories
        under Article 5?
      </p>

      <div className="space-y-2">
        <OptionCard
          selected={value === "none"}
          onClick={() => onChange("none")}
          label="None of the above"
          description="This system does not involve any prohibited practices."
        />
        {practices.map(([key, practice]) => (
          <OptionCard
            key={key}
            selected={value === key}
            onClick={() => onChange(key)}
            label={practice.label}
            description={practice.article}
            variant="destructive"
          />
        ))}
      </div>
    </div>
  );
}

// ━━━ STEP 2: ANNEX I ━━━

function Step2AnnexI({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <h2 className="font-heading text-lg text-foreground mb-1">
        Product Safety Legislation
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Is this AI system a safety component of, or is it itself, a product
        covered by EU product safety legislation listed in Annex I?
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        Annex I includes: machinery, toys, lifts, medical devices, civil aviation,
        motor vehicles, marine equipment, rail systems, and more.
      </p>

      <div className="space-y-2">
        <OptionCard
          selected={!value}
          onClick={() => onChange(false)}
          label="No"
          description="Not a product safety component under Annex I legislation."
        />
        <OptionCard
          selected={value}
          onClick={() => onChange(true)}
          label="Yes"
          description="Safety component or product under Annex I — Art. 6(1)."
        />
      </div>
    </div>
  );
}

// ━━━ STEP 3: ANNEX III ━━━

function Step3AnnexIII({
  value,
  onChange,
}: {
  value: AnnexIIIArea | null;
  onChange: (v: AnnexIIIArea | null) => void;
}) {
  const areas = Object.entries(ANNEX_III_LABELS) as [string, string][];

  return (
    <div>
      <h2 className="font-heading text-lg text-foreground mb-1">
        High-Risk Domains
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Does your AI system operate in any of the high-risk areas listed in
        Annex III (Article 6(2))?
      </p>

      <div className="space-y-2">
        <OptionCard
          selected={value === null}
          onClick={() => onChange(null)}
          label="None of these domains"
          description="System does not operate in any Annex III area."
        />
        {areas.map(([key, label]) => (
          <OptionCard
            key={key}
            selected={value === Number(key)}
            onClick={() => onChange(Number(key) as AnnexIIIArea)}
            label={`Area ${key}: ${label}`}
            description={`Annex III Area ${key}`}
          />
        ))}
      </div>
    </div>
  );
}

// ━━━ STEP 3B: ART. 6(3) EXCEPTION ━━━

function Step3bException({
  value,
  onChange,
}: {
  value: Art6Exception;
  onChange: (v: Art6Exception) => void;
}) {
  const exceptions: { key: Art6Exception; label: string; desc: string }[] = [
    {
      key: "none",
      label: "No exception applies (or system performs profiling)",
      desc: "The system remains high-risk. If it performs profiling, Art. 6(3) exception cannot apply.",
    },
    {
      key: "narrow_procedural",
      label: "Narrow procedural task",
      desc: "AI performs a narrow procedural task that does not replace human judgment.",
    },
    {
      key: "improve_human",
      label: "Improves result of prior human activity",
      desc: "AI is intended to improve the result of a previously completed human activity.",
    },
    {
      key: "detect_patterns",
      label: "Detects decision patterns without replacing assessment",
      desc: "AI detects patterns or deviations from prior decision-making patterns without replacing human assessment.",
    },
    {
      key: "preparatory",
      label: "Preparatory task for a later assessment",
      desc: "AI performs a preparatory task to an assessment relevant for the Annex III use case.",
    },
  ];

  return (
    <div>
      <h2 className="font-heading text-lg text-foreground mb-1">
        Art. 6(3) Exception Check
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Even though your system falls within an Annex III domain, Article 6(3) allows
        an exception if the AI does not pose a significant risk of harm.
        Does any of the following conditions apply?
      </p>

      <Card className="p-3 mb-4 border-primary/20">
        <p className="text-xs text-primary">
          Important: If the system performs profiling of natural persons, the exception
          cannot apply regardless of other conditions.
        </p>
      </Card>

      <div className="space-y-2">
        {exceptions.map((ex) => (
          <OptionCard
            key={ex.key}
            selected={value === ex.key}
            onClick={() => onChange(ex.key)}
            label={ex.label}
            description={ex.desc}
          />
        ))}
      </div>
    </div>
  );
}

// ━━━ STEP 4: TRANSPARENCY ━━━

function Step4Transparency({
  value,
  onChange,
}: {
  value: TransparencyCategory;
  onChange: (v: TransparencyCategory) => void;
}) {
  const categories: { key: TransparencyCategory; label: string; desc: string }[] = [
    {
      key: "none",
      label: "None of the above",
      desc: "No specific transparency obligations under Art. 50.",
    },
    {
      key: "chatbot",
      label: "Chatbot or conversational AI",
      desc: "Persons interacting with the system must be informed they are interacting with AI — Art. 50(1).",
    },
    {
      key: "deepfake",
      label: "Deepfake or synthetic content generation",
      desc: "AI-generated or manipulated content must be labelled as such — Art. 50(4).",
    },
    {
      key: "emotion_biometric",
      label: "Emotion recognition or biometric categorisation",
      desc: "Persons exposed must be informed of the operation and processing — Art. 50(3).",
    },
    {
      key: "public_content",
      label: "Generates or manipulates publicly distributed content",
      desc: "AI-generated text on matters of public interest must be disclosed — Art. 50(2).",
    },
  ];

  return (
    <div>
      <h2 className="font-heading text-lg text-foreground mb-1">
        Transparency Obligations
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Does your system fall under any Article 50 transparency requirements?
        These apply in addition to any risk classification above.
      </p>

      <div className="space-y-2">
        {categories.map((cat) => (
          <OptionCard
            key={cat.key}
            selected={value === cat.key}
            onClick={() => onChange(cat.key)}
            label={cat.label}
            description={cat.desc}
          />
        ))}
      </div>
    </div>
  );
}

// ━━━ STEP 5: GPAI ━━━

function Step5GPAI({
  value,
  onChange,
}: {
  value: GPAIRole;
  onChange: (v: GPAIRole) => void;
}) {
  const roles: { key: GPAIRole; label: string; desc: string }[] = [
    {
      key: "none",
      label: "Not a general-purpose AI model",
      desc: "This system is not a GPAI model and does not use one as a component.",
    },
    {
      key: "gpai_provider",
      label: "GPAI model provider",
      desc: "You develop or supply a general-purpose AI model — Art. 51-53 obligations apply.",
    },
    {
      key: "gpai_systemic",
      label: "GPAI model with systemic risk",
      desc: "GPAI model with high-impact capabilities or >10^25 FLOP training compute — Art. 51-55.",
    },
    {
      key: "gpai_deployer",
      label: "GPAI model deployer",
      desc: "You use a GPAI model as a component — provider bears primary obligations.",
    },
  ];

  return (
    <div>
      <h2 className="font-heading text-lg text-foreground mb-1">
        General-Purpose AI
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Does your AI system involve a general-purpose AI (GPAI) model?
        This applies to foundation models, large language models, and similar
        systems with broad capabilities (Articles 51&ndash;56).
      </p>

      <div className="space-y-2">
        {roles.map((role) => (
          <OptionCard
            key={role.key}
            selected={value === role.key}
            onClick={() => onChange(role.key)}
            label={role.label}
            description={role.desc}
          />
        ))}
      </div>
    </div>
  );
}

// ━━━ STEP 6: FRIA ━━━

function Step6FRIA({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <h2 className="font-heading text-lg text-foreground mb-1">
        Fundamental Rights Impact Assessment
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        For high-risk AI systems: has a Fundamental Rights Impact Assessment
        (FRIA) been conducted before deployment, as required by Article 27?
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        This is required for deployers of high-risk systems in public services,
        banking, insurance, and critical infrastructure.
      </p>

      <div className="space-y-2">
        <OptionCard
          selected={!value}
          onClick={() => onChange(false)}
          label="Not yet conducted"
          description="FRIA has not been completed — will be flagged in obligations."
        />
        <OptionCard
          selected={value}
          onClick={() => onChange(true)}
          label="Yes, FRIA has been conducted"
          description="A fundamental rights impact assessment is available."
        />
      </div>
    </div>
  );
}

// ━━━ SKIP PANEL ━━━

function SkipPanel({
  onSelect,
  onBack,
}: {
  onSelect: (level: SkipLevel) => void;
  onBack: () => void;
}) {
  const levels: { key: SkipLevel; label: string; desc: string }[] = [
    { key: "prohibited", label: "Prohibited", desc: "Unacceptable risk — Art. 5" },
    { key: "high_risk_annex_iii", label: "High-risk (Annex III)", desc: "Art. 6(2) domain" },
    { key: "high_risk_annex_i", label: "High-risk (Annex I)", desc: "Product safety" },
    { key: "gpai_systemic", label: "GPAI (Systemic)", desc: "Art. 51-55" },
    { key: "gpai_standard", label: "GPAI (Standard)", desc: "Art. 51-53" },
    { key: "transparency", label: "Limited risk", desc: "Transparency — Art. 50" },
    { key: "minimal", label: "Minimal risk", desc: "Voluntary codes — Art. 95" },
  ];

  return (
    <div>
      <h2 className="font-heading text-lg text-foreground mb-1">
        Select Your Risk Level
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Choose the risk level that applies to your system. The platform will
        generate the corresponding obligations and deadlines.
      </p>

      <div className="space-y-2">
        {levels.map((l) => (
          <OptionCard
            key={l.key}
            selected={false}
            onClick={() => onSelect(l.key)}
            label={l.label}
            description={l.desc}
          />
        ))}
      </div>

      <div className="mt-6">
        <Button variant="outline" onClick={onBack}>
          &larr; Use wizard instead
        </Button>
      </div>
    </div>
  );
}

// ━━━ RESULT PANEL ━━━

function ResultPanel({
  result,
  isSaving,
  error,
  onSave,
  onReclassify,
  systemId,
}: {
  result: ClassificationResult;
  isSaving: boolean;
  error: string | null;
  onSave: () => void;
  onReclassify: () => void;
  systemId: string;
}) {
  const variant = RISK_VARIANT[result.riskLevel] || "minimal";

  return (
    <div>
      <h2 className="font-heading text-lg text-foreground mb-4">
        Classification Result
      </h2>

      {/* Risk level card */}
      <Card className="p-5 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant={variant} className="text-sm px-3 py-1">
            {result.displayLevel}
          </Badge>
        </div>

        <p className="text-sm text-foreground mb-1">{result.category}</p>

        {result.deadlineLabel && (
          <p className="text-xs text-muted-foreground">
            Compliance deadline: <span className="text-foreground">{result.deadlineLabel}</span>
          </p>
        )}

        {result.penalty && (
          <p className="text-xs text-muted-foreground mt-1">
            Penalty: {result.penalty}
          </p>
        )}
      </Card>

      {/* Article references */}
      {result.articleReferences.length > 0 && (
        <Card className="p-5 mb-4">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-2">
            Article References
          </p>
          <div className="flex flex-wrap gap-2">
            {result.articleReferences.map((ref, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 border border-border text-foreground"
              >
                {ref}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Obligations */}
      {result.obligations.length > 0 && (
        <Card className="p-5 mb-4">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
            Obligations ({result.obligations.length})
          </p>
          <div className="space-y-2">
            {result.obligations.map((obl, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5 shrink-0">&bull;</span>
                <div>
                  <span className="text-foreground">{obl.title}</span>
                  {obl.article && (
                    <span className="text-muted-foreground ml-1">({obl.article})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Supplementary notes */}
      {result.supplementary.length > 0 && (
        <Card className="p-5 mb-4">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
            Additional Notes
          </p>
          <div className="space-y-1.5">
            {result.supplementary.map((note, i) => (
              <p key={i} className="text-xs text-muted-foreground">
                {note}
              </p>
            ))}
          </div>
        </Card>
      )}

      {/* Deterministic label */}
      <Card className="p-3 mb-6 border-primary/20">
        <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-1">
          Classification Method
        </p>
        <p className="text-xs text-foreground">
          This result was determined by rule-based logic derived directly from
          the EU AI Act. No AI model was used in this classification.
        </p>
      </Card>

      {/* Error */}
      {error && (
        <Card className="p-4 mb-4 border-destructive/30 bg-destructive/5">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button onClick={onSave} disabled={isSaving} size="lg">
          {isSaving ? "Saving..." : "Save Classification"}
        </Button>
        <Button variant="outline" onClick={onReclassify}>
          Reclassify
        </Button>
      </div>
    </div>
  );
}

// ━━━ OPTION CARD (reusable) ━━━

function OptionCard({
  selected,
  onClick,
  label,
  description,
  variant,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  description: string;
  variant?: "destructive";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 border transition-colors duration-150",
        selected
          ? variant === "destructive"
            ? "border-destructive/40 bg-destructive/5"
            : "border-primary bg-primary/5"
          : "border-border hover:border-primary/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-4 h-4 mt-0.5 border-2 shrink-0",
            selected
              ? variant === "destructive"
                ? "border-destructive bg-destructive"
                : "border-primary bg-primary"
              : "border-border"
          )}
        />
        <div>
          <p className={cn(
            "text-sm font-medium",
            selected ? "text-foreground" : "text-foreground/80",
          )}>
            {label}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
    </button>
  );
}

// ━━━ HELPERS ━━━

function mapToDbRiskLevel(
  riskLevel: string
): "prohibited" | "high" | "limited" | "gpai" | "minimal" {
  switch (riskLevel) {
    case "prohibited":
      return "prohibited";
    case "high":
    case "high_art6_3_override":
    case "not_high_risk":
      return riskLevel === "not_high_risk" ? "limited" : "high";
    case "gpai":
    case "gpai_systemic":
      return "gpai";
    case "limited":
      return "limited";
    default:
      return "minimal";
  }
}
