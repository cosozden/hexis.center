# Hexis SaaS (app.hexis.center) — Devam Prompt'u

> Bu prompt'u yeni Cowork oturumunda yapıştır. hexis-saas-builder skill'i otomatik yüklenecek.

---

## Proje Nedir?

app.hexis.center, EU AI Act uyum platformu. "Claude IS the Consultant" paradigmasıyla çalışır — deterministik motorlar karar verir, Claude zenginleştirir. Next.js 15 (App Router) + Supabase + Vercel + Anthropic Claude API.

ORIENT 6-adımlı akış: Observe → Risk → Identify → Evaluate → Navigate → Track

**Repo:** github.com/cosozden/hexis.center
**SaaS kodu:** `app-hexis-center/` alt dizininde
**Launch hedefi:** 29 Mayıs 2026 (2 Ağustos Annex III deadline'ından 3 ay önce)

---

## 🟡 STRATEJİK KARAR GÜNCELLEMESİ — 22 Nisan 2026

Claude for Legal webinar (21 Nisan) sonrası stratejik revizyonlar. Ayrıntılar için:
- `dijital-gelir-modeli-kararlar.md` Section 8.3 (KVKK) + Section 8.5 (Claude-Optional)
- `ai-risk-triage-urun-spec.md` (yeni killer feature spec)
- `yol-haritasi-2026-2027.md` (12 aylık revize plan)

### Bağlayıcı Kararlar (SaaS build'e doğrudan etkisi var)

**1. Claude-Optional Architecture — YENİ BASELINE**
Deterministik motor zorunlu, Claude zenginleştirme opsiyonel. Her şirket Claude'u **per-system toggle** ile kullanıp kullanmamayı seçebilir. Neden: Türk bankaları/kamu sektörü LLM veri güvenliği gerekçesiyle Claude kullanamıyor.
- Her AI endpoint'i `manualMode: boolean` kabul etmeli
- Manuel modda: sadece deterministik motor çıktısı döner, Claude API çağrısı yapılmaz
- UI'da "Enrich with Claude" toggle'ı (default: ON, opt-out kolay)
- Mevcut 7 AI endpoint için bu flag henüz eklenmedi → **Sprint 2 sonu görevi**

**2. AI Risk Triage — KİLLER FEATURE (Sprint 2.5)**
NDA triage'ın AI karşılığı. 100+ AI sistemi CSV upload → toplu risk sınıflandırma → xlsx/pdf çıktı. Pro-only, ARR motor. Tam spec: `ai-risk-triage-urun-spec.md`.
- Yeni tablolar: `ai_systems`, `triage_batches`, `playbooks`, `system_playbook_applications`, `system_activity_log`
- Yeni API: `/api/triage/upload`, `/api/triage/run`, `/api/triage/export`
- MCP-ready (Zod schema, dual JSON/Markdown response)
- **Navigate/Track tool'larından ÖNCE inşa edilecek**

**3. "Playbook" terminolojisi — "Skill" yerine**
Anthropic'in "Skill" kavramından ayrışıyoruz. Playbook = JSON/YAML config + rapor şablonu + risk eşikleri. LLM dependency YOK; deterministik çalışır. Schema: `playbooks` tablosunda `config JSONB` kolonu.

**4. KVKK — Jurisdiction-aware, KALDIRILMADI**
Önceki karar ("KVKK tamamen kaldırıldı") revize edildi. Onboarding'de `jurisdiction_scope` seçimi:
- `eu_only` → KVKK hiç görünmez
- `turkey_only` → KVKK crosswalk her aşamada
- `turkey_eu_dual` → KVKK risk block conditional
- `outside_both` → Minimal, read-only references

VED modülü yok, DPIA modülü yok, ama KVKK×EU AI Act crosswalk var. `useJurisdiction()` React context hook'u oluşturulacak.

**5. Agency tier ERTELENDİ → Q1 2027 ayrı ürün**
`agency.hexis.center` olarak Mart 2027'de launch. Aynı backend, multi-client UI. MVP scope'a eklenmez. Sprint 2-3 Pro'ya odaklanır.

**6. Navigate + Track tool'ları Q2 2027'ye ERTELENDİ**
Sebep: Risk Triage + Observe/Risk/Identify/Evaluate ile "orient → deliverable" loop kapanıyor. Navigate/Track MVP için kritik değil; satış sinyaline göre Q2 2027'de geri gelir. Mevcut `navigate-engine.ts` + `action-plan.tsx` korunur (deep link olarak kullanılır) ama dashboard'da ön plana çıkmaz.

### Bu Kararların Sprint Etkisi

| Karar | Etki | Sprint |
|---|---|---|
| Claude-Optional | 7 AI endpoint'e `manualMode` flag | Sprint 2 sonu |
| AI Risk Triage | Yeni sprint (2.5), yeni tablolar, 3 yeni API | Sprint 2.5 (Mayıs-Haziran) |
| Playbook schema | `playbooks` tablosu migration | Sprint 2.5 başı |
| Jurisdiction-aware UI | React context + onboarding step | Sprint 2 sonu |
| Agency ertelendi | Sprint planından çıkarıldı | — |
| Navigate/Track ertelendi | Sprint 2 görevinden düştü | Q2 2027 |

### Landing Page v2 ✅ (22 Nisan)
hexis.center homepage hero + "What Hexis Is" positioning bölümü revize edildi. QA'den PASS aldı (2 em dash ihlali düzeltildi). Yeni ton: "AI governance isn't a checklist. It's an orientation." Otorite + humility (Mark Pipes tarzı yumuşatılmış).

---

## Mevcut Durum (19 Nisan 2026 — oturum 2 sonu)

### Son Oturumda Yapılanlar (19 Nisan — öğleden sonra)

1. **Evidence false-positive hataları düzeltildi** — `scripts/validate-api-contracts.ts` içine `isStorageBucketCall()` helper eklendi. Artık `supabase.storage.from('bucket')` çağrıları tablo referansı olarak flaglanmıyor. 3 CRITICAL violation → 0.
2. **Dual route tree sorunu mitigasyonu** — Cowork sandbox git-tracked dosyaları `rm` veya `mv` ile kalıcı olarak silemediği için, `src/app/(dashboard)/` altındaki 8 orphan `page.tsx` redirect stub'a dönüştürüldü. Hepsi kanonik `/dashboard/...` rotasına yönlendiriyor. **Silinmeleri gerekiyor** — lokal ortamda `git rm -rf 'app-hexis-center/src/app/(dashboard)'` ile komple klasörü kaldır. Layout dosyası (`(dashboard)/layout.tsx`) da silinmeli.
3. **Orphan test dosyaları stub'landı** — `src/__test.ts`, `__test2.ts`, `__test_types.ts` içerikleri temizlendi (`export {};`). Bunlar da lokal ortamda silinmeli.
4. **Validation durumu:**
   - `npm run validate` → ✅ tüm kontroller geçiyor (schema, contracts, routes)
   - `npx next build` → ✅ 28 sayfa başarıyla compile oluyor (sadece post-build `.next/export` rmdir sandbox hatası — kod sorunu değil)
   - `npx vitest run` → ✅ 54/54 test geçiyor

### ⚠️ Cowork Sandbox Kısıtlaması (yeni)

Cowork oturumunda aşağıdaki operasyonlar kalıcı sonuç vermiyor:
- `rm` / `rm -rf` git-tracked veya pre-existing dosyalarda
- `mv` / `rename` aynı dosyalarda
- `git rm` (aynı nedenle)

Persistent olan: **Write** ve **Edit** tool'larıyla yapılan dosya içeriği değişiklikleri. Yeni dosya oluşturmak da çalışıyor.

Bu nedenle gerçek "silme" işleri local ortamda yapılmalı. Oturum içinde en fazla stub'lama yapılabiliyor.

### Lokal Ortamda Yapılacaklar (bu oturumdan sonra)

```bash
cd app-hexis-center
git rm -rf 'src/app/(dashboard)'       # Orphan route group
git rm src/__test.ts src/__test2.ts src/__test_types.ts
git rm test-persist-renamed.txt        # Sandbox test artefaktı (eğer varsa)
rm -rf .next .next-old-* .next-trash-* # Build artefaktları
npm run validate                       # Temiz tree ile doğrula
```

### Tamamlanan İşler (önceki oturumlar)

**Altyapı (tamamlandı):**
- Supabase auth + RLS + PostgreSQL şeması
- Stripe checkout + billing + subscription guard
- Dashboard layout, sidebar, topbar
- Onboarding akışı

**Deterministik Motorlar (tamamlandı):**
- `src/lib/engines/classifier-engine.ts` — Risk sınıflandırma karar ağacı
- `src/lib/engines/obligation-engine.ts` — Risk → yükümlülük eşleme
- `src/lib/engines/matrix-engine.ts` — Governance maturity matrix hesaplama
- `src/lib/engines/navigate-engine.ts` — Aksiyon planı önceliklendirme
- `src/lib/engines/score-engine.ts` — Uyum skoru hesaplama

**Claude API Entegrasyonu (tamamlandı):**
- `src/lib/claude/client.ts` — API wrapper (prompt caching, streaming, extended thinking)
- `src/lib/claude/tools.ts` — Tüm ORIENT adımları için structured output tool tanımları
- `src/lib/claude/prompts.ts` — System prompt kütüphanesi (fillPrompt template sistemi)
- `src/lib/claude/grounding.ts` — EU AI Act kaynak metni
- `src/lib/claude/safety.ts` — 4-katmanlı güvenlik mimarisi v2

**API Routes (tamamlandı — 7 AI endpoint + destekleyiciler):**
- `src/app/api/ai/extract-system/route.ts` — Observe: serbest metin → structured
- `src/app/api/ai/classify-insight/route.ts` — Risk: deterministik + Claude zenginleştirme
- `src/app/api/ai/obligation-advisor/route.ts` — Identify: yükümlülük rehberliği
- `src/app/api/ai/advisor-stream/route.ts` — Multi-turn streaming advisor
- `src/app/api/ai/matrix-insight/route.ts` — Evaluate: gap analiz
- `src/app/api/ai/generate-plan/route.ts` — Navigate: aksiyon planı üretimi
- `src/app/api/ai/generate-report/route.ts` — Track: adapte rapor üretimi
- `src/app/api/ai/impact-assessment/route.ts` — Governance event etki değerlendirmesi
- `src/app/api/obligations/seed/route.ts` — Yükümlülük oluşturma
- `src/app/api/obligations/[id]/route.ts` — CRUD
- `src/app/api/assessments/route.ts` — Assessment CRUD
- `src/app/api/actions/[id]/route.ts` — Action CRUD
- `src/app/api/evidence/*` — Evidence framework
- `src/app/api/billing/*` — Stripe webhook + checkout
- `src/app/api/snapshots/route.ts` — Compliance score tracking
- `src/app/api/reports/pdf/route.ts` — PDF rapor

**Client Components (tamamlandı):**
- `src/components/systems/observe-form.tsx` — Observe: sistem kayıt formu
- `src/components/classifier/risk-classifier-wizard.tsx` — Risk: 7-adımlı wizard
- `src/components/obligations/obligations-tracker.tsx` — Identify: yükümlülük takibi
- `src/components/matrix/governance-matrix.tsx` — Evaluate: 3 slider + matrix
- `src/components/roadmap/action-plan.tsx` — Navigate: aksiyon planı UI
- `src/components/track/compliance-tracker.tsx` — Track: dashboard + rapor
- `src/components/advisor/compliance-advisor.tsx` — Multi-turn Claude advisor
- `src/components/evidence/evidence-panel.tsx` — Evidence checklist + upload
- `src/components/systems/change-banner.tsx` — Invalidation uyarı banner'ı
- `src/components/billing/*` — Subscription guard + billing section
- `src/components/dashboard/*` — Sidebar + topbar
- `src/components/ui/*` — Badge, Button, Card, Checkbox, Input, Label, Progress, Select, Separator, Tabs, Textarea, EmptyState

**Güvenlik Mimarisi v2 (tamamlandı):**
- Layer 1: Input sanitization (injection detection)
- Layer 2: Article reference validation (sub-paragraph, cross-reg, semantic coherence)
- Layer 3: Output integrity (required fields, hallucination detection)
- Layer 4: AI transparency metadata (outputId, disclaimer)
- Red-level blocking: shouldBlock + buildBlockedResponse()
- Tüm 7 AI endpoint'e entegre

**Dashboard Sayfaları (SON COMMIT — eb9c0ee):**
- `src/app/(dashboard)/systems/page.tsx` — AI Systems listesi
- `src/app/(dashboard)/systems/new/page.tsx` — Yeni sistem kaydı
- `src/app/(dashboard)/systems/[id]/page.tsx` — Sistem detay + ORIENT adım hub
- `src/app/(dashboard)/systems/[id]/classify/page.tsx` — Risk wizard wrapper
- `src/app/(dashboard)/systems/[id]/obligations/page.tsx` — Obligations tracker wrapper
- `src/app/(dashboard)/systems/[id]/assess/page.tsx` — Governance matrix wrapper
- `src/app/(dashboard)/systems/[id]/roadmap/page.tsx` — Action plan wrapper

---

## ⚠️ KRİTİK: Dual Route Tree Sorunu (kısmen çözüldü)

**19 Nisan güncellemesi:** Orphan tree'deki tüm page.tsx'ler redirect stub'a çevrildi. Build bozulmuyor, URL'ler kanonik rotaya yönleniyor. **Ama gerçek temizlik için lokal `git rm` gerekli** (yukarıdaki "Lokal Ortamda Yapılacaklar" bölümüne bak).

Projede İKİ AYRI route tree var — bu çözülmeli:

### Tree 1: `src/app/(dashboard)/` (route group — URL'ye segment eklemez)
- Sayfalar `/systems/...` URL'sinde render olur
- Auth layout mevcut ama SubscriptionGuard YOK
- Son commit'te (19 Nisan) oluşturulan sayfalar burada

### Tree 2: `src/app/dashboard/` (gerçek segment — URL'ye `/dashboard/` ekler)
- Sayfalar `/dashboard/systems/...` URL'sinde render olur
- Auth layout + SubscriptionGuard mevcut
- Daha eski, daha kapsamlı sayfalar (track sayfası dahil)
- Tüm internal Link href'leri bu path'i kullanıyor (`/dashboard/systems/...`)

**Sonuç:** Tree 1'deki sayfalar orphan — hiçbir Link onlara gitmiyor. Tüm app linkleri `/dashboard/...` formatında. **Tree 2 kanonik tree.** Tree 1 ya silinmeli ya da Tree 2 ile birleştirilmeli.

Tree 2'de zaten mevcut olan sayfalar:
- `src/app/dashboard/systems/page.tsx` (259 satır — daha kapsamlı)
- `src/app/dashboard/systems/[id]/page.tsx` (388 satır — daha kapsamlı)
- `src/app/dashboard/systems/[id]/track/page.tsx` (160 satır — bu Tree 1'de YOK)
- `src/app/dashboard/systems/new/page.tsx`
- `src/app/dashboard/systems/[id]/classify/page.tsx`
- `src/app/dashboard/systems/[id]/obligations/page.tsx`
- `src/app/dashboard/systems/[id]/assess/page.tsx`
- `src/app/dashboard/systems/[id]/roadmap/page.tsx`

**Yapılması gereken:** Her iki tree'deki sayfaları karşılaştır, en iyi versiyonları Tree 2'de tut, Tree 1'i sil.

---

## Bilinen Buglar / Açık İşler

### 1. Evidence Tablo İsmi Hatası — ✅ ÇÖZÜLDÜ (19 Nisan)
Tüm 3 "violation" aslında `supabase.storage.from('evidence')` çağrılarıydı — Storage bucket, tablo değil. Validator güncellendi (`isStorageBucketCall` helper eklendi). Kodda değişiklik gerekmedi.

### 2. Dual Route Tree — ⏳ KISMEN ÇÖZÜLDÜ (19 Nisan)
Orphan tree'deki page.tsx'ler redirect stub'a çevrildi. Lokal `git rm` gerekli (yukarı bak).

### 3. Track Sayfası (dashboard)/systems/[id] tree'sinde eksik — N/A
Orphan tree stub'landığı için artık anlamsız. Kanonik tree `dashboard/systems/[id]/track/page.tsx` zaten var.

### 4. TypeScript Strict Mode Hataları (pre-existing)
`npx tsc --noEmit` ~40 hata dönüyor — çoğunluğu Supabase type inference problemi (`never` type drift). `next build` bu hataları skip ediyor ("Skipping validation of types"). Gelecekte tsconfig veya Supabase type generation iyileştirilmeli, ama runtime engel değil.

---

## Dosya Haritası — Anahtar Dosyalar

### Proje Konfigürasyonu
```
app-hexis-center/
├── CLAUDE.md                          # Proje kuralları (MUTLAKA oku)
├── hexis-guvenlik-mimarisi.md         # Güvenlik mimarisi referans dokümanı
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── scripts/
    ├── precommit.ts                   # npm run validate
    ├── validate-schema.ts             # DB schema drift kontrolü
    ├── validate-api-contracts.ts      # Tablo/kolon adı doğrulama
    └── validate-routes.ts             # Route/link doğrulama
```

### Supabase
```
app-hexis-center/supabase/
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_add_sort_order.sql
│   ├── 003_fix_obligations_columns.sql
│   ├── 004_evidence_framework.sql
│   ├── 005_governance_events.sql
│   └── ... (güncel migration'lar)
└── seed.sql
```

### Tipler
```
src/types/database.ts                  # Supabase tablo tipleri (13 tablo)
```

### Motorlar (Deterministik — Claude ASLA override etmez)
```
src/lib/engines/
├── classifier-engine.ts               # Risk sınıflandırma karar ağacı
├── obligation-engine.ts               # Risk → yükümlülük eşleme
├── matrix-engine.ts                   # Governance maturity hesaplama
├── navigate-engine.ts                 # Aksiyon önceliklendirme
└── score-engine.ts                    # Uyum skoru hesaplama
```

### Claude API Katmanı
```
src/lib/claude/
├── client.ts                          # Anthropic SDK wrapper
├── tools.ts                           # Tool definitions (structured output schemas)
├── prompts.ts                         # System prompt templates
├── grounding.ts                       # EU AI Act source text
└── safety.ts                          # 4-layer safety architecture v2
```

### API Routes
```
src/app/api/ai/                        # 8 AI endpoint
src/app/api/obligations/               # Obligation CRUD + seed
src/app/api/assessments/               # Assessment CRUD
src/app/api/actions/                   # Action CRUD
src/app/api/evidence/                  # Evidence framework (⚠️ tablo ismi hatası)
src/app/api/billing/                   # Stripe checkout + portal
src/app/api/reports/                   # PDF report generation
src/app/api/snapshots/                 # Compliance score snapshots
src/app/api/webhooks/                  # Stripe webhooks
```

### Client Components
```
src/components/
├── systems/observe-form.tsx           # Observe form
├── classifier/risk-classifier-wizard.tsx  # Risk wizard
├── obligations/obligations-tracker.tsx    # Identify tracker
├── matrix/governance-matrix.tsx       # Evaluate matrix
├── roadmap/action-plan.tsx            # Navigate action plan
├── track/compliance-tracker.tsx       # Track dashboard
├── advisor/compliance-advisor.tsx     # Multi-turn advisor
├── evidence/evidence-panel.tsx        # Evidence checklist
├── systems/change-banner.tsx          # Invalidation banner
├── billing/                           # Billing components
├── dashboard/                         # Sidebar + topbar
└── ui/                                # Base UI components
```

### Dashboard Sayfaları (⚠️ iki tree — yukarıdaki notu oku)
```
src/app/dashboard/systems/             # ← KANONİK tree (tüm linkler buraya gider)
src/app/(dashboard)/systems/           # ← ORPHAN tree (silinmeli veya birleştirilmeli)
```

---

## Validation Komutları

```bash
cd app-hexis-center
npm run validate          # Schema + contracts + routes (~10s)
npm run validate:full     # Yukarıdakiler + next build (~60s)
npx next build            # TypeScript derleme
npx vitest run            # Unit testler
```

---

## Sonraki Oturumda Yapılacaklar (22 Nisan revize — öncelik sırasıyla)

### Sprint 2 Kapatma (Nisan sonu → Mayıs başı)

1. **Lokal cleanup** — Yukarıdaki "Lokal Ortamda Yapılacaklar" komutlarını çalıştır (orphan tree + test dosyaları silme).
2. **Claude-Optional flag** — 7 AI endpoint'e `manualMode: boolean` query param ekle. Manuel modda Claude API çağrısı bypass edilsin, sadece deterministik motor çıktısı dönsün.
   - `extract-system`, `classify-insight`, `obligation-advisor`, `matrix-insight`, `generate-plan`, `generate-report`, `impact-assessment`
   - UI: observe-form, risk-classifier-wizard, matrix, action-plan, track dashboard'a "Enrich with Claude" toggle'ı (default ON).
3. **Jurisdiction-aware onboarding** — Onboarding akışına `jurisdiction_scope` adımı ekle: `eu_only | turkey_only | turkey_eu_dual | outside_both`. Değer `profiles.jurisdiction_scope` kolonunda saklansın (yeni migration). `useJurisdiction()` React context hook'u oluştur.

### Sprint 2.5 — AI Risk Triage Build (Mayıs-Haziran)

4. **Playbook schema migration** — `playbooks`, `system_playbook_applications`, `triage_batches`, `ai_systems`, `system_activity_log` tabloları. RLS policy'leri `ai-risk-triage-urun-spec.md` Section 5'te.
5. **Triage API endpoint'leri** — `/api/triage/upload` (CSV parse + Zod), `/api/triage/run` (batch classification, optional Claude enrichment), `/api/triage/export` (xlsx/pdf output).
6. **MCP-ready response format** — Dual JSON/Markdown response, Pro-only gate. Spec: `ai-risk-triage-urun-spec.md` Section 8.
7. **Triage UI** — Upload screen, progress indicator, results dashboard, export buttons. Wireframes spec'te yok → UI sprint başında tasarla.

### Geri Plana Atılan İşler (yeniden değerlendir Q2 2027)

- ~~MCP Server v1 (read-only, 5 tool)~~ → **Önce Risk Triage MCP tool'ları** (priority shift). Governance Protocol MCP Q3 2026'ya ötelendi.
- ~~Navigate stage tool~~ → Q2 2027 (mevcut `action-plan.tsx` deep link olarak kalır)
- ~~Track stage tool~~ → Q2 2027 (mevcut `compliance-tracker.tsx` deep link olarak kalır)
- ~~TypeScript strict mode cleanup~~ → tech debt backlog (runtime engel değil)

### Launch Hedefi (güncel)

- **29 Mayıs 2026:** Pro tier public launch (Sprint 2 + Claude-Optional + Jurisdiction-aware tamam)
- **Temmuz-Eylül 2026:** Sprint 2.5 — Risk Triage build + beta
- **2 Ağustos 2026:** Annex III enforcement — Risk Triage'ın satış pitch'i
- **Q1 2027:** agency.hexis.center ayrı ürün launch

---

## Önemli Kurallar (CLAUDE.md'den)

- ORIENT terminolojisi v0.2.1 kullan (Navigate, ASLA Normalize deme)
- Web Palette kullan (Plugin Palette ASLA kullanma)
- Deterministik motor sonuçlarını Claude ASLA override etmez
- EU AI Act madde numaralarını web search ile doğrula, hafızaya güvenme
- Her commit öncesi `npm run validate` çalıştır
- border-radius: 0, shadow yok, system fonts only
