---
name: hexis-qa-protocol
description: >
  HEXIS marka kalite güvence protokolü. Tüm HEXIS çıktılarına (Cowork plugin, Claude Code projesi,
  LinkedIn içeriği, müşteri raporu, AIGP materyali, blog, sunum, web sayfası) 3 aşamalı testten geçirir.
  "test yap", "kontrol et", "doğrula", "yayına hazırla", "Faz 1/2/3", "kaynak doğrulama",
  "marka tutarlılığı", "QA", "audit", "review", "structural check", "source verification"
  gibi ifadeler geçtiğinde bu skill'i MUTLAKA kullan.
  Herhangi bir HEXIS çıktısı tamamlandığında kullanıcıya test öner.
  Yasal referans içeren çıktılarda Faz 2 ZORUNLU — Claude'un hafızasına güvenmek kabul edilemez,
  web_search kullanılmalı.
---

# HEXIS QA Protocol — 3 Phase Quality Assurance (v2.3)

## Temel Kural

**HEXIS markası kapsamında üretilen HER araç ve çıktı bu 3 aşamalı testten geçmelidir.**

Kapsam:
- Cowork plugin dosyaları (SKILL.md, commands, plugin.json, README, CHANGELOG)
- Claude Code projeleri (hexis-ai-governance repo dosyaları)
- LinkedIn içerikleri (carousel, infografik, text-only, video prompt)
- Müşteri çıktıları (raporlar, sunumlar, değerlendirmeler)
- AIGP çalışma materyalleri (practice sorular, terminoloji listeleri, Hexis içerikleri)
- Blog yazıları, web içerikleri, e-postalar
- Kod dosyaları (Python, JS, bash script vb.)

---

## FAZ 1 — FONKSİYONEL TEST

**Amaç:** Çıktı beklenen şekilde çalışıyor mu? İçerik doğru yapıda mı?

### Kontrol Listesi

**Genel (Tüm Çıktılar):**
- [ ] Çıktı kullanıcının talebine uygun mu?
- [ ] Dil tutarlılığı: User-facing = English (plugin) veya belirtilen dil
- [ ] Yazım/imla hataları yok mu?
- [ ] Format doğru mu? (md, json, pptx, docx vb.)

**Plugin / Kod Çıktıları:**
- [ ] ORIENT terminolojisi doğru mu? (O-R-I-E-N-T, "Risk" not "Risk-Assess", "Navigate" not "Normalize")
- [ ] ORIENT 6 aşaması eksiksiz mi?
- [ ] Karar ağacı beklenen sınıflandırmayı üretiyor mu?
- [ ] EU AI Act risk kategorileri resmi terminolojiye uygun mu?
- [ ] JSON syntax geçerli mi? (plugin.json)
- [ ] Markdown rendering düzgün mü?
- [ ] Versiyon numaraları tüm dosyalarda tutarlı mı?

**Blog / Web Sayfa Çıktıları (zorunlu — v2.3 eklendi):**
- [ ] **MD ↔ HTML diff testi:** Markdown taslakta var olan sentaks, HTML çıktıda doğru render olmuş mu?
- [ ] HTML çıktıda literal markdown sentaksı kalmış mı? Aşağıdaki pattern'leri ara:
  - `{#` — Anchor sentaksı parse edilmemiş (KRİTİK — okuyucuya görünür)
  - `**...**` — Bold çevrilmemiş
  - `*...*` — İtalik çevrilmemiş
  - `[text](url)` — Markdown link literal kalmış
  - `^##+\s+` — Heading marker kalmış
- [ ] `tools/blog-converter.py` versiyon kontrolü: v2+ kullanılmış mı? (`post_conversion_check()` aktif olmalı)
- [ ] H2/H3 başlıklarının `id` attribute'ları doğru mu? (anchor link için)
- [ ] Title ↔ H1 metni aynı mı? (mismatch SEO/CTR için zararlı — bkz. Faz 3)
- [ ] Tek template kuralı: Tüm blog yazıları aynı `blog-converter.py`'dan üretilmiş mi? Manuel HTML edit yok mu?

