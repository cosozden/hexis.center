# Gün 21 — Şeffaflık ve Bilgilendirme Yükümlülükleri

**Faz:** 4 — Çapraz Analiz (KVKK × EU AI Act)
**Tarih:** 17 Mart 2026
**Süre:** 40 dakika (3 blok)
**ORIENT Eşlemesi:** Observe + Identify — sistemi tanımlama ve yükümlülük haritalaması

---

## Blok 1: Okuma & Kavrama (15 dk)

### Karşılaştırma Ekseni

KVKK Madde 10 (aydınlatma yükümlülüğü) ile EU AI Act Madde 13 (yüksek riskli sistemlerde şeffaflık) ve Madde 50 (tüm AI sistemleri için şeffaflık) arasındaki farklar, kesişimler ve uygulama gerçeklikleri.

---

### 1.1 KVKK Madde 10 — Aydınlatma Yükümlülüğü

KVKK Madde 10, veri sorumlusuna kişisel verileri elde etmeden önce veya en geç elde ettiği anda ilgili kişiyi bilgilendirme yükümlülüğü getirir.

**Zorunlu içerik (asgari unsurlar):**

1. Veri sorumlusunun (ve varsa temsilcisinin) kimliği
2. Kişisel verilerin işlenme amacı
3. Kişisel verilerin kimlere ve hangi amaçla aktarılabileceği
4. Kişisel veri toplama yöntemi ve **hukuki sebebi** (Madde 5 veya 6 hangi şartına dayanıyor?)
5. Madde 11 kapsamındaki ilgili kişi hakları

**Kritik özellikler:**

- **Bağımsız yükümlülük:** Açık rıza dahil herhangi bir işleme şartından bağımsız — rıza almadan önce bile aydınlatma yapılmalı
- **Ispat yükümlülüğü:** Aydınlatmanın yapıldığını kanıtlama sorumluluğu tamamen veri sorumlusunda
- **Zamanlama:** En geç kişisel verinin elde edildiği anda; dolaylı toplama halinde makul süre içinde veya ilk iletişimde
- **Amaç değişikliği:** Her yeni işleme amacı için ayrı aydınlatma gerekli

**AI bağlamında özel zorluklar:**

- AI sistemi müşteri verisi topluyorsa, aydınlatma metninde "otomatik sistem" ibaresi açıkça yer almalı
- Profilleme yapılıyorsa, bu da aydınlatma içeriğine dahil edilmeli (özellikle Madde 11(1)(g) itiraz hakkıyla bağlantılı)
- Model eğitimi için veri kullanımı → hukuki sebebin açıkça belirtilmesi gerekiyor
- Chatbot, öneri motoru, fiyatlandırma algoritması — her biri farklı aydınlatma gereklilikleri yaratabilir

**2025 ceza bandı:** Aydınlatma yükümlülüğü ihlali → 5.000 TL alt sınır, 100.000 TL üst sınır (YDO ile artışta — 2025'te 1,3 milyon TL'ye yakın seviyelere ulaşıyor). İhlal ayrıca tazminat davası riskini de beraberinde getiriyor.

---

### 1.2 EU AI Act Madde 13 — Yüksek Riskli Sistemlerde Deployer'a Şeffaflık

Madde 13, yalnızca **yüksek riskli AI sistemleri** için geçerli ve yükümlülük sahibi **provider** (sağlayıcı). Hedef kitle ise son kullanıcı değil, **deployer** (sistemi sahaya süren kuruluş).

**Temel gereklilik:** Yüksek riskli AI sistemleri, deployer'ların sistemi doğru anlayıp kullanabilmesi için yeterince şeffaf biçimde tasarlanmalı ve geliştirilmeli (Madde 13(1)).

**Kullanım talimatları içermesi gereken bilgiler (Madde 13(3)):**

1. Provider kimliği ve iletişim bilgileri
2. Sistemin yetenekleri ve **sınırlamaları**
3. Doğruluk metrikleri, sağlamlık ve siber güvenlik test verileri
4. Sağlık, güvenlik ve temel haklara yönelik bilinen riskler
5. Çıktıların nasıl yorumlanacağına dair rehberlik
6. Sistemde önceden belirlenmiş değişiklikler
7. Log toplama ve saklama mekanizmaları (Madde 12 ile bağlantı)
8. Bakım ve güncelleştirme bilgileri

