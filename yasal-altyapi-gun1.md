# Yasal Altyapı Ustalığı — Gün 1
**Tarih:** 22 Mart 2026
**Faz:** Faz 1 — KVKK Temelleri
**Konu:** KVKK'nın Yapısı ve Temel Kavramlar
**Maddeler:** Madde 1 (Amaç), Madde 2 (Kapsam), Madde 3 (Tanımlar)
**ORIENT:** Observe — sistemi, rolleri ve veri akışlarını tanımlama

---

## BLOK 1 — Okuma Materyali (15 dk)

### Kanunun Genel Çerçevesi

6698 sayılı Kişisel Verilerin Korunması Kanunu 7 Nisan 2016'da yürürlüğe girdi. GDPR'dan birkaç ay önce kabul edildi; ama teknik olarak GDPR'ın öncülü olan 1995 tarihli AB Direktifi'ni referans aldı. Bu durum KVKK ile GDPR arasında önemli yapısal benzerliklere yol açtı — ama kritik farklılıklar da var.

---

### Madde 1 — Amaç

**Madde metni (özet):** Kişisel verilerin işlenmesinde başta özel hayatın gizliliği olmak üzere kişilerin temel hak ve özgürlüklerini korumak; kişisel verileri işleyen gerçek ve tüzel kişilerin yükümlülükleri ile uyacakları usul ve esasları düzenlemek.

**Kritik nokta:** Kanunun amacı salt "veri güvenliği" değil — **temel hak ve özgürlük** koruması. Bu ayrım önemli: veriyi güvenli sakladım ama amacım dışında kullandım, yine de ihlal.

**Neden önemli?** Bu madde olmasa: kişisel verileri işleyen her şirket kendi çıkarına göre hareket eder. Kişi, verisinin nerede, nasıl kullanıldığını bilemez ve itiraz edemez. AI bağlamında bu özellikle kritik — modeller veri kullanımında şeffaflıktan uzak çalışabiliyor.

**ORIENT — Observe:** "Kanunun amacı nedir?" sorusu her uyum çalışmasının başında sorulmalı. Temel hak koruması perspektifi, Observe aşamasında veri akışını haritalandırırken "bu veri kullanımı kişinin temel haklarını nasıl etkiliyor?" sorusunu doğal olarak getirir.

---

### Madde 2 — Kapsam

**Madde metni (özet):** Kişisel verileri işlenen **gerçek kişiler** ile bu verileri işleyen **gerçek ve tüzel kişiler** hakkında uygulanır.

**Üç kritik kapsam sınırı:**

1. **Sadece gerçek kişilerin verileri** korunur. Şirket adı, tüzel kişi bilgileri KVKK kapsamı dışında (ama bunların içinde kişisel veri varsa o kısım kapsama girer — örn. şirket yetkilisinin adı).

2. **İşleme otomatik veya kısmen otomatik** olabilir; ya da bir veri kayıt sisteminin parçası olan manuel işleme de kapsama girer. Yani kâğıt üzerindeki bir dosya bile KVKK kapsamında olabilir — eğer bir sistem dahilindeyse.

3. **Coğrafi kapsam:** Kanun, Türkiye'de faaliyet gösteren veya Türkiye'deki kişilerin verilerini işleyen aktörler için geçerli. Extraterritorial etki GDPR kadar net düzenlenmemiş — bu bir boşluk.

**AI bağlamı:** Bir LLM modeli Türk kullanıcıların promptlarını işliyorsa → kapsama giriyor. Model yurt dışında çalışıyor olsa bile, Türk kullanıcı verisi işleniyorsa kapsam tartışmalı.

---

### Madde 3 — Tanımlar: Kritik 5 Kavram

**1. Kişisel Veri**
> "Kimliği belirli veya **belirlenebilir** gerçek kişiye ilişkin her türlü bilgi"

"Belirlenebilir" kelimesi genişletici bir kapsam yaratıyor. Bir veri doğrudan kimliği açıklamasa bile — başka verilerle birleştirildiğinde kişiyi tanımlamaya yarayıyorsa — kişisel veri sayılır.

**Kişisel veri örnekleri (AI bağlamında):**
- Ad-soyad, TC kimlik no → açık kişisel veri
- IP adresi → kişisel veri (kullanıcıya atfedilebilir)
- Kullanıcı davranış verisi (tıklama, arama geçmişi) → kişisel veri
- Prompt içindeki kişisel bilgiler → kişisel veri
- Agregat/istatistiksel veri → kişisel veri DEĞİL (anonim ise)

**Kritik ayrım — Anonim Veri:**
Anonim veri = geri döndürülemez biçimde kişiyle bağı koparılmış veri. KVKK uygulanmaz. Ama maskeleme (A*** Y***) anonimleştirme değil. Gerçek anonimleştirme teknik bir operasyondur — yalnızca başka veriyle birleştirilse bile kişi tespit edilemez hale gelmeli.