**LinkedIn İçerikleri:**
- [ ] Hook ilk 1-2 cümle geri kalanından 5x güçlü mü?
- [ ] ORIENT adımıyla etiketlenmiş mi?
- [ ] Hedef kitle için somut değer var mı?
- [ ] Jenerik AI hype'ından uzak, teknik gerçeğe dayalı mı?
- [ ] Claude Code görsel/video prompt'u eklenmiş mi?
- [ ] Hashtag'ler uygun mu?

**Kod Dosyaları (⚠️ RİSK KONTROLÜ):**
- [ ] rm, mv, chmod gibi yıkıcı komutlar wildcard olmadan mı yazılmış?
- [ ] Credential, API key, token düz metin olarak mı gömülmüş? (YASAK)
- [ ] Harici URL'ler güvenli mi? (https, bilinen kaynaklar)
- [ ] Infinite loop veya kaynak tüketen pattern var mı?
- [ ] pip install --break-system-packages gibi system-level risk var mı?

### Test Senaryoları (minimum 3)

Her fonksiyonel test en az 3 senaryo içermeli:
1. **Beklenen kullanım** — En yaygın use case
2. **Sınır durum** — Edge case
3. **Minimal/negatif** — En düşük risk veya geçersiz input

### Sonuç Formatı

```
╔══════════════════════════════════════════════════╗
   FAZ 1 — FONKSİYONEL TEST SONUÇ RAPORU
   Çıktı: [Çıktı adı ve versiyonu]
   Tarih: [YYYY-MM-DD]
╚══════════════════════════════════════════════════╝

SENARYO SONUÇLARI:
┌──────────────────────────┬────────┬───────────┐
│ Senaryo                  │ Sonuç  │ Kontrol   │
├──────────────────────────┼────────┼───────────┤
│ 1. [Senaryo adı]        │ ✅/❌  │ X/X       │
│ 2. [Senaryo adı]        │ ✅/❌  │ X/X       │
│ 3. [Senaryo adı]        │ ✅/❌  │ X/X       │
└──────────────────────────┴────────┴───────────┘

BULUNAN HATALAR: [sayı]
VERSİYON DEĞİŞİKLİĞİ GEREKLİ Mİ: Evet/Hayır

╔══════════════════════════════════════════════════╗
   FAZ 1 SONUÇ: ✅ PASS / ❌ FAIL
╚══════════════════════════════════════════════════╝
```

---

## FAZ 2 — KAYNAK DOĞRULAMA

**Amaç:** Tüm yasal/düzenleyici referanslar harici kaynaklardan doğrulanmış mı?

### KRİTİK KURAL

> **Claude'un hafızasına güvenmek YASAKTIR.**
> Her yasal referans (article numarası, tarih, ceza miktarı, tanım) web_search ile harici kaynaktan doğrulanmalıdır.

### BİRİNCİL KAYNAK ERİŞİM KURALI ⚠️ (v2.3 eklendi)

**Birincil kaynağa erişim mümkün değilse, iddia "doğrulandı" işaretlenemez.**

Cowork ortamında bazı kurum siteleri (kvkk.gov.tr gibi) network allowlist'te olmayabilir. Bu durumda:

1. WebSearch sonuçlarındaki **Anthropic özetleri yorum katmanıdır** — birincil kaynak teyidi olarak kabul edilemez
2. İkinci derece kaynaklar (Mondaq, hukuk firması blogları, basın açıklamaları) çoğunluk teyit ederse **işaretle: "ikincil kaynak teyidi"**
3. Birincil kaynaktan teyit yoksa ifade ya **kullanıcı teyidi** ile geçer ya **yumuşatılır**

