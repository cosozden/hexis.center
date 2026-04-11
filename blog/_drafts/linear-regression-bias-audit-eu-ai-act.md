---
title: "Bias Audit with Linear Regression: A Practical Method for EU AI Act Article 10"
description: "Detecting gender and age bias in a credit scoring model using linear regression coefficients. A data-driven approach for EU AI Act Article 10 compliance."
date: "2026-04-11"
category: "EU AI Act"
orient_stage: "Evaluate"
slug: "linear-regression-bias-audit-eu-ai-act"
reading_time: "8 min"
---

## The Problem: "Check for Bias" — But How?

EU AI Act Article 10(2)(f) is clear: training data for high-risk AI systems must be examined for possible biases.¹ But how exactly is that examination done in practice?

The regulation says "detect and mitigate bias" but doesn't prescribe a concrete method. In this article, we use linear regression as a bias audit tool — on real data, with executable code.

The project targets an area classified as high-risk under Annex III: creditworthiness assessment.² We used the German Credit Dataset (UCI), which describes 1,000 credit applications across 20 features.

## Why Linear Regression?

Why a simple model instead of something more complex for bias detection?

In linear regression, coefficients are directly interpretable. `is_female = -0.05` means "being female, all else being equal, reduces credit approval probability by 0.05 points." You can't get this level of clarity from a random forest or neural network.

Furthermore, EU AI Act Article 13 requires transparency and explainability for high-risk systems.³ A linear model explains its decision mechanism directly, which aligns with regulatory expectations.

Another reason: statistical significance testing (p-values) is directly applicable. It gives a clear answer to the question "is this coefficient coincidental or systematic?"

## Method: Two-Stage Bias Analysis

Our analysis consists of two stages:
(1) regression coefficients for individual-level bias detection,
(2) Disparate Impact ratio for group-level effect measurement.

### Protected Attributes

We identified two protected attributes in the dataset:

- **is_female:** Gender (female = 1, male = 0)
- **age / is_young:** Age (under 25 = 1, other = 0)

These attributes are protected under both EU AI Act and Turkish law (Constitution Art. 10, Labour Law Art. 5) — variables that should not lead to discrimination.

### Data Preparation

Numerical features (credit amount, duration, installment rate, existing credits, etc.) were scaled using *StandardScaler*. This step is critical: without scaling, coefficients are incomparable because they operate on different units (months vs. euros vs. ratios).

The dataset was split 80/20 for training and testing, with target variable balance preserved (*stratified split*).

## Findings

### 1. Coefficient Analysis

OLS regression results showed:

- **is_female coefficient: negative and statistically significant (p < 0.05)**. The model systematically uses gender in credit decisions, disadvantaging female applicants.
- **age coefficient: positive**. As age increases, the model tends to approve credit; younger applicants are disadvantaged.

This finding alone is an EU AI Act Article 10(2)(f) non-compliance signal: the training data carries systematic bias on a protected attribute, and the model has learned it.

### 2. Model Comparison: The Cost of Fairness

We compared two models:

- **Model A:** All features included (protected attributes present)
- **Model B:** Protected attributes removed (*fairness-aware*)

Result: only a **1% accuracy difference** between the two models. This is a critical finding — removing gender from the model costs almost no performance. There is no valid business justification for keeping protected attributes in the model.

### 3. Disparate Impact Analysis: One Metric Is Not Enough

The *Disparate Impact* (DI) ratio is based on the EEOC's 80% rule (*Four-Fifths Rule*): if the selection rate for the disadvantaged group is less than 80% of the advantaged group's rate, disparate impact exists.

| Group | Model A | Model B (fair) |
|-------|---------|----------------|
| Gender (F/M) | 0.951 | 1.025 |
| Age (young/other) | 0.804 | 0.974 |

Here is the project's most critical finding: **the gender DI ratio is 0.951, above the 80% threshold**. Looking only at the DI test, no problem would be detected. But the regression coefficient and p-value tell a different story: the model systematically uses gender.

For age, the picture is clearer: Model A has DI = 0.804, very close to the threshold. Model B jumps to 0.974 — removing protected attributes nearly eliminates age bias entirely.

This demonstrates why multi-method auditing is essential. Relying on a single fairness metric can cause you to miss hidden bias.

## EU AI Act Perspective

This analysis corresponds to the **Evaluate** stage of the ORIENT framework: "Where are the compliance gaps in the current system?"

Governance actions from the findings:

**Article 10(2)(f):** Systematic gender-based bias detected in training data. The examination obligation is not met.¹

**Article 10(2)(g):** Removing protected attributes is a viable bias mitigation strategy. The 1% performance loss is within acceptable bounds.¹

**Article 13:** Linear regression coefficients transparently explain the model's decision mechanism, meeting the explainability requirements for high-risk systems.³

**Annex III, point 5(b):** Creditworthiness assessment is classified as a high-risk AI system. Such systems are subject to all obligations from 2 August 2026.²

## Try the Project

We prepared the complete analysis as an executable Jupyter Notebook. You can open it in Google Colab and run it cell by cell. The notebook includes data loading, exploratory analysis, model building, statistical testing, and visualization with detailed explanations.

Access the notebook on GitHub: [Bias Audit with Linear Regression](https://github.com/cosozden/hexis.center/blob/main/bias_audit_linear_regression.ipynb)

## Conclusion

Bias detection doesn't require complex methods. Even a fundamental tool like linear regression can provide powerful answers when the right questions are asked. The real issue isn't which algorithm you use — it's whether you're asking the right questions.

If you're developing or deploying a high-risk AI system, start with these three questions:

- Do protected attributes affect model decisions?
- Is that effect statistically significant?
- Are you relying on a single fairness metric, or using multiple methods?

Answering these questions is the first step toward EU AI Act Article 10 compliance. You can determine your system's risk level with the Hexis [Risk Classifier](https://hexis.center/generator/), then evaluate compliance gaps with technical analyses like this one.

---

## References

1. European Parliament and Council. *Regulation (EU) 2024/1689, Article 10 — Data and Data Governance*. EUR-Lex, 12 July 2024. [artificialintelligenceact.eu/article/10](https://artificialintelligenceact.eu/article/10/)

2. European Parliament and Council. *Regulation (EU) 2024/1689, Annex III — High-Risk AI Systems*. EUR-Lex, 12 July 2024. [artificialintelligenceact.eu/annex/3](https://artificialintelligenceact.eu/annex/3/)

3. European Parliament and Council. *Regulation (EU) 2024/1689, Article 13 — Transparency and Provision of Information to Deployers*. EUR-Lex, 12 July 2024. [artificialintelligenceact.eu/article/13](https://artificialintelligenceact.eu/article/13/)