**Önemli ayrım:** Madde 13 deployer'a yönelik teknik şeffaflık — son kullanıcıya değil. Deployer bu bilgileri alır, kendi kullanıcılarına nasıl iletileceğine kendisi karar verir (Madde 26 çerçevesinde).

**DPIA bağlantısı:** GDPR kapsamında DPIA (Veri Koruma Etki Değerlendirmesi) yapması gereken deployer'lar, Madde 13 çerçevesinde aldıkları bilgileri bu değerlendirmede kullanmalı.

**Yürürlük:** Ağustos 2026 (Annex III yüksek riskli sistemler için).

---

### 1.3 EU AI Act Madde 50 — Tüm AI Sistemleri için Şeffaflık (Sınırlı Risk)

Madde 50, yüksek risk sınıfında olmasa da belirli AI kullanımlarında şeffaflık zorunlu kılar. Bu madde Ağustos 2026'da yürürlüğe girecek — ama hazırlık şimdi başlamalı.

**Dört temel yükümlülük kategorisi:**

**A) Chatbot ve etkileşimli AI bildirimi (Madde 50(1)):**
- Provider, doğal kişilerle doğrudan etkileşime giren AI sistemlerini açıkça bildirmelidir
- Kullanıcı, AI ile konuştuğunu bilmelidir — "bariz olmadıkça" veya hukuki amaçlar için (suç tespiti gibi)
- Kapsam dışı: spam filtresi, öneri sınıflandırıcı, e-posta otomatik yanıtlayıcı

**B) Duygu ve biyometrik analiz bildirimi (Madde 50(3)):**
- Deployer, duygu tanıma veya biyometrik sınıflandırma sistemine maruz kalan kişileri bu durumdan haberdar etmeli
- İstisna: Hastalık veya yorgunluk tespiti amacıyla kullanılan sistemler

**C) Deepfake bildirimi (Madde 50(4)):**
- Gerçek kişileri, yerleri veya olayları taklit eden yapay görsel/ses/video içeriği oluşturan veya değiştiren deployer, bunu açıkça ifşa etmeli
- İstisna: Açıkça sanatsal, yaratıcı, satirik veya kurgusal içerikler — bu durumda minimal ifşa yeterli
- "Deepfake" tanımı: Madde 3(60) — gerçekmiş gibi yanıltabilecek yapay içerik

**D) AI üretimi metin bildirimi (Madde 50(2)):**
- Kamusal ilgi konularında AI tarafından üretilen metinler makine okunaklı şekilde işaretlenmeli
- Gazetecilik, kamu iletişimi bağlamında kritik

**2025-2026 güncel gelişme — Şeffaflık Uygulama Kodu (Code of Practice):**
- Aralık 2025: AB AI Office ilk taslağı yayımladı
- Mart 2026: İkinci taslak bekleniyor (tam bu dönemde!)
- Haziran 2026: Final kod bekleniyor
- Öneri: "AI" veya yerel dil karşılığı (Türkçe: "YZ") içeren ortak görsel etiket
- Bu kod gönüllü ama uyum referansı haline gelecek

---

### 1.4 Üç Katmanlı Karşılaştırma

