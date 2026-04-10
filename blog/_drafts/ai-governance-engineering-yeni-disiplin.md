---
title: "AI Governance Engineering: Yeni Bir Mühendislik Disiplininin Anatomisi"
description: "AI governance parçalanmış durumda. Bu makale AI Governance Engineering disiplinini haritalıyor ve dört katmanlı bir yetkinlik modeli öneriyor."
date: "2026-04-10"
category: "AI Governance"
orient_stage: "Observe"
slug: "ai-governance-engineering-yeni-disiplin"
reading_time: "12 dakika"
---

## Google SRE'yi Adlandırdığında, Sistem Yöneticileri Zaten Vardı

2003'te Google, yazılım sektörünü yeniden şekillendiren bir adım attı. Yeni bir teknoloji icat etmedi; bir disiplini adlandırdı.

Sistem yöneticileri onlarca yıldır sunucuları çalışır durumda tutuyordu. Operasyon ekiplerinin kendi pratikleri, araçları ve deneyimleri vardı. Ama kimse bu pratikleri tanımlı prensipleri, kariyer yolları ve ölçülebilir çıktıları olan bir mühendislik disiplini olarak bir araya getirmemişti.

Google buna *Site Reliability Engineering* (SRE) adını verdi. Temel içgörü basit ama etkili oldu: "Güvenilirlik bir operasyon sorunu değil, bir mühendislik sorunudur" dedi. Mühendislik sorunları mühendislik çözümleri gerektirir: otomasyon, hata bütçeleri, servis düzeyi hedefleri ve manuel işlerin yerini alan kod.^1

Bugün "AI Governance" benzer bir noktaya doğru ilerliyor.

Dünya genelinde kuruluşlar AI sistemleri için yönetişim yapıları kuruyor. Hukuk ekipleri düzenlemeleri yorumluyor ve uyum sorumluları politikalar yazıyor. Risk yöneticileri değerlendirme formları dolduruyor. Veri bilimcileri model performansını izliyor. Ama tüm bu çabalar departman siloları arasında parçalanmış durumda; mühendislik altyapısı yerine elektronik tablolar ve e-posta zincirleriyle birbirine bağlı.

IAPP AI Governance Profession Report 2025, 45 ülkeden 670'ten fazla profesyonelin katılımıyla hazırlandı ve kritik bir eksiklik tespit ediyor: teknik yetenek bol, ancak yönetişimi (*governance*), etiği ve uyumu (*compliance*) AI sistemlerinin teknik gerçeklikleriyle bütünleştirebilen profesyonel sayısı belirgin biçimde yetersiz.^2 Katılımcıların yüzde 33'ü profesyonel eğitim ve sertifika eksikliğini, yüzde 31'i ise nitelikli AI governance profesyoneli bulunamamasını temel engel olarak işaret ediyor.^2

Bu makale, eksik parçanın daha fazla politika ya da daha fazla uyum sorumlusu olmadığını öne sürmektedir. Gerçekleşmekte olan, yeni bir mühendislik disiplininin doğuşudur: AI Governance Engineering.

## Parçalanmış Bir Alan

Bu disiplinin bileşenleri zaten mevcut. Farklı topluluklar arasında, her biri kendi terminolojisi ve öncelikleriyle dağılmış durumda.

**Politika ve Yönetim Katmanı (*Policy & Management*).** En olgunlaşmış segment. IAPP gibi kuruluşlar sertifika programları (AIGP) oluşturdu, danışmanlık firmaları uyum değerlendirmeleri sunuyor, hukuk büroları düzenleyici yorumlama konusunda danışmanlık veriyor. EU AI Act, ISO/IEC 42001 ve NIST AI RMF düzenleyici çerçeveyi sağlıyor.^3 2025 itibarıyla Fortune 500 şirketlerinin yüzde 60'ından fazlası özel AI governance yapıları kurmuş durumda.^2 Bu katman şu soruyu yanıtlıyor: "Hangi kurallara uymalıyız?"

