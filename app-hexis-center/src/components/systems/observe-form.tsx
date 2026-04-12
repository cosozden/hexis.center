"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { handleApiError } from "@/lib/api/handle-api-error";
import {
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  Checkbox,
  Separator,
} from "@/components/ui";

// ━━━ TYPES ━━━

interface SystemFormData {
  name: string;
  description: string;
  purpose: string;
  provider: string;
  deployment_type: "internal" | "external" | "both" | "";
  eu_market: boolean;
  organisation_role: "provider" | "deployer" | "both" | "";
  deployment_status: "planning" | "development" | "testing" | "production" | "";
  responsible_person: string;
  responsible_unit: string;
}

const INITIAL_FORM: SystemFormData = {
  name: "",
  description: "",
  purpose: "",
  provider: "",
  deployment_type: "",
  eu_market: true,
  organisation_role: "",
  deployment_status: "",
  responsible_person: "",
  responsible_unit: "",
};

// ━━━ COMPONENT ━━━

export function ObserveForm() {
  const router = useRouter();
  const [tab, setTab] = useState<string>("form");
  const [form, setForm] = useState<SystemFormData>(INITIAL_FORM);
  const [freeText, setFreeText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractResult, setExtractResult] = useState<{
    followUpQuestions?: string[];
    missingInfo?: string[];
  } | null>(null);

  // ── Form field update ──
  const updateField = <K extends keyof SystemFormData>(
    key: K,
    value: SystemFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  // ── AI Extraction ──
  async function handleExtract() {
    if (freeText.trim().length < 10) {
      setError("Please describe your AI system in at least a few sentences.");
      return;
    }

    setIsExtracting(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/extract-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: freeText,
          existingData: form.name ? { name: form.name } : undefined,
        }),
      });

      if (handleApiError(res)) return;

      const { extracted } = await res.json();

      // Map extracted fields to form
      if (extracted) {
        setForm((prev) => ({
          ...prev,
          name: extracted.name || prev.name,
          description: extracted.description || prev.description,
          purpose: extracted.purpose || prev.purpose,
          provider: extracted.provider || prev.provider,
          deployment_type: extracted.deployment_type || prev.deployment_type,
          eu_market: extracted.eu_market ?? prev.eu_market,
          organisation_role: mapRole(extracted.organisation_role) || prev.organisation_role,
          deployment_status: prev.deployment_status,
          responsible_person: prev.responsible_person,
          responsible_unit: prev.responsible_unit,
        }));

        setExtractResult({
          followUpQuestions: extracted.follow_up_questions,
          missingInfo: extracted.missing_info,
        });

        // Switch to form tab to show populated fields
        setTab("form");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsExtracting(false);
    }
  }

  // ── Submit ──
  async function handleSubmit() {
    // Validation
    if (!form.name.trim()) {
      setError("System name is required.");
      return;
    }
    if (!form.purpose.trim()) {
      setError("System purpose is required for risk classification.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get user's org_id — required for RLS and multi-tenancy
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("org_id")
        .eq("id", user.id)
        .single();
      if (!profile?.org_id) throw new Error("No organisation found");

      const { data, error: dbError } = await supabase
        .from("ai_systems")
        .insert({
          org_id: profile.org_id,
          name: form.name.trim(),
          description: form.description.trim() || null,
          purpose: form.purpose.trim(),
          provider: form.provider.trim() || null,
          deployment_type: form.deployment_type || null,
          eu_market: form.eu_market,
          organisation_role: form.organisation_role || "deployer",
          deployment_status: form.deployment_status || "planning",
          responsible_person: form.responsible_person.trim() || null,
          responsible_unit: form.responsible_unit.trim() || null,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (dbError) throw dbError;
      if (data?.id) {
        router.push(`/dashboard/systems/${data.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save system");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <p className="label-upper text-brass mb-2">ORIENT &mdash; Step 1</p>
        <h1 className="font-heading text-2xl text-foreground">
          Observe &mdash; Register AI System
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Describe your AI system so we can guide you through EU AI Act compliance.
          You can fill the form manually or let our AI advisor extract the details.
        </p>
      </div>

      <Separator className="mb-6" />

      {/* Two paths: Form or AI Assist */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="form">Fill Form</TabsTrigger>
          <TabsTrigger value="ai">Describe to AI</TabsTrigger>
        </TabsList>

        {/* ── TAB 1: Manual Form ── */}
        <TabsContent value="form">
          <div className="space-y-5">
            {/* System Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">
                System Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Customer Support Chatbot, HR CV Screener"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            {/* Purpose */}
            <div className="space-y-1.5">
              <Label htmlFor="purpose">
                Intended Purpose <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="purpose"
                placeholder="What does this AI system do? What decisions does it make or support? Who is affected by its outputs?"
                value={form.purpose}
                onChange={(e) => updateField("purpose", e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Be specific &mdash; this text is used for risk classification and Claude analysis.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Additional context: technical details, training data, integration points..."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Separator />

            {/* Two-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Provider */}
              <div className="space-y-1.5">
                <Label htmlFor="provider">Provider / Vendor</Label>
                <Input
                  id="provider"
                  placeholder="e.g. OpenAI, Internal, Custom"
                  value={form.provider}
                  onChange={(e) => updateField("provider", e.target.value)}
                />
              </div>

              {/* Deployment Type */}
              <div className="space-y-1.5">
                <Label>Deployment Type</Label>
                <Select
                  value={form.deployment_type}
                  onValueChange={(v) =>
                    updateField("deployment_type", v as SystemFormData["deployment_type"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal use only</SelectItem>
                    <SelectItem value="external">External / customer-facing</SelectItem>
                    <SelectItem value="both">Both internal and external</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Organisation Role */}
              <div className="space-y-1.5">
                <Label>Organisation Role</Label>
                <Select
                  value={form.organisation_role}
                  onValueChange={(v) =>
                    updateField("organisation_role", v as SystemFormData["organisation_role"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="provider">Provider (develop / supply)</SelectItem>
                    <SelectItem value="deployer">Deployer (use in operations)</SelectItem>
                    <SelectItem value="both">Both provider and deployer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Deployment Status */}
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={form.deployment_status}
                  onValueChange={(v) =>
                    updateField("deployment_status", v as SystemFormData["deployment_status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* EU Market checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="eu_market"
                checked={form.eu_market}
                onCheckedChange={(checked) =>
                  updateField("eu_market", checked === true)
                }
              />
              <div>
                <Label htmlFor="eu_market" className="cursor-pointer">
                  Deployed in the EU market
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  The EU AI Act applies to systems placed on or used in the EU market.
                </p>
              </div>
            </div>

            {!form.eu_market && (
              <Card accent className="text-sm">
                <p className="text-primary font-medium mb-1">
                  Non-EU deployment noted
                </p>
                <p className="text-muted-foreground">
                  The EU AI Act may still apply if the system&apos;s output is used within the EU.
                  We recommend completing the assessment regardless.
                </p>
              </Card>
            )}

            {/* Responsible person/unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="responsible_person">Responsible Person</Label>
                <Input
                  id="responsible_person"
                  placeholder="Name or role"
                  value={form.responsible_person}
                  onChange={(e) =>
                    updateField("responsible_person", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="responsible_unit">Responsible Unit</Label>
                <Input
                  id="responsible_unit"
                  placeholder="e.g. IT, Legal, Operations"
                  value={form.responsible_unit}
                  onChange={(e) =>
                    updateField("responsible_unit", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── TAB 2: AI-Assisted Description ── */}
        <TabsContent value="ai">
          <Card className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center bg-primary/10 border border-primary/30 text-primary text-xs font-heading shrink-0">
                AI
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Describe your AI system
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Write naturally &mdash; our advisor will extract the structured information
                  and identify what&apos;s missing, like a consultant doing an intake interview.
                </p>
              </div>
            </div>

            <Textarea
              placeholder="Example: We use a chatbot powered by GPT-4 for customer support on our e-commerce platform. It handles product questions, order status, and returns processing for customers across the EU. The system was built by our internal team and has been in production since January 2026."
              value={freeText}
              onChange={(e) => {
                setFreeText(e.target.value);
                setError(null);
              }}
              className="min-h-[160px] mb-4"
            />

            <Button
              onClick={handleExtract}
              disabled={isExtracting || freeText.trim().length < 10}
              className="w-full"
            >
              {isExtracting ? "Analyzing..." : "Extract System Information"}
            </Button>
          </Card>

          {/* Follow-up questions from AI */}
          {extractResult?.followUpQuestions &&
            extractResult.followUpQuestions.length > 0 && (
              <Card accent className="mt-4 p-5">
                <p className="label-upper text-brass mb-3">
                  AI Advisor Follow-up
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Consider providing additional detail on these points:
                </p>
                <ul className="space-y-2">
                  {extractResult.followUpQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">&bull;</span>
                      <span className="text-foreground">{q}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
                  Form has been populated &mdash; review and adjust in the &ldquo;Fill Form&rdquo; tab,
                  then submit.
                </p>
              </Card>
            )}
        </TabsContent>
      </Tabs>

      {/* Error display */}
      {error && (
        <Card className="mt-4 p-4 border-destructive/30 bg-destructive/5">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {/* Submit button — always visible */}
      <div className="mt-8 flex items-center gap-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !form.name.trim() || !form.purpose.trim()}
          size="lg"
        >
          {isSubmitting ? "Saving..." : "Register System"}
        </Button>

        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground mt-6">
        This information helps determine EU AI Act obligations.
        You can update it at any time.
      </p>
    </div>
  );
}

// ━━━ HELPERS ━━━

function mapRole(
  role: string | undefined
): SystemFormData["organisation_role"] {
  if (role === "provider" || role === "deployer" || role === "both") return role;
  return "";
}
