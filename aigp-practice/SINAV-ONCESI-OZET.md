# AIGP Sınav Öncesi Gece Özeti
**IAPP AIGP — 25 Mart 2026**
*Tüm 4 Domain | Key English Terms & Exam Phrases*

---

> **Sınav formatı hatırlatıcı:** 100 soru, 3 saat, 4 şık — bazıları MULTI-SELECT (5 şıktan 3 seç, partial credit yok). FIRST / BEST / MOST / PRIMARY qualifier'larına dikkat.

---

## DOMAIN I — Foundations of AI Governance (16–20 soru)

### I.A — What is AI & Why Governance?

**Unique AI Characteristics** — bunları ezberle, senaryo sorularında "neden AI farklıdır?" sorusunun cevabı buradan gelir:

| Terim | Türkçe | Sınav Cümlesi |
|-------|--------|---------------|
| **Complexity** | Karmaşıklık | "contains millions of parameters that interact in non-linear ways" |
| **Opacity** | İçsel görünmezlik | "even developers cannot fully trace how a specific output was generated" — bu bir MİMARİ özellik |
| **Low explainability** | Açıklanamama | "cannot provide a meaningful account of why a specific decision was made to an affected individual" — bu bir SONUÇ |
| **Autonomy** | Özerklik | "operates without continuous human direction once deployed" |
| **Speed & Scale** | Hız ve ölçek | "affects millions of decisions before a bias pattern is detected" — bu, bias zararını insan sürecine kıyasla ÇARPAN etken |
| **Data dependency** | Veri bağımlılığı | "encoded biases in training data are replicated across all outputs at scale" |
| **Probabilistic outputs** | Olasılıksal çıktılar | "represents a statistical likelihood, not a deterministic conclusion" — governance must define acceptable error rates |

> **⚠️ Close-pair tuzağı:** Opacity vs Explainability. Opacity = model içini göremezsin (mimari). Explainability = etkilenen kişiye açıklayamazsın (sonuç). Ikisi farklı!

**Responsible AI Principles** — hangisinin ihlal edildiği sorusu çok çıkar:

| Principle | Sınav Bağlamı |
|-----------|--------------|
| **Fairness** | Bias in hiring, credit, housing — historical patterns replicated |
| **Transparency** | "informed that they are interacting with an AI system" |
| **Explainability** | Data subject's right to an explanation of automated decisions |
| **Accountability** | Who is responsible when AI causes harm? Audit trail. |
| **Human-centricity** | AI serves human needs; humans remain in control |
| **Safety & Reliability** | System does what it is designed to do, consistently |
| **Privacy** | Data minimization, purpose limitation |
| **Security** | Protection against adversarial attacks, misuse |

### I.B — Organizational Roles & Governance

**Key Roles:**
- **AI governance team** — cross-functional (legal, compliance, engineering, ethics, business)
- **Data steward** — data quality, lineage, access controls
- **Model owner** — business accountability for model outputs
- **AI ethics review board** — independent review, escalation path

**Governance maturity ≠ company size.** A small fintech with high-risk AI needs mature governance faster than a large retailer with low-risk use cases.

### I.C — Policies Across the AI Lifecycle

**Best practice:** Evaluate existing policies FIRST (data privacy, security, IP, acceptable use, vendor management) → identify gaps → create AI-specific **supplements or amendments**, not a standalone replacement.

**Key policy touchpoints:**
- **Use case assessment** — before any AI project starts
- **Ethics by design** — during design phase
- **Data acquisition policy** — lawful rights, quality requirements
- **Acceptable use policy** — what AI systems employees may/may not use
- **Incident management policy** — triggers, escalation, documentation
- **Third-party / vendor AI policy** — procurement, supply chain risk

**Exam phrase:** *"evaluate existing policies and create targeted AI-specific supplements where gaps exist"*

---

## DOMAIN II — Laws, Standards & Frameworks (19–23 soru)

### II.A — Data Privacy Laws (GDPR Focus)