**Sistem Mühendisliği Katmanı (*Systems Engineering*).** Daha küçük ama büyüyen bir topluluk. David Marco, PhD liderliğindeki EWSolutions, "AI Governance Systems Engineering" terimini kullanıyor; governance prensiplerini girdileri, çıktıları, kontrolleri ve geri bildirim döngüleri olan çalışan mimarilere dönüştürme pratiğini tanımlıyor.^4 Politika dokümanlarının ötesine geçerek süreç tasarımına yöneliyor, ancak ağırlıklı olarak organizasyonel ve mimari düzeyde kalıyor. Bu katman şu soruyu yanıtlıyor: "Governance süreçleri nasıl tasarlanmalı?"

**Teknik Altyapı Katmanı (*Technical Infrastructure*).** En yeni ve en hızlı büyüyen segment. Yönetişimin kodla buluştuğu yer. Nisan 2026'da Microsoft, Agent Governance Toolkit'i yayınladı: AI ajanlar (*agents*) için milisaniyenin altında politika uygulama sağlayan, OWASP Agentic AI risklerinin tamamını adresleyen yedi paketlik açık kaynak bir sistem.^5 Şubat 2026'da Kyndryl, organizasyonel kuralları ve düzenleyici gereksinimleri makine tarafından okunabilir politikalara çeviren bir *policy-as-code* (politika-kod olarak) yeteneği duyurdu.^6 Aynı dönemde *Open Policy Agent* (OPA) ve Rego politika dili, zaten altyapı yönetişiminde endüstri standardı olan bu araçlar, AI'ya özel uygulamalara uyarlanmaya başladı.^7 Freeman Jackson'ın Kasım 2025 tarihli akademik makalesi ise otonom AI ajanları için çok katmanlı bir *policy-as-code* yönetişim mimarisi öneriyor.^8

Bu katman şu soruyu yanıtlıyor: "Yönetişimi doğrudan sisteme nasıl entegre ederiz?"

Buradaki kritik gözlem şu: bu üç katman aynı temel ihtiyacın olgunluk seviyelerini oluşturuyor. Kuruluşlar politikalarla başlıyor (Katman 1), etraflarına süreçler tasarlıyor (Katman 2) ve zaman içinde bunları teknik altyapılarına entegre ediyor (Katman 3). Ancak bugün bu üç katmanı bir bütün olarak kapsayan tanımlı bir disiplin yok.

## AI Governance Engineering Nedir?

AI Governance Engineering: düzenleyici gereksinimleri, etik ilkeleri ve kurumsal politikaları AI sistem yaşam döngülerine doğrudan gömülü, yürütülebilir, test edilebilir ve denetlenebilir teknik kontrollere çeviren mühendislik pratiği.

Bu tanım, AI governance yönetiminden (politika oluşturma ve kurumsal gözetim odaklı) ve AI governance sistem mühendisliğinden (süreç mimarisi ve organizasyonel tasarım odaklı) ayrışıyor. Üçü arasındaki fark en iyi somut bir örnekle anlaşılabilir.

**Gereksinim:** EU AI Act Madde 9, yüksek riskli AI sistemleri için risk yönetim sistemi zorunlu kılıyor.

**Governance Yönetimi (*Management*) yaklaşımı:** Uyum ekibi bir risk yönetim politikası dokümanı yazar ve risk değerlendirmeleri için bir Excel şablonu oluşturur. Her çeyrekte biri, değerlendirmelerin tamamlanıp tamamlanmadığını manuel olarak kontrol eder. Eksikse hatırlatma e-postası gönderir.

**Sistem Mühendisliği (*Systems Engineering*) yaklaşımı:** Bir governance mimarı, risk yönetim iş akışı tasarlar. Rolleri (değerlendirmeyi kim yapar), zamanlamayı (ne zaman yapılmalı), eskalasyon yollarını (süreler aşıldığında ne olur) tanımlar. Bunlar bir süreç haritasına dokümante edilir.