**2. Özel Nitelikli Kişisel Veri (Madde 6)**
Daha katı rejime tabi: ırk, etnik köken, siyasi düşünce, felsefi inanç, din, mezhep, kılık-kıyafet, dernek/vakıf/sendika üyeliği, **sağlık**, cinsel hayat, cezai mahkumiyet ve güvenlik tedbirleri, **biyometrik** ve **genetik** veri.

**AI ile kesişim noktaları:**
- Yüz tanıma → biyometrik → özel nitelikli
- Duygu analizi → sağlık/psikoloji sınırına yakın → risk bölgesi
- Ses analizi → biyometrik olabilir
- EU AI Act Madde 5 yasakları ile doğrudan kesişiyor

**3. Veri Sorumlusu**
> Kişisel verilerin işleme **amaçlarını ve vasıtalarını belirleyen**, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu gerçek veya tüzel kişi.

Kilit kelime: **"amaç ve vasıtaları belirleme"**. Karar alma yetkisi burada.

**4. Veri İşleyen**
> Veri sorumlusunun verdiği yetkiye dayanarak **onun adına** kişisel verileri işleyen gerçek veya tüzel kişi.

Kendi adına değil, veri sorumlusunun talimatıyla hareket eder. Kendi amaçları için veriyi kullanamaz.

**AI sektöründe rol tespiti (kritik örnek):**

| Aktör | KVKK Rolü | Gerekçe |
|-------|-----------|---------|
| Müşteri verilerini AI sistemine yükleyen şirket | Veri Sorumlusu | Amacı ve vasıtaları o belirliyor |
| AI API sağlayıcısı (OpenAI, Google vb.) | Veri İşleyen | Şirketin talimatıyla, onun adına işliyor |
| AI sağlayıcısı kendi eğitim verileri için | Veri Sorumlusu | Kendi amacı için işliyor |

⚠️ **Önemli nüans:** Bir aktör aynı anda hem veri sorumlusu hem veri işleyen olabilir — farklı veri setleri için. Örneğin OpenAI: müşteri API verisi için veri işleyen, kendi çalışan verileri için veri sorumlusu.

**5. İlgili Kişi**
> Kişisel verisi işlenen gerçek kişi.

Hakları: erişim, düzeltme, silme, aktarımı kısıtlama, itiraz, otomatik karar alma süreçlerini reddetme (Madde 11).

---

### Hexis Perspektifi

ORIENT'in **Observe** aşamasında şu soruları Madde 3'ten türetiyoruz:

- Bu sistemde kişisel veri var mı? → Madde 3 tanımı
- Özel nitelikli veri var mı? → Madde 6 listesi
- Organizasyon veri sorumlusu mu, veri işleyen mi, ikisi mi? → Madde 3(ı)(ğ)
- İlgili kişiler kimler? → Veri akışı haritası

Bu çerçeveyi bir müşteriye anlatmak için: "Önce kim olduğunuzu belirlememiz lazım" — sadece teknik bir soru değil, hukuki statünüzü belirliyor.

---

## BLOK 2 — Analiz Soruları (15 dk)

Bu blok Özden ile canlı oturumda yürütülecek. Aşağıdaki sorular sırayla, bir önceki cevap alındıktan sonra sunulacak.

---

**Soru 1 — Kavram Sınama (Kişisel Veri Sınırı)**

Bir e-ticaret şirketinin AI öneri motoru şu verileri işliyor:
- Kullanıcının görüntülediği ürün kategorileri
- Oturumun saati ve süresi
- Cihaz türü (mobile/desktop)

Kullanıcı hesabı yok — sadece oturum çerezi var.

→ **Bu veriler KVKK kapsamında kişisel veri sayılır mı?**

*Beklenen cevap çerçevesi:* Evet, "belirlenebilir" eşiği nedeniyle. Çerez ID'si kullanıcıya atfedilebilir veri yaratıyor. "Belirli" olmak zorunda değil — "belirlenebilir" yeterli. Çerez + davranış verisi birleşimi profilleme yaratıyor. KVKK devreye giriyor.

*Takip senaryosu:* "Peki şirket verileri 24 saat sonra siliyor, oturum bitince çerez temizleniyor. Bu durumu değiştirir mi?"

---

**Soru 2 — Senaryo Testi (Rol Tespiti)**

Bir Türk hastane zinciri, radyoloji görüntülerini analiz etmek için yabancı bir AI şirketinin bulut tabanlı yazılımını kullanıyor. AI yazılımı hastanın görüntülerini kendi sunucularına yükleyip analiz ediyor, sonucu doktora iletiyor.

→ **Bu senaryoda KVKK kapsamında hastane hangi rolde, AI şirketi hangi rolde?**

