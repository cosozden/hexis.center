# Gün 1 — KVKK'nın Yapısı ve Temel Kavramlar
**Faz 1: KVKK Temelleri | 27 Mart 2026**
**Maddeler:** KVKK Madde 1, 2, 3
**ORIENT Eşlemesi:** Observe — sistemi ve veri akışlarını tanımlama

---

## BLOK 1 — Kaynak + Kavrama (15 dk)

### Kanunun Kimliği

6698 sayılı Kişisel Verilerin Korunması Kanunu, 24 Mart 2016'da kabul edildi ve 7 Nisan 2016'da Resmi Gazete'de yayımlanarak yürürlüğe girdi. Türkiye'nin veri koruma alanındaki temel yasal çerçevesi. AB'nin 95/46/EC Direktifi ve sonrasında GDPR ile paralel bir yapıda tasarlanmış, ancak kendi özgün nüansları var.

**Kaynak:** [mevzuat.gov.tr — 6698 sayılı Kanun](https://mevzuat.gov.tr/mevzuat?MevzuatNo=6698&MevzuatTur=1&MevzuatTertip=5)

---

### Madde 1 — Amaç

Kanunun amacı: **kişisel verilerin işlenmesinde başta özel hayatın gizliliği olmak üzere kişilerin temel hak ve özgürlüklerini korumak** ve kişisel verileri işleyen gerçek ve tüzel kişilerin yükümlülüklerini belirlemek.

**Neden önemli?** Bu madde kanunun tüm ruhunu belirliyor. İki ayaklı bir yapı kuruyor: (1) birey haklarını koru, (2) veri işleyenlerin ne yapması gerektiğini söyle. Bu ikili yapı, EU AI Act'ın "haklar + yükümlülükler" dengesine çok benzer.

**Hexis perspektifi:** Bir danışman olarak müşteriye KVKK'yı anlatırken bu maddeyle başla. "Bu kanun sadece teknik uyum değil, temel hak koruması" demek, tonun ne olacağını belirler.

---

### Madde 2 — Kapsam

Kanun şu durumlarda uygulanır:
- Kişisel verileri **tamamen veya kısmen otomatik** olan yollarla işlenen gerçek kişiler
- Kişisel verileri **otomatik olmayan yollarla** bir **veri kayıt sisteminin** parçası olarak işlenen gerçek kişiler
- Bu verileri işleyen gerçek ve tüzel kişiler

**Kilit nüans:** Kanun yalnızca **gerçek kişilerin** verilerini korur. Tüzel kişi (şirket, kurum) verileri KVKK kapsamında değil — ancak bir tüzel kişi verisinden gerçek kişiye ulaşılabiliyorsa (örneğin tek ortaklı şirket), o veri kişisel veri sayılabilir.

**AI bağlamı:** Bir AI sistemi veri işliyorsa — bu tamamen otomatik bir işlemdir. Yani KVKK kapsamında herhangi bir kişisel veri içeriyorsa, kanun mutlaka devreye girer. Chatbot'un topladığı her kullanıcı mesajı, eğer kişiyi tanımlanabilir kılıyorsa, kişisel veridir.

**ORIENT eşlemesi — Observe:** Bir AI sistemini değerlendirirken ilk soru şu olmalı: "Bu sistem gerçek kişilere ait veri işliyor mu?" Evetse, KVKK kapsamındasın. Bu, Observe aşamasının temel çıktısı.

---

### Madde 3 — Tanımlar

Kanunun tüm yapısı bu tanımlar üzerine kuruluyor. Her birini derinlemesine kavramak şart.

#### Kişisel Veri
Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgi.

**"Belirlenebilir" sınırı burada kritik.** Bir verinin tek başına kişiyi tanımlamaması yeterli değil — başka verilerle birleştirildiğinde kişiyi tanımlayabiliyorsa, o da kişisel veridir. IP adresi, cihaz kimliği, çerez verileri, konum verisi — bunların hepsi bağlama göre kişisel veri sayılabilir.

**AI bağlamı:** Bir chatbot kullanıcısının girdiği metin, IP adresi, oturum süresi, hatta yazım biçimi (keystroke dynamics) — bunların hangileri kişisel veri? Cevap: bağlama bağlı, ama çoğu durumda evet.

#### Özel Nitelikli Kişisel Veri (Madde 6'da detaylı, ama tanım burada)
Irk, etnik köken, siyasi düşünce, felsefi inanç, din, mezhep, kılık kıyafet, dernek/vakıf/sendika üyeliği, sağlık, cinsel hayat, ceza mahkumiyeti, güvenlik tedbirleri, biyometrik ve genetik veriler.

**Neden ayrı bir kategori?** Bu veriler öğrenildiğinde ayrımcılığa veya mağduriyete yol açma potansiyeli daha yüksek. Bu yüzden işleme şartları çok daha katı (Madde 6 — Gün 2'de detaylı inceleyeceğiz).

**AI bağlamı:** Yüz tanıma sistemi = biyometrik veri = özel nitelikli. Duygu analizi sistemi çalışanın ruh halini işliyorsa, bu sağlık verisine girebilir. EU AI Act'ın Madde 5'teki yasaklarıyla doğrudan kesişim var.

#### Veri Sorumlusu
Kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan gerçek veya tüzel kişi.

**Kilit kelimeler:** "amaç" ve "vasıta" belirlemek. Kim "neden" ve "nasıl" sorularına karar veriyorsa, o veri sorumlusu.

#### Veri İşleyen
Veri sorumlusunun verdiği yetkiye dayanarak onun adına kişisel verileri işleyen gerçek veya tüzel kişi.

**AI bağlamı — kritik ayrım:** Bir şirket ChatGPT/Claude kullanıyorsa, şirket veri sorumlusu. Peki API sağlayıcı (OpenAI, Anthropic) veri işleyen mi? Bu, KVKK'nın Üretken Yapay Zeka Rehberi'nin (Kasım 2025) temel sorularından biri. Cevap karmaşık — modelin eğitim amaçlı veriyi kullanıp kullanmadığına bağlı.

**Kaynak:** [KVKK — Üretken Yapay Zeka Rehberi](https://www.kvkk.gov.tr/Icerik/8547/uretken-yapay-zeka-ve-kisisel-verilerin-korunmasi-rehberi-15-soruda)

#### Açık Rıza
Belirli bir konuya ilişkin, bilgilendirilmeye dayanan ve özgür iradeyle açıklanan rıza.

**Üç unsur:** (1) Belirli konu — genel izin yetmez, (2) Bilgilendirilme — kişi ne için izin verdiğini bilmeli, (3) Özgür irade — baskı, zorlama veya koşula bağlama olmamalı.

**AI bağlamı:** KVKK'ya göre, bir üretken AI sistemi kullanıldığında sadece "AI kullanıyoruz" demek açık rıza için yeterli değil. Sistemin türü, işleme amacı, verinin hangi üçüncü taraflarla paylaşılacağı hakkında bilgi verilmeli.

#### İlgili Kişi
Kişisel verisi işlenen gerçek kişi.

---

### Bu Madde Olmasa Ne Olurdu?

Madde 1-3 olmadan kanunun geri kalanı havada kalır. "Kişisel veri nedir?" sorusuna cevap yoksa, Madde 5'teki işleme şartları neye uygulanacak? "Veri sorumlusu" tanımı yoksa, yükümlülükler kime ait? Bu üç madde, tüm KVKK yapısının temel taşı.

---

## BLOK 2 — Analiz Soruları (15 dk)

Bu soruları oturumda birlikte çalışacağız. Şimdiden düşünmeye başla.

### Soru 1 — Kavram Sınama
**Bir e-ticaret sitesinin AI öneri motoru, kullanıcının tarama geçmişine göre ürün öneriyor. Kullanıcı adı veya e-postası işlenmiyor — sadece çerez bazlı anonim profilleme yapılıyor. Bu veriler KVKK kapsamında "kişisel veri" sayılır mı?**

*Beklenen cevap çerçevesi:* "Belirlenebilirlik" kriterine odaklan. Çerez tek başına anonim görünse de, IP adresi + çerez + cihaz bilgisi kombinasyonu kişiyi belirlenebilir kılabilir. KVKK'nın geniş tanımı burada devreye girer. Ayrıca AB'deki ePrivacy paraleli düşünülebilir.

### Soru 2 — Senaryo Testi
**Bir hastane, radyoloji görüntülerini analiz eden bir AI sistemi satın alıyor. Sistem bulut tabanlı ve sunucuları Almanya'da. Hastane bu sistemin KVKK kapsamındaki rollerini (veri sorumlusu / veri işleyen) nasıl belirlemeli? Peki AI sağlayıcı firma hangi rolde?**

*Beklenen cevap çerçevesi:* Hastane veri sorumlusu (amaç ve vasıtayı belirliyor). AI sağlayıcı büyük olasılıkla veri işleyen — ama eğer sağlayıcı görüntüleri model eğitimi için de kullanıyorsa, bu noktada müşterek veri sorumluluğu (joint controllership) tartışması başlar. Yurt dışı aktarım boyutu da var (Madde 9 — Gün 5'te derinleşeceğiz).

### Soru 3 — Karşılaştırma + ORIENT
**KVKK'daki "veri sorumlusu" kavramı ile EU AI Act'taki "deployer" (kullanıcı) kavramı arasındaki farklar ve benzerlikler neler? ORIENT çerçevesinde bu iki kavram hangi aşamada devreye giriyor?**

*Beklenen cevap çerçevesi:* KVKK veri sorumlusu = veri işleme kararlarını veren. EU AI Act deployer = AI sistemini kullanan. Çoğu durumda aynı kişi — ama her zaman değil. Deployer AI sistemini kullanır ama veri işleme kararlarını başka bir birim veriyor olabilir. ORIENT'te her ikisi de Observe aşamasında tanımlanır — "Bu sistemi kim işletiyor, kim karar veriyor?" soruları.

### Soru 4 — Pratik Savunma
**Bir müşteri sana şunu soruyor: "Biz sadece şirket verisi işliyoruz, bireysel müşteri verisi yok. KVKK bizi kapsamaz, değil mi?" 30 saniyede nasıl cevaplarsın?**

*Beklenen cevap çerçevesi:* Çalışan verileri de kişisel veridir — her şirket çalışan verisi işler. Ayrıca şirket verisi içinde gerçek kişilere ulaşılabiliyorsa (iletişim kişileri, imza sahipleri), o veri de kapsama girer. Yani "KVKK bizi kapsamaz" demek neredeyse hiçbir kuruluş için geçerli değil.

---

## BLOK 3 — ORIENT Notu Şablonu (10 dk)

Oturumda birlikte dolduracağımız şablon:

```
---
### Gün 1 — 27 Mart 2026 — KVKK'nın Yapısı ve Temel Kavramlar
**Faz:** Faz 1 — KVKK Temelleri
**ORIENT:** Observe
**Öğrenilenler:**
- [ ] Kilit çıkarım 1
- [ ] Kilit çıkarım 2
- [ ] Kilit çıkarım 3
- [ ] Sürpriz olan veya yanlış anladığım nokta
**Sorgulama çıktısı:**
- [ ] Blok 2'den çıkan en önemli nüans
- [ ] İtiraz noktası
**Hexis metodoloji notu:**
- [ ] ORIENT'te güçlendirilmesi gereken alan
**İçerik fırsatı:**
- [ ] Blog / LinkedIn / bülten / generator özelliği fikri
**Açık soru:**
- [ ] Bir sonraki oturuma taşınan şüphe
---
```

### Hexis İçerik Fırsatları — İlk Gözlemler

Bu günün konusundan çıkabilecek potansiyel içerikler:

1. **Blog:** "AI Sistemlerinde Veri Sorumlusu Kim? KVKK Perspektifi" — veri sorumlusu/veri işleyen ayrımını AI bağlamında analiz eden bir yazı
2. **LinkedIn gönderi:** "Kişisel veri nedir?" sorusunun AI çağında ne kadar karmaşıklaştığı üzerine kısa bir paylaşım
3. **Generator özelliği:** Observe aşamasında "veri sorumlusu / veri işleyen / müşterek veri sorumlusu" tespiti yapan bir alan eklenebilir
4. **Checklist:** KVKK temel tanımları kontrolü — "Veri sorumlusunu belirlediniz mi? Veri işleyenle sözleşme var mı?"

---

## Kaynaklar

- [6698 Sayılı KVKK — mevzuat.gov.tr](https://mevzuat.gov.tr/mevzuat?MevzuatNo=6698&MevzuatTur=1&MevzuatTertip=5)
- [KVKK Kanunun Amacı ve Kapsamı](https://www.kvkk.gov.tr/Icerik/4185/6698-Sayili-Kisisel-Verilerin-Korunmasi-Kanununun-Amaci-ve-Kapsami)
- [Özel Nitelikli Kişisel Veriler — KVKK](https://www.kvkk.gov.tr/Icerik/2051/Ozel-Nitelikli-Kisisel-Veriler)
- [Açık Rıza — KVKK](https://www.kvkk.gov.tr/Icerik/2037/Acik-Riza-Alirken-Dikkat-Edilecek-Hususlar)
- [Üretken Yapay Zeka Rehberi — KVKK](https://www.kvkk.gov.tr/Icerik/8547/uretken-yapay-zeka-ve-kisisel-verilerin-korunmasi-rehberi-15-soruda)
- [Etken Yapay Zeka (Agentic AI) — KVKK](https://www.kvkk.gov.tr/Icerik/8683/etken-yapay-zeka-agentic-ai)
