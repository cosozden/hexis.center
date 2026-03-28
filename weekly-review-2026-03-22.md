# HEXIS Haftalık Sprint Review
**Tarih:** 22 Mart 2026 (Pazar) | **Hafta:** 16–22 Mart 2026

---

## 1. BU HAFTA YAPILANLARI

### Git Commits (15–22 Mart)
Bu hafta **22 commit** yapıldı — son derece yoğun bir hafta.

**Pzt 16 Mart** (7 commit):
- Gölge Yapay Zeka blog yazısı yayınlandı (`golge-yapay-zeka-kobilerin-gorunmeyen-riski`)
- Newsletter signup formu eklendi (Beehiiv + Plausible event)
- ORIENT v1.0 metodoloji sayfaları yeniden yazıldı (EN + TR)
- TR|EN dil seçici navbar'a eklendi
- Observe form v2 tamamlandı (4 grup + KVKK bloğu)
- Plausible custom events (generator + checklist)
- Metodoloji navbar etiketleri iyileştirildi

**Sal 17 Mart** (7 commit):
- **Risk Classifier v2 tamamlandı** — Art. 6(3) exception, KVKK bloğu, pre-assessment sinyalleri
- RSS feed XSLT stylesheet eklendi
- Sprint2: Identify + Evaluate stage entegrasyonu, ORIENT nav tutarlılığı
- GSC indexing otomasyonu (gsc-indexing.py, IndexNow key)
- GitHub Actions workflow (GSC + IndexNow otomasyonu)
- SEO: Türkçe meta tag'ler, internal linkler, sitemap öncelikleri

**Çar 18 Mart** (1 commit):
- **KVKK Etken Yapay Zeka Rehberi blog yazısı** yayınlandı (`kvkk-etken-yapay-zeka-rehberi-sirketler-nasil-hazirlanmali`)

**Cum 20 Mart** (1 commit):
- SEO haftalık sağlık düzeltmesi: broken link'ler, sitemap/feed eksik entry, OG tag'ler

### Blog Yazıları (Bu Hafta)
- ✅ **Yeni:** Gölge Yapay Zeka — KOBİ'lerin Görünmeyen Riski (Pzt 16)
- ✅ **Yeni:** KVKK Etken Yapay Zeka Rehberi — Şirketler Nasıl Hazırlanmalı? (Çar 18)
- **Toplam yayınlanan blog:** 9 yazı (son 2 bu hafta)

Blog dizinleri: `ai-okuryazarligi-madde-4`, `chatgpt-kvkk-yurt-disi-aktarim`, `etken-yapay-zeka-kisisel-verilere-etkisi`, `eu-ai-act-risk-siniflandirmasi`, `golge-yapay-zeka-kobilerin-gorunmeyen-riski`, `gpai-kurallari-madde-51-56`, `iso-42001-governance-olgunlugu`, `kvkk-etken-yapay-zeka-rehberi-sirketler-nasil-hazirlanmali`, `kvkk-yapay-zeka-bes-yil-on-iki-yukumluluk`

### LinkedIn Durumu
3 gönderi planlandı (haftalık plan: 2026-03-18):
- **Pzt (17 Mart):** Digital Omnibus — Konsey pozisyonu → `status: ready` ✅
- **Çar (18 Mart):** KVKK Agentic AI — 7 Kritik Soru (carousel) → `status: ready` ✅
- **Cum (20 Mart):** AI Envanteri engagement postu → `status: ready` ✅

> ⚠️ **Not:** Gönderilerin gerçekten yayınlanıp yayınlanmadığı doğrulanamıyor (LinkedIn API erişimi yok). Taslaklar hazır, yayın durumu manuel kontrol gerektirir.

---

## 2. SPRINT PLANIYLA KARŞILAŞTIRMA

Sprint 2 hedefleri (CLAUDE.md, Bölüm 11):

| Hedef | Durum | Not |
|-------|-------|-----|
| Observe form v2 (4 grup + KVKK) | ✅ TAMAMLANDI | Pzt 16 Mart |
| Risk Classifier v2 (Art. 6(3), Art. 50(3), KVKK) | ✅ TAMAMLANDI | Sal 17 Mart |
| Identify stage (checklist risk-level filtering) | ⏳ DEVAM EDİYOR | Sprint2 commit var ama filtering tam değil |
| Evaluate stage (FRIA + Governance Matrix) | ⏳ KALDI | Sprint2 nav entegrasyonu yapıldı, FRIA oluşturulmadı |
| Navigate stage tool | ⏳ KALDI | Araç yok, oluşturulması gerekiyor |
| Track stage tool | ⏳ KALDI | Araç yok, oluşturulması gerekiyor |
| FRIA template (Art. 27) | ⏳ KALDI | - |
| Technical documentation template (Art. 11 + Annex IV) | ⏳ KALDI | - |
| Conformity assessment guidance (Art. 43) | ⏳ KALDI | - |
| Post-market monitoring plan template (Art. 72) | ⏳ KALDI | - |
| Three-tool integration (Classifier → Generator → Checklist) | ⏳ KALDI | Classifier → Generator bağlı, Generator → Checklist yok |

