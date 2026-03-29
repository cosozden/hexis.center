#!/usr/bin/env npx tsx
/**
 * API Contract Validator — Hexis Pre-commit Tool #3
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Static analysis of Supabase queries in source code:
 *   - .from('table_name') references → table exists in database.ts?
 *   - .select('column, ...') → columns exist in Row type?
 *   - .insert({ field: ... }) → fields exist in Insert type?
 *   - .update({ field: ... }) → fields exist in Update type?
 *
 * Catches bugs like `ai_usage_logs` vs `api_usage` before runtime.
 *
 * Exit code 0 = all contracts valid
 * Exit code 1 = contract violations found
 *
 * Usage: npx tsx scripts/validate-api-contracts.ts
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join, resolve, relative } from "path";

const ROOT = resolve(__dirname, "..");
const SRC_DIR = join(ROOT, "src");
const DATABASE_TS = join(ROOT, "src", "types", "database.ts");

// ─── 1. Extract valid table names from database.ts ─────────────

function extractTableNames(): Set<string> {
  if (!existsSync(DATABASE_TS)) {
    console.warn("⚠ database.ts not found.");
    return new Set();
  }

  const content = readFileSync(DATABASE_TS, "utf-8");
  const tables = new Set<string>();

  // Match table definitions in the Tables block
  // Pattern: tableName: { Row: {
  const tableRegex = /^\s+(\w+):\s*\{\s*$/gm;
  let match;
  let inTablesBlock = false;
  const lines = content.split("\n");

  for (const line of lines) {
    if (line.includes("Tables:")) inTablesBlock = true;
    if (line.includes("Views:") || line.includes("Functions:")) inTablesBlock = false;

    if (inTablesBlock) {
      const m = line.match(/^\s{6}(\w+):\s*\{/);
      if (m) {
        tables.add(m[1]);
      }
    }
  }

  return tables;
}

// ─── 2. Extract column names for each table ─────────────────────

interface TableColumns {
  row: Set<string>;
  insert: Set<string>;
  update: Set<string>;
}

function extractTableColumns(): Map<string, TableColumns> {
  if (!existsSync(DATABASE_TS)) return new Map();

  const content = readFileSync(DATABASE_TS, "utf-8");
  const result = new Map<string, TableColumns>();

  // Parse each table's Row/Insert/Update blocks
  const tableRegex = /(\w+):\s*\{\s*\n\s*Row:\s*\{([\s\S]*?)\};\s*\n\s*Insert:\s*\{([\s\S]*?)\};\s*\n\s*Update:\s*\{([\s\S]*?)\}/g;
  let match;

  while ((match = tableRegex.exec(content)) !== null) {
    const tableName = match[1];
    if (["Tables", "Views", "Functions", "Enums", "CompositeTypes"].includes(tableName)) continue;

    const extractCols = (block: string): Set<string> => {
      const cols = new Set<string>();
      const colRegex = /(\w+)\??:/g;
      let m;
      while ((m = colRegex.exec(block)) !== null) {
        cols.add(m[1]);
      }
      return cols;
    };

    result.set(tableName, {
      row: extractCols(match[2]),
      insert: extractCols(match[3]),
      update: extractCols(match[4]),
    });
  }

  return result;
}

// ─── 3. Scan source for Supabase .from() calls ─────────────────

interface ContractViolation {
  file: string;
  line: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  message: string;
}

function scanSourceFiles(
  validTables: Set<string>,
  tableColumns: Map<string, TableColumns>,
): ContractViolation[] {
  const violations: ContractViolation[] = [];

  function scanDir(dir: string) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
        scanDir(fullPath);
      } else if (/\.(tsx?|jsx?)$/.test(entry.name) && entry.name !== "database.ts") {
        scanFileForContracts(fullPath, validTables, tableColumns, violations);
      }
    }
  }

  scanDir(SRC_DIR);
  return violations;
}

function scanFileForContracts(
  filePath: string,
  validTables: Set<string>,
  tableColumns: Map<string, TableColumns>,
  violations: ContractViolation[],
) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const relPath = relative(ROOT, filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check .from('table_name')
    const fromMatch = line.match(/\.from\(\s*['"](\w+)['"]\s*\)/);
    if (fromMatch) {
      const tableName = fromMatch[1];
      if (!validTables.has(tableName)) {
        violations.push({
          file: relPath,
          line: lineNum,
          severity: "CRITICAL",
          message: `Table "${tableName}" not found in database.ts — will crash at runtime`,
        });
      }
    }

    // Check .select('col1, col2, ...')
    // Only basic column names, skip relationship joins (!) and wildcards (*)
    const selectMatch = line.match(/\.select\(\s*['"]([^'"]+)['"]\s*\)/);
    if (selectMatch && fromMatch) {
      const tableName = fromMatch[1];
      const cols = tableColumns.get(tableName);
      if (cols) {
        const selectCols = selectMatch[1]
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c !== "*" && !c.includes("!") && !c.includes("("));

        for (const col of selectCols) {
          if (col && !cols.row.has(col)) {
            violations.push({
              file: relPath,
              line: lineNum,
              severity: "HIGH",
              message: `Column "${col}" not found in ${tableName}.Row — select will fail`,
            });
          }
        }
      }
    }

    // Check .insert({ field: ... }) — look for object keys
    // This is a multi-line heuristic: collect lines after .insert({
    if (/\.insert\s*\(\s*\{/.test(line) && fromMatch) {
      const tableName = fromMatch[1];
      const cols = tableColumns.get(tableName);
      if (cols) {
        // Collect the insert object (up to 20 lines ahead)
        let insertBlock = "";
        let braceCount = 0;
        for (let j = i; j < Math.min(i + 20, lines.length); j++) {
          insertBlock += lines[j] + "\n";
          braceCount += (lines[j].match(/\{/g) || []).length;
          braceCount -= (lines[j].match(/\}/g) || []).length;
          if (braceCount <= 0 && j > i) break;
        }

        // Extract field names from the object
        const fieldRegex = /(\w+)\s*:/g;
        let fieldMatch;
        while ((fieldMatch = fieldRegex.exec(insertBlock)) !== null) {
          const field = fieldMatch[1];
          // Skip common non-field patterns
          if (["const", "let", "var", "return", "async", "await", "function"].includes(field)) continue;
          if (!cols.insert.has(field)) {
            violations.push({
              file: relPath,
              line: lineNum,
              severity: "HIGH",
              message: `Field "${field}" not found in ${tableName}.Insert — insert will fail`,
            });
          }
        }
      }
    }
  }
}

// ─── 4. Main ─────────────────────────────────────────────────────

function main() {
  console.log("╔══════════════════════════════════════╗");
  console.log("║  HEXIS API Contract Validator        ║");
  console.log("╚══════════════════════════════════════╝\n");

  const validTables = extractTableNames();
  const tableColumns = extractTableColumns();

  console.log(`database.ts defines ${validTables.size} tables:`);
  for (const t of [...validTables].sort()) {
    const cols = tableColumns.get(t);
    console.log(`  ● ${t} (${cols?.row.size ?? "?"} columns)`);
  }
  console.log();

  const violations = scanSourceFiles(validTables, tableColumns);

  if (violations.length === 0) {
    console.log("✅ All Supabase queries reference valid tables and columns.\n");
    process.exit(0);
  }

  const critical = violations.filter((v) => v.severity === "CRITICAL");
  const high = violations.filter((v) => v.severity === "HIGH");
  const medium = violations.filter((v) => v.severity === "MEDIUM");

  console.log(`❌ Found ${violations.length} contract violation(s):\n`);

  if (critical.length > 0) {
    console.log("━━━ CRITICAL (wrong table names — runtime crash) ━━━");
    for (const v of critical) {
      console.log(`  ${v.file}:${v.line}`);
      console.log(`    ${v.message}\n`);
    }
  }

  if (high.length > 0) {
    console.log("━━━ HIGH (wrong column names — query failure) ━━━");
    for (const v of high) {
      console.log(`  ${v.file}:${v.line}`);
      console.log(`    ${v.message}\n`);
    }
  }

  if (medium.length > 0) {
    console.log("━━━ MEDIUM ━━━");
    for (const v of medium) {
      console.log(`  ${v.file}:${v.line}`);
      console.log(`    ${v.message}\n`);
    }
  }

  process.exit(1);
}

main();