**Governance Engineering yaklaşımı:** Bir governance mühendisi *policy-as-code* kuralı yazar; örneğin OPA'nın Rego dilinde. Bu kural, bir model canlıya alınmak istendiğinde risk değerlendirmesinin var olup olmadığını ve güncel olup olmadığını otomatik olarak kontrol eder. Değerlendirme eksikse dağıtım (*deployment*) engellenir. Alınan her karar değişmez (*immutable*) bir yönetişim olayı olarak kaydedilir. AI sistemindeki değişiklikler, etkilenen adımların yeniden değerlendirilmesini otomatik tetikler.

Burada vurgulanması gereken bir nokta var: üçüncü yaklaşım ilk ikisine olan ihtiyacı ortadan kaldırmıyor. Politika dokümanları hâlâ insan karar alma süreçlerine rehberlik ediyor. Süreç tasarımları hâlâ ekipleri koordine ediyor. Mühendislik katmanı ise kritik kontrollerin tutarlı, otomatik ve tam izlenebilirlik (*traceability*) ile uygulanmasını sağlıyor; birinin tabloyu kontrol etmeyi hatırlayıp hatırlamamasından bağımsız olarak.

## İnsan Gözetimi Sorusu: Otomasyonun Sınırı Nerede?

Bu noktada meşru bir soru ortaya çıkıyor: governance'ı otomatikleştirmek, insanları karar sürecinden çıkarmak mı demek?

Hem düzenleme hem de sektör pratiği bu soruya net bir yanıt veriyor: "hayır".

EU AI Act Madde 14, yüksek riskli AI sistemlerinin "gerçek kişilerin işleyişini etkin biçimde denetleyebileceği şekilde" tasarlanmasını açıkça zorunlu kılıyor.^3 Bu bir tercih değil, yasal gereklilik. Moody's araştırması ise ankete katılan profesyonellerin yalnızca yaklaşık yüzde 5'inin tamamen otonom AI sistemleriyle rahat olduğunu gösteriyor.^12

Ancak "insan gözetimi", insan tarafından her aşamanın manuel olarak yapılması anlamına gelmemeli. IAPP'nin belirttiği gibi, çok yüzeysel, yavaş ya da AI karar zincirinden kopuk bir insan incelemesi anlamlı gözetim (*meaningful oversight*) sayılmıyor; düzenleyiciler bunu açıkça ifade etmeye başladı.^13

AI Governance Engineering kendini tam olarak bu dengenin tasarımına konumlandırıyor. Neyin otomatikleştirilmesi gerektiğini, nerede insan kararının vazgeçilmez olduğunu ve ikisi arasındaki geçiş noktalarını belirlemek, bu disiplinin temel sorumluluklarından biri:

**Otomatikleştirilebilecek alanlar:** Risk sınıflandırma kontrolleri, yanlılık (*bias*) test sonucu doğrulama, uyumsuz sistemler için dağıtım engelleme, denetim kaydı (*audit log*) oluşturma. Bunlar kural tabanlı, tekrar eden ve manuel yapıldığında insan hatasına açık işler.

**İnsan kararı gerektiren alanlar:** Yeni bir risk senaryosunun değerlendirilmesi, etik ikilemler, bağlam gerektiren kararlar. Burada otomasyonun rolü karar vermek değil, karar vericiye doğru bilgiyi doğru zamanda sunmaktır. Örneğin bir model kayması (*drift*) uyarısı tetiklendiğinde, sistem neyin değiştiğini ve olası etkisini otomatik derler; ama kararı insana bırakır.

**Geçiş noktalarının tasarımı:** Hangi kararlar tamamen otomatik, hangileri insan onaylı, hangileri tamamen insana ait? Bu sınırları tanımlamak, AI Governance Engineer'ın temel odak noktalarındandır.

Kısacası, AI Governance Engineering yönetişimi otomasyona devretmek değil; yönetişim sürecini mühendislik prensipleriyle güçlendirmektir. Teknolojideki hızlı ilerleme, AI governance sürecini daha teknik ele almamızı zorunlu hale getirmektedir.