**GDPR Lawful Basis for AI Processing:**

| Basis | When it works | When it doesn't |
|-------|--------------|-----------------|
| **Consent (Art. 6(1)(a))** | Clear affirmative action, freely given, withdrawable | Pre-ticked boxes, bundled consent |
| **Legitimate interest (Art. 6(1)(f))** | Controller's interest outweighs data subject's rights — LIA required | Cannot use for **special category data** (Art. 9) — needs Art. 9(2) |
| **Legal obligation** | GDPR compliance, law enforcement | |
| **Vital interests** | Emergency situations only | |

> **⚠️ Critical:** Health data, genetic data, biometric data = **special category data (Art. 9)**. Legitimate interest is NOT a valid basis for processing Art. 9 data. You need one of the Art. 9(2) derogations (e.g., explicit consent, substantial public interest).

**Automated Decision Making (ADM) — Art. 22 GDPR:**
- Right to **not be subject to solely automated decisions** that produce **legal or similarly significant effects**
- Right to **meaningful information about the logic involved**
- Right to **human intervention**, to express your point of view, to contest the decision
- **Trade secret ≠ complete exemption** from explanation — must still provide meaningful information; form/detail may vary

**Key exam phrases:**
- *"meaningful information about the logic involved, the significance, and the envisaged consequences"*
- *"the data subject shall have the right to obtain human intervention"*
- *"the trade secret defense does not eliminate the obligation"*

**Privacy by Design (PbD) principles:**
- Proactive, not reactive
- Privacy as default
- Full functionality (positive-sum, not zero-sum)
- End-to-end lifecycle protection
- Visibility and transparency

**Data Minimization** — collect only what is **adequate, relevant, and limited to what is necessary**

**Purpose Limitation** — data collected for one purpose cannot be repurposed for an incompatible AI training use without a new lawful basis or compatibility assessment.

**DPIA (Data Protection Impact Assessment):**
- Mandatory when processing is likely to result in **high risk** to individuals
- Especially for: systematic profiling, large-scale special category data, systematic monitoring of public areas
- Must include: nature/purpose of processing, necessity assessment, risks, measures to mitigate

### II.B — Other Laws (IP, Non-Discrimination, Consumer Protection, Product Liability)

**Intellectual Property:**
- **Fair use / fair dealing** for AI training data = **unsettled law** in most jurisdictions — transformation argument not definitively accepted
- **Text and data mining (TDM) exceptions**: EU Copyright Directive allows TDM with conditions — **opt-out mechanism** available to rights holders for commercial use
- Rights holders are **actively litigating** — material litigation risk regardless of internal legal assessment
- **Model outputs** can also infringe copyright if they reproduce substantial portions of training works

**Key exam phrases:**
- *"the fair use defense is unsettled law with ongoing litigation producing conflicting results"*
- *"jurisdiction-by-jurisdiction analysis is required"*
- *"opt-out mechanisms for rights holders"*

**Non-Discrimination:**
- Protected classes vary by jurisdiction: race, sex, age, disability, national origin, religion
- AI can perpetuate **disparate impact** (neutral policy with discriminatory effect) even without discriminatory intent
- Employment, credit, lending, housing, insurance = high-scrutiny domains

**Product Liability:**
- **Design defect** — AI system's architecture creates unreasonable risk
- **Manufacturing defect** — AI system deviates from its intended design
- Providers increasingly liable under product liability frameworks as AI becomes a "product"

### II.C — EU AI Act (★★★ Most Tested Area)

**Risk Classification — The 4 Categories:**

| Category | Articles | Key Trigger | Obligations |
|----------|----------|-------------|-------------|
| **Prohibited** | Art. 5 | Unacceptable risk | BAN — no deployment |
| **High-risk** | Art. 6 + Annex I/III | Product safety component OR Annex III domain | Full compliance regime |
| **Limited risk** | Art. 50 | Transparency obligations triggered | Disclose AI identity |
| **GPAI** | Art. 51–56 | Model with general capabilities | Tiered obligations |
| **Minimal risk** | — | None of the above | Voluntary codes |

