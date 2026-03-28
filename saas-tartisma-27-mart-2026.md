# Hexis SaaS — Bütünsel Tartışma Dokümanı

**Tarih:** 27 Mart 2026
**Bağlam:** MVP planlama + Claude ekosistemi entegrasyonu + öğrenme yolculuğu
**Durum:** Tartışma taslağı — karar bekliyor

---

## A. MEVCUT PLANIN ELEŞTİREL ANALİZİ

### Güçlü Yanlar

1. **Vizyon netliği:** "TurboTax for AI compliance" analojisi çok doğru pozisyonlama. KOBİ self-serve segmentinde gerçek bir boşluk var.
2. **Mevcut varlıklar:** hexis.center'daki sınıflandırıcı, matrix ve checklist zaten çalışıyor — sıfırdan başlamıyoruz.
3. **ORIENT metodolojisi:** Özgün fikri mülkiyet. Rakiplerin hiçbirinde yapılandırılmış bir metodoloji yok.
4. **Zamanlama:** Ağustos 2026 Annex III deadline'ı aciliyet yaratıyor. Pazar hazır.
5. **Gelir modeli:** Şablonlar + SaaS ikili yapısı birbirini besliyor.

### Riskler ve Endişeler

1. **Kapsam büyüklüğü:** 10 haftalık plan, tek kişilik bir ekip için agresif. 6 adımlı tam akış + auth + ödeme + PDF + e-posta + onboarding. Gerçekçi mi?

2. **"Her şeyi birden" yaklaşımı:** Planın 6 adımın tamamını MVP'ye dahil etmesi tehlikeli. "MVP kapsam şişmesi" riski bizzat dokümanda belirtilmiş ama çözüm sunulmamış.

3. **Claude entegrasyonu yüzeysel kalıyor:** 2 noktada basit prompt → yanıt. Bu, Claude'un gerçek gücünün %5'i. Ürünün AI-powered olma iddiasını karşılamıyor.

4. **Rakip hareketliliği:** Credo AI, Holistic AI, OneTrust, Vanta gibi oyuncular enterprise'da güçlü. KOBİ segmentinde henüz doğrudan rakip az, ama pencere kapanıyor.

5. **Tek founder riski:** Geliştirme + içerik + destek + pazarlama. Sürdürülebilir mi?

---

## B. ZAMANLAMA: İKİ SENARYO

### Senaryo 1: Mevcut Plan (10 Hafta, Tam 6 Adım)

```
Hafta 1-2:   Altyapı (Next.js + Supabase + Auth + Ödeme)
Hafta 3-4:   Adım 1 (Envanter) + Adım 2 (Sınıflandırıcı)
Hafta 5-6:   Adım 3 (Yükümlülükler) + Adım 4 (Matrix)
Hafta 7-8:   Adım 5 (Aksiyon Planı) + Adım 6 (Dashboard)
Hafta 9-10:  Polish + Launch
```

**Lansman:** ~6 Haziran 2026
**Ağustos'a kalan:** 2 ay (iterasyon + pazarlama)

**Risk:** Her sprint'te 2 hafta → 2 büyük özellik. Tek kişi için çok sıkı. Bir sprint kayarsa domino etkisi.

### Senaryo 2: Daraltılmış MVP (6 Hafta, Çekirdek 3 Adım)

**Temel fikir:** İlk 3 adım (Observe → Risk → Identify) tek başına değer üretir. Kullanıcı AI sistemini kaydeder, riskini öğrenir, yapılacaklarını görür. Bu bile pazardaki hiçbir KOBİ aracında yok.

```
Hafta 1-2:   Altyapı (Next.js + Supabase + Auth + basit ödeme)
Hafta 3-4:   Adım 1 (Envanter) + Adım 2 (Sınıflandırıcı + Claude AI insight)
Hafta 5-6:   Adım 3 (Yükümlülükler + rehberler) + Polish + Launch
```

