# Gün 20 — Otomatik Karar Alma ve Profilleme
**Faz 4 — Çapraz Analiz | 2026-03-18 | 40 dk**

---

## Karşılaştırma Ekseni

**KVKK Madde 11(1)(g)** — otomatik karar almaya itiraz hakkı
↔
**EU AI Act Madde 14** — insan gözetimi yükümlülüğü

Referans: **GDPR Madde 22** — karşılaştırma için zemin

---

## Blok 1 — Okuma Materyali (15 dk)

### 1A. KVKK Madde 11(1)(g) — İtiraz Hakkı

KVKK'nın 11. maddesi, ilgili kişiye şu hakkı tanır:

> "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme."

**Kilit kavramlar:**

- **Münhasıran otomatik:** Kararın tamamı algoritma tarafından alınmış olmalı. Bir insan herhangi bir aşamada gerçek bir değerlendirme yapmışsa bu hak devreye girmeyebilir.
- **Aleyhine sonuç:** Sadece olumsuz kararlar değil — hukuken veya fiilen önemli etki yaratan her karar bu kapsamda değerlendirilebilir.
- **İtiraz, yasak değil:** KVKK burada bir "yasak" getirmiyor; bireye *itiraz hakkı* tanıyor. Şirket bu itirazı yanıtlamak zorunda, ama itiraz mekanizması işlemek için birey önce başvurmalı.

**KVKK'nın eksik kalan yönleri (GDPR'a kıyasla):**
- Açıklama hakkı düzenlenmemiş: Algoritmanın mantığı hakkında bilgi isteme hakkı KVKK'da açıkça yok; GDPR Madde 13-15 bunu zorunlu kılıyor.
- Profilleme tanımı yok: KVKK'da "profilleme" kavramı GDPR'daki kadar netleştirilmemiş.
- İstisna koşulları belirsiz: GDPR Madde 22(2) sözleşme gerekliliği, hukuki yetki, açık rıza olarak üç istisnayı sayıyor. KVKK'da bu liste yok.
- Yaptırım boşluğu: KVKK Madde 18 cezaları sabit tutarlarda ve GDPR cezalarına kıyasla çok düşük.

---

### 1B. EU AI Act Madde 14 — İnsan Gözetimi

EU AI Act, yüksek riskli AI sistemleri için insan gözetimini bir "tasarım gereği" olarak zorunlu kılıyor. Bu, reaktif bir itiraz hakkından çok daha ileri bir önlem.

**Sağlayıcı (Provider) yükümlülükleri:**

- Yüksek riskli AI sistemi, insanların sistemi *etkin biçimde* gözetebileceği şekilde tasarlanmalı.
- Sistemin yetenekleri ve sınırlılıkları anlaşılır kılınmalı.
- Kararı çürütme, geçersiz kılma veya sistemi durdurma imkânı tasarıma dahil edilmeli.
- "Otomasyon yanlılığı" (automation bias) riskine karşı kullanıcılar uyarılmalı.

**Konuşlandıran (Deployer) yükümlülükleri:**

- Her yüksek riskli AI sistemi için gözetim sorumluluğunu *belirli kişilere* atama.
- Bu kişilerin yetkin, eğitimli ve gerekli otoriteye sahip olması.
- Belirli durumlarda sistemi kullanmama kararı verme yetkisi.

**Biyometrik sistemler için özel kural (Annex III, Madde 1(a)):**
Yüz tanıma gibi sistemlerde, kimlik tespitini tek bir gözetmen doğrulayamaz — en az *iki* kişi bağımsız teyit etmeli.

**Otomasyon yanlılığı nedir?**
AI çıktısının, insan değerlendirmesinin önüne geçmesi. Yani gözetmenin "AI böyle dedi, doğrudur" diye körce kabul etmesi. Madde 14 bu riski sistemik biçimde ele alıyor.

---

### 1C. GDPR Madde 22 — Karşılaştırma Zemini

GDPR Madde 22, KVKK Madde 11'in "ilham aldığı" ancak çok daha güçlü düzenlediği referans normdur.

| Boyut | KVKK M.11(g) | GDPR M.22 | EU AI Act M.14 |
|---|---|---|---|
| Yaklaşım | İtiraz hakkı (reaktif) | Yasak + istisnalar (proaktif) | Tasarım gereği gözetim (sistemic) |
| Kapsam | Münhasıran otomatik + aleyhine sonuç | Münhasıran otomatik + hukuki/önemli etki | Tüm yüksek riskli AI sistemleri |
| Açıklama hakkı | Yok (açık düzenleme) | Evet (M.13-15 aracılığıyla) | Evet (M.13 şeffaflık) |
| Profilleme tanımı | Yok | Var (M.4(4)) | Var (risk sınıflandırmasında) |
| Yaptırım | Sabit tutar (düşük) | Cironun %4'üne kadar | €15M veya cironun %3'ü |

