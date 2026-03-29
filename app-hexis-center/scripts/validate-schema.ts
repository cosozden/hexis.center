#!/usr/bin/env npx tsx
/**
 * Schema Drift Detector — Hexis Pre-commit Tool #2
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Parses SQL migration files and compares against database.ts:
 *   - Tables in migrations but missing from database.ts
 *   - Columns in migrations but missing from database.ts Row type
 *   - Tables in database.ts but missing from migrations
 *
 * Exit code 0 = no drift
 * Exit code 1 = drift detected
 *
 * Usage: npx tsx scripts/validate-schema.ts
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(__dirname, "..");
const MIGRATIONS_DIR = join(ROOT, "supabase", "migrations");
const DATABASE_TS = join(ROOT, "src", "types", "database.ts");

// ─── 1. Parse SQL migrations for CREATE TABLE statements ─────────

interface SqlColumn {
  name: string;
  type: string;
  nullable: boolean;
  hasDefault: boolean;
}

interface SqlTable {
  name: string;
  columns: SqlColumn[];
  sourceFile: string;
}

function parseMigrations(): SqlTable[] {
  const tables: SqlTable[] = [];
  if (!existsSync(MIGRATIONS_DIR)) {
    console.warn("⚠ No migrations directory found.");
    return tables;
  }

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const content = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");
    // Match CREATE TABLE statements
    const createRegex = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:\w+\.)?(\w+)\s*\(([\s\S]*?)\);/gi;
    let match;

    while ((match = createRegex.exec(content)) !== null) {
      const tableName = match[1];
      const body = match[2];

      // Skip internal tables
      if (tableName.startsWith("pg_") || tableName.startsWith("auth.")) continue;

      const columns: SqlColumn[] = [];
      // Split by lines, filter actual column definitions
      const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);

      for (const line of lines) {
        // Skip constraints, indexes, policies
        if (/^(primary\s+key|unique|check|constraint|foreign\s+key|create\s)/i.test(line)) continue;
        // Skip closing paren
        if (line === ")") continue;

        // Parse column: name type [NOT NULL] [DEFAULT ...]
        const colMatch = line.match(/^(\w+)\s+(\w[\w\s()[\],]*?)(?:\s+(not\s+null))?\s*(?:default\s+(.+?))?(?:\s+check\s*\(.*?\))?\s*(?:references\s+.*?)?\s*,?\s*$/i);
        if (colMatch) {
          columns.push({
            name: colMatch[1],
            type: colMatch[2].trim().toLowerCase(),
            nullable: !colMatch[3],
            hasDefault: !!colMatch[4],
          });
        }
      }

      // Check if this table already exists (ALTER TABLE ADD COLUMN in later migration)
      const existing = tables.find((t) => t.name === tableName);
      if (existing) {
        // Merge columns (later migration adds columns)
        for (const col of columns) {
          if (!existing.columns.some((c) => c.name === col.name)) {
            existing.columns.push(col);
          }
        }
      } else {
        tables.push({ name: tableName, columns, sourceFile: file });
      }
    }

    // Also check ALTER TABLE ADD COLUMN
    const alterRegex = /alter\s+table\s+(?:\w+\.)?(\w+)\s+add\s+(?:column\s+)?(\w+)\s+(\w[\w\s()[\],]*?)(?:\s+(not\s+null))?\s*(?:default\s+(.+?))?\s*;/gi;
    while ((match = alterRegex.exec(content)) !== null) {
      const tableName = match[1];
      const colName = match[2];
      const colType = match[3].trim().toLowerCase();
      const notNull = !!match[4];
      const hasDefault = !!match[5];

      const table = tables.find((t) => t.name === tableName);
      if (table) {
        if (!table.columns.some((c) => c.name === colName)) {
          table.columns.push({
            name: colName,
            type: colType,
            nullable: !notNull,
            hasDefault,
          });
        }
      }
    }
  }

  return tables;
}

// ─── 2. Parse database.ts for table/column definitions ──────────

interface TsColumn {
  name: string;
  optional: boolean;
}

interface TsTable {
  name: string;
  rowColumns: TsColumn[];
  insertColumns: TsColumn[];
}

function parseDatabaseTs(): TsTable[] {
  const tables: TsTable[] = [];
  if (!existsSync(DATABASE_TS)) {
    console.warn("⚠ database.ts not found.");
    return tables;
  }

  const content = readFileSync(DATABASE_TS, "utf-8");
  const lines = content.split("\n");

  // State machine: track indentation to find table definitions
  // database.ts structure:
  //   Tables: {                    ← indent 4 (Tables block start)
  //     organizations: {           ← indent 6 (table name)
  //       Row: {                   ← indent 8 (Row block)
  //         id: string;            ← indent 10 (column)
  //       };
  //       Insert: {                ← indent 8
  //       };
  //       Update: {                ← indent 8
  //       };

  let inTablesBlock = false;
  let currentTable: string | null = null;
  let currentSection: "row" | "insert" | "update" | null = null;
  let braceDepth = 0;
  let sectionBraceDepth = 0;

  const SKIP_NAMES = new Set(["Tables", "Views", "Functions", "Enums", "CompositeTypes", "public"]);

  for (const line of lines) {
    const trimmed = line.trimStart();
    const indent = line.length - trimmed.length;

    // Detect Tables block
    if (trimmed.startsWith("Tables:")) {
      inTablesBlock = true;
      continue;
    }
    if (inTablesBlock && indent <= 4 && (trimmed.startsWith("Views:") || trimmed.startsWith("Functions:") || trimmed === "};")) {
      inTablesBlock = false;
      currentTable = null;
      currentSection = null;
      continue;
    }

    if (!inTablesBlock) continue;

    // Detect table name (indent ~6, pattern: tableName: {)
    const tableMatch = trimmed.match(/^(\w+):\s*\{/);
    if (tableMatch && indent >= 4 && indent <= 8 && !currentSection) {
      const name = tableMatch[1];
      if (!SKIP_NAMES.has(name) && !["Row", "Insert", "Update", "Relationships"].includes(name)) {
        currentTable = name;
        tables.push({ name, rowColumns: [], insertColumns: [] });
      }
    }

    // Detect Row/Insert/Update section
    if (currentTable && trimmed.startsWith("Row: {")) {
      currentSection = "row";
      sectionBraceDepth = 1;
      continue;
    }
    if (currentTable && trimmed.startsWith("Insert: {")) {
      currentSection = "insert";
      sectionBraceDepth = 1;
      continue;
    }
    if (currentTable && trimmed.startsWith("Update: {")) {
      currentSection = "update";
      sectionBraceDepth = 1;
      continue;
    }

    // Track brace depth in section
    if (currentSection) {
      // Count braces
      for (const ch of trimmed) {
        if (ch === "{") sectionBraceDepth++;
        if (ch === "}") sectionBraceDepth--;
      }

      if (sectionBraceDepth <= 0) {
        currentSection = null;
        continue;
      }

      // Parse column: fieldName?: type;
      const colMatch = trimmed.match(/^(\w+)(\??):\s*/);
      if (colMatch) {
        const table = tables.find((t) => t.name === currentTable);
        if (table) {
          const col: TsColumn = { name: colMatch[1], optional: colMatch[2] === "?" };
          if (currentSection === "row") table.rowColumns.push(col);
          else if (currentSection === "insert") table.insertColumns.push(col);
        }
      }
    }

    // Detect end of table (Relationships line or closing brace at table indent)
    if (currentTable && trimmed.startsWith("Relationships:")) {
      currentTable = null;
      currentSection = null;
    }
  }

  return tables;
}