**Lansman:** ~8 Mayıs 2026
**Ağustos'a kalan:** 3 ay (Adım 4-5-6 iteratif eklenir + pazarlama)

**Avantaj:**
- Daha erken lansman → daha erken gerçek kullanıcı geri bildirimi
- Adım 4-5-6 kullanıcı talebiyle şekillenir (data-driven)
- Deadline baskısı azalır
- Claude entegrasyonuna daha fazla zaman ayrılır

**Risk:** İlk ürün "eksik" hissedebilir. Ama "3 adımda AI uyumunuza başlayın" mesajı yeterince güçlü.

### ÖNERİM: Senaryo 2 + Claude Derinliği

Daraltılmış MVP, Claude entegrasyonunu derinleştirmek için zaman kazandırır. Ve ironik olarak, daha derin Claude entegrasyonu ürünü daha değerli kılar — yani daha az özellik + daha derin AI = daha güçlü MVP.

---

## C. CLAUDE EKOSİSTEMİ: YÜZEYDEN DERİNE

### Mevcut Plandaki Claude Kullanımı (Seviye 1)

```
Kullanıcı girdi → POST /api/ai → Claude Haiku → 150 kelime yanıt → Ekranda göster
```

Bu temel bir API çağrısı. Herhangi bir LLM ile yapılabilir. Claude'a özgü bir avantaj yok.

### Claude'un Gerçek Güçleri ve Ürüne Entegrasyon Fırsatları

#### Seviye 2: Structured Output + Tool Use

**Ne:** Claude'a sadece metin değil, yapılandırılmış JSON çıktı ürettirmek. Tool use ile Claude'un kendi kendine karar vermesi.

**Ürüne etkisi:** Sınıflandırıcı wizard'ı Claude ile güçlendirmek. Kullanıcı serbest metin olarak AI sistemini tanımlıyor → Claude structured output ile risk seviyesi, ilgili maddeler, yükümlülük listesi döndürüyor. Wizard'ın deterministik kurallarını Claude'un bağlamsal zekasıyla zenginleştirmek.

```typescript
// Örnek: Structured output ile risk sınıflandırma
const response = await anthropic.messages.create({
  model: 'claude-haiku-4-5-20251001',
  tools: [{
    name: 'classify_risk',
    input_schema: {
      type: 'object',
      properties: {
        risk_level: { enum: ['prohibited', 'high', 'limited', 'gpai', 'minimal'] },
        confidence: { type: 'number' },
        article_references: { type: 'array', items: { type: 'string' } },
        key_obligations: { type: 'array', items: { type: 'string' } },
        reasoning: { type: 'string' }
      }
    }
  }],
  tool_choice: { type: 'tool', name: 'classify_risk' },
  messages: [{ role: 'user', content: systemDescription }]
});
```

**Öğrenme değeri:** Tool use pattern'ı — Claude ekosisteminin en güçlü özelliklerinden biri.

#### Seviye 3: Multi-turn Conversation (Compliance Advisor)

**Ne:** Tek seferlik prompt→yanıt yerine, kullanıcıyla çok turlu konuşma. Claude önceki bağlamı hatırlayarak giderek daha spesifik rehberlik verir.

**Ürüne etkisi:** Her AI sistemi için bir "Compliance Advisor" chat penceresi. Kullanıcı sorular sorar: "FRIA raporunu nasıl yazarım?", "Bu veri türü kişisel veri sayılır mı?", "Deadline'a kadar ne yapmalıyım?" Claude, o sistemin verilerini (risk seviyesi, yükümlülükler, maturity) bağlam olarak kullanarak cevaplar.

**Öğrenme değeri:** System prompt engineering, context window yönetimi, conversation memory.

**Maliyet etkisi:** Multi-turn daha pahalı. Ama Pro katmanında (€29/ay) kullanıcı başına €2-3/ay bile olsa marjinal.

