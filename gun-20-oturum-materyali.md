# Gün 20 — Otomatik Karar Alma ve Profilleme
**Faz 4: Çapraz Analiz | Tarih: 2026-03-19 | Süre: ~40 dk**

---

## Bağlam: Neredeyiz?

Gün 19'da KVKK Madde 5 ile EU AI Act Madde 10'u karşılaştırdık: açık rıza merkezli yaklaşım vs. risk bazlı yaklaşım, veri minimizasyonu gerilimi. Bugün bir adım daha ileri gidiyoruz: veriler toplandıktan sonra ne oluyor? Sistem bu verilerle otomatik karar alıyorsa, birey ne yapabilir?

Bu soru KVKK ile EU AI Act arasındaki en belirgin fark noktalarından birini açığa çıkarıyor.

---

## BLOK 1 — Okuma Materyali (15 dk)

### 1A. KVKK Madde 11(1)(g): İtiraz Hakkı

**Madde metni (doğrulandı):**
> "İlgili kişi [...] işlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme [...] haklarına sahiptir."
> — 6698 Sayılı KVKK, Madde 11(1)(g)

**Ne anlama geliyor?**

KVKK otomatik karar almayı *yasaklamıyor*. Bireye, yalnızca otomatik sistemlerle alınan kararları *sonradan itiraz etme* hakkı tanıyor. Yani:

- Sistem karar alabilir → birey itiraz edebilir
- İtiraz mekanizması nasıl işleyecek → açıklanmamış
- Hangi durumlarda "münhasıran otomatik" sayılır → rehber yok

**Kritik boşluk:** KVKK'da GDPR'ın 22. Maddesindeki gibi proaktif bir koruma yok. Önce karar alınır, sonra birey itiraz eder — yani zarar zaten gerçekleşmiş olabilir.

---

### 1B. GDPR Madde 22: Yasak + İstisnalar

GDPR'ın yaklaşımı temelden farklı: münhasıran otomatik karar almayı **kural olarak yasaklar**.

**Madde 22(1):** "Veri sahibinin, kendisi hakkında hukuki etki doğuran ya da kendisini önemli ölçüde etkileyen münhasıren otomatik işlemeye dayalı bir karara tabi tutulmaması hakkı vardır."

**İzin verilen istisnalar (GDPR Madde 22(2)):**
1. Sözleşmenin kurulması veya ifası için gerekli olması
2. Üye devlet hukukunca izin verilmesi
3. Açık rıza

**KVKK ile temel fark:**

| Kriter | KVKK Madde 11(1)(g) | GDPR Madde 22 |
|--------|---------------------|----------------|
| Temel yaklaşım | İtiraz hakkı (reaktif) | Yasak + istisnalar (proaktif) |
| Koruma zamanı | Karar sonrası | Karar öncesi |
| Kapsam | "Aleyhine sonuç" | Hukuki etki veya önemli etki |
| Açıklama hakkı | Yok (doğrudan) | Evet (Art. 13-15 via recital 71) |
| DPIA zorunluluğu | Yok | Evet (sistematik profilleme için) |

---

### 1C. EU AI Act Madde 14: İnsan Gözetimi

*Yürürlük durumu doğrulandı: Annex III kapsamındaki yüksek riskli sistemler için son uyum tarihi 2 Ağustos 2026.*

EU AI Act Madde 14 yaklaşımı GDPR'dan da farklı: bireysel itiraz hakkı değil, *sistemi kullanan kurumun insan gözetimini teknik olarak sağlama zorunluluğu*.

**Madde 14'ün ana gereklilikleri:**

**Tasarım zorunluluğu (provider yükümlülüğü):**
- Yüksek riskli AI sistemi, etkin insan gözetimine imkân verecek şekilde tasarlanmalı
- "Human-machine interface tools" sisteme entegre edilmeli
- Sistem; kapasitelerini, sınırlamalarını ve çıktılarını insanların yorumlayabileceği şekilde sunmalı

