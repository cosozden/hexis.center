# Skills Source — Hexis Plugin Skill'lerinin Git Source-of-Truth'u

Bu klasör, **Hexis-spesifik Cowork skill'lerinin kaynak kopyalarını** version control altında tutar.

## Neden bu klasör var

Cowork plugin skill'leri (`creatorType: "user"`) Anthropic'in cloud'unda (Claude.ai UI) yönetilir. Plugin yüklendiğinde local cache'e (`/var/folders/.../claude-hostloop-plugins/`) kopyalanır. Local cache **kalıcı değildir** — plugin sync ile üzerine yazılır.

Bu nedenle:
- **Kalıcı kaynak:** Bu klasör (git'te version'lanır)
- **Cloud kopyası:** Claude.ai/Cowork UI (skill editor)
- **Local cache:** `/var/folders/td/.../claude-hostloop-plugins/c110e299d600411c/skills/`

## Senkronizasyon protokolü

Bir skill'i güncellerken **iki adım**:

1. **Bu klasörde dosyayı güncelle** → git commit
2. **Claude.ai UI → Skills → ilgili skill → editor'e yapıştır → kaydet**

Bu sırayı tersine çevirme — eğer önce UI'den güncellersen ve git'e yansıtmayı unutursan, sonraki değişiklikte conflict olur.

## Skill envanteri

Bu klasördeki skill'ler `manifest.json`'da `creatorType: "user"` olarak işaretlidir:

| Skill | Klasör | Cloud skill ID | Sorumlu alan |
|-------|--------|----------------|--------------|
| hexis-blog-formatter | `hexis-blog-formatter/` | `skill_01BvkdK6VJpR2R2AUSQiTkcZ` | Blog draft → markdown formatlama |
| hexis-qa-protocol | `hexis-qa-protocol/` | `skill_01WJaN5cQjhxGnyrzQrz9a3u` | 3 fazlı kalite güvence |
| hexis-newsletter | `hexis-newsletter/` | `skill_015F3QjT73bFACo8khT8HJbu` | Bülten taslağı |
| hexis-saas-builder | `hexis-saas-builder/` | `skill_01Kv2XRn5Fd1fMAqC7u163Ts` | app.hexis.center geliştirme |
| hexis-dijital-gelir | `hexis-dijital-gelir/` | `skill_01XrhNUvAKgZSqZX9NPGKgUF` | Strateji yönetimi |
| hexis-linkedin-content | `hexis-linkedin-content/` | `skill_016sUsNnEGLp8wzidC6aVmRx` | LinkedIn içerik |
| hexis-site-deploy | `hexis-site-deploy/` | `skill_01TjjE7zLL8DsWNPQ1hc7sr6` | Deploy iş akışı |
| yasal-altyapi-ustaligi | `yasal-altyapi-ustaligi/` | `skill_01G8fX6iJZVPo7DG5P9EwM25` | EU AI Act + KVKK uzmanlık |
| aigp-hexis-study | `aigp-hexis-study/` | `skill_015YemUeiXM9fX6rh9TkcWys` | AIGP sertifika çalışması |

**Anthropic-managed skill'ler** (`creatorType: "anthropic"`) bu klasöre dahil edilmez — onların kaynağı Anthropic'in kendi reposundadır.

## İlk doldurulma — 8 May 2026

Bu klasör 8 Mayıs 2026'da blog kanibalizasyon denetimi sonrasında kuruldu. Tetikleyici: KVKK Etken Yapay Zekâ blog yazılarında bulunan üç hata (anchor literal bug, tarih hatası, title↔H1 uyumsuzluğu) — bu hatalar QA protokolünün boşluklarından geçti, ve kalıcı düzeltmeler için skill kaynaklarına ulaşılamadı.

İlk eklenen skill'ler: `hexis-blog-formatter`, `hexis-qa-protocol` (sistemik düzeltmeler için zorunlu).

Diğer skill'ler ihtiyaç duyuldukça eklenecek — `manifest.json` listesi referans alınmalı.