| Boyut | KVKK Madde 10 | EU AI Act Madde 13 | EU AI Act Madde 50 |
|-------|---------------|--------------------|--------------------|
| **Kapsam** | Tüm kişisel veri işleme | Sadece yüksek riskli AI | Chatbot, deepfake, duygu analizi |
| **Hedef** | İlgili kişi (veri sahibi) | Deployer (kurumsal) | Son kullanıcı |
| **İçerik** | Kim, amaç, alıcı, hukuki sebep, haklar | Sistem yetenekleri, sınırlamalar, riskler | AI olduğunu bildirme, deepfake ifşası |
| **Yükümlü** | Veri sorumlusu | Provider | Provider (chatbot/metin) + Deployer (deepfake/duygu) |
| **Zamanlama** | Veri toplama anı | Piyasaya sürmeden önce | Kullanım sırasında, gerçek zamanlı |
| **Yürürlük** | Aktif (2016'dan beri) | Ağustos 2026 | Ağustos 2026 |
| **Ceza** | Sabit tutar (TL) | €15M / %3 ciro | €15M / %3 ciro (yüksek risk ihlaline eşdeğer) |
| **AI-spesifik** | Değil — genel kişisel veri | Evet — tam AI odaklı | Evet — tam AI odaklı |

**Kritik boşluk:** KVKK Madde 10 aydınlatma metninde "bu karar bir AI sistemi tarafından verilmektedir" diye bir zorunluluk yok. EU AI Act bu boşluğu Madde 50 ile kapatıyor. Türkiye'de faaliyet gösteren bir şirket KVKK aydınlatmasına EU AI Act Madde 50 ruhunu da yansıtmalı — hem hukuki güvenlik hem kullanıcı güveni için.

---

### 1.5 ORIENT Eşlemesi

- **Observe:** Hangi AI sistemleri kullanıcıyla etkileşime giriyor? Deepfake üretiliyor mu? Duygu analizi yapılıyor mu? Hangi kişisel veri toplanıyor?
- **Risk:** Yüksek riskli Annex III kapsamında mı? Madde 50 kapsamı — chatbot, deepfake, duygu analizi var mı? Risk düzeyine göre farklı şeffaflık yükü
- **Identify:** KVKK Madde 10 aydınlatması hazır mı? AI sistemi bileşenleri aydınlatmada var mı? EU AI Act Madde 13 kullanım talimatları provider tarafından sağlandı mı? Madde 50 ifşa zorunlulukları belirlendi mi?
- **Evaluate:** Mevcut aydınlatma metni AI işlemelerini kapsıyor mu? "Bu sistem otomatik karar verir" ibaresi var mı? Chatbot kullanıcısı AI ile konuştuğunu biliyor mu? Deployer Madde 13 belgelerini aldı ve anlıyor mu?
- **Navigate:** Aydınlatma metnini güncelle — AI bileşenlerini, otomatik karar alma riskini ekle. Chatbot için Madde 50 uyumlu "AI ile konuşuyorsunuz" bildirimi tasarla. Deepfake üretimi varsa ifşa mekanizması kur. Yüksek riskli sistem varsa provider'dan Madde 13 belgelerini talep et
- **Track:** Aydınlatma metni güncelleme takvimi, Madde 50 Ağustos 2026 son tarihi, Code of Practice güncellemelerini takip et (Mart 2026 ikinci taslak, Haziran 2026 final)

---

## Blok 2: Analiz Soruları (15 dk)

---

### Soru 1 — Kavram Sorusu

**KVKK Madde 10 aydınlatma yükümlülüğü ile EU AI Act Madde 50 chatbot bildirimi, aynı amacı mı güdüyor yoksa temel farkları var mı? "Şeffaflık" kavramının her iki mevzuatta farklı anlam taşıdığını savunabilir misin?**

*Beklenen cevap çerçevesi:*
- Yüzeysel benzerlik var — her ikisi de bilgilendirme zorunluluğu
- Ancak köklü farklar: KVKK kişisel veri işleme süreçleri hakkında genel bilgilendirme; Madde 50 AI'ın varlığını kullanım anında ifşa etme
- KVKK "önceki" şeffaflık (veri toplama öncesi), Madde 50 "anlık" şeffaflık (etkileşim sırasında)
- KVKK hedeflenmiş bireysel bilgi hakkı, Madde 50 dezenformasyon ve manipülasyon önleme hedefi
- Sonuç: Tamamlayıcı, ama farklı amaçlı — iki ayrı uyum adımı gerektiriyor

---

### Soru 2 — Senaryo Sorusu

**Bir sigorta şirketi, müşteri hizmetleri için AI destekli chatbot kullanıyor. Chatbot, poliçe sorularını yanıtlıyor ve talep yönetimine yönlendiriyor. Sistemin arka planında duygu analizi modülü de var — müşteri memnuniyet puanı üretiyor. Bu senaryoda:**

**a) KVKK Madde 10 kapsamında aydınlatma metni ne içermeli?**
**b) EU AI Act Madde 50 kapsamında hangi ifşa yükümlülükleri var?**
**c) Chatbot yüksek riskli sayılır mı? (Madde 13 devreye girer mi?)**

