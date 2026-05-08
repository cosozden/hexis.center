---
name: hexis-blog-formatter
description: >
  Chat'te yazılan Hexis blog içeriğini hexis.center'a hazır Markdown formatına dönüştürür.
  YAML front matter üretir, Türkçe içerik kurallarını uygular, internal link önerir,
  blog-converter.py ile uyumlu çıktı verir.
  "blog yaz", "blog formatına çevir", "hexis.center'a yayınla", "makaleyi hazırla",
  "blog taslağı", "draft oluştur", "yayına hazırla", "_drafts'a ekle" gibi ifadeler
  geçtiğinde MUTLAKA kullan. İçerik tamamlandığında otomatik olarak öner.
---

# hexis-blog-formatter — Blog İçerik Hazırlama Skill'i

## Görev

Chat'te üretilen Türkçe (veya İngilizce) blog içeriğini `blog/_drafts/yazi-adi.md`
formatına dönüştür. Çıktı doğrudan `blog-converter.py` ile işlenebilir olmalı.

---

## Yazı Tonu & Ses — HEXIS Blog Kimliği

### Temel İlke
Hexis blog yazıları bir uzmanın deneyimini paylaşması gibi olmalı: teknik derinliği olan ama okuyucuyu dışlamayan, pozisyon alan ama saygılı, öğretici ama yukarıdan bakmayan bir ton. Okuyucu hem güvenilir bilgi aldığını hem de bir insanla konuştuğunu hissetmeli.

### Ton Spektrumu
Blog içeriği LinkedIn'den biraz daha derinlikli ve yapılandırılmış olabilir, ama yine de akademik makale tonundan uzak durmalı:
```
Akademik dergi  ←──── HEXIS BLOG BURADA ────→  Kişisel blog
(çok kuru)        (uzman + samimi + yapılı)     (çok gevşek)
```

### Yazı Tonu Kuralları

**Yapılması gerekenler:**

- Birinci tekil veya çoğul şahıs kullan: "Ben bu konuda..." veya "Biz Hexis olarak..." — kurumsal pasif değil
- Okuyucuya doğrudan hitap et: "Şirketinizde...", "Eğer siz de..." — mesafeyi kapat
- Somut örneklerle aç: Soyut ilkeyi gerçek bir senaryoyla göster — "Örneğin, bir sağlık sektörü şirketi Ek III kapsamında yüksek riskli sayılıyorsa..."
- Kısa cümleler kur: Blog'da da ortalama 15-20 kelime/cümle hedefle. Uzun cümleleri ikiye böl
- Soru sor: Bölüm geçişlerinde okuyucuyu düşündür — "Peki bu pratikte ne anlama geliyor?"
- Geçiş cümleleri kullan: "Ama bir dakika.", "Bunu biraz açalım.", "Asıl kritik nokta şu:"
- Pozisyon al: Hexis net görüş bildirir — "Bize göre asıl mesele...", "Bu yaklaşımın eksik kaldığı nokta..."
- Deneyimden bahset: "ISO 42001 implementasyonu sırasında gördüğümüz en yaygın hata..."
- Empati kur: "Bu karmaşık gelebilir. Adım adım bakalım."
- Analoji kullan: Teknik kavramları günlük hayattan örneklerle açıkla

**Yapılmaması gerekenler:**

- "Devrim niteliğinde", "çığır açan", "paradigma değişimi" — AI hype dili yasak
- "Malumunuz", "bilindiği üzere" — ukala ton yaratır
- "Tarafımızca değerlendirilmektedir" — bürokratik dil, aktif cümleye çevir
- "Siz değerli okuyucularımız" — yapay samimiyet, direkt "siz" yeterli
- "...yapay zeka çağında..." — klişe açılış, doğrudan konuya gir
- 5+ cümlelik paragraflar — blog'da max 4 cümle/paragraf
- Aşırı pasif yapı — "değerlendirilmektedir" yerine "değerlendiriyoruz"
- Koşullu yumuşatmaların aşırı kullanımı — her cümlede "belki", "muhtemelen" güveni düşürür

