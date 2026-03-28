# Gün 2 — Kişisel Verilerin İşlenme Şartları

**Faz:** Faz 1 — KVKK Temelleri
**Maddeler:** KVKK Madde 4, 5, 6
**ORIENT Eşlemesi:** Identify — hangi hukuki temele dayanarak veri işliyorsun?
**Tarih:** 23 Mart 2026

---

## BLOK 1 — Kaynak + Kavrama (15 dk)

### Büyük Resim

Dün Gün 1'de KVKK'nın yapısını, "kişisel veri" tanımını ve temel kavramları gördük. Bugün bunun üstüne en kritik katmanı ekliyoruz: **veri işlemenin meşruiyet zemini**. Yani bir veri sorumlusu olarak "Bu veriyi işleyebilir miyim?" sorusuna nasıl cevap verilir.

Bu üç madde (4, 5, 6) birlikte bir piramit oluşturuyor:

- **Madde 4** = Tüm işleme faaliyetlerinin üzerinde duran genel ilkeler (her koşulda geçerli)
- **Madde 5** = Kişisel verilerin işlenme şartları (hukuka uygunluk sebepleri)
- **Madde 6** = Özel nitelikli kişisel verilerin işlenme şartları (daha katı rejim)

---

### Madde 4 — Genel İlkeler: Her Şeyin Temeli

Madde 4(2), kişisel veri işlemenin 5 temel ilkesini sayar. Bu ilkeler, hukuki temel ne olursa olsun (açık rıza da dahil) **her zaman** geçerlidir:

**(a) Hukuka ve dürüstlük kurallarına uygun olma**
Teknik olarak yasal olan bir işlem, dürüstlük kurallarına aykırı olabilir. Örneğin: kullanıcıdan açık rıza almak ama rıza formunu 47 sayfalık bir sözleşmenin içine gömmek — hukuka uygun gibi görünür, ama dürüstlük ilkesine aykırıdır.

**(b) Doğru ve gerektiğinde güncel olma**
AI bağlamında kritik: Eğitim verisindeki yanlışlıklar modelin çıktısını bozar. Bir kredi skorlama AI'ı eski adres bilgisiyle karar veriyorsa, bu ilke ihlal edilmiş olur.

**(c) Belirli, açık ve meşru amaçlar için işlenme**
"Amaç sınırlılığı" prensibi. Müşteri hizmetleri için toplanan veri, sonradan pazarlama amacıyla kullanılamaz — **amaç kayması (purpose creep)** yasak.

**(ç) İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü olma**
Veri minimizasyonu. "Big data = daha iyi AI" mantığı, bu ilkeyle doğrudan çatışır. Sadece amaca ulaşmak için gerekli olan kadar veri toplanmalı.

**(d) İlgili mevzuatta öngörülen veya işlendikleri amaç için gerekli olan süre kadar muhafaza edilme**
Saklama süresi ilkesi. AI model eğitimi tamamlandıktan sonra eğitim verisini ne kadar süre tutacaksın? Bu sorunun cevabı olmalı.

**Neden önemli?** Madde 4 olmasaydı, bir veri sorumlusu "açık rızam var, istediğimi yaparım" diyebilirdi. Bu ilkeler, açık rızanın bile sınırsız bir yetki olmadığını garanti eder.

**Hexis perspektifi:** ORIENT'in Observe aşamasında veri akışlarını tanımlarken, bu 5 ilkeyi bir "filtre" olarak kullan. Her veri akışı bu 5 ilkeden geçmeli.

---

### Madde 5 — Kişisel Verilerin İşlenme Şartları: 7 Kapı

Madde 5(1): Temel kural — kişisel veriler **açık rıza** olmadan işlenemez.

Madde 5(2): Ama 7 istisna var. Bu istisnaların **herhangi biri** varsa, açık rıza gerekmez:

