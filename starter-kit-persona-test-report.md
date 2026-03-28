# EU AI Act Compliance Starter Kit — Persona-Based Test Report

**Date:** 20 March 2026
**Tested by:** 2 independent personas (simulated)
**Kit version:** v1.1 (post-fix, 5 files)
**Price point:** €99

---

## PERSONAS

**Persona A — Ayşe Kılıç:** Turkish manufacturing company DPO, 4 AI systems, intermediate technical level, first EU AI Act compliance project, €99 total budget.

**Persona B — Marcus Weber:** German senior compliance consultant, ISO 42001 Lead Auditor, 22 systems across 6 clients, expert-level knowledge, evaluating kit as client delivery tool.

---

## CONSOLIDATED VERDICTS

| Dimension | Persona A | Persona B | Combined |
|-----------|-----------|-----------|----------|
| 1. Structural Integrity | 6/10 🟡 | 6/10 🟡 | **6/10 🟡** |
| 2. User Experience | 5/10 🟡 | 6/10 🟡 | **5.5/10 🟡** |
| 3. Legal Compliance | 7/10 🔴 | 5/10 🔴 | **6/10 🔴** |
| 4. Value Delivered | 7/10 ✅ | 7/10 ✅ | **7/10 ✅** |
| 5. Guidance Quality | 7/10 ✅ | 6/10 🟡 | **6.5/10 🟡** |
| 6. Edge Cases | 6/10 🟡 | 5/10 🟡 | **5.5/10 🟡** |
| 7. Competitor Benchmarking | 6/10 🟡 | 7/10 ✅ | **6.5/10 🟡** |
| 8. Output Quality | 8/10 ✅ | 6/10 🟡 | **7/10 ✅** |
| **OVERALL** | **6.5/10** | **6.1/10** | **6.3/10** |

**Ayşe's verdict:** PARTIAL PASS — good starting point but needs legal fixes
**Marcus's verdict:** CONDITIONAL BUY — would recommend to SME clients after corrections

---

## CROSS-PERSONA FINDINGS

### 🔴 CRITICAL — Must Fix Before Launch (Both personas flagged)

#### C1. FRIA Scope Error in Inventory Example Note
- **Ayşe's view:** Note says "FRIA required" on HR screening example — confusing because she doesn't know if HER HR system needs FRIA
- **Marcus's view:** LEGALLY WRONG — private HR screening does NOT trigger mandatory FRIA under Art. 27. Only public bodies, public-service providers, and credit/insurance deployers
- **Location:** `create_inventory.py` line 232
- **Fix:** Change note to: "FRIA mandatory only for: (1) public bodies, (2) private entities providing public services, (3) credit scoring/insurance deployers (Art. 27). This HR system example does NOT require FRIA."
- **Effort:** 15 min

#### C2. Art. 50(2) Synthetic Content Marking — Inconsistent Coverage
- **Ayşe's view:** If her company uses AI for marketing copy, she'd miss this obligation entirely from the Risk Worksheet decision tree
- **Marcus's view:** Art. 50(2) IS in Assessment Obligations Map (Row 10) but MISSING from Risk Worksheet Step 4 decision tree. Users following only the worksheet miss it.
- **Location:** `create_risk_worksheet.py` Step 4 (Page 1)
- **Fix:** Add to Step 4: "Does this system generate synthetic audio, images, video or text? → YES → Art. 50(2): Machine-readable marking required"
- **Effort:** 30 min

#### C3. Risk Level Dropdown — "GPAI (Systemic)" Inconsistency
- **Ayşe's view:** If she classifies a system as GPAI Systemic in Assessment, she can't find that option in Risk Worksheet or Inventory
- **Marcus's view:** Professional inconsistency — breaks cross-template data flow
- **Location:** Inventory has 6 values, Assessment has 7 (includes "GPAI (Systemic)"), Risk Worksheet PDF has 5
- **Fix:** Standardize ALL templates to 7 values: "Prohibited, High, Limited, GPAI, GPAI (Systemic), Minimal, Not Yet Classified"
- **Effort:** 1 hour

