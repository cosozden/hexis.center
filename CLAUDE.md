# HEXIS Web Platform — Claude Code Project Context

> **Read this file at the start of EVERY session working on hexis.center.**

---

## 1. Project Identity

**Project:** HEXIS AI Governance Web Platform
**Repo:** github.com/cosozden/hexis.center
**Sister Repo:** github.com/cosozden/hexis-ai-governance (Claude Cowork plugin — has its own CLAUDE.md)
**Hosting:** GitHub Pages (custom domain: hexis.center)
**Founder:** Özden — ISO/IEC 42001 Implementer, IAPP member
**Web:** hexis.center

**Language Policy:**
- Generator, methodology pages: **English**
- Checklist, metodoloji, blog: **Turkish**
- Legal/technical terms always in English regardless of page language

**Brand Voice:**
- Clear, authoritative, practical — no hype
- "Compliance as orientation, not checklist" (ἕξις — Hexis)
- Minimal, corporate aesthetic — substance over style
- Never use "revolutionary", "game-changing", "cutting-edge" or similar AI hype language

---

## 2. ORIENT Framework (v0.2.1) — CRITICAL REFERENCE

The HEXIS normative methodology. Use these exact terms in ALL outputs.

| Letter | Stage | Description |
|--------|-------|-------------|
| **O** | **Observe** | Identify the AI system, role, and context |
| **R** | **Risk** | Classify risk level per EU AI Act |
| **I** | **Identify** | Map applicable legal obligations |
| **E** | **Evaluate** | Assess current compliance gaps |
| **N** | **Navigate** | Chart path from findings to action |
| **T** | **Track** | Set deadlines and review triggers |

### DEPRECATED TERMS — NEVER USE
| OLD (forbidden) | NEW (required) |
|-----------------|----------------|
| ~~Risk-Assess~~ | **Risk** |
| ~~Normalize~~ | **Navigate** |
| ~~Implement~~ (as ORIENT stage name) | **Identify** |
| ~~Evidence~~ (as ORIENT stage name) | **Evaluate** |

Note: "implement" and "evidence" as regular English verbs are fine. They are only forbidden as ORIENT stage names.

---

## 3. Visual Design System

HEXIS has two visual palettes. This repo uses the **Web Palette**.

### 3A. Web Palette — THIS REPO
**Use for:** hexis.center website, PDF reports, printed documents, formal deliverables.

#### Light Theme (Generator, Methodology)
| Token | Value | Usage |
|-------|-------|-------|
| `--charcoal` | `#1C1E23` | Primary dark, headers, borders |
| `--brass` | `#B2986C` | Accent (used sparingly) |
| `--stone` | `#686662` | Secondary text, muted elements |
| `--paper` | `#F8F7F5` | Page background |
| `--ink` | `#1C1E23` | Body text |
| `--ink-soft` | `#444240` | Lighter body text |
| `--ink-muted` | `#686662` | Labels, hints |
| `--rule` | `rgba(28,30,35,0.14)` | Borders, dividers |
| `--rule-s` | `rgba(28,30,35,0.08)` | Subtle borders |

#### Dark Theme (Homepage, Checklist)
| Token | Value | Usage |
|-------|-------|-------|
| `--dark-bg` | `#16181C` | Page background |
| `--charcoal` | `#1C1E23` | Card backgrounds |
| `--dark-type` | `#E8E6E2` | Primary text |
| `--dark-sub` | `#8A8884` | Secondary text |
| `--border` | `rgba(232,230,226,0.10)` | Borders |
| `--border2` | `rgba(232,230,226,0.18)` | Stronger borders |
| `--card` | `rgba(232,230,226,0.04)` | Card fills |

#### Governance Maturity Tones (Generator only)
| Level | Token | Value |
|-------|-------|-------|
| Absent | `--absent` | `#dedad4` |
| Ad Hoc | `--adhoc` | `#c4c2be` |
| Structured | `--structured` | `#8a8884` |
| Continuous | `--continuous` | `var(--stone)` |
| Embedded | `--embedded` | `var(--charcoal)` |

#### Typography
- Headings: Georgia, 'Times New Roman', serif
- Body/UI: Arial, Helvetica, sans-serif
- Labels: 9px, uppercase, letter-spacing 0.1em+
- No Google Fonts — system fonts only

