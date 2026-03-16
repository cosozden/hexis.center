---
title: "Gölge Yapay Zekâ (Shadow AI): Türkiye'de KOBİ'lerin Görünmeyen Riski"
description: "Gölge yapay zekâ nedir? Çalışanların habersiz AI kullanımı KOBİ'lerde hangi KVKK ve EU AI Act risklerini yaratıyor? Tespit, önleme ve yönetişim rehberi."
date: 2026-03-17
category: KVKK
orient_stage: Observe
slug: golge-yapay-zeka-kobilerin-gorunmeyen-riski
reading_time: 22 dakika
keywords:
  - gölge yapay zeka
  - shadow ai
  - shadow ai risk
  - kvkk yapay zeka
  - kobi yapay zeka riski
  - chatgpt kvkk
  - ai governance kobi
  - yapay zeka yönetişim
  - gölge ai çalışan
  - eu ai act kobi
---

## Şirketinizde Kaç Kişi Şu An ChatGPT Kullanıyor?

Bu soruyu Türkiye'deki bir KOBİ yöneticisine sorduğunuzda, büyük ihtimalle "birkaç kişi denemiştir" gibi bir cevap alırsınız. Gerçek rakamlar ise çok farklı bir tablo çiziyor.

Küresel araştırmalara göre çalışanların yüzde 80'inden fazlası, BT departmanının bilgisi veya onayı olmadan yapay zekâ araçları kullanıyor.¹ Dahası, bu kullanıcıların yarısından fazlası bunu haftada en az bir kez yapıyor.² Üst düzey yöneticiler ise en yoğun kullanıcı grubu olarak öne çıkıyor.³

İşte bu durumun adı var: **gölge yapay zekâ** (*shadow AI*).

Gölge yapay zekâ, çalışanların kurumun bilgisi, onayı veya denetimi olmadan yapay zekâ araçlarını iş süreçlerine dahil etmesi anlamına geliyor. ChatGPT'ye müşteri verisi yapıştırmaktan, onaysız bir AI eklentisiyle rapor hazırlamaya kadar geniş bir yelpazeyi kapsıyor.

Bu yazıda gölge yapay zekânın Türkiye'deki KOBİ'ler için neden özellikle tehlikeli olduğunu, KVKK ve EU AI Act kapsamında hangi riskleri yarattığını ve bu riskleri yönetmek için neler yapılabileceğini ele alıyoruz.

## Gölge Yapay Zekâ Nedir? Gölge BT'den Farkı Ne?

Gölge BT (*shadow IT*) kavramı yeni değil. Çalışanların kurumsal BT politikaları dışında kendi araçlarını kullanması, bulut depolamadan kişisel e-posta hesaplarına kadar uzanan bir sorun olarak onlarca yıldır gündemde. Ama gölge yapay zekâ, gölge BT'nin çok daha tehlikeli bir evrimini temsil ediyor.

Sebebi şu: geleneksel gölge BT'de bir çalışan Dropbox'a dosya yüklediğinde, dosya olduğu gibi kalır. Ama bir çalışan ChatGPT'ye şirket verisi girdiğinde, bu veri potansiyel olarak modelin eğitim verisine dönüşebilir. Veri artık şirketin kontrolünde değildir ve geri alınamaz.

Gölge yapay zekâ ile gölge BT arasındaki temel farkları şöyle özetleyebiliriz:

- **Veri dönüşümü:** Gölge BT'de veri saklanır veya taşınır. Gölge AI'da veri işlenir, dönüştürülür ve potansiyel olarak model eğitimine dahil edilir.
- **Sınır ötesi aktarım:** Çoğu üretken yapay zekâ aracı, verileri yurt dışındaki sunucularda işler. Bu, KVKK'nın yurt dışı veri aktarımı kurallarını doğrudan devreye sokar.
- **Çıktı riski:** Gölge BT'de risk genellikle veri kaybıyla sınırlıdır. Gölge AI'da ise üretilen çıktılar (raporlar, analizler, kararlar) hatalı, önyargılı veya yanıltıcı olabilir ve iş süreçlerini doğrudan etkiler.
- **Ölçek ve hız:** Bir çalışan tek bir ChatGPT oturumunda yüzlerce müşteri kaydını işleyebilir. Geleneksel gölge BT'de bu ölçekte veri sızıntısı çok daha yavaş gerçekleşirdi.