#### C4. Annex III Area 5 — Healthcare & Social Benefits Under-Emphasized
- **Ayşe's view:** If her company had a healthcare eligibility AI, she might classify it as Minimal instead of High Risk
- **Marcus's view:** Kit groups "essential services" too loosely. Healthcare access, social benefits eligibility, and housing access should be explicitly listed
- **Location:** `create_risk_worksheet.py` Page 1 Annex III list + Step 3
- **Fix:** Expand Area 5: "Essential services — including: public assistance, healthcare access/eligibility, housing access, credit scoring, insurance, emergency dispatch"
- **Effort:** 30 min

#### C5. Art. 43 Conformity Assessment — Over-Simplified
- **Ayşe's view:** Not a major issue for her (she'd follow whatever the kit says)
- **Marcus's view:** Kit claims "third-party for biometrics, critical infrastructure" — WRONG for critical infrastructure. Third-party mandatory ONLY if Annex I product legislation requires it. Optional for biometrics when harmonised standards exist.
- **Location:** `create_compliance_assessment.py` Obligations Map Row 10
- **Current text:** "Notified body optional for biometric systems (Annex III point 1) when harmonised standards exist. Third-party mandatory only if required by Annex I product legislation."
- **Status:** Text was ALREADY FIXED in v1.1. However, the Quick Reference (Risk Worksheet Page 4) may still have older wording.
- **Effort:** 15 min verification

### 🟡 MEDIUM — Fix in v1.1 (First 2 Weeks Post-Launch)

#### M1. "ALL" System Code — Undefined
- **Who flagged:** Persona A
- **Issue:** Roadmap uses "ALL" as System ID for org-level actions (AI Literacy, Post-Market Monitoring). Not explained anywhere.
- **Fix:** Add to Roadmap Instructions: "Use 'ALL' for organisation-wide obligations that apply across all systems"
- **Effort:** 10 min

#### M2. Dashboard Hardcoded System Lists
- **Who flagged:** Both personas
- **Issue:** Assessment Dashboard Per-System Summary only shows AI-001, AI-002, AI-003. Adding AI-004 breaks dashboard.
- **Ayşe's impact:** She has 4 systems — dashboard lies about her 4th system
- **Marcus's impact:** With 22 systems, dashboard is useless
- **Fix:** Add 7 more empty rows (AI-004 through AI-010) with placeholder formulas, or use UNIQUE formula (Excel 365)
- **Effort:** 2 hours

#### M3. Timeline View — Hardcoded Dates
- **Who flagged:** Both personas
- **Issue:** Roadmap Timeline shows Mar 2026 – Feb 2027. Customer buying in Sep 2026 sees stale dates.
- **Fix:** Use "Month 1, Month 2..." labels OR add "Start Date" input cell
- **Effort:** 1 hour

#### M4. Estimated Completion Time — Too Optimistic
- **Who flagged:** Persona A
- **Issue:** Quick Start says "2-4 hours for up to 5 systems". Realistic: 4-6 hours.
- **Fix:** Change to "4-6 hours for initial assessment of up to 5 AI systems"
- **Effort:** 5 min

#### M5. ORIENT Framework — Not Explained in Kit
- **Who flagged:** Both personas
- **Issue:** Kit references ORIENT but never defines what O-R-I-E-N-T stands for. Insider jargon for customers.
- **Fix:** Add ORIENT definition to Quick Start Guide or each template's Instructions sheet
- **Effort:** 20 min

#### M6. Art. 5 Prohibited Practices — Missing Biometric Categorization
- **Who flagged:** Persona B
- **Issue:** Kit lists 6 prohibited categories but omits "biometric categorization for inferring sensitive attributes" (Art. 5(1)(d) — separate from emotion recognition)
- **Fix:** Add to Risk Worksheet Step 1 examples
- **Effort:** 15 min

#### M7. Art. 73 Tiered Deadlines — Missing from Quick Reference
- **Who flagged:** Persona B
- **Issue:** Quick Reference (Page 4) says "Art. 73 — Serious incident reporting" without specifying 15/10/2 day deadlines. Assessment has the detail, but Quick Reference should too.
- **Fix:** Add deadline tiers to Quick Reference table
- **Effort:** 15 min

