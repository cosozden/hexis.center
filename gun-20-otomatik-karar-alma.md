# Gün 20 — Otomatik Karar Alma ve Profilleme

**Faz:** 4 — Çapraz Analiz (KVKK x EU AI Act)
**Tarih:** 16 Mart 2026
**Süre:** 40 dakika (3 blok)
**ORIENT Eşlemesi:** Identify + Evaluate — yükümlülük tespiti ve boşluk değerlendirmesi

---

## Blok 1: Okuma & Kavrama (15 dk)

### Karşılaştırma Ekseni

KVKK Madde 11(1)(g) "otomatik karar almaya itiraz hakkı" ile EU AI Act Madde 14 "insan gözetimi (human oversight)" gereklilikleri arasındaki farklar ve kesişimler.

---

### 1.1 KVKK Madde 11(1)(g) — İtiraz Hakkı

KVKK Madde 11(1)(g) ilgili kişiye şu hakkı tanır:

> İşlenen verilerin **münhasıran otomatik sistemler** vasıtasıyla analiz edilmesi suretiyle kişinin kendisi **aleyhine bir sonucun ortaya çıkmasına itiraz etme** hakkı.

**Kilit kavramlar:**

- **"Münhasıran"** — Yalnızca, sadece. Kararda takdir yetkisine sahip bir insan yoksa bu hak devreye girer. Eğer karar sürecinde anlamlı bir insan müdahalesi varsa, bu bent uygulanmaz.
- **"Aleyhine bir sonuç"** — Olumsuz etki yaratan herhangi bir karar: kredi reddi, işten çıkarma, sigorta primi artışı, hizmet kısıtlaması vb.
- **"İtiraz"** — Kararın yeniden değerlendirilmesini talep etme hakkı. Ancak dikkat: KVKK sadece itiraz hakkı veriyor — kararın durdurulması veya geri alınması otomatik değil.

**Pratikte ne anlama geliyor?**

Bir banka kredi başvurunuzu tamamen algoritmik olarak reddettiyse ve bu kararda hiçbir insan müdahalesi yoksa, Madde 11(1)(g) kapsamında itiraz edebilirsiniz. Banka bu itirazı değerlendirmek zorundadır.

**Eksik kalan yönler:**