| # | Hukuka Uygunluk Sebebi | AI Bağlamında Örnek |
|---|---|---|
| 1 | **Kanunlarda açıkça öngörülme** | Vergi mevzuatı gereği e-fatura verisi işlenmesi |
| 2 | **Fiili imkânsızlık** | Bilinçsiz hastanın sağlık verisinin acil müdahale için işlenmesi |
| 3 | **Sözleşmenin kurulması/ifası** | SaaS müşterisinin kullanım verisinin hizmet sunumu için işlenmesi |
| 4 | **Hukuki yükümlülük** | İşverenin SGK bildirimi için çalışan verisini işlemesi |
| 5 | **Alenileştirme** | Kişinin LinkedIn'de kendisi paylaştığı bilgilerin işlenmesi |
| 6 | **Hakkın tesisi/kullanılması/korunması** | Dava sürecinde ispat için veri işlenmesi |
| 7 | **Meşru menfaat** | Güvenlik kamerası kaydı; AI model eğitimi (denge testiyle) |

**Kritik nüans — "meşru menfaat" kapısı:**
AI şirketleri için en çok tartışılan hukuki temel budur. "AI modelimizi eğitmek için müşteri verisini kullanmamız meşru menfaatimizdir" demek kolay — ama KVKK bunu bir **denge testine** bağlıyor: senin menfaatin mi ağır, kişinin temel hak ve özgürlükleri mi?

Kurul'un yaklaşımı: Meşru menfaat, "son çare" değil ama "en kolay yol" da değil. Bir **Meşru Menfaat Değerlendirmesi (LIA — Legitimate Interest Assessment)** yapılması beklenir.