---

### 1D. ORIENT Eşlemesi

| ORIENT Aşaması | KVKK M.11 | EU AI Act M.14 |
|---|---|---|
| **Observe** | Hangi kararlar münhasıran otomatik? | Sistem yüksek riskli Annex III kapsamında mı? |
| **Risk** | Aleyhine karar riski var mı? | İnsan gözetimi eksikliği ne düzeyde risk? |
| **Identify** | İtiraz hakkı mekanizması kurulmuş mu? | Gözetim sorumlusu atanmış mı? |
| **Evaluate** | İtiraz başvuruları ne kadar sürede yanıtlanıyor? | Gözetmen gerçekten müdahale edebiliyor mu? |
| **Navigate** | İtiraz sürecini dokümante et | Gözetim prosedürünü tasarla ve eğitimleri düzenle |
| **Track** | İtiraz kayıtlarını tut | Gözetim etkinliğini periyodik denetle |

---

## Blok 2 — Analiz Soruları (15 dk)

**Tür:** Kavram + Senaryo + Karşılaştırma + ORIENT

---

### Soru 1 — Kavram
KVKK Madde 11(1)(g) ile GDPR Madde 22 arasındaki en temel yapısal fark nedir? Bu fark, şirketlerin uyum yükümlülüklerini nasıl etkiler?

*Beklenen çerçeve:* KVKK itiraz hakkı (reaktif, birey başlatır) vs. GDPR yasak + istisnalar (proaktif, şirket başlatır). KVKK'da şirket sadece itirazı yanıtlamak zorunda; GDPR'da ise hiç başlamamak için geçerli bir zemine sahip olmalı.

---

### Soru 2 — Senaryo
Bir Türk bankası, kredi başvurularını tamamen otomatik bir AI sistemiyle değerlendiriyor. Sistem 3 saniyede karar üretiyor ve müşteri hiçbir zaman bir banka görevlisiyle görüşmüyor. Banka KVKK'ya uyum sağlamak için ne yapmalı? EU AI Act kapsamındaysa ek olarak ne gerekli?

*Beklenen çerçeve:*
- KVKK: Müşterilere itiraz hakkını bildirme yükümlülüğü (Madde 10 aydınlatma + Madde 11 itiraz mekanizması). İtiraz geldikçe insan değerlendirmesi yapılmalı.
- EU AI Act: Kredi kararları Annex III Madde 5(b) kapsamında yüksek riskli. Madde 14: gözetim sorumlusu atanmalı, sistem "hayır" dese bile müdahale imkânı olmalı. Madde 13: müşteriye AI kullanıldığı bildirilmeli.
- Kritik fark: KVKK sadece itiraz sonrası insan müdahalesi; EU AI Act sistem *tasarımında* insan gözetimi.

---

### Soru 3 — Karşılaştırma
"Otomasyon yanlılığı" (automation bias) neden EU AI Act'ın Madde 14'ünde özel olarak ele alındı? KVKK bu sorunu nasıl çözüyor (veya çözemiyor)?

*Beklenen çerçeve:*
Otomasyon yanlılığı, gözetmenin AI çıktısına kör bir güven duymasıdır — bu durumda insan teknik olarak "gözetimde" ancak fiilen pasif. EU AI Act Madde 14(4)(b), gözetmenlerin sistemi anlayan ve gerektiğinde devre dışı bırakabilen kişiler olmasını zorunlu kılıyor. KVKK bu sorunu doğrudan ele almıyor; yalnızca bireysel itiraz hakkı var.

---

### Soru 4 — ORIENT
Bir şirket HR'da AI destekli işe alım sistemi kullanıyor. ORIENT çerçevesiyle, şirketin Madde 14 uyumunu sağlamak için hangi adımları atması gerektiğini **Navigate** aşaması özelinde açıkla.

*Beklenen çerçeve:*
Navigate: Gözetim sorumlusu atama → yetkinlik/eğitim planı → prosedür hazırlama (AI "red" dediğinde insan ne yapıyor?) → başvuru sahiplerine bildirimi ekleme → aydınlatma metnini güncelleme → Madde 26 deployer log yükümlülüğü. Somut aksiyon planı çıkarılmalı, sadece liste değil.

---

## Blok 3 — ORIENT Notu Şablonu (10 dk)

**Senaryo:** HR'da AI destekli işe alım sistemi

---

### ORIENT Notu — İşe Alım AI Sistemi