### Teknik Derinlik Dengesi
Blog'da LinkedIn'den daha derin gidebilirsin, ama yine de okuyucuyu boğmamak önemli:
```
Yüzeysel      → "AI yasası var, uyum lazım" (değersiz)
HEXIS seviyesi → "Madde 6(2) kapsamında Ek III'te 8 yüksek riskli alan tanımlanmış.
                  Bunlardan biri istihdam. Eğer CV tarama yapan bir AI kullanıyorsanız,
                  2 Ağustos 2026'ya kadar uyum belgelemeniz gerekiyor. Ama
                  bu sadece dokümantasyon meselesi değil: insan gözetimi, veri
                  kalitesi ve risk yönetimi de zorunlu."
Aşırı teknik  → "Art. 6(1)(a) cross-ref Annex I Section A..." (okuyucu kaybeder)
```

### Blog-Spesifik Ton Notları
- Giriş paragrafı okuyucuyu yakalayıcı olmalı — "neden okumalıyım?" sorusuna 2 cümlede cevap ver
- Her bölüm başında kısa bir bağlam cümlesi ekle — okuyucu yazıyı ortasından da okuyabilir
- Sonuç bölümünde net bir çağrı yap — "Özetle şunu yapın" veya "Buradan başlayın"
- Yasal terimleri ilk kullanımda parantezle aç: "*deployer* (kullanıcı kuruluş)"
- Madde numarası verirken bağlam ekle: "Madde 27 — temel haklar etki değerlendirmesi"

### İnsanlaştırma Formülleri
- "Bu soruyu çok alıyoruz: [soru]" — okuyucu yalnız olmadığını hisseder
- "Açıkçası, [itiraf/deneyim]" — kırılganlık güven yaratır
- "Kısa cevap: [cevap]. Ama hikaye burada bitmiyor." — merak uyandırır
- "[Sektör] ile çalışırken fark ettik ki..." — somut deneyim
- "Eğer [okuyucunun durumu] ise, bu yazı tam size göre." — hedefleme

---

## Adım 1 — İçerik Analizi

Kullanıcının verdiği içeriği oku ve şunları tespit et:

- **Dil:** Türkçe mi, İngilizce mi?
- **Konu alanı:** EU AI Act / KVKK / ISO 42001 / ORIENT
- **ORIENT aşaması:** Hangi aşamayla en çok ilgili? (Observe/Risk/Identify/Evaluate/Navigate/Track)
- **Anahtar kelime:** SEO için hedef kelime öner (1-2 seçenek sun)
- **Tahmini okuma süresi:** Kelime sayısına göre hesapla (200 kelime/dakika)

---

## Adım 2 — İçerik Sentaksı Kontrolleri (zorunlu)

İçeriği taramadan önce şu kontrolleri yap:

### Em Dash Yasağı ⚠️ (Türkçe içerikler)
Türkçe metinde şunları ara:
- ` — ` (em dash, boşluklu)
- Cümle ortasında ` - ` (tire, boşluklu)

**Her bulgu için:** Alternatif öner ve düzelt.

| Yasak | Alternatif |
|-------|-----------|
| `X — Y` | `X; Y` veya `X, Y` veya `X: Y` |
| `X - Y` (cümle içi) | Bağlama göre virgül, iki nokta veya parantez |

**İngilizce içeriklerde em dash serbesttir.**

### İtalik Format Kontrolü
*İtalik* kullanımı yalnızca İngilizce teknik terimler için:
- Doğru: `*intended purpose* (tasarım amacı)` — ilk kullanımda parantez içinde Türkçe
- Doğru: `*high-risk*` — sonraki kullanımlarda sadece italik
- Yanlış: Türkçe kelimelerin italik yazılması

Parantez kuralı: Yalnızca Türkçe anlam için. İkinci kez aynı terim geldiğinde parantez yok.

### Anchor Sentaksı Kontrolü ⚠️ (KRİTİK)

`{#anchor-id}` Pandoc/MkDocs anchor sentaksı **yalnızca H2 ve H3 başlıkların sonunda** kullanılabilir. Diğer konumlarda literal text olarak kalır ve okuyucuya görünür — bu KRİTİK bir bug'dır ve marka itibarına zarar verir.

