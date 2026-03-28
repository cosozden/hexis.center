# AIGP Daily Practice — 25 March 2026 (Wednesday)
## Domain III (AI Development Governance) Focus + Domain II

> **Önceki sonuçlar:** 8/10, 9/10 | Zayıf alanlar: IV.B, I.A (unique AI characteristics)
> **Bugünün odağı:** Domain III (7 soru) + Domain II (3 soru)
> **Domain III dağılımı:** III.A (2), III.B (2), III.C (3)
> **Domain II dağılımı:** II.A (1), II.C (1), II.D (1)

---

**Q1.** [Domain III.A | Bloom: Understand]

During the design phase of an AI system intended for use in employee performance evaluation, the development team must identify and assess risks before building the model. According to AI governance best practices, which of the following BEST describes the role of a probability/severity harms matrix in this context?

A) It ranks potential harms solely by their likelihood of occurrence, allowing the team to ignore low-probability risks regardless of their potential impact on individuals

B) It maps identified harms to specific regulatory articles, serving primarily as a compliance checklist that confirms which legal requirements apply to the use case

C) It provides a visual tool to compare different AI vendors' risk profiles, enabling procurement teams to select the lowest-risk commercial solution

D) It plots identified harms across two dimensions — probability of occurrence and severity of impact — enabling the team to prioritize risk mitigation efforts by focusing first on high-probability, high-severity scenarios while documenting accepted residual risks for lower-priority combinations

---

**Q2.** [Domain III.B | Bloom: Apply]

A healthcare AI development team is building a diagnostic support model. During data collection, they discover that 78% of their training data comes from patients at urban teaching hospitals, while only 22% represents rural and community clinic populations. The model will be deployed across both settings.

Which data governance requirement is MOST directly at risk?

A) Data fitness-for-purpose — because the training data distribution does not adequately represent the deployment population, creating a foreseeable performance disparity that could lead to systematic underperformance for underrepresented patient groups

B) Data lineage documentation — because the team has not recorded where each data sample originated, making it impossible to trace errors back to specific source institutions

C) Lawful rights to data — because using hospital patient data for AI training likely exceeds the original consent scope and violates data subject rights under applicable privacy regulations

D) Data integrity — because the imbalanced dataset indicates that some records may have been corrupted or duplicated during the collection process, compromising the accuracy of model outputs

---

**Q3.** [Domain III.C | Bloom: Analyze] ⚠️ CLOSE-PAIR

An AI system used for credit scoring has been in production for 14 months. The monitoring team notices that the model's approval rate for a specific demographic group has shifted from 62% at deployment to 47% currently, while overall accuracy metrics remain stable. No model updates have been deployed.

What does this scenario MOST likely indicate, and what is the appropriate governance response?

A) A model architecture defect that was present at deployment but only became apparent over time — the appropriate response is to retrain the model from scratch using a corrected architecture and updated training data

B) Insufficient pre-deployment testing — the appropriate response is to conduct a retroactive bias audit of the original testing protocol and update the test suite to include demographic subgroup analysis before redeploying

C) Data drift in the incoming production data — the demographic composition or feature distributions of real-world applicants have shifted since deployment, causing differential impact on subgroups even without model changes, and the appropriate response is to investigate the root cause, assess whether retraining or recalibration is needed, and document the incident

D) Model drift caused by continuous online learning — the model has been automatically updating its parameters based on new decisions, gradually shifting its decision boundary for certain groups, and the appropriate response is to disable the online learning feature and revert to the last stable checkpoint

---

**Q4.** [Domain III.A | Bloom: Apply]

A financial services firm is designing an AI-powered fraud detection system. During the requirements gathering phase, the project team must determine the appropriate level of human oversight for the system's decisions.

Which factor should MOST heavily influence the human oversight design?

A) The computational cost of running the model in real-time, since higher latency systems naturally allow more time for human review of each decision

