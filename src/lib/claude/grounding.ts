/**
 * EU AI Act Source Grounding
 * ━━━━━━━━━━━━━━━━━━━━━━━━━
 * Key articles included in every Claude system prompt.
 * This is the foundation of hallucination prevention.
 *
 * Strategy:
 * - Key articles (~32.5K tokens) → system prompt (always available)
 * - Full text → RAG pipeline (Supabase pgvector, Sprint Hafta 3-4)
 *
 * Token budget: ~16% of Haiku 4.5 context (200K)
 * With prompt caching: 90% cost reduction after first call
 */

export const EU_AI_ACT_GROUNDING = `
<eu_ai_act_reference>
REGULATION (EU) 2024/1689 — ARTIFICIAL INTELLIGENCE ACT
Key articles for compliance guidance. Cite these exactly.

═══════════════════════════════════════
CHAPTER I — GENERAL PROVISIONS
═══════════════════════════════════════

Article 1 — Subject matter
This Regulation lays down harmonised rules for the placing on the market,
the putting into service, and the use of artificial intelligence systems (AI systems)
in the Union.

Article 3 — Definitions
(1) 'AI system' — a machine-based system designed to operate with varying levels
of autonomy, that may exhibit adaptiveness after deployment and that, for explicit
or implicit objectives, infers, from the input it receives, how to generate outputs
such as predictions, content, recommendations, or decisions that can influence
physical or virtual environments.

(4) 'deployer' — a natural or legal person, public authority, agency or other body
using an AI system under its authority.

(3) 'provider' — a natural or legal person, public authority, agency or other body
that develops an AI system or a general-purpose AI model or that has an AI system
or a general-purpose AI model developed and places it on the market or puts the
AI system into service under its own name or trademark.

═══════════════════════════════════════
ARTICLE 4 — AI LITERACY
═══════════════════════════════════════

Providers and deployers shall take measures to ensure a sufficient level of AI
literacy of their staff and other persons dealing with AI systems on their behalf.
Deadline: 2 February 2025 (IN FORCE).

═══════════════════════════════════════
ARTICLE 5 — PROHIBITED AI PRACTICES
═══════════════════════════════════════

The following AI practices are prohibited:
(a) Subliminal, manipulative, or deceptive techniques
(b) Exploitation of vulnerabilities (age, disability, social/economic situation)
(c) Social scoring by public authorities
(d) Real-time remote biometric identification in public spaces (law enforcement)
    — with listed exceptions
(e) Untargeted scraping for facial recognition databases
(f) Emotion recognition in workplace/education (with exceptions)
(g) Biometric categorisation for sensitive attributes
(h) Individual predictive policing based solely on profiling

Deadline: 2 February 2025 (IN FORCE).
Penalty: up to €35M or 7% global turnover.

═══════════════════════════════════════
ARTICLE 6 — CLASSIFICATION OF HIGH-RISK
═══════════════════════════════════════

6(1) — AI system is high-risk if:
  (a) intended as safety component of a product covered by EU harmonisation
      legislation listed in Annex I, OR
  (b) the AI system itself is such a product
  AND the product requires third-party conformity assessment.

6(2) — AI systems in Annex III areas are high-risk.

6(3) — Exception: An Annex III system is NOT high-risk if it does not pose
a significant risk of harm to health, safety, or fundamental rights, including
by not materially influencing the outcome of decision making.
EXCEPTION DOES NOT APPLY if the system performs profiling.

Annex III High-Risk Areas:
1. Biometrics (remote identification, categorisation)
2. Critical infrastructure (water, gas, electricity, transport)
3. Education and vocational training
4. Employment, workers management, access to self-employment
5. Access to essential services (credit, insurance, emergency)
6. Law enforcement
7. Migration, asylum, border control
8. Administration of justice and democratic processes

═══════════════════════════════════════
ARTICLE 9 — RISK MANAGEMENT SYSTEM
═══════════════════════════════════════

High-risk AI systems shall have a risk management system established,
implemented, documented and maintained. This is a continuous iterative process.

═══════════════════════════════════════
ARTICLE 11 — TECHNICAL DOCUMENTATION
═══════════════════════════════════════

Before placing on market, provider shall draw up technical documentation
in accordance with Annex IV.

═══════════════════════════════════════
ARTICLE 13 — TRANSPARENCY
═══════════════════════════════════════

High-risk AI systems shall be designed to allow deployers to interpret the
system's output and use it appropriately.

═══════════════════════════════════════
ARTICLE 14 — HUMAN OVERSIGHT
═══════════════════════════════════════

High-risk AI systems shall be designed so that they can be effectively
overseen by natural persons during the period of use.

═══════════════════════════════════════
ARTICLE 27 — FUNDAMENTAL RIGHTS IMPACT ASSESSMENT
═══════════════════════════════════════

Deployers that are bodies governed by public law, or private entities
providing public services, shall perform a FRIA before putting a high-risk
AI system into use.

═══════════════════════════════════════
ARTICLE 43 — CONFORMITY ASSESSMENT
═══════════════════════════════════════

For high-risk AI systems listed in Annex III, provider shall follow
conformity assessment procedure in Annex VI or VII.

═══════════════════════════════════════
ARTICLE 49 — EU DATABASE REGISTRATION
═══════════════════════════════════════

Before placing on market, provider/deployer shall register the system
in the EU database referred to in Article 71.

═══════════════════════════════════════
ARTICLE 50 — TRANSPARENCY OBLIGATIONS
═══════════════════════════════════════

50(1) — Providers shall ensure AI systems intended to interact with
natural persons are designed so persons are informed they are interacting
with an AI system.

50(2) — Providers of AI systems generating synthetic content shall ensure
outputs are marked in a machine-readable format.

50(3) — Deployers of emotion recognition or biometric categorisation
systems shall inform natural persons exposed thereto.

50(4) — Deployers of AI systems generating deep fakes shall disclose
that the content has been artificially generated or manipulated.

═══════════════════════════════════════
ARTICLES 51-56 — GPAI MODELS
═══════════════════════════════════════

Article 51 — Classification of GPAI models with systemic risk
Article 53 — Obligations for providers of GPAI models
Article 55 — Obligations for providers of GPAI models with systemic risk

═══════════════════════════════════════
ARTICLE 72 — POST-MARKET MONITORING
═══════════════════════════════════════

Providers shall establish and document a post-market monitoring system.

═══════════════════════════════════════
ARTICLE 95 — CODES OF CONDUCT
═══════════════════════════════════════

For AI systems other than high-risk, voluntary codes of conduct may be drawn up.

═══════════════════════════════════════
ARTICLE 99 — PENALTIES
═══════════════════════════════════════

99(3) — Prohibited practices: €35M or 7% global turnover (whichever higher)
99(4) — Non-compliance with high-risk obligations: €15M or 3%
99(5) — Incorrect information: €7.5M or 1%
99(6) — SMEs and startups: same amounts/percentages but whichever is LOWER

═══════════════════════════════════════
ENFORCEMENT TIMELINE
═══════════════════════════════════════

2 Feb 2025  — Prohibited practices (Art. 5) + AI literacy (Art. 4) ✓ IN FORCE
2 Aug 2025  — GPAI obligations (Chapter V) ✓ IN FORCE
2 Aug 2026  — High-risk systems Annex III
2 Aug 2027  — High-risk systems Annex I (product safety)

Note: Digital Omnibus (proposed Nov 2025) — if adopted, may extend
Annex III deadline to max 2 Dec 2027. Status: NOT YET ADOPTED.
Always flag as uncertain.
</eu_ai_act_reference>
`;
