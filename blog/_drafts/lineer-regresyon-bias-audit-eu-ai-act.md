---
title: "Lineer Regresyonla Bias Audit: EU AI Act Madde 10 İçin Pratik Bir Yöntem"
description: "Kredi skorlama modelinde cinsiyet ve yaş önyargısını lineer regresyon katsayılarıyla tespit etme. EU AI Act Madde 10 uyumu için veri odaklı bir yaklaşım."
date: "2026-04-11"
category: "EU AI Act"
orient_stage: "Evaluate"
slug: "lineer-regresyon-bias-audit-eu-ai-act"
reading_time: "8 dakika"
---

## Sorun: "Bias'ı Kontrol Et" Diyor Ama Nasıl?

EU AI Act Madde 10(2)(f) açık: yüksek riskli AI sistemlerinin eğitim verileri, olası önyargılar açısından incelenmeli.¹ Peki pratikte bu inceleme nasıl yapılır?

Regülasyon "bias'ı tespit edin ve azaltın" diyor ama somut bir yöntem tarif etmiyor. Bu yazıda lineer regresyonu bir bias audit aracı olarak kullanarak; gerçek veri üzerinde, çalıştırılabilir koda dönüştürüp yorumladık.

Proje, EU AI Act kapsamında Ek III'te yüksek riskli olarak sınıflandırılan bir alanı hedefliyor: kredi skoru değerlendirmesi (*creditworthiness assessment*).² Kullandığımız veri seti German Credit Dataset (UCI), 1000 kredi başvurusunu 20 özellikle tanımlıyor.

## Neden Lineer Regresyon?

Bias tespiti için neden karmaşık bir model değil de lineer regresyon? 

Lineer regresyonda, katsayılar doğrudan yorumlanabilir. `is_female = -0.05` demek "kadın olmak, diğer her değişken sabitken, kredi onay olasılığını 0.05 puan düşürüyor" demek. Bu netliği bir *random forest* ya da *neural network* ile elde edemezsiniz.

Ayrıca, EU AI Act Madde 13 yüksek riskli sistemlerde şeffaflık ve açıklanabilirlik kanıtı istiyor.³ Lineer model, karar mekanizmasını doğrudan açıklar; bu da regülatör beklentisiyle örtüşür.

Bir diğer neden, istatistiksel anlamlılık testi (p-değeri) doğrudan uygulanabilir. Bir katsayının "tesadüf mü, sistematik mi?" sorusuna net cevap verir.

## Yöntem: İki Aşamalı Bias Analizi

Analiz iki aşamadan oluşuyor: 
(1) regresyon katsayıları ile bireysel düzeyde bias tespiti, 
(2) *Disparate Impact* oranı ile grup düzeyinde etki ölçümü.

### Korunan Özellikler

Veri setinde iki korunan özellik (*protected attribute*) tanımlandı:

- **is_female:** Cinsiyet (kadın = 1, erkek = 0)
- **age / is_young:** Yaş (25 altı = 1, diğer = 0)

Bu özellikler hem EU AI Act hem de Türk hukuku (Anayasa md. 10, İş Kanunu md. 5) kapsamında ayrımcılığa yol açmaması gereken değişkenler.

### Veri Hazırlığı

Sayısal özellikler (kredi miktarı, süre, taksit oranı, mevcut kredi sayısı vb.) *StandardScaler* ile ölçeklendirildi. Bu adım kritik: ölçeklendirme olmadan katsayılar karşılaştırılamaz, çünkü farklı birimlerdeler (ay vs. euro vs. oran).

Veri seti %80 eğitim, %20 test olarak ayrıldı ve hedef değişken dengesi korundu (*stratified split*).

## Bulgular

### 1. Katsayı Analizi

OLS regresyon sonuçları şunu gösterdi:

- **is_female katsayısı: negatif ve istatistiksel olarak anlamlı (p < 0.05)**. Model, cinsiyet bilgisini kredi kararında sistematik olarak kullanıyor ve kadınlar tarafından yapılan başvuranlara dezavantajlı.
- **age katsayısı: pozitif**. Yaş arttıkça model kredi onaylama eğiliminde; genç başvuranlar dezavantajlı.

Bu bulgu tek başına bir EU AI Act Madde 10(2)(f) uyumsuzluk sinyali: eğitim verisi, korunan bir özellik üzerinden sistematik önyargı taşıyor ve model bunu öğrenmiş.

### 2. Model Karşılaştırması: Fairness'in Maliyeti

İki model karşılaştırdık:

- **Model A:** Tüm özellikler dahil (korunan özellikler de var)
- **Model B:** Korunan özellikler çıkarılmış (*fairness-aware*)

Sonuç: iki model arasında yalnızca **%1 accuracy farkı** var. Bu çok önemli bir bulgu: cinsiyeti modelden çıkardığınızda neredeyse hiçbir performans kaybetmiyorsunuz. Korunan özellikleri modelde tutmak için geçerli bir iş gerekçesi yok.

