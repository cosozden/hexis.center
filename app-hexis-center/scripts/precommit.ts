#!/usr/bin/env npx tsx
/**
 * Hexis Pre-commit Runner
 * ━━━━━━━━━━━━━━━━━━━━━━━
 * Runs all validation scripts in sequence. If any CRITICAL/HIGH
 * issue is found, the commit is blocked.
 *
 * Order:
 *   1. Schema drift (migration ↔ database.ts)
 *   2. API contracts (Supabase .from/.select/.insert validation)
 *   3. Route validation (Link href ↔ src/app/ routes)
 *   4. TypeScript build check (next build)
 *
 * Usage:
 *   npx tsx scripts/precommit.ts          # full check
 *   npx tsx scripts/precommit.ts --quick  # skip build (for speed)
 *
 * As git hook:
 *   .git/hooks/pre-commit → npx tsx scripts/precommit.ts --quick
 */

import { execSync } from "child_process";
import { resolve } from "path";

const ROOT = resolve(__dirname, "..");
const isQuick = process.argv.includes("--quick");

interface StepResult {
  name: string;
  passed: boolean;
  output: string;
  duration: number;
}

function runStep(name: string, command: string): StepResult {
  const start = Date.now();
  try {
    const output = execSync(command, {
      cwd: ROOT,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 120_000, // 2 min max per step
    });
    return {
      name,
      passed: true,
      output: output.trim(),
      duration: Date.now() - start,
    };
  } catch (err: any) {
    return {
      name,
      passed: false,
      output: (err.stdout || "") + (err.stderr || ""),
      duration: Date.now() - start,
    };
  }
}

function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  HEXIS Pre-commit Validation Suite           ║");
  console.log(`║  Mode: ${isQuick ? "Quick (skip build)" : "Full"}                            ║`);
  console.log("╚══════════════════════════════════════════════╝\n");

  const steps: { name: string; command: string; skipInQuick?: boolean }[] = [
    {
      name: "Schema Drift",
      command: "npx tsx scripts/validate-schema.ts",
    },
    {
      name: "API Contracts",
      command: "npx tsx scripts/validate-api-contracts.ts",
    },
    {
      name: "Route Validation",
      command: "npx tsx scripts/validate-routes.ts",
    },
    {
      name: "TypeScript Build",
      command: "npx next build",
      skipInQuick: true,
    },
  ];

  const results: StepResult[] = [];
  let anyFailed = false;

  for (const step of steps) {
    if (isQuick && step.skipInQuick) {
      console.log(`⏭  ${step.name} — skipped (--quick mode)\n`);
      continue;
    }

    console.log(`▸ Running: ${step.name}...`);
    const result = runStep(step.name, step.command);
    results.push(result);

    if (result.passed) {
      console.log(`  ✅ ${step.name} passed (${result.duration}ms)\n`);
    } else {
      console.log(`  ❌ ${step.name} FAILED (${result.duration}ms)`);
      // Show last 30 lines of output for failed steps
      const outputLines = result.output.split("\n");
      const tail = outputLines.slice(-30).join("\n");
      if (tail.trim()) {
        console.log("  ─── Output ───");
        console.log(tail.split("\n").map((l) => `  ${l}`).join("\n"));
        console.log("  ─────────────\n");
      }
      anyFailed = true;
    }
  }

  // Summary
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("SUMMARY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  for (const r of results) {
    console.log(`  ${r.passed ? "✅" : "❌"} ${r.name} (${r.duration}ms)`);
  }
  console.log();

  if (anyFailed) {
    console.log("❌ Pre-commit check FAILED. Fix the issues above before committing.\n");
    process.exit(1);
  } else {
    console.log("✅ All pre-commit checks passed. Safe to commit.\n");
    process.exit(0);
  }
}

main();
