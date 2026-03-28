# EU AI Act Compliance Starter Kit — Kapsamlı Analiz Raporu

**Tarih:** 20 Mart 2026
**Analiz kapsamı:** Yasal doğruluk, UX kalitesi, amaca uygunluk
**Hedef:** €99 fiyatla satışa hazır ticari ürün kalitesi

---

## A. YASAL DOĞRULUK ANALİZİ

### 🔴 KRİTİK — Düzeltilmeli (satış öncesi)

**1. Art. 27 FRIA kapsamı — YANLIŞ**

Mevcut: "FRIA recommended (mandatory for public bodies)"

Gerçek kapsam 3 kategori:
- Kamu kurumları (public bodies)
- Kamu hizmeti sunan özel sektör (sağlık, eğitim, sosyal hizmetler, konut, adalet)
- Kredi skorlama ve sigorta risk değerlendirmesi yapan finansal kuruluşlar (kamu/özel fark etmez)

**Etkilenen dosyalar:** Inventory (örnek veri notu), Assessment (Obligations Map satır 13), Risk Worksheet (Page 4 quick reference)

**2. Art. 50 transparency — EKSİK (4 kategori, 3 değil)**

Mevcut: 3 kategori (chatbot, deepfake, emotion recognition)

Eksik olan: **Art. 50(2) — Sentetik içerik üreticileri** makine okunabilir formatta AI-generated işaretlemesi yapmalı. Bu GPAI sağlayıcıları için kritik bir yükümlülük.

**Etkilenen dosyalar:** Risk Worksheet (Step 4 + Page 4), Assessment (Obligations Map)

**3. Annex III Alan 5 kapsamı — EKSİK**

Mevcut: "credit scoring, insurance, emergency services"

Eksik: **Sosyal yardım ve sağlık hizmetlerine erişim değerlendirmesi** — Alan 5'in ilk ve en hassas kategorisi.

**Etkilenen dosyalar:** Risk Worksheet (Page 1 Annex III listesi + Step 3 örnekleri), Assessment (obligations map)

### 🟡 ORTA — İyileştirilmeli

**4. Art. 43 conformity assessment — YANILTICI**

Mevcut: "Internal control (most) or third-party (biometrics, critical infrastructure)"

Gerçek: Critical infrastructure için 3. taraf zorunlu DEĞİL. Biometrik sistemler için de isteğe bağlı (harmonize standartlar uygulanıyorsa). 3. taraf yalnızca Annex I ürün mevzuatı gerektiriyorsa zorunlu.

**Etkilenen dosyalar:** Assessment (Obligations Map satır 10)

**5. Art. 73 — Olay raporlama süreleri EKSİK**

Mevcut: "without undue delay"

Gerçek kademeli süreler:
- Standart olaylar: **15 gün** içinde
- Ölüm: **10 gün** içinde
- Kritik altyapı kesintisi: **2 gün** içinde

**Etkilenen dosyalar:** Roadmap (ACT-010 notu), Assessment (Obligations Map)

**6. Art. 6(3) profiling kuralı — DOĞRU ama belirsiz**

Mevcut: "Systems that profile natural persons are ALWAYS high-risk"

Doğru ama eksik: Bu kural SADECE Annex III kapsamındaki sistemler için geçerli. Genel profiling değil.

Düzeltme: "Systems in Annex III that perform profiling of natural persons are always classified as high-risk, regardless of Art. 6(3) exceptions."

### 🟢 DOĞRULANMIŞ — Değişiklik gerekmez

- Tüm madde numaraları (Art. 5, 6, 9-15, 27, 43, 49, 50, 51-56, 72, 73, 95, 99) ✅
- Tüm tarihler (2 Feb 2025, 2 Aug 2025, 2 Aug 2026, 2 Aug 2027) ✅
- Ceza miktarları (€35M/7%, €15M/3%, €7.5M/1%) ✅
- Art. 99(6) KOBİ kuralı (düşük olan geçerli) ✅
- Digital Omnibus durumu (henüz kabul edilmedi) ✅
- Art. 53(1)(d) training data summary template (AI Office şablonu mevcut) ✅

---

## B. UX KALİTESİ ANALİZİ

### 🔴 KRİTİK

**7. System ID tutarsızlığı — Template'ler arası**

- Inventory: `AI-001`, `AI-002`, `AI-003`
- Assessment + Roadmap: `SYS-001`, `SYS-002`, `SYS-003`

Müşteri aynı sistemi iki farklı ID ile takip etmek zorunda. Bu kit'in "birbirine bağlı 4 template" vaadini baltalıyor.