## Dört Katmanlı Yetkinlik Modeli

Bu disiplin hangi yetkinlikleri gerektiriyor? Mevcut alan haritası, düzenleyici çerçeveler ve teknik altyapı analizine dayanarak dört katmanlı bir model önerilebilir.

### Katman 1: Mevzuat Mühendisliği (*Regulatory Engineering*)

Yasal ve düzenleyici metni teknik gereksinimlere çevirebilme yetkinliği.

Bu, yasayı okumaktan öte bir beceri: düzenleyici yükümlülükleri uygulanabilir teknik spesifikasyonlara ayrıştırabilmeyi gerektirir. Örneğin EU AI Act Madde 9 sadece "risk yönetimi yapın" demekle kalmaz. Sürekli yinelemeli süreçleri, bilinen ve öngörülebilir risklerin tanımlanmasını, amaçlanan kullanım ile öngörülebilir yanlış kullanımdan kaynaklanan risklerin tahminini, ve pazar sonrası izleme (*post-market monitoring*) verilerinin analizini spesifik olarak belirtir.^3

Yetkinlik, bu yasal kavramları mühendislik diline çevirmekte: hangi verinin toplanacağı, hangi eşiklerin belirleneceği, hangi izleme sinyallerinin takip edileceği. Bu, hem düzenleyici dilde hem de teknik sistemlerde akıcılık gerektiriyor; IAPP raporunun eksikliğini vurguladığı tam da bu kombinasyon.^2

### Katman 2: Teknik Altyapı (*Technical Infrastructure*)

*Policy-as-code* (koda dönüştürülmüş politika), izleme (*monitoring*) ve otomasyon araçlarıyla governance kontrollerini uygulayabilme yetkinliği.

Bu, uygulamalı mühendislik katmanı. OPA/Rego ile çalışma zamanında (*runtime*) governance kuralları yazabilme; Evidently AI, Langfuse, AIF360 gibi araçlarla ML gözlemlenebilirlik (*observability*) hatları kurabilme; CI/CD sürecine governance kapıları (*gates*) ekleyebilme; değişmez denetim izleri (*immutable audit trails*) uygulayabilme.^7 ^10 ^11

Bu, AI Governance Engineer'ın tam donanımlı bir yazılım mühendisi olması gerektiği anlamına gelmiyor. Ama bu araçları yapılandırma, kural setlerini okuma ve mevcut geliştirme süreçlerine governance kontrol noktaları entegre etme konusunda yetkin olması anlamına geliyor.

### Katman 3: Operasyonel Tasarım (*Operational Design*)

Governance süreçleri, olay müdahale (*incident response*) planları ve ekipler arası (*cross-functional*) koordinasyon mekanizmaları tasarlayabilme yetkinliği.

Cumartesi sabahı saat 2'de yanlılık testinden kalan bir AI sistemi, otomatik bir uyarıdan daha fazlasını gerektirir. Birinin ne yapacağını, kimi bilgilendireceğini, etkiyi nasıl değerlendireceğini bilmesi gerekir. AI Governance Engineer bu operasyonel iş akışlarını tasarlar; soyut süreç haritaları olarak değil, teknik altyapıyla bütünleşik çalışma kılavuzları (*runbooks*) olarak.

Burada önemli bir ayrım var: AI Governance Engineer hukukçunun, veri bilimcinin veya güvenlik uzmanının yerini almıyor. AI Governance Engineer'ın rolü bir orkestratör olmak: hukukçunun tanımladığı yükümlülüğün teknik kontrole, teknik kontrolün izleme uyarısına, uyarının olay müdahale prosedürüne sorunsuz akmasını sağlamak. Parçaları birleştiren, aralarındaki geçişleri tasarlayan kişi.

### Katman 4: Stratejik Öngörü (*Strategic Foresight*)

AI governance gereksinimlerinin evrimini öngörebilme ve bugünkü sistemleri yarına hazırlayabilme yetkinliği.

