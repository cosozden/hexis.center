# Hexis SaaS Platform — Tam Vizyon Dokümanı

**Tarih:** 8 Nisan 2026 (Revize: 8 Nisan 2026 — stratejik tartışma sonrası)
**Yaklaşım:** "En iyisini hedefle, her adımı mükemmel bitir"
**Paradigma:** Claude IS the Consultant
**Temel İlke:** AI-assisted, not AI-dependent — deterministik motor karar verir, Claude zenginleştirir

---

## Vizyon Özeti

> Bir AB KOBİ'sinin DPO'su veya compliance sorumlusu app.hexis.center'a giriyor. AI sistemlerini kaydediyor, risk seviyesini öğreniyor, yükümlülüklerini görüyor, mevcut durumunu değerlendiriyor, Claude ile konuşarak aksiyon planı çıkarıyor, ilerlemeyi takip ediyor ve yönetim kuruluna profesyonel rapor sunuyor — danışmana tek kuruş ödemeden.

---

## Risk-Adaptive Flow (8 Nisan Kararı)

Tüm kullanıcılar aynı 6 adımlık süreçten geçmez. Risk seviyesine göre platform otomatik olarak yolu adapte eder:

| Risk Seviyesi | Kullanıcı Deneyimi | Adımlar |
|---|---|---|
| **Prohibited** | Kırmızı uyarı → tek sayfa bilgi → çıkış | Observe → Risk → Bilgi sayfası |
| **Minimal risk** | Basit yol → iyi uygulamalar checklist → bitti | Observe → Risk → Basit checklist |
| **Limited risk (Art. 50)** | Orta yol → şeffaflık yükümlülükleri → basit değerlendirme | Observe → Risk → Identify (dar) → Evaluate (basit) |
| **High-risk / GPAI** | Tam yol → 6 adımın tamamı | Observe → Risk → Identify → Evaluate → Navigate → Track |

**Neden:** Minimal risk kullanıcısı 10 dakikada işini bitirir, high-risk kullanıcısı derinlemesine süreç yönetir. Aynı platform, farklı derinlik.

---

## Manuel Mod (8 Nisan Kararı)

Kullanıcı isterse Claude'u tamamen kapatabilir — sadece deterministik sonuçlarla ilerleyebilir.

- Her sayfada "Manuel mod" toggle'ı
- Manuel modda: form + checklist + matrix çalışır, Claude önerileri gizlenir
- Sonuçlarda açık etiket: "Bu sonuç kural-tabanlı motorla hesaplanmıştır" vs "Bu yorum AI tarafından üretilmiştir"
- Trust sayfasında: "Hexis determines your risk classification and obligations using rule-based logic derived directly from EU AI Act articles. AI enrichment provides contextual guidance but never overrides deterministic results."

**Neden:** "AI yönetişimini AI ile mi denetliyorsunuz?" eleştirisine karşı en güçlü cevap. Platform AI-assisted, not AI-dependent.

---

## 6 Adım — İdeal Tanımlar

### Adım 1: Observe (Gözlemle)

**Kullanıcı deneyimi:** Kullanıcı ya serbest metin yazar ("We use an AI chatbot for customer service that processes personal data of EU citizens") ya da yapılandırılmış form doldurur. Claude serbest metni analiz eder, formu otomatik doldurur, eksik bilgileri sorar.

**Özellikler:**
- Serbest metin giriş → Claude structured output ile AI System Card üretir
- Yapılandırılmış form alternatifi (ad, amaç, veri türü, AB pazarı, organizasyon rolü)
- Claude: eksik bilgi tespiti + "Bu bilgiyi de ekleseniz daha iyi sınıflandırma yapabilirim" önerileri
- Dashboard'da AI Sistem listesi (kart görünümü)
- Her sistem kartında: ad, amaç, risk seviyesi (belirlenince), durum rozeti
- Sistem düzenleme ve silme

**Teknik:**
- /api/ai/extract-system (mevcut ✅)
- ai_systems tablosu (mevcut ✅)
- observe-form.tsx component (mevcut, entegrasyon eksik)