#### Seviye 4: MCP Server (Hexis Governance Protocol)

**Ne:** Model Context Protocol — Claude'un dış sistemlere bağlanması için standart protokol. Hexis'in kendi MCP server'ı olabilir.

**Ürüne etkisi:** Kullanıcılar Claude Desktop veya Claude Code üzerinden Hexis verilerine erişebilir. "Show me my compliance status" → Claude, Hexis MCP server'ı üzerinden Supabase'den veri çeker, analiz eder, rapor verir.

**Stratejik değer:** Bu, Hexis'i sadece bir web app'ten "Claude ekosisteminin bir parçası" haline getirir. Anthropic'in MCP marketplace'inde görünürlük. Erken hareket avantajı — AI governance MCP server'ı henüz yok.

**Öğrenme değeri:** MCP server geliştirme — Claude mimarı olmak için kritik bir yetkinlik.

#### Seviye 5: Agent SDK (Governance Agent)

**Ne:** Claude Agent SDK ile otonom agent'lar oluşturmak. Agent dosya okuyabilir, komut çalıştırabilir, web araması yapabilir, alt-agent'lar spawn edebilir.

**Ürüne etkisi (gelecek):** "Compliance Audit Agent" — kullanıcının kod reposunu tarar, AI kullanımlarını tespit eder, risk sınıflandırmasını otomatik yapar, eksik dokümantasyonu belirler. Bu henüz MVP'nin çok ötesinde, ama mimari olarak kapıyı açık tutmak önemli.

**Öğrenme değeri:** Agent mimarisi — Claude ekosisteminin en ileri seviyesi.

### Entegrasyon Yol Haritası

| Faz | Claude Seviyesi | MVP'de mi? | Öğrenme Hedefi |
|-----|----------------|------------|----------------|
| Faz 1 | Structured Output + Tool Use | ✅ Evet | Tool use pattern, JSON schema design |
| Faz 2 | Multi-turn Advisor | ✅ Evet (basit) | System prompt eng., context management |
| Faz 3 | MCP Server | ⏳ Lansman sonrası | MCP protocol, server geliştirme |
| Faz 4 | Agent SDK | 🔮 Gelecek | Agent mimarisi, subagent orchestration |

---

## D. REVİZE EDİLMİŞ MVP ÖNERİSİ

### Çekirdek MVP (6 hafta → 8 Mayıs lansman)

**Adım 1 — Observe:** AI Sistem Envanteri
- Form + kart listesi + CRUD
- Serbest metin "purpose" alanı (Claude'un input'u)

**Adım 2 — Risk:** Sınıflandırıcı Wizard + AI Insight
- Mevcut hexis.center karar ağacı → TypeScript
- Claude Structured Output: wizard sonucu + purpose → detaylı analiz
- Tool use ile: risk seviyesi, ilgili maddeler, öncelikli yükümlülükler JSON olarak