**Art. 6 High-Risk Triggers — two independent paths:**
1. **Art. 6(1)** — AI system that is a **safety component of a product** covered by Annex I product safety legislation (Machinery, Medical Devices, Vehicles, etc.) AND the product requires third-party conformity assessment → HIGH RISK even if the AI system itself is not separately placed on the market
2. **Art. 6(2)** — AI system listed in **Annex III** (8 domains) → HIGH RISK unless Art. 6(3) exception applies

> **⚠️ Art. 6(1) close-pair tuzağı:** "Only applies to standalone AI products placed on market" → WRONG. It applies when AI is a **safety component of machinery/product** — the AI itself doesn't need to be the marketed product.

**Annex III — 8 High-Risk Domains:**
1. Biometrics (remote identification)
2. Critical infrastructure (water, gas, electricity, traffic)
3. Education & vocational training
4. Employment & workers management
5. Access to essential private/public services (credit scoring!)
6. Law enforcement
7. Migration, asylum, border control
8. Administration of justice & democratic processes

**Art. 6(3) Exception — Annex III system can be NOT high-risk if:**
- No significant risk of harm to health, safety, or fundamental rights
- Does not profile individuals
- Purely preparatory task for a human decision
- Intended to detect decision-making patterns without individual assessment

**Key High-Risk Obligations (Art. 9–17):**
- **Risk management system** (Art. 9) — ongoing, not one-time
- **Data governance** (Art. 10) — training/validation/testing data quality
- **Technical documentation** (Art. 11 + Annex IV)
- **Logging** (Art. 12) — automatic event logs
- **Transparency to deployers** (Art. 13) — instructions for use
- **Human oversight** (Art. 14) — meaningful control, ability to override
- **Accuracy, robustness, cybersecurity** (Art. 15)
- **Conformity assessment** (Art. 43) — self-assessment or third-party
- **EU database registration** (Art. 49) — before placing on market

**Art. 50 — Transparency Obligations (Limited Risk):**
- Chatbots must disclose they are AI — *"unless obvious from context"*
- Deepfakes must be labeled as AI-generated
- Emotion recognition / biometric categorization systems must inform individuals
- Retail chatbots outside Annex III = **limited risk**, NOT minimal risk — Art. 50 applies, NOT conformity assessment

**GPAI — Art. 51–56:**
- ALL GPAI providers must: maintain technical documentation, provide info to downstream providers, have copyright compliance policy, publish training data summary
- **Systemic risk** threshold: ≥ 10^25 FLOPs training compute
- Additional obligations for systemic risk: adversarial testing (red-teaming), incident reporting to Commission, cybersecurity protection

**Penalties:**
- Prohibited violations: **€35M or 7%** global turnover (whichever higher)
- High-risk violations: **€15M or 3%**
- Incorrect info: **€7.5M or 1%**
- SMEs/startups: same amounts but whichever **lower** (Art. 99(6))

**Enforcement Timeline:**
- **2 Feb 2025** — Prohibited practices (Art. 5) + AI literacy (Art. 4) → **IN FORCE**
- **2 Aug 2025** — GPAI (Chapter V) → **IN FORCE**
- **2 Aug 2026** — High-risk Annex III → Upcoming
- **2 Aug 2027** — High-risk Annex I → Upcoming

**Organizational Roles:**
- **Provider** — places AI system on market, highest obligations
- **Deployer** — uses AI in professional context, Art. 26 obligations
- **Importer** — EU entity placing non-EU provider's system on market
- **Distributor** — supply chain, due diligence obligations

### II.D — Standards (OECD, NIST AI RMF, ISO)

**NIST AI RMF 1.0 — 4 Core Functions (GOV MAP MEA MAN):**
1. **GOVERN** — culture, policies, accountability
2. **MAP** — context, risk identification
3. **MEASURE** — risk analysis and assessment
4. **MANAGE** — risk treatment, monitoring