**Çözüm:** Tüm template'lerde tutarlı ID formatı kullan (AI-001 önerisi — Inventory ile başlıyor çünkü).

**8. Risk Level dropdown değerleri tutarsız**

- Inventory: `High`
- Assessment: `High Risk`
- Roadmap: (Risk Level dropdown yok, Obligation Area ve Phase var)

Aynı kavramın farklı string'lerle ifade edilmesi, müşterinin kopyala-yapıştır yapmasını engeller.

**Çözüm:** Tüm template'lerde aynı değerleri kullan: "Prohibited", "High Risk", "Limited Risk", "GPAI", "GPAI (Systemic)", "Minimal Risk"

### 🟡 ORTA

**9. Dashboard'lar statik — dinamik değil**

Assessment Dashboard'da SYS-001, SYS-002, SYS-003 satırları hardcoded. Müşteri SYS-004 eklediğinde Dashboard otomatik güncellenmez.

**Çözüm:** UNIQUE + COUNTIFS ile dinamik sistem listesi (Excel'de kısıtlı ama OFFSET/INDEX kullanılabilir) veya en azından 10 satırlık boş alan bırak.

**10. Timeline View tarihleri hardcoded (Mar 2026 — Feb 2027)**

Kit'i Haziran 2026'da satın alan müşteri geçmiş tarihleri görür. Evrensel bir template olmalı.

**Çözüm:** "Month 1, Month 2..." şeklinde göreceli tarihler kullan veya başlangıç tarihi alanı ekle.

**11. PDF'de metin üst üste binme (Page 2, Step 5)**

Risk Worksheet PDF'inde Step 5'in checkbox metinleri example text ile hafif çakışıyor.

**Çözüm:** step_h değerini artır veya example text wrap mantığını iyileştir.

**12. Gantt bar renkleri — ACT-006 anomalisi**

ACT-006 (Completed) Jan-Feb 2027'ye yerleştirilmiş ama aslında Şubat 2026'da tamamlanmış. Timeline'da görünmemeli veya Ocak 2026 olarak gösterilmeli (timeline dışında).

### 🟢 İYİ

- Conditional formatting tutarlı ve renk körlüğüne uygun (renk + metin) ✅
- Print/PDF setup tüm sayfalarda mevcut ✅
- Dropdown prompt mesajları kullanıcı dostu ✅
- Freeze panes ve auto-filter her veri sayfasında aktif ✅
- Hexis Web Palette tutarlı kullanılmış ✅

---

## C. AMACA UYGUNLUK ANALİZİ

### 🔴 KRİTİK

**13. Template'ler arası bağlantı fiilen yok**

Vaad: "What do I have?" → "What risk?" → "Where am I?" → "What to do?"
Gerçek: 4 bağımsız dosya. Müşteri verileri el ile kopyalar.

Eksikler:
- Risk Worksheet (PDF) → Assessment/Roadmap'e otomatik veri aktarımı yok
- Inventory Risk Level → Assessment'a otomatik dolmuyor
- Assessment gap'leri → Roadmap action'larına otomatik dönüşmüyor

**Çözüm:** Bu €99 fiyat noktası için kabul edilebilir — ama bir "Quick Start Guide" PDF eklenmeli, veri akışını gösteren.

**14. Quick Start Guide / Kit Overview yok**

Müşteri 4 dosyayı indirdiğinde nereden başlayacağını bilmiyor. Her template'in Instructions sheet'i var ama kit düzeyinde bir rehber yok.

**Çözüm:** 1-2 sayfalık "Getting Started" PDF:
- Kit içeriği
- Sıralama (1→2→3→4)
- Her template'in amacı ve ORIENT eşlemesi
- Tahmini süre (örn: "Initial assessment: 2-3 hours for 5 systems")
- Veri aktarım rehberi (hangi hücre → hangi hücre)

### 🟡 ORTA

**15. Müşteri Profili A (KOBİ DPO, 3-5 sistem) için fazla karmaşık**

18 obligation area × 3-5 sistem = 54-90 satır Gap Assessment. Bir KOBİ DPO'su için bunaltıcı olabilir.

**Çözüm:** Obligations Map'te risk level filtresi zaten var (Required/N/A renk kodlaması). Instructions'a "Start with only the obligations marked 'Required' for your risk level" notu ekle.

**16. KVKK crosswalk eksik**

Hedef pazar Türk KOBİ'leri. KVKK ile EU AI Act arasındaki örtüşme (veri koruma, meşru amaç, açık rıza vs.) template'lerde işlenmiyor.

Not: Bu Sprint 3 kapsamında planlanmış. €99 Starter Kit'te olması gerekmez ama €149 Professional Kit'te güçlü bir farklılaştırıcı olur.

**17. Annex IV teknik dokümantasyon template'i yok**

Assessment'ta "Technical Documentation (Annex IV compliant)" deliverable olarak listeleniyor ama kit'te Annex IV template'i yok.

Çözüm: Sprint 2 backlog'da zaten var. Kit'e eklenmese bile Roadmap'te "Use Annex IV template from hexis.center" notu düşülebilir.

**18. Obligation Area dropdown'u — Assessment'ta 18 öğe**

Dropdown'da 18 öğe kullanıcı için uzun. Gruplandırma yok.

**Çözüm:** Obligation areas'ı kategorilere ayır (Core High-Risk / Transparency / GPAI / Governance) veya en azından sıralamayı risk level'a göre yap.

### 🟢 GÜÇLÜ YANLAR

- Kit akışı mantıklı ve ORIENT framework ile tutarlı ✅
- Örnek veriler gerçekçi ve birbirleriyle tutarlı (aynı 3 sistem) ✅
- 5 kademeli compliance phase yapısı (Foundation→Maintenance) pratik ✅
- Maturity scale (1-5) HEXIS Generator ile uyumlu ✅
- SME notu (Art. 99(6)) ve Digital Omnibus uyarısı — pazar farkındalığı gösterir ✅
- Evidence gereksinimleri her obligation için listelenmiş — çok değerli ✅

---

## D. ÖNCELİKLENDİRİLMİŞ AKSİYON PLANI

### Satış Öncesi Zorunlu (Launch Blocker)

| # | Bulgu | Etki | Efor |
|---|-------|------|------|
| 1 | Art. 27 FRIA kapsamını genişlet (3 kategori) | Yasal hata → itibar riski | 1 saat |
| 2 | Art. 50(2) sentetik içerik yükümlülüğünü ekle | Eksik obligation → müşteri zararı | 1 saat |
| 3 | Annex III Alan 5 kapsamını genişlet | Eksik high-risk alan | 30 dk |
| 7 | System ID formatını tutarlı yap (AI-001) | UX kırılması | 2 saat |
| 8 | Risk Level dropdown değerlerini hizala | UX kırılması | 1 saat |
| 14 | Quick Start Guide PDF oluştur | Kit kullanılabilirliği | 2 saat |

### Satış Sonrası v1.1 (İlk 2 hafta)

| # | Bulgu | Etki | Efor |
|---|-------|------|------|
| 4 | Art. 43 conformity assessment düzelt | Yasal netlik | 30 dk |
| 5 | Art. 73 raporlama sürelerini ekle | Yasal detay | 30 dk |
| 6 | Art. 6(3) profiling kuralını netleştir | Yasal netlik | 15 dk |
| 9 | Dashboard'a dinamik alan ekle | UX iyileştirme | 2 saat |
| 10 | Timeline göreceli tarihlere çevir | Evrensellik | 1 saat |
| 12 | ACT-006 timeline anomalisini düzelt | Görsel tutarlılık | 15 dk |
| 15 | KOBİ rehberlik notu ekle | Müşteri deneyimi | 30 dk |

### v2.0 (Professional Kit — €149)

| # | Bulgu | Etki | Efor |
|---|-------|------|------|
| 16 | KVKK crosswalk modülü | Türk pazarı farklılaştırıcı | 8 saat |
| 17 | Annex IV teknik dok. template'i | Tam uyum paketi | 6 saat |
| 13 | Template'ler arası VLOOKUP bağlantıları | Premium özellik | 4 saat |

---

## E. RAKAM ÖZETİ

| Metrik | Değer |
|--------|-------|
| Toplam template | 4 dosya (3 Excel + 1 PDF) |
| Toplam sheet | 13 (4+0+4+4 + Quick Start) |
| Obligations mapped | 18 (+1 eklenecek: Art. 50(2)) |
| Örnek veri satırları | 23 (3+0+8+10 + EU DB 2) |
| Data validations | 21 dropdown |
| Dashboard formulas | 117 (38+0+34+48 — 3 dosyanın toplamı) |
| Conditional formatting | 20+ rule |
| Yasal referans | 18+ EU AI Act maddesi |
| Kritik yasal hata | 3 (FRIA, Art. 50(2), Annex III §5) |
| Orta yasal hata | 3 (Art. 43, Art. 73, Art. 6(3)) |
| Kritik UX hatası | 2 (System ID, Risk Level tutarsızlığı) |
| Orta UX hatası | 4 |

---

*hexis.center · EU AI Act Compliance Starter Kit Analysis · 20 March 2026*
