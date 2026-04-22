# AI Risk Triage — Ürün Spec ve Build Roadmap

> **Hexis SaaS Platform — Sprint 2.5 Modülü**
> **Versiyon:** v1.0 (22 Nisan 2026)
> **Hedef lansman:** Q3 2026
> **Stratejik bağlam:** Anthropic Claude for Legal webinar (21 Nisan 2026) sonrası alınan stratejik revizyonlar doğrultusunda. Hexis'in NDA triage'ın AI governance eşdeğeri — killer feature.

---

## 1. Ürün Özeti

### 1.1 Ne Yapar

AI Risk Triage, bir organizasyonun envanterindeki **birden fazla AI sistemini** EU AI Act'e göre toplu olarak sınıflandıran, risk register üreten ve tekrarlanabilir iş akışı sağlayan bir modüldür. Mevcut Generator (tek sistem) modülünün çoklu-sistem uzantısıdır.

**Tipik kullanıcı:** 10+ AI sistemi olan kurumun compliance officer, DPO veya CISO'su.

**Tipik girdi:** Organizasyon AI envanteri (CSV veya manuel giriş), her satır bir AI sistemi.

**Tipik çıktı:** Her sistem için risk seviyesi (Red/Yellow/Green), madde referansları, yükümlülük listesi, öncelik sırası. `.xlsx` risk register + `.pdf` executive summary + interaktif dashboard.

### 1.2 Neden Killer Feature

Mark Pipes (Anthropic Legal Team Lead) "NDA triage'ı yüksek hacim, düşük komplekslik iş olarak tespit ettim ve plugin'i onun etrafında kurdum" dedi. AI governance için eşdeğer iş = **AI System Risk Triage**.

**Mevcut alternatifler ve dezavantajları:**

| Alternatif | Dezavantaj |
|---|---|
| Manuel Excel tracking | Zaman alır, güncel mevzuatı yansıtmaz, hata riski yüksek |
| OneTrust / Archer | Pahalı, generic compliance, EU AI Act update'lerinde yavaş |
| One-time consulting | Tekrarlanmaz, skalalanmaz, 3-6 ay sonra outdated |
| Şirket içi dev | 6-12 ay, ekip maliyeti, mevzuat bilgisi gerekli |

**Hexis'in farkı:**
- EU AI Act + KVKK (dual jurisdiction) native
- Scheduled güncelleme (yeni sistemler otomatik eklendiğinde)
- Mevzuat değişikliğinde re-classification (madde değişirse ilgili sistemler otomatik flag)
- Claude-optional (banka/kamu segmenti için kritik)
- Deterministik taban + opsiyonel AI enrichment

### 1.3 Ticari Hedefler

**Birim ekonomi:**
- Müşterinin alternatifi: 0.5 FTE senior compliance officer × 400K TL/yıl = 200K TL/yıl
- Hexis Enterprise tier: 60-80K TL/yıl
- ROI: 2.5-3.3x
- Payback: 3-5 ay