*Beklenen cevap çerçevesi:* Hastane = veri sorumlusu (amacı o belirledi, hastanın verisi). AI şirketi = veri işleyen (hastane adına, talimatla işliyor). Ama dikkat: yurt dışı veri aktarımı devreye giriyor (Madde 9). Ayrıca sağlık verisi özel nitelikli → daha katı şartlar.

*Takip senaryosu:* "AI şirketi bu görüntüleri kendi modelini geliştirmek için de kullanmak istese, hukuki statüsü değişir mi?"

---

**Soru 3 — Karşı Argüman (Anonim Veri Sınırı)**

Bir şirketin avukatı şunu söylüyor: "Biz kullanıcı verilerini anonimleştiriyoruz, sonra AI eğitiminde kullanıyoruz. KVKK bize uygulanmaz."

→ **Bu argümanı nasıl değerlendirirsin? Yeterli mi, nerede zayıf?**

*Beklenen cevap çerçevesi:* Teoride doğru — anonim veri KVKK dışında. Ama "anonimleştirme" kelimesi yüklü. Gerçek anonimleştirme teknik olarak çok zor. Re-identification saldırıları var. KVKK Kurul'u gerçek anonimleşmeyi sıkı kriterlerle değerlendiriyor. "Anonimleştirdik diyoruz" yetmiyor — teknik olarak ispat lazım. Ayrıca makine öğrenimi modelleri eğitim verisini "hatırlayabiliyor" (memorization saldırısı).

---

**Soru 4 — ORIENT Metodoloji Geliştirme**

Bir müşteri sana AI sistemini ORIENT çerçevesiyle değerlendirmen için geliyor. Observe aşamasında "veri sorumlusu musunuz veri işleyen misiniz?" sorusunu soruyorsun.

→ **Müşteri "ikisi de olabiliriz, duruma göre değişiyor" derse Observe aşamasını nasıl yapılandırırsın?**

*Beklenen cevap çerçevesi:* Her veri akışı için rol tespiti ayrı yapılmalı. Observe aşamasını veri akışı bazında parçalamak gerekiyor. Tek bir rol tespiti değil, "hangi veri seti için hangi rol" matrisi. Bu ORIENT'e katkı: Observe çıktısı = veri akışı × rol matrisi.

---

## BLOK 3 — ORIENT Notu Şablonu (10 dk)

Oturum sonunda Özden tarafından doldurulacak şablon:

```
---
### Gün 1 — 22 Mart 2026 — KVKK Yapısı ve Temel Kavramlar
**Faz:** Faz 1 — KVKK Temelleri
**ORIENT:** Observe
**Öğrenilenler:**
- [Buraya yaz]
- [Buraya yaz]
- [Buraya yaz]
**Sorgulama çıktısı:** [Blok 2'de öne çıkan nüans veya itiraz]
**Hexis metodoloji notu:** [ORIENT Observe aşamasına katkı]
**İçerik fırsatı:** [Blog / LinkedIn / bülten / araç fikri]
**Açık soru:** [Bir sonraki oturuma taşınan şüphe]
---
```

---

### Hexis İçerik Fırsatları — Gün 1

Bu oturumdan çıkabilecek içerik fikirleri:

1. **LinkedIn post:** "Veri sorumlusu mu, veri işleyen mi? AI entegrasyonunda çoğu şirket bu soruyu atlıyor." — pratik senaryo odaklı, 3 örnek.

2. **Blog yazısı:** "KVKK'da Anonim Veri: Şirketlerin En Sık Yaptığı Hata" — anonimleştirme yanılgısı, re-identification riski, makine öğrenimi modeli memorization.

3. **Generator geliştirme:** Observe formunda "Veri sorumlusu / Veri işleyen / İkisi de" seçeneği daha net belgelenebilir — mevcut durumu kontrol et.

---

## Kaynak Notları

- **Kanun metni:** [6698 Sayılı KVKK — mevzuat.gov.tr](https://mevzuat.gov.tr/mevzuat?MevzuatNo=6698&MevzuatTur=1&MevzuatTertip=5)
- **KVKK Temel Kavramlar:** kvkk.gov.tr/Icerik/4187 *(ağ kısıtlaması nedeniyle doğrudan erişilemedi — link doğrulandı)*
- **ChatGPT Bilgi Notu:** kvkk.gov.tr/Icerik/8047 *(link doğrulandı)*
- **Özel Nitelikli Veri:** kvkk.gov.tr/Icerik/2051 *(link doğrulandı)*

⚠️ *Madde numaraları web araştırmasıyla çapraz doğrulandı. Doğrudan kvkk.gov.tr erişimi ağ kısıtlaması nedeniyle mümkün olmadı — canlı oturumda resmi metni birlikte kontrol edelim.*