**Olay kaydı (8 May 2026):** KVKK Etken AI rehberi yayım tarihi Faz 2'de "Mart 2026" olarak doğrulandı, çünkü WebSearch özetleri tutarlı olarak Mart diyordu. Ancak kvkk.gov.tr network engelliydi — birincil kaynaktan görmedim. Kullanıcı PDF'in iç tarihinin Şubat olduğunu belirtti. Sonuç: Faz 2 yetersiz teyitle ilerledi. Yeni kural: erişilemeyen birincil kaynaklar için "doğrulama kullanıcı teyidi gerektirir" işareti zorunlu.

**İşaretleme formatı:**
| Sonuç | Anlamı |
|-------|--------|
| ✅ Birincil kaynak | EUR-Lex, kvkk.gov.tr, iso.org gibi resmi kaynaktan görüldü |
| 🟡 İkincil teyit | Birden fazla bağımsız hukuk firması/uzman tarafından aynı bilgi |
| ⚠️ Kullanıcı teyidi gerekli | Birincil kaynak erişilemez, içerik kullanıcı onayı bekliyor |
| ❌ Doğrulanamadı | İfadeyi yumuşat veya çıkar |

### PARAGRAPH SEVİYESİ DOĞRULAMA ⚠️

**Madde numarası doğrulanmış olması, paragraph numarasını kapsamaz.**

Art. X(Y) formatında bir referans kullanılacaksa:
1. O paragraph'ın tam metni primary source'dan okunmalıdır (EUR-Lex, artificialintelligenceact.eu, ai-act-service-desk.ec.europa.eu)
2. "Art. 26 doğrulandı, dolayısıyla Art. 26(5) de doğrulandı" mantığı GEÇERSİZDİR
3. Paragraph numarası yanlış olabilirken madde numarası doğru olabilir — içerikler birbirinden tamamen farklıdır (örn: Art. 26(5) monitoring, Art. 26(6) log tutma)

Uygulama: Art. X(Y) referansı içerik yazılmadan ÖNCE primary source'dan okunur. "Önce yaz, sonra doğrula" akışı paragraph seviyesinde kabul edilmez.

**Olay kaydı (Sayı #2 Bülteni, 16 Nisan 2026):** Art. 26(5) olarak yazılan insan gözetimi yükümlülüğü aslında Art. 26(2)'de yer alıyordu. Art. 26(5) izleme ve olay bildirimi hakkında. Madde numarası doğruydu ama paragraph yanlıştı; birden fazla QA geçişinde yakalanamadı çünkü paragraph seviyesi doğrulama yapılmadı.

### RESMİ YAYIM TARİHİ vs PDF İÇ TARİH ⚠️ (v2.3 eklendi)

**Resmi belgelerde iki farklı tarih bulunabilir — karıştırılmamalı.**

| Tarih tipi | Kaynak | Kullanım |
|------------|--------|----------|
| **Resmi yayım tarihi** | Kurum web sayfasındaki tarih | "X yayımladı" ifadesi için kullanılan tarih |
| **PDF iç tarih** | PDF metadata, kapak sayfası, hazırlama notu | Hazırlama/onay tarihi — yayım tarihi DEĞİL |

**Olay kaydı (8 May 2026):** Yazı 1'de KVKK Etken AI rehberi için "Şubat 2026" yazıldı (PDF iç tarih), oysa resmi yayım tarihi 12 Mart 2026'ydı. Hata 6 yerde geçti, birden fazla QA fazını geçti çünkü:
1. Faz 2 referans tablosunda "rehber yayım tarihi" satırı yoktu
2. PDF iç tarih ile resmi yayım tarihi ayrımı yapılmamıştı

**Kural:** "X kurum Y rehber yayımladı" ifadeleri için **resmi yayım tarihi** zorunludur. Yazıda nüansı korumak için iki seçenek:

A) İki tarihi de belirt:
> "Şubat 2026'da hazırlanan ve 12 Mart 2026'da yayımlanan..."

