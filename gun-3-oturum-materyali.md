# Gün 3 Oturum Materyali
## Aydınlatma Yükümlülüğü ve Haklar — KVKK Madde 10 & 11

**Tarih:** 24 Mart 2026
**Faz:** Faz 1 — KVKK Temelleri
**ORIENT:** Observe + Navigate
**Tahmini süre:** 40 dakika (3 blok)

---

## Blok 1 — Okuma Materyali (15 dk)

### Bağlam: Neden bugün bu iki madde?

Gün 1'de temel kavramları (veri sorumlusu, kişisel veri, işleme) ve Gün 2'de işleme şartlarını (rıza, meşru menfaat, Madde 5-6) ele aldık. Şimdi bir adım öteye geçiyoruz: *Şartları karşıladın diyelim, peki veri sahibine ne söylemek zorundasın?*

Madde 10 ve 11 bu sorunun yanıtı. Biri veri sorumlusuna yükümlülük, diğeri ilgili kişiye hak tanıyor. İkisi birlikte okumazsan manzaranın yarısını kaçırırsın.

---

### Madde 10 — Aydınlatma Yükümlülüğü

**Ne diyor?**
Veri sorumlusu, kişisel verileri toplanırken *ilgili kişiyi* bilgilendirmek zorunda. Bu bilgilendirme açık rızadan bağımsız — rıza olmasa bile aydınlatma yükümlülüğü var.

**Asgari bildirim içeriği (doğrulanmış — kvkk.gov.tr):**

| Bilgi | Açıklama |
|-------|----------|
| Veri sorumlusunun kimliği | Varsa temsilcisi de dahil |
| İşleme amacı | Ne için toplanıyor? |
| Aktarım bilgisi | Kimlerle, hangi amaçla paylaşılıyor? |
| Toplama yöntemi ve hukuki sebebi | Otomatik mi, manuel mi? Hangi şart? |
| Madde 11 hakları | İlgili kişiye haklarının hatırlatılması |

**Kilit nokta:** Aydınlatma; rızadan önce gelir. Rıza almak için aydınlatman gerekir ama aydınlatma, rıza almak için zorunlu olduğundan bağımsız — her halükarda zorunlu.

**Tebliğ detayı (Resmi Gazete 30356, 10.03.2018):**
"Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ" — katmanlı aydınlatma yaklaşımını getiriyor: özet + detaylı metin kombinasyonu kabul ediliyor.

---

### AI Bağlamı — Madde 10

Bir AI chatbot deploy ediyorsun. Kullanıcıya şunu söylemen gerekiyor:

- Bu sistemin bir AI olduğu *(AI kimliği — ayrıca EU AI Act Art. 50 kapsamında da)*
- Konuşmanın işlenip işlenmediği
- Model eğitimine gidip gitmediği
- Profilleme yapılıp yapılmadığı
- Otomatik karar mekanizmasının nasıl çalıştığının *genel mantığı*

Buradaki teknik gerilim: "Anlaşılabilir aydınlatma" nasıl olur? Transformer modelin çalışma mantığını ortalama kullanıcıya nasıl açıklarsın?
Kurumun yaklaşımı: Mekanizmanın *tam teknik detayı* değil, genel çalışma mantığı, anlamı ve sonuçları yeterli.

---

### Madde 11 — İlgili Kişinin Hakları

**Haklar listesi (doğrulanmış — kvkk.gov.tr/Icerik/2036):**

1. Kişisel verilerinin işlenip işlenmediğini öğrenme
2. İşlenmişse bilgi talep etme
3. Amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme
4. Yurt içi/yurt dışı aktarım bilgilerini öğrenme
5. Eksik/yanlış ise düzeltme talep etme
6. Silinmesini/yok edilmesini talep etme (Madde 7 şartları oluşmuşsa)
7. Düzeltme ve silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme
8. **Otomatik sistemlerle analiz sonucu aleyhine sonuç çıkmasına itiraz etme** ← AI kritik madde
9. Kanuna aykırı işleme sonucu zarara uğrarsa tazminat talep etme

**Madde 11(1)(g) — "Aleyhine Sonuç" Hakkı:**
Münhasıran otomatik sistemlerle analiz → kişi aleyhine sonuç → itiraz hakkı.
Bu hak GDPR Madde 22 ile paralel ama daha zayıf: GDPR'de bu tür kararlara karşı *genel bir yasak* var (istisnalar saklı), KVKK'da sadece *itiraz hakkı* tanınmış.

---

### ORIENT Eşlemesi

