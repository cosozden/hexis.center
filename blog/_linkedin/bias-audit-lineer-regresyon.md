# LinkedIn Post — Bias Audit with Linear Regression
**Sütun:** 3 (Sektör Örnekleri & Vaka Analizleri)
**ORIENT Adımı:** Evaluate
**Format:** Text-only
**Tarih:** 2026-04-11

---

EU AI Act "bias'ı kontrol edin" diyor.

Peki nasıl?

Çoğu şirket bu soruya cevap vermekte zorlanıyor. Regülasyon yükümlülüğü açık (Madde 10), ama somut yöntemi tarif etmiyor.

Bu projede, German Credit Dataset üzerinde lineer regresyon ile kredi skorlama modelinde bias audit yaptık.

Sonuçlar dikkat çekici:

→ Cinsiyet katsayısı negatif ve istatistiksel olarak anlamlı (p < 0.05). Model, kadın başvuranları sistematik olarak dezavantajlı kılıyor.

→ Ama Disparate Impact oranı 0.951; yani 80% kuralına göre "sorun yok".

→ Cinsiyeti modelden çıkarınca accuracy kaybı sadece %1.

Asıl değerli bulgu şu: tek bir fairness metriğine güvensek, bu bias'ı hiç fark edemezdik.

DI testi "temiz" çıkmışken, regresyon katsayısı sistematik ayrımcılığı ortaya koydu. İkisi aynı anda doğru olabiliyor; çünkü bireysel düzeydeki bias, grup ortalamasında dengelenebiliyor.

Bu neden önemli?

Kredi skorlama EU AI Act Ek III kapsamında yüksek riskli. 2 Ağustos 2026'dan itibaren tüm yükümlülükler devrede. "Bias'ı inceledik" demek yetmez; nasıl incelediğiniz ve hangi yöntemleri kullandığınız da önemli.

Çoklu yöntemlerle audit yapmak en güvenli ve doğru yol. 
Katsayı analizi + disparate impact + grup bazlı karşılaştırma. 
Tek metrik yanıltıcı olabiliyor.

Projenin tamamını (veri, kod, analiz) açık kaynak Jupyter Notebook olarak yayınladık:

🇹🇷 Türkçe: hexis.center/blog/lineer-regresyon-bias-audit-eu-ai-act
🇬🇧 English: hexis.center/blog/linear-regression-bias-audit-eu-ai-act

Sizin şirketinizde AI sistemlerinin bias kontrolü nasıl yapılıyor? Yorumlarda konuşalım.

#AIYönetişimi #AIAct #BiasAudit #Hexis #MachineLearning #FairnessInAI
