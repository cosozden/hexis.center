# Hexis Türkçe Üslup Rehberi

> Bu dosya, hexis.center'da yayımlanan her Türkçe metin için bağlayıcıdır.
> `CLAUDE.md` buraya bağlanır. Yayın öncesi `python3 tools/uslup-kontrol.py <dosya>` çalıştırılır.

**Sürüm:** v1.0 · 3 Ağustos 2026
**Kaynak:** Özden'in kendi yazdığı örnek paragraf ve tercih ettiği yazarlar (Zülfü Livaneli, Ayşe Kulin)

---

## 1. Temel teşhis: sorun resmiyet değil, ritim

Yapay zekâ tarafından üretilen Türkçe metinlerde birebir çeviri hissi, çoğunlukla kelime seçiminden değil **nefes alma biçiminden** doğar.

İngilizce düşünsel düzyazı kısa, vuruşlu cümlelerle ilerler. Akış cümlenin *içinde* virgül ve ilgi zamiriyle kurulur. Türkçe düşünsel düzyazı ise akar; cümleler noktayla kesilmez, noktalı virgülle ve bağlaçla bağlanır, okuyucu taşınır.

Ölçüm bunu doğruluyor. Düzeltme öncesi bir yazıda:

| Ölçüt | Önce | Sonra | Hedef |
|-------|------|-------|-------|
| Bağlaç dokusu (cümle başına) | 0.00 | 0.22 | ≥ 0.10 |
| Ortalama cümle uzunluğu | 11.2 kelime | 14.5 kelime | ≥ 14 |
| Cümle içi tire | 29 | 0 | 0 |
| "Bu" ile başlayan cümle | %9 | %2 | ≤ %6 |

Dikkat: `-dır` oranı düzeltme sonrasında **arttı** (%23 → %47). Resmiyet sorun değildir. Sorun, resmî cümlelerin birbirine tutunmamasıdır.

---

## 2. Bağlayıcı kurallar

| Kural | Ayrıntı |
|-------|---------|
| **Cümle içi tire yok** | `—` (em dash) ve ` - ` cümlenin içinde kullanılmaz. Yerine virgül, noktalı virgül, parantez veya iki ayrı cümle. Tablodaki `1-3`, `2025-2029` gibi sayı aralıkları veridir, serbesttir; akan metinde "1 ila 3 yıl" yazılır. |
| **Uydurma kelime yok** | `çıkarsamak` Türkçe değildir. `çıkarım yapmak`, `sonucuna varmak` veya isim hâliyle `çıkarım` (örn. `duygu çıkarımı`) kullanılır. Bir kelimenin standart olup olmadığından emin değilseniz sade olanı seçin. |
| **Kanun adı Türkçe** | Akan metinde **AB Yapay Zeka Yasası**. `EU AI Act` yalnızca resmî künye ve kaynakçada. `tüzük` yerine `yasa`. Madde numaraları olduğu gibi: `Madde 5(1)(f)`, `Ek III(3)`, `Gerekçe 44`. |
| **Teknik terimler İngilizce** | `deployer`, `provider`, `high-risk`, `GPAI` sayfa dili ne olursa olsun İngilizce kalır. |
| **Analiz, denetim değil** | Kurum belgesi incelenirken ağırlık merkezi, açığa çıkarılan boşluk değil açıklanan teknik ayrım olmalıdır. Kararın neye bağlı olduğu söylenir, karar veren notlandırılmaz. |

**Yayın öncesi çerçeveleme testi:** Bu metin Hexis'i o kurumun denetçisi konumuna mı koyuyor, yoksa uygulamasına destek verebilecek kişi konumuna mı? İkincisi zorunludur.

---

## 3. Bağlaç dokusu

Türkçe düşünsel metin akışını bu sözcüklerden alır. Karşıtlığı `oysa` kurar, yükseltmeyi `üstelik` yapar, itirazı `ne var ki` taşır.

**Karşıtlık:** oysa · ne var ki · hâlbuki · buna karşılık · bununla birlikte
**Yükseltme:** üstelik · dahası · kaldı ki · hatta
**Onaylama:** elbette · nitekim · zaten · gerçekten de
**Geçiş:** bu noktada · söz konusu · görüldüğü üzere · peki
**Sonuç:** dolayısıyla · demek ki · şu hâlde

Hedef: cümle başına en az 0.10 geçiş. Yani on cümlede en az bir bağlaç.

---

## 4. Önce ve sonra çiftleri

### 4.1 Karşıtlığı bağlaçla kurun, noktayla değil

> **Önce:** Yapay zekâ yasasının eğitimle ilgili yükümlülükleri 2 Aralık 2027'ye ertelendi. Bir hüküm ertelenmedi.

> **Sonra:** AB Yapay Zeka Yasası'nın eğitimle ilgili yükümlülükleri 2 Aralık 2027'ye ertelenmiş durumdadır. Oysa ertelemenin dışında kalan bir hüküm var; üstelik tam da bu yazının konusunu ilgilendiren bir hüküm.

### 4.2 İngilizce kalıplarını tanıyın

| İngilizce kalıp | Kötü çeviri | Türkçesi |
|---|---|---|
| The practical consequence of this is: | Bunun pratik sonucu şudur: | Pratikte şu demektir: |
| What was deferred was a timeline | Ertelenen şey bir takvimdi | Ertelenen bir takvimdi |
| This means that | Bu, ... anlamına gelir | Dolayısıyla ... / Demek ki ... |
| It is worth noting | Belirtmek gerekir | Belirtmekte fayda var |
| Here, a reminder is needed | Burada bir hatırlatma gerekiyor | Bu noktada bir hatırlatma yapmakta fayda var |

### 4.3 Sıkıştırmayın