| ORIENT Aşaması | Madde 10/11 ile Bağlantı |
|---------------|--------------------------|
| **Observe** | Hangi verileri topluyoruz, nasıl, kimden? |
| **Navigate** | Aydınlatma metnini nasıl tasarlıyoruz? Hak talep mekanizması nasıl kurulacak? |

Neden ikisi birlikte? Çünkü aydınlatma tasarımı (Navigate) ancak veri akışını bilince (Observe) doğru yapılabiliyor.

---

## Blok 2 — Analiz Soruları (15 dk)

*Her soruyu önce kendin düşün, sonra beklenen çerçeveyle karşılaştır.*

---

### Soru 1 — Kavram (Madde 10 derinliği)

> Bir e-ticaret şirketi müşteri kayıt formuna şu cümleyi ekliyor: "Kişisel verileriniz Kanun'a uygun şekilde işlenecektir." Aydınlatma yükümlülüğü yerine getirilmiş midir?

**Beklenen cevap çerçevesi:**
Hayır. Asgari içerik karşılanmamış: veri sorumlusu kimliği, işleme amacı, aktarım bilgisi, hukuki sebep, Madde 11 hakları — hiçbiri yok. Genel ifade aydınlatma sayılmaz. Tebliğ, aydınlatmanın spesifik ve anlaşılır olmasını şart koşuyor. Yaptırım: 5.000 TL - 100.000 TL idari para cezası (Madde 18 kapsamında — ⚠️ 2026 tutarları güncellenmiş olabilir, doğrulama gerekli).

---

### Soru 2 — Senaryo (AI + Madde 11(g))

> Bir fintech uygulaması, kullanıcının harcama alışkanlıklarını analiz eden bir AI ile kredi limiti belirliyor. Kullanıcı "neden limitem düşürüldü?" diye soruyor ve sadece "algoritma kararı" yanıtını alıyor. Burada hangi hak ihlali(leri) var?

**Beklenen cevap çerçevesi:**
En az iki ihlal katmanı:
1. **Madde 10 ihlali:** Otomatik karar mekanizmasının işleyişi aydınlatma metninde açıklanmamış (mekanizmanın genel mantığı, anlamı, sonuçları)
2. **Madde 11(g) ihlali:** Münhasıran otomatik sistemle aleyhine karar → itiraz hakkı kullandırılmamış, sadece "algoritma kararı" demek hakkı fiilen işlevsiz kılıyor
3. Bonus: Şeffaflık ilkesi (Madde 4) ihlali — "kara kutu" yaklaşım.

---

### Soru 3 — Karşılaştırma (KVKK vs. GDPR)

> KVKK Madde 11(g) ile GDPR Madde 22 arasındaki temel fark nedir? Bu fark AI governance açısından ne anlam taşıyor?

**Beklenen cevap çerçevesi:**
GDPR Madde 22: Münhasıran otomatik işlemeye dayanan ve bireyi önemli ölçüde etkileyen kararlar *yasak* (hukuki/benzeri sonuç doğuran — istisnaları var: sözleşme, rıza, kamu görevi).
KVKK Madde 11(g): Sadece itiraz hakkı tanıyor, yasak getirmiyor.
Anlam: AB'de bu tür AI kararları için pozitif bir hukuki temel gerekiyor. Türkiye'de yeterli koruyucu tedbirler olsa da otomatik karar yasal — sadece itiraz mekanizması kurulması yeterli (ama EU AI Act yüksek riskli ise insan gözetimi şartı devreye giriyor).

---

### Soru 4 — ORIENT Uygulaması

> Bir sağlık sigortacısı, müşteri taleplerini değerlendiren bir AI sistemi kurdu. KVKK Madde 10-11 uyumunu sağlamak için ORIENT'in Observe ve Navigate aşamalarında ne yapmalı?

**Beklenen cevap çerçevesi:**
**Observe:** Sistemin işlediği veri türlerini haritalandır (sağlık verisi → özel nitelikli, Madde 6 kapsamında). Otomatik karar alma süreçlerini tespit et. Veri akışlarını çiz: girdi → model → çıktı → etkilenen kişi.
**Navigate:** Katmanlı aydınlatma metni tasarla (özet + detay). Otomatik karar mekanizması açıklamasını metne ekle ("Başvurunuz, [genel mantık açıklaması] çalışan bir sistem tarafından değerlendirilmektedir"). Madde 11 hak talep formunu ve sürecini kur. Özel nitelikli veri için açık rıza + ek tedbirler.

---