// ─── 3. Compare and report ──────────────────────────────────────

interface DriftItem {
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  table: string;
  message: string;
}

function detectDrift(sqlTables: SqlTable[], tsTables: TsTable[]): DriftItem[] {
  const drift: DriftItem[] = [];

  // Check: SQL tables missing from database.ts
  for (const sqlTable of sqlTables) {
    const tsTable = tsTables.find((t) => t.name === sqlTable.name);
    if (!tsTable) {
      drift.push({
        severity: "CRITICAL",
        table: sqlTable.name,
        message: `Table exists in migration (${sqlTable.sourceFile}) but MISSING from database.ts`,
      });
      continue;
    }

    // Check: SQL columns missing from Row type
    for (const sqlCol of sqlTable.columns) {
      const tsCol = tsTable.rowColumns.find((c) => c.name === sqlCol.name);
      if (!tsCol) {
        drift.push({
          severity: "HIGH",
          table: sqlTable.name,
          message: `Column "${sqlCol.name}" (${sqlCol.type}) in migration but MISSING from Row type`,
        });
      }
    }
  }

  // Check: database.ts tables missing from migrations
  for (const tsTable of tsTables) {
    const sqlTable = sqlTables.find((t) => t.name === tsTable.name);
    if (!sqlTable) {
      drift.push({
        severity: "CRITICAL",
        table: tsTable.name,
        message: `Table exists in database.ts but MISSING from migrations — phantom table`,
      });
    }
  }

  // Check: database.ts Row columns not in migrations
  for (const tsTable of tsTables) {
    const sqlTable = sqlTables.find((t) => t.name === tsTable.name);
    if (!sqlTable) continue;

    for (const tsCol of tsTable.rowColumns) {
      const sqlCol = sqlTable.columns.find((c) => c.name === tsCol.name);
      if (!sqlCol) {
        drift.push({
          severity: "MEDIUM",
          table: tsTable.name,
          message: `Column "${tsCol.name}" in database.ts Row but NOT in any migration — phantom column`,
        });
      }
    }
  }

  return drift;
}