B) The consequence severity of the system's decisions — specifically, whether automated fraud flags result in immediate account freezes affecting customer access to funds, which would require higher levels of human review before action is taken compared to systems that only generate alerts for later investigation

C) The number of transactions processed per day, since human oversight is only practical when transaction volumes are below 10,000 per day

D) Whether the development team has prior experience building fraud detection systems, as experienced teams can build more reliable models that require less human oversight

---

**Q5.** [Domain II.C | Bloom: Apply]

A European company deploys a high-risk AI system classified under Annex III of the EU AI Act. Article 9 requires the establishment of a risk management system. Which of the following is a REQUIRED characteristic of this risk management system?

A) It must be a continuous iterative process that is planned, implemented, documented, and maintained throughout the entire lifecycle of the high-risk AI system, with regular systematic updates when necessary

B) It must be completed as a one-time assessment performed before the system is placed on the market, with the results submitted to the relevant national competent authority for pre-market approval

C) It must be conducted exclusively by an independent third-party auditor certified under a harmonized standard, as internal risk management assessments are not considered sufficient for Annex III systems

D) It must follow the exact template published by the AI Office, and any deviation from the prescribed format automatically invalidates the conformity assessment

---

**Q6.** [Domain III.B | Bloom: Analyze] 🎯 Case Study

DataVault Inc. is developing a sentiment analysis model for a client in the insurance industry. The model will analyze customer service call transcripts to predict policyholder churn risk. During the data preparation phase, the team discovers the following:

- Training data includes 50,000 transcripts from the past 3 years
- 12% of transcripts contain mentions of medical conditions disclosed during claims calls
- The client's data processing agreement covers "service quality improvement" but does not mention AI model training
- Some transcripts include the customer service agent reading back the caller's policy number and date of birth for verification

Which combination of data governance issues requires IMMEDIATE remediation before training can proceed?

A) Only the medical condition mentions need remediation — these constitute special category data, but the other issues are routine and can be addressed during post-deployment monitoring

B) Only the policy numbers and dates of birth need to be redacted — the data processing agreement covers AI training under the "service quality improvement" purpose, and medical conditions mentioned voluntarily by callers are not subject to special protections

C) The transcripts must be anonymized to remove all personal identifiers, but the data processing agreement is sufficient as-is because AI model training falls within the reasonable scope of "service quality improvement"

D) Both the data processing agreement gap and the presence of special category health data require remediation — the agreement must be updated to explicitly cover AI training as a processing purpose with appropriate legal basis, and medical condition references must be assessed for necessity and either removed or justified with explicit consent or another valid legal basis; additionally, direct identifiers such as policy numbers and dates of birth should be pseudonymized or removed

---

**Q7.** [Domain III.C | Bloom: Apply] ⚠️ MULTI-SELECT: Select 3 of the 5 options below. No partial credit.

An organization has completed development of a high-risk AI system and is preparing for release. According to AI governance best practices and the EU AI Act requirements for high-risk systems, which THREE elements must be in place as part of release readiness?

A) Public disclosure of the complete model architecture, including all hyperparameters, training algorithms, and loss functions used during development

B) A model card or equivalent documentation that describes the system's intended purpose, known limitations, performance metrics, and conditions under which the system should not be used

C) A conformity assessment demonstrating compliance with the applicable requirements, including risk management, data governance, technical documentation, and transparency obligations

D) A post-market monitoring plan that defines the methods and frequency for collecting and analyzing data on the system's performance throughout its operational lifecycle

E) A binding commitment from the deploying organization to achieve a minimum 99.5% accuracy threshold before the system is placed on the market

---

**Q8.** [Domain II.D | Bloom: Remember] ⚠️ CLOSE-PAIR

The NIST AI Risk Management Framework (AI RMF 1.0) defines four core functions. Which of the following CORRECTLY lists all four core functions?

A) Identify, Protect, Detect, Respond

B) Map, Measure, Manage, Monitor

C) Govern, Map, Measure, Manage

D) Govern, Identify, Protect, Manage

---