**Olay kaydı (8 May 2026):** `etken-yapay-zeka-kisisel-verilere-etkisi` blog yazısında 8 H2 başlığında `{#anchor-id}` literal text olarak göründü. Sebep: blog-converter.py v1 anchor sentaksını parse etmiyordu. v2+ bu bug'ı çözdü; ayrıca `post_conversion_check()` ile çıktıda literal kaldıysa dosyayı yazmıyor.

**Doğru kullanım:**
- `## Başlık {#anchor-id}` ✅
- `### Alt başlık {#alt-anchor}` ✅

**Yanlış kullanım:**
- Paragraf içinde: `Bu bölümde {#xxx} ...` ❌
- Liste maddesinde: `- Madde {#xxx}` ❌
- Image alt'ında veya link metni içinde ❌

**Anchor ID kuralları:**
- Pattern: `[a-z0-9][a-z0-9-]*` (küçük harf veya rakamla başlar; küçük harf, rakam, tire içerebilir)
- Türkçe karakter **YASAK** — ASCII'ye çevir: `ı→i`, `ğ→g`, `ş→s`, `ç→c`, `ö→o`, `ü→u`
- Boşluk **YASAK** — tire kullan
- Maksimum 50 karakter
- Sayfada benzersiz olmalı — aynı id iki H2'de tekrar etmemeli

**Tarama:**
1. Markdown taslakta `{#` pattern'ini ara
2. Her bulgu için pozisyon kontrol et: H2 (`##`) veya H3 (`###`) satırının sonunda mı?
3. Anchor ID kuralına uyuyor mu?
4. Aynı ID iki yerde tekrar etmiyor mu?

**Converter uyumluluğu:**
- `tools/blog-converter.py` v2+ bu sentaksı parse edip H2/H3'e `id` attribute olarak yansıtır
- v2+ ayrıca `post_conversion_check()` ile çıktıda `{#` literal kalmışsa `sys.exit(2)` ile çıkar — dosya yazılmaz
- v1 kullanılıyorsa anchor sentaksı literal kalır → ÜRETİME ÇIKMA, önce converter'ı güncelle

### Tarama Raporu Formatı

```
İÇERİK SENTAKSI KONTROLLERİ
─────────────────────
Em dash: [Bulunan sayı] — [örnekler ve önerilen düzeltmeler]
İtalik format: [Uygun / Kontrol edilmesi gereken örnekler]
Anchor sentaksı: [Bulunan sayı] — [pozisyon: H2/H3/yanlış]
─────────────────────
Durum: ✅ Temiz / ⚠️ [X] düzeltme gerekiyor
```

---

## Adım 3 — YAML Front Matter Üretimi

```yaml
---
title: "[Başlık — kısa, net, anahtar kelime içeren]"
description: "[Meta description — 120-155 karakter, anahtar kelimeyle başla]"
date: "[YYYY-MM-DD]"
category: "[EU AI Act / KVKK / ISO 42001 / ORIENT]"
orient_stage: "[Observe / Risk / Identify / Evaluate / Navigate / Track / —]"
slug: "[url-dostu-kucuk-harf-tire-ayracli]"
reading_time: "[X dakika]"
---
```

### Slug Kuralları
- Tüm küçük harf
- Boşluk → tire (`-`)
- Türkçe karakter → ASCII: `ı→i`, `ğ→g`, `ü→u`, `ş→s`, `ö→o`, `ç→c`
- Max 50 karakter
- Örnek: "KVKK'nın Görmediği Veri" → `kvkknin-gormedigi-veri`