- KVKK "profilleme" kavramını tanımlamamış (GDPR Madde 4(4)'te tanım var)
- İtirazın sonucunda ne olacağına dair açık prosedür yok
- "Anlamlı insan müdahalesi" eşiği belirsiz
- GDPR Madde 22'deki gibi bir yasak (prohibition) değil, sadece itiraz hakkı

---

### 1.2 GDPR Madde 22 — Karşılaştırma Noktası

KVKK'nın Madde 11(1)(g) hükmünü anlamak için GDPR Madde 22 ile karşılaştırma öğreticidir, çünkü KVKK büyük ölçüde GDPR'den esinlenmiştir ama önemli farklar vardır:

| Konu | GDPR Madde 22 | KVKK Madde 11(1)(g) |
|------|---------------|---------------------|
| **Doğası** | Yasak (prohibition) — EDPB yorumu | Hak (itiraz hakkı) |
| **Kapsam** | Hukuki etki VEYA benzer ölçüde önemli etki | Sadece "aleyhine sonuç" |
| **Güvenceler** | İnsan müdahalesi + görüş bildirme + itiraz (üçlü koruma) | Sadece itiraz |
| **İstisnalar** | Sözleşme, yasal yetki, açık rıza (3 istisna, her biri güvenceli) | Belirtilmemiş |
| **Profilleme tanımı** | Madde 4(4)'te açıkça tanımlı | Tanım yok |
| **Özel nitelikli veri** | Madde 22(4) — ek kısıtlamalar | Madde 6 genel çerçeve |

**Kritik fark:** GDPR'de otomatik karar alma "varsayılan olarak yasak, istisnalarla izin verilen" bir şeydir. KVKK'da ise otomatik karar alma serbest, ama aleyhte sonuç çıkarsa itiraz hakkı var. Bu yaklaşım farkı, AI sistemleri için çok farklı uyum stratejileri gerektirir.

---

### 1.3 EU AI Act Madde 14 — İnsan Gözetimi (Human Oversight)

EU AI Act Madde 14, KVKK'nın bireysel itiraz hakkından tamamen farklı bir perspektifle yaklaşır: sistem tasarımı düzeyinde insan gözetimi zorunluluğu getirir.

**Temel gereklilikler:**

1. **Tasarımda gözetim:** Yüksek riskli AI sistemleri, kullanım süresince gerçek kişiler tarafından etkin bir şekilde denetlenebilecek biçimde tasarlanmalı (Madde 14(1)).

2. **Amacı:** Sağlık, güvenlik veya temel haklara yönelik riskleri önlemek veya en aza indirmek (Madde 14(2)).

3. **Gözetimcinin yetkileri (Madde 14(4)):** Gözetim yapan kişi şunları yapabilmeli:
   - Sistemi izleme ve yorumlama
   - Sistemin çıktılarını geçersiz kılma (override)
   - Otomasyon yanlılığı (automation bias) farkındalığı
   - Sistemi durdurmabilme ("stop button")
   - Sistemi kullanmama kararı verebilme

4. **Orantılılık:** Gözetim tedbirleri riskin düzeyine, sistemin özerkliğine ve kullanım bağlamına orantılı olmalı (Madde 14(3)).

5. **Biyometrik tanımlama özel kuralı (Madde 14(5)):** Uzaktan biyometrik tanımlama sistemlerinde, en az iki yetkin kişinin ayrı doğrulaması gerekli.

**Madde 26 — Deployer (Kullanıcı) Yükümlülükleri:**

Provider'ın tasarladığı gözetim mekanizmasını fiilen uygulamak deployer'ın sorumluluğunda:
- Yeterli yetkinlik, eğitim ve yetkiye sahip kişileri gözetim görevine atamak
- Kullanım talimatlarına uygun şekilde sistemi çalıştırmak
- Logları en az 6 ay saklamak
- Risk veya olay bildirimi yapmak

---

### 1.4 Üç Katmanlı Karşılaştırma

| Boyut | KVKK 11(1)(g) | GDPR 22 | EU AI Act 14 |
|-------|---------------|---------|--------------|
| **Odak** | Bireysel itiraz hakkı | Bireysel koruma (yasak) | Sistem tasarımı zorunluluğu |
| **Zamanlama** | Karar sonrası (ex-post) | Karar öncesi yasak (ex-ante) | Tasarım aşaması (by design) |
| **Kapsam** | Tüm otomatik kararlar | Tüm otomatik kararlar | Sadece yüksek riskli AI |
| **Mekanizma** | İtiraz → yeniden değerlendirme | Yasak + 3 istisna + güvenceler | Gözetim + override + durdurma |
| **Sorumluluk** | Veri sorumlusu | Veri sorumlusu | Provider + deployer (paylaşımlı) |
| **Yaptırım** | KVKK Madde 18 (sabit tutar) | GDPR Madde 83 (%4 ciro) | Madde 99 (%3 ciro — yüksek risk) |

---

### 1.5 ORIENT Eşlemesi

Bu konunun ORIENT aşamalarına eşlenmesi:

- **Observe:** AI sistemi otomatik karar mı veriyor? Kararın kapsamı ne? Hangi veriler kullanılıyor?
- **Risk:** Karar insanları ne ölçüde etkiliyor? (Hukuki etki, önemli etki, aleyhte sonuç — üç farklı eşik)
- **Identify:** KVKK 11(1)(g) itiraz mekanizması kurulmuş mu? EU AI Act Madde 14 gözetim gereklilikleri karşılanıyor mu? GDPR 22 de geçerli mi (AB vatandaşları için)?
- **Evaluate:** Mevcut insan gözetimi ne düzeyde? "Rubber stamp" mı yoksa anlamlı müdahale mi?
- **Navigate:** Eksik mekanizmaları (itiraz süreci, gözetim atama, override yeteneği) oluştur
- **Track:** İtiraz kayıtları, gözetim logları, Madde 14 uyum denetimleri takvime al

---

## Blok 2: Analiz Soruları (15 dk)

Aşağıdaki sorular bugünkü oturumda tartışılmak üzere hazırlanmıştır. Her sorunun ardında beklenen cevap çerçevesi yer almaktadır.

---

### Soru 1 — Kavram Sorusu

**KVKK Madde 11(1)(g)'deki "münhasıran otomatik" ifadesi ile EU AI Act Madde 14'teki "insan gözetimi" kavramı, aslında aynı madalyonun iki yüzü mü? Yoksa temelden farklı yaklaşımlar mı?**

*Beklenen cevap çerçevesi:*
- Farklı yaklaşımlar — KVKK bireysel haktan, EU AI Act sistem tasarımından girer
- KVKK reaktif (itiraz hakkı), EU AI Act proaktif (tasarımda gözetim)
- Ancak tamamlayıcı: KVKK bireye son savunma hattı verirken, EU AI Act sistemin baştan doğru kurulmasını sağlar
- İdeal durumda her ikisi de gerekli — "belt and suspenders" yaklaşımı

---

### Soru 2 — Senaryo Sorusu

**Bir Türk bankası kredi başvurularını tamamen algoritmik olarak değerlendiriyor. Sistem FICO benzeri bir skor üretiyor ve skor eşiğinin altında kalan başvurular otomatik reddediliyor. İnsan sadece "onay" butonuna basıyor ama skoru hiç değiştirmiyor. Bu durumda:**

**a) KVKK Madde 11(1)(g) kapsamında "münhasıran otomatik" karar mı bu?**
**b) EU AI Act Madde 14 açısından yeterli "insan gözetimi" var mı?**
**c) Bu bankaya ne önerirsin?**