**Sprint 2 özeti:** Haftanın başında yoğun teknik çalışma yapıldı. Temel altyapı (Observe + Risk) tamamlandı. Evaluate ve sonrası için daha çok zaman gerekiyor.

---

## 3. GELECEK HAFTA (23–29 Mart)

### Sprint'ten Kalan En Öncelikli 3 Görev

**1. Generator → Checklist bağlantısı (Üç-Araç Entegrasyonu)**
- Etki: Kullanıcı deneyimini tamamlıyor — "Risk nedir?" → "Neredeyim?" → "Ne yapmalıyım?" akışı
- Checklist'te risk-level filtering (High-risk → 23 madde, Minimal → Section 1+6)
- Tahmini: ~4 saat

**2. Navigate Stage Tool (yeni araç)**
- Etki: ORIENT akışındaki en büyük boşluk — kullanıcıya "ne yapmalı" sorusunu yanıtlıyor
- Basit başlangıç: Aksiyon planı oluşturucu, risk seviyesine göre öneriler
- Tahmini: ~5 saat

**3. FRIA Template (Art. 27)**
- Etki: Yüksek riskli AI kullananlar için zorunlu belge — danışmanlık hizmeti için de giriş kapısı
- Yüksek riskli sistemler için pre-filled template formu
- Tahmini: ~3 saat

**Toplam tahmini:** ~12 saat → Haftaya bölünürse günde ~2 saat.

### Bonus (varsa zaman)
- Track stage tool
- Technical documentation template (Art. 11)
- SEO: İngilizce makale ekleme (keyword arbitraj)

---

## 4. AIGP PROGRESS

### Bu Haftaki Çalışma
Study log'a göre:
- **Gün 1 (19 Mart):** KVKK Temelleri (Madde 1-3) — tamamlandı ✅
  - Pseudonymization ≠ anonimleştirme ayrımı
  - Madde 4 (ilkeler) vs Madde 5 (işleme şartları)
  - Meşru menfaat + makul beklenti testi
  - E-ticaret AI senaryosu analizi

### Çalışma Değerlendirmesi
- Haftalık hedef: 5-6 saat (study-plan.md'ye göre)
- Gerçekleşen: 1 oturum (Gün 1) — site geliştirme yoğunluğu nedeniyle düşük
- AIGP planı: Hafta 3'e denk geliyor (Domain II: Laws & Frameworks — GDPR/AI, IP, ayrımcılık)
- **Zayıf alan (henüz çalışılmadı):** Domain II (19-23 soru) ve Domain III (21-25 soru) — sınavın ağırlık merkezi

### Öneri
Gelecek hafta en az 3 AIGP çalışma oturumu (Gün 2: Madde 4-5-6, Gün 3: Madde 10-11, Gün 4: Madde 12-14).

---

## 5. METRİKLER

> ⚠️ Site traffic, keyword ranking ve Google Search Console verileri bu oturumda erişilemedi (Plausible + GSC API bağlantısı yok). Manuel kontrol gerekiyor.

**Kontrol edilmesi gerekenler:**
- Plausible Analytics: `hexis.center` dashboard'ı — bu haftanın pageview ve unique visitor sayısı
- Google Search Console: Impression ve CTR trendi — `gsc-indexing.py` ile indexlenen URL'lerin durumu
- En çok okunan blog: Gölge Yapay Zeka veya KVKK ChatGPT yazısı muhtemelen öne çıkıyor (trend konular)

---

## ACTIONABLE NEXT STEPS

**Hemen bu hafta (Pazartesi önceliği):**

1. **LinkedIn gönderilerini kontrol et** — 3 taslak hazır, yayınlanıp yayınlanmadığını doğrula
2. **Generator → Checklist bağlantısını kodla** — en kritik UX boşluğu, Sprint 2'nin bitiş koşulu
3. **AIGP Gün 2 çalışması yap** — Madde 4-5-6 (domain II hazırlığı)
4. **Plausible + GSC kontrol et** — bu haftanın traffic etkisini ölç (2 blog + SEO optimizasyonu yapıldı)
5. **Navigate tool için wireframe yap** — önce akış kağıda, sonra koda

---

*Rapor otomatik olarak üretildi — 22 Mart 2026, hexis-weekly-review scheduled task*