**Q9.** [Domain III.C | Bloom: Analyze] 🎯 Case Study

MediAssist Corp deploys an AI-powered patient triage system in 15 hospitals. Three months after deployment, the following events occur within the same week:

- Hospital A reports that the system classified two cardiac emergency patients as "low priority," resulting in delayed treatment
- Hospital B reports intermittent connectivity issues causing the system to default to an unknown state rather than a safe fallback
- Hospital C reports that after a routine software patch to the underlying infrastructure, the AI system's response latency increased by 400%

From a cross-functional incident management perspective, which statement BEST describes the appropriate organizational response?

A) Each hospital should handle its incident independently through its local IT support team, as the issues appear unrelated and localized to specific deployment environments

B) The incidents should be escalated as a coordinated cross-functional response because they may share common root causes — the misclassification at Hospital A could indicate model drift or data quality issues, the fallback failure at Hospital B reveals a system brittleness problem, and the latency issue at Hospital C suggests insufficient testing of infrastructure changes, all of which require collaboration among clinical, engineering, compliance, and risk management stakeholders

C) Only the Hospital A incident requires immediate escalation because it resulted in patient harm — the other two incidents are operational issues that can be addressed through standard IT service management processes without involving governance stakeholders

D) All three incidents should be reported to the national competent authority immediately, as any malfunction of a medical AI system constitutes a serious incident under the EU AI Act regardless of actual harm

---

**Q10.** [Domain II.A | Bloom: Remember]

Under data protection law, when an AI system processes personal data to make automated decisions that significantly affect individuals, which right is MOST specifically designed to protect data subjects in this context?

A) The right to data portability — enabling individuals to transfer their data to an alternative AI system provider

B) The right not to be subject to a decision based solely on automated processing that produces legal or similarly significant effects, including the right to obtain human intervention, express their point of view, and contest the decision

C) The right to erasure — enabling individuals to request deletion of all personal data used to train the AI model

D) The right to restrict processing — enabling individuals to limit how the AI system uses their data for future predictions

---

Cevaplarını hazır olduğunda gönder (örn: **1D 2A 3C 4B 5A 6D 7BCD 8C 9B 10B**)

---

## SONUÇLAR

*(Bu bölüm cevaplarından sonra doldurulacak)*

---

<!-- ANSWER KEY — DO NOT READ BEFORE ANSWERING
Q1: D | Q2: A | Q3: C | Q4: B | Q5: A | Q6: D | Q7: BCD | Q8: C | Q9: B | Q10: B

Distribution (single-answer only): A(Q2,Q5)=2, B(Q4,Q9,Q10)=3, C(Q3,Q8)=2, D(Q1,Q6)=2
Sequence: D,A,C,B,A,D,BCD,C,B,B — max consecutive same = 2 (Q9,Q10 both B) ✓

CLOSE-PAIR TRACKING:
- Q3 (C↔D): C says data drift (incoming data distribution shifted, no model changes). D says model drift from online learning (model parameters changed). Critical difference: "data drift" (external change, model unchanged) vs "model drift from continuous online learning" (model itself changed). The scenario explicitly states "No model updates have been deployed" — eliminates D.
- Q8 (B↔C): B = Map, Measure, Manage, Monitor (wrong — Monitor is not a core function). C = Govern, Map, Measure, Manage (correct). Critical difference: B replaces "Govern" with "Monitor" — Monitor is an activity WITHIN Manage, not a separate core function.

CASE STUDIES: Q6, Q9
MULTI-SELECT: Q7 (correct: B, C, D)

DOMAIN MAP: III.A(Q1,Q4), III.B(Q2,Q6), III.C(Q3,Q7,Q9), II.A(Q10), II.C(Q5), II.D(Q8)
BLOOM MAP: Q1=Understand, Q2=Apply, Q3=Analyze, Q4=Apply, Q5=Apply, Q6=Analyze, Q7=Apply, Q8=Remember, Q9=Analyze, Q10=Remember
-->