#### M8. Multi-Domain System Guidance Missing
- **Who flagged:** Persona B
- **Issue:** If a system falls under multiple Annex III areas (e.g., biometric + healthcare), kit doesn't explain what to do
- **Fix:** Add FAQ: "If your system falls under multiple Annex III areas, create separate Gap Assessment rows per obligation area"
- **Effort:** 10 min

### 🟢 MINOR — Nice to Have (v1.1 or v2.0)

#### N1. Client Name / Assessment Date Fields Missing
- **Who flagged:** Persona B
- **Issue:** Templates don't ask for client name, assessor name, assessment date at top. Unprofessional for consulting delivery.
- **Fix:** Add metadata fields to top of each template

#### N2. Dashboard Formula Range Limitation
- **Who flagged:** Both personas
- **Issue:** Formulas reference F2:F100 / I2:I100. Exceeding 100 rows breaks dashboard.
- **Fix:** Extend to F2:F500 or use dynamic ranges

#### N3. Risk Worksheet PDF — No GPAI (Systemic) Path
- **Who flagged:** Persona A
- **Issue:** Risk Worksheet classification levels don't include "GPAI (Systemic)" as an output — only "GPAI"
- **Fix:** Add systemic risk assessment note after Step 5

#### N4. Art. 53(2) Open-Source GPAI Exemption Not Mentioned
- **Who flagged:** Persona B
- **Issue:** Kit doesn't mention reduced obligations for open-source GPAI models
- **Fix:** Add note to GPAI section

#### N5. Territorial Scope Guidance Absent
- **Who flagged:** Persona B
- **Issue:** If EU AI Act applies to non-EU systems used by EU-based companies, kit doesn't explain
- **Fix:** Add FAQ or note in Inventory Instructions

#### N6. Change Management Path Missing
- **Who flagged:** Persona B
- **Issue:** If a system evolves from Limited Risk to High Risk, no change tracking mechanism
- **Fix:** Consider adding "Prior Risk Level" column in Assessment

---

## LEGAL COMPLIANCE — ARTICLE-BY-ARTICLE SUMMARY

| Article | Description | Persona A | Persona B | Status |
|---------|-------------|-----------|-----------|--------|
| Art. 4 | AI Literacy | ✅ | ✅ | PASS |
| Art. 5 | Prohibited Practices | 🟡 (mostly correct) | 🟡 (missing biometric cat.) | PARTIAL |
| Art. 6(1) | Annex I Product Safety | ✅ | ✅ | PASS |
| Art. 6(2) | Annex III High-Risk | 🟡 (Area 5 incomplete) | 🟡 (healthcare/social benefits) | PARTIAL |
| Art. 6(3) | Exception + Profiling | ✅ | ✅ | PASS |
| Art. 9 | Risk Management | ✅ | ✅ | PASS |
| Art. 10 | Data Governance | ✅ | ✅ | PASS |
| Art. 11 | Technical Documentation | ✅ | ⚠️ (Annex IV template missing) | PARTIAL |
| Art. 12 | Record-Keeping | ✅ | ✅ | PASS |
| Art. 13 | Transparency to Deployers | ✅ | 🟡 (vague) | PARTIAL |
| Art. 14 | Human Oversight | ✅ | ✅ | PASS |
| Art. 15 | Accuracy/Robustness/Cyber | ✅ | ✅ | PASS |
| Art. 27 | FRIA | 🟡 (scope simplified) | 🔴 (example note wrong) | FAIL |
| Art. 43 | Conformity Assessment | 🟡 | 🟡 (critical infra claim) | PARTIAL |
| Art. 49 | EU Database Registration | ✅ | ✅ | PASS |
| Art. 50(1) | Chatbot Disclosure | ✅ | ✅ | PASS |
| Art. 50(2) | Synthetic Content Marking | 🔴 (missing from worksheet) | 🟡 (in obligations, not workflow) | FAIL |
| Art. 50(3) | Emotion/Biometric Disclosure | ✅ | ✅ | PASS |
| Art. 50(4) | Deepfake Disclosure | ✅ | ✅ | PASS |
| Art. 51-56 | GPAI Obligations | ✅ | ✅ (minor: open-source gap) | PASS |
| Art. 72 | Post-Market Monitoring | ✅ | ✅ | PASS |
| Art. 73 | Incident Reporting | ✅ | ✅ (missing from Quick Ref) | PASS |
| Art. 95 | Voluntary Codes | ✅ | ✅ | PASS |
| Art. 99 | Penalties | ✅ | ✅ | PASS |
| Timeline | Enforcement Dates | ✅ | ✅ | PASS |
| Digital Omnibus | Status Flag | ✅ | ✅ | PASS |