**İlk 12 ay hedefi:**
- 20 ödeyen Enterprise müşteri (50+ AI sistemi olan kurumlar)
- 50 ödeyen Pro müşteri (10-50 AI sistemi olan KOBİ'ler)
- Toplam ARR: ~1.5-2M TL

---

## 2. Kullanıcı Personaları ve Senaryolar

### 2.1 Ana Personalar

**Persona 1: Deniz — Banka Compliance Officer**
- 35 AI sistemi (iç + vendor)
- BDDK + KVKK + EU AI Act (AB müşterileri)
- Claude kullanamıyor (veri güvenliği)
- Haftalık envanter güncellemesi gerekli
- Aylık yönetim raporu zorunlu

**Persona 2: Elif — Teknoloji Şirketi DPO**
- 15 AI sistemi (çoğu vendor SaaS + 2-3 iç model)
- AB'ye hizmet ihracatı yapıyor
- Claude OK (veri hassasiyeti düşük)
- 3 aylık compliance review döngüsü
- FRIA'ları güncel tutmak zorunda

**Persona 3: Mehmet — Holdings Group Compliance Lead**
- 3 bağlı şirket, toplam 60+ AI sistemi
- Her şirket farklı sektörde (retail, finans, sigorta)
- Kurumsal karar otoritesi, subsidiary'ler uygular
- Playbook standardizasyonu kritik

### 2.2 Kullanım Senaryoları

**Senaryo A: İlk Envanter (Tek Sefer)**
Deniz işe başladığında bankanın 35 AI sisteminin envanterine erişiyor. Hepsini EU AI Act'e göre sınıflandırmak gerek. Manuel yapsa 2 hafta sürer. Risk Triage ile 2 saat.

**Senaryo B: Yeni Sistem Ekleme (Rutin)**
IT ekibi haftada 2-3 yeni AI tool ekliyor (Copilot, ChatGPT Enterprise, vendor API'leri). Elif her yeni eklemeyi sınıflandırıp compliance listesini güncellemeli. Playbook + Schedule ile otomatikleşir.

**Senaryo C: Mevzuat Güncellemesi (Dönemsel)**
Ağustos 2026'da Annex III yükümlülükleri yürürlüğe giriyor. Mehmet'in 60 sisteminin hangileri etkilenir? Mevzuat Agent flag'leri yakaladığında Risk Triage otomatik re-classification çalıştırır, etkilenen sistemleri flag'ler.

**Senaryo D: Denetim Hazırlığı (Yıllık)**
Yıllık ISO 42001 denetimi öncesi tüm AI sistemler için Annex IV teknik dokümantasyon eksikleri raporlanır. Her sistemin FRIA durumu, son review tarihi, açık aksiyon maddeleri.

---

## 3. Feature Scope

### 3.1 MVP (Q3 2026 Launch)

**Core Functionality:**
1. AI System Inventory (CRUD)
2. Bulk import (CSV upload)
3. Deterministic Risk Classification (batch)
4. Risk Register view (filterable table)
5. Single-system drill-down (Generator view)
6. Export: `.xlsx` Risk Register, `.pdf` Executive Summary
7. Dashboard (counts by risk level, domain, status)

**Optional AI Layer (toggle):**
1. Claude enrichment per-system (purpose text analysis)
2. Pre-assessment signals (hidden risk detection)

**Integration Points:**
- Generator modülü tek-sistem drill-down için
- FRIA modülü (high-risk sistemlere doğrudan link)
- Checklist modülü (yükümlülük listesi)

### 3.2 V1.5 (Q4 2026)

**Playbook System:**
1. Save triage rules as reusable Playbook
2. Apply Playbook to new systems automatically
3. Share Playbook across teams/organization
4. Playbook marketplace (Hexis-provided templates)

**Scheduled Runs:**
1. Weekly auto-triage of new inventory items
2. Monthly full re-classification
3. Regulatory change trigger (via Mevzuat Agent)
4. Email/Slack notification on changes

### 3.3 V2 (Q1-Q2 2027)

**External Integrations:**
1. ServiceNow API (AI asset inventory sync)
2. OneTrust API (GRC data sync)
3. Archer API (risk data sync)
4. MCP Server tools (Pro-only)

**Advanced Analytics:**
1. Portfolio risk trend (12 ay histori)
2. Compliance debt tracking
3. Deadline heatmap (Art. 26 timelines)
4. Cross-system dependency analysis

---

## 4. UI/UX Akışı

### 4.1 Konum

Risk Triage, Generator modülünün **multi-system extension'ı** olarak konumlanır. Ayrı sayfa değil — Generator içinde mode toggle.

**URL Yapısı:**
- `/dashboard/observe` — Single assessment mode (mevcut)
- `/dashboard/observe/bulk` — Bulk triage mode (yeni)
- `/dashboard/inventory` — AI System Register (yeni)

### 4.2 Kullanıcı Akışı

**İlk kez kullanım:**

1. Dashboard → "AI System Inventory" sidebar item
2. Empty state: "You haven't added any AI systems yet." + iki CTA:
   - "Add single system" → Generator flow
   - "Bulk import CSV" → Triage flow
3. Bulk import seçerse:
   - Template CSV indir
   - CSV upload
   - Column mapping ekranı (optional, AI auto-detect)
   - Validation (missing fields, format errors)
   - Preview first 5 rows
   - Confirm → Triage başlar
4. Triage çalışırken progress bar (systems classified: 12/35)
5. Tamamlanınca Risk Register view

**Risk Register view:**

Ana tablo kolonları:
- System name
- Vendor
- Risk level (Red/Yellow/Green badge)
- Risk article (Art. 5 / Art. 6 / Art. 50 / GPAI)
- Domain (Annex III kategorisi veya "N/A")
- Status (Pending / In Progress / Completed)
- Last reviewed
- Next deadline
- Action

Filtreleme:
- Risk level
- Status
- Domain
- Vendor
- Deadline (next 30/60/90 days)
- Missing documentation

Her satıra tıklayınca → Generator single-view (drill-down)

**Drill-down (Generator view):**

Seçilen sistem için:
- Mevcut Classifier wizard (pre-filled)
- Obligation list
- FRIA status/link
- Checklist progress
- Document upload area (Annex IV)
- Activity log (who changed what when)

### 4.3 Bulk Actions

Risk Register'da checkbox selection:
- Bulk re-classify (mevzuat güncellemesi sonrası)
- Bulk FRIA trigger (high-risk sistemler için)
- Bulk assign (compliance officer atama)
- Bulk export (.xlsx, .pdf)

---

## 5. Database Schema

### 5.1 Yeni Tablolar

```sql
-- AI System envanteri
CREATE TABLE ai_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Temel bilgiler
  system_name TEXT NOT NULL,
  vendor TEXT,
  internal_id TEXT,
  intended_purpose TEXT,
  
  -- Classification inputs
  deployment_domain TEXT, -- 'hr' | 'credit' | 'health' | 'education' | 'law_enforcement' | 'biometric' | 'critical_infra' | 'justice' | 'other'
  data_types TEXT[], -- ['personal_data', 'special_categories', 'children_data', 'biometric', 'health']
  decision_authority TEXT, -- 'fully_automated' | 'human_in_loop' | 'human_on_loop' | 'advisory'
  market_scope TEXT[], -- ['eu', 'turkey', 'global']
  organization_role TEXT, -- 'provider' | 'deployer' | 'importer' | 'distributor'
  
  -- Classification results (computed)
  risk_level TEXT, -- 'prohibited' | 'high' | 'limited' | 'minimal' | 'gpai'
  risk_articles TEXT[], -- ['art_5', 'art_6_1', 'annex_iii_5']
  obligations TEXT[], -- mapping to obligation catalog
  
  -- Status tracking
  status TEXT DEFAULT 'pending', -- 'pending' | 'in_progress' | 'completed' | 'exempted'
  priority TEXT, -- 'p0' | 'p1' | 'p2' | 'p3'
  next_review_date DATE,
  next_deadline DATE,
  
  -- Documentation
  has_fria BOOLEAN DEFAULT FALSE,
  has_technical_doc BOOLEAN DEFAULT FALSE,
  has_conformity_assessment BOOLEAN DEFAULT FALSE,
  documentation_completeness INT, -- 0-100
  
  -- AI enrichment results (nullable, only if Claude enabled)
  ai_hidden_risks TEXT[], -- Claude-detected risk signals
  ai_missing_info TEXT[], -- Claude-suggested info gaps
  ai_regulatory_hints TEXT[],
  ai_enrichment_timestamp TIMESTAMPTZ,
  
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  classified_at TIMESTAMPTZ,
  
  -- Soft delete
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_ai_systems_org ON ai_systems(org_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_ai_systems_risk ON ai_systems(org_id, risk_level) WHERE deleted_at IS NULL;
CREATE INDEX idx_ai_systems_deadline ON ai_systems(org_id, next_deadline) WHERE deleted_at IS NULL;

-- Bulk import operations (audit trail)
CREATE TABLE triage_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  initiated_by UUID NOT NULL REFERENCES auth.users(id),
  
  batch_name TEXT,
  source TEXT, -- 'csv_upload' | 'scheduled_run' | 'mcp_sync' | 'api'
  
  systems_count INT NOT NULL,
  classified_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  
  claude_enrichment_enabled BOOLEAN DEFAULT FALSE,
  playbook_id UUID REFERENCES playbooks(id),
  
  status TEXT DEFAULT 'pending', -- 'pending' | 'running' | 'completed' | 'failed'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  error_log JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playbooks (reusable classification rules)
CREATE TABLE playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  name TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0',
  
  -- Rules (JSONB for flexibility)
  risk_thresholds JSONB, -- custom risk rules
  decision_tree JSONB, -- conditional logic overrides
  report_template TEXT, -- Markdown/HTML template
  approval_workflow JSONB,
  
  -- Scope
  is_shared BOOLEAN DEFAULT FALSE, -- organization-wide
  is_template BOOLEAN DEFAULT FALSE, -- marketplace template
  jurisdiction TEXT[], -- ['eu', 'turkey', 'dual']
  sector TEXT, -- 'banking' | 'insurance' | 'healthcare' | etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- System-Playbook associations
CREATE TABLE system_playbook_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_id UUID NOT NULL REFERENCES ai_systems(id),
  playbook_id UUID NOT NULL REFERENCES playbooks(id),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  applied_by UUID REFERENCES auth.users(id)
);

-- Activity log (for audit + history)
CREATE TABLE system_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_id UUID NOT NULL REFERENCES ai_systems(id),
  user_id UUID REFERENCES auth.users(id),
  
  action TEXT NOT NULL, -- 'created' | 'classified' | 'reclassified' | 'updated' | 'documentation_added' | etc.
  payload JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.2 RLS (Row Level Security)

```sql
-- ai_systems: org-scoped access
ALTER TABLE ai_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org's systems"
  ON ai_systems FOR SELECT
  USING (org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert systems for their org"
  ON ai_systems FOR INSERT
  WITH CHECK (org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their org's systems"
  ON ai_systems FOR UPDATE
  USING (org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()));

-- Similar policies for triage_batches, playbooks, system_activity_log
```

---

## 6. API Endpoints

Tasarım prensibi: **MCP-ready.** Her endpoint Zod schema ile tanımlı, dual JSON/Markdown response desteği.

### 6.1 AI Systems CRUD

```
POST   /api/systems                  # Create single system
GET    /api/systems                  # List org systems (paginated, filtered)
GET    /api/systems/:id              # Get system detail
PATCH  /api/systems/:id              # Update system
DELETE /api/systems/:id              # Soft delete
```

**POST /api/systems/bulk** — CSV upload endpoint

Request:
```typescript
{
  source: 'csv' | 'manual',
  systems: AiSystemInput[],
  playbook_id?: string,
  enable_ai_enrichment: boolean,
  batch_name?: string
}
```

Response (201):
```typescript
{
  batch_id: string,
  systems_accepted: number,
  systems_rejected: number,
  errors: ValidationError[],
  estimated_completion_seconds: number
}
```

### 6.2 Triage Operations

```
POST   /api/triage/classify          # Classify single or batch
GET    /api/triage/batches/:id       # Get batch status
POST   /api/triage/reclassify-all    # Re-classify org's all systems (admin)
```

**POST /api/triage/classify:**

Request:
```typescript
{
  system_ids: string[],            // 1 or many
  enable_claude: boolean,          // enrichment toggle
  playbook_id?: string,
  force_recompute: boolean         // ignore cache
}
```

Response:
```typescript
{
  batch_id: string,
  results: [
    {
      system_id: string,
      risk_level: 'prohibited' | 'high' | 'limited' | 'minimal' | 'gpai',
      risk_articles: string[],
      obligations: Obligation[],
      confidence: number,
      ai_enrichment?: {
        hidden_risks: string[],
        missing_info: string[],
        regulatory_hints: string[]
      }
    }
  ],
  errors: TriageError[]
}
```

### 6.3 Playbook Operations

```
GET    /api/playbooks                 # List org + template playbooks
POST   /api/playbooks                 # Create
GET    /api/playbooks/:id
PATCH  /api/playbooks/:id
DELETE /api/playbooks/:id
POST   /api/playbooks/:id/apply      # Apply to systems
POST   /api/playbooks/:id/share      # Share org-wide
```

### 6.4 Export Endpoints

```
GET    /api/export/risk-register      # .xlsx download
GET    /api/export/executive-summary  # .pdf download
GET    /api/export/compliance-pack    # .zip (xlsx + pdf + per-system docs)
```

### 6.5 MCP Server Tools (Pro-only)

```typescript
// tools.ts — shared service layer
export const mcpTools = {
  list_ai_systems: { /* ... */ },
  classify_ai_system: { /* ... */ },
  get_risk_register: { /* ... */ },
  apply_playbook: { /* ... */ },
  generate_fria_for_system: { /* ... */ }
}
```

Her MCP tool aynı backend function'ı çağırır (karar raporundaki "Shared service layer" prensibine uygun).

---

## 7. Claude Enrichment Tasarımı

### 7.1 Prensip

**Deterministik motor %80 işi yapar. Claude %20 zenginleştirmeyi yapar.**

Claude-less mode'da (banka/kamu segmenti) şu bilgilerle yetinilir:
- Kural tabanlı risk classification
- Static obligation mapping
- Keyword-based flag detection

Claude enabled mode'da ek olarak:
- "Intended purpose" serbest metin semantik analizi
- Gizli risk sinyalleri (metindeki dolaylı ifadeler)
- Eksik bilgi tespiti (ne sorulmalıydı ama sorulmadı)
- Regulatory interaction hints (sektörel özel düzenlemeler)

### 7.2 Per-System Toggle

Kullanıcı Risk Register'da her satırda "Enrich with AI" butonu görür. Bir tıkla sadece o satır için Claude çağrısı yapılır.

Bulk enrichment: "Enrich selected" button + quota check (Pro tier'da aylık 100 enrichment, Enterprise'da 500).

### 7.3 Claude Prompt Örneği

```
SYSTEM: You are an EU AI Act compliance analyst. Analyze the following AI system's intended purpose and identify:
1. Hidden risk signals not captured by structured fields
2. Missing information that would affect classification
3. Regulatory interactions with Turkish or EU sector laws (BDDK, BTK, MASAK, MiFID, DSA, DMA)

Return structured JSON only. Do not hallucinate articles — cite only if explicitly stated.

USER:
System name: {system_name}
Vendor: {vendor}
Intended purpose: {intended_purpose}
Deterministic classification: {risk_level} ({risk_articles})
```

### 7.4 Cost Management

- Ortalama Claude call: ~1500 input tokens + ~800 output tokens = $0.012
- Aylık 100 enrichment (Pro): $1.20/ay
- Aylık 500 enrichment (Enterprise): $6/ay
- Bu maliyetler tier fiyatlandırmasına absorbe edilmiş

---

## 8. Output Formats

### 8.1 `.xlsx` Risk Register

Sheet 1 — Summary:
- Org info (name, date, jurisdiction)
- Counts (total, by risk level, by status)
- Top 10 highest priority items
- Upcoming deadlines

Sheet 2 — Detailed Register:
- Tüm kolonlar (system, vendor, risk, articles, obligations, status, deadlines, documentation status)
- Filters enabled
- Conditional formatting (risk levels renk kodlu)

Sheet 3 — Obligations by System:
- Her sistem için uygulanabilir yükümlülükler
- Compliance status per obligation
- Evidence links

Sheet 4 — Deadlines Calendar:
- Chronological deadline list
- Countdown columns
- Responsible party

### 8.2 `.pdf` Executive Summary

1-2 sayfa, yönetim için:
- Executive dashboard (pasta grafikler)
- High-risk systems (top 5)
- 30/60/90 gün aksiyon listesi
- Compliance debt (unresolved items)
- Next review dates

### 8.3 Dashboard (web)

Interaktif kart grid:
- Risk distribution (Red/Yellow/Green counts)
- Domain breakdown (Annex III kategorileri)
- Status breakdown (Pending/In Progress/Completed)
- Deadline heatmap (önümüzdeki 90 gün)
- Recent activity feed
- Quick actions (Bulk reclassify, Export, Create playbook)

---

## 9. Pricing Tier Mapping

### 9.1 Tier Yapısı

**Hexis Free** (hexis.center, ücretsiz araçlar)
- Tek-sistem Classifier (mevcut)
- Tek-sistem FRIA (mevcut)
- Checklist (mevcut)
- Risk Triage YOK

**Hexis Pro** (€49/ay per user)
- 10 AI sistem limit
- Bulk triage (deterministik)
- 100 Claude enrichment/ay (opsiyonel toggle)
- 1 Playbook save slot
- `.xlsx` + `.pdf` export
- Scheduled runs YOK

**Hexis Business** (€149/ay per user)
- 50 AI sistem limit
- Bulk triage + scheduled runs (weekly)
- 500 Claude enrichment/ay
- 10 Playbook save slots + share
- Tüm export formatları
- MCP Server access (Pro-only feature)

**Hexis Enterprise** (€499+/ay, custom)
- Sınırsız sistem
- Daily scheduled runs
- 2000+ Claude enrichment/ay (custom)
- Sınırsız Playbook + marketplace access
- SSO, audit logs, DLP
- Özel Playbook geliştirme (danışmanlık)
- SLA

### 9.2 Agency Ürünü (Q1 2027)

Agency tier **ayrı bir ürün olarak** sonradan geliştirilecek (karar raporu 22 Nisan revizyonu). Ayrı domain (önerilen: `agency.hexis.center`), shared backend, farklı frontend.

---

## 10. 90-Day Build Roadmap

### Sprint 2.5a — Foundation (Hafta 1-4)

**Hafta 1:**
- Database schema migration (ai_systems, triage_batches, playbooks, system_activity_log)
- RLS policies + testler
- API scaffolding (Next.js route handlers)

**Hafta 2:**
- CRUD endpoints (ai_systems, playbooks)
- CSV parser + validation
- Column mapping UI

**Hafta 3:**
- Deterministik triage engine (classifier-engine.ts'in batch version'ı)
- Batch processing (async + queue)
- Risk Register table UI (shadcn Table component)

**Hafta 4:**
- Filter/sort/search
- Drill-down to Generator
- Activity log
- Unit tests (80%+ coverage)

### Sprint 2.5b — AI Enrichment (Hafta 5-7)

**Hafta 5:**
- EnrichmentService abstraction layer
- ClaudeEnrichment implementation
- NullEnrichment (default)
- Toggle UI (settings + per-system)

**Hafta 6:**
- Structured output prompts
- Rate limiting + quota tracking
- Error handling (graceful degradation)

**Hafta 7:**
- Testing (Claude path + fallback path)
- Cost monitoring dashboard
- Admin controls

### Sprint 2.5c — Export & Dashboard (Hafta 8-10)

**Hafta 8:**
- `.xlsx` generator (SheetJS)
- `.pdf` generator (React-PDF veya Puppeteer)
- Download endpoints

**Hafta 9:**
- Dashboard UI (charts with recharts)
- Deadline heatmap
- Activity feed
- Empty states

**Hafta 10:**
- End-to-end testing
- Load testing (100 systems batch)
- Security review (OWASP checklist)
- Documentation (user-facing)

### Sprint 2.5d — Launch Prep (Hafta 11-13)

**Hafta 11:**
- Beta user onboarding (5-10 müşteri)
- Feedback collection
- Priority bug fixes

**Hafta 12:**
- Marketing asset'ler (landing page section, demo video, blog post)
- Sales materyalleri (1-pager, case study template)
- Pricing page update

**Hafta 13:**
- Public launch
- PR / LinkedIn campaign
- Webinar (Hexis'in Claude for Legal muadili)

---

## 11. Go-to-Market

### 11.1 Launch Sıralaması

**Pre-launch (Hafta 11-12):**
- 5-10 beta müşteri (ücretsiz, feedback karşılığında)
- Case study hazırlığı
- Testimonial toplama

**Launch (Hafta 13):**
- LinkedIn post serisi (5 post, 1 hafta)
- Türkçe blog: "50 AI Sisteminizi 2 Saatte Nasıl Sınıflandırırsınız?"
- İngilizce blog: "AI Risk Triage Under the EU AI Act"
- Hexis AI Governance Türkiye newsletter: feature announcement
- Webinar: "AI Governance'ta Claude for Legal Devrimi" (45 dk)

**Post-launch (Hafta 14+):**
- Haftalık demo sessions
- Türkiye + AB compliance etkinliklerinde workshop
- IAPP / IAIP referans programı

### 11.2 Hedef Segmentler (Öncelik Sırasıyla)

1. **Türk bankalar** — 30+ AI sistem, regulasyon yoğun, bütçesi var
2. **Türk sigortacılar** — EU AI Act + SBM çift rejim
3. **Türk teknoloji şirketleri (AB ihracatı olan)** — dual jurisdiction ihtiyacı
4. **Türk sağlık kuruluşları** — özel nitelikli veri + Annex III(5)
5. **AB KOBİ'leri (teknoloji)** — İngilizce pazarlama

### 11.3 Fiyatlama Stratejisi

**İlk 6 ay — Penetration Pricing:**
- Pro: €39/ay (€49 yerine)
- Business: €119/ay (€149 yerine)
- Enterprise: custom
- Yıllık ödeme: %20 indirim

**6+ ay — Normal Pricing:**
- İlan edilen fiyatlara geçiş

**Erken Benimsemeci Bonusu:**
- İlk 20 ödeyen müşteri için "Founding Customer" rozeti + fiyat kilitleme (2 yıl)

---

## 12. Başarı Metrikleri

### 12.1 Ürün Metrikleri (30 gün post-launch)

- Activation rate: Bulk import tamamlayan kullanıcı % (hedef: %70+)
- Time to value: Kayıttan ilk sınıflandırmaya süre (hedef: <15 dk)
- CSV upload success rate (hedef: %90+)
- Claude enrichment opt-in rate (hedef: %40 Pro tier'da)

### 12.2 Ticari Metrikleri (6 ay)

- Ödeyen müşteri sayısı (hedef: 50)
- ARR (hedef: ₺1.5M)
- CAC < ₺10K per Pro müşteri
- Churn < %5/ay
- NPS > 40

### 12.3 Etki Metrikleri

- Müşteri başına ortalama sınıflandırılmış sistem sayısı
- Müşteri başına ortalama manuel saat tasarrufu (self-reported)
- Playbook share rate (Business/Enterprise tier'da)

---

## 13. Riskler ve Mitigasyonlar

| Risk | Olasılık | Etki | Mitigation |
|---|---|---|---|
| CSV format çeşitliliği | Yüksek | Orta | Flexible column mapping UI + AI-assisted detection |
| Claude API maliyeti fırlar | Düşük | Orta | Per-user quota + rate limiting + monitoring dashboard |
| Deterministik engine yanlış sınıflandırır | Orta | Yüksek | Unit test coverage %95+ + Claude fallback + appeal flow |
| Müşteri envanterine erişemiyor | Yüksek | Yüksek | CSV template + MCP Server (Pro+) + ServiceNow integration (V2) |
| Anthropic direkt AI governance tool çıkarır | Düşük | Yüksek | Claude-optional moat + ORIENT methodology + jurisdictional specialization |
| ISO 42001/42005 referans değişiklikleri | Orta | Orta | Mevzuat Agent entegrasyonu + weekly sync + founder review |

---

## 14. Açık Sorular (Roadmap'te Ele Alınacak)

1. **Playbook marketplace** — template'ler kim yazar, nasıl monetize edilir?
2. **Danışman ekosistemi** — Agency ürünü lansmanında mevcut Pro müşterilerimize nasıl tanıtılır?
3. **ISO 42005 entegrasyonu** — draft yayınlanırsa ne kadar hızlı adapt ederiz?
4. **Certification badge** — "Hexis Classified" badge müşterinin kendi sitesinde göstermesi?
5. **Compliance officer community** — feature request + roadmap voting + peer support?

Bu sorular Q4 2026 strategy review'ında ele alınacak.

---

**Doküman sahibi:** Özden Coşkun
**Revize edilecek:** Launch sonrası 30. gün (müşteri feedback ile)
**Bağlı dokümanlar:**
- `dijital-gelir-modeli-kararlar.md` (Bölüm 8.3, 8.5)
- `hexis-mcp-server-analiz.md` (MCP tool specs)
- `CLAUDE.md` (proje context)