### 3. Disparate Impact Analizi: Tek Metrik Yetmez

*Disparate Impact* (DI) oranı, ABD EEOC tarafından kullanılan 80% kuralına (*Four-Fifths Rule*) dayanır: dezavantajlı grubun seçilme oranı avantajlı grubun %80'inden azsa orantısız etki var demektir.

| Grup | Model A | Model B (fair) |
|------|---------|----------------|
| Cinsiyet (K/E) | 0.951 | 1.025 |
| Yaş (genç/diğer) | 0.804 | 0.974 |

İşte projenin en kritik bulgusu: **cinsiyet için DI oranı 0.951, yani 80% eşiğinin üstünde**. Sadece DI testine bakıldığında, sorun tespit edilemzken, regresyon katsayısı ve p-değeri bize farklı bir hikaye anlatıyor: model cinsiyeti sistematik olarak kullanıyor.

Yaş için durum daha net: Model A'da DI = 0.804, eşiğe çok yakın. Model B'de 0.974'e çıkıyor; korunan özellikleri çıkarmak yaş bias'ını neredeyse tamamen ortadan kaldırıyor.

Bu, bias audit'te çoklu yöntem kullanmanın neden zorunlu olduğunu gösteriyor. Tek bir fairness metriğine güvenmek, gizli bias'ı kaçırmanıza neden olabilir.

## EU AI Act Perspektifi

Bu analiz, ORIENT framework'ünün **Evaluate** aşamasına tekabül ediyor: "Mevcut sistemde uyum açıkları nerede?"

Bulgulardan çıkan governance aksiyonları:

**Madde 10(2)(f):** Eğitim verisinde cinsiyet bazında sistematik önyargı tespit edildi. İnceleme yükümlülüğü karşılanmadı.¹

**Madde 10(2)(g):** Korunan özelliklerin modelden çıkarılması uygulanabilir bir bias azaltma stratejisi. %1 performans kaybı kabul edilebilir sınırda.¹

**Madde 13:** Lineer regresyon katsayıları, modelin karar mekanizmasını şeffaf şekilde açıklıyor. Yüksek riskli sistemlerdeki açıklanabilirlik gereksinimini karşılıyor.³

**Ek III, madde 5(b):** Kredi değerliliği değerlendirmesi yüksek riskli AI sistemi olarak sınıflandırılmış. Bu tür sistemler 2 Ağustos 2026 itibarıyla tüm yükümlülüklere tabi.²

## Projeyi Deneyin

Bu analizin tamamını çalıştırılabilir bir Jupyter Notebook olarak hazırladık. Google Colab üzerinde açıp hücre hücre çalıştırabilirsiniz. Notebook, veri yükleme, keşifsel analiz, model kurma, istatistiksel test ve görselleştirme adımlarını Türkçe açıklamalarla içeriyor.

Notebook'a GitHub üzerinden erişebilirsiniz: [Bias Audit with Linear Regression](https://github.com/cosozden/hexis.center/blob/main/bias_audit_linear_regression.ipynb)

## Sonuç

Bias tespiti karmaşık yöntemler gerektirmek zorunda değil. Lineer regresyon gibi temel bir araç bile, doğru şekilde kullanıldığında güçlü cevaplar verebiliyor. Asıl mesele hangi algoritmayı kullandığınız değil, doğru soruları sorup sormadığınız.

Eğer yüksek riskli bir AI sistemi geliştiriyorsanız veya kullanıyorsanız, şu üç soruyla başlayın:

- Korunan özellikler model kararlarını etkiliyor mu?
- Bu etki istatistiksel olarak anlamlı mı?
- Tek bir fairness metriğine mi güveniyorsunuz, yoksa çoklu yöntem mi kullanıyorsunuz?

Bu soruları cevaplamak, EU AI Act Madde 10 uyumunun ilk adımı. Hexis [Risk Classifier](https://hexis.center/generator/) aracıyla sisteminizin risk seviyesini belirleyebilir, ardından bu tür teknik analizlerle uyum açıklarınızı değerlendirebilirsiniz.

---

## Kaynaklar

1. Avrupa Parlamentosu ve Konseyi. *Regulation (EU) 2024/1689, Article 10 — Data and Data Governance*. EUR-Lex, 12 Temmuz 2024. [artificialintelligenceact.eu/article/10](https://artificialintelligenceact.eu/article/10/)

2. Avrupa Parlamentosu ve Konseyi. *Regulation (EU) 2024/1689, Annex III — High-Risk AI Systems*. EUR-Lex, 12 Temmuz 2024. [artificialintelligenceact.eu/annex/3](https://artificialintelligenceact.eu/annex/3/)

3. Avrupa Parlamentosu ve Konseyi. *Regulation (EU) 2024/1689, Article 13 — Transparency and Provision of Information to Deployers*. EUR-Lex, 12 Temmuz 2024. [artificialintelligenceact.eu/article/13](https://artificialintelligenceact.eu/article/13/)