**Legal Compliance Score:** 21/26 PASS, 3 PARTIAL, 2 FAIL

---

## PRIORITIZED ACTION PLAN

### Phase 0: Launch Blockers (4-6 hours)

| # | Finding | Impact | Effort |
|---|---------|--------|--------|
| C1 | FRIA example note correction | Legal error → liability | 15 min |
| C2 | Art. 50(2) to Risk Worksheet Step 4 | Missing obligation → customer harm | 30 min |
| C3 | Risk Level dropdown standardization (7 values) | UX break | 1 hour |
| C4 | Annex III Area 5 expansion (healthcare, social benefits, housing) | Missing high-risk domain | 30 min |
| C5 | Verify Art. 43 wording in Quick Reference | Legal clarification | 15 min |

### Phase 1: v1.1 Improvements (3-4 hours, first 2 weeks)

| # | Finding | Impact | Effort |
|---|---------|--------|--------|
| M1 | "ALL" system code explanation | User confusion | 10 min |
| M2 | Dashboard expansion (10 system slots) | Scaling limitation | 2 hours |
| M3 | Timeline relative dates | Future-proofing | 1 hour |
| M4 | Realistic time estimate (4-6 hours) | Expectation management | 5 min |
| M5 | ORIENT framework definition in kit | Brand clarity | 20 min |
| M6 | Art. 5 biometric categorization addition | Legal completeness | 15 min |
| M7 | Art. 73 deadlines in Quick Reference | Legal detail | 15 min |
| M8 | Multi-domain system guidance | Edge case support | 10 min |

### Phase 2: v2.0 Professional Edition — €149 (20 hours)

| Feature | Value | Effort |
|---------|-------|--------|
| Annex IV technical documentation template | €40 standalone | 6 hours |
| KVKK-EU AI Act crosswalk module | €30 standalone | 8 hours |
| Vendor/supplier AI assessment framework | €25 standalone | 6 hours |

---

## VALUE ASSESSMENT

### For Ayşe (SME DPO, 4 systems):
- **Saves:** €1,000-2,000 in initial consultant time
- **Delivers:** Structured compliance framework, risk classification, gap analysis, action plan
- **ROI:** 10-20x at €99
- **Verdict:** WORTH BUYING (after fixes)

### For Marcus (Consultant, 22 systems):
- **Use case:** Client delivery template for SME engagements
- **Revenue potential:** €600-800 per client delivery → 3-4 clients/year = €1,800-3,200
- **ROI:** 20-30x at €99
- **Limitation:** Requires multiple files for 6+ systems; dashboard doesn't auto-scale
- **Verdict:** CONDITIONAL BUY (after legal corrections)

### Competitive Position:
- vs. Big 4 templates (€5K-15K): 2% of cost, 60% of value
- vs. AI governance platforms (€200/mo): Static but cheaper; no automation
- vs. EU AI Office guidance (free): Kit adds templates + workflow structure
- vs. Law firm analysis (€3K-8K): Kit is starting point, not replacement

---

## FINAL RECOMMENDATION

**Launch readiness:** 🟡 NOT YET — 5 critical fixes required (4-6 hours work)

**After fixes:** ✅ READY FOR LAUNCH at €99

**Key strengths:**
- Well-designed 4-template workflow aligned with ORIENT
- 21 obligation areas correctly mapped (after Art. 50(2) fix)
- Professional visual design (Hexis Web Palette)
- Realistic example data
- Board-presentable output quality

**Key weaknesses to acknowledge in marketing:**
- Manual data transfer between templates (not automated)
- Optimized for 3-5 systems; requires workarounds for larger portfolios
- Starter kit — not a replacement for legal counsel
- No Annex IV or FRIA template included (v2.0 roadmap)

---

*hexis.center · EU AI Act Compliance Starter Kit · Persona-Based Test Report · 20 March 2026*