B) Sadece resmi yayım tarihini kullan (kompakt):
> "KVKK'nın 12 Mart 2026'da yayımladığı..."

Yumuşak ifade ("Şubat 2026'da" tek başına) **YASAK** — okuyucu yanılgıya yönlenir.

### AŞIRI BASİTLEŞTİRME KONTROLÜ (NÜANSLILlK TESTİ) ⚠️

**Teknik olarak yanlış olmayan ama yanıltıcı derecede basitleştirilmiş ifadeler, yanlış ifadeler kadar tehlikelidir.**

Yasal/düzenleyici bağlamda "X, Y kapsamına girmiyor", "X, Y'den muaf", "X değişmiyor" gibi kesin (binary) ifadeler nüanslılık testine tabidir. Gerçeklik nadiren siyah-beyazdır; çoğu düzenleyici mekanizma istisnalar, geçiş süreleri ve koşullu uygulamalar içerir.

Nüanslılık testi üç soru sorar:
1. **İstisna var mı?** İfade kesin ("kapsamına girmiyor") ama aslında kısmi istisnalar, geçiş süreleri veya sınırlı muafiyetler mevcut mu?
2. **Aynı çıktı içinde çelişki var mı?** Bir bölüm "X kapsamı dışında" derken başka bir bölüm X ile ilgili detay veriyor mu? (İç tutarlılık kontrolü)
3. **Okuyucu yanlış sonuç çıkarabilir mi?** İfade teknik olarak doğru olsa bile, okuyucu "hiçbir şey yapmama gerek yok" gibi yanlış bir eyleme yönlenebilir mi?

Üç sorudan herhangi birine "evet" cevabı verilirse, ifade nüanslandırılmalıdır.

**Nüanslılık formülleri:**

| ❌ Kesin (binary) ifade | ✅ Nüanslı alternatif |
|---|---|
| "X kapsamına girmiyor" | "X için kapsamlı bir [erteleme/muafiyet] öngörülmüyor; yalnızca [spesifik istisna]" |
| "X değişmiyor" | "X'in temel yapısı korunuyor; ancak [spesifik düzenleme] mevcut" |
| "X'ten muaf" | "X yükümlülüğü [koşul] altında [sınırlı/geçici] olarak erteleniyor" |
| "X yürürlükte değil" | "X'in [ana hükümleri/belirli paragrafları] henüz uygulamada değil" |

