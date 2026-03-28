# Gün 4 — Veri Güvenliği ve Veri Sorumlusu Yükümlülükleri

**Faz:** 1 — KVKK Temelleri
**Maddeler:** KVKK Madde 12 (Veri Güvenliği), Madde 13 (Veri Sorumlusuna Başvuru), Madde 14 (Kurul'a Şikayet)
**ORIENT Eşlemesi:** Track — sürekli izleme ve güvenlik tedbirleri
**Tahmini Süre:** ~40 dakika (3 blok)

---

## BLOK 1 — Kaynak + Kavrama (15 dk)

### Bugünün Konumu

İlk üç günde KVKK'nın temellerini kurduk: Kanunun yapısı ve kavramlar (Gün 1), işleme şartları (Gün 2), aydınlatma ve haklar (Gün 3). Bugün üçüncü bölümün son ayağındayız: veri güvenliği yükümlülükleri, verilerin silinmesi/yok edilmesi, ve ilgili kişinin başvuru-şikayet hakkı. Bu maddeler, ORIENT'in Track aşamasına doğrudan karşılık gelir — sürekli izleme, güvenlik tedbirleri ve uyum döngüsü.

---

### Madde 12 — Veri Güvenliğine İlişkin Yükümlülükler

Bu madde, KVKK'nın "teknik" omurgasıdır. Dört temel yükümlülük getirir:

**1. Güvenlik tedbirleri alma yükümlülüğü (Fıkra 1):**
Veri sorumlusu, kişisel verilerin hukuka aykırı olarak işlenmesini önlemek, verilere hukuka aykırı olarak erişilmesini önlemek ve verilerin muhafazasını sağlamak amacıyla uygun güvenlik düzeyini temin etmeye yönelik gerekli her türlü **teknik ve idari tedbirleri** almak zorundadır.

- **Teknik tedbirler:** Şifreleme, erişim kontrolü, güvenlik duvarı, log yönetimi, sızma testi, yedekleme
- **İdari tedbirler:** Veri işleme politikaları, çalışan eğitimleri, gizlilik sözleşmeleri, veri envanteri, periyodik denetim

**AI bağlamında bu ne anlama gelir?**
Bir AI sistemi kişisel veri işliyorsa, sadece veritabanı güvenliği yetmez. Model güvenliği de Madde 12 kapsamında değerlendirilebilir:
- **Adversarial attack koruması** — modelin manipüle edilmesini engelleme
- **Data poisoning önlemi** — eğitim verisinin bozulmasını engelleme
- **Model extraction/inversion koruması** — modelden kişisel veri çıkarılmasını engelleme
- **Prompt injection savunması** — generative AI sistemlerinde veri sızıntısı riski

**2. Müşterek sorumluluk (Fıkra 2):**
Veri sorumlusu, kişisel verilerin kendi adına başka bir gerçek veya tüzel kişi tarafından işlenmesi halinde, bu kişilerle birlikte **müştereken sorumludur**. Bu, AI hizmeti satın alan şirketler için kritik: Cloud AI, SaaS AI veya API kullanıyorsanız, sağlayıcının güvenlik tedbirleri sizin de sorumluluğunuzdur.

**3. Denetim yükümlülüğü (Fıkra 3):**
Veri sorumlusu, kendi kuruluşunda, Kanun hükümlerinin uygulanmasını sağlamak amacıyla gerekli denetimleri yapmak veya yaptırmak zorundadır.

**4. Sır saklama yükümlülüğü (Fıkra 4):**
Veri sorumlusu ve veri işleyen, öğrendikleri kişisel verileri Kanun hükümlerine aykırı olarak başkasına açıklayamaz ve işleme amacı dışında kullanamazlar. Bu yükümlülük, görevden ayrılmalarından sonra da devam eder.

**5. İhlal bildirimi (Fıkra 5):**
İşlenen kişisel verilerin kanuni olmayan yollarla başkaları tarafından elde edilmesi halinde, veri sorumlusu bu durumu **en kısa sürede** ilgilisine ve Kurul'a bildirmek zorundadır.

Kurul'un 2019/10 sayılı kararına göre "en kısa süre" 72 saat olarak yorumlanmaktadır. Bu, GDPR'daki 72 saatlik bildirim süresiyle paraleldir.

**Neden önemli?** Madde 12 olmasa, veri koruma sadece kağıt üzerinde kalırdı. Bu madde, "veri topladıysanız koruyun" diyen pratik yükümlülüktür. AI sistemlerinde güvenlik açıkları klasik sistemlerden farklı olduğu için, Madde 12'nin AI'a özel yorumlanması gerekir — ve bu alan henüz gelişmektedir.

---

### Kişisel Verilerin Silinmesi, Yok Edilmesi, Anonim Hale Getirilmesi

KVKK Madde 7'de düzenlenen bu yükümlülük, Madde 12 ile birlikte okunmalıdır. 28 Ekim 2017 tarihli yönetmelik detayları belirler.

Üç farklı işlem, üç farklı seviye:

**Silme:** Kişisel verilerin ilgili kullanıcılar için hiçbir şekilde erişilemez ve tekrar kullanılamaz hale getirilmesi. Veri fiziksel olarak hâlâ mevcut olabilir ama erişim engellenmiştir.

**Yok etme:** Kişisel verilerin hiç kimse tarafından hiçbir şekilde erişilemez, geri getirilemez ve tekrar kullanılamaz hale getirilmesi. Fiziksel imha.

**Anonim hale getirme:** Kişisel verilerin, başka verilerle eşleştirilse dahi, hiçbir surette kimliği belirli veya belirlenebilir bir gerçek kişiyle ilişkilendirilemeyecek hale getirilmesi.

**AI bağlamında "silme paradoksu":**
Bu, AI governance'ın en tartışmalı konularından biri. Bir AI modeli eğitildikten sonra, eğitim verisini silseniz bile model o veriyi "öğrenmiş" haldedir. Parametreler arasında kişisel verinin izleri kalabilir. Bu durum üç temel soruyu doğurur:

1. **Silme yeterli mi?** Eğitim verisini veritabanından silmek Madde 7'yi karşılar mı, yoksa modeldeki "izler" de temizlenmeli mi?
2. **Machine unlearning:** Modelden belirli verilerin etkisini çıkarmaya yönelik teknikler geliştirilmektedir (örn. SISA — Sharded, Isolated, Sliced, and Aggregated training). Ancak bu teknikler henüz olgunlaşmamıştır ve tam garanti sunmaz.
3. **Pratik yaklaşım:** Kaynak veriyi silmek + logları temizlemek + output kontrolü uygulamak + gerektiğinde temiz veri üzerinde yeniden eğitim. Mutlak silme mümkün olmasa bile, makul tedbirlerin alınması beklenir.

---

### Madde 13 — Veri Sorumlusuna Başvuru

İlgili kişi, Madde 11'deki haklarını kullanmak için önce veri sorumlusuna başvurmak **zorundadır**. Bu, zorunlu bir ön koşuldur.

**Başvuru yolları:**
- Yazılı başvuru (ıslak imzalı)
- Kayıtlı elektronik posta (KEP)
- Güvenli elektronik imza
- Veri sorumlusuna daha önce bildirilen ve sistemde kayıtlı e-posta adresi

**Süre:** Veri sorumlusu, başvuruyu en geç **30 gün** içinde sonuçlandırmak zorundadır.

**Ücret:** Başvuru ücretsizdir. Ancak cevabın yazılı verilmesi halinde 10 sayfayı aşan kısım için Kurul'un belirlediği ücret talep edilebilir.

---

### Madde 14 — Kurul'a Şikayet

Veri sorumlusuna başvuru sonrasında:
- Başvuru reddedilmişse
- Verilen cevap yetersiz bulunmuşsa
- 30 gün içinde cevap verilmemişse

İlgili kişi, Kurul'a şikayette bulunabilir.

**Süre hesabı (2019/9 sayılı Kurul Kararı):**
- Veri sorumlusu cevap verdiyse: Cevabı öğrendiği tarihten itibaren **30 gün** içinde Kurul'a şikayet
- Veri sorumlusu cevap vermediyse: Başvuru tarihinden itibaren **60 gün** içinde Kurul'a şikayet

**Kurul'un inceleme süresi:** Şikayet tarihinden itibaren **60 gün**. Bu sürede cevap verilmezse talep reddedilmiş sayılır.

**Kurul kararının gücü:** İhlal tespit edilirse, veri sorumlusu kararı tebliğden itibaren en geç **30 gün** içinde yerine getirmek zorundadır.

**Neden önemli?** Bu mekanizma, KVKK'nın dişini gösterir. Madde 13-14 olmasa, ilgili kişi hakları teorik kalırdı. AI bağlamında: bir kullanıcı, otomatik karar almaya itiraz ettiğinde (Madde 11(1)(g)), bu süreç devreye girer.

---

### ORIENT Eşlemesi: Track

Madde 12-14, ORIENT'in **Track** aşamasına karşılık gelir:

- **Track — Güvenlik izleme:** Madde 12'nin teknik/idari tedbirleri sürekli olarak uygulanır, denetlenir, güncellenir
- **Track — İhlal yönetimi:** 72 saat bildirim süresi, kriz yönetimi planı
- **Track — Başvuru/şikayet takibi:** 30 gün cevap süresi, 60 gün Kurul süresi — bu süreleri takip etmek operasyonel bir gerekliliktir
- **Track — Veri yaşam döngüsü:** Saklama süresi dolduğunda silme/yok etme/anonimleştirme tetikleyicileri

Bir AI governance programında Track aşaması şunları içermelidir:
1. Periyodik güvenlik değerlendirmeleri (Madde 12(3))
2. İhlal müdahale planı (Madde 12(5))
3. Veri saklama/imha takvimi (Madde 7 + Yönetmelik)
4. Başvuru/şikayet yönetim sistemi (Madde 13-14)

### Hexis Perspektifi

Danışman olarak Madde 12-14'ü şöyle kullanırsın: Bir müşteriye "güvenlik tedbirleriniz var mı?" diye sormak yetmez. Somut kontrol listesiyle git:
- Erişim yetkilendirme matrisiniz var mı?
- AI model güvenliği değerlendirmesi yapıldı mı?
- Veri ihlali müdahale planınız var mı? Tatbikat yaptınız mı?
- Veri saklama ve imha politikanız var mı? AI eğitim verisi dahil mi?
- Başvuru yönetim süreciniz var mı? 30 gün süre takibi yapılıyor mu?

Bu sorular, ORIENT Track aşamasının pratik karşılığıdır.

---

## BLOK 2 — Analiz Soruları (15 dk)

### Soru 1 — Kavram Sınama

Bir şirketin veri ihlali yaşadığını ve müşteri verilerinin sızdığını varsay. Şirket, ihlali fark ettikten 5 gün sonra Kurul'a bildiriyor ve "teknik ekibimiz durumu analiz ediyordu" diye açıklama yapıyor.

**Soru:** Bu açıklama Madde 12(5) kapsamında yeterli mi? "En kısa süre" kavramı nasıl yorumlanmalı?

**Beklenen cevap çerçevesi:** Yeterli değil. Kurul'un 2019/10 sayılı kararı "en kısa süreyi" 72 saat olarak yorumlar. 5 gün bu süreyi aşar. Analiz süreci geçerli bir mazeret değil — ilk tespitten itibaren 72 saat içinde en azından ön bildirim yapılmalı. Detaylı analiz sonuçları sonra iletilebilir. GDPR'daki 72 saat kuralıyla paralellik var ama KVKK'da bu süre kanun metninde değil, Kurul yorumunda.

---

### Soru 2 — Senaryo Testi

Bir e-ticaret platformu, öneri algoritması için müşteri davranış verilerini kullanıyor. Bir müşteri, Madde 11(1)(g) kapsamında "otomatik karar almaya itiraz" hakkını kullanarak başvuru yapıyor. Şirket diyor ki: "Algoritmamız sadece öneri yapıyor, karar vermiyor."

**Soru:** Şirketin bu savunması geçerli mi? "Otomatik işleme" ile "otomatik karar alma" arasındaki fark nedir?

**Beklenen cevap çerçevesi:** Savunma kısmen geçerli ama riskli. Madde 11(1)(g) "münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhine bir sonuç doğurması" der. Kilit kelime "aleyhine bir sonuç." Eğer öneri algoritması sadece ürün öneriyorsa, doğrudan aleyhine sonuç tartışmalı. Ama eğer algoritma fiyat farklılaştırması yapıyorsa (dinamik fiyatlama), kredi teklifi sunuyorsa veya hizmet kalitesini farklılaştırıyorsa — bu "aleyhine sonuç" sayılabilir. Şirketin algoritmanın tam olarak ne yaptığını açıklaması gerekir.

---

### Soru 3 — AI Güvenlik Senaryosu

Bir sağlık AI startup'ı, hastaların radyoloji görüntülerini analiz eden bir model geliştiriyor. Model, cloud altyapısında çalışıyor. Bir araştırmacı, modele özel sorgular göndererek eğitim verisindeki hasta bilgilerini "çıkarabileceğini" (model inversion attack) gösteriyor.

**Soru:** Bu durum KVKK Madde 12 kapsamında nasıl değerlendirilir? Veri sorumlusu kimdir ve ne yapmalıdır?

**Beklenen cevap çerçevesi:** Bu klasik bir veri güvenliği ihlalidir. Veri sorumlusu (startup veya hastane — kimin amaç/vasıtayı belirlediğine bağlı) Madde 12(1) kapsamında model inversion attack'a karşı teknik tedbirler almak zorundaydı. Cloud sağlayıcıyla müşterek sorumluluk (Madde 12(2)) var. Sağlık verisi özel nitelikli veri olduğundan, güvenlik seviyesi daha da yüksek olmalı. Eğer gerçek bir sızıntı gerçekleşmişse, 72 saat içinde Kurul'a bildirim (Madde 12(5)) ve hastalara bilgilendirme zorunlu. Model güvenliği değerlendirmesi (adversarial robustness, differential privacy gibi teknikler) Madde 12'nin AI'a özel uygulaması olarak değerlendirilmeli.

---

### Soru 4 — Pratik Savunma (Machine Unlearning)

Bir müşteri sana geliyor: "Bir kullanıcı bizden verilerinin silinmesini istedi. Veritabanından sildik ama AI modelimiz o veriyle eğitilmişti. Modeli yeniden eğitmek milyonlarca liraya mal olur. Ne yapacağız?"

**Soru:** 30 saniyede bu müşteriye ne önerirsin?

**Beklenen cevap çerçevesi:** İlk adım panik yapmamak. Pratik yaklaşım: (1) Kaynak veriyi sildiniz — bu iyi, veri tabanı düzeyinde Madde 7 karşılandı. (2) Modelden veri çıkarılma riski ne kadar? Eğer model büyükse ve bireysel veri noktaları izole edilemiyorsa, risk düşüktür. (3) Logları, cache'leri, yedekleri de temizleyin. (4) Output kontrolü uygulayın — model çıktısında kişisel veri ifşası olmamasını sağlayın. (5) Bir sonraki eğitim döngüsünde o veriyi dahil etmeyin. (6) Bu süreci belgeleyin — "makul tedbirler aldık" savunması için. Tam yeniden eğitim orantısız olabilir ama Kurul kararları henüz bu konuda netlik sağlamadı.

---

## BLOK 3 — ORIENT Notu Şablonu (10 dk)

### Study-Log Kaydı

```
---
### Gün 4 — [Tarih] — Veri Güvenliği ve Veri Sorumlusu Yükümlülükleri
**Faz:** Faz 1 — KVKK Temelleri
**ORIENT:** Track
**Öğrenilenler:**
- [3-5 kilit çıkarım]
- Örn: Madde 12'nin AI sistemlerine uygulanmasında "teknik tedbirlerin" model güvenliğini de kapsadığı
- Örn: Machine unlearning'in pratik sınırları ve "makul tedbirler" yaklaşımı
- Örn: 72 saat ihlal bildirim süresinin kanun metninde değil Kurul yorumunda olması
- Örn: Başvuru-şikayet mekanizmasının zaman çizelgesi (30+30+60 gün)
**Sorgulama çıktısı:**
- [Blok 2'de ortaya çıkan nüanslar]
**Hexis metodoloji notu:**
- ORIENT Track aşamasında 4 izleme katmanı: güvenlik izleme, ihlal yönetimi, başvuru takibi, veri yaşam döngüsü
- AI sistemlerinde silme paradoksu, Track aşamasının en karmaşık alt bileşeni
**İçerik fırsatı:**
- Blog: "AI Modeliniz 'Unutabiliyor' mu? Machine Unlearning ve KVKK"
- LinkedIn: "Veri ihlali bildirimi — 72 saat yeterli mi?" tartışma gönderisi
- Generator: Track aşamasına ihlal bildirim ve saklama süresi takibi ekleme
- Checklist: Veri güvenliği bölümüne AI-spesifik tedbirler maddesi
**Açık soru:**
- [Bir sonraki oturuma taşınan şüphe]
---
```

### Hexis İçerik Fırsatları

1. **Blog yazısı:** "AI Modeliniz 'Unutabiliyor' mu? KVKK Madde 7 ve Machine Unlearning Paradoksu" — bu alan henüz Türkçe'de neredeyse hiç işlenmemiş, thought leadership fırsatı
2. **LinkedIn paylaşımı:** "Veri ihlali yaşadınız. 72 saatiniz var. AI sisteminiz dahil mi?" — aciliyet hissi yaratan, pratik kısa içerik
3. **Generator geliştirme:** Track aşamasında veri ihlali müdahale planı kontrol noktaları ve saklama/imha takvimi modülü
4. **Şablon kiti:** KVKK uyumlu "AI Sistemi Güvenlik Değerlendirme Kontrol Listesi" — teknik ve idari tedbirleri AI bağlamında somutlaştıran pratik araç

---

## Yarınki Konu: Gün 5 — Kurul, Yaptırımlar ve Yurt Dışı Aktarım

Gün 5 ile Faz 1'i tamamlıyoruz. KVKK'nın yaptırım mekanizması (Madde 18), yurt dışı aktarım kuralları (Madde 9) ve özellikle AI cloud hizmetlerinin yurt dışı aktarım boyutunu inceleyeceğiz.

---

## Kaynaklar

- [Veri Güvenliğine İlişkin Yükümlülükler — KVKK](https://www.kvkk.gov.tr/Icerik/2040/Veri-Guvenligine-Iliskin-Yukumlulukler)
- [Kişisel Veri Güvenliği Rehberi (Teknik ve İdari Tedbirler) — KVKK](https://www.kvkk.gov.tr/yayinlar/veri_guvenligi_rehberi.pdf)
- [Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonim Hale Getirilmesi — KVKK](https://www.kvkk.gov.tr/Icerik/2038/Kisisel-Verilerin-Silinmesi,-Yok-Edilmesi-veya-Anonim-Hale-Getirilmesi)
- [Kişisel Verilerin Silinmesi Yönetmeliği — KVKK](https://www.kvkk.gov.tr/Icerik/5441/KISISEL-VERILERIN-SILINMESI-YOK-EDILMESI-VEYA-ANONIM-HALE-GETIRILMESI-HAKKINDA-YONETMELIK)
- [Veri İhlali Bildirimi — Kurul 2019/10 Kararı](https://www.kvkk.gov.tr/Icerik/5362/Veri-Ihlali-Bildirimi)
- [Başvuru ve Şikayet Süreleri — Kurul 2019/9 Kararı](https://www.kvkk.gov.tr/Icerik/5358/Kamuoyu-Duyurusu)
- [Şikayet Hakkı — KVKK](https://www.kvkk.gov.tr/Icerik/2063/Sikayet-Hakki)
- [Machine Unlearning and Right to Erasure — IAPP](https://iapp.org/news/a/the-ai-right-to-unlearn-reconciling-human-rights-with-generative-systems)
- [6698 Sayılı Kanun — Mevzuat.gov.tr](https://mevzuat.gov.tr/mevzuat?MevzuatNo=6698&MevzuatTur=1&MevzuatTertip=5)