---

### Adım 2: Risk (Riskini Belirle)

**Kullanıcı deneyimi:** Her sistem için 7 adımlı wizard çalışır. Sonuçta risk seviyesi, ilgili maddeler, yükümlülük tablosu ve deadline countdown görünür. Claude, kullanıcının girdiği "amaç" açıklamasına göre bağlamsal analiz ekler.

**Özellikler:**
- 7 adımlı risk sınıflandırma wizard (Art. 5 → FRIA)
- "Risk seviyemi biliyorum" bypass seçeneği
- Art. 6(3) istisna kontrolü
- Art. 50 şeffaflık yükümlülükleri (emotion/biometric disclosure dahil)
- GPAI sınıflandırma (Art. 51-56)
- Sonuç kartı: risk seviyesi + madde referansları + yükümlülük tablosu + deadline countdown
- Claude zenginleştirme: ön değerlendirme sinyalleri, gri alan tespiti, GDPR çapraz referans
- Sonuç sisteme yazılır → dashboard'da risk rozeti güncellenir

**Teknik:**
- classifier-engine.ts (mevcut ✅, 25 test)
- /api/ai/classify-insight (mevcut ✅)
- Wizard UI component (mevcut hexis.center'da, SaaS adaptasyonu gerekli)

---

### Adım 3: Identify (Yükümlülükleri Tanımla)

**Kullanıcı deneyimi:** Risk seviyesine göre platform otomatik olarak yapılacaklar listesi oluşturur. Her yükümlülüğün yanında Claude advisor "nasıl yapılır?" rehberliği sunar. Kullanıcı her yükümlülük hakkında Claude ile konuşabilir.

**Özellikler:**
- Risk seviyesine göre filtrelenmiş yükümlülük listesi
  - High-risk → tam liste (tüm Art. 8-15 yükümlülükleri)
  - Limited risk → şeffaflık yükümlülükleri (Art. 50)
  - Minimal risk → iyi uygulamalar (Art. 95)
  - GPAI → Chapter V yükümlülükleri
- Her yükümlülük kartı: başlık, EU AI Act maddesi, deadline, açıklama, durum
- Durum değiştirme: Başlanmadı → Devam Ediyor → Tamamlandı → Doğrulandı
- Claude multi-turn advisor: her yükümlülük için "Bunu nasıl yapmalıyım?" sorusuna sisteme özel cevap
- "Nasıl yapılır?" rehberleri (her yükümlülük için yazılı rehber + Claude sohbet)
- İndirilebilir şablonlar (Word/Excel — Starter Kit'ten entegre)
- Filtreleme: duruma göre, deadline'a göre, önem sırasına göre
- İlerleme çubuğu: tamamlanan / toplam yükümlülük

**Teknik:**
- obligation-engine.ts (mevcut ✅)
- /api/ai/obligation-advisor (mevcut ✅)
- obligations tablosu + obligation_status tablosu (mevcut ✅)
- UI: obligations tracker (mevcut, geliştirilecek)

---

### Adım 4: Evaluate (Durumu Değerlendir)

**Kullanıcı deneyimi:** Kullanıcı üç boyutta (Oversight, Monitoring, Documentation) mevcut olgunluk seviyesini girer — ama bunu körü körüne yapmaz. Her boyut için rehber anket sunulur, cevaplara göre seviye otomatik önerilir, kullanıcı doğrular.

**Rehber Anket (8 Nisan Kararı):**
Her boyut girişinde 3-4 soruluk mini-anket:
- "Sisteminiz için yazılı bir gözetim prosedürü var mı?" → Evet/Hayır/Kısmen
- "Düzenli gözden geçirme toplantıları yapılıyor mu?" → Evet/Hayır/Kısmen
- "Gözetim sorumlusu resmi olarak atanmış mı?" → Evet/Hayır
Cevaplara göre seviye otomatik önerilir (örn: "Structured" → kullanıcı onaylar veya değiştirir)

**Seviye Kriterleri (kullanıcıya gösterilir):**

| Seviye | Oversight | Monitoring | Documentation |
|---|---|---|---|
| Absent | Hiç tanımlı gözetim yok | Hiç izleme mekanizması yok | Hiç yazılı kayıt yok |
| Ad Hoc | İnformel gözetim, yazılı rol yok | Ad hoc kontroller, sistematik değil | Bazı notlar var, standart yok |
| Structured | Yazılı prosedür, roller tanımlı | Düzenli kontroller, metrik yok | Standart şablonlar, düzenli güncelleme |
| Continuous | Otomatik izleme + eskalasyon | Gerçek zamanlı metrikler + alertler | Otomatik versiyon kontrolü + audit trail |
| Embedded | Organizasyonel DNA, dış denetim dahil | Prediktif analitik + otomatik müdahale | Tam entegre, sürekli güncellenen |

**Özellikler:**
- 3 boyut girişi: Oversight, Monitoring, Documentation (Absent → Embedded, 5 seviye) — rehber anketle desteklenir
- Risk Exposure otomatik (Adım 2'den) veya manuel seçim
- Governance Activation Matrix: 5×4 grid, ağırlıklı hesaplama
  - Oversight 1.5×, Monitoring 1.4×, Documentation 1.0×
  - Minimum safeguard principle (Absent caps at Ad Hoc)
- Focal cell: posture + hint + aciliyet göstergesi
- Callout: Activation posture + immediate action + 30-day target
- "Why this position?" — rule-based reasoning
- Claude yorumlama: "En kritik boşluğunuz X boyutunda. Öncelikli adımınız..."
- Benchmark karşılaştırma: Claude'un bilgi tabanından sektörel karşılaştırma
- Zaman karşılaştırma: önceki değerlendirmeyle delta gösterimi
- Boyut bazlı analiz: her boyut için ayrı derinlemesine değerlendirme

**Teknik:**
- matrix-engine.ts (mevcut ✅, 26 test)
- /api/ai yeni endpoint: evaluate-insight
- assessments tablosu (mevcut ✅)
- Matrix UI component (mevcut hexis.center'da, SaaS adaptasyonu gerekli)

---

### Adım 5: Navigate (Yol Haritası Çıkar)

**Kullanıcı deneyimi:** Claude, önceki 4 adımın tüm verisini analiz ederek kapsamlı bir aksiyon planı üretir. Kullanıcı bu planı Claude ile konuşarak revize eder. Görevler Kanban board'da izlenir.

**Özellikler:**

**5a. Claude-Driven Plan Üretimi:**
- Claude, şu verileri kullanarak plan üretir:
  - Observe: sistem kartı (ad, amaç, veri türü, AB pazarı)
  - Risk: sınıflandırma sonucu + bağlamsal analiz
  - Identify: tamamlanmamış yükümlülükler listesi
  - Evaluate: matrix sonucu + boşluk analizi
- Çıktı: önceliklendirilmiş görev listesi (structured output)
  - Her görev: başlık, açıklama, öncelik (critical/high/medium/low), tahmini süre, bağlı yükümlülük, sorumlu (atanabilir), milestone
  - Önceliklendirme mantığı: deadline yakınlığı × risk seviyesi × maturity gap

**5b. Konuşarak Revize:**
- Kullanıcı Claude ile plan üzerinde konuşabilir:
  - "Kaynaklarımız kısıtlı, sadece 2 kişilik ekibimiz var"
  - "Bütçemiz şu kadar, en kritik 5 adımı göster"
  - "Documentation'ı önce mi yoksa Monitoring'i önce mi halletmeliyim?"
- Claude planı revize eder ve gerekçesiyle sunar

**5c. Görev Yönetimi (Lansmanda: Liste Görünümü):**
- Görev listesi: başlık + öncelik rozeti + tahmini süre + durum dropdown (Backlog/Yapılacak/Devam/Tamamlandı)
- Filtreler: öncelik, sorumlu, milestone, yükümlülük
- Bağımlılık uyarısı: "Bu görev X tamamlanmadan başlayamaz"
- **Lansman sonrası:** Kanban board (drag-drop, dnd-kit ile) + Gantt chart görünümü

**5d. Milestone Takibi:**
- Ana milestone'lar: "İlk 30 gün", "90 gün", "Annex III deadline (Ağustos 2026)"
- Milestone başına ilerleme yüzdesi
- Claude: milestone yaklaştığında durum değerlendirmesi

**Teknik (yeni):**
- /api/ai/generate-plan endpoint (Claude Sonnet — complex reasoning)
- /api/ai/revise-plan endpoint (multi-turn conversation)
- action_plans tablosu (yeni migration gerekli)
- action_items tablosu (yeni migration gerekli)
- Kanban UI component (shadcn/ui + drag-drop library)

---

### Adım 6: Track (Takip Et)

**Kullanıcı deneyimi:** Tek bakışta genel uyum durumu. Her sistem için ilerleme. Yaklaşan deadline'lar. Profesyonel PDF raporlar farklı kitleler için. E-posta ile hatırlatmalar.

**Özellikler:**

**6a. Dashboard:**
- Genel uyum skoru (0-100, ağırlıklı hesaplama)
  - Yükümlülük tamamlanma oranı (%40 ağırlık)
  - Maturity seviyesi (%30)
  - Aksiyon planı ilerleme (%20)
  - Dokümantasyon tamamlanma (%10)
- Sistem bazlı ilerleme kartları (her sistem için mini skor)
- Risk dağılımı grafiği (pie chart: kaç sistem hangi risk seviyesinde)
- Yaklaşan deadline takvimi (önümüzdeki 30-60-90 gün)
- Zaman içinde ilerleme grafiği (line chart: aylık skor değişimi)
- "Dikkat gerektiren" uyarılar (deadline yaklaşan, gap büyük olan)

**6b. PDF Raporlar:**

*Lansmanda: Genel Uyum Raporu (1 format, 4-6 sayfa):*
- Genel uyum skoru + trend
- Risk haritası (kaç sistem, hangi seviye)
- Yükümlülük tamamlanma özeti
- Top 5 kritik aksiyon
- Yaklaşan deadline'lar
- Hexis markalı, profesyonel tasarım
- **Kullanıcı onayı ile üretilir** — rapor öncesi veri doğrulama ekranı

*Lansman sonrası: Board Summary (2-3 sayfa, üst düzey)*
*Lansman sonrası: DPO Detay Raporu (8-12 sayfa)*
*Lansman sonrası: Denetçi Kanıt Dosyası — Claude yorumu OLMAZ, sadece audit trail*

**6c. E-posta Bildirimleri:**
- Deadline hatırlatmaları (30 gün, 14 gün, 7 gün önce)
- Haftalık ilerleme özeti (isteğe bağlı)
- Kritik uyarılar (yeni düzenleme değişikliği, deadline değişikliği)

**6d. Claude Yorumlama:**
- Dashboard'da "Bu ay..." AI özeti
- Her raporda Claude'un bağlamsal yorumu
- Kitleye adapte dil: board için stratejik, DPO için teknik, denetçi için kanıt odaklı

**Teknik (yeni):**
- /api/ai/track-insight endpoint
- /api/ai/generate-report endpoint (3 farklı prompt template)
- /api/reports API route'ları
- compliance_snapshots tablosu (mevcut ✅)
- PDF generation (React → PDF library: @react-pdf/renderer)
- Resend entegrasyonu (e-posta bildirimleri)
- Cron job veya Supabase Edge Function (deadline kontrolü)

---

## Çapraz Özellikler (Tüm Adımları Etkileyen)

### Onboarding (İlk Giriş)
- "3 adımda başlayın" rehberli akış
- İlk AI sistemi ekleme → risk sınıflandırma → ilk matrix → "İşte durumunuz"
- Boş durum yönetimi (her sayfada anlamlı yönlendirme)

### Claude Compliance Advisor (Her Adımda)
- Floating chat butonu — her sayfada erişilebilir
- Bağlam farkında: hangi sayfadaysa, o adımın verisini bilir
- Multi-turn conversation (önceki mesajları hatırlar)
- Disclaimer her yanıtta: "This is general compliance guidance, not legal advice."

### Claude Güvenilirlik Denetimi (8 Nisan Kararı)

**Madde Doğrulama Katmanı:**
- Claude bir madde numarası cite ettiğinde (örn. "Article 14(1)"), bu numara veritabanındaki madde listesiyle otomatik karşılaştırılır
- Eşleşmezse → kullanıcıya uyarı: "Bu madde referansı doğrulanamadı"

**Güven Seviyesi Göstergesi:**
Her Claude yanıtında 4 seviyeli etiket:
- 🟢 "Clearly required by law" — maddede açıkça yazıyor
- 🟡 "Likely applies" — bağlama göre büyük olasılıkla geçerli
- 🟠 "Gray area — seek legal counsel" — belirsiz, hukuki danışmanlık gerekli
- ⚪ "General best practice" — yasal zorunluluk değil, iyi uygulama

**Kaynak Göster Butonu:**
- Her Claude tavsiyesinin yanında "Show source" → ilgili EU AI Act maddesi tam metni

**Audit Log:**
- Claude'un her yanıtı kaydedilir — kullanıcı "Claude bana ne dedi?" görebilir
- Denetçi kanıt dosyasına dahil edilebilir

### Ödeme Akışı
- Landing page → "Start Now" → email/Google signup → Stripe checkout
- €9 ilk ay → otomatik €29/ay'a geçiş
- Ödeme yapılmadan dashboard'a erişim yok
- Fatura: Stripe otomatik (şirket kurulunca Hexis OÜ faturası)

### Regulatory Radar — Mevzuat Değişiklik Takibi (8 Nisan Kararı)

Platformu vazgeçilmez kılan özellik. Kullanıcının aylık €29 ödemeye devam etme nedeni:
- EU AI Act ekosistemindeki değişiklikleri otomatik takip
- Digital Omnibus gelişmeleri
- Avrupa Komisyonu kılavuz dokümanları (guidelines)
- Harmonised standards yayınlanması
- Ulusal uygulama farklılıkları
- Yeni enforcement kararları
- Kullanıcıya "bu seni etkiler" bildirimi (risk seviyesine göre filtrelenmiş)
- Dashboard'da "Regulatory Radar" widget'ı

**Teknik:** Haftalık Claude-driven içerik üretimi + kullanıcının sistemine özelleştirme. Hexis newsletter içeriğiyle senkronize.

---

### Güvenlik & Trust — Üst Düzey Koruma (8 Nisan Kararı — Detaylı)

**"AI governance platformu güvenlik açığı verirse — ironik bir felaket olur."**

**1. Veri İzolasyonu:**
- RLS her tabloda (org-scoped) — her organizasyon sadece kendi verisini görür
- Her yeni tablo için otomatik RLS test'i
- Cross-org data leak testi validation suite'e eklenecek

**2. Claude API Veri Güvenliği:**
- Claude'a gönderilen veride şirket adı, kişi adları GÖNDERİLMEZ
- Sistem adı ve amacı gönderilir (governance meta-verisi)
- Her Claude çağrısında ne gönderildiğinin log'u tutulur
- Kullanıcı "Claude'a ne gönderdiniz?" görebilir (şeffaflık)
- Anthropic API ToS: veriler model eğitiminde kullanılmaz

**3. Veri Minimizasyonu:**
- Platform sadece governance meta-verisini işler
- Kullanıcının operasyonel verisine (müşteri listeleri, model ağırlıkları) dokunmaz
- UI'da açıkça belirtilir: "Hexis never accesses your AI system's data — only governance metadata"

**4. Authentication:**
- Email + password (Supabase Auth)
- Google OAuth (lansmanda)
- MFA (Multi-Factor Authentication) — lansman sonrası
- Idle timeout (30 dakika)
- Forced re-auth: rapor indirme, veri silme gibi hassas işlemler

**5. Audit Trail:**
- Kim, ne zaman, neyi değiştirdi — her işlem loglanır
- audit_log tablosu + Supabase trigger'lar
- Denetçi kanıt dosyasının temeli

**6. Data Residency:**
- Supabase EU region (Frankfurt, eu-central-1)
- Tüm veri AB içinde
- Trust sayfasında açıkça belirtilir

**7. hexis.center/trust Sayfası (Lansmanda Hazır):**
- Veri lokasyonu: AB (Frankfurt)
- Şifreleme: AES-256 (at-rest) + TLS 1.3 (in-transit)
- Erişim kontrolü: RLS + org-scoped
- AI politikası: veri eğitimde kullanılmaz, ne gönderildiği şeffaf
- GDPR hakları: erişim, düzeltme, silme (CASCADE), taşınabilirlik
- Incident response planı
- SOC 2 Type II badge (Supabase)

**8. Rapor Üretiminde Veri Onayı:**
- Kullanıcı "Rapor üret" dediğinde → önce onay ekranı
- "Bu rapor şu verilere dayanacaktır:" → özet tablo
- Kullanıcı verileri gözden geçirir, düzeltir, onaylar
- Her raporda: "Bu rapor [tarih] itibarıyla girdiğiniz verilere dayanmaktadır"
- Denetçi kanıt dosyasında Claude yorumu OLMAZ — sadece "kim, ne zaman, ne yaptı" audit trail

---

## Lansman Hazırlığı (Platform Dışı)

### Pazarlama Altyapısı
- hexis.center/platform landing page (SaaS tanıtım)
- LinkedIn lansman kampanyası (4 hafta öncesinden başlayan teaser serisi)
- Product Hunt lansmanı (hazırlık + timing)
- Blog serisi: "How we built an AI governance platform" (SEO + authority)
- Beehiiv newsletter: lansman duyurusu + early access

### Şirket Kurulumu (Paralel)
- e-Residency kart alımı (konsolosluk randevusu)
- Hizmet sağlayıcı seçimi (yasal adres + muhasebe)
- Hexis OÜ kuruluşu (e-Business Portal)
- Wise Business hesap açılışı
- Stripe bağlantısı (OÜ üzerinden)

### Yasal Altyapı
- Terms of Service (app.hexis.center)
- Privacy Policy (GDPR uyumlu)
- AI Disclosure Policy (Claude kullanımı şeffaflığı)
- Cookie Policy
- Refund Policy (dijital ürün — 14 gün EU)

---

## Zaman Çizelgesi — Revize (8 Nisan Kararı)

Navigate basitleştirmesi (Kanban → liste) ile 1 hafta, Track basitleştirmesi (3 rapor → 1) ile 1 hafta kazanıldı. Regulatory Radar + güvenlik katmanları + rehber anket eklendiğinde net tasarruf ~1 hafta.

| Hafta | Tarih | Odak | Detay |
|-------|-------|------|-------|
| H1 | 8-13 Nisan | Observe UI + Dashboard | Sistem ekleme, liste, kart, boş durum, manuel mod toggle |
| H2 | 14-20 Nisan | Risk Wizard UI | 7 adımlı wizard, sonuç kartı, Claude insight, risk-adaptive flow |
| H3 | 21-27 Nisan | Identify UI + Advisor | Yükümlülük listesi, durum değiştirme, güven seviyesi etiketi |
| H4 | 28 Nis-4 May | Evaluate UI + Matrix | Rehber anket, matrix, Claude yorumlama, madde doğrulama |
| H5 | 5-11 Mayıs | Navigate — Plan + liste | Claude plan üretimi + revize chat + görev listesi + DB migration |
| H6 | 12-18 Mayıs | Track — Dashboard + skor + PDF | Uyum skoru, deadline takvimi, 1 PDF rapor formatı (veri onaylı) |
| H7 | 19-25 Mayıs | Ödeme + onboarding | Stripe akışı, €9→€29, rehberli ilk giriş |
| H8 | 26 May-1 Haz | Güvenlik + audit trail | RLS audit, audit_log, Claude veri log'u, session timeout |
| H9 | 2-8 Haziran | E-posta + Regulatory Radar | Resend, deadline hatırlatma, mevzuat takip widget |
| H10 | 9-15 Haziran | Landing page + trust + yasal | Pazarlama sayfaları, trust sayfası, TOS (Xolo template + AI disclaimer) |
| H11 | 16-22 Haziran | Rekabet analizi + positioning | Vanta/OneTrust/Comply.ai analizi, farklılaştırma dokümanı |
| H12 | 23-29 Haziran | Integration test + QA | Uçtan uca test, cross-browser, mobile, PDF, güvenlik testi |
| H13 | 30 Haz-6 Tem | Polish + bug fix | Son düzeltmeler, performans, edge case'ler |
| H14 | 7-13 Temmuz | Soft launch | İlk kullanıcılar, geri bildirim toplama |

**Hedef lansman: ~7 Temmuz 2026**
**Annex III deadline'a mesafe: ~4 hafta (2 Ağustos)**

### Paralel İş Akışları

| İş | Tarih | Bağımlılık |
|----|-------|-----------|
| e-Residency kart alımı | Nisan sonu - Mayıs başı | Konsolosluk randevusu |
| Hizmet sağlayıcı araştırma + anlaşma | Şimdi başla | Yok |
| Hexis OÜ kuruluşu | Kart alımından 1 hafta sonra | e-Residency kart |
| Wise Business hesap | OÜ kuruluşundan 1-2 hafta sonra | OÜ tescil |
| Stripe bağlantısı | Wise hesaptan 1 hafta sonra | OÜ + banka hesabı |
| LinkedIn teaser kampanyası | Haziran başı (lansmandan 4 hafta önce) | Landing page hazır |
| Product Hunt hazırlık | Haziran ortası | Ürün çalışır durumda |

---

## Claude API Maliyet Analizi (8 Nisan — Doğrulanmış)

### Güncel Fiyatlar (Nisan 2026)

| Model | Input ($/M token) | Output ($/M token) | Cache Hit | Batch |
|---|---|---|---|---|
| Haiku 4.5 | $1 | $5 | %90 indirim | %50 indirim |
| Sonnet 4.6 | $3 | $15 | %90 indirim | %50 indirim |

### 100 Organizasyon Senaryosu (%40 aktif = 40 kullanıcı)

| İşlem | Model | Aylık maliyet |
|---|---|---|
| Risk yorumu | Haiku | $1.0 |
| Identify advisor | Haiku | $2.6 |
| Evaluate analiz | Haiku | $1.5 |
| Navigate plan | Haiku (Sonnet yerine) | $2.8 |
| Track rapor | Haiku | $2.0 |
| Genel chat | Haiku | $2.6 |
| System prompt (cached) | — | $2.8 |
| **TOPLAM** | | **~$15-23/ay** |

### Maliyet Optimizasyon Stratejisi
- **Prompt caching:** System prompt'taki 32.5K token EU AI Act referansı %90 indirimli
- **Haiku agresif kullanımı:** Navigate/Track'te Sonnet yerine Haiku 4.5 (yeterli kalite)
- **Response caching:** Aynı sistem + aynı risk + aynı soru → cache'ten. Cache key: sistem kartının tamamı. Sistem verisi değişince cache invalidate. 7 gün TTL
- **Batch API:** Sadece arka plan işleri için (haftalık özet, toplu rapor). Bireysel isteklerde kullanılmaz (UX kırılır)
- **Brüt marj:** %95+ (100 kullanıcıda toplam maliyet ~$69, gelir ~€2.900)

---

## Rekabet Analizi (İş Akışına Eklenecek — H11)

Araştırılacak platformlar:
- **Vanta** — otomatik compliance kanıt toplama (SOC 2, ISO 27001, AI modülü geliyor)
- **OneTrust** — enterprise privacy + AI risk (€50K+/yıl)
- **Drata** — SOC 2/ISO compliance otomasyon
- **Comply.ai** — UK startup, EU AI Act odaklı (en yakın rakip)
- **Holistic AI** — AI risk yönetimi platformu

**Hexis farklılaştırıcıları:**
- ORIENT metodolojisi (özgün fikri mülkiyet)
- KOBİ self-serve (€29/ay vs enterprise €50K+)
- AI-assisted, not AI-dependent
- ISO 42001 Implementer sertifikası
- Mevcut canlı ücretsiz araçlar (SEO + güven)
- Regulatory Radar (sürekli değer)

---

## Yasal Altyapı Kararları (8 Nisan)

| Konu | Karar | Detay |
|---|---|---|
| 657 + MoR | Avukat danışıldı, risk kabul edildi | Türk avukat ile görüşüldü |
| TOS | Xolo template + AI disclaimer | Xolo yasal danışmanı gözden geçirecek |
| Privacy Policy | Xolo template + GDPR uyum | Veri minimizasyonu vurgusu |
| AI Disclosure | Hexis yazacak | Claude kullanımı, ne gönderildiği, veri eğitimde kullanılmadığı |
| Hukuki sorumluluk | Disclaimer + limitation of liability | "Not legal advice" + kullanıcı girdisine dayalı sonuç |

---

## Risk Analizi (Revize)

| Risk | Olasılık | Etki | Önlem |
|------|----------|------|-------|
| Navigate scope creep | Düşük (artık) | — | Liste görünümü kesinleşti, Kanban lansman sonrası |
| PDF rapor karmaşıklığı | Düşük (artık) | — | 1 format kesinleşti, diğerleri lansman sonrası |
| Stripe + OÜ zamanlama | Orta | Lansmanda ödeme alamama | Plan B: LemonSqueezy ile geçici ödeme |
| e-Residency kart gecikmesi | Düşük | Şirket gecikir | 2 hafta tampon |
| Claude API maliyet | Çok düşük | — | %95+ marj doğrulandı |
| RLS data leak | Orta | Kritik — güven kaybı | H8'de RLS audit + otomatik test |
| Hukuki sorumluluk | Orta | Dava riski | TOS disclaimer + Xolo yasal danışman |
| Ücretsiz araç arbitrajı | Orta | Düşük dönüşüm | Regulatory Radar + Navigate/Track = SaaS-exclusive değer |

---

## "Kapsam şişmesi testi" — Her Özellik İçin

Her yeni özellik önerisi bu sorudan geçmeli:
1. "Bu olmadan kullanıcı €29/ay öder mi?" → Hayır ise ertele
2. "Bu, danışmanın yapacağı bir iş mi?" → Evet ise Claude yapmalı
3. "Bu, 1 haftadan fazla sürer mi?" → Evet ise bölümlere ayır
4. "Bu, başka bir özelliğe bağımlı mı?" → Evet ise sıralama kontrol et

---

## Şirket Kurulumu — Yol Haritası (8 Nisan)

**Tavsiye edilen hizmet sağlayıcı:** Xolo Leap (Standard Plan, €89/ay)
- Şirket kuruluşu: €290 (Xolo aracılığıyla)
- Yıllık maliyet: ~€1.068 (muhasebe dahil)
- İlk yıl toplam: ~€1.508

**Şimdi yapılacaklar (kart beklenmeden):**
- [ ] Xolo ile iletişime geç, plan seç
- [ ] Şirket adını kesinleştir (Hexis OÜ / HEXIS AI OÜ)
- [ ] Wise Business hesap başvurusu hazırla
- [ ] Business description hazırla (İngilizce)

**Kart gelince:**
- [ ] Konsolosluk → kart al
- [ ] Xolo'ya bildir → 1-3 iş günü OÜ kuruluşu
- [ ] Wise Business IBAN aktif (1-2 hafta)
- [ ] Stripe hesabı doğrulama (1-2 hafta)

**Hedef:** Mayıs ortasına kadar şirket + banka + Stripe hazır

---

*Bu doküman, 8 Nisan 2026 tarihli stratejik tartışmanın kesinleşen kararlarını içermektedir. Her tartışmada referans olarak kullanılacaktır. Karar değişikliklerinde güncellenecektir.*
