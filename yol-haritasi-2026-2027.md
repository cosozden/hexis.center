# Hexis 12-Ay Yol Haritası — Nisan 2026 → Mart 2027

> **Oluşturuldu:** 22 Nisan 2026
> **Stratejik bağlam:** Anthropic "Claude for Legal" webinar (21 Nisan) sonrası alınan revizyonlar ve 22 Nisan strateji oturumu kararları doğrultusunda.
> **Referans dokümanlar:** `dijital-gelir-modeli-kararlar.md`, `ai-risk-triage-urun-spec.md`, `hexis-mcp-server-analiz.md`

---

## Stratejik Konsolidasyon (22 Nisan Oturumu Kararları)

Roadmap'in tüm adımları bu altı kararın üzerine kuruludur:

1. **KVKK jurisdiction-aware:** SaaS KVKK crosswalk içerecek, onboarding jurisdiction seçimiyle EU müşteri için gizli kalacak
2. **Agency = ayrı ürün:** Pro lansmanı sonrası ayrı domain + frontend, shared backend
3. **Claude-Optional baseline:** Deterministik çekirdek zorunlu, AI enrichment opsiyonel
4. **AI Risk Triage killer feature:** Sprint 2.5 — Navigate/Track önüne alındı
5. **Whitepaper + TSE AK310 + ISO 42005** onaylı
6. **Landing page tone:** "Structured methodology, defensible decisions, ORIENT framework"

---

## Q2 2026 — Nisan-Haziran: MVP Finalizasyon

**Tema:** Mevcut SaaS altyapısını Pro lansmanına hazırla. Landing tonu güncellenir, Claude-Optional mimari baseline olarak yerleşir.

### Nisan (Hafta 17-18)

**Tamamlanan (22 Nisan itibariyle):**
- ✅ Database schema + RLS
- ✅ Stripe webhook
- ✅ classifier-engine.ts (25 test)
- ✅ matrix-engine.ts (26 test)
- ✅ shadcn/ui component library (14 component)
- ✅ Karar raporu revizyonları (8.3 KVKK, 8.5 Claude-Optional)
- ✅ Landing page tone revize (hero + "What Hexis Is")
- ✅ AI Risk Triage spec dokümanı

**Kalan (bu ay):**
- ⏳ Observe form UI tamamlanması
- ⏳ Risk wizard frontend → engine bağlantısı
- ⏳ Jurisdiction-aware UI context provider (yeni)
- ⏳ Claude-Optional abstraction layer (EnrichmentService interface)

### Mayıs (Hafta 19-22)

- FRIA UI tamamlanması (Art. 27 template generator)
- Checklist modülü SaaS'a entegrasyon
- Dashboard (Observe + Risk durum özeti)
- KVKK crosswalk — Dual/Turkey jurisdiction'da aktif
- Landing tonu tüm site'a yayılması (Generator, FRIA, Checklist sayfaları)
- TSE AK310 üyelik başvurusu (hafta 19)

### Haziran (Hafta 23-26)

- Beta kullanıcı onboarding (5-10 davetli)
- Beta feedback iterasyonu
- Pricing sayfası (Pro + Business + Enterprise — penetration pricing)
- Stripe test mode → live mode
- Trust sayfası + AI Disclaimer
- Legal dokümanlar (ToS, Privacy Policy, DPA)
- **Milestone: Pro Beta Lansmanı (30 Haziran)**

---

## Q3 2026 — Temmuz-Eylül: Pro Launch + Risk Triage Sprint

**Tema:** Pro tier public launch. AI Risk Triage sprint'i başlar (90-gün build).

### Temmuz (Hafta 27-30)

- **Pro Public Lansman (7 Temmuz)**
- LinkedIn launch campaign (Hexis AI Governance Türkiye newsletter + 5-post serisi)
- Türkçe + İngilizce blog: "AI Governance Isn't a Checklist"
- Mevzuat Agent v2 (haftalık otomatik scan + founder review)
- İlk ödeyen müşteri hedefi: 10

**AI Risk Triage Sprint 2.5a başlar:**
- Hafta 1-2: ai_systems tablosu + RLS + CRUD API
- Hafta 3-4: CSV import + validation + deterministik triage engine

### Ağustos (Hafta 31-34)