**Önemli pratik uyarı (KVKK Kurumu'nun vurgusu):**
Eğer bir veri işleme faaliyeti açık rıza dışındaki bir şarta dayanabiliyorsa, o zaman açık rızaya dayandırmak **aldatıcı ve hakkın kötüye kullanımı** niteliğindedir. Yani: "Hem meşru menfaatim var, hem de açık rıza aldım — çift sigorta" yaklaşımı yanlış. Doğru hukuki temeli seç ve ona dayan.

---

### Madde 6 — Özel Nitelikli Kişisel Veriler: Daha Katı Rejim

Özel nitelikli kişisel veri kategorileri: ırk, etnik köken, siyasi düşünce, felsefi inanç, din, mezhep, kılık-kıyafet, dernek/vakıf/sendika üyeliği, sağlık, cinsel hayat, ceza mahkumiyeti, biyometrik ve genetik veriler.

**2024 Değişikliği — Önemli güncelleme:**
7499 sayılı Kanun ile Madde 6, 1 Haziran 2024'te köklü şekilde değişti:

1. **Sağlık ve cinsel hayat ayrımı kaldırıldı.** Eskiden bu iki kategori ayrı (daha katı) bir rejime tabiydi; artık tüm özel nitelikli veriler aynı çerçeveye tabi.

2. **İşleme şartları 8 bende genişletildi.** Eski düzenlemede istisnaların sınırlı olması, uygulamada "zorunlu açık rıza" krizine yol açıyordu. Yeni düzenleme GDPR ile uyumlu hale getirildi.

3. **Yeni eklenen şartlar arasında dikkat çekenler:**
   - İstihdam, iş sağlığı/güvenliği, sosyal güvenlik alanlarında işleme
   - Kâr amacı gütmeyen kuruluşların üye verileri
   - Tıbbi amaçlarla yetkili kişilerce işleme

**AI bağlamında neden kritik?**
Yüz tanıma → biyometrik veri (özel nitelikli). Duygu analizi → potansiyel olarak sağlık verisi. Sağlık AI'ı → doğrudan sağlık verisi. Bu sistemlerin tamamı Madde 6 kapsamında ve **meşru menfaat bu kategoride hukuki temel olarak kullanılamaz**.

---

### ORIENT Eşlemesi

Bu üç madde doğrudan ORIENT'in **Identify** aşamasına giriyor:

| ORIENT Aşaması | Madde 4-5-6 İlişkisi |
|---|---|
| **O — Observe** | Veri akışlarını tanımla (Gün 1'de yaptık) |
| **R — Risk** | Özel nitelikli veri var mı? Risk seviyesi ne? |
| **I — Identify** | ← **Bugünün odağı:** Hangi hukuki temele dayanıyorsun? |
| **E — Evaluate** | Seçilen hukuki temel yeterli mi? Boşluk var mı? |
| **N — Navigate** | Eksik varsa ne yapılacak? (LIA hazırla, rıza mekanizması kur…) |
| **T — Track** | Hukuki temel değişirse (yeni Kurul kararı) güncelle |

**Hexis perspektifi:** Hexis Generator'da "Observe" aşamasında "kişisel veri işleniyor mu?" sorusu var. Eğer evet ise, Identify aşamasında **otomatik olarak** Madde 5 ve Madde 6 hukuki temel seçim menüsü sunulabilir. Bu, generator'un bir sonraki geliştirme adımı olabilir.

---

## BLOK 2 — Derinleştirme + Sorgulama (15 dk)

**Yöntem:** Bu sorular sırayla, birer birer sorulacak. Her soru cevaplandıktan sonra geri bildirim verilecek ve bir sonrakine geçilecek.

### Soru 1 — Kavram Sınama (Genel İlkeler)

Bir e-ticaret şirketi, müşteri sipariş geçmişini kullanarak kişiselleştirilmiş ürün önerileri sunan bir AI sistemi geliştiriyor. Müşterilerden sipariş sırasında "kişisel verilerimin işlenmesine onay veriyorum" şeklinde genel bir açık rıza almışlar.

**Soru:** Bu şirketin Madde 4'teki hangi ilkeleri potansiyel olarak ihlal etme riski var? Neden?

**Beklenen cevap çerçevesi:**
- **(c) Belirli, açık ve meşru amaçlar:** "Kişisel verilerimin işlenmesi" çok genel — hangi amaç için? Sipariş işleme mi, öneri sistemi mi? Amaç belirli değil.
- **(ç) Amaçla bağlantılı, sınırlı ve ölçülü:** Sipariş verisi toplamak ile AI tabanlı öneri sistemi eğitmek farklı amaçlar — amaç kayması riski.
- **(a) Dürüstlük:** Genel bir rıza metniyle farklı amaçlar için veri kullanmak, ilgili kişinin makul beklentisiyle uyuşmayabilir.

---

### Soru 2 — Senaryo Testi (Hukuki Temel Seçimi)

Bir Türk fintech şirketi, kredi başvurularını değerlendirmek için AI modeli geliştiriyor. Modeli eğitmek için son 5 yılın kredi başvuru verilerini (gelir, meslek, yaş, adres, kredi geçmişi) kullanmak istiyor.

**Soru:** Bu şirket eğitim verisi işleme faaliyeti için hangi Madde 5(2) hukuki temeline dayanabilir? "Meşru menfaat" dersen, denge testinde hangi argümanları sunarsın?

**Beklenen cevap çerçevesi:**
- Meşru menfaat (Madde 5(2)(f)) en uygun görünüyor — ama otomatik değil.
- Denge testinde şirket lehine: Finansal istikrar, daha doğru kredi kararları, müşterinin de yararına (uygun kredi)
- Kişi lehine: 5 yıllık veri kapsamı geniş, veriler hassas finansal bilgiler, profilleme riski
- Azaltıcı tedbirler: Anonimizasyon/psödonimizasyon, veri minimizasyonu, erişim kontrolü
- **Komplikasyon:** Adres verisi etnik köken tahminine yol açabilir → Madde 6 kapsamına kayar mı?

---

### Soru 3 — Karşılaştırma (Madde 5 vs. Madde 6)

**Soru:** Bir AI destekli işe alım sistemi, adayların video mülakatlarındaki yüz ifadelerini analiz ederek "güven skoru" üretiyor. Bu sistem Madde 5 kapsamında mı yoksa Madde 6 kapsamında mı değerlendirilmeli? 2024 değişikliği bu analize nasıl etki eder?

**Beklenen cevap çerçevesi:**
- Yüz ifadesi analizi → biyometrik veri işleme → **Madde 6 kapsamı**
- Duygu analizi boyutu → potansiyel olarak sağlık verisi (psikolojik durum çıkarımı) → yine Madde 6
- 2024 değişikliğiyle sağlık verisi artık ayrı bir rejimde değil, tüm özel nitelikli verilerle aynı çerçevede
- Meşru menfaat özel nitelikli veriler için kullanılamaz → açık rıza veya kanunda öngörülme gerekir
- İş başvurusu bağlamında "açık rıza" tartışmalı — güç dengesizliği (aday reddederse işe alınmayacağını düşünür)
- EU AI Act bağlantısı: Bu sistem Madde 5 (yasaklar) kapsamına girebilir (emotion recognition + istihdam)

---

### Soru 4 — Metodoloji Geliştirme (ORIENT)

**Soru:** ORIENT'in Identify aşamasında hukuki temel belirleme yapılıyor. Ama pratikte, veri sorumluları genellikle "hepsine açık rıza alırız, sorun olmaz" yaklaşımı benimsiyor. Bu yaklaşımın nesi yanlış ve ORIENT metodolojisi bunu nasıl düzeltebilir?

**Beklenen cevap çerçevesi:**
- KVKK Kurumu açıkça söylüyor: Başka hukuki temel varken açık rızaya dayanmak "aldatıcı ve hakkın kötüye kullanımı"
- Açık rıza geri alınabilir → tüm işleme faaliyeti temelsiz kalır
- Güç dengesizliği durumlarında (işveren-çalışan, kamu-vatandaş) açık rıza "özgür irade" koşulunu sağlamaz
- **ORIENT'te çözüm:** Identify aşamasında "hukuki temel seçim matrisi" → her veri işleme faaliyeti için en uygun temeli sistematik şekilde belirle, açık rızayı yalnızca gerçekten gerekli olduğunda kullan
- Hexis araç fırsatı: Generator'a "hukuki temel önerici" modülü eklenebilir

---

## BLOK 3 — ORIENT Notu Şablonu + Metodoloji (10 dk)

### Study-log Kaydı (oturum sonrası doldurulacak)

```
---
### Gün 2 — 23 Mart 2026 — Kişisel Verilerin İşlenme Şartları
**Faz:** Faz 1 — KVKK Temelleri
**ORIENT:** Identify
**Durum:** Materyal hazırlandı — oturum bekliyor
**Öğrenilenler:** [Oturum sonrası doldurulacak]
**Sorgulama çıktısı:** [Oturum sonrası doldurulacak]
**Hexis metodoloji notu:** [Oturum sonrası doldurulacak]
**İçerik fırsatı:** [Oturum sonrası doldurulacak]
**Açık soru:** [Oturum sonrası doldurulacak]
---
```

### Hexis İçerik Fırsatları

1. **Blog yazısı:** "AI Eğitim Verisi İçin Hangi Hukuki Temel? KVKK Madde 5 Rehberi" — meşru menfaat denge testi odaklı, pratik bir yazı. Hexis'in uzmanlık alanını gösterir.

2. **LinkedIn gönderi:** "Açık rıza ≠ sınırsız yetki. KVKK Madde 4'ün 5 ilkesi, rıza alsan bile geçerli." — kısa, etkili, Hexis marka sesine uygun.

3. **Generator geliştirme:** Identify aşamasında "hukuki temel seçim matrisi" — veri türü + işleme amacı → önerilen hukuki temel. Bu, generator'un değerini önemli ölçüde artırır.

4. **Checklist güncelleme:** eu-ai-act-checklist.html'de Madde 5/6 referanslarıyla KVKK-AI Act çapraz kontrol noktaları eklenebilir.

---

## Kaynaklar (Doğrulanmış)

- [KVKK Madde 4 — Genel İlkeler](https://www.kvkk.gov.tr/Icerik/2049/Kisisel-Verilerin-Islenmesinde-Genel-(Temel)-Ilkeler)
- [KVKK Madde 5 — İşlenme Şartları](https://www.kvkk.gov.tr/Icerik/4190/Kisisel-Verilerin-Islenme-Sartlari)
- [KVKK Madde 6 — Özel Nitelikli Kişisel Veriler Rehberi (Şubat 2025)](https://www.kvkk.gov.tr/Icerik/8184/Ozel-Nitelikli-Kisisel-Verilerin-Islenmesine-Iliskin-Rehber)
- [Üretken Yapay Zekâ ve Kişisel Verilerin Korunması Rehberi (Kasım 2025)](https://www.kvkk.gov.tr/Icerik/8547/uretken-yapay-zeka-ve-kisisel-verilerin-korunmasi-rehberi-15-soruda)
- [KVKK Kanun Tam Metni](https://mevzuat.gov.tr/mevzuat?MevzuatNo=6698&MevzuatTur=1&MevzuatTertip=5)
- [EU AI Act Article 10 — Data and Data Governance](https://artificialintelligenceact.eu/article/10/)
- [7499 sayılı Kanun — Madde 6 Değişikliği](https://turunc.av.tr/news/kisisel-verilerin-korunmasi-kanununda-yapilan-onemli-degisiklikler/)