**Olay kaydı (Sayı #2 Bülteni, 16 Nisan 2026):** "Madde 50 şeffaflık zorunlulukları Digital Omnibus kapsamına girmiyor" ifadesi teknik olarak tamamen yanlış değildi ama Omnibus'un Madde 50(2) için mevcut sistemlere 6 aylık geçiş süresi öngördüğünü gizliyordu. Aynı bültenin başka bir paragrafında EuroISPA'nın Madde 50 geçiş süresi talebi anlatılıyordu; yani bülten kendi içinde çelişiyordu. Düzeltme: "kapsamlı bir erteleme öngörülmüyor; yalnızca mevcut sistemlere sınırlı bir geçiş süresi tanınıyor."

### İÇ TUTARLILIK KONTROLÜ ⚠️

**Aynı çıktının farklı bölümleri birbiriyle çelişmemeli.**

Faz 2 doğrulaması yalnızca dış kaynaklara karşı kontrol yapmaz. Çıktının kendi içindeki tutarlılık da kontrol edilmelidir. Uzun çıktılarda (bülten, rapor, blog) bir bölümde yapılan iddia, başka bir bölümde verilen detayla çelişebilir. Bu özellikle şu durumlarda olur: (a) aynı yasal mekanizmanın farklı yönleri farklı bölümlerde ele alınıyorsa, (b) genel özet ile detaylı analiz arasında soyutlama farkı varsa.

Uygulama: Faz 2 sonunda, tüm kesin ifadeler ("kapsamına girmiyor", "değişmiyor", "muaf") çıktının diğer bölümleriyle çapraz kontrol edilir. Çelişki varsa, ya kesin ifade nüanslandırılır ya da detay bölümü düzeltilir.

### DÜZELTME DÖNGÜSÜ KURALI ⚠️

**Faz 2 hatası düzeltildiğinde, düzeltmede geçen tüm yeni referanslar otomatik olarak mini Faz 2'ye girer.**

Düzeltme aşamasında üretilen her yeni referans (madde numarası, paragraph, tarih, tanım) orijinal çıktıyla aynı doğrulama standardına tabidir. Düzeltme = yeni çıktı.

Süreç:
1. Faz 2 hatası tespit edildi → düzeltme üretildi
2. Düzeltmede yeni referans var mı? → Evet ise mini Faz 2 zorunlu
3. Mini Faz 2: Sadece yeni referanslar için web_search yap, primary source'dan teyit et
4. Mini Faz 2 PASS → düzeltilmiş içerik yayına hazır
5. Mini Faz 2 FAIL → tekrar düzelt, döngü yeniden başlar

"Küçük düzeltme" gerekçesiyle bu kural es geçilemez.

### KAPSAM İFADESİ TETİKLEYİCİSİ ⚠️

**Bu kural, article numarası veya ceza miktarı olmasa bile geçerlidir.**

"zorunlu", "tabi", "gerektiriyor", "kapsamında", "yükümlü", "subject to", "required to", "must comply" gibi kelimeler içeren HER cümle Faz 2'yi tetikler. Kapsam iddiası içerik tamamlanmadan önce primary source ile doğrulanır — deployment sonrası değil.

**EU AI Act Kapsam — Kalıcı Yasak Liste:**

| ❌ YASAK İFADE | ✅ DOĞRU ÇERÇEVE |
|---|---|
| "Türkiye'de AI kullanan her şirket EU AI Act'e tabi" | "AB pazarına açık veya AB'deki kullanıcılara hizmet veren Türk şirketler" |
| "Türk işletmeleri EU AI Act kapsamında" | "AB pazarında faaliyet gösteren Türk şirketler için EU AI Act yükümlülüğü doğar" |
| "Turkish organisations subject to the EU AI Act" | "Turkish organisations operating in or serving the EU market" |
| "Türkiye'de yapay zeka sistemi çalıştırmak EU AI Act'i gerektirir" | "AB pazarına yönelik AI sistemleri için EU AI Act uyum yükümlülüğü doğar" |

**Hukuki dayanak:** EU AI Act Art. 2(1)(a)(c) — kapsam üçüncü ülke operatörleri için AB'ye sunum VEYA çıktının AB'de kullanımı koşuluna bağlıdır.

### Doğrulanacak Referans Tipleri

| Tip | Örnek | Doğrulama Kaynağı |
|-----|-------|-------------------|
| EU AI Act article | Art. 5(1)(h) | artificialintelligenceact.eu, EUR-Lex |
| Annex referansı | Annex III Area 4(a) | artificialintelligenceact.eu/annex/ |
| Ceza miktarı | €35M / 7% | euaiact.com/article/99 |
| Yürürlük tarihi | Feb 2025 | Art. 113, hukuk firması analizleri |
| ISO standardı | ISO/IEC 42001:2023 §6.1.2 | iso.org |
| KVKK maddesi | 6698 sayılı Kanun Md. 5 | kvkk.gov.tr |
| **KVKK rehber yayım tarihi** *(v2.3)* | "KVKK 12 Mart 2026'da yayımladı" | kvkk.gov.tr/Icerik/[id], birincil kaynak. PDF iç tarih kullanılamaz. |
| **Kurum rehber/genelge yayım tarihi** *(v2.3)* | "EDPB 2026'da kılavuz yayımladı" | Kurum web sayfası, en az 2 ikincil kaynak teyidi |
| NIST AI RMF | GOVERN function | nist.gov |
| OECD AI Principles | Principle 1.2 | oecd.ai |
| Digital Omnibus | Proposed Nov 2025 | EUR-Lex, IAPP, law firm analyses |
| AIGP BoK | Domain II.C | iapp.org |

### Doğrulama Süreci

1. Çıktıdaki tüm yasal/düzenleyici referansları listele
2. Art. X(Y) referansları için paragraph metnini primary source'dan oku ve doğrula
3. Her referans için web_search yap (minimum 2 farklı kaynak)
4. **Birincil kaynak erişim kontrolü:** kaynak network engelli mi? Engelliyse "kullanıcı teyidi gerekli" işareti
5. Orijinal metin ile çıktıdaki ifadeyi karşılaştır
6. Uyuşmazlık varsa NOT olarak işaretle
7. **Resmi yayım vs PDF iç tarih:** kurum belgeleri için iki tarih ayrımı yapıldı mı?
8. **Nüanslılık testi:** Tüm kesin (binary) ifadeleri 3 soruyla test et (istisna, iç çelişki, okuyucu yanılgısı)
9. **İç tutarlılık kontrolü:** Kesin ifadeleri çıktının diğer bölümleriyle çapraz kontrol et
10. Sonuç tablosunu doldur

### Sonuç Formatı

```
╔══════════════════════════════════════════════════╗
   FAZ 2 — KAYNAK DOĞRULAMA RAPORU
   Çıktı: [Çıktı adı ve versiyonu]
   Tarih: [YYYY-MM-DD]
╚══════════════════════════════════════════════════╝

| # | Referans | Çıktıdaki İfade | Doğrulama Kaynağı | Sonuç |
|---|---------|-----------------|-------------------|-------|
| 1 | [Ref]   | [İfade]         | [Kaynak URL/adı]  | ✅/🟡/⚠️/❌ |

Sonuç anahtarı:
✅ = Birincil kaynak teyidi
🟡 = İkincil teyit (2+ bağımsız kaynak)
⚠️ = Kullanıcı teyidi gerekli (birincil kaynak erişilemez)
❌ = Doğrulanamadı — düzeltme veya yumuşatma gerekli

Kritik hata: [sayı]
Minor iyileştirme: [sayı]

╔══════════════════════════════════════════════════╗
   FAZ 2 SONUÇ: ✅ PASS / ❌ FAIL
╚══════════════════════════════════════════════════╝
```

---

## FAZ 3 — YAPISAL BÜTÜNLÜK

**Amaç:** Çıktı HEXIS marka standartlarına ve proje yapısına uygun mu?

### Kontrol Listesi

**HEXIS Marka Tutarlılığı:**
- [ ] Marka sesi: Açık, otoriter, pratik, hype'tan uzak mı?
- [ ] "Compliance as orientation, not checklist" felsefesine uygun mu?
- [ ] ORIENT framework doğru referans verilmiş mi?
- [ ] hexis.center URL doğru mu?
- [ ] Görsel standartlar: koyu lacivert #0A1628, akik mavi #2D6BE4, amber #F59E0B

**Türkçe İçerik — Em Dash Yasağı ⚠️:**
- [ ] Türkçe metinde `—` (em dash) veya cümle içi `-` (tire) kullanılmamış mı?
- Yasak: `"Örtüşen gereksinimler — ve yönetilmesi gereken gerilim noktaları."`
- Alternatifler: virgül (ek bilgi/liste), noktalı virgül (bağlantılı düşünceler), iki nokta (açıklama/liste), parantez (yan bilgi/teknik terim)
- Bu kural HTML içerikler, LinkedIn gönderileri, blog yazıları ve tüm Türkçe çıktılar için geçerlidir.
- **İngilizce içeriklerde em dash serbesttir.**

**Blog / Web Sayfa Yapısal Kontroller (v2.3 eklendi):**
- [ ] **Title ↔ H1 uyumu:** `<title>` etiketi ve H1 metni aynı mı? (CTR + relevans sinyali)
- [ ] **Tek template kuralı:** Tüm blog yazıları aynı template'ten üretilmiş mi? Plausible, schema, FAQ JSON-LD, font tag'leri yazılar arasında tutarlı mı?
- [ ] Manuel HTML edit kanıtı var mı? (örn: bir yazıda Plausible, diğerinde yok → tutarsızlık)
- [ ] Schema.org `datePublished`, `dateModified` doğru mu?
- [ ] Internal link grafiği iki yönlü mü? (pillar ↔ cluster bağı)
- [ ] Anchor ID'ler uniq mi? (sayfada aynı id iki kez tekrar etmemeli)
- [ ] OG image, favicon, canonical URL tüm yazılarda var mı?

**Olay kaydı (8 May 2026):** İki KVKK blog yazısı arasında tutarsızlık tespit edildi:
- Yazı 2'de Plausible analytics tag vardı, Yazı 1'de yoktu
- Yazı 2'de title `Etken Yapay Zekâ ve KVKK: Kişisel Verilere Etkisi`, H1 `Etken Yapay Zekâ (Agentic AI) Kişisel Verileri Nasıl Etkiliyor? KVKK Raporu Analizi`
- Sebep: Bir yazı blog-converter.py'dan üretildi, diğeri manuel edit/farklı tool ile yazıldı
- Yeni kural: Tüm blog yazıları **yalnızca** `tools/blog-converter.py` üzerinden üretilebilir. Manuel HTML edit yasak.

**Dosya/Proje Yapısı:**
- [ ] Dosya adlandırma uygun mu?
- [ ] Versiyon numaraları senkron mu? (plugin.json ↔ CHANGELOG ↔ README ↔ SKILL.md)
- [ ] CHANGELOG güncel mi?
- [ ] README değişiklikleri yansıtıyor mu?
- [ ] Git commit mesajı açıklayıcı mı?

**Çapraz Referans Kontrolü:**
- [ ] Bir dosya değişince referans veren TÜM dosyalar güncellenmiş mi?
- [ ] Terminoloji tüm dosyalarda tutarlı mı?
- [ ] Eski terminoloji hiçbir yerde kalmamış mı?

### Sonuç Formatı

```
╔══════════════════════════════════════════════════╗
   FAZ 3 — YAPISAL BÜTÜNLÜK RAPORU
   Çıktı: [Çıktı adı ve versiyonu]
   Tarih: [YYYY-MM-DD]
╚══════════════════════════════════════════════════╝

MARKA TUTARLILIĞI: ✅/❌
DOSYA YAPISI: ✅/❌
ÇAPRAZ REFERANS: ✅/❌
ERİŞİLEBİLİRLİK: ✅/❌
BLOG/WEB YAPISAL: ✅/❌

╔══════════════════════════════════════════════════╗
   FAZ 3 SONUÇ: ✅ PASS / ❌ FAIL
╚══════════════════════════════════════════════════╝
```

---

## GENEL QA SONUÇ RAPORU

```
╔══════════════════════════════════════════════════════════════╗
   HEXIS QA PROTOCOL — GENEL SONUÇ
   Çıktı: [Ad ve versiyon]  |  Tarih: [YYYY-MM-DD]
╠══════════════════════════════════════════════════════════════╣
│  Faz 1 — Fonksiyonel Test:      ✅ PASS / ❌ FAIL         │
│  Faz 2 — Kaynak Doğrulama:      ✅ PASS / ❌ FAIL         │
│  Faz 3 — Yapısal Bütünlük:      ✅ PASS / ❌ FAIL         │
╠══════════════════════════════════════════════════════════════╣
│  GENEL SONUÇ: ✅ YAYIN HAZIR / ❌ DÜZELTME GEREKLİ        │
│  Kritik hata: [sayı]  |  Minor: [sayı]                      │
│  Versiyon değişikliği: Evet/Hayır                            │
╚══════════════════════════════════════════════════════════════╝
```

---

## KOD RİSK DEĞERLENDİRME PROTOKOLÜ

**Tetikleyici:** Claude bir kod dosyası yazdığında veya düzenlediğinde otomatik.

| Seviye | Tanım | Eylem |
|--------|-------|-------|
| 🟢 DÜŞÜK | Okuma, gösterim, hesaplama | Normal devam |
| 🟡 ORTA | Dosya oluşturma, pip install, network | Kullanıcıya bilgi ver |
| 🔴 YÜKSEK | rm, chmod, git push --force, credential | DURDUR + onay iste |
| ⛔ KRİTİK | Wildcard silme, system dosyası, API key açık metin | YASAK — alternatif öner |

---

## ORIENT Framework Referansı (v0.2.1)

| Harf | Aşama | Eski Adı (KULLANMA) | Açıklama |
|------|-------|---------------------|----------|
| **O** | Observe | — | AI sistemlerini tanımla ve bağlamını haritalandır |
| **R** | Risk | ~~Risk-Assess~~ | EU AI Act'a göre risk sınıflandırması yap |
| **I** | Identify | ~~Implement~~ | Uygulanabilir yasal yükümlülükleri belirle |
| **E** | Evaluate | ~~Evidence~~ | Mevcut kontrolleri ve uyum düzeyini değerlendir |
| **N** | Navigate | ~~Normalize~~ | Önerilen adımları ve yol haritasını belirle |
| **T** | Track | — | Sürekli izleme ve iyileştirme döngüsü |

---

## v2.3 Sürüm Notları (8 May 2026)

KVKK Etken Yapay Zekâ blog yazılarında bulunan üç hata sonrası eklendi:

1. **Faz 1 — Blog/Web Sayfa Çıktıları bölümü:** MD ↔ HTML diff testi, literal markdown sentaksı kontrolü, `blog-converter.py` v2+ zorunluluğu, Title↔H1 ön kontrolü
2. **Faz 2 — Birincil Kaynak Erişim Kuralı:** Network engelli kaynaklar için "kullanıcı teyidi gerekli" işareti zorunlu hale geldi
3. **Faz 2 — Resmi Yayım vs PDF İç Tarih ayrımı:** Kurum belgelerinde iki tarih bulunabilir, sadece resmi yayım tarihi kullanılır
4. **Faz 2 — Referans tablosuna iki yeni satır:** "KVKK rehber yayım tarihi" ve "Kurum rehber/genelge yayım tarihi"
5. **Faz 3 — Blog/Web Yapısal Kontroller bölümü:** Title↔H1 uyumu, tek template kuralı, manuel edit yasağı, anchor uniqlik

Bu değişiklikler `tools/blog-converter.py` v2 (`post_conversion_check()` fonksiyonu) ile birlikte çalışır. v2'ye geçiş yapılmamış reposunda bu skill v2.3 kontrolleri eksik kalır.

---

## Kullanım Kalıpları

| Kullanıcı der ki | Ne yapılır |
|---|---|
| "test yap" / "QA" | 3 faz sırasıyla uygula |
| "Faz 1" / "fonksiyonel test" | Sadece Faz 1 |
| "Faz 2" / "kaynak doğrula" | Sadece Faz 2 (web search zorunlu) |
| "Faz 3" / "yapısal kontrol" | Sadece Faz 3 |
| "yayına hazırla" | 3 faz + genel rapor |
| "bu kodu kontrol et" | Kod risk değerlendirme protokolü |
| "hızlı kontrol" | Sadece Faz 1 (hızlı) |
| [Çıktı tamamlandığında] | "QA testi yapayım mı?" öner |