**Adım 3 — Identify:** Yükümlülük Kontrol Listesi + AI Rehber
- Risk seviyesine göre otomatik yükümlülük listesi
- Her yükümlülükte "Nasıl yapılır?" butonu → Claude multi-turn mini advisor
- Checklist ilerleme takibi
- İndirilebilir şablonlar (Starter Kit'ten)

**Yatay Özellikler:**
- Auth (Supabase email + password)
- Basit ödeme (Stripe Checkout, tek plan: €29/ay, ilk ay €9)
- Dashboard (sistem listesi + genel ilerleme yüzdesi)
- PDF: Sistem kartı + risk raporu (basit, 1-2 sayfa)

### Lansman Sonrası (Haziran-Temmuz, Ağustos'a kadar)

- Adım 4 (Evaluate): Governance Matrix + Claude insight
- Adım 5 (Navigate): Aksiyon planı + Kanban
- MCP Server v1 (Claude Desktop entegrasyonu)
- Adım 6 (Track): Dashboard + uyum skoru + PDF rapor (detaylı)

### Bu Yaklaşımın Avantajları

1. **Daha erken lansman:** 8 Mayıs vs 6 Haziran — 1 ay kazanç
2. **Daha derin AI:** 2 yüzeysel prompt yerine structured output + tool use + mini advisor
3. **Gerçek diferansiasyon:** "AI-powered compliance" iddiası somutlaşıyor
4. **Öğrenme yoğunluğu:** İlk 6 haftada tool use + structured output + multi-turn — Claude mimarı yolculuğunun temeli
5. **Kullanıcı odaklı büyüme:** Adım 4-5-6 gerçek kullanıcı geri bildirimiyle şekillenir

---

## E. CLAUDE MİMARİ ÖĞRENME YOLCULUĞU

Bu projeyi bir "Claude Architect Bootcamp" olarak da düşünebiliriz:

### Hafta 1-2: Temel (Altyapı Sprint'i)
- **Claude öğrenme:** API authentication, rate limiting, error handling
- **Pratik:** `/api/ai/` route'larının iskeletini kurmak
- **Çıktı:** Çalışan bir Claude API wrapper (lib/claude.ts)

### Hafta 3-4: Tool Use + Structured Output (Sınıflandırıcı Sprint'i)
- **Claude öğrenme:** Tool definitions, JSON schema, tool_choice, structured responses
- **Pratik:** Sınıflandırıcı wizard'ın Claude ile zenginleştirilmesi
- **Çıktı:** classify_risk tool + getClassificationInsight (structured)

### Hafta 5-6: Multi-turn + System Prompts (Yükümlülükler Sprint'i)
- **Claude öğrenme:** System prompt engineering, conversation memory, context window optimization
- **Pratik:** Her yükümlülük için "nasıl yapılır" mini advisor
- **Çıktı:** Compliance advisor chat component + system prompt library

### Hafta 7-8 (Lansman sonrası): MCP Fundamentals
- **Claude öğrenme:** MCP protocol, server/client architecture, tool registration
- **Pratik:** Hexis MCP server prototipi (read-only: compliance status, system list)
- **Çıktı:** Çalışan MCP server + Claude Desktop'ta demo

### Hafta 9-12 (Lansman sonrası): Agent Patterns
- **Claude öğrenme:** Agent SDK, subagents, hooks, sessions, permission model
- **Pratik:** Basit audit agent prototipi (belge tarama + eksik tespit)
- **Çıktı:** Agent SDK deneyimi + gelecek ürün vizyonu

---

## F. TARTIŞMA SORULARI

### 1. MVP Kapsamı
Daraltılmış MVP (3 adım + derin Claude) mı, yoksa tam 6 adım (yüzeysel Claude) mı?

### 2. Claude Derinliği
Multi-turn advisor MVP'de olmalı mı, yoksa lansman sonrasına mı kalmalı? (Karmaşıklık vs değer)

### 3. Fiyatlama
€29/ay tek plan mı, yoksa €19/ay temel + €39/ay AI-powered gibi AI özelliklerini farklılaştıran 2 katman mı?

### 4. MCP Stratejisi
MCP server'ı ne zaman geliştirmeliyiz? Erken MCP = Anthropic ekosisteminde görünürlük. Geç MCP = önce ürün olgunlaşsın.

### 5. Şablon Kitleri Zamanlaması
SaaS geliştirmeye başlamadan önce şablon kitlerini LemonSqueezy'de satışa açmalı mıyız? (İlk gelir + pazar testi)

### 6. Öğrenme vs Hız Dengesi
Claude mimarı olma hedefi ile "Ağustos'a kadar lansman" hedefi çatışıyor mu? Yoksa birbirini besliyor mu?

---

*Bu doküman, 27 Mart 2026 tarihli tartışma oturumu için hazırlanmıştır. Kararlar bu dosyada veya dijital-gelir-modeli-kararlar.md'de güncellenecektir.*
