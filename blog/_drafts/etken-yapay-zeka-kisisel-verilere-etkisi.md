---
title: "Etken Yapay Zekâ (Agentic AI) Kişisel Verileri Nasıl Etkiliyor? KVKK Raporu Analizi"
description: "KVKK'nın Etken Yapay Zekâ (Agentic AI) raporunu analiz ediyoruz. Kişisel veri koruma ilkelerini zorlayan beş risk alanı ve uyum önerileri."
date: 2026-03-15
category: KVKK
orient_stage: Risk
slug: etken-yapay-zeka-kisisel-verilere-etkisi
reading_time: 7 dakika
keywords:
  - etken yapay zeka
  - agentic ai
  - kvkk agentic ai raporu
  - agentic ai kişisel veri
  - yapay zeka veri koruma
  - kvkk yapay zeka
  - privacy by design yapay zeka
  - agentic ai riskleri
---

## Etken Yapay Zekâ (Agentic AI) Neden Farklı?

Yapay zekâ sistemlerinin büyük çoğunluğu belirli bir girdi alır, önceden tanımlanmış bir işlem yapar ve bir çıktı üretir. Bir spam filtresi e-postaları sınıflandırır, bir öneri motoru ürün önerir. Bu sistemlerde veri işleme kapsamı öngörülebilirdir.

*Agentic AI* (Etken Yapay Zekâ) ise temelden farklı bir işleyiş sergiliyor. Etken yapay zekâ sistemleri hedef yönelimli çalışır, çok adımlı görevleri planlayıp yürütür ve süreç boyunca otonom kararlar alabilir. Tek bir teknoloji türünden ziyade, geleneksel YZ'ye kıyasla otonomi düzeyinin ve çevreyle etkileşimin belirgin biçimde arttığı bir yaklaşımı ifade ediyor.¹

