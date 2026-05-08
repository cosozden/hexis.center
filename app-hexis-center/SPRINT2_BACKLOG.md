# Sprint 2 Closeout — UX & Engine Backlog

> **Generated:** 8 May 2026, end-to-end QA session for MCP server delivery.
> **Source:** Live test of Customer Service Chatbot scenario through ORIENT
> Observe → Risk wizard, with screenshots and MCP tool cross-checks.
> **Action:** Address before declaring Sprint 2 closed.

---

## 🔴 Engine Bugs — CRITICAL (production blocker)

| ID | Area | Issue |
|----|------|-------|
| **A** | Risk wizard → Obligations engine | Step 4 (Transparency) checkbox selection is not propagated. Only `chatbot` was selected, but the result lists all 4 sub-paragraphs of Art. 50: 50(1), 50(2), 50(3), 50(4). Engine must filter obligations based on which transparency triggers were marked. |
| **B** | Risk result → penalty article mapping | Result shows "Up to €7.5M / 1% turnover (Art. 99(5))". Art. 99(5) is for *incorrect/incomplete information* violations. Transparency obligation violations fall under Art. 99(4) — **€15M / 3% turnover**. Web-search verify and correct (hexis-qa-protocol Faz 2). |
| **C** | Obligations engine | **Art. 4 (AI literacy)** is missing from the obligation list. Art. 4 has applied to *every* AI deployer since 2 Feb 2025, regardless of risk level. Must be auto-attached to every classified system. |
| **D** | Risk wizard persistence | Result screen shows "Obligations (4)" but `obligations` table is not populated — `mcp__hexis-governance__get_obligations` returns empty after Save Classification. Either the wizard payload must INSERT into `obligations`, or the UI must clarify these are *previews* until Identify step (ORIENT 3). Decide which is the intended behaviour, then make UI/data consistent. |

---

## 🟢 Regulatory Accuracy — HIGH

| ID | Area | Issue |
|----|------|-------|
| 7 | Risk wizard Step 1 | Article 5 logic requires multi-select. A system can fall into multiple prohibited categories simultaneously. Current single-select prevents accurate classification. |
| 11 | Risk wizard Step 3 | Annex III areas are shown as one-liners ("Area 1: Biometrics"). Each area has multiple sub-bullets in the official text (e.g. Biometrics → remote ID + categorisation + emotion recognition). Users may answer incorrectly without sub-bullet detail. Suggested: expand/collapse each card with the official Annex III sub-paragraphs. |
| 12 | Risk wizard Step 4 | Article 50 sub-paragraph mapping in the UI must be cross-checked against EUR-Lex 32024R1689 Art. 50(1)–(5). Current mapping in the result screen looks suspect (see Bug B). |
| 14 | Risk wizard Step 6 | Step 6 (FRIA, Art. 27) is shown to every system. FRIA is required only for high-risk deployers in public services, banking, insurance, critical infrastructure. Step 6 should be conditional on prior steps yielding high-risk, OR offer a "Not applicable" option. |

---

## 🟡 UI/UX — HIGH–MEDIUM

| ID | Area | Issue | Sev |
|----|------|-------|-----|
| 1 | Form fields (global) | Placeholder/value text contrast is too low — fails WCAG AA (4.5:1). | HIGH (a11y) |
| 2 | Dropdowns (global) | When opened, label text and options overlap (z-index / absolute-positioning bug). | HIGH |
| 3 | System registration form | Validation is too permissive — "CustomCustomer Service" was accepted as a system name. Add minimum sanity checks (no double-paste artefacts, length limits, trim). | MEDIUM |
| 4 | System detail page | "Responsible: deployer" displayed when Responsible Person/Unit are blank — Organisation Role value is leaking into the Responsible field. Default-value fallback bug. | MEDIUM |
| 5 | Observe form | v2 fields (AI component checkbox, Personal data checkbox, KVKK conditional block) specified in `CLAUDE.md` Section 5 are not present in the registration form. Either integrate here or in the Risk wizard. | HIGH (spec) |
| 6 | Risk wizard Step 1 | Cards display a checkbox icon (☐) but behave as a single-select radio group. Either change icon to radio (○) or implement true multi-select. | HIGH |
| 8 | Risk wizard | "Continue" button visual weight is inconsistent. In Step 1 it renders as a small text link; in Step 5 it renders as a bordered button. Audit Steps 2/3/4/6 and align. | MEDIUM |
| 9 | Risk wizard header | Title reads `Classify {systemName}under the EU AI Act` — missing space between `${name}` and `under` in the template literal. | LOW |
| 10 | Risk wizard Step 1 | "None of the above" should be mutually exclusive with the other prohibited-practice cards (selecting any practice card should automatically deselect "None", and vice versa). | HIGH |
| 13 | Risk wizard Step 4 | Multi-select pattern needed (a system can be both a chatbot and a deepfake generator, triggering multiple Art. 50 obligations). | HIGH |
| 15 | Risk wizard Step 6 | Help text ("required for deployers of high-risk systems in public services...") gives correct info, but the user is still forced to answer. UI text vs. UX flow are inconsistent. | LOW |
| 16 | Risk result | No "Why?" reasoning summary near the risk-level badge. Currently the rule-based explanation is a small note at the very bottom. Promote it to a card right under the badge. | MEDIUM |
| 17 | Risk result | No CTA pointing to the next ORIENT step ("Continue to Identify →"). User has to navigate manually. | MEDIUM |
| 18 | Risk result | "Save Classification" / "Reclassify" buttons are styled as plain text, not primary CTAs. | MEDIUM |
| 19 | Risk result | Penalty information is shown before the obligations list. UX inversion — show *what to do* first, *consequences of non-compliance* second. | MEDIUM |
| 20 | Risk wizard header | (Duplicate of #9 — confirmed across multiple steps.) | LOW |

---

## 📋 Triage Suggestion

1. **Block 1 — Engine fixes (next commit)**: Bug A, B, C, D. Production blockers. Estimated 1–2 days with regulatory cross-checks via web search (hexis-qa-protocol Faz 2).
2. **Block 2 — Regulatory accuracy (next commit + 1)**: Items 7, 11, 12, 14. Multi-select refactor + Annex III sub-bullets + FRIA conditional logic.
3. **Block 3 — UX polish (Sprint 2 closeout)**: Items 1–20 in a single dedicated UX-fix branch. Run `design:accessibility-review` skill on the registration form, risk wizard, and result page.

---

*This backlog was assembled from a single end-to-end QA pass. Re-test after engine fixes — additional regressions may surface once obligations actually persist.*
