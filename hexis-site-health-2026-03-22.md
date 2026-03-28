# hexis.center Site Health Report
**Date:** 2026-03-22
**Pages scanned:** 25 HTML files
**Status: 3 issues found**

---

## 🟡 Issues

### 1. Blog: JSON-LD Eksik
**File:** `/blog/kvkk-etken-yapay-zeka-rehberi-sirketler-nasil-hazirlanmali/index.html`
**Sorun:** Bu blog sayfasında hiç `application/ld+json` structured data bloğu yok. Diğer tüm blog sayfalarında `BlogPosting` şeması mevcut.
**Etki:** Google Search bu sayfayı makale olarak tanımayabilir; rich result kaybı.
**Düzeltme:** Diğer blog sayfalarından `BlogPosting` JSON-LD şemasını kopyalayıp adapte et (title, description, datePublished, url güncelle).

---

### 2. metodoloji/en/index.html — Sitemap'te Yok & OG Tag Eksik
**File:** `/metodoloji/en/index.html`
**Sorun 1:** Sayfa sitemap.xml'de listelenmiyor.
**Sorun 2:** OG title/description/image tag'leri eksik (meta description var, og yok).
**Sorun 3:** Hiçbir sayfadan bu URL'e link verilmiyor — orphan page.
**Etki:** Google bu sayfayı bulmakta zorlanır; sosyal paylaşımda önizleme çıkmaz.
**Düzeltme:** (a) Sitemap'e ekle, `lastmod: 2026-03-22`, (b) OG tagları ekle, (c) `/metodoloji/` sayfasına `<link rel="alternate" hreflang="en">` zaten var ama sayfanın kendisi doğrusal olarak linklenmiyor — `/methodology/` veya `/metodoloji/` sayfasına dil geçiş linki eklenebilir.

---

### 3. robots.txt: /assets/ Disallow — Muhtemelen Hatalı
**Sorun:** `Disallow: /assets/` kuralı Googlebot'un OG görselleri (`/assets/og-hexis.png`) ve logo dosyalarını crawl etmesini engelliyor. Social media crawler'ları da bu dosyalara erişemez.
**Etki:** Paylaşımlarda OG image görünmeyebilir; Google'ın site görselleri indekslemesi engellenir.
**Düzeltme:** `Disallow: /assets/` satırını robots.txt'den kaldır. Korunması gereken özel bir dosya varsa tek tek ekle.

---

## ✅ Temiz

- **Internal links:** 25 dosyada kırık link yok
- **Meta description:** Tüm sayfalarda mevcut (carousel.html hariç — robots.txt ile disallow edilmiş, OK)
- **OG tags:** Tüm sayfalarda tam (`/kvkk-eu-ai-act/carousel.html` ve `/metodoloji/en/` hariç — ikincisi sorun #2)
- **Canonical URL:** Tüm sayfalarda mevcut
- **JSON-LD:** 24/25 sayfada geçerli (sorun #1 hariç)
- **Sitemap URL'leri:** Listedeki 23 URL'in tamamı gerçek dosyaya karşılık geliyor
- **Blog feed.xml:** 10 blog yazısının tamamı feed'de — güncel
- **lastmod tarihleri:** 2 blog yazısı 32 gün eski (`eu-ai-act-risk-siniflandirmasi`, `iso-42001-governance-olgunlugu`) — minor, düzeltmek zorunlu değil
- **_drafts:** 1 taslak var (`aipa-yapay-zeka-etik-rehberi-inceleme.md`) — makul uzunlukta, yayına hazır görünüyor; senin kararın

---

## Özet Aksiyon Listesi

| Öncelik | Dosya | Aksiyon |
|---------|-------|---------|
| 🟡 Orta | `robots.txt` | `/assets/` Disallow satırını kaldır |
| 🟡 Orta | `/blog/kvkk-etken.../index.html` | BlogPosting JSON-LD bloğu ekle |
| 🟡 Orta | `/metodoloji/en/index.html` | OG tagları ekle + sitemap'e ekle |
| 🟢 Düşük | `sitemap.xml` | 2 blog yazısının lastmod'unu güncelle |
| 🟢 Düşük | `_drafts/aipa-...` | Yayın kararı ver |