**Operasyonel zorunluluklar (deployer yükümlülüğü):**
Gözetim görevi atanan kişilerin yapabilmesi gereken 5 şey:
1. Sistemin kapasitelerini ve sınırlamalarını anlamak
2. **Otomasyon önyargısına (automation bias) karşı bilinçli olmak** ← önemli kavram
3. Çıktıları doğru yorumlayabilmek
4. Gerektiğinde sistemi devre dışı bırakmaya karar verebilmek
5. Gerektiğinde sistemi güvenle durdurmak ("stop button")

**Özel kural — Uzaktan Biyometrik Tanımlama:**
Madde 14(5): Bu sistemlerde kararlar *en az iki yetkili kişi* tarafından doğrulanmalı (kolluk ve sınır denetimi istisnalar hariç).

---

### 1D. Karşılaştırma Tablosu: 3 Mevzuat

| Boyut | KVKK M.11(1)(g) | GDPR M.22 | EU AI Act M.14 |
|-------|-----------------|-----------|----------------|
| Temel mekanizma | Bireysel itiraz | Yasak + istisna | Kurumsal teknik zorunluluk |
| Koruma perspektifi | Birey merkezli | Birey merkezli | Sistem merkezli |
| Zaman | Karar sonrası | Karar öncesi | Tasarım ve kullanım süreci |
| Uygulayan | Birey | Birey | Provider + Deployer |
| AI'ya özgü mü? | Hayır | Hayır | Evet |
| Teknik detay | Yok | Az | Yüksek |
| Eğitim zorunluluğu | Yok | Yok | Evet (bias, oversight) |

---

### 1E. İstihdam Senaryosu: Pratik Kesişim Noktası

İşe alımda AI kullanımı bu üç mevzuatın en sert kesişim noktalarından biri.

**EU AI Act Annex III, Bölüm 4 — doğrulandı:**
Aşağıdakiler yüksek riskli AI olarak sınıflandırılmıştır:
- İş ilanı hedefleme, başvuru filtreleme, aday değerlendirme sistemleri
- Terfi/işten çıkarma kararlarını etkileyen sistemler
- Bireysel davranış/kişilik özelliklerine göre görev atama sistemleri