## Rakamlar Ne Söylüyor? Küresel ve Yerel Veriler

Gölge yapay zekânın boyutunu anlamak için mevcut verilere bakalım.

### Küresel Tablo

IBM'in 2025 Veri İhlali Maliyeti Raporu'na göre yapay zekâ ile ilişkili veri ihlalleri, kurumlara ortalama 650.000 ABD dolarının üzerinde ek maliyet getiriyor.⁴ Gölge AI kaynaklı ihlaller tüm ihlallerin yüzde 20'sini oluşturuyor ve standart ihlallere kıyasla daha yüksek maliyetli: 4,63 milyon dolara karşılık 3,96 milyon dolar.⁵

Yapay zekâ araçlarını kullanan çalışanların yüzde 77'si, bu araçlara hassas iş verilerini yapıştırıyor.⁶ Kurumların yüzde 46'sı, üretken yapay zekâ aracılığıyla iç veri sızıntısı yaşandığını raporluyor.⁷

Gartner'ın tahminine göre 2030'a kadar kurumların yüzde 40'ından fazlası, yetkisiz gölge yapay zekâ kullanımına bağlı güvenlik veya uyumluluk olayları yaşayacak.⁸ Yine Gartner, 2027'ye kadar yapay zekâ kaynaklı veri ihlallerinin yüzde 40'ından fazlasının, sınır ötesi üretken yapay zekâ kötüye kullanımından kaynaklanacağını öngörüyor.⁹

### Türkiye Tablosu

Kişisel Verileri Koruma Kurumu (KVKK), bu konudaki farkındalığın önemini göstermek adına 24 Şubat 2026 tarihinde "İş Yerlerinde Üretken Yapay Zekâ Araçlarının Kullanımı" başlıklı bir rehber yayımladı.¹⁰ Bu rehber, Türkiye'deki kurumlar için bu alanda yayımlanan ilk kapsamlı ve detaylı çerçeve niteliğinde.

Rehberin ana odak noktası tam da gölge yapay zekâ: çalışanların kurumun bilgisi, onayı veya denetimi olmadan üretken yapay zekâ araçlarını iş süreçlerine dahil etmesi.¹⁰

KVKK'nın bu adımı, Türkiye'deki KOBİ'ler için önemli bir sinyal. Kurum, bu alandaki risklerin farkında ve beklentilerini netleştirmeye başlıyor.

## Türkiye'deki KOBİ'ler Neden Özellikle Savunmasız?

Gölge yapay zekâ her ölçekteki kurum için risk oluşturuyor, ama KOBİ'ler birkaç nedenden dolayı özellikle savunmasız.

### Kaynak Kısıtı

Büyük kurumlar, yapay zekâ yönetişim ekipleri kurabilir, DLP (*Data Loss Prevention*) çözümleri uygulayabilir ve çalışan eğitim programları düzenleyebilir. KOBİ'lerde genellikle bu kaynaklar mevcut değil. BT departmanı varsa bile yapay zekâ konusunda uzmanlaşmış personel bulmak zor.

### Politika Boşluğu

Küresel araştırmalara göre kurumların yalnızca yüzde 37'sinin yapay zekâ kullanımına ilişkin yönetişim politikası bulunuyor.¹¹ Türkiye'deki KOBİ'lerde bu oranın çok daha düşük olduğunu tahmin etmek güç değil. Politika olmadığında, çalışanlar kendi inisiyatiflerini kullanır ve bu genellikle "herkes ChatGPT kullanıyor, biz de kullanalım" şeklinde tezahür eder.

### Yanlış Güvenlik Algısı

Birçok KOBİ yöneticisi, "biz küçük bir firmayız, bizi kim denetler?" düşüncesine sahip. Ama KVKK'nın yaptırım geçmişi gösteriyor ki, kurum ölçeği ceza almayı engellemez. 2026 yılı için en yüksek idari para cezası 17.092.242 TL olarak belirlendi.¹² Bir KOBİ için bu rakam yıkıcı olabilir.

### Hızlı Benimseme, Yavaş Yönetişim