AI governance durağan bir alan değil ve evrimi hızla devam etmektedir. Bugün çoğu kuruluş manuel süreçler, danışman odaklı değerlendirmeler ve şablon tabanlı dokümantasyonla çalışıyor. Ancak sektördeki gelişmeler, yönetişimin giderek yazılım geliştirme süreçlerine (CI/CD) gömüleceğine, *compliance-as-code* (uyum-kod olarak) yaklaşımının yaygınlaşacağına ve sistem değişikliklerinde otomatik yeniden değerlendirmenin norm haline geleceğine işaret ediyor.

Daha ileriye baktığımızda, AI ajanların daha otonom hale gelmesiyle birlikte yönetişim mekanizmalarının da daha otonom unsurlar içermesi gerekebilir. Microsoft'un Agent Governance Toolkit'i ve Kyndryl'in politika yönetimli iş akışları bu yöndeki ilk somut adımlar.^5 ^6

Bu yetkinlik katmanının özü şu: bugün kurulan her governance kontrolünün, yarının değişen gereksinimlerine uyarlanabilir olmasını sağlamak. Stratejik öngörü, kesin tahminler yapmak değil; esnekliği tasarıma yerleştirmektir.

## Pratikte Ne Anlama Geliyor?

Buraya kadar anlattıklarımız bir çerçeve. Peki bu çerçeve bugün pratikte ne ifade ediyor?

Açıkçası, AI Governance Engineering'in tüm katmanlarını tek başına uygulayabilen bir profesyonel profili henüz yaygın değil. Bu, disiplinin henüz oluşmakta olmasının doğal sonucu. SRE de ilk yıllarında böyleydi; Google'ın ilk SRE ekipleri mevcut yazılım mühendislerinden oluşuyordu, disiplin zaman içinde netleşti.

Bugün için somut olan şu: bu disiplinin bileşenleri artık mevcut. OPA, Evidently, Langfuse, Microsoft Agent Governance Toolkit gibi araçlar üretim düzeyinde ve açık kaynak.^5 ^7 ^10 ^11 Düzenleyici çerçeveler (EU AI Act, ISO 42001) teknik gereksinimleri giderek daha spesifik tanımlıyor.^3 Ve en önemlisi, IAPP raporunun işaret ettiği yetenek açığı büyümeye devam ediyor; yönetişim ile mühendisliği birleştirebilen profesyonel talebi artıyor.^2

Bu tabloda üç kitleye doğrudan mesaj vermek mümkün:

**AI sistemleri konuşlandıran kuruluşları:** Soru, yönetişime ihtiyacınız olup olmadığı değil; düzenleme bunu zaten zorunlu kılıyor. Soru, yönetişiminizin AI sistemi sayısıyla doğrusal ölçeklenen bir manuel yük mü, yoksa verimli ölçeklenen bir mühendislik yetkinliği mi olacağı.

**Governance profesyonelleri:** Teknik okuryazarlık (derin kodlama becerisi değil, ama *policy-as-code* araçlarını, izleme platformlarını ve CI/CD kavramlarını anlayabilme) bu alanda kariyer ilerlemesi için giderek daha belirleyici unsur haline geliyor.

**Eğitimciler ve sertifika kuruluşları:** Dört katmanlı yetkinlik modeli doğal bir müfredat yapısı sunuyor. Mevzuat Mühendisliği mevcut hukuk eğitimi üzerine inşa ediliyor. Teknik Altyapı uygulamalı laboratuvar çalışması gerektiriyor. Operasyonel Tasarım olay yönetimi geleneklerinden besleniyor. Stratejik Öngörü trend analizi ve senaryo planlamasını bütünleştiriyor. Bugün böyle entegre bir müfredat mevcut değil.

## Sonuç: Disiplini Adlandırmak