### Description Kuralları
- 120-155 karakter (Google'ın gösterdiği limit)
- Anahtar kelimeyle veya somut değer vaadiyle başla
- Em dash yasağı burada da geçerli
- Soru formatı işe yarar: "X nedir? Y adımda anlıyorsunuz."

---

## Adım 3.5 — Kaynak Doğrulama ve Referans Ekleme ⚠️ ZORUNLU

**Her blog yazısında uygulanır. Yasal/düzenleyici iddia içermeyen yazılarda bile en az 1 referans eklenir.**

### Tespit Edilecek İddia Tipleri

İçeriği tara, şu tiplerdeki iddiaları listele:

| Tip | Örnek |
|-----|-------|
| EU AI Act madde referansı | "Madde 6 kapsamında...", "Annex III'e göre..." |
| Yürürlük tarihi | "2026'da yürürlüğe giriyor..." |
| Ceza miktarı | "35 milyon euro veya..." |
| KVKK maddesi | "KVKK Madde 5 uyarınca..." |
| KVKK rehber yayım tarihi | "KVKK Şubat 2026'da rehber yayımladı..." |
| ISO standardı | "ISO/IEC 42001..." |
| İstatistik/rakam | "Şirketlerin %67'si..." |
| Kurum açıklaması | "Avrupa Komisyonu'na göre..." |

### Doğrulama Süreci

Her tespit edilen iddia için:

1. `web_search` ile birincil kaynaktan doğrula
2. Kaynağı kaydet: yazar/kurum, başlık, URL, erişim tarihi
3. İçerikteki ifade ile birincil kaynak arasında uyuşmazlık varsa düzelt ve belirt

**Birincil kaynak öncelik sırası:**
- EU AI Act → EUR-Lex (eur-lex.europa.eu) veya artificialintelligenceact.eu
- KVKK → kvkk.gov.tr
- ISO standartları → iso.org
- NIST AI RMF → nist.gov
- Digital Omnibus → EUR-Lex, IAPP
- İstatistikler → Orijinal araştırma kurumu (Eurostat, OECD, vb.)

**Doğrulanamayan iddialar için:** İfadeyi "...olarak değerlendirilmektedir" veya "...öngörülmektedir" şeklinde yumuşat, kaynaksız kesin ifade kullanma.

### Yayım Tarihi vs PDF İç Tarih Ayrımı ⚠️

Resmi belgelerde (KVKK rehberleri, AB direktifleri, ISO standartları) **iki farklı tarih** olabilir:

| Tarih tipi | Tanım | Kullanım |
|------------|-------|----------|
| **Resmi yayım tarihi** | Kurum web sayfasındaki tarih | Blog metninde "yayımladı" ifadesi için kullanılan tarih |
| **PDF iç tarih** | PDF metadata veya kapak sayfasındaki tarih | Hazırlama/onay tarihi — yayım tarihi DEĞİL |

**Olay kaydı (8 May 2026):** Yazı 1'de KVKK Etken AI rehberi için "Şubat 2026" yazıldı (PDF iç tarih), oysa resmi yayım tarihi 12 Mart 2026'ydı. Bu hata birden fazla QA fazını geçti çünkü Faz 2 referans tablosunda "rehber yayım tarihi" satırı yoktu.

**Kural:** "X kurum Y rehber yayımladı" tipindeki ifadeler için **resmi yayım tarihi** kullanılır. PDF iç tarihi farklıysa, yazıda her iki tarihi de belirtmek nüansı korur:
> "Şubat 2026'da hazırlanan ve 12 Mart 2026'da yayımlanan..."

VEYA doğrudan yayım tarihini kullan:
> "KVKK'nın 12 Mart 2026'da yayımladığı..."

### Referans Listesi Formatı

Yazının sonuna ekle:

```markdown
---

## Kaynaklar

1. Avrupa Parlamentosu ve Konseyi. *Regulation (EU) 2024/1689 — Artificial Intelligence Act*. EUR-Lex, 12 Temmuz 2024. [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)

2. Kişisel Verileri Koruma Kurumu. *6698 Sayılı Kişisel Verilerin Korunması Kanunu*. kvkk.gov.tr. [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/6649/6698-SAYILI-KANUN)

3. [Kurum/Yazar]. *[Başlık]*. [Yayın yeri], [Tarih]. [[domain]](URL)
```

**Atıf formatı (metin içinde):**
- İddia cümlesinin sonuna süperskript ekle: `...yükümlülük doğar.¹`
- Birden fazla kaynak: `...değerlendirilmektedir.²·³`

### SEO Değeri

Kaynak listesi şu sinyalleri verir:
- **E-E-A-T** (Experience, Expertise, Authoritativeness, Trustworthiness) — Google'ın kalite değerlendirmesi
- **Dwell time** artışı — okuyucu kaynakları kontrol eder
- **Backlink fırsatı** — resmi kurumlar bazen referans veren içerikleri takip eder

### Doğrulama Raporu Formatı

```
KAYNAK DOĞRULAMA RAPORU
────────────────────────────────
Tespit edilen iddia sayısı: [X]
Doğrulanan: [X] ✅
Yumuşatılan (kaynak bulunamadı): [X] ⚠️
Düzeltilen (hatalı ifade): [X] 🔧
────────────────────────────────
Eklenen referans sayısı: [X]
```

---

## Adım 4 — İçerik Formatlaması

### Markdown Yapısı

```markdown
---
[YAML front matter]
---

## [İlk başlık — H1 yok, blog-converter bunu title'dan üretiyor]

[Giriş paragrafı]

## [İkinci başlık]

[İçerik]

### [Alt başlık — gerekirse]

[İçerik]

## Sonuç

[Kapanış paragrafı]
```

### Hexis İçerik Kuralları
- H1 kullanma — blog-converter `title`'dan üretir
- H2 ile başla
- Her bölüm arası boş satır
- Liste maddeleri `-` ile (yıldız değil)
- **Kalın** yalnızca kritik terimler için
- Kod blokları: ` ``` ` ile

---

## Adım 5 — Internal Link Önerileri

İçerik konusuna göre şu araç sayfalarına link öner:

| Konu | Önerilen Link |
|------|---------------|
| Risk sınıflandırması | `[Risk Classifier](https://hexis.center/generator/)` |
| Uyum kontrol listesi | `[EU AI Act Checklist](https://hexis.center/checklist/)` |
| Temel haklar değerlendirme | `[FRIA Aracı](https://hexis.center/fria/)` |
| Genel uyum | `[Uyum Değerlendirmesi](https://hexis.center/generator/)` |

**Link ekleme kuralı:** Zorlama. Yalnızca içerikle organik bağlantısı varsa ekle.
Her yazıda max 2 internal link.

---

## Adım 6 — Çıktı

Tam Markdown dosyasını şu formatta ver:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEXIS BLOG — DRAFT HAZIR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dosya: blog/_drafts/[slug].md
Kategori: [kategori]
ORIENT Aşaması: [aşama]
Tahmini okuma: [X dakika]
Description: [155 karakter kontrol]

KAYNAK DOĞRULAMA:
  Doğrulanan iddia: [X] ✅
  Yumuşatılan: [X] ⚠️
  Düzeltilen: [X] 🔧
  Eklenen referans: [X]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Tam Markdown içerik buraya — kopyala yapıştır hazır]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SONRAKİ ADIM:
1. İçeriği blog/_drafts/[slug].md olarak kaydet
2. Claude Code'da çalıştır:
   python tools/blog-converter.py blog/_drafts/[slug].md
3. Deploy: hexis-site-deploy skill'i uygula
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Kullanım Kalıpları

| Kullanıcı der ki | Skill ne yapar |
|---|---|
| "Bu makaleyi blog formatına çevir" | Adım 1-6 sırasıyla uygula |
| "Blog taslağı hazırla" | Önce konu sor, sonra Adım 1-6 |
| "Yayına hazırla" | Türkçe tarama + front matter + format + çıktı |
| "Slug ne olsun?" | Adım 3 slug kurallarını uygula, 2 seçenek sun |
| "Description yaz" | Adım 3 description kurallarını uygula |
| "Kaynakları doğrula" | Adım 3.5'i tek başına uygula, referans listesi üret |
| İçerik tamamlandığında | "Blog'a taşıyalım mı?" diye öner |

---

## Hızlı Referans — Türkçe İçerik Kuralları

| Kural | Doğru | Yanlış |
|-------|-------|--------|
| Em dash | `X; Y` veya `X, Y` | `X — Y` |
| Teknik terim | `*high-risk*` | high-risk veya **high-risk** |
| İlk kullanım | `*intended purpose* (tasarım amacı)` | `intended purpose` |
| Sonraki kullanım | `*intended purpose*` | `*intended purpose* (tasarım amacı)` |
| Parantez | Yalnızca Türkçe anlam için | Açıklama cümlesi için |
| Anchor sentaksı | `## Başlık {#anchor-id}` (sadece H2/H3) | `## Başlık` + paragraf içinde `{#xxx}` |
