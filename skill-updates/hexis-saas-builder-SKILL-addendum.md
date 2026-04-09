# hexis-saas-builder SKILL.md — Addendum (9 Nisan 2026)

> Bu dosya mevcut hexis-saas-builder SKILL.md'nin sonuna eklenmesi gereken yeni bölümleri içerir.

---

## GovOps Altyapısı (Dönem 2 Temeli — 9 Nisan 2026)

### Üç Dönem Çerçevesi ve SaaS İlişkisi

Hexis'in stratejik yol haritası üç döneme ayrıldı. SaaS builder olarak Dönem 1 ürünü inşa ediyoruz, Dönem 2'ye kapı açan minimal altyapı ile:

| Dönem | SaaS Etkisi | Builder Yaklaşımı |
|-------|------------|-------------------|
| Dönem 1 (Checkbox) | 6 ORIENT adımlı self-serve platform | ✅ Tamamlandı |
| Dönem 2 (GovOps) | Event-driven, continuous monitoring, API | Minimal altyapı şimdi, tam implementasyon sonra |
| Dönem 3 (Otonom) | Autonomous agents | Mimari kararlar sonra |

### Yeni Dosyalar (Commit edildi, push'landı)

| Dosya | Konum | İşlev |
|-------|-------|-------|
| `invalidation-config.ts` | `src/lib/config/` | ORIENT adımlar arası etki haritası — hangi adım değişince hangi adımlar invalidate olur |
| `orient-guides.ts` | `src/lib/config/` | Her ORIENT adımı için başlangıç rehberi (başlık, açıklama, neden önemli, ipuçları, süre) |
| `003_govops_foundation.sql` | `supabase/migrations/` | governance_events tablosu + next_review_date sütunları |

### governance_events Tablosu

```sql
create table governance_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  system_id uuid references ai_systems(id) on delete cascade not null,
  event_type text not null,  -- assessment_updated, obligation_completed, etc.
  orient_step text not null, -- observe, risk, identify, evaluate, navigate, track
  actor_id uuid references profiles(id),
  previous_value jsonb,      -- önceki durum
  new_value jsonb,           -- yeni durum
  metadata jsonb default '{}',
  created_at timestamptz default now()
);
-- Immutable — güncelleme/silme yok, sadece INSERT
```

### Invalidation Config Mimarisi

3 katmanlı invalidation:
1. **Deterministik:** `invalidation-config.ts` — observe değişirse → risk + identify invalidate
2. **Claude Değerlendirme:** API endpoint — "Bu değişiklik etkili mi?"
3. **Banner Bildirimi:** UI'da "Bu adım güncel olmayabilir" uyarısı

### ORIENT Adımları — Güncel Durum (9 Nisan)

| Adım | Motor | API | UI | Durum |
|------|-------|-----|-----|-------|
| Observe | — | extract-system | ✅ | Complete |
| Risk | classifier-engine.ts | classify-insight | ✅ | Complete |
| Identify | obligation-engine.ts | obligation-advisor | ✅ | Complete |
| Evaluate | matrix-engine.ts | matrix-insight | ✅ | Complete (3 bug fix) |
| Navigate | navigate-engine.ts | generate-plan | ✅ | Complete |
| Track | score-engine.ts | generate-report + snapshots | ✅ | Complete |

### Proje Yapısı Güncellemesi

```
app-hexis-center/src/
├── lib/
│   ├── config/                        # YENİ
│   │   ├── invalidation-config.ts     # ORIENT etki haritası
│   │   └── orient-guides.ts           # Adım kaynak rehberi
│   ├── engines/
│   │   ├── classifier-engine.ts       # Risk sınıflandırma
│   │   ├── matrix-engine.ts           # Governance matrix
│   │   ├── obligation-engine.ts       # Yükümlülük eşleme
│   │   ├── navigate-engine.ts         # Aksiyon planı bağlam üretimi
│   │   └── score-engine.ts            # Uyum skoru hesaplama
├── components/
│   ├── track/                         # YENİ
│   │   └── compliance-tracker.tsx     # Track adımı UI
├── app/
│   ├── api/
│   │   ├── snapshots/route.ts         # YENİ — snapshot CRUD
│   │   └── ai/generate-report/route.ts # YENİ — Claude rapor üretimi
│   └── dashboard/systems/[id]/
│       └── track/page.tsx             # YENİ — Track sayfası
```

### Bekleyen Teknik İşler

| İş | Öncelik | Not |
|----|---------|-----|
| Supabase migration 003 çalıştırma | Yüksek | governance_events + next_review_date |
| Stripe ödeme entegrasyonu | Yüksek | €9 intro → €29 geçiş |
| MCP Server v1 | Orta | Read-only, 5 tool |
| Onboarding akışı | Orta | "3 adımda başlayın" |
| Trust sayfası | Orta | Lansman öncesi |
| PDF rapor generator | Düşük | Server-side, Hexis markalı A4 |