#### Design Rules
- No color fills beyond the grayscale palette
- Borders: 1px–1.5px solid, using --rule or --ink
- No rounded corners (border-radius: 0)
- No shadows
- No decorative elements
- Print-ready: all pages have @media print styles
- A4 page size for PDF export

### 3B. Plugin Palette — SISTER REPO (reference only)
**Use for:** LinkedIn graphics, presentations, infographics, slide decks.
**Full spec:** See hexis-ai-governance/CLAUDE.md Section 3A.

| Role | Hex |
|------|-----|
| Background | `#0A1628` (dark navy) |
| Accent | `#2D6BE4` (agate blue) |
| ORIENT badges | `#F59E0B` (amber) |

**DO NOT** use Plugin Palette colors on the hexis.center website.

### 3C. Editorial Principles (Yön A — active since 22 Apr 2026)

**Applies to:** hexis.center public pages (landing, methodology, metodoloji).

**Visual formula**
- **Hero**: oversized serif H1 (clamp 40–72px) with italic brass focal word; thesis structure "X is [Y], not [Z]" (negative-then-positive); etymology block anchoring *hexis* (ἕξις); version block on right rail
- **Section dividers** (body): oversized brass serif `§` numeral + hairline top-rule + small meta chip. Classes: `.section-divider` → `.section-num` + `.section-meta`. Preface variant = `.preface` modifier (no number, flush meta)
- **Meta chip copy** = semantic context (e.g., "Overview · Six Stages"), NOT "Section NN" restate
- **Scroll reveal** via IntersectionObserver on `.reveal` class (graceful fallback for no-IO browsers)

**Content rules**

| Rule | What it means |
|------|---------------|
| **Bilingual parity** | Any copy change in one language triggers sister-language check (EN ↔ TR). Sister pairs: `index.html` (data-tr/data-en toggle), `methodology/` ↔ `metodoloji/` |
| **Refrain discipline** | Max 1 hero-weight thesis per page. Supporting copy (pull-quote, CTA, manifesto) must shift angle, not restate. Red flag: same key phrase ("yönelim/orientation/destination") 3+ times on one page |
| **Concrete > abstract** | Prefer metric (5 dakika, bir öğle sonrası, 100 sistem) over metaphor (yönelim, duruş biçimi). Prefer verbs (sor, karar ver, gözden geçir) over abstract nouns (disposition, posture) |
| **CTA pre-button copy** | Remove friction (no signup, 5 minutes), not philosophy. Pre-button = action eşiği düşürme, closer = değer teyidi |

**Dead-CSS tolerance:** When removing a Yön A element from HTML, leaving its CSS class defined is acceptable (easy restore). Schedule cleanup as a separate commit.

---

## 4. Site Architecture

```
hexis.center/
├── index.html                  # Homepage (dark theme)
├── eu-ai-act-checklist.html    # Turkish checklist (dark theme)
├── generator/
│   └── index.html              # Contextual Matrix Generator (light theme)
├── methodology/
│   └── index.html              # Methodology page (English)
├── metodoloji/
│   └── index.html              # Methodology page (Turkish)
├── blog/
│   ├── ai-literacy-article-4/
│   ├── iso-42001-governance-maturity/
│   ├── gpai-rules-articles-51-56/
│   └── eu-ai-act-risk-classification/
├── assets/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── logo.png
│   └── og-hexis.png
├── mevzuat-raporlari/          # Haftalık mevzuat takip agent'ı raporları
├── _headers                    # Cloudflare Pages HTTP headers
├── _redirects                  # Cloudflare Pages redirects (301)
├── robots.txt
├── sitemap.xml
├── dijital-gelir-modeli-kararlar.md  # Stratejik karar raporu (ana referans)
├── hexis-mcp-server-analiz.md        # MCP Server mimari analiz raporu
└── CLAUDE.md                   ← this file
```

