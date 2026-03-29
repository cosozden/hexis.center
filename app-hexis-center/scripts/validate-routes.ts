#!/usr/bin/env npx tsx
/**
 * Route Validator — Hexis Pre-commit Tool #1
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Scans all .tsx/.ts files for:
 *   - <Link href="..."> references
 *   - router.push("...") calls
 *   - redirect("...") calls
 *
 * Then validates each target path against existing
 * routes in src/app/ directory structure.
 *
 * Exit code 0 = all routes valid
 * Exit code 1 = broken routes found
 *
 * Usage: npx tsx scripts/validate-routes.ts
 */

import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join, resolve, relative } from "path";

const ROOT = resolve(__dirname, "..");
const APP_DIR = join(ROOT, "src", "app");

// ─── 1. Discover all valid routes from src/app/ ─────────────────────

interface RouteEntry {
  /** e.g. "/dashboard/systems/[id]/classify" */
  path: string;
  /** The file that defines this route */
  file: string;
  /** Whether it's a dynamic segment */
  isDynamic: boolean;
}

function discoverRoutes(dir: string, prefix = ""): RouteEntry[] {
  const routes: RouteEntry[] = [];
  if (!existsSync(dir)) return routes;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Route groups like (auth) or (dashboard) — strip parens from path
      let segment = entry.name;
      if (/^\(.*\)$/.test(segment)) {
        // Route group — don't add to URL path
        routes.push(...discoverRoutes(fullPath, prefix));
      } else {
        routes.push(...discoverRoutes(fullPath, `${prefix}/${segment}`));
      }
    } else if (entry.name === "page.tsx" || entry.name === "page.ts") {
      const routePath = prefix || "/";
      routes.push({
        path: routePath,
        file: relative(ROOT, fullPath),
        isDynamic: routePath.includes("["),
      });
    }
    // route.ts files are API routes — also valid targets
    else if (entry.name === "route.ts" || entry.name === "route.tsx") {
      const routePath = prefix || "/";
      routes.push({
        path: routePath,
        file: relative(ROOT, fullPath),
        isDynamic: routePath.includes("["),
      });
    }
  }
  return routes;
}

// ─── 2. Extract href/push/redirect targets from source files ────────

interface LinkReference {
  /** The file containing the reference */
  sourceFile: string;
  /** Line number (1-based) */
  line: number;
  /** The raw href/path string */
  target: string;
  /** Type of reference */
  type: "Link" | "router.push" | "redirect";
}

function scanFile(filePath: string): LinkReference[] {
  const refs: LinkReference[] = [];
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const relPath = relative(ROOT, filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Match: href="/...", href={`/...`}, href={"/..."}
    const hrefPatterns = [
      /href="(\/[^"]*?)"/g,
      /href=\{`(\/[^`]*?)`\}/g,
      /href=\{"(\/[^"]*?)"\}/g,
    ];

    for (const pattern of hrefPatterns) {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        refs.push({
          sourceFile: relPath,
          line: lineNum,
          target: match[1],
          type: "Link",
        });
      }
    }

    // Match: router.push("/..."), router.push(`/...`)
    const pushPatterns = [
      /router\.push\("(\/[^"]*?)"\)/g,
      /router\.push\(`(\/[^`]*?)`\)/g,
    ];

    for (const pattern of pushPatterns) {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        refs.push({
          sourceFile: relPath,
          line: lineNum,
          target: match[1],
          type: "router.push",
        });
      }
    }

    // Match: redirect("/..."), redirect(`/...`)
    const redirectPatterns = [
      /redirect\("(\/[^"]*?)"\)/g,
      /redirect\(`(\/[^`]*?)`\)/g,
    ];

    for (const pattern of redirectPatterns) {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        refs.push({
          sourceFile: relPath,
          line: lineNum,
          target: match[1],
          type: "redirect",
        });
      }
    }
  }

  return refs;
}

function scanDirectory(dir: string): LinkReference[] {
  const refs: LinkReference[] = [];
  if (!existsSync(dir)) return refs;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      refs.push(...scanDirectory(fullPath));
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      refs.push(...scanFile(fullPath));
    }
  }
  return refs;
}

// ─── 3. Normalize and match ─────────────────────────────────────────

/**
 * Normalize a target path for matching:
 *   /dashboard/systems/${system.id}/classify
 *   → /dashboard/systems/[id]/classify
 */
function normalizePath(target: string): string {
  // Remove query params and hash
  let path = target.split("?")[0].split("#")[0];
  // Remove trailing slash (except root)
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  // Replace template literal expressions with [param]
  path = path.replace(/\$\{[^}]+\}/g, "[dynamic]");
  return path;
}

function routeMatches(normalized: string, route: RouteEntry): boolean {
  const routeSegments = route.path.split("/");
  const targetSegments = normalized.split("/");

  if (routeSegments.length !== targetSegments.length) return false;

  for (let i = 0; i < routeSegments.length; i++) {
    const rs = routeSegments[i];
    const ts = targetSegments[i];

    // Dynamic segment in route matches anything
    if (rs.startsWith("[") && rs.endsWith("]")) continue;
    // Template literal placeholder matches any dynamic segment
    if (ts === "[dynamic]") continue;
    // Exact match required
    if (rs !== ts) return false;
  }
  return true;
}

// ─── 4. Run validation ──────────────────────────────────────────────

function main() {
  console.log("╔══════════════════════════════════════╗");
  console.log("║  HEXIS Route Validator               ║");
  console.log("╚══════════════════════════════════════╝\n");

  // Discover routes
  const routes = discoverRoutes(APP_DIR);
  console.log(`Found ${routes.length} routes in src/app/:\n`);
  for (const r of routes.sort((a, b) => a.path.localeCompare(b.path))) {
    console.log(`  ${r.isDynamic ? "◆" : "●"} ${r.path}`);
  }
  console.log();

  // Scan source files
  const srcDir = join(ROOT, "src");
  const allRefs = scanDirectory(srcDir);

  // Filter to internal routes only (skip external URLs, anchors, etc.)
  const internalRefs = allRefs.filter((ref) => {
    const norm = normalizePath(ref.target);
    // Skip API routes (they use route.ts, not page.tsx)
    if (norm.startsWith("/api/")) return false;
    // Skip external links
    if (norm.startsWith("http")) return false;
    return true;
  });

  console.log(`Found ${internalRefs.length} internal route references.\n`);

  // Validate each reference
  const broken: LinkReference[] = [];

  for (const ref of internalRefs) {
    const normalized = normalizePath(ref.target);
    const hasMatch = routes.some((route) => routeMatches(normalized, route));
    if (!hasMatch) {
      broken.push(ref);
    }
  }

  // Report
  if (broken.length === 0) {
    console.log("✅ All route references are valid.\n");
    process.exit(0);
  } else {
    console.log(`❌ Found ${broken.length} broken route reference(s):\n`);
    for (const b of broken) {
      console.log(`  ${b.sourceFile}:${b.line}`);
      console.log(`    ${b.type} → ${b.target}`);
      console.log(`    Normalized: ${normalizePath(b.target)}`);
      console.log();
    }
    process.exit(1);
  }
}

main();