**AI Risk Triage Sprint 2.5b:**
- Hafta 5-6: EnrichmentService abstraction + ClaudeEnrichment + NullEnrichment
- Hafta 7: Structured output prompts + quota tracking

**Paralel:**
- İlk whitepaper draft (Bölüm 1-3: Introduction, ORIENT teorik temel, madde-bazlı kapsam)
- Pro müşteri 25+ hedefi
- İlk vaka çalışması (beta müşterisinden)

### Eylül (Hafta 35-39)

**AI Risk Triage Sprint 2.5c:**
- Hafta 8-9: `.xlsx` + `.pdf` export + Dashboard
- Hafta 10: End-to-end testing + security review

**Milestone: Risk Triage Beta Lansmanı (15 Eylül)**
- Business tier aktivasyonu
- Pro-only MCP Server ilk versiyonu (Risk Triage tools)
- Risk Triage Türkçe + İngilizce demo webinar'ı (28 Eylül)

---

## Q4 2026 — Ekim-Aralık: Doc Comprehension + Whitepaper

**Tema:** Annex III deadline (2 Ağustos 2026 geçti) sonrası acil uyum talebi dalgasını yakala. Doc Comprehension ile rakiplerden ayrış.

### Ekim (Hafta 40-43)

- Risk Triage public launch + pazarlama kampanyası
- Business tier ilk müşteri (hedef: 5)
- Doc Comprehension Faz 1 başlar:
  - Hafta 1: Document Ingester mimarisi
  - Hafta 2: PDF + DOCX parse
  - Hafta 3: Claude structured output + madde mapping
  - Hafta 4: UI ve Generator entegrasyonu

**Whitepaper:**
- Tüm draft tamamlanması (18-22 sayfa)
- 2 akademik review (Boğaziçi/Bilgi AI Ethics grubu)

### Kasım (Hafta 44-47)

- Doc Comprehension Faz 1 tamamlanması + Business tier feature
- Mevzuat Agent v3 (Digital Omnibus takibi öncelikli)
- Whitepaper final + SSRN/arxiv submission hazırlık
- ISO 42005 public comment dönemi takibi (proaktif değil)
- Pro + Business müşteri toplam: 40+

### Aralık (Hafta 48-52)

- **Whitepaper yayını** (1 Aralık) — hexis.center/whitepaper + SSRN + LinkedIn lansman
- Doc Comprehension Faz 2 başlar (inline flag sistemi)
- Yıl sonu compliance dönemi pazarlaması (Ağustos 2027 deadline acil)
- Enterprise tier hazırlık (SSO + audit log özellikleri)
- Yıl sonu retrospektif + 2027 strateji oturumu
- **Yıl sonu ARR hedefi: ₺1.2-1.5M**

---

## Q1 2027 — Ocak-Mart: Agency Ürünü + Enterprise

**Tema:** Ayrı Agency ürün pazarı, Enterprise tier tam fonksiyonel, Doc Comprehension tamamlanır.

### Ocak (Hafta 1-4)

- Doc Comprehension Faz 2 tamamlanması (inline flag)
- Enterprise tier (SSO, audit logs, DLP export) lansman
- **Agency ürünü build başlar:**
  - Ayrı domain: `agency.hexis.center`
  - Multi-tenant mimari (shared backend, yeni frontend)
  - Multi-client switcher
  - White-label theme system

### Şubat (Hafta 5-8)

- Agency ürünü alpha — 3 pilot danışmanlık firması
- Doc Comprehension Faz 3 (Pre-fill Engine) başlar
- TSE AK310 aylık toplantıları sürer, Hexis'in ORIENT metodolojisi sunulur
- İlk Enterprise müşteri (banka/sigorta) hedefi

### Mart (Hafta 9-13)

- **Agency Public Lansmanı (15 Mart)**
- Billing consolidation + commission tracking aktif
- Certified Hexis Partner programı
- İlk 5 Agency müşteri hedefi
- Q1 retrospektif + Q2 2027 planning
- **Q1 2027 sonu ARR hedefi: ₺2.5-3M**

---

## Q2+ 2027 — Bookmarklar (Detay Yok)

