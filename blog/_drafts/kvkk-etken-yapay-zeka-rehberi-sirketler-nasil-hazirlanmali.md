---
title: "KVKK Etken Yapay Zekâ Rehberini Yayımladı: Şirketler Nasıl Hazırlanmalı?"
description: "KVKK'nın Şubat 2026 Etken YZ rehberi: amaçla sınırlılık kayması, sorumluluk boşluğu ve kara kutu riski. ORIENT çerçevesiyle şirketler için pratik adımlar."
date: "2026-03-18"
category: "KVKK"
orient_stage: "Risk"
slug: "kvkk-etken-yapay-zeka-rehberi-sirketler-nasil-hazirlanmali"
reading_time: "5 dakika"
---

## KVKK ve Etken Yapay Zekâ: Soru Soruldu, Cevap Şirkete Bırakıldı

KVKK, Şubat 2026'da "Etken Yapay Zekâ" başlıklı 46 sayfalık bir çalışma yayımladı.¹ Etken YZ sistemlerini kişisel verilerin korunması perspektifinden bu derinlikte ele alan bir analiz Türkiye'de ilk kez resmi olarak yayımlanıyor. Rehber, riskleri net biçimde ortaya koyuyor. Ancak bir soru yanıtsız kalıyor: Şirketler pratik olarak ne yapmalı?

Bu yazıda rehberin öne çıkardığı üç kritik KVKK riskini özetleyeceğiz, ardından ORIENT çerçevesiyle somut adımlara geçeceğiz.

## Etken YZ Nedir? (30 Saniyelik Özet)

*Agentic AI*, belirli bir hedef doğrultusunda birden fazla *YZ aracısının* (*AI Agent*) koordineli çalıştığı, değişen koşullara uyum sağlayan ve insan müdahalesi olmaksızın eylem dizileri yürütebilen sistemlerdir. KVKK rehberinin kullandığı analoji yerinde: Etken YZ sistemi bir restoranın baş şefi gibidir; *YZ aracıları* ise farklı görevlerde uzmanlaşmış aşçılardır.¹

Geleneksel bir *chatbot* sorulara yanıt verir. Etken YZ sistemi ise hedef alır, görevleri planlar, farklı araçları çağırır ve koşullar değişirse planı günceller. Bu fark, kişisel veri işleme boyutunda tamamen yeni riskler doğuruyor.

## KVKK'nın Tespit Ettiği 3 Kritik Risk

Rehber, geniş bir risk haritası sunuyor. Ancak KVKK perspektifinden üç risk özellikle öne çıkıyor.

**1. Amaçla sınırlılık kayması**

Etken YZ sistemleri, görev ilerledikçe başlangıçta öngörülmeyen veri kümelerine erişebilir. Bir hukuki araştırma sistemini düşünün: önce ilgili davaları araştırır, ardından ilgili kişilerin kamuya açık sosyal medya paylaşımlarına yönelir, ardından haber arşivlerinden çapraz referans alır. Her adım tek başına masum görünür. Ancak sistem genelinde bakıldığında, başlangıçta tanımlanan işleme amacının ve hukuki sebebin çok ötesine geçilmiş olabilir.¹

KVKK bunu doğrudan tespit ediyor: "veri işleme faaliyetlerinin hangi işleme şartına (hukuki sebebe) dayandığına ilişkin değerlendirmeleri de doğrudan etkileyebilmektedir."

**2. Sorumluluk boşluğu**

*Çoklu YZ aracısı* (*multi-agent*) yapılarında hangi aşamada hangi kararın alındığını izlemek güçleşiyor. Bir veri ihlali yaşandığında sorumluluk kimin? Sistemin teknik tasarımcısının mı? Sistemi işleten *yerleştiricinin* (*deployer*) mi? Üçüncü taraf bir *YZ aracısı* sağlayıcısının mı? Rehber bu soruyu soruyor, ama yanıtı şirketlere bırakıyor: rollerin önceden yazılı biçimde tanımlanması gerekiyor.¹

**3. Kara kutu ve veri doğruluğu**