// ─── 4. Main ─────────────────────────────────────────────────────

function main() {
  console.log("╔══════════════════════════════════════╗");
  console.log("║  HEXIS Schema Drift Detector         ║");
  console.log("╚══════════════════════════════════════╝\n");

  const sqlTables = parseMigrations();
  const tsTables = parseDatabaseTs();

  console.log(`SQL Migrations: ${sqlTables.length} tables`);
  for (const t of sqlTables) {
    console.log(`  ● ${t.name} (${t.columns.length} columns) — ${t.sourceFile}`);
  }

  console.log(`\ndatabase.ts: ${tsTables.length} tables`);
  for (const t of tsTables) {
    console.log(`  ● ${t.name} (${t.rowColumns.length} Row columns)`);
  }

  console.log();

  const drift = detectDrift(sqlTables, tsTables);

  if (drift.length === 0) {
    console.log("✅ No schema drift detected. Migrations and database.ts are in sync.\n");
    process.exit(0);
  }

  // Group by severity
  const critical = drift.filter((d) => d.severity === "CRITICAL");
  const high = drift.filter((d) => d.severity === "HIGH");
  const medium = drift.filter((d) => d.severity === "MEDIUM");

  console.log(`❌ Schema drift detected: ${drift.length} issue(s)\n`);

  if (critical.length > 0) {
    console.log("━━━ CRITICAL ━━━");
    for (const d of critical) {
      console.log(`  [${d.table}] ${d.message}`);
    }
    console.log();
  }

  if (high.length > 0) {
    console.log("━━━ HIGH ━━━");
    for (const d of high) {
      console.log(`  [${d.table}] ${d.message}`);
    }
    console.log();
  }

  if (medium.length > 0) {
    console.log("━━━ MEDIUM ━━━");
    for (const d of medium) {
      console.log(`  [${d.table}] ${d.message}`);
    }
    console.log();
  }

  console.log("Fix: Run 'npx supabase gen types typescript --local > src/types/database.ts'");
  console.log("  or manually update database.ts to match migration schema.\n");

  // Exit 1 only for CRITICAL/HIGH
  if (critical.length > 0 || high.length > 0) {
    process.exit(1);
  }
  process.exit(0);
}

main();