### Page Theme Map
| Page | Theme | Language |
|------|-------|----------|
| index.html | Dark | Mixed |
| eu-ai-act-checklist.html | Dark | Turkish |
| generator/index.html | Light | English |
| methodology/ | Light | English |
| metodoloji/ | Light | Turkish |
| blog/* | Dark | Turkish |

---

## 5. Generator Architecture (generator/index.html)

### Component A: Risk Classifier Wizard (top of page)
7-step decision tree following EU AI Act classification logic:
1. Prohibited practices (Art. 5) — early termination if positive
2. Product safety / Annex I (Art. 6(1))
3. Annex III domain selection — 8 high-risk areas (Art. 6(2))
3b. Art. 6(3) exception check — conditional (only shown if Annex III selected). 4 exception conditions + profiling always-high-risk rule
4. Transparency obligations (Art. 50) — includes Art. 50(3) emotion/biometric disclosure
5. GPAI classification (Art. 51–56) — provider / systemic / deployer
6. Fundamental rights impact assessment

**Result card:** Risk level + article references + obligation table + deadline countdown + KVKK block (if personal data=yes from Observe) + EU database registration (Art. 49) + pre-assessment signals (rule-based) + Identify checklist link
**Skip option:** "I know my risk level →" bypasses wizard
**On completion:** Auto-fills Risk Exposure dropdown and triggers matrix generation
**Observe → Risk data flow:** EU market scope, AI component, organisation role transferred. Banner warnings for non-EU market, rule-based systems. Role auto-applied to result card.

### Component B: Configurator (dark bar)
- System Name (text input)
- Risk Exposure: Low / Moderate / Elevated / High
- Oversight: Absent → Embedded (5 levels)
- Monitoring: Absent → Embedded (5 levels)
- Documentation: Absent → Embedded (5 levels)
- Generate → / Export PDF buttons

### Component C: Governance Activation Matrix (report output)
- 5×4 grid: Maturity levels × Exposure levels
- **Weighted maturity:** Oversight 1.5, Monitoring 1.4, Documentation 1.0
- **Minimum safeguard principle:** Absent in any dimension caps maturity at Ad Hoc
- **Urgency index:** exposure weight (1.6) > maturity mitigation (0.8)
- Focal cell: posture + hint
- Callout: Activation posture + Immediate action + 30-day target
- "Why this position?" — rule-based reasoning engine (API-ready)
- Print-optimized for A4 PDF output

### Data Flow
```
Classifier Wizard → Risk Exposure dropdown → Generate Matrix → Report
                                         ↗
Manual dropdown selection (skip wizard) ─┘
```

### API Architecture (V2 — not yet implemented)
- "Why this position?" section is API-ready
- V1: Rule-based engine (REG_SIGNALS + MATURITY_GAP + dimension flags)
- V2 plan: Frontend → POST /api/why → Backend → Anthropic API
- API key never exposed in browser

---

## 6. Checklist Architecture (eu-ai-act-checklist.html)

- Language: Turkish
- Target audience: Turkish SMEs
- 6 sections, 23 items with interactive checkboxes
- Real-time progress tracking (percentage + progress bar)
- EU AI Act ↔ KVKK comparison table (8 topics)
- PDF export (opens formatted print-ready window)
- Blog links, official source links

### Sections
1. Risk Sınıflandırma & Sistem Envanteri (4 items)
2. Şeffaflık & Bilgilendirme (3 items)
3. İnsan Gözetimi & Karar Mekanizmaları (4 items)
4. Teknik Dokümantasyon & Uyum Altyapısı (3 items)
5. Veri Yönetimi & Önyargı Kontrolü (5 items)
6. Yönetişim & Sorumluluk (4 items)

---

## 7. Three-Tool User Journey

```
[Classifier]  →  [Generator]  →  [Checklist]
"What risk?"     "Where am I?"    "What to do?"
 ORIENT: R        ORIENT: E        ORIENT: N
```

### Current Status
- Classifier → Generator: ✅ Connected (auto-fills dropdown)
- Generator → Checklist: ⏳ Planned (button link + risk-based filtering)

### Future Integration
- Classifier result passes to Checklist to filter items by risk level
- High-risk → all 23 items active
- Minimal risk → only governance basics (Sections 1, 6)

---

## 8. Cross-Repository Sync

The HEXIS ecosystem has two repos that share classification logic:

| Component | Plugin Repo | Web Repo |
|-----------|-------------|----------|
| Risk classification logic | SKILL.md (text-based) | generator/index.html (JavaScript) |
| ORIENT framework | CLAUDE.md Section 2 | CLAUDE.md Section 2 |
| EU AI Act references | CLAUDE.md Section 4* | CLAUDE.md Section 9* |

**Sync rule:** Changes to classification logic, ORIENT terminology, or EU AI Act references must be reflected in BOTH repos.

*Section numbers in respective CLAUDE.md files.

### Strategic Documents (MUST READ for SaaS decisions)

| Document | Location | Purpose |
|----------|----------|---------|
| **Karar Raporu** | `dijital-gelir-modeli-kararlar.md` | ALL strategic decisions — revenue model, pricing, architecture, Claude API integration, MCP Server, risk mitigations. Primary reference for any SaaS-related work. |
| **MCP Server Analiz** | `hexis-mcp-server-analiz.md` | Detailed MCP Server architecture, tool specs, GDPR analysis, security design. Reference when building API endpoints or MCP tools. |
| **Mevzuat Raporları** | `mevzuat-raporlari/` | Weekly EU AI Act regulatory scan reports (automated). Check before updating classifier-engine or obligation lists. |

**Critical cross-repo decisions (from karar raporu, binding for app.hexis.center):**
- **AI-assisted, not AI-dependent:** Deterministic engines decide, Claude enriches. Claude layer is optional (Manuel Mod).
- **MCP = Pro-only:** MCP Server access requires paid subscription. API endpoints must be MCP-ready (Zod schema + dual JSON/Markdown response).
- **Shared service layer:** Web dashboard and MCP Server call the same TypeScript functions. Single source of truth in `tools.ts`.
- **3-layer article verification:** Compile-time tests → runtime cross-check → weekly Mevzuat Agent update.
- **No auto-propagation:** Mevzuat Agent reports NEVER auto-update engines. Founder approval required for every engine change.

### hexis.center Live Tools
| File | Tool | ORIENT Stage |
|------|------|-------------|
| `generator/index.html` | Observe form (v2, 4 groups + KVKK block) + Risk Classifier (Steps 1–7, incl. Art. 6(3) exception) + Governance Activation Matrix | Observe → Risk → Evaluate |
| `checklist/index.html` | EU AI Act compliance checklist | Identify → Evaluate |
| `fria/index.html` | FRIA (Fundamental Rights Impact Assessment) | Evaluate |
| `eu-ai-act-checklist.html` | Standalone EU AI Act checklist | Identify |

### hexis.center Pending Tools (backlog)
- AI Impact Assessment Template → Evaluate
- Vendor/Supplier AI Assessment Framework → Risk
- Governance Activation Blueprint (Annex IV technical docs) → Evaluate/Navigate
- Release Readiness Checklist (5 dimensions) → Navigate
- AI Governance Summary Report PDF → all stages

### V2 Backlog — API Integration
- **AI System Card "Ön Değerlendirme Sinyalleri" → Anthropic API:** Currently rule-based keyword matching on intended purpose field. V2 will POST purpose text + form data to backend → Anthropic Claude API for intelligent pre-assessment. API key never exposed in browser (backend proxy required). Target: after Navigate/Track tools are built.

---

## 9. EU AI Act Reference Standards

### Risk Categories (exact official terminology)
- **Prohibited** (Unacceptable risk) — Article 5
- **High-risk** — Article 6 + Annex I / Annex III
- **Limited risk** (Transparency obligations) — Article 50
- **General-purpose AI models** — Articles 51–56
- **Minimal risk** — Voluntary codes of conduct (Art. 95)

### Enforcement Timeline
| Date | What | Status |
|------|------|--------|
| 2 Feb 2025 | Prohibited practices (Art. 5) + AI literacy (Art. 4) | **In force** |
| 2 Aug 2025 | GPAI obligations (Chapter V) | **In force** |
| 2 Aug 2026 | High-risk systems — Annex III | Upcoming |
| 2 Aug 2027 | High-risk systems — Annex I (product safety) | Upcoming |

### Digital Omnibus (proposed Nov 2025)
- **Status:** Under ordinary legislative procedure — NOT YET ADOPTED
- **If adopted:** May extend Annex III deadline to max 2 Dec 2027, Annex I to max 2 Aug 2028
- **AI literacy:** Proposal may shift responsibility from providers/deployers to Commission/Member States
- Always flag as uncertain: "Digital Omnibus (proposed): If adopted, may extend deadlines — monitor status"

### Citation Format
Always cite with article numbers: "Article 6(1)(a) Regulation (EU) 2024/1689"

### Key Penalties
- Prohibited violations: €35M or 7% global turnover, whichever is higher (Art. 99(3))
- High-risk violations: €15M or 3% global turnover, whichever is higher (Art. 99(4))
- Incorrect information: €7.5M or 1%, whichever is higher (Art. 99(5))
- SMEs and startups: same amounts/percentages but whichever is **lower** (Art. 99(6))

---

## 10. Quality Assurance

Before any commit:
1. HTML validates (no unclosed tags)
2. CSS custom properties reference correctly (no undefined tokens)
3. EU AI Act article numbers verified (web search, not memory)
4. Print/PDF output tested
5. Both light theme (generator) and dark theme (checklist) tested
6. Mobile responsive checked (flex-wrap, clamp())
7. No console errors in browser
8. Correct palette used (Web palette only — never Plugin palette)
9. ORIENT terminology is v0.2.1 (Navigate, not Normalize)

---

## 10b. Pre-commit Test Protocol (app.hexis.center SaaS Platform)

**MANDATORY:** Run this checklist before EVERY commit. No exceptions.

### Automated Validation Suite (scripts/)

Three automated scripts catch the most dangerous bug classes before commit:

```bash
npm run validate          # Quick: schema + contracts + routes (~10s)
npm run validate:full     # Full: above + next build (~60s)
```

| Script | What it catches | Command |
|--------|----------------|---------|
| `validate:schema` | Migration SQL ↔ database.ts drift (missing tables, phantom columns) | `npx tsx scripts/validate-schema.ts` |
| `validate:contracts` | Wrong Supabase table/column names in .from()/.select()/.insert() | `npx tsx scripts/validate-api-contracts.ts` |
| `validate:routes` | Broken Link href / router.push / redirect → nonexistent routes | `npx tsx scripts/validate-routes.ts` |

**Git hook setup:** `bash scripts/install-hooks.sh` — installs pre-commit hook that runs `npm run validate` automatically.

### Phase 1: Automated Checks (CI + local)
```
npm run validate          # Schema + contracts + routes (MUST pass)
npx next build            # Must compile with 0 errors
npx vitest run            # All tests must pass
```

### Phase 2: Import & Dependency Audit (Claude review)
For EVERY new or modified file, verify:
1. **Import paths resolve** — every `@/...` import maps to an existing file
2. **Named exports exist** — imported functions/components actually exported from source
3. **Type compatibility** — DB types match component props (check `database.ts` Insert/Row types)
4. **Required fields included** — especially `org_id`, `created_by` for DB inserts (multi-tenancy critical)

### Phase 3: CSS & Token Audit (Claude review)
1. **No undefined CSS tokens** — every Tailwind class must resolve to a defined value in `tailwind.config.ts` or `globals.css`
2. **Theme scope correct** — `.theme-light` classes used in dashboard, dark theme classes used in auth/landing
3. **CSS variable chain intact** — Tailwind token → CSS variable → `:root` / `.theme-light` definition all present

### Phase 4: Navigation & Link Audit (AUTOMATED — validate:routes)
1. **All `href` values point to existing routes** — ✅ automated by `validate-routes.ts`
2. **Dashboard routes prefixed with `/dashboard/`** — ✅ automated
3. **Router.push destinations exist** — ✅ automated

### Phase 5: API Contract Audit (PARTIALLY AUTOMATED — validate:contracts)
1. **Table/column names valid** — ✅ automated by `validate-api-contracts.ts`
2. **Request/response shapes match** — Claude review (Zod schema)
3. **Error handling non-fatal** — Claude review
4. **Auth + rate limit present** — Claude review: every API route starts with `authenticateRequest()` + `checkRateLimit()`

### Phase 6: Logic Audit (Claude review)
1. **Race conditions** — concurrent requests can't corrupt data
2. **Null/undefined handling** — optional fields have fallbacks
3. **Graceful degradation** — Claude API failure returns deterministic result
4. **Supabase relationship joins** — verify `Relationships` array has FK definitions before using `!inner()` syntax

### Severity Guide
| Severity | Examples | Action |
|----------|----------|--------|
| **CRITICAL** | Missing `org_id`, broken auth, data leak, wrong table name | Block commit — fix immediately |
| **HIGH** | Wrong route paths, undefined tokens, type mismatches | Block commit — fix before push |
| **MEDIUM** | Missing default props, no cn() utility, style issues | Fix if time allows, otherwise track |
| **LOW** | Code style, unused imports, comment quality | Optional |

---

## 11. Sprint Status (Shared Across Repos)

**Sprint 1 (Risk Classifier MVP):** ✅ COMPLETE
- Plugin: risk-classify command + SKILL.md ✅
- Web: Risk Classifier wizard in generator ✅

**Sprint 2 (Compliance Documenter + Platform Integration):** ⏳ CURRENT — closing April/May 2026
- ✅ Observe form v2 (4 groups + KVKK block)
- ✅ Risk Classifier v2 (Art. 6(3) exception, Art. 50(3), Observe→Risk data flow, KVKK risk block, Identify link)
- ✅ Landing page v2 (hero + "What Hexis Is" positioning, 22 Apr 2026)
- ⏳ Claude-Optional flag on 7 AI endpoints (new baseline — see karar raporu Sec. 8.5)
- ⏳ Jurisdiction-aware onboarding (`jurisdiction_scope` field — see karar raporu Sec. 8.3)
- ⏳ Identify stage tool analysis (EU AI Act Checklist — risk-level filtering)
- ⏳ Evaluate stage tool analysis (FRIA + Governance Activation Matrix)
- FRIA template generator (Art. 27)
- Three-tool integration: Classifier → Generator → Checklist

**Sprint 2.5 (AI Risk Triage — KILLER FEATURE):** 🆕 Planned May-June 2026
- Playbook schema (`playbooks`, `system_playbook_applications`, `triage_batches`, `ai_systems`)
- API endpoints: `/api/triage/upload`, `/api/triage/run`, `/api/triage/export` (MCP-ready)
- CSV → xlsx/pdf bulk risk classification
- Pro-only feature (ARR driver)
- Full spec: `ai-risk-triage-urun-spec.md`

**Sprint 3 (AI Literacy + KVKK Crosswalk):** Planned Q3 2026
**Sprint 4 (Launch + Community):** Planned Q3 2026 (around 2 Aug Annex III enforcement)

### Deferred to Q2 2027 (22 Apr 2026 decision)
- Navigate stage tool — existing `navigate-engine.ts` + `action-plan.tsx` kept as deep links
- Track stage tool — existing `compliance-tracker.tsx` kept as deep link
- Technical documentation template (Art. 11 + Annex IV)
- Conformity assessment guidance (Art. 43)
- Post-market monitoring plan template (Art. 72)

Rationale: Risk Triage + Observe/Risk/Identify/Evaluate close the "orient → deliverable" loop without Navigate/Track. Sales signal will re-open these.

### Q1 2027 Separate Product
- **agency.hexis.center** — Consultancy-focused product, same backend, multi-client UI. NOT merged into Pro tier.

---

## 12. Code Safety Rules

| Risk Level | Description | Action |
|------------|-------------|--------|
| 🟢 LOW | Read, display, calculate | Proceed |
| 🟡 MEDIUM | File create, style change | Inform user |
| 🔴 HIGH | rm, git push --force, structural changes | STOP + ask permission |
| ⛔ CRITICAL | Wildcard delete, plaintext API keys | FORBIDDEN — offer alternative |

---

## 13. Session Start Checklist

At the beginning of each Claude Code session:

1. ✅ Read this CLAUDE.md
2. ✅ Confirm which page/component we're working on
3. ✅ Verify ORIENT terminology is v0.2.1 (Navigate, not Normalize)
4. ✅ Check which theme applies (light = generator/methodology, dark = homepage/checklist/blog)
5. ✅ Confirm Web Palette is being used (never Plugin Palette on this site)
6. ✅ Ask if there are new decisions from claude.ai chat sessions to incorporate
   - Trigger phrase from chat: "Oturumu kapat" → decisions summarized + memory updated
   - Session open template: "Oturum: [topic] / Durum: [where we left off] / Hedef: [goal]"