> **Önce:** Tıbbi veya güvenlik amaçlı kullanımlar istisnadır.

> **Sonra:** Tıbbi ve güvenlik sebebiyle kullanımlar ise yasanın istisnai uygulamaları arasındadır.

Kısaltmak her zaman iyileştirmek değildir. Aşırı sıkıştırılmış cümle Türkçede üşengeç durur.

### 4.4 Tamamlanmış hâli anlatan yapılar

Türkçeye özgü ve az kullanılan yapılar: `-mış durumdadır`, `-makta bulunmaktadır`, `-mış bulunuyor`.

> **Önce:** Bu ayrımın hukuki karşılığı EU AI Act'te bulunuyor.

> **Sonra:** Davranış gözlemi ile duygu çıkarımı arasındaki sınırın hukuki karşılığı AB Yapay Zeka Yasası'nda çizilmiş durumdadır.

### 4.5 Noktalı virgül bağlar, nokta keser

> **Önce:** Cümlelerin hepsi gözlemdir. Doğrulanabilir ve ölçülebilir niteliktedir.

> **Sonra:** Cümlelerin hepsi gözlemdir; doğrulanabilir, ölçülebilir ve gerektiğinde itiraz edilebilir niteliktedir.

### 4.6 Paragrafı erken bölmeyin

Üç ilgili fikir tek paragrafta yaşayabilir. Her fikre ayrı paragraf vermek İngiliz gazete alışkanlığıdır ve metni parçalar.

### 4.7 "Bu" ile başlamayın

Aynı işi gören alternatifler: `Söz konusu ...` · `Bahsi geçen ...` · konuyu doğrudan adlandırın (`Tablodan çıkan sonuç ...`) · `Buraya kadar anlatılanlar ...`

---

## 5. Ölçüm

```bash
python3 tools/uslup-kontrol.py blog/yazi-adi/index.html
```

Betik yalnızca düz paragrafları ölçer; tablolar, alıntı blokları ve listeler veri sayıldığı için ölçüme girmez.

Kontrol edilenler: bağlaç dokusu, cümle içi tire, yasak kelime, ortalama cümle uzunluğu, İngilizce kalıp izleri, "Bu" ile başlayan cümle oranı.

---

## 6. Bu rehber nasıl gelişir

Her yeni yazıdan sonra, Özden'in yaptığı düzeltmeler buraya önce ve sonra çifti olarak işlenir. Kural listesi büyümez; örnek listesi büyür. Talimat değil, örnek öğretir.

---

## 7. Otomatik çalıştırma

Bu rehber ve ölçüm betiği, hatırlanmaya bağlı değildir.

```bash
bash tools/kontrol.sh            # yapısal + üslup, değişen dosyalar
bash tools/kontrol.sh a.html     # belirli dosyalar
bash tools/hook-kur.sh           # pre-commit hook kurulumu (makine başına bir kez)
```

Pre-commit hook, `tools/kontrol.sh` başarısız olursa commit'i durdurur. Git hook'ları repoda saklanmadığı için, makine değiştiğinde veya repo yeniden klonlandığında `hook-kur.sh` bir kez çalıştırılmalıdır.

Bir kontrol yanlış alarm veriyorsa, hook'u atlamak yerine betiği düzeltin. Zorunlu hâllerde `git commit --no-verify` kullanılabilir; ancak gerekçesi commit mesajında belirtilmelidir.

---

## 8. Arayüz metinleri (v1.1, 3 Ağustos 2026)

Ana sayfa metinleri Özden'in düzeltmeleriyle elden geçirildi. Çıkan kurallar:

### 8.1 Marka adı akan metinde Türkçe

`AI Governance` → **Yapay Zeka Yönetişimi**. `AI sistemi` → **yapay zeka sistemi**.
`EU AI Act`, `ISO 42001`, `KVKK`, `FRIA`, `ORIENT` özel ad olarak kalır.

### 8.2 Soyut kavram yerine somut karşılık

> **Önce:** Yapay Zeka Yönetişimi bir kontrol listesi değil, bir yönelimdir.

> **Sonra:** Yapay Zeka Yönetişimi bir kontrol listesi değil, kesintisiz bir süreçtir.

`yönelim`, İngilizce *orientation*'ın birebir karşılığıdır ama Türkçede "eğilim" çağrışımı taşır ve marka iddiasını taşımaz. Soyut adın Türkçede karşılığı yoksa somut olanı seçin.

### 8.3 Zayıf yüklemi güçlendirin

> **Önce:** ...sınıflandırmanıza, değerlendirmenize ve belgelemenize yardımcı olur.

> **Sonra:** ...sınıflandırmanızı, değerlendirmenizi ve belgelemenizi sağlar.

`yardımcı olur` özür diler gibi durur; `sağlar` iddiayı üstlenir.

### 8.4 Karma terim kullanmayın

> **Önce:** Maturity seviyesi × Risk Exposure. Focal cell (altın), organizasyonun mevcut durumunu gösterir.

> **Sonra:** Olgunluk düzeyi ile risk maruziyetinin kesişimi. Altın renkli hücre, kurumun bulunduğu noktayı gösterir.

Aynı biçimde: `PDF export` → `PDF olarak dışa aktarır`, `sectoral filter` → `sektöre göre filtrelenebilir`, `interaktif` → `etkileşimli`, `organizasyon` → `kurum`.

### 8.5 Kısa etiketlerde de akış aranır

> **Önce:** 23 maddelik interaktif kontrol. İlerleme takibi, PDF export. Risk seviyesine göre filtreli.

> **Sonra:** 23 maddelik etkileşimli kontrol listesi; ilerlemenizi izler, risk seviyesine göre filtreler, PDF olarak dışa aktarır.

Üç kesik parça yerine noktalı virgülle bağlanmış tek bir cümle.