**Çift uyum senaryosu (Türk şirketi, AB'de iş ilanı):**
- KVKK: adaylar Türk vatandaşıysa → Madde 11(1)(g) itiraz hakkı + aydınlatma yükümlülüğü
- EU AI Act: sistem Annex III kapsamındaysa → Madde 14 insan gözetimi zorunlu
- GDPR: AB'deki adaylar için → Madde 22 kapsamında açık rıza veya diğer hukuki temel gerekli

**ORIENT eşlemesi:**
- O (Observe): "Bu sistem işe alım kararlarını münhasıran mı alıyor, yoksa insan bir son karar veriyor mu?"
- R (Risk): Annex III → yüksek risk. KVKK özel nitelikli veri riski (etnik köken tespiti)
- I (Identify): KVKK M.11, EU AI Act M.14, M.26 (deployer), M.9 (risk management), GDPR M.22 (AB adayları için)
- E (Evaluate): İnsan gözetimi gerçekte nasıl işliyor? Sadece kağıt üzerinde mi?
- N (Navigate): Aday bilgilendirme metni, override mekanizması, itiraz kanalı
- T (Track): Ağustos 2026 uyum tarihi, yıllık bias audit planı

---

## BLOK 2 — Analiz Soruları (15 dk)

### Soru 1 — Kavramsal
**"Otomasyon önyargısı (automation bias) nedir ve EU AI Act neden bunu özellikle Madde 14'te vurgular?"**

*Beklenen cevap çerçevesi:*
Otomasyon önyargısı, insanların algoritma çıktılarına aşırı güvenme eğilimi; kendi yargısını ikinci plana bırakma. AI Act bunu vurgular çünkü "insan gözetimi" kağıt üzerinde kalabilir — insan var ama sistemi sorgulayamıyor. Gerçek gözetim, override etme kapasitesi gerektirir. Bu nedenle deployer'ın çalışanlarını eğitmesi zorunlu tutulmuş.

---

### Soru 2 — Karşılaştırma
**"Bir Türk şirketi AI ile CV eleme yapıyor. Seçilmeyen aday 'neden elendim?' diye sorduğunda KVKK Madde 11 ne veriyor, EU AI Act ne veriyor? Fark ne?"**

*Beklenen cevap çerçevesi:*
- KVKK: Madde 11(1)(g) → "otomatik sistemle aleyhime karar alındıysa itiraz edebilirim" der. Ancak gerekçe alma hakkı açıkça düzenlenmemiş; aydınlatma yükümlülüğü (M.10) kısmen devreye girer ama yeterli mi tartışmalı.
- EU AI Act: Madde 13 (şeffaflık) + Madde 14 → Deployer'ın sistemi, çıktıların yorumlanabilir olmasını sağlaması gerekiyor. Kullanım kılavuzunda limitler ve risk açıklanmalı.
- Fark: KVKK bireysel hak, EU AI Act kurumsal sistem tasarımı gerekliliği. Birbirini tamamlıyor ama tam örtüşmüyor.

---

### Soru 3 — Senaryo
**"Bir banka 'insan son kararı veriyor, AI sadece sıralama yapıyor' diyor. Bu KVKK Madde 11(1)(g) ve EU AI Act Madde 14 açısından yeterli mi?"**

*Beklenen cevap çerçevesi:*
- KVKK: "münhasıran otomatik" eşiği — insan nihai karar veriyorsa, pratikte itiraz hakkının devreye girmesi tartışmalı. Ama insan sadece onaylıyorsa (rubber stamp) "münhasıran otomatik" sayılabilir.
- EU AI Act: İnsan gözetimi sadece varlıkla değil, *etkinlikle* ölçülür. Otomasyon önyargısına karşı eğitim aldı mı? Override mekanizması gerçekten işliyor mu? "Sıralama" → Annex III kapsamında mı? Büyük ihtimalle evet.
- Sonuç: "İnsan var" yeterli değil. "İnsan etkin gözetim yapabiliyor" sorusu kritik.

---

### Soru 4 — ORIENT Uygulaması
**"Bir işe alım AI sisteminde Evaluate (Değerlendirme) aşamasında insan gözetimini nasıl değerlendirirsin? Somut olarak hangi kanıtları ararsın?"**

*Beklenen cevap çerçevesi:*
- Yazılı gözetim prosedürü var mı?
- Çalışanlar otomasyon önyargısı konusunda eğitim aldı mı? (kayıt var mı?)
- Override kayıtları tutuluyor mu? (kaç karar override edildi, gerekçesi ne?)
- Sistemi durdurma ("stop button") mekanizması test edildi mi?
- Bias audit yapılıyor mu, sonuçları belgeleniyor mu?
- Adaylara AI kullanıldığına dair bildirim yapılıyor mu?
Hexis ORIENT notu: Evaluate aşamasında "kağıt uyum" vs. "etkin uyum" ayrımı kilit.

---

## BLOK 3 — ORIENT Notu Şablonu (10 dk)

### Konu: İşe Alımda AI Sistemi — Otomatik Karar Alma ve İnsan Gözetimi

```
ORIENT NOTU
Sistem: [İşe Alım AI Sistemi]
Tarih: [___]
Hazırlayan: [___]
Referans: EU AI Act Madde 14, Annex III/4 | KVKK Madde 11(1)(g) | GDPR Madde 22

---
O — OBSERVE (Gözlemle)
Sistem ne yapıyor?
[ ] Başvuru filtreleme / CV tarama
[ ] Aday sıralama / skorlama
[ ] Final eleme kararı
[ ] Diğer: ___

İnsan müdahalesi nerede?
[ ] Yok (tam otomatik)
[ ] Onay (rubber stamp)
[ ] Gerçek değerlendirme (kayıt tutarak)
[ ] Bağımsız karar (AI sadece bilgi sunar)

AB pazarı var mı? [ ] Evet [ ] Hayır
Türk vatandaşı adaylar? [ ] Evet [ ] Hayır

---
R — RISK (Riskle)
EU AI Act sınıflandırması:
[ ] Yüksek risk (Annex III, Bölüm 4) — büyük olasılıkla
[ ] Madde 6(3) istisnası var mı? ___

KVKK özel nitelikli veri riski:
[ ] Fotoğraf (biyometrik veri potansiyeli)
[ ] Etnik köken tespiti riski
[ ] Diğer: ___

---
I — IDENTIFY (Tanımla)
Uygulanabilir yükümlülükler:
[ ] EU AI Act M.14 — insan gözetimi
[ ] EU AI Act M.13 — şeffaflık ve kayıt tutma
[ ] EU AI Act M.26 — deployer yükümlülükleri (risk yönetimi)
[ ] KVKK M.11(1)(g) — itiraz hakkı (aday bilgilendirilmeli)
[ ] KVKK M.10 — aydınlatma yükümlülüğü
[ ] GDPR M.22 — AB adayları için (varsa)
[ ] GDPR M.35 DPIA — sistematik profilleme varsa

---
E — EVALUATE (Değerlendir)
İnsan gözetimi etkinliği:
[ ] Çalışan eğitimi var (otomasyon önyargısı)
[ ] Override mekanizması kayıtlı
[ ] Bias audit yapılıyor
[ ] Sistem durdurma protokolü test edildi

Boşluklar:
___________________________________

---
N — NAVIGATE (Yönlendir)
Öncelikli aksiyonlar:
1. Aday aydınlatma metnini AI bildirimini içerecek şekilde güncelle
2. Çalışan eğitim kayıtlarını oluştur (automation bias)
3. Override prosedürünü yazılı hale getir ve kayıt tut
4. Gerekirse DPIA başlat (GDPR kapsamında)
5. AB adayları için GDPR M.22 hukuki temelini netleştir

---
T — TRACK (Takip Et)
[ ] 2 Ağustos 2026 — EU AI Act Annex III uyum tarihi
[ ] Yıllık bias audit planlandı: ___
[ ] Aday itiraz kanalı aktif: ___
[ ] Sonraki review: ___
```

---

## Hexis İçerik Fırsatları

**Blog yazısı:**
"İşe Alımda AI: KVKK ve EU AI Act Aynı Anda Ne İstiyor?" — çift uyum rehberi, KOBİ'lere özel

**LinkedIn içeriği:**
"'İnsan son kararı veriyor' yeterli mi? EU AI Act'ın Madde 14'ü etkin gözetim istiyor — 3 kontrol sorusu" → text-only, yüksek engagement potansiyeli

**Generator özelliği:**
İşe alım senaryosu için ORIENT notu şablonu — generator'da senaryo bazlı çıktı

**Danışmanlık notu:**
"İşveren Olarak AI Kullanım Rehberi" — KVKK aydınlatma metni + EU AI Act insan gözetimi protokolü birleşik şablon

---

---

## Çalışma Günlüğü Notu (Gün 20)

**Faz:** Faz 4 — Çapraz Analiz
**Tarih:** 2026-03-19
**Hazırlık:** Otomatik (scheduled task)
**Durum:** Materyal hazır — oturum bekleniyor

**Ana bulgular:**
1. KVKK M.11(1)(g) reaktif: itiraz hakkı karar sonrası devreye giriyor
2. GDPR M.22 proaktif: münhasıran otomatik kararları kural olarak yasaklıyor
3. EU AI Act M.14 sistem merkezli: deployer teknik tasarım + eğitim zorunluluğu
4. "Otomasyon önyargısı" M.14'te açıkça adreslenmiş — çalışan eğitimi zorunlu
5. İşe alım AI → Annex III/4 yüksek riskli → Ağustos 2026 uyum tarihi
6. "İnsan var" yeterli değil; "insan etkin gözetim yapabiliyor" ispatı gerekiyor

**Hexis fırsatları:**
- Blog: "İşe Alımda AI: KVKK ve EU AI Act Aynı Anda Ne İstiyor?"
- LinkedIn: "'İnsan son kararı veriyor' yeterli mi?" text-only post
- Generator: İşe alım ORIENT notu şablonu
- Danışmanlık: Birleşik aydınlatma + insan gözetimi protokol şablonu

*Materyal hazırlanma tarihi: 2026-03-19 (otomatik çalışma)*
*Sonraki gün: Gün 21 — Şeffaflık ve Bilgilendirme Yükümlülükleri (KVKK M.10 ↔ EU AI Act M.13 + M.50)*