> **Tuzak:** "Identify, Protect, Detect, Respond" = NIST Cybersecurity Framework, NOT AI RMF. "Plan, Do, Check, Act" = ISO management system generic cycle. "Assess, Mitigate, Monitor, Report" = made up.

**NIST AI RMF — also remember:**
- **Playbook** = specific suggested actions within each function
- AI RMF is **voluntary** — not legally binding
- Supports **trustworthy AI**: accuracy, explainability, interpretability, privacy, reliability, robustness, safety, security, fairness with harmful bias managed

**ISO Standards:**
- **ISO/IEC 22989** — AI concepts and terminology
- **ISO/IEC 42001** — AI management system (AIMS) — the "ISO 9001 for AI"
- **ISO/IEC 42005** — AI impact assessment for organizations

**ISO 42001 key concepts:**
- Context of the organization → AI policy → AI objectives → Risk & opportunity assessment → AIMS controls → Performance evaluation → Improvement
- **Annex A controls** — organizational controls, people controls, technical controls
- Applies to: providers, operators (deployers), third parties

**OECD AI Principles (2019, updated 2024):**
1. Inclusive growth, sustainable development, well-being
2. Human-centred values and fairness
3. Transparency and explainability
4. Robustness, security, safety
5. Accountability

---

## DOMAIN III — Governing AI Development (21–25 soru)

### III.A — Design & Build Governance

**Use case assessment BEFORE development — always the FIRST step.**

**Impact assessment at design phase:**
- Who is affected? How? What severity?
- **Probability × Severity = Risk** matrix
- Document potential harms: physical, psychological, financial, reputational, societal

**Architecture & model selection criteria:**
- Fitness for purpose
- Interpretability requirements (high-risk use case = interpretable model preferred)
- Data requirements
- Human oversight integration
- Performance metrics and acceptance thresholds