Türkiye'de yapay zekâ araçlarının benimsenmesi hızla artıyor, ama yönetişim altyapısı aynı hızda gelişmiyor. Çalışanlar yeni araçları denemeye istekli; şirketler ise bu kullanımı izleme, denetleme ve yönlendirme konusunda geride kalıyor.

## KVKK Kapsamında Gölge Yapay Zekâ Riskleri

Gölge yapay zekâ, KVKK'nın birçok temel ilkesini doğrudan ihlal edebilir. Bu riskleri somut senaryolarla inceleyelim.

### Yurt Dışı Veri Aktarımı (Madde 9)

Bir çalışan ChatGPT'ye müşteri verisi girdiğinde, bu veri OpenAI'ın yurt dışındaki sunucularına iletilmiş olur. KVKK Madde 9 uyarınca yurt dışına veri aktarımı, ilgili kişinin açık rızası veya yeterli korumanın bulunması koşuluna bağlıdır.¹³

Gölge yapay zekâ senaryosunda ise ne açık rıza alınmıştır ne de yeterli koruma değerlendirilmiştir. Veri aktarımı fiilen gerçekleşir, ama hukuki dayanak yoktur.

Bu konuyu daha detaylı incelediğimiz [ChatGPT'ye Müşteri Bilgisi Girenler: KVKK Yurt Dışı Aktarım Kuralları](/blog/chatgpt-kvkk-yurt-disi-aktarim/) yazımızda, bu senaryonun hukuki boyutlarını ele almıştık.

### Aydınlatma Yükümlülüğü (Madde 10)

KVKK, veri sorumlusunun ilgili kişileri kişisel verilerinin işlenmesi hakkında bilgilendirmesini zorunlu kılıyor. Bir çalışan müşteri verisini yapay zekâ aracına girdiğinde, müşteriye bu konuda herhangi bir bilgilendirme yapılmamıştır. Aydınlatma metinlerinde "verileriniz üçüncü taraf yapay zekâ araçlarında işlenebilir" gibi bir ifade muhtemelen yer almaz.

### Veri Güvenliği (Madde 12)

Veri sorumlusu, kişisel verilerin hukuka aykırı olarak işlenmesini önlemek ve verilere hukuka aykırı erişimi engellemek için uygun güvenlik düzeyini sağlamakla yükümlüdür. Gölge yapay zekâ kullanımında şirket, hangi verilerin hangi araçlara aktarıldığını bilmediği için bu güvenlik yükümlülüğünü yerine getirmesi mümkün değildir.

### Veri İhlali Bildirim Yükümlülüğü (Madde 12/5)

Gölge yapay zekâ aracılığıyla bir veri ihlali yaşanırsa, veri sorumlusu bu durumu en kısa sürede Kurul'a bildirmek zorundadır. KVKK, veri ihlali bildiriminin 72 saat içinde yapılmasını bekliyor.¹² Ama şirket, gölge AI kullanımından habersizse, ihlali tespit etmesi bile mümkün olmayabilir.

### Veri Sorumluları Sicili (VERBİS)

Kurumlar, VERBİS'e kayıt sırasında veri işleme faaliyetlerini ve aktarım yapılan tarafları beyan eder. Gölge yapay zekâ kullanımı, beyan edilmeyen veri işleme faaliyetleri yaratır. Bu durum, VERBİS kaydının eksik veya yanıltıcı olması anlamına gelir.

## EU AI Act Kapsamında Gölge Yapay Zekâ Riskleri

KVKK'nın yanı sıra, EU AI Act (Yapay Zekâ Yasası, Regulation (EU) 2024/1689) de gölge yapay zekâ konusunda önemli yükümlülükler getiriyor. Türkiye'deki KOBİ'ler, AB pazarına hizmet veriyorlarsa veya AB'deki müşterileri etkileyecek yapay zekâ sistemleri kullanıyorlarsa, bu yasanın kapsamına girebilir.

### AI Okuryazarlığı Yükümlülüğü (Madde 4)

EU AI Act'ın ilk yürürlüğe giren yükümlülüklerinden biri, 2 Şubat 2025 tarihinden itibaren geçerli olan AI okuryazarlığı gerekliliğidir.¹⁴ Madde 4, hem sağlayıcıları (*provider*) hem de kullanıcı kuruluşları (*deployer*) kapsıyor ve bu kuruluşların personelinin yeterli düzeyde yapay zekâ okuryazarlığına sahip olmasını sağlamak için uygun tedbirleri almalarını gerektiriyor.¹⁵

Gölge yapay zekâ, doğası gereği bir AI okuryazarlığı eksikliğinin göstergesi. Çalışanlar, kullandıkları araçların risklerini anlasalardı, muhtemelen onaysız kullanımdan kaçınırlardı. Bir kuruluşta yaygın gölge AI kullanımının tespit edilmesi, Madde 4 yükümlülüğünün yerine getirilmediğinin kanıtı olarak değerlendirilebilir.

Bu konuyu derinlemesine ele aldığımız [AI Okuryazarlığı: Madde 4 Yükümlülüğü Ne Gerektirir?](/blog/ai-okuryazarligi-madde-4/) yazımız, yükümlülüğün kapsamı ve uygulaması hakkında detaylı bilgi sunuyor.

### Yasaklı Uygulamalar (Madde 5)

EU AI Act'ın yasaklı uygulamalar listesinde yer alan bazı kullanımlar, gölge yapay zekâ yoluyla farkında olmadan gerçekleştirilebilir. Örneğin, çalışanların yapay zekâ araçlarını kullanarak çalışan davranışlarını puanlaması veya müşterilerin duygusal durumlarını analiz etmesi, belirli koşullarda yasaklı uygulamalar kapsamına girebilir.

### Şeffaflık Yükümlülükleri (Madde 50)

EU AI Act, yapay zekâ tarafından üretilen içeriğin bu şekilde etiketlenmesini gerektiriyor. Gölge yapay zekâ kullanımında, yapay zekâ tarafından üretilen raporlar, e-postalar veya analizler herhangi bir etiketleme olmadan iş süreçlerine girer. Bu durum, şeffaflık yükümlülüklerinin ihlali anlamına gelebilir.

## Samsung Vakası: Gölge AI'ın Somut Yüzü

Gölge yapay zekânın yarattığı riskleri somut bir örnekle görmek için Samsung vakasına bakalım.

Mart 2023'te Samsung, ChatGPT kullanımına izin verdikten sadece günler sonra üç ayrı veri sızıntısı olayıyla karşılaştı.¹⁶ Bir mühendis, yarı iletken veritabanından hatalı kaynak kodu ChatGPT'ye yapıştırarak hata düzeltme istedi. Bir başka çalışan, ekipman arızası tespit kodu optimizasyonu için kodu paylaştı. Üçüncü olayda ise bir çalışan, dahili toplantı tutanaklarını ChatGPT'ye özetletmek istedi.¹⁶

Sonuç: Samsung, tüm çalışanları için üretken yapay zekâ araçlarını yasaklamak zorunda kaldı.¹⁷ Ama o noktada, paylaşılan veriler çoktan OpenAI'ın sunucularında işlenmiş ve potansiyel olarak model eğitimine dahil edilmişti.

Bu olay bir teknoloji devinde yaşandı. Yapay zekâ yönetişim kaynakları çok daha sınırlı olan bir KOBİ'de benzer bir olayın sonuçlarını hayal etmek zor değil.

## Gölge Yapay Zekânın Beş Tipik Senaryosu

KOBİ'lerde gölge yapay zekâ genellikle şu senaryolarda ortaya çıkar:

### 1. Müşteri Verisiyle Prompt Yazma

Satış ekibinin müşteri listesini ChatGPT'ye yapıştırarak segmentasyon analizi yapması. Bu senaryoda müşteri isimleri, e-posta adresleri, satın alma geçmişi gibi kişisel veriler yurt dışındaki sunuculara aktarılır.

### 2. İK Süreçlerinde AI Kullanımı

İnsan kaynakları departmanının özgeçmişleri yapay zekâ araçlarına yükleyerek ön eleme yapması. Adayların kişisel verileri (isim, adres, eğitim geçmişi, iş deneyimi) işlenmiş olur ve bu işleme için adayların rızası alınmamıştır.

### 3. Hukuki Belge Analizi

Hukuk departmanının sözleşmeleri veya dava dosyalarını yapay zekâ araçlarına yükleyerek analiz ettirmesi. Bu belgelerde hem kurumsal gizli bilgiler hem de kişisel veriler bulunabilir.

### 4. Finansal Veri İşleme

Muhasebe veya finans ekibinin, müşteri fatura bilgilerini veya finansal raporları yapay zekâ araçlarında işlemesi. Mali veriler ve kişisel veriler bir arada sızma riski taşır.

### 5. Kod ve Teknik Belge Paylaşımı

Yazılım ekibinin, proprietary kodu yapay zekâ araçlarında debug etmesi veya teknik dokümantasyonu özetletmesi. Samsung vakasında olduğu gibi, ticari sırlar ve telif haklı içerik risk altına girer.

## Tespit: Gölge Yapay Zekâyı Nasıl Fark Edersiniz?

Gölge yapay zekânın en tehlikeli yönü, görünmez olmasıdır. Ama bazı sinyaller, kurumlara ipucu verebilir.

### Ağ Trafiği Analizi

BT ekipleri, kurumsal ağdan yapay zekâ servis sağlayıcılarına (api.openai.com, bard.google.com, claude.ai vb.) yapılan istekleri izleyebilir. Bu trafiğin varlığı, kurumsal yapay zekâ araçları dışında kullanım olduğunun göstergesidir.

### Çalışan Anketleri

Anonim anketlerle çalışanların yapay zekâ kullanım alışkanlıkları sorgulanabilir. Araştırmalar, anonim ortamda çalışanların gölge AI kullanımını kabul etme oranının çok daha yüksek olduğunu gösteriyor.

### Çıktı Kalitesi Değişimleri

Belirli çalışanların çıktı kalitesinde veya hızında ani artışlar, yapay zekâ araç kullanımının göstergesi olabilir. Bu başlı başına bir sorun değildir, ama kurumsal politika yoksa gölge kullanımın habercisi olabilir.

### Tarayıcı Uzantı Denetimi

Çalışanların tarayıcılarında yüklü yapay zekâ uzantıları (Grammarly AI, ChatGPT eklentileri vb.) kontrol edilebilir. Bu uzantılar, çalışanın ne yazdığını üçüncü taraf sunuculara iletebilir.

## Yedi Adımlı KOBİ Yol Haritası: Gölge AI'ı Yönetmek

Gölge yapay zekâyla mücadelenin yolu yasaklamak değil, yönetmektir. Tamamen yasaklayan kurumların başarı oranı düşük: çalışanlar alternatif yollar buluyor veya verimlilik kaybı yaşanıyor. Doğru yaklaşım, kullanımı görünür ve yönetilebilir kılmaktır.

### Adım 1: Mevcut Durumu Haritalayın (ORIENT: Observe)

İlk adım, kurumunuzdaki yapay zekâ kullanımının gerçek resmini çıkarmaktır. Kim, hangi araçları, hangi verilerle kullanıyor? Anonim bir anket yapın. Ağ trafiğini inceleyin. Amacınız cezalandırmak değil, anlamak.

### Adım 2: Risk Değerlendirmesi Yapın (ORIENT: Risk)

Tespit ettiğiniz kullanım senaryolarını risk seviyesine göre sınıflandırın. Hangi kullanımlar kişisel veri içeriyor? Hangileri yurt dışı veri aktarımı yaratıyor? Hangileri ticari sır riski taşıyor? [Hexis Risk Classifier](https://hexis.center/generator/) aracımız, yapay zekâ sistemlerini risk seviyelerine göre sınıflandırmanıza yardımcı olabilir.

### Adım 3: Kabul Edilebilir Kullanım Politikası Oluşturun

Net, anlaşılır ve uygulanabilir bir yapay zekâ kullanım politikası hazırlayın. Bu politika şunları içermeli:

- Hangi yapay zekâ araçlarının kullanılabileceği
- Hangi veri türlerinin bu araçlara asla girilemeyeceği (kişisel veri, ticari sır, gizli bilgi)
- Onay süreçleri: yeni bir araç kullanmadan önce kimden izin alınmalı
- İhlal durumunda uygulanacak prosedürler

### Adım 4: Onaylı Araç Listesi Belirleyin

Çalışanların ihtiyaçlarını karşılayacak, kurumsal güvenlik gereksinimlerini sağlayan yapay zekâ araçlarını belirleyin ve onaylayın. Kurumsal ChatGPT (Team veya Enterprise sürüm), Microsoft Copilot for Business veya benzeri kurumsal çözümler, veri güvenliği açısından bireysel kullanıma göre çok daha güvenlidir.

### Adım 5: AI Okuryazarlık Eğitimi Verin

KVKK'nın "İş Yerlerinde Üretken Yapay Zekâ Araçlarının Kullanımı" rehberi ve EU AI Act Madde 4 yükümlülüğü, çalışan eğitiminin önemini açıkça vurguluyor.¹⁰·¹⁵ Eğitim şunları kapsamalı:

- Yapay zekâ araçlarına veri girmenin hukuki sonuçları
- Kişisel veri, ticari sır ve gizli bilgi ayrımı
- Güvenli kullanım pratikleri: veriyi anonimleştirme, hassas bilgileri çıkarma
- Yapay zekâ çıktılarını doğrulama ve eleştirel değerlendirme

### Adım 6: Teknik Kontroller Uygulayın

Politika tek başına yeterli değil. Teknik kontroller de gerekiyor:

- Onaysız yapay zekâ sitelerine erişimi kısıtlayan ağ filtreleri
- DLP (*Data Loss Prevention*) çözümleri ile hassas veri sızıntısını tespit etme
- Kurumsal cihazlara onaysız uygulama yükleme kısıtlamaları
- Yapay zekâ kullanımını izleyen log ve denetim mekanizmaları

### Adım 7: Düzenli Gözden Geçirme (ORIENT: Track)

Yapay zekâ ekosistemi hızla değişiyor. Altı ayda bir politikalarınızı, araç listenizi ve risk değerlendirmenizi gözden geçirin. Yeni araçlar piyasaya çıkıyor, mevcut araçların veri politikaları değişiyor, regülasyonlar güncelleniyor. Yönetişim sürekli bir süreçtir, tek seferlik bir proje değil.

## KVKK Rehberinin KOBİ'lere Mesajı

KVKK'nın 24 Şubat 2026 tarihli "İş Yerlerinde Üretken Yapay Zekâ Araçlarının Kullanımı" rehberi, bağlayıcı bir düzenleme olmasa da Kurum'un beklentilerini ve değerlendirme kriterlerini gösteren önemli bir kaynak.¹⁰

Rehberin KOBİ'ler için öne çıkan mesajlarını şöyle özetleyebiliriz:

- **Farkındalık beklentisi:** Kurum, işverenlerin çalışanlarının yapay zekâ kullanımından haberdar olmasını ve bu kullanımı yönlendirmesini bekliyor.
- **Veri sınıflandırması:** Hangi verilerin yapay zekâ araçlarına girilebileceği, hangi verilerin kesinlikle girilmemesi gerektiği netleştirilmeli.
- **Üçüncü taraf değerlendirmesi:** Kullanılan yapay zekâ araçlarının veri işleme politikaları, veri saklama süreleri ve aktarım lokasyonları incelenmeli.
- **Kayıt ve izlenebilirlik:** Yapay zekâ kullanımının kayıt altına alınması ve denetlenebilir olması.

## Maliyet Analizi: Yapmamanın Bedeli vs. Yapmanın Maliyeti

KOBİ yöneticilerinin sıklıkla sorduğu soru şu: "Bunları yapmak maliyetli değil mi?"

Karşılaştıralım.

**Yapmamanın potansiyel bedeli:**

- KVKK idari para cezası: 2026 için tavan 17.092.242 TL¹²
- Veri ihlali bildirim ve yönetim maliyetleri
- İtibar kaybı ve müşteri güveni erozyonu
- Potansiyel tazminat davaları
- EU AI Act kapsamında cezalar: yüksek riskli ihlallerde 15 milyon euro veya küresel cironun yüzde 3'ü (hangisi yüksekse); KOBİ'ler için hangisi düşükse o uygulanır (Madde 99(4)(6))¹⁸

**Temel önlemlerin yaklaşık maliyeti:**

- Yapay zekâ kullanım politikası oluşturma: dahili iş gücü ile yapılabilir
- Çalışan farkındalık eğitimi: yarım günlük bir atölye çalışması
- Ağ seviyesinde temel izleme: mevcut BT altyapısının konfigürasyonu
- Kurumsal yapay zekâ aracı lisansı: kullanıcı başına aylık 20-30 dolar civarı

Fark açık: önlem almanın maliyeti, önlem almamanın potansiyel bedelinin yanında çok küçük kalıyor.

## 2026 Takvimi: Kritik Tarihler

Gölge yapay zekâ yönetişimiyle ilgili önemli tarihler:

- **2 Şubat 2025** (yürürlükte): EU AI Act yasaklı uygulamalar (Madde 5) ve AI okuryazarlığı yükümlülüğü (Madde 4)¹⁴
- **2 Ağustos 2025** (yürürlükte): Genel amaçlı yapay zekâ (GPAI) yükümlülükleri (Madde 51-56)
- **24 Şubat 2026**: KVKK "İş Yerlerinde Üretken Yapay Zekâ Araçlarının Kullanımı" rehberi yayımlandı¹⁰
- **2 Ağustos 2026**: EU AI Act yüksek riskli sistem yükümlülükleri yürürlüğe giriyor (Ek III)
- **2030** (Gartner tahmini): Kurumların yüzde 40'ından fazlası gölge AI kaynaklı güvenlik olayı yaşayacak⁸

## Sıkça Sorulan Sorular

**Çalışanlarımız ChatGPT'yi yalnızca genel sorular sormak için kullanıyor. Bu da risk mi?**

Genel bilgi soruları (örneğin "Python'da for döngüsü nasıl yazılır?") kişisel veri içermediği sürece düşük risklidir. Ama sınır çok hızlı bulanıklaşır. Bir çalışan "genel soru" niyetiyle başlayıp, bir süre sonra iş verilerini de dahil edebilir. Bu yüzden net bir politikanın varlığı, risk seviyesinden bağımsız olarak önemlidir.

**Kurumsal ChatGPT Team kullanıyorsak sorun yok mu?**

Kurumsal sürümler, bireysel kullanıma göre çok daha güvenlidir. OpenAI'ın kurumsal sürümlerinde veriler model eğitimine kullanılmaz ve ek güvenlik önlemleri mevcuttur. Ama bu, tüm riskleri ortadan kaldırmaz. Yurt dışı veri aktarımı devam eder, dolayısıyla KVKK kapsamında uygun önlemlerin alınması gerekir.

**KVKK rehberi bağlayıcı mı?**

Rehber doğrudan bağlayıcı bir düzenleme değildir, ancak Kurum'un beklentilerini ve değerlendirme kriterlerini yansıtır.¹⁰ Bir denetim veya ihlal durumunda, Kurum'un bu rehberi referans olarak kullanması kuvvetle muhtemeldir. Bu nedenle KOBİ'lerin rehberi ciddiye alması önerilir.

**EU AI Act Türkiye'deki şirketleri etkiler mi?**

AB pazarına hizmet veren, AB'deki kişileri etkileyen yapay zekâ sistemleri kullanan veya AB'den müşterisi olan Türk şirketleri, EU AI Act kapsamına girebilir (Madde 2). Ayrıca, Türkiye'nin AB uyum süreçleri çerçevesinde benzer düzenlemeler getirmesi beklenmektedir.

**Gölge yapay zekâyı tamamen yasaklamak çözüm mü?**

Hayır. Tam yasağın başarı oranı düşüktür. Çalışanlar kişisel cihazlarından, mobil veri bağlantılarıyla erişmeye devam eder. Doğru yaklaşım, güvenli kullanımı mümkün kılan bir yönetişim çerçevesi oluşturmaktır. KVKK rehberi de bu yaklaşımı destekliyor.

## Sonuç: Görünmeyeni Görünür Kılmak

Gölge yapay zekâ, Türkiye'deki KOBİ'ler için sessiz ama ciddi bir risk. Çalışanlarınız muhtemelen şu an bir yapay zekâ aracı kullanıyor ve siz muhtemelen bunun farkında değilsiniz.

İyi haber şu: bu riski yönetmek, düşündüğünüzden daha kolay ve ucuz. Birinci adım, gerçeği görmek. İkinci adım, bir politika oluşturmak. Üçüncü adım, çalışanlarınızı eğitmek.

KVKK'nın rehberi yayımlandı. EU AI Act yükümlülükleri devreye girmeye başladı. Pencere kapanmadan harekete geçmek, hem hukuki hem ticari açıdan en akıllıca strateji.

Şirketinizdeki yapay zekâ kullanımının risk haritasını çıkarmak istiyorsanız, [Hexis Risk Classifier](https://hexis.center/generator/) aracımızla başlayabilirsiniz.

---

## Kaynaklar

1. UpGuard. *Shadow AI is Widespread — and Executives Use It the Most*. Cybersecurity Dive, Kasım 2025. [cybersecuritydive.com](https://www.cybersecuritydive.com/news/shadow-ai-employee-trust-upguard/805280/)

2. Zylo. *Shadow AI Explained: Causes, Consequences, and Best Practices for Control*. 2025. [zylo.com](https://zylo.com/blog/shadow-ai/)

3. UpGuard. *Shadow AI is Widespread — and Executives Use It the Most*. Cybersecurity Dive, Kasım 2025. [cybersecuritydive.com](https://www.cybersecuritydive.com/news/shadow-ai-employee-trust-upguard/805280/)

4. IBM. *2025 Cost of Data Breach Report*. IBM Security, 2025. [ibm.com](https://www.ibm.com/think/topics/shadow-ai)

5. CloudRadix. *Shadow AI Is Your Biggest Data Risk in 2026*. 2026. [cloudradix.com](https://cloudradix.com/blog/shadow-ai-data-risk/)

6. eSecurity Planet. *77% of Employees Leak Data via ChatGPT, Report Finds*. 2025. [esecurityplanet.com](https://www.esecurityplanet.com/news/shadow-ai-chatgpt-dlp/)

7. Vectra AI. *Shadow AI Explained: Risks, Costs, and Enterprise Governance*. 2025. [vectra.ai](https://www.vectra.ai/topics/shadow-ai)

8. Gartner. *40% of Enterprises Will Experience Shadow AI Breaches by 2030*. IT Pro, Kasım 2025. [itpro.com](https://www.itpro.com/technology/artificial-intelligence/gartner-says-40-percent-of-enterprises-will-experience-shadow-ai-breaches-by-2030-educating-staff-is-the-key-to-avoiding-disaster)

9. Gartner. *Critical GenAI Blind Spots That CIOs Must Urgently Address*. Gartner Newsroom, Kasım 2025. [gartner.com](https://www.gartner.com/en/newsroom/press-releases/2025-11-19-gartner-identifies-critical-genai-blind-spots-that-cios-must-urgently-address0)

10. Kişisel Verileri Koruma Kurumu. *İş Yerlerinde Üretken Yapay Zekâ Araçlarının Kullanımı*. kvkk.gov.tr, 24 Şubat 2026. [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/8674/is-yerlerinde-uretken-yapay-zeka-araclarinin-kullanimi)

11. IBM. *2025 Cost of Data Breach Report — Shadow AI Governance Statistics*. IBM Security, 2025. [ibm.com](https://www.ibm.com/think/topics/shadow-ai)

12. Nesil Teknoloji. *2026 KVKK Cezaları ve Güncel Kurul Kararları*. 2026. [nesilteknoloji.com](https://www.nesilteknoloji.com/kvkk-idari-para-cezalari-guncel-ceza-kararlari-analizi/)

13. Kişisel Verileri Koruma Kurumu. *6698 Sayılı Kişisel Verilerin Korunması Kanunu*. kvkk.gov.tr. [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/6649/6698-SAYILI-KANUN)

14. Avrupa Parlamentosu ve Konseyi. *Regulation (EU) 2024/1689 — Artificial Intelligence Act*. EUR-Lex, 12 Temmuz 2024. [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)

15. EU Artificial Intelligence Act. *Article 4: AI Literacy*. artificialintelligenceact.eu. [artificialintelligenceact.eu](https://artificialintelligenceact.eu/article/4/)

16. AI Incident Database. *Incident 768: ChatGPT Implicated in Samsung Data Leak*. 2023. [incidentdatabase.ai](https://incidentdatabase.ai/cite/768/)

17. Bloomberg. *Samsung Bans Generative AI Use by Staff After ChatGPT Data Leak*. Mayıs 2023. [bloomberg.com](https://www.bloomberg.com/news/articles/2023-05-02/samsung-bans-chatgpt-and-other-generative-ai-use-by-staff-after-leak)

18. Avrupa Parlamentosu ve Konseyi. *Regulation (EU) 2024/1689, Article 99 — Penalties*. EUR-Lex. [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)
