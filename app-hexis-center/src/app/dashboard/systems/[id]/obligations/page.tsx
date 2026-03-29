import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ObligationsTracker } from "@/components/obligations/obligations-tracker";

export const dynamic = "force-dynamic";

export default async function ObligationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: systemId } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch system
  const { data: system } = await supabase
    .from("ai_systems")
    .select("id, name, organisation_role")
    .eq("id", systemId)
    .single();

  if (!system) notFound();

  // Fetch classification
  const { data: classification } = await supabase
    .from("risk_classifications")
    .select("id, risk_level, article_references")
    .eq("system_id", systemId)
    .order("classified_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch existing obligations
  const { data: obligations } = await supabase
    .from("obligations")
    .select("*")
    .eq("system_id", systemId)
    .order("sort_order", { ascending: true });

  return (
    <ObligationsTracker
      systemId={systemId}
      systemName={system.name}
      organisationRole={system.organisation_role}
      riskLevel={classification?.risk_level ?? null}
      initialObligations={obligations ?? []}
      hasClassification={!!classification}
    />
  );
}