- **Doc Comprehension Faz 3 tamamlanması** (Nisan)
- **ISO 42005 katkı dönemi** (draft public comment açıldığında)
- **ServiceNow/OneTrust API entegrasyonları**
- **Türkçe pazarlama kampanyası** — Türkiye iç pazarına direkt odaklanma
- **Global expansion** — GCC + İngiltere + Güneydoğu Asya araştırması

---

## Öncelik Matrisi — İptal Edilen / Ertelenen

| Feature | Eski Plan | Yeni Plan | Gerekçe |
|---|---|---|---|
| Navigate stage tool | Sprint 3 | Q2 2027'ye ertelendi | AI Risk Triage daha yüksek ROI |
| Track stage tool | Sprint 4 | Q2 2027'ye ertelendi | AI Risk Triage daha yüksek ROI |
| KVKK modülü (full) | Kaldırıldı | Crosswalk olarak kaldı | Jurisdiction-aware UI |
| Agency tier (inline) | Pro ile eş zamanlı | Ayrı ürün, Q1 2027 | MVP scope creep önlendi |
| ISO standart editörlüğü | Hedef | Katkı seviyesinde | Zaman kısıtı |

---

## Haftalık İçerik Ritmi (Kesintisiz)

**LinkedIn:**
- Pazartesi: Mevzuat haber/yorum
- Çarşamba: Araç/özellik tanıtımı
- Cuma: Vaka analizi / düşünce liderliği

**Blog (hexis.center):**
- 2 İngilizce post/ay
- 2 Türkçe post/ay

**Newsletter (Hexis AI Governance Türkiye):**
- Haftalık, 5 bölüm (Pazartesi sabah)

**Bu üçü sabit kalır.** Build sprint'leri ne kadar yoğun olursa olsun, içerik ritmi bozulmaz. Çünkü CAC'ın %50+'sı bu kanallardan gelir.

---

## Zaman Çizelgesi — Takvim Özeti

| Ay | Ana Milestone | Müşteri Hedefi | Toplam ARR Hedefi |
|---|---|---|---|
| Nisan 2026 | Karar raporu revizyonları + Landing | 0 (hazırlık) | ₺0 |
| Mayıs | Observe + FRIA tamamlanması | 0 (beta hazırlık) | ₺0 |
| Haziran | Pro Beta | 5-10 (beta) | ₺0 |
| Temmuz | **Pro Public Lansman** | 10 ödeyen | ₺200K |
| Ağustos | Risk Triage build | 20 | ₺400K |
| Eylül | **Risk Triage Beta** | 30 | ₺600K |
| Ekim | Risk Triage Launch + Doc Comp Faz 1 | 40 | ₺850K |
| Kasım | Business tier momentum | 50 | ₺1.1M |
| Aralık | **Whitepaper yayını** | 60 | ₺1.4M |
| Ocak 2027 | Enterprise tier | 70 | ₺1.8M |
| Şubat | Agency alpha | 80 | ₺2.2M |
| Mart | **Agency Public Lansman** | 90+ | ₺2.8M+ |

---

## Risk Takibi

**Kırmızı risk (yakın takip):**
- Anthropic dikey AI governance tool çıkarması (Claude for Legal pattern)
- EU AI Act Annex III deadline değişikliği (Digital Omnibus)
- Türkiye regülasyon şoku (yeni KVKK değişikliği, sektörel düzenleyici AI rehberi)

**Sarı risk (orta takip):**
- Claude API fiyat artışı
- ISO 42005 final standart metninde ORIENT ile çelişen yaklaşım
- Agency pilot danışmanlık firmalarının düşük adaptasyonu

**Yeşil risk (izleme yeterli):**
- Türk-AB serbest ticaret değişiklikleri
- OneTrust/Archer'ın AI governance modülü (generic, Hexis'e direkt tehdit değil)

---

## Oturum Notu

Bu yol haritası yaşayan bir dokümandır. Her çeyrek sonunda retrospektif + revize edilir. Büyük stratejik kararlar (örneğin yeni bir rakip tehdidi) ani revizyon tetikleyebilir. Her revizyon "REVİZE — [tarih]" başlığıyla belgelenir.

**Bir sonraki revizyon:** 30 Haziran 2026 (Pro lansman sonrası Q3 planlaması).

---

**Doküman sahibi:** Özden Coşkun
**İnceleme aralığı:** Aylık
**Bağlı TASKS.md:** Haftalık aksiyon dökümü ayrı dosyada