*Beklenen cevap çerçevesi:*
- (a) Evet — "rubber stamp" insan müdahalesi, anlamlı müdahale sayılmaz. Münhasıran otomatik kabul edilebilir
- (b) Hayır — EU AI Act Madde 14(4) gözetimcinin sistemi "override" edebilmesini, çıktıyı yorumlayabilmesini, otomasyon yanlılığı farkındalığına sahip olmasını gerektirir. Salt onay butonu bunu karşılamaz
- (c) Öneriler: Gözetimciye eğitim, override yetkisi, skoru sorgulama prosedürü, belirli eşiklerde zorunlu insan incelemesi, itiraz sürecinin tasarlanması

---

### Soru 3 — Karşılaştırma Sorusu

**KVKK'nın otomatik karar almaya yaklaşımının GDPR Madde 22'ye göre daha zayıf kaldığı 3 somut noktayı belirle. Bunların AI sistemleri bağlamında pratik sonuçları ne olur?**

*Beklenen cevap çerçevesi:*
1. Yasak vs. itiraz hakkı → AI sistemi kurma aşamasında KVKK'da ek prosedürel yükümlülük yok
2. Profilleme tanımı eksik → Davranışsal profilleme yapan AI'lar için hukuki belirsizlik
3. Güvence mekanizmaları eksik → İtiraz sonrası "insan müdahalesi + görüş bildirme + itiraz" üçlüsü yok
- Pratik sonuç: Türkiye'de faaliyet gösteren şirketler, AB'ye hizmet veriyorsa GDPR'i de uygulamak zorunda — çift standart riski

---

### Soru 4 — ORIENT Sorusu

**Bir e-ticaret platformu, kullanıcılara kişiselleştirilmiş fiyatlandırma (dynamic pricing) uyguluyor. Aynı ürün farklı müşterilere farklı fiyatlarla gösteriliyor. Bu senaryoyu ORIENT çerçevesinden geçir — her aşamada ne yaparsın?**

