---
title: "ChatGPT'ye Müşteri Bilgisi Girenler: Bu KVKK Yükümlülüğünden Haberiniz Var mı?"
description: "ChatGPT'ye müşteri veya çalışan bilgisi giren her şirket KVKK'nın yurt dışı aktarım yükümlülüğüyle karşı karşıya. Durumunuzu ve yapmanız gerekenleri anlatan pratik rehber."
date: "2026-03-15"
category: "KVKK"
orient_stage: "Risk"
slug: "chatgpt-kvkk-yurt-disi-aktarim"
reading_time: "6 dakika"
---

## Bir senaryo: Sıradan bir Salı sabahı

Müşteri hizmetleri sorumlusunuz. Zor bir müşteri şikayeti var; cevabı nasıl yazacağınızı bilmiyorsunuz. ChatGPT'yi açıyorsunuz, müşterinin adını, sorununu ve biraz şirket bilgisini giriyorsunuz. Birkaç saniyede güzel bir taslak çıkıyor. Gönderiyorsunuz.

Bu işlemi yüzlerce Türk şirketinde her gün binlerce çalışan yapıyor.

Peki bu işlemin arka planında ne oluyor? Girdiğiniz o veri; müşterinin adı, sorunu, sizin şirket bilgileriniz; OpenAI'ın ABD'deki sunucularına gidiyor. KVKK buna "kişisel verilerin yurt dışına aktarılması" diyor. Ve bunun için bir mekanizma kurmanız gerekiyor.

---

## KVKK Madde 9 ne diyor?

6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 9. maddesi, 1 Haziran 2024 tarihinde köklü bir değişikliğe uğradı.¹ Yeni düzenlemeyle kişisel verilerin yurt dışına aktarılması üç koşuldan biriyle mümkün:

**Birincisi yeterlilik kararı.** KVKK'nın verinin gideceği ülkeyi "yeterli korumalı" ilan etmiş olması. ABD için henüz böyle bir karar yok.

**İkincisi uygun güvence.** En yaygın yol standart sözleşme. KVKK'nın yayımladığı dört standart sözleşme şablonundan ilgili olanı, şirketiniz ile yurt dışındaki veri alıcısı arasında imzalanıyor. İmzalandıktan sonra 5 iş günü içinde KVKK'ya bildirim zorunlu.²

**Üçüncüsü istisnai haller.** Sınırlı sayıda durum; ilgili kişinin açık rızası, sözleşmenin ifası için zorunluluk gibi. Rutin iş süreçleri için bu yol güvenilir değil.

Çoğu Türk KOBİ'si için uygulanabilir yol standart sözleşme. Ama bu sözleşmeyi ChatGPT ile imzalamak kolay değil. Neden? Çünkü OpenAI, bireysel veya küçük ölçekli kullanıcılara veri işleme sözleşmesi (DPA) sunmuyor. Bu, doğrudan kurumsal lisanslara (ChatGPT Enterprise veya Team) geçmeyi ya da kullanım politikasını yeniden değerlendirmeyi gerektiriyor.

---

## "Ama ben sadece kullanıcıyım, geliştiren OpenAI değil mi?"

Bu, en sık duyduğumuz soru. Cevap: hayır, yalnızca OpenAI sorumlu değil.

6698 sayılı Kanun'un 3. maddesi veri sorumlusunu "kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen kişi" olarak tanımlıyor. ChatGPT'ye hangi veriyi hangi amaçla girdiğinizi siz belirliyorsunuz; bu, veri sorumlusu tanımının kapsamına giriyorsunuz demektir. KVKK'nın Kasım 2025 tarihli Üretken YZ Rehberi de bu ilişkiyi üretken YZ sistemleri bağlamında ayrıca ele alıyor.³

OpenAI ayrıca sorumlu olabilir, ama bu sizin sorumluluğunuzu ortadan kaldırmıyor.

---

## Pratikte ne yapmalısınız?

Bu durumu yönetmek için üç somut adım var.

**Adım 1: YZ araç envanterinizi çıkarın.**

Şirketinizde hangi yapay zekâ araçları kullanılıyor? Hangi departmanlar, hangi amaçlarla? Bu araçlara ne tür veriler giriliyor? Müşteri adı, çalışan bilgisi, sözleşme detayı, toplantı notu... Bunların hepsi kişisel veri kapsamına girebilir.