*Beklenen cevap çerçevesi:*
- (a) KVKK: Chatbot üzerinden kişisel veri toplandığı (ses, yazı, sigorta bilgisi), duygu analizi yapıldığı, hangi amaçla kullanıldığı, yurt dışı aktarım varsa belirtilmeli. Madde 11 hakları (Madde 11(1)(g) itiraz dahil)
- (b) Madde 50: 1) Chatbot ifşası — "AI ile konuşuyorsunuz" bildirimi zorunlu. 2) Duygu analizi ifşası (Madde 50(3)) — müşteri duygu analizi yapıldığını bilmeli
- (c) Sigorta Annex III Madde 6(2)(b) kapsamında yüksek riskli olabilir — talep yönetimi kararı veriyorsa. Sadece bilgi veriyorsa değil. "Anlamlı etki" testi yapılmalı. Yüksek riskli sayılırsa Madde 13 belgeleri + Madde 14 insan gözetimi de devreye girer

---

### Soru 3 — Karşılaştırma Sorusu

**Deepfake içerik üretimi KVKK açısından tamamen serbest mi? EU AI Act Madde 50(4) deepfake ifşasını zorunlu kılarken KVKK'da neden karşılığı yok? Bu boşluğun Türkiye'de pratik sonuçları ne?**

*Beklenen cevap çerçevesi:*
- KVKK kişisel verinin işlenmesini düzenliyor — deepfake içerikte tanımlanabilir gerçek kişi varsa kişisel veri (Madde 3(1)(d) — "belirlenebilir kişi") işleme sayılabilir, ama "deepfake ifşa zorunluluğu" kavramı yok
- KVKK'da sessizlik: Kişilik hakları (TMK) ve yanlış bilgi/dezenformasyon hukuku başka mevzuatla ele alınıyor
- EU AI Act Madde 50(4) Ağustos 2026'da yürürlüğe girecek — AB'de hizmet sunan Türk içerik üreticileri etkilenecek
- Pratik sonuç: Türkiye'de faaliyet gösteren şirket AB müşterilerine deepfake içerik sunuyorsa Madde 50(4) uygulanıyor. Sadece Türk pazarında ise şimdilik yalnızca KVKK (kişilik hakları ihlali riski)
- Boşluk: Türkiye'nin deepfake düzenlemesi yok — Hexis içerik fırsatı

---

### Soru 4 — ORIENT Sorusu

**Bir dijital pazarlama ajansı, müşterileri için AI ile üretilmiş sosyal medya içeriği ve promo videoları hazırlıyor. Bazı videoların arka planında gerçek insan görüntüleri var ama yüzler AI tarafından değiştirilmiş. Şirketi ORIENT çerçevesinden geçir — Madde 50(4) ve KVKK perspektifini birlikte uygula.**

*Beklenen cevap çerçevesi:*
- **O (Observe):** Generatif AI ile video üretimi, deepfake yüz değişikliği, B2B hizmet (ajans müşteri için üretiyor = deployer/provider karmaşası)
- **R (Risk):** EU AI Act açısından minimal risk ama Madde 50(4) devreye giriyor. Tanınabilir kişiler kullanılıyorsa (gerçek insan görüntüsü) KVKK kapsamı
- **I (Identify):** Madde 50(4) deepfake ifşa zorunluluğu. KVKK: Tanınan kişi varsa kişisel veri işleme, açık rıza veya başka hukuki temel lazım. Kişilik hakları riski (TMK)
- **E (Evaluate):** Şu an nasıl çalışıyor? Hangi videolarda ifşa var? Tanımlanabilir kişilerden izin alınmış mı?
- **N (Navigate):** Deepfake etiketi politikası oluştur, "AI tarafından üretilmiştir" ibaresi standartlaştır, tanınan kişiler için onay süreci
- **T (Track):** Ağustos 2026 son tarihi, Code of Practice güncellemelerini (Mart 2026 ve Haziran 2026) izle, proje bazlı deepfake kayıtları tut