*Beklenen cevap çerçevesi:*
- **O (Observe):** Kişiselleştirilmiş fiyatlandırma AI'ı — girdi: tarama geçmişi, konum, cihaz, satın alma geçmişi; çıktı: dinamik fiyat
- **R (Risk):** EU AI Act kapsamında risk sınıflandırması — muhtemelen sınırlı risk (Madde 50 şeffaflık) ama ayrımcılık riski varsa dikkatli değerlendir. KVKK açısından profilleme
- **I (Identify):** KVKK 11(1)(g) itiraz hakkı (aleyhte fiyatlandırma), EU AI Act Madde 50 (AI olduğunun bildirimi), olası tüketici hukuku ihlalleri
- **E (Evaluate):** Mevcut aydınlatma yeterli mi? İtiraz mekanizması var mı? Fiyat farklılığının ayrımcılık boyutu değerlendirilmiş mi?
- **N (Navigate):** Aydınlatma metnine dinamik fiyatlandırma bildirimi ekle, itiraz mekanizması kur, ayrımcılık testi yap
- **T (Track):** Şikayet kayıtları, fiyat farklılığı raporları, düzenli ayrımcılık denetimi takvime al

---

## Blok 3: ORIENT Notu & Hexis İçerik Fırsatları (10 dk)

### ORIENT Notu Şablonu — Gün 20

```
## Gün 20 — Otomatik Karar Alma ve Profilleme
**Faz:** Faz 4 — Çapraz Analiz
**ORIENT Eşlemesi:** Identify (yükümlülük haritası) + Evaluate (boşluk değerlendirmesi)

### Öğrenilenler
- KVKK 11(1)(g) reaktif bir hak (itiraz), EU AI Act 14 proaktif bir zorunluluk (tasarımda gözetim)
- "Münhasıran otomatik" eşiğinde rubber stamp insan müdahalesi sayılmaz
- GDPR 22 yasak getirirken KVKK sadece itiraz hakkı tanır — koruma düzeyi farkı önemli
- EU AI Act deployer yükümlülükleri (Madde 26) KVKK'daki veri sorumlusu yükümlülüklerinden çok daha detaylı
- Otomasyon yanlılığı (automation bias) farkındalığı EU AI Act'a özgü bir gereklilik

### Hexis İçerik Fırsatı
- Blog: "İnsan Gözetimi mi, Rubber Stamp mi? — AI Kararlarında Gerçek Denetim"
- LinkedIn: "KVKK vs. EU AI Act: Otomatik kararlara kim dur diyecek?" karşılaştırma infografiği
- Generator güncellemesi: İnsan gözetimi boyutunun "rubber stamp" vs. "anlamlı müdahale" ayrımını yansıtması
- Checklist önerisi: "İnsan gözetimi yetkinlik değerlendirme formu" eklenmesi
- Danışmanlık notu: HR AI sistemleri için çift uyum (KVKK + EU AI Act) kontrol listesi

### Zayıf Noktalar
- KVKK Kurul'un otomatik karar alma konusundaki spesifik kararları daha detaylı incelenmeli
- EU AI Act Madde 14(5) biyometrik tanımlama özel kuralı ayrı bir oturumda derinleştirilmeli
- "Anlamlı insan müdahalesi" eşiği için AB rehberleri takip edilmeli

### Yarın için Hazırlık
- Gün 21: Şeffaflık ve Bilgilendirme Yükümlülükleri
- KVKK Madde 10 (aydınlatma) ↔ EU AI Act Madde 13 + Madde 50 (şeffaflık)
- Deepfake/yapay içerik bildirimi konusuna hazırlan
```

---

## Kaynaklar

- [KVKK İlgili Kişi Hakları](https://www.kvkk.gov.tr/Icerik/2036/Ilgili-Kisinin-Haklari)
- [EU AI Act Madde 14 — Human Oversight](https://artificialintelligenceact.eu/article/14/)
- [EU AI Act Madde 26 — Deployer Obligations](https://artificialintelligenceact.eu/article/26/)
- [GDPR Madde 22](https://gdpr-info.eu/art-22-gdpr/)
- [IAPP: Under EU AI Act, high-risk systems require a human touch](https://iapp.org/news/a/eu-ai-act-shines-light-on-human-oversight-needs)
- [ICO: Rights related to automated decision making](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/rights-related-to-automated-decision-making-including-profiling/)