Çoğu şirkette bu envanter yok. Başlangıç noktası burası.

**Adım 2: Hangi mekanizmanın uygulanabileceğini değerlendirin.**

Kullandığınız her araç için şu soruyu sorun: Bu araç sağlayıcısıyla standart sözleşme imzalayabilir miyim?

ChatGPT için; bireysel veya küçük ölçekli kullanımda OpenAI ile veri işleme sözleşmesi imzalamak mümkün değil. ChatGPT Enterprise veya Team lisanslarında OpenAI bir Veri İşleme Anlaşması (*Data Processing Agreement*) sunuyor; bu anlaşma, standart sözleşmenin yerini tutup tutmadığı ayrıca değerlendirilmeli. Alternatif olarak, kişisel veri içermeyen kullanımlarla sınırlı bir politika belirlenebilir.

Claude veya diğer API tabanlı araçlar için; kurumsal sözleşmeler genellikle veri işleme şartları içeriyor, ama bunların KVKK'nın standart sözleşme gereklilikleriyle uyumlu olup olmadığı incelenmeli.

**Adım 3: Standart sözleşme imzaladıysanız bildirin.**

Standart sözleşme imzalandıktan sonra 5 iş günü içinde KVKK'ya bildirim zorunlu. KVKK'nın sitesinde "Standart Sözleşme Bildirim Modülü" üzerinden online yapılabiliyor. Bu yükümlülüğü yerine getirmeyenler için 2026 yılı itibarıyla 90.308 TL ile 1.806.377 TL arasında idari para cezası öngörülüyor.²

---

## Peki ya yasaklamak?

Bir seçenek olarak "çalışanlar yapay zekâ kullanmasın" diyebilirsiniz. KVKK'nın Mart 2026 tarihli iş yeri rehberi bu yaklaşıma açıkça karşı çıkıyor.⁴

Yasaklayıcı yaklaşımlar uygulamada gerçekçi sonuç vermiyor; çalışanlar araçları kurum dışı hesaplarla kullanmaya devam ediyor ve bu da "Gölge YZ" sorununu doğuruyor. Gölge YZ, şirketin hiç gözetim yapamadığı, tamamen kontrolsüz bir kullanım; risk açısından çok daha tehlikeli.

Çözüm yasaklamak değil, yönetmek. Hangi araçlar hangi koşullarda kullanılabilir, bunu politikayla netleştirmek.

---

## Nereden başlamalısınız?

Dürüst olmak gerekirse, bu meseleyi tamamen çözmek; doğru sözleşme mekanizmasını kurmak, aydınlatma metinlerini güncellemek, politikayı hazırlamak, çalışanları eğitmek, bir danışman ve zaman gerektiriyor.

Ama başlangıç noktası basit: **Şirketinizde hangi yapay zekâ araçları kullanılıyor ve bu araçlara hangi veriler giriliyor?**

Bu soruyu yanıtladığınızda riskin büyüklüğünü görebilirsiniz. Hexis'in [KVKK Uyum Checklist](https://hexis.center/checklist/) aracı bu envanteri çıkarmanıza ve öncelikli adımları belirlemenize yardımcı olmak için beş KVKK belgesi temelinde güncelleniyor.

---

## Kaynaklar

1. Kişisel Verileri Koruma Kurumu. *Yurt Dışına Aktarım*. KVKK Madde 9 ve 1 Haziran 2024 değişiklikleri. [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/2053/Yurtdisina-Aktarim)

2. Kişisel Verileri Koruma Kurumu. *Standart Sözleşmeler*. Kurul kararı 2024/959, 4 Haziran 2024. [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/7929/Standart-Sozlesmeler)

3. Kişisel Verileri Koruma Kurumu. *Üretken Yapay Zekâ ve Kişisel Verilerin Korunması Rehberi (15 Soruda)*. KVKK Yayınları No. 113, Kasım 2025. [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/8547/uretken-yapay-zeka-ve-kisisel-verilerin-korunmasi-rehberi-15-soruda)

4. Kişisel Verileri Koruma Kurumu. *İş Yerlerinde Üretken Yapay Zekâ Araçlarının Kullanımı*. Mart 2026. [kvkk.gov.tr](https://www.kvkk.gov.tr/Icerik/8674/is-yerlerinde-uretken-yapay-zeka-araclarinin-kullanimi)