**Risk mitigation hierarchy:**
1. Eliminate the risk (redesign/don't build)
2. Reduce through design
3. Add safeguards/controls
4. Document residual risk + monitor

**Key exam phrase:** *"conduct a data impact assessment to identify and document potential sources of bias BEFORE model training begins"*

### III.B — Data Collection, Training & Testing

**Data governance for AI — quality dimensions:**
- **Accuracy** — correct representation of real-world entities
- **Completeness** — no material gaps
- **Representativeness** — covers all affected subgroups
- **Timeliness** — current and relevant
- **Consistency** — no contradictions across sources

**Data lineage / provenance documentation:**
- Where did the data come from?
- How was it collected, transformed, labelled?
- What rights/licenses apply?
- Has it been used before and for what?

> **⚠️ Tuzak:** When fine-tuning a third-party pre-trained model and the vendor's training data composition is undocumented → **data provenance / lineage risk**, NOT model drift risk.

**Testing types before release:**
- **Unit testing** — individual components
- **Integration testing** — components working together
- **Validation testing** — does it solve the intended problem?
- **Performance testing** — accuracy, precision, recall, F1 against defined thresholds
- **Bias testing** — disaggregated performance across demographic subgroups
- **Security testing** — adversarial inputs, prompt injection
- **Interpretability testing** — can outputs be explained?

**Training data issues to flag:**
- Historical bias in labeled data
- Underrepresentation of minority groups
- Data collected without proper consent/rights
- Label noise / inconsistent annotation

### III.C — Release, Monitoring & Maintenance

**Release readiness checklist:**
- **Model card** — standardized documentation of model capabilities, limitations, intended use, out-of-scope use, performance metrics, ethical considerations
- **Conformity requirements** satisfied (for regulated systems)
- Logging/monitoring infrastructure in place
- Human oversight mechanisms operational
- Incident response plan documented
- Instructions for deployers prepared

**Continuous monitoring — what to watch:**
- **Model drift** (concept drift) — real-world data distribution changes, model performance degrades
- **Data drift** — input data distribution changes
- **Performance degradation** — accuracy/fairness metrics fall below threshold
- **Adversarial inputs** — attempts to manipulate the model
- **Unintended use** — system used outside intended scope

**Preventive vs. Detective controls:**
- **Preventive** — stops problems BEFORE they reach production (e.g., staged validation testing before deployment)
- **Detective** — identifies problems AFTER they occur (e.g., alerts when output distribution deviates from baseline)

> **⚠️ Close-pair tuzağı:** "Automated alerts fire when deviation occurs" = DETECTIVE (fires after). "Validation testing in non-production before deployment" = PREVENTIVE (stops before).

**Incident management:**
- Define what constitutes an AI incident
- Immediate response: contain, assess impact, notify stakeholders
- Root cause analysis: data issue? Model issue? Deployment issue? Human oversight failure?
- Documentation: what happened, when, impact, response actions
- Post-incident review and corrective actions
- Cross-functional involvement: legal, compliance, engineering, communications

**Public disclosures / transparency:**
- Technical documentation (providers)
- Instructions for deployers
- Post-market monitoring plans
- Incident reports (if regulatory obligation)

---

## DOMAIN IV — Governing AI Deployment & Use (21–25 soru)

### IV.A — Deployment Decisions

**Deployment architecture options:**

| Type | Key Governance Consideration |
|------|------------------------------|
| **Cloud** | Data residency, sovereignty, third-party risk, vendor lock-in |
| **On-premise** | Higher control, data stays in-house, still requires governance (doesn't eliminate third-party risk from model vendor) |
| **Edge** | Distributed, harder to monitor/update, latency advantages |

> **⚠️ Tuzak:** "On-premise eliminates third-party risk management" → WRONG. The model vendor still has obligations; you still need vendor risk management for the model itself.

> **Data residency/sovereignty** = MOST compelling reason to choose on-premise for sensitive health/government data.

**Model type selection:**

| Comparison | Definition | Governance Implication |
|-----------|-----------|----------------------|
| **Fine-tuning** | Updates model weights through additional training on domain-specific data | Higher control, IP questions on training data, retraining schedule needed |
| **RAG** | Retrieves external documents at **inference time** without changing model weights | Knowledge stays current, no retraining, but retrieval quality and source reliability matter |
| **Classic ML** | Rule-based or statistical (regression, decision trees, SVM) | More interpretable, deterministic, easier to audit |
| **Generative AI** | Neural networks producing novel content | Less deterministic, harder to audit, requires different governance |
| **Proprietary** | Closed source, vendor controls | Limited visibility into architecture/training data, liability concentration |
| **Open source** | Weights and often training methodology available | Deeper compliance verification possible, more organizational responsibility |

> **⚠️ Close-pair tuzağı:** RAG vs fine-tuning definition swap is a classic. RAG = **inference-time retrieval** (no weight change). Fine-tuning = **training-time weight update** (no external documents at inference).

### IV.B — Impact Assessment & Vendor Risk

**Before deploying a third-party AI model, assess:**
- Does the vendor provide documentation of training data, architecture, known limitations?
- What are the licensing agreement terms? Liability clauses? Data usage rights?
- What are the vendor's incident response and transparency obligations?
- What is the vendor's update/change management process?

**Proprietary model risk — the key concern:**
- Vendor can push model updates that **alter behavior without the deploying organization's knowledge or consent**
- This means outputs affecting individuals can change unpredictably → governance gap
- The deploying organization may bear **sole legal and regulatory responsibility** for all outputs (liability concentration)
- Limited ability to inspect training data → limited compliance verification

**Vendor risk management checklist:**
- Due diligence questionnaire
- Contractual provisions: SLAs, audit rights, breach notification, exit clauses
- Ongoing monitoring of vendor's compliance posture
- Contingency planning: what if the vendor discontinues the model?

**FRIA (Fundamental Rights Impact Assessment):**
- Required for high-risk AI systems per EU AI Act (Art. 27 — deployers)
- Assess: which fundamental rights are affected? Probability? Magnitude?
- Document: mitigation measures, residual risk

### IV.C — Deployment Governance, Monitoring & Deactivation

**Deployment governance policies:**
- Data governance: what data can the deployed system access? How long? Who approves?
- User training: staff must understand system capabilities AND limitations
- Acceptable use: what inputs are prohibited? What outputs require human review?
- Escalation paths: when does an AI output trigger mandatory human review?

**Secondary / unintended use:**
- AI system used outside its intended scope
- Governance must **forecast potential secondary uses** and define explicit policies
- "Function creep" — gradually expanding use without re-assessment

**Deactivation policy — must be defined BEFORE deployment:**
- What triggers deactivation? (performance threshold, regulatory change, harm event)
- Who has authority to deactivate?
- What is the fallback process?
- How is data handled post-deactivation?

**External communication plan:**
- Who gets notified if the AI system causes harm?
- What are the public disclosure obligations?
- How do you communicate with affected individuals?

---

## SINAVDA KULLANILACAK STRATEJİLER

### Qualifier'lar — senaryo sorularında hayat kurtarır:

| Qualifier | Ne Arar |
|-----------|---------|
| **FIRST** | En acil/temel/sıralı ilk adım — genellikle assessment/documentation |
| **BEST / MOST APPROPRIATE** | En kapsamlı, cross-functional çözüm |
| **PRIMARY** | Ana sebep veya ana risk — yan etkiler değil |
| **MOST DIRECTLY** | Doğrudan neden-sonuç ilişkisi — dolaylı değil |
| **LEAST** | Yanlış olan veya en az uygun seçenek |

### "FIRST step" kuralı:
Neredeyse her zaman: **assess → document → communicate → act**. Hemen retraining yapmak, hemen rapor vermek, hemen suspend etmek genellikle YANLIŞ ilk adımdır — önce **investigate/assess**.

Tek istisna: eğer senaryo açıkça devam eden zarar varsa (harm is ongoing, at-scale, immediate) → önce **contain/suspend**, sonra assess.

### Close-pair tuzaklarına karşı:
Şık seçeneklerini karşılaştırırken şunu sor: "Bu iki şıkta **özne-nesne yer değişmiş mi? Kavramlar yer değiştirmiş mi? Bir 'before', bir 'after' mi diyor? Biri 'must', biri 'should' mu?"

### Multi-select stratejisi:
- Her şıkkı bağımsız olarak değerlendir
- "Kesinlikle doğru" = evet, "Kesinlikle yanlış" = hayır, "Emin değilim" = şüpheli
- Kesinlikle yanlış olanları ele → kalan 3'ten 2'si doğruysa 3. de muhtemelen doğrudur
- Partial credit yok — hepsini doğru seçmelisin

---

## SINAVDAN ÖNCE SON KONTROL LİSTESİ

- [ ] NIST AI RMF 4 functions: **GOVERN → MAP → MEASURE → MANAGE**
- [ ] EU AI Act enforcement dates: Art. 5 + Art. 4 = Feb 2025 ✅ | GPAI = Aug 2025 ✅ | Annex III = Aug 2026 | Annex I = Aug 2027
- [ ] Art. 9 GDPR special categories: legitimate interest is NOT valid — need Art. 9(2)
- [ ] RAG = inference-time retrieval, no weight change; Fine-tuning = weight update at training time
- [ ] Opacity (structural, architectural) ≠ Low explainability (consequential, individual)
- [ ] Preventive control = stops before; Detective control = finds after
- [ ] On-premise does NOT eliminate third-party/vendor risk management
- [ ] Art. 50 retail chatbot = limited risk (transparency only, no conformity assessment, no EU database)
- [ ] Art. 6(1) applies even when AI is NOT separately placed on market — if it's a safety component of Annex I product
- [ ] GPAI systemic risk threshold = 10^25 FLOPs
- [ ] SME penalty rule: same amounts but whichever is **lower** (not higher)

---

*İyi şanslar yarın Özden — hazırsın. 🎯*
*AIGP Practice | hexis.center*