Kişisel Verileri Koruma Kurumu (KVKK), 12 Mart 2026 tarihinde yayımladığı [Etken Yapay Zekâ (Agentic AI)](https://www.kvkk.gov.tr/Icerik/8683/etken-yapay-zeka-agentic-ai) raporu ile bu sistemlerin kişisel veriler üzerindeki etkilerini sistematik biçimde ele aldı. Rapor, mevcut veri koruma çerçevesinin etken yapay zekâ için büyük ölçüde geçerliliğini koruduğunu belirtmekle birlikte, bu ilkelerin uygulanmasında yeni zorluklar ortaya çıktığını vurguluyor.¹

Bu yazıda, KVKK'nın Agentic AI raporundan hareketle etken yapay zekânın kişisel verilere etkisini beş kritik eksende inceliyoruz.

## 1. Amaçla Sınırlılık İlkesi Zorlanıyor {#amacla-sinirlilik}

Kişisel verilerin korunmasının temel taşlarından biri, verilerin belirli, açık ve meşru amaçlarla işlenmesidir. Klasik YZ'de bu amacı baştan tanımlamak görece kolaydır.

Etken YZ'de ise durum farklılaşıyor. Bu sistemler görevin ilerleyişine bağlı olarak veri kullanımına ilişkin değerlendirmelerini güncelleyebiliyor. Başlangıçta öngörülmeyen veri kümeleri sürece dahil edilebiliyor veya mevcut veriler farklı görevler kapsamında yeniden kullanılabiliyor.¹ Bu dinamik yapı, veri işleme faaliyetlerinin kapsamının zaman içerisinde değişkenlik göstermesine neden oluyor.

Somut bir örnekle düşünelim: bir müşteri destek aracısı olarak tasarlanan Etken YZ sistemi, müşterinin geçmiş etkileşim kayıtlarını analiz ederken, bu verileri ayrıca bir *churn prediction* (müşteri kaybı tahmini) modeline girdi olarak kullanmaya başlayabilir. Bu noktada, başlangıçta "müşteri destek" amacıyla toplanan veriler farklı bir bağlamda işlenmiş oluyor.

## 2. Veri Minimizasyonu Güçleşiyor {#veri-minimizasyonu}

Veri minimizasyonu ilkesi, yalnızca amaca ulaşmak için gerekli olan verilerin işlenmesini öngörür. Etken YZ sistemlerinin hedef odaklı ve çok adımlı işleyiş yapısı, bu ilkenin uygulanmasını karmaşıklaştırıyor.

KVKK raporu, sistemin görevlerini yerine getirirken hangi verilerin "gerekli" olduğunu bağlama göre kendisinin değerlendirebildiğini belirtiyor.¹ Bir araştırma görevinde çalışan Etken YZ sistemi, birden fazla veri kaynağını bir arada değerlendirebiliyor ve farklı uzmanlık alanlarından veri çekebiliyor. Hangi verilerin gerçekten gerekli olduğuna ilişkin sınırlar, statik kurallarla değil, sistemin dinamik değerlendirmeleriyle şekilleniyor.

Bu durum, özellikle birden fazla YZ aracısının etkileşim halinde çalıştığı yapılarda daha belirgin hale geliyor. Her bir aracı kendi görev kapsamında veri işlerken, toplam veri işleme hacmi ve kapsamı, tek bir aracının işleyeceğinden çok daha geniş bir yelpazeye ulaşabiliyor.

## 3. Hukuki Dayanak Sorunu Derinleşiyor {#hukuki-dayanak}

Kişisel verilerin işlenmesi için geçerli bir hukuki dayanağın (işleme şartının) bulunması gerekir. Etken YZ sistemlerinde veri işleme faaliyetlerinin çok adımlı yapısı, bu dayanağın yaşam döngüsü boyunca geçerliliğini korumasını zorlaştırıyor.¹

KVKK raporu bu konuda önemli bir tespit yapıyor: sistemin ilerleyen aşamalarda yeni veri türleri işlemeye başlaması veya mevcut verileri başlangıçta öngörülmeyen biçimlerde kullanması, başlangıçtaki hukuki dayanağın kapsam ve içerik bakımından yeterli kalıp kalmadığı sorusunu gündeme getiriyor.¹

Örneğin, açık rıza temelinde başlatılan bir veri işleme faaliyeti, sistemin otonom kararlarıyla genişlediğinde, ilgili kişinin rızasının bu genişletilmiş kapsamı da kapsayıp kapsamadığı belirsizleşebiliyor.

## 4. Şeffaflık ve Açıklanabilirlik Karmaşıklaşıyor {#seffaflik}

YZ sistemlerinde *black box* (kara kutu) problemi uzun süredir tartışılıyor. KVKK raporu, bu problemin Etken YZ'de daha karmaşık bir görünüm kazandığını belirtiyor.¹

Bunun temel nedeni, Etken YZ'nin çok adımlı ve hedef yönelimli işleyişi. Birden fazla YZ aracısının etkileşim halinde çalıştığı yapılarda, belirli bir kararın veya kişisel veri kullanımının hangi aracı ya da süreç adımıyla ilişkili olduğunun tespiti zorlaşıyor.¹ Bu durum hem ilgili kişilerin aydınlatılmasını hem de olası ihlallerde sorumluluk tespitini güçleştiriyor.

Rapor, bu zorluğa karşı sistemlerin üstlendiği görevlerin niteliği ve ortaya çıkabilecek riskler dikkate alınarak uygun açıklanabilirlik düzeyinin sağlanmasını öneriyor. Ayrıca, belirlenen amaç ve sınırlamalar dışında hareket etmeyi önlemeye yönelik teknik koruyucu mekanizmaların, şeffaflık yaklaşımlarını tamamlayıcı bir rol üstlenebileceği değerlendirilmektedir.¹

## 5. Kontrol Kaybı ve İnsan Gözetimi {#insan-gozetimi}

Otonomi düzeyinin yüksek olduğu Etken YZ sistemlerinde, bireylerin kendi verileri üzerindeki kontrol beklentileriyle sistemin işleyişi arasında gerilim oluşabiliyor.

KVKK raporu bu konuda net bir uyarıda bulunuyor: hedef ve eylem alanlarının yeterince açık ve net biçimde belirlenmediği durumlarda, beklenmeyen veya istenmeyen sonuçların ortaya çıkma olasılığı artıyor. YZ aracıları kısa sürede çok sayıda eylem gerçekleştirebildiğinden, insan gözetiminin sınırlı kaldığı senaryolarda hataların kümülatif etkisi büyüyebiliyor.¹

Rapor, insan gözetiminin üç aşamada ele alınmasını öneriyor: geliştirme aşamasında sistemin erişebileceği veri türlerinin ve verilebilecek kararların tanımlanması; kullanıma alma aşamasında yüksek riskli süreçler için ilave insan incelemesi mekanizmaları; kullanım sonrasında ise sistemin davranışlarının izlenmesine yönelik geri bildirim ve değerlendirme mekanizmaları.¹

## KVKK Ne Öneriyor? {#kvkk-onerileri}

Rapor, Etken YZ sistemlerinde kişisel verilerin korunması için dikkate alınabilecek başlıca hususları şöyle sıralıyor:

**Aktör rollerinin netleştirilmesi:** Geliştiriciler, yerleştiriciler (*deployers*) ve diğer aktörler arasında görev, yetki ve sorumlulukların açıkça tanımlanması.¹

***Privacy by design* ve *privacy by default* yaklaşımları:** Veri koruma ilkelerinin sistem tasarımına en baştan entegre edilmesi. EDPS'in tanımıyla, *privacy by design* veri işleme faaliyetleri ve bilgi sistemlerinin tasarımına mahremiyetin gömülmesini; *privacy by default* ise kullanıcı müdahalesi olmaksızın yalnızca gerekli verilerin işlenmesinin sağlanmasını ifade ediyor.²·³

**Mahremiyet artırıcı teknolojiler (PETs):** Kişisel verilerin gereksiz işlenmesini önlerken veriden faydalı sonuç elde etmeyi mümkün kılan teknik çözümler bütünü. EDPS, PETs'i "kişisel verileri ortadan kaldırarak veya azaltarak ya da gereksiz veri işlemeyi önleyerek mahremiyeti koruyan, uyumlu bir bilgi ve iletişim teknolojisi önlemleri sistemi" olarak tanımlıyor.⁴ Diferansiyel mahremiyet, federatif öğrenme, homomorfik şifreleme bu kategorideki somut teknikler arasında yer alıyor.

**Risk değerlendirme mekanizmaları:** Sistemlerin yaşam döngüsü boyunca ortaya çıkabilecek risklerin sistematik biçimde ele alınması ve uygun olduğu durumlarda veri koruma etki değerlendirmesi yapılması.¹

**Yönetişim ve eğitim:** Mevcut veri koruma mekanizmalarının Etken YZ'nin yapısal özelliklerine göre gözden geçirilmesi ve sistemlerin kullanımında rol alan kişilere yönelik bilinçlendirme faaliyetlerinin yürütülmesi.¹

## Ne Anlama Geliyor? {#sonuc}

KVKK'nın Agentic AI raporu, etken yapay zekânın mevcut veri koruma çerçevesini "kırmadığını" ancak ciddi biçimde zorladığını ortaya koyuyor. Temel ilkeler geçerliliğini koruyor; fakat amaçla sınırlılıktan veri minimizasyonuna, şeffaflıktan hukuki dayanağa kadar her ilkenin uygulanma biçimi, bu sistemlerin dinamik ve otonom yapısına göre yeniden düşünülmeyi gerektiriyor.

Rapor aynı zamanda, teknik, hukuki ve uygulamaya ilişkin yaklaşımların alandaki gelişmeler doğrultusunda değişiklik gösterebileceğini vurguluyor. Bu, hem düzenleyiciler hem de etken yapay zekâ sistemleri geliştiren veya kullanan kuruluşlar için sürekli bir uyum ve izleme sürecinin kaçınılmaz olduğuna işaret ediyor.

Kuruluşunuzun yapay zekâ uygulamalarının risk düzeyini değerlendirmek isterseniz, [Hexis Risk Classifier](https://hexis.center/generator/) aracını kullanabilirsiniz.

## Sıkça Sorulan Sorular {#sss}

**Etken yapay zekâ (Agentic AI) nedir?**

Etken yapay zekâ, hedef yönelimli çalışan, çok adımlı görevleri planlayıp yürüten ve süreç boyunca otonom kararlar alabilen YZ sistemlerini ifade eder. Geleneksel YZ'den farkı, otonomi düzeyinin ve çevreyle etkileşimin belirgin biçimde artmış olmasıdır.

**KVKK Agentic AI raporu ne zaman yayımlandı?**

KVKK, Etken Yapay Zekâ (Agentic AI) raporunu 12 Mart 2026 tarihinde yayımladı. Raporun tam metnine [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/8683/etken-yapay-zeka-agentic-ai) üzerinden erişilebilir.

**Agentic AI kişisel verileri nasıl etkiliyor?**

Etken yapay zekâ sistemleri, otonom karar alma ve çok adımlı veri işleme yapıları nedeniyle amaçla sınırlılık, veri minimizasyonu, hukuki dayanak, şeffaflık ve insan gözetimi ilkelerini zorluyor. Sistemler görev sürecinde başlangıçta öngörülmeyen verilere erişebiliyor ve bu durum mevcut veri koruma çerçevesini test ediyor.

**Privacy by design etken yapay zekâda nasıl uygulanır?**

KVKK raporu, *privacy by design* (tasarımdan itibaren mahremiyet) ve *privacy by default* (varsayılan olarak mahremiyet) yaklaşımlarının sistem tasarımına en baştan entegre edilmesini öneriyor. Buna ek olarak, diferansiyel mahremiyet ve homomorfik şifreleme gibi mahremiyet artırıcı teknolojilerin (PETs) kullanımını tavsiye ediyor.

---

## Kaynaklar

1. Kişisel Verileri Koruma Kurumu (KVKK). *Etken Yapay Zekâ (Agentic AI)*. 12 Mart 2026. [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/8683/etken-yapay-zeka-agentic-ai)

2. European Data Protection Supervisor (EDPS). *Privacy by Design*. [edps.europa.eu](https://www.edps.europa.eu/data-protection/our-work/subjects/privacy-design_en)

3. European Data Protection Supervisor (EDPS). *Privacy by Default*. [edps.europa.eu](https://www.edps.europa.eu/data-protection/our-work/subjects/privacy-default_en)

4. European Data Protection Supervisor (EDPS). *Glossary: Privacy Enhancing Technologies*. [edps.europa.eu](https://www.edps.europa.eu/data-protection/data-protection/glossary/p_en)

5. Centre for Information Policy Leadership (CIPL). *Agentic AI: Fostering Responsible and Beneficial Development and Adoption*. Ekim 2025. [informationpolicycentre.com](https://www.informationpolicycentre.com/uploads/5/7/1/0/57104281/cipl_agentic_ai_fostering_responsible_development_adoption_oct25.pdf)