**Tarih:** 2026-03-18
**Hazırlayan:** Hexis AI Governance
**Konu:** İşe Alım AI — Çift Uyum Değerlendirmesi

---

**O — Observe**
- AI sistem türü: CV tarama + aday sıralama modeli
- Organizasyon rolü: Deployer (sistemi geliştiren değil, kullanan)
- Veri türleri: Özgeçmiş, başvuru formu, muhtemelen profilleme verisi
- Kişisel veri: Evet — çalışan/aday adaylarının kişisel verisi
- Özel nitelikli veri riski: Fotoğraftan etnik köken tespiti, engel durumu — Madde 6 KVKK tetikleyebilir

**R — Risk**
- EU AI Act: Annex III Madde 4 — istihdam ve çalışanların yönetimi → **Yüksek Riskli**
- KVKK: Otomatik karar alma + profilleme → Madde 11(1)(g) itiraz hakkı gerektirir
- Ayrımcılık riski: Model önyargısı → hem EU AI Act hem KVKK kapsamında sorumluluk
- EU AI Act yürürlük: 2 Ağustos 2026 (Annex III) — **yaklaşan son tarih**

**I — Identify**
- EU AI Act yükümlülükleri (Deployer, Madde 26):
  - Teknik dokümantasyonu inceleme
  - İnsan gözetimi prosedürü kurma (Madde 14)
  - Başvuru sahiplerini bilgilendirme (Madde 13)
  - Post-market log tutma
- KVKK yükümlülükleri:
  - Aydınlatma metni güncellemesi (Madde 10)
  - İtiraz mekanizması kurma (Madde 11)
  - VERBİS güncellemesi (AI işleme eklenmeli)
  - Yurt dışı aktarım varsa Madde 9

**E — Evaluate**
- [ ] Gözetim sorumlusu atandı mı?
- [ ] Gözetmen "hayır" diyebilir mi, prosedür var mı?
- [ ] Aday bilgilendirmesi yapılıyor mu?
- [ ] İtiraz başvuruları için süreç tanımlı mı?
- [ ] Model önyargı testi yapıldı mı?
- [ ] Provider'ın teknik dokümantasyonu mevcut mu?

**N — Navigate**
1. Gözetim sorumlusu belirle + yetkinlik eğitimi planla
2. "AI red → insan devreye" prosedürü yaz
3. Aday aydınlatma metnini güncelle (KVKK + EU AI Act şeffaflığı)
4. İtiraz başvuru formunu hazırla (KVKK Madde 11)
5. Provider'dan teknik dokümantasyon + önyargı test raporu iste
6. VERBİS kaydını güncelle
7. Eğer provider AB dışındaysa: yurt dışı aktarım mekanizmasını gözden geçir

**T — Track**
- Gözetim prosedürü gözden geçirme: her 6 ayda
- EU AI Act Annex III yürürlük: **2 Ağustos 2026** — tüm yükümlülükler hazır olmalı
- Model önyargı denetimi: yılda 1 kez minimum
- İtiraz kayıtları: 3 yıl saklama (KVKK uygulaması)
- Digital Omnibus izle: süre uzarsa → Annex III max 2 Aralık 2027

---

## Hexis İçerik Fırsatları

**Blog yazısı:** "İşe Alım AI'ı Kullanmadan Önce: KVKK + EU AI Act Kontrol Listesi" — HR profesyonellerine hitap eden, iki mevzuatı pratik açıdan karşılaştıran bir rehber.

**LinkedIn içeriği:** "Bir itiraz hakkı mı, tasarım gereği gözetim mi?" başlıklı kısa karşılaştırma — KVKK reaktif vs. EU AI Act proaktif yaklaşım.

**Generator geliştirme:** Observe formunda "kararın insan gözetimi var mı?" sorusu eklenmesi — Madde 14 uyum işareti olarak.

**Danışmanlık notu:** Deployer'lar için "Gözetim Sorumlusu Atama ve Eğitim Şablonu" — Madde 14 uyumunu belgelemek için.

---

## Kaynaklar (Doğrulanmış)

- KVKK Madde 11: [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/2036/Ilgili-Kisinin-Haklari)
- EU AI Act Madde 14: [artificialintelligenceact.eu/article/14/](https://artificialintelligenceact.eu/article/14/)
- GDPR Madde 22: [gdpr-info.eu/art-22-gdpr/](https://gdpr-info.eu/art-22-gdpr/)
- EU AI Act tam metin: [EUR-Lex 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202401689)

---

*Hazırlanma: 2026-03-18 (otomatik) — Yasal Altyapı Ustalığı Programı, Gün 20*