---

## Blok 3: ORIENT Notu & Hexis İçerik Fırsatları (10 dk)

### ORIENT Notu Şablonu — Gün 21

```
## Gün 21 — Şeffaflık ve Bilgilendirme Yükümlülükleri
**Faz:** Faz 4 — Çapraz Analiz
**ORIENT Eşlemesi:** Observe (sistem tanımlama) + Identify (yükümlülük haritası)

### Öğrenilenler
- KVKK Madde 10 genel kişisel veri aydınlatması — AI özelinde eksiklikler var
- EU AI Act Madde 13 deployer'a teknik şeffaflık — son kullanıcıya değil
- EU AI Act Madde 50 kullanıcıya gerçek zamanlı ifşa — chatbot, deepfake, duygu analizi
- "Şeffaflık" farklı anlam taşıyor: KVKK "önceki bilgilendirme", Madde 50 "anlık ifşa"
- Deepfake düzenlemesi KVKK'da yok — AB'deki boşluk Madde 50(4) ile giderildi
- Code of Practice süreci devam ediyor: Mart 2026 ikinci taslak bekleniyor

### Yeni Gelişme (Güncel!)
- Aralık 2025: EU AI Office şeffaflık CoP ilk taslağını yayımladı
- Haziran 2026'da final — Ağustos 2026 yürürlük öncesi kritik dönem
- Ortak "AI" / "YZ" etiketi önerisi gündemde

### Hexis İçerik Fırsatı
- Blog: "Chatbot Aydınlatma Metni Nasıl Yazılır? — KVKK + EU AI Act Uyumlu Şablon"
- LinkedIn: "Deepfake Bildirimi Zorunlu Hale Geliyor — Türk Şirketler Hazır Mı?" post
- Generator özelliği: Madde 50 kapsamı tespiti (chatbot, deepfake, duygu analizi checkbox'u)
- Checklist önerisi: "Aydınlatma Metni AI Uyumu Kontrol Listesi" — KVKK + Madde 50 bağlantılı
- Danışmanlık notu: Chatbot sahibi müşteriler için iki katmanlı şeffaflık paketi

### Zayıf Noktalar
- Türkiye'deki deepfake mevzuatı araştırılmalı (TMK, TCK kapsamı)
- AB'nin "bariz" etkileşim istisnasının sınırları belirsiz — EDPB/AI Office rehberi bekleniyor
- Code of Practice güncellemelerini takip et (Mart 2026)

### Yarın için Hazırlık
- Gün 22: Veri Güvenliği ve Teknik Yükümlülükler
- KVKK Madde 12 (güvenlik tedbirleri) ↔ EU AI Act Madde 15 (doğruluk, sağlamlık, siber güvenlik)
- AI-spesifik güvenlik kavramları: adversarial robustness, data poisoning, model extraction
```

---

## Kaynaklar

*Web search ile doğrulandı — 17 Mart 2026*

- [KVKK Aydınlatma Yükümlülüğü — Resmi Sayfa](https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-)
- [KVKK Aydınlatma Tebliği](https://kvkk.gov.tr/Icerik/5443/AYDINLATMA-YUKUMLULUGUNUN-YERINE-GETIRILMESINDE-UYULACAK-USUL-VE-ESASLAR-HAKKINDA-TEBLIG)
- [EU AI Act Madde 13 — Resmi Metin](https://artificialintelligenceact.eu/article/13/)
- [EU AI Act Madde 13 — AB Hizmet Masası](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-13)
- [EU AI Act Madde 50 — Resmi Metin](https://artificialintelligenceact.eu/article/50/)
- [AB Şeffaflık Code of Practice — İlk Taslak (Aralık 2025)](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content)
- [Jones Day: EU AI Act Şeffaflık CoP Analizi](https://www.jonesday.com/en/insights/2026/01/european-commission-publishes-draft-code-of-practice-on-ai-labelling-and-transparency)
