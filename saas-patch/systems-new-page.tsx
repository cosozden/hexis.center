import { ObserveForm } from "@/components/systems/observe-form";

export const metadata = {
  title: "Register AI System — HEXIS",
  description: "Register a new AI system for EU AI Act compliance assessment.",
};

/**
 * /dashboard/systems/new
 * ORIENT Step 1: Observe — Register AI System
 */
export default function NewSystemPage() {
  return <ObserveForm />;
}