*Multi-agent* yapılarında karar zincirleri dağıtık bir yapı kazanıyor. Hangi *YZ aracısı* hangi kararı verdi, hangi veri bu kararı tetikledi? Bu soruların yanıtını açık biçimde ortaya koymak her zaman mümkün olmayabiliyor. Buna ek olarak büyük dil modellerinin "halüsinasyon" üretmesi, hatalı değerlendirmelerin sistem içinde yayılarak kişisel veri doğruluğunu bozmasına yol açabiliyor.¹

## Rehber Ne Söylemedi?

KVKK riskleri eksiksiz tanımladı. Peki şirket olarak ne yapılmalı?

Rehberin 6. bölümü ("Dikkate Alınabilecek Hususlar") yön gösterici olmakla birlikte, şirkete özgü bir eylem planı sunmuyor. "İnsan gözetimini tanımlayın", "*privacy by design* (tasarımdan itibaren mahremiyet) uygulayın", "rolleri netleştirin" gibi öneriler doğru; ancak nereden başlayacağını bilmeyen bir şirket için yeterince somut değil.

Bu, rehberin bir eksikliği değil; doğası gereği böyle. Bir regülatör genel çerçeve çizer. Operasyonel uyum ise şirkete özgü bir iştir.

## ORIENT Çerçevesiyle Pratik Adımlar

ORIENT metodolojisini kullanarak bu rehberi eyleme dönüştürelim.

**Observe:** Kullandığınız veya değerlendirdiğiniz tüm *agentic AI* sistemlerini envantere alın. Kaç *YZ aracısı* var? Hangi dış sistemlere ve veri kaynaklarına bağlanıyor? Bu soruları yanıtlamadan risk değerlendirmesi yapamazsınız.

**Risk:** Sistemin otonomi düzeyini değerlendirin. Tamamen otonom mu, yoksa insan onayı gerektiren adımlar var mı? Kişisel veri işleniyor mu? Özel nitelikli veri (sağlık, finans, biyometrik) akışı var mı? "Otonomi düzeyi × veri duyarlılığı" formülü risk profilinizi belirler.

**Identify:** KVKK'nın tespit ettiği üç kritik risk için yükümlülükleri haritalandırın. Her görev akışı için işleme şartını belirleyin. Geliştirici, *deployer* ve diğer aktörlerin sorumlulukları yazılı mı? KVKK Madde 10 kapsamında aydınlatma yükümlülüğünüzü *agentic AI* özelinde nasıl yerine getireceksiniz?²

**Evaluate:** *Privacy by design* boşluklarını değerlendirin. Sistem tasarım aşamasında veri minimizasyonu gözetildi mi? İnsan gözetimi hangi koşullarda ve hangi aşamada devreye giriyor; bu kriterler belgelenmiş mi? Hatalı *YZ aracısı* çıktılarının sistem içinde yayılmasını önleyecek bir kontrol mekanizması var mı?

**Navigate:** İnsan gözetim noktalarını tanımlayın ve belgeleyin. *YZ aracısı* ekosisteminiz için rol ve sorumluluk matrisini oluşturun. *Privacy by default* (*varsayılan olarak mahremiyet*) yaklaşımını işleyişe entegre edin.

**Track:** Sistemi periyodik olarak gözden geçirin. KVKK rehberi açıkça belirtiyor: "alandaki gelişmeler doğrultusunda değişiklik gösterebileceği" göz önünde bulundurulmalıdır.¹ Bu hem teknik hem hukuki izlemeyi kapsıyor.

## Başlamak İçin Tek Bir Soru

Şu an kullandığınız veya değerlendirdiğiniz bir *agentic AI* sistemi varsa, kendinize şunu sorun: "Bu sistem kaç farklı veri kaynağına bağlanıyor ve her biri için ayrı bir işleme şartımız var mı?"

Cevabınız net değilse, [uyum değerlendirmesine](https://hexis.center/generator/) buradan başlayabilirsiniz.

---

## Kaynaklar

1. Kişisel Verileri Koruma Kurumu. *Etken Yapay Zekâ (Agentic AI)*. KVKK, Şubat 2026. [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/8683/etken-yapay-zeka-agentic-ai)

2. Kişisel Verileri Koruma Kurumu. *6698 Sayılı Kişisel Verilerin Korunması Kanunu, Madde 10: Veri Sorumlusunun Aydınlatma Yükümlülüğü*. [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/6649/6698-SAYILI-KANUN)