AI Governance Engineering'in bileşenleri yeni değil. Düzenleyici çerçeveler var. *Policy-as-code* araçları ve ML izleme platformları, süreç tasarımı metodolojileri var. Henüz eksik olan, bu bileşenlerin bir arada tutarlı bir mühendislik pratiği oluşturduğunun fark edilmesi.

Google SRE'yi adlandırdığında sunucu operasyonlarını icat etmedi. Güvenilirliğin bir mühendislik sorunu olduğunu fark etti ve bu içgörü etrafında bir disiplin organize etti.

Benzer bir farkındalık AI governance süreci içinde kapımızı çalmaktadır: ölçekte çalışan, karmaşık düzenleyici gereksinimler altında, yüksek riskli ortamlarda faaliyet gösteren AI sistemleri için yönetişim de bir mühendislik sorunudur. Ve bu sorun, parça parça değil, bütünsel bir mühendislik yaklaşımıyla ele alınmalıdır.

---

## Kaynaklar

1. Beyer, B., Jones, C., Petoff, J. ve Murphy, N.R. *Site Reliability Engineering: How Google Runs Production Systems*. O'Reilly Media, 2016. [sre.google](https://sre.google/sre-book/table-of-contents/)

2. IAPP ve Credo AI. *AI Governance Profession Report 2025*. International Association of Privacy Professionals. [iapp.org](https://iapp.org/resources/article/ai-governance-profession-report)

3. Avrupa Parlamentosu ve Konseyi. *Regulation (EU) 2024/1689, Artificial Intelligence Act*. EUR-Lex, 12 Temmuz 2024. [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)

4. EWSolutions. *AI Governance Systems Engineering: The Executive Playbook for Responsible AI*. [ewsolutions.com](https://www.ewsolutions.com/ai-governance-systems-engineering/)

5. Microsoft. *Introducing the Agent Governance Toolkit: Open-source runtime security for AI agents*. Microsoft Open Source Blog, 2 Nisan 2026. [opensource.microsoft.com](https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit-open-source-runtime-security-for-ai-agents/)

6. Kyndryl. *Kyndryl Introduces Policy-Governed Agentic AI*. 11 Şubat 2026. [kyndryl.com](https://www.kyndryl.com/us/en/about-us/news/2026/02/policy-as-code-agentic-ai-governance)

7. Open Policy Agent. *Policy Language, Rego*. [openpolicyagent.org](https://www.openpolicyagent.org/docs/policy-language)

8. Jackson, F. *Governing Autonomous AI Agents with Policy-as-Code: A Multi-Layer Architecture for Risk, Compliance, and Zero-Trust Control*. SSRN, Kasım 2025. [ssrn.com](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5820262)

9. NexaStack. *Agent Governance at Scale: Policy-as-Code Approaches in Action*. [nexastack.ai](https://www.nexastack.ai/blog/agent-governance-at-scale)

10. Evidently AI. *Open-source ML and LLM observability*. [docs.evidentlyai.com](https://docs.evidentlyai.com)

11. Langfuse. *Open-source LLM engineering platform*. [langfuse.com](https://langfuse.com)

12. Moody's. *Human in the Loop: Why Human Oversight Still Matters in AI-Driven Risk and Compliance*. [moodys.com](https://www.moodys.com/web/en/us/insights/ai/human-in-the-loop-why-human-oversight-still-matters-in-ai-driven-risk-and-compliance.html)

13. IAPP. *'Human in the Loop' in AI Risk Management, Not a Cure-All Approach*. [iapp.org](https://iapp.org/news/a/-human-in-the-loop-in-ai-risk-management-not-a-cure-all-approach)

14. Axial Search. *Market Analysis of 146 AI Governance Job Postings*. [axialsearch.com](https://axialsearch.com/insights/ai-governance-jobs/)

---

*Ozden Coskun, Hexis kurucusudur. ISO/IEC 42001:2023 sertifikasına sahiptir ve IAPP üyesidir. Hexis, AI governance değerlendirmesi için ORIENT metodolojisini geliştirmekte ve [hexis.center](https://hexis.center) üzerinden governance araçları inşa etmektedir.*