## Blok 3 — ORIENT Notu Şablonu (10 dk)

*Bu şablonu bugünün konusu için doldur — sahada kullanılacak format.*

---

### ORIENT Notu: Aydınlatma ve Hak Talep Mekanizması

**Sistem:** _______________
**Tarih:** 24.03.2026
**ORIENT Versiyonu:** v0.2.1

---

**O — Observe**
*Bu sistemde hangi kişisel veriler, kimden, nasıl toplanıyor?*

- Veri kategorileri: _______________
- Veri sahipleri (ilgili kişi türleri): _______________
- Toplama yöntemleri (otomatik / manuel): _______________
- Otomatik işleme/karar mekanizması var mı?: [ ] Evet [ ] Hayır
  - Varsa: Karar türü ve etkisi: _______________

---

**I — Identify** *(Madde 10-11 uyumu için)*

- [ ] Aydınlatma metni hazırlandı mı?
- [ ] Asgari içerik var mı? (kimlik, amaç, aktarım, yöntem/hukuki sebep, Madde 11 hakları)
- [ ] Otomatik karar mekanizması açıklaması eklendi mi?
- [ ] Madde 11 hak talep kanalı kuruldu mu? (e-posta / form / ____)
- [ ] Yanıt süresi belirlendi mi? (kanuni: 30 gün)

---

**E — Evaluate**
*Mevcut durum değerlendirmesi:*

| Yükümlülük | Durum | Gap |
|------------|-------|-----|
| Aydınlatma metni | ☐ Var ☐ Yok ☐ Eksik | ___ |
| AI açıklaması | ☐ Var ☐ Yok ☐ Yetersiz | ___ |
| Hak talep mekanizması | ☐ Var ☐ Yok ☐ İşlevsiz | ___ |
| Otomatik karar itiraz süreci | ☐ Var ☐ Yok | ___ |

---

**N — Navigate**
*Aksiyon planı:*

1. Aydınlatma metni [oluştur / güncelle] → Sorumlu: ___ / Tarih: ___
2. AI mekanizması açıklaması ekle → Sorumlu: ___ / Tarih: ___
3. Hak talep formu/kanalı kur → Sorumlu: ___ / Tarih: ___
4. Personeli Madde 11 süreçlerinde eğit → Sorumlu: ___ / Tarih: ___

---

**T — Track**
- Sonraki aydınlatma metni gözden geçirme tarihi: _______________
- Bekleyen hak talepleri: _______________
- Kurul kararı takip: kvkk.gov.tr/Icerik/5406

---

### Hexis İçerik Fırsatları

Bu oturumdan çıkan potansiyel içerikler:

1. **Blog:** "AI Sistemlerde Aydınlatma: 'Algoritma Kararı' Yeterli mi?" — Madde 11(g) pratiği, KVKK vs GDPR karşılaştırması
2. **LinkedIn:** "KVKK Madde 11(g): AI kararlarına itiraz hakkı — Türkiye'de ne kadar kullanılıyor?" (veri/araştırma bazlı gönderi)
3. **Generator:** Aydınlatma yükümlülüğü kontrol listesi → eu-ai-act-checklist.html'e eklenebilir
4. **Rehber:** "Anlaşılabilir AI Aydınlatması" — pratik metin şablonu

---

## Kaynaklar (Doğrulanmış)

- [KVKK Madde 10 — Aydınlatma Yükümlülüğü](https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-)
- [KVKK Madde 11 — İlgili Kişinin Hakları](https://www.kvkk.gov.tr/Icerik/2036/Ilgili-Kisinin-Haklari)
- [Aydınlatma Tebliği — Resmi Gazete 30356](https://kvkk.gov.tr/Icerik/5443/AYDINLATMA-YUKUMLULUGUNUN-YERINE-GETIRILMESINDE-UYULACAK-USUL-VE-ESASLAR-HAKKINDA-TEBLIG)
- [Kurul Kararı 2021/85 — Madde 11 Başvurusu](https://www.kvkk.gov.tr/Icerik/7112/2021-85)
- [Aydınlatma Yükümlülüğü Rehberi (PDF)](https://kvkk.gov.tr/SharedFolderServer/CMSFiles/a569a068-c079-4189-b134-f57bc727af7d.pdf)

---

*Hazırlanma tarihi: 24.03.2026 — Otomatik oturum*
*Kaynak doğrulaması: web_search ile yapıldı*
*Doğrulanamayan bilgi: 2026 güncel idari para cezası tutarları — oturumda kvkk.gov.tr'den kontrol et*
